---
title: Build Phase Image Scanning
taxonomy:
    category: docs
---

### CI/CD Build Phase Vulnerability Scanning

Scan for vulnerabilities during the build phase of the pipeline using plug-ins such as [Jenkins](https://plugins.jenkins.io/neuvector-vulnerability-scanner/), [Azure Devops](https://github.com/neuvector/azure-vsts), [Github Action](https://github.com/neuvector/scan-action), [gitlab](https://gitlab.com/neuvector/gitlab-plugin), Bamboo, and [CircleCI](https://github.com/neuvector/circleci-orb), or use the REST API. NeuVector supports two types of build-phase scanning: registry and local. For registry scanning, the NeuVector controller and scanner must be able to connect to the registry to pull the image. 

To trigger a build-phase scan, the plug-in (e.g. Jenkins) must be able to connect to the Controller or Allinone. Note: The default REST API port for plug-ins to call the scanner is 10443. This port must be exposed through the Allinone or Controller through a service in Kubernetes or a port map (e.g. - 10443:10443) in the Docker run or compose file.

Make sure there is a NeuVector scanner container deployed and properly configured to connect to the Allinone or Controller. In 4.0 and later, the neuvector/scanner container must be deployed separately from the allinone or controller, and is included in the sample deployment yaml files.

You can download the plug-in from the Jenkins Plug-in Manager. Other plug-ins are accessible through the catalogs of the build tool, or on the [NeuVector github](https://github.com/neuvector) page. The Bamboo scanner is available at https://github.com/neuvector/bamboo-plugin/releases/tag/1.0.1.  The CircleCI ORB is available at https://github.com/neuvector/circleci-orb and through the CircleCI ORB catalog. 

#### Local Build-Phase Scanning
For local scanning, the NeuVector scanner will try to scan the image on a local host (or a host reachable by the remote host docker command).

For Kubernetes or OpenShift-based local scanning, remove the commented-out section of the sample scanner deployment yaml file, shown in the [Deploying NeuVector](/deploying/kubernetes#deploy-using-kubernetes) sections. The commented out section looks like this:

```
          env:
# Commented out sections are required only for local build-phase scanning
#            - name: SCANNER_DOCKER_URL
#              value: tcp://192.168.1.10:2376
            - name: CLUSTER_JOIN_ADDR
              value: neuvector-svc-controller.neuvector
            - name: CLUSTER_ADVERTISED_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
            - name: CLUSTER_BIND_ADDR
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP
#          volumeMounts:
#            - mountPath: /var/run/docker.sock
#              name: docker-sock
#              readOnly: true
#      volumes:
#        - name: docker-sock
#          hostPath:
#            path: /var/run/docker.sock
      restartPolicy: Always
```

For Docker-native local scanning, follow the instructions for Docker scanner deployments in the [Docker Production deployments](/deploying/docker#deploy-the-neuvector-scanner-container) section for the scanner. 

#### Local Build-Phase Scanning - Scanner Only (No Controller Required)
NeuVector supports standalone scanner deployments for local image scanning (which does not require a Controller). Certain plug-in's such as the CircleCI ORB have an option to dynamically deploy a scanner when a build job requires image scanning, then remove the scanner when the results are sent back through the ORB. These dynamic scanner deployments are automatically invoked through the plug-in if supported.

Please see the [scanner section](/scanning/scanners) for more details on stand alone scanners.
