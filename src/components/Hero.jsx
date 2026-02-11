import React, { useState } from "react";

const Hero = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <style>
        {`
                    @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
                    *{
                        font-family: "Poppins", sans-serif;
                    }
                    @keyframes rotate {
                        100% {
                            transform: rotate(1turn);
                        }
                    }
            
                    .rainbow::before {
                        content: '';
                        position: absolute;
                        z-index: -2;
                        left: -50%;
                        top: -50%;
                        width: 200%;
                        height: 200%;
                        background-position: 100% 50%;
                        background-repeat: no-repeat;
                        background-size: 50% 30%;
                        filter: blur(6px);
                        background-image: linear-gradient(#FFF);
                        animation: rotate 4s linear infinite;
                    }
                `}
      </style>

      <header id="home" className='bg-black text-white flex flex-col items-center bg-[url("https://assets.prebuiltui.com/images/components/hero-section/hero-background-image.png")] bg-cover bg-center bg-no-repeat pb-10'>
       <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
  <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 md:px-12 lg:px-20">

    {/* Logo */}
    <h2 className="text-2xl font-semibold">
      Nex<span className="text-[#A6FF5D]">Tools</span>
    </h2>

    {/* Desktop Menu */}
    <div className="hidden md:flex items-center gap-8 text-sm">
      <a href="#home"className="relative text-white/70 hover:text-[#A6FF5D] transition duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A6FF5D] after:transition-all after:duration-300 hover:after:w-full"
>
        Home
      </a>
      <a href="#services"className="relative text-white/70 hover:text-[#A6FF5D] transition duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A6FF5D] after:transition-all after:duration-300 hover:after:w-full"
>
        Services
      </a>
      <a href="#faq"className="relative text-white/70 hover:text-[#A6FF5D] transition duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A6FF5D] after:transition-all after:duration-300 hover:after:w-full"
>
        FAQ
      </a>
      <a href="#pricing"className="relative text-white/70 hover:text-[#A6FF5D] transition duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A6FF5D] after:transition-all after:duration-300 hover:after:w-full"
>
        Pricing
      </a>
      <a href="#contact"className="relative text-white/70 hover:text-[#A6FF5D] transition duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A6FF5D] after:transition-all after:duration-300 hover:after:w-full"
>
        Contact
      </a>
    <a href="#footer" className="relative text-white/70 hover:text-[#A6FF5D] transition duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#A6FF5D] after:transition-all after:duration-300 hover:after:w-full"
>
        Footer
      </a>
    </div>

    {/* Mobile Menu Button */}
    <button
      onClick={() => setMobileOpen(true)}
      className="md:hidden bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-md transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </svg>
    </button>
  </div>
</nav>


        <div className="rainbow relative z-0 bg-white/15 overflow-hidden p-px flex items-center justify-center rounded-full transition duration-300 active:scale-100 mt-28 md:mt-32">
          <button className="flex items-center justify-center gap-3 pl-4 pr-6 py-3 text-white rounded-full font-medium bg-gray-900/80 backdrop-blur">
            <div className="relative flex size-3.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#A6FF5D] opacity-75 animate-ping duration-300"></span>
              <span className="relative inline-flex size-2 rounded-full bg-[#A6FF5D]"></span>
            </div>
            <span className="text-xs">Powerful Tools. Zero Hassle.</span>
          </button>
        </div>

        <h1 className="text-4xl md:text-[64px]/[82px] text-center max-w-4xl mt-5 bg-clip-text leading-tight px-4">
         Build powerful tools
that simplify your workflow
        </h1>
        <p className="text-sm md:text-base text-gray-300 bg-clip-text text-center max-w-lg mt-4.5 px-4">
A fast and privacy-focused platform offering PDF utilities, QR generation and file tools — all in one place.
        </p>

        <div className="flex gap-3 mt-8">
          <button className="bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-800 px-6 py-2.5 rounded-full text-sm transition cursor-pointer group">
            <div className="relative overflow-hidden">
              <span className="block transition-transform duration-200 group-hover:-translate-y-full">
                Get Started today
              </span>
              <span className="absolute top-0 left-0 block transition-transform duration-200 group-hover:translate-y-0 translate-y-full">
                Get Started today
              </span>
            </div>
          </button>
          <div className="bg-white/15 hover:bg-white/10 p-px flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100">
            <button className="px-6 text-sm py-3 text-white rounded-full bg-white/5 cursor-pointer">
              Our products
            </button>
          </div>
        </div>

        

        <div className="scroll-down flex flex-col items-center gap-4 mt-20 animate-bounce cursor-pointer">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 9A7 7 0 1 0 5 9v6a7 7 0 1 0 14 0zm-7-3v4"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p className="text-sm text-white/50">Scroll down</p>
        </div>
      </header>
    </>
  );
};

export default Hero;
