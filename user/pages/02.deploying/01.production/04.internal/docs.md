---
title: Replacing Internal Certificates
taxonomy:
    category: docs
---

### Internal Communication and Certificates
NeuVector includes default self-signed certificates for encryption for the Manager (console/UI access), Controller (REST API, internal), Enforcer (internal), and Scanner (internal) communications.

These certificates can be replaced by your own to further harden communication. For replacing certificates used by external access to NeuVector (i.e, browser to the Manager, or REST API to the Controller), please see [this section](/configuration/console/replacecert/). See below for replacing the certificates used in internal communication between NeuVector containers.

WARNING: Replacing certificates is recommended to be performed only during initial deployment of NeuVector. Replacing on a running cluster (even with rolling upgrade) may result in an unstable state where NeuVector pods are unable to communicate with each other due to a mismatch in certificates, and DATA LOSS may occur.

#### Replacing Certificates Used in Internal Communications of NeuVector
To replace the internal encryption files ca.cert, cert.key, cert.pem, first create the new ca.cfg file (see sample below). Then delete the relevant file, kubernetes secret, then generate new files and secret.

```bash
kubectl delete secret internal-cert -n neuvector
openssl genrsa -out ca.key 2048
openssl req -x509 -sha256 -new -nodes -key ca.key -days 3650 -out ca.cert
openssl genrsa -out cert.key 2048
openssl req -new -key cert.key -sha256 -out cert.csr -config ca.cfg
openssl req -in cert.csr -noout -text
openssl x509 -req -sha256 -in cert.csr -CA ca.cert -CAkey ca.key -CAcreateserial -out cert.pem -days 3650 -extfile ca.cfg
    // for sample ca.cfg see below, or see https://open-docs.neuvector.com/configuration/console/replacecert
openssl x509 -in cert.pem -text
kubectl create secret generic internal-cert -n neuvector --from-file=cert.key --from-file=cert.pem --from-file=ca.cert
```

Then edit the Controller, Enforcer, and Scanner deployment yamls, adding:

```bash
      containers:
        - name: neuvector-controller/enforcer/scanner-pod
          volumeMounts:
            - mountPath: /etc/neuvector/certs/internal/cert.key
              name: internal-cert
              readOnly: true
              subPath: cert.key
            - mountPath: /etc/neuvector/certs/internal/cert.pem
              name: internal-cert
              readOnly: true
              subPath: cert.pem
            - mountPath: /etc/neuvector/certs/internal/ca.cert
              name: internal-cert
              readOnly: true
              subPath: ca.cert
      volumes:
        - name: internal-cert
          secret:
            defaultMode: 420
            secretName: internal-cert
```

Then proceed to deploy NeuVector as before. You can also shell into the controller/enforcer/scanner pods to confirm that the ca.cert, cert.key, cert.pem files are the customized ones and that the NeuVector communications are working using the new certificates.

Sample ca.cfg file referenced above:

```bash
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no
[req_distinguished_name]
C = US
ST = California
L = San Jose
O = NeuVector Inc.
OU = Neuvector
CN = Neuvector
[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
[alt_names]
DNS.1 = *
```

Sample patch commands for controller (change namespace to cattle-neuvector-system if needed, and modify for use on enforcer, scanner):

```bash
NAMESPACE=neuvector

kubectl patch deployment -n ${NAMESPACE} neuvector-controller-pod --type='json' -p='[{"op": "add", "path": "/spec/template/spec/volumes/-", "value": {"name": "internal-cert", "secret": {"defaultMode": 420, "secretName": "internal-cert"}} } ]'

kubectl patch deployment -n ${NAMESPACE} neuvector-controller-pod --type='json' -p='[{"op": "add", "path": "/spec/template/spec/containers/0/volumeMounts", "value": [{"mountPath": "/etc/neuvector/certs/internal/cert.key", "name": "internal-cert", "readOnly": true, "subPath": "cert.key"}, {"mountPath": "/etc/neuvector/certs/internal/cert.pem", "name": "internal-cert", "readOnly": true, "subPath": "cert.pem"}, {"mountPath": "/etc/neuvector/certs/internal/ca.cert", "name": "internal-cert", "readOnly": true, "subPath": "ca.cert"} ] } ]'
```

#### Updating/Deploying with Helm

As of Helm chart `2.4.1` we can now manage the internal certificate install. The chart [values.yaml](https://github.com/neuvector/neuvector-helm/blob/master/charts/core/values.yaml) should be reviewed for all the settings. The below example uses RKE2, standard Ingress and installer certificates.

```bash
# add chart
helm repo add neuvector https://neuvector.github.io/neuvector-helm/

# update chart
helm repo update

# add domain for ingress
export domain=awesome.sauce

# run the helm 
helm upgrade -i neuvector -n neuvector neuvector/core --create-namespace  --set imagePullSecrets=regsecret --set k3s.enabled=true --set k3s.runtimePath=/run/k3s/containerd/containerd.sock --set manager.ingress.enabled=true --set manager.ingress.host=neuvector.$domain --set manager.svc.type=ClusterIP --set controller.pvc.enabled=true --set controller.pvc.capacity=500Mi --set controller.internal.certificate.secret=internal-cert --set cve.scanner.internal.certificate.secret=internal-cert --set enforcer.internal.certificate.secret=internal-cert
```