import{j as e,r as Nt}from"./react-Dz5erZcn.js";import{ax as re,f8 as G,f9 as ie,fa as Se,fb as Tt,bd as de,bS as be,fc as Ye,fd as Xe,fe as Ft,ff as ze,fg as Ce,eV as Lt,eW as It,b1 as le,eY as Ot,eZ as Dt,fh as Pt,fi as ce,e_ as Je,e$ as Ee,f0 as et,fj as $t,fk as W,fl as ue,fm as xe,fn as tt,a5 as Ve,bM as At,aW as nt,fo as Rt,aB as Ne,aA as Te,eO as Fe,aC as Le,dN as qt,fp as Ie,be as Oe,fq as wt,a6 as _t,ei as kt,ej as Bt,ek as Mt,eQ as De,fr as st,fs as ot,ft as at,fu as Pe,eI as $e,fv as Ae,fw as zt,A as pe,ab as Qt,ac as Ut,fx as Kt,aa as Gt,fy as Wt,fz as Ht,dF as Zt,fA as Re,fB as M,fC as he,fD as me,fE as rt,fF as it,fG as Yt,fH as dt,fI as lt,J as ct,fJ as ut,fK as Xt,fL as xt,fM as oe,fN as pt,fO as ht,fP as Jt,fQ as en,fR as tn,fS as nn,ad as mt,ay as jt,fT as ge,F as sn,fU as on,c9 as an}from"./index-znRmOrCl.js";import{u as rn,a as dn,b as ln,S as cn,c as un,E as Qe}from"./ExpandableLabelSection-B3ICbfRj.js";import{bD as yt,c6 as H,c7 as Z,c8 as F,c9 as h,ca as Y,cb as d,a1 as je,d3 as xn,d4 as qe,bq as we,cR as k,P as S,F as B,T as ye,k as Ue,bp as pn,bA as hn,aj as mn,dQ as X,bQ as jn,bR as yn,bT as gn,c4 as Cn,c5 as Ke,cZ as gt,cY as Ct,bv as ft,cz as _e,as as K,dr as vt,ds as ae,c$ as St,cn as fn,aJ as ne,p as fe,ax as ve,i as bt,S as vn,cS as Sn,cT as q,cU as w,cV as _,bE as bn,bF as Ge,dj as En,dk as se}from"./policy-filters-step-DeDyJcdf.js";import{u as I,h as V,i as Vn}from"./apollo-DfQf4W16.js";import{w as Nn}from"./lodash-DTYsuwI9.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-nwKdiiub.js";const Tn=V`
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
`;function In(){var t;return((t=I(Ln).data)==null?void 0:t.nodeCount)??0}const On=[ie,Se,Tt],We={field:Se,direction:"desc",aggregateBy:{aggregateFunc:"max",distinct:"false"}};function Dn({querySearchFilter:n,isFiltered:t,pagination:s,selectedCves:r,createRowActions:o,canSelectRows:a,sortOption:p,getSortParams:c,onClearFilters:i}){var D;const{page:y,perPage:x}=s,{data:g,previousData:j,loading:C,error:b}=Fn({querySearchFilter:n,page:y,perPage:x,sortOption:p}),f=In(),l=g??j,v=de({isLoading:C,data:l==null?void 0:l.nodeCVEs,error:b,searchFilter:n}),T=be(),E=a?8:6,O=(D=n.SEVERITY)==null?void 0:D.map(N=>yt[N]).filter(Ye);return e.jsxs(H,{borders:v.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":C?"true":"false",children:[e.jsx(Z,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(Xe,{}),a&&e.jsx(Ft,{selectedCves:r}),e.jsx(h,{sort:c(ie),children:"CVE"}),e.jsxs(ze,{tooltip:"The number of nodes affected by this CVE, grouped by the severity of the CVE on each node",children:["Nodes by severity",t&&e.jsx(Ce,{})]}),e.jsx(h,{sort:c(Se,Lt),children:"Top CVSS"}),e.jsxs(ze,{tooltip:"Ratio of the number of nodes affected by this CVE to the total number of nodes",sort:c("Node ID",It),children:["Affected nodes",t&&e.jsx(Ce,{})]}),e.jsx(h,{children:"First discovered"}),a&&e.jsx(h,{screenReaderText:"Row actions"})]})}),e.jsx(le,{tableState:v,colSpan:E,emptyProps:{message:"No CVEs have been detected for nodes across your secured clusters"},filteredEmptyProps:{onClearFilters:i},renderer:({data:N})=>N.map((L,u)=>{const{cve:m,affectedNodeCountBySeverity:{critical:P,important:R,moderate:z,low:Q,unknown:U},distroTuples:J,topCVSS:ee,affectedNodeCount:te,firstDiscoveredInSystem:$}=L,A=T.has(m),ke=Ot(J),Be=ke.length>0?ke[0].summary:"",Me=Dt(ee,J);return e.jsxs(Y,{isExpanded:A,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:u,isExpanded:A,onToggle:()=>T.toggle(m)}}),a&&e.jsx(Pt,{selectedCves:r,rowIndex:u,item:{cve:m}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(je,{to:ce("CVE",m),children:m})}),e.jsx(d,{dataLabel:"Nodes by severity",children:e.jsx(Je,{criticalCount:P.total,importantCount:R.total,moderateCount:z.total,lowCount:Q.total,unknownCount:U.total,filteredSeverities:O,entity:"node"})}),e.jsx(d,{dataLabel:"Top CVSS",children:e.jsx(Ee,{cvss:ee,scoreVersion:Me.length>0?Me.join("/"):void 0})}),e.jsxs(d,{dataLabel:"Affected nodes",children:[te," / ",f," affected nodes"]}),e.jsx(d,{dataLabel:"First discovered",children:e.jsx(et,{date:$})}),a&&e.jsx(d,{isActionCell:!0,children:e.jsx(xn,{items:o({cve:m})})})]}),e.jsxs(F,{isExpanded:A,children:[e.jsx(d,{}),e.jsx(d,{colSpan:E-1,children:e.jsx(qe,{children:Be?e.jsx(we,{component:"p",children:Be}):e.jsx($t,{})})})]})]},m)})})]})}const Pn=V`
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
`;function $n({querySearchFilter:n,...t}){return I(Pn,{variables:{query:G(n),pagination:re(t)}})}const An=[W,ue,xe,tt],He={field:W,direction:"asc"};function Rn({querySearchFilter:n,isFiltered:t,pagination:s,sortOption:r,getSortParams:o,onClearFilters:a}){var f;const{page:p,perPage:c}=s,{data:i,previousData:y,loading:x,error:g}=$n({querySearchFilter:n,page:p,perPage:c,sortOption:r}),j=i??y,C=de({isLoading:x,data:j==null?void 0:j.nodes,error:g,searchFilter:n}),b=(f=n.SEVERITY)==null?void 0:f.map(l=>yt[l]).filter(Ye);return e.jsxs(H,{borders:C.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":x?"true":"false",children:[e.jsx(Z,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(h,{sort:o(W),children:"Node"}),e.jsxs(h,{children:["CVEs by severity",t&&e.jsx(Ce,{})]}),e.jsx(h,{sort:o(ue),children:"Cluster"}),e.jsx(h,{sort:o(xe),children:"Operating system"}),e.jsx(h,{sort:o(tt),children:"Scan time"})]})}),e.jsx(le,{tableState:C,colSpan:5,emptyProps:{message:"No CVEs have been reported for your scanned nodes"},filteredEmptyProps:{onClearFilters:a},renderer:({data:l})=>e.jsx(Y,{children:l.map(v=>{const{id:T,name:E,nodeCVECountBySeverity:O,cluster:D,osImage:N,scanTime:L}=v,{critical:u,important:m,moderate:P,low:R,unknown:z}=O;return e.jsxs(F,{children:[e.jsx(d,{dataLabel:"Node",modifier:"nowrap",children:e.jsx(je,{to:ce("Node",T),children:e.jsx(k,{position:"middle",content:E})})}),e.jsx(d,{dataLabel:"CVEs by severity",children:e.jsx(Je,{criticalCount:u.total,importantCount:m.total,moderateCount:P.total,lowCount:R.total,unknownCount:z.total,filteredSeverities:b,entity:"node"})}),e.jsx(d,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(k,{position:"middle",content:D.name})}),e.jsx(d,{dataLabel:"Operating system",modifier:"nowrap",children:e.jsx(k,{position:"middle",content:N})}),e.jsx(d,{dataLabel:"Scan time",children:e.jsx(et,{date:L})})]},T)})})})]})}const qn=V`
    query getNodeCVEEntityCounts($query: String) {
        nodeCVECount(query: $query)
        nodeCount(query: $query)
    }
`;function wn(n){return I(qn,{variables:{query:G(n)}})}const _n=[st,ot,at,Pe];function kn(){var te;const n=Vn(),{analyticsTrack:t}=Ve(),s=$e(t),{isFeatureFlagEnabled:r}=At(),o=r("ROX_SCANNER_V4")&&r("ROX_NODE_INDEX_ENABLED"),[a]=nt("entityTab",Rt),{searchFilter:p,setSearchFilter:c}=Ne(),i=Te(Fe),{sortOption:y,getSortParams:x,setSortOption:g}=Le({sortFields:a==="CVE"?On:An,defaultSortOption:a==="CVE"?We:He,onSort:()=>i.setPage(1)});qt({destination:"node-cves",searchFilter:p,setSearchFilter:c,reapplyWhen:[a],onScopeApplied:()=>i.setPage(1)});const j=Ie(p),C=Oe(j),b=((te=j["CVE Snoozed"])==null?void 0:te[0])==="true",f=rn(),l=wt(),{snoozeModalOptions:v,setSnoozeModalOptions:T,snoozeActionCreator:E}=dn(),O=ln("Node"),{version:D}=_t();function N($){i.setPage(1),g($==="CVE"?We:He),t({event:Wt,properties:{type:$,page:"Overview"}})}Nt.useEffect(()=>{N(a)},[]);function L(){c({}),i.setPage(1)}const{data:u}=wn(j),m={CVE:(u==null?void 0:u.nodeCVECount)??0,Node:(u==null?void 0:u.nodeCount)??0},P=kt(),R=P==="v1"||P==="v2",z=Bt({enabled:R&&P==="v1",searchFilter:p,setSearchFilter:c,paginationSetPage:()=>i.setPage(1),storageScope:"node-cves",filterKind:"workload"}),Q=Mt({enabled:R&&P==="v2",searchFilter:p,setSearchFilter:c,paginationSetPage:()=>i.setPage(1),storageScope:"node-cves",filterKind:"workload"}),U=P==="v2"?Q:z,J=e.jsx(De,{searchFilter:p,searchFilterConfig:_n,defaultSearchFilterEntity:"Node",onFilterChange:($,A)=>{c($),i.setPage(1),s(Ae,A)},prefixToolbarItems:U.prefixToolbarItem??void 0,appliedFilterSuffix:U.appliedFilterSuffix??void 0}),ee=e.jsx(Ht,{entityTabs:["CVE","Node"],entityCounts:m,onChange:N});return e.jsxs(e.Fragment,{children:[v&&e.jsx(cn,{...v,onSuccess:($,A)=>{$==="SNOOZE"&&t({event:zt,properties:{type:"NODE",duration:A}}),n.cache.evict({fieldName:"nodeCVEs"}),n.cache.evict({fieldName:"nodeCVECount"}),n.cache.gc(),l.clear()},onClose:()=>T(null)}),e.jsx(pe,{title:"Node CVEs Overview"}),e.jsx(S,{children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(B,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(ye,{headingLevel:"h1",children:"Node CVEs"}),e.jsx(Ue,{children:"Prioritize and manage scanned CVEs across nodes"})]}),e.jsx(Ue,{children:e.jsx(un,{searchFilter:p,setSearchFilter:c,snoozedCveCount:O})})]})}),o&&e.jsx(S,{children:e.jsx(pn,{isInline:!0,variant:"info",title:"Results may include Node CVEs obtained from Scanner V4",component:"p",children:e.jsx(Qt,{children:e.jsx("a",{href:Ut(D,"operating/managing-vulnerabilities#understanding-node-cves-scanner-v4_scan-rhcos-node-host"),target:"_blank",rel:"noopener noreferrer",children:"Read more about the differences between the node scanning results obtained with the StackRox Scanner and Scanner V4."})})})}),P==="v2"&&Q.wysiwygAlert&&e.jsx(S,{children:Q.wysiwygAlert}),e.jsxs(S,{isCenterAligned:!0,children:[e.jsx(Kt,{filterToolbar:J,entityToggleGroup:ee,pagination:i,tableRowCount:a==="CVE"?m.CVE:m.Node,isFiltered:C,children:f&&e.jsx(hn,{align:{default:"alignEnd"},children:e.jsx(Gt,{toggleText:"Bulk actions",isDisabled:l.size===0,children:e.jsx(mn,{onClick:()=>T({action:b?"UNSNOOZE":"SNOOZE",cveType:"NODE_CVE",cves:Array.from(l.values())}),children:b?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),a==="CVE"&&e.jsx(Dn,{querySearchFilter:j,isFiltered:C,pagination:i,selectedCves:l,canSelectRows:f,createRowActions:E("NODE_CVE",b?"UNSNOOZE":"SNOOZE"),sortOption:y,getSortParams:x,onClearFilters:L}),a==="Node"&&e.jsx(Rn,{querySearchFilter:j,isFiltered:C,pagination:i,sortOption:y,getSortParams:x,onClearFilters:L})]}),U.modalsFragment]})}function Bn(n,t){const s=Nn(n,r=>{var o,a;switch(t.field){case"Component":return(o=r.name)==null?void 0:o.toLowerCase();case"Type":return(a=r.source)==null?void 0:a.toLowerCase();default:return""}});return t.reversed&&s.reverse(),s}const Et=V`
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
`,Mn=["Component","Type"],zn={field:"Component",direction:"asc"};function Vt({data:n}){const{sortOption:t,getSortParams:s}=Zt({sortFields:Mn,defaultSortOption:zn}),r=Bn(n,t);return n.length===0?null:e.jsxs(H,{children:[e.jsx(Z,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(h,{sort:s("Component"),children:"Component"}),e.jsx(h,{children:"Version"}),e.jsx(h,{children:"CVE fixed in"}),e.jsx(h,{sort:s("Type"),children:"Type"})]})}),e.jsx(Y,{children:r.map(({name:o,source:a,version:p,nodeVulnerabilities:c})=>{var y;const i=(y=c==null?void 0:c[0])==null?void 0:y.fixedByVersion;return e.jsxs(F,{children:[e.jsx(d,{dataLabel:"Component",children:o}),e.jsx(d,{dataLabel:"Version",children:p}),e.jsx(d,{dataLabel:"CVE fixed in",children:i||e.jsx(Re,{isFixable:!1})}),e.jsx(d,{dataLabel:"Type",children:a})]},o)})})]})}const Qn=[W,M,he,me,ue,xe],Un={field:M,direction:"desc"},Kn=V`
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
`;function Gn({tableState:n,getSortParams:t,onClearFilters:s}){const o=be();return e.jsxs(H,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(Z,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(h,{screenReaderText:"Row expansion"}),e.jsx(h,{sort:t(W),children:"Node"}),e.jsx(h,{sort:t(M),children:"CVE severity"}),e.jsx(h,{sort:t(he),children:"CVE status"}),e.jsx(h,{sort:t(me),children:"CVSS"}),e.jsx(h,{sort:t(ue),children:"Cluster"}),e.jsx(h,{sort:t(xe),children:"Operating system"}),e.jsx(h,{children:"Affected components"})]})}),e.jsx(le,{tableState:n,colSpan:8,emptyProps:{message:"There are no nodes that are affected by this CVE"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((p,c)=>{const{id:i,name:y,nodeComponents:x}=p,g=o.has(i),j=x.flatMap(v=>v.nodeVulnerabilities),C=rt(j),b=it(j),{cvss:f,scoreVersion:l}=Yt(j);return e.jsxs(Y,{isExpanded:g,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:c,isExpanded:g,onToggle:()=>o.toggle(i)}}),e.jsx(d,{dataLabel:"Node",children:e.jsx(je,{to:ce("Node",i),children:e.jsx(k,{position:"middle",content:y})})}),e.jsx(d,{dataLabel:"CVE severity",modifier:"nowrap",children:e.jsx(dt,{severity:C})}),e.jsx(d,{dataLabel:"CVE status",modifier:"nowrap",children:e.jsx(Re,{isFixable:b})}),e.jsx(d,{dataLabel:"CVSS",modifier:"nowrap",children:e.jsx(Ee,{cvss:f,scoreVersion:l})}),e.jsx(d,{dataLabel:"Cluster",children:e.jsx(k,{position:"middle",content:p.cluster.name})}),e.jsx(d,{dataLabel:"Operating system",children:e.jsx(k,{position:"middle",content:p.osImage})}),e.jsx(d,{dataLabel:"Affected components",children:x.length===1?x[0].name:X(x.length,"component")})]}),e.jsxs(F,{isExpanded:g,children:[e.jsx(d,{}),e.jsx(d,{colSpan:7,children:e.jsx(qe,{children:e.jsx(Vt,{data:x})})})]})]},i)})})]})}function Wn({affectedNodeCount:n,totalNodeCount:t,operatingSystemCount:s}){return e.jsxs(jn,{isCompact:!0,isFullHeight:!0,children:[e.jsx(yn,{children:"Affected nodes"}),e.jsx(gn,{children:e.jsxs(Cn,{children:[e.jsxs(Ke,{span:12,className:"pf-v6-u-pt-sm",children:[n," / ",t," affected nodes"]}),e.jsxs(Ke,{span:12,className:"pf-v6-u-pt-sm",children:[X(s,"operating system")," affected"]})]})})]})}const Hn=V`
    ${Kn}
    query getAffectedNodes($query: String, $pagination: Pagination) {
        nodes(query: $query, pagination: $pagination) {
            ...AffectedNode
        }
    }
`;function Zn({query:n,...t}){var r,o;const s=I(Hn,{variables:{query:n,pagination:re(t)}});return{affectedNodesRequest:s,nodeData:((r=s.data)==null?void 0:r.nodes)??((o=s.previousData)==null?void 0:o.nodes)}}const Yn=V`
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
`;function Xn(n){const t=I(Yn,{variables:{cve:n}}),{data:s,previousData:r}=t,o=(s==null?void 0:s.nodeCVE)??(r==null?void 0:r.nodeCVE);return{metadataRequest:t,cveData:o}}const Jn=V`
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
`;function es(n,t){const s=I(Jn,{variables:{cve:n,query:t}}),{data:r,previousData:o}=s,a=(r==null?void 0:r.nodeCount)??(o==null?void 0:o.nodeCount)??0;return{summaryDataRequest:s,nodeCount:a}}const ts=ut("Node",{entityTab:"CVE"}),ns=[st,at,Pe],Ze={affectedNodeCountBySeverity:{critical:{total:0},important:{total:0},moderate:{total:0},low:{total:0},unknown:{total:0}},distroTuples:[]};function ss(){const{analyticsTrack:n}=Ve(),t=$e(n),{searchFilter:s,setSearchFilter:r}=Ne(),o=Ie(s),{cveId:a}=gt(),p=`^${a}$`,c=G({...o,CVE:[p]}),{page:i,perPage:y,setPage:x,setPerPage:g}=Te(Fe),{sortOption:j,getSortParams:C}=Le({sortFields:Qn,defaultSortOption:Un,onSort:()=>x(1)}),b=Oe(o),f=lt(o),{metadataRequest:l,cveData:v}=Xn(a),{summaryDataRequest:T,nodeCount:E}=es(a,c),{affectedNodesRequest:O,nodeData:D}=Zn({query:c,page:i,perPage:y,sortOption:j}),N=v==null?void 0:v.cve,L=de({isLoading:O.loading,error:O.error,data:D,searchFilter:o});return e.jsxs(e.Fragment,{children:[e.jsx(pe,{title:`Node CVEs - NodeCVE ${N}`}),e.jsx(S,{type:"breadcrumb",children:e.jsxs(Ct,{children:[e.jsx(ct,{to:ts,children:"Node CVEs"}),e.jsx(ft,{isActive:!0,children:N??e.jsx(_e,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(S,{children:e.jsx(Xt,{data:v})}),e.jsx(K,{component:"div"}),e.jsxs(S,{hasBodyWrapper:!1,children:[e.jsx(De,{searchFilter:s,searchFilterConfig:ns,defaultSearchFilterEntity:"Node",onFilterChange:(u,m)=>{r(u),x(1,"replace"),t(Ae,m)}}),e.jsxs(xt,{error:l.error,isLoading:l.loading,children:[e.jsx(oe,{data:T.data,loadingText:"Loading affected nodes summary",renderer:({data:u})=>e.jsx(Wn,{affectedNodeCount:E,totalNodeCount:u.totalNodeCount,operatingSystemCount:(u.nodeCVE??Ze).distroTuples.length})}),e.jsx(oe,{data:T.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:u})=>e.jsx(pt,{title:"Nodes by severity",severityCounts:(u.nodeCVE??Ze).affectedNodeCountBySeverity,hiddenSeverities:f})})]}),e.jsx(K,{component:"div"}),e.jsxs(vt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ae,{isFilled:!0,children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(ye,{headingLevel:"h2",children:[X(E,"node")," affected"]}),b&&e.jsx(ht,{})]})}),e.jsx(ae,{children:e.jsx(St,{itemCount:E,perPage:y,page:i,onSetPage:(u,m)=>x(m),onPerPageSelect:(u,m)=>{g(m)}})})]}),e.jsx(Gn,{tableState:L,getSortParams:C,onClearFilters:()=>{r({}),x(1)}})]})]})}const os=V`
    fragment NodeMetadata on Node {
        id
        name
        osImage
        kubeletVersion
        kernelVersion
        scanTime
    }
`;function as({data:n}){if(!n)return e.jsx(Jt,{nameScreenreaderText:"Loading Node name",metadataScreenreaderText:"Loading Node metadata"});const t=n.scanTime?4:3;return e.jsxs(B,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(ye,{headingLevel:"h1",children:n.name}),e.jsxs(fn,{numLabels:t,children:[e.jsxs(ne,{children:["OS: ",n.osImage]}),e.jsxs(ne,{children:["Kubelet: ",n.kubeletVersion]}),e.jsxs(ne,{children:["Kernel version: ",n.kernelVersion]}),n.scanTime&&e.jsxs(ne,{children:["Scan time: ",fe(n.scanTime)]})]})]})}const rs=[ie,M,he,me],is={field:M,direction:"desc"},ds=V`
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
`;function ls({tableState:n,getSortParams:t,onClearFilters:s}){const o=be();return e.jsxs(H,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(Z,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(Xe,{}),e.jsx(h,{sort:t(ie),children:"CVE"}),e.jsx(h,{sort:t(M),children:"Top severity"}),e.jsx(h,{sort:t(he),children:"CVE status"}),e.jsx(h,{sort:t(me),children:"CVSS"}),e.jsx(h,{children:"Affected components"})]})}),e.jsx(le,{tableState:n,colSpan:6,emptyProps:{message:"No CVEs were detected for this node"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((p,c)=>{const{cve:i,cvss:y,scoreVersion:x,nodeComponents:g}=p,j=g.flatMap(l=>l.nodeVulnerabilities),C=rt(j),b=it(j),f=o.has(i);return e.jsxs(Y,{isExpanded:f,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:c,isExpanded:f,onToggle:()=>o.toggle(i)}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(je,{to:ce("CVE",i),children:i})}),e.jsx(d,{dataLabel:"Top severity",children:e.jsx(dt,{severity:C})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(Re,{isFixable:b})}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(Ee,{cvss:y,scoreVersion:x})}),e.jsx(d,{dataLabel:"Affected components",children:g.length===1?g[0].name:X(g.length,"component")})]}),e.jsxs(F,{isExpanded:f,children:[e.jsx(d,{}),e.jsx(d,{colSpan:5,children:e.jsx(qe,{children:e.jsx(Vt,{data:g})})})]})]},i)})})]})}const cs=V`
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
`;function us({nodeId:n,query:t,...s}){return I(cs,{variables:{id:n,query:t,pagination:re(s)}})}const xs=V`
    ${en}
    query getNodeVulnSummary($id: ID!, $query: String!) {
        node(id: $id) {
            id
            nodeCVECountBySeverity(query: $query) {
                ...ResourceCountsByCVESeverityAndStatus
            }
        }
    }
`;function ps(n,t){return I(xs,{variables:{id:n,query:t}})}const hs=[ot,Pe];function ms({nodeId:n}){var N,L;const{analyticsTrack:t}=Ve(),s=$e(t),{searchFilter:r,setSearchFilter:o}=Ne(),a=Ie(r),p=G(a),c=Oe(a),{page:i,perPage:y,setPage:x,setPerPage:g}=Te(Fe),{sortOption:j,getSortParams:C}=Le({sortFields:rs,defaultSortOption:is,onSort:()=>x(1,"replace")}),b=lt(a),f=tn(a),{data:l,loading:v,error:T}=us({nodeId:n,query:p,page:i,perPage:y,sortOption:j}),E=ps(n,p),O=((N=l==null?void 0:l.node)==null?void 0:N.nodeVulnerabilityCount)??0,D=de({isLoading:v,error:T,data:(L=l==null?void 0:l.node)==null?void 0:L.nodeVulnerabilities,searchFilter:a});return e.jsxs(e.Fragment,{children:[e.jsx(S,{children:e.jsx(we,{component:"p",children:"Review and triage vulnerability data scanned on this node"})}),e.jsx(K,{component:"div"}),e.jsxs(S,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(De,{searchFilter:r,searchFilterConfig:hs,defaultSearchFilterEntity:"CVE",onFilterChange:(u,m)=>{o(u),x(1,"replace"),s(Ae,m)}}),e.jsxs(xt,{isLoading:E.loading,error:E.error,children:[e.jsx(oe,{loadingText:"Loading node CVEs by severity summary",data:E.data,renderer:({data:u})=>e.jsx(pt,{title:"CVEs by severity",severityCounts:u.node.nodeCVECountBySeverity,hiddenSeverities:b})}),e.jsx(oe,{loadingText:"Loading node CVEs by status summary",data:E.data,renderer:({data:u})=>e.jsx(nn,{cveStatusCounts:u.node.nodeCVECountBySeverity,hiddenStatuses:f})})]}),e.jsx(K,{component:"div"}),e.jsxs(vt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ae,{isFilled:!0,children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(ye,{headingLevel:"h2",children:l&&l.node?`${X(l.node.nodeVulnerabilityCount,"result")} found`:e.jsx(_e,{screenreaderText:"Loading node vulnerability count"})}),c&&e.jsx(ht,{})]})}),e.jsx(ae,{children:e.jsx(St,{itemCount:O,perPage:y,page:i,onSetPage:(u,m)=>x(m),onPerPageSelect:(u,m)=>{g(m)}})})]}),e.jsx(ls,{tableState:D,getSortParams:C,onClearFilters:()=>{o({}),x(1)}})]})]})}const js=V`
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
`;function ys(n){return I(js,{variables:{id:n}})}function gs({nodeId:n}){const{data:t,loading:s,error:r}=ys(n);return e.jsxs(e.Fragment,{children:[e.jsx(S,{component:"div",children:e.jsx(we,{component:"p",children:"View details about this node"})}),e.jsx(K,{component:"div"}),e.jsx(S,{isFilled:!0,children:r?e.jsx(ve,{children:e.jsx(mt,{title:"There was an error loading the node details",headingLevel:"h2",icon:bt,status:"danger",children:jt(r)})}):s?e.jsx(ve,{children:e.jsx(vn,{size:"xl"})}):t&&e.jsxs(B,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(Sn,{columnModifier:{default:"1Col",lg:"2Col"},children:[e.jsxs(q,{children:[e.jsx(w,{children:"Cluster"}),e.jsx(_,{children:t.node.cluster.name})]}),t.node.containerRuntimeVersion&&e.jsxs(q,{children:[e.jsx(w,{children:"Container runtime"}),e.jsx(_,{children:t.node.containerRuntimeVersion})]}),t.node.joinedAt&&e.jsxs(q,{children:[e.jsx(w,{children:"Join time"}),e.jsx(_,{children:fe(t.node.joinedAt)})]}),t.node.scanTime&&e.jsxs(q,{children:[e.jsx(w,{children:"Scan time"}),e.jsx(_,{children:fe(t.node.scanTime)})]}),t.node.kernelVersion&&e.jsxs(q,{children:[e.jsx(w,{children:"Kernel version"}),e.jsx(_,{children:t.node.kernelVersion})]}),t.node.kubeletVersion&&e.jsxs(q,{children:[e.jsx(w,{children:"Kubelet"}),e.jsx(_,{children:t.node.kubeletVersion})]})]}),e.jsx(Qe,{toggleText:"Labels",labels:t.node.labels}),e.jsx(Qe,{toggleText:"Annotations",labels:t.node.annotations})]})})]})}const Cs="NodePageDetails",fs="NodePageVulnerabilities",vs=ut("Node",{entityTab:"Node"}),Ss=V`
    ${os}
    query getNodeMetadata($id: ID!) {
        node(id: $id) {
            ...NodeMetadata
        }
    }
`;function bs(){var i;const{nodeId:n}=gt(),{data:t,error:s}=I(Ss,{variables:{id:n}}),[r,o]=nt("detailsTab",ge),a=ge[0],p=ge[1],c=((i=t==null?void 0:t.node)==null?void 0:i.name)??"-";return e.jsxs(e.Fragment,{children:[e.jsx(pe,{title:`Node CVEs - Node ${c}`}),e.jsx(S,{type:"breadcrumb",children:e.jsxs(Ct,{children:[e.jsx(ct,{to:vs,children:"Nodes"}),e.jsx(ft,{isActive:!0,children:c??e.jsx(_e,{screenreaderText:"Loading Node name",width:"200px"})})]})}),s?e.jsx(S,{children:e.jsx(ve,{children:e.jsx(mt,{title:jt(s),headingLevel:"h2",icon:bt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(S,{children:e.jsx(as,{data:t==null?void 0:t.node})}),e.jsx(S,{type:"tabs",children:e.jsxs(bn,{activeKey:r,onSelect:(y,x)=>{o(x)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Ge,{eventKey:a,tabContentId:fs,title:a,children:e.jsx(ms,{nodeId:n})}),e.jsx(Ge,{eventKey:p,tabContentId:Cs,title:p,children:e.jsx(gs,{nodeId:n})})]})})]})]})}function Ds(){const{hasReadAccess:n}=sn(),t=n("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(on,{}),e.jsxs(En,{children:[e.jsx(se,{index:!0,element:e.jsx(kn,{})}),e.jsx(se,{path:"cves/:cveId",element:e.jsx(ss,{})}),e.jsx(se,{path:"nodes/:nodeId",element:e.jsx(bs,{})}),e.jsx(se,{path:"*",element:e.jsxs(S,{hasBodyWrapper:!1,children:[e.jsx(pe,{title:"Node CVEs - Not Found"}),e.jsx(an,{})]})})]})]})}export{Ds as default};
