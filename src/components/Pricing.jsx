import React, { useState } from 'react'
import { Check, X, Zap, Crown, Building2 } from 'lucide-react'

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      name: "Starter Lab",
      icon: <Zap size={20} className="text-blue-500" />,
      price: { monthly: 0, yearly: 0 },
      description: "Basic processing for daily tasks.",
      featured: true,
      badge: "Active",
      features: [
        { text: "Unlimited daily conversions", included: true },
        { text: "Up to 50MB file size", included: true },
        { text: "Zero-Server Encryption", included: true },
        { text: "Standard local processing", included: true },
        { text: "Community Support", included: true },
        { text: "Batch automation", included: false },
        { text: "Custom API Keys", included: false },
      ],
      buttonText: "Deploy Now",
      buttonStyle: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_20px_40px_rgba(37,99,235,0.2)]"
    },
    {
      name: "Pro Suite",
      icon: <Crown size={20} className="text-purple-500" />,
      price: { monthly: 499, yearly: 4990 },
      description: "High-speed tools for power users.",
      featured: false,
      features: [
        { text: "Unlimited everything", included: true },
        { text: "Up to 1GB file size", included: true },
        { text: "Advanced QR customization", included: true },
        { text: "GPU Accelerated speeds", included: true },
        { text: "Priority Dev support", included: true },
        { text: "Batch automation", included: true },
        { text: "Custom API Keys", included: true },
      ],
      buttonText: "Coming Soon",
      buttonStyle: "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed",
      comingSoon: true
    },
    {
      name: "Business",
      icon: <Building2 size={20} className="text-emerald-500" />,
      price: { monthly: null, yearly: null },
      description: "White-label & custom deployment.",
      featured: false,
      features: [
        { text: "Custom file size limits", included: true },
        { text: "White-label UI branding", included: true },
        { text: "Self-hosted deployment", included: true },
        { text: "Dedicated account lead", included: true },
        { text: "SLA Guarantees", included: true },
        { text: "Full API integration", included: true },
        { text: "Unlimited users", included: true },
      ],
      buttonText: "Coming Soon",
      buttonStyle: "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed",
      comingSoon: true
    }
  ]

  return (
    <section id='pricing' className='bg-[#0a0a0c] text-white py-32 px-6 relative overflow-hidden'>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className='max-w-7xl mx-auto relative z-10'>
        
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12'>
          <div className="max-w-2xl">
            <h2 className='text-[10px] font-black uppercase tracking-[5px] text-blue-500 mb-6'>Licensing</h2>
            <h3 className='text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]'>
              Predictable <br /> 
              <span className="text-white/20 text-glow-subtle">Economics.</span>
            </h3>
          </div>
          
          <div className='bg-[#111116] border border-white/5 p-2 rounded-2xl inline-flex'>
            {['monthly', 'yearly'].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-[2px] transition-all ${
                  billingCycle === cycle ? 'bg-blue-600 text-white' : 'text-white/30 hover:text-white'
                }`}
              >
                {cycle} {cycle === 'yearly' && <span className="ml-2 text-blue-400">(-17%)</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch'>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`group relative flex flex-col p-10 rounded-[48px] transition-all duration-500 bg-[#111116] border ${
                plan.featured ? 'border-blue-500/30' : 'border-white/5'
              } hover:border-white/20`}
            >
              {plan.badge && (
                <div className='absolute top-10 right-10 flex items-center gap-2'>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className='text-[10px] font-black uppercase tracking-widest text-blue-500'>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-12">
                <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl">{plan.icon}</div>
                <h3 className='text-3xl font-bold tracking-tighter uppercase italic mb-2'>{plan.name}</h3>
                <p className='text-white/30 text-sm font-medium'>{plan.description}</p>
              </div>

              <div className='mb-12'>
                {plan.price[billingCycle] !== null ? (
                  <div className='flex items-baseline gap-2'>
                    <span className='text-6xl font-black tracking-tighter'>
                      ₹{plan.price[billingCycle].toLocaleString('en-IN')}
                    </span>
                    <span className='text-white/10 font-bold text-xs uppercase tracking-widest'>
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                ) : (
                  <span className='text-5xl font-black tracking-tighter uppercase italic'>Custom</span>
                )}
              </div>

              <div className='space-y-5 flex-grow'>
                <p className='text-[9px] font-black uppercase tracking-[3px] text-white/10 mb-6'>Capability Suite</p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className='flex items-center gap-4 group/item'>
                    {feature.included ? (
                      <Check size={14} className="text-blue-500" />
                    ) : (
                      <X size={14} className="text-white/10" />
                    )}
                    <span className={`text-[13px] font-medium transition-colors ${feature.included ? 'text-white/60 group-hover/item:text-white' : 'text-white/10 line-through'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                className={`w-full mt-12 py-6 rounded-3xl text-xs font-black uppercase tracking-[3px] transition-all duration-300 ${plan.buttonStyle}`}
                disabled={plan.comingSoon}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Footer Hint */}
        <p className='mt-20 text-center text-[10px] font-black uppercase tracking-[4px] text-white/10'>
          Zero Hidden Fees • Cancel Anytime • Browser-Side Processing
        </p>
      </div>
    </section>
  )
}

export default Pricing