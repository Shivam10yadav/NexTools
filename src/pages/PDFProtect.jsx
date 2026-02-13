import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';
import { 
  Lock, Unlock, FileText, Download, 
  ChevronLeft, ShieldCheck, AlertCircle, Eye, EyeOff 
} from 'lucide-react';

const PDFProtect = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('idle');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setStatus('idle');
    }
  };

  const protectPDF = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pdfBytes = await pdfDoc.save();
      const encryptedBytes = await encryptPDF(pdfBytes, password, password);

      const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Protected-${file.name}`;
      link.click();
      setStatus('success');
    } catch (e) {
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 pt-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] pointer-events-none" />

      <main className="max-w-5xl mx-auto relative z-10">
        <header className="mb-16">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-white/30 hover:text-white mb-8 transition group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Tools
          </button>
          <h1 className="text-5xl font-black tracking-tighter ">PDF <span className="text-blue-500">VAULT</span></h1>
          <p className="text-white/40 mt-3 text-lg">Secure your documents with zero-server encryption.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10 items-stretch">
          
          {/* LEFT SIDE: Password Settings */}
          <section className="bg-white/[0.03] border border-white/10 rounded-[40px] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50" />
            
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-500">
                  <Lock size={20} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[3px] text-white/80">Security</h2>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1 mb-2 block">Encryption Key</label>
                  <input 
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••" 
                    className="w-full bg-black/60 border border-white/5 rounded-2xl py-5 px-6 focus:outline-none focus:border-blue-500/50 transition-all text-blue-400 font-mono text-lg shadow-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-6 top-[42px] text-white/20 hover:text-white transition"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <ul className="space-y-3 pt-4">
                  <li className="flex items-center gap-3 text-xs text-white/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    AES-128 Bit Military Grade
                  </li>
                  <li className="flex items-center gap-3 text-xs text-white/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    Permissions: View Only
                  </li>
                </ul>
              </div>
            </div>

            <button 
              onClick={protectPDF}
              disabled={!file || !password || isProcessing}
              className="mt-12 w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-sm uppercase tracking-[2px] hover:bg-blue-500 transition-all disabled:opacity-20 disabled:grayscale shadow-[0_20px_40px_rgba(37,99,235,0.2)] flex items-center justify-center gap-3"
            >
              {isProcessing ? 'Encrypting...' : 'Lock Document'} <Download size={20} />
            </button>
          </section>

          {/* RIGHT SIDE: File Upload Area */}
          <section 
            className={`relative rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 min-h-[450px] overflow-hidden
              ${file ? 'border-blue-500/40 bg-blue-500/5' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFileChange({ target: { files: e.dataTransfer.files } }); }}
            onClick={() => !file && document.getElementById('fileInput').click()}
          >
            <input type="file" id="fileInput" className="hidden" accept=".pdf" onChange={handleFileChange} />
            
            {!file ? (
              <div className="flex flex-col items-center text-center px-10">
                <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5">
                  <FileText size={40} className="text-white/20" />
                </div>
                <h3 className="text-xl font-bold mb-2">Drop your PDF here</h3>
                <p className="text-white/30 text-sm">or click to browse your local files</p>
              </div>
            ) : (
              <div className="text-center animate-in zoom-in-95 duration-300">
                <div className="relative inline-block">
                  <div className="bg-blue-600 w-32 h-32 rounded-[40px] flex items-center justify-center shadow-2xl">
                    <FileText size={48} />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-green-500 p-2 rounded-full border-4 border-[#0a0a0c]">
                    <ShieldCheck size={16} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mt-8 max-w-sm truncate px-4">{file.name}</h3>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }} 
                  className="mt-4 px-6 py-2 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Change File
                </button>
              </div>
            )}
            
            {/* Status Toasts */}
            {status === 'success' && (
              <div className="absolute bottom-10 left-10 right-10 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center gap-3 text-green-400 text-sm backdrop-blur-md">
                <ShieldCheck size={18} /> File protected and downloaded successfully!
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};

export default PDFProtect;