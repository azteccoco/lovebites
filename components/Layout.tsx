
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onToggleEditor?: () => void;
  showEditor?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, onToggleEditor, showEditor }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d040e] text-slate-200 selection:bg-red-900/40">
      <header className="border-b border-red-900/10 bg-[#0d040e]/95 sticky top-0 z-[60] py-10 px-4 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="w-10 h-10 hidden md:block"></div> {/* Spacer */}
          
          <div className="flex flex-col items-center">
            <h1 className="font-romantic text-6xl md:text-8xl text-red-700 glow-crimson italic font-bold tracking-tight">
              LoveBites
            </h1>
            <p className="mt-4 font-romantic italic text-white text-center text-xs md:text-sm tracking-[0.2em] md:tracking-[0.5em] uppercase font-light">
              Advice for the Paranormal Lovelorn
            </p>
          </div>

          <button 
            onClick={onToggleEditor}
            title="Open Writer's Desk"
            className={`p-3 rounded-full border transition-all duration-500 ${
              showEditor 
              ? 'border-red-600 bg-red-600/10 text-red-400' 
              : 'border-red-900/30 hover:border-red-600 text-red-900 hover:text-red-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-16 relative z-10">
        {children}
      </main>

      <footer className="border-t border-red-900/10 bg-[#0a030a] py-16 px-4 text-center">
        <div className="mb-8 flex justify-center gap-8 font-romantic text-[10px] text-red-800 uppercase tracking-[0.4em]">
          <a href="#" className="hover:text-red-500 transition-colors">Chronicles</a>
          <span>&bull;</span>
          <a href="#" className="hover:text-red-500 transition-colors">Editorial Policy</a>
          <span>&bull;</span>
          <a href="https://app.pagescms.org" target="_blank" rel="noopener" className="hover:text-red-500 transition-colors">CMS Access</a>
        </div>
        <p className="font-romantic text-red-900/30 text-[9px] tracking-[0.5em] uppercase">
          &copy; 1824 LoveBites &bull; Transylvania Central Ledger
        </p>
      </footer>
    </div>
  );
};
