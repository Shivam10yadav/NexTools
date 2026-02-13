import React, { useState, useRef } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { Upload, Download, Type, RefreshCw, AlertCircle, ShieldAlert, Sliders, LayoutGrid, Square } from 'lucide-react';

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
          // Center Placement
          page.drawText(watermarkText, {
            ...config,
            x: width / 2 - (watermarkText.length * fontSize) / 4,
            y: height / 2,
          });
        } else {
          // Tile Mode (Grid)
          const stepX = 250;
          const stepY = 250;
          for (let x = 0; x < width; x += stepX) {
            for (let y = 0; y < height; y += stepY) {
              page.drawText(watermarkText, {
                ...config,
                x: x,
                y: y,
                size: fontSize / 2, // Smaller for tiles
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
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white/90 flex flex-col items-center p-6 md:p-12 font-sans relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#14141a_0%,#0a0a0c_70%)] pointer-events-none" />

      <header className="relative text-center mb-12 w-full max-w-[1000px]">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">PDF Watermarker</h1>
        <p className="text-white/60">Choose between single stamp or secure tile patterns</p>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 w-full max-w-[1200px]">
        
        {/* Sidebar Controls */}
        <aside className="bg-[#111115] border border-white/10 rounded-2xl p-6 shadow-2xl h-fit lg:sticky lg:top-6 space-y-6">
          <div className="flex items-center gap-2 mb-2 text-blue-400 font-semibold uppercase text-xs tracking-widest">
            <Sliders className="w-4 h-4" /> Configuration
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-white/40 uppercase font-bold">Watermark Mode</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                <button 
                  onClick={() => setMode('single')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs transition-all ${mode === 'single' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  <Square className="w-3 h-3" /> Single
                </button>
                <button 
                  onClick={() => setMode('tile')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs transition-all ${mode === 'tile' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  <LayoutGrid className="w-3 h-3" /> Tile
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-white/40 uppercase font-bold">Watermark Text</label>
              <input 
                type="text" value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-[10px] text-white/40 uppercase font-bold">Size</label>
                 <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm mt-1" />
               </div>
               <div>
                 <label className="text-[10px] text-white/40 uppercase font-bold">Rotation</label>
                 <input type="number" value={rotation} onChange={(e) => setRotation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm mt-1" />
               </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={applyWatermark}
                disabled={!file || isProcessing}
                className="w-full py-4 bg-white text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-20 transition-all shadow-xl"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                Process PDF
              </button>
            </div>
          </div>
        </aside>

        {/* Workspace */}
        <section className="bg-[#111115] border border-white/10 rounded-3xl shadow-2xl flex flex-col min-h-[500px] overflow-hidden">
          <div className="px-8 py-4 border-b border-white/5 bg-white/[0.01] flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
            Live Preview Simulation
          </div>

          <div className="flex-1 p-8 flex flex-col items-center justify-center" onClick={() => !file && fileInputRef.current?.click()}>
            {!file ? (
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 group-hover:border-blue-500/50 border border-white/10 transition-all">
                  <Type className="text-blue-500 w-10 h-10" />
                </div>
                <h3 className="text-lg font-medium">Click to select PDF</h3>
              </div>
            ) : (
              <div className="w-full max-w-sm relative bg-white rounded border-[6px] border-white shadow-2xl overflow-hidden aspect-[3/4]">
                <div className="p-4 space-y-3 opacity-10">
                    {[...Array(8)].map((_, i) => <div key={i} className={`h-3 rounded bg-slate-400 ${i % 2 === 0 ? 'w-full' : 'w-3/4'}`} />)}
                </div>
                
                {/* Visual Simulation of the Code's Logic */}
                <div className="absolute inset-0 flex flex-wrap items-center justify-center pointer-events-none p-4 overflow-hidden">
                  {mode === 'single' ? (
                    <div style={{ opacity, transform: `rotate(${rotation}deg)`, fontSize: `${fontSize/3}px` }} className="font-bold text-slate-800">
                      {watermarkText}
                    </div>
                  ) : (
                    [...Array(12)].map((_, i) => (
                      <div key={i} style={{ opacity, transform: `rotate(${rotation}deg)`, fontSize: `${fontSize/6}px` }} className="font-bold text-slate-800 m-4">
                        {watermarkText}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
      
      <footer className="mt-20 mb-10">
        <a href="https://www.instagram.com/shivam05_10" target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/30 hover:text-white/60 px-5 py-2.5 bg-white/5 rounded-full border border-white/5 transition-all">
          Coded by ShivamYadav
        </a>
      </footer>
    </div>
  );
};

export default PDFWatermarker;