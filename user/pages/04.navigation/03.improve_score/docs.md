---
title: Improve Security Risk Score
taxonomy:
    category: docs
---

### Improving the Security Risk Score

The Security Risk Score in the Dashboard provides a score between 0 and 100.
+ 0-20 Good
+ 21-50 Fair
+ 51-100 Poor

The score is the sum of following metrics, each shown as a maximum value, with a max 100:

+ NeuVector Protection Mode - 30
+ Ingress/Egress Risk - 42
+ Privileged Containers - 4
+ Root Containers - 4
+ Admission Controls - 4
+ Vulnerabilities - 16 (Containers - 8, Host - 6, orchestrator Platform - 2)

By default, NeuVector includes all containers, including system containers, in the risk score. This can be customized for each learned container Group to disable certain containers from being included in the risk score calculation, as shown below.

#### How to Improve the Score

##### NeuVector Protection Mode
1. Change the New Service Protection Mode in Settings -> Configuration to Monitor or Protect
2. Change all ‘learned’ Groups in Policy -> Groups to Monitor or Protect

Or
1. Click the Tool icon to follow the Wizard to perform the above steps

##### Ingress/Egress Risk
1. Click the Tool icon to follow the Wizard to review Ingress and Egress 
2. Review all Ingress and Egress Connections to make sure they should be allowed
3. Switch all services that are still in Discover mode to Monitor or Protect
4. Review and Clear all threats, violations and session history by clicking the Delete/Trash icon for each one

##### Privileged and/or Root Containers 
1. Remove privileged containers
2. Remove Root Containers
Note: This may not be possible due to your required containers, however each of these only account for 4 points.

##### Admission Controls
1. Make sure that, in a Kubernetes/OpenShift environment, Admission Control is enabled and there is at least one active rule in Policy -> Admission Control

##### Vulnerabilities
1. Make sure all non-system containers are in Monitor or Protect mode, in Policy -> Groups
2. Remove/remediate host vulnerabilities
3. Remove/remediate orchestrator platform (e.g. Kubernetes, OpenShift) vulnerabilities


#### How to Customize Which Container Groups Are Included in the Score

To enable or disable which container Groups are included in the Security Risk Score, go to the Policy -> Groups menu, and select the Group to modify. The summary column on the right has a 'Scorable' icon which indicates which groups are used for scoring. 

![scorable](risk_scorable.png)

Select or deselect the Scorable check box in the upper right for the selected Group.

Note: Only 'learned Groups' (e.g. those that begin with 'nv.') can be edited, not reserved groups or custom groups.

