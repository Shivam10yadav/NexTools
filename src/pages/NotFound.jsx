import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw, Ghost } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glitch Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full" />
      
      <div className="max-w-4xl w-full text-center relative z-10">
        
        {/* The "Glitched" 404 Header */}
        <div className="relative inline-block mb-8">
          <h1 className="text-[150px] md:text-[250px] font-black italic uppercase tracking-tighter leading-none opacity-10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Ghost size={120} className="text-blue-500 animate-bounce" />
          </div>
        </div>

        {/* Funny Typography */}
        <div className="space-y-4 mb-12">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
            File <span className="text-red-500 underline decoration-wavy">Not Found</span>
          </h2>
          <p className="text-white/40 text-lg md:text-xl font-medium italic max-w-xl mx-auto">
            "We searched the entire workshop. We checked under the PDF merger. We even asked the QR code generator. <br /> 
            <span className="text-white/80">This page doesn't exist."</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-blue-600 hover:text-white active:scale-95"
          >
            <Home size={18} />
            Back to Base
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-3 border border-white/10 text-white/60 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-white/5 hover:text-white"
          >
            <RotateCcw size={18} />
            Try Rebooting
          </button>
        </div>

        {/* Bottom Error Code Styling */}
        <div className="mt-20 flex flex-col items-center gap-2 opacity-20">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[5px]">
            <AlertTriangle size={12} />
            Error Code: NULL_POINTER_TO_NOWHERE
          </div>
          <div className="w-64 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        </div>

      </div>

      {/* Retro Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
           style={{ background: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)', backgroundSize: '100% 3px' }} />
    </div>
  );
};

export default NotFound;