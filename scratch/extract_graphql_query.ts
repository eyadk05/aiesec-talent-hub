import fs from 'fs';

async function main() {
  const url = 'https://aiesec.org/_next/static/chunks/app/(root)/(default-navbar)/search/page-b91d28b1a5494369.js';
  const res = await fetch(url);
  const text = await res.text();

  const queryIdx = text.indexOf('searchAllOpportunityQuery');
  if (queryIdx !== -1) {
    console.log('--- Context around searchAllOpportunityQuery ---');
    console.log(text.substring(Math.max(0, queryIdx - 200), Math.min(text.length, queryIdx + 1500)));
  } else {
    console.log('query not found in main search page script');
  }

  // Also check chunk 7193 or 8642 or others if needed
  const chunks = [
    '/_next/static/chunks/7193-7ddfa2bc239be358.js',
    '/_next/static/chunks/8642-63961ce8dea97338.js',
    '/_next/static/chunks/3745-f194215c2472b5bb.js'
  ];

  for (const c of chunks) {
    const cUrl = `https://aiesec.org${c}`;
    const cRes = await fetch(cUrl);
    const cText = await cRes.text();
    const idx = cText.indexOf('searchAllOpportunityQuery');
    if (idx !== -1) {
      console.log(`--- Found in ${c} ---`);
      console.log(cText.substring(Math.max(0, idx - 200), Math.min(cText.length, idx + 1500)));
    }
  }
}

main();
