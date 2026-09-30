"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminEditDialog from '@/components/AdminEditDialog';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secret, setSecret] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [tiles, setTiles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState(null);
  const editTrigger = useRef(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const requestId = useRef(0);

  // Edit Modal State
  const [editingTile, setEditingTile] = useState(null);
  const [editFilename, setEditFilename] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  const fetchTiles = useCallback(async (signal) => {
    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setLoadError('');
    try {
      const url = new URL('/admin/api/tiles', window.location.origin);
      url.searchParams.set('page', page);
      url.searchParams.set('pageSize', 20);
      if (search) url.searchParams.set('search', search);

      const res = await fetch(url.toString(), {
        headers: { 'Authorization': secret }, signal,
      });
      const data = await res.json();
      if (currentRequest !== requestId.current || signal?.aborted) return;
      
      if (res.ok && data.success) {
        setTiles(data.tiles);
        setTotalCount(data.totalCount);
        setStats(data.stats);
      } else throw new Error(data.error || 'Failed to load tiles.');
    } catch (error) {
      if (currentRequest === requestId.current && !signal?.aborted) setLoadError(error.message || 'Failed to load tiles.');
    } finally {
      if (currentRequest === requestId.current && !signal?.aborted) setIsLoading(false);
    }
  }, [page, search, secret]);

  useEffect(() => {
    if (isAuthenticated) {
      const controller = new AbortController();
      const timer = setTimeout(() => {
        fetchTiles(controller.signal);
      }, 300);
      return () => { clearTimeout(timer); controller.abort(); };
    }
  }, [isAuthenticated, fetchTiles]);

  const handleDelete = async (id, filename) => {
    if (!confirm(`Are you sure you want to permanently delete '${filename}'? This will remove it from the database and Cloudinary.`)) {
      return;
    }
    
    try {
      const res = await fetch(`/admin/api/tiles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': secret }
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.warning) alert(data.warning);
        if (tiles.length === 1 && page > 1) setPage(page - 1);
        else fetchTiles();
      } else {
        alert(data.error || "Failed to delete.");
      }
    } catch (error) {
      alert("Network error.");
    }
  };

  const openEditModal = (tile, trigger) => {
    editTrigger.current = trigger;
    setEditingTile(tile);
    setEditFilename(tile.filename);
    setEditCategory(tile.category);
  };

  const saveEdit = async () => {
    if (!editingTile) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/admin/api/tiles/${editingTile.id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': secret,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: editFilename, category: editCategory })
      });
      const data = await res.json();
      if (data.success) {
        setEditingTile(null);
        fetchTiles();
      } else {
        alert(data.error || "Failed to save.");
      }
    } catch (error) {
      alert("Network error.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-surface-container p-8 rounded-2xl max-w-md w-full border border-outline-variant/30 shadow-2xl">
          <h1 className="text-3xl font-display-xl mb-6 text-on-surface">Admin Login</h1>
          <p className="text-on-surface-variant mb-6 text-sm">Please enter the ADMIN_SECRET to access the dashboard.</p>
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

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pt-32 sm:pt-32 pb-32 sm:pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-display-xl text-on-surface mb-2">Admin Dashboard</h1>
          <p className="text-on-surface-variant">Manage all tile images across your collections.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/admin/bulk-migrate" 
            className="bg-surface-container-high text-on-surface font-body-md font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity border border-outline-variant"
          >
            Bulk Migration Tool
          </Link>
          <Link 
            href="/admin/add-tiles" 
            className="bg-primary-container text-[#17130b] font-body-md font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity"
          >
            + Add New Tiles
          </Link>
        </div>
      </div>

      {/* Global statistics remain independent of the table search. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Catalogue statistics">
        {[
          ['Total records', stats?.total],
          ['Successfully uploaded', stats?.successful],
          ['Failed', stats?.failed],
        ].map(([label, value]) => (
          <div key={label} className="bg-surface-container p-8 rounded-3xl border border-outline-variant/30 shadow-xl">
            <div className="text-sm text-on-surface-variant uppercase tracking-wider mb-2 font-medium">{label}</div>
            <div className="text-5xl font-display-xl text-on-surface">{loadError ? '—' : value ?? '…'}</div>
          </div>
        ))}
      </div>

      {/* Data Table Area */}
      <div className="bg-surface-container rounded-3xl border border-outline-variant/30 shadow-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-high">
          <input 
            type="text"
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full max-w-sm bg-surface border border-outline-variant rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary-container"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-on-surface-variant text-sm uppercase tracking-wider border-b border-outline-variant/30">
                <th className="p-4 font-medium">Preview</th>
                <th className="p-4 font-medium">Filename</th>
                <th className="p-4 font-medium">Size</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-on-surface-variant">Loading tiles...</td>
                </tr>
              ) : loadError ? (
                <tr><td colSpan="6" className="p-12 text-center text-red-400" role="alert">{loadError} <button onClick={() => fetchTiles()} className="underline">Retry</button></td></tr>
              ) : tiles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-on-surface-variant">No tiles found.</td>
                </tr>
              ) : (
                tiles.map(tile => (
                  <tr key={tile.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded bg-surface-container overflow-hidden">
                        {tile.cloudinary_secure_url ? (
                          <Image src={tile.cloudinary_secure_url.replace('/upload/', '/upload/c_fill,w_100,q_auto/')} alt={tile.filename || 'Tile preview'} width={48} height={48} unoptimized className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-red-500/20"></div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-on-surface font-medium">{tile.filename}</td>
                    <td className="p-4 text-on-surface-variant">{tile.size}</td>
                    <td className="p-4 text-on-surface-variant">{tile.category}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${tile.upload_status === 'SUCCESS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {tile.upload_status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={event => openEditModal(tile, event.currentTarget)} className="text-primary hover:text-primary-container px-3 py-1 font-medium text-sm transition-colors">Edit</button>
                      <button onClick={() => handleDelete(tile.id, tile.filename)} className="text-red-400 hover:text-red-300 px-3 py-1 font-medium text-sm transition-colors ml-2">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-outline-variant/30 flex flex-wrap gap-4 justify-between items-center bg-surface-container-high">
          <div className="text-on-surface-variant text-sm">
            {totalCount} matching records · Page {page} of {totalPages || 1}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded border border-outline-variant text-on-surface disabled:opacity-30 hover:bg-surface transition-colors"
            >
              Prev
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded border border-outline-variant text-on-surface disabled:opacity-30 hover:bg-surface transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTile && (
        <AdminEditDialog returnFocusRef={editTrigger} onClose={() => setEditingTile(null)}>
          <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/30 max-w-md w-full shadow-2xl">
            <h2 id="admin-edit-title" className="text-2xl font-display-xl text-on-surface mb-6">Edit Tile</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <label htmlFor="edit-filename" className="block text-on-surface-variant text-xs uppercase tracking-wider mb-2 font-medium">Filename</label>
                <input 
                  type="text"
                  id="edit-filename"
                  value={editFilename}
                  onChange={e => setEditFilename(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
              <div>
                <label htmlFor="edit-category" className="block text-on-surface-variant text-xs uppercase tracking-wider mb-2 font-medium">Category</label>
                <input 
                  type="text"
                  id="edit-category"
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setEditingTile(null)}
                className="px-6 py-2 text-on-surface-variant hover:text-on-surface font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveEdit}
                disabled={isSaving}
                className="bg-primary-container text-[#17130b] font-bold py-2 px-6 rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </AdminEditDialog>
      )}

    </div>
  );
}
