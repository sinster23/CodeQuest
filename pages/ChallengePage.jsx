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
  AlertCircle,
  Loader
} from "lucide-react"

const ChallengePage = ({ node, onComplete, onBack, language }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [completedQuestions, setCompletedQuestions] = useState(new Set())
  const [code, setCode] = useState("")
  const [apiResponse, setApiResponse] = useState(null)
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [showHints, setShowHints] = useState(false)
  const [allTestsPassed, setAllTestsPassed] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const [questions, setQuestions] = useState([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [questionsError, setQuestionsError] = useState(null)
  const codeEditorRef = useRef(null)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Generate questions when component mounts or node changes
  useEffect(() => {
    if (node && language) {
      generateQuestions()
    }
  }, [node, language])

  const generateQuestions = async () => {
    setLoadingQuestions(true)
    setQuestionsError(null)
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: language,
          nodeId: node.id,
          nodeName: node.name,
          difficulty: node.difficulty,
          challengeCount: 3 // Generate 3 challenges per node
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.challenges) {
        setQuestions(data.challenges)
        // Reset to first question
        setCurrentQuestion(0)
        setCompletedQuestions(new Set())
      } else {
        throw new Error(data.error || "Failed to generate challenges")
      }
    } catch (error) {
      console.error('Error generating challenges:', error)
      setQuestionsError(error.message)
      // Fallback to a basic question structure
      setQuestions([{
        id: 1,
        title: `${node.name} Challenge`,
        difficulty: node.difficulty,
        description: `Practice ${node.name} concepts in ${language}`,
        prompt: `Complete a challenge related to ${node.name}. Write your solution in the code editor below.`,
        starterCode: `// ${node.name} Challenge\n// Write your solution here\n\n`,
        hints: [
          `Focus on ${node.name} concepts`,
          `Review the fundamentals of ${node.name}`,
          `Test your code with different scenarios`,
          `Make sure your solution is complete`
        ]
      }])
    } finally {
      setLoadingQuestions(false)
    }
  }

  const currentQ = questions[currentQuestion]

  useEffect(() => {
    if (currentQ) {
      setCode(currentQ.starterCode || "")
      setTestResults([])
      setAllTestsPassed(false)
      setApiResponse(null)
      setShowHints(false)
      setNetworkError(false)
    }
  }, [currentQuestion, currentQ])

  const runCode = useCallback(async () => {
    if (!code.trim()) {
      setApiResponse({ error: "Please write some code before checking!" })
      return
    }

    setIsRunning(true)
    setApiResponse(null)
    setNetworkError(false)

    try {
      const response = await fetch('http://localhost:5000/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          question: currentQ,
          language: language,
          questionId: currentQ.id,
          nodeId: node?.id
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setTestResults(data.testResults || [])
        setAllTestsPassed(data.allPassed || false)
        setApiResponse({
          success: true,
          overallFeedback: data.overallFeedback,
          allPassed: data.allPassed
        })
      } else {
        setApiResponse({ 
          success: false, 
          error: data.error || "Verification failed" 
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      setNetworkError(true)
      setApiResponse({ 
        success: false, 
        error: "Network error. Please check if the backend server is running." 
      })
    } finally {
      setIsRunning(false)
    }
  }, [code, currentQ, language, node?.id])

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
    if (questions.length === 0) return 0
    return Math.round((completedQuestions.size / questions.length) * 100)
  }, [completedQuestions.size, questions.length])

  // Loading state
  if (loadingQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-400 mb-4 animate-spin mx-auto" />
          <div className="text-2xl text-purple-400 mb-2">Generating Challenges...</div>
          <div className="text-gray-300">Creating personalized coding challenges for {node?.name}</div>
        </div>
      </div>
    )
  }

  // Error state
  if (questionsError && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4 mx-auto" />
          <div className="text-2xl text-red-400 mb-4">Failed to Generate Challenges</div>
          <div className="text-gray-300 mb-6">{questionsError}</div>
          <div className="space-y-3">
            <button 
              onClick={generateQuestions}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded font-semibold"
            >
              Try Again
            </button>
            <button 
              onClick={onBack} 
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded block w-full"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-400 mb-4">No challenges available</div>
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
                {node?.name || "Coding Challenge"}
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
                  {[...Array(currentQ.difficulty || 1)].map((_, i) => (
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
                  onClick={() => setCode(currentQ.starterCode || "")}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 text-xs transition-colors flex items-center justify-center rounded"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {showHints && currentQ.hints && (
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
              <h3 className="text-sm font-bold text-white mb-3">Challenges</h3>
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
                        Checking...
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

              {/* Network Error Display */}
              {networkError && (
                <div className="mt-4 bg-red-900/30 border border-red-600 p-4 rounded">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <h3 className="text-sm text-red-400 font-semibold">Connection Error</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    Cannot connect to the verification server. Please ensure the backend is running on port 5000.
                  </p>
                </div>
              )}

              {/* API Response Display */}
              {apiResponse && (
                <div className="mt-4 bg-black p-4 rounded border border-gray-600">
                  <h3 className="text-sm text-cyan-400 mb-2 font-semibold">Verification Result:</h3>
                  {apiResponse.success ? (
                    <div>
                      <div className={`text-sm mb-2 ${apiResponse.allPassed ? 'text-green-400' : 'text-yellow-400'}`}>
                        {apiResponse.allPassed ? '✅ All tests passed!' : '⚠️ Some issues found'}
                      </div>
                      {apiResponse.overallFeedback && (
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{apiResponse.overallFeedback}</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-red-400">
                      ❌ {apiResponse.error}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-600 p-6 rounded">
                <h2 className="text-lg font-bold text-orange-400 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Detailed Feedback
                </h2>

                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded border-l-4 ${
                        result.passed
                          ? "border-l-green-400 bg-green-900/20"
                          : "border-l-red-400 bg-red-900/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white font-medium">{result.description}</span>
                        {result.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      {result.feedback && (
                        <div className="text-xs text-gray-300 mt-1 bg-black/30 p-2 rounded">
                          {result.feedback}
                        </div>
                      )}
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
    difficulty: 2
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
          <p className="text-gray-300 mb-6">Great job on completing the challenges.</p>
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