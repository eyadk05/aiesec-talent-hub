'use client';

import React from 'react';
import { Bookmark, Trash2, Download, Compass } from 'lucide-react';
import { AIESECOpportunity } from '../lib/types';
import OpportunityCard from './OpportunityCard';

interface SavedOpportunitiesProps {
  savedOpportunities: AIESECOpportunity[];
  onSelectOpportunity: (opp: AIESECOpportunity) => void;
  onToggleSave: (opp: AIESECOpportunity) => void;
  comparedOpportunities: AIESECOpportunity[];
  onToggleCompare: (opp: AIESECOpportunity) => void;
  onGoToExplore: () => void;
  onClearSaved: () => void;
}

export default function SavedOpportunities({
  savedOpportunities,
  onSelectOpportunity,
  onToggleSave,
  comparedOpportunities,
  onToggleCompare,
  onGoToExplore,
  onClearSaved
}: SavedOpportunitiesProps) {
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedOpportunities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aiesec-saved-opportunities-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (savedOpportunities.length === 0) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '4rem auto',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)'
      }} className="animate-fade-in">
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <Bookmark size={32} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Saved Opportunities Yet</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          Click the bookmark icon on any opportunity card while browsing to save it here for quick access or side-by-side comparison.
        </p>
        <button onClick={onGoToExplore} className="btn-primary">
          <Compass size={18} />
          Explore Opportunities Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem' }} className="animate-fade-in">
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Saved Opportunities ({savedOpportunities.length})</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Your shortlisted AIESEC placements ready for application or comparison.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleExportJSON} className="btn-outline" style={{ fontSize: '0.85rem' }}>
            <Download size={16} /> Export JSON
          </button>
          <button onClick={onClearSaved} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            <Trash2 size={16} /> Clear Saved
          </button>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {savedOpportunities.map(opp => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            onSelect={onSelectOpportunity}
            isSaved={true}
            onToggleSave={onToggleSave}
            isCompared={comparedOpportunities.some(c => c.id === opp.id)}
            onToggleCompare={onToggleCompare}
          />
        ))}
      </div>
    </div>
  );
}
