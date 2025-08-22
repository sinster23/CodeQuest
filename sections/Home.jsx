import { useState, useEffect } from 'react';
import  {useNavigate, useNavigation} from 'react-router-dom';

const CodingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Load pixelated font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);
  const navigate= useNavigate();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-black text-white py-4 z-50 border-b border-gray-800">
        <div className="px-5 mx-auto flex items-center justify-between">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 cursor-pointer group">
              {/* Logo/Icon */}
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                <span className="text-black font-bold text-lg pixelated">&lt;/&gt;</span>
              </div>
              
              {/* Brand Name */}
              <div className="flex flex-col">
                <h1 className="pixelated-brand leading-tight">
                  Code<span className="text-green-400">Seekho</span>
                  <span className="text-green-400 ml-1">™</span>
                </h1>
                <p className="pixelated-small text-gray-400 hidden sm:block mt-1">by Fixers</p>
              </div>
            </div>

            {/* Navigation Links - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-6 ml-8">
              <div className="flex items-center space-x-4 text-sm">
                <div className="group">
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-200 pixelated cursor-pointer">
                    For developers
                  </span>
                  <div className="w-0 group-hover:w-full h-0.5 bg-green-400 transition-all duration-300"></div>
                </div>
                <div className="group">
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-200 pixelated cursor-pointer">
                    For companies
                  </span>
                  <div className="w-0 group-hover:w-full h-0.5 bg-blue-400 transition-all duration-300"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Login Button - Always visible */}
            <button 
            className="hidden sm:block px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200 pixelated font-medium"
            onClick={() => navigate("/signin")}
            >
              Login
            </button>

            {/* Start Playing Button */}
            <button onClick={() => navigate("/games")}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base pixelated relative overflow-hidden group transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10 flex items-center space-x-2">
                <span>▶</span>
                <span className="hidden sm:inline">Start playing</span>
                <span className="sm:hidden">Play</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="lg:hidden w-8 h-8 flex flex-col justify-center items-center space-y-1 cursor-pointer"
            >
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed top-full left-0 right-0 bg-black border-t border-gray-800 transition-all duration-300 z-40 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors duration-200 pixelated py-2">
                For developers
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors duration-200 pixelated py-2">
                For companies
              </a>
            </div>
            
            {/* Mobile Login Button */}
            <div className="pt-4 border-t border-gray-800">
              <button className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-200 pixelated font-medium py-2"  onClick={() => navigate("/signin")}>
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Background overlay when mobile menu is open */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 mt-16"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .pixelated {
          font-family: 'Press Start 2P', 'Courier New', monospace;
          image-rendering: pixelated;
          text-rendering: geometricPrecision;
          letter-spacing: 1px;
        }

        /* Adjust font sizes for better readability with pixelated font */
        .pixelated.text-xl {
          font-size: 12px;
        }
        
        .pixelated.text-2xl {
          font-size: 14px;
        }
        
        .pixelated.text-xs {
          font-size: 8px;
          letter-spacing: 0.5px;
        }
        
        .pixelated.text-sm {
          font-size: 10px;
        }
        
        .pixelated.text-base {
          font-size: 10px;
        }

        /* Smooth hover animations */
        .group:hover .group-hover\\:scale-105 {
          transform: scale(1.05);
        }

        /* Custom gradient animation */
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        /* Better spacing for pixelated font */
        .pixelated-brand {
          font-family: 'Press Start 2P', 'Courier New', monospace;
          font-size: 16px;
          line-height: 1.2;
          letter-spacing: 1px;
        }
        
        .pixelated-small {
          font-family: 'Press Start 2P', 'Courier New', monospace;
          font-size: 6px;
          letter-spacing: 0.5px;
        }
      `}</style>
    </>
  );
};

// Home component with proper top padding to account for fixed navbar
const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-green-900 via-gray-900 to-black min-h-screen pt-40">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pixel-font {
          font-family: 'Press Start 2P', monospace;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
        
        .pixel-border {
          border: 3px solid;
          border-image: 
            linear-gradient(45deg, #00ff88, #0099ff, #ff0099, #ffff00) 1;
          position: relative;
        }
        
        .pixel-border::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(45deg, #00ff88, #0099ff, #ff0099, #ffff00);
          z-index: -1;
          border-radius: inherit;
        }
        
        
        .pixel-shadow {
          box-shadow: 
            8px 8px 0px rgba(0, 255, 136, 0.3),
            16px 16px 0px rgba(0, 153, 255, 0.2),
            24px 24px 0px rgba(255, 0, 153, 0.1);
        }
        
        .retro-card {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(30, 30, 30, 0.9));
          border: 2px solid #00ff88;
          position: relative;
          overflow: hidden;
        }
        
        .retro-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.1), transparent);
          transition: left 0.5s;
        }
        
        .retro-card:hover::before {
          left: 100%;
        }
        
        .pixel-button {
          background: linear-gradient(45deg, #00ff88, #0099ff);
          border: none;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .pixel-button:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 0 #006644,
            0 12px 20px rgba(0, 255, 136, 0.3);
        }
        
        .pixel-button:active {
          transform: translateY(0);
          box-shadow: 
            0 4px 0 #006644,
            0 6px 10px rgba(0, 255, 136, 0.3);
        }
        
        .floating-pixels {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #00ff88;
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .scanlines {
          position: relative;
          overflow: hidden;
        }
        
        .scanlines::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 136, 0.03) 2px,
            rgba(0, 255, 136, 0.03) 4px
          );
          pointer-events: none;
        }
      `}</style>
      
      {/* Floating pixel decorations */}
      <div className="floating-pixels" style={{top: '20%', left: '10%', animationDelay: '0s'}}></div>
      <div className="floating-pixels" style={{top: '60%', right: '15%', animationDelay: '2s'}}></div>
      <div className="floating-pixels" style={{top: '80%', left: '20%', animationDelay: '4s'}}></div>
      <div className="floating-pixels" style={{top: '30%', right: '25%', animationDelay: '1s'}}></div>
      
      <div className="scanlines w-full h-full absolute top-0 left-0 pointer-events-none"></div>
      
      {/* Hero Section */}
      <h1 className="pixel-font text-3xl md:text-5xl font-bold mb-8 glow-text text-green-400 relative z-10">
        Welcome to <span className="text-cyan-400 glow-text">CodeSeekho</span>
      </h1>
      
      <p className="pixel-font text-sm md:text-base max-w-3xl mb-10 text-green-300 leading-relaxed relative z-10">
        Learn programming the fun way! Complete lessons, play coding mini-games, 
        earn badges, and climb the leaderboard — all while mastering the basics.
      </p>
      
  
      <button
        className="pixel-button pixel-font text-black px-8 py-4 text-sm md:text-base font-bold shadow-lg relative z-10"
      >
        &gt; START_LEARNING
      </button>
    

      {/* Features Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full relative z-10">
        <div className="retro-card p-8 rounded-none pixel-shadow transition-all duration-300 hover:transform hover:scale-105">
          <h3 className="pixel-font text-sm md:text-base font-bold mb-4 text-cyan-400 glow-text">
            [INTERACTIVE_LESSONS]
          </h3>
          <p className="pixel-font text-xs md:text-sm text-green-300 leading-relaxed">
            Learn programming concepts through step-by-step tutorials and examples designed for beginners.
          </p>
          <div className="mt-4 w-full h-1 bg-gradient-to-r from-cyan-400 to-green-400"></div>
        </div>
        
        <div className="retro-card p-8 rounded-none pixel-shadow transition-all duration-300 hover:transform hover:scale-105">
          <h3 className="pixel-font text-sm md:text-base font-bold mb-4 text-purple-400 glow-text">
            [QUIZZES_&_BADGES]
          </h3>
          <p className="pixel-font text-xs md:text-sm text-green-300 leading-relaxed">
            Test your knowledge with quick quizzes, earn XP, and unlock badges as you progress.
          </p>
          <div className="mt-4 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400"></div>
        </div>
        
        <div className="retro-card p-8 rounded-none pixel-shadow transition-all duration-300 hover:transform hover:scale-105">
          <h3 className="pixel-font text-sm md:text-base font-bold mb-4 text-yellow-400 glow-text">
            [LEADERBOARDS]
          </h3>
          <p className="pixel-font text-xs md:text-sm text-green-300 leading-relaxed">
            Compete with other learners and track your rank as you become a coding master.
          </p>
          <div className="mt-4 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400"></div>
        </div>
      </div>
      
      {/* Bottom decorative elements */}
      <div className="mt-16 flex space-x-4 text-green-500 pixel-font text-xs relative z-10">
        <span className="opacity-60">{'<'}</span>
        <span className="opacity-80">{'>'}</span>
        <span className="opacity-60">{'/'}</span>
        <span className="opacity-80">{'{'}</span>
        <span className="opacity-60">{'}'}</span>
        <span className="opacity-80">{'['}</span>
        <span className="opacity-60">{']'}</span>
      </div>
    </div>
  );
};

// Main App component
export default function App() {
  return (
    <>
      <CodingNavbar />
      <Home />
    </>
  );
}