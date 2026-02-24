import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { 
  User, Briefcase, Phone, Mail, Globe, MapPin, 
  Download, Camera, Trash2, Save, Activity, 
  Linkedin, Github, ChevronLeft, Link as LinkIcon 
} from "lucide-react";

const DigitalBusinessCard = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", title: "", company: "",
    phone: "", email: "", website: "", address: "", 
    linkedin: "", github: "", photo: ""
  });
  const [themeColor, setThemeColor] = useState("#2563eb");
  const fileInputRef = useRef(null);

  // FIXED: Explicitly mapping name to value to ensure real-time updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setFormData(prev => ({ ...prev, photo: event.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const downloadVcf = () => {
    const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.firstName} ${formData.lastName}\nORG:${formData.company}\nTITLE:${formData.title}\nTEL:${formData.phone}\nEMAIL:${formData.email}\nURL:${formData.website}\nADR:;;${formData.address}\nEND:VCARD`;
    const blob = new Blob([vcf], { type: "text/vcard" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "contact.vcf";
    link.click();
  };

  const downloadPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 600; canvas.height = 900;
    const ctx = canvas.getContext("2d");

    // Background & Accent
    ctx.fillStyle = "#0a0a0c";
    ctx.fillRect(0, 0, 600, 900);
    ctx.fillStyle = themeColor;
    ctx.globalAlpha = 0.15;
    ctx.beginPath(); ctx.arc(600, 0, 400, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Header Content
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px Arial";
    ctx.fillText(`${formData.firstName || 'User'} ${formData.lastName || ''}`, 60, 100);
    ctx.fillStyle = themeColor;
    ctx.font = "bold 20px Arial";
    ctx.fillText((formData.title || "PROFESSIONAL").toUpperCase(), 60, 140);

    // Data Mapping for PNG
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "16px monospace";
    const dataPoints = [
      {k: "PHN", v: formData.phone}, {k: "EML", v: formData.email}, 
      {k: "WEB", v: formData.website}, {k: "LOC", v: formData.address},
      {k: "LKD", v: formData.linkedin}, {k: "GTH", v: formData.github}
    ];
    let y = 240;
    dataPoints.forEach(p => {
      if(p.v) {
        ctx.fillStyle = themeColor; ctx.fillText(p.k, 60, y);
        ctx.fillStyle = "white"; ctx.fillText(p.v, 140, y);
        y += 45;
      }
    });

    // QR Injection
    const svg = document.getElementById("qr-main");
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.roundRect(175, 600, 250, 250, 40); ctx.fill();
      ctx.drawImage(img, 200, 625, 200, 200);
      const link = document.createElement("a");
      link.download = "id-forge.png";
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white p-6 pt-24 font-sans selection:bg-blue-500/30">
      
      {/* Background Dots */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />

      <main className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Activity size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[2px] text-blue-400">Sequential Forge v7.0</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Identity <span style={{ color: themeColor }}>Forge</span></h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 items-start">
          
          {/* --- LEFT: INPUTS --- */}
          <section className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-white/20">Data Intake Terminal</span>
              <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-8 h-8 bg-transparent cursor-pointer border-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
              <InputGroup label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              <InputGroup label="Title" name="title" value={formData.title} onChange={handleChange} />
              <InputGroup label="Company" name="company" value={formData.company} onChange={handleChange} />
              <InputGroup label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <InputGroup label="Email" name="email" value={formData.email} onChange={handleChange} />
              <InputGroup label="Website" name="website" value={formData.website} onChange={handleChange} />
              <InputGroup label="Address" name="address" value={formData.address} onChange={handleChange} />
              <InputGroup label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} />
              <InputGroup label="GitHub" name="github" value={formData.github} onChange={handleChange} />
            </div>

            <button onClick={() => fileInputRef.current.click()} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition">
              <Camera size={18}/> {formData.photo ? "Update Bio-Image" : "Upload Identity Photo"}
            </button>
            <input ref={fileInputRef} type="file" hidden onChange={handlePhotoUpload} />
          </section>

          {/* --- RIGHT: CARD PREVIEW (Everything shows here now) --- */}
          <aside className="sticky top-24 space-y-6">
            <div className="w-full bg-[#111114] border-2 border-white/10 rounded-[40px] p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-10 -right-10 w-48 h-48 blur-[100px] opacity-20" style={{ backgroundColor: themeColor }} />

              <div className="relative z-10 flex flex-col gap-10">
                {/* Header Profile */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 overflow-hidden shadow-inner">
                    {formData.photo ? <img src={formData.photo} className="w-full h-full object-cover" alt="Bio" /> : <User className="w-full h-full p-6 opacity-10" />}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{formData.firstName || "John"} {formData.lastName || "Doe"}</h2>
                    <p className="text-[10px] font-black uppercase tracking-[3px]" style={{ color: themeColor }}>{formData.title || "Operator"}</p>
                    <p className="text-[10px] opacity-30 font-bold uppercase">{formData.company || "Brand Unit"}</p>
                  </div>
                </div>

                {/* Data Rows (Fixed: Every field is mapped here) */}
                <div className="space-y-4">
                   {formData.email && <DataRow icon={<Mail size={14}/>} label="EML" val={formData.email} color={themeColor} />}
                   {formData.phone && <DataRow icon={<Phone size={14}/>} label="TEL" val={formData.phone} color={themeColor} />}
                   {formData.website && <DataRow icon={<Globe size={14}/>} label="WEB" val={formData.website} color={themeColor} />}
                   {formData.address && <DataRow icon={<MapPin size={14}/>} label="LOC" val={formData.address} color={themeColor} />}
                   
                   <div className="flex flex-wrap gap-3 mt-4">
                      {formData.linkedin && <SocialChip icon={<Linkedin size={12}/>} val="LinkedIn" color={themeColor} />}
                      {formData.github && <SocialChip icon={<Github size={12}/>} val="GitHub" color={themeColor} />}
                   </div>
                </div>

                {/* QR Section */}
                <div className="flex justify-between items-end border-t border-white/5 pt-8">
                  <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl">
                    <QRCodeSVG id="qr-main" value={formData.email || "ID_FORGE"} size={120} />
                  </div>
                  <div className="text-right pb-2 opacity-20">
                    <p className="text-[8px] font-black uppercase tracking-[5px]">Scan to Sync</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button onClick={downloadPng} className="py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 transition shadow-xl active:scale-95">
                <Save size={16} /> Save PNG
              </button>
              <button onClick={downloadVcf} className="py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition active:scale-95">
                <Download size={16} /> Contact VCF
              </button>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-32 py-10 opacity-20 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[10px]">शिवम यादव — NexTools Workshop</p>
      </footer>
    </div>
  );
};

// UI COMPONENTS
const InputGroup = ({ label, name, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase tracking-[2px] text-white/20 ml-1">{label}</label>
    <input 
      type="text" name={name} value={value} onChange={onChange}
      className="w-full bg-[#0a0a0c] border border-white/5 rounded-2xl py-4 px-6 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:opacity-5"
      placeholder={`INTAKE_${label.toUpperCase()}`}
    />
  </div>
);

const DataRow = ({ icon, label, val, color }) => (
  <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
    <div className="text-white/20" style={{ color: color }}>{icon}</div>
    <div className="flex flex-col">
      <span className="text-[8px] font-black uppercase tracking-widest opacity-20">{label}</span>
      <span className="text-xs font-bold tracking-wide truncate max-w-[180px]">{val}</span>
    </div>
  </div>
);

const SocialChip = ({ icon, val, color }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full border-b-2" style={{ borderBottomColor: color }}>
    <span style={{ color: color }}>{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{val}</span>
  </div>
);

export default DigitalBusinessCard;