import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sword, 
  BookOpen, 
  Star, 
  Zap, 
  Target, 
  Users, 
  Crown, 
  ChevronRight,
  Play,
  Lock,
  Medal,
  Flag,
  Gamepad2,
  Timer,
  Code,
  Calendar,
  Flame,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../src/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const GamesPage = () => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    rank: 'Beginner',
    badges: 0,
    username: '',
    // Daily streak data
    dailyStreak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      streakHistory: [] // Array of dates when user was active
    },
    achievements: {
      pointsGame: {
        totalPoints: 0,
        goalsCompleted: [],
        lastPlayed: null,
        streak: 0,
        bestStreak: 0
      },
      codeBattles: {
        jsbadge1: false,
        jsbadge2: false,
        jsbadge3: false,
        jsbadge4: false,
        jsbadge5: false,
        pythonbadge1: false,
        pythonbadge2: false,
        pythonbadge3: false,
        pythonbadge4: false,
        pythonbadge5: false,
        htmlbadge1: false,
        htmlbadge2: false,
        htmlbadge3: false,
        htmlbadge4: false,
        htmlbadge5: false,
        reactbadge1: false,
        reactbadge2: false,
        reactbadge3: false,
        reactbadge4: false,
        reactbadge5: false,
        algobadge1: false,
        algobadge2: false,
        algobadge3: false,
        algobadge4: false,
        algobadge5: false,
        dbbadge1: false,
        dbbadge2: false,
        dbbadge3: false,
        dbbadge4: false,
        dbbadge5: false,
        totalBattlesWon: 0,
        totalBattlesPlayed: 0,
        lastPlayed: null
      },
      storyQuest: {
        currentChapter: 0,
        completedChapters: [],
        lastPlayed: null
      }
    },
    skillsPath: {
      javascript: { completedNodes: [], currentXP: 0, lastPlayed: null },
      python: { completedNodes: [], currentXP: 0, lastPlayed: null },
      html: { completedNodes: [], currentXP: 0, lastPlayed: null },
      react: { completedNodes: [], currentXP: 0, lastPlayed: null },
      algorithms: { completedNodes: [], currentXP: 0, lastPlayed: null },
      databases: { completedNodes: [], currentXP: 0, lastPlayed: null }
    }
  });
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  const navigate = useNavigate();

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

  // Utility function to get today's date string
  const getTodayDateString = () => {
    return new Date().toDateString();
  };

  // Utility function to get yesterday's date string
  const getYesterdayDateString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString();
  };

  // Function to calculate streak based on activity dates
  const calculateStreak = (streakHistory, lastActiveDate) => {
    if (!streakHistory || streakHistory.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Sort dates in descending order
    const sortedDates = streakHistory.sort((a, b) => new Date(b) - new Date(a));
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak
    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
      let expectedDate = new Date(sortedDates[0]);
      
      for (let i = 0; i < sortedDates.length; i++) {
        if (sortedDates[i] === expectedDate.toDateString()) {
          currentStreak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const currentDate = new Date(sortedDates[i]);
        const previousDate = new Date(sortedDates[i - 1]);
        const dayDifference = (previousDate - currentDate) / (1000 * 60 * 60 * 24);
        
        if (dayDifference === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  };

  // Function to update daily streak when user completes any activity
  const updateDailyStreak = async () => {
    if (!user) return;

    const today = getTodayDateString();
    const userDocRef = doc(db, 'users', user.uid);

    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentStreakHistory = userData.dailyStreak?.streakHistory || [];
        
        // Check if user was already active today
        if (!currentStreakHistory.includes(today)) {
          const updatedStreakHistory = [...currentStreakHistory, today];
          const { currentStreak, longestStreak } = calculateStreak(updatedStreakHistory, today);

          // Update user document
          await updateDoc(userDocRef, {
            'dailyStreak.streakHistory': updatedStreakHistory,
            'dailyStreak.currentStreak': currentStreak,
            'dailyStreak.longestStreak': Math.max(longestStreak, userData.dailyStreak?.longestStreak || 0),
            'dailyStreak.lastActiveDate': today,
            lastUpdated: serverTimestamp()
          });

          // Update local state
          setUserStats(prevStats => ({
            ...prevStats,
            dailyStreak: {
              ...prevStats.dailyStreak,
              streakHistory: updatedStreakHistory,
              currentStreak: currentStreak,
              longestStreak: Math.max(longestStreak, prevStats.dailyStreak?.longestStreak || 0),
              lastActiveDate: today
            }
          }));
        }
      }
    } catch (error) {
      console.error('Error updating daily streak:', error);
    }
  };

  // Fetch user data from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Initialize dailyStreak if it doesn't exist
          if (!userData.dailyStreak) {
            userData.dailyStreak = {
              currentStreak: 0,
              longestStreak: 0,
              lastActiveDate: null,
              streakHistory: []
            };
          }

          // Recalculate streak based on history
          const { currentStreak, longestStreak } = calculateStreak(
            userData.dailyStreak.streakHistory || [], 
            userData.dailyStreak.lastActiveDate
          );

          userData.dailyStreak.currentStreak = currentStreak;
          userData.dailyStreak.longestStreak = Math.max(longestStreak, userData.dailyStreak.longestStreak || 0);

          setUserStats(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Calculate badge count from achievements
  const calculateBadgeCount = (achievements) => {
    let badgeCount = 0;
    if (achievements?.codeBattles) {
      Object.entries(achievements.codeBattles).forEach(([key, value]) => {
        if (key.includes('badge') && value === true) badgeCount++;
      });
    }
    return badgeCount;
  };

  // Calculate completed goals count
  const getCompletedGoalsCount = () => {
    return userStats.achievements?.pointsGame?.goalsCompleted?.length || 0;
  };

  // Calculate story progress percentage
  const getStoryProgress = () => {
    const completedChapters = userStats.achievements?.storyQuest?.completedChapters?.length || 0;
    const totalChapters = 15;
    return Math.round((completedChapters / totalChapters) * 100);
  };

  // Calculate current rank based on badges
  const getCurrentRank = () => {
    const badgeCount = calculateBadgeCount(userStats.achievements);
    if (badgeCount >= 15) return 'Gold';
    if (badgeCount >= 8) return 'Silver';
    if (badgeCount >= 3) return 'Bronze';
    return 'Beginner';
  };

  // Generate last 7 days for streak display
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push({
        date: date.toDateString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isActive: userStats.dailyStreak?.streakHistory?.includes(date.toDateString()) || false,
        isToday: date.toDateString() === getTodayDateString()
      });
    }
    
    return days;
  };

  const gameStats = {
    pointBased: {
      completedGoals: getCompletedGoalsCount(),
      totalPoints: userStats.achievements?.pointsGame?.totalPoints || 0,
      currentGoal: "Master JavaScript Loops",
      nextReward: "500 XP + Badge"
    },
    pvp: {
      currentRank: getCurrentRank(),
      totalBadges: calculateBadgeCount(userStats.achievements),
      jsBadges: Object.entries(userStats.achievements?.codeBattles || {}).filter(([key, value]) => key.startsWith('js') && value).length,
      pythonBadges: Object.entries(userStats.achievements?.codeBattles || {}).filter(([key, value]) => key.startsWith('python') && value).length
    },
    storyQuest: {
      currentChapter: `Chapter ${userStats.achievements?.storyQuest?.currentChapter || 0}: The Beginning`,
      progress: getStoryProgress(),
      unlockedChapters: userStats.achievements?.storyQuest?.completedChapters?.length || 0,
      totalChapters: 15
    }
  };

  const GameModeCard = ({ 
    title, 
    description, 
    icon: Icon, 
    color, 
    stats, 
    difficulty, 
    isLocked = false,
    onClick 
  }) => (
    <div 
      className={`relative bg-gradient-to-br ${color} p-8 rounded-none border-4 border-white/20 
        hover:border-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer
        ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-2xl'}
        retro-card pixel-shadow`}
      onClick={!isLocked ? () => { onClick(); updateDailyStreak(); } : undefined}
    >
      {/* Floating pixels decoration */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 floating-pixel" style={{animationDelay: '0s'}}></div>
      <div className="absolute top-8 right-8 w-1 h-1 bg-white/40 floating-pixel" style={{animationDelay: '1s'}}></div>
      
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="text-center">
            <Lock className="w-12 h-12 text-white/60 mx-auto mb-2" />
            <div className="pixel-font text-xs text-white/80">LOCKED</div>
            <div className="pixel-font text-xs text-white/60 mt-1">Reach Level 10</div>
          </div>
        </div>
      )}
      
      <div className="relative z-20">
        <div className="flex items-center justify-between mb-6">
          <Icon className="w-12 h-12 text-white drop-shadow-lg" />
          <div className="text-right">
            <div className="pixel-font text-xs text-white/80 mb-1">{difficulty}</div>
            <div className="flex space-x-1">
              {[1,2,3,4,5].map(i => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i <= (difficulty === 'BEGINNER' ? 2 : difficulty === 'INTERMEDIATE' ? 3 : 5) ? 'text-yellow-300' : 'text-white/30'}`} 
                  fill="currentColor" 
                />
              ))}
            </div>
          </div>
        </div>
        
        <h3 className="pixel-font text-xl font-bold text-white mb-4 leading-tight">
          {title}
        </h3>
        
        <p className="pixel-font text-sm text-white/90 leading-relaxed mb-6">
          {description}
        </p>
        
        {/* Stats */}
        <div className="space-y-3 mb-6">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="pixel-font text-xs text-white/70 capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
              </span>
              <span className="pixel-font text-xs text-white font-bold">{value}</span>
            </div>
          ))}
        </div>
        
        {!isLocked && (
          <div className="flex items-center justify-between">
            <div className="pixel-font text-xs text-white/80">
              ▶ READY TO PLAY
            </div>
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );

  const QuickStatsCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-gradient-to-br ${color} p-4 rounded-none border-2 border-white/30 text-center hover:border-white/50 transition-all duration-300`}>
      <Icon className="w-8 h-8 text-white mx-auto mb-2" />
      <div className="pixel-font text-lg font-bold text-white mb-1">{value}</div>
      <div className="pixel-font text-xs text-white/80">{label}</div>
    </div>
  );

  // Daily Streak Component
  const DailyStreakSection = () => {
    const last7Days = getLast7Days();
    const currentStreak = userStats.dailyStreak?.currentStreak || 0;
    const longestStreak = userStats.dailyStreak?.longestStreak || 0;
    const todayCompleted = last7Days.find(day => day.isToday)?.isActive || false;

    return (
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-none border-4 border-orange-400/50 retro-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Flame className="w-8 h-8 text-orange-400" />
            <h2 className="pixel-font text-2xl font-bold text-orange-400 glow-text">
              DAILY STREAK
            </h2>
          </div>
          <div className="text-right">
            <div className="pixel-font text-lg font-bold text-white">
              {currentStreak} DAY{currentStreak !== 1 ? 'S' : ''}
            </div>
            <div className="pixel-font text-xs text-gray-400">
              Best: {longestStreak} days
            </div>
          </div>
        </div>

        {/* Today's Status */}
        <div className="mb-6">
          <div className={`flex items-center space-x-3 p-4 border-2 ${todayCompleted ? 'border-green-400 bg-green-900/30' : 'border-orange-400 bg-orange-900/30'}`}>
            {todayCompleted ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <div className="pixel-font text-sm font-bold text-green-400">TODAY COMPLETED!</div>
                  <div className="pixel-font text-xs text-green-300">Great job! Your streak continues.</div>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-orange-400" />
                <div>
                  <div className="pixel-font text-sm font-bold text-orange-400">COMPLETE TODAY'S CHALLENGE</div>
                  <div className="pixel-font text-xs text-orange-300">Play any game mode to maintain your streak!</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 7-Day Calendar */}
        <div className="mb-6">
          <div className="pixel-font text-sm font-bold text-white mb-3">LAST 7 DAYS</div>
          <div className="grid grid-cols-7 gap-2">
            {last7Days.map((day, index) => (
              <div key={index} className="text-center">
                <div className="pixel-font text-xs text-gray-400 mb-1">
                  {day.dayName}
                </div>
                <div 
                  className={`w-12 h-12 border-2 flex items-center justify-center ${
                    day.isActive 
                      ? 'border-green-400 bg-green-900/50 text-green-400' 
                      : day.isToday 
                        ? 'border-orange-400 bg-orange-900/50 text-orange-400'
                        : 'border-gray-600 bg-gray-800/50 text-gray-500'
                  }`}
                >
                  {day.isActive ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <div className="pixel-font text-xs">{day.dayNumber}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Milestones */}
        <div>
          <div className="pixel-font text-sm font-bold text-white mb-3">STREAK MILESTONES</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { days: 7, reward: 'Bronze Badge', achieved: currentStreak >= 7 },
              { days: 14, reward: 'Silver Badge', achieved: currentStreak >= 14 },
              { days: 30, reward: 'Gold Badge', achieved: currentStreak >= 30 },
              { days: 100, reward: 'Legend Status', achieved: currentStreak >= 100 }
            ].map((milestone, index) => (
              <div 
                key={index}
                className={`p-3 border-2 text-center ${
                  milestone.achieved 
                    ? 'border-green-400 bg-green-900/30' 
                    : 'border-gray-600 bg-gray-800/30'
                }`}
              >
                <div className={`pixel-font text-sm font-bold ${milestone.achieved ? 'text-green-400' : 'text-gray-400'}`}>
                  {milestone.days}
                </div>
                <div className={`pixel-font text-xs ${milestone.achieved ? 'text-green-300' : 'text-gray-500'}`}>
                  {milestone.reward}
                </div>
                {milestone.achieved && (
                  <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="pixel-font text-xl text-green-400 mb-4">LOADING...</div>
          <div className="w-16 h-2 bg-gray-700 mx-auto">
            <div className="h-full bg-gradient-to-r from-green-400 to-blue-400 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Custom Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pixel-font {
          font-family: 'Press Start 2P', monospace;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
        
        .retro-card {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(30, 30, 30, 0.9));
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
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s;
        }
        
        .retro-card:hover::before {
          left: 100%;
        }
        
        .pixel-shadow {
          box-shadow: 
            8px 8px 0px rgba(0, 255, 136, 0.3),
            16px 16px 0px rgba(0, 153, 255, 0.2),
            24px 24px 0px rgba(255, 0, 153, 0.1);
        }
        
        .floating-pixel {
          animation: floatPixel 3s ease-in-out infinite;
        }
        
        @keyframes floatPixel {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
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
        
        .progress-bar {
          background: linear-gradient(90deg, #00ff88, #0099ff);
          height: 8px;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Floating pixel decorations */}
      <div className="floating-pixel absolute w-3 h-3 bg-green-400" style={{top: '15%', left: '8%', animationDelay: '0s'}}></div>
      <div className="floating-pixel absolute w-2 h-2 bg-blue-400" style={{top: '70%', right: '12%', animationDelay: '2s'}}></div>
      <div className="floating-pixel absolute w-2 h-2 bg-purple-400" style={{top: '85%', left: '15%', animationDelay: '4s'}}></div>
      <div className="floating-pixel absolute w-1 h-1 bg-yellow-400" style={{top: '25%', right: '20%', animationDelay: '1s'}}></div>
      
      <div className="scanlines w-full h-full absolute top-0 left-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="pixel-font text-4xl md:text-6xl font-bold mb-6 glow-text text-green-400">
            Game <span className="text-cyan-400">Arena</span>
          </h1>
          <p className="pixel-font text-sm md:text-base max-w-3xl mx-auto text-green-300 leading-relaxed mb-2">
            Welcome back, <span className="text-cyan-400">{userStats.username || 'Coder'}</span>!
          </p>
          <p className="pixel-font text-sm md:text-base max-w-3xl mx-auto text-green-300 leading-relaxed mb-8">
            Choose your battle! Master coding through epic quests, compete against others, 
            or follow structured learning paths to become a coding legend.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <QuickStatsCard 
              icon={Medal} 
              label="Current Level" 
              value={`LV.${userStats.level}`} 
              color="from-purple-600 to-purple-800" 
            />
            <QuickStatsCard 
              icon={Trophy} 
              label="Total XP" 
              value={userStats.xp} 
              color="from-yellow-600 to-yellow-800" 
            />
            <QuickStatsCard 
              icon={Crown} 
              label="Rank" 
              value={getCurrentRank()} 
              color="from-blue-600 to-blue-800" 
            />
            <QuickStatsCard 
              icon={Star} 
              label="Badges Earned" 
              value={calculateBadgeCount(userStats.achievements)} 
              color="from-green-600 to-green-800" 
            />
          </div>
        </div>

        {/* Game Modes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Point-Based Games */}
          <GameModeCard
            title="SKILL PATHS"
            description="Follow structured learning paths with clear goals and milestones. Master each concept step by step."
            icon={Target}
            color="from-green-700 via-green-800 to-emerald-900"
            stats={gameStats.pointBased}
            difficulty="BEGINNER"
            onClick={()=>navigate('/skill-paths')}
          />

          {/* PvP Mode */}
          <GameModeCard
            title="CODE BATTLES"
            description="Face off against other players! Solve coding challenges faster to deal damage and claim victory."
            icon={Sword}
            color="from-red-700 via-red-800 to-rose-900"
            stats={gameStats.pvp}
            difficulty="INTERMEDIATE"
            onClick={() => navigate('/battles')}
          />

          {/* Story Quest */}
          <GameModeCard
            title="STORY QUEST"
            description="Embark on an epic coding adventure! Solve challenges to progress through an engaging storyline."
            icon={BookOpen}
            color="from-purple-700 via-purple-800 to-indigo-900"
            stats={gameStats.storyQuest}
            difficulty="ADVANCED"
            isLocked={userStats.level < 10}
          />
        </div>

        {/* Detailed Mode Information */}
        {selectedMode && (
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-none border-4 border-cyan-400 mb-16 retro-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="pixel-font text-2xl font-bold text-cyan-400 glow-text">
                {selectedMode === 'pointBased' ? 'SKILL PATHS' : 
                 selectedMode === 'pvp' ? 'CODE BATTLES' : 'STORY QUEST'} MODE
              </h2>
              <button 
                onClick={() => setSelectedMode(null)}
                className="pixel-font text-sm text-gray-400 hover:text-white transition-colors"
              >
                ✕ CLOSE
              </button>
            </div>

            {selectedMode === 'pointBased' && (
              <div className="space-y-6">
                <p className="pixel-font text-sm text-gray-300 leading-relaxed">
                  Choose from 12 different learning paths, each with specific goals and rewards. 
                  Perfect for structured learning and skill building.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="pixel-font text-lg text-green-400">AVAILABLE PATHS</h3>
                    <div className="space-y-2">
                      {['JavaScript Fundamentals', 'Python Basics', 'HTML/CSS Mastery', 'React Components', 'Algorithm Practice'].map((path, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-gray-800/50 border border-gray-600">
                          <div className={`w-3 h-3 ${i < 3 ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                          <span className="pixel-font text-xs text-gray-300">{path}</span>
                          {i < 3 && <span className="pixel-font text-xs text-green-400">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="pixel-font text-lg text-blue-400">CURRENT PROGRESS</h3>
                    <div className="bg-gray-800/50 p-4 border border-gray-600">
                      <div className="pixel-font text-sm text-white mb-2">JavaScript Loops</div>
                      <div className="progress-bar mb-2" style={{width: '75%'}}></div>
                      <div className="pixel-font text-xs text-gray-400">75% Complete</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 pixel-font text-sm font-bold transform hover:scale-105 transition-all duration-300">
                    ▶ CONTINUE PATH
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 pixel-font text-sm font-bold transform hover:scale-105 transition-all duration-300 border-2 border-gray-500">
                    VIEW ALL PATHS
                  </button>
                </div>
              </div>
            )}

            {selectedMode === 'pvp' && (
              <div className="space-y-6">
                <p className="pixel-font text-sm text-gray-300 leading-relaxed">
                  Battle other players in real-time coding challenges. Each correct solution deals damage to your opponent. 
                  First to defeat their opponent wins!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="pixel-font text-lg text-red-400">BATTLE STATS</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="pixel-font text-xs text-gray-400">Current Rank:</span>
                        <span className="pixel-font text-xs text-white font-bold">Silver III</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="pixel-font text-xs text-gray-400">Wins/Losses:</span>
                        <span className="pixel-font text-xs text-green-400 font-bold">23W / 22L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="pixel-font text-xs text-gray-400">Next Rank:</span>
                        <span className="pixel-font text-xs text-yellow-400 font-bold">7 wins away</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="pixel-font text-lg text-purple-400">GAME MODES</h3>
                    <div className="space-y-2">
                      {['Quick Match', 'Ranked Battle', 'Tournament', 'Friend Duel'].map((mode, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-800/50 border border-gray-600 hover:border-red-400 transition-colors cursor-pointer">
                          <span className="pixel-font text-xs text-gray-300">{mode}</span>
                          <Timer className="w-4 h-4 text-red-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 pixel-font text-sm font-bold transform hover:scale-105 transition-all duration-300">
                    ⚔️ FIND BATTLE
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 pixel-font text-sm font-bold transform hover:scale-105 transition-all duration-300 border-2 border-gray-500">
                    VIEW LEADERBOARD
                  </button>
                </div>
              </div>
            )}

            {selectedMode === 'storyQuest' && (
              <div className="space-y-6">
                <p className="pixel-font text-sm text-gray-300 leading-relaxed">
                  Join the epic adventure of debugging the digital realm! Solve coding challenges to progress through 
                  an immersive storyline filled with characters, mysteries, and epic boss battles.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="pixel-font text-lg text-purple-400">STORY PROGRESS</h3>
                    <div className="bg-gray-800/50 p-4 border border-gray-600">
                      <div className="pixel-font text-sm text-white mb-2">Chapter 3: The Bug Hunt</div>
                      <div className="progress-bar mb-2" style={{width: '67%'}}></div>
                      <div className="pixel-font text-xs text-gray-400">67% Complete</div>
                    </div>
                    
                    <div className="space-y-2">
                      {['Prologue: Welcome to CodeLand', 'Chapter 1: First Steps', 'Chapter 2: Variable Valley', 'Chapter 3: The Bug Hunt'].map((chapter, i) => (
                        <div key={i} className="flex items-center space-x-3 p-2 bg-gray-800/30">
                          <div className={`w-3 h-3 ${i < 3 ? 'bg-purple-400' : i === 3 ? 'bg-yellow-400' : 'bg-gray-500'}`}></div>
                          <span className="pixel-font text-xs text-gray-300">{chapter}</span>
                          {i < 3 && <span className="pixel-font text-xs text-purple-400">✓</span>}
                          {i === 3 && <span className="pixel-font text-xs text-yellow-400">►</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="pixel-font text-lg text-cyan-400">UNLOCKED FEATURES</h3>
                    <div className="space-y-2">
                      {['Character Customization', 'Inventory System', 'Boss Battles', 'Side Quests', 'Guild System'].map((feature, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-800/50 border border-gray-600">
                          <span className="pixel-font text-xs text-gray-300">{feature}</span>
                          {i < 3 ? 
                            <span className="pixel-font text-xs text-cyan-400">✓</span> : 
                            <Lock className="w-3 h-3 text-gray-500" />
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 pixel-font text-sm font-bold transform hover:scale-105 transition-all duration-300">
                    📖 CONTINUE STORY
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 pixel-font text-sm font-bold transform hover:scale-105 transition-all duration-300 border-2 border-gray-500">
                    VIEW PROGRESS
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Daily Streak Section - Replaces Recent Activity */}
        <DailyStreakSection />

        {/* Bottom decorative elements */}
        <div className="text-center mt-16">
          <div className="flex justify-center space-x-4 text-green-500 pixel-font text-xs opacity-60">
            <span>{'<'}</span>
            <span>{'>'}</span>
            <span>{'/'}</span>
            <span>{'{'}</span>
            <span>{'}'}</span>
            <span>{'['}</span>
            <span>{']'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;