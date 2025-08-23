import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Loader, Minimize2, Maximize2 } from 'lucide-react';

export default function AIAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! I'm Seekho AI 🚀 I'm here to help you navigate CodeSeeho and answer your coding questions. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationHistory: messages.slice(-5)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment! 🤖",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    "How do I start learning JavaScript?",
    "Explain HTML basics",
    "What is React?",
    "Help with debugging",
    "Navigate the platform"
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
  };

  return (
    <>
      {/* Custom Styles */}
      <style>{`
        .pixel-font {
          font-family: 'Press Start 2P', 'Courier New', monospace;
          image-rendering: pixelated;
          text-rendering: geometricPrecision;
        }

        .retro-glow {
          box-shadow: 
            0 0 10px rgba(0, 255, 136, 0.5),
            0 0 20px rgba(0, 255, 136, 0.3),
            0 0 30px rgba(0, 255, 136, 0.1);
        }

        .floating-icon {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .terminal-cursor {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
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

        /* Custom Retro Scrollbars */
        .retro-scrollbar::-webkit-scrollbar {
          width: 12px;
        }

        .retro-scrollbar::-webkit-scrollbar-track {
          background: #000000;
          border: 1px solid #00ff88;
          border-radius: 0px;
        }

        .retro-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #00ff88, #0099ff);
          border: 1px solid #00ff88;
          border-radius: 0px;
          box-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
        }

        .retro-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #0099ff, #00ff88);
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
        }

        .retro-scrollbar::-webkit-scrollbar-corner {
          background: #000000;
          border: 1px solid #00ff88;
        }

        /* Firefox scrollbar styling */
        .retro-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #00ff88 #000000;
        }
      `}</style>

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative floating-icon text-black p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 retro-glow"
          style={{
            background: 'linear-gradient(45deg, #00ff88, #0099ff)',
            border: '2px solid #00ff88'
          }}
        >
          <Bot size={24} className="group-hover:rotate-12 transition-transform duration-200" />
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-bounce" 
               style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)' }}></div>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-black text-green-400 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pixel-font border border-green-400">
            Ask Seekho AI
          </div>
        </button>
      </div>

      {/* AI Assistant Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-black rounded-2xl shadow-2xl border-2 border-green-400 overflow-hidden transition-all duration-300 retro-glow">
          <div className={`w-96 ${isMinimized ? 'h-16' : 'h-[32rem]'} flex flex-col scanlines`}>
            
            {/* Header */}
            <div className="text-white p-4 flex items-center justify-between border-b border-green-400"
                 style={{
                   background: 'linear-gradient(90deg, rgba(0, 255, 136, 0.2), rgba(0, 153, 255, 0.2))',
                 }}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-400 bg-opacity-20 rounded-full flex items-center justify-center border border-green-400">
                  <Bot size={18} className="text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-green-400 pixel-font" style={{ fontSize: '12px' }}>Seekho AI</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full terminal-cursor"></div>
                    <span className="text-xs opacity-90 text-cyan-400 pixel-font" style={{ fontSize: '8px' }}>Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-green-400 hover:bg-opacity-20 rounded transition-colors duration-200 text-green-400"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-red-400 hover:bg-opacity-20 rounded transition-colors duration-200 text-green-400 hover:text-red-400"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 retro-scrollbar" style={{ backgroundColor: 'rgba(0, 20, 0, 0.8)' }}>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 border-2 ${
                          message.type === 'user'
                            ? 'bg-black text-cyan-400 border-cyan-400'
                            : 'bg-black text-green-400 border-green-400 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.type === 'bot' && (
                            <Bot size={16} className="mt-1 text-green-400 flex-shrink-0" />
                          )}
                          {message.type === 'user' && (
                            <User size={16} className="mt-1 flex-shrink-0 text-cyan-400" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap pixel-font" style={{ fontSize: '10px', lineHeight: '1.4' }}>
                              {message.text}
                            </p>
                            <p className={`text-xs mt-1 pixel-font ${
                              message.type === 'user' ? 'text-cyan-300' : 'text-green-300'
                            }`} style={{ fontSize: '8px' }}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-black text-green-400 border-2 border-green-400 shadow-sm rounded-2xl px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Bot size={16} className="text-green-400" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length === 1 && (
                  <div className="px-4 py-2 bg-black border-t border-green-400">
                    <p className="text-xs text-green-400 mb-2 pixel-font" style={{ fontSize: '8px' }}>Quick actions:</p>
                    <div className="flex flex-wrap gap-1">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(action)}
                          className="text-xs bg-green-900 hover:bg-green-800 text-green-400 px-2 py-1 rounded-full transition-colors duration-200 pixel-font border border-green-400"
                          style={{ fontSize: '8px' }}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 bg-black border-t border-green-400">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Hello Coder..."
                        className="w-full resize-none border-2 border-green-400 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none max-h-24 bg-black text-green-400 placeholder-green-600 pixel-font retro-scrollbar"
                        rows="1"
                        style={{ minHeight: '36px', fontSize: '10px' }}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="disabled:opacity-50 disabled:cursor-not-allowed text-black p-2 rounded-xl transition-all duration-200 hover:scale-105 retro-glow"
                      style={{
                        background: 'linear-gradient(45deg, #00ff88, #0099ff)',
                        border: '2px solid #00ff88'
                      }}
                    >
                      {isLoading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-green-600 mt-1 pixel-font" style={{ fontSize: '8px' }}>
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}