import React, { useState, useCallback } from 'react';
import { compressPDF, formatFileSize, validatePDF } from '../utils/pdfCompressor'; // Assuming your logic is here

export default function PDFCompressor() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState({
    quality: 0.7,
    scale: 1.2,
    grayscale: false,
  });

  const handleFile = (selectedFile) => {
    const validation = validatePDF(selectedFile);
    if (validation.valid) {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert(validation.error);
    }
  };

  const onCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    const res = await compressPDF(file, options, (p) => setProgress(p));
    setResult(res);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white/90 flex flex-col items-center p-6 md:p-12 relative overflow-x-hidden font-sans">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#14141a_0%,#0a0a0c_70%)] pointer-events-none" />

      <header className="relative text-center mb-12 max-w-[1000px] w-full">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Compress PDF</h1>
        <p className="text-white/60">Shrink your files without losing professional quality</p>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 w-full max-w-[1000px]">
        
        {/* Settings Panel */}
        <aside className="bg-[#111115] border border-white/10 rounded-2xl p-5 shadow-2xl h-fit lg:sticky lg:top-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 text-blue-400">Settings</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium text-white/40 uppercase">Compression Level</label>
              <input 
                type="range" min="0.1" max="1.0" step="0.1" 
                value={options.quality}
                onChange={(e) => setOptions({...options, quality: parseFloat(e.target.value)})}
                className="w-full accent-blue-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/30">
                <span>Smallest File</span>
                <span>Best Quality</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={options.grayscale}
                  onChange={(e) => setOptions({...options, grayscale: e.target.checked})}
                  className="w-4 h-4 rounded border-white/10 accent-blue-500"
                />
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">Grayscale Mode</span>
              </label>
            </div>

            <button 
              onClick={onCompress}
              disabled={!file || isProcessing}
              className="w-full py-3 rounded-full bg-white text-black hover:bg-white/90 transition-all text-sm font-bold disabled:opacity-40 shadow-xl"
            >
              {isProcessing ? `Processing ${progress}%` : "Compress PDF"}
            </button>
          </div>
        </aside>

        {/* Upload/Results Section */}
        <section className="bg-[#111115] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden min-h-[400px]">
          {!result ? (
            <div 
              className={`flex-1 flex flex-col items-center justify-center p-12 transition-all ${isDragging ? "bg-blue-500/5 border-2 border-dashed border-blue-500/50" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                 <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
              </div>
              <p className="text-white font-medium mb-1">{file ? file.name : "Select a PDF file"}</p>
              <p className="text-white/40 text-sm mb-6">{file ? formatFileSize(file.size) : "Drop your file here or click to browse"}</p>
              
              <label className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-xs cursor-pointer">
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                Browse Files
              </label>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-blue-500/5">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Compression Complete!</h3>
              <p className="text-white/60 mb-8 max-w-sm">
                Your file was reduced by <span className="text-blue-400 font-bold">{result.compressionRatio}%</span> ({formatFileSize(result.originalSize)} → {formatFileSize(result.compressedSize)})
              </p>
              
              <div className="flex gap-4">
                <button onClick={() => setResult(null)} className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-all">
                  Compress Another
                </button>
                <a 
                  href={URL.createObjectURL(result.blob)} 
                  download={result.filename}
                  className="px-8 py-3 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform text-sm shadow-xl"
                >
                  Download PDF
                </a>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer (Same as Text tool) */}
      <footer className="mt-auto py-12">
        <a href="https://www.instagram.com/shivam05_10" target="_blank" className="text-[10px] text-white/40 hover:text-white/60 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 transition-all">
          Coded by ShivamYadav
        </a>
      </footer>
    </div>
  );
}