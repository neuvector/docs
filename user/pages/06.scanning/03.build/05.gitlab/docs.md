---
title: Gitlab
taxonomy:
    category: docs
---

### Scan for Vulnerabilities during Gitlab Build Pipeline

NeuVector can be configured to scan for vulnerabilities triggered in the Gitlab build pipeline. There is a [Gitlab plug-in here](https://gitlab.com/neuvector/gitlab-plugin) which can be configured and used. Please follow the instructions on the gitlab site for using the plugin.

The scan can also use the NeuVector REST API by configuring the provided script below to access the controller.

In addition, make sure there is a NeuVector scanner container deployed and configured to connect to the Allinone or Controller. In 4.0 and later, the neuvector/scanner container must be deployed separate from the allinone or controller.

#### Scan During Gitlab Build Using REST API

Use the following script, configured for your NeuVector login credentials to trigger the vulnerability scans.

```
########################
# Scanning Job
########################

NeuVector_Scan:
  image: docker:latest
  stage: test
  #the runner tag name is nv-scan 
  tags:
    - nv-scan
  services:
    - docker:dind
  before_script:
    - apk add curl
    - apk add jq
  variables:
    DOCKER_DAEMON_PORT: 2376
    DOCKER_HOST: "tcp://$CI_SERVER_HOST:$DOCKER_DAEMON_PORT"
    #the name of the image to be scanned
    NV_TO_BE_SCANNED_IMAGE_NAME: "nv_demo"
    #the tag of the image to be scanned
    NV_TO_BE_SCANNED_IMAGE_TAG: "latest"
    #for local, set NV_REGISTRY=""
    #for remote, set NV_REGISTRY="[registry URL]"
    NV_REGISTRY_NAME: ""
    #the credential to login to the docker registry
    NV_REGISTRY_USER: ""
    NV_REGISTRY_PASSWORD: ""
    #NeuVector image location
    NV_IMAGE: "10.1.127.3:5000/neuvector/controller"
    NV_PORT: 10443
    NV_LOGIN_USER: "admin"
    NV_LOGIN_PASSWORD: "admin"
    NV_LOGIN_JSON: '{"password":{"username":"$NV_LOGIN_USER","password":"$NV_LOGIN_PASSWORD"}}'
    NV_SCANNING_JSON: '{"request":{"registry":"$NV_REGISTRY","username":"$NV_REGISTRY_NAME","password":"$NV_REGISTRY_PASSWORD","repository":"$NV_TO_BE_SCANNED_IMAGE_NAME","tag":"$NV_TO_BE_SCANNED_IMAGE_TAG"}}'
    NV_API_AUTH_URL: "https://$CI_SERVER_HOST:$NV_PORT/v1/auth"
    NV_API_SCANNING_URL: "https://$CI_SERVER_HOST:$NV_PORT/v1/scan/repository"
  script: 
    - echo "Start neuvector scanner"
    - docker run -itd --privileged --name neuvector.controller -e CLUSTER_JOIN_ADDR=$CI_SERVER_HOST -p 18301:18301 -p 18301:18301/udp -p 18300:18300 -p 18400:18400  -p $NV_PORT:$NV_PORT -v /var/neuvector:/var/neuvector -v /var/run/docker.sock:/var/run/docker.sock -v /proc:/host/proc:ro -v /sys/fs/cgroup/:/host/cgroup/:ro $NV_IMAGE
    - |
      _COUNTER_="0"
      while [ -z "$TOKEN" -a "$_COUNTER_" != "12" ]; do
        _COUNTER_=$((( _COUNTER_ + 1 )))
        sleep 5
        TOKEN=`(curl -s -f $NV_API_AUTH_URL -k -H "Content-Type:application/json" -d $NV_LOGIN_JSON || echo null) | jq -r '.token.token'`
        if [ "$TOKEN" = "null" ]; then
          TOKEN=""
        fi
      done
    - echo "Scanning ..."
    - sleep 20
    - curl $NV_API_SCANNING_URL -s -k -H "Content-Type:application/json" -H "X-Auth-Token:$TOKEN" -d $NV_SCANNING_JSON | jq .
    - echo "Logout"
    - curl $NV_API_AUTH_URL -k -X 'DELETE' -H "Content-Type:application/json" -H "X-Auth-Token:$TOKEN"

  after_script:
    - docker stop neuvector.controller
    - docker rm neuvector.controller
```