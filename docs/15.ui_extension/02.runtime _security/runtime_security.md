---
title: 5.x Runtime Security
taxonomy:
category: docs
slug: /ui_extension/runtime_security
---


### Assets Security Scan Result

As Rancher has its own Nodes and Workloads page to manage and monitor the assets' status, NeuVector injects components to display its runtime scan result.

#### Nodes

In nodes summary table, vulnerabilities column is injected to show each node's detected vulnerabilities amount by high / medium severity.

![Nodes](nodes.png)

Click on the vulnerabilities cell, a slide panel comes from right side of the page to show scan result details. The database version of the scanner is shown as well as a filterable vulnerability list.

![Nodes](nodes_vul.png)

Click on the node name cell on nodes table, it redirects to node detail page. NeuVector inject a tab to show vulnerability list.

![Nodes](node_detail_vul.png)

Click on the CVE name cell on the vulnerabilities table, it opens a popup to show CVE description with an external link on the header to SUSE's CVE information website.

![Nodes](node_detail_vul_cve.png)

![SUSE](suse_cve.png)

A CSV file downloading button is provided above the vulnerabilities table. The file data includes all the fields which are in the table.

![CSV](download_vul.png)

![CSV](cve_csv.png)

#### Workloads

Temporarily, vulnerabilities column will not be injected in workloads table in v5.4 release due to potential performance concern. NeuVector team will work with Rancher team to deal with it and integrate it soon.

![Workload](pods.png)

Click on a pod name on the workloads table, it redirects to pod detail page. NeuVector inject a tab to show vulnerability list.

![Workload](pod_detail_vul.png)
