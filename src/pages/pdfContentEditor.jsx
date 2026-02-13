import React, { useState, useRef } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Edit3, ShieldCheck, User, Tag, Calendar, Download, RefreshCw, Type, Eraser, AlertCircle } from 'lucide-react';

const PDFContentEditor = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Metadata States
  const [metadata, setMetadata] = useState({
    title: '',
    author: '',
    subject: '',
    creator: 'NexTools Editor'
  });

  // Simple Content Edit State (Overlay Text)
  const [overlayText, setOverlayText] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      // Pre-load existing metadata logic could go here
    } else {
      setError('Please upload a valid PDF.');
    }
  };

  const processPDF = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // 1. Edit Metadata (The "Ghost" Feature)
      pdfDoc.setTitle(metadata.title);
      pdfDoc.setAuthor(metadata.author);
      pdfDoc.setSubject(metadata.subject);
      pdfDoc.setCreator(metadata.creator);
      pdfDoc.setProducer('NexTools Privacy Engine');

      // 2. Add Content Overlay (If text is provided)
      if (overlayText) {
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        // Example: Adding a footer or header to all pages
        pages.forEach(page => {
            page.drawText(overlayText, {
                x: 50,
                y: 50,
                size: 12,
                font: font,
                color: rgb(0, 0, 0),
            });
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited_${file.name}`;
      link.click();
      setIsProcessing(false);
    } catch (err) {
      setError('Error editing PDF properties.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col items-center p-6 md:p-12 font-sans relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#14141a_0%,#0a0a0c_70%)] pointer-events-none" />

      <header className="relative text-center mb-10 w-full max-w-[900px]">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Metadata & Content Editor</h1>
        <p className="text-white/50">Modify hidden properties and overlay content securely</p>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 w-full max-w-[1200px]">
        
        {/* Sidebar: Metadata Ghost Editor */}
        <aside className="bg-[#111115] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6 h-fit">
          <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-[10px] tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Identity Scrubbing
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-white/30 uppercase flex items-center gap-2"><Tag className="w-3 h-3"/> Document Title</label>
              <input 
                type="text" placeholder="Project Alpha"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                value={metadata.title} onChange={e => setMetadata({...metadata, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-white/30 uppercase flex items-center gap-2"><User className="w-3 h-3"/> Author Name</label>
              <input 
                type="text" placeholder="Anonymous"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                value={metadata.author} onChange={e => setMetadata({...metadata, author: e.target.value})}
              />
            </div>

            <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={processPDF}
                  disabled={!file || isProcessing}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Save Changes
                </button>
            </div>
          </div>
        </aside>

        {/* Main: Content Workspace */}
        <section className="bg-[#111115] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="px-8 py-4 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
            <div className="flex gap-4">
                <button className="text-[10px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
                    <Type className="w-3 h-3" /> Text Overlay
                </button>
                <button className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2 hover:text-white/40 transition-colors">
                    <Eraser className="w-3 h-3" /> Redact (Soon)
                </button>
            </div>
          </div>

          <div className="flex-1 p-8 flex flex-col items-center justify-center">
            {!file ? (
              <div onClick={() => fileInputRef.current.click()} className="cursor-pointer group flex flex-col items-center">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:border-blue-500/50 transition-all">
                  <Edit3 className="text-blue-500 w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-white/60">Load PDF to Edit Content</p>
              </div>
            ) : (
              <div className="w-full max-w-lg space-y-6 animate-in fade-in zoom-in-95">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <label className="text-[10px] text-white/40 uppercase font-bold mb-3 block">Add text to footer (all pages)</label>
                    <textarea 
                        value={overlayText}
                        onChange={e => setOverlayText(e.target.value)}
                        placeholder="Enter text to inject into the document..."
                        className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-blue-500 resize-none"
                    />
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-blue-400" />
                    <p className="text-[11px] text-blue-200/70 italic">Editing existing text in a PDF is complex; this tool currently supports "Metadata Scrubbing" and "Text Injection".</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
    </div>
  );
};

export default PDFContentEditor;