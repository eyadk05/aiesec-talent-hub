'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import OpportunityDetailModal from '../../components/OpportunityDetailModal';
import { AIESECOpportunity } from '../../lib/types';
import { Compass, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function OpportunityPage() {
  const params = useParams();
  const id = params?.id as string;

  const [opportunity, setOpportunity] = useState<AIESECOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [savedOpportunities, setSavedOpportunities] = useState<AIESECOpportunity[]>([]);
  const [comparedOpportunities, setComparedOpportunities] = useState<AIESECOpportunity[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('aiesec_theme') as 'dark' | 'light';
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
      const savedList = localStorage.getItem('aiesec_saved_opps');
      if (savedList) setSavedOpportunities(JSON.parse(savedList));
    } catch (e) {}
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch(`/api/opportunity/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setOpportunity(data.data);
        } else {
          setError(data.error || 'Opportunity not found');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to load opportunity details.');
        setIsLoading(false);
      });
  }, [id]);

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab="explore"
        setActiveTab={() => {}}
        savedCount={savedOpportunities.length}
        theme={theme}
        onToggleTheme={() => {
          const next = theme === 'dark' ? 'light' : 'dark';
          setTheme(next);
          document.documentElement.setAttribute('data-theme', next);
          try { localStorage.setItem('aiesec_theme', next); } catch (e) {}
        }}
      />

      <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <RefreshCw size={36} className="animate-spin" style={{ color: 'var(--color-primary)', margin: '0 auto 1rem auto' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading opportunity details...</p>
          </div>
        ) : error || !opportunity ? (
          <div style={{
            padding: '4rem 1.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '600px',
            margin: '2rem auto'
          }}>
            <AlertCircle size={44} style={{ color: 'var(--gv-orange)', margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Opportunity Not Found</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              The requested opportunity might have closed or been updated.
            </p>
            <Link href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              <Compass size={18} /> Back to Opportunities Portal
            </Link>
          </div>
        ) : (
          <OpportunityDetailModal
            opportunity={opportunity}
            onClose={() => window.location.href = '/'}
            isSaved={savedOpportunities.some(s => s.id === opportunity.id)}
            onToggleSave={handleToggleSave}
            isCompared={comparedOpportunities.some(c => c.id === opportunity.id)}
            onToggleCompare={handleToggleCompare}
          />
        )}
      </main>
    </div>
  );
}
