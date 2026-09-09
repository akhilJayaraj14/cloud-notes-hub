'use client';

import React, { useEffect, useState } from 'react';
import { HeadingItem } from '@/types/article';
import { ListCollapse, ChevronUp } from 'lucide-react';

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate overall page scroll progress
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }

      // Find current active heading
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[];

      const scrollPosition = window.scrollY + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(el.id);
          return;
        }
      }

      if (headingElements.length > 0 && window.scrollY < 200) {
        setActiveId(headingElements[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!headings || headings.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-24 space-y-4">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        {/* Progress header */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <ListCollapse className="w-4 h-4 text-sky-400" />
            <span>Table of Contents</span>
          </div>
          <span className="text-xs font-mono text-sky-400 font-semibold">
            {Math.round(scrollProgress)}% read
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
          <div
            className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Heading Links */}
        <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`block py-1.5 text-xs rounded-lg transition-all duration-150 ${
                  heading.level === 3 ? 'pl-4' : 'pl-2'
                } ${
                  isActive
                    ? 'text-sky-400 font-semibold bg-sky-500/10 border-l-2 border-sky-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {heading.text}
              </a>
            );
          })}
        </nav>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="mt-4 pt-3 w-full border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          <span>Back to Top</span>
        </button>
      </div>
    </aside>
  );
}
