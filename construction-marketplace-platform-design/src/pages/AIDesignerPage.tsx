import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Image as ImageIcon, Sparkles, Settings, X, Download, Wand2,
  MessageSquare, Palette, Home, ChevronDown, Loader2, Bot, User,
  Lightbulb, RotateCcw, Copy, Check, Maximize2, MinusCircle, Brush,
  Building2, Sofa, ChefHat, Bath, Briefcase, TreePine, Zap, Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
  isGenerating?: boolean;
}

interface DesignStyle {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

const DESIGN_STYLES: DesignStyle[] = [
  { id: 'photorealistic', label: 'Photorealistic', icon: '📸', desc: 'High-quality realistic renders' },
  { id: 'blueprint', label: 'Blueprint', icon: '📐', desc: 'Technical architectural drawings' },
  { id: 'watercolor', label: 'Watercolor', icon: '🎨', desc: 'Artistic watercolor paintings' },
  { id: 'modern', label: 'Modern', icon: '🏢', desc: 'Clean minimalist designs' },
  { id: 'traditional', label: 'Traditional', icon: '🏛️', desc: 'Classic Indian architecture' },
  { id: '3d_render', label: '3D Render', icon: '💎', desc: 'Cinema-quality 3D renders' },
];

const ROOM_TYPES = [
  { id: 'living room', label: 'Living Room', icon: Sofa },
  { id: 'bedroom', label: 'Bedroom', icon: Home },
  { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
  { id: 'bathroom', label: 'Bathroom', icon: Bath },
  { id: 'office', label: 'Office', icon: Briefcase },
  { id: 'exterior', label: 'Exterior', icon: Building2 },
];

const QUICK_PROMPTS = [
  "Design a modern 3BHK apartment interior",
  "Show me a luxury bathroom with marble",
  "Create a modular kitchen design",
  "Design a rooftop garden with seating",
  "Show me a minimalist bedroom design",
  "Create a traditional pooja room design",
];

const API_BASE = '';

export default function AIDesignerPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm **BuildBidBot** 🏛️, your AI Architect & Interior Designer.\n\nI can help you:\n- 💡 Brainstorm design ideas\n- 📐 Plan room layouts\n- 🎨 Suggest color palettes\n- 💰 Estimate costs in INR\n- 🖼️ Generate visual designs\n\nType your ideas or use **Generate Image** to visualize a design!",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [hfKey, setHfKey] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [imagePrompt, setImagePrompt] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('living room');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const saved = localStorage.getItem('bb_gemini_key');
    const savedHf = localStorage.getItem('bb_hf_key');
    if (saved) setGeminiKey(saved);
    if (savedHf) setHfKey(savedHf);
  }, []);

  const saveKeys = () => {
    localStorage.setItem('bb_gemini_key', geminiKey);
    localStorage.setItem('bb_hf_key', hfKey);
    setShowSettings(false);
  };

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const handleSendChat = async (text?: string) => {
    const prompt = text || input.trim();
    if (!prompt || isLoading) return;

    if (!geminiKey) {
      setShowSettings(true);
      return;
    }

    const userMsg: ChatMessage = {
      id: generateId(), role: 'user', content: prompt, timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowQuickPrompts(false);
    setIsLoading(true);

    const loadingMsg: ChatMessage = {
      id: generateId(), role: 'assistant', content: '', timestamp: new Date(), isGenerating: true
    };
    setMessages(prev => [...prev, loadingMsg]);

    try {
      let reply = '';

      if (API_BASE) {
        const res = await fetch(`${API_BASE}/api/ai-designer/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gemini_api_key: geminiKey,
            prompt,
            history: messages.filter(m => !m.isGenerating).map(m => ({
              role: m.role,
              content: m.content
            }))
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Chat failed');
        reply = data.reply;
      } else {
        // Direct Gemini API call (browser-side fallback)
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are an expert architect and interior designer named BuildBidBot. Keep responses concise, helpful, creative, and professional. When discussing designs, mention materials, estimated costs in INR, color palettes, and space optimization tips. If the user finalizes an idea, remind them they can use the 'Generate Image' button to see a visual render. Use markdown formatting. Always consider Indian construction standards.\n\nUser: ${prompt}`
                }]
              }]
            })
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Gemini API error');
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      }

      setMessages(prev =>
        prev.map(m => m.id === loadingMsg.id
          ? { ...m, content: reply, isGenerating: false }
          : m
        )
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setMessages(prev =>
        prev.map(m => m.id === loadingMsg.id
          ? { ...m, content: `❌ Error: ${errorMessage}`, isGenerating: false }
          : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (prompt?: string) => {
    const imgPrompt = prompt || imagePrompt.trim();
    if (!imgPrompt || isGeneratingImage) return;

    if (!hfKey) {
      setShowSettings(true);
      return;
    }

    setIsGeneratingImage(true);
    const userMsg: ChatMessage = {
      id: generateId(), role: 'user',
      content: `🖼️ Generate: ${imgPrompt} (Style: ${selectedStyle})`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setShowImagePanel(false);

    const loadingMsg: ChatMessage = {
      id: generateId(), role: 'assistant', content: 'Rendering your design...', timestamp: new Date(), isGenerating: true
    };
    setMessages(prev => [...prev, loadingMsg]);

    try {
      let imageData = '';

      if (API_BASE) {
        const res = await fetch(`${API_BASE}/api/ai-designer/generate-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hf_api_key: hfKey,
            prompt: imgPrompt,
            style: selectedStyle,
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Image generation failed');
        imageData = data.image;
      } else {
        // Direct HF call (browser-side fallback)
        const stylePrompts: Record<string, string> = {
          'photorealistic': 'Professional architectural visualization, photorealistic, highly detailed, 8k resolution, natural lighting, ',
          'blueprint': 'Architectural blueprint style, technical drawing, blue and white color scheme, precise lines, ',
          'watercolor': 'Architectural watercolor painting, artistic, soft colors, elegant sketch, ',
          'modern': 'Modern minimalist interior design, clean lines, contemporary furniture, ',
          'traditional': 'Traditional Indian architecture, ornate details, warm colors, ',
          '3d_render': 'Professional 3D architectural render, ray tracing, cinematic lighting, ',
        };

        const enhancedPrompt = (stylePrompts[selectedStyle] || stylePrompts.photorealistic) + imgPrompt;

        const res = await fetch(
          'https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${hfKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: enhancedPrompt })
          }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          if (res.status === 503) throw new Error('Model is loading. Please wait 10-20 seconds and try again.');
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const blob = await res.blob();
        imageData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }

      setMessages(prev =>
        prev.map(m => m.id === loadingMsg.id
          ? { ...m, content: `Design visualization for: **${imgPrompt}**`, image: imageData, isGenerating: false }
          : m
        )
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setMessages(prev =>
        prev.map(m => m.id === loadingMsg.id
          ? { ...m, content: `❌ Image Error: ${errorMessage}`, isGenerating: false }
          : m
        )
      );
    } finally {
      setIsGeneratingImage(false);
      setImagePrompt('');
    }
  };

  const fetchSuggestions = async () => {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/api/ai-designer/suggest-prompt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ room_type: selectedRoom, style: selectedStyle })
        });
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch {
        // Fallback suggestions
        setSuggestions([
          `A modern ${selectedRoom} with clean lines and natural light`,
          `Luxurious ${selectedRoom} with premium finishes and ambient lighting`,
          `Space-efficient ${selectedRoom} with smart storage solutions`,
        ]);
      }
    } else {
      setSuggestions([
        `A modern ${selectedRoom} with clean lines and natural light`,
        `Luxurious ${selectedRoom} with premium finishes and ambient lighting`,
        `Space-efficient ${selectedRoom} with smart storage solutions`,
      ]);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom, selectedStyle]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.click();
  };

  const clearChat = () => {
    setMessages([{
      id: generateId(),
      role: 'assistant',
      content: "Chat cleared! 🧹 Ready for a fresh design session. What shall we create?",
      timestamp: new Date(),
    }]);
    setShowQuickPrompts(true);
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-3 mb-1">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 list-decimal">$1. $2</li>')
      .replace(/\n\n/g, '</p><p class="mt-2">')
      .replace(/\n/g, '<br/>');
  };

  const keysConfigured = geminiKey && hfKey;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={() => setFullscreenImage(null)}>
            <X size={32} />
          </button>
          <img src={fullscreenImage} alt="Full size design"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Settings size={20} className="text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">API Configuration</h2>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🧠 Gemini API Key <span className="text-xs text-gray-400 font-normal">(For AI Chat)</span>
                </label>
                <input type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm" />
                <p className="text-xs text-gray-400 mt-1">
                  Get free at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-primary-500 underline">aistudio.google.com</a>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🎨 Hugging Face Token <span className="text-xs text-gray-400 font-normal">(For Image Generation)</span>
                </label>
                <input type="password" value={hfKey} onChange={e => setHfKey(e.target.value)}
                  placeholder="hf_..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm" />
                <p className="text-xs text-gray-400 mt-1">
                  Get free at <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="text-primary-500 underline">huggingface.co/settings/tokens</a>
                </p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
                <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Your API keys are stored locally in your browser and sent directly to Google/HuggingFace. They are never stored on our servers.
                </p>
              </div>

              <button onClick={saveKeys}
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                Save & Start Designing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Generation Panel */}
      {showImagePanel && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white rounded-t-3xl p-6 pb-4 border-b border-gray-100 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Wand2 size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Generate Design</h2>
                    <p className="text-xs text-gray-500">Powered by Stable Diffusion XL</p>
                  </div>
                </div>
                <button onClick={() => setShowImagePanel(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Room Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Room Type</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {ROOM_TYPES.map(room => (
                    <button key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-medium ${
                        selectedRoom === room.id
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-100 hover:border-gray-200 text-gray-600'
                      }`}>
                      <room.icon size={18} />
                      {room.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Design Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DESIGN_STYLES.map(style => (
                    <button key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-left ${
                        selectedStyle === style.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}>
                      <span className="text-xl">{style.icon}</span>
                      <div>
                        <p className={`text-sm font-medium ${selectedStyle === style.id ? 'text-primary-700' : 'text-gray-700'}`}>
                          {style.label}
                        </p>
                        <p className="text-xs text-gray-400">{style.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Suggestions */}
              {suggestions.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Lightbulb size={14} className="text-yellow-500" /> AI Suggestions
                  </label>
                  <div className="space-y-2">
                    {suggestions.map((s, i) => (
                      <button key={i}
                        onClick={() => setImagePrompt(s)}
                        className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-gray-50 to-primary-50/50 hover:from-primary-50 hover:to-primary-100/50 border border-gray-100 hover:border-primary-200 transition-all text-sm text-gray-700">
                        <span className="text-primary-500 mr-2">✨</span> {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Design Description</label>
                <textarea
                  value={imagePrompt}
                  onChange={e => setImagePrompt(e.target.value)}
                  placeholder="Describe your dream design in detail... e.g., 'A modern living room with L-shaped sofa, wooden coffee table, large windows with city view, pendant lights, and indoor plants'"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none" />
              </div>

              <button
                onClick={() => handleGenerateImage()}
                disabled={!imagePrompt.trim() || isGeneratingImage}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isGeneratingImage ? (
                  <><Loader2 size={18} className="animate-spin" /> Generating (~30s)...</>
                ) : (
                  <><Wand2 size={18} /> Generate Design</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-primary-200">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Designer</h1>
              <p className="text-sm text-gray-500">Architecture & Interior Design Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={clearChat}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors" title="Clear chat">
              <RotateCcw size={18} />
            </button>
            <button onClick={() => setShowSettings(true)}
              className={`p-2.5 rounded-xl transition-colors ${
                keysConfigured ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse'
              }`} title="API Settings">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Status Bar */}
        {!keysConfigured && (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Zap size={16} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">Configure API Keys to Start</p>
              <p className="text-xs text-amber-600">Click the settings icon above to enter your free API keys</p>
            </div>
            <button onClick={() => setShowSettings(true)}
              className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors">
              Setup
            </button>
          </div>
        )}

        {/* Chat Area */}
        <div className="grid lg:grid-cols-[1fr,320px] gap-6">
          {/* Messages */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white rounded-tr-md'
                        : 'bg-gray-50 text-gray-800 rounded-tl-md border border-gray-100'
                    }`}>
                      {msg.isGenerating ? (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Loader2 size={16} className="animate-spin" />
                          <span>{isGeneratingImage ? 'Rendering design (~30s)...' : 'Thinking...'}</span>
                        </div>
                      ) : (
                        <>
                          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                          {msg.image && (
                            <div className="mt-3 relative group">
                              <img src={msg.image} alt="Generated design"
                                className="rounded-xl w-full max-w-md cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setFullscreenImage(msg.image!)} />
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setFullscreenImage(msg.image!)}
                                  className="p-1.5 bg-black/50 rounded-lg text-white hover:bg-black/70">
                                  <Maximize2 size={14} />
                                </button>
                                <button onClick={() => downloadImage(msg.image!, `buildbid-design-${msg.id}.png`)}
                                  className="p-1.5 bg-black/50 rounded-lg text-white hover:bg-black/70">
                                  <Download size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {/* Message actions */}
                    {!msg.isGenerating && msg.role === 'assistant' && !msg.image && (
                      <div className="flex gap-1 mt-1">
                        <button onClick={() => copyMessage(msg.id, msg.content)}
                          className="p-1 text-gray-300 hover:text-gray-500 transition-colors">
                          {copiedId === msg.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Quick prompts */}
              {showQuickPrompts && messages.length <= 1 && (
                <div className="mt-6">
                  <p className="text-xs text-gray-400 font-medium mb-3 flex items-center gap-1.5">
                    <Lightbulb size={12} /> Quick Start Prompts
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <button key={i} onClick={() => handleSendChat(prompt)}
                        className="text-left p-3 rounded-xl bg-gradient-to-r from-primary-50/50 to-purple-50/50 hover:from-primary-100 hover:to-purple-100 border border-primary-100/50 hover:border-primary-200 transition-all text-sm text-gray-600 hover:text-gray-800">
                        <span className="text-primary-400 mr-1">→</span> {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-end gap-2">
                <button onClick={() => setShowImagePanel(true)}
                  disabled={!hfKey}
                  className={`p-3 rounded-xl transition-all shrink-0 ${
                    hfKey
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 hover:from-purple-200 hover:to-pink-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`} title="Generate Image">
                  <ImageIcon size={20} />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={keysConfigured ? "Ask about designs, layouts, costs..." : "Configure API keys to start chatting..."}
                    disabled={!geminiKey}
                    rows={1}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                    style={{ minHeight: '48px', maxHeight: '120px' }} />
                  <button onClick={() => handleSendChat()}
                    disabled={!input.trim() || isLoading || !geminiKey}
                    className="absolute right-2 bottom-2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 px-1">
                <p className="text-[10px] text-gray-300">
                  Press Enter to send • Shift+Enter for new line
                </p>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${geminiKey ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-[10px] text-gray-300">Chat {geminiKey ? 'Ready' : 'Offline'}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${hfKey ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-[10px] text-gray-300">Image {hfKey ? 'Ready' : 'Offline'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Design Tools */}
          <div className="hidden lg:flex flex-col gap-4" style={{ height: 'calc(100vh - 220px)' }}>
            {/* Style Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Palette size={16} className="text-purple-500" />
                <h3 className="text-sm font-semibold text-gray-800">Design Style</h3>
              </div>
              <div className="space-y-1.5">
                {DESIGN_STYLES.map(style => (
                  <button key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left text-sm ${
                      selectedStyle === style.id
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}>
                    <span>{style.icon}</span>
                    <span className="font-medium">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Room Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Home size={16} className="text-blue-500" />
                <h3 className="text-sm font-semibold text-gray-800">Room Type</h3>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {ROOM_TYPES.map(room => (
                  <button key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-lg transition-all text-xs font-medium ${
                      selectedRoom === room.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-500'
                    }`}>
                    <room.icon size={16} />
                    {room.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Brush size={16} className="text-pink-500" />
                <h3 className="text-sm font-semibold text-gray-800">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setShowImagePanel(true)}
                  disabled={!hfKey}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 rounded-xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50">
                  <Wand2 size={14} /> Generate Image
                </button>
                <button
                  onClick={() => handleSendChat("Suggest 5 trending interior design ideas for Indian homes in 2024")}
                  disabled={!geminiKey}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-700 rounded-xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50">
                  <Lightbulb size={14} /> Trending Ideas
                </button>
                <button
                  onClick={() => handleSendChat("Help me estimate the cost for a 2BHK flat interior design in Bangalore")}
                  disabled={!geminiKey}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50">
                  <MessageSquare size={14} /> Cost Estimate
                </button>
                <button
                  onClick={() => handleSendChat("What are the best eco-friendly materials for home construction in India?")}
                  disabled={!geminiKey}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 text-amber-700 rounded-xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50">
                  <TreePine size={14} /> Green Materials
                </button>
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-purple-500" />
                  <h3 className="text-xs font-semibold text-purple-700">AI Suggestions</h3>
                  <ChevronDown size={12} className="text-purple-400 ml-auto" />
                </div>
                <div className="space-y-1.5">
                  {suggestions.map((s, i) => (
                    <button key={i}
                      onClick={() => { setImagePrompt(s); setShowImagePanel(true); }}
                      className="w-full text-left text-xs text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-100/50 transition-colors line-clamp-2">
                      ✨ {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Bar for Image Gen */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 flex gap-2 z-40">
          <button onClick={() => setShowImagePanel(true)}
            disabled={!hfKey}
            className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
            <Wand2 size={16} /> Generate Image
          </button>
          <button onClick={() => setShowSettings(true)}
            className="p-2.5 bg-gray-100 rounded-xl text-gray-600">
            <MinusCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
