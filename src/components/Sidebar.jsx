import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Home, Layers, Scissors, Hash, Minimize2, 
  ShieldAlert, Edit3, Image as ImageIcon, QrCode, FileText, X, LayoutGrid,
  FileStack, Wand2, Palette, Code2, Lock, ChevronDown, Video,
  EyeOff,
  CodeIcon,
  LockKeyhole,
  Fingerprint,
  SparklesIcon,
  FileJson,
  Signature,
  DiffIcon,
  CardSim
} from 'lucide-react';

const Sidebar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null); // For Mobile Toggles

 const categories = [
  {
    title: "Documents",
    icon: FileStack,
    items: [
      { name: "Sign Engine", path: "/services/pdfsign", icon: Signature },
      { name: "PDF Merger", path: "/services/pdfmerger", icon: Layers },
      { name: "PDF Splitter", path: "/services/pdfsplitter", icon: Scissors },
      { name: "PDF Organizer", path: "/services/pdforganizer", icon: Hash },
      { name: "PDF Compressor", path: "/services/pdfcompressor", icon: Minimize2 },
      { name: "PDF Watermarker", path: "/services/pdfwatermarker", icon: ShieldAlert },
      { name: "PDF Protect", path: "/services/pdfprotect", icon: Lock },
      { name: "PDF Editor", path: "/services/pdfeditor", icon: Edit3 },
      { name: "Text to PDF", path: "/services/texttopdf", icon: FileText },
      { name: "Image to PDF", path: "/services/imagetopdf", icon: FileStack },
    ]
  },
  {
    title: "Image & Media",
    icon: ImageIcon,
    items: [
      { name: "Image Converter", path: "/services/imageconverter", icon: ImageIcon },
      { name: "Background Remover", path: "/services/backgroundremover", icon: Wand2 },
      { name: "Hidden Message", path: "/services/hiddenmessage", icon: EyeOff },
      { name: "Business Card", path: "/services/businesscard", icon: CardSim },
      { name: "Color Extractor", path: "/services/colorpalette", icon: Palette },
      { name: "Code to Image", path: "/services/codetoimage", icon: Code2 },
      { name: "Code to Video", path: "/services/codetovideo", icon: CodeIcon },
    ]
  },
  {
    title: "Developer Tools",
    icon: Code2,
    items: [
      { name: "Code Snippets", path: "/services/codesnippets", icon: Code2 },
      { name: "JSON Formatter", path: "/services/jsonFormatter", icon: FileJson },
      { name: "Difference Checker", path: "/services/diffchecker", icon: DiffIcon },
      { name: "QR Generator", path: "/services/qrgenerator", icon: QrCode },
    ]
  },
  {
    title: "Security & Privacy",
    icon: ShieldAlert,
    items: [
      { name: "Privacy Redactor", path: "/services/privacyredactor", icon: ShieldAlert },
      { name: "Password Generator", path: "/services/passwordgenerator", icon: Fingerprint },
    ]
  }
];

  const toggleCategory = (title) => {
    setOpenCategory(openCategory === title ? null : title);
  };

  return (
    <>
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          
          /* Desktop Sub-menu Animation */
          @media (min-width: 768px) {
            .category-group:hover .submenu {
              max-height: 500px;
              opacity: 1;
              margin-top: 0.5rem;
            }
          }
        `}
      </style>

      {/* --- DESKTOP SIDEBAR --- */}
      <nav className="fixed left-0 top-0 h-screen w-20 hover:w-64 bg-[#0d0d12]/95 backdrop-blur-2xl border-r border-white/5 transition-all duration-300 group z-[100] hidden md:flex flex-col py-8 overflow-hidden">
        
        <Link to="/" className="px-5 mb-12 flex items-center gap-4 cursor-pointer">
          <img src="/NexTools.png" alt="Logo" className="w-10 h-10 object-contain shrink-0" />
          <span className="font-black text-xl tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-300 italic uppercase">
            Nex<span className="text-blue-500">Tools</span>
          </span>
        </Link>

        <div className="flex-1 px-3 space-y-4 overflow-y-auto no-scrollbar">
          {/* Static Home Link */}
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600' : 'hover:bg-white/5 text-white/40'}`}>
            <Home size={20} />
            <span className="text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100">Home</span>
          </NavLink>

          <div className="h-px bg-white/5 mx-2" />

          {/* Categorized Menus */}
          {categories.map((cat) => (
            <div key={cat.title} className="category-group relative">
              <div className="flex items-center justify-between px-4 py-3 text-white group-hover:text-blue-500 cursor-default transition-colors">
                <div className="flex items-center gap-4">
                  <cat.icon size={40} />
                  <span className="text-[10px] font-black uppercase tracking-[2px] opacity-0 group-hover:opacity-100 transition-all">
                    {cat.title}
                  </span>
                </div>
                <ChevronDown size={14} className="opacity-0 group-hover:opacity-100 transition-all rotate-[-90deg] group-hover:rotate-0" />
              </div>

              {/* Hover Dropdown for Desktop */}
              <div className="submenu max-h-0 opacity-0 overflow-hidden transition-all duration-500 flex flex-col gap-1 pl-4">
                {cat.items.map((item) => (
                  <NavLink 
                    key={item.path} 
                    to={item.path} 
                    className={({ isActive }) => `
                      flex items-center gap-4 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-tighter transition-all
                      ${isActive ? 'text-blue-400 bg-blue-500/10' : 'text-white/30 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    <item.icon size={14} />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* --- MOBILE DRAWER (Categorized) --- */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[200] bg-[#0a0a0c] p-6 animate-in slide-in-from-bottom duration-300 md:hidden overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black italic uppercase italic">All <span className="text-blue-500">Modules</span></h2>
            <button onClick={() => setIsDrawerOpen(false)} className="p-3 bg-white/5 rounded-full text-white/60"><X /></button>
          </div>
          
          <div className="space-y-4 pb-20">
            {categories.map((cat) => (
              <div key={cat.title} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                <button 
                  onClick={() => toggleCategory(cat.title)}
                  className="w-full flex items-center justify-between p-5 text-white"
                >
                  <div className="flex items-center gap-4">
                    <cat.icon className="text-blue-500" size={20} />
                    <span className="font-bold uppercase tracking-widest text-xs">{cat.title}</span>
                  </div>
                  <ChevronDown className={`transition-transform duration-300 ${openCategory === cat.title ? 'rotate-180' : ''}`} />
                </button>

                <div className={`transition-all duration-300 ${openCategory === cat.title ? 'max-h-[800px] border-t border-white/5' : 'max-h-0 opacity-0'}`}>
                  <div className="grid grid-cols-2 gap-2 p-3">
                    {cat.items.map((item) => (
                      <NavLink 
                        key={item.path} 
                        to={item.path} 
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl gap-2 active:scale-95 transition-all"
                      >
                        <item.icon className="w-5 h-5 text-white/40" />
                        <span className="text-[9px] text-center font-bold uppercase tracking-tight text-white/60">{item.name}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MOBILE BOTTOM BAR --- */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0d0d12]/95 backdrop-blur-xl border-t border-white/10 z-[100] flex md:hidden items-center justify-around px-2">
        <NavLink to="/" className="flex flex-col items-center gap-1 text-white/30"><Home size={20} /><span className="text-[9px]">Home</span></NavLink>
        <button onClick={() => { setIsDrawerOpen(true); setOpenCategory("PDF Tools"); }} className="flex flex-col items-center gap-1 text-white/30">
          <FileStack size={20} /><span className="text-[9px]">PDF</span>
        </button>
        
        {/* Central Action Button */}
        <div className="relative -top-4">
            <button onClick={() => setIsDrawerOpen(true)} className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-600/40 text-white">
                <LayoutGrid size={24} />
            </button>
        </div>

        <button onClick={() => { setIsDrawerOpen(true); setOpenCategory("Image Studio"); }} className="flex flex-col items-center gap-1 text-white/30">
          <ImageIcon size={20} /><span className="text-[9px]">Images</span>
        </button>
        <button onClick={() => { setIsDrawerOpen(true); setOpenCategory("Dev Tools"); }} className="flex flex-col items-center gap-1 text-white/30">
          <Code2 size={20} /><span className="text-[9px]">Dev</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;