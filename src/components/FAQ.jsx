import React, { useState } from 'react'
import { HelpCircle, ChevronDown, ShieldCheck, Cpu, Globe } from 'lucide-react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "How is my data handled?",
      answer: "NexTools uses 'Zero-Server' logic. Your documents are processed entirely within your browser's RAM using WebAssembly. Unlike other tools, your files are never uploaded to a cloud, never stored on a disk, and never seen by our team. Your privacy is guaranteed by the laws of physics and local execution.",
      icon: <ShieldCheck size={18} className="text-blue-500" />
    },
    {
      question: "Are there file size limits?",
      answer: "Because processing happens on your device, the limit depends on your computer's RAM. Most modern browsers handle up to 2GB effortlessly. There are no 'Pro' tiers or artificial caps—the full power of your hardware is the only limit.",
      icon: <Cpu size={18} className="text-purple-500" />
    },
    {
      question: "Do I need an internet connection?",
      answer: "You only need a connection to load the website. Once the 'Lab' is open in your browser, the tools work entirely offline. You can even disconnect your WiFi while merging or encrypting your PDFs for ultimate peace of mind.",
      icon: <Globe size={18} className="text-emerald-500" />
    },
    {
      question: "Why is NexTools free?",
      answer: "Traditional tools charge you because they have to pay for expensive servers to process your files. We shifted the work to your device. Since we don't have server costs for file handling, we pass those savings directly to you—forever.",
      icon: <HelpCircle size={18} className="text-orange-500" />
    }
  ]

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <style>
        {`
          .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
          }
          
          .faq-answer.open {
            max-height: 300px;
            opacity: 1;
            padding-bottom: 2rem;
          }
        `}
      </style>

      <section id='faq' className='bg-[#0a0a0c] text-white py-32 px-6 relative'>
        <div className='max-w-5xl mx-auto relative z-10'>
          
          {/* Section Header */}
          <div className='flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8'>
            <div>
              <h2 className='text-[10px] font-black uppercase tracking-[5px] text-blue-500 mb-6'>Inquiries</h2>
              <h3 className='text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]'>
                Clearing the <br /> 
                <span className="text-white/20">Confusion.</span>
              </h3>
            </div>
            <p className='text-white/40 text-lg max-w-xs font-medium leading-tight mb-2'>
              Deep dives into how our browser-side workstation actually works.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className='grid grid-cols-1 gap-4'>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`group border-b border-white/5 transition-all duration-500 ${
                  openIndex === index ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className='w-full flex items-center justify-between py-10 px-4 md:px-8 text-left'
                >
                  <div className="flex items-center gap-6">
                    <div className={`transition-all duration-500 ${openIndex === index ? 'scale-125 opacity-100' : 'opacity-20 grayscale'}`}>
                        {faq.icon}
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors ${openIndex === index ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                      {faq.question}
                    </h3>
                  </div>
                  
                  <div className={`transition-transform duration-500 ${openIndex === index ? 'rotate-180 text-blue-500' : 'text-white/20'}`}>
                    <ChevronDown size={24} strokeWidth={3} />
                  </div>
                </button>

                <div className={`faq-answer px-10 md:px-24 ${openIndex === index ? 'open' : ''}`}>
                    <p className='text-white/40 leading-relaxed text-base md:text-lg max-w-3xl'>
                      {faq.answer}
                    </p>
                </div>
              </div>
            ))}
          </div>

          {/* Minimal CTA */}
          <div className='mt-32 p-1 bg-gradient-to-r from-blue-600/20 via-transparent to-transparent rounded-[40px]'>
              <div className="bg-[#0d0d12] rounded-[38px] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="max-w-md text-center md:text-left">
                      <h4 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Still Skeptical?</h4>
                      <p className="text-white/30 font-medium">Read our technical documentation on how WebAssembly handles your local data streams.</p>
                  </div>
                  <button className="whitespace-nowrap bg-white text-black px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95">
                      Technical Docs
                  </button>
              </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQ