---
title: Process Profile Rules
taxonomy:
    category: docs
---

### Policy -> Groups -> Process Profile RulesProcess profile rules use baseline learning to profile the processes that should be allowed to run in a group of containers (ie. a Group). Under normal conditions in a microservices environment, for containers with a particular image, only a limited set of processes by specific users would run. If the container is attacked, the malicious attacker would likely initiate some new programs commonly not seen in this container. These abnormal events can be detected by NeuVector and alerts and actions generated (see also Response Rules).
Process baseline information will be learned and recorded when the service Group is in Discover (learning) mode. When in Monitor or Protect mode, if a process that has not been seen before is newly started, or an old process is started by a different user than before, the event will be detected and alerted as a suspicious process in Monitor mode or alerted and blocked in Protect mode. Users can modify the learned profile to allow or deny (whitelist or blacklist) processes manually if needed.
Note that in addition to baseline processes, NeuVector has built-in detection of common suspicious processes such as nmap, reverse shell etc. These will be detected and alerted/blocked unless explicitly white listed for each container service.

####Process Rules for Nodes
The special reserved group 'nodes' can be configured to enforce process profile rules on each node (host) in the cluster. Select the group 'nodes' and review the process rules, editing if required. Then switch the protection mode to Monitor or Protect. The 'local' (learned) process rule list is a combination of all processes from all nodes in the cluster while in Discover mode.

####Process Rules for Custom Groups
For user defined custom Groups, process rules, if desired, must be manually added. Custom Groups do not learn process rules automatically.


####Process Rules Precedence
Process rules can exist for user defined custom Groups as well as auto-learned Groups. Rules created for custom Groups take precedence over rules for auto-learned Groups.

For the process rule list within any Group, the rule order in the console determines its precedence. The top rules listed are matched first before the ones below it.

Process rules with name and path both containing wildcards take precedence over other rules to Allow action. A Deny action is not allowed with both wildcards to avoid blocking all processes.

Process rules with a Deny action and wildcard in the name will take precedence over Allow actions with wildcard in the name.
#### Discover mode+ All new processed are profiled with action allow+ Users can change the action into 'deny' for generating alert or blocking when same new process is started+ Users can create a profile for a process with either allow or deny+ Process profile rules can contain name and/or path
+ Wildcards &#42; can be used to match all for name or path

Note:  A suspicious process (built-in detect), such as nmap, ncat. etc., is reported as a suspicious process event and will NOT be learned. If a service needs this process, the process needs to be added with an 'allow' profile rule explicitly.
#### Monitor/Protect mode (new container started in monitor or protect mode)+ Every new process generates an alert+ Process profile rules can contain name and/or path
+ Wildcards &#42; can be used to match all for name or path

If a) process matches a deny rule, or b) process is not in the list of allow rules, then:
+ In Monitor mode, alerts will be generated
+ In Protect mode, processes will be blocked and alerts generated

Note:  Container platforms with the AUFS storage driver will introduce a delay in blocking mechanism due to the driver’s limitations. 

Note:  In Protect mode, system containers such as Kubernetes ones, will not enable the block action but will generate a process violation event if there is a process violation. 
#### Creating process profile rules
Multiple rules can be created for the same process. The rules are executed sequentially and the first matching rule will be executed.
+ Click Add rule (+) from process profile rules tab
+ Process profile rules can contain name and/or path
+ Wildcards &#42; can be used to match all for name or path
Example:  To allow the ping process to run from any directory 
![pingRule](ping.png)
Violations will be logged in Notifications -> Security Events.![violation](process_event.png)