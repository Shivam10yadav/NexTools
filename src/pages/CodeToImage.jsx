import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { 
  Code2, Download, ChevronLeft, 
  Copy, Check, Share2, Type, Palette 
} from 'lucide-react';

const CodeToImage = () => {
  const [code, setCode] = useState('// Paste your beautiful code here...\n\nfunction NexTools() {\n  console.log("Making tools better!");\n}');
  const [theme, setTheme] = useState('bg-gradient-to-br from-blue-600 to-purple-700');
  const [language, setLanguage] = useState('JavaScript');
  const [copied, setCopied] = useState(false);
  const elementRef = useRef(null);

  const downloadImage = async () => {
    if (elementRef.current === null) return;
    
    const dataUrl = await toPng(elementRef.current, { cacheBust: true, pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = 'NexTools-Code-Snippet.png';
    link.href = dataUrl;
    link.click();
  };

  const gradients = [
    { name: 'NexBlue', class: 'bg-gradient-to-br from-blue-600 to-purple-700' },
    { name: 'Sunset', class: 'bg-gradient-to-br from-orange-500 to-pink-600' },
    { name: 'Midnight', class: 'bg-gradient-to-br from-slate-900 to-slate-700' },
    { name: 'Emerald', class: 'bg-gradient-to-br from-emerald-400 to-cyan-500' },
    { name: 'Hyper', class: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 pt-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />

      <main className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition">
            <ChevronLeft size={16} /> Dashboard
          </button>
          <h1 className="text-4xl font-bold tracking-tight">Code <span className="text-blue-500">Snap</span></h1>
          <p className="text-white/40 mt-2">Beautiful code snippets for your social media presence.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          
          {/* Sidebar Controls */}
          <aside className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 shadow-2xl space-y-8">
              {/* Text Input Area */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[2px] text-white/30 mb-4">
                   <Type size={14}/> Input Code
                </label>
                <textarea 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-blue-100 focus:outline-none focus:border-blue-500/50 resize-none transition-all"
                />
              </div>

              {/* Background Selection */}
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[2px] text-white/30 mb-4">
                  <Palette size={14}/> Canvas Theme
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {gradients.map((g) => (
                    <button 
                      key={g.name}
                      onClick={() => setTheme(g.class)}
                      className={`h-8 rounded-lg border-2 transition-all ${theme === g.class ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ background: g.class.includes('from-') ? '' : g.class }} // simplified for preview
                      className={`${g.class} h-8 rounded-lg border-2 ${theme === g.class ? 'border-white scale-110' : 'border-transparent'}`}
                    />
                  ))}
                </div>
              </div>

              <button 
                onClick={downloadImage}
                className="w-full py-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 transition-all font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
              >
                Export PNG <Download size={16} />
              </button>
            </div>
          </aside>

          {/* Preview Canvas */}
          <section className="flex items-center justify-center p-4 lg:p-12 bg-[#0d0d12] rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden">
            {/* The element we will capture */}
            <div 
              ref={elementRef}
              className={`${theme} p-12 lg:p-20 min-w-[500px] flex items-center justify-center transition-all duration-500`}
            >
              {/* Window Frame */}
              <div className="bg-[#1e1e2e]/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 w-full max-w-xl overflow-hidden">
                {/* Mac Controls */}
                <div className="flex items-center gap-1.5 px-4 py-3 bg-white/5 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className="ml-4 text-[10px] font-medium text-white/20 uppercase tracking-[2px]">{language}</span>
                </div>
                {/* Code Body */}
                <div className="p-6">
                  <pre className="text-sm font-mono text-blue-100 leading-relaxed whitespace-pre-wrap">
                    <code>{code}</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
               <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold text-white/20 uppercase tracking-widest">Preview Mode</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CodeToImage;