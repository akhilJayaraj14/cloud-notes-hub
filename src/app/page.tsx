import React from 'react';
import Link from 'next/link';
import { getAllArticles, getAllCategories, getAllTags, getFeaturedArticles } from '@/lib/articles';
import ArticleExplorer from '@/components/ArticleExplorer';
import ArticleCard from '@/components/ArticleCard';
import { Cloud, BookOpen, Layers, ShieldCheck, Sparkles, Terminal, ArrowRight, CheckCircle2, Cpu, Database, Network } from 'lucide-react';

export default function HomePage() {
  const allArticles = getAllArticles();
  const featuredArticles = getFeaturedArticles();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-800/80">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-500/15 via-indigo-500/10 to-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-300 shadow-md">
            <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Cloud Engineering & Certification Study Hub</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Master the Cloud with <span className="gradient-text">Curated Notes</span> & Team Architecture Guides
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A fast, markdown-powered knowledge base designed for cloud course revision, team onboarding, and certification prep across AWS, GCP, Kubernetes, and IaC.
          </p>

          {/* Quick Stat Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span><strong className="text-white">{allArticles.length}</strong> Study Notes</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span><strong className="text-white">{categories.length}</strong> Cloud Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span><strong className="text-white">100%</strong> Free on Vercel</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section id="featured" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Featured Exam Cheatsheets & Guides
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Interactive Explorer (Search + Category Filter + Grid) */}
        <section id="categories" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                All Study Notes & Articles
              </h2>
            </div>
          </div>

          <ArticleExplorer
            initialArticles={allArticles}
            categories={categories}
            tags={tags}
          />
        </section>

        {/* Team Collaboration Banner */}
        <section className="rounded-3xl glass-panel p-8 sm:p-10 border border-sky-500/20 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/10 text-sky-400 text-xs font-semibold border border-sky-500/20">
              <Terminal className="w-3.5 h-3.5" />
              <span>Easy Markdown Publishing</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Want to share your notes with the rest of your team?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every note is just a plain <code className="text-sky-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">.md</code> file. Add notes directly into your repository, commit, and Vercel automatically deploys them for everyone on your team to study.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
