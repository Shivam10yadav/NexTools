import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Upload, X, Download, 
  Settings, ChevronLeft, Trash2, FileText 
} from 'lucide-react';

const ImageToPDF = () => {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [options, setOptions] = useState({
    orientation: 'p', 
    margin: 10,
    format: 'a4'
  });
  
  const fileInputRef = useRef(null);

  // The Fix: Resetting the input value allows "Add More" to work repeatedly
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      processFiles(files);
      e.target.value = null; // Clears the input so it triggers onChange again next time
    }
  };

  const processFiles = (files) => {
    const validImages = files.filter(file => file.type.startsWith('image/'));
    const newImages = validImages.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
      name: file.name
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const doc = new jsPDF(options.orientation, 'mm', options.format);
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();
        
        const imgData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(images[i].file);
        });

        const m = options.margin;
        doc.addImage(
          imgData, 
          'JPEG', 
          m, 
          m, 
          pageWidth - (m * 2), 
          pageHeight - (m * 2), 
          undefined, 
          'FAST'
        );
      }

      doc.save(`NexTools-Export-${Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 pt-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />

      <main className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back 
          </button>
          <h1 className="text-4xl font-bold tracking-tight">Image to <span className="text-blue-500">PDF</span></h1>
          <p className="text-white/40 mt-2">Combine your photos into a high-quality document.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          
          {/* Sidebar Settings */}
          <aside className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-6 text-blue-400">
                <Settings size={18} />
                <h2 className="text-[11px] font-bold uppercase tracking-widest">Page Setup</h2>
              </div>
              
              <div className="space-y-6">
                {/* Orientation */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-3">Orientation</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl">
                    <button 
                      onClick={() => setOptions({...options, orientation: 'p'})}
                      className={`py-2 text-xs font-bold rounded-lg transition ${options.orientation === 'p' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/40 hover:text-white'}`}
                    >
                      Portrait
                    </button>
                    <button 
                      onClick={() => setOptions({...options, orientation: 'l'})}
                      className={`py-2 text-xs font-bold rounded-lg transition ${options.orientation === 'l' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/40 hover:text-white'}`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>

                {/* Margins */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-3">Margins ({options.margin}mm)</label>
                  <input 
                    type="range" min="0" max="40" step="5" 
                    value={options.margin}
                    onChange={(e) => setOptions({...options, margin: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <button 
                  onClick={generatePDF}
                  disabled={images.length === 0 || isProcessing}
                  className="w-full py-4 rounded-2xl bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:grayscale transition-all font-black text-xs uppercase tracking-[2px] shadow-xl flex items-center justify-center gap-2"
                >
                  {isProcessing ? "Generating..." : <>Export PDF <Download size={16} /></>}
                </button>
              </div>
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[24px]">
               <div className="flex justify-between items-center text-xs font-bold">
                 <span className="text-white/30 uppercase tracking-widest">Images</span>
                 <span className="text-blue-500">{images.length}</span>
               </div>
            </div>
          </aside>

          {/* Main Action Area */}
          <section className="bg-white/[0.03] border border-white/5 rounded-[32px] min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />

            {images.length === 0 ? (
              <div 
                className={`flex-1 flex flex-col items-center justify-center p-12 transition-all cursor-pointer ${isDragging ? "bg-blue-600/5 scale-[0.98]" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(Array.from(e.dataTransfer.files)); }}
                onClick={() => fileInputRef.current.click()}
              >
                <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-6 text-blue-500 border border-blue-500/20">
                  <Upload size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Drop images here</h3>
                <p className="text-white/30 text-sm mb-8">Click to browse or drag & drop</p>
                <span className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-bold">
                  Select Files
                </span>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-sm font-black uppercase tracking-[3px] text-white/20">Preview</h3>
                  <button 
                    onClick={() => setImages([])} 
                    className="text-[10px] font-black text-red-400/50 hover:text-red-400 transition uppercase tracking-[2px] flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Clear All
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {images.map((img) => (
                    <div key={img.id} className="group relative aspect-[3/4] bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5">
                      <img src={img.preview} alt="preview" className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                          className="bg-black/80 backdrop-blur-md p-2 rounded-xl text-white hover:bg-red-500 transition-colors shadow-xl"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                        <p className="text-[10px] font-bold truncate text-white/40">{img.name}</p>
                      </div>
                    </div>
                  ))}

                  {/* Add More Button */}
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="aspect-[3/4] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 text-white/10 hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
                  >
                    <div className="p-3 bg-white/[0.02] rounded-full group-hover:bg-blue-500/10 transition-colors">
                      <Upload size={20} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[2px]">Add More</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="mt-20 text-center pb-12 opacity-20 hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[4px]">
          <FileText size={12} /> Coded by ShivamYadav
        </div>
      </footer>
    </div>
  );
};

export default ImageToPDF;