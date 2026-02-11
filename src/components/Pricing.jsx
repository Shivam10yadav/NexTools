import React, { useState } from 'react'

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      name: "Free",
      price: {
        monthly: 0,
        yearly: 0
      },
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
      buttonStyle: "bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-800"
    },
    {
      name: "Pro",
      price: {
        monthly: 499,
        yearly: 4990
      },
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
      buttonStyle: "bg-white/10 hover:bg-white/15 text-white border border-white/20",
      comingSoon: true
    },
    {
      name: "Enterprise",
      price: {
        monthly: null,
        yearly: null
      },
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
      buttonStyle: "bg-white/10 hover:bg-white/15 text-white border border-white/20",
      comingSoon: true
    }
  ]

  return (
    <>
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
          * {
            font-family: "Poppins", sans-serif;
          }
          
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
          
          .pricing-card.featured:hover {
            transform: scale(1.05) translateY(-8px);
          }
          
          @keyframes pulse-border {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(166, 255, 93, 0.4);
            }
            50% {
              box-shadow: 0 0 0 8px rgba(166, 255, 93, 0);
            }
          }
          
          .featured-border {
            animation: pulse-border 2s infinite;
          }
        `}
      </style>

      <section id='pricing' className='bg-black text-white py-20 md:py-28 px-4 bg-[url("https://assets.prebuiltui.com/images/components/hero-section/hero-background-image.png")] bg-cover bg-center bg-no-repeat'>
        <div className='max-w-7xl mx-auto'>
          {/* Section Header */}
          <div className='text-center mb-16'>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
              <div className="relative flex size-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#A6FF5D] opacity-75 animate-ping"></span>
                <span className="relative inline-flex size-1.5 rounded-full bg-[#A6FF5D]"></span>
              </div>
              <span className='text-xs text-white/70'>Pricing Plans</span>
            </div>
            
            <h2 className='text-3xl md:text-5xl font-semibold mb-4 leading-tight'>
              Choose the perfect plan for you
            </h2>
            <p className='text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-8'>
              Start for free and upgrade as you grow. No credit card required for free plan.
            </p>

            {/* Billing Toggle */}
            <div className='inline-flex items-center gap-3 bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-full p-1'>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-[#A6FF5D] text-gray-800'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  billingCycle === 'yearly'
                    ? 'bg-[#A6FF5D] text-gray-800'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly
                <span className='ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full'>
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto'>
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`pricing-card relative bg-gray-900/40 backdrop-blur-sm border rounded-2xl p-8 ${
                  plan.featured
                    ? 'featured border-[#A6FF5D]/50 bg-gray-900/60 featured-border'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                    <div className='bg-[#A6FF5D] text-gray-800 px-4 py-1 rounded-full text-xs font-semibold'>
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Coming Soon Badge */}
                {plan.comingSoon && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                    <div className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-semibold'>
                      Coming Soon
                    </div>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className='text-2xl font-bold mb-2'>{plan.name}</h3>
                <p className='text-gray-400 text-sm mb-6'>{plan.description}</p>

                {/* Price */}
                <div className='mb-8'>
                  {plan.price[billingCycle] !== null ? (
                    <div className='flex items-baseline gap-1'>
                      <span className='text-lg text-gray-400'>₹</span>
                      <span className='text-5xl font-bold'>
                        {plan.price[billingCycle].toLocaleString('en-IN')}
                      </span>
                      <span className='text-gray-400 ml-2'>
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                  ) : (
                    <div className='flex items-baseline gap-1'>
                      <span className='text-4xl font-bold'>Custom</span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button 
                  className={`w-full py-3 rounded-full text-sm font-medium transition-all duration-300 mb-8 ${plan.buttonStyle} ${
                    plan.comingSoon ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                  }`}
                  disabled={plan.comingSoon}
                >
                  {plan.buttonText}
                </button>

                {/* Features List */}
                <div className='space-y-4'>
                  <p className='text-sm font-semibold text-gray-300 mb-4'>What's included:</p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className='flex items-start gap-3'>
                      {feature.included ? (
                        <svg 
                          className='w-5 h-5 text-[#A6FF5D] flex-shrink-0 mt-0.5' 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                      ) : (
                        <svg 
                          className='w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5' 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M6 18L18 6M6 6l12 12" 
                          />
                        </svg>
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Note */}
          <div className='mt-16 text-center'>
            <p className='text-gray-400 text-sm'>
              All plans include a 30-day money-back guarantee. Need a custom solution?{' '}
              <a href="#" className='text-[#A6FF5D] hover:underline'>Contact us</a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Pricing