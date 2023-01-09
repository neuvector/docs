---
title: Replacing Internal Certificates
taxonomy:
    category: docs
---

### Internal Communication and Certificates
NeuVector includes default self-signed certificates for encryption for the Manager (console/UI access), Controller (REST API, internal), Enforcer (internal), and Scanner (internal) communications.

These certificates can be replaced by your own to further harden communication. For replacing certificates used by external access to NeuVector (i.e, browser to the Manager, or REST API to the Controller), please see [this section](/configuration/console/replacecert/). See below for replacing the certificates used in internal communication between NeuVector containers.

CAUTION: Replacing certificates is recommended to be performed during initial deployment of NeuVector. Replacing on a running cluster (even with rolling upgrade) may result in an unstable state where NeuVector pods are unable to communicate with each other due to a mismatch in certificates. If this occurs, waiting a few minutes for the NeuVector communication to stabilize should result in a stable cluster.

#### Replacing Certificates Used in Internal Communications of NeuVector
To replace the internal encryption files ca.cert, cert.key, cert.pem, first delete the included files, then generate new files and the kubernetes secret.

```
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

```
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
```
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