---
title: Example: Rancher
taxonomy:
    category: docs
---


### Deploy Using Rancher
Contact NeuVector to request access to the Docker private registry. You may need to make a few edits to the config file below for Rancher. Then you can login to the Rancher console and add NeuVector to the Rancher Catalog. 

Note: Deployment on Rancher 2.x/Kubernetes should follow the Kubernetes reference setion and/or Helm based deployments.

Deploy the NeuVector components.

1. Pick the node where the allinone is to be deployed. Label it with "nvallinone=true".

2. Update the allinone and enforcer CLUSTER_JOIN_ADDR to be the IP address of the allinone node in the sample yaml file.

3. Deploy the catalog neuvector.yml, and the allinone will be deployed on the labelled node, and enforcers will be deployed on the rest of nodes. (The sample file can be modified so that enforcers are only deployed to specified nodes.)

You can then verify that the Enforcer and Allinone containers are running properly. Then log into the NeuVector console to see the services and containers which have been discovered.

Sample Rancher config file:

```
allinone:
   image: neuvector/allinone
   pid: host
   restart: always
   privileged: true
   environment:
     - CLUSTER_JOIN_ADDR=allinone
   ports:
     - 8443:8443
   volumes:
     - /lib/modules:/lib/modules
     - /var/run/docker.sock:/var/run/docker.sock
     - /proc:/host/proc:ro
     - /sys/fs/cgroup:/host/cgroup:ro
     - /var/neuvector:/var/neuvector
   labels:
     io.rancher.scheduler.global: true
     io.rancher.scheduler.affinity:host_label: "nvallinone=true"
enforcer:
   image: neuvector/enforcer
   pid: host
   restart: always
   privileged: true
   environment:
     - CLUSTER_JOIN_ADDR=allinone
   volumes:
     - /lib/modules:/lib/modules
     - /var/run/docker.sock:/var/run/docker.sock
     - /proc:/host/proc:ro    
     - /sys/fs/cgroup/:/host/cgroup/:ro
   labels:
     io.rancher.scheduler.global: true
     io.rancher.scheduler.affinity:host_label_ne: "nvallinone=true"
```

