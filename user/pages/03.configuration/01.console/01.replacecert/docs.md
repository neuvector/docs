---
title: Replacing Self-Signed Certificate
taxonomy:
    category: docs
---

### Replacing the Self-Signed Certificate with PKCS Certificate for External Access

The built-in self-signed certificate used for external access from a browser to the Manager or for the REST API to the Controller can be replaced by a supported PKCS certificate. These should be replaced in both the Manager and Controller deployments. Note: To replace the included certificates for Internal communication between the Controller, Enforcer, and Scanner, please see [this section](/deploying/production/internal/).

The NeuVector web console supports 2 different self-signed certificate types, specifically, the PKCS8 (Private-Key Information Syntax Standard) and PKCS1 (RSA Cryptography Standard).  The self-signed certificate can be replaced with either of these PKCS types.  

The steps to generate the secret that will be consumed by NeuVector’s web console originating from the key and certificate using either of the PKCS methods will be illustrated below.  The important note here is, with the use of the wildcard for the DNS as being part of the alternate-subject-name parameter during the key and certificate creation, this enables the name of your choosing to be mapped to the Management console IP-Address without restricting to a particular CN.

#### Generate and Use Self-signed Certificate PKCS8 or PCKS1

1. Create a key and certificate

##### PKCS8 
```
openssl req -x509 -nodes -days 730 -newkey rsa:2048 -keyout tls.key -out tls.pem -config ca.cfg -extensions 'v3_req'
Sample ca.cfg
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

##### PKCS1

```
openssl genrsa -out tls.key 2048
openssl req -x509 -nodes -days 730 -config openssl.cnf  -new -key tls.key -out tls.pem
Sample openssl.cnf
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
CN = Neuvector(PKCS#1)
[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
[alt_names]
DNS.1 = *
```

2. Create the secret from the generated key and certificate files from above

```
kubectl create secret generic https-cert -n neuvector --from-file=tls.key --from-file=tls.pem
```


3. Edit the yaml directly for the manager and controller deployments to add the mounts
```
spec:
  template:
    spec:
      containers:
        volumeMounts:
        - mountPath: /etc/neuvector/certs/ssl-cert.key
          name: cert
          readOnly: true
          subPath: tls.key
        - mountPath: /etc/neuvector/certs/ssl-cert.pem
          name: cert
          readOnly: true
          subPath: tls.pem
      volumes:
      - name: cert
        secret:
          defaultMode: 420
          secretName: https-cert
```
Or update with the helm chart with similar values.yaml
```
manager:
  certificate:
    secret: https-cert
    keyFile: tls.key
    pemFile: tls.pem
  ingress:
    enabled: true
    host:  %CHANGE_HOST_NAME%
    ingressClassName: ""
    path: "/"  # or this could be "/api", but might need "rewrite-target" annotation
    annotations:
      ingress.kubernetes.io/protocol: https
    tls: true
    secretName: https-cert
controller:
  certificate:
    secret: https-cert
    keyFile: tls.key
    pemFile: tls.pem
```

Then update with `helm upgrade -i neuvector ...`. For reference here are all the values https://github.com/neuvector/neuvector-helm/tree/master/charts/core.

#### Support chained certificates

To support End-to-end TLS, some ingresses/Application Gateways will only support backend servers that can be trusted.  NeuVector added support for chained certificates in version 3.2.2.  Microsoft's Application Gateway is one example of an Application Gateway requiring a chained certificate when using a not well-known CA.

To add a chained certificate, the example tls.pem file should be a concatenation of the certificates.
