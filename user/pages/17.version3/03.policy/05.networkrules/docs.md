---
title: Network Rules
taxonomy:
    category: docs
---

### Policy: Network Rules
NeuVector automatically creates Network Rules from your running applications in Discover mode. You can also manually add them in any mode, Discover, Monitor, or Protect. Rules can be added or edited from the CLI or REST API.

NeuVector uses a declarative policy which consist of rules which govern allowed and denied application layer connections. NeuVector analyzes and protects based on not only IP address and port, but by determining the actual network behavior based on application protocols. This enables NeuVector to automatically protect any new application containers regardless of IP address and port.

Network rules specify ALLOWED or DENIED behavior for your applications. These rules determine what connections are normal behavior for your services as well as what are violations. You can delete automatically ‘learned’ rules as well as add new rules to your policy.

<Strong>IMPORTANT</Strong>  Network rules are enforced in the order that they appear in the list, from top to bottom. To re-order the rules, select the rule you want to move, then you will see a 'Move to' box appear at the top, and you can move the selected rule to the position before or after a specified rule.

<Strong>IMPORTANT</strong>  If you edit (add, delete, change) rules, your changes are NOT applied until you click the Save button at the top. If you exit this page without deploying your changes, they will be lost.

<Strong>Adding New Rules</strong>
Add a rule using the ‘+’ either below another rule in the right column, or using the button in the lower right.

+ **ID**
> (Optional) Enter a number. Network rules are initially ordered from lowest to highest, but rule order can be changed by dragging and dropping them in the list.

+ **From**
> Specify the GROUP from where the connection will originate. Start typing and NeuVector will match any previously discovered groups, as well as any new groups defined.

+ **To**
> Specify the destination GROUP where these connections are allowed or denied.

+ **Applications**
> Enter applications for NeuVector to allow or deny. NeuVector understands deep application behavior and will analyze the payload to determine application protocols. Protocols include HTTP, HTTPS, SSL, SSH,DNS, DNCP, NTP, TFTP, ECHO, RTSP, SIP, MySQL, Redis, Zookeeper, Cassandra, MongoDB, PostgresSQL, Kafka, Couchbase, ActiveMQ, ElasticSearch, RabbitMQ, Radius, VoltDB, Consul, Syslog, Etcd, Spark, Apache, Nginx, Jetty, NodeJS, Oracle, MSSQL and gRPC.

Note: To select Any/All, leave this field blank

+ **Ports**
> If there are specific ports to limit this rule to, enter them here. For ICMP traffic, enter icmp.

Note: To select Any/All, leave this field blank

+ **Deny/Allow**
> Indicate whether this rule is to Allow this type of connection, or Deny it. 

If Deny is selected, NeuVector will log this as a violation while in Monitor mode, and will block this while in Protect mode. The default action is to Deny a connection (log violation only if in Monitor mode) if no rule matches it.

Don’t forget to Deploy/Update if you make any changes!

### Allowing Connections to Trusted Internal Services on Other Networks

A common use case for customizing rules is to allow a container service to connect to a network outside of the NeuVector managed cluster’s network. In many cases, since NeuVector does not recognize this network it will classify it as an ‘External’ network, even if it is an internal network.

To allow containers to connect to services on other internal networks, first create a group, then a rule for it.

1. Create a Group. In Policy -> Groups, click to add a new Group. Name the group (e.g. internal) then specify the criteria for the group. For example, specify the DNS name, IP address or address range of the internal services. Save the new group.

2. Create a Rule. In Policy -> Rules, click to add a new rule. Select the group representing the container From which the connections will originate, then the To group (e.g. internal). You can further refine the rule with specific protocols or ports, or leave blank. Make sure the selector is set to Allow (green). 

Be sure to click Deploy to save the new rule.

Finally, review the list of rules to make sure the new rule is in the order and priority desired. Rules are applied from top to bottom.

###Built-In Network Threat Detection
NeuVector automatically detects certain network attacks, regardless of protection mode. In Discover and Monitor mode, these threats will be alerted and can be found in Notifications -> Security Events. In Protect mode, these will alerted as well as blocked. Response rules can be created based on threat detection as well.

NeuVector includes the following detections for threats:

+ SYN flood attack
+ ICMP flood attack
+ IP Teardrop attack
+ TCP split handshake attack
+ PING death attack 
+ DNS flood DDOS attack
+ Detect SSH version 1, 2 or 3
+ Detect SSL TLS v1.0
+ SSL heartbeed attack
+ Detect HTTP negative content-length buffer overflow
+ HTTP smugging attack
+ HTTP Slowloris DDOS attack
+ TCP small window attack
+ DNS buffer overflow attack
+ Detect MySQL access deny
+ DNS zone transfer attack
+ ICMP tunneling attack
+ DNS null type attack
+ SQL injection attack
+ Apache Struts RCE attack
+ DNS tunneling attack
+ TCP Small MSS attack
+ Cipher Overflow attack


