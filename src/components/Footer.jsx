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
      link: "#",
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/>
        </svg>
      )
    },
    {
      name: "GitHub",
      link: "#",
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.2 11.38c.6.1.8-.26.8-.58v-2.1c-3.34.72-4.03-1.41-4.03-1.41-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.72.08-.72 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.3.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.4 11.4 0 016 0C17 2.77 18 3.1 18 3.1c.66 1.65.25 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.2.69.8.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      )
    }
  ];

  return (
    <footer id="footer" className="bg-black text-white border-t border-white/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#A6FF5D]/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        
        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Nex<span className="text-[#A6FF5D]">Tools</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Building modern digital experiences with clean design and powerful technology.
            </p>

            {/* Social */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-[#A6FF5D] hover:bg-[#A6FF5D]/10 transition-all duration-300 hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#A6FF5D] transition-colors duration-300 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} YourBrand. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-[#A6FF5D] transition">
              Terms
            </a>
            <a href="#" className="hover:text-[#A6FF5D] transition">
              Privacy
            </a>
            <a href="#" className="hover:text-[#A6FF5D] transition">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
