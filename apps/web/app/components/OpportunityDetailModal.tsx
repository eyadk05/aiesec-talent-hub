'use client';

import React from 'react';
import { X, ExternalLink, MapPin, Calendar, Clock, DollarSign, Home, Utensils, Laptop, ShieldCheck, Bookmark, CheckSquare, Square, Award, BookOpen, Globe, AlertCircle } from 'lucide-react';
import { AIESECOpportunity } from '../lib/types';

interface OpportunityDetailModalProps {
  opportunity: AIESECOpportunity | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (opp: AIESECOpportunity) => void;
  isCompared: boolean;
  onToggleCompare: (opp: AIESECOpportunity) => void;
}

export default function OpportunityDetailModal({
  opportunity,
  onClose,
  isSaved,
  onToggleSave,
  isCompared,
  onToggleCompare
}: OpportunityDetailModalProps) {
  if (!opportunity) return null;

  const coverUrl = opportunity.cover_photo?.url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
  
  const shortCode = (opportunity.programme?.short_name || '').toLowerCase();
  let progSlug = 'global-talent';
  if (shortCode === 'gte' || shortCode === 'global-teacher') {
    progSlug = 'global-teacher';
  } else if (shortCode === 'gv' || shortCode === 'global-volunteer') {
    progSlug = 'global-volunteer';
  }
  const aiesecLink = `https://aiesec.org/opportunity/${progSlug}/${opportunity.id}`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      padding: '1.5rem 1rem'
    }} className="animate-fade-in">
      <div style={{
        width: '100%',
        maxWidth: '840px',
        maxHeight: '90vh',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header Cover Banner */}
        <div style={{
          position: 'relative',
          height: '220px',
          width: '100%',
          backgroundColor: 'var(--bg-subtle)'
        }}>
          <img
            src={coverUrl}
            alt={opportunity.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 70%)'
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            <X size={20} />
          </button>

          {/* Banner Details */}
          <div style={{
            position: 'absolute',
            bottom: '1.25rem',
            left: '1.5rem',
            right: '1.5rem',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <span className={`badge-${opportunity.programme.short_name.toLowerCase()}`} style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase'
              }}>
                {opportunity.programme.name} ({opportunity.programme.short_name})
              </span>
              <span style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} style={{ color: 'var(--gte-green)' }} /> {opportunity.location}
              </span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25 }}>
              {opportunity.title}
            </h2>
          </div>
        </div>

        {/* Modal Main Content Scroll Area */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem'
        }}>

          {/* Key Facts Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Duration</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={15} /> {opportunity.duration} Weeks
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Stipend / Salary</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--gte-green)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <DollarSign size={15} />
                {opportunity.salary && opportunity.salary > 0 
                  ? `${opportunity.salary} ${opportunity.salary_currency || ''}/mo`
                  : 'Volunteer'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Start Date</span>
              <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={15} /> {opportunity.earliest_start_date}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Apply Deadline</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertCircle size={15} /> {opportunity.applications_close_date}
              </strong>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
              Opportunity Summary
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
              {opportunity.description || opportunity.summary}
            </p>
          </div>

          {/* Role Responsibilities */}
          {opportunity.role_information?.responsibilities && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} style={{ color: 'var(--gta-blue)' }} />
                Key Responsibilities & Learning Points
              </h3>
              <div style={{
                whiteSpace: 'pre-line',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)'
              }}>
                {opportunity.role_information.responsibilities}
                {opportunity.role_information.learning_points && (
                  <>
                    <br /><br />
                    <strong>Learning Outcomes:</strong><br />
                    {opportunity.role_information.learning_points}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Logistics & Benefits Grid */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Home size={18} style={{ color: 'var(--gte-green)' }} />
              Logistics & Support Provided
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem'
            }}>
              <div style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Home size={22} style={{ color: opportunity.logistics_info?.accommodation_provided ? 'var(--gte-green)' : 'var(--text-muted)' }} />
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Accommodation</span>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {opportunity.logistics_info?.accommodation_provided ? 'Provided by Host' : 'Self-Arranged'}
                  </p>
                </div>
              </div>

              <div style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Utensils size={22} style={{ color: opportunity.logistics_info?.food_provided ? 'var(--gte-green)' : 'var(--text-muted)' }} />
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Food / Meals</span>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {opportunity.logistics_info?.food_provided ? 'Covered / Provided' : 'Not Included'}
                  </p>
                </div>
              </div>

              <div style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Laptop size={22} style={{ color: opportunity.logistics_info?.computer_provided ? 'var(--gte-green)' : 'var(--text-muted)' }} />
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Computer / Work Equipment</span>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {opportunity.logistics_info?.computer_provided ? 'Laptop Provided' : 'Bring Own Laptop'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Required Skills & Languages */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--color-primary)' }} />
              Required Skills & Languages
            </h3>
            
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Skills</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {opportunity.skills.map(s => (
                  <span key={s.id} style={{
                    fontSize: '0.85rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    fontWeight: 600
                  }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            {opportunity.languages.length > 0 && (
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Languages</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {opportunity.languages.map(l => (
                    <span key={l.id} style={{
                      fontSize: '0.85rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)'
                    }}>
                      {l.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Legal / Visa Information */}
          {opportunity.legal_info?.visa_type && (
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(3, 126, 243, 0.06)',
              border: '1px solid rgba(3, 126, 243, 0.2)'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--color-primary)' }}>
                Visa & Legal Requirement
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Visa Type: <strong>{opportunity.legal_info.visa_type}</strong> ({opportunity.legal_info.visa_duration || 'Duration of contract'})
              </p>
            </div>
          )}

          {/* Host Entity Info */}
          <div style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <Globe size={16} />
            <span>Managed by <strong>{opportunity.host_lc.name}</strong> ({opportunity.host_lc.country})</span>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onToggleSave(opportunity)}
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              <Bookmark size={16} fill={isSaved ? 'var(--color-primary)' : 'none'} />
              {isSaved ? 'Bookmarked' : 'Save'}
            </button>

            <button
              onClick={() => onToggleCompare(opportunity)}
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              {isCompared ? <CheckSquare size={16} style={{ color: 'var(--gte-green)' }} /> : <Square size={16} />}
              {isCompared ? 'Comparing' : 'Compare'}
            </button>
          </div>

          <a
            href={aiesecLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            Apply on AIESEC.org <ExternalLink size={16} />
          </a>
        </div>

      </div>
    </div>
  );
}
