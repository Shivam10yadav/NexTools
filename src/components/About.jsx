import React from 'react';
import { ShieldCheck, Zap, Droplets, Palette, Sparkles, QrCode, Lock, Cpu } from 'lucide-react';

const About = () => {
  const popularServices = [
    {
      title: "NexRedact",
      label: "Privacy",
      desc: "Instantly hide sensitive data in screenshots. We smudge pixels in your browser so they can never be seen again.",
      icon: <Droplets className="text-blue-500" size={24} />,
      gradient: "from-blue-500/20 to-transparent"
    },
    {
      title: "NexPrompt",
      label: "AI Studio",
      desc: "Turn a simple 'hello' into a professional AI command. We provide the vocabulary that AI models love.",
      icon: <Sparkles className="text-purple-500" size={24} />,
      gradient: "from-purple-500/20 to-transparent"
    },
    {
      title: "NexQR",
      label: "Branding",
      desc: "Create permanent, colorful QR codes. No tracking, no expiration dates, and 100% private.",
      icon: <QrCode className="text-orange-500" size={24} />,
      gradient: "from-orange-500/20 to-transparent"
    },
    {
      title: "Color Thief",
      label: "Design",
      desc: "Steal the perfect colors from any photo. Drag an image, get a pro-level color palette instantly.",
      icon: <Palette className="text-emerald-500" size={24} />,
      gradient: "from-emerald-500/20 to-transparent"
    }
  ];

  return (
    <section id="about" className="bg-[#08080a] text-white py-32 px-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 size-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main Identity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-20 items-center mb-40">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/20 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[4px] text-blue-400">Personal Workshop Engine</span>
            </div>

            <h2 className="text-6xl md:text-[100px] font-black tracking-tighter uppercase italic leading-[0.8] mb-12">
              Your data <br /> 
              <span className="text-white/5 italic">is not a product.</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/40 leading-snug max-w-2xl font-bold tracking-tight">
              Most online tools <span className="text-white underline decoration-blue-500/50">store your files</span>. We don't. NexTools runs entirely in your browser memory. 
              <span className="block mt-6 text-blue-500 italic">No Uploads. No Servers. No Logs. Just Utilities.</span>
            </p>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600/10 blur-[100px] group-hover:bg-blue-600/20 transition-all duration-1000" />
            <div className="relative bg-[#111115] border border-white/5 p-12 rounded-[60px] shadow-2xl overflow-hidden">
               {/* Decorative Grid */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              
              <h4 className="text-[10px] font-black uppercase tracking-[5px] text-white/20 mb-10 flex items-center gap-2">
                <Lock size={12} className="text-blue-500" /> Security Protocol
              </h4>
              
              <div className="space-y-10 relative z-10">
                {[
                  { icon: <ShieldCheck />, text: "Edge-only logic", sub: "Data never touches a cloud server." },
                  { icon: <Zap />, text: "Zero-latency", sub: "Processes as fast as your CPU can think." },
                  { icon: <Cpu />, text: "RAM Isolated", sub: "Closing the tab wipes all session data." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-center">
                    <div className="text-blue-500 p-3 bg-blue-500/10 rounded-2xl">{item.icon}</div>
                    <div>
                      <p className="font-black text-xs uppercase tracking-widest text-white/90">{item.text}</p>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-[2px] mt-1">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div>
          <div className="flex items-end justify-between mb-16 border-b border-white/5 pb-10">
            <div>
              <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                Utility <span className="text-blue-500">Workshop</span>
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[5px] text-white/20 mt-4">Powerful tools without the privacy tax</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service, index) => (
              <div 
                key={index}
                className="group relative p-10 rounded-[48px] bg-[#111116] border border-white/5 hover:border-blue-500/40 transition-all duration-500 overflow-hidden"
              >
                {/* Background Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div className="p-5 bg-white/5 rounded-[24px] group-hover:bg-blue-600 transition-all duration-500 text-white">
                      {service.icon}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[3px] px-3 py-1 rounded-full border border-white/10 text-white/30">
                      {service.label}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-black mb-4 tracking-tighter uppercase italic group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-xs text-white/30 leading-relaxed font-bold uppercase tracking-tight">
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