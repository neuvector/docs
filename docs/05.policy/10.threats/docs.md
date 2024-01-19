---
title: Network Threat Signatures
taxonomy:
    category: docs
---

### Detecting Network Threats
NeuVector deep packet inspection can be used to inspect the network packets and payload for attacks such as those in the OWASP Top 10 and those commonly used in Web Application Firewalls (WAFs).

#### OWASP Signatures
DLP Sensors can be created to detect OWASP attacks using the following pattern examples. As always, these may need to be tuned for your environment and applications.

```
img src=javascript
/servlet/.*/org.apache.
/modules.php?.*name=Wiki.*<script
/error/500error.jsp.*et=.*<script
/mailman/.*?.*info=.*<script
\x0aReferer\x3a res\x3a/C\x3a
/cgi-bin/cgictl?action=setTaskSettings.*settings={\x22.*taskId=
/cgi-bin/cgictl.*scriptName=.*[?&]scriptName=[^&]*?([\x22\x27\x3c\x3e\x28\x29]|script|onload|src)
```


Here are other simple examples:
![owasp](owasp_top10_dlp.png)

####Built-In Threat Detection
NeuVector also has built-in detection of other network threats such as SQL Injection attacks, DDoS (e.g. Ping Death), and tunneling attacks. For SQL injection attacks, NeuVector inspects the network connection (SQL protocol) between the front end and the sql database pod, reducing false positives and increasing accuracy.