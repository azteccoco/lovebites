
import React from 'react';
import { AdviceEntry } from '../types';

interface AdviceCardProps {
  entry: AdviceEntry;
}

export const AdviceCard: React.FC<AdviceCardProps> = ({ entry }) => {
  return (
    <article className="bg-[#1a101f] border border-purple-900/30 rounded-lg p-6 md:p-8 mb-8 shadow-2xl relative overflow-hidden group">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-red-900/10 transition-colors" />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-red-500 font-bold uppercase tracking-widest text-xs mb-1">
            The Query
          </h2>
          <p className="italic text-lg text-slate-300">
            "Dearest LoveBites, {entry.question}"
          </p>
        </div>
      </div>

      <div className="border-t border-purple-900/20 pt-6 mb-4">
        <p className="text-xs text-purple-400 mb-4 font-mono uppercase tracking-tighter">
          &mdash; Signed, <span className="text-purple-300 font-bold">{entry.senderName}</span>, a lonely <span className="text-purple-300">{entry.creatureType}</span>
        </p>
        
        <h3 className="font-gothic text-3xl text-red-700 mb-4 border-b border-red-900/20 inline-block pb-1">
          The Verdict
        </h3>
        
        <div className="text-slate-200 leading-relaxed text-lg space-y-4 whitespace-pre-wrap">
          {entry.advice}
        </div>
      </div>

      <div className="text-[10px] text-purple-500/50 flex justify-between mt-8 border-t border-purple-900/10 pt-4 italic">
        <span>Transcribed at the witching hour</span>
        <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
      </div>
    </article>
  );
};
