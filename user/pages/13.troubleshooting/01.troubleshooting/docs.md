---
title: Troubleshooting
taxonomy:
    category: docs
---

### Troubleshooting NeuVector Deployments
The NeuVector containers are deployed, managed, and updated using the same orchestration tool used for application workloads. Please be sure to review the online documentation for each step necessary during deployment. Often deployments are attempted by just copying the sample yaml files and deploying them without reviewing the steps prior, such as properly configuring registries, secrets, or RBACs/rolebindings.

#### Initial Deployment
+ Check that the NeuVector containers can be pulled with correct authentication. Check the secret used and make sure the cluster is able to access the appropriate registry.
+ Make sure the changes to the yaml required (e.g. NodePort or LoadBalancer) or Helm values settings are set appropriately.
+ Check the platform and container run-time and make changes as needed (e.g. PKS, containerd, CRI-O).

#### Login and Initial Configuration
+ Check to make sure appropriate access to the manager (IP address, port, route) is allowed through firewalls.

#### Ongoing Operation
+ Directory integration. NeuVector supports specific configurations for LDAP/AD and other integrations for groups and roles. Contact NeuVector for additional troubleshooting steps and a tool for AD troubleshooting.
+ Registry scanning. Most issues are related to registry authentication errors or inability for the controller to access the registry from the cluster.
+ For performance issues, make sure the controller is allocated enough memory for scanning large images. Also, CPU and memory minimums can be specified in the pod policy to ensure adequate performance at scale.
+ Admission Control. See the Troubleshooting section in the section Security Risks... -> Admission Controls.

#### Updating
+ Use rolling updates for the controller. If you are rebooting hosts, make sure to monitor the controllers as they move to other hosts, or redeploy on the rebooted hosts, to make sure they are able to start, join the controller cluster, and stabilize/sync. Rebooting all hosts at once or too quickly can result in unknown states for the controllers.
+ Use a persistent volume claim to store the NeuVector configuration for the case that all controllers/nodes go down in the cluster.
+ When updating to a new version, review the online documentation to identify changes/additions to the yaml required, as well as other changes such as rolebindings or new services (e.g. admission control webhook, persistent volume claim etc).


### Debug Logs
To view the logs of a NeuVector container, for example a controller pod
```
kubectl logs neuvector-controller-pod-777fdc5668-4jkjn -n neuvector
```
These logs may show cluster connectivity issues, admin actions, scanning activity and other useful entries. If there are multiple controllers running it may be necessary to inspect each one. These logs can be piped to a file to send to NeuVector support.

#### Turning on Debug mode for NeuVector Controllers
For issues that require in-depth investigation, debug mode can be enabled for the controllers/allinones, which will log detailed information. This can increase the log file size by a large amount, so it is recommended to turn it off after collecting them.


#### Kubernetes, OpenShift and Other Orchestration Logs
It can be helpful to inspect the logs from orchestration tools to see all deployment activity including pod creation timestamps and status, deployments, daemonsets and other management actions of the NeuVector containers performed by the orchestration tool. 
```
kubectl get events -n neuvector
```

### Support Log
The support log contains additional information which is useful for NeuVector Support, including system configuration, containers, policies, notifications, and NeuVector container details.

To download the support log, go to Settings -> Configuration and select Collect Log. 

### Using the CLI to turn on Debug Mode
Login to NeuVector manager pod with user and password (recommended in a separate terminal window).
```
kubectl exec -it neuvector-manager-pod-5bb76b6754-rlmnp -n neuvector -- cli 
```
```
#neuvector-svc-controller.neuvector> login
```

Get the list of controllers. Find the controller with the Leader = True.
```
show controller
```
Turn on the debug mode in the leader controller using the ID or name of controller
```
set controller 4fce427cf963 debug -c all
```

To turn on debug mode on all controllers
```
set system controller_debug -c all
```

Perform the activity in NeuVector which you wish to debug. Then view the controller logs (in a separate terminal window).
```
kubectl logs <leader_controller_pod_name> -n neuvector
```
If required, capture the logs and send them to NeuVector.

Turn off Debug mode on the controller (back in the CLI window).
```
set controller 4fce427cf963 debug
exit
```

Check controller debug status.
```
show controller setting 289d67396fcb
```


### Using the REST API to turn on Debug Mode
Set access token with your IP, user, password:
```
_controllerIP_="<your_controller_ip>"
_controllerRESTAPIPort_="10443"
_neuvectorUsername_="admin"
_neuvectorPassword_="admin"
```

Note: For Kubernetes based deployments you can get the Controller IP in the following command output:
```
kubectl get pod -n neuvector -o wide | grep controller
```
Note: If accessing the REST API from outside the cluster, see the Automation section instructions.

Get the authentication token
```
curl -k -H "Content-Type: application/json" -d '{"password": {"username": "'$_neuvectorUsername_'", "password": "'$_neuvectorPassword_'"}}' "https://$_controllerIP_:$_controllerRESTAPIPort_/v1/auth" > /dev/null 2>&1 > token.json
_TOKEN_=`cat token.json | jq -r '.token.token'`
```

Note: You may need to install jq ($sudo yum install jq)

Enable Debug Mode
```
curl -X PATCH -k -H "Content-Type: application/json" -H "X-Auth-Token: $_TOKEN_" -d '{"config": {"controller_debug": ["cpath", "conn"]}}' "https://$_controllerIP_:$_controllerRESTAPIPort_/v1/system/config"  > /dev/null 2>&1   > set_debug.json
#debug options - cpath, conn, mutex, scan, cluster , all
```

Disable Debug on all controllers in a cluster
```
curl -X PATCH -k -H "Content-Type: application/json" -H "X-Auth-Token: $_TOKEN_" -d '{"config": {"controller_debug": []}}' "https://$_controllerIP_:$_controllerRESTAPIPort_/v1/system/config"  > /dev/null 2>&1   > set_debug.json
```

Check the controller debug status in a cluster
```
curl  -k -H "Content-Type: application/json" -H "X-Auth-Token: $_TOKEN_"  "https://$_controllerIP_:$_controllerRESTAPIPort_/v1/system/config"  > /dev/null 2>&1   > system_setting.json

cat system_setting.json | jq .config.controller_debug
```

Logout 
```
echo `date +%Y%m%d_%H%M%S` log out
curl -k -X 'DELETE' -H "Content-Type: application/json" -H "X-Auth-Token: $_TOKEN_" "https://$_controllerIP_:$_controllerRESTAPIPort_/v1/auth" > /dev/null 2>&1
```
