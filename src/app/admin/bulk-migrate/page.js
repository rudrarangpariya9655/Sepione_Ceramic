"use client";

import { useState, useEffect } from 'react';
import { formatCollectionText } from '@/lib/collection-formats';

export default function BulkMigratePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secret, setSecret] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [migrationState, setMigrationState] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState('');

  // Polling logic
  useEffect(() => {
    let interval;
    if (isAuthenticated && migrationState?.isRunning) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('/admin/api/bulk-migrate', { headers: { Authorization: secret } });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Could not load migration status.');
          setMigrationState(data);
        } catch (e) {
          setStartError(e.message || 'Could not load migration status.');
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated, migrationState?.isRunning, secret]);

  // Initial fetch just in case it's already running
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/admin/api/bulk-migrate', { headers: { Authorization: secret } })
        .then(async res => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Could not load migration status.');
          return data;
        })
        .then(data => setMigrationState(data))
        .catch(e => setStartError(e.message));
    }
  }, [isAuthenticated, secret]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError('');
    try {
      const res = await fetch('/admin/api/verify-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || "Invalid secret.");
      }
    } catch (e) {
      setAuthError("Failed to connect.");
    } finally {
      setIsVerifying(false);
    }
  };

  const startMigration = async () => {
    setIsStarting(true);
    setStartError('');
    try {
      const res = await fetch('/admin/api/bulk-migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret })
      });
      const data = await res.json();
      if (!data.success) {
        setStartError(data.error || "Failed to start.");
      } else {
        // Trigger immediate fetch to show running state
        const stateRes = await fetch('/admin/api/bulk-migrate', { headers: { Authorization: secret } });
        const state = await stateRes.json();
        if (!stateRes.ok) throw new Error(state.error || 'Could not load migration status.');
        setMigrationState(state);
      }
    } catch (e) {
      setStartError("Failed to connect.");
    } finally {
      setIsStarting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-surface-container p-8 rounded-2xl max-w-md w-full border border-outline-variant/30 shadow-2xl">
          <h1 className="text-3xl font-display-xl mb-6 text-on-surface">Bulk Migrate Auth</h1>
          <p className="text-on-surface-variant mb-6 text-sm">Please enter the ADMIN_SECRET to access the bulk migration tool.</p>
          <input
            type="password"
            aria-label="Admin secret"
            autoComplete="current-password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full bg-surface text-on-surface border border-outline-variant rounded-lg p-3 mb-4 focus:border-primary-container focus:outline-none"
            placeholder="Enter Admin Secret"
            required
          />
          {authError && <div className="text-red-400 mb-4 text-sm">{authError}</div>}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-primary-container text-[#17130b] font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isVerifying ? "Verifying..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto space-y-8 pt-32">
      <div>
        <h1 className="text-4xl font-display-xl text-on-surface mb-2">Bulk Migration Dashboard</h1>
        <p className="text-on-surface-variant">Sync local tile images to Cloudinary and Supabase. Keep the local server running until the migration finishes.</p>
      </div>

      <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/30 shadow-xl space-y-8">
        
        <div className="flex flex-wrap gap-4 justify-between items-center pb-6 border-b border-outline-variant/30">
          <div>
            <div className="text-2xl font-bold text-on-surface">
              Status: {migrationState?.isRunning ? (
                <span className="text-primary-container animate-pulse">Running</span>
              ) : migrationState?.error ? (
                <span className="text-red-400">Stopped</span>
              ) : migrationState?.isComplete ? (
                <span className="text-green-400">Complete</span>
              ) : (
                <span className="text-on-surface-variant">Idle</span>
              )}
            </div>
            {migrationState?.isRunning && (
              <div className="text-sm text-on-surface-variant mt-2 max-w-lg truncate">
                Processing: {formatCollectionText(migrationState?.currentFile)}
              </div>
            )}
          </div>
          <button
            onClick={startMigration}
            disabled={isStarting || migrationState?.isRunning || !migrationState?.configuration?.ready}
            className="bg-primary-container text-[#17130b] font-bold py-3 px-8 rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap shadow-lg"
          >
            {isStarting ? "Starting..." : migrationState?.isRunning ? "Migration in Progress" : "Start Migration"}
          </button>
        </div>

        {migrationState?.configuration?.error && <p role="alert" className="text-error">{migrationState.configuration.error}</p>}
        {startError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">{startError}</div>}
        {migrationState?.error && <div role="alert" className="text-red-400">{migrationState.error}</div>}

        {migrationState && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Files" value={migrationState.totalFiles} />
            <StatCard title="Uploaded" value={migrationState.uploadedCount} color="text-green-400" />
            <StatCard title="Skipped (Exists)" value={migrationState.skippedCount} color="text-on-surface-variant" />
            <StatCard title="Failed" value={migrationState.failedCount} color="text-red-400" />
          </div>
        )}

        {/* Progress Bar */}
        {migrationState && migrationState.totalFiles > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Progress</span>
              <span>{Math.round(((migrationState.uploadedCount + migrationState.skippedCount + migrationState.failedCount) / migrationState.totalFiles) * 100)}%</span>
            </div>
            <div className="h-4 bg-surface rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-green-500 transition-all duration-500" 
                style={{ width: `${(migrationState.uploadedCount / migrationState.totalFiles) * 100}%` }}
              ></div>
              <div 
                className="h-full bg-surface-container-high transition-all duration-500" 
                style={{ width: `${(migrationState.skippedCount / migrationState.totalFiles) * 100}%` }}
              ></div>
              <div 
                className="h-full bg-red-500 transition-all duration-500" 
                style={{ width: `${(migrationState.failedCount / migrationState.totalFiles) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Failure Log */}
        {migrationState?.failedFiles?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Failed Items ({migrationState.failedFiles.length})
            </h3>
            <div className="bg-surface border border-red-500/20 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
              {migrationState.failedFiles.map((err, idx) => (
                <div key={idx} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/5">
                  <div className="text-sm font-mono text-on-surface mb-1 break-all">{formatCollectionText(err.file)}</div>
                  <div className="text-sm text-red-400/80">{err.reason}</div>
                  {err.cleanup && <p className="text-error">{err.cleanup.error} Asset: {err.cleanup.assetId}</p>}
                  {err.assetId && <p>Existing asset: {err.assetId}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function StatCard({ title, value, color = "text-on-surface" }) {
  return (
    <div className="bg-surface p-6 rounded-2xl border border-outline-variant/20 flex flex-col items-center justify-center text-center">
      <div className="text-sm text-on-surface-variant uppercase tracking-wider mb-2 font-medium">{title}</div>
      <div className={`text-4xl font-display-xl ${color}`}>{value || 0}</div>
    </div>
  );
}
