import { useState } from "react";
import heic2any from "heic2any";

export default function App() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [format, setFormat] = useState("image/png");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  async function convert() {
    if (!file) return;
    setLoading(true);
    setOutput(null);

    let source = file;
    if (file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic")) {
      try {
        source = await heic2any({ blob: file, toType: format });
      } catch (err) {
        console.error(err);
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
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setOutput(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white/90 selection:bg-blue-500/30 flex flex-col items-center p-6 md:p-12 relative overflow-x-hidden font-sans">
      {/* Background Gradient Effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#14141a_0%,#0a0a0c_70%)] pointer-events-none" />

      <header className="relative text-center mb-12 max-w-[1000px] w-full">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Image Converter</h1>
        <p className="text-white/60">Convert HEIC, JPG, PNG, and WEBP instantly</p>
      </header>

      <main className="relative z-10 w-full max-w-[500px]">
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          
          {/* File Upload Area */}
          <div 
            className={`relative group h-48 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer
              ${isDragging ? "border-blue-500 bg-blue-500/5" : "border-white/10 hover:border-white/20 bg-white/[0.02]"}
              ${file ? "border-green-500/50 bg-green-500/5" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => { setFile(e.target.files[0]); setOutput(null); }}
              accept="image/*,.heic,.HEIC"
            />
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl">
              {file ? "✨" : "📸"}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{file ? file.name : "Choose an image or drop it here"}</p>
              <p className="text-[10px] text-white/40 uppercase mt-1">Supports HEIC, PNG, JPG, WEBP</p>
            </div>
          </div>

          {/* Settings Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium text-white/40 uppercase">Output Format</label>
              <select 
                value={format} 
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="image/png" className="bg-[#111115]">PNG</option>
                <option value="image/jpeg" className="bg-[#111115]">JPG</option>
                <option value="image/webp" className="bg-[#111115]">WEBP</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 justify-end">
              <button 
                onClick={convert} 
                disabled={!file || loading}
                className="w-full py-2.5 rounded-lg bg-white text-black hover:bg-white/90 transition-all text-sm font-bold disabled:opacity-20 shadow-xl active:scale-[0.98]"
              >
                {loading ? "Processing..." : "Convert Now"}
              </button>
            </div>
          </div>

          {/* Result / Download Section */}
          {output && (
            <div className="pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
              <a
                href={output}
                download={`converted_${file?.name.split('.')[0]}.${format.split("/")[1]}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
              >
                <span>Download Result</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </a>
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <a 
          href="https://instagram.com/berkindev" target="_blank" rel="noopener noreferrer"
          className="pointer-events-auto text-[10px] text-white/40 hover:text-white/60 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 transition-all"
        >
          Coded by ShivamYadav
        </a>
      </footer>
    </div>
  );
}