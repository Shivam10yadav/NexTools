import React from 'react'
import Hero from '../components/Hero'
// import Features from '../components/Features'
import Services from '../components/Services'
import FAQ from '../components/FAQ'
import Pricing from '../components/Pricing'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
  <Hero/>
    {/* <Features/> */}
    <Services/>
    <FAQ/>
    <Pricing/>
    <Contact/>
    <Footer/>
    </>
  )
}

export default Home