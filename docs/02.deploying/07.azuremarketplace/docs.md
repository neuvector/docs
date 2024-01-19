---
title: Azure Marketplace Billing
taxonomy:
    category: docs
---

### Deploy NeuVector from Azure Marketplace Pay-As-You-Go Listing

NeuVector Prime supports monthly billing through your Azure account in a Pay-As-You-Go (PAYG) billing subscription for SUSE support of NeuVector.

Usage is billed monthly based on the average number of nodes protected by NeuVector during the month. Please see the Azure Marketplace listing for your appropriate region for specific pricing tiers and other information.

- [NeuVector Prime with 24x7 Support (non-EU and non-UK only)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/suse.neuvector-prime-llc?tab=Overview)
- [NeuVector Prime with 24x7 Support (EU and UK only)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/suseirelandltd1692213356027.neuvector-prime-ltd?tab=Overview)

Additional Usage Instructions can be found [here](https://suse-enceladus.github.io/marketplace-docs/neuvector-prime/azure/).

NOTE: Azure Private Offers are available for NeuVector for special pricing situations in lieu of standard PAYG pricing.

### Supported Configurations
The marketplace PAYG listing supports deployment on supported target environments only. As of the July release, only AKS is supported for the billing adapter (see below options for other environments such as Rancher, Kubernetes, OpenShift etc). Each cluster can report its usage (nodes) independently, or an aggregated node count for a multi-cluster deployment can be reported. An aggregated, multi-cluster deployment can take advantage of the volume discount tiers offered by pooling all nodes across clusters into a single usage billing calculation.

NOTE: All clusters in PAYG billing (single, primary, remotes) must be running NeuVector version 5.2.2 or later.

#### Single Cluster Usage Billing
Each cluster onto which you have deployed the PAYG billing adapter through the marketplace will report usage information for your Azure account.

#### Multi-cluster Usage Billing
To be able to aggregate the node counts from multiple clusters in order to take advantage of volume discounts, the clusters must have been configured for Multi-cluster federation as described in the NeuVector [docs](https://open-docs.neuvector.com/navigation/multicluster). NeuVector on the Primary cluster MUST have been deployed through the Azure Marketplace, with the billing adapter installed in the primary cluster, in order to be able to report the primary and all downstream remote cluster node counts. Do not deploy NeuVector through the marketplace on downstream remote clusters. Use standard deployment methods (Helm, Operator, kubectl etc) described in the NeuVector [docs](https://open-docs.neuvector.com/deploying) on remote clusters.

#### Enabling PAYG NeuVector Prime Billing for Existing NeuVector Clusters

There are several options to enable NeuVector Prime billing on existing NeuVector clusters. 
- Option 1: The existing cluster must be on a supported PAYG platform. Backup the NeuVector configuration of the existing cluster, remove the NeuVector deployment, then deploy NeuVector through the Azure marketplace. After successful deployment, import the backup configuration. Note: It is recommended that the existing cluster be running version NeuVector 5.2.2 or later before the backup and removal. 
- Option 2: Add the existing cluster as a federated remote cluster to a (existing or newly deployed) primary cluster which already has PAYG billing deployed on it. In this case, the existing cluster can be on any platform supported by NeuVector.

#### Enabling PAYG NeuVector Prime Billing for Rancher, OpenShift, Tanzu, or other NeuVector supported clusters

Although PAYG billing deployment is supported on a limited set of Azure platforms (only AKS at initial November 2023 release), billing for other supported NeuVector platforms can be accomplished using the multi-cluster federation configuration. As long as the primary cluster has the PAYG billing deployment of NeuVector, downstream clusters can be any supported NeuVector clusters such as Rancher, Kubernetes, OpenShift, or Tanzu. Downstream clusters can even be on-premise, or on other clouds as long as the remote cluster can be federated to the primary (with appropriate network access).

For Rancher managed downstream clusters with SSO to NeuVector, these clusters can be federated to a non-Rancher primary cluster which is deployed through the Azure marketplace in order to benefit from consolidated multi-cluster billing.


### Deploying NeuVector Prime through the Azure Marketplace

A special billing interface is required to enable PAYG to your Azure account. This must be deployed, together with NeuVector from the Azure Marketplace listing for NeuVector. To deploy the billing adapter and NeuVector see the [Usage instructions](https://suse-enceladus.github.io/marketplace-docs/neuvector-prime/azure/).

#### Setting the Admin Password
It is required to set the admin password in the Azure create offer, "NeuVector Configuration" section. See the Usage instructions on the Azure marketplace listing for NeuVector for instructions.

#### Console Login through Load Balancer
If the manager service type was set to Load Balancer during install, an external IP (URL) has been assigned for logging into the NeuVector console. Typically, this URL is accessible from the internet, but your organization may have placed additional restrictions on external access to your cluster. To see the load balancer, type:
```
kubectl get svc -n neuvector neuvector-service-webui
```
To get the full login url, type:
```
SERVICE_IP=$(kubectl get svc --namespace neuvector neuvector-service-webui -o jsonpath="{.status.loadBalancer.ingress[0].ip}")
echo https://$SERVICE_IP:8443
```
And you will see something like:
```
https://<$SERVICE_IP>:8443
```
This is how you can access the NeuVector console from your browser on the default port 8443.

Once logged in, you can begin to [navigate and configure NeuVector](https://open-docs.neuvector.com/navigation/navigation).

### Obtaining Support
Once PAYG billing is enabled for a cluster or multiple clusters, customers are eligible for support through the [SUSE Support Center](https://scc.suse.com/) (SCC) service. This is a web-based service for creating, viewing, and managing support requests. The actual link for submitting your support bundle as described below can be found [here](https://scc.suse.com/cloudsupport).

The SCC portal will require you to upload a Support Configuration bundle in order to verify your eligibility as well as provide cluster information required to start investigations. To download the support config, please go to Settings -> Configuration at the bottom of the page for the cluster in question. For multi-cluster configurations, only the Primary cluster's support config is required, even if the support inquiry is for a downstream remote cluster. If you do not have access to the Primary cluster, the remote cluster's support config is acceptable.

### Upgrading a NeuVector PAYG Cluster
The Azure NeuVector Prime offer consists of several different containers. As newer versions of these containers are released, updated application bundles will be published to the Azure Marketplace. To upgrade to the most recent version that is specified in the marketplace listing, see the [Usage instructions](https://suse-enceladus.github.io/marketplace-docs/neuvector-prime/azure/).
