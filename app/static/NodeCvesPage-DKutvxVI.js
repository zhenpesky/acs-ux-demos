import{ck as re,mc as G,md as ie,me as Se,mf as Nt,dD as de,eN as be,mg as Xe,mh as Ye,w as e,aG as H,aH as W,a5 as F,mi as Je,mj as Tt,aI as p,mk as ze,ml as Ce,lZ as Ft,l_ as Lt,dq as le,m0 as It,m1 as Ot,aJ as Z,ax as d,mm as Dt,b9 as ce,mn as ue,m2 as et,m3 as Ee,m4 as tt,bc as Pt,cx as Ve,an as Ne,mo as $t,mp as X,mq as me,mr as xe,ms as nt,dV as k,bO as Te,ez as qt,d7 as st,mt as At,cB as Fe,cA as Le,lS as Ie,cC as Oe,jX as wt,mu as De,dE as Pe,mv as Rt,bP as _t,kH as kt,kI as Bt,kJ as Mt,lU as $e,mw as ot,mx as at,my as rt,mz as qe,lL as Ae,mA as we,mB as zt,ap as pe,ac as S,aC as B,ad as he,aD as Ue,aj as Ut,bU as Kt,bV as Qt,mC as Gt,aX as Ht,bT as Wt,K as Zt,mD as Xt,mE as Yt,jJ as Jt,mF as Re,fl as en,mG as M,mH as je,mI as ge,mJ as it,mK as dt,mL as tn,mM as lt,ba as Y,aR as nn,aT as sn,aU as on,bL as an,bp as Ke,bj as ct,mN as ut,bf as mt,bg as xt,mO as pt,bh as ht,ec as _e,mP as rn,bi as Q,mQ as jt,mR as oe,mS as gt,e4 as yt,g1 as ae,mT as Ct,cz as ft,mU as dn,eb as ln,a_ as ne,dj as fe,mV as cn,mW as un,mX as mn,bl as ve,bY as vt,cr as St,dS as bt,bm as xn,cn as pn,co as w,cp as R,cq as _,mY as ye,ae as hn,af as Qe,b5 as jn,mZ as gn,ch as yn,ci as se,f8 as Cn}from"./index-CfvaWI3B.js";import{u as I,g as V,f as fn,r as vn}from"./apollo-BxVF6eGb.js";import{u as Sn,a as bn,b as En,S as Vn,c as Nn,E as Ge}from"./ExpandableLabelSection-DtuGtmxJ.js";import"./react-pF2EnNv3.js";import"./lodash-JMWJiBov.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-CSo1YE_j.js";const Tn=V`
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
`;function Fn({querySearchFilter:n,...t}){return I(Tn,{variables:{query:G(n),pagination:re(t)}})}const Ln=V`
    query getTotalNodeCount {
        nodeCount
    }
`;function In(){var t;return((t=I(Ln).data)==null?void 0:t.nodeCount)??0}const On=[ie,Se,Nt],He={field:Se,direction:"desc",aggregateBy:{aggregateFunc:"max",distinct:"false"}};function Dn({querySearchFilter:n,isFiltered:t,pagination:s,selectedCves:r,createRowActions:o,canSelectRows:a,sortOption:x,getSortParams:c,onClearFilters:i}){var D;const{page:g,perPage:m}=s,{data:y,previousData:j,loading:C,error:b}=Fn({querySearchFilter:n,page:g,perPage:m,sortOption:x}),f=In(),l=y??j,v=de({isLoading:C,data:l==null?void 0:l.nodeCVEs,error:b,searchFilter:n}),T=be(),E=a?8:6,O=(D=n.SEVERITY)==null?void 0:D.map(N=>Xe[N]).filter(Ye);return e.jsxs(H,{borders:v.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":C?"true":"false",children:[e.jsx(W,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(Je,{}),a&&e.jsx(Tt,{selectedCves:r}),e.jsx(p,{sort:c(ie),children:"CVE"}),e.jsxs(ze,{tooltip:"The number of nodes affected by this CVE, grouped by the severity of the CVE on each node",children:["Nodes by severity",t&&e.jsx(Ce,{})]}),e.jsx(p,{sort:c(Se,Ft),children:"Top CVSS"}),e.jsxs(ze,{tooltip:"Ratio of the number of nodes affected by this CVE to the total number of nodes",sort:c("Node ID",Lt),children:["Affected nodes",t&&e.jsx(Ce,{})]}),e.jsx(p,{children:"First discovered"}),a&&e.jsx(p,{screenReaderText:"Row actions"})]})}),e.jsx(le,{tableState:v,colSpan:E,emptyProps:{message:"No CVEs have been detected for nodes across your secured clusters"},filteredEmptyProps:{onClearFilters:i},renderer:({data:N})=>N.map((L,u)=>{const{cve:h,affectedNodeCountBySeverity:{critical:P,important:A,moderate:z,low:U,unknown:K},distroTuples:J,topCVSS:ee,affectedNodeCount:te,firstDiscoveredInSystem:$}=L,q=T.has(h),ke=It(J),Be=ke.length>0?ke[0].summary:"",Me=Ot(ee,J);return e.jsxs(Z,{isExpanded:q,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:u,isExpanded:q,onToggle:()=>T.toggle(h)}}),a&&e.jsx(Dt,{selectedCves:r,rowIndex:u,item:{cve:h}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ce,{to:ue("CVE",h),children:h})}),e.jsx(d,{dataLabel:"Nodes by severity",children:e.jsx(et,{criticalCount:P.total,importantCount:A.total,moderateCount:z.total,lowCount:U.total,unknownCount:K.total,filteredSeverities:O,entity:"node"})}),e.jsx(d,{dataLabel:"Top CVSS",children:e.jsx(Ee,{cvss:ee,scoreVersion:Me.length>0?Me.join("/"):void 0})}),e.jsxs(d,{dataLabel:"Affected nodes",children:[te," / ",f," affected nodes"]}),e.jsx(d,{dataLabel:"First discovered",children:e.jsx(tt,{date:$})}),a&&e.jsx(d,{isActionCell:!0,children:e.jsx(Pt,{items:o({cve:h})})})]}),e.jsxs(F,{isExpanded:q,children:[e.jsx(d,{}),e.jsx(d,{colSpan:E-1,children:e.jsx(Ve,{children:Be?e.jsx(Ne,{component:"p",children:Be}):e.jsx($t,{})})})]})]},h)})})]})}const Pn=V`
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
`;function $n({querySearchFilter:n,...t}){return I(Pn,{variables:{query:G(n),pagination:re(t)}})}const qn=[X,me,xe,nt],We={field:X,direction:"asc"};function An({querySearchFilter:n,isFiltered:t,pagination:s,sortOption:r,getSortParams:o,onClearFilters:a}){var f;const{page:x,perPage:c}=s,{data:i,previousData:g,loading:m,error:y}=$n({querySearchFilter:n,page:x,perPage:c,sortOption:r}),j=i??g,C=de({isLoading:m,data:j==null?void 0:j.nodes,error:y,searchFilter:n}),b=(f=n.SEVERITY)==null?void 0:f.map(l=>Xe[l]).filter(Ye);return e.jsxs(H,{borders:C.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":m?"true":"false",children:[e.jsx(W,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(p,{sort:o(X),children:"Node"}),e.jsxs(p,{children:["CVEs by severity",t&&e.jsx(Ce,{})]}),e.jsx(p,{sort:o(me),children:"Cluster"}),e.jsx(p,{sort:o(xe),children:"Operating system"}),e.jsx(p,{sort:o(nt),children:"Scan time"})]})}),e.jsx(le,{tableState:C,colSpan:5,emptyProps:{message:"No CVEs have been reported for your scanned nodes"},filteredEmptyProps:{onClearFilters:a},renderer:({data:l})=>e.jsx(Z,{children:l.map(v=>{const{id:T,name:E,nodeCVECountBySeverity:O,cluster:D,osImage:N,scanTime:L}=v,{critical:u,important:h,moderate:P,low:A,unknown:z}=O;return e.jsxs(F,{children:[e.jsx(d,{dataLabel:"Node",modifier:"nowrap",children:e.jsx(ce,{to:ue("Node",T),children:e.jsx(k,{position:"middle",content:E})})}),e.jsx(d,{dataLabel:"CVEs by severity",children:e.jsx(et,{criticalCount:u.total,importantCount:h.total,moderateCount:P.total,lowCount:A.total,unknownCount:z.total,filteredSeverities:b,entity:"node"})}),e.jsx(d,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(k,{position:"middle",content:D.name})}),e.jsx(d,{dataLabel:"Operating system",modifier:"nowrap",children:e.jsx(k,{position:"middle",content:N})}),e.jsx(d,{dataLabel:"Scan time",children:e.jsx(tt,{date:L})})]},T)})})})]})}const wn=V`
    query getNodeCVEEntityCounts($query: String) {
        nodeCVECount(query: $query)
        nodeCount(query: $query)
    }
`;function Rn(n){return I(wn,{variables:{query:G(n)}})}const _n=[ot,at,rt,qe];function kn(){var te;const n=fn(),{analyticsTrack:t}=Te(),s=Ae(t),{isFeatureFlagEnabled:r}=qt(),o=r("ROX_SCANNER_V4")&&r("ROX_NODE_INDEX_ENABLED"),[a]=st("entityTab",At),{searchFilter:x,setSearchFilter:c}=Fe(),i=Le(Ie),{sortOption:g,getSortParams:m,setSortOption:y}=Oe({sortFields:a==="CVE"?On:qn,defaultSortOption:a==="CVE"?He:We,onSort:()=>i.setPage(1)});wt({destination:"node-cves",searchFilter:x,setSearchFilter:c,reapplyWhen:[a],onScopeApplied:()=>i.setPage(1)});const j=De(x),C=Pe(j),b=((te=j["CVE Snoozed"])==null?void 0:te[0])==="true",f=Sn(),l=Rt(),{snoozeModalOptions:v,setSnoozeModalOptions:T,snoozeActionCreator:E}=bn(),O=En("Node"),{version:D}=_t();function N($){i.setPage(1),y($==="CVE"?He:We),t({event:Xt,properties:{type:$,page:"Overview"}})}vn.useEffect(()=>{N(a)},[]);function L(){c({}),i.setPage(1)}const{data:u}=Rn(j),h={CVE:(u==null?void 0:u.nodeCVECount)??0,Node:(u==null?void 0:u.nodeCount)??0},P=kt(),A=P==="v1"||P==="v2",z=Bt({enabled:A&&P==="v1",searchFilter:x,setSearchFilter:c,paginationSetPage:()=>i.setPage(1),storageScope:"node-cves",filterKind:"workload"}),U=Mt({enabled:A&&P==="v2",searchFilter:x,setSearchFilter:c,paginationSetPage:()=>i.setPage(1),storageScope:"node-cves",filterKind:"workload"}),K=P==="v2"?U:z,J=e.jsx($e,{searchFilter:x,searchFilterConfig:_n,defaultSearchFilterEntity:"Node",onFilterChange:($,q)=>{c($),i.setPage(1),s(we,q)},prefixToolbarItems:K.prefixToolbarItem??void 0,appliedFilterSuffix:K.appliedFilterSuffix??void 0}),ee=e.jsx(Yt,{entityTabs:["CVE","Node"],entityCounts:h,onChange:N});return e.jsxs(e.Fragment,{children:[v&&e.jsx(Vn,{...v,onSuccess:($,q)=>{$==="SNOOZE"&&t({event:zt,properties:{type:"NODE",duration:q}}),n.cache.evict({fieldName:"nodeCVEs"}),n.cache.evict({fieldName:"nodeCVECount"}),n.cache.gc(),l.clear()},onClose:()=>T(null)}),e.jsx(pe,{title:"Node CVEs Overview"}),e.jsx(S,{children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(B,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(he,{headingLevel:"h1",children:"Node CVEs"}),e.jsx(Ue,{children:"Prioritize and manage scanned CVEs across nodes"})]}),e.jsx(Ue,{children:e.jsx(Nn,{searchFilter:x,setSearchFilter:c,snoozedCveCount:O})})]})}),o&&e.jsx(S,{children:e.jsx(Ut,{isInline:!0,variant:"info",title:"Results may include Node CVEs obtained from Scanner V4",component:"p",children:e.jsx(Kt,{children:e.jsx("a",{href:Qt(D,"operating/managing-vulnerabilities#understanding-node-cves-scanner-v4_scan-rhcos-node-host"),target:"_blank",rel:"noopener noreferrer",children:"Read more about the differences between the node scanning results obtained with the StackRox Scanner and Scanner V4."})})})}),P==="v2"&&U.wysiwygAlert&&e.jsx(S,{children:U.wysiwygAlert}),e.jsxs(S,{isCenterAligned:!0,children:[e.jsx(Gt,{filterToolbar:J,entityToggleGroup:ee,pagination:i,tableRowCount:a==="CVE"?h.CVE:h.Node,isFiltered:C,children:f&&e.jsx(Ht,{align:{default:"alignEnd"},children:e.jsx(Wt,{toggleText:"Bulk actions",isDisabled:l.size===0,children:e.jsx(Zt,{onClick:()=>T({action:b?"UNSNOOZE":"SNOOZE",cveType:"NODE_CVE",cves:Array.from(l.values())}),children:b?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),a==="CVE"&&e.jsx(Dn,{querySearchFilter:j,isFiltered:C,pagination:i,selectedCves:l,canSelectRows:f,createRowActions:E("NODE_CVE",b?"UNSNOOZE":"SNOOZE"),sortOption:g,getSortParams:m,onClearFilters:L}),a==="Node"&&e.jsx(An,{querySearchFilter:j,isFiltered:C,pagination:i,sortOption:g,getSortParams:m,onClearFilters:L})]}),K.modalsFragment]})}function Bn(n,t){const s=en(n,r=>{var o,a;switch(t.field){case"Component":return(o=r.name)==null?void 0:o.toLowerCase();case"Type":return(a=r.source)==null?void 0:a.toLowerCase();default:return""}});return t.reversed&&s.reverse(),s}const Et=V`
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
`,Mn=["Component","Type"],zn={field:"Component",direction:"asc"};function Vt({data:n}){const{sortOption:t,getSortParams:s}=Jt({sortFields:Mn,defaultSortOption:zn}),r=Bn(n,t);return n.length===0?null:e.jsxs(H,{children:[e.jsx(W,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(p,{sort:s("Component"),children:"Component"}),e.jsx(p,{children:"Version"}),e.jsx(p,{children:"CVE fixed in"}),e.jsx(p,{sort:s("Type"),children:"Type"})]})}),e.jsx(Z,{children:r.map(({name:o,source:a,version:x,nodeVulnerabilities:c})=>{var g;const i=(g=c==null?void 0:c[0])==null?void 0:g.fixedByVersion;return e.jsxs(F,{children:[e.jsx(d,{dataLabel:"Component",children:o}),e.jsx(d,{dataLabel:"Version",children:x}),e.jsx(d,{dataLabel:"CVE fixed in",children:i||e.jsx(Re,{isFixable:!1})}),e.jsx(d,{dataLabel:"Type",children:a})]},o)})})]})}const Un=[X,M,je,ge,me,xe],Kn={field:M,direction:"desc"},Qn=V`
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
`;function Gn({tableState:n,getSortParams:t,onClearFilters:s}){const o=be();return e.jsxs(H,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(W,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(p,{screenReaderText:"Row expansion"}),e.jsx(p,{sort:t(X),children:"Node"}),e.jsx(p,{sort:t(M),children:"CVE severity"}),e.jsx(p,{sort:t(je),children:"CVE status"}),e.jsx(p,{sort:t(ge),children:"CVSS"}),e.jsx(p,{sort:t(me),children:"Cluster"}),e.jsx(p,{sort:t(xe),children:"Operating system"}),e.jsx(p,{children:"Affected components"})]})}),e.jsx(le,{tableState:n,colSpan:8,emptyProps:{message:"There are no nodes that are affected by this CVE"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((x,c)=>{const{id:i,name:g,nodeComponents:m}=x,y=o.has(i),j=m.flatMap(v=>v.nodeVulnerabilities),C=it(j),b=dt(j),{cvss:f,scoreVersion:l}=tn(j);return e.jsxs(Z,{isExpanded:y,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:c,isExpanded:y,onToggle:()=>o.toggle(i)}}),e.jsx(d,{dataLabel:"Node",children:e.jsx(ce,{to:ue("Node",i),children:e.jsx(k,{position:"middle",content:g})})}),e.jsx(d,{dataLabel:"CVE severity",modifier:"nowrap",children:e.jsx(lt,{severity:C})}),e.jsx(d,{dataLabel:"CVE status",modifier:"nowrap",children:e.jsx(Re,{isFixable:b})}),e.jsx(d,{dataLabel:"CVSS",modifier:"nowrap",children:e.jsx(Ee,{cvss:f,scoreVersion:l})}),e.jsx(d,{dataLabel:"Cluster",children:e.jsx(k,{position:"middle",content:x.cluster.name})}),e.jsx(d,{dataLabel:"Operating system",children:e.jsx(k,{position:"middle",content:x.osImage})}),e.jsx(d,{dataLabel:"Affected components",children:m.length===1?m[0].name:Y(m.length,"component")})]}),e.jsxs(F,{isExpanded:y,children:[e.jsx(d,{}),e.jsx(d,{colSpan:7,children:e.jsx(Ve,{children:e.jsx(Vt,{data:m})})})]})]},i)})})]})}function Hn({affectedNodeCount:n,totalNodeCount:t,operatingSystemCount:s}){return e.jsxs(nn,{isCompact:!0,isFullHeight:!0,children:[e.jsx(sn,{children:"Affected nodes"}),e.jsx(on,{children:e.jsxs(an,{children:[e.jsxs(Ke,{span:12,className:"pf-v6-u-pt-sm",children:[n," / ",t," affected nodes"]}),e.jsxs(Ke,{span:12,className:"pf-v6-u-pt-sm",children:[Y(s,"operating system")," affected"]})]})})]})}const Wn=V`
    ${Qn}
    query getAffectedNodes($query: String, $pagination: Pagination) {
        nodes(query: $query, pagination: $pagination) {
            ...AffectedNode
        }
    }
`;function Zn({query:n,...t}){var r,o;const s=I(Wn,{variables:{query:n,pagination:re(t)}});return{affectedNodesRequest:s,nodeData:((r=s.data)==null?void 0:r.nodes)??((o=s.previousData)==null?void 0:o.nodes)}}const Xn=V`
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
`;function es(n,t){const s=I(Jn,{variables:{cve:n,query:t}}),{data:r,previousData:o}=s,a=(r==null?void 0:r.nodeCount)??(o==null?void 0:o.nodeCount)??0;return{summaryDataRequest:s,nodeCount:a}}const ts=pt("Node",{entityTab:"CVE"}),ns=[ot,rt,qe],Ze={affectedNodeCountBySeverity:{critical:{total:0},important:{total:0},moderate:{total:0},low:{total:0},unknown:{total:0}},distroTuples:[]};function ss(){const{analyticsTrack:n}=Te(),t=Ae(n),{searchFilter:s,setSearchFilter:r}=Fe(),o=De(s),{cveId:a}=ct(),x=`^${a}$`,c=G({...o,CVE:[x]}),{page:i,perPage:g,setPage:m,setPerPage:y}=Le(Ie),{sortOption:j,getSortParams:C}=Oe({sortFields:Un,defaultSortOption:Kn,onSort:()=>m(1)}),b=Pe(o),f=ut(o),{metadataRequest:l,cveData:v}=Yn(a),{summaryDataRequest:T,nodeCount:E}=es(a,c),{affectedNodesRequest:O,nodeData:D}=Zn({query:c,page:i,perPage:g,sortOption:j}),N=v==null?void 0:v.cve,L=de({isLoading:O.loading,error:O.error,data:D,searchFilter:o});return e.jsxs(e.Fragment,{children:[e.jsx(pe,{title:`Node CVEs - NodeCVE ${N}`}),e.jsx(S,{type:"breadcrumb",children:e.jsxs(mt,{children:[e.jsx(xt,{to:ts,children:"Node CVEs"}),e.jsx(ht,{isActive:!0,children:N??e.jsx(_e,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(S,{children:e.jsx(rn,{data:v})}),e.jsx(Q,{component:"div"}),e.jsxs(S,{hasBodyWrapper:!1,children:[e.jsx($e,{searchFilter:s,searchFilterConfig:ns,defaultSearchFilterEntity:"Node",onFilterChange:(u,h)=>{r(u),m(1,"replace"),t(we,h)}}),e.jsxs(jt,{error:l.error,isLoading:l.loading,children:[e.jsx(oe,{data:T.data,loadingText:"Loading affected nodes summary",renderer:({data:u})=>e.jsx(Hn,{affectedNodeCount:E,totalNodeCount:u.totalNodeCount,operatingSystemCount:(u.nodeCVE??Ze).distroTuples.length})}),e.jsx(oe,{data:T.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:u})=>e.jsx(gt,{title:"Nodes by severity",severityCounts:(u.nodeCVE??Ze).affectedNodeCountBySeverity,hiddenSeverities:f})})]}),e.jsx(Q,{component:"div"}),e.jsxs(yt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ae,{isFilled:!0,children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(he,{headingLevel:"h2",children:[Y(E,"node")," affected"]}),b&&e.jsx(Ct,{})]})}),e.jsx(ae,{children:e.jsx(ft,{itemCount:E,perPage:g,page:i,onSetPage:(u,h)=>m(h),onPerPageSelect:(u,h)=>{y(h)}})})]}),e.jsx(Gn,{tableState:L,getSortParams:C,onClearFilters:()=>{r({}),m(1)}})]})]})}const os=V`
    fragment NodeMetadata on Node {
        id
        name
        osImage
        kubeletVersion
        kernelVersion
        scanTime
    }
`;function as({data:n}){if(!n)return e.jsx(dn,{nameScreenreaderText:"Loading Node name",metadataScreenreaderText:"Loading Node metadata"});const t=n.scanTime?4:3;return e.jsxs(B,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(he,{headingLevel:"h1",children:n.name}),e.jsxs(ln,{numLabels:t,children:[e.jsxs(ne,{children:["OS: ",n.osImage]}),e.jsxs(ne,{children:["Kubelet: ",n.kubeletVersion]}),e.jsxs(ne,{children:["Kernel version: ",n.kernelVersion]}),n.scanTime&&e.jsxs(ne,{children:["Scan time: ",fe(n.scanTime)]})]})]})}const rs=[ie,M,je,ge],is={field:M,direction:"desc"},ds=V`
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
`;function ls({tableState:n,getSortParams:t,onClearFilters:s}){const o=be();return e.jsxs(H,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(W,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(Je,{}),e.jsx(p,{sort:t(ie),children:"CVE"}),e.jsx(p,{sort:t(M),children:"Top severity"}),e.jsx(p,{sort:t(je),children:"CVE status"}),e.jsx(p,{sort:t(ge),children:"CVSS"}),e.jsx(p,{children:"Affected components"})]})}),e.jsx(le,{tableState:n,colSpan:6,emptyProps:{message:"No CVEs were detected for this node"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((x,c)=>{const{cve:i,cvss:g,scoreVersion:m,nodeComponents:y}=x,j=y.flatMap(l=>l.nodeVulnerabilities),C=it(j),b=dt(j),f=o.has(i);return e.jsxs(Z,{isExpanded:f,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:c,isExpanded:f,onToggle:()=>o.toggle(i)}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ce,{to:ue("CVE",i),children:i})}),e.jsx(d,{dataLabel:"Top severity",children:e.jsx(lt,{severity:C})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Re,{isFixable:b})}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(Ee,{cvss:g,scoreVersion:m})}),e.jsx(d,{dataLabel:"Affected components",children:y.length===1?y[0].name:Y(y.length,"component")})]}),e.jsxs(F,{isExpanded:f,children:[e.jsx(d,{}),e.jsx(d,{colSpan:5,children:e.jsx(Ve,{children:e.jsx(Vt,{data:y})})})]})]},i)})})]})}const cs=V`
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
`;function xs(n,t){return I(ms,{variables:{id:n,query:t}})}const ps=[at,qe];function hs({nodeId:n}){var N,L;const{analyticsTrack:t}=Te(),s=Ae(t),{searchFilter:r,setSearchFilter:o}=Fe(),a=De(r),x=G(a),c=Pe(a),{page:i,perPage:g,setPage:m,setPerPage:y}=Le(Ie),{sortOption:j,getSortParams:C}=Oe({sortFields:rs,defaultSortOption:is,onSort:()=>m(1,"replace")}),b=ut(a),f=un(a),{data:l,loading:v,error:T}=us({nodeId:n,query:x,page:i,perPage:g,sortOption:j}),E=xs(n,x),O=((N=l==null?void 0:l.node)==null?void 0:N.nodeVulnerabilityCount)??0,D=de({isLoading:v,error:T,data:(L=l==null?void 0:l.node)==null?void 0:L.nodeVulnerabilities,searchFilter:a});return e.jsxs(e.Fragment,{children:[e.jsx(S,{children:e.jsx(Ne,{component:"p",children:"Review and triage vulnerability data scanned on this node"})}),e.jsx(Q,{component:"div"}),e.jsxs(S,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx($e,{searchFilter:r,searchFilterConfig:ps,defaultSearchFilterEntity:"CVE",onFilterChange:(u,h)=>{o(u),m(1,"replace"),s(we,h)}}),e.jsxs(jt,{isLoading:E.loading,error:E.error,children:[e.jsx(oe,{loadingText:"Loading node CVEs by severity summary",data:E.data,renderer:({data:u})=>e.jsx(gt,{title:"CVEs by severity",severityCounts:u.node.nodeCVECountBySeverity,hiddenSeverities:b})}),e.jsx(oe,{loadingText:"Loading node CVEs by status summary",data:E.data,renderer:({data:u})=>e.jsx(mn,{cveStatusCounts:u.node.nodeCVECountBySeverity,hiddenStatuses:f})})]}),e.jsx(Q,{component:"div"}),e.jsxs(yt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ae,{isFilled:!0,children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(he,{headingLevel:"h2",children:l&&l.node?`${Y(l.node.nodeVulnerabilityCount,"result")} found`:e.jsx(_e,{screenreaderText:"Loading node vulnerability count"})}),c&&e.jsx(Ct,{})]})}),e.jsx(ae,{children:e.jsx(ft,{itemCount:O,perPage:g,page:i,onSetPage:(u,h)=>m(h),onPerPageSelect:(u,h)=>{y(h)}})})]}),e.jsx(ls,{tableState:D,getSortParams:C,onClearFilters:()=>{o({}),m(1)}})]})]})}const js=V`
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
`;function gs(n){return I(js,{variables:{id:n}})}function ys({nodeId:n}){const{data:t,loading:s,error:r}=gs(n);return e.jsxs(e.Fragment,{children:[e.jsx(S,{component:"div",children:e.jsx(Ne,{component:"p",children:"View details about this node"})}),e.jsx(Q,{component:"div"}),e.jsx(S,{isFilled:!0,children:r?e.jsx(ve,{children:e.jsx(vt,{title:"There was an error loading the node details",headingLevel:"h2",icon:bt,status:"danger",children:St(r)})}):s?e.jsx(ve,{children:e.jsx(xn,{size:"xl"})}):t&&e.jsxs(B,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(pn,{columnModifier:{default:"1Col",lg:"2Col"},children:[e.jsxs(w,{children:[e.jsx(R,{children:"Cluster"}),e.jsx(_,{children:t.node.cluster.name})]}),t.node.containerRuntimeVersion&&e.jsxs(w,{children:[e.jsx(R,{children:"Container runtime"}),e.jsx(_,{children:t.node.containerRuntimeVersion})]}),t.node.joinedAt&&e.jsxs(w,{children:[e.jsx(R,{children:"Join time"}),e.jsx(_,{children:fe(t.node.joinedAt)})]}),t.node.scanTime&&e.jsxs(w,{children:[e.jsx(R,{children:"Scan time"}),e.jsx(_,{children:fe(t.node.scanTime)})]}),t.node.kernelVersion&&e.jsxs(w,{children:[e.jsx(R,{children:"Kernel version"}),e.jsx(_,{children:t.node.kernelVersion})]}),t.node.kubeletVersion&&e.jsxs(w,{children:[e.jsx(R,{children:"Kubelet"}),e.jsx(_,{children:t.node.kubeletVersion})]})]}),e.jsx(Ge,{toggleText:"Labels",labels:t.node.labels}),e.jsx(Ge,{toggleText:"Annotations",labels:t.node.annotations})]})})]})}const Cs="NodePageDetails",fs="NodePageVulnerabilities",vs=pt("Node",{entityTab:"Node"}),Ss=V`
    ${os}
    query getNodeMetadata($id: ID!) {
        node(id: $id) {
            ...NodeMetadata
        }
    }
`;function bs(){var i;const{nodeId:n}=ct(),{data:t,error:s}=I(Ss,{variables:{id:n}}),[r,o]=st("detailsTab",ye),a=ye[0],x=ye[1],c=((i=t==null?void 0:t.node)==null?void 0:i.name)??"-";return e.jsxs(e.Fragment,{children:[e.jsx(pe,{title:`Node CVEs - Node ${c}`}),e.jsx(S,{type:"breadcrumb",children:e.jsxs(mt,{children:[e.jsx(xt,{to:vs,children:"Nodes"}),e.jsx(ht,{isActive:!0,children:c??e.jsx(_e,{screenreaderText:"Loading Node name",width:"200px"})})]})}),s?e.jsx(S,{children:e.jsx(ve,{children:e.jsx(vt,{title:St(s),headingLevel:"h2",icon:bt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(S,{children:e.jsx(as,{data:t==null?void 0:t.node})}),e.jsx(S,{type:"tabs",children:e.jsxs(hn,{activeKey:r,onSelect:(g,m)=>{o(m)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Qe,{eventKey:a,tabContentId:fs,title:a,children:e.jsx(hs,{nodeId:n})}),e.jsx(Qe,{eventKey:x,tabContentId:Cs,title:x,children:e.jsx(ys,{nodeId:n})})]})})]})]})}function Os(){const{hasReadAccess:n}=jn(),t=n("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(gn,{}),e.jsxs(yn,{children:[e.jsx(se,{index:!0,element:e.jsx(kn,{})}),e.jsx(se,{path:"cves/:cveId",element:e.jsx(ss,{})}),e.jsx(se,{path:"nodes/:nodeId",element:e.jsx(bs,{})}),e.jsx(se,{path:"*",element:e.jsxs(S,{hasBodyWrapper:!1,children:[e.jsx(pe,{title:"Node CVEs - Not Found"}),e.jsx(Cn,{})]})})]})]})}export{Os as default};
