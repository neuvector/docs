# Security Advisories and CVEs

NeuVector is committed to informing the community of security issues. Below is a CVE reference list of published security advisories and CVEs (Common Vulnerabilities and Exposures) for issues we have resolved.

## CVE List

| ID | Description | Date | Resolution |
| :---- | :---- | :---- | :---- |
| [CVE-2025-66001](https://github.com/neuvector/neuvector/security/advisories/GHSA-4jj9-cgqc-x9h5) | In the patched version, the new NeuVector deployment enables TLS verification by default. For rolling upgrades, NeuVector does not automatically change this setting to prevent disruptions. For more information refer to [OpenID Connect is vulnerable to MITM](#openid-connect-is-vulnerable-to-mitm)| 12 Dec 2025 | [NeuVector v5.4.8](https://github.com/neuvector/neuvector/releases/tag/v5.4.8) |
| [CVE-2025-54471](https://github.com/neuvector/neuvector/security/advisories/GHSA-h773-7gf7-9m2x) | NeuVector uses dynamically generated encryption keys and securely stores them in Kubernetes secrets. This improvement replaces previously hardcoded cryptographic material, enhancing data confidentiality and operational security in all deployments. For more information refer to [NeuVector is shipping cryptographic material into its binary](#neuvector-is-shipping-cryptographic-material-into-its-binary)| 17 Oct 2025 | [NeuVector v5.4.7](https://github.com/neuvector/neuvector/releases/tag/v5.4.7) |
| [CVE-2025-54470](https://github.com/neuvector/neuvector/security/advisories/GHSA-qqj3-g7mx-5p4w) | NeuVector enforces TLS certificate and hostname verification for all telemetry communications. In addition, it limits telemetry response size to prevent denial-of-service risks. These enhancements ensure telemetry data is exchanged securely and efficiently. | 17 Oct 2025 | [NeuVector v5.4.7](https://github.com/neuvector/neuvector/releases/tag/v5.4.7) |
| [CVE-2025-54469](https://github.com/neuvector/neuvector/security/advisories/GHSA-c8g6-qrwh-m3vp) | NeuVector strengthened the enforcer’s monitor process by validating environment variables before execution. This change prevents unsafe command execution and improves overall runtime security and process integrity.| 17 Oct 2025 | [NeuVector v5.4.7](https://github.com/neuvector/neuvector/releases/tag/v5.4.7) |
| [CVE-2025-8077](https://github.com/neuvector/neuvector/security/advisories/GHSA-8pxw-9c75-6w56) | For NeuVector deployment on the Kubernetes-based environment, the bootstrap password of the default admin user will be generated randomly and stored in a Kubernetes secret. The default admin will need to get the bootstrap password from the Kubernetes secret first and will be asked to change their password after the first UI login is successful. | 25 Aug 2025 | [NeuVector v5.4.6](https://github.com/neuvector/neuvector/releases/tag/v5.4.6) |
| [CVE-2025-53884](https://github.com/neuvector/neuvector/security/advisories/GHSA-8ff6-pc43-jwv3) | NeuVector uses a cryptographically secure salt with the PBKDF2 algorithm instead of a simple hash to protect user passwords. For rolling upgrades from earlier versions, NeuVector recalculates and stores the new password hash only after each user’s next successful login. | 25 Aug 2025 | [NeuVector v5.4.6](https://github.com/neuvector/neuvector/releases/tag/v5.4.6) |
| [CVE-2025-54467](https://github.com/neuvector/neuvector/security/advisories/GHSA-w54x-xfxg-4gxq) | By default, NeuVector redacts process commands that contain the strings `password`, `passwd`, `pwd`, `token`, or `key` in security logs, syslog, enforcer debug logs, controller debug logs, webhooks, and support logs. Users can configure a Kubernetes ConfigMap to define custom regex patterns for additional process commands to redact. | 25 Aug 2025 | [NeuVector v5.4.6](https://github.com/neuvector/neuvector/releases/tag/v5.4.6) |
| [CVE-2025-46808](https://github.com/neuvector/manager/security/advisories/GHSA-fggw-hv56-8m6r) | Sensitive information may be logged in the manager container depending on logging configuration and credential permissions. For more information, refer to [Sensitive information exposure in NeuVector manager container logs](#sensitive-information-exposure-in-neuvector-manager-container-logs). | 09 Jul 2025 | [NeuVector v5.4.5](https://github.com/neuvector/neuvector/releases/tag/v5.4.5) |
| [CVE-2024-38095](https://www.suse.com/security/cve/CVE-2024-38095.html) | In .NET, a malicious X.509 certificate or certificate chain can cause excessive CPU consumption, resulting in denial of service. This CVE was flagged as an affected .NET library detection issue. | 9 Jul 2025 | [NeuVector v5.4.5](https://github.com/neuvector/neuvector/releases/tag/v5.4.5) |
| [CVE-2024-7347](https://www.suse.com/security/cve/CVE-2024-7347.html) | The NGINX `ngx_http_mp4_module` vulnerability allows crafted MP4 files to cause memory over-reads and worker process termination. This CVE was reported in NeuVector 5.4.2 as a possible **false negative** detection in the vulnerability scanner. The issue was related to detection accuracy and not to the NeuVector product itself.  |  15 Jan 2025 | [NeuVector v5.4.2](https://github.com/neuvector/neuvector/releases/tag/v5.4.2) |
| [CVE-2018-20796](https://www.suse.com/security/cve/CVE-2018-20796.html) | In the GNU C Library through 2.29, check_dst_limits_calc_pos_1 in `posix/regexec.c` has Uncontrolled Recursion. | 15 Jan 2025 | Not applicable, flagged in [v5.4.2](https://github.com/neuvector/neuvector/releases/tag/v5.4.2) as a **false positive**. |
| [CVE-2024-41110](https://github.com/advisories/GHSA-v23v-6jw2-98fq) | A security vulnerability has been detected in certain versions of Docker Engine, which could allow an attacker to bypass [authorization plugins (AuthZ)](https://docs.docker.com/engine/extend/plugins_authorization/) under specific circumstances. The base likelihood of this being exploited is low. | 16 Nov 2024 | [NeuVector v5.4.1](https://github.com/neuvector/neuvector/releases/tag/v5.4.1) |
| [CVE-2020-26160](https://github.com/advisories/GHSA-w73w-5m7g-f7qc) | `jwt-go` allows attackers to bypass intended access restrictions in situations with `[]string{}` for `m["aud"]` (which is allowed by the specification). Because the type assertion fails, "" is the value of `aud`. This is a security problem if the JWT token is presented to a service that lacks its own audience check. There is no patch available and users of `jwt-go` are advised to migrate to [`golang-jwt`](https://github.com/golang-jwt/jwt) at version 3.2.1. | 16 Nov 2024 | [NeuVector v5.4.1](https://github.com/neuvector/neuvector/releases/tag/v5.4.1) |

## OpenID Connect is vulnerable to MITM

* **CVE ID:** CVE-2025-66001[AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H](https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator?vector=AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H&version=3.1)
* **CVSS Score**:  8.8

**Affected Versions**

* All versions earlier than `5.3.0`
* Versions from `5.3.0` up to and including `5.4.7`

**Fixed version: `5.4.8`**

### Impact

NeuVector supports login authentication through OpenID Connect. However, the TLS verification (which verifies the remote server's authenticity and integrity) for OpenID Connect is not enforced by default. As a result this may expose the system to man-in-the-middle (MITM) attacks.

Starting from version 5.4.0, NeuVector supports TLS verification for following connection types:

* Registry Connections
* Auth Server Connections (SAML, LDAP and OIDC)
* Webhook Connections

By default, TLS verification remains disabled, and its configuration is located under Settings > Configuration in the NeuVector UI.

In the patched version, the new NeuVector deployment enables TLS verification by default. 
For rolling upgrades, NeuVector does not automatically change this setting to prevent disruptions.

:::note
When TLS verification is enabled, it affects all connections to
* Registry servers
* Auth servers (SAML, LDAP and OIDC)
* Webhook servers
:::

### Patches
Patched versions include release v5.4.8 and above.

### Workarounds
To manually enable TLS verification:
1. Open the NeuVector UI.
1. Navigate to Settings > Configuration.
1. In the TLS Self-Signed Certificate Configuration section, select Enable TLS verification.
1. (Optional) Upload or paste the TLS self-signed certificate.

## Questions and Support
If you have any questions or comments about this advisory:
* Reach out to the SUSE Rancher Security team for security related inquiries.
* Open an issue in the NeuVector repository.
* Verify with our support matrix and product support lifecycle.

## NeuVector is shipping cryptographic material into its binary

* **CVE ID:**  CVE-2025-54471
* **CVSS Score**: 6.5 - [AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N](https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator?vector=AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N&version=3.1)

**Affected Versions**

* All versions earlier than `5.3.0`
* Versions from `5.3.0` up to and including `5.4.6`

**Fixed version: `5.4.7`**

### Impact

NeuVector used a hard-coded cryptographic key embedded in the source code. At compilation time, the key value was replaced with the secret key value and used to encrypt sensitive configurations  when NeuVector stores the data.

In the patched version, NeuVector leverages the Kubernetes secret `neuvector-store-secret` in neuvector namespace to dynamically generate cryptographically secure random keys. This approach removes the reliance on static key values and ensures that encryption keys are managed securely within Kubernetes.

During rolling upgrade or restoring from persistent storage, the NeuVector controller checks each encrypted configured field. If a sensitive field in the configuration is found to be encrypted by the default encryption key, it’s decrypted with the default encryption key and then re-encrypted with the new dynamic encryption key.

If the NeuVector controller does not have the correct RBAC for accessing the new secret, it writes this error log,`Required Kubernetes RBAC for secrets are not found` and exits.

The device encryption key is rotated every 3 months. For details, please refer to [Rotating sensitive field in configuration](../../03.configuration/01.console/03.certrotate/03.certrotate.md#rotating-sensitive-field-in-configuration)

### Patches

Patched versions include release v5.4.7 and above.

### Workarounds

No workarounds are currently available. Customers are advised to upgrade to a fixed version at their earliest convenience.

## Questions and Support

* Contact the [SUSE Rancher Security team](https://github.com/rancher/rancher/security/policy).
* Open an issue in the [NeuVector GitHub repository](https://github.com/neuvector/neuvector/issues/new/choose).
* References:
   * [NeuVector Support Matrix](https://www.suse.com/suse-neuvector/support-matrix/all-supported-versions/neuvector-v-all-versions/)
   * [Product Support Lifecycle](https://www.suse.com/lifecycle/#suse-security)

   
## Telemetry sender is vulnerable to MITM and DoS

* **CVE ID:**  CVE-2025-54470
* **CVSS Score**: 8.6 - [AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:H](https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator?vector=AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N&version=3.1)

**Affected Versions**

* All versions earlier than `5.3.0`
* Versions from `5.3.0` up to and including `5.4.6`

**Fixed version: `5.4.7`, `5.3.5`**

### Impact

This vulnerability affects NeuVector deployments only when the “Report anonymous cluster data” option is enabled. When this option is enabled, NeuVector sends anonymous telemetry data to the telemetry server at `https://upgrades.neuvector-upgrade-responder.livestock.rancher.io`.

In affected versions, NeuVector does not enforce TLS certificate verification when transmitting anonymous cluster data to the telemetry server. As a result, the communication channel is susceptible to man-in-the-middle (MITM) attacks, where an attacker could intercept or modify the transmitted data. 

Additionally, NeuVector loads the response of the telemetry server is loaded into memory without size limitation, which makes  it vulnerable to a Denial of Service(DoS) attack. 

The patched version includes the following security improvements:
* NeuVector now verifies the telemetry server’s TLS certificate chain and hostname during the handshake process. This ensures that all telemetry communications occur over a trusted and verified channel.
* NeuVector limits the telemetry server’s response to 256 bytes, mitigating the risk of memory exhaustion and DoS attacks.

These security enhancements are enabled by default and require no user action.


### Patches

Patched versions include release v5.4.7 and above.

### Workarounds

If you cannot update to a patched version, you can temporarily disable the “Report anonymous cluster data”, which is enabled by default in NeuVector. To change this setting, go to **Settings** → **Configuration** → **Report anonymous cluster data** in the NeuVector UI.  

Disabling this option prevents NeuVector from sending telemetry data to the telemetry server, which helps mitigate this vulnerability. 

**Recommendation:**

The NeuVector team recommends upgrading to a patched version of NeuVector as soon as possible. The upgrade includes permanent fixes that ensure secure communication and prevent potential vulnerabilities related to telemetry data transmission.

## Questions and Support

* Contact the [SUSE Rancher Security team](https://github.com/rancher/rancher/security/policy).
* Open an issue in the [NeuVector GitHub repository](https://github.com/neuvector/neuvector/issues/new/choose).
* References:
   * [NeuVector Support Matrix](https://www.suse.com/suse-neuvector/support-matrix/all-supported-versions/neuvector-v-all-versions/)
   * [Product Support Lifecycle](https://www.suse.com/lifecycle/#suse-security)

## Sensitive information exposure in NeuVector manager container logs

**CVE ID:** CVE-2025-46808
**CVSS Score:** 6.8- [AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:N/A:N](https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator?vector=AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:N/A:N&version=3.1)
**CWE:** [CWE-532: Insertion of Sensitive Information into Log File](https://cwe.mitre.org/data/definitions/532)

**Affected Versions**

* All versions earlier than `5.0.0`
* Versions from `5.0.0` up to and including `5.4.4`

**Fixed version: `5.4.5`**

### Impact

A vulnerability has been identified in the NeuVector version up to and including `5.4.4`, where sensitive information is leaked into the manager container’s log. The listed fields can be caught in the log:

| Field | Field Description | Where it Appears | Reproduction | Environment |
| :---- | :---- | :---- | :---- | :---- |
| `X-R-Sess` | Rancher’s session token for single sign on token | Request header | Log in via Rancher UI and access NeuVector SSO | Rancher with NeuVector SSO |
| `personal_access_token` | The Github / Azure DevOps token | Request body | Submit remote repository config under *Configuration \> Settings* | NeuVector |
| `token1.token` | NeuVector user’s session token | Response body | Send GET request through NeuVector web server’s API: `https://<neuvector ui’s url>/user?name=<username>` | NeuVector |
| `rekor_public_key`, `root_cert`, `sct_public_key` | Rekor public key, Root certificate, Signed certificate timestamp(SCT) Public Key in private root of trust | Request body | Create/update private root of trust from Sigstore page | NeuVector |
| public\_key | Verifier’s public key | Request body | Create/update verifier in Sigstore page | NeuVector |

:::note
NeuVector installations that have the single sign-on integration with Rancher Manager and the Remote Repository Configuration disabled are not affected by this issue.
:::

In the patched version, X-R-Sess is partially masked so that users can confirm what is being used while still keeping it safe for consumption. The log, which includes `personal_access_token`, `token`, `rekor_public_key`, `root_cert`, `sct_public_key`, and `public key` are removed, as the request body is not mandatory in the log.

:::note
* The severity of the vulnerability depends on your logging strategy.
   * **Local logging (default)**: Limits exposure of impact.
   * **External logging**: Vulnerability’s severity increases, the impact depends on security measures implemented at the external log collector level.
* The final impact severity for confidentiality, integrity and availability is dependent on the permissions that the leaked credentials have on their own services.
:::

Please consult the associated [Unsecured credentials](https://attack.mitre.org/techniques/T1552/) for further information about this category of attack.

### Patches

Patched versions include release `5.4.5` and above. Users are advised to rotate the GitHub token used in Remote Repository Configuration once they have upgraded to a fixed version.

### Workarounds

No workarounds are currently available. Customers are advised to upgrade to a fixed version at their earliest convenience.

## Questions and Support

* Contact the [SUSE Rancher Security team](https://github.com/rancher/rancher/security/policy).
* Open an issue in the [NeuVector GitHub repository](https://github.com/neuvector/neuvector/issues/new/choose).
* References:
   * [NeuVector Support Matrix](https://www.suse.com/suse-neuvector/support-matrix/all-supported-versions/neuvector-v-all-versions/)
   * [Product Support Lifecycle](https://www.suse.com/lifecycle/#suse-security)
