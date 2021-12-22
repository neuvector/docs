---
title: Overview - Version 3.x
taxonomy:
    category: docs
---

## Archived Version 3.x Documentation

### The Full Life-Cycle Container Security Platform
NeuVector provides a powerful end-to-end container security platform. This includes end-to-end vulnerability scanning and complete run-time protection for containers, pods and hosts, including:
<ol>
<li>CI/CD Vulnerability Management & Admission Control. Scan images with a Jenkins plug-in, scan registries, and enforce admission control rules for deployments into production.
<li>Violation Protection. Discovers behavior and creates a whitelist based policy to detect violations of normal behavior.</li>
<li>Threat Detection. Detects common application attacks such as DDoS and DNS attacks on containers.</li>
<li>Run-time Vulnerability Scanning. Scans registries, images and running containers orchestration platforms and hosts for common (CVE) as well as application specific vulnerabilities.</li>
<li>Compliance & Auditing. Runs Docker Bench tests and Kubernetes CIS Benchmarks automatically.
<li>Endpoint/Host Security. Detects privilege escalations, monitors processes and file activity on hosts and within containers, and monitors container file systems for suspicious activity.</li>
</ol>
Other features of NeuVector include the ability to quarantine containers and to export logs through SYSLOG and webhooks, initiate packet capture for investigation, and integration with OpenShift RBACs, LDAP, Microsoft AD, and SSO with SAML.

### Security Containers

The NeuVector run-time container security solution contains three types of security containers: **Controllers**, **Enforcers** and **Managers**.

NeuVector can be deployed on virtual machines or on bare metal systems with a single os.
![Deployment](1Overview.png)

##### Controller
The Controller manages the NeuVector Enforcer container cluster. It also provides REST APIs for the management console. Although typical test deployments have one Controller, multiple Controllers in a high-availability configuration is recommended. 3 controllers is the default in the Kubernetes Production deployment sample yaml.

##### Enforcer
The Enforcer is a lightweight container that enforces the security policies. One enforcer should be deployed on each node (host).

Note:  For Docker native (non Kubernetes) deployments the Enforcer container and the Controller cannot be deployed on the same node (except in the All-in-One case below).

##### Manager
The Manager is a stateless container that provides a web-UI (HTTPS only) and CLI console for users to manage the NeuVector security solution. More than one Manager container can be deployed as necessary.

##### All-in-One
The All-in-One container includes a Controller, an Enforcer and a Manager in one package. It's useful for easy installation in single-node or small-scale deployments.


##### Updater
The Updater is a container which, when run, updates the CVE database for NeuVector. NeuVector regular publishes new Updater images to include the latest CVE for vulnerability scans. See the section Deployment in Production to learn how to run a cron job to regularly update the database.

#### Architecture
Here is a general architecture overview of NeuVector.
![Architecture](architecture.png)

### Deployment Examples

##### All-in-One and Enforcers
This deployment is ideal for single-node or small-scale environments, for example for evaluation, testing, and small deployments. An All-in-One container is deployed on one node, which can also be a node with running application containers. An Enforcer can be deployed on all other nodes, with one Enforcer required on each node you wish to protect with NeuVector. This is also useful for native Docker deployments where a controller and enforcer cannot run on the same host.

##### Controller, Manager and Enforcer Containers
This is a more generic deployment use case which consists one or more Controllers, one Manager and a set of Enforcers. The Controller and Manager can be deployed on the same node or on different nodes than the Enforcer.

##### All-in-One Only 
You can deploy just the allinone container for registry scanning, using the Jenkins plug-in, or simple one node testing of NeuVector.

##### Controller Only
It is possible to deploy a single Controller container to manage vulnerability scanning outside a cluster, for example for use with the Jenkins plug-in. Registry scanning can also be performed by the Controller using the REST API exclusively, but typically a Manager container is also desired in order to provide console based configuration and results viewing for registry scanning.

