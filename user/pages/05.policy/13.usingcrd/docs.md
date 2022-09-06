---
title: CRD - Custom Resource Definitions
taxonomy:
    category: docs
---

### NeuVector CRD for Policy As Code
NeuVector custom resource definitions (CRDs) can be used by various teams to automatically define security policies in the NeuVector container security platform. Developers, DevOps, DevSecOps, and Security teams can collaborate to automate security policies for new or updated applications deployed to production. CRDs can also be used to enforce global security policies across multiple Kubernetes clusters.

Note: CRDs are supported in Kubernetes 1.11 and later. Deploying the NeuVector security rule CRD in earlier versions may not result in an error, but the CRD will not be processed.

CRD's can be used to support many use cases and workflows:
+ Define security policy during application development, to push into production.
+ Learn behavior using NeuVector and export the CRD for review before pushing into production.
+ Migrate security policies from staging to production clusters.
+ Replicate rules across multiple replicated clusters in hybrid or multi-clouds.
+ Enforce global security policies (see examples for this at bottom).

CRD's bring many benefits, including:
+ Define / declare the security policy, as code.
+ Version and track the security policies the same as application deployment manifests.
+ Define the allowed behavior of any application including network, file and process behavior.

####Supported Resource Types
NeuVector supports two kinds of custom resource definitions.  They are the NvSecurityRule and NvClusterSecurityRule.  The difference among the two comes down to the boundary set by the definition of the scope.  The  NvSecurityRule resource is scoped at the namespace level, whereas the NvClusterSecurityRule is scoped at the cluster level.  Either of the resource types can be configured in a yaml file and can be created during deployment, as shown in the deployment instructions and examples for NeuVector.

The significance of the NvSecurityRule resource type with a scope of namespace lies in the enforcement of the configured domain of the target group, which must match the configured namespace in the NeuVector’s  CRD security policy.  This provides enforcement to prevent unwanted cross-namespace policy creation which affect a Target-Group policy rule.

For the NvClusterSecurityRule custom resource definition, this has a cluster level scope, and therefore, does not enforce any namespace boundary on a defined target.  However, the user-context that is used for importing the CRD-yaml file must have the necessary permissions to access or reside in the same namespace as the one configured in the CRD-yaml file, or the import will be rejected.

<strong>Enabling CRD Support</strong>
As described in the Kubernetes and OpenShift deployment sections (Deploying NeuVector),  the appropriate clusterroles and clusterrole bindings for custom resources and NvSecurityRules should be added first.

Then NvSecurityRule and NvClusterSecurityRule should be created using the sample yaml in those sections. NeuVector CRDs can now be deployed.

###Generating a Sample NeuVector CRD
The simplest way to see how the yaml file format looks for a NeuVector CRD is to export it from the NeuVector Console. After you have tested your application while NeuVector is in Discover mode learning the network, file, and process behavior, you can export the learned policy.

Go to the Policy -> Groups menu and click on Export Group Policy from the upper right.

![CRDExport](export_crd.png)

Then select the Groups that you wish to export, such as the three in the demo namespace above. Inspect the saved CRD yaml below to see how the NeuVector network, process, and file rules are expressed.

NOTE: In addition to the selected group(s), all 'linked' groups will also be exported. A linked group is any other group that a selected group will connect to or from as allowed by a network rule.

Sample Exported CRD

```
apiVersion: v1
items:
- apiVersion: neuvector.com/v1
  kind: NvSecurityRule
  metadata:
    name: nv.nginx-pod.demo
    namespace: demo
  spec:
    egress:
    - selector:
        criteria:
        - key: service
          op: =
          value: node-pod.demo
        - key: domain
          op: =
          value: demo
        name: nv.node-pod.demo
      action: allow
      applications:
      - HTTP
      name: nv.node-pod.demo-egress-0
      ports: any
    file: []
    ingress:
    - selector:
        criteria:
        - key: service
          op: =
          value: exploit.demo
        - key: domain
          op: =
          value: demo
        name: nv.exploit.demo
      action: allow
      applications:
      - HTTP
      name: nv.nginx-pod.demo-ingress-0
      ports: any
    process:
    - action: allow
      name: nginx
      path: /usr/sbin/nginx
    - action: allow
      name: pause
      path: /pause
    - action: allow
      name: ps
      path: /bin/ps
    target:
      selector:
        criteria:
        - key: service
          op: =
          value: nginx-pod.demo
        - key: domain
          op: =
          value: demo
        name: nv.nginx-pod.demo
      policymode: Monitor
- apiVersion: neuvector.com/v1
  kind: NvSecurityRule
  metadata:
    name: nv.node-pod.demo
    namespace: demo
  spec:
    egress:
    - selector:
        criteria:
        - key: address
          op: =
          value: google.com
        name: test
      action: allow
      applications:
      - SSL
      name: test-egress-1
      ports: any
    - selector:
        criteria:
        - key: service
          op: =
          value: redis-pod.demo
        - key: domain
          op: =
          value: demo
        name: nv.redis-pod.demo
      action: allow
      applications:
      - Redis
      name: nv.redis-pod.demo-egress-2
      ports: any
    - selector:
        criteria:
        - key: service
          op: =
          value: kube-dns.kube-system
        - key: domain
          op: =
          value: kube-system
        name: nv.kube-dns.kube-system
      action: allow
      applications:
      - DNS
      name: nv.kube-dns.kube-system-egress-3
      ports: any
    file: []
    ingress: []
    process:
    - action: allow
      name: curl
      path: ""
    - action: allow
      name: node
      path: /usr/bin/nodejs
    - action: allow
      name: pause
      path: /pause
    - action: allow
      name: ps
      path: /bin/ps
    - action: allow
      name: sh
      path: /bin/dash
    - action: allow
      name: whoami
      path: /usr/bin/whoami
    target:
      selector:
        criteria:
        - key: service
          op: =
          value: node-pod.demo
        - key: domain
          op: =
          value: demo
        name: nv.node-pod.demo
      policymode: Protect
- apiVersion: neuvector.com/v1
  kind: NvSecurityRule
  metadata:
    name: nv.redis-pod.demo
    namespace: demo
  spec:
    egress: []
    file: []
    ingress: []
    process:
    - action: allow
      name: pause
      path: /pause
    - action: allow
      name: redis-server
      path: /usr/local/bin/redis-server
    target:
      selector:
        criteria:
        - key: service
          op: =
          value: redis-pod.demo
        - key: domain
          op: =
          value: demo
        name: nv.redis-pod.demo
      policymode: Monitor
- apiVersion: neuvector.com/v1
  kind: NvSecurityRule
  metadata:
    name: nv.kube-dns.kube-system
    namespace: kube-system
  spec:
    egress: null
    file: null
    ingress: null
    process: null
    target:
      selector:
        criteria:
        - key: service
          op: =
          value: kube-dns.kube-system
        - key: domain
          op: =
          value: kube-system
        name: nv.kube-dns.kube-system
      policymode: Monitor
- apiVersion: neuvector.com/v1
  kind: NvSecurityRule
  metadata:
    name: nv.exploit.demo
    namespace: demo
  spec:
    egress: null
    file: null
    ingress: null
    process: null
    target:
      selector:
        criteria:
        - key: service
          op: =
          value: exploit.demo
        - key: domain
          op: =
          value: demo
        name: nv.exploit.demo
      policymode: Monitor
kind: List
metadata: null
```

For example:
+ This is a namespaced CRD, of NvSecurityRule
+ nginx-pod.demo can talk to node-pod.demo over HTTP, and allowed processes are listed
+ node-pod.demo can talk to redis-pod.demo using the Redis protocol
+ The policymode of the services are set to Monitor mode
+ node-pod.demo is allowed to egress to google.com using SSL
+ Group names such as nv.node-pod.demo are referenced but not defined in the CRD, so are expected to already exist when deployed. See below for defining Groups.


### Policy Mode Configuration and Group Definition
Policy mode configuration and Group definition is supported within the CRD configuration yaml file.  With policymode configured in the yaml configuration file, importing such file will set the target group to this value for the CRD import.  

Important! The imported target policy mode is not allowed to be modified from the NeuVector console (Policy -> Groups). For example, once the mode is set to Monitor, it can only be changed through CRD modification, not through the console.

Note: The CRD import behavior ignores the PolicyMode of any 'linked' group, leaving the Policy mode unchanged if the linked group already exists. If the linked group does not exist it will be automatically created and set to the default New Services Mode in Settings -> Configuration.

####Policy Mode Configuration Requirements
+ Mode only applies to the configured Target group
+ The target group configuration must have the format nv.SERVICE_NAME.DOMAIN. 
    - Example:  nv.xxx.yyy
    - xxx.yyy=SERVICE
    - yyy=DOMAIN
+ Supported values are Discover, Monitor, and Protect 
+ The target group must contain the key-value pair key: service
+ A configured key: domain must match the service domain suffix with the configured service key-value pair

Policy Mode Configuration Yaml file Example
```
  target:
      policymode: Protect
      selector:
          name: nv.xxx.yyy
          criteria:
          - key: service            #1 of 2 Criteria must exist
            value: xxx.yyy
            op: "="
          - key: domain             #2 of 2 Criteria must exist
            value: yyy
            op: "="
```

### CRD Policy Rules Syntax and Semantics

<strong>Group Name</strong>
+ Avoid using names which start with fed., nv.ip., host:, or workload: which are reserved for federated groups or ip based services. 
+ You can use node, external, or containers as a group name. However, this will be the same as the reserved default group names, so a new group will not be created. Any group definition criteria in the CRD will be ignored, but the rules for the group will be processed. The new rules will be shown under the group name.
+ Meets the criteria: ^[a-zA-Z0-9]+[.:a-zA-Z0-9_-]*$
+ Must not begin with fed, workload, or nv.ip
+ If the name has the format as nv.xxx.yyy, then there must exist a matching service and domain definition, or the import validation will fail.  Please refer to the above Policy Mode Configuration for details.
+ If the group name to be imported already exists in the destination system, then the criteria must match between the imported CRD and the one in the destination system.  If there are differences, the CRD import will be rejected.

<strong>Policy Name</strong>
+ Needs to be unique within a yaml file.
+ Cannot be empty.

<strong>Ingress</strong>
+ Is the traffic inbound to the target.

<strong>Egress</strong>
+ Is the traffic leaving from the target.

<strong>Criteria</strong>
+ Must not be empty unless the name is nodes, external, or containers
+ name - If the name has the service format nv.xxx.yyy, then refer to the above section Policy Mode Configuration section details
+ key - The key conforms to the regular expression pattern ^[a-zA-Z0-9]+[.:a-zA-Z0-9_-]*$
+ op (operation)
    - string = "=" 
    - string = "!="
    - string = "contains"
    - string = "prefix"
    - string = "regex"
    - string = "!regex"
+ value - A string without limitations
+ key - Must not be empty
+ op - Operator
    - If the operator is equal (=) or not-equal (!=), then its’ value must not be empty.
    - If the operator is equal (=) or not-equal (!=) with a value (such as * or ?), then the value cannot have any regular expresssion format like ^$.
    - Example:
    - Key: service
    - Op :  =
    - Value: ab?c*e^$  (this is incorrect)
+ Action - Allow or deny
+ Applications (supported values)
    - ActiveMQ
    - Apache
    - Cassandra
    - Consul
    - Couchbase
    - CouchDB
    - DHCP
    - DNS
    - Echo
    - ElasticSearch
    - etcd
    - GRPC
    - HTTP
    - Jetty
    - Kafka
    - Memcached
    - MongoDB
    - MSSQL
    - MySQL
    - nginx
    - NTP
    - Oracle
    - PostgreSQL
    - RabbitMQ
    - Radius
    - Redis
    - RTSP
    - SIP
    - Spark
    - SSH
    - SSL
    - Syslog
    - TFTP
    - VoltDB
    - Wordpress
    - ZooKeeper
+ Port - The specified format is xxx/yyy. Where xxx=protocol(tcp, udp), and yyy=port_number (0-65535).
    - TCP/123 or TCP/any
    - UDP/123 or UDP/123
    - ICMP
    - 123 = TCP/123
+ Process - A list of process with action, name, path for each
    - action: allow/deny  #This action has precedence over the file access rule.  This should be set to allow if the intent is to allow the file access rule to take effect.
    - name: process name
    - path: process path (optional)
+ File - A list of file access rules; these apply only to the defined target container group
    - app: list of apps
    - behavior: block_access / monitor_change  #This blocks access to the defined filter below.  If monitor_change is chosen, then a security-event will be generated from the NeuVector’s webconsole Notifications > Security events page.
    - filter:  path/filename
    - recursive: true/false


###RBAC Support with CRDs
Utilizing Kubernetes existing RBAC model, NeuVector extends the CRD (Custom Resource Definition) to support RBAC by utilizing Kubernetes’s Rolebinding in association with the configured Namespace in the NeuVector  configured CRD rules when using the NvSecurityRule resource-type. This configured Namespace is then used to enforce the configured Target, which must reside in this namespace configured in the NeuVector security policy. When rolebinding a defined clusterrole, this can be used to bind to a Kubernetes User or Group. The two clusterrole resources types that NeuVector supports are NvSecurityRule and NvClusterSecurityRule.

<strong>Rolebinding & Clusterolebinding with 2 Users in different Namespaces to a Clusterrole 
(NvSecurityRules & NvClusterSecurityRules resources)</strong>

The following illustrates a scenario creating one Clusterrole containing both resources (NvSecurityRules and NvClusterSecurityRules) to be bound to two different users.  

One user (user1) belongs to Namespace (ns1), while the other user (user2) belongs to Namespace (ns2).  User1 will Rolebind to this created Clusterrole (nvsecnvclustrole), while User2 is Clusterrolebind to this same Clusterrole (nvsecnvclustrole).  

The key takeaway here is to illustrate that using Rolebinding, this will have Namespace-Level-Scope, whereas using Clusterrolebinding will have Cluster-Level-Scope.  User1 will Rolebind (Namespace-Level-Scope), and User2 will be Clusterrolebind (Cluster-Level-Scope).  This matters most during RBAC enforcement based on the scope-level that bounds the created users access.  

<strong>Example using 2 different types of defined yaml files, and the effect of using each user</strong>

1. Create a Clusterrole containing both NvSecurityRules and NvClusterSecurityRules resources. 
Note: Notice that this clusterrole has 2 resources configured, nvsecurityrules and nvclustersecurityrules. Example (nvsecnvclustroles.yaml):
```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
   name: nvsecnvclustrole
rules:
- apiGroups:
  - neuvector.com
  resources:
  - nvsecurityrules
  - nvclustersecurityrules
  verbs:
  - list
  - delete
  - create 
  - get 
  - update
- apiGroups:
  - apiextensions.k8s.io
  resources:
  - customresourcedefinitions
  verbs:
  - get
  - list
```

2. Create 2 test yaml-files. One for the NvSecurityRules, and the other for the NvClusterSecurityRules resource.
Sample NvSecurityRules nvsecurity.yaml file:
```
apiVersion: neuvector.com/v1
kind:     NvSecurityRule
metadata:
  name:    ns1crd
  namespace: ns1
spec:
  target:
      selector:
          name: nv.nginx-pod.ns1
          criteria:
          - key: service
            value: nginx-pod.ns1
            op: "="
          - key: domain
            value: ns1
            op: "="
  ingress: 
      -   
        selector:
            name: ingress
            criteria:
            - key: domain
              value: demo
              op: "=" 
        ports: "tcp/65535"
        applications: 
            - SSL
        action:  allow 
        name:    ingress
```
```
Sample NvClusterSecurityRules nvclustersecurity.yaml file
apiVersion: neuvector.com/v1
kind:     NvClusterSecurityRule
metadata:
  name:    rbacnvclustmatchnamespacengtargserving
  namespace: nvclusterspace 
spec:
  target:
      policymode: Protect
      selector:
          name: nv.nginx-pod.eng
          criteria:
          - key: service
            value: nginx-pod.eng
            op: "="
          - key: domain
            value: eng
            op: "="
  ingress: 
      -   
        selector:
            name: ingress
            criteria:
            - key: service
              value: nginx-pod.demo
              op: "=" 
        ports: "tcp/65535"
        applications: 
            - SSL
        action:  allow 
        name:    ingress
```

3. Switching the user-context to user1 (belongs to the ns1 Namespace) has a Rolebind to the NvSecurityRules resource, who is Namespace bound to the Namespace ns1.  Therefore, importing test yaml file (kubectl create –f nvsecurity.yaml should be allowed since this yaml file configuration has the NvSecurityRules resource and the Namespace that this user is bound to.

If there is an attempt to import the test yaml file (nvclustersecurity.yaml ) however, this will be denied since the import CRD yaml file is defined with the resource NvClusterSecurityRules that has a Cluster-Scope, but user1 was Rolebind with a Namespace-Scope.  Namespace-scope has a lower privilege than Cluster-Scope.  Therefore, Kubernetes RBAC will deny such a request.

Example Error Message:
```
Error from server (Forbidden): error when creating "rbacnvclustnamespacengtargnvclustingress.yamltmp": nvclustersecurityrules.neuvector.com is forbidden: User "user1" cannot create resource "nvclustersecurityrules" in API group "neuvector.com" at the cluster scope
```

Next, we can switch the user-context to user2 with a broader scope privilege, cluster-level-scope.  This user2 has a Clusterrolebinding that is not Namespace bound, but has a cluster-level-scope, and associates with the NvClusterSecurityRules resource.  

Therefore, using user2 to import either yaml file (nvsecurity.yaml
or nvclustersecurity.yaml) will be allowed, since this user’s Clusterrolebinding is not restricted to either resource NvSecurityRules (Namespace-Scope) or NvClusterSecurityRules (Cluster-Scope).

###Customized Configurations for Deployed Applications
With the use of a customized CRD yaml file, this enables you to customize network security rules, file access rules, and process security rules, all bundled into a single configuration file.  There are multiple benefits to allow these customizations.  
+ First, this allows the same rules to be applied on multiple Kubernetes environments, allowing synchronization among clusters. 
+ Second, this allows preemptive rules deployment prior to the applications coming online, which provides a proactive and effective security rules deployment workflow.  
+ Third, this allows the policymode to change from an evaluation one (such as Discover or Monitor), to one that protects the final staging environment.  

These CRD rules within a yaml file can be imported into the NeuVector security platform through the use of Kubernetes CLI commands such as 'kubectl create –f crd.yaml'.  This empowers the security team to tailor the security rules to be applied upon various containers residing in the Kubernetes environment.  

For example, a particular yaml file can be configured to enable the policymode to Discover or Monitor a particular container named nv.alpine.ns1 in a staging cluster environment.  Moreover, you can limit ssh access for a configured target container nv.alpine.ns1. to another container nv.redhat.ns2.  

Once all the necessary tests and evaluations of such security rules are deemed correct, then you can migrate this to a production cluster environment simultaneous to the application deployments by using the NeuVector policy migration feature, which will be discussed later in this section.  

<strong>Examples of CRD configurations that perform these functions</strong>

The following is a sample snippet of such configurations
```
apiVersion: neuvector.com/v1
kind:     NvSecurityRule
metadata:
  name:    ns1global
  namespace: ns1              #The target's native namespace
spec:
  target:
      selector:
          name: nv.alpine.ns1
          criteria:
          - key: service
            value: alpine.ns1   #The source target's running container
            op: "="
          - key: domain
            value: ns1
            op: "="
  egress:
      - 
        selector:
            name: egress
            criteria:
            - key: service
              value: nv.redhat.ns2      #The destination's running container    
              op: "="
        ports:   tcp/22                     #Denies ssh to the destination container nv.redhat.ns2
        applications:
            - SSH
        action:  deny 
        name:    egress
  file:                                       #Applies only to the defined target container group
  - app:
    - chmod                              #The application chmod is the only application allowed to access, while all other apps are denied.
    behavior: block_access      #Supported values are block_access and monitor_change.  This blocks access to the defined filter below.
    filter: /tmp/passwd.txt
    recursive: false
  process:
  - action: allow                  #This action has precedence over the file access rule.  This should be allowed if the intent is to allow the file access rule to take effect.
    name: chmod                # This configured should match the application defined under the file section.
    path: /bin/chmod
```

The above snippet is configured to enforce ssh access from the target group container nv.alpine.ns1 to the egress group nv.redhat.ns2.  In addition, the enforcement of file access and the process rules are defined and applied to the configured target container nv.alpine.ns1.  With this bundled configuration, we have allowed the defined network, file, and process security rules to act upon the configured target group.


###Policy Groups and Rules Migration Support
NeuVector supports the exporting of certain NeuVector group types from a Kubernetes cluster in a yaml file and importing into another Kubernetes cluster by utilizing native kubectl commands.  

<strong>Migration Use Cases</strong>
+ Export tested CRD groups and security rules that are deemed “production ready” from a staging k8s cluster environment to a production k8s cluster environment.
+ Export learned security rules to be migrated from a staging k8s environment to a production k8s environment.
+ Allow the modification of the policymode of a configured Target group, for instance, such as Discover or Monitor mode in a staging environment, to Protect mode in a production environment.


<strong>Supported Export Conditions</strong>
+ Target, Ingress, Egress, Self-learned

<strong>Example of groups export</strong>
+ Exported groups with a configured attribute as domain=xx are exported with the Resource-Type NvsecurityRule along with the namespace.

![GroupExport](group_crd.png)

<strong>Example of an exported group yaml file with the NvsecurityRule resource type</strong>
```
  kind: NvSecurityRule
  metadata:
    name: nv.nginx-pod.neuvector
    namespace: neuvector
  spec:
    egress: []
    file: []
    ingress: []
    process: []
    target:
      selector:
        criteria:
        - key: service
          op: =
          value: nginx-pod.neuvector
        - key: domain
          op: =
          value: neuvector
        name: nv.nginx-pod.neuvector
      policymode: Discover
```
+ Exported groups without the defined criteria as domain=xx (Namespace) are exported with a Resource-Type NvClusterSecurityRule and a Namespace as default.  Examples of Exported groups without a Namespace are external, container, etc.

<strong>Example of an exported group yaml file with the NvClusterSecurityRule resource type</strong>
```
  kind: NvClusterSecurityRule
  metadata:
    name: egress
    namespace: default
  spec:
    egress: []
    file:             #File path profile applicable to the Target group only, and only applies to self-learned and user create groups 
    - app:
      - vi
      - cat     
      behavior: block_access
      filter: /etc/mysecret              #Only vi and cat can access this file with “block_access”.
      recursive: false
    ingress:
    - selector:
        criteria:
        - key: service
          op: =
          value: nginx-pod.neuvector
        - key: domain
          op: =
          value: neuvector
        name: nv.nginx-pod.neuvector     #Group Name
      action: allow
      applications:
      - Apache
      - ElasticSearch
      name: egress-ingress-0             #Policy Name
      ports: tcp/9400
    process:      #Process profile applicable to the Target group only, and only applies to self-learned and user create groups.
       - action: deny     #Possible values are deny and allow
          name: ls
          path: /bin/ls        #This example shows it denies the ls command for this target.
    target:
      selector:
        criteria:
        - key: service
          op: =
          value: nginx-pod.demo
        name: egress                     #Group Name
      policymode: null
- apiVersion: neuvector.com/v1
  kind: NvSecurityRule
  metadata:
    name: ingress
    namespace: demo
  spec:
```

Note: The CRD import behavior ignores the PolicyMode of any 'linked' group, leaving the Policy mode unchanged if the linked group already exists. If the linked group does not exist it will be automatically created and set to the default New Services Mode in Settings -> Configuration.


<strong>Unsupported Export Group-Types</strong>
+ Federated 
+ IP-Based

<strong>Import Scenarios</strong>
+ The import will create new groups in the destination system if the groups do not yet exist in the destination environment, and the currently used Kubernetes user-context has the necessary permissions to access the namespaces configured in the CRD-yaml file to be imported.
+ If the imported group exists in the destination system with different criteria or values, the import will be rejected.
+ If the imported group exists in the destination system with identical configurations, we will reuse the existing group with different type.

###CRD Samples for Global Rules

The sample CRD below has two parts:

1. The first part is a NvClusterSecurityRule for the group named containers:
   
The target for this NvClusterSecurityRule is all containers. It has an ingress policy that does not allow any external connections (outside your cluster) to ssh into your containers. It also denies all containers from using the ssh process.  This defined global behavior applies to all containers.

2. The second part is a NvSecurityRule for a alpine services:

The target is a service called nv.alpine.default in the 'default' namespace. Because it belongs to the all containers, it will inherit the above network policy and process rule. It also adds rules that don't not allow connections of HTTP traffic through port 80 to an external network. Also it not allow the running of the scp process.

Note that for service nv.alpine.default (defined as nv.xxx.yyy where xxx is the service name like alpine, yyy is the namespace like default) we can define policy mode that it is set to. Here it is defined as Protect mode (blocking all abnormal activity). 

Overall since nv.alpine.defult is in protect mode, it will deny containers from running ssh and scp, and also will deny ssh connections from external or http to external.

If you change the nv.alpine.defult policymode to monitor, then NeuVector will just log it when scp/ssh is invoked, or there are ssh connections from external or http to external. 


```
apiVersion: v1
items:
- apiVersion: neuvector.com/v1
  kind: NvClusterSecurityRule
  metadata:
    name: containers
    namespace: default
  spec:
    egress: []
    file: []
    ingress:
    - selector:
        criteria: []
        name: external
      action: deny
      applications:
      - SSH
      name: containers-ingress-0
      ports: tcp/22
    process:
    - action: deny
      name: ssh
      path: /bin/ssh
    target:
      selector:
        criteria:
        - key: container
          op: =
          value: '*'
        name: containers
      policymode: null
- apiVersion: neuvector.com/v1
  kind: NvSecurityRule
  metadata:
    name: nv.alpine.default
    namespace: default
  spec:
    egress:
    - selector:
        criteria: []
        name: external
      action: deny
      applications:
      - HTTP
      name: external-egress-0
      ports: tcp/80
    file: []
    ingress: []
    process:
    - action: deny
      name: scp
      path: /bin/scp
    target:
      selector:
        criteria:
        - key: service
          op: =
          value: alpine.default
        - key: domain
          op: =
          value: default
        name: nv.alpine.default
      policymode: Protect
kind: List
metadata: null
```

To allow, or whitelist a process such as a monitoring process to run, just add a process rule with action: allow for the process name, and add the path.  The path must be specified for allow rules but is optional for deny rules.

### Updating CRD Rules and Adding to Existing Groups
Updating the CRD generated rules in NeuVector is as simple as updating the appropriate yams file and applying the update 'kubectl apply -f <crdrule.yaml>'.

#### Dynamic criteria support for NvClusterSecurityRule  
Multiple CRDs which change the criteria for existing custom group(s) are supported. This feature also allows the user to apply multiple CRDs at once, where the NeuVector behavior is to accept and queue the CRD so the immediate response to the user is always success.  During processing, any errors are reported into the console Notifications -> Events. 

