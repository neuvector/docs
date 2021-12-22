---
title: 3.x Release Notes
taxonomy:
    category: docs
---

### Release Notes for 3.x

#### 3.2.4 August 2020

##### Bug Fixes
+ OpenID and SAML login can not redirect to dashboard.
+ GKE (Anthos) cluster not showing GKE CIS Benchmarks results for non-compliance.

#### 3.2.3 August 2020 

##### Enhancements
+ Add support for AWS Bottlerocket OS.
+ Make registry filter field mandatory in Registry scan configuration since at least one filter is required.
+ Add a toggle to switch Vulnerabiities Score(V3) column between V2 and V3 CVSS scores.

##### Bug Fixes
+ CRD export which includes the 'nodes' group causes an import error.
+ Admission Control deny rule for "Count of high severity CVE with fix >= 1" incorrectly blocks image without matching criteria.
+ Disable DES/3DES cipher suites in manager TLS to address CVE-2016-2183.
+ Unable to report CVEs of JAVA applications in image scans. Fixed in the scanner updater.
+ Remove potential XSS in manager discovered in PCI scan.
+ User with space character cannot be deleted from UI console.
+ VMs outside of cluster listed as unManaged IPs under network activity view. This issue is related to how subnets are detected.
+ Fix 'Unable to acquire lock' error, related to consul issue.
+ GKE (Anthos) cluster not showing GKE CIS Benchmarks results on Ubuntu 18.04.04.

#### 3.2.2 July 2020 

##### Enhancements 
+ Report each vulnerability's published date and last modified date in the vulnerability scan result.
+ In the admission control criteria, allow users to enable a 'grace period' to accept vulnerabilities reported recently.
+ Indicate the CIS Kubernetes benchmark version on CIS reports.
+ Add a priority field to CRD yams file to allow for CRD ordering of network rules. Priority can be between 1-100.
+ Export all vulnerability data in PDF export Security Risks -> Vulnerabilities -> PDF.
+ Filter CVE's by published date in Security Risks -> Vulnerabilities display.
+ Allow multiple filter criteria of the same type in Vulnerability report in Security Risks -> Vulnerabilities (Advanced filter).
+ Scan .NET core and framework vulnerabilities including .NET mvc and web API.
+ Include package type information in image scanning. Scan results now include package types for example “ruby/gem”, “python/pypi”, “javascript/npm” in the output.
+ Add new Kubernetes vulnerability CVE-2020-8552 to platform scanning.
+ Report installed modules, labels and environment variables of the scanned image/container and reported and last updated date of vulnerabilities. Applies to image/registry, run-time and rest API calls.

Update: The previously reported enhancement "Allow bulk deleting of learned Groups from console" has been removed. If multiple (zero member) Groups are selected, only the highlighted Group will be deleted when the Remove Group button is pushed.

##### Bug Fixes 
+ Network rules lost when upgrading.
+ Network rules lost due to rule sequencing error.
+ Upgrading resulting in 'Unable to acquire lock' error. Related to process profile value size.
+ Dashboard shows Internal Error and some Groups' member show no policy mode.
+ CVE scan false positive for container scan of e2fsprogs package.
+ False positive for CVE-2019-3462.
+ Show and filter CIS benchmark's Scored and Profile attributes in Nodes, Containers compliance tabs and Security Risks -> Vulnerabilities display, filter and reports.
+ Support exact match in Security Risk -> Vulnerabilities or Compliance -> Advanced filter.
+ NeuVector Updater pod causes 'Implicit deny rule' violation.
+ SSH deny violation reported on tcp/80 connections.
+ Host identified as unmanaged on Azure advanced network plugin. Related to 'host network' issue.
+ Recommendation report for vulnerabilities in PDF is missing details. Show all namespaces and repositories.
+ Manager and Controller RestAPI does not load certificate chained properly.
+ False positives against Amazon EC2 Linux 2 image.
+ Improved internal subnet scoping.
+ Exported group yaml returns error when applied as CRD.
+ Export group policy should include environmental network rules. The fix is to allow rules FROM/TO workload:ingress to be exported.
+ Increase scanner timeout to accommodate for slow controller startups caused by environmental variables.
+ Allow multiple namespaces to be selected in security risk filter. Also allows multiple services or other targets separated by commas. Exact match or 'contains'.
+ Fixes a timing error that cause leader selection loop.
+ Configmap setup of OpenID Connect (oidc) saves configuration under wrong key name.
+ Allow user to select multiple process profile rules for a Group and delete them, or delete all process profile rules for a Group. Does not allow Federated or CRD rules to be deleted.
+ Allow using HSTS header to force https.
+ Policy violation observed when using "DNS-Name" object,  caused by the CNAME length 64 is exceeded. Extended max length to 128.
+ Implicit deny violations even though allow rules exist. Add mapping between user created group and nv.ip.xxx if domain matches.

#### 3.2.1 April 2020
Important! We have noticed a potential issue when upgrading to this version with the loss of some network rules. Before upgrading, please make a backup of your configuration in Settings -> Configuration or through the REST API. Then scale the controller pods down to 1 before initiating the upgrade. Alternatively, redeploy NeuVector (new deployment) and import the backup configuration after the deployment is complete. Carefully review all rules after upgrading.

##### Enhancements
+ IBM Security Advisor integration. Add support for IBM SA configured in Settings -> Configuration.
+ Allow namespace user to see the registry list and images whose repository name matches the user's namespace. The registry and repository configuration must still be performed by the admin.
+ Show the domain name and other info from whois for external links in Network Activity and Security Events (in addition to destination IP).
+ Add dynamic criteria support for NvClusterSecurityRule. Multiple CRDs which change the criteria for existing custom group(s) are now supported.
+ Improve usability of CRD export selection in Policy -> Groups
+ Move the tech-preview feature Parallel Scanners in 3.2.0 to GA.

##### Bug Fixes
+ LDAP login fails because group mapping fails. NeuVector now queries both dn and username.
+ CSV vulnerabilities export from Security Risks -> Vulnerabilities contains wrong entries in the image column. Container image name should appear where appropriate.
+ CVE-2020-7212 reported as false positive. CVE-2020-7212 found against Dynatrace agent image which using urllib3 version 1.24.3. The vulnerability only exists between verrsion 1.25.2 through 1.25.8.
+ Fix the issue of "Unable to create any new network rules with error "Policy deploy failed: : Unformatted error"." Related to value larger than 512K.
+ Fix the issue of Controller reporting error "Value exceeds 524288 byte limit", hard coded limits exceeded.
+ Enable multiple CRD files to be applied during Helm install. Applying many CRD's at once in helm-chart was failing due to an overload and non-serializing of applying the CRDs.
+ Container layered scan result shows inconsistent CVEs count. The total was inconsistent with the layered results.
+ Decrease false positive of privilege escalations and improve accuracy. Ignore the increasing temporary privileges which are caused by information-only system commands, such as "mount -v", "mount -l" etc.
+ Fix the issue caused by load balancer caching (e.g. F5) which causes newly created rules to fail to show up in the rule list. The rule exists but is not displayed.

#### 3.2 March 2020
##### Enhancements
+ Add a new Security Risk menu for Vulnerability and Compliance management.
  - Makes it easy to filter for viewing or downloading of reports, by typing in a search string or using advanced filters next to the box. The advanced filter allows users to filter vulnerabilities by fix available (or not available), urgency, workloads, service or namespace names.
  - Understand the Impact of vulnerabilities and compliance checks by clicking on the impact row and reviewing remediation and impacted images, nodes, or containers.
  - View the Protection State (exploit risk) of any vulnerability or compliance issue to see if there are NeuVector Run-Time security protections (rules) enabled for impacted nodes or containers.
  - Note: Vulnerabilities and compliance check results can also still be reviewed for any specific container or node in the Assets menu.
+ [Tech Preview] Enable parallel scanners to run concurrently, increasing registry image scanning performance. This capability is currently in Beta for optional deployment. The leader controller will still perform scanning, so should be counted as one scanner, in addition to others deployed. The leader controller will schedule image scanning tasks to each of the available scanners (including itself). As always, node labeling or taints/tolerations can be added to the yaml file below to control on which nodes the scanners run. Keep in mind each scanner container needs to be allocated enough memory to read and expand the largest possible image it will be scanning. See scanner deployment instructions below.
+ Add vulnerability scanning support for Amazon EC2 Linux (with Amazon's OS Advisories) and Rancher OS.
+ Enable process discovery and whitelisting for nodes (hosts). In the menu Policy -> Groups, the reserved group 'nodes' can be selected to view and customize Process Profile Rules. The protection mode can be switched from Discover to Monitor or Protect, as in other Groups. Note: Only process violations on the host/node are alerted or blocked. Network connections are never blocked on the host.
+ Easily review and create new rules from the Notifications -> Security Events menu. When viewing security events, the Review Rule button can be selected to open a box to review and edit a rule for that event. For example, a network violation or process violation can be reviewed and a rule to whitelist that event can be deployed.
+ The layered scan results can now be downloaded using the CSV download button when viewing registry image scan results.

##### Bug Fixes
+ Deletion of controllers can cause a state where multiple controllers are shown in various states.  If a controller remains in a 'left' state for a while it is now removed from the cluster.
+ Vulnerability scan of multiple containers running from the same image returns different results. This was due to a scan timing issue and is now resolved by reading results from the same source.
+ Support vulnerability scans of RancherOS.
+ Don’t scan mounted host folders when doing a container scan. The host folders are already being scanned during the node scan. This could have caused performance issues.
+ Enable the ability to disable process protection mode (self protection) through REST API and CLI on NeuVector containers to better enable debug.

##### 3.2 Parallel Scanner Deployment [Tech Preview / Beta]

Create a new role binding.
```
kubectl create rolebinding neuvector-admin --clusterrole=admin --serviceaccount=neuvector:default -n neuvector
```

Or for OpenShift
```
oc adm policy add-role-to-user admin system:serviceaccount:neuvector:default -n neuvector
```

Use the file below to deploy multiple scanners. Edit the replicas to increase or decrease the number of scanners running in parallel.
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: neuvector-scanner-pod
  namespace: neuvector
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  replicas: 2
  selector:
    matchLabels:
      app: neuvector-scanner-pod
  template:
    metadata:
      labels:
        app: neuvector-scanner-pod
    spec:
      imagePullSecrets:
        - name: regsecret
      containers:
        - name: neuvector-scanner-pod
          image: neuvector/scanner
          imagePullPolicy: Always
          env:
            - name: CLUSTER_JOIN_ADDR
              value: neuvector-svc-controller.neuvector
      restartPolicy: Always
```

Create or update the CVE database updater cron job.
```
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: neuvector-updater-pod
  namespace: neuvector
spec:
  schedule: "0 0  * * *"
  jobTemplate:
    spec:
      template:
        metadata:
          labels:
            app: neuvector-updater-pod
        spec:
          imagePullSecrets:
          - name: regsecret
          containers:
          - name: neuvector-updater-pod
            image: neuvector/updater
            imagePullPolicy: Always
            lifecycle:
              postStart:
                exec:
                  command:
                  - /bin/sh
                  - -c
                  - TOKEN=`cat /var/run/secrets/kubernetes.io/serviceaccount/token`; /usr/bin/curl -kv -X PATCH -H "Authorization:Bearer $TOKEN" -H "Content-Type:application/strategic-merge-patch+json" -d '{"spec":{"template":{"metadata":{"annotations":{"kubectl.kubernetes.io/restartedAt":"'`date +%Y-%m-%dT%H:%M:%S%z`'"}}}}}' 'https://kubernetes.default/apis/apps/v1/namespaces/neuvector/deployments/neuvector-scanner-pod'
            env:
              - name: CLUSTER_JOIN_ADDR
                value: neuvector-svc-controller.neuvector
          restartPolicy: Never
```

Please note that in this release the presence and status of multiple scanners is only visible in Kubernetes with 'kubectl get pods -n neuvector' and will not be displayed in the web console. Results from all scanners are shown in the Assets -> Registries menu. Additional scanner monitoring features will be added in future releases.

#### 3.1.4 March 2020
##### Bug Fixes
+ Don’t scan mounted host folders when doing a container scan. The host folders are already being scanned during the node scan.

#### 3.1.3 February 2020
##### Enhancements
+ Display CVE database info on the dashboard

##### Bug Fixes
+ Limit kernel vulnerabilities reported in node scan results by ignoring non-running kernel vulnerabilities
+ When filtering the Network Activity graph with namespaces and groups, items in the dropdown list are not filtered by the user's input, so it appears as if some items are missing
+ Reduce the Enforcer CPU usage when container and node rescan is triggered by a vulnerability database update
+ Fix potential liveness check failure when starting up a new pod
+ Unexpected failure when testing LDAP/AD server configurations
+ Docker runtime processes running in NeuVector containers are detected as a violation, which should not be reported
   
#### 3.1.2 January 2020
##### Enhancements
+ The base image for NeuVector containers has been upgraded to Alpine 3.11.3.
+ RSA private key format is supported for replacing the certificate for the UI console or the RESTful API.
+ Build-phase scanning for the Local setting (such as in the Jenkins plug-in) now supports scanning on other hosts besides the host where the controller/allinone is running. The docker engine API socket must be exposed through TCP. Users need to add an environment variable in the controller, SCANNER_DOCKER_URL=tcp://192.168.1.10:2376
+ The PSP (Pod Security Policies) profile is provided for when PSP is enforced in the  Kubernetes cluster.
+ NeuVector now recognizes the VLAN interface as the primary container host network interface.
+ Added 'namespaces' as a required resource in the cluster role and clusterolebinding for neuvector-app.  To update:
  - Delete existing ones:
      $ kubectl delete clusterrolebinding neuvector-binding-app
      $ kubectl delete clusterrole neuvector-binding-app
  - Create new ones, adding namespaces
      $ kubectl create clusterrole neuvector-binding-app --verb=get,list,watch,update --resource=nodes,pods,services,namespaces
      $ kubectl create clusterrolebinding neuvector-binding-app --clusterrole=neuvector-binding-app --serviceaccount=neuvector:default

##### Bug Fixes
+ Unable to scan images in the OpenShift 4.x registry if username and password credential is given to access the registry.
+ When using the latest Chrome broswser on macOS Catalina (10.15) to access the UI console, the browser doesn't give the user the option to accept the self-signed certificate. This issue now is resolved.
+ In some OpenShift 4.x installations, the platform type is not identified correctly so the admission control feature is disabled. This issue is resolved, however a new role and role-binding is required for NeuVector if installed in an OpenShift 4.x cluster.
+ When scanning a quay.io registry, the wildcard (*) match of the image tags fails.
+ When importing the 2.5 configuration to 3.x release, some container groups and DLP sensors were not created.

#### 3.1.1 December 2019
##### Bug Fixes & Enhancements
+ Mitigate an AD/LDAP mis-configuration case. AD/LDAP can be configured in a way that users are allowed to be authenticated with an empty password. This fix is to disallow a login attempt with an empty password. It's strongly recommended that the customers should fix their AD/LDAP configuration as well. NOTE: This vulnerability only affects the REST API, not console login.
+ Remove the need to restart the enforcer when a valid license is not detected.
+ Correct that occasionally CRD process rules are not deleted when the CRD is removed.
+ CRI-O runtime related improvements on reading image and container names and container states.
+ UI improvements on registry, CI-integration role settings and window size arrangements.

#### 3.1 December 2019
##### Enhancements
+ CRI-O runtime support on Openshift 4.2
+ Keep a local record after a remote user (LDAP/AD, SAML, OIDC, OpenShift) is logged in, so that the user's idle timeout, email and role attributes can be modified. The authentication will still be done remotely. The admin should remove the local record manually if the user is removed in the remote identity providers.
+ Add a ci-integration user role. This role is recommended for CI/CD integration users and serverless function scans. This role has limited functions such as initiating image scanning through plug-ins or through the REST API.

##### Bug Fixes
+ Run-time container scan shows a status of Failed when there are a lot of containers, even when the scans have completed successfully.
+ Some UI pages' browser cache are not cleared when upgrading from the previous releases. With the fix, the user doesn't need to manually clear the browser cache.
+ REST API calls will not include configured passwords and secrets in the response.


#### 3.0.2 November 2019
##### Bug Fixes
+ False reports of upgraded packages in source code scans.

#### 3.0.1 November 2019
##### Bug Fixes
+ New user creation button is missing in the Settings -> User management page.
+ Group list is misplaced in Group Policy CRD export page (Policy -> Groups).

#### 3.0 November 2019
##### Enhancements
+ Add DLP support. Configure DLP Sensors, then apply them to a Group. Any ingress or egress connections from the container group will be checked for matches.
+ Support Multiple NeuVector Clusters from Single Console. Select a Master cluster and join remote clusters to it. Rules can be Federated, ie pushed from the master to remote clusters. Federated admin can switch between clusters to manage each one from the Master console. Note: The system clocks must be in sync between clusters (controller host) for the join to succeed.
+ Support Custom Resource Definitions (CRD) for 'policy as code' creation. Sample CRD can be generated by the NeuVector Console at any time in Policy -> Groups -> Export Group Policy. Network rules are exported in 3.0.0.b2 but process and file rules will be added. Note: Any rules and configurations created by a CRD are NOT editable through the console, only through the CRD. Note: CRDs are supported in Kubernetes 1.11 and later. Deploying the NeuVector security rule CRD in earlier versions may not result in an error, but the CRD will not be processed.
+ Restructure Menu's in Console.
  - Settings has moved to lower left, to avoid confusion with Multiple Cluster settings.
  - Multiple cluster configuration is added to upper right.
  - The Security Risks tab menu items have been moved into Assets and Policy. Registries is moved to Assets, and all Vulnerability scans, CIS benchmarks etc are shown in the respective Containers or Nodes views in Resources. Admission Control rules are moved to Policy.
  - DLP Sensors are added to Policy.
+ Support customized compliance checks/tests (scripts). These can be found in Policy -> Groups.
+ A pre-defined Group for selecting all containers is added and can be used in rules or for DLP rules and other protections.
+ An option to enable syslog output in JSON format is added.
+ In the Network Activity graph filter, select multiple namespaces or services, the click the checkbox to apply.
+ Vulnerabilities within an unused kernel on hosts are not reported. If host is upgraded and the older kernel version still is installed, this will suppress vulnerability reporting (only running kernel vulnerabilities are reported).
+ Improve CPU usage for Enforcer and Controller especially when high network connections exists.
+ Improve the default NeuVector deployment yaml
  - Change the api version to apps/v1 for deployment and daemonset to support k8s 1.16. Note: with this changes, prior to kubernetes version 1.9/openshift version 3.9 is not supported.
  - Add preferred podAntiAffinity to prevent controllers running on the same node and help scheduling.
  - Add selector for deployment and daemonset to support k8s 1.16
  - Note: DaemonSet, Deployment, and ReplicaSet resources will no longer be served from extensions/v1beta1, apps/v1beta1, or apps/v1beta2 in v1.16. Migrate to the apps/v1 API, available since v1.9. Existing persisted data can be retrieved via the apps/v1 API.
+ The NeuVector Helm chart on github is updated for 3.0 and backward compatible to 2.5.x.
  - You can use the helm upgrade command. By default the fed-master and fed-worker services are not deployed so change the values.yaml to enable them as the federation.mastersvc.type or federation.managedsvc.type respectively.

##### Bug Fixes
+ Fix when two or more controllers are lost, the controller cluster can get stuck in a state where no leader can be elected. The console/controller becomes unavailable. This is observed in cases where hosts (OS or orchestration platform) are being updated and rebooted, which includes using the drain node process in the update process.

### 3.0 New Deployment
+ Refer to the appropriate Kubernetes or OpenShift section (in section Deploying NeuVector) to follow the setup and configurations. Before deploying NeuVector containers, do the following:
+ Create nvsecurityrules.yaml, then 'kubectl create -f nvsecurityrules.yaml'.
+ Add additional clusterrole and rolebindings for Kubernetes, OpenShift as shown below. Remember to change the image tags for manager, controller and enforcer to the appropriate 3.0 tag (e.g. 3.0.0.b2).
+ Use the neuvector yaml file for the 3.0 version as shown below for deploying.

### 3.0 Upgrade from 2.5.x
The following steps can be used for Kubernetes native upgrade using 'kubectl.' For Helm upgrades, see the NeuVector Helm documentation on GitHub. Note: Helm version 2.13.1 and earlier are not able to complete the upgrade successfully. Please upgrade to a later Helm version such as 2.16.5 or later.

+ Create nvsecurityrules.yaml, then 'kubectl create -f nvsecurityrules.yaml'.
+ Add additional clusterrole and rolebindings for Kubernetes, OpenShift as shown below.
+ Update neuvector yaml file to the current 3.0 version as shown below. Remember to change the image tags for manager, controller and enforcer to the appropriate 3.0 tag (e.g. 3.0.0.b2).
+ Note: When upgrading, if a controller pod gets stuck in a Pending state, you may need to delete the neuvector-controller-pod deployment and reapply the update. Also, if the Enforcers don't automatically join the cluster after the update, you may need to delete the daemon set and reapply it ($ kubectl delete ds/neuvector-enforcer-pod -n neuvector). Be sure to Export all configurations from the Settings -> Configuration page if you don't have a persistent storage backup (PVC) so you can import it back. Also, if the the nodes/enforcers are not showing after the controller upgrade, you can delete ds/neuvector-enforcer-pod and reapply the update.

Note: Additional steps may be required before upgrading from 2.4.x, 2.3.x and before.

#### nvsecurityrules
```
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: nvsecurityrules.neuvector.com
spec:
  group: neuvector.com
  names:
    kind: NvSecurityRule
    listKind: NvSecurityRuleList
    plural: nvsecurityrules
    singular: nvsecurityrule
  scope: Namespaced
  version: v1
  versions:
  - name: v1
    served: true
    storage: true

---

apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: nvclustersecurityrules.neuvector.com
spec:
  group: neuvector.com
  names:
    kind: NvClusterSecurityRule
    listKind: NvClusterSecurityRuleList
    plural: nvclustersecurityrules
    singular: nvclustersecurityrule
  scope: Cluster
  version: v1
  versions:
  - name: v1
    served: true
    storage: true
```

#### Additional 3.0 Kubernetes Clusterrole and Bindings
```
kubectl create clusterrole neuvector-binding-customresourcedefinition --verb=watch,create,get --resource=customresourcedefinitions
kubectl create clusterrolebinding  neuvector-binding-customresourcedefinition --clusterrole=neuvector-binding-customresourcedefinition --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-nvsecurityrules --verb=list,delete --resource=nvsecurityrules,nvclustersecurityrules
kubectl create clusterrolebinding neuvector-binding-nvsecurityrules --clusterrole=neuvector-binding-nvsecurityrules --serviceaccount=neuvector:default
```
#### Additional 3.0 OpenShift Clusterrole and Bindings
```
oc create clusterrole neuvector-binding-customresourcedefinition --verb=watch,create,get --resource=customresourcedefinitions
oc adm policy add-cluster-role-to-user neuvector-binding-customresourcedefinition system:serviceaccount:neuvector:default
oc create clusterrole neuvector-binding-nvsecurityrules --verb=list,delete --resource=nvsecurityrules,nvclustersecurityrules
oc adm policy add-cluster-role-to-user neuvector-binding-nvsecurityrules system:serviceaccount:neuvector:default
```

#### Kubernetes 1.9-1.16 NeuVector 3.0 Yaml
Note that type LoadBalancer is used for the fed-master and fed-worker services. You may need to customize for your deployment.

```
# neuvector yaml version for 3.0.0
apiVersion: v1
kind: Service
metadata:
  name: neuvector-service-controller-fed-master
  namespace: neuvector
spec:
  ports:
  - port: 11443
    name: fed
    protocol: TCP
  type: LoadBalancer
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-service-controller-fed-worker
  namespace: neuvector
spec:
  ports:
  - port: 10443
    name: fed
    protocol: TCP
  type: LoadBalancer
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-svc-crd-webhook
  namespace: neuvector
spec:
  ports:
  - port: 443
    targetPort: 30443
    protocol: TCP
    name: crd-webhook
  type: ClusterIP
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-svc-admission-webhook
  namespace: neuvector
spec:
  ports:
  - port: 443
    targetPort: 20443
    protocol: TCP
    name: admission-webhook
  type: ClusterIP
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-service-webui
  namespace: neuvector
spec:
  ports:
    - port: 8443
      name: manager
      protocol: TCP
  type: NodePort
  selector:
    app: neuvector-manager-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-svc-controller
  namespace: neuvector
spec:
  ports:
  - port: 18300
    protocol: "TCP"
    name: "cluster-tcp-18300"
  - port: 18301
    protocol: "TCP"
    name: "cluster-tcp-18301"
  - port: 18301
    protocol: "UDP"
    name: "cluster-udp-18301"
  clusterIP: None
  selector:
    app: neuvector-controller-pod

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: neuvector-manager-pod
  namespace: neuvector
spec:
  selector:
    matchLabels:
      app: neuvector-manager-pod
  replicas: 1
  template:
    metadata:
      labels:
        app: neuvector-manager-pod
    spec:
      imagePullSecrets:
        - name: regsecret
      containers:
        - name: neuvector-manager-pod
          image: neuvector/manager
          env:
            - name: CTRL_SERVER_IP
              value: neuvector-svc-controller.neuvector
      restartPolicy: Always

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: neuvector-controller-pod
  namespace: neuvector
spec:
  selector:
    matchLabels:
      app: neuvector-controller-pod
  minReadySeconds: 60
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  replicas: 3
  template:
    metadata:
      labels:
        app: neuvector-controller-pod
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - neuvector-controller-pod
              topologyKey: "kubernetes.io/hostname"
      imagePullSecrets:
        - name: regsecret
      containers:
        - name: neuvector-controller-pod
          image: neuvector/controller
          securityContext:
            privileged: true
          readinessProbe:
            exec:
              command:
              - cat
              - /tmp/ready
            initialDelaySeconds: 5
            periodSeconds: 5
          env:
            - name: CLUSTER_JOIN_ADDR
              value: neuvector-svc-controller.neuvector
            - name: CLUSTER_ADVERTISED_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
            - name: CLUSTER_BIND_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
          volumeMounts:
            - mountPath: /var/neuvector
              name: nv-share
              readOnly: false
            - mountPath: /var/run/docker.sock
              name: docker-sock
              readOnly: true
            - mountPath: /host/proc
              name: proc-vol
              readOnly: true
            - mountPath: /host/cgroup
              name: cgroup-vol
              readOnly: true
            - mountPath: /etc/config
              name: config-volume
              readOnly: true
          lifecycle:
            preStop:
              exec:
                # SIGTERM triggers a quick exit; gracefully terminate instead
                command: ["/usr/local/bin/consul", "leave"]
      terminationGracePeriodSeconds: 60
      restartPolicy: Always
      volumes:
        - name: nv-share
          hostPath:
            path: /var/neuvector
        - name: docker-sock
          hostPath:
            path: /var/run/docker.sock
        - name: proc-vol
          hostPath:
            path: /proc
        - name: cgroup-vol
          hostPath:
            path: /sys/fs/cgroup
        - name: config-volume
          configMap:
            name: neuvector-init 
            optional: true

---

apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: neuvector-enforcer-pod
  namespace: neuvector
spec:
  selector:
    matchLabels:
      app: neuvector-enforcer-pod
  updateStrategy:
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: neuvector-enforcer-pod
    spec:
      tolerations:
        - effect: NoSchedule
          key: node-role.kubernetes.io/master
      imagePullSecrets:
        - name: regsecret
      hostPID: true
      containers:
        - name: neuvector-enforcer-pod
          image: neuvector/enforcer
          securityContext:
            privileged: true
          env:
            - name: CLUSTER_JOIN_ADDR
              value: neuvector-svc-controller.neuvector
            - name: CLUSTER_ADVERTISED_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
            - name: CLUSTER_BIND_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
          volumeMounts:
            - mountPath: /lib/modules
              name: modules-vol
              readOnly: true
            - mountPath: /var/run/docker.sock
              name: docker-sock
              readOnly: true
            - mountPath: /host/proc
              name: proc-vol
              readOnly: true
            - mountPath: /host/cgroup
              name: cgroup-vol
              readOnly: true
      restartPolicy: Always
      volumes:
        - name: modules-vol
          hostPath:
            path: /lib/modules
        - name: docker-sock
          hostPath:
            path: /var/run/docker.sock
        - name: proc-vol
          hostPath:
            path: /proc
        - name: cgroup-vol
          hostPath:
            path: /sys/fs/cgroup
```
#### OpenShift 3.9-3.11 NeuVector 3.0 Yaml
Note that type NodePort is used for the fed-master and fed-worker services instead of LoadBalancer. You may need to adjust for your deployment.

```
# neuvector yaml version for 3.0.x. will also work for 2.5.x
apiVersion: v1
kind: Service
metadata:
  name: neuvector-service-controller-fed-master
  namespace: neuvector
spec:
  ports:
  - port: 11443
    name: fed
    protocol: TCP
  type: NodePort
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-service-controller-fed-worker
  namespace: neuvector
spec:
  ports:
  - port: 10443
    name: fed
    protocol: TCP
  type: NodePort
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-svc-crd-webhook
  namespace: neuvector
spec:
  ports:
  - port: 443
    targetPort: 30443
    protocol: TCP
    name: crd-webhook
  type: ClusterIP
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-svc-admission-webhook
  namespace: neuvector
spec:
  ports:
  - port: 443
    targetPort: 20443
    protocol: TCP
    name: admission-webhook
  type: ClusterIP
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-service-webui
  namespace: neuvector
spec:
  ports:
    - port: 8443
      name: manager
      protocol: TCP
  type: ClusterIP
  selector:
    app: neuvector-manager-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-svc-controller
  namespace: neuvector
spec:
  ports:
  - port: 18300
    protocol: "TCP"
    name: "cluster-tcp-18300"
  - port: 18301
    protocol: "TCP"
    name: "cluster-tcp-18301"
  - port: 18301
    protocol: "UDP"
    name: "cluster-udp-18301"
  clusterIP: None
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Route
metadata:
  name: neuvector-route-webui
  namespace: neuvector
spec:
  to:
    kind: Service
    name: neuvector-service-webui
  port:
    targetPort: manager
  tls:
    termination: passthrough

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: neuvector-manager-pod
  namespace: neuvector
spec:
  selector:
    matchLabels:
      app: neuvector-manager-pod
  replicas: 1
  template:
    metadata:
      labels:
        app: neuvector-manager-pod
    spec:
      containers:
        - name: neuvector-manager-pod
          image: docker-registry.default.svc:5000/neuvector/manager
          env:
            - name: CTRL_SERVER_IP
              value: neuvector-svc-controller.neuvector
      restartPolicy: Always

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: neuvector-controller-pod
  namespace: neuvector
spec:
  selector:
    matchLabels:
      app: neuvector-controller-pod
  minReadySeconds: 60
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  replicas: 3
  template:
    metadata:
      labels:
        app: neuvector-controller-pod
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - neuvector-controller-pod
              topologyKey: "kubernetes.io/hostname"
      containers:
        - name: neuvector-controller-pod
          image: docker-registry.default.svc:5000/neuvector/controller
          securityContext:
            privileged: true
          readinessProbe:
            exec:
              command:
              - cat
              - /tmp/ready
            initialDelaySeconds: 5
            periodSeconds: 5
          env:
            - name: CLUSTER_JOIN_ADDR
              value: neuvector-svc-controller.neuvector
            - name: CLUSTER_ADVERTISED_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
            - name: CLUSTER_BIND_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
          volumeMounts:
            - mountPath: /var/neuvector
              name: nv-share
              readOnly: false
            - mountPath: /var/run/docker.sock
              name: docker-sock
              readOnly: true
            - mountPath: /host/proc
              name: proc-vol
              readOnly: true
            - mountPath: /host/cgroup
              name: cgroup-vol
              readOnly: true
            - mountPath: /etc/config
              name: config-volume
              readOnly: true
          lifecycle:
            preStop:
              exec:
                # SIGTERM triggers a quick exit; gracefully terminate instead
                command: ["/usr/local/bin/consul", "leave"]
      terminationGracePeriodSeconds: 60
      restartPolicy: Always
      volumes:
        - name: nv-share
          hostPath:
            path: /var/neuvector
        - name: docker-sock
          hostPath:
            path: /var/run/docker.sock
        - name: proc-vol
          hostPath:
            path: /proc
        - name: cgroup-vol
          hostPath:
            path: /sys/fs/cgroup
        - name: config-volume
          configMap:
            name: neuvector-init 
            optional: true

---

apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: neuvector-enforcer-pod
  namespace: neuvector
spec:
  selector:
    matchLabels:
      app: neuvector-enforcer-pod
  updateStrategy:
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: neuvector-enforcer-pod
    spec:
      tolerations:
        - effect: NoSchedule
          key: node-role.kubernetes.io/master
      hostPID: true
      containers:
        - name: neuvector-enforcer-pod
          image: docker-registry.default.svc:5000/neuvector/enforcer
          securityContext:
            privileged: true
          env:
            - name: CLUSTER_JOIN_ADDR
              value: neuvector-svc-controller.neuvector
            - name: CLUSTER_ADVERTISED_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
            - name: CLUSTER_BIND_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
          volumeMounts:
            - mountPath: /lib/modules
              name: modules-vol
              readOnly: true
            - mountPath: /var/run/docker.sock
              name: docker-sock
              readOnly: true
            - mountPath: /host/proc
              name: proc-vol
              readOnly: true
            - mountPath: /host/cgroup
              name: cgroup-vol
              readOnly: true
      restartPolicy: Always
      volumes:
        - name: modules-vol
          hostPath:
            path: /lib/modules
        - name: docker-sock
          hostPath:
            path: /var/run/docker.sock
        - name: proc-vol
          hostPath:
            path: /proc
        - name: cgroup-vol
          hostPath:
            path: /sys/fs/cgroup
```



