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
  Sparkles
} from 'lucide-react';

const StoryQuest = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showChallenge, setShowChallenge] = useState(false);
  const [userProgress, setUserProgress] = useState({
    javascript: { completedChapters: [], currentChapter: 0 },
    python: { completedChapters: [], currentChapter: 0 },
    java: { completedChapters: [], currentChapter: 0 },
    cpp: { completedChapters: [], currentChapter: 0 },
    c: { completedChapters: [], currentChapter: 0 }
  });
  const [challengeData, setChallengeData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Generate challenge using Gemini API (simulated)
  const generateChallenge = async (language, chapter) => {
    setLoading(true);
    try {
      // Simulate API call to Gemini
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const challenges = {
        javascript: [
          {
            question: "Which of the following is the correct way to declare a variable in JavaScript that can be reassigned?",
            options: ["const myVar = 5;", "let myVar = 5;", "var myVar := 5;", "variable myVar = 5;"],
            correct: 1,
            explanation: "The 'let' keyword is used to declare variables that can be reassigned. 'const' is for constants, and the other options are invalid syntax."
          },
          {
            question: "What is the correct syntax for creating a function in JavaScript?",
            options: ["function myFunc[] {}", "func myFunc() {}", "function myFunc() {}", "def myFunc():"],
            correct: 2,
            explanation: "JavaScript functions are declared using the 'function' keyword followed by the function name and parentheses."
          },
          {
            question: "How do you access the first element of an array called 'myArray'?",
            options: ["myArray[1]", "myArray.first()", "myArray[0]", "myArray.get(0)"],
            correct: 2,
            explanation: "Arrays in JavaScript are zero-indexed, so the first element is at index 0."
          },
          {
            question: "Which method is used to add a property to a JavaScript object?",
            options: ["object.addProperty()", "object.property = value", "object.set('property', value)", "object.push(property)"],
            correct: 1,
            explanation: "You can add properties to JavaScript objects using dot notation or bracket notation."
          },
          {
            question: "How do you select an HTML element with id 'myElement' using JavaScript?",
            options: ["document.select('#myElement')", "document.getElementById('myElement')", "document.find('myElement')", "getElementById('#myElement')"],
            correct: 1,
            explanation: "document.getElementById() is the correct method to select an element by its ID."
          }
        ],
        python: [
          {
            question: "Which of the following is the correct way to declare a variable in Python?",
            options: ["let my_var = 5", "my_var = 5", "var my_var = 5", "int my_var = 5"],
            correct: 1,
            explanation: "Python uses simple assignment with the equals sign. No keyword is needed to declare variables."
          },
          {
            question: "What is the correct way to write an if statement in Python?",
            options: ["if (x == 5):", "if x == 5:", "if x == 5 then:", "if (x == 5) then:"],
            correct: 1,
            explanation: "Python if statements don't require parentheses and end with a colon."
          },
          {
            question: "Which loop is used to iterate over a sequence in Python?",
            options: ["foreach item in sequence:", "for item in sequence:", "loop item in sequence:", "iterate item in sequence:"],
            correct: 1,
            explanation: "Python uses 'for item in sequence:' syntax to iterate over sequences."
          },
          {
            question: "How do you add an item to the end of a Python list?",
            options: ["list.add(item)", "list.append(item)", "list.push(item)", "list.insert(item)"],
            correct: 1,
            explanation: "The append() method adds an item to the end of a Python list."
          },
          {
            question: "What is the correct syntax for defining a function in Python?",
            options: ["function my_func():", "def my_func():", "func my_func():", "define my_func():"],
            correct: 1,
            explanation: "Python functions are defined using the 'def' keyword."
          }
        ],
        java: [
          {
            question: "Which keyword is used to create a class in Java?",
            options: ["class", "Class", "object", "Object"],
            correct: 0,
            explanation: "The 'class' keyword is used to define classes in Java."
          },
          {
            question: "What is the correct way to declare the main method in Java?",
            options: ["public static void main(String args[])", "public void main(String args[])", "static void main(String args[])", "public main(String args[])"],
            correct: 0,
            explanation: "The main method must be public, static, void, and take a String array as parameter."
          },
          {
            question: "Which keyword is used for inheritance in Java?",
            options: ["inherits", "extends", "implements", "derives"],
            correct: 1,
            explanation: "The 'extends' keyword is used for class inheritance in Java."
          },
          {
            question: "What keyword is used to create an interface in Java?",
            options: ["interface", "abstract", "contract", "protocol"],
            correct: 0,
            explanation: "The 'interface' keyword is used to define interfaces in Java."
          },
          {
            question: "Which block is used to handle exceptions in Java?",
            options: ["catch-throw", "try-catch", "handle-error", "exception-catch"],
            correct: 1,
            explanation: "Java uses try-catch blocks to handle exceptions."
          }
        ],
        cpp: [
          {
            question: "Which operator is used to access the value at a memory address in C++?",
            options: ["&", "*", "->", "."],
            correct: 1,
            explanation: "The dereference operator (*) is used to access the value stored at a memory address."
          },
          {
            question: "What is the correct way to declare a class in C++?",
            options: ["class MyClass {}", "Class MyClass {}", "class MyClass();", "MyClass class {}"],
            correct: 0,
            explanation: "Classes in C++ are declared using the 'class' keyword followed by the class name and braces."
          },
          {
            question: "Which keyword is used to create a template in C++?",
            options: ["generic", "template", "type", "typename"],
            correct: 1,
            explanation: "The 'template' keyword is used to create templates in C++."
          },
          {
            question: "Which STL container is best for storing key-value pairs?",
            options: ["vector", "list", "map", "stack"],
            correct: 2,
            explanation: "std::map is the STL container designed for storing key-value pairs."
          },
          {
            question: "What is the purpose of inline functions in C++?",
            options: ["To save memory", "To improve performance", "To handle errors", "To create templates"],
            correct: 1,
            explanation: "Inline functions are used to improve performance by reducing function call overhead."
          }
        ],
        c: [
          {
            question: "Which function is used to print output in C?",
            options: ["print()", "printf()", "cout", "write()"],
            correct: 1,
            explanation: "printf() is the standard function for formatted output in C."
          },
          {
            question: "What is the correct syntax for an if statement in C?",
            options: ["if x == 5 then", "if (x == 5)", "if x == 5:", "if (x == 5) then"],
            correct: 1,
            explanation: "C if statements require parentheses around the condition."
          },
          {
            question: "How do you declare a function in C?",
            options: ["function int myFunc()", "int myFunc()", "def int myFunc()", "func int myFunc()"],
            correct: 1,
            explanation: "C functions are declared with return type followed by function name and parameters in parentheses."
          },
          {
            question: "How do you declare an array of 10 integers in C?",
            options: ["int array[10];", "int[10] array;", "array int[10];", "int array(10);"],
            correct: 0,
            explanation: "Arrays in C are declared as type name[size]."
          },
          {
            question: "Which operator is used to get the address of a variable in C?",
            options: ["*", "&", "->", "."],
            correct: 1,
            explanation: "The address-of operator (&) is used to get the memory address of a variable."
          }
        ]
      };
      
      setChallengeData(challenges[language][chapter]);
      setLoading(false);
    } catch (error) {
      console.error('Error generating challenge:', error);
      setLoading(false);
    }
  };

  const handleStartChapter = async (chapterIndex) => {
    setCurrentChapter(chapterIndex);
    await generateChallenge(selectedLanguage, chapterIndex);
    setShowChallenge(true);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowResults(true);
    
    if (selectedAnswer === challengeData.correct) {
      // Mark chapter as completed
      setUserProgress(prev => ({
        ...prev,
        [selectedLanguage]: {
          ...prev[selectedLanguage],
          completedChapters: [...prev[selectedLanguage].completedChapters, currentChapter],
          currentChapter: Math.max(prev[selectedLanguage].currentChapter, currentChapter + 1)
        }
      }));
    }
  };

  const resetChallenge = () => {
    setShowChallenge(false);
    setShowResults(false);
    setSelectedAnswer(null);
    setChallengeData(null);
  };

  const goBackToLanguages = () => {
    setSelectedLanguage(null);
    setCurrentChapter(0);
    resetChallenge();
  };

  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <style dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
            
            .pixel-font {
              font-family: 'Press Start 2P', monospace;
            }
            
            .glow-text {
              text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
            }
            
            .floating {
              animation: float 3s ease-in-out infinite;
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            
            .pulse-glow {
              animation: pulseGlow 2s ease-in-out infinite alternate;
            }
            
            @keyframes pulseGlow {
              from { box-shadow: 0 0 20px rgba(139, 69, 19, 0.5); }
              to { box-shadow: 0 0 30px rgba(139, 69, 19, 0.8), 0 0 40px rgba(255, 215, 0, 0.3); }
            }
          `
        }} />

        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="floating mb-8">
              <BookOpen className="w-24 h-24 mx-auto text-yellow-400 glow-text" />
            </div>
            <h1 className="pixel-font text-4xl md:text-6xl font-bold mb-6 glow-text text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-400 to-cyan-400">
              STORY QUEST
            </h1>
            <p className="text-lg md:text-xl max-w-4xl mx-auto text-purple-200 leading-relaxed mb-8">
              Embark on an epic coding adventure! Choose your programming language and learn through 
              immersive stories, challenges, and quests. Master the fundamentals while saving digital realms!
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-yellow-400">
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
                className={`bg-gradient-to-br ${lang.color} p-8 rounded-2xl border-4 border-white/20 hover:border-white/40 
                  cursor-pointer transform hover:scale-105 transition-all duration-300 pulse-glow hover:shadow-2xl`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 floating">
                    {lang.icon}
                  </div>
                  <h3 className="pixel-font text-xl font-bold mb-4 text-white">
                    {lang.name}
                  </h3>
                  <p className="text-white/90 mb-6 text-sm leading-relaxed">
                    {lang.description}
                  </p>
                  
                  {/* Progress indicator */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-white/70 mb-2">
                      <span>Progress</span>
                      <span>{userProgress[key]?.completedChapters?.length || 0}/5</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full transition-all duration-500"
                        style={{width: `${((userProgress[key]?.completedChapters?.length || 0) / 5) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 text-white">
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
            <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 rounded-2xl p-8 border border-purple-400/30 max-w-4xl mx-auto">
              <h2 className="pixel-font text-2xl font-bold mb-4 text-yellow-400">
                🏆 BECOME A CODE LEGEND
              </h2>
              <p className="text-purple-200 leading-relaxed mb-6">
                Each language offers a unique adventure with 5 epic chapters. Complete challenges, 
                earn achievements, and unlock new programming powers as you progress through your coding journey!
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">Epic Stories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <span className="text-white">AI Challenges</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-purple-400" />
                  <span className="text-white">Master Skills</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showChallenge) {
    const isCorrect = showResults && selectedAnswer === challengeData?.correct;
    const isCompleted = userProgress[selectedLanguage]?.completedChapters?.includes(currentChapter);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={resetChallenge}
              className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Story</span>
            </button>
            <div className="text-center">
              <h1 className="pixel-font text-2xl font-bold text-yellow-400">
                {languages[selectedLanguage].name} Challenge
              </h1>
              <p className="text-purple-300">Chapter {currentChapter + 1}</p>
            </div>
            <div className="text-right">
              <span className="text-purple-300 text-sm">
                Progress: {userProgress[selectedLanguage]?.completedChapters?.length || 0}/5
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mb-4"></div>
              <p className="pixel-font text-yellow-400">Generating Challenge...</p>
              <p className="text-purple-300 mt-2">The AI is crafting your quest...</p>
            </div>
          ) : challengeData ? (
            <div className="max-w-4xl mx-auto">
              {/* Challenge Card */}
              <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl border-4 border-purple-400/50 p-8 mb-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">
                    {languages[selectedLanguage].mascot}
                  </div>
                  <h2 className="pixel-font text-2xl font-bold text-yellow-400 mb-4">
                    Knowledge Challenge
                  </h2>
                  <p className="text-purple-300">
                    Test your understanding of: <span className="text-cyan-400 font-bold">
                      {storyChapters[selectedLanguage][currentChapter].concept}
                    </span>
                  </p>
                </div>

                {/* Question */}
                <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-xl p-6 mb-8 border border-purple-400/30">
                  <h3 className="text-xl font-bold text-white mb-4">
                    {challengeData.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {challengeData.options.map((option, index) => {
                    let buttonClass = "p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-102";
                    
                    if (showResults) {
                      if (index === challengeData.correct) {
                        buttonClass += " bg-green-600/50 border-green-400 text-green-100";
                      } else if (index === selectedAnswer && selectedAnswer !== challengeData.correct) {
                        buttonClass += " bg-red-600/50 border-red-400 text-red-100";
                      } else {
                        buttonClass += " bg-gray-600/30 border-gray-500 text-gray-300";
                      }
                    } else {
                      if (selectedAnswer === index) {
                        buttonClass += " bg-yellow-600/50 border-yellow-400 text-yellow-100";
                      } else {
                        buttonClass += " bg-gray-700/50 border-gray-600 text-white hover:border-purple-400 cursor-pointer";
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
                          <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                            <span className="text-sm font-bold">{String.fromCharCode(65 + index)}</span>
                          </div>
                          <span>{option}</span>
                          {showResults && index === challengeData.correct && (
                            <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                          )}
                          {showResults && index === selectedAnswer && selectedAnswer !== challengeData.correct && (
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
                        px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105"
                    >
                      {selectedAnswer !== null ? 'Submit Answer' : 'Select an Answer'}
                    </button>
                  </div>
                )}

                {/* Results */}
                {showResults && (
                  <div className="text-center">
                    <div className={`p-6 rounded-xl mb-6 ${isCorrect ? 'bg-green-600/30 border-green-400' : 'bg-red-600/30 border-red-400'} border-2`}>
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-8 h-8 text-green-400" />
                            <span className="pixel-font text-xl text-green-400">CORRECT!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-8 h-8 text-red-400" />
                            <span className="pixel-font text-xl text-red-400">INCORRECT!</span>
                          </>
                        )}
                      </div>
                      <p className="text-white leading-relaxed">
                        {challengeData.explanation}
                      </p>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={resetChallenge}
                        className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 
                          px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105"
                      >
                        Continue Story
                      </button>
                      {!isCorrect && (
                        <button
                          onClick={() => {
                            setShowResults(false);
                            setSelectedAnswer(null);
                          }}
                          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 
                            px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105"
                        >
                          Try Again
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

  // Main story view
  const currentStory = storyChapters[selectedLanguage];
  const lang = languages[selectedLanguage];
  const progress = userProgress[selectedLanguage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={goBackToLanguages}
            className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Languages</span>
          </button>
          <div className="text-center">
            <h1 className="pixel-font text-3xl font-bold text-yellow-400 mb-2">
              {lang.name} Quest
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-4xl">{lang.mascot}</span>
              <span className="text-purple-300">{lang.description}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-purple-300 text-sm mb-2">Progress</div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full transition-all duration-500"
                  style={{width: `${((progress?.completedChapters?.length || 0) / 5) * 100}%`}}
                ></div>
              </div>
              <span className="text-yellow-400 font-bold">{progress?.completedChapters?.length || 0}/5</span>
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
                  className={`relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl border-4 p-8 
                    transition-all duration-300 transform hover:scale-105 ${
                      isCompleted
                        ? "border-green-400/70 shadow-green-400/20"
                        : isUnlocked
                        ? "border-purple-400/70 shadow-purple-400/20 cursor-pointer hover:border-purple-300"
                        : "border-gray-600/50 opacity-60"
                    } shadow-2xl`}
                >
                  {/* Chapter Status Icons */}
                  <div className="absolute top-4 right-4">
                    {isCompleted ? (
                      <div className="bg-green-500 rounded-full p-2">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    ) : !isUnlocked ? (
                      <div className="bg-gray-600 rounded-full p-2">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    ) : isCurrent ? (
                      <div className="bg-yellow-500 rounded-full p-2 animate-pulse">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    ) : null}
                  </div>

                  {/* Chapter Content */}
                  <div className="mb-6">
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{lang.icon}</div>
                      <h3 className="pixel-font text-lg font-bold text-yellow-400 mb-2">
                        Chapter {index + 1}
                      </h3>
                      <h4 className="text-xl font-bold text-white mb-4">
                        {chapter.title}
                      </h4>
                    </div>

                    <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-xl p-4 mb-6 border border-purple-400/30">
                      <p className="text-purple-200 leading-relaxed text-sm">
                        {chapter.story}
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3">
                        <Code className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm text-cyan-400 font-bold">
                          Concept:
                        </span>
                        <span className="text-white text-sm">
                          {chapter.concept}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-yellow-400 font-bold">
                          Challenge:
                        </span>
                        <span className="text-white text-sm">
                          {chapter.challenge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chapter Action */}
                  <div className="text-center">
                    {isCompleted ? (
                      <div className="bg-green-600/30 text-green-400 py-3 px-6 rounded-xl border border-green-400/50">
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-bold">Completed</span>
                        </div>
                      </div>
                    ) : !isUnlocked ? (
                      <div className="bg-gray-600/30 text-gray-400 py-3 px-6 rounded-xl border border-gray-500/50">
                        <div className="flex items-center justify-center space-x-2">
                          <Lock className="w-5 h-5" />
                          <span className="font-bold">Locked</span>
                        </div>
                        <p className="text-xs mt-2">
                          Complete Chapter {index} first
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartChapter(index)}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 
                          text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Play className="w-5 h-5" />
                          <span>{isCurrent ? "Continue" : "Start"} Chapter</span>
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