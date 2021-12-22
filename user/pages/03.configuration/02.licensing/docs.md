---
title: Licensing
taxonomy:
    category: docs
---

### Licensing

Please contact NeuVector at support@neuvector.com to obtain a trial or production license. You may contact your NeuVector sales representative, or alternatively generate a request from the Console. In Settings -> License, click Renew to generate a license request.

If the license is missing or invalid, no Enforcer is allowed to connect to the Controller, and the managed node count will be 0. A message on the dashboard's banner section also indicates the license is invalid.

A license includes the expiration date and maximum number of nodes the system protects. To apply the license, go to the Settings -> License page, paste in the license key, click "Activate" button, then the new license will be applied. 

Note: Certain features such as Multi-Cluster management and Serverless require a separate fee to be enabled in the license.

The license key is tied to the node where the Controller/Allinone container is running. It cannot be used in other NeuVector systems. If you wish to run the Controller/Allinone on a different node, please contact support@neuvector.com.

Each cluster requires its own license key.

####Auto-Scaling Nodes
If you plan to deploy NeuVector onto a cluster with Auto-Scaling nodes that may exceed the licensed node count, please contact your NeuVector representative to arrange for a license that will accommodate the node scaling.

####Metered Licensing (Integrated Billing for Public Cloud services)
NeuVector supports usage based billing for some public cloud services. This requires a special license to be applied, and an external connection between the Controller and the NeuVector usage collection endpoint must be allowed. Please see the [Metered Usage](/deploying/metered) for more details.

####License Request Summary

For requests by email, please send, for each cluster:
+ Cluster name (e.g. west_production)
+ Expiration date
+ Number of nodes
+ Multi-cluster (number of remote clusters) if enabled
+ Serverless if enabled
