import React from 'react'
import { Mail, Globe, ExternalLink, Clock, Twitter, Linkedin, Github, Instagram } from 'lucide-react'

const Contact = () => {
  const contactMethods = [
    {
      icon: <Mail size={24} />,
      title: "Direct Channel",
      value: "shivam10yadav05@gmail.com",
      description: "For architectural inquiries or support.",
      link: "mailto:shivam10yadav05@gmail.com",
      accent: "group-hover:text-blue-400"
    },
    {
      icon: <Github size={24} />,
      title: "Open Source",
      value: "@Shivam10yadav",
      description: "Review the logic behind NexTools.",
      link: "https://github.com/Shivam10yadav",
      accent: "group-hover:text-purple-400"
    },
    {
      icon: <Globe size={24} />,
      title: "Dev Portfolio",
      value: "ShivamYadav.dev",
      description: "Explore my full stack of projects.",
      link: "https://portfolio-8b8v.onrender.com/",
      accent: "group-hover:text-emerald-400"
    }
  ]

  const socialLinks = [
    { name: "Twitter", icon: <Twitter size={20} />, link: "https://x.com/Y80Shivam", color: "hover:text-blue-400" },
    { name: "LinkedIn", icon: <Linkedin size={20} />, link: "https://www.linkedin.com/in/shivam10yadav", color: "hover:text-blue-500" },
    { name: "Instagram", icon: <Instagram size={20} />, link: "https://www.instagram.com/shivam05_10", color: "hover:text-pink-500" }
  ]

  return (
    <section id='contact' className='bg-[#0a0a0c] text-white py-20 md:py-32 px-6 relative overflow-hidden'>
      {/* Structural Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className='max-w-7xl mx-auto relative z-10'>
        
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8 md:gap-12'>
          <div className="max-w-full md:max-w-2xl">
            {/* Fix 1: Reduced tracking on mobile to prevent overflow */}
            <h2 className='text-[10px] font-black uppercase tracking-[3px] md:tracking-[5px] text-blue-500 mb-4 md:mb-6'>
              Communication
            </h2>
            
            {/* Fix 2: Fluid font sizes. text-5xl on mobile, text-8xl on desktop */}
            <h3 className='text-5xl sm:text-6xl md:text-[80px] font-black tracking-tighter uppercase italic leading-[0.9] md:leading-[0.85] break-words'>
              Let’s <br /> 
              <span className="text-white/20">Collaborate.</span>
            </h3>
          </div>
          <p className='text-white/40 text-base md:text-lg max-w-sm font-medium leading-tight mb-2'>
            Open for technical feedback, feature requests, or just a chat about browser-side tech.
          </p>
        </div>

        {/* Contact Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-20'>
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              className='group relative bg-[#111116] border border-white/5 rounded-[32px] md:rounded-[40px] p-8 md:p-10 hover:border-white/20 transition-all duration-500 overflow-hidden'
            >
              <div className="relative z-10">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 mb-8 md:mb-10 transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 ${method.accent}`}>
                  {method.icon}
                </div>
                
                <h3 className={`text-lg md:text-xl font-bold mb-2 tracking-tight transition-colors ${method.accent}`}>
                  {method.title}
                </h3>
                {/* Fix 3: Handle long emails on mobile with truncate */}
                <p className='text-white/60 font-medium mb-4 text-xs md:text-sm truncate uppercase tracking-wider'>
                  {method.value}
                </p>
                <p className='text-white/20 text-[10px] md:text-xs font-bold uppercase tracking-widest leading-relaxed'>
                  {method.description}
                </p>
              </div>
              
              <ExternalLink size={16} className='absolute top-8 right-8 md:top-10 md:right-10 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all' />
            </a>
          ))}
        </div>

        {/* Unified Social & Availability Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className='bg-gradient-to-br from-blue-600/10 to-transparent border border-white/5 rounded-[32px] md:rounded-[48px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8'>
            <div className="text-center md:text-left">
              <h4 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-2">Digital Footprint</h4>
              <p className="text-white/30 text-[10px] md:text-sm font-medium uppercase tracking-widest">Connect on social platforms</p>
            </div>
            <div className='flex gap-3 md:gap-4'>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-white/20 ${social.color} hover:border-white/20 transition-all duration-300`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className='bg-[#111116] border border-white/5 rounded-[32px] md:rounded-[48px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 md:gap-8'>
            <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full border-2 border-blue-500/20 flex items-center justify-center animate-pulse">
              <Clock className="text-blue-500" size={24} />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg md:text-xl font-black italic uppercase tracking-tighter">Response Protocol</h4>
              <p className="text-white/40 text-xs md:text-sm font-medium leading-relaxed">
                As a solo developer, I typically respond within <span className="text-white">24-48 hours</span>. Your feedback directly shapes NexTools.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Contact