import fs from 'fs';

async function main() {
  console.log('Fetching aiesec.org homepage & scripts...');
  const res = await fetch('https://aiesec.org/search', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  console.log('HTML length:', html.length);

  // Extract JS scripts URLs
  const scriptRegex = /src=["']([^"']+\.js[^"']*)["']/g;
  let match;
  const jsUrls: string[] = [];
  while ((match = scriptRegex.exec(html)) !== null) {
    if (match[1]) jsUrls.push(match[1]);
  }

  console.log('Found JS files:', jsUrls);

  // Inspect each JS file for tokens or API keys
  for (const jsUrl of jsUrls) {
    const fullUrl = jsUrl.startsWith('http') ? jsUrl : `https://aiesec.org${jsUrl.startsWith('/') ? '' : '/'}${jsUrl}`;
    try {
      console.log('Fetching JS:', fullUrl);
      const jsRes = await fetch(fullUrl);
      const jsText = await jsRes.text();

      // Look for access_token, token, gis-api, etc.
      const tokenMatch = jsText.match(/access_token["']?\s*[:=]\s*["']([a-zA-Z0-9_\-]+)["']/i) ||
                         jsText.match(/token["']?\s*[:=]\s*["']([a-f0-9]{32,64})["']/i) ||
                         jsText.match(/REACT_APP_[A-Z_]*TOKEN["']?\s*[:=]\s*["']([^"']+)["']/i) ||
                         jsText.match(/"access_token"\s*:\s*"([^"]+)"/);

      if (tokenMatch) {
        console.log('Found potential token in JS:', tokenMatch[1]);
      }

      // Look for endpoint strings
      const endpointMatch = jsText.match(/https:\/\/gis-api[^\s"'\`]+/g);
      if (endpointMatch) {
        console.log('Found GIS endpoints:', Array.from(new Set(endpointMatch)).slice(0, 5));
      }
    } catch (e) {
      console.error('Error fetching JS:', jsUrl);
    }
  }
}

main();
