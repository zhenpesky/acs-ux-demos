var Rn=Object.defineProperty;var wn=(a,e,r)=>e in a?Rn(a,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):a[e]=r;var ae=(a,e,r)=>wn(a,typeof e!="symbol"?e+"":e,r);import{t as Dn,f3 as p,ah as nt,a8 as _n}from"./index-DA19o8a3.js";import{g as y}from"./apollo-5UyS4iZ6.js";import{c as An}from"./controls-BJ5j9MsT.js";import{n as Fn,c as f,r as rt,P as o,k as zn}from"./redoc-DSdxMpMR.js";import{g as _t}from"./lodash-JMWJiBov.js";const At=a=>{if(!a)return a;const e={};return Object.keys(a).forEach(r=>{if(Object.prototype.hasOwnProperty.call(a,r))if(typeof a[r]=="object"&&!Array.isArray(a[r])){const t=At(a[r]);t&&Object.keys(t).forEach(n=>{Object.prototype.hasOwnProperty.call(t,n)&&(e[`${r}.${n}`]=t[n])})}else e[r]=a[r]}),e},Ft=y`
    fragment nodeFields on Node {
        id
        name
        clusterId
        clusterName
        containerRuntimeVersion
        externalIpAddresses
        internalIpAddresses
        joinedAt
        kernelVersion
        osImage
        nodeStatus
        priority
        scan {
            scanTime
        }
        labels {
            key
            value
        }
        annotations {
            key
            value
        }
        nodeComplianceControlCount(query: "Standard:CIS") {
            failingCount
            passingCount
            unknownCount
        }
    }
`;y`
    query nodes($query: String) {
        results: nodes(query: $query) {
            id
            name
            clusterName
            clusterId
            osImage
            containerRuntimeVersion
            joinedAt
            complianceResults {
                resource {
                    __typename
                }
                control {
                    id
                }
            }
        }
    }
`;const or=y`
    query getNode($id: ID!) {
        node(id: $id) {
            ...nodeFields
        }
    }
    ${Ft}
`;y`
    query getNodesByCluster($id: ID!) {
        results: cluster(id: $id) {
            id
            name
            nodes {
                id
                name
            }
        }
    }
`;const ir=y`
    query getNodeName($id: ID!) {
        node(id: $id) {
            id
            name
        }
    }
`;y`
    query compliance {
        aggregatedResults(groupBy: [STANDARD, NODE], unit: CONTROL) {
            results {
                aggregationKeys {
                    id
                }
                numFailing
                numPassing
                numSkipped
                unit
            }
        }
    }
`;const Vn=y`
    fragment deploymentFields on Deployment {
        id
        annotations {
            key
            value
        }
        clusterId
        clusterName
        hostNetwork: id
        imagePullSecrets
        inactive
        labels {
            key
            value
        }
        name
        namespace
        namespaceId
        ports {
            containerPort
            exposedPort
            exposure
            exposureInfos {
                externalHostnames
                externalIps
                level
                nodePort
                serviceClusterIp
                serviceId
                serviceName
                servicePort
            }
            name
            protocol
        }
        priority
        replicas
        serviceAccount
        serviceAccountID
        failingPolicies(query: $query) {
            id
            name
        }
        policyStatus(query: $query)
        tolerations {
            key
            operator
            taintEffect
            value
        }
        type
        created
        secretCount
        imageCount
    }
`,sr=y`
    query getDeployment($id: ID!) {
        deployment(id: $id) {
            id
            name
        }
    }
`,lr=y`
    query deployments($query: String, $pagination: Pagination) {
        results: deployments(query: $query, pagination: $pagination) {
            id
            name
            clusterName
            clusterId
            namespace
            namespaceId
            serviceAccount
            serviceAccountID
            secretCount
            imageCount
            policyStatus
        }
        count: deploymentCount(query: $query)
    }
`,at=y`
    fragment namespaceFields on Namespace {
        metadata {
            name
            id
            clusterId
            clusterName
            labels {
                key
                value
            }
        }
        numSecrets: secretCount
        imageCount
        policyCount
        k8sRoleCount
        serviceAccountCount
        subjectCount
        policyStatus {
            status
            failingPolicies {
                id
                name
            }
        }
    }
`;y`
    query namespaces($query: String) {
        results: namespaces(query: $query) {
            ...namespaceFields
        }
    }
    ${at}
`;const Mn=y`
    fragment namespaceNoPoliciesFields on Namespace {
        metadata {
            name
            id
            clusterId
            clusterName
            labels {
                key
                value
            }
        }
        numSecrets: secretCount
        k8sRoleCount
        serviceAccountCount
        subjectCount
        policyStatus {
            status
        }
    }
`,ur=y`
    query namespaces($query: String, $pagination: Pagination) {
        results: namespaces(query: $query, pagination: $pagination) {
            ...namespaceNoPoliciesFields
        }
        count: namespaceCount(query: $query)
    }
    ${Mn}
`,dr=y`
    query getNamespaceName($id: ID!) {
        namespace(id: $id) {
            metadata {
                name
                id
            }
        }
    }
`,In=y`
    fragment subjectWithClusterFields on Subject {
        id
        name
        subject {
            name
            kind
            namespace
        }
        type
        scopedPermissions {
            scope
            permissions {
                key
                values
            }
        }
        clusterAdmin
        k8sRoles {
            id
            name
        }
    }
`,qn=y`
    fragment subjectFields on Subject {
        id
        name
        kind
        namespace
        type
        clusterId
        clusterName
        clusterAdmin
        k8sRoles {
            id
            name
        }
        k8sRoleCount
    }
`,cr=y`
    query subjects($query: String, $pagination: Pagination) {
        results: subjects(query: $query, pagination: $pagination) {
            ...subjectFields
        }
        count: subjectCount(query: $query)
    }
    fragment subjectFields on Subject {
        id
        name
        kind
        namespace
        type
        clusterId
        clusterName
        clusterAdmin
        k8sRoles {
            id
            name
        }
        k8sRoleCount
    }
`,pr=y`
    query getSubjectName($id: ID!) {
        subject(id: $id) {
            name
        }
    }
`,zt=y`
    fragment k8RoleFields on K8SRole {
        id
        name
        type
        verbs
        createdAt
        roleNamespace {
            metadata {
                id
                name
            }
        }
        serviceAccounts {
            ... on ServiceAccount {
                id
                name
            }
        }
        subjects {
            name
        }
        clusterName
        clusterId
    }
`,fr=y`
    query k8sRole($id: ID!) {
        clusters {
            id
            k8sRole(role: $id) {
                id
                name
            }
        }
    }
`,mr=y`
    query roles($query: String, $pagination: Pagination) {
        results: k8sRoles(query: $query, pagination: $pagination) {
            ...k8RoleFields
        }
        count: k8sRoleCount(query: $query)
    }
    ${zt}
`,$n=y`
    fragment secretFields on Secret {
        id
        name
        createdAt
        files {
            name
            type
            metadata {
                __typename
                ... on Cert {
                    endDate
                    startDate
                    algorithm
                    issuer {
                        commonName
                        names
                    }
                    subject {
                        commonName
                        names
                    }
                    sans
                }
                ... on ImagePullSecret {
                    registries {
                        name
                        username
                    }
                }
            }
        }
        namespace
        deploymentCount(query: $query)
        labels {
            key
            value
        }
        annotations {
            key
            value
        }
        clusterName
        clusterId
    }
`,gr=y`
    query getSecretName($id: ID!) {
        secret(id: $id) {
            id
            name
        }
    }
`,hr=y`
    query secrets($query: String, $pagination: Pagination) {
        secrets(query: $query, pagination: $pagination) {
            id
            name
            createdAt
            files {
                type
            }
            namespace
            deploymentCount(query: $query)
            clusterName
            clusterId
        }
        count: secretCount(query: $query)
    }
`,kn=y`
    fragment serviceAccountFields on ServiceAccount {
        id
        name
        namespace
        saNamespace {
            metadata {
                id
                name
            }
        }
        clusterName
        clusterId
        clusterAdmin
        deploymentCount
        deployments {
            id
        }
        secrets
        k8sRoles {
            id
            name
        }
        automountToken
        createdAt
        labels {
            key
            value
        }
        annotations {
            key
            value
        }
        imagePullSecrets
        scopedPermissions {
            scope
            permissions {
                key
                values
            }
        }
    }
`,yr=y`
    query serviceaccounts($query: String, $pagination: Pagination) {
        results: serviceAccounts(query: $query, pagination: $pagination) {
            id
            name
            clusterAdmin
            namespace
            saNamespace {
                metadata {
                    id
                    name
                }
            }
            clusterName
            clusterId
            k8sRoles {
                id
                name
            }
            deploymentCount
        }
        count: serviceAccountCount(query: $query)
    }
`,vr=y`
    query getServiceAccountName($id: ID!) {
        serviceAccount(id: $id) {
            id
            name
        }
    }
`,Ln=y`
    fragment policyFields on Policy {
        id
        name
        description
        lifecycleStages
        categories
        disabled
        enforcementActions
        fields {
            cve
        }
        notifiers
        rationale
        remediation
        scope {
            cluster
            label {
                key
                value
            }
            namespace
        }
        severity
        policyStatus
        exclusions {
            expiration
        }
    }
`,Cr=y`
    query getPolicyName($id: ID!) {
        policy(id: $id) {
            id
            name
        }
    }
`,Pr=y`
    query policies($query: String, $pagination: Pagination) {
        policies(query: $query, pagination: $pagination) {
            id
            name
            enforcementActions
            policyStatus
            severity
            categories
            lifecycleStages
            disabled
        }
        count: policyCount(query: $query)
    }
`,jn=y`
    fragment imageFields on Image {
        id
        lastUpdated
        deployments {
            id
            name
        }
        metadata {
            layerShas
            v1 {
                created
                layers {
                    instruction
                    created
                    value
                }
            }
            v2 {
                digest
            }
        }
        name {
            fullName
            registry
            remote
            tag
        }
        scan {
            imageComponents {
                name
                layerIndex
                version
                imageVulnerabilities {
                    cve
                    cvss
                    link
                    summary
                }
            }
        }
    }
`,br=y`
    query getImageName($id: ID!) {
        image(id: $id) {
            id
            name {
                fullName
            }
        }
    }
`,Tr=y`
    query images($query: String, $pagination: Pagination) {
        images(query: $query, pagination: $pagination) {
            id
            lastUpdated
            metadata {
                layerShas
                v1 {
                    created
                }
                v2 {
                    digest
                }
            }
            name {
                fullName
                registry
                remote
                tag
            }
            deployments {
                id
                name
            }
        }
        count: imageCount(query: $query)
    }
`,Gn=y`
    fragment clusterFields on Cluster {
        id
        name
        imageVulnerabilityCounter {
            all {
                fixable
                total
            }
            critical {
                fixable
                total
            }
            important {
                fixable
                total
            }
            moderate {
                fixable
                total
            }
            low {
                fixable
                total
            }
        }
        nodeVulnerabilityCounter {
            all {
                fixable
                total
            }
            critical {
                fixable
                total
            }
            important {
                fixable
                total
            }
            moderate {
                fixable
                total
            }
            low {
                fixable
                total
            }
        }
        clusterVulnerabilityCounter {
            all {
                fixable
                total
            }
            critical {
                fixable
                total
            }
            important {
                fixable
                total
            }
            moderate {
                fixable
                total
            }
            low {
                fixable
                total
            }
        }
        status {
            orchestratorMetadata {
                version
            }
        }
        # createdAt
        namespaceCount
        deploymentCount
        nodeCount
        # policyCount(query: $policyQuery) # see https://stack-rox.atlassian.net/browse/ROX-4080
        policyStatus(query: $policyQuery) {
            status
        }
        latestViolation(query: $policyQuery)
        priority
    }
`,Er=y`
    fragment cveFields on ImageVulnerability {
        id
        cve
        cvss
        severity
        scoreVersion
        summary
        fixedByVersion
        isFixable(query: $scopeQuery)
    }
`,Nr=y`
    fragment cveFields on EmbeddedVulnerability {
        id
        cve
        vulnerabilityTypes
        envImpact
        cvss
        scoreVersion
        link # for View on NVD website
        vectors {
            __typename
            ... on CVSSV2 {
                impactScore
                exploitabilityScore
                vector
            }
            ... on CVSSV3 {
                impactScore
                exploitabilityScore
                vector
            }
        }
        publishedOn
        lastModified
        summary
        fixedByVersion
        isFixable(query: $scopeQuery)
        createdAt
        componentCount(query: $query)
        imageCount(query: $query)
        deploymentCount(query: $query)
        nodeCount(query: $query)
    }
`,Sr=y`
    fragment cveFields on ImageVulnerability {
        createdAt
        cve
        cvss
        envImpact
        fixedByVersion
        id
        impactScore
        isFixable(query: $scopeQuery)
        scoreVersion
        lastModified
        lastScanned
        link
        publishedOn
        scoreVersion
        severity
        summary
        vectors {
            __typename
            ... on CVSSV2 {
                impactScore
                exploitabilityScore
                vector
            }
            ... on CVSSV3 {
                impactScore
                exploitabilityScore
                vector
            }
        }
        vulnerabilityState
        imageComponentCount(query: $query)
        deploymentCount(query: $query)
        discoveredAtImage(query: $query)
        imageCount(query: $query)
        operatingSystem
    }
`,xr=y`
    fragment cveFields on NodeVulnerability {
        createdAt
        cve
        cvss
        envImpact
        fixedByVersion
        id
        impactScore
        isFixable(query: $scopeQuery)
        scoreVersion
        lastModified
        lastScanned
        link
        publishedOn
        scoreVersion
        severity
        summary
        vectors {
            __typename
            ... on CVSSV2 {
                impactScore
                exploitabilityScore
                vector
            }
            ... on CVSSV3 {
                impactScore
                exploitabilityScore
                vector
            }
        }
        nodeComponentCount(query: $query)
        nodeCount(query: $query)
        operatingSystem
    }
`,Or=y`
    fragment cveFields on ClusterVulnerability {
        clusterCount(query: $query)
        createdAt
        cve
        cvss
        envImpact
        fixedByVersion
        id
        impactScore
        isFixable(query: $scopeQuery)
        scoreVersion
        lastModified
        lastScanned
        link
        publishedOn
        scoreVersion
        severity
        summary
        unusedVarSink(query: $query)
        vectors {
            __typename
            ... on CVSSV2 {
                impactScore
                exploitabilityScore
                vector
            }
            ... on CVSSV3 {
                impactScore
                exploitabilityScore
                vector
            }
        }
        vulnerabilityType
        vulnerabilityTypes
    }
`,Rr=y`
    fragment imageCVEFields on ImageVulnerability {
        createdAt
        cve
        cvss
        scoreVersion
        envImpact
        fixedByVersion
        id
        impactScore
        isFixable(query: $scopeQuery)
        lastModified
        lastScanned
        link
        operatingSystem
        publishedOn
        severity
        summary
        discoveredAtImage(query: $scopeQuery)
        deploymentCount(query: $query)
        imageCount(query: $query)
        componentCount: imageComponentCount(query: $query)
    }
`,Wn=y`
    fragment clusterCVEFields on ClusterVulnerability {
        clusterCount(query: $query)
        createdAt
        cve
        cvss
        envImpact
        fixedByVersion
        id
        impactScore
        isFixable(query: $scopeQuery)
        lastModified
        lastScanned
        link
        publishedOn
        scoreVersion
        severity
        summary
        suppressActivation
        suppressExpiry
        suppressed
        vulnerabilityType
        vulnerabilityTypes
    }
`,Et=y`
    fragment nodeCVEFields on NodeVulnerability {
        createdAt
        cve
        cvss
        envImpact
        fixedByVersion
        id
        impactScore
        isFixable(query: $scopeQuery)
        lastModified
        lastScanned
        link
        publishedOn
        scoreVersion
        severity
        summary
        suppressActivation
        suppressExpiry
        suppressed
        componentCount: nodeComponentCount
        nodeCount
        operatingSystem
    }
`,Nt=y`
    fragment imageCVEFields on ImageVulnerability {
        createdAt
        cve
        cvss
        discoveredAtImage
        envImpact
        fixedByVersion
        id
        impactScore
        isFixable(query: $scopeQuery)
        lastModified
        lastScanned
        link
        operatingSystem
        publishedOn
        scoreVersion
        severity
        summary
        suppressActivation
        suppressExpiry
        suppressed
        vulnerabilityState
        componentCount: imageComponentCount
        imageCount
        deploymentCount
    }
`,Kn=y`
    fragment deploymentFields on Deployment {
        id
        name
        imageVulnerabilityCounter {
            all {
                total
                fixable
            }
            low {
                total
                fixable
            }
            moderate {
                total
                fixable
            }
            important {
                total
                fixable
            }
            critical {
                total
                fixable
            }
        }
        deployAlerts {
            policy {
                id
            }
            time
        }
        # policyCount(query: $policyQuery) # see https://stack-rox.atlassian.net/browse/ROX-4080
        # failingPolicyCount(query: $policyQuery) # see https://stack-rox.atlassian.net/browse/ROX-4080
        policyStatus(query: $policyQuery)
        clusterName
        clusterId
        namespace
        namespaceId
        imageCount
        latestViolation(query: $policyQuery)
        priority
        images {
            scan {
                scanTime
            }
        }
    }
`,Un=y`
    fragment nodeFields on Node {
        id
        name
        vulnCounter: nodeVulnerabilityCounter {
            all {
                total
                fixable
            }
            low {
                total
                fixable
            }
            moderate {
                total
                fixable
            }
            important {
                total
                fixable
            }
            critical {
                total
                fixable
            }
        }
        topVuln: topNodeVulnerability {
            cvss
            scoreVersion
        }
        notes
        scan {
            scanTime
            notes
        }
        osImage
        containerRuntimeVersion
        clusterName
        clusterId
        joinedAt
        priority
    }
`,Bn=y`
    fragment imageFields on Image {
        id
        name {
            fullName
        }
        watchStatus
        deploymentCount(query: $query)
        priority
        topVuln: topImageVulnerability {
            cvss
            scoreVersion
        }
        metadata {
            v1 {
                created
            }
        }
        componentCount: imageComponentCount(query: $query)
        notes
        scanTime
        operatingSystem
        scanNotes
        vulnCounter: imageVulnerabilityCounter {
            all {
                total
                fixable
            }
            low {
                total
                fixable
            }
            moderate {
                total
                fixable
            }
            important {
                total
                fixable
            }
            critical {
                total
                fixable
            }
        }
    }
`,wr=y`
    fragment componentFields on EmbeddedImageScanComponent {
        id
        name
        version
        location
        source
        fixedIn
        vulnCounter {
            all {
                total
                fixable
            }
            low {
                total
                fixable
            }
            moderate {
                total
                fixable
            }
            important {
                total
                fixable
            }
            critical {
                total
                fixable
            }
        }
        topVuln {
            cvss
            scoreVersion
        }
        imageCount(query: $query)
        deploymentCount(query: $query)
        nodeCount(query: $query)
        priority
    }
`,Hn=y`
    fragment nodeComponentFields on NodeComponent {
        id
        name
        version
        location
        source
        vulnCounter: nodeVulnerabilityCounter {
            all {
                total
                fixable
            }
            low {
                total
                fixable
            }
            moderate {
                total
                fixable
            }
            important {
                total
                fixable
            }
            critical {
                total
                fixable
            }
        }
        topVuln: topNodeVulnerability {
            cvss
            scoreVersion
        }
        nodeCount(query: $query)
        priority
        operatingSystem
    }
`,Jn=y`
    fragment imageComponentFields on ImageComponent {
        id
        name
        version
        location
        source
        fixedIn
        vulnCounter: imageVulnerabilityCounter {
            all {
                total
                fixable
            }
            low {
                total
                fixable
            }
            moderate {
                total
                fixable
            }
            important {
                total
                fixable
            }
            critical {
                total
                fixable
            }
        }
        topVuln: topImageVulnerability {
            cvss
            scoreVersion
        }
        imageCount(query: $query)
        deploymentCount(query: $query)
        priority
        operatingSystem
    }
`,Dr=y`
    fragment imageComponentFields on ImageComponent {
        id
        name
        version
        location
        source
        fixedIn
        vulnCounter: imageVulnerabilityCounter {
            all {
                total
                fixable
            }
            low {
                total
                fixable
            }
            moderate {
                total
                fixable
            }
            important {
                total
                fixable
            }
            critical {
                total
                fixable
            }
        }
        topVuln: topImageVulnerability {
            cvss
            scoreVersion
        }
        imageCount(query: $query)
        deploymentCount(query: $query)
        operatingSystem
        priority
    }
`,Qn=y`
    fragment namespaceFields on Namespace {
        metadata {
            id
            clusterName
            clusterId
            priority
            name
        }
        imageVulnerabilityCounter {
            all {
                fixable
                total
            }
            critical {
                fixable
                total
            }
            important {
                fixable
                total
            }
            moderate {
                fixable
                total
            }
            low {
                fixable
                total
            }
        }
        deploymentCount
        imageCount(query: $query)
        # policyCount(query: $policyQuery) # see https://stack-rox.atlassian.net/browse/ROX-4080
        policyStatusOnly(query: $policyQuery)
        latestViolation(query: $policyQuery)
    }
`,_r=y`
    fragment policyFields on Policy {
        id
        name
        description
        disabled
        rationale
        remediation
        severity
        policyStatus
        categories
        lastUpdated
        enforcementActions
        lifecycleStages
        isDefault
        policySections {
            sectionName
            policyGroups {
                fieldName
                values {
                    value
                }
            }
        }
        scope {
            cluster
            label {
                key
                value
            }
            namespace
        }
        exclusions {
            deployment {
                name
                scope {
                    cluster
                    label {
                        key
                        value
                    }
                    namespace
                }
            }
            expiration
            image {
                name
            }
            name
        }
    }
`;var Yn=Fn();const _=_t(Yn);var Xn=Object.assign||function(a){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(a[t]=r[t])}return a};function Vt(a,e){var r={};for(var t in a)e.indexOf(t)>=0||Object.prototype.hasOwnProperty.call(a,t)&&(r[t]=a[t]);return r}const l={get:Zn,set:ea,takeRight:ta,last:na,orderBy:ra,range:aa,remove:oa,clone:ia,getFirstDefined:sa,sum:la,makeTemplateComponent:ua,groupBy:da,isArray:ot,splitProps:pa,compactObject:fa,isSortingDesc:ma,normalizeComponent:ga,asPx:ca};function Zn(a,e,r){if(!e)return a;var t=Mt(e),n=void 0;try{n=t.reduce(function(s,d){return s[d]},a)}catch{}return typeof n<"u"?n:r}function ea(){for(var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=arguments[1],r=arguments[2],t=Mt(e),n=void 0,s=a;(n=t.shift())&&t.length;)s[n]||(s[n]={}),s=s[n];return s[n]=r,a}function ta(a,e){var r=e>a.length?0:a.length-e;return a.slice(r)}function na(a){return a[a.length-1]}function aa(a){for(var e=[],r=0;r<a;r+=1)e.push(a);return e}function ra(a,e,r,t){return a.sort(function(n,s){for(var d=0;d<e.length;d+=1){var c=e[d],u=r[d]===!1||r[d]==="desc",m=c(n,s);if(m)return u?-m:m}return r[0]?n[t]-s[t]:s[t]-n[t]})}function oa(a,e){return a.filter(function(r,t){var n=e(r);return n?(a.splice(t,1),!0):!1})}function ia(a){try{return JSON.parse(JSON.stringify(a,function(e,r){return typeof r=="function"?r.toString():r}))}catch{return a}}function sa(){for(var a=0;a<arguments.length;a+=1)if(typeof(arguments.length<=a?void 0:arguments[a])<"u")return arguments.length<=a?void 0:arguments[a]}function la(a){return a.reduce(function(e,r){return e+r},0)}function ua(a,e){if(!e)throw new Error("No displayName found for template component:",a);var r=function(n){var s=n.children,d=n.className,c=Vt(n,["children","className"]);return f.createElement("div",Xn({className:_(a,d)},c),s)};return r.displayName=e,r}function da(a,e){return a.reduce(function(r,t,n){var s=typeof e=="function"?e(t,n):t[e];return r[s]=ot(r[s])?r[s]:[],r[s].push(t),r},{})}function ca(a){return a=Number(a),Number.isNaN(a)?null:a+"px"}function ot(a){return Array.isArray(a)}function Mt(a){return It(a).join(".").replace(/\[/g,".").replace(/\]/g,"").split(".")}function It(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];if(!ot(a))e.push(a);else for(var r=0;r<a.length;r+=1)It(a[r],e);return e}function pa(a){var e=a.className,r=a.style,t=Vt(a,["className","style"]);return{className:e,style:r,rest:t||{}}}function fa(a){var e={};return a&&Object.keys(a).map(function(r){return Object.prototype.hasOwnProperty.call(a,r)&&a[r]!==void 0&&typeof a[r]<"u"&&(e[r]=a[r]),!0}),e}function ma(a){return a.sort==="desc"||a.desc===!0||a.asc===!1}function ga(a,e){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:a;return va(a)?f.createElement(a,e):typeof a=="function"?a(e):r}function ha(a){return typeof a=="function"&&!!Object.getPrototypeOf(a).isReactComponent}function ya(a){return typeof a=="function"&&String(a).includes(".createElement")}function va(a){return ha(a)||ya(a)}var Ca=function(){function a(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&a(e.prototype,r),t&&a(e,t),e}}();function Pa(a,e){if(!(a instanceof e))throw new TypeError("Cannot call a class as a function")}function ba(a,e){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:a}function Ta(a,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);a.prototype=Object.create(e&&e.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(a,e):a.__proto__=e)}const Ea=function(a){return function(e){Ta(r,e);function r(){return Pa(this,r),ba(this,(r.__proto__||Object.getPrototypeOf(r)).apply(this,arguments))}return Ca(r,[{key:"UNSAFE_componentWillMount",value:function(){this.setStateWithData(this.getDataModel(this.getResolvedState(),!0))}},{key:"componentDidMount",value:function(){this.fireFetchData()}},{key:"UNSAFE_componentWillReceiveProps",value:function(n,s){var d=this.getResolvedState(),c=this.getResolvedState(n,s),u=["sorted","filtered","resized","expanded"];u.forEach(function(h){var T="default"+(h.charAt(0).toUpperCase()+h.slice(1));JSON.stringify(d[T])!==JSON.stringify(c[T])&&(c[h]=c[T])});var m=["sortable","filterable","resizable"];m.forEach(function(h){if(d[h]!==c[h]){var T=h.replace("able",""),O=T+"ed",E="default"+(O.charAt(0).toUpperCase()+O.slice(1));c[O]=c[E]}}),(d.data!==c.data||d.columns!==c.columns||d.pivotBy!==c.pivotBy||d.sorted!==c.sorted||d.filtered!==c.filtered)&&this.setStateWithData(this.getDataModel(c,d.data!==c.data))}},{key:"setStateWithData",value:function(n,s){var d=this,c=this.getResolvedState(),u=this.getResolvedState({},n),m=u.freezeWhenExpanded;if(u.frozen=!1,m){for(var h=Object.keys(u.expanded),T=0;T<h.length;T+=1)if(u.expanded[h[T]]){u.frozen=!0;break}}return(c.frozen&&!u.frozen||c.sorted!==u.sorted||c.filtered!==u.filtered||c.showFilters!==u.showFilters||!u.frozen&&c.resolvedData!==u.resolvedData)&&((c.sorted!==u.sorted&&this.props.collapseOnSortingChange||c.filtered!==u.filtered||c.showFilters!==u.showFilters||c.sortedData&&!u.frozen&&c.resolvedData!==u.resolvedData&&this.props.collapseOnDataChange)&&(u.expanded={}),Object.assign(u,this.getSortedData(u))),c.filtered!==u.filtered&&(u.page=0),u.sortedData&&(u.pages=u.manual?u.pages:Math.ceil(u.sortedData.length/u.pageSize),u.page=u.manual?u.page:Math.max(u.page>=u.pages?u.pages-1:u.page,0)),this.setState(u,function(){s&&s(),(c.page!==u.page||c.pageSize!==u.pageSize||c.sorted!==u.sorted||c.filtered!==u.filtered)&&d.fireFetchData()})}}]),r}(a)};var Na=function(){function a(e,r){var t=[],n=!0,s=!1,d=void 0;try{for(var c=e[Symbol.iterator](),u;!(n=(u=c.next()).done)&&(t.push(u.value),!(r&&t.length===r));n=!0);}catch(m){s=!0,d=m}finally{try{!n&&c.return&&c.return()}finally{if(s)throw d}}return t}return function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return a(e,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),ee=Object.assign||function(a){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(a[t]=r[t])}return a},Sa=function(){function a(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&a(e.prototype,r),t&&a(e,t),e}}();function H(a,e,r){return e in a?Object.defineProperty(a,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):a[e]=r,a}function St(a){if(Array.isArray(a)){for(var e=0,r=Array(a.length);e<a.length;e++)r[e]=a[e];return r}else return Array.from(a)}function xa(a,e){if(!(a instanceof e))throw new TypeError("Cannot call a class as a function")}function Oa(a,e){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:a}function Ra(a,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);a.prototype=Object.create(e&&e.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(a,e):a.__proto__=e)}const wa=function(a){return function(e){Ra(r,e);function r(){return xa(this,r),Oa(this,(r.__proto__||Object.getPrototypeOf(r)).apply(this,arguments))}return Sa(r,[{key:"getResolvedState",value:function(n,s){var d=ee({},l.compactObject(this.state),l.compactObject(this.props),l.compactObject(s),l.compactObject(n));return d}},{key:"getDataModel",value:function(n,s){var d=this,c=n.columns,u=n.pivotBy,m=u===void 0?[]:u,h=n.data,T=n.resolveData,O=n.pivotIDKey,E=n.pivotValKey,A=n.subRowsKey,G=n.aggregatedKey,W=n.nestingLevelKey,J=n.originalKey,$=n.indexKey,oe=n.groupedByPivotKey,ye=n.SubComponent,ie=!1;c.forEach(function(g){g.columns&&(ie=!0)});var ve=[].concat(St(c)),se=c.find(function(g){return g.expander||g.columns&&g.columns.some(function(N){return N.expander})});se&&!se.expander&&(se=se.columns.find(function(g){return g.expander})),ye&&!se&&(se={expander:!0},ve=[se].concat(St(ve)));var $e=function(N,F){var P=void 0;if(N.expander?P=ee({},d.props.column,d.props.expanderDefaults,N):P=ee({},d.props.column,N),P.maxWidth<P.minWidth&&(P.minWidth=P.maxWidth),F&&(P.parentColumn=F),typeof P.accessor=="string"){P.id=P.id||P.accessor;var Q=P.accessor;return P.accessor=function(j){return l.get(j,Q)},P}if(P.accessor&&!P.id)throw console.warn(P),new Error("A column id is required if using a non-string accessor for column above.");return P.accessor||(P.accessor=function(){}),P},Ce=[],_e=function(N,F){var P=$e(N,F);return Ce.push(P),P},ke=ve.map(function(g){return g.columns?ee({},g,{columns:g.columns.map(function(N){return _e(N,g)})}):_e(g)}),te=ke.slice(),me=[];te=te.map(function(g){if(g.columns){var N=g.columns.filter(function(F){return m.indexOf(F.id)>-1?!1:l.getFirstDefined(F.show,!0)});return ee({},g,{columns:N})}return g}),te=te.filter(function(g){return g.columns?g.columns.length:m.indexOf(g.id)>-1?!1:l.getFirstDefined(g.show,!0)});var Pe=te.findIndex(function(g){return g.pivot});if(m.length){var be=[];m.forEach(function(g){var N=Ce.find(function(F){return F.id===g});N&&be.push(N)});var Le=be.reduce(function(g,N){return g&&g===N.parentColumn&&N.parentColumn},be[0].parentColumn),Re=ie&&Le.Header;Re=Re||function(){return f.createElement("strong",null,"Pivoted")};var Te={Header:Re,columns:be.map(function(g){return ee({},d.props.pivotDefaults,g,{pivoted:!0})})};Pe>=0?(Te=ee({},te[Pe],Te),te.splice(Pe,1,Te)):te.unshift(Te)}var Ae=[],ue=[],we=function(N,F){Ae.push(ee({},d.props.column,F,{columns:N})),ue=[]};te.forEach(function(g){if(g.columns){me=me.concat(g.columns),ue.length>0&&we(ue),we(g.columns,g);return}me.push(g),ue.push(g)}),ie&&ue.length>0&&we(ue);var je=function g(N,F){var P,Q=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,j=(P={},H(P,J,N),H(P,$,F),H(P,A,N[A]),H(P,W,Q),P);return Ce.forEach(function(z){z.expander||(j[z.id]=z.accessor(N))}),j[A]&&(j[A]=j[A].map(function(z,Y){return g(z,Y,Q+1)})),j},re=this.resolvedData;(!this.resolvedData||s)&&(re=T(h),this.resolvedData=re),re=re.map(function(g,N){return je(g,N)});var Fe=me.filter(function(g){return!g.expander&&g.aggregate}),De=function(N){var F={};return Fe.forEach(function(P){var Q=N.map(function(j){return j[P.id]});F[P.id]=P.aggregate(Q,N)}),F};if(m.length){var ge=function g(N,F){var P=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0;if(P===F.length)return N;var Q=Object.entries(l.groupBy(N,F[P])).map(function(j){var z,Y=Na(j,2),ze=Y[0],Ge=Y[1];return z={},H(z,O,F[P]),H(z,E,ze),H(z,F[P],ze),H(z,A,Ge),H(z,W,P),H(z,oe,!0),z});return Q=Q.map(function(j){var z,Y=g(j[A],F,P+1);return ee({},j,(z={},H(z,A,Y),H(z,G,!0),z),De(Y))}),Q};re=ge(re,m)}return ee({},n,{resolvedData:re,allVisibleColumns:me,headerGroups:Ae,allDecoratedColumns:Ce,hasHeaderGroups:ie})}},{key:"getSortedData",value:function(n){var s=n.manual,d=n.sorted,c=n.filtered,u=n.defaultFilterMethod,m=n.resolvedData,h=n.allDecoratedColumns,T={};return h.filter(function(O){return O.sortMethod}).forEach(function(O){T[O.id]=O.sortMethod}),{sortedData:s?m:this.sortData(this.filterData(m,c,u,h),d,T)}}},{key:"fireFetchData",value:function(){var n=ee({},this.getResolvedState(),{page:this.getStateOrProp("page"),pageSize:this.getStateOrProp("pageSize"),filtered:this.getStateOrProp("filtered")});this.props.onFetchData(n,this)}},{key:"getPropOrState",value:function(n){return l.getFirstDefined(this.props[n],this.state[n])}},{key:"getStateOrProp",value:function(n){return l.getFirstDefined(this.state[n],this.props[n])}},{key:"filterData",value:function(n,s,d,c){var u=this,m=n;return s.length&&(m=s.reduce(function(h,T){var O=c.find(function(A){return A.id===T.id});if(!O||O.filterable===!1)return h;var E=O.filterMethod||d;return O.filterAll?E(T,h,O):h.filter(function(A){return E(T,A,O)})},m),m=m.map(function(h){return h[u.props.subRowsKey]?ee({},h,H({},u.props.subRowsKey,u.filterData(h[u.props.subRowsKey],s,d,c))):h}).filter(function(h){return h[u.props.subRowsKey]?h[u.props.subRowsKey].length>0:!0})),m}},{key:"sortData",value:function(n,s){var d=this,c=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(!s.length)return n;var u=(this.props.orderByMethod||l.orderBy)(n,s.map(function(m){return c[m.id]?function(h,T){return c[m.id](h[m.id],T[m.id],m.desc)}:function(h,T){return d.props.defaultSortMethod(h[m.id],T[m.id],m.desc)}}),s.map(function(m){return!m.desc}),this.props.indexKey);return u.forEach(function(m){m[d.props.subRowsKey]&&(m[d.props.subRowsKey]=d.sortData(m[d.props.subRowsKey],s,c))}),u}},{key:"getMinRows",value:function(){return l.getFirstDefined(this.props.minRows,this.getStateOrProp("pageSize"))}},{key:"onPageChange",value:function(n){var s=this.props,d=s.onPageChange,c=s.collapseOnPageChange,u={page:n};c&&(u.expanded={}),this.setStateWithData(u,function(){return d&&d(n)})}},{key:"onPageSizeChange",value:function(n){var s=this.props.onPageSizeChange,d=this.getResolvedState(),c=d.pageSize,u=d.page,m=c*u,h=Math.floor(m/n);this.setStateWithData({pageSize:n,page:h},function(){return s&&s(n,h)})}},{key:"sortColumn",value:function(n,s){var d=this.getResolvedState(),c=d.sorted,u=d.skipNextSort,m=d.defaultSortDesc,h=Object.prototype.hasOwnProperty.call(n,"defaultSortDesc")?n.defaultSortDesc:m,T=!h;if(u){this.setStateWithData({skipNextSort:!1});return}var O=this.props.onSortedChange,E=l.clone(c||[]).map(function($){return $.desc=l.isSortingDesc($),$});if(l.isArray(n)){var W=E.findIndex(function($){return $.id===n[0].id});if(W>-1){var J=E[W];J.desc===T?s?E.splice(W,n.length):n.forEach(function($,oe){E[W+oe].desc=h}):n.forEach(function($,oe){E[W+oe].desc=T}),s||(E=E.slice(W,n.length))}else s?E=E.concat(n.map(function($){return{id:$.id,desc:h}})):E=n.map(function($){return{id:$.id,desc:h}})}else{var A=E.findIndex(function($){return $.id===n.id});if(A>-1){var G=E[A];G.desc===T?s?E.splice(A,1):(G.desc=h,E=[G]):(G.desc=T,s||(E=[G]))}else s?E.push({id:n.id,desc:h}):E=[{id:n.id,desc:h}]}this.setStateWithData({page:!c.length&&E.length||!s?0:this.state.page,sorted:E},function(){return O&&O(E,n,s)})}},{key:"filterColumn",value:function(n,s){var d=this.getResolvedState(),c=d.filtered,u=this.props.onFilteredChange,m=(c||[]).filter(function(h){return h.id!==n.id});s!==""&&m.push({id:n.id,value:s}),this.setStateWithData({filtered:m},function(){return u&&u(m,n,s)})}},{key:"resizeColumnStart",value:function(n,s,d){var c=this;n.stopPropagation();var u=n.target.parentElement.getBoundingClientRect().width,m=void 0;d?m=n.changedTouches[0].pageX:m=n.pageX,this.trapEvents=!0,this.setStateWithData({currentlyResizing:{id:s.id,startX:m,parentWidth:u}},function(){d?(document.addEventListener("touchmove",c.resizeColumnMoving),document.addEventListener("touchcancel",c.resizeColumnEnd),document.addEventListener("touchend",c.resizeColumnEnd)):(document.addEventListener("mousemove",c.resizeColumnMoving),document.addEventListener("mouseup",c.resizeColumnEnd),document.addEventListener("mouseleave",c.resizeColumnEnd))})}},{key:"resizeColumnMoving",value:function(n){n.stopPropagation();var s=this.props,d=s.onResizedChange,c=s.column,u=this.getResolvedState(),m=u.resized,h=u.currentlyResizing,T=u.columns,O=T.find(function(J){return J.accessor===h.id||J.id===h.id}),E=O&&O.minResizeWidth!=null?O.minResizeWidth:c.minResizeWidth,A=m.filter(function(J){return J.id!==h.id}),G=void 0;n.type==="touchmove"?G=n.changedTouches[0].pageX:n.type==="mousemove"&&(G=n.pageX);var W=Math.max(h.parentWidth+G-h.startX,E);A.push({id:h.id,value:W}),this.setStateWithData({resized:A},function(){return d&&d(A,n)})}},{key:"resizeColumnEnd",value:function(n){n.stopPropagation();var s=n.type==="touchend"||n.type==="touchcancel";s&&(document.removeEventListener("touchmove",this.resizeColumnMoving),document.removeEventListener("touchcancel",this.resizeColumnEnd),document.removeEventListener("touchend",this.resizeColumnEnd)),document.removeEventListener("mousemove",this.resizeColumnMoving),document.removeEventListener("mouseup",this.resizeColumnEnd),document.removeEventListener("mouseleave",this.resizeColumnEnd),s||this.setStateWithData({skipNextSort:!0,currentlyResizing:!1})}}]),r}(a)};var Da=function(){function a(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&a(e.prototype,r),t&&a(e,t),e}}(),_a=Object.assign||function(a){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(a[t]=r[t])}return a};function Aa(a,e){if(!(a instanceof e))throw new TypeError("Cannot call a class as a function")}function Fa(a,e){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:a}function za(a,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);a.prototype=Object.create(e&&e.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(a,e):a.__proto__=e)}var xt=function(e){return f.createElement("button",_a({type:"button"},e,{className:"-btn"}),e.children)},qt=function(a){za(e,a);function e(r){Aa(this,e);var t=Fa(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,r));return t.getSafePage=t.getSafePage.bind(t),t.changePage=t.changePage.bind(t),t.applyPage=t.applyPage.bind(t),t.state={page:r.page},t}return Da(e,[{key:"UNSAFE_componentWillReceiveProps",value:function(t){this.props.page!==t.page&&this.setState({page:t.page})}},{key:"getSafePage",value:function(t){return Number.isNaN(t)&&(t=this.props.page),Math.min(Math.max(t,0),this.props.pages-1)}},{key:"changePage",value:function(t){t=this.getSafePage(t),this.setState({page:t}),this.props.page!==t&&this.props.onPageChange(t)}},{key:"applyPage",value:function(t){t&&t.preventDefault();var n=this.state.page;this.changePage(n===""?this.props.page:n)}},{key:"getPageJumpProperties",value:function(){var t=this;return{onKeyPress:function(s){(s.which===13||s.keyCode===13)&&t.applyPage()},onBlur:this.applyPage,value:this.state.page===""?"":this.state.page+1,onChange:function(s){var d=s.target.value,c=d-1;if(d==="")return t.setState({page:d});t.setState({page:t.getSafePage(c)})},inputType:this.state.page===""?"text":"number",pageJumpText:this.props.pageJumpText}}},{key:"render",value:function(){var t=this,n=this.props,s=n.pages,d=n.page,c=n.showPageSizeOptions,u=n.pageSizeOptions,m=n.pageSize,h=n.showPageJump,T=n.canPrevious,O=n.canNext,E=n.onPageSizeChange,A=n.className,G=n.PreviousComponent,W=n.NextComponent,J=n.renderPageJump,$=n.renderCurrentPage,oe=n.renderTotalPagesCount,ye=n.renderPageSizeOptions;return f.createElement("div",{className:_(A,"-pagination"),style:this.props.style},f.createElement("div",{className:"-previous"},f.createElement(G,{onClick:function(){T&&t.changePage(d-1)},disabled:!T},this.props.previousText)),f.createElement("div",{className:"-center"},f.createElement("span",{className:"-pageInfo"},this.props.pageText," ",h?J(this.getPageJumpProperties()):$(d)," ",this.props.ofText," ",oe(s)),c&&ye({pageSize:m,rowsSelectorText:this.props.rowsSelectorText,pageSizeOptions:u,onPageSizeChange:E,rowsText:this.props.rowsText})),f.createElement("div",{className:"-next"},f.createElement(W,{onClick:function(){O&&t.changePage(d+1)},disabled:!O},this.props.nextText)))}}]),e}(rt.Component);qt.defaultProps={PreviousComponent:xt,NextComponent:xt,renderPageJump:function(e){var r=e.onChange,t=e.value,n=e.onBlur,s=e.onKeyPress,d=e.inputType,c=e.pageJumpText;return f.createElement("div",{className:"-pageJump"},f.createElement("input",{"aria-label":c,type:d,onChange:r,value:t,onBlur:n,onKeyPress:s}))},renderCurrentPage:function(e){return f.createElement("span",{className:"-currentPage"},e+1)},renderTotalPagesCount:function(e){return f.createElement("span",{className:"-totalPages"},e||1)},renderPageSizeOptions:function(e){var r=e.pageSize,t=e.pageSizeOptions,n=e.rowsSelectorText,s=e.onPageSizeChange,d=e.rowsText;return f.createElement("span",{className:"select-wrap -pageSizeOptions"},f.createElement("select",{"aria-label":n,onChange:function(u){return s(Number(u.target.value))},value:r},t.map(function(c,u){return f.createElement("option",{key:u,value:c},c+" "+d)})))}};var xe=Object.assign||function(a){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(a[t]=r[t])}return a};function Oe(a,e){var r={};for(var t in a)e.indexOf(t)>=0||Object.prototype.hasOwnProperty.call(a,t)&&(r[t]=a[t]);return r}var D=function(){return{}};const $t={data:[],resolveData:function(e){return e},loading:!1,showPagination:!0,showPaginationTop:!1,showPaginationBottom:!0,showPageSizeOptions:!0,pageSizeOptions:[5,10,20,25,50,100],defaultPage:0,defaultPageSize:20,showPageJump:!0,collapseOnSortingChange:!0,collapseOnPageChange:!0,collapseOnDataChange:!0,freezeWhenExpanded:!1,sortable:!0,multiSort:!0,resizable:!0,filterable:!1,defaultSortDesc:!1,defaultSorted:[],defaultFiltered:[],defaultResized:[],defaultExpanded:{},defaultFilterMethod:function(e,r,t){var n=e.pivotId||e.id;return r[n]!==void 0?String(r[n]).startsWith(e.value):!0},defaultSortMethod:function(e,r,t){return e=e??"",r=r??"",e=typeof e=="string"?e.toLowerCase():e,r=typeof r=="string"?r.toLowerCase():r,e>r?1:e<r?-1:0},onPageChange:void 0,onPageSizeChange:void 0,onSortedChange:void 0,onFilteredChange:void 0,onResizedChange:void 0,onExpandedChange:void 0,pivotBy:void 0,pivotValKey:"_pivotVal",pivotIDKey:"_pivotID",subRowsKey:"_subRows",aggregatedKey:"_aggregated",nestingLevelKey:"_nestingLevel",originalKey:"_original",indexKey:"_index",groupedByPivotKey:"_groupedByPivot",onFetchData:function(){return null},className:"",style:{},getProps:D,getTableProps:D,getTheadGroupProps:D,getTheadGroupTrProps:D,getTheadGroupThProps:D,getTheadProps:D,getTheadTrProps:D,getTheadThProps:D,getTheadFilterProps:D,getTheadFilterTrProps:D,getTheadFilterThProps:D,getTbodyProps:D,getTrGroupProps:D,getTrProps:D,getTdProps:D,getTfootProps:D,getTfootTrProps:D,getTfootTdProps:D,getPaginationProps:D,getLoadingProps:D,getNoDataProps:D,getResizerProps:D,column:{Cell:void 0,Header:void 0,Footer:void 0,Aggregated:void 0,Pivot:void 0,PivotValue:void 0,Expander:void 0,Filter:void 0,Placeholder:void 0,sortable:void 0,resizable:void 0,filterable:void 0,show:!0,minWidth:100,minResizeWidth:11,className:"",style:{},getProps:D,aggregate:void 0,headerClassName:"",headerStyle:{},getHeaderProps:D,footerClassName:"",footerStyle:{},getFooterProps:D,filterMethod:void 0,filterAll:!1,sortMethod:void 0},expanderDefaults:{sortable:!1,resizable:!1,filterable:!1,width:35},pivotDefaults:{},previousText:"Previous",nextText:"Next",loadingText:"Loading...",noDataText:"No rows found",pageText:"Page",ofText:"of",rowsText:"rows",pageJumpText:"jump to page",rowsSelectorText:"rows per page",TableComponent:function(e){var r=e.children,t=e.className,n=Oe(e,["children","className"]);return f.createElement("div",xe({className:_("rt-table",t),role:"grid"},n),r)},TheadComponent:l.makeTemplateComponent("rt-thead","Thead"),TbodyComponent:l.makeTemplateComponent("rt-tbody","Tbody"),TrGroupComponent:function(e){var r=e.children,t=e.className,n=Oe(e,["children","className"]);return f.createElement("div",xe({className:_("rt-tr-group",t),role:"rowgroup"},n),r)},TrComponent:function(e){var r=e.children,t=e.className,n=Oe(e,["children","className"]);return f.createElement("div",xe({className:_("rt-tr",t),role:"row"},n),r)},ThComponent:function(e){var r=e.toggleSort,t=e.className,n=e.children,s=Oe(e,["toggleSort","className","children"]);return f.createElement("div",xe({className:_("rt-th",t),onClick:function(c){return r&&r(c)},role:"columnheader",tabIndex:"-1"},s),n)},TdComponent:function(e){e.toggleSort;var r=e.className,t=e.children,n=Oe(e,["toggleSort","className","children"]);return f.createElement("div",xe({className:_("rt-td",r),role:"gridcell"},n),t)},TfootComponent:l.makeTemplateComponent("rt-tfoot","Tfoot"),FilterComponent:function(e){var r=e.filter,t=e.onChange,n=e.column;return f.createElement("input",{type:"text",style:{width:"100%"},placeholder:n.Placeholder,value:r?r.value:"",onChange:function(d){return t(d.target.value)}})},ExpanderComponent:function(e){var r=e.isExpanded;return f.createElement("div",{className:_("rt-expander",r&&"-open")},"•")},PivotValueComponent:function(e){var r=e.subRows,t=e.value;return f.createElement("span",null,t," ",r&&"("+r.length+")")},AggregatedComponent:function(e){var r=e.subRows,t=e.column,n=r.filter(function(s){return typeof s[t.id]<"u"}).map(function(s,d){return f.createElement("span",{key:d},s[t.id],d<r.length-1?", ":"")});return f.createElement("span",null,n)},PivotComponent:void 0,PaginationComponent:qt,PreviousComponent:void 0,NextComponent:void 0,LoadingComponent:function(e){var r=e.className,t=e.loading,n=e.loadingText,s=Oe(e,["className","loading","loadingText"]);return f.createElement("div",xe({className:_("-loading",{"-active":t},r)},s),f.createElement("div",{className:"-loading-inner"},n))},NoDataComponent:l.makeTemplateComponent("rt-noData","NoData"),ResizerComponent:l.makeTemplateComponent("rt-resizer","Resizer"),PadRowComponent:function(){return f.createElement("span",null," ")}},Va={data:o.any,loading:o.bool,showPagination:o.bool,showPaginationTop:o.bool,showPaginationBottom:o.bool,showPageSizeOptions:o.bool,pageSizeOptions:o.array,defaultPageSize:o.number,showPageJump:o.bool,collapseOnSortingChange:o.bool,collapseOnPageChange:o.bool,collapseOnDataChange:o.bool,freezeWhenExpanded:o.bool,sortable:o.bool,resizable:o.bool,filterable:o.bool,defaultSortDesc:o.bool,defaultSorted:o.array,defaultFiltered:o.array,defaultResized:o.array,defaultExpanded:o.object,defaultFilterMethod:o.func,defaultSortMethod:o.func,onPageChange:o.func,onPageSizeChange:o.func,onSortedChange:o.func,onFilteredChange:o.func,onResizedChange:o.func,onExpandedChange:o.func,pivotBy:o.array,pivotValKey:o.string,pivotIDKey:o.string,subRowsKey:o.string,aggregatedKey:o.string,nestingLevelKey:o.string,originalKey:o.string,indexKey:o.string,groupedByPivotKey:o.string,onFetchData:o.func,className:o.string,style:o.object,getProps:o.func,getTableProps:o.func,getTheadGroupProps:o.func,getTheadGroupTrProps:o.func,getTheadGroupThProps:o.func,getTheadProps:o.func,getTheadTrProps:o.func,getTheadThProps:o.func,getTheadFilterProps:o.func,getTheadFilterTrProps:o.func,getTheadFilterThProps:o.func,getTbodyProps:o.func,getTrGroupProps:o.func,getTrProps:o.func,getTdProps:o.func,getTfootProps:o.func,getTfootTrProps:o.func,getTfootTdProps:o.func,getPaginationProps:o.func,getLoadingProps:o.func,getNoDataProps:o.func,getResizerProps:o.func,columns:o.arrayOf(o.shape({Cell:o.oneOfType([o.element,o.string,o.func]),Header:o.oneOfType([o.element,o.string,o.func]),Footer:o.oneOfType([o.element,o.string,o.func]),Aggregated:o.oneOfType([o.element,o.string,o.func]),Pivot:o.oneOfType([o.element,o.string,o.func]),PivotValue:o.oneOfType([o.element,o.string,o.func]),Expander:o.oneOfType([o.element,o.string,o.func]),Filter:o.oneOfType([o.element,o.func]),sortable:o.bool,resizable:o.bool,filterable:o.bool,show:o.bool,minWidth:o.number,minResizeWidth:o.number,className:o.string,style:o.object,getProps:o.func,aggregate:o.func,headerClassName:o.string,headerStyle:o.object,getHeaderProps:o.func,footerClassName:o.string,footerStyle:o.object,getFooterProps:o.func,filterMethod:o.func,filterAll:o.bool,sortMethod:o.func})),expanderDefaults:o.shape({sortable:o.bool,resizable:o.bool,filterable:o.bool,width:o.number}),pivotDefaults:o.object,previousText:o.node,nextText:o.node,loadingText:o.node,noDataText:o.node,pageText:o.node,ofText:o.node,rowsText:o.node,pageJumpText:o.node,rowsSelectorText:o.node,TableComponent:o.elementType,TheadComponent:o.elementType,TbodyComponent:o.elementType,TrGroupComponent:o.elementType,TrComponent:o.elementType,ThComponent:o.elementType,TdComponent:o.elementType,TfootComponent:o.elementType,FilterComponent:o.elementType,ExpanderComponent:o.elementType,PivotValueComponent:o.elementType,AggregatedComponent:o.elementType,PivotComponent:o.elementType,PaginationComponent:o.elementType,PreviousComponent:o.elementType,NextComponent:o.elementType,LoadingComponent:o.elementType,NoDataComponent:o.elementType,ResizerComponent:o.elementType,PadRowComponent:o.elementType};var Ot=function(){function a(e,r){var t=[],n=!0,s=!1,d=void 0;try{for(var c=e[Symbol.iterator](),u;!(n=(u=c.next()).done)&&(t.push(u.value),!(r&&t.length===r));n=!0);}catch(m){s=!0,d=m}finally{try{!n&&c.return&&c.return()}finally{if(s)throw d}}return t}return function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return a(e,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),C=Object.assign||function(a){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(a[t]=r[t])}return a},Ma=function(){function a(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,r,t){return r&&a(e.prototype,r),t&&a(e,t),e}}();function Ia(a,e){if(!(a instanceof e))throw new TypeError("Cannot call a class as a function")}function qa(a,e){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:a}function $a(a,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);a.prototype=Object.create(e&&e.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(a,e):a.__proto__=e)}var it=function(a){$a(e,a);function e(r){Ia(this,e);var t=qa(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return t.getResolvedState=t.getResolvedState.bind(t),t.getDataModel=t.getDataModel.bind(t),t.getSortedData=t.getSortedData.bind(t),t.fireFetchData=t.fireFetchData.bind(t),t.getPropOrState=t.getPropOrState.bind(t),t.getStateOrProp=t.getStateOrProp.bind(t),t.filterData=t.filterData.bind(t),t.sortData=t.sortData.bind(t),t.getMinRows=t.getMinRows.bind(t),t.onPageChange=t.onPageChange.bind(t),t.onPageSizeChange=t.onPageSizeChange.bind(t),t.sortColumn=t.sortColumn.bind(t),t.filterColumn=t.filterColumn.bind(t),t.resizeColumnStart=t.resizeColumnStart.bind(t),t.resizeColumnEnd=t.resizeColumnEnd.bind(t),t.resizeColumnMoving=t.resizeColumnMoving.bind(t),t.state={page:r.defaultPage,pageSize:r.defaultPageSize,sorted:r.defaultSorted,expanded:r.defaultExpanded,filtered:r.defaultFiltered,resized:r.defaultResized,currentlyResizing:!1,skipNextSort:!1},t}return Ma(e,[{key:"render",value:function(){var t=this,n=this.getResolvedState(),s=n.children,d=n.className,c=n.style,u=n.getProps,m=n.getTableProps,h=n.getTheadGroupProps,T=n.getTheadGroupTrProps,O=n.getTheadGroupThProps,E=n.getTheadProps,A=n.getTheadTrProps,G=n.getTheadThProps,W=n.getTheadFilterProps,J=n.getTheadFilterTrProps,$=n.getTheadFilterThProps,oe=n.getTbodyProps,ye=n.getTrGroupProps,ie=n.getTrProps,ve=n.getTdProps,se=n.getTfootProps,$e=n.getTfootTrProps,Ce=n.getTfootTdProps,_e=n.getPaginationProps,ke=n.getLoadingProps,te=n.getNoDataProps,me=n.getResizerProps,Pe=n.showPagination,be=n.showPaginationTop,Le=n.showPaginationBottom,Re=n.manual,Te=n.loadingText,Ae=n.noDataText,ue=n.sortable,we=n.multiSort,je=n.resizable,re=n.filterable,Fe=n.pivotIDKey,De=n.pivotValKey,ge=n.pivotBy,g=n.subRowsKey,N=n.aggregatedKey,F=n.originalKey,P=n.indexKey,Q=n.groupedByPivotKey,j=n.loading,z=n.pageSize,Y=n.page,ze=n.sorted,Ge=n.filtered,de=n.resized,Ve=n.expanded,ut=n.pages,dt=n.onExpandedChange,Lt=n.TableComponent,We=n.TheadComponent,jt=n.TbodyComponent,ct=n.TrGroupComponent,Ee=n.TrComponent,Ke=n.ThComponent,Ue=n.TdComponent,Gt=n.TfootComponent,Wt=n.PaginationComponent,Kt=n.LoadingComponent,Me=n.SubComponent,Ut=n.NoDataComponent,Bt=n.ResizerComponent,Ht=n.ExpanderComponent,Jt=n.PivotValueComponent,Qt=n.PivotComponent,Yt=n.AggregatedComponent,Xt=n.FilterComponent,Zt=n.PadRowComponent,en=n.resolvedData,ce=n.allVisibleColumns,tn=n.headerGroups,nn=n.hasHeaderGroups,Ie=n.sortedData,an=n.currentlyResizing,Be=z*Y,pt=Be+z,he=Re?en:Ie.slice(Be,pt),ft=this.getMinRows(),mt=l.range(Math.max(ft-he.length,0)),gt=ce.some(function(V){return V.Footer}),rn=re||ce.some(function(V){return V.filterable}),on=function V(i){var b=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[],R=arguments.length>2&&arguments[2]!==void 0?arguments[2]:-1;return[i.map(function(S,L){R+=1;var k=C({},S,{_viewIndex:R}),M=b.concat([L]);if(k[g]&&l.get(Ve,M)){var v=V(k[g],M,R),I=Ot(v,2);k[g]=I[0],R=I[1]}return k}),R]},sn=on(he),ln=Ot(sn,1);he=ln[0];var ht=Y>0,yt=Y+1<ut,Ne=l.sum(ce.map(function(V){var i=de.find(function(b){return b.id===V.id})||{};return l.getFirstDefined(i.value,V.width,V.minWidth)})),un=-1,x=C({},n,{startRow:Be,endRow:pt,pageRows:he,minRows:ft,padRows:mt,hasColumnFooter:gt,canPrevious:ht,canNext:yt,rowMinWidth:Ne}),He=l.splitProps(u(x,void 0,void 0,this)),Je=l.splitProps(m(x,void 0,void 0,this)),Qe=l.splitProps(oe(x,void 0,void 0,this)),dn=ke(x,void 0,void 0,this),cn=te(x,void 0,void 0,this),pn=function(i,b){var R=function(K){return(de.find(function(B){return B.id===K.id})||{}).value},S=l.sum(i.columns.map(function(q){return q.width||R(q)?0:q.minWidth})),L=l.sum(i.columns.map(function(q){return l.getFirstDefined(R(q),q.width,q.minWidth)})),k=l.sum(i.columns.map(function(q){return l.getFirstDefined(R(q),q.width,q.maxWidth)})),M=l.splitProps(O(x,void 0,i,t)),v=l.splitProps(i.getHeaderProps(x,void 0,i,t)),I=[i.headerClassName,M.className,v.className],X=C({},i.headerStyle,M.style,v.style),Z=C({},M.rest,v.rest),U={flex:S+" 0 auto",width:l.asPx(L),maxWidth:l.asPx(k)};return f.createElement(Ke,C({key:b+"-"+i.id,className:_(I),style:C({},X,U)},Z),l.normalizeComponent(i.Header,{data:Ie,column:i}))},fn=function(){var i=l.splitProps(h(x,void 0,void 0,t)),b=l.splitProps(T(x,void 0,void 0,t));return f.createElement(We,C({className:_("-headerGroups",i.className),style:C({},i.style,{minWidth:Ne+"px"})},i.rest),f.createElement(Ee,C({className:b.className,style:b.style},b.rest),tn.map(pn)))},mn=function(i,b){var R=de.find(function(le){return le.id===i.id})||{},S=ze.find(function(le){return le.id===i.id}),L=typeof i.show=="function"?i.show():i.show,k=l.getFirstDefined(R.value,i.width,i.minWidth),M=l.getFirstDefined(R.value,i.width,i.maxWidth),v=l.splitProps(G(x,void 0,i,t)),I=l.splitProps(i.getHeaderProps(x,void 0,i,t)),X=[i.headerClassName,v.className,I.className],Z=C({},i.headerStyle,v.style,I.style),U=C({},v.rest,I.rest),q=l.getFirstDefined(i.resizable,je,!1),K=q?f.createElement(Bt,C({onMouseDown:function(pe){return t.resizeColumnStart(pe,i,!1)},onTouchStart:function(pe){return t.resizeColumnStart(pe,i,!0)}},me("finalState",void 0,i,t))):null,B=l.getFirstDefined(i.sortable,ue,!1);return f.createElement(Ke,C({key:b+"-"+i.id,className:_(X,q&&"rt-resizable-header",S?S.desc?"-sort-desc":"-sort-asc":"",B&&"-cursor-pointer",!L&&"-hidden",ge&&ge.slice(0,-1).includes(i.id)&&"rt-header-pivot"),style:C({},Z,{flex:k+" 0 auto",width:l.asPx(k),maxWidth:l.asPx(M)}),toggleSort:function(pe){B&&t.sortColumn(i,we?pe.shiftKey:!1)}},U),f.createElement("div",{className:_(q&&"rt-resizable-header-content")},l.normalizeComponent(i.Header,{data:Ie,column:i})),K)},gn=function(){var i=l.splitProps(E(x,void 0,void 0,t)),b=l.splitProps(A(x,void 0,void 0,t));return f.createElement(We,C({className:_("-header",i.className),style:C({},i.style,{minWidth:Ne+"px"})},i.rest),f.createElement(Ee,C({className:b.className,style:b.style},b.rest),ce.map(mn)))},hn=function(i,b){var R=de.find(function(K){return K.id===i.id})||{},S=l.getFirstDefined(R.value,i.width,i.minWidth),L=l.getFirstDefined(R.value,i.width,i.maxWidth),k=l.splitProps($(x,void 0,i,t)),M=l.splitProps(i.getHeaderProps(x,void 0,i,t)),v=[i.headerClassName,k.className,M.className],I=C({},i.headerStyle,k.style,M.style),X=C({},k.rest,M.rest),Z=Ge.find(function(K){return K.id===i.id}),U=i.Filter||Xt,q=l.getFirstDefined(i.filterable,re,!1);return f.createElement(Ke,C({key:b+"-"+i.id,className:_(v),style:C({},I,{flex:S+" 0 auto",width:l.asPx(S),maxWidth:l.asPx(L)})},X),q?l.normalizeComponent(U,{column:i,filter:Z,onChange:function(B){return t.filterColumn(i,B)}},$t.column.Filter):null)},yn=function(){var i=l.splitProps(W(x,void 0,void 0,t)),b=l.splitProps(J(x,void 0,void 0,t));return f.createElement(We,C({className:_("-filters",i.className),style:C({},i.style,{minWidth:Ne+"px"})},i.rest),f.createElement(Ee,C({className:b.className,style:b.style},b.rest),ce.map(hn)))},vn=function V(i,b){var R=arguments.length>2&&arguments[2]!==void 0?arguments[2]:[],S={original:i[F],row:i,index:i[P],viewIndex:un+=1,pageSize:z,page:Y,level:R.length,nestingPath:R.concat([b]),aggregated:i[N],groupedByPivot:i[Q],subRows:i[g]},L=l.get(Ve,S.nestingPath),k=ye(x,S,void 0,t),M=l.splitProps(ie(x,S,void 0,t));return f.createElement(ct,C({key:S.nestingPath.join("_")},k),f.createElement(Ee,C({className:_(M.className,i._viewIndex%2?"-even":"-odd"),style:M.style},M.rest),ce.map(function(v,I){var X=de.find(function(ne){return ne.id===v.id})||{},Z=typeof v.show=="function"?v.show():v.show,U=l.getFirstDefined(X.value,v.width,v.minWidth),q=l.getFirstDefined(X.value,v.width,v.maxWidth),K=l.splitProps(ve(x,S,v,t)),B=l.splitProps(v.getProps(x,S,v,t)),le=[K.className,v.className,B.className],pe=C({},K.style,v.style,B.style),w=C({},S,{isExpanded:L,column:C({},v),value:S.row[v.id],pivoted:v.pivoted,expander:v.expander,resized:de,show:Z,width:U,maxWidth:q,tdProps:K,columnProps:B,classes:le,styles:pe}),Ye=w.value,Pt=void 0,Xe=void 0,Ze=void 0,En=function(On){var Se=l.clone(Ve);return L?Se=l.set(Se,w.nestingPath,!1):Se=l.set(Se,w.nestingPath,{}),t.setStateWithData({expanded:Se},function(){return dt&&dt(Se,w.nestingPath,On,w)})},fe=l.normalizeComponent(v.Cell,w,Ye),bt=v.Aggregated||(v.aggregate?v.Cell:Yt),Tt=v.Expander||Ht,Nn=v.PivotValue||Jt,Sn=Qt||function(ne){return f.createElement("div",null,f.createElement(Tt,ne),f.createElement(Nn,ne))},xn=v.Pivot||Sn;(w.pivoted||w.expander)&&(w.expandable=!0,Pt=!0,w.pivoted&&!w.subRows&&!Me&&(w.expandable=!1)),w.pivoted?(Xe=S.row[Fe]===v.id&&w.subRows,Ze=ge.indexOf(v.id)>ge.indexOf(S.row[Fe])&&w.subRows,Xe?fe=l.normalizeComponent(xn,C({},w,{value:i[De]}),i[De]):Ze?fe=l.normalizeComponent(bt,w,Ye):fe=null):w.aggregated&&(fe=l.normalizeComponent(bt,w,Ye)),w.expander&&(fe=l.normalizeComponent(Tt,w,i[De]),ge&&(w.groupedByPivot&&(fe=null),!w.subRows&&!Me&&(fe=null)));var et=Pt?En:function(){},tt={onClick:et};return K.rest.onClick&&(tt.onClick=function(ne){K.rest.onClick(ne,function(){return et(ne)})}),B.rest.onClick&&(tt.onClick=function(ne){B.rest.onClick(ne,function(){return et(ne)})}),f.createElement(Ue,C({key:I+"-"+v.id,className:_(le,!w.expandable&&!Z&&"hidden",w.expandable&&"rt-expandable",(Xe||Ze)&&"rt-pivot"),style:C({},pe,{flex:U+" 0 auto",width:l.asPx(U),maxWidth:l.asPx(q)})},K.rest,B.rest,tt),fe)})),S.subRows&&L&&S.subRows.map(function(v,I){return V(v,I,S.nestingPath)}),Me&&!S.subRows&&L&&Me(S,function(){var v=l.clone(Ve);l.set(v,S.nestingPath,!1)}))},Cn=function(i,b){var R=de.find(function(U){return U.id===i.id})||{},S=typeof i.show=="function"?i.show():i.show,L=l.getFirstDefined(R.value,i.width,i.minWidth),k=L,M=l.getFirstDefined(R.value,i.width,i.maxWidth),v=l.splitProps(ve(x,void 0,i,t)),I=l.splitProps(i.getProps(x,void 0,i,t)),X=[v.className,i.className,I.className],Z=C({},v.style,i.style,I.style);return f.createElement(Ue,C({key:b+"-"+i.id,className:_(X,!S&&"hidden"),style:C({},Z,{flex:k+" 0 auto",width:l.asPx(L),maxWidth:l.asPx(M)})},v.rest),l.normalizeComponent(Zt))},Pn=function(i,b){var R=ye(x,void 0,void 0,t),S=l.splitProps(ie(x,void 0,void 0,t));return f.createElement(ct,C({key:"pad-"+b},R),f.createElement(Ee,{className:_("-padRow",(he.length+b)%2?"-even":"-odd",S.className),style:S.style||{}},ce.map(Cn)))},bn=function(i,b){var R=de.find(function(U){return U.id===i.id})||{},S=typeof i.show=="function"?i.show():i.show,L=l.getFirstDefined(R.value,i.width,i.minWidth),k=l.getFirstDefined(R.value,i.width,i.maxWidth),M=l.splitProps(Ce(x,void 0,i,t)),v=l.splitProps(i.getProps(x,void 0,i,t)),I=l.splitProps(i.getFooterProps(x,void 0,i,t)),X=[M.className,i.className,v.className,I.className],Z=C({},M.style,i.style,v.style,I.style);return f.createElement(Ue,C({key:b+"-"+i.id,className:_(X,!S&&"hidden"),style:C({},Z,{flex:L+" 0 auto",width:l.asPx(L),maxWidth:l.asPx(k)})},v.rest,M.rest,I.rest),l.normalizeComponent(i.Footer,{data:Ie,column:i}))},Tn=function(){var i=l.splitProps(se(x,void 0,void 0,t)),b=l.splitProps($e(x,void 0,void 0,t));return f.createElement(Gt,C({className:i.className,style:C({},i.style,{minWidth:Ne+"px"})},i.rest),f.createElement(Ee,C({className:_(b.className),style:b.style},b.rest),ce.map(bn)))},vt=function(i){var b=l.splitProps(_e(x,void 0,void 0,t));return f.createElement(Wt,C({},n,{pages:ut,canPrevious:ht,canNext:yt,onPageChange:t.onPageChange,onPageSizeChange:t.onPageSizeChange,className:b.className,style:b.style,isTop:i},b.rest))},Ct=function(){return f.createElement("div",C({className:_("ReactTable",d,He.className),style:C({},c,He.style)},He.rest),Pe&&be?f.createElement("div",{className:"pagination-top"},vt(!0)):null,f.createElement(Lt,C({className:_(Je.className,an?"rt-resizing":""),style:Je.style},Je.rest),nn?fn():null,gn(),rn?yn():null,f.createElement(jt,C({className:_(Qe.className),style:C({},Qe.style,{minWidth:Ne+"px"})},Qe.rest),he.map(function(i,b){return vn(i,b)}),mt.map(Pn)),gt?Tn():null),Pe&&Le?f.createElement("div",{className:"pagination-bottom"},vt(!1)):null,!he.length&&f.createElement(Ut,cn,l.normalizeComponent(Ae)),f.createElement(Kt,C({loading:j,loadingText:Te},dn)))};return s?s(x,Ct,this):Ct()}}]),e}(wa(Ea(rt.Component)));it.propTypes=Va;it.defaultProps=$t;var qe={},Rt;function ka(){if(Rt)return qe;Rt=1,Object.defineProperty(qe,"__esModule",{value:!0});var a=zn(),e=r(a);function r(t){return t&&t.__esModule?t:{default:t}}return qe.default={data:e.default.any,loading:e.default.bool,showPagination:e.default.bool,showPaginationTop:e.default.bool,showPaginationBottom:e.default.bool,showPageSizeOptions:e.default.bool,pageSizeOptions:e.default.array,defaultPageSize:e.default.number,showPageJump:e.default.bool,collapseOnSortingChange:e.default.bool,collapseOnPageChange:e.default.bool,collapseOnDataChange:e.default.bool,freezeWhenExpanded:e.default.bool,sortable:e.default.bool,resizable:e.default.bool,filterable:e.default.bool,defaultSortDesc:e.default.bool,defaultSorted:e.default.array,defaultFiltered:e.default.array,defaultResized:e.default.array,defaultExpanded:e.default.object,defaultFilterMethod:e.default.func,defaultSortMethod:e.default.func,onPageChange:e.default.func,onPageSizeChange:e.default.func,onSortedChange:e.default.func,onFilteredChange:e.default.func,onResizedChange:e.default.func,onExpandedChange:e.default.func,pivotBy:e.default.array,pivotValKey:e.default.string,pivotIDKey:e.default.string,subRowsKey:e.default.string,aggregatedKey:e.default.string,nestingLevelKey:e.default.string,originalKey:e.default.string,indexKey:e.default.string,groupedByPivotKey:e.default.string,onFetchData:e.default.func,className:e.default.string,style:e.default.object,getProps:e.default.func,getTableProps:e.default.func,getTheadGroupProps:e.default.func,getTheadGroupTrProps:e.default.func,getTheadGroupThProps:e.default.func,getTheadProps:e.default.func,getTheadTrProps:e.default.func,getTheadThProps:e.default.func,getTheadFilterProps:e.default.func,getTheadFilterTrProps:e.default.func,getTheadFilterThProps:e.default.func,getTbodyProps:e.default.func,getTrGroupProps:e.default.func,getTrProps:e.default.func,getTdProps:e.default.func,getTfootProps:e.default.func,getTfootTrProps:e.default.func,getTfootTdProps:e.default.func,getPaginationProps:e.default.func,getLoadingProps:e.default.func,getNoDataProps:e.default.func,getResizerProps:e.default.func,columns:e.default.arrayOf(e.default.shape({Cell:e.default.oneOfType([e.default.element,e.default.string,e.default.func]),Header:e.default.oneOfType([e.default.element,e.default.string,e.default.func]),Footer:e.default.oneOfType([e.default.element,e.default.string,e.default.func]),Aggregated:e.default.oneOfType([e.default.element,e.default.string,e.default.func]),Pivot:e.default.oneOfType([e.default.element,e.default.string,e.default.func]),PivotValue:e.default.oneOfType([e.default.element,e.default.string,e.default.func]),Expander:e.default.oneOfType([e.default.element,e.default.string,e.default.func]),Filter:e.default.oneOfType([e.default.element,e.default.func]),sortable:e.default.bool,resizable:e.default.bool,filterable:e.default.bool,show:e.default.bool,minWidth:e.default.number,minResizeWidth:e.default.number,className:e.default.string,style:e.default.object,getProps:e.default.func,aggregate:e.default.func,headerClassName:e.default.string,headerStyle:e.default.object,getHeaderProps:e.default.func,footerClassName:e.default.string,footerStyle:e.default.object,getFooterProps:e.default.func,filterMethod:e.default.func,filterAll:e.default.bool,sortMethod:e.default.func})),expanderDefaults:e.default.shape({sortable:e.default.bool,resizable:e.default.bool,filterable:e.default.bool,width:e.default.number}),pivotDefaults:e.default.object,previousText:e.default.node,nextText:e.default.node,loadingText:e.default.node,noDataText:e.default.node,pageText:e.default.node,ofText:e.default.node,rowsText:e.default.node,pageJumpText:e.default.node,rowsSelectorText:e.default.node,TableComponent:e.default.elementType,TheadComponent:e.default.elementType,TbodyComponent:e.default.elementType,TrGroupComponent:e.default.elementType,TrComponent:e.default.elementType,ThComponent:e.default.elementType,TdComponent:e.default.elementType,TfootComponent:e.default.elementType,FilterComponent:e.default.elementType,ExpanderComponent:e.default.elementType,PivotValueComponent:e.default.elementType,AggregatedComponent:e.default.elementType,PivotComponent:e.default.elementType,PaginationComponent:e.default.elementType,PreviousComponent:e.default.elementType,NextComponent:e.default.elementType,LoadingComponent:e.default.elementType,NoDataComponent:e.default.elementType,ResizerComponent:e.default.elementType,PadRowComponent:e.default.elementType},qe}var La=ka();const wt=_t(La),ja="px-2 py-4 pb-3 font-700 text-base-600 select-none relative text-left border-r-0 leading-normal",Ga=`${ja} hover:bg-primary-200 hover:z-1 hover:text-primary-700`,Wa="p-2 flex items-center text-base-600 text-left border-r-0 leading-normal",Ar="whitespace-normal overflow-visible",Fr="rt-tr-actions hidden right-0 p-0 mr-2 w-auto text-left self-center",kt=50;class Dt extends rt.Component{constructor(){super(...arguments);ae(this,"getTheadProps",()=>this.props.showThead?{}:{style:{display:"none"}});ae(this,"getTrGroupProps",(r,t)=>({className:t&&t.original?this.props.trClassName:"hidden"}));ae(this,"getTrProps",(r,t)=>{const n=t&&t.original&&At(t.original),s=[];return t&&t.original&&(n[this.props.idAttribute]===this.props.selectedRowId&&s.push("row-active"),t.original.disabled&&s.push("data-test-disabled")),this.props.onRowClick||s.push("cursor-default"),{onClick:()=>{this.props.onRowClick&&this.props.onRowClick(t.original)},className:s.join(" ")}});ae(this,"getHorizontalPaddingClass",()=>this.props.noHorizontalPadding?"px-0":"px-3");ae(this,"getTheadTrProps",()=>({className:this.getHorizontalPaddingClass()}));ae(this,"getTbodyProps",()=>({className:this.getHorizontalPaddingClass()}));ae(this,"getColumnClassName",r=>r.className||Wa);ae(this,"getHeaderClassName",r=>r.headerClassName||Ga)}render(){const{rows:r,columns:t,defaultSorted:n,manual:s,pageSize:d,...c}=this.props;return!t||!t.length?null:(t.forEach(u=>Object.assign(u,{className:this.getColumnClassName(u),headerClassName:this.getHeaderClassName(u)})),Dn.jsx(it,{ref:this.props.setTableRef,data:r,columns:t,getTrGroupProps:this.getTrGroupProps,getTrProps:this.getTrProps,getTheadProps:this.getTheadProps,getTheadTrProps:this.getTheadTrProps,getTbodyProps:this.getTbodyProps,defaultPageSize:d,defaultSorted:n,className:`flex flex-1 overflow-auto border-0 w-full h-full z-0 ${c.expanded?"expanded":""} `,resizable:!1,sortable:!0,defaultSortDesc:!1,showPageJump:!1,minRows:Math.min(this.props.rows.length,d),page:this.props.page,pageSize:d,showPagination:!1,manual:s,...c}))}}ae(Dt,"propTypes",{columns:wt.columns.isRequired,rows:o.arrayOf(o.object).isRequired,onRowClick:o.func,selectedRowId:o.string,manual:o.bool,idAttribute:o.string,noDataText:wt.noDataText,setTableRef:o.func,page:o.number,trClassName:o.string,showThead:o.bool,defaultSorted:o.arrayOf(o.object),pageSize:o.number,noHorizontalPadding:o.bool}),ae(Dt,"defaultProps",{noDataText:"No records.",selectedRowId:null,manual:!1,idAttribute:"id",onRowClick:null,setTableRef:null,page:0,trClassName:"",showThead:!0,defaultSorted:[],pageSize:kt,noHorizontalPadding:!1});function st(a,e="+"){return a?Object.entries(a).reduce((r,t)=>{const[n,s]=t;if(!n||!s||typeof s>"u"||s==="")return r;const c=(Array.isArray(s)?s:[s]).map(u=>n.toLowerCase().indexOf(" id")!==-1&&u.indexOf(",")===-1?`"${u}"`:u).join();return`${r}${n}:${c}${e}`},"").slice(0,-e.length):""}function lt(a,e=!1){return a?Object.keys(a).reduce((r,t)=>{const n={};return t===p.IMAGE?e?n[`${t} ID`]=a[t]:n[`${t} SHA`]=a[t]:t===p.IMAGE_COMPONENT||t===p.NODE_COMPONENT?n["COMPONENT ID"]=a[t]:t===p.IMAGE_CVE||t===p.NODE_CVE||t===p.CLUSTER_CVE?n["CVE ID"]=a[t]:n[`${t} ID`]=a[t],{...r,...n}},{}):{}}function Ka(a,e=!1){const r=lt(a,e);return st(r)}function Ua(a,e){return st({...a,...lt(e)})}function Ba(a,e){return e&&a&&a[e]?a[e]:a||{}}function Ha(a,e,r){if(a===p.COMPONENT&&e===p.CVE)return"vulns";if(a===p.NODE_COMPONENT&&(e===p.CVE||e===p.NODE_CVE))return"nodeVulnerabilities";if(a===p.IMAGE_COMPONENT&&(e===p.CVE||e===p.IMAGE_CVE)||e===p.IMAGE_CVE)return"imageVulnerabilities";if(e===p.NODE_CVE)return"nodeVulnerabilities";if(e===p.CLUSTER_CVE)return"clusterVulnerabilities";if(a===p.IMAGE){if(e===p.CVE)return"vulns";if(e===p.IMAGE_CVE)return"imageVulnerabilities"}if(a===p.CLUSTER){if(e===p.CVE)return"vulns";if(e===p.ROLE)return"k8sRoles";if(e===p.CONTROL)return"complianceResults"}if(a===p.NODE){if(e===p.CVE)return"vulns";if(e===p.NODE_CVE)return"nodeVulnerabilities"}if(a===p.DEPLOYMENT){if(e===p.CVE)return"vulns";if(e===p.POLICY)return r===nt.VULN_MANAGEMENT?"policies":"failingPolicies"}if(a===p.NAMESPACE){if(e===p.CVE)return"vulns";if(e===p.ROLE)return"k8sRoles"}if(a===p.SERVICE_ACCOUNT&&e===p.ROLE)return"k8sRoles";const n=_n(e.toLowerCase()).split("_");for(let s=1;s<n.length;s+=1)n[s]=n[s].charAt(0).toUpperCase()+n[s].slice(1);return n.join("")}function Ja(a){switch(a){case p.CLUSTER:return"clusterFields";case p.IMAGE:return"imageFields";case p.NODE:return"nodeFields";case p.DEPLOYMENT:return"deploymentFields";case p.NAMESPACE:return"namespaceFields";case p.SUBJECT:return"subjectFields";case p.ROLE:return"k8RoleFields";case p.SECRET:return"secretFields";case p.POLICY:return"policyFields";case p.SERVICE_ACCOUNT:return"serviceAccountFields";case p.CONTROL:return"controlFields";case p.IMAGE_CVE:return"imageCVEFields";case p.NODE_CVE:return"nodeCVEFields";case p.CLUSTER_CVE:return"clusterCVEFields";case p.NODE_COMPONENT:return"nodeComponentFields";case p.IMAGE_COMPONENT:return"imageComponentFields";default:return""}}function Qa(a,e,r){const t={[p.IMAGE]:jn,[p.NODE]:Ft,[p.DEPLOYMENT]:Vn,[p.NAMESPACE]:at,[p.SUBJECT]:In,[p.ROLE]:zt,[p.SECRET]:$n,[p.POLICY]:Ln,[p.SERVICE_ACCOUNT]:kn,[p.CONTROL]:An},s={[nt.CONFIG_MANAGEMENT]:{...t,[p.NAMESPACE]:at,[p.SUBJECT]:qn},[nt.VULN_MANAGEMENT]:{...t,[p.NODE_COMPONENT]:Hn,[p.IMAGE_COMPONENT]:Jn,[p.CLUSTER_CVE]:Wn,[p.NODE_CVE]:Et,[p.IMAGE_CVE]:Nt,[p.IMAGE]:Bn,[p.CLUSTER]:Gn,[p.NAMESPACE]:Qn,[p.DEPLOYMENT]:Kn,[p.NODE]:Un}}[r]||t;return a===p.NODE_COMPONENT&&(e===p.CVE||e===p.NODE_CVE||e===p.CLUSTER_CVE)?Et:a===p.IMAGE_COMPONENT&&(e===p.CVE||e===p.NODE_CVE||e===p.CLUSTER_CVE)?Nt:s[e]}function Ya(a,e,r){const t=Ha(a,e,r),n=Ja(e),s=Qa(a,e,r);return{listFieldName:t,fragmentName:n,fragment:s}}function Xa(a,e,r=kt){const t=Array.isArray(a)?a[0]:a;if(!t)return null;const d={offset:e*r,limit:r};return t.id&&(d.sortOption={field:t.id,reversed:t.desc}),d}const zr={objectToWhereClause:st,entityContextToQueryObject:lt,entityContextToQueryString:Ka,getEntityWhereClause:Ua,getQueryBasedOnSearchContext:Ba,getFragmentInfo:Ya,getPagination:Xa};export{Qn as A,Un as B,Gn as C,kt as D,Hn as E,Jn as F,Dr as G,Er as H,Tr as I,Or as J,mr as K,xr as L,Sr as M,or as N,Nr as O,Pr as P,fr as R,hr as S,Dt as T,wr as V,Ga as a,lr as b,ur as c,Wa as d,yr as e,cr as f,At as g,pr as h,Cr as i,br as j,ir as k,dr as l,sr as m,ja as n,gr as o,vr as p,zr as q,wt as r,Fr as s,_r as t,Rr as u,Wn as v,Ar as w,Et as x,Kn as y,Bn as z};
