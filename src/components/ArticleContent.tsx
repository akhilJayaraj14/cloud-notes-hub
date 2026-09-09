'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Copy, Check, Share2, BookCheck } from 'lucide-react';

interface ArticleContentProps {
  contentHtml: string;
  slug: string;
}

export default function ArticleContent({ contentHtml, slug }: ArticleContentProps) {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    // Load completion state from local storage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`study_completed_${slug}`);
      if (stored === 'true') {
        setIsCompleted(true);
      }
    }

    // Enhance pre code blocks with copy buttons
    const codeBlocks = document.querySelectorAll('.prose-cloud pre');
    codeBlocks.forEach((block) => {
      if (block.querySelector('.copy-code-btn')) return;

      const button = document.createElement('button');
      button.className = 'copy-code-btn absolute top-3 right-3 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700 flex items-center gap-1 transition opacity-80 hover:opacity-100';
      button.innerHTML = '<span>Copy</span>';

      button.addEventListener('click', () => {
        const codeText = block.querySelector('code')?.innerText || block.textContent || '';
        navigator.clipboard.writeText(codeText.replace(/^Copy\n?/, ''));
        button.innerHTML = '<span class="text-emerald-400">Copied!</span>';
        setTimeout(() => {
          button.innerHTML = '<span>Copy</span>';
        }, 2000);
      });

      (block as HTMLElement).style.position = 'relative';
      block.appendChild(button);
    });
  }, [contentHtml, slug]);

  const toggleCompleted = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`study_completed_${slug}`, String(nextState));
    }
  };

  return (
    <div className="space-y-8">
      {/* Completion tracker pill */}
      <div className="flex items-center justify-between p-4 rounded-xl glass-panel border border-slate-800">
        <div className="flex items-center gap-3">
          <BookCheck className="w-5 h-5 text-sky-400" />
          <div>
            <p className="text-sm font-semibold text-white">Study Progress</p>
            <p className="text-xs text-slate-400">Mark this module as reviewed for your cloud exam/team prep</p>
          </div>
        </div>

        <button
          onClick={toggleCompleted}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-slate-400" />}
          <span>{isCompleted ? 'Completed' : 'Mark as Studied'}</span>
        </button>
      </div>

      {/* Main HTML Content */}
      <div
        className="prose-cloud w-full"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
