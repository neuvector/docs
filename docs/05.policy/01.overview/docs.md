---
title: Security Policy Overview
taxonomy:
    category: docs
---

### NeuVector Security Policy
To detect Violations of normal behavior, NeuVector maintains a security Policy which can be managed from the GUI, CLI, CRD, or REST API.

#### Groups
This provides the primary view of service Groups and custom Groups to set the mode (Discover, Monitor, Protect) for each service and to manage rules. Groups are automatically created by NeuVector, but custom groups can be added. Rules for each Group are automatically created by NeuVector when containers begin running. Container Groups can have a Split Policy Mode where the Process/File rules are in a different enforcement mode than the Network rules, as described [here](/policy/modes#network-service-policy-mode).

To select a Group to view or manage, select the check box next to it. This is where Process Profile Rules, File Access Rules, DLP, and Custom Compliance checks are managed. Network Rules can be viewed here but are managed in a separate menu.
Network and Response Rules in NeuVector are created using a ‘from’ and ‘to’ field, which requires a Group as input. A group can be an application, derived from image labels, DNS name or other customized grouping. DNS subdomains are supported, e.g. *.foo.com. IP addresses or subnets can also be used which is useful to control ingress and egress from non-containerized workloads.

![groups](groups_node_demo.png)

Reserved group names created automatically by NeuVector include:
+ Containers. All running containers.
+ External. Connections coming into the cluster (ingress).
+ Nodes. Nodes or hosts identified by NeuVector.

The Groups menu is also where the "Export Group Policy" can be performed. This exports the security policy (rules) for the selected groups as a yaml file in the format of the NeuVector custom resource definition (CRD) which can be reviewed and then deployed into other clusters.

Note that the Status of a Group's containers is shown in Policy -> Groups -> Members, which indicates the NeuVector protection mode (Discover, Monitor, Protect). If the container is shown in an 'Exit' state, it is still on the host but is stopped. Removing the container will remove it from an Exit state.

#### Network Rules
A list of whitelist and blacklist rules for NeuVector to enforce. NeuVector can auto-discover and create a set of whitelist rules while in Discover mode. Rules can be added manually if desired.

NeuVector automatically creates Layer 7 (application layer) whitelist rules when in Discover mode, by observing the network connections and creating rules which enforce application protocols.

NeuVector also has built-in network attack detection which is enabled all the time, regardless of mode (Discover, Monitor, Protect). The network threats detected include DDoS attacks, tunneling and SQL injection. Please see the section Network Rules for a full list of built-in threat detection.

DLP (Data Loss Prevention) rules can also be applied to container Groups to inspect the network payload for potential data stealing or privacy violations such as unencrypted credit card data. Violations can be blocked. Please see the section on DLP for details on how to create and apply DLP filters.

#### Process Profile and File Access Rules
NeuVector has built-in detection of suspicious processes and file activity as well as a baselining technology for containers. Built-in detection includes processes such as port scanning (e.g. NMAP), reverse shell, and even privilege escalations to root. System files and directories are automatically monitored. Each service discovered by NeuVector will create a baseline of ‘normal’ process and file behavior for that container service. These rules can be customized if desired.

#### Response Rules
Response Rules enable users to define actions to respond to security events. Events include Threats, Violations, Incidents, and Vulnerability Scan results. Actions include container quarantine, webhooks, and suppression of alerts.

Response Rules provide a flexible, customizable rule engine to automate responses to important security events.

#### Admission Control Rules
Admission control rules allow or block deployments. More details can be found in this section under Admission Controls.

#### DLP and WAF Sensors
Data Loss Prevention (Data Leak Protection) and WAF rules can be enabled on any selected container Group. This utilizes Deep Packet Inspection to apply regular expression based matching to the network payload entering or leaving the selected container group. Built-in sensors for credit card and US social security number are included for examples, and custom regular expressions can be added.


#### Migration, Backup, Import/Export
Migration of the security policy can be accomplished by CRD, REST API, or import/export. For example, learned and custom rules can generate a CRD yaml file(s) in a staging environment for deployment to the production environment.

The Security Policy for NeuVector can be exported and imported in Settings -> Configuration. It is recommended to backup All configuration prior to any update of NeuVector to a new version.

<Strong>IMPORTANT</Strong> Importing ALL (Config and Policy) will overwrite everything, including the main admin login credential. Be sure you know the main admin login for the imported file before importing.
