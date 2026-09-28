import fs from 'fs';

async function main() {
  const text = fs.readFileSync('scratch/apollo_raw.txt', 'utf-8');

  // Let's find all Opportunity entries in text
  // e.g. "Opportunity:1339548":{...} or "OpportunityBasic:1339548":{...}
  const regex = /"Opportunity(?:Basic)?:(\d+)":(\{.+?\})(?=,"[A-Z]|\}$)/g;
  
  const realOpps: any[] = [];
  const foundIds = new Set<string>();

  // Let's search for "id":"13..." and extract surrounding JSON object
  const idRegex = /"id":"(13\d{5})"/g;
  let match;
  while ((match = idRegex.exec(text)) !== null) {
    const id = match[1];
    if (!id || foundIds.has(id)) continue;
    foundIds.add(id);

    const pos = match.index;
    const chunk = text.substring(Math.max(0, pos - 150), Math.min(text.length, pos + 600));

    // Extract title if present
    const titleMatch = chunk.match(/"title":"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : null;

    // Extract cover photo if present
    const photoMatch = chunk.match(/"cover_photo":\s*"([^"]+)"/) || chunk.match(/"url":\s*"([^"]+)"/);
    const coverUrl = photoMatch ? photoMatch[1] : null;

    realOpps.push({
      id,
      title,
      coverUrl,
      chunkSnippet: chunk
    });
  }

  console.log(`Found ${realOpps.length} real AIESEC.org opportunities:`);
  console.log(JSON.stringify(realOpps, null, 2));

  fs.writeFileSync('scratch/parsed_real_opps.json', JSON.stringify(realOpps, null, 2));
}

main();
