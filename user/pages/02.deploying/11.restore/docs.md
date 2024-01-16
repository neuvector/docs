---
title: Restoring NeuVector Configuration
taxonomy:
    category: docs
---


### Restoring NeuVector Configuration 
A backup of the NeuVector configuration can be applied to restore a previous configuration of NeuVector. The backup file can be generated manually as well as imported from the console in Settings -> Configuration, choosing all configuration (e.g. registry configurations, integrations, other settings plus policy) or Policy only (e.g. rules/security policy). The rest API can also be used to automatically backup the configuration, as seen in this [example](/automation/automation#exportimport-configuration-file).

Cluster events where all controllers stop running, thereby losing real-time configuration state, can be automatically stored when [persistent storage](/deploying/production#backups-and-persistent-data) has been properly configured.

NOTE: NeuVector does not support partial restoration of objects (e.g. network rules only) nor timestamped restoration (e.g. restore from date/time snapshots). Please use [automation scripts](/automation/automation#exportimport-configuration-file) to regularly backup configuration files and manage timestamps.

*** Important *** 
The backup configuration files should not be edited in any way. Any changes to these from their exported state could result in restoration errors and an unpredictable result. 

*** Caution ***
Backup configuration files should be used to restore a NeuVector state on the same cluster from which they were exported. Applying a backup configuration file from a different cluster could result in unpredictable results.

#### Recommended High Availability Settings
Manual backup and restore of configuration should be planned only as a last resort. The following steps are recommended for high availability.
1. Use Helm with a ConfigMap for initial deployment and configuration.
2. Use CRDs for defining policy such as network/process, admission control, and other rules.
3. Run multiple controllers (minimum 3) to auto-sync configuration between running pods, and ensure they run on different hosts.
4. Configure persistent storage (as part of step 1 to recover from any cluster wide failures where all controllers stop running.
5. Regularly backup configuration to timestamped backup files.
6. Restore a cluster's NeuVector configuration from a backup file as a last resort, applying any CRDs after restoration that were new or changed since the previous backup.