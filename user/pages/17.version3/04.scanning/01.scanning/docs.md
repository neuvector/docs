---
title: Scanning & Compliance
taxonomy:
    category: docs
---

NeuVector enables full lifecycle scanning & compliance through vulnerability scanning and running of the CIS benchmarks for security, as well as custom compliance checks. The Security Risks menu enables customizable Vulnerability and Compliance management investigation, triage, and reporting. Easily research image vulnerabilities and find out which nodes or containers contain those vulnerabilities. Advanced filtering makes reviewing scan and compliance check results easy and provides customized reporting.


<strong>Security Risks Menu</strong>

These menu's combine the results from registry (image), node, and container vulnerability scans and compliance checks found in the Assets menu to enable end-to-end vulnerability management and reporting.

The Vulnerabilities and Compliance menus provides a powerful explorer tool to: 
+ Make it easy to filter for viewing or downloading of reports, by typing in a search string or using the advanced filter next to the box. The advanced filter allows users to filter vulnerabilities by fix available (or not available), urgency, workloads, service, container, nodes or namespace names.
+ Understand the Impact of vulnerabilities and compliance checks by clicking on the impact row and reviewing remediation and impacted images, nodes, or containers.
+ View the Protection Status (exploit risk) of any vulnerability or compliance issue to see if there are NeuVector Run-Time security protections (rules) enabled for impacted nodes or containers.

![SecurityRisks](Security_Risks_Menu.png)

Use the filter box to enter a string match, or use the advanced filter next to it to select more specific criteria, as shown below. Downloaded PDF and CSV reports will show only the filtered results.

![AdvancedFilter](sec_risks_filter_impact.png)

Selecting any CVE or CIS benchmark row listed provides additional details about the CVE, remediation, and which images, nodes, or containers are Impacted. The Protection State icon (circle) shows various colors to indicate a rough percentage of the impacted items which are unprotected by NeuVector during run-time, protected by NeuVector rules (in a Monitor or Protect mode), or unaffected in run-time (e.g. an image scanned with this vulnerability has no running containers). The Protection State column color scheme is:
+ Black = unaffected
+ Green = protected by NeuVector with Monitor or Protect mode
+ Red = unprotected by NeuVector, still in Discover mode

The Impact analysis window (showing affected images, nodes, containers) color scheme is:
+ Black = unaffected. There are no containers using this image in production
+ Purple = running in Monitor mode in production
+ Dark Green = running in Protect mode in production
+ Light Blue = running in Discover mode in production (unprotected)

The Impact colors are meant to correspond to the run-time protection colors for Discover, Monitor and Protect modes in other places in the NeuVector console.

The Compliance menu works the same way but shows CIS and Custom benchmark results instead of vulnerabilities.

<strong>Assets Menu</strong>
+ Platforms. The orchestration platform such as Kubernetes, and vulnerability scans of the platform.
+ Nodes. Nodes/hosts protected by NeuVector Enforcers, and results of Compliance checks such as CIS benchmarks and custom checks, as well as host vulnerability scans.
+ Containers. All containers in the cluster including system containers, and the results of Compliance checks such as CIS benchmarks and custom checks, as well as container run-time Vulnerability scans. Process activity and performance statistics can also be found here.
+ Registries. Registries/repositories scanned by NeuVector. Layered image scanning results are found here, and scan results can be used in Admission control rules (found in Policy -> Admission Controls).
+ Controllers. The NeuVector Controller containers running in the cluster as the control plane, managing the NeuVector Enforcer containers. One controller is active, an indicated as the Leader.
+ Enforcers. The NeuVector Enforcer containers and details such as performance statistics for the Enforcer.

Note: Custom compliance checks as mentioned above are defined in the Policy -> Groups menu.

### Registry, Image and Container Scanning
NeuVector supports a complete vulnerability management workflow for ensuring that vulnerable containers do not get deployed to registries or production. You can easily integrate the NeuVector vulnerability scanner into your CI/CD pipeline to scan during the Build, Ship and Run phases.

Major features include:
+ Registry scanning including filtering of repositories monitored and viewing the layered scan results
+ Build-phase pipeline plug-ins such as Jenkins, Bamboo, CircleCI to scan containers and enforce build policies based on scan results
+ Automated run-time scanning of all running containers
+ Automated run-time scanning of all hosts in a cluster
+ Automated run-time scanning of the orchestration platform (e.g. Kubernetes)
+ Sample automation scripts to trigger image scans using the REST API and CLI
+ Notifications and downloadable reports
+ Integration with Admission Control rules to prevent deployment of vulnerable images
+ Automated response rules to quarantine, notify, or suppress notifications based on vulnerability criteria
+ Vulnerability and Compliance management and reporting in the Security Risks menu described above.
+ Deploy multiple parallel scanner pods to increase scanning performance for thousands of images

Registry scanning and the use of build time plug-ins requires that the NeuVector Allinone or Controller container be deployed on a host/node. Please see the Installation/Deployment section for how to deploy the NeuVector container. Configure registry scanning from the NeuVector console after logging in to the manager.

#### Registry Scanning
To configure registries and repositories to be scanning, go to the Assets -> Registries menu in the NeuVector console. Add or edit registries to be scanned. Use the Filter to define repositories or subsets of images to be scanned. If your registry requires access through a proxy, this can be configured in Settings -> Configuration.


![Registry](registry-scan.png)

The registry will be scanned according to a schedule, which is configurable. By default, only new or updated images will be scanned. If you want to re-scan all applicable images whenever the CVE database is updated, select the Rescan After CVE DB Update button when configuring the registry. You can also select Layered Scan to show vulnerabilities by each layer in the image (note: layered scans can take longer and consume more resources to complete).

After the scan is completed you will see the results below it. Click on the repository/tag to see vulnerabilities and click on the vulnerability to see more info. You can also download the report in a CSV file or see the results in the Event logs.

![Layered](layered_scan.png)

For detailed instructions for Registry Scanning, please see the next section titled Registry Scanning Details.

#### Build Phase Plug-Ins
You can download the plug-in from the Jenkins Plug-in Manager. The Bamboo scanner is available at https://github.com/neuvector/bamboo-plugin/releases/tag/1.0.1.  The CircleCI ORB is available at https://github.com/neuvector/circleci-orb and through the CircleCI ORB catalog. 

These plug-ins will access the NeuVector allinone or controller container to perform scanning. You will need to know the IP address or name for host where NeuVector is running. 

If your pipeline tool is not currently supported by NeuVector, you can still use the REST API triggered from your pipeline script, to perform a vulnerability scan on an image during build. Please see the section on Automation for an example of the REST API for scanning.

#### Automated Run-Time Scanning
NeuVector can scan running containers, host nodes, and the orchestration platform for vulnerabilities. In the Assets menu for Nodes or Containers, enable Auto-Scan by clicking on the Vulnerabilities tab for a node or container, then Auto-Scan (appears in upper right) to scan all running containers, nodes, and platform including newly started ones once they start running. You can also select a container or node and scan it manually.

You can click on each vulnerability name/CVE that is discovered to retrieve a description of it, and click on the inspect arrow in the popup to see the detailed description of the vulnerability.


![Vulnerabilities](Vuln1.png)

The auto-scan will also be triggered when ever there is an update to the NeuVector CVE database. Please see the section Updating the CVE Database for details.

### CIS Benchmarks for Security
NeuVector also automatically runs the Docker Bench security report and Kubernetes CIS Benchmark (if applicable) on each host and running containers. The results can be viewed in the Compliance tab for the node or container under the Assets menu. 

You can download a csv report of the test results, as well as rerun the benchmark manually or with the CLI/REST API. A remediation field is provided for convenience.

![Benchmark](cis_container1.png)

You can add custom compliance checks in the form of scripts that run in selected container Groups or on Nodes. See the section Security Policy -> Custom Compliance Checks for instructions.

### Automated Actions, Mitigations, and Responses Based on Vulnerabilities
Admission control rules can be created to prevent deployment of vulnerable images based on Registry scanning results. See the Security Policy -> Admission Control section for details.

Please see the section Security Policy -> Response Rules for instructions for creating automated responses to vulnerabilities detected either during registry scanning, run-time scanning, or CIS benchmarks. Responses can include quarantine, webhook notification, and suppression.
