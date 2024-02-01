---
title: Kubernetes 
taxonomy:
    category: docs
---

### Deploy Using Kubernetes

You can use Kubernetes to deploy separate manager, controller and enforcer containers and make sure that all new nodes have an enforcer deployed. NeuVector requires and supports Kubernetes network plugins such as flannel, weave, or calico. 

The sample file will deploy one manager and 3 controllers. It will deploy an enforcer on every node as a daemonset. By default, the sample below will deploy to the Master node as well.

See the bottom section for specifying dedicated manager or controller nodes using node labels. Note: It is not recommended to deploy (scale) more than one manager behind a load balancer due to potential session state issues. If you plan to use a PersistentVolume claim to store the backup of NeuVector config files, please see the general Backup/Persistent Data section in the [Deploying NeuVector](/deploying/production#backups-and-persistent-data) overview.

If your deployment supports an integrated load balancer, change type NodePort to LoadBalancer for the console in the yaml file below.

NeuVector supports Helm-based deployment with a Helm chart at [https://github.com/neuvector/neuvector-helm](https://github.com/neuvector/neuvector-helm).

There is a separate section for OpenShift instructions, and Docker EE on Kubernetes has some special steps described in the Docker section.

####NeuVector Images on Docker Hub
<p>The images are on the NeuVector Docker Hub registry. Use the appropriate version tag for the manager, controller, enforcer, and leave the version as 'latest' for scanner and updater. For example:
<li>neuvector/manager:5.3.0</li>
<li>neuvector/controller:5.3.0</li>
<li>neuvector/enforcer:5.3.0</li>
<li>neuvector/scanner:latest</li>
<li>neuvector/updater:latest</li></p>
<p>Please be sure to update the image references in appropriate yaml files.</p>
<p>If deploying with the current NeuVector Helm chart (v1.8.9+), the following changes should be made to values.yml:
<li>Update the registry to docker.io</li>
<li>Update image names/tags to the current version on Docker hub, as shown above</li>
<li>Leave the imagePullSecrets empty</li></p>

Note: If deploying from the Rancher Manager 2.6.5+ NeuVector chart, images are pulled automatically from the Rancher Registry mirrored image repo, and deploys into the cattle-neuvector-system namespace.

###Deploy NeuVector

<ol><li>Create the NeuVector namespace and the required service accounts
<pre>
<code>kubectl create namespace neuvector
kubectl create sa controller -n neuvector
kubectl create sa enforcer -n neuvector
kubectl create sa basic -n neuvector
kubectl create sa updater -n neuvector
kubectl create sa scanner -n neuvector
kubectl create sa registry-adapter -n neuvector
</code></pre>
</li>
<li>(<strong>Optional</strong>) Create the NeuVector Pod Security Admission (PSA) or Pod Security Policy (PSP).
 If you have enabled Pod Security Admission (aka Pod Security Standards) in Kubernetes 1.25+, or Pod Security Policies (prior to 1.25) in your Kubernetes cluster, add the following for NeuVector (for example, nv_psp.yaml). Note1: PSP is deprecated in Kubernetes 1.21 and will be totally removed in 1.25. Note2: The Manager and Scanner pods run without a uid. If your PSP has a rule `Run As User: Rule: MustRunAsNonRoot` then add the following into the sample yaml below (with appropriate value for ###):
<pre>
<code>
securityContext:
    runAsUser: ###</code></pre>
For PSA in Kubernetes 1.25+, label the NeuVector namespace with privileged profile for deploying on a PSA enabled cluster.
<pre>
<code>
$ kubectl label  namespace neuvector "pod-security.kubernetes.io/enforce=privileged"
</code></pre>
Sample PSP (1.24 and earlier)
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
  name: enforcer
  namespace: neuvector

---

apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: neuvector-binding-psp-controller
spec:
  privileged: false
  readOnlyRootFilesystem: false
  allowPrivilegeEscalation: false
  allowedCapabilities: null
  requiredDropCapabilities:
  - ALL
  volumes:
  - configMap
  - downwardAPI
  - emptyDir
  - persistentVolumeClaim
  - azureFile
  - projected
  - secret
  hostNetwork: false
  hostIPC: false
  hostPID: false
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
  name: neuvector-binding-psp-controller
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
  - neuvector-binding-psp-controller

---

apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: neuvector-binding-psp-controller
  namespace: neuvector
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: neuvector-binding-psp-controller
subjects:
- kind: ServiceAccount
  name: controller
  namespace: neuvector</code></pre>

Then create the PSP
<pre>
<code>
kubectl create -f nv_psp.yaml</code></pre>
</li>
<li>
Create the custom resources (CRD) for NeuVector security rules. For Kubernetes 1.19+:
<pre>
<code>
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/crd-k8s-1.19.yaml
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/waf-crd-k8s-1.19.yaml
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/dlp-crd-k8s-1.19.yaml
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/com-crd-k8s-1.19.yaml
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/vul-crd-k8s-1.19.yaml
kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/admission-crd-k8s-1.19.yaml</code></pre>

&nbsp;
</li>
<li>Add read permission to access the kubernetes API. IMPORTANT: The standard NeuVector 5.2+ deployment uses least-privileged service accounts instead of the default. See below if upgrading from a version prior to 5.3.

<pre>
<code>kubectl create clusterrole neuvector-binding-app --verb=get,list,watch,update --resource=nodes,pods,services,namespaces
kubectl create clusterrole neuvector-binding-rbac --verb=get,list,watch --resource=rolebindings.rbac.authorization.k8s.io,roles.rbac.authorization.k8s.io,clusterrolebindings.rbac.authorization.k8s.io,clusterroles.rbac.authorization.k8s.io
kubectl create clusterrolebinding neuvector-binding-app --clusterrole=neuvector-binding-app --serviceaccount=neuvector:controller
kubectl create clusterrolebinding neuvector-binding-rbac --clusterrole=neuvector-binding-rbac --serviceaccount=neuvector:controller
kubectl create clusterrole neuvector-binding-admission --verb=get,list,watch,create,update,delete --resource=validatingwebhookconfigurations,mutatingwebhookconfigurations
kubectl create clusterrolebinding neuvector-binding-admission --clusterrole=neuvector-binding-admission --serviceaccount=neuvector:controller
kubectl create clusterrole neuvector-binding-customresourcedefinition --verb=watch,create,get,update --resource=customresourcedefinitions
kubectl create clusterrolebinding neuvector-binding-customresourcedefinition --clusterrole=neuvector-binding-customresourcedefinition --serviceaccount=neuvector:controller
kubectl create clusterrole neuvector-binding-nvsecurityrules --verb=get,list,delete --resource=nvsecurityrules,nvclustersecurityrules
kubectl create clusterrole neuvector-binding-nvadmissioncontrolsecurityrules --verb=get,list,delete --resource=nvadmissioncontrolsecurityrules
kubectl create clusterrole neuvector-binding-nvdlpsecurityrules --verb=get,list,delete --resource=nvdlpsecurityrules
kubectl create clusterrole neuvector-binding-nvwafsecurityrules --verb=get,list,delete --resource=nvwafsecurityrules
kubectl create clusterrolebinding neuvector-binding-nvsecurityrules --clusterrole=neuvector-binding-nvsecurityrules --serviceaccount=neuvector:controller
kubectl create clusterrolebinding neuvector-binding-view --clusterrole=view --serviceaccount=neuvector:controller
kubectl create clusterrolebinding neuvector-binding-nvwafsecurityrules --clusterrole=neuvector-binding-nvwafsecurityrules --serviceaccount=neuvector:controller
kubectl create clusterrolebinding neuvector-binding-nvadmissioncontrolsecurityrules --clusterrole=neuvector-binding-nvadmissioncontrolsecurityrules --serviceaccount=neuvector:controller
kubectl create clusterrolebinding neuvector-binding-nvdlpsecurityrules --clusterrole=neuvector-binding-nvdlpsecurityrules --serviceaccount=neuvector:controller
kubectl create role neuvector-binding-scanner --verb=get,patch,update,watch --resource=deployments -n neuvector
kubectl create rolebinding neuvector-binding-scanner --role=neuvector-binding-scanner --serviceaccount=neuvector:updater --serviceaccount=neuvector:controller -n neuvector
kubectl create clusterrole neuvector-binding-csp-usages --verb=get,create,update,delete --resource=cspadapterusagerecords
kubectl create clusterrolebinding neuvector-binding-csp-usages --clusterrole=neuvector-binding-csp-usages --serviceaccount=neuvector:controller
kubectl create role neuvector-binding-secret --verb=get --resource=secrets -n neuvector
kubectl create rolebinding neuvector-binding-secret --role=neuvector-binding-secret --serviceaccount=neuvector:controller -n neuvector
kubectl create clusterrole neuvector-binding-nvcomplianceprofiles --verb=get,list,delete --resource=nvcomplianceprofiles
kubectl create clusterrolebinding neuvector-binding-nvcomplianceprofiles --clusterrole=neuvector-binding-nvcomplianceprofiles --serviceaccount=neuvector:controller
kubectl create clusterrole neuvector-binding-nvvulnerabilityprofiles --verb=get,list,delete --resource=nvvulnerabilityprofiles
kubectl create clusterrolebinding neuvector-binding-nvvulnerabilityprofiles --clusterrole=neuvector-binding-nvvulnerabilityprofiles --serviceaccount=neuvector:controller</code>
</pre>
If upgrading to 5.3.0+ from 5.2.0+, run the following before running the above create commands
<pre>
<code>
kubectl delete clusterrole neuvector-binding-nvsecurityrules neuvector-binding-nvadmissioncontrolsecurityrules neuvector-binding-nvdlpsecurityrules neuvector-binding-nvwafsecurityrules</code>
</pre>

If upgrading to 5.3.0+ from a version prior to 5.2.0, delete the following before running the above create commands
<pre>
<code>
kubectl delete clusterrolebinding neuvector-binding-app neuvector-binding-rbac neuvector-binding-admission neuvector-binding-customresourcedefinition neuvector-binding-nvsecurityrules neuvector-binding-view neuvector-binding-nvwafsecurityrules neuvector-binding-nvadmissioncontrolsecurityrules neuvector-binding-nvdlpsecurityrules
kubectl delete rolebinding neuvector-admin -n neuvector
</code>
</pre>
</li>
<li>Run the following commands to check if the neuvector/controller and neuvector/updater service accounts are added successfully.
<pre>
<code>kubectl get ClusterRoleBinding neuvector-binding-app neuvector-binding-rbac neuvector-binding-admission neuvector-binding-customresourcedefinition neuvector-binding-nvsecurityrules neuvector-binding-view neuvector-binding-nvwafsecurityrules neuvector-binding-nvadmissioncontrolsecurityrules neuvector-binding-nvdlpsecurityrules neuvector-binding-csp-usages -o wide</code>
</pre>
Sample output:
<pre>
<code>NAME                                                ROLE                                                            AGE   USERS   GROUPS   SERVICEACCOUNTS
neuvector-binding-app                               ClusterRole/neuvector-binding-app                               56d                    neuvector/controller
neuvector-binding-rbac                              ClusterRole/neuvector-binding-rbac                              34d                    neuvector/controller
neuvector-binding-admission                         ClusterRole/neuvector-binding-admission                         72d                    neuvector/controller
neuvector-binding-customresourcedefinition          ClusterRole/neuvector-binding-customresourcedefinition          72d                    neuvector/controller
neuvector-binding-nvsecurityrules                   ClusterRole/neuvector-binding-nvsecurityrules                   72d                    neuvector/controller
neuvector-binding-view                              ClusterRole/view                                                72d                    neuvector/controller
neuvector-binding-nvwafsecurityrules                ClusterRole/neuvector-binding-nvwafsecurityrules                72d                    neuvector/controller
neuvector-binding-nvadmissioncontrolsecurityrules   ClusterRole/neuvector-binding-nvadmissioncontrolsecurityrules   72d                    neuvector/controller
neuvector-binding-nvdlpsecurityrules                ClusterRole/neuvector-binding-nvdlpsecurityrules                72d                    neuvector/controller
neuvector-binding-csp-usages                        ClusterRole/neuvector-binding-csp-usages                        24d                    neuvector/controller</code>
</pre>
And this command:
<pre>
<code>kubectl get RoleBinding neuvector-binding-scanner -n neuvector -o wide</code>
</pre>
Sample output:
<pre><code>NAME                        ROLE                             AGE   USERS   GROUPS   SERVICEACCOUNTS
neuvector-binding-scanner   Role/neuvector-binding-scanner   70d                    neuvector/updater, neuvector/controller
</code>
</pre>
</li>
<li>(<strong>Optional</strong>) Create the Federation Master and/or Remote Multi-Cluster Management Services. If you plan to use the multi-cluster management functions in NeuVector, one cluster must have the Federation Master service deployed, and each remote cluster must have the Federation Worker service. For flexibility, you may choose to deploy both Master and Worker services on each cluster so any cluster can be a master or remote.
&nbsp;
Federated Cluster Management
<pre>
<code>
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
    app: neuvector-controller-pod</code></pre>
&nbsp; 
Then create the appropriate service(s):
<pre>
<code>
kubectl create -f nv_master_worker.yaml</code></pre>
</li>
<li>Create the primary NeuVector services and pods using the preset version commands or modify the sample yaml below. The preset version invoke a LoadBalancer for the NeuVector Console. If using the sample yaml file below replace the image names and &lt;version> tags for the manager, controller and enforcer image references in the yaml file. Also make any other modifications required for your deployment environment (such as LoadBalancer/NodePort/Ingress for manager access etc).
<pre>
<code>kubectl apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/neuvector-k8s.yaml</code></pre>
Or, if modifying the above yaml:
<pre>
<code>kubectl create -f neuvector.yaml</code></pre>

That's it! You should be able to connect to the NeuVector console and login with admin:admin, e.g. https://&lt;public-ip>:8443


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


<strong>PKS Change</strong>
Note: PKS is field tested and requires enabling privileged containers to the plan/tile, and changing the yaml hostPath as follows for Allinone (if applicable) and Enforcer:
<pre>
<code>      hostPath:
            path: /var/vcap/sys/run/docker/docker.sock</code>
</pre>

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
        - effect: NoSchedule
          key: node-role.kubernetes.io/control-plane
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
kubectl rollout status -n neuvector ds/neuvector-enforcer-pod
kubectl rollout status -n neuvector deployment/neuvector-controller-pod
```

To rollback the update:
```
kubectl rollout undo -n neuvector ds/neuvector-enforcer-pod
kubectl rollout undo -n neuvector deployment/neuvector-controller-pod
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

### Kubernetes Deployment in Non-Privileged Mode
The following instructions can be used to deploy NeuVector without using privileged mode containers. The controller is already in non-privileged mode and enforcer deployment should be changed, which is shown in the excerpted snippets below.


Enforcer:
```
spec:
  template:
    metadata:
      annotations:
        container.apparmor.security.beta.kubernetes.io/neuvector-enforcer-pod: unconfined
        # this line is required to be added if k8s version is pre-v1.19
        # container.seccomp.security.alpha.kubernetes.io/neuvector-enforcer-pod: unconfined
    spec:
      containers:
          securityContext:
            # the following two lines are required for k8s v1.19+. pls comment out both lines if version is pre-1.19. Otherwise, a validating data error message will show
            seccompProfile:
              type: Unconfined
            capabilities:
              add:
              - SYS_ADMIN
              - NET_ADMIN
              - SYS_PTRACE
              - IPC_LOCK
```

The following sample is a complete deployment reference (Kubernetes 1.19+).

```
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
  type: LoadBalancer
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
      serviceAccountName: basic
      serviceAccount: basic
      containers:
        - name: neuvector-manager-pod
          image: neuvector/manager:5.3.0
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
      serviceAccountName: controller
      serviceAccount: controller
      containers:
        - name: neuvector-controller-pod
          image: neuvector/controller:5.3.0
          securityContext:
            runAsUser: 0
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
            # - name: CTRL_PERSIST_CONFIG
            #   value: "1"
          volumeMounts:
            # - mountPath: /var/neuvector
            #   name: nv-share
            #   readOnly: false
            - mountPath: /etc/config
              name: config-volume
              readOnly: true
      terminationGracePeriodSeconds: 300
      restartPolicy: Always
      volumes:
        # - name: nv-share
        #   persistentVolumeClaim:
        #     claimName: neuvector-data
        - name: config-volume
          projected:
            sources:
              - configMap:
                  name: neuvector-init
                  optional: true
              - secret:
                  name: neuvector-init
                  optional: true
              - secret:
                  name: neuvector-secret
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
      annotations:
        container.apparmor.security.beta.kubernetes.io/neuvector-enforcer-pod: unconfined
      # Add the following for pre-v1.19
      # container.seccomp.security.alpha.kubernetes.io/neuvector-enforcer-pod: unconfined
    spec:
      tolerations:
        - effect: NoSchedule
          key: node-role.kubernetes.io/master
        - effect: NoSchedule
          key: node-role.kubernetes.io/control-plane
      hostPID: true
      serviceAccountName: enforcer
      serviceAccount: enforcer
      containers:
        - name: neuvector-enforcer-pod
          image: neuvector/enforcer:5.3.0
          securityContext:
            # the following two lines are required for k8s v1.19+. pls comment out both lines if version is pre-1.19. Otherwise, a validating data error message will show
            seccompProfile:
              type: Unconfined
            capabilities:
              add:
              - SYS_ADMIN
              - NET_ADMIN
              - SYS_PTRACE
              - IPC_LOCK
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
            # - mountPath: /run/runtime.sock
            #   name: runtime-sock
            #   readOnly: true
            # - mountPath: /host/proc
            #   name: proc-vol
            #   readOnly: true
            # - mountPath: /host/cgroup
            #   name: cgroup-vol
            #   readOnly: true
            - mountPath: /var/nv_debug
              name: nv-debug
              readOnly: false
      terminationGracePeriodSeconds: 1200
      restartPolicy: Always
      volumes:
        - name: modules-vol
          hostPath:
            path: /lib/modules
        # - name: runtime-sock
        #   hostPath:
        #     path: /var/run/docker.sock
        #     path: /var/run/containerd/containerd.sock
        #     path: /run/dockershim.sock
        #     path: /run/k3s/containerd/containerd.sock
        #     path: /var/run/crio/crio.sock
        #     path: /var/vcap/sys/run/docker/docker.sock
        # - name: proc-vol
        #   hostPath:
        #     path: /proc
        # - name: cgroup-vol
        #   hostPath:
        #     path: /sys/fs/cgroup
        - name: nv-debug
          hostPath:
            path: /var/nv_debug
---
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
      serviceAccountName: scanner
      serviceAccount: scanner
      containers:
        - name: neuvector-scanner-pod
          image: neuvector/scanner:latest
          imagePullPolicy: Always
          env:
            - name: CLUSTER_JOIN_ADDR
              value: neuvector-svc-controller.neuvector
      restartPolicy: Always
---
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
          serviceAccountName: updater
          serviceAccount: updater
          containers:
          - name: neuvector-updater-pod
            image: neuvector/updater:latest
            imagePullPolicy: Always
            command:
            - /bin/sh
            - -c
            - TOKEN=`cat /var/run/secrets/kubernetes.io/serviceaccount/token`; /usr/bin/curl -kv -X PATCH -H "Authorization:Bearer $TOKEN" -H "Content-Type:application/strategic-merge-patch+json" -d '{"spec":{"template":{"metadata":{"annotations":{"kubectl.kubernetes.io/restartedAt":"'`date +%Y-%m-%dT%H:%M:%S%z`'"}}}}}' 'https://kubernetes.default/apis/apps/v1/namespaces/neuvector/deployments/neuvector-scanner-pod'
          restartPolicy: Never
```
