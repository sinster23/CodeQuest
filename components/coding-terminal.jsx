import React, { useState, useEffect } from "react"
import { ArrowLeft, Play, CheckCircle, XCircle, Lightbulb, RotateCcw, Trophy, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

const CodingTerminal = ({ question, language, onComplete, onBack }) => {
  const [code, setCode] = useState(question.starterCode)
  const [output, setOutput] = useState("")
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [allTestsPassed, setAllTestsPassed] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)

  // Load pixelated font
  useEffect(() => {
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")
    setTestResults([])

    try {
      // Simulate code execution
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const results = await runTests(code, question.testCases, language)
      setTestResults(results)

      const allPassed = results.every((result) => result.passed)
      setAllTestsPassed(allPassed)

      if (allPassed) {
        setOutput("🎉 All tests passed! Great job!")
      } else {
        setOutput("Some tests failed. Check the results below and try again.")
      }
    } catch (error) {
      setOutput(`Error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const resetCode = () => {
    setCode(question.starterCode)
    setOutput("")
    setTestResults([])
    setAllTestsPassed(false)
  }

  const handleComplete = () => {
    if (allTestsPassed) {
      onComplete()
    }
  }

  const nextHint = () => {
    if (currentHintIndex < question.hints.length - 1) {
      setCurrentHintIndex((prev) => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pixel-font {
          font-family: 'Press Start 2P', monospace;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
        
        .glow-text {
          text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
        }
        
        .retro-card {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(30, 30, 30, 0.9));
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .code-editor {
          font-family: 'Courier New', monospace;
          background: #1a1a1a;
          border: 2px solid #333;
          color: #00ff00;
        }
        
        .terminal-output {
          font-family: 'Courier New', monospace;
          background: #000;
          border: 2px solid #333;
          color: #00ff00;
        }
      `}</style>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="pixel-font text-xs bg-gray-800 border-gray-600 hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="pixel-font text-xl md:text-2xl font-bold text-cyan-400 glow-text">{question.title}</h1>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className="pixel-font text-xs">
                  Difficulty: {question.difficulty}/5
                </Badge>
                <Badge variant="outline" className="pixel-font text-xs text-yellow-400">
                  +{question.points} XP
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowHints(!showHints)}
              variant="outline"
              size="sm"
              className="pixel-font text-xs bg-yellow-600 border-yellow-500 hover:bg-yellow-700"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Hints
            </Button>
            <Button
              onClick={resetCode}
              variant="outline"
              size="sm"
              className="pixel-font text-xs bg-gray-600 border-gray-500 hover:bg-gray-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Description */}
          <div className="space-y-6">
            <Card className="retro-card">
              <CardHeader>
                <CardTitle className="pixel-font text-lg text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-cyan-400" />
                  Problem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed mb-4">{question.description}</p>

                <div className="space-y-2">
                  <h4 className="pixel-font text-sm text-yellow-400 font-bold">Test Cases:</h4>
                  {question.testCases.map((testCase, index) => (
                    <div key={index} className="bg-gray-800/50 p-3 rounded border border-gray-600">
                      <div className="pixel-font text-xs text-gray-300 mb-1">
                        Test {index + 1}: {testCase.description}
                      </div>
                      {testCase.input && (
                        <div className="pixel-font text-xs text-blue-300">Input: {testCase.input}</div>
                      )}
                      <div className="pixel-font text-xs text-green-300">Expected: {testCase.expectedOutput}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hints */}
            {showHints && (
              <Card className="retro-card">
                <CardHeader>
                  <CardTitle className="pixel-font text-lg text-yellow-400 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Hints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {question.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                      <Alert key={index} className="bg-yellow-900/20 border-yellow-600">
                        <AlertDescription className="pixel-font text-xs text-yellow-200">💡 {hint}</AlertDescription>
                      </Alert>
                    ))}

                    {currentHintIndex < question.hints.length - 1 && (
                      <Button
                        onClick={nextHint}
                        variant="outline"
                        size="sm"
                        className="pixel-font text-xs bg-yellow-600 border-yellow-500 hover:bg-yellow-700"
                      >
                        Show Next Hint
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Test Results */}
            {testResults.length > 0 && (
              <Card className="retro-card">
                <CardHeader>
                  <CardTitle className="pixel-font text-lg text-white flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded border ${
                          result.passed ? "bg-green-900/20 border-green-600" : "bg-red-900/20 border-red-600"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          {result.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="pixel-font text-xs text-white">
                            Test {index + 1}: {result.description}
                          </span>
                        </div>

                        {!result.passed && (
                          <div className="pixel-font text-xs space-y-1">
                            <div className="text-green-300">Expected: {result.expected}</div>
                            <div className="text-red-300">Got: {result.actual}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {allTestsPassed && (
                    <div className="mt-4 text-center">
                      <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <Button
                        onClick={handleComplete}
                        className="pixel-font text-sm bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold"
                      >
                        🎉 Complete Challenge
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Code Editor */}
          <div className="space-y-6">
            <Card className="retro-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="pixel-font text-lg text-white">Code Editor ({language})</CardTitle>
                  <Button
                    onClick={runCode}
                    disabled={isRunning}
                    className="pixel-font text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? "Running..." : "Run Code"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="code-editor min-h-[300px] resize-none"
                  placeholder="Write your code here..."
                />
              </CardContent>
            </Card>

            <Card className="retro-card">
              <CardHeader>
                <CardTitle className="pixel-font text-lg text-white">Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="terminal-output p-4 min-h-[150px] rounded">
                  <pre className="whitespace-pre-wrap text-sm">{output || "> Ready to run your code..."}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simulate code execution
async function runTests(code, testCases, language) {
  const results = []

  for (const testCase of testCases) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    let passed = false
    let actual = "undefined"

    if (language === "javascript" || language === "js") {
      if (testCase.expectedOutput === "John" && code.includes("name") && code.includes('"John"')) {
        passed = true
        actual = "John"
      } else if (testCase.expectedOutput === "25" && code.includes("age") && code.includes("25")) {
        passed = true
        actual = "25"
      } else if (testCase.expectedOutput === "string" && code.includes("typeof")) {
        passed = true
        actual = "string"
      } else if (testCase.expectedOutput === "number" && code.includes("typeof")) {
        passed = true
        actual = "number"
      } else if (testCase.expectedOutput === "123" && code.includes("Number(")) {
        passed = true
        actual = "123"
      } else if (testCase.expectedOutput === '"456"' && code.includes("String(")) {
        passed = true
        actual = '"456"'
      }
    }

    if (language === "python" || language === "py") {
      if (testCase.expectedOutput === "Hello Python" && code.includes("message") && code.includes("print")) {
        passed = true
        actual = "Hello Python"
      }
    }

    results.push({
      passed,
      input: testCase.input,
      expected: testCase.expectedOutput,
      actual,
      description: testCase.description,
    })
  }

  return results
}

export default CodingTerminal
