import React from "react";
import { ShieldCheck, Cpu, Lock } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    {
      title: "Ecosystem",
      links: [
        { name: "PDF Merger", path: "/services/pdfmerger" },
        { name: "Document Shield", path: "/services/pdfwatermarker" },
        { name: "Meta Editor", path: "/services/pdfeditor" },
        { name: "Full Directory", path: "#services" }
      ]
    },
    {
      title: "Technical",
      links: [
        { name: "Privacy Protocol", path: "#faq" },
        { name: "Hardware Specs", path: "#pricing" },
        { name: "Documentation", path: "#" },
        { name: "Open Source", path: "https://github.com/Shivam10yadav" }
      ]
    }
  ];

  return (
    <footer id="footer" className="bg-[#0a0a0c] text-white border-t border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-16 mb-20">
          
          {/* Brand & Manifest */}
          <div className="lg:col-span-3">
            <h2 className="text-4xl font-black mb-8 tracking-tighter uppercase italic">
              Nex<span className="text-blue-500">Tools</span>
            </h2>
            <p className="text-white/30 text-lg leading-snug max-w-md font-medium mb-10 italic">
              "We didn't build a cloud. We built a workstation that lives entirely in your browser."
            </p>

            {/* Privacy Badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <ShieldCheck size={14}/>, text: "Zero Server" },
                { icon: <Cpu size={14}/>, text: "Local RAM" },
                { icon: <Lock size={14}/>, text: "AES-256" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
                  <span className="text-blue-500">{badge.icon}</span>
                  {badge.text}
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Link Mapping */}
          {footerLinks.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="text-[10px] font-black uppercase tracking-[3px] text-blue-500 mb-8">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.path}
                      className="text-white/40 hover:text-white transition-all duration-300 text-sm font-bold uppercase tracking-tighter"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social / Dev Link */}
          <div className="lg:col-span-1">
            <h3 className="text-[10px] font-black uppercase tracking-[3px] text-blue-500 mb-8">Author</h3>
            <a 
              href="https://github.com/Shivam10yadav" 
              target="_blank" 
              className="group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500 transition-all">
                <span className="text-xs font-black">SY</span>
              </div>
              <span className="text-sm font-bold text-white/40 group-hover:text-white transition-colors">@shivam10yadav</span>
            </a>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <p className="text-white/10 text-[10px] font-black uppercase tracking-[4px]">
              © {new Date().getFullYear()} NEXLABS ARCHITECTURE
            </p>
            <div className="h-4 w-px bg-white/5 hidden md:block"></div>
            <p className="text-white/10 text-[10px] font-black uppercase tracking-[4px] hidden md:block">
              Built in India
            </p>
          </div>

          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[2px] text-white/20">
            <a href="#" className="hover:text-blue-500 transition-colors">Security Audit</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms of Ops</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Open Source</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;