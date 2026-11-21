---
title: Security Advisories and CVEs
sidebar_label: 16. Security Advisories and CVEs
taxonomy:
    category: docs
slug: /cve
---

NeuVector is committed to informing the community about security issues. The following table lists published security advisories and CVEs (Common Vulnerabilities and Exposures) for resolved issues.

## CVE List

| ID | Description | Date | Resolution |
| :---- | :---- | :---- | :---- |
| [CVE-2026-127181](https://github.com/neuvector/neuvector/security/advisories/GHSA-x447-gqmh-6mcx) | Fixed a security vulnerability where NeuVector's admission control could be bypassed for requests that attached or updated ephemeral containers on an existing pod. | 20 November 2026 | [NeuVector v5.7.0](https://github.com/neuvector/neuvector/releases/tag/v5.7.0) |
| [CVE-2026-127180](https://github.com/neuvector/neuvector/security/advisories/GHSA-5cw8-qxqw-9j5w) | Fixed a security vulnerability where the NeuVector image scanner (neuvector/scanner) would write each per-scan task request to a temporary file on disk with mode 0644 (world-readable). This request is a serialized `share.ScanImageRequest` that carries the plaintext registry Username, Password, and Token used to authenticate to the image registry being scanned. As a result, while a scan of an authenticated registry is running, the registry credentials are present in plaintext in a world-readable file under /tmp. Any other local principal on the same node — for example a co-located sidecar container sharing the pod's temporary filesystem, or another UID with read access to /tmp — can read the file and obtain the registry credentials. Depending on the privileges granted to those credentials, an attacker could then read from (and potentially write to) the affected private registry. | 20 November 2026 | [NeuVector v5.7.0](https://github.com/neuvector/neuvector/releases/tag/v5.7.0) |
| [CVE-2026-127182](https://github.com/neuvector/neuvector/security/advisories/GHSA-3x2m-c67v-vw77) | Fixed a security vulnerability where a stack-based buffer overflow (CWE-121 / CWE-787 out-of-bounds write) exists in the NeuVector Enforcer dataplane and was reachable from the Controller REST API via DLP (Data Loss Prevention) and WAF sensor/rule configuration. | 20 November 2026 | [NeuVector v5.7.0](https://github.com/neuvector/neuvector/releases/tag/v5.7.0) |
| [CVE-2026-127183](https://github.com/neuvector/neuvector/security/advisories/GHSA-v7m5-cp6v-m46h) | Fixed a security vulnerability where multiple memory-safety defects exist in the NeuVector Enforcer dataplane (dp), the C-based deep packet inspection (DPI/DLP) engine that runs inside the privileged, host-networked Enforcer DaemonSet. The dp process inspects live network traffic flowing to and from monitored workloads, so these defects can be reached by crafted traffic without any NeuVector credentials. | 20 November 2026 | [NeuVector v5.7.0](https://github.com/neuvector/neuvector/releases/tag/v5.7.0) |

## Questions and Support

* Contact the [SUSE Rancher Security team](https://github.com/rancher/rancher/security/policy).
* Open an issue in the [NeuVector GitHub repository](https://github.com/neuvector/neuvector/issues/new/choose).
* References:
  * [NeuVector Support Matrix](https://www.suse.com/suse-neuvector/support-matrix/all-supported-versions/neuvector-v-all-versions/)
  * [Product Support Lifecycle](https://www.suse.com/lifecycle/#suse-security)
