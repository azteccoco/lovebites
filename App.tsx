
import React, { useState, useEffect, useCallback } from 'react';
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
    question: 'I fell for a mortal who loves garlic bread. Do I tell her the truth or just keep wearing a heavy-duty N95 mask to dinner?',
    advice: "My dear nocturnal friend, deception is a fragile foundation for any romance, especially one involving high-carb Italian appetizers. You cannot spend eternity in a respirator. Tell her the truth. If she truly loves you, she'll switch to pesto. If not, well, there are plenty of other necks in the sea. And please, do check your cape for crumbs before you leave."
  }
];

const App: React.FC = () => {
  const [entries, setEntries] = useState<AdviceEntry[]>(() => {
    const saved = localStorage.getItem('lovebites_advice');
    return saved ? JSON.parse(saved) : INITIAL_ADVICE;
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    senderName: '',
    creatureType: CreatureType.Vampire,
    question: ''
  });

  useEffect(() => {
    localStorage.setItem('lovebites_advice', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.senderName) return;

    setIsSubmitting(true);
    try {
      const advice = await getParanormalAdvice(
        formData.creatureType,
        formData.senderName,
        formData.question
      );

      const newEntry: AdviceEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        creatureType: formData.creatureType,
        senderName: formData.senderName,
        question: formData.question,
        advice: advice
      };

      setEntries(prev => [newEntry, ...prev]);
      setFormData({
        senderName: '',
        creatureType: CreatureType.Vampire,
        question: ''
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="mb-16">
        <div className="bg-[#1a101f] border border-red-900/30 rounded-lg p-6 md:p-10 shadow-xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-800 to-transparent opacity-50" />
          
          <h2 className="font-gothic text-4xl text-red-600 mb-6 text-center">Seek My Counsel</h2>
          <p className="text-slate-400 text-center mb-8 italic">
            Are your hauntings unrequited? Is your soulmate a slayer? <br className="hidden md:block" />
            Pour your cold heart out below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-purple-400 mb-2 font-bold">Pseudonym</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. LonelyBanshee88"
                  className="w-full bg-[#0f0511] border border-purple-900/50 rounded p-3 text-slate-200 focus:outline-none focus:border-red-700 transition-colors"
                  value={formData.senderName}
                  onChange={e => setFormData(p => ({ ...p, senderName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-purple-400 mb-2 font-bold">Nature of Being</label>
                <select 
                  className="w-full bg-[#0f0511] border border-purple-900/50 rounded p-3 text-slate-200 focus:outline-none focus:border-red-700 transition-colors"
                  value={formData.creatureType}
                  onChange={e => setFormData(p => ({ ...p, creatureType: e.target.value as CreatureType }))}
                >
                  {Object.values(CreatureType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-purple-400 mb-2 font-bold">Your Tale of Woe</label>
              <textarea 
                required
                rows={4}
                placeholder="Describe your romantic entanglement..."
                className="w-full bg-[#0f0511] border border-purple-900/50 rounded p-3 text-slate-200 focus:outline-none focus:border-red-700 transition-colors resize-none"
                value={formData.question}
                onChange={e => setFormData(p => ({ ...p, question: e.target.value }))}
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded font-gothic text-2xl tracking-widest transition-all duration-500
                ${isSubmitting 
                  ? 'bg-purple-900/20 text-purple-600 cursor-not-allowed' 
                  : 'bg-red-900 text-red-100 hover:bg-red-800 hover:shadow-[0_0_20px_rgba(185,28,28,0.4)] active:scale-[0.98]'
                }`}
            >
              {isSubmitting ? 'Summoning Wisdom...' : 'Ask LoveBites'}
            </button>
          </form>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent to-purple-900/50" />
          <h2 className="font-gothic text-3xl text-purple-300">Previous Columns</h2>
          <div className="h-px flex-grow bg-gradient-to-l from-transparent to-purple-900/50" />
        </div>

        <div className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-center text-slate-500 italic py-10">The archives are empty. Be the first to haunt them.</p>
          ) : (
            entries.map(entry => (
              <AdviceCard key={entry.id} entry={entry} />
            ))
          )}
        </div>
      </section>
    </Layout>
  );
};

export default App;
