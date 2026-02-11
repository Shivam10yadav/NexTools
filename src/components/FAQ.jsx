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
          @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
          * {
            font-family: "Poppins", sans-serif;
          }
          
          .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                        opacity 0.4s ease,
                        padding 0.4s ease;
            opacity: 0;
            padding-top: 0;
            padding-bottom: 0;
          }
          
          .faq-answer.open {
            max-height: 500px;
            opacity: 1;
            padding-top: 0.5rem;
            padding-bottom: 1.5rem;
          }
          
          .faq-answer-content {
            transform: translateY(-10px);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
          }
          
          .faq-answer.open .faq-answer-content {
            transform: translateY(0);
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
            border-color: rgba(166, 255, 93, 0.3) !important;
            background: rgba(255, 255, 255, 0.08) !important;
          }
        `}
      </style>

      <section id='faq' className='bg-black text-white py-20 md:py-28 px-4 bg-[url("https://assets.prebuiltui.com/images/components/hero-section/hero-background-image.png")] bg-cover bg-center bg-no-repeat'>
        <div className='max-w-4xl mx-auto'>
          {/* Section Header */}
          <div className='text-center mb-16'>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
              <div className="relative flex size-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#A6FF5D] opacity-75 animate-ping"></span>
                <span className="relative inline-flex size-1.5 rounded-full bg-[#A6FF5D]"></span>
              </div>
              <span className='text-xs text-white/70'>FAQ</span>
            </div>
            
            <h2 className='text-3xl md:text-5xl font-semibold mb-4 leading-tight'>
              Frequently Asked Questions
            </h2>
            <p className='text-base md:text-lg text-gray-400 max-w-2xl mx-auto'>
              Everything you need to know about our services. Can't find the answer you're looking for? Feel free to contact our support team.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className='space-y-4'>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-card bg-gray-900/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 ${
                  openIndex === index ? 'active' : ''
                }`}
              >
                {/* Question */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className='w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-white/5 transition-colors duration-200'
                >
                  <h3 className='text-lg md:text-xl font-semibold text-white pr-8'>
                    {faq.question}
                  </h3>
                  
                  {/* Toggle Icon */}
                  <div className={`rotate-icon ${openIndex === index ? 'open' : ''} flex-shrink-0`}>
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className='text-[#A6FF5D]'
                    >
                      <path 
                        d="M6 9l6 6 6-6" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>

                {/* Answer */}
                <div className={`faq-answer px-6 md:px-8 ${openIndex === index ? 'open' : ''}`}>
                  <div className='faq-answer-content border-t border-white/10 pt-4'>
                    <p className='text-gray-400 leading-relaxed'>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className='mt-16 text-center bg-gradient-to-r from-[#A6FF5D]/10 to-transparent border border-[#A6FF5D]/20 rounded-2xl p-8 md:p-12'>
            <h3 className='text-2xl md:text-3xl font-semibold mb-4'>
              Still have questions?
            </h3>
            <p className='text-gray-400 mb-6 max-w-xl mx-auto'>
              Our support team is here to help you 24/7. Get in touch and we'll get back to you as soon as possible.
            </p>
            
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <button className="bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-800 px-8 py-3 rounded-full text-sm font-medium transition cursor-pointer group">
                <div className="relative overflow-hidden">
                  <span className="block transition-transform duration-200 group-hover:-translate-y-full">
                    Contact Support
                  </span>
                  <span className="absolute top-0 left-0 block transition-transform duration-200 group-hover:translate-y-0 translate-y-full">
                    Contact Support
                  </span>
                </div>
              </button>
              
              <button className="bg-white/10 hover:bg-white/15 backdrop-blur text-white px-8 py-3 rounded-full text-sm font-medium transition border border-white/20 hover:border-[#A6FF5D]/50">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQ