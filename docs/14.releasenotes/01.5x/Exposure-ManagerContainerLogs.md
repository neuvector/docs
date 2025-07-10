# Sensitive information exposure in NeuVector manager container logs

**CVE ID:** CVE-2025-46808
**CVSS Score:** 6.8- [AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:N/A:N](https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator?vector=AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:N/A:N&version=3.1)
**CWE:** [CWE-532: Insertion of Sensitive Information into Log File](https://cwe.mitre.org/data/definitions/532)

**Affected Versions**

* All versions earlier than `5.0.0`
* Versions from `5.0.0` up to and including `5.4.4`

**Fixed version: `5.4.5`** 

### **Impact**

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

### **Patches**

Patched versions include release `5.4.5` and above. Users are advised to rotate the GitHub token used in Remote Repository Configuration once they have upgraded to a fixed version.

### **Workarounds**

No workarounds are currently available. Customers are advised to upgrade to a fixed version at their earliest convenience.

If you have any questions or comments about this advisory:

* Reach out to the [SUSE Rancher Security team](https://github.com/rancher/rancher/security/policy) for security related inquiries.
* Open an issue in the [NeuVector](https://github.com/neuvector/neuvector/issues/new/choose) repository.
* Verify with our [support matrix](https://www.suse.com/suse-neuvector/support-matrix/all-supported-versions/neuvector-v-all-versions/) and [product support lifecycle](https://www.suse.com/lifecycle/#suse-security).

