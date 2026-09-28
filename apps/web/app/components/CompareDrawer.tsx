'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, X, Trash2, CheckCircle, ExternalLink, MapPin, Clock, DollarSign, Home, Utensils } from 'lucide-react';
import { AIESECOpportunity } from '../lib/types';

interface CompareDrawerProps {
  comparedOpportunities: AIESECOpportunity[];
  onRemoveFromCompare: (oppId: string | number) => void;
  onClearAll: () => void;
}

export default function CompareDrawer({
  comparedOpportunities,
  onRemoveFromCompare,
  onClearAll
}: CompareDrawerProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  if (comparedOpportunities.length === 0) return null;

  return (
    <>
      {/* Sticky Bottom Bar */}
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 900,
        width: '90%',
        maxWidth: '720px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }} className="animate-fade-in glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 193, 110, 0.15)',
            color: 'var(--gte-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ArrowLeftRight size={18} />
          </div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>
              Compare {comparedOpportunities.length} {comparedOpportunities.length === 1 ? 'Opportunity' : 'Opportunities'}
            </strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Side-by-side stipend, location, duration & logistics
            </span>
          </div>
        </div>

        {/* Selected Opp Chips */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {comparedOpportunities.map(opp => (
            <span key={opp.id} style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              {opp.title.substring(0, 15)}...
              <button
                onClick={() => onRemoveFromCompare(opp.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsOpenModal(true)}
            className="btn-primary"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
          >
            Compare Matrix
          </button>
          <button
            onClick={onClearAll}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem' }}
            title="Clear all comparison"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Comparison Modal Matrix */}
      {isOpenModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '1.5rem 1rem'
        }} className="animate-fade-in">
          <div style={{
            width: '100%',
            maxWidth: '1080px',
            maxHeight: '90vh',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(to right, var(--bg-subtle), var(--bg-card))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeftRight size={20} style={{ color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Side-by-Side Opportunity Matrix</h3>
              </div>
              <button
                onClick={() => setIsOpenModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Matrix Table */}
            <div style={{ overflowX: 'auto', padding: '1.5rem' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}>
                <thead>
                  <tr>
                    <th style={{ padding: '1rem', width: '180px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md) 0 0 0' }}>Criteria</th>
                    {comparedOpportunities.map(opp => (
                      <th key={opp.id} style={{ padding: '1rem', background: 'var(--bg-subtle)', minWidth: '240px' }}>
                        <span className={`badge-${opp.programme.short_name.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)' }}>
                          {opp.programme.short_name}
                        </span>
                        <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.35rem' }}>{opp.title}</div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>{opp.location}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Stipend / Salary</td>
                    {comparedOpportunities.map(opp => (
                      <td key={opp.id} style={{ padding: '1rem', fontWeight: 600, color: opp.salary && opp.salary > 0 ? 'var(--gte-green)' : 'var(--text-muted)' }}>
                        {opp.salary && opp.salary > 0 ? `${opp.salary} ${opp.salary_currency || ''}/mo` : 'Volunteer'}
                      </td>
                    ))}
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Duration</td>
                    {comparedOpportunities.map(opp => (
                      <td key={opp.id} style={{ padding: '1rem' }}>
                        {opp.duration} Weeks
                      </td>
                    ))}
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Accommodation</td>
                    {comparedOpportunities.map(opp => (
                      <td key={opp.id} style={{ padding: '1rem' }}>
                        {opp.logistics_info?.accommodation_provided ? (
                          <span style={{ color: 'var(--gte-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckCircle size={16} /> Provided
                          </span>
                        ) : 'Self-Arranged'}
                      </td>
                    ))}
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Food / Meals</td>
                    {comparedOpportunities.map(opp => (
                      <td key={opp.id} style={{ padding: '1rem' }}>
                        {opp.logistics_info?.food_provided ? (
                          <span style={{ color: 'var(--gte-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckCircle size={16} /> Provided
                          </span>
                        ) : 'Not Included'}
                      </td>
                    ))}
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Start Date</td>
                    {comparedOpportunities.map(opp => (
                      <td key={opp.id} style={{ padding: '1rem' }}>
                        {opp.earliest_start_date}
                      </td>
                    ))}
                  </tr>

                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Openings Left</td>
                    {comparedOpportunities.map(opp => (
                      <td key={opp.id} style={{ padding: '1rem', fontWeight: 600 }}>
                        {opp.available_openings} of {opp.openings}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Action</td>
                    {comparedOpportunities.map(opp => {
                      const progSlug = opp.programme.short_name.toLowerCase() === 'gte' ? 'global-teacher' : 'global-talent';
                      return (
                        <td key={opp.id} style={{ padding: '1rem' }}>
                          <a
                            href={`https://aiesec.org/opportunity/${progSlug}/${opp.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', textDecoration: 'none' }}
                          >
                            Apply Link <ExternalLink size={14} />
                          </a>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
