import React, { useState, useRef } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Edit3, ShieldCheck, User, Tag, Download, RefreshCw, Type, Eraser, AlertCircle, FileText, Fingerprint } from 'lucide-react';

const PDFContentEditor = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const [metadata, setMetadata] = useState({
    title: '',
    author: '',
    subject: '',
    creator: 'NexTools Ghost Editor'
  });

  const [overlayText, setOverlayText] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Invalid Format. Please provide a PDF.');
    }
  };

  const processPDF = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      pdfDoc.setTitle(metadata.title || "");
      pdfDoc.setAuthor(metadata.author || "Anonymous");
      pdfDoc.setSubject(metadata.subject || "");
      pdfDoc.setCreator(metadata.creator);
      pdfDoc.setProducer('NexTools Privacy Engine');

      if (overlayText) {
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        pages.forEach(page => {
            page.drawText(overlayText, {
                x: 50,
                y: 30,
                size: 10,
                font: font,
                color: rgb(0.3, 0.3, 0.3),
            });
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nexus_ghost_${file.name}`;
      link.click();
      setIsProcessing(false);
    } catch (err) {
      setError('Processing failed.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col items-center p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background VFX */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <header className="relative z-10 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Fingerprint className="w-3 h-3 text-blue-400" />
            <span className="text-[9px] font-black uppercase tracking-[2px] text-blue-400">Privacy Engine v1.0</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter italic uppercase">Ghost <span className="text-white/20">Editor</span></h1>
        <p className="text-white/40 text-sm mt-2 tracking-wide">Scrub document metadata and inject global overlays.</p>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 w-full max-w-6xl">
        
        {/* Sidebar: Metadata Controller */}
        <aside className="bg-[#111115]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl space-y-8">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[3px] text-white/20 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" /> Metadata Masking
            </h3>
            
            <div className="space-y-4">
                {[
                    { label: 'Document Title', icon: <Tag />, key: 'title', placeholder: 'Internal_Specs' },
                    { label: 'Author Identity', icon: <User />, key: 'author', placeholder: 'Ghost_User' }
                ].map((input) => (
                    <div key={input.key} className="space-y-2">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                            {React.cloneElement(input.icon, { size: 12 })} {input.label}
                        </label>
                        <input 
                            type="text" 
                            placeholder={input.placeholder}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 text-sm focus:border-blue-500/50 focus:bg-white/[0.05] outline-none transition-all italic"
                            value={metadata[input.key]} 
                            onChange={e => setMetadata({...metadata, [input.key]: e.target.value})}
                        />
                    </div>
                ))}
            </div>
          </div>

          <button 
            onClick={processPDF}
            disabled={!file || isProcessing}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-[2px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Compile & Export
          </button>
        </aside>

        {/* Workspace: Content Injection */}
        <section className="bg-[#111115]/80 backdrop-blur-xl border border-white/5 rounded-[40px] shadow-2xl flex flex-col overflow-hidden group">
          <div className="px-10 py-5 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
             <span className="text-[10px] font-black uppercase tracking-[4px] text-white/20">Active_Workspace</span>
             <div className="flex gap-1.5">
                <div className="size-1.5 rounded-full bg-white/10"></div>
                <div className="size-1.5 rounded-full bg-white/10"></div>
                <div className="size-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
             </div>
          </div>

          <div className="flex-1 p-10 flex flex-col items-center justify-center relative">
            {!file ? (
              <div 
                onClick={() => fileInputRef.current.click()} 
                className="group cursor-pointer flex flex-col items-center p-16 border-2 border-dashed border-white/5 rounded-[40px] hover:border-blue-500/30 transition-all bg-white/[0.01]"
              >
                <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-[30px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="text-blue-500 w-10 h-10" />
                </div>
                <p className="text-xs font-black uppercase tracking-[3px] text-white/40 group-hover:text-white transition-colors">Initialize PDF Stream</p>
              </div>
            ) : (
              <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4">
                    <label className="text-[10px] text-blue-400 font-black uppercase tracking-[3px] flex items-center gap-2">
                        <Type size={14}/> Injection Buffer (Footer Overlay)
                    </label>
                    <textarea 
                        value={overlayText}
                        onChange={e => setOverlayText(e.target.value)}
                        placeholder="Enter system string to overlay on all pages..."
                        className="w-full h-48 bg-black/40 border border-white/5 rounded-[32px] p-8 text-sm outline-none focus:border-blue-500/40 focus:ring-1 ring-blue-500/20 resize-none italic text-white/80"
                    />
                </div>
                
                <div className="flex items-start gap-4 p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
                    <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-200/50 leading-relaxed uppercase font-bold tracking-wider">
                        Nexus Ghost Engine: Deep-layer text injection is non-destructive. Content is layered over the existing stream.
                    </p>
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