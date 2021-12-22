---
title: Updating NeuVector
taxonomy:
    category: docs
---

### Updating Components

It’s super easy to update your NeuVector containers. If there is a new release available, pull it from your repository or Docker Hub. It is recommended to use a ‘rolling update’ strategy to keep at least one Allinone or Controller container running at any time during an update. 

If deployment was done using the NeuVector Helm charts, updating will take care of additional services, rolebindings or other upgrade requirements.

If updates are done manually or there is only one Allinone or Controller running, please note that current network connection data is NOT stored and will be lost when the NeuVector container is stopped.

NeuVector supports persistent data for the NeuVector policy and configuration. This configures a real-time backup to mount a volume at /var/neuvector/. The primary use case is when the persistent volume is mounted, the configuration and policy are stored during run-time to the persistent volume. In the case of total failure of the cluster, the configuration is automatically restored when the new cluster is created. Configuration and policy can also be manually restored or removed from the /var/neuvector/ volume.

<strong>IMPORTANT</strong> If a persistent volume is not mounted, NeuVector does NOT store the configuration or policy as persistent data. Be sure to backup the Controller configuration and policy before stopping the allinone or controller container. This can be done in Settings -> Configuration. Alternatively, the controller can be deployed in an HA configuration with 3 or 5 controllers running, in which case the policy will persist with other controllers while one is being updated.

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

For controller as Deployment:
```
kubectl set image deployment/neuvector-controller-pod neuvector-controller-pod=neuvector/controller:1.3.0 -n neuvector
```
For any container as a DaemonSet:
```
kubectl set image -n neuvector ds/neuvector-allinone-pod neuvector-allinone-pod=neuvector/allinone:1.3.0
```

To check the status of the rolling update:
```
kubectl rollout status -n neuvector ds/neuvector-enforcer pod   // this is only supported in version 1.6+
kubectl rollout status -n neuvector deployment/neuvector-controller-pod
```

To rollback the update:
```
kubectl rollout undo -n neuvector ds/neuvector-enforcer-pod     // this is only supported in version 1.6+
kubectl rollout undo -n neuvector deployment/neuvector-controller-pod
```

### Updating the Vulnerability CVE Database
Updating the Allinone or Controller will automatically update the CVE database to the date that image was published.

NeuVector regularly publishes updates to the CVE database used for vulnerability scanning, and provides these in a separate Updater container image.

Please see the section Deploying in Production for instructions on how to regularly update the CVE database while in production, without updating or taking down the Controller/Allinone itself.

The CVE database version can be seen in the Console in the Vulnerabilities tab. You can also inspect the Updater container image.

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

