import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth,db } from '../src/firebase';
import { use } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const PixelatedSignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleAction = (action) => {
    if (action === "login") {
      navigate("/login"); // 👈 Navigate to login page
    }
  };

  // Show message function
  const showMessage = (msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  const navigate= useNavigate();

  // Handle signup
const handleSignup = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setIsLoading(true);

  if (!formData.username || !formData.password) {
    showMessage("Please enter both Player ID and Access Code!");
    setIsLoading(false);
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.username,
      formData.password
    );

    const user = userCredential.user;

// Replace the user document creation with this updated structure
await setDoc(doc(db, "users", user.uid), {
  username: formData.email || 'Anonymous',
  email: formData.email || '',
  createdAt: serverTimestamp(),
  lastUpdated: serverTimestamp(),
  
  // General progression
  level: 1,
  xp: 0,
  badges: 0,
  rank: "Beginner",
  
  // Skills Path progress - FIXED STRUCTURE
  skillsPath: {
    javascript: { 
      completedNodes: [], 
      currentXP: 0, 
      lastPlayed: null 
    },
    python: { 
      completedNodes: [], 
      currentXP: 0, 
      lastPlayed: null 
    },
    html: { 
      completedNodes: [], 
      currentXP: 0, 
      lastPlayed: null 
    },
    react: { 
      completedNodes: [], 
      currentXP: 0, 
      lastPlayed: null 
    },
    algorithms: { 
      completedNodes: [], 
      currentXP: 0, 
      lastPlayed: null 
    },
    databases: { 
      completedNodes: [], 
      currentXP: 0, 
      lastPlayed: null 
    }
  },
  
  // Points Game achievements
  pointsGame: {
    totalPoints: 0,
    highScore: 0,
    gamesPlayed: 0,
    goalsCompleted: [],
    lastPlayed: null,
    streak: 0,
    bestStreak: 0,
    achievements: {
      firstGame: false,
      scorer: false,
      sharpshooter: false,
      marathon: false,
      dedicated: false,
      champion: false,
      legend: false,
      streakMaster: false,
      perfectionist: false
    },
    statistics: {
      averageScore: 0,
      totalTimePlayed: 0,
      favoriteGameMode: null
    }
  },
  
  // Code Battles achievements
  codeBattles: {
    // JavaScript badges
    jsbadge1: false, jsbadge2: false, jsbadge3: false, jsbadge4: false, jsbadge5: false,
    // Python badges  
    pythonbadge1: false, pythonbadge2: false, pythonbadge3: false, pythonbadge4: false, pythonbadge5: false,
    // HTML/CSS badges
    htmlbadge1: false, htmlbadge2: false, htmlbadge3: false, htmlbadge4: false, htmlbadge5: false,
    // React badges
    reactbadge1: false, reactbadge2: false, reactbadge3: false, reactbadge4: false, reactbadge5: false,
    // Algorithm badges
    algobadge1: false, algobadge2: false, algobadge3: false, algobadge4: false, algobadge5: false,
    // Database badges
    dbbadge1: false, dbbadge2: false, dbbadge3: false, dbbadge4: false, dbbadge5: false,
    
    // Overall stats
    totalBattlesWon: 0,
    totalBattlesPlayed: 0,
    winRate: 0,
    lastPlayed: null
  },
  
  // Story Quest progress
  storyQuest: {
    currentChapter: 0,
    completedChapters: [],
    lastPlayed: null,
    choicesMade: {},
    unlockedFeatures: []
  }
});

    setSuccess("Signup successful!");
    showMessage(`Welcome, ${formData.username}! Entering the game world...`);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/games");
    }, 1500);

  } catch (err) {
    setIsLoading(false);
    setError(err.message);
    showMessage("Signup failed. Please try again.");
  }
};

  // Handle other actions
  // const handleAction = (action) => {
  //   switch(action) {
  //     case 'login':
  //       showMessage('Switching to login...');
  //       break;
  //     case 'forgot':
  //       showMessage('Password reset link sent to your email!');
  //       break;
  //     case 'privacy':
  //       showMessage('Opening Privacy Policy...');
  //       break;
  //     case 'terms':
  //       showMessage('Opening Terms of Service...');
  //       break;
  //     case 'support':
  //       showMessage('Opening Support Center...');
  //       break;
  //     default:
  //       break;
  //   }
  // };

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

  const containerStyles = {
    fontFamily: 'monospace',
    background: 'linear-gradient(135deg, #18181b, #27272a, #3f3f46, #52525b)',
    backgroundSize: '400% 400%'
  };

  const unifiedContainerStyles = {
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

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-8" style={containerStyles}>
      
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
          className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 text-xs rounded"
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

      {/* Error Message */}
      {error && (
        <div 
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 text-xs rounded"
          style={{
            backgroundColor: '#ff6b6b',
            color: '#fff',
            border: '2px solid #cc0000',
            fontFamily: 'monospace'
          }}
        >
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div 
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 text-xs rounded"
          style={{
            backgroundColor: '#4ecdc4',
            color: '#0f0f23',
            border: '2px solid #339999',
            fontFamily: 'monospace'
          }}
        >
          {success}
        </div>
      )}

      {/* Unified Container with Sign In Modal and Video */}
      <div className="relative z-20 w-full max-w-6xl rounded-lg overflow-hidden" style={unifiedContainerStyles}>
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          
          {/* Left Side - Sign In Modal */}
          <div className="flex-1 p-10 flex items-center">
            <div className="w-full max-w-md mx-auto">
              {/* Logo */}
              <div className="text-center mb-8">
                <h1 
                  className="text-2xl mb-3 font-bold"
                  style={{
                    color: '#00ff88',
                    textShadow: '2px 2px 0px #003322'
                  }}
                >
                  CodeSeekho
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
                    className="block text-xs mb-2 font-bold"
                    style={{ color: '#00ff88', textShadow: '1px 1px 0px #003322' }}
                  >
                    ENTER YOUR MAIL
                  </label>
                  <input
                    type="email"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full p-3 text-xs outline-none transition-all duration-300 rounded"
                    style={inputStyles}
                  />
                </div>

                {/* Password Field */}
                <div className="mb-6">
                  <label 
                    className="block text-xs mb-2 font-bold"
                    style={{ color: '#00ff88', textShadow: '1px 1px 0px #003322' }}
                  >
                    ENTER PASSWORD
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full p-3 text-xs outline-none transition-all duration-300 rounded"
                    style={inputStyles}
                  />
                </div>

                {/* Sign In Button */}
                <button
                  onClick={handleSignup}
                  disabled={isLoading}
                  className="w-full p-4 text-xs uppercase border-none cursor-pointer transition-all duration-200 hover:opacity-90 mb-6 disabled:opacity-70 disabled:cursor-not-allowed rounded font-bold"
                  style={primaryButtonStyles}
                >
                  {isLoading ? 'LOADING...' : 'CREATE ACCOUNT'}
                </button>
              </div>

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
                  className="relative px-4 text-xs font-bold" 
                  style={{ backgroundColor: '#0f0f23', color: '#4ecdc4' }}
                >
                  OR
                </span>
              </div>

              {/* Login Button */}
              <button
                type="button"
                onClick={() => handleAction('login')}
                className="w-full p-4 text-xs uppercase cursor-pointer transition-all duration-200 hover:opacity-80 rounded font-bold"
                style={secondaryButtonStyles}
              >
                LOGIN
              </button>

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
                      className="text-xs mx-2 transition-colors duration-300 bg-transparent border-none cursor-pointer hover:opacity-80 font-bold"
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
          <div className="flex-1 p-8">
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border-2 border-gray-700" style={{ minHeight: '500px' }}>
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
                  className="text-lg mb-2 font-bold"
                  style={{ 
                    color: '#ff6b6b', 
                    fontFamily: 'monospace',
                    textShadow: '1px 1px 0px #330000'
                  }}
                >
                  LEVEL 99
                </div>
                <div 
                  className="text-sm font-bold"
                  style={{ 
                    color: '#4ecdc4', 
                    fontFamily: 'monospace'
                  }}
                >
                  BOSS BATTLE
                </div>
                
                {/* Health Bar */}
                <div className="mt-6 w-64 h-4 bg-gray-800 border-2 border-white relative rounded">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-1000 animate-pulse rounded-sm"
                    style={{ width: '75%' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-mono font-bold">
                    HP: 750/1000
                  </div>
                </div>
                
                {/* Score Counter */}
                <div 
                  className="mt-4 text-2xl animate-pulse font-bold"
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
              <div className="absolute top-10 left-10 w-8 h-8 bg-blue-500 animate-ping rounded" style={{ imageRendering: 'pixelated' }} />
              <div className="absolute bottom-20 right-20 w-6 h-6 bg-red-500 animate-spin rounded" style={{ imageRendering: 'pixelated' }} />
              <div className="absolute top-1/2 left-20 w-4 h-16 bg-green-500 animate-bounce rounded" style={{ imageRendering: 'pixelated' }} />
              
              {/* Particle Effects */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 animate-ping rounded-full"
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
                  className="text-xs font-bold"
                  style={{ 
                    color: '#4ecdc4', 
                    fontFamily: 'monospace'
                  }}
                >
                  GAMEPLAY PREVIEW
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <div 
                    className="text-xs font-bold"
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
    </div>
  );
};

export default PixelatedSignIn;