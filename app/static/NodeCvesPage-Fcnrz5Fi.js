import{ca as te,lT as K,lU as ne,lV as Ce,lW as Nt,dq as se,ey as ge,lX as We,lY as Ze,t as e,ax as U,ay as G,X as L,lZ as Xe,l_ as Tt,az as x,l$ as Be,m0 as je,lE as Lt,lF as Ft,dc as oe,lH as Ot,lI as It,aA as H,ao as i,m1 as Dt,a$ as ae,m2 as re,lJ as Ye,lK as fe,lL as Je,b2 as $t,cp as be,ae as ve,m3 as Pt,m4 as W,m5 as ie,m6 as de,m7 as et,dG as _,bE as Se,ek as qt,c$ as tt,m8 as Rt,ct as Ee,cs as Ve,lx as Ne,cu as Te,m9 as Le,dr as Fe,ma as At,bF as _t,mb as wt,ag as le,a3 as E,at as w,a4 as ce,au as Me,aa as kt,bK as Bt,bL as Mt,mc as zt,aN as Qt,bJ as Kt,I as Ut,md as Gt,me as Ht,lz as Oe,mf as nt,mg as st,mh as ot,mi as Ie,lq as De,mj as $e,jt as Wt,mk as Pe,f6 as Zt,ml as k,mm as ue,mn as xe,mo as at,mp as rt,mq as Xt,mr as it,b0 as Z,aI as Yt,aJ as Jt,aK as en,bB as tn,bf as ze,b9 as dt,ms as lt,b5 as ct,b6 as ut,mt as xt,b7 as mt,dZ as qe,mu as nn,b8 as Q,mv as ht,mw as J,mx as jt,dR as pt,fO as ee,my as yt,cr as Ct,mz as sn,dY as on,aQ as X,d6 as pe,mA as an,mB as rn,mC as dn,bb as ye,bO as gt,cj as ft,cc as bt,bc as ln,cf as cn,cg as q,ch as R,ci as A,mD as he,a5 as un,a6 as Qe,aX as xn,mE as mn,c7 as hn,c8 as Y,eV as jn}from"./index-CaOU0A7g.js";import{u as O,g as V,f as pn,r as yn}from"./apollo-BxVF6eGb.js";import{u as Cn,a as gn,b as fn,S as bn,c as vn,E as Ke}from"./ExpandableLabelSection-hyFDlDvc.js";import"./react-pF2EnNv3.js";import"./lodash-JMWJiBov.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-DIWLG-dY.js";const Sn=V`
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
`;function En({querySearchFilter:n,...t}){return O(Sn,{variables:{query:K(n),pagination:te(t)}})}const Vn=V`
    query getTotalNodeCount {
        nodeCount
    }
`;function Nn(){var t;return((t=O(Vn).data)==null?void 0:t.nodeCount)??0}const Tn=[ne,Ce,Nt],Ue={field:Ce,direction:"desc",aggregateBy:{aggregateFunc:"max",distinct:"false"}};function Ln({querySearchFilter:n,isFiltered:t,pagination:s,selectedCves:r,createRowActions:o,canSelectRows:a,sortOption:j,getSortParams:m,onClearFilters:d}){var D;const{page:y,perPage:u}=s,{data:C,previousData:p,loading:g,error:v}=En({querySearchFilter:n,page:y,perPage:u,sortOption:j}),f=Nn(),l=C??p,b=se({isLoading:g,data:l==null?void 0:l.nodeCVEs,error:v,searchFilter:n}),T=ge(),S=a?8:6,I=(D=n.SEVERITY)==null?void 0:D.map(N=>We[N]).filter(Ze);return e.jsxs(U,{borders:b.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":g?"true":"false",children:[e.jsx(G,{noWrap:!0,children:e.jsxs(L,{children:[e.jsx(Xe,{}),a&&e.jsx(Tt,{selectedCves:r}),e.jsx(x,{sort:m(ne),children:"CVE"}),e.jsxs(Be,{tooltip:"The number of nodes affected by this CVE, grouped by the severity of the CVE on each node",children:["Nodes by severity",t&&e.jsx(je,{})]}),e.jsx(x,{sort:m(Ce,Lt),children:"Top CVSS"}),e.jsxs(Be,{tooltip:"Ratio of the number of nodes affected by this CVE to the total number of nodes",sort:m("Node ID",Ft),children:["Affected nodes",t&&e.jsx(je,{})]}),e.jsx(x,{children:"First discovered"}),a&&e.jsx(x,{screenReaderText:"Row actions"})]})}),e.jsx(oe,{tableState:b,colSpan:S,emptyProps:{message:"No CVEs have been detected for nodes across your secured clusters"},filteredEmptyProps:{onClearFilters:d},renderer:({data:N})=>N.map((F,c)=>{const{cve:h,affectedNodeCountBySeverity:{critical:B,important:M,moderate:P,low:$,unknown:z},distroTuples:Re,topCVSS:Ae,affectedNodeCount:Et,firstDiscoveredInSystem:Vt}=F,me=T.has(h),_e=Ot(Re),we=_e.length>0?_e[0].summary:"",ke=It(Ae,Re);return e.jsxs(H,{isExpanded:me,children:[e.jsxs(L,{children:[e.jsx(i,{expand:{rowIndex:c,isExpanded:me,onToggle:()=>T.toggle(h)}}),a&&e.jsx(Dt,{selectedCves:r,rowIndex:c,item:{cve:h}}),e.jsx(i,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ae,{to:re("CVE",h),children:h})}),e.jsx(i,{dataLabel:"Nodes by severity",children:e.jsx(Ye,{criticalCount:B.total,importantCount:M.total,moderateCount:P.total,lowCount:$.total,unknownCount:z.total,filteredSeverities:I,entity:"node"})}),e.jsx(i,{dataLabel:"Top CVSS",children:e.jsx(fe,{cvss:Ae,scoreVersion:ke.length>0?ke.join("/"):void 0})}),e.jsxs(i,{dataLabel:"Affected nodes",children:[Et," / ",f," affected nodes"]}),e.jsx(i,{dataLabel:"First discovered",children:e.jsx(Je,{date:Vt})}),a&&e.jsx(i,{isActionCell:!0,children:e.jsx($t,{items:o({cve:h})})})]}),e.jsxs(L,{isExpanded:me,children:[e.jsx(i,{}),e.jsx(i,{colSpan:S-1,children:e.jsx(be,{children:we?e.jsx(ve,{component:"p",children:we}):e.jsx(Pt,{})})})]})]},h)})})]})}const Fn=V`
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
`;function On({querySearchFilter:n,...t}){return O(Fn,{variables:{query:K(n),pagination:te(t)}})}const In=[W,ie,de,et],Ge={field:W,direction:"asc"};function Dn({querySearchFilter:n,isFiltered:t,pagination:s,sortOption:r,getSortParams:o,onClearFilters:a}){var f;const{page:j,perPage:m}=s,{data:d,previousData:y,loading:u,error:C}=On({querySearchFilter:n,page:j,perPage:m,sortOption:r}),p=d??y,g=se({isLoading:u,data:p==null?void 0:p.nodes,error:C,searchFilter:n}),v=(f=n.SEVERITY)==null?void 0:f.map(l=>We[l]).filter(Ze);return e.jsxs(U,{borders:g.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":u?"true":"false",children:[e.jsx(G,{noWrap:!0,children:e.jsxs(L,{children:[e.jsx(x,{sort:o(W),children:"Node"}),e.jsxs(x,{children:["CVEs by severity",t&&e.jsx(je,{})]}),e.jsx(x,{sort:o(ie),children:"Cluster"}),e.jsx(x,{sort:o(de),children:"Operating system"}),e.jsx(x,{sort:o(et),children:"Scan time"})]})}),e.jsx(oe,{tableState:g,colSpan:5,emptyProps:{message:"No CVEs have been reported for your scanned nodes"},filteredEmptyProps:{onClearFilters:a},renderer:({data:l})=>e.jsx(H,{children:l.map(b=>{const{id:T,name:S,nodeCVECountBySeverity:I,cluster:D,osImage:N,scanTime:F}=b,{critical:c,important:h,moderate:B,low:M,unknown:P}=I;return e.jsxs(L,{children:[e.jsx(i,{dataLabel:"Node",modifier:"nowrap",children:e.jsx(ae,{to:re("Node",T),children:e.jsx(_,{position:"middle",content:S})})}),e.jsx(i,{dataLabel:"CVEs by severity",children:e.jsx(Ye,{criticalCount:c.total,importantCount:h.total,moderateCount:B.total,lowCount:M.total,unknownCount:P.total,filteredSeverities:v,entity:"node"})}),e.jsx(i,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(_,{position:"middle",content:D.name})}),e.jsx(i,{dataLabel:"Operating system",modifier:"nowrap",children:e.jsx(_,{position:"middle",content:N})}),e.jsx(i,{dataLabel:"Scan time",children:e.jsx(Je,{date:F})})]},T)})})})]})}const $n=V`
    query getNodeCVEEntityCounts($query: String) {
        nodeCVECount(query: $query)
        nodeCount(query: $query)
    }
`;function Pn(n){return O($n,{variables:{query:K(n)}})}const qn=[nt,st,ot,Ie];function Rn(){var P;const n=pn(),{analyticsTrack:t}=Se(),s=De(t),{isFeatureFlagEnabled:r}=qt(),o=r("ROX_SCANNER_V4")&&r("ROX_NODE_INDEX_ENABLED"),[a]=tt("entityTab",Rt),{searchFilter:j,setSearchFilter:m}=Ee(),d=Ve(Ne),{sortOption:y,getSortParams:u,setSortOption:C}=Te({sortFields:a==="CVE"?Tn:In,defaultSortOption:a==="CVE"?Ue:Ge,onSort:()=>d.setPage(1)}),p=Le(j),g=Fe(p),v=((P=p["CVE Snoozed"])==null?void 0:P[0])==="true",f=Cn(),l=At(),{snoozeModalOptions:b,setSnoozeModalOptions:T,snoozeActionCreator:S}=gn(),I=fn("Node"),{version:D}=_t();function N($){d.setPage(1),C($==="CVE"?Ue:Ge),t({event:Gt,properties:{type:$,page:"Overview"}})}yn.useEffect(()=>{N(a)},[]);function F(){m({}),d.setPage(1)}const{data:c}=Pn(p),h={CVE:(c==null?void 0:c.nodeCVECount)??0,Node:(c==null?void 0:c.nodeCount)??0},B=e.jsx(Oe,{searchFilter:j,searchFilterConfig:qn,defaultSearchFilterEntity:"Node",onFilterChange:($,z)=>{m($),d.setPage(1),s($e,z)}}),M=e.jsx(Ht,{entityTabs:["CVE","Node"],entityCounts:h,onChange:N});return e.jsxs(e.Fragment,{children:[b&&e.jsx(bn,{...b,onSuccess:($,z)=>{$==="SNOOZE"&&t({event:wt,properties:{type:"NODE",duration:z}}),n.cache.evict({fieldName:"nodeCVEs"}),n.cache.evict({fieldName:"nodeCVECount"}),n.cache.gc(),l.clear()},onClose:()=>T(null)}),e.jsx(le,{title:"Node CVEs Overview"}),e.jsx(E,{children:e.jsxs(w,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(w,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(ce,{headingLevel:"h1",children:"Node CVEs"}),e.jsx(Me,{children:"Prioritize and manage scanned CVEs across nodes"})]}),e.jsx(Me,{children:e.jsx(vn,{searchFilter:j,setSearchFilter:m,snoozedCveCount:I})})]})}),o&&e.jsx(E,{children:e.jsx(kt,{isInline:!0,variant:"info",title:"Results may include Node CVEs obtained from Scanner V4",component:"p",children:e.jsx(Bt,{children:e.jsx("a",{href:Mt(D,"operating/managing-vulnerabilities#understanding-node-cves-scanner-v4_scan-rhcos-node-host"),target:"_blank",rel:"noopener noreferrer",children:"Read more about the differences between the node scanning results obtained with the StackRox Scanner and Scanner V4."})})})}),e.jsxs(E,{isCenterAligned:!0,children:[e.jsx(zt,{filterToolbar:B,entityToggleGroup:M,pagination:d,tableRowCount:a==="CVE"?h.CVE:h.Node,isFiltered:g,children:f&&e.jsx(Qt,{align:{default:"alignEnd"},children:e.jsx(Kt,{toggleText:"Bulk actions",isDisabled:l.size===0,children:e.jsx(Ut,{onClick:()=>T({action:v?"UNSNOOZE":"SNOOZE",cveType:"NODE_CVE",cves:Array.from(l.values())}),children:v?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),a==="CVE"&&e.jsx(Ln,{querySearchFilter:p,isFiltered:g,pagination:d,selectedCves:l,canSelectRows:f,createRowActions:S("NODE_CVE",v?"UNSNOOZE":"SNOOZE"),sortOption:y,getSortParams:u,onClearFilters:F}),a==="Node"&&e.jsx(Dn,{querySearchFilter:p,isFiltered:g,pagination:d,sortOption:y,getSortParams:u,onClearFilters:F})]})]})}function An(n,t){const s=Zt(n,r=>{var o,a;switch(t.field){case"Component":return(o=r.name)==null?void 0:o.toLowerCase();case"Type":return(a=r.source)==null?void 0:a.toLowerCase();default:return""}});return t.reversed&&s.reverse(),s}const vt=V`
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
`,_n=["Component","Type"],wn={field:"Component",direction:"asc"};function St({data:n}){const{sortOption:t,getSortParams:s}=Wt({sortFields:_n,defaultSortOption:wn}),r=An(n,t);return n.length===0?null:e.jsxs(U,{children:[e.jsx(G,{noWrap:!0,children:e.jsxs(L,{children:[e.jsx(x,{sort:s("Component"),children:"Component"}),e.jsx(x,{children:"Version"}),e.jsx(x,{children:"CVE fixed in"}),e.jsx(x,{sort:s("Type"),children:"Type"})]})}),e.jsx(H,{children:r.map(({name:o,source:a,version:j,nodeVulnerabilities:m})=>{var y;const d=(y=m==null?void 0:m[0])==null?void 0:y.fixedByVersion;return e.jsxs(L,{children:[e.jsx(i,{dataLabel:"Component",children:o}),e.jsx(i,{dataLabel:"Version",children:j}),e.jsx(i,{dataLabel:"CVE fixed in",children:d||e.jsx(Pe,{isFixable:!1})}),e.jsx(i,{dataLabel:"Type",children:a})]},o)})})]})}const kn=[W,k,ue,xe,ie,de],Bn={field:k,direction:"desc"},Mn=V`
    ${vt}
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
`;function zn({tableState:n,getSortParams:t,onClearFilters:s}){const o=ge();return e.jsxs(U,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(G,{noWrap:!0,children:e.jsxs(L,{children:[e.jsx(x,{screenReaderText:"Row expansion"}),e.jsx(x,{sort:t(W),children:"Node"}),e.jsx(x,{sort:t(k),children:"CVE severity"}),e.jsx(x,{sort:t(ue),children:"CVE status"}),e.jsx(x,{sort:t(xe),children:"CVSS"}),e.jsx(x,{sort:t(ie),children:"Cluster"}),e.jsx(x,{sort:t(de),children:"Operating system"}),e.jsx(x,{children:"Affected components"})]})}),e.jsx(oe,{tableState:n,colSpan:8,emptyProps:{message:"There are no nodes that are affected by this CVE"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((j,m)=>{const{id:d,name:y,nodeComponents:u}=j,C=o.has(d),p=u.flatMap(b=>b.nodeVulnerabilities),g=at(p),v=rt(p),{cvss:f,scoreVersion:l}=Xt(p);return e.jsxs(H,{isExpanded:C,children:[e.jsxs(L,{children:[e.jsx(i,{expand:{rowIndex:m,isExpanded:C,onToggle:()=>o.toggle(d)}}),e.jsx(i,{dataLabel:"Node",children:e.jsx(ae,{to:re("Node",d),children:e.jsx(_,{position:"middle",content:y})})}),e.jsx(i,{dataLabel:"CVE severity",modifier:"nowrap",children:e.jsx(it,{severity:g})}),e.jsx(i,{dataLabel:"CVE status",modifier:"nowrap",children:e.jsx(Pe,{isFixable:v})}),e.jsx(i,{dataLabel:"CVSS",modifier:"nowrap",children:e.jsx(fe,{cvss:f,scoreVersion:l})}),e.jsx(i,{dataLabel:"Cluster",children:e.jsx(_,{position:"middle",content:j.cluster.name})}),e.jsx(i,{dataLabel:"Operating system",children:e.jsx(_,{position:"middle",content:j.osImage})}),e.jsx(i,{dataLabel:"Affected components",children:u.length===1?u[0].name:Z(u.length,"component")})]}),e.jsxs(L,{isExpanded:C,children:[e.jsx(i,{}),e.jsx(i,{colSpan:7,children:e.jsx(be,{children:e.jsx(St,{data:u})})})]})]},d)})})]})}function Qn({affectedNodeCount:n,totalNodeCount:t,operatingSystemCount:s}){return e.jsxs(Yt,{isCompact:!0,isFullHeight:!0,children:[e.jsx(Jt,{children:"Affected nodes"}),e.jsx(en,{children:e.jsxs(tn,{children:[e.jsxs(ze,{span:12,className:"pf-v6-u-pt-sm",children:[n," / ",t," affected nodes"]}),e.jsxs(ze,{span:12,className:"pf-v6-u-pt-sm",children:[Z(s,"operating system")," affected"]})]})})]})}const Kn=V`
    ${Mn}
    query getAffectedNodes($query: String, $pagination: Pagination) {
        nodes(query: $query, pagination: $pagination) {
            ...AffectedNode
        }
    }
`;function Un({query:n,...t}){var r,o;const s=O(Kn,{variables:{query:n,pagination:te(t)}});return{affectedNodesRequest:s,nodeData:((r=s.data)==null?void 0:r.nodes)??((o=s.previousData)==null?void 0:o.nodes)}}const Gn=V`
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
`;function Hn(n){const t=O(Gn,{variables:{cve:n}}),{data:s,previousData:r}=t,o=(s==null?void 0:s.nodeCVE)??(r==null?void 0:r.nodeCVE);return{metadataRequest:t,cveData:o}}const Wn=V`
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
`;function Zn(n,t){const s=O(Wn,{variables:{cve:n,query:t}}),{data:r,previousData:o}=s,a=(r==null?void 0:r.nodeCount)??(o==null?void 0:o.nodeCount)??0;return{summaryDataRequest:s,nodeCount:a}}const Xn=xt("Node",{entityTab:"CVE"}),Yn=[nt,ot,Ie],He={affectedNodeCountBySeverity:{critical:{total:0},important:{total:0},moderate:{total:0},low:{total:0},unknown:{total:0}},distroTuples:[]};function Jn(){const{analyticsTrack:n}=Se(),t=De(n),{searchFilter:s,setSearchFilter:r}=Ee(),o=Le(s),{cveId:a}=dt(),j=`^${a}$`,m=K({...o,CVE:[j]}),{page:d,perPage:y,setPage:u,setPerPage:C}=Ve(Ne),{sortOption:p,getSortParams:g}=Te({sortFields:kn,defaultSortOption:Bn,onSort:()=>u(1)}),v=Fe(o),f=lt(o),{metadataRequest:l,cveData:b}=Hn(a),{summaryDataRequest:T,nodeCount:S}=Zn(a,m),{affectedNodesRequest:I,nodeData:D}=Un({query:m,page:d,perPage:y,sortOption:p}),N=b==null?void 0:b.cve,F=se({isLoading:I.loading,error:I.error,data:D,searchFilter:o});return e.jsxs(e.Fragment,{children:[e.jsx(le,{title:`Node CVEs - NodeCVE ${N}`}),e.jsx(E,{type:"breadcrumb",children:e.jsxs(ct,{children:[e.jsx(ut,{to:Xn,children:"Node CVEs"}),e.jsx(mt,{isActive:!0,children:N??e.jsx(qe,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(E,{children:e.jsx(nn,{data:b})}),e.jsx(Q,{component:"div"}),e.jsxs(E,{hasBodyWrapper:!1,children:[e.jsx(Oe,{searchFilter:s,searchFilterConfig:Yn,defaultSearchFilterEntity:"Node",onFilterChange:(c,h)=>{r(c),u(1,"replace"),t($e,h)}}),e.jsxs(ht,{error:l.error,isLoading:l.loading,children:[e.jsx(J,{data:T.data,loadingText:"Loading affected nodes summary",renderer:({data:c})=>e.jsx(Qn,{affectedNodeCount:S,totalNodeCount:c.totalNodeCount,operatingSystemCount:(c.nodeCVE??He).distroTuples.length})}),e.jsx(J,{data:T.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:c})=>e.jsx(jt,{title:"Nodes by severity",severityCounts:(c.nodeCVE??He).affectedNodeCountBySeverity,hiddenSeverities:f})})]}),e.jsx(Q,{component:"div"}),e.jsxs(pt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ee,{isFilled:!0,children:e.jsxs(w,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(ce,{headingLevel:"h2",children:[Z(S,"node")," affected"]}),v&&e.jsx(yt,{})]})}),e.jsx(ee,{children:e.jsx(Ct,{itemCount:S,perPage:y,page:d,onSetPage:(c,h)=>u(h),onPerPageSelect:(c,h)=>{C(h)}})})]}),e.jsx(zn,{tableState:F,getSortParams:g,onClearFilters:()=>{r({}),u(1)}})]})]})}const es=V`
    fragment NodeMetadata on Node {
        id
        name
        osImage
        kubeletVersion
        kernelVersion
        scanTime
    }
`;function ts({data:n}){if(!n)return e.jsx(sn,{nameScreenreaderText:"Loading Node name",metadataScreenreaderText:"Loading Node metadata"});const t=n.scanTime?4:3;return e.jsxs(w,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(ce,{headingLevel:"h1",children:n.name}),e.jsxs(on,{numLabels:t,children:[e.jsxs(X,{children:["OS: ",n.osImage]}),e.jsxs(X,{children:["Kubelet: ",n.kubeletVersion]}),e.jsxs(X,{children:["Kernel version: ",n.kernelVersion]}),n.scanTime&&e.jsxs(X,{children:["Scan time: ",pe(n.scanTime)]})]})]})}const ns=[ne,k,ue,xe],ss={field:k,direction:"desc"},os=V`
    ${vt}
    fragment NodeVulnerabilityFragment on NodeVulnerability {
        cve
        summary
        cvss
        scoreVersion
        nodeComponents(query: $query) {
            ...NodeComponentFragment
        }
    }
`;function as({tableState:n,getSortParams:t,onClearFilters:s}){const o=ge();return e.jsxs(U,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(G,{noWrap:!0,children:e.jsxs(L,{children:[e.jsx(Xe,{}),e.jsx(x,{sort:t(ne),children:"CVE"}),e.jsx(x,{sort:t(k),children:"Top severity"}),e.jsx(x,{sort:t(ue),children:"CVE status"}),e.jsx(x,{sort:t(xe),children:"CVSS"}),e.jsx(x,{children:"Affected components"})]})}),e.jsx(oe,{tableState:n,colSpan:6,emptyProps:{message:"No CVEs were detected for this node"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((j,m)=>{const{cve:d,cvss:y,scoreVersion:u,nodeComponents:C}=j,p=C.flatMap(l=>l.nodeVulnerabilities),g=at(p),v=rt(p),f=o.has(d);return e.jsxs(H,{isExpanded:f,children:[e.jsxs(L,{children:[e.jsx(i,{expand:{rowIndex:m,isExpanded:f,onToggle:()=>o.toggle(d)}}),e.jsx(i,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ae,{to:re("CVE",d),children:d})}),e.jsx(i,{dataLabel:"Top severity",children:e.jsx(it,{severity:g})}),e.jsx(i,{dataLabel:"CVE status",children:e.jsx(Pe,{isFixable:v})}),e.jsx(i,{dataLabel:"CVSS",children:e.jsx(fe,{cvss:y,scoreVersion:u})}),e.jsx(i,{dataLabel:"Affected components",children:C.length===1?C[0].name:Z(C.length,"component")})]}),e.jsxs(L,{isExpanded:f,children:[e.jsx(i,{}),e.jsx(i,{colSpan:5,children:e.jsx(be,{children:e.jsx(St,{data:C})})})]})]},d)})})]})}const rs=V`
    ${os}
    query getNodeVulnerabilities($id: ID!, $query: String!, $pagination: Pagination) {
        node(id: $id) {
            id
            nodeVulnerabilityCount(query: $query)
            nodeVulnerabilities(query: $query, pagination: $pagination) {
                ...NodeVulnerabilityFragment
            }
        }
    }
`;function is({nodeId:n,query:t,...s}){return O(rs,{variables:{id:n,query:t,pagination:te(s)}})}const ds=V`
    ${an}
    query getNodeVulnSummary($id: ID!, $query: String!) {
        node(id: $id) {
            id
            nodeCVECountBySeverity(query: $query) {
                ...ResourceCountsByCVESeverityAndStatus
            }
        }
    }
`;function ls(n,t){return O(ds,{variables:{id:n,query:t}})}const cs=[st,Ie];function us({nodeId:n}){var N,F;const{analyticsTrack:t}=Se(),s=De(t),{searchFilter:r,setSearchFilter:o}=Ee(),a=Le(r),j=K(a),m=Fe(a),{page:d,perPage:y,setPage:u,setPerPage:C}=Ve(Ne),{sortOption:p,getSortParams:g}=Te({sortFields:ns,defaultSortOption:ss,onSort:()=>u(1,"replace")}),v=lt(a),f=rn(a),{data:l,loading:b,error:T}=is({nodeId:n,query:j,page:d,perPage:y,sortOption:p}),S=ls(n,j),I=((N=l==null?void 0:l.node)==null?void 0:N.nodeVulnerabilityCount)??0,D=se({isLoading:b,error:T,data:(F=l==null?void 0:l.node)==null?void 0:F.nodeVulnerabilities,searchFilter:a});return e.jsxs(e.Fragment,{children:[e.jsx(E,{children:e.jsx(ve,{component:"p",children:"Review and triage vulnerability data scanned on this node"})}),e.jsx(Q,{component:"div"}),e.jsxs(E,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(Oe,{searchFilter:r,searchFilterConfig:cs,defaultSearchFilterEntity:"CVE",onFilterChange:(c,h)=>{o(c),u(1,"replace"),s($e,h)}}),e.jsxs(ht,{isLoading:S.loading,error:S.error,children:[e.jsx(J,{loadingText:"Loading node CVEs by severity summary",data:S.data,renderer:({data:c})=>e.jsx(jt,{title:"CVEs by severity",severityCounts:c.node.nodeCVECountBySeverity,hiddenSeverities:v})}),e.jsx(J,{loadingText:"Loading node CVEs by status summary",data:S.data,renderer:({data:c})=>e.jsx(dn,{cveStatusCounts:c.node.nodeCVECountBySeverity,hiddenStatuses:f})})]}),e.jsx(Q,{component:"div"}),e.jsxs(pt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ee,{isFilled:!0,children:e.jsxs(w,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(ce,{headingLevel:"h2",children:l&&l.node?`${Z(l.node.nodeVulnerabilityCount,"result")} found`:e.jsx(qe,{screenreaderText:"Loading node vulnerability count"})}),m&&e.jsx(yt,{})]})}),e.jsx(ee,{children:e.jsx(Ct,{itemCount:I,perPage:y,page:d,onSetPage:(c,h)=>u(h),onPerPageSelect:(c,h)=>{C(h)}})})]}),e.jsx(as,{tableState:D,getSortParams:g,onClearFilters:()=>{o({}),u(1)}})]})]})}const xs=V`
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
`;function ms(n){return O(xs,{variables:{id:n}})}function hs({nodeId:n}){const{data:t,loading:s,error:r}=ms(n);return e.jsxs(e.Fragment,{children:[e.jsx(E,{component:"div",children:e.jsx(ve,{component:"p",children:"View details about this node"})}),e.jsx(Q,{component:"div"}),e.jsx(E,{isFilled:!0,children:r?e.jsx(ye,{children:e.jsx(gt,{title:"There was an error loading the node details",headingLevel:"h2",icon:bt,status:"danger",children:ft(r)})}):s?e.jsx(ye,{children:e.jsx(ln,{size:"xl"})}):t&&e.jsxs(w,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(cn,{columnModifier:{default:"1Col",lg:"2Col"},children:[e.jsxs(q,{children:[e.jsx(R,{children:"Cluster"}),e.jsx(A,{children:t.node.cluster.name})]}),t.node.containerRuntimeVersion&&e.jsxs(q,{children:[e.jsx(R,{children:"Container runtime"}),e.jsx(A,{children:t.node.containerRuntimeVersion})]}),t.node.joinedAt&&e.jsxs(q,{children:[e.jsx(R,{children:"Join time"}),e.jsx(A,{children:pe(t.node.joinedAt)})]}),t.node.scanTime&&e.jsxs(q,{children:[e.jsx(R,{children:"Scan time"}),e.jsx(A,{children:pe(t.node.scanTime)})]}),t.node.kernelVersion&&e.jsxs(q,{children:[e.jsx(R,{children:"Kernel version"}),e.jsx(A,{children:t.node.kernelVersion})]}),t.node.kubeletVersion&&e.jsxs(q,{children:[e.jsx(R,{children:"Kubelet"}),e.jsx(A,{children:t.node.kubeletVersion})]})]}),e.jsx(Ke,{toggleText:"Labels",labels:t.node.labels}),e.jsx(Ke,{toggleText:"Annotations",labels:t.node.annotations})]})})]})}const js="NodePageDetails",ps="NodePageVulnerabilities",ys=xt("Node",{entityTab:"Node"}),Cs=V`
    ${es}
    query getNodeMetadata($id: ID!) {
        node(id: $id) {
            ...NodeMetadata
        }
    }
`;function gs(){var d;const{nodeId:n}=dt(),{data:t,error:s}=O(Cs,{variables:{id:n}}),[r,o]=tt("detailsTab",he),a=he[0],j=he[1],m=((d=t==null?void 0:t.node)==null?void 0:d.name)??"-";return e.jsxs(e.Fragment,{children:[e.jsx(le,{title:`Node CVEs - Node ${m}`}),e.jsx(E,{type:"breadcrumb",children:e.jsxs(ct,{children:[e.jsx(ut,{to:ys,children:"Nodes"}),e.jsx(mt,{isActive:!0,children:m??e.jsx(qe,{screenreaderText:"Loading Node name",width:"200px"})})]})}),s?e.jsx(E,{children:e.jsx(ye,{children:e.jsx(gt,{title:ft(s),headingLevel:"h2",icon:bt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(E,{children:e.jsx(ts,{data:t==null?void 0:t.node})}),e.jsx(E,{type:"tabs",children:e.jsxs(un,{activeKey:r,onSelect:(y,u)=>{o(u)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Qe,{eventKey:a,tabContentId:ps,title:a,children:e.jsx(us,{nodeId:n})}),e.jsx(Qe,{eventKey:j,tabContentId:js,title:j,children:e.jsx(hs,{nodeId:n})})]})})]})]})}function Ts(){const{hasReadAccess:n}=xn(),t=n("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(mn,{}),e.jsxs(hn,{children:[e.jsx(Y,{index:!0,element:e.jsx(Rn,{})}),e.jsx(Y,{path:"cves/:cveId",element:e.jsx(Jn,{})}),e.jsx(Y,{path:"nodes/:nodeId",element:e.jsx(gs,{})}),e.jsx(Y,{path:"*",element:e.jsxs(E,{hasBodyWrapper:!1,children:[e.jsx(le,{title:"Node CVEs - Not Found"}),e.jsx(jn,{})]})})]})]})}export{Ts as default};
