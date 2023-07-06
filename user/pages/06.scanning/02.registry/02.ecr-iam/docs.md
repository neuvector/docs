---
title: ECR Scanning using IAM Roles
taxonomy:
    category: docs
---

### AWS ECR - IAM RolesWhen the NeuVector containers are deployed in AWS, and an EC2 instance is assigned a role of “EC2 Container Registry” Read Access, the AWS ECR registry can be scanned without an Access Key and Secret Key.Here is how to create an AWS role and assign it to the node.#### Select the InstanceNote that the IAM role is either blank or does not include the ECR role![awsrole](ecr1.png)#### Attach a RoleSelect Actions -> Instance Settings -> Attach/Replace IAM Role![awsrole](ecr2.png)If you have not previously created the ECR role, click Create New IAM Role. Enter the role name.![attachrole](ecr3.png)#### Select the AWS Service![select](ecr4.png)#### List of Roles![awsroles](ecr5.png)#### Attach the ECR Read Permission to the Role![permissions](ecr6.png)#### Review Your Settings![review](ecr7.png)#### Check the Instance for IAM Role![instance](ecr9.png)