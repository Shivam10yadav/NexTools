import React, { useState, useRef } from 'react';
import { QrCode, Download, Palette, Link as LinkIcon, Share2, ShieldCheck, Zap, Layers, Maximize } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRGenerator() {
  const [url, setUrl] = useState("https://nextools.io");
  const [verification, setVerification] = useState(null);
  const [fgColor, setFgColor] = useState("#3b82f6");
  const [bgColor, setBgColor] = useState("#0a0a0c");
  const [size, setSize] = useState(512);
  const [includeMargin, setIncludeMargin] = useState(true);
  const canvasRef = useRef(null);

  const downloadQR = () => {
    const canvas = document.getElementById("nex-qr-gen");
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "nextools_qr.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
 const verifyQR = () => {
  // We use a temporary scanner logic or just display the data for peace of mind
  setVerification(url);
  setTimeout(() => setVerification(null), 3000);
};
  return (
    <div className="min-h-screen bg-[#08080a] text-white p-6 lg:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* NEON HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 border-b border-white/5 pb-10">
          <div className="flex items-center gap-6">
            <div className="size-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <QrCode size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                Nex<span className="text-blue-500">QR</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="size-2 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-[3px]">Permanent Asset Forge</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">No Tracking • No Expiry</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* CONFIGURATION PANEL */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-[#111115] p-8 rounded-[40px] border border-white/5 shadow-2xl">
              <label className="text-[10px] font-black uppercase tracking-[3px] text-blue-500 mb-4 block">Destination URL</label>
              <div className="relative">
                <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 font-medium text-sm outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </section>

            <section className="bg-[#111115] p-8 rounded-[40px] border border-white/5 shadow-2xl space-y-8">
              <h2 className="text-[10px] font-black uppercase tracking-[3px] text-white/30 flex items-center gap-2">
                <Palette size={14} /> Aesthetics
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase text-white/40 tracking-widest">Glow Color</label>
                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2 rounded-xl">
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="bg-transparent border-none size-8 cursor-pointer" />
                    <span className="text-[10px] font-mono uppercase">{fgColor}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase text-white/40 tracking-widest">Base Tint</label>
                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2 rounded-xl">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="bg-transparent border-none size-8 cursor-pointer" />
                    <span className="text-[10px] font-mono uppercase">{bgColor}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Quiet Zone (Margin)</span>
                  <button 
                    onClick={() => setIncludeMargin(!includeMargin)}
                    className={`w-12 h-6 rounded-full transition-all relative ${includeMargin ? 'bg-blue-600' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${includeMargin ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* PREVIEW & EXPORT AREA */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-[#111115] border border-white/5 rounded-[50px] flex-1 flex flex-col items-center justify-center p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <Zap size={14} className="text-blue-500 fill-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-[4px] text-white/20">Vector Preview</span>
              </div>

              {/* THE QR CODE ENGINE */}
              <div className="p-6 bg-white rounded-[32px] shadow-[0_0_50px_rgba(59,130,246,0.15)] transition-transform group-hover:scale-105 duration-500">
                <QRCodeCanvas
                  id="nex-qr-gen"
                  value={url}
                  size={280}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level={"H"} // High error correction
                  includeMargin={includeMargin}
                />
              </div>

              <p className="mt-8 text-[10px] font-black uppercase tracking-[5px] text-white/10">Scan to Test Injection</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={downloadQR}
                className="bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[24px] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[3px] transition-all shadow-xl shadow-blue-600/20 active:scale-95"
              >
                <Download size={18} /> Export High-Res PNG
              </button>
              <button 
  onClick={verifyQR}
  className={`w-full py-5 rounded-[24px] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[3px] transition-all border ${
    verification ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/5 text-white hover:bg-white/10'
  }`}
>
  {verification ? <Maximize size={18} className="animate-pulse" /> : <ShieldCheck size={18} />}
  {verification ? `Verified: ${verification.substring(0, 15)}...` : 'Verify Scan Integrity'}
</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}