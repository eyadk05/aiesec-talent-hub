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

  // Breakdown by Backgrounds Needed
  const bgCounts: Record<string, number> = {};
  dataToAnalyze.forEach(o => {
    if (Array.isArray(o.backgrounds)) {
      o.backgrounds.forEach(b => {
        if (b?.name && b.name.trim()) {
          bgCounts[b.name] = (bgCounts[b.name] || 0) + 1;
        }
      });
    }
  });

  const sortedBackgrounds = Object.entries(bgCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

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
    <div className="animate-fade-in">

      {/* ── Hero Background Banner ── */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 40%, #0a2240 70%, #071828 100%)',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '3rem',
        marginBottom: '0',
      }}>

        {/* Decorative radial glow center */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 60% at 50% 20%, rgba(3,126,243,0.18) 0%, transparent 70%)',
        }} />

        {/* Decorative blob top-right */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px', width: '340px', height: '340px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,193,110,0.13) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Decorative blob bottom-left */}
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-40px', width: '280px', height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(3,126,243,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Grid dot pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Hero text content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#60a5fa', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <TrendingUp size={16} /> Global Market Analytics
          </div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 900,
            color: '#ffffff',
            marginBottom: '0.6rem',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
          }}>
            AIESEC Opportunities
            <span style={{
              display: 'block',
              background: 'linear-gradient(90deg, #60a5fa, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Global Intelligence
            </span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', maxWidth: '560px', lineHeight: 1.7 }}>
            Real-time analytics across <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{total}</strong> active Global Talent &amp; Global Teacher postings — updated live from the AIESEC network.
          </p>

          {/* Quick stat pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.75rem' }}>
            {[
              { label: 'Total Opportunities', value: total, color: '#60a5fa' },
              { label: 'Global Talent (GTa)', value: gtaCount, color: '#60a5fa' },
              { label: 'Global Teacher (GTe)', value: gteCount, color: '#34d399' },
              { label: 'Paid / Salaried', value: paidCount, color: '#a78bfa' },
              { label: 'With Accommodation', value: accCount, color: '#fb923c' },
            ].map(stat => (
              <div key={stat.label} style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.82rem',
              }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: stat.color }}>{stat.value}</span>
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Chart Grid ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>

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

        {/* Most Wanted Backgrounds */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} style={{ color: 'var(--color-primary)' }} />
            Most Wanted Backgrounds
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', marginTop: '-0.75rem' }}>
            Academic &amp; professional fields most required across all opportunities
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.85rem' }}>
            {sortedBackgrounds.map(([bg, count], idx) => {
              const maxCount = sortedBackgrounds[0]?.[1] ?? 1;
              const barWidth = Math.round((count / maxCount) * 100);
              const pct = Math.round((count / total) * 100);

              // Map background field to thematic emoji + gradient
              const b = bg.toLowerCase();
              let emoji = '🎓';
              let grad = 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)';
              let barColor = 'rgba(96,165,250,0.9)';

              if (b.includes('computer') || b.includes('software') || b.includes('it') || b.includes('information tech') || b.includes('computing')) {
                emoji = '💻'; grad = 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)'; barColor = 'rgba(96,165,250,0.9)';
              } else if (b.includes('business') || b.includes('management') || b.includes('administration') || b.includes('mba')) {
                emoji = '💼'; grad = 'linear-gradient(135deg, #422006 0%, #92400e 100%)'; barColor = 'rgba(251,191,36,0.9)';
              } else if (b.includes('market') || b.includes('sales') || b.includes('advertis') || b.includes('brand') || b.includes('digital')) {
                emoji = '📊'; grad = 'linear-gradient(135deg, #431407 0%, #c2410c 100%)'; barColor = 'rgba(251,146,60,0.9)';
              } else if (b.includes('teach') || b.includes('education') || b.includes('pedagog') || b.includes('school') || b.includes('english teach')) {
                emoji = '📚'; grad = 'linear-gradient(135deg, #1a2e05 0%, #3f6212 100%)'; barColor = 'rgba(134,239,172,0.9)';
              } else if (b.includes('engineer') || b.includes('mechanic') || b.includes('electric') || b.includes('civil') || b.includes('architect')) {
                emoji = '⚙️'; grad = 'linear-gradient(135deg, #1c1917 0%, #44403c 100%)'; barColor = 'rgba(214,211,209,0.9)';
              } else if (b.includes('finance') || b.includes('account') || b.includes('banking') || b.includes('econom') || b.includes('invest')) {
                emoji = '💹'; grad = 'linear-gradient(135deg, #052e16 0%, #15803d 100%)'; barColor = 'rgba(74,222,128,0.9)';
              } else if (b.includes('language') || b.includes('english') || b.includes('translat') || b.includes('linguist') || b.includes('communicat')) {
                emoji = '🌐'; grad = 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)'; barColor = 'rgba(56,189,248,0.9)';
              } else if (b.includes('design') || b.includes('creative') || b.includes('art') || b.includes('graphic') || b.includes('media') || b.includes('ux') || b.includes('ui')) {
                emoji = '🎨'; grad = 'linear-gradient(135deg, #500724 0%, #be185d 100%)'; barColor = 'rgba(249,168,212,0.9)';
              } else if (b.includes('health') || b.includes('medic') || b.includes('nurs') || b.includes('public health') || b.includes('pharma') || b.includes('biology')) {
                emoji = '🏥'; grad = 'linear-gradient(135deg, #042f2e 0%, #0d9488 100%)'; barColor = 'rgba(94,234,212,0.9)';
              } else if (b.includes('law') || b.includes('legal') || b.includes('political') || b.includes('governance') || b.includes('diplomac')) {
                emoji = '⚖️'; grad = 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)'; barColor = 'rgba(165,180,252,0.9)';
              } else if (b.includes('data') || b.includes('analytic') || b.includes('statistic') || b.includes('research') || b.includes('science')) {
                emoji = '🔬'; grad = 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)'; barColor = 'rgba(165,180,252,0.9)';
              } else if (b.includes('social') || b.includes('psychol') || b.includes('anthropol') || b.includes('sociolog') || b.includes('humanitarian')) {
                emoji = '🤝'; grad = 'linear-gradient(135deg, #134e4a 0%, #0d9488 100%)'; barColor = 'rgba(45,212,191,0.9)';
              } else if (b.includes('entrepreneur') || b.includes('startup') || b.includes('innovation')) {
                emoji = '🚀'; grad = 'linear-gradient(135deg, #0f172a 0%, #7c3aed 100%)'; barColor = 'rgba(167,139,250,0.9)';
              } else if (b.includes('environment') || b.includes('sustainab') || b.includes('ecology') || b.includes('nature') || b.includes('climate')) {
                emoji = '🌱'; grad = 'linear-gradient(135deg, #052e16 0%, #166534 100%)'; barColor = 'rgba(134,239,172,0.9)';
              } else {
                const FALLBACKS = [
                  { e: '🌍', g: 'linear-gradient(135deg, #0a2240 0%, #037EF3 100%)', b2: 'rgba(96,165,250,0.9)' },
                  { e: '✨', g: 'linear-gradient(135deg, #3b0764 0%, #9333ea 100%)', b2: 'rgba(192,132,252,0.9)' },
                  { e: '📐', g: 'linear-gradient(135deg, #27272a 0%, #52525b 100%)', b2: 'rgba(212,212,216,0.9)' },
                ];
                const f = FALLBACKS[idx % FALLBACKS.length];
                emoji = f.e; grad = f.g; barColor = f.b2;
              }

              return (
                <div key={bg} style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-md)',
                  background: grad,
                  padding: '1rem 1.1rem 0.85rem',
                  cursor: 'default',
                  minHeight: '88px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  {/* Dot pattern overlay */}
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }} />

                  {/* Big emoji watermark */}
                  <div style={{
                    position: 'absolute', right: '-6px', bottom: '-8px',
                    fontSize: '4.2rem', opacity: 0.2, lineHeight: 1,
                    pointerEvents: 'none', userSelect: 'none',
                  }}>
                    {emoji}
                  </div>

                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {/* Rank */}
                      <span style={{
                        flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: 900, color: '#fff', marginTop: '1px',
                      }}>
                        {idx + 1}
                      </span>
                      {/* Background name */}
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff', lineHeight: 1.3, flex: 1 }}>
                        {bg}
                      </span>
                      {/* Count pill */}
                      <span style={{
                        flexShrink: 0, fontSize: '0.73rem', fontWeight: 800,
                        color: 'rgba(255,255,255,0.95)',
                        backgroundColor: 'rgba(255,255,255,0.18)',
                        padding: '0.1rem 0.5rem', borderRadius: '9999px',
                      }}>
                        {count} opps
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: '4px', width: '100%', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.15)' }}>
                      <div style={{ height: '100%', width: `${barWidth}%`, borderRadius: '9999px', backgroundColor: barColor, transition: 'width 0.7s ease' }} />
                    </div>

                    {/* Percentage label */}
                    <div style={{ marginTop: '0.3rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>
                      {pct}% of all opportunities
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accommodation & Benefits Overview */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={18} style={{ color: 'var(--gte-green)' }} />
            Logistics &amp; Accommodation Support
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
    </div>
  );
}
