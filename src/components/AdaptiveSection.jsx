import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Palette, Briefcase, Compass, Check } from 'lucide-react';
import Highlight from './Highlight';

const easeCurve = [0.16, 1, 0.3, 1];

const modes = [
  {
    id: 'focus',
    label: 'Focus Mode',
    icon: Target,
    title: 'Zero Distraction Solitude',
    desc: 'Hides all peripheral desktop elements, mutes secondary notifications, and isolates single-task workspace memory.',
    accentColor: '#000000',
    tags: ['Monochrome UI', 'Single Task', 'Muted Alerts'],
  },
  {
    id: 'creative',
    label: 'Creative Mode',
    icon: Palette,
    title: 'Spatial Visual Canvas',
    desc: 'Expands the workspace canvas infinitely, enabling freeform spatial arrangement of design assets, media, and notes.',
    accentColor: '#111111',
    tags: ['Infinite Canvas', 'Touch & Pen', 'Color Engine'],
  },
  {
    id: 'work',
    label: 'Work Mode',
    icon: Briefcase,
    title: 'Multi-Window Tiling & Data Feeds',
    desc: 'Automatically tiles terminals, code editors, and telemetry streams with sub-millisecond keyboard shortcuts.',
    accentColor: '#222222',
    tags: ['Tiling Window Manager', 'Split Terminal', 'Telemetry'],
  },
  {
    id: 'explore',
    label: 'Explore Mode',
    icon: Compass,
    title: 'Semantic Graph Navigator',
    desc: 'Visualizes your personal knowledge base as an interactive connected graph of ideas, files, and project nodes.',
    accentColor: '#333333',
    tags: ['Knowledge Graph', 'Semantic Search', 'Node View'],
  },
];

export default function AdaptiveSection() {
  const [activeMode, setActiveMode] = useState(modes[0]);

  return (
    <section id="adaptive" className="section-container bg-subtle">
      <div className="section-inner">
        {/* Header Block */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: easeCurve }}
        >
          <span className="section-eyebrow">04 — ADAPTIVE SYSTEMS</span>
          <h2 className="section-title">The system<br /><Highlight>adapts with you.</Highlight></h2>
          <p className="section-lead">
            Select a mode below to see how 180.OS <Highlight>dynamically transforms</Highlight> its user interface and system resource allocations.
          </p>
        </motion.div>

        {/* Mode Selector Tabs */}
        <div className="mode-tabs-container">
          {modes.map((mode) => {
            const IconComp = mode.icon;
            const isSelected = activeMode.id === mode.id;
            return (
              <motion.button
                key={mode.id}
                className={`mode-tab-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveMode(mode)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <IconComp size={16} />
                <span>{mode.label}</span>
                {isSelected && <Check size={14} className="tab-check" />}
              </motion.button>
            );
          })}
        </div>

        {/* Active Mode Visual Showcase */}
        <div className="mode-display-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode.id}
              className="mode-content-inner"
              initial={{ opacity: 0, scale: 0.98, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -16 }}
              transition={{ duration: 0.4, ease: easeCurve }}
            >
              <div className="mode-left-info">
                <span className="mode-badge">MODE PRESET</span>
                <h3 className="mode-title">{activeMode.title}</h3>
                <p className="mode-desc">{activeMode.desc}</p>

                <div className="mode-tags-row">
                  {activeMode.tags.map((t) => (
                    <span key={t} className="mode-tag-pill">{t}</span>
                  ))}
                </div>
              </div>

              <div className="mode-right-visual">
                <div className={`mode-canvas-preview ${activeMode.id}-preset`}>
                  <div className="preview-top-bar">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                    <span className="preview-title">{activeMode.label} — Live Preview</span>
                  </div>
                  <div className="preview-body">
                    {activeMode.id === 'focus' && (
                      <div className="preview-focus-box">
                        <span className="focus-text">180.OS Focus Engine Active</span>
                        <div className="focus-line" />
                      </div>
                    )}
                    {activeMode.id === 'creative' && (
                      <div className="preview-creative-box">
                        <div className="canvas-shape s1" />
                        <div className="canvas-shape s2" />
                        <div className="canvas-shape s3" />
                      </div>
                    )}
                    {activeMode.id === 'work' && (
                      <div className="preview-work-box">
                        <div className="tile t1">Terminal</div>
                        <div className="tile t2">Telemetry</div>
                        <div className="tile t3">Code Core</div>
                      </div>
                    )}
                    {activeMode.id === 'explore' && (
                      <div className="preview-explore-box">
                        <div className="graph-node g1" />
                        <div className="graph-node g2" />
                        <div className="graph-node g3" />
                        <svg className="graph-lines"><line x1="20" y1="30" x2="100" y2="80" stroke="#ccc" strokeWidth="1" /></svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
