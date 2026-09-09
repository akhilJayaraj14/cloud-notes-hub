import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';
import TableOfContents from '@/components/TableOfContents';
import ArticleContent from '@/components/ArticleContent';
import ShareButtons from '@/components/ShareButtons';
import ArticleCard from '@/components/ArticleCard';
import { ChevronRight, Calendar, Clock, ArrowLeft, Bookmark, Tag, Sparkles, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | Cloud Study Hub`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = getAllArticles();
  const relatedArticles = allArticles
    .filter((art) => art.slug !== slug && (art.category === article.category || art.tags.some((t) => article.tags.includes(t))))
    .slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* Breadcrumbs and Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Notes</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-sky-400 font-medium">{article.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-300 truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
        </nav>

        <ShareButtons title={article.title} />
      </div>

      {/* Main Grid Layout: Article Content + Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Article Body (8 cols on large screens) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Metadata */}
          <header className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {article.category}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                Level: {article.level}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              {article.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 pb-6 border-b border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                {article.readingTime}
              </span>
              <span>•</span>
              <span>Author: {article.author}</span>
            </div>
          </header>

          {/* Article Rendered Content */}
          <ArticleContent contentHtml={article.contentHtml} slug={article.slug} />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-8 mt-8 border-t border-slate-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-sky-400" />
                <span>Related Tags</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Sidebar with Table of Contents (4 cols) */}
        <div className="hidden lg:block lg:col-span-4">
          <TableOfContents headings={article.headings} />
        </div>
      </div>

      {/* Related Study Notes */}
      {relatedArticles.length > 0 && (
        <section className="pt-16 border-t border-slate-800 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h3 className="text-lg font-bold text-white">Next Recommended Study Notes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.slug} article={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
