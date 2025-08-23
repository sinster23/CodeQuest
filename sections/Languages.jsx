import { useState, useEffect } from 'react';

const CodingLanguagesShowcase = () => {
  // Programming languages data with their official logos
  const languages = [
    { 
      name: 'JavaScript', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      color: '#F7DF1E', 
      bgColor: '#1a1a1a' 
    },
    { 
      name: 'Python', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      color: '#3776AB', 
      bgColor: '#1a1a1a' 
    },
    { 
      name: 'React', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      color: '#61DAFB', 
      bgColor: '#1a1a1a' 
    },
    { 
      name: 'TypeScript', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      color: '#3178C6', 
      bgColor: '#1a1a1a' 
    },
    { 
      name: 'Node.js', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      color: '#339933', 
      bgColor: '#1a1a1a' 
    },
    { 
      name: 'Go', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
      color: '#00ADD8', 
      bgColor: '#1a1a1a' 
    },
    { 
      name: 'Rust', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',
      color: '#000000', 
      bgColor: '#1a1a1a' 
    },
    { 
      name: 'Java', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      color: '#ED8B00', 
      bgColor: '#1a1a1a' 
    },
    { 
      name: 'C++', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
      color: '#00599C', 
      bgColor: '#1a1a1a' 
    },
    { 
      name: 'Swift', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
      color: '#FA7343', 
      bgColor: '#1a1a1a' 
    },
    { 
      name: 'Kotlin', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
      color: '#7F52FF', 
      bgColor: '#1a1a1a' 
    },
    { 
      name: 'PHP', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
      color: '#777BB4', 
      bgColor: '#1a1a1a' 
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % languages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [languages.length]);

  // Get 8 visible languages starting from currentIndex
  const getVisibleLanguages = () => {
    const visible = [];
    for (let i = 0; i < 8; i++) {
      const index = (currentIndex + i) % languages.length;
      visible.push(languages[index]);
    }
    return visible;
  };

  const visibleLanguages = getVisibleLanguages();

  const LanguageIcon = ({ lang, index }) => (
    <div
      className="language-card relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center cursor-pointer group transition-all duration-300"
      style={{ 
        backgroundColor: lang.bgColor,
        border: `2px solid ${lang.color}40`,
        animationDelay: `${index * 0.1}s`
      }}
    >
      <img
        src={lang.logo}
        alt={lang.name}
        className="w-8 h-8 sm:w-10 sm:h-10 object-contain select-none"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
        onError={(e) => {
          // Fallback to text if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      
      {/* Fallback text (hidden by default) */}
      <span 
        className="text-lg sm:text-xl font-bold pixelated select-none hidden"
        style={{ color: lang.color }}
      >
        {lang.name.substring(0, 2).toUpperCase()}
      </span>
      
      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pixelated whitespace-nowrap z-10">
        {lang.name}
      </div>

      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${lang.color}40 0%, transparent 70%)`
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-green-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Header Section */}
      <div className="text-center mb-16 z-10 relative">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 pixelated fade-in">
          Code in{' '}
          <span className="text-green-400 glow-text">
            25+
          </span>
          {' '}languages
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto pixelated leading-relaxed fade-in-delay">
          Master your coding skills with interactive challenges or
          <br className="hidden sm:block" />
          build amazing projects while learning new technologies.
        </p>
      </div>

      {/* Language Icons Grid */}
      <div className="relative z-10">
        <div className="grid grid-cols-4 gap-6 sm:gap-8 mb-8">
          {visibleLanguages.slice(0, 4).map((lang, index) => (
            <LanguageIcon key={`${lang.name}-${currentIndex}-top-${index}`} lang={lang} index={index} />
          ))}
        </div>
        
        <div className="grid grid-cols-4 gap-6 sm:gap-8">
          {visibleLanguages.slice(4, 8).map((lang, index) => (
            <LanguageIcon key={`${lang.name}-${currentIndex}-bottom-${index}`} lang={lang} index={index + 4} />
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-12 flex space-x-2">
        {languages.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: index === currentIndex ? '#4ade80' : '#374151',
              transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)',
              opacity: index === currentIndex ? 1 : 0.5
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        .pixelated {
          font-family: 'Courier New', monospace;
          image-rendering: pixelated;
          font-weight: bold;
          text-rendering: geometricPrecision;
        }

        .fade-in {
          animation: fadeInUp 1s ease-out;
        }

        .fade-in-delay {
          animation: fadeInUp 1s ease-out 0.3s both;
        }

        .fade-in-delay-2 {
          animation: fadeInScale 0.8s ease-out 1s both;
        }

        .language-card {
          animation: slideInRotate 0.6s ease-out both;
        }

        .language-card:hover {
          transform: scale(1.1) translateY(-5px);
          box-shadow: 0 10px 25px rgba(74, 222, 128, 0.3);
        }

        .particle {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInRotate {
          from {
            opacity: 0;
            transform: scale(0.8) rotateY(-90deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 10px #4ade80, 0 0 20px #4ade80, 0 0 30px #4ade80;
          }
          to {
            text-shadow: 0 0 20px #4ade80, 0 0 30px #4ade80, 0 0 40px #4ade80;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
          75% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CodingLanguagesShowcase;