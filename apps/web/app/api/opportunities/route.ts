import { NextRequest, NextResponse } from 'next/server';
import { getMockFilteredOpportunities } from '../../lib/aiesec-api';
import { FilterState, WorldRegion } from '../../lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Extract query parameters
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('per_page') || '6', 10);
  const q = searchParams.get('q') || '';
  const programmes = searchParams.get('programmes') ? searchParams.get('programmes')!.split(',') : [];
  const region = (searchParams.get('region') as WorldRegion) || 'all';
  const countryFilter = searchParams.get('country') || 'all';
  const durationMin = parseInt(searchParams.get('duration_min') || '1', 10);
  const durationMax = parseInt(searchParams.get('duration_max') || '78', 10);
  const durationType = (searchParams.get('duration_type') as FilterState['durationType']) || 'all';
  const stipendOnly = searchParams.get('stipend_only') === 'true';
  const accommodationProvided = searchParams.get('accommodation') === 'true';
  const foodProvided = searchParams.get('food') === 'true';
  const sortBy = (searchParams.get('sort_by') as FilterState['sortBy']) || 'newest';

  const filterState: FilterState = {
    searchQuery: q,
    programmes,
    region,
    country: countryFilter,
    durationRange: [durationMin, durationMax],
    durationType,
    stipendOnly,
    accommodationProvided,
    foodProvided,
    sortBy,
    sortOrder: 'desc'
  };

  // Get filtered opportunities
  const result = getMockFilteredOpportunities(filterState, page, perPage);

  return NextResponse.json(result);
}
