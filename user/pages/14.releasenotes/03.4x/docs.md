---
title: 4.x Release Notes
taxonomy:
    category: docs
---


### Release Notes for 4.x

#### 4.4.4-s3 Security Patch April 2022
+ Update all images to remediate high [CVE-2022-28391](https://nvd.nist.gov/vuln/detail/CVE-2022-28391) in busybox (alpine).

#### 4.4.4-s2 Security Patch March 2022
+ Update to remediate CVE-2022-0778, an OpenSSL vulnerability found in the Alpine base image used by NeuVector images. Short description: It is possible to trigger an infinite loop by crafting a certificate that has invalid elliptic curve parameters. Since certificate parsing happens before verification of the certificate signature, any process that parses an externally supplied certificate may be subject to a denial of service attack. More details can be found at the following links. 
  - https://security.alpinelinux.org/vuln/CVE-2022-0778
  - https://www.suse.com/security/cve/CVE-2022-0778.html
  - https://nvd.nist.gov/vuln/detail/CVE-2022-0778

#### 4.4.4-s1 Security Patch February 2022
+ Update alpine in Manager to remove recent CVEs including High ratings CVE-2022-25235, CVE-2022-25236 and CVE-2022-25314
+ Note: Recent CVEs have also been published in the Manager CLI module related to the python package. The python package will be replace in the 5.0 version with python3 to remove any CVEs. This is currently scheduled for GA in May 2022. The CLI is not remotely accessible and can't be accessed through the GUI, so proper Kubernetes RBACs to restrict 'kubectl exec' commands into the Manager pod will protect against exploits.
+ List of manager 4.4.4 CVEs
  - alpine:3.15.0	High	CVE-2022-25235	https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-25235	expat
  - alpine:3.15.0	High	CVE-2022-25236	https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-25236	expat
  - alpine:3.15.0	Medium	CVE-2022-25313	https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-25313	expat
  - alpine:3.15.0	High	CVE-2022-25314	https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-25314	expat
  - alpine:3.15.0	High	CVE-2022-25315   https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-25315	expat
  - alpine:3.15.0	Medium	CVE-2020-26137	https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-26137	usr/lib/python2.7/site-packages/urllib3-1.25.3
  - alpine:3.15.0	High	CVE-2020-7212	https://github.com/advisories/GHSA-hmv2-79q8-fv6g	usr/lib/python2.7/site-packages/urllib3-1.25.3
  - alpine:3.15.0	High	CVE-2021-33503	https://github.com/advisories/GHSA-q2q7-5pp4-w6pg	usr/lib/python2.7/site-packages/urllib3-1.25.3
  - alpine:3.15.0	Medium	CVE-2021-3572	https://github.com/advisories/GHSA-5xp3-jfq3-5q8x	usr/lib/python2.7/site-packages/pip-20.3.4

#### Other Updates February 2022
+ Update Helm chart to 1.9.1. Allow users to specify different image SHA hash instead of tags, add support for k3s in Rancher UI.
+ Community Operator is updated to 1.3.5 to support 4.4.4.
+ Certified Operator is updated to to 1.3.2 to support 4.4.4.

#### 4.4.4 February 2022
#####Enhancements
+ Add environment variable for Enforcer to turn off secrets scanning, which in some environments can consume resources. Set to ENF_NO_SECRET_SCANS=1
+ In Vulnerability Explorer > CSV download,  show affected containers in multiple rows instead of in the same cell.

##### Bug Fixes
+ Reduce secrets scanning by Enforcer to avoid possibility of long running scanning tasks which can consume memory. This may be caused by large image registry or database scan locally.
+ Fix bug when attempting to export CSV for CVE's found in the vulnerability explorer Security Risks -> Vulnerabilities without using filter, the CSV file is empty.
+ Fix timing issue when upgrading from 4.2.2 which can result in implicit deny for all traffic. Most recent fix is related to XFF settings during rolling updates.

##### Other
+ Allow users to specify different image SHA hash instead of tags https://github.com/neuvector/neuvector-helm/pull/140. Will be propagated to Operator.

#### 4.4.3 January 2022
##### Enhancements
+ Replace the self-signed certificate for Manager which is expiring January 23, 2022 with new one expiring Jan. 2024.
+ Improve ability to display unmanaged workloads in Network Activity map which are not relevant.

##### Bug Fixes
+ Fix Controller crashes when scanning gitlab registry.
+ Admission control not blocking for some images. This is because a vulnerability found in multiple packages is treated as 1 vulnerability in Controller's admission control and is fixed.
+ Upgrade from 4.2.2 to 4.3.2 results in implicit deny for all traffic if high traffic during rolling upgrade.

##### Other
+ Helm chart v1.8.9 is published for 5.0.0 deployments.

#### 4.4.2 December 2021
##### Enhancements
+ Add support for scanning embedded java jars and jars without Maven file, for example log4j-core-2.5.jar, when pom.xml doesn’t exist.
+ Add CVE database source of [GitHub advisories for Maven](https://github.com/advisories?query=maven), starting with scanner/CVE db version 2.531.
+ Rest API [reference doc](/automation/automation#cli-and-rest-api) is updated to 4.4.1 and 4.4.2.

##### Bug Fixes
+ Fix memory leak detected in Enforcer.

#### 4.4.1 December 2021
##### Enhancements
+ Add support for cgroup v2, which is required for some environments such as SUSE Linux Enterprise Server 15 SP3.

##### Bug Fixes
+ Fix the issue where Enforcer is unable to detect CVE-2021-44228 in running containers.
+ Reduce/fix high memory usage by Enforcer for some environments.
+ Fix an issue with import/export of nv.ip group policy.
+ Fix issue with removing a group with no container members.
+ Fix issue of can't login using neuvector-prometheus-exporter intermittently.
+ Fix issue with REST API endpoint /v1/response/rule?scope=local not deleting all response rules.

##### Helm Chart Update 1.8.7
+ Support affinity and toleration customization for controller, scanner and manager.
+ Add nodeSelector support for Controller, Manager, Scanner, updater pods.
+ Support user-defined environment variables for controller container.

#####Splunk App Published
+ New Splunk app for NeuVector is published at https://splunkbase.splunk.com/app/6205/

#### 4.4.0 December 2021
##### Enhancements
+ Add ability to 'Accept' a vulnerability (CVE) to exclude it from reports, views, risk scoring etc. A vulnerability can be selected and the Accept button clicked from several screens such as Security Risks -> Vulnerabilities, Assets -> Containers etc. Once accepted, it is added to the Security Risks -> Vulnerability Profile list. It can be viewed, exported, and edited here. Note that this Accept feature can be limited to listed Images and/or Namespaces. New entries can also be added manually to this list from this screen.
+ Enable a Configuration Assessment of a kubernetes deployment yaml file. Upload a yaml file from Policy -> Admission Control and it will be reviewed against all Admission Control rules to see if it will hit any rules. A report of the assessment can be downloaded from this window.

##### Bug Fixes
+ Fixed packet capture is not available for pod with istio sidecar proxy.
+ Remove writing by Allinone to /dev/null.json

#### 4.3.2-s1 November 2021
+ Security patch release that addresses vulnerabilities in 'curl' related libraries discovered in the 4.3.2 release. The discovered CVE are CVE-2021-22945, CVE-2021-22946 and CVE-2021-22947.

#### 4.3.2 September 2021

##### Enhancements
+ Support Openshift CIS benchmark 1.0.0 and 1.1.0.
+ Support admission control dry-run option.
+ Improve description of the source of admission control criteria. Improve labels criteria in admission control to add other criteria.
+ Support gitlab cloud (SaaS) registry scan.
+ Support multi-architecture image scan.
+ ConfigMap override option to reset config whenever controller starts. The 'always_reload: true' can be used in any configMap yaml to force reload of that yaml every time the controller starts.
+ Include pre-built PSP best practices admission control rules.
+ Test support for AppArmor profile for running NeuVector as non-privileged containers.
+ Allow users to click Group name in Security events list to go to the Policy -> Groups selection.

##### Bug Fixes
+ Add indicator for admission control criterion to determine if scan result is required.
+ Warning if all NeuVector components are not running the same version.
+ Show Docker Swarm/Mirantis platform in Network Activity -> View -> Show System. This is enabled by adding the environment variable for the Enforcer NV_SYSTEM_GROUPS.

##### Other
+ Update cronjob version in helm chart (v. 1.8.3).
+ Support Jenkins master-slave configuration in Jenkins plug-in.

#### 4.3.1 August 2021

##### Enhancements
+ Display node labels under Assets -> Nodes.
+ Display statistics for the Controller in Assets -> System Components
+ Report if a vulnerability is in the base image layers in image scan when using the REST API to scan images. The base image must be identified in the api call, as in the example below. 
```
curl -k -H "Content-Type: application/json" -H "X-Auth-Token: $_TOKEN_" -d '{"request": {"registry": "https://registry.hub.docker.com/", "repository": "garricktam/debian", "tag": "latest", "scan_layers": false, "base_image": "2244...../nodejs:3.2......"}}' "https://$RESTURL/v1/scan/repository"
{noformat}
```

Limitations:
If the image to be scanned is a remote image, with "registry" specified, the base image must also be a remote image, and the name must start with http or https. If the image to be scanned is a local image, then the base image must also be a local image as well.
For example,
```
{"request": {"repository": "neuvector/manager", "tag": "4.0.2", "scan_layers": true, "base_image": "alpine:3.12.0"}}
{"request": {"registry": "https://10.1.127.12:5000/", "repository": "neuvector/manager", "tag": "4.0.0", "scan_layers": true, "base_image": "https://registry.hub.docker.com/alpine:3.12.0"}}
{"request": {"repository": "neuvector/manager", "tag": "4.0.2", "scan_layers": true, "base_image": "10.1.127.12:5000/neuvector/manager:4.0.2”}}
```

##### Bug Fixes
+ Make enforcer list height adjustable.
+ Sanitize all displayed fields to prevent XSS attacks.

#### 4.3 July 2021

##### Enhancements
+ New Network Activity display in console improved performance and object icon design. New UI framework dramatically improves loading times for thousands of objects to be displayed. Session filters are maintained until logout in Network Activity, Security Risks and other menu's. GPU acceleration is enabled, which can be disabled if this causes display issues. Note: Known issue with certain Window's PCs with GPU enabled.
+ Add ability to import Group Policy (CRD file yaml format) from console to support non-Kubernetes environments. Important: Imported CRDs from console do NOT get classified and displayed as CRD rules. They can be edited through the console, unlike CRD's applied through Kubernetes.
+ Support multiple web hook endpoints. In Settings -> Configuration, multiple web hook endpoints can be added. In Response Rules, creating a rule enables user to select which end point(s) to notify by web hook.
+ Support (multiple web hook) configuration in Federated rules.
+ Support JSON format for web hooks. Can now configure JSON, key-value pairs, or Slack as web hook formats when creating a web hook. 
+ Support custom user roles for map to a namespace user. Directory integration support mapping of groups to roles, with role being able to limit to namespace(s). Limitation: If the user is in multiple groups, the role will be 'first matched' group's role assigned. Please the order of configuration for proper behavior.
+ Download list of external IPs for egress connections. Added ability to download report/CSV from the Dashboard page under section Ingress and Egress Exposure.
+ Support cve-medium criteria in Response Rules.
+ Add preconfigured PSP Best Practice rule to Admission Control rules. For example the following preset criteria can alert/block a deployment: Run as Privileged, Run as Root, Share host's IPC Namespaces = true, Share host's Network = true, Share host's PIC Namespaces = true.
+ Support using Namespace in Advanced Filter for Security Risks Vulnerabilities & Compliance for Assets report in PDF.
+ Support Admission Control rule criteria based on CVE score.
+ Add a Test Registry button when configuring registry scanning for registries that support this feature such as docker and JFrog.
+ Improve support log download and controller debug settings. Enable download settings such as cPath and which component logs are downloaded.
+ Add support for Kubernetes 1.21.

##### Bug Fixes
+ Support Kubernetes 1.21 with containerd 1.4.4. The containerd run-time v1.4.4 changes its cgroup representations.
+ Scanner identifies OS as ol:7.9 with false positive CVEs.
+ Support standalone scanner deployment on Azure DevOps extension.

##### Other Changes
+ Helm Chart  v1.8.0 is updated to default to registry.neuvector.com as the default registry. NOTE: Must specify the version tag manually.
+ Add configurable parameters such as Controller API annotations in Helm chart. Available from version 1.7.6+.
+ Community Operator 1.2.6, Certified Operator 1.2.7 updated to reflect Helm chart updates including adding OpenShift route when controller.apisvc.type is enabled. The certified Operator 1.2.7 deploys NeuVector version 4.2.2.
+ Add HTML output format for scan results in Jenkins pipeline scanning results.
+ Add namespace of impacted workload in Prometheus exporter alerts. Now supported in neuvector/prometheus-exporter:4.2.2 and later.

#### 4.2.2 April 2021

##### Enhancements
+ Enable enforcement of a password policy. If this feature is enabled, passwords must meet minimum security requirements configured. Go to Settings - User/Roles to set the password policy, including minimum characters, upper case, numeric, and special characters required. Guessing and password reuse are also prevented.
+ Allow slash in key/value in CRD group definition.
+ Enhance SAML to support CAC authentication. SAML AFDS Common Access Card (CAC) authentication method.
+ Verify compatibility with OpenShift 4.7

##### Bug Fixes
+ Fix the condition where Enforcer is delaying node reboot for up to 20 minutes on OpenShift update.
+ Correct Unmanaged node terminology to be 'nodes'.
+ CRD import produced unexpected results. A conversion tool is available from NeuVector to help convert from previous releases CRD format.
+ In AKS webhook certificates created without SAN for k8s v1.19+.
+ Federated policy working inconsistently and not as expected. Improve unmanaged workload ip logic to reduce unnecessary violations.


#### 4.2.1 March 2021
##### Bug Fixes
+ Predefined File Access rules are not displaying in console.
+ Column headers are incorrect in several console views such as Assets->Registry->Module Scan Results. Some PDF reports were also affected and have been fixed. Other areas primarily in Sonatype build have been fixed.

#### 4.2 March 2021

##### Enhancements
+ Multi-cluster Monitoring. Centralized visibility of the security posture of all managed clusters, by displaying the risk score and cluster summary for each cluster on multi-cluster management page. Note: multi-cluster federation requires a separate license.
+ Add support for IBM Cloud integrated usage-based billing.
+ Enhance PCI compliance report to show asset view , listing vulnerabilities by service.
+ Add summary of scan result before listing the vulnerability.
+ Support Red Hat OVAL2 database required for Red Hat Vulnerability Scanner certification.
+ Support Red Hat OpenShift beta version of CIS benchmarks ('inspired by CIS'). This will be finalized when the CIS.org publishes the official version. This feature is supported for deployments of OpenShift version 4.3+.
+ Allow API query filtering to check for conditions such as images allowed or denied using API calls.
+ Add support for CIS Kubernetes benchmark 1.6.0.
+ Report and display Image Modules detected during scan in scan results. This is shown in a tab in Image Scan results, and included in scan results from REST API.
+ Allow editing of filters in registry, group, and response rule configurations through console.
+ Update ConfigMap to add group_claim in oidcinitcfg.yaml and samlinitcfg.yaml, and Xff_Enabled in sysinitcfg.yaml
+ API's yaml is updated for 4.2 in [Automation section](/automation/automation#cli-and-rest-api).


##### Bug Fixes
+ Enforcer is unable to join existing cluster, sometimes taking 10 minutes in cases where there are too many enforcers registered. This is when enforcers are terminated ungracefully but still registered for license checks, preventing other enforcers from joining when the license limit is reached.
+ Fixed: wildcard DNS traffic blocked. Improved the caching of dns results matching to wildcard dns address group.
+ Fix rare condition where CRD certificates gets out of sync for webhook and controller.
+ Correct legend in Network Activity display for 'Unmanaged' to 'Nodes'.
+ Nodes detected as workload resulting in implicit violations.

##### Other
+ Jenkins Plugin enhancements: 
  - Overwrite vulnerability severity by score.  
  - Add error messages to the JAVA exceptions hudson.AbortException.
+ Update Helm chart to 1.7.1. 

Please see release notes section [Integrations & Other Components](/releasenotes/other) for details.

#### 4.1.2 February 2021

##### Enhancements
+ Enable toggling for XFF-forwarding to disable the NeuVector policy from using it, which is enabled by default. This is related to a function added in 4.1.1 to add support for x-forwarded-* headers. To disable, go to Settings -> Configuration. IMPORTANT: See the detailed description of the behavior of XFF-FORWARDED-FOR below.

##### Bug Fixes
+ Fixed that CVE-2020-1938 is not detected.
+ Fix error from Manager "Failed to export configurations of section {policy, user, config}."
+ Fix Network Activity Graph filter is not working.
+ Improve controller CPU and memory consumption.

##### Other
+ Jenkins plug-in updated to support stand alone scanner.  Please see release notes section [Integrations & Other Components](/releasenotes/other) for details.


##### XFF-FORWARDED-FOR Behavior Details

In a Kubernetes cluster, an application can be exposed to the outside of the cluster by a NodePort, LoadBalancer or Ingress services. These services typically replace the source IP while doing the Source NAT (SNAT) on the packets. As the original source IP is masqueraded, this prevents NeuVector from recognizing the connection is actually from the 'external'.

In order to preserve the original source IP address, the user needs to add the following line to the exposed services, in the 'spec' section of the external facing load balancer or ingress controller. (Ref: https://kubernetes.io/docs/tutorials/services/source-ip/)

"externalTrafficPolicy":"Local"
 
Many implementations of LoadBalancer services and Ingress controllers will add the X-FORWARDED-FOR line to the HTTP request header to communicate the real source IP to the backend applications. In 4.1.0 release, we added a feature to recognize this set of HTTP headers, identify the original source IP and enforce the policy according to that.

This improvement created some unexpected issues in some setup. If the above line has been added to the exposed services and NeuVector network policies have been created in a way that expect the network connections are coming from internal proxy/ingress services, because we now identify the connections are from "external" to the cluster, normal application traffic might trigger alerts or get blocked if the applications are put in "Protect" mode.

In 4.1.2, switch is added to disable this feature. Disabling it tells NeuVector not to identify that the connection is from "external" using X-FORWARDED-FOR headers. By default this is enabled, and the X-FORWARDED-FOR header is used in policy enforcement. To disable it, go to Settings -> Configuration, and disable the "X-Forwarded-For based policy match" setting.

![xff_behavior](xff.png)

#### 4.1.1 January 2021

##### Bug Fixes
+ Add support for AWS EKS AMI Release v20210112 to fix ulimit issues.

#### 4.1 December 2020

##### Enhancements
+ Allow users to change policy mode when exporting CRD.
+ OIDC support claims from /oauth/userinfo endpoint.
+ Cluster node refresh support to allow temporary support for node growth and migration of pods between nodes.
+ Generate a usage report for download from the Settings -> Configuration page.
+ Wildcard support on namespace when assigning user roles to namespace.
+ Improve group/policy removal logic. Configurable setting for when an unused group is removed based on the amount of time since it was last used.
+ Allow user to configure packet capture duration.
+ Add support for Multi-cluster management reader role.
+ Stand alone scanner now submits scan result using REST API. See below for Scanner Details.
+ Detect and block Man-in-the-middle attack reported in CVE-2020-8554.
+ Add support for metered (usage based) licensing models.
+ Remove step for creation of CRDs (e.g. NvSecurityRule) from the sample deployment yamls for Kubernetes and Openshift. This is not required (Controller will create these automatically). Helm deployment will also take care of these. 
 
##### Bug Fixes
+ Improve high memory usage on controller and enforcer.
+ Error returned when trying to configure a registry filter. Allow wildcard be used any place in the repo/tag filter.
+ Block policy not working as expected. Add support for x-forwarded-* headers. IMPORTANT: See the detailed description of the behavior of XFF-FORWARDED-FOR above as part of the 4.1.2 release notes.
+ Helm Chart error when setting controller ingress to true.
+ Unable to create add and save network rule, due to gateway timeout.
+ Configmap examples are missing Group_Claim field. Added to [configmap documentation](/deploying/production/configmap).
+ Process profile violation when terminating Controller pod.

##### Scanner Details
Two additional environment variables are added in order to login to controller REST API. Users with CICD integration role can submit the results.

New Environment Variables: SCANNER_CTRL_API_USERNAME, SCANNER_CTRL_API_PASSWORD

Usage Example
```
docker run --name neuvector.scanner --rm -e SCANNER_REPOSITORY=ubuntu -e SCANNER_TAG=16.04 -e SCANNER_LICENSE=$license -e CLUSTER_JOIN_ADDR=10.1.2.3 CLUSTER_JOIN_PORT=32368 -e SCANNER_CTRL_API_USERNAME=username -e SCANNER_CTRL_API_PASSWORD=secret -v /var/run/docker.sock:/var/run/docker.sock -v /var/neuvector:/var/neuvector neuvector/scanner
```

#### Kubernetes 1.19+ and CRD Exports
***IMPORTANT***: To use an exported CRD with Kubernetes 1.19+, please remove the 'version: v1' from each section. This can be found at the end or near the end of each section in an exported Group policy CRD.
```
    version: v1
```

#### 4.0.3 December 2020

##### Bug Fixes
+ Process profile violation occurring when terminating Controller pod.
+ Implicit violations for user created address group which uses wildcard in hostnames.

##### Helm Chart Changes
+ Allow user to customize PriorityClass of the manager/controller/enforcer/scanner deployment. We suggest to give NeuVector containers higher priority to make sure the security policies get enforced when the node resource is under pressure or during a cluster upgrade process.
+ Create a separate chart for CRD. This allows CRD policies to be created before NeuVector core services are deployed. If the new chart is used, the CRD resources in the core chart, kept for backward compatibility, should be disabled with crdwebhook.enabled=false
+ Allow user to specify the service account for NeuVector deployment. Previously, the 'default' service account of the namespace is used. In the case when NeuVector is deployed together with other applications in a namespace, it is not advisable to use the default service account for the namespace for some users.



#### 4.0.2 December 2020

##### Enhancements
+ Console - the container list page Assets -> Containers should allow the window separators to be dragged to be resized.
+ Add admission control checks for pod share host namespaces. Allow user to choose to prevent pod from sharing host's Network, IPC, PID namespaces. See below for more details.
+ Ability to export list of containers running in privileged or 'runasroot'.
+ In Notifications -> Security Events, enable the display of information about the event attributes easily without switching screens.  

##### Bug Fixes
+ Issue with jumbo frames (enabled on some public clouds). Symptom: the main prometheus application URI /graph becomes inaccessible when the prometheus group is placed into Protect mode.
+ Missing namespace option in vulnerabilities filter. Allow users to select/type the Namespace where NeuVector is installed as filter entry.
+ False positive in OpenSSL version 1.1.1c-1 affected by CVE-2020-1967.
+ Unexpected implicit deny violations for user created address group using wildcard hostnames. Problems with using DNS Name (with wildcards) for Firewall Traffic.
+ Improve detection to remove SQL Injection false positive.

##### Admission Control for Pod Sharing
1. HostPID - Controls whether the pod containers can share the host process ID namespace. Note that when paired with ptrace this can be used to escalate privileges outside of the container (ptrace is forbidden by default).
2. HostIPC - Controls whether the pod containers can share the host IPC namespace.
3. HostNetwork - Controls whether the pod may use the node network namespace. Doing so gives the pod access to the loopback device, services listening on localhost, and could be used to snoop on network activity of other pods on the same node.


#### 4.0.1 November 2020

***Important: Changes to Helm Chart Structure***

The directory for the NeuVector chart has changed from ./neuvector-helm/ to ./neuvector-helm/charts/core/

If using Helm to upgrade, please update the location to the path above.

##### Enhancements
+ Add support for distroless image scanning.
+ Add ability to trigger single image scan from registry with results available for admission control.
+ Update JFrog Xray integration to new JFrog platform api / authentication requirements.
+ Add information about scanners in the Manager such as version and scanner statistics.
+ Add quick filter to exclude security events (similar to grep -v).
+ Update CVE Severity to align with NVD vulnerability severity ratings. Using the larger of the CVSS v2 and v3 scores, the ratings are High for >=7, Medium for >=4.
+ Support standalone scanner deployments for local image scanning (does not require controller). Adds new environment variables SCANNER_LICENSE, SCANNER_REGISTRY, SCANNER_REPOSITORY, SCANNER_TAG, SCANNER_REGISTRY_USERNAME, SCANNER_REGISTRY_PASSWORD, SCANNER_SCAN_LAYERS, CLUSTER_JOIN_ADDR, CLUSTER_JOIN_PORT.
+ Support namespace auto-complete for namespace user creation in Settings -> Users.
+ Add ability to enter exempted CVEs in the Jenkins scanner plug-in.
+ Add admission control criteria to be able to block images for which the scan failed to detect the OS (e.g. archlinux images) and therefore no vulnerabilities were found. A new criteria "Image Without OS information" is added, when set to true, means the base OS of the image is unavailable.

##### Bug Fixes
+ Improve (decrease) Controller memory usage.
+ Enable support for webhook functions such as admission control and CRD in Kubernetes 1.19.
+ Add support for apiextensions.k8s.io/v1 deployments as required for Kubernetes 1.19 (and supported in k8s 1.18).
+ Unexpected process profile rule violation resulting from parent shell script for process on the allowed list.
+ Add support for wildcard filters in Harbor registry (configured using Docker registry setting).
+ Improve handling of configmap to re-load if admin password is reverted to the default. This is to prevent insecure access when the system is recovered from cluster level storage failure.


#### 4.0.0.s1 October 2020

##### Security Patch for NeuVector Containers
+ This security release is for the NeuVector Manager and Allinone containers to address High [CVE-2020-14363](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-14363) found in the base Alpine layer in package libx11.  As part of the update, Medium CVE-2020-8927 is also addressed. This issue, although unlikely to be able to be exploited, affects the Manager console for NeuVector and does not affect the operations of the Controller or Enforcer containers.

#### 4.0 September 2020

##### Enhancements
+ Customizable compliance templates. Preset templates for PCI, GDPR, HIPAA, NIST. Each CIS benchmarks and custom check can be tagged with one or more compliance regulations. Reports can then be generated for each. Security Risks -> Compliance Profile.
+ Vulnerability Management Workflow Support. Track status of vulnerabilities and create policies based on vulnerability discovery dates and other criteria. Security Risks -> Vulnerabilities (Advanced Filter), and Admission Control rules.
+ Secrets auditing. 20+ secrets checks included, and automatically run on image scans and resource yamls. Results will show pass/warn in the compliance reports on image vulnerabilities in Assets -> Registries and Security Risks -> Compliance.
+ Granular RBAC for NeuVector Users. Create custom roles with granular read/write permissions for NeuVector functions. Assign users to roles. Settings -> Users/Roles.
+ Scalable and Separated Scanner Pods. Scanner pods can be scaled up or down to scan thousands of images. The controller assigns scanning tasks to each available scanner pod. Important: the Controller no longer contains a scanner function, so a minimum of one scanner pod is required to be deployed. Also, the 4.x scanners are NOT backward compatible with 3.x controllers, 3.x deployments of external scanners should be updated to neuvector/scanner:3.
+ Serverless Scanning and Risk Assessment for AWS Lambda. Scan AWS Lambda functions for vulnerabilities with the Serverless IDE Plug-in or in AWS accounts. Supported languages include Java, Python, Ruby, node.js. Perform risk assessment by evaluating IAM role permissions for Lambda functions and alert if unnecessary permissions are enabled. Note: Serverless security requires a separate NeuVector license.
+ Perform compliance checks during image scanning. Also deployment yamls file. This includes setuid, setgid, CIS (running as root etc), 20+ secrets checks.
+ Enhance Security Risk Score in Dashboard with ability to enable/disable which Groups contribute to the Risk Score. Policy -> Groups -> Scorable check box. This includes ability to disable system containers from risk scoring.
+ Added support for a Namespace restricted user to have access to assigned registries.
+ Break out scanning syslog notifications to individual CVE syslog events.
+ Allow a namespace restricted user to be able to create registries that are only visible by users that have access to that namespace (including global users).
+ Download pdf reports from the dashboard by namespace. Select a namespace to filter the dashboard pdf report.
+ The CRD import behavior has been changed to ignore the PolicyMode of any 'linked' group, leaving the Policy mode unchanged if the linked group already exists. If the linked group does not exist it will be automatically created and set to the default New Services Mode in Settings -> Configuration. A 'linked' group is one which has not been selected for export but is referred to by a network rule, and thus has been exported along with the selected group(s).


##### Bug Fixes
+ Registry URL validation allows URL without protocol scheme prefix. Added protocol schema validation.
+ Container scans failed - Fail to read files in some situations. Fixes error "Failed to read file - error=<nil>".
+ The Group member column is inaccurate for the special group "nodes."
+ Discount (reduce) Admission Controls (4 points) from Overall Risk Scoring for Docker EE Platform since it is not applicable.
+ A scanner only controller can take 15-20 minutes to become ready.
+ Security risks > Vulnerabilities "Severity" Distribution title is mislabeled as Urgency.
+ Security Events source Workload:ingress rule does not match. Unexpected implicit violation from Workload:Ingress on OpenShift 3.11 platform. Internal subnet logic is improved to handle large IP range.
+ Enforcer reports error trying to connect to /var/run/docker.sock. Add recovery if connection is lost.

##### Summary of Major Operational Changes
+ The 4.x Scanner is NOT compatible with the 3.2.0, 3.2.1, 3.2.2 Controllers. If you have deployed 3.x external scanners and wish to have them continue to run, be sure to UPDATE the scanner deployment with a version 3 tag, e.g. neuvector/scanner:3. Alternatively, you can update to 3.2.3+.
+ License to enable serverless security required
+ New clusterolebinding and clusterrole added for Kubernetes an OpenShift
+ Controller no longer has built in scanner. You must deploy at least 1 scanner pod.
+ Yaml file changes in main deployment samples:
  - Added deployment for scanner pods (2 default)
  - Scanner pod deployment has commented out section for local scanning cases
  - Added cron job for updater pod for cve database updates of scanners

##### Upgrading from 3.x to 4.0
For Helm deployments, update the helm chart to the new version 1.6.0. Then a standard upgrade to 4.0.0 is all that is required (e.g. helm upgrade my-release --set imagePullSecrets=regsecret-neuvector,tag=4.0.0 ./neuvector-helm/).

**Kubernetes (for OpenShift use the equivalent oc commands)**

+ Backup the configuration from Settings -> Configuration
+ Create the two new bindings
  - kubectl create clusterrolebinding neuvector-binding-view --clusterrole=view --serviceaccount=neuvector:default
  - kubectl create rolebinding neuvector-admin --clusterrole=admin --serviceaccount=neuvector:default -n neuvector
+ Set the version tags to 4.0.0 for the Controller, Manager, Enforcer yaml's and apply the update
+ Create the [scanner pods](/scanning/scanners#manual-deployment-of-multiple-scanners)
+ Create or update the [scanner cron job](/scanning/scanners#manual-deployment-of-multiple-scanners)
+ Wait a few minutes for the rolling update of the controllers to complete, and check all settings after login...
