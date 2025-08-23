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

// Generate MCQ questions endpoint
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
    const prompt = createPrompt(language, difficulty, battleName, count);

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

// Create prompt for Gemini based on parameters
function createPrompt(language, difficulty, battleName, count) {
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
  console.log(`🤖 Questions API: http://localhost:${PORT}/api/generate-questions`);
});

module.exports = app;