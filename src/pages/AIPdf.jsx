// src/pages/AIPdf.jsx
import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FileText, Sparkles, Loader2, Copy, Check, ShieldCheck } from 'lucide-react';

// Set up the worker for PDF processing
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function AIPdf() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const extractTextFromPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    // Loop through pages (limit to first 10 for speed)
    const pagesToRead = Math.min(pdf.numPages, 10);
    for (let i = 1; i <= pagesToRead; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      fullText += strings.join(" ") + "\n";
    }
    return fullText;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setSummary("");

    try {
      // 1. Extract text locally
      const extractedText = await extractTextFromPdf(file);

      // 2. Send text to your Gemini API bridge
      const response = await fetch('/api/summarizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText }),
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setSummary("Neural Bridge Error: Could not process PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* REFINED NEON HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 border-b border-white/5 pb-10">
          <div className="flex items-center gap-6">
            <div className="size-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <FileText size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                Nex<span className="text-blue-500">PDF</span>
              </h1>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-[3px]">Gemini Neural Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[9px] font-black uppercase text-emerald-500">Privacy Secured</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
             <label className="group relative block bg-[#111115] border border-white/5 hover:border-blue-500/30 rounded-[40px] p-10 text-center cursor-pointer transition-all">
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                <Sparkles className="mx-auto mb-4 text-blue-500 group-hover:animate-pulse" size={40} />
                <h3 className="text-sm font-black uppercase tracking-widest">Inject PDF</h3>
             </label>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-[#111115] border border-white/5 rounded-[40px] p-8 min-h-[500px] relative">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111115]/80 rounded-[40px] z-20">
                  <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
                  <p className="text-[10px] font-black uppercase tracking-[4px] text-blue-500">Analyzing Content...</p>
                </div>
              ) : null}

              <div className="flex justify-between mb-8 text-white/20">
                <span className="text-[10px] font-black uppercase tracking-[4px]">Gemini Analysis Result</span>
                {summary && (
                  <button onClick={() => {navigator.clipboard.writeText(summary); setCopied(true)}} className="hover:text-blue-500">
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-blue-100/70 font-medium leading-relaxed italic whitespace-pre-wrap">
                  {summary || "Upload a document to begin neural extraction..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}