import React, { useState, useRef } from 'react';
import { Download, Image as ImageIcon, Search, HelpCircle } from 'lucide-react';

const HiddenMessage = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // DEFINED STATE
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setDecodedMessage(''); // Clear previous results when new image is picked
      };
      reader.readAsDataURL(file);
    }
  };

  const textToBin = (text) => {
    return text.split('').map(char => 
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('') + '00000000';
  };

  const binToText = (bin) => {
    const bytes = bin.match(/.{1,8}/g) || [];
    let text = '';
    for (let byte of bytes) {
      if (byte === '00000000' || !byte) break;
      text += String.fromCharCode(parseInt(byte, 2));
    }
    return text;
  };

  const encodeMessage = () => {
    if (!image || !message) return;
    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const binaryMessage = textToBin(message);

      if (binaryMessage.length > data.length / 4) {
        alert("Message too long for this image!");
        setIsProcessing(false);
        return;
      }

      for (let i = 0; i < binaryMessage.length; i++) {
        // Change only the Least Significant Bit of the Red channel for each pixel
        data[i * 4] = (data[i * 4] & 0xFE) | parseInt(binaryMessage[i]);
      }

      ctx.putImageData(imageData, 0, 0);
      const link = document.createElement('a');
      link.download = 'secret_note.png'; // MUST BE PNG
      link.href = canvas.toDataURL("image/png");
      link.click();
      setIsProcessing(false);
    };
    img.src = image;
  };

  const decodeMessage = () => {
    if (!image) return;
    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let binaryMessage = '';

      for (let i = 0; i < data.length; i += 4) {
        binaryMessage += (data[i] & 1).toString();
        // Stop if we find the 8-bit null terminator
        if (binaryMessage.length % 8 === 0 && binaryMessage.slice(-8) === '00000000') {
          break;
        }
        // Safety break if we've scanned too far without finding a message
        if (binaryMessage.length > 50000) break; 
      }

      const result = binToText(binaryMessage);
      setDecodedMessage(result || "No hidden message found.");
      setIsProcessing(false);
    };
    img.src = image;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-end mb-12">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">
            Image<span className="text-blue-500">Notes</span>
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-wider">Secret messages inside photos</p>
        </div>
        
        <div className="group relative">
          <HelpCircle className="text-white/20 hover:text-blue-400 cursor-help transition-colors" size={20} />
          <div className="absolute right-0 bottom-full mb-4 w-64 p-4 bg-[#16161a] border border-white/10 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-2xl z-50">
            <p className="text-[11px] leading-relaxed text-white/60 text-center">
              Our "Scanner" looks at the invisible color bits of the image to find your note.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STEP 1 */}
        <div className="bg-[#111115] border border-white/5 rounded-[32px] p-8 space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500">
             <span className="size-5 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">1</span>
             Create Hidden Note
          </div>

          <div className="space-y-4">
            <div className="h-40 bg-black/40 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center relative hover:border-blue-500/30 overflow-hidden">
              {image ? (
                 <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-40" />
              ) : (
                <ImageIcon className="text-white/10 mb-2" size={32} />
              )}
              <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Select Photo</span>
            </div>

            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your secret here..."
              className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm focus:border-blue-500/40 outline-none h-24"
            />

            <button 
              onClick={encodeMessage}
              disabled={isProcessing || !image || !message}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-widest"
            >
              {isProcessing ? "Processing..." : "Download Secret Image"}
            </button>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="bg-[#111115] border border-white/5 rounded-[32px] p-8 space-y-6 flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-500">
             <span className="size-5 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">2</span>
             Read Hidden Note
          </div>

          <button 
            onClick={decodeMessage} 
            disabled={isProcessing || !image}
            className="w-full py-4 border border-purple-500/20 hover:bg-purple-500/10 text-purple-400 rounded-xl font-black text-xs uppercase tracking-widest"
          >
            {isProcessing ? "Scanning..." : "Scan Photo for Note"}
          </button>

          <div className="flex-1 mt-4 p-5 bg-black/60 rounded-2xl border border-white/5 font-mono text-sm min-h-[100px] break-all">
            <span className="text-[9px] uppercase tracking-widest text-white/20 block mb-2">Scanner Result:</span>
            {decodedMessage ? (
              <span className="text-purple-400">{decodedMessage}</span>
            ) : (
              <span className="text-white/5 italic italic">Waiting for scan...</span>
            )}
          </div>
        </div>
      </main>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default HiddenMessage;