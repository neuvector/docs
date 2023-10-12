---
title: 5.x Release Notes
taxonomy:
    category: docs
---

### Release Notes for 5.x

#### 5.2.2-s1 October 2023

#####Security Update
+ Update packages to remediate CVEs including High CVE-2023-38545 and CVE-2023-43804.

#### 5.2.2 October 2023

##### Security Advisory for CVE-2023-32188
+ Remediate CVE-2023-32188 “JWT token compromise can allow malicious actions including Remote Code Execution (RCE)” by auto-generating certificate used for signing JWT token upon deployment and upgrade, and auto-generating Manager/RESTful API certificate during Helm based deployments.
  - Certificate for JWT-signing is created automatically by controller with validity of 90days and rotated automatically.
  - Auto-generation of Manager, REST API, and registry adapter certificate requires using Helm-based install using NeuVector helm version 2.6.3 or later. 
  - Built-in certificate is still used for yaml based deployments if not replaced during deployment; however, it is recommended to replace these (see next line).
  - Manual [replacement of certificate](/configuration/console/replacecert) is still supported and recommended for previous releases or yaml based deployments. See the NeuVector GitHub security advisory [here](https://github.com/neuvector/neuvector/security/advisories/GHSA-622h-h2p8-743x) for a description.
  - Use of user-supplied certificates is still supported as before for both Helm and yaml based deployments.
+ Add additional controls on custom compliance scripts. By default, custom script are now not allowed to be added, unless the environment variable CUSTOM_CHECK_CONTROL is added to Controller and Enforcer. Values are "disable" (default, not allowed), "strict" (admin role only), or "loose" (admin, compliance, and runtime-policy roles).
+ Prevent LDAP injection - username field is escaped.


##### Enhancements
+ Add additional scan data to CVE results sent by SYSLOG for layered scans
+ Support NVD API 2.0 for scan CVE database
+ Provide container image build date in Assets -> Container details
+ Adjust sorting for Network rules: disable sorting in Network rules view but enable sorting of network rules in Group view.
+ Enable/disable TLS 1.0 and TLS 1.1 detection/alerting with environment variables to Enforcer THRT_SSL_TLS_1DOT0, THRT_SSL_TLS_1DOT1. Disabled by default.
+ Add environment variable AUTO_PROFILE_COLLECT for Controller and Enforcer to assist in capturing memory usage when investigating memory pressure events. Set value = 1 to enable.
+ Configuration assessments against Admission Control should show all violations with one scan.
+ Add more options for CVE report criteria in Response Rules. Example 1 - "cve-high-with-fix:X" means: When # of (high vulnerability that have been fixed) >= X, trigger the response rule. Example 2 - "cve-high-with-fix:X/Y" means: When # of (high vulnerability that were reported Y days ago & have been fixed) >= X, trigger the response rule.

##### Bug Fixes
+ Export of group policy does not return any actual YAML contents
+ Improve pruning of namespaces with dedicated function
+ NeuVector namespace user cannot see assets-->namespaces
+ Skip handling the CRD CREATE/UPDATE requests if the CR's namespace is already deleted
+ Provide workaround for part of CRD groups which cannot be pruned successfully after namespaces are deleted.

#### 5.2.1 August 2023
##### Enhancements
+ Report layered scan results and additional CVE data in SYSLOG messages. This is enabled through a checkbox in Settings -> Configuration -> SYSLOG
+ Export NIST 800-53 mappings (to docker CIS benchmarks) in the exported csv compliance report
+ Support Proxy setting in image signature verification
+ Include image signature scan result in the downloaded CVE report
+ Support pod annotations for Admission Control Policies, available through the Custom criteria
+ Add Last Modified field to filter for vulnerabilities report printing, as well as Advanced Filter in Vulnerabilities view

##### Bug fixes
+ Do not create default admin with default password in initial NeuVector deployment for AWS billing (CSP adapter) offering, requiring user to use a secret to create admin username and password
+ Fix .json file which increased size and crashed a kubernetes node
+ Improve SQL injection detection logic
+ When installing the helm crd chart first before installing the NeuVector core chart, service accounts are missing
+ Image scan I.4.1 compliance result is incorrect
+ Vulnerability advanced filter report showing images from all other namespace

#### 5.2.0 July 2023 

##### Enhancements 

+ Support tokens for NeuVector API access. See Settings -> User, API Keys... to create a new API key. Keys can be set to default or custom roles.
+ Support AWS Marketplace PAYG billing for NeuVector monthly support subscriptions. Users can subscribe to NeuVector by SUSE support, billed monthly to their AWS account based on previous month's average node count usage. Details [here](https://open-docs.neuvector.com/deploying/awsmarketplace).
+ Support image signing for admission controls. Users can require NeuVector to verify that images are signed by specific parties before they can be deployed into the production environment, through an integration with Sigstore/Cosign. See Assets -> Sigstore Verifiers for creating new signature assets. Rules can then be created with criteria Image Signing and/or Image Sigstore Verifiers.
+ Enable each admission control rule to have its own mode of Monitor or Protect. A Deny action in Monitor mode will alert, and a Deny action in Protect mode will block. Allow actions are unaffected.
+ Add a new regex operator in Policy > Admission Control > Add Rule for Users and User Groups to support regex. Support operators "matches ANY regex in" and "matches NONE regex in".
+ Add support for admission control criteria such as resource limits. A new criteria is added for Resource Limits, and additional criteria are supported through the Custom Criteria settings.
+ Support invoking NeuVector scanner from Harbor registries through the [pluggable scanner](https://github.com/goharbor/pluggable-scanner-spec) interface. This requires configuration of the connection to the controller (exposed API). The Harbor adapter calls controller endpoint to trigger a scan, which can scan automatically on push. Interrogation services can be used for periodic scans. Scan results from Federation Primary controllers ARE propagated to remote clusters.  NOTE: There is an issue with the HTTPS based adapter endpoint error: please ignore Test Connection error, it does work even though an error is shown (skip certificate validation).
+ Searchable SaaS service for CVE lookups. Search the latest NeuVector CVE database to see if a specific CVE exists in the database. This service is available for NeuVector Prime (paid support subscription) customers. Contact support through your SCC portal for access.
+ Allow user to disable network protection but keep WAF/DLP functioning. Configure Network Policy Enablement in Settings -> Configuration.
+ Use less privileged services accounts as required for each NeuVector component. A variable “leastPrivilege” is introduced. The default is false. NOTE: Using the current helm chart with this variable on a release prior to 5.2.0 will not function properly.
+ Bind to non-default service account to meet CIS 1.5 5.1.5 recommendation.
+ Enable administrator to configure user default Session Time out in Settings -> Users, API Keys & Roles.
+ Customizable login banner and customizable UI header text for regulated and government deployments. Requirements for configuration can be found [here](https://open-docs.neuvector.com/configuration/customui).
+ SYSLOG support for TLS encrypted transport. Select TCP/TLS in Settings -> Configuration for SYSLOG.
+ Enable deployment of the NeuVector monitor helm chart from Rancher Manager.
+ Remove upper limit for top level domain in URL validator for registry scanning.
+ Scan golang dependencies, including run-time scans.
+ Support Debian 12 (Bookworm) vulnerability scan.
+ Add CSV export for Registry / Details to export CVEs for all images in configured registry in Assets -> Registries for a selected registry.
+ Allow NeuVector to set several ADFS certificates in parallel in x.509 certificate field.
+ Add and display the comment field for Response Rules.
+ Specify what NeuVector considers to be system containers through environment variable. For example, for Rancher and default namespaces: NV_SYSTEM_GROUPS=*cattle-system;default
+ Add support for Kubernetes 1.27 and OpenShift 4.12

##### Bug Fixes
+ Reduce repeating logs in enforcer/controller logs.
+ Multiple clusters page does not render.
+ Empty group auto-removal takes 2 hours to delete instead of 1 hour according to schedule.
+ Manually allowed network rule not getting applied and resulting in violation for pause image.
+ Blocking SSL connections even if a network rule permits the traffic under certain initial conditions.
+ Security events warning even with allowed network rules due to policy update issue in synchronization.
+ Network Activities wrongly associating custom group traffic to external.
+ Default service account token of the namespace mounted in each pod is too highly privileged.
+ Despite defining the network rules, violations getting logged under security events (false positives) when the container has stopped due to out of memory (OOM) error.
+ Allow user to disable/enable detection and protection against unmanaged container in cluster. This can be set through the Manager CLI:
```
set system detect_unmanaged_wl status -h
Usage: cli set system detect_unmanaged_wl status [OPTIONS] {true|false}

  Enable/disable detect unmanaged container
```

##### Other
+ Add "leastPrivilege" setting in Helm chart. Add helm option for New_Service_Profile_Baseline. A new Helm chart (core) version is published for 5.2.
+ Enable AWS Marketplace (billing adapter) integration settings in Helm chart.
+ Update configmap to support new features (multiple ADFS certificates, zero drift, New_Service_Profile_Baseline, SYSLOG TLS, user timeout)
+ Update supported Kubernetes versions to 1.19+, and OpenShift 4.6+ (1.19+ with CRI-O)


#### 5.1.3 May 2023 

##### Enhancements 

+ Add new vulnerability feed for scanning Microsoft .NET framework.
+ Enforcer stats are disabled by default in Prometheus exporter to improve scalability.
+ Usability improvement: Using scanner to scan single image and print the result (see example below).
+ Add imagePullPolicy check in admission control rules criteria.
+ Show warning message when CRD schema is out of date.

##### Bug Fixes

+ Network Activity screen does not render or incorrectly renders.
+ Empty group auto-removal takes 2 hours to delete instead of 1 hour according to schedule.
+ Compliance profile doesn’t show in UI console.
+ Advanced Filter in Security Events Missing "Error" Level.
+ Saved password with special character fails on future authentication attempt.
+ Multiple clusters page does not render properly when requests are high.
+ Registry detail (bottom) pane not updating.


##### Scanner Sample Output
```
Image: https://registry.hub.docker.comlibrary/alpine:3.4
Base OS: alpine:3.4.6
TOTAL: 6, HIGH: 1, MEDIUM: 5, LOW: 0, UNKNOWN: 0
┌─────────┬───────────────┬──────────┬───────────┬───────────────┬────────────┐
│ PACKAGE │ VULNERABILITY │ SEVERITY │ VERSION   │ FIXED VERSION │ PUBLISHED  │
├─────────┼───────────────┼──────────┼───────────┼───────────────┼────────────┤
│ openssl │ CVE-2018-0732 │ High     │ 1.0.2n-r0 │ 1.0.2o-r1     │ 2018-06-12 │
│         ├───────────────┼──────────┤           ├───────────────┼────────────┤
│         │ CVE-2018-0733 │ Medium   │           │ 1.0.2o-r0     │ 2018-03-27 │
│         ├───────────────┤          │           ├───────────────┼────────────┤
│         │ CVE-2018-0734 │          │           │ 1.0.2q-r0     │ 2018-10-30 │
│         ├───────────────┤          │           ├───────────────┼────────────┤
│         │ CVE-2018-0737 │          │           │ 1.0.2o-r2     │ 2018-04-16 │
│         ├───────────────┤          │           ├───────────────┼────────────┤
│         │ CVE-2018-0739 │          │           │ 1.0.2o-r0     │ 2018-03-27 │
│         ├───────────────┤          │           ├───────────────┼────────────┤
│         │ CVE-2018-5407 │          │           │ 1.0.2q-r0     │ 2018-11-15 │
└─────────┴───────────────┴──────────┴───────────┴───────────────┴────────────┘
```


#### 5.1.2 March 2023 

##### Enhancements 

+ Support virtual host based address group and policy matching network protections. This enables a use case where two different FQDN addresses are resolved to the same IP address, but different rules for each FQDN should be enforced. A new custom group with ‘address=vh:xxx.yyy’ can be created using the ‘vh:’ indicator to enable this protection. A network rule can then use the custom group as the ‘From’ source based on the virtual hostname (instead of resolved IP address) to enforce different rules for virtual hosts. 
+ Compliance containers list to exclude exited containers. 
+ Enhance DLP rules to support simple wildcard in the pattern. 
+ Add support for cri-o 1.26+ and OpenShift 4.11+.
+ Make gravatar optional.
+ Display cluster namespace resource in console / UI. 
+ Display source severity/classification (e.g. Red Hat, Ubuntu...) along with NVD severity score in console. 
+ Don’t allow SSO/RBAC disabling for Rancher and OpenShift if user is authenticated through SSO. 
+ Add auto-scan enablement and deletion of unused groups aging to configMap. 
+ Include IP address for external source/destination in csv/pdf for implicit deny violations 
+ Various performance and scalability optimizations for controller and enforcer CPU and memory usage. 
 
##### Bug Fixes 
+ Fix application slowness on GKE Container Optimized OS (COS) nodes when in Protect mode.  
+ SUSE Linux (SLES) 15.4 CVE not matching in scanner. With this fix, if the severity is provided in the feed, the vulnerability will be added to the database, even if the NVD record is missing. It is possible that the report includes vulnerabilities without CVE scores. 

##### Other 
+ Enhance Admission Control CRD options in helm https://github.com/neuvector/neuvector-helm/pull/237. 
+ Add new enforcer environment variables to helm chart.

#### 5.1.1 February, 2023

##### Enhancements
+ Add “package” as information to the syslog-event for a detected vulnerability.
+ Add Enforcer environment variable ENF_NETPOLICY_PULL_INTERVAL - Value in seconds (recommended value 60) to reduce network traffic and resulting resource consumption by Enforcer due to policy updates/recalculations. (Note: this was an undocumented addition until August of 2023).
```
           - name: ENF_NETPOLICY_PULL_INTERVAL
              value: "60"   <== regulate the pulling gap by 60 seconds
```

##### Bug Fixes
+ Empty group deletion errors "Object not found"
+ Traffic within the same container alerting/blocking
+ Unexpected implicit violations for istio egress traffic with allow rule in place
+ When upgrading from NeuVector 4.x release, incorrect pod group membership causes unexpected policy violation
+ OIDC authentication failed with ADFS when extra encoding characters appear in the request
+ High memory usage by dp creating and deleting pods
+ Update alpine to remediate several CVEs including Manager: CVE-2022-37454, CVE-2022-42919, CVE-2022-45061, CVE-2021-46848; Enforcer: CVE-2022-43551, CVE-2022-43552
+ Various UI bugs fixed

##### Other
+ Helm chart updated to enable replacement of certificate for internal communications

#### 5.1.0 December, 2022

##### Enhancements
+ Centralized, multi-cluster scanning (CVE) database. The primary (master) cluster can scan a registry/repo designated as a federated registry. The scan results from these registries will be synchronized to all managed (remote) clusters. This enables display of scan results in the managed cluster console as well as use of the results in admission control rules of the managed cluster. Registries only need to be scanned once instead of by each cluster, reducing CPU/memory and network bandwidth usage. 
+ Enhance admission control rules:
  - Custom criteria for admission control rules. Allow users to define resource criteria on all pod related fields and to be used in rules, for example item.metadata.annotationsKey contains 'neuvector', item.metadata.name='xyzzy' etc.
  - Add criteria to check for high risk RBAC settings for service accounts when deploying pods. These include criteria 'any action of workload resources', 'any action on RBAC', 'create workload resources', 'listing secrets', and 'exec into a container'.
  - Add semantic version comparison to modules for admission control rules. This enables > or < operators to applied to version numbers in rules (e.g. don't allow module curl<6.2.0 to be deployed). This allows specific version checks on installed packages.
  - Add an admission control rule for Pod Security Admission (PSA) supported in Kubernetes 1.25+.
+ Add new env variable NO_DEFAULT_ADMIN which when enabled does not create an 'admin' user. This is used for Rancher SSO integration as the default. If not enabled, persistently warn the user and record events to change the default admin password if it is not changed from default.
+ Blocking login after failed login attemps now becomes the default. The default value is 5 attempts, and configurable in Settings -> Users & Roles-> Password Profile.
+ Add new env variable for performance tuning ENF_NO_SYSTEM_PROFILES, value: "1". When enabled, it will disable the process and file monitors. No learning processes, no profile modes, no process/file (package) incidents, and no file activity monitor will be performed. This will reduce CPU/memory resource usage and file operations.
+ Add a custom auto-scaling setting for scanner pods, with value Delayed, Immediate,  and Disabled. Important: Scanner auto-scaling is not supported when scanner is deployed with an OpenShift operator, as the operator will always change the number of pods to its configured value.
  - ***Delayed strategy:***
    -  When lead controller continuously sees "task count" > 0 for > 90 seconds, a new scanner pod is started if maxScannerPods is not reached yet
    -  When lead controller continuously sees "task count" is 0 for > 180 seconds, it scales down one scanner pod if minScannerPods is not reached yet
  - ***Immediate strategy:***
    -  Every time when lead controller sees "task count" > 0, a new scanner pod is started if maxScannerPods is not reached yet
    -  When lead controller continuously sees "task count" is 0 for > 180 seconds, it scales down one scanner pod if minScannerPods is not reached yet
+ Custom groups are now able to use namespace labels, including Rancher's namespace labels. Generally, pod and namespace labels can now be added to Custom Groups.
+ Add ability to hide selected namespaces, groups in Network Activity view.
+ Full support for Cilium cni.
+ Full support of OpenShift 4.9 and 4.10.
+ Build tools are now available for the NeuVector/Open Zero Trust (OZT) project at https://github.com/openzerotrust/openzerotrust.io. 
+ NeuVector now lists the version ID and SHA256 digest for each version of the controller, manager, enforcer at https://github.com/neuvector/manifests/tree/main/versions.
+ Anonymous telemetry data (number of nodes, groups, rules) is now reported to a Rancher cloud service upon deployment to assist the project team in understanding usage behavior. This can be disabled (opt-out) in UI or with configMap (No_Telemetry_Report) or REST API.
+ (Addendum January 2023). Support for ServiceEntry based network policy with Istio. Egress network policy enforcement functionality was added in version 5.1.0 for pods to ServiceEntry destinations declared with Istio. Typically, a ServiceEntry defines how an external service referred by DNS name is resolved to a destination IP. Prior to v5.1, NeuVector could not detect and enforce rules for connections to a ServiceEntry, so all connections were classified as External. With 5.1, rules can be enforced for specific ServiceEntry destinations. IMPORTANT: If you are upgrading to v5.1 with an Istio based deployment, new rules must be created to allow these connections and avoid violation alerts. After upgrading, Implicit violations will get reported for newly visible traffic if allow rules don't exist. New traffic rules can be learned and auto-created under Discover mode. To allow this traffic, you can put the group into discover mode or create a custom group with addresses (or DNS name) and new network rule to this destination to allow the traffic. NOTE: There is a bug in 5.1.0 in the destination reported by the deny violations that do not represent the correct destination.  The bug reports both server_name and client_name are the same.  This issue will get addressed in an upcoming patch release.

##### Bug Fixes
+ Reduce controller memory consumption from unnecessary cis benchmark data created during rolling updates. This issue does not occur on new deployments.
+ Remove license from configuration screen (no longer required).

#### 5.0.6-s1 March, 2023

##### Bug Fixes
+ Update alpine packages to remediate CVEs in curl including CVE-2023-23914, CVE-2023-23915, and CVE-2023-23916

#### 5.0.6 February, 2023

##### Bug Fixes
+ High memory usage in dpMsgConnection	
+ High memory usage on dp process in enforcer if there are many learned policy rules with unmanaged workload (memory leak)
+ tcpdump is unable to start successfully when sniffering a traffic on container
+ Update alpine to remediate several CVEs including Manager: CVE-2022-37454, CVE-2022-42919, CVE-2022-45061, CVE-2021-46848; Enforcer: CVE-2022-43551, CVE-2022-43552


#### 5.0.5 November, 2022

##### Bug Fixes
+ Upgrading to 5.0.x results in an error message about Manager, Controller, Enforcer running different versions.
+ Enforcers experiencing go routine panic resulting in dp kill.  WebUI does not reflect enforcer as online.
+ Unexpected Process.Profile.Violation incident in NV.Protect group on which command on coreos.

#### 5.0.4 October, 2022

##### Security updates
+ Update alpine to remove critical CVE-2022-40674 in the manager expat library, as well as other minor CVEs.

##### Enhancements
+ Add support for Antrea CNI

##### Bug Fixes
+ Fix unexpected process.profile.violation incident in the NV.Protect group.
+ When SSL is disabled on manager UI access, user password is printed to the manager log.

#### 5.0.3 September, 2022
##### Enhancements
+ Do not display the EULA after successful restart from persistent volume.
+ Use the image filter in vulnerability profile setting to skip container scan results.
+ Support scanner in GitHub actions at https://github.com/neuvector/neuvector-image-scan-action.
+ Add Enforcer environment variables for disabling secrets scanning and running CIS benchmarks
```
    env:
      - name: ENF_NO_SECRET_SCANS  (available after v4.4.4)
        value: "1"
      - name: ENF_NO_AUTO_BENCHMARK (after v5.0.3)
        value: "1"
```

##### Bug Fixes
+ Enforcer unable to start occasionally.
+ Connection leak on multi-cluster federation environments.
+ Compliance page not loading some times in Security Risks -> Compliance 

#### 5.0.2 July 2022
##### Enhancements
+ Rancher hardened and SELinux clusters are supported.

##### Bug Fixes
+ Agent process high cpu usage on k3s systems.
+ AD LDAP groups not working properly after upgrade to 5.0.
+ Enforcer keeps restating due to error=too many open files (rke2/cilium).
+ Support log is unable to download successfully.

#### 5.0.1 June 2022
##### Enhancements
+ Support vulnerability scan of openSUSE Leap OS (in scanner image).
+ Scanner: implement wipe-out attributes during reconstructing image repo.
+ Verify NeuVector deployment and support for SELinux enabled hosts. See below for details on interim patching until helm chart is updated.
+ Distinguish between Feature Chart and Partner Charts in Rancher UI more prominently.+ Improve ingress annotation for nginx in Rancher helm chart. Add / update
ingress.kubernetes.io/protocol: https to nginx.ingress.kubernetes.io/backend-protocol: "HTTPS".
+ Current OpenShift Operator supports passthrough routes for api and federation services. Additional Helm Value parameters are added to support edge and re-encrypt route termination types. 

##### Bug Fixes
+ AKS cluster could add unexpected key in admission control webhook.
+ Enforcer is not becoming operational on k8s 1.24 cluster with 1.64 containerd runtime. Separately, enforcer sometimes fails to start.
+ Any admin-role user(local user or SSO) who promotes a cluster to fed master should be automatically promoted to fedAdmin role.
+ When sso using Rancher default admin into NeuVector on master cluster, the NeuVector login role is admin, not fedAdmin.
+ Fix several goroutine crashes.
+ Implicit violation from host IP not associated with node.
+ ComplianceProfile does not show PCI tag.
+ LDAP group mapping sometimes is not shown.
+ Risk Review and Improvement tool will result in error message "Failed to update system config: Request in wrong format".
+ OKD 3.11 - Clusterrole error shows even if it exists.

##### CVE Remediations
+ High CVE-2022-29458 cve found on ncurses package in all images.
+ High CVE-2022-27778 and CVE-2022-27782 found on curl package in Updater image.

##### Details on SELinux Support
NeuVector does not need any additional setting for SELinux enabled clusters to deploy and function. Tested deploying NeuVector on RHEL 8.5 based SELinux enabled RKE2 hardened cluster. Neuvector deployed successfully if PSP is enabled and patching Manager and Scanner deployment. The next chart release should fix the below issue.

Attached example for enabling psp from Rancher chart and given below the commands for patching Manager and Scanner deployment. The user ID in the patch command can be any number.

```
kubectl patch deploy -ncattle-neuvector-system neuvector-scanner-pod --patch '{"spec":{"template":{"spec":{"securityContext":{"runAsUser": 5400}}}}}'
kubectl patch deploy -ncattle-neuvector-system neuvector-manager-pod --patch '{"spec":{"template":{"spec":{"securityContext":{"runAsUser": 5400}}}}}'
```

Example for enabling PSP:

```
[neuvector@localhost nv]$ getenforce
Enforcing
[neuvector@localhost nv]$ sestatus
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   enforcing
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Memory protection checking:     actual (secure)
Max kernel policy version:      33

[neuvector@localhost nv]$ kk get psp
Warning: policy/v1beta1 PodSecurityPolicy is deprecated in v1.21+, unavailable in v1.25+
NAME                      PRIV    CAPS                                      SELINUX    RUNASUSER          FSGROUP     SUPGROUP    READONLYROOTFS   VOLUMES
global-restricted-psp     false                                             RunAsAny   MustRunAsNonRoot   MustRunAs   MustRunAs   false            configMap,emptyDir,projected,secret,downwardAPI,persistentVolumeClaim
neuvector-binding-psp     true    SYS_ADMIN,NET_ADMIN,SYS_PTRACE,IPC_LOCK   RunAsAny   RunAsAny           RunAsAny    RunAsAny    false            *
system-unrestricted-psp   true    *                                         RunAsAny   RunAsAny           RunAsAny    RunAsAny    false            *
[neuvector@localhost nv]$ nvpo.sh
NAME                                        READY   STATUS    RESTARTS   AGE     IP           NODE                    NOMINATED NODE   READINESS GATES
neuvector-controller-pod-54f69f7f9c-6h822   1/1     Running   0          5m51s   10.42.0.29   localhost.localdomain   <none>           <none>
neuvector-enforcer-pod-jz77b                1/1     Running   0          5m51s   10.42.0.30   localhost.localdomain   <none>           <none>
neuvector-manager-pod-588488bb78-p6vf9      1/1     Running   0          111s    10.42.0.32   localhost.localdomain   <none>           <none>
neuvector-scanner-pod-87474dcff-s8vgt       1/1     Running   0          114s    10.42.0.31   localhost.localdomain   <none>           <none>
```


#### 5.0.0 General Availability (GA) Release May 2022
#####Enhancements
+ Automated Promotion of Group Modes. Promotes a Group’s protection Mode based on elapsed time and criteria. Does not apply to CRD created Groups. This features allows a new application to run in Discover for some time period, learning the behavior and NeuVector creating allow-list rules for Network and Process, then automatically moving to Monitor, then Protect mode. Discover to Monitor criterion: Elapsed time for learning all network and process activity of at least one live pod in the Group. Monitor to Protect criterion: There are no security events (network, process etc) for the timeframe set for the Group.
+ Support for Rancher 2.6.5 Apps and Marketplace chart. Deploys into cattle-neuvector-system namespace and enables SSO from Rancher to NeuVector. Note: Previous deployments from Rancher (e.g. Partner catalog charts, version 1.9.x and earlier), must be completely removed in order to update to the new chart.
+ Support scanning of SUSE Linux (SLE, SLES), and Microsoft Mariner
+ Zero-drift process and file protection. This is the new default mode for process and file protections. Zero-drift automatically allows only processes which originate from the parent process that is in the original container image, and does not allow file updates or new files to be installed. When in Discover or Monitor mode, zero-drift will alert on any suspicious process or file activity. In Protect mode, it will block such activity. Zero-drift does not require processes to be learned or added to an allow-list. Disabling zero-drift for a group will cause the process and file rules listed for the group to take effect instead.
+ Split policy mode protection for network, process/file. There is now a global setting available in Settings -> Configuration to separately set the network protection mode for enforcement of network rules. Enabling this (default is disabled), causes all network rules to be in the protection mode selected (Discover, Monitor, Protect), while process/file rules remain in the protection mode for that Group, as displayed in the Policy -> Groups screen. In this way, network rules can be set to Protect (blocking), while process/file policy can be set to Monitor, or vice versa.
+ WAF rule detection, enhanced DLP rules (header, URL, full packet). Used for ingress connections to web application pods as well as outbound connections to api-services to enforce api security.
+ CRD for WAF, DLP and admission controls. NOTE: required additional cluster role bindings/permissions. See Kubernetes and OpenShift deployment sections. CRD import/export and versioning for admission controls supported through CRD. 
+ Rancher SSO integration to launch NeuVector console through Rancher Manager. This feature is only available if the NeuVector containers are deployed through Rancher. This deployment pulls from the mirrored Rancher repository (e.g. rancher/mirrored-neuvector-controller:5.0.0) and deploys into the cattle-neuvector-system namespace. NOTE: Requires updated Rancher release 2.6.5 May 2022 or later, and only admin and cluster owner roles are supported at this time.
+ Supports deployment on RKE2.
+ Support for Federation of clusters (multi-cluster manager) through a proxy. Configure proxy in Settings -> Configuration, and enable proxy when configuring federation connections.
+ Monitor required rbac's clusterrole/bindings and alert in events and UI if any are missing.
+ Support criteria of resource limitations in admission control rules.
+ Support Microsoft Teams format for webhooks.
+ Support AD/LDAP nested groups under mapped role group.
+ Support clusterrolebindings or rolebindings with group info in IDP for Openshift.
+ Allow network rules and admission control rules to be promoted to a Federated rule.

#####Bug Fixes
+ Fix issue of worker federation role backup should restore into non-federated clusters.
+ Improve page loading times for large number of CVEs in Security Risks -> Vulnerabilities
+ Allow user to switch mode when they select all groups in Policy -> Groups menu. Warn if the Nodes group is also selected.
+ Collapse compliance check items of the same name and make expandable.
+ Enhance security of gRPC communications.
+ Fixed: unable to get correct workload privileged info in rke2 setup.
+ Fix issue with support of openSUSE Leap 15.3 (k8s/crio).


####Other Updates
+ Helm chart update appVersion to 5.0.0 and chart version to 2.2.0
+ Removed serverless scanning feature/menu.
+ Removed support for Jfrog Xray scan result integration (Artifactory registry scan is still supported).
+ Support for deployment on ECS is no longer provided. The allinone should still be able to be deployed on ECS, however, the documentation of the steps and settings is no longer supported.


### Upgrading from NeuVector 4.x to 5.x (prior to 5.2.x)

NOTE: The instructions below apply to upgrades to 5.0.x and 5.1.x. For 5.2.x, service accounts and bindings have changed, and should be [reviewed](https://open-docs.neuvector.com/deploying/kubernetes#deploy-neuvector) to plan upgrades.

For Helm users, update to NeuVector Helm chart 2.0.0 or later. If updating an Operator or Helm install on OpenShift, see note below.

1. Delete old neuvector-binding-customresourcedefinition clusterrole
```
kubectl delete clusterrole neuvector-binding-customresourcedefinition
```

2. Apply new update verb for neuvector-binding-customresourcedefinition clusterrole
```
kubectl create clusterrole neuvector-binding-customresourcedefinition --verb=watch,create,get,update --resource=customresourcedefinitions
```

3. Delete old crd schema for Kubernetes 1.19+
```
kubectl delete -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/crd-k8s-1.19.yaml
```

4. Create new crd schema for Kubernetes 1.19+
```
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/crd-k8s-1.19.yaml
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/waf-crd-k8s-1.19.yaml
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/dlp-crd-k8s-1.19.yaml
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/admission-crd-k8s-1.19.yaml
```

5. Create a new Admission, DLP and WAF clusterrole and clusterrolebinding
```
kubectl create clusterrole neuvector-binding-nvwafsecurityrules --verb=list,delete --resource=nvwafsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvwafsecurityrules --clusterrole=neuvector-binding-nvwafsecurityrules --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-nvadmissioncontrolsecurityrules --verb=list,delete --resource=nvadmissioncontrolsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvadmissioncontrolsecurityrules --clusterrole=neuvector-binding-nvadmissioncontrolsecurityrules --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-nvdlpsecurityrules --verb=list,delete --resource=nvdlpsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvdlpsecurityrules --clusterrole=neuvector-binding-nvdlpsecurityrules --serviceaccount=neuvector:default
```

6. Update image names and paths for pulling NeuVector images from Docker hub (docker.io), e.g.
+ neuvector/manager:5.0.0
+ neuvector/controller:5.0.0
+ neuvector/enforcer:5.0.0
+ neuvector/scanner:latest
+ neuvector/updater:latest

Optionally, remove any references to the NeuVector license and registry secret in Helm charts, deployment yaml, configmap, scripts etc, as these are no longer required to pull the images or to start using NeuVector.

**Note about SCC and Upgrading via Operator/Helm**

Privileged SCC is added to the Service Account specified in the deployment yaml by Operator version 1.3.4 and above in new deployments. In the case of upgrading the NeuVector Operator from a previous version to 1.3.4 or Helm to 2.0.0, please delete Privileged SCC before upgrading.
```
oc delete rolebinding -n neuvector system:openshift:scc:privileged
```

#### Beta 1 version released April 2022
+ Feature complete, including Automated Promotion of Group Modes. Promotes a Group’s protection Mode based on elapsed time and criteria. Does not apply to CRD created Groups. This features allows a new application to run in Discover for some time period, learning the behavior and NeuVector creating allow-list rules for Network and Process, then automatically moving to Monitor, then Protect mode. Discover to Monitor criterion: Elapsed time for learning all network and process activity of at least one live pod in the Group. Monitor to Protect criterion: There are no security events (network, process etc) for the timeframe set for the Group.
+ Support for Rancher 2.6.5 Apps and Marketplace chart. Deploys into cattle-neuvector-system namespace and enables SSO from Rancher to NeuVector. Note: Previous deployments from Rancher (e.g. Partner catalog charts, version 1.9.x and earlier), must be completely removed in order to update to the new chart.
+ Tags for Enforcer, Manager, Controller: 5.0.0-b1 (e.g. neuvector/controller:5.0.0-b1)


####Preview.3 version released March 2022
***Important***: To update previous preview deployments for new CRD WAF, DLP and Admission control features, please update the CRD yaml and add new rbac/role bindings:
```
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/latest/crd-k8s-1.19.yaml
kubectl create clusterrole neuvector-binding-nvwafsecurityrules --verb=list,delete --resource=nvwafsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvwafsecurityrules --clusterrole=neuvector-binding-nvwafsecurityrules --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-nvadmissioncontrolsecurityrules --verb=list,delete --resource=nvadmissioncontrolsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvadmissioncontrolsecurityrules --clusterrole=neuvector-binding-nvadmissioncontrolsecurityrules --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-nvdlpsecurityrules --verb=list,delete --resource=nvdlpsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvdlpsecurityrules --clusterrole=neuvector-binding-nvdlpsecurityrules --serviceaccount=neuvector:default
```
#####Enhancements
+ Support scanning of SUSE Linux (SLE, SLES), and Microsoft Mariner
+ Zero-drift process and file protection. This is the new default mode for process and file protections. Zero-drift automatically allows only processes which originate from the parent process that is in the original container image, and does not allow file updates or new files to be installed. When in Discover or Monitor mode, zero-drift will alert on any suspicious process or file activity. In Protect mode, it will block such activity. Zero-drift does not require processes to be learned or added to an allow-list. Disabling zero-drift for a group will cause the process and file rules listed for the group to take effect instead.
+ Split policy mode protection for network, process/file. There is now a global setting available in Settings -> Configuration to separately set the network protection mode for enforcement of network rules. Enabling this (default is disabled), causes all network rules to be in the protection mode selected (Discover, Monitor, Protect), while process/file rules remain in the protection mode for that Group, as displayed in the Policy -> Groups screen. In this way, network rules can be set to Protect (blocking), while process/file policy can be set to Monitor, or vice versa.
+ WAF rule detection, enhanced DLP rules (header, URL, full packet)
+ CRD for WAF, DLP and admission controls. NOTE: required additional cluster role bindings/permissions. See Kubernetes and OpenShift deployment sections. CRD import/export and versioning for admission controls supported through CRD. 
+ Rancher SSO integration to launch NeuVector console through Rancher Manager. This feature is only available if the NeuVector containers are deployed through Rancher. NOTE: Requires updated Rancher release (date/version TBD).
+ Supports deployment on RKE2.
+ Support for Federation of clusters (multi-cluster manager) through a proxy.
+ Monitor required rbac's clusterrole/bindings and alert in events and UI if any are missing.
+ Support criteria of resource limitations in admission control rules.


#####Bug Fixes
+ Fix issue of worker federation role backup should restore into non-federated clusters.

####Preview.2 version released Feb 2022
+ Minor file and license changes in source, no features added.

####Support for deployment on AWS ECS Deprecated
Support for deployment on ECS is no longer provided. The allinone should still be able to be deployed on ECS, however, the documentation of the steps and settings is no longer supported.

#### 5.0 'Tech Preview' January 2022
##### Enhancements
+ First release of an unsupported, 'tech-preview' version of NeuVector 5.0 open source version.
+ Add support for OWASP Top-10, WAF-like rules for detecting network attacks in headers or body. Includes support for CRD definitions of signatures and application to appropriate Groups.
+ Removes Serverless scanning features.

##### Bug Fixes
+ TBD

##### Other
+ Helm chart v1.8.9 is published for 5.0.0 deployments. If using this with the preview version of 5.0.0 the following changes should be made to values.yml:
  - Update the registry to docker.io
  - Update image names/tags to the preview version on Docker hub
  - Leave the imagePullSecrets empty





