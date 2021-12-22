---
title: Example: Docker EE
taxonomy:
    category: docs
---


### Deploy Using Docker Datacenter - UCP (EE)
It’s simple to deploy NeuVector using Docker UCP. First, pull the NeuVector images using Docker UCP in the Images menu. You may need to add a version number to get the latest version on Docker Hub.

Currently, Swarm/UCP does not support the seccomp capabilities (cap_add options) or deploying in ‘privileged mode’ so the NeuVector containers will need to be deployed from the command line using docker-compose or run. See the sample compose files for the allinone and enforcer below.

The Docker UCP HRM service uses the default port 8443 which conflicts with the NeuVector console port. If using the default HRM port, then change the NeuVector port mapping, for example 9443:8443 for the allinone container in the examples below. After the NeuVector application is successfully deployed, login to the console on port 9443 of the allinone host.

### Kubernetes on Docker EE
Docker EE does not support all of the Kubernetes features, so modification of the Kubernetes instructions and yaml files may be necessary.

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


### Deploy on Docker Swarm Using Privileged Mode

The following is an example of the docker-compose file to deploy the all-in-one container on the first node. Because the all-in-one container has an enforcer module inside, application containers on the same node can be secured. Both greenfield and brownfield deployment are supported.

Deploy all-in-one using docker-compose (privileged mode):

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
        - 9443:8443
    volumes:
        - /lib/modules:/lib/modules
        - /var/neuvector:/var/neuvector
        - /var/run/docker.sock:/var/run/docker.sock
        - /proc:/host/proc:ro
        - /sys/fs/cgroup:/host/cgroup:ro
```

The image pulled from the Docker registry normally has a version tag. Please modify the image name accordingly (e.g. neuvector/allinone:09.00.00129) if there is not one with a ‘latest’ tag.

The most important environment variable is the **CLUSTER_JOIN_ADDR**. It is the IP address that other enforcers connect to. Normally, it should be set to the IP address of the node where all-in-one container is running.

Port 18300 and 18301 are default ports for cluster communication. They must be identical for all controllers and enforcers in the cluster. Please refer to *"Docker-compose Details"* section for how to change the default ports.

Add an enforcer container using docker-compose (privileged mode)

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
        - /lib/modules:/lib/modules
        - /var/run/docker.sock:/var/run/docker.sock
        - /proc:/host/proc:ro
        - /sys/fs/cgroup/:/host/cgroup/:ro
```

The image pulled from the Docker registry normally has a version tag. Please modify the image name accordingly (e.g. neuvector/enforcer:09.00.00129) if there is not one with a ‘latest’ tag.

The most important environment variable is **CLUSTER_JOIN_ADDR**. For enforcers, replace ```<controller_node_ip>``` with the controller's node IP address. Typically, **CLUSTER_JOIN_ADDR** in the controller/all-in-one's docker-compose file and enforcer's docker-compose file have the same value.

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
