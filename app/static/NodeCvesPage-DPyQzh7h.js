import{ci as re,m8 as K,m9 as ie,ma as Se,mb as Nt,dy as de,eG as be,mc as Ye,md as Xe,w as e,aE as W,aF as H,a3 as F,me as Je,mf as Tt,aG as h,mg as ze,mh as Ce,lV as Ft,lW as Lt,dk as le,lY as Ot,lZ as It,aH as Z,av as d,mi as Dt,b7 as ce,mj as ue,l_ as et,l$ as Ee,m0 as tt,ba as Pt,cx as Ve,al as Ne,mk as $t,ml as Y,mm as xe,mn as me,mo as nt,dO as k,bM as Te,es as At,d7 as st,mp as Rt,cB as Fe,cA as Le,lO as Oe,cC as Ie,jR as qt,mq as De,dz as Pe,mr as wt,bN as _t,kC as kt,kD as Bt,kE as Mt,lQ as $e,ms as ot,mt as at,mu as rt,mv as Ae,lH as Re,mw as qe,mx as zt,an as he,aa as S,aA as B,ab as pe,aB as Ue,ah as Ut,bS as Qt,bT as Gt,my as Kt,aV as Wt,bR as Ht,K as Zt,mz as Yt,mA as Xt,jD as Jt,mB as we,fe as en,mC as M,mD as je,mE as ge,mF as it,mG as dt,mH as tn,mI as lt,b8 as X,aP as nn,aR as sn,aS as on,bJ as an,bn as Qe,bh as ct,mJ as ut,bd as xt,be as mt,mK as ht,bf as pt,e5 as _e,mL as rn,bg as G,mM as jt,mN as oe,mO as gt,dZ as yt,fW as ae,mP as Ct,cz as ft,mQ as dn,e4 as ln,aY as ne,de as fe,mR as cn,mS as un,mT as xn,bj as ve,bW as vt,cr as St,ck as bt,bk as mn,cn as hn,co as q,cp as w,cq as _,mU as ye,ac as pn,ad as Ge,b3 as jn,mV as gn,cf as yn,cg as se,f1 as Cn}from"./index-C8sEyDBX.js";import{u as O,g as V,f as fn,r as vn}from"./apollo-BxVF6eGb.js";import{u as Sn,a as bn,b as En,S as Vn,c as Nn,E as Ke}from"./ExpandableLabelSection-CW40jSwX.js";import"./react-pF2EnNv3.js";import"./lodash-JMWJiBov.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-xkE5F7Tr.js";const Tn=V`
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
`;function Fn({querySearchFilter:n,...t}){return O(Tn,{variables:{query:K(n),pagination:re(t)}})}const Ln=V`
    query getTotalNodeCount {
        nodeCount
    }
`;function On(){var t;return((t=O(Ln).data)==null?void 0:t.nodeCount)??0}const In=[ie,Se,Nt],We={field:Se,direction:"desc",aggregateBy:{aggregateFunc:"max",distinct:"false"}};function Dn({querySearchFilter:n,isFiltered:t,pagination:s,selectedCves:r,createRowActions:o,canSelectRows:a,sortOption:m,getSortParams:c,onClearFilters:i}){var D;const{page:g,perPage:x}=s,{data:y,previousData:j,loading:C,error:b}=Fn({querySearchFilter:n,page:g,perPage:x,sortOption:m}),f=On(),l=y??j,v=de({isLoading:C,data:l==null?void 0:l.nodeCVEs,error:b,searchFilter:n}),T=be(),E=a?8:6,I=(D=n.SEVERITY)==null?void 0:D.map(N=>Ye[N]).filter(Xe);return e.jsxs(W,{borders:v.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":C?"true":"false",children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(Je,{}),a&&e.jsx(Tt,{selectedCves:r}),e.jsx(h,{sort:c(ie),children:"CVE"}),e.jsxs(ze,{tooltip:"The number of nodes affected by this CVE, grouped by the severity of the CVE on each node",children:["Nodes by severity",t&&e.jsx(Ce,{})]}),e.jsx(h,{sort:c(Se,Ft),children:"Top CVSS"}),e.jsxs(ze,{tooltip:"Ratio of the number of nodes affected by this CVE to the total number of nodes",sort:c("Node ID",Lt),children:["Affected nodes",t&&e.jsx(Ce,{})]}),e.jsx(h,{children:"First discovered"}),a&&e.jsx(h,{screenReaderText:"Row actions"})]})}),e.jsx(le,{tableState:v,colSpan:E,emptyProps:{message:"No CVEs have been detected for nodes across your secured clusters"},filteredEmptyProps:{onClearFilters:i},renderer:({data:N})=>N.map((L,u)=>{const{cve:p,affectedNodeCountBySeverity:{critical:P,important:R,moderate:z,low:U,unknown:Q},distroTuples:J,topCVSS:ee,affectedNodeCount:te,firstDiscoveredInSystem:$}=L,A=T.has(p),ke=Ot(J),Be=ke.length>0?ke[0].summary:"",Me=It(ee,J);return e.jsxs(Z,{isExpanded:A,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:u,isExpanded:A,onToggle:()=>T.toggle(p)}}),a&&e.jsx(Dt,{selectedCves:r,rowIndex:u,item:{cve:p}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ce,{to:ue("CVE",p),children:p})}),e.jsx(d,{dataLabel:"Nodes by severity",children:e.jsx(et,{criticalCount:P.total,importantCount:R.total,moderateCount:z.total,lowCount:U.total,unknownCount:Q.total,filteredSeverities:I,entity:"node"})}),e.jsx(d,{dataLabel:"Top CVSS",children:e.jsx(Ee,{cvss:ee,scoreVersion:Me.length>0?Me.join("/"):void 0})}),e.jsxs(d,{dataLabel:"Affected nodes",children:[te," / ",f," affected nodes"]}),e.jsx(d,{dataLabel:"First discovered",children:e.jsx(tt,{date:$})}),a&&e.jsx(d,{isActionCell:!0,children:e.jsx(Pt,{items:o({cve:p})})})]}),e.jsxs(F,{isExpanded:A,children:[e.jsx(d,{}),e.jsx(d,{colSpan:E-1,children:e.jsx(Ve,{children:Be?e.jsx(Ne,{component:"p",children:Be}):e.jsx($t,{})})})]})]},p)})})]})}const Pn=V`
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
`;function $n({querySearchFilter:n,...t}){return O(Pn,{variables:{query:K(n),pagination:re(t)}})}const An=[Y,xe,me,nt],He={field:Y,direction:"asc"};function Rn({querySearchFilter:n,isFiltered:t,pagination:s,sortOption:r,getSortParams:o,onClearFilters:a}){var f;const{page:m,perPage:c}=s,{data:i,previousData:g,loading:x,error:y}=$n({querySearchFilter:n,page:m,perPage:c,sortOption:r}),j=i??g,C=de({isLoading:x,data:j==null?void 0:j.nodes,error:y,searchFilter:n}),b=(f=n.SEVERITY)==null?void 0:f.map(l=>Ye[l]).filter(Xe);return e.jsxs(W,{borders:C.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":x?"true":"false",children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(h,{sort:o(Y),children:"Node"}),e.jsxs(h,{children:["CVEs by severity",t&&e.jsx(Ce,{})]}),e.jsx(h,{sort:o(xe),children:"Cluster"}),e.jsx(h,{sort:o(me),children:"Operating system"}),e.jsx(h,{sort:o(nt),children:"Scan time"})]})}),e.jsx(le,{tableState:C,colSpan:5,emptyProps:{message:"No CVEs have been reported for your scanned nodes"},filteredEmptyProps:{onClearFilters:a},renderer:({data:l})=>e.jsx(Z,{children:l.map(v=>{const{id:T,name:E,nodeCVECountBySeverity:I,cluster:D,osImage:N,scanTime:L}=v,{critical:u,important:p,moderate:P,low:R,unknown:z}=I;return e.jsxs(F,{children:[e.jsx(d,{dataLabel:"Node",modifier:"nowrap",children:e.jsx(ce,{to:ue("Node",T),children:e.jsx(k,{position:"middle",content:E})})}),e.jsx(d,{dataLabel:"CVEs by severity",children:e.jsx(et,{criticalCount:u.total,importantCount:p.total,moderateCount:P.total,lowCount:R.total,unknownCount:z.total,filteredSeverities:b,entity:"node"})}),e.jsx(d,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(k,{position:"middle",content:D.name})}),e.jsx(d,{dataLabel:"Operating system",modifier:"nowrap",children:e.jsx(k,{position:"middle",content:N})}),e.jsx(d,{dataLabel:"Scan time",children:e.jsx(tt,{date:L})})]},T)})})})]})}const qn=V`
    query getNodeCVEEntityCounts($query: String) {
        nodeCVECount(query: $query)
        nodeCount(query: $query)
    }
`;function wn(n){return O(qn,{variables:{query:K(n)}})}const _n=[ot,at,rt,Ae];function kn(){var te;const n=fn(),{analyticsTrack:t}=Te(),s=Re(t),{isFeatureFlagEnabled:r}=At(),o=r("ROX_SCANNER_V4")&&r("ROX_NODE_INDEX_ENABLED"),[a]=st("entityTab",Rt),{searchFilter:m,setSearchFilter:c}=Fe(),i=Le(Oe),{sortOption:g,getSortParams:x,setSortOption:y}=Ie({sortFields:a==="CVE"?In:An,defaultSortOption:a==="CVE"?We:He,onSort:()=>i.setPage(1)});qt({destination:"node-cves",searchFilter:m,setSearchFilter:c,reapplyWhen:[a],onScopeApplied:()=>i.setPage(1)});const j=De(m),C=Pe(j),b=((te=j["CVE Snoozed"])==null?void 0:te[0])==="true",f=Sn(),l=wt(),{snoozeModalOptions:v,setSnoozeModalOptions:T,snoozeActionCreator:E}=bn(),I=En("Node"),{version:D}=_t();function N($){i.setPage(1),y($==="CVE"?We:He),t({event:Yt,properties:{type:$,page:"Overview"}})}vn.useEffect(()=>{N(a)},[]);function L(){c({}),i.setPage(1)}const{data:u}=wn(j),p={CVE:(u==null?void 0:u.nodeCVECount)??0,Node:(u==null?void 0:u.nodeCount)??0},P=kt(),R=P==="v1"||P==="v2",z=Bt({enabled:R&&P==="v1",searchFilter:m,setSearchFilter:c,paginationSetPage:()=>i.setPage(1),storageScope:"node-cves",filterKind:"workload"}),U=Mt({enabled:R&&P==="v2",searchFilter:m,setSearchFilter:c,paginationSetPage:()=>i.setPage(1),storageScope:"node-cves",filterKind:"workload"}),Q=P==="v2"?U:z,J=e.jsx($e,{searchFilter:m,searchFilterConfig:_n,defaultSearchFilterEntity:"Node",onFilterChange:($,A)=>{c($),i.setPage(1),s(qe,A)},prefixToolbarItems:Q.prefixToolbarItem??void 0,appliedFilterSuffix:Q.appliedFilterSuffix??void 0}),ee=e.jsx(Xt,{entityTabs:["CVE","Node"],entityCounts:p,onChange:N});return e.jsxs(e.Fragment,{children:[v&&e.jsx(Vn,{...v,onSuccess:($,A)=>{$==="SNOOZE"&&t({event:zt,properties:{type:"NODE",duration:A}}),n.cache.evict({fieldName:"nodeCVEs"}),n.cache.evict({fieldName:"nodeCVECount"}),n.cache.gc(),l.clear()},onClose:()=>T(null)}),e.jsx(he,{title:"Node CVEs Overview"}),e.jsx(S,{children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(B,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(pe,{headingLevel:"h1",children:"Node CVEs"}),e.jsx(Ue,{children:"Prioritize and manage scanned CVEs across nodes"})]}),e.jsx(Ue,{children:e.jsx(Nn,{searchFilter:m,setSearchFilter:c,snoozedCveCount:I})})]})}),o&&e.jsx(S,{children:e.jsx(Ut,{isInline:!0,variant:"info",title:"Results may include Node CVEs obtained from Scanner V4",component:"p",children:e.jsx(Qt,{children:e.jsx("a",{href:Gt(D,"operating/managing-vulnerabilities#understanding-node-cves-scanner-v4_scan-rhcos-node-host"),target:"_blank",rel:"noopener noreferrer",children:"Read more about the differences between the node scanning results obtained with the StackRox Scanner and Scanner V4."})})})}),P==="v2"&&U.wysiwygAlert&&e.jsx(S,{children:U.wysiwygAlert}),e.jsxs(S,{isCenterAligned:!0,children:[e.jsx(Kt,{filterToolbar:J,entityToggleGroup:ee,pagination:i,tableRowCount:a==="CVE"?p.CVE:p.Node,isFiltered:C,children:f&&e.jsx(Wt,{align:{default:"alignEnd"},children:e.jsx(Ht,{toggleText:"Bulk actions",isDisabled:l.size===0,children:e.jsx(Zt,{onClick:()=>T({action:b?"UNSNOOZE":"SNOOZE",cveType:"NODE_CVE",cves:Array.from(l.values())}),children:b?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),a==="CVE"&&e.jsx(Dn,{querySearchFilter:j,isFiltered:C,pagination:i,selectedCves:l,canSelectRows:f,createRowActions:E("NODE_CVE",b?"UNSNOOZE":"SNOOZE"),sortOption:g,getSortParams:x,onClearFilters:L}),a==="Node"&&e.jsx(Rn,{querySearchFilter:j,isFiltered:C,pagination:i,sortOption:g,getSortParams:x,onClearFilters:L})]}),Q.modalsFragment]})}function Bn(n,t){const s=en(n,r=>{var o,a;switch(t.field){case"Component":return(o=r.name)==null?void 0:o.toLowerCase();case"Type":return(a=r.source)==null?void 0:a.toLowerCase();default:return""}});return t.reversed&&s.reverse(),s}const Et=V`
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
`,Mn=["Component","Type"],zn={field:"Component",direction:"asc"};function Vt({data:n}){const{sortOption:t,getSortParams:s}=Jt({sortFields:Mn,defaultSortOption:zn}),r=Bn(n,t);return n.length===0?null:e.jsxs(W,{children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(h,{sort:s("Component"),children:"Component"}),e.jsx(h,{children:"Version"}),e.jsx(h,{children:"CVE fixed in"}),e.jsx(h,{sort:s("Type"),children:"Type"})]})}),e.jsx(Z,{children:r.map(({name:o,source:a,version:m,nodeVulnerabilities:c})=>{var g;const i=(g=c==null?void 0:c[0])==null?void 0:g.fixedByVersion;return e.jsxs(F,{children:[e.jsx(d,{dataLabel:"Component",children:o}),e.jsx(d,{dataLabel:"Version",children:m}),e.jsx(d,{dataLabel:"CVE fixed in",children:i||e.jsx(we,{isFixable:!1})}),e.jsx(d,{dataLabel:"Type",children:a})]},o)})})]})}const Un=[Y,M,je,ge,xe,me],Qn={field:M,direction:"desc"},Gn=V`
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
`;function Kn({tableState:n,getSortParams:t,onClearFilters:s}){const o=be();return e.jsxs(W,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(h,{screenReaderText:"Row expansion"}),e.jsx(h,{sort:t(Y),children:"Node"}),e.jsx(h,{sort:t(M),children:"CVE severity"}),e.jsx(h,{sort:t(je),children:"CVE status"}),e.jsx(h,{sort:t(ge),children:"CVSS"}),e.jsx(h,{sort:t(xe),children:"Cluster"}),e.jsx(h,{sort:t(me),children:"Operating system"}),e.jsx(h,{children:"Affected components"})]})}),e.jsx(le,{tableState:n,colSpan:8,emptyProps:{message:"There are no nodes that are affected by this CVE"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((m,c)=>{const{id:i,name:g,nodeComponents:x}=m,y=o.has(i),j=x.flatMap(v=>v.nodeVulnerabilities),C=it(j),b=dt(j),{cvss:f,scoreVersion:l}=tn(j);return e.jsxs(Z,{isExpanded:y,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:c,isExpanded:y,onToggle:()=>o.toggle(i)}}),e.jsx(d,{dataLabel:"Node",children:e.jsx(ce,{to:ue("Node",i),children:e.jsx(k,{position:"middle",content:g})})}),e.jsx(d,{dataLabel:"CVE severity",modifier:"nowrap",children:e.jsx(lt,{severity:C})}),e.jsx(d,{dataLabel:"CVE status",modifier:"nowrap",children:e.jsx(we,{isFixable:b})}),e.jsx(d,{dataLabel:"CVSS",modifier:"nowrap",children:e.jsx(Ee,{cvss:f,scoreVersion:l})}),e.jsx(d,{dataLabel:"Cluster",children:e.jsx(k,{position:"middle",content:m.cluster.name})}),e.jsx(d,{dataLabel:"Operating system",children:e.jsx(k,{position:"middle",content:m.osImage})}),e.jsx(d,{dataLabel:"Affected components",children:x.length===1?x[0].name:X(x.length,"component")})]}),e.jsxs(F,{isExpanded:y,children:[e.jsx(d,{}),e.jsx(d,{colSpan:7,children:e.jsx(Ve,{children:e.jsx(Vt,{data:x})})})]})]},i)})})]})}function Wn({affectedNodeCount:n,totalNodeCount:t,operatingSystemCount:s}){return e.jsxs(nn,{isCompact:!0,isFullHeight:!0,children:[e.jsx(sn,{children:"Affected nodes"}),e.jsx(on,{children:e.jsxs(an,{children:[e.jsxs(Qe,{span:12,className:"pf-v6-u-pt-sm",children:[n," / ",t," affected nodes"]}),e.jsxs(Qe,{span:12,className:"pf-v6-u-pt-sm",children:[X(s,"operating system")," affected"]})]})})]})}const Hn=V`
    ${Gn}
    query getAffectedNodes($query: String, $pagination: Pagination) {
        nodes(query: $query, pagination: $pagination) {
            ...AffectedNode
        }
    }
`;function Zn({query:n,...t}){var r,o;const s=O(Hn,{variables:{query:n,pagination:re(t)}});return{affectedNodesRequest:s,nodeData:((r=s.data)==null?void 0:r.nodes)??((o=s.previousData)==null?void 0:o.nodes)}}const Yn=V`
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
`;function Xn(n){const t=O(Yn,{variables:{cve:n}}),{data:s,previousData:r}=t,o=(s==null?void 0:s.nodeCVE)??(r==null?void 0:r.nodeCVE);return{metadataRequest:t,cveData:o}}const Jn=V`
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
`;function es(n,t){const s=O(Jn,{variables:{cve:n,query:t}}),{data:r,previousData:o}=s,a=(r==null?void 0:r.nodeCount)??(o==null?void 0:o.nodeCount)??0;return{summaryDataRequest:s,nodeCount:a}}const ts=ht("Node",{entityTab:"CVE"}),ns=[ot,rt,Ae],Ze={affectedNodeCountBySeverity:{critical:{total:0},important:{total:0},moderate:{total:0},low:{total:0},unknown:{total:0}},distroTuples:[]};function ss(){const{analyticsTrack:n}=Te(),t=Re(n),{searchFilter:s,setSearchFilter:r}=Fe(),o=De(s),{cveId:a}=ct(),m=`^${a}$`,c=K({...o,CVE:[m]}),{page:i,perPage:g,setPage:x,setPerPage:y}=Le(Oe),{sortOption:j,getSortParams:C}=Ie({sortFields:Un,defaultSortOption:Qn,onSort:()=>x(1)}),b=Pe(o),f=ut(o),{metadataRequest:l,cveData:v}=Xn(a),{summaryDataRequest:T,nodeCount:E}=es(a,c),{affectedNodesRequest:I,nodeData:D}=Zn({query:c,page:i,perPage:g,sortOption:j}),N=v==null?void 0:v.cve,L=de({isLoading:I.loading,error:I.error,data:D,searchFilter:o});return e.jsxs(e.Fragment,{children:[e.jsx(he,{title:`Node CVEs - NodeCVE ${N}`}),e.jsx(S,{type:"breadcrumb",children:e.jsxs(xt,{children:[e.jsx(mt,{to:ts,children:"Node CVEs"}),e.jsx(pt,{isActive:!0,children:N??e.jsx(_e,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(S,{children:e.jsx(rn,{data:v})}),e.jsx(G,{component:"div"}),e.jsxs(S,{hasBodyWrapper:!1,children:[e.jsx($e,{searchFilter:s,searchFilterConfig:ns,defaultSearchFilterEntity:"Node",onFilterChange:(u,p)=>{r(u),x(1,"replace"),t(qe,p)}}),e.jsxs(jt,{error:l.error,isLoading:l.loading,children:[e.jsx(oe,{data:T.data,loadingText:"Loading affected nodes summary",renderer:({data:u})=>e.jsx(Wn,{affectedNodeCount:E,totalNodeCount:u.totalNodeCount,operatingSystemCount:(u.nodeCVE??Ze).distroTuples.length})}),e.jsx(oe,{data:T.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:u})=>e.jsx(gt,{title:"Nodes by severity",severityCounts:(u.nodeCVE??Ze).affectedNodeCountBySeverity,hiddenSeverities:f})})]}),e.jsx(G,{component:"div"}),e.jsxs(yt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ae,{isFilled:!0,children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(pe,{headingLevel:"h2",children:[X(E,"node")," affected"]}),b&&e.jsx(Ct,{})]})}),e.jsx(ae,{children:e.jsx(ft,{itemCount:E,perPage:g,page:i,onSetPage:(u,p)=>x(p),onPerPageSelect:(u,p)=>{y(p)}})})]}),e.jsx(Kn,{tableState:L,getSortParams:C,onClearFilters:()=>{r({}),x(1)}})]})]})}const os=V`
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
`;function ls({tableState:n,getSortParams:t,onClearFilters:s}){const o=be();return e.jsxs(W,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(H,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(Je,{}),e.jsx(h,{sort:t(ie),children:"CVE"}),e.jsx(h,{sort:t(M),children:"Top severity"}),e.jsx(h,{sort:t(je),children:"CVE status"}),e.jsx(h,{sort:t(ge),children:"CVSS"}),e.jsx(h,{children:"Affected components"})]})}),e.jsx(le,{tableState:n,colSpan:6,emptyProps:{message:"No CVEs were detected for this node"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((m,c)=>{const{cve:i,cvss:g,scoreVersion:x,nodeComponents:y}=m,j=y.flatMap(l=>l.nodeVulnerabilities),C=it(j),b=dt(j),f=o.has(i);return e.jsxs(Z,{isExpanded:f,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:c,isExpanded:f,onToggle:()=>o.toggle(i)}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(ce,{to:ue("CVE",i),children:i})}),e.jsx(d,{dataLabel:"Top severity",children:e.jsx(lt,{severity:C})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(we,{isFixable:b})}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(Ee,{cvss:g,scoreVersion:x})}),e.jsx(d,{dataLabel:"Affected components",children:y.length===1?y[0].name:X(y.length,"component")})]}),e.jsxs(F,{isExpanded:f,children:[e.jsx(d,{}),e.jsx(d,{colSpan:5,children:e.jsx(Ve,{children:e.jsx(Vt,{data:y})})})]})]},i)})})]})}const cs=V`
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
`;function us({nodeId:n,query:t,...s}){return O(cs,{variables:{id:n,query:t,pagination:re(s)}})}const xs=V`
    ${cn}
    query getNodeVulnSummary($id: ID!, $query: String!) {
        node(id: $id) {
            id
            nodeCVECountBySeverity(query: $query) {
                ...ResourceCountsByCVESeverityAndStatus
            }
        }
    }
`;function ms(n,t){return O(xs,{variables:{id:n,query:t}})}const hs=[at,Ae];function ps({nodeId:n}){var N,L;const{analyticsTrack:t}=Te(),s=Re(t),{searchFilter:r,setSearchFilter:o}=Fe(),a=De(r),m=K(a),c=Pe(a),{page:i,perPage:g,setPage:x,setPerPage:y}=Le(Oe),{sortOption:j,getSortParams:C}=Ie({sortFields:rs,defaultSortOption:is,onSort:()=>x(1,"replace")}),b=ut(a),f=un(a),{data:l,loading:v,error:T}=us({nodeId:n,query:m,page:i,perPage:g,sortOption:j}),E=ms(n,m),I=((N=l==null?void 0:l.node)==null?void 0:N.nodeVulnerabilityCount)??0,D=de({isLoading:v,error:T,data:(L=l==null?void 0:l.node)==null?void 0:L.nodeVulnerabilities,searchFilter:a});return e.jsxs(e.Fragment,{children:[e.jsx(S,{children:e.jsx(Ne,{component:"p",children:"Review and triage vulnerability data scanned on this node"})}),e.jsx(G,{component:"div"}),e.jsxs(S,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx($e,{searchFilter:r,searchFilterConfig:hs,defaultSearchFilterEntity:"CVE",onFilterChange:(u,p)=>{o(u),x(1,"replace"),s(qe,p)}}),e.jsxs(jt,{isLoading:E.loading,error:E.error,children:[e.jsx(oe,{loadingText:"Loading node CVEs by severity summary",data:E.data,renderer:({data:u})=>e.jsx(gt,{title:"CVEs by severity",severityCounts:u.node.nodeCVECountBySeverity,hiddenSeverities:b})}),e.jsx(oe,{loadingText:"Loading node CVEs by status summary",data:E.data,renderer:({data:u})=>e.jsx(xn,{cveStatusCounts:u.node.nodeCVECountBySeverity,hiddenStatuses:f})})]}),e.jsx(G,{component:"div"}),e.jsxs(yt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ae,{isFilled:!0,children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(pe,{headingLevel:"h2",children:l&&l.node?`${X(l.node.nodeVulnerabilityCount,"result")} found`:e.jsx(_e,{screenreaderText:"Loading node vulnerability count"})}),c&&e.jsx(Ct,{})]})}),e.jsx(ae,{children:e.jsx(ft,{itemCount:I,perPage:g,page:i,onSetPage:(u,p)=>x(p),onPerPageSelect:(u,p)=>{y(p)}})})]}),e.jsx(ls,{tableState:D,getSortParams:C,onClearFilters:()=>{o({}),x(1)}})]})]})}const js=V`
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
`;function gs(n){return O(js,{variables:{id:n}})}function ys({nodeId:n}){const{data:t,loading:s,error:r}=gs(n);return e.jsxs(e.Fragment,{children:[e.jsx(S,{component:"div",children:e.jsx(Ne,{component:"p",children:"View details about this node"})}),e.jsx(G,{component:"div"}),e.jsx(S,{isFilled:!0,children:r?e.jsx(ve,{children:e.jsx(vt,{title:"There was an error loading the node details",headingLevel:"h2",icon:bt,status:"danger",children:St(r)})}):s?e.jsx(ve,{children:e.jsx(mn,{size:"xl"})}):t&&e.jsxs(B,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(hn,{columnModifier:{default:"1Col",lg:"2Col"},children:[e.jsxs(q,{children:[e.jsx(w,{children:"Cluster"}),e.jsx(_,{children:t.node.cluster.name})]}),t.node.containerRuntimeVersion&&e.jsxs(q,{children:[e.jsx(w,{children:"Container runtime"}),e.jsx(_,{children:t.node.containerRuntimeVersion})]}),t.node.joinedAt&&e.jsxs(q,{children:[e.jsx(w,{children:"Join time"}),e.jsx(_,{children:fe(t.node.joinedAt)})]}),t.node.scanTime&&e.jsxs(q,{children:[e.jsx(w,{children:"Scan time"}),e.jsx(_,{children:fe(t.node.scanTime)})]}),t.node.kernelVersion&&e.jsxs(q,{children:[e.jsx(w,{children:"Kernel version"}),e.jsx(_,{children:t.node.kernelVersion})]}),t.node.kubeletVersion&&e.jsxs(q,{children:[e.jsx(w,{children:"Kubelet"}),e.jsx(_,{children:t.node.kubeletVersion})]})]}),e.jsx(Ke,{toggleText:"Labels",labels:t.node.labels}),e.jsx(Ke,{toggleText:"Annotations",labels:t.node.annotations})]})})]})}const Cs="NodePageDetails",fs="NodePageVulnerabilities",vs=ht("Node",{entityTab:"Node"}),Ss=V`
    ${os}
    query getNodeMetadata($id: ID!) {
        node(id: $id) {
            ...NodeMetadata
        }
    }
`;function bs(){var i;const{nodeId:n}=ct(),{data:t,error:s}=O(Ss,{variables:{id:n}}),[r,o]=st("detailsTab",ye),a=ye[0],m=ye[1],c=((i=t==null?void 0:t.node)==null?void 0:i.name)??"-";return e.jsxs(e.Fragment,{children:[e.jsx(he,{title:`Node CVEs - Node ${c}`}),e.jsx(S,{type:"breadcrumb",children:e.jsxs(xt,{children:[e.jsx(mt,{to:vs,children:"Nodes"}),e.jsx(pt,{isActive:!0,children:c??e.jsx(_e,{screenreaderText:"Loading Node name",width:"200px"})})]})}),s?e.jsx(S,{children:e.jsx(ve,{children:e.jsx(vt,{title:St(s),headingLevel:"h2",icon:bt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(S,{children:e.jsx(as,{data:t==null?void 0:t.node})}),e.jsx(S,{type:"tabs",children:e.jsxs(pn,{activeKey:r,onSelect:(g,x)=>{o(x)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Ge,{eventKey:a,tabContentId:fs,title:a,children:e.jsx(ps,{nodeId:n})}),e.jsx(Ge,{eventKey:m,tabContentId:Cs,title:m,children:e.jsx(ys,{nodeId:n})})]})})]})]})}function Is(){const{hasReadAccess:n}=jn(),t=n("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(gn,{}),e.jsxs(yn,{children:[e.jsx(se,{index:!0,element:e.jsx(kn,{})}),e.jsx(se,{path:"cves/:cveId",element:e.jsx(ss,{})}),e.jsx(se,{path:"nodes/:nodeId",element:e.jsx(bs,{})}),e.jsx(se,{path:"*",element:e.jsxs(S,{hasBodyWrapper:!1,children:[e.jsx(he,{title:"Node CVEs - Not Found"}),e.jsx(Cn,{})]})})]})]})}export{Is as default};
