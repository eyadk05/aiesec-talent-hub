'use client';

import React from 'react';
import { MapPin, Clock, DollarSign, Home, Bookmark, CheckSquare, Square, Calendar, ExternalLink, Users, Sparkles } from 'lucide-react';
import { AIESECOpportunity } from '../lib/types';

interface OpportunityCardProps {
  opportunity: AIESECOpportunity;
  onSelect: (opp: AIESECOpportunity) => void;
  isSaved: boolean;
  onToggleSave: (opp: AIESECOpportunity) => void;
  isCompared: boolean;
  onToggleCompare: (opp: AIESECOpportunity) => void;
}

export default function OpportunityCard({
  opportunity,
  onSelect,
  isSaved,
  onToggleSave,
  isCompared,
  onToggleCompare
}: OpportunityCardProps) {
  const getBadgeClass = (shortName: string) => {
    switch (shortName) {
      case 'GTa': return 'badge-gta';
      case 'GTe': return 'badge-gte';
      default: return 'badge-gta';
    }
  };

  const getProgrammeLabel = (shortName: string) => {
    switch (shortName) {
      case 'GTa': return 'Global Talent';
      case 'GTe': return 'Global Teacher';
      default: return shortName;
    }
  };

  const coverUrl = opportunity.cover_photo?.url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
  const shortCode = (opportunity.programme?.short_name || '').toLowerCase();
  let progSlug = 'global-talent';
  if (shortCode === 'gte' || shortCode === 'global-teacher') {
    progSlug = 'global-teacher';
  } else if (shortCode === 'gv' || shortCode === 'global-volunteer') {
    progSlug = 'global-volunteer';
  }
  const aiesecDirectUrl = `https://aiesec.org/opportunity/${progSlug}/${opportunity.id}`;

  return (
    <div className="card animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Card Cover Header */}
      <div style={{
        position: 'relative',
        height: '180px',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-subtle)',
        cursor: 'pointer'
      }} onClick={() => window.open(aiesecDirectUrl, '_blank')}>
        <img
          src={coverUrl}
          alt={opportunity.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-normal)'
          }}
          className="hover:scale-105"
        />
        
        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)'
        }} />

        {/* Top Badges: Programme Tag */}
        <div style={{
          position: 'absolute',
          top: '0.85rem',
          left: '0.85rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            textTransform: 'uppercase',
            backdropFilter: 'blur(4px)'
          }} className={getBadgeClass(opportunity.programme.short_name)}>
            {getProgrammeLabel(opportunity.programme.short_name)}
          </span>

          {opportunity.is_featured && (
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 193, 7, 0.9)',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Sparkles size={12} /> Featured
            </span>
          )}
        </div>

        {/* Top Right Quick Actions: Bookmark & Compare */}
        <div style={{
          position: 'absolute',
          top: '0.85rem',
          right: '0.85rem',
          display: 'flex',
          gap: '0.4rem'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(opportunity);
            }}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: isSaved ? 'var(--color-primary)' : 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)'
            }}
            title={isSaved ? 'Remove Bookmark' : 'Save Opportunity'}
          >
            <Bookmark size={17} fill={isSaved ? '#ffffff' : 'none'} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(opportunity);
            }}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: isCompared ? 'var(--gte-green)' : 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)'
            }}
            title={isCompared ? 'Remove from comparison' : 'Compare opportunity'}
          >
            {isCompared ? <CheckSquare size={17} /> : <Square size={17} />}
          </button>
        </div>

        {/* Location & Entity Overlay at bottom of image */}
        <div style={{
          position: 'absolute',
          bottom: '0.75rem',
          left: '0.85rem',
          right: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#ffffff',
          fontSize: '0.85rem',
          fontWeight: 600,
          textShadow: '0 1px 3px rgba(0,0,0,0.8)'
        }}>
          <MapPin size={15} style={{ color: 'var(--gte-green)', flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {opportunity.location || opportunity.country} ({opportunity.region})
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        
        {/* Title links to aiesec.org */}
        <a
          href={aiesecDirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            lineHeight: 1.35,
            color: 'var(--text-main)',
            textDecoration: 'none'
          }}
          className="hover:text-primary"
        >
          {opportunity.title}
        </a>

        {/* Summary text */}
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4
        }}>
          {opportunity.summary}
        </p>

        {/* Key Logistics Badges */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          paddingTop: '0.25rem'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-main)'
          }}>
            <Clock size={14} style={{ color: 'var(--color-primary)' }} />
            {opportunity.duration} Weeks
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--gte-green)'
          }}>
            <Calendar size={14} />
            Start: {opportunity.earliest_start_date}
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: opportunity.salary && opportunity.salary > 0 ? 'rgba(0, 193, 110, 0.12)' : 'var(--bg-subtle)',
            color: opportunity.salary && opportunity.salary > 0 ? 'var(--gte-green)' : 'var(--text-muted)'
          }}>
            <DollarSign size={14} />
            {opportunity.salary && opportunity.salary > 0 
              ? `${opportunity.salary} ${opportunity.salary_currency || ''}/mo`
              : 'Volunteer'}
          </span>

          {opportunity.logistics_info?.accommodation_provided && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(3, 126, 243, 0.1)',
              color: 'var(--color-primary)'
            }} title="Accommodation Provided">
              <Home size={14} /> Accom.
            </span>
          )}

          {opportunity.available_openings > 0 && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-main)',
              marginLeft: 'auto'
            }}>
              <Users size={14} /> {opportunity.available_openings} Left
            </span>
          )}
        </div>

        {/* Skill Tag Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {opportunity.skills.slice(0, 3).map(skill => (
            <span key={skill.id} style={{
              fontSize: '0.75rem',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)'
            }}>
              {skill.name}
            </span>
          ))}
          {opportunity.skills.length > 3 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              +{opportunity.skills.length - 3}
            </span>
          )}
        </div>

        {/* Footer: Start Date & Action Buttons */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => onSelect(opportunity)}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}
          >
            Quick View
          </button>

          <a
            href={aiesecDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', textDecoration: 'none' }}
          >
            Open on AIESEC <ExternalLink size={15} />
          </a>
        </div>

      </div>
    </div>
  );
}
