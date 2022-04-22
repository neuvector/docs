---
title: 5.x Release Notes
taxonomy:
    category: docs
---


### Release Notes for 5.x (Open Source Version)

#### Beta 1 version released April 2022
+ Feature complete, including Automated Promotion of Group Modes. Promotes a Group’s protection Mode based on elapsed time and criteria. Does not apply to CRD created Groups. This features allows a new application to run in Discover for some time period, learning the behavior and NeuVector creating allow-list rules for Network and Process, then automatically moving to Monitor, then Protect mode. Discover to Monitor criterion: Elapsed time for learning all network and process activity of at least one live pod in the Group. Monitor to Protect criterion: There are no security events (network, process etc) for the timeframe set for the Group.
+ Support for Rancher 2.6.5 Apps and Marketplace chart. Deploys into cattle-neuvector-system namespace and enables SSO from Rancher to NeuVector.
+ Tags for Enforcer, Manager, Controller: 5.0.0-b1 (e.g. neuvector/controller:5.0.0-b1)
+ Helm chart update appVersion to 5.0.0-b1 and chart version to 2.2.0-b1

####Preview.3 version released March 2022
***Important***: To update previous preview deployments for new CRD WAF, DLP and Admission control features, please update the CRD yaml and add new rbac/role bindings:
```
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/latest/crd-k8s-1.19.yaml
kubectl create clusterrole neuvector-binding-nvwafsecurityrules --verb=list,delete --resource=nvwafsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvwafsecurityrules --clusterrole=neuvector-binding-nvwafsecurityrules --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-nvadmissioncontrolsecurityrules --verb=list,delete --resource=nvadmissioncontrolsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvadmissioncontrolsecurityrules --clusterrole=neuvector-binding-nvadmissioncontrolsecurityrules --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-nvdlpsecurityrules --verb=list,delete --resource=nvdlpsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvdlpsecurityrules --clusterrole=neuvector-binding-nvdlpsecurityrules --serviceaccount=neuvector:default
```
#####Enhancements
+ Support scanning of SUSE Linux (SLE, SLES), and Microsoft Mariner
+ Zero-drift process and file protection. This is the new default mode for process and file protections. Zero-drift automatically allows only processes which originate from the parent process that is in the original container image, and does not allow file updates or new files to be installed. When in Discover or Monitor mode, zero-drift will alert on any suspicious process or file activity. In Protect mode, it will block such activity. Zero-drift does not require processes to be learned or added to an allow-list. Disabling zero-drift for a group will cause the process and file rules listed for the group to take effect instead.
+ Split policy mode protection for network, process/file. There is now a global setting available in Settings -> Configuration to separately set the network protection mode for enforcement of network rules. Enabling this (default is disabled), causes all network rules to be in the protection mode selected (Discover, Monitor, Protect), while process/file rules remain in the protection mode for that Group, as displayed in the Policy -> Groups screen. In this way, network rules can be set to Protect (blocking), while process/file policy can be set to Monitor, or vice versa.
+ WAF rule detection, enhanced DLP rules (header, URL, full packet)
+ CRD for WAF, DLP and admission controls. NOTE: required additional cluster role bindings/permissions. See Kubernetes and OpenShift deployment sections. CRD import/export and versioning for admission controls supported through CRD. 
+ Rancher SSO integration to launch NeuVector console through Rancher Manager. This feature is only available if the NeuVector containers are deployed through Rancher. NOTE: Requires updated Rancher release (date/version TBD).
+ Supports deployment on RKE2.
+ Support for Federation of clusters (multi-cluster manager) through a proxy.
+ Monitor required rbac's clusterrole/bindings and alert in events and UI if any are missing.
+ Support criteria of resource limitations in admission control rules.
+ Removed support for Jfrog Xray scan result integration (Artifactory registry scan is still supported).

#####Bug Fixes
+ Fix issue of worker federation role backup should restore into non-federated clusters.

####Preview.2 version released Feb 2022
+ Minor file and license changes in source, no features added.

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
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/latest/dlp-crd-k8s-1.19.yaml
```

5. Create a new DLP and WAF clusterrole and clusterrolebinding
```
kubectl create clusterrole neuvector-binding-nvwafsecurityrules --verb=list,delete --resource=nvwafsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvwafsecurityrules --clusterrole=neuvector-binding-nvwafsecurityrules --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-nvadmissioncontrolsecurityrules --verb=list,delete --resource=nvadmissioncontrolsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvadmissioncontrolsecurityrules --clusterrole=neuvector-binding-nvadmissioncontrolsecurityrules --serviceaccount=neuvector:defaultkubectl create clusterrole neuvector-binding-nvdlpsecurityrules --verb=list,delete --resource=nvdlpsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvdlpsecurityrules --clusterrole=neuvector-binding-nvdlpsecurityrules --serviceaccount=neuvector:default
```

6. Update image names and paths for pulling NeuVector images from Docker hub (docker.io), e.g.
+ neuvector/manager:5.0.0-b1
+ neuvector/controller:5.0.0-b1
+ neuvector/enforcer:5.0.0-b1
+ neuvector/scanner:latest
+neuvector/updater:latest

Optionally, remove any references to the NeuVector license and secrets in Helm charts, deployment yaml, configmap, scripts etc, as these are no longer required to pull the images or to start using NeuVector.



