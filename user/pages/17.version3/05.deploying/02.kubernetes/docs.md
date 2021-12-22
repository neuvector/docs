---
title: Kubernetes Deployment
taxonomy:
    category: docs
---

### Deploy Using Kubernetes

You can use Kubernetes to deploy separate manager, controller and enforcer containers and make sure that all new nodes have an enforcer deployed. NeuVector requires and supports Kubernetes network plugins such as flannel, weave, or calico. 

The sample file will deploy one manager and 3 controllers. It will deploy an enforcer on every node as a daemonset. By default, the yaml sample below will deploy to the Master node as well.

See the bottom section for specifying dedicated manager or controller nodes using node labels. Note: It is not recommended to deploy (scale) more than one manager behind a load balancer due to potential session state issues. If you plan to use a PersistentVolume claim to store the backup of NeuVector config files, please see the general Backup/Persistent Data section in the [Deploying NeuVector](/deploying/production#backups-and-persistent-data) overview.

If your deployment supports an integrated load balancer, change type NodePort to LoadBalancer for the console in the yaml file below.

NeuVector supports Helm-based deployment with a Helm chart at https://github.com/neuvector/neuvector-helm.

There is a separate section for OpenShift instructions, and Docker EE on Kubernetes has some special steps described in the Docker section.


<ol><li>Create the NeuVector namespace
<pre>
<code>kubectl create namespace neuvector</code></pre>
</li>
<li>Configure Kubernetes to pull from the private NeuVector registry on Docker Hub
<pre>
<code>kubectl create secret docker-registry regsecret -n neuvector --docker-server=https://index.docker.io/v1/ --docker-username=your-name --docker-password=your-pword --docker-email=your-email</code></pre>
Where ’your-name’ is your Docker username, ’your-pword’ is your Docker password, ’your-email’ is your Docker email.
</li>
<li>(Optional) Create the NeuVector Pod Security Policy (PSP).
 If you have enabled Pod Security Policies in your Kubernetes cluster, add the following for NeuVector (for example, nv_psp.yaml).
<pre>
<code>
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: neuvector-binding-psp
  annotations:
    seccomp.security.alpha.kubernetes.io/allowedProfileNames: '*'
spec:
  privileged: true
  readOnlyRootFilesystem: false
  allowPrivilegeEscalation: true
  allowedCapabilities:
  - SYS_ADMIN
  - NET_ADMIN
  - SYS_PTRACE
  - IPC_LOCK
  requiredDropCapabilities:
  - ALL
  volumes:
  - '*'
  hostNetwork: true
  hostPorts:
  - min: 0
    max: 65535
  hostIPC: true
  hostPID: true
  runAsUser:
    rule: 'RunAsAny'
  seLinux:
    rule: 'RunAsAny'
  supplementalGroups:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'

---

apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: neuvector-binding-psp
  namespace: neuvector
rules:
- apiGroups:
  - policy
  - extensions
  resources:
  - podsecuritypolicies
  verbs:
  - use
  resourceNames:
  - neuvector-binding-psp

---

apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: neuvector-binding-psp
  namespace: neuvector
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: neuvector-binding-psp
subjects:
- kind: ServiceAccount
  name: default
  namespace: neuvector</code></pre>

Then create the PSP
<pre>
<code>
kubectl create -f nv_psp.yaml</code></pre>
</li>
<li>Create the NeuVector CRDs
To deploy security policy automatically using customer resource definitions (CRDs), create the required NeuVector CRDs for namespace-scoped and cluster-scoped operation. For example, nvsecurityrules.yaml:
<pre>
<code>
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
    storage: true</code></pre>

Then create the CRDs
<pre>
<code>
kubectl create -f nvsecurityrules.yaml</code></pre>
</li>
<li>Add read permission to access the kubernetes API. RBAC is supported in kubernetes 1.8+ officially. Admission control is supported in kubernetes 1.9+.
<pre>
<code>kubectl create clusterrole neuvector-binding-app --verb=get,list,watch,update --resource=nodes,pods,services,namespaces
kubectl create clusterrole neuvector-binding-rbac --verb=get,list,watch --resource=rolebindings.rbac.authorization.k8s.io,roles.rbac.authorization.k8s.io,clusterrolebindings.rbac.authorization.k8s.io,clusterroles.rbac.authorization.k8s.io
kubectl create clusterrolebinding neuvector-binding-app --clusterrole=neuvector-binding-app --serviceaccount=neuvector:default
kubectl create clusterrolebinding neuvector-binding-rbac --clusterrole=neuvector-binding-rbac --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-admission --verb=get,list,watch,create,update,delete --resource=validatingwebhookconfigurations,mutatingwebhookconfigurations
kubectl create clusterrolebinding neuvector-binding-admission --clusterrole=neuvector-binding-admission --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-customresourcedefinition --verb=watch,create,get --resource=customresourcedefinitions
kubectl create clusterrolebinding  neuvector-binding-customresourcedefinition --clusterrole=neuvector-binding-customresourcedefinition --serviceaccount=neuvector:default
kubectl create clusterrole neuvector-binding-nvsecurityrules --verb=list,delete --resource=nvsecurityrules,nvclustersecurityrules
kubectl create clusterrolebinding neuvector-binding-nvsecurityrules --clusterrole=neuvector-binding-nvsecurityrules --serviceaccount=neuvector:default</code>
</pre>
NOTE: If upgrading NeuVector from a previous install, you may need to delete the old binding as follows:
<pre>
<code>kubectl delete clusterrolebinding neuvector-binding
kubectl delete clusterrole neuvector-binding</code>
</pre>
</li>
<li>Run the following commands to check if the neuvector/default service account is added successfully.
<pre>
<code>kubectl get ClusterRoleBinding neuvector-binding-app neuvector-binding-rbac neuvector-binding-admission neuvector-binding-customresourcedefinition neuvector-binding-nvsecurityrules -o wide</code>
</pre>
<pre>
<code>NAME                                         AGE    ROLE                                                     USERS   GROUPS   SERVICEACCOUNTS
neuvector-binding-app                        206d   ClusterRole/neuvector-binding-app                                         neuvector/default
neuvector-binding-rbac                       206d   ClusterRole/neuvector-binding-rbac                                        neuvector/default
neuvector-binding-admission                  206d   ClusterRole/neuvector-binding-admission                                   neuvector/default
neuvector-binding-customresourcedefinition   9d     ClusterRole/neuvector-binding-customresourcedefinition                    neuvector/default
neuvector-binding-nvsecurityrules            9d     ClusterRole/neuvector-binding-nvsecurityrules                             neuvector/default</code>
</pre>
</li>
<li>Kubernetes 1.9 Only: Add support for Admission Control (Skip to next step for 1.10+ since these are enabled by default)
<ol>
<li>Edit the master config
<pre>
<code>vi /etc/kubernetes/manifests/kube-apiserver.yaml</code>
</pre>
</li>
<li>Add MutatingAdmissionWebhook and ValidatingAdmissionWebhook plugins
It’s worth emphasizing that in 1.9, these happen in a mutating phase and a validating phase, and that e.g. ResourceQuota runs in the validating phase, and therefore is the last admission controller to run. MutatingAdmissionWebhook appears before it in this list, because it runs in the mutating phase.

Please add MutatingAdmissionWebhook and ValidatingAdmissionWebhook in the following order. Otherwise the kube-apiserver will not run successfully.
<pre>
<code>spec: 
  containers:
  - command:
    - --admission-control=...DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,NodeRestriction,ResourceQuota</code>
</pre>
</li>
<li>
The kube-apiserver will be restarted automatically, and run the following command to check if admissionregistration.k8s.io/v1beta1 is enabled
<pre>
<code>$ kubectl api-versions | grep admissionregistration
admissionregistration.k8s.io/v1beta1</code>
</pre>
</li>
</ol>
</li>
<li>Create the neuvector services and pods from the Kubernetes sample yaml below. Important! Replace the &lt;version> tags for the manager, controller and enforcer image references in the yaml file. Also make any other modifications required for your deployment environment.
<pre>
<code>kubectl create -f neuvector.yaml</code></pre>

That's it! You should be able to connect to the NeuVector console and login with admin:admin, e.g. https://&lt;public-ip>:8443

Don't forget to apply your license file after logging in so that you can see all Nodes, Enforcers and Assets.

</li></ol>
NOTE: The nodeport service specified in the neuvector.yaml file will open a random port on all kubernetes nodes for the NeuVector management web console port. Alternatively, you can use a LoadBalancer or Ingress, using a public IP and default port 8443. For nodeport, be sure to open access through firewalls for that port, if needed. If you want to see which port is open on the host nodes, please do the following commands.
```
kubectl get svc -n neuvector
```
And you will see something like:
```
NAME                          CLUSTER-IP      EXTERNAL-IP   PORT(S)                                          AGE
neuvector-service-webui     10.100.195.99     <nodes>       8443:30257/TCP                                   15m
```

If you have created your own namespace instead of using “neuvector”, replace all instances of “namespace: neuvector” and other namespace references with your namespace in the sample yams files below.

Containerd Run-time
If using the containerd run-time, change the volumeMounts for controller and enforcer pods in the sample yamls from docker.sock to:
```
            - mountPath: /run/containerd/containerd.sock
              name: runtime-sock
              readOnly: true
```
And change the volumes from docker.sock to:
```
       - name: runtime-sock
          hostPath:
            path: /run/containerd/containerd.sock
```

PKS Change
Note: PKS is field tested and requires enabling privileged containers to the plan/tile, and changing the yaml hostPath as follows for Allinone, Controller, Enforcer:
<pre>
<code>      hostPath:
            path: /var/vcap/sys/run/docker/docker.sock</code>
</pre>

<strong>Kubernetes v1.9-1.18 Manager/Controller/Enforcer Sample File</strong>
```
# neuvector yaml version for 3.x.x, it will also work for 2.5.x
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
  type: LoadBalancer
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
  type: LoadBalancer
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
  type: NodePort
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
      imagePullSecrets:
        - name: regsecret
      containers:
        - name: neuvector-manager-pod
          image: neuvector/manager:<version>
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
      imagePullSecrets:
        - name: regsecret
      containers:
        - name: neuvector-controller-pod
          image: neuvector/controller:<version>
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
      imagePullSecrets:
        - name: regsecret
      hostPID: true
      containers:
        - name: neuvector-enforcer-pod
          image: neuvector/enforcer:<version>
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
$ kubectl get node taintnodename -o yaml
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
To control which nodes the Manager and Controller are deployed on, label each node. Replace nodename with the appropriate node name (‘kubectl get nodes’). Note: By default Kubernetes will not schedule pods on the master node. 

```
kubectl label nodes nodename nvcontroller=true
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

Orchestration tools such as Kubernetes, RedHat OpenShift, and Rancher support rolling updates with configurable policies. You can use this feature to update the NeuVector containers. The most important will be to ensure that there is at least one Allinone/Controller running so that policies, logs, and connection data is not lost. Make sure that there is a minimum of 120 seconds between container updates so that a new leader can be elected and the data synchronized between controllers.

The provided sample deployment yamls already configure the rolling update policy. If you are updating via the NeuVector Helm chart, please pull the latest chart to properly configure new features such as admission control, and delete the old cluster role and cluster role binding for NeuVector. If you are updating via Kubernetes you can manually update to a new version with the sample commands below. 


#### Sample Kubernetes Rolling Update 

For upgrades which just need to update to a new image version, you can use this simple approach.

If your Deployment or Daemonset is already running, you can change the yaml file to the new version, then apply the update:
```
kubectl apply -f <yaml file>
```

To update to a new version of NeuVector from the command line.

For controller as Deployment (also do for manager)
```
kubectl set image deployment/neuvector-controller-pod neuvector-controller-pod=neuvector/controller:2.4.1 -n neuvector
```
For any container as a DaemonSet:
```
kubectl set image -n neuvector ds/neuvector-enforcer-pod neuvector-enforcer-pod=neuvector/enforcer:2.4.1
```

To check the status of the rolling update:
```
kubectl rollout status -n neuvector ds/neuvector-enforcer-pod   // this is only supported in version 1.6+
kubectl rollout status -n neuvector deployment/neuvector-controller-pod
```

To rollback the update:
```
kubectl rollout undo -n neuvector ds/neuvector-enforcer-pod     // this is only supported in version 1.6+
kubectl rollout undo -n neuvector deployment/neuvector-controller-pod
```

### Updating the NeuVector CVE Vulnerability Database
A container called the Updater is published and regularly updated on NeuVector’s Docker Hub. This image can be pulled, and when run it will update the CVE database used to scan for vulnerabilities. To automatically check for updates and run the updater a cron job can be created.

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

After running the update, inspect the controller/allinone logs for 'version.' For example in Kubernetes:
```
kubectl logs neuvector-controller-pod-777fdc5668-4jkjn -n neuvector | grep version
```

```
2019-07-29T17:04:02.43 |DEBU|SCN|main.dbUpdate: New DB found - create=2019-07-24T11:59:13Z version=1.576
2019-07-29T17:04:02.454|DEBU|SCN|memdb.ReadCveDb: New DB found - update=2019-07-24T11:59:13Z version=1.576
2019-07-29T17:04:12.224|DEBU|SCN|main.scannerRegister: - version=1.576
```


#### Updater for Kubernetes 1.7 and earlier
The cron job API is not supported by default. In the above yaml file replace the apiVersion: batch/v1beta1 with apiVersion: batch/v2alpha1

Edit the apiserver config file on the master node to add “--runtime-config=batch/v2alpha1”
```
vi /etc/kubernetes/manifests/kube-apiserver.yaml
```

Add as follows:
```
spec:
  containers:
  - command:
    - --runtime-config=batch/v2alpha1
```

Now restart the Master node (or api server), then start the cron job.
```
kubectl create -f neuvector-updater.yaml
```


### Expose REST API in Kubernetes
To expose the REST API for access from outside of the Kubernetes cluster, here is a sample yaml file:

```
apiVersion: v1
kind: Service
metadata:
  name: neuvector-service-rest
  namespace: neuvector
spec:
  ports:
    - port: 10443
      name: controller
      protocol: TCP
  type: LoadBalancer
  selector:
    app: neuvector-controller-pod
```

Please see the Automation section for more info on the REST API.
