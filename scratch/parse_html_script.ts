import fs from 'fs';

async function main() {
  const html = fs.readFileSync('scratch/search_page.html', 'utf-8');

  // Search for inline script JSON or config objects
  const inlineScripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
  console.log('Total script tags:', inlineScripts.length);

  for (let i = 0; i < inlineScripts.length; i++) {
    const s = inlineScripts[i] || '';
    if (s.includes('token') || s.includes('gis') || s.includes('graphql') || s.includes('api') || s.includes('key')) {
      console.log(`\n--- Script #${i} contains interesting terms ---`);
      console.log(s.slice(0, 500));
    }
  }

  // Look for any 64-char or 32-char hex/alphanumeric tokens inside quote marks
  const tokens = html.match(/"([a-f0-9]{32,64})"/gi) || html.match(/'([a-f0-9]{32,64})'/gi);
  console.log('\nPotential hex tokens in HTML:', Array.from(new Set(tokens || [])).slice(0, 15));
}

main();
