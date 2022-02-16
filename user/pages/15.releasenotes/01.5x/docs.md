---
title: 5.x Release Notes
taxonomy:
    category: docs
---


### Release Notes for 5.x (Open Source Version)

####Support for deployment on AWS ECS Deprecated
Support for deployment on ECS is no longer provided. The allinone should still be able to be deployed on ECS, however, the documentation of the steps and settings is no longer supported.

#### 5.0 'Tech Preview' January 2022
##### Enhancements
+ First release of an unsupported, 'tech-preview' version of NeuVector 5.0 open source version.
+ Add support for OWASP Top-10, WAF-like rules for detecting network attacks in headers or body. Includes support for CRD definitions of signatures and application to appropriate Groups.
+ Removes Serverless scanning features.

##### Bug Fixes
+ TBD

##### Other
+ Helm chart v1.8.9 is published for 5.0.0 deployments. If using this with the preview version of 5.0.0 the following changes should be made to values.yml:
  - Update the registry to docker.io
  - Update image names/tags to the preview version on Docker hub
  - Leave the imagePullSecrets empty


### Upgrading from NeuVector 4.x to 5.x

For Helm users, update to NeuVector Helm chart 1.8.9 or later.

1. Delete old neuvector-binding-customresourcedefinition clusterrole
```
kubectl delete clusterrole neuvector-binding-customresourcedefinition
```

2. Apply new update verb for neuvector-binding-customresourcedefinition clusterrole
```
kubectl create clusterrole neuvector-binding-customresourcedefinition --verb=watch,create,get,update --resource=customresourcedefinitions
```

3. Delete old crd schema for Kubernetes 1.19+
```
kubectl delete -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/crd-k8s-1.19.yaml
```

4. Create new crd schema for Kubernetes 1.19+
```
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/latest/crd-k8s-1.19.yaml
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/latest/waf-crd-k8s-1.19.yaml
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/latest/admission-crd-k8s-1.19.yaml
```

5. Create a new neuvector-binding-nvwafsecurityrules clusterrole and clusterrolebinding
```
kubectl create clusterrole neuvector-binding-nvwafsecurityrules --verb=list,delete --resource=nvwafsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvwafsecurityrules --clusterrole=neuvector-binding-nvwafsecurityrules --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-nvadmissioncontrolsecurityrules --verb=list,delete --resource=nvadmissioncontrolsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvadmissioncontrolsecurityrules --clusterrole=neuvector-binding-nvadmissioncontrolsecurityrules --serviceaccount=neuvector:default
```

6. Update image names and paths for pulling NeuVector images from Docker hub (docker.io), e.g.
+ neuvector/manager.preview:5.0.0-preview.1
+ neuvector/controller.preview:5.0.0-preview.1
+ neuvector/enforcer.preview:5.0.0-preview.1
+ neuvector/scanner.preview:latest
+neuvector/updater.preview:latest

Optionally, remove any references to the NeuVector license and secrets in Helm charts, deployment yaml, configmap, scripts etc, as these are no longer required to pull the images or to start using NeuVector.



