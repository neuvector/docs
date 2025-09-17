# Security Advisories and CVEs

NeuVector is committed to informing the community of security issues. Below is a CVE reference list of published security advisories and CVEs (Common Vulnerabilities and Exposures) for issues we have resolved.

## CVE List

| ID | Description | Date | Release |
| :---- | :---- | :---- | :---- |
| [CVE-2025-8077](https://github.com/neuvector/neuvector/security/advisories/GHSA-8pxw-9c75-6w56) | For NeuVector deployment on the Kubernetes-based environment, the bootstrap password of the default admin user will be generated randomly and stored in a Kubernetes secret. The default admin will need to get the bootstrap password from the Kubernetes secret first and will be asked to change password after the first UI login is successful. | 25 Aug 2025 | [NeuVector v5.4.6](https://github.com/neuvector/neuvector/releases/tag/v5.4.6) |
| [CVE-2025-53884](https://github.com/neuvector/neuvector/security/advisories/GHSA-8ff6-pc43-jwv3) | NeuVector uses a cryptographically secure salt with the PBKDF2 algorithm instead of a simple hash to protect user passwords. For rolling upgrades from earlier versions, NeuVector recalculates and stores the new password hash only after each user’s next successful login. | 25 Aug 2025 | [NeuVector v5.4.6](https://github.com/neuvector/neuvector/releases/tag/v5.4.6) |
| [CVE-2025-54467](https://github.com/neuvector/neuvector/security/advisories/GHSA-w54x-xfxg-4gxq) | By default, NeuVector redacts process commands that contain the strings password,passwd, pwd, token, or key in security logs, syslog, enforcer debug logs, controller debug logs, webhooks, and support logs. Users can configure a Kubernetes ConfigMap to define custom regex patterns for additional process commands to redact. | 25 Aug 2025 | [NeuVector v5.4.6](https://github.com/neuvector/neuvector/releases/tag/v5.4.6) |
| [CVE-2025-46808](?) | Sensitive information may be logged in the manager container depending on logging configuration and credential permissions. For more information, refer to [ Sensitive information exposure in NeuVector manager container logs](#sensitive-information-exposure-in-neuvector-manager-container-logs) | ? | [NeuVector v5.4.5](https://github.com/neuvector/neuvector/releases/tag/v5.4.5) |


| — | . Fixed in 5.4.5. | < 5.0.0 – 5.4.4

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
**Note:** NeuVector installations not using the single sign-on integration with Rancher Manager, and does not have Remote Repository Configuration enabled, are not affected by this issue.
:::

In the patched version, X-R-Sess is partially masked so that users can confirm what it is being used while still keeping it safe for consumption. The log which includes `personal_access_token`, `token`, `rekor_public_key`, `root_cert`, `sct_public_key`, `public key` are removed, as the request body is not mandatory in the log.

:::note
* The severity of the vulnerability depends on your logging strategy.
   * **Local logging (default)**: Limits exposure of impact.
   * **External logging**: Vulnerability’s severity increases, the impact depends on security measures implemented at the external log collector level.
* The final impact severity for confidentiality, integrity and availability is dependent on the permissions that the leaked credentials have on their own services.

Please consult the associated [Unsecured credentials](https://attack.mitre.org/techniques/T1552/) for further information about this category of attack.

### Patches

Patched versions include release `5.4.5` and above. Users are advised to rotate the GitHub token used in Remote Repository Configuration once they have upgraded to a fixed version.

### Workarounds

No workarounds are currently available. Customers are advised to upgrade to a fixed version at their earliest convenience.

## Questions and Support

* Contact the [SUSE Rancher Security team](https://github.com/rancher/rancher/security/policy).
* Open an issue in the [NeuVector GitHub repository](https://github.com/neuvector/neuvector/issues/new/choose).
* References:
  ** [NeuVector Support Matrix](https://www.suse.com/suse-neuvector/support-matrix/all-supported-versions/neuvector-v-all-versions/)
  ** [Product Support Lifecycle](https://www.suse.com/lifecycle/#suse-security)