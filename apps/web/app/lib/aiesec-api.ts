import { AIESECOpportunity, FilterState, ApiResponse } from './types';
import realOppsData from './real-live-opps.json';

export const REAL_LIVE_OPPORTUNITIES: AIESECOpportunity[] = realOppsData as AIESECOpportunity[];

// Live Cache State initialized with all 842 authentic GTa & GTe opportunities
let liveDataset: AIESECOpportunity[] = [...REAL_LIVE_OPPORTUNITIES];
let lastFetchedTime = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes auto-revalidation

const PUBLIC_GIS_TOKEN = 'e316ebe109dd84ed16734e5161a2d236d0a7e6daf499941f7c110078e3c75493';

// Continent Set Helpers
const AFRICA_SET = new Set(['egypt', 'morocco', 'nigeria', 'kenya', 'south africa', 'ghana', 'tanzania', 'uganda', 'ethiopia', 'senegal', 'cameroon', 'ivory coast', 'algeria', 'tunisia']);
const ASIA_SET = new Set(['india', 'japan', 'china', 'indonesia', 'vietnam', 'thailand', 'malaysia', 'philippines', 'singapore', 'sri lanka', 'taiwan', 'south korea', 'pakistan', 'hong kong', 'united arab emirates', 'qatar', 'oman', 'jordan']);
const AMERICAS_SET = new Set(['brazil', 'mexico', 'colombia', 'argentina', 'peru', 'chile', 'panama', 'costa rica', 'dominican republic', 'united states', 'canada', 'ecuador']);
const EUROPE_SET = new Set(['germany', 'italy', 'turkey', 'spain', 'netherlands', 'france', 'poland', 'portugal', 'greece', 'romania', 'hungary', 'czech republic', 'austria', 'belgium', 'switzerland', 'sweden', 'finland', 'norway', 'denmark', 'uk', 'united kingdom', 'bulgaria', 'serbia']);

function cleanCountry(rawC?: string, rawLoc?: string): string {
  if (!rawC || rawC === '.' || rawC === 'Unknown') {
    if (rawLoc) {
      const l = rawLoc.toLowerCase();
      if (l.includes('egypt') || l.includes('cairo')) return 'Egypt';
      if (l.includes('brazil') || l.includes('brasil')) return 'Brazil';
      if (l.includes('mexico')) return 'Mexico';
      if (l.includes('panama')) return 'Panama';
      if (l.includes('germany')) return 'Germany';
      if (l.includes('india')) return 'India';
      if (l.includes('italy')) return 'Italy';
      if (l.includes('turkey')) return 'Turkey';
      if (l.includes('netherlands')) return 'Netherlands';
      if (l.includes('vietnam')) return 'Vietnam';
    }
    return 'Other';
  }
  let c = rawC.trim();
  if (c.toUpperCase() === 'EGYPT' || c.toLowerCase() === 'egypt') return 'Egypt';
  if (c === 'Panamá') return 'Panama';
  if (c === 'The Netherlands') return 'Netherlands';
  if (c === 'The Philippines') return 'Philippines';
  return c;
}

function getRegion(country: string): 'Africa' | 'Asia' | 'Americas' | 'Europe' {
  const c = country.toLowerCase().trim();
  if (AFRICA_SET.has(c)) return 'Africa';
  if (ASIA_SET.has(c)) return 'Asia';
  if (AMERICAS_SET.has(c)) return 'Americas';
  if (EUROPE_SET.has(c)) return 'Europe';
  for (const item of AFRICA_SET) { if (c.includes(item)) return 'Africa'; }
  for (const item of AMERICAS_SET) { if (c.includes(item)) return 'Americas'; }
  for (const item of EUROPE_SET) { if (c.includes(item)) return 'Europe'; }
  for (const item of ASIA_SET) { if (c.includes(item)) return 'Asia'; }
  return 'Americas';
}

// Background Automated Multi-Page Sync with AIESEC.org
export async function syncLiveAiesecDataset(): Promise<AIESECOpportunity[]> {
  const now = Date.now();

  // If cached and dataset contains the full 840+ items, return immediately
  if (now - lastFetchedTime < CACHE_TTL_MS && liveDataset.length >= 800) {
    return liveDataset;
  }

  try {
    const query = `
      query OpportunitySearch($page: Int, $per_page: Int) {
        allOpportunity(page: $page, per_page: $per_page) {
          paging {
            total_pages
          }
          data {
            id
            title
            status
            location
            openings
            available_openings
            cover_photo
            programme {
              id
              short_name
            }
            host_lc {
              id
              name
              country
            }
            skills {
              id
              constant_name
            }
            backgrounds {
              id
              constant_name
            }
            languages {
              id
              constant_name
            }
            logistics_info {
              accommodation_provided
              food_provided
              food_covered
              computer_provided
              transportation_provided
            }
            legal_info {
              visa_type
              visa_duration
            }
            specifics_info {
              salary
            }
            all_slots {
              nodes {
                id
                start_date
                end_date
                applications_close_date
                status
              }
            }
          }
        }
      }
    `;

    let allRawFetched: any[] = [];
    // Fetch multi-page to capture full catalog across all regions
    for (let page = 1; page <= 15; page++) {
      const res = await fetch(`https://gis-api.aiesec.org/graphql?access_token=${PUBLIC_GIS_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { page, per_page: 100 } }),
        next: { revalidate: 900 }
      });

      if (!res.ok) break;
      const json = await res.json();
      const items = json?.data?.allOpportunity?.data || [];
      if (items.length === 0) break;
      allRawFetched.push(...items);
    }

    if (allRawFetched.length > 0) {
      const filtered = allRawFetched.filter((opp: any) => {
        const short = (opp.programme?.short_name || '').toUpperCase();
        const idStr = String(opp.programme?.id);
        const title = (opp.title || '').toLowerCase();
        const countryClean = cleanCountry(opp.host_lc?.country, opp.location);

        if (short === 'GV' || idStr === '7' || short.includes('VOLUNTEER')) return false;
        if (countryClean.toLowerCase().includes('tunisia') || (opp.location || '').toLowerCase().includes('tunisia')) return false;
        if (title.includes('premium')) return false;

        return (
          short === 'GTA' || short === 'GTE' || short === 'GT' ||
          idStr === '8' || idStr === '9' || idStr === '2' || idStr === '5' ||
          short.includes('TALENT') || short.includes('TEACHER')
        );
      });

      const formatted: AIESECOpportunity[] = filtered.map((opp: any) => {
        const progIdStr = String(opp.programme?.id);
        const shortUpper = (opp.programme?.short_name || '').toUpperCase();
        const isGTe = progIdStr === '9' || progIdStr === '5' || shortUpper === 'GTE' || shortUpper.includes('TEACH');

        const pShort = isGTe ? 'GTe' : 'GTa';
        const pName = isGTe ? 'Global Teacher' : 'Global Talent';

        const country = cleanCountry(opp.host_lc?.country, opp.location);
        const city = opp.host_lc?.name || 'City';
        const region = getRegion(country);

        const slotNodes = opp.all_slots?.nodes || [];
        const activeSlot = slotNodes.find((s: any) => s.status === 'live' || s.start_date) || slotNodes[0];

        let startDate = '2026-11-01';
        let closeDate = '2026-10-25';
        let durationWeeks = 12;

        if (activeSlot) {
          if (activeSlot.start_date) startDate = activeSlot.start_date.slice(0, 10);
          if (activeSlot.applications_close_date) closeDate = activeSlot.applications_close_date.slice(0, 10);

          if (activeSlot.start_date && activeSlot.end_date) {
            const d1 = new Date(activeSlot.start_date);
            const d2 = new Date(activeSlot.end_date);
            const diffDays = Math.round((d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000));
            if (diffDays > 0) durationWeeks = Math.max(1, Math.round(diffDays / 7));
          }
        }

        let coverUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
        if (opp.cover_photo && typeof opp.cover_photo === 'object' && opp.cover_photo.url) {
          coverUrl = opp.cover_photo.url;
        } else if (typeof opp.cover_photo === 'string' && opp.cover_photo.startsWith('http')) {
          coverUrl = opp.cover_photo;
        }

        const skills = Array.isArray(opp.skills) && opp.skills.length > 0
          ? opp.skills.map((s: any) => ({ id: Number(s.id), name: s.constant_name || s.name || 'Skill' }))
          : [{ id: 1, name: 'Professional Competencies' }];

        const backgrounds = Array.isArray(opp.backgrounds)
          ? opp.backgrounds.map((b: any) => ({ id: Number(b.id), name: b.constant_name || b.name || 'General' }))
          : [];

        const languages = Array.isArray(opp.languages) && opp.languages.length > 0
          ? opp.languages.map((l: any) => ({ id: Number(l.id), name: l.constant_name || l.name || 'English' }))
          : [{ id: 20, name: 'English' }];

        const salaryVal = opp.specifics_info?.salary ? Number(opp.specifics_info.salary) : 0;

        return {
          id: Number(opp.id),
          title: opp.title,
          summary: `${pName} opportunity in ${city}, ${country}.`,
          description: `Official ${pName} exchange opportunity managed by ${opp.host_lc?.name || 'AIESEC host'} in ${country}. Visit AIESEC.org for complete role requirements.`,
          status: opp.status || 'open',
          programme: { id: isGTe ? 9 : 8, short_name: pShort, name: pName },
          host_lc: opp.host_lc || { id: 0, name: city, country: country },
          location: opp.location || `${city}, ${country}`,
          city: city,
          country: country,
          region: region,
          applications_close_date: closeDate,
          earliest_start_date: startDate,
          duration: durationWeeks,
          salary: salaryVal,
          salary_currency: 'USD',
          payment_period: salaryVal > 0 ? 'Monthly' : 'Unpaid',
          skills: skills,
          backgrounds: backgrounds,
          languages: languages,
          work_fields: [],
          cover_photo: { url: coverUrl },
          openings: opp.openings || 1,
          available_openings: opp.available_openings || 1,
          logistics_info: {
            accommodation_provided: opp.logistics_info?.accommodation_provided === 'provided' || opp.logistics_info?.accommodation_provided === true,
            food_provided: opp.logistics_info?.food_provided === 'provided' || opp.logistics_info?.food_covered === 'covered',
            computer_provided: opp.logistics_info?.computer_provided === 'provided',
            transportation_provided: opp.logistics_info?.transportation_provided === 'provided'
          },
          legal_info: {
            visa_type: opp.legal_info?.visa_type || 'Work Permit / Exchange Visa',
            visa_duration: opp.legal_info?.visa_duration || 'Duration of Contract'
          },
          is_featured: false
        };
      });

      if (formatted.length > 50) {
        // Merge with REAL_LIVE_OPPORTUNITIES to ensure complete 840+ catalog
        const existingIds = new Set(formatted.map(o => String(o.id)));
        const fallbackExtras = REAL_LIVE_OPPORTUNITIES.filter(o => !existingIds.has(String(o.id)));
        liveDataset = [...formatted, ...fallbackExtras];
        lastFetchedTime = now;
      }
    }
  } catch (err) {
    console.warn('Live GIS sync warning, using full static dataset:', err);
  }

  return liveDataset;
}

// Helper to filter and paginate opportunities safely
export function getMockFilteredOpportunities(filters: FilterState, page = 1, perPage = 6, dataset: AIESECOpportunity[] = liveDataset): ApiResponse<AIESECOpportunity[]> {
  // Ensure we always filter against the full 840+ dataset
  const targetData = (dataset && dataset.length >= 800) ? dataset : REAL_LIVE_OPPORTUNITIES;

  let items = targetData.filter(opp => {
    if (!opp) return false;
    const country = (opp.country || '').toLowerCase();
    const location = (opp.location || '').toLowerCase();
    const title = (opp.title || '').toLowerCase();
    const description = (opp.description || '').toLowerCase();
    const isTunisia = country.includes('tunisia') || location.includes('tunisia');
    const isPremium = title.includes('premium') || description.includes('premium');
    return !isTunisia && !isPremium;
  });

  // Search Query
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase();
    items = items.filter(opp => {
      const title = (opp.title || '').toLowerCase();
      const summary = (opp.summary || '').toLowerCase();
      const country = (opp.country || '').toLowerCase();
      const location = (opp.location || '').toLowerCase();
      const hasMatchingSkill = Array.isArray(opp.skills) && opp.skills.some(s => (s?.name || '').toLowerCase().includes(q));

      return title.includes(q) || summary.includes(q) || country.includes(q) || location.includes(q) || hasMatchingSkill;
    });
  }

  // Programmes Filter (GTa, GTe)
  if (Array.isArray(filters.programmes) && filters.programmes.length > 0) {
    items = items.filter(opp => {
      const short = (opp.programme?.short_name || '').toUpperCase();
      return filters.programmes.some(p => {
        const filterUpper = p.toUpperCase();
        return short === filterUpper || (filterUpper === 'GTA' && (short === 'GT' || short === 'GTA')) || (filterUpper === 'GTE' && short === 'GTE');
      });
    });
  }

  // Region Filter (Europe, Asia, Africa, Americas)
  if (filters.region && filters.region !== 'all') {
    const targetRegion = filters.region.toLowerCase();
    items = items.filter(opp => (opp.region || '').toLowerCase() === targetRegion);
  }

  // Country Filter
  if (filters.country && filters.country !== 'all') {
    const targetCountry = filters.country.toLowerCase();
    items = items.filter(opp => (opp.country || '').toLowerCase() === targetCountry);
  }

  // Stipend Only Filter
  if (filters.stipendOnly) {
    items = items.filter(opp => typeof opp.salary === 'number' && opp.salary > 0);
  }

  // Accommodation Filter
  if (filters.accommodationProvided) {
    items = items.filter(opp => Boolean(opp.logistics_info?.accommodation_provided));
  }

  // Food Filter
  if (filters.foodProvided) {
    items = items.filter(opp => Boolean(opp.logistics_info?.food_provided));
  }

  // Duration Type Category Filter (Short: 6w-3m, Mid: 4m-6m, Long: >6m)
  if (filters.durationType && filters.durationType !== 'all') {
    items = items.filter(opp => {
      const d = opp.duration || 0;
      if (filters.durationType === 'short') {
        return d <= 13;
      }
      if (filters.durationType === 'mid') {
        return d >= 14 && d <= 26;
      }
      if (filters.durationType === 'long') {
        return d > 26;
      }
      return true;
    });
  }

  // Duration Range Filter
  if (Array.isArray(filters.durationRange)) {
    const minDur = filters.durationRange[0] ?? 1;
    const maxDur = filters.durationRange[1] ?? 52;
    items = items.filter(opp => {
      const d = opp.duration || 0;
      return d >= minDur && d <= maxDur;
    });
  }

  // Sorting
  items.sort((a, b) => {
    if (filters.sortBy === 'start_date') {
      const dateA = a.earliest_start_date ? new Date(a.earliest_start_date).getTime() : 0;
      const dateB = b.earliest_start_date ? new Date(b.earliest_start_date).getTime() : 0;
      return dateA - dateB;
    }
    if (filters.sortBy === 'openings') {
      return (b.available_openings || 0) - (a.available_openings || 0);
    }
    if (filters.sortBy === 'duration') {
      return (a.duration || 0) - (b.duration || 0);
    }
    return Number(b.id || 0) - Number(a.id || 0);
  });

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const startIndex = (page - 1) * perPage;
  const paginatedData = items.slice(startIndex, startIndex + perPage);

  return {
    data: paginatedData,
    paging: {
      total_items: totalItems,
      total_pages: totalPages,
      current_page: page
    },
    isDemoMode: false
  };
}
