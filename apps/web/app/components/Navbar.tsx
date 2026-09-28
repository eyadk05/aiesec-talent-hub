'use client';

import React from 'react';
import { Globe, Bookmark, BarChart3, Compass, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'saved' | 'analytics';
  setActiveTab: (tab: 'explore' | 'saved' | 'analytics') => void;
  savedCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  savedCount,
  theme,
  onToggleTheme
}: NavbarProps) {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-color)',
      padding: '0.75rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('explore')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #037EF3 0%, #008FE3 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Globe size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>AIESEC</span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                textTransform: 'uppercase'
              }}>
                Talent Hub
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Live Opportunities Portal
            </span>
          </div>
        </div>

        {/* Central Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          backgroundColor: 'var(--bg-subtle)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setActiveTab('explore')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: activeTab === 'explore' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'explore' ? 'var(--color-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'explore' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Compass size={17} />
            Explore Opps
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: activeTab === 'saved' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'saved' ? 'var(--color-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'saved' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Bookmark size={17} />
            Saved & Compare
            {savedCount > 0 && (
              <span style={{
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: activeTab === 'analytics' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'analytics' ? 'var(--color-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'analytics' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <BarChart3 size={17} />
            Analytics
          </button>
        </nav>

        {/* Right Action: Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onToggleTheme}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </div>
    </header>
  );
}
