import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, X, FileText, ChevronLeft, AlertCircle, 
  Scissors, RotateCcw, CheckSquare, Square, 
  ShieldCheck, Activity, Check, RefreshCcw 
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

const MAX_SIZE_MB = 100;

const PDFSplitter = () => {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [fileName, setFileName] = useState('split-document');
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  const fileInputRef = useRef(null);

  const resetState = useCallback(() => {
    setFile(null);
    setPdfDoc(null);
    setPages([]);
    setSelectedPages(new Set());
    setError('');
    setIsComplete(false);
    setFileName('split-document');
    setLastSelectedIndex(null);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedPages(prev => {
      if (prev.size === pages.length) return new Set();
      return new Set(pages.map(p => p.pageNumber));
    });
    setIsComplete(false);
  }, [pages]);

  const generateThumbnails = async (pdf) => {
    const thumbnails = [];
    const total = pdf.numPages;
    for (let i = 1; i <= total; i++) {
      setProgress({ current: i, total });
      try {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        thumbnails.push({
          pageNumber: i,
          thumbnail: canvas.toDataURL('image/jpeg', 0.7),
        });
      } catch (err) {
        thumbnails.push({ pageNumber: i, thumbnail: null });
      }
    }
    return thumbnails;
  };

  const handleFileSelect = async (selectedFiles) => {
    const pdfFile = Array.from(selectedFiles).find(f => f.type === 'application/pdf');
    if (!pdfFile) { setError('Please select a valid PDF file'); return; }
    if (pdfFile.size / (1024 * 1024) > MAX_SIZE_MB) { setError(`Max ${MAX_SIZE_MB}MB allowed`); return; }

    setIsLoading(true);
    setError('');
    setFile(pdfFile);
    setFileName(pdfFile.name.replace('.pdf', '-extracted'));

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfDoc(pdf);
      const thumbnails = await generateThumbnails(pdf);
      setPages(thumbnails);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load PDF.');
      setIsLoading(false);
      resetState();
    }
  };

  const splitPDF = async () => {
    if (selectedPages.size === 0 || !pdfDoc) return;
    setIsProcessing(true);
    setIsComplete(false);
    try {
      const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);
      const mergedPdf = new jsPDF();
      let isFirstPage = true;
      for (let i = 0; i < sortedPages.length; i++) {
        setProgress({ current: i + 1, total: sortedPages.length });
        const page = await pdfDoc.getPage(sortedPages[i]);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        if (!isFirstPage) mergedPdf.addPage();
        isFirstPage = false;
        const pdfWidth = mergedPdf.internal.pageSize.getWidth();
        const pdfHeight = mergedPdf.internal.pageSize.getHeight();
        const ratio = Math.min(pdfWidth / viewport.width, pdfHeight / viewport.height);
        mergedPdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', (pdfWidth - viewport.width * ratio) / 2, (pdfHeight - viewport.height * ratio) / 2, viewport.width * ratio, viewport.height * ratio);
      }
      mergedPdf.save(`${fileName}.pdf`);
      setIsProcessing(false);
      setIsComplete(true);
    } catch (err) {
      setError('Extraction failed.');
      setIsProcessing(false);
    }
  };

  const togglePage = (pageNumber, e) => {
    const newSelected = new Set(selectedPages);
    if (e.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, pageNumber - 1);
      const end = Math.max(lastSelectedIndex, pageNumber - 1);
      for (let i = start; i <= end; i++) newSelected.add(i + 1);
    } else {
      if (newSelected.has(pageNumber)) newSelected.delete(pageNumber);
      else newSelected.add(pageNumber);
    }
    setSelectedPages(newSelected);
    setLastSelectedIndex(pageNumber - 1);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 pt-32 relative overflow-hidden selection:bg-blue-500/30">
      
      {/* --- WORKSHOP BACKGROUND AMBIENCE --- */}
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
            <Activity size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[2px] text-blue-400">Precision Blade v1.4</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tight">
            PDF <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">Splitter</span>
          </h1>
          <p className="text-white/40 mt-3 font-medium">Extract specific segments. Zero data leaves your device.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          
          {/* --- SIDEBAR CONTROLS --- */}
          <aside className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 shadow-2xl backdrop-blur-md sticky top-32">
              <div className="flex items-center gap-2 mb-6 text-blue-400">
                <Scissors size={18} />
                <h2 className="text-[11px] font-bold uppercase tracking-widest">Extraction Intel</h2>
              </div>
              
              <div className="space-y-6">
                {!file ? (
                  <div className="p-8 border border-white/5 bg-white/[0.01] rounded-2xl text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 leading-relaxed">
                      Upload source to initialize parameters
                    </p>
                  </div>
                ) : (
                  <>
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
                        <span>Selection</span>
                        <span className="text-blue-500">{selectedPages.size} / {pages.length}</span>
                      </div>

                      <button 
                        onClick={splitPDF}
                        disabled={selectedPages.size === 0 || isProcessing || isLoading}
                        className="w-full py-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-20 transition-all font-black text-xs uppercase tracking-[2px] shadow-xl flex items-center justify-center gap-2 shadow-blue-900/20"
                      >
                        {isProcessing ? <RefreshCcw className="animate-spin" size={16} /> : "Extract Segments"}
                      </button>
                      
                      <button 
                        onClick={resetState}
                        className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={12} /> Reset Buffer
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[24px] flex gap-3">
              <ShieldCheck className="text-blue-500 shrink-0" size={20} />
              <p className="text-[10px] leading-relaxed text-blue-200/50 font-bold uppercase tracking-wider">
                Isolated environment active. Browser-native processing enabled.
              </p>
            </div>
          </aside>

          {/* --- MAIN ACTION AREA --- */}
          <section className="bg-white/[0.03] border border-white/5 rounded-[32px] min-h-[600px] flex flex-col relative overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 bg-white/[0.01]">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-white/30">Document Map</span>
              {file && (
                <button 
                  onClick={selectAll}
                  className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                >
                  {selectedPages.size === pages.length ? <Square size={14} /> : <CheckSquare size={14} />}
                  {selectedPages.size === pages.length ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>

            <div 
              className={`flex-1 p-8 transition-colors ${isDragging ? "bg-blue-600/5" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files); }}
            >
              {!file ? (
                <div 
                  className="h-full flex flex-col items-center justify-center text-center cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 bg-blue-500/5 rounded-[32px] flex items-center justify-center mb-6 border border-blue-500/10 group-hover:scale-110 transition-transform duration-500">
                    <Upload className="text-blue-500 w-10 h-10 shadow-[0_0_20px_rgba(37,99,235,0.3)]" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase mb-2">Import Source PDF</h3>
                  <p className="text-white/20 text-[11px] font-black uppercase tracking-widest max-w-[280px]">Drag source file into terminal</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                  {pages.map((page) => (
                    <div 
                      key={page.pageNumber}
                      onClick={(e) => togglePage(page.pageNumber, e)}
                      className={`group relative aspect-[3/4] cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                        selectedPages.has(page.pageNumber) 
                          ? "border-blue-500 bg-blue-500/10 scale-[1.02] shadow-[0_0_30px_rgba(37,99,235,0.2)]" 
                          : "border-white/5 hover:border-white/20 grayscale hover:grayscale-0"
                      }`}
                    >
                      {page.thumbnail ? (
                        <img src={page.thumbnail} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full bg-white/5 animate-pulse flex items-center justify-center">
                          <FileText className="text-white/10 w-8 h-8" />
                        </div>
                      )}
                      
                      {/* Checkbox Overlay */}
                      <div className={`absolute top-3 right-3 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        selectedPages.has(page.pageNumber) ? "bg-blue-600 scale-100" : "bg-black/60 scale-0 group-hover:scale-100"
                      }`}>
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>

                      <div className={`absolute bottom-0 left-0 right-0 py-2 text-[9px] text-center font-black uppercase tracking-widest transition-colors ${
                        selectedPages.has(page.pageNumber) ? "bg-blue-600 text-white" : "bg-black/60 text-white/40"
                      }`}>
                        SEC {page.pageNumber}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <input ref={fileInputRef} type="file" accept=".pdf" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
            </div>

            {/* --- LOADING / PROCESSING OVERLAY --- */}
            {(isLoading || isProcessing) && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-30 flex flex-col items-center justify-center">
                <div className="bg-[#0d0d12] border border-white/10 p-8 rounded-[32px] w-full max-w-sm text-center shadow-3xl animate-in zoom-in duration-300">
                  <RefreshCcw className="text-blue-500 w-10 h-10 animate-spin mx-auto mb-6" />
                  <h4 className="text-[11px] font-black uppercase tracking-[4px] text-blue-500 mb-2">
                    {isLoading ? "Analyzing Buffer" : "Executing Split"}
                  </h4>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed mb-6">
                    Parsing document streams locally in memory. Do not close browser.
                  </p>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)] transition-all duration-500" 
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

export default PDFSplitter;