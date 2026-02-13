import React from 'react';
import { ShieldCheck, Zap, Globe, Lock, Droplets, Palette, Code2, FileLock } from 'lucide-react';

const About = () => {
  const popularServices = [
    {
      title: "Hard Blur",
      label: "Privacy",
      desc: "Annihilate sensitive data. Our algorithm smudges pixels beyond mathematical recovery.",
      icon: <Droplets className="text-blue-500" size={24} />,
      gradient: "from-blue-500/20 to-transparent"
    },
    {
      title: "Document Vault",
      label: "Security",
      desc: "Apply 128-bit AES encryption to PDFs in milliseconds. No cloud, no risk, no leaks.",
      icon: <FileLock className="text-purple-500" size={24} />,
      gradient: "from-purple-500/20 to-transparent"
    },
    {
      title: "Code Snap",
      label: "Creator",
      desc: "Turn raw logic into social-media-ready art with Mac-style window frames and glass effects.",
      icon: <Code2 className="text-orange-500" size={24} />,
      gradient: "from-orange-500/20 to-transparent"
    },
    {
      title: "Color Thief",
      label: "Design",
      desc: "Extract dominant HEX palettes from any image instantly using high-speed quantization.",
      icon: <Palette className="text-emerald-500" size={24} />,
      gradient: "from-emerald-500/20 to-transparent"
    }
  ];

  return (
    <section id="about" className="bg-[#0a0a0c] text-white py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main Identity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-20 items-center mb-40">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[3px] text-blue-400">Zero-Server Logic</span>
            </div>

            <h2 className="text-6xl md:text-[90px] font-black tracking-tighter uppercase italic leading-[0.85] mb-10">
              The internet is <br /> 
              <span className="text-white/10">not your locker.</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/50 leading-tight max-w-2xl font-medium tracking-tight">
              Most online tools <span className="text-white">harvest your data</span>. We built a digital sanctuary where files are processed in your RAM, not on our servers. 
              <span className="text-blue-500 underline decoration-2 underline-offset-8 ml-2 italic">Privacy isn't a feature; it's our core.</span>
            </p>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600/20 blur-[80px] group-hover:bg-blue-600/30 transition-all duration-700" />
            <div className="relative bg-white/[0.02] border border-white/10 p-10 rounded-[48px] backdrop-blur-3xl shadow-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-[4px] text-white/30 mb-8">System Integrity</h4>
              <div className="space-y-8">
                {[
                  { icon: <ShieldCheck />, text: "Client-Side Only Processing", sub: "Data never leaves your browser." },
                  { icon: <Zap />, text: "Local GPU Acceleration", sub: "Blazing fast browser-based math." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="text-blue-500 mt-1">{item.icon}</div>
                    <div>
                      <p className="font-bold text-sm uppercase tracking-wide">{item.text}</p>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid with Enhanced Cards */}
        <div>
          <div className="mb-20">
            <h3 className="text-4xl font-black uppercase italic tracking-tighter">
              Utility <span className="text-white/20 text-5xl">Stack</span>
            </h3>
            <div className="w-20 h-1 bg-blue-600 mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularServices.map((service, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-[40px] bg-[#111116] border border-white/5 hover:border-blue-500/30 transition-all duration-500 overflow-hidden"
              >
                {/* Background Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                      {service.icon}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 text-white/40">
                      {service.label}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-bold mb-4 tracking-tight group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-sm text-white/30 leading-relaxed font-medium">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;