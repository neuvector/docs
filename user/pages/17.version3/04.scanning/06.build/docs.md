---
title: Build Phase Scanning
taxonomy:
    category: docs
---

### CI/CD Build Phase Vulnerability Scanning

Scan for vulnerabilities during the build phase of the pipeline using plug-ins such as Jenkins, Azure Devops, Bamboo, and CircleCI, or use the REST API.

Note: The default REST API port for plug-ins to call the scanner is 10443. This port must be exposed through the Allinone or Controller through a service in Kubernetes or a port map (e.g. - 10443:10443) in the Docker run or compose file.