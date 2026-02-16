
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0511] text-slate-200">
      <header className="border-b border-purple-900/50 bg-[#1a101f]/80 backdrop-blur-md sticky top-0 z-50 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="font-gothic text-5xl md:text-7xl text-red-700 glow-crimson mb-2 tracking-wider">
            LoveBites
          </h1>
          <p className="italic text-purple-300/80 text-center text-sm md:text-base tracking-widest uppercase font-light">
            Advice for the Paranormal Lovelorn
          </p>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12">
        {children}
      </main>

      <footer className="border-t border-purple-900/30 bg-[#1a101f] py-8 px-4 text-center">
        <p className="text-purple-400/50 text-xs tracking-widest uppercase">
          &copy; 2024 LoveBites Publications &bull; Transylvania &amp; Beyond
        </p>
        <p className="text-purple-500/30 text-[10px] mt-2 italic">
          Disclaimer: LoveBites is not responsible for any dusting, exorcisms, or silver-related accidents resulting from this advice.
        </p>
      </footer>
    </div>
  );
};
