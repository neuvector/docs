# Security Advisories and CVEs

NeuVector is committed to informing the community of security issues. Below is a CVE reference list of published security advisories and CVEs (Common Vulnerabilities and Exposures) for issues we have resolved.

# CVE List

| ID | Description | Date | Resolution |
|----|-------------|------|------------|
| [CVE-2026-25703](https://github.com/neuvector/manager/security/advisories/GHSA-hx45-873x-74qv) | The NeuVector manager `/network/graph` API may expose sensitive network topology and metadata due to insufficient access control validation. | 18 Mar 2026 | [NeuVector v5.5.0](https://github.com/neuvector/neuvector/releases/tag/v5.5.0) |

---

## Potential information leakage from manager `/network/graph` API

- **Advisory ID:** [CVE-2026-25703](https://github.com/neuvector/manager/security/advisories/GHSA-hx45-873x-74qv)  
- **CWE:** No CWEs  

### Affected Versions

- Versions earlier than `5.5.0`

**Fixed version:** `5.5.0`

### Impact

A vulnerability in the NeuVector manager `/network/graph` API may expose sensitive information to unauthorized users.

The API response can include internal network topology details and metadata that should not be accessible without proper authorization. This may allow an attacker to:

- Enumerate internal services and connections  
- Infer network structure and communication patterns  
- Gain insights useful for further attacks  

The issue occurs due to insufficient access control validation on the affected API endpoint.

### Patches

Patched in release `5.5.0` and later.

The fix ensures that:

- Proper authorization checks are enforced on the `/network/graph` API  
- Sensitive data is returned only to authorized users  

### Workarounds

No complete workaround is available.

As a temporary mitigation:

- Restrict access to the NeuVector UI and API endpoints  
- Use network policies or firewall rules to limit exposure  
- Ensure only trusted users can access the manager API  

**Recommendation:** Upgrade to version `5.5.0` or later as soon as possible.

## Questions and Support

* Contact the [SUSE Rancher Security team](https://github.com/rancher/rancher/security/policy).
* Open an issue in the [NeuVector GitHub repository](https://github.com/neuvector/neuvector/issues/new/choose).
* References:
   * [NeuVector Support Matrix](https://www.suse.com/suse-neuvector/support-matrix/all-supported-versions/neuvector-v-all-versions/)
   * [Product Support Lifecycle](https://www.suse.com/lifecycle/#suse-security)
