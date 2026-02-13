import React, { useState } from 'react'

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for trying out our services",
      featured: true,
      badge: "Most Popular",
      features: [
        { text: "5 conversions per day", included: true },
        { text: "25MB file size limit", included: true },
        { text: "Basic PDF tools", included: true },
        { text: "QR code generator", included: true },
        { text: "Standard processing speed", included: true },
        { text: "Email support", included: true },
        { text: "Batch processing", included: false },
        { text: "API access", included: false },
        { text: "Custom branding", included: false },
        { text: "Priority support", included: false }
      ],
      buttonText: "Get Started Free",
      buttonStyle: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
    },
    {
      name: "Pro",
      price: { monthly: 499, yearly: 4990 },
      description: "For professionals and power users",
      featured: false,
      badge: null,
      features: [
        { text: "Unlimited conversions", included: true },
        { text: "100MB file size limit", included: true },
        { text: "All PDF tools", included: true },
        { text: "Advanced QR customization", included: true },
        { text: "Fast processing speed", included: true },
        { text: "Priority email support", included: true },
        { text: "Batch processing", included: true },
        { text: "API access (1000 calls/day)", included: true },
        { text: "Custom branding", included: false },
        { text: "Dedicated support", included: false }
      ],
      buttonText: "Coming Soon",
      buttonStyle: "bg-white/5 hover:bg-white/10 text-white/50 border border-white/10",
      comingSoon: true
    },
    {
      name: "Enterprise",
      price: { monthly: null, yearly: null },
      description: "Custom solutions for your business",
      featured: false,
      badge: null,
      features: [
        { text: "Unlimited everything", included: true },
        { text: "Custom file size limits", included: true },
        { text: "All premium features", included: true },
        { text: "White-label solutions", included: true },
        { text: "Fastest processing", included: true },
        { text: "24/7 phone support", included: true },
        { text: "Advanced batch processing", included: true },
        { text: "Unlimited API access", included: true },
        { text: "Custom branding", included: true },
        { text: "Dedicated account manager", included: true }
      ],
      buttonText: "Coming Soon",
      buttonStyle: "bg-white/5 hover:bg-white/10 text-white/50 border border-white/10",
      comingSoon: true
    }
  ]

  return (
    <>
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
          * { font-family: "Poppins", sans-serif; }
          
          .pricing-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .pricing-card:hover {
            transform: translateY(-8px);
          }
          
          .pricing-card.featured {
            transform: scale(1.05);
            z-index: 10;
          }
          
          @keyframes pulse-border {
            0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.3); }
            50% { box-shadow: 0 0 0 12px rgba(37, 99, 235, 0); }
          }
          
          .featured-border {
            animation: pulse-border 3s infinite;
          }
        `}
      </style>

      <section id='pricing' className='bg-[#0a0a0c] text-white py-20 md:py-28 px-4 relative overflow-hidden'>
        {/* Decorative Background Blur */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        
        <div className='max-w-7xl mx-auto relative z-10'>
          {/* Section Header */}
          <div className='text-center mb-16'>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className='text-[10px] uppercase tracking-widest font-bold text-white/50'>Pricing Plans</span>
            </div>
            
            <h2 className='text-4xl md:text-5xl font-bold mb-6 tracking-tight'>
              Choose the perfect <span className="text-blue-500">plan</span>
            </h2>
            <p className='text-gray-400 text-lg max-w-2xl mx-auto mb-10'>
              Start for free and upgrade as you grow. No credit card required.
            </p>

            {/* Billing Toggle */}
            <div className='inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-2xl p-1.5'>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  billingCycle === 'monthly' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  billingCycle === 'yearly' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'
                }`}
              >
                Yearly
                <span className='ml-2 text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-md'>-17%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto pt-8'>
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`pricing-card relative bg-white/[0.02] border rounded-[32px] p-8 md:p-10 ${
                  plan.featured
                    ? 'featured border-blue-500/50 bg-white/[0.04] featured-border'
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl'>
                    {plan.badge}
                  </div>
                )}

                {plan.comingSoon && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white/50 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10'>
                    Coming Soon
                  </div>
                )}

                <h3 className='text-2xl font-bold mb-2'>{plan.name}</h3>
                <p className='text-white/30 text-sm mb-8 font-medium'>{plan.description}</p>

                {/* Price */}
                <div className='mb-10'>
                  {plan.price[billingCycle] !== null ? (
                    <div className='flex items-baseline'>
                      <span className='text-5xl font-black tracking-tighter'>
                        ₹{plan.price[billingCycle].toLocaleString('en-IN')}
                      </span>
                      <span className='text-white/20 ml-2 font-bold text-sm uppercase tracking-widest'>
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                  ) : (
                    <span className='text-4xl font-black tracking-tighter'>Custom</span>
                  )}
                </div>

                <button 
                  className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 mb-10 ${plan.buttonStyle} ${
                    plan.comingSoon ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'
                  }`}
                  disabled={plan.comingSoon}
                >
                  {plan.buttonText}
                </button>

                {/* Features */}
                <div className='space-y-4'>
                  <p className='text-[10px] font-black uppercase tracking-[2px] text-white/20 mb-6'>Features Included</p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className='flex items-center gap-3'>
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${feature.included ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                        <svg className={`w-3 h-3 ${feature.included ? 'text-blue-500' : 'text-white/10'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={feature.included ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                      </div>
                      <span className={`text-sm font-medium ${feature.included ? 'text-white/70' : 'text-white/20 line-through'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Note */}
          <div className='mt-20 text-center opacity-40 hover:opacity-100 transition-opacity'>
            <p className='text-sm font-medium'>
              All plans include a 30-day money-back guarantee. <a href="#contact" className='text-blue-500 hover:underline underline-offset-4'>Contact us</a> for custom needs.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Pricing