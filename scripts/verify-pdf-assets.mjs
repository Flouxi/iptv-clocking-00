import fs from 'node:fs/promises';
import { createDecipheriv, createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
const catalog = JSON.parse(await fs.readFile(new URL('../src/lib/pdf-catalog.json',import.meta.url)));
if(process.env.PDF_ASSET_KEY){
 const key=Buffer.from(process.env.PDF_ASSET_KEY,'base64'),b=await fs.readFile(new URL('../pdf-products.enc',import.meta.url));
 if(key.length!==32||b.subarray(0,5).toString()!=='PDF01')throw Error('Invalid protected PDF bundle');
 const d=createDecipheriv('aes-256-gcm',key,b.subarray(5,17));d.setAuthTag(b.subarray(17,33));d.setAAD(Buffer.from('IPNORD4K:pdf-assets:v1'));
 const payload=JSON.parse(inflateSync(Buffer.concat([d.update(b.subarray(33)),d.final()])).toString());
 const expected=new Set(catalog.map(f=>f.slug+'.pdf'));
 if(Object.keys(payload).length!==expected.size||Object.keys(payload).some(f=>!expected.has(f)))throw Error('Unexpected PDF bundle files');
 const verified=catalog.map(f=>{const bytes=Buffer.from(payload[f.slug+'.pdf'],'base64');if(bytes.length!==f.bytes||createHash('sha256').update(bytes).digest('hex')!==f.sha256)throw Error('PDF bundle integrity check failed: '+f.slug);return{f,bytes};});
 await fs.mkdir(new URL('../private-products/',import.meta.url),{recursive:true});
 for(const {f,bytes}of verified)await fs.writeFile(new URL('../private-products/'+f.slug+'.pdf',import.meta.url),bytes);
}
for (const file of catalog) {
 const b=await fs.readFile(new URL('../private-products/'+file.slug+'.pdf',import.meta.url)).catch(()=>null);
 if(!b||b.length!==file.bytes||createHash('sha256').update(b).digest('hex')!==file.sha256)throw Error('Protected PDF files or PDF_ASSET_KEY must be supplied before deployment: '+file.slug);
}
console.log('All 13 protected PDF assets verified.');
