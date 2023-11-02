---
title: System Requirements
taxonomy:
    category: docs
---

#### System Requirements

| Component  | # of Instances                    | Recommended vCPU | Minimum Memory | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|------------|-----------------------------------|------------------|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Controller | min. 1<br />3 for HA (odd # only) | 1                | 1GB            | vCPU core may be shared                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Enforcer   | 1 per node/VM                     | 1+               | 1GB            | One or more dedicated vCPU for higher network throughput in Protect mode                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Scanner    | min. 1<br />2+ for HA/Performance | 1                | 1GB            | CPU core may be shared for standard workloads.<br />Dedicate 1 or more CPU for high volume (10k+) image scanning.<br />Registry image scanning is performed by the scanner and managed by the controller and the image is pulled by the scanner and expanded in memory.<br />The minimum memory recommendation assumes images to be scanned are not larger than .5GB.<br />When scanning images larger than 1GB, scanner memory should be calculated by taking the largest image size and adding .5GB.<br />Example - largest image size = 1.3GB, the scanner container memory should be 1.8GB |
| Manager    | min 1<br />2+ for HA              | 1                | 1GB            | vCPU may be shared                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

* For configuration backup/HA, a RWX PVC of 1Gi or more. See [Backups and Persistent Data section](/deploying/production#backups-and-persistent-data) for more details.
* Recommended browser: Chrome for better performance

#### Supported Platforms
* Officially supported linux distributions, SUSE Linux, Ubuntu, CentOS/Red Hat (Including all RHEL version e.g. 6/7/8), Debian, Rancher OS, CoreOS, AWS 'Bottlerocket'(see Note below) and Photon.
* CoreOS is supported (November 2023) for CVE scanning through RHEL mapping table provided by RedHat. Once an official feed is published by RedHat for CoreOS it will be supported.
* Officially supported Kubernetes and Docker compliant container management systems. The following platforms are tested with every release of NeuVector: Kubernetes 1.19+, SUSE Rancher (RKE, RKE2, K3s etc), RedHat OpenShift 4.6+ (3.x to 4.12 supported prior to NeuVector 5.2.x), Google GKE, Amazon EKS, Microsoft Azure AKS, IBM IKS, native docker, docker swarm. The following Kubernetes and docker compliant platforms are supported and have been verified to work with NeuVector: VMware Photon and Tanzu, SUSE CaaS, Oracle OKE, Mirantis Kubernetes Engine, Nutanix Kubernetes Engine, docker UCP/DataCenter, docker Cloud.
* Docker run-time version: 1.9.0 and up; Docker API version: 1.21, CE and EE.
* Containerd and CRI-O run-times (requires changes to volume paths in sample yamls). See changes required for Containerd in the Kubernetes deployment section and CRI-O in the OpenShift deployment section.
* NeuVector is compatible with most commercially supported CNI's. Officially tested and supported are openshift ovs (subnet/multitenant), calico, flannel, cilium, antrea and public clouds (gke, aks, iks, eks).
* Console: Chrome or Firefox browser recommended. IE 11 not supported due to performance issues.
* Minikube is supported for simple initial evaluation but not for full proof of concept. See below for changes required for the Allinone yaml to run on Minikube.

AWS Bottlerocket Note: Must change path of the containerd socket specific to Bottleneck. Please see Kubernetes deployment section for details.

#### Not Supported
* GKE Autopilot.
* AWS ECS is no longer supported. (NOTE: No functionality has been actively removed for operating NeuVector on ECS deployments. However, testing on ECS is no longer being perfromed by SUSE. While protecting ECS worlloads with Neuvector likely will operate as expected, issues will not be investigated.)
* Docker on Mac
* Docker on Windows
* ARM architectire is not currently supported, but being worked on for future releases.
* Rkt (container linux) from CoreOS
* AppArmor on K3S / SLES environments. Certain configurations may conflict with NeuVector and cause scanner errors; AppArmor should be disabled when deploying NeuVector.
* IPv6 is not supported
* VMWare Integrated Containers (VIC) except in nested mode
* CloudFoundry
* Console: IE 11 not supported due to performance issues.
* Nested container host in a container tools used for simple testing. For example, deployment of a Kubernetes cluster using 'kind' https://kind.sigs.k8s.io/docs/user/configuration/.

Note 1: PKS is field tested and requires enabling privileged containers to the plan/tile, and changing the yaml hostPath as follows for Allinone, Controller, Enforcer:
<pre>
<code>      hostPath:
            path: /var/vcap/sys/run/docker/docker.sock</code>
</pre>

Note 2: NeuVector supports running on linux-based VMs on Mac/Windows using Vagrant, VirtualBox, VMware or other virtualized environments.

##### Minikube 
Please make the following changes to the Allinone deployment yaml.
```
apiVersion: apps/v1 <<-- required for k8s 1.19
kind: DaemonSet
metadata:
 name: neuvector-allinone-pod
 namespace: neuvector
spec:
 selector: <-- Added
 matchLabels: <-- Added
 app: neuvector-allinone-pod <-- Added
 minReadySeconds: 60
...
 nodeSelector: <-- DELETE THIS LINE 
 nvallinone: "true" <-- DELETE THIS LINE 
apiVersion: apps/v1 <<-- required for k8s 1.19
kind: DaemonSet
metadata:
 name: neuvector-enforcer-pod
 namespace: neuvector
spec:
 selector: <-- Added
 matchLabels: <-- Added
 app: neuvector-enforcer-pod <-- Added
```

#### Performance and Scaling
As always, performance planning for NeuVector containers will depend on several factors, including:
+ (Controller & Scanner) Number and size of images in registry to be scanned (by Scanner) initially
+ (Enforcer) Services mode (Discover, Monitor, Protect), where Protect mode runs as an inline firewall 
+ (Enforcer) Type of network connections for workloads in Protect mode

In Monitor mode (network filtering similar to a mirror/tap), there is no performance impact and the Enforcer handles traffic at line speed, generating alerts as needed. In Protect mode (inline firewall), the Enforcer requires CPU and memory to filter connections with deep packet inspection and hold them to determine whether they should be blocked/dropped. Generally, with 1GB of memory and a shared CPU, the Enforcer should be able to handle most environments while in Protect mode. 

For throughput or latency sensitive environments, additional memory and/or a dedicated CPU core can be allocated to the NeuVector Enforcer container.

For performance tuning of the Controller and Scanner for registry scanning, see System Requirements above.

For additional advice on performance and sizing, see the [Onboarding/Best Practices section](/deploying/production?target=_blank#best-practices-tips-qa-for-deploying-and-managing-neuvector).

##### Throughput
As the chart below shows, basic throughput benchmark tests showed a maximum throughput of 1.3 Gbps PER NODE on a small public cloud instance with 4 CPU cores. For example, a 10 node cluster would then be able to handle a maximum of 13 Gbps of throughput for the entire cluster for services in Protect mode. 

![Throughput](throughput.png)

This throughput would be projected to scale up as dedicated a CPU is assigned to the Enforcer, or the CPU speed changes, and/or additional memory is allocated. Again, the scaling will be dependent on the type of network/application traffic of the workloads.

##### Latency 
Latency is another performance metric which depends on the type of network connections. Similar to throughput, latency is not affected in Monitor mode, only for services in Protect (inline firewall) mode. Small packets or simple/fast services will generate a higher latency by NeuVector as a percentage, while larger packets or services requiring complex processing will show a lower percentage of added latency by the NeuVector enforcer.

The table below shows the average latency of 2-10% benchmarked using the Redis benchmark tool. The Redis Benchmark uses fairly small packets, so the the latency with larger packets would expected to be lower.

| Test | Monitor | Protect | Latency |
| ------ | ----------- | -------------- | ------- |
| PING_INLINE | 34,904 | 31,603 | 9.46% |
| SET | 38,618 | 36,157 | 6.37% |
| GET | 36,055 | 35,184 | 2.42% |
| LPUSH | 39,853 | 35,994 | 9.68% |
| RPUSH | 37,685 | 36,010 | 4.45% |
| LPUSH (LRANGE Benchmark) | 37,399 | 35,220 | 5.83% |
| LRANGE_100 | 25,539 | 23,906 | 6.39% |
| LRANGE_300 | 13,082 | 12,277 | 6.15% |


The benchmark above shows average TPS of Protect mode versus Monitor mode, and the latency added for Protect mode for several tests in the benchmark. The main way to lower the actual latency (microseconds) in Protect mode is to run on a system with a faster CPU. You can find more details on this open source Redis benchmark tool at https://redis.io/topics/benchmarks.




