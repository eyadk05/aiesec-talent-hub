export interface Programme {
  id: number | string;
  short_name: 'GTa' | 'GTe' | string;
  name: string;
}

export interface Entity {
  id: number | string;
  name: string;
  country: string;
  code?: string;
}

export interface NamedItem {
  id: number | string;
  name: string;
}

export interface RoleInformation {
  learning_points?: string;
  responsibilities?: string;
  specific_requirements?: string;
}

export interface LogisticsInfo {
  accommodation_provided?: boolean | string;
  accommodation_covered?: boolean | string;
  food_provided?: boolean | string;
  food_covered?: boolean | string;
  computer_provided?: boolean | string;
  transportation_provided?: boolean | string;
}

export interface LegalInfo {
  visa_type?: string;
  visa_duration?: string;
  visa_link?: string;
  health_insurance_info?: string;
}

export type WorldRegion = 'all' | 'Europe' | 'Asia' | 'Africa' | 'Americas' | 'Australia';

export interface AIESECOpportunity {
  id: string | number;
  title: string;
  summary: string;
  description: string;
  status: 'open' | 'closed' | string;
  programme: Programme;
  sub_programme?: NamedItem;
  home_lc?: Entity;
  host_lc: Entity;
  location: string;
  city?: string;
  country: string;
  region: WorldRegion;
  applications_close_date: string;
  earliest_start_date: string;
  latest_end_date?: string;
  duration: number; // weeks
  salary?: number | null;
  salary_currency?: string | null;
  payment_period?: string | null;
  skills: NamedItem[];
  backgrounds: NamedItem[];
  languages: NamedItem[];
  cover_photo?: { url: string };
  openings: number;
  available_openings: number;
  work_fields: NamedItem[];
  role_information?: RoleInformation;
  logistics_info?: LogisticsInfo;
  legal_info?: LegalInfo;
  is_featured?: boolean;
}

export type DurationCategory = 'all' | 'short' | 'mid' | 'long';

export interface FilterState {
  searchQuery: string;
  programmes: string[]; // ['GTa', 'GTe']
  country: string;
  region: WorldRegion;
  durationRange: [number, number]; // min and max weeks
  durationType: DurationCategory; // 'all' | 'short' (6w-3m) | 'mid' (4m-6m) | 'long' (>6m)
  stipendOnly: boolean;
  accommodationProvided: boolean;
  foodProvided: boolean;
  sortBy: 'newest' | 'start_date' | 'openings' | 'duration';
  sortOrder: 'asc' | 'desc';
}

export interface PagingInfo {
  total_items: number;
  total_pages: number;
  current_page: number;
}

export interface ApiResponse<T> {
  data: T;
  paging: PagingInfo;
  isDemoMode?: boolean;
  error?: string;
}
