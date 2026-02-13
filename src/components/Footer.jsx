import React from "react";

const Footer = () => {
  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Press"]
    },
    {
      title: "Product",
      links: ["Features", "Pricing", "Integrations", "Updates"]
    },
    {
      title: "Resources",
      links: ["Documentation", "Help Center", "Community", "Privacy Policy"]
    }
  ];

  const socialLinks = [
    {
      name: "Twitter",
      link: "https://x.com/Y80Shivam",
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/>
        </svg>
      )
    },
    {
      name: "GitHub",
      link: "https://github.com/Shivam10yadav",
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.2 11.38c.6.1.8-.26.8-.58v-2.1c-3.34.72-4.03-1.41-4.03-1.41-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.72.08-.72 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.3.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.4 11.4 0 016 0C17 2.77 18 3.1 18 3.1c.66 1.65.25 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.2.69.8.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      )
    }
  ];

  return (
    <footer id="footer" className="bg-[#0a0a0c] text-white border-t border-white/5 relative overflow-hidden">
      {/* Subtle Corner Glow */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-600/5 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
        
        {/* Top Section */}
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6 tracking-tight">
              Nex<span className="text-blue-500">Tools</span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm font-medium">
              A collection of high-performance tools designed for modern creators. Fast, secure, and always evolving.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl text-white/30 hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 active:scale-90"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-[10px] font-black uppercase tracking-[2px] text-white/20 mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-white/40 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[12px] font-medium tracking-wide">
            © {new Date().getFullYear()} <span className="text-white/40">NEXTOOLS</span>. ALL RIGHTS RESERVED.
          </p>

          <div className="flex gap-8 text-[12px] font-bold uppercase tracking-widest text-white/20">
            <a href="#" className="hover:text-blue-500 transition">Terms</a>
            <a href="#" className="hover:text-blue-500 transition">Privacy</a>
            <a href="#" className="hover:text-blue-500 transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;