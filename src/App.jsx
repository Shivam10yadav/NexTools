import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Components
import Sidebar from "./components/Sidebar";
import PageTransition from "./components/PageTransition";

// Pages
import Home from "./pages/Home";
import ServicesHub from "./pages/ServicesHub"; // New Hub Page
import QRGenerator from "./pages/QRGenerator";
import TextToPDF from "./pages/textToPdf"; // Matched casing to your file system
import PDFSplitter from "./pages/pdfSplitter"; 
import Pdfcompressor from "./pages/PdfCompressor";
import PdfMerger from "./pages/PdfMerger";
import ImageConverter from './pages/ImageConverter';
import PDFOrganizer from "./pages/pdfOrganizer";
import PDFWatermarker from "./pages/pdfWatermarker";
import PDFContentEditor from "./pages/pdfContentEditor";
import ImageToPDF from "./pages/ImageToPDF"; // Corrected casing
import BackgroundRemover from "./pages/BackgroundRemover";
import ColorPalette from "./pages/ColorPalette";
import CodeToImage from "./pages/CodeToImage";
import PDFProtect from "./pages/PDFProtect";
import NotFound from "./pages/NotFound";
import HiddenMessage from "./pages/HiddenMessage";
import CodeToVideo from "./pages/CodeToVideo";
import PrivacyRedactor from "./pages/PrivacyRedactor";
import PasswordGenerator from "./pages/PasswordGenerator";
import JsonFormatter from "./pages/JsonFormatter";


// --- Layout Wrapper ---
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Sidebar only hides on the Hero/Home page
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex bg-[#0a0a0c] min-h-screen text-white selection:bg-blue-500/30">
      {/* Sidebar now shows on /services AND all /services/tool-name paths */}
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
        {/* Landing Page */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />

        {/* Services Hub (The separate page you wanted) */}
        <Route path="/services" element={<PageTransition><ServicesHub /></PageTransition>} />

        {/* Individual Tools */}
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
        <Route path="/services/hiddenmessage" element={<PageTransition><HiddenMessage /></PageTransition>} />
        <Route path="/services/codetovideo" element={<PageTransition><CodeToVideo /></PageTransition>} />
        <Route path="/services/privacyredactor" element={<PageTransition><PrivacyRedactor /></PageTransition>} />
        <Route path="/services/passwordgenerator" element={<PageTransition><PasswordGenerator /></PageTransition>} />
        <Route path="/services/jsonformatter" element={<PageTransition><JsonFormatter /></PageTransition>} />
      
      

        <Route path="*" element={<NotFound />} />
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