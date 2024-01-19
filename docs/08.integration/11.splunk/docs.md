---
title: Splunk
taxonomy:
    category: docs
---

### Integrating with Splunk with the NeuVector Splunk App

The NeuVector Splunk App can be found in the splunkbase catalog [here](https://splunkbase.splunk.com/app/6205/) or by searching for NeuVector.

The NeuVector Security dashboard helps to identify security events such as suspicious login attempts, network violations and vulnerable images.

Below are sample screens displayed in the Splunk app.

#### Image Vulnerabilities

![vulnerabilities](vulnerable_images.png)

#### Admission Control and Security Events

![admission_security](admission_security_events.png)

#### Network Violations by Pod/Service (Deployments)

![network](network_violations.png)

#### Egress Connection Summary

![egress](egress_destinations.png)

#### NeuVector Login Activity Dashboard

![logins](login_summary.png)

### Setup and Configuration

#### Getting the app
##### GitHub
Download the latest app tarball (`neuvector_app.tar.gz`) from the [neuvector/neuvector-splunk-app repository](https://github.com/neuvector/neuvector-splunk-app).

##### Splunkbase
Download the latest app tarball from [Splunkbase](https://splunkbase.splunk.com/app/).

##### Splunk Apps Browser
In the Splunk UI, click on the Apps dropdown, click "Find More Apps", then search for NeuVector Splunk App.

#### Installation and Setup
Install the app by either uploading the tarball or following the Splunkbase prompts.  

1. Configure syslog in NeuVector console

Go to Settings -> Configuration -> Syslog  

  a. set the server value as the IP address that Splunk is running  
  b. choose TCP as the protocol;  
  c. set port number as 10514;  
  d. choose Info Level;  
  e. click SUBMIT to save the setting.  


![syslog](syslog-config.png)

You can configure multiple clusters to send syslog to your splunk instance and your splunk instance will receive these syslogs in real time.

#### FAQs
##### What user role is required?
Any user role.
