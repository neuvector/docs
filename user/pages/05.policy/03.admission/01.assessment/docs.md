---
title: Configuration Assessment for Kubernetes Resources
taxonomy:
    category: docs
---

### Kubernetes Resource Deployment File Scanning
NeuVector is able to scan deployment yaml files for configuration assessments against Admission Control rules. This is useful to scan deployment yaml files early in the pipeline to determine if the deployment would violate any rules before attempting the deployment. 

To upload a yaml file to be scanned, go to Policy -> Admission Control and click the Configuration Assessment button. In the window, select a file to upload, then Test.

![Assessment](assessment.png)

You will then see an analysis of the file, whether the deployment would be allowed, and messages for rules that would apply to the deployment file.




