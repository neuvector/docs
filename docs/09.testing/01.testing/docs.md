---
title: Evaluating and Testing NeuVector
taxonomy:
    category: docs
---

### Sample Applications 
After you’ve deployed the NeuVector components you can evaluate it using the sample test applications we provide. These are located in the ’nvbeta’ repository on docker hub.

A typical Kubernetes-based test environment would have a master node and two to three worker nodes. You can control if application pods and NeuVector containers are deployed on a master node (off by default).


### Kubernetes Test Plan
To deploy a multi-tier application using Nginx, Nodejs, and Redis, use the samples below (in the order below). These may need to be edited for deployment on OpenShift, Rancher and other Kubernetes based tools. 

Create a demo namespace
```
kubectl create namespace demo
```

Note: the sample below use apiVersion: apps/v1 required by Kubernetes 1.16+.

Create the Redis service and deployment using this yaml:
```
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: demo
spec:
  ports:
  - port: 6379
    protocol: "TCP"
    name: "cluster-tcp-6379"
  clusterIP: None
  selector:
    app: redis-pod

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-pod
  namespace: demo
spec:
  selector:
    matchLabels:
      app: redis-pod
  template:
    metadata:
      labels:
        app: redis-pod
    spec:
      containers:
      - name: redis-pod
        image: redis
```

Create the Nodejs service and deployment using this yaml:
```
apiVersion: v1
kind: Service
metadata:
  name: node
  namespace: demo
spec:
  ports:
  - port: 8888
    protocol: "TCP"
    name: "cluster-tcp-8888"
  clusterIP: None
  selector:
    app: node-pod

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-pod
  namespace: demo
spec:
  selector:
    matchLabels:
      app: node-pod
  replicas: 3
  template:
    metadata:
      labels:
        app: node-pod
    spec:
      containers:
      - name: node-pod
        image: nvbeta/node
```


Create the Nginx service and deployment using this yaml:
```
apiVersion: v1
kind: Service
metadata:
  name: nginx-webui
  namespace: demo
spec:
  ports:
    - port: 80
      name: webui
      protocol: TCP
  type: NodePort
  selector:
    app: nginx-pod

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-pod
  namespace: demo
spec:
  selector:
    matchLabels:
      app: nginx-pod
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx-pod
        image: nvbeta/swarm_nginx
        ports:
        - containerPort: 80
          protocol: TCP
```


To access the Nginx-webui service externally, find the random port assigned to it (mapped to port 80) by the NodePort:
```
kubectl get svc -n demo
```

Then connect to the public IP address/port for one of the kubernetes nodes, e.g. ‘http://(public_IP):(NodePort)’

After deploying NeuVector, you can run test traffic through the demo applications to generate the whitelist rules, and then move all services to Monitor or Protect mode to see violations and attacks.

#### Generating Network Violations on Kubernetes

To generate a violation from a nodejs pod, find a pod:
```
kubectl get pod -n demo
```
Then try some violations (replace node-pod-name):
```
kubectl exec node-pod-name curl www.google.com -n demo
```

Or find the internal IP address of another node pod, like 172.30.2.21 in the example below, to connect from one node to another:
```
kubectl exec node-pod-name curl 172.30.2.21:8888 -n demo
```

##### Generate a Threat/Attack
To simulate an attack, log into a container, then try a ping attack:
```
kubectl exec -it node-pod-name bash -n demo
```

Use the internal IP of another node pod:
```
ping 172.30.2.21 -s 40000
```

For all of the above, you can view the security events in the NeuVector console Network Activity map, as well as the Notifications tab.

####Process and File Protection Tests
Try various process and file activity by exec'ing into a container and running commands such as apt-get update, ssh, scp or others. Any process activity or file access not allowed will generate alerts in Notifications.

####Registry Scanning and Admission Control
A popular test is to configure image scanning of a registry in Assets -> Registries. After the scan is complete, configure an Admission Control rule in Policy. Be sure to enable Admission Controls and set a rule to Deny when there are high vulnerabilities in an image. Then pick an image that has high vulnerabilities and try to deploy it in Kubernetes. The deployment will be blocked in Protect mode and you will see an event in Notifications -> Security Risks.

More advanced admission control testing can be done using different criteria in rules, or combining criteria.


##### Deploy Another App
The Kubernetes Guestbook demo application can also be deployed on Kubernetes. It is recommended to deploy it into its own namespace so you can see namespace based filtering in the NeuVector console.


### Docker-native Test Plan
After deploying the NeuVector components and the sample application(s) you’ll be able to Discover, Monitor and Protect running containers. The test plan below provides suggestions for generating run-time violations of allowed application behavior and scanning containers for vulnerabilities.

[NeuVector Test Plan](testplan.pdf)

If the link above does not work, you can [download](http://neuvector.com/sample-applications-test-plan/) it from our website using password nv1851blvd.

NeuVector can also detect threats to your containers such as DDOS attacks. If you run a tool to generate such attacks on your containers, these results will show in Network Activity and in the Dashboard.

For example, a simple ping command with high payload will show the Ping.Death attack in the console. To try this, do the following to the IP address of one of the containers (internal IP of the container).
```
ping <container_ip> -s 40000
```
In Kubernetes you can do this from any node including the master. In other environments you may need to be logged into the node where the container is running.