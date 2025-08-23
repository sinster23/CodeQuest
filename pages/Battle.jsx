"use client"

import React, { useState, useEffect } from "react"
import {
  Sword,
  Shield,
  Trophy,
  Star,
  Code,
  Zap,
  Target,
  ChevronLeft,
  ChevronRight,
  Heart,
  Clock,
  Medal,
  Coffee,
  Layers,
  Database,
  Cpu,
  Flame,
  Lock,
} from "lucide-react"
import { auth, db } from "../src/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

const XP_PER_BATTLE = 100 // XP gained per battle victory
const XP_PER_LEVEL = 300 // XP needed to level up (can increase per level)

// Level progression formula
const getXPNeededForLevel = (level) => level * XP_PER_LEVEL

const CodeBattlesPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [currentBattle, setCurrentBattle] = useState(null)
  const [battlePhase, setBattlePhase] = useState("selection") // selection, battle, result
  const [playerHealth, setPlayerHealth] = useState(10)
  const [opponentHealth, setOpponentHealth] = useState(10)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [battleResult, setBattleResult] = useState(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState({ player: 0, opponent: 0 })
  const [user, setUser] = useState(null)
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [levelUpNotification, setLevelUpNotification] = useState(false)
  const [previousLevel, setPreviousLevel] = useState(null)
  const [newLevel, setNewLevel] = useState(null)

  // Track defeated battles for each language - will be loaded from Firebase
  const [defeatedBattles, setDefeatedBattles] = useState({
    javascript: [1], // First battle is always unlocked
    typescript: [1],
    python: [1],
    cpp: [1],
    java: [1],
  })

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

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        await loadUserProgress(currentUser.uid)
      } else {
        // If no user, redirect to login or show auth required message
        console.log("No authenticated user")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Load user progress from Firebase
  const loadUserProgress = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setUserProgress(userData)

        // Convert Firebase badge data to defeated battles format
        const badges = userData.achievements?.codebattles || {}
        const newDefeatedBattles = {
          javascript: [1], // First battle always unlocked
          typescript: [1],
          python: [1],
          cpp: [1],
          java: [1],
        }

        // Check which battles are defeated based on badges
        const languageMapping = {
          js: "javascript",
          python: "python",
          ts: "typescript",
          cpp: "cpp",
          java: "java",
        }

        Object.keys(badges).forEach((badgeKey) => {
          if (badges[badgeKey] === true) {
            // Extract language and battle number from badge key
            // e.g., "jsbadge1" -> js, 1
            const match = badgeKey.match(/^(js|python|ts|cpp|java)badge(\d+)$/)
            if (match) {
              const [, lang, battleNum] = match
              const languageKey = languageMapping[lang]
              const battleNumber = Number.parseInt(battleNum)

              if (languageKey && !newDefeatedBattles[languageKey].includes(battleNumber)) {
                newDefeatedBattles[languageKey].push(battleNumber)
                // Also unlock next battle
                if (battleNumber < 5 && !newDefeatedBattles[languageKey].includes(battleNumber + 1)) {
                  newDefeatedBattles[languageKey].push(battleNumber + 1)
                }
              }
            }
          }
        })

        setDefeatedBattles(newDefeatedBattles)
      }
    } catch (error) {
      console.error("Error loading user progress:", error)
    }
  }

  // Save battle victory to Firebase
  const saveBattleVictory = async (battleId) => {
    if (!user || !userProgress) return

    try {
      const badgeMapping = {
        javascript: "js",
        typescript: "ts",
        python: "python",
        cpp: "cpp",
        java: "java",
      }

      const langKey = badgeMapping[selectedLanguage]
      const badgeKey = `${langKey}badge${battleId}`

      // Calculate new XP and level
      const currentXP = userProgress.xp || 0
      const currentLevel = userProgress.level || 1
      const newXP = currentXP + XP_PER_BATTLE
      const xpNeededForNextLevel = currentLevel * XP_PER_LEVEL
      const calculatedNewLevel = Math.floor(newXP / XP_PER_LEVEL) + 1

      // Check if leveled up
      const hasLeveledUp = calculatedNewLevel > currentLevel

      // Update Firebase
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        [`achievements.codebattles.${badgeKey}`]: true,
        xp: newXP,
        level: calculatedNewLevel,
        badges: calculateTotalBadges() + 1,
      })

      // Update local state
      setUserProgress((prev) => ({
        ...prev,
        xp: newXP,
        level: calculatedNewLevel,
        badges: (prev.badges || 0) + 1,
        achievements: {
          ...prev.achievements,
          codebattles: {
            ...prev.achievements.codebattles,
            [badgeKey]: true,
          },
        },
      }))

      // Show level up notification if leveled up
      if (hasLeveledUp) {
        setLevelUpNotification(true)
        setNewLevel(calculatedNewLevel)
      }

      console.log(`Badge ${badgeKey} earned! +${XP_PER_BATTLE} XP`)
      if (hasLeveledUp) {
        console.log(`Level up! Now level ${calculatedNewLevel}`)
      }
    } catch (error) {
      console.error("Error saving battle victory:", error)
    }
  }

  // Timer for battles
  useEffect(() => {
    let timer
    if (battlePhase === "battle" && timeLeft > 0 && !battleResult) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [battlePhase, timeLeft, battleResult])

  const languages = {
    javascript: {
      name: "JavaScript",
      icon: Code,
      color: "from-yellow-600 to-yellow-800",
      borderColor: "border-yellow-400",
      battles: [
        { id: 1, name: "Variable Warrior", difficulty: "EASY", badge: "🟡 Basic Coder" },
        { id: 2, name: "Function Fighter", difficulty: "EASY", badge: "🟠 Function Master" },
        { id: 3, name: "Array Assassin", difficulty: "MEDIUM", badge: "🔵 Array Expert" },
        { id: 4, name: "Object Oracle", difficulty: "HARD", badge: "🟣 Object Sage" },
        { id: 5, name: "Async Overlord", difficulty: "EXPERT", badge: "⚫ Async Legend" },
      ],
    },
    typescript: {
      name: "TypeScript",
      icon: Layers,
      color: "from-blue-600 to-blue-800",
      borderColor: "border-blue-400",
      battles: [
        { id: 1, name: "Type Guardian", difficulty: "EASY", badge: "🔷 Type Novice" },
        { id: 2, name: "Interface Enforcer", difficulty: "MEDIUM", badge: "🔶 Interface Pro" },
        { id: 3, name: "Generic Genius", difficulty: "MEDIUM", badge: "🟦 Generic Master" },
        { id: 4, name: "Decorator Demon", difficulty: "HARD", badge: "🟪 Decorator Lord" },
        { id: 5, name: "Module Monarch", difficulty: "EXPERT", badge: "⬛ TS Emperor" },
      ],
    },
    python: {
      name: "Python",
      icon: Coffee,
      color: "from-green-600 to-green-800",
      borderColor: "border-green-400",
      battles: [
        { id: 1, name: "Snake Charmer", difficulty: "EASY", badge: "🐍 Python Rookie" },
        { id: 2, name: "List Liberator", difficulty: "EASY", badge: "📋 List Legend" },
        { id: 3, name: "Dict Destroyer", difficulty: "MEDIUM", badge: "📖 Dict Master" },
        { id: 4, name: "Class Crusher", difficulty: "HARD", badge: "🏛️ OOP Oracle" },
        { id: 5, name: "Pandas Paladin", difficulty: "EXPERT", badge: "🐼 Data Deity" },
      ],
    },
    cpp: {
      name: "C++",
      icon: Cpu,
      color: "from-red-600 to-red-800",
      borderColor: "border-red-400",
      battles: [
        { id: 1, name: "Pointer Pioneer", difficulty: "MEDIUM", badge: "➡️ Pointer Pro" },
        { id: 2, name: "Memory Manager", difficulty: "MEDIUM", badge: "💾 Memory Master" },
        { id: 3, name: "Template Titan", difficulty: "HARD", badge: "📋 Template Lord" },
        { id: 4, name: "STL Samurai", difficulty: "HARD", badge: "📚 STL Sage" },
        { id: 5, name: "Performance Predator", difficulty: "EXPERT", badge: "⚡ Speed Demon" },
      ],
    },
    java: {
      name: "Java",
      icon: Database,
      color: "from-purple-600 to-purple-800",
      borderColor: "border-purple-400",
      battles: [
        { id: 1, name: "Class Captain", difficulty: "EASY", badge: "☕ Java Junior" },
        { id: 2, name: "Interface Invader", difficulty: "MEDIUM", badge: "🔌 Interface Ace" },
        { id: 3, name: "Stream Soldier", difficulty: "MEDIUM", badge: "🌊 Stream Master" },
        { id: 4, name: "Concurrency Conqueror", difficulty: "HARD", badge: "🔀 Thread Titan" },
        { id: 5, name: "Spring Sentinel", difficulty: "EXPERT", badge: "🌱 Spring Supreme" },
      ],
    },
  }

  // Check if a battle is unlocked
  const isBattleUnlocked = (battleId) => {
    return (
      defeatedBattles[selectedLanguage].includes(battleId) || defeatedBattles[selectedLanguage].includes(battleId - 1)
    )
  }

  // Check if a battle is defeated (has badge)
  const isBattleDefeated = (battleId) => {
    if (!userProgress?.achievements?.codebattles) return false

    const badgeMapping = {
      javascript: "js",
      typescript: "ts",
      python: "python",
      cpp: "cpp",
      java: "java",
    }

    const langKey = badgeMapping[selectedLanguage]
    const badgeKey = `${langKey}badge${battleId}`
    return userProgress.achievements.codebattles[badgeKey] === true
  }

  // Hardcoded questions for each language
  const questions = {
    javascript: [
      {
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["var name = 'John';", "variable name = 'John';", "v name = 'John';", "declare name = 'John';"],
        correct: 0,
      },
      {
        question: "Which method adds an element to the end of an array?",
        options: ["append()", "push()", "add()", "insert()"],
        correct: 1,
      },
      {
        question: "What does '===' operator do in JavaScript?",
        options: ["Assignment", "Loose equality", "Strict equality", "Not equal"],
        correct: 2,
      },
      {
        question: "How do you create a function in JavaScript?",
        options: ["function = myFunc() {}", "create myFunc() {}", "function myFunc() {}", "def myFunc() {}"],
        correct: 2,
      },
      {
        question: "What is the result of typeof null?",
        options: ["'null'", "'undefined'", "'object'", "'boolean'"],
        correct: 2,
      },
      {
        question: "Which method removes the last element from an array?",
        options: ["pop()", "remove()", "delete()", "splice()"],
        correct: 0,
      },
      {
        question: "What is the correct way to write a JavaScript array?",
        options: [
          "var colors = 'red', 'green', 'blue'",
          "var colors = (1:'red', 2:'green', 3:'blue')",
          "var colors = ['red', 'green', 'blue']",
          "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')",
        ],
        correct: 2,
      },
      {
        question: "How do you write 'Hello World' in an alert box?",
        options: ["alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');", "msgBox('Hello World');"],
        correct: 2,
      },
      {
        question: "How do you create a function that returns a value?",
        options: [
          "function myFunction() { return 'Hello'; }",
          "function myFunction() { yield 'Hello'; }",
          "function myFunction() { give 'Hello'; }",
          "function myFunction() { output 'Hello'; }",
        ],
        correct: 0,
      },
      {
        question: "How do you call a function named 'myFunction'?",
        options: ["call myFunction()", "myFunction()", "call function myFunction()", "Call.myFunction()"],
        correct: 1,
      },
      {
        question: "What is the correct way to write a JavaScript object?",
        options: [
          "var person = {firstName:'John', lastName:'Doe'};",
          "var person = {firstName='John', lastName='Doe'};",
          "var person = (firstName:'John', lastName:'Doe');",
          "var person = (firstName:'John', lastName='Doe');",
        ],
        correct: 0,
      },
      {
        question: "Which event occurs when the user clicks on an HTML element?",
        options: ["onchange", "onclick", "onmouseclick", "onmouseover"],
        correct: 1,
      },
      {
        question: "How do you declare a JavaScript variable?",
        options: ["variable carName;", "v carName;", "var carName;", "declare carName;"],
        correct: 2,
      },
      {
        question: "Which operator is used to assign a value to a variable?",
        options: ["*", "=", "x", "-"],
        correct: 1,
      },
      {
        question: "What will the following code return: Boolean(10 > 9)",
        options: ["true", "false", "NaN", "undefined"],
        correct: 0,
      },
      {
        question: "Is JavaScript case-sensitive?",
        options: ["No", "Yes", "Sometimes", "Only for variables"],
        correct: 1,
      },
      {
        question: "Which method converts JSON data to a JavaScript object?",
        options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"],
        correct: 0,
      },
      {
        question: "What is the correct way to write a JavaScript comment?",
        options: ["<!-- This is a comment -->", "// This is a comment", "' This is a comment", "* This is a comment *"],
        correct: 1,
      },
      {
        question: "Which method is used to find the length of a string?",
        options: ["length()", "size()", "len()", "length"],
        correct: 3,
      },
      {
        question: "What does the 'this' keyword refer to?",
        options: ["The current function", "The current object", "The global object", "The parent object"],
        correct: 1,
      },
    ],
    python: [
      {
        question: "How do you create a list in Python?",
        options: ["list = []", "list = {}", "list = ()", "list = <>"],
        correct: 0,
      },
      {
        question: "Which keyword is used to create a function in Python?",
        options: ["function", "def", "create", "func"],
        correct: 1,
      },
      {
        question: "What is the correct way to import a module?",
        options: ["include math", "import math", "use math", "require math"],
        correct: 1,
      },
      {
        question: "How do you create a dictionary in Python?",
        options: ["dict = []", "dict = ()", "dict = {}", "dict = <>"],
        correct: 2,
      },
      {
        question: "Which method is used to add an item to a list?",
        options: ["add()", "push()", "append()", "insert()"],
        correct: 2,
      },
      {
        question: "What is the correct file extension for Python files?",
        options: [".pyth", ".pt", ".py", ".python"],
        correct: 2,
      },
      {
        question: "Which keyword is used for loops in Python?",
        options: ["loop", "for", "repeat", "iterate"],
        correct: 1,
      },
      {
        question: "How do you insert comments in Python code?",
        options: [
          "// This is a comment",
          "/* This is a comment */",
          "# This is a comment",
          "<!-- This is a comment -->",
        ],
        correct: 2,
      },
      {
        question: "Which of the following is a correct variable name?",
        options: ["2myvar", "my-var", "my_var", "my var"],
        correct: 2,
      },
      {
        question: "What is the output of print(2**3)?",
        options: ["6", "8", "9", "23"],
        correct: 1,
      },
      {
        question: "Which method removes an item from a list?",
        options: ["delete()", "remove()", "discard()", "pop()"],
        correct: 1,
      },
      {
        question: "What is the correct way to create a string in Python?",
        options: ["'Hello World'", '"Hello World"', "Both A and B", "string('Hello World')"],
        correct: 2,
      },
      {
        question: "Which operator is used for floor division?",
        options: ["/", "//", "%", "**"],
        correct: 1,
      },
      {
        question: "How do you check the data type of a variable?",
        options: ["typeof()", "type()", "datatype()", "check()"],
        correct: 1,
      },
      {
        question: "What is the correct way to handle exceptions?",
        options: ["try/catch", "try/except", "catch/finally", "handle/error"],
        correct: 1,
      },
      {
        question: "Which keyword is used to create a class?",
        options: ["class", "Class", "define", "create"],
        correct: 0,
      },
      {
        question: "How do you get user input in Python?",
        options: ["input()", "get()", "read()", "scan()"],
        correct: 0,
      },
      {
        question: "What is the correct way to open a file?",
        options: [
          "file = open('filename.txt')",
          "file = read('filename.txt')",
          "file = load('filename.txt')",
          "file = get('filename.txt')",
        ],
        correct: 0,
      },
      {
        question: "Which method converts a string to lowercase?",
        options: ["lower()", "lowercase()", "toLower()", "downcase()"],
        correct: 0,
      },
      {
        question: "What is the correct way to create a tuple?",
        options: ["tuple = []", "tuple = {}", "tuple = ()", "tuple = <>"],
        correct: 2,
      },
    ],
    typescript: [
      {
        question: "How do you specify a type for a variable?",
        options: ["let name: string;", "let name as string;", "let name = string;", "let string name;"],
        correct: 0,
      },
      {
        question: "What keyword is used to define an interface?",
        options: ["type", "interface", "class", "struct"],
        correct: 1,
      },
      {
        question: "How do you make a property optional in an interface?",
        options: ["name: string?", "name?: string", "optional name: string", "name: optional string"],
        correct: 1,
      },
      {
        question: "What is a generic in TypeScript?",
        options: ["A type variable", "A class method", "An interface", "A module"],
        correct: 0,
      },
      {
        question: "How do you define a union type?",
        options: ["string & number", "string + number", "string | number", "string || number"],
        correct: 2,
      },
      {
        question: "What is the correct way to define an array type?",
        options: ["Array<string>", "string[]", "Both A and B", "array<string>"],
        correct: 2,
      },
      {
        question: "How do you define a function type?",
        options: [
          "(x: number) => string",
          "function(x: number): string",
          "func(x: number) -> string",
          "def(x: number): string",
        ],
        correct: 0,
      },
      {
        question: "What keyword is used to extend an interface?",
        options: ["extends", "implements", "inherits", "derives"],
        correct: 0,
      },
      {
        question: "How do you define a readonly property?",
        options: ["readonly name: string", "const name: string", "final name: string", "immutable name: string"],
        correct: 0,
      },
      {
        question: "What is the 'never' type used for?",
        options: [
          "Functions that never return",
          "Variables that are never used",
          "Types that are never defined",
          "Classes that are never instantiated",
        ],
        correct: 0,
      },
      {
        question: "How do you create a type alias?",
        options: ["type Name = string", "alias Name = string", "typedef Name = string", "define Name = string"],
        correct: 0,
      },
      {
        question: "What is the difference between 'any' and 'unknown'?",
        options: ["No difference", "unknown is type-safe", "any is type-safe", "unknown allows any operation"],
        correct: 1,
      },
      {
        question: "How do you define an enum?",
        options: [
          "enum Color { Red, Green, Blue }",
          "const Color = { Red, Green, Blue }",
          "type Color = Red | Green | Blue",
          "define Color { Red, Green, Blue }",
        ],
        correct: 0,
      },
      {
        question: "What is a mapped type?",
        options: ["A type that maps over properties", "A type for Map objects", "A geographic type", "A routing type"],
        correct: 0,
      },
      {
        question: "How do you make all properties optional?",
        options: ["Partial<T>", "Optional<T>", "Maybe<T>", "Nullable<T>"],
        correct: 0,
      },
      {
        question: "What is the 'keyof' operator used for?",
        options: ["Getting keys of an object type", "Creating new keys", "Deleting keys", "Checking if key exists"],
        correct: 0,
      },
      {
        question: "How do you define a conditional type?",
        options: ["T extends U ? X : Y", "if T extends U then X else Y", "T instanceof U ? X : Y", "T is U ? X : Y"],
        correct: 0,
      },
      {
        question: "What is the purpose of 'declare'?",
        options: ["Ambient declarations", "Variable declarations", "Function declarations", "Class declarations"],
        correct: 0,
      },
      {
        question: "How do you import types only?",
        options: [
          "import type { Type } from 'module'",
          "import { Type } from 'module' as type",
          "import types { Type } from 'module'",
          "import { type Type } from 'module'",
        ],
        correct: 0,
      },
      {
        question: "What is a discriminated union?",
        options: [
          "A union with a common property",
          "A union of different types",
          "A union with discrimination",
          "A union of classes",
        ],
        correct: 0,
      },
    ],
    cpp: [
      {
        question: "How do you declare a pointer in C++?",
        options: ["int* ptr;", "int ptr*;", "pointer int ptr;", "int &ptr;"],
        correct: 0,
      },
      {
        question: "Which header includes cout?",
        options: ["<stdio.h>", "<iostream>", "<cstdio>", "<console>"],
        correct: 1,
      },
      {
        question: "What is the scope resolution operator?",
        options: ["::", "->", ".", "::>"],
        correct: 0,
      },
      {
        question: "How do you dynamically allocate memory?",
        options: ["malloc()", "new", "alloc()", "create()"],
        correct: 1,
      },
      {
        question: "What is a destructor called?",
        options: ["~ClassName()", "delete ClassName()", "ClassName~()", "destroy()"],
        correct: 0,
      },
      {
        question: "What is the correct way to include a header file?",
        options: ["#include <header.h>", "#import <header.h>", "#using <header.h>", "#require <header.h>"],
        correct: 0,
      },
      {
        question: "Which access specifier makes members accessible only within the class?",
        options: ["public", "private", "protected", "internal"],
        correct: 1,
      },
      {
        question: "What is the correct syntax for a constructor?",
        options: ["ClassName() {}", "constructor ClassName() {}", "new ClassName() {}", "create ClassName() {}"],
        correct: 0,
      },
      {
        question: "How do you declare a reference in C++?",
        options: ["int& ref = var;", "int ref& = var;", "reference int ref = var;", "int* ref = &var;"],
        correct: 0,
      },
      {
        question: "What keyword is used for inheritance?",
        options: ["extends", "inherits", ":", "derives"],
        correct: 2,
      },
      {
        question: "Which operator is used to access members through a pointer?",
        options: [".", "->", "::", "&"],
        correct: 1,
      },
      {
        question: "What is the size of int typically?",
        options: ["2 bytes", "4 bytes", "8 bytes", "Depends on system"],
        correct: 3,
      },
      {
        question: "How do you declare a constant?",
        options: ["const int x = 5;", "constant int x = 5;", "final int x = 5;", "readonly int x = 5;"],
        correct: 0,
      },
      {
        question: "What is function overloading?",
        options: [
          "Same function name, different parameters",
          "Different function names",
          "Virtual functions",
          "Template functions",
        ],
        correct: 0,
      },
      {
        question: "Which keyword is used for templates?",
        options: ["template", "generic", "typename", "class"],
        correct: 0,
      },
      {
        question: "What is the correct way to declare an array?",
        options: ["int arr[10];", "array<int> arr[10];", "int[] arr = new int[10];", "vector<int> arr(10);"],
        correct: 0,
      },
      {
        question: "How do you free dynamically allocated memory?",
        options: ["free()", "delete", "remove()", "clear()"],
        correct: 1,
      },
      {
        question: "What is a virtual function?",
        options: [
          "A function that can be overridden",
          "A function that doesn't exist",
          "A template function",
          "A static function",
        ],
        correct: 0,
      },
      {
        question: "Which header is needed for string class?",
        options: ["<string>", "<cstring>", "<str>", "<text>"],
        correct: 0,
      },
      {
        question: "What is the correct way to use namespace std?",
        options: ["using namespace std;", "use std;", "import std;", "include std;"],
        correct: 0,
      },
    ],
    java: [
      {
        question: "Which keyword is used to create a class?",
        options: ["class", "Class", "create", "new"],
        correct: 0,
      },
      {
        question: "How do you create an object?",
        options: ["Object obj = Object();", "new Object obj;", "Object obj = new Object();", "create Object obj;"],
        correct: 2,
      },
      {
        question: "What is method overloading?",
        options: [
          "Same method, different parameters",
          "Different method, same parameters",
          "Inheriting methods",
          "Abstract methods",
        ],
        correct: 0,
      },
      {
        question: "Which access modifier is most restrictive?",
        options: ["public", "protected", "private", "default"],
        correct: 2,
      },
      {
        question: "What is the main method signature?",
        options: [
          "public static void main(String args[])",
          "public void main(String args[])",
          "static void main(String args[])",
          "void main(String args[])",
        ],
        correct: 0,
      },
      {
        question: "Which keyword is used for inheritance?",
        options: ["extends", "inherits", "implements", "derives"],
        correct: 0,
      },
      {
        question: "What is the correct way to declare an array?",
        options: [
          "int[] arr = new int[10];",
          "int arr[] = new int[10];",
          "Both A and B",
          "array<int> arr = new array<int>[10];",
        ],
        correct: 2,
      },
      {
        question: "Which keyword is used to prevent inheritance?",
        options: ["final", "static", "private", "sealed"],
        correct: 0,
      },
      {
        question: "What is the correct way to handle exceptions?",
        options: ["try/catch", "try/except", "handle/error", "catch/finally"],
        correct: 0,
      },
      {
        question: "Which collection allows duplicate elements?",
        options: ["Set", "List", "Map", "Queue"],
        correct: 1,
      },
      {
        question: "What is the correct way to create a string?",
        options: [
          "String str = 'Hello';",
          'String str = "Hello";',
          'string str = "Hello";',
          "String str = new String('Hello');",
        ],
        correct: 1,
      },
      {
        question: "Which keyword is used to implement an interface?",
        options: ["extends", "implements", "uses", "applies"],
        correct: 1,
      },
      {
        question: "What is the wrapper class for int?",
        options: ["Int", "Integer", "Number", "Numeric"],
        correct: 1,
      },
      {
        question: "Which method is used to compare strings?",
        options: ["compare()", "equals()", "==", "is()"],
        correct: 1,
      },
      {
        question: "What is the correct way to create a thread?",
        options: ["extends Thread", "implements Runnable", "Both A and B", "new Thread()"],
        correct: 2,
      },
      {
        question: "Which keyword is used for constants?",
        options: ["const", "final", "static", "readonly"],
        correct: 1,
      },
      {
        question: "What is the correct way to import a package?",
        options: ["import java.util.*;", "include java.util.*;", "using java.util.*;", "require java.util.*;"],
        correct: 0,
      },
      {
        question: "Which method is called when an object is created?",
        options: ["constructor", "init()", "create()", "new()"],
        correct: 0,
      },
      {
        question: "What is the correct way to create a generic class?",
        options: ["class MyClass<T>", "class MyClass(T)", "class MyClass[T]", "generic class MyClass<T>"],
        correct: 0,
      },
      {
        question: "Which keyword is used to call parent class methods?",
        options: ["parent", "super", "base", "this"],
        correct: 1,
      },
    ],
  }

  const startBattle = (battle) => {
    setCurrentBattle(battle)
    setBattlePhase("battle")
    setPlayerHealth(10)
    setOpponentHealth(10)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setBattleResult(null)
    setTimeLeft(30)
    setScore({ player: 0, opponent: 0 })
    setLevelUpNotification(false) // Add this line
    setNewLevel(null) // Add this line
  }

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === questions[selectedLanguage][currentQuestion].correct

    setTimeout(() => {
      if (isCorrect) {
        setOpponentHealth((prev) => Math.max(0, prev - 1))
        setScore((prev) => ({ ...prev, player: prev.player + 1 }))
      } else {
        setPlayerHealth((prev) => Math.max(0, prev - 1))
        setScore((prev) => ({ ...prev, opponent: prev.opponent + 1 }))
      }

      // Check for battle end
      const newPlayerHealth = isCorrect ? playerHealth : Math.max(0, playerHealth - 1)
      const newOpponentHealth = isCorrect ? Math.max(0, opponentHealth - 1) : opponentHealth

      if (newPlayerHealth <= 0) {
        setBattleResult("defeat")
        setBattlePhase("result")
      } else if (newOpponentHealth <= 0) {
        setBattleResult("victory")
        setBattlePhase("result")
        // Save victory to Firebase and unlock next battle
        saveBattleVictory(currentBattle.id)
        setDefeatedBattles((prev) => ({
          ...prev,
          [selectedLanguage]: [...prev[selectedLanguage], currentBattle.id + 1].filter(
            (id, index, arr) => arr.indexOf(id) === index && id <= 5,
          ),
        }))
      } else {
        // Next question
        setCurrentQuestion((prev) => (prev + 1) % questions[selectedLanguage].length)
        setSelectedAnswer(null)
        setTimeLeft(30)
      }
    }, 1000)
  }

  const handleTimeUp = () => {
    // Time up counts as wrong answer
    setPlayerHealth((prev) => Math.max(0, prev - 1))
    setScore((prev) => ({ ...prev, opponent: prev.opponent + 1 }))

    if (playerHealth - 1 <= 0) {
      setBattleResult("defeat")
      setBattlePhase("result")
    } else {
      setCurrentQuestion((prev) => (prev + 1) % questions[selectedLanguage].length)
      setSelectedAnswer(null)
      setTimeLeft(30)
    }
  }

  const resetBattle = () => {
    setBattlePhase("selection")
    setCurrentBattle(null)
    // Don't reset level up notification here - let it show until user acknowledges
    // setLevelUpNotification(false);
    // setNewLevel(null);
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <div className="text-xl">Loading your battles...</div>
        </div>
      </div>
    )
  }

  // Auth required state
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-400 mb-8">Please log in to access Code Battles and save your progress.</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 font-bold transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const LanguageTab = ({ langKey, lang }) => (
    <button
      onClick={() => setSelectedLanguage(langKey)}
      className={`p-4 rounded-none border-2 transition-all duration-300 pixel-font text-sm ${
        selectedLanguage === langKey
          ? `bg-gradient-to-br ${lang.color} ${lang.borderColor} text-white scale-105`
          : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
      }`}
    >
      <lang.icon className="w-6 h-6 mx-auto mb-2" />
      {lang.name}
    </button>
  )

  const BattleCard = ({ battle, language }) => {
    const isUnlocked = isBattleUnlocked(battle.id)
    const isDefeated = isBattleDefeated(battle.id)

    return (
      <div
        className={`relative bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-none border-2 
          transition-all duration-300 transform hover:scale-105 cursor-pointer
          ${isUnlocked ? "border-white/30 hover:border-white/60 hover:shadow-xl" : "border-gray-700 opacity-60 cursor-not-allowed"}
          retro-card pixel-shadow`}
        onClick={() => isUnlocked && startBattle(battle)}
      >
        {/* Difficulty indicator */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 text-xs pixel-font ${
            battle.difficulty === "EASY"
              ? "bg-green-600"
              : battle.difficulty === "MEDIUM"
                ? "bg-yellow-600"
                : battle.difficulty === "HARD"
                  ? "bg-red-600"
                  : "bg-purple-600"
          }`}
        >
          {battle.difficulty}
        </div>

        {/* Victory indicator */}
        {isDefeated && (
          <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 border-2 border-white flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )}

        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
            <div className="text-center">
              <Lock className="w-8 h-8 text-white/60 mx-auto mb-2" />
              <div className="pixel-font text-xs text-white/80">LOCKED</div>
              <div className="pixel-font text-xs text-white/60 mt-1">Defeat Previous Battle</div>
            </div>
          </div>
        )}

        <div className="relative z-20">
          <div className="flex items-center justify-between mb-4">
            <Sword className="w-8 h-8 text-red-400" />
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i <= (battle.difficulty === "EASY" ? 2 : battle.difficulty === "MEDIUM" ? 3 : battle.difficulty === "HARD" ? 4 : 5) ? "text-yellow-300" : "text-white/30"}`}
                  fill="currentColor"
                />
              ))}
            </div>
          </div>

          <h3 className="pixel-font text-lg font-bold text-white mb-3">{battle.name}</h3>

          <div className="pixel-font text-xs text-gray-300 mb-4">🏆 {battle.badge}</div>

          <div className="flex items-center justify-between">
            <div className="pixel-font text-xs text-green-400">
              {!isUnlocked ? "🔒 LOCKED" : isDefeated ? "✅ DEFEATED" : "▶ BATTLE READY"}
            </div>
            {isUnlocked && <ChevronRight className="w-4 h-4 text-white" />}
          </div>
        </div>
      </div>
    )
  }

  const HealthBar = ({ health, maxHealth, color, label }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="pixel-font text-sm text-white">{label}</span>
        <span className="pixel-font text-sm text-white">
          {health}/{maxHealth}
        </span>
      </div>
      <div className="w-full bg-gray-700 h-4 border-2 border-white/30">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${(health / maxHealth) * 100}%` }}
        ></div>
      </div>
      <div className="flex space-x-1">
        {Array.from({ length: maxHealth }, (_, i) => (
          <Heart key={i} className={`w-3 h-3 ${i < health ? "text-red-500" : "text-gray-600"}`} fill="currentColor" />
        ))}
      </div>
    </div>
  )

  const calculateTotalBadges = () => {
    if (!userProgress?.achievements?.codebattles) return 0

    return Object.values(userProgress.achievements.codebattles).filter((badge) => badge === true).length
  }

  const calculateBattlesWon = () => {
    return calculateTotalBadges() // Each badge represents a won battle
  }

  if (battlePhase === "battle") {
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
              <HealthBar health={playerHealth} maxHealth={10} color="from-blue-500 to-cyan-500" label="You" />
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
            <div
              className={`inline-flex items-center space-x-2 px-4 py-2 border-2 ${timeLeft <= 10 ? "border-red-400 bg-red-900/30" : "border-yellow-400 bg-yellow-900/30"}`}
            >
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className={`pixel-font text-lg font-bold ${timeLeft <= 10 ? "text-red-400" : "text-yellow-400"}`}>
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Question */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 border-4 border-green-400 question-glow mb-8">
            <div className="pixel-font text-sm text-green-400 mb-4">QUESTION {currentQuestion + 1}/∞</div>
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
                      ? "border-gray-600 bg-gray-800 hover:border-white hover:bg-gray-700"
                      : selectedAnswer === index
                        ? index === questions[selectedLanguage][currentQuestion].correct
                          ? "border-green-400 bg-green-900/50 text-green-400"
                          : "border-red-400 bg-red-900/50 text-red-400"
                        : index === questions[selectedLanguage][currentQuestion].correct && selectedAnswer !== null
                          ? "border-green-400 bg-green-900/30 text-green-300"
                          : "border-gray-600 bg-gray-800 text-gray-400"
                  }`}
                >
                  <span className="text-white/60 mr-3">{String.fromCharCode(65 + index)}.</span>
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
    )
  }

  if (battlePhase === "result") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          
          .pixel-font {
            font-family: 'Press Start 2P', monospace;
          }
        `}</style>

        <div className="text-center p-8">
          <div
            className={`w-32 h-32 mx-auto mb-8 flex items-center justify-center border-4 ${
              battleResult === "victory" ? "border-green-400 bg-green-900/30" : "border-red-400 bg-red-900/30"
            }`}
          >
            {battleResult === "victory" ? (
              <Trophy className="w-16 h-16 text-yellow-400" />
            ) : (
              <Sword className="w-16 h-16 text-red-400" />
            )}
          </div>

          <h1
            className={`pixel-font text-4xl font-bold mb-4 ${
              battleResult === "victory" ? "text-green-400" : "text-red-400"
            }`}
          >
            {battleResult === "victory" ? "VICTORY!" : "DEFEAT!"}
          </h1>

          <div className="pixel-font text-lg text-white mb-8">
            Final Score: {score.player} - {score.opponent}
          </div>

          {battleResult === "victory" && (
            <div className="bg-yellow-900/30 border-2 border-yellow-400 p-4 mb-8">
              <div className="pixel-font text-sm text-yellow-400 mb-2">BADGE EARNED & SAVED!</div>
              <div className="pixel-font text-lg text-white">{currentBattle.badge}</div>
              <div className="pixel-font text-xs text-green-400 mt-2">Progress saved to your account</div>
            </div>
          )}

          {battleResult === "victory" && (
            <div className="bg-blue-900/30 border-2 border-blue-400 p-4 mb-4">
              <div className="pixel-font text-sm text-blue-400 mb-2">XP GAINED!</div>
              <div className="pixel-font text-lg text-white">+{XP_PER_BATTLE} XP</div>
            </div>
          )}

          {levelUpNotification && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-purple-900 to-blue-900 border-4 border-purple-400 p-8 rounded-lg text-center animate-bounce">
                <div className="pixel-font text-2xl text-purple-400 mb-4">🎉 LEVEL UP! 🎉</div>
                <div className="pixel-font text-3xl text-white mb-6">Level {newLevel}</div>
                <button
                  onClick={() => {
                    setLevelUpNotification(false)
                    setNewLevel(null)
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 pixel-font text-sm font-bold transition-all duration-300 rounded"
                >
                  AWESOME!
                </button>
              </div>
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
    )
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
            Choose your weapon! Battle AI opponents in intense 1v1 coding duels. Answer correctly to deal damage, get it
            wrong and take a hit!
          </p>

          {/* User info */}
          {user && userProgress && (
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm pixel-font">
              <span className="text-cyan-400">Welcome, {userProgress.username || "Warrior"}!</span>
              <span className="text-gray-400">•</span>
              <span className="text-yellow-400">Level {userProgress.level || 1}</span>
            </div>
          )}
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
          <h3 className="pixel-font text-2xl font-bold text-yellow-400 text-center mb-6">BATTLE RULES</h3>

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
                Reduce opponent's health to 0 first! Earn exclusive badges saved to your account.
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
            <div className="pixel-font text-2xl text-white font-bold mb-1">{calculateTotalBadges()}</div>
            <div className="pixel-font text-xs text-blue-400">BADGES EARNED</div>
          </div>

          <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 p-6 border-2 border-green-400 text-center">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="pixel-font text-2xl text-white font-bold mb-1">{calculateBattlesWon()}</div>
            <div className="pixel-font text-xs text-green-400">BATTLES WON</div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-6 border-2 border-purple-400 text-center">
            <Flame className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="pixel-font text-2xl text-white font-bold mb-1">{userProgress?.level || 1}</div>
            <div className="pixel-font text-xs text-purple-400">CURRENT LEVEL</div>
          </div>
        </div>

        {/* Footer decorations */}
        <div className="text-center mt-16">
          <div className="flex justify-center space-x-4 text-red-500 pixel-font text-xs opacity-60">
            <span>{"⚔️"}</span>
            <span>{"🛡️"}</span>
            <span>{"⚡"}</span>
            <span>{"🏆"}</span>
            <span>{"💀"}</span>
            <span>{"🔥"}</span>
            <span>{"⭐"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeBattlesPage
