import { useState, useCallback, useEffect, useRef } from "react";
import { generatePdf, getPreviewUrl, downloadPdf } from "../utils/generatePdf";
import { 
  FileText, Download, Settings, ChevronLeft, 
  Zap, ShieldCheck, Activity, Eye, Trash2, Upload, 
  Hash, Type, Layout, Palette
} from 'lucide-react';

const PLACEHOLDER_TEXT = `# Nexus Document\n\nStart typing your content here...`;

export default function App() {
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [filename, setFilename] = useState("nexus_export");
  const textareaRef = useRef(null);
  const pdfDocRef = useRef(null);

  const [settings, setSettings] = useState({
    font: "sans",
    fontSize: "medium",
    pageSize: "a4",
    orientation: "portrait",
    theme: "light",
    showLineNumbers: false,
    headerText: "",
    showPageNumbers: true,
    enableMarkdown: true,
  });

  const stats = {
    characters: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text ? text.split("\n").length : 0,
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setPreviewUrl(null);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setPreviewUrl(null);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md"))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target.result);
        setPreviewUrl(null);
        setFilename(file.name.replace(/\.(txt|md)$/, ""));
      };
      reader.readAsText(file);
    }
  }, []);

  const generatePreview = useCallback(() => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const doc = generatePdf(text, settings);
        pdfDocRef.current = doc;
        setPreviewUrl(getPreviewUrl(doc));
        setShowPreview(true);
      } catch (err) {
        console.error("PDF generation error:", err);
      }
      setIsGenerating(false);
    }, 100);
  }, [text, settings]);

  const handleDownload = () => {
    if (!text.trim()) return;
    const doc = pdfDocRef.current || generatePdf(text, settings);
    downloadPdf(doc, filename);
  };

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 pt-32 relative overflow-hidden selection:bg-blue-500/30 font-sans">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none" />

      <main className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <header className="mb-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white/40 hover:text-blue-400 mb-6 transition group text-sm font-bold uppercase tracking-widest">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Zap size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[2px] text-blue-400">Document Forge v4.2</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tight">
            Text <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">PDF</span>
          </h1>
          <p className="text-white/40 mt-3 font-medium">Export raw logic and markdown into high-fidelity PDF manifests.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
          
          {/* --- CONFIGURATION SIDEBAR --- */}
          <aside className="space-y-6 order-2 lg:order-1">
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 shadow-2xl backdrop-blur-md sticky top-32">
              <div className="flex items-center gap-2 mb-6 text-blue-400 font-bold uppercase text-[10px] tracking-widest">
                <Settings className="w-4 h-4" /> Manifest Settings
              </div>

              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-white/30 font-black uppercase tracking-widest">Filename</label>
                  <input 
                    type="text" value={filename} onChange={(e) => setFilename(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
  {/* FONT SELECTOR */}
  <div className="flex flex-col gap-2">
    <label className="text-[9px] text-white/30 font-black uppercase tracking-widest flex items-center gap-1">
      <Type size={10}/> Font
    </label>
    <select 
      value={settings.font} 
      onChange={(e) => updateSetting("font", e.target.value)} 
      className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-[11px] font-bold outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
    >
      <option value="sans" className="bg-[#111115] text-white">SANS</option>
      <option value="serif" className="bg-[#111115] text-white">SERIF</option>
      <option value="mono" className="bg-[#111115] text-white">MONO</option>
    </select>
  </div>

  {/* SIZE SELECTOR */}
  <div className="flex flex-col gap-2">
    <label className="text-[9px] text-white/30 font-black uppercase tracking-widest flex items-center gap-1">
      <Layout size={10}/> Size
    </label>
    <select 
      value={settings.fontSize} 
      onChange={(e) => updateSetting("fontSize", e.target.value)} 
      className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-[11px] font-bold outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
    >
      <option value="small" className="bg-[#111115] text-white">SM</option>
      <option value="medium" className="bg-[#111115] text-white">MED</option>
      <option value="large" className="bg-[#111115] text-white">LG</option>
    </select>
  </div>
</div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-white/30 font-black uppercase tracking-widest flex items-center gap-1"><Palette size={10}/> Color Deck</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['light', 'dark', 'sepia'].map(t => (
                      <button 
                        key={t} onClick={() => updateSetting("theme", t)}
                        className={`py-2 rounded-xl text-[9px] font-black border transition-all ${settings.theme === t ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-white/5 text-white/40'}`}
                      >
                        {t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/5">
                  {['enableMarkdown', 'showPageNumbers', 'showLineNumbers'].map((key) => (
                    <label key={key} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider group-hover:text-white/60 transition-colors">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <input 
                        type="checkbox" checked={settings[key]} 
                        onChange={(e) => updateSetting(key, e.target.checked)}
                        className="w-4 h-4 rounded border-white/10 accent-blue-500"
                      />
                    </label>
                  ))}
                </div>

                <div className="pt-4 space-y-3">
                  <button 
                    onClick={generatePreview} disabled={!text.trim() || isGenerating}
                    className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-white/10 disabled:opacity-20 transition-all"
                  >
                    <Eye size={14} /> {isGenerating ? "Processing..." : "Live Preview"}
                  </button>
                  <button 
                    onClick={handleDownload} disabled={!text.trim()}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-blue-500 disabled:opacity-20 transition-all shadow-xl shadow-blue-900/20"
                  >
                    <Download size={14} /> Export PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[24px] flex gap-3">
              <ShieldCheck className="text-blue-500 shrink-0" size={20} />
              <p className="text-[10px] leading-relaxed text-blue-200/50 font-bold uppercase tracking-wider">
                Privacy: Document logic is processed locally via browser memory.
              </p>
            </div>
          </aside>

          {/* --- EDITOR WORKSPACE --- */}
          <section className="bg-white/[0.03] border border-white/5 rounded-[32px] min-h-[600px] flex flex-col relative overflow-hidden shadow-2xl backdrop-blur-sm order-1 lg:order-2">
            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-[3px] text-white/30">Editor Terminal</span>
                <div className="hidden sm:flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <Hash size={10} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{stats.characters} Characters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity size={10} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{stats.words} Words</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setText(PLACEHOLDER_TEXT)} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Sample</button>
                {text && <button onClick={() => setText("")} className="px-3 py-1 bg-red-500/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-all flex items-center gap-1"><Trash2 size={10}/> Wipe</button>}
              </div>
            </div>

            <div className={`relative flex-1 transition-colors ${isDragging ? "bg-blue-500/10" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <textarea
                ref={textareaRef} value={text} onChange={handleTextChange} spellCheck={false}
                placeholder="Input raw content or drop .md / .txt files here to initialize conversion..."
                className="w-full h-full p-8 bg-transparent outline-none resize-none font-mono text-[13px] leading-relaxed placeholder:text-white/10 text-white/80"
              />
              {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-600/10 backdrop-blur-sm border-2 border-dashed border-blue-500 m-4 rounded-2xl pointer-events-none animate-in fade-in zoom-in duration-200">
                  <div className="flex flex-col items-center gap-4">
                    <Upload className="text-blue-500 animate-bounce" size={40} />
                    <span className="text-blue-500 font-black uppercase tracking-[4px] text-xs">Inject File Payload</span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-4 border-t border-white/5 bg-white/[0.01]">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 cursor-pointer transition-all border border-white/5">
                <input type="file" accept=".txt,.md" onChange={(e) => {
                  const file = e.target.files[0];
                  if(file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => { setText(ev.target.result); setFilename(file.name.split('.')[0]); };
                    reader.readAsText(file);
                  }
                }} className="hidden" />
                <FileText size={12} /> External Import
              </label>
            </div>
          </section>
        </div>
      </main>

      {/* --- PREVIEW MODAL --- */}
      {showPreview && previewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowPreview(false)} />
          <div className="relative w-full max-w-5xl flex flex-col gap-6 animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center text-white/40">
              <div className="flex items-center gap-3">
                <Eye size={16} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-[3px]">Visual Manifest Preview</span>
              </div>
              <button onClick={() => setShowPreview(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all">&times;</button>
            </div>
            <div className="bg-white rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] aspect-[1/1.41] max-h-[75vh] mx-auto w-full border border-white/10">
              <iframe src={previewUrl} className="w-full h-full border-none" title="PDF Preview" />
            </div>
            <div className="flex justify-center">
              <button onClick={handleDownload} className="px-12 py-4 bg-white text-black rounded-full font-black uppercase text-xs tracking-[2px] shadow-2xl hover:scale-105 transition-transform active:scale-95">Finalize & Download</button>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="mt-20 py-10 flex flex-col items-center gap-4 opacity-30 border-t border-white/5">
         <p className="text-[9px] font-black uppercase tracking-[5px]">NexTools Workshop Ecosystem</p>
         <div className="flex items-center gap-4">
            <span className="h-[1px] w-8 bg-blue-600/50" />
            <a href="https://instagram.com/shivam05_10" target="_blank" className="text-[10px] hover:text-blue-400 transition-colors uppercase"> शिवम यादव </a>
            <span className="h-[1px] w-8 bg-blue-600/50" />
         </div>
      </footer>
    </div>
  );
}