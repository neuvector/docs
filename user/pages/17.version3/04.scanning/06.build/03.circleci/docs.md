---
title: CircleCI
taxonomy:
    category: docs
---

### Scan for Vulnerabilities in the CircleCI Build Pipeline

The NeuVector CircleCI ORB triggers a vulnerability scan on an image in the CircleCI pipeline. The ORB is available in the CircleCI catalog at https://circleci.com/orbs/registry/orb/neuvector/neuvector-orb and is also documented at https://github.com/neuvector/circleci-orb.

Deploy the NeuVector Allinone or Controller container if you haven't already done so on a host reachable by the CircleCI ORB. Make a note of the IP address of the host where the Allinone or Controller is running.

The current ORB supports triggering the scan to be performed outside the CirclCI infrastructure. The ORB contacts the NeuVector scanner, which then pulls the image from a registry to be scanned. Make sure the ORB has network connectivity to the host where the NeuVector Controller/Allinone is running.

Important! Remember to apply the NeuVector license file provided to you through the console, CLI, or REST API. The scans will not work if the controller/allinone does not have a valid license.

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


