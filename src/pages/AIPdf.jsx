// src/pages/AIPdf.jsx
import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  FileText, Sparkles, Loader2, Copy, Check, 
  ShieldCheck, BrainCircuit, Zap, ArrowRight 
} from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function AIPdf() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");

  const extractTextFromPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    const pagesToRead = Math.min(pdf.numPages, 15); // Upgraded context for Gemini
    for (let i = 1; i <= pagesToRead; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map(item => item.str).join(" ") + "\n";
    }
    return fullText;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setSummary("");

    try {
      const extractedText = await extractTextFromPdf(file);
      const response = await fetch('/api/summarizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setSummary("FATAL ERROR: Neural bridge disconnected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#e0e0e0] font-mono selection:bg-cyan-500/30 overflow-x-hidden">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12">
        
        {/* WORKSHOP HEADER */}
        <header className="flex flex-col lg:flex-row items-center justify-between mb-12 p-8 bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative size-16 bg-[#111] rounded-xl flex items-center justify-center border border-white/10">
                <BrainCircuit className="text-cyan-400 group-hover:scale-110 transition-transform" size={32} />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                Nex<span className="text-cyan-500">PDF</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="h-[1px] w-8 bg-cyan-500/50"></span>
                <p className="text-[9px] font-bold uppercase tracking-[4px] text-white/40">Neural Summarization Module</p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex gap-8 items-center border-l border-white/5 pl-8 ml-8">
            <div className="text-right">
              <p className="text-[10px] font-black text-cyan-500/60 uppercase">Engine Status</p>
              <p className="text-xs font-bold text-white">Gemini-1.5-Flash Online</p>
            </div>
            <div className="size-10 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center">
              <Zap size={16} className="text-emerald-500 animate-pulse" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INJECTION PORT */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0a0a0c] border border-white/5 rounded-[32px] p-1 shadow-2xl transition-all hover:border-cyan-500/20">
              <label className="flex flex-col items-center justify-center py-16 px-6 cursor-pointer group rounded-[28px] bg-gradient-to-b from-white/[0.02] to-transparent">
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                <div className="size-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-500">
                  <Zap className="text-cyan-400" size={32} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest italic mb-2">Inject Data</h3>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-tighter text-center">
                  Drag PDF into Neural Port or <span className="text-cyan-500">Browse</span>
                </p>
              </label>
            </div>

            {fileName && (
              <div className="bg-[#0a0a0c] border border-cyan-500/10 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
                <FileText className="text-cyan-500 shrink-0" size={20} />
                <span className="text-[11px] font-bold text-white/60 truncate uppercase">{fileName}</span>
              </div>
            )}

            <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-3xl p-6">
               <div className="flex items-center gap-3 mb-3">
                 <ShieldCheck className="text-cyan-500" size={16} />
                 <span className="text-[10px] font-black uppercase tracking-[2px] text-cyan-400">Security Layer</span>
               </div>
               <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                 Text extraction occurs strictly in your local sandbox. Only the raw character sequence is piped to the Gemini API via our secure Vercel bridge.
               </p>
            </div>
          </div>

          {/* RIGHT: OUTPUT TERMINAL */}
          <div className="lg:col-span-8">
            <div className="bg-[#0a0a0c] border border-white/5 rounded-[40px] shadow-2xl min-h-[600px] flex flex-col relative overflow-hidden group">
              {/* Terminal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="size-2 rounded-full bg-red-500/20" />
                    <div className="size-2 rounded-full bg-yellow-500/20" />
                    <div className="size-2 rounded-full bg-emerald-500/20" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[3px] text-white/20 ml-2">Extraction_Log_v1.0</span>
                </div>
                {summary && (
                  <button 
                    onClick={() => {navigator.clipboard.writeText(summary); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} 
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    {copied ? 'Captured' : 'Copy Log'}
                  </button>
                )}
              </div>

              {/* Terminal Content */}
              <div className="flex-1 p-10 relative">
                {loading ? (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a0c]/80 backdrop-blur-sm">
                    <div className="relative">
                      <Loader2 className="animate-spin text-cyan-500" size={48} />
                      <div className="absolute inset-0 blur-xl bg-cyan-500/20 animate-pulse" />
                    </div>
                    <p className="mt-6 text-[11px] font-black uppercase tracking-[6px] text-cyan-500 animate-pulse">Scanning Neural Paths...</p>
                  </div>
                ) : null}

                <div className="prose prose-invert max-w-none">
                  {summary ? (
                    <div className="text-cyan-50/80 leading-relaxed space-y-4 font-sans italic">
                      {summary.split('\n').map((line, i) => (
                        <p key={i} className="flex gap-4 group">
                          <span className="text-cyan-500 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"><ArrowRight size={18} /></span>
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center mt-20 opacity-10">
                      <FileText size={80} strokeWidth={1} />
                      <p className="text-xs font-black uppercase tracking-[10px] mt-6 italic">Port Idle</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Scanline Effect Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}