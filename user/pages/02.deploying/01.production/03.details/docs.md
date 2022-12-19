---
title: Environment Variables Details
taxonomy:
    category: docs
---

### Environment Variables

##### For Both Controller (Allinone) and Enforcer
* CLUSTER_JOIN_ADDR
> Set the variable to the host IP for the first controller; and set it to the master controller's host IP for other controllers and enforcers. It’s not necessary to set this IP for Kubernetes based deployments, just use the sample file.

* CLUSTER_LAN_PORT
> (Optional) Cluster Serf LAN port. Both TCP and UDP ports must be mapped to the host directly. Optional if there is no port conflict on the host. Default ```18301```

* DOCKER_URL
> (Optional) If the docker engine on the host does not bind on the normal Unix socket, use this variable to specify the TCP connection point, in the format of ```tcp://10.0.0.1:2376```.

* NV_PLATFORM_INFO
> (Optional) Use value platform=Docker for Docker Swarm/EE deployments, or platform=Kubernetes:GKE for GKE (to run GKE CIS Benchmarks).

##### Controller
* CTRL_PERSIST_CONFIG
> (Optional) To backup configuration files and restore them from a persistent volume. Add this to the yaml to enable; remove to disable.

* CLUSTER_RPC_PORT
> (Optional) Cluster server RPC port. Must be mapped to the host directly. The environment variable is optional if there is no port conflict on the host. Default ```18300```

* CTRL_SERVER_PORT
> (Optional) HTTPS port that the REST server should be listening on. Default is ```10443```. Normally it can be left as default and use docker port option to map the port on the host.

* DISABLE_PACKET_CAPTURE
> (Optional) Add this to the yaml to disable packet capture; remove to re-enable (default).

* NO_DEFAULT_ADMIN 
> (Optional) When enabled does not create an 'admin' user in the local cluster. This is used for Rancher SSO integration as the default. If not enabled, persistently warn the user and record events to change the default admin password if it is not changed from default.


##### Manager
* CTRL_SERVER_IP
> (Optional for all-in-one) Controller REST server IP address. Default is ```127.0.0.1```. For all-in-one container, leave it as default. If the Manager is running separately, the Manager must specify this IP to connect to the controller.

* CTRL_SERVER_PORT
> (Optional for all-in-one) Controller REST server port. Default is ```10443```. For all-in-one container, leave it as default. If the Manager is running separately, the Manager should specify this variable to connect to the controller.

* MANAGER_SERVER_PORT
> (Optional) Manager UI port. Default is ```8443```. Unless the Manager is running in host mode, leave it and user docker port option to map the port on the host.

* MANAGER_SSL
> (Optional) Manager by default uses and HTTPS/SSL connection. Set the value to “off” to use HTTP.

##### Enforcer
* CONTAINER_NET_TYPE
> (Optional) To support special network plug-in set value to "macvlan”

* ENF_NO_SECRET_SCANS
> (Optional) Set the value to “1” to disable scanning for secrets in files (improves performance).

* ENF_NO_AUTO_BENCHMARK
> (Optional) Set the value to “1” to disable CIS benchmarks on host and containers (improves performance).

* ENF_NO_SYSTEM_PROFILES
> (Optional) Set the value to "1" to disable the process and file monitors. No learning processes, no profile modes, no process/file (package) incidents, and no file activity monitor will be performed. This will reduce CPU/memory resource usage and file operations.


### Open Ports

* CLUSTER_RPC_PORT - on controller and all-in-one. Default 18300.
* CLUSTER_LAN_PORT - on controller, enforcer and all-in-one. Default 18301.
* MANAGER_SERVER_PORT - on manager or all-in-one. Default 8443.
* CTRL_SERVER_PORT - on controller. Default 10443.

Please see the section [Deployment Preparation](/basics/installation/native) for a full description of the port communication requirements for the NeuVector containers.

