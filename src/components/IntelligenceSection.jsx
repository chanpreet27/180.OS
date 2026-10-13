import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BrainCircuit, RefreshCw, Zap, ArrowRight, Layers, CheckCircle2, Sliders, Command } from 'lucide-react';
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
  const [activeAction, setActiveAction] = useState(0);

  const suggestedActions = [
    { label: 'Organize research windows & tabs', status: 'Ready', icon: Layers },
    { label: 'Synthesize document references', status: 'Optimized', icon: Sparkles },
    { label: 'Prepare kernel memory snapshot', status: 'Standby', icon: Sliders },
  ];

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

        {/* Interactive Contextual Computing Demonstration Panel */}
        <motion.div
          className="contextual-demo-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: easeCurve }}
        >
          <div className="panel-top-bar">
            <div className="panel-status-tag">
              <span className="subtle-pulse-dot" />
              <span>180.OS CONTEXTUAL ENGINE — LIVE INTENT</span>
            </div>
            <span className="panel-badge-mono">STANDALONE PROCESS</span>
          </div>

          <div className="panel-inner-grid">
            <div className="context-state-block">
              <span className="block-eyebrow">CURRENT SYSTEM CONTEXT</span>
              <h4 className="context-title">Research / 180.OS Architecture</h4>
              <p className="context-desc">
                Analyzing active workspace semantic graph and project files to provide instant single-click workflow optimizations.
              </p>
            </div>

            <div className="suggested-actions-block">
              <span className="block-eyebrow">SUGGESTED ACTIONS</span>
              <div className="actions-list">
                {suggestedActions.map((action, idx) => {
                  const ActionIcon = action.icon;
                  const isSelected = activeAction === idx;
                  return (
                    <motion.div
                      key={action.label}
                      className={`action-item-row ${isSelected ? 'active' : ''}`}
                      onClick={() => setActiveAction(idx)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="action-left">
                        <ActionIcon size={14} className="action-icon" />
                        <span className="action-text">{action.label}</span>
                      </div>
                      <span className="action-status">{action.status}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
