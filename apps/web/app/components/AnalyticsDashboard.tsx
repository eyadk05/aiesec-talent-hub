'use client';

import React from 'react';
import { BarChart3, TrendingUp, Globe, Briefcase, GraduationCap, DollarSign, Award, Layers, Home, MapPin } from 'lucide-react';
import { AIESECOpportunity } from '../lib/types';
import { REAL_LIVE_OPPORTUNITIES } from '../lib/aiesec-api';

interface AnalyticsDashboardProps {
  opportunities?: AIESECOpportunity[];
}

export default function AnalyticsDashboard({ opportunities }: AnalyticsDashboardProps) {
  // Use full live dataset if prop is paginated subset
  const dataToAnalyze = (opportunities && opportunities.length > 50) ? opportunities : REAL_LIVE_OPPORTUNITIES;
  const total = dataToAnalyze.length || 1;

  // Breakdown by Programme (GTa vs GTe)
  const gtaCount = dataToAnalyze.filter(o => {
    const s = (o.programme?.short_name || '').toUpperCase();
    return s === 'GTA' || s === 'GT' || o.programme?.id === 8;
  }).length;

  const gteCount = dataToAnalyze.filter(o => {
    const s = (o.programme?.short_name || '').toUpperCase();
    return s === 'GTE' || o.programme?.id === 9;
  }).length;

  const gtaPercent = Math.round((gtaCount / total) * 100);
  const gtePercent = Math.round((gteCount / total) * 100);

  // Breakdown by Region / Continent
  const regionCounts: Record<string, number> = {};
  dataToAnalyze.forEach(o => {
    const r = o.region || 'Americas';
    regionCounts[r] = (regionCounts[r] || 0) + 1;
  });

  const sortedRegions = Object.entries(regionCounts).sort((a, b) => b[1] - a[1]);

  // Breakdown by Country
  const countryCounts: Record<string, number> = {};
  dataToAnalyze.forEach(o => {
    const c = o.country || 'Global';
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });

  const sortedCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]);

  // Breakdown by Skills
  const skillCounts: Record<string, number> = {};
  dataToAnalyze.forEach(o => {
    if (Array.isArray(o.skills)) {
      o.skills.forEach(s => {
        if (s?.name && s.name !== 'Skill' && s.name !== 'Professional Expertise') {
          skillCounts[s.name] = (skillCounts[s.name] || 0) + 1;
        }
      });
    }
  });

  const sortedSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Paid vs Unpaid ratio
  const paidCount = dataToAnalyze.filter(o => typeof o.salary === 'number' && o.salary > 0).length;
  const paidPercent = Math.round((paidCount / total) * 100);

  // Accommodation provided
  const accCount = dataToAnalyze.filter(o => Boolean(o.logistics_info?.accommodation_provided)).length;
  const accPercent = Math.round((accCount / total) * 100);

  // Food provided
  const foodCount = dataToAnalyze.filter(o => Boolean(o.logistics_info?.food_provided)).length;
  const foodPercent = Math.round((foodCount / total) * 100);

  return (
    <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem' }} className="animate-fade-in">
      
      {/* Title Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
          <TrendingUp size={18} /> Global Market Analytics
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AIESEC Global Opportunities Intelligence</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Analytics generated across all <strong>{total}</strong> active, real-time Global Talent & Global Teacher postings worldwide.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total Active Postings</span>
            <strong style={{ fontSize: '1.5rem', fontWeight: 800 }}>{total}</strong>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--gta-bg)',
            color: 'var(--gta-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Briefcase size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Global Talent (GTa)</span>
            <strong style={{ fontSize: '1.5rem', fontWeight: 800 }}>{gtaCount} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>({gtaPercent}%)</span></strong>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--gte-bg)',
            color: 'var(--gte-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Global Teacher (GTe)</span>
            <strong style={{ fontSize: '1.5rem', fontWeight: 800 }}>{gteCount} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>({gtePercent}%)</span></strong>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Paid / Salaried</span>
            <strong style={{ fontSize: '1.5rem', fontWeight: 800 }}>{paidCount} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>({paidPercent}%)</span></strong>
          </div>
        </div>
      </div>

      {/* Grid Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem'
      }}>

        {/* Regional / Continent Breakdown */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} style={{ color: 'var(--color-primary)' }} />
            Opportunities by Region / Continent
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sortedRegions.map(([reg, count]) => {
              const p = Math.round((count / total) * 100);
              const color = reg === 'Asia' ? '#3b82f6' : reg === 'Europe' ? '#10b981' : reg === 'Africa' ? '#f59e0b' : '#ec4899';
              return (
                <div key={reg}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600 }}>{reg}</span>
                    <strong>{count} positions ({p}%)</strong>
                  </div>
                  <div style={{ height: '10px', width: '100%', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p}%`, backgroundColor: color, borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Hiring Countries */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} style={{ color: 'var(--gte-green)' }} />
            Top Destination Countries
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {sortedCountries.slice(0, 6).map(([country, count]) => {
              const p = Math.round((count / total) * 100);
              return (
                <div key={country}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <span>{country}</span>
                    <strong>{count} opps ({p}%)</strong>
                  </div>
                  <div style={{ height: '8px', width: '100%', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.max(p, 4)}%`, backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Programme Breakdown (GTa vs GTe) */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} style={{ color: 'var(--gta-blue)' }} />
            Programme Split (GTa vs GTe)
          </h3>

          <div style={{ height: '16px', width: '100%', borderRadius: 'var(--radius-full)', overflow: 'hidden', display: 'flex', marginBottom: '1.25rem' }}>
            <div style={{ width: `${gtaPercent}%`, backgroundColor: 'var(--gta-blue)' }} title={`Global Talent: ${gtaPercent}%`} />
            <div style={{ width: `${gtePercent}%`, backgroundColor: 'var(--gte-green)' }} title={`Global Teacher: ${gtePercent}%`} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--gta-blue)' }} />
                Global Talent (GTa)
              </span>
              <strong>{gtaCount} positions ({gtaPercent}%)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--gte-green)' }} />
                Global Teacher (GTe)
              </span>
              <strong>{gteCount} positions ({gtePercent}%)</strong>
            </div>
          </div>
        </div>

        {/* Most In-Demand Skills */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} style={{ color: 'var(--color-primary)' }} />
            Top In-Demand Skills
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {sortedSkills.map(([skill, count]) => (
              <div key={skill} style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontWeight: 600 }}>{skill}</span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)'
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Accommodation & Benefits Overview */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={18} style={{ color: 'var(--gte-green)' }} />
            Logistics & Accommodation Support
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                <span>Accommodation Provided / Covered</span>
                <strong style={{ color: 'var(--gte-green)' }}>{accCount} opps ({accPercent}%)</strong>
              </div>
              <div style={{ height: '8px', width: '100%', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${accPercent}%`, backgroundColor: 'var(--gte-green)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                <span>Food / Meals Provided</span>
                <strong style={{ color: 'var(--gta-blue)' }}>{foodCount} opps ({foodPercent}%)</strong>
              </div>
              <div style={{ height: '8px', width: '100%', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${foodPercent}%`, backgroundColor: 'var(--gta-blue)' }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
