import React from 'react';
import { AdviceEntry } from '../types';

interface AdviceCardProps {
  entry: AdviceEntry;
}

export const AdviceCard: React.FC<AdviceCardProps> = ({ entry }) => {
  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('post', entry.id);
    navigator.clipboard.writeText(url.toString());
    alert('The link to this specific volume is now in your grasp.');
  };

  return (
    <article className="bg-[#110813] border border-red-950/30 rounded-3xl mb-24 shadow-[0_30px_60px_rgba(0,0,0,0.9)] relative overflow-hidden transition-all hover:border-red-900/30">
      <div className="p-10 md:p-20">
        <header className="mb-14">
          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col">
              <div className="h-[1px] w-16 bg-red-900/30" />
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleShare}
                className="font-romantic text-[9px] uppercase tracking-widest text-red-500/40 hover:text-red-400 transition-colors px-3 py-1.5 border border-red-900/10 rounded hover:bg-red-950/20"
              >
                Share
              </button>
            </div>
          </div>
          
          <h1 className="font-romantic text-5xl md:text-8xl text-slate-100 font-bold italic mb-10 leading-[1.1] glow-crimson tracking-tighter">
            {entry.postTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[10px] font-romantic uppercase tracking-[0.4em] text-red-900/50 pt-8 border-t border-red-900/10">
            <span className="text-red-700">Author: LoveBites</span>
            <span className="opacity-20">|</span>
            <span>{new Date(entry.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="opacity-20">|</span>
            <span className="italic text-red-600/30">Subject: {entry.creatureType}</span>
          </div>
        </header>

        <div className="space-y-20 animate-in fade-in duration-1000">
          <div className="relative">
            <span className="absolute -top-10 -left-6 text-9xl text-red-900/10 font-serif leading-none select-none">“</span>
            <div className="italic text-2xl md:text-4xl text-slate-300 leading-[1.6] border-l-2 border-red-900/20 pl-12 py-4 font-romantic">
              "{entry.question}"
              <p className="mt-8 font-script text-2xl text-red-600/30 not-italic">
                &mdash; {entry.senderName}
              </p>
            </div>
          </div>

          <div className="font-romantic text-2xl md:text-3xl text-slate-200 leading-[1.8] space-y-8 whitespace-pre-wrap selection:bg-red-900/60 first-letter:text-7xl first-letter:font-bold first-letter:text-red-700 first-letter:mr-4 first-letter:float-left first-letter:mt-2">
            {entry.advice}
          </div>
          
          <div className="pt-20 flex justify-center">
            <div className="text-red-900/10 text-3xl tracking-[1.5em] select-none">❦ ❦ ❦</div>
          </div>
        </div>
      </div>

      <div className="h-2 bg-gradient-to-r from-transparent via-red-950/20 to-transparent opacity-30" />
    </article>
  );
};