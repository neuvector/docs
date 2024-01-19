---
title: CircleCI
taxonomy:
    category: docs
---

### Scan for Vulnerabilities in the CircleCI Build Pipeline

The NeuVector CircleCI ORB triggers a vulnerability scan on an image in the CircleCI pipeline. The ORB is available in the [CircleCI catalog](https://circleci.com/orbs/registry/orb/neuvector/neuvector-orb) and is also documented on the [NeuVector GitHub page](https://github.com/neuvector/circleci-orb).

Deploy the NeuVector Allinone or Controller container if you haven't already done so on a host reachable by the CircleCI ORB. Make a note of the IP address of the host where the Allinone or Controller is running.

The ORB supports two use cases:
1. Triggering the scan to be performed outside the CirclCI infrastructure. The ORB contacts the NeuVector scanner, which then pulls the image from a registry to be scanned. Make sure the ORB has network connectivity to the host where the NeuVector Controller/Allinone is running.
2. Dynamically launching a NeuVector controller and scanner on a temporary vm running on the CircleCI platform. After launching and auto-configuring, the scan be done on image in the build, and after completion the NeuVector deployment is stopped and removed.  For this use case, please see the documentation on the [CircleCI ORB for NeuVector](https://circleci.com/orbs/registry/orb/neuvector/neuvector-orb).

In addition, make sure there is a NeuVector scanner container deployed and configured to connect to the Allinone or Controller. In 4.0 and later, the neuvector/scanner container must be deployed separate from the allinone or controller.

#### Create a Context in Your CircleCI App
![context](context.png)

#### Configure Settings 
Configure the Environment Variables for Connecting to and Authenticating
![settings](circleci_settings.png)

Add the NeuVector orb to Your Build config.yaml
```
version: 2.1
orbs:
  neuvector: neuvector/neuvector-orb@1.0.0
workflows:
  scan-image:
    jobs:
      - neuvector/scan-image:
          context: myContext
          registry_url: https://registry.hub.docker.com
          repository: alpine
          tag: "3.4"
          scan_layers: false
          high_vul_to_fail: 0
          medium_vul_to_fail: 3
```
The registry_url is the location to find the image to be scanned. Configure the repository name, tag, and if a layered scan should be performed. Add criteria for the build task to fail based on number of high or medium vulnerabilities detected.

#### Review the Results
The build task will pass or fail based on the criteria set. In either case you can review the full scan report.
![fail](circleci_fail.png)


