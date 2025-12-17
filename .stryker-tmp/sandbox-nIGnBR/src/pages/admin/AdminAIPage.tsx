// @ts-nocheck
// =============================================================================
// ADMIN AI - AI-Powered Administrative Assistant
// Natural language interface for platform configuration and management
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { api } from '../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  command?: {
    action: string;
    target?: string;
    params?: Record<string, unknown>;
  };
  executed?: boolean;
  suggestions?: string[];
}
interface AIResponse {
  message: string;
  command?: {
    action: string;
    target?: string;
    params?: Record<string, unknown>;
    confirmation?: boolean;
  };
  executed?: boolean;
  result?: unknown;
  suggestions?: string[];
}

// =============================================================================
// API CALLS
// =============================================================================

const API_BASE = '/admin/ai';
async function startSession(): Promise<{
  sessionId: string;
  messages: Message[];
}> {
  const res = await api.post<any>(`${API_BASE}/start`, {});
  const payload = res as any;
  if (stryMutAct_9fa48("15410") ? payload.success === false || payload.error : stryMutAct_9fa48("15409") ? false : stryMutAct_9fa48("15408") ? true : (stryCov_9fa48("15408", "15409", "15410"), (stryMutAct_9fa48("15412") ? payload.success !== false : stryMutAct_9fa48("15411") ? true : (stryCov_9fa48("15411", "15412"), payload.success === (stryMutAct_9fa48("15413") ? true : (stryCov_9fa48("15413"), false)))) && payload.error)) {
    throw new Error(stryMutAct_9fa48("15417") ? payload.error.message && 'Failed to start session' : stryMutAct_9fa48("15416") ? false : stryMutAct_9fa48("15415") ? true : (stryCov_9fa48("15415", "15416", "15417"), payload.error.message || 'Failed to start session'));
  }
  const data = stryMutAct_9fa48("15419") ? payload.data && payload : (stryCov_9fa48("15419"), payload.data ?? payload);
  return data as {
    sessionId: string;
    messages: Message[];
  };
}
async function sendMessage(sessionId: string, message: string): Promise<AIResponse> {
  const res = await api.post<any>(`${API_BASE}/message`, stryMutAct_9fa48("15422") ? {} : (stryCov_9fa48("15422"), {
    sessionId,
    message
  }));
  const payload = res as any;
  if (stryMutAct_9fa48("15425") ? payload.success === false || payload.error : stryMutAct_9fa48("15424") ? false : stryMutAct_9fa48("15423") ? true : (stryCov_9fa48("15423", "15424", "15425"), (stryMutAct_9fa48("15427") ? payload.success !== false : stryMutAct_9fa48("15426") ? true : (stryCov_9fa48("15426", "15427"), payload.success === (stryMutAct_9fa48("15428") ? true : (stryCov_9fa48("15428"), false)))) && payload.error)) {
    throw new Error(stryMutAct_9fa48("15432") ? payload.error.message && 'Failed to send message' : stryMutAct_9fa48("15431") ? false : stryMutAct_9fa48("15430") ? true : (stryCov_9fa48("15430", "15431", "15432"), payload.error.message || 'Failed to send message'));
  }
  const data = stryMutAct_9fa48("15434") ? payload.data && payload : (stryCov_9fa48("15434"), payload.data ?? payload);
  return data as AIResponse;
}

// =============================================================================
// MARKDOWN RENDERER (Simple)
// =============================================================================

const renderMarkdown = (text: string): React.ReactNode => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = stryMutAct_9fa48("15437") ? ["Stryker was here"] : (stryCov_9fa48("15437"), []);
  lines.forEach((line, i) => {
    // Headers
    if (stryMutAct_9fa48("15441") ? line.endsWith('## ') : stryMutAct_9fa48("15440") ? false : stryMutAct_9fa48("15439") ? true : (stryCov_9fa48("15439", "15440", "15441"), line.startsWith('## '))) {
      elements.push(<h2 key={i} className="text-lg font-bold text-white mt-4 mb-2">
          {line.replace('## ', '')}
        </h2>);
    } else if (stryMutAct_9fa48("15448") ? line.endsWith('### ') : stryMutAct_9fa48("15447") ? false : stryMutAct_9fa48("15446") ? true : (stryCov_9fa48("15446", "15447", "15448"), line.startsWith('### '))) {
      elements.push(<h3 key={i} className="text-md font-semibold text-white mt-3 mb-1">
          {line.replace('### ', '')}
        </h3>);
    }
    // Bold
    else if (stryMutAct_9fa48("15454") ? false : stryMutAct_9fa48("15453") ? true : (stryCov_9fa48("15453", "15454"), line.includes('**'))) {
      const parts = line.split(stryMutAct_9fa48("15457") ? /\*\*(.)\*\*/g : (stryCov_9fa48("15457"), /\*\*(.*?)\*\*/g));
      elements.push(<p key={i} className="text-neutral-300 my-1">
          {parts.map(stryMutAct_9fa48("15458") ? () => undefined : (stryCov_9fa48("15458"), (part, j) => (stryMutAct_9fa48("15461") ? j % 2 !== 1 : stryMutAct_9fa48("15460") ? false : stryMutAct_9fa48("15459") ? true : (stryCov_9fa48("15459", "15460", "15461"), (stryMutAct_9fa48("15462") ? j * 2 : (stryCov_9fa48("15462"), j % 2)) === 1)) ? <strong key={j} className="text-white">{part}</strong> : part))}
        </p>);
    }
    // Lists
    else if (stryMutAct_9fa48("15465") ? line.startsWith('- ') && line.startsWith('• ') : stryMutAct_9fa48("15464") ? false : stryMutAct_9fa48("15463") ? true : (stryCov_9fa48("15463", "15464", "15465"), (stryMutAct_9fa48("15466") ? line.endsWith('- ') : (stryCov_9fa48("15466"), line.startsWith('- '))) || (stryMutAct_9fa48("15468") ? line.endsWith('• ') : (stryCov_9fa48("15468"), line.startsWith('• '))))) {
      elements.push(<div key={i} className="flex gap-2 my-1 ml-4">
          <span className="text-primary-400">•</span>
          <span className="text-neutral-300">{stryMutAct_9fa48("15471") ? line : (stryCov_9fa48("15471"), line.slice(2))}</span>
        </div>);
    }
    // Code
    else if (stryMutAct_9fa48("15474") ? line.startsWith('`') || line.endsWith('`') : stryMutAct_9fa48("15473") ? false : stryMutAct_9fa48("15472") ? true : (stryCov_9fa48("15472", "15473", "15474"), (stryMutAct_9fa48("15475") ? line.endsWith('`') : (stryCov_9fa48("15475"), line.startsWith('`'))) && (stryMutAct_9fa48("15477") ? line.startsWith('`') : (stryCov_9fa48("15477"), line.endsWith('`'))))) {
      elements.push(<code key={i} className="bg-neutral-700 px-2 py-1 rounded text-sm text-primary-300 my-1 inline-block">
          {stryMutAct_9fa48("15480") ? line : (stryCov_9fa48("15480"), line.slice(1, stryMutAct_9fa48("15481") ? +1 : (stryCov_9fa48("15481"), -1)))}
        </code>);
    }
    // Regular paragraph
    else if (stryMutAct_9fa48("15484") ? line : stryMutAct_9fa48("15483") ? false : stryMutAct_9fa48("15482") ? true : (stryCov_9fa48("15482", "15483", "15484"), line.trim())) {
      elements.push(<p key={i} className="text-neutral-300 my-1">{line}</p>);
    }
  });
  return elements;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AdminAIPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(stryMutAct_9fa48("15487") ? ["Stryker was here"] : (stryCov_9fa48("15487"), []));
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(stryMutAct_9fa48("15489") ? true : (stryCov_9fa48("15489"), false));
  const [initializing, setInitializing] = useState(stryMutAct_9fa48("15490") ? false : (stryCov_9fa48("15490"), true));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    initSession();
  }, stryMutAct_9fa48("15492") ? ["Stryker was here"] : (stryCov_9fa48("15492"), []));
  useEffect(() => {
    stryMutAct_9fa48("15494") ? messagesEndRef.current.scrollIntoView({
      behavior: 'smooth'
    }) : (stryCov_9fa48("15494"), messagesEndRef.current?.scrollIntoView(stryMutAct_9fa48("15495") ? {} : (stryCov_9fa48("15495"), {
      behavior: 'smooth'
    })));
  }, stryMutAct_9fa48("15497") ? [] : (stryCov_9fa48("15497"), [messages]));
  const initSession = async () => {
    try {
      setInitializing(stryMutAct_9fa48("15500") ? false : (stryCov_9fa48("15500"), true));
      const {
        sessionId: newSessionId,
        messages: initialMessages
      } = await startSession();
      setSessionId(newSessionId);
      setMessages(initialMessages);
    } catch (err) {
      console.error('Failed to start session:', err);
    } finally {
      setInitializing(stryMutAct_9fa48("15504") ? true : (stryCov_9fa48("15504"), false));
    }
  };
  const handleSend = async () => {
    if (stryMutAct_9fa48("15508") ? (!input.trim() || !sessionId) && loading : stryMutAct_9fa48("15507") ? false : stryMutAct_9fa48("15506") ? true : (stryCov_9fa48("15506", "15507", "15508"), (stryMutAct_9fa48("15510") ? !input.trim() && !sessionId : stryMutAct_9fa48("15509") ? false : (stryCov_9fa48("15509", "15510"), (stryMutAct_9fa48("15511") ? input.trim() : (stryCov_9fa48("15511"), !(stryMutAct_9fa48("15512") ? input : (stryCov_9fa48("15512"), input.trim())))) || (stryMutAct_9fa48("15513") ? sessionId : (stryCov_9fa48("15513"), !sessionId)))) || loading)) {
      return;
    }
    const userMessage: Message = stryMutAct_9fa48("15515") ? {} : (stryCov_9fa48("15515"), {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    });
    setMessages(stryMutAct_9fa48("15517") ? () => undefined : (stryCov_9fa48("15517"), prev => stryMutAct_9fa48("15518") ? [] : (stryCov_9fa48("15518"), [...prev, userMessage])));
    setInput('');
    setLoading(stryMutAct_9fa48("15520") ? false : (stryCov_9fa48("15520"), true));
    try {
      const response = await sendMessage(sessionId, input);
      const assistantMessage: Message = stryMutAct_9fa48("15522") ? {} : (stryCov_9fa48("15522"), {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        command: response.command,
        executed: response.executed,
        suggestions: response.suggestions
      });
      setMessages(stryMutAct_9fa48("15524") ? () => undefined : (stryCov_9fa48("15524"), prev => stryMutAct_9fa48("15525") ? [] : (stryCov_9fa48("15525"), [...prev, assistantMessage])));
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(stryMutAct_9fa48("15528") ? () => undefined : (stryCov_9fa48("15528"), prev => stryMutAct_9fa48("15529") ? [] : (stryCov_9fa48("15529"), [...prev, stryMutAct_9fa48("15530") ? {} : (stryCov_9fa48("15530"), {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      })])));
    } finally {
      setLoading(stryMutAct_9fa48("15534") ? true : (stryCov_9fa48("15534"), false));
      stryMutAct_9fa48("15535") ? inputRef.current.focus() : (stryCov_9fa48("15535"), inputRef.current?.focus());
    }
  };
  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    stryMutAct_9fa48("15537") ? inputRef.current.focus() : (stryCov_9fa48("15537"), inputRef.current?.focus());
  };
  if (stryMutAct_9fa48("15539") ? false : stryMutAct_9fa48("15538") ? true : (stryCov_9fa48("15538", "15539"), initializing)) {
    return <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Initializing CendiaAdmin™...</p>
        </div>
      </div>;
  }
  return <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">CendiaAdmin™</h1>
            <p className="text-neutral-400">AI-powered administrative assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-neutral-900 rounded-xl border border-neutral-700 p-4 mb-4">
        {messages.map(stryMutAct_9fa48("15541") ? () => undefined : (stryCov_9fa48("15541"), (message, index) => <div key={index} className={cn('mb-4', (stryMutAct_9fa48("15545") ? message.role !== 'user' : stryMutAct_9fa48("15544") ? false : stryMutAct_9fa48("15543") ? true : (stryCov_9fa48("15543", "15544", "15545"), message.role === 'user')) ? 'flex justify-end' : '')}>
            {(stryMutAct_9fa48("15551") ? message.role !== 'user' : stryMutAct_9fa48("15550") ? false : stryMutAct_9fa48("15549") ? true : (stryCov_9fa48("15549", "15550", "15551"), message.role === 'user')) ? <div className="max-w-[70%] bg-primary-600 rounded-2xl rounded-br-sm px-4 py-3">
                <p className="text-white">{message.content}</p>
              </div> : <div className="max-w-[85%]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">🤖</span>
                  </div>
                  <div className="bg-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-neutral-700">
                    <div className="prose prose-invert prose-sm max-w-none">
                      {renderMarkdown(message.content)}
                    </div>
                    
                    {/* Command Indicator */}
                    {stryMutAct_9fa48("15555") ? message.command || <div className={cn('mt-3 px-3 py-2 rounded-lg text-sm', message.executed ? 'bg-success-main/20 text-success-main border border-success-main/30' : 'bg-warning-main/20 text-warning-main border border-warning-main/30')}>
                        <div className="flex items-center gap-2">
                          <span>{message.executed ? '✅' : '⏳'}</span>
                          <span className="font-medium">
                            {message.executed ? 'Command executed' : 'Awaiting confirmation'}
                          </span>
                        </div>
                        <code className="text-xs opacity-70 mt-1 block">
                          {message.command.action}({message.command.target})
                        </code>
                      </div> : stryMutAct_9fa48("15554") ? false : stryMutAct_9fa48("15553") ? true : (stryCov_9fa48("15553", "15554", "15555"), message.command && <div className={cn('mt-3 px-3 py-2 rounded-lg text-sm', message.executed ? 'bg-success-main/20 text-success-main border border-success-main/30' : 'bg-warning-main/20 text-warning-main border border-warning-main/30')}>
                        <div className="flex items-center gap-2">
                          <span>{message.executed ? '✅' : '⏳'}</span>
                          <span className="font-medium">
                            {message.executed ? 'Command executed' : 'Awaiting confirmation'}
                          </span>
                        </div>
                        <code className="text-xs opacity-70 mt-1 block">
                          {message.command.action}({message.command.target})
                        </code>
                      </div>)}
                    
                    {/* Suggestions */}
                    {stryMutAct_9fa48("15565") ? message.suggestions && message.suggestions.length > 0 || <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, i) => <button key={i} onClick={() => handleSuggestion(suggestion)} className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-sm rounded-lg transition-colors">
                            {suggestion}
                          </button>)}
                      </div> : stryMutAct_9fa48("15564") ? false : stryMutAct_9fa48("15563") ? true : (stryCov_9fa48("15563", "15564", "15565"), (stryMutAct_9fa48("15567") ? message.suggestions || message.suggestions.length > 0 : stryMutAct_9fa48("15566") ? true : (stryCov_9fa48("15566", "15567"), message.suggestions && (stryMutAct_9fa48("15570") ? message.suggestions.length <= 0 : stryMutAct_9fa48("15569") ? message.suggestions.length >= 0 : stryMutAct_9fa48("15568") ? true : (stryCov_9fa48("15568", "15569", "15570"), message.suggestions.length > 0)))) && <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map(stryMutAct_9fa48("15571") ? () => undefined : (stryCov_9fa48("15571"), (suggestion, i) => <button key={i} onClick={stryMutAct_9fa48("15572") ? () => undefined : (stryCov_9fa48("15572"), () => handleSuggestion(suggestion))} className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-sm rounded-lg transition-colors">
                            {suggestion}
                          </button>))}
                      </div>)}
                  </div>
                </div>
              </div>}
          </div>))}
        
        {/* Loading indicator */}
        {stryMutAct_9fa48("15575") ? loading || <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🤖</span>
            </div>
            <div className="bg-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-neutral-700">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{
                animationDelay: '0ms'
              }}></span>
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{
                animationDelay: '150ms'
              }}></span>
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{
                animationDelay: '300ms'
              }}></span>
                </div>
                <span className="text-neutral-400 text-sm">Thinking...</span>
              </div>
            </div>
          </div> : stryMutAct_9fa48("15574") ? false : stryMutAct_9fa48("15573") ? true : (stryCov_9fa48("15573", "15574", "15575"), loading && <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🤖</span>
            </div>
            <div className="bg-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-neutral-700">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={stryMutAct_9fa48("15576") ? {} : (stryCov_9fa48("15576"), {
                animationDelay: '0ms'
              })}></span>
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={stryMutAct_9fa48("15578") ? {} : (stryCov_9fa48("15578"), {
                animationDelay: '150ms'
              })}></span>
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={stryMutAct_9fa48("15580") ? {} : (stryCov_9fa48("15580"), {
                animationDelay: '300ms'
              })}></span>
                </div>
                <span className="text-neutral-400 text-sm">Thinking...</span>
              </div>
            </div>
          </div>)}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-2">
        <div className="flex gap-2">
          <input ref={inputRef} type="text" value={input} onChange={stryMutAct_9fa48("15582") ? () => undefined : (stryCov_9fa48("15582"), e => setInput(e.target.value))} onKeyDown={stryMutAct_9fa48("15583") ? () => undefined : (stryCov_9fa48("15583"), e => stryMutAct_9fa48("15586") ? e.key === 'Enter' || handleSend() : stryMutAct_9fa48("15585") ? false : stryMutAct_9fa48("15584") ? true : (stryCov_9fa48("15584", "15585", "15586"), (stryMutAct_9fa48("15588") ? e.key !== 'Enter' : stryMutAct_9fa48("15587") ? true : (stryCov_9fa48("15587", "15588"), e.key === 'Enter')) && handleSend()))} placeholder="Ask me anything... e.g., 'Disable CendiaPredict' or 'Update pricing'" className="flex-1 bg-transparent text-white placeholder:text-neutral-500 px-4 py-3 focus:outline-none" disabled={loading} />
          <button onClick={handleSend} disabled={stryMutAct_9fa48("15592") ? !input.trim() && loading : stryMutAct_9fa48("15591") ? false : stryMutAct_9fa48("15590") ? true : (stryCov_9fa48("15590", "15591", "15592"), (stryMutAct_9fa48("15593") ? input.trim() : (stryCov_9fa48("15593"), !(stryMutAct_9fa48("15594") ? input : (stryCov_9fa48("15594"), input.trim())))) || loading)} className={cn('px-6 py-3 rounded-lg font-medium transition-colors', (stryMutAct_9fa48("15598") ? input.trim() || !loading : stryMutAct_9fa48("15597") ? false : stryMutAct_9fa48("15596") ? true : (stryCov_9fa48("15596", "15597", "15598"), (stryMutAct_9fa48("15599") ? input : (stryCov_9fa48("15599"), input.trim())) && (stryMutAct_9fa48("15600") ? loading : (stryCov_9fa48("15600"), !loading)))) ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-neutral-700 text-neutral-500 cursor-not-allowed')}>
            Send
          </button>
        </div>
        
        {/* Quick Commands */}
        <div className="flex gap-2 px-2 pt-2 border-t border-neutral-700 mt-2">
          <span className="text-xs text-neutral-500">Quick:</span>
          {(stryMutAct_9fa48("15603") ? [] : (stryCov_9fa48("15603"), ['Show status', 'List features', 'List agents', 'Show pricing', 'Help'])).map(stryMutAct_9fa48("15609") ? () => undefined : (stryCov_9fa48("15609"), cmd => <button key={cmd} onClick={stryMutAct_9fa48("15610") ? () => undefined : (stryCov_9fa48("15610"), () => handleSuggestion(cmd))} className="text-xs text-neutral-400 hover:text-white transition-colors">
              {cmd}
            </button>))}
        </div>
      </div>
    </div>;
};
export default AdminAIPage;