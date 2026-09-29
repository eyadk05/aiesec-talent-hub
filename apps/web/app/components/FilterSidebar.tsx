'use client';

import React from 'react';
import { Filter, DollarSign, Home, Utensils, Clock, ArrowUpDown, RotateCcw, Globe2 } from 'lucide-react';
import { FilterState, WorldRegion } from '../lib/types';

interface FilterSidebarProps {
  filterState: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  filterState,
  onFilterChange,
  onReset
}: FilterSidebarProps) {
  const toggleProgramme = (shortName: string) => {
    const current = filterState.programmes;
    let updated: string[];
    if (current.includes(shortName)) {
      updated = current.filter(p => p !== shortName);
    } else {
      updated = [...current, shortName];
    }
    onFilterChange({ programmes: updated });
  };

  return (
    <aside style={{
      width: '100%',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
          <Filter size={18} style={{ color: 'var(--color-primary)' }} />
          Refine Search
        </div>
        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
          className="hover:text-primary"
        >
          <RotateCcw size={14} />
          Reset All
        </button>
      </div>

      {/* Sort By Section */}
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          color: 'var(--text-main)'
        }}>
          <ArrowUpDown size={15} style={{ color: 'var(--color-primary)' }} />
          Sort Opportunities By
        </label>
        <select
          value={filterState.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
          className="input-field"
          style={{ fontSize: '0.875rem' }}
        >
          <option value="newest">Newest First</option>
          <option value="start_date">Earliest Start Date</option>
          <option value="openings">Most Openings Available</option>
          <option value="duration">Shortest Duration</option>
        </select>
      </div>

      {/* Continent / Region Filter */}
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          color: 'var(--text-main)'
        }}>
          <Globe2 size={15} style={{ color: 'var(--gte-green)' }} />
          Continent / Region
        </label>
        <select
          value={filterState.region || 'all'}
          onChange={(e) => onFilterChange({ region: e.target.value as WorldRegion, country: 'all' })}
          className="input-field"
          style={{ fontSize: '0.875rem' }}
        >
          <option value="all">🌐 All Continents</option>
          <option value="Europe">🇪🇺 Europe</option>
          <option value="Asia">🌏 Asia</option>
          <option value="Africa">🌍 Africa</option>
          <option value="Americas">🌎 Americas</option>
          <option value="Australia">🇦🇺 Australia & Oceania</option>
        </select>
      </div>

      {/* Programme Selection */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          color: 'var(--text-main)'
        }}>
          Programme Type
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filterState.programmes.includes('GTa')}
              onChange={() => toggleProgramme('GTa')}
              style={{ accentColor: 'var(--gta-blue)', width: '16px', height: '16px' }}
            />
            <span style={{ color: 'var(--gta-blue)', fontWeight: 600 }}>Global Talent (GTa)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filterState.programmes.includes('GTe')}
              onChange={() => toggleProgramme('GTe')}
              style={{ accentColor: 'var(--gte-green)', width: '16px', height: '16px' }}
            />
            <span style={{ color: 'var(--gte-green)', fontWeight: 600 }}>Global Teacher (GTe)</span>
          </label>
        </div>
      </div>

      {/* Logistics & Benefits */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          color: 'var(--text-main)'
        }}>
          Logistics & Benefits
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filterState.stipendOnly}
              onChange={(e) => onFilterChange({ stipendOnly: e.target.checked })}
              style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <DollarSign size={15} style={{ color: 'var(--gte-green)' }} /> Paid / Stipend Provided
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filterState.accommodationProvided}
              onChange={(e) => onFilterChange({ accommodationProvided: e.target.checked })}
              style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Home size={15} style={{ color: 'var(--color-primary)' }} /> Accommodation Provided
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filterState.foodProvided}
              onChange={(e) => onFilterChange({ foodProvided: e.target.checked })}
              style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Utensils size={15} style={{ color: 'var(--color-primary)' }} /> Food Provided
            </span>
          </label>
        </div>
      </div>

      {/* Duration Category Filter */}
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          color: 'var(--text-main)'
        }}>
          <Clock size={15} style={{ color: 'var(--color-primary)' }} />
          Duration Category
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'all', label: 'All Durations', desc: 'Show all placements' },
            { id: 'short', label: 'Short Term', desc: '6 weeks to 3 months (up to 12 wks)' },
            { id: 'mid', label: 'Mid Term', desc: '4 months to 6 months (14 to 26 wks)' },
            { id: 'long', label: 'Long Term', desc: 'More than 6 months (> 26 wks)' }
          ].map(opt => (
            <label
              key={opt.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                padding: '0.45rem 0.6rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: (filterState.durationType || 'all') === opt.id ? 'var(--color-primary-light)' : 'var(--bg-subtle)',
                border: `1px solid ${(filterState.durationType || 'all') === opt.id ? 'var(--color-primary)' : 'var(--border-color)'}`,
                transition: 'all var(--transition-fast)'
              }}
            >
              <input
                type="radio"
                name="durationType"
                checked={(filterState.durationType || 'all') === opt.id}
                onChange={() => onFilterChange({ durationType: opt.id as any })}
                style={{ accentColor: 'var(--color-primary)', marginTop: '0.15rem' }}
              />
              <div>
                <span style={{ fontWeight: 600, display: 'block', color: 'var(--text-main)', fontSize: '0.85rem' }}>{opt.label}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{opt.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Custom Duration Range Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--text-main)'
          }}>
            Max Duration
          </label>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            Up to {filterState.durationRange[1]} Weeks
          </span>
        </div>
        <input
          type="range"
          min="4"
          max="52"
          step="2"
          value={filterState.durationRange[1]}
          onChange={(e) => onFilterChange({ durationRange: [filterState.durationRange[0], parseInt(e.target.value, 10)] })}
          style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          <span>4 wks</span>
          <span>26 wks</span>
          <span>52 wks</span>
        </div>
      </div>

    </aside>
  );
}
