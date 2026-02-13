import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Components
import Sidebar from "./components/Sidebar";
import PageTransition from "./components/PageTransition";

// Pages
import Home from "./pages/Home";
import QRGenerator from "./pages/QRGenerator";
import TextToPDF from "./pages/textToPdf";
import PDFSplitter from "./pages/pdfSplitter";
import Pdfcompressor from "./pages/PdfCompressor";
import PdfMerger from "./pages/PdfMerger";
import ImageConverter from './pages/ImageConverter';
import PDFOrganizer from "./pages/pdfOrganizer";
import PDFWatermarker from "./pages/pdfWatermarker";
import PDFContentEditor from "./pages/pdfContentEditor";
import ImageToPDF from "./pages/ImagetoPdf";
import BackgroundRemover from "./pages/BackgroundRemover";
import ColorPalette from "./pages/ColorPalette";
import CodeToImage from "./pages/CodeToImage";
import PDFProtect from "./pages/PDFProtect";

// --- Layout Wrapper for Conditional Sidebar ---
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  // Sidebar stays hidden on the Home page ("/")
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex bg-[#0a0a0c] min-h-screen text-white selection:bg-blue-500/30">
      {!isHomePage && <Sidebar />}
      
      <main className={`flex-1 w-full transition-all duration-500 ${!isHomePage ? 'md:ml-20 pb-20 md:pb-0' : ''}`}>
        {children}
      </main>
    </div>
  );
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/services/qrgenerator" element={<PageTransition><QRGenerator /></PageTransition>} />
        <Route path="/services/texttopdf" element={<PageTransition><TextToPDF /></PageTransition>} />
        <Route path="/services/pdfsplitter" element={<PageTransition><PDFSplitter /></PageTransition>} />
        <Route path="/services/pdfcompressor" element={<PageTransition><Pdfcompressor /></PageTransition>} />
        <Route path="/services/pdfmerger" element={<PageTransition><PdfMerger /></PageTransition>} />
        <Route path="/services/imageconverter" element={<PageTransition><ImageConverter /></PageTransition>} />
        <Route path="/services/pdforganizer" element={<PageTransition><PDFOrganizer /></PageTransition>} />
        <Route path="/services/pdfwatermarker" element={<PageTransition><PDFWatermarker /></PageTransition>} />
        <Route path="/services/pdfeditor" element={<PageTransition><PDFContentEditor /></PageTransition>} />
        <Route path="/services/imagetopdf" element={<PageTransition><ImageToPDF /></PageTransition>} />
        <Route path="/services/backgroundremover" element={<PageTransition><BackgroundRemover /></PageTransition>} />
        <Route path="/services/colorpalette" element={<PageTransition><ColorPalette /></PageTransition>} />
        <Route path="/services/codetoimage" element={<PageTransition><CodeToImage /></PageTransition>} />
        <Route path="/services/pdfprotect" element={<PageTransition><PDFProtect /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <LayoutWrapper>
        <AnimatedRoutes />
      </LayoutWrapper>
    </Router>
  );
}