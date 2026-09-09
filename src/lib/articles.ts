import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { ArticleMeta, ArticleDetail, HeadingItem } from '@/types/article';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractHeadings(markdownContent: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = markdownContent.split('\n');

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);

    if (h2Match) {
      const text = h2Match[1].trim();
      headings.push({
        id: slugify(text),
        text,
        level: 2,
      });
    } else if (h3Match) {
      const text = h3Match[1].trim();
      headings.push({
        id: slugify(text),
        text,
        level: 3,
      });
    }
  }

  return headings;
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const allArticlesData = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const readStats = readingTime(content);

      return {
        slug,
        title: data.title || slug.replace(/-/g, ' '),
        description: data.description || '',
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '2026-09-09',
        author: data.author || 'Akhil',
        category: data.category || 'AWS',
        tags: Array.isArray(data.tags) ? data.tags : [],
        level: data.level || 'Intermediate',
        readingTime: data.readingTime || readStats.text,
        featured: Boolean(data.featured),
      } as ArticleMeta;
    });

  // Sort articles by date descending
  return allArticlesData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedArticles(): ArticleMeta[] {
  const articles = getAllArticles();
  const featured = articles.filter((art) => art.featured);
  return featured.length > 0 ? featured : articles.slice(0, 3);
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const mdPath = path.join(articlesDirectory, `${slug}.md`);
  const mdxPath = path.join(articlesDirectory, `${slug}.mdx`);
  
  let targetPath = '';
  if (fs.existsSync(mdPath)) {
    targetPath = mdPath;
  } else if (fs.existsSync(mdxPath)) {
    targetPath = mdxPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(targetPath, 'utf8');
  const { data, content } = matter(fileContents);
  const readStats = readingTime(content);
  const headings = extractHeadings(content);

  // Process markdown into HTML with custom heading IDs
  const processedContent = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(content);

  // Inject ID attributes into generated h2 and h3 elements for table of contents
  let contentHtml = processedContent.toString();
  contentHtml = contentHtml.replace(/<h([23])>(.*?)<\/h\1>/g, (match, level, text) => {
    // Strip inner HTML tags to create slug
    const cleanText = text.replace(/<[^>]+>/g, '');
    const id = slugify(cleanText);
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  return {
    slug,
    title: data.title || slug.replace(/-/g, ' '),
    description: data.description || '',
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : '2026-09-09',
    author: data.author || 'Akhil',
    category: data.category || 'AWS',
    tags: Array.isArray(data.tags) ? data.tags : [],
    level: data.level || 'Intermediate',
    readingTime: data.readingTime || readStats.text,
    featured: Boolean(data.featured),
    contentHtml,
    rawMarkdown: content,
    headings,
  };
}

export function getAllTags(): { name: string; count: number }[] {
  const articles = getAllArticles();
  const tagCounts: Record<string, number> = {};

  articles.forEach((art) => {
    art.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): { name: string; count: number }[] {
  const articles = getAllArticles();
  const categoryCounts: Record<string, number> = {};

  articles.forEach((art) => {
    if (art.category) {
      categoryCounts[art.category] = (categoryCounts[art.category] || 0) + 1;
    }
  });

  return Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getArticlesByTag(tag: string): ArticleMeta[] {
  const normalizedTag = tag.toLowerCase();
  return getAllArticles().filter((art) =>
    art.tags.some((t) => t.toLowerCase() === normalizedTag)
  );
}
