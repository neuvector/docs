---
title: Deployment Preparation
taxonomy:
    category: docs
---

### Understanding How to Deploy NeuVector
Deploy the NeuVector containers using Kubernetes, OpenShift, Rancher, AWS EKS/ECS, docker run, or docker-compose. For Docker native deployments be sure to set the CLUSTER_JOIN_ADDR to the IP of your allinone/controller.

NeuVector can be deployed in privileged mode or without requiring privileged mode for some configurations.

#### Getting Support for Deployments
You can contact support@neuvector.com with any questions or to report issues. When reporting issues, please note the NeuVector version number and capture the support log at the bottom of the page Settings -> Configuration and attaching to your email.

#### Deploy using Kubernetes, OpenShift, Rancher, or other Kubernetes-based tools
To deploy NeuVector using Kubernetes, OpenShift, Rancher or other orchestration tools, see the sample files in the section Deploying NeuVector. This deploys manager, controller, and enforcer containers. For simple testing using the NeuVector Allinone container, see the section Simple Deployment Examples.

NeuVector supports Helm-based deployment with a Helm chart at https://github.com/neuvector/neuvector-helm

Automated deployments are supported using Helm, Red Hat/Community Operators, the rest API, or a Kubernetes ConfigMap. See the section Deploy Using ConfigMap for more details on automating deployment.

#### Deploy using Docker Native
Before you deploy NeuVector with docker run or compose, you MUST set the CLUSTER_JOIN_ADDR to the appropriate IP address. Find the node IP address, node name (if using a name server, or node variable (if using orchestration tools) for the allinone (controller) to use for the “node IP” in the docker-compose files for both allinone and enforcer.  For example:
```
- CLUSTER_JOIN_ADDR=192.168.33.10
```

For Swarm-Based deployments, also add the following environment variable:
```
- NV_PLATFORM_INFO=platform=Docker
```

See the section Deploying NeuVector -> Docker Production Deployment for instructions and examples.


#### Backup Config Files

By default NeuVector stores various config files in  /var/neuvector/config/backup on the Controller or Allinone

This volume can be mapped to persistent storage to maintain configuration. Files in the folder may need to be deleted in order to start fresh.

#### Port Mapping
Make sure the required ports are mapped properly and open on the host. The Allinone requires 8443 (if using the console), 18300, 18301, 18400, 18401 and optionally 10443, 11443, 20443, 30443. The Enforcer requires 18301 and 18401.

Note: If deploying separate Manager and Controller, the Manager requires 8443 and the Controller all other ports listed below under Allinone.

Note: If deploying docker native (including SWARM) make sure there is not any host firewall blocking access to required ports such as firewalld. If enabled, the docker0 interface must be added as a trusted zone for the allinone/controller hosts.

| Container | Port | Protocol | Description   |  Scenario                     | Required  |
| --------- | ---- | --------- |-------------- | ---------------------------- | --------- |
| allinone | 8443 | TCP | Web console | external to allione | Optional |
| allinone | 10443 | TCP | REST API | external to allione  | Optional to expose API / multiple cluster |
| allinone | 18300 | TCP | Handle incoming requests | enforcer or allinone to allinone  | Yes |
| allinone | 18301 | TCP/UDP | Handle gossip in the LAN | allinone to allione or enforcer  | Yes |
| allinone | 18400 | TCP | Handle grpc requests | enforcer or allinone to allinone | Yes |
| allinone | 18401 | TCP | Handle grpc requests | allinone to allinone or enforcer  | Yes |
| allinone | 11443 | TCP | REST API | allinone to allinone | Optional for multiple cluster |
| allinone | 20443 | TCP | REST API | k8s to allinone | Optional for admission control |
| allinone | 30443 | TCP | REST API | k8s to allinone | Optional for crd |
| enforcer | 18301 | TCP/UDP | Handle gossip in the LAN | enforcer to enforcer or allinone | Yes |
| enforcer | 18401 | TCP | Handle grpc requests | allinone to allinone or enforcer  | Yes |
| scanner  | 18402 | TCP | Handle grpc requests | allinone to scanner | Optional for external scanner |

#### Volume Mapping 
Make sure volumes are mapped properly. NeuVector requires these to operate (/var/neuvector is only required on controller/allinone). For example:
```
volumes:
        - /lib/modules:/lib/modules:ro
        - /var/neuvector:/var/neuvector
        - /var/run/docker.sock:/var/run/docker.sock:ro
        - /proc:/host/proc:ro
        - /sys/fs/cgroup:/host/cgroup:ro
```

### The following Docker Native sections are not maintained and will be Archived in the future
<strong>Please see the section Deploying NeuVector -> Docker Production Deployment for instructions to deploy Docker Native, SWARM/UCP, and EE/Kubernetes.</strong>

#### [Archive] Deploy All-in-one using docker-compose (privileged mode)
The following is an example of the docker-compose file to deploy the all-in-one container on the first node. Because the all-in-one container has an enforcer module inside, application containers on the same node can be secured. Both greenfield and brownfield deployment are supported.

```
allinone:
    pid: host
    image: neuvector/allinone
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
        - 8443:8443
    volumes:
        - /lib/modules:/lib/modules:ro
        - /var/neuvector:/var/neuvector
        - /var/run/docker.sock:/var/run/docker.sock:ro
        - /proc:/host/proc:ro
        - /sys/fs/cgroup:/host/cgroup:ro
```

The image pulled from the Docker registry normally has a version tag. Please modify the image name accordingly (e.g. neuvector/allinone:09.00.00129) if there is not one with a ‘latest’ tag.

The most important environment variable is the **CLUSTER_JOIN_ADDR**. It is the IP address that other enforcers connect to. Normally, it should be set to the IP address of the node where all-in-one container is running.

Port 18300 and 18301 are default ports for cluster communication. They must be identical for all controllers and enforcers in the cluster. Please refer to *"Docker-compose Details"* section for how to change the default ports.

Note: To expose the REST API in the Allinone, add the port map for 10443, for example - 10443:10443.

#### [Archive] Add an enforcer container using docker-compose (privileged mode)

This is an example of docker-compose file to join an enforcer into the cluster. Both greenfield and brownfield deployment are supported.

```
enforcer:
    pid: host
    image: neuvector/enforcer
    container_name: enforcer
    privileged: true
    environment:
        - CLUSTER_JOIN_ADDR=controller_node_ip
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

The image pulled from the Docker registry normally has a version tag. Please modify the image name accordingly (e.g. neuvector/enforcer:09.00.00129) if there is not one with a ‘latest’ tag.

The most important environment variable is **CLUSTER_JOIN_ADDR**. For enforcers, replace ```<controller_node_ip>``` with the controller's node IP address. Typically, **CLUSTER_JOIN_ADDR** in the controller/all-in-one's docker-compose file and enforcer's docker-compose file have the same value.

#### [Archive] Deployment Without Using Privileged Mode
For some platform configurations it is possible to deploy the NeuVector containers without requiring them to run in privileged mode. The configuration must support the ability to add capabilities and set the apparmor profile. Note that Docker DataCenter/UCP and Swarm currently do not support this, but it is still possible to deploy NeuVector manually using Compose or Run.

#### [Archive] Deploy allinone (NO privileged mode) with docker-compose

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
        - 8443:8443
    volumes:
        - /lib/modules:/lib/modules:ro
        - /var/run/docker.sock:/var/run/docker.sock:ro
        - /proc:/host/proc:ro
        - /sys/fs/cgroup:/host/cgroup:ro
        - /var/neuvector:/var/neuvector
```

#### [Archive] Deploy enforcer (NO privileged mode) with docker-compose

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
        - /lib/modules:/lib/modules:ro
        - /var/run/docker.sock:/var/run/docker.sock:ro
        - /proc:/host/proc:ro
        - /sys/fs/cgroup/:/host/cgroup/:ro
```

#### [Archive] Deploy allinone (privileged mode) with docker run
You can use docker run instead of compose to deploy. Here are samples.

```
docker run -d --name allinone \
--pid=host \
--privileged \
    -e CLUSTER_JOIN_ADDR=[AllInOne Node IP Address] \
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
neuvector/allinone
```

#### [Archive] Deploy allinone (NO privileged mode) with docker run
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
neuvector/allinone
```

#### [Archive] Deploy enforcer (privileged mode) with docker run

```
docker run -d --name enforcer \
--pid=host \
--privileged \
    -e CLUSTER_JOIN_ADDR=[AllInOne Node IP Address] \
    -p 18301:18301 \
    -p 18401:18401 \
    -p 18301:18301/udp \
    -v /lib/modules:/lib/modules:ro \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    -v /sys/fs/cgroup:/host/cgroup:ro \
    -v /proc:/host/proc:ro \
neuvector/enforcer
```

#### [Archive] Deploy enforcer (NO privileged mode) with docker run

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
    -p 18301:18301 \
    -p 18401:18401 \
    -p 18301:18301/udp \
    -v /lib/modules:/lib/modules:ro \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    -v /sys/fs/cgroup:/host/cgroup:ro \
    -v /proc:/host/proc:ro \
neuvector/enforcer
```