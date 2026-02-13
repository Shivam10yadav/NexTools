import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Merge, ShieldAlert, Edit3, ArrowRight, LayoutGrid, Zap 
} from 'lucide-react'

const Services = () => {
  const navigate = useNavigate()

  const featuredServices = [
    {
      id: 'pdf-merger',
      icon: <Merge size={28} />,
      title: "PDF Merger",
      tag: "Workflow",
      description: "Combine multiple PDF files into one high-fidelity document seamlessly with instant local processing.",
      path: "/services/pdfmerger",
      accent: "text-blue-500",
      glow: "shadow-blue-500/10",
    },
    {
      id: 'pdf-watermarker',
      icon: <ShieldAlert size={28} />,
      title: "Document Shield",
      tag: "Security",
      description: "Inject custom text or image watermarks with tile patterns to protect your intellectual property.",
      path: "/services/pdfwatermarker",
      accent: "text-purple-500",
      glow: "shadow-purple-500/10",
    },
    {
      id: 'pdf-editor',
      icon: <Edit3 size={28} />,
      title: "Meta Editor",
      tag: "Utility",
      description: "Modify document metadata, redact sensitive fields, and inject text strings without cloud dependency.",
      path: "/services/pdfeditor",
      accent: "text-emerald-500",
      glow: "shadow-emerald-500/10",
    }
  ]

  return (
    <section id='services' className='bg-[#0a0a0c] text-white py-32 px-6 relative overflow-hidden'>
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className='max-w-7xl mx-auto relative z-10'>
        
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8'>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Zap size={12} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-[3px] text-white/50">Production Ready</span>
            </div>
            <h2 className='text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none'>
              The <span className="text-blue-500">Service</span> <br /> 
              <span className="text-white/20">Directory.</span>
            </h2>
          </div>
          <p className='text-white/40 text-lg max-w-sm font-medium leading-tight mb-2'>
            High-performance tools optimized for speed and built for absolute privacy.
          </p>
        </div>

        {/* Grid System */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {featuredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(service.path)}
              className={`group relative bg-[#111116] border border-white/5 rounded-[40px] p-10 cursor-pointer transition-all duration-500 hover:border-white/20 hover:bg-[#16161d] shadow-2xl ${service.glow}`}
            >
              {/* Corner Tag */}
              <div className="absolute top-8 right-8 text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">
                {service.tag}
              </div>

              <div className='relative z-10'>
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center ${service.accent} mb-10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500`}>
                  {service.icon}
                </div>
                
                <h3 className='text-2xl font-bold mb-4 tracking-tight'>{service.title}</h3>
                <p className='text-white/30 text-sm leading-relaxed mb-10 min-h-[60px]'>{service.description}</p>
                
                {/* Action Link */}
                <div className={`flex items-center gap-3 ${service.accent} text-[11px] font-black uppercase tracking-[2px] opacity-60 group-hover:opacity-100 transition-all`}>
                  <span>Initialize Tool</span>
                  <div className="w-8 h-px bg-current transition-all group-hover:w-12" />
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className='mt-24 flex flex-col items-center'>
          <button 
            onClick={() => navigate('/services/pdfmerger')}
            className="group relative flex items-center gap-4 bg-white text-black px-14 py-6 rounded-[24px] font-black text-xs uppercase tracking-[3px] transition-all hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
          >
            <LayoutGrid size={18} />
            Explore Full Ecosystem
          </button>
          
          <p className="mt-8 text-[10px] font-bold text-white/10 uppercase tracking-[5px] animate-pulse">
            Local Processing • No Cloud
          </p>
        </div>

      </div>
    </section>
  )
}

export default Services