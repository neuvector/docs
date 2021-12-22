---
title: Yaml Change History
taxonomy:
    category: docs
---

### Change History of Sample Yaml File for NeuVector Deployments


2019/12/11 - read only for runtime socket
```
          volumeMounts:
            - mountPath: /var/run/docker.sock
              name: docker-sock
              readOnly: true
```

2019/11/06 - change value of terminationGracePeriodSeconds
```
      terminationGracePeriodSeconds: 30 or 300 or 1200
```

2019/10/25 - remove preStop for allinone/controller

2019/10/09 - prevent controllers running on the same node
```
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - neuvector-controller-pod
              topologyKey: "kubernetes.io/hostname"
```

2019/10/01 - change to apps/v1

2019/09/12 - new service for multiple clusters
```
apiVersion: v1
kind: Service
metadata:
  name: neuvector-service-controller-fed-master
  namespace: neuvector
spec:
  ports:
  - port: 11443
    name: fed
    protocol: TCP
  type: LoadBalancer
  selector:
    app: neuvector-controller-pod

---

apiVersion: v1
kind: Service
metadata:
  name: neuvector-service-controller-fed-worker
  namespace: neuvector
spec:
  ports:
  - port: 10443
    name: fed
    protocol: TCP
  type: LoadBalancer
  selector:
    app: neuvector-controller-pod
```

2019/07/04 - new service for crd ground rule
```
apiVersion: v1
kind: Service
metadata:
  name: neuvector-svc-crd-webhook
  namespace: neuvector
spec:
  ports:
  - port: 443
    targetPort: 30443
    protocol: TCP
    name: crd-webhook
  type: ClusterIP
  selector:
    app: neuvector-controller-pod
```

2019/05/09 - configMap for initial config on allinone/controller only
```
          volumeMounts:
            - mountPath: /etc/config
              name: config-volume
              readOnly: true
      volumes:
        - name: config-volume
          configMap:
            name: neuvector-init 
            optional: true
```

2019/03/21 - add /lib/modules mount folder to support detecting tc module on enforcer
```
          volumeMounts:
            - mountPath: /lib/modules
              name: modules-vol
              readOnly: true
      volumes:
        - name: modules-vol
          hostPath:
            path: /lib/modules
```

2019/02/01 - add new service for admission control
```
apiVersion: v1
kind: Service
metadata:
  name: neuvector-svc-admission-webhook
  namespace: neuvector
spec:
  ports:
  - port: 443
    targetPort: 20443
    protocol: TCP
    name: admission-webhook
  type: ClusterIP
  selector:
    app: neuvector-controller-pod
```