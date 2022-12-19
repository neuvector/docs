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
<li>neuvector/manager:5.1.0</li>
<li>neuvector/controller:5.1.0</li>
<li>neuvector/enforcer:5.1.0</li>
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
 Note: For OpenShift 4.2+, change docker-registry.default.svc below to image-registry.openshift-image-registry.svc in the commands below
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

5) Grant Service Account Access to the Privileged SCC
```
oc -n neuvector adm policy add-scc-to-user privileged -z default
```
The following info will be added in the Privileged SCC
users:
```
- system:serviceaccount:neuvector:default
```
In OpenShift 4.6+ use the following to check:
```
# oc get rolebinding system:openshift:scc:privileged -n neuvector -o wide
```
```
NAME                              ROLE                                          AGE     USERS   GROUPS   SERVICEACCOUNTS
system:openshift:scc:privileged   ClusterRole/system:openshift:scc:privileged   9m22s                    neuvector/default
```

6) Create the custom resources (CRD) for NeuVector security rules. For OpenShift 4.6+ (Kubernetes 1.19+):
```
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/crd-k8s-1.19.yaml
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/waf-crd-k8s-1.19.yaml
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/dlp-crd-k8s-1.19.yaml
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/admission-crd-k8s-1.19.yaml
```
&nbsp;
For OpenShift 4.5 and earlier (Kubernetes 1.18 and earlier):
```
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/crd-k8s-1.16.yaml
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/waf-crd-k8s-1.16.yaml
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/dlp-crd-k8s-1.16.yaml
oc apply -f https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.0.0/admission-crd-k8s-1.16.yaml
```
&nbsp;

7) Add read permission to access the kubernetes API and OpenShift RBACs. Admission control is supported in OpenShift 3.9+.
```
oc create clusterrole neuvector-binding-app --verb=get,list,watch,update --resource=nodes,pods,services,namespaces
oc create clusterrole neuvector-binding-rbac --verb=get,list,watch --resource=rolebindings.rbac.authorization.k8s.io,roles.rbac.authorization.k8s.io,clusterrolebindings.rbac.authorization.k8s.io,clusterroles.rbac.authorization.k8s.io,imagestreams.image.openshift.io
oc adm policy add-cluster-role-to-user neuvector-binding-app system:serviceaccount:neuvector:default
oc adm policy add-cluster-role-to-user neuvector-binding-rbac system:serviceaccount:neuvector:default
oc create clusterrole neuvector-binding-admission --verb=get,list,watch,create,update,delete --resource=validatingwebhookconfigurations,mutatingwebhookconfigurations
oc adm policy add-cluster-role-to-user neuvector-binding-admission system:serviceaccount:neuvector:default
oc create clusterrole neuvector-binding-customresourcedefinition --verb=watch,create,get,update --resource=customresourcedefinitions
oc adm policy add-cluster-role-to-user neuvector-binding-customresourcedefinition system:serviceaccount:neuvector:default
oc create clusterrole neuvector-binding-nvsecurityrules --verb=list,delete --resource=nvsecurityrules,nvclustersecurityrules
oc adm policy add-cluster-role-to-user neuvector-binding-nvsecurityrules system:serviceaccount:neuvector:default
oc adm policy add-cluster-role-to-user view system:serviceaccount:neuvector:default --rolebinding-name=neuvector-binding-view
oc adm policy add-role-to-user admin system:serviceaccount:neuvector:default -n neuvector --rolebinding-name=neuvector-admin
oc create clusterrole neuvector-binding-nvwafsecurityrules --verb=list,delete --resource=nvwafsecurityrules
oc adm policy add-cluster-role-to-user neuvector-binding-nvwafsecurityrules system:serviceaccount:neuvector:default
oc create clusterrole neuvector-binding-nvadmissioncontrolsecurityrules --verb=list,delete --resource=nvadmissioncontrolsecurityrules
oc adm policy add-cluster-role-to-user neuvector-binding-nvadmissioncontrolsecurityrules system:serviceaccount:neuvector:default
oc create clusterrole neuvector-binding-nvdlpsecurityrules --verb=list,delete --resource=nvdlpsecurityrules
oc adm policy add-cluster-role-to-user neuvector-binding-nvdlpsecurityrules system:serviceaccount:neuvector:default
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
oc get ClusterRoleBinding neuvector-binding-app neuvector-binding-rbac neuvector-binding-admission neuvector-binding-customresourcedefinition neuvector-binding-nvsecurityrules neuvector-binding-view -o wide
```
Sample output:
```
NAME                                         ROLE                                          USERS     GROUPS    SERVICE ACCOUNTS    SUBJECTS
neuvector-binding-app                        /neuvector-binding-app                                            neuvector/default
neuvector-binding-rbac                       /neuvector-binding-rbac                                           neuvector/default
neuvector-binding-admission                  /neuvector-binding-admission                                      neuvector/default
neuvector-binding-customresourcedefinition   /neuvector-binding-customresourcedefinition                       neuvector/default
neuvector-binding-nvsecurityrules            /neuvector-binding-nvsecurityrules                                neuvector/default
neuvector-binding-nvwafsecurityrules         /neuvector-binding-nvwafsecurityrules                             neuvector/default
neuvector-binding-nvadmissioncontrolsecurityrules /neuvector-binding-nvadmissioncontrolsecurityrules           neuvector/default
neuvector-binding-nvdlpsecurityrules         /neuvector-binding-nvdlpsecurityrules                             neuvector/default
neuvector-binding-view                       /neuvector-binding-view                                           neuvector/default
```

9) (<strong>Optional</strong>) Create the Federation Master and/or Remote Multi-Cluster Management Services. If you plan to use the multi-cluster management functions in NeuVector, one cluster must have the Federation Master service deployed, and each remote cluster must have the Federation Worker service. For flexibility, you may choose to deploy both Master and Worker services on each cluster so any cluster can be a master or remote.
<html>
<head>
<link rel="stylesheet" href="/serverless/toggle-box.css" type="text/css" />
</head>
<body>
<div id="full-wrapper">
  <ul class="dopt-accordion fixed-height arrow-tri">  

<!-- NOTE: Toggle Box #0.9 -->
	<input class="title-option" id="acc090" name="accordion-1" type="checkbox" />
  <label class="title-panel" onClick="" for="acc090"><span><i class="icon-code"></i>View Multi-Cluster Management Services</span></label>
  <!-- NOTE: Toggle box content animation option -->
  <div class="accordion-content animated animation5">
  <div class="wrap-content">
```
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
```
  </div><!-- End .wrap-content -->    
  </div><!-- End .accordion-content -->
  </li>
</div>
&nbsp;
</body>
</html>
&nbsp; 
Then create the appropriate service(s):
```
oc create -f nv_master_worker.yaml
```

10) Add support for Admission Control (OpenShift 3.9-3.11 only, this is not required in 4.2+)

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

If you have created your own namespace instead of using “neuvector”, replace all instances of “namespace: neuvector” and other namespace references with your namespace in the sample yaml files below.

<strong>OpenShift 4.2+ with CRI-O run-time</strong>

The name of your default OpenShift registry might have changed from docker-registry to openshift-image-registry. You may need to change the image registry for the manager, controller, and enforcer in the sample yaml. Note: Type NodePort is used for the fed-master and fed-worker services instead of LoadBalancer. You may need to adjust for your deployment.

If using the CRI-O run-time, see the CRI-O sample below for the change made to the volumeMounts for controller and enforcer pods:
```
            - mountPath: /var/run/crio/crio.sock
              name: runtime-sock
              readOnly: true
```
Also change the volumes from docker.sock to:
```
       - name: runtime-sock
          hostPath:
            path: /var/run/crio/crio.sock
```

<html>
<head>
<link rel="stylesheet" href="/deploying/kubernetes/toggle-box.css" type="text/css" />
</head>
<body>
<div id="full-wrapper">


<!-- NOTE: ENTER CONTENT FOR TOGGLE BOXES HERE -->

  <div><h3 class="section"><span class="section">OpenShift Deployment Examples for NeuVector</span></h3></div>
<!-- seperator -->

  <div class="myspacer">

<!-- NOTE: Set styling for toggle boxes here (theme, arrow style, height, etc.) 
    Examples for alternate themes, arrow styles:
    <ul class="dopt-accordion green fixed-height arrow-tri"> 
    <ul class="dopt-accordion modern-theme turqoisesh arrow-plus">
    <ul class="dopt-accordion modern-theme cool-blue arrow-img">
    <ul class="dopt-accordion fixed-height arrow-tri"> 
-->
  <ul class="dopt-accordion fixed-height arrow-tri">  

<!-- NOTE: Toggle Box #1, change acc1 to acc2 in two places, leave name when copying more toggle boxes -->
<li>
	<input class="title-option" id="acc1" name="accordion-1" type="checkbox" />
  <label class="title-panel" onClick="" for="acc1"><span><i class="icon-code"></i>OpenShift 4.2+ with CRI-O Runtime Sample File</span></label>

  <!-- NOTE: Toggle box content animation option -->
  <div class="accordion-content animated animation5">

  <div class="wrap-content">
<pre><code>
# neuvector yaml version for NeuVector 5.x.x on CRI-O
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
          # 4.2+, change docker-registry.default.svc below to image-registry.openshift-image-registry.svc
          image: docker-registry.default.svc:5000/neuvector/manager:&#60;version&#62;
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
          # 4.2+, change docker-registry.default.svc below to image-registry.openshift-image-registry.svc
          image: docker-registry.default.svc:5000/neuvector/controller:&#60;version&#62;
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
            - mountPath: /var/run/crio/crio.sock
              name: runtime-sock
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
        - name: runtime-sock
          hostPath:
            path: /var/run/crio/crio.sock
        - name: proc-vol
          hostPath:
            path: /proc
        - name: cgroup-vol
          hostPath:
            path: /sys/fs/cgroup
        - name: config-volume
          projected:
            sources:
              - configMap:
                  name: neuvector-init
                  optional: true
              - secret:
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
        - effect: NoSchedule
          key: node-role.kubernetes.io/control-plane
      hostPID: true
      containers:
        - name: neuvector-enforcer-pod
          # 4.2+, change docker-registry.default.svc below to image-registry.openshift-image-registry.svc
          image: docker-registry.default.svc:5000/neuvector/enforcer:&#60;version&#62;
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
            - mountPath: /var/run/crio/crio.sock
              name: runtime-sock
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
        - name: runtime-sock
          hostPath:
            path: /var/run/crio/crio.sock
        - name: proc-vol
          hostPath:
            path: /proc
        - name: cgroup-vol
          hostPath:
            path: /sys/fs/cgroup

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
      containers:
        - name: neuvector-scanner-pod
          image: docker-registry.default.svc:5000/neuvector/scanner
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
          containers:
          - name: neuvector-updater-pod
            image: docker-registry.default.svc:5000/neuvector/updater
            imagePullPolicy: Always
            command:
            - /bin/sh
            - -c
            - TOKEN=`cat /var/run/secrets/kubernetes.io/serviceaccount/token`; /usr/bin/curl -kv -X PATCH -H "Authorization:Bearer $TOKEN" -H "Content-Type:application/strategic-merge-patch+json" -d '{"spec":{"template":{"metadata":{"annotations":{"kubectl.kubernetes.io/restartedAt":"'`date +%Y-%m-%dT%H:%M:%S%z`'"}}}}}' 'https://kubernetes.default/apis/apps/v1/namespaces/neuvector/deployments/neuvector-scanner-pod'
            env:
              - name: CLUSTER_JOIN_ADDR
                value: neuvector-svc-controller.neuvector
          restartPolicy: Never</code></pre>
  </div><!-- End .wrap-content -->    
  </div><!-- End .accordion-content -->
  </li>

<!-- NOTE: Toggle Box #2, change acc1 to acc2 in two places, leave name when copying more toggle boxes -->
<li>
	<input class="title-option" id="acc2" name="accordion-1" type="checkbox" />
  <label class="title-panel" onClick="" for="acc2"><span><i class="icon-code"></i>OpenShift 3.9-4.2+ with <strong>docker</strong> runtime</span></label>

  <!-- NOTE: Toggle box content animation option -->
  <div class="accordion-content animated animation5">

  <div class="wrap-content">
<pre><code>
# neuvector yaml version for NeuVector 4.x.x on docker runtime, it will also work for 3.x.x
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
          # 4.2+, change docker-registry.default.svc below to image-registry.openshift-image-registry.svc
          image: docker-registry.default.svc:5000/neuvector/manager:&#60;version&#62;
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
          # 4.2+, change docker-registry.default.svc below to image-registry.openshift-image-registry.svc
          image: docker-registry.default.svc:5000/neuvector/controller:&#60;version&#62;
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
          projected:
            sources:
              - configMap:
                  name: neuvector-init
                  optional: true
              - secret:
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
        - effect: NoSchedule
          key: node-role.kubernetes.io/control-plane
      hostPID: true
      containers:
        - name: neuvector-enforcer-pod
          # 4.2+, change docker-registry.default.svc below to image-registry.openshift-image-registry.svc
          image: docker-registry.default.svc:5000/neuvector/enforcer:&#60;version&#62;
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
      containers:
        - name: neuvector-scanner-pod
          image: docker-registry.default.svc:5000/neuvector/scanner
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
          containers:
          - name: neuvector-updater-pod
            image: docker-registry.default.svc:5000/neuvector/updater
            imagePullPolicy: Always
            command:
            - /bin/sh
            - -c
            - TOKEN=`cat /var/run/secrets/kubernetes.io/serviceaccount/token`; /usr/bin/curl -kv -X PATCH -H "Authorization:Bearer $TOKEN" -H "Content-Type:application/strategic-merge-patch+json" -d '{"spec":{"template":{"metadata":{"annotations":{"kubectl.kubernetes.io/restartedAt":"'`date +%Y-%m-%dT%H:%M:%S%z`'"}}}}}' 'https://kubernetes.default/apis/apps/v1/namespaces/neuvector/deployments/neuvector-scanner-pod'
            env:
              - name: CLUSTER_JOIN_ADDR
                value: neuvector-svc-controller.neuvector
          restartPolicy: Never</code></pre>
  </div><!-- End .wrap-content -->    
  </div><!-- End .accordion-content -->
  </li>

<!-- Final closing at end of all accordion boxes -->
  </div><!-- .myspacer --> 
</div><!-- #full-wrapper -->
&nbsp;
</body>
</html>


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
The following instructions can be used to deploy NeuVector without using privileged mode containers. The controller and enforcer deployments should be changed, which is shown in the excerpted snippets below.

Controller:
```
spec:
  template:
    metadata:
      ...
      annotations:
        container.apparmor.security.beta.kubernetes.io/neuvector-controller-pod: unconfined
       # this line below is required to be added if k8s version is pre-v1.19
       # container.seccomp.security.alpha.kubernetes.io/neuvector-controller-pod: unconfined
    spec:
	  # hostPID is required for controller if openshift version is pre-v4.5 but not for version 3.x
      # hostPID: true
      containers:
        ...
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
# neuvector yaml version for NeuVector 5.x.x on cri-o oc version 4.2+
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
          # 4.2+, change docker-registry.default.svc below to image-registry.openshift-image-registry.svc
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
      annotations:
        container.apparmor.security.beta.kubernetes.io/neuvector-controller-pod: unconfined
      # this line below is required to be added if k8s version is pre-v1.19
      # container.seccomp.security.alpha.kubernetes.io/neuvector-controller-pod: unconfined
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
      # hostPID is required for controller if openshift version is pre-v4.5
      # hostPID: true
      containers:
        - name: neuvector-controller-pod
          # 4.2+, change docker-registry.default.svc below to image-registry.openshift-image-registry.svc
          image: docker-registry.default.svc:5000/neuvector/controller:<version>
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
            - mountPath: /var/run/crio/crio.sock
              name: runtime-sock
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
        - name: runtime-sock
          hostPath:
            path: /var/run/crio/crio.sock
        - name: proc-vol
          hostPath:
            path: /proc
        - name: cgroup-vol
          hostPath:
            path: /sys/fs/cgroup
        - name: config-volume
          projected:
            sources:
              - configMap:
                  name: neuvector-init
                  optional: true
              - secret:
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
      annotations:
        container.apparmor.security.beta.kubernetes.io/neuvector-controller-pod: unconfined
      # this line below is required to be added if k8s version is pre-v1.19
      # container.seccomp.security.alpha.kubernetes.io/neuvector-controller-pod: unconfined
    spec:
      tolerations:
        - effect: NoSchedule
          key: node-role.kubernetes.io/master
        - effect: NoSchedule
          key: node-role.kubernetes.io/control-plane
      hostPID: true
      containers:
        - name: neuvector-enforcer-pod
          # 4.2+, change docker-registry.default.svc below to image-registry.openshift-image-registry.svc
          image: docker-registry.default.svc:5000/neuvector/enforcer:<version>
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
            - mountPath: /var/run/crio/crio.sock
              name: runtime-sock
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
        - name: runtime-sock
          hostPath:
            path: /var/run/crio/crio.sock
        - name: proc-vol
          hostPath:
            path: /proc
        - name: cgroup-vol
          hostPath:
            path: /sys/fs/cgroup

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
      containers:
        - name: neuvector-scanner-pod
          image: docker-registry.default.svc:5000/neuvector/scanner
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
          containers:
          - name: neuvector-updater-pod
            image: docker-registry.default.svc:5000/neuvector/updater
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
