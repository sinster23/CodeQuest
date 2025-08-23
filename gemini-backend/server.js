const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Gemini Backend Server is running' });
});

// Generate coding challenges endpoint (NEW)
app.post('/api/generate-challenges', async (req, res) => {
  try {
    const { language, nodeId, nodeName, difficulty, challengeCount = 3 } = req.body;

    // Validate required parameters
    if (!language || !nodeId || !nodeName || !difficulty) {
      return res.status(400).json({
        error: 'Missing required parameters: language, nodeId, nodeName, and difficulty are required'
      });
    }

    console.log(`Generating ${challengeCount} challenges for ${language} - ${nodeName} (${nodeId})`);

    // Create the prompt for Gemini to generate coding challenges
    const challengePrompt = createChallengePrompt(language, nodeId, nodeName, difficulty, challengeCount);

    // Generate challenges using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(challengePrompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response from Gemini
    let challenges;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }
      
      const jsonText = jsonMatch[0];
      challenges = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Error parsing Gemini challenge response:', parseError);
      console.error('Raw response:', text);
      return res.status(500).json({
        error: 'Failed to parse challenges from AI response',
        details: parseError.message
      });
    }

    // Validate the challenges format
    if (!Array.isArray(challenges) || challenges.length === 0) {
      return res.status(500).json({
        error: 'Invalid challenges format received from AI'
      });
    }

    // Validate each challenge has required fields
    const validChallenges = challenges.filter(challenge => 
      challenge.title && 
      challenge.description && 
      challenge.prompt && 
      Array.isArray(challenge.hints)
    );

    if (validChallenges.length === 0) {
      return res.status(500).json({
        error: 'No valid challenges received from AI'
      });
    }

    // Add IDs to challenges if not present
    validChallenges.forEach((challenge, index) => {
      if (!challenge.id) {
        challenge.id = index + 1;
      }
      if (!challenge.difficulty) {
        challenge.difficulty = difficulty;
      }
    });

    console.log(`Successfully generated ${validChallenges.length} challenges`);

    res.json({
      success: true,
      challenges: validChallenges,
      language,
      nodeId,
      nodeName,
      difficulty,
      count: validChallenges.length
    });

  } catch (error) {
    console.error('Error generating challenges:', error);
    res.status(500).json({
      error: 'Failed to generate challenges',
      details: error.message
    });
  }
});

// Generate MCQ questions endpoint (EXISTING)
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { language, difficulty, battleName, count = 10 } = req.body;

    // Validate required parameters
    if (!language || !difficulty || !battleName) {
      return res.status(400).json({
        error: 'Missing required parameters: language, difficulty, and battleName are required'
      });
    }

    // Create the prompt for Gemini
    const prompt = createMCQPrompt(language, difficulty, battleName, count);

    // Generate questions using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response from Gemini
    let questions;
    try {
      // Clean the response text to extract JSON
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      const jsonText = text.substring(jsonStart, jsonEnd);
      questions = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Raw response:', text);
      return res.status(500).json({
        error: 'Failed to parse questions from AI response',
        details: parseError.message
      });
    }

    // Validate the questions format
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({
        error: 'Invalid questions format received from AI'
      });
    }

    // Validate each question has required fields
    const validQuestions = questions.filter(q => 
      q.question && 
      Array.isArray(q.options) && 
      q.options.length === 4 && 
      typeof q.correct === 'number' &&
      q.correct >= 0 && 
      q.correct < 4
    );

    if (validQuestions.length === 0) {
      return res.status(500).json({
        error: 'No valid questions received from AI'
      });
    }

    res.json({
      success: true,
      questions: validQuestions,
      language,
      difficulty,
      battleName,
      count: validQuestions.length
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      error: 'Failed to generate questions',
      details: error.message
    });
  }
});

// Code verification endpoint (EXISTING - NO CHANGES)
app.post('/api/verify-code', async (req, res) => {
  try {
    const { code, question, language, questionId, nodeId } = req.body;
    
    // Validate required parameters
    if (!code || !question || !language) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: code, question, and language are required'
      });
    }

    // Create verification prompt for Gemini
    const verificationPrompt = `
You are a ${language} code reviewer. Analyze this student's code solution for the given challenge.

CHALLENGE:
Title: ${question.title}
Description: ${question.description}
Prompt: ${question.prompt}

STUDENT CODE:
\`\`\`${language}
${code}
\`\`\`

Please verify if the code correctly solves the challenge. Provide detailed feedback in this EXACT JSON format (no additional text):

{
  "allPassed": boolean,
  "testResults": [
    {
      "description": "Test description",
      "passed": boolean,
      "feedback": "Specific feedback for this test"
    }
  ],
  "overallFeedback": "General feedback about the solution, coding style, and suggestions for improvement"
}

Evaluation criteria:
1. Does the code solve the problem correctly?
2. Does it follow good coding practices?
3. Are there any syntax errors?
4. Does it handle edge cases appropriately?
5. Is the code readable and well-structured?

Provide at least 2-4 test results covering different aspects of the solution.
`;

    // Call Gemini API with verification prompt
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(verificationPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response from Gemini
    let verificationResult;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const jsonText = jsonMatch[0];
      verificationResult = JSON.parse(jsonText);
      
      // Validate the response structure
      if (typeof verificationResult.allPassed !== 'boolean' || 
          !Array.isArray(verificationResult.testResults)) {
        throw new Error('Invalid response structure');
      }
      
    } catch (parseError) {
      console.error('Error parsing Gemini verification response:', parseError);
      console.error('Raw response:', text);
      
      // Fallback response if parsing fails
      verificationResult = {
        allPassed: false,
        testResults: [
          {
            description: "Code Analysis",
            passed: false,
            feedback: "Unable to analyze code properly. Please check your syntax and try again."
          }
        ],
        overallFeedback: "There was an issue analyzing your code. Please ensure your code is syntactically correct and try again."
      };
    }

    // Ensure we have the required fields
    const response_data = {
      success: true,
      allPassed: verificationResult.allPassed || false,
      testResults: verificationResult.testResults || [],
      overallFeedback: verificationResult.overallFeedback || "Code analysis completed."
    };

    console.log(`Code verification completed for ${language} challenge: ${question.title}`);
    console.log(`Result: ${response_data.allPassed ? 'PASSED' : 'FAILED'}`);
    
    res.json(response_data);

  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify code',
      details: error.message
    });
  }
});

// Create challenge prompt for Gemini (NEW FUNCTION)
function createChallengePrompt(language, nodeId, nodeName, difficulty, count) {
  // Node-specific topics mapping
  const nodeTopics = {
    // JavaScript nodes
    'js-basics-1': {
      topic: 'Variables and Data Types',
      concepts: ['variable declaration (let, const, var)', 'primitive data types', 'type conversion', 'variable scope'],
      starterCode: '// Declare variables here\nlet myVariable;\nconst PI = 3.14159;\n\n// Your solution:\n'
    },
    'js-basics-2': {
      topic: 'Functions',
      concepts: ['function declaration', 'function expressions', 'arrow functions', 'parameters and arguments', 'return statements'],
      starterCode: '// Create your function here\nfunction myFunction() {\n  // Your code here\n}\n\n'
    },
    'js-basics-3': {
      topic: 'Control Flow',
      concepts: ['if-else statements', 'switch statements', 'ternary operator', 'logical operators'],
      starterCode: '// Use control flow statements\nif (condition) {\n  // Your logic here\n}\n\n'
    },
    'js-vars-1': {
      topic: 'Arrays',
      concepts: ['array creation', 'array methods', 'array iteration', 'array manipulation'],
      starterCode: '// Work with arrays\nlet myArray = [];\n\n// Your solution:\n'
    },
    'js-vars-2': {
      topic: 'Objects',
      concepts: ['object creation', 'object properties', 'object methods', 'object destructuring'],
      starterCode: '// Create and work with objects\nlet myObject = {};\n\n// Your solution:\n'
    },
    'js-vars-3': {
      topic: 'Loops',
      concepts: ['for loops', 'while loops', 'for...of loops', 'for...in loops', 'loop control'],
      starterCode: '// Use loops to iterate\nfor (let i = 0; i < 10; i++) {\n  // Your code here\n}\n\n'
    },
    'js-vars-4': {
      topic: 'DOM Manipulation',
      concepts: ['selecting elements', 'modifying content', 'event handling', 'element creation'],
      starterCode: '// DOM manipulation\n// Example: document.getElementById()\n\n// Your solution:\n'
    },

    // Python nodes
    'py-basics-1': {
      topic: 'Python Syntax and Variables',
      concepts: ['variable assignment', 'naming conventions', 'basic data types', 'print statements'],
      starterCode: '# Python basics\n# Declare variables here\nmy_variable = None\n\n# Your solution:\n'
    },
    'py-basics-2': {
      topic: 'Python Data Types',
      concepts: ['strings', 'integers', 'floats', 'booleans', 'type conversion'],
      starterCode: '# Work with different data types\nmy_string = ""\nmy_number = 0\nmy_boolean = True\n\n# Your solution:\n'
    },
    'py-inter-1': {
      topic: 'Lists and Tuples',
      concepts: ['list creation', 'list methods', 'tuple properties', 'indexing and slicing'],
      starterCode: '# Work with lists and tuples\nmy_list = []\nmy_tuple = ()\n\n# Your solution:\n'
    },
    'py-inter-2': {
      topic: 'Dictionaries',
      concepts: ['dictionary creation', 'key-value pairs', 'dictionary methods', 'dictionary comprehension'],
      starterCode: '# Work with dictionaries\nmy_dict = {}\n\n# Your solution:\n'
    },

    // HTML/CSS nodes
    'html-basics-1': {
      topic: 'HTML Structure',
      concepts: ['HTML tags', 'document structure', 'semantic elements', 'attributes'],
      starterCode: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Your Page</title>\n</head>\n<body>\n  <!-- Your HTML here -->\n</body>\n</html>\n'
    },
    'html-basics-2': {
      topic: 'CSS Styling',
      concepts: ['CSS selectors', 'properties', 'values', 'styling methods'],
      starterCode: '/* CSS styling */\n.my-class {\n  /* Your styles here */\n}\n\n'
    },

    // React nodes
    'react-basics-1': {
      topic: 'React Components',
      concepts: ['functional components', 'JSX', 'component structure', 'rendering'],
      starterCode: 'import React from "react";\n\nfunction MyComponent() {\n  // Your component logic here\n  return (\n    <div>\n      {/* Your JSX here */}\n    </div>\n  );\n}\n\nexport default MyComponent;\n'
    },
    'react-basics-2': {
      topic: 'Props and State',
      concepts: ['props usage', 'useState hook', 'state management', 'component communication'],
      starterCode: 'import React, { useState } from "react";\n\nfunction MyComponent() {\n  const [state, setState] = useState("");\n  \n  // Your component logic here\n  return (\n    <div>\n      {/* Your JSX here */}\n    </div>\n  );\n}\n'
    }
  };

  const difficultyLevels = {
    1: 'beginner level with very basic concepts',
    2: 'beginner to intermediate level with fundamental concepts',
    3: 'intermediate level with moderate complexity',
    4: 'advanced level with complex concepts',
    5: 'expert level with very advanced concepts'
  };

  const nodeInfo = nodeTopics[nodeId] || {
    topic: nodeName,
    concepts: [`${nodeName.toLowerCase()} concepts`, 'programming fundamentals'],
    starterCode: `// ${nodeName} challenge\n// Write your solution here\n\n`
  };

  const difficultyDescription = difficultyLevels[difficulty] || 'moderate level';

  return `Generate exactly ${count} coding challenges for ${language} programming, specifically focusing on: ${nodeInfo.topic}.

The challenges should cover these concepts: ${nodeInfo.concepts.join(', ')}.
The difficulty should be ${difficultyDescription}.

Requirements for each challenge:
1. Must be practical and test real programming knowledge
2. Should be relevant to the topic: ${nodeInfo.topic}
3. Include clear, specific instructions
4. Provide helpful hints (3-5 hints per challenge)
5. Include appropriate starter code
6. Be suitable for ${language} programming

Return the response as a valid JSON array with this EXACT format:
[
  {
    "id": 1,
    "title": "Challenge Title",
    "difficulty": ${difficulty},
    "description": "Brief description of what this challenge teaches",
    "prompt": "Detailed instructions for what the student needs to implement. Be very specific about requirements and expected behavior.",
    "starterCode": "// Appropriate starter code for ${language}\\n// Include helpful comments\\n",
    "hints": [
      "Specific hint about the approach",
      "Hint about ${language} syntax or methods to use",
      "Hint about edge cases or considerations",
      "Hint about best practices"
    ]
  }
]

Important guidelines:
- Make challenges progressive in difficulty within the topic
- Use real-world scenarios when possible
- Ensure starter code is syntactically correct
- Make hints specific and actionable
- Focus on ${nodeInfo.topic} concepts throughout
- For difficulty ${difficulty}, make it appropriately challenging

Generate ${count} challenges now:`;
}

// Create MCQ prompt for Gemini (EXISTING FUNCTION - RENAMED)
function createMCQPrompt(language, difficulty, battleName, count) {
  const difficultyMapping = {
    'EASY': 'beginner level with basic concepts',
    'MEDIUM': 'intermediate level with moderate complexity',
    'HARD': 'advanced level with complex concepts',
    'EXPERT': 'expert level with very advanced concepts and edge cases'
  };

  const languageTopics = {
    javascript: {
      'Variable Warrior': 'variables, data types, variable declaration, scope',
      'Function Fighter': 'functions, parameters, return values, function expressions, arrow functions',
      'Array Assassin': 'arrays, array methods, iteration, array manipulation',
      'Object Oracle': 'objects, properties, methods, object manipulation, JSON',
      'Async Overlord': 'promises, async/await, callbacks, event loop, asynchronous programming'
    },
    typescript: {
      'Type Guardian': 'basic types, type annotations, type inference',
      'Interface Enforcer': 'interfaces, object types, interface inheritance',
      'Generic Genius': 'generics, type parameters, generic constraints',
      'Decorator Demon': 'decorators, metadata, decorator patterns',
      'Module Monarch': 'modules, namespaces, import/export, module resolution'
    },
    python: {
      'Snake Charmer': 'basic syntax, variables, data types, basic operations',
      'List Liberator': 'lists, list methods, list comprehensions, iteration',
      'Dict Destroyer': 'dictionaries, dictionary methods, key-value operations',
      'Class Crusher': 'classes, objects, inheritance, methods, OOP concepts',
      'Pandas Paladin': 'pandas library, dataframes, data manipulation, data analysis'
    },
    cpp: {
      'Pointer Pioneer': 'pointers, memory addresses, pointer arithmetic, pointer operations',
      'Memory Manager': 'memory allocation, new/delete, stack vs heap, memory management',
      'Template Titan': 'templates, template functions, template classes, generic programming',
      'STL Samurai': 'Standard Template Library, containers, algorithms, iterators',
      'Performance Predator': 'optimization, performance considerations, efficient coding'
    },
    java: {
      'Class Captain': 'classes, objects, constructors, basic OOP concepts',
      'Interface Invader': 'interfaces, abstract classes, implementation, polymorphism',
      'Stream Soldier': 'Java 8 streams, lambda expressions, functional programming',
      'Concurrency Conqueror': 'threading, synchronization, concurrent programming',
      'Spring Sentinel': 'Spring framework, dependency injection, Spring Boot'
    }
  };

  const topics = languageTopics[language]?.[battleName] || `${language} programming concepts`;
  const difficultyDescription = difficultyMapping[difficulty] || 'moderate level';

  return `Generate exactly ${count} multiple choice questions about ${language} programming, specifically focusing on: ${topics}.

The difficulty should be ${difficultyDescription}.

Requirements:
1. Each question must be practical and test real programming knowledge
2. Each question must have exactly 4 options (A, B, C, D)
3. Only one option should be correct
4. The correct answer index should be 0-based (0, 1, 2, or 3)
5. Questions should be relevant to ${battleName} theme
6. Avoid overly tricky or ambiguous questions
7. Include a mix of syntax, concepts, and practical application questions

Return the response as a valid JSON array with this exact format:
[
  {
    "question": "What is the correct way to declare a variable in ${language}?",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": 0
  }
]

Generate ${count} questions now:`;
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The requested endpoint does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Gemini Backend Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 MCQ Questions API: http://localhost:${PORT}/api/generate-questions`);
  console.log(`🎯 Challenges API: http://localhost:${PORT}/api/generate-challenges`);
  console.log(`✅ Code Verification API: http://localhost:${PORT}/api/verify-code`);
});

module.exports = app;