import{j as e,r as Nt}from"./react-Dz5erZcn.js";import{aB as re,fh as Q,fi as ie,fj as Se,fk as Tt,bi as de,b_ as be,fl as Xe,fm as Ye,fn as Ft,fo as ze,fp as Ce,f2 as Lt,f3 as It,b6 as le,f5 as Ot,f6 as Dt,fq as Pt,fr as ce,f7 as Je,f8 as Ee,f9 as et,fs as $t,ft as W,fu as ue,fv as xe,fw as tt,a9 as Ve,bU as At,a$ as nt,fx as wt,aF as Ne,aE as Te,eX as Fe,aG as Le,dW as Rt,fy as Ie,bj as Oe,fz as qt,aa as _t,er as kt,es as Bt,et as Mt,eZ as De,fA as st,fB as ot,fC as at,fD as Pe,eR as $e,fE as Ae,fF as zt,A as he,af as Ut,ag as Kt,fG as Gt,ae as Qt,fH as Wt,fI as Ht,dO as Zt,fJ as we,fK as M,fL as me,fM as pe,fN as rt,fO as it,fP as Xt,fQ as dt,fR as lt,K as ct,fS as ut,fT as Yt,fU as xt,fV as oe,fW as ht,fX as mt,fY as Jt,fZ as en,f_ as tn,f$ as nn,ah as pt,aC as jt,g0 as ye,G as sn,g1 as on,ch as an}from"./index-BgbzL_hU.js";import{u as rn,a as dn,b as ln,S as cn,c as un,E as Ue}from"./ExpandableLabelSection-DEjhJK9b.js";import{bv as gt,bT as H,bU as Z,bV as F,bW as m,bX as X,bY as d,$ as je,cK as xn,cL as Re,bi as qe,cy as k,P as S,F as B,T as ge,l as Ke,bh as hn,bs as mn,ah as pn,dr as Y,bI as jn,bJ as gn,bK as yn,bR as Cn,bS as Ge,cG as yt,cF as Ct,bn as ft,ck as _e,ao as G,d2 as vt,d3 as ae,cI as St,c8 as fn,aC as ne,s as fe,aq as ve,j as bt,S as vn,cz as Sn,cA as R,cB as q,cC as _,bw as bn,bx as Qe,cY as En,cZ as se}from"./policy-filters-step-BD1DtLQD.js";import{u as I,h as V,i as Vn}from"./apollo-DfQf4W16.js";import{w as Nn}from"./lodash-DTYsuwI9.js";import"./timeWindows-jJwZwJb_.js";import"./VulnerabilitiesService-CGz8cQZE.js";const Tn=V`
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
`;function Fn({querySearchFilter:n,...t}){return I(Tn,{variables:{query:Q(n),pagination:re(t)}})}const Ln=V`
    query getTotalNodeCount {
        nodeCount
    }
`;function In(){var t;return((t=I(Ln).data)==null?void 0:t.nodeCount)??0}const On=[ie,Se,Tt],We={field:Se,direction:"desc",aggregateBy:{aggregateFunc:"max",distinct:"false"}};function Dn({querySearchFilter:n,isFiltered:t,pagination:s,selectedCves:r,createRowActions:o,canSelectRows:a,sortOption:h,getSortParams:c,onClearFilters:i}){var D;const{page:g,perPage:x}=s,{data:y,previousData:j,loading:C,error:b}=Fn({querySearchFilter:n,page:g,perPage:x,sortOption:h}),f=In(),l=y??j,v=de({isLoading:C,data:l==null?void 0:l.nodeCVEs,error:b,searchFilter:n}),T=be(),E=a?8:6,O=(D=n.SEVERITY)==null?void 0:D.map(N=>gt[N]).filter(Xe);return e.jsxs(H,{borders:v.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":C?"true":"false",children:[e.jsx(Z,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(Ye,{}),a&&e.jsx(Ft,{selectedCves:r}),e.jsx(m,{sort:c(ie),children:"CVE"}),e.jsxs(ze,{tooltip:"The number of nodes affected by this CVE, grouped by the severity of the CVE on each node",children:["Nodes by severity",t&&e.jsx(Ce,{})]}),e.jsx(m,{sort:c(Se,Lt),children:"Top CVSS"}),e.jsxs(ze,{tooltip:"Ratio of the number of nodes affected by this CVE to the total number of nodes",sort:c("Node ID",It),children:["Affected nodes",t&&e.jsx(Ce,{})]}),e.jsx(m,{children:"First discovered"}),a&&e.jsx(m,{screenReaderText:"Row actions"})]})}),e.jsx(le,{tableState:v,colSpan:E,emptyProps:{message:"No CVEs have been detected for nodes across your secured clusters"},filteredEmptyProps:{onClearFilters:i},renderer:({data:N})=>N.map((L,u)=>{const{cve:p,affectedNodeCountBySeverity:{critical:P,important:w,moderate:z,low:U,unknown:K},distroTuples:J,topCVSS:ee,affectedNodeCount:te,firstDiscoveredInSystem:$}=L,A=T.has(p),ke=Ot(J),Be=ke.length>0?ke[0].summary:"",Me=Dt(ee,J);return e.jsxs(X,{isExpanded:A,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:u,isExpanded:A,onToggle:()=>T.toggle(p)}}),a&&e.jsx(Pt,{selectedCves:r,rowIndex:u,item:{cve:p}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(je,{to:ce("CVE",p),children:p})}),e.jsx(d,{dataLabel:"Nodes by severity",children:e.jsx(Je,{criticalCount:P.total,importantCount:w.total,moderateCount:z.total,lowCount:U.total,unknownCount:K.total,filteredSeverities:O,entity:"node"})}),e.jsx(d,{dataLabel:"Top CVSS",children:e.jsx(Ee,{cvss:ee,scoreVersion:Me.length>0?Me.join("/"):void 0})}),e.jsxs(d,{dataLabel:"Affected nodes",children:[te," / ",f," affected nodes"]}),e.jsx(d,{dataLabel:"First discovered",children:e.jsx(et,{date:$})}),a&&e.jsx(d,{isActionCell:!0,children:e.jsx(xn,{items:o({cve:p})})})]}),e.jsxs(F,{isExpanded:A,children:[e.jsx(d,{}),e.jsx(d,{colSpan:E-1,children:e.jsx(Re,{children:Be?e.jsx(qe,{component:"p",children:Be}):e.jsx($t,{})})})]})]},p)})})]})}const Pn=V`
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
`;function $n({querySearchFilter:n,...t}){return I(Pn,{variables:{query:Q(n),pagination:re(t)}})}const An=[W,ue,xe,tt],He={field:W,direction:"asc"};function wn({querySearchFilter:n,isFiltered:t,pagination:s,sortOption:r,getSortParams:o,onClearFilters:a}){var f;const{page:h,perPage:c}=s,{data:i,previousData:g,loading:x,error:y}=$n({querySearchFilter:n,page:h,perPage:c,sortOption:r}),j=i??g,C=de({isLoading:x,data:j==null?void 0:j.nodes,error:y,searchFilter:n}),b=(f=n.SEVERITY)==null?void 0:f.map(l=>gt[l]).filter(Xe);return e.jsxs(H,{borders:C.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":x?"true":"false",children:[e.jsx(Z,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(m,{sort:o(W),children:"Node"}),e.jsxs(m,{children:["CVEs by severity",t&&e.jsx(Ce,{})]}),e.jsx(m,{sort:o(ue),children:"Cluster"}),e.jsx(m,{sort:o(xe),children:"Operating system"}),e.jsx(m,{sort:o(tt),children:"Scan time"})]})}),e.jsx(le,{tableState:C,colSpan:5,emptyProps:{message:"No CVEs have been reported for your scanned nodes"},filteredEmptyProps:{onClearFilters:a},renderer:({data:l})=>e.jsx(X,{children:l.map(v=>{const{id:T,name:E,nodeCVECountBySeverity:O,cluster:D,osImage:N,scanTime:L}=v,{critical:u,important:p,moderate:P,low:w,unknown:z}=O;return e.jsxs(F,{children:[e.jsx(d,{dataLabel:"Node",modifier:"nowrap",children:e.jsx(je,{to:ce("Node",T),children:e.jsx(k,{position:"middle",content:E})})}),e.jsx(d,{dataLabel:"CVEs by severity",children:e.jsx(Je,{criticalCount:u.total,importantCount:p.total,moderateCount:P.total,lowCount:w.total,unknownCount:z.total,filteredSeverities:b,entity:"node"})}),e.jsx(d,{dataLabel:"Cluster",modifier:"nowrap",children:e.jsx(k,{position:"middle",content:D.name})}),e.jsx(d,{dataLabel:"Operating system",modifier:"nowrap",children:e.jsx(k,{position:"middle",content:N})}),e.jsx(d,{dataLabel:"Scan time",children:e.jsx(et,{date:L})})]},T)})})})]})}const Rn=V`
    query getNodeCVEEntityCounts($query: String) {
        nodeCVECount(query: $query)
        nodeCount(query: $query)
    }
`;function qn(n){return I(Rn,{variables:{query:Q(n)}})}const _n=[st,ot,at,Pe];function kn(){var te;const n=Vn(),{analyticsTrack:t}=Ve(),s=$e(t),{isFeatureFlagEnabled:r}=At(),o=r("ROX_SCANNER_V4")&&r("ROX_NODE_INDEX_ENABLED"),[a]=nt("entityTab",wt),{searchFilter:h,setSearchFilter:c}=Ne(),i=Te(Fe),{sortOption:g,getSortParams:x,setSortOption:y}=Le({sortFields:a==="CVE"?On:An,defaultSortOption:a==="CVE"?We:He,onSort:()=>i.setPage(1)});Rt({destination:"node-cves",searchFilter:h,setSearchFilter:c,reapplyWhen:[a],onScopeApplied:()=>i.setPage(1)});const j=Ie(h),C=Oe(j),b=((te=j["CVE Snoozed"])==null?void 0:te[0])==="true",f=rn(),l=qt(),{snoozeModalOptions:v,setSnoozeModalOptions:T,snoozeActionCreator:E}=dn(),O=ln("Node"),{version:D}=_t();function N($){i.setPage(1),y($==="CVE"?We:He),t({event:Wt,properties:{type:$,page:"Overview"}})}Nt.useEffect(()=>{N(a)},[]);function L(){c({}),i.setPage(1)}const{data:u}=qn(j),p={CVE:(u==null?void 0:u.nodeCVECount)??0,Node:(u==null?void 0:u.nodeCount)??0},P=kt(),w=P==="v1"||P==="v2",z=Bt({enabled:w&&P==="v1",searchFilter:h,setSearchFilter:c,paginationSetPage:()=>i.setPage(1),storageScope:"node-cves",filterKind:"workload"}),U=Mt({enabled:w&&P==="v2",searchFilter:h,setSearchFilter:c,paginationSetPage:()=>i.setPage(1),storageScope:"node-cves",filterKind:"workload"}),K=P==="v2"?U:z,J=e.jsx(De,{searchFilter:h,searchFilterConfig:_n,defaultSearchFilterEntity:"Node",onFilterChange:($,A)=>{c($),i.setPage(1),s(Ae,A)},prefixToolbarItems:K.prefixToolbarItem??void 0,appliedFilterSuffix:K.appliedFilterSuffix??void 0}),ee=e.jsx(Ht,{entityTabs:["CVE","Node"],entityCounts:p,onChange:N});return e.jsxs(e.Fragment,{children:[v&&e.jsx(cn,{...v,onSuccess:($,A)=>{$==="SNOOZE"&&t({event:zt,properties:{type:"NODE",duration:A}}),n.cache.evict({fieldName:"nodeCVEs"}),n.cache.evict({fieldName:"nodeCVECount"}),n.cache.gc(),l.clear()},onClose:()=>T(null)}),e.jsx(he,{title:"Node CVEs Overview"}),e.jsx(S,{children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},grow:{default:"grow"},children:[e.jsxs(B,{direction:{default:"column"},grow:{default:"grow"},children:[e.jsx(ge,{headingLevel:"h1",children:"Node CVEs"}),e.jsx(Ke,{children:"Prioritize and manage scanned CVEs across nodes"})]}),e.jsx(Ke,{children:e.jsx(un,{searchFilter:h,setSearchFilter:c,snoozedCveCount:O})})]})}),o&&e.jsx(S,{children:e.jsx(hn,{isInline:!0,variant:"info",title:"Results may include Node CVEs obtained from Scanner V4",component:"p",children:e.jsx(Ut,{children:e.jsx("a",{href:Kt(D,"operating/managing-vulnerabilities#understanding-node-cves-scanner-v4_scan-rhcos-node-host"),target:"_blank",rel:"noopener noreferrer",children:"Read more about the differences between the node scanning results obtained with the StackRox Scanner and Scanner V4."})})})}),P==="v2"&&U.wysiwygAlert&&e.jsx(S,{children:U.wysiwygAlert}),e.jsxs(S,{isCenterAligned:!0,children:[e.jsx(Gt,{filterToolbar:J,entityToggleGroup:ee,pagination:i,tableRowCount:a==="CVE"?p.CVE:p.Node,isFiltered:C,children:f&&e.jsx(mn,{align:{default:"alignEnd"},children:e.jsx(Qt,{toggleText:"Bulk actions",isDisabled:l.size===0,children:e.jsx(pn,{onClick:()=>T({action:b?"UNSNOOZE":"SNOOZE",cveType:"NODE_CVE",cves:Array.from(l.values())}),children:b?"Unsnooze CVEs":"Snooze CVEs"},"bulk-snooze-cve")})})}),a==="CVE"&&e.jsx(Dn,{querySearchFilter:j,isFiltered:C,pagination:i,selectedCves:l,canSelectRows:f,createRowActions:E("NODE_CVE",b?"UNSNOOZE":"SNOOZE"),sortOption:g,getSortParams:x,onClearFilters:L}),a==="Node"&&e.jsx(wn,{querySearchFilter:j,isFiltered:C,pagination:i,sortOption:g,getSortParams:x,onClearFilters:L})]}),K.modalsFragment]})}function Bn(n,t){const s=Nn(n,r=>{var o,a;switch(t.field){case"Component":return(o=r.name)==null?void 0:o.toLowerCase();case"Type":return(a=r.source)==null?void 0:a.toLowerCase();default:return""}});return t.reversed&&s.reverse(),s}const Et=V`
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
`,Mn=["Component","Type"],zn={field:"Component",direction:"asc"};function Vt({data:n}){const{sortOption:t,getSortParams:s}=Zt({sortFields:Mn,defaultSortOption:zn}),r=Bn(n,t);return n.length===0?null:e.jsxs(H,{children:[e.jsx(Z,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(m,{sort:s("Component"),children:"Component"}),e.jsx(m,{children:"Version"}),e.jsx(m,{children:"CVE fixed in"}),e.jsx(m,{sort:s("Type"),children:"Type"})]})}),e.jsx(X,{children:r.map(({name:o,source:a,version:h,nodeVulnerabilities:c})=>{var g;const i=(g=c==null?void 0:c[0])==null?void 0:g.fixedByVersion;return e.jsxs(F,{children:[e.jsx(d,{dataLabel:"Component",children:o}),e.jsx(d,{dataLabel:"Version",children:h}),e.jsx(d,{dataLabel:"CVE fixed in",children:i||e.jsx(we,{isFixable:!1})}),e.jsx(d,{dataLabel:"Type",children:a})]},o)})})]})}const Un=[W,M,me,pe,ue,xe],Kn={field:M,direction:"desc"},Gn=V`
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
`;function Qn({tableState:n,getSortParams:t,onClearFilters:s}){const o=be();return e.jsxs(H,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(Z,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(m,{screenReaderText:"Row expansion"}),e.jsx(m,{sort:t(W),children:"Node"}),e.jsx(m,{sort:t(M),children:"CVE severity"}),e.jsx(m,{sort:t(me),children:"CVE status"}),e.jsx(m,{sort:t(pe),children:"CVSS"}),e.jsx(m,{sort:t(ue),children:"Cluster"}),e.jsx(m,{sort:t(xe),children:"Operating system"}),e.jsx(m,{children:"Affected components"})]})}),e.jsx(le,{tableState:n,colSpan:8,emptyProps:{message:"There are no nodes that are affected by this CVE"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((h,c)=>{const{id:i,name:g,nodeComponents:x}=h,y=o.has(i),j=x.flatMap(v=>v.nodeVulnerabilities),C=rt(j),b=it(j),{cvss:f,scoreVersion:l}=Xt(j);return e.jsxs(X,{isExpanded:y,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:c,isExpanded:y,onToggle:()=>o.toggle(i)}}),e.jsx(d,{dataLabel:"Node",children:e.jsx(je,{to:ce("Node",i),children:e.jsx(k,{position:"middle",content:g})})}),e.jsx(d,{dataLabel:"CVE severity",modifier:"nowrap",children:e.jsx(dt,{severity:C})}),e.jsx(d,{dataLabel:"CVE status",modifier:"nowrap",children:e.jsx(we,{isFixable:b})}),e.jsx(d,{dataLabel:"CVSS",modifier:"nowrap",children:e.jsx(Ee,{cvss:f,scoreVersion:l})}),e.jsx(d,{dataLabel:"Cluster",children:e.jsx(k,{position:"middle",content:h.cluster.name})}),e.jsx(d,{dataLabel:"Operating system",children:e.jsx(k,{position:"middle",content:h.osImage})}),e.jsx(d,{dataLabel:"Affected components",children:x.length===1?x[0].name:Y(x.length,"component")})]}),e.jsxs(F,{isExpanded:y,children:[e.jsx(d,{}),e.jsx(d,{colSpan:7,children:e.jsx(Re,{children:e.jsx(Vt,{data:x})})})]})]},i)})})]})}function Wn({affectedNodeCount:n,totalNodeCount:t,operatingSystemCount:s}){return e.jsxs(jn,{isCompact:!0,isFullHeight:!0,children:[e.jsx(gn,{children:"Affected nodes"}),e.jsx(yn,{children:e.jsxs(Cn,{children:[e.jsxs(Ge,{span:12,className:"pf-v6-u-pt-sm",children:[n," / ",t," affected nodes"]}),e.jsxs(Ge,{span:12,className:"pf-v6-u-pt-sm",children:[Y(s,"operating system")," affected"]})]})})]})}const Hn=V`
    ${Gn}
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
`;function es(n,t){const s=I(Jn,{variables:{cve:n,query:t}}),{data:r,previousData:o}=s,a=(r==null?void 0:r.nodeCount)??(o==null?void 0:o.nodeCount)??0;return{summaryDataRequest:s,nodeCount:a}}const ts=ut("Node",{entityTab:"CVE"}),ns=[st,at,Pe],Ze={affectedNodeCountBySeverity:{critical:{total:0},important:{total:0},moderate:{total:0},low:{total:0},unknown:{total:0}},distroTuples:[]};function ss(){const{analyticsTrack:n}=Ve(),t=$e(n),{searchFilter:s,setSearchFilter:r}=Ne(),o=Ie(s),{cveId:a}=yt(),h=`^${a}$`,c=Q({...o,CVE:[h]}),{page:i,perPage:g,setPage:x,setPerPage:y}=Te(Fe),{sortOption:j,getSortParams:C}=Le({sortFields:Un,defaultSortOption:Kn,onSort:()=>x(1)}),b=Oe(o),f=lt(o),{metadataRequest:l,cveData:v}=Yn(a),{summaryDataRequest:T,nodeCount:E}=es(a,c),{affectedNodesRequest:O,nodeData:D}=Zn({query:c,page:i,perPage:g,sortOption:j}),N=v==null?void 0:v.cve,L=de({isLoading:O.loading,error:O.error,data:D,searchFilter:o});return e.jsxs(e.Fragment,{children:[e.jsx(he,{title:`Node CVEs - NodeCVE ${N}`}),e.jsx(S,{type:"breadcrumb",children:e.jsxs(Ct,{children:[e.jsx(ct,{to:ts,children:"Node CVEs"}),e.jsx(ft,{isActive:!0,children:N??e.jsx(_e,{screenreaderText:"Loading CVE name",width:"200px"})})]})}),e.jsx(S,{children:e.jsx(Yt,{data:v})}),e.jsx(G,{component:"div"}),e.jsxs(S,{hasBodyWrapper:!1,children:[e.jsx(De,{searchFilter:s,searchFilterConfig:ns,defaultSearchFilterEntity:"Node",onFilterChange:(u,p)=>{r(u),x(1,"replace"),t(Ae,p)}}),e.jsxs(xt,{error:l.error,isLoading:l.loading,children:[e.jsx(oe,{data:T.data,loadingText:"Loading affected nodes summary",renderer:({data:u})=>e.jsx(Wn,{affectedNodeCount:E,totalNodeCount:u.totalNodeCount,operatingSystemCount:(u.nodeCVE??Ze).distroTuples.length})}),e.jsx(oe,{data:T.data,loadingText:"Loading affected nodes by CVE severity summary",renderer:({data:u})=>e.jsx(ht,{title:"Nodes by severity",severityCounts:(u.nodeCVE??Ze).affectedNodeCountBySeverity,hiddenSeverities:f})})]}),e.jsx(G,{component:"div"}),e.jsxs(vt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ae,{isFilled:!0,children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},children:[e.jsxs(ge,{headingLevel:"h2",children:[Y(E,"node")," affected"]}),b&&e.jsx(mt,{})]})}),e.jsx(ae,{children:e.jsx(St,{itemCount:E,perPage:g,page:i,onSetPage:(u,p)=>x(p),onPerPageSelect:(u,p)=>{y(p)}})})]}),e.jsx(Qn,{tableState:L,getSortParams:C,onClearFilters:()=>{r({}),x(1)}})]})]})}const os=V`
    fragment NodeMetadata on Node {
        id
        name
        osImage
        kubeletVersion
        kernelVersion
        scanTime
    }
`;function as({data:n}){if(!n)return e.jsx(Jt,{nameScreenreaderText:"Loading Node name",metadataScreenreaderText:"Loading Node metadata"});const t=n.scanTime?4:3;return e.jsxs(B,{direction:{default:"column"},alignItems:{default:"alignItemsFlexStart"},children:[e.jsx(ge,{headingLevel:"h1",children:n.name}),e.jsxs(fn,{numLabels:t,children:[e.jsxs(ne,{children:["OS: ",n.osImage]}),e.jsxs(ne,{children:["Kubelet: ",n.kubeletVersion]}),e.jsxs(ne,{children:["Kernel version: ",n.kernelVersion]}),n.scanTime&&e.jsxs(ne,{children:["Scan time: ",fe(n.scanTime)]})]})]})}const rs=[ie,M,me,pe],is={field:M,direction:"desc"},ds=V`
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
`;function ls({tableState:n,getSortParams:t,onClearFilters:s}){const o=be();return e.jsxs(H,{borders:n.type==="COMPLETE",variant:"compact","aria-live":"polite","aria-busy":n.type==="LOADING"?"true":"false",children:[e.jsx(Z,{noWrap:!0,children:e.jsxs(F,{children:[e.jsx(Ye,{}),e.jsx(m,{sort:t(ie),children:"CVE"}),e.jsx(m,{sort:t(M),children:"Top severity"}),e.jsx(m,{sort:t(me),children:"CVE status"}),e.jsx(m,{sort:t(pe),children:"CVSS"}),e.jsx(m,{children:"Affected components"})]})}),e.jsx(le,{tableState:n,colSpan:6,emptyProps:{message:"No CVEs were detected for this node"},filteredEmptyProps:{onClearFilters:s},renderer:({data:a})=>a.map((h,c)=>{const{cve:i,cvss:g,scoreVersion:x,nodeComponents:y}=h,j=y.flatMap(l=>l.nodeVulnerabilities),C=rt(j),b=it(j),f=o.has(i);return e.jsxs(X,{isExpanded:f,children:[e.jsxs(F,{children:[e.jsx(d,{expand:{rowIndex:c,isExpanded:f,onToggle:()=>o.toggle(i)}}),e.jsx(d,{dataLabel:"CVE",modifier:"nowrap",children:e.jsx(je,{to:ce("CVE",i),children:i})}),e.jsx(d,{dataLabel:"Top severity",children:e.jsx(dt,{severity:C})}),e.jsx(d,{dataLabel:"CVE status",children:e.jsx(we,{isFixable:b})}),e.jsx(d,{dataLabel:"CVSS",children:e.jsx(Ee,{cvss:g,scoreVersion:x})}),e.jsx(d,{dataLabel:"Affected components",children:y.length===1?y[0].name:Y(y.length,"component")})]}),e.jsxs(F,{isExpanded:f,children:[e.jsx(d,{}),e.jsx(d,{colSpan:5,children:e.jsx(Re,{children:e.jsx(Vt,{data:y})})})]})]},i)})})]})}const cs=V`
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
`;function hs(n,t){return I(xs,{variables:{id:n,query:t}})}const ms=[ot,Pe];function ps({nodeId:n}){var N,L;const{analyticsTrack:t}=Ve(),s=$e(t),{searchFilter:r,setSearchFilter:o}=Ne(),a=Ie(r),h=Q(a),c=Oe(a),{page:i,perPage:g,setPage:x,setPerPage:y}=Te(Fe),{sortOption:j,getSortParams:C}=Le({sortFields:rs,defaultSortOption:is,onSort:()=>x(1,"replace")}),b=lt(a),f=tn(a),{data:l,loading:v,error:T}=us({nodeId:n,query:h,page:i,perPage:g,sortOption:j}),E=hs(n,h),O=((N=l==null?void 0:l.node)==null?void 0:N.nodeVulnerabilityCount)??0,D=de({isLoading:v,error:T,data:(L=l==null?void 0:l.node)==null?void 0:L.nodeVulnerabilities,searchFilter:a});return e.jsxs(e.Fragment,{children:[e.jsx(S,{children:e.jsx(qe,{component:"p",children:"Review and triage vulnerability data scanned on this node"})}),e.jsx(G,{component:"div"}),e.jsxs(S,{hasBodyWrapper:!1,isFilled:!0,children:[e.jsx(De,{searchFilter:r,searchFilterConfig:ms,defaultSearchFilterEntity:"CVE",onFilterChange:(u,p)=>{o(u),x(1,"replace"),s(Ae,p)}}),e.jsxs(xt,{isLoading:E.loading,error:E.error,children:[e.jsx(oe,{loadingText:"Loading node CVEs by severity summary",data:E.data,renderer:({data:u})=>e.jsx(ht,{title:"CVEs by severity",severityCounts:u.node.nodeCVECountBySeverity,hiddenSeverities:b})}),e.jsx(oe,{loadingText:"Loading node CVEs by status summary",data:E.data,renderer:({data:u})=>e.jsx(nn,{cveStatusCounts:u.node.nodeCVECountBySeverity,hiddenStatuses:f})})]}),e.jsx(G,{component:"div"}),e.jsxs(vt,{hasGutter:!0,className:"pf-v6-u-align-items-baseline",children:[e.jsx(ae,{isFilled:!0,children:e.jsxs(B,{alignItems:{default:"alignItemsCenter"},children:[e.jsx(ge,{headingLevel:"h2",children:l&&l.node?`${Y(l.node.nodeVulnerabilityCount,"result")} found`:e.jsx(_e,{screenreaderText:"Loading node vulnerability count"})}),c&&e.jsx(mt,{})]})}),e.jsx(ae,{children:e.jsx(St,{itemCount:O,perPage:g,page:i,onSetPage:(u,p)=>x(p),onPerPageSelect:(u,p)=>{y(p)}})})]}),e.jsx(ls,{tableState:D,getSortParams:C,onClearFilters:()=>{o({}),x(1)}})]})]})}const js=V`
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
`;function gs(n){return I(js,{variables:{id:n}})}function ys({nodeId:n}){const{data:t,loading:s,error:r}=gs(n);return e.jsxs(e.Fragment,{children:[e.jsx(S,{component:"div",children:e.jsx(qe,{component:"p",children:"View details about this node"})}),e.jsx(G,{component:"div"}),e.jsx(S,{isFilled:!0,children:r?e.jsx(ve,{children:e.jsx(pt,{title:"There was an error loading the node details",headingLevel:"h2",icon:bt,status:"danger",children:jt(r)})}):s?e.jsx(ve,{children:e.jsx(vn,{size:"xl"})}):t&&e.jsxs(B,{direction:{default:"column"},spaceItems:{default:"spaceItemsXl"},children:[e.jsxs(Sn,{columnModifier:{default:"1Col",lg:"2Col"},children:[e.jsxs(R,{children:[e.jsx(q,{children:"Cluster"}),e.jsx(_,{children:t.node.cluster.name})]}),t.node.containerRuntimeVersion&&e.jsxs(R,{children:[e.jsx(q,{children:"Container runtime"}),e.jsx(_,{children:t.node.containerRuntimeVersion})]}),t.node.joinedAt&&e.jsxs(R,{children:[e.jsx(q,{children:"Join time"}),e.jsx(_,{children:fe(t.node.joinedAt)})]}),t.node.scanTime&&e.jsxs(R,{children:[e.jsx(q,{children:"Scan time"}),e.jsx(_,{children:fe(t.node.scanTime)})]}),t.node.kernelVersion&&e.jsxs(R,{children:[e.jsx(q,{children:"Kernel version"}),e.jsx(_,{children:t.node.kernelVersion})]}),t.node.kubeletVersion&&e.jsxs(R,{children:[e.jsx(q,{children:"Kubelet"}),e.jsx(_,{children:t.node.kubeletVersion})]})]}),e.jsx(Ue,{toggleText:"Labels",labels:t.node.labels}),e.jsx(Ue,{toggleText:"Annotations",labels:t.node.annotations})]})})]})}const Cs="NodePageDetails",fs="NodePageVulnerabilities",vs=ut("Node",{entityTab:"Node"}),Ss=V`
    ${os}
    query getNodeMetadata($id: ID!) {
        node(id: $id) {
            ...NodeMetadata
        }
    }
`;function bs(){var i;const{nodeId:n}=yt(),{data:t,error:s}=I(Ss,{variables:{id:n}}),[r,o]=nt("detailsTab",ye),a=ye[0],h=ye[1],c=((i=t==null?void 0:t.node)==null?void 0:i.name)??"-";return e.jsxs(e.Fragment,{children:[e.jsx(he,{title:`Node CVEs - Node ${c}`}),e.jsx(S,{type:"breadcrumb",children:e.jsxs(Ct,{children:[e.jsx(ct,{to:vs,children:"Nodes"}),e.jsx(ft,{isActive:!0,children:c??e.jsx(_e,{screenreaderText:"Loading Node name",width:"200px"})})]})}),s?e.jsx(S,{children:e.jsx(ve,{children:e.jsx(pt,{title:jt(s),headingLevel:"h2",icon:bt,status:"danger"})})}):e.jsxs(e.Fragment,{children:[e.jsx(S,{children:e.jsx(as,{data:t==null?void 0:t.node})}),e.jsx(S,{type:"tabs",children:e.jsxs(bn,{activeKey:r,onSelect:(g,x)=>{o(x)},usePageInsets:!0,mountOnEnter:!0,unmountOnExit:!0,children:[e.jsx(Qe,{eventKey:a,tabContentId:fs,title:a,children:e.jsx(ps,{nodeId:n})}),e.jsx(Qe,{eventKey:h,tabContentId:Cs,title:h,children:e.jsx(ys,{nodeId:n})})]})})]})]})}function Ds(){const{hasReadAccess:n}=sn(),t=n("Integration");return e.jsxs(e.Fragment,{children:[t&&e.jsx(on,{}),e.jsxs(En,{children:[e.jsx(se,{index:!0,element:e.jsx(kn,{})}),e.jsx(se,{path:"cves/:cveId",element:e.jsx(ss,{})}),e.jsx(se,{path:"nodes/:nodeId",element:e.jsx(bs,{})}),e.jsx(se,{path:"*",element:e.jsxs(S,{hasBodyWrapper:!1,children:[e.jsx(he,{title:"Node CVEs - Not Found"}),e.jsx(an,{})]})})]})]})}export{Ds as default};
