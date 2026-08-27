import{j as e,r as gt}from"./react-Dz5erZcn.js";import{fu as B,g2 as Me,g3 as Y,g4 as J,aB as ee,fh as te,bi as se,fp as ke,b6 as re,g5 as ae,g6 as Ee,fi as ne,g7 as ie,fM as N,b_ as Ue,fm as Ke,fn as jt,fo as bt,fq as vt,fJ as Se,g8 as ze,f8 as Ge,fs as We,a9 as Te,a$ as Qe,g9 as Et,aF as Fe,aE as Ve,eX as Pe,aG as Le,dW as St,fy as Ie,bj as $e,fz as Tt,er as Ft,es as Vt,et as Pt,eZ as De,fA as He,ga as Ze,eR as qe,gb as Oe,fF as Lt,A as le,fG as It,ae as $t,gc as Dt,fI as qt,fO as Ot,K as Xe,fS as Ye,af as At,fY as Je,fU as et,fV as Z,fX as tt,ah as st,aC as rt,gd as at,bG as _t,bF as Rt,f_ as Bt,g0 as ye,G as Nt,g1 as wt,ch as Mt}from"./index-CTlcD22L.js";import{u as kt,a as Ut,b as Kt,S as zt,c as Gt,E as Wt}from"./ExpandableLabelSection-DMc1-vHk.js";import{bT as oe,bU as ce,bV as $,bW as y,bX as ue,bY as d,$ as de,dr as R,cK as Qt,cL as nt,bi as _,P as b,F as D,T as K,l as ge,bs as Ht,ah as Zt,cy as Xt,bI as pe,bJ as xe,bK as Ce,bR as je,bS as U,cG as it,cF as lt,bn as ot,ck as Ae,c8 as ct,aC as be,s as _e,ao as z,d2 as ut,d3 as X,cI as dt,aq as ve,j as pt,S as Yt,cz as Jt,cA as G,cB as W,cC as Q,dq as es,bw as ts,bx as Re,cY as ss,cZ as H}from"./policy-filters-step-B4IHG4xr.js";import{u as I,h as g,i as rs}from"./apollo-DfQf4W16.js";import"./lodash-DTYsuwI9.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-C89SSkCD.js";const as=g`
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
`,ns=[B,Me,Y,J],Be={field:B,direction:"asc"};function is({querySearchFilter:s,isFiltered:t,pagination:a,sortOption:n,getSortParams:r,onClearFilters:i}){const{page:l,perPage:o}=a,{data:c,previousData:p,error:u,loading:v}=I(as,{variables:{query:te(s),pagination:ee({page:l,perPage:o,sortOption:n})}}),j=c??p,T=se({isLoading:v,data:j==null?void 0:j.clusters,error:u,searchFilter:s});return e.jsxs(oe,{borders:T.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":v?"true":"false",children:[e.jsx(ce,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(y,{sort:r(B),children:"Cluster"}),e.jsxs(y,{sort:r(Me),children:["CVEs",t&&e.jsx(ke,{})]}),e.jsx(y,{sort:r(Y),children:"Platform type"}),e.jsx(y,{sort:r(J),children:"Kubernetes version"})]})}),e.jsx(re,{tableState:T,colSpan:4,emptyProps:{message:"No secured clusters have been detected"},filteredEmptyProps:{onClearFilters:i},renderer:({data:F})=>F.map(({id:L,name:E,clusterVulnerabilityCount:V,type:C,status:f})=>{var S;return e.jsx(ue,{children:e.jsxs($,{children:[e.jsx(d,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(de,{to:ae("Cluster",L),children:E})}),e.jsx(d,{dataLabel:"CVEs",children:R(V,"CVE")}),e.jsx(d,{dataLabel:"Platform type",children:Ee(C)}),e.jsx(d,{dataLabel:"Kubernetes version",children:((S=f==null?void 0:f.orchestratorMetadata)==null?void 0:S.version)??"Unavailable"})]})},L)})})]})}const ls=g`
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
`;function os({querySearchFilter:s,...t}){return I(ls,{variables:{query:te(s),pagination:ee(t)}})}const cs=g`
    query getTotalClusterCount {
        clusterCount
    }
`,us=[ne,ie,N],Ne={field:N,direction:"desc"};function ds({querySearchFilter:s,isFiltered:t,pagination:a,selectedCves:n,canSelectRows:r,createRowActions:i,sortOption:l,getSortParams:o,onClearFilters:c}){var S;const{page:p,perPage:u}=a,{data:v,previousData:j,error:T,loading:x}=os({querySearchFilter:s,page:p,perPage:u,sortOption:l}),L=((S=I(cs).data)==null?void 0:S.clusterCount)??0,E=v??j,V=se({isLoading:x,data:E==null?void 0:E.platformCVEs,error:T,searchFilter:s}),C=Ue(),f=r?8:6;return e.jsxs(oe,{borders:V.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":x?"true":"false",children:[e.jsx(ce,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(Ke,{}),r&&e.jsx(jt,{selectedCves:n}),e.jsx(y,{sort:o(ne),children:"CVE"}),e.jsx(y,{children:"CVE status"}),e.jsx(y,{sort:o(ie),children:"CVE type"}),e.jsx(y,{sort:o(N),children:"CVSS"}),e.jsxs(bt,{tooltip:"Ratio of the number of clusters affected by this CVE to the total number of secured clusters",sort:void 0,children:["Affected clusters",t&&e.jsx(ke,{})]}),r&&e.jsx(y,{screenReaderText:"Row actions"})]})}),e.jsx(re,{tableState:V,colSpan:f,emptyProps:{message:"No CVEs have been detected for your secured clusters"},filteredEmptyProps:{onClearFilters:c},renderer:({data:q})=>q.map((m,h)=>{const{id:P,cve:O,isFixable:w,cveType:he,cvss:me,clusterVulnerability:{summary:M,scoreVersion:A},clusterCountByType:k}=m,fe=C.has(O),{generic:Ct,kubernetes:ht,openshift:mt,openshift4:ft}=k,yt=Ct+ht+mt+ft;return e.jsxs(ue,{isExpanded:fe,children:[e.jsxs($,{children:[e.jsx(d,{expand:{rowIndex:h,isExpanded:fe,onToggle:()=>C.toggle(O)}}),r&&e.jsx(vt,{selectedCves:n,rowIndex:h,item:{cve:O}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(de,{to:ae("CVE",P),children:O})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:w})}),e.jsx(d,{dataLabel:"CVE type",children:ze(he)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(Ge,{cvss:me,scoreVersion:A})}),e.jsxs(d,{dataLabel:"Affected clusters",children:[yt," / ",L," affected clusters"]}),r&&e.jsx(d,{isActionCell:!0,children:e.jsx(Qt,{items:i({cve:O})})})]}),e.jsxs($,{isExpanded:fe,children:[e.jsx(d,{}),e.jsx(d,{colSpan:f-1,children:e.jsx(nt,{children:M?e.jsx(_,{component:"p",children:M}):e.jsx(We,{})})})]})]},P)})})]})}const ps=g`
    query getPlatformCVEEntityCounts($query: String) {
        platformCVECount(query: $query)
        clusterCount(query: $query)
    }
`;function xs(s){return I(ps,{variables:{query:te(s)}})}const Cs=[He,Ze];function hs(){var M;const s=rs(),{analyticsTrack:t}=Te(),a=qe(t),[n]=Qe("entityTab",Et),{searchFilter:r,setSearchFilter:i}=Fe(),l=Ve(Pe),{sortOption:o,getSortParams:c,setSortOption:p}=Le({sortFields:n==="CVE"?us:ns,defaultSortOption:n==="CVE"?Ne:Be,onSort:()=>l.setPage(1)});St({destination:"platform-cves",searchFilter:r,setSearchFilter:i,reapplyWhen:[n],onScopeApplied:()=>l.setPage(1)});const u=Ie(r),v=$e(u),j=((M=u["CVE Snoozed"])==null?void 0:M[0])==="true",T=kt(),x=Tt(),{snoozeModalOptions:F,setSnoozeModalOptions:L,snoozeActionCreator:E}=Ut(),V=Kt("Platform");function C(A){l.setPage(1),p(A==="CVE"?Ne:Be),t({event:Dt,properties:{type:A,page:"Overview"}})}gt.useEffect(()=>{C(n)},[]);const{data:f}=xs(u),S={CVE:(f==null?void 0:f.platformCVECount)??0,Cluster:(f==null?void 0:f.clusterCount)??0};function q(){i({}),l.setPage(1)}const m=Ft(),h=m==="v1"||m==="v2",P=Vt({enabled:h&&m==="v1",searchFilter:r,setSearchFilter:i,paginationSetPage:()=>l.setPage(1),storageScope:"platform-cves",filterKind:"workload"}),O=Pt({enabled:h&&m==="v2",searchFilter:r,setSearchFilter:i,paginationSetPage:()=>l.setPage(1),storageScope:"platform-cves",filterKind:"workload"}),w=m==="v2"?O:P,he=e.jsx(De,{searchFilter:r,searchFilterConfig:Cs,defaultSearchFilterEntity:"CVE",cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(A,k)=>{i(A),a(Oe,k)},includeCveSeverityFilters:!1,prefixToolbarItems:w.prefixToolbarItem??void 0,appliedFilterSuffix:w.appliedFilterSuffix??void 0}),me=e.jsx(qt,{entityTabs:["CVE","Cluster"],entityCounts:S,onChange:C});return e.jsxs(e.Fragment,{children:[F&&e.jsx(zt,{...F,onSuccess:(A,k)=>{A==="SNOOZE"&&t({event:Lt,properties:{type:"PLATFORM",duration:k}}),s.cache.evict({fieldName:"platformCVEs"}),s.cache.evict({fieldName:"platformCVECount"}),s.cache.gc(),x.clear()},onClose:()=>L(null)}),e.jsx(le,{title:"Kubernetes Components Overview"}),e.jsx(b,{children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(D,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(K,{headingLevel:"h1",children:"Kubernetes components"}),e.jsx(ge,{children:"Prioritize and manage scanned CVEs across clusters"})]}),e.jsx(ge,{children:e.jsx(Gt,{searchFilter:r,setSearchFilter:i,snoozedCveCount:V})})]})}),m==="v2"&&O.wysiwygAlert&&e.jsx(b,{children:O.wysiwygAlert}),e.jsxs(b,{isFilled:!0,children:[e.jsx(It,{filterToolbar:he,entityToggleGroup:me,pagination:l,tableRowCount:n==="CVE"?S.CVE:S.Cluster,isFiltered:v,children:T&&e.jsx(Ht,{align:{default:"alignEnd"},children:e.jsx($t,{toggleText:"Bulk actions",isDisabled:x.size===0,children:e.jsx(Zt,{onClick:()=>L({action:j?"UNSNOOZE":"SNOOZE",cveType:"CLUSTER_CVE",cves:Array.from(x.values())}),children:j?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),n==="CVE"&&e.jsx(ds,{querySearchFilter:u,isFiltered:v,pagination:l,selectedCves:x,canSelectRows:T,createRowActions:E("CLUSTER_CVE",j?"UNSNOOZE":"SNOOZE"),sortOption:o,getSortParams:c,onClearFilters:q}),n==="Cluster"&&e.jsx(is,{querySearchFilter:u,isFiltered:v,pagination:l,sortOption:o,getSortParams:c,onClearFilters:q})]}),w.modalsFragment]})}const ms=[B,Y,J],fs={field:B,direction:"asc"},ys=g`
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
`;function gs({tableState:s,getSortParams:t,onClearFilters:a}){return e.jsxs(oe,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(ce,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(y,{sort:t(B),children:"Cluster"}),e.jsx(y,{sort:t(Y),children:"Cluster type"}),e.jsx(y,{children:"CVE status"}),e.jsx(y,{sort:t(J),children:"Kubernetes version"})]})}),e.jsx(re,{tableState:s,colSpan:3,emptyProps:{message:"No clusters have been reported for this CVE"},filteredEmptyProps:{onClearFilters:a},renderer:({data:n})=>e.jsx(ue,{children:n.map(({id:r,name:i,type:l,clusterVulnerabilities:o,status:c})=>{var u;const p=Ot(o);return e.jsxs($,{children:[e.jsx(d,{dataLabel:"Cluster",children:e.jsx(de,{to:ae("Cluster",r),children:e.jsx(Xt,{position:"middle",content:i})})}),e.jsx(d,{dataLabel:"Cluster type",modifier:"nowrap",children:Ee(l)}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:p})}),e.jsx(d,{dataLabel:"Kubernetes version",modifier:"nowrap",children:((u=c==null?void 0:c.orchestratorMetadata)==null?void 0:u.version)??"Unavailable"})]},r)})})})]})}const js=g`
    ${ys}
    query getAffectedClusters($query: String, $pagination: Pagination) {
        clusterCount(query: $query)
        clusters(query: $query, pagination: $pagination) {
            ...AffectedClusterFragment
        }
    }
`;function bs({query:s,...t}){var n,r,i;const a=I(js,{variables:{query:s,pagination:ee(t)}});return{affectedClustersRequest:a,clusterCount:((n=a.data)==null?void 0:n.clusterCount)??0,clusterData:((r=a.data)==null?void 0:r.clusters)??((i=a.previousData)==null?void 0:i.clusters)}}const xt=g`
    fragment ClustersByType on PlatformCVECore {
        clusterCountByType {
            generic
            kubernetes
            openshift
            openshift4
        }
    }
`;function vs({clusterCounts:s}){const{generic:t=0,kubernetes:a=0,openshift:n=0,openshift4:r=0}=s??{},i=t+a+n+r;return e.jsxs(pe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(xe,{children:"Clusters by type"}),e.jsx(Ce,{children:i>0?e.jsxs(je,{children:[t>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[t," Generic"]}),a>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[a," Kubernetes"]}),n+r>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[n+r," OpenShift"]})]}):e.jsx(je,{children:e.jsx(U,{span:12,className:"pf-v6-u-pt-xs",children:"No affected clusters found"})})})]})}const Es=g`
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
`;function Ss(s){return I(Es,{variables:{cveID:s}})}function Ts({affectedClusterCount:s,totalClusterCount:t}){return e.jsxs(pe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(xe,{children:"Affected clusters"}),e.jsx(Ce,{children:e.jsx(je,{children:e.jsxs(U,{span:12,className:"pf-v6-u-pt-sm",children:[s," / ",t," affected clusters"]})})})]})}const Fs=g`
    ${xt}
    query getPlatformCVEMetadata($cveID: String!, $query: String!) {
        totalClusterCount: clusterCount
        clusterCount(query: $query)
        platformCVE(cveID: $cveID, subfieldScopeQuery: $query) {
            ...ClustersByType
        }
    }
`;function Vs({cveId:s,query:t}){return I(Fs,{variables:{cveID:s,query:t}})}const Ps=Ye("Platform",{entityTab:"CVE"}),Ls=[He];function Is(){var m;const{analyticsTrack:s}=Te(),t=qe(s),{searchFilter:a,setSearchFilter:n}=Fe(),r=Ie(a),i=it(),l=decodeURIComponent(i.cveId),o=te({...r,"CVE ID":[l]}),{page:c,perPage:p,setPage:u,setPerPage:v}=Ve(Pe),{sortOption:j,getSortParams:T}=Le({sortFields:ms,defaultSortOption:fs,onSort:()=>u(1)}),{affectedClustersRequest:x,clusterData:F,clusterCount:L}=bs({query:o,page:c,perPage:p,sortOption:j}),E=Ss(l),V=Vs({cveId:l,query:o}),C=(m=E.data)==null?void 0:m.platformCVE,f=C==null?void 0:C.cve,S=$e(r),q=se({isLoading:x.loading,error:x.error,data:F,searchFilter:r});return e.jsxs(e.Fragment,{children:[e.jsx(le,{title:`Kubernetes components - Vulnerability ${f}`}),e.jsx(b,{type:"breadcrumb",children:e.jsxs(lt,{children:[e.jsx(Xe,{to:Ps,children:"Kubernetes components"}),e.jsx(ot,{isActive:!0,children:f??e.jsx(Ae,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(b,{children:C?e.jsxs(D,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},spaceItems:{default:"spaceItemsSm"},children:[e.jsx(K,{headingLevel:"h1",children:C.cve}),C.firstDiscoveredTime&&e.jsx(ct,{numLabels:1,children:e.jsxs(be,{children:["First discovered in system:"," ",_e(C.firstDiscoveredTime)]})}),e.jsx(_,{component:"p",children:C.clusterVulnerability.summary}),e.jsx(At,{children:e.jsx("a",{href:C.clusterVulnerability.link,target:"_blank",rel:"noopener noreferrer",children:C.clusterVulnerability.link})})]}):e.jsx(Je,{nameScreenreaderText:"Loading CVE name",metadataScreenreaderText:"Loading CVE metadata"})}),e.jsx(z,{component:"div"}),e.jsxs(b,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(De,{searchFilter:a,searchFilterConfig:Ls,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(h,P)=>{n(h),t(Oe,P)},includeCveSeverityFilters:!1}),e.jsxs(et,{error:V.error,isLoading:V.loading,children:[e.jsx(Z,{data:V.data,loadingText:"Loading affected nodes summary",renderer:({data:h})=>e.jsx(Ts,{affectedClusterCount:h.clusterCount,totalClusterCount:h.totalClusterCount})}),e.jsx(Z,{data:V.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:h})=>{var P;return e.jsx(vs,{clusterCounts:(P=h.platformCVE)==null?void 0:P.clusterCountByType})}})]}),e.jsx(z,{component:"div"}),e.jsxs(ut,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(X,{isFilled:!0,children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(K,{headingLevel:"h2",children:[R(L,"cluster")," affected"]}),S&&e.jsx(tt,{})]})}),e.jsx(X,{children:e.jsx(dt,{itemCount:L,perPage:p,page:c,onSetPage:(h,P)=>u(P),onPerPageSelect:(h,P)=>{v(P)}})})]}),e.jsx(gs,{tableState:q,getSortParams:T,onClearFilters:()=>{n({}),u(1)}})]})]})}const $s=g`
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
`;function Ds({data:s}){var r,i,l,o;if(!s)return e.jsx(Je,{nameScreenreaderText:"Loading Cluster name",metadataScreenreaderText:"Loading Cluster metadata"});const t=(i=(r=s.status)==null?void 0:r.orchestratorMetadata)==null?void 0:i.buildDate,a=(o=(l=s.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.version,n=0+(t?1:0)+(a?1:0);return e.jsxs(D,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(K,{headingLevel:"h1",className:"pf-v6-u-mb-sm",children:s.name}),n>0&&e.jsxs(ct,{numLabels:n,children:[a&&e.jsxs(be,{children:["K8s version: ",a]}),t&&e.jsxs(be,{children:["Build date: ",_e(t)]})]})]})}const qs=g`
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
`;function Os(s){return I(qs,{variables:{id:s}})}function we(s){if(!s)return null;const{region:t}=s;return s.aws?`AWS ${t}`:s.azure?`Azure ${t}`:s.google?`GCP ${t}`:null}function As({clusterId:s}){var r,i,l,o,c,p;const{data:t,loading:a,error:n}=Os(s);return e.jsxs(e.Fragment,{children:[e.jsx(b,{component:"div",children:e.jsx(_,{component:"p",children:"View details about this cluster"})}),e.jsx(z,{component:"div"}),e.jsx(b,{isFilled:!0,children:n?e.jsx(ve,{children:e.jsx(st,{title:"There was an error loading the cluster details",headingLevel:"h2",icon:pt,status:"danger",children:rt(n)})}):a?e.jsx(ve,{children:e.jsx(Yt,{size:"xl"})}):t&&e.jsxs(D,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(Jt,{columnModifier:{default:"1Col"},children:[e.jsxs(G,{children:[e.jsx(W,{children:"Cluster type"}),e.jsx(Q,{children:Ee(t.cluster.type)})]}),we((r=t.cluster.status)==null?void 0:r.providerMetadata)&&e.jsxs(G,{children:[e.jsx(W,{children:"Cloud provider"}),e.jsx(Q,{children:we((i=t.cluster.status)==null?void 0:i.providerMetadata)})]}),((o=(l=t.cluster.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.buildDate)&&e.jsxs(G,{children:[e.jsx(W,{children:"Build date"}),e.jsx(Q,{children:_e(t.cluster.status.orchestratorMetadata.buildDate)})]}),((p=(c=t.cluster.status)==null?void 0:c.orchestratorMetadata)==null?void 0:p.version)&&e.jsxs(G,{children:[e.jsx(W,{children:"K8s version"}),e.jsx(Q,{children:t.cluster.status.orchestratorMetadata.version})]})]}),e.jsx(Wt,{toggleText:"Labels",labels:t.cluster.labels})]})})]})}const _s=[ne,at,ie,N],Rs={field:N,direction:"desc"},Bs=g`
    fragment ClusterVulnerabilityFragment on ClusterVulnerability {
        id
        cve
        isFixable
        cvss
        scoreVersion
        vulnerabilityType
        summary
    }
`;function Ns({tableState:s,getSortParams:t,onClearFilters:a}){const r=Ue();return e.jsxs(oe,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(ce,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(Ke,{}),e.jsx(y,{sort:t(ne),children:"CVE"}),e.jsx(y,{sort:t(at),children:"CVE status"}),e.jsx(y,{sort:t(ie),children:"CVE type"}),e.jsx(y,{sort:t(N),children:"CVSS"})]})}),e.jsx(re,{tableState:s,colSpan:5,emptyProps:{message:"No CVEs were detected for this cluster"},filteredEmptyProps:{onClearFilters:a},renderer:({data:i})=>i.map((l,o)=>{const{id:c,cve:p,isFixable:u,vulnerabilityType:v,cvss:j,scoreVersion:T,summary:x}=l,F=r.has(p);return e.jsxs(ue,{isExpanded:F,children:[e.jsxs($,{children:[e.jsx(d,{expand:{rowIndex:o,isExpanded:F,onToggle:()=>r.toggle(p)}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(de,{to:ae("CVE",c),children:p})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:u})}),e.jsx(d,{dataLabel:"CVE type",children:ze(v)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(Ge,{cvss:j,scoreVersion:T})})]}),e.jsxs($,{isExpanded:F,children:[e.jsx(d,{}),e.jsx(d,{colSpan:4,children:e.jsx(nt,{children:x?e.jsx(_,{component:"p",children:x}):e.jsx(We,{})})})]})]},p)})})]})}const ws=g`
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
`;function Ms({clusterId:s,query:t,...a}){return I(ws,{variables:{id:s,query:t,pagination:ee(a)}})}const ks="var(--pf-t--global--text--color--disabled)",Us=[{status:"Fixable",Icon:_t,text:({fixable:s})=>`${R(s,"vulnerability","vulnerabilities")} with available fixes`},{status:"Not fixable",Icon:es,text:({total:s,fixable:t})=>`${R(s-t,"vulnerability","vulnerabilities")} without fixes`}],Ks={Fixable:"Fixable hidden","Not fixable":"Not fixable hidden"},zs=g`
    fragment PlatformCveCountByStatusFragment on PlatformCVECountByFixability {
        total
        fixable
    }
`;function Gs({data:s,hiddenStatuses:t}){return e.jsxs(pe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(xe,{children:"CVEs by status"}),e.jsx(Ce,{children:e.jsx(D,{direction:{default:"column"},children:Us.map(({status:a,Icon:n,text:r})=>{const i=t.has(a);return e.jsxs(D,{spaceItems:{default:"spaceItemsSm"},alignItems:{default:"alignItemsCenter"},children:[e.jsx(n,{}),e.jsx(_,{component:"p",style:{color:i?ks:"inherit"},children:i?Ks[a]:r(s)})]},a)})})})]})}const Ws=[{type:"OpenShift CVE",field:"openshift"},{type:"Kubernetes CVE",field:"kubernetes"},{type:"Istio CVE",field:"istio"}],Qs=g`
    fragment PlatformCveCountByTypeFragment on PlatformCVECountByType {
        kubernetes
        openshift
        istio
    }
`;function Hs({data:s}){return e.jsxs(pe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(xe,{children:"CVEs by type"}),e.jsx(Ce,{children:e.jsx(D,{direction:{default:"column"},children:Ws.map(({type:t,field:a})=>e.jsx(ge,{span:12,children:e.jsx(_,{component:"p",children:R(s[a],t)})},t))})})]})}const Zs=g`
    ${zs}
    ${Qs}
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
`;function Xs(s,t){return I(Zs,{variables:{id:s,query:t}})}const Ys=[Ze];function Js({clusterId:s}){var S,q;const{analyticsTrack:t}=Te(),a=qe(t),{searchFilter:n,setSearchFilter:r}=Fe(),i=Ie(n),l=Rt(i),o=$e(i),{page:c,perPage:p,setPage:u,setPerPage:v}=Ve(Pe),{sortOption:j,getSortParams:T}=Le({sortFields:_s,defaultSortOption:Rs,onSort:()=>u(1)}),{data:x,loading:F,error:L}=Ms({clusterId:s,query:l,page:c,perPage:p,sortOption:j}),E=Xs(s,l),V=Bt(i),C=((S=x==null?void 0:x.cluster)==null?void 0:S.clusterVulnerabilityCount)??0,f=se({isLoading:F,error:L,data:(q=x==null?void 0:x.cluster)==null?void 0:q.clusterVulnerabilities,searchFilter:i});return e.jsxs(e.Fragment,{children:[e.jsx(b,{component:"div",children:e.jsx(_,{component:"p",children:"Review and triage vulnerability data scanned on this cluster"})}),e.jsx(z,{component:"div"}),e.jsxs(b,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(De,{className:"pf-v6-u-pb-0 pf-v6-u-px-sm",searchFilter:n,searchFilterConfig:Ys,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(m,h)=>{r(m),a(Oe,h)},includeCveSeverityFilters:!1}),e.jsxs(et,{isLoading:E.loading,error:E.error,children:[e.jsx(Z,{loadingText:"Loading platform CVEs by status summary",data:E.data,renderer:({data:m})=>e.jsx(Gs,{data:m.cluster.platformCVECountByFixability,hiddenStatuses:V})}),e.jsx(Z,{loadingText:"Loading platform CVEs by type summary",data:E.data,renderer:({data:m})=>e.jsx(Hs,{data:m.cluster.platformCVECountByType})})]}),e.jsx(z,{component:"div"}),e.jsxs(ut,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(X,{isFilled:!0,children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(K,{headingLevel:"h2",className:"pf-v6-u-w-50",children:x?`${R(C,"result")} found`:e.jsx(Ae,{screenreaderText:"Loading cluster vulnerability count"})}),o&&e.jsx(tt,{})]})}),e.jsx(X,{children:e.jsx(dt,{itemCount:C,perPage:p,page:c,onSetPage:(m,h)=>u(h),onPerPageSelect:(m,h)=>{v(h)}})})]}),e.jsx(Ns,{tableState:f,getSortParams:T,onClearFilters:()=>{r({}),u(1)}})]})]})}const er="ClusterPageDetails",tr="ClusterPageVulnerabilities",sr=Ye("Platform",{entityTab:"Cluster"}),rr=g`
    ${$s}
    query getClusterMetadata($id: ID!) {
        cluster(id: $id) {
            ...ClusterMetadata
        }
    }
`;function ar(){var c;const{clusterId:s}=it(),{data:t,error:a}=I(rr,{variables:{id:s}}),[n,r]=Qe("detailsTab",ye),i=ye[0],l=ye[1],o=((c=t==null?void 0:t.cluster)==null?void 0:c.name)??"";return e.jsxs(e.Fragment,{children:[e.jsx(le,{title:`Platform CVEs - Cluster ${o}`}),e.jsx(b,{type:"breadcrumb",children:e.jsxs(lt,{children:[e.jsx(Xe,{to:sr,children:"Clusters"}),e.jsx(ot,{isActive:!0,children:o??e.jsx(Ae,{screenreaderText:"Loading cluster name",width:"200px"})})]})}),a?e.jsx(b,{hasBodyWrapper:!1,children:e.jsx(ve,{children:e.jsx(st,{title:rt(a),headingLevel:"h2",icon:pt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(b,{hasBodyWrapper:!1,children:e.jsx(Ds,{data:t==null?void 0:t.cluster})}),e.jsx(b,{type:"tabs",children:e.jsxs(ts,{activeKey:n,onSelect:(p,u)=>{r(u)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Re,{eventKey:i,tabContentId:tr,title:i,children:e.jsx(Js,{clusterId:s})}),e.jsx(Re,{eventKey:l,tabContentId:er,title:l,children:e.jsx(As,{clusterId:s})})]})})]})]})}function xr(){const{hasReadAccess:s}=Nt(),t=s("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(wt,{}),e.jsxs(ss,{children:[e.jsx(H,{index:!0,element:e.jsx(hs,{})}),e.jsx(H,{path:"cves/:cveId",element:e.jsx(Is,{})}),e.jsx(H,{path:"clusters/:clusterId",element:e.jsx(ar,{})}),e.jsx(H,{path:"*",element:e.jsxs(b,{hasBodyWrapper:!1,children:[e.jsx(le,{title:"Platform CVEs - Not Found"}),e.jsx(Mt,{})]})})]})]})}export{xr as default};
