---
title: Azure DevOps
taxonomy:
    category: docs
---

### Scan for Vulnerabilities in the Azure DevOps Build Pipeline

The NeuVector scanner can be triggered from the Azure DevOps pipeline by using the NeuVector extension published in the Azure DevOps Marketplace.

![AzureDevOps](azure_devops.png)

The extension supports both remote and local scanning where the NeuVector controller can remotely scan an image in a registry during the build, or dynamically start a local controller to scan the image on the Azure agent vm.

In addition, make sure there is a NeuVector scanner container deployed and configured to connect to the Allinone or Controller. In 4.0 and later, the neuvector/scanner container must be deployed separate from the allinone or controller.

+ Scan image with NeuVector task integrates the NeuVector vulnerability scanner into an Azure DevOps Pipeline.
+ Perform vulnerability scans of a container image after the image build on an external NeuVector controller instance or on a local NeuVector controller instance which is running in service container inside a pipeline.
+ Define thresholds for failing builds based on the number of detected vulnerabilities of different severities.
+ Provide a detailed report of an image scan for analysis in the build summary tab.
+ External NeuVector controller instances are defined as service endpoints to decouple build pipeline definitions from connection parameters and credentials.

An overview with sample screens can be found at https://marketplace.visualstudio.com/items?itemName=NeuVector.neuvector-vsts



