---
title: Example: Public Cloud K8s EKS, EKS Anywhere, AKS, GKE, IBM ...
taxonomy:
    category: docs
---


### Deploy NeuVector on a Public Cloud Kubernetes Service

Deploy NeuVector on any public cloud K8s service such as Amazon EKS, EKS Anywhere, EKS Anywhere Bare Metal, Azure AKS, IBM Cloud K8s, Google Cloud, Alibaba Cloud or Oracle Cloud. 

First, create your K8s cluster and confirm access with ‘kubectl get nodes’.

To deploy NeuVector use the sample deployment instructions and examples from the Kubernetes section of either the Deployment Examples or Production Deployment sections. Edit the sample yaml if you are pulling NeuVector images from a local or cloud registry such as ECR or ACR.

Some cloud providers have integrated load balancers which are easy to deploy by using ‘Type: LoadBalancer’ instead of NodePort for the NeuVector webui. 

NeuVector also supports Helm-based deployment with a Helm chart at https://github.com/neuvector/neuvector-helm.

#### Network Access

Make sure internal and external ingress access is configured properly. For the NodePort service, the random port in the 3xxxx range must be accessible on a public IP of a worker or master node from the outside. You can access the console using the public IP address of any allinone node and that port (NodePort), or the public IP of the load balancer and default port 8443. You can view the IP/port using:

```
kubectl get svc -n neuvector
```

Most K8s services automatically enable/allow all inter-pod / inter-cluster communication between nodes which also enable the NeuVector containers (enforcers, controllers, manager) to communicate within the cluster.

### Google Cloud Platform (GKE), as well as Amazon Elastic Kubernetes Service (EKS), EKS Anywhere, and EKS Anywhere Bare Metal

Deploying on GCP or EKS is simple and identical to the instructions in the Kubernetes section before. Please follow the instructions for creating the namespace and labeling the neuvector nodes for deployment.

### Microsoft Azure AKS
When deploying a k8s cluster on Azure, the default for Kubernetes RBACs is off. Please enable RBACs to enable the cluster-admin clusterrole, otherwise you will need to create that manually later to support Helm based deployments.
