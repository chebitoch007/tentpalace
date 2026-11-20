// Quick quality gate: node scripts/check.mjs
import fs from "fs";
let bad=0;const fail=m=>{console.error("FAIL",m);bad++};
const pages=fs.readdirSync(".").filter(f=>f.endsWith(".html"));
for(const p of pages){const h=fs.readFileSync(p,"utf8");
 if(!/<title>.+<\/title>/.test(h))fail(p+": title");
 if(!/name="description"/.test(h))fail(p+": description");
 if((h.match(/<h1[ >]/g)||[]).length!==1)fail(p+": needs exactly one h1");
 for(const m of h.matchAll(/href="(\/[^"#?]*)"/g)){const t=m[1]==="/"?"index.html":m[1].slice(1);
  if(!fs.existsSync(t)&&!fs.existsSync(t+".html"))fail(p+": broken link "+m[1])}}
if(fs.existsSync("data/styles.json"))try{const d=JSON.parse(fs.readFileSync("data/styles.json","utf8"));
 d.forEach(i=>{if(!i.title||!i.category)fail("styles.json item "+JSON.stringify(i));if(i.image&&!fs.existsSync(i.image.slice(1)))fail("missing image "+i.image)})}catch(e){fail("styles.json: "+e.message)}
console.log(bad?bad+" problem(s)":"All checks passed ("+pages.length+" pages)");process.exit(bad?1:0);
