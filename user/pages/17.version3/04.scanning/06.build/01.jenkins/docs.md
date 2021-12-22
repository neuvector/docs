---
title: Jenkins Details
taxonomy:
    category: docs
---

### Detailed Configuration for the Jenkins Plugin

Containers provide an easy and efficient way to deploy applications. But container images may contain open source code over which you don't have a full control. Many vulnerabilities in open source projects have been reported, and you may decide to use these libraries with vulnerabilities or not after scanning the images and reviewing the vulnerability information for them.

The NeuVector Vulnerability Scanner Jenkins plugin can scan the images after your image is built in Jenkins. 

#### Jenkins Plugin Installation
First, go to Jenkins in your browser to search for the NeuVector plug-in. This can be found in:

-&gt; Manage Jenkins -&gt; Manage Plugins -&gt; Available -&gt; filter -&gt; search `Neuvector Vulnerability Scanner` -&gt;

Select it and click `install without restart.'

Deploy the NeuVector Allinone or Controller container if you haven't already done so on a host reachable by the Jenkins server. This can be on the same server as Jenkins if desired. Make a note of the IP address of the host where the Allinone or Controller is running. Note: The default REST API port is 10443. This port must be exposed through the Allinone or Controller through a service in Kubernetes or a port map (e.g. - 10443:10443) in the Docker run or compose file.

Important! Remember to apply the NeuVector license file provided to you through the console, CLI, or REST API. The scans will not work if the controller/allinone does not have a valid license.

There are two scenarios for image scanning, local and registry scanning.
<ol>
 	<li><strong>Local Image Scan</strong>. If you use the plugin to scan local images (before pushing to any registries), you can scan on the same host as the controller/allinone or configure the scanner to access the docker engine on a remote host.</li>
 	<li><strong>Registry Image Scan</strong>. If you use the plugin to scan registry images (after pushing to any registries, but as part of the Jenkins build process), the NeuVector Scanner can be installed on any node in the network with connectivity between the registry, NeuVector Scanner, and Jenkins.</li>
</ol>

#### Global Configuration in Jenkins
After installing the plugin, find the ‘NeuVector Vulnerability Scanner’ section in the global configuration page (Jenkins ‘Configure System’). Enter values for the NeuVector Controller IP, port, username, and password. You may click the ‘Test Connection’ button to validate the values. It will show ‘Connection Success’ or an error message.

The timeout minutes value will terminate the build step within the time entered. The default value of 0 means no timeout will occur.

Click the ‘Add Registry’ to enter values for the registry you will use in your project. If you will be only scanning local images, you don’t need to add a registry here.

Scenario 1: global configuration example for local image scan


![global-image](jenkins1a.png)

Scenario 2: global configuration example for registry image scan

![global-registry](jenkins2a.png)


#### Local Configuration

<strong>Prerequisites for Local Scan on a Remote Docker Host</strong>
To enable NeuVector to scan an image that is not on the same host as the controller/allinone:
+ Make sure the docker run-time api socket is exposed via TCP
+ Add the following environment variable to the controller/allinone: SCANNER_DOCKER_URL=tcp://192.168.1.10:2376

<strong>Configuration</strong>

In your project, choose the 'NeuVector Vulnerability Scanner' plugin from the drop down menu in the 'Add build step.' Choose Local or a registry name which is the nickname you entered in global config. Enter the repository and image tag name to be scanned. You may choose Jenkins default environment variables for the repository or tag, e.g. $JOB_NAME, $BUILD_TAG, $BUILD_NUMBER. Enter the values for the number of high or medium, and for any name of the vulnerabilities present to fail the build.
After the build is finished, a NeuVector report will be generated. It will show the scan details and errors if any.

Scenario 1: local configuration example

![local-image](jenkins3a.png)

Scenario 2: registry configuration example

![local-registry](jenkins4a.png)


#### Jenkins Pipeline
For the Jenkins pipeline project, you may write your own pipeline script directly, or click the ‘pipeline syntax’ to generate the script if you are new to the pipeline style task.

![pipeline](jenkins5a.png)
<img class="alignnone size-full wp-image-4252" src="https://neuvector.com/wp-content/uploads/2018/07/jenkins5a.png" alt="" width="252" height="363" />

Select the NeuVector Vulnerability Scanner from the drop-down, configure it, and Generate the script.

![script](jenkins6a.png)

Copy the script into your Jenkins task script.

Simple pipeline script example (to insert into your pipeline script):
<pre>
<code>...
  stage('Scan image') {
    neuvector registrySelection: 'Local', repository: 'alpine'
  }
...</code>
</pre>


#### Additional Stages
Add your own pre- and post- image scan stages, for example in the Pipeline stage view example below.

![stages](jenkins7a.png)

You are now ready to start your Jenkins builds and trigger the NeuVector Vulnerability Scanner to report any vulnerabilities!

###OpenShift Route and Registry Token Example
To configure the plug-in using an OpenShift route for ingress to the controller, add the route into the controller IP field.

![openshift](rhos_jenkins_route.png)

To use token based authentication to the OpenShift registry, use NONAME as the user and enter the token in the password.
