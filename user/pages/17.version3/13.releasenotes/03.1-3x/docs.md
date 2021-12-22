---
title: 1.3.x Release Notes
taxonomy:
    category: docs
---

### Release Notes for 1.3.x
1.3.0
New Features / Enhancements
	•	Detect Reverse Shell and DNS/ICMP tunneling, common techniques used for data exfiltration. Reverse shells are reported as suspicious processes in the Notifications -> Incidents page. Tunneling is reported as an attack in the Notifications -> Threats page. 
	•	Report suspicious processes such as SSH, SCP, Telnet, port scan and tunneling in the Notifications -> Incidents page. 
	•	Add support controller and enforcer rolling update. Use the kubernetes service rolling update scheme to upgrade controllers one by one so no service interruption during the upgrade process and configurations are retained. 
	•	Add support for LDAP and SAML authentication. Support LDAP and SAML label mapping to automatically assign roles to the login users and support single sign on (SSO). 
	•	Automatically capture malicious packets when threats are detected. Attacks and the packet capture are displayed in the Notifications -> Threats page. 
	•	On-demand packet capture. Allow users to capture a container’s network activity and save them in pcap files. Multiple capture sessions can be started on one or more containers. When finished, the pcap file is made available for download. Packet capture can be initiated from the Network Activity tab by right clicking on a container, or from the CLI/RESTAPI. 
	•	Add support for webhook integration to report logs. This can be configured in the Settings -> Configuration page. 
	•	Add support for DNS names used in firewall rules. A DNS name can be used in creating a Group in the Policy tab, using ‘address=<dns name>’. This DNS name base group can then be used in a Rule to control ingress/egress to non-containerized workloads such as API services.

	•	Add support for regex in defining a Group. Regular expressions can be used when defining a Group, in the Policy tab. Groups are then used to create Rules for whitelists and blacklists of network connections.

	•	Improve the integration with Docker EE, UCP and Kubernetes/OpenShift namespace definitions, to automatically read them and reflect them in NeuVector. 
	•	UI usability improvements for the Console 
	◦	Display the container list with pod hierarchy in Kubernetes and OpenShift environments. This makes it clear which containers(s) are running in what pods.  
	◦	Find/zoom into suspicious containers. From the Notifications tab, for Threats, Incidents, and Violations, any container listed under Client or Server can be found quickly by clicking on it. This will switch to the Network Activity tab and automatically zoom into the container. 
	◦	Container Actions List. In Network Activity, right-click or double-click on a container to bring up the container context menu with extra actions. These include viewing current network sessions, starting a packet capture, and quarantine. The protection mode can also be switched between Discover, Monitor, and Protect. 


1.3.1
New Features / Enhancements
	•	Improve network traffic interception. No latency is incurred when filtering traffic and performance is at ‘line-speed’ in discover and monitor mode. 
	•	Report connection details of reverse shell and tunnelling activities. Improve the incident and threat logging page in the Notifications tab to show client/server detail information. 
	•	Allow user to create groups based on kubernetes namespaces, with keyword 'domain'. Groups are used to create the blacklist and whitelist rules. Example, domain=kube-system 
	•	Add ability to filter the view in the Network Activity tab by namespace, service and container. This makes it easier to view and work on deployments with a high number of applications, services, and containers. 
	•	Increase the maximum number of concurrent login users to the NeuVector manager container from 8 to 32.

Bug Fixes 
	•	Resolve graph spinning issue. The console display of containers in the Network Activity tab would slowly spin/rotate in certain situations. 
	•	Fix false positives in Reverse Shell detection and Kubernetes CIS benchmark. 


1.3.2
New Features / Enhancements
	•	Support persistent data for NeuVector policy and configuration. Configures real-time backup to mount volume at /var/neuvector/. The primary use case is when the persistent volume is mounted, the configuration and policy are stored during run-time to the persistent volume. In the case of total failure of the cluster, the configuration is automatically restored when the new cluster is created. Configuration and policy can also be manually restored or removed from the /var/neuvector/ volume. 
	•	Automated vulnerability / CVE database updates are supported. The new Updater container built with the latest database is pushed to the NeuVector Docker Hub every day. The process and yaml file to use the 'updater' container to update the database in running controllers are provided in the NeuVector doc. Kubernetes based samples use a cron job to run the updater daily. 
	•	Improve performance by reducing packet latency in protect mode. This improves maximum throughput for inline, protect mode packet processing. 
	•	Add (overlay) vulnerability scan results on containers in the Network Activity tab in the console. Mouse over the red or yellow dot displays the number of high or medium criticality vulnerabilities found from the latest scan result. 
	•	Added a function to gather the NeuVector debug logs to assist support with troubleshooting. This can be found in Settings -> Configuration -> Debug log. 
	•	Allow user to assign a name to the NeuVector cluster. The cluster name is reported in all logs and webhook messages. This is helpful when multiple NeuVector clusters are reporting events to the same channel (SYSLOG, webhook etc). 
	•	Improved notification messages. The container image name and version are reported in violation, threat and incident logs. 
Bug Fixes
	•	The error ’dp' process memory overrun is resolved. This issue was reproduced and fixed.

	•	The browser cache is now discarded when UI of a new NeuVector release is loaded. Clearing browser cache is not necessary. This avoids UI issues when upgrading to a new release and viewing the console in a browser.
 


Known Issues as of 1.3.2
	•	In an environment where enforcers are not deployed on all container hosts, network connections to the 'unmanaged' container will be displayed as an endpoint in the solid blue color with IP addresses. These endpoints cannot be removed automatically from the display when the container is removed, but can be removed through the CLI or REST API.

	•	When deploying on Google cloud using the default ‘cos’ image, Protect mode (inline blocking) is not supported and should not be used. Monitor mode (alerting only) is supported. Use the Ubuntu image when deploying the cluster or vm to be able to use Protect mode. 

	•	Docker Swarm / EE does not support the deployment of privileged containers. Use docker-compose or run to deploy and manage NeuVector containers.

	•	Deploying a separate Controller container on the same node as an Enforcer container is not supported in Docker EE / Swarm. Use the Allinone container if running a Controller with Enforcer is desired on the same node. This issue does not exist for Kubernetes or Rancher based deployment

1.3.3, 1.3.4, 1.3.5
Various bug fixes related to CIS benchmarks for Kubernetes, vulnerability scanning, and memory consumption