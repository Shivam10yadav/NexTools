import React, { useState } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
          * { font-family: "Poppins", sans-serif; }

          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* The Glowing Border Effect */
          .rainbow {
            position: relative;
            z-index: 0;
            overflow: hidden;
            padding: 1.5px;
          }

          .rainbow::before {
            content: '';
            position: absolute;
            z-index: -2;
            left: -50%;
            top: -50%;
            width: 200%;
            height: 200%;
            background-color: #1a1a1a;
            background-repeat: no-repeat;
            background-size: 50% 50%, 50% 50%;
            background-position: 0 0, 100% 0, 100% 100%, 0 100%;
            background-image: conic-gradient(transparent, #2563eb, #4f46e5, transparent 30%);
            animation: rotate 4s linear infinite;
          }

          .rainbow::after {
            content: '';
            position: absolute;
            z-index: -1;
            left: 1px;
            top: 1px;
            width: calc(100% - 2px);
            height: calc(100% - 2px);
            background: #0d0d12;
            border-radius: 9999px;
          }

          /* Mobile Menu Styles */
          .mobile-menu {
            position: fixed;
            top: 0;
            right: -100%;
            width: 100%;
            max-width: 400px;
            height: 100vh;
            background: #0a0a0c;
            transition: right 0.3s ease;
            z-index: 100;
            border-left: 1px solid rgba(255,255,255,0.05);
          }

          .mobile-menu.open {
            right: 0;
          }

          .mobile-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0,0,0,0.8);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            z-index: 99;
          }

          .mobile-overlay.open {
            opacity: 1;
            visibility: visible;
          }
        `}
      </style>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <img src="/NexTools.png" alt="Logo" className="w-8 h-8 object-contain" />
              <h2 className="text-2xl font-bold tracking-tighter">
                Nex<span className="text-blue-500">Tools</span>
              </h2>
            </div>
            <button 
              onClick={() => setMobileOpen(false)}
              className="text-white/50 hover:text-white transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="flex flex-col gap-2 p-6">
            {['home', 'about', 'services', 'faq', 'pricing', 'contact', 'footer'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setMobileOpen(false)}
                className="text-white/60 hover:text-blue-500 transition-colors duration-300 py-4 text-lg font-semibold uppercase tracking-wider border-b border-white/5"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      <header id="home" className="bg-[#0a0a0c] text-white flex flex-col items-center relative overflow-hidden pb-24">
        
        {/* Ambient Glows for Depth */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -ml-48 pointer-events-none" />
        
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6 md:px-12">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/NexTools.png" alt="Logo" className="w-8 h-8 object-contain" />
              <h2 className="text-2xl font-bold tracking-tighter">
                Nex<span className="text-blue-500">Tools</span>
              </h2>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[2px]">
              {['home', 'about', 'services', 'faq', 'pricing', 'contact', 'footer'].map((item) => (
                <a 
                  key={item}
                  href={`#${item}`} 
                  className="text-white/30 hover:text-blue-500 transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileOpen(true)} 
              className="md:hidden text-white/50 hover:text-white transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Floating Badge */}
        <div className="rainbow flex items-center justify-center rounded-full mt-40 md:mt-48 transition active:scale-95 shadow-2xl shadow-blue-500/10 relative z-10">
          <button className="flex items-center justify-center gap-3 px-6 py-2.5 text-white rounded-full font-medium bg-[#0d0d12] backdrop-blur relative z-10">
            <div className="relative flex size-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75 animate-ping"></span>
              <span className="relative inline-flex size-1.5 rounded-full bg-blue-500"></span>
            </div>
            <span className="text-[10px] uppercase tracking-[2px] font-bold text-white/80">Powerful Tools • Zero Hassle</span>
          </button>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-[85px] font-black text-center max-w-6xl mt-10 leading-[0.9] px-4 tracking-tighter relative z-10 italic uppercase">
          The Ultimate <br className="hidden md:block" />
          <span className="text-white/10">Digital Workshop.</span>
        </h1>

        <p className="text-base md:text-xl text-white/40 text-center max-w-3xl mt-8 px-6 font-medium leading-relaxed relative z-10">
          Professional-grade tools for creators and developers. From <span className="text-white/80">PDF encryption</span> to <span className="text-white/80">AI image processing</span>, 
          everything happens locally in your browser—your data never leaves your device.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-5 mt-14 relative z-10">
          <Link to="/services">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95">
              Get Started Today
            </button>
          </Link>
          
          <Link to="/services">
            <button className="px-12 py-5 text-sm font-black uppercase tracking-widest text-white/70 rounded-2xl border border-white/10 hover:bg-white/5 transition-all">
              Our Tools
            </button>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-4 mt-28 opacity-20 hover:opacity-100 transition-opacity cursor-pointer animate-bounce relative z-10">
          <div className="w-[2px] h-12 bg-gradient-to-b from-blue-500 to-transparent rounded-full" />
          <p className="text-[10px] font-black uppercase tracking-[4px]">Scroll</p>
        </div>

      </header>
    </>
  );
};

export default Hero;