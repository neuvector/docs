---
title: Federated Policy
taxonomy:
    category: docs
---

### Federated Policy 
After a Master cluster has been created, Federated rules can be created in the Master which are automatically propagated to each cluster. This is useful to create global rules that should be applied to each cluster, such as global network rules. Federated rules will appear in every cluster as read-only and can NOT be deleted or edited by the local admin of the cluster. 

To configure Federated rules, click on Federated Policy in the upper right drop down menu. You will see tabs for Groups, Admission Control, Network Rules and other rules which can be federated. Select the tab and create a new Group or rule. In the sample below, two Federated groups have been created, which will be propagated to each cluster.

![FederatedGroup](fed_group.png)

And the following Federated Network Rule has been created to allow access of SSL from the node demo pods to google.com.

![FederatedNetwork](fed_network.png)

After these rules and groups have been propagated to the remote cluster(s), they will appear as Federated rules and groups in the local cluster's console.

![FederatedRuleRemote](fed_rule_remote.png)

In the above example, the Federated rule is shown which is different than learned rules and 'user created' rules which were created in the local cluster. The user created rule 1 can be selected for editing or deletion while the Federated can not. In addition, Federated network rules will always show at the top of the list, thus taking precedence over other rules.

Other rules such as Admission Control, Response, Process and File will behave in the same way, except that the order of rules is only relevant for the Network rules.

Note that the configuration of Process and File rules requires the selection of a Federated Group, as these must be applied to a target group as defined in the Federated Group tab. After a new Group has been configured in Federated -> Groups, it will show as a selectable option when configuring a group in Process or File rules.




