import{cm as re,me as W,mf as ie,mg as Se,mh as Nt,dF as de,eP as be,mi as Xe,mj as Ye,x as e,aI as G,aJ as H,a7 as F,mk as Je,ml as Tt,aK as h,mm as ze,mn as Ce,l$ as Ft,m0 as Lt,ds as le,m2 as It,m3 as Ot,aL as Z,az as d,mo as Dt,bb as ce,mp as ue,m4 as et,m5 as Ee,m6 as tt,be as Pt,cz as Ve,ap as Ne,mq as $t,mr as X,ms as me,mt as xe,mu as nt,dX as k,bQ as Te,eB as qt,d9 as st,mv as At,cD as Fe,cC as Le,lU as Ie,cE as Oe,jZ as Rt,mw as De,dG as Pe,mx as wt,bR as _t,kJ as kt,kK as Bt,kL as Mt,lW as $e,my as ot,mz as at,mA as rt,mB as qe,lN as Ae,mC as Re,mD as zt,ar as he,ae as S,aE as B,af as pe,aF as Ue,al as Ut,bW as Kt,bX as Qt,mE as Wt,aZ as Gt,bV as Ht,M as Zt,mF as Xt,mG as Yt,jL as Jt,mH as we,fn as en,mI as M,mJ as je,mK as ge,mL as it,mM as dt,mN as tn,mO as lt,bc as Y,aT as nn,aV as sn,aW as on,bN as an,br as Ke,bl as ct,mP as ut,bh as mt,bi as xt,mQ as ht,bj as pt,ee as _e,mR as rn,bk as Q,mS as jt,mT as oe,mU as gt,e6 as yt,g3 as ae,mV as Ct,cB as ft,mW as dn,ed as ln,b0 as ne,dl as fe,mX as cn,mY as un,mZ as mn,bn as ve,b_ as vt,ct as St,dU as bt,bo as xn,cp as hn,cq as R,cr as w,cs as _,m_ as ye,ag as pn,ah as Qe,b7 as jn,m$ as gn,cj as yn,ck as se,fa as Cn}from"./index-Dt8FAWWS.js";import{u as I,g as V,f as fn,r as vn}from"./apollo-BxVF6eGb.js";import{u as Sn,a as bn,b as En,S as Vn,c as Nn,E as We}from"./ExpandableLabelSection-Zzl8aowS.js";import"./react-pF2EnNv3.js";import"./lodash-JMWJiBov.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-Cx1x11iP.js";const Tn=V`
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
`;function Fn({querySearchFilter:n,...t}){return I(Tn,{variables:{query:W(n),pagination:re(t)}})}const Ln=V`
    query getTotalNodeCount {
        nodeCount
    }
`;function In(){var t;return((t=I(Ln).data)==null?void 0:t.nodeCount)??0}const On=[ie,Se,Nt],Ge={field:Se,direction:"desc",aggregateBy:{aggregateFunc:"max",distinct:"false"}};function Dn({querySearchFilter:n,isFiltered:t,pagination:s,selectedCves:r,createRowActions:o,canSelectRows:a,sortOption:x,getSortParams:c,onClearFilters:i}){var D;const{page:g,perPage:m}=s,{data:y,previousData:j,loading:C,error:b}=Fn({querySearchFilter:n,page:g,perPage:m,sortOption:x}),f=In(),l=y??j,v=de({isLoading:C,data:l==null?void 0:l.nodeCVEs,error:b,searchFilter:n}),T=be(),E=a?8:6,O=(D=n.SEVERITY)==null?void 0:D.map(N=>Xe[N]).filter(Ye);return e.jsxs(G,{borders:v.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":C?"true":"false",children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(Je,{}),a&&e.jsx(Tt,{selectedCves:r}),e.jsx(h,{sort:c(ie),children:"CVE"}),e.jsxs(ze,{tooltip:"The number of nodes affected by this CVE, grouped by the severity of the CVE on each node",children:["Nodes by severity",t&&e.jsx(Ce,{})]}),e.jsx(h,{sort:c(Se,Ft),children:"Top CVSS"}),e.jsxs(ze,{tooltip:"Ratio of the number of nodes affected by this CVE to the total number of nodes",sort:c("Node ID",Lt),children:["Affected nodes",t&&e.jsx(Ce,{})]}),e.jsx(h,{children:"First discovered"}),a&&e.jsx(h,{screenReaderText:"Row actions"})]})}),e.jsx(le,{tableState:v,colSpan:E,emptyProps:{message:"No CVEs have been detected for nodes across your secured clusters"},filteredEmptyProps:{onClearFilters:i},renderer:({data:N})=>N.map((L,u)=>{const{cve:p,affectedNodeCountBySeverity:{critical:P,important:A,moderate:z,low:U,unknown:K},distroTuples:J,topCVSS:ee,affectedNodeCount:te,firstDiscoveredInSystem:$}=L,q=T.has(p),ke=It(J),Be=ke.length>0?ke[0].summary:"",Me=Ot(ee,J);return e.jsxs(Z,{isExpanded:q,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:u,isExpanded:q,onToggle:()=>T.toggle(p)}}),a&&e.jsx(Dt,{selectedCves:r,rowIndex:u,item:{cve:p}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ce,{to:ue("CVE",p),children:p})}),e.jsx(d,{dataLabel:"Nodes by severity",children:e.jsx(et,{criticalCount:P.total,importantCount:A.total,moderateCount:z.total,lowCount:U.total,unknownCount:K.total,filteredSeverities:O,entity:"node"})}),e.jsx(d,{dataLabel:"Top CVSS",children:e.jsx(Ee,{cvss:ee,scoreVersion:Me.length>0?Me.join("/"):void 0})}),e.jsxs(d,{dataLabel:"Affected nodes",children:[te," / ",f," affected nodes"]}),e.jsx(d,{dataLabel:"First discovered",children:e.jsx(tt,{date:$})}),a&&e.jsx(d,{isActionCell:!0,children:e.jsx(Pt,{items:o({cve:p})})})]}),e.jsxs(F,{isExpanded:q,children:[e.jsx(d,{}),e.jsx(d,{colSpan:E-1,children:e.jsx(Ve,{children:Be?e.jsx(Ne,{component:"p",children:Be}):e.jsx($t,{})})})]})]},p)})})]})}const Pn=V`
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
`;function $n({querySearchFilter:n,...t}){return I(Pn,{variables:{query:W(n),pagination:re(t)}})}const qn=[X,me,xe,nt],He={field:X,direction:"asc"};function An({querySearchFilter:n,isFiltered:t,pagination:s,sortOption:r,getSortParams:o,onClearFilters:a}){var f;const{page:x,perPage:c}=s,{data:i,previousData:g,loading:m,error:y}=$n({querySearchFilter:n,page:x,perPage:c,sortOption:r}),j=i??g,C=de({isLoading:m,data:j==null?void 0:j.nodes,error:y,searchFilter:n}),b=(f=n.SEVERITY)==null?void 0:f.map(l=>Xe[l]).filter(Ye);return e.jsxs(G,{borders:C.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":m?"true":"false",children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(h,{sort:o(X),children:"Node"}),e.jsxs(h,{children:["CVEs by severity",t&&e.jsx(Ce,{})]}),e.jsx(h,{sort:o(me),children:"Cluster"}),e.jsx(h,{sort:o(xe),children:"Operating system"}),e.jsx(h,{sort:o(nt),children:"Scan time"})]})}),e.jsx(le,{tableState:C,colSpan:5,emptyProps:{message:"No CVEs have been reported for your scanned nodes"},filteredEmptyProps:{onClearFilters:a},renderer:({data:l})=>e.jsx(Z,{children:l.map(v=>{const{id:T,name:E,nodeCVECountBySeverity:O,cluster:D,osImage:N,scanTime:L}=v,{critical:u,important:p,moderate:P,low:A,unknown:z}=O;return e.jsxs(F,{children:[e.jsx(d,{dataLabel:"Node",modifier:"nowrap",children:e.jsx(ce,{to:ue("Node",T),children:e.jsx(k,{position:"middle",content:E})})}),e.jsx(d,{dataLabel:"CVEs by severity",children:e.jsx(et,{criticalCount:u.total,importantCount:p.total,moderateCount:P.total,lowCount:A.total,unknownCount:z.total,filteredSeverities:b,entity:"node"})}),e.jsx(d,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(k,{position:"middle",content:D.name})}),e.jsx(d,{dataLabel:"Operating system",modifier:"nowrap",children:e.jsx(k,{position:"middle",content:N})}),e.jsx(d,{dataLabel:"Scan time",children:e.jsx(tt,{date:L})})]},T)})})})]})}const Rn=V`
    query getNodeCVEEntityCounts($query: String) {
        nodeCVECount(query: $query)
        nodeCount(query: $query)
    }
`;function wn(n){return I(Rn,{variables:{query:W(n)}})}const _n=[ot,at,rt,qe];function kn(){var te;const n=fn(),{analyticsTrack:t}=Te(),s=Ae(t),{isFeatureFlagEnabled:r}=qt(),o=r("ROX_SCANNER_V4")&&r("ROX_NODE_INDEX_ENABLED"),[a]=st("entityTab",At),{searchFilter:x,setSearchFilter:c}=Fe(),i=Le(Ie),{sortOption:g,getSortParams:m,setSortOption:y}=Oe({sortFields:a==="CVE"?On:qn,defaultSortOption:a==="CVE"?Ge:He,onSort:()=>i.setPage(1)});Rt({destination:"node-cves",searchFilter:x,setSearchFilter:c,reapplyWhen:[a],onScopeApplied:()=>i.setPage(1)});const j=De(x),C=Pe(j),b=((te=j["CVE Snoozed"])==null?void 0:te[0])==="true",f=Sn(),l=wt(),{snoozeModalOptions:v,setSnoozeModalOptions:T,snoozeActionCreator:E}=bn(),O=En("Node"),{version:D}=_t();function N($){i.setPage(1),y($==="CVE"?Ge:He),t({event:Xt,properties:{type:$,page:"Overview"}})}vn.useEffect(()=>{N(a)},[]);function L(){c({}),i.setPage(1)}const{data:u}=wn(j),p={CVE:(u==null?void 0:u.nodeCVECount)??0,Node:(u==null?void 0:u.nodeCount)??0},P=kt(),A=P==="v1"||P==="v2",z=Bt({enabled:A&&P==="v1",searchFilter:x,setSearchFilter:c,paginationSetPage:()=>i.setPage(1),storageScope:"node-cves",filterKind:"workload"}),U=Mt({enabled:A&&P==="v2",searchFilter:x,setSearchFilter:c,paginationSetPage:()=>i.setPage(1),storageScope:"node-cves",filterKind:"workload"}),K=P==="v2"?U:z,J=e.jsx($e,{searchFilter:x,searchFilterConfig:_n,defaultSearchFilterEntity:"Node",onFilterChange:($,q)=>{c($),i.setPage(1),s(Re,q)},prefixToolbarItems:K.prefixToolbarItem??void 0,appliedFilterSuffix:K.appliedFilterSuffix??void 0}),ee=e.jsx(Yt,{entityTabs:["CVE","Node"],entityCounts:p,onChange:N});return e.jsxs(e.Fragment,{children:[v&&e.jsx(Vn,{...v,onSuccess:($,q)=>{$==="SNOOZE"&&t({event:zt,properties:{type:"NODE",duration:q}}),n.cache.evict({fieldName:"nodeCVEs"}),n.cache.evict({fieldName:"nodeCVECount"}),n.cache.gc(),l.clear()},onClose:()=>T(null)}),e.jsx(he,{title:"Node CVEs Overview"}),e.jsx(S,{children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(B,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(pe,{headingLevel:"h1",children:"Node CVEs"}),e.jsx(Ue,{children:"Prioritize and manage scanned CVEs across nodes"})]}),e.jsx(Ue,{children:e.jsx(Nn,{searchFilter:x,setSearchFilter:c,snoozedCveCount:O})})]})}),o&&e.jsx(S,{children:e.jsx(Ut,{isInline:!0,variant:"info",title:"Results may include Node CVEs obtained from Scanner V4",component:"p",children:e.jsx(Kt,{children:e.jsx("a",{href:Qt(D,"operating/managing-vulnerabilities#understanding-node-cves-scanner-v4_scan-rhcos-node-host"),target:"_blank",rel:"noopener noreferrer",children:"Read more about the differences between the node scanning results obtained with the StackRox Scanner and Scanner V4."})})})}),P==="v2"&&U.wysiwygAlert&&e.jsx(S,{children:U.wysiwygAlert}),e.jsxs(S,{isCenterAligned:!0,children:[e.jsx(Wt,{filterToolbar:J,entityToggleGroup:ee,pagination:i,tableRowCount:a==="CVE"?p.CVE:p.Node,isFiltered:C,children:f&&e.jsx(Gt,{align:{default:"alignEnd"},children:e.jsx(Ht,{toggleText:"Bulk actions",isDisabled:l.size===0,children:e.jsx(Zt,{onClick:()=>T({action:b?"UNSNOOZE":"SNOOZE",cveType:"NODE_CVE",cves:Array.from(l.values())}),children:b?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),a==="CVE"&&e.jsx(Dn,{querySearchFilter:j,isFiltered:C,pagination:i,selectedCves:l,canSelectRows:f,createRowActions:E("NODE_CVE",b?"UNSNOOZE":"SNOOZE"),sortOption:g,getSortParams:m,onClearFilters:L}),a==="Node"&&e.jsx(An,{querySearchFilter:j,isFiltered:C,pagination:i,sortOption:g,getSortParams:m,onClearFilters:L})]}),K.modalsFragment]})}function Bn(n,t){const s=en(n,r=>{var o,a;switch(t.field){case"Component":return(o=r.name)==null?void 0:o.toLowerCase();case"Type":return(a=r.source)==null?void 0:a.toLowerCase();default:return""}});return t.reversed&&s.reverse(),s}const Et=V`
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
`,Mn=["Component","Type"],zn={field:"Component",direction:"asc"};function Vt({data:n}){const{sortOption:t,getSortParams:s}=Jt({sortFields:Mn,defaultSortOption:zn}),r=Bn(n,t);return n.length===0?null:e.jsxs(G,{children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(h,{sort:s("Component"),children:"Component"}),e.jsx(h,{children:"Version"}),e.jsx(h,{children:"CVE fixed in"}),e.jsx(h,{sort:s("Type"),children:"Type"})]})}),e.jsx(Z,{children:r.map(({name:o,source:a,version:x,nodeVulnerabilities:c})=>{var g;const i=(g=c==null?void 0:c[0])==null?void 0:g.fixedByVersion;return e.jsxs(F,{children:[e.jsx(d,{dataLabel:"Component",children:o}),e.jsx(d,{dataLabel:"Version",children:x}),e.jsx(d,{dataLabel:"CVE fixed in",children:i||e.jsx(we,{isFixable:!1})}),e.jsx(d,{dataLabel:"Type",children:a})]},o)})})]})}const Un=[X,M,je,ge,me,xe],Kn={field:M,direction:"desc"},Qn=V`
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
`;function Wn({tableState:n,getSortParams:t,onClearFilters:s}){const o=be();return e.jsxs(G,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(h,{screenReaderText:"Row expansion"}),e.jsx(h,{sort:t(X),children:"Node"}),e.jsx(h,{sort:t(M),children:"CVE severity"}),e.jsx(h,{sort:t(je),children:"CVE status"}),e.jsx(h,{sort:t(ge),children:"CVSS"}),e.jsx(h,{sort:t(me),children:"Cluster"}),e.jsx(h,{sort:t(xe),children:"Operating system"}),e.jsx(h,{children:"Affected components"})]})}),e.jsx(le,{tableState:n,colSpan:8,emptyProps:{message:"There are no nodes that are affected by this CVE"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((x,c)=>{const{id:i,name:g,nodeComponents:m}=x,y=o.has(i),j=m.flatMap(v=>v.nodeVulnerabilities),C=it(j),b=dt(j),{cvss:f,scoreVersion:l}=tn(j);return e.jsxs(Z,{isExpanded:y,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:c,isExpanded:y,onToggle:()=>o.toggle(i)}}),e.jsx(d,{dataLabel:"Node",children:e.jsx(ce,{to:ue("Node",i),children:e.jsx(k,{position:"middle",content:g})})}),e.jsx(d,{dataLabel:"CVE severity",modifier:"nowrap",children:e.jsx(lt,{severity:C})}),e.jsx(d,{dataLabel:"CVE status",modifier:"nowrap",children:e.jsx(we,{isFixable:b})}),e.jsx(d,{dataLabel:"CVSS",modifier:"nowrap",children:e.jsx(Ee,{cvss:f,scoreVersion:l})}),e.jsx(d,{dataLabel:"Cluster",children:e.jsx(k,{position:"middle",content:x.cluster.name})}),e.jsx(d,{dataLabel:"Operating system",children:e.jsx(k,{position:"middle",content:x.osImage})}),e.jsx(d,{dataLabel:"Affected components",children:m.length===1?m[0].name:Y(m.length,"component")})]}),e.jsxs(F,{isExpanded:y,children:[e.jsx(d,{}),e.jsx(d,{colSpan:7,children:e.jsx(Ve,{children:e.jsx(Vt,{data:m})})})]})]},i)})})]})}function Gn({affectedNodeCount:n,totalNodeCount:t,operatingSystemCount:s}){return e.jsxs(nn,{isCompact:!0,isFullHeight:!0,children:[e.jsx(sn,{children:"Affected nodes"}),e.jsx(on,{children:e.jsxs(an,{children:[e.jsxs(Ke,{span:12,className:"pf-v6-u-pt-sm",children:[n," / ",t," affected nodes"]}),e.jsxs(Ke,{span:12,className:"pf-v6-u-pt-sm",children:[Y(s,"operating system")," affected"]})]})})]})}const Hn=V`
    ${Qn}
    query getAffectedNodes($query: String, $pagination: Pagination) {
        nodes(query: $query, pagination: $pagination) {
            ...AffectedNode
        }
    }
`;function Zn({query:n,...t}){var r,o;const s=I(Hn,{variables:{query:n,pagination:re(t)}});return{affectedNodesRequest:s,nodeData:((r=s.data)==null?void 0:r.nodes)??((o=s.previousData)==null?void 0:o.nodes)}}const Xn=V`
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
`;function Yn(n){const t=I(Xn,{variables:{cve:n}}),{data:s,previousData:r}=t,o=(s==null?void 0:s.nodeCVE)??(r==null?void 0:r.nodeCVE);return{metadataRequest:t,cveData:o}}const Jn=V`
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
`;function es(n,t){const s=I(Jn,{variables:{cve:n,query:t}}),{data:r,previousData:o}=s,a=(r==null?void 0:r.nodeCount)??(o==null?void 0:o.nodeCount)??0;return{summaryDataRequest:s,nodeCount:a}}const ts=ht("Node",{entityTab:"CVE"}),ns=[ot,rt,qe],Ze={affectedNodeCountBySeverity:{critical:{total:0},important:{total:0},moderate:{total:0},low:{total:0},unknown:{total:0}},distroTuples:[]};function ss(){const{analyticsTrack:n}=Te(),t=Ae(n),{searchFilter:s,setSearchFilter:r}=Fe(),o=De(s),{cveId:a}=ct(),x=`^${a}$`,c=W({...o,CVE:[x]}),{page:i,perPage:g,setPage:m,setPerPage:y}=Le(Ie),{sortOption:j,getSortParams:C}=Oe({sortFields:Un,defaultSortOption:Kn,onSort:()=>m(1)}),b=Pe(o),f=ut(o),{metadataRequest:l,cveData:v}=Yn(a),{summaryDataRequest:T,nodeCount:E}=es(a,c),{affectedNodesRequest:O,nodeData:D}=Zn({query:c,page:i,perPage:g,sortOption:j}),N=v==null?void 0:v.cve,L=de({isLoading:O.loading,error:O.error,data:D,searchFilter:o});return e.jsxs(e.Fragment,{children:[e.jsx(he,{title:`Node CVEs - NodeCVE ${N}`}),e.jsx(S,{type:"breadcrumb",children:e.jsxs(mt,{children:[e.jsx(xt,{to:ts,children:"Node CVEs"}),e.jsx(pt,{isActive:!0,children:N??e.jsx(_e,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(S,{children:e.jsx(rn,{data:v})}),e.jsx(Q,{component:"div"}),e.jsxs(S,{hasBodyWrapper:!1,children:[e.jsx($e,{searchFilter:s,searchFilterConfig:ns,defaultSearchFilterEntity:"Node",onFilterChange:(u,p)=>{r(u),m(1,"replace"),t(Re,p)}}),e.jsxs(jt,{error:l.error,isLoading:l.loading,children:[e.jsx(oe,{data:T.data,loadingText:"Loading affected nodes summary",renderer:({data:u})=>e.jsx(Gn,{affectedNodeCount:E,totalNodeCount:u.totalNodeCount,operatingSystemCount:(u.nodeCVE??Ze).distroTuples.length})}),e.jsx(oe,{data:T.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:u})=>e.jsx(gt,{title:"Nodes by severity",severityCounts:(u.nodeCVE??Ze).affectedNodeCountBySeverity,hiddenSeverities:f})})]}),e.jsx(Q,{component:"div"}),e.jsxs(yt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ae,{isFilled:!0,children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(pe,{headingLevel:"h2",children:[Y(E,"node")," affected"]}),b&&e.jsx(Ct,{})]})}),e.jsx(ae,{children:e.jsx(ft,{itemCount:E,perPage:g,page:i,onSetPage:(u,p)=>m(p),onPerPageSelect:(u,p)=>{y(p)}})})]}),e.jsx(Wn,{tableState:L,getSortParams:C,onClearFilters:()=>{r({}),m(1)}})]})]})}const os=V`
    fragment NodeMetadata on Node {
        id
        name
        osImage
        kubeletVersion
        kernelVersion
        scanTime
    }
`;function as({data:n}){if(!n)return e.jsx(dn,{nameScreenreaderText:"Loading Node name",metadataScreenreaderText:"Loading Node metadata"});const t=n.scanTime?4:3;return e.jsxs(B,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(pe,{headingLevel:"h1",children:n.name}),e.jsxs(ln,{numLabels:t,children:[e.jsxs(ne,{children:["OS: ",n.osImage]}),e.jsxs(ne,{children:["Kubelet: ",n.kubeletVersion]}),e.jsxs(ne,{children:["Kernel version: ",n.kernelVersion]}),n.scanTime&&e.jsxs(ne,{children:["Scan time: ",fe(n.scanTime)]})]})]})}const rs=[ie,M,je,ge],is={field:M,direction:"desc"},ds=V`
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
`;function ls({tableState:n,getSortParams:t,onClearFilters:s}){const o=be();return e.jsxs(G,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(Je,{}),e.jsx(h,{sort:t(ie),children:"CVE"}),e.jsx(h,{sort:t(M),children:"Top severity"}),e.jsx(h,{sort:t(je),children:"CVE status"}),e.jsx(h,{sort:t(ge),children:"CVSS"}),e.jsx(h,{children:"Affected components"})]})}),e.jsx(le,{tableState:n,colSpan:6,emptyProps:{message:"No CVEs were detected for this node"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((x,c)=>{const{cve:i,cvss:g,scoreVersion:m,nodeComponents:y}=x,j=y.flatMap(l=>l.nodeVulnerabilities),C=it(j),b=dt(j),f=o.has(i);return e.jsxs(Z,{isExpanded:f,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:c,isExpanded:f,onToggle:()=>o.toggle(i)}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ce,{to:ue("CVE",i),children:i})}),e.jsx(d,{dataLabel:"Top severity",children:e.jsx(lt,{severity:C})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(we,{isFixable:b})}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(Ee,{cvss:g,scoreVersion:m})}),e.jsx(d,{dataLabel:"Affected components",children:y.length===1?y[0].name:Y(y.length,"component")})]}),e.jsxs(F,{isExpanded:f,children:[e.jsx(d,{}),e.jsx(d,{colSpan:5,children:e.jsx(Ve,{children:e.jsx(Vt,{data:y})})})]})]},i)})})]})}const cs=V`
    ${ds}
    query getNodeVulnerabilities($id: ID!, $query: String!, $pagination: Pagination) {
        node(id: $id) {
            id
            nodeVulnerabilityCount(query: $query)
            nodeVulnerabilities(query: $query, pagination: $pagination) {
                ...NodeVulnerabilityFragment
            }
        }
    }
`;function us({nodeId:n,query:t,...s}){return I(cs,{variables:{id:n,query:t,pagination:re(s)}})}const ms=V`
    ${cn}
    query getNodeVulnSummary($id: ID!, $query: String!) {
        node(id: $id) {
            id
            nodeCVECountBySeverity(query: $query) {
                ...ResourceCountsByCVESeverityAndStatus
            }
        }
    }
`;function xs(n,t){return I(ms,{variables:{id:n,query:t}})}const hs=[at,qe];function ps({nodeId:n}){var N,L;const{analyticsTrack:t}=Te(),s=Ae(t),{searchFilter:r,setSearchFilter:o}=Fe(),a=De(r),x=W(a),c=Pe(a),{page:i,perPage:g,setPage:m,setPerPage:y}=Le(Ie),{sortOption:j,getSortParams:C}=Oe({sortFields:rs,defaultSortOption:is,onSort:()=>m(1,"replace")}),b=ut(a),f=un(a),{data:l,loading:v,error:T}=us({nodeId:n,query:x,page:i,perPage:g,sortOption:j}),E=xs(n,x),O=((N=l==null?void 0:l.node)==null?void 0:N.nodeVulnerabilityCount)??0,D=de({isLoading:v,error:T,data:(L=l==null?void 0:l.node)==null?void 0:L.nodeVulnerabilities,searchFilter:a});return e.jsxs(e.Fragment,{children:[e.jsx(S,{children:e.jsx(Ne,{component:"p",children:"Review and triage vulnerability data scanned on this node"})}),e.jsx(Q,{component:"div"}),e.jsxs(S,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx($e,{searchFilter:r,searchFilterConfig:hs,defaultSearchFilterEntity:"CVE",onFilterChange:(u,p)=>{o(u),m(1,"replace"),s(Re,p)}}),e.jsxs(jt,{isLoading:E.loading,error:E.error,children:[e.jsx(oe,{loadingText:"Loading node CVEs by severity summary",data:E.data,renderer:({data:u})=>e.jsx(gt,{title:"CVEs by severity",severityCounts:u.node.nodeCVECountBySeverity,hiddenSeverities:b})}),e.jsx(oe,{loadingText:"Loading node CVEs by status summary",data:E.data,renderer:({data:u})=>e.jsx(mn,{cveStatusCounts:u.node.nodeCVECountBySeverity,hiddenStatuses:f})})]}),e.jsx(Q,{component:"div"}),e.jsxs(yt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ae,{isFilled:!0,children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(pe,{headingLevel:"h2",children:l&&l.node?`${Y(l.node.nodeVulnerabilityCount,"result")} found`:e.jsx(_e,{screenreaderText:"Loading node vulnerability count"})}),c&&e.jsx(Ct,{})]})}),e.jsx(ae,{children:e.jsx(ft,{itemCount:O,perPage:g,page:i,onSetPage:(u,p)=>m(p),onPerPageSelect:(u,p)=>{y(p)}})})]}),e.jsx(ls,{tableState:D,getSortParams:C,onClearFilters:()=>{o({}),m(1)}})]})]})}const js=V`
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
`;function gs(n){return I(js,{variables:{id:n}})}function ys({nodeId:n}){const{data:t,loading:s,error:r}=gs(n);return e.jsxs(e.Fragment,{children:[e.jsx(S,{component:"div",children:e.jsx(Ne,{component:"p",children:"View details about this node"})}),e.jsx(Q,{component:"div"}),e.jsx(S,{isFilled:!0,children:r?e.jsx(ve,{children:e.jsx(vt,{title:"There was an error loading the node details",headingLevel:"h2",icon:bt,status:"danger",children:St(r)})}):s?e.jsx(ve,{children:e.jsx(xn,{size:"xl"})}):t&&e.jsxs(B,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(hn,{columnModifier:{default:"1Col",lg:"2Col"},children:[e.jsxs(R,{children:[e.jsx(w,{children:"Cluster"}),e.jsx(_,{children:t.node.cluster.name})]}),t.node.containerRuntimeVersion&&e.jsxs(R,{children:[e.jsx(w,{children:"Container runtime"}),e.jsx(_,{children:t.node.containerRuntimeVersion})]}),t.node.joinedAt&&e.jsxs(R,{children:[e.jsx(w,{children:"Join time"}),e.jsx(_,{children:fe(t.node.joinedAt)})]}),t.node.scanTime&&e.jsxs(R,{children:[e.jsx(w,{children:"Scan time"}),e.jsx(_,{children:fe(t.node.scanTime)})]}),t.node.kernelVersion&&e.jsxs(R,{children:[e.jsx(w,{children:"Kernel version"}),e.jsx(_,{children:t.node.kernelVersion})]}),t.node.kubeletVersion&&e.jsxs(R,{children:[e.jsx(w,{children:"Kubelet"}),e.jsx(_,{children:t.node.kubeletVersion})]})]}),e.jsx(We,{toggleText:"Labels",labels:t.node.labels}),e.jsx(We,{toggleText:"Annotations",labels:t.node.annotations})]})})]})}const Cs="NodePageDetails",fs="NodePageVulnerabilities",vs=ht("Node",{entityTab:"Node"}),Ss=V`
    ${os}
    query getNodeMetadata($id: ID!) {
        node(id: $id) {
            ...NodeMetadata
        }
    }
`;function bs(){var i;const{nodeId:n}=ct(),{data:t,error:s}=I(Ss,{variables:{id:n}}),[r,o]=st("detailsTab",ye),a=ye[0],x=ye[1],c=((i=t==null?void 0:t.node)==null?void 0:i.name)??"-";return e.jsxs(e.Fragment,{children:[e.jsx(he,{title:`Node CVEs - Node ${c}`}),e.jsx(S,{type:"breadcrumb",children:e.jsxs(mt,{children:[e.jsx(xt,{to:vs,children:"Nodes"}),e.jsx(pt,{isActive:!0,children:c??e.jsx(_e,{screenreaderText:"Loading Node name",width:"200px"})})]})}),s?e.jsx(S,{children:e.jsx(ve,{children:e.jsx(vt,{title:St(s),headingLevel:"h2",icon:bt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(S,{children:e.jsx(as,{data:t==null?void 0:t.node})}),e.jsx(S,{type:"tabs",children:e.jsxs(pn,{activeKey:r,onSelect:(g,m)=>{o(m)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Qe,{eventKey:a,tabContentId:fs,title:a,children:e.jsx(ps,{nodeId:n})}),e.jsx(Qe,{eventKey:x,tabContentId:Cs,title:x,children:e.jsx(ys,{nodeId:n})})]})})]})]})}function Os(){const{hasReadAccess:n}=jn(),t=n("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(gn,{}),e.jsxs(yn,{children:[e.jsx(se,{index:!0,element:e.jsx(kn,{})}),e.jsx(se,{path:"cves/:cveId",element:e.jsx(ss,{})}),e.jsx(se,{path:"nodes/:nodeId",element:e.jsx(bs,{})}),e.jsx(se,{path:"*",element:e.jsxs(S,{hasBodyWrapper:!1,children:[e.jsx(he,{title:"Node CVEs - Not Found"}),e.jsx(Cn,{})]})})]})]})}export{Os as default};
