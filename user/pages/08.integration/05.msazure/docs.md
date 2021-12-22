---
title: SAML (Azure AD)
taxonomy:
    category: docs
---

### Integrate with Azure AD SAML authentication

1 In the Azure management console, select the ”Enterprise applications" menu item in Azure Active Directory 

![azure_config1](azure1.png)

2 Select “New Application”

![azure_config2](azure2.png)

3 Create a Non-gallery application and give it a unique name

![azure_config3](azure3.png)

4 In the application's configuration page, select "Single sign-on" in the left-side panel and choose the SAML-based sign-on

![azure_config4](azure4.png)

5 Download the certificate in the base64 format and note the application's Login URL and Azure AD Identifier 

![azure_config5](azure5.png)

6 In the NeuVector management console, login as an administrator. Select “Settings" in the administrator dropdown menu at the top-right corner. Click SAML settings

![azure_config6](azure6.png)

7 Configure the SAML server as follows:
+ Copy application's "Login URL" as the Single Sign-On URL.
+ Copy "Azure AD Identifier" as the Issuer.
+ Open downloaded the certificate and copy the text to X.509 Certificate box.
+ Set a default role. 
+ Enter the group name for role mapping. The group claim returned by Azure are identified by the "Object ID" instead of the name. The group's object ID can be located in **Azure Active Directory > Groups > Group name Page**. You should use this value to configure group-based role mapping in NeuVector.

![OpenID5](openid5.png)

Then Enable the SAML server.

![azure_config7](azure7.png)

8 Copy the Redirect URL

![azure_config8](azure8.png)


9 Return to the Azure management console to setup "Basic SAML Configuration". Copy NeuVector console's Redirect URL to both "Identifier" and "Reply URL" boxes

![azure_config9](azure9.png)

10 Edit "SAML Signing Certificate", changing the Signing Option to "Sign SAML response"

![azure_config10](azure10.png)

11 Edit "User Attributes & Claims" so the response can carry the login user's attributes back to NeuVector. Click "Add new claim" to add "Username" and "Email" claims with "user.userprincipalname" and "user.mail" respectively.

![azure_config11](azure11.png)

12 If the users are assigned to the groups in the active directory, their group membership can be added to the claim. Find the application in "App registrations" and edit the manifest. Modify the value of "groupMembershipClaims" to "All".

![azure_config12](azure12.png)

13 Authorize users and groups to access the application so they can login NeuVector console with Azure AD SAML SSO

![azure_config13](azure13.png)


#### Mapping Groups to Roles and Namespaces
Please see the [Users and Roles](/configuration/users#mapping-groups-to-roles-and-namespaces) section for how to map groups to preset and custom roles as well as namespaces in NeuVector.
