import React, { useState, useRef, useEffect } from 'react';
import { Download, Play, Pause, RotateCcw, Code2, Zap, Settings2, MonitorDown, Palette, Cpu, Sparkles, RefreshCw } from 'lucide-react';

export default function ScrollableCodeForge() {
  const [code, setCode] = useState(`// NEXUS LONG SNIPPET TEST\nfunction heavyProcess() {\n  const data = Array(50).fill(0);\n  console.log("Starting deep scan...");\n  \n  // This snippet is long to test scrolling\n  data.forEach((_, i) => {\n    if(i % 2 === 0) {\n      console.log(\`Analyzing sector \${i}...\`);\n    } else {\n      console.log(\`Optimizing buffer \${i}...\`);\n    }\n  });\n\n  return "SYSTEM_OPTIMIZED";\n}\n\nheavyProcess();`);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(80);
  const [fontSize, setFontSize] = useState(20);
  const [activeTheme, setActiveTheme] = useState('hyper');
  const [videoUrl, setVideoUrl] = useState(null);
  
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const animationRef = useRef(null);
  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);

  const themeMatrix = {
    hyper: { name: 'Hyper Blue', bg: '#050507', text: '#ffffff', keyword: '#3b82f6', string: '#10b981', comment: '#4b5563', accent: '#3b82f6' },
    matrix: { name: 'Deep Grid', bg: '#020d02', text: '#00ff41', keyword: '#ffffff', string: '#008f11', comment: '#003b00', accent: '#00ff41' },
    lava: { name: 'Magma Flow', bg: '#0c0505', text: '#ffedd5', keyword: '#ef4444', string: '#f59e0b', comment: '#450a0a', accent: '#ef4444' },
    synth: { name: 'Synthwave', bg: '#120422', text: '#f0abfc', keyword: '#22d3ee', string: '#fbbf24', comment: '#581c87', accent: '#d946ef' },
    ghost: { name: 'Ghost Mono', bg: '#ffffff', text: '#000000', keyword: '#6366f1', string: '#14b8a6', comment: '#94a3b8', accent: '#6366f1' }
  };

  const drawFrame = (currentChar) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const theme = themeMatrix[activeTheme];
    
    const lines = code.slice(0, currentChar).split('\n');
    const lineHeight = fontSize * 1.7;
    const margin = 50;
    
    // Set canvas height based on content to allow internal scrolling
    const requiredHeight = Math.max(720, (lines.length * lineHeight) + (margin * 2));
    if (canvas.height !== requiredHeight) {
        canvas.height = requiredHeight;
    }

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;
    ctx.textBaseline = 'top';
    
    const maxWidth = canvas.width - (margin * 2);
    let x = margin;
    let y = margin;

    lines.forEach((line) => {
      const words = line.split(' ');
      words.forEach((word, wordIdx) => {
        const wordWithSpace = word + (wordIdx < words.length - 1 ? ' ' : '');
        const wordWidth = ctx.measureText(wordWithSpace).width;

        if (x + wordWidth > maxWidth) { x = margin; y += lineHeight; }

        ctx.fillStyle = theme.text;
        if (['function', 'const', 'let', 'return', 'forEach', 'export'].includes(word)) ctx.fillStyle = theme.keyword;
        if (word.startsWith('"') || word.startsWith("'") || word.includes('`')) ctx.fillStyle = theme.string;
        if (word.startsWith('//')) ctx.fillStyle = theme.comment;

        ctx.fillText(wordWithSpace, x, y);
        x += wordWidth;
      });
      x = margin;
      y += lineHeight;
    });

    // Cursor
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      ctx.fillStyle = theme.accent;
      ctx.fillRect(x, y - lineHeight, 3, fontSize);
    }
  };

  // Fixed Refresh / Reset Logic
  const handleReset = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current.stop();
    
    startTimeRef.current = 0;
    pauseTimeRef.current = 0;
    setProgress(0);
    setVideoUrl(null);
    setIsRecording(false);
    setIsPaused(false);
    
    // Reset canvas to base state
    const canvas = canvasRef.current;
    if (canvas) {
        canvas.height = 720;
        drawFrame(code.length);
    }
  };

  useEffect(() => { if (!isRecording) drawFrame(code.length); }, [code, activeTheme, fontSize, speed]);

  const startRecording = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setVideoUrl(null);
    chunksRef.current = [];
    startTimeRef.current = 0;
    setIsRecording(true);
    setIsPaused(false);

    // Capture at a steady 60fps
    const stream = canvas.captureStream(60);
    mediaRecorderRef.current = new MediaRecorder(stream, { 
        mimeType: 'video/webm;codecs=vp9', 
        videoBitsPerSecond: 8000000 
    });
    
    mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoUrl(URL.createObjectURL(blob));
    };
    
    mediaRecorderRef.current.start();
    animationRef.current = requestAnimationFrame(animate);
  };

  const animate = (timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    if (isPaused) { pauseTimeRef.current = timestamp; return; }
    
    const elapsed = timestamp - startTimeRef.current;
    const charIndex = Math.floor((elapsed * speed) / 1000);

    if (charIndex >= code.length) {
      drawFrame(code.length);
      stopRecording();
      return;
    }

    drawFrame(charIndex);
    setProgress((charIndex / code.length) * 100);
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current.stop();
    cancelAnimationFrame(animationRef.current);
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white p-4 lg:p-10 font-sans">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT CONTROL PANEL */}
        <div className="lg:col-span-4 space-y-8">
          <header className="flex items-center gap-4 mb-6">
            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40">
              <Zap size={20} className="fill-white text-white" />
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Forge<span className="text-blue-500">Studio</span></h1>
          </header>

          <div className="bg-[#111115] border border-white/5 rounded-[32px] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Editor</span>
              <button onClick={handleReset} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-blue-400 transition-colors" title="Refresh Engine">
                <RefreshCw size={16} />
              </button>
            </div>
            <textarea 
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 bg-black/40 border border-white/5 rounded-2xl p-5 font-mono text-sm focus:border-blue-500/40 outline-none resize-none transition-all scrollbar-thin scrollbar-thumb-white/10"
            />
          </div>

          <div className="bg-[#111115] border border-white/5 rounded-[32px] p-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6 block">Visual Matrix</span>
            <div className="grid grid-cols-5 gap-3">
              {Object.keys(themeMatrix).map((t) => (
                <button 
                  key={t}
                  onClick={() => setActiveTheme(t)}
                  className={`h-12 rounded-xl transition-all border-2 ${activeTheme === t ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/20' : 'border-white/5'}`}
                  style={{ backgroundColor: themeMatrix[t].bg }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PREVIEW PANEL */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* THE SCROLLABLE OUTPUT CONTAINER */}
          <div className="bg-[#111115] border border-white/5 rounded-[40px] p-2 shadow-2xl">
            <div className="w-full aspect-video bg-black rounded-[36px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-600/20">
              {/* This inner div ensures the scroll follows content height */}
              <div className="min-w-full">
                <canvas ref={canvasRef} width={1280} height={720} className="w-full h-auto block rounded-[36px]" />
              </div>
            </div>
            
            {isRecording && (
              <div className="mt-4 flex items-center justify-center gap-3 py-2 bg-red-600/10 rounded-full">
                <span className="size-2 bg-red-500 rounded-full animate-ping" />
                <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Live Recording Frame</span>
              </div>
            )}
          </div>

          {/* ACTION BAR */}
          <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1 bg-[#111115] rounded-3xl border border-white/5 p-4 flex items-center gap-6">
                <div className="flex-1 space-y-1">
                   <div className="flex justify-between text-[8px] font-black uppercase text-white/30">
                     <span>Speed</span>
                     <span className="text-blue-500">{speed} CPS</span>
                   </div>
                   <input type="range" min="20" max="250" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                   <div className="flex justify-between text-[8px] font-black uppercase text-white/30">
                     <span>Font</span>
                     <span className="text-blue-500">{fontSize}PX</span>
                   </div>
                   <input type="range" min="16" max="32" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
             </div>

             <div className="flex gap-4">
               {!isRecording ? (
                 <button onClick={startRecording} className="px-10 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-widest rounded-3xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                   Forge Video
                 </button>
               ) : (
                 <button onClick={stopRecording} className="px-10 bg-red-600 text-white font-black uppercase text-xs tracking-widest rounded-3xl animate-pulse">
                   Stop
                 </button>
               )}
               {videoUrl && (
                 <a href={videoUrl} download="render.webm" className="px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl flex items-center justify-center transition-all shadow-xl shadow-emerald-600/20 active:scale-95">
                   <MonitorDown size={20} />
                 </a>
               )}
             </div>
          </div>

          {/* PROGRESS BAR */}
          {progress > 0 && progress < 100 && (
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
               <div className="bg-blue-600 h-full transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}