import React, { useState, useRef } from 'react';
import { 
  Upload, FileCheck, Download, Zap, RefreshCw, 
  Settings, Layers, ChevronLeft, ShieldCheck, Activity 
} from 'lucide-react';
import { compressPDF, formatFileSize, validatePDF } from '../utils/pdfCompressor';

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
  const fileInputRef = useRef(null);

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
            <Zap size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[2px] text-blue-400">Optimization Engine v2.4</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tight">
            PDF <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">Compressor</span>
          </h1>
          <p className="text-white/40 mt-3 font-medium">Reduce document footprint while maintaining structural integrity.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          
          {/* --- SETTINGS SIDEBAR --- */}
          <aside className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 shadow-2xl backdrop-blur-md sticky top-32">
              <div className="flex items-center gap-2 mb-6 text-blue-400 font-bold uppercase text-[10px] tracking-widest">
                <Settings className="w-4 h-4" /> Parameters
              </div>

              <div className="space-y-8">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Intensity</label>
                    <span className="text-[10px] font-bold text-blue-400">{(options.quality * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="1.0" step="0.1" 
                    value={options.quality}
                    onChange={(e) => setOptions({...options, quality: parseFloat(e.target.value)})}
                    className="w-full accent-blue-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase">
                    <span>Smallest</span>
                    <span>HD</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${options.grayscale ? 'bg-blue-600' : 'bg-white/10'}`}>
                      <input 
                        type="checkbox" className="hidden" 
                        checked={options.grayscale}
                        onChange={(e) => setOptions({...options, grayscale: e.target.checked})}
                      />
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${options.grayscale ? 'left-6' : 'left-1'}`} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-white/40 group-hover:text-white transition-colors">Grayscale</span>
                  </label>
                </div>

                <button 
                  onClick={onCompress}
                  disabled={!file || isProcessing}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-blue-500 disabled:opacity-20 transition-all shadow-xl shadow-blue-900/20"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                  {isProcessing ? `Optimizing ${progress}%` : "Run Compression"}
                </button>
              </div>
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[24px] flex gap-3">
              <ShieldCheck className="text-blue-500 shrink-0" size={20} />
              <p className="text-[10px] leading-relaxed text-blue-200/50 font-bold uppercase tracking-wider">
                Local computation active. Files never leave your browser buffer.
              </p>
            </div>
          </aside>

          {/* --- WORKSPACE --- */}
          <section className="bg-white/[0.03] border border-white/5 rounded-[32px] min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-white/30">Buffer Zone</span>
              {isProcessing && (
                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase animate-pulse">
                  <Activity className="w-3 h-3" /> Processing...
                </div>
              )}
            </div>

            <div className="flex-1 p-8 flex flex-col items-center justify-center">
              {!result ? (
                <div 
                  className={`w-full h-full max-w-2xl border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group ${
                    isDragging ? "bg-blue-500/10 border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.1)]" : "border-white/5 hover:border-white/10"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 bg-blue-500/5 rounded-[32px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-blue-500/10 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                    <Upload className="text-blue-500 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase">{file ? file.name : "Load PDF Payload"}</h3>
                  <p className="text-white/20 text-[10px] mt-2 uppercase tracking-widest font-black">
                    {file ? `${formatFileSize(file.size)} detected` : "Drag and drop or click to initialize"}
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-lg text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-blue-500/10 rounded-[32px] flex items-center justify-center mb-8 mx-auto border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                    <FileCheck className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-4xl font-black italic uppercase mb-2">Success</h3>
                  <div className="flex items-center justify-center gap-4 mb-10">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-white/20 uppercase">Before</p>
                      <p className="font-bold text-white/60">{formatFileSize(result.originalSize)}</p>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="bg-blue-600/20 px-4 py-2 rounded-xl border border-blue-500/30">
                      <p className="text-[10px] font-black text-blue-400 uppercase">Saving</p>
                      <p className="text-xl font-black italic text-blue-500">-{result.compressionRatio}%</p>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="text-left">
                      <p className="text-[10px] font-black text-white/20 uppercase">After</p>
                      <p className="font-bold text-white">{formatFileSize(result.compressedSize)}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setResult(null)} className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                      Reset
                    </button>
                    <a 
                      href={URL.createObjectURL(result.blob)} 
                      download={result.filename}
                      className="flex-[2] py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-xl"
                    >
                      <Download size={14} /> Download Optimized
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

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
}