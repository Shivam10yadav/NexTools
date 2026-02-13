import React, { useState, useRef } from 'react';
import ColorThief from 'colorthief';
import { 
  Palette, Upload, X, Copy, Check, 
  ChevronLeft, LayoutGrid, Zap, Info 
} from 'lucide-react';

const ColorPalette = () => {
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage({ url: URL.createObjectURL(file), name: file.name });
      setColors([]); // Reset palette on new upload
    }
    e.target.value = null;
  };

  const extractPalette = () => {
    const colorThief = new ColorThief();
    const img = imgRef.current;
    
    // We sample 6 colors for a clean UI balance
    const palette = colorThief.getPalette(img, 6);
    const hexPalette = palette.map(rgb => {
      return '#' + rgb.map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    });
    setColors(hexPalette);
  };

  const copyHex = (hex, index) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 pt-32 relative overflow-hidden">
      {/* Background Aesthetic Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />

      <main className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold tracking-tight">Color <span className="text-blue-500">Palette</span></h1>
          <p className="text-white/40 mt-2">Instantly grab dominant HEX codes for your design projects.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          
          {/* Sidebar Controls */}
          <aside className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-6 text-blue-400">
                <Zap size={18} />
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-white/80">Extraction</h2>
              </div>

              <button 
                onClick={extractPalette}
                disabled={!image}
                className="w-full py-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 transition-all font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
              >
                Get Palette
              </button>
            </div>

            {/* Detailed HEX List */}
            {colors.length > 0 && (
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[24px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[2px] mb-4">Values</h3>
                <div className="space-y-2">
                  {colors.map((hex, i) => (
                    <div 
                      key={i} 
                      onClick={() => copyHex(hex, i)}
                      className="flex items-center justify-between bg-white/5 p-2 pr-4 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg border border-white/10 shadow-lg" style={{ backgroundColor: hex }} />
                        <span className="text-xs font-mono uppercase tracking-tight text-white/80">{hex}</span>
                      </div>
                      <div className="text-white/20 group-hover:text-blue-400 transition-colors">
                        {copiedIndex === i ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-[24px] flex gap-3">
              <Info size={18} className="text-blue-500 shrink-0" />
              <p className="text-[9px] text-blue-200/50 uppercase leading-relaxed font-bold tracking-wider">
                Click any color to copy the HEX code to your clipboard.
              </p>
            </div>
          </aside>

          {/* Image & Results Area */}
          <section className="bg-white/[0.03] border border-white/5 rounded-[32px] min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl">
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFile} accept="image/*" />

            {!image ? (
              <div 
                className="flex-1 flex flex-col items-center justify-center p-12 cursor-pointer group" 
                onClick={() => fileInputRef.current.click()}
              >
                <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-6 text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <Palette size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Source Image</h3>
                <p className="text-white/30 text-sm">Designers love this. Try a high-contrast photo.</p>
              </div>
            ) : (
              <div className="flex-1 p-8 flex flex-col items-center justify-center">
                <div className="relative group max-w-2xl w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-[#0d0d12]">
                  <img 
                    ref={imgRef}
                    src={image.url} 
                    alt="Source" 
                    crossOrigin="anonymous" // Essential for reading pixel data
                    className="w-full h-auto object-contain max-h-[50vh]" 
                  />
                  <button 
                    onClick={() => { setImage(null); setColors([]); }} 
                    className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-xl text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Aesthetic Visual Palette Bar */}
                {colors.length > 0 && (
                  <div className="mt-12 w-full max-w-2xl">
                    <div className="flex h-24 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                      {colors.map((hex, i) => (
                        <div 
                          key={i} 
                          className="flex-1 hover:flex-[1.8] transition-all duration-500 cursor-pointer group relative"
                          style={{ backgroundColor: hex }}
                          onClick={() => copyHex(hex, i)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity">
                            {copiedIndex === i ? <Check size={20} className="text-white" /> : <Copy size={20} className="text-white" />}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-center mt-4 text-[10px] font-black uppercase tracking-[5px] text-white/20">
                      Generated Palette
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

export default ColorPalette;