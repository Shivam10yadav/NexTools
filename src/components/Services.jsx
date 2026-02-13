import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Merge, ShieldAlert, Edit3, ArrowRight, LayoutGrid 
} from 'lucide-react'

const Services = () => {
  const navigate = useNavigate()

  // These are the 3 "Featured" services shown on the Home Page
  const featuredServices = [
    {
      id: 'pdf-merger',
      icon: <Merge size={32} />,
      title: "PDF Merger",
      description: "Combine multiple PDF files into one document seamlessly with drag-and-drop ease.",
      path: "/services/pdfmerger",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: 'pdf-watermarker',
      icon: <ShieldAlert size={32} />,
      title: "PDF Watermarker",
      description: "Protect your documents with custom text or image watermarks and tile patterns.",
      path: "/services/pdfwatermarker",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: 'pdf-editor',
      icon: <Edit3 size={32} />,
      title: "Content Editor",
      description: "Modify metadata, redact sensitive information, and inject text into existing PDFs.",
      path: "/services/pdfeditor",
      color: "from-green-500/20 to-emerald-500/20",
    }
  ]

  return (
    <>
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
          .services-font { font-family: "Poppins", sans-serif; }
          
          .service-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .service-card:hover {
            transform: translateY(-10px);
            border-color: rgba(59, 130, 246, 0.5);
          }
        `}
      </style>

      <section id='services' className='services-font bg-[#0a0a0c] text-white py-24 px-4 relative overflow-hidden'>
        <div className='max-w-7xl mx-auto relative z-10'>
          
          {/* Header */}
          <div className='text-center max-w-3xl mx-auto mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6 tracking-tight'>
              Choose a <span className="text-blue-500">Service</span>
            </h2>
            <p className='text-gray-400 text-lg'>
              Select a tool to get started, or explore our full suite of document processors.
            </p>
          </div>

          {/* Grid: Always shows exactly 3 */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {featuredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => navigate(service.path)}
                className='service-card group relative bg-white/[0.03] border border-white/10 rounded-3xl p-8 cursor-pointer overflow-hidden'
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className='relative z-10'>
                  <div className='w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all'>
                    {service.icon}
                  </div>
                  
                  <h3 className='text-xl font-bold mb-3'>{service.title}</h3>
                  <p className='text-gray-400 text-sm leading-relaxed mb-8'>{service.description}</p>
                  
                  <div className='flex items-center gap-2 text-blue-500 text-sm font-bold uppercase tracking-widest'>
                    <span>Start Now</span>
                    <ArrowRight className="transition-transform group-hover:translate-x-2" size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* THE MAIN BUTTON: Takes user to the first service (Merger) */}
          <div className='mt-20 text-center'>
            <button 
              onClick={() => navigate('/services/pdfmerger')}
              className="group relative inline-flex items-center gap-3 bg-white text-black hover:bg-blue-600 hover:text-white px-12 py-5 rounded-2xl font-bold transition-all duration-300 shadow-2xl active:scale-95"
            >
              <LayoutGrid size={20} />
              VIEW ALL SERVICES
              {/* This subtle hint tells the user they can navigate inside */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 text-[10px] text-white/20 uppercase tracking-[4px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Explore via Sidebar
              </div>
            </button>
          </div>

        </div>
      </section>
    </>
  )
}

export default Services