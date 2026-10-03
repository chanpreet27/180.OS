import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Highlight from './Highlight';

const easeCurve = [0.16, 1, 0.3, 1];

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Gentle parallax values between -6px and +6px
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="hero" className="hero-section">
      {/* Mechanical Hand Video Visual with Subtle Mouse Parallax (z-index 0) */}
      <motion.div
        className="video-wrapper"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{
          opacity: { duration: 1.8, ease: easeCurve },
          scale: { duration: 1.8, ease: easeCurve },
          x: { duration: 0.8, ease: 'easeOut' },
          y: { duration: 0.8, ease: 'easeOut' },
        }}
      >
        <video
          className="hero-video"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </motion.div>

      {/* Subtle Technical Annotations floating near Hero */}
      <div className="hero-technical-annotations desktop-only">
        <motion.div
          className="annotation-tag top-left"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className="annotation-line" />
          <span className="annotation-text">BUILD 01 — 2026</span>
        </motion.div>

        <motion.div
          className="annotation-tag top-right"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <span className="annotation-text">ADAPTIVE CORE / 180°</span>
          <span className="annotation-line" />
        </motion.div>
      </div>

      {/* Spacer pushing content overlay to lower screen */}
      <div style={{ flex: 1 }} />

      {/* Hero Content Overlay (Lower-Left Headline & Lower-Right Pills, z-index 30) */}
      <motion.div
        className="footer-container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1, ease: easeCurve }}
      >
        <div className="footer-content">
          {/* Lower-Left Region Hero Content */}
          <div className="footer-left">
            {/* Eyebrow */}
            <motion.div
              className="subtitle-line"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: easeCurve }}
            >
              <span className="subtitle-dot" />
              <span className="subtitle-text">THE NEXT COMPUTING EXPERIENCE</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="hero-heading"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: easeCurve }}
            >
              Computing,<br /><Highlight>Reimagined.</Highlight>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="hero-supporting-text"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8, ease: easeCurve }}
            >
              180.OS is a new operating system designed around <Highlight>intelligence</Highlight>, <Highlight>adaptability</Highlight>, and a radically simpler computing experience.
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="button-group"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8, ease: easeCurve }}
            >
              <motion.a
                href="#system"
                className="btn-primary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{ textDecoration: 'none' }}
              >
                Explore 180.OS
              </motion.a>
              <motion.a
                href="#interface"
                className="btn-secondary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{ textDecoration: 'none' }}
              >
                See How It Works
              </motion.a>
            </motion.div>
          </div>

          {/* Lower-Right Category Pills */}
          <motion.div
            className="footer-right"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8, ease: easeCurve }}
          >
            <motion.span
              className="tag-chip"
              whileHover={{ y: -3, scale: 1.05 }}
            >
              Adaptive
            </motion.span>
            <motion.span
              className="tag-chip"
              whileHover={{ y: -3, scale: 1.05 }}
            >
              Intelligent
            </motion.span>
            <motion.span
              className="tag-chip"
              whileHover={{ y: -3, scale: 1.05 }}
            >
              Open
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
