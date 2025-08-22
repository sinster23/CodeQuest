export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-gradient-to-br from-gray-900 via-gray-900 to-black min-h-screen">
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
        Welcome to <span className="text-cyan-400 glow-text">CodeQuest</span>
      </h1>
      
      <p className="pixel-font text-sm md:text-base max-w-3xl mb-10 text-green-300 leading-relaxed relative z-10">
        Learn programming the fun way! Complete lessons, play coding mini-games, 
        earn badges, and climb the leaderboard — all while mastering the basics.
      </p>
      
      <button className="pixel-button pixel-font text-black px-8 py-4 text-sm md:text-base font-bold shadow-lg relative z-10">
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
}