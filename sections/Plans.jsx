import { useState } from 'react';

const SubscriptionSection = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'free',
      name: '[FREE_TIER]',
      price: '₹0',
      period: '/month',
      color: 'green',
      features: [
        'Basic lessons access',
        '3 mini-games per day',
        'Community support',
        'Progress tracking',
        'Basic badges'
      ],
      limitations: [
        'Limited daily attempts',
        'No premium content'
      ],
      buttonText: '> START_FREE',
      popular: false,
      glow: 'from-green-400 to-emerald-500'
    },
    {
      id: 'pro',
      name: '[PRO_GAMER]',
      price: '₹299',
      period: '/month',
      color: 'cyan',
      features: [
        'All lessons & tutorials',
        'Unlimited mini-games',
        'Advanced projects',
        'Priority support',
        'Exclusive badges',
        'Code challenges',
        'Progress analytics'
      ],
      limitations: [],
      buttonText: '> LEVEL_UP',
      popular: true,
      glow: 'from-cyan-400 to-blue-500'
    },
    {
      id: 'elite',
      name: '[ELITE_HACKER]',
      price: '₹499',
      period: '/month',
      color: 'purple',
      features: [
        'Everything in Pro',
        'Personal mentor access',
        'Live coding sessions',
        'Custom learning path',
        'Certificate programs',
        'Job referral network',
        'Exclusive Discord server'
      ],
      limitations: [],
      buttonText: '> GO_ELITE',
      popular: false,
      glow: 'from-purple-400 to-pink-500'
    }
  ];

  const getCardStyles = (plan) => {
    const baseStyles = "retro-card relative overflow-hidden transition-all duration-500 hover:transform hover:scale-105 hover:rotate-1 cursor-pointer";
    
    if (plan.popular) {
      return `${baseStyles} ring-4 ring-cyan-400 ring-opacity-50 transform scale-105 z-10`;
    }
    
    return baseStyles;
  };

  const getGlowEffect = (color) => {
    const glowColors = {
      green: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]',
      cyan: 'shadow-[0_0_40px_rgba(34,211,238,0.4)]',
      purple: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]'
    };
    return glowColors[color] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 py-20 px-4 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pixel-font {
          font-family: 'Press Start 2P', monospace;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
        
        .retro-card {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.95));
          border: 2px solid;
          position: relative;
          backdrop-filter: blur(10px);
        }
        
        .retro-card.border-green { border-color: #00ff88; }
        .retro-card.border-cyan { border-color: #22d3ee; }
        .retro-card.border-purple { border-color: #a855f7; }
        
        .retro-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          transition: left 0.6s ease;
          z-index: 1;
        }
        
        .retro-card.border-green::before {
          background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.1), transparent);
        }
        
        .retro-card.border-cyan::before {
          background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.1), transparent);
        }
        
        .retro-card.border-purple::before {
          background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.1), transparent);
        }
        
        .retro-card:hover::before {
          left: 100%;
        }
        
        .pixel-button {
          border: none;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
        }
        
        .pixel-button.btn-green {
          background: linear-gradient(45deg, #00ff88, #00cc66);
        }
        
        .pixel-button.btn-cyan {
          background: linear-gradient(45deg, #22d3ee, #0099cc);
        }
        
        .pixel-button.btn-purple {
          background: linear-gradient(45deg, #a855f7, #7c3aed);
        }
        
        .pixel-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 0 rgba(0, 0, 0, 0.3), 0 12px 20px rgba(0, 0, 0, 0.2);
        }
        
        .pixel-button:active {
          transform: translateY(1px);
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
        }
        
        .floating-particles {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #00ff88;
          animation: particle-float 8s ease-in-out infinite;
          opacity: 0.6;
        }
        
        @keyframes particle-float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.6; }
          25% { transform: translateY(-30px) translateX(10px) rotate(90deg); opacity: 1; }
          50% { transform: translateY(-20px) translateX(-15px) rotate(180deg); opacity: 0.8; }
          75% { transform: translateY(-40px) translateX(5px) rotate(270deg); opacity: 1; }
        }
        
        .popular-badge {
          background: linear-gradient(45deg, #ff6b6b, #ffd93d);
          animation: badge-pulse 2s ease-in-out infinite;
        }
        
        @keyframes badge-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .glow-text {
          text-shadow: 0 0 10px currentColor;
        }
        
        .feature-item {
          position: relative;
          padding-left: 20px;
        }
        
        .feature-item::before {
          content: '>';
          position: absolute;
          left: 0;
          color: inherit;
          font-weight: bold;
        }
        
        .limitation-item {
          position: relative;
          padding-left: 20px;
          opacity: 0.6;
        }
        
        .limitation-item::before {
          content: 'x';
          position: absolute;
          left: 0;
          color: #ff4444;
          font-weight: bold;
        }
        
        .price-glitch {
          animation: price-glitch 3s ease-in-out infinite;
        }
        
        @keyframes price-glitch {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-2px, 1px); }
          94% { transform: translate(2px, -1px); }
          96% { transform: translate(-1px, 2px); }
          98% { transform: translate(1px, -2px); }
        }
      `}</style>

      {/* Floating particles background */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="floating-particles"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            backgroundColor: ['#00ff88', '#22d3ee', '#a855f7'][Math.floor(Math.random() * 3)]
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="pixel-font text-2xl md:text-4xl font-bold mb-6 text-white glow-text">
            {'<'} CHOOSE_YOUR_PLAN {'>'}
          </h2>
          <p className="pixel-font text-xs md:text-sm text-green-300 max-w-2xl mx-auto leading-relaxed">
            Level up your coding skills with the perfect subscription tier. 
            Unlock premium content, exclusive features, and join the elite community!
          </p>
          
          {/* Decorative separator */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-green-400"></div>
            <div className="pixel-font text-green-400 text-xs">{'{ PLANS }'}</div>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-green-400"></div>
          </div>
        </div>

        {/* Subscription Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`${getCardStyles(plan)} border-${plan.color} ${getGlowEffect(plan.color)} p-8 rounded-none`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="popular-badge pixel-font text-xs text-black px-4 py-2 font-bold">
                    MOST POPULAR!
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8 relative z-10">
                <h3 className={`pixel-font text-sm md:text-base font-bold mb-4 text-${plan.color}-400 glow-text`}>
                  {plan.name}
                </h3>
                
                <div className="price-glitch">
                  <span className={`pixel-font text-3xl md:text-4xl font-bold text-${plan.color}-300`}>
                    {plan.price}
                  </span>
                  <span className="pixel-font text-xs text-gray-400 ml-2">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-8 relative z-10">
                <div className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`feature-item pixel-font text-xs text-${plan.color}-300 leading-relaxed`}
                    >
                      {feature}
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation, index) => (
                    <div
                      key={`limit-${index}`}
                      className="limitation-item pixel-font text-xs text-gray-500 leading-relaxed"
                    >
                      {limitation}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center relative z-10">
                <button
                  className={`pixel-button btn-${plan.color} w-full py-4 pixel-font text-xs md:text-sm font-bold text-black`}
                >
                  {plan.buttonText}
                </button>
                
                {plan.popular && (
                  <p className="pixel-font text-xs text-cyan-400 mt-3 opacity-80">
                    {'>'} Best value for money! {'<'}
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className={`mt-6 pt-4 border-t border-${plan.color}-800 relative z-10`}>
                <div className="flex justify-center space-x-2 text-xs">
                  <span className={`pixel-font text-${plan.color}-600 opacity-60`}>{'</'}</span>
                  <span className={`pixel-font text-${plan.color}-600 opacity-80`}>{'code'}</span>
                  <span className={`pixel-font text-${plan.color}-600 opacity-60`}>{'>'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-16">
          <p className="pixel-font text-xs text-gray-400 mb-4">
            All plans include 7-day free trial • Cancel anytime • No hidden fees
          </p>
          
          <div className="flex justify-center space-x-6 text-green-500 pixel-font text-xs opacity-60">
            <span>{'{'}</span>
            <span>{'secure_payment'}</span>
            <span>{':'}</span>
            <span>{'true'}</span>
            <span>{'}'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSection;