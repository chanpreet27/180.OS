import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BrainCircuit, RefreshCw, Zap, ArrowRight, Layers, Sliders, AlertCircle, History, MessageSquare, Globe, Check } from 'lucide-react';
import Highlight from './Highlight';

const easeCurve = [0.16, 1, 0.3, 1];

const features = [
  {
    id: 'predictive',
    icon: Sparkles,
    title: 'Predictive Workflows',
    desc: 'Anticipates intent and pre-arranges workspace windows, application tools, and files before you explicitly request them.',
    tag: 'Contextual Engine',
    meta: 'SYSTEM INTENT',
  },
  {
    id: 'semantic',
    icon: BrainCircuit,
    title: 'Semantic File Indexing',
    desc: 'Organizes system documents and media by contextual meaning, project relationship, and temporal relevance.',
    tag: 'Zero Folders',
    meta: 'VECTOR INDEX',
  },
  {
    id: 'automation',
    icon: Zap,
    title: 'Silent Background Automation',
    desc: 'Executes routine system maintenance, data synchronization, and security checks with zero annoying popups.',
    tag: 'Non-Intrusive',
    meta: 'AUTONOMOUS CORE',
  },
];

const languageOptions = [
  { code: 'EN', name: 'English' },
  { code: 'FR', name: 'Français' },
  { code: 'ES', name: 'Español' },
  { code: 'DE', name: 'Deutsch' },
  { code: 'JA', name: '日本語' },
];

const translations = {
  EN: {
    disclaimer: 'AI can make mistakes. Please verify important information.',
    placeholder: 'Ask 180.OS Neural Assistant...',
    send: 'Send',
    historyHeader: 'CHAT HISTORY',
    activeContext: '180.OS NEURAL ASSISTANT',
    suggestedChip: 'Suggest workflow optimization',
  },
  FR: {
    disclaimer: "L'IA peut commettre des erreurs. Veuillez vérifier les informations.",
    placeholder: "Posez une question à l'assistant 180.OS...",
    send: 'Envoyer',
    historyHeader: 'HISTORIQUE DES DISCUSSIONS',
    activeContext: 'ASSISTANT NEURAL 180.OS',
    suggestedChip: 'Suggérer des optimisations',
  },
  ES: {
    disclaimer: 'La IA puede cometer errores. Por favor verifique la información.',
    placeholder: 'Pregunta al asistente 180.OS...',
    send: 'Enviar',
    historyHeader: 'HISTORIAL DE CHATS',
    activeContext: 'ASISTENTE NEURAL 180.OS',
    suggestedChip: 'Sugerir optimización de flujo',
  },
  DE: {
    disclaimer: 'KI kann Fehler machen. Bitte überprüfen Sie wichtige Informationen.',
    placeholder: 'Fragen Sie den 180.OS Assistenten...',
    send: 'Senden',
    historyHeader: 'CHAT-VERLAUF',
    activeContext: '180.OS NEURALER ASSISTENT',
    suggestedChip: 'Workflows optimieren',
  },
  JA: {
    disclaimer: 'AIは間違いを犯す可能性があります。重要情報をご確認ください。',
    placeholder: '180.OSアシスタントに質問...',
    send: '送信',
    historyHeader: 'チャット履歴',
    activeContext: '180.OS ニューラルアシスタント',
    suggestedChip: 'ワークフローを最適化',
  }
};

const initialThreads = {
  kernel: {
    id: 'kernel',
    title: '01 — Microkernel Architecture & Memory',
    time: '10:42 AM',
    messages: [
      { sender: 'user', text: 'How does the 180.OS microkernel prevent system crashes?' },
      { sender: 'ai', text: '180.OS isolates drivers and system services in zero-copy user-space memory modules. If a driver fails, the kernel restarts it instantly without dropping your active workspace state.' },
    ]
  },
  spatial: {
    id: 'spatial',
    title: '02 — Contextual Spatial UI Compositor',
    time: '09:15 AM',
    messages: [
      { sender: 'user', text: 'Explain how windows are organized automatically.' },
      { sender: 'ai', text: 'The spatial compositor analyzes task affinity and semantic document links, automatically clustering relevant tools while dimming non-essential background windows.' },
    ]
  },
  privacy: {
    id: 'privacy',
    title: '03 — On-Device Neural Tensor Security',
    time: 'Yesterday',
    messages: [
      { sender: 'user', text: 'Does my data leave the device during vector search?' },
      { sender: 'ai', text: 'No telemetry or document embeddings are transmitted externally. All neural indexing operates 100% locally on system hardware tensor cores.' },
    ]
  }
};

function IntelligenceCard({ feat, idx }) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComp = feat.icon;

  return (
    <motion.div
      className="intelligence-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: idx * 0.12, ease: easeCurve }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
    >
      {/* Top Header */}
      <div className="intel-card-top">
        <div className={`intel-icon-box ${isHovered ? 'hovered' : ''}`}>
          <IconComp size={20} strokeWidth={1.8} />
        </div>
        <motion.span
          className="intel-tag"
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.25 }}
        >
          {feat.tag}
        </motion.span>
      </div>

      <h3 className="intel-card-title">{feat.title}</h3>
      <p className="intel-card-desc">{feat.desc}</p>

      {/* Card-Specific Custom Mini-Visual Metaphor */}
      <div className="intel-mini-visual">
        {feat.id === 'predictive' && (
          <div className="pipeline-visual">
            <span className="pipe-step active">INPUT</span>
            <span className="pipe-arrow">→</span>
            <span className="pipe-step active">CONTEXT</span>
            <span className="pipe-arrow">→</span>
            <span className="pipe-step highlight">ACTION</span>
          </div>
        )}

        {feat.id === 'semantic' && (
          <div className="node-graph-visual">
            <svg width="100%" height="24" viewBox="0 0 160 24" fill="none">
              <line x1="20" y1="12" x2="60" y2="12" stroke="rgba(0,0,0,0.15)" strokeDasharray="2 2" />
              <line x1="60" y1="12" x2="100" y2="12" stroke="rgba(0,0,0,0.15)" strokeDasharray="2 2" />
              <line x1="100" y1="12" x2="140" y2="12" stroke="rgba(0,0,0,0.15)" strokeDasharray="2 2" />
              <circle cx="20" cy="12" r={isHovered ? "4" : "3"} fill="#000" />
              <circle cx="60" cy="12" r={isHovered ? "5" : "3"} fill="#000" />
              <circle cx="100" cy="12" r={isHovered ? "4" : "3"} fill="#000" />
              <circle cx="140" cy="12" r={isHovered ? "5" : "3"} fill="#000" />
            </svg>
          </div>
        )}

        {feat.id === 'automation' && (
          <div className="process-status-visual">
            <span className="proc-badge">SYNC</span>
            <span className="proc-dot">•</span>
            <span className="proc-badge">INDEX</span>
            <span className="proc-dot">•</span>
            <span className="proc-badge highlight">SECURE</span>
          </div>
        )}
      </div>

      {/* Footer Line */}
      <div className="intel-footer">
        <div className="intel-footer-left">
          <RefreshCw size={11} className={isHovered ? "spin-slow" : ""} />
          <span>{feat.meta}</span>
        </div>
        <span className={`intel-status-indicator ${isHovered ? 'active' : ''}`}>
          {isHovered ? 'READY →' : 'ACTIVE'}
        </span>
      </div>
    </motion.div>
  );
}

export default function IntelligenceSection() {
  const [threads, setThreads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState('kernel');
  const [selectedLang, setSelectedLang] = useState('EN');
  const [inputText, setInputText] = useState('');

  const currentTrans = translations[selectedLang] || translations.EN;
  const activeThread = threads[activeThreadId] || threads.kernel;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');

    const updatedMessages = [
      ...activeThread.messages,
      { sender: 'user', text: userMsg },
      { sender: 'ai', text: `180.OS contextual core evaluated "${userMsg}". Workspace windows and memory allocation updated instantly.` }
    ];

    setThreads((prev) => ({
      ...prev,
      [activeThreadId]: {
        ...prev[activeThreadId],
        messages: updatedMessages
      }
    }));
  };

  return (
    <section id="intelligence" className="section-container">
      <div className="section-inner">
        {/* Editorial Asymmetric Header Block */}
        <motion.div
          className="section-header asymmetric-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: easeCurve }}
        >
          <div className="header-left-col">
            <span className="section-eyebrow">03 — INTELLIGENCE</span>
            <h2 className="section-title">
              Intelligence,<br />
              <Highlight>built into the system.</Highlight>
            </h2>
          </div>

          <div className="header-right-col">
            <div className="tech-metadata-box">
              <span className="meta-label">NEURAL ENGINE</span>
              <span className="meta-val">ON-DEVICE TENSOR</span>
              <span className="meta-sub">ZERO CLOUD TELEMETRY</span>
            </div>
            <p className="section-lead mt-16">
              180.OS is designed to make computing more <Highlight>contextual</Highlight>, useful, and <Highlight>adaptive</Highlight> — without getting in the way.
            </p>
          </div>
        </motion.div>

        {/* Editorial Whitespace Moment */}
        <div className="editorial-spacer-sm" />

        {/* Intelligence Cards Grid */}
        <div className="intelligence-grid">
          {features.map((feat, idx) => (
            <IntelligenceCard key={feat.title} feat={feat} idx={idx} />
          ))}
        </div>

        {/* Editorial Whitespace Moment */}
        <div className="editorial-spacer-md" />

        {/* Interactive Contextual AI Chat & Instant History Panel */}
        <motion.div
          className="contextual-demo-panel ai-chat-demo-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: easeCurve }}
        >
          {/* Top Bar with Language Selector */}
          <div className="panel-top-bar">
            <div className="panel-status-tag">
              <span className="subtle-pulse-dot" />
              <span>{currentTrans.activeContext}</span>
            </div>

            {/* Language Selector */}
            <div className="language-selector-pill">
              <Globe size={11} className="globe-icon" />
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-opt-btn ${selectedLang === lang.code ? 'active' : ''}`}
                  onClick={() => setSelectedLang(lang.code)}
                  title={lang.name}
                >
                  {lang.code}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-inner-chat-grid">
            {/* Left Chat History List (Instant Loading without any loading spinner) */}
            <div className="chat-history-sidebar">
              <div className="history-sidebar-header">
                <History size={13} />
                <span>{currentTrans.historyHeader}</span>
              </div>
              <div className="history-threads-list">
                {Object.values(threads).map((thread) => {
                  const isActive = thread.id === activeThreadId;
                  return (
                    <button
                      key={thread.id}
                      className={`history-thread-item ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveThreadId(thread.id)}
                    >
                      <MessageSquare size={13} className="thread-icon" />
                      <div className="thread-info">
                        <span className="thread-title">{thread.title}</span>
                        <span className="thread-time">{thread.time}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Active Chat Conversation Window */}
            <div className="chat-main-window">
              <div className="chat-messages-container">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeThreadId}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.8 }}
                    transition={{ duration: 0.1 }}
                    className="messages-wrapper"
                  >
                    {activeThread.messages.map((msg, mIdx) => (
                      <div
                        key={mIdx}
                        className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}
                      >
                        <div className="bubble-avatar">
                          {msg.sender === 'user' ? 'YOU' : '180'}
                        </div>
                        <div className="bubble-content">
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Prompt Bar with Very Small Native Language Disclaimer */}
              <div className="chat-prompt-area">
                {/* Very Small Native Language Disclaimer */}
                <div className="native-disclaimer-line">
                  <AlertCircle size={10} className="disclaimer-alert-icon" />
                  <span>{currentTrans.disclaimer}</span>
                </div>

                {/* Prompt Input Form */}
                <form onSubmit={handleSendMessage} className="prompt-input-form">
                  <input
                    type="text"
                    placeholder={currentTrans.placeholder}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="prompt-input-field"
                  />
                  <button type="submit" className="prompt-submit-btn">
                    <span>{currentTrans.send}</span>
                    <Send size={12} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
