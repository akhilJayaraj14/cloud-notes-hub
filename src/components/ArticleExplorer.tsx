'use client';

import React, { useState, useMemo } from 'react';
import { ArticleMeta } from '@/types/article';
import ArticleCard from './ArticleCard';
import { Search, Filter, Layers, Sparkles, BookOpen, X } from 'lucide-react';

interface ArticleExplorerProps {
  initialArticles: ArticleMeta[];
  categories: { name: string; count: number }[];
  tags: { name: string; count: number }[];
}

export default function ArticleExplorer({ initialArticles, categories, tags }: ArticleExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((art) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        art.title.toLowerCase().includes(query) ||
        art.description.toLowerCase().includes(query) ||
        art.tags.some((t) => t.toLowerCase().includes(query)) ||
        art.category.toLowerCase().includes(query);

      // Category match
      const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;

      // Level match
      const matchesLevel = selectedLevel === 'All' || art.level === selectedLevel;

      // Tag match
      const matchesTag = selectedTag === 'All' || art.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesCategory && matchesLevel && matchesTag;
    });
  }, [initialArticles, searchQuery, selectedCategory, selectedLevel, selectedTag]);

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedLevel !== 'All' ? 1 : 0) +
    (selectedTag !== 'All' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSelectedTag('All');
  };

  return (
    <section className="w-full space-y-8" id="articles-explorer">
      {/* Search and Filter Controls */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search across articles, commands, architectures, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-sky-500 transition cursor-pointer"
            >
              <option value="All">All Difficulty Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`text-xs font-semibold px-4 py-2 rounded-xl transition whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/70 border border-slate-700/50'
            }`}
          >
            All Topics ({initialArticles.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                selectedCategory === cat.name
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/70 border border-slate-700/50'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === cat.name ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700/50 text-slate-400'}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
            <div className="flex items-center gap-2 flex-wrap">
              <span>Filtering by:</span>
              {searchQuery && (
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedLevel !== 'All' && (
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Level: {selectedLevel}
                </span>
              )}
              {selectedTag !== 'All' && (
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Tag: #{selectedTag}
                </span>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="text-sky-400 hover:text-sky-300 font-medium underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="glass-panel text-center py-16 px-4 rounded-2xl border border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4 stroke-1" />
          <h3 className="text-lg font-bold text-white mb-2">No matching study notes found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Try adjusting your search query or reset your active filters to see all available cloud articles.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-xl transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}
