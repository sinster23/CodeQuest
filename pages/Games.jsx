import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Code, Book, Target, Award, ChevronRight, Play, Check, X } from 'lucide-react';

const CodeQuest = () => {
  const [currentUser, setCurrentUser] = useState({
    name: 'CodeLearner',
    level: 5,
    xp: 1250,
    xpToNext: 1500,
    badges: ['first-steps', 'quiz-master', 'js-novice'],
    streak: 7
  });

  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [showResult, setShowResult] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  const badges = {
    'first-steps': { name: 'First Steps', icon: '👶', color: 'bg-green-500' },
    'quiz-master': { name: 'Quiz Master', icon: '🧠', color: 'bg-blue-500' },
    'js-novice': { name: 'JS Novice', icon: '⚡', color: 'bg-yellow-500' },
    'python-starter': { name: 'Python Starter', icon: '🐍', color: 'bg-purple-500' },
    'speed-demon': { name: 'Speed Demon', icon: '🚀', color: 'bg-red-500' }
  };

  const quizzes = [
    {
      id: 1,
      question: "What does 'console.log()' do in JavaScript?",
      options: ["Creates a new variable", "Prints output to console", "Defines a function", "Imports a library"],
      correct: 1,
      language: "JavaScript"
    },
    {
      id: 2,
      question: "Which symbol is used for comments in Python?",
      options: ["//", "/* */", "#", "<!--"],
      correct: 2,
      language: "Python"
    },
    {
      id: 3,
      question: "What is the correct way to declare a variable in JavaScript?",
      options: ["var name = 'John'", "variable name = 'John'", "declare name = 'John'", "name := 'John'"],
      correct: 0,
      language: "JavaScript"
    }
  ];

  const codeSnippets = [
    "console.log('Hello World')",
    "function greet(name)",
    "if (x > 0) return true",
    "const array = [1,2,3]",
    "for (let i = 0; i < 5; i++)",
    "import React from 'react'",
    "def calculate(x, y):",
    "print('Python is fun')",
    "class MyClass:",
    "return x + y"
  ];

  useEffect(() => {
    let timer;
    if (gameActive && gameTime > 0) {
      timer = setTimeout(() => setGameTime(gameTime - 1), 1000);
    } else if (gameTime === 0) {
      setGameActive(false);
    }
    return () => clearTimeout(timer);
  }, [gameActive, gameTime]);

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setQuizAnswer('');
    setShowResult(null);
  };

  const submitQuiz = () => {
    const isCorrect = parseInt(quizAnswer) === currentQuiz.correct;
    setShowResult(isCorrect);
    if (isCorrect) {
      setCurrentUser(prev => ({
        ...prev,
        xp: prev.xp + 50,
        badges: [...prev.badges, 'quiz-master'].filter((badge, index, self) => self.indexOf(badge) === index)
      }));
    }
  };

  const startSpeedGame = () => {
    setGameActive(true);
    setGameScore(0);
    setGameTime(30);
  };

  const typeSnippet = (snippet) => {
    if (gameActive) {
      setGameScore(prev => prev + 1);
      if (gameScore + 1 >= 10) {
        setGameActive(false);
        setCurrentUser(prev => ({
          ...prev,
          xp: prev.xp + 100,
          badges: [...prev.badges, 'speed-demon'].filter((badge, index, self) => self.indexOf(badge) === index)
        }));
      }
    }
  };

  const PixelButton = ({ children, onClick, variant = 'primary', className = '' }) => {
    const baseClasses = "px-4 py-2 font-mono text-sm font-bold transition-all duration-200 border-2 transform hover:scale-105 active:scale-95";
    const variants = {
      primary: "bg-purple-600 hover:bg-purple-500 border-purple-400 text-white shadow-lg hover:shadow-purple-500/25",
      secondary: "bg-gray-700 hover:bg-gray-600 border-gray-500 text-white shadow-lg hover:shadow-gray-500/25",
      success: "bg-green-600 hover:bg-green-500 border-green-400 text-white shadow-lg hover:shadow-green-500/25"
    };
    
    return (
      <button 
        className={`${baseClasses} ${variants[variant]} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  const ProgressBar = ({ current, max, color = 'purple' }) => (
    <div className="w-full bg-gray-800 border-2 border-gray-600 h-4 relative overflow-hidden">
      <div 
        className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400 transition-all duration-500 relative`}
        style={{ width: `${(current / max) * 100}%` }}
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
      </div>
      <div className="absolute inset-0 bg-black/10 pixel-border"></div>
    </div>
  );

  const BadgeComponent = ({ badgeKey }) => {
    const badge = badges[badgeKey];
    if (!badge) return null;
    
    return (
      <div className={`${badge.color} p-3 rounded-lg border-2 border-white/30 shadow-lg hover:scale-105 transition-transform cursor-pointer`}>
        <div className="text-2xl mb-1">{badge.icon}</div>
        <div className="font-mono text-xs text-white font-bold">{badge.name}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-mono relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Header */}
      <header className="border-b-2 border-purple-500 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                &lt;CodeQuest/&gt;
              </div>
              <div className="text-sm text-gray-400">Level Up Your Code!</div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-bold">{currentUser.xp} XP</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-orange-400" />
                <span>Level {currentUser.level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <span>{currentUser.streak} day streak</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex space-x-4">
            {['dashboard', 'quizzes', 'games', 'badges'].map((section) => (
              <PixelButton
                key={section}
                onClick={() => setActiveSection(section)}
                variant={activeSection === section ? 'primary' : 'secondary'}
                className="capitalize"
              >
                {section}
              </PixelButton>
            ))}
          </div>
        </nav>

        {/* Dashboard */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8">
            {/* Progress Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border-2 border-purple-500/30">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                Your Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Level {currentUser.level}</span>
                    <span className="text-sm text-gray-300">{currentUser.xp}/{currentUser.xpToNext} XP</span>
                  </div>
                  <ProgressBar current={currentUser.xp} max={currentUser.xpToNext} />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{currentUser.badges.length}</div>
                  <div className="text-sm text-gray-400">Badges Earned</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-6 rounded-lg border-2 border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer group"
                   onClick={() => setActiveSection('quizzes')}>
                <div className="flex items-center justify-between mb-4">
                  <Book className="w-8 h-8 text-blue-400" />
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="font-bold text-lg mb-2">Take a Quiz</h3>
                <p className="text-sm text-gray-400">Test your knowledge and earn XP</p>
              </div>

              <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 p-6 rounded-lg border-2 border-green-500/30 hover:border-green-400/50 transition-colors cursor-pointer group"
                   onClick={() => setActiveSection('games')}>
                <div className="flex items-center justify-between mb-4">
                  <Play className="w-8 h-8 text-green-400" />
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                </div>
                <h3 className="font-bold text-lg mb-2">Play Games</h3>
                <p className="text-sm text-gray-400">Learn while having fun</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-6 rounded-lg border-2 border-purple-500/30 hover:border-purple-400/50 transition-colors cursor-pointer group"
                   onClick={() => setActiveSection('badges')}>
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-8 h-8 text-purple-400" />
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <h3 className="font-bold text-lg mb-2">View Badges</h3>
                <p className="text-sm text-gray-400">See your achievements</p>
              </div>
            </div>
          </div>
        )}

        {/* Quizzes Section */}
        {activeSection === 'quizzes' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Code Quizzes</h2>
            
            {!currentQuiz ? (
              <div className="grid gap-6">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border-2 border-gray-600 hover:border-purple-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-2">{quiz.question}</h3>
                        <span className="inline-block bg-purple-600 text-xs px-2 py-1 rounded">{quiz.language}</span>
                      </div>
                      <PixelButton onClick={() => startQuiz(quiz)}>
                        Start Quiz
                      </PixelButton>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border-2 border-purple-500">
                <h3 className="text-xl font-bold mb-6">{currentQuiz.question}</h3>
                <div className="space-y-4 mb-6">
                  {currentQuiz.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="quiz-answer"
                        value={index}
                        onChange={(e) => setQuizAnswer(e.target.value)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-gray-300 hover:text-white transition-colors">{option}</span>
                    </label>
                  ))}
                </div>
                
                {showResult !== null && (
                  <div className={`p-4 rounded-lg border-2 mb-4 ${showResult ? 'bg-green-900/50 border-green-500 text-green-300' : 'bg-red-900/50 border-red-500 text-red-300'}`}>
                    <div className="flex items-center space-x-2">
                      {showResult ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      <span className="font-bold">
                        {showResult ? 'Correct! +50 XP' : 'Incorrect. Try again!'}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <PixelButton
                    onClick={submitQuiz}
                    variant="success"
                    className="disabled:opacity-50"
                  >
                    Submit Answer
                  </PixelButton>
                  <PixelButton
                    onClick={() => setCurrentQuiz(null)}
                    variant="secondary"
                  >
                    Back to Quizzes
                  </PixelButton>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Games Section */}
        {activeSection === 'games' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Coding Games</h2>
            
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border-2 border-green-500/30">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-green-400" />
                Speed Typing Challenge
              </h3>
              <p className="text-gray-400 mb-6">Type as many code snippets as you can in 30 seconds!</p>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{gameScore}</div>
                  <div className="text-sm text-gray-400">Snippets Typed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">{gameTime}s</div>
                  <div className="text-sm text-gray-400">Time Left</div>
                </div>
              </div>
              
              {!gameActive && gameTime === 30 ? (
                <div className="text-center">
                  <PixelButton onClick={startSpeedGame} variant="success">
                    Start Game
                  </PixelButton>
                </div>
              ) : gameActive ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {codeSnippets.slice(0, 6).map((snippet, index) => (
                      <PixelButton
                        key={index}
                        onClick={() => typeSnippet(snippet)}
                        variant="secondary"
                        className="text-left font-mono text-xs p-3 hover:bg-green-600 transition-colors"
                      >
                        {snippet}
                      </PixelButton>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-4">Game Over!</div>
                  <div className="text-lg mb-4">You typed {gameScore} snippets!</div>
                  <PixelButton onClick={startSpeedGame} variant="success">
                    Play Again
                  </PixelButton>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Badges Section */}
        {activeSection === 'badges' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Your Badges</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Object.keys(badges).map((badgeKey) => (
                <div key={badgeKey} className={`relative ${currentUser.badges.includes(badgeKey) ? '' : 'opacity-50 grayscale'}`}>
                  <BadgeComponent badgeKey={badgeKey} />
                  {!currentUser.badges.includes(badgeKey) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
                      <div className="text-xs font-bold text-gray-400">LOCKED</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border-2 border-gray-600">
              <h3 className="text-xl font-bold mb-4">How to Earn Badges</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div>🎯 <strong>First Steps:</strong> Complete your first lesson</div>
                <div>🧠 <strong>Quiz Master:</strong> Answer quiz questions correctly</div>
                <div>⚡ <strong>JS Novice:</strong> Complete JavaScript fundamentals</div>
                <div>🐍 <strong>Python Starter:</strong> Write your first Python program</div>
                <div>🚀 <strong>Speed Demon:</strong> Complete typing challenge with high score</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t-2 border-purple-500 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            &lt;CodeQuest/&gt;
          </div>
          <div className="text-sm text-gray-400">
            Level up your coding skills through gamification • Learn • Play • Achieve
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CodeQuest;