---
title: 2.x Release Notes
taxonomy:
    category: docs
---

### Release Notes for 2.x

#### 2.5.6 November 2019
##### Bug Fixes
+ Improve logic to detect Docker EE environment correctly.
    - A new environment variable is introduced, NV_PLATFORM_INFO with value platform=Docker. This is to indicate the platform is Docker based, so we won't identify the platform as Kubernetes.
    - This is not needed in a Kubernetes-only environment.
    - This is only needed to be added to the enforcer container yaml.
+ Fix the false reports of upgraded packages in source code scans.
+ Resolve a high CPU usage condition when reading CIS benchmark scan result.

#### 2.5.5 November 2019
##### Bug Fixes
+ Images in the Nexus registry with schema v2 format are scanned but the status shows as Failed, and layered scan results are not displayed.
+ When there is no license loaded, Jenkins scan requests cause controller process to restart.

#### 2.5.4 October 2019
##### Bug Fixes
+ LDAP bind password is not masked in the configuration change audit log.
+ Fail to scan docker v2 schema2 images in certain cases.
+ Large configuration files sometimes are not completely imported.

#### 2.5.3 October 2019
##### Enhancements
+ Add support for IBM cloud container registry scanning.
+ Add Admission control criteria for 'Fix Available' for high CVE results. This enables a rule to block deployment for critical vulnerabilities if a fix exists.
+ Updated JFrog X-Ray integration.
+ Disable SSL2/3 and TLS 1.0 for all HTTPS servers.
+ Allow namespace administrator to create namespace users in console.
+ Improve CPU usage for both Enforcer and Controller especially when network connections are high.

##### Bug Fixes
+ Fix when two or more controllers are lost, the controller cluster can get stuck in a state where no leader can be elected. The console/controller becomes unavailable. This is observed in cases where hosts (OS or orchestration platform) are being updated and rebooted, which includes using the drain node process in the update process.
+ Fix that admission controller cannot locate scanned image, if the image uses digest format.
+ Fix connection issue when gitlab registry is using HTTPS.
+ Correct that sometimes Debian is detected as Ubuntu for OS.
+ Fixed OpenID authentication failure.
+ Fix blocking some network connections while in Protect mode. In certain rare conditions, network connections were being blocked that should not be.

#### 2.4.3 September 2019
+ Patch release to fix the issue of blocking network connections while in Protect mode. In certain rare conditions, network connections were being blocked that should not be.

#### 2.5.2 August 2019
##### Enhancements
+ Add support for * wildcards in jFrog registry image scanning.
+ Add support for Gitlab registry scanning
+ Allow users to see typed password by clicking the 'eye' icon
+ Display the user's group membership after the testing of LDAP/AD settings succeeds

##### Bug Fixes
+ Add icon to download registry image scan results from UI
+ Add ability to create Response Rules based on network events: threat names and violations
+ Handle special escape characters in LDAP/AD user DN name
+ User role mapping should use case-insensitive string comparison for AD server
+ Fix that old controller entries which are not running are still showing in the UI

#### 2.5.1 July 2019
##### Enhancements
+ Add support for customizing group claim scopes (e.g. namespace) in SAML/OIDC.
+ Improve (decrease) memory usage in controllers and enforcers.
+ Improve Dashboard loading speed
+ Improve vulnerability scan results for Python and Ruby packages.

##### Bug Fixes
+ Auto-scan status in Dashboard showed incorrectly.
+ Add file protection for /etc/passwd
+ Fix host vulnerability scanning issue for CoreOS.

#### 2.5.0 July 2019
IMPORTANT - Before Upgrading: 
+ Process Blocking in Protect Mode. Processes not on the whitelist for a service will be blocked in 2.5.0 for any services in Protect Mode. Review processes, add additional ones is needed, to avoid blocking, or switch to Monitor mode in Policy -> Services.
+ If upgrading from 2.3.x or earlier see special upgrade requirements to enable admission control. New role bindings and yaml changes are required. Review section ‘Production Deployment’ for changes.
+ Add support for replacing certificates, documented in Basics section.

##### Enhancements
+ Add process blocking mode, file system access blocking mode (limitations on Debian 8, aufs, busybox)
+ Capture process history of containers
+ Scan image layers in Jenkins and registry scan
+ Use config maps (built-in Kubernetes and OpenShift feature) to preconfigure system configurations when deploying NeuVector (note: addition to yaml file required)
+ Allow REST api client to connect from outside of the cluster (using JWT token)
+ Admission control rules can be defined based on image labels and environment variables
+ Syslog format change to standard RFC5424
+ Improve registry scan: if tag is not given, it will scan all tags, not just "latest"
+ Dashboard risk report:  add wizard to allow user to correct / reduce risk score

##### Bug Fixes
+ Improve http smuggling detection to remove false positives
+ JFrog Artifactory bug fixes (double slash, ...), support secure registry


#### 2.4.2 May 2019
IMPORTANT: If upgrading from 2.3.x or earlier see special upgrade requirements to enable admission control. New role bindings and yaml changes are required. Review section ‘Production Deployment’ for changes.

##### Enhancements
+ Upgrade NeuVector container base image to alpine 3.9.4
+ Improve admission control upgrade process from 2.4 beta release
+ Add support for Azure AKS with advanced network plugin

##### Bug Fixes
+ Encrypted traffic between Istio sidecar is marked with the original application protocol
+ Fix double-slash appearing in the JFrog Artifactory scan request
+ Fix display and RBAC related issues in UI
+ Improve http smuggling attack detection to reduce false positives

#### 2.4.1 April 2019
IMPORTANT: If upgrading from 2.3.x or earlier see special upgrade requirements to enable admission control. New role bindings and yaml changes are required. Review section ‘Production Deployment’ for changes.

##### Bug Fixes
+ UI page not responding while generating PDF file when there are large number of incident logs.
+ Fix the UI dashboard display issue when logged in as a namespace user. RBAC-based dashboard and reports are fully supported now.
+ Fix the registry configuration page display issue when the browser window is narrow.

#### 2.4.0 April 2019

IMPORTANT: Please review upgrade requirements to enable admission control. New role bindings and yaml changes are required. Review section ‘Production Deployment’ for changes.
##### Enhancements
+ Service Mesh Integration (Istio, Linkerd2, AWS App Mesh ...) to perform threat detection, segmentation and visualization on service mesh proxy traffic, even before encryption takes place. New service mesh icon displays sidecar details when clicked and expands to show internal pod traffic when double clicked.
+ Admission Control feature added to be able to set policy for deploying containers on Kubernetes or OpenShift. Additional cluster role bindings and yaml service definition are required to enable admission control, and rules can be created in Security Risks -> Admission Control.
+ Save registry scanning results in persistent storage if PERSIST_CONFIG is enabled.
+ Helm chart updates: Accept Azure file share as persistent storge - github contribution, and remove pvc mount for managers and enforcers
+ Add timestamp to Policy -> Services to indicate when each service policy mode was last changed.
+ CVSS 3.0 score and vector added.
+ Add new risk score widgets and charts in Dashboard to show external connection exposures and application protocols detected.
+ Add support for Kubernetes 1.13 and OpenShift 3.11.

##### Bug Fixes
+ Remove sensitive data from support logs

#### 2.3.3 March 2019
##### Bug Fixes
+ Add ability to identify OpenShift platform on OKD 3.11
+ Fixed: network policies are not created correctly between containers and host network containers, especially some of the system containers, so violations are reported when the services are changed to Monitor or Protect mode. This was mainly an issue when enforcer is deployed on Master nodes.

#### 2.3.2 March 2019
##### Enhancements
+ Added proxy configuration under system setting to access registry via proxy server. This is to support newer version of docker which encrypts password in docker info command output. Controller uses proxy configuration to access registry if user has configured it, otherwise it tries to get proxy configuration from docker info command output.

##### Bug Fixes
+ Resolve the false positive of vulnerability scan on OpenShift platform
+ Fix CLI bug when configuring JFrog mode.

#### 2.3.1 February 2019
##### Enhancements
+ Add support for accessing docker registry with a proxy 
+ Improve support for jfrog port mode registry scanning
+ Improve JFrog registry support - need to choose JFrog docker access method now while creating registry.   
+ Add support for scanning java files in .war, .ear format
+ Improve Network Activity display showing workload IP and workload together for Rancher 1.6+

##### Bug Fixes
+ Fix scan fail error if it finishes with 0 results because the agent returns 0 files
+ Don’t show password info in the debug log
+ Remove dev IP node in graph when dev joins

#### 2.3.0 February 2019
##### Enhancements
+ Vulnerability scanning now reports for Kubernetes platform/system vulnerabilities in new Platforms tab (Security Risks -> Vulnerabilities page)
+ Add support for containerd run-time (must edit sample yaml for new mount path). NeuVector Helm chart now support containerd setting.
+ OpenID connect authentication and RBAC integration
+ OpenShift image scanning improvements to support registries with large number of images (>20k)
+ OpenShift registry scanning now allows you to configure a token for the service account. Recommended to use a token that doesn't expire to always be able to scan the image with the token.
+ Add vulnerability scanning of Java packages
+ Ability to disable pcap: controlled by environment variable. DISABLE_PACKET_CAPTURE
+ Improve DNS tunnel detection and reporting, so it will show a red line in the network graph
+ Add setting for ‘hostPID: true’ in Kubernetes and OpenShift yamls to improve process monitoring performance

##### UI Improvements
+ Threats, violations and incidents are merged into same tab (security events), and displayed in the same timeline. Filtering by name and tag are supported.
+ Support Azure AD SAML and OpenID connect authentication integration
+ Kubernetes and Openshift deployment yaml files updated for new verbs

##### Bug Fixes
+ Fixed Azure registry scan: for some Azure registries, repository cannot be retrieved because Azure doesn't include host URL in the response
+ Fix ADFS SAML authentication timestamp format issue
+ Reduce inotify handler usage to reduce number and avoid potential conflicts
+ Fixed the AD/LDAP UI test connection issue 
+ Fix high memory consumption issues for certain conditions

#### 2.2.4 - February 2019
##### Enhancements
+ Identify OpenShift platform better using process names

#### 2.2.3 - January 2019
##### Bug Fixes
+ Fix Network Activity graph not displaying in some cases related to containers in exit state

#### 2.2.2 - December 2018
##### Bug Fixes
+ Update java package 8u181 in manager and allinone images to address vulnerabilities in Java 8u171
+  Learned policies created by containers sharing the host network sometimes have reverse direction
+ Minor UI bug fixes

#### 2.2.1 - November 2018
##### New Features & Enhancements
+ Add support for DNS names and TCP for SYSLOG server configuration

##### Bug Fixes
+ Improve performance on OpenShift 3.10; high CPU load reported when host processes opens thousands of connections.
+ Minor UI bug fixes

#### 2.2 - October 2018

##### New Features & Enhancements
+ Integration with OpenShift image streams to trigger automatic scans. Use of wildcards for the repository is now supported.
+ Added support Nexus registry scanning. Wildcards in container repository and tag are supported.
+ Added support for GCR (Google) registry scanning. Supports wildcards. A proper role should be assigned to the user to enable it.
+ Added support for Microsoft Azure registry (ACR).
+ Network traffic to system containers (e.g. Kubernetes) is monitored and can be displayed in Network Activity. Violations will also be detected but currently only alerted, not blocked.
+ Vulnerability scanning (registry and run-time) and CIS benchmark results are now added to the logs. 
+ Enhanced wildcard support for JFrog Artifactory scanning.
+ (console) Major performance improvements for displaying the Network Activity map.
+ (console) Add a “Collapse All” for container group and namespaces in Network Activity. Improved filtering logic for groups and namespaces.

##### Behavior Changes
+ The default for saving backup configuration files to a mapped volume is changed from On to Off. Also, starting the controller does not try to automatically pull the backup configuration from the mounted volume. Use the environment variable CTRL_PERSIST_CONFIG with value: “1” to turn this on for backup and restore. A persistent volume should be used.
+ Run-time container vulnerability scanning is not performed on stopped containers.
+ The setting to ‘Rescan Scanned image’ is enabled by default, so removed from GUI. 


#### 2.1 - August 2018

##### New Features & Enhancements
+ JFrog X-Ray integration
+ Support JFrog registry subdomain and port mode
+ Support NeuVector deployment using HELM (Rancher, Kubernetes)
+ Improve group criteria matching logic, support wild-card and ‘not’ operators 
+ Better detect OpenShift platform and recognize DeploymentConfig as service
+ Better support for Rancher 2.0
+ Store license in the config backup so doesn’t need to be reapplied
+ Improve setting samples in registry config page
+ Display more information, such as modified file, process command in the incident log

##### Bug Fixes
+ Fix the issue that multiple registry entries got mixed up
+ Fix that issue that graph namespace cannot be focused (Focus feature)
+ Various UI fixes in registry scan, graph and RBAC
+ Fix enforcer startup failure on the host with large number of containers (400~1000) and high CPU usage (80~90%)
+ Fix Oracle and Postgres protocols mis-identification

#### 2.0 - June 2018
This release has many new features and a brand new console UI design. 

##### New Features & Enhancements
+ Response Rules. Customize responses to security events and CVE reports 
+ Process Profile Baseline and Rules.
+ File system monitoring.
+ Network protocol filtering and detection added for MSSql, Oracle, and gRPC.
+ Policy rules (groups) can now use a subdomain wildcard match such as *.neuvector.com.
+ Manual trigger running of Docker and Kubernetes CIS benchmarks. Added a remediation field.
+ OpenShift RBACs.
+ Kubernetes RBACs.
+ Microsoft Active Directory now supported.
+ Registry Scanning supports Docker private registry, DockerHub, OpenShift private Registry, Redhat public registry, AWS ECR (two modes: user access key/secret, associate proper IAM role on controller node)
+ Jenkins Plug-In for Vulnerability Scanning

Console / UI
+ Dashboard is redesigned and some charts are now interactive
+ Network Activity has automated collapse for high number of containers, plus manual expand collapse view by namespace or group.
+ Settings is moved to upper right
+ Many new filtering options to search/find resources by namespaces
+ New screens include: Process Profile Rules (Policy -> Services), Response Rules (Policy), Registry Scanning (Security Risk)


##### Known Issues

Upgrading from 1.x to 2.x
+ If the policy mode for any services is Protect before upgrading, the traffic from a pod to any ip group will be blocked. Please change the policy mode to Discover for all services before upgrading.

Windows Active Directory authentication
+ The group info is based on member and sAMAccountType attributes for role mapping. If an Active Directory group is created without a member attribute or it doesn't belong to the global security group, the role mapping will not match successfully. The role mapping is case sensitive as well. Also, currently (2.0) the role mapping is not supported if the Windows Active Directory group has a parent group.




