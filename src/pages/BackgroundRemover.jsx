import React, { useState, useRef } from 'react';
// Corrected import with alias to avoid naming conflicts
import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal';
import { 
  Eraser, Upload, Download, X, 
  Settings, ChevronLeft, RefreshCcw, ShieldCheck 
} from 'lucide-react';

const BackgroundRemover = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage({
        file,
        preview: URL.createObjectURL(file),
        name: file.name
      });
      setResult(null);
      setLoadingProgress(0);
    }
    // Reset input so user can upload the same file again if needed
    e.target.value = null;
  };

  const handleRemoveBackground = async () => {
    if (!image) return;
    setIsProcessing(true);
    setLoadingProgress(0);

    try {
      // Logic runs 100% in-browser
      const blob = await imglyRemoveBackground(image.preview, {
        progress: (status, progress) => {
          // Status can be 'fetching' or 'processing'
          setLoadingProgress(Math.round(progress * 100));
        }
      });
      
      const url = URL.createObjectURL(blob);
      setResult(url);
    } catch (error) {
      console.error("AI Processing Error:", error);
      alert("Failed to process image. Make sure you have a stable connection for the initial AI model download.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 pt-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />

      <main className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <h1 className="text-4xl font-bold tracking-tight">BG <span className="text-blue-500">Remover</span></h1>
          <p className="text-white/40 mt-2">Professional AI background removal. Private & Secure.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-6 text-blue-400">
                <Settings size={18} />
                <h2 className="text-[11px] font-bold uppercase tracking-widest">Controls</h2>
              </div>
              
              <div className="space-y-6">
                <button 
                  onClick={handleRemoveBackground}
                  disabled={!image || isProcessing}
                  className="w-full py-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 transition-all font-black text-xs uppercase tracking-[2px] shadow-xl flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCcw className="animate-spin" size={16} /> : "Remove Background"}
                </button>

                {result && (
                  <a 
                    href={result} 
                    download={`NexTools-no-bg-${image.name.split('.')[0]}.png`}
                    className="w-full py-4 rounded-2xl bg-white text-black hover:bg-white/90 transition-all font-black text-xs uppercase tracking-[2px] flex items-center justify-center gap-2 text-center"
                  >
                    Download PNG <Download size={16} />
                  </a>
                )}
              </div>
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[24px] flex gap-3">
              <ShieldCheck className="text-blue-500 shrink-0" size={20} />
              <p className="text-[10px] leading-relaxed text-blue-200/50 font-medium uppercase tracking-wider">
                The AI model runs in your browser via WASM. No data is sent to a server.
              </p>
            </div>
          </aside>

          {/* Main Action Area */}
          <section className="bg-white/[0.03] border border-white/5 rounded-[32px] min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />

            {!image ? (
              <div 
                className="flex-1 flex flex-col items-center justify-center p-12 cursor-pointer group"
                onClick={() => fileInputRef.current.click()}
              >
                <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-6 text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Select an Image</h3>
                <p className="text-white/30 text-sm">Works best for people and products</p>
              </div>
            ) : (
              <div className="flex-1 p-8 flex flex-col items-center justify-center">
                <div className="relative max-w-lg w-full rounded-2xl overflow-hidden border border-white/10 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-repeat">
                  <img 
                    src={result || image.preview} 
                    alt="preview" 
                    className={`relative z-10 w-full h-auto object-contain transition-all duration-700 ${isProcessing ? 'blur-sm grayscale' : ''}`} 
                  />
                  
                  {!isProcessing && (
                    <button 
                      onClick={() => { setImage(null); setResult(null); }}
                      className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md p-2 rounded-xl text-white hover:bg-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                
               {isProcessing && (
  <div className="mt-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 max-w-xs backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <RefreshCcw size={14} className="text-blue-500 animate-spin" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1">
            Processing Locally
          </p>
          <p className="text-[10px] leading-relaxed text-white/50 font-medium">
            Please be patient. We are downloading a heavy AI model (approx. 30MB) 
            directly to your browser so your images **never** touch a server. 
            This takes a moment, but your privacy is worth it.
          </p>
        </div>
      </div>
    </div>
    
    {/* Subtle Loading Text */}
    <p className="mt-4 text-[9px] font-black uppercase tracking-[3px] text-white/10 animate-pulse">
      Analyzing pixels... stay on this page
    </p>
  </div>
)}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default BackgroundRemover;