import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { sendChatMessage, checkChatbotStatus } from '../services/api';
import { toast } from 'react-hot-toast';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm Arthankur Assistant. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useLocalMode, setUseLocalMode] = useState(false);
  const [statusChecked, setStatusChecked] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check chatbot API status on mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const status = await checkChatbotStatus();
        setUseLocalMode(status.status === 'unavailable');
      } catch (error) {
        console.error('Error checking chatbot status:', error);
        setUseLocalMode(true);
      } finally {
        setStatusChecked(true);
      }
    };
    checkApiStatus();
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Local response function for offline mode
  const getLocalResponse = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! How can I assist you with Arthankur today?";
    } else if (msg.includes('funding') || msg.includes('investor')) {
      return "Arthankur connects startups with potential investors. Startups can create funding requests, and investors can browse and express interest in these opportunities. Check out the 'Funding' section for startups or 'Explore Startups' for investors!";
    } else if (msg.includes('loan') || msg.includes('loans')) {
      return "Startups can apply for loans through our platform. We connect you with various loan options tailored to your business needs. Visit the 'Loans' section to learn more and apply.";
    } else if (msg.includes('community')) {
      return "Our community feature allows startups and investors to connect, share ideas, and discuss opportunities. Check out the 'Community' section to join discussions.";
    } else if (msg.includes('meeting') || msg.includes('meet')) {
      return "Arthankur facilitates meetings between startups and investors. Once an investor expresses interest in your funding request, you can schedule and conduct meetings through our platform.";
    } else if (msg.includes('financial') || msg.includes('tools')) {
      return "Arthankur offers financial tools to help startups with cash flow forecasting and working capital analysis. Explore these features in the 'Financial Tools' section.";
    } else if (msg.includes('tax') || msg.includes('compliance')) {
      return "Our Tax Compliance tools help startups manage their tax obligations. You can upload GST returns and get tax-related insights. Check the 'Tax Compliance' section for more information.";
    } else if (msg.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    } else {
      return "I'm not sure I understand. Could you try rephrasing your question? You can ask about funding, loans, community, meetings, or other features of the Arthankur platform.";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      if (useLocalMode) {
        // Use local response
        const botResponse = getLocalResponse(inputMessage);
        setTimeout(() => {
          setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
          setIsLoading(false);
        }, 500);
      } else {
        // Use API response
        const data = await sendChatMessage(inputMessage);
        setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        text: "I'm sorry, I'm having trouble responding right now. Switching to offline mode.", 
        sender: 'bot' 
      }]);
      setUseLocalMode(true);
      toast.error('Switching to offline mode due to connection issues');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <button 
        onClick={toggleChatbot}
        className="bg-violet-600 hover:bg-violet-700 text-white rounded-full p-3 shadow-lg"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200">
          {/* Chat header */}
          <div className="bg-violet-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5" />
              <span className="ml-2 font-medium">Arthankur Assistant</span>
              {useLocalMode ? (
                <span className="ml-2 text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded">Local Mode</span>
              ) : (
                <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">Online</span>
              )}
            </div>
            <button 
              onClick={toggleChatbot}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-3 ${message.sender === 'user' ? 'text-right' : ''}`}
              >
                <div 
                  className={`inline-block rounded-lg px-3 py-2 max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-violet-600 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mb-3">
                <div className="inline-block rounded-lg px-3 py-2 bg-gray-200 text-gray-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <form 
            onSubmit={handleSendMessage}
            className="border-t border-gray-200 p-3 flex items-center"
          >
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              disabled={isLoading}
            />
            <button 
              type="submit"
              className={`ml-2 ${isLoading ? 'bg-gray-400' : 'bg-violet-600 hover:bg-violet-700'} text-white rounded-full p-2`}
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;