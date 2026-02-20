import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AdviceCard } from './components/AdviceCard';
import { CreatureType, AdviceEntry } from './types';
import { getParanormalAdvice } from './services/geminiService';

// Slugs of posts that should be pre-loaded if the local archive is empty
const DEFAULT_POST_SLUGS: string[] = [];

const App: React.FC = () => {
  const [entries, setEntries] = useState<AdviceEntry[]>(() => {
    const saved = localStorage.getItem('lovebites_archive');
    return saved ? JSON.parse(saved) : [];
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

  // Fetch standard posts on mount if local state is empty
  useEffect(() => {
    if (entries.length === 0 && DEFAULT_POST_SLUGS.length > 0) {
      DEFAULT_POST_SLUGS.forEach(slug => fetchExternalPost(slug));
    }
  }, []);

  // Handle routing via query params for GitHub Pages compatibility
  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      const postSlug = params.get('post');
      if (postSlug) {
        setCurrentSlug(postSlug);
        fetchExternalPost(postSlug);
      } else {
        setCurrentSlug(null);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('lovebites_archive', JSON.stringify(entries));
  }, [entries]);

  const fetchExternalPost = async (slug: string) => {
    // If we already have it in state, skip fetching
    if (entries.find(e => e.id === slug)) return;

    setLoadingPost(true);
    try {
      // Possible paths where PagesCMS might save Jekyll posts
      const possiblePaths = [`./posts/${slug}.md`, `./_posts/${slug}.md`, `./${slug}.md`];
      let text = '';
      
      for (const path of possiblePaths) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            text = await res.text();
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!text) throw new Error("Post not found");
      
      // Simple Jekyll Frontmatter Parser
      const fmMatch = text.match(/---([\s\S]*?)---([\s\S]*)/);
      if (fmMatch) {
        const fm = fmMatch[1];
        const content = fmMatch[2];
        
        const getVal = (key: string) => {
          const regex = new RegExp(`${key}:\\s*["']?(.*?)["']?(\\n|\\r|$)`, 'i');
          const match = fm.match(regex);
          return match ? match[1].trim() : '';
        };
        
        const title = getVal('title') || 'A Lost Chronicle';
        const dateStr = getVal('date');
        const creature = getVal('creature') || 'Unknown Entity';
        const pseudonym = getVal('pseudonym') || 'Anonymous';
        
        // Match specific markdown sections or fallback to raw content
        const querySection = content.match(/## The Query\n>\s*"(.*?)"/s) || content.match(/>\s*"(.*?)"/s);
        const verdictSection = content.match(/## LoveBites' Verdict\n([\s\S]*)/s) || [null, content];

        const newEntry: AdviceEntry = {
          id: slug,
          timestamp: dateStr ? new Date(dateStr).getTime() : Date.now(),
          creatureType: creature,
          senderName: pseudonym,
          postTitle: title,
          question: querySection?.[1] || 'The query has vanished into the aether...',
          advice: verdictSection?.[1]?.trim() || 'No advice was found for this soul.'
        };

        setEntries(prev => {
          if (prev.find(e => e.id === slug)) return prev;
          return [newEntry, ...prev];
        });
      }
    } catch (error) {
      console.warn(`Unable to retrieve post: ${slug}`, error);
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
        id: postTitle.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
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

  const navigateHome = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('post');
    window.history.pushState({}, '', url.pathname);
    setCurrentSlug(null);
  };

  const displayedEntries = currentSlug 
    ? entries.filter(e => e.id === currentSlug)
    : entries;

  return (
    <Layout onToggleEditor={() => setShowEditor(!showEditor)} showEditor={showEditor}>
      {currentSlug && (
        <button 
          onClick={navigateHome}
          className="mb-12 flex items-center gap-4 font-romantic text-xs uppercase tracking-[0.4em] text-red-600 hover:text-red-400 transition-all group"
        >
          <span className="text-xl transform group-hover:-translate-x-2 transition-transform">←</span>
          The Archive Ledger
        </button>
      )}

      {showEditor && !currentSlug && (
        <section className="mb-24 animate-in fade-in zoom-in-95 duration-700">
          <div className="bg-[#1a0a1a] border border-red-900/30 rounded-3xl p-10 md:p-16 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 font-romantic text-9xl text-red-800 italic select-none pointer-events-none">
              Scriptum
            </div>
            <h2 className="font-romantic text-4xl text-red-600 mb-10 text-center uppercase tracking-widest relative z-10 font-bold">Summon Guidance</h2>
            <form onSubmit={handleGenerate} className="space-y-10 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block font-romantic text-[10px] uppercase tracking-[0.4em] text-red-800 mb-4 font-bold">Pseudonym</label>
                  <input 
                    type="text"
                    required
                    placeholder="E.g. Nocturnal_Nora"
                    className="w-full bg-[#0d040e] border border-red-900/20 rounded-lg p-5 font-romantic text-xl text-slate-100 focus:outline-none focus:border-red-600 transition-all placeholder:text-red-900/10"
                    value={draft.senderName}
                    onChange={e => setDraft(p => ({ ...p, senderName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block font-romantic text-[10px] uppercase tracking-[0.4em] text-red-800 mb-4 font-bold">Spectral Lineage</label>
                  <select 
                    className="w-full bg-[#0d040e] border border-red-900/20 rounded-lg p-5 font-romantic text-xl text-slate-100 focus:outline-none focus:border-red-600 transition-all cursor-pointer"
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
                <label className="block font-romantic text-[10px] uppercase tracking-[0.4em] text-red-800 mb-4 font-bold">Your Inquiry</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Tell us of your heart's shadow..."
                  className="w-full bg-[#0d040e] border border-red-900/20 rounded-lg p-5 font-romantic text-xl text-slate-100 focus:outline-none focus:border-red-600 transition-all resize-none placeholder:text-red-900/10"
                  value={draft.question}
                  onChange={e => setDraft(p => ({ ...p, question: e.target.value }))}
                />
              </div>
              <button 
                type="submit"
                disabled={isGenerating}
                className="w-full py-7 rounded-xl font-romantic font-bold text-2xl tracking-[0.3em] bg-red-950/20 text-red-100 hover:bg-red-900/40 border border-red-900/40 transition-all disabled:opacity-50 group uppercase"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-4">
                    <span className="animate-spin text-red-500">†</span> Channeling...
                  </span>
                ) : 'Release to the Void'}
              </button>
            </form>
          </div>
        </section>
      )}

      <div className="space-y-4">
        {loadingPost && displayedEntries.length === 0 ? (
          <div className="text-center py-48 animate-pulse">
            <div className="text-red-900 text-7xl mb-10">❦</div>
            <p className="font-romantic text-3xl text-red-200/20 italic tracking-[0.2em] uppercase">Unsealing the chronicle...</p>
          </div>
        ) : displayedEntries.length === 0 ? (
          <div className="text-center py-48 border border-dashed border-red-950/10 rounded-3xl">
            <p className="font-romantic text-2xl text-red-900/20 italic tracking-widest uppercase">The ledger is currently empty.</p>
          </div>
        ) : (
          displayedEntries
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(entry => (
              <AdviceCard key={entry.id} entry={entry} />
            ))
        )}
      </div>
    </Layout>
  );
};

export default App;