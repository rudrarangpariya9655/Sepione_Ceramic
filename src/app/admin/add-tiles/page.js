"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { validateTileUpload } from '@/lib/tile-validation';

export default function AddTilesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secret, setSecret] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [files, setFiles] = useState([]);
  const [size, setSize] = useState('12x12');
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState({ success: 0, failed: 0, logs: [] });
  const [categoryError, setCategoryError] = useState('');
  const [categoryRevision, setCategoryRevision] = useState(0);
  const [loadedCategoryKey, setLoadedCategoryKey] = useState('');
  const categoriesLoading = loadedCategoryKey !== `${size}:${categoryRevision}`;
  const previewUrls = useRef(new Set());

  useEffect(() => {
    const urls = previewUrls.current;
    return () => { for (const url of urls) URL.revokeObjectURL(url); };
  }, []);

  // Fetch categories when size changes
  useEffect(() => {
    if (isAuthenticated) {
      const controller = new AbortController();
      fetch(`/admin/api/add-tiles?size=${size}`, {
        headers: { 'Authorization': secret }, signal: controller.signal,
      })
        .then(res => res.json())
        .then(data => {
          if (controller.signal.aborted) return;
          if (data.success) {
            setCategoryError('');
            setCategories(data.categories);
            setCategory(data.categories[0] || '');
            setLoadedCategoryKey(`${size}:${categoryRevision}`);
          } else throw new Error(data.error || 'Categories could not be loaded.');
        })
        .catch(err => {
          if (controller.signal.aborted) return;
          setCategoryError(err.message);
          setCategories([]);
          setCategory('');
          setLoadedCategoryKey(`${size}:${categoryRevision}`);
        });
      return () => controller.abort();
    }
  }, [size, isAuthenticated, secret, categoryRevision]);

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

  const handleFileChange = (e) => {
    if (isUploading) return;
    const selectedFiles = Array.from(e.target.files);
    const newFileObjects = selectedFiles.map(file => {
      const preview = URL.createObjectURL(file);
      previewUrls.current.add(preview);
      return { file, preview, filename: file.name.replace(/\.[^.]+$/, '') };
    });
    setFiles(prev => [...prev, ...newFileObjects]);
    // Reset file input
    e.target.value = null;
  };

  const removeFile = (index) => {
    if (isUploading) return;
    const removed = files[index];
    if (removed) { URL.revokeObjectURL(removed.preview); previewUrls.current.delete(removed.preview); }
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateFilename = (index, newName) => {
    if (isUploading) return;
    setFiles(prev => prev.map((item, itemIndex) => itemIndex === index ? { ...item, filename: newName } : item));
  };

  const handleUpload = async () => {
    if (files.length === 0 || isUploading) return;
    
    const finalCategory = isNewCategory ? newCategoryName : category;
    if (!finalCategory.trim()) {
      alert("Please select or enter a category.");
      return;
    }
    try {
      for (const item of files) validateTileUpload({ size, category: finalCategory, filename: item.filename, file: item.file });
    } catch (error) { alert(error.message); return; }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResults({ success: 0, failed: 0, logs: [] });

    let successCount = 0;
    let failedCount = 0;
    const logs = [];
    const successfulPreviews = new Set();

    for (let i = 0; i < files.length; i++) {
      const fileObj = files[i];
      const formData = new FormData();
      formData.append('secret', secret);
      formData.append('size', size);
      formData.append('category', finalCategory.trim());
      formData.append('filename', fileObj.filename.trim());
      formData.append('file', fileObj.file);

      try {
        const res = await fetch('/admin/api/add-tiles', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        if (data.success) {
          successCount++;
          successfulPreviews.add(fileObj.preview);
          logs.push({ file: fileObj.filename, status: 'SUCCESS' });
        } else {
          failedCount++;
          logs.push({ file: fileObj.filename, status: 'FAILED', reason: [data.error, data.cleanup?.error, data.cleanup?.assetId].filter(Boolean).join(' ') });
        }
      } catch (err) {
        failedCount++;
        logs.push({ file: fileObj.filename, status: 'FAILED', reason: err.message });
      }
      
      setUploadProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setUploadResults({ success: successCount, failed: failedCount, logs });
    setIsUploading(false);
    if (successCount) setCategoryRevision(value => value + 1);
    
    // Leave only failed files selected so a retry cannot duplicate saved tiles.
    for (const preview of successfulPreviews) {
      URL.revokeObjectURL(preview);
      previewUrls.current.delete(preview);
    }
    setFiles(prev => prev.filter(item => !successfulPreviews.has(item.preview)));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-surface-container p-8 rounded-2xl max-w-md w-full border border-outline-variant/30 shadow-2xl">
          <h1 className="text-3xl font-display-xl mb-6 text-on-surface">Add Tiles Auth</h1>
          <p className="text-on-surface-variant mb-6 text-sm">Please enter the ADMIN_SECRET to access the manual upload tool.</p>
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
    <div className="min-h-screen p-8 max-w-5xl mx-auto space-y-8 pt-32 pb-32">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display-xl text-on-surface mb-2">Manual Tile Upload</h1>
          <p className="text-on-surface-variant">Upload new tiles directly to Cloudinary and Supabase.</p>
        </div>
        <Link href="/admin/bulk-migrate" className="text-primary hover:underline font-body-md text-sm">
          Go to Bulk Migrate &rarr;
        </Link>
      </div>

      <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/30 shadow-xl space-y-8">
        
        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-outline-variant/30">
          <div>
            <label htmlFor="upload-size" className="block text-on-surface-variant text-sm uppercase tracking-wider mb-2 font-medium">Size</label>
            <select 
              id="upload-size"
              value={size}
              disabled={isUploading}
              onChange={(e) => { setSize(e.target.value); setCategories([]); setCategory(''); }}
              className="w-full bg-surface border border-outline-variant rounded-xl p-4 text-on-surface focus:outline-none focus:border-primary-container"
            >
              <option value="12x12">12x12</option>
              <option value="16x16">16x16</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label htmlFor="upload-category" className="block text-on-surface-variant text-sm uppercase tracking-wider font-medium">Category</label>
              <label className="flex items-center gap-2 text-sm text-primary cursor-pointer">
                <input type="checkbox" disabled={isUploading} checked={isNewCategory} onChange={(e) => setIsNewCategory(e.target.checked)} className="accent-primary" />
                Add New Category
              </label>
            </div>
            
            {isNewCategory ? (
              <input 
                id="upload-category"
                type="text" 
                value={newCategoryName}
                disabled={isUploading}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. WOOD-SERIES"
                className="w-full bg-surface border border-outline-variant rounded-xl p-4 text-on-surface focus:outline-none focus:border-primary-container"
              />
            ) : (
              <select 
                id="upload-category"
                value={category}
                disabled={isUploading || categoriesLoading || Boolean(categoryError)}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-xl p-4 text-on-surface focus:outline-none focus:border-primary-container"
              >
                {(categoriesLoading || categoryError || categories.length === 0) && <option value="" disabled>{categoriesLoading ? 'Loading categories…' : categoryError ? 'Categories unavailable' : 'No categories found'}</option>}
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        {categoryError && <p role="alert" className="text-red-400">{categoryError} <button type="button" className="underline" onClick={() => setCategoryRevision(value => value + 1)}>Retry categories</button></p>}

        {/* File Picker */}
        <div>
          <label className="block text-on-surface-variant text-sm uppercase tracking-wider mb-4 font-medium">Images</label>
          
          <div className="border-2 border-dashed border-outline-variant rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer relative">
            <input 
              type="file" 
              multiple 
              accept="image/jpeg,image/png,image/webp,image/avif"
              disabled={isUploading}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-on-surface-variant">
              <span className="text-primary font-bold">Click to browse</span> or drag and drop files here.
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            {files.map((fileObj, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-outline-variant/30">
                <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden shrink-0">
                  <Image src={fileObj.preview} alt={`${fileObj.filename} preview`} width={64} height={64} unoptimized className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant mb-1 block">Design name</label>
                  <input 
                    type="text"
                    value={fileObj.filename}
                    disabled={isUploading}
                    onChange={(e) => updateFilename(idx, e.target.value)}
                    className="w-full bg-transparent border-b border-outline-variant focus:border-primary text-on-surface py-1 outline-none font-mono"
                  />
                </div>
                <button 
                  onClick={() => removeFile(idx)}
                  disabled={isUploading}
                  aria-label={`Remove ${fileObj.filename}`}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Action */}
        <div className="pt-6 border-t border-outline-variant/30 flex justify-between items-center">
          <div className="text-on-surface-variant">
            {files.length} file(s) selected
          </div>
          <button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="bg-primary-container text-[#17130b] font-bold py-3 px-8 rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Tiles'}
          </button>
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-container transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {/* Results */}
        {(uploadResults.success > 0 || uploadResults.failed > 0) && !isUploading && (
          <div className="mt-8 bg-surface border border-outline-variant rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-on-surface">Upload Summary</h3>
            <div className="flex gap-4 mb-4">
              <span className="text-green-400 font-bold">{uploadResults.success} Successful</span>
              <span className="text-red-400 font-bold">{uploadResults.failed} Failed</span>
            </div>
            
            {uploadResults.logs.length > 0 && (
              <div className="max-h-64 overflow-y-auto bg-surface-container rounded-lg border border-white/5">
                {uploadResults.logs.map((log, idx) => (
                  <div key={idx} className="p-3 border-b border-white/5 last:border-0 text-sm">
                    <span className="font-mono">{log.file}</span>: 
                    <span className={log.status === 'SUCCESS' ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                      {log.status} {log.reason && `(${log.reason})`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
