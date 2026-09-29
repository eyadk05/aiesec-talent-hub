'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FilterSidebar from './components/FilterSidebar';
import OpportunityCard from './components/OpportunityCard';
import OpportunityDetailModal from './components/OpportunityDetailModal';
import CompareDrawer from './components/CompareDrawer';
import SavedOpportunities from './components/SavedOpportunities';
import AnalyticsDashboard from './components/AnalyticsDashboard';

import { AIESECOpportunity, FilterState, PagingInfo } from './lib/types';
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle, Compass } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  programmes: [],
  country: 'all',
  region: 'all',
  durationRange: [1, 52],
  durationType: 'all',
  stipendOnly: false,
  accommodationProvided: false,
  foodProvided: false,
  sortBy: 'newest',
  sortOrder: 'desc'
};

export default function Page() {
  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState<'explore' | 'saved' | 'analytics'>('explore');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Search & Filter State
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTERS);
  const [page, setPage] = useState<number>(1);
  const perPage = 6;

  // Data & Selection State
  const [opportunities, setOpportunities] = useState<AIESECOpportunity[]>([]);
  const [paging, setPaging] = useState<PagingInfo>({ total_items: 0, total_pages: 1, current_page: 1 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected for Modal Drawer
  const [selectedOpportunity, setSelectedOpportunity] = useState<AIESECOpportunity | null>(null);

  // Saved & Compared States
  const [savedOpportunities, setSavedOpportunities] = useState<AIESECOpportunity[]>([]);
  const [comparedOpportunities, setComparedOpportunities] = useState<AIESECOpportunity[]>([]);

  // Hydrate local storage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('aiesec_theme') as 'dark' | 'light';
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }

      const savedList = localStorage.getItem('aiesec_saved_opps');
      if (savedList) setSavedOpportunities(JSON.parse(savedList));
    } catch (e) {
      console.warn('LocalStorage restoration error:', e);
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('aiesec_theme', nextTheme);
    } catch (e) {}
  };

  // Toggle Bookmark
  const handleToggleSave = (opp: AIESECOpportunity) => {
    let updated: AIESECOpportunity[];
    if (savedOpportunities.some(s => s.id === opp.id)) {
      updated = savedOpportunities.filter(s => s.id !== opp.id);
    } else {
      updated = [...savedOpportunities, opp];
    }
    setSavedOpportunities(updated);
    try {
      localStorage.setItem('aiesec_saved_opps', JSON.stringify(updated));
    } catch (e) {}
  };

  // Toggle Compare
  const handleToggleCompare = (opp: AIESECOpportunity) => {
    if (comparedOpportunities.some(c => c.id === opp.id)) {
      setComparedOpportunities(comparedOpportunities.filter(c => c.id !== opp.id));
    } else {
      if (comparedOpportunities.length >= 3) {
        alert('You can compare a maximum of 3 opportunities side-by-side.');
        return;
      }
      setComparedOpportunities([...comparedOpportunities, opp]);
    }
  };

  // Fetch opportunities from API proxy
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(perPage));

    if (filterState.searchQuery) queryParams.set('q', filterState.searchQuery);
    if (filterState.programmes.length > 0) queryParams.set('programmes', filterState.programmes.join(','));
    if (filterState.region && filterState.region !== 'all') queryParams.set('region', filterState.region);
    if (filterState.country && filterState.country !== 'all') queryParams.set('country', filterState.country);
    queryParams.set('duration_min', String(filterState.durationRange[0]));
    queryParams.set('duration_max', String(filterState.durationRange[1]));
    if (filterState.durationType && filterState.durationType !== 'all') queryParams.set('duration_type', filterState.durationType);
    if (filterState.stipendOnly) queryParams.set('stipend_only', 'true');
    if (filterState.accommodationProvided) queryParams.set('accommodation', 'true');
    if (filterState.foodProvided) queryParams.set('food', 'true');
    if (filterState.sortBy) queryParams.set('sort_by', filterState.sortBy);

    fetch(`/api/opportunities?${queryParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.error) {
          setError(data.error);
        } else {
          setOpportunities(data.data || []);
          setPaging(data.paging || { total_items: data.data?.length || 0, total_pages: 1, current_page: page });
        }
        setIsLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        console.error('Fetch opportunities error:', err);
        setError('Failed to load opportunities. Please try again.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filterState, page]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilterState(INITIAL_FILTERS);
    setPage(1);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedOpportunities.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Views */}
      <main style={{ flex: 1 }}>
        {activeTab === 'explore' && (
          <>
            {/* Hero Search Banner */}
            <HeroSection
              filterState={filterState}
              onFilterChange={handleFilterChange}
              totalOpportunities={paging.total_items}
            />

            {/* Main Listing Layout: Sidebar + Grid */}
            <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(260px, 280px) 1fr',
                gap: '2rem',
                alignItems: 'start'
              }}>
                
                {/* Left Sidebar Filter */}
                <div style={{ position: 'sticky', top: '90px' }}>
                  <FilterSidebar
                    filterState={filterState}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                  />
                </div>

                {/* Right Cards Grid */}
                <div>
                  {/* Results Subheader */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Showing Page <strong>{paging.current_page}</strong> of <strong>{paging.total_pages}</strong> ({paging.total_items} total opportunities)
                    </span>

                    <button
                      onClick={() => setPage(p => p)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                      Refresh Results
                    </button>
                  </div>

                  {/* Loading State */}
                  {isLoading ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '1.5rem'
                    }}>
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="card" style={{ height: '380px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ height: '160px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }} className="pulse-glow" />
                          <div style={{ height: '24px', width: '75%', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)' }} />
                          <div style={{ height: '16px', width: '100%', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)' }} />
                          <div style={{ height: '16px', width: '60%', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)' }} />
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <div style={{
                      padding: '3rem 1.5rem',
                      textAlign: 'center',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-xl)'
                    }}>
                      <AlertCircle size={40} style={{ color: 'var(--gv-orange)', margin: '0 auto 1rem auto' }} />
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{error}</h3>
                      <button onClick={handleResetFilters} className="btn-primary" style={{ marginTop: '1rem' }}>
                        Reset Filters
                      </button>
                    </div>
                  ) : opportunities.length === 0 ? (
                    <div style={{
                      padding: '4rem 1.5rem',
                      textAlign: 'center',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-xl)'
                    }}>
                      <Compass size={44} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Opportunities Found</h3>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Try adjusting your continent or search keywords.
                      </p>
                      <button onClick={handleResetFilters} className="btn-primary">
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                      }}>
                        {opportunities.map(opp => (
                          <OpportunityCard
                            key={opp.id}
                            opportunity={opp}
                            onSelect={(o) => setSelectedOpportunity(o)}
                            isSaved={savedOpportunities.some(s => s.id === opp.id)}
                            onToggleSave={handleToggleSave}
                            isCompared={comparedOpportunities.some(c => c.id === opp.id)}
                            onToggleCompare={handleToggleCompare}
                          />
                        ))}
                      </div>

                      {/* Pagination Controls */}
                      {paging.total_pages > 1 && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '1rem',
                          marginTop: '2.5rem'
                        }}>
                          <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="btn-secondary"
                            style={{ opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
                          >
                            <ChevronLeft size={18} /> Previous
                          </button>

                          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                            Page {page} of {paging.total_pages}
                          </span>

                          <button
                            disabled={page >= paging.total_pages}
                            onClick={() => setPage(p => Math.min(paging.total_pages, p + 1))}
                            className="btn-secondary"
                            style={{ opacity: page >= paging.total_pages ? 0.5 : 1, cursor: page >= paging.total_pages ? 'not-allowed' : 'pointer' }}
                          >
                            Next <ChevronRight size={18} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            </div>
          </>
        )}

        {activeTab === 'saved' && (
          <SavedOpportunities
            savedOpportunities={savedOpportunities}
            onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
            onToggleSave={handleToggleSave}
            comparedOpportunities={comparedOpportunities}
            onToggleCompare={handleToggleCompare}
            onGoToExplore={() => setActiveTab('explore')}
            onClearSaved={() => {
              setSavedOpportunities([]);
              try { localStorage.removeItem('aiesec_saved_opps'); } catch (e) {}
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard opportunities={opportunities} />
        )}
      </main>

      {/* Floating Sticky Comparison Bar & Matrix */}
      <CompareDrawer
        comparedOpportunities={comparedOpportunities}
        onRemoveFromCompare={(id) => setComparedOpportunities(comparedOpportunities.filter(c => c.id !== id))}
        onClearAll={() => setComparedOpportunities([])}
      />

      {/* Detail Modal */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        isSaved={selectedOpportunity ? savedOpportunities.some(s => s.id === selectedOpportunity.id) : false}
        onToggleSave={handleToggleSave}
        isCompared={selectedOpportunity ? comparedOpportunities.some(c => c.id === selectedOpportunity.id) : false}
        onToggleCompare={handleToggleCompare}
      />

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        padding: '2rem 1.5rem',
        marginTop: '3rem'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            <strong>AIESEC Talent Hub</strong> • Global Talent & Global Teacher Portal
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="https://aiesec.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
              Official AIESEC.org Portal
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
