import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Copy, Check, RefreshCcw, ShieldCheck, Zap, Fingerprint, AlertTriangle } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ label: "Weak", color: "text-red-500", width: "w-1/4" });

  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = useCallback(() => {
    const charset = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-="
    };

    let characters = "";
    if (options.uppercase) characters += charset.uppercase;
    if (options.lowercase) characters += charset.lowercase;
    if (options.numbers) characters += charset.numbers;
    if (options.symbols) characters += charset.symbols;

    if (characters === "") return setPassword("Select an option");

    let result = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += characters.charAt(array[i] % characters.length);
    }
    setPassword(result);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Calculate Strength
  useEffect(() => {
    const activeOptions = Object.values(options).filter(Boolean).length;
    if (length < 8 || activeOptions < 2) {
      setStrength({ label: "Vulnerable", color: "text-red-500", width: "w-1/4", bg: "bg-red-500" });
    } else if (length < 12 || activeOptions < 3) {
      setStrength({ label: "Standard", color: "text-orange-500", width: "w-1/2", bg: "bg-orange-500" });
    } else {
      setStrength({ label: "Unbreakable", color: "text-emerald-500", width: "w-full", bg: "bg-emerald-500" });
    }
  }, [length, options]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white p-6 lg:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 border-b border-white/5 pb-10">
          <div className="flex items-center gap-6">
            <div className="size-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <Fingerprint size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-white">
                Nex<span className="text-blue-500">Pass</span>
              </h1>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-[3px] mt-2">Entropy Generation Unit</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">True Random • Offline</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* OUTPUT BOX */}
          <div className="lg:col-span-12">
            <div className="bg-[#111115] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <div className={`h-full transition-all duration-700 ${strength.bg} ${strength.width}`} />
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 w-full overflow-hidden">
                  <span className="text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-4 block">Generated Key</span>
                  <p className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-blue-100 break-all">
                    {password}
                  </p>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                  <button onClick={generatePassword} className="p-5 bg-white/5 hover:bg-white/10 rounded-3xl transition-all border border-white/5">
                    <RefreshCcw size={24} className="text-blue-500" />
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className="flex-1 md:flex-none px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[3px] transition-all shadow-xl shadow-blue-600/20"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                    {copied ? 'Captured' : 'Copy Key'}
                  </button>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase tracking-widest ${strength.color}`}>
                  Security Status: {strength.label}
                </span>
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="lg:col-span-7 space-y-6">
            <section className="bg-[#111115] p-10 rounded-[40px] border border-white/5 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <label className="text-[10px] font-black uppercase tracking-[3px] text-blue-500">Sequence Length</label>
                <span className="text-2xl font-black italic text-white/50">{length}</span>
              </div>
              <input 
                type="range" min="8" max="64" value={length} 
                onChange={(e) => setLength(e.target.value)}
                className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between mt-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                <span>8 chars</span>
                <span>64 chars</span>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <section className="bg-[#111115] p-10 rounded-[40px] border border-white/5 shadow-2xl">
              <label className="text-[10px] font-black uppercase tracking-[3px] text-blue-500 mb-8 block">Parameters</label>
              <div className="grid grid-cols-1 gap-4">
                {Object.keys(options).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setOptions({...options, [opt]: !options[opt]})}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${options[opt] ? 'bg-blue-600/10 border-blue-500/50 text-white' : 'bg-black/20 border-white/5 text-white/30'}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{opt}</span>
                    <div className={`size-5 rounded-md border flex items-center justify-center ${options[opt] ? 'bg-blue-500 border-blue-400' : 'border-white/10'}`}>
                      {options[opt] && <Check size={12} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}