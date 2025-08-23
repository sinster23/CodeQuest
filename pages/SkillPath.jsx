import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Lock, 
  CheckCircle, 
  Play, 
  Star, 
  Trophy, 
  Code, 
  Zap, 
  Crown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Brain,
  Cpu,
  Database,
  Globe,
  Palette,
  Shield,
  Gamepad2,
  X,
  Clock,
  Award,
  Loader2
} from 'lucide-react';
import ChallengePage from '../pages/ChallengePage';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../src/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const SkillsPathPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedNode, setSelectedNode] = useState(null);
  const [userProgress, setUserProgress] = useState({
    javascript: { completedNodes: [], currentXP: 0 },
    python: { completedNodes: [], currentXP: 0 },
    html: { completedNodes: [], currentXP: 0 },
    react: { completedNodes: [], currentXP: 0 },
    algorithms: { completedNodes: [], currentXP: 0 },
    databases: { completedNodes: [], currentXP: 0 }
  });
  const [showChallengePage, setShowChallengePage] = useState(false);
  const [selectedChallengeNode, setSelectedChallengeNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // Load user data from Firebase
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // If skillsPath data exists, use it; otherwise initialize with defaults
          if (userData.skillsPath) {
            setUserProgress(userData.skillsPath);
          } else {
            // Initialize skillsPath structure in Firestore if it doesn't exist
            const initialSkillsPath = {
              javascript: { completedNodes: [], currentXP: 0 },
              python: { completedNodes: [], currentXP: 0 },
              html: { completedNodes: [], currentXP: 0 },
              react: { completedNodes: [], currentXP: 0 },
              algorithms: { completedNodes: [], currentXP: 0 },
              databases: { completedNodes: [], currentXP: 0 }
            };
            
            setUserProgress(initialSkillsPath);
            
            // Update Firestore with initial structure
            await updateDoc(doc(db, 'users', user.uid), {
              skillsPath: initialSkillsPath,
              lastUpdated: serverTimestamp()
            });
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, navigate]);

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

  // When user clicks "START CHALLENGES"
  const startChallenges = (node) => {
    setSelectedChallengeNode(node);
    setShowChallengePage(true);
    setSelectedNode(null);
  };

  // Handle completion and update Firebase
  const handleChallengeComplete = async (nodeId) => {
    if (!user) return;

    try {
      const newCompleted = [...userProgress[selectedLanguage].completedNodes, nodeId];
      const newXP = userProgress[selectedLanguage].currentXP + selectedChallengeNode.xp;
      
      const updatedProgress = {
        ...userProgress,
        [selectedLanguage]: {
          ...userProgress[selectedLanguage],
          completedNodes: newCompleted,
          currentXP: newXP
        }
      };
      
      // Update local state
      setUserProgress(updatedProgress);
      
      // Calculate total XP across all languages
      const totalXP = Object.values(updatedProgress).reduce((total, lang) => total + lang.currentXP, 0);
      
      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        skillsPath: updatedProgress,
        xp: totalXP,
        lastUpdated: serverTimestamp()
      });
      
      setShowChallengePage(false);
      setSelectedChallengeNode(null);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: Code, color: 'from-yellow-600 to-yellow-800', nodes: 15 },
    { id: 'python', name: 'Python', icon: Brain, color: 'from-blue-600 to-blue-800', nodes: 12 },
    { id: 'html', name: 'HTML/CSS', icon: Globe, color: 'from-orange-600 to-orange-800', nodes: 10 },
    { id: 'react', name: 'React', icon: Cpu, color: 'from-cyan-600 to-cyan-800', nodes: 14 },
    { id: 'algorithms', name: 'Algorithms', icon: Shield, color: 'from-purple-600 to-purple-800', nodes: 18 },
    { id: 'databases', name: 'Databases', icon: Database, color: 'from-green-600 to-green-800', nodes: 8 }
  ];

  const skillTrees = {
    javascript: {
      name: 'JavaScript Mastery',
      nodes: [
        // Row 1 - Basics
        { id: 'js-basics-1', name: 'Variables & Types', x: 2, y: 1, xp: 50, difficulty: 1, prerequisites: [], challenges: 3 },
        { id: 'js-basics-2', name: 'Functions', x: 4, y: 1, xp: 75, difficulty: 1, prerequisites: ['js-basics-1'], challenges: 4 },
        { id: 'js-basics-3', name: 'Control Flow', x: 6, y: 1, xp: 75, difficulty: 2, prerequisites: ['js-basics-2'], challenges: 5 },
        
        // Row 2 - Intermediate
        { id: 'js-vars-1', name: 'Arrays', x: 1, y: 2, xp: 100, difficulty: 2, prerequisites: ['js-basics-1'], challenges: 6 },
        { id: 'js-vars-2', name: 'Objects', x: 3, y: 2, xp: 100, difficulty: 2, prerequisites: ['js-basics-2'], challenges: 5 },
        { id: 'js-vars-3', name: 'Loops', x: 5, y: 2, xp: 100, difficulty: 2, prerequisites: ['js-basics-3'], challenges: 7 },
        { id: 'js-vars-4', name: 'DOM Manipulation', x: 7, y: 2, xp: 125, difficulty: 3, prerequisites: ['js-basics-3'], challenges: 8 },
        
        // Row 3 - Advanced
        { id: 'js-adv-1', name: 'Async/Await', x: 2, y: 3, xp: 150, difficulty: 3, prerequisites: ['js-vars-2'], challenges: 6 },
        { id: 'js-adv-2', name: 'Promises', x: 4, y: 3, xp: 150, difficulty: 3, prerequisites: ['js-vars-3'], challenges: 5 },
        { id: 'js-adv-3', name: 'ES6+ Features', x: 6, y: 3, xp: 175, difficulty: 4, prerequisites: ['js-vars-4'], challenges: 9 },
        
        // Row 4 - Expert
        { id: 'js-expert-1', name: 'Design Patterns', x: 3, y: 4, xp: 200, difficulty: 4, prerequisites: ['js-adv-1', 'js-adv-2'], challenges: 8 },
        { id: 'js-expert-2', name: 'Performance', x: 5, y: 4, xp: 200, difficulty: 5, prerequisites: ['js-adv-2', 'js-adv-3'], challenges: 10 },
        
        // Row 5 - Master
        { id: 'js-master', name: 'JS Master', x: 4, y: 5, xp: 300, difficulty: 5, prerequisites: ['js-expert-1', 'js-expert-2'], challenges: 12 }
      ]
    },
    python: {
      name: 'Python Programming',
      nodes: [
        { id: 'py-basics-1', name: 'Syntax & Variables', x: 2, y: 1, xp: 50, difficulty: 1, prerequisites: [], challenges: 3 },
        { id: 'py-basics-2', name: 'Data Types', x: 4, y: 1, xp: 75, difficulty: 1, prerequisites: ['py-basics-1'], challenges: 4 },
        { id: 'py-basics-3', name: 'Functions', x: 6, y: 1, xp: 75, difficulty: 2, prerequisites: ['py-basics-2'], challenges: 5 },
        
        { id: 'py-inter-1', name: 'Lists & Tuples', x: 1, y: 2, xp: 100, difficulty: 2, prerequisites: ['py-basics-1'], challenges: 6 },
        { id: 'py-inter-2', name: 'Dictionaries', x: 3, y: 2, xp: 100, difficulty: 2, prerequisites: ['py-basics-2'], challenges: 5 },
        { id: 'py-inter-3', name: 'Classes & OOP', x: 5, y: 2, xp: 125, difficulty: 3, prerequisites: ['py-basics-3'], challenges: 7 },
        { id: 'py-inter-4', name: 'File Handling', x: 7, y: 2, xp: 100, difficulty: 2, prerequisites: ['py-basics-3'], challenges: 4 },
        
        { id: 'py-adv-1', name: 'Decorators', x: 2, y: 3, xp: 150, difficulty: 4, prerequisites: ['py-inter-2'], challenges: 6 },
        { id: 'py-adv-2', name: 'Generators', x: 4, y: 3, xp: 150, difficulty: 4, prerequisites: ['py-inter-3'], challenges: 5 },
        { id: 'py-adv-3', name: 'Libraries', x: 6, y: 3, xp: 175, difficulty: 3, prerequisites: ['py-inter-4'], challenges: 8 },
        
        { id: 'py-master', name: 'Python Master', x: 4, y: 4, xp: 300, difficulty: 5, prerequisites: ['py-adv-1', 'py-adv-2', 'py-adv-3'], challenges: 12 }
      ]
    },
    html: {
      name: 'Web Development',
      nodes: [
        { id: 'html-basics-1', name: 'HTML Structure', x: 2, y: 1, xp: 50, difficulty: 1, prerequisites: [], challenges: 3 },
        { id: 'html-basics-2', name: 'CSS Styling', x: 4, y: 1, xp: 75, difficulty: 1, prerequisites: ['html-basics-1'], challenges: 4 },
        { id: 'html-basics-3', name: 'Responsive Design', x: 6, y: 1, xp: 100, difficulty: 2, prerequisites: ['html-basics-2'], challenges: 5 },
        
        { id: 'html-inter-1', name: 'Flexbox', x: 1, y: 2, xp: 100, difficulty: 2, prerequisites: ['html-basics-2'], challenges: 4 },
        { id: 'html-inter-2', name: 'Grid Layout', x: 3, y: 2, xp: 125, difficulty: 3, prerequisites: ['html-basics-3'], challenges: 6 },
        { id: 'html-inter-3', name: 'Animations', x: 5, y: 2, xp: 150, difficulty: 3, prerequisites: ['html-basics-3'], challenges: 7 },
        { id: 'html-inter-4', name: 'Forms', x: 7, y: 2, xp: 100, difficulty: 2, prerequisites: ['html-basics-3'], challenges: 5 },
        
        { id: 'html-adv-1', name: 'SASS/SCSS', x: 3, y: 3, xp: 175, difficulty: 4, prerequisites: ['html-inter-1', 'html-inter-2'], challenges: 8 },
        { id: 'html-adv-2', name: 'Advanced CSS', x: 5, y: 3, xp: 200, difficulty: 4, prerequisites: ['html-inter-3', 'html-inter-4'], challenges: 9 },
        
        { id: 'html-master', name: 'CSS Master', x: 4, y: 4, xp: 300, difficulty: 5, prerequisites: ['html-adv-1', 'html-adv-2'], challenges: 12 }
      ]
    },
    react: {
      name: 'React Development',
      nodes: [
        { id: 'react-basics-1', name: 'Components', x: 2, y: 1, xp: 75, difficulty: 2, prerequisites: [], challenges: 4 },
        { id: 'react-basics-2', name: 'Props & State', x: 4, y: 1, xp: 100, difficulty: 2, prerequisites: ['react-basics-1'], challenges: 5 },
        { id: 'react-basics-3', name: 'Event Handling', x: 6, y: 1, xp: 100, difficulty: 2, prerequisites: ['react-basics-2'], challenges: 4 },
        
        { id: 'react-hooks-1', name: 'useState', x: 1, y: 2, xp: 125, difficulty: 3, prerequisites: ['react-basics-2'], challenges: 6 },
        { id: 'react-hooks-2', name: 'useEffect', x: 3, y: 2, xp: 125, difficulty: 3, prerequisites: ['react-basics-3'], challenges: 6 },
        { id: 'react-hooks-3', name: 'Custom Hooks', x: 5, y: 2, xp: 150, difficulty: 4, prerequisites: ['react-hooks-1', 'react-hooks-2'], challenges: 8 },
        { id: 'react-router', name: 'React Router', x: 7, y: 2, xp: 125, difficulty: 3, prerequisites: ['react-basics-3'], challenges: 5 },
        
        { id: 'react-context', name: 'Context API', x: 2, y: 3, xp: 175, difficulty: 4, prerequisites: ['react-hooks-2'], challenges: 7 },
        { id: 'react-redux', name: 'Redux', x: 4, y: 3, xp: 200, difficulty: 5, prerequisites: ['react-hooks-3'], challenges: 9 },
        { id: 'react-testing', name: 'Testing', x: 6, y: 3, xp: 150, difficulty: 4, prerequisites: ['react-router'], challenges: 6 },
        
        { id: 'react-performance', name: 'Performance', x: 3, y: 4, xp: 200, difficulty: 5, prerequisites: ['react-context', 'react-redux'], challenges: 8 },
        { id: 'react-advanced', name: 'Advanced Patterns', x: 5, y: 4, xp: 225, difficulty: 5, prerequisites: ['react-redux', 'react-testing'], challenges: 10 },
        
        { id: 'react-master', name: 'React Master', x: 4, y: 5, xp: 350, difficulty: 5, prerequisites: ['react-performance', 'react-advanced'], challenges: 15 }
      ]
    },
    algorithms: {
      name: 'Algorithm Mastery',
      nodes: [
        { id: 'algo-basics-1', name: 'Big O Notation', x: 2, y: 1, xp: 75, difficulty: 2, prerequisites: [], challenges: 4 },
        { id: 'algo-basics-2', name: 'Basic Sorting', x: 4, y: 1, xp: 100, difficulty: 2, prerequisites: ['algo-basics-1'], challenges: 6 },
        { id: 'algo-basics-3', name: 'Linear Search', x: 6, y: 1, xp: 75, difficulty: 2, prerequisites: ['algo-basics-1'], challenges: 4 },
        
        { id: 'algo-search-1', name: 'Binary Search', x: 1, y: 2, xp: 125, difficulty: 3, prerequisites: ['algo-basics-3'], challenges: 5 },
        { id: 'algo-sort-1', name: 'Merge Sort', x: 3, y: 2, xp: 150, difficulty: 3, prerequisites: ['algo-basics-2'], challenges: 6 },
        { id: 'algo-sort-2', name: 'Quick Sort', x: 5, y: 2, xp: 150, difficulty: 3, prerequisites: ['algo-basics-2'], challenges: 6 },
        { id: 'algo-data-1', name: 'Arrays & Strings', x: 7, y: 2, xp: 125, difficulty: 3, prerequisites: ['algo-basics-3'], challenges: 8 },
        
        { id: 'algo-struct-1', name: 'Stacks & Queues', x: 2, y: 3, xp: 175, difficulty: 4, prerequisites: ['algo-search-1'], challenges: 7 },
        { id: 'algo-struct-2', name: 'Linked Lists', x: 4, y: 3, xp: 175, difficulty: 4, prerequisites: ['algo-sort-1', 'algo-sort-2'], challenges: 8 },
        { id: 'algo-struct-3', name: 'Hash Tables', x: 6, y: 3, xp: 200, difficulty: 4, prerequisites: ['algo-data-1'], challenges: 9 },
        
        { id: 'algo-tree-1', name: 'Binary Trees', x: 1, y: 4, xp: 200, difficulty: 4, prerequisites: ['algo-struct-1'], challenges: 8 },
        { id: 'algo-tree-2', name: 'Tree Traversal', x: 3, y: 4, xp: 225, difficulty: 5, prerequisites: ['algo-struct-2'], challenges: 10 },
        { id: 'algo-graph-1', name: 'Graph Basics', x: 5, y: 4, xp: 225, difficulty: 5, prerequisites: ['algo-struct-3'], challenges: 9 },
        { id: 'algo-dp', name: 'Dynamic Programming', x: 7, y: 4, xp: 250, difficulty: 5, prerequisites: ['algo-struct-3'], challenges: 12 },
        
        { id: 'algo-advanced-1', name: 'Graph Algorithms', x: 2, y: 5, xp: 275, difficulty: 5, prerequisites: ['algo-tree-1', 'algo-tree-2'], challenges: 11 },
        { id: 'algo-advanced-2', name: 'Advanced DP', x: 4, y: 5, xp: 300, difficulty: 5, prerequisites: ['algo-graph-1', 'algo-dp'], challenges: 13 },
        { id: 'algo-advanced-3', name: 'Greedy Algorithms', x: 6, y: 5, xp: 275, difficulty: 5, prerequisites: ['algo-dp'], challenges: 10 },
        
        { id: 'algo-master', name: 'Algorithm Master', x: 4, y: 6, xp: 500, difficulty: 5, prerequisites: ['algo-advanced-1', 'algo-advanced-2', 'algo-advanced-3'], challenges: 20 }
      ]
    },
    databases: {
      name: 'Database Mastery',
      nodes: [
        { id: 'db-basics-1', name: 'SQL Fundamentals', x: 2, y: 1, xp: 75, difficulty: 2, prerequisites: [], challenges: 4 },
        { id: 'db-basics-2', name: 'Database Design', x: 4, y: 1, xp: 100, difficulty: 2, prerequisites: ['db-basics-1'], challenges: 5 },
        { id: 'db-basics-3', name: 'Normalization', x: 6, y: 1, xp: 125, difficulty: 3, prerequisites: ['db-basics-2'], challenges: 6 },
        
        { id: 'db-queries-1', name: 'Advanced Queries', x: 1, y: 2, xp: 150, difficulty: 3, prerequisites: ['db-basics-1'], challenges: 7 },
        { id: 'db-queries-2', name: 'Joins & Subqueries', x: 3, y: 2, xp: 175, difficulty: 4, prerequisites: ['db-basics-2'], challenges: 8 },
        { id: 'db-admin', name: 'Database Admin', x: 5, y: 2, xp: 200, difficulty: 4, prerequisites: ['db-basics-3'], challenges: 9 },
        { id: 'db-nosql', name: 'NoSQL Basics', x: 7, y: 2, xp: 150, difficulty: 3, prerequisites: ['db-basics-3'], challenges: 6 },
        
        { id: 'db-master', name: 'Database Master', x: 4, y: 3, xp: 350, difficulty: 5, prerequisites: ['db-queries-1', 'db-queries-2', 'db-admin', 'db-nosql'], challenges: 15 }
      ]
    }
  };

  const getNodeStatus = (nodeId) => {
    const completed = userProgress[selectedLanguage].completedNodes.includes(nodeId);
    const node = skillTrees[selectedLanguage].nodes.find(n => n.id === nodeId);
    const prereqsMet = node.prerequisites.every(prereq => 
      userProgress[selectedLanguage].completedNodes.includes(prereq)
    );
    
    return {
      completed,
      available: prereqsMet && !completed,
      locked: !prereqsMet && !completed
    };
  };

  const NodeComponent = ({ node }) => {
    const status = getNodeStatus(node.id);
    
    return (
      <div 
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110`}
        style={{ 
          left: `${(node.x / 8) * 100}%`, 
          top: `${(node.y / 7) * 100}%` 
        }}
        onClick={() => setSelectedNode(node)}
      >
        <div className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center
          ${status.completed ? 'bg-green-500 border-green-300 shadow-green-500/50' : 
            status.available ? 'bg-blue-500 border-blue-300 shadow-blue-500/50 hover:bg-blue-400' : 
            'bg-gray-600 border-gray-400 shadow-gray-500/30'} 
          shadow-lg`}>
          
          {status.completed && <CheckCircle className="w-8 h-8 text-white" />}
          {status.available && <Play className="w-8 h-8 text-white ml-1" />}
          {status.locked && <Lock className="w-8 h-8 text-gray-300" />}
          
          {/* Difficulty stars */}
          <div className="absolute -top-2 -right-1 flex">
            {[...Array(node.difficulty)].map((_, i) => (
              <Star key={i} className="w-2 h-2 text-yellow-400" fill="currentColor" />
            ))}
          </div>
        </div>
        
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
          <div className="pixel-font text-xs text-white bg-black/80 px-2 py-1 rounded whitespace-nowrap">
            {node.name}
          </div>
        </div>
      </div>
    );
  };

  const ConnectionLine = ({ from, to }) => {
    const fromNode = skillTrees[selectedLanguage].nodes.find(n => n.id === from);
    const toNode = skillTrees[selectedLanguage].nodes.find(n => n.id === to);
    
    if (!fromNode || !toNode) return null;
    
    const fromStatus = getNodeStatus(from);
    const toStatus = getNodeStatus(to);
    
    return (
      <line
        x1={`${(fromNode.x / 8) * 100}%`}
        y1={`${(fromNode.y / 7) * 100}%`}
        x2={`${(toNode.x / 8) * 100}%`}
        y2={`${(toNode.y / 7) * 100}%`}
        stroke={fromStatus.completed ? '#22c55e' : toStatus.available ? '#3b82f6' : '#6b7280'}
        strokeWidth="3"
        opacity="0.7"
        className="transition-all duration-300"
      />
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your skills progress...</p>
        </div>
      </div>
    );
  }

  // If showing challenge page, render it instead of the main interface
  if (showChallengePage && selectedChallengeNode) {
    return (
      <ChallengePage
        node={selectedChallengeNode}
        language={selectedLanguage}
        onComplete={handleChallengeComplete}
        onBack={() => {
          setShowChallengePage(false);
          setSelectedChallengeNode(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white relative overflow-hidden">
      {/* Custom Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pixel-font {
          font-family: 'Press Start 2P', monospace;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      
        .floating-orb {
          animation: floatOrb 4s ease-in-out infinite;
        }
        
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        
        .skill-tree-grid {
          background-image: 
            radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0),
            radial-gradient(circle at 75px 75px, rgba(255,255,255,0.05) 2px, transparent 0);
          background-size: 50px 50px;
        }
        
        .retro-card {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(30, 30, 30, 0.9));
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .progress-bar {
          background: linear-gradient(90deg, #8b5cf6, #06b6d4);
          height: 6px;
          border-radius: 3px;
        }
      `}</style>

      {/* Floating decorations */}
      <div className="floating-orb absolute w-4 h-4 bg-purple-400 rounded-full" style={{top: '10%', left: '5%', animationDelay: '0s'}}></div>
      <div className="floating-orb absolute w-3 h-3 bg-cyan-400 rounded-full" style={{top: '70%', right: '8%', animationDelay: '2s'}}></div>
      <div className="floating-orb absolute w-2 h-2 bg-yellow-400 rounded-full" style={{top: '30%', right: '15%', animationDelay: '4s'}}></div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded border-2 border-gray-600 transition-colors">
              <ChevronLeft onClick={() => navigate('/games')} className="w-6 h-6 text-white" />
            </button>
            <h1 className="pixel-font text-2xl md:text-4xl font-bold text-zinc-400">
              Skills Path
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-black/50 p-3 rounded border border-purple-400/30">
              <div className="pixel-font text-xs text-purple-300">Total XP</div>
              <div className="pixel-font text-lg text-white font-bold">
                {Object.values(userProgress).reduce((total, lang) => total + lang.currentXP, 0)}
              </div>
            </div>
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Language Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {languages.map((lang) => {
            const Icon = lang.icon;
            const completedNodes = userProgress[lang.id].completedNodes.length;
            const totalNodes = lang.nodes;
            const progress = (completedNodes / totalNodes) * 100;
            
            return (
              <div 
                key={lang.id}
                className={`retro-card p-4 cursor-pointer transition-all duration-300 transform hover:scale-105
                  ${selectedLanguage === lang.id ? 'border-purple-400 shadow-purple-400/50 shadow-lg' : 'hover:border-white/40'}`}
                onClick={() => setSelectedLanguage(lang.id)}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${lang.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="pixel-font text-xs text-center text-white mb-2">{lang.name}</h3>
                
                <div className="w-full bg-gray-700 h-2 rounded mb-2">
                  <div 
                    className="progress-bar h-full rounded transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="text-center">
                  <span className="pixel-font text-xs text-gray-300">{completedNodes}/{totalNodes}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skill Tree */}
          <div className="lg:col-span-2">
            <div className="retro-card p-6">
              <h2 className="pixel-font text-xl font-bold text-white mb-6 text-center">
                {skillTrees[selectedLanguage].name}
              </h2>
              
              <div className="skill-tree-grid relative h-96 md:h-[500px] bg-gradient-to-br from-gray-900/50 to-black/50 rounded border border-gray-600 overflow-hidden">
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  {skillTrees[selectedLanguage].nodes.map(node => 
                    node.prerequisites.map(prereq => (
                      <ConnectionLine key={`${prereq}-${node.id}`} from={prereq} to={node.id} />
                    ))
                  ).flat()}
                </svg>
                
                {/* Nodes */}
                <div className="relative w-full h-full" style={{ zIndex: 2 }}>
                  {skillTrees[selectedLanguage].nodes.map(node => (
                    <NodeComponent key={node.id} node={node} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Language Stats */}
            <div className="retro-card p-6">
              <h3 className="pixel-font text-lg font-bold text-cyan-400 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Progress Stats
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="pixel-font text-xs text-gray-300">Nodes Completed</span>
                    <span className="pixel-font text-xs text-white font-bold">
                      {userProgress[selectedLanguage].completedNodes.length}/{skillTrees[selectedLanguage].nodes.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 h-3 rounded">
                    <div 
                      className="progress-bar h-full rounded transition-all duration-500"
                      style={{ width: `${(userProgress[selectedLanguage].completedNodes.length / skillTrees[selectedLanguage].nodes.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="pixel-font text-lg text-purple-400 font-bold">
                      {userProgress[selectedLanguage].currentXP}
                    </div>
                    <div className="pixel-font text-xs text-gray-400">Total XP</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="pixel-font text-lg text-yellow-400 font-bold">
                      {skillTrees[selectedLanguage].nodes.reduce((total, node) => 
                        userProgress[selectedLanguage].completedNodes.includes(node.id) ? total + 1 : total, 0
                      )}
                    </div>
                    <div className="pixel-font text-xs text-gray-400">Challenges Won</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Node Details */}
            {selectedNode && (
              <div className="retro-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="pixel-font text-lg font-bold text-yellow-400">{selectedNode.name}</h3>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="pixel-font text-xs text-gray-400">Difficulty:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < selectedNode.difficulty ? 'text-yellow-400' : 'text-gray-600'}`} 
                          fill="currentColor" 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="pixel-font text-xs text-gray-400">XP Reward:</span>
                    <span className="pixel-font text-xs text-purple-400 font-bold">+{selectedNode.xp} XP</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="pixel-font text-xs text-gray-400">Challenges:</span>
                    <span className="pixel-font text-xs text-cyan-400 font-bold">{selectedNode.challenges} problems</span>
                  </div>
                  
                  {selectedNode.prerequisites.length > 0 && (
                    <div>
                      <div className="pixel-font text-xs text-gray-400 mb-2">Prerequisites:</div>
                      <div className="space-y-1">
                        {selectedNode.prerequisites.map(prereq => {
                          const prereqNode = skillTrees[selectedLanguage].nodes.find(n => n.id === prereq);
                          const isCompleted = userProgress[selectedLanguage].completedNodes.includes(prereq);
                          return (
                            <div key={prereq} className="flex items-center space-x-2">
                              {isCompleted ? 
                                <CheckCircle className="w-3 h-3 text-green-400" /> : 
                                <div className="w-3 h-3 border border-gray-500 rounded-full"></div>
                              }
                              <span className={`pixel-font text-xs ${isCompleted ? 'text-green-400' : 'text-gray-500'}`}>
                                {prereqNode?.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-600">
                    {(() => {
                      const status = getNodeStatus(selectedNode.id);
                      if (status.completed) {
                        return (
                          <div className="text-center">
                            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <div className="pixel-font text-xs text-green-400 mb-2">COMPLETED</div>
                            <button className="w-full bg-gray-600 text-gray-400 px-4 py-2 pixel-font text-xs cursor-not-allowed">
                              REPLAY CHALLENGES
                            </button>
                          </div>
                        );
                      } else if (status.available) {
                        return (
                          <div className="text-center">
                            <Play className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                            <div className="pixel-font text-xs text-blue-400 mb-2">READY TO START</div>
                            <button 
                              onClick={() => startChallenges(selectedNode)}
                              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 pixel-font text-xs font-bold transform hover:scale-105 transition-all duration-300"
                            >
                              START CHALLENGES
                            </button>
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-center">
                            <Lock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                            <div className="pixel-font text-xs text-gray-500 mb-2">LOCKED</div>
                            <div className="pixel-font text-xs text-gray-400 text-center">
                              Complete prerequisites to unlock
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="retro-card p-6">
              <h3 className="pixel-font text-lg font-bold text-green-400 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-3 pixel-font text-xs font-bold transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <Play className="w-4 h-4 mr-2" />
                  CONTINUE NEXT NODE
                </button>
                
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 pixel-font text-xs font-bold transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <Crown className="w-4 h-4 mr-2" />
                  VIEW LEADERBOARD
                </button>
                
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 pixel-font text-xs font-bold transform hover:scale-105 transition-all duration-300 border-2 border-gray-500 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  SKILL GUIDE
                </button>
              </div>
            </div>

            {/* Achievement Preview */}
            <div className="retro-card p-6">
              <h3 className="pixel-font text-lg font-bold text-yellow-400 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Next Rewards
              </h3>
              
              <div className="space-y-3">
                {skillTrees[selectedLanguage].nodes
                  .filter(node => {
                    const status = getNodeStatus(node.id);
                    return status.available;
                  })
                  .slice(0, 3)
                  .map(node => (
                    <div key={node.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded border border-gray-600">
                      <div>
                        <div className="pixel-font text-xs text-white">{node.name}</div>
                        <div className="pixel-font text-xs text-gray-400">+{node.xp} XP</div>
                      </div>
                      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                    </div>
                  ))}
                
                {skillTrees[selectedLanguage].nodes.filter(node => {
                  const status = getNodeStatus(node.id);
                  return status.available;
                }).length === 0 && (
                  <div className="text-center text-gray-400 pixel-font text-xs">
                    Complete current challenges to unlock more rewards!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 retro-card p-6">
          <h3 className="pixel-font text-lg font-bold text-white mb-4 text-center">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 border-4 border-green-300 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="pixel-font text-sm text-white font-bold">Completed</div>
                <div className="pixel-font text-xs text-gray-400">All challenges finished</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 border-4 border-blue-300 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
              <div>
                <div className="pixel-font text-sm text-white font-bold">Available</div>
                <div className="pixel-font text-xs text-gray-400">Ready to start</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-600 border-4 border-gray-400 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-gray-300" />
              </div>
              <div>
                <div className="pixel-font text-sm text-white font-bold">Locked</div>
                <div className="pixel-font text-xs text-gray-400">Complete prerequisites</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPathPage;