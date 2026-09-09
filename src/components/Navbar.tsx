'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cloud, PlusCircle, Share2, Check, Lock, ShieldCheck, User } from 'lucide-react';
import AddArticleGuideModal from './AddArticleGuideModal';
import AuthorAuthModal from './AuthorAuthModal';

export default function Navbar() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthorMode, setIsAuthorMode] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const isParamAuthor = urlParams.get('author') === 'akhil' || urlParams.get('admin') === 'true' || urlParams.get('author') === 'true';
      const storedAuthor = localStorage.getItem('cloud_hub_author_mode') === 'true';

      if (isParamAuthor || storedAuthor) {
        setIsAuthorMode(true);
        localStorage.setItem('cloud_hub_author_mode', 'true');
      }

      // Keyboard shortcut Ctrl+Shift+A or Cmd+Shift+A to toggle author modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
          e.preventDefault();
          setIsAuthModalOpen(true);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const logoutAuthor = () => {
    setIsAuthorMode(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cloud_hub_author_mode');
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
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">by Akhil</span>
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

            {/* Add Note button ONLY visible when Author Mode is active */}
            {isAuthorMode ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 transition shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Note</span>
                </button>
                <button
                  onClick={logoutAuthor}
                  title="Author mode active (Click to lock)"
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sky-400 border border-sky-500/30 text-xs transition flex items-center gap-1"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="hidden lg:inline text-[11px] font-medium text-emerald-400">Akhil (Author)</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                title="Author Login (Passcode: akhil)"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition"
                aria-label="Author Login"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <AddArticleGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <AuthorAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthorMode(true)}
      />
    </>
  );
}
