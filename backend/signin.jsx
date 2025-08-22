import React, { useState } from 'react';

const PixelatedSignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Create stars background
  const createStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: Math.random() * 3 + 2
      });
    }
    return stars;
  };

  const [stars] = useState(createStars);

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

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      showMessage('Please enter both Player ID and Access Code!');
      return;
    }

    setIsLoading(true);
    showMessage('CONNECTING TO SERVERS...');
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      showMessage(`Welcome back, ${formData.username}! Entering the game world...`);
    }, 2000);
  };

  // Handle social login
  const handleSocialLogin = (platform) => {
    showMessage(`${platform} login initiated!`);
  };

  // Handle other actions
  const handleAction = (action) => {
    const messages = {
      'forgot': 'Password reset sent to your email!',
      'register': 'Registration portal opened!',
      'privacy': 'Privacy policy opened!',
      'terms': 'Terms of service opened!',
      'support': 'Support portal opened!'
    };
    showMessage(messages[action]);
  };

  const containerStyles = {
    fontFamily: 'monospace',
    background: 'linear-gradient(135deg, #18181b, #27272a, #3f3f46, #52525b)',
    backgroundSize: '400% 400%'
  };

  const mainContainerStyles = {
    backgroundColor: '#0f0f23',
    border: '4px solid #00ff88',
    boxShadow: '0 0 20px #00ff88, inset 0 0 20px rgba(0, 255, 136, 0.1)'
  };

  const inputStyles = {
    backgroundColor: '#1a1a3a',
    border: '2px solid #4ecdc4',
    color: '#fff',
    fontFamily: 'monospace'
  };

  const primaryButtonStyles = {
    background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
    color: 'white',
    border: '2px solid #ff6b6b',
    fontFamily: 'monospace'
  };

  const secondaryButtonStyles = {
    background: 'transparent',
    color: '#4ecdc4',
    border: '2px solid #4ecdc4',
    fontFamily: 'monospace'
  };

  const socialButtonStyles = {
    backgroundColor: '#2c2c54',
    color: '#fff',
    border: '2px solid #40407a',
    fontFamily: 'monospace'
  };

  const videoContainerStyles = {
    backgroundColor: '#0a0a0a',
    border: '4px solid #00ff88',
    boxShadow: '0 0 30px #00ff88, inset 0 0 30px rgba(0, 255, 136, 0.1)',
    imageRendering: 'pixelated'
  };

  // Generate pixel grid
  const generatePixelGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const rowElements = [];
      for (let col = 0; col < 30; col++) {
        const randomColor = Math.random() > 0.7 ? '#00ff88' : Math.random() > 0.8 ? '#ff6b6b' : '#1a1a3a';
        rowElements.push(
          <div
            key={col}
            className="w-4 h-4 border border-gray-800 transition-colors duration-1000"
            style={{
              backgroundColor: randomColor,
              imageRendering: 'pixelated'
            }}
          />
        );
      }
      grid.push(
        <div key={row} className="flex">
          {rowElements}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={containerStyles}>
      
      {/* Animated Stars Background */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute w-0.5 h-0.5 bg-white opacity-0 animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`
            }}
          />
        ))}
      </div>

      {/* Message Toast */}
      {message && (
        <div 
          className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 text-xs"
          style={{
            backgroundColor: '#00ff88',
            color: '#0f0f23',
            border: '2px solid #003322',
            fontFamily: 'monospace'
          }}
        >
          {message}
        </div>
      )}

      {/* Left Side - Sign In Modal */}
      <div className="flex-1 flex justify-start items-center pl-8">
        <div className="relative z-20 w-full max-w-md p-10" style={mainContainerStyles}>
        
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 
              className="text-2xl mb-3"
              style={{
                color: '#00ff88',
                textShadow: '2px 2px 0px #003322'
              }}
            >
              PIXELGAME
            </h1>
            <div className="text-xs" style={{ color: '#ff6b6b' }}>
              ENTER THE DIGITAL REALM
            </div>
          </div>

          {/* Sign In Form */}
          <div>
            {/* Username Field */}
            <div className="mb-6">
              <label 
                className="block text-xs mb-2"
                style={{ color: '#00ff88', textShadow: '1px 1px 0px #003322' }}
              >
                PLAYER ID
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="w-full p-3 text-xs outline-none transition-all duration-300"
                style={inputStyles}
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label 
                className="block text-xs mb-2"
                style={{ color: '#00ff88', textShadow: '1px 1px 0px #003322' }}
              >
                ACCESS CODE
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full p-3 text-xs outline-none transition-all duration-300"
                style={inputStyles}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-5 text-xs">
              <label className="flex items-center cursor-pointer" style={{ color: '#4ecdc4' }}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="w-3 h-3 mr-2"
                />
                REMEMBER ME
              </label>
              <button
                type="button"
                onClick={() => handleAction('forgot')}
                className="bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
                style={{ 
                  color: '#ff6b6b',
                  fontFamily: 'monospace',
                  fontSize: '10px'
                }}
              >
                FORGOT CODE?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full p-4 text-xs uppercase border-none cursor-pointer transition-all duration-200 hover:opacity-90 mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
              style={primaryButtonStyles}
            >
              {isLoading ? 'LOADING...' : 'SIGN IN'}
            </button>

            {/* Divider */}
            <div className="text-center my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div 
                  className="w-full h-0.5" 
                  style={{
                    background: 'linear-gradient(90deg, transparent, #4ecdc4, transparent)'
                  }} 
                />
              </div>
              <span 
                className="relative px-4 text-xs" 
                style={{ backgroundColor: '#0f0f23', color: '#4ecdc4' }}
              >
                OR
              </span>
            </div>

            {/* Social Login Buttons */}
            <div className="flex gap-2 mb-4">
              {['STEAM', 'DISCORD', 'EPIC'].map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handleSocialLogin(platform)}
                  className="flex-1 p-3 text-xs cursor-pointer transition-all duration-200 hover:opacity-80 border-none"
                  style={socialButtonStyles}
                >
                  {platform}
                </button>
              ))}
            </div>

            {/* Create Account Button */}
            <button
              type="button"
              onClick={() => handleAction('register')}
              className="w-full p-4 text-xs uppercase cursor-pointer transition-all duration-200 hover:opacity-80"
              style={secondaryButtonStyles}
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-6">
            {[
              { key: 'privacy', label: 'PRIVACY' },
              { key: 'terms', label: 'TERMS' },
              { key: 'support', label: 'SUPPORT' }
            ].map((link, index) => (
              <React.Fragment key={link.key}>
                <button
                  onClick={() => handleAction(link.key)}
                  className="text-xs mx-2 transition-colors duration-300 bg-transparent border-none cursor-pointer hover:opacity-80"
                  style={{ 
                    color: '#4ecdc4',
                    fontFamily: 'monospace'
                  }}
                >
                  {link.label}
                </button>
                {index < 2 && ' '}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Pixelated Gaming Video */}
      <div className="flex-1 flex justify-center items-center p-8">
        <div className="relative w-full h-full max-w-2xl overflow-hidden" style={videoContainerStyles}>
          {/* Pixelated Video Container */}
          <div className="relative w-full h-full bg-black flex items-center justify-center" style={{ minHeight: '500px' }}>
            {/* Animated Pixel Grid Background */}
            <div className="absolute inset-0 opacity-60">
              {generatePixelGrid()}
            </div>
            
            {/* Game Elements Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div 
                className="text-4xl mb-4 animate-bounce"
                style={{ 
                  color: '#00ff88', 
                  fontFamily: 'monospace',
                  textShadow: '2px 2px 0px #003322'
                }}
              >
                ▲
              </div>
              <div 
                className="text-lg mb-2"
                style={{ 
                  color: '#ff6b6b', 
                  fontFamily: 'monospace',
                  textShadow: '1px 1px 0px #330000'
                }}
              >
                LEVEL 99
              </div>
              <div 
                className="text-sm"
                style={{ 
                  color: '#4ecdc4', 
                  fontFamily: 'monospace'
                }}
              >
                BOSS BATTLE
              </div>
              
              {/* Health Bar */}
              <div className="mt-6 w-64 h-4 bg-gray-800 border-2 border-white relative">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-1000 animate-pulse"
                  style={{ width: '75%' }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-mono">
                  HP: 750/1000
                </div>
              </div>
              
              {/* Score Counter */}
              <div 
                className="mt-4 text-2xl animate-pulse"
                style={{ 
                  color: '#ffff00', 
                  fontFamily: 'monospace',
                  textShadow: '2px 2px 0px #333300'
                }}
              >
                SCORE: 1,337,420
              </div>
            </div>
            
            {/* Moving Game Objects */}
            <div className="absolute top-10 left-10 w-8 h-8 bg-blue-500 animate-ping" style={{ imageRendering: 'pixelated' }} />
            <div className="absolute bottom-20 right-20 w-6 h-6 bg-red-500 animate-spin" style={{ imageRendering: 'pixelated' }} />
            <div className="absolute top-1/2 left-20 w-4 h-16 bg-green-500 animate-bounce" style={{ imageRendering: 'pixelated' }} />
            
            {/* Particle Effects */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  imageRendering: 'pixelated'
                }}
              />
            ))}
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div 
                className="text-xs"
                style={{ 
                  color: '#4ecdc4', 
                  fontFamily: 'monospace'
                }}
              >
                GAMEPLAY PREVIEW
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <div 
                  className="text-xs"
                  style={{ 
                    color: '#ff6b6b', 
                    fontFamily: 'monospace'
                  }}
                >
                  LIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelatedSignIn;