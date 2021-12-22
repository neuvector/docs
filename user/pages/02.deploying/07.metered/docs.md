---
title: Special Metered Usage Deployments
taxonomy:
    category: docs
---


### Deploying NeuVector for Integrated, Usage Based Billing
NeuVector supports deployment to a limited number of cloud providers where customers can be billed based on actual NeuVector usage to their cloud provider account.

For these special deployments, everything is the same for deploying the NeuVector containers, except for the license key. Applying a metered usage license key will instruct the NeuVector Controller to contact the NeuVector Usage Server at controller.cloud.neuvector.com:443. The controller and the server will verify the license and begin reporting usage on an hourly basis. Please make sure the controller has access to the internet through any firewalls or network security groups/rules.

Usage reported to the servers includes objects such as # of nodes (enforcers), vCPU cores/node, and multi-cluster usage.

#### Requirements
+ A special metered license obtained from the cloud provider or NeuVector.
+ Registry access credentials to registry.neuvector.com provided by the cloud provider or NeuVector.
+ Controller external access through firewalls to controller.cloud.neuvector.com:443.

#### Managing Usage Reporting
The subscription to the NeuVector service is controlled by your cloud provider. To terminate the NeuVector license and stop billing, please follow the instructions for ending the subscription for your cloud provider.

If the connection from the NeuVector controller is temporarily lost, NeuVector will report the last known usage activity to the cloud provider. If the controller can't reach the usage server for an extended period of times (a few days), a warning will appear in the NeuVector console. The NeuVector product will cease enforcing security rules and reporting events if the controller is not able to reach the usage server for over 7 days.
