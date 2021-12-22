---
title: Example: OpenShift
taxonomy:
    category: docs
---


### Deploy Using RedHat OpenShift
NeuVector is compatible with standard ovs SDN plug-ins as well as others such as flannel, weave, or calico. The samples below assume a standard ovs plug-in is used. This also assumes a local docker registry will be used (see instructions at end for creating the secret for dynamically pulling from Docker Hub). The default yaml deployment deploys one allinone on a labeled node and enforcers on all others, including the master. 

First, pull the appropriate NeuVector containers from the NeuVector private registry into your local registry.

```
docker login docker.io
docker pull docker.io/neuvector/allinone
docker pull docker.io/neuvector/enforcer
docker logout docker.io
```


Next, tag/push the containers, set the route and allow privileged NeuVector containers using the instructions below. By default, OpenShift does not allow privileged containers. Also, by default OpenShift does not schedule pods on the Master node. See the instructions at the end to enable/disable this.


NOTE: Please see the Enterprise Integration section for details on integration with OpenShift Role Based Access Controls (RBACs). 

1. Login as a normal user
```
oc login -u <user_name>
```

2. Create a new project
Note: If the --node-selector argument is used when creating a project this will restrict pod placement such as for the Neuvector enforcer to specific nodes.
```
oc new-project neuvector
```

3. Push NeuVector images to OpenShift docker registry. IMPORTANT! The docker login below is for the docker-registry (not to be confused with the oc login above), and requires the user/authentication token in the command.

Note: For OpenShift 4.2+, you might need to change the default registry from docker-registry.default.svc:5000 to image-registry.openshift-image-registry.svc:5000 in the commands below.
```
docker login -u <user_name> -p `oc whoami -t` docker-registry.default.svc:5000
docker tag docker.io/neuvector/allinone docker-registry.default.svc:5000/neuvector/allinone
docker tag docker.io/neuvector/enforcer docker-registry.default.svc:5000/neuvector/enforcer
docker push docker-registry.default.svc:5000/neuvector/allinone
docker push docker-registry.default.svc:5000/neuvector/enforcer
docker logout docker-registry.default.svc:5000
```

4. Login as system:admin account
```
oc login -u system:admin
```

5. Grant Service Account Access to the Privileged SCC
```
oc -n neuvector adm policy add-scc-to-user privileged -z default
```
The following info will be added in the Privileged SCC
users:
- system:serviceaccount:neuvector:default

6. Add read permission to access the kubernetes API and OpenShift RBACs. Admission control is supported in OpenShift 3.9+. 
```
oc create clusterrole neuvector-binding-app --verb=get,list,watch,update --resource=nodes,pods,services,namespaces
oc create clusterrole neuvector-binding-rbac --verb=get,list,watch --resource=rolebindings.rbac.authorization.k8s.io,roles.rbac.authorization.k8s.io,clusterrolebindings.rbac.authorization.k8s.io,clusterroles.rbac.authorization.k8s.io,imagestreams.image.openshift.io
oc adm policy add-cluster-role-to-user neuvector-binding-app system:serviceaccount:neuvector:default
oc adm policy add-cluster-role-to-user neuvector-binding-rbac system:serviceaccount:neuvector:default
oc create clusterrole neuvector-binding-admission --verb=get,list,watch,create,update,delete --resource=validatingwebhookconfigurations,mutatingwebhookconfigurations
oc adm policy add-cluster-role-to-user neuvector-binding-admission system:serviceaccount:neuvector:default
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

7. Run the following command to check if the neuvector/default service account is added successfully
```
oc get ClusterRoleBinding neuvector-binding-app neuvector-binding-rbac neuvector-binding-admission -o wide
```
Sample output:
```
NAME                   ROLE                    USERS     GROUPS    SERVICE ACCOUNTS    SUBJECTS
neuvector-binding-app  /neuvector-binding-app                      neuvector/default
neuvector-binding-rbac /neuvector-binding-rbac                     neuvector/default
neuvector-binding-rbac /neuvector-binding-admission                neuvector/default
```

8. Add support for Admission Control (OpenShift 3.9-3.11; not required for 4.2+)

    8-1. Edit the master config
```
vi /etc/origin/master/master-config.yaml
```
    8-2. Add MutatingAdmissionWebhook and ValidatingAdmissionWebhook
<pre>
<code>
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
</code></pre>
    8-3. Restart the Openshift api and controllers services
This is different for different versions. For example 3.10+
```
master-restart api
master-restart controllers
```
Or
```
/usr/local/bin/master-restart api controllers
```

    8-4. Run the following command to check if admissionregistration.k8s.io/v1beta1 is enabled
```
$ oc api-versions | grep admissionregistration
admissionregistration.k8s.io/v1beta1
```

9. Add a nvallinone label on one of the master or worker nodes where the allinone will be deployed
```
oc label nodes <nodename> nvallinone=true
```

10. Create the neuvector services and pods based on the sample yaml files below
```
oc create -f <compose file>
```

If you have created your own namespace instead of using “neuvector”:
1. Replace all instances of “namespace: neuvector” with your namespace.
2. Search for all instances of ”neuvector-svc-allinone.neuvector” in the files below. Then replace the “neuvector” (after the .) with the namespace you use.

Note1: If you are using the Allinone container for testing NeuVector, deploy only one Allinone for your cluster. Multiple Manager instances are not supported on Kubernetes. To test high availability for the Controller refer to the Deploying in Production section.


<strong>Sample Config File for OpenShift 3.9-3.11, 4.2+</strong>
Note: For 4.2+, see the section Deploying NeuVector / OpenShift for yaml file changes required for the CRI-O run-time and for changing the default registry.
```
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
    app: neuvector-allinone-pod

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
    app: neuvector-allinone-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-svc-allinone
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
    app: neuvector-allinone-pod

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

apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  name: neuvector-allinone-pod
  namespace: neuvector
spec:
  minReadySeconds: 60
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: neuvector-allinone-pod
    spec:
      hostPID: true
      containers:
        - name: neuvector-allinone-pod
          image: docker-registry.default.svc:5000/neuvector/allinone
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
              value: neuvector-svc-allinone.neuvector
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
      terminationGracePeriodSeconds: 1200
      nodeSelector:
        nvallinone: "true"
      restartPolicy: Always
      volumes:
        - name: modules-vol
          hostPath:
            path: /lib/modules
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

apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  name: neuvector-enforcer-pod
  namespace: neuvector
spec:
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
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                - key: "nvallinone"
                  operator: NotIn
                  values: ["true"]
      hostPID: true
      containers:
        - name: neuvector-enforcer-pod
          image: docker-registry.default.svc:5000/neuvector/enforcer
          securityContext:
            privileged: true
          env:
            - name: CLUSTER_JOIN_ADDR
              value: neuvector-svc-allinone.neuvector
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
      terminationGracePeriodSeconds: 300
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


### Enable/Disable Scheduling on the Master Node

The following commands can be used to enable/disable the scheduling on the master node.

```
oc adm manage-node nodename --schedulable
```

```
oc adm manage-node nodename --schedulable=false
```

### Configure Secret to Pull NeuVector Containers from Docker Hub

To configure Openshift to pull from the private NeuVector registry on Docker Hub. NOTE: For OpenShift v3.7 please see instructions in NOTE2 below for configuring secret
```
oc secrets new-dockercfg regsecret -n neuvector --docker-server=https://index.docker.io/v1/ --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>
```

You will also need to add the regsecret to the yaml file in the template/spec section for the allinone and enforcer. For example:
```
template:
    metadata:
      labels:
        app: neuvector-allinone-pod
    spec:
      imagePullSecrets:
        - name: regsecret
```

Note2: For OpenShift 3.7, configure secret as follow:
1. ‘cat ~/.docker/config.json’ to make sure the context as below before docker login
{
  "auths": {
    "credsStore": {}
  }
}
2. ‘docker login docker.io’ to create credential in .docker/config.json
3. ‘oc secrets new regsecret .dockerconfigjson=.docker/config.json -n neuvector’


