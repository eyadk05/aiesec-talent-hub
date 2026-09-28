'use client';

import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, AlertCircle, Eye, EyeOff, X, RefreshCw, Zap } from 'lucide-react';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentToken: string;
  onSaveToken: (token: string) => void;
  isDemoMode: boolean;
}

export default function TokenModal({
  isOpen,
  onClose,
  currentToken,
  onSaveToken,
  isDemoMode
}: TokenModalProps) {
  const [tokenInput, setTokenInput] = useState(currentToken);
  const [showToken, setShowToken] = useState(false);
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    setTokenInput(currentToken);
    setTestingStatus('idle');
  }, [currentToken, isOpen]);

  if (!isOpen) return null;

  const handleTestToken = async () => {
    if (!tokenInput.trim()) {
      setTestingStatus('failed');
      setTestMessage('Please enter a token first.');
      return;
    }

    setTestingStatus('testing');
    setTestMessage('Verifying token with AIESEC GIS API...');

    try {
      const res = await fetch(`/api/opportunities?page=1&per_page=1&token=${encodeURIComponent(tokenInput.trim())}`, {
        headers: { 'x-access-token': tokenInput.trim() }
      });
      const data = await res.json();

      if (data && !data.isDemoMode) {
        setTestingStatus('success');
        setTestMessage('Successfully connected to live AIESEC GIS API!');
      } else {
        setTestingStatus('failed');
        setTestMessage('Token returned no live GIS data. App will run in Demo Mode.');
      }
    } catch (err) {
      setTestingStatus('failed');
      setTestMessage('Network error verifying token. Will default to Demo Mode.');
    }
  };

  const handleSave = () => {
    onSaveToken(tokenInput.trim());
    onClose();
  };

  const handleClearToken = () => {
    setTokenInput('');
    onSaveToken('');
    setTestingStatus('idle');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      padding: '1rem'
    }} className="animate-fade-in">
      <div style={{
        width: '100%',
        maxWidth: '520px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <Key size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>AIESEC Access Token</h3>
              <p style={{ fontSize: '0.85rem' }}>Connect your GIS / EXPA account API token</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Current Status Pill */}
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: !isDemoMode && currentToken ? 'rgba(0, 193, 110, 0.1)' : 'rgba(3, 126, 243, 0.1)',
            border: `1px solid ${!isDemoMode && currentToken ? 'rgba(0, 193, 110, 0.3)' : 'rgba(3, 126, 243, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.9rem'
          }}>
            {!isDemoMode && currentToken ? (
              <>
                <CheckCircle size={18} style={{ color: 'var(--gte-green)' }} />
                <span><strong>Connected to Live GIS API:</strong> Real opportunities will be fetched directly.</span>
              </>
            ) : (
              <>
                <Zap size={18} style={{ color: 'var(--color-primary)' }} />
                <span><strong>Demo Mode Active:</strong> Paste your AIESEC token below to unlock live sync.</span>
              </>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              GIS API Access Token
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showToken ? 'text' : 'password'}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="e.g. 5f4e3d2c1b0a987654321..."
                className="input-field"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', marginTop: '0.4rem' }}>
              You can get your token from your logged-in AIESEC.org session storage or EXPA developer account.
            </p>
          </div>

          {/* Test Status Feedback */}
          {testingStatus !== 'idle' && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: testingStatus === 'testing' ? 'var(--bg-subtle)' : testingStatus === 'success' ? 'rgba(0, 193, 110, 0.15)' : 'rgba(248, 90, 64, 0.15)',
              color: testingStatus === 'testing' ? 'var(--text-main)' : testingStatus === 'success' ? 'var(--gte-green)' : 'var(--gv-orange)'
            }}>
              {testingStatus === 'testing' && <RefreshCw size={16} className="animate-spin" />}
              {testingStatus === 'success' && <CheckCircle size={16} />}
              {testingStatus === 'failed' && <AlertCircle size={16} />}
              <span>{testMessage}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            {tokenInput && (
              <button
                type="button"
                onClick={handleClearToken}
                className="btn-secondary"
                style={{ fontSize: '0.875rem' }}
              >
                Clear Token
              </button>
            )}
            <button
              type="button"
              onClick={handleTestToken}
              className="btn-outline"
              style={{ fontSize: '0.875rem' }}
              disabled={testingStatus === 'testing'}
            >
              Test Connection
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary"
              style={{ fontSize: '0.875rem' }}
            >
              Save & Apply Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
