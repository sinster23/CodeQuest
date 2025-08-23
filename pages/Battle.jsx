import React, { useState, useEffect } from 'react';
import { 
  Sword, 
  Shield, 
  Trophy, 
  Star, 
  Code, 
  Zap, 
  Target, 
  Crown, 
  ChevronLeft,
  ChevronRight,
  Heart,
  Clock,
  Medal,
  Gamepad2,
  Coffee,
  Layers,
  Database,
  Cpu,
  Flame,
  Lock
} from 'lucide-react';

const CodeBattlesPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [currentBattle, setCurrentBattle] = useState(null);
  const [battlePhase, setBattlePhase] = useState('selection'); // selection, battle, result
  const [playerHealth, setPlayerHealth] = useState(10);
  const [opponentHealth, setOpponentHealth] = useState(10);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState({ player: 0, opponent: 0 });

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

  // Timer for battles
  useEffect(() => {
    let timer;
    if (battlePhase === 'battle' && timeLeft > 0 && !battleResult) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [battlePhase, timeLeft, battleResult]);

  const languages = {
    javascript: {
      name: 'JavaScript',
      icon: Code,
      color: 'from-yellow-600 to-yellow-800',
      borderColor: 'border-yellow-400',
      battles: [
        { id: 1, name: 'Variable Warrior', difficulty: 'EASY', badge: '🟡 Basic Coder', unlocked: true },
        { id: 2, name: 'Function Fighter', difficulty: 'EASY', badge: '🟠 Function Master', unlocked: true },
        { id: 3, name: 'Array Assassin', difficulty: 'MEDIUM', badge: '🔵 Array Expert', unlocked: true },
        { id: 4, name: 'Object Oracle', difficulty: 'HARD', badge: '🟣 Object Sage', unlocked: false },
        { id: 5, name: 'Async Overlord', difficulty: 'EXPERT', badge: '⚫ Async Legend', unlocked: false }
      ]
    },
    typescript: {
      name: 'TypeScript',
      icon: Layers,
      color: 'from-blue-600 to-blue-800',
      borderColor: 'border-blue-400',
      battles: [
        { id: 1, name: 'Type Guardian', difficulty: 'EASY', badge: '🔷 Type Novice', unlocked: true },
        { id: 2, name: 'Interface Enforcer', difficulty: 'MEDIUM', badge: '🔶 Interface Pro', unlocked: true },
        { id: 3, name: 'Generic Genius', difficulty: 'MEDIUM', badge: '🟦 Generic Master', unlocked: false },
        { id: 4, name: 'Decorator Demon', difficulty: 'HARD', badge: '🟪 Decorator Lord', unlocked: false },
        { id: 5, name: 'Module Monarch', difficulty: 'EXPERT', badge: '⬛ TS Emperor', unlocked: false }
      ]
    },
    python: {
      name: 'Python',
      icon: Coffee,
      color: 'from-green-600 to-green-800',
      borderColor: 'border-green-400',
      battles: [
        { id: 1, name: 'Snake Charmer', difficulty: 'EASY', badge: '🐍 Python Rookie', unlocked: true },
        { id: 2, name: 'List Liberator', difficulty: 'EASY', badge: '📋 List Legend', unlocked: true },
        { id: 3, name: 'Dict Destroyer', difficulty: 'MEDIUM', badge: '📖 Dict Master', unlocked: true },
        { id: 4, name: 'Class Crusher', difficulty: 'HARD', badge: '🏛️ OOP Oracle', unlocked: false },
        { id: 5, name: 'Pandas Paladin', difficulty: 'EXPERT', badge: '🐼 Data Deity', unlocked: false }
      ]
    },
    cpp: {
      name: 'C++',
      icon: Cpu,
      color: 'from-red-600 to-red-800',
      borderColor: 'border-red-400',
      battles: [
        { id: 1, name: 'Pointer Pioneer', difficulty: 'MEDIUM', badge: '➡️ Pointer Pro', unlocked: true },
        { id: 2, name: 'Memory Manager', difficulty: 'MEDIUM', badge: '💾 Memory Master', unlocked: false },
        { id: 3, name: 'Template Titan', difficulty: 'HARD', badge: '📋 Template Lord', unlocked: false },
        { id: 4, name: 'STL Samurai', difficulty: 'HARD', badge: '📚 STL Sage', unlocked: false },
        { id: 5, name: 'Performance Predator', difficulty: 'EXPERT', badge: '⚡ Speed Demon', unlocked: false }
      ]
    },
    java: {
      name: 'Java',
      icon: Database,
      color: 'from-purple-600 to-purple-800',
      borderColor: 'border-purple-400',
      battles: [
        { id: 1, name: 'Class Captain', difficulty: 'EASY', badge: '☕ Java Junior', unlocked: true },
        { id: 2, name: 'Interface Invader', difficulty: 'MEDIUM', badge: '🔌 Interface Ace', unlocked: true },
        { id: 3, name: 'Stream Soldier', difficulty: 'MEDIUM', badge: '🌊 Stream Master', unlocked: false },
        { id: 4, name: 'Concurrency Conqueror', difficulty: 'HARD', badge: '🔀 Thread Titan', unlocked: false },
        { id: 5, name: 'Spring Sentinel', difficulty: 'EXPERT', badge: '🌱 Spring Supreme', unlocked: false }
      ]
    }
  };

  // Hardcoded questions for each language
  const questions = {
    javascript: [
      {
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["var name = 'John';", "variable name = 'John';", "v name = 'John';", "declare name = 'John';"],
        correct: 0
      },
      {
        question: "Which method adds an element to the end of an array?",
        options: ["append()", "push()", "add()", "insert()"],
        correct: 1
      },
      {
        question: "What does '===' operator do in JavaScript?",
        options: ["Assignment", "Loose equality", "Strict equality", "Not equal"],
        correct: 2
      },
      {
        question: "How do you create a function in JavaScript?",
        options: ["function = myFunc() {}", "create myFunc() {}", "function myFunc() {}", "def myFunc() {}"],
        correct: 2
      },
      {
        question: "What is the result of typeof null?",
        options: ["'null'", "'undefined'", "'object'", "'boolean'"],
        correct: 2
      }
    ],
    python: [
      {
        question: "How do you create a list in Python?",
        options: ["list = []", "list = {}", "list = ()", "list = <>"],
        correct: 0
      },
      {
        question: "Which keyword is used to create a function in Python?",
        options: ["function", "def", "create", "func"],
        correct: 1
      },
      {
        question: "What is the correct way to import a module?",
        options: ["include math", "import math", "use math", "require math"],
        correct: 1
      },
      {
        question: "How do you create a dictionary in Python?",
        options: ["dict = []", "dict = ()", "dict = {}", "dict = <>"],
        correct: 2
      },
      {
        question: "Which method is used to add an item to a list?",
        options: ["add()", "push()", "append()", "insert()"],
        correct: 2
      }
    ],
    typescript: [
      {
        question: "How do you specify a type for a variable?",
        options: ["let name: string;", "let name as string;", "let name = string;", "let string name;"],
        correct: 0
      },
      {
        question: "What keyword is used to define an interface?",
        options: ["type", "interface", "class", "struct"],
        correct: 1
      },
      {
        question: "How do you make a property optional in an interface?",
        options: ["name: string?", "name?: string", "optional name: string", "name: optional string"],
        correct: 1
      },
      {
        question: "What is a generic in TypeScript?",
        options: ["A type variable", "A class method", "An interface", "A module"],
        correct: 0
      },
      {
        question: "How do you define a union type?",
        options: ["string & number", "string + number", "string | number", "string || number"],
        correct: 2
      }
    ],
    cpp: [
      {
        question: "How do you declare a pointer in C++?",
        options: ["int* ptr;", "int ptr*;", "pointer int ptr;", "int &ptr;"],
        correct: 0
      },
      {
        question: "Which header includes cout?",
        options: ["<stdio.h>", "<iostream>", "<cstdio>", "<console>"],
        correct: 1
      },
      {
        question: "What is the scope resolution operator?",
        options: ["::", "->", ".", "::>"],
        correct: 0
      },
      {
        question: "How do you dynamically allocate memory?",
        options: ["malloc()", "new", "alloc()", "create()"],
        correct: 1
      },
      {
        question: "What is a destructor called?",
        options: ["~ClassName()", "delete ClassName()", "ClassName~()", "destroy()"],
        correct: 0
      }
    ],
    java: [
      {
        question: "Which keyword is used to create a class?",
        options: ["class", "Class", "create", "new"],
        correct: 0
      },
      {
        question: "How do you create an object?",
        options: ["Object obj = Object();", "new Object obj;", "Object obj = new Object();", "create Object obj;"],
        correct: 2
      },
      {
        question: "What is method overloading?",
        options: ["Same method, different parameters", "Different method, same parameters", "Inheriting methods", "Abstract methods"],
        correct: 0
      },
      {
        question: "Which access modifier is most restrictive?",
        options: ["public", "protected", "private", "default"],
        correct: 2
      },
      {
        question: "What is the main method signature?",
        options: ["public static void main(String args[])", "public void main(String args[])", "static void main(String args[])", "void main(String args[])"],
        correct: 0
      }
    ]
  };

  const startBattle = (battle) => {
    setCurrentBattle(battle);
    setBattlePhase('battle');
    setPlayerHealth(10);
    setOpponentHealth(10);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setBattleResult(null);
    setTimeLeft(30);
    setScore({ player: 0, opponent: 0 });
  };

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[selectedLanguage][currentQuestion].correct;
    
    setTimeout(() => {
      if (isCorrect) {
        setOpponentHealth(prev => Math.max(0, prev - 1));
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
      } else {
        setPlayerHealth(prev => Math.max(0, prev - 1));
        setScore(prev => ({ ...prev, opponent: prev.opponent + 1 }));
      }
      
      // Check for battle end
      const newPlayerHealth = isCorrect ? playerHealth : Math.max(0, playerHealth - 1);
      const newOpponentHealth = isCorrect ? Math.max(0, opponentHealth - 1) : opponentHealth;
      
      if (newPlayerHealth <= 0) {
        setBattleResult('defeat');
        setBattlePhase('result');
      } else if (newOpponentHealth <= 0) {
        setBattleResult('victory');
        setBattlePhase('result');
      } else {
        // Next question
        setCurrentQuestion(prev => (prev + 1) % questions[selectedLanguage].length);
        setSelectedAnswer(null);
        setTimeLeft(30);
      }
    }, 1000);
  };

  const handleTimeUp = () => {
    // Time up counts as wrong answer
    setPlayerHealth(prev => Math.max(0, prev - 1));
    setScore(prev => ({ ...prev, opponent: prev.opponent + 1 }));
    
    if (playerHealth - 1 <= 0) {
      setBattleResult('defeat');
      setBattlePhase('result');
    } else {
      setCurrentQuestion(prev => (prev + 1) % questions[selectedLanguage].length);
      setSelectedAnswer(null);
      setTimeLeft(30);
    }
  };

  const resetBattle = () => {
    setBattlePhase('selection');
    setCurrentBattle(null);
  };

  const LanguageTab = ({ langKey, lang }) => (
    <button
      onClick={() => setSelectedLanguage(langKey)}
      className={`p-4 rounded-none border-2 transition-all duration-300 pixel-font text-sm ${
        selectedLanguage === langKey
          ? `bg-gradient-to-br ${lang.color} ${lang.borderColor} text-white scale-105`
          : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400'
      }`}
    >
      <lang.icon className="w-6 h-6 mx-auto mb-2" />
      {lang.name}
    </button>
  );

  const BattleCard = ({ battle, language }) => (
    <div 
      className={`relative bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-none border-2 
        transition-all duration-300 transform hover:scale-105 cursor-pointer
        ${battle.unlocked ? 'border-white/30 hover:border-white/60 hover:shadow-xl' : 'border-gray-700 opacity-60 cursor-not-allowed'}
        retro-card pixel-shadow`}
      onClick={() => battle.unlocked && startBattle(battle)}
    >
      {/* Difficulty indicator */}
      <div className={`absolute top-2 right-2 px-2 py-1 text-xs pixel-font ${
        battle.difficulty === 'EASY' ? 'bg-green-600' :
        battle.difficulty === 'MEDIUM' ? 'bg-yellow-600' :
        battle.difficulty === 'HARD' ? 'bg-red-600' : 'bg-purple-600'
      }`}>
        {battle.difficulty}
      </div>

      {!battle.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="text-center">
            <Lock className="w-8 h-8 text-white/60 mx-auto mb-2" />
            <div className="pixel-font text-xs text-white/80">LOCKED</div>
          </div>
        </div>
      )}

      <div className="relative z-20">
        <div className="flex items-center justify-between mb-4">
          <Sword className="w-8 h-8 text-red-400" />
          <div className="flex space-x-1">
            {[1,2,3,4,5].map(i => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i <= (battle.difficulty === 'EASY' ? 2 : battle.difficulty === 'MEDIUM' ? 3 : battle.difficulty === 'HARD' ? 4 : 5) ? 'text-yellow-300' : 'text-white/30'}`} 
                fill="currentColor" 
              />
            ))}
          </div>
        </div>
        
        <h3 className="pixel-font text-lg font-bold text-white mb-3">
          {battle.name}
        </h3>
        
        <div className="pixel-font text-xs text-gray-300 mb-4">
          🏆 {battle.badge}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="pixel-font text-xs text-green-400">
            {battle.unlocked ? '▶ BATTLE READY' : '🔒 COMPLETE PREVIOUS'}
          </div>
          {battle.unlocked && <ChevronRight className="w-4 h-4 text-white" />}
        </div>
      </div>
    </div>
  );

  const HealthBar = ({ health, maxHealth, color, label }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="pixel-font text-sm text-white">{label}</span>
        <span className="pixel-font text-sm text-white">{health}/{maxHealth}</span>
      </div>
      <div className="w-full bg-gray-700 h-4 border-2 border-white/30">
        <div 
          className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${(health / maxHealth) * 100}%` }}
        ></div>
      </div>
      <div className="flex space-x-1">
        {Array.from({ length: maxHealth }, (_, i) => (
          <Heart 
            key={i}
            className={`w-3 h-3 ${i < health ? 'text-red-500' : 'text-gray-600'}`}
            fill="currentColor"
          />
        ))}
      </div>
    </div>
  );

  if (battlePhase === 'battle') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white relative overflow-hidden">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          
          .pixel-font {
            font-family: 'Press Start 2P', monospace;
            image-rendering: pixelated;
          }
          
          .battle-bg {
            background: repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,0,0,0.1) 2deg, transparent 4deg);
          }
          
          .question-glow {
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
          }
        `}</style>

        <div className="battle-bg w-full h-full absolute top-0 left-0"></div>

        <div className="container mx-auto px-6 py-8 relative z-10">
          {/* Battle Header */}
          <div className="text-center mb-8">
            <h1 className="pixel-font text-3xl font-bold text-red-400 mb-2">BATTLE ARENA</h1>
            <div className="pixel-font text-sm text-white">
              {languages[selectedLanguage].name} • {currentBattle.name}
            </div>
          </div>

          {/* Health Bars */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <div className="pixel-font text-lg text-blue-400 mb-4">PLAYER</div>
              <HealthBar 
                health={playerHealth} 
                maxHealth={10} 
                color="from-blue-500 to-cyan-500"
                label="You"
              />
            </div>
            <div className="text-center">
              <div className="pixel-font text-lg text-red-400 mb-4">OPPONENT</div>
              <HealthBar 
                health={opponentHealth} 
                maxHealth={10} 
                color="from-red-500 to-orange-500"
                label={currentBattle.name}
              />
            </div>
          </div>

          {/* Timer */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 border-2 ${timeLeft <= 10 ? 'border-red-400 bg-red-900/30' : 'border-yellow-400 bg-yellow-900/30'}`}>
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className={`pixel-font text-lg font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-yellow-400'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Question */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 border-4 border-green-400 question-glow mb-8">
            <div className="pixel-font text-sm text-green-400 mb-4">
              QUESTION {currentQuestion + 1}/∞
            </div>
            <h2 className="pixel-font text-lg text-white leading-relaxed mb-6">
              {questions[selectedLanguage][currentQuestion].question}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[selectedLanguage][currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 text-left border-2 transition-all duration-300 pixel-font text-sm ${
                    selectedAnswer === null 
                      ? 'border-gray-600 bg-gray-800 hover:border-white hover:bg-gray-700'
                      : selectedAnswer === index
                        ? index === questions[selectedLanguage][currentQuestion].correct
                          ? 'border-green-400 bg-green-900/50 text-green-400'
                          : 'border-red-400 bg-red-900/50 text-red-400'
                        : index === questions[selectedLanguage][currentQuestion].correct && selectedAnswer !== null
                          ? 'border-green-400 bg-green-900/30 text-green-300'
                          : 'border-gray-600 bg-gray-800 text-gray-400'
                  }`}
                >
                  <span className="text-white/60 mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="pixel-font text-sm text-gray-400">
              Score: {score.player} - {score.opponent}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (battlePhase === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          
          .pixel-font {
            font-family: 'Press Start 2P', monospace;
          }
        `}</style>

        <div className="text-center p-8">
          <div className={`w-32 h-32 mx-auto mb-8 flex items-center justify-center border-4 ${
            battleResult === 'victory' ? 'border-green-400 bg-green-900/30' : 'border-red-400 bg-red-900/30'
          }`}>
            {battleResult === 'victory' ? 
              <Trophy className="w-16 h-16 text-yellow-400" /> :
              <Sword className="w-16 h-16 text-red-400" />
            }
          </div>
          
          <h1 className={`pixel-font text-4xl font-bold mb-4 ${
            battleResult === 'victory' ? 'text-green-400' : 'text-red-400'
          }`}>
            {battleResult === 'victory' ? 'VICTORY!' : 'DEFEAT!'}
          </h1>
          
          <div className="pixel-font text-lg text-white mb-8">
            Final Score: {score.player} - {score.opponent}
          </div>

          {battleResult === 'victory' && (
            <div className="bg-yellow-900/30 border-2 border-yellow-400 p-4 mb-8">
              <div className="pixel-font text-sm text-yellow-400 mb-2">BADGE EARNED!</div>
              <div className="pixel-font text-lg text-white">{currentBattle.badge}</div>
            </div>
          )}
          
          <div className="space-x-4">
            <button
              onClick={resetBattle}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 pixel-font text-sm font-bold transition-all duration-300"
            >
              ← BACK TO BATTLES
            </button>
            <button
              onClick={() => startBattle(currentBattle)}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 pixel-font text-sm font-bold transition-all duration-300"
            >
              ⚔️ REMATCH
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white relative overflow-hidden">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pixel-font {
          font-family: 'Press Start 2P', monospace;
          image-rendering: pixelated;
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
            6px 6px 0px rgba(255, 0, 0, 0.3),
            12px 12px 0px rgba(255, 153, 0, 0.2),
            18px 18px 0px rgba(255, 255, 0, 0.1);
        }
        
        .battle-glow {
          box-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
        }
      `}</style>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <button 
            onClick={() => window.history.back()}
            className="absolute left-6 top-6 pixel-font text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>
          
          <h1 className="pixel-font text-4xl md:text-6xl font-bold mb-6 text-red-400 battle-glow">
            CODE <span className="text-yellow-400">BATTLES</span>
          </h1>
          <p className="pixel-font text-sm max-w-2xl mx-auto text-gray-300 leading-relaxed">
            Choose your weapon! Battle AI opponents in intense 1v1 coding duels. 
            Answer correctly to deal damage, get it wrong and take a hit!
          </p>
        </div>

        {/* Language Selection */}
        <div className="mb-12">
          <h2 className="pixel-font text-2xl font-bold text-center text-white mb-8">
            SELECT YOUR <span className="text-cyan-400">LANGUAGE</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {Object.entries(languages).map(([langKey, lang]) => (
              <LanguageTab key={langKey} langKey={langKey} lang={lang} />
            ))}
          </div>
        </div>

        {/* Current Language Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-white/30">
            {React.createElement(languages[selectedLanguage].icon, { className: "w-6 h-6 text-white" })}
            <span className="pixel-font text-lg text-white">{languages[selectedLanguage].name} ARENA</span>
          </div>
        </div>

        {/* Battle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {languages[selectedLanguage].battles.map((battle) => (
            <BattleCard key={battle.id} battle={battle} language={selectedLanguage} />
          ))}
        </div>

        {/* Battle Rules */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 border-4 border-yellow-400/50 retro-card">
          <h3 className="pixel-font text-2xl font-bold text-yellow-400 text-center mb-6">
            BATTLE RULES
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="pixel-font text-lg text-green-400 mb-3">CORRECT ANSWER</h4>
              <p className="pixel-font text-xs text-gray-300 leading-relaxed">
                Deal 1 damage to your opponent. Get closer to victory with each correct answer!
              </p>
            </div>
            
            <div className="text-center">
              <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h4 className="pixel-font text-lg text-red-400 mb-3">WRONG ANSWER</h4>
              <p className="pixel-font text-xs text-gray-300 leading-relaxed">
                Take 1 damage! Wrong answers and timeouts will cost you health points.
              </p>
            </div>
            
            <div className="text-center">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h4 className="pixel-font text-lg text-yellow-400 mb-3">WIN CONDITION</h4>
              <p className="pixel-font text-xs text-gray-300 leading-relaxed">
                Reduce opponent's health to 0 first! Earn exclusive badges for each victory.
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-red-900/30 border-2 border-red-400">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-red-400" />
              <span className="pixel-font text-sm text-red-400">TIME LIMIT WARNING</span>
            </div>
            <p className="pixel-font text-xs text-center text-gray-300">
              You have 30 seconds per question! Time runs out = Wrong answer!
            </p>
          </div>
        </div>

        {/* Battle Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-6 border-2 border-blue-400 text-center">
            <Medal className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="pixel-font text-2xl text-white font-bold mb-1">12</div>
            <div className="pixel-font text-xs text-blue-400">BADGES EARNED</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 p-6 border-2 border-green-400 text-center">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="pixel-font text-2xl text-white font-bold mb-1">23</div>
            <div className="pixel-font text-xs text-green-400">BATTLES WON</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-6 border-2 border-purple-400 text-center">
            <Flame className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="pixel-font text-2xl text-white font-bold mb-1">7</div>
            <div className="pixel-font text-xs text-purple-400">WIN STREAK</div>
          </div>
        </div>

        {/* Footer decorations */}
        <div className="text-center mt-16">
          <div className="flex justify-center space-x-4 text-red-500 pixel-font text-xs opacity-60">
            <span>{'⚔️'}</span>
            <span>{'🛡️'}</span>
            <span>{'⚡'}</span>
            <span>{'🏆'}</span>
            <span>{'💀'}</span>
            <span>{'🔥'}</span>
            <span>{'⭐'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeBattlesPage;