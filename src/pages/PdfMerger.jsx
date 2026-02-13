import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, X, GripVertical, Download, FileText, Check, AlertCircle, Trash2, Plus } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white/90 flex flex-col items-center p-6 md:p-12 relative overflow-x-hidden">
      {/* Unified Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#14141a_0%,#0a0a0c_70%)] pointer-events-none" />

      <header className="relative text-center mb-12 max-w-[1000px] w-full">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Merge PDF</h1>
        <p className="text-white/60">Combine multiple documents into one seamless file</p>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 w-full max-w-[1000px]">
        
        {/* Settings / Action Sidebar */}
        <aside className="bg-[#111115] border border-white/10 rounded-2xl p-5 shadow-2xl h-fit lg:sticky lg:top-6 order-2 lg:order-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 text-blue-400">Configuration</h2>
          <div className="space-y-4">
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
                <span>Total Files</span>
                <span className="text-white">{files.length} / {MAX_FILES}</span>
              </div>
              
              {isProcessing && (
                <div className="space-y-1">
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300" 
                      style={{ width: `${(progress.current / progress.total) * 100}%` }} 
                    />
                  </div>
                  <p className="text-[9px] text-center text-blue-400">Merging page {progress.current}...</p>
                </div>
              )}

              <button 
                onClick={mergePDFs}
                disabled={files.length < 2 || isProcessing}
                className="w-full py-3 rounded-full bg-white text-black hover:bg-white/90 transition-all text-sm font-bold disabled:opacity-30 shadow-xl"
              >
                {isProcessing ? "Processing..." : isComplete ? "Download Again" : "Merge PDFs"}
              </button>
              
              <button 
                onClick={() => setFiles([])}
                className="w-full py-2 text-xs text-white/40 hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </aside>

        {/* File Drop / List Area */}
        <section className="bg-[#111115] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden order-1 lg:order-2">
          <div className="flex justify-between items-center px-5 py-3 border-b border-white/5 bg-white/[0.02]">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Documents</span>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-all"
            >
              <Plus className="w-3 h-3" /> Add Files
            </button>
          </div>

          <div 
            className={`relative flex-1 min-h-[450px] p-6 transition-colors ${isDragging ? "bg-blue-500/5" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files); }}
          >
            {files.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 pointer-events-none">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                  <Upload className="text-blue-500 w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium mb-1">Upload your PDFs</h3>
                <p className="text-white/30 text-sm max-w-[240px]">Drag and drop files here to start merging them into one document.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {files.map((f, i) => (
                  <div key={f.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl group hover:border-blue-500/50 transition-all animate-in fade-in slide-in-from-bottom-2">
                    <div className="cursor-grab text-white/20 hover:text-white/60 transition-colors">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    
                    {thumbnails[f.id] ? (
                      <img src={thumbnails[f.id]} className="w-10 h-14 object-cover rounded shadow-md border border-white/10" alt="" />
                    ) : (
                      <div className="w-10 h-14 bg-white/10 rounded animate-pulse" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate mb-1">{f.name}</p>
                      <div className="flex gap-2 items-center text-[9px] text-white/40 font-bold">
                        <span className="bg-white/5 px-1.5 py-0.5 rounded">{f.size}</span>
                        {f.pageCount && <span className="text-blue-400/80">{f.pageCount} PAGES</span>}
                      </div>
                    </div>

                    <button 
                      onClick={() => setFiles(files.filter(x => x.id !== f.id))}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg text-white/20 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Native input triggers */}
            <input 
              ref={fileInputRef} type="file" multiple accept=".pdf" 
              onChange={(e) => handleFileSelect(e.target.files)} className="hidden" 
            />
          </div>

          {error && (
            <div className="mx-6 mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </section>
      </main>

      <footer className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <a 
          href="https://www.instagram.com/shivam05_10" target="_blank" rel="noopener noreferrer"
          className="pointer-events-auto text-[10px] text-white/40 hover:text-white/60 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 transition-all"
        >
          Coded by ShivamYadav
        </a>
      </footer>
    </div>
  );
};

export default PDFMerger;