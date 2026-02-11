import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import QRGenerator from "./pages/QRGenerator";
import TextToPDF from "./pages/textToPdf";
import PDFSplitter from "./pages/pdfSplitter";
import Home from "./pages/Home";
import Pdfcompressor from "./pages/PdfCompressor";
import PdfMerger from "./pages/PdfMerger";
import PageTransition from "./components/PageTransition";

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
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
