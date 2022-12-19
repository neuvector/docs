---
title: Parallel & Standalone Scanners
taxonomy:
    category: docs
---

### Increase Scanner Scalability with Multiple Scanners
To increase scanner performance and scalability, NeuVector supports deploying multiple scanner pods which can, in parallel, scan images in registries. The controller assigns scanning tasks to each available scanner pod. Scanner pods can be scaled up or down easily as needed using Kubernetes.

Scanner pods should be deployed to separate nodes to spread the workload across different host resources. Remember that a scanner requires enough memory to pull and expand the image, so it should have available to it more than the largest image size to be scanned. If necessary, scanners can be placed on specific nodes or avoid placing multiple pods on one node using standard Kubernetes node labels, taints/tolerations, or node affinity configurations.

By default, NeuVector deploys 2 scanner pods, as part of the sample deployments in the section Deploying NeuVector. These replicasets can be scaled up or down as needed.

The scanner container the latest CVE database and is regularly updated (with 'latest' tag) by NeuVector. The updater redeploys the scanner, forcing a pull of the latest scanner image in order to get the latest CVE database. See the section [Updating the CVE Database](/scanning/updating) for more details on the updater.

Please note that in initial releases the presence and status of multiple scanners is only visible in Kubernetes with 'kubectl get pods -n neuvector' and will not be displayed in the web console. 

Scan results from all scanners are shown in the Assets -> Registries menu. Additional scanner monitoring features will be added in future releases.

#### Auto-scaling of Scanner Pods
Scanner pods can be configured to auto-scale based on certain criteria. This will ensure that scanning jobs are handled quickly and efficiently, especially if there are thousands of images to be scanned or re-scanned. There are three possible settings: delayed, immediate,  and disabled. When images are queued for scanning by the controller, it keeps a 'task count' of the queue size. 
+ Delayed strategy:
  -  When lead controller continuously sees "task count" > 0 for > 90 seconds, a new scanner pod is started if maxScannerPods is not reached yet
  -  When lead controller continuously sees "task count" is 0 for > 180 seconds, it scales down one scanner pod if minScannerPods is not reached yet
+ Immediate strategy:
  -  Every time when lead controller sees "task count" > 0, a new scanner pod is started if maxScannerPods is not reached yet
  -  When lead controller continuously sees "task count" is 0 for > 180 seconds, it scales down one scanner pod if minScannerPods is not reached yet

Scanner auto-scaling is configured in Settings -> Configuration. The minimumScannerPods setting sets the minimum scanner pods running at any time, while the maxScannerPods sets the maximum number of pods that the auto-scaling strategy can scale up to. NOTE: Setting a minimum value will not adjust the original scanner deployment replicaset value. The minimum value will be applied during the first scale up/down event.

***Important:*** Scanner auto-scaling is not supported when scanner is deployed with an OpenShift operator, as the operator will always change the number of pods to its configured value.

#### Operations and Debugging
Each scanner pod will query the registries to be scanned to pull down the complete list of available images and other data. Each scanner will then be assigned an image to pull and scan from the registry.

To inspect the scanner behavior, logs from each scanner pod can be examined using
```
kubectl logs <scanner-pod-name> -n neuvector
```

### Performance Planning
Experiment with varying numbers of scanners on registries with a large number of images to observe the scan completion time behavior in your environment. 2-5 scanners as the replica setting should be sufficient for most cases.

When a scan task is assigned to a scanner, it pulls the image from the registry (after querying the registry for the list of available images). The amount of time it takes to pull the image (download) typically consumes the most time. Multiple scanners can be pulling images from the same registry in parallel, so the performance may be limited by registry or network bandwidth.

Large images will take more time to pull as well as need to be expanded to scan them, consuming more memory. Make sure each scanner has enough memory allocated to it to handle more than the largest expected image (10% more minimum).

Multiple scanner pods can be deployed to the same host/node, but considerations should be made to ensure the host has enough memory, CPU, and network bandwidth for maximizing scanner performance.

### Standalone Scanner for Local Scanning
NeuVector supports standalone scanner deployments for local image scanning (which does not require a Controller). In the sample docker run below, the local image will be scanned and the results stored at the /var/neuvector locally. For local scanning, the image must be able to be accessed through the mounted docker.sock, otherwise a registry can be specified.

```
docker run --name neuvector.scanner --rm -e SCANNER_REPOSITORY=ubuntu -e SCANNER_TAG=16.04 -e SCANNER_ON_DEMAND=true -v /var/run/docker.sock:/var/run/docker.sock -v /var/neuvector:/var/neuvector  neuvector/scanner
```
The following scanner environment variables can be used in the docker run command: 

- SCANNER_REGISTRY= url of the registry (optional instead of local scan)
- SCANNER_REPOSITORY= repository to scan
- SCANNER_TAG= version tag
- SCANNER_REGISTRY_USERNAME= user (optional instead of local scan)
- SCANNER_REGISTRY_PASSWORD= password (optional instead of local scan)
- SCANNER_SCAN_LAYERS= true or false (to return layered scan results)
- SCANNER_ON_DEMAND=true (required)
- CLUSTER_JOIN_ADDR (optional), CLUSTER_JOIN_PORT (optional) - to send results to controller for use in Admission control rules (Kubernetes deployed controller).
- CLUSTER_ADVERTISED_ADDR (optional) - if scanner is on different host than controller, to send results for use in Admission control rules (Kubernetes deployed controller).

#### Manual Deployment of Multiple Scanners on Kubernetes
To manually deploy scanners as part of an existing Kubernetes deployment, create a new role binding:

```
kubectl create rolebinding neuvector-admin --clusterrole=admin --serviceaccount=neuvector:default -n neuvector
```

Or for OpenShift
```
oc adm policy add-role-to-user admin system:serviceaccount:neuvector:default -n neuvector
```

Use the file below to deploy multiple scanners. Edit the replicas to increase or decrease the number of scanners running in parallel.
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: neuvector-scanner-pod
  namespace: neuvector
spec:
  selector:
    matchLabels:
      app: neuvector-scanner-pod
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  replicas: 2
  template:
    metadata:
      labels:
        app: neuvector-scanner-pod
    spec:
      containers:
        - name: neuvector-scanner-pod
          image: neuvector/scanner
          imagePullPolicy: Always
          env:
            - name: CLUSTER_JOIN_ADDR
              value: neuvector-svc-controller.neuvector
# Commented out sections are required only for local build-phase scanning
#            - name: SCANNER_DOCKER_URL
#              value: tcp://192.168.1.10:2376
#          volumeMounts:
#            - mountPath: /var/run/docker.sock
#              name: docker-sock
#              readOnly: true
#      volumes:
#        - name: docker-sock
#          hostPath:
#            path: /var/run/docker.sock
      restartPolicy: Always
```

Next, create or update the CVE database updater cron job. This will update the CVE database nightly.

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