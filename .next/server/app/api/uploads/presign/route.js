"use strict";(()=>{var e={};e.id=100,e.ids=[100],e.modules={517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7262:(e,t,a)=>{a.r(t),a.d(t,{headerHooks:()=>l,originalPathname:()=>$,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>c,staticGenerationAsyncStorage:()=>d,staticGenerationBailout:()=>h});var s={};a.r(s),a.d(s,{POST:()=>POST});var r=a(884),o=a(6132);let n=require("crypto");var i=a.n(n);function isoNow(){return new Date().toISOString().replace(/[:\-]|\.\d{3}/g,"")}async function POST(e){try{let{filename:t,contentType:a}=await e.json(),s=process.env.S3_BUCKET,r=process.env.S3_REGION,o=process.env.S3_ENDPOINT.replace(/^https?:\/\//,""),n=process.env.S3_ACCESS_KEY_ID,p=process.env.S3_SECRET_ACCESS_KEY,u=`releases/${Date.now()}-${t}`,d=`${s}.${o}`,c=`https://${d}/${u}`,l=isoNow(),h=l.slice(0,8),$="AWS4-HMAC-SHA256",g=`${h}/${r}/s3/aws4_request`,S="content-type;host;x-amz-content-sha256;x-amz-date",_="UNSIGNED-PAYLOAD",m=`content-type:${a}
host:${d}
x-amz-content-sha256:${_}
x-amz-date:${l}
`,x=`PUT
/${u}

${m}
${S}
${_}`,v=i().createHash("sha256").update(x).digest("hex"),w=`${$}
${l}
${g}
${v}`,A=i().createHmac("sha256","AWS4"+p).update(h).digest(),P=i().createHmac("sha256",A).update(r).digest(),E=i().createHmac("sha256",P).update("s3").digest(),H=i().createHmac("sha256",E).update("aws4_request").digest(),C=i().createHmac("sha256",H).update(w).digest("hex"),O=`${$} Credential=${n}/${g}, SignedHeaders=${S}, Signature=${C}`;return Response.json({url:c,headers:{Authorization:O,"x-amz-date":l,"x-amz-content-sha256":_,"content-type":a},key:u})}catch(e){return console.error("Presign error:",e),Response.json({error:"Failed to generate presigned URL"},{status:500})}}let p=new r.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/uploads/presign/route",pathname:"/api/uploads/presign",filename:"route",bundlePath:"app/api/uploads/presign/route"},resolvedPagePath:"/Users/wizloxssd/Downloads/kushtunes-starter/app/api/uploads/presign/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:u,staticGenerationAsyncStorage:d,serverHooks:c,headerHooks:l,staticGenerationBailout:h}=p,$="/api/uploads/presign/route"}};var t=require("../../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),a=t.X(0,[729],()=>__webpack_exec__(7262));module.exports=a})();