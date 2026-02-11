import React from 'react'

const Features = () => {
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Text & MD to PDF",
      description: "Convert your text documents and markdown files into professional PDFs instantly with perfect formatting."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3z" fill="currentColor"/>
        </svg>
      ),
      title: "Instant QR Generator",
      description: "Generate custom QR codes for your business, websites, or marketing campaigns in seconds."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2v6h6M9 15h6M12 18v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "PDF Splitter",
      description: "Split large PDF files into multiple smaller documents with precise page selection and control."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "PDF Compressor",
      description: "Reduce PDF file sizes without losing quality, making them easier to share and store."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "PDF Merger",
      description: "Combine multiple PDF files into a single document seamlessly with drag-and-drop simplicity."
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Batch Processing",
      description: "Process multiple files at once to save time and boost your productivity significantly."
    }
  ]

  return (
    <>
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
          * {
            font-family: "Poppins", sans-serif;
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          .feature-card {
            transition: all 0.3s ease;
          }
          
          .feature-card:hover {
            transform: translateY(-5px);
          }
          
          .feature-card:hover .feature-icon {
            animation: float 2s ease-in-out infinite;
          }
        `}
      </style>

      <section className='bg-black text-white py-20 md:py-28 px-4 bg-[url("https://assets.prebuiltui.com/images/components/hero-section/hero-background-image.png")] bg-cover bg-center bg-no-repeat pb-32'>
        <div className='max-w-7xl mx-auto'>
          {/* Section Header */}
          <div className='text-center max-w-3xl mx-auto mb-16'>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
              <div className="relative flex size-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#A6FF5D] opacity-75 animate-ping"></span>
                <span className="relative inline-flex size-1.5 rounded-full bg-[#A6FF5D]"></span>
              </div>
              <span className='text-xs text-white/70'>Powerful Features</span>
            </div>
            
            <h2 className='text-3xl md:text-5xl font-semibold mb-4 leading-tight'>
              Everything you need to manage your documents
            </h2>
            <p className='text-base md:text-lg text-gray-400'>
              Powerful tools designed to simplify your workflow and boost productivity with professional results.
            </p>
          </div>

          {/* Features Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((feature, index) => (
              <div 
                key={index}
                className='feature-card bg-gray-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-gray-900/60 hover:border-white/20 cursor-pointer group'
              >
                <div className='feature-icon bg-[#A6FF5D]/10 w-14 h-14 rounded-xl flex items-center justify-center text-[#A6FF5D] mb-5 group-hover:bg-[#A6FF5D]/20 transition-colors'>
                  {feature.icon}
                </div>
                
                <h3 className='text-xl font-semibold mb-3 text-white group-hover:text-[#A6FF5D] transition-colors'>
                  {feature.title}
                </h3>
                
                <p className='text-gray-400 text-sm leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className='mt-16 text-center'>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <button className="bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-800 px-8 py-3 rounded-full text-sm font-medium transition cursor-pointer group">
                <div className="relative overflow-hidden">
                  <span className="block transition-transform duration-200 group-hover:-translate-y-full">
                    Start for free
                  </span>
                  <span className="absolute top-0 left-0 block transition-transform duration-200 group-hover:translate-y-0 translate-y-full">
                    Start for free
                  </span>
                </div>
              </button>
              
              <button className="bg-white/10 hover:bg-white/15 backdrop-blur text-white px-8 py-3 rounded-full text-sm font-medium transition border border-white/20 hover:border-white/30">
                View all features
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Features