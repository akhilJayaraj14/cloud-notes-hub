import React from 'react';
import Link from 'next/link';
import { Cloud, Zap, CheckCircle2, ArrowUpRight, Heart, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20">
                <Cloud className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Cloud<span className="gradient-text">Notes</span>
                <span className="text-xs font-normal text-slate-400 ml-2">by Akhil</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Personal cloud engineering knowledge base and study notes authored by Akhil for cloud course revision and team sharing.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <Zap className="w-3.5 h-3.5" /> Vercel Ready
              </span>
              <span>•</span>
              <span>Author: Akhil</span>
              <span>•</span>
              <span>Markdown Driven</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-sky-400 transition">
                  AWS Architecture & Storage
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-sky-400 transition">
                  Kubernetes & Docker
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-sky-400 transition">
                  Google Cloud (GCP)
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-sky-400 transition">
                  Terraform & IaC
                </Link>
              </li>
            </ul>
          </div>

          {/* Deployment Tip */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Repository & Hosting
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Hosted on Vercel with automated CI/CD from GitHub.
            </p>
            <a
              href="https://github.com/akhilJayaraj14/cloud-notes-hub"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition"
            >
              <span>View on GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Cloud Study Notes Hub • Authored by <strong>Akhil</strong></p>
          <p className="flex items-center gap-1.5 text-slate-400">
            Crafted for Cloud Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
