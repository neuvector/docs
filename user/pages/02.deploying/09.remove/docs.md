---
title: Removing or Resetting NeuVector
taxonomy:
    category: docs
---


### Removing NeuVector Deployment / Containers

To remove the NeuVector deployment on Kubernetes, use the same yaml file for deployment in the delete command.
```
$ kubectl delete -f neuvector.yaml
```

This will remove the services and container deployments of NeuVector. You may also want to delete the neuvector namespace, regsecret, persistent volume and cluster roles and clusterrolebindings created in the deployment steps.

If you deployed NeuVector using a Helm chart or operator you should delete NeuVector using Helm or the appropriate operator command.

### Resetting NeuVector to an Initial State
In addition to deleting as discussed above and redeploying NeuVector, the following steps can be taken in Kubernetes to reset NeuVector, which will remove learned rules, groups, and other configuration but leave the NeuVector deployment intact.

1. Scale the controller deployment to 0.
2. (Optional) if a Persistent Volume is used, delete the persistent volume backup folder created.
3. Scale the controller deployment to 3.
