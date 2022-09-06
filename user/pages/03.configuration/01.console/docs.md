---
title: Connect to Manager, REST API server
taxonomy:
    category: docs
---

### Connect to UI

Open a browser window, connect to the manager or all-in-one container's host IP on default port 8443 using HTTPS. After accepting the EULA, the user is able to access the UI.

```
https://<manager_host_ip>:8443
```

![Navigation](3_0_Dashboard.png)

You can manage NeuVector from the Console or by using the REST API.

Note1: See below for cases where your corporate firewall blocks 8443.

Note2: If your Chrome browser blocks the NeuVector self-signed certificate, see the next section on Chrome Certificate Upload.


### Connect to REST API Server
All operations in NeuVector can be invoked through the REST API instead of the console. The REST API server is part of the Controller/Allinone container. For details on the REST API, please see the section on Workflow and [Automation](/automation/automation).

### Default username and password

**admin:admin**

After successful login, the admin user should update the account with a more secure password.

### Creating Additional Users
New users can be added from the Settings -> Users & Roles menu. There are predefined global roles in NeuVector:

+ Admin. Able to perform all actions except Federated policies.
+ Federated Admin. Able to perform all actions, including setting up Master/Remote clusters and Federated policies (rules). Only visible if [Multi-cluster](/navigation/multicluster) is enabled.
+ View Only (reader). No actions allowed, just viewing.
+ CI Integration (ciops). Able to perform CI/CD scanning integration tasks such as image scanning.  This user role is recommended for use in build-phase scanning plug-ins such as Jenkins, Bamboo etc and for use in the REST API calls. It is limited to scanning functions and will not be able to do any actions in the console.

Users can be restricted to one or more namespaces using the Advanced Settings.

See the section [Users & Roles](/configuration/users) for advanced user management and creation of custom roles.


### Connection Timeout Setting

You can set the number of seconds which the console will timeout in the upper right of the console in My Profile -> Session timeout. The default is 5 minutes and the maximum is 3600 seconds (1 hour).

### Enabling HTTP for Manager

To disable HTTPS and enable HTTP access, add this to the Manager or Allinone yaml section in the environment variables section. For example, in Kubernetes:

```
- name: MANAGER_SSL
  value: “off”
```

For OpenShift, also remove this setting from the Route section of the yaml:
```
tls:
    termination: passthrough
```

This is useful if putting the manager behind a load balancer.

### Enabling Access from Corporate Network Which Blocks 8443
If your corporate network does not allow access on port 8443 to the Manager console, you can create an ingress service to map it and allow access.

Note: The NeuVector UI console is running as non-root user in the container, so it cannot listen on a port less than 1024. This is why it can't be changed to 443.

If you are trying to access the console from your corporate network. Here is the way to use the ClusterIP service and ingress HTTPS redirect to achieve that.

First, create a certificate for HTTPS termination. Here is an example,

```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=mycloud.domain.com"
kubectl create secret tls neuvector-ingress-tls -n neuvector --key="tls.key" --cert="tls.crt"
```

Then, use the following yaml file to expose the 443 port that redirects the HTTPS connection to the manager.

```
apiVersion: v1
kind: Service
metadata:
  name: neuvector-cluster-webui
  namespace: neuvector
spec:
  ports:
  - port: 443
    targetPort: 8443
    protocol: TCP
  type: ClusterIP
  selector:
    app: neuvector-manager-pod

---

apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: neuvector-ingress-webui
  namespace: neuvector
  annotations:
    ingress.mycloud.net/ssl-services: ssl-service=neuvector-cluster-webui
spec:
  tls:
  - hosts:
    - cloud.neuvector.com
    secretName: neuvector-ingress-tls
  rules:
  - host: cloud.neuvector.com
    http:
      paths:
      - path:
        backend:
          serviceName: neuvector-cluster-webui
          servicePort: 443
```

You will need to change the annotation for the ingress address from ingress.mycloud.net to your appropriate address. 

This example uses the URL cloud.neuvector.com. After the ingress service is created, you can find it's external IP. You then can configure the hosts file to point cloud.neuvector.com to that IP. After that, you should be able to browse to https://cloud.neuvector.com (the url you choose to use).

#### Using SSL Passthrough Instead of Redirect
To use TLS/SSL passthrough instead of the redirect example above (supported on some ingress controllers such as nginx), make sure the ingress controller is configured appropriated for passthrough, and the appropriate annotation is added to the ingress. For example,

```
  annotations:
    ingress.kubernetes.io/ssl-passthrough: "true"
```

### Replacing the NeuVector Self-signed Certificates
Please see the next section [Replacing the Self-Signed Certificates](/configuration/console/replacecert) for details. The certificate must be replaced in both the Manager and Controller/Allinone yamls.

### Configuring AWS ALB with Certificate ARN
Here is a sample ingress configuration using the AWS load balancer with the certificate ARN (actual ARN obfuscated).

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    # https://kubernetes-sigs.github.io/aws-alb-ingress-controller/guide/ingress/annotation/#healthcheck-path
    alb.ingress.kubernetes.io/backend-protocol: HTTPS
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-west-2:596810101010:certificate/380b6abc-1234-408d-axyz-651710101010
    alb.ingress.kubernetes.io/healthcheck-path: /
    alb.ingress.kubernetes.io/healthcheck-protocol: HTTPS
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS":443}]'
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/success-codes: "301"
    alb.ingress.kubernetes.io/target-type: instance
    external-dns.alpha.kubernetes.io/hostname: eks.neuvector.com
    kubernetes.io/ingress.class: alb
  labels:
    app: neuvector-webui-ingress
  name: neuvector-webui-ingress
  namespace: neuvector
spec:
  tls:
  - hosts:
    - eks.neuvector.com
  rules:
  - http:
      paths:
      - backend:
          serviceName: neuvector-service-webui
          servicePort: 8443
        path: /*
```
