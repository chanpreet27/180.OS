import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Search, Folder, Sparkles, Sliders, Shield, Command, Activity, Cpu } from 'lucide-react';
import Highlight from './Highlight';

const easeCurve = [0.16, 1, 0.3, 1];

export default function InterfaceSection() {
  const [activeWindow, setActiveWindow] = useState('workspace');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section id="interface" className="section-container bg-subtle">
      <div className="section-inner">
        {/* Header Block */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: easeCurve }}
        >
          <span className="section-eyebrow">02 — THE EXPERIENCE</span>
          <h2 className="section-title">Simple on the surface.<br /><Highlight>Powerful underneath.</Highlight></h2>
          <p className="section-lead">
            An adaptive desktop environment that removes visual noise, presenting <Highlight>exact controls</Highlight> when and where you need them.
          </p>
        </motion.div>

        {/* 180.OS Interactive Desktop Mockup */}
        <motion.div
          className="desktop-window-mockup"
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.9, ease: easeCurve }}
        >
          {/* Top Desktop Bar */}
          <div className="os-topbar">
            <div className="os-topbar-left">
              <span className="os-logo-small">180.OS</span>
              <span className="os-time">10:42 AM</span>
            </div>
            <div className="os-topbar-center">
              <div className="os-search-bar">
                <Search size={13} className="search-icon" />
                <input
                  type="text"
                  placeholder="Ask 180.OS or search system... (⌘ + Space)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="os-topbar-right">
              <span className="os-badge"><Cpu size={12} /> Core 0.8%</span>
              <span className="os-badge"><Shield size={12} /> Encrypted</span>
              <span className="os-status-dot" />
            </div>
          </div>

          {/* Desktop Canvas / Workspace Body */}
          <div className="os-desktop-canvas">
            {/* Left System Sidebar */}
            <div className="os-sidebar">
              <div className="sidebar-group">
                <span className="sidebar-title">WORKSPACES</span>
                <button
                  className={`sidebar-btn ${activeWindow === 'workspace' ? 'active' : ''}`}
                  onClick={() => setActiveWindow('workspace')}
                >
                  <Folder size={14} /> Spatial Canvas
                </button>
                <button
                  className={`sidebar-btn ${activeWindow === 'terminal' ? 'active' : ''}`}
                  onClick={() => setActiveWindow('terminal')}
                >
                  <Terminal size={14} /> Kernel Console
                </button>
                <button
                  className={`sidebar-btn ${activeWindow === 'intelligence' ? 'active' : ''}`}
                  onClick={() => setActiveWindow('intelligence')}
                >
                  <Sparkles size={14} /> Neural Context
                </button>
              </div>

              <div className="sidebar-group mt-auto">
                <span className="sidebar-title">SYSTEM METRICS</span>
                <div className="metric-row">
                  <span>Memory</span>
                  <span>4.2 GB / 64 GB</span>
                </div>
                <div className="metric-row">
                  <span>Latency</span>
                  <span>0.4ms</span>
                </div>
              </div>
            </div>

            {/* Main Window Area */}
            <div className="os-main-content">
              <AnimatePresence mode="wait">
                {activeWindow === 'workspace' && (
                  <motion.div
                    key="workspace"
                    className="os-card-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="panel-header">
                      <h3>Spatial Workspace</h3>
                      <span className="panel-tag">Auto-Organizing</span>
                    </div>
                    <div className="workspace-grid">
                      <div className="file-node">
                        <div className="node-icon"><Folder size={20} /></div>
                        <span className="node-name">System Core</span>
                        <span className="node-meta">180.OS Architecture</span>
                      </div>
                      <div className="file-node">
                        <div className="node-icon"><Activity size={20} /></div>
                        <span className="node-name">Neural Flow</span>
                        <span className="node-meta">Live Memory Buffer</span>
                      </div>
                      <div className="file-node">
                        <div className="node-icon"><Sliders size={20} /></div>
                        <span className="node-name">Adaptive UI</span>
                        <span className="node-meta">Layout Preset</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeWindow === 'terminal' && (
                  <motion.div
                    key="terminal"
                    className="os-card-panel dark-terminal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="panel-header">
                      <h3>180.OS Microkernel Terminal</h3>
                      <span className="panel-tag text-green">Online</span>
                    </div>
                    <div className="terminal-body">
                      <p className="term-line">&gt; 180.OS kernel 2.4.0-adaptive arm64 initialized.</p>
                      <p className="term-line">&gt; Loading Neural Core engine... [OK]</p>
                      <p className="term-line">&gt; Zero-latency memory isolation verified.</p>
                      <p className="term-line">&gt; Spatial UI compositor attached to display 0.</p>
                      <p className="term-line text-dim">&gt; Ready for user commands_</p>
                    </div>
                  </motion.div>
                )}

                {activeWindow === 'intelligence' && (
                  <motion.div
                    key="intelligence"
                    className="os-card-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="panel-header">
                      <h3>Neural Context Assistant</h3>
                      <span className="panel-tag">Active Intent</span>
                    </div>
                    <div className="ai-suggestion-box">
                      <div className="ai-avatar"><Sparkles size={16} /></div>
                      <div>
                        <strong>Context Summary</strong>
                        <p>180.OS observed your active workflow and prepared 3 related project modules for instant access.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Glass Dock */}
          <div className="os-dock">
            <div className="dock-pill">
              <button className="dock-item active"><Command size={16} /></button>
              <button className="dock-item" onClick={() => setActiveWindow('workspace')}><Folder size={16} /></button>
              <button className="dock-item" onClick={() => setActiveWindow('terminal')}><Terminal size={16} /></button>
              <button className="dock-item" onClick={() => setActiveWindow('intelligence')}><Sparkles size={16} /></button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
