import { useState, useCallback, useEffect, useRef } from "react";
import { generatePdf, getPreviewUrl, downloadPdf } from "../utils/generatePdf";

const PLACEHOLDER_TEXT = `# Example\n\nLorem ipsum dolor sit amet...`;

export default function App() {
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [filename, setFilename] = useState("document");
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target.result);
        setPreviewUrl(null);
        setFilename(file.name.replace(/\.(txt|md)$/, ""));
      };
      reader.readAsText(file);
    }
  };

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
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white/90 selection:bg-blue-500/30 flex flex-col items-center p-6 md:p-12 relative overflow-x-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#14141a_0%,#0a0a0c_70%)] pointer-events-none" />

      <header className="relative text-center mb-12 max-w-[1000px] w-full">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Text to PDF</h1>
        <p className="text-white/60">Convert text & Markdown to beautiful PDFs</p>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 w-full max-w-[1000px]">
        
        {/* Settings Panel */}
        <aside className="bg-[#111115] border border-white/10 rounded-2xl p-5 shadow-2xl h-fit lg:sticky lg:top-6 order-2 lg:order-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Settings</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium text-white/40 uppercase">Filename</label>
              <input 
                type="text" value={filename} onChange={(e) => setFilename(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-medium text-white/40 uppercase">Font</label>
                <select value={settings.font} onChange={(e) => updateSetting("font", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm outline-none">
                  <option value="sans">Sans</option>
                  <option value="serif">Serif</option>
                  <option value="mono">Mono</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-medium text-white/40 uppercase">Size</label>
                <select value={settings.fontSize} onChange={(e) => updateSetting("fontSize", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm outline-none">
                  <option value="small">Small</option>
                  <option value="medium">Med</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium text-white/40 uppercase">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {['light', 'dark', 'sepia'].map(t => (
                  <button 
                    key={t} onClick={() => updateSetting("theme", t)}
                    className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${settings.theme === t ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-white/10'}`}
                    style={{ backgroundColor: t === 'light' ? '#fff' : t === 'dark' ? '#1e1e23' : '#fbf3e4', color: t === 'light' ? '#000' : t === 'dark' ? '#fff' : '#3c3228' }}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-white/5">
              {['enableMarkdown', 'showPageNumbers', 'showLineNumbers'].map((key) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" checked={settings[key]} 
                    onChange={(e) => updateSetting(key, e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 accent-blue-500"
                  />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
              <button 
                onClick={generatePreview} disabled={!text.trim() || isGenerating}
                className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-all text-sm font-medium disabled:opacity-40"
              >
                {isGenerating ? "Generating..." : "Preview"}
              </button>
              <button 
                onClick={handleDownload} disabled={!text.trim()}
                className="w-full py-2.5 rounded-full bg-white text-black hover:bg-white/90 transition-all text-sm font-bold disabled:opacity-40 shadow-xl"
              >
                Download PDF
              </button>
            </div>
          </div>
        </aside>

        {/* Editor Section */}
        <section className="bg-[#111115] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden order-1 lg:order-2">
          <div className="flex justify-between items-center px-5 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-white">Editor</span>
              <div className="hidden sm:flex gap-2">
                <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-white/40">{stats.characters} chars</span>
                <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-white/40">{stats.words} words</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setText(PLACEHOLDER_TEXT)} className="text-[11px] font-medium text-white/40 hover:text-white px-2 py-1 transition-colors">Example</button>
              {text && <button onClick={() => setText("")} className="text-[11px] font-medium text-white/40 hover:text-red-400 px-2 py-1 transition-colors">Clear</button>}
            </div>
          </div>

          <div className={`relative flex-1 min-h-[400px] transition-colors ${isDragging ? "bg-blue-500/5" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <textarea
              ref={textareaRef} value={text} onChange={handleTextChange} spellCheck={false}
              placeholder="Start typing or drop a .txt / .md file here..."
              className="w-full h-full p-6 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed placeholder:text-white/20"
            />
            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 border-2 border-dashed border-blue-500 pointer-events-none">
                <span className="text-blue-500 font-bold">Drop file here</span>
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-white/5">
            <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white/60 cursor-pointer transition-all">
              <input type="file" accept=".txt,.md" onChange={handleFileSelect} className="hidden" />
              <span>Upload file</span>
            </label>
          </div>
        </section>
      </main>

      {/* Preview Modal */}
      {showPreview && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowPreview(false)} />
          <div className="relative w-full max-w-4xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex justify-between items-center text-white">
              <h3 className="text-sm font-medium">Preview — {settings.pageSize.toUpperCase()} {settings.orientation}</h3>
              <button onClick={() => setShowPreview(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-all text-xl">&times;</button>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl aspect-[1/1.41] max-h-[70vh] mx-auto w-full border border-white/10">
              <iframe src={previewUrl} className="w-full h-full border-none" title="PDF Preview" />
            </div>
            <div className="flex justify-center">
              <button onClick={handleDownload} className="px-8 py-3 bg-white text-black rounded-full font-bold shadow-xl hover:scale-105 transition-transform">Download Now</button>
            </div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <a 
          href="https://www.instagram.com/shivam05_10" target="_blank" rel="noopener noreferrer"
          className="pointer-events-auto text-[10px] text-white/40 hover:text-white/60 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 transition-all"
        >
          Coded by ShivamYadav
        </a>
      </footer>
    </div>
  );
}