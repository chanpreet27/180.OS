import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, ArrowUpRight, Cpu, Shield, Activity, RefreshCw } from 'lucide-react';

const easeCurve = [0.16, 1, 0.3, 1];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [isDarkSection, setIsDarkSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      const systemEl = document.getElementById('system');
      const interfaceEl = document.getElementById('interface');
      const archEl = document.getElementById('architecture');
      const philosophyEl = document.getElementById('philosophy');

      if (philosophyEl) {
        const top = philosophyEl.offsetTop;
        const height = philosophyEl.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          setIsDarkSection(true);
        } else {
          setIsDarkSection(false);
        }
      } else {
        setIsDarkSection(false);
      }

      if (archEl && scrollPos >= archEl.offsetTop) {
        setActiveTab('architecture');
      } else if (interfaceEl && scrollPos >= interfaceEl.offsetTop) {
        setActiveTab('interface');
      } else if (systemEl && scrollPos >= systemEl.offsetTop) {
        setActiveTab('system');
      } else {
        setActiveTab('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { num: '01', title: 'THE SYSTEM', desc: 'A new foundation for personal computing.', href: '#system' },
    { num: '02', title: 'EXPERIENCE', desc: 'Spatial UI window manager & adaptive controls.', href: '#interface' },
    { num: '03', title: 'INTELLIGENCE', desc: 'Contextual AI engine built into the OS core.', href: '#intelligence' },
    { num: '04', title: 'ADAPTIVE MODES', desc: 'Interface presets morphing with your task.', href: '#adaptive' },
    { num: '05', title: 'ARCHITECTURE', desc: 'Sub-millisecond microkernel execution bounds.', href: '#architecture' },
    { num: '06', title: 'VISION', desc: 'Manifesto on next direction computing.', href: '#philosophy' },
  ];

  return (
    <>
      <motion.nav
        className={`navbar ${isDarkSection ? 'dark-nav-theme' : ''}`}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: easeCurve }}
      >
        {/* Left Group */}
        <div className="nav-left">
          {/* Logo & Technical Annotation */}
          <a href="#hero" className="logo-container" aria-label="180.OS Homepage">
            <span className="brand-text">180.OS</span>
            <span className="sys-annotation desktop-only">SYS_180 / 01</span>
          </a>

          {/* Menu Button with Morphing Plus/Close */}
          <motion.button
            className={`menu-btn ${menuOpen ? 'open' : ''}`}
            onClick={() => {
              setMenuOpen(!menuOpen);
              if (statusOpen) setStatusOpen(false);
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Toggle Menu"
          >
            <div className="menu-icon-circle">
              <motion.div
                animate={{ rotate: menuOpen ? 45 : 0 }}
                transition={{ duration: 0.25, ease: easeCurve }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={12} strokeWidth={3} />
              </motion.div>
            </div>
            <span className="menu-text">{menuOpen ? 'Close' : 'Menu'}</span>
          </motion.button>

          {/* Secondary Navigation Tags Pill (Desktop) */}
          <div className="tags-pill desktop-only">
            <a
              href="#system"
              className={`tag-label-link ${activeTab === 'system' ? 'active' : ''}`}
            >
              System
            </a>
            <a
              href="#interface"
              className={`tag-label-link ${activeTab === 'interface' ? 'active' : ''}`}
            >
              Experience
            </a>
            <a
              href="#architecture"
              className={`tag-label-link ${activeTab === 'architecture' ? 'active' : ''}`}
            >
              Technology
            </a>
          </div>
        </div>

        {/* Right Group */}
        <div className="nav-right">
          <motion.button
            className="adaptive-pill"
            onClick={() => {
              setStatusOpen(!statusOpen);
              if (menuOpen) setMenuOpen(false);
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Toggle Status Panel"
          >
            <div className="status-icon-circle">
              <span className="pulse-dot" />
            </div>
            <span className="adaptive-text desktop-only">180.OS Online</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Interactive System Status Micro-UI Panel */}
      <AnimatePresence>
        {statusOpen && (
          <motion.div
            className="status-dropdown-panel"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.3, ease: easeCurve }}
          >
            <div className="status-panel-header">
              <div className="title-with-icon">
                <Activity size={14} />
                <span>SYSTEM STATUS</span>
              </div>
              <span className="live-badge">LIVE TELEMETRY</span>
            </div>
            <div className="status-metrics-grid">
              <div className="status-metric-item">
                <span className="metric-name">Kernel Core</span>
                <span className="metric-val text-green">ONLINE (0.4ms)</span>
              </div>
              <div className="status-metric-item">
                <span className="metric-name">Spatial UI</span>
                <span className="metric-val">ACTIVE (120Hz)</span>
              </div>
              <div className="status-metric-item">
                <span className="metric-name">Neural Core</span>
                <span className="metric-val">READY (Local)</span>
              </div>
              <div className="status-metric-item">
                <span className="metric-name">Architecture</span>
                <span className="metric-val">EVOLVING</span>
              </div>
            </div>
            <div className="status-panel-footer">
              <span>Build: 2026.04.180</span>
              <RefreshCw size={10} className="spin-slow" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Drawer Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="menu-overlay"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: easeCurve }}
          >
            <div className="menu-header">
              <span className="menu-title">180.OS / SYSTEM DIRECTORY</span>
              <button
                className="menu-close-btn"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={14} />
              </button>
            </div>
            <div className="menu-items-grid">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.title}
                  href={item.href}
                  className="menu-item-link"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                >
                  <div className="item-left-block">
                    <span className="item-num">{item.num}</span>
                    <div className="item-text-group">
                      <span className="item-title">{item.title}</span>
                      <span className="item-desc">{item.desc}</span>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="menu-arrow" />
                </motion.a>
              ))}
            </div>
            <div className="menu-footer-note">
              <span>Kernel 2.4.0-adaptive arm64</span>
              <span>180.OS Architecture</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
