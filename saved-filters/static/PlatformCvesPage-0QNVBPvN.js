import{lN as _,mq as _e,mr as H,ms as X,cb as Z,lz as Y,dq as J,t as e,ax as ee,ay as te,X as q,az as y,lI as Be,dc as se,aA as re,ao as d,b0 as ae,mt as ne,b1 as A,mu as fe,lA as ie,mv as le,m3 as B,ey as Ne,lF as Me,lG as jt,lH as gt,lJ as bt,m0 as je,mw as we,lq as ke,b3 as vt,cq as Ue,ae as R,lL as ze,bF as ge,d0 as Ke,mx as Et,cu as be,ct as ve,ld as Ee,cv as Se,lR as Te,dr as Ve,lS as St,lT as Tt,ag as oe,a3 as T,at as D,a4 as w,au as pe,lU as Vt,aO as Ft,bK as Lt,I as Pt,my as It,lW as $t,lf as Fe,lX as Ge,mz as Qe,l6 as Le,mA as Pe,m5 as qt,dG as Dt,aI as ce,aK as ue,aL as de,bC as me,bg as M,ba as We,b6 as He,b7 as Xe,m9 as Ze,b8 as Ye,dZ as Ie,dY as Je,aR as he,d6 as $e,bL as Ot,mf as et,b9 as k,mb as tt,mc as Q,dR as st,fL as W,me as rt,cs as at,bc as ye,bP as nt,ck as it,cd as lt,bd as Rt,cg as At,ch as U,ci as z,cj as K,mB as ot,dX as _t,fw as Bt,dW as Nt,mh as Mt,mj as Ce,a5 as wt,a6 as De,aY as kt,mk as Ut,c8 as zt,c9 as G,eV as Kt}from"./index-Jy4HxVPG.js";import{r as Gt}from"./redoc-BV_IUP-P.js";import{u as Qt,a as Wt,b as Ht,S as Xt,c as Zt,E as Yt}from"./ExpandableLabelSection-CDi0dbVc.js";import{u as $,g as f,f as Jt}from"./apollo-Cfo4Lhty.js";import"./lodash-JMWJiBov.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-DyN-SoXj.js";const es=f`
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
`,ts=[_,_e,H,X],Oe={field:_,direction:"asc"};function ss({querySearchFilter:s,isFiltered:t,pagination:a,sortOption:n,getSortParams:r,onClearFilters:i}){const{page:l,perPage:o}=a,{data:c,previousData:x,error:u,loading:g}=$(es,{variables:{query:Y(s),pagination:Z({page:l,perPage:o,sortOption:n})}}),j=c??x,V=J({isLoading:g,data:j==null?void 0:j.clusters,error:u,searchFilter:s});return e.jsxs(ee,{borders:V.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":g?"true":"false",children:[e.jsx(te,{noWrap:!0,children:e.jsxs(q,{children:[e.jsx(y,{sort:r(_),children:"Cluster"}),e.jsxs(y,{sort:r(_e),children:["CVEs",t&&e.jsx(Be,{})]}),e.jsx(y,{sort:r(H),children:"Platform type"}),e.jsx(y,{sort:r(X),children:"Kubernetes version"})]})}),e.jsx(se,{tableState:V,colSpan:4,emptyProps:{message:"No secured clusters have been detected"},filteredEmptyProps:{onClearFilters:i},renderer:({data:F})=>F.map(({id:P,name:b,clusterVulnerabilityCount:L,type:p,status:h})=>{var v;return e.jsx(re,{children:e.jsxs(q,{children:[e.jsx(d,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(ae,{to:ne("Cluster",P),children:b})}),e.jsx(d,{dataLabel:"CVEs",children:A(L,"CVE")}),e.jsx(d,{dataLabel:"Platform type",children:fe(p)}),e.jsx(d,{dataLabel:"Kubernetes version",children:((v=h==null?void 0:h.orchestratorMetadata)==null?void 0:v.version)??"Unavailable"})]})},P)})})]})}const rs=f`
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
`;function as({querySearchFilter:s,...t}){return $(rs,{variables:{query:Y(s),pagination:Z(t)}})}const ns=f`
    query getTotalClusterCount {
        clusterCount
    }
`,is=[ie,le,B],Re={field:B,direction:"desc"};function ls({querySearchFilter:s,isFiltered:t,pagination:a,selectedCves:n,canSelectRows:r,createRowActions:i,sortOption:l,getSortParams:o,onClearFilters:c}){var v;const{page:x,perPage:u}=a,{data:g,previousData:j,error:V,loading:C}=as({querySearchFilter:s,page:x,perPage:u,sortOption:l}),P=((v=$(ns).data)==null?void 0:v.clusterCount)??0,b=g??j,L=J({isLoading:C,data:b==null?void 0:b.platformCVEs,error:V,searchFilter:s}),p=Ne(),h=r?8:6;return e.jsxs(ee,{borders:L.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":C?"true":"false",children:[e.jsx(te,{noWrap:!0,children:e.jsxs(q,{children:[e.jsx(Me,{}),r&&e.jsx(jt,{selectedCves:n}),e.jsx(y,{sort:o(ie),children:"CVE"}),e.jsx(y,{children:"CVE status"}),e.jsx(y,{sort:o(le),children:"CVE type"}),e.jsx(y,{sort:o(B),children:"CVSS"}),e.jsxs(gt,{tooltip:"Ratio of the number of clusters affected by this CVE to the total number of secured clusters",sort:void 0,children:["Affected clusters",t&&e.jsx(Be,{})]}),r&&e.jsx(y,{screenReaderText:"Row actions"})]})}),e.jsx(se,{tableState:L,colSpan:h,emptyProps:{message:"No CVEs have been detected for your secured clusters"},filteredEmptyProps:{onClearFilters:c},renderer:({data:O})=>O.map((E,m)=>{const{id:S,cve:I,isFixable:N,cveType:ut,cvss:dt,clusterVulnerability:{summary:qe,scoreVersion:xt},clusterCountByType:Ct}=E,xe=p.has(I),{generic:pt,kubernetes:mt,openshift:ht,openshift4:yt}=Ct,ft=pt+mt+ht+yt;return e.jsxs(re,{isExpanded:xe,children:[e.jsxs(q,{children:[e.jsx(d,{expand:{rowIndex:m,isExpanded:xe,onToggle:()=>p.toggle(I)}}),r&&e.jsx(bt,{selectedCves:n,rowIndex:m,item:{cve:I}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ae,{to:ne("CVE",S),children:I})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(je,{isFixable:N})}),e.jsx(d,{dataLabel:"CVE type",children:we(ut)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(ke,{cvss:dt,scoreVersion:xt})}),e.jsxs(d,{dataLabel:"Affected clusters",children:[ft," / ",P," affected clusters"]}),r&&e.jsx(d,{isActionCell:!0,children:e.jsx(vt,{items:i({cve:I})})})]}),e.jsxs(q,{isExpanded:xe,children:[e.jsx(d,{}),e.jsx(d,{colSpan:h-1,children:e.jsx(Ue,{children:qe?e.jsx(R,{component:"p",children:qe}):e.jsx(ze,{})})})]})]},S)})})]})}const os=f`
    query getPlatformCVEEntityCounts($query: String) {
        platformCVECount(query: $query)
        clusterCount(query: $query)
    }
`;function cs(s){return $(os,{variables:{query:Y(s)}})}const us=[Ge,Qe];function ds(){var S;const s=Jt(),{analyticsTrack:t}=ge(),a=Le(t),[n]=Ke("entityTab",Et),{searchFilter:r,setSearchFilter:i}=be(),l=ve(Ee),{sortOption:o,getSortParams:c,setSortOption:x}=Se({sortFields:n==="CVE"?is:ts,defaultSortOption:n==="CVE"?Re:Oe,onSort:()=>l.setPage(1)}),u=Te(r),g=Ve(u),j=((S=u["CVE Snoozed"])==null?void 0:S[0])==="true",V=Qt(),C=St(),{snoozeModalOptions:F,setSnoozeModalOptions:P,snoozeActionCreator:b}=Wt(),L=Ht("Platform");function p(I){l.setPage(1),x(I==="CVE"?Re:Oe),t({event:It,properties:{type:I,page:"Overview"}})}Gt.useEffect(()=>{p(n)},[]);const{data:h}=cs(u),v={CVE:(h==null?void 0:h.platformCVECount)??0,Cluster:(h==null?void 0:h.clusterCount)??0};function O(){i({}),l.setPage(1)}const E=e.jsx(Fe,{searchFilter:r,searchFilterConfig:us,defaultSearchFilterEntity:"CVE",cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(I,N)=>{i(I),a(Pe,N)},includeCveSeverityFilters:!1}),m=e.jsx($t,{entityTabs:["CVE","Cluster"],entityCounts:v,onChange:p});return e.jsxs(e.Fragment,{children:[F&&e.jsx(Xt,{...F,onSuccess:(I,N)=>{I==="SNOOZE"&&t({event:Tt,properties:{type:"PLATFORM",duration:N}}),s.cache.evict({fieldName:"platformCVEs"}),s.cache.evict({fieldName:"platformCVECount"}),s.cache.gc(),C.clear()},onClose:()=>P(null)}),e.jsx(oe,{title:"Kubernetes Components Overview"}),e.jsx(T,{children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(D,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(w,{headingLevel:"h1",children:"Kubernetes components"}),e.jsx(pe,{children:"Prioritize and manage scanned CVEs across clusters"})]}),e.jsx(pe,{children:e.jsx(Zt,{searchFilter:r,setSearchFilter:i,snoozedCveCount:L})})]})}),e.jsxs(T,{isFilled:!0,children:[e.jsx(Vt,{filterToolbar:E,entityToggleGroup:m,pagination:l,tableRowCount:n==="CVE"?v.CVE:v.Cluster,isFiltered:g,children:V&&e.jsx(Ft,{align:{default:"alignEnd"},children:e.jsx(Lt,{toggleText:"Bulk actions",isDisabled:C.size===0,children:e.jsx(Pt,{onClick:()=>P({action:j?"UNSNOOZE":"SNOOZE",cveType:"CLUSTER_CVE",cves:Array.from(C.values())}),children:j?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),n==="CVE"&&e.jsx(ls,{querySearchFilter:u,isFiltered:g,pagination:l,selectedCves:C,canSelectRows:V,createRowActions:b("CLUSTER_CVE",j?"UNSNOOZE":"SNOOZE"),sortOption:o,getSortParams:c,onClearFilters:O}),n==="Cluster"&&e.jsx(ss,{querySearchFilter:u,isFiltered:g,pagination:l,sortOption:o,getSortParams:c,onClearFilters:O})]})]})}const xs=[_,H,X],Cs={field:_,direction:"asc"},ps=f`
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
`;function ms({tableState:s,getSortParams:t,onClearFilters:a}){return e.jsxs(ee,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(te,{noWrap:!0,children:e.jsxs(q,{children:[e.jsx(y,{sort:t(_),children:"Cluster"}),e.jsx(y,{sort:t(H),children:"Cluster type"}),e.jsx(y,{children:"CVE status"}),e.jsx(y,{sort:t(X),children:"Kubernetes version"})]})}),e.jsx(se,{tableState:s,colSpan:3,emptyProps:{message:"No clusters have been reported for this CVE"},filteredEmptyProps:{onClearFilters:a},renderer:({data:n})=>e.jsx(re,{children:n.map(({id:r,name:i,type:l,clusterVulnerabilities:o,status:c})=>{var u;const x=qt(o);return e.jsxs(q,{children:[e.jsx(d,{dataLabel:"Cluster",children:e.jsx(ae,{to:ne("Cluster",r),children:e.jsx(Dt,{position:"middle",content:i})})}),e.jsx(d,{dataLabel:"Cluster type",modifier:"nowrap",children:fe(l)}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(je,{isFixable:x})}),e.jsx(d,{dataLabel:"Kubernetes version",modifier:"nowrap",children:((u=c==null?void 0:c.orchestratorMetadata)==null?void 0:u.version)??"Unavailable"})]},r)})})})]})}const hs=f`
    ${ps}
    query getAffectedClusters($query: String, $pagination: Pagination) {
        clusterCount(query: $query)
        clusters(query: $query, pagination: $pagination) {
            ...AffectedClusterFragment
        }
    }
`;function ys({query:s,...t}){var n,r,i;const a=$(hs,{variables:{query:s,pagination:Z(t)}});return{affectedClustersRequest:a,clusterCount:((n=a.data)==null?void 0:n.clusterCount)??0,clusterData:((r=a.data)==null?void 0:r.clusters)??((i=a.previousData)==null?void 0:i.clusters)}}const ct=f`
    fragment ClustersByType on PlatformCVECore {
        clusterCountByType {
            generic
            kubernetes
            openshift
            openshift4
        }
    }
`;function fs({clusterCounts:s}){const{generic:t=0,kubernetes:a=0,openshift:n=0,openshift4:r=0}=s??{},i=t+a+n+r;return e.jsxs(ce,{isCompact:!0,isFullHeight:!0,children:[e.jsx(ue,{children:"Clusters by type"}),e.jsx(de,{children:i>0?e.jsxs(me,{children:[t>0&&e.jsxs(M,{span:12,className:"pf-v6-u-pt-xs",children:[t," Generic"]}),a>0&&e.jsxs(M,{span:12,className:"pf-v6-u-pt-xs",children:[a," Kubernetes"]}),n+r>0&&e.jsxs(M,{span:12,className:"pf-v6-u-pt-xs",children:[n+r," OpenShift"]})]}):e.jsx(me,{children:e.jsx(M,{span:12,className:"pf-v6-u-pt-xs",children:"No affected clusters found"})})})]})}const js=f`
    ${ct}
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
`;function gs(s){return $(js,{variables:{cveID:s}})}function bs({affectedClusterCount:s,totalClusterCount:t}){return e.jsxs(ce,{isCompact:!0,isFullHeight:!0,children:[e.jsx(ue,{children:"Affected clusters"}),e.jsx(de,{children:e.jsx(me,{children:e.jsxs(M,{span:12,className:"pf-v6-u-pt-sm",children:[s," / ",t," affected clusters"]})})})]})}const vs=f`
    ${ct}
    query getPlatformCVEMetadata($cveID: String!, $query: String!) {
        totalClusterCount: clusterCount
        clusterCount(query: $query)
        platformCVE(cveID: $cveID, subfieldScopeQuery: $query) {
            ...ClustersByType
        }
    }
`;function Es({cveId:s,query:t}){return $(vs,{variables:{cveID:s,query:t}})}const Ss=Ze("Platform",{entityTab:"CVE"}),Ts=[Ge];function Vs(){var E;const{analyticsTrack:s}=ge(),t=Le(s),{searchFilter:a,setSearchFilter:n}=be(),r=Te(a),i=We(),l=decodeURIComponent(i.cveId),o=Y({...r,"CVE ID":[l]}),{page:c,perPage:x,setPage:u,setPerPage:g}=ve(Ee),{sortOption:j,getSortParams:V}=Se({sortFields:xs,defaultSortOption:Cs,onSort:()=>u(1)}),{affectedClustersRequest:C,clusterData:F,clusterCount:P}=ys({query:o,page:c,perPage:x,sortOption:j}),b=gs(l),L=Es({cveId:l,query:o}),p=(E=b.data)==null?void 0:E.platformCVE,h=p==null?void 0:p.cve,v=Ve(r),O=J({isLoading:C.loading,error:C.error,data:F,searchFilter:r});return e.jsxs(e.Fragment,{children:[e.jsx(oe,{title:`Kubernetes components - Vulnerability ${h}`}),e.jsx(T,{type:"breadcrumb",children:e.jsxs(He,{children:[e.jsx(Xe,{to:Ss,children:"Kubernetes components"}),e.jsx(Ye,{isActive:!0,children:h??e.jsx(Ie,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(T,{children:p?e.jsxs(D,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},spaceItems:{default:"spaceItemsSm"},children:[e.jsx(w,{headingLevel:"h1",children:p.cve}),p.firstDiscoveredTime&&e.jsx(Je,{numLabels:1,children:e.jsxs(he,{children:["First discovered in system:"," ",$e(p.firstDiscoveredTime)]})}),e.jsx(R,{component:"p",children:p.clusterVulnerability.summary}),e.jsx(Ot,{children:e.jsx("a",{href:p.clusterVulnerability.link,target:"_blank",rel:"noopener noreferrer",children:p.clusterVulnerability.link})})]}):e.jsx(et,{nameScreenreaderText:"Loading CVE name",metadataScreenreaderText:"Loading CVE metadata"})}),e.jsx(k,{component:"div"}),e.jsxs(T,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(Fe,{searchFilter:a,searchFilterConfig:Ts,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(m,S)=>{n(m),t(Pe,S)},includeCveSeverityFilters:!1}),e.jsxs(tt,{error:L.error,isLoading:L.loading,children:[e.jsx(Q,{data:L.data,loadingText:"Loading affected nodes summary",renderer:({data:m})=>e.jsx(bs,{affectedClusterCount:m.clusterCount,totalClusterCount:m.totalClusterCount})}),e.jsx(Q,{data:L.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:m})=>{var S;return e.jsx(fs,{clusterCounts:(S=m.platformCVE)==null?void 0:S.clusterCountByType})}})]}),e.jsx(k,{component:"div"}),e.jsxs(st,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(W,{isFilled:!0,children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(w,{headingLevel:"h2",children:[A(P,"cluster")," affected"]}),v&&e.jsx(rt,{})]})}),e.jsx(W,{children:e.jsx(at,{itemCount:P,perPage:x,page:c,onSetPage:(m,S)=>u(S),onPerPageSelect:(m,S)=>{g(S)}})})]}),e.jsx(ms,{tableState:O,getSortParams:V,onClearFilters:()=>{n({}),u(1)}})]})]})}const Fs=f`
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
`;function Ls({data:s}){var r,i,l,o;if(!s)return e.jsx(et,{nameScreenreaderText:"Loading Cluster name",metadataScreenreaderText:"Loading Cluster metadata"});const t=(i=(r=s.status)==null?void 0:r.orchestratorMetadata)==null?void 0:i.buildDate,a=(o=(l=s.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.version,n=0+(t?1:0)+(a?1:0);return e.jsxs(D,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(w,{headingLevel:"h1",className:"pf-v6-u-mb-sm",children:s.name}),n>0&&e.jsxs(Je,{numLabels:n,children:[a&&e.jsxs(he,{children:["K8s version: ",a]}),t&&e.jsxs(he,{children:["Build date: ",$e(t)]})]})]})}const Ps=f`
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
`;function Is(s){return $(Ps,{variables:{id:s}})}function Ae(s){if(!s)return null;const{region:t}=s;return s.aws?`AWS ${t}`:s.azure?`Azure ${t}`:s.google?`GCP ${t}`:null}function $s({clusterId:s}){var r,i,l,o,c,x;const{data:t,loading:a,error:n}=Is(s);return e.jsxs(e.Fragment,{children:[e.jsx(T,{component:"div",children:e.jsx(R,{component:"p",children:"View details about this cluster"})}),e.jsx(k,{component:"div"}),e.jsx(T,{isFilled:!0,children:n?e.jsx(ye,{children:e.jsx(nt,{title:"There was an error loading the cluster details",headingLevel:"h2",icon:lt,status:"danger",children:it(n)})}):a?e.jsx(ye,{children:e.jsx(Rt,{size:"xl"})}):t&&e.jsxs(D,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(At,{columnModifier:{default:"1Col"},children:[e.jsxs(U,{children:[e.jsx(z,{children:"Cluster type"}),e.jsx(K,{children:fe(t.cluster.type)})]}),Ae((r=t.cluster.status)==null?void 0:r.providerMetadata)&&e.jsxs(U,{children:[e.jsx(z,{children:"Cloud provider"}),e.jsx(K,{children:Ae((i=t.cluster.status)==null?void 0:i.providerMetadata)})]}),((o=(l=t.cluster.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.buildDate)&&e.jsxs(U,{children:[e.jsx(z,{children:"Build date"}),e.jsx(K,{children:$e(t.cluster.status.orchestratorMetadata.buildDate)})]}),((x=(c=t.cluster.status)==null?void 0:c.orchestratorMetadata)==null?void 0:x.version)&&e.jsxs(U,{children:[e.jsx(z,{children:"K8s version"}),e.jsx(K,{children:t.cluster.status.orchestratorMetadata.version})]})]}),e.jsx(Yt,{toggleText:"Labels",labels:t.cluster.labels})]})})]})}const qs=[ie,ot,le,B],Ds={field:B,direction:"desc"},Os=f`
    fragment ClusterVulnerabilityFragment on ClusterVulnerability {
        id
        cve
        isFixable
        cvss
        scoreVersion
        vulnerabilityType
        summary
    }
`;function Rs({tableState:s,getSortParams:t,onClearFilters:a}){const r=Ne();return e.jsxs(ee,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(te,{noWrap:!0,children:e.jsxs(q,{children:[e.jsx(Me,{}),e.jsx(y,{sort:t(ie),children:"CVE"}),e.jsx(y,{sort:t(ot),children:"CVE status"}),e.jsx(y,{sort:t(le),children:"CVE type"}),e.jsx(y,{sort:t(B),children:"CVSS"})]})}),e.jsx(se,{tableState:s,colSpan:5,emptyProps:{message:"No CVEs were detected for this cluster"},filteredEmptyProps:{onClearFilters:a},renderer:({data:i})=>i.map((l,o)=>{const{id:c,cve:x,isFixable:u,vulnerabilityType:g,cvss:j,scoreVersion:V,summary:C}=l,F=r.has(x);return e.jsxs(re,{isExpanded:F,children:[e.jsxs(q,{children:[e.jsx(d,{expand:{rowIndex:o,isExpanded:F,onToggle:()=>r.toggle(x)}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ae,{to:ne("CVE",c),children:x})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(je,{isFixable:u})}),e.jsx(d,{dataLabel:"CVE type",children:we(g)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(ke,{cvss:j,scoreVersion:V})})]}),e.jsxs(q,{isExpanded:F,children:[e.jsx(d,{}),e.jsx(d,{colSpan:4,children:e.jsx(Ue,{children:C?e.jsx(R,{component:"p",children:C}):e.jsx(ze,{})})})]})]},x)})})]})}const As=f`
    ${Os}
    query getClusterVulnerabilities($id: ID!, $query: String!, $pagination: Pagination) {
        cluster(id: $id) {
            id
            clusterVulnerabilityCount(query: $query)
            clusterVulnerabilities(query: $query, pagination: $pagination) {
                ...ClusterVulnerabilityFragment
            }
        }
    }
`;function _s({clusterId:s,query:t,...a}){return $(As,{variables:{id:s,query:t,pagination:Z(a)}})}const Bs="var(--pf-t--global--text--color--disabled)",Ns=[{status:"Fixable",Icon:_t,text:({fixable:s})=>`${A(s,"vulnerability","vulnerabilities")} with available fixes`},{status:"Not fixable",Icon:Bt,text:({total:s,fixable:t})=>`${A(s-t,"vulnerability","vulnerabilities")} without fixes`}],Ms={Fixable:"Fixable hidden","Not fixable":"Not fixable hidden"},ws=f`
    fragment PlatformCveCountByStatusFragment on PlatformCVECountByFixability {
        total
        fixable
    }
`;function ks({data:s,hiddenStatuses:t}){return e.jsxs(ce,{isCompact:!0,isFullHeight:!0,children:[e.jsx(ue,{children:"CVEs by status"}),e.jsx(de,{children:e.jsx(D,{direction:{default:"column"},children:Ns.map(({status:a,Icon:n,text:r})=>{const i=t.has(a);return e.jsxs(D,{spaceItems:{default:"spaceItemsSm"},alignItems:{default:"alignItemsCenter"},children:[e.jsx(n,{}),e.jsx(R,{component:"p",style:{color:i?Bs:"inherit"},children:i?Ms[a]:r(s)})]},a)})})})]})}const Us=[{type:"OpenShift CVE",field:"openshift"},{type:"Kubernetes CVE",field:"kubernetes"},{type:"Istio CVE",field:"istio"}],zs=f`
    fragment PlatformCveCountByTypeFragment on PlatformCVECountByType {
        kubernetes
        openshift
        istio
    }
`;function Ks({data:s}){return e.jsxs(ce,{isCompact:!0,isFullHeight:!0,children:[e.jsx(ue,{children:"CVEs by type"}),e.jsx(de,{children:e.jsx(D,{direction:{default:"column"},children:Us.map(({type:t,field:a})=>e.jsx(pe,{span:12,children:e.jsx(R,{component:"p",children:A(s[a],t)})},t))})})]})}const Gs=f`
    ${ws}
    ${zs}
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
`;function Qs(s,t){return $(Gs,{variables:{id:s,query:t}})}const Ws=[Qe];function Hs({clusterId:s}){var v,O;const{analyticsTrack:t}=ge(),a=Le(t),{searchFilter:n,setSearchFilter:r}=be(),i=Te(n),l=Nt(i),o=Ve(i),{page:c,perPage:x,setPage:u,setPerPage:g}=ve(Ee),{sortOption:j,getSortParams:V}=Se({sortFields:qs,defaultSortOption:Ds,onSort:()=>u(1)}),{data:C,loading:F,error:P}=_s({clusterId:s,query:l,page:c,perPage:x,sortOption:j}),b=Qs(s,l),L=Mt(i),p=((v=C==null?void 0:C.cluster)==null?void 0:v.clusterVulnerabilityCount)??0,h=J({isLoading:F,error:P,data:(O=C==null?void 0:C.cluster)==null?void 0:O.clusterVulnerabilities,searchFilter:i});return e.jsxs(e.Fragment,{children:[e.jsx(T,{component:"div",children:e.jsx(R,{component:"p",children:"Review and triage vulnerability data scanned on this cluster"})}),e.jsx(k,{component:"div"}),e.jsxs(T,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(Fe,{className:"pf-v6-u-pb-0 pf-v6-u-px-sm",searchFilter:n,searchFilterConfig:Ws,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(E,m)=>{r(E),a(Pe,m)},includeCveSeverityFilters:!1}),e.jsxs(tt,{isLoading:b.loading,error:b.error,children:[e.jsx(Q,{loadingText:"Loading platform CVEs by status summary",data:b.data,renderer:({data:E})=>e.jsx(ks,{data:E.cluster.platformCVECountByFixability,hiddenStatuses:L})}),e.jsx(Q,{loadingText:"Loading platform CVEs by type summary",data:b.data,renderer:({data:E})=>e.jsx(Ks,{data:E.cluster.platformCVECountByType})})]}),e.jsx(k,{component:"div"}),e.jsxs(st,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(W,{isFilled:!0,children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(w,{headingLevel:"h2",className:"pf-v6-u-w-50",children:C?`${A(p,"result")} found`:e.jsx(Ie,{screenreaderText:"Loading cluster vulnerability count"})}),o&&e.jsx(rt,{})]})}),e.jsx(W,{children:e.jsx(at,{itemCount:p,perPage:x,page:c,onSetPage:(E,m)=>u(m),onPerPageSelect:(E,m)=>{g(m)}})})]}),e.jsx(Rs,{tableState:h,getSortParams:V,onClearFilters:()=>{r({}),u(1)}})]})]})}const Xs="ClusterPageDetails",Zs="ClusterPageVulnerabilities",Ys=Ze("Platform",{entityTab:"Cluster"}),Js=f`
    ${Fs}
    query getClusterMetadata($id: ID!) {
        cluster(id: $id) {
            ...ClusterMetadata
        }
    }
`;function er(){var c;const{clusterId:s}=We(),{data:t,error:a}=$(Js,{variables:{id:s}}),[n,r]=Ke("detailsTab",Ce),i=Ce[0],l=Ce[1],o=((c=t==null?void 0:t.cluster)==null?void 0:c.name)??"";return e.jsxs(e.Fragment,{children:[e.jsx(oe,{title:`Platform CVEs - Cluster ${o}`}),e.jsx(T,{type:"breadcrumb",children:e.jsxs(He,{children:[e.jsx(Xe,{to:Ys,children:"Clusters"}),e.jsx(Ye,{isActive:!0,children:o??e.jsx(Ie,{screenreaderText:"Loading cluster name",width:"200px"})})]})}),a?e.jsx(T,{hasBodyWrapper:!1,children:e.jsx(ye,{children:e.jsx(nt,{title:it(a),headingLevel:"h2",icon:lt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(T,{hasBodyWrapper:!1,children:e.jsx(Ls,{data:t==null?void 0:t.cluster})}),e.jsx(T,{type:"tabs",children:e.jsxs(wt,{activeKey:n,onSelect:(x,u)=>{r(u)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(De,{eventKey:i,tabContentId:Zs,title:i,children:e.jsx(Hs,{clusterId:s})}),e.jsx(De,{eventKey:l,tabContentId:Xs,title:l,children:e.jsx($s,{clusterId:s})})]})})]})]})}function or(){const{hasReadAccess:s}=kt(),t=s("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(Ut,{}),e.jsxs(zt,{children:[e.jsx(G,{index:!0,element:e.jsx(ds,{})}),e.jsx(G,{path:"cves/:cveId",element:e.jsx(Vs,{})}),e.jsx(G,{path:"clusters/:clusterId",element:e.jsx(er,{})}),e.jsx(G,{path:"*",element:e.jsxs(T,{hasBodyWrapper:!1,children:[e.jsx(oe,{title:"Platform CVEs - Not Found"}),e.jsx(Kt,{})]})})]})]})}export{or as default};
