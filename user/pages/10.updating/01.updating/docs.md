---
title: Updating NeuVector
taxonomy:
    category: docs
---

### Updating NeuVector Components

It’s super easy to update your NeuVector containers. If there is a new release available, pull it from Docker Hub. It is recommended to use a ‘rolling update’ strategy to keep at least one Allinone or Controller container running at any time during an update. 

**IMPORTANT**

Host OS updates, reboots, and orchestrator updates can cause pods to be evicted or stopped. If a Controller is affected, and there are no other Controllers active to maintain the state, the Controllers can become available for some time while new controllers are started, a cluster is formed with a leader, and the persistent storage backup of the configuration is attempted to be accessed to restore the cluster. Be careful when scheduling host or orchestrator updates and reboots which may affect the number of controllers available at any time. See the Pod Disruption Budget below for possible ways to mitigate this.

If deployment was done using the NeuVector Helm charts, updating will take care of additional services, rolebindings or other upgrade requirements.

If updates are done manually or there is only one Allinone or Controller running, please note that current network connection data is NOT stored and will be lost when the NeuVector container is stopped.

NeuVector supports persistent data for the NeuVector policy and configuration. This configures a real-time backup to mount a volume at /var/neuvector/. The primary use case is when the persistent volume is mounted, the configuration and policy are stored during run-time to the persistent volume. In the case of total failure of the cluster, the configuration is automatically restored when the new cluster is created. Configuration and policy can also be manually restored or removed from the /var/neuvector/ volume.

**IMPORTANT** 

If a persistent volume is not mounted, NeuVector does NOT store the configuration or policy as persistent data. Be sure to backup the Controller configuration and policy before stopping the allinone or controller container. This can be done in Settings -> Configuration. Alternatively, the controller can be deployed in an HA configuration with 3 or 5 controllers running, in which case the policy will persist with other controllers while one is being updated.

To manually update NeuVector using docker-compose:

```
$sudo docker-compose -f <filename> down
```
Note that if no filename is specified then the docker-compose.yml file is used.

Make sure the docker-compose.yml or other appropriate file is edited with the desired image version, if necessary, then:
```
$sudo docker-compose -f <filename> up -d
```

Note: We recommend that all NeuVector components be updated to the most recent version at the same time. Backward compatibility is supported for at least one minor version back. Although most older versions will be backward compatible, there may be exceptions which cause unexpected behavior.

### Rolling Updates

Orchestration tools such as Kubernetes, RedHat OpenShift, and Rancher support rolling updates with configurable policies. You can use this feature to update the NeuVector containers. The most important will be to ensure that there is at least one Allinone/Controller running so that policies, logs, and connection data is not lost. Make sure that there is a minimum of 30 seconds between container updates so that a new leader can be elected and the data synchronized between controllers.

#### Sample Kubernetes Rolling Update 

If your Deployment or Daemonset is already running, you can change the yaml file to the new version, then apply the update:
```
kubectl apply -f <yaml file>
```

To update to a new version of NeuVector from the command line.

```
kubectl set image deployment/neuvector-controller-pod neuvector-controller-pod=neuvector/controller:4.2.2 -n neuvector
kubectl set image deployment/neuvector-manager-pod neuvector-manager-pod=neuvector/manager:4.2.2 -n neuvector
kubectl set image DaemonSet/neuvector-enforcer-pod neuvector-enforcer-pod=neuvector/enforcer:4.2.2 -n neuvector
```

To check the status of the rolling update:
```
kubectl rollout status -n neuvector ds/neuvector-enforcer pod
kubectl rollout status -n neuvector deployment/neuvector-controller-pod  // same for manager, scanner etc
```

To rollback the update:
```
kubectl rollout undo -n neuvector ds/neuvector-enforcer-pod
kubectl rollout undo -n neuvector deployment/neuvector-controller-pod   // same for manager, scanner etc
```

### Updating the Vulnerability CVE Database
The NeuVector Scanner image is regularly updated on neuvector with new CVE database updates, using the 'latest' tag.

The default NeuVector deployment includes deployment of scanner pods as well as an Updater cron job to update the scanners every day.

Please see the section [Updating the CVE Database](/scanning/updating) for more details.

The CVE database version can be seen in the Console in the Vulnerabilities tab. You can also inspect the Updater container image. The latest database version number can also be found listed [here](https://raw.githubusercontent.com/neuvector/manifests/main/versions/scanner).

```
docker inspect neuvector/updater
```

```
"Labels": {
                "neuvector.image": "neuvector/updater",
                "neuvector.role": "updater",
                "neuvector.vuln_db": "1.255"
            }
```

You can also inspect the controller/allinone logs for 'version.' For example in Kubernetes:
```
kubectl logs neuvector-controller-pod-777fdc5668-4jkjn -n neuvector | grep version
```

```
2019-07-29T17:04:02.43 |DEBU|SCN|main.dbUpdate: New DB found - create=2019-07-24T11:59:13Z version=1.576
2019-07-29T17:04:02.454|DEBU|SCN|memdb.ReadCveDb: New DB found - update=2019-07-24T11:59:13Z version=1.576
2019-07-29T17:04:12.224|DEBU|SCN|main.scannerRegister: - version=1.576
```

### Pod Disruption Budget

A Kubernetes feature allows for ensuring that a minimum number of controllers are running at any time. This is useful for node draining or other maintenance activities that could remove controller pods. For example, create and apply the file below nv_pdb.yaml to ensure that there are at least 2 controllers running at any time.

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

### Upgrading from NeuVector 4.x to 5.x

For Helm users, update to NeuVector Helm chart 2.0.0 or later. If updating an Operator or Helm install on OpenShift, see note below.

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
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/crd-k8s-1.19.yaml
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/waf-crd-k8s-1.19.yaml
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/dlp-crd-k8s-1.19.yaml
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/admission-crd-k8s-1.19.yaml
```

5. Create a new DLP, WAP, Admission clusterrole and clusterrolebinding
```
kubectl create clusterrole neuvector-binding-nvwafsecurityrules --verb=list,delete --resource=nvwafsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvwafsecurityrules --clusterrole=neuvector-binding-nvwafsecurityrules --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-nvadmissioncontrolsecurityrules --verb=list,delete --resource=nvadmissioncontrolsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvadmissioncontrolsecurityrules --clusterrole=neuvector-binding-nvadmissioncontrolsecurityrules --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-nvdlpsecurityrules --verb=list,delete --resource=nvdlpsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvdlpsecurityrules --clusterrole=neuvector-binding-nvdlpsecurityrules --serviceaccount=neuvector:default
```

6. Update image names and paths for pulling NeuVector images from Docker hub (docker.io).
The images are on the NeuVector Docker Hub registry. Use the appropriate version tag for the manager, controller, enforcer, and leave the version as 'latest' for scanner and updater. For example:
+ neuvector/manager:5.0.0
+ neuvector/controller:5.0.0
+ neuvector/enforcer:5.0.0
+ neuvector/scanner:latest
+ neuvector/updater:latest

Optionally, remove any references to the NeuVector license and secrets in Helm charts, deployment yaml, configmap, scripts etc, as these are no longer required to pull the images or to start using NeuVector.

**Note about SCC and Upgrading via Operator/Helm**

Privileged SCC is added to the Service Account specified in the deployment yaml by Operator version 1.3.4 and above in new deployments. In the case of upgrading the NeuVector Operator from a previous version to 1.3.4 or Helm to 2.0.0, please delete Privileged SCC before upgrading.
```
oc delete rolebinding -n neuvector system:openshift:scc:privileged
```