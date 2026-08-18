import{ms as B,n5 as Me,n6 as Y,n7 as J,cm as ee,me as te,dF as se,x as e,aI as re,aJ as ae,a7 as $,aK as f,mn as ke,ds as ne,aL as ie,az as d,bb as le,n8 as oe,bc as R,n9 as Ee,mf as ce,na as ue,mK as N,eP as Ue,mk as Ke,ml as jt,mm as gt,mo as bt,mH as Se,nb as ze,m5 as We,be as vt,cz as Qe,ap as A,mq as Ge,bQ as Te,d9 as He,nc as Et,cD as Ve,cC as Fe,lU as Le,cE as Pe,jZ as St,mw as Ie,dG as $e,mx as Tt,kJ as Vt,kK as Ft,kL as Lt,lW as De,my as Ze,nd as Xe,lN as qe,ne as Oe,mD as Pt,ar as de,ae as b,aE as D,af as K,aF as je,mE as It,aZ as $t,bV as Dt,M as qt,nf as Ot,mG as _t,mM as At,dX as Rt,aT as pe,aV as xe,aW as me,bN as ge,br as U,bl as Ye,bh as Je,bi as et,mQ as tt,bj as st,ee as _e,ed as rt,b0 as be,dl as Ae,bW as Bt,mW as at,bk as z,mS as nt,mT as Z,e6 as it,g3 as X,mV as lt,cB as ot,bn as ve,b_ as ct,ct as ut,dU as dt,bo as Nt,cp as wt,cq as W,cr as Q,cs as G,ng as pt,ec as Mt,fO as kt,eb as Ut,mY as Kt,m_ as fe,ag as zt,ah as Re,b7 as Wt,m$ as Qt,cj as Gt,ck as H,fa as Ht}from"./index-Dt8FAWWS.js";import{u as I,g as j,f as Zt,r as Xt}from"./apollo-BxVF6eGb.js";import{u as Yt,a as Jt,b as es,S as ts,c as ss,E as rs}from"./ExpandableLabelSection-Zzl8aowS.js";import"./react-pF2EnNv3.js";import"./lodash-JMWJiBov.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-Cx1x11iP.js";const as=j`
    query getPlatformClusters($query: String, $pagination: Pagination) {
        clusters(query: $query, pagination: $pagination) {
            id
            name
            clusterVulnerabilityCount(query: $query)
            type
            status {
                orchestratorMetadata {
                    version
                }
            }
        }
    }
`,ns=[B,Me,Y,J],Be={field:B,direction:"asc"};function is({querySearchFilter:s,isFiltered:t,pagination:a,sortOption:n,getSortParams:r,onClearFilters:i}){const{page:l,perPage:o}=a,{data:c,previousData:p,error:u,loading:v}=I(as,{variables:{query:te(s),pagination:ee({page:l,perPage:o,sortOption:n})}}),g=c??p,T=se({isLoading:v,data:g==null?void 0:g.clusters,error:u,searchFilter:s});return e.jsxs(re,{borders:T.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":v?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(f,{sort:r(B),children:"Cluster"}),e.jsxs(f,{sort:r(Me),children:["CVEs",t&&e.jsx(ke,{})]}),e.jsx(f,{sort:r(Y),children:"Platform type"}),e.jsx(f,{sort:r(J),children:"Kubernetes version"})]})}),e.jsx(ne,{tableState:T,colSpan:4,emptyProps:{message:"No secured clusters have been detected"},filteredEmptyProps:{onClearFilters:i},renderer:({data:V})=>V.map(({id:P,name:E,clusterVulnerabilityCount:F,type:m,status:y})=>{var S;return e.jsx(ie,{children:e.jsxs($,{children:[e.jsx(d,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(le,{to:oe("Cluster",P),children:E})}),e.jsx(d,{dataLabel:"CVEs",children:R(F,"CVE")}),e.jsx(d,{dataLabel:"Platform type",children:Ee(m)}),e.jsx(d,{dataLabel:"Kubernetes version",children:((S=y==null?void 0:y.orchestratorMetadata)==null?void 0:S.version)??"Unavailable"})]})},P)})})]})}const ls=j`
    query getPlatformCves($query: String, $pagination: Pagination) {
        platformCVEs(query: $query, pagination: $pagination) {
            id
            cve
            isFixable
            cveType
            cvss
            clusterVulnerability {
                scoreVersion
                summary
            }
            clusterCountByType {
                generic
                kubernetes
                openshift
                openshift4
            }
        }
    }
`;function os({querySearchFilter:s,...t}){return I(ls,{variables:{query:te(s),pagination:ee(t)}})}const cs=j`
    query getTotalClusterCount {
        clusterCount
    }
`,us=[ce,ue,N],Ne={field:N,direction:"desc"};function ds({querySearchFilter:s,isFiltered:t,pagination:a,selectedCves:n,canSelectRows:r,createRowActions:i,sortOption:l,getSortParams:o,onClearFilters:c}){var S;const{page:p,perPage:u}=a,{data:v,previousData:g,error:T,loading:x}=os({querySearchFilter:s,page:p,perPage:u,sortOption:l}),P=((S=I(cs).data)==null?void 0:S.clusterCount)??0,E=v??g,F=se({isLoading:x,data:E==null?void 0:E.platformCVEs,error:T,searchFilter:s}),m=Ue(),y=r?8:6;return e.jsxs(re,{borders:F.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":x?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(Ke,{}),r&&e.jsx(jt,{selectedCves:n}),e.jsx(f,{sort:o(ce),children:"CVE"}),e.jsx(f,{children:"CVE status"}),e.jsx(f,{sort:o(ue),children:"CVE type"}),e.jsx(f,{sort:o(N),children:"CVSS"}),e.jsxs(gt,{tooltip:"Ratio of the number of clusters affected by this CVE to the total number of secured clusters",sort:void 0,children:["Affected clusters",t&&e.jsx(ke,{})]}),r&&e.jsx(f,{screenReaderText:"Row actions"})]})}),e.jsx(ne,{tableState:F,colSpan:y,emptyProps:{message:"No CVEs have been detected for your secured clusters"},filteredEmptyProps:{onClearFilters:c},renderer:({data:q})=>q.map((h,C)=>{const{id:L,cve:O,isFixable:w,cveType:Ce,cvss:he,clusterVulnerability:{summary:M,scoreVersion:_},clusterCountByType:k}=h,ye=m.has(O),{generic:mt,kubernetes:Ct,openshift:ht,openshift4:yt}=k,ft=mt+Ct+ht+yt;return e.jsxs(ie,{isExpanded:ye,children:[e.jsxs($,{children:[e.jsx(d,{expand:{rowIndex:C,isExpanded:ye,onToggle:()=>m.toggle(O)}}),r&&e.jsx(bt,{selectedCves:n,rowIndex:C,item:{cve:O}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(le,{to:oe("CVE",L),children:O})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:w})}),e.jsx(d,{dataLabel:"CVE type",children:ze(Ce)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(We,{cvss:he,scoreVersion:_})}),e.jsxs(d,{dataLabel:"Affected clusters",children:[ft," / ",P," affected clusters"]}),r&&e.jsx(d,{isActionCell:!0,children:e.jsx(vt,{items:i({cve:O})})})]}),e.jsxs($,{isExpanded:ye,children:[e.jsx(d,{}),e.jsx(d,{colSpan:y-1,children:e.jsx(Qe,{children:M?e.jsx(A,{component:"p",children:M}):e.jsx(Ge,{})})})]})]},L)})})]})}const ps=j`
    query getPlatformCVEEntityCounts($query: String) {
        platformCVECount(query: $query)
        clusterCount(query: $query)
    }
`;function xs(s){return I(ps,{variables:{query:te(s)}})}const ms=[Ze,Xe];function Cs(){var M;const s=Zt(),{analyticsTrack:t}=Te(),a=qe(t),[n]=He("entityTab",Et),{searchFilter:r,setSearchFilter:i}=Ve(),l=Fe(Le),{sortOption:o,getSortParams:c,setSortOption:p}=Pe({sortFields:n==="CVE"?us:ns,defaultSortOption:n==="CVE"?Ne:Be,onSort:()=>l.setPage(1)});St({destination:"platform-cves",searchFilter:r,setSearchFilter:i,reapplyWhen:[n],onScopeApplied:()=>l.setPage(1)});const u=Ie(r),v=$e(u),g=((M=u["CVE Snoozed"])==null?void 0:M[0])==="true",T=Yt(),x=Tt(),{snoozeModalOptions:V,setSnoozeModalOptions:P,snoozeActionCreator:E}=Jt(),F=es("Platform");function m(_){l.setPage(1),p(_==="CVE"?Ne:Be),t({event:Ot,properties:{type:_,page:"Overview"}})}Xt.useEffect(()=>{m(n)},[]);const{data:y}=xs(u),S={CVE:(y==null?void 0:y.platformCVECount)??0,Cluster:(y==null?void 0:y.clusterCount)??0};function q(){i({}),l.setPage(1)}const h=Vt(),C=h==="v1"||h==="v2",L=Ft({enabled:C&&h==="v1",searchFilter:r,setSearchFilter:i,paginationSetPage:()=>l.setPage(1),storageScope:"platform-cves",filterKind:"workload"}),O=Lt({enabled:C&&h==="v2",searchFilter:r,setSearchFilter:i,paginationSetPage:()=>l.setPage(1),storageScope:"platform-cves",filterKind:"workload"}),w=h==="v2"?O:L,Ce=e.jsx(De,{searchFilter:r,searchFilterConfig:ms,defaultSearchFilterEntity:"CVE",cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(_,k)=>{i(_),a(Oe,k)},includeCveSeverityFilters:!1,prefixToolbarItems:w.prefixToolbarItem??void 0,appliedFilterSuffix:w.appliedFilterSuffix??void 0}),he=e.jsx(_t,{entityTabs:["CVE","Cluster"],entityCounts:S,onChange:m});return e.jsxs(e.Fragment,{children:[V&&e.jsx(ts,{...V,onSuccess:(_,k)=>{_==="SNOOZE"&&t({event:Pt,properties:{type:"PLATFORM",duration:k}}),s.cache.evict({fieldName:"platformCVEs"}),s.cache.evict({fieldName:"platformCVECount"}),s.cache.gc(),x.clear()},onClose:()=>P(null)}),e.jsx(de,{title:"Kubernetes Components Overview"}),e.jsx(b,{children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(D,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(K,{headingLevel:"h1",children:"Kubernetes components"}),e.jsx(je,{children:"Prioritize and manage scanned CVEs across clusters"})]}),e.jsx(je,{children:e.jsx(ss,{searchFilter:r,setSearchFilter:i,snoozedCveCount:F})})]})}),h==="v2"&&O.wysiwygAlert&&e.jsx(b,{children:O.wysiwygAlert}),e.jsxs(b,{isFilled:!0,children:[e.jsx(It,{filterToolbar:Ce,entityToggleGroup:he,pagination:l,tableRowCount:n==="CVE"?S.CVE:S.Cluster,isFiltered:v,children:T&&e.jsx($t,{align:{default:"alignEnd"},children:e.jsx(Dt,{toggleText:"Bulk actions",isDisabled:x.size===0,children:e.jsx(qt,{onClick:()=>P({action:g?"UNSNOOZE":"SNOOZE",cveType:"CLUSTER_CVE",cves:Array.from(x.values())}),children:g?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),n==="CVE"&&e.jsx(ds,{querySearchFilter:u,isFiltered:v,pagination:l,selectedCves:x,canSelectRows:T,createRowActions:E("CLUSTER_CVE",g?"UNSNOOZE":"SNOOZE"),sortOption:o,getSortParams:c,onClearFilters:q}),n==="Cluster"&&e.jsx(is,{querySearchFilter:u,isFiltered:v,pagination:l,sortOption:o,getSortParams:c,onClearFilters:q})]}),w.modalsFragment]})}const hs=[B,Y,J],ys={field:B,direction:"asc"},fs=j`
    fragment AffectedClusterFragment on Cluster {
        id
        name
        type
        clusterVulnerabilities(query: $query) {
            fixedByVersion
        }
        status {
            orchestratorMetadata {
                version
            }
        }
    }
`;function js({tableState:s,getSortParams:t,onClearFilters:a}){return e.jsxs(re,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(f,{sort:t(B),children:"Cluster"}),e.jsx(f,{sort:t(Y),children:"Cluster type"}),e.jsx(f,{children:"CVE status"}),e.jsx(f,{sort:t(J),children:"Kubernetes version"})]})}),e.jsx(ne,{tableState:s,colSpan:3,emptyProps:{message:"No clusters have been reported for this CVE"},filteredEmptyProps:{onClearFilters:a},renderer:({data:n})=>e.jsx(ie,{children:n.map(({id:r,name:i,type:l,clusterVulnerabilities:o,status:c})=>{var u;const p=At(o);return e.jsxs($,{children:[e.jsx(d,{dataLabel:"Cluster",children:e.jsx(le,{to:oe("Cluster",r),children:e.jsx(Rt,{position:"middle",content:i})})}),e.jsx(d,{dataLabel:"Cluster type",modifier:"nowrap",children:Ee(l)}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:p})}),e.jsx(d,{dataLabel:"Kubernetes version",modifier:"nowrap",children:((u=c==null?void 0:c.orchestratorMetadata)==null?void 0:u.version)??"Unavailable"})]},r)})})})]})}const gs=j`
    ${fs}
    query getAffectedClusters($query: String, $pagination: Pagination) {
        clusterCount(query: $query)
        clusters(query: $query, pagination: $pagination) {
            ...AffectedClusterFragment
        }
    }
`;function bs({query:s,...t}){var n,r,i;const a=I(gs,{variables:{query:s,pagination:ee(t)}});return{affectedClustersRequest:a,clusterCount:((n=a.data)==null?void 0:n.clusterCount)??0,clusterData:((r=a.data)==null?void 0:r.clusters)??((i=a.previousData)==null?void 0:i.clusters)}}const xt=j`
    fragment ClustersByType on PlatformCVECore {
        clusterCountByType {
            generic
            kubernetes
            openshift
            openshift4
        }
    }
`;function vs({clusterCounts:s}){const{generic:t=0,kubernetes:a=0,openshift:n=0,openshift4:r=0}=s??{},i=t+a+n+r;return e.jsxs(pe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(xe,{children:"Clusters by type"}),e.jsx(me,{children:i>0?e.jsxs(ge,{children:[t>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[t," Generic"]}),a>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[a," Kubernetes"]}),n+r>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[n+r," OpenShift"]})]}):e.jsx(ge,{children:e.jsx(U,{span:12,className:"pf-v6-u-pt-xs",children:"No affected clusters found"})})})]})}const Es=j`
    ${xt}
    query getPlatformCVEMetadata($cveID: String!) {
        platformCVE(cveID: $cveID) {
            cve
            clusterVulnerability {
                link
                summary
            }
            firstDiscoveredTime
            ...ClustersByType
        }
    }
`;function Ss(s){return I(Es,{variables:{cveID:s}})}function Ts({affectedClusterCount:s,totalClusterCount:t}){return e.jsxs(pe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(xe,{children:"Affected clusters"}),e.jsx(me,{children:e.jsx(ge,{children:e.jsxs(U,{span:12,className:"pf-v6-u-pt-sm",children:[s," / ",t," affected clusters"]})})})]})}const Vs=j`
    ${xt}
    query getPlatformCVEMetadata($cveID: String!, $query: String!) {
        totalClusterCount: clusterCount
        clusterCount(query: $query)
        platformCVE(cveID: $cveID, subfieldScopeQuery: $query) {
            ...ClustersByType
        }
    }
`;function Fs({cveId:s,query:t}){return I(Vs,{variables:{cveID:s,query:t}})}const Ls=tt("Platform",{entityTab:"CVE"}),Ps=[Ze];function Is(){var h;const{analyticsTrack:s}=Te(),t=qe(s),{searchFilter:a,setSearchFilter:n}=Ve(),r=Ie(a),i=Ye(),l=decodeURIComponent(i.cveId),o=te({...r,"CVE ID":[l]}),{page:c,perPage:p,setPage:u,setPerPage:v}=Fe(Le),{sortOption:g,getSortParams:T}=Pe({sortFields:hs,defaultSortOption:ys,onSort:()=>u(1)}),{affectedClustersRequest:x,clusterData:V,clusterCount:P}=bs({query:o,page:c,perPage:p,sortOption:g}),E=Ss(l),F=Fs({cveId:l,query:o}),m=(h=E.data)==null?void 0:h.platformCVE,y=m==null?void 0:m.cve,S=$e(r),q=se({isLoading:x.loading,error:x.error,data:V,searchFilter:r});return e.jsxs(e.Fragment,{children:[e.jsx(de,{title:`Kubernetes components - Vulnerability ${y}`}),e.jsx(b,{type:"breadcrumb",children:e.jsxs(Je,{children:[e.jsx(et,{to:Ls,children:"Kubernetes components"}),e.jsx(st,{isActive:!0,children:y??e.jsx(_e,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(b,{children:m?e.jsxs(D,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},spaceItems:{default:"spaceItemsSm"},children:[e.jsx(K,{headingLevel:"h1",children:m.cve}),m.firstDiscoveredTime&&e.jsx(rt,{numLabels:1,children:e.jsxs(be,{children:["First discovered in system:"," ",Ae(m.firstDiscoveredTime)]})}),e.jsx(A,{component:"p",children:m.clusterVulnerability.summary}),e.jsx(Bt,{children:e.jsx("a",{href:m.clusterVulnerability.link,target:"_blank",rel:"noopener noreferrer",children:m.clusterVulnerability.link})})]}):e.jsx(at,{nameScreenreaderText:"Loading CVE name",metadataScreenreaderText:"Loading CVE metadata"})}),e.jsx(z,{component:"div"}),e.jsxs(b,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(De,{searchFilter:a,searchFilterConfig:Ps,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(C,L)=>{n(C),t(Oe,L)},includeCveSeverityFilters:!1}),e.jsxs(nt,{error:F.error,isLoading:F.loading,children:[e.jsx(Z,{data:F.data,loadingText:"Loading affected nodes summary",renderer:({data:C})=>e.jsx(Ts,{affectedClusterCount:C.clusterCount,totalClusterCount:C.totalClusterCount})}),e.jsx(Z,{data:F.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:C})=>{var L;return e.jsx(vs,{clusterCounts:(L=C.platformCVE)==null?void 0:L.clusterCountByType})}})]}),e.jsx(z,{component:"div"}),e.jsxs(it,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(X,{isFilled:!0,children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(K,{headingLevel:"h2",children:[R(P,"cluster")," affected"]}),S&&e.jsx(lt,{})]})}),e.jsx(X,{children:e.jsx(ot,{itemCount:P,perPage:p,page:c,onSetPage:(C,L)=>u(L),onPerPageSelect:(C,L)=>{v(L)}})})]}),e.jsx(js,{tableState:q,getSortParams:T,onClearFilters:()=>{n({}),u(1)}})]})]})}const $s=j`
    fragment ClusterMetadata on Cluster {
        id
        name
        status {
            orchestratorMetadata {
                buildDate
                version
            }
        }
    }
`;function Ds({data:s}){var r,i,l,o;if(!s)return e.jsx(at,{nameScreenreaderText:"Loading Cluster name",metadataScreenreaderText:"Loading Cluster metadata"});const t=(i=(r=s.status)==null?void 0:r.orchestratorMetadata)==null?void 0:i.buildDate,a=(o=(l=s.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.version,n=0+(t?1:0)+(a?1:0);return e.jsxs(D,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(K,{headingLevel:"h1",className:"pf-v6-u-mb-sm",children:s.name}),n>0&&e.jsxs(rt,{numLabels:n,children:[a&&e.jsxs(be,{children:["K8s version: ",a]}),t&&e.jsxs(be,{children:["Build date: ",Ae(t)]})]})]})}const qs=j`
    query getClusterExtendedDetails($id: ID!) {
        cluster(id: $id) {
            id
            status {
                providerMetadata {
                    aws {
                        __typename
                    }
                    azure {
                        __typename
                    }
                    google {
                        __typename
                    }
                    region
                }
                orchestratorMetadata {
                    version
                    buildDate
                }
            }
            type
            labels {
                key
                value
            }
        }
    }
`;function Os(s){return I(qs,{variables:{id:s}})}function we(s){if(!s)return null;const{region:t}=s;return s.aws?`AWS ${t}`:s.azure?`Azure ${t}`:s.google?`GCP ${t}`:null}function _s({clusterId:s}){var r,i,l,o,c,p;const{data:t,loading:a,error:n}=Os(s);return e.jsxs(e.Fragment,{children:[e.jsx(b,{component:"div",children:e.jsx(A,{component:"p",children:"View details about this cluster"})}),e.jsx(z,{component:"div"}),e.jsx(b,{isFilled:!0,children:n?e.jsx(ve,{children:e.jsx(ct,{title:"There was an error loading the cluster details",headingLevel:"h2",icon:dt,status:"danger",children:ut(n)})}):a?e.jsx(ve,{children:e.jsx(Nt,{size:"xl"})}):t&&e.jsxs(D,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(wt,{columnModifier:{default:"1Col"},children:[e.jsxs(W,{children:[e.jsx(Q,{children:"Cluster type"}),e.jsx(G,{children:Ee(t.cluster.type)})]}),we((r=t.cluster.status)==null?void 0:r.providerMetadata)&&e.jsxs(W,{children:[e.jsx(Q,{children:"Cloud provider"}),e.jsx(G,{children:we((i=t.cluster.status)==null?void 0:i.providerMetadata)})]}),((o=(l=t.cluster.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.buildDate)&&e.jsxs(W,{children:[e.jsx(Q,{children:"Build date"}),e.jsx(G,{children:Ae(t.cluster.status.orchestratorMetadata.buildDate)})]}),((p=(c=t.cluster.status)==null?void 0:c.orchestratorMetadata)==null?void 0:p.version)&&e.jsxs(W,{children:[e.jsx(Q,{children:"K8s version"}),e.jsx(G,{children:t.cluster.status.orchestratorMetadata.version})]})]}),e.jsx(rs,{toggleText:"Labels",labels:t.cluster.labels})]})})]})}const As=[ce,pt,ue,N],Rs={field:N,direction:"desc"},Bs=j`
    fragment ClusterVulnerabilityFragment on ClusterVulnerability {
        id
        cve
        isFixable
        cvss
        scoreVersion
        vulnerabilityType
        summary
    }
`;function Ns({tableState:s,getSortParams:t,onClearFilters:a}){const r=Ue();return e.jsxs(re,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(Ke,{}),e.jsx(f,{sort:t(ce),children:"CVE"}),e.jsx(f,{sort:t(pt),children:"CVE status"}),e.jsx(f,{sort:t(ue),children:"CVE type"}),e.jsx(f,{sort:t(N),children:"CVSS"})]})}),e.jsx(ne,{tableState:s,colSpan:5,emptyProps:{message:"No CVEs were detected for this cluster"},filteredEmptyProps:{onClearFilters:a},renderer:({data:i})=>i.map((l,o)=>{const{id:c,cve:p,isFixable:u,vulnerabilityType:v,cvss:g,scoreVersion:T,summary:x}=l,V=r.has(p);return e.jsxs(ie,{isExpanded:V,children:[e.jsxs($,{children:[e.jsx(d,{expand:{rowIndex:o,isExpanded:V,onToggle:()=>r.toggle(p)}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(le,{to:oe("CVE",c),children:p})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:u})}),e.jsx(d,{dataLabel:"CVE type",children:ze(v)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(We,{cvss:g,scoreVersion:T})})]}),e.jsxs($,{isExpanded:V,children:[e.jsx(d,{}),e.jsx(d,{colSpan:4,children:e.jsx(Qe,{children:x?e.jsx(A,{component:"p",children:x}):e.jsx(Ge,{})})})]})]},p)})})]})}const ws=j`
    ${Bs}
    query getClusterVulnerabilities($id: ID!, $query: String!, $pagination: Pagination) {
        cluster(id: $id) {
            id
            clusterVulnerabilityCount(query: $query)
            clusterVulnerabilities(query: $query, pagination: $pagination) {
                ...ClusterVulnerabilityFragment
            }
        }
    }
`;function Ms({clusterId:s,query:t,...a}){return I(ws,{variables:{id:s,query:t,pagination:ee(a)}})}const ks="var(--pf-t--global--text--color--disabled)",Us=[{status:"Fixable",Icon:Mt,text:({fixable:s})=>`${R(s,"vulnerability","vulnerabilities")} with available fixes`},{status:"Not fixable",Icon:kt,text:({total:s,fixable:t})=>`${R(s-t,"vulnerability","vulnerabilities")} without fixes`}],Ks={Fixable:"Fixable hidden","Not fixable":"Not fixable hidden"},zs=j`
    fragment PlatformCveCountByStatusFragment on PlatformCVECountByFixability {
        total
        fixable
    }
`;function Ws({data:s,hiddenStatuses:t}){return e.jsxs(pe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(xe,{children:"CVEs by status"}),e.jsx(me,{children:e.jsx(D,{direction:{default:"column"},children:Us.map(({status:a,Icon:n,text:r})=>{const i=t.has(a);return e.jsxs(D,{spaceItems:{default:"spaceItemsSm"},alignItems:{default:"alignItemsCenter"},children:[e.jsx(n,{}),e.jsx(A,{component:"p",style:{color:i?ks:"inherit"},children:i?Ks[a]:r(s)})]},a)})})})]})}const Qs=[{type:"OpenShift CVE",field:"openshift"},{type:"Kubernetes CVE",field:"kubernetes"},{type:"Istio CVE",field:"istio"}],Gs=j`
    fragment PlatformCveCountByTypeFragment on PlatformCVECountByType {
        kubernetes
        openshift
        istio
    }
`;function Hs({data:s}){return e.jsxs(pe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(xe,{children:"CVEs by type"}),e.jsx(me,{children:e.jsx(D,{direction:{default:"column"},children:Qs.map(({type:t,field:a})=>e.jsx(je,{span:12,children:e.jsx(A,{component:"p",children:R(s[a],t)})},t))})})]})}const Zs=j`
    ${zs}
    ${Gs}
    query getClusterVulnSummary($id: ID!, $query: String) {
        cluster(id: $id) {
            id
            platformCVECountByFixability(query: $query) {
                ...PlatformCveCountByStatusFragment
            }
            platformCVECountByType(query: $query) {
                ...PlatformCveCountByTypeFragment
            }
        }
    }
`;function Xs(s,t){return I(Zs,{variables:{id:s,query:t}})}const Ys=[Xe];function Js({clusterId:s}){var S,q;const{analyticsTrack:t}=Te(),a=qe(t),{searchFilter:n,setSearchFilter:r}=Ve(),i=Ie(n),l=Ut(i),o=$e(i),{page:c,perPage:p,setPage:u,setPerPage:v}=Fe(Le),{sortOption:g,getSortParams:T}=Pe({sortFields:As,defaultSortOption:Rs,onSort:()=>u(1)}),{data:x,loading:V,error:P}=Ms({clusterId:s,query:l,page:c,perPage:p,sortOption:g}),E=Xs(s,l),F=Kt(i),m=((S=x==null?void 0:x.cluster)==null?void 0:S.clusterVulnerabilityCount)??0,y=se({isLoading:V,error:P,data:(q=x==null?void 0:x.cluster)==null?void 0:q.clusterVulnerabilities,searchFilter:i});return e.jsxs(e.Fragment,{children:[e.jsx(b,{component:"div",children:e.jsx(A,{component:"p",children:"Review and triage vulnerability data scanned on this cluster"})}),e.jsx(z,{component:"div"}),e.jsxs(b,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(De,{className:"pf-v6-u-pb-0 pf-v6-u-px-sm",searchFilter:n,searchFilterConfig:Ys,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(h,C)=>{r(h),a(Oe,C)},includeCveSeverityFilters:!1}),e.jsxs(nt,{isLoading:E.loading,error:E.error,children:[e.jsx(Z,{loadingText:"Loading platform CVEs by status summary",data:E.data,renderer:({data:h})=>e.jsx(Ws,{data:h.cluster.platformCVECountByFixability,hiddenStatuses:F})}),e.jsx(Z,{loadingText:"Loading platform CVEs by type summary",data:E.data,renderer:({data:h})=>e.jsx(Hs,{data:h.cluster.platformCVECountByType})})]}),e.jsx(z,{component:"div"}),e.jsxs(it,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(X,{isFilled:!0,children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(K,{headingLevel:"h2",className:"pf-v6-u-w-50",children:x?`${R(m,"result")} found`:e.jsx(_e,{screenreaderText:"Loading cluster vulnerability count"})}),o&&e.jsx(lt,{})]})}),e.jsx(X,{children:e.jsx(ot,{itemCount:m,perPage:p,page:c,onSetPage:(h,C)=>u(C),onPerPageSelect:(h,C)=>{v(C)}})})]}),e.jsx(Ns,{tableState:y,getSortParams:T,onClearFilters:()=>{r({}),u(1)}})]})]})}const er="ClusterPageDetails",tr="ClusterPageVulnerabilities",sr=tt("Platform",{entityTab:"Cluster"}),rr=j`
    ${$s}
    query getClusterMetadata($id: ID!) {
        cluster(id: $id) {
            ...ClusterMetadata
        }
    }
`;function ar(){var c;const{clusterId:s}=Ye(),{data:t,error:a}=I(rr,{variables:{id:s}}),[n,r]=He("detailsTab",fe),i=fe[0],l=fe[1],o=((c=t==null?void 0:t.cluster)==null?void 0:c.name)??"";return e.jsxs(e.Fragment,{children:[e.jsx(de,{title:`Platform CVEs - Cluster ${o}`}),e.jsx(b,{type:"breadcrumb",children:e.jsxs(Je,{children:[e.jsx(et,{to:sr,children:"Clusters"}),e.jsx(st,{isActive:!0,children:o??e.jsx(_e,{screenreaderText:"Loading cluster name",width:"200px"})})]})}),a?e.jsx(b,{hasBodyWrapper:!1,children:e.jsx(ve,{children:e.jsx(ct,{title:ut(a),headingLevel:"h2",icon:dt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(b,{hasBodyWrapper:!1,children:e.jsx(Ds,{data:t==null?void 0:t.cluster})}),e.jsx(b,{type:"tabs",children:e.jsxs(zt,{activeKey:n,onSelect:(p,u)=>{r(u)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Re,{eventKey:i,tabContentId:tr,title:i,children:e.jsx(Js,{clusterId:s})}),e.jsx(Re,{eventKey:l,tabContentId:er,title:l,children:e.jsx(_s,{clusterId:s})})]})})]})]})}function pr(){const{hasReadAccess:s}=Wt(),t=s("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(Qt,{}),e.jsxs(Gt,{children:[e.jsx(H,{index:!0,element:e.jsx(Cs,{})}),e.jsx(H,{path:"cves/:cveId",element:e.jsx(Is,{})}),e.jsx(H,{path:"clusters/:clusterId",element:e.jsx(ar,{})}),e.jsx(H,{path:"*",element:e.jsxs(b,{hasBodyWrapper:!1,children:[e.jsx(de,{title:"Platform CVEs - Not Found"}),e.jsx(Ht,{})]})})]})]})}export{pr as default};
