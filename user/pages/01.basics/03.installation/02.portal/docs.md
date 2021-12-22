---
title: Customer Portal Access
taxonomy:
    category: docs
---

### NeuVector Customer Portal Access
NeuVector customers can login to the [NeuVector Customer Portal](https://console.cloud.neuvector.com) at https://console.cloud.neuvector.com to access various NeuVector services. Each person can have their own account, identified by an email address, to access the portal. Users are associated with a Company, which determines which services the user has access to.

#### Creating An Account
If you have already have engaged a NeuVector representative for access to NeuVector images, they have likely created an account for you and provided access to your company resources. To request or verify access, please contact your representative.

You can also self register on the [portal login page](https://console.cloud.neuvector.com) by clicking the Sign Up link. You will receive an automated email to verify your email address, then be able to login. Initially, you will not see any resources until your account has been associated with a company. 

Please send an <a href="mailto:someone@yoursite.com?subject=Requesting portal access for my company">email</a> to support@neuvector.com with your email, company, and any other relevant information so we can provide access to the appropriate resources for you. If you have already self-registered, please let us know that your account has been created.

### Registry Credentials for registry.neuvector.com
After you have logged into the portal, any registry credentials to which you have access will be displayed on the home page. Click on the credential link to be able to copy and download the credential and see the instructions for how to use them when pulling the NeuVector images.

In most cases, several technical contacts at a company will have access to the same credentials. However, in special cases, users from the same company may have access to different credentials.

If you wish to delete or disable a credential, or create a new one for your company, please contacts support@neuvector.com or your local representative.

<strong>Important</strong>: Make sure to allow-list through firewalls 'registry.neuvector.com' and 'https://us-docker.pkg.dev/' which is the current redirect for the full registry path at https://us-docker.pkg.dev/artifacts-downloads/namespaces/neuvector-cloud-live-292322/repositories/neuvector-us/downloads/.

Note 1: Registry credentials allow access to registry.neuvector.com to pull NeuVector images. They do not provide a license key to access the NeuVector console or use any features. License keys are provided separately, according to your trial or purchase terms.

Note 2: Each credential has one main contact name listed for it. There may be several users who have access to each credential.

### NeuVector Software Releases
The customer portal displays the current releases available for the NeuVector images. You can also open the toggle to see previous versions.

To query the release tags available from a terminal, use the sample script below:
```
#!/bin/bash

#set -e
#set -u
#set -o pipefail
#set -x

### Script Name ###
### Purpose ###
### Description ###

usage () {
        echo "Usage: `basename $0` [image name | ie: controller]"
        echo "Update script _PASSWORD_ variable."
        exit 1
}

if [ -z $1 ]; then
  usage
  exit 1
fi

_REGISTRY_=https://registry.neuvector.com
_USERNAME_=_json_key_base64
_PASSWORD_=NEED-TO-REPLACE-WITH-YOURS

AUTH=`curl -s -u $_USERNAME_:$_PASSWORD_ $_REGISTRY_/_token | jq .token | awk '{print substr($0, 2, length($0) - 2)}'`

curl -s -H "Authorization: Bearer $AUTH" $_REGISTRY_/v2/$1/tags/list | jq .
```

Or use the curl commands directly as below:
```
   DOCKER_PASSWORD="your-registry-access-DOCKER_PASSWORDword"
   DOCKER_USERNAME="_json_key_base64"
   IMAGE="prometheus-exporter"
   TOKEN=$(curl -s -u "$DOCKER_USERNAME:$DOCKER_PASSWORD" "https://registry.neuvector.com/_token" | jq -r .token)
   curl -H "Authorization: Bearer $TOKEN" "https://registry.neuvector.com/v2/$IMAGE/tags/list" | jq .
```

#### Additional Services
We plan to add other services to the portal such as license management, partner resources, support access in the future. Please send any suggestions to support@neuvector.com.