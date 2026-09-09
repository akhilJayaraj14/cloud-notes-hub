import React from 'react';
import Link from 'next/link';
import { ArticleMeta } from '@/types/article';
import { Clock, Calendar, ArrowRight, Tag, Bookmark } from 'lucide-react';

interface ArticleCardProps {
  article: ArticleMeta;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  AWS: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  GCP: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  Azure: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  Kubernetes: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
  DevOps: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  Terraform: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  Networking: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  Security: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  Storage: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
};

const levelColors: Record<string, string> = {
  Beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Intermediate: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  Advanced: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const catStyle = categoryColors[article.category] || categoryColors.AWS;
  const levelStyle = levelColors[article.level] || levelColors.Intermediate;

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl glass-panel p-6 hover:border-slate-600/80 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
            {article.category}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${levelStyle}`}>
              {article.level}
            </span>
          </div>
        </div>

        {/* Title & Link */}
        <Link href={`/articles/${article.slug}`}>
          <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors duration-200 line-clamp-2 leading-snug">
            {article.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-2.5 text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {article.description}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-slate-400 bg-slate-800/70 border border-slate-700/60 px-2 py-0.5 rounded-md flex items-center gap-1"
              >
                #{tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-[11px] text-slate-500 px-1 py-0.5">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {article.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {article.readingTime}
          </span>
        </div>

        <Link
          href={`/articles/${article.slug}`}
          className="flex items-center gap-1 text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform"
          aria-label={`Read ${article.title}`}
        >
          <span>Read</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
