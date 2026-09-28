const fs = require('fs');

function cleanCountry(rawCountry, rawLocation) {
  if (!rawCountry || rawCountry === '.' || rawCountry === 'Unknown') {
    if (rawLocation) {
      const locLower = rawLocation.toLowerCase();
      if (locLower.includes('egypt') || locLower.includes('cairo')) return 'Egypt';
      if (locLower.includes('brazil') || locLower.includes('brasil')) return 'Brazil';
      if (locLower.includes('mexico')) return 'Mexico';
      if (locLower.includes('panama')) return 'Panama';
      if (locLower.includes('germany') || locLower.includes('deutschland')) return 'Germany';
      if (locLower.includes('india')) return 'India';
      if (locLower.includes('italy') || locLower.includes('italia')) return 'Italy';
      if (locLower.includes('greece')) return 'Greece';
      if (locLower.includes('turkey') || locLower.includes('türkiye')) return 'Turkey';
      if (locLower.includes('netherlands')) return 'Netherlands';
      if (locLower.includes('portugal')) return 'Portugal';
      if (locLower.includes('romania')) return 'Romania';
      if (locLower.includes('vietnam')) return 'Vietnam';
      if (locLower.includes('philippines')) return 'Philippines';
    }
    return 'Other';
  }

  let c = rawCountry.trim();
  if (c.toUpperCase() === 'EGYPT' || c.toLowerCase() === 'egypt') return 'Egypt';
  if (c === 'Panamá') return 'Panama';
  if (c === 'The Netherlands') return 'Netherlands';
  if (c === 'The Philippines') return 'Philippines';
  return c;
}

const AFRICA_SET = new Set(['egypt', 'morocco', 'nigeria', 'kenya', 'south africa', 'ghana', 'tanzania', 'uganda', 'ethiopia', 'senegal', 'cameroon', 'ivory coast', 'algeria', 'tunisia']);
const ASIA_SET = new Set(['india', 'japan', 'china', 'indonesia', 'vietnam', 'thailand', 'malaysia', 'philippines', 'singapore', 'sri lanka', 'taiwan', 'south korea', 'pakistan', 'hong kong', 'united arab emirates', 'qatar', 'oman', 'jordan']);
const AMERICAS_SET = new Set(['brazil', 'mexico', 'colombia', 'argentina', 'peru', 'chile', 'panama', 'costa rica', 'dominican republic', 'united states', 'canada', 'ecuador']);
const EUROPE_SET = new Set(['germany', 'italy', 'turkey', 'spain', 'netherlands', 'france', 'poland', 'portugal', 'greece', 'romania', 'hungary', 'czech republic', 'austria', 'belgium', 'switzerland', 'sweden', 'finland', 'norway', 'denmark', 'uk', 'united kingdom', 'bulgaria', 'serbia']);

function getExactRegion(country) {
  const c = country.toLowerCase().trim();

  if (AFRICA_SET.has(c)) return 'Africa';
  if (ASIA_SET.has(c)) return 'Asia';
  if (AMERICAS_SET.has(c)) return 'Americas';
  if (EUROPE_SET.has(c)) return 'Europe';

  // Fallback checks for multi-word or variations
  for (const item of AFRICA_SET) { if (c.includes(item)) return 'Africa'; }
  for (const item of AMERICAS_SET) { if (c.includes(item)) return 'Americas'; }
  for (const item of EUROPE_SET) { if (c.includes(item)) return 'Europe'; }
  for (const item of ASIA_SET) { if (c.includes(item)) return 'Asia'; }

  return 'Americas';
}

const opps = JSON.parse(fs.readFileSync('apps/web/app/lib/real-live-opps.json', 'utf8'));

console.log('Cleaning dataset country names and region mappings with exact sets...');

const updated = opps.map(opp => {
  const countryClean = cleanCountry(opp.country, opp.location);
  const regionClean = getExactRegion(countryClean);

  return {
    ...opp,
    country: countryClean,
    host_lc: {
      ...opp.host_lc,
      country: countryClean
    },
    region: regionClean
  };
});

const regionCounts = {};
const countryRegions = {};

updated.forEach(o => {
  regionCounts[o.region] = (regionCounts[o.region] || 0) + 1;
  countryRegions[o.country] = o.region;
});

console.log('Region distribution:', regionCounts);
console.log('Country to Region mapping:', countryRegions);

fs.writeFileSync('apps/web/app/lib/real-live-opps.json', JSON.stringify(updated, null, 2));
fs.writeFileSync('real_talent_teacher_opps.json', JSON.stringify(updated, null, 2));
console.log('Saved clean dataset!');
