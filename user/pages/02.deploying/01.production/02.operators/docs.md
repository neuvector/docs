---
title: Deploy Using Operators
taxonomy:
    category: docs
---


### Operators
Operators take human operational knowledge and encode it into software that is more easily shared with consumers. Operators are pieces of software that ease the operational complexity of running another piece of software. More technically, Operators are a method of packaging, deploying, and managing a Kubernetes application.

### NeuVector Operators
The NeuVector Operator is based on the NeuVector Helm chart. The NeuVector RedHat OpenShift Operator runs in the OpenShift container platform to deploy and manage the NeuVector Security cluster components. The NeuVector Operator contains all necessary information to deploy NeuVector using Helm charts. You simply need to install the NeuVector operator from the OpenShift embedded Operator hub and create the NeuVector instance.

To deploy the latest NeuVector container versions, please use either the [Red Hat Certified Operator](https://catalog.redhat.com/software/operators/search?q=neuvector) from Operator Hub or the [community operator](https://github.com/redhat-openshift-ecosystem/community-operators-prod/tree/main/operators/neuvector-community-operator). Documentation for the community operator can be found [here](https://github.com/neuvector/neuvector-operator).

**Note about SCC and Upgrading**

Privileged SCC is added to the Service Account specified in the deployment yaml by Operator version 1.3.4 and above in new deployments. In the case of upgrading the NeuVector Operator from a previous version to 1.3.4, please delete Privileged SCC before upgrading.
```
oc delete rolebinding -n neuvector system:openshift:scc:privileged
```

**Important**: NeuVector Certified Operator versions are tied to NeuVector product versions, and each new version must go through a certification process with Red Hat before being published. Certified operator version 1.3.9 is tied to NeuVector version 5.2.0. Certified operator version 1.3.7 is tied to NeuVector version 5.1.0. Version 1.3.4 operator version is tied to NeuVector 5.0.0. If you wish to be able to change the version tags of the NeuVector containers deployed, please use the Community version.


<html>
<head>
<link rel="stylesheet" href="/deploying/production/operators/toggle-box.css" type="text/css" />
</head>
<body>
<div id="full-wrapper">
  <ul class="dopt-accordion fixed-height arrow-tri">  
<!-- NOTE: Toggle Box #1 -->
	<input class="title-option" id="acccert" name="accordion-1" type="checkbox" />
  <label class="title-panel" onClick="" for="acccert"><span><i class="icon-code"></i>Deploy Using Certified Operator</span></label>
  <!-- NOTE: Toggle box content animation option -->
  <div class="accordion-content animated animation5">
  <div class="wrap-content">

<p><strong>Deploy Using the Red Hat Certified Operator from Operator Hub</strong>
</p>

<p>Important: NeuVector Operator versions are tied to NeuVector product versions, and each new product version must go through a certification process with Red Hat before being published.
&nbsp;</p>

<p><strong>Technical notes</strong>
&nbsp;
<ul>
<li>- NeuVector container images are pulled from registry.connect.redhat.com using the RedHat market place image pull secret.</li>
<li>- The NeuVector manager UI is typically exposed via an OpenShift passthrough route on a domain. For example, on IBM Cloud neuvector-route-webui-neuvector.(cluster_name)-(random_hash)-0000.(region).containers.appdomain.cloud. It can also be exposed as the service neuvector-service-webui through a node port address or public IP.</li>
<li>- OpenShift version >=4.6.</li>
</ul></p>
<p>
<ol><li>Create the project neuvector.
<pre>
<code>
oc new-project neuvector</code></pre></li>

<li>Apply security context constraint (SCC) to grant default service account in neuvector namespace to run privileged containers.
<pre>
<code>
oc adm policy add-scc-to-user privileged --serviceaccount default --namespace neuvector</code></pre></li>

<li>Install the RedHat Certified Operator from the Operator Hub
<p><ul>
<li>- In the OpenShift Console UI, navigate to OperatorHub</li>
<li>- Search for NeuVector Operator and select the listing without community or marketplace badge</li>
<li>- Click Install</li>
</ul></p>
</li>
<li>Configure update channel
  <p><ul>
  <li>- Current latest channel is beta, but may be moved to stable in the future</li>
  <li>- Select stable if available</li></ul></p>
</li>
<li>Configure installation mode and installed namespace
<p><ul>
<li>- Select specific namespace on the cluster</li>
<li>- Select neuvector as installed namespace</li>
<li>- Configure approval strategy</li>
</ul></p>
</li>
<li>Confirm Install</li>
<li>Prepare the YAML configuration values for the NeuVector installation as shown in the sample screen shot below. The YAML presented in the OpenShift Console provides all available configuration options and their default values.
<img src="/deploying/production/operators/operator_cert.png"></li>

<li>When the operator is installed and ready for use, a NeuVector instance can be installed.
<p><ul>
<li>- Click View operator (after the operator installation) or select the NeuVector Operator from the Installed operators view</li>
<li>- Click Create instance</li>
<li>- Select Configure via YAML View</li>
<li>- Paste the prepared YAML configuration values</li>
<li>- Click Create</li>
</ul></p>
</li>

<li>Verify the installation of the NeuVector instance
<p><ul>
<li>- Navigate to the Operator Details of the NeuVector Operator</li>
<li>- Open the NeuVector tab</li>
<li>- Select the neuvector-default instance</li>
<li>- Open the Resources tab</li>
<li>- Verify that resources are in status Created or Running</li>
</ul></p>
</li>
</ol>
</p>
<p>After you have successfully deployed the NeuVector Platform to your cluster, login to the NeuVector console at https://neuvector-route-webui-neuvector.(OC_INGRESS).
<ul>
<li>- Login with the initial username admin and password admin.</li>
<li>- Accept the NeuVector end user license agreement.</li>
<li>- Change the password of the admin user.</li>
</ul>
Optionally, you can also create additional users in the Settings -> Users & Roles menu.
&nbsp;</p>
<p>Now you are ready to navigate the NeuVector console to start vulnerability scanning, observe running application pods, and apply security protections to containers.
&nbsp;</p>
<p><strong>Upgrading NeuVector</strong>
&nbsp;</p>
Upgrade the NeuVector version by updating the Operator version which is associated with the desired NeuVector version.
  </div><!-- End .wrap-content -->    
  </div><!-- End .accordion-content -->
</div>
</body>
</html>
<html>
<head>
<link rel="stylesheet" href="/deploying/production/operators/toggle-box.css" type="text/css" />
</head>
<body>
<div id="full-wrapper">
  <ul class="dopt-accordion fixed-height arrow-tri">  

<!-- NOTE: Toggle Box #2 -->
	<input class="title-option" id="acccomm" name="accordion-1" type="checkbox" />
  <label class="title-panel" onClick="" for="acccomm"><span><i class="icon-code"></i>Deploy Using Community Operator</span></label>
  <!-- NOTE: Toggle box content animation option -->
  <div class="accordion-content animated animation5">
  <div class="wrap-content">
<p><strong>Deploy Using the NeuVector Community Operator from Operator Hub</strong>
&nbsp;</p>
<p><strong>Technical notes</strong>
&nbsp;</p>
<ul>
<li>- NeuVector container images are pulled from Docker Hub from the NeuVector account. </li>
<li>- NeuVector manager UI is typically exposed via an OpenShift passthrough route on a domain. For example, on IBM Cloud neuvector-route-webui-neuvector.(cluster_name)-(random_hash)-0000.(region).containers.appdomain.cloud. It can also be exposed as the service neuvector-service-webui through a node port address or public IP.</li>
<li>- OpenShift version 4.6+</li>
<li>- It is recommendeded to review and modify the NeuVector installation configuration by modifying the yaml values before creating the NeuVector instance. Examples include imagePullSecrets name, tag version, ingress/console access, multi-cluster federation, persistent volume PVC etc. Please refer to the Helm instructions at https://github.com/neuvector/neuvector-helm for the values that can be modified during installation.
</li></ul>
<p>
&nbsp;
<ol><li>Create the project neuvector
<pre>
<code>
oc new-project neuvector</code></pre>
</li>

<li>Apply security context constraint (SCC) to grant default service account in neuvector namespace to run privileged containers.
<pre>
<code>
oc adm policy add-scc-to-user privileged --serviceaccount default --namespace neuvector</code></pre>
</li>

<li>Install the NeuVector Community Operator from the Operator Hub
<p><ul>
<li>- In the OpenShift Console UI, navigate to OperatorHub</li>
<li>- Search for NeuVector Operator and select the listing with the community badge</li>
<li>- Click Install</li>
<li>- Configure update channel. Current latest channel is beta, but may be moved to stable in the future. Select stable if available.</li>
<li>- Configure installation mode and installed namespace</li>
<li>- Select specific namespace on the cluster</li>
<li>- Select neuvector as installed namespace</li>
<li>- Configure approval strategy</li>
<li>- Confirm Install</li>
</ul>
</li>

<li>Download the Kubernetes secret manifest which contains the credentials to access the NeuVector container registry. Save the YAML manifest file to ./neuvector-secret-registry.yaml.</li>

<li>Apply the Kubernetes secret manifest containing the registry credentials.
<pre>
<code>
kubectl apply -n neuvector -f ./neuvector-secret-registry.yaml</code></pre>
</li>

<li>
Prepare the YAML configuration values for the NeuVector installation starting from the following YAML snippet. Be sure to specify the desired NeuVector version in the 'tag' value. Check the reference of values in the NeuVector Helm chart to get available configuration options. There are other possible Helm values which can be configured in the YAML, such as whether you will configure the cluster to allow multi-cluster management by exposing the Master (Federated Master) or remote (Federated Worker) services.

<pre>
<code>
apiVersion: apm.neuvector.com/v1alpha1
kind: Neuvector
metadata:
  name: neuvector-default
  namespace: neuvector
spec:
  openshift: true
  tag: 4.3.0
  registry: docker.io
  exporter:
    image:
      repository: prometheus-exporter
      tag: 0.9.0
  manager:
    enabled: true
    env:
      ssl: true
    image:
      repository: manager
    svc:
      type: ClusterIP
      route:
        enabled: true
        termination: passthrough
  enforcer:
    enabled: true
    image:
      repository: enforcer
  cve:
    updater:
      enabled: true
      image:
        repository: updater
        tag: latest
      schedule: 0 0 * * *
    scanner:
      enabled: true
      replicas: 3
      image:
        repository: scanner
        tag: latest
  controller:
    enabled: true
    image:
      repository: controller
    replicas: 3</code></pre>
</li>

<li>When the operator is installed and ready for use, a NeuVector instance can be installed.
<ul>
<li>- Click View operator (after the operator installation) or select the NeuVector Operator from the Installed operators view</li>
<li>- Click Create instance</li>
<li>- Select Configure via YAML View</li>
<li>- Paste the prepared YAML configuration values</li>
<li>- Click Create</li>
</ul>
</li>

<li>Verify the installation of the NeuVector instance.
<ul>
<li>- Navigate to the Operator Details of the NeuVector Operator</li>
<li>- Open the NeuVector tab</li>
<li>- Select the neuvector-default instance</li>
<li>- Open the Resources tab</li>
<li>- Verify that resources are in status Created or Running</li>
</ul>
</li>


<li>After you have successfully deployed the NeuVector Platform to your cluster, login to the NeuVector console at https://neuvector-route-webui-neuvector.(INGRESS_DOMAIN).
<ul>
<li>- Login with the initial username admin and password admin.</li>
<li>- Accept the NeuVector end user license agreement.</li>
<li>- Change the password of the admin user.</li>
<li>- Optionally, you can also create additional users in the Settings -> Users & Roles menu.</li>
</ul>
</li>
</ol>

</p>
<p>Now you are ready to navigate the NeuVector console to start vulnerability scanning, observe running application pods, and apply security protections to containers.

&nbsp;</p>

<p><strong>Upgrading NeuVector</strong>
&nbsp;</p>

<ol><li>From Operators > Installed Operators > NeuVector Operator
<img src="/deploying/production/operators/1_Installed.png"></li>

<li>Click on NeuVector to list instances
<img src="/deploying/production/operators/2_Instance.png"></li>

<li>Click on YAML to edit parameters
<img src="/deploying/production/operators/3_YAML.png"></li>

<li>Update tag and click Save
<img src="/deploying/production/operators/4_tag_save.png"></li>
</ol>
  </div><!-- End .wrap-content -->    
  </div><!-- End .accordion-content -->
</div>
&nbsp;
</body>
</html>
###Troubleshooting
+ Check the Operator deployment values in the deployed yaml file
+ Verify that security context constraint (SCC) for NeuVector in step 2 was successfully added
+ Review and check the NeuVector Helm chart values
+ Make sure the registry path and version tag is set properly (community operator; certified will use the defaults)
+ Make sure the route to the NeuVector manager service neuvector-route-webui is configured

