import { useState, useRef } from "react";
import heic2any from "heic2any";
import { 
  Upload, ImageIcon, Download, RefreshCw, AlertCircle, 
  FileImage, Settings, ChevronLeft, Activity, ShieldCheck, Zap
} from 'lucide-react';

export default function ImageConverter() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [format, setFormat] = useState("image/png");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  async function convert() {
    if (!file) return;
    setLoading(true);
    setOutput(null);
    setError("");

    let source = file;
    if (file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic")) {
      try {
        source = await heic2any({ blob: file, toType: format });
      } catch (err) {
        setError("HEIC conversion failed. File may be corrupted.");
        setLoading(false);
        return;
      }
    }

    const img = new Image();
    img.src = URL.createObjectURL(source);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (format === "image/jpeg") {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        setOutput(URL.createObjectURL(blob));
        setLoading(false);
      }, format, 0.95);
    };
    img.onerror = () => {
      setError("Failed to load image preview.");
      setLoading(false);
    };
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.startsWith("image/") || droppedFile.name.toLowerCase().endsWith(".heic"))) {
      setFile(droppedFile);
      setOutput(null);
      setError("");
    } else {
      setError("Please drop a valid image file.");
    }
  };

  const reset = () => {
    setFile(null);
    setOutput(null);
    setError("");
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
            <span className="text-[9px] font-black uppercase tracking-[2px] text-blue-400">Imaging Lab v1.0</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tight">
            Image <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">Converter</span>
          </h1>
          <p className="text-white/40 mt-3 font-medium font-sans">Instant format transformation with zero server overhead.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          
          {/* --- SETTINGS SIDEBAR --- */}
          <aside className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 shadow-2xl backdrop-blur-md sticky top-32">
              <div className="flex items-center gap-2 mb-6 text-blue-400 font-bold uppercase text-[10px] tracking-widest">
                <Settings className="w-4 h-4" /> Configuration
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-white/30 font-black uppercase tracking-widest">Target Architecture</label>
                  <select 
                    value={format} 
                    onChange={(e) => { setFormat(e.target.value); setOutput(null); }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 transition-all cursor-pointer appearance-none hover:bg-white/[0.07]"
                  >
                    <option value="image/png" className="bg-[#111115]">PNG (Lossless)</option>
                    <option value="image/jpeg" className="bg-[#111115]">JPG (Standard)</option>
                    <option value="image/webp" className="bg-[#111115]">WEBP (Modern)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <button 
                    onClick={convert} 
                    disabled={!file || loading}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-blue-500 disabled:opacity-20 transition-all shadow-xl shadow-blue-900/20"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {loading ? "Processing..." : "Run Conversion"}
                  </button>

                  {output && (
                    <a
                      href={output}
                      download={`converted_${file?.name.split('.')[0]}.${format.split("/")[1]}`}
                      className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[2px] transition-all shadow-xl hover:bg-white/90 animate-in fade-in zoom-in-95"
                    >
                      <Download className="w-4 h-4" /> Download Result
                    </a>
                  )}
                  
                  {file && !loading && (
                    <button onClick={reset} className="w-full py-2 text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors">
                      Eject Source
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[24px] flex gap-3">
              <ShieldCheck className="text-blue-500 shrink-0" size={20} />
              <p className="text-[10px] leading-relaxed text-blue-200/50 font-bold uppercase tracking-wider">
                Privacy Protocol: All rendering occurs on your hardware.
              </p>
            </div>
          </aside>

          {/* --- WORKSPACE --- */}
          <section className="bg-white/[0.03] border border-white/5 rounded-[32px] min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-white/30">Imaging Buffer</span>
              {loading && (
                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase animate-pulse">
                  <Activity className="w-3 h-3" /> Converting...
                </div>
              )}
            </div>

            <div 
              className={`relative flex-1 p-8 transition-all flex flex-col items-center justify-center ${isDragging ? "bg-blue-500/10" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {!file ? (
                <div 
                  className="w-full h-full max-w-2xl border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group border-white/5 hover:border-white/10"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 bg-blue-500/5 rounded-[32px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-blue-500/10 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                    <ImageIcon className="text-blue-500 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase">Load Imaging Payload</h3>
                  <p className="text-white/20 text-[10px] mt-2 uppercase tracking-widest font-black">Drop or Click to Initialize</p>
                </div>
              ) : (
                <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-500">
                  <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 flex items-center gap-6 shadow-2xl">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-[20px] flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                      <FileImage className="text-blue-500 w-10 h-10" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-black italic uppercase truncate tracking-tight">{file.name}</p>
                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB Payload</p>
                    </div>
                  </div>
                  
                  {/* --- CONVERSION PATH VISUALIZER --- */}
                  <div className="mt-12 flex items-center justify-between px-10 relative">
                     <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />
                     
                     <div className="bg-[#0a0a0c] px-4">
                        <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-1">Source</p>
                        <p className="text-xl font-black italic text-white/60 uppercase">{file.name.split('.').pop()}</p>
                     </div>

                     <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                        <RefreshCw className={`w-5 h-5 text-blue-500 ${loading ? 'animate-spin' : ''}`} />
                     </div>

                     <div className="bg-[#0a0a0c] px-4 text-right">
                        <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-1">Target</p>
                        <p className="text-xl font-black italic text-blue-500 uppercase">{format.split("/")[1]}</p>
                     </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mx-8 mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-bottom-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.heic,.HEIC"
                   onChange={(e) => { setFile(e.target.files[0]); setOutput(null); setError(""); }} />
          </section>
        </div>
      </main>

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