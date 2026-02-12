import React from 'react'
import { Mail, Phone, Globe, ExternalLink, Clock, Twitter, Linkedin, Github, Instagram, Facebook, Youtube } from 'lucide-react'

const Contact = () => {
  const contactMethods = [
    {
      icon: <Mail size={32} />,
      title: "Email Me",
      value: "shivam10yadav05@gmail.com",
      description: "Send me an email anytime",
      link: "mailto:shivam10yadav05@gmail.com",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: <Github size={32} />,
      title: "GitHub",
      value: "@Shivam10yadav",
      description: "Check out my code & projects",
      link: "https://github.com/Shivam10yadav",
      color: "from-gray-500/20 to-slate-500/20"
    },
    {
      icon: <Globe size={32} />,
      title: "Portfolio",
      value: "ShivamYadav.dev",
      description: "Explore my other projects",
      link: "https://portfolio-8b8v.onrender.com/",
      color: "from-purple-500/20 to-pink-500/20"
    }
  ]

  const socialLinks = [
    {
      name: "Twitter",
      icon: <Twitter size={24} />,
      link: "https://x.com/Y80Shivam",
      color: "hover:bg-sky-500/20 hover:text-sky-400"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={24} />,
      link: "www.linkedin.com/in/shivam10yadav",
      color: "hover:bg-blue-500/20 hover:text-blue-400"
    },
    {
      name: "GitHub",
      icon: <Github size={24} />,
      link: "https://github.com/Shivam10yadav",
      color: "hover:bg-gray-500/20 hover:text-gray-300"
    },
    {
      name: "Instagram",
      icon: <Instagram size={24} />,
      link: "https://www.instagram.com/shivam05_10?igsh=MThvMGVuemVnMXVydQ==",
      color: "hover:bg-pink-500/20 hover:text-pink-400"
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

      <section id='contact' className='bg-black text-white py-20 md:py-28 px-4 bg-[url("https://assets.prebuiltui.com/images/components/hero-section/hero-background-image.png")] bg-cover bg-center bg-no-repeat'>
        <div className='max-w-6xl mx-auto'>
          {/* Section Header */}
          <div className='text-center mb-16'>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
              <div className="relative flex size-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#A6FF5D] opacity-75 animate-ping"></span>
                <span className="relative inline-flex size-1.5 rounded-full bg-[#A6FF5D]"></span>
              </div>
              <span className='text-xs text-white/70'>Get In Touch</span>
            </div>
            
            <h2 className='text-3xl md:text-5xl font-semibold mb-4 leading-tight'>
              Let's Connect
            </h2>
            <p className='text-base md:text-lg text-gray-400 max-w-2xl mx-auto'>
              Have questions or feedback? I'd love to hear from you. Choose your preferred way to reach out.
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
                className='contact-card group relative overflow-hidden bg-gray-900/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-gray-900/60 hover:border-[#A6FF5D]/50 cursor-pointer'
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
                
                {/* Content */}
                <div className='relative z-10'>
                  {/* Icon */}
                  <div className='bg-[#A6FF5D]/10 w-16 h-16 rounded-xl flex items-center justify-center text-[#A6FF5D] mb-6 group-hover:bg-[#A6FF5D]/20 transition-all duration-300 group-hover:scale-110'>
                    {method.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className='text-xl font-semibold mb-2 text-white group-hover:text-[#A6FF5D] transition-colors duration-300'>
                    {method.title}
                  </h3>
                  
                  {/* Value */}
                  <p className='text-white font-medium mb-2'>
                    {method.value}
                  </p>
                  
                  {/* Description */}
                  <p className='text-gray-400 text-sm'>
                    {method.description}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className='absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <ExternalLink size={24} className='text-[#A6FF5D]' />
                </div>
              </a>
            ))}
          </div>

          {/* Social Media Section */}
          <div className='bg-gradient-to-r from-[#A6FF5D]/10 to-transparent border border-[#A6FF5D]/20 rounded-2xl p-8 md:p-12'>
            <div className='text-center mb-8'>
              <h3 className='text-2xl md:text-3xl font-semibold mb-4'>
                Follow me on social media
              </h3>
              <p className='text-gray-400 max-w-xl mx-auto'>
                Stay connected and get updates on my latest projects and tech journey.
              </p>
            </div>

            {/* Social Icons */}
            <div className='flex flex-wrap justify-center gap-4'>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`social-icon bg-gray-900/60 backdrop-blur-sm border border-white/10 p-4 rounded-xl text-gray-400 ${social.color} transition-all duration-300`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Response Time Note */}
          <div className='mt-12 text-center'>
            <div className='inline-flex items-center gap-2 bg-white/5 backdrop-blur px-6 py-3 rounded-full'>
              <Clock size={20} className='text-[#A6FF5D]' />
              <span className='text-sm text-gray-300'>I typically respond within 24-48 hours</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact