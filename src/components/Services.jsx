import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FileStack, ImageIcon, Code2, ArrowRight, LayoutGrid, Zap, Sparkles
} from 'lucide-react'

const Services = () => {
  const navigate = useNavigate()

  const categories = [
    {
      id: 'pdf-tools',
      icon: <FileStack size={28} />,
      title: "PDF Engine",
      tag: "Secure",
      description: "Enterprise-grade PDF manipulation. Merge, split, and protect documents without a server.",
      accent: "text-blue-500",
      glow: "hover:shadow-blue-500/10",
    },
    {
      id: 'image-studio',
      icon: <ImageIcon size={28} />,
      title: "Image Studio",
      tag: "Creative",
      description: "High-speed image processing. Remove backgrounds and convert formats in milliseconds.",
      accent: "text-purple-500",
      glow: "hover:shadow-purple-500/10",
    },
    {
      id: 'dev-suite',
      icon: <Code2 size={28} />,
      title: "Dev Suite",
      tag: "Productivity",
      description: "Essential utilities for developers. Generate QR codes and clean code-to-image snippets.",
      accent: "text-emerald-500",
      glow: "hover:shadow-emerald-500/10",
    }
  ]

  return (
    <section id='services' className='bg-[#0a0a0c] text-white py-32 px-6 relative overflow-hidden'>
      {/* Visual background noise */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className='max-w-7xl mx-auto relative z-10'>
        
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8'>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-blue-500"></span>
              <span className="text-[10px] font-black uppercase tracking-[4px] text-blue-500">The Workshop</span>
            </div>
            <h2 className='text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]'>
              Powerful <br /> 
              <span className="text-white/10">Capabilities.</span>
            </h2>
          </div>
          <div className="md:text-right">
             <p className='text-white/40 text-lg max-w-sm font-medium leading-tight mb-6 ml-auto'>
               Everything happens in your browser RAM. Your data stays in your hands, always.
             </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate('/services')} // All cards go to the HUB
              className={`group relative bg-[#0d0d12] border border-white/5 rounded-[48px] p-12 cursor-pointer transition-all duration-500 hover:border-white/10 hover:-translate-y-2 ${cat.glow}`}
            >
              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[48px]" />

              <div className='relative z-10'>
                <div className={`w-20 h-20 rounded-[28px] bg-white/5 flex items-center justify-center ${cat.accent} mb-12 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-700`}>
                  {cat.icon}
                </div>
                
                <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/30 mb-4">
                    {cat.tag}
                </div>

                <h3 className='text-3xl font-black italic uppercase mb-4 tracking-tighter'>{cat.title}</h3>
                <p className='text-white/30 text-base leading-relaxed mb-12 font-medium'>{cat.description}</p>
                
                <div className={`flex items-center gap-3 ${cat.accent} text-[11px] font-black uppercase tracking-[2px]`}>
                  <span>Explore Tools</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA */}
        <div className='mt-24 flex flex-col items-center'>
          <button 
            onClick={() => navigate('/services')}
            className="group relative overflow-hidden bg-blue-600 px-16 py-7 rounded-[24px] font-black text-xs uppercase tracking-[4px] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/20"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative flex items-center gap-4">
              <Sparkles size={18} />
              Open Full Workshop
            </span>
          </button>
        </div>

      </div>
    </section>
  )
}

export default Services