"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TileCard from "./TileCard";
import TileModal from "./TileModal";
import { getThumbnailUrl } from "@/lib/cloudinary-utils";
import styles from "./TileGallery.module.css";

const PAGE_SIZE = 24;

function formatCategory(value) {
  return String(value || "Tile collection")
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

async function fetchTiles({ size, search, category, page, signal }) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
  if (size) params.set("size", size);
  if (search.trim()) params.set("search", search.trim());
  if (category !== "All") params.set("category", category);

  const response = await fetch(`/api/tiles?${params}`, { signal });
  const data = await response.json();
  if (!response.ok || !Array.isArray(data.tiles)) {
    throw new Error(data.error || "The collection could not be loaded. Please try again.");
  }
  return { tiles: data.tiles, totalCount: Math.max(0, Number(data.totalCount) || 0) };
}

// A new size starts a fresh collection, including its search and pagination state.
export default function TileGallery(props) {
  return <GalleryContent key={props.size || "all"} {...props} />;
}

function GalleryContent({ title, size, initialTiles = [], initialTotalCount = 0, availableCategories = [], initialError = null, initialCategoryError = null }) {
  const [categoryList, setCategoryList] = useState(availableCategories);
  const [categoryError, setCategoryError] = useState(initialCategoryError);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const categoryRequest = useRef(null);
  const [filters, setFilters] = useState({ search: "", category: "All", revision: 0 });
  const [tiles, setTiles] = useState(initialTiles);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(initialError);
  const [moreError, setMoreError] = useState(null);
  const [activeTile, setActiveTile] = useState(null);
  const requestRef = useRef(null);

  async function retryCategories() {
    categoryRequest.current?.abort();
    const controller = new AbortController();
    categoryRequest.current = controller;
    setCategoriesLoading(true);
    try {
      const response = await fetch(`/api/categories?size=${encodeURIComponent(size)}`, { signal: controller.signal });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Collections could not be loaded. Please try again.');
      if (!controller.signal.aborted) { setCategoryList(data.categories); setCategoryError(null); }
    } catch (error) {
      if (!controller.signal.aborted) setCategoryError(error.message);
    } finally {
      if (!controller.signal.aborted) setCategoriesLoading(false);
    }
  }

  useEffect(() => () => categoryRequest.current?.abort(), []);

  function changeFilters(nextFilters) {
    requestRef.current?.abort();
    setFilters((current) => ({ ...current, ...nextFilters, revision: current.revision + 1 }));
    setTiles([]);
    setTotalCount(0);
    setPage(1);
    setError(null);
    setMoreError(null);
    setIsLoading(true);
    setIsFetchingMore(false);
  }

  useEffect(() => {
    if (filters.revision === 0) return;
    const controller = new AbortController();
    requestRef.current = controller;
    const timer = setTimeout(async () => {
      try {
        const result = await fetchTiles({ size, ...filters, page: 1, signal: controller.signal });
        if (controller.signal.aborted) return;
        setTiles(result.tiles);
        setTotalCount(result.totalCount);
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(cause.message || "The collection could not be loaded. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          requestRef.current = null;
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters, size]);

  useEffect(() => () => requestRef.current?.abort(), []);

  async function loadMore() {
    // The ref also blocks a second click before React has rendered the disabled state.
    if (requestRef.current || isLoading || tiles.length >= totalCount) return;
    const controller = new AbortController();
    requestRef.current = controller;
    setIsFetchingMore(true);
    setMoreError(null);
    try {
      const result = await fetchTiles({ size, ...filters, page: page + 1, signal: controller.signal });
      if (controller.signal.aborted) return;
      const existing = new Set(tiles.map((tile) => tile.id || tile.cloudinary_secure_url));
      const additions = result.tiles.filter((tile) => !existing.has(tile.id || tile.cloudinary_secure_url));
      if (!additions.length && tiles.length < result.totalCount) {
        throw new Error("The collection has changed. Refresh the results to continue browsing.");
      }
      setTiles((current) => [...current, ...additions]);
      setTotalCount(result.totalCount);
      setPage((current) => current + 1);
    } catch (cause) {
      if (!controller.signal.aborted) setMoreError(cause.message || "More tiles could not be loaded. Please try again.");
    } finally {
      if (!controller.signal.aborted) {
        requestRef.current = null;
        setIsFetchingMore(false);
      }
    }
  }

  const categories = ["All", ...new Set(categoryList.filter((category) => category && category !== "All"))];
  const hasFilters = filters.search !== "" || filters.category !== "All";

  return (
    <div className={styles.galleryPage}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Back to home</Link>
        <div className={styles.headerTop}>
          <div>
            <p className={styles.eyebrow}>The tile edit</p>
            <h1 className={styles.pageTitle}>{title} Collection</h1>
          </div>
          <p className={styles.intro}>Explore the textures, tones and patterns that bring your next space to life.</p>
        </div>
        <div className={styles.controls}>
          <label className={styles.searchLabel}>
            <span>Find a design</span>
            <input
              type="search"
              placeholder="Search by tile name…"
              value={filters.search}
              maxLength={100}
              onChange={(event) => changeFilters({ search: event.target.value })}
              className={styles.searchInput}
            />
          </label>
          <div className={styles.filterSection}>
            <span className={styles.filterLabel}>Browse collections</span>
            {categoryError && <p role="alert" className={styles.errorMessage}>{categoryError} <button type="button" disabled={categoriesLoading} className={styles.textButton} onClick={retryCategories}>{categoriesLoading ? 'Loading collections…' : 'Retry collections'}</button></p>}
            <div className={styles.filterGroup} role="group" aria-label="Filter by collection">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`${styles.filterBtn} ${filters.category === category ? styles.activeFilter : ""}`}
                  aria-pressed={filters.category === category}
                  onClick={() => { if (filters.category !== category) changeFilters({ category }); }}
                >
                  {category === "All" ? "All designs" : formatCategory(category)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section aria-label="Tile designs" aria-busy={isLoading || isFetchingMore}>
        <div className={styles.resultsBar}>
          <p role="status" aria-live="polite">
            {isLoading ? "Finding your designs…" : error ? "Collection unavailable" : `${tiles.length} of ${totalCount} designs`}
          </p>
          {hasFilters && <button type="button" className={styles.textButton} onClick={() => changeFilters({ search: "", category: "All" })}>Clear filters</button>}
        </div>
        <div className={styles.grid}>
          {isLoading ? (
            Array.from({ length: 8 }, (_, index) => <div key={index} className={styles.skeleton} aria-hidden="true" />)
          ) : error ? (
            <div className={styles.noResults} role="alert">
              <h2>We couldn’t load this collection.</h2>
              <p>{error}</p>
              <button type="button" className={styles.actionButton} onClick={() => changeFilters({})}>Try again</button>
            </div>
          ) : tiles.length ? (
            tiles.map((tile) => {
              const product = {
                name: (tile.filename || "Tile design").replace(/\.[a-z0-9]+$/i, ""),
                category: formatCategory(tile.category),
                size: tile.size || size,
                image: tile.cloudinary_secure_url,
              };
              return <TileCard key={tile.id || tile.cloudinary_secure_url} tile={{ ...product, image: getThumbnailUrl(product.image) }} onClick={() => setActiveTile(product)} />;
            })
          ) : (
            <div className={styles.noResults}>
              <h2>{hasFilters ? "No matching designs" : "New designs are on their way"}</h2>
              <p>{hasFilters ? "Try a different tile name or browse all collections." : "Contact our team to explore the latest available tile collections."}</p>
              {hasFilters ? <button type="button" className={styles.actionButton} onClick={() => changeFilters({ search: "", category: "All" })}>Browse all designs</button> : <Link className={styles.actionButton} href="/#contact">Contact our team</Link>}
            </div>
          )}
        </div>

        {!isLoading && !error && tiles.length < totalCount && (
          <div className={styles.loadMore}>
            {moreError && <p className={styles.errorMessage} role="alert">{moreError}</p>}
            <button type="button" onClick={loadMore} disabled={isFetchingMore} className={styles.actionButton}>
              {isFetchingMore ? "Loading designs…" : moreError ? "Try loading more again" : "Discover more designs"}
            </button>
            {moreError && <button type="button" className={styles.textButton} onClick={() => changeFilters({})}>Refresh results</button>}
          </div>
        )}
      </section>
      {activeTile && <TileModal tile={activeTile} onClose={() => setActiveTile(null)} />}
    </div>
  );
}
