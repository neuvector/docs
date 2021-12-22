---
title: Known Issues
taxonomy:
    category: docs
---

### Issues, Tips, and Bugs 
These are the currently known issues for deploying NeuVector

#### Upgrading to 2.5
This release add Process blocking for process profile rules. Services in Protect mode will now block unauthorized processes which are not in the whitelist. Consider switching to Monitor mode before the upgrade. After the upgrade, review Process violations for each service before switching back to Protect mode, adding Allowed processes to the rules if they should not be blocked.

#### Upgrading to 2.4
This release adds admission control and other features. There are changes to RBACs, permissions, services, and volume mounts required. See the section Rolling Updates in the Deploying in Production (Kubernetes or OpenShift) for deteails.

#### PKS Support - November 2018
NeuVector has limited support for PKS on docker run-time with NSX-T. The host path needs to be changed for the docker.sock in the sample Kubernetes yaml file.

```
hostPath:
           path: /var/vcap/sys/run/docker/docker.sock
```

The Docker CIS security benchmark is not supported on PKS due to these changes. Kubernetes CIS benchmark is supported.


#### Docker EE DataCenter/UCP/Swarm  May, 2017
Docker Enterprise Edition does not support deploying privileged containers or using the seccomp profile when deploying a service from UCP/DataCenter or Swarm. You should install docker-compose on the nodes and deploy using compose, or use docker run to deploy NeuVector. 

Tip: You can use docker -h to remotely deploy NeuVector to a docker host within a cluster.

#### Google Cloud Platform / Google Container Cluster Incompatible Jan, 2018

[Update May, 2019] The cos image is now supported for all modes including Protect, starting with the 2.4.0 version.

The default Node image ‘cos’ used when creating a container cluster is not compatible with NeuVector. Select the alternative image ‘Ubuntu’ when deploying the cluster. If cluster is already in production with default cos image, DO NOT put services in Protect mode. This will block all traffic to the service. The Discover and Monitor mode work as expected on cos. Google has indicated they will update the cos image in the fall 2018 to support NeuVector’s Protect mode operation.

#### Docker Kill and UCP  Aug 1, 2016
Do not use the Docker Kill command to stop a running NeuVector container. This may cause unexpected behavior. Use the docker stop or docker-compose stop to stop NeuVector.

Do not use Docker UCP to Stop or Remove Neuvector applications or containers. This may result in a docker kill being issued to quickly and cause unstable behavior.

#### Policy: Custom Groups and Rules versus Services  Mar 30, 2017
If you define your own Groups and Rules then you’ll need to keep track of which Services map to those Rules. Service protection modes (Discover, Monitor, Protect) can be applied only to NeuVector discovered Services. It is not possible to define your own Services in NeuVector.

For example, if a container with docker service name mysql starts running, NeuVector will create a service named nv.mysql, which can be put into different modes. If you create a custom Group which includes this service (using a custom label or other criteria), and also a Rule which includes the custom Group, it may not be clear what NeuVector service it applies to. It may be confusing to determine which services are covered by which rules. 

To check this, you can look at the Group and expand the Members tab below to see which containers are part of this Group.