import React, { useState, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  Upload, FileText, Download, Trash2, GripVertical, 
  RefreshCw, AlertCircle, Layers, ChevronLeft, 
  ShieldCheck, Activity 
} from 'lucide-react';

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
      className={`relative group aspect-[3/4] bg-[#1a1a20] rounded-[20px] border-2 overflow-hidden transition-all duration-300 ${
        isDragging ? "border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.3)] scale-105 z-50" : "border-white/5 hover:border-white/20"
      }`}
    >
      {/* Enhanced Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute top-3 left-3 flex items-center gap-2 p-2 bg-blue-600 rounded-xl cursor-grab active:cursor-grabbing z-20 shadow-xl border border-blue-400/30 group-hover:scale-105 transition-transform"
      >
        <GripVertical className="w-4 h-4 text-white" />
        <span className="text-[8px] font-black text-white uppercase tracking-tighter hidden group-hover:block animate-in fade-in slide-in-from-left-1">
          REORDER
        </span>
      </div>

      {/* Remove Button */}
      <button 
        onClick={() => onRemove(page.id)}
        className="absolute top-3 right-3 p-2 bg-red-500/10 hover:bg-red-500 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-all z-20 text-red-400 hover:text-white border border-red-500/20"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Page Preview */}
      <div className="w-full h-full p-4 pt-12">
        {page.thumbnail ? (
          <img 
            src={page.thumbnail} 
            alt={`Page ${page.originalIndex + 1}`} 
            className="w-full h-full object-contain rounded-lg shadow-2xl select-none pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-lg">
            <FileText className="w-8 h-8 text-white/10" />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 py-2 bg-black/80 backdrop-blur-md text-[9px] text-center font-black tracking-[3px] text-white/30 border-t border-white/5 uppercase">
        Section {page.originalIndex + 1}
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
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 pt-32 relative overflow-hidden selection:bg-blue-500/30">
      
      {/* --- BACKGROUND AMBIENCE --- */}
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
            <span className="text-[9px] font-black uppercase tracking-[2px] text-blue-400">Sequential Engine v3.1</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tight">
            Page <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">Organizer</span>
          </h1>
          <p className="text-white/40 mt-3 font-medium">Restructure and reorder document flow with surgical precision.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          
          {/* --- SIDEBAR CONTROLS --- */}
          <aside className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 shadow-2xl backdrop-blur-md sticky top-32">
              <div className="flex items-center gap-2 mb-6 text-blue-400 font-bold uppercase text-[10px] tracking-widest">
                <Layers className="w-4 h-4" /> Control Tower
              </div>

              <div className="space-y-4">
                <button 
                  onClick={saveOrganizedPDF}
                  disabled={pages.length === 0 || isSaving}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-blue-500 disabled:opacity-20 transition-all shadow-xl shadow-blue-900/20"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Finalize & Export
                </button>

                <button 
                  onClick={() => { setFile(null); setPages([]); }}
                  className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors"
                >
                  Purge Workspace
                </button>

                {pages.length > 0 && (
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mb-2">Target Payload</p>
                    <div className="flex items-baseline gap-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <span className="text-3xl font-black italic text-blue-500 leading-none">{pages.length}</span>
                      <span className="text-[10px] text-white/40 uppercase font-black">Pages in Queue</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[24px] flex gap-3">
              <ShieldCheck className="text-blue-500 shrink-0" size={20} />
              <p className="text-[10px] leading-relaxed text-blue-200/50 font-bold uppercase tracking-wider">
                Memory-only processing. No data footprints left behind.
              </p>
            </div>
          </aside>

          {/* --- WORKSPACE --- */}
          <section className="bg-white/[0.03] border border-white/5 rounded-[32px] min-h-[600px] flex flex-col relative overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-white/30">Organization Deck</span>
              {isLoading && (
                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Syncing Buffer...
                </div>
              )}
            </div>

            <div className="flex-1 p-8">
              {!file ? (
                <div 
                  className="h-full border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all group duration-500"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 bg-blue-500/5 rounded-[32px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-blue-500/10 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                    <Upload className="text-blue-500 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase">Initialize PDF</h3>
                  <p className="text-white/20 text-[10px] mt-2 uppercase tracking-widest font-black">Secure Local Intake Only</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-8">
                      {pages.map((page) => (
                        <SortablePage key={page.id} page={page} onRemove={removePage} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {error && (
              <div className="m-8 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-bottom-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}
          </section>
        </div>
      </main>

      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
      
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

export default PDFOrganizer;