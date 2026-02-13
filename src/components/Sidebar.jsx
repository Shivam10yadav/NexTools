import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Home, Layers, Scissors, Hash, Minimize2, 
  ShieldAlert, Edit3, Image as ImageIcon, QrCode, FileText, X, LayoutGrid,
  FileStack ,Wand2,
  Palette,
  Code2,
  Lock
} from 'lucide-react';

const Sidebar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Merger', path: '/services/pdfmerger', icon: Layers },
    { name: 'Splitter', path: '/services/pdfsplitter', icon: Scissors },
    { name: 'Organizer', path: '/services/pdforganizer', icon: Hash },
    { name: 'Compressor', path: '/services/pdfcompressor', icon: Minimize2 },
    { name: 'Watermarker', path: '/services/pdfwatermarker', icon: ShieldAlert },
    { name: 'Pdf Protect', path: '/services/pdfprotect', icon: Lock },
    { name: 'Editor', path: '/services/pdfeditor', icon: Edit3 },
    { name: 'Image Conv.', path: '/services/imageconverter', icon: ImageIcon },
    { name: 'Color Extrac.', path: '/services/colorpalette', icon: Palette },
    { name: 'Code Snippets', path: '/services/codetoimage', icon: Code2 },
    { name: 'QR Gen', path: '/services/qrgenerator', icon: QrCode },
    { name: 'Text to PDF', path: '/services/texttopdf', icon: FileText },
    { name: 'Image To PDF', path: '/services/imagetopdf', icon: FileStack }, 
    { name: 'Background Remover', path: '/services/backgroundremover', icon: Wand2 }, 
  ];

  return (
    <>
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* --- DESKTOP SIDEBAR --- */}
      <nav className="fixed left-0 top-0 h-screen w-20 hover:w-64 bg-[#0d0d12]/90 backdrop-blur-2xl border-r border-white/5 transition-all duration-300 group z-[100] hidden md:flex flex-col py-8 overflow-hidden">
        
        <Link to="/" className="px-5 mb-12 flex items-center gap-4 cursor-pointer">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/40 transition-all" />
            <img src="/NexTools.png" alt="NexTools Logo" className="relative w-10 h-10 object-contain" />
          </div>
          <span className="font-bold text-xl tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white select-none">
            Nex<span className="text-blue-500">Tools</span>
          </span>
        </Link>

        <div className="flex-1 px-3 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `
                flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 
                ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.name}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* --- MOBILE DRAWER --- */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[150] bg-[#0a0a0c] p-6 animate-in slide-in-from-bottom duration-300 md:hidden overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
               <img src="/NexTools.png" className="w-8 h-8" alt="Logo" />
               <span className="font-bold text-lg text-white">All Services</span>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="p-2 bg-white/5 rounded-full text-white/60"><X /></button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pb-10">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                onClick={() => setIsDrawerOpen(false)}
                className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 rounded-2xl gap-2 active:scale-95 transition-all"
              >
                <item.icon className="w-6 h-6 text-blue-500" />
                <span className="text-[10px] text-center font-medium text-white/60">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* --- MOBILE BOTTOM BAR --- */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0d0d12]/95 backdrop-blur-xl border-t border-white/10 z-[100] flex md:hidden items-center justify-around px-2">
        <NavLink to="/" className="flex flex-col items-center gap-1 text-white/30"><Home className="w-5 h-5" /><span className="text-[9px]">Home</span></NavLink>
        <NavLink to="/services/pdfmerger" className="flex flex-col items-center gap-1 text-white/30"><Layers className="w-5 h-5" /><span className="text-[9px]">Merge</span></NavLink>
        <NavLink to="/services/pdfeditor" className="flex flex-col items-center gap-1 text-white/30"><Edit3 className="w-5 h-5" /><span className="text-[9px]">Editor</span></NavLink>
        <NavLink to="/services/qrgenerator" className="flex flex-col items-center gap-1 text-white/30"><QrCode className="w-5 h-5" /><span className="text-[9px]">QR Gen</span></NavLink>
        
        <button onClick={() => setIsDrawerOpen(true)} className="flex flex-col items-center gap-1 text-blue-500">
          <LayoutGrid className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase tracking-tighter">More</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;