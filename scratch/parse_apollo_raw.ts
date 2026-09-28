import fs from 'fs';

async function main() {
  const text = fs.readFileSync('scratch/apollo_raw.txt', 'utf-8');
  console.log('Raw text size:', text.length);

  // Search for "id":"1..." or "title":"..." or "Opportunity" or "Organisation"
  const oppMatches = text.match(/"id":"(\d+)","title":"([^"]+)"/g) || [];
  console.log('Direct ID+Title matches:', oppMatches);

  // Search for any 7-digit or 6-digit numbers in quotes
  const ids = Array.from(text.matchAll(/"id":"(\d{6,7})"/g)).map(m => m[1]);
  console.log('Opportunity numeric IDs found in stream:', ids);

  // Search for Organisation / Company names
  const comps = Array.from(text.matchAll(/"Organisation:\d+":\{"__typename":"Organisation","id":"\d+","name":"([^"]+)"/g)).map(m => m[1]);
  console.log('Organisations found:', comps);

  const offices = Array.from(text.matchAll(/"full_name":"(AIESEC in [^"]+)"/g)).map(m => m[1]);
  console.log('AIESEC LCs found:', offices.slice(0, 15));
}

main();
