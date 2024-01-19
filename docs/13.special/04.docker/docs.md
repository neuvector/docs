---
title: Mirantis Kubernetes Engine
taxonomy:
    category: docs
---


### Mirantis Kubernetes Engine
Deploy to Kubernetes using the [Kubernetes Allinone](/special/kubernetes) section. 

### Deploy to Swarm Cluster
It’s simple to deploy NeuVector using a Swarm cluster. First, pull the NeuVector images using Docker UCP in the Images menu. You may need to add a version number to get the latest version on Docker Hub.

Currently, Swarm/UCP does not support the seccomp capabilities (cap_add options) or deploying in ‘privileged mode’ so the NeuVector containers will need to be deployed from the command line using docker-compose or run. See the sample compose files for the allinone and enforcer below.

The Docker UCP HRM service uses the default port 8443 which conflicts with the NeuVector console port. If using the default HRM port, then change the NeuVector port mapping, for example 9443:8443 for the allinone container in the examples below. After the NeuVector application is successfully deployed, login to the console on port 9443 of the allinone host.


### Deploy on Docker Swarm Using Privileged Mode

The following is an example of the docker-compose file to deploy the all-in-one container on the first node. Because the all-in-one container has an enforcer module inside, application containers on the same node can be secured. Both greenfield and brownfield deployment are supported.

Deploy all-in-one using docker-compose (privileged mode):

```
allinone:
    pid: host
    image: neuvector/allinone:<version>
    container_name: allinone
    privileged: true
    environment:
        - CLUSTER_JOIN_ADDR=node_ip
    ports:
        - 18300:18300
        - 18301:18301
        - 18400:18400
        - 18401:18401
        - 18301:18301/udp
        - 9443:8443
    volumes:
        - /lib/modules:/lib/modules
        - /var/neuvector:/var/neuvector
        - /var/run/docker.sock:/var/run/docker.sock
        - /proc:/host/proc:ro
        - /sys/fs/cgroup:/host/cgroup:ro
```

The most important environment variable is the **CLUSTER_JOIN_ADDR**. It is the IP address that other enforcers connect to. Normally, it should be set to the IP address of the node where all-in-one container is running.

Port 18300 and 18301 are default ports for cluster communication. They must be identical for all controllers and enforcers in the cluster. Please refer to *"Docker-compose Details"* section for how to change the default ports.

Add an enforcer container using docker-compose (privileged mode)

This is an example of docker-compose file to join an enforcer into the cluster. Both greenfield and brownfield deployment are supported.

```
enforcer:
    pid: host
    image: neuvector/enforcer:<version>
    container_name: enforcer
    privileged: true
    environment:
        - CLUSTER_JOIN_ADDR=controller_node_ip
    ports:
        - 18301:18301
        - 18401:18401
        - 18301:18301/udp
    volumes:
        - /lib/modules:/lib/modules
        - /var/run/docker.sock:/var/run/docker.sock
        - /proc:/host/proc:ro
        - /sys/fs/cgroup/:/host/cgroup/:ro
```


The most important environment variable is **CLUSTER_JOIN_ADDR**. For enforcers, replace ```<controller_node_ip>``` with the controller's node IP address. Typically, **CLUSTER_JOIN_ADDR** in the controller/all-in-one's docker-compose file and enforcer's docker-compose file have the same value.

From NeuVector 4.0+, a separate scanner container must be deployed to perform vulnerability scanning.

Sample docker-compose for the Scanner:

```
Scanner:
   image: neuvector/scanner
   container_name: scanner
   environment:
     - SCANNER_DOCKER_URL=tcp://192.168.1.10:2376
     - CLUSTER_JOIN_ADDR=controller_node_ip
   ports:
     - 18402:18402
   volumes:
     - /var/run/docker.sock:/var/run/docker.sock:ro
```


### Deployment Without Using Privileged Mode
For some platform configurations it is possible to deploy the NeuVector containers without requiring them to run in privileged mode. The configuration must support the ability to add capabilities and set the apparmour profile. Note that Docker DataCenter/UCP and Swarm currently do not support this, but it is still possible to deploy NeuVector manually using Compose or Run.

Deploy allinone (NO privileged mode) with docker-compose

```
allinone:
    pid: host
    image: neuvector/allinone
    container_name: neuvector.allinone
    cap_add:
        - SYS_ADMIN
        - NET_ADMIN
        - SYS_PTRACE
        - IPC_LOCK
    security_opt:
        - apparmor=unconfined
        - seccomp=unconfined
        - label=disable
    environment:
        - CLUSTER_JOIN_ADDR=[AllInOne Node IP Address]
    ports:
        - 18300:18300
        - 18301:18301
        - 18400:18400
        - 18401:18401
        - 18301:18301/udp
        - 9443:8443
    volumes:
        - /lib/modules:/lib/modules
        - /var/run/docker.sock:/var/run/docker.sock
        - /proc:/host/proc:ro
        - /sys/fs/cgroup:/host/cgroup:ro
        - /var/neuvector:/var/neuvector
```

Deploy enforcer (NO privileged mode) with docker-compose

```
enforcer:
    pid: host
    image: neuvector/enforcer
    container_name: neuvector.enforcer
    cap_add:
        - SYS_ADMIN
        - NET_ADMIN
        - SYS_PTRACE
        - IPC_LOCK
    security_opt:
        - apparmor=unconfined
        - seccomp=unconfined
        - label=disable
    environment:
        - CLUSTER_JOIN_ADDR=[AllInOne Node IP Address]
    ports:
        - 18301:18301
        - 18401:18401
        - 18301:18301/udp
    volumes:
        - /lib/modules:/lib/modules
        - /var/run/docker.sock:/var/run/docker.sock
        - /proc:/host/proc:ro
        - /sys/fs/cgroup/:/host/cgroup/:ro
```
