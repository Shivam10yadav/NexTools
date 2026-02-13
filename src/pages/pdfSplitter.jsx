import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, X, FileText, Check, AlertCircle, Scissors, RotateCcw, CheckSquare, Square, Plus } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white/90 flex flex-col items-center p-6 md:p-12 relative overflow-x-hidden">
      {/* Background Effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#14141a_0%,#0a0a0c_70%)] pointer-events-none" />

      <header className="relative text-center mb-12 max-w-[1000px] w-full">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Split PDF</h1>
        <p className="text-white/60">Extract specific pages or break a large document into parts</p>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 w-full max-w-[1100px]">
        
        {/* Sidebar Controls */}
        <aside className="bg-[#111115] border border-white/10 rounded-2xl p-5 shadow-2xl h-fit lg:sticky lg:top-6 order-2 lg:order-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 text-blue-400">Extract Settings</h2>
          
          <div className="space-y-4">
            {!file ? (
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                <p className="text-xs text-white/30">Upload a file to see options</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-medium text-white/40 uppercase">Output Name</label>
                  <div className="flex bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus-within:border-blue-500 transition-all">
                    <input 
                      type="text" value={fileName} onChange={(e) => setFileName(e.target.value)}
                      className="bg-transparent outline-none w-full"
                    />
                    <span className="text-white/20">.pdf</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-white/40">
                    <span>Selected</span>
                    <span className="text-white">{selectedPages.size} / {pages.length} Pages</span>
                  </div>

                  {(isLoading || isProcessing) && (
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300" 
                          style={{ width: `${(progress.current / progress.total) * 100}%` }} 
                        />
                      </div>
                      <p className="text-[9px] text-center text-blue-400">
                        {isLoading ? 'Loading pages...' : 'Processing extraction...'}
                      </p>
                    </div>
                  )}

                  <button 
                    onClick={splitPDF}
                    disabled={selectedPages.size === 0 || isProcessing || isLoading}
                    className="w-full py-3 rounded-full bg-white text-black hover:bg-white/90 transition-all text-sm font-bold disabled:opacity-30 flex items-center justify-center gap-2 shadow-xl"
                  >
                    <Scissors className="w-4 h-4" /> {isProcessing ? "Extracting..." : "Extract Selected"}
                  </button>

                  <button 
                    onClick={resetState}
                    className="w-full py-2 text-xs text-white/40 hover:text-red-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset File
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <section className="bg-[#111115] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden order-1 lg:order-2">
          <div className="flex justify-between items-center px-5 py-3 border-b border-white/5 bg-white/[0.02]">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Page Preview</span>
            {file && (
              <button 
                onClick={selectAll}
                className="text-[11px] flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-all"
              >
                {selectedPages.size === pages.length ? <Square className="w-3 h-3" /> : <CheckSquare className="w-3 h-3" />}
                {selectedPages.size === pages.length ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>

          <div 
            className={`relative flex-1 min-h-[500px] p-6 transition-colors ${isDragging ? "bg-blue-500/5" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files); }}
          >
            {!file ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                  <Upload className="text-blue-500 w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium mb-1">Upload PDF to Split</h3>
                <p className="text-white/30 text-sm max-w-[240px]">Drag and drop a single PDF here to preview and select pages.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {pages.map((page) => (
                  <div 
                    key={page.pageNumber}
                    onClick={(e) => togglePage(page.pageNumber, e)}
                    className={`group relative aspect-[3/4] cursor-pointer rounded-lg border-2 transition-all overflow-hidden ${
                      selectedPages.has(page.pageNumber) ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    {page.thumbnail ? (
                      <img src={page.thumbnail} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full bg-white/5 animate-pulse flex items-center justify-center">
                        <FileText className="text-white/10 w-8 h-8" />
                      </div>
                    )}
                    
                    <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      selectedPages.has(page.pageNumber) ? "bg-blue-500 scale-100" : "bg-black/50 scale-0 group-hover:scale-100"
                    }`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 py-1 bg-black/60 backdrop-blur-sm text-[10px] text-center font-bold">
                      PAGE {page.pageNumber}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <input ref={fileInputRef} type="file" accept=".pdf" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
          </div>

          {error && (
            <div className="mx-6 mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </section>
      </main>

      <footer className="mt-12 mb-6">
        <a 
          href="https://www.instagram.com/shivam05_10" target="_blank" rel="noopener noreferrer"
          className="text-[10px] text-white/40 hover:text-white/60 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 transition-all"
        >
          Coded by ShivamYadav
        </a>
      </footer>
    </div>
  );
};

export default PDFSplitter;