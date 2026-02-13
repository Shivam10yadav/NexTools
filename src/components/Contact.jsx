import React from 'react'
import { Mail, Globe, ExternalLink, Clock, Twitter, Linkedin, Github, Instagram } from 'lucide-react'

const Contact = () => {
  const contactMethods = [
    {
      icon: <Mail size={32} />,
      title: "Email Me",
      value: "shivam10yadav05@gmail.com",
      description: "Send me an email anytime",
      link: "mailto:shivam10yadav05@gmail.com",
      color: "from-blue-600/20 to-indigo-600/20"
    },
    {
      icon: <Github size={32} />,
      title: "GitHub",
      value: "@Shivam10yadav",
      description: "Check out my code & projects",
      link: "https://github.com/Shivam10yadav",
      color: "from-slate-600/20 to-blue-600/20"
    },
    {
      icon: <Globe size={32} />,
      title: "Portfolio",
      value: "ShivamYadav.dev",
      description: "Explore my other projects",
      link: "https://portfolio-8b8v.onrender.com/",
      color: "from-indigo-600/20 to-blue-600/20"
    }
  ]

  const socialLinks = [
    {
      name: "Twitter",
      icon: <Twitter size={24} />,
      link: "https://x.com/Y80Shivam",
      color: "hover:bg-blue-500/20 hover:text-blue-400"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={24} />,
      link: "https://www.linkedin.com/in/shivam10yadav",
      color: "hover:bg-blue-600/20 hover:text-blue-500"
    },
    {
      name: "GitHub",
      icon: <Github size={24} />,
      link: "https://github.com/Shivam10yadav",
      color: "hover:bg-white/10 hover:text-white"
    },
    {
      name: "Instagram",
      icon: <Instagram size={24} />,
      link: "https://www.instagram.com/shivam05_10",
      color: "hover:bg-indigo-500/20 hover:text-indigo-400"
    }
  ]

  return (
    <>
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
          * { font-family: "Poppins", sans-serif; }
          
          .contact-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .contact-card:hover {
            transform: translateY(-8px);
          }
          
          .social-icon {
            transition: all 0.3s ease;
          }
          
          .social-icon:hover {
            transform: scale(1.1);
          }
        `}
      </style>

      <section id='contact' className='bg-[#0a0a0c] text-white py-20 md:py-28 px-4 relative overflow-hidden'>
        {/* Ambient Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className='max-w-6xl mx-auto relative z-10'>
          {/* Section Header */}
          <div className='text-center mb-16'>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className='text-[10px] uppercase tracking-widest font-bold text-white/50'>Support & Feedback</span>
            </div>
            
            <h2 className='text-4xl md:text-5xl font-bold mb-6 tracking-tight'>
              Let's <span className="text-blue-500">Connect</span>
            </h2>
            <p className='text-gray-400 text-lg max-w-2xl mx-auto'>
              Have questions or feedback? I'd love to hear from you. Reach out through any of these platforms.
            </p>
          </div>

          {/* Contact Methods */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                target={method.link.startsWith('http') ? '_blank' : '_self'}
                rel={method.link.startsWith('http') ? 'noopener noreferrer' : ''}
                className='contact-card group relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:border-blue-500/50 cursor-pointer transition-all duration-300'
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                
                <div className='relative z-10'>
                  {/* Icon */}
                  <div className='bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300'>
                    {method.icon}
                  </div>
                  
                  <h3 className='text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors duration-300'>
                    {method.title}
                  </h3>
                  
                  <p className='text-white/80 font-medium mb-2 text-sm truncate'>
                    {method.value}
                  </p>
                  
                  <p className='text-white/30 text-sm font-medium'>
                    {method.description}
                  </p>
                </div>

                <div className='absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <ExternalLink size={20} className='text-blue-500' />
                </div>
              </a>
            ))}
          </div>

          {/* Social Media Section */}
          <div className='bg-blue-600/5 border border-blue-500/10 rounded-[40px] p-8 md:p-16'>
            <div className='text-center mb-10'>
              <h3 className='text-2xl md:text-3xl font-bold mb-4'>
                Follow the journey
              </h3>
              <p className='text-white/40 max-w-xl mx-auto font-medium'>
                Stay connected and get updates on the latest tool releases and tech updates.
              </p>
            </div>

            <div className='flex flex-wrap justify-center gap-6'>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`social-icon bg-white/[0.03] border border-white/5 p-5 rounded-2xl text-white/30 ${social.color} transition-all duration-300`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Response Time Note */}
          <div className='mt-16 text-center'>
            <div className='inline-flex items-center gap-3 bg-white/[0.02] border border-white/5 px-8 py-4 rounded-full'>
              <Clock size={18} className='text-blue-500' />
              <span className='text-xs font-bold uppercase tracking-widest text-white/40'>Typical response: 24-48 hours</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact