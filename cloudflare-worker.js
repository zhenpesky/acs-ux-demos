/**
 * RHACS Comments Auth + Guest Post Worker
 *
 * Handles two request types (both via POST /):
 *   1. OAuth code exchange  – body: { code }
 *   2. Guest comment post   – body: { type: "guest_post", pageKey, pageUrl, commentBody, owner, repo, categoryName }
 *
 * Required Cloudflare Worker secrets:
 *   GITHUB_CLIENT_SECRET  – your GitHub OAuth App client secret
 *   GITHUB_OWNER_TOKEN    – a PAT for the repo owner with public_repo scope
 *                           (used to post guest comments and create discussions)
 *
 * Optional secret (falls back to hardcoded below):
 *   GITHUB_CLIENT_ID      – your GitHub OAuth App client ID
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResp(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

async function ghGraphQL(token, query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'rhacs-comments-worker/1.0',
    },
    body: JSON.stringify({ query, variables: variables || {} }),
  });
  return res.json();
}

// ── OAuth code exchange ───────────────────────────────────────────────────────
async function handleOAuth(body, env) {
  if (!body.code) return jsonResp(400, { error: 'Missing code' });

  const clientId = env.GITHUB_CLIENT_ID || 'Ov23liDWQDQiOy5Yd1Kc';
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: body.code,
    }),
  });
  const data = await res.json();
  return jsonResp(res.status, data);
}

// ── Guest comment post ────────────────────────────────────────────────────────
async function handleGuestPost(body, env) {
  if (!env.GITHUB_OWNER_TOKEN) {
    return jsonResp(503, { error: 'GITHUB_OWNER_TOKEN not configured — guest comments unavailable' });
  }

  const { pageKey, pageUrl, commentBody, owner, repo, categoryName } = body;
  if (!pageKey || !commentBody || !owner || !repo) {
    return jsonResp(400, { error: 'Missing required fields: pageKey, commentBody, owner, repo' });
  }

  const catName = categoryName || 'General';
  const token = env.GITHUB_OWNER_TOKEN;

  // 1. Fetch repo ID + category ID
  const metaRes = await ghGraphQL(token,
    `query { repository(owner:"${owner}",name:"${repo}") { id discussionCategories(first:25){ nodes { id name } } } }`
  );
  const repoNode = metaRes && metaRes.data && metaRes.data.repository;
  if (!repoNode) return jsonResp(500, { error: 'Could not load repo metadata' });

  const repoId = repoNode.id;
  const cat = repoNode.discussionCategories.nodes.find(function (n) { return n.name === catName; });
  if (!cat) return jsonResp(500, { error: `Discussion category "${catName}" not found. Create it in GitHub Discussions first.` });
  const categoryId = cat.id;

  // 2. Find existing discussion for this page key
  const discRes = await ghGraphQL(token,
    'query($o:String!,$r:String!,$c:ID!){ repository(owner:$o,name:$r){ discussions(first:100,categoryId:$c){ nodes{ id title } } } }',
    { o: owner, r: repo, c: categoryId }
  );
  const discussions = (discRes && discRes.data && discRes.data.repository && discRes.data.repository.discussions && discRes.data.repository.discussions.nodes) || [];
  let discussionId = null;
  for (var i = 0; i < discussions.length; i++) {
    if (discussions[i].title === pageKey) { discussionId = discussions[i].id; break; }
  }

  // 3. Create discussion if not found
  if (!discussionId) {
    const createRes = await ghGraphQL(token,
      'mutation($r:ID!,$c:ID!,$t:String!,$b:String!){ createDiscussion(input:{repositoryId:$r,categoryId:$c,title:$t,body:$b}){ discussion{ id } } }',
      { r: repoId, c: categoryId, t: pageKey, b: 'Auto-created for ' + (pageUrl || pageKey) }
    );
    discussionId = createRes && createRes.data && createRes.data.createDiscussion && createRes.data.createDiscussion.discussion && createRes.data.createDiscussion.discussion.id;
    if (!discussionId) return jsonResp(500, { error: 'Could not create GitHub Discussion' });
  }

  // 4. Post the comment
  const commentRes = await ghGraphQL(token,
    'mutation($d:ID!,$b:String!){ addDiscussionComment(input:{discussionId:$d,body:$b}){ comment{ id createdAt } } }',
    { d: discussionId, b: commentBody }
  );
  const comment = commentRes && commentRes.data && commentRes.data.addDiscussionComment && commentRes.data.addDiscussionComment.comment;
  if (!comment) return jsonResp(500, { error: 'Could not post comment to Discussion' });

  return jsonResp(200, { id: comment.id, createdAt: comment.createdAt, discussionId });
}

// ── Entry point ───────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    if (request.method !== 'POST') {
      return jsonResp(405, { error: 'Method not allowed' });
    }

    let body;
    try { body = await request.json(); } catch (e) {
      return jsonResp(400, { error: 'Invalid JSON body' });
    }

    if (body.type === 'guest_post') {
      return handleGuestPost(body, env);
    }

    return handleOAuth(body, env);
  },
};
