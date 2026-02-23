import React, { useState, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { Upload, Download, Trash2, MousePointer2, PenTool, Image as ImageIcon, ShieldCheck } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

const PdfSign = () => {
  const [file, setFile] = useState(null);
  const [pdfBytes, setPdfBytes] = useState(null);
  const [signature, setSignature] = useState(null);
  const [sigPos, setSigPos] = useState({ x: 50, y: 50, width: 160, height: 80 });
  const [inkColor, setInkColor] = useState("#000000");

  const pdfCanvasRef = useRef(null);
  const signCanvasRef = useRef(null);
  const dragRef = useRef(null);

  /* --- 1. LOAD PDF --- */
  const handleFile = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const buffer = await selected.arrayBuffer();
    setFile(selected);
    setPdfBytes(buffer);

    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = pdfCanvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;
  };

  /* --- 2. SIGNATURE PAD LOGIC --- */
  useEffect(() => {
    if (!file || !signCanvasRef.current) return;
    const canvas = signCanvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = inkColor;

    let drawing = false;
    const start = (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); };
    const draw = (e) => { if (!drawing) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); };
    const stop = () => { 
      if (!drawing) return;
      drawing = false; 
      setSignature(canvas.toDataURL("image/png")); 
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stop);
    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", draw);
      window.removeEventListener("mouseup", stop);
    };
  }, [file, inkColor]);

  const clearSignature = () => {
    const canvas = signCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignature(null);
  };

  const handleImageUpload = (e) => {
    const imgFile = e.target.files[0];
    if (imgFile) {
      const reader = new FileReader();
      reader.onload = (event) => setSignature(event.target.result);
      reader.readAsDataURL(imgFile);
    }
  };

  /* --- 3. DRAG LOGIC --- */
  const startDrag = (e) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: sigPos.x, origY: sigPos.y };
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
  };

  const onDrag = (e) => {
    if (!dragRef.current) return;
    setSigPos((prev) => ({
      ...prev,
      x: dragRef.current.origX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.origY + (e.clientY - dragRef.current.startY),
    }));
  };

  const stopDrag = () => {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", stopDrag);
    dragRef.current = null;
  };

  /* --- 4. EXPORT --- */
  const exportPDF = async () => {
    if (!signature || !pdfBytes) return;
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const png = await pdfDoc.embedPng(signature);
    const page = pdfDoc.getPages()[0];
    const canvas = pdfCanvasRef.current;

    const scaleX = page.getWidth() / canvas.width;
    const scaleY = page.getHeight() / canvas.height;

    page.drawImage(png, {
      x: sigPos.x * scaleX,
      y: page.getHeight() - (sigPos.y * scaleY) - (sigPos.height * scaleY),
      width: sigPos.width * scaleX,
      height: sigPos.height * scaleY,
    });

    const bytes = await pdfDoc.save();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    link.download = `signed_${file.name}`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 p-6 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/5 pb-6">
          <h1 className="text-3xl font-black tracking-tighter italic uppercase">
            Doc<span className="text-blue-500">Sign</span>
          </h1>
          {file && (
            <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-xs font-medium text-white/60 truncate max-w-[150px]">{file.name}</span>
            </div>
          )}
        </header>

        {!file ? (
          <label className="group border-2 border-dashed border-white/10 p-32 rounded-[3rem] flex flex-col items-center cursor-pointer hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-700">
            <Upload className="w-12 h-12 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Initialize Document</h3>
            <p className="text-sm text-white/40 uppercase tracking-widest">Click to upload PDF</p>
            <input hidden type="file" accept="application/pdf" onChange={handleFile} />
          </label>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10 items-start">
            
            {/* LEFT TOOLBAR */}
            <aside className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/10 space-y-8 sticky top-8 backdrop-blur-md">
              
              {/* Ink Color */}
              <div className="space-y-4">
                <h2 className="uppercase text-[10px] font-black tracking-widest text-blue-500">Ink Color</h2>
                <div className="flex gap-4 items-center">
                  {["#000000", "#1e3a8a", "#2563eb"].map((color) => (
                    <button
                      key={color}
                      onClick={() => { setInkColor(color); clearSignature(); }}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${
                        inkColor === color ? "border-white scale-110" : "border-transparent opacity-50"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input type="color" value={inkColor} onChange={(e) => { setInkColor(e.target.value); clearSignature(); }} className="w-10 h-10 bg-transparent border-none cursor-pointer p-0" />
                </div>
              </div>

              {/* Drawing Pad */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="uppercase text-[10px] font-black tracking-widest text-blue-500 flex items-center gap-2">
                    <PenTool size={12} /> Draw Signature
                  </h2>
                  <button onClick={clearSignature} className="text-white/20 hover:text-red-400 transition"><Trash2 size={16} /></button>
                </div>
                <canvas ref={signCanvasRef} width={340} height={160} className="bg-black w-full rounded-2xl border border-white/5 cursor-crosshair shadow-inner" />
              </div>

              {/* Upload Signature Image */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="uppercase text-[10px] font-black tracking-widest text-blue-500">Or Upload Image</h2>
                <label className="flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition group">
                  <ImageIcon size={16} className="text-white/30 group-hover:text-blue-500" />
                  <span className="text-xs font-bold text-white/40 uppercase tracking-tighter">Choose PNG/JPG</span>
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </label>
              </div>

              <button
                onClick={exportPDF}
                disabled={!signature}
                className="w-full py-5 bg-blue-600 disabled:opacity-20 rounded-[1.2rem] font-bold tracking-widest uppercase text-xs hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20"
              >
                <Download size={18} /> Finalize & Export
              </button>
            </aside>

            {/* RIGHT PREVIEW */}
            <main className="relative bg-white/[0.01] rounded-[3rem] p-10 border border-white/5 flex justify-center min-h-[800px] overflow-auto">
              <div className="relative h-fit shadow-2xl">
                <canvas ref={pdfCanvasRef} className="rounded-lg bg-white" />
                {signature && (
                  <div
                    onMouseDown={startDrag}
                    style={{
                      position: "absolute",
                      top: sigPos.y,
                      left: sigPos.x,
                      width: sigPos.width,
                      height: sigPos.height,
                      cursor: "move",
                      userSelect: "none",
                    }}
                    className="group border border-dashed border-blue-500/50"
                  >
                    <img 
                      src={signature} 
                      alt="signature" 
                      className="w-full h-full object-contain pointer-events-none"
                      style={{ filter: "multiply(1.2)" }} 
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-[9px] px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all font-bold">
                      <MousePointer2 size={10} className="inline mr-1" /> DRAG TO POSITION
                    </div>
                  </div>
                )}
              </div>
            </main>

          </div>
        )}
      </div>
    </div>
  );
};

export default PdfSign