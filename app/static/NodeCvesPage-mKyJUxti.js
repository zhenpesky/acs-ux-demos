import{cc as re,lU as G,lV as ie,lW as Se,lX as Nt,ds as de,eA as be,lY as Xe,lZ as Ye,w as e,az as W,aA as H,Z as F,l_ as Je,l$ as Tt,aB as m,m0 as ze,m1 as Ce,lF as Ft,lG as Lt,de as le,lI as It,lJ as Ot,aC as Z,aq as i,m2 as Dt,b1 as ce,m3 as ue,lK as et,lL as Ee,lM as tt,b4 as Pt,cr as Ve,ag as Ne,m4 as $t,m5 as X,m6 as xe,m7 as me,m8 as nt,dI as k,bG as Te,em as wt,d1 as st,m9 as qt,cv as Fe,cu as Le,ly as Ie,cw as Oe,ma as De,dt as Pe,mb as At,bH as Rt,ko as _t,kp as kt,kq as Bt,lA as $e,mc as ot,md as at,me as rt,mf as we,lr as qe,mg as Ae,mh as Mt,ai as he,a5 as S,av as B,a6 as pe,aw as Ue,ac as zt,bM as Ut,bN as Kt,mi as Qt,aP as Gt,bL as Wt,K as Ht,mj as Zt,mk as Xt,jy as Yt,ml as Re,f8 as Jt,mm as M,mn as je,mo as ge,mp as it,mq as dt,mr as en,ms as lt,b2 as Y,aK as tn,aL as nn,aM as sn,bD as on,bh as Ke,bb as ct,mt as ut,b7 as xt,b8 as mt,mu as ht,b9 as pt,d$ as _e,mv as an,ba as Q,mw as jt,mx as oe,my as gt,dT as yt,fQ as ae,mz as Ct,ct as ft,mA as rn,d_ as dn,aS as ne,d8 as fe,mB as ln,mC as cn,mD as un,bd as ve,bQ as vt,cl as St,ce as bt,be as xn,ch as mn,ci as A,cj as R,ck as _,mE as ye,a7 as hn,a8 as Qe,aZ as pn,mF as jn,c9 as gn,ca as se,eX as yn}from"./index-BXwYo9b1.js";import{u as I,g as V,f as Cn,r as fn}from"./apollo-BxVF6eGb.js";import{u as vn,a as Sn,b as bn,S as En,c as Vn,E as Ge}from"./ExpandableLabelSection-D0FEkzpl.js";import"./react-pF2EnNv3.js";import"./lodash-JMWJiBov.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-CA6WciPn.js";const Nn=V`
    query getNodeCVEs($query: String, $pagination: Pagination) {
        nodeCVEs(query: $query, pagination: $pagination) {
            cve
            affectedNodeCountBySeverity {
                critical {
                    total
                }
                important {
                    total
                }
                moderate {
                    total
                }
                low {
                    total
                }
                unknown {
                    total
                }
            }
            topCVSS
            affectedNodeCount
            firstDiscoveredInSystem
            distroTuples {
                summary
                operatingSystem
                cvss
                scoreVersion
            }
        }
    }
`;function Tn({querySearchFilter:n,...t}){return I(Nn,{variables:{query:G(n),pagination:re(t)}})}const Fn=V`
    query getTotalNodeCount {
        nodeCount
    }
`;function Ln(){var t;return((t=I(Fn).data)==null?void 0:t.nodeCount)??0}const In=[ie,Se,Nt],We={field:Se,direction:"desc",aggregateBy:{aggregateFunc:"max",distinct:"false"}};function On({querySearchFilter:n,isFiltered:t,pagination:s,selectedCves:r,createRowActions:o,canSelectRows:a,sortOption:h,getSortParams:u,onClearFilters:d}){var D;const{page:g,perPage:x}=s,{data:y,previousData:j,loading:C,error:b}=Tn({querySearchFilter:n,page:g,perPage:x,sortOption:h}),f=Ln(),l=y??j,v=de({isLoading:C,data:l==null?void 0:l.nodeCVEs,error:b,searchFilter:n}),T=be(),E=a?8:6,O=(D=n.SEVERITY)==null?void 0:D.map(N=>Xe[N]).filter(Ye);return e.jsxs(W,{borders:v.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":C?"true":"false",children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(Je,{}),a&&e.jsx(Tt,{selectedCves:r}),e.jsx(m,{sort:u(ie),children:"CVE"}),e.jsxs(ze,{tooltip:"The number of nodes affected by this CVE, grouped by the severity of the CVE on each node",children:["Nodes by severity",t&&e.jsx(Ce,{})]}),e.jsx(m,{sort:u(Se,Ft),children:"Top CVSS"}),e.jsxs(ze,{tooltip:"Ratio of the number of nodes affected by this CVE to the total number of nodes",sort:u("Node ID",Lt),children:["Affected nodes",t&&e.jsx(Ce,{})]}),e.jsx(m,{children:"First discovered"}),a&&e.jsx(m,{screenReaderText:"Row actions"})]})}),e.jsx(le,{tableState:v,colSpan:E,emptyProps:{message:"No CVEs have been detected for nodes across your secured clusters"},filteredEmptyProps:{onClearFilters:d},renderer:({data:N})=>N.map((L,c)=>{const{cve:p,affectedNodeCountBySeverity:{critical:P,important:q,moderate:z,low:U,unknown:K},distroTuples:J,topCVSS:ee,affectedNodeCount:te,firstDiscoveredInSystem:$}=L,w=T.has(p),ke=It(J),Be=ke.length>0?ke[0].summary:"",Me=Ot(ee,J);return e.jsxs(Z,{isExpanded:w,children:[e.jsxs(F,{children:[e.jsx(i,{expand:{rowIndex:c,isExpanded:w,onToggle:()=>T.toggle(p)}}),a&&e.jsx(Dt,{selectedCves:r,rowIndex:c,item:{cve:p}}),e.jsx(i,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ce,{to:ue("CVE",p),children:p})}),e.jsx(i,{dataLabel:"Nodes by severity",children:e.jsx(et,{criticalCount:P.total,importantCount:q.total,moderateCount:z.total,lowCount:U.total,unknownCount:K.total,filteredSeverities:O,entity:"node"})}),e.jsx(i,{dataLabel:"Top CVSS",children:e.jsx(Ee,{cvss:ee,scoreVersion:Me.length>0?Me.join("/"):void 0})}),e.jsxs(i,{dataLabel:"Affected nodes",children:[te," / ",f," affected nodes"]}),e.jsx(i,{dataLabel:"First discovered",children:e.jsx(tt,{date:$})}),a&&e.jsx(i,{isActionCell:!0,children:e.jsx(Pt,{items:o({cve:p})})})]}),e.jsxs(F,{isExpanded:w,children:[e.jsx(i,{}),e.jsx(i,{colSpan:E-1,children:e.jsx(Ve,{children:Be?e.jsx(Ne,{component:"p",children:Be}):e.jsx($t,{})})})]})]},p)})})]})}const Dn=V`
    query getNodes($query: String, $pagination: Pagination) {
        nodes(query: $query, pagination: $pagination) {
            id
            name
            nodeCVECountBySeverity {
                critical {
                    total
                }
                important {
                    total
                }
                moderate {
                    total
                }
                low {
                    total
                }
                unknown {
                    total
                }
            }
            cluster {
                name
            }
            osImage
            scanTime
        }
    }
`;function Pn({querySearchFilter:n,...t}){return I(Dn,{variables:{query:G(n),pagination:re(t)}})}const $n=[X,xe,me,nt],He={field:X,direction:"asc"};function wn({querySearchFilter:n,isFiltered:t,pagination:s,sortOption:r,getSortParams:o,onClearFilters:a}){var f;const{page:h,perPage:u}=s,{data:d,previousData:g,loading:x,error:y}=Pn({querySearchFilter:n,page:h,perPage:u,sortOption:r}),j=d??g,C=de({isLoading:x,data:j==null?void 0:j.nodes,error:y,searchFilter:n}),b=(f=n.SEVERITY)==null?void 0:f.map(l=>Xe[l]).filter(Ye);return e.jsxs(W,{borders:C.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":x?"true":"false",children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(m,{sort:o(X),children:"Node"}),e.jsxs(m,{children:["CVEs by severity",t&&e.jsx(Ce,{})]}),e.jsx(m,{sort:o(xe),children:"Cluster"}),e.jsx(m,{sort:o(me),children:"Operating system"}),e.jsx(m,{sort:o(nt),children:"Scan time"})]})}),e.jsx(le,{tableState:C,colSpan:5,emptyProps:{message:"No CVEs have been reported for your scanned nodes"},filteredEmptyProps:{onClearFilters:a},renderer:({data:l})=>e.jsx(Z,{children:l.map(v=>{const{id:T,name:E,nodeCVECountBySeverity:O,cluster:D,osImage:N,scanTime:L}=v,{critical:c,important:p,moderate:P,low:q,unknown:z}=O;return e.jsxs(F,{children:[e.jsx(i,{dataLabel:"Node",modifier:"nowrap",children:e.jsx(ce,{to:ue("Node",T),children:e.jsx(k,{position:"middle",content:E})})}),e.jsx(i,{dataLabel:"CVEs by severity",children:e.jsx(et,{criticalCount:c.total,importantCount:p.total,moderateCount:P.total,lowCount:q.total,unknownCount:z.total,filteredSeverities:b,entity:"node"})}),e.jsx(i,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(k,{position:"middle",content:D.name})}),e.jsx(i,{dataLabel:"Operating system",modifier:"nowrap",children:e.jsx(k,{position:"middle",content:N})}),e.jsx(i,{dataLabel:"Scan time",children:e.jsx(tt,{date:L})})]},T)})})})]})}const qn=V`
    query getNodeCVEEntityCounts($query: String) {
        nodeCVECount(query: $query)
        nodeCount(query: $query)
    }
`;function An(n){return I(qn,{variables:{query:G(n)}})}const Rn=[ot,at,rt,we];function _n(){var te;const n=Cn(),{analyticsTrack:t}=Te(),s=qe(t),{isFeatureFlagEnabled:r}=wt(),o=r("ROX_SCANNER_V4")&&r("ROX_NODE_INDEX_ENABLED"),[a]=st("entityTab",qt),{searchFilter:h,setSearchFilter:u}=Fe(),d=Le(Ie),{sortOption:g,getSortParams:x,setSortOption:y}=Oe({sortFields:a==="CVE"?In:$n,defaultSortOption:a==="CVE"?We:He,onSort:()=>d.setPage(1)}),j=De(h),C=Pe(j),b=((te=j["CVE Snoozed"])==null?void 0:te[0])==="true",f=vn(),l=At(),{snoozeModalOptions:v,setSnoozeModalOptions:T,snoozeActionCreator:E}=Sn(),O=bn("Node"),{version:D}=Rt();function N($){d.setPage(1),y($==="CVE"?We:He),t({event:Zt,properties:{type:$,page:"Overview"}})}fn.useEffect(()=>{N(a)},[]);function L(){u({}),d.setPage(1)}const{data:c}=An(j),p={CVE:(c==null?void 0:c.nodeCVECount)??0,Node:(c==null?void 0:c.nodeCount)??0},P=_t(),q=P==="v1"||P==="v2",z=kt({enabled:q&&P==="v1",searchFilter:h,setSearchFilter:u,paginationSetPage:()=>d.setPage(1),storageScope:"node-cves",filterKind:"workload"}),U=Bt({enabled:q&&P==="v2",searchFilter:h,setSearchFilter:u,paginationSetPage:()=>d.setPage(1),storageScope:"node-cves",filterKind:"workload"}),K=P==="v2"?U:z,J=e.jsx($e,{searchFilter:h,searchFilterConfig:Rn,defaultSearchFilterEntity:"Node",onFilterChange:($,w)=>{u($),d.setPage(1),s(Ae,w)},prefixToolbarItems:K.prefixToolbarItem??void 0,appliedFilterSuffix:K.appliedFilterSuffix??void 0}),ee=e.jsx(Xt,{entityTabs:["CVE","Node"],entityCounts:p,onChange:N});return e.jsxs(e.Fragment,{children:[v&&e.jsx(En,{...v,onSuccess:($,w)=>{$==="SNOOZE"&&t({event:Mt,properties:{type:"NODE",duration:w}}),n.cache.evict({fieldName:"nodeCVEs"}),n.cache.evict({fieldName:"nodeCVECount"}),n.cache.gc(),l.clear()},onClose:()=>T(null)}),e.jsx(he,{title:"Node CVEs Overview"}),e.jsx(S,{children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(B,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(pe,{headingLevel:"h1",children:"Node CVEs"}),e.jsx(Ue,{children:"Prioritize and manage scanned CVEs across nodes"})]}),e.jsx(Ue,{children:e.jsx(Vn,{searchFilter:h,setSearchFilter:u,snoozedCveCount:O})})]})}),o&&e.jsx(S,{children:e.jsx(zt,{isInline:!0,variant:"info",title:"Results may include Node CVEs obtained from Scanner V4",component:"p",children:e.jsx(Ut,{children:e.jsx("a",{href:Kt(D,"operating/managing-vulnerabilities#understanding-node-cves-scanner-v4_scan-rhcos-node-host"),target:"_blank",rel:"noopener noreferrer",children:"Read more about the differences between the node scanning results obtained with the StackRox Scanner and Scanner V4."})})})}),P==="v2"&&U.wysiwygAlert&&e.jsx(S,{children:U.wysiwygAlert}),e.jsxs(S,{isCenterAligned:!0,children:[e.jsx(Qt,{filterToolbar:J,entityToggleGroup:ee,pagination:d,tableRowCount:a==="CVE"?p.CVE:p.Node,isFiltered:C,children:f&&e.jsx(Gt,{align:{default:"alignEnd"},children:e.jsx(Wt,{toggleText:"Bulk actions",isDisabled:l.size===0,children:e.jsx(Ht,{onClick:()=>T({action:b?"UNSNOOZE":"SNOOZE",cveType:"NODE_CVE",cves:Array.from(l.values())}),children:b?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),a==="CVE"&&e.jsx(On,{querySearchFilter:j,isFiltered:C,pagination:d,selectedCves:l,canSelectRows:f,createRowActions:E("NODE_CVE",b?"UNSNOOZE":"SNOOZE"),sortOption:g,getSortParams:x,onClearFilters:L}),a==="Node"&&e.jsx(wn,{querySearchFilter:j,isFiltered:C,pagination:d,sortOption:g,getSortParams:x,onClearFilters:L})]}),K.modalsFragment]})}function kn(n,t){const s=Jt(n,r=>{var o,a;switch(t.field){case"Component":return(o=r.name)==null?void 0:o.toLowerCase();case"Type":return(a=r.source)==null?void 0:a.toLowerCase();default:return""}});return t.reversed&&s.reverse(),s}const Et=V`
    fragment NodeComponentFragment on NodeComponent {
        name
        source
        version
        nodeVulnerabilities(query: $query) {
            severity
            isFixable
            fixedByVersion
        }
    }
`,Bn=["Component","Type"],Mn={field:"Component",direction:"asc"};function Vt({data:n}){const{sortOption:t,getSortParams:s}=Yt({sortFields:Bn,defaultSortOption:Mn}),r=kn(n,t);return n.length===0?null:e.jsxs(W,{children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(m,{sort:s("Component"),children:"Component"}),e.jsx(m,{children:"Version"}),e.jsx(m,{children:"CVE fixed in"}),e.jsx(m,{sort:s("Type"),children:"Type"})]})}),e.jsx(Z,{children:r.map(({name:o,source:a,version:h,nodeVulnerabilities:u})=>{var g;const d=(g=u==null?void 0:u[0])==null?void 0:g.fixedByVersion;return e.jsxs(F,{children:[e.jsx(i,{dataLabel:"Component",children:o}),e.jsx(i,{dataLabel:"Version",children:h}),e.jsx(i,{dataLabel:"CVE fixed in",children:d||e.jsx(Re,{isFixable:!1})}),e.jsx(i,{dataLabel:"Type",children:a})]},o)})})]})}const zn=[X,M,je,ge,xe,me],Un={field:M,direction:"desc"},Kn=V`
    ${Et}
    fragment AffectedNode on Node {
        id
        name
        osImage
        cluster {
            name
        }
        nodeComponents(query: $query) {
            ...NodeComponentFragment
            nodeVulnerabilities(query: $query) {
                vulnerabilityId: id
                cve
                severity
                fixedByVersion
                cvss
                scoreVersion
            }
        }
    }
`;function Qn({tableState:n,getSortParams:t,onClearFilters:s}){const o=be();return e.jsxs(W,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(m,{screenReaderText:"Row expansion"}),e.jsx(m,{sort:t(X),children:"Node"}),e.jsx(m,{sort:t(M),children:"CVE severity"}),e.jsx(m,{sort:t(je),children:"CVE status"}),e.jsx(m,{sort:t(ge),children:"CVSS"}),e.jsx(m,{sort:t(xe),children:"Cluster"}),e.jsx(m,{sort:t(me),children:"Operating system"}),e.jsx(m,{children:"Affected components"})]})}),e.jsx(le,{tableState:n,colSpan:8,emptyProps:{message:"There are no nodes that are affected by this CVE"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((h,u)=>{const{id:d,name:g,nodeComponents:x}=h,y=o.has(d),j=x.flatMap(v=>v.nodeVulnerabilities),C=it(j),b=dt(j),{cvss:f,scoreVersion:l}=en(j);return e.jsxs(Z,{isExpanded:y,children:[e.jsxs(F,{children:[e.jsx(i,{expand:{rowIndex:u,isExpanded:y,onToggle:()=>o.toggle(d)}}),e.jsx(i,{dataLabel:"Node",children:e.jsx(ce,{to:ue("Node",d),children:e.jsx(k,{position:"middle",content:g})})}),e.jsx(i,{dataLabel:"CVE severity",modifier:"nowrap",children:e.jsx(lt,{severity:C})}),e.jsx(i,{dataLabel:"CVE status",modifier:"nowrap",children:e.jsx(Re,{isFixable:b})}),e.jsx(i,{dataLabel:"CVSS",modifier:"nowrap",children:e.jsx(Ee,{cvss:f,scoreVersion:l})}),e.jsx(i,{dataLabel:"Cluster",children:e.jsx(k,{position:"middle",content:h.cluster.name})}),e.jsx(i,{dataLabel:"Operating system",children:e.jsx(k,{position:"middle",content:h.osImage})}),e.jsx(i,{dataLabel:"Affected components",children:x.length===1?x[0].name:Y(x.length,"component")})]}),e.jsxs(F,{isExpanded:y,children:[e.jsx(i,{}),e.jsx(i,{colSpan:7,children:e.jsx(Ve,{children:e.jsx(Vt,{data:x})})})]})]},d)})})]})}function Gn({affectedNodeCount:n,totalNodeCount:t,operatingSystemCount:s}){return e.jsxs(tn,{isCompact:!0,isFullHeight:!0,children:[e.jsx(nn,{children:"Affected nodes"}),e.jsx(sn,{children:e.jsxs(on,{children:[e.jsxs(Ke,{span:12,className:"pf-v6-u-pt-sm",children:[n," / ",t," affected nodes"]}),e.jsxs(Ke,{span:12,className:"pf-v6-u-pt-sm",children:[Y(s,"operating system")," affected"]})]})})]})}const Wn=V`
    ${Kn}
    query getAffectedNodes($query: String, $pagination: Pagination) {
        nodes(query: $query, pagination: $pagination) {
            ...AffectedNode
        }
    }
`;function Hn({query:n,...t}){var r,o;const s=I(Wn,{variables:{query:n,pagination:re(t)}});return{affectedNodesRequest:s,nodeData:((r=s.data)==null?void 0:r.nodes)??((o=s.previousData)==null?void 0:o.nodes)}}const Zn=V`
    query getNodeCVEMetadata($cve: String!) {
        nodeCVE(cve: $cve) {
            cve
            distroTuples {
                summary
                link
                operatingSystem
            }
            firstDiscoveredInSystem
        }
    }
`;function Xn(n){const t=I(Zn,{variables:{cve:n}}),{data:s,previousData:r}=t,o=(s==null?void 0:s.nodeCVE)??(r==null?void 0:r.nodeCVE);return{metadataRequest:t,cveData:o}}const Yn=V`
    query getNodeCVESummaryData($cve: String!, $query: String!) {
        totalNodeCount: nodeCount
        nodeCount(query: $query)
        nodeCVE(cve: $cve, subfieldScopeQuery: $query) {
            distroTuples {
                operatingSystem
            }
            affectedNodeCountBySeverity {
                critical {
                    total
                }
                important {
                    total
                }
                moderate {
                    total
                }
                low {
                    total
                }
                unknown {
                    total
                }
            }
        }
    }
`;function Jn(n,t){const s=I(Yn,{variables:{cve:n,query:t}}),{data:r,previousData:o}=s,a=(r==null?void 0:r.nodeCount)??(o==null?void 0:o.nodeCount)??0;return{summaryDataRequest:s,nodeCount:a}}const es=ht("Node",{entityTab:"CVE"}),ts=[ot,rt,we],Ze={affectedNodeCountBySeverity:{critical:{total:0},important:{total:0},moderate:{total:0},low:{total:0},unknown:{total:0}},distroTuples:[]};function ns(){const{analyticsTrack:n}=Te(),t=qe(n),{searchFilter:s,setSearchFilter:r}=Fe(),o=De(s),{cveId:a}=ct(),h=`^${a}$`,u=G({...o,CVE:[h]}),{page:d,perPage:g,setPage:x,setPerPage:y}=Le(Ie),{sortOption:j,getSortParams:C}=Oe({sortFields:zn,defaultSortOption:Un,onSort:()=>x(1)}),b=Pe(o),f=ut(o),{metadataRequest:l,cveData:v}=Xn(a),{summaryDataRequest:T,nodeCount:E}=Jn(a,u),{affectedNodesRequest:O,nodeData:D}=Hn({query:u,page:d,perPage:g,sortOption:j}),N=v==null?void 0:v.cve,L=de({isLoading:O.loading,error:O.error,data:D,searchFilter:o});return e.jsxs(e.Fragment,{children:[e.jsx(he,{title:`Node CVEs - NodeCVE ${N}`}),e.jsx(S,{type:"breadcrumb",children:e.jsxs(xt,{children:[e.jsx(mt,{to:es,children:"Node CVEs"}),e.jsx(pt,{isActive:!0,children:N??e.jsx(_e,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(S,{children:e.jsx(an,{data:v})}),e.jsx(Q,{component:"div"}),e.jsxs(S,{hasBodyWrapper:!1,children:[e.jsx($e,{searchFilter:s,searchFilterConfig:ts,defaultSearchFilterEntity:"Node",onFilterChange:(c,p)=>{r(c),x(1,"replace"),t(Ae,p)}}),e.jsxs(jt,{error:l.error,isLoading:l.loading,children:[e.jsx(oe,{data:T.data,loadingText:"Loading affected nodes summary",renderer:({data:c})=>e.jsx(Gn,{affectedNodeCount:E,totalNodeCount:c.totalNodeCount,operatingSystemCount:(c.nodeCVE??Ze).distroTuples.length})}),e.jsx(oe,{data:T.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:c})=>e.jsx(gt,{title:"Nodes by severity",severityCounts:(c.nodeCVE??Ze).affectedNodeCountBySeverity,hiddenSeverities:f})})]}),e.jsx(Q,{component:"div"}),e.jsxs(yt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ae,{isFilled:!0,children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(pe,{headingLevel:"h2",children:[Y(E,"node")," affected"]}),b&&e.jsx(Ct,{})]})}),e.jsx(ae,{children:e.jsx(ft,{itemCount:E,perPage:g,page:d,onSetPage:(c,p)=>x(p),onPerPageSelect:(c,p)=>{y(p)}})})]}),e.jsx(Qn,{tableState:L,getSortParams:C,onClearFilters:()=>{r({}),x(1)}})]})]})}const ss=V`
    fragment NodeMetadata on Node {
        id
        name
        osImage
        kubeletVersion
        kernelVersion
        scanTime
    }
`;function os({data:n}){if(!n)return e.jsx(rn,{nameScreenreaderText:"Loading Node name",metadataScreenreaderText:"Loading Node metadata"});const t=n.scanTime?4:3;return e.jsxs(B,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(pe,{headingLevel:"h1",children:n.name}),e.jsxs(dn,{numLabels:t,children:[e.jsxs(ne,{children:["OS: ",n.osImage]}),e.jsxs(ne,{children:["Kubelet: ",n.kubeletVersion]}),e.jsxs(ne,{children:["Kernel version: ",n.kernelVersion]}),n.scanTime&&e.jsxs(ne,{children:["Scan time: ",fe(n.scanTime)]})]})]})}const as=[ie,M,je,ge],rs={field:M,direction:"desc"},is=V`
    ${Et}
    fragment NodeVulnerabilityFragment on NodeVulnerability {
        cve
        summary
        cvss
        scoreVersion
        nodeComponents(query: $query) {
            ...NodeComponentFragment
        }
    }
`;function ds({tableState:n,getSortParams:t,onClearFilters:s}){const o=be();return e.jsxs(W,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(Je,{}),e.jsx(m,{sort:t(ie),children:"CVE"}),e.jsx(m,{sort:t(M),children:"Top severity"}),e.jsx(m,{sort:t(je),children:"CVE status"}),e.jsx(m,{sort:t(ge),children:"CVSS"}),e.jsx(m,{children:"Affected components"})]})}),e.jsx(le,{tableState:n,colSpan:6,emptyProps:{message:"No CVEs were detected for this node"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((h,u)=>{const{cve:d,cvss:g,scoreVersion:x,nodeComponents:y}=h,j=y.flatMap(l=>l.nodeVulnerabilities),C=it(j),b=dt(j),f=o.has(d);return e.jsxs(Z,{isExpanded:f,children:[e.jsxs(F,{children:[e.jsx(i,{expand:{rowIndex:u,isExpanded:f,onToggle:()=>o.toggle(d)}}),e.jsx(i,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ce,{to:ue("CVE",d),children:d})}),e.jsx(i,{dataLabel:"Top severity",children:e.jsx(lt,{severity:C})}),e.jsx(i,{dataLabel:"CVE status",children:e.jsx(Re,{isFixable:b})}),e.jsx(i,{dataLabel:"CVSS",children:e.jsx(Ee,{cvss:g,scoreVersion:x})}),e.jsx(i,{dataLabel:"Affected components",children:y.length===1?y[0].name:Y(y.length,"component")})]}),e.jsxs(F,{isExpanded:f,children:[e.jsx(i,{}),e.jsx(i,{colSpan:5,children:e.jsx(Ve,{children:e.jsx(Vt,{data:y})})})]})]},d)})})]})}const ls=V`
    ${is}
    query getNodeVulnerabilities($id: ID!, $query: String!, $pagination: Pagination) {
        node(id: $id) {
            id
            nodeVulnerabilityCount(query: $query)
            nodeVulnerabilities(query: $query, pagination: $pagination) {
                ...NodeVulnerabilityFragment
            }
        }
    }
`;function cs({nodeId:n,query:t,...s}){return I(ls,{variables:{id:n,query:t,pagination:re(s)}})}const us=V`
    ${ln}
    query getNodeVulnSummary($id: ID!, $query: String!) {
        node(id: $id) {
            id
            nodeCVECountBySeverity(query: $query) {
                ...ResourceCountsByCVESeverityAndStatus
            }
        }
    }
`;function xs(n,t){return I(us,{variables:{id:n,query:t}})}const ms=[at,we];function hs({nodeId:n}){var N,L;const{analyticsTrack:t}=Te(),s=qe(t),{searchFilter:r,setSearchFilter:o}=Fe(),a=De(r),h=G(a),u=Pe(a),{page:d,perPage:g,setPage:x,setPerPage:y}=Le(Ie),{sortOption:j,getSortParams:C}=Oe({sortFields:as,defaultSortOption:rs,onSort:()=>x(1,"replace")}),b=ut(a),f=cn(a),{data:l,loading:v,error:T}=cs({nodeId:n,query:h,page:d,perPage:g,sortOption:j}),E=xs(n,h),O=((N=l==null?void 0:l.node)==null?void 0:N.nodeVulnerabilityCount)??0,D=de({isLoading:v,error:T,data:(L=l==null?void 0:l.node)==null?void 0:L.nodeVulnerabilities,searchFilter:a});return e.jsxs(e.Fragment,{children:[e.jsx(S,{children:e.jsx(Ne,{component:"p",children:"Review and triage vulnerability data scanned on this node"})}),e.jsx(Q,{component:"div"}),e.jsxs(S,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx($e,{searchFilter:r,searchFilterConfig:ms,defaultSearchFilterEntity:"CVE",onFilterChange:(c,p)=>{o(c),x(1,"replace"),s(Ae,p)}}),e.jsxs(jt,{isLoading:E.loading,error:E.error,children:[e.jsx(oe,{loadingText:"Loading node CVEs by severity summary",data:E.data,renderer:({data:c})=>e.jsx(gt,{title:"CVEs by severity",severityCounts:c.node.nodeCVECountBySeverity,hiddenSeverities:b})}),e.jsx(oe,{loadingText:"Loading node CVEs by status summary",data:E.data,renderer:({data:c})=>e.jsx(un,{cveStatusCounts:c.node.nodeCVECountBySeverity,hiddenStatuses:f})})]}),e.jsx(Q,{component:"div"}),e.jsxs(yt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ae,{isFilled:!0,children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(pe,{headingLevel:"h2",children:l&&l.node?`${Y(l.node.nodeVulnerabilityCount,"result")} found`:e.jsx(_e,{screenreaderText:"Loading node vulnerability count"})}),u&&e.jsx(Ct,{})]})}),e.jsx(ae,{children:e.jsx(ft,{itemCount:O,perPage:g,page:d,onSetPage:(c,p)=>x(p),onPerPageSelect:(c,p)=>{y(p)}})})]}),e.jsx(ds,{tableState:D,getSortParams:C,onClearFilters:()=>{o({}),x(1)}})]})]})}const ps=V`
    query getNodeExtendedDetails($id: ID!) {
        node(id: $id) {
            id
            cluster {
                name
            }
            containerRuntimeVersion
            joinedAt
            scanTime
            kernelVersion
            kubeletVersion
            labels {
                key
                value
            }
            annotations {
                key
                value
            }
        }
    }
`;function js(n){return I(ps,{variables:{id:n}})}function gs({nodeId:n}){const{data:t,loading:s,error:r}=js(n);return e.jsxs(e.Fragment,{children:[e.jsx(S,{component:"div",children:e.jsx(Ne,{component:"p",children:"View details about this node"})}),e.jsx(Q,{component:"div"}),e.jsx(S,{isFilled:!0,children:r?e.jsx(ve,{children:e.jsx(vt,{title:"There was an error loading the node details",headingLevel:"h2",icon:bt,status:"danger",children:St(r)})}):s?e.jsx(ve,{children:e.jsx(xn,{size:"xl"})}):t&&e.jsxs(B,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(mn,{columnModifier:{default:"1Col",lg:"2Col"},children:[e.jsxs(A,{children:[e.jsx(R,{children:"Cluster"}),e.jsx(_,{children:t.node.cluster.name})]}),t.node.containerRuntimeVersion&&e.jsxs(A,{children:[e.jsx(R,{children:"Container runtime"}),e.jsx(_,{children:t.node.containerRuntimeVersion})]}),t.node.joinedAt&&e.jsxs(A,{children:[e.jsx(R,{children:"Join time"}),e.jsx(_,{children:fe(t.node.joinedAt)})]}),t.node.scanTime&&e.jsxs(A,{children:[e.jsx(R,{children:"Scan time"}),e.jsx(_,{children:fe(t.node.scanTime)})]}),t.node.kernelVersion&&e.jsxs(A,{children:[e.jsx(R,{children:"Kernel version"}),e.jsx(_,{children:t.node.kernelVersion})]}),t.node.kubeletVersion&&e.jsxs(A,{children:[e.jsx(R,{children:"Kubelet"}),e.jsx(_,{children:t.node.kubeletVersion})]})]}),e.jsx(Ge,{toggleText:"Labels",labels:t.node.labels}),e.jsx(Ge,{toggleText:"Annotations",labels:t.node.annotations})]})})]})}const ys="NodePageDetails",Cs="NodePageVulnerabilities",fs=ht("Node",{entityTab:"Node"}),vs=V`
    ${ss}
    query getNodeMetadata($id: ID!) {
        node(id: $id) {
            ...NodeMetadata
        }
    }
`;function Ss(){var d;const{nodeId:n}=ct(),{data:t,error:s}=I(vs,{variables:{id:n}}),[r,o]=st("detailsTab",ye),a=ye[0],h=ye[1],u=((d=t==null?void 0:t.node)==null?void 0:d.name)??"-";return e.jsxs(e.Fragment,{children:[e.jsx(he,{title:`Node CVEs - Node ${u}`}),e.jsx(S,{type:"breadcrumb",children:e.jsxs(xt,{children:[e.jsx(mt,{to:fs,children:"Nodes"}),e.jsx(pt,{isActive:!0,children:u??e.jsx(_e,{screenreaderText:"Loading Node name",width:"200px"})})]})}),s?e.jsx(S,{children:e.jsx(ve,{children:e.jsx(vt,{title:St(s),headingLevel:"h2",icon:bt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(S,{children:e.jsx(os,{data:t==null?void 0:t.node})}),e.jsx(S,{type:"tabs",children:e.jsxs(hn,{activeKey:r,onSelect:(g,x)=>{o(x)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Qe,{eventKey:a,tabContentId:Cs,title:a,children:e.jsx(hs,{nodeId:n})}),e.jsx(Qe,{eventKey:h,tabContentId:ys,title:h,children:e.jsx(gs,{nodeId:n})})]})})]})]})}function Is(){const{hasReadAccess:n}=pn(),t=n("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(jn,{}),e.jsxs(gn,{children:[e.jsx(se,{index:!0,element:e.jsx(_n,{})}),e.jsx(se,{path:"cves/:cveId",element:e.jsx(ns,{})}),e.jsx(se,{path:"nodes/:nodeId",element:e.jsx(Ss,{})}),e.jsx(se,{path:"*",element:e.jsxs(S,{hasBodyWrapper:!1,children:[e.jsx(he,{title:"Node CVEs - Not Found"}),e.jsx(yn,{})]})})]})]})}export{Is as default};
