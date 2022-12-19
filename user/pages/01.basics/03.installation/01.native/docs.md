---
title: Deployment Preparation
taxonomy:
    category: docs
---

### Understanding How to Deploy NeuVector
Deploy the NeuVector containers using Kubernetes, OpenShift, Rancher, Docker, or other platforms. Each type of NeuVector container has a unique purpose and may require special performance or node selection requirements for optimum operation.

The NeuVector open source images are hosted on Docker Hub at /neuvector/{image name}. 

See the [Onboarding/Best Practices section](/deploying/production?target=_blank#best-practices-tips-qa-for-deploying-and-managing-neuvector) to download an on boarding guide.


#### Deploy using Kubernetes, OpenShift, Rancher, or other Kubernetes-based tools
To deploy NeuVector using Kubernetes, OpenShift, Rancher or other orchestration tools, see the preparation steps and sample files in the section [Deploying NeuVector](/deploying/production#planning-deployments). This deploys manager, controller, scanner, and enforcer containers. For simple testing using the NeuVector Allinone container, see the section Special Use Cases with Allinone.

NeuVector supports Helm-based deployment with a Helm chart at [https://github.com/neuvector/neuvector-helm](https://github.com/neuvector/neuvector-helm).

Automated deployments are supported using Helm, Red Hat/Community Operators, the rest API, or a Kubernetes ConfigMap. See the section [Deploy Using ConfigMap](/deploying/production/configmap#kubernetes-configmap) for more details on automating deployment.

#### Deploy using Docker Native
Before you [deploy NeuVector](/deploying/docker) with docker run or compose, you MUST set the CLUSTER_JOIN_ADDR to the appropriate IP address. Find the node IP address, node name (if using a name server, or node variable (if using orchestration tools) for the allinone (controller) to use for the “node IP” in the docker-compose files for both allinone and enforcer.  For example:
```
- CLUSTER_JOIN_ADDR=192.168.33.10
```

For Swarm-Based deployments, also add the following environment variable:
```
- NV_PLATFORM_INFO=platform=Docker
```

See the section Deploying NeuVector -> [Docker Production Deployment](/deploying/docker) for instructions and examples.


#### Backing Up Configuration Files

By default NeuVector stores various config files in  /var/neuvector/config/backup on the Controller or Allinone node.

This volume can be mapped to [persistent storage](/deploying/production#backups-and-persistent-data) to maintain configuration. Files in the folder may need to be deleted in order to start fresh.

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

Also, you may need to ensure that other tools are not blocking access to the docker.sock interface.


#### Ports and Port Mapping
Make sure the required ports are mapped properly and open on the host. The Manager or Allinone requires 8443 (if using the console). The Allinone and Controller requires 18300, 18301, 18400, 18401 and optionally 10443, 11443, 20443, 30443. The Enforcer requires 18301 and 18401.

Note: If deploying docker native (including SWARM) make sure there is not any host firewall blocking access to required ports such as firewalld. If enabled, the docker0 interface must be added as a trusted zone for the allinone/controller hosts.

##### Port Summary

The following table lists communications from each NeuVector container. The Allinone container combines the Manager, Controller and Enforcer containers so requires the ports listed for those containers.

![Ports](Communication_Matrix_From_To.png)

The following table summarizes the listening ports for each NeuVector container.

![Listening](Communication_Matrix_Listening_Ports.png)

##### Additional Ports
In version 5.1, a new listener port has been added on 8181 in the controller for local controller communication only.
```
tcp        0      0 :::8181                 :::*                    LISTEN      8/opa
```
