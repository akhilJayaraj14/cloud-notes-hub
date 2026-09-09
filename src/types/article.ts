export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: 'AWS' | 'GCP' | 'Azure' | 'Kubernetes' | 'DevOps' | 'Terraform' | 'Networking' | 'Security' | 'Storage';
  tags: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  readingTime: string;
  featured?: boolean;
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export interface ArticleDetail extends ArticleMeta {
  contentHtml: string;
  rawMarkdown: string;
  headings: HeadingItem[];
}
