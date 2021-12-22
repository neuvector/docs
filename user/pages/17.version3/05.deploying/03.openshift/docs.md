---
title: RedHat OpenShift Production Deployment
taxonomy:
    category: docs
---

### Deploy Separate NeuVector Components with RedHat OpenShift
NeuVector is compatible with standard ovs SDN plug-ins as well as others such as flannel, weave, or calico. The samples below assume a standard ovs plug-in is used. This also assumes a local docker registry will be used (see instructions at end for creating the secret for dynamically pulling from Docker Hub).

NeuVector supports Helm-based deployment with a Helm chart at https://github.com/neuvector/neuvector-helm. There is a separate chart for OpenShift deployments.

First, pull the appropriate NeuVector containers from the NeuVector private registry into your local registry.

```
docker login docker.io
docker pull docker.io/neuvector/manager:<version>
docker pull docker.io/neuvector/controller:<version>
docker pull docker.io/neuvector/enforcer:<version>
docker logout docker.io
```


The sample file below will deploy one manager and 3 controllers. It will deploy an enforcer on every node as a daemonset, including on the master node. See the bottom section for specifying dedicated manager or controller nodes using node labels. Note: It is not recommended to deploy (scale) more than one manager behind a load balancer due to potential session state issues. If you plan to use a PersistentVolume claim to store the backup of NeuVector config files, please see the general Backup/Persistent Data section in the [Production Deployment](/deploying/production#backups-and-persistent-data) overview.


Next, set the route and allow privileged NeuVector containers using the instructions below. By default, OpenShift does not allow privileged containers. Also, by default OpenShift does not schedule pods on the Master node. See the instructions at the end to enable/disable this.

NOTE: Please see the Enterprise Integration section for details on integration with OpenShift Role Based Access Controls (RBACs). 


1) Login as a normal user
```
oc login -u <user_name>
```

2) Create a new project
Note: If the --node-selector argument is used when creating a project this will restrict pod placement such as for the Neuvector enforcer to specific nodes.
```
oc new-project neuvector
```

3) Push NeuVector images to OpenShift docker registry
Note: For OpenShift 4.2+, you may need to change default docker-registry from docker-registry.default.svc:5000 to image-registry.openshift-image-registry.svc:5000 in the commands below
```
docker login -u <user_name> -p `oc whoami -t` docker-registry.default.svc:5000
docker tag docker.io/neuvector/enforcer docker-registry.default.svc:5000/neuvector/enforcer:<version>
docker tag docker.io/neuvector/controller docker-registry.default.svc:5000/neuvector/controller:<version>
docker tag docker.io/neuvector/manager docker-registry.default.svc:5000/neuvector/manager:<version>
docker push docker-registry.default.svc:5000/neuvector/enforcer:<version>
docker push docker-registry.default.svc:5000/neuvector/controller:<version>
docker push docker-registry.default.svc:5000/neuvector/manager:<version>
docker logout docker-registry.default.svc:5000
```

4) Login as system:admin account
```
oc login -u system:admin
```

5) Grant Service Account Access to the Privileged SCC
```
oc -n neuvector adm policy add-scc-to-user privileged -z default
```
The following info will be added in the Privileged SCC
users:
```
- system:serviceaccount:neuvector:default
```

6) Create the NeuVector CRDs
To deploy security policy automatically using customer resource definitions (CRDs), create the required NeuVector CRDs for namespace-scoped and cluster-scoped operation. For example, nvsecurityrules.yaml

```
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: nvsecurityrules.neuvector.com
spec:
  group: neuvector.com
  names:
    kind: NvSecurityRule
    listKind: NvSecurityRuleList
    plural: nvsecurityrules
    singular: nvsecurityrule
  scope: Namespaced
  version: v1
  versions:
  - name: v1
    served: true
    storage: true

---

apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: nvclustersecurityrules.neuvector.com
spec:
  group: neuvector.com
  names:
    kind: NvClusterSecurityRule
    listKind: NvClusterSecurityRuleList
    plural: nvclustersecurityrules
    singular: nvclustersecurityrule
  scope: Cluster
  version: v1
  versions:
  - name: v1
    served: true
    storage: true
```
Then create the CRDs
```
oc create -f nvsecurityrules.yaml
```

7) Add read permission to access the kubernetes API and OpenShift RBACs. Admission control is supported in OpenShift 3.9+.
```
oc create clusterrole neuvector-binding-app --verb=get,list,watch,update --resource=nodes,pods,services,namespaces
oc create clusterrole neuvector-binding-rbac --verb=get,list,watch --resource=rolebindings.rbac.authorization.k8s.io,roles.rbac.authorization.k8s.io,clusterrolebindings.rbac.authorization.k8s.io,clusterroles.rbac.authorization.k8s.io,imagestreams.image.openshift.io
oc adm policy add-cluster-role-to-user neuvector-binding-app system:serviceaccount:neuvector:default
oc adm policy add-cluster-role-to-user neuvector-binding-rbac system:serviceaccount:neuvector:default
oc create clusterrole neuvector-binding-admission --verb=get,list,watch,create,update,delete --resource=validatingwebhookconfigurations,mutatingwebhookconfigurations
oc adm policy add-cluster-role-to-user neuvector-binding-admission system:serviceaccount:neuvector:default
oc create clusterrole neuvector-binding-customresourcedefinition --verb=watch,create,get --resource=customresourcedefinitions
oc adm policy add-cluster-role-to-user neuvector-binding-customresourcedefinition system:serviceaccount:neuvector:default
oc create clusterrole neuvector-binding-nvsecurityrules --verb=list,delete --resource=nvsecurityrules,nvclustersecurityrules
oc adm policy add-cluster-role-to-user neuvector-binding-nvsecurityrules system:serviceaccount:neuvector:default
```

For OpenShift 4.x, also add the following for platform detection:
```
oc create clusterrole neuvector-binding-co --verb=get,list --resource=clusteroperators
oc adm policy add-cluster-role-to-user neuvector-binding-co system:serviceaccount:neuvector:default

```

NOTE: If upgrading from a previous NeuVector deployment, you may need to delete the old bindings:
```
oc delete clusterrolebinding neuvector-binding
oc delete clusterrole neuvector-binding
```

8) Run the following command to check if the neuvector/default service account is added successfully
```
oc get ClusterRoleBinding neuvector-binding-app neuvector-binding-rbac neuvector-binding-admission neuvector-binding-customresourcedefinition neuvector-binding-nvsecurityrules -o wide
```
Sample output:
```
NAME                                         ROLE                                          USERS     GROUPS    SERVICE ACCOUNTS    SUBJECTS
neuvector-binding-app                        /neuvector-binding-app                                            neuvector/default
neuvector-binding-rbac                       /neuvector-binding-rbac                                           neuvector/default
neuvector-binding-admission                  /neuvector-binding-admission                                      neuvector/default
neuvector-binding-customresourcedefinition   /neuvector-binding-customresourcedefinition                       neuvector/default
neuvector-binding-nvsecurityrules            /neuvector-binding-nvsecurityrules                                neuvector/default
```

9) Add support for Admission Control (OpenShift 3.9-3.11 only, this is not required in 4.2+)

Edit the master config
```
vi /etc/origin/master/master-config.yaml
```
Add MutatingAdmissionWebhook and ValidatingAdmissionWebhook
```
admissionConfig:
  pluginConfig:
    MutatingAdmissionWebhook:
      configuration:
        kind: DefaultAdmissionConfig
        apiVersion: v1
        disable: false
    ValidatingAdmissionWebhook:
      configuration:
        kind: DefaultAdmissionConfig
        apiVersion: v1
        disable: false
```

Restart the Openshift api and controllers services.
This is different for different versions. For example 3.10+
```
master-restart api
master-restart controllers
```
Or
```
/usr/local/bin/master-restart api controllers
```

Run the following command to check if admissionregistration.k8s.io/v1beta1 is enabled
```
$ oc api-versions | grep admissionregistration
admissionregistration.k8s.io/v1beta1
```

10) Create the neuvector services and pods based on the sample yamls below. Important! Replace the &lt;version> tags for the manager, controller and enforcer image references in the yaml file. Also make any other modifications required for your deployment environment.
```
oc create -f <compose file>
```

That's it! You should be able to connect to the NeuVector console and login with admin:admin, e.g. https://&lt;public-ip>:8443

To see how to access the console for the neuvector-webui service:
```
oc get services -n neuvector
```

Don't forget to apply your license file after logging in so that you can see all Nodes, Enforcers and Assets.

If you have created your own namespace instead of using “neuvector”, replace all instances of “namespace: neuvector” and other namespace references with your namespace in the sample yams files below.

<strong>OpenShift 4.2+ with CRI-O run-time</strong>

The name of your default OpenShift registry might have changed from docker-registry to openshift-image-registry. You may need to change the image registry for the manager, controller, and enforcer in the sample yaml.

If using the CRI-O run-time, change the volumeMounts for controller and enforcer pods in the sample yaml from docker.sock to:
```
            - mountPath: /var/run/crio/crio.sock
              name: runtime-sock
              readOnly: true
```
And change the volumes from docker.sock to:
```
       - name: runtime-sock
          hostPath:
            path: /var/run/crio/crio.sock
```



<strong>OpenShift 3.9-3.11, 4.2+ Manager/Controller/Enforcer Sample File</strong>

Note1: For OpenShift 4.2+, see above for yaml file changes required for default registry and CRI-O run-time.
Note2: Type NodePort is used for the fed-master and fed-worker services instead of LoadBalancer. You may need to adjust for your deployment.

```
# neuvector yaml version for NeuVector 3.x.x, it will also work for 2.5.x
apiVersion: v1
kind: Service
metadata:
  name: neuvector-service-controller-fed-master
  namespace: neuvector
spec:
  ports:
  - port: 11443
    name: fed
    protocol: TCP
  type: NodePort
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-service-controller-fed-worker
  namespace: neuvector
spec:
  ports:
  - port: 10443
    name: fed
    protocol: TCP
  type: NodePort
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-svc-crd-webhook
  namespace: neuvector
spec:
  ports:
  - port: 443
    targetPort: 30443
    protocol: TCP
    name: crd-webhook
  type: ClusterIP
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-svc-admission-webhook
  namespace: neuvector
spec:
  ports:
  - port: 443
    targetPort: 20443
    protocol: TCP
    name: admission-webhook
  type: ClusterIP
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-service-webui
  namespace: neuvector
spec:
  ports:
    - port: 8443
      name: manager
      protocol: TCP
  type: ClusterIP
  selector:
    app: neuvector-manager-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-svc-controller
  namespace: neuvector
spec:
  ports:
  - port: 18300
    protocol: "TCP"
    name: "cluster-tcp-18300"
  - port: 18301
    protocol: "TCP"
    name: "cluster-tcp-18301"
  - port: 18301
    protocol: "UDP"
    name: "cluster-udp-18301"
  clusterIP: None
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Route
metadata:
  name: neuvector-route-webui
  namespace: neuvector
spec:
  to:
    kind: Service
    name: neuvector-service-webui
  port:
    targetPort: manager
  tls:
    termination: passthrough

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: neuvector-manager-pod
  namespace: neuvector
spec:
  selector:
    matchLabels:
      app: neuvector-manager-pod
  replicas: 1
  template:
    metadata:
      labels:
        app: neuvector-manager-pod
    spec:
      containers:
        - name: neuvector-manager-pod
          # 4.2+, change docker-registry below to openshift-registry
          image: docker-registry.default.svc:5000/neuvector/manager:<version>
          env:
            - name: CTRL_SERVER_IP
              value: neuvector-svc-controller.neuvector
      restartPolicy: Always

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: neuvector-controller-pod
  namespace: neuvector
spec:
  selector:
    matchLabels:
      app: neuvector-controller-pod
  minReadySeconds: 60
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  replicas: 3
  template:
    metadata:
      labels:
        app: neuvector-controller-pod
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - neuvector-controller-pod
              topologyKey: "kubernetes.io/hostname"
      containers:
        - name: neuvector-controller-pod
          # 4.2+, change docker-registry below to openshift-registry
          image: docker-registry.default.svc:5000/neuvector/controller:<version>
          securityContext:
            privileged: true
          readinessProbe:
            exec:
              command:
              - cat
              - /tmp/ready
            initialDelaySeconds: 5
            periodSeconds: 5
          env:
            - name: CLUSTER_JOIN_ADDR
              value: neuvector-svc-controller.neuvector
            - name: CLUSTER_ADVERTISED_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
            - name: CLUSTER_BIND_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
          volumeMounts:
            - mountPath: /var/neuvector
              name: nv-share
              readOnly: false
            - mountPath: /var/run/docker.sock
              name: docker-sock
              readOnly: true
            - mountPath: /host/proc
              name: proc-vol
              readOnly: true
            - mountPath: /host/cgroup
              name: cgroup-vol
              readOnly: true
            - mountPath: /etc/config
              name: config-volume
              readOnly: true
      terminationGracePeriodSeconds: 300
      restartPolicy: Always
      volumes:
        - name: nv-share
          hostPath:
            path: /var/neuvector
        - name: docker-sock
          hostPath:
            path: /var/run/docker.sock
        - name: proc-vol
          hostPath:
            path: /proc
        - name: cgroup-vol
          hostPath:
            path: /sys/fs/cgroup
        - name: config-volume
          configMap:
            name: neuvector-init 
            optional: true

---

apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: neuvector-enforcer-pod
  namespace: neuvector
spec:
  selector:
    matchLabels:
      app: neuvector-enforcer-pod
  updateStrategy:
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: neuvector-enforcer-pod
    spec:
      tolerations:
        - effect: NoSchedule
          key: node-role.kubernetes.io/master
      hostPID: true
      containers:
        - name: neuvector-enforcer-pod
          # 4.2+, change docker-registry below to openshift-registry
          image: docker-registry.default.svc:5000/neuvector/enforcer:<version>
          securityContext:
            privileged: true
          env:
            - name: CLUSTER_JOIN_ADDR
              value: neuvector-svc-controller.neuvector
            - name: CLUSTER_ADVERTISED_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
            - name: CLUSTER_BIND_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
          volumeMounts:
            - mountPath: /lib/modules
              name: modules-vol
              readOnly: true
            - mountPath: /var/run/docker.sock
              name: docker-sock
              readOnly: true
            - mountPath: /host/proc
              name: proc-vol
              readOnly: true
            - mountPath: /host/cgroup
              name: cgroup-vol
              readOnly: true
      terminationGracePeriodSeconds: 1200
      restartPolicy: Always
      volumes:
        - name: modules-vol
          hostPath:
            path: /lib/modules
        - name: docker-sock
          hostPath:
            path: /var/run/docker.sock
        - name: proc-vol
          hostPath:
            path: /proc
        - name: cgroup-vol
          hostPath:
            path: /sys/fs/cgroup
```

**Master Node Taints and Tolerations**
All taint info must match to schedule Enforcers on nodes. To check the taint info on a node (e.g. Master):
```
$ oc get node taintnodename -o yaml
```
Sample output:
```
spec:
  taints:
  - effect: NoSchedule
    key: node-role.kubernetes.io/master
  # there may be an extra info for taint as below
  - effect: NoSchedule
    key: mykey
    value: myvalue
```

If there is additional taints as above, add these to the sample yaml tolerations section:
```
spec:
  template:
    spec:
      tolerations:
        - effect: NoSchedule
          key: node-role.kubernetes.io/master
        # if there is an extra info for taints as above, please add it here. This is required to match all the taint info defined on the taint node. Otherwise, the Enforcer won't deploy on the taint node
        - effect: NoSchedule
          key: mykey
          value: myvalue
```


### Using Node Labels for Manager and Controller Nodes
To control which nodes the Manager and Controller are deployed on, label each node. Replace <nodename> with the appropriate node name.

```
oc label nodes <nodename> nvcontroller=true
```

Then add a nodeSelector to the yaml file for the Manager and Controller deployment sections. For example:

```
          - mountPath: /host/cgroup
              name: cgroup-vol
              readOnly: true
      nodeSelector:
        nvcontroller: "true"
      restartPolicy: Always
```

To prevent the enforcer from being deployed on a controller node, if it is a dedicated management node (without application containers to be monitored), add a nodeAffinity to the Enforcer yaml section. For example:

```
app: neuvector-enforcer-pod
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                - key: nvcontroller
                  operator: NotIn
                  values: ["true"]
      imagePullSecrets:
```

### Deploy Without Privileged Mode
On some systems, deployment without using privileged mode is supported. These systems must support for seccomp capabilities and setting the apparmor profile.

See the sections on deployment with Docker-Compose, Docker UCP/Datacenter for sample compose files or contact support@neuvector.com for assistance.

### Rolling Updates

Orchestration tools such as Kubernetes, RedHat OpenShift, and Rancher support rolling updates with configurable policies. You can use this feature to update the NeuVector containers. The most important will be to ensure that there is at least one Allinone/Controller running so that policies, logs, and connection data is not lost. Make sure that there is a minimum of 30 seconds between container updates so that a new leader can be elected and the data synchronized between controllers.

Before starting the rolling updates, please pull and tag the NeuVector containers the same way as in the beginning of this page. You can pull the latest without a version number, but to trigger the rolling update you’ll need to tag the image with a version.

For example, for the controller (latest):
```
docker pull neuvector/controller
```

Then to tag/push, if latest version is 2.0.1, same as step 3 at the top of this page:
```
docker login -u <user_name> -p `oc whoami -t` docker-registry.default.svc:5000
docker tag neuvector/controller docker-registry.default.svc:5000/neuvector/controller:2.0.1
docker push docker-registry.default.svc:5000/neuvector/controller:2.0.1
etc...
```

You can now update your yaml file with these new versions and ‘apply’, or use the ‘oc set image ...’ command to trigger the rolling update. Please see the Kubernetes rolling update samples in this Production section to how to launch and monitor rolling updates of the NeuVector containers.

The provided sample deployment yamls already configure the rolling update policy. If you are updating via the NeuVector Helm chart, please pull the latest chart to properly configure new features such as admission control, and delete the old cluster role and cluster role binding for NeuVector. If you are updating via OpenShift or Kubernetes you can manually update to a new version with the sample commands below. 


### Updating the NeuVector CVE Vulnerability Database
A container called the Updater is published and regularly updated on NeuVector’s Docker Hub. This image can be pulled, and when run it will update the CVE database used to scan for vulnerabilities. To automatically check for updates and run the updater a cron job can be created.

The cron job updater will pull the latest updater image (if configured appropriately), run the updater container which will update the NeuVector CVE database, then stop the container. You may need to pull the latest updater image from the NeuVector docker hub into your private registry to have the newest update available to run.

The cron job sample neuvector-updater.yaml below for OpenShift runs the updater every day at midnight. The schedule can be adjusted as desired.

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

Or to run the updater once:
```
apiVersion: v1
kind: Pod
metadata:
  name: neuvector-updater-pod
  namespace: neuvector
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

Note: If the allinone container was deployed instead of the controller, replace neuvector-svc-controller.neuvector with neuvector-svc-allinone.neuvector

To run the cron job
```
oc create -f neuvector-updater.yaml 
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

After running the update, inspect the controller/allinone logs for 'version.' For example in Kubernetes:
```
kubectl logs neuvector-controller-pod-777fdc5668-4jkjn -n neuvector | grep version
```

```
2019-07-29T17:04:02.43 |DEBU|SCN|main.dbUpdate: New DB found - create=2019-07-24T11:59:13Z version=1.576
2019-07-29T17:04:02.454|DEBU|SCN|memdb.ReadCveDb: New DB found - update=2019-07-24T11:59:13Z version=1.576
2019-07-29T17:04:12.224|DEBU|SCN|main.scannerRegister: - version=1.576
```

### Enabling the REST API
To enable the rest API, port 10443 must be configured as follows:
```
apiVersion: v1
kind: Service
metadata:
  name: neuvector-service-controller
  namespace: neuvector
spec:
  ports:
    - port: 10443
      name: controller
      protocol: TCP
  type: NodePort
  selector:
    app: neuvector-controller-pod
```

### Enable/Disable Scheduling on the Master Node

The following commands can be used to enable/disable the scheduling on the master node.

```
oc adm manage-node nodename --schedulable
```

```
oc adm manage-node nodename --schedulable=false
```

### Configure Secret to Pull NeuVector Containers from Docker Hub

To configure Openshift to pull from the private NeuVector registry on Docker Hub. NOTE: For OpenShift v3.7 please see instructions in NOTE1 below for configuring secret
```
oc secrets new-dockercfg regsecret -n neuvector --docker-server=https://index.docker.io/v1/ --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>
```

You will also need to add the regsecret to the yaml file in the template/spec section for the manager, controller, and enforcer. For example:
```
template:
    metadata:
      labels:
        app: neuvector-controller-pod
    spec:
      imagePullSecrets:
        - name: regsecret
```


Note1: For OpenShift 3.7, configure secret as follow:
1. ‘cat ~/.docker/config.json’ to make sure the context as below before docker login
{
  "auths": {
    "credsStore": {}
  }
}
2. ‘docker login docker.io’ to create credential in .docker/config.json
3. ‘oc secrets new regsecret .dockerconfigjson=.docker/config.json -n neuvector’

