import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Star, 
  Lock, 
  Play, 
  ChevronRight, 
  Trophy, 
  Zap, 
  Code,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Crown,
  Sparkles,
  Youtube,
  ExternalLink,
  User,
  Calendar,
  Eye,
  ThumbsUp,
  Flame
} from 'lucide-react';

const StoryQuest = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentStep, setCurrentStep] = useState('story'); // 'story', 'concept', 'challenge'
  const [userProgress, setUserProgress] = useState({
    javascript: { completedChapters: [], currentChapter: 0 },
    python: { completedChapters: [], currentChapter: 0 },
    java: { completedChapters: [], currentChapter: 0 },
    cpp: { completedChapters: [], currentChapter: 0 },
    c: { completedChapters: [], currentChapter: 0 }
  });
  const [challengeData, setChallengeData] = useState(null);
  const [conceptData, setConceptData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Language configurations
  const languages = {
    javascript: {
      name: 'JavaScript',
      icon: '🟨',
      color: 'from-yellow-600 to-yellow-800',
      description: 'The language of the web',
      mascot: '🦎'
    },
    python: {
      name: 'Python',
      icon: '🐍',
      color: 'from-blue-600 to-green-600',
      description: 'Simple, powerful, versatile',
      mascot: '🐍'
    },
    java: {
      name: 'Java',
      icon: '☕',
      color: 'from-red-600 to-orange-600',
      description: 'Write once, run anywhere',
      mascot: '🏛️'
    },
    cpp: {
      name: 'C++',
      icon: '⚡',
      color: 'from-blue-700 to-purple-700',
      description: 'Power and performance',
      mascot: '🚀'
    },
    c: {
      name: 'C',
      icon: '🔧',
      color: 'from-gray-600 to-gray-800',
      description: 'The foundation of programming',
      mascot: '⚙️'
    }
  };

  // Story chapters for each language
  const storyChapters = {
    javascript: [
      {
        title: "The Digital Awakening",
        story: "You find yourself in the mystical realm of WebLandia, where everything runs on JavaScript magic. The great Browser Kingdom has lost its interactivity, and only you can restore it by mastering the ancient art of Variables and Functions.",
        concept: "Variables and Basic Syntax",
        challenge: "Learn to store magical energy in variables"
      },
      {
        title: "The Function Forge",
        story: "Deep in the Function Forge, the legendary Blacksmith teaches you to create powerful spells called functions. These reusable incantations will help you defeat the Repetition Dragon.",
        concept: "Functions and Parameters",
        challenge: "Forge your first function spell"
      },
      {
        title: "The Array Academy",
        story: "The wise Array Masters show you how to organize multiple magical items in mystical containers. Master the arts of indexing and iteration to unlock the treasure vaults.",
        concept: "Arrays and Loops",
        challenge: "Navigate the Array Labyrinth"
      },
      {
        title: "The Object Oasis",
        story: "In the Object Oasis, you discover that everything in JavaScript has properties and methods. The Guardian of Objects challenges you to create your own magical entities.",
        concept: "Objects and Methods",
        challenge: "Create your first magical object"
      },
      {
        title: "The DOM Dynasty",
        story: "The final challenge awaits in the DOM Dynasty, where you must learn to control the very fabric of web pages. Master element manipulation to become the Supreme Web Wizard.",
        concept: "DOM Manipulation",
        challenge: "Control the web page elements"
      }
    ],
    python: [
      {
        title: "The Serpent's Garden",
        story: "Welcome to Pythonia, where the Great Python Serpent guards the secrets of clean, readable code. Your journey begins in the Garden of Variables, where data types bloom like magical flowers.",
        concept: "Variables and Data Types",
        challenge: "Plant your first data seeds"
      },
      {
        title: "The Logic Library",
        story: "The ancient Logic Library contains scrolls of conditional wisdom. Master if-statements and logical operators to unlock the hidden chambers of decision-making.",
        concept: "Conditionals and Logic",
        challenge: "Navigate the maze of decisions"
      },
      {
        title: "The Loop Lagoon",
        story: "By the shores of Loop Lagoon, repetitive tasks are transformed into elegant solutions. The Lagoon Guardian teaches you the power of for and while loops.",
        concept: "Loops and Iteration",
        challenge: "Swim through repetitive currents"
      },
      {
        title: "The List Laboratory",
        story: "In the List Laboratory, mad scientists have discovered how to store multiple items in ordered sequences. Learn list methods and comprehensions to become a data manipulation wizard.",
        concept: "Lists and List Methods",
        challenge: "Experiment with list potions"
      },
      {
        title: "The Function Fellowship",
        story: "Join the Function Fellowship, where brave coders unite to create reusable, modular code. Master parameters, return values, and scope to complete your Python quest.",
        concept: "Functions and Modules",
        challenge: "Forge the ultimate function"
      }
    ],
    java: [
      {
        title: "The Class Citadel",
        story: "Enter the grand Class Citadel of Java Kingdom, where everything is an object with a class. The Object-Oriented Oracle teaches you the foundations of classes and objects.",
        concept: "Classes and Objects",
        challenge: "Build your first class structure"
      },
      {
        title: "The Method Monastery",
        story: "High in the mountains stands the Method Monastery, where monks practice the art of encapsulation. Learn to create methods that perform specific tasks.",
        concept: "Methods and Encapsulation",
        challenge: "Master method meditation"
      },
      {
        title: "The Inheritance Isle",
        story: "On Inheritance Isle, you discover how classes can share properties and behaviors. The Isle Guardian reveals the secrets of extends and super.",
        concept: "Inheritance and Polymorphism",
        challenge: "Climb the inheritance hierarchy"
      },
      {
        title: "The Interface Intersection",
        story: "At the busy Interface Intersection, different classes meet and agree on common contracts. Master interfaces to create flexible, maintainable code.",
        concept: "Interfaces and Abstract Classes",
        challenge: "Navigate the interface maze"
      },
      {
        title: "The Exception Expanse",
        story: "Venture into the dangerous Exception Expanse, where errors lurk around every corner. Learn try-catch blocks to handle unexpected situations gracefully.",
        concept: "Exception Handling",
        challenge: "Survive the error storm"
      }
    ],
    cpp: [
      {
        title: "The Memory Manor",
        story: "Welcome to the Memory Manor of C++ Kingdom, where you have direct control over system resources. The Pointer Prince teaches you about memory addresses and references.",
        concept: "Pointers and Memory Management",
        challenge: "Navigate the memory maze"
      },
      {
        title: "The Class Cathedral",
        story: "In the majestic Class Cathedral, you learn that C++ extends C with powerful object-oriented features. Master constructors, destructors, and member functions.",
        concept: "Classes and Object-Oriented Programming",
        challenge: "Build the sacred class structure"
      },
      {
        title: "The Template Temple",
        story: "High atop Mount Algorithm stands the Template Temple, where generic programming magic happens. Learn to write code that works with any data type.",
        concept: "Templates and Generic Programming",
        challenge: "Create universal code spells"
      },
      {
        title: "The STL Sanctuary",
        story: "The Standard Template Library Sanctuary houses powerful containers and algorithms. Master vectors, maps, and algorithms to become a C++ champion.",
        concept: "STL Containers and Algorithms",
        challenge: "Unlock the STL treasure chest"
      },
      {
        title: "The Performance Peak",
        story: "Your final challenge awaits at Performance Peak, where optimization and efficiency reign supreme. Learn advanced techniques to write lightning-fast code.",
        concept: "Performance Optimization",
        challenge: "Achieve maximum speed"
      }
    ],
    c: [
      {
        title: "The Foundation Fortress",
        story: "Deep in the Foundation Fortress, you discover the bedrock of all programming languages. Master variables, basic I/O, and the building blocks of computation.",
        concept: "Variables and Basic I/O",
        challenge: "Lay the first stones"
      },
      {
        title: "The Control Castle",
        story: "The Control Castle teaches you to direct the flow of your programs. Master if-statements, switches, and loops to command your code's destiny.",
        concept: "Control Flow Statements",
        challenge: "Rule the flow of execution"
      },
      {
        title: "The Function Foundry",
        story: "In the ancient Function Foundry, craftsmen forge reusable code blocks. Learn function definitions, parameters, and return values to create modular programs.",
        concept: "Functions and Scope",
        challenge: "Forge the perfect function"
      },
      {
        title: "The Array Arsenal",
        story: "The Array Arsenal stores collections of data in ordered formations. Master array indexing, multi-dimensional arrays, and string manipulation.",
        concept: "Arrays and Strings",
        challenge: "Command the data armies"
      },
      {
        title: "The Pointer Palace",
        story: "Your ultimate test awaits in the Pointer Palace, where memory addresses hold the keys to power. Master pointers, dynamic allocation, and memory management.",
        concept: "Pointers and Memory Management",
        challenge: "Unlock the memory secrets"
      }
    ]
  };

  // Generate concept explanation and YouTube videos (simulated)
  const generateConcept = async (language, chapter) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const conceptExplanations = {
        javascript: [
          {
            explanation: "Variables are containers that store data values in JavaScript. They're like magical boxes that hold different types of information - numbers, text, or even complex objects. You can create variables using 'let', 'const', or 'var' keywords. Think of variables as your spell components - each one holds a specific piece of magic you can use in your code!",
            keyPoints: [
              "Variables store data that can be used later",
              "'let' creates variables that can be changed",
              "'const' creates variables that stay the same",
              "Variable names should be descriptive"
            ],
            codeExample: `// Creating magical variables
let playerHealth = 100;
const spellPower = 50;
let playerName = "CodeWizard";

// Using variables
console.log(playerName + " has " + playerHealth + " health!");`,
            videos: [
              {
                title: "JavaScript Variables Explained",
                channel: "Programming with Mosh",
                duration: "12:45",
                views: "2.1M",
                thumbnail: "🎯",
                url: "https://www.youtube.com/watch?v=9YgAn-qjxUc"
              },
              {
                title: "Let vs Const vs Var - JavaScript Tutorial",
                channel: "Web Dev Simplified",
                duration: "8:23",
                views: "856K",
                thumbnail: "🔥",
                url: "https://www.youtube.com/watch?v=9WIJQDvt4Us"
              }
            ]
          },
          // Add more concepts for other chapters...
        ],
        python: [
          {
            explanation: "Python variables are like labeled containers that store different types of data. Unlike some languages, Python is dynamically typed, meaning you don't need to specify what type of data a variable will hold. You can store numbers, text, lists, or even more complex data structures. Python variables are created simply by assigning a value to a name!",
            keyPoints: [
              "Variables are created by assignment",
              "Python automatically determines data types",
              "Variable names should be descriptive and use snake_case",
              "You can change what type of data a variable holds"
            ],
            codeExample: `# Creating Python variables
player_health = 100
spell_power = 50.5
player_name = "PythonMage"
is_alive = True

# Python figures out the types automatically
print(f"{player_name} has {player_health} health points!")`,
            videos: [
              {
                title: "Python Variables and Data Types",
                channel: "Corey Schafer",
                duration: "15:32",
                views: "1.5M",
                thumbnail: "🐍",
                url: "https://www.youtube.com/watch?v=khKv-8q7YmY"
              },
              {
                title: "Python Basics: Variables and Assignment",
                channel: "Real Python",
                duration: "10:15",
                views: "432K",
                thumbnail: "📚",
                url: "https://www.youtube.com/watch?v=cQT33yu9pY8"
              }
            ]
          }
        ]
        // Add more languages...
      };
      
      setConceptData(conceptExplanations[language]?.[chapter] || conceptExplanations.javascript[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error generating concept:', error);
      setLoading(false);
    }
  };

  // Generate challenge using Gemini API (simulated)
  const generateChallenge = async (language, chapter) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const challenges = {
        javascript: [
          [
            {
              question: "Which keyword is used to declare a variable that can be reassigned in JavaScript?",
              options: ["const", "let", "var", "variable"],
              correct: 1,
              explanation: "The 'let' keyword creates variables that can be reassigned. 'const' is for constants, and 'var' is outdated."
            },
            {
              question: "What will be the output of: console.log(typeof 42);",
              options: ["'integer'", "'number'", "'digit'", "'int'"],
              correct: 1,
              explanation: "In JavaScript, all numbers (integers and decimals) have the type 'number'."
            },
            {
              question: "Which of the following is a valid variable name in JavaScript?",
              options: ["2players", "player-name", "player_name", "class"],
              correct: 2,
              explanation: "Variable names can't start with numbers, can't contain hyphens, and 'class' is a reserved keyword. 'player_name' is valid."
            }
          ]
        ],
        python: [
          [
            {
              question: "How do you create a variable in Python?",
              options: ["let name = 'Python'", "name = 'Python'", "var name = 'Python'", "const name = 'Python'"],
              correct: 1,
              explanation: "Python creates variables through simple assignment using the equals sign."
            },
            {
              question: "What naming convention is recommended for Python variables?",
              options: ["camelCase", "PascalCase", "snake_case", "kebab-case"],
              correct: 2,
              explanation: "Python follows snake_case convention for variable and function names."
            },
            {
              question: "Which statement about Python variables is true?",
              options: ["Must declare type", "Type is determined at runtime", "Cannot change types", "Must use keywords"],
              correct: 1,
              explanation: "Python is dynamically typed - variable types are determined automatically at runtime."
            }
          ]
        ]
      };
      
      setChallengeData(challenges[language]?.[chapter] || challenges.javascript[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error generating challenge:', error);
      setLoading(false);
    }
  };

  const handleStartChapter = async (chapterIndex) => {
    setCurrentChapter(chapterIndex);
    setCurrentStep('story');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResults(false);
  };

  const handleContinueFromStory = async () => {
    setCurrentStep('concept');
    await generateConcept(selectedLanguage, currentChapter);
  };

  const handleContinueFromConcept = async () => {
    setCurrentStep('challenge');
    await generateChallenge(selectedLanguage, currentChapter);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResults(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < challengeData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResults(false);
    } else {
      // All questions completed
      const isAllCorrect = challengeData.every((_, index) => {
        // This would need to be tracked properly in a real implementation
        return true; // Simplified for demo
      });
      
      if (isAllCorrect) {
        setUserProgress(prev => ({
          ...prev,
          [selectedLanguage]: {
            ...prev[selectedLanguage],
            completedChapters: [...prev[selectedLanguage].completedChapters, currentChapter],
            currentChapter: Math.max(prev[selectedLanguage].currentChapter, currentChapter + 1)
          }
        }));
      }
      
      resetChapter();
    }
  };

  const resetChapter = () => {
    setCurrentStep('story');
    setSelectedAnswer(null);
    setChallengeData(null);
    setConceptData(null);
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const goBackToLanguages = () => {
    setSelectedLanguage(null);
    setCurrentChapter(0);
    resetChapter();
  };

  // Custom styles
  const customStyles = `
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
        4px 4px 0px rgba(0, 255, 136, 0.3),
        8px 8px 0px rgba(0, 153, 255, 0.2),
        12px 12px 0px rgba(255, 0, 153, 0.1);
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
    
    .floating {
      animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    .progress-bar {
      background: linear-gradient(90deg, #00ff88, #0099ff);
      height: 8px;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
  `;

  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-white relative overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        
        {/* Floating pixel decorations */}
        <div className="floating-pixel absolute w-3 h-3 bg-green-400" style={{top: '15%', left: '8%', animationDelay: '0s'}}></div>
        <div className="floating-pixel absolute w-2 h-2 bg-blue-400" style={{top: '70%', right: '12%', animationDelay: '2s'}}></div>
        <div className="floating-pixel absolute w-2 h-2 bg-purple-400" style={{top: '85%', left: '15%', animationDelay: '4s'}}></div>
        <div className="floating-pixel absolute w-1 h-1 bg-yellow-400" style={{top: '25%', right: '20%', animationDelay: '1s'}}></div>
        
        <div className="scanlines w-full h-full absolute top-0 left-0 pointer-events-none"></div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="floating mb-8">
              <BookOpen className="w-24 h-24 mx-auto text-cyan-400 glow-text" />
            </div>
            <h1 className="pixel-font text-4xl md:text-6xl font-bold mb-6 glow-text text-green-400">
              STORY <span className="text-cyan-400">QUEST</span>
            </h1>
            <p className="pixel-font text-sm md:text-base max-w-4xl mx-auto text-green-300 leading-relaxed mb-8">
              Embark on an epic coding adventure! Choose your programming language and learn through 
              immersive stories, detailed explanations, and hands-on challenges.
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-cyan-400">
              <Star className="w-6 h-6 animate-pulse" fill="currentColor" />
              <span className="pixel-font text-sm">SELECT YOUR CODING DESTINY</span>
              <Star className="w-6 h-6 animate-pulse" fill="currentColor" />
            </div>
          </div>

          {/* Language Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(languages).map(([key, lang]) => (
              <div
                key={key}
                onClick={() => setSelectedLanguage(key)}
                className={`retro-card p-8 rounded-none border-4 border-white/20 hover:border-cyan-400/60 
                  cursor-pointer transform hover:scale-105 transition-all duration-300 pixel-shadow hover:shadow-2xl`}
              >
                <div className="text-center relative z-20">
                  <div className="text-6xl mb-4 floating">
                    {lang.icon}
                  </div>
                  <h3 className="pixel-font text-xl font-bold mb-4 text-cyan-400">
                    {lang.name}
                  </h3>
                  <p className="pixel-font text-xs text-green-300 mb-6 leading-relaxed">
                    {lang.description}
                  </p>
                  
                  {/* Progress indicator */}
                  <div className="mb-6">
                    <div className="flex justify-between pixel-font text-xs text-green-400 mb-2">
                      <span>PROGRESS</span>
                      <span>{userProgress[key]?.completedChapters?.length || 0}/5</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-none h-3 border-2 border-gray-600">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-cyan-400 h-full transition-all duration-500"
                        style={{width: `${((userProgress[key]?.completedChapters?.length || 0) / 5) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 text-green-400">
                    <Play className="w-5 h-5" />
                    <span className="pixel-font text-sm">BEGIN QUEST</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="retro-card rounded-none p-8 border-4 border-green-400/30 max-w-4xl mx-auto">
              <h2 className="pixel-font text-2xl font-bold mb-4 text-cyan-400 glow-text">
                🏆 BECOME A CODE LEGEND
              </h2>
              <p className="pixel-font text-xs text-green-300 leading-relaxed mb-6">
                Each language offers 5 epic chapters with immersive stories, detailed concept explanations,
                curated learning videos, and challenging quests to test your knowledge!
              </p>
              <div className="flex items-center justify-center space-x-8 pixel-font text-xs">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-green-400">Epic Stories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Youtube className="w-5 h-5 text-red-400" />
                  <span className="text-green-400">Video Guides</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-purple-400" />
                  <span className="text-green-400">Master Skills</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Story step
  if (currentStep === 'story') {
    const currentStoryChapter = storyChapters[selectedLanguage][currentChapter];
    const lang = languages[selectedLanguage];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-white relative overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        
        <div className="scanlines w-full h-full absolute top-0 left-0 pointer-events-none"></div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={goBackToLanguages}
              className="flex items-center space-x-2 text-green-400 hover:text-cyan-400 transition-colors pixel-font text-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>BACK</span>
            </button>
            <div className="text-center">
              <h1 className="pixel-font text-2xl font-bold text-cyan-400 mb-2">
                {lang.name} QUEST
              </h1>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-4xl">{lang.mascot}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="pixel-font text-xs text-green-400 mb-2">PROGRESS</div>
              <div className="pixel-font text-sm text-cyan-400">
                {userProgress[selectedLanguage]?.completedChapters?.length || 0}/5
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="max-w-4xl mx-auto">
            <div className="retro-card rounded-none border-4 border-cyan-400/50 p-8 mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 floating">{lang.icon}</div>
                <h2 className="pixel-font text-2xl font-bold text-cyan-400 mb-2 glow-text">
                  CHAPTER {currentChapter + 1}
                </h2>
                <h3 className="pixel-font text-lg text-green-400 mb-6">
                  {currentStoryChapter.title}
                </h3>
              </div>

              <div className="retro-card rounded-none p-6 mb-8 border-2 border-green-400/30">
                <p className="pixel-font text-sm text-green-300 leading-relaxed">
                  {currentStoryChapter.story}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="retro-card rounded-none p-4 border-2 border-yellow-400/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code className="w-5 h-5 text-yellow-400" />
                    <span className="pixel-font text-xs text-yellow-400">CONCEPT</span>
                  </div>
                  <p className="pixel-font text-xs text-green-300">{currentStoryChapter.concept}</p>
                </div>
                <div className="retro-card rounded-none p-4 border-2 border-purple-400/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <span className="pixel-font text-xs text-purple-400">CHALLENGE</span>
                  </div>
                  <p className="pixel-font text-xs text-green-300">{currentStoryChapter.challenge}</p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleContinueFromStory}
                  className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 
                    text-black px-8 py-4 rounded-none font-bold transition-all duration-300 transform hover:scale-105 
                    pixel-font text-sm border-2 border-green-300"
                >
                  <div className="flex items-center space-x-2">
                    <ChevronRight className="w-5 h-5" />
                    <span>CONTINUE TO LEARNING</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Concept explanation step
  if (currentStep === 'concept') {
    const lang = languages[selectedLanguage];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-white relative overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        
        <div className="scanlines w-full h-full absolute top-0 left-0 pointer-events-none"></div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setCurrentStep('story')}
              className="flex items-center space-x-2 text-green-400 hover:text-cyan-400 transition-colors pixel-font text-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>BACK TO STORY</span>
            </button>
            <div className="text-center">
              <h1 className="pixel-font text-2xl font-bold text-cyan-400">
                CONCEPT LEARNING
              </h1>
              <p className="pixel-font text-xs text-green-400">Chapter {currentChapter + 1}: {storyChapters[selectedLanguage][currentChapter].concept}</p>
            </div>
            <div className="text-right">
              <span className="pixel-font text-xs text-green-400">STEP 2/3</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mb-4"></div>
              <p className="pixel-font text-cyan-400">GENERATING CONCEPT...</p>
              <p className="pixel-font text-xs text-green-300 mt-2">AI is preparing your learning materials...</p>
            </div>
          ) : conceptData ? (
            <div className="max-w-6xl mx-auto">
              {/* Concept Explanation */}
              <div className="retro-card rounded-none border-4 border-cyan-400/50 p-8 mb-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">{lang.mascot}</div>
                  <h2 className="pixel-font text-2xl font-bold text-cyan-400 mb-4 glow-text">
                    CONCEPT EXPLANATION
                  </h2>
                </div>

                <div className="retro-card rounded-none p-6 mb-8 border-2 border-green-400/30">
                  <p className="pixel-font text-sm text-green-300 leading-relaxed">
                    {conceptData.explanation}
                  </p>
                </div>

                {/* Key Points */}
                <div className="mb-8">
                  <h3 className="pixel-font text-lg font-bold text-yellow-400 mb-4">KEY POINTS:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {conceptData.keyPoints.map((point, index) => (
                      <div key={index} className="retro-card rounded-none p-4 border-2 border-yellow-400/30">
                        <div className="flex items-start space-x-2">
                          <span className="pixel-font text-xs text-yellow-400 mt-1">{index + 1}.</span>
                          <span className="pixel-font text-xs text-green-300">{point}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Example */}
                <div className="mb-8">
                  <h3 className="pixel-font text-lg font-bold text-cyan-400 mb-4">CODE EXAMPLE:</h3>
                  <div className="retro-card rounded-none p-6 border-2 border-cyan-400/30 bg-black/50">
                    <pre className="pixel-font text-xs text-green-400 overflow-x-auto">
                      <code>{conceptData.codeExample}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* YouTube Videos Section */}
              <div className="retro-card rounded-none border-4 border-red-400/50 p-8 mb-8">
                <div className="text-center mb-8">
                  <Youtube className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h2 className="pixel-font text-2xl font-bold text-red-400 mb-2 glow-text">
                    RECOMMENDED VIDEOS
                  </h2>
                  <p className="pixel-font text-xs text-green-300">
                    Watch these curated videos to deepen your understanding
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {conceptData.videos.map((video, index) => (
                    <div key={index} className="retro-card rounded-none border-2 border-red-400/30 p-6 hover:border-red-400/60 transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{video.thumbnail}</div>
                        <div className="flex-1">
                          <h4 className="pixel-font text-sm font-bold text-red-400 mb-2 leading-tight">
                            {video.title}
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-green-400" />
                              <span className="pixel-font text-xs text-green-300">{video.channel}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4 text-yellow-400" />
                                <span className="pixel-font text-xs text-green-300">{video.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4 text-blue-400" />
                                <span className="pixel-font text-xs text-green-300">{video.views}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => window.open(video.url, '_blank')}
                            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-none text-xs pixel-font transition-colors duration-300 flex items-center space-x-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>WATCH</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Button */}
              <div className="text-center">
                <button
                  onClick={handleContinueFromConcept}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                    text-white px-8 py-4 rounded-none font-bold transition-all duration-300 transform hover:scale-105 
                    pixel-font text-sm border-2 border-purple-300"
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>READY FOR CHALLENGE</span>
                  </div>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // Challenge step
  if (currentStep === 'challenge') {
    const lang = languages[selectedLanguage];
    const currentQuestion = challengeData?.[currentQuestionIndex];
    const isCorrect = showResults && selectedAnswer === currentQuestion?.correct;
    const isLastQuestion = currentQuestionIndex === challengeData?.length - 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-white relative overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        
        <div className="scanlines w-full h-full absolute top-0 left-0 pointer-events-none"></div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setCurrentStep('concept')}
              className="flex items-center space-x-2 text-green-400 hover:text-cyan-400 transition-colors pixel-font text-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>BACK TO CONCEPT</span>
            </button>
            <div className="text-center">
              <h1 className="pixel-font text-2xl font-bold text-cyan-400">
                KNOWLEDGE CHALLENGE
              </h1>
              <p className="pixel-font text-xs text-green-400">
                Question {currentQuestionIndex + 1} of {challengeData?.length || 3}
              </p>
            </div>
            <div className="text-right">
              <span className="pixel-font text-xs text-green-400">STEP 3/3</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mb-4"></div>
              <p className="pixel-font text-cyan-400">GENERATING CHALLENGE...</p>
              <p className="pixel-font text-xs text-green-300 mt-2">AI is crafting your quest...</p>
            </div>
          ) : currentQuestion ? (
            <div className="max-w-4xl mx-auto">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between pixel-font text-xs text-green-400 mb-2">
                  <span>PROGRESS</span>
                  <span>{currentQuestionIndex + 1}/{challengeData.length}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-none h-3 border-2 border-gray-600">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-cyan-400 h-full transition-all duration-500"
                    style={{width: `${((currentQuestionIndex + 1) / challengeData.length) * 100}%`}}
                  ></div>
                </div>
              </div>

              {/* Challenge Card */}
              <div className="retro-card rounded-none border-4 border-cyan-400/50 p-8 mb-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">{lang.mascot}</div>
                  <h2 className="pixel-font text-2xl font-bold text-cyan-400 mb-4 glow-text">
                    CHALLENGE {currentQuestionIndex + 1}
                  </h2>
                </div>

                {/* Question */}
                <div className="retro-card rounded-none p-6 mb-8 border-2 border-purple-400/30">
                  <h3 className="pixel-font text-lg font-bold text-purple-400 mb-4">
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {currentQuestion.options.map((option, index) => {
                    let buttonClass = "retro-card p-4 rounded-none border-2 transition-all duration-300 text-left hover:scale-102 cursor-pointer";
                    
                    if (showResults) {
                      if (index === currentQuestion.correct) {
                        buttonClass += " border-green-400 bg-green-900/50 text-green-300";
                      } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correct) {
                        buttonClass += " border-red-400 bg-red-900/50 text-red-300";
                      } else {
                        buttonClass += " border-gray-600 bg-gray-800/30 text-gray-400";
                      }
                    } else {
                      if (selectedAnswer === index) {
                        buttonClass += " border-cyan-400 bg-cyan-900/50 text-cyan-300";
                      } else {
                        buttonClass += " border-gray-600 bg-gray-800/30 text-green-300 hover:border-cyan-400";
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => !showResults && setSelectedAnswer(index)}
                        className={buttonClass}
                        disabled={showResults}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-none border-2 border-current flex items-center justify-center">
                            <span className="pixel-font text-sm font-bold">{String.fromCharCode(65 + index)}</span>
                          </div>
                          <span className="pixel-font text-sm">{option}</span>
                          {showResults && index === currentQuestion.correct && (
                            <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                          )}
                          {showResults && index === selectedAnswer && selectedAnswer !== currentQuestion.correct && (
                            <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Submit Button */}
                {!showResults && (
                  <div className="text-center mb-6">
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={selectedAnswer === null}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 
                        disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                        px-8 py-3 rounded-none font-bold text-white transition-all duration-300 transform hover:scale-105 
                        pixel-font text-sm border-2 border-purple-300"
                    >
                      {selectedAnswer !== null ? 'SUBMIT ANSWER' : 'SELECT AN ANSWER'}
                    </button>
                  </div>
                )}

                {/* Results */}
                {showResults && (
                  <div className="text-center">
                    <div className={`retro-card p-6 rounded-none mb-6 border-2 ${isCorrect ? 'border-green-400 bg-green-900/30' : 'border-red-400 bg-red-900/30'}`}>
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-8 h-8 text-green-400" />
                            <span className="pixel-font text-xl text-green-400 glow-text">CORRECT!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-8 h-8 text-red-400" />
                            <span className="pixel-font text-xl text-red-400 glow-text">INCORRECT!</span>
                          </>
                        )}
                      </div>
                      <p className="pixel-font text-sm text-green-300 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>

                    <div className="flex justify-center space-x-4">
                      {isLastQuestion ? (
                        <button
                          onClick={resetChapter}
                          className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 
                            px-6 py-3 rounded-none font-bold text-black transition-all duration-300 transform hover:scale-105 
                            pixel-font text-sm border-2 border-green-300"
                        >
                          CHAPTER COMPLETE!
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 
                            px-6 py-3 rounded-none font-bold text-white transition-all duration-300 transform hover:scale-105 
                            pixel-font text-sm border-2 border-purple-300"
                        >
                          NEXT QUESTION
                        </button>
                      )}
                      {!isCorrect && (
                        <button
                          onClick={() => {
                            setShowResults(false);
                            setSelectedAnswer(null);
                          }}
                          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 
                            px-6 py-3 rounded-none font-bold text-white transition-all duration-300 transform hover:scale-105 
                            pixel-font text-sm border-2 border-blue-300"
                        >
                          TRY AGAIN
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // Main story view (chapter selection)
  const currentStory = storyChapters[selectedLanguage];
  const lang = languages[selectedLanguage];
  const progress = userProgress[selectedLanguage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-white relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Floating pixel decorations */}
      <div className="floating-pixel absolute w-3 h-3 bg-green-400" style={{top: '15%', left: '8%', animationDelay: '0s'}}></div>
      <div className="floating-pixel absolute w-2 h-2 bg-blue-400" style={{top: '70%', right: '12%', animationDelay: '2s'}}></div>
      <div className="floating-pixel absolute w-2 h-2 bg-purple-400" style={{top: '85%', left: '15%', animationDelay: '4s'}}></div>
      
      <div className="scanlines w-full h-full absolute top-0 left-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={goBackToLanguages}
            className="flex items-center space-x-2 text-green-400 hover:text-cyan-400 transition-colors pixel-font text-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>BACK TO LANGUAGES</span>
          </button>
          <div className="text-center">
            <h1 className="pixel-font text-3xl font-bold text-cyan-400 mb-2 glow-text">
              {lang.name} QUEST
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-4xl">{lang.mascot}</span>
              <span className="pixel-font text-xs text-green-400">{lang.description}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="pixel-font text-xs text-green-400 mb-2">PROGRESS</div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-800 rounded-none h-3 border-2 border-gray-600">
                <div 
                  className="bg-gradient-to-r from-green-400 to-cyan-400 h-full transition-all duration-500"
                  style={{width: `${((progress?.completedChapters?.length || 0) / 5) * 100}%`}}
                ></div>
              </div>
              <span className="pixel-font text-sm text-cyan-400 font-bold">{progress?.completedChapters?.length || 0}/5</span>
            </div>
          </div>
        </div>

        {/* Story Chapters */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {currentStory.map((chapter, index) => {
              const isCompleted = progress?.completedChapters?.includes(index);
              const isUnlocked = index === 0 || progress?.completedChapters?.includes(index - 1);
              const isCurrent = index === (progress?.currentChapter || 0);

              return (
                <div
                  key={index}
                  className={`relative retro-card rounded-none border-4 p-8 
                    transition-all duration-300 transform hover:scale-105 ${
                      isCompleted
                        ? "border-green-400/70 pixel-shadow"
                        : isUnlocked
                        ? "border-cyan-400/70 pixel-shadow cursor-pointer hover:border-cyan-300"
                        : "border-gray-600/50 opacity-60"
                    }`}
                >
                  {/* Chapter Status Icons */}
                  <div className="absolute top-4 right-4 z-30">
                    {isCompleted ? (
                      <div className="bg-green-500 rounded-none p-2 border-2 border-green-300">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    ) : !isUnlocked ? (
                      <div className="bg-gray-600 rounded-none p-2 border-2 border-gray-400">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    ) : isCurrent ? (
                      <div className="bg-cyan-500 rounded-none p-2 border-2 border-cyan-300 animate-pulse">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    ) : null}
                  </div>

                  {/* Chapter Content */}
                  <div className="mb-6 relative z-20">
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4 floating">{lang.icon}</div>
                      <h3 className="pixel-font text-sm font-bold text-cyan-400 mb-2">
                        CHAPTER {index + 1}
                      </h3>
                      <h4 className="pixel-font text-lg font-bold text-green-400 mb-4">
                        {chapter.title}
                      </h4>
                    </div>

                    <div className="retro-card rounded-none p-4 mb-6 border-2 border-green-400/30">
                      <p className="pixel-font text-xs text-green-300 leading-relaxed">
                        {chapter.story}
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3">
                        <Code className="w-5 h-5 text-cyan-400" />
                        <span className="pixel-font text-xs text-cyan-400 font-bold">
                          CONCEPT:
                        </span>
                        <span className="pixel-font text-xs text-green-300">
                          {chapter.concept}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="pixel-font text-xs text-yellow-400 font-bold">
                          CHALLENGE:
                        </span>
                        <span className="pixel-font text-xs text-green-300">
                          {chapter.challenge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chapter Action */}
                  <div className="text-center relative z-20">
                    {isCompleted ? (
                      <div className="bg-green-600/30 text-green-400 py-3 px-6 rounded-none border-2 border-green-400/50">
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-5 h-5" />
                          <span className="pixel-font text-sm font-bold">COMPLETED</span>
                        </div>
                      </div>
                    ) : !isUnlocked ? (
                      <div className="bg-gray-600/30 text-gray-400 py-3 px-6 rounded-none border-2 border-gray-500/50">
                        <div className="flex items-center justify-center space-x-2">
                          <Lock className="w-5 h-5" />
                          <span className="pixel-font text-sm font-bold">LOCKED</span>
                        </div>
                        <p className="pixel-font text-xs mt-2">
                          Complete Chapter {index} first
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartChapter(index)}
                        className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 
                          text-black py-3 px-6 rounded-none font-bold transition-all duration-300 transform hover:scale-105 
                          pixel-font text-sm border-2 border-green-300"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Play className="w-5 h-5" />
                          <span>{isCurrent ? "CONTINUE" : "START"} CHAPTER</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryQuest;