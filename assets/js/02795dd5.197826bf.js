"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4137],{64689:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>p,frontMatter:()=>i,metadata:()=>a,toc:()=>c});var o=t(85893),r=t(11151);const i={title:"Deploying NeuVector",taxonomy:{category:"docs"},slug:"/deploying/production"},s=void 0,a={id:"deploying/production/production",title:"Deploying NeuVector",description:"Planning Deployments",source:"@site/docs/02.deploying/01.production/01.production.md",sourceDirName:"02.deploying/01.production",slug:"/deploying/production",permalink:"/next/deploying/production",draft:!1,unlisted:!1,editUrl:"https://github.com/neuvector/docs/edit/main/docs/02.deploying/01.production/01.production.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Deploying NeuVector",taxonomy:{category:"docs"},slug:"/deploying/production"},sidebar:"tutorialSidebar",previous:{title:"2. Deploying NeuVector 5.x",permalink:"/next/deploying"},next:{title:"Deploy Using ConfigMap",permalink:"/next/deploying/production/configmap"}},l={},c=[{value:"Planning Deployments",id:"planning-deployments",level:3},{value:"Best Practices, Tips, Q&amp;A for Deploying and Managing NeuVector",id:"best-practices-tips-qa-for-deploying-and-managing-neuvector",level:4},{value:"Deployment Using Helm or Operators",id:"deployment-using-helm-or-operators",level:3},{value:"Deployment Using ConfigMap",id:"deployment-using-configmap",level:3},{value:"Deploying the Controllers",id:"deploying-the-controllers",level:3},{value:"Controller HA",id:"controller-ha",level:3},{value:"Backups and Persistent Data",id:"backups-and-persistent-data",level:3},{value:"Persistent Volume Example",id:"persistent-volume-example",level:4},{value:"ConfigMaps and Persistent Storage",id:"configmaps-and-persistent-storage",level:4},{value:"Updating CVE Vulnerability Database in Production",id:"updating-cve-vulnerability-database-in-production",level:3},{value:"Accessing the Console",id:"accessing-the-console",level:3},{value:"Handing Host Updates or Auto-Scaling Nodes with a Pod Disruption Budget",id:"handing-host-updates-or-auto-scaling-nodes-with-a-pod-disruption-budget",level:3},{value:"Deploy Without Privileged Mode",id:"deploy-without-privileged-mode",level:3},{value:"Multi-site, Multi-Cluster Architecture",id:"multi-site-multi-cluster-architecture",level:3}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h3,{id:"planning-deployments",children:"Planning Deployments"}),"\n",(0,o.jsx)(n.p,{children:"The NeuVector containers in a default deployment include the controller, manager, enforcer, scanner, and updater. Placement of where these containers (on which nodes) are deployed must be considered, and appropriate labels, taints or tolerations created to control them."}),"\n",(0,o.jsx)(n.p,{children:"The enforcer should be deployed on every host/node where application containers to be monitored and protected by NeuVector will be running."}),"\n",(0,o.jsx)(n.p,{children:"The controller manages the cluster of enforcers, and can be deployed on the same node as an enforcer or on a separate management node. The manager should be deployed on the node where the controller is running, and will provide console access to the controller. Other required NeuVector containers such as the manager, scanner, and updater are described in more detail in the Best Practices guide referenced below."}),"\n",(0,o.jsx)(n.p,{children:"If you haven\u2019t done so, pull the images from the NeuVector Docker Hub."}),"\n",(0,o.jsx)(n.p,{children:"The images are on the NeuVector Docker Hub registry. Use the appropriate version tag for the manager, controller, enforcer, and leave the version as 'latest' for scanner and updater. For example:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"neuvector/manager:5.3.0"}),"\n",(0,o.jsx)(n.li,{children:"neuvector/controller:5.3.0"}),"\n",(0,o.jsx)(n.li,{children:"neuvector/enforcer:5.3.0"}),"\n",(0,o.jsxs)(n.li,{children:["neuvector/scanner",":latest"]}),"\n",(0,o.jsxs)(n.li,{children:["neuvector/updater",":latest"]}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"Please be sure to update the image references in appropriate yaml files."}),"\n",(0,o.jsx)(n.p,{children:"If deploying with the current NeuVector Helm chart (v1.8.9+), the following changes should be made to values.yml:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsx)(n.li,{children:"Update the registry to docker.io"}),"\n",(0,o.jsx)(n.li,{children:"Update image names/tags to the current version on Docker Hub, as shown above"}),"\n",(0,o.jsx)(n.li,{children:"Leave the imagePullSecrets empty"}),"\n"]}),"\n",(0,o.jsx)(n.h4,{id:"best-practices-tips-qa-for-deploying-and-managing-neuvector",children:"Best Practices, Tips, Q&A for Deploying and Managing NeuVector"}),"\n",(0,o.jsxs)(n.p,{children:["Download and review this ",(0,o.jsx)(n.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:t(48314).Z+"",children:"Deployment Best Practices document"})," for tips such as performance and sizing, best practices, and frequently asked questions about deployments."]}),"\n",(0,o.jsx)(n.h3,{id:"deployment-using-helm-or-operators",children:"Deployment Using Helm or Operators"}),"\n",(0,o.jsxs)(n.p,{children:["Automated deployment using Helm can be found at ",(0,o.jsx)(n.a,{href:"https://github.com/neuvector/neuvector-helm",children:"https://github.com/neuvector/neuvector-helm"}),"."]}),"\n",(0,o.jsxs)(n.p,{children:["Deployment using an Operator, including RedHat Certified Operator and Kubernetes community operator is supported, with a general description ",(0,o.jsx)(n.a,{href:"/deploying/production/operators",children:"here"}),". The NeuVector RedHat operator is at ",(0,o.jsx)(n.a,{href:"https://access.redhat.com/containers/#/registry.connect.redhat.com/neuvector/neuvector-operator",children:"https://access.redhat.com/containers/#/registry.connect.redhat.com/neuvector/neuvector-operator"}),", and the community operator at ",(0,o.jsx)(n.a,{href:"https://operatorhub.io/operator/neuvector-operator",children:"https://operatorhub.io/operator/neuvector-operator"}),"."]}),"\n",(0,o.jsx)(n.h3,{id:"deployment-using-configmap",children:"Deployment Using ConfigMap"}),"\n",(0,o.jsxs)(n.p,{children:["Automated deployment on Kubernetes is supported using a ConfigMap. Please see the ",(0,o.jsx)(n.a,{href:"/deploying/production/configmap",children:"Deploying Using ConfigMap"})," section for more details."]}),"\n",(0,o.jsx)(n.h3,{id:"deploying-the-controllers",children:"Deploying the Controllers"}),"\n",(0,o.jsx)(n.p,{children:"We recommend that multiple controllers be run for a high availability (HA) configuration. The controllers use the consensus based RAFT protocol to elect a leader and if the leader goes down, to elect another leader. Because of this, the number of active controllers should be an odd number, for example 3, 5, 7 etc."}),"\n",(0,o.jsx)(n.h3,{id:"controller-ha",children:"Controller HA"}),"\n",(0,o.jsx)(n.p,{children:"The controllers will synchronize all data between themselves, including configuration, policy, conversations, events, and notifications."}),"\n",(0,o.jsx)(n.p,{children:"If the primary active controller goes down, a new leader will automatically be elected and take over."}),"\n",(0,o.jsx)(n.p,{children:"Take special precautions to make sure there is always one controller running and ready, especially during host OS or orchestration platform updates and reboots."}),"\n",(0,o.jsx)(n.h3,{id:"backups-and-persistent-data",children:"Backups and Persistent Data"}),"\n",(0,o.jsx)(n.p,{children:"Be sure to periodically export the configuration file from the console and save it as a backup."}),"\n",(0,o.jsx)(n.p,{children:"If you run multiple controllers in an HA configuration, as long as one controller is always up, all data will be synchronized between controllers."}),"\n",(0,o.jsx)(n.p,{children:"If you wish to save logs such as violations, threats, vulnerabilities and events please enable the SYSLOG server in Settings."}),"\n",(0,o.jsx)(n.p,{children:"NeuVector supports persistent data for the NeuVector policy and configuration. This configures a real-time backup to mount a volume at /var/neuvector/ from the controller pod. The primary use case is when the persistent volume is mounted, the configuration and policy are stored during run-time to the persistent volume. In the case of total failure of the cluster, the configuration is automatically restored when the new cluster is created. Configuration and policy can also be manually restored or removed from the /var/neuvector/ volume."}),"\n",(0,o.jsx)(n.admonition,{title:"important",type:"warning",children:(0,o.jsx)(n.p,{children:"If a persistent volume is not mounted, NeuVector does NOT store the configuration or policy as persistent data. Be sure to backup the Controller configuration and policy before stopping the allinone or controller container. This can be done in Settings -> Configuration. Alternatively, the controller can be deployed in an HA configuration with 3 or 5 controllers running, in which case the policy will persist with other controllers while one is being updated."})}),"\n",(0,o.jsx)(n.h4,{id:"persistent-volume-example",children:"Persistent Volume Example"}),"\n",(0,o.jsx)(n.p,{children:"The PersistentVolume defined in the cluster is required for persistent volume support. The requirement for NeuVector is that the accessModes needs to be ReadWriteMany(RWX). Not all storage types support the RWX access mode. For example, on GKE you may need to create a RWX persistent volume using NFS storage."}),"\n",(0,o.jsx)(n.p,{children:"Once the PersistentVolume is created, there needs to be created a PersistentVolumeClaim as below for Controller. Currently the persistent volume is used only for the NeuVector configuration backup files in the controller (Policies, Rules, user data, integrations etc)."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: neuvector-data\n  namespace: neuvector\nspec:\n  accessModes:\n    - ReadWriteMany\n  volumeMode: Filesystem\n  resources:\n    requests:\n      storage: 1Gi\n"})}),"\n",(0,o.jsx)(n.p,{children:"Here is an example for IBM Cloud:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:'apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: neuvector-data\n  namespace: neuvector\n  labels:\n    billingType: "hourly"\n    region: us-south\n    zone: sjc03\nspec:\n  accessModes:\n    - ReadWriteMany\n  resources:\n    requests:\n      storage: 5Gi\n      iops: "100"\n  storageClassName: ibmc-file-retain-custom\n'})}),"\n",(0,o.jsx)(n.p,{children:"After the Persistent Volume Claim is created, modify the NeuVector sample yaml file as shown below (old section commented out):"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"...\nspec:\n  template:\n    spec:\n      volumes:\n        - name: nv-share\n#         hostPath:                        // replaced by persistentVolumeClaim\n#           path: /var/neuvector        // replaced by persistentVolumeClaim\n          persistentVolumeClaim:\n            claimName: neuvector-data\n"})}),"\n",(0,o.jsx)(n.p,{children:"Also add the following environment variable in the Controller or Allinone sample yamls for persistent volume support. This will make the Controller read the backup config when starting."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"            - name: CTRL_PERSIST_CONFIG\n"})}),"\n",(0,o.jsx)(n.h4,{id:"configmaps-and-persistent-storage",children:"ConfigMaps and Persistent Storage"}),"\n",(0,o.jsx)(n.p,{children:"Both the ConfigMaps and the persistent storage backup are only read when a new NeuVector cluster is deployed, or the cluster fails and is restarted. They are not used during rolling upgrades."}),"\n",(0,o.jsx)(n.p,{children:"The persistent storage configuration backup is read first, then the ConfigMaps are applied, so ConfigMap settings take precedence. All ConfigMap settings (e.g. updates) will also be saved into persistent storage."}),"\n",(0,o.jsxs)(n.p,{children:["For more information see the ",(0,o.jsx)(n.a,{href:"/deploying/production/configmap",children:"ConfigMaps"})," section."]}),"\n",(0,o.jsx)(n.h3,{id:"updating-cve-vulnerability-database-in-production",children:"Updating CVE Vulnerability Database in Production"}),"\n",(0,o.jsx)(n.p,{children:"Please see each sample section for instructions on how to keep the CVE database updated."}),"\n",(0,o.jsx)(n.p,{children:"The CVE database version can be seen in the Console in the Vulnerabilities tab. You can also inspect the Updater container image."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-shell",children:"docker inspect neuvector/updater\n"})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-json",children:'"Labels": {\n                "neuvector.image": "neuvector/updater",\n                "neuvector.role": "updater",\n                "neuvector.vuln_db": "1.255"\n            }\n'})}),"\n",(0,o.jsx)(n.p,{children:"After running the update, inspect the controller/allinone logs for 'version.' For example in Kubernetes:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-shell",children:"kubectl logs neuvector-controller-pod-777fdc5668-4jkjn -n neuvector | grep version\n\n...\n2019-07-29T17:04:02.43 |DEBU|SCN|main.dbUpdate: New DB found - create=2019-07-24T11:59:13Z version=1.576\n2019-07-29T17:04:02.454|DEBU|SCN|memdb.ReadCveDb: New DB found - update=2019-07-24T11:59:13Z version=1.576\n2019-07-29T17:04:12.224|DEBU|SCN|main.scannerRegister: - version=1.576\n"})}),"\n",(0,o.jsx)(n.h3,{id:"accessing-the-console",children:"Accessing the Console"}),"\n",(0,o.jsxs)(n.p,{children:["By default the console is exposed as a service on port 8443, or nodePort with a random port on each host. Please see the first section Basics -> ",(0,o.jsx)(n.a,{href:"/configuration/console",children:"Connect to Manager"})," for options for turning off HTTPS or accessing the console through a corporate firewall which does not allow port 8443 for the console access."]}),"\n",(0,o.jsx)(n.h3,{id:"handing-host-updates-or-auto-scaling-nodes-with-a-pod-disruption-budget",children:"Handing Host Updates or Auto-Scaling Nodes with a Pod Disruption Budget"}),"\n",(0,o.jsx)(n.p,{children:"Maintenance or scaling activities can affect the controllers on nodes. Public cloud providers support the ability to auto-scale nodes, which can dynamically evict pods including the NeuVector controllers. To prevent disruptions to the controllers, a NeuVector pod disruption budget can be created."}),"\n",(0,o.jsx)(n.p,{children:"For example, create the file below nv_pdb.yaml to ensure that there are at least 2 controllers running at any time."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-yaml",children:"apiVersion: policy/v1beta1\nkind: PodDisruptionBudget\nmetadata:\n  name: neuvector-controller-pdb\n  namespace: neuvector\nspec:\n  minAvailable: 2\n  selector:\n    matchLabels:\n      app: neuvector-controller-pod\n"})}),"\n",(0,o.jsx)(n.p,{children:"Then"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-shell",children:"kubectl create -f nv_pdb.yaml\n"})}),"\n",(0,o.jsxs)(n.p,{children:["For more details: ",(0,o.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/run-application/configure-pdb/",children:"https://kubernetes.io/docs/tasks/run-application/configure-pdb/"})]}),"\n",(0,o.jsx)(n.h3,{id:"deploy-without-privileged-mode",children:"Deploy Without Privileged Mode"}),"\n",(0,o.jsx)(n.p,{children:"On some systems, deployment without using privileged mode is supported. These systems must support seccom capabilities and setting the apparmor profile."}),"\n",(0,o.jsxs)(n.p,{children:["See the section on ",(0,o.jsx)(n.a,{href:"/deploying/docker",children:"Docker deployment"})," for sample compose files."]}),"\n",(0,o.jsx)(n.h3,{id:"multi-site-multi-cluster-architecture",children:"Multi-site, Multi-Cluster Architecture"}),"\n",(0,o.jsx)(n.p,{children:"For enterprises with multiple locations and where a separate NeuVector cluster can be deployed for each location, the following is a proposed reference architecture. Each cluster has its own set of controllers and is separately managed."}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.img,{alt:"Multi-Site",src:t(3306).Z+"",width:"1380",height:"1068"})}),"\n",(0,o.jsxs)(n.p,{children:["See a more detailed description in this file >\n",(0,o.jsx)(n.a,{target:"_blank","data-noBrokenLinkCheck":!0,href:t(68805).Z+"",children:"NeuVector Multi-Site Architecture"})]})]})}function p(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},48314:(e,n,t)=>{t.d(n,{Z:()=>o});const o=t.p+"assets/files/NV_Onboarding_5.0-e780f27e1cde02dad5ebf3650377aff0.pdf"},68805:(e,n,t)=>{t.d(n,{Z:()=>o});const o=t.p+"assets/files/multisite-cf3f1e947d7f33801c9789a7622f4746.pdf"},3306:(e,n,t)=>{t.d(n,{Z:()=>o});const o=t.p+"assets/images/multisite-7d0184915e4d1a75d7e828c444a83513.png"},11151:(e,n,t)=>{t.d(n,{Z:()=>a,a:()=>s});var o=t(67294);const r={},i=o.createContext(r);function s(e){const n=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),o.createElement(i.Provider,{value:n},e.children)}}}]);