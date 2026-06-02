import{m7 as B,mM as Me,mN as Y,mO as J,cc as ee,lV as te,ds as se,w as e,az as re,aA as ae,Z as $,aB as f,m2 as ke,de as ne,aC as ie,aq as d,b1 as le,mP as oe,b2 as R,mQ as Ee,lW as ce,mR as ue,mp as N,eA as Ue,l$ as ze,m0 as jt,m1 as gt,m3 as bt,mm as Se,mS as Ke,lM as Qe,b4 as vt,cr as We,ag as _,m5 as Ge,bG as Te,d1 as He,mT as Et,cv as Ve,cu as Fe,lz as Pe,cw as Le,jM as St,mb as Ie,dt as $e,mc as Tt,kp as Vt,kq as Ft,kr as Pt,lB as De,md as Ze,mU as Xe,ls as qe,mV as Oe,mi as Lt,ai as de,a5 as b,av as D,a6 as z,aw as je,mj as It,aP as $t,bL as Dt,K as qt,mW as Ot,ml as At,mr as _t,dI as Rt,aK as pe,aL as me,aM as xe,bD as ge,bh as U,bb as Ye,b7 as Je,b8 as et,mv as tt,b9 as st,d$ as Ae,d_ as rt,aS as be,d8 as _e,bM as Bt,mB as at,ba as K,mx as nt,my as Z,dT as it,fQ as X,mA as lt,ct as ot,bd as ve,bQ as ct,cl as ut,ce as dt,be as Nt,ch as wt,ci as Q,cj as W,ck as G,mX as pt,dZ as Mt,fz as kt,dY as Ut,mD as zt,mF as fe,a7 as Kt,a8 as Re,aZ as Qt,mG as Wt,c9 as Gt,ca as H,eX as Ht}from"./index-Te9UmyKz.js";import{u as I,g as j,f as Zt,r as Xt}from"./apollo-BxVF6eGb.js";import{u as Yt,a as Jt,b as es,S as ts,c as ss,E as rs}from"./ExpandableLabelSection-CcrWmXmZ.js";import"./react-pF2EnNv3.js";import"./lodash-JMWJiBov.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-Dm-eRLL3.js";const as=j`
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
`,ns=[B,Me,Y,J],Be={field:B,direction:"asc"};function is({querySearchFilter:s,isFiltered:t,pagination:a,sortOption:n,getSortParams:r,onClearFilters:i}){const{page:l,perPage:o}=a,{data:c,previousData:p,error:u,loading:v}=I(as,{variables:{query:te(s),pagination:ee({page:l,perPage:o,sortOption:n})}}),g=c??p,T=se({isLoading:v,data:g==null?void 0:g.clusters,error:u,searchFilter:s});return e.jsxs(re,{borders:T.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":v?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(f,{sort:r(B),children:"Cluster"}),e.jsxs(f,{sort:r(Me),children:["CVEs",t&&e.jsx(ke,{})]}),e.jsx(f,{sort:r(Y),children:"Platform type"}),e.jsx(f,{sort:r(J),children:"Kubernetes version"})]})}),e.jsx(ne,{tableState:T,colSpan:4,emptyProps:{message:"No secured clusters have been detected"},filteredEmptyProps:{onClearFilters:i},renderer:({data:V})=>V.map(({id:L,name:E,clusterVulnerabilityCount:F,type:x,status:y})=>{var S;return e.jsx(ie,{children:e.jsxs($,{children:[e.jsx(d,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(le,{to:oe("Cluster",L),children:E})}),e.jsx(d,{dataLabel:"CVEs",children:R(F,"CVE")}),e.jsx(d,{dataLabel:"Platform type",children:Ee(x)}),e.jsx(d,{dataLabel:"Kubernetes version",children:((S=y==null?void 0:y.orchestratorMetadata)==null?void 0:S.version)??"Unavailable"})]})},L)})})]})}const ls=j`
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
`,us=[ce,ue,N],Ne={field:N,direction:"desc"};function ds({querySearchFilter:s,isFiltered:t,pagination:a,selectedCves:n,canSelectRows:r,createRowActions:i,sortOption:l,getSortParams:o,onClearFilters:c}){var S;const{page:p,perPage:u}=a,{data:v,previousData:g,error:T,loading:m}=os({querySearchFilter:s,page:p,perPage:u,sortOption:l}),L=((S=I(cs).data)==null?void 0:S.clusterCount)??0,E=v??g,F=se({isLoading:m,data:E==null?void 0:E.platformCVEs,error:T,searchFilter:s}),x=Ue(),y=r?8:6;return e.jsxs(re,{borders:F.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":m?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(ze,{}),r&&e.jsx(jt,{selectedCves:n}),e.jsx(f,{sort:o(ce),children:"CVE"}),e.jsx(f,{children:"CVE status"}),e.jsx(f,{sort:o(ue),children:"CVE type"}),e.jsx(f,{sort:o(N),children:"CVSS"}),e.jsxs(gt,{tooltip:"Ratio of the number of clusters affected by this CVE to the total number of secured clusters",sort:void 0,children:["Affected clusters",t&&e.jsx(ke,{})]}),r&&e.jsx(f,{screenReaderText:"Row actions"})]})}),e.jsx(ne,{tableState:F,colSpan:y,emptyProps:{message:"No CVEs have been detected for your secured clusters"},filteredEmptyProps:{onClearFilters:c},renderer:({data:q})=>q.map((h,C)=>{const{id:P,cve:O,isFixable:w,cveType:Ce,cvss:he,clusterVulnerability:{summary:M,scoreVersion:A},clusterCountByType:k}=h,ye=x.has(O),{generic:xt,kubernetes:Ct,openshift:ht,openshift4:yt}=k,ft=xt+Ct+ht+yt;return e.jsxs(ie,{isExpanded:ye,children:[e.jsxs($,{children:[e.jsx(d,{expand:{rowIndex:C,isExpanded:ye,onToggle:()=>x.toggle(O)}}),r&&e.jsx(bt,{selectedCves:n,rowIndex:C,item:{cve:O}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(le,{to:oe("CVE",P),children:O})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:w})}),e.jsx(d,{dataLabel:"CVE type",children:Ke(Ce)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(Qe,{cvss:he,scoreVersion:A})}),e.jsxs(d,{dataLabel:"Affected clusters",children:[ft," / ",L," affected clusters"]}),r&&e.jsx(d,{isActionCell:!0,children:e.jsx(vt,{items:i({cve:O})})})]}),e.jsxs($,{isExpanded:ye,children:[e.jsx(d,{}),e.jsx(d,{colSpan:y-1,children:e.jsx(We,{children:M?e.jsx(_,{component:"p",children:M}):e.jsx(Ge,{})})})]})]},P)})})]})}const ps=j`
    query getPlatformCVEEntityCounts($query: String) {
        platformCVECount(query: $query)
        clusterCount(query: $query)
    }
`;function ms(s){return I(ps,{variables:{query:te(s)}})}const xs=[Ze,Xe];function Cs(){var M;const s=Zt(),{analyticsTrack:t}=Te(),a=qe(t),[n]=He("entityTab",Et),{searchFilter:r,setSearchFilter:i}=Ve(),l=Fe(Pe),{sortOption:o,getSortParams:c,setSortOption:p}=Le({sortFields:n==="CVE"?us:ns,defaultSortOption:n==="CVE"?Ne:Be,onSort:()=>l.setPage(1)});St({destination:"platform-cves",searchFilter:r,setSearchFilter:i,reapplyWhen:[n],onScopeApplied:()=>l.setPage(1)});const u=Ie(r),v=$e(u),g=((M=u["CVE Snoozed"])==null?void 0:M[0])==="true",T=Yt(),m=Tt(),{snoozeModalOptions:V,setSnoozeModalOptions:L,snoozeActionCreator:E}=Jt(),F=es("Platform");function x(A){l.setPage(1),p(A==="CVE"?Ne:Be),t({event:Ot,properties:{type:A,page:"Overview"}})}Xt.useEffect(()=>{x(n)},[]);const{data:y}=ms(u),S={CVE:(y==null?void 0:y.platformCVECount)??0,Cluster:(y==null?void 0:y.clusterCount)??0};function q(){i({}),l.setPage(1)}const h=Vt(),C=h==="v1"||h==="v2",P=Ft({enabled:C&&h==="v1",searchFilter:r,setSearchFilter:i,paginationSetPage:()=>l.setPage(1),storageScope:"platform-cves",filterKind:"workload"}),O=Pt({enabled:C&&h==="v2",searchFilter:r,setSearchFilter:i,paginationSetPage:()=>l.setPage(1),storageScope:"platform-cves",filterKind:"workload"}),w=h==="v2"?O:P,Ce=e.jsx(De,{searchFilter:r,searchFilterConfig:xs,defaultSearchFilterEntity:"CVE",cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(A,k)=>{i(A),a(Oe,k)},includeCveSeverityFilters:!1,prefixToolbarItems:w.prefixToolbarItem??void 0,appliedFilterSuffix:w.appliedFilterSuffix??void 0}),he=e.jsx(At,{entityTabs:["CVE","Cluster"],entityCounts:S,onChange:x});return e.jsxs(e.Fragment,{children:[V&&e.jsx(ts,{...V,onSuccess:(A,k)=>{A==="SNOOZE"&&t({event:Lt,properties:{type:"PLATFORM",duration:k}}),s.cache.evict({fieldName:"platformCVEs"}),s.cache.evict({fieldName:"platformCVECount"}),s.cache.gc(),m.clear()},onClose:()=>L(null)}),e.jsx(de,{title:"Kubernetes Components Overview"}),e.jsx(b,{children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(D,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(z,{headingLevel:"h1",children:"Kubernetes components"}),e.jsx(je,{children:"Prioritize and manage scanned CVEs across clusters"})]}),e.jsx(je,{children:e.jsx(ss,{searchFilter:r,setSearchFilter:i,snoozedCveCount:F})})]})}),h==="v2"&&O.wysiwygAlert&&e.jsx(b,{children:O.wysiwygAlert}),e.jsxs(b,{isFilled:!0,children:[e.jsx(It,{filterToolbar:Ce,entityToggleGroup:he,pagination:l,tableRowCount:n==="CVE"?S.CVE:S.Cluster,isFiltered:v,children:T&&e.jsx($t,{align:{default:"alignEnd"},children:e.jsx(Dt,{toggleText:"Bulk actions",isDisabled:m.size===0,children:e.jsx(qt,{onClick:()=>L({action:g?"UNSNOOZE":"SNOOZE",cveType:"CLUSTER_CVE",cves:Array.from(m.values())}),children:g?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),n==="CVE"&&e.jsx(ds,{querySearchFilter:u,isFiltered:v,pagination:l,selectedCves:m,canSelectRows:T,createRowActions:E("CLUSTER_CVE",g?"UNSNOOZE":"SNOOZE"),sortOption:o,getSortParams:c,onClearFilters:q}),n==="Cluster"&&e.jsx(is,{querySearchFilter:u,isFiltered:v,pagination:l,sortOption:o,getSortParams:c,onClearFilters:q})]}),w.modalsFragment]})}const hs=[B,Y,J],ys={field:B,direction:"asc"},fs=j`
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
`;function js({tableState:s,getSortParams:t,onClearFilters:a}){return e.jsxs(re,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(f,{sort:t(B),children:"Cluster"}),e.jsx(f,{sort:t(Y),children:"Cluster type"}),e.jsx(f,{children:"CVE status"}),e.jsx(f,{sort:t(J),children:"Kubernetes version"})]})}),e.jsx(ne,{tableState:s,colSpan:3,emptyProps:{message:"No clusters have been reported for this CVE"},filteredEmptyProps:{onClearFilters:a},renderer:({data:n})=>e.jsx(ie,{children:n.map(({id:r,name:i,type:l,clusterVulnerabilities:o,status:c})=>{var u;const p=_t(o);return e.jsxs($,{children:[e.jsx(d,{dataLabel:"Cluster",children:e.jsx(le,{to:oe("Cluster",r),children:e.jsx(Rt,{position:"middle",content:i})})}),e.jsx(d,{dataLabel:"Cluster type",modifier:"nowrap",children:Ee(l)}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:p})}),e.jsx(d,{dataLabel:"Kubernetes version",modifier:"nowrap",children:((u=c==null?void 0:c.orchestratorMetadata)==null?void 0:u.version)??"Unavailable"})]},r)})})})]})}const gs=j`
    ${fs}
    query getAffectedClusters($query: String, $pagination: Pagination) {
        clusterCount(query: $query)
        clusters(query: $query, pagination: $pagination) {
            ...AffectedClusterFragment
        }
    }
`;function bs({query:s,...t}){var n,r,i;const a=I(gs,{variables:{query:s,pagination:ee(t)}});return{affectedClustersRequest:a,clusterCount:((n=a.data)==null?void 0:n.clusterCount)??0,clusterData:((r=a.data)==null?void 0:r.clusters)??((i=a.previousData)==null?void 0:i.clusters)}}const mt=j`
    fragment ClustersByType on PlatformCVECore {
        clusterCountByType {
            generic
            kubernetes
            openshift
            openshift4
        }
    }
`;function vs({clusterCounts:s}){const{generic:t=0,kubernetes:a=0,openshift:n=0,openshift4:r=0}=s??{},i=t+a+n+r;return e.jsxs(pe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(me,{children:"Clusters by type"}),e.jsx(xe,{children:i>0?e.jsxs(ge,{children:[t>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[t," Generic"]}),a>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[a," Kubernetes"]}),n+r>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[n+r," OpenShift"]})]}):e.jsx(ge,{children:e.jsx(U,{span:12,className:"pf-v6-u-pt-xs",children:"No affected clusters found"})})})]})}const Es=j`
    ${mt}
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
`;function Ss(s){return I(Es,{variables:{cveID:s}})}function Ts({affectedClusterCount:s,totalClusterCount:t}){return e.jsxs(pe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(me,{children:"Affected clusters"}),e.jsx(xe,{children:e.jsx(ge,{children:e.jsxs(U,{span:12,className:"pf-v6-u-pt-sm",children:[s," / ",t," affected clusters"]})})})]})}const Vs=j`
    ${mt}
    query getPlatformCVEMetadata($cveID: String!, $query: String!) {
        totalClusterCount: clusterCount
        clusterCount(query: $query)
        platformCVE(cveID: $cveID, subfieldScopeQuery: $query) {
            ...ClustersByType
        }
    }
`;function Fs({cveId:s,query:t}){return I(Vs,{variables:{cveID:s,query:t}})}const Ps=tt("Platform",{entityTab:"CVE"}),Ls=[Ze];function Is(){var h;const{analyticsTrack:s}=Te(),t=qe(s),{searchFilter:a,setSearchFilter:n}=Ve(),r=Ie(a),i=Ye(),l=decodeURIComponent(i.cveId),o=te({...r,"CVE ID":[l]}),{page:c,perPage:p,setPage:u,setPerPage:v}=Fe(Pe),{sortOption:g,getSortParams:T}=Le({sortFields:hs,defaultSortOption:ys,onSort:()=>u(1)}),{affectedClustersRequest:m,clusterData:V,clusterCount:L}=bs({query:o,page:c,perPage:p,sortOption:g}),E=Ss(l),F=Fs({cveId:l,query:o}),x=(h=E.data)==null?void 0:h.platformCVE,y=x==null?void 0:x.cve,S=$e(r),q=se({isLoading:m.loading,error:m.error,data:V,searchFilter:r});return e.jsxs(e.Fragment,{children:[e.jsx(de,{title:`Kubernetes components - Vulnerability ${y}`}),e.jsx(b,{type:"breadcrumb",children:e.jsxs(Je,{children:[e.jsx(et,{to:Ps,children:"Kubernetes components"}),e.jsx(st,{isActive:!0,children:y??e.jsx(Ae,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(b,{children:x?e.jsxs(D,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},spaceItems:{default:"spaceItemsSm"},children:[e.jsx(z,{headingLevel:"h1",children:x.cve}),x.firstDiscoveredTime&&e.jsx(rt,{numLabels:1,children:e.jsxs(be,{children:["First discovered in system:"," ",_e(x.firstDiscoveredTime)]})}),e.jsx(_,{component:"p",children:x.clusterVulnerability.summary}),e.jsx(Bt,{children:e.jsx("a",{href:x.clusterVulnerability.link,target:"_blank",rel:"noopener noreferrer",children:x.clusterVulnerability.link})})]}):e.jsx(at,{nameScreenreaderText:"Loading CVE name",metadataScreenreaderText:"Loading CVE metadata"})}),e.jsx(K,{component:"div"}),e.jsxs(b,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(De,{searchFilter:a,searchFilterConfig:Ls,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(C,P)=>{n(C),t(Oe,P)},includeCveSeverityFilters:!1}),e.jsxs(nt,{error:F.error,isLoading:F.loading,children:[e.jsx(Z,{data:F.data,loadingText:"Loading affected nodes summary",renderer:({data:C})=>e.jsx(Ts,{affectedClusterCount:C.clusterCount,totalClusterCount:C.totalClusterCount})}),e.jsx(Z,{data:F.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:C})=>{var P;return e.jsx(vs,{clusterCounts:(P=C.platformCVE)==null?void 0:P.clusterCountByType})}})]}),e.jsx(K,{component:"div"}),e.jsxs(it,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(X,{isFilled:!0,children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(z,{headingLevel:"h2",children:[R(L,"cluster")," affected"]}),S&&e.jsx(lt,{})]})}),e.jsx(X,{children:e.jsx(ot,{itemCount:L,perPage:p,page:c,onSetPage:(C,P)=>u(P),onPerPageSelect:(C,P)=>{v(P)}})})]}),e.jsx(js,{tableState:q,getSortParams:T,onClearFilters:()=>{n({}),u(1)}})]})]})}const $s=j`
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
`;function Ds({data:s}){var r,i,l,o;if(!s)return e.jsx(at,{nameScreenreaderText:"Loading Cluster name",metadataScreenreaderText:"Loading Cluster metadata"});const t=(i=(r=s.status)==null?void 0:r.orchestratorMetadata)==null?void 0:i.buildDate,a=(o=(l=s.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.version,n=0+(t?1:0)+(a?1:0);return e.jsxs(D,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(z,{headingLevel:"h1",className:"pf-v6-u-mb-sm",children:s.name}),n>0&&e.jsxs(rt,{numLabels:n,children:[a&&e.jsxs(be,{children:["K8s version: ",a]}),t&&e.jsxs(be,{children:["Build date: ",_e(t)]})]})]})}const qs=j`
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
`;function Os(s){return I(qs,{variables:{id:s}})}function we(s){if(!s)return null;const{region:t}=s;return s.aws?`AWS ${t}`:s.azure?`Azure ${t}`:s.google?`GCP ${t}`:null}function As({clusterId:s}){var r,i,l,o,c,p;const{data:t,loading:a,error:n}=Os(s);return e.jsxs(e.Fragment,{children:[e.jsx(b,{component:"div",children:e.jsx(_,{component:"p",children:"View details about this cluster"})}),e.jsx(K,{component:"div"}),e.jsx(b,{isFilled:!0,children:n?e.jsx(ve,{children:e.jsx(ct,{title:"There was an error loading the cluster details",headingLevel:"h2",icon:dt,status:"danger",children:ut(n)})}):a?e.jsx(ve,{children:e.jsx(Nt,{size:"xl"})}):t&&e.jsxs(D,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(wt,{columnModifier:{default:"1Col"},children:[e.jsxs(Q,{children:[e.jsx(W,{children:"Cluster type"}),e.jsx(G,{children:Ee(t.cluster.type)})]}),we((r=t.cluster.status)==null?void 0:r.providerMetadata)&&e.jsxs(Q,{children:[e.jsx(W,{children:"Cloud provider"}),e.jsx(G,{children:we((i=t.cluster.status)==null?void 0:i.providerMetadata)})]}),((o=(l=t.cluster.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.buildDate)&&e.jsxs(Q,{children:[e.jsx(W,{children:"Build date"}),e.jsx(G,{children:_e(t.cluster.status.orchestratorMetadata.buildDate)})]}),((p=(c=t.cluster.status)==null?void 0:c.orchestratorMetadata)==null?void 0:p.version)&&e.jsxs(Q,{children:[e.jsx(W,{children:"K8s version"}),e.jsx(G,{children:t.cluster.status.orchestratorMetadata.version})]})]}),e.jsx(rs,{toggleText:"Labels",labels:t.cluster.labels})]})})]})}const _s=[ce,pt,ue,N],Rs={field:N,direction:"desc"},Bs=j`
    fragment ClusterVulnerabilityFragment on ClusterVulnerability {
        id
        cve
        isFixable
        cvss
        scoreVersion
        vulnerabilityType
        summary
    }
`;function Ns({tableState:s,getSortParams:t,onClearFilters:a}){const r=Ue();return e.jsxs(re,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(ze,{}),e.jsx(f,{sort:t(ce),children:"CVE"}),e.jsx(f,{sort:t(pt),children:"CVE status"}),e.jsx(f,{sort:t(ue),children:"CVE type"}),e.jsx(f,{sort:t(N),children:"CVSS"})]})}),e.jsx(ne,{tableState:s,colSpan:5,emptyProps:{message:"No CVEs were detected for this cluster"},filteredEmptyProps:{onClearFilters:a},renderer:({data:i})=>i.map((l,o)=>{const{id:c,cve:p,isFixable:u,vulnerabilityType:v,cvss:g,scoreVersion:T,summary:m}=l,V=r.has(p);return e.jsxs(ie,{isExpanded:V,children:[e.jsxs($,{children:[e.jsx(d,{expand:{rowIndex:o,isExpanded:V,onToggle:()=>r.toggle(p)}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(le,{to:oe("CVE",c),children:p})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:u})}),e.jsx(d,{dataLabel:"CVE type",children:Ke(v)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(Qe,{cvss:g,scoreVersion:T})})]}),e.jsxs($,{isExpanded:V,children:[e.jsx(d,{}),e.jsx(d,{colSpan:4,children:e.jsx(We,{children:m?e.jsx(_,{component:"p",children:m}):e.jsx(Ge,{})})})]})]},p)})})]})}const ws=j`
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
`;function Ms({clusterId:s,query:t,...a}){return I(ws,{variables:{id:s,query:t,pagination:ee(a)}})}const ks="var(--pf-t--global--text--color--disabled)",Us=[{status:"Fixable",Icon:Mt,text:({fixable:s})=>`${R(s,"vulnerability","vulnerabilities")} with available fixes`},{status:"Not fixable",Icon:kt,text:({total:s,fixable:t})=>`${R(s-t,"vulnerability","vulnerabilities")} without fixes`}],zs={Fixable:"Fixable hidden","Not fixable":"Not fixable hidden"},Ks=j`
    fragment PlatformCveCountByStatusFragment on PlatformCVECountByFixability {
        total
        fixable
    }
`;function Qs({data:s,hiddenStatuses:t}){return e.jsxs(pe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(me,{children:"CVEs by status"}),e.jsx(xe,{children:e.jsx(D,{direction:{default:"column"},children:Us.map(({status:a,Icon:n,text:r})=>{const i=t.has(a);return e.jsxs(D,{spaceItems:{default:"spaceItemsSm"},alignItems:{default:"alignItemsCenter"},children:[e.jsx(n,{}),e.jsx(_,{component:"p",style:{color:i?ks:"inherit"},children:i?zs[a]:r(s)})]},a)})})})]})}const Ws=[{type:"OpenShift CVE",field:"openshift"},{type:"Kubernetes CVE",field:"kubernetes"},{type:"Istio CVE",field:"istio"}],Gs=j`
    fragment PlatformCveCountByTypeFragment on PlatformCVECountByType {
        kubernetes
        openshift
        istio
    }
`;function Hs({data:s}){return e.jsxs(pe,{isCompact:!0,isFullHeight:!0,children:[e.jsx(me,{children:"CVEs by type"}),e.jsx(xe,{children:e.jsx(D,{direction:{default:"column"},children:Ws.map(({type:t,field:a})=>e.jsx(je,{span:12,children:e.jsx(_,{component:"p",children:R(s[a],t)})},t))})})]})}const Zs=j`
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
`;function Xs(s,t){return I(Zs,{variables:{id:s,query:t}})}const Ys=[Xe];function Js({clusterId:s}){var S,q;const{analyticsTrack:t}=Te(),a=qe(t),{searchFilter:n,setSearchFilter:r}=Ve(),i=Ie(n),l=Ut(i),o=$e(i),{page:c,perPage:p,setPage:u,setPerPage:v}=Fe(Pe),{sortOption:g,getSortParams:T}=Le({sortFields:_s,defaultSortOption:Rs,onSort:()=>u(1)}),{data:m,loading:V,error:L}=Ms({clusterId:s,query:l,page:c,perPage:p,sortOption:g}),E=Xs(s,l),F=zt(i),x=((S=m==null?void 0:m.cluster)==null?void 0:S.clusterVulnerabilityCount)??0,y=se({isLoading:V,error:L,data:(q=m==null?void 0:m.cluster)==null?void 0:q.clusterVulnerabilities,searchFilter:i});return e.jsxs(e.Fragment,{children:[e.jsx(b,{component:"div",children:e.jsx(_,{component:"p",children:"Review and triage vulnerability data scanned on this cluster"})}),e.jsx(K,{component:"div"}),e.jsxs(b,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(De,{className:"pf-v6-u-pb-0 pf-v6-u-px-sm",searchFilter:n,searchFilterConfig:Ys,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(h,C)=>{r(h),a(Oe,C)},includeCveSeverityFilters:!1}),e.jsxs(nt,{isLoading:E.loading,error:E.error,children:[e.jsx(Z,{loadingText:"Loading platform CVEs by status summary",data:E.data,renderer:({data:h})=>e.jsx(Qs,{data:h.cluster.platformCVECountByFixability,hiddenStatuses:F})}),e.jsx(Z,{loadingText:"Loading platform CVEs by type summary",data:E.data,renderer:({data:h})=>e.jsx(Hs,{data:h.cluster.platformCVECountByType})})]}),e.jsx(K,{component:"div"}),e.jsxs(it,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(X,{isFilled:!0,children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(z,{headingLevel:"h2",className:"pf-v6-u-w-50",children:m?`${R(x,"result")} found`:e.jsx(Ae,{screenreaderText:"Loading cluster vulnerability count"})}),o&&e.jsx(lt,{})]})}),e.jsx(X,{children:e.jsx(ot,{itemCount:x,perPage:p,page:c,onSetPage:(h,C)=>u(C),onPerPageSelect:(h,C)=>{v(C)}})})]}),e.jsx(Ns,{tableState:y,getSortParams:T,onClearFilters:()=>{r({}),u(1)}})]})]})}const er="ClusterPageDetails",tr="ClusterPageVulnerabilities",sr=tt("Platform",{entityTab:"Cluster"}),rr=j`
    ${$s}
    query getClusterMetadata($id: ID!) {
        cluster(id: $id) {
            ...ClusterMetadata
        }
    }
`;function ar(){var c;const{clusterId:s}=Ye(),{data:t,error:a}=I(rr,{variables:{id:s}}),[n,r]=He("detailsTab",fe),i=fe[0],l=fe[1],o=((c=t==null?void 0:t.cluster)==null?void 0:c.name)??"";return e.jsxs(e.Fragment,{children:[e.jsx(de,{title:`Platform CVEs - Cluster ${o}`}),e.jsx(b,{type:"breadcrumb",children:e.jsxs(Je,{children:[e.jsx(et,{to:sr,children:"Clusters"}),e.jsx(st,{isActive:!0,children:o??e.jsx(Ae,{screenreaderText:"Loading cluster name",width:"200px"})})]})}),a?e.jsx(b,{hasBodyWrapper:!1,children:e.jsx(ve,{children:e.jsx(ct,{title:ut(a),headingLevel:"h2",icon:dt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(b,{hasBodyWrapper:!1,children:e.jsx(Ds,{data:t==null?void 0:t.cluster})}),e.jsx(b,{type:"tabs",children:e.jsxs(Kt,{activeKey:n,onSelect:(p,u)=>{r(u)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Re,{eventKey:i,tabContentId:tr,title:i,children:e.jsx(Js,{clusterId:s})}),e.jsx(Re,{eventKey:l,tabContentId:er,title:l,children:e.jsx(As,{clusterId:s})})]})})]})]})}function pr(){const{hasReadAccess:s}=Qt(),t=s("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(Wt,{}),e.jsxs(Gt,{children:[e.jsx(H,{index:!0,element:e.jsx(Cs,{})}),e.jsx(H,{path:"cves/:cveId",element:e.jsx(Is,{})}),e.jsx(H,{path:"clusters/:clusterId",element:e.jsx(ar,{})}),e.jsx(H,{path:"*",element:e.jsxs(b,{hasBodyWrapper:!1,children:[e.jsx(de,{title:"Platform CVEs - Not Found"}),e.jsx(Ht,{})]})})]})]})}export{pr as default};
