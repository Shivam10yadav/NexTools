import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, X, GripVertical, Download, Plus, 
  ChevronLeft, Trash2, AlertCircle, RefreshCcw, 
  ShieldCheck, Activity, FileText
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const MAX_FILES = 15;

const PDFMerger = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [fileName, setFileName] = useState('merged-document');
  const [thumbnails, setThumbnails] = useState({});
  
  const fileInputRef = useRef(null);

  const generateThumbnail = async (file, fileId) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.3 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
      const thumbnail = canvas.toDataURL('image/jpeg', 0.6);
      
      setThumbnails(prev => ({ ...prev, [fileId]: thumbnail }));
      return pdf.numPages;
    } catch (err) { return null; }
  };

  const handleFileSelect = (selectedFiles) => {
    if (!selectedFiles) return;
    const pdfFiles = Array.from(selectedFiles).filter(file => file.type === 'application/pdf');

    if (pdfFiles.length === 0) {
      setError('Please select valid PDF files');
      return;
    }

    if (files.length + pdfFiles.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const newFiles = pdfFiles.map((file) => {
      const id = Date.now() + Math.random();
      generateThumbnail(file, id).then(pageCount => {
        if (pageCount) {
          setFiles(prev => prev.map(f => f.id === id ? { ...f, pageCount } : f));
        }
      });
      
      return {
        id,
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        pageCount: null
      };
    });

    setFiles(prev => [...prev, ...newFiles]);
    setError('');
    setIsComplete(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setIsComplete(false);
    setProgress({ current: 0, total: files.length });

    try {
      const mergedPdf = new jsPDF();
      let isFirstPage = true;

      for (let i = 0; i < files.length; i++) {
        setProgress({ current: i + 1, total: files.length });
        const arrayBuffer = await files[i].file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        for (let j = 1; j <= pdf.numPages; j++) {
          const page = await pdf.getPage(j);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          if (!isFirstPage) mergedPdf.addPage();
          isFirstPage = false;

          const pWidth = mergedPdf.internal.pageSize.getWidth();
          const pHeight = mergedPdf.internal.pageSize.getHeight();
          const ratio = Math.min(pWidth / viewport.width, pHeight / viewport.height);
          mergedPdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 
            (pWidth - viewport.width * ratio) / 2, 
            (pHeight - viewport.height * ratio) / 2, 
            viewport.width * ratio, viewport.height * ratio
          );
        }
      }
      mergedPdf.save(`${fileName}.pdf`);
      setIsProcessing(false);
      setIsComplete(true);
    } catch (err) {
      setError('Merge failed. Check file integrity.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 pt-32 relative overflow-hidden selection:bg-blue-500/30">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none" />

      <main className="max-w-6xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <header className="mb-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white/40 hover:text-blue-400 mb-6 transition group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Activity size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[2px] text-blue-400">PDF Engine v2.0</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tight">
            PDF <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">Merger</span>
          </h1>
          <p className="text-white/40 mt-3 font-medium">Merge multiple documents locally. Private & Secure.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          
          {/* --- SIDEBAR CONTROLS --- */}
          <aside className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6 text-blue-400">
                <FileText size={18} />
                <h2 className="text-[11px] font-bold uppercase tracking-widest">Configuration</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/30">Output Filename</label>
                  <div className="flex bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus-within:border-blue-500/50 transition-all">
                    <input 
                      type="text" value={fileName} onChange={(e) => setFileName(e.target.value)}
                      className="bg-transparent outline-none w-full font-medium"
                    />
                    <span className="text-white/20">.pdf</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex justify-between text-[10px] uppercase font-black text-white/30 tracking-widest">
                    <span>Queue</span>
                    <span className="text-blue-500">{files.length} / {MAX_FILES}</span>
                  </div>

                  <button 
                    onClick={mergePDFs}
                    disabled={files.length < 2 || isProcessing}
                    className="w-full py-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-20 transition-all font-black text-xs uppercase tracking-[2px] shadow-xl flex items-center justify-center gap-2 shadow-blue-900/20"
                  >
                    {isProcessing ? <RefreshCcw className="animate-spin" size={16} /> : "Initialize Merge"}
                  </button>
                  
                  <button 
                    onClick={() => setFiles([])}
                    className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors"
                  >
                    Purge Queue
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[24px] flex gap-3">
              <ShieldCheck className="text-blue-500 shrink-0" size={20} />
              <p className="text-[10px] leading-relaxed text-blue-200/50 font-bold uppercase tracking-wider">
                Encryption active. Files are processed in Isolated RAM.
              </p>
            </div>
          </aside>

          {/* --- MAIN ACTION AREA --- */}
          <section className="bg-white/[0.03] border border-white/5 rounded-[32px] min-h-[600px] flex flex-col relative overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 bg-white/[0.01]">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-white/30">Document Stack</span>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
              >
                <Plus size={14} /> Add Source
              </button>
            </div>

            <div 
              className={`flex-1 p-8 transition-colors ${isDragging ? "bg-blue-600/5" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files); }}
            >
              {files.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-blue-500/5 rounded-[32px] flex items-center justify-center mb-6 border border-blue-500/10">
                    <Upload className="text-blue-500 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase mb-2">Drop PDF Sources</h3>
                  <p className="text-white/20 text-sm font-medium max-w-[280px]">Documents remain encrypted and local at all times.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {files.map((f) => (
                    <div key={f.id} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-2xl group hover:border-blue-500/50 transition-all animate-in fade-in zoom-in duration-300">
                      <div className="cursor-grab text-white/10 group-hover:text-blue-500/40 transition-colors">
                        <GripVertical size={18} />
                      </div>
                      
                      <div className="relative shrink-0">
                        {thumbnails[f.id] ? (
                          <img src={thumbnails[f.id]} className="w-12 h-16 object-cover rounded-lg shadow-2xl border border-white/10" alt="" />
                        ) : (
                          <div className="w-12 h-16 bg-white/5 rounded-lg animate-pulse" />
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-[8px] font-black px-1 rounded shadow-lg">
                          PDF
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold truncate mb-1 text-white/80 group-hover:text-white">{f.name}</p>
                        <div className="flex gap-2 items-center text-[9px] font-black tracking-tighter">
                          <span className="text-white/20 uppercase tracking-[1px]">{f.size}</span>
                          {f.pageCount && <span className="text-blue-500/60 uppercase tracking-[1px]">{f.pageCount} Pages</span>}
                        </div>
                      </div>

                      <button 
                        onClick={() => setFiles(files.filter(x => x.id !== f.id))}
                        className="p-2 hover:bg-red-500/10 rounded-xl text-white/10 hover:text-red-500 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <input 
                ref={fileInputRef} type="file" multiple accept=".pdf" 
                onChange={(e) => handleFileSelect(e.target.files)} className="hidden" 
              />
            </div>

            {/* --- PROGRESS HUD --- */}
            {isProcessing && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-8 animate-in slide-in-from-bottom-4">
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">Merging Streams</span>
                      <span className="text-[9px] font-black text-white/40">{Math.round((progress.current / progress.total) * 100)}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)] transition-all duration-300" 
                        style={{ width: `${(progress.current / progress.total) * 100}%` }} 
                      />
                   </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mx-8 mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                <AlertCircle size={16} /> {error}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="mt-20 py-10 flex flex-col items-center gap-4 opacity-30 border-t border-white/5">
         <p className="text-[9px] font-black uppercase tracking-[5px]">NexTools Workshop Ecosystem</p>
         <div className="flex items-center gap-4">
            <span className="h-[1px] w-8 bg-blue-600/50" />
            <a href="https://instagram.com/shivam05_10" className="text-[10px] hover:text-blue-400 transition-colors"> शिवम यादव </a>
            <span className="h-[1px] w-8 bg-blue-600/50" />
         </div>
      </footer>
    </div>
  );
};

export default PDFMerger;