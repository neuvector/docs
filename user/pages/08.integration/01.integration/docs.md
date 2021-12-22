---
title: Enterprise Integration
taxonomy:
    category: docs
---

### Integration
NeuVector provides a number of ways to integrate, including a REST API, CLI, SYSLOG, RBACs, SAML, LDAP, and webhooks. See the Automation section for examples of scripting using the REST API.

Integrations with other ecosystem partners such as Sonatype (Nexus Lifecycle), IBM Cloud (QRadar and Security Advisor), Prometheus/Grafana, are also supported. Many of these can be found on the [NeuVector Github](https://github.com/neuvector) page.

The following configurations can be found in Settings:

#### OpenShift/Kubernetes RBACs
Select this option if you are using Red Hat OpenShift Role Based Access Controls (RBACs) and would like NeuVector to automatically read and enforce those. If selected, OpenShift users can log into the NeuVector console using their OpenShift credentials, and will only have access to the resources (Projects, containers, nodes etc) according to their role in the OpenShift cluster. OpenShift integration uses the OAuth2 protocol.


![OpenShift](openshift-rbac.png)

NOTE1: Do not use the setting in OpenShift AllowAllPasswordIdentityProvider which allows any password to be used to log in. This will allow a user to login into NeuVector with any password as well (as a read only user). It will also create a new user in OpenShift for every login (see ‘oc get user’ results).

NOTE2: The default Admin user of NeuVector and any additional users created in NeuVector will still be active with OpenShift RBACs enabled.

##### Kubernetes RBACs
To manually configure RBACs for Kubernetes namespaces, open the Advanced Setting in the new user creation screen in Settings -> Users -> Add User. Here you can enter the namespaces(s) which this user should have access to in NeuVector.

![Kubernetes](k8s-rbac.png)

#### SYSLOG
Enter the SYSLOG server IP and select the level of notification. You can also use a DNS name and/or select TCP for configuration.

#### Webhooks
Notifications can be sent via webhooks to an endpoint. Enter the endpoint URL for notifications to be sent. Webhook notifications for custom events can be configured in Policy -> Response Rules


#### Directory/SSO Integration
See the next sections for LDAP, MSAD, SAML, OpenId and other integrations. See the [Basics -> Users & Roles](/configuration/users#users) section for predefined and custom roles in NeuVector which can be mapped in the integration.
