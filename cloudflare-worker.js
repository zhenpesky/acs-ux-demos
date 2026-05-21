/**
 * RHACS Prototype Comments — Cloudflare Worker
 *
 * Handles the GitHub OAuth token exchange so the client_secret
 * never appears in any browser-side code.
 *
 * HOW TO DEPLOY:
 *  1. Go to your Cloudflare Worker "rhacs-comments-auth"
 *  2. Click Edit code → replace the default Hello World with this entire file
 *  3. Click Deploy
 *  4. Under Settings → Variables and Secrets, add:
 *       GITHUB_CLIENT_ID     = Ov23liDWQDQiOy5Yd1Kc   (type: Secret)
 *       GITHUB_CLIENT_SECRET = <your client secret>     (type: Secret)
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response('', { status: 204, headers: cors() });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    let code;
    try {
      const body = await request.json();
      code = body.code;
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    if (!code) {
      return json({ error: 'Missing code parameter' }, 400);
    }

    try {
      const ghRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const ghData = await ghRes.json();

      if (ghData.error) {
        return json({ error: ghData.error_description || ghData.error }, 400);
      }

      if (!ghData.access_token) {
        return json({ error: 'No access token returned' }, 400);
      }

      return json({ token: ghData.access_token }, 200);
    } catch (e) {
      return json({ error: 'GitHub request failed: ' + e.message }, 500);
    }
  },
};

function cors() {
  return {
    'Access-Control-Allow-Origin': 'https://zhenpesky.github.io',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors(), 'Content-Type': 'application/json' },
  });
}
