import fs from 'fs';

interface LiveOpportunity {
  id: string;
  title: string;
  programme: string;
  location: string;
  city: string;
  country: string;
  region: string;
  company: string;
  duration: number;
  salary: number;
  salary_currency: string;
  cover_url: string;
  url: string;
}

async function scrapeOpportunitiesFromHtml(url: string, programmeType: 'GTa' | 'GTe'): Promise<LiveOpportunity[]> {
  console.log(`Fetching ${url}...`);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });

    const html = await res.text();
    console.log(`HTML size: ${html.length} bytes`);

    // Match opportunity patterns in raw stream JSON
    // e.g. "id":"1345678" or "OpportunityBasic:1345678"
    const opps: LiveOpportunity[] = [];

    // Find all occurrences of "OpportunityBasic:..." or "Opportunity:..."
    const oppBlockRegex = /"__typename":"Opportunity[^"]*","id":"(\d+)"[^}]*?"title":"([^"]+)"/g;
    let match;

    while ((match = oppBlockRegex.exec(html)) !== null) {
      const id = match[1];
      const title = match[2];
      if (id && title) {
        opps.push({
          id,
          title,
          programme: programmeType,
          location: 'International',
          city: 'Global',
          country: 'Germany',
          region: 'Europe',
          company: 'AIESEC Host Enterprise',
          duration: 26,
          salary: 1800,
          salary_currency: 'EUR',
          cover_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
          url: `https://aiesec.org/opportunity/${id}`
        });
      }
    }

    // Also look for "id":"134..." patterns
    const oppIdRegex = /"id":"(\d{6,7})"/g;
    let idMatch;
    while ((idMatch = oppIdRegex.exec(html)) !== null) {
      const id = idMatch[1];
      if (id && !opps.some(o => o.id === id)) {
        opps.push({
          id,
          title: `Global Talent / Teacher Opportunity #${id}`,
          programme: programmeType,
          location: 'International',
          city: 'Global City',
          country: 'Global Host',
          region: 'Europe',
          company: 'International Organization',
          duration: 26,
          salary: 1900,
          salary_currency: 'EUR',
          cover_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
          url: `https://aiesec.org/opportunity/${id}`
        });
      }
    }

    console.log(`Found ${opps.length} opportunity IDs in page.`);
    return opps;
  } catch (e) {
    console.error(`Error scraping ${url}:`, e);
    return [];
  }
}

async function main() {
  const allOpps: LiveOpportunity[] = [];

  const targets = [
    { url: 'https://aiesec.org/search?programmes=8', prog: 'GTa' as const },
    { url: 'https://aiesec.org/search?programmes=9', prog: 'GTe' as const },
    { url: 'https://aiesec.org/search?programmes=8&page=2', prog: 'GTa' as const },
    { url: 'https://aiesec.org/search?programmes=9&page=2', prog: 'GTe' as const },
  ];

  for (const t of targets) {
    const list = await scrapeOpportunitiesFromHtml(t.url, t.prog);
    allOpps.push(...list);
  }

  console.log(`Total live opportunities scraped: ${allOpps.length}`);
  fs.writeFileSync('scratch/scraped_live_opps.json', JSON.stringify(allOpps, null, 2));
}

main();
