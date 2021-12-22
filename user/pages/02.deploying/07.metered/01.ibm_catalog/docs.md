---
title: Metered Billing Through IBM Cloud Catalog
taxonomy:
    category: docs
---


### NeuVector in the IBM Cloud Catalog
The NeuVector Kubernetes Container Security Platform is integrated with IBM Cloud to provide a smooth onboarding experience to deploy and manage NeuVector for IBM Cloud customers. The integration supports automated usage-based billing to the accounts of IBM Cloud customers for their usage of the NeuVector software. It also supports automated free trials and subscription initiation, as well as authentication to pull the NeuVector containers for deployment on IBM Cloud Kubernetes (IKS) clusters.

####Getting Started
To get started, navigate to the NeuVector Container Security Platform in the IBM Global Catalog. This would be in the Services / Security section.

Review the catalog listing, including Free Trial and Standard pricing plans available to subscribers.
Select the plan to subscribe to, either to start your trial or to subscribe to NeuVector.
Once initiated, the subscription will create and present a license key for use on your NeuVector deployment. You need access to the license key as part of the deployment.
In addition, a login will be created on registry.neuvector.com to enable you to pull the NeuVector containers for deployment. You need access to the registry credentials as part of the deployment.
Note: When subscribing to the Standard pricing plan, billing will not start until you configure the license in a deployed NeuVector platform.

####Deploying the NeuVector Platform on an IBM Cloud IKS cluster
Deploy the NeuVector Platform using a trial or standard pricing plan on an existing IBM Cloud IKS cluster.

####Pre-Requisites

+ An IBM Cloud account
+ An IBM Cloud Kubernetes Service cluster (IKS)
+ Internet connection from the cluster to the external (internet) endpoint: controller.cloud.neuvector.com:443

####Deployment on IKS
After you initiate a trial or subscription through the IBM Global Catalog, you will be presented with deployment instructions as well as your license key and registry credentials. You can see a preview of the deployment steps [here](https://neuvector.com/ibm-docs/) as well.

####Deployment on Red Hat OpenShift
To deploy NeuVector on an OpenShift cluster, please see the deployment sections for Red Hat [OpenShift](/deploying/openshift), or use the NeuVector Helm chart with OpenShift settings, or deploy with an [Operator](/deploying/production/operators). The registry credentials and license key generated from your IBM Cloud subscription in the catalog can be applied to your OpenShift cluster.