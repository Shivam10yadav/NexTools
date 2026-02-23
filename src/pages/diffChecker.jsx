import React, { useState } from 'react';
import * as Diff from 'diff';   


const diffChecker = () => {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [diffResult, setDiffResult] = useState([]);

  const handleCompare = () => {
    // We use diffWords for granular comparison, or diffLines for code
    const result = Diff.diffWordsWithSpace(oldText, newText);
    setDiffResult(result);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-[#0a0a0c] min-h-screen text-white">
      <h1 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">
        Text<span className="text-blue-600">Diff</span> Service
      </h1>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40">Original Text</label>
          <textarea
            className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition"
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            placeholder="Paste source text here..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-blue-500">Changed Text</label>
          <textarea
            className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Paste modified text here..."
          />
        </div>
      </div>

      <button
        onClick={handleCompare}
        className="w-full py-4 bg-blue-600 rounded-2xl font-bold uppercase tracking-widest hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 mb-10"
      >
        Run Comparison
      </button>

      {/* Results Section */}
      {diffResult.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-md">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">Comparison Output</h2>
          <div className="leading-relaxed whitespace-pre-wrap font-mono text-sm">
            {diffResult.map((part, index) => {
              const color = part.added 
                ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500' 
                : part.removed 
                ? 'bg-rose-500/20 text-rose-400 line-through border-b-2 border-rose-500' 
                : 'text-white/70';

              return (
                <span key={index} className={`${color} px-0.5 rounded-sm transition-colors`}>
                  {part.value}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default diffChecker;