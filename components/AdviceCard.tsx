
import React, { useState } from 'react';
import { AdviceEntry } from '../types';

interface AdviceCardProps {
  entry: AdviceEntry;
}

export const AdviceCard: React.FC<AdviceCardProps> = ({ entry }) => {
  const [showTemplate, setShowTemplate] = useState(false);

  const jekyllTemplate = `---
layout: post
title: "${entry.postTitle}"
date: ${new Date(entry.timestamp).toISOString()}
author: LoveBites
creature: ${entry.creatureType}
pseudonym: ${entry.senderName}
category: Advice
---

## The Query
> "${entry.question}"
>
> — *Signed, ${entry.senderName}, a ${entry.creatureType}*

## LoveBites' Verdict
${entry.advice}
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jekyllTemplate);
    alert('Jekyll template copied to clipboard, darling.');
  };

  return (
    <article className="bg-[#1a101f] border border-red-900/10 rounded-xl mb-16 shadow-2xl relative overflow-hidden group">
      <div className="p-8 md:p-12">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-romantic text-sm uppercase tracking-[0.3em] text-red-500/60 font-bold italic">
              Column Entry #{entry.id.slice(0, 4)}
            </h2>
            <button 
              onClick={() => setShowTemplate(!showTemplate)}
              className="font-romantic text-[10px] uppercase tracking-widest text-purple-400 hover:text-purple-200 border border-purple-900/30 rounded px-2 py-1 transition-colors"
            >
              {showTemplate ? 'View Post' : 'View Jekyll Source'}
            </button>
          </div>
          
          <h1 className="font-romantic text-4xl md:text-5xl text-slate-100 font-bold italic mb-6 leading-tight">
            {entry.postTitle}
          </h1>

          <div className="flex items-center gap-4 text-xs font-romantic uppercase tracking-widest text-purple-400/60 mb-8 pb-4 border-b border-red-900/10">
            <span>By LoveBites</span>
            <span>&bull;</span>
            <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
            <span>&bull;</span>
            <span className="text-red-500/40 italic">{entry.creatureType}</span>
          </div>
        </div>

        {showTemplate ? (
          <div className="relative">
            <pre className="bg-[#0f0511] p-6 rounded-lg text-xs font-mono text-purple-300/80 overflow-x-auto border border-purple-900/20 mb-4 whitespace-pre-wrap">
              {jekyllTemplate}
            </pre>
            <button 
              onClick={copyToClipboard}
              className="w-full py-3 bg-purple-900/20 hover:bg-purple-900/40 text-purple-200 font-romantic text-xs uppercase tracking-widest rounded transition-colors"
            >
              Copy Jekyll Markdown
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="italic text-xl text-slate-300 leading-relaxed border-l-2 border-red-900/20 pl-8 py-2">
              "Dearest LoveBites, {entry.question}"
              <p className="mt-4 font-script text-lg text-purple-400/60 not-italic">
                &mdash; {entry.senderName}
              </p>
            </div>

            <div className="font-romantic text-xl text-slate-200 leading-relaxed space-y-4 whitespace-pre-wrap selection:bg-red-900/30">
              {entry.advice}
            </div>
          </div>
        )}
      </div>

      <div className="h-2 bg-gradient-to-r from-transparent via-red-900/20 to-transparent" />
    </article>
  );
};
