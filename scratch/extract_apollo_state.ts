import fs from 'fs';

async function main() {
  const html = fs.readFileSync('scratch/search_page.html', 'utf-8');

  // Extract all self.__next_f pushes
  const pushRegex = /self\.__next_f\.push\(\[1,"(.*)"\]\)/g;
  let match;
  let fullStateStr = '';

  while ((match = pushRegex.exec(html)) !== null) {
    if (match[1] && match[1].includes('__APOLLO_STATE__')) {
      fullStateStr += match[1];
    }
  }

  console.log('Found Apollo State string segment length:', fullStateStr.length);

  // Unescape backslashes in Next.js JSON stream string
  const cleanStr = fullStateStr
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n');

  fs.writeFileSync('scratch/apollo_raw.txt', cleanStr);

  // Find Opportunity objects in the Apollo Cache
  // They are keyed as "Opportunity:<id>" or "OpportunityBasic:<id>" or similar
  const oppMatches = cleanStr.match(/"Opportunity[^"]*":\{[^\}]+\}/g);
  console.log('Opp matches count:', oppMatches?.length);

  // Also extract all "Opportunity" structures using regex
  const ids = Array.from(cleanStr.matchAll(/"id":"(\d+)"/g)).map(m => m[1]);
  console.log('Sample IDs found:', ids.slice(0, 20));

  // Extract titles
  const titles = Array.from(cleanStr.matchAll(/"title":"([^"]+)"/g)).map(m => m[1]);
  console.log('Sample titles found:', titles.slice(0, 10));
}

main();
