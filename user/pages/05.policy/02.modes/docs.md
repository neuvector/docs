---
title: Modes: Discover, Monitor, Protect
taxonomy:
    category: docs
---

### NeuVector Modes

The NeuVector Violation Detection module has three modes: Discover, Monitor, and Protect. At any point in time, any Group (beginning with 'nv', or the 'Nodes' group) can be in any of these modes. The mode can be switched from the Groups menu, Network Activity view, or the Dashboard.

![Modes](switchmodes.png)

Note: Custom created groups don't have a Protection mode. This is because they may contain containers from different underlying groups, each of which may be in a different mode, causing confusion about the behavior.

##### Discover
By default, NeuVector starts in Discover mode. In this mode, NeuVector:
- Discovers your container infrastructure, including containers, nodes, and hosts.
- Learns your applications and behaviors by observing conversations (network connections) between containers.
- Identifies separate services and applications running.
- Automatically builds a whitelist of Network Rules to protect normal application network behavior.
- Baselines the processes running in containers for each service and creates whitelist Process Profile Rules.

Note: To determine how long to run a service in Discover mode, run test traffic through the application and review all rules for completeness. Several hours should be sufficient, but some applications may require a few days to be fully exercised. When in doubt, switch to Monitor mode and check for violations, which can then be converted to whitelist rules before moving to Protect mode.


##### Monitor
In Monitor mode NeuVector monitors conversations and detects run-time violations of your Security Policy. In this mode, no new rules are created by NeuVector, but rules can manually be added at any time.

When violations are detected, they are visible in the Network Activity map visually by a red line. Violations are also logged and displayed in the Notifications tab. Process profile rule and file access violations are logged into Notifications -> Security Events.

In the Network map you can click on any conversation (green, yellow, red line) to display more details about the type of connection and protocol last monitored. You can also use the Search and Filter by Group buttons in the lower right to narrow the display of your containers.

##### Protect
In Protect mode, NeuVector enforcers will block (deny) any network violations and attacks detected. Violations are shown in the Network map with a red ‘x’ in them, meaning they have been blocked. Unauthorized processes and file access will also be blocked in Protect mode. DLP sensors which match will block network connections.

### Switching Between Modes
You can easily switch NeuVector Groups from one mode to another. Remember that in Discover mode, NeuVector is building a Security Policy for allowed, normal container behavior. You can see these rules in the Policy -> Groups tab or in detail in the Policy -> Network Rules menu. 

When you switch from Discover to Monitor mode, NeuVector will flag all violations of normal behavior not explicitly allowed. Because NeuVector enforces policy based on applications and groups with similar attributes, it’s typically not necessary to add or edit rules when scaling up or scaling down containers.

Please ensure that, before introducing new updates that result in new types of connections between containers, you switch the affected Service(s) to Discover mode to learn these new behaviors. Alternatively, you can manually add new rules while in any mode, or edit the CRD used to create the rules to add new behaviors.

##### New Service Mode
If new services are discovered by NeuVector, for example a previously unknown container starts running, it can be set to a default mode. In Discover mode, NeuVector will start to learn its behavior and build Rules. In Monitor, a violation will be generated when connections to the new service are detected. In Protect, all connections to the new service will be blocked unless the rules have been created prior.

![NewServiceMode](newservices.png)

##### Conflict Resolution Between Services In Different Modes
For network connections between containers in different service groups, if their policy modes are different, the following table shows how the system resolves the conflicts.


| Source | Destination | Effective Mode |
| ------ | ----------- | -------------- |
| Discover | Monitor | Discover |
| Discover | Protect | Discover |
| Monitor | Discover | Discover |
| Monitor | Protect | Monitor |
| Protect | Discover | Discover |
| Protect | Monitor | Monitor |

As you can see, the effective mode always defaults to the least restrictive policy mode.

NOTE:  The above applies only for Network Rules
