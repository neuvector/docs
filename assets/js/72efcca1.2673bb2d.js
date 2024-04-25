"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6736],{65655:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>r,toc:()=>c});var t=n(85893),o=n(11151);const i={title:"Configuration Assessment for Kubernetes Resources",taxonomy:{category:"docs"},slug:"/policy/admission/assessment"},a=void 0,r={id:"policy/admission/assessment/assessment",title:"Configuration Assessment for Kubernetes Resources",description:"Kubernetes Resource Deployment File Scanning",source:"@site/docs/05.policy/03.admission/02.assessment/02.assessment.md",sourceDirName:"05.policy/03.admission/02.assessment",slug:"/policy/admission/assessment",permalink:"/next/policy/admission/assessment",draft:!1,unlisted:!1,editUrl:"https://github.com/neuvector/docs/edit/main/docs/05.policy/03.admission/02.assessment/02.assessment.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Configuration Assessment for Kubernetes Resources",taxonomy:{category:"docs"},slug:"/policy/admission/assessment"},sidebar:"tutorialSidebar",previous:{title:"Sigstore Cosign Signature Verifiers",permalink:"/next/policy/admission/sigstore"},next:{title:"Groups",permalink:"/next/policy/groups"}},l={},c=[{value:"Kubernetes Resource Deployment File Scanning",id:"kubernetes-resource-deployment-file-scanning",level:3}];function m(e){const s={h3:"h3",img:"img",p:"p",...(0,o.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.h3,{id:"kubernetes-resource-deployment-file-scanning",children:"Kubernetes Resource Deployment File Scanning"}),"\n",(0,t.jsx)(s.p,{children:"NeuVector is able to scan deployment yaml files for configuration assessments against Admission Control rules. This is useful to scan deployment yaml files early in the pipeline to determine if the deployment would violate any rules before attempting the deployment."}),"\n",(0,t.jsx)(s.p,{children:"To upload a yaml file to be scanned, go to Policy -> Admission Control and click the Configuration Assessment button. In the window, select a file to upload, then Test."}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.img,{alt:"Assessment",src:n(8464).Z+"",width:"468",height:"179"})}),"\n",(0,t.jsx)(s.p,{children:"You will then see an analysis of the file, whether the deployment would be allowed, and messages for rules that would apply to the deployment file."})]})}function d(e={}){const{wrapper:s}={...(0,o.a)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(m,{...e})}):m(e)}},8464:(e,s,n)=>{n.d(s,{Z:()=>t});const t=n.p+"assets/images/assessment-9ad9c1b663208c1348ec5cd489a777cb.png"},11151:(e,s,n)=>{n.d(s,{Z:()=>r,a:()=>a});var t=n(67294);const o={},i=t.createContext(o);function a(e){const s=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function r(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),t.createElement(i.Provider,{value:s},e.children)}}}]);