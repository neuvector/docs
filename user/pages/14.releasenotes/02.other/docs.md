---
title: Integrations & Other Components
taxonomy:
    category: docs
---

### Release Notes for Integration Modules, Plug-Ins, Other Components

####Github Actions
+ Github actions for vulnerability scanning now published at https://github.com/neuvector/neuvector-image-scan-action.

####Helm Chart 1.8.9
+ Helm chart v1.8.9 is published for 5.0.0 deployments. If using this with the preview version of 5.0.0 the following changes should be made to values.yml:
  - Update the registry to docker.io
  - Update image names/tags to the preview version on Docker hub
  - Leave the imagePullSecrets empty

####Splunk App Published
+ New Splunk app for NeuVector is published at https://splunkbase.splunk.com/app/6205/

#### Helm Chart Update 1.8.7
+ Support affinity and toleration customization for controller, scanner and manager.
+ Add nodeSelector support for Controller, Manager, Scanner, updater pods.
+ Support user-defined environment variables for controller container.

#### Community Operator v1.2.7 for Helm Chart 1.8.2
+ Allow users to specify NeuVector release version
+ Deploys latest scanner CVE db version
+ Container operator image location moved to registry.neuvector.com/public
+ NeuVector instance name defaults to neuvector (before it was example-neuvector)
+ Updated readme document on install page and added link to release notes

#### Helm Chart 1.8.2
+ Add controller ingress and route host options.

#### Certified Operator v1.2.8 for NeuVector v4.3.1
+ Supports helm chart version 1.8.2
+ Deploys NeuVector version 4.3.1
+ Deploys scanner db version 2.360
+ other changes from previous 1.2.7 version
  - neuvector instance name defaults to neuvector, before it was example-neuvector
  - updated readme document on install page
  - corrected NeuVector logo display issue
+ Known issues
  - upgrading from 1.2.7 to 1.2.8 does not upgrade scanner db
    work around: update scanner image to registry.connect.redhat.com/neuvector/scanner@sha256:a802c012eee80444d9deea8c4402a1d977cf57d7b2b2044f90c9acc0e7ca3e06 on scanner deployment
  - readme document on install page not aligned properly
  - scanner db is not updated by updater
image.png 

#### Helm Chart update 1.8.0 July 2021
+Helm Chart  v1.8.0 is updated to default to registry.neuvector.com as the default registry. NOTE: Must specify the version tag manually.
+ Add configurable parameters such as Controller API annotations in Helm chart. Available from version 1.7.6+.
+ Community Operator 1.2.6, Certified Operator 1.2.7 updated to reflect Helm chart updates including adding OpenShift route when controller.apisvc.type is enabled.

#### Other Integrations July 2021
+ Add HTML output format for scan results in Jenkins pipeline scanning results.
+ Add namespace of impacted workload in Prometheus exporter alerts. Now supported in neuvector/prometheus-exporter:4.2.2 and later.

#### Helm Chart update 1.7.5 May 2021
+ Support changes required for new image registry registry.neuvector.com.  Change to this will result in image paths (ie remove neuvector from path from neuvector/controller to controller).

#### Helm Chart update 1.7.2 April 2021
+ Add support for separate component resources requests and limits, e.g. Controller, Enforcer cpu, memory requests.

#### Jenkins Plug-In Update v1.13 April 2021
+ Fix the scan error that exists when multiple scanners are running at the same time.
+ Show the Red Hat vulnerability rating in the scan result for Red Hat based images.

#### Operator Updates April 2021
+ OpenShift operator/helm to be able to replace self-signed certificates. Helm Chart is 1.7.1. Community Operator is 1.2.4, and Certified Operator is 1.2.3.

#### Jenkins Plug-In v1.12 March 2021
+ Overwrite vulnerability severity by score. Be able to edit what vulnerability (CVE) score range is used for High and Medium classifications. This enables customizing what score can be used to fail builds in the pipeline.
+ Add error messages to the JAVA exceptions hudson.AbortException. Enable better error message reporting from NeuVector when an error occurs.

#### Update Helm Chart to 1.7.1 March 2021
+ Add manager service loadbalancer ip and annotations.
+ Add setting to set pvc capacity.
+ Add runtime socket settings for k3s and AWS bottlerocket.
+ Add settings to replace controller and manager certificates.

#### Scanner February 2021
+ Fix CVE-2020-1938 not discovered during scan in scanner versions 1.191 and earlier. Update to latest scanner version after 1.191.

#### Jenkins Plug-In v1.11 February 2021

##### Enhancements
+ Add support for deploying the stand alone NeuVector scanner. This does not require a controller and must be deployed on the same host as the Jenkins installation. Docker must also be installed on the host. Currently, only the Linux version of Jenkins is supported (not container version). Also, add *jenkins* user to the *docker* group.

```
sudo usermod -aG docker jenkins
```

References:
https://plugins.jenkins.io/neuvector-vulnerability-scanner/
https://github.com/jenkinsci/neuvector-vulnerability-scanner-plugin/releases/tag/neuvector-vulnerability-scanner-1.11

#### Rancher Catalog Updates January 2021
+ Update NeuVector in Rancher catalog to support 4.x 

#### Helm Chart Updates January 2021
+ Create required NeuVector CRDs upon deployment
+ Fix error when setting controller ingress to true

#### Operator Updates January 2021
+ Update Operators (community, certified) to support 4.x

#### Helm Chart Changes December 2020
+ Allow user to customize PriorityClass of the manager/controller/enforcer/scanner deployment. We suggest to give NeuVector containers higher priority to make sure the security policies get enforced when the node resource is under pressure or during a cluster upgrade process.

#### Important Helm Chart Update November 2020
***Important: Changes to Helm Chart Structure***

+ The directory for the NeuVector chart has changed from ./neuvector-helm/ to ./neuvector-helm/charts/core/

If using Helm to upgrade, please update the location to the path above.

