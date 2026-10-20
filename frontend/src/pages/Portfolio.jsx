import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, Sparkles, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { videoService } from '../services/videoService';
import { metadataService } from '../services/metadataService';
import { ReelCard } from '../components/common/ReelCard';
import AOS from 'aos';

export const Portfolio = ({ onOpenAuth }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const activeCategory = searchParams.get('category') || '';
  const activeQuery = searchParams.get('q') || '';
  const activePage = parseInt(searchParams.get('page') || '1', 10);
  const [searchDraft, setSearchDraft] = useState(activeQuery);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await metadataService.getCategories();
        setCategories(res.categories || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      try {
        const res = await videoService.getVideos({
          category_id: activeCategory,
          q: activeQuery,
          page: activePage,
          per_page: 12
        });
        setVideos(res.videos || []);
        setPagination(res.pagination || {});
      } catch (err) {
        console.error('Failed to load videos', err);
      } finally {
        setLoading(false);
        // Refresh AOS scroll positions for freshly rendered items
        setTimeout(() => {
          AOS.refresh();
        }, 150);
      }
    };

    loadVideos();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory, activeQuery, activePage]);

  const handleCategorySelect = (slugOrId) => {
    const newParams = new URLSearchParams(searchParams);
    if (slugOrId) {
      newParams.set('category', slugOrId);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchDraft.trim()) {
      newParams.set('q', searchDraft.trim());
    } else {
      newParams.delete('q');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <>
      <Helmet>
        <title>Portfolio & Reels Gallery | MRD CINEMA EDITZ</title>
        <meta name="description" content="Browse full video portfolio: viral Instagram reels, commercial ads, color grading before/after, and music video teasers by MRD." />
      </Helmet>

      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-x-clip">
        {/* Header Title */}
        <div 
          className="text-center max-w-3xl mx-auto mb-12"
          data-aos="fade-down"
          data-aos-duration="850"
          data-aos-once="true"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121216] border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Creative Works</span>
          </div>
          <h1 className="font-cinematic font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
            REELS & VIDEO <span className="text-red-gradient">PORTFOLIO</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Filter through viral vertical reels, 4K commercial showcases, and specialized cinematic cuts.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, category, or style..."
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              className="w-full pl-11 pr-24 py-3 rounded-xl bg-[#121216] border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27]/30 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-red-gradient text-white font-semibold text-xs uppercase shadow-md shadow-red-600/30 hover:brightness-110 transition-all"
            >
              Search
            </button>
          </form>

          {/* Active Result Count */}
          <div className="text-xs text-zinc-400 font-mono-code">
            Showing <span className="text-red-400 font-bold">{videos.length}</span> videos
            {pagination.total_count && ` of ${pagination.total_count}`}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-3 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 text-[11px]">
            <Filter className="w-3.5 h-3.5 text-red-500" />
            <span>Filter by Occasion:</span>
          </span>
          {activeCategory && (
            <button
              onClick={() => handleCategorySelect('')}
              className="text-[11px] font-medium text-red-400 hover:text-white underline transition-colors"
            >
              Clear Selection
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
              !activeCategory
                ? 'bg-red-gradient text-white shadow-lg shadow-red-600/30 font-bold'
                : 'bg-[#121216] text-zinc-400 border border-zinc-800 hover:text-white hover:border-red-500/40'
            }`}
          >
            All Works
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === String(cat.id)
                  ? 'bg-red-gradient text-white shadow-lg shadow-red-600/30 font-bold'
                  : 'bg-[#121216] text-zinc-400 border border-zinc-800 hover:text-white hover:border-red-500/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Videos Stacked Vertically - Alternating Slide-In */}
        {loading ? (
          <div className="flex flex-col gap-10 sm:gap-14 max-w-xl mx-auto w-full">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-full aspect-[9/16] rounded-2xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-24 rounded-3xl bg-[#121216]/60 border border-[#24221C]">
            <Layers className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-lg text-white mb-1">No videos found</h3>
            <p className="text-zinc-400 text-sm">Try clearing your search query or selecting another category.</p>
            <button
              onClick={() => { setSearchDraft(''); handleCategorySelect(''); }}
              className="mt-4 px-5 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-white hover:bg-[#FF1E27] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <section className="portfolio-video-feed overflow-x-clip w-full max-w-xl mx-auto flex flex-col gap-10 sm:gap-14">
            {videos.map((video, idx) => {
              // Alternating slide direction:
              // Video 1 (idx 0) from left, Video 2 (idx 1) from right, Video 3 (idx 2) from left...
              const isSlideFromLeft = idx % 2 === 0;
              const animDirection = isSlideFromLeft ? 'fade-right' : 'fade-left';

              return (
                /* Static wrapper element: observed for autoplay, never transformed, fixed in layout */
                <div
                  key={video.id}
                  className="portfolio-video-item w-full relative min-w-0"
                >
                  {/* Inner animated element: performs the slide-in + fade */}
                  <div
                    className="portfolio-video-anim w-full"
                    data-aos={animDirection}
                    data-aos-duration="850"
                    data-aos-once="true"
                  >
                    <Link
                      to={`/portfolio/${video.slug || video.id}`}
                      className="block w-full min-w-0 select-none"
                    >
                      <ReelCard video={video} onOpenAuth={onOpenAuth} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Pagination Controls */}
        {pagination.total_pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-14">
            <button
              disabled={!pagination.prev_page}
              onClick={() => handlePageChange(pagination.prev_page)}
              className="p-2.5 rounded-xl bg-[#121216] border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-500/40 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono-code text-zinc-400 px-4">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <button
              disabled={!pagination.next_page}
              onClick={() => handlePageChange(pagination.next_page)}
              className="p-2.5 rounded-xl bg-[#121216] border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-500/40 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
