import React, { useState, useRef } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { 
  Upload, Type, Download, RefreshCw, AlertCircle, 
  ShieldAlert, Sliders, LayoutGrid, Square, ChevronLeft,
  Activity, ShieldCheck, PenTool
} from 'lucide-react';

const PDFWatermarker = () => {
  const [file, setFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [mode, setMode] = useState('single'); // 'single' or 'tile'
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(-45);
  const [fontSize, setFontSize] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const applyWatermark = async () => {
    if (!file || !watermarkText) return;
    setIsProcessing(true);
    setError('');

    try {
      const fileArrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const config = {
          size: parseInt(fontSize),
          font: helveticaFont,
          color: rgb(0.5, 0.5, 0.5),
          opacity: parseFloat(opacity),
          rotate: degrees(rotation),
        };

        if (mode === 'single') {
          page.drawText(watermarkText, {
            ...config,
            x: width / 2 - (watermarkText.length * fontSize) / 4,
            y: height / 2,
          });
        } else {
          const stepX = 250;
          const stepY = 250;
          for (let x = 0; x < width; x += stepX) {
            for (let y = 0; y < height; y += stepY) {
              page.drawText(watermarkText, {
                ...config,
                x: x,
                y: y,
                size: fontSize / 2,
              });
            }
          }
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${mode}_watermarked_${file.name}`;
      link.click();
      URL.revokeObjectURL(url);
      setIsProcessing(false);
    } catch (err) {
      setError('Failed to process PDF.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 pt-32 relative overflow-hidden selection:bg-blue-500/30 font-sans">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none" />

      <main className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <header className="mb-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white/40 hover:text-blue-400 mb-6 transition group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <ShieldAlert size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[2px] text-blue-400">Security Overlay v4.0</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tight">
            PDF <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">Watermarker</span>
          </h1>
          <p className="text-white/40 mt-3 font-medium">Embed immutable ownership markers across your document architecture.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
          
          {/* --- CONFIGURATION SIDEBAR --- */}
          <aside className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 shadow-2xl backdrop-blur-md sticky top-32">
              <div className="flex items-center gap-2 mb-6 text-blue-400 font-bold uppercase text-[10px] tracking-widest">
                <Sliders className="w-4 h-4" /> Control Console
              </div>

              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-white/30 font-black uppercase tracking-widest">Marking Protocol</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                    <button 
                      onClick={() => setMode('single')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${mode === 'single' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'text-white/30 hover:text-white/60'}`}
                    >
                      <Square className="w-3 h-3" /> Center
                    </button>
                    <button 
                      onClick={() => setMode('tile')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${mode === 'tile' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'text-white/30 hover:text-white/60'}`}
                    >
                      <LayoutGrid className="w-3 h-3" /> Grid
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-white/30 font-black uppercase tracking-widest">Content Signature</label>
                  <input 
                    type="text" value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Enter Watermark..."
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-[9px] text-white/30 font-black uppercase tracking-widest">Scale</label>
                     <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold mt-1 outline-none focus:border-blue-500/50" />
                   </div>
                   <div>
                     <label className="text-[9px] text-white/30 font-black uppercase tracking-widest">Angle (°)</label>
                     <input type="number" value={rotation} onChange={(e) => setRotation(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm font-bold mt-1 outline-none focus:border-blue-500/50" />
                   </div>
                </div>

                <button 
                  onClick={applyWatermark}
                  disabled={!file || isProcessing}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-blue-500 disabled:opacity-20 transition-all shadow-xl shadow-blue-900/20 mt-4"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
                  Generate Overlay
                </button>
              </div>
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[24px] flex gap-3">
              <ShieldCheck className="text-blue-500 shrink-0" size={20} />
              <p className="text-[10px] leading-relaxed text-blue-200/50 font-bold uppercase tracking-wider">
                Encryption active. Your document is processed entirely within local memory.
              </p>
            </div>
          </aside>

          {/* --- WORKSPACE / PREVIEW --- */}
          <section className="bg-white/[0.03] border border-white/5 rounded-[32px] min-h-[600px] flex flex-col relative overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-white/30">Schematic Preview</span>
              {isProcessing && (
                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase animate-pulse">
                  <Activity className="w-3 h-3" /> Processing...
                </div>
              )}
            </div>

            <div className="flex-1 p-8 flex flex-col items-center justify-center" onClick={() => !file && fileInputRef.current?.click()}>
              {!file ? (
                <div className="flex flex-col items-center cursor-pointer group">
                  <div className="w-24 h-24 bg-blue-500/5 rounded-[32px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-blue-500/10 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                    <Type className="text-blue-500 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase">Initialize PDF</h3>
                  <p className="text-white/20 text-[10px] mt-2 uppercase tracking-widest font-black">Secure Payload Intake</p>
                </div>
              ) : (
                <div className="w-full max-w-md relative bg-white rounded-[12px] border-[12px] border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden aspect-[3/4] animate-in zoom-in duration-500">
                  {/* Dummy text content to mimic a PDF */}
                  <div className="p-8 space-y-4 opacity-[0.05] pointer-events-none">
                    <div className="h-6 w-1/3 bg-slate-900 rounded" />
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className={`h-2 rounded bg-slate-800 ${i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-5/6' : 'w-4/6'}`} />
                    ))}
                  </div>
                  
                  {/* Real-time CSS Simulation of PDF-Lib Logic */}
                  <div className="absolute inset-0 flex flex-wrap items-center justify-center pointer-events-none p-4 overflow-hidden">
                    {mode === 'single' ? (
                      <div 
                        style={{ 
                          opacity, 
                          transform: `rotate(${rotation}deg)`, 
                          fontSize: `${fontSize/3}px` 
                        }} 
                        className="font-black text-slate-900 whitespace-nowrap"
                      >
                        {watermarkText}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-8">
                        {[...Array(12)].map((_, i) => (
                          <div 
                            key={i} 
                            style={{ 
                              opacity, 
                              transform: `rotate(${rotation}deg)`, 
                              fontSize: `${fontSize/6}px` 
                            }} 
                            className="font-black text-slate-900 whitespace-nowrap"
                          >
                            {watermarkText}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="m-8 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-bottom-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}
          </section>
        </div>
      </main>

      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
      
      {/* --- FOOTER --- */}
      <footer className="mt-20 py-10 flex flex-col items-center gap-4 opacity-30 border-t border-white/5">
         <p className="text-[9px] font-black uppercase tracking-[5px]">NexTools Workshop Ecosystem</p>
         <div className="flex items-center gap-4">
            <span className="h-[1px] w-8 bg-blue-600/50" />
            <a href="https://instagram.com/shivam05_10" target="_blank" className="text-[10px] hover:text-blue-400 transition-colors"> शिवम यादव </a>
            <span className="h-[1px] w-8 bg-blue-600/50" />
         </div>
      </footer>
    </div>
  );
};

export default PDFWatermarker;