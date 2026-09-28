import fs from 'fs';

async function main() {
  const chunks = [
    'app/layout-c69655fa9d32b567.js',
    'app/(root)/layout-1907bae52898ee9c.js',
    'app/(root)/(default-navbar)/layout-0f44b80648b26105.js',
    'main-app-ebc74d7de184dc9a.js',
    '8642-63961ce8dea97338.js',
    '2117-fc6cf66b4f310785.js'
  ];

  for (const c of chunks) {
    const url = `https://aiesec.org/_next/static/chunks/${c}`;
    try {
      const res = await fetch(url);
      const text = await res.text();
      
      const tokenIdx = text.indexOf('access_token');
      if (tokenIdx !== -1) {
        console.log(`--- Found access_token in ${c} ---`);
        console.log(text.substring(Math.max(0, tokenIdx - 100), Math.min(text.length, tokenIdx + 300)));
      }

      const authIdx = text.indexOf('auth');
      if (authIdx !== -1) {
        // search for token endpoint
        const matches = text.match(/https?:\/\/[^\s"'\`]*auth[^\s"'\`]*/g);
        if (matches) {
          console.log(`Auth URLs in ${c}:`, matches);
        }
      }

      // Check for process.env or NEXT_PUBLIC variables
      const envVars = text.match(/NEXT_PUBLIC_[A-Z_]+/g);
      if (envVars) {
        console.log(`ENV vars in ${c}:`, Array.from(new Set(envVars)));
      }
    } catch (e) {
      console.error('Error fetching chunk:', c);
    }
  }
}

main();
