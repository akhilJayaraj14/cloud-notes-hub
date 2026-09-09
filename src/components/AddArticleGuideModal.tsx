'use client';

import React, { useState } from 'react';
import { X, Copy, Check, FileText, UploadCloud, Terminal } from 'lucide-react';

interface AddArticleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddArticleGuideModal({ isOpen, onClose }: AddArticleGuideModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sampleTemplate = `---
title: "Your Cloud Article Title Here"
description: "A short 1-2 sentence overview of what this article/study note covers."
date: "${new Date().toISOString().split('T')[0]}"
author: "Your Name / Team"
category: "AWS" # Choose: AWS, GCP, Azure, Kubernetes, DevOps, Terraform, Networking, Security
tags: ["AWS", "VPC", "Exam-Prep"]
level: "Intermediate" # Choose: Beginner, Intermediate, Advanced
featured: false
---

## Overview

Write your cloud notes here! You can use standard Markdown.

### Key Concepts
- Concept 1
- Concept 2

\`\`\`bash
# Run cloud CLI commands
aws s3 ls
\`\`\`
`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(sampleTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">How to Add Articles & Notes</h2>
            <p className="text-sm text-slate-400">Zero database setup required — powered by Markdown</p>
          </div>
        </div>

        <div className="space-y-6 mt-6 text-sm text-slate-300">
          <div className="flex gap-3 items-start p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-semibold text-white">Create a Markdown file</p>
              <p className="text-slate-400 mt-1">
                Add a new file in <code className="text-sky-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">content/articles/your-topic-name.md</code>
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">Paste frontmatter metadata</p>
                <button
                  onClick={copyTemplate}
                  className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 px-2.5 py-1 bg-sky-500/10 rounded-md border border-sky-500/20 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Template'}
                </button>
              </div>
              <pre className="mt-2.5 p-3 rounded-lg bg-slate-950 text-slate-300 text-xs font-mono overflow-x-auto border border-slate-800">
                {sampleTemplate}
              </pre>
            </div>
          </div>

          <div className="flex gap-3 items-start p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="font-semibold text-white">Push to GitHub / Deploy to Vercel</p>
              <p className="text-slate-400 mt-1">
                Whenever you push to GitHub, Vercel automatically rebuilds and deploys your new notes in seconds.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition shadow-lg shadow-sky-500/20"
          >
            Got it, Let's Read
          </button>
        </div>
      </div>
    </div>
  );
}
