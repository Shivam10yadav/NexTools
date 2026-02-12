import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, QrCode, Scissors, Archive, Merge, ImageIcon, ArrowRight } from 'lucide-react'

const Services = () => {
  const navigate = useNavigate()

  const services = [
    {
      id: 'text-to-pdf',
      icon: <FileText size={32} />,
      title: "Text & MD to PDF",
      description: "Convert text and markdown files into professional PDFs with perfect formatting and styling.",
      path: "/services/texttopdf",
      color: "from-blue-500/20 to-cyan-500/20",
      hoverColor: "group-hover:from-blue-500/30 group-hover:to-cyan-500/30"
    },
    {
      id: 'qr-generator',
      icon: <QrCode size={32} />,
      title: "QR Code Generator",
      description: "Create custom QR codes instantly for your business, websites, and marketing campaigns.",
      path: "/services/qrgenerator",
      color: "from-purple-500/20 to-pink-500/20",
      hoverColor: "group-hover:from-purple-500/30 group-hover:to-pink-500/30"
    },
    {
      id: 'pdf-splitter',
      icon: <Scissors size={32} />,
      title: "PDF Splitter",
      description: "Split large PDF files into smaller documents with precise page selection and control.",
      path: "/services/pdfsplitter",
      color: "from-orange-500/20 to-red-500/20",
      hoverColor: "group-hover:from-orange-500/30 group-hover:to-red-500/30"
    },
    {
      id: 'pdf-compressor',
      icon: <Archive size={32} />,
      title: "PDF Compressor",
      description: "Reduce PDF file sizes without losing quality, perfect for easy sharing and storage.",
      path: "/services/pdfcompressor",
      color: "from-green-500/20 to-emerald-500/20",
      hoverColor: "group-hover:from-green-500/30 group-hover:to-emerald-500/30"
    },
    {
      id: 'pdf-merger',
      icon: <Merge size={32} />,
      title: "PDF Merger",
      description: "Combine multiple PDF files into one document seamlessly with drag-and-drop ease.",
      path: "/services/pdfmerger",
      color: "from-yellow-500/20 to-amber-500/20",
      hoverColor: "group-hover:from-yellow-500/30 group-hover:to-amber-500/30"
    },
    {
      id: 'image-converter',
      icon: <ImageIcon size={32} />,
      title: "Image Converter",
      description: "Convert HEIC, JPG, PNG, and WEBP instantly.",
      path: "/services/imageconverter",
      color: "from-yellow-500/20 to-amber-500/20",
      hoverColor: "group-hover:from-yellow-500/30 group-hover:to-amber-500/30"
    },
  ]

  const handleServiceClick = (path) => {
    navigate(path)
  }

  return (
    <>
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
          * {
            font-family: "Poppins", sans-serif;
          }
          
          @keyframes slideUp {
            0% {
              transform: translateY(10px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          .service-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            animation: slideUp 0.6s ease-out forwards;
          }
          
          .service-card:hover {
            transform: translateY(-8px) scale(1.02);
          }
          
          .service-card:nth-child(1) { animation-delay: 0s; }
          .service-card:nth-child(2) { animation-delay: 0.1s; }
          .service-card:nth-child(3) { animation-delay: 0.2s; }
          .service-card:nth-child(4) { animation-delay: 0.3s; }
          .service-card:nth-child(5) { animation-delay: 0.4s; }
          .service-card:nth-child(6) { animation-delay: 0.5s; }
          
          .arrow-icon {
            transition: transform 0.3s ease;
          }
          
          .service-card:hover .arrow-icon {
            transform: translateX(5px);
          }
        `}
      </style>

      <section id='services' className='bg-black text-white py-20 md:py-28 px-4 bg-[url("https://assets.prebuiltui.com/images/components/hero-section/hero-background-image.png")] bg-cover bg-center bg-no-repeat'>
        <div className='max-w-7xl mx-auto'>
          {/* Section Header */}
          <div className='text-center max-w-3xl mx-auto mb-16'>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
              <div className="relative flex size-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#A6FF5D] opacity-75 animate-ping"></span>
                <span className="relative inline-flex size-1.5 rounded-full bg-[#A6FF5D]"></span>
              </div>
              <span className='text-xs text-white/70'>Our Services</span>
            </div>
            
            <h2 className='text-3xl md:text-5xl font-semibold mb-4 leading-tight'>
              Choose the service you need
            </h2>
            <p className='text-base md:text-lg text-gray-400'>
              Click on any service to get started and experience professional-grade document tools instantly.
            </p>
          </div>

          {/* Services Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {services.map((service, index) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service.path)}
                className='service-card group relative overflow-hidden bg-gray-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-gray-900/60 hover:border-[#A6FF5D]/50 cursor-pointer'
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} ${service.hoverColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
                
                {/* Content */}
                <div className='relative z-10'>
                  {/* Icon */}
                  <div className='bg-[#A6FF5D]/10 w-16 h-16 rounded-xl flex items-center justify-center text-[#A6FF5D] mb-6 group-hover:bg-[#A6FF5D]/20 transition-all duration-300 group-hover:scale-110'>
                    {service.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className='text-xl font-semibold mb-3 text-white group-hover:text-[#A6FF5D] transition-colors duration-300'>
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className='text-gray-400 text-sm leading-relaxed mb-6'>
                    {service.description}
                  </p>
                  
                  {/* Arrow Link */}
                  <div className='flex items-center gap-2 text-[#A6FF5D] text-sm font-medium'>
                    <span>Get started</span>
                    <ArrowRight className="arrow-icon" size={16} />
                  </div>
                </div>

                {/* Corner Accent */}
                <div className='absolute top-0 right-0 w-24 h-24 bg-[#A6FF5D]/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className='mt-16 text-center'>
            <p className='text-gray-400 mb-6'>Need help choosing the right service?</p>
            <button className="bg-white/10 hover:bg-white/15 backdrop-blur text-white px-8 py-3 rounded-full text-sm font-medium transition border border-white/20 hover:border-[#A6FF5D]/50">
              Contact our support team
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Services