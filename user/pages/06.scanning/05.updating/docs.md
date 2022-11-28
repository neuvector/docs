---
title: Updating the CVE Database
taxonomy:
    category: docs
---

### Updating the NeuVector CVE Vulnerability Database
The Scanner image/pod performs the scans with its internal CVE database. The scanner image is updated on the NeuVector Docker Hub registry with the latest CVE database frequently, as often as daily if there are updates. To update the CVE database used in scanning, simply pull and deploy the latest Scanner image. The latest database version number can be found listed [here](https://raw.githubusercontent.com/neuvector/manifests/main/versions/scanner).

A container called the Updater performs the task of restarting the scanner pods in order to force a pull of the latest image, which will update the CVE database. To automatically check for updates and update the scanner, an updater cron job can be created.

By default, the updater cron job shown below is automatically started from the sample deployment yaml files for Kubernetes and OpenShift. This will automatically check for new CVE database updates through new scanner versions published on the NeuVector Docker hub registry. Manual updates on docker native deployments are shown below. For OpenShift deployments or others where images have to be manually pulled from NeuVector, the scanner with the 'latest' tag should be pulled from NeuVector to update the CVE database.

For registry scanning, if the box 'Rescan after CVE DB update' is enabled, all images in that registry will be rescanned after a CVE database update.  For run-time scanning, all running assets will be rescanned after a CVE database update if the Auto-Scan feature is enabled.

#### Updater Cron Job

This cron job is deployed by NeuVector automatically as part of the sample deployment, so is typically not required to start manually.

The Updater is a container image which, when run, restarts the scanner deployment, forcing the pull of the latest Scanner image. The updater re-deploys all scanner pods by taking the deployment to zero and scaling it back up.


The cron job sample neuvector-updater.yaml below for Kubernetes 1.8 and later runs the updater every day at midnight. The schedule can be adjusted as desired.

Sample updater yaml:

```
apiVersion: batch/v1
kind: CronJob
metadata:
  name: neuvector-updater-pod
  namespace: neuvector
spec:
  schedule: "0 0 * * *"
  jobTemplate:
    spec:
      template:
        metadata:
          labels:
            app: neuvector-updater-pod
        spec:
          containers:
          - name: neuvector-updater-pod
            image: neuvector/updater
            imagePullPolicy: Always
            command:
            - /bin/sh
            - -c
            - TOKEN=`cat /var/run/secrets/kubernetes.io/serviceaccount/token`; /usr/bin/curl -kv -X PATCH -H "Authorization:Bearer $TOKEN" -H "Content-Type:application/strategic-merge-patch+json" -d '{"spec":{"template":{"metadata":{"annotations":{"kubectl.kubernetes.io/restartedAt":"'`date +%Y-%m-%dT%H:%M:%S%z`'"}}}}}' 'https://kubernetes.default/apis/apps/v1/namespaces/neuvector/deployments/neuvector-scanner-pod'
            env:
              - name: CLUSTER_JOIN_ADDR
                value: neuvector-svc-controller.neuvector
          restartPolicy: Never
```

Note: If the allinone container was deployed instead of the controller, replace neuvector-svc-controller.neuvector with neuvector-svc-allinone.neuvector

To run the cron job
```
kubectl create -f neuvector-updater.yaml 
```


###Docker Native Updates
<strong>Important:</strong> Always use the :latest tag when pulling and running the scanner image to ensure the latest CVE database is deployed.

For docker native:

```
docker stop scanner
docker rm <scanner id>
docker pull neuvector/scanner:latest
<docker run command from below>
```

Note: 'docker rm -f <scanner id>' can also be used to force stop and removal of the running scanner.

For docker-compose

```
docker-compose -f file.yaml down
docker-compose -f file.yaml pull		// pre-pull the image before starting the scanner
docker-compose -f file.yaml up -d
```

Sample docker run
```
docker run -td --name scanner -e CLUSTER_JOIN_ADDR=controller_node_ip -e CLUSTER_ADVERTISED_ADDR=node_ip -e SCANNER_DOCKER_URL=tcp://192.168.1.10:2376 -p 18402:18402 -v /var/run/docker.sock:/var/run/docker.sock:ro neuvector/scanner:latest
```
And sample docker-compose
```
Scanner:
   image: neuvector/scanner:latest
   container_name: scanner
   environment:
     - SCANNER_DOCKER_URL=tcp://192.168.1.10:2376
     - CLUSTER_JOIN_ADDR=controller_node_ip
     - CLUSTER_ADVERTISED_ADDR=node_ip
   ports:
     - 18402:18402
   volumes:
     - /var/run/docker.sock:/var/run/docker.sock:ro
```


###CVE Database Version

The CVE database version can be seen in the Console in the Vulnerabilities tab. You can also inspect the scanner container logs or updater image.

To use the REST API to query the version:
```
curl -k -H "Content-Type: application/json" -H "X-Auth-Token: $_TOKEN_" "https://127.0.0.1:10443/v1/scan/scanner"
```

Output:
```
{
	"scanners": [
		{
			"cvedb_create_time": "2020-07-07T10:34:04Z",
			"cvedb_version": "1.950",
			"id": "0f043705948557828ac1831ee596588a0d050950113117ddd19ecd604982f4d9",
			"port": 18402,
			"server": "127.0.0.1"
		},
		{
			"cvedb_create_time": "2020-07-07T10:34:04Z",
			"cvedb_version": "1.950",
			"id": "9fa02c644d603f59331c95735158d137002d32a75ed1014326f5039f38d4d717",
			"port": 18402,
			"server": "192.168.9.95"
		}
	]
}
```

Using kubectl:

```
kubectl logs neuvector-scanner-pod-5687dcb6fd-2h4sj -n neuvector | grep version
```

Sample output:

```
2020-09-15T00:00:57.909|DEBU|SCN|memdb.ReadCveDb: New DB found - update=2020-09-14T10:37:56Z version=2.04
2020-09-15T00:01:10.06 |DEBU|SCN|main.scannerRegister: - entries=47016 join=neuvector-svc-controller.neuvector:18400 version=2.040
```

Or for docker:

```
docker logs <scanner container id or name> | grep version
```

```
2020-09-15T00:00:57.909|DEBU|SCN|memdb.ReadCveDb: New DB found - update=2020-09-14T10:37:56Z version=2.04
2020-09-15T00:01:10.06 |DEBU|SCN|main.scannerRegister: - entries=47016 join=neuvector-svc-controller.neuvector:18400 version=2.040
```

###Manual Updates on Kubernetes
Below is an example for manually updating the CVE database on Kubernetes or OpenShift.

Run the updater file below
```
kubectl create -f neuvector-manual-updater.yaml
```

Sample file

```
apiVersion: v1
kind: Pod
metadata:
  name: neuvector-updater-pod
  namespace: neuvector
spec:
  containers:
  - name: neuvector-updater-pod
    image: neuvector/updater
    imagePullPolicy: Always
    command:
    - /bin/sh
    - -c
    - TOKEN=`cat /var/run/secrets/kubernetes.io/serviceaccount/token`; /usr/bin/curl -kv -X PATCH -H "Authorization:Bearer $TOKEN" -H "Content-Type:application/strategic-merge-patch+json" -d '{"spec":{"template":{"metadata":{"annotations":{"kubectl.kubernetes.io/restartedAt":"'`date +%Y-%m-%dT%H:%M:%S%z`'"}}}}}' 'https://kubernetes.default/apis/apps/v1/namespaces/neuvector/deployments/neuvector-scanner-pod'
    env:
      - name: CLUSTER_JOIN_ADDR
        value: neuvector-svc-controller.neuvector
  restartPolicy: Never
```

