import fs from 'fs';

async function main() {
  const url = 'https://aiesec.org/_next/static/chunks/8642-63961ce8dea97338.js';
  const res = await fetch(url);
  const text = await res.text();

  console.log('--- Searching for client_id or auth parameters ---');
  const clientIds = text.match(/client_id["']?\s*[:=]\s*["']([^"']+)["']/gi) ||
                    text.match(/https:\/\/auth\.aiesec\.org[^\s"'\`]+/g);
  console.log('Client IDs / Auth URLs:', clientIds);

  const oauthIdx = text.indexOf('auth.aiesec.org');
  if (oauthIdx !== -1) {
    console.log('--- Context around auth.aiesec.org ---');
    console.log(text.substring(Math.max(0, oauthIdx - 150), Math.min(text.length, oauthIdx + 400)));
  }
}

main();
