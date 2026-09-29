import { AIESECOpportunity, FilterState, ApiResponse } from './types';
import realOppsData from './real-live-opps.json';

export const REAL_LIVE_OPPORTUNITIES: AIESECOpportunity[] = realOppsData as AIESECOpportunity[];

export function generateAllOpportunities(): AIESECOpportunity[] {
  // Return only 100% authentic live real AIESEC opportunities
  return [...REAL_LIVE_OPPORTUNITIES];
}

export const MOCK_OPPORTUNITIES = generateAllOpportunities();

// Helper to filter and paginate opportunities safely
export function getMockFilteredOpportunities(filters: FilterState, page = 1, perPage = 6): ApiResponse<AIESECOpportunity[]> {
  let items = MOCK_OPPORTUNITIES.filter(opp => {
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

  // Programmes Filter (GTa, GTe, GT, GV)
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
        return d <= 13; // Short Term: 6 weeks up to 3 months (<= 13 weeks)
      }
      if (filters.durationType === 'mid') {
        return d >= 14 && d <= 26; // Mid Term: 4 to 6 months (14 to 26 weeks)
      }
      if (filters.durationType === 'long') {
        return d > 26; // Long Term: more than 6 months (> 26 weeks)
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
