---
title: Updating the CVE Database
taxonomy:
    category: docs
---

### Updating the NeuVector CVE Vulnerability Database
A container called the Updater is published and regularly updated on NeuVector’s Docker Hub. This image can be pulled, and when run it will update the CVE database used to scan for vulnerabilities. To automatically check for updates and run the updater a cron job can be created.

For registry scanning, if the box 'Rescan after CVE DB update' is enabled, all images in that registry will be rescanned after a CVE database update.  For run-time scanning, all running assets will be rescanned after a CVE database update if the Auto-Scan feature is enabled.

#### Updater Cron Job

Note: See below for the updater cron job when running multiple parallel scanners.

The cron job updater will pull the latest updater image (if configured appropriately), run the updater container which will update the NeuVector CVE database, then stop the container. You may need to pull the latest updater image from the NeuVector docker hub into your private registry to have the newest update available to run.

The cron job sample neuvector-updater.yaml below for Kubernetes 1.8 and later runs the updater every day at midnight. The schedule can be adjusted as desired.

```
apiVersion: batch/v1beta1
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
          imagePullSecrets:
          - name: regsecret
          containers:
          - name: neuvector-updater-pod
            image: neuvector/updater
            env:
              - name: CLUSTER_JOIN_ADDR
                value: neuvector-svc-controller.neuvector
          restartPolicy: Never
```

Notes:
1) See instructions below for Kubernetes 1.7 and earlier
2) If the allinone container was deployed instead of the controller, replace neuvector-svc-controller.neuvector with neuvector-svc-allinone.neuvector

To run the cron job
```
kubectl create -f neuvector-updater.yaml 
```

The CVE database version can be seen in the Console in the Vulnerabilities tab. You can also inspect the Updater container image.

```
docker image inspect neuvector/updater
```

```
"Labels": {
                "neuvector.image": "neuvector/updater",
                "neuvector.role": "updater",
                "neuvector.vuln_db": "1.255"
            }
```

###Manual Updates
Below is an example for manually updating the CVE database.

Run the updater file below
```
kubectl create -f neuvector-manual-updater.yaml
```

Sample file (pulls from Docker Hub using secret regsecret, modify as needed for your registry).
```
apiVersion: batch/v1
kind: Job
metadata:
  name: neuvector-m-updater-pod
  namespace: neuvector
spec:
  template:
    metadata:
      labels:
        app: neuvector-m-updater-pod
    spec:
      imagePullSecrets:
        - name: regsecret
      containers:
        - name: neuvector-m-updater-pod
          image: docker.io/neuvector/updater
          env:
            - name: CLUSTER_JOIN_ADDR
              value: neuvector-svc-controller.neuvector
      restartPolicy: Never
  backoffLimit: 3
```

####Updater Cron Job for Multiple Parallel Scanners
```
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: neuvector-updater-pod
  namespace: neuvector
spec:
  schedule: "0 0  * * *"
  jobTemplate:
    spec:
      template:
        metadata:
          labels:
            app: neuvector-updater-pod
        spec:
          imagePullSecrets:
          - name: regsecret
          containers:
          - name: neuvector-updater-pod
            image: neuvector/updater
            imagePullPolicy: Always
            lifecycle:
              postStart:
                exec:
                  command:
                  - /bin/sh
                  - -c
                  - TOKEN=`cat /var/run/secrets/kubernetes.io/serviceaccount/token`; /usr/bin/curl -kv -X PATCH -H "Authorization:Bearer $TOKEN" -H "Content-Type:application/strategic-merge-patch+json" -d '{"spec":{"template":{"metadata":{"annotations":{"kubectl.kubernetes.io/restartedAt":"'`date +%Y-%m-%dT%H:%M:%S%z`'"}}}}}' 'https://kubernetes.default/apis/apps/v1/namespaces/neuvector/deployments/neuvector-scanner-pod'
            env:
              - name: CLUSTER_JOIN_ADDR
                value: neuvector-svc-controller.neuvector
          restartPolicy: Never
```

###Docker Native Updates
Here is a sample docker-run command for updating the CVE-database.
```
docker run -d --name neuvector-updater  \
    -e CLUSTER_JOIN_ADDR=[allinone/controller host IP] \
   neuvector-updater
```
