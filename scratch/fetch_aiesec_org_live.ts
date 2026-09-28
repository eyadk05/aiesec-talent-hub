import fs from 'fs';

async function main() {
  console.log('Fetching https://aiesec.org/search?programmes=8 ...');
  const res = await fetch('https://aiesec.org/search?programmes=8', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });

  const html = await res.text();
  console.log('HTML length:', html.length);

  // Next.js embeds initial state in <script id="__NEXT_DATA__"> or self-initialization scripts
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (nextDataMatch) {
    console.log('Found __NEXT_DATA__!');
    fs.writeFileSync('scratch/next_data.json', nextDataMatch[1] || '{}');
  } else {
    console.log('__NEXT_DATA__ not found. Checking window.__NEXT_P or stream data...');
    // Look for embedded JSON state or opportunity objects
    const jsonMatches = html.match(/\{"id":\d+,"title":"[^"]+"/g);
    console.log('Opportunity matches in HTML:', jsonMatches);
    fs.writeFileSync('scratch/search_page.html', html);
  }
}

main();
