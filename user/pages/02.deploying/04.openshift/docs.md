---
title: RedHat OpenShift 
taxonomy:
    category: docs
---

### Deploy Separate NeuVector Components with RedHat OpenShift
NeuVector is compatible with standard ovs SDN plug-ins as well as others such as flannel, weave, or calico. The samples below assume a standard ovs plug-in is used. This also assumes a local docker registry will be used (see instructions at end for creating the secret for dynamically pulling from neuvector or Docker Hub).

NeuVector supports Helm-based deployment with a [Helm chart](https://github.com/neuvector/neuvector-helm) at https://github.com/neuvector/neuvector-helm. The NeuVector Operator can also be used to deploy and is based on the Helm chart. To deploy the latest NeuVector container versions using an Operator, please use either the Red Hat Certified Operator from Operator Hub or the community operator, as detailed in the [Operator section](/deploying/production/operators).

To deploy manually, first pull the appropriate NeuVector containers from the NeuVector registry into your local registry. Note: the scanner image should be pulled regularly for CVE database updates from NeuVector.

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

###Deploy on OpenShift

```
docker login docker.io
docker pull docker.io/neuvector/manager:<version>
docker pull docker.io/neuvector/controller:<version>
docker pull docker.io/neuvector/enforcer:<version>
docker pull docker.io/neuvector/scanner
docker pull docker.io/neuvector/updater
docker logout docker.io
```

The sample file below will deploy one manager, 3 controllers, and 2 scanner pods. It will deploy an enforcer on every node as a daemonset, including on the master node (if schedulable). See the bottom section for specifying dedicated manager or controller nodes using node labels. Note: It is not recommended to deploy (scale) more than one manager behind a load balancer due to potential session state issues. If you plan to use a PersistentVolume claim to store the backup of NeuVector config files, please see the general Backup/Persistent Data section in the [Production Deployment](/deploying/production#backups-and-persistent-data) overview.


Next, set the route and allow privileged NeuVector containers using the instructions below. By default, OpenShift does not allow privileged containers. Also, by default OpenShift does not schedule pods on the Master node. See the instructions at the end to enable/disable this.

NOTE: Please see the Enterprise Integration section for details on integration with OpenShift Role Based Access Controls (RBACs). 


1) Login as a normal user
```
oc login -u <user_name>
```

2) Create a new project.
 Note: If the --node-selector argument is used when creating a project this will restrict pod placement such as for the NeuVector enforcer to specific nodes.
```
oc new-project neuvector
```

3) Push NeuVector images to OpenShift docker registry. 
 Note: For OpenShift 4.6+, change docker-registry.default.svc below to image-registry.openshift-image-registry.svc in the commands below
```
docker login -u <user_name> -p `oc whoami -t` docker-registry.default.svc:5000
docker tag docker.io/neuvector/enforcer:<version> docker-registry.default.svc:5000/neuvector/enforcer:<version>
docker tag docker.io/neuvector/controller:<version> docker-registry.default.svc:5000/neuvector/controller:<version>
docker tag docker.io/neuvector/manager:<version> docker-registry.default.svc:5000/neuvector/manager:<version>
docker tag docker.io/neuvector/scanner docker-registry.default.svc:5000/neuvector/scanner
docker tag docker.io/neuvector/updater docker-registry.default.svc:5000/neuvector/updater
docker push docker-registry.default.svc:5000/neuvector/enforcer:<version>
docker push docker-registry.default.svc:5000/neuvector/controller:<version>
docker push docker-registry.default.svc:5000/neuvector/manager:<version>
docker push docker-registry.default.svc:5000/neuvector/scanner
docker push docker-registry.default.svc:5000/neuvector/updater
docker logout docker-registry.default.svc:5000
```

Note: Please see the section Updating the CVE Database below for recommendations for keeping the latest scanner image updated in your registry.

4) Login as system:admin account
```
oc login -u system:admin
```

5) Create Service Accounts and Grant Access to the Privileged SCC
```
oc create sa controller -n neuvector
oc create sa enforcer -n neuvector
oc create sa basic -n neuvector
oc create sa updater -n neuvector
oc create sa scanner -n neuvector
oc create sa registry-adapter -n neuvector
oc -n neuvector adm policy add-scc-to-user privileged -z enforcer
```

The following info will be added in the Privileged SCC
users:
```
- system:serviceaccount:neuvector:enforcer

```
Add a new neuvector-scc-controller scc for controller service account in Openshift, by creating a file with:
```
allowHostDirVolumePlugin: false
allowHostIPC: false
allowHostNetwork: false
allowHostPID: false
allowHostPorts: false
allowPrivilegeEscalation: false
allowPrivilegedContainer: false
allowedCapabilities: null
apiVersion: security.openshift.io/v1
defaultAddCapabilities: null
fsGroup:
  type: RunAsAny
groups: []
kind: SecurityContextConstraints
metadata:
  name: neuvector-scc-controller
priority: null
readOnlyRootFilesystem: false
requiredDropCapabilities:
- ALL
runAsUser:
  type: RunAsAny
seLinuxContext:
  type: RunAsAny
supplementalGroups:
  type: RunAsAny
users: []
volumes:
- configMap
- downwardAPI
- emptyDir
- persistentVolumeClaim
- azureFile
- projected
- secret
```
Then apply
```
oc apply -f (filename)
```

Then run the following command to bind controller service account to neuvector-scc-controller scc
```
oc -n neuvector adm policy add-scc-to-user neuvector-scc-controller -z controller
```
In OpenShift 4.6+ use the following to check:
```
# oc get rolebinding system:openshift:scc:privileged -n neuvector -o wide
```
```
NAME                              ROLE                                          AGE     USERS   GROUPS   SERVICEACCOUNTS
system:openshift:scc:privileged   ClusterRole/system:openshift:scc:privileged   9m22s                    neuvector/enforcer
```
Run this command to check NeuVector service for Controller:
```
oc get rolebinding system:openshift:scc:neuvector-scc-controller n neuvector -o wide
```
The output will look like
```
NAME                                            ROLE                                                        AGE     USERS   GROUPS   SERVICEACCOUNTS
System:openshift:scc:neuvector-scc-controller   ClusterRole/system:openshift:scc:neuvector-scc-controller   9m22s                    neuvector/controller
```

6) Create the custom resources (CRD) for NeuVector security rules. For OpenShift 4.6+ (Kubernetes 1.19+):
```
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/crd-k8s-1.19.yaml
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/waf-crd-k8s-1.19.yaml
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/dlp-crd-k8s-1.19.yaml
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/com-crd-k8s-1.19.yaml
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/vul-crd-k8s-1.19.yaml
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/admission-crd-k8s-1.19.yaml
```
&nbsp;

7) Add read permission to access the kubernetes API and OpenShift RBACs. IMPORTANT: The standard NeuVector 5.2+ deployment uses least-privileged service accounts instead of the default. See below if upgrading to 5.2+ from a version prior to 5.2.

```
oc create clusterrole neuvector-binding-app --verb=get,list,watch,update --resource=nodes,pods,services,namespaces
oc create clusterrole neuvector-binding-rbac --verb=get,list,watch --resource=rolebindings.rbac.authorization.k8s.io,roles.rbac.authorization.k8s.io,clusterrolebindings.rbac.authorization.k8s.io,clusterroles.rbac.authorization.k8s.io,imagestreams.image.openshift.io
oc adm policy add-cluster-role-to-user neuvector-binding-app system:serviceaccount:neuvector:controller
oc adm policy add-cluster-role-to-user neuvector-binding-rbac system:serviceaccount:neuvector:controller
oc create clusterrole neuvector-binding-admission --verb=get,list,watch,create,update,delete --resource=validatingwebhookconfigurations,mutatingwebhookconfigurations
oc adm policy add-cluster-role-to-user neuvector-binding-admission system:serviceaccount:neuvector:controller
oc create clusterrole neuvector-binding-customresourcedefinition --verb=watch,create,get,update --resource=customresourcedefinitions
oc adm policy add-cluster-role-to-user neuvector-binding-customresourcedefinition system:serviceaccount:neuvector:controller
oc create clusterrole neuvector-binding-nvsecurityrules --verb=get,list,delete --resource=nvsecurityrules,nvclustersecurityrules
oc create clusterrole neuvector-binding-nvadmissioncontrolsecurityrules --verb=get,list,delete --resource=nvadmissioncontrolsecurityrules
oc create clusterrole neuvector-binding-nvdlpsecurityrules --verb=get,list,delete --resource=nvdlpsecurityrules
oc create clusterrole neuvector-binding-nvwafsecurityrules --verb=get,list,delete --resource=nvwafsecurityrules
oc adm policy add-cluster-role-to-user neuvector-binding-nvsecurityrules system:serviceaccount:neuvector:controller
oc adm policy add-cluster-role-to-user view system:serviceaccount:neuvector:controller --rolebinding-name=neuvector-binding-view
oc adm policy add-cluster-role-to-user neuvector-binding-nvwafsecurityrules system:serviceaccount:neuvector:controller
oc adm policy add-cluster-role-to-user neuvector-binding-nvadmissioncontrolsecurityrules system:serviceaccount:neuvector:controller
oc adm policy add-cluster-role-to-user neuvector-binding-nvdlpsecurityrules system:serviceaccount:neuvector:controller
oc create role neuvector-binding-scanner --verb=get,patch,update,watch --resource=deployments -n neuvector
oc adm policy add-role-to-user neuvector-binding-scanner system:serviceaccount:neuvector:updater system:serviceaccount:neuvector:controller -n neuvector --role-namespace neuvector
oc create clusterrole neuvector-binding-csp-usages --verb=get,create,update,delete --resource=cspadapterusagerecords
oc adm policy add-cluster-role-to-user neuvector-binding-csp-usages system:serviceaccount:neuvector:controller
oc create clusterrole neuvector-binding-co --verb=get,list --resource=clusteroperators
oc adm policy add-cluster-role-to-user neuvector-binding-co system:serviceaccount:neuvector:enforcer system:serviceaccount:neuvector:controller
oc create role neuvector-binding-secret --verb=get --resource=secrets -n neuvector
oc adm policy add-role-to-user neuvector-binding-secret system:serviceaccount:neuvector:controller -n neuvector --role-namespace neuvector
oc create clusterrole neuvector-binding-nvcomplianceprofiles --verb=get,list,delete --resource=nvcomplianceprofiles
oc create clusterrolebinding neuvector-binding-nvcomplianceprofiles --clusterrole=neuvector-binding-nvcomplianceprofiles --serviceaccount=neuvector:controller
oc create clusterrole neuvector-binding-nvvulnerabilityprofiles --verb=get,list,delete --resource=nvvulnerabilityprofiles
oc create clusterrolebinding neuvector-binding-nvvulnerabilityprofiles --clusterrole=neuvector-binding-nvvulnerabilityprofiles --serviceaccount=neuvector:controller
```
If upgrading to 5.3.0+ from 5.2.0+, run the following before running the above commands
```
oc delete clusterrole neuvector-binding-nvsecurityrules neuvector-binding-nvadmissioncontrolsecurityrules neuvector-binding-nvdlpsecurityrules neuvector-binding-nvwafsecurityrules
```

If upgrading to 5.3.0+ from a versions prior to 5.2.0, you will need to delete the old bindings, then create new ones:
```
oc delete clusterrolebinding neuvector-binding-app neuvector-binding-rbac neuvector-binding-admission neuvector-binding-customresourcedefinition neuvector-binding-nvsecurityrules neuvector-binding-view neuvector-binding-nvwafsecurityrules neuvector-binding-nvadmissioncontrolsecurityrules neuvector-binding-nvdlpsecurityrules neuvector-binding-co
oc delete rolebinding neuvector-admin -n neuvector
oc create clusterrole neuvector-binding-nvsecurityrules --verb=get,list,delete --resource=nvsecurityrules,nvclustersecurityrules
oc create clusterrole neuvector-binding-nvadmissioncontrolsecurityrules --verb=get,list,delete --resource=nvadmissioncontrolsecurityrules
oc create clusterrole neuvector-binding-nvdlpsecurityrules --verb=get,list,delete --resource=nvdlpsecurityrules
oc create clusterrole neuvector-binding-nvwafsecurityrules --verb=get,list,delete --resource=nvwafsecurityrules
oc adm policy add-cluster-role-to-user neuvector-binding-app system:serviceaccount:neuvector:controller
oc adm policy add-cluster-role-to-user neuvector-binding-rbac system:serviceaccount:neuvector:controller
oc adm policy add-cluster-role-to-user neuvector-binding-admission system:serviceaccount:neuvector:controller
oc adm policy add-cluster-role-to-user neuvector-binding-customresourcedefinition system:serviceaccount:neuvector:controller
oc adm policy add-cluster-role-to-user neuvector-binding-nvsecurityrules system:serviceaccount:neuvector:controller
oc adm policy add-cluster-role-to-user view system:serviceaccount:neuvector:controller --rolebinding-name=neuvector-binding-view
oc adm policy add-cluster-role-to-user neuvector-binding-nvwafsecurityrules system:serviceaccount:neuvector:controller
oc adm policy add-cluster-role-to-user neuvector-binding-nvadmissioncontrolsecurityrules system:serviceaccount:neuvector:controller
oc adm policy add-cluster-role-to-user neuvector-binding-nvdlpsecurityrules system:serviceaccount:neuvector:controller
oc create role neuvector-binding-scanner --verb=get,patch,update,watch --resource=deployments -n neuvector
oc adm policy add-role-to-user neuvector-binding-scanner system:serviceaccount:neuvector:updater system:serviceaccount:neuvector:controller -n neuvector --role-namespace neuvector
oc create clusterrole neuvector-binding-csp-usages --verb=get,create,update,delete --resource=cspadapterusagerecords
oc adm policy add-cluster-role-to-user neuvector-binding-csp-usages system:serviceaccount:neuvector:controller
oc adm policy add-cluster-role-to-user neuvector-binding-co system:serviceaccount:neuvector:enforcer system:serviceaccount:neuvector:controller
```

8) Run the following command to check if the neuvector/controller, neuvector/enforcer and neuvector/updater service accounts are added successfully.
```
oc get ClusterRoleBinding neuvector-binding-app neuvector-binding-rbac neuvector-binding-admission neuvector-binding-customresourcedefinition neuvector-binding-nvsecurityrules neuvector-binding-view neuvector-binding-nvwafsecurityrules neuvector-binding-nvadmissioncontrolsecurityrules neuvector-binding-nvdlpsecurityrules neuvector-binding-csp-usages neuvector-binding-co -o wide
```
Sample output:
```
NAME                                                ROLE                                                            AGE   USERS   GROUPS   SERVICEACCOUNTS
neuvector-binding-app                               ClusterRole/neuvector-binding-app                               56d                    neuvector/controller
neuvector-binding-rbac                              ClusterRole/neuvector-binding-rbac                              34d                    neuvector/controller
neuvector-binding-admission                         ClusterRole/neuvector-binding-admission                         72d                    neuvector/controller
neuvector-binding-customresourcedefinition          ClusterRole/neuvector-binding-customresourcedefinition          72d                    neuvector/controller
neuvector-binding-nvsecurityrules                   ClusterRole/neuvector-binding-nvsecurityrules                   72d                    neuvector/controller
neuvector-binding-view                              ClusterRole/view                                                72d                    neuvector/controller
neuvector-binding-nvwafsecurityrules                ClusterRole/neuvector-binding-nvwafsecurityrules                72d                    neuvector/controller
neuvector-binding-nvadmissioncontrolsecurityrules   ClusterRole/neuvector-binding-nvadmissioncontrolsecurityrules   72d                    neuvector/controller
neuvector-binding-nvdlpsecurityrules                ClusterRole/neuvector-binding-nvdlpsecurityrules                72d                    neuvector/controller
neuvector-binding-csp-usages                        ClusterRole/neuvector-binding-csp-usages                        24d                    neuvector/controller
neuvector-binding-co                                ClusterRole/neuvector-binding-co                                72d                    neuvector/enforcer, neuvector/controller
```

And this command:
```
oc get RoleBinding neuvector-binding-scanner -n neuvector -o wide
```
Sample output:
```
NAME                        ROLE                             AGE   USERS   GROUPS   SERVICEACCOUNTS
neuvector-binding-scanner   Role/neuvector-binding-scanner   70d                    neuvector/updater, neuvector/controller
```

9) (<strong>Optional</strong>) Create the Federation Master and/or Remote Multi-Cluster Management Services. If you plan to use the multi-cluster management functions in NeuVector, one cluster must have the Federation Master service deployed, and each remote cluster must have the Federation Worker service. For flexibility, you may choose to deploy both Master and Worker services on each cluster so any cluster can be a master or remote.
&nbsp;
Federated Management Services
<pre><code>
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
    app: neuvector-controller-pod</code></pre>
&nbsp; 
Then create the appropriate service(s):
```
oc create -f nv_master_worker.yaml
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

If you have created your own namespace instead of using “neuvector”, replace all instances of “namespace: neuvector” and other namespace references with your namespace in the sample yaml files below.

<strong>OpenShift 4.6+ with CRI-O run-time</strong>

The name of your default OpenShift registry might have changed from docker-registry to openshift-image-registry. You may need to change the image registry for the manager, controller, and enforcer in the sample yaml. Note: Type NodePort is used for the fed-master and fed-worker services instead of LoadBalancer. You may need to adjust for your deployment.

If using the CRI-O run-time, see this [CRI-O sample](https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.3.0/neuvector-crio-oc.yaml)


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
        - effect: NoSchedule
          key: node-role.kubernetes.io/control-plane
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

### Updating the CVE Database on OpenShift Deployments
The latest scanner image always contains the most recent CVE database update from NeuVector. For this reason, a version tag is not recommended when pulling the image. However, updating the CVE database requires regular pulling of the latest scanner image so the updater cron job can redeploy the scanner(s).  The samples above assume NeuVector images are pulled, tagged and pushed to a local OpenShift registry. Deployment is then from this registry instead of directly from neuvector (or the legacy NeuVector registry on docker hub). 

To regularly update the CVE database, we recommend a script/cron job be created to pull the latest NeuVector scanner image and perform the tagging and pushing steps to the local registry. This will ensure the CVE database is being updated regularly and images and containers are being scanned for new vulnerabilities.


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

The provided sample deployment yamls already configure the rolling update policy. If you are updating via the NeuVector Helm chart, please pull the latest chart to properly configure new features such as admission control, and delete the old cluster role and cluster role binding for NeuVector.


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


### OpenShift Deployment in Non-Privileged Mode
The following instructions can be used to deploy NeuVector without using privileged mode containers. The controller is already in non-privileged mode and the enforcer deployment should be changed, which is shown in the excerpted snippets below.


Enforcer:
```
spec:
  template:
    metadata:
      annotations:
        container.apparmor.security.beta.kubernetes.io/neuvector-enforcer-pod: unconfined
      # this line below is required to be added if k8s version is pre-v1.19
      # container.seccomp.security.alpha.kubernetes.io/neuvector-enforcer-pod: unconfined
    spec:
      containers:
          securityContext:
            # openshift
            seLinuxOptions:
              type: unconfined_t
            # the following two lines are required for k8s v1.19+. pls comment out both lines if version is pre-1.19. Otherwise, a validating data error message will show
            seccompProfile:
              type: Unconfined
            capabilities:
              add:
              - SYS_ADMIN
              - NET_ADMIN
              - SYS_PTRACE
              - IPC_LOCK
              - NET_RAW
              - SYS_CHROOT
              - MKNOD
              - AUDIT_WRITE
              - SETFCAP
```

The following sample is a complete deployment reference using the cri-o run-time. For other run-times please make the appropriate changes to the volumes/volume mounts for the crio.sock.
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

apiVersion: route.openshift.io/v1
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
      serviceAccountName: basic
      serviceAccount: basic
      containers:
        - name: neuvector-manager-pod
          image: image-registry.openshift-image-registry.svc:5000/neuvector/manager:<version>
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
          image: image-registry.openshift-image-registry.svc:5000/neuvector/controller:<version>
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
          image: image-registry.openshift-image-registry.svc:5000/neuvector/enforcer:<version>
          securityContext:
            # openshift
            seLinuxOptions:
              type: unconfined_t
            # the following two lines are required for k8s v1.19+. pls comment out both lines if version is pre-1.19. Otherwise, a validating data error message will show
            seccompProfile:
              type: Unconfined
            capabilities:
              add:
              - SYS_ADMIN
              - NET_ADMIN
              - SYS_PTRACE
              - IPC_LOCK
              - NET_RAW
              - SYS_CHROOT
              - MKNOD
              - AUDIT_WRITE
              - SETFCAP
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
        #     path: /var/run/crio/crio.sock
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
          image: image-registry.openshift-image-registry.svc:5000/neuvector/scanner:<version>
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
            image: image-registry.openshift-image-registry.svc:5000/neuvector/updater:<version>
            imagePullPolicy: Always
            command:
            - /bin/sh
            - -c
            - TOKEN=`cat /var/run/secrets/kubernetes.io/serviceaccount/token`; /usr/bin/curl -kv -X PATCH -H "Authorization:Bearer $TOKEN" -H "Content-Type:application/strategic-merge-patch+json" -d '{"spec":{"template":{"metadata":{"annotations":{"kubectl.kubernetes.io/restartedAt":"'`date +%Y-%m-%dT%H:%M:%S%z`'"}}}}}' 'https://kubernetes.default/apis/apps/v1/namespaces/neuvector/deployments/neuvector-scanner-pod'
          restartPolicy: Never
```
