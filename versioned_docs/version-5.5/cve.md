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
| [CVE-2026-78424](https://github.com/neuvector/neuvector/security/advisories/GHSA-vr77-8vmq-qfmj) | Fixed a security vulnerability where improper parameter handling allowed any authenticated users access to inject OS commands in the privileged enforcer container, which could lead to the complete compromise of the worker node. | 15 September 2026 | [NeuVector v5.5.4](https://github.com/neuvector/neuvector/releases/tag/v5.5.4) |
| [CVE-2026-78425](https://github.com/neuvector/neuvector/security/advisories/GHSA-wgg5-24xq-px35) | Fixed a security vulnerability regarding improper authentication where starting from version v5.6.2, users can configure the “Audience URI” in the **Settings -> SAML Settings** page. After the “Audience URI” is configured, it is used and checked during SAML SSO so that assertion for other applications won’t be accepted by NeuVector. | 15 September 2026 | [NeuVector v5.5.4](https://github.com/neuvector/neuvector/releases/tag/v5.5.4) |
| [CVE-2026-78426](https://github.com/neuvector/neuvector/security/advisories/GHSA-wcx5-mq6c-c54j) | Fixed a security vulnerability where the NeuVector JWT verifier accepted non-canonical `Base64URL` encodings of the same RSA signature, so an attacker holding a valid token could continue using a token that is expired or logged out by using its equivalent spelling. Starting from version v5.6.2, the NeuVector JWT verifier requires the JWT token to be a unique compact serialization. | 15 September 2026 | [NeuVector v5.5.4](https://github.com/neuvector/neuvector/releases/tag/v5.5.4) |
| [CVE-2026-78427](https://github.com/neuvector/neuvector/security/advisories/GHSA-78r4-3wfq-r2xm) | Fixed a security vulnerability where the NeuVector admission webhook silently excluded containers from policy evaluation when their image path matched one of three hard-coded service mesh sidecar images. This could lead malicious users to deploy workloads by evading admission deny rules by naming their image path after one of these sidecar images. Starting from version v5.6.2, the automatic sidecar exemptions are removed entirely. | 15 September 2026 | [NeuVector v5.5.4](https://github.com/neuvector/neuvector/releases/tag/v5.5.4) |
| [CVE-2026-78428](https://github.com/neuvector/neuvector/security/advisories/GHSA-c6rx-pmvf-m3jx) | Fixed a security vulnerability for users that authenticated through SAML or OpenID Connect (OIDC). This vulnerability would result in one user receiving another user's authenticated session when multiple SSO login attempts occurred concurrently. | 15 September 2026 | [NeuVector v5.5.4](https://github.com/neuvector/neuvector/releases/tag/v5.5.4) |
| [CVE-2026-25703](https://github.com/neuvector/manager/security/advisories/GHSA-hx45-873x-74qv) | The NeuVector manager `/network/graph` API may expose sensitive network topology and metadata due to insufficient access control validation. | 18 Mar 2026 | [NeuVector v5.5.0](https://github.com/neuvector/neuvector/releases/tag/v5.5.0) |

## Questions and Support

* Contact the [SUSE Rancher Security team](https://github.com/rancher/rancher/security/policy).
* Open an issue in the [NeuVector GitHub repository](https://github.com/neuvector/neuvector/issues/new/choose).
* References:
  * [NeuVector Support Matrix](https://www.suse.com/suse-neuvector/support-matrix/all-supported-versions/neuvector-v-all-versions/)
  * [Product Support Lifecycle](https://www.suse.com/lifecycle/#suse-security)
