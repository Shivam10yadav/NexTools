import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, X, FileText, Check, AlertCircle, Scissors, RotateCcw, CheckSquare, Square } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

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
      if (prev.size === pages.length) {
        return new Set();
      } else {
        return new Set(pages.map(p => p.pageNumber));
      }
    });
    setIsComplete(false);
  }, [pages]);

  const splitPDF = useCallback(async () => {
    if (selectedPages.size === 0 || !pdfDoc) return;

    setIsProcessing(true);
    setIsComplete(false);
    setError('');

    try {
      const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);
      const mergedPdf = new jsPDF();
      let isFirstPage = true;

      setProgress({ current: 0, total: sortedPages.length });

      for (let i = 0; i < sortedPages.length; i++) {
        const pageNum = sortedPages[i];
        setProgress({ current: i + 1, total: sortedPages.length });

        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (!isFirstPage) {
          mergedPdf.addPage();
        }
        isFirstPage = false;

        const pdfWidth = mergedPdf.internal.pageSize.getWidth();
        const pdfHeight = mergedPdf.internal.pageSize.getHeight();
        const imgWidth = viewport.width;
        const imgHeight = viewport.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        const width = imgWidth * ratio;
        const height = imgHeight * ratio;
        const x = (pdfWidth - width) / 2;
        const y = (pdfHeight - height) / 2;

        mergedPdf.addImage(imgData, 'JPEG', x, y, width, height);
      }

      mergedPdf.save(`${fileName || 'split-document'}.pdf`);
      setIsProcessing(false);
      setIsComplete(true);
    } catch (err) {
      console.error('Error splitting PDF:', err);
      setError('Failed to split PDF. Please try again.');
      setIsProcessing(false);
    }
  }, [selectedPages, pdfDoc, fileName]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && file) {
        resetState();
      }
      if (e.key === ' ' && selectedPages.size > 0 && !isProcessing) {
        e.preventDefault();
        splitPDF();
      }
      if (e.key === 'a' && (e.metaKey || e.ctrlKey) && pages.length > 0) {
        e.preventDefault();
        selectAll();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [file, selectedPages, isProcessing, pages, selectAll, splitPDF, resetState]);

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
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7);

        thumbnails.push({
          pageNumber: i,
          thumbnail,
          width: viewport.width,
          height: viewport.height
        });
      } catch (err) {
        console.error(`Failed to generate thumbnail for page ${i}:`, err);
        thumbnails.push({
          pageNumber: i,
          thumbnail: null,
          width: 0,
          height: 0
        });
      }
    }

    return thumbnails;
  };

  const handleFileSelect = async (selectedFiles) => {
    const pdfFile = Array.from(selectedFiles).find(
      f => f.type === 'application/pdf'
    );

    if (!pdfFile) {
      setError('Please select a valid PDF file');
      return;
    }

    const sizeMB = pdfFile.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      setError(`File size cannot exceed ${MAX_SIZE_MB}MB`);
      return;
    }

    setIsLoading(true);
    setError('');
    setFile(pdfFile);
    setFileName(pdfFile.name.replace('.pdf', '-split'));

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfDoc(pdf);

      const thumbnails = await generateThumbnails(pdf);
      setPages(thumbnails);
      setSelectedPages(new Set());
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load PDF. Please try another file.');
      setIsLoading(false);
      resetState();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const togglePage = (pageNumber, e) => {
    const newSelected = new Set(selectedPages);
    const pageIndex = pageNumber - 1;

    if (e.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, pageIndex);
      const end = Math.max(lastSelectedIndex, pageIndex);

      for (let i = start; i <= end; i++) {
        newSelected.add(i + 1);
      }
    } else {
      if (newSelected.has(pageNumber)) {
        newSelected.delete(pageNumber);
      } else {
        newSelected.add(pageNumber);
      }
    }

    setSelectedPages(newSelected);
    setLastSelectedIndex(pageIndex);
    setIsComplete(false);
  };

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold mb-9">
              Split PDF
            </h1>
            <p className="text-gray-600 text-base">
              Select pages to extract
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Upload Area */}
          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border border-gray-800 rounded-3xl py-40 px-20 text-center transition-all duration-200 cursor-pointer ${
                isDragging
                  ? 'border-white bg-gray-900/50'
                  : 'hover:border-gray-700'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden "
              />
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-8">
                  <Upload className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Drop a PDF file
                </h3>
                <p className="text-gray-500">
                  or click to browse
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Loading State */}
              {isLoading && (
                <div className="mb-6 bg-gray-900/50 rounded-2xl p-6 text-center border border-gray-800">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin mb-4" />
                    <p className="text-sm font-medium mb-2">Loading pages...</p>
                    <p className="text-xs text-gray-500">
                      {progress.current} / {progress.total} pages
                    </p>
                  </div>
                </div>
              )}

              {/* Processing Progress */}
              {isProcessing && (
                <div className="mb-6 bg-gray-900/50 rounded-2xl p-4 border border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Extracting pages...</span>
                    <span className="text-sm text-gray-500">{progress.current} / {progress.total}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* File Info & Controls */}
              {!isLoading && (
                <>
                  <div className="mb-4 bg-gray-900/50 rounded-2xl p-4 flex items-center gap-3 border border-gray-800">
                    <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {pages.length} pages • {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={resetState}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* File Name Input */}
                  <div className="mb-4 bg-gray-900/50 rounded-2xl p-3 flex items-center gap-2 border border-gray-800">
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-600"
                      placeholder="Output file name"
                    />
                    <span className="text-sm text-gray-500">.pdf</span>
                  </div>

                  {/* Selection Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={selectAll}
                      className="px-4 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      {selectedPages.size === pages.length ? (
                        <CheckSquare className="w-3.5 h-3.5" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                      {selectedPages.size === pages.length ? 'Deselect all' : 'Select all'}
                    </button>
                    <p className="text-sm text-gray-500">
                      {selectedPages.size} of {pages.length} selected
                    </p>
                  </div>

                  {/* Page Grid */}
                  <div className="mb-6 border border-gray-800 rounded-3xl p-6">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {pages.map((page) => (
                        <div
                          key={page.pageNumber}
                          onClick={(e) => togglePage(page.pageNumber, e)}
                          className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
                            selectedPages.has(page.pageNumber)
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-black'
                              : 'hover:bg-gray-900'
                          }`}
                        >
                          {page.thumbnail ? (
                            <img
                              src={page.thumbnail}
                              alt={`Page ${page.pageNumber}`}
                              className="w-full aspect-[3/4] object-cover"
                            />
                          ) : (
                            <div className="w-full aspect-[3/4] bg-gray-900 flex items-center justify-center">
                              <FileText className="w-8 h-8 text-gray-700" />
                            </div>
                          )}

                          {/* Page Number Badge */}
                          <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-medium ${
                            selectedPages.has(page.pageNumber)
                              ? 'bg-white text-black'
                              : 'bg-black/70 text-white'
                          }`}>
                            {page.pageNumber}
                          </div>

                          {/* Selection Checkmark */}
                          {selectedPages.has(page.pageNumber) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-black" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hint Text */}
                  <p className="text-center text-xs text-gray-700 mb-6">
                    Click to select • Shift+click for range • {isMac ? 'Cmd' : 'Ctrl'}+A to select all • Space to split
                  </p>

                  {/* Split Button */}
                  <button
                    onClick={splitPDF}
                    disabled={isProcessing || selectedPages.size === 0}
                    className={`w-full py-3.5 rounded-full font-medium transition-all ${
                      isProcessing
                        ? 'bg-gray-800 text-gray-600 cursor-wait'
                        : isComplete
                        ? 'bg-green-600 text-white'
                        : selectedPages.size === 0
                        ? 'bg-gray-900 text-gray-600 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-900 rounded-full animate-spin mr-2.5" />
                        Splitting...
                      </span>
                    ) : isComplete ? (
                      <span className="flex items-center justify-center">
                        <Check className="w-4 h-4 mr-2" />
                        Downloaded
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Scissors className="w-4 h-4 mr-2" />
                        Extract {selectedPages.size} {selectedPages.size === 1 ? 'page' : 'pages'}
                      </span>
                    )}
                  </button>

                  {/* Reset Button */}
                  {isComplete && (
                    <button
                      onClick={resetState}
                      className="w-full mt-3 py-2.5 rounded-full text-sm text-gray-500 hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Split another PDF
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-gray-900">
        <a
          href="https://www.instagram.com/shivam05_10?igsh=MThvMGVuemVnMXVydQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-700 hover:text-gray-400 transition-colors inline-flex items-center gap-1.5"
        >
          Coded by <span className="font-medium">ShivamYadav</span>
        </a>
      </footer>
    </div>
  );
};

export default PDFSplitter;