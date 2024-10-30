---
title: Scan caching
taxonomy:
    category: docs
slug: /scanning/scan_caching
---

:::note
This feature is only supported from v5.4.0 onwards.
:::

### Using scan caching with scanners
Scanner caching feature is used to cache image layers on the scanner which will reused for other image scanning requests which significantely reduces the network bandwidth usage. 
The feature can be enabled by using "MAX_CACHE_RECORD_MB" environment variable and size allocated for the scanner cache. Recommneded to use "1000" (Size in MegaBytes)

#### Enabling scan caching with HELM deployment
Scan caching can be enabled when deploying NeuVector on the cluster or "helm update" can be used to enable the scan caching feature.

##### New Deployment:
```helm install neuvector -n neuvector neuvector/core --set tag=5.3.2 --set cve.scanner.env[0].name="MAX_CACHE_RECORD_MB" --set-string cve.scanner.env[0].value="1000"```

##### Upgrading existing Deployment:
```helm upgrade neuvector -n neuvector neuvector/core --set cve.scanner.env[0].name="MAX_CACHE_RECORD_MB" --set-string cve.scanner.env[0].value="1000"```

### Scan cache records
Scan cache record can be found at ```/tmp/images/caches``` at scanner pods.

```bash
neuvector@NV-Test-Bastion:~$ kubectl exec -ti neuvector-scanner-pod-77767cf64c-fdn68 -- bash -c "ls /tmp/images/caches"
cacher.json  lock  ref  version
neuvector@NV-Test-Bastion:~$
```
### Scan cache stats
Scan cache stats can be checked on manager CLI using below commands,
```bash
admin#neuvector-svc-controller.neuvector> show scan scanner
+------------------------------------------------------------------+---------------+---------------+-------+----------------------+------------+-------+--------+------------+
| id                                                               | cvedb_version | server        |  port | joined_timestamp     | containers | nodes | images | serverless |
+------------------------------------------------------------------+---------------+---------------+-------+----------------------+------------+-------+--------+------------+
| 34523baccbf140cecabd58397a40aed2bac2d745bcc6875c591a02f6e855dffb | 3.565         | 10.244.12.184 | 18402 | 2024-09-27T00:00:58Z |         80 |     0 |      0 |          0 |
| ae515e4d8c6f3fcbd304d44419c7f9e34cba38eac4a2357b50ead2f4a00c3277 | 3.565         | 10.244.12.185 | 18402 | 2024-09-27T00:01:02Z |         67 |     0 |      0 |          0 |
| d7619e206485358572978ed5f42cfeb094b54ae2b4a6c1d1c05ef17e29566b80 | 3.565         | 10.244.10.49  | 18402 | 2024-09-27T00:00:52Z |        410 |     0 |      5 |          0 |
+------------------------------------------------------------------+---------------+---------------+-------+----------------------+------------+-------+--------+------------+

admin#neuvector-svc-controller.neuvector> show scan cache-stat
scanner: 34523baccbf140cecabd58397a40aed2bac2d745bcc6875c591a02f6e855dffb
+-------------------+-------+
| Field             | Value |
+-------------------+-------+
| cache_misses      | None  |
| cache_hits        | None  |
| record_count      | None  |
| record_total_size | None  |
+-------------------+-------+
scanner: ae515e4d8c6f3fcbd304d44419c7f9e34cba38eac4a2357b50ead2f4a00c3277
+-------------------+-------+
| Field             | Value |
+-------------------+-------+
| cache_misses      | None  |
| cache_hits        | None  |
| record_count      | None  |
| record_total_size | None  |
+-------------------+-------+
scanner: d7619e206485358572978ed5f42cfeb094b54ae2b4a6c1d1c05ef17e29566b80
+-------------------+-------+
| Field             | Value |
+-------------------+-------+
| cache_misses      | 17    |
| cache_hits        | 68    |
| record_count      | 9     |
| record_total_size | 68575 |
+-------------------+-------+

admin#neuvector-svc-controller.neuvector> show scan cache-data d7619e206485358572978ed5f42cfeb094b54ae2b4a6c1d1c05ef17e29566b80
{
  "cache_hits": 68,
  "cache_misses": 17,
  "cache_records": [
    {
      "last_referred": "2024-09-27T10:57:20.230068879Z",
      "layer_id": "sha256:f19cce48c5a862e6f567ba470f5212d7b0113dfcf16f7e548dc2dd1c9f6bc71b_layer_file",
      "reference_count": 4,
      "size": 170
    },
    {
      "last_referred": "2024-09-27T10:57:20.235165944Z",
      "layer_id": "sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4_layer_file",
      "reference_count": 36,
      "size": 74
    },
    {
      "last_referred": "2024-09-27T10:57:20.233859401Z",
      "layer_id": "sha256:b085a9629ef439942302a994a548bd054edb3da164c6b370722a2e3d3720a3b1_layer_file",
      "reference_count": 4,
      "size": 4040
    },
    {
      "last_referred": "2024-09-27T10:57:20.234668328Z",
      "layer_id": "sha256:d56ed431390d028d69d2e0bde0dce713052d63edcd5fb8f1057b92a32ff5d2cf_layer_file",
      "reference_count": 4,
      "size": 98
    },
    {
      "last_referred": "2024-09-27T10:57:20.229579263Z",
      "layer_id": "sha256:d4bce7fd68df2e8bb04e317e7cb7899e981159a4da89339e38c8bf30e6c318f0_layer_file",
      "reference_count": 4,
      "size": 52978
    },
    {
      "last_referred": "2024-09-27T10:57:20.23290307Z",
      "layer_id": "sha256:df7f78e810e7131aebf8d2cf5ae9020367596d002e27ed78f28421dda0b6ee9f_layer_file",
      "reference_count": 4,
      "size": 185
    },
    {
      "last_referred": "2024-09-27T10:57:20.233994006Z",
      "layer_id": "sha256:2064e34931e21fa11e2f2626de549fc0e635a8e17a2a8a656a60be78ecf86db3_layer_file",
      "reference_count": 4,
      "size": 87
    },
    {
      "last_referred": "2024-09-27T10:57:20.231724432Z",
      "layer_id": "sha256:564ee6d16a2ed7cf55e39a01934037661fe42a85acc209900658acd08e1d00b8_layer_file",
      "reference_count": 4,
      "size": 10798
    },
    {
      "last_referred": "2024-09-27T10:57:20.232070043Z",
      "layer_id": "sha256:a251e59b24e26a60016c6d49f45585f6dacb20457e50619927cde5f3369c54da_layer_file",
      "reference_count": 4,
      "size": 145
    }
  ],
  "record_total_size": 68575
}
  
```
### Enabling hostPath for Scan Layer caching
“hostPath” volumes can be enabled on the NeuVector scanner to make use of the cache across all the scanners which are running on the same node. Make sure to add the volumeMounts mounting on “/tmp/images/caches” path Also to maximize the cache utilization deploy all the scanners on the same node using nodeSelector.

Sample YAML configuration to use scan cache across all scanner pods on same node,
```bash
   spec:
      containers:
      - env:
        - name: CLUSTER_JOIN_ADDR
          value: neuvector-svc-controller.neuvector
        - name: AUTO_INTERNAL_CERT
          value: "1"
        - name: MAX_CACHE_RECORD_MB
          value: "1000"
        image: docker.io/neuvector/scanner:latest
        imagePullPolicy: Always
        name: neuvector-scanner-pod
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
        volumeMounts:
        - mountPath: /etc/neuvector/certs/internal/
          name: internal-cert-dir
		- mountPath: /tmp/images/caches
		  name: scan-cache
      dnsPolicy: ClusterFirst
      imagePullSecrets:
      - name: azurecred
      nodeSelector:
        podrole: scanner
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      serviceAccount: default
      serviceAccountName: default
      terminationGracePeriodSeconds: 30
      volumes:
      - emptyDir:
          sizeLimit: 50Mi
        name: internal-cert-dir
	  - hostPath
		  path: /tmp/
		  type: ""
		name: scan-cache
```
> NOTE: Mounting ```/tmp/images/caches``` on PVC is not supported.
