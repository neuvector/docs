---
title: General Guidelines
taxonomy:
    category: docs
---


### Testing NeuVector Using the Allinone Container
The examples in this section deploy the Allinone and Enforcer containers. This is useful for trying out NeuVector. For production deployments where the Manager, Controller, and Enforcers can all be deployed separately, please see the section Deploying NeuVector.

### General Guidelines for Deployment
Prepare your host environment for proper installation. Make sure the NeuVector containers can communicate with each other between hosts. Then review and edit the sample files for you environment.

Generally, it is important to do the following: 
1. Label nodes appropriately. If you use node labels to control where the allinone or controller is deployed, label them before deploying.
2. Make sure volumes can be mapped properly. For example
```
volumes:
        - /var/neuvector:/var/neuvector
        - /var/run/docker.sock:/var/run/docker.sock
        - /proc:/host/proc:ro
        - /sys/fs/cgroup:/host/cgroup:ro
```
3. Open required ports on hosts. Make sure the required ports are mapped properly and open on the host. The allinone requires 8443 (if using the console), 18300, 18301, 18400, and 18401. The Enforcer requires 18301 and 18401.
4. (Docker native only) Edit the CLUSTER_JOIN_ADDR. Find the node IP address, node name (if using a name server, or node variable (if using orchestration tools) for the allinone (controller) to use for the “node IP” in the sample files for both allinone and enforcer.

### Helm Deployment
Automated deployment using helm is available is at https://github.com/neuvector/neuvector-helm.

### Accessing the Console
Please see the first section Basics -> Connect to Manager for options for turning off https or accessing the console through a corporate firewall which does not allow port 8443 for the console access.


