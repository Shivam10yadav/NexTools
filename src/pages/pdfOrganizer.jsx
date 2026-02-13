import React, { useState, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, FileText, Download, Trash2, GripVertical, RefreshCw, AlertCircle, Layers } from 'lucide-react';

// Setup Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

// --- Sortable Item Component ---
const SortablePage = ({ page, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group aspect-[3/4] bg-[#1a1a20] rounded-xl border-2 overflow-hidden transition-all ${
        isDragging ? "border-blue-500 shadow-2xl scale-105 opacity-50" : "border-white/5 hover:border-white/20"
      }`}
    >
      {/* 1. Enhanced Drag Handle with Hint (User must drag from here) */}
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute top-2 left-2 flex items-center gap-2 p-1.5 bg-blue-600 rounded-lg cursor-grab active:cursor-grabbing z-20 shadow-lg border border-blue-400/30 group-hover:scale-105 transition-transform"
      >
        <GripVertical className="w-4 h-4 text-white" />
        <span className="text-[9px] font-bold text-white uppercase pr-1 hidden group-hover:block animate-in fade-in slide-in-from-left-1">
          Drag to Move
        </span>
      </div>

      {/* 2. Remove Button */}
      <button 
        onClick={() => onRemove(page.id)}
        className="absolute top-2 right-2 p-1.5 bg-red-500/10 hover:bg-red-500 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-all z-20 text-red-400 hover:text-white border border-red-500/20"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* 3. Page Preview */}
      <div className="w-full h-full p-3 pt-10">
        {page.thumbnail ? (
          <img 
            src={page.thumbnail} 
            alt={`Page ${page.originalIndex + 1}`} 
            className="w-full h-full object-contain rounded shadow-sm select-none pointer-events-none" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5 rounded">
            <FileText className="w-8 h-8 text-white/10" />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 py-1.5 bg-black/80 backdrop-blur-sm text-[10px] text-center font-bold tracking-widest text-white/50 border-t border-white/5">
        PAGE {page.originalIndex + 1}
      </div>
    </div>
  );
};

// --- Main Organizer Component ---
const PDFOrganizer = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF.');
      return;
    }

    setIsLoading(true);
    setError('');
    setFile(selectedFile);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const loadedPages = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;

        loadedPages.push({
          id: `page-${i}-${Math.random()}`,
          originalIndex: i - 1,
          thumbnail: canvas.toDataURL(),
        });
      }
      setPages(loadedPages);
    } catch (err) {
      setError('Error processing PDF. The file may be protected or corrupted.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removePage = (id) => {
    setPages(pages.filter(p => p.id !== id));
  };

  const saveOrganizedPDF = async () => {
    if (pages.length === 0) return;
    setIsSaving(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const outDoc = await PDFDocument.create();

      const indicesToCopy = pages.map(p => p.originalIndex);
      const copiedPages = await outDoc.copyPages(srcDoc, indicesToCopy);
      copiedPages.forEach(page => outDoc.addPage(page));

      const pdfBytes = await outDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `organized_${file.name}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to generate organized PDF.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white/90 flex flex-col items-center p-6 md:p-12 font-sans relative selection:bg-blue-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#14141a_0%,#0a0a0c_70%)] pointer-events-none" />

      <header className="relative text-center mb-10 w-full max-w-[1000px]">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Page Organizer</h1>
        <p className="text-white/60">Drag the <span className="text-blue-400 font-bold">blue handles</span> to reorder pages</p>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 w-full max-w-[1300px]">
        
        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-6">
            <div className="flex items-center gap-2 mb-6 text-blue-400 font-semibold uppercase text-xs tracking-widest">
              <Layers className="w-4 h-4" /> Tools
            </div>

            <div className="space-y-4">
              <button 
                onClick={saveOrganizedPDF}
                disabled={pages.length === 0 || isSaving}
                className="w-full py-4 bg-white text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-20 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Download Organized PDF
              </button>

              <button 
                onClick={() => { setFile(null); setPages([]); }}
                className="w-full py-3 border border-white/5 bg-white/[0.02] text-white/40 rounded-xl text-xs hover:text-red-400 hover:border-red-500/20 transition-all"
              >
                Clear All
              </button>

              {pages.length > 0 && (
                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1">Final Page Count</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-500">{pages.length}</span>
                    <span className="text-xs text-white/20 uppercase font-bold">Pages</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Workspace */}
        <section className="bg-[#111115] border border-white/10 rounded-3xl shadow-2xl flex flex-col min-h-[600px]">
          <div className="px-8 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Organizer Workspace</span>
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" /> Processing Documents
              </div>
            )}
          </div>

          <div className="flex-1 p-8">
            {!file ? (
              <div 
                className="h-full border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/10">
                  <Upload className="text-blue-500 w-10 h-10" />
                </div>
                <h3 className="text-lg font-medium">Select a PDF file</h3>
                <p className="text-white/20 text-xs mt-2 uppercase tracking-widest font-bold">Client-side processing</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                    {pages.map((page) => (
                      <SortablePage key={page.id} page={page} onRemove={removePage} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          {error && (
            <div className="m-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs animate-in slide-in-from-bottom-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
        </section>
      </main>

      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
      
      <footer className="mt-20 mb-10 relative z-10">
        <a href="https://www.instagram.com/shivam05_10" target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/30 hover:text-white/60 px-5 py-2.5 bg-white/5 backdrop-blur-md rounded-full border border-white/5 transition-all">
          Coded by ShivamYadav
        </a>
      </footer>
    </div>
  );
};

export default PDFOrganizer;