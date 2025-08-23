"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
  ArrowLeft,
  Play,
  Check,
  Clock,
  Trophy,
  Target,
  Terminal,
  CheckCircle,
  XCircle,
  RotateCcw,
  Lightbulb,
  Award,
  Star,
  Zap,
} from "lucide-react"

const ChallengePage = ({ node, onComplete, onBack, language }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [completedQuestions, setCompletedQuestions] = useState(new Set())
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [showHints, setShowHints] = useState(false)
  const [allTestsPassed, setAllTestsPassed] = useState(false)
  const codeEditorRef = useRef(null)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simple validation - just check if specific text exists in code
  const validateCode = useCallback((code, testCase) => {
    const codeText = code.toLowerCase().trim()
    
    switch (testCase.check) {
      case 'contains':
        return testCase.values.every(value => codeText.includes(value.toLowerCase()))
      
      case 'variable_declaration':
        return testCase.variables.every(variable => {
          const regex = new RegExp(`(let|const|var)\\s+${variable}`, 'i')
          return regex.test(code)
        })
      
      case 'function_declaration':
        return testCase.functions.every(func => {
          const regex = new RegExp(`(function\\s+${func}|const\\s+${func}\\s*=|${func}\\s*=\\s*function|${func}\\s*=>)`, 'i')
          return regex.test(code)
        })
      
      case 'has_return':
        return /return\s+/i.test(code)
      
      case 'has_if_else':
        return /if\s*\(/.test(code) && /else/.test(code)
      
      case 'has_switch':
        return /switch\s*\(/.test(code) && /case/.test(code)
      
      default:
        return false
    }
  }, [])

  const questions = useMemo(() => {
    const questionsDB = {
      javascript: {
        "js-basics-1": [
          {
            id: 1,
            title: "Variable Declaration",
            difficulty: 1,
            description: "Create variables using let, const, and understand their differences.",
            prompt: "Declare a constant variable named PI with value 3.14159, and a let variable named radius with value 5. Calculate the area of a circle and store it in a variable named area.",
            starterCode: "// Declare your variables here\n\n// Calculate area (area = PI * radius * radius)\n",
            testCases: [
              { 
                description: "Should declare PI constant", 
                check: "variable_declaration", 
                variables: ["PI"]
              },
              { 
                description: "Should declare radius variable", 
                check: "variable_declaration", 
                variables: ["radius"]
              },
              { 
                description: "Should calculate area variable", 
                check: "variable_declaration", 
                variables: ["area"]
              },
              {
                description: "Should use PI and radius in calculation",
                check: "contains",
                values: ["PI", "radius"]
              }
            ],
            hints: [
              "Use const for values that won't change (like PI)",
              "Use let for variables that might be reassigned",
              "Area of circle = π × r² (PI * radius * radius)",
              "Make sure to assign values: const PI = 3.14159"
            ],
          },
          {
            id: 2,
            title: "Data Types",
            difficulty: 1,
            description: "Work with different JavaScript data types.",
            prompt: 'Create variables: myString with "Hello World", myNumber with 42, myBoolean with true, and myArray with [1, 2, 3, 4, 5].',
            starterCode: "// Create variables of different types\nlet myString = ;\nlet myNumber = ;\nlet myBoolean = ;\nlet myArray = ;\n\n// Optional: log them to see the values\nconsole.log(myString, myNumber, myBoolean, myArray);",
            testCases: [
              { 
                description: "Should declare myString variable", 
                check: "variable_declaration", 
                variables: ["myString"]
              },
              { 
                description: "Should include 'Hello World' string", 
                check: "contains", 
                values: ['"Hello World"', "'Hello World'"]
              },
              { 
                description: "Should declare myNumber with 42", 
                check: "contains", 
                values: ["42"]
              },
              { 
                description: "Should declare myArray with brackets", 
                check: "contains", 
                values: ["[", "]"]
              }
            ],
            hints: [
              "Strings are wrapped in quotes: 'Hello World' or \"Hello World\"",
              "Numbers are written without quotes: 42",
              "Booleans are: true or false",
              "Arrays use square brackets: [1, 2, 3, 4, 5]"
            ],
          },
          {
            id: 3,
            title: "Functions",
            difficulty: 2,
            description: "Create and call basic functions.",
            prompt: "Create a function named greet that takes a name parameter and returns a greeting message like 'Hello, [name]!'",
            starterCode: "// Create your function here\nfunction greet(name) {\n  // Your code here\n}\n\n// Test your function\nconsole.log(greet('Alice'));",
            testCases: [
              { 
                description: "Should declare greet function", 
                check: "function_declaration", 
                functions: ["greet"]
              },
              { 
                description: "Function should have return statement", 
                check: "has_return"
              },
              { 
                description: "Should use the name parameter", 
                check: "contains", 
                values: ["name"]
              },
              {
                description: "Should return a greeting message",
                check: "contains",
                values: ["Hello", "return"]
              }
            ],
            hints: [
              "Functions can take parameters: function greet(name)",
              "Use return to send a value back",
              "You can use template literals: `Hello, ${name}!`",
              "Or string concatenation: 'Hello, ' + name + '!'"
            ],
          },
        ],
        "js-basics-2": [
          {
            id: 1,
            title: "Arrow Functions",
            difficulty: 2,
            description: "Practice with ES6 arrow function syntax.",
            prompt: "Create an arrow function called addNumbers that takes two parameters (a, b) and returns their sum.",
            starterCode: "// Create arrow function here\nconst addNumbers = ;\n\n// Test your function\nconsole.log(addNumbers(5, 3));",
            testCases: [
              { 
                description: "Should use arrow function syntax", 
                check: "contains", 
                values: ["=>"]
              },
              { 
                description: "Should declare addNumbers", 
                check: "contains", 
                values: ["addNumbers"]
              },
              { 
                description: "Should have parameters a and b", 
                check: "contains", 
                values: ["a", "b"]
              },
              {
                description: "Should return sum (a + b)",
                check: "contains",
                values: ["+"]
              }
            ],
            hints: [
              "Arrow functions use => syntax",
              "Format: const functionName = (param1, param2) => expression",
              "For single expressions, you can omit return and braces",
              "Example: const add = (a, b) => a + b"
            ],
          },
        ],
        "js-basics-3": [
          {
            id: 1,
            title: "If-Else Statements",
            difficulty: 2,
            description: "Learn conditional logic with if-else statements.",
            prompt: 'Create a function called checkAge that takes an age parameter and returns "Adult" if age >= 18, "Teen" if age >= 13, or "Child" otherwise.',
            starterCode: "function checkAge(age) {\n  // Your conditional logic here\n}\n\n// Test your function\nconsole.log(checkAge(25));\nconsole.log(checkAge(16));\nconsole.log(checkAge(8));",
            testCases: [
              { 
                description: "Should have if-else statements", 
                check: "has_if_else"
              },
              { 
                description: "Should check for Adult condition", 
                check: "contains", 
                values: ["Adult", "18"]
              },
              { 
                description: "Should check for Teen condition", 
                check: "contains", 
                values: ["Teen", "13"]
              },
              {
                description: "Should have Child as default case",
                check: "contains",
                values: ["Child"]
              }
            ],
            hints: [
              "Use if, else if, and else statements",
              "Check age >= 18 for Adult",
              "Check age >= 13 for Teen (but less than 18)",
              "Use else for Child (less than 13)"
            ],
          },
          {
            id: 2,
            title: "Switch Statements", 
            difficulty: 2,
            description: "Practice switch statements for multiple conditions.",
            prompt: 'Create a function getDayType that takes a day number (1-7) and returns "Weekend" for Saturday(6) and Sunday(7), "Weekday" for Monday-Friday(1-5).',
            starterCode: "function getDayType(dayNumber) {\n  switch(dayNumber) {\n    // Your cases here\n  }\n}\n\n// Test your function\nconsole.log(getDayType(1)); // Monday\nconsole.log(getDayType(6)); // Saturday",
            testCases: [
              { 
                description: "Should use switch statement", 
                check: "has_switch"
              },
              { 
                description: "Should handle Weekend cases", 
                check: "contains", 
                values: ["Weekend"]
              },
              { 
                description: "Should handle Weekday cases", 
                check: "contains", 
                values: ["Weekday"]
              },
              {
                description: "Should have case statements",
                check: "contains",
                values: ["case"]
              }
            ],
            hints: [
              "Use switch statement with case labels",
              "Cases 6 and 7 should return 'Weekend'",
              "Cases 1-5 should return 'Weekday'",
              "Don't forget break statements!"
            ],
          },
        ],
      }
    }

    return questionsDB[language]?.[node?.id] || []
  }, [language, node?.id])

  const currentQ = questions[currentQuestion]

  useEffect(() => {
    if (currentQ) {
      setCode(currentQ.starterCode || "")
      setTestResults([])
      setAllTestsPassed(false)
      setOutput("")
      setShowHints(false)
    }
  }, [currentQuestion, currentQ])

  const runCode = useCallback(async () => {
    setIsRunning(true)
    setOutput("")

    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate processing

      const results = currentQ.testCases.map((testCase, index) => {
        const passed = validateCode(code, testCase)
        return {
          id: index,
          description: testCase.description,
          passed: passed,
        }
      })

      setTestResults(results)
      const allPassed = results.every(r => r.passed)
      setAllTestsPassed(allPassed)

      let outputText = ""
      if (allPassed) {
        outputText = "✅ All tests passed! Great work!\n\n🎉 Click 'Complete' to move to the next question."
      } else {
        outputText = "❌ Some tests failed. Check your code and try again.\n\n💡 Make sure your code matches the requirements exactly."
      }

      setOutput(outputText)
    } catch (error) {
      setOutput("❌ Error checking code: " + error.message)
    } finally {
      setIsRunning(false)
    }
  }, [code, currentQ, validateCode])

  const completeQuestion = useCallback(() => {
    if (allTestsPassed) {
      const newCompleted = new Set(completedQuestions)
      newCompleted.add(currentQ.id)
      setCompletedQuestions(newCompleted)

      if (newCompleted.size === questions.length) {
        setTimeout(() => {
          onComplete(node.id)
        }, 1500)
      }
    }
  }, [allTestsPassed, completedQuestions, currentQ?.id, questions.length, onComplete, node?.id])

  const nextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }, [currentQuestion, questions.length])

  const prevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }, [currentQuestion])

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }, [])

  const getProgressPercentage = useCallback(() => {
    return Math.round((completedQuestions.size / questions.length) * 100)
  }, [completedQuestions.size, questions.length])

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-400 mb-4">No questions available for this node</div>
          <button onClick={onBack} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded border-2 border-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-purple-400">
                {node?.name || "JavaScript Basics"}
              </h1>
              <div className="text-xs text-gray-400 mt-1">
                Challenge {currentQuestion + 1} of {questions.length}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-black/50 p-2 rounded border border-purple-400/30">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-white">{formatTime(timeSpent)}</span>
              </div>
            </div>
            <div className="bg-black/50 p-2 rounded border border-green-400/30">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white">{getProgressPercentage()}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 h-3 rounded border border-gray-600">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded transition-all duration-1000"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">Progress</span>
            <span className="text-xs text-white">
              {completedQuestions.size}/{questions.length} completed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 border border-gray-600 p-6 mb-6 rounded">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-cyan-400">{currentQ.title}</h2>
                <div className="flex items-center space-x-1">
                  {[...Array(currentQ.difficulty)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed mb-4">{currentQ.description}</p>

              <div className="bg-gray-800/50 p-4 rounded border border-gray-600 mb-4">
                <h3 className="text-sm text-yellow-400 mb-2 font-semibold">Task:</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{currentQ.prompt}</p>
              </div>

              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 text-xs transition-colors flex items-center justify-center rounded"
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  {showHints ? "Hide" : "Show"} Hints
                </button>
                <button
                  onClick={() => setCode(currentQ.starterCode)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 text-xs transition-colors flex items-center justify-center rounded"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {showHints && (
                <div className="bg-yellow-900/30 p-4 rounded border border-yellow-600/30">
                  <h3 className="text-sm text-yellow-400 mb-2 font-semibold">Hints:</h3>
                  <ul className="space-y-1">
                    {currentQ.hints.map((hint, index) => (
                      <li key={index} className="text-xs text-gray-300 flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Question Navigation */}
            <div className="bg-gray-800/50 border border-gray-600 p-4 rounded">
              <h3 className="text-sm font-bold text-white mb-3">Questions</h3>
              <div className="grid grid-cols-3 gap-2">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`p-2 text-xs transition-all duration-300 rounded ${
                      completedQuestions.has(q.id)
                        ? "bg-green-600 text-white"
                        : index === currentQuestion
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {completedQuestions.has(q.id) ? <Check className="w-3 h-3 mx-auto" /> : index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 border border-gray-600 p-6 mb-6 rounded">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-green-400 flex items-center">
                  <Terminal className="w-5 h-5 mr-2" />
                  Code Editor
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-2 text-xs font-bold transition-all duration-300 flex items-center rounded"
                  >
                    {isRunning ? (
                      <>
                        <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full mr-2" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-2" />
                        Check Code
                      </>
                    )}
                  </button>

                  {allTestsPassed && (
                    <button
                      onClick={completeQuestion}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 text-xs font-bold transition-all duration-300 flex items-center rounded"
                    >
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Complete
                    </button>
                  )}
                </div>
              </div>

              <div className="relative">
                <textarea
                  ref={codeEditorRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 p-4 text-white resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 rounded"
                  placeholder="Write your code here..."
                  spellCheck="false"
                  style={{
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #333",
                    fontFamily: "'Courier New', monospace",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 pointer-events-none">
                  {language.toUpperCase()}
                </div>
              </div>

              {/* Output */}
              {output && (
                <div className="mt-4 bg-black p-4 rounded border border-gray-600">
                  <h3 className="text-sm text-cyan-400 mb-2 font-semibold">Output:</h3>
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">{output}</pre>
                </div>
              )}
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-600 p-6 rounded">
                <h2 className="text-lg font-bold text-orange-400 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Test Results
                </h2>

                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={result.id}
                      className={`p-4 rounded border-l-4 ${
                        result.passed
                          ? "border-l-green-400 bg-green-900/20"
                          : "border-l-red-400 bg-red-900/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white font-medium">Test {index + 1}</span>
                        {result.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        {result.description}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-gray-800/50 rounded border border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">
                      Tests Passed: {testResults.filter((r) => r.passed).length}/{testResults.length}
                    </span>
                    <div className="flex items-center space-x-2">
                      {allTestsPassed ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-sm text-green-400 font-semibold">All Tests Passed!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-400" />
                          <span className="text-sm text-red-400 font-semibold">Some Tests Failed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white px-6 py-3 text-sm transition-colors flex items-center rounded"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="flex items-center space-x-4">
            {completedQuestions.size === questions.length && (
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 rounded border-2 border-green-400 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-6 h-6 text-yellow-400 mr-2" />
                  <span className="text-sm text-white font-bold">Node Completed!</span>
                </div>
                <div className="text-xs text-gray-200">+{node?.xp || 100} XP earned</div>
              </div>
            )}
          </div>

          <button
            onClick={nextQuestion}
            disabled={currentQuestion === questions.length - 1}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white px-6 py-3 text-sm transition-colors flex items-center rounded"
          >
            Next
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </button>
        </div>

        {/* Completion Modal */}
        {completedQuestions.size === questions.length && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-600 p-8 max-w-md w-full text-center rounded">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">Congratulations!</h2>
                <p className="text-sm text-gray-300">
                  You've completed all challenges for {node?.name || "this section"}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded">
                  <span className="text-sm text-gray-300">Challenges:</span>
                  <span className="text-sm text-green-400 font-bold">
                    {questions.length}/{questions.length}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onComplete(node?.id || "completed")}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-4 text-sm font-bold transform hover:scale-105 transition-all duration-300 flex items-center justify-center rounded"
              >
                <Zap className="w-4 h-4 mr-2" />
                Continue Journey
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Demo component to test the ChallengePage
const App = () => {
  const [showChallenge, setShowChallenge] = useState(true)

  const demoNode = {
    id: "js-basics-1",
    name: "JavaScript Basics - Variables & Types",
    xp: 150,
  }

  const handleComplete = (nodeId) => {
    console.log("Completed node:", nodeId)
    setShowChallenge(false)
  }

  const handleBack = () => {
    console.log("Going back to skill tree")
    setShowChallenge(false)
  }

  if (!showChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-green-400">Challenge Completed!</h1>
          <p className="text-gray-300 mb-6">Great job on completing the JavaScript basics challenges.</p>
          <button
            onClick={() => setShowChallenge(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return <ChallengePage node={demoNode} onComplete={handleComplete} onBack={handleBack} language="javascript" />
}

export default App