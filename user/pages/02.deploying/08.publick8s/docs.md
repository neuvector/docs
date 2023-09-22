---
title: Public Cloud K8s AKS, EKS, GKE, IBM...
taxonomy:
    category: docs
---


### Deploy NeuVector on a Public Cloud Kubernetes Service

Deploy NeuVector on any public cloud K8s service such as AWS EKS, Azure AKS, IBM Cloud K8s, Google Cloud, Alibaba Cloud or Oracle Cloud. 
NeuVector has passed the Amazon EKS Anywhere Conformance and Validation Framework and, as such, is a validated solution and is available as an Add-on for EKS-Anywhere on Snowball Edge devices through the AWS Console.

First, create your K8s cluster and confirm access with ‘kubectl get nodes’.

To deploy NeuVector use the sample deployment instructions and examples from the Kubernetes section of the Production Deployment. Edit the sample yaml if you are pulling NeuVector images from a local or cloud registry such as ECR or ACR.

Some cloud providers have integrated load balancers which are easy to deploy by using ‘Type: LoadBalancer’ instead of NodePort for the NeuVector webui. 

NeuVector also supports Helm-based deployment with a Helm chart at https://github.com/neuvector/neuvector-helm.

#### Network Access

Make sure internal and external ingress access is configured properly. For the NodePort service, the random port in the 3xxxx range must be accessible on a public IP of a worker or master node from the outside. You can access the console using the public IP address of any worker node and that port (NodePort), or the public IP of the load balancer and default port 8443. You can view the IP/port using:

```
kubectl get svc -n neuvector
```

Most K8s services automatically enable/allow all inter-pod / inter-cluster communication between nodes which also enable the NeuVector containers (enforcers, controllers, manager) to communicate within the cluster.

The sample Kubernetes yaml file will deploy one manager and 3 controllers. It will deploy an enforcer on every node as a daemonset. Note: It is not recommended to deploy (scale) more than one manager behind a load balancer due to potential session state issues.

### Microsoft Azure AKS
When deploying a k8s cluster on Azure, the default for Kubernetes RBACs is off. Please enable RBACs to enable the cluster-admin clusterrole, otherwise you will need to create that manually later to support Helm based deployments.

### Google Cloud Platform / GKE

You can use the integrated load balancers which are easy to deploy by using ‘Type: LoadBalancer’ instead of NodePort for the NeuVector webui. Configuring persistent storage with type RWM (read write many) may require creating a storage service such as NFS before deploying NeuVector.

NeuVector requires an SDN plug-in such as flannel, weave, or calico. 

Use the environment variable NV_PLATFORM_INFO with value platform=Kubernetes:GKE to enable NeuVector to perform GKE specific action such as running the GKE Kubernetes CIS Benchmarks.

### Handling Auto-Scaling Nodes with a Pod Disruption Budget
Public cloud providers support the ability to auto-scale nodes, which can dynamically evict pods including the NeuVector controllers. To prevent disruptions to the controllers, a NeuVector pod disruption budget can be created. 

For example, create the file below nv_pdr.yaml to ensure that there are at least 2 controllers running at any time.
```
apiVersion: policy/v1beta1
kind: PodDisruptionBudget
metadata:
  name: neuvector-controller-pdb
  namespace: neuvector
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: neuvector-controller-pod
```
Then
```
kubectl create -f nv_pdr.yaml
```

For more details: https://kubernetes.io/docs/tasks/run-application/configure-pdb/