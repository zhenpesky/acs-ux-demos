import{m5 as B,mK as Me,mL as Y,mM as J,ca as ee,lT as te,dq as se,t as e,ax as re,ay as ae,X as $,az as f,m0 as ke,dc as ne,aA as ie,ao as d,a$ as le,mN as oe,b0 as R,mO as Ee,lU as ce,mP as ue,mn as N,ey as Ue,lZ as Ke,l_ as jt,l$ as gt,m1 as bt,mk as Se,mQ as ze,lK as Qe,b2 as vt,cp as Ge,ae as A,m3 as We,bE as Te,c$ as He,mR as Et,ct as Ve,cs as Fe,lx as Le,cu as Pe,m9 as Ie,dr as $e,ma as St,kj as Tt,kk as Vt,kl as Ft,lz as De,mb as Ze,mS as Xe,lq as qe,mT as Oe,mg as Lt,ag as de,a3 as b,at as D,a4 as K,au as je,mh as Pt,aN as It,bJ as $t,I as Dt,mU as qt,mj as Ot,mp as _t,dG as At,aI as xe,aJ as pe,aK as me,bB as ge,bf as U,b9 as Ye,b5 as Je,b6 as et,mt as tt,b7 as st,dZ as _e,dY as rt,aQ as be,d6 as Ae,bK as Rt,mz as at,b8 as z,mv as nt,mw as Z,dR as it,fO as X,my as lt,cr as ot,bb as ve,bO as ct,cj as ut,cc as dt,bc as Bt,cf as Nt,cg as Q,ch as G,ci as W,mV as xt,dX as wt,fx as Mt,dW as kt,mB as Ut,mD as fe,a5 as Kt,a6 as Re,aX as zt,mE as Qt,c7 as Gt,c8 as H,eV as Wt}from"./index-CeAUh6Su.js";import{u as I,g as j,f as Ht,r as Zt}from"./apollo-BxVF6eGb.js";import{u as Xt,a as Yt,b as Jt,S as es,c as ts,E as ss}from"./ExpandableLabelSection-UJIx8USR.js";import"./react-pF2EnNv3.js";import"./lodash-JMWJiBov.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-Sy1rcTFd.js";const rs=j`
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
`,as=[B,Me,Y,J],Be={field:B,direction:"asc"};function ns({querySearchFilter:s,isFiltered:t,pagination:a,sortOption:n,getSortParams:r,onClearFilters:i}){const{page:l,perPage:o}=a,{data:c,previousData:x,error:u,loading:v}=I(rs,{variables:{query:te(s),pagination:ee({page:l,perPage:o,sortOption:n})}}),g=c??x,T=se({isLoading:v,data:g==null?void 0:g.clusters,error:u,searchFilter:s});return e.jsxs(re,{borders:T.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":v?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(f,{sort:r(B),children:"Cluster"}),e.jsxs(f,{sort:r(Me),children:["CVEs",t&&e.jsx(ke,{})]}),e.jsx(f,{sort:r(Y),children:"Platform type"}),e.jsx(f,{sort:r(J),children:"Kubernetes version"})]})}),e.jsx(ne,{tableState:T,colSpan:4,emptyProps:{message:"No secured clusters have been detected"},filteredEmptyProps:{onClearFilters:i},renderer:({data:V})=>V.map(({id:P,name:E,clusterVulnerabilityCount:F,type:m,status:y})=>{var S;return e.jsx(ie,{children:e.jsxs($,{children:[e.jsx(d,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(le,{to:oe("Cluster",P),children:E})}),e.jsx(d,{dataLabel:"CVEs",children:R(F,"CVE")}),e.jsx(d,{dataLabel:"Platform type",children:Ee(m)}),e.jsx(d,{dataLabel:"Kubernetes version",children:((S=y==null?void 0:y.orchestratorMetadata)==null?void 0:S.version)??"Unavailable"})]})},P)})})]})}const is=j`
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
`;function ls({querySearchFilter:s,...t}){return I(is,{variables:{query:te(s),pagination:ee(t)}})}const os=j`
    query getTotalClusterCount {
        clusterCount
    }
`,cs=[ce,ue,N],Ne={field:N,direction:"desc"};function us({querySearchFilter:s,isFiltered:t,pagination:a,selectedCves:n,canSelectRows:r,createRowActions:i,sortOption:l,getSortParams:o,onClearFilters:c}){var S;const{page:x,perPage:u}=a,{data:v,previousData:g,error:T,loading:p}=ls({querySearchFilter:s,page:x,perPage:u,sortOption:l}),P=((S=I(os).data)==null?void 0:S.clusterCount)??0,E=v??g,F=se({isLoading:p,data:E==null?void 0:E.platformCVEs,error:T,searchFilter:s}),m=Ue(),y=r?8:6;return e.jsxs(re,{borders:F.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":p?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(Ke,{}),r&&e.jsx(jt,{selectedCves:n}),e.jsx(f,{sort:o(ce),children:"CVE"}),e.jsx(f,{children:"CVE status"}),e.jsx(f,{sort:o(ue),children:"CVE type"}),e.jsx(f,{sort:o(N),children:"CVSS"}),e.jsxs(gt,{tooltip:"Ratio of the number of clusters affected by this CVE to the total number of secured clusters",sort:void 0,children:["Affected clusters",t&&e.jsx(ke,{})]}),r&&e.jsx(f,{screenReaderText:"Row actions"})]})}),e.jsx(ne,{tableState:F,colSpan:y,emptyProps:{message:"No CVEs have been detected for your secured clusters"},filteredEmptyProps:{onClearFilters:c},renderer:({data:q})=>q.map((h,C)=>{const{id:L,cve:O,isFixable:w,cveType:Ce,cvss:he,clusterVulnerability:{summary:M,scoreVersion:_},clusterCountByType:k}=h,ye=m.has(O),{generic:mt,kubernetes:Ct,openshift:ht,openshift4:yt}=k,ft=mt+Ct+ht+yt;return e.jsxs(ie,{isExpanded:ye,children:[e.jsxs($,{children:[e.jsx(d,{expand:{rowIndex:C,isExpanded:ye,onToggle:()=>m.toggle(O)}}),r&&e.jsx(bt,{selectedCves:n,rowIndex:C,item:{cve:O}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(le,{to:oe("CVE",L),children:O})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:w})}),e.jsx(d,{dataLabel:"CVE type",children:ze(Ce)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(Qe,{cvss:he,scoreVersion:_})}),e.jsxs(d,{dataLabel:"Affected clusters",children:[ft," / ",P," affected clusters"]}),r&&e.jsx(d,{isActionCell:!0,children:e.jsx(vt,{items:i({cve:O})})})]}),e.jsxs($,{isExpanded:ye,children:[e.jsx(d,{}),e.jsx(d,{colSpan:y-1,children:e.jsx(Ge,{children:M?e.jsx(A,{component:"p",children:M}):e.jsx(We,{})})})]})]},L)})})]})}const ds=j`
    query getPlatformCVEEntityCounts($query: String) {
        platformCVECount(query: $query)
        clusterCount(query: $query)
    }
`;function xs(s){return I(ds,{variables:{query:te(s)}})}const ps=[Ze,Xe];function ms(){var M;const s=Ht(),{analyticsTrack:t}=Te(),a=qe(t),[n]=He("entityTab",Et),{searchFilter:r,setSearchFilter:i}=Ve(),l=Fe(Le),{sortOption:o,getSortParams:c,setSortOption:x}=Pe({sortFields:n==="CVE"?cs:as,defaultSortOption:n==="CVE"?Ne:Be,onSort:()=>l.setPage(1)}),u=Ie(r),v=$e(u),g=((M=u["CVE Snoozed"])==null?void 0:M[0])==="true",T=Xt(),p=St(),{snoozeModalOptions:V,setSnoozeModalOptions:P,snoozeActionCreator:E}=Yt(),F=Jt("Platform");function m(_){l.setPage(1),x(_==="CVE"?Ne:Be),t({event:qt,properties:{type:_,page:"Overview"}})}Zt.useEffect(()=>{m(n)},[]);const{data:y}=xs(u),S={CVE:(y==null?void 0:y.platformCVECount)??0,Cluster:(y==null?void 0:y.clusterCount)??0};function q(){i({}),l.setPage(1)}const h=Tt(),C=h==="v1"||h==="v2",L=Vt({enabled:C&&h==="v1",searchFilter:r,setSearchFilter:i,paginationSetPage:()=>l.setPage(1),storageScope:"platform-cves",filterKind:"workload"}),O=Ft({enabled:C&&h==="v2",searchFilter:r,setSearchFilter:i,paginationSetPage:()=>l.setPage(1),storageScope:"platform-cves",filterKind:"workload"}),w=h==="v2"?O:L,Ce=e.jsx(De,{searchFilter:r,searchFilterConfig:ps,defaultSearchFilterEntity:"CVE",cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(_,k)=>{i(_),a(Oe,k)},includeCveSeverityFilters:!1,prefixToolbarItems:w.prefixToolbarItem??void 0,appliedFilterSuffix:w.appliedFilterSuffix??void 0}),he=e.jsx(Ot,{entityTabs:["CVE","Cluster"],entityCounts:S,onChange:m});return e.jsxs(e.Fragment,{children:[V&&e.jsx(es,{...V,onSuccess:(_,k)=>{_==="SNOOZE"&&t({event:Lt,properties:{type:"PLATFORM",duration:k}}),s.cache.evict({fieldName:"platformCVEs"}),s.cache.evict({fieldName:"platformCVECount"}),s.cache.gc(),p.clear()},onClose:()=>P(null)}),e.jsx(de,{title:"Kubernetes Components Overview"}),e.jsx(b,{children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(D,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(K,{headingLevel:"h1",children:"Kubernetes components"}),e.jsx(je,{children:"Prioritize and manage scanned CVEs across clusters"})]}),e.jsx(je,{children:e.jsx(ts,{searchFilter:r,setSearchFilter:i,snoozedCveCount:F})})]})}),h==="v2"&&O.wysiwygAlert&&e.jsx(b,{children:O.wysiwygAlert}),e.jsxs(b,{isFilled:!0,children:[e.jsx(Pt,{filterToolbar:Ce,entityToggleGroup:he,pagination:l,tableRowCount:n==="CVE"?S.CVE:S.Cluster,isFiltered:v,children:T&&e.jsx(It,{align:{default:"alignEnd"},children:e.jsx($t,{toggleText:"Bulk actions",isDisabled:p.size===0,children:e.jsx(Dt,{onClick:()=>P({action:g?"UNSNOOZE":"SNOOZE",cveType:"CLUSTER_CVE",cves:Array.from(p.values())}),children:g?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),n==="CVE"&&e.jsx(us,{querySearchFilter:u,isFiltered:v,pagination:l,selectedCves:p,canSelectRows:T,createRowActions:E("CLUSTER_CVE",g?"UNSNOOZE":"SNOOZE"),sortOption:o,getSortParams:c,onClearFilters:q}),n==="Cluster"&&e.jsx(ns,{querySearchFilter:u,isFiltered:v,pagination:l,sortOption:o,getSortParams:c,onClearFilters:q})]}),w.modalsFragment]})}const Cs=[B,Y,J],hs={field:B,direction:"asc"},ys=j`
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
`;function fs({tableState:s,getSortParams:t,onClearFilters:a}){return e.jsxs(re,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(f,{sort:t(B),children:"Cluster"}),e.jsx(f,{sort:t(Y),children:"Cluster type"}),e.jsx(f,{children:"CVE status"}),e.jsx(f,{sort:t(J),children:"Kubernetes version"})]})}),e.jsx(ne,{tableState:s,colSpan:3,emptyProps:{message:"No clusters have been reported for this CVE"},filteredEmptyProps:{onClearFilters:a},renderer:({data:n})=>e.jsx(ie,{children:n.map(({id:r,name:i,type:l,clusterVulnerabilities:o,status:c})=>{var u;const x=_t(o);return e.jsxs($,{children:[e.jsx(d,{dataLabel:"Cluster",children:e.jsx(le,{to:oe("Cluster",r),children:e.jsx(At,{position:"middle",content:i})})}),e.jsx(d,{dataLabel:"Cluster type",modifier:"nowrap",children:Ee(l)}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:x})}),e.jsx(d,{dataLabel:"Kubernetes version",modifier:"nowrap",children:((u=c==null?void 0:c.orchestratorMetadata)==null?void 0:u.version)??"Unavailable"})]},r)})})})]})}const js=j`
    ${ys}
    query getAffectedClusters($query: String, $pagination: Pagination) {
        clusterCount(query: $query)
        clusters(query: $query, pagination: $pagination) {
            ...AffectedClusterFragment
        }
    }
`;function gs({query:s,...t}){var n,r,i;const a=I(js,{variables:{query:s,pagination:ee(t)}});return{affectedClustersRequest:a,clusterCount:((n=a.data)==null?void 0:n.clusterCount)??0,clusterData:((r=a.data)==null?void 0:r.clusters)??((i=a.previousData)==null?void 0:i.clusters)}}const pt=j`
    fragment ClustersByType on PlatformCVECore {
        clusterCountByType {
            generic
            kubernetes
            openshift
            openshift4
        }
    }
`;function bs({clusterCounts:s}){const{generic:t=0,kubernetes:a=0,openshift:n=0,openshift4:r=0}=s??{},i=t+a+n+r;return e.jsxs(xe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(pe,{children:"Clusters by type"}),e.jsx(me,{children:i>0?e.jsxs(ge,{children:[t>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[t," Generic"]}),a>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[a," Kubernetes"]}),n+r>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[n+r," OpenShift"]})]}):e.jsx(ge,{children:e.jsx(U,{span:12,className:"pf-v6-u-pt-xs",children:"No affected clusters found"})})})]})}const vs=j`
    ${pt}
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
`;function Es(s){return I(vs,{variables:{cveID:s}})}function Ss({affectedClusterCount:s,totalClusterCount:t}){return e.jsxs(xe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(pe,{children:"Affected clusters"}),e.jsx(me,{children:e.jsx(ge,{children:e.jsxs(U,{span:12,className:"pf-v6-u-pt-sm",children:[s," / ",t," affected clusters"]})})})]})}const Ts=j`
    ${pt}
    query getPlatformCVEMetadata($cveID: String!, $query: String!) {
        totalClusterCount: clusterCount
        clusterCount(query: $query)
        platformCVE(cveID: $cveID, subfieldScopeQuery: $query) {
            ...ClustersByType
        }
    }
`;function Vs({cveId:s,query:t}){return I(Ts,{variables:{cveID:s,query:t}})}const Fs=tt("Platform",{entityTab:"CVE"}),Ls=[Ze];function Ps(){var h;const{analyticsTrack:s}=Te(),t=qe(s),{searchFilter:a,setSearchFilter:n}=Ve(),r=Ie(a),i=Ye(),l=decodeURIComponent(i.cveId),o=te({...r,"CVE ID":[l]}),{page:c,perPage:x,setPage:u,setPerPage:v}=Fe(Le),{sortOption:g,getSortParams:T}=Pe({sortFields:Cs,defaultSortOption:hs,onSort:()=>u(1)}),{affectedClustersRequest:p,clusterData:V,clusterCount:P}=gs({query:o,page:c,perPage:x,sortOption:g}),E=Es(l),F=Vs({cveId:l,query:o}),m=(h=E.data)==null?void 0:h.platformCVE,y=m==null?void 0:m.cve,S=$e(r),q=se({isLoading:p.loading,error:p.error,data:V,searchFilter:r});return e.jsxs(e.Fragment,{children:[e.jsx(de,{title:`Kubernetes components - Vulnerability ${y}`}),e.jsx(b,{type:"breadcrumb",children:e.jsxs(Je,{children:[e.jsx(et,{to:Fs,children:"Kubernetes components"}),e.jsx(st,{isActive:!0,children:y??e.jsx(_e,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(b,{children:m?e.jsxs(D,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},spaceItems:{default:"spaceItemsSm"},children:[e.jsx(K,{headingLevel:"h1",children:m.cve}),m.firstDiscoveredTime&&e.jsx(rt,{numLabels:1,children:e.jsxs(be,{children:["First discovered in system:"," ",Ae(m.firstDiscoveredTime)]})}),e.jsx(A,{component:"p",children:m.clusterVulnerability.summary}),e.jsx(Rt,{children:e.jsx("a",{href:m.clusterVulnerability.link,target:"_blank",rel:"noopener noreferrer",children:m.clusterVulnerability.link})})]}):e.jsx(at,{nameScreenreaderText:"Loading CVE name",metadataScreenreaderText:"Loading CVE metadata"})}),e.jsx(z,{component:"div"}),e.jsxs(b,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(De,{searchFilter:a,searchFilterConfig:Ls,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(C,L)=>{n(C),t(Oe,L)},includeCveSeverityFilters:!1}),e.jsxs(nt,{error:F.error,isLoading:F.loading,children:[e.jsx(Z,{data:F.data,loadingText:"Loading affected nodes summary",renderer:({data:C})=>e.jsx(Ss,{affectedClusterCount:C.clusterCount,totalClusterCount:C.totalClusterCount})}),e.jsx(Z,{data:F.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:C})=>{var L;return e.jsx(bs,{clusterCounts:(L=C.platformCVE)==null?void 0:L.clusterCountByType})}})]}),e.jsx(z,{component:"div"}),e.jsxs(it,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(X,{isFilled:!0,children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(K,{headingLevel:"h2",children:[R(P,"cluster")," affected"]}),S&&e.jsx(lt,{})]})}),e.jsx(X,{children:e.jsx(ot,{itemCount:P,perPage:x,page:c,onSetPage:(C,L)=>u(L),onPerPageSelect:(C,L)=>{v(L)}})})]}),e.jsx(fs,{tableState:q,getSortParams:T,onClearFilters:()=>{n({}),u(1)}})]})]})}const Is=j`
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
`;function $s({data:s}){var r,i,l,o;if(!s)return e.jsx(at,{nameScreenreaderText:"Loading Cluster name",metadataScreenreaderText:"Loading Cluster metadata"});const t=(i=(r=s.status)==null?void 0:r.orchestratorMetadata)==null?void 0:i.buildDate,a=(o=(l=s.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.version,n=0+(t?1:0)+(a?1:0);return e.jsxs(D,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(K,{headingLevel:"h1",className:"pf-v6-u-mb-sm",children:s.name}),n>0&&e.jsxs(rt,{numLabels:n,children:[a&&e.jsxs(be,{children:["K8s version: ",a]}),t&&e.jsxs(be,{children:["Build date: ",Ae(t)]})]})]})}const Ds=j`
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
`;function qs(s){return I(Ds,{variables:{id:s}})}function we(s){if(!s)return null;const{region:t}=s;return s.aws?`AWS ${t}`:s.azure?`Azure ${t}`:s.google?`GCP ${t}`:null}function Os({clusterId:s}){var r,i,l,o,c,x;const{data:t,loading:a,error:n}=qs(s);return e.jsxs(e.Fragment,{children:[e.jsx(b,{component:"div",children:e.jsx(A,{component:"p",children:"View details about this cluster"})}),e.jsx(z,{component:"div"}),e.jsx(b,{isFilled:!0,children:n?e.jsx(ve,{children:e.jsx(ct,{title:"There was an error loading the cluster details",headingLevel:"h2",icon:dt,status:"danger",children:ut(n)})}):a?e.jsx(ve,{children:e.jsx(Bt,{size:"xl"})}):t&&e.jsxs(D,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(Nt,{columnModifier:{default:"1Col"},children:[e.jsxs(Q,{children:[e.jsx(G,{children:"Cluster type"}),e.jsx(W,{children:Ee(t.cluster.type)})]}),we((r=t.cluster.status)==null?void 0:r.providerMetadata)&&e.jsxs(Q,{children:[e.jsx(G,{children:"Cloud provider"}),e.jsx(W,{children:we((i=t.cluster.status)==null?void 0:i.providerMetadata)})]}),((o=(l=t.cluster.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.buildDate)&&e.jsxs(Q,{children:[e.jsx(G,{children:"Build date"}),e.jsx(W,{children:Ae(t.cluster.status.orchestratorMetadata.buildDate)})]}),((x=(c=t.cluster.status)==null?void 0:c.orchestratorMetadata)==null?void 0:x.version)&&e.jsxs(Q,{children:[e.jsx(G,{children:"K8s version"}),e.jsx(W,{children:t.cluster.status.orchestratorMetadata.version})]})]}),e.jsx(ss,{toggleText:"Labels",labels:t.cluster.labels})]})})]})}const _s=[ce,xt,ue,N],As={field:N,direction:"desc"},Rs=j`
    fragment ClusterVulnerabilityFragment on ClusterVulnerability {
        id
        cve
        isFixable
        cvss
        scoreVersion
        vulnerabilityType
        summary
    }
`;function Bs({tableState:s,getSortParams:t,onClearFilters:a}){const r=Ue();return e.jsxs(re,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(Ke,{}),e.jsx(f,{sort:t(ce),children:"CVE"}),e.jsx(f,{sort:t(xt),children:"CVE status"}),e.jsx(f,{sort:t(ue),children:"CVE type"}),e.jsx(f,{sort:t(N),children:"CVSS"})]})}),e.jsx(ne,{tableState:s,colSpan:5,emptyProps:{message:"No CVEs were detected for this cluster"},filteredEmptyProps:{onClearFilters:a},renderer:({data:i})=>i.map((l,o)=>{const{id:c,cve:x,isFixable:u,vulnerabilityType:v,cvss:g,scoreVersion:T,summary:p}=l,V=r.has(x);return e.jsxs(ie,{isExpanded:V,children:[e.jsxs($,{children:[e.jsx(d,{expand:{rowIndex:o,isExpanded:V,onToggle:()=>r.toggle(x)}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(le,{to:oe("CVE",c),children:x})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:u})}),e.jsx(d,{dataLabel:"CVE type",children:ze(v)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(Qe,{cvss:g,scoreVersion:T})})]}),e.jsxs($,{isExpanded:V,children:[e.jsx(d,{}),e.jsx(d,{colSpan:4,children:e.jsx(Ge,{children:p?e.jsx(A,{component:"p",children:p}):e.jsx(We,{})})})]})]},x)})})]})}const Ns=j`
    ${Rs}
    query getClusterVulnerabilities($id: ID!, $query: String!, $pagination: Pagination) {
        cluster(id: $id) {
            id
            clusterVulnerabilityCount(query: $query)
            clusterVulnerabilities(query: $query, pagination: $pagination) {
                ...ClusterVulnerabilityFragment
            }
        }
    }
`;function ws({clusterId:s,query:t,...a}){return I(Ns,{variables:{id:s,query:t,pagination:ee(a)}})}const Ms="var(--pf-t--global--text--color--disabled)",ks=[{status:"Fixable",Icon:wt,text:({fixable:s})=>`${R(s,"vulnerability","vulnerabilities")} with available fixes`},{status:"Not fixable",Icon:Mt,text:({total:s,fixable:t})=>`${R(s-t,"vulnerability","vulnerabilities")} without fixes`}],Us={Fixable:"Fixable hidden","Not fixable":"Not fixable hidden"},Ks=j`
    fragment PlatformCveCountByStatusFragment on PlatformCVECountByFixability {
        total
        fixable
    }
`;function zs({data:s,hiddenStatuses:t}){return e.jsxs(xe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(pe,{children:"CVEs by status"}),e.jsx(me,{children:e.jsx(D,{direction:{default:"column"},children:ks.map(({status:a,Icon:n,text:r})=>{const i=t.has(a);return e.jsxs(D,{spaceItems:{default:"spaceItemsSm"},alignItems:{default:"alignItemsCenter"},children:[e.jsx(n,{}),e.jsx(A,{component:"p",style:{color:i?Ms:"inherit"},children:i?Us[a]:r(s)})]},a)})})})]})}const Qs=[{type:"OpenShift CVE",field:"openshift"},{type:"Kubernetes CVE",field:"kubernetes"},{type:"Istio CVE",field:"istio"}],Gs=j`
    fragment PlatformCveCountByTypeFragment on PlatformCVECountByType {
        kubernetes
        openshift
        istio
    }
`;function Ws({data:s}){return e.jsxs(xe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(pe,{children:"CVEs by type"}),e.jsx(me,{children:e.jsx(D,{direction:{default:"column"},children:Qs.map(({type:t,field:a})=>e.jsx(je,{span:12,children:e.jsx(A,{component:"p",children:R(s[a],t)})},t))})})]})}const Hs=j`
    ${Ks}
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
`;function Zs(s,t){return I(Hs,{variables:{id:s,query:t}})}const Xs=[Xe];function Ys({clusterId:s}){var S,q;const{analyticsTrack:t}=Te(),a=qe(t),{searchFilter:n,setSearchFilter:r}=Ve(),i=Ie(n),l=kt(i),o=$e(i),{page:c,perPage:x,setPage:u,setPerPage:v}=Fe(Le),{sortOption:g,getSortParams:T}=Pe({sortFields:_s,defaultSortOption:As,onSort:()=>u(1)}),{data:p,loading:V,error:P}=ws({clusterId:s,query:l,page:c,perPage:x,sortOption:g}),E=Zs(s,l),F=Ut(i),m=((S=p==null?void 0:p.cluster)==null?void 0:S.clusterVulnerabilityCount)??0,y=se({isLoading:V,error:P,data:(q=p==null?void 0:p.cluster)==null?void 0:q.clusterVulnerabilities,searchFilter:i});return e.jsxs(e.Fragment,{children:[e.jsx(b,{component:"div",children:e.jsx(A,{component:"p",children:"Review and triage vulnerability data scanned on this cluster"})}),e.jsx(z,{component:"div"}),e.jsxs(b,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(De,{className:"pf-v6-u-pb-0 pf-v6-u-px-sm",searchFilter:n,searchFilterConfig:Xs,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(h,C)=>{r(h),a(Oe,C)},includeCveSeverityFilters:!1}),e.jsxs(nt,{isLoading:E.loading,error:E.error,children:[e.jsx(Z,{loadingText:"Loading platform CVEs by status summary",data:E.data,renderer:({data:h})=>e.jsx(zs,{data:h.cluster.platformCVECountByFixability,hiddenStatuses:F})}),e.jsx(Z,{loadingText:"Loading platform CVEs by type summary",data:E.data,renderer:({data:h})=>e.jsx(Ws,{data:h.cluster.platformCVECountByType})})]}),e.jsx(z,{component:"div"}),e.jsxs(it,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(X,{isFilled:!0,children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(K,{headingLevel:"h2",className:"pf-v6-u-w-50",children:p?`${R(m,"result")} found`:e.jsx(_e,{screenreaderText:"Loading cluster vulnerability count"})}),o&&e.jsx(lt,{})]})}),e.jsx(X,{children:e.jsx(ot,{itemCount:m,perPage:x,page:c,onSetPage:(h,C)=>u(C),onPerPageSelect:(h,C)=>{v(C)}})})]}),e.jsx(Bs,{tableState:y,getSortParams:T,onClearFilters:()=>{r({}),u(1)}})]})]})}const Js="ClusterPageDetails",er="ClusterPageVulnerabilities",tr=tt("Platform",{entityTab:"Cluster"}),sr=j`
    ${Is}
    query getClusterMetadata($id: ID!) {
        cluster(id: $id) {
            ...ClusterMetadata
        }
    }
`;function rr(){var c;const{clusterId:s}=Ye(),{data:t,error:a}=I(sr,{variables:{id:s}}),[n,r]=He("detailsTab",fe),i=fe[0],l=fe[1],o=((c=t==null?void 0:t.cluster)==null?void 0:c.name)??"";return e.jsxs(e.Fragment,{children:[e.jsx(de,{title:`Platform CVEs - Cluster ${o}`}),e.jsx(b,{type:"breadcrumb",children:e.jsxs(Je,{children:[e.jsx(et,{to:tr,children:"Clusters"}),e.jsx(st,{isActive:!0,children:o??e.jsx(_e,{screenreaderText:"Loading cluster name",width:"200px"})})]})}),a?e.jsx(b,{hasBodyWrapper:!1,children:e.jsx(ve,{children:e.jsx(ct,{title:ut(a),headingLevel:"h2",icon:dt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(b,{hasBodyWrapper:!1,children:e.jsx($s,{data:t==null?void 0:t.cluster})}),e.jsx(b,{type:"tabs",children:e.jsxs(Kt,{activeKey:n,onSelect:(x,u)=>{r(u)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Re,{eventKey:i,tabContentId:er,title:i,children:e.jsx(Ys,{clusterId:s})}),e.jsx(Re,{eventKey:l,tabContentId:Js,title:l,children:e.jsx(Os,{clusterId:s})})]})})]})]})}function dr(){const{hasReadAccess:s}=zt(),t=s("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(Qt,{}),e.jsxs(Gt,{children:[e.jsx(H,{index:!0,element:e.jsx(ms,{})}),e.jsx(H,{path:"cves/:cveId",element:e.jsx(Ps,{})}),e.jsx(H,{path:"clusters/:clusterId",element:e.jsx(rr,{})}),e.jsx(H,{path:"*",element:e.jsxs(b,{hasBodyWrapper:!1,children:[e.jsx(de,{title:"Platform CVEs - Not Found"}),e.jsx(Wt,{})]})})]})]})}export{dr as default};
