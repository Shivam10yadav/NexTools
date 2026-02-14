import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { 
  QrCode, Download, RefreshCw, Settings, ChevronLeft, 
  Zap, ShieldCheck, Activity, Copy, Check 
} from 'lucide-react';

const QRGenerator = () => {
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrSvg, setQrSvg] = useState("");
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    margin: 2,
    errorLevel: 'H'
  });

  useEffect(() => {
    if (!text.trim()) {
      setQrDataUrl("");
      setQrSvg("");
      return;
    }

    const timer = setTimeout(() => {
      generateQR(text);
    }, 150);

    return () => clearTimeout(timer);
  }, [text, options]);

  async function generateQR(value) {
    try {
      const dataUrl = await QRCode.toDataURL(value, {
        width: 1024,
        margin: options.margin,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: options.errorLevel,
      });
      setQrDataUrl(dataUrl);

      const svg = await QRCode.toString(value, {
        type: "svg",
        margin: options.margin,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: options.errorLevel,
      });
      setQrSvg(svg);
    } catch (err) {
      console.error("QR generation failed:", err);
    }
  }

  const downloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `nexus-qr-${Date.now()}.png`;
    a.click();
  };

  const downloadSVG = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus-qr-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
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
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white/40 hover:text-blue-400 mb-6 transition group text-sm font-bold uppercase tracking-widest">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Zap size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[2px] text-blue-400">Signal Encoder v2.1</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tight">
            QR <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">Generator</span>
          </h1>
          <p className="text-white/40 mt-3 font-medium">Convert digital assets into high-density machine-readable matrices.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
          
          {/* --- CONFIGURATION SIDEBAR --- */}
          <aside className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 shadow-2xl backdrop-blur-md sticky top-32">
              <div className="flex items-center gap-2 mb-6 text-blue-400 font-bold uppercase text-[10px] tracking-widest">
                <Settings className="w-4 h-4" /> Parameters
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-white/30 font-black uppercase tracking-widest">Data Payload</label>
                  <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter URL or Text..."
                    className="w-full h-32 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-white/30 font-black uppercase tracking-widest">Error Correction</label>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
                    {['L', 'M', 'Q', 'H'].map((lvl) => (
                      <button 
                        key={lvl}
                        onClick={() => setOptions({...options, errorLevel: lvl})}
                        className={`py-2 rounded-lg text-[10px] font-black transition-all ${options.errorLevel === lvl ? 'bg-blue-600 text-white' : 'text-white/30 hover:text-white/60'}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <button 
                    onClick={downloadPNG}
                    disabled={!qrDataUrl}
                    className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-20 transition-all shadow-xl"
                  >
                    <Download className="w-4 h-4" /> Export PNG
                  </button>
                  <button 
                    onClick={downloadSVG}
                    disabled={!qrSvg}
                    className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-white/10 disabled:opacity-20 transition-all"
                  >
                    <Download className="w-4 h-4" /> Export SVG
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[24px] flex gap-3">
              <ShieldCheck className="text-blue-500 shrink-0" size={20} />
              <p className="text-[10px] leading-relaxed text-blue-200/50 font-bold uppercase tracking-wider">
                Encryption Protocol: Generation is finalized in-browser. No data packets sent.
              </p>
            </div>
          </aside>

          {/* --- WORKSPACE --- */}
          <section className="bg-white/[0.03] border border-white/5 rounded-[32px] min-h-[600px] flex flex-col relative overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-white/30">Matrix Visualization</span>
              {text && (
                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase animate-pulse">
                  <Activity className="w-3 h-3" /> Encoded
                </div>
              )}
            </div>

            <div className="flex-1 p-8 flex flex-col items-center justify-center">
              {!qrDataUrl ? (
                <div className="flex flex-col items-center text-center max-w-sm">
                  <div className="w-24 h-24 bg-blue-500/5 rounded-[32px] flex items-center justify-center mb-6 border border-blue-500/10 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                    <QrCode className="text-blue-500/40 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase">Matrix Empty</h3>
                  <p className="text-white/20 text-[10px] mt-2 uppercase tracking-widest font-black leading-relaxed">
                    Input payload into the configuration panel to generate binary visualization.
                  </p>
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-4 bg-blue-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative bg-white p-8 rounded-[24px] shadow-2xl animate-in zoom-in duration-500">
                    <img
                      src={qrDataUrl}
                      alt="Nexus Generated QR"
                      className="w-full max-w-[280px] h-auto"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  
                  {/* Quick-Action Overlay */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur rounded-full border border-white/5 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button 
                       onClick={() => {
                          navigator.clipboard.writeText(text);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                       }}
                       className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white"
                    >
                       {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                       {copied ? 'Copied' : 'Copy Source'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Matrix Stats */}
            {qrDataUrl && (
               <div className="grid grid-cols-3 border-t border-white/5 divide-x divide-white/5">
                  <div className="p-6 text-center">
                     <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Density</p>
                     <p className="text-sm font-bold">{text.length} chars</p>
                  </div>
                  <div className="p-6 text-center">
                     <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Correction</p>
                     <p className="text-sm font-bold text-blue-400">Level {options.errorLevel}</p>
                  </div>
                  <div className="p-6 text-center">
                     <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Rendering</p>
                     <p className="text-sm font-bold">1024px</p>
                  </div>
               </div>
            )}
          </section>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="mt-20 py-10 flex flex-col items-center gap-4 opacity-30 border-t border-white/5">
         <p className="text-[9px] font-black uppercase tracking-[5px]">NexTools Workshop Ecosystem</p>
         <div className="flex items-center gap-4">
            <span className="h-[1px] w-8 bg-blue-600/50" />
            <a href="https://instagram.com/berkindev" target="_blank" className="text-[10px] hover:text-blue-400 transition-colors"> @BERKINDEV </a>
            <span className="h-[1px] w-8 bg-blue-600/50" />
         </div>
      </footer>
    </div>
  );
};

export default QRGenerator;