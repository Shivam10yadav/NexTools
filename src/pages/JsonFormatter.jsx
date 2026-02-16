import React, { useState, useRef } from 'react';
import { 
  Braces, Copy, Check, Trash2, Download, 
  RefreshCw, AlertCircle, ShieldCheck, Activity, 
  Maximize2, FileJson, ArrowRightLeft
} from 'lucide-react';

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setError('');
    
    setTimeout(() => {
      try {
        const jsonObj = JSON.parse(input);
        setFormatted(JSON.stringify(jsonObj, null, 2));
      } catch (err) {
        setError(`Syntax Error: ${err.message}`);
        setFormatted('');
      } finally {
        setIsProcessing(false);
      }
    }, 400); // Slight delay for the "processing" feel
  };

  const handleMinify = () => {
    try {
      const jsonObj = JSON.parse(input);
      setFormatted(JSON.stringify(jsonObj));
      setError('');
    } catch (err) {
      setError(`Syntax Error: ${err.message}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJSON = () => {
    const blob = new Blob([formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nex_formatted_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 pt-32 relative overflow-hidden selection:bg-blue-500/30 font-mono">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none" />

      <main className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Activity size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[2px] text-blue-400">Data Parser v4.0</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tight">
            Nex<span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">JSON</span> Formatter
          </h1>
          <p className="text-white/40 mt-3 font-medium font-sans">Beautify, minify, and validate JSON structures with surgical precision.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[650px]">
          
          {/* --- INPUT AREA --- */}
          <div className="flex flex-col bg-white/[0.03] border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <FileJson size={14} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-[3px] text-white/30">Input Buffer</span>
              </div>
              <button 
                onClick={() => setInput('')}
                className="text-[9px] font-black uppercase text-white/20 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            </div>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste raw JSON here..."
              className="flex-1 bg-transparent p-6 outline-none resize-none text-sm text-blue-100/70 placeholder:text-white/10"
            />

            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex gap-3">
              <button 
                onClick={handleFormat}
                disabled={isProcessing}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
              >
                {isProcessing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Maximize2 className="w-3 h-3" />}
                Beautify
              </button>
              <button 
                onClick={handleMinify}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-[2px] transition-all border border-white/5"
              >
                Minify
              </button>
            </div>
          </div>

          {/* --- OUTPUT AREA --- */}
          <div className="flex flex-col bg-[#111115] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Braces size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[3px] text-white/30">Formatted Result</span>
              </div>
              
              <div className="flex items-center gap-4">
                {formatted && (
                  <>
                    <button onClick={downloadJSON} className="text-white/40 hover:text-blue-400 transition-colors">
                      <Download size={14} />
                    </button>
                    <button onClick={copyToClipboard} className="text-white/40 hover:text-blue-400 transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 p-6 overflow-auto custom-scrollbar">
              {formatted ? (
                <pre className="text-sm">
                  {formatted.split('\n').map((line, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="w-8 text-right text-white/10 select-none text-[10px]">{i + 1}</span>
                      <span className={`${line.includes(':') ? 'text-blue-400' : 'text-blue-100/60'}`}>
                        {line}
                      </span>
                    </div>
                  ))}
                </pre>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <AlertCircle className="text-red-500 mb-4 animate-bounce" size={40} />
                  <p className="text-red-400 text-xs font-black uppercase tracking-widest">{error}</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                  <ArrowRightLeft size={60} strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-[8px] mt-4">Waiting for payload</p>
                </div>
              )}
            </div>

            {/* Bottom Status Bar */}
            <div className="px-6 py-3 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-emerald-500/50" />
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Client-Side Encrypted</span>
              </div>
              {formatted && (
                <span className="text-[8px] font-black text-blue-500/50 uppercase tracking-widest">
                  {formatted.length} Characters
                </span>
              )}
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-20 py-10 flex flex-col items-center gap-4 opacity-30 border-t border-white/5 font-sans">
          <p className="text-[9px] font-black uppercase tracking-[5px]">NexTools Workshop Ecosystem</p>
          <div className="flex items-center gap-4">
            <span className="h-[1px] w-8 bg-blue-600/50" />
            <a href="https://instagram.com/shivam05_10" className="text-[10px] hover:text-blue-400 transition-colors uppercase font-black tracking-widest"> शिवम यादव </a>
            <span className="h-[1px] w-8 bg-blue-600/50" />
          </div>
      </footer>

      {/* Custom Scrollbar Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2563eb33; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2563eb66; }
      `}} />
    </div>
  );
};

export default JsonFormatter;