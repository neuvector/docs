---
title: Importing CRD from Console
taxonomy:
    category: docs
---

### Importing a CRD format file from the Console or API
NeuVector supports importing a CRD formatted file from the console. However, this is not the same as applying it in Kubernetes as a custom resource definition (CRD).

A file in the NeuVector CRD format can be imported via the console in order to set the security policy (rules) specified in the file. These rules will NOT be imported as 'CRD' designated rules, but as regular 'user created' rules. The implication is that these rules can be modified or deleted like other rules, from the console or through the API. They are not protected as CRD rules from modification.

To import from the console, go to Policy -> Groups and select Import Policy Group.
![import](4-3_Import_Policy.png)

**Important**: Imported rules will overwrite any existing rules for the Group.

Rules that are set using the Kubernetes CRD functions, e.g. through 'kubectl apply my_crd.yaml' create CRD type rules in NeuVector which cannot be modified through the console or API. These can only be modified by updating the crd file and applying the change through Kubernetes.

Possible use cases for console import of the rules file include:
- Initial (one-time) configuration of rules for a Group or groups
- Migration of rules from one environment to another
- Rule creation where modification is required to be allowed from the console or API.

