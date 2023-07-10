<!-- <!DOCTYPE html> -->
<html>
<head>
<!-- Note: Grav does not apear to work with HTML <title> tag -->
<title>NeuVector Docs</title>
<style>
/********** BEGIN CSS ***********/
body {
	margin: 30px 30px !important; 
	background-color: none !important;
}
table {
	border-collapse: separate !important;
	border-spacing: 15px !important;
	background-color: none !important;
}
p {
	text-align: center !important;
	font-weight: normal !important;
	background-color: none !important;
	margin-left: 0px !important; 
	}
.titles {
	font-size: 42px !important; 
	margin-left: 0px !important; 
	font-weight: bold !important;
	text-align: center !important;
	padding-bottom: 0px !important;
	margin-bottom: -25px !important;
}
.subtitles {
	font-size: 18px !important; 
	font-weight: bold !important; 
	text-align: center !important;
	margin-left: 40px !important; 
}
.mainoptions {
	/* viewport max-width adjustment for 3 across main options */
	max-width: 210px !important;
	/* fix for center option box sized smaller at 1200px */
	min-width: 200px !important;
	border: 1px solid black !important;	
	background-color: #f0f0f0 !important;
	/* viewport breakpoint test color 
	background-color: tomato !important; */
	/* padding adjustment for main icons, top & bottom set to 0 */
	padding-top: 0px !important;
	padding-right: 20px !important;
	padding-bottom: 0px !important;
	padding-left: 20px !important;
	/* position adjustments for main section */
	position: relative !important;
	height: 420px !important;
}
/* position adjustments for main section */
.mainoptionicon {
	position: absolute !important;
	top: 40px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    left: 0 !important;
    right: 0 !important;
}
/* override Grav framework CSS image control to position main option icons */
img {
 	margin: 0 !important;
}
.mainheadingcontainer {
	display: flex !important;
	flex-direction: row !important;
	text-align: center !important;
	/* postion adjustments for main section */
	margin-top: 90px !important;
}
.mainheadingcenter {
	text-align: center !important;
	margin: auto !important;
}
.mainheading {
	font-size: 36px !important; 
	text-align: center !important;
	font-weight: bold !important;
	color: green !important;
	background-color: none !important;
	margin-bottom: 0px !important;
	/* line height adjust for box re-sizing */
	line-height: 1.2 !important;
	padding-bottom: 10px !important;
}
.maintext {
	font-size: 20px !important; 
	text-align: center !important;
	color: black !important;
	background-color: none !important;
	line-height: 1.2 !important;
	margin-top: 0px !important;
}
.poptopic {
	text-align: center !important;
	background-color: none !important;
	border: none !important;
	min-width: 220px !important;
	padding-top: 0px !important;
	padding-right: 10px !important;
	padding-bottom: 0px !important;
	padding-left: 10px !important;
}
.poptopictitle {
	font-size: 20px !important;
	font-weight: bold !important;
	text-align: center !important;
	color: green !important;
	background-color: none !important;
	margin-top: 40px !important;
	line-height: 99% !important;
	padding-top: 0px !important;
	padding-right: 0px !important;
	padding-bottom: 10px !important;
	padding-left: 20px !important;
	line-height: 1.2 !important;
}
.poptopictext {
	font-size: 16px !important;
	font-weight: normal !important;
	text-align: center !important;
	color: black !important;
	background-color: none !important;
	margin-top: -30px !important;
	line-height: 1.2 !important;
	padding-top: 0px !important;
	padding-right: 0px !important;
	padding-bottom: 0px !important;
	padding-left: 20px !important;
}
.poptopicicon {
	margin: auto !important;
	position: relative !important;
}
.poptopiccontainer {
	display: flex !important;
	flex-direction: row !important;
	text-align: center !important;
}
.poptopictextcenter {
	text-align: center !important;
	margin: auto !important;
}
@media (max-width: 1600px) {
	#chapter {
	margin-left: -50px !important;
	}
	.mainoptions {
		border: 1px solid black !important;
		background-color: none !important;
		/* viewport breakpoint test color 
		background-color: yellow !important; */
	}
	.mainheading {
		font-size: 30px !important; 
		 margin-top: 50px !important; 
		/* line height adjust for box re-sizing */
		line-height: 1.2 !important;
	}
	.maintext {
		font-size: 16px !important;
		padding: 1px 1px !important;
	}	
	.poptopiccontainer {
		display: flex !important;
		flex-direction: column !important;
		margin-bottom: -40px !important;
	}
	.poptopicicon {
		margin-top: 20px !important;
	}
	.poptopictextcenter {
		margin-top: -20px !important;
	}
}
@media (max-width: 1200px) {
	table, tr, td {
		/* inline-block enables stepped browser sizing */
		display: inline-block !important;
		text-align: center !important;
		margin: 5px !important;
		padding-left: 0px !important;
		padding-right: 0px !important;
	}
	.poptopiccontainer {
		flex-direction: column !important;
		}
	.titles {
		font-size: 36px !important; 
		text-align: center !important;
		margin-bottom: 0px !important;
	}
	.subtitles {
		font-size: 16px !important; 
		text-align: center !important;
		margin-left: 0px !important;
	}
	.mainheadingcontainer {
		margin-top: 190px !important;
	}
	.mainoptions {
		/* max-width adjustment to hold 3 across main headings */
		max-width: 185px !important;
		border: 1px solid black !important;
		min-height: 325px !important;
		max-height: 325px !important;
		background-color: none !important;
		/* 	viewport breakpoint test color 
		background-color: lightgreen !important; */
		}	
	.mainheading {
		font-size: 24px !important; 
		margin-top: -40px !important;
		/* line height adjust for box re-sizing */
		line-height: 1.2 !important;
	}
	.maintext {
		font-size: 16px !important;
		padding: 1px 1px !important;
		}
	.poptopic {
		max-width: 100px !important;
		padding-top: 0px !important;
		padding-right: 0px !important;
		padding-bottom: 0px !important;
		padding-left: 0px !important;
		}	
	.poptopicicon {
		text-align: center !important;
		margin-top: 0px !important;
		margin-bottom: 10px !important;
		margin-right: auto !important;
		margin-left: auto !important;
	}
	.poptopictitle {
		font-size: 18px !important;
		margin-top: 0px !important;
	}
	.poptopictext {
		font-size: 14px !important;
		max-width: 250px !important;
	}
	.poptopiccontainer {
		display: flex !important;
		flex-direction: column !important;
		margin-bottom: -10px !important;
		}
	.poptopictextcenter {
		margin-top: auto !important;
	}
}
/**********  END CSS **********/

</style>
</head>

<body>
	<p class="titles">Welcome to the NeuVector Docs</p>
	<p class="subtitles">Here you can access the complete documentation for NeuVector, the only Kubernetes-native container security platform.</p>
<p><strong>NeuVector Images on Docker Hub </strong></p>
<p>The images are on the NeuVector Docker Hub registry. Use the appropriate version tag for the manager, controller, enforcer, and leave the version as 'latest' for scanner and updater. For example:
<li>neuvector/manager:5.2.0</li>
<li>neuvector/controller:5.2.0</li>
<li>neuvector/enforcer:5.2.0</li>
<li>neuvector/scanner:latest</li>
<li>neuvector/updater:latest</li></p>
<p>Please be sure to update the image references in appropriate yaml files.</p>
<p>If deploying with the current NeuVector Helm chart (v1.8.9+), the following changes should be made to values.yml:
<li>Update the registry to docker.io</li>
<li>Update image names/tags to the appropriate version on Docker hub, as shown above</li>
<li>Leave the imagePullSecrets empty</li></p>
<p>If upgrading from NeuVector 4.x, please see these <a href="/releasenotes/5x#upgrading-from-neuvector-4x-to-5x">instructions.</a></p>
<table style="border: none">	
<tr>		
	<td class="mainoptions"> <img src="install-neuvector-icon.png" width="100" height="100" class="mainoptionicon">
	<span class="mainheadingcontainer">
		<div class="mainheadingcenter">
			<p class="mainheading"><a href="/deploying/kubernetes">Deploy on Kubernetes<a></p> 
			<p class="maintext">Install NeuVector via kubectl commands</p> 
		</div>
	</span>
	</td>
	<td class="mainoptions"> <img src="helm-chart-icon.png" width="100" height="100" class="mainoptionicon">
	<span class="mainheadingcontainer">
		<div class="mainheadingcenter">
			<p class="mainheading"><a href="https://github.com/neuvector/neuvector-helm">Deploy Using Helm Charts<a></p> 
			<p class="maintext">Deploy NeuVector on Kubernetes or OpenShift</p> 
		</div>
	</span>
	</td>
	<td class="mainoptions"> <img src="deploy-neuvector-icon.png" width="100" height="100" class="mainoptionicon">
		<span class="mainheadingcontainer">
		<div class="mainheadingcenter">
			<p class="mainheading"><a href="/deploying/production/operators">OpenShift Operator<a></p>
			<p class="maintext">Deploy NeuVector using Red Hat Certified or Community Operator</p>
		</div>
	</span>
	</td>
</tr>
</table>
<p class="titles">Popular Topics</p>
<!-- Popular Topics Row #1 -->
<table style="border: none">
<tr>		
<!-- r1c1 -->	
	<td class="poptopic"> 
	<span class="poptopiccontainer">
		<img src="poptopic-r2c2.png" width="40" height="40" class="poptopicicon"> 
			<div class="poptopictextcenter">
				<p class="poptopictitle"><a href="/deploying/production">Preparing for Deployment<a></p>
				<p class="poptopictext">Plan deployments including persistent data backups</p>
			</div>	
	</span>
	</td>
<!-- r1c2 -->	
	<td class="poptopic"> 
	<span class="poptopiccontainer">
		<img src="poptopic-r1c1.png" width="40" height="40" class="poptopicicon"> 
			<div class="poptopictextcenter">
				<p class="poptopictitle"><a href="/scanning/build">CI/CD Automated Scanning<a></p>
				<p class="poptopictext">Scan images as part of a CI/CD pipeline</p>
			</div>	
	</span>
	</td>
<!-- r1c3 -->	
	<td class="poptopic"> 
	<span class="poptopiccontainer">
		<img src="poptopic-r1c3.png" width="40" height="40" class="poptopicicon"> 
			<div class="poptopictextcenter">
				<p class="poptopictitle"><a href="/policy/usingcrd">Security Policy as Code<a></p>
				<p class="poptopictext">Create and manage security policy using CRDs</p>
			</div>	
	</span>
	</td>
</tr>

<!-- Popular Topics Row #2 -->
<tr>
<!-- r2c1 -->	
	<td class="poptopic"> 
	<span class="poptopiccontainer">
		<img src="poptopic-r2c1.png" width="40" height="40" class="poptopicicon"> 
			<div class="poptopictextcenter">
				<p class="poptopictitle"><a href="/policy/modes">Operationalize NeuVector<a></p>
				<p class="poptopictext">Move from Discovery Mode to Monitor & Protect Modes</p>
			</div>	
	</span>
	</td>
<!-- r2c2 -->	
	<td class="poptopic"> 
	<span class="poptopiccontainer">
		<img src="poptopic-r3c2.png" width="40" height="40" class="poptopicicon"> 
			<div class="poptopictextcenter">
				<p class="poptopictitle"><a href="/scanning/scanning">Manage Vulnerabilities & Compliance<a></p>
				<p class="poptopictext">End-to-End scanning & compliance reporting</p>
			</div>
	</span>
	</td>
<!-- r2c3 -->			
	<td class="poptopic"> 
	<span class="poptopiccontainer">
		<img src="poptopic-r2c3.png" width="40" height="40" class="poptopicicon"> 
			<div class="poptopictextcenter">
				<p class="poptopictitle"><a href="/configuration/users">Users and Roles<a></p>
				<p class="poptopictext">Add users and customize role-based access control (RBAC)</p></td>
			</div>	
	</span>
	</td>	
</tr>	

<!-- Popular Topics Row #3 -->
<tr>
<!-- r3c1 -->	
	<td class="poptopic"> 
	<span class="poptopiccontainer">
		<img src="poptopic-r3c1.png" width="40" height="40" class="poptopicicon"> 
			<div class="poptopictextcenter">
				<p class="poptopictitle"><a href="/policy/networkrules">Network Segmentation and Threats<a></p>
				<p class="poptopictext">Using the container firewall network rules, egress controls, and threat detection</p>
			</div>
	</span>
	</td>
<!-- r3c2 -->		
	<td class="poptopic"> 
	<span class="poptopiccontainer">
		<img src="poptopic-r3c2.png" width="40" height="40" class="poptopicicon"> 
			<div class="poptopictextcenter">
				<p class="poptopictitle"><a href="/integration/integration">Enterprise Authentication & SSO<a></p>
				<p class="poptopictext">LDAP, Active Directory, SAML, OpenID, Okta integration</p>
			</div>	
	</span>
	</td>
<!-- r3c3 -->		
	<td class="poptopic"> 
	<span class="poptopiccontainer">
		<img src="poptopic-r2c2.png" width="40" height="40" class="poptopicicon"> 
			<div class="poptopictextcenter">
				<p class="poptopictitle"><a href="/automation/automation">NeuVector API Reference<a></p>
				<p class="poptopictext">Automate NeuVector using the REST API</p>
			</div>
	</span>
	</td>
</tr>	
</table>
</body>
</html>
		 
