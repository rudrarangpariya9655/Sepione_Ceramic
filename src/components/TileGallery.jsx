"use client";

import { useState, useRef, useEffect } from "react";
import TileCard from "./TileCard";
import TileModal from "./TileModal";
import styles from "./TileGallery.module.css";
import Link from "next/link";
import { motion } from "framer-motion";

import { getThumbnailUrl } from "@/lib/cloudinary-utils";

export default function TileGallery({ title, size, initialTiles = [], initialTotalCount = 0, availableCategories = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTile, setActiveTile] = useState(null);

  const [tiles, setTiles] = useState(initialTiles);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [visiblePage, setVisiblePage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);

  // Track if it's the initial render to avoid re-fetching on mount for search
  const isInitialMount = useRef(true);

  // Helper to format raw categories like "GREEN-SERIES" or "rock series" into "Green Series"
  const formatCategory = (raw) => {
    if (!raw) return "";
    return raw
      .split(/[-_ ]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // 1. Fetch Page 1 when Search or Category changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Set loading immediately to block pre-fetch effect
    setIsLoading(true);

    const fetchFirstPage = async () => {
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (size) queryParams.append('size', size);
        if (searchQuery) queryParams.append('search', searchQuery);
        if (selectedCategory && selectedCategory !== "All") queryParams.append('category', selectedCategory);
        queryParams.append('page', 1);
        queryParams.append('pageSize', 24);

        const url = `/api/tiles?${queryParams.toString()}`;
        const res = await fetch(url);
        const data = await res.json();

        if (res.ok && data.tiles) {
          setTiles(data.tiles);
          setTotalCount(data.totalCount || 0);
          setVisiblePage(1); // Reset visible page to 1
        } else {
          throw new Error(data.error || "Failed to fetch tiles.");
        }
      } catch (err) {
        console.error("Failed to fetch tiles:", err);
        setError(err.message || "A network error occurred while fetching tiles.");
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchFirstPage(), 300);
    return () => clearTimeout(timeoutId);
  }, [size, searchQuery, selectedCategory]);

  // 2. Pre-fetch the next page in the background
  useEffect(() => {
    const fetchNextPage = async () => {
      if (isFetchingMore || isLoading) return;
      // We need to fetch the next page if we haven't fetched it yet
      // tiles.length is how many we have. If it's less than totalCount, and we are at the edge of what's fetched
      if (tiles.length < totalCount && tiles.length <= visiblePage * 24) {
        setIsFetchingMore(true);
        const nextPageToFetch = Math.floor(tiles.length / 24) + 1;

        try {
          const queryParams = new URLSearchParams();
          if (size) queryParams.append('size', size);
          if (searchQuery) queryParams.append('search', searchQuery);
          if (selectedCategory && selectedCategory !== "All") queryParams.append('category', selectedCategory);
          queryParams.append('page', nextPageToFetch);
          queryParams.append('pageSize', 24);

          const res = await fetch(`/api/tiles?${queryParams.toString()}`);
          const data = await res.json();

          if (res.ok && data.tiles) {
            setTiles(prev => {
              // Ensure we don't duplicate if strict mode causes double fetch
              const existingIds = new Set(prev.map(t => t.id));
              const newTiles = data.tiles.filter(t => !existingIds.has(t.id));
              return [...prev, ...newTiles];
            });
            setTotalCount(data.totalCount || 0);
          }
        } catch (err) {
          console.error("Failed to prefetch next page:", err);
        } finally {
          setIsFetchingMore(false);
        }
      }
    };

    fetchNextPage();
  }, [tiles.length, visiblePage, totalCount, isFetchingMore, isLoading, size, searchQuery, selectedCategory]);

  const rawCategories = ["All", ...availableCategories];

  // The tiles we actually render are sliced up to the visible page
  const displayedTiles = tiles.slice(0, visiblePage * 24);
  const hasMore = displayedTiles.length < totalCount;

  return (
    <div className={styles.galleryPage}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/" className={styles.backLink}>&larr; Back to Home</Link>
          <h1 className={styles.pageTitle}>{title} Collection</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 bg-surface-container border border-outline-variant p-6 rounded-xl md:items-center justify-between">
          <input
            type="text"
            placeholder="Search tiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 max-w-[400px] px-5 py-3 rounded-lg border border-outline-variant bg-background text-on-surface font-body-md text-base focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all duration-300"
          />
          <div className="flex gap-2 flex-wrap">
            {rawCategories.map(rawCat => (
              <button
                key={rawCat}
                className={`border px-4 py-2 rounded-full cursor-pointer transition-all duration-300 font-body-md ${selectedCategory === rawCat
                    ? 'bg-primary-container text-[#17130b] border-primary-container font-medium'
                    : 'bg-background text-on-surface-variant border-outline-variant hover:border-primary-container hover:text-on-surface'
                  }`}
                onClick={() => setSelectedCategory(rawCat)}
              >
                {rawCat === "All" ? "All" : formatCategory(rawCat)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main>


        <div className={styles.grid}>
          {isLoading ? (
            <div className="col-span-full py-20 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-container"></div>
            </div>
          ) : error && tiles.length === 0 ? (
            <div className={styles.noResults}>
              <h2>Failed to load tiles</h2>
              <p className="text-red-400">{error}</p>
            </div>
          ) : displayedTiles.length > 0 ? (
            displayedTiles.map((tile, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: (i % 24) * 0.1, ease: "easeOut" }}
              >
                <TileCard tile={{
                  name: tile.filename,
                  category: formatCategory(tile.category),
                  image: getThumbnailUrl(tile.cloudinary_secure_url)
                }} onClick={() => setActiveTile({
                  name: tile.filename,
                  category: formatCategory(tile.category),
                  image: tile.cloudinary_secure_url // Keep full resolution for modal
                })} />
              </motion.div>
            ))
          ) : (
            <div className={styles.noResults}>
              <h2>No tiles found</h2>
              <p>Try adjusting your search or filter criteria, or check back later.</p>
            </div>
          )}
        </div>

        {hasMore && !isLoading && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => setVisiblePage(p => p + 1)}
              disabled={displayedTiles.length >= tiles.length && isFetchingMore}
              className="bg-primary-container text-[#17130b] font-body-md font-bold py-3 px-8 rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2 shadow-lg cursor-pointer"
            >
              {(displayedTiles.length >= tiles.length && isFetchingMore) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#17130b]"></div>
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </main>

      {activeTile && (
        <TileModal tile={activeTile} onClose={() => setActiveTile(null)} />
      )}
    </div>
  );
}
