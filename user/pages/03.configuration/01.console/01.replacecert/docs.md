---
title: Replacing Self-Signed Certificate
taxonomy:
    category: docs
---

### Replacing the Self-Signed Certificate with PKCS Certificate
The built-in self-signed certificate can be replaced by a supported PKCS certificate. These should be replaced in both the Manager and Controller deployments.

The NeuVector web console supports 2 different self-signed certificate types, specifically, the PKCS8 (Private-Key Information Syntax Standard) and PKCS1 (RSA Cryptography Standard).  The self-signed certificate can be replaced with either of these PKCS types.  

The steps to generate the secret that will be consumed by Neuvector’s web console originating from the key and certificate using either of the PKCS methods will be illustrated below.  The important note here is, with the use of the wildcard for the DNS as being part of the alternate-subject-name parameter during the key and certificate creation, this enables the name of your choosing to be mapped to the Management console IP-Address without restricting to a particular CN.

#### Generate and Use a PKCS8 Self-signed Certificate
1. Create a PKCS8 key and certificate
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
2. Create the secret from the generated key and certificate files from above
```
kubectl create secret generic https-cert -n neuvector --from-file=tls.key --from-file=tls.pem
```
3. Edit the yaml for the manager and controller pods to add the mounts
```
containers:
                                     ......
                                     ......
                                     volumeMounts:
                                       - mountPath: /etc/neuvector/certs/ssl-cert.key
                                         subPath: tls.key
                                         name: cert
                                         readOnly: true
                                       - mountPath: /etc/neuvector/certs/ssl-cert.pem
                                         subPath: tls.pem
                                         name: cert
                                         readOnly: true
                                   volumes:
                                     - name: cert
                                       secret:
                                         secretName: https-cert
```

#### Generate and Use PKCS1 Self-signed Certificate
1. Create a PKCS1 key and certificate
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
3. Modify the yaml for the manager and controller pods by adding the mounts by following step “3” in the Generate and Use PKCS8 Self-signed Certificate section above.

