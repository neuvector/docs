---
title: Removing or Resetting NeuVector
taxonomy:
    category: docs
---


### Removing NeuVector Deployment / Containers

To remove the NeuVector deployment on Kubernetes, use the same yaml file for deployment in the delete command.
```
$ kubectl delete -f neuvector.yaml
```

This will remove the services and container deployments of NeuVector. You may also want to delete the neuvector namespace, persistent volume and cluster roles and clusterrolebindings created in the deployment steps.

If you deployed NeuVector using a Helm chart or operator you should delete NeuVector using Helm or the appropriate operator command.

### Resetting NeuVector to an Initial State
In addition to deleting as discussed above and redeploying NeuVector, the following steps can be taken in Kubernetes to reset NeuVector, which will remove learned rules, groups, and other configuration but leave the NeuVector deployment intact.

1. Scale the controller deployment to 0.
2. (Optional) if a Persistent Volume is used, delete the persistent volume backup folder created.
3. Scale the controller deployment to 3.

### Resetting the Admin Password
The admin password is the key to administering the NeuVector deployment and view the cluster network activities.  It is important to change the password upon install and keep it safely guarded.  Sometimes, the password is guarded too well and become loss or the administrator leaves the company.  If you have kubectl access to the cluster, you can reset the admin password to the default using the following steps.

Exec into one of the controllers.
```
kubectl exec -it <controller> -n neuvector -- sh
```

Check that the admin entry exists and save the output json somewhere for safe keeping. 
```
consul kv get object/config/user/admin
```
Take the output from the above consul kv get command and replace the password_hash string with below string.

```
c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec
```

Reset the admin account password back to the default. (REPLACE <UPDATED_consul_kv_get_output_with_new_password_hash> BEFORE EXECUTION!!!)
```
consul kv put object/config/user/admin '<UPDATED_consul_kv_get_output_with_new_password_hash>'
```
EXAMPLE BELOW: (DO NOT EXECUTE WITHOUT REPLACING WITH OUTPUT)

```
consul kv put object/config/user/admin '{"fullname":"admin","username":"admin","password_hash":"c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec","pwd_reset_time":"2022-03-24T20:50:15.341074451Z","pwd_hash_history":null,"domain":"","server":"","email":"","role":"admin","role_oride":false,"timeout":300,"locale":"en","role_domains":{},"last_login_at":"2022-03-24T20:49:32.577877044Z","login_count":1,"failed_login_count":0,"block_login_since":"0001-01-01T00:00:00Z"}'
```
Response:
```
Success! Data written to: object/config/user/admin
```

Login with admin/admin and change password.
