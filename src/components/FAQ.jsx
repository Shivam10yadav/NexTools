import React, { useState } from 'react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "How secure is my data when using your services?",
      answer: "Your data security is our top priority. All files are encrypted during upload and processing using industry-standard SSL/TLS encryption. We automatically delete all processed files from our servers within 24 hours. We never share, sell, or store your documents permanently."
    },
    {
      question: "Is there a file size limit for uploads?",
      answer: "Free users can upload files up to 25MB per file. Pro users enjoy increased limits of up to 100MB per file, while Enterprise users have custom limits tailored to their needs. You can process multiple files in batch mode regardless of your plan."
    },
    {
      question: "What file formats do you support?",
      answer: "We support a wide range of formats including TXT, MD, DOCX, PDF, PNG, JPG, and more. For conversions, we support Text to PDF, Markdown to PDF, and various image formats. QR codes can be generated for URLs, text, contact cards, and WiFi credentials."
    },
    {
      question: "Can I use these tools without creating an account?",
      answer: "Yes! Our basic tools are available for immediate use without registration. However, creating a free account gives you access to batch processing, file history, higher upload limits, and the ability to save your preferences and templates."
    },
    {
      question: "How long does it take to process files?",
      answer: "Most files are processed instantly, usually within 1-3 seconds. Larger files or batch operations may take up to 30 seconds. We use high-performance servers to ensure the fastest possible processing times while maintaining quality."
    },
  ]

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
          * { font-family: "Poppins", sans-serif; }
          
          .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                        opacity 0.4s ease,
                        padding 0.4s ease;
            opacity: 0;
          }
          
          .faq-answer.open {
            max-height: 500px;
            opacity: 1;
            padding-bottom: 1.5rem;
          }
          
          .rotate-icon {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .rotate-icon.open {
            transform: rotate(180deg);
          }
          
          .faq-card {
            transition: all 0.3s ease;
          }
          
          .faq-card.active {
            border-color: rgba(59, 130, 246, 0.4) !important;
            background: rgba(255, 255, 255, 0.03) !important;
          }
        `}
      </style>

      <section id='faq' className='bg-[#0a0a0c] text-white py-20 md:py-28 px-4 relative'>
        {/* Sublte Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#1d4ed808_0%,transparent_70%)] pointer-events-none" />

        <div className='max-w-4xl mx-auto relative z-10'>
          {/* Section Header */}
          <div className='text-center mb-16'>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className='text-[10px] uppercase tracking-widest font-bold text-white/50'>Common Questions</span>
            </div>
            
            <h2 className='text-4xl md:text-5xl font-bold mb-6 tracking-tight'>
              Frequently Asked <span className="text-blue-500">Questions</span>
            </h2>
            <p className='text-gray-400 text-lg max-w-2xl mx-auto'>
              Everything you need to know about NexTools. Secure, private, and always available.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className='space-y-4'>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-card bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all duration-300 ${
                  openIndex === index ? 'active shadow-2xl shadow-blue-500/5' : ''
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className='w-full flex items-center justify-between p-6 md:p-8 text-left transition-colors duration-200'
                >
                  <h3 className={`text-lg md:text-xl font-semibold transition-colors ${openIndex === index ? 'text-blue-400' : 'text-white'}`}>
                    {faq.question}
                  </h3>
                  
                  <div className={`rotate-icon ${openIndex === index ? 'open text-blue-500' : 'text-white/20'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </button>

                <div className={`faq-answer px-6 md:px-8 ${openIndex === index ? 'open' : ''}`}>
                  <div className='border-t border-white/5 pt-6'>
                    <p className='text-white/50 leading-relaxed text-sm md:text-base'>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className='mt-20 text-center bg-blue-600/5 border border-blue-500/10 rounded-[40px] p-8 md:p-16'>
            <h3 className='text-2xl md:text-3xl font-bold mb-4'>
              Still have questions?
            </h3>
            <p className='text-white/40 mb-10 max-w-xl mx-auto'>
              Our team is ready to help you with any custom document needs or technical issues.
            </p>
            
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl text-sm font-bold transition shadow-xl shadow-blue-600/20 active:scale-95">
                Contact Support
              </button>
              
              <button className="bg-white/5 hover:bg-white/10 text-white px-10 py-4 rounded-2xl text-sm font-bold transition border border-white/10">
                View Docs
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQ