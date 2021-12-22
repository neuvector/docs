---
title: Navigating the Console
taxonomy:
    category: docs
---

### Console Access
The console requires https access on default port 8443. The default user and password are admin.

Please see the first section Basics -> Connect to Manager for configuration options such as turning off https, accessing the console through a corporate firewall which does not allow port 8443, or replacing the self-signed certificate.

### Menus and Navigation
Use the left side menu to navigate in your NeuVector console.
![Navigation](3_0_Network_Activity.png)

##### Dashboard
The Dashboard shows a summary of risk scores, security events, and application protocols detected by NeuVector. It also details for these security events. PDF reports can be generated from the Dashboard which contain detailed charts and explanations.

At the top of the dashboard there is a summary of the security risks in the cluster. The wrench tool next to the overall risk score can be clicked to open a wizard which will guide you through recommended steps to reduce/improve the risk score. Mousing over each risk gauge will provide a description of it to the right and how to improve the risk score. Also see the separate documentation section Improving Security Risk Score.

![Risks](Dashboard_Risks.png)

+ Overall Security Risk Score. This is a weighted summary of the individual risk areas summarized to the right, including Service exposure, Ingress/Egress exposure, and Vulnerability exploit risks. Click on the wrench to improve the score.
+ Service Exposure Risk Score. This is an indicator of how many services are protected by whitelist rules and running in the Monitor or Protect mode, where risk is lowest. A high ratio of services in Discover mode means these services are not segmented or isolated by whitelist rules.
+ Ingress/Egress Risk Score. This is a weighted summary of actual threats or network violations detected on ingress or egress (out of the cluster) connections, combined with allowed ingress/egress connections. External connections which are protected by whitelist rules have lower risk but can still be attacked by embedded network attacks.
+ Vulnerability Exploit Risk Score. This is the risk of exploits of vulnerabilities in running containers. Services in Discover mode with High criticality vulnerabilities will have the highest impact on the score, as they are highest risk. If services are in Monitor or Protect but still have High vulnerabilities, they are protected by network and process rules to identify (and block) suspicious activity, so will have a lower weighting on the score. A warning will be shown if the Auto-Scan button is not enabled for automatic run-time scanning.

Some of the charts are interactive, as shown below with the green arrows.

![Dashboard](Dashboard-Click.png)

Some of the event data shown in the dashboard have limits, as described in the Reporting section.

Application Protocols Detected
This chart summarizes the application protocols detected in live connections in the cluster. The category ‘Other’ means any unrecognized HTTP protocols or raw TCP connections. You can toggle between the Application Coverage and the Application Volume levels.
+ Application Coverage is the number of unique pod to pod conversations detected between application services. For example if service pod A connects to service pod B using HTTP that is one unique HTTP ‘conversation’, but all connections between A and B count as one conversation.
+ Application Volume is the network activity measured in Gbytes for all services using that protocol.

##### Network Activity
This provides a graphical map of your containers and the conversations between containers. It also shows connections with other local and external resources. In Monitor and Protect modes, violations are displayed with red or yellow lines to indicate that a violation has been detected.

NOTE: If a large number of containers or services are present, the view will automatically default to a namespace view (collapsed). Double click on a namespace icon to expand it.

Some of the actions possible are:
+ Move objects around to better view services and conversations
+ Click on any line (arrow) to see more detail such as protocol/port, latest time stamp, and to add or edit a rule (NOTE: both connection endpoints must be fully expanded by double clicking on each in order to see the connection details)
+ Click on any container to see details, and the ‘i’ for real-time connections. You can also quarantine a node from here. Right click on a container to perform actions.
+ Filter view by protocol, or search by namespace, group, container (upper right). You can add multiple filters to the selection box.
+ Refresh the map to show latest conversations
+ Zoom in/out to switch between a logical view (all containers collapsed into a service group) or physical view (all containers for the same service displayed)
+ Toggle on/off the display of orchestration components such as load balancers (e.g. built in for Kubernetes or Swarm)
+ (Service Mesh Icon) Double click to expand a pod in a service mesh such as Istio/Liknerd2 to show the sidecar and workload containers within the pod.

Right clicking on a container or selecting from the drop down above displays the following actions:
![Actions](Actions.png)

You can view active sessions, start packet capture recordings, and quarantine from here. You can also change the overall protection mode for the service (all containers for that service) here. The expand/collapse options enable you to simplify or expand the objects.

The data in the map may take a few seconds after network activity to be displayed.

See the explanation of the Legend icons at the bottom of this page.

##### Assets
Assets displays information about Nodes, Containers, NeuVector Controllers and NeuVector Enforcers.

NeuVector includes an end-to-end vulnerability management platform which can be integrated into your automated CI/CD process. Scan registries, images, and running containers and host nodes for vulnerabilities. Results for individual registries, nodes, and containers can be found here, while combined results and advanced reporting can be found in the Security Risks menu.

NeuVector also automatically runs the Docker Bench security report and Kubernetes CIS Benchmark (if applicable) on each host and running containers.

Please see the section Scanning & Compliance for additional details, including how to use the Jenkins plug-in NeuVector Vulnerability Scanner.

##### Policy
This displays and manages the run-time Security Policy which determines what container networking, process, and file system application behavior is ALLOWED and DENIED. Any conversations and activities  which are not explicitly allowed are logged as violations by NeuVector. This is also where Admission Control rules can be created.

Please see the Security Policy section of these docs for a detailed explanation of the behavior of the rules and how to edit or create rules.

##### Security Risks
This enables customizable Vulnerability and Compliance management investigation, triage, and reporting. Easily research image vulnerabilities and find out which nodes or containers contain those vulnerabilities. Advanced filtering makes reviewing scan and compliance check results and provides customized reporting.

These menu's combine results from registry (image), node, and container vulnerability scans and compliance checks to enable end-to-end vulnerability management and reporting.


##### Notifications
This is where you can see the logs for Security Events, Risk Reports (e.g. Scanning) and general Events. NeuVector also supports SYSLOG for integration with tools such as SPLUNK as well as webhook notifications.

<strong>Security Events</strong>

Use the search or Advanced Filter to locate specific events. The timeline widget at the top can also be adjusted using the left and right circles to change the time window. You can also easily add rules (Security Policy) to allow or deny the detected event by selecting the Review Rule button and deploying a new rule.

NeuVector continuously monitors all containers for know attacks such as DNS, DDoS, HTTP-smuggling, tunneling etc. When an attack is detected it is logged here and blocked (if container/service is set to protect), and the packet is automatically captured. You can view the packet details, for example:
![Capture](ping-capture.png)

<strong>Implicit Deny Rule is Violated</strong>

Violations are connections that violate the whitelist Rules or match a blacklist Rule. Violations detailed are captured and source IPs can be investigated further.

Other security events include privilege escalations, suspicious processes, or abnormal file system activity detected on containers or hosts.

<strong>Risk Reports</strong>

Registry scanning, run-time scanning, admission control events will be shown here. Also, CIS benchmarks and compliance checks results will be shown.

Please see the Reporting section for additional details and limits of the event displays in the console.

##### Settings
Add other users here. Users can be assigned either an Admin role or a Read-only role. In Kubernetes, users can be assigned one or more namespaces to access.

This is also where you can configure SYSLOG, webhooks and Import/Export the Security Policy file. You can configure SSO for SAML and LDAP/AD here as well. See the Enterprise Integration section for configuration details.

Important! Be careful when importing the configuration file. Importing will overwrite the existing settings. If you import a ‘policy only’ file, the Groups and Rules of the Policy will be overwritten. If you import a file with ‘all’ settings, then the Policy, Users, and Configurations will be overwritten. Note that the original ‘admin’ user’s password of your current Controller will also be overwritten with the original admin’s password in the imported file.

##### Multiple Cluster Management
You can manage multiple NeuVector clusters (e.g. multiple Kubernetes clusters running NeuVector on different clouds or on premise) by selecting a Master cluster, and joining remote clusters to them. Each remote cluster can also be individually managed. Security rules can be propagated to multiple clusters through use of Federated Policy settings.

#####  My Profile
You can increase the browser timeout setting, change your password and do other administrative profile edits.

#### Icon Descriptions in Legend > Network Activity

You can toggle the Legend on/off in the bottom right of the Network Activity map.
![Legend](legend1.png)

Here are what the icons mean:

##### External network
This is any network outside the NeuVector cluster. This could include internet public access or other internal networks.

##### Namespace
Namespace in Kubernetes or Project in OpenShift

##### Container in discovery
This container is in Discover mode, where connections to/from it are learned and whitelist rules will automatically be created.

##### Container being monitored
This container is in Monitor mode, where violations will be logged but not blocked.

##### Container being protected
This container is in Protect mode, where violations will be blocked.

##### Container Group
This represent a group of containers in a service. Use this to provide a more abstract view if there are many container instances for a service/application (i.e. from the same image).

##### Un-managed node
This node has been detected but does not have a NeuVector enforcer on it.

##### Un-managed container
This container has been detected but is not on a node with a NeuVector enforcer on it. This could also represent some system services.

##### IP group
This is a group of IP Addresses.

##### Normal network conversation
Allowed, whitelisted connections are displayed in blue.

##### Intra-service conversation
A connection within a service is shown in light gray.

##### Low risk network conversation
This is typically a threat detected which is not a high risk, for example a connection using an old version of SSL.

##### High risk network conversation
This is potentially a serious threat detected.

##### Violation
A connection which violates the allowed whitelist rules will be shown in red.

##### Denied network conversation
If a connection is a violation, as shown in red, and has been blocked by NeuVector, the arrow will have an ‘x’ in it.

##### Quarantined container
Containers with a red circle around them have been quarantined. To un-quarantine, click on the container and select the un-quarantine button.

