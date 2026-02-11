import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, GripVertical, Download, FileText, Check, AlertCircle, Trash2, Share2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const MAX_FILES = 15;
const MAX_SIZE_MB = 150;

const PDFMerger = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [fileName, setFileName] = useState('merged-document');
  const [thumbnails, setThumbnails] = useState({});
  
  // Single ref for the hidden input
  const fileInputRef = useRef(null);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && files.length > 0) {
        setFiles([]);
        setError('');
      }
      if (e.key === ' ' && files.length >= 2 && !isProcessing) {
        e.preventDefault();
        mergePDFs();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [files, isProcessing]);

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
    } catch (err) {
      return null;
    }
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

    const newFiles = pdfFiles.map((file, index) => {
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
    
    // Reset input value so same file can be added again if removed
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
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white/20">
      {/* Hidden File Input (Global) */}
      <input 
        ref={fileInputRef} 
        type="file" 
        multiple 
        accept=".pdf" 
        onChange={(e) => handleFileSelect(e.target.files)} 
        className="hidden" 
      />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Merge PDFs</h1>
            <p className="text-gray-500">Simple. Dark. Fast.</p>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {files.length === 0 ? (
            <div
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-20 text-center transition-all cursor-pointer ${
                isDragging ? 'border-white bg-gray-900' : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <Upload className="w-10 h-10 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Drop PDFs here</h3>
              <p className="text-gray-500 text-sm">or click to upload</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Progress Bar */}
              {isProcessing && (
                <div className="mb-6 bg-gray-900 rounded-2xl p-4 border border-gray-800">
                  <div className="flex justify-between text-xs mb-2 text-gray-400">
                    <span>Processing files...</span>
                    <span>{progress.current}/{progress.total}</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-300" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
                  </div>
                </div>
              )}

              {/* Name Input */}
              <div className="mb-4 flex items-center bg-gray-900 border border-gray-800 rounded-xl px-4 py-2">
                <input 
                  type="text" 
                  value={fileName} 
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-transparent flex-1 outline-none text-sm"
                  placeholder="Output filename"
                />
                <span className="text-gray-600 text-sm">.pdf</span>
              </div>

              {/* File List */}
              <div className="space-y-2 mb-6">
                {files.map((f, i) => (
                  <div key={f.id} className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-2xl group">
                    <GripVertical className="w-4 h-4 text-gray-700 cursor-grab" />
                    {thumbnails[f.id] ? (
                      <img src={thumbnails[f.id]} className="w-8 h-10 object-cover rounded shadow-lg" alt="" />
                    ) : (
                      <div className="w-8 h-10 bg-gray-800 rounded" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{f.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{f.size} {f.pageCount && `• ${f.pageCount} pgs`}</p>
                    </div>
                    <button onClick={() => setFiles(files.filter(x => x.id !== f.id))} className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={mergePDFs}
                  disabled={isProcessing || files.length < 2}
                  className={`w-full py-4 rounded-full font-bold transition-all ${
                    isProcessing ? 'bg-gray-800 text-gray-500' : 
                    isComplete ? 'bg-green-600' : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  {isProcessing ? 'Merging...' : isComplete ? 'Download Ready' : `Merge ${files.length} PDFs`}
                </button>

                <div className="flex justify-center gap-6">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()} 
                    className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-3 h-3" /> Add more
                  </button>
                  <button 
                    onClick={() => setFiles([])} 
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" /> Clear all
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="p-6 text-center border-t border-gray-900">
        <p className="text-[10px] text-gray-700 uppercase tracking-widest">Coded by @berkindev</p>
      </footer>
    </div>
  );
};

export default PDFMerger;