---
title: Docker Production Deployment
taxonomy:
    category: docs
---

### Kubernetes on Docker EE

Follow the instructions in the Kubernetes section, with the following exceptions. Docker EE does not support all of the Kubernetes features, so modification of the Kubernetes instructions and yaml files may be necessary.

#### Setting ClusterRoleBinding for NeuVector
The instructions to do this in the Kubernetes section must be performed on Docker EE with a script or through the Docker EE console. Docker EE does NOT support the kubectl command to do this.

You can do this through the console.
Create neuvector-binding role from the UCP GUI->User Management->Roles->create with operations given below.

![cluster1](ee-cluster1.png)

Then create a neuvector-binding Grant from the UCP GUI->User Management->Grants-> create for the above role with subject namespace/service account: neuvector/default and with resources set all kubenetesnamespaces existing and new namespaces 

![cluster2](ee-cluster2.png)


Or see this sample script to do it through the Docker EE REST API. Replace the IP address and login information.

```
echo "Type UCP server IP address"
read ucp_ip
echo "Type username"
read user
echo "Type password"
read -s password

AUTHTOKEN=$(curl -sk -d "{\"username\":\"$user\",\"password\":\"$password\"}" https://$ucp_ip/auth/login| jq -r .auth_token)
curl -X POST "https://$ucp_ip/roles" -H  "accept: application/json" -H  "Authorization: Bearer $AUTHTOKEN" -H  "content-type: application/json" -d "{  \"id\": \"3\",  \"name\": \"neuvector-binding\",  \"system_role\": false,  \"operations\": {    \"Kubernetes Cluster Role\": {      \"Kubernetes Cluster Role Get\": [],      \"Kubernetes Cluster Role List\": [],      \"Kubernetes Cluster Role Watch\": []    },    \"Kubernetes Cluster Role Binding\": {      \"Kubernetes Cluster Role Binding Get\": [],      \"Kubernetes Cluster Role Binding List\": [],      \"Kubernetes Cluster Role Binding Watch\": []    },    \"Kubernetes Node\": {      \"Kubernetes Node Get\": [],      \"Kubernetes Node List\": [],      \"Kubernetes Node Watch\": []    },    \"Kubernetes Pod\": {      \"Kubernetes Pod Get\": [],      \"Kubernetes Pod List\": [],      \"Kubernetes Pod Watch\": []    },    \"Kubernetes Role\": {      \"Kubernetes Role Get\": [],      \"Kubernetes Role List\": [],      \"Kubernetes Role Watch\": []    },    \"Kubernetes Role Binding\": {      \"Kubernetes Role Binding Get\": [],      \"Kubernetes Role Binding List\": [],      \"Kubernetes Role Binding Watch\": []    },    \"Kubernetes Service\": {      \"Kubernetes Service Get\": [],      \"Kubernetes Service List\": [],      \"Kubernetes Service Watch\": []    }  }}"
role_id=`curl -X GET "https://$ucp_ip/roles" -H  "accept: application/json" -H  "Authorization: Bearer $AUTHTOKEN" | jq -r '.[] | select( .name | contains("neuvector-binding")) |.id'`
#curl -X PUT "https://$ucp_ip/collectionGrants/system%3Aserviceaccount%3Aneuvector%3Adefault/kubernetesnamespaces/$role_id?type=namespace" -H  "accept: application/json" -H  "Authorization: Bearer $AUTHTOKEN"
curl -X PUT "https://$ucp_ip/collectionGrants/system%3Aserviceaccount%3Aneuvector%3Adefault/kubernetesnamespaces/$role_id?type=grantobject" -H  "accept: application/json" -H  "Authorization: Bearer $AUTHTOKEN"
```

Then continue with the instructions in the Kubernetes section.

### Deploy NeuVector Containers Using Docker Native or UCP/Swarm

Note that Docker Enterprise Edition (EE), DataCenter, UCP, and Swarm DO NOT support deployment of services with containers in privileged mode, or with seccomp capabilities added. To deploy in this environment, you must use Docker Compose or Run to deploy the NeuVector containers. You can use the remote host deployment (docker-compose -H HOST) to make this task easier. NeuVector will support deployment through EE as soon as it is supported by Docker.

Here are the sample docker compose configuration files. Note that using docker native does not support deploying the enforcer on the same node as the controller, requiring the use of the Allinone container if controller and enforcer functions are desired on a node. 

Note the environment variable NV_PLATFORM_INFO=platform=Docker is used to notify NeuVector that the platform is Docker/Swarm, even though there may be unused Kubernetes containers detected by NeuVector on a Docker EE deployment.

#### Deploy Allinone for High Availability
For HA in production Docker native or EE environments, deploy the Allinone container on the first three production hosts. Each Allinone should point to the IP addresses of all Allinone hosts. For example, three Allinone containers is the minimum for HA, and the CLUSTER_JOIN_ADDR should list the three IP addresses separated by comma's. Additional HA Allinone's can be deployed in odd numbers, e.g. 5, 7. The deploy the Enforcer on the remaining hosts in the cluster, in any.

#### Deploy Allinone using docker-compose (privileged mode)
The following is an example of the docker-compose file to deploy the allinone container on the first node. Because the allinone container has an enforcer module inside, application containers on the same node can be secured. Both greenfield and brownfield deployment are supported.

```
allinone:
    pid: host
    image: neuvector/allinone
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

The image pulled from the Docker registry normally has a version tag. Please modify the image name accordingly (e.g. neuvector/allinone:09.00.00129) if there is not one with a ‘latest’ tag.

The most important environment variable is the **CLUSTER_JOIN_ADDR**. It is the IP address that other enforcers connect to. Normally, it should be set to the IP address of the node where all-in-one container is running.

Port 18300 and 18301 are default ports for cluster communication. They must be identical for all controllers and enforcers in the cluster. Please refer to *"Docker-compose Details"* section for how to change the default ports.

Note: To expose the REST API in the Allinone, add the port map for 10443, for example - 10443:10443.

#### Add an enforcer container using docker-compose (privileged mode)

This is an example of docker-compose file to join an enforcer into the cluster. Both greenfield and brownfield deployment are supported.

```
enforcer:
    pid: host
    image: neuvector/enforcer
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

The image pulled from the Docker registry normally has a version tag. Please modify the image name accordingly (e.g. neuvector/enforcer:09.00.00129) if there is not one with a ‘latest’ tag.

The most important environment variable is **CLUSTER_JOIN_ADDR**. For enforcers, replace ```<controller_node_ip>``` with the controller's node IP address. Typically, **CLUSTER_JOIN_ADDR** in the controller/all-in-one's docker-compose file and enforcer's docker-compose file have the same value.

#### Deployment Without Using Privileged Mode
For some platform configurations it is possible to deploy the NeuVector containers without requiring them to run in privileged mode. The configuration must support the ability to add capabilities and set the apparmor profile. Note that Docker DataCenter/UCP and Swarm currently do not support this, but it is still possible to deploy NeuVector manually using Compose or Run.

#### Deploy allinone (NO privileged mode) with docker-compose

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
neuvector/allinone
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
neuvector/allinone
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
neuvector/enforcer
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
neuvector/enforcer
```

### Deploy Separate NeuVector Components on Different Hosts
If planning to dedicate a docker host to a Controller and/or Manager (no Enforcer) these containers can be deployed individually instead of the Allinone. Note that docker does not support deploying the enforcer on the same node as the controller as separate components, requiring the use of the Allinone container if controller and enforcer functions are desired on a node. 


Controller compose file (replace [controller IP] with IP of the first controller node)
```
controller:
    image: neuvector/controller
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
docker run -itd --privileged --name neuvector.controller -e CLUSTER_JOIN_ADDR=controller_ip -p 18301:18301 -p 18301:18301/udp -p 18300:18300 -p 18400:18400 -p 10443:10443 -v /var/neuvector:/var/neuvector -v /var/run/docker.sock:/var/run/docker.sock:ro -v /proc:/host/proc:ro -v /sys/fs/cgroup/:/host/cgroup/:ro neuvector/controller
```

Manager compose file (replace [controller IP] with IP of controller node to connect to). The Docker UCP HRM service uses the default port 8443 which conflicts with the NeuVector console port. If using the default HRM port, then change the NeuVector port mapping in the example below to another port, for example 9443:8443 for the manager container as shown below.
```
manager:
    image: neuvector/manager
    container_name: nvmanager
    environment:
      - CTRL_SERVER_IP=[controller IP]
    ports:
      - 9443:8443
```

The compose file for the Enforcer:
```
enforcer:
    image: neuvector/enforcer
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
        - /lib/modules:/lib/modules
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

### Updating the NeuVector CVE Vulnerability Database
A container called the Updater is published and regularly updated on NeuVector’s Docker Hub. This image can be pulled, and when run it will update the CVE database used to scan for vulnerabilities. 

The sample neuvector-updater.yaml runs the updater and can be scripted with a cron job to periodically pull the latest image and run the updater. Replace the IP addresses in the sample below with one or more addresses for the NeuVector controllers.

```
updater:
  image: neuvector/updater
  container_name: updater
  environment:
    - CLUSTER_JOIN_ADDR=<ip1,ip2,...>
```

Then run the updater. It will update the database and the container will stop after completion.

```
docker-compose -f neuvector-updater.yaml up -d
```

You will be able to see the updater activity in the NeuVector logs (Events), as well as the updater container may be scanned by NeuVector while it was running.