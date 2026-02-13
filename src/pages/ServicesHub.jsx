import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MousePointer2, LayoutGrid, ShieldCheck, Zap, Activity, ChevronDown, Trophy, Power } from 'lucide-react';

const ServicesHub = () => {
  const [isGameActive, setIsGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [nodes, setNodes] = useState([]);
  const idleTimerRef = useRef(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsGameActive(false);
      setNodes([]);
      setScore(0);
    }, 5000);
  }, []);

  const spawnNode = useCallback(() => {
    const id = Date.now();
    const newNode = {
      id,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
    };
    setNodes((prev) => [...prev, newNode]);
    setTimeout(() => {
      setNodes((prev) => prev.filter((n) => n.id !== id));
    }, 1500);
  }, []);

  useEffect(() => {
    let interval;
    if (isGameActive) {
      interval = setInterval(spawnNode, 1000);
      resetIdleTimer();
    }
    return () => {
      clearInterval(interval);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isGameActive, spawnNode, resetIdleTimer]);

  const handleNodeClick = (id) => {
    setScore((s) => s + 100);
    setNodes((prev) => prev.filter((n) => n.id !== id));
    resetIdleTimer();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col justify-center relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      <div className="max-w-7xl mx-auto w-full p-6 md:p-12 relative z-10">
        
        {/* --- MAIN HEADER --- */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Activity size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[3px] text-blue-400">System Live</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-[-0.05em] leading-[0.8]">
            The <br /> 
            <span className="text-blue-600 drop-shadow-[0_0_35px_rgba(37,99,235,0.4)]">
              Workshop
            </span>
          </h1>
        </div>

        {/* --- TWO-COLUMN LAYOUT (Immediate Impression) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          
          {/* Left: Info & Pro Cards (3 Cols) */}
          <div className="lg:col-span-3 space-y-10 ">
            <p className="text-white/40 text-lg md:text-xl font-medium italic leading-relaxed border-l-2 border-blue-600 pl-6 max-w-xl">
              "Professional grade utilities, executed entirely within your browser's secure sandbox. No cloud logs, just pure performance."
            </p>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {[
                { icon: LayoutGrid, title: "Sidebar Mapping", text: "Select tools from the control panel." },
                { icon: ShieldCheck, title: "Isolated RAM", text: "Zero data ever leaves this device." },
                { icon: MousePointer2, title: "Direct Execution", text: "Optimized browser-native speeds." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-wider">{item.title}</h3>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: The Interactive Diagnostic (2 Cols) */}
          <div className="lg:col-span-2 relative group h-full min-h-[400px]">
            <div className="absolute -inset-1 bg-blue-600/20 rounded-[40px] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            
            <div className="relative h-full w-full rounded-[40px] bg-[#0d0d12] border border-white/10 flex flex-col items-center justify-center overflow-hidden shadow-2xl border-b-blue-500/50 border-b-2">
              
              {/* HUD */}
              {isGameActive && (
                  <div className="absolute top-6 left-6 flex flex-col gap-1 z-20 animate-in fade-in zoom-in">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-2">
                          <Trophy size={12}/> {score}
                      </div>
                      <span className="text-[7px] font-black uppercase tracking-tighter text-blue-400">Pulse Stable</span>
                  </div>
              )}

              {!isGameActive ? (
                  <div className="text-center">
                      <button 
                        onClick={() => setIsGameActive(true)}
                        className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center group/btn"
                      >
                          <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-ping" />
                          <div className="w-full h-full bg-blue-600/10 rounded-full flex items-center justify-center border border-blue-500/50 group-hover/btn:bg-blue-600 transition-all duration-300">
                              <Power className="text-blue-500 group-hover/btn:text-white" size={28} />
                          </div>
                      </button>
                      <span className="text-[9px] font-black uppercase tracking-[6px] text-white/30 block mb-3 italic">Diagnostics</span>
                      <p className="text-[8px] font-bold uppercase tracking-[2px] text-white animate-pulse">Click to Play</p>
                  </div>
              ) : (
                  <div className="absolute inset-0 z-20">
                      {nodes.map(node => (
                          <button
                              key={node.id}
                              onClick={() => handleNodeClick(node.id)}
                              style={{ left: `${node.x}%`, top: `${node.y}%` }}
                              className="absolute p-4 transition-all duration-300 transform active:scale-75"
                          >
                              <div className="relative">
                                  <div className="absolute inset-0 bg-blue-500/40 blur-lg animate-ping rounded-full" />
                                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center border border-white/20">
                                      <Zap size={18} className="text-white" />
                                  </div>
                              </div>
                          </button>
                      ))}
                  </div>
              )}
              
              {/* Scanline Decoration */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
            </div>
          </div>
        </div>

        {/* --- FOOTER HINT --- */}
        <div className="mt-12 flex items-center justify-between opacity-20 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-4">
               <div className="w-12 h-px bg-blue-600" />
               <p className="text-[8px] font-black uppercase tracking-[4px]">Direct Drive Access</p>
            </div>
            <ChevronDown className="text-blue-500 animate-bounce" size={20} />
        </div>

      </div>
    </div>
  );
};

export default ServicesHub;