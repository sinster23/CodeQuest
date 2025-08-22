import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../src/firebase';
import { use } from 'react';
import { useNavigate } from 'react-router-dom';

const PixelatedLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Animated game elements state
  const [gameState, setGameState] = useState({
    playerX: 45,
    playerY: 60,
    enemies: [
      { id: 1, x: 25, y: 35, type: 'cyber', health: 85 },
      { id: 2, x: 75, y: 25, type: 'mech', health: 120 },
      { id: 3, x: 55, y: 80, type: 'ghost', health: 60 }
    ],
    collectibles: [
      { id: 1, x: 35, y: 70, type: 'coin' },
      { id: 2, x: 65, y: 45, type: 'gem' }
    ],
    score: 2847650,
    level: 127,
    health: 88
  });

  // Create stars background
  const createStars = () => {
    const stars = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        duration: Math.random() * 4 + 2
      });
    }
    return stars;
  };

  const [stars] = useState(createStars);

  // Game animation loop
  React.useEffect(() => {
    const gameInterval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        playerX: Math.max(5, Math.min(95, prev.playerX + (Math.random() - 0.5) * 8)),
        playerY: Math.max(5, Math.min(95, prev.playerY + (Math.random() - 0.5) * 8)),
        score: prev.score + Math.floor(Math.random() * 250),
        enemies: prev.enemies.map(enemy => ({
          ...enemy,
          x: Math.max(5, Math.min(95, enemy.x + (Math.random() - 0.5) * 4)),
          y: Math.max(5, Math.min(95, enemy.y + (Math.random() - 0.5) * 4)),
          health: Math.max(0, enemy.health - Math.floor(Math.random() * 5))
        }))
      }));
    }, 300);

    return () => clearInterval(gameInterval);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Show message function
  const showMessage = (msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  // Validate email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    if (!formData.email || !formData.password) {
      showMessage('Please enter both Player ID and Access Code!');
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
       setSuccess("Signup successful!");
      showMessage(`Welcome, ${formData.email}! Entering the game world...`);

      // navigate after a short delay so user can see the message
      setTimeout(() => {
        setIsLoading(false);
        navigate("/games"); 
      }, 1500);
    } 
     catch (err) {
      setIsLoading(false);
      setError(err.message);
      showMessage('Sign in failed. Please check your credentials.');
    }
  };

  // Styles
  const containerStyles = {
    fontFamily: 'monospace',
    background: 'linear-gradient(135deg, #0f0f23, #1a1a3a, #2d1b69, #1a1a3a)',
    backgroundSize: '400% 400%'
  };

  const mainContainerStyles = {
    backgroundColor: '#0a0a1f',
    border: '4px solid #00ff88',
    boxShadow: '0 0 25px #00ff88, inset 0 0 25px rgba(0, 255, 136, 0.15)'
  };

  const inputStyles = {
    backgroundColor: '#1a1a40',
    border: '2px solid #4ecdc4',
    color: '#fff',
    fontFamily: 'monospace'
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={containerStyles}>
      
      {/* Enhanced Stars Background */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute bg-white opacity-0 animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: Math.random() > 0.5 ? '2px' : '1px',
              height: Math.random() > 0.5 ? '2px' : '1px'
            }}
          />
        ))}
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-cyan-400 animate-ping opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Message Toast */}
      {message && (
        <div 
          className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 text-xs"
          style={{
            backgroundColor: '#00ff88',
            color: '#0f0f23',
            border: '3px solid #003322',
            fontFamily: 'monospace',
            boxShadow: '0 0 15px #00ff88'
          }}
        >
          {message}
        </div>
      )}

      {/* Main Container - Login Form and Gaming Environment */}
      <div className="flex justify-center items-center min-h-screen w-full p-8">
        <div className="relative z-20 w-full max-w-7xl flex" style={mainContainerStyles}>
          
          {/* Left Side - Login Form */}
          <div className="w-1/3 p-12">
            {/* Logo */}
            <div className="text-center mb-10">
              <h1 
                className="text-3xl mb-4 animate-pulse"
                style={{
                  color: '#00ff88',
                  textShadow: '3px 3px 0px #003322'
                }}
              >
                Code_Seekho
              </h1>
              <div className="text-sm" style={{ color: '#ff6b6b' }}>
                SECURE ACCESS TERMINAL
              </div>
            </div>

            {/* Login Form */}
            <div>
              {/* Email Field */}
              {/* Email Field */}
<div className="mb-6">
  <label 
    className="block text-sm mb-2"
    style={{ color: '#00ff88', textShadow: '1px 1px 0px #003322' }}
  >
    EMAIL ADDRESS
  </label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleInputChange}
    placeholder="commander@pixelnexus.com"
    className="w-full p-3 text-sm outline-none transition-all duration-300"
    style={inputStyles}
  />
</div>

{/* Password Field */}
<div className="mb-6">
  <label 
    className="block text-sm mb-2"
    style={{ color: '#00ff88', textShadow: '1px 1px 0px #003322' }}
  >
    ACCESS PASSWORD
  </label>
  <input
    type="password"
    name="password"
    value={formData.password}
    onChange={handleInputChange}
    placeholder="Enter secure password"
    className="w-full p-3 text-sm outline-none transition-all duration-300"
    style={inputStyles}
  />
</div>


              {/* Login Button */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full p-4 text-sm uppercase border-none cursor-pointer transition-all duration-200 hover:opacity-90 mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                  color: 'white',
                  border: '2px solid #ff6b6b',
                  fontFamily: 'monospace'
                }}
              >
                {isLoading ? 'AUTHENTICATING...' : 'Log in'}
              </button>
            </div>

    
          </div>

          {/* Right Side - Gaming Environment within same container */}
          <div className="w-2/3 p-8">
            <div className="relative w-full h-full overflow-hidden" style={{
              backgroundColor: '#000011',
              border: '2px solid #ff6b6b',
              boxShadow: '0 0 20px rgba(255, 107, 107, 0.3), inset 0 0 20px rgba(255, 107, 107, 0.1)',
              imageRendering: 'pixelated',
              minHeight: '650px'
            }}>
              <div className="relative w-full bg-black flex items-center justify-center" style={{ height: '100%', minHeight: '650px', imageRendering: 'pixelated' }}>
            
                {/* Dynamic Background Grid */}
                <div className="absolute inset-0 opacity-25">
                  <div className="grid grid-cols-32 grid-rows-24 w-full h-full">
                    {Array.from({ length: 32 * 24 }).map((_, index) => {
                      const pulse = Math.sin(Date.now() * 0.002 + index * 0.15) * 0.5 + 0.5;
                      return (
                        <div
                          key={index}
                          className="border-gray-700 transition-all duration-700"
                          style={{
                            backgroundColor: pulse > 0.85 ? '#ff6b6b' : pulse > 0.7 ? '#00ff88' : pulse > 0.5 ? '#4ecdc4' : '#0a0a1f',
                            borderWidth: '0.5px',
                            opacity: pulse * 0.8
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Game World */}
                <div className="absolute inset-0 overflow-hidden">
                  
                  {/* Player Avatar */}
                  <div
                    className="absolute w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 transition-all duration-300 z-20 flex items-center justify-center"
                    style={{
                      left: `${gameState.playerX}%`,
                      top: `${gameState.playerY}%`,
                      imageRendering: 'pixelated',
                      boxShadow: '0 0 15px #06b6d4',
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      transform: 'rotate(0deg)'
                    }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                  </div>
                  
                  {/* Enhanced Enemies */}
                  {gameState.enemies.map(enemy => (
                    <div key={enemy.id} className="absolute z-15">
                      <div
                        className={`w-8 h-8 transition-all duration-400 relative ${
                          enemy.type === 'cyber' ? 'bg-gradient-to-br from-red-500 to-red-700' :
                          enemy.type === 'mech' ? 'bg-gradient-to-br from-gray-400 to-gray-600' : 
                          'bg-gradient-to-br from-purple-500 to-purple-700'
                        }`}
                        style={{
                          left: `${enemy.x}%`,
                          top: `${enemy.y}%`,
                          imageRendering: 'pixelated',
                          boxShadow: `0 0 12px ${
                            enemy.type === 'cyber' ? '#ef4444' :
                            enemy.type === 'mech' ? '#9ca3af' : '#a855f7'
                          }`,
                          clipPath: enemy.type === 'ghost' ? 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 100%, 50% 75%, 25% 100%, 0% 75%)' : 'none'
                        }}
                      >
                        {/* Enemy core */}
                        <div className="absolute inset-2 bg-white rounded-full animate-pulse opacity-60" />
                      </div>
                      {/* Enhanced Health Bar */}
                      <div className="absolute -top-4 left-0 w-8 h-2 bg-gray-800 border border-gray-600">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            enemy.health > 70 ? 'bg-green-400' :
                            enemy.health > 30 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${Math.max(0, enemy.health)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {/* Enhanced Collectibles */}
                  {gameState.collectibles.map(item => (
                    <div
                      key={item.id}
                      className={`absolute w-6 h-6 animate-bounce ${
                        item.type === 'coin' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 
                        'bg-gradient-to-br from-purple-400 to-purple-600'
                      }`}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        imageRendering: 'pixelated',
                        boxShadow: `0 0 10px ${item.type === 'coin' ? '#facc15' : '#a855f7'}`,
                        borderRadius: item.type === 'gem' ? '50%' : '0%'
                      }}
                    >
                      <div className="absolute inset-1 bg-white opacity-50 animate-pulse" />
                    </div>
                  ))}
                  
                  {/* Enhanced Combat Effects */}
                  <div className="absolute top-1/3 left-1/5 w-2 h-24 bg-gradient-to-t from-cyan-400 to-cyan-200 animate-pulse opacity-90" style={{ imageRendering: 'pixelated' }} />
                  <div className="absolute top-2/3 right-1/4 w-20 h-2 bg-gradient-to-r from-red-400 to-red-200 animate-pulse opacity-90" style={{ imageRendering: 'pixelated' }} />
                  
                  {/* Multiple Explosions */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-ping"
                      style={{
                        left: `${15 + i * 20}%`,
                        top: `${25 + i * 15}%`,
                        animationDelay: `${i * 0.4}s`
                      }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 opacity-80" style={{ imageRendering: 'pixelated' }} />
                      <div className="absolute inset-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400" style={{ imageRendering: 'pixelated' }} />
                      <div className="absolute inset-3 w-4 h-4 bg-white animate-pulse" style={{ imageRendering: 'pixelated' }} />
                    </div>
                  ))}
                </div>

                {/* Enhanced Gaming HUD */}
                <div className="absolute inset-0 pointer-events-none z-30">
                  
                  {/* Advanced Top HUD */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    {/* Enhanced Player Panel */}
                    <div className="bg-black bg-opacity-90 p-3 border-2 border-cyan-400">
                      <div className="text-xs mb-2 animate-pulse" style={{ color: '#00ff88', fontFamily: 'monospace' }}>
                        COMMANDER: NEXUS_PRIME
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-red-400" style={{ fontFamily: 'monospace' }}>SHIELD:</span>
                        <div className="w-16 h-2 bg-gray-800 border border-gray-500">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 transition-all duration-500 animate-pulse"
                            style={{ width: `${gameState.health}%` }}
                          />
                        </div>
                        <span className="text-xs text-white" style={{ fontFamily: 'monospace' }}>
                          {gameState.health}/100
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-400" style={{ fontFamily: 'monospace' }}>ENERGY:</span>
                        <div className="w-16 h-2 bg-gray-800 border border-gray-500">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-5/6 transition-all duration-500" />
                        </div>
                        <span className="text-xs text-white" style={{ fontFamily: 'monospace' }}>8750</span>
                      </div>
                    </div>

                    {/* Enhanced Mission Panel */}
                    <div className="bg-black bg-opacity-90 p-3 border-2 border-yellow-400">
                      <div className="text-xs mb-1 animate-pulse" style={{ color: '#facc15', fontFamily: 'monospace' }}>
                        OPERATION: CYBER_STORM
                      </div>
                      <div className="text-xs mb-1" style={{ color: '#4ecdc4', fontFamily: 'monospace' }}>
                        STATUS: HOSTILE ZONE
                      </div>
                      <div className="text-xs mb-1" style={{ color: '#ff6b6b', fontFamily: 'monospace' }}>
                        TARGETS: 7/12 ELIMINATED
                      </div>
                      <div className="text-xs animate-pulse" style={{ color: '#00ff88', fontFamily: 'monospace' }}>
                        TIME: 04:23:17
                      </div>
                    </div>
                  </div>

                  {/* Combat Indicators */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="animate-bounce text-2xl font-bold mb-2" style={{ color: '#ff6b6b', fontFamily: 'monospace', textShadow: '3px 3px 0px #000' }}>
                      MULTI-KILL!
                    </div>
                    <div className="animate-pulse text-lg" style={{ color: '#ffff00', fontFamily: 'monospace', textShadow: '2px 2px 0px #000' }}>
                      +5000 BONUS
                    </div>
                    <div className="text-base mt-2 animate-pulse" style={{ color: '#00ff88', fontFamily: 'monospace', textShadow: '1px 1px 0px #000' }}>
                      COMBO x7
                    </div>
                  </div>

                  {/* Enhanced Bottom HUD */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    {/* Advanced Weapon Panel */}
                    <div className="bg-black bg-opacity-90 p-3 border-2 border-green-400">
                      <div className="text-xs mb-2 animate-pulse" style={{ color: '#00ff88', fontFamily: 'monospace' }}>
                        QUANTUM DESTROYER X-99
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-yellow-400" style={{ fontFamily: 'monospace' }}>PLASMA:</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-3 ${i < 9 ? 'bg-gradient-to-t from-yellow-600 to-yellow-400' : 'bg-gray-700'} border border-gray-500`}
                              style={{ imageRendering: 'pixelated' }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-white" style={{ fontFamily: 'monospace' }}>90/120</span>
                      </div>
                      <div className="text-xs" style={{ color: '#cyan-400', fontFamily: 'monospace' }}>
                        HEAT: 67% • READY
                      </div>
                    </div>

                    {/* Enhanced Score Panel */}
                    <div className="bg-black bg-opacity-90 p-3 border-2 border-purple-400 text-right">
                      <div className="text-xl mb-1 animate-pulse" style={{ color: '#a855f7', fontFamily: 'monospace' }}>
                        LVL {gameState.level}
                      </div>
                      <div className="text-lg mb-1" style={{ color: '#ffff00', fontFamily: 'monospace' }}>
                        {gameState.score.toLocaleString()}
                      </div>
                      <div className="text-xs mb-1" style={{ color: '#4ecdc4', fontFamily: 'monospace' }}>
                        GALACTIC RECORD
                      </div>
                      <div className="text-xs" style={{ color: '#ff6b6b', fontFamily: 'monospace' }}>
                        RANK: #003
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Live Indicator */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black bg-opacity-90 px-4 py-2 border border-red-500">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs animate-pulse" style={{ color: '#ff6b6b', fontFamily: 'monospace' }}>
                      LIVE STREAM • 2,847 VIEWERS
                    </span>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping opacity-60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelatedLogin;