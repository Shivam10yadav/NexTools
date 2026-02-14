import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, Download, Image as ImageIcon, Lock, Type, MousePointer2, Eraser, Info, HelpCircle, FileText, Zap } from 'lucide-react';

export default function PrivacyRedactor() {
  const [mode, setMode] = useState('image'); // 'image' or 'text'
  const [image, setImage] = useState(null);
  const [manualText, setManualText] = useState("// SYSTEM LOG OVERRIDE\nUser: Admin_Root\nPass: ************\nSession: 0x88291-ALPHA\n\nType your sensitive logs here and draw over them.");
  const [rects, setRects] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentRect, setCurrentRect] = useState(null);
  
  const canvasRef = useRef(null);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (mode === 'image' && image) {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    } else if (mode === 'text') {
      canvas.width = 1200;
      canvas.height = 800;
      // NexTools Dark Document Theme
      ctx.fillStyle = '#0a0a0c'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px "JetBrains Mono", monospace';
      
      const lines = manualText.split('\n');
      lines.forEach((line, i) => {
        ctx.fillText(line, 60, 80 + (i * 40));
      });
    }

    // Redaction Processing
    rects.forEach((rect) => {
      ctx.save();
      // Apply Heavy Blur
      ctx.filter = 'blur(25px)';
      ctx.drawImage(canvas, rect.x, rect.y, rect.w, rect.h, rect.x, rect.y, rect.w, rect.h);
      ctx.filter = 'none';
      // Apply Deep Black Mask
      ctx.fillStyle = '#000000';
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      // Neon Border indicator
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
    });

    if (currentRect) {
      ctx.strokeStyle = '#3b82f6';
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(currentRect.x, currentRect.y, currentRect.w, currentRect.h);
    }
  };

  useEffect(() => { drawCanvas(); }, [image, mode, manualText, rects, currentRect]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => { setImage(img); setRects([]); setMode('image'); };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white p-6 lg:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* NEON HEADER SECTION */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8 border-b border-white/5 pb-10">
          <div className="flex items-center gap-6">
            <div className="size-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <ShieldAlert size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                Privacy<span className="text-blue-500">Redactor</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-[3px]">Secure Workshop Engine</p>
              </div>
            </div>
          </div>

          <div className="flex bg-[#111115] p-2 rounded-2xl border border-white/5">
            <button 
              onClick={() => {setMode('image'); setRects([]);}} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'image' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/40 hover:bg-white/5'}`}
            >
              <ImageIcon size={14}/> Image Mode
            </button>
            <button 
              onClick={() => {setMode('text'); setRects([]);}} 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'text' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/40 hover:bg-white/5'}`}
            >
              <Type size={14}/> Manual Mode
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* EDITOR AREA */}
          <div className="lg:col-span-8 space-y-8">
            {mode === 'text' && (
              <div className="bg-[#111115] p-8 rounded-[40px] border border-white/5 shadow-2xl">
                <div className="flex items-center gap-2 mb-4 text-blue-500">
                  <Zap size={14} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Typewriter Input</span>
                </div>
                <textarea 
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  className="w-full h-40 bg-black/40 border border-white/5 rounded-3xl p-6 font-mono text-sm outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            )}

            <div className="bg-[#111115] border border-white/5 rounded-[50px] p-4 flex items-center justify-center min-h-[600px] shadow-2xl overflow-hidden relative group">
              {!image && mode === 'image' ? (
                <label className="cursor-pointer flex flex-col items-center gap-6 p-20">
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                  <div className="size-20 bg-blue-600/10 rounded-full flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <ImageIcon className="text-blue-500" size={32} />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-black uppercase tracking-[2px]">Drop Screenshot</span>
                    <span className="text-[9px] text-white/20 uppercase font-bold mt-2 block tracking-widest">JPEG, PNG, WEBP</span>
                  </div>
                </label>
              ) : (
                <div className="relative">
                  <canvas 
                    ref={canvasRef} 
                    onMouseDown={(e) => {
                      const pos = getMousePos(e);
                      setIsDrawing(true);
                      setCurrentRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
                    }}
                    onMouseMove={(e) => {
                      if (!isDrawing) return;
                      const pos = getMousePos(e);
                      setCurrentRect(prev => ({ ...prev, w: pos.x - prev.x, h: pos.y - prev.y }));
                    }}
                    onMouseUp={() => {
                      if (currentRect && Math.abs(currentRect.w) > 5) setRects([...rects, currentRect]);
                      setIsDrawing(false);
                      setCurrentRect(null);
                    }}
                    className="max-w-full h-auto rounded-3xl shadow-2xl cursor-crosshair"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR GUIDE */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#111115] border border-white/5 rounded-[40px] p-8 shadow-2xl">
              <h2 className="text-[10px] font-black uppercase tracking-[4px] text-white/30 mb-8 flex items-center gap-2">
                <Info size={14} /> Documentation
              </h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex gap-4">
                  <div className="size-8 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 font-black text-xs">1</div>
                  <p className="text-[11px] text-white/60 leading-relaxed uppercase font-bold tracking-tight pt-1">
                    {mode === 'image' ? "Upload your sensitive screenshot." : "Type out the text containing private data."}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="size-8 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 font-black text-xs">2</div>
                  <p className="text-[11px] text-white/60 leading-relaxed uppercase font-bold tracking-tight pt-1">
                    Click & drag directly on the preview to place redaction bars.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="size-8 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 font-black text-xs">3</div>
                  <p className="text-[11px] text-white/60 leading-relaxed uppercase font-bold tracking-tight pt-1">
                    Export your secure image. All data is wiped when you leave.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = 'nextools_redacted.png';
                    link.href = canvasRef.current.toDataURL('image/png');
                    link.click();
                  }}
                  disabled={mode === 'image' && !image}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white rounded-[24px] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[3px] transition-all shadow-xl shadow-blue-600/20"
                >
                  <Download size={18} /> Export Safe Image
                </button>
                <button 
                  onClick={() => {setRects([]); setImage(null);}} 
                  className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-[24px] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[3px] transition-all border border-white/5"
                >
                  <Eraser size={18} /> Clear Workshop
                </button>
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-2 bg-emerald-500 rounded-full" />
                <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Privacy Verification</span>
              </div>
              <p className="text-[10px] text-white/40 font-medium leading-relaxed italic">
                "Zero-Knowledge Redaction: The browser processes pixels locally. No packets containing your data are sent to any server."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}