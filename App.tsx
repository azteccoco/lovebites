
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AdviceCard } from './components/AdviceCard';
import { CreatureType, AdviceEntry } from './types';
import { getParanormalAdvice } from './services/geminiService';

const INITIAL_ADVICE: AdviceEntry[] = [
  {
    id: '1',
    timestamp: Date.now() - 86400000,
    creatureType: 'Vampire',
    senderName: 'Dusty_in_Denver',
    postTitle: 'The Garlic Bread Dilemma',
    question: 'I fell for a mortal who loves garlic bread. Do I tell her the truth or just keep wearing a mask to dinner?',
    advice: "My dear nocturnal friend, deception is a fragile foundation for any romance, especially one involving high-carb Italian appetizers. You cannot spend eternity in a respirator. Tell her the truth. If she truly loves you, she'll switch to pesto. If not, well, there are plenty of other necks in the sea. And please, do check your cape for crumbs before you leave."
  }
];

const App: React.FC = () => {
  const [entries, setEntries] = useState<AdviceEntry[]>(() => {
    const saved = localStorage.getItem('lovebites_archive');
    return saved ? JSON.parse(saved) : INITIAL_ADVICE;
  });
  
  const [showEditor, setShowEditor] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);

  const [draft, setDraft] = useState({
    senderName: '',
    creatureType: CreatureType.Vampire,
    question: ''
  });

  // Handle Routing via Query Params (GitHub Pages friendly)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get('post');
    if (postSlug) {
      setCurrentSlug(postSlug);
      fetchExternalPost(postSlug);
    } else {
      setCurrentSlug(null);
    }
  }, [window.location.search]);

  useEffect(() => {
    localStorage.setItem('lovebites_archive', JSON.stringify(entries));
  }, [entries]);

  const fetchExternalPost = async (slug: string) => {
    setLoadingPost(true);
    try {
      // PagesCMS usually saves to a 'posts' or '_posts' directory
      // We try to fetch the raw markdown file from the relative path
      const response = await fetch(`./posts/${slug}.md`);
      if (!response.ok) throw new Error("Post not found");
      const text = await response.text();
      
      // Basic Frontmatter & Content Parsing
      const fmMatch = text.match(/---([\s\S]*?)---([\s\S]*)/);
      if (fmMatch) {
        const fm = fmMatch[1];
        const content = fmMatch[2];
        const getVal = (key: string) => fm.match(new RegExp(`${key}:\\s*["']?(.*?)["']?\\n`))?.[1] || 'Unknown';
        
        const queryMatch = content.match(/## The Query\n>\s*"(.*?)"/);
        const adviceMatch = content.match(/## LoveBites' Verdict\n([\s\S]*)/);

        const newEntry: AdviceEntry = {
          id: slug,
          timestamp: new Date(getVal('date')).getTime() || Date.now(),
          creatureType: getVal('creature'),
          senderName: getVal('pseudonym'),
          postTitle: getVal('title'),
          question: queryMatch?.[1] || 'Question missing...',
          advice: adviceMatch?.[1].trim() || 'Advice missing...'
        };

        // Add to entries if not already there to prevent duplicates
        setEntries(prev => {
          if (prev.find(e => e.id === slug)) return prev;
          return [newEntry, ...prev];
        });
      }
    } catch (error) {
      console.warn("Could not fetch remote post. It may not be published yet.", error);
    } finally {
      setLoadingPost(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.question || !draft.senderName) return;

    setIsGenerating(true);
    try {
      const { advice, postTitle } = await getParanormalAdvice(
        draft.creatureType,
        draft.senderName,
        draft.question
      );

      const newEntry: AdviceEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        creatureType: draft.creatureType,
        senderName: draft.senderName,
        postTitle: postTitle,
        question: draft.question,
        advice: advice
      };

      setEntries(prev => [newEntry, ...prev]);
      setDraft({ senderName: '', creatureType: CreatureType.Vampire, question: '' });
      setShowEditor(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const navigateToArchive = () => {
    window.history.pushState({}, '', window.location.pathname);
    setCurrentSlug(null);
  };

  const filteredEntries = currentSlug 
    ? entries.filter(e => e.id === currentSlug)
    : entries;

  return (
    <Layout onToggleEditor={() => setShowEditor(!showEditor)} showEditor={showEditor}>
      {/* Back Navigation for Single Posts */}
      {currentSlug && (
        <button 
          onClick={navigateToArchive}
          className="mb-8 flex items-center gap-2 font-romantic text-xs uppercase tracking-[0.3em] text-red-500 hover:text-red-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Ledger
        </button>
      )}

      {/* Drafting Suite */}
      {showEditor && !currentSlug && (
        <section className="mb-20 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-[#1a0a1a] border border-red-900/30 rounded-2xl p-8 md:p-14 shadow-[0_0_100px_rgba(0,0,0,1)] relative">
            <h2 className="font-romantic italic font-bold text-4xl text-red-600 mb-8 text-center uppercase tracking-tighter">Drafting Desk</h2>
            <form onSubmit={handleGenerate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-romantic text-[10px] uppercase tracking-[0.3em] text-red-800 mb-3 font-bold">Pseudonym</label>
                  <input 
                    type="text"
                    required
                    placeholder="SanguineSpirit"
                    className="w-full bg-[#0d040e] border border-red-900/10 rounded p-4 font-romantic text-lg text-slate-200 focus:outline-none focus:border-red-800 transition-all placeholder:opacity-10"
                    value={draft.senderName}
                    onChange={e => setDraft(p => ({ ...p, senderName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block font-romantic text-[10px] uppercase tracking-[0.3em] text-red-800 mb-3 font-bold">Lineage</label>
                  <select 
                    className="w-full bg-[#0d040e] border border-red-900/10 rounded p-4 font-romantic text-lg text-slate-200 focus:outline-none focus:border-red-800 transition-all cursor-pointer"
                    value={draft.creatureType}
                    onChange={e => setDraft(p => ({ ...p, creatureType: e.target.value as CreatureType }))}
                  >
                    {Object.values(CreatureType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-romantic text-[10px] uppercase tracking-[0.3em] text-red-800 mb-3 font-bold">The Query</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-[#0d040e] border border-red-900/10 rounded p-4 font-romantic text-lg text-slate-200 focus:outline-none focus:border-red-800 transition-all resize-none"
                  value={draft.question}
                  onChange={e => setDraft(p => ({ ...p, question: e.target.value }))}
                />
              </div>
              <button 
                type="submit"
                disabled={isGenerating}
                className="w-full py-5 rounded font-romantic italic font-bold text-2xl tracking-[0.1em] bg-red-950/20 text-red-100 hover:bg-red-900/30 border border-red-900/30 transition-all"
              >
                {isGenerating ? 'Channeling Spirits...' : 'Draft New Column'}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Main Column Entries */}
      <section className="space-y-4">
        {loadingPost ? (
          <div className="text-center py-32 px-4 animate-pulse">
            <p className="font-romantic text-3xl text-red-200/20 italic">Summoning the records...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-32 px-4">
            <p className="font-romantic text-3xl text-red-200/5 italic">The ledger has turned to dust...</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <AdviceCard key={entry.id} entry={entry} />
          ))
        )}
      </section>
    </Layout>
  );
};

export default App;
