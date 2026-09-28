'use client';

import React from 'react';
import { Search, MapPin, Briefcase, GraduationCap, Sparkles, Globe2 } from 'lucide-react';
import { FilterState, WorldRegion } from '../lib/types';

interface HeroSectionProps {
  filterState: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  totalOpportunities: number;
}

export default function HeroSection({
  filterState,
  onFilterChange,
  totalOpportunities
}: HeroSectionProps) {
  const selectedProgrammes = filterState.programmes;

  const toggleProgramme = (shortName: string) => {
    if (shortName === 'ALL') {
      onFilterChange({ programmes: [] });
      return;
    }
    let updated: string[];
    if (selectedProgrammes.includes(shortName)) {
      updated = selectedProgrammes.filter(p => p !== shortName);
    } else {
      updated = [...selectedProgrammes, shortName];
    }
    onFilterChange({ programmes: updated });
  };

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      padding: '3rem 1.5rem 2.5rem 1.5rem',
      background: 'linear-gradient(135deg, rgba(3, 126, 243, 0.08) 0%, rgba(11, 19, 43, 0.03) 100%)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Badge Banner */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          <Sparkles size={16} />
          Live Connected to AIESEC.org Opportunities Portal
        </div>

        {/* Main Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3.25rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: '1rem',
          maxWidth: '850px',
          margin: '0 auto 1rem auto'
        }}>
          Explore Live Opportunities Across <span style={{
            background: 'linear-gradient(135deg, #037EF3 0%, #008FE3 50%, #00C16E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>All Continents</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
          maxWidth: '680px',
          margin: '0 auto 2rem auto',
          color: 'var(--text-muted)'
        }}>
          Discover 524 Global Talent internships and 290 Global Teacher positions live from aiesec.org.
        </p>

        {/* Search Bar Container */}
        <div className="glass-panel" style={{
          maxWidth: '920px',
          margin: '0 auto 1.75rem auto',
          padding: '0.5rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          {/* Keyword Search Input */}
          <div style={{
            flex: '2 1 240px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 1rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)'
          }}>
            <Search size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search title, skills (e.g. AI, React, Marketing, Teaching)..."
              value={filterState.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Continent / Region Selector */}
          <div style={{
            flex: '1 1 200px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 1rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)'
          }}>
            <Globe2 size={20} style={{ color: 'var(--gte-green)', flexShrink: 0 }} />
            <select
              value={filterState.region || 'all'}
              onChange={(e) => onFilterChange({ region: e.target.value as WorldRegion, country: 'all' })}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: 'pointer'
              }}
            >
              <option value="all" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>🌐 All Continents</option>
              <option value="Europe" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>🇪🇺 Europe</option>
              <option value="Asia" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>🌏 Asia</option>
              <option value="Africa" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>🌍 Africa</option>
              <option value="Americas" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>🌎 Americas</option>
              <option value="Australia" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>🇦🇺 Australia & Oceania</option>
            </select>
          </div>

          {/* Clear Search / Reset */}
          {(filterState.searchQuery || filterState.region !== 'all' || filterState.country !== 'all' || filterState.programmes.length > 0) && (
            <button
              onClick={() => onFilterChange({ searchQuery: '', region: 'all', country: 'all', programmes: [] })}
              className="btn-secondary"
              style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Programme Filter Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => toggleProgramme('ALL')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: selectedProgrammes.length === 0 ? 'var(--color-primary)' : 'var(--border-color)',
              backgroundColor: selectedProgrammes.length === 0 ? 'var(--color-primary)' : 'var(--bg-card)',
              color: selectedProgrammes.length === 0 ? '#ffffff' : 'var(--text-muted)',
              transition: 'all var(--transition-fast)'
            }}
          >
            All Programmes
          </button>

          <button
            onClick={() => toggleProgramme('GTa')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid',
              borderColor: selectedProgrammes.includes('GTa') ? 'var(--gta-blue)' : 'var(--border-color)',
              backgroundColor: selectedProgrammes.includes('GTa') ? 'var(--gta-blue)' : 'var(--bg-card)',
              color: selectedProgrammes.includes('GTa') ? '#ffffff' : 'var(--text-muted)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Briefcase size={16} />
            Global Talent (GTa)
          </button>

          <button
            onClick={() => toggleProgramme('GTe')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid',
              borderColor: selectedProgrammes.includes('GTe') ? 'var(--gte-green)' : 'var(--border-color)',
              backgroundColor: selectedProgrammes.includes('GTe') ? 'var(--gte-green)' : 'var(--bg-card)',
              color: selectedProgrammes.includes('GTe') ? '#ffffff' : 'var(--text-muted)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <GraduationCap size={16} />
            Global Teacher (GTe)
          </button>
        </div>

        {/* Live Counters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          fontSize: '0.875rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            <strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>{totalOpportunities}</strong> Opportunities Found
          </div>
          <span>•</span>
          <div>
            <strong style={{ color: 'var(--gte-green)', fontSize: '1.1rem' }}>100%</strong> Verified Placements
          </div>
        </div>

      </div>
    </section>
  );
}
