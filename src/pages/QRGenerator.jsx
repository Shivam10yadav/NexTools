import { useState, useEffect } from "react";
import QRCode from "qrcode";

const QRGenerator = () => {
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrSvg, setQrSvg] = useState("");

  useEffect(() => {
    if (!text.trim()) {
      setQrDataUrl("");
      setQrSvg("");
      return;
    }

    const timer = setTimeout(() => {
      generateQR(text);
    }, 150);

    return () => clearTimeout(timer);
  }, [text]);

  async function generateQR(value) {
    try {
      const dataUrl = await QRCode.toDataURL(value, {
        width: 512,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
      setQrDataUrl(dataUrl);

      const svg = await QRCode.toString(value, {
        type: "svg",
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
      setQrSvg(svg);
    } catch (err) {
      console.error("QR generation failed:", err);
    }
  }

  function downloadPNG() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qr-code.png";
    a.click();
  }

  function downloadSVG() {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-[100svh] flex items-center justify-center bg-[#0e1014] px-6 pb-24 pt-11">
      <div className="w-full max-w-[420px]">
        <main className="flex flex-col gap-5 rounded-[20px] border border-white/10 bg-[#141821] p-6 shadow-[0_14px_30px_rgba(0,0,0,0.35)]">
          {/* Header */}
          <header className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white/95">
              QR Generator
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Generate QR codes instantly.
            </p>
          </header>

          {/* Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="qr-input"
              className="text-[13px] font-semibold text-white/60"
            >
              Link or Text
            </label>
            <textarea
              id="qr-input"
              rows={3}
              placeholder="Enter a URL or text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full resize-none rounded-[14px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/95 outline-none transition focus:border-white/20 focus:bg-black/30 placeholder:text-white/60"
            />
          </div>

          {/* Preview */}
          <div className="flex min-h-[240px] items-center justify-center rounded-[14px] border border-white/10 bg-black/20 p-5">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Generated QR"
                className="w-full max-w-[200px] rounded-lg"
                style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <span className="text-sm font-medium text-white/60">
                Enter text to generate QR
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 max-sm:flex-col">
            <button
              onClick={downloadPNG}
              disabled={!qrDataUrl}
              className="flex-1 rounded-full bg-white/90 px-4 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Download PNG
            </button>

            <button
              onClick={downloadSVG}
              disabled={!qrSvg}
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Download SVG
            </button>
          </div>
        </main>

        {/* Credit */}
        <footer className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-[#141821]/60 px-3 py-1.5 text-xs text-white/60 backdrop-blur">
          <a
            href="https://instagram.com/berkindev"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white/90"
          >
            Coded by @berkindev
          </a>
        </footer>
      </div>
    </div>
  );
};

export default QRGenerator;
