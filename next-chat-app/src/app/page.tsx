'use client';

import { useState, useRef, useEffect } from 'react';
import TaskSidebar from '@/components/TaskSidebar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleSendMessage = () => {
    const text = inputValue.trim();
    if (!text || isRunning) return;

    setShowWelcome(false);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsRunning(true);

    setTimeout(() => {
      simulateAssistantResponse(text);
    }, 500);
  };

  const simulateAssistantResponse = (userText: string) => {
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: ''
    };

    setMessages(prev => [...prev, assistantMessage]);

    const reply = generateReply(userText);
    const words = reply.split(/(?<=\s)/);
    let accumulated = '';
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < words.length) {
        accumulated += words[idx];
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: accumulated }
              : msg
          )
        );
        idx++;
        scrollToBottom();
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 30);
  };

  const generateReply = (userText: string): string => {
    const lower = userText.toLowerCase();

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return "Hey! 👋 Great to see you here. I'm your AI assistant, ready to help with anything you need — whether it's answering questions, writing code, brainstorming ideas, or just having a conversation. What's on your mind?";
    }
    if (lower.includes("code") || lower.includes("program")) {
      return "I'd love to help you with coding! Here's a quick example:\n\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}! Welcome aboard.`;\n}\n\nconsole.log(greet('Developer'));\n```\n\nFeel free to share your specific coding challenge and I'll do my best to help you solve it. I can work with **JavaScript**, **Python**, **TypeScript**, and many other languages.";
    }
    if (lower.includes("help")) {
      return "Of course! Here are some things I can help you with:\n\n- **Answer questions** on a wide range of topics\n- **Write and debug code** in multiple languages\n- **Brainstorm ideas** and provide creative suggestions\n- **Explain concepts** in simple terms\n- **Draft content** like emails, essays, or documentation\n\nJust let me know what you need!";
    }
    if (lower.includes("explain") || lower.includes("what is")) {
      return "Great question! Let me break it down for you.\n\nAt its core, the concept you're asking about involves understanding the fundamental building blocks and how they interact with each other. Think of it like building with **LEGO bricks** — each piece has its purpose, and when combined thoughtfully, they create something much greater than the sum of their parts.\n\n> The key insight is that complexity emerges from simple rules applied consistently.\n\nWould you like me to dive deeper into any specific aspect?";
    }

    const responses = [
      "That's a really interesting point! Let me think about this...\n\nBased on my understanding, there are several angles we could explore here. The most important consideration is finding the right balance between **simplicity** and **completeness**.\n\nWould you like me to elaborate on any particular aspect of this?",
      "Thanks for sharing that! Here's my take:\n\n1. **First**, we should consider the broader context\n2. **Second**, identify the key constraints\n3. **Third**, evaluate potential approaches\n\nEach of these steps builds on the previous one, creating a solid foundation for whatever solution we arrive at. Let me know if you'd like to explore any of these in more detail!",
      "Absolutely! I'm happy to help with that.\n\nThe approach I'd recommend involves a few key steps. Let me walk you through the reasoning:\n\n- Start with the **fundamentals** — make sure the foundation is solid\n- Then layer on **complexity** gradually\n- Finally, **validate** your results at each stage\n\nThis iterative approach tends to yield the best results. What do you think?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 128) + 'px';
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const exportMarkdown = (content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'message.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderMarkdown = (text: string): string => {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code>${code.trim()}</code></pre>`
    );

    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");
    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");
    html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
    html = html.replace(/^(?!<[hulpbo])(.*\S.*)$/gm, "<p>$1</p>");
    html = html.replace(/\n{2,}/g, "");

    return html;
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <TaskSidebar />
      <div id="app" style={{ marginLeft: '280px' }}>
        <div id="viewport" ref={viewportRef}>
          <div id="messages">
            {showWelcome && (
              <div id="welcome">
                <div className="greeting">
                  <h1>Hello there!</h1>
                  <p>How can I help you today?</p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`msg msg-${message.role}`}>
                {message.role === 'user' ? (
                  <div className="msg-filter-wrapper">
                    <div className="msg-flex-start">
                      <div className="msg-w-full">
                        <div className="bubble">
                          <button className="undo-btn" title="Undo changes" aria-label="Undo">
                            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                              <path d="M14 3.49999V6.49999C14 7.87899 12.879 8.99999 11.5 8.99999H3.70703L6.35303 11.646C6.54803 11.841 6.54803 12.158 6.35303 12.353C6.25503 12.451 6.12703 12.499 5.99903 12.499C5.87103 12.499 5.74303 12.45 5.64503 12.353L2.14503 8.85299C1.95003 8.65799 1.95003 8.34099 2.14503 8.14599L5.64503 4.64599C5.84003 4.45099 6.15703 4.45099 6.35203 4.64599C6.54703 4.84099 6.54703 5.15799 6.35203 5.35299L3.70603 7.99899H11.499C12.326 7.99899 12.999 7.32599 12.999 6.49899V3.49899C12.999 3.22299 13.223 2.99899 13.499 2.99899C13.775 2.99899 13.999 3.22299 13.999 3.49899L14 3.49999Z"/>
                            </svg>
                          </button>
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className="content"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                    />
                    <div className="action-bar">
                      <button
                        className="icon-btn"
                        data-tooltip="Copy"
                        onClick={() => copyMessage(message.content)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                      </button>
                      <button
                        className="icon-btn"
                        data-tooltip="Export as Markdown"
                        onClick={() => exportMarkdown(message.content)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" x2="12" y1="15" y2="3"/>
                        </svg>
                      </button>
                      <button className="icon-btn" data-tooltip="Refresh">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                          <path d="M3 3v5h5"/>
                          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                          <path d="M16 16h5v5"/>
                        </svg>
                      </button>
                    </div>
                    {message === messages[messages.length - 1] && !isRunning && (
                      <div className="suggestions">
                        <button
                          className="suggestion-btn"
                          onClick={() => setInputValue('Tell me more')}
                        >
                          Tell me more
                        </button>
                        <button
                          className="suggestion-btn"
                          onClick={() => setInputValue('Can you explain differently?')}
                        >
                          Explain differently
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {isRunning && (
              <div className="msg msg-assistant">
                <div className="content">
                  <div className="thinking">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    <span>Thinking...</span>
                  </div>
                </div>
                <div className="action-bar"></div>
              </div>
            )}
          </div>

          <div id="footer">
            <button
              id="scroll-bottom"
              data-tooltip="Scroll to bottom"
              onClick={scrollToBottom}
              style={{ display: 'none' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <div id="composer">
              <textarea
                id="composer-input"
                ref={inputRef}
                placeholder="Send a message..."
                rows={1}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                aria-label="Message input"
              />
              <div id="composer-actions">
                <button
                  className="send-btn"
                  id="send-btn"
                  data-tooltip="Send message"
                  aria-label="Send message"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isRunning}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M13.854 8.14576L8.854 3.14576C8.659 2.95076 8.342 2.95076 8.147 3.14576C7.952 3.34076 7.952 3.65776 8.147 3.85276L12.293 7.99876H2.5C2.224 7.99876 2 8.22276 2 8.49876C2 8.77476 2.224 8.99876 2.5 8.99876H12.293L8.147 13.1448C7.952 13.3398 7.952 13.6568 8.147 13.8518C8.245 13.9498 8.373 13.9978 8.501 13.9978C8.629 13.9978 8.757 13.9488 8.855 13.8518L13.855 8.85176C14.05 8.65676 14.05 8.33976 13.855 8.14476L13.854 8.14576Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
