import{m6 as B,mL as Me,mM as Y,mN as J,cc as ee,lU as te,ds as se,w as e,az as re,aA as ae,Z as $,aB as f,m1 as ke,de as ne,aC as ie,aq as d,b1 as le,mO as oe,b2 as R,mP as Ee,lV as ce,mQ as ue,mo as w,eA as Ue,l_ as ze,l$ as jt,m0 as gt,m2 as bt,ml as Se,mR as Ke,lL as Qe,b4 as vt,cr as Ge,ag as _,m4 as We,bG as Te,d1 as He,mS as Et,cv as Ve,cu as Fe,ly as Le,cw as Pe,ma as Ie,dt as $e,mb as St,ko as Tt,kp as Vt,kq as Ft,lA as De,mc as Ze,mT as Xe,lr as qe,mU as Oe,mh as Lt,ai as de,a5 as b,av as D,a6 as z,aw as je,mi as Pt,aP as It,bL as $t,K as Dt,mV as qt,mk as Ot,mq as At,dI as _t,aK as me,aL as xe,aM as pe,bD as ge,bh as U,bb as Ye,b7 as Je,b8 as et,mu as tt,b9 as st,d$ as Ae,d_ as rt,aS as be,d8 as _e,bM as Rt,mA as at,ba as K,mw as nt,mx as Z,dT as it,fQ as X,mz as lt,ct as ot,bd as ve,bQ as ct,cl as ut,ce as dt,be as Bt,ch as wt,ci as Q,cj as G,ck as W,mW as mt,dZ as Nt,fz as Mt,dY as kt,mC as Ut,mE as fe,a7 as zt,a8 as Re,aZ as Kt,mF as Qt,c9 as Gt,ca as H,eX as Wt}from"./index-BXwYo9b1.js";import{u as I,g as j,f as Ht,r as Zt}from"./apollo-BxVF6eGb.js";import{u as Xt,a as Yt,b as Jt,S as es,c as ts,E as ss}from"./ExpandableLabelSection-D0FEkzpl.js";import"./react-pF2EnNv3.js";import"./lodash-JMWJiBov.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-CA6WciPn.js";const rs=j`
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
`,as=[B,Me,Y,J],Be={field:B,direction:"asc"};function ns({querySearchFilter:s,isFiltered:t,pagination:a,sortOption:n,getSortParams:r,onClearFilters:i}){const{page:l,perPage:o}=a,{data:c,previousData:m,error:u,loading:v}=I(rs,{variables:{query:te(s),pagination:ee({page:l,perPage:o,sortOption:n})}}),g=c??m,T=se({isLoading:v,data:g==null?void 0:g.clusters,error:u,searchFilter:s});return e.jsxs(re,{borders:T.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":v?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(f,{sort:r(B),children:"Cluster"}),e.jsxs(f,{sort:r(Me),children:["CVEs",t&&e.jsx(ke,{})]}),e.jsx(f,{sort:r(Y),children:"Platform type"}),e.jsx(f,{sort:r(J),children:"Kubernetes version"})]})}),e.jsx(ne,{tableState:T,colSpan:4,emptyProps:{message:"No secured clusters have been detected"},filteredEmptyProps:{onClearFilters:i},renderer:({data:V})=>V.map(({id:P,name:E,clusterVulnerabilityCount:F,type:p,status:y})=>{var S;return e.jsx(ie,{children:e.jsxs($,{children:[e.jsx(d,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(le,{to:oe("Cluster",P),children:E})}),e.jsx(d,{dataLabel:"CVEs",children:R(F,"CVE")}),e.jsx(d,{dataLabel:"Platform type",children:Ee(p)}),e.jsx(d,{dataLabel:"Kubernetes version",children:((S=y==null?void 0:y.orchestratorMetadata)==null?void 0:S.version)??"Unavailable"})]})},P)})})]})}const is=j`
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
`,cs=[ce,ue,w],we={field:w,direction:"desc"};function us({querySearchFilter:s,isFiltered:t,pagination:a,selectedCves:n,canSelectRows:r,createRowActions:i,sortOption:l,getSortParams:o,onClearFilters:c}){var S;const{page:m,perPage:u}=a,{data:v,previousData:g,error:T,loading:x}=ls({querySearchFilter:s,page:m,perPage:u,sortOption:l}),P=((S=I(os).data)==null?void 0:S.clusterCount)??0,E=v??g,F=se({isLoading:x,data:E==null?void 0:E.platformCVEs,error:T,searchFilter:s}),p=Ue(),y=r?8:6;return e.jsxs(re,{borders:F.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":x?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(ze,{}),r&&e.jsx(jt,{selectedCves:n}),e.jsx(f,{sort:o(ce),children:"CVE"}),e.jsx(f,{children:"CVE status"}),e.jsx(f,{sort:o(ue),children:"CVE type"}),e.jsx(f,{sort:o(w),children:"CVSS"}),e.jsxs(gt,{tooltip:"Ratio of the number of clusters affected by this CVE to the total number of secured clusters",sort:void 0,children:["Affected clusters",t&&e.jsx(ke,{})]}),r&&e.jsx(f,{screenReaderText:"Row actions"})]})}),e.jsx(ne,{tableState:F,colSpan:y,emptyProps:{message:"No CVEs have been detected for your secured clusters"},filteredEmptyProps:{onClearFilters:c},renderer:({data:q})=>q.map((h,C)=>{const{id:L,cve:O,isFixable:N,cveType:Ce,cvss:he,clusterVulnerability:{summary:M,scoreVersion:A},clusterCountByType:k}=h,ye=p.has(O),{generic:pt,kubernetes:Ct,openshift:ht,openshift4:yt}=k,ft=pt+Ct+ht+yt;return e.jsxs(ie,{isExpanded:ye,children:[e.jsxs($,{children:[e.jsx(d,{expand:{rowIndex:C,isExpanded:ye,onToggle:()=>p.toggle(O)}}),r&&e.jsx(bt,{selectedCves:n,rowIndex:C,item:{cve:O}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(le,{to:oe("CVE",L),children:O})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:N})}),e.jsx(d,{dataLabel:"CVE type",children:Ke(Ce)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(Qe,{cvss:he,scoreVersion:A})}),e.jsxs(d,{dataLabel:"Affected clusters",children:[ft," / ",P," affected clusters"]}),r&&e.jsx(d,{isActionCell:!0,children:e.jsx(vt,{items:i({cve:O})})})]}),e.jsxs($,{isExpanded:ye,children:[e.jsx(d,{}),e.jsx(d,{colSpan:y-1,children:e.jsx(Ge,{children:M?e.jsx(_,{component:"p",children:M}):e.jsx(We,{})})})]})]},L)})})]})}const ds=j`
    query getPlatformCVEEntityCounts($query: String) {
        platformCVECount(query: $query)
        clusterCount(query: $query)
    }
`;function ms(s){return I(ds,{variables:{query:te(s)}})}const xs=[Ze,Xe];function ps(){var M;const s=Ht(),{analyticsTrack:t}=Te(),a=qe(t),[n]=He("entityTab",Et),{searchFilter:r,setSearchFilter:i}=Ve(),l=Fe(Le),{sortOption:o,getSortParams:c,setSortOption:m}=Pe({sortFields:n==="CVE"?cs:as,defaultSortOption:n==="CVE"?we:Be,onSort:()=>l.setPage(1)}),u=Ie(r),v=$e(u),g=((M=u["CVE Snoozed"])==null?void 0:M[0])==="true",T=Xt(),x=St(),{snoozeModalOptions:V,setSnoozeModalOptions:P,snoozeActionCreator:E}=Yt(),F=Jt("Platform");function p(A){l.setPage(1),m(A==="CVE"?we:Be),t({event:qt,properties:{type:A,page:"Overview"}})}Zt.useEffect(()=>{p(n)},[]);const{data:y}=ms(u),S={CVE:(y==null?void 0:y.platformCVECount)??0,Cluster:(y==null?void 0:y.clusterCount)??0};function q(){i({}),l.setPage(1)}const h=Tt(),C=h==="v1"||h==="v2",L=Vt({enabled:C&&h==="v1",searchFilter:r,setSearchFilter:i,paginationSetPage:()=>l.setPage(1),storageScope:"platform-cves",filterKind:"workload"}),O=Ft({enabled:C&&h==="v2",searchFilter:r,setSearchFilter:i,paginationSetPage:()=>l.setPage(1),storageScope:"platform-cves",filterKind:"workload"}),N=h==="v2"?O:L,Ce=e.jsx(De,{searchFilter:r,searchFilterConfig:xs,defaultSearchFilterEntity:"CVE",cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(A,k)=>{i(A),a(Oe,k)},includeCveSeverityFilters:!1,prefixToolbarItems:N.prefixToolbarItem??void 0,appliedFilterSuffix:N.appliedFilterSuffix??void 0}),he=e.jsx(Ot,{entityTabs:["CVE","Cluster"],entityCounts:S,onChange:p});return e.jsxs(e.Fragment,{children:[V&&e.jsx(es,{...V,onSuccess:(A,k)=>{A==="SNOOZE"&&t({event:Lt,properties:{type:"PLATFORM",duration:k}}),s.cache.evict({fieldName:"platformCVEs"}),s.cache.evict({fieldName:"platformCVECount"}),s.cache.gc(),x.clear()},onClose:()=>P(null)}),e.jsx(de,{title:"Kubernetes Components Overview"}),e.jsx(b,{children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(D,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(z,{headingLevel:"h1",children:"Kubernetes components"}),e.jsx(je,{children:"Prioritize and manage scanned CVEs across clusters"})]}),e.jsx(je,{children:e.jsx(ts,{searchFilter:r,setSearchFilter:i,snoozedCveCount:F})})]})}),h==="v2"&&O.wysiwygAlert&&e.jsx(b,{children:O.wysiwygAlert}),e.jsxs(b,{isFilled:!0,children:[e.jsx(Pt,{filterToolbar:Ce,entityToggleGroup:he,pagination:l,tableRowCount:n==="CVE"?S.CVE:S.Cluster,isFiltered:v,children:T&&e.jsx(It,{align:{default:"alignEnd"},children:e.jsx($t,{toggleText:"Bulk actions",isDisabled:x.size===0,children:e.jsx(Dt,{onClick:()=>P({action:g?"UNSNOOZE":"SNOOZE",cveType:"CLUSTER_CVE",cves:Array.from(x.values())}),children:g?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),n==="CVE"&&e.jsx(us,{querySearchFilter:u,isFiltered:v,pagination:l,selectedCves:x,canSelectRows:T,createRowActions:E("CLUSTER_CVE",g?"UNSNOOZE":"SNOOZE"),sortOption:o,getSortParams:c,onClearFilters:q}),n==="Cluster"&&e.jsx(ns,{querySearchFilter:u,isFiltered:v,pagination:l,sortOption:o,getSortParams:c,onClearFilters:q})]}),N.modalsFragment]})}const Cs=[B,Y,J],hs={field:B,direction:"asc"},ys=j`
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
`;function fs({tableState:s,getSortParams:t,onClearFilters:a}){return e.jsxs(re,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(f,{sort:t(B),children:"Cluster"}),e.jsx(f,{sort:t(Y),children:"Cluster type"}),e.jsx(f,{children:"CVE status"}),e.jsx(f,{sort:t(J),children:"Kubernetes version"})]})}),e.jsx(ne,{tableState:s,colSpan:3,emptyProps:{message:"No clusters have been reported for this CVE"},filteredEmptyProps:{onClearFilters:a},renderer:({data:n})=>e.jsx(ie,{children:n.map(({id:r,name:i,type:l,clusterVulnerabilities:o,status:c})=>{var u;const m=At(o);return e.jsxs($,{children:[e.jsx(d,{dataLabel:"Cluster",children:e.jsx(le,{to:oe("Cluster",r),children:e.jsx(_t,{position:"middle",content:i})})}),e.jsx(d,{dataLabel:"Cluster type",modifier:"nowrap",children:Ee(l)}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:m})}),e.jsx(d,{dataLabel:"Kubernetes version",modifier:"nowrap",children:((u=c==null?void 0:c.orchestratorMetadata)==null?void 0:u.version)??"Unavailable"})]},r)})})})]})}const js=j`
    ${ys}
    query getAffectedClusters($query: String, $pagination: Pagination) {
        clusterCount(query: $query)
        clusters(query: $query, pagination: $pagination) {
            ...AffectedClusterFragment
        }
    }
`;function gs({query:s,...t}){var n,r,i;const a=I(js,{variables:{query:s,pagination:ee(t)}});return{affectedClustersRequest:a,clusterCount:((n=a.data)==null?void 0:n.clusterCount)??0,clusterData:((r=a.data)==null?void 0:r.clusters)??((i=a.previousData)==null?void 0:i.clusters)}}const xt=j`
    fragment ClustersByType on PlatformCVECore {
        clusterCountByType {
            generic
            kubernetes
            openshift
            openshift4
        }
    }
`;function bs({clusterCounts:s}){const{generic:t=0,kubernetes:a=0,openshift:n=0,openshift4:r=0}=s??{},i=t+a+n+r;return e.jsxs(me,{isCompact:!0,isFullHeight:!0,children:[e.jsx(xe,{children:"Clusters by type"}),e.jsx(pe,{children:i>0?e.jsxs(ge,{children:[t>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[t," Generic"]}),a>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[a," Kubernetes"]}),n+r>0&&e.jsxs(U,{span:12,className:"pf-v6-u-pt-xs",children:[n+r," OpenShift"]})]}):e.jsx(ge,{children:e.jsx(U,{span:12,className:"pf-v6-u-pt-xs",children:"No affected clusters found"})})})]})}const vs=j`
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
`;function Es(s){return I(vs,{variables:{cveID:s}})}function Ss({affectedClusterCount:s,totalClusterCount:t}){return e.jsxs(me,{isCompact:!0,isFullHeight:!0,children:[e.jsx(xe,{children:"Affected clusters"}),e.jsx(pe,{children:e.jsx(ge,{children:e.jsxs(U,{span:12,className:"pf-v6-u-pt-sm",children:[s," / ",t," affected clusters"]})})})]})}const Ts=j`
    ${xt}
    query getPlatformCVEMetadata($cveID: String!, $query: String!) {
        totalClusterCount: clusterCount
        clusterCount(query: $query)
        platformCVE(cveID: $cveID, subfieldScopeQuery: $query) {
            ...ClustersByType
        }
    }
`;function Vs({cveId:s,query:t}){return I(Ts,{variables:{cveID:s,query:t}})}const Fs=tt("Platform",{entityTab:"CVE"}),Ls=[Ze];function Ps(){var h;const{analyticsTrack:s}=Te(),t=qe(s),{searchFilter:a,setSearchFilter:n}=Ve(),r=Ie(a),i=Ye(),l=decodeURIComponent(i.cveId),o=te({...r,"CVE ID":[l]}),{page:c,perPage:m,setPage:u,setPerPage:v}=Fe(Le),{sortOption:g,getSortParams:T}=Pe({sortFields:Cs,defaultSortOption:hs,onSort:()=>u(1)}),{affectedClustersRequest:x,clusterData:V,clusterCount:P}=gs({query:o,page:c,perPage:m,sortOption:g}),E=Es(l),F=Vs({cveId:l,query:o}),p=(h=E.data)==null?void 0:h.platformCVE,y=p==null?void 0:p.cve,S=$e(r),q=se({isLoading:x.loading,error:x.error,data:V,searchFilter:r});return e.jsxs(e.Fragment,{children:[e.jsx(de,{title:`Kubernetes components - Vulnerability ${y}`}),e.jsx(b,{type:"breadcrumb",children:e.jsxs(Je,{children:[e.jsx(et,{to:Fs,children:"Kubernetes components"}),e.jsx(st,{isActive:!0,children:y??e.jsx(Ae,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(b,{children:p?e.jsxs(D,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},spaceItems:{default:"spaceItemsSm"},children:[e.jsx(z,{headingLevel:"h1",children:p.cve}),p.firstDiscoveredTime&&e.jsx(rt,{numLabels:1,children:e.jsxs(be,{children:["First discovered in system:"," ",_e(p.firstDiscoveredTime)]})}),e.jsx(_,{component:"p",children:p.clusterVulnerability.summary}),e.jsx(Rt,{children:e.jsx("a",{href:p.clusterVulnerability.link,target:"_blank",rel:"noopener noreferrer",children:p.clusterVulnerability.link})})]}):e.jsx(at,{nameScreenreaderText:"Loading CVE name",metadataScreenreaderText:"Loading CVE metadata"})}),e.jsx(K,{component:"div"}),e.jsxs(b,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(De,{searchFilter:a,searchFilterConfig:Ls,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(C,L)=>{n(C),t(Oe,L)},includeCveSeverityFilters:!1}),e.jsxs(nt,{error:F.error,isLoading:F.loading,children:[e.jsx(Z,{data:F.data,loadingText:"Loading affected nodes summary",renderer:({data:C})=>e.jsx(Ss,{affectedClusterCount:C.clusterCount,totalClusterCount:C.totalClusterCount})}),e.jsx(Z,{data:F.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:C})=>{var L;return e.jsx(bs,{clusterCounts:(L=C.platformCVE)==null?void 0:L.clusterCountByType})}})]}),e.jsx(K,{component:"div"}),e.jsxs(it,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(X,{isFilled:!0,children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(z,{headingLevel:"h2",children:[R(P,"cluster")," affected"]}),S&&e.jsx(lt,{})]})}),e.jsx(X,{children:e.jsx(ot,{itemCount:P,perPage:m,page:c,onSetPage:(C,L)=>u(L),onPerPageSelect:(C,L)=>{v(L)}})})]}),e.jsx(fs,{tableState:q,getSortParams:T,onClearFilters:()=>{n({}),u(1)}})]})]})}const Is=j`
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
`;function $s({data:s}){var r,i,l,o;if(!s)return e.jsx(at,{nameScreenreaderText:"Loading Cluster name",metadataScreenreaderText:"Loading Cluster metadata"});const t=(i=(r=s.status)==null?void 0:r.orchestratorMetadata)==null?void 0:i.buildDate,a=(o=(l=s.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.version,n=0+(t?1:0)+(a?1:0);return e.jsxs(D,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(z,{headingLevel:"h1",className:"pf-v6-u-mb-sm",children:s.name}),n>0&&e.jsxs(rt,{numLabels:n,children:[a&&e.jsxs(be,{children:["K8s version: ",a]}),t&&e.jsxs(be,{children:["Build date: ",_e(t)]})]})]})}const Ds=j`
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
`;function qs(s){return I(Ds,{variables:{id:s}})}function Ne(s){if(!s)return null;const{region:t}=s;return s.aws?`AWS ${t}`:s.azure?`Azure ${t}`:s.google?`GCP ${t}`:null}function Os({clusterId:s}){var r,i,l,o,c,m;const{data:t,loading:a,error:n}=qs(s);return e.jsxs(e.Fragment,{children:[e.jsx(b,{component:"div",children:e.jsx(_,{component:"p",children:"View details about this cluster"})}),e.jsx(K,{component:"div"}),e.jsx(b,{isFilled:!0,children:n?e.jsx(ve,{children:e.jsx(ct,{title:"There was an error loading the cluster details",headingLevel:"h2",icon:dt,status:"danger",children:ut(n)})}):a?e.jsx(ve,{children:e.jsx(Bt,{size:"xl"})}):t&&e.jsxs(D,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(wt,{columnModifier:{default:"1Col"},children:[e.jsxs(Q,{children:[e.jsx(G,{children:"Cluster type"}),e.jsx(W,{children:Ee(t.cluster.type)})]}),Ne((r=t.cluster.status)==null?void 0:r.providerMetadata)&&e.jsxs(Q,{children:[e.jsx(G,{children:"Cloud provider"}),e.jsx(W,{children:Ne((i=t.cluster.status)==null?void 0:i.providerMetadata)})]}),((o=(l=t.cluster.status)==null?void 0:l.orchestratorMetadata)==null?void 0:o.buildDate)&&e.jsxs(Q,{children:[e.jsx(G,{children:"Build date"}),e.jsx(W,{children:_e(t.cluster.status.orchestratorMetadata.buildDate)})]}),((m=(c=t.cluster.status)==null?void 0:c.orchestratorMetadata)==null?void 0:m.version)&&e.jsxs(Q,{children:[e.jsx(G,{children:"K8s version"}),e.jsx(W,{children:t.cluster.status.orchestratorMetadata.version})]})]}),e.jsx(ss,{toggleText:"Labels",labels:t.cluster.labels})]})})]})}const As=[ce,mt,ue,w],_s={field:w,direction:"desc"},Rs=j`
    fragment ClusterVulnerabilityFragment on ClusterVulnerability {
        id
        cve
        isFixable
        cvss
        scoreVersion
        vulnerabilityType
        summary
    }
`;function Bs({tableState:s,getSortParams:t,onClearFilters:a}){const r=Ue();return e.jsxs(re,{borders:s.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":s.type==="LOADING"?"true":"false",children:[e.jsx(ae,{noWrap:!0,children:e.jsxs($,{children:[e.jsx(ze,{}),e.jsx(f,{sort:t(ce),children:"CVE"}),e.jsx(f,{sort:t(mt),children:"CVE status"}),e.jsx(f,{sort:t(ue),children:"CVE type"}),e.jsx(f,{sort:t(w),children:"CVSS"})]})}),e.jsx(ne,{tableState:s,colSpan:5,emptyProps:{message:"No CVEs were detected for this cluster"},filteredEmptyProps:{onClearFilters:a},renderer:({data:i})=>i.map((l,o)=>{const{id:c,cve:m,isFixable:u,vulnerabilityType:v,cvss:g,scoreVersion:T,summary:x}=l,V=r.has(m);return e.jsxs(ie,{isExpanded:V,children:[e.jsxs($,{children:[e.jsx(d,{expand:{rowIndex:o,isExpanded:V,onToggle:()=>r.toggle(m)}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(le,{to:oe("CVE",c),children:m})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Se,{isFixable:u})}),e.jsx(d,{dataLabel:"CVE type",children:Ke(v)}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(Qe,{cvss:g,scoreVersion:T})})]}),e.jsxs($,{isExpanded:V,children:[e.jsx(d,{}),e.jsx(d,{colSpan:4,children:e.jsx(Ge,{children:x?e.jsx(_,{component:"p",children:x}):e.jsx(We,{})})})]})]},m)})})]})}const ws=j`
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
`;function Ns({clusterId:s,query:t,...a}){return I(ws,{variables:{id:s,query:t,pagination:ee(a)}})}const Ms="var(--pf-t--global--text--color--disabled)",ks=[{status:"Fixable",Icon:Nt,text:({fixable:s})=>`${R(s,"vulnerability","vulnerabilities")} with available fixes`},{status:"Not fixable",Icon:Mt,text:({total:s,fixable:t})=>`${R(s-t,"vulnerability","vulnerabilities")} without fixes`}],Us={Fixable:"Fixable hidden","Not fixable":"Not fixable hidden"},zs=j`
    fragment PlatformCveCountByStatusFragment on PlatformCVECountByFixability {
        total
        fixable
    }
`;function Ks({data:s,hiddenStatuses:t}){return e.jsxs(me,{isCompact:!0,isFullHeight:!0,children:[e.jsx(xe,{children:"CVEs by status"}),e.jsx(pe,{children:e.jsx(D,{direction:{default:"column"},children:ks.map(({status:a,Icon:n,text:r})=>{const i=t.has(a);return e.jsxs(D,{spaceItems:{default:"spaceItemsSm"},alignItems:{default:"alignItemsCenter"},children:[e.jsx(n,{}),e.jsx(_,{component:"p",style:{color:i?Ms:"inherit"},children:i?Us[a]:r(s)})]},a)})})})]})}const Qs=[{type:"OpenShift CVE",field:"openshift"},{type:"Kubernetes CVE",field:"kubernetes"},{type:"Istio CVE",field:"istio"}],Gs=j`
    fragment PlatformCveCountByTypeFragment on PlatformCVECountByType {
        kubernetes
        openshift
        istio
    }
`;function Ws({data:s}){return e.jsxs(me,{isCompact:!0,isFullHeight:!0,children:[e.jsx(xe,{children:"CVEs by type"}),e.jsx(pe,{children:e.jsx(D,{direction:{default:"column"},children:Qs.map(({type:t,field:a})=>e.jsx(je,{span:12,children:e.jsx(_,{component:"p",children:R(s[a],t)})},t))})})]})}const Hs=j`
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
`;function Zs(s,t){return I(Hs,{variables:{id:s,query:t}})}const Xs=[Xe];function Ys({clusterId:s}){var S,q;const{analyticsTrack:t}=Te(),a=qe(t),{searchFilter:n,setSearchFilter:r}=Ve(),i=Ie(n),l=kt(i),o=$e(i),{page:c,perPage:m,setPage:u,setPerPage:v}=Fe(Le),{sortOption:g,getSortParams:T}=Pe({sortFields:As,defaultSortOption:_s,onSort:()=>u(1)}),{data:x,loading:V,error:P}=Ns({clusterId:s,query:l,page:c,perPage:m,sortOption:g}),E=Zs(s,l),F=Ut(i),p=((S=x==null?void 0:x.cluster)==null?void 0:S.clusterVulnerabilityCount)??0,y=se({isLoading:V,error:P,data:(q=x==null?void 0:x.cluster)==null?void 0:q.clusterVulnerabilities,searchFilter:i});return e.jsxs(e.Fragment,{children:[e.jsx(b,{component:"div",children:e.jsx(_,{component:"p",children:"Review and triage vulnerability data scanned on this cluster"})}),e.jsx(K,{component:"div"}),e.jsxs(b,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(De,{className:"pf-v6-u-pb-0 pf-v6-u-px-sm",searchFilter:n,searchFilterConfig:Xs,cveStatusFilterField:"CLUSTER CVE FIXABLE",onFilterChange:(h,C)=>{r(h),a(Oe,C)},includeCveSeverityFilters:!1}),e.jsxs(nt,{isLoading:E.loading,error:E.error,children:[e.jsx(Z,{loadingText:"Loading platform CVEs by status summary",data:E.data,renderer:({data:h})=>e.jsx(Ks,{data:h.cluster.platformCVECountByFixability,hiddenStatuses:F})}),e.jsx(Z,{loadingText:"Loading platform CVEs by type summary",data:E.data,renderer:({data:h})=>e.jsx(Ws,{data:h.cluster.platformCVECountByType})})]}),e.jsx(K,{component:"div"}),e.jsxs(it,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(X,{isFilled:!0,children:e.jsxs(D,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(z,{headingLevel:"h2",className:"pf-v6-u-w-50",children:x?`${R(p,"result")} found`:e.jsx(Ae,{screenreaderText:"Loading cluster vulnerability count"})}),o&&e.jsx(lt,{})]})}),e.jsx(X,{children:e.jsx(ot,{itemCount:p,perPage:m,page:c,onSetPage:(h,C)=>u(C),onPerPageSelect:(h,C)=>{v(C)}})})]}),e.jsx(Bs,{tableState:y,getSortParams:T,onClearFilters:()=>{r({}),u(1)}})]})]})}const Js="ClusterPageDetails",er="ClusterPageVulnerabilities",tr=tt("Platform",{entityTab:"Cluster"}),sr=j`
    ${Is}
    query getClusterMetadata($id: ID!) {
        cluster(id: $id) {
            ...ClusterMetadata
        }
    }
`;function rr(){var c;const{clusterId:s}=Ye(),{data:t,error:a}=I(sr,{variables:{id:s}}),[n,r]=He("detailsTab",fe),i=fe[0],l=fe[1],o=((c=t==null?void 0:t.cluster)==null?void 0:c.name)??"";return e.jsxs(e.Fragment,{children:[e.jsx(de,{title:`Platform CVEs - Cluster ${o}`}),e.jsx(b,{type:"breadcrumb",children:e.jsxs(Je,{children:[e.jsx(et,{to:tr,children:"Clusters"}),e.jsx(st,{isActive:!0,children:o??e.jsx(Ae,{screenreaderText:"Loading cluster name",width:"200px"})})]})}),a?e.jsx(b,{hasBodyWrapper:!1,children:e.jsx(ve,{children:e.jsx(ct,{title:ut(a),headingLevel:"h2",icon:dt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(b,{hasBodyWrapper:!1,children:e.jsx($s,{data:t==null?void 0:t.cluster})}),e.jsx(b,{type:"tabs",children:e.jsxs(zt,{activeKey:n,onSelect:(m,u)=>{r(u)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Re,{eventKey:i,tabContentId:er,title:i,children:e.jsx(Ys,{clusterId:s})}),e.jsx(Re,{eventKey:l,tabContentId:Js,title:l,children:e.jsx(Os,{clusterId:s})})]})})]})]})}function dr(){const{hasReadAccess:s}=Kt(),t=s("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(Qt,{}),e.jsxs(Gt,{children:[e.jsx(H,{index:!0,element:e.jsx(ps,{})}),e.jsx(H,{path:"cves/:cveId",element:e.jsx(Ps,{})}),e.jsx(H,{path:"clusters/:clusterId",element:e.jsx(rr,{})}),e.jsx(H,{path:"*",element:e.jsxs(b,{hasBodyWrapper:!1,children:[e.jsx(de,{title:"Platform CVEs - Not Found"}),e.jsx(Wt,{})]})})]})]})}export{dr as default};
