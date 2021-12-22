---
title: DLP Sensors
taxonomy:
    category: docs
---

### Data Loss Prevention (DLP) 
DLP uses the Deep Packet Inspection (DPI) of NeuVector to inspect the network payloads of connections for sensitive data violations. NeuVector uses a regular expression (regex) based engine to perform packet filtering functions. Extreme care should be taken when applying DLP sensors to container traffic, as the filtering function incurs additional system overhead and can impact performance of the host.

#### DLP Sensors
DLP Sensors are the patterns that are used to inspect traffic. Built in sensors such as credit card and U.S. social security have predefined regular expressions. You can add custom sensors by defining regex patterns to be used in that sensor.

Sensors must be applied to a Group to become effective.

***Log4j Detection Pattern***  The WAF-like rule to detect the Log4j attempted exploit is below. Please note this should only be applied to Groups expecting ingress web connections.
```
\$\{((\$|\{|\s|lower|upper|\:|\-|\})*[jJ](\$|\{|\s|lower|upper|\:|\-|\})*[nN](\$|\{|\s|lower|upper|\:|\-|\})*[dD](\$|\{|\s|lower|upper|\:|\-|\})*[iI])((\$|\{|\s|lower|upper|\:|\-|\})|[ldapLDAPrmiRMIdnsDNShttpHTTP])*\:\/\/.*
```

Also note that there are ways that attackers could bypass detection by such rules.

#### Applying DLP Sensors to Container Groups
To activate a DLP sensor, go to Policy -> Groups to select the group desired. Enable DLP for the Group and add the sensor(s). The DLP inspection will be performed on network traffic entering or leaving containers in the group. It will not be performed on traffic between containers within a group.

It is recommended that DLP sensors be applied to the boundary of a security zone, defined by a Group, to minimize the impact of DLP inspection. If needed, define a customer Group that represents such a security zone.  For example, if the Group selected is the reserved group 'containers', and DLP sensors added to the group, only traffic in or out of the cluster and not between all containers will be inspected. Or if it is a custom group defined as 'namespace=demo' then only traffic in or out of the namespace demo will be inspected, and not any inter-container traffic within the namespace.

<strong>DLP Behavior Summary</strong>

+ Pattern match happens on the entire packet payload (searching based on protocol and protocol header fields are not supported at this time).
+ Pattern matching does not occur for the traffic which is passing among workloads that belong to same DLP group.
+ Any traffic passing in and out of the DLP group is scanned for pattern matches. 
+ Cluster ingress and egress traffic is scanned for patterns if the workload is allowed to make ingress/egress connections.
+ Multiple alerts are generated for a single packet if it matches multiple DLP rules.
+ For performance reasons, only the first 16 rules are alerted and matched even if the packet matches more than 16 rules.
+ DLP alerts are aggregated and reported together if same rule matches and alerts multiple times within 2 seconds.
+ PCRE is used for pattern matching. 
+ Hyper scan library is used for efficient, scalable and high-performance pattern matching.

#### DLP Actions in Discover, Monitor, Protect Modes
When adding sensors to groups, the DLP action can be set to Alert or Deny, with the following behavior if there is a match:
+ Discover mode. The action will always be to alert, regardless of the setting Alert/Deny.
+ Monitor mode. The action will always be to alert, regardless of the setting Alert/Deny.
+ Protect mode. The action will be to alert if set to Alert, or block if set to Deny.

### Detailed DLP Configuration

Add DLP sensors by selecting the Group, then Enable DLP to edit/add sensor(s).

![AddDLP](dlp1.png)

#### Creating Custom Sensors
+ Add a new DLP sensor from Policy->DLP Sensors
+ Provide a unique name to the sensor
+ Enter a meaningful description under the comment section for the sensor such as “protecting email id”
+ Enter the pattern name
+ Enter a regular regression for the pattern match 
    - Example \bThis\s\w{4}\s\w{3}\s\w{4}\s\w{6}\s\d+\stimes!
    - The above pattern match the pattern below:
    - This page has been viewed 6 times!
+ Verify that the pattern is correct by providing an actual string to be matched in the 'Test regex pattern' box
+ Click + to add the pattern
+ Click ADD button to add the custom sensor


![CustomDLP](dlp2_custom.png)

Add the Custom Sensor to a Group
+ In the Policy->Groups menu, select the Group which needs to be protected
+ Edit DLP setting
+ Select the custom sensor created above 
+ Choose the action Alert or Deny
+ Apply the DLP configuration to the group

![AddDLP](dlp3_add.png)

#### Sample Alerts

DLP match in Discover or Monitor Mode

![DLPAlert](dlp4_alert_discover.png)

DLP match in Protect Mode

![DLPProtect](dlp_5_protect.png)

DLP Security Event Notification for Credit Card Match

![DLPCredit](dlp6_credit.png)

NOTE: The automated packet capture will contain the actual packet including the credit card number matched. This is also true of any DLP packet capture for any sensitive data.

### DLP Response Rules
Response rules based on DLP security events can be created in Policy ->Response Rules. Start type DLP and the dropdown will list all DLP sensors and patterns available to create rules.

![DLPResponse](dlp7_response.png)

