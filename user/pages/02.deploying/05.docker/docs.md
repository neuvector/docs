---
title: Docker & Mirantis Kubernetes Engine
taxonomy:
    category: docs
---

### Kubernetes Deployment on Mirantis Kubernetes Engine

Follow the instructions in the [Kubernetes section](/deploying/kubernetes).

Note: NeuVector does not support mixed Kubernetes / Swarm clusters.

### Deploy NeuVector Containers Using Docker Native or UCP/Swarm

Note that native Docker deployment on Mirantis Kubernetes Engine using Swarm DOES NOT support deployment of services with containers in privileged mode, or with seccomp capabilities added. To deploy in this environment, you must use Docker Compose or Run to deploy the NeuVector containers. You can use the remote host deployment (docker-compose -H HOST) to make this task easier. 

Here are the sample docker compose configuration files. Note that using docker native does not support deploying the enforcer on the same node as the controller, requiring the use of the Allinone container if controller and enforcer functions are desired on a node. 

Note: The environment variable NV_PLATFORM_INFO=platform=Docker is used to notify NeuVector that the platform is Docker/Swarm, even though there may be unused Kubernetes containers detected by NeuVector on a Docker EE deployment. Also to be able to see these in Network Activity -> View -> Show System, add the environment variable for the Enforcer NV_SYSTEM_GROUPS.


#### Deploy Allinone for High Availability
For HA in production Docker native or EE environments, deploy the Allinone container on the first three production hosts. Each Allinone should point to the IP addresses of all Allinone hosts. For example, three Allinone containers is the minimum for HA, and the CLUSTER_JOIN_ADDR should list the three IP addresses separated by comma's. Additional HA Allinone's can be deployed in odd numbers, e.g. 5, 7. The deploy the Enforcer on the remaining hosts in the cluster, in any.

#### Deploy Allinone using docker-compose (privileged mode)
The following is an example of the docker-compose file to deploy the allinone container on the first node. Because the allinone container has an enforcer module inside, application containers on the same node can be secured. Both greenfield and brownfield deployment are supported.

```
allinone:
    pid: host
    image: neuvector/allinone:<version>
    container_name: allinone
    privileged: true
    environment:
        - CLUSTER_JOIN_ADDR=node_ip
        - NV_PLATFORM_INFO=platform=Docker
    ports:
        - 18300:18300
        - 18301:18301
        - 18400:18400
        - 18401:18401
        - 18301:18301/udp
        - 8443:8443
    volumes:
        - /lib/modules:/lib/modules:ro
        - /var/neuvector:/var/neuvector
        - /var/run/docker.sock:/var/run/docker.sock:ro
        - /proc:/host/proc:ro
        - /sys/fs/cgroup:/host/cgroup:ro
```


The most important environment variable is the **CLUSTER_JOIN_ADDR**. It is the IP address that other enforcers connect to. Normally, it should be set to the IP address of the node where all-in-one container is running.

Port 18300 and 18301 are default ports for cluster communication. They must be identical for all controllers and enforcers in the cluster. Please refer to *"Docker-compose Details"* section for how to change the default ports.

Note: To expose the REST API in the Allinone, add the port map for 10443, for example - 10443:10443.

#### Add an enforcer container using docker-compose (privileged mode)

This is an example of docker-compose file to join an enforcer into the cluster. Both greenfield and brownfield deployment are supported.

```
enforcer:
    pid: host
    image: neuvector/enforcer:<version>
    container_name: enforcer
    privileged: true
    environment:
        - CLUSTER_JOIN_ADDR=controller_node_ip
        - NV_PLATFORM_INFO=platform=Docker
    ports:
        - 18301:18301
        - 18401:18401
        - 18301:18301/udp
    volumes:
        - /lib/modules:/lib/modules:ro
        - /var/run/docker.sock:/var/run/docker.sock:ro
        - /proc:/host/proc:ro
        - /sys/fs/cgroup/:/host/cgroup/:ro
```


The most important environment variable is **CLUSTER_JOIN_ADDR**. For enforcers, replace ```<controller_node_ip>``` with the controller's node IP address. Typically, **CLUSTER_JOIN_ADDR** in the controller/all-in-one's docker-compose file and enforcer's docker-compose file have the same value.

#### Deploy the NeuVector Scanner Container

From NeuVector 4.0+, a separate scanner container must be deployed to perform vulnerability scanning. Important: Always use the :latest tag when pulling and running the scanner image to ensure the latest CVE database is deployed.

Sample docker run to deploy the scanner on the same host as the controller

```
docker run -td --name scanner -e CLUSTER_JOIN_ADDR=controller_node_ip -p 18402:18402 -v /var/run/docker.sock:/var/run/docker.sock:ro neuvector/scanner:latest
```

And sample docker-compose

```
Scanner:
   image: neuvector/scanner:latest
   container_name: scanner
   environment:
     - CLUSTER_JOIN_ADDR=controller_node_ip
   ports:
     - 18402:18402
   volumes:
     - /var/run/docker.sock:/var/run/docker.sock:ro
```

To deploy the scanner on a different host than the controller, add the environment variable CLUSTER_ADVERTISED_ADDR so the controller can reach the scanner.
```
docker run -td --name scanner -e CLUSTER_JOIN_ADDR=controller_node_ip -e CLUSTER_ADVERTISED_ADDR=scanner_host_ip -p 18402:18402 -v /var/run/docker.sock:/var/run/docker.sock:ro neuvector/scanner:latest
```

To deploy multiple scanners on the same host as the controller, remove the port mapping and CLUSTER_ADVERTISED_ADDR environment variable.
```
docker run -itd --name s1  -e CLUSTER_JOIN_ADDR=controller_node_ip neuvector/scanner:latest
```
Where s1 is scanner 1 (use s2, s3 etc for each additional scanner).

To deploy a stand alone scanner (no controller/allinone), please see the section [Parallel and Standalone Scanners](/scanning/scanners).

To update the Scanner in order to get the latest CVE database updates from NeuVector, create a cron job to stop and restart the scanner, pulling the latest. See [this section](/scanning/updating#docker-native-updates) for details.

#### Deployment Without Using Privileged Mode
For some platform configurations it is possible to deploy the NeuVector containers without requiring them to run in privileged mode. The configuration must support the ability to add capabilities and set the apparmor profile. Note that Docker DataCenter/UCP and Swarm currently do not support this, but it is still possible to deploy NeuVector manually using Compose or Run.

#### Deploy allinone (NO privileged mode) with docker-compose

```
allinone:
    pid: host
    image: neuvector/allinone:<version>
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
        - NV_PLATFORM_INFO=platform=Docker
    ports:
        - 18300:18300
        - 18301:18301
        - 18400:18400
        - 18401:18401
        - 18301:18301/udp
        - 8443:8443
    volumes:
        - /lib/modules:/lib/modules:ro
        - /var/run/docker.sock:/var/run/docker.sock:ro
        - /proc:/host/proc:ro
        - /sys/fs/cgroup:/host/cgroup:ro
        - /var/neuvector:/var/neuvector
```

#### Deploy enforcer (NO privileged mode) with docker-compose

```
enforcer:
    pid: host
    image: neuvector/enforcer:<version>
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
        - NV_PLATFORM_INFO=platform=Docker
    ports:
        - 18301:18301
        - 18401:18401
        - 18301:18301/udp
    volumes:
        - /lib/modules:/lib/modules:ro
        - /var/run/docker.sock:/var/run/docker.sock:ro
        - /proc:/host/proc:ro
        - /sys/fs/cgroup/:/host/cgroup/:ro
```

#### Deploy allinone (privileged mode) with docker run
You can use docker run instead of compose to deploy. Here are samples.

```
docker run -d --name allinone \
--pid=host \
--privileged \
    -e CLUSTER_JOIN_ADDR=[AllInOne Node IP Address] \
    -e NV_PLATFORM_INFO=platform=Docker \
    -p 18300:18300 \
    -p 18301:18301 \
    -p 18400:18400 \
    -p 18401:18401 \
    -p 18301:18301/udp \
    -p 8443:8443 \
    -v /lib/modules:/lib/modules:ro \
    -v /var/neuvector:/var/neuvector \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    -v /sys/fs/cgroup:/host/cgroup:ro \
    -v /proc:/host/proc:ro \
neuvector/allinone:<version>
```

#### Deploy enforcer (privileged mode) with docker run

```
docker run -d --name enforcer \
--pid=host \
--privileged \
    -e CLUSTER_JOIN_ADDR=[AllInOne Node IP Address] \
    -e NV_PLATFORM_INFO=platform=Docker \
    -p 18301:18301 \
    -p 18401:18401 \
    -p 18301:18301/udp \
    -v /lib/modules:/lib/modules:ro \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    -v /sys/fs/cgroup:/host/cgroup:ro \
    -v /proc:/host/proc:ro \
neuvector/enforcer:<version>
```


#### Deploy allinone (NO privileged mode) with docker run
You can use docker run instead of compose to deploy. Here are samples.

```
docker run -d --name allinone \
--pid=host \
--cap-add=SYS_ADMIN \
--cap-add=NET_ADMIN \
--cap-add=SYS_PTRACE \
--cap-add=IPC_LOCK \
--security-opt label=disable \
--security-opt apparmor=unconfined \
--security-opt seccomp=unconfined \
    -e CLUSTER_JOIN_ADDR=[AllInOne Node IP Address] \
    -e NV_PLATFORM_INFO=platform=Docker \
    -p 18300:18300 \
    -p 18301:18301 \
    -p 18400:18400 \
    -p 18401:18401 \
    -p 18301:18301/udp \
    -p 8443:8443 \
    -v /lib/modules:/lib/modules:ro \
    -v /var/neuvector:/var/neuvector \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    -v /sys/fs/cgroup:/host/cgroup:ro \
    -v /proc:/host/proc:ro \
neuvector/allinone:<version>
```

#### Deploy enforcer (NO privileged mode) with docker run

```
docker run -d --name enforcer \
--pid=host \
--cap-add=SYS_ADMIN \
--cap-add=NET_ADMIN \
--cap-add=SYS_PTRACE \
--cap-add=IPC_LOCK \
--security-opt label=disable \
--security-opt apparmor=unconfined \
--security-opt seccomp=unconfined \
    -e CLUSTER_JOIN_ADDR=[AllInOne Node IP Address]  \
    -e NV_PLATFORM_INFO=platform=Docker \
    -p 18301:18301 \
    -p 18401:18401 \
    -p 18301:18301/udp \
    -v /lib/modules:/lib/modules:ro \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    -v /sys/fs/cgroup:/host/cgroup:ro \
    -v /proc:/host/proc:ro \
neuvector/enforcer:<version>
```

### Deploy Separate NeuVector Components on Different Hosts
If planning to dedicate a docker host to a Controller and/or Manager (no Enforcer) these containers can be deployed individually instead of the Allinone. Note that docker does not support deploying the enforcer on the same node as the controller as separate components, requiring the use of the Allinone container if controller and enforcer functions are desired on a node. 


Controller compose file (replace [controller IP] with IP of the first controller node)
```
controller:
    image: neuvector/controller:<version>
    container_name: controller
    pid: host
    privileged: true
    environment:
      - CLUSTER_JOIN_ADDR=[controller IP]
      - NV_PLATFORM_INFO=platform=Docker
    ports:
        - 18300:18300
        - 18301:18301
        - 18400:18400
        - 18401:18401
        - 18301:18301/udp
        - 10443:10443
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /proc:/host/proc:ro
      - /sys/fs/cgroup:/host/cgroup:ro
      - /var/neuvector:/var/neuvector
```

Docker run can also be used, for example

```
docker run -itd --privileged --name neuvector.controller -e CLUSTER_JOIN_ADDR=controller_ip -p 18301:18301 -p 18301:18301/udp -p 18300:18300 -p 18400:18400 -p 10443:10443 -v /var/neuvector:/var/neuvector -v /var/run/docker.sock:/var/run/docker.sock:ro -v /proc:/host/proc:ro -v /sys/fs/cgroup/:/host/cgroup/:ro neuvector/controller:<version>
```

Manager compose file (replace [controller IP] with IP of controller node to connect to). The Docker UCP HRM service uses the default port 8443 which conflicts with the NeuVector console port. If using the default HRM port, then change the NeuVector port mapping in the example below to another port, for example 9443:8443 for the manager container as shown below.
```
manager:
    image: neuvector/manager:<version>
    container_name: nvmanager
    environment:
      - CTRL_SERVER_IP=[controller IP]
    ports:
      - 9443:8443
```

The compose file for the Enforcer:
```
enforcer:
    image: neuvector/enforcer:<version>
    pid: host
    container_name: enforcer
    privileged: true
    environment:
        - CLUSTER_JOIN_ADDR=controller_node_ip
        - NV_PLATFORM_INFO=platform=Docker
    ports:
        - 18301:18301
        - 18401:18401
        - 18301:18301/udp
    volumes:
        - /lib/modules:/lib/modules:ro
        - /var/run/docker.sock:/var/run/docker.sock:ro
        - /proc:/host/proc:ro
        - /sys/fs/cgroup/:/host/cgroup/:ro
```


### Monitoring and Restarting NeuVector
Since the NeuVector containers are not deployed as a UCP/Swarm service, they are not automatically started/restarted on nodes. You should set up alerting through your SIEM system for NeuVector SYSLOG events or through DataCenter to detect if a NeuVector container is not running.

### Deploying Without Privileged Mode
In general you’ll need to replace the privileged setting with:

```
    cap_add:
        - SYS_ADMIN
        - NET_ADMIN
        - SYS_PTRACE
        - IPC_LOCK
    security_opt:
        - apparmor=unconfined
        - seccomp=unconfined
        - label=disable
```
The above syntax is for Docker EE v17.06.0+. Versions prior to this use the : instead of =, for example apparmor:unconfined.


###Docker Native Updates
<strong>Important:</strong> Always use the :latest tag when pulling and running the scanner image to ensure the latest CVE database is deployed.


```
docker stop scanner
docker rm <scanner id>
docker pull neuvector/scanner:latest
<docker run command from below>
```

Note: 'docker rm -f <scanner id>' can also be used to force stop and removal of the running scanner.

For docker-compose

```
docker-compose -f file.yaml down
docker-compose -f file.yaml pull		// pre-pull the image before starting the scanner
docker-compose -f file.yaml up -d
```

Sample docker run
```
docker run -td --name scanner -e CLUSTER_JOIN_ADDR=controller_node_ip -e CLUSTER_ADVERTISED_ADDR=node_ip -e SCANNER_DOCKER_URL=tcp://192.168.1.10:2376 -p 18402:18402 -v /var/run/docker.sock:/var/run/docker.sock:ro neuvector/scanner:latest
```
And sample docker-compose
```
Scanner:
   image: neuvector/scanner:latest
   container_name: scanner
   environment:
     - SCANNER_DOCKER_URL=tcp://192.168.1.10:2376
     - CLUSTER_JOIN_ADDR=controller_node_ip
     - CLUSTER_ADVERTISED_ADDR=node_ip
   ports:
     - 18402:18402
   volumes:
     - /var/run/docker.sock:/var/run/docker.sock:ro
```
