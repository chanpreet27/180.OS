import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import Highlight from './Highlight';

const easeCurve = [0.16, 1, 0.3, 1];

export default function FinalCTASection() {
  return (
    <footer id="download" className="final-cta-section">
      <div className="section-inner">
        {/* Main CTA Block */}
        <motion.div
          className="cta-hero-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: easeCurve }}
        >
          <div className="cta-icon-motif">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 24 6 A 18 18 0 0 1 24 42" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
              <circle cx="24" cy="24" r="5" fill="#000000" />
            </svg>
          </div>

          <h2 className="cta-title">Welcome to<br /><Highlight>180.OS.</Highlight></h2>
          <p className="cta-lead">A <Highlight>different direction</Highlight> for personal computing.</p>

          <div className="cta-button-row">
            <motion.a
              href="#hero"
              className="btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{ textDecoration: 'none' }}
            >
              Explore 180.OS
            </motion.a>
            <motion.a
              href="#philosophy"
              className="btn-secondary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{ textDecoration: 'none' }}
            >
              View the Vision
            </motion.a>
          </div>
        </motion.div>

        {/* Minimal Footer Links & Legal */}
        <div className="minimal-footer">
          <div className="footer-top-row">
            {/* Left Brand info */}
            <div className="footer-brand-block">
              <span className="footer-logo">180.OS</span>
              <p className="footer-tagline">A new direction for computing.</p>
            </div>

            {/* Navigation Columns */}
            <div className="footer-links-grid">
              <div className="footer-col">
                <span className="col-title">PRODUCT</span>
                <a href="#hero">Overview</a>
                <a href="#system">The OS</a>
                <a href="#interface">Interface</a>
                <a href="#status">Download</a>
              </div>
              <div className="footer-col">
                <span className="col-title">TECHNOLOGY</span>
                <a href="#architecture">Microkernel</a>
                <a href="#intelligence">Neural Engine</a>
                <a href="#adaptive">Adaptive Modes</a>
                <a href="#status">Security</a>
              </div>
              <div className="footer-col">
                <span className="col-title">VISION</span>
                <a href="#philosophy">Manifesto</a>
                <a href="#system">Architecture</a>
                <a href="#status">Telemetry</a>
              </div>
              <div className="footer-col">
                <span className="col-title">CONNECT</span>
                <a href="https://github.com" target="_blank" rel="noreferrer">
                  GitHub <ArrowUpRight size={12} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                  LinkedIn <ArrowUpRight size={12} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  Instagram <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>© 2026 180.OS. All rights reserved.</span>
            <span>Built for Next Generation Computing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
