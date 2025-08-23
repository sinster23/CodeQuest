import React, { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle, Clock, Code, Play, Trophy, Star, Target, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import CodingTerminal from "./coding-terminal"

const ChallengePageComponent = ({ nodeId, nodeName, language, onBack, onComplete }) => {
  const [questions, setQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [completedQuestions, setCompletedQuestions] = useState(new Set())
  const [showTerminal, setShowTerminal] = useState(false)

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

  // Generate questions based on node
  useEffect(() => {
    const generatedQuestions = generateQuestionsForNode(nodeId, language)
    setQuestions(generatedQuestions)
  }, [nodeId, language])

  // Check if all questions are completed
  useEffect(() => {
    if (questions.length > 0 && completedQuestions.size === questions.length) {
      setTimeout(() => {
        onComplete(nodeId)
      }, 1000)
    }
  }, [completedQuestions, questions.length, nodeId, onComplete])

  const handleQuestionComplete = (questionId) => {
    setCompletedQuestions((prev) => new Set([...prev, questionId]))
    setShowTerminal(false)
    setSelectedQuestion(null)
  }

  const handleQuestionClick = (question) => {
    if (!completedQuestions.has(question.id)) {
      setSelectedQuestion(question)
      setShowTerminal(true)
    }
  }

  const completionPercentage = questions.length > 0 ? (completedQuestions.size / questions.length) * 100 : 0
  const totalPoints = questions.reduce((sum, q) => (completedQuestions.has(q.id) ? sum + q.points : sum), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
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
      `}</style>

      {!showTerminal ? (
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="pixel-font text-xs bg-gray-800 border-gray-600 hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Skills
              </Button>
              <div>
                <h1 className="pixel-font text-2xl md:text-3xl font-bold text-cyan-400 glow-text">
                  {nodeName} Challenges
                </h1>
                <p className="pixel-font text-sm text-gray-300 mt-2">
                  Complete all {questions.length} challenges to master this skill
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="pixel-font text-lg text-yellow-400 font-bold">{totalPoints} XP</div>
              <div className="pixel-font text-xs text-gray-400">
                {completedQuestions.size}/{questions.length} Complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="retro-card p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="pixel-font text-sm text-white">Overall Progress</span>
              <span className="pixel-font text-sm text-cyan-400 font-bold">{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />

            {completionPercentage === 100 && (
              <div className="mt-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="pixel-font text-sm text-green-400 font-bold">🎉 SKILL MASTERED! 🎉</div>
              </div>
            )}
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question, index) => {
              const isCompleted = completedQuestions.has(question.id)
              const isLocked = index > 0 && !completedQuestions.has(questions[index - 1].id)

              return (
                <Card
                  key={question.id}
                  className={`retro-card cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isCompleted
                      ? "border-green-400 shadow-green-400/50"
                      : isLocked
                      ? "border-gray-600 opacity-50 cursor-not-allowed"
                      : "border-blue-400 shadow-blue-400/30 hover:shadow-blue-400/50"
                  }`}
                  onClick={() => !isLocked && handleQuestionClick(question)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="pixel-font text-sm text-white">Challenge {index + 1}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                        {isLocked && <Clock className="w-5 h-5 text-gray-400" />}
                        {!isCompleted && !isLocked && <Play className="w-5 h-5 text-blue-400" />}
                      </div>
                    </div>

                    <h3 className="pixel-font text-xs text-cyan-300 font-bold">{question.title}</h3>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-3">{question.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="pixel-font text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {question.difficulty}/5
                        </Badge>
                        <Badge variant="outline" className="pixel-font text-xs text-yellow-400">
                          +{question.points} XP
                        </Badge>
                      </div>

                      <div className="pixel-font text-xs text-gray-400">{question.testCases.length} tests</div>
                    </div>

                    {isLocked && (
                      <div className="mt-3 pixel-font text-xs text-gray-500 text-center">
                        Complete previous challenge to unlock
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Hints Section */}
          <div className="mt-8 retro-card p-6">
            <h3 className="pixel-font text-lg font-bold text-yellow-400 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Tips for Success
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="pixel-font text-sm text-white font-bold mb-1">Read Carefully</div>
                  <div className="pixel-font text-xs text-gray-300">Understand the problem before coding</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Code className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="pixel-font text-sm text-white font-bold mb-1">Test Often</div>
                  <div className="pixel-font text-xs text-gray-300">Run your code frequently to catch errors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        selectedQuestion && (
          <CodingTerminal
            question={selectedQuestion}
            language={language}
            onComplete={() => handleQuestionComplete(selectedQuestion.id)}
            onBack={() => {
              setShowTerminal(false)
              setSelectedQuestion(null)
            }}
          />
        )
      )}
    </div>
  )
}

// Generate questions
function generateQuestionsForNode(nodeId, language) {
  const questionTemplates = {
    "js-basics-1": [
      {
        id: "js-var-1",
        title: "Variable Declaration",
        description: "Create variables using let, const, and understand their differences.",
        difficulty: 1,
        points: 15,
        testCases: [
          { input: "", expectedOutput: "John", description: "Should declare a name variable" },
          { input: "", expectedOutput: "25", description: "Should declare an age constant" },
        ],
        starterCode: '// Declare a variable called name with value "John"\n// Declare a constant called age with value 25\n\n',
        solution: 'let name = "John";\nconst age = 25;',
        hints: ["Use let for variables that can change", "Use const for values that stay the same"],
        completed: false,
      },
      {
        id: "js-var-2",
        title: "Data Types",
        description: "Work with different JavaScript data types: strings, numbers, booleans.",
        difficulty: 1,
        points: 20,
        testCases: [
          { input: "", expectedOutput: "string", description: "Should identify string type" },
          { input: "", expectedOutput: "number", description: "Should identify number type" },
        ],
        starterCode: "// Create variables of different types and use typeof\n\n",
        solution: 'let str = "hello";\nlet num = 42;\nconsole.log(typeof str, typeof num);',
        hints: ["Use typeof operator to check data types", "JavaScript has dynamic typing"],
        completed: false,
      },
      {
        id: "js-var-3",
        title: "Type Conversion",
        description: "Convert between different data types in JavaScript.",
        difficulty: 2,
        points: 25,
        testCases: [
          { input: '"123"', expectedOutput: "123", description: "Should convert string to number" },
          { input: "456", expectedOutput: '"456"', description: "Should convert number to string" },
        ],
        starterCode: '// Convert string "123" to number\n// Convert number 456 to string\n\n',
        solution: 'let strToNum = Number("123");\nlet numToStr = String(456);',
        hints: ["Use Number() to convert to number", "Use String() to convert to string"],
        completed: false,
      },
    ],
    "py-basics-1": [
      {
        id: "py-var-1",
        title: "Python Variables",
        description: "Learn Python variable naming and assignment.",
        difficulty: 1,
        points: 15,
        testCases: [{ input: "", expectedOutput: "Hello Python", description: "Should create and print message" }],
        starterCode: '# Create a variable called message with "Hello Python"\n# Print the message\n\n',
        solution: 'message = "Hello Python"\nprint(message)',
        hints: ["Python uses snake_case for variables", "No need to declare variable type"],
        completed: false,
      },
    ],
  }

  return (
    questionTemplates[nodeId] || [
      {
        id: `${nodeId}-1`,
        title: "Practice Challenge",
        description: "Complete this coding challenge to master the concept.",
        difficulty: 2,
        points: 30,
        testCases: [{ input: "test", expectedOutput: "expected", description: "Should work correctly" }],
        starterCode: "// Write your code here\n\n",
        solution: "// Solution code",
        hints: ["Think step by step", "Test your solution"],
        completed: false,
      },
    ]
  )
}

export default ChallengePageComponent
