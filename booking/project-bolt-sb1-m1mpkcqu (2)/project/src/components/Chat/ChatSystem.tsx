import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Smile, Phone, Video } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  timestamp: Date;
  is_own: boolean;
}

interface ChatSystemProps {
  bookingId?: string;
  onStartVideoCall?: () => void;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({ bookingId, onStartVideoCall }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load sample messages
    loadSampleMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSampleMessages = () => {
    const sampleMessages: Message[] = [
      {
        id: '1',
        sender_id: '1',
        sender_name: 'John Smith',
        message: 'Hi! I\'m looking forward to our session tomorrow.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        is_own: false,
      },
      {
        id: '2',
        sender_id: user?.id || '2',
        sender_name: user?.full_name || 'You',
        message: 'Great! I\'ve prepared everything we need. The session will be very productive.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        is_own: true,
      },
      {
        id: '3',
        sender_id: '1',
        sender_name: 'John Smith',
        message: 'Perfect! Should I prepare anything specific beforehand?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        is_own: false,
      },
      {
        id: '4',
        sender_id: user?.id || '2',
        sender_name: user?.full_name || 'You',
        message: 'Just bring your questions and we\'ll go through everything step by step.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        is_own: true,
      },
    ];

    setMessages(sampleMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender_id: user?.id || 'current',
      sender_name: user?.full_name || 'You',
      message: newMessage.trim(),
      timestamp: new Date(),
      is_own: true,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender_id: 'other',
        sender_name: 'John Smith',
        message: 'Thanks for the message! I\'ll get back to you shortly.',
        timestamp: new Date(),
        is_own: false,
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JS</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">John Smith</h3>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={onStartVideoCall}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Video className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.is_own ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${message.is_own ? 'order-2' : 'order-1'}`}>
              <div
                className={`px-4 py-2 rounded-2xl ${
                  message.is_own
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{message.message}</p>
              </div>
              <p className={`text-xs text-gray-500 mt-1 ${message.is_own ? 'text-right' : 'text-left'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <Paperclip className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <Smile className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <motion.button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: !newMessage.trim() ? 1 : 1.05 }}
            whileTap={{ scale: !newMessage.trim() ? 1 : 0.95 }}
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};