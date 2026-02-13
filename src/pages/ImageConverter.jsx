import { useState, useRef } from "react";
import heic2any from "heic2any";
import { Upload, ImageIcon, Download, RefreshCw, AlertCircle, FileImage, Settings } from 'lucide-react';

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
    // Handle HEIC/HEIF conversion
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
      
      // Handle JPEG background (transparency fix)
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
    if (droppedFile && droppedFile.type.startsWith("image/") || droppedFile.name.toLowerCase().endsWith(".heic")) {
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
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white/90 flex flex-col items-center p-6 md:p-12 relative overflow-x-hidden font-sans selection:bg-blue-500/30">
      {/* Deep Dark Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#14141a_0%,#0a0a0c_70%)] pointer-events-none" />

      <header className="relative text-center mb-12 max-w-[1000px] w-full">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white">Image Converter</h1>
        <p className="text-white/60">Convert HEIC, JPG, PNG, and WEBP instantly in your browser</p>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 w-full max-w-[1000px]">
        
        {/* Settings Sidebar */}
        <aside className="bg-[#111115] border border-white/10 rounded-2xl p-5 shadow-2xl h-fit lg:sticky lg:top-6">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Settings className="w-4 h-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Configuration</h2>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium text-white/40 uppercase">Target Format</label>
              <select 
                value={format} 
                onChange={(e) => { setFormat(e.target.value); setOutput(null); }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-all cursor-pointer appearance-none hover:bg-white/[0.07]"
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
                className="w-full py-3 rounded-full bg-white text-black hover:bg-white/90 transition-all text-sm font-bold disabled:opacity-20 shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {loading ? "Converting..." : "Convert Image"}
              </button>

              {output && (
                <a
                  href={output}
                  download={`converted_${file?.name.split('.')[0]}.${format.split("/")[1]}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-500/20 animate-in fade-in zoom-in-95"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              )}
              
              {file && !loading && (
                <button 
                  onClick={reset}
                  className="w-full py-2 text-xs text-white/40 hover:text-red-400 transition-colors"
                >
                  Clear File
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Upload & Preview Area */}
        <section className="bg-[#111115] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden min-h-[400px]">
          <div className="flex justify-between items-center px-5 py-3 border-b border-white/5 bg-white/[0.02]">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Workspace</span>
            {file && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase">Ready</span>}
          </div>

          <div 
            className={`relative flex-1 p-8 transition-all flex flex-col items-center justify-center ${isDragging ? "bg-blue-500/5" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {!file ? (
              <div 
                className="flex flex-col items-center text-center cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-blue-500/50 group-hover:bg-white/[0.08] transition-all duration-300">
                  <ImageIcon className="text-blue-500 w-10 h-10" />
                </div>
                <h3 className="text-xl font-medium mb-2">Drop your image here</h3>
                <p className="text-white/30 text-sm max-w-[280px]">Convert HEIC from iPhone, or swap between JPG, PNG, and WEBP.</p>
                <button className="mt-6 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs hover:bg-white/10 transition-all">Browse Files</button>
              </div>
            ) : (
              <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                    <FileImage className="text-blue-500 w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate uppercase tracking-tight">{file.name}</p>
                    <p className="text-[10px] text-white/40 font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button onClick={reset} className="p-2 hover:bg-red-500/20 rounded-lg text-white/20 hover:text-red-400 transition-all">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Visual Hint for Conversion */}
                <div className="mt-8 flex items-center justify-center gap-4 text-white/20">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Conversion Path</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                </div>
                
                <div className="mt-4 flex items-center justify-between px-8">
                   <div className="text-center">
                     <p className="text-[10px] text-white/40 uppercase mb-1">Source</p>
                     <p className="text-sm font-bold text-white/80">{file.name.split('.').pop().toUpperCase()}</p>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                     <RefreshCw className="w-3 h-3 text-blue-500" />
                   </div>
                   <div className="text-center">
                     <p className="text-[10px] text-white/40 uppercase mb-1">Target</p>
                     <p className="text-sm font-bold text-blue-400">{format.split("/")[1].toUpperCase()}</p>
                   </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mx-6 mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            onChange={(e) => { setFile(e.target.files[0]); setOutput(null); setError(""); }}
            accept="image/*,.heic,.HEIC"
          />
        </section>
      </main>

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