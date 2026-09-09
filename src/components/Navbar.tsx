'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cloud, PlusCircle, BookOpen, Layers, ShieldCheck, Share2, Search, Check } from 'lucide-react';
import AddArticleGuideModal from './AddArticleGuideModal';

export default function Navbar() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform duration-200">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                Cloud<span className="gradient-text">Notes</span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">Team Hub</span>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition"
            >
              All Notes
            </Link>
            <Link
              href="/#categories"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition"
            >
              Categories
            </Link>
            <Link
              href="/#featured"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition"
            >
              Exam Cheatsheets
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition"
              title="Copy link to share with your team"
            >
              {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{linkCopied ? 'Link Copied!' : 'Share Hub'}</span>
            </button>

            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 transition shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Note</span>
            </button>
          </div>
        </div>
      </header>

      <AddArticleGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </>
  );
}
