---
title: Deploy Using ConfigMap
taxonomy:
    category: docs
---

### Kubernetes ConfigMap

NeuVector supports automated deployment using the Kubernetes ConfigMap feature. This enables deployment of NeuVector containers with the appropriate configurations, integrations, and other settings in an automated way.

The 'always_reload: true' setting can be added in any ConfigMap yaml to force reload of that yaml every time the controller starts (version 4.3.2+). Otherwise, the ConfigMap will only be loaded at initial startup or after complete cluster restart (see persistent storage section below).

#### Complete Sample NeuVector ConfigMap (initcfg.yaml)

The latest ConfigMap can be found [here](https://raw.githubusercontent.com/neuvector/manifests/main/kubernetes/5.2.0/initcfg.yaml).

The sample is also shown below. This contains all the settings available. Please remove the sections not needed and edit the sections needed. Note: If using configmap in a secret, see section below for formatting changes.
```
apiVersion: v1
data:
  passwordprofileinitcfg.yaml: |
    # Optional. true or false or empty string(false)
    always_reload: false
    active_profile_name: default
    pwd_profiles:
    # only default profile is supported.
    - name: default
      comment: default from configMap
      min_len: 6
      min_uppercase_count: 0
      min_lowercase_count: 0
      min_digit_count: 0
      min_special_count: 0
      enable_block_after_failed_login: false
      block_after_failed_login_count: 0
      block_minutes: 0
      enable_password_expiration: false
      password_expire_after_days: 0
      enable_password_history: false
      password_keep_history_count: 0
      # Optional. value between 30 -- 3600  default 300
      session_timeout: 300
  roleinitcfg.yaml: |
    # Optional. true or false or empty string(false)
    always_reload: false
    roles:
    # Optional.
    - Comment: test role
    # Mandatory. name can have ^[a-zA-Z0-9]+[.:a-zA-Z0-9_-]*$
      Name: testrole
    # Mandatory
      Permissions:
        - id: config
          read: true
          write: true
        - id: rt_scan
          read: true
          write: true
        - id: reg_scan
          read: true
          write: true
        - id: ci_scan
          write: true
        - id: rt_policy
          read: true
          write: true
        - id: admctrl
          read: true
          write: true
        - id: compliance
          read: true
          write: true
        - id: audit_events
          read: true
        - id: security_events
          read: true
        - id: events
          read: true
        - id: authentication
          read: true
          write: true
        - id: authorization
          read: true
          write: true
  ldapinitcfg.yaml: |
    # Optional. true or false or empty string(false)
    always_reload: false
    # Mandatory. OpenLDAP or MicrosoftAD
    directory: OpenLDAP
    # Mandatory.
    Hostname: 1.2.3.4
    # Optional. the default value is 389
    Port: 389
    # Optional true or false or empty string(false)
    SSL: false
    # Mandatory.
    base_dn: cn=admin,dc=example,dc=org
    # Optional.
    bind_dn: dc=example,dc=org
    # Optional.
    bind_password: password
    # Optional. empty string(memberUid for openldap or member for windows ad)
    group_member_attr: 
    # Optional. empty string(cn for openldap or sAMAccountName for windows ad)
    username_attr: 
    # Optional. true or false or empty string(false)
    Enable: false
    # Optional. admin or reader or empty string(none)
    Default_Role: admin
    group_mapped_roles:
      - group: admin1
        global_role: admin
      - group: reader1
        global_role: reader
      - group: cipos1
        global_role: ciops
      - group: admin2
        global_role: admin
      - group: reader2
        global_role: reader
      - group: ciops2
        global_role: ciops
      - group: ns
        global_role:
        role_domains:
          testrole:
            - ns2-ciops1
            - ns2-ciops2
          reader:
            - ns2-reader1
            - ns2-reader2
          admin:
            - ns2-admin1
            - ns2-admin2
      - group: custom
        global_role: testrole
        role_domains:
          ciops:
            - custom-ciops1
            - custom-ciops2
          reader:
            - custom-reader1
            - custom-reader2
          admin:
            - custom-admin1
            - custom-admin2
  oidcinitcfg.yaml: |
    # Optional. true or false or empty string(false)
    always_reload: false
    # Mandatory
    Issuer: https://...
    # Mandatory
    Client_ID: f53c56ec...
    # Mandatory
    Client_Secret: AyAixE3...
    # Optional. empty or string(group filter info)
    GroupClaim:  
    # Optional. empty string(openid,profile,email)
    Scopes:
      - openid
      - profile
      - email
    # Optional. true or false or empty string(false)
    Enable: false
    # Optional. admin or reader or empty string(none)
    Default_Role: admin
    group_mapped_roles:
      - group: admin1
        global_role: admin
      - group: reader1
        global_role: reader
      - group: cipos1
        global_role: ciops
      - group: admin2
        global_role: admin
      - group: reader2
        global_role: reader
      - group: ciops2
        global_role: ciops
      - group: ns
        global_role:
        role_domains:
          testrole:
            - ns2-ciops1
            - ns2-ciops2
          reader:
            - ns2-reader1
            - ns2-reader2
          admin:
            - ns2-admin1
            - ns2-admin2
      - group: custom
        global_role: testrole
        role_domains:
          ciops:
            - custom-ciops1
            - custom-ciops2
          reader:
            - custom-reader1
            - custom-reader2
          admin:
            - custom-admin1
            - custom-admin2
    group_claim: groups
  samlinitcfg.yaml: |
    # Optional. true or false or empty string(false)
    always_reload: false
    # Mandatory
    SSO_URL: https://...
    # Mandatory
    Issuer: https://...
    # Mandatory
    X509_Cert: |
      -----BEGIN CERTIFICATE-----
      MIIC8DCCAdigAwIBAgIQSMNDFv5HI7RPgF0uHW8YJDANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQD
      ...
      -----END CERTIFICATE-----
    x509_cert_extra:
      - |
        -----BEGIN CERTIFICATE-----
        MIIC8DCCAdigAwIBAgIQSMNDFv5HI7RPgF0uHW8YJDANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQD
        ...
        -----END CERTIFICATE-----
    # Optional. empty or string(group filter info)
    GroupClaim:  
    # Optional. true or false or empty string(false)
    Enable: false
    # Optional. admin or reader or empty string(none)
    Default_Role: admin
    group_mapped_roles:
      - group: admin1
        global_role: admin
      - group: reader1
        global_role: reader
      - group: cipos1
        global_role: ciops
      - group: admin2
        global_role: admin
      - group: reader2
        global_role: reader
      - group: ciops2
        global_role: ciops
      - group: ns
        global_role:
        role_domains:
          testrole:
            - ns2-ciops1
            - ns2-ciops2
          reader:
            - ns2-reader1
            - ns2-reader2
          admin:
            - ns2-admin1
            - ns2-admin2
      - group: custom
        global_role: testrole
        role_domains:
          ciops:
            - custom-ciops1
            - custom-ciops2
          reader:
            - custom-reader1
            - custom-reader2
          admin:
            - custom-admin1
            - custom-admin2
    group_claim: groups
  sysinitcfg.yaml: |
    # Optional. true or false or empty string(false)
    always_reload: false
    # Optional. Choose between  Discover or Monitor or Protect or empty string(Discover)
    New_Service_Policy_Mode: Discover
    # Optional. zero-drift or basic or empty string(zero-drift)
    New_Service_Profile_Baseline: zero-drift
    # Optional. input valid ipv4 address or empty string
    Syslog_ip: 1.2.3.4
    # Optional. input 17, 6 or 66 here for udp, tcp, tcp+tls or empty string(17)
    Syslog_IP_Proto: 17
    # Optional. it is required when Syslog_IP_Proto is 66 only
    Syslog_Server_Cert: |
      -----BEGIN CERTIFICATE-----
      MIIC8DCCAdigAwIBAgIQSMNDFv5HI7RPgF0uHW8YJDANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQD
      ...
      -----END CERTIFICATE-----
    # Optional. empty string(514)
    Syslog_Port: 514
    # Optional. chose between Alert/Critical/Error/Warning/Notice/Info/Debug or empty string(Info)
    Syslog_Level: Info
    # Optional. true or false or empty string(false)
    Syslog_status: false
    Syslog_Categories:
    # Optional. can chose multiple between event/security-event/audit or empty string
      - event
      - security-event
      - audit
    Syslog_in_json: 
    # Optional. true, false, empty, unconfigured.
    #  true = In Json: checkbox enabled from Settings > Configuration > Syslog
    #  false, empty, unconfigured = In Json: checkbox disabled from Settings > Configuration > Syslog
    #
    # Optional. true or false or empty string(false)
    Auth_By_Platform: false
    single_cve_per_syslog: false
    syslog_cve_in_layers: false
    # Optional
    Webhooks:
      - name: myslack
        url: http...
        type: Slack
        enable: true
      - name: mywebhook
        url: http...
        enable: true
    # Optional. empty string
    Cluster_Name: cluster.local
    # Optional. chose multiple between cpath/mutex/conn/scan/cluster or empty string
    Controller_Debug:
      - cpath
    # Optional. true or false or empty string(true)
    Monitor_Service_Mesh: true
    # Optional. true or false or empty string(false)
    Registry_Http_Proxy_Status: false
    # Optional.  true or false or empty string(false)
    Registry_Https_Proxy_Status: false
    # Optional. http/https registry proxy or empty string
    Registry_Http_Proxy:
      URL: http...
      Username: username
      Password: password
    Registry_Https_Proxy:
      URL: https...
      Username: username
      Password: password
    Xff_Enabled: true
    Net_Service_Status: false
    Net_Service_Policy_Mode: Discover
    Scanner_Autoscale:
    # Optional. Choose between immediate or delayed or empty string
      Strategy: 
      Min_Pods: 1
      Max_Pods: 3
    # Optional. true or false or empty string(false)
    No_Telemetry_Report: false
    Scan_Config:
      # Optional. true or false or empty string(false)
      Auto_Scan: false
    # Optional. default value is 24. unit is hour and range is between 0 and 168
    Unused_Group_Aging: 24
  userinitcfg.yaml: |
    # Optional. true or false or empty string(false)
    always_reload: false
    users:
    # add multiple users below
    -
    # this user will be added
    # Optional.
      EMail: user1@email.com
    # Mandatory. username can have ^[a-zA-Z0-9]+[.:a-zA-Z0-9_-]*$
      Fullname: user1
    # Optional. en or zh_cn or empty string(en)
      Locale: en
    # Optional. password length minimal 6, don't lead with ]`}*|<>!%
      Password: password
    # Optional. admin or reader or empty string(none)
      Role: reader
    # Optional. admin group or reader group or empty string
      Role_Domains:
        admin:
          - admin1
          - admin2
        reader:
          - reader1
          - reader2
    # Optional. value between 30 -- 3600  default 300
      Timeout: 300
    -
    # this user will overwrite the original admin user
      Fullname: admin
      Password: password
      Role: admin
kind: ConfigMap
metadata:
  name: neuvector-init
  namespace: neuvector
```


Then create the ConfigMap object:
```
kubectl create -f initcfg.yaml
```

### Protect Sensitive Data Using a Secret
If sensitive data is to be included in some sections of the configmap, a secret can be created for those sections with sensitive data.

For example, create the configMap for NON-sensitive sections such as passwordProfile and role:
```
kubectl create configmap neuvector-init --from-file=$HOME/init/passwordprofileinitcfg.yaml --from-file=$HOME/init/roleinitcfg.yaml -n neuvector
```

Then create a secret for sections with sensitive data, such as:
```
kubectl create secret generic neuvector-init --from-file=$HOME/init/eulainitcfg.yaml --from-file=$HOME/init/ldapinitcfg.yaml --from-file=$HOME/init/oidcinitcfg.yaml --from-file=$HOME/init/samlinitcfg.yaml --from-file=$HOME/init/sysinitcfg.yaml --from-file=$HOME/init/userinitcfg.yaml -n neuvector
```
***Important!*** Remove the the pipe '|' character in each section, as shown below.

Note the removal of the pipe character below if using configmap sections in a secret, enabled set to true, and uncomment out the section to be included in the secret.
```
secret:
    # NOTE: files defined here have preferrence over the ones defined in the configmap section
    enabled: true
    data:
      eulainitcfg.yaml:
        license_key: 0Bca63Iy2FiXGqjk...
      #   ...
      # ldapinitcfg.yaml:
      #   directory: OpenLDAP
      #   ...
      # oidcinitcfg.yaml:
      #   Issuer: https://...
      #   ...
      # samlinitcfg.yaml:
      #   ...
      # sysinitcfg.yaml:
      #   ...
      # userinitcfg.yaml:
      #   ...
```

After controller is deployed, all the configuration files from both configmap and secret will be stored in /etc/config folder.

Note that the secret is referred to in the standard Kubernetes and OpenShift Controller [deployment yaml files](/deploying/kubernetes#kubernetes-deployment-examples-for-neuvector) under Volumes.

### ConfigMaps and Persistent Storage
Both the ConfigMaps and the [persistent storage](/deploying/production#backups-and-persistent-data) backup are only read when a new NeuVector cluster is deployed, or the cluster fails and is restarted. They are not used during rolling upgrades.

The persistent storage configuration backup is read first, then the ConfigMaps are applied, so ConfigMap settings take precedence. All ConfigMap settings (e.g. updates) will also be saved into persistent storage.

