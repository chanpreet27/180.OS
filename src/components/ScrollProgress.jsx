import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

const sections = [
  { id: 'hero', label: '00 OVERVIEW' },
  { id: 'system', label: '01 SYSTEM' },
  { id: 'experience', label: '02 EXPERIENCE' },
  { id: 'interface', label: '03 WORKSPACE' },
  { id: 'intelligence', label: '04 INTELLIGENCE' },
  { id: 'adaptive', label: '05 ADAPTIVE' },
  { id: 'architecture', label: '06 ARCHITECTURE' },
  { id: 'philosophy', label: '07 VISION' },
];

const ROW_HEIGHT = 40; // Fixed 40px height per navigation row

export default function ScrollProgress() {
  const [activeSection, setActiveSection] = useState('hero');
  const [reflectionOffset, setReflectionOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeIndex = sections.findIndex((sec) => sec.id === activeSection);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;
  const isDarkSection = activeSection === 'philosophy';

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.05;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.04;
    setReflectionOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setReflectionOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className={`scroll-progress-sidebar desktop-only ${isDarkSection ? 'dark-section-theme' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Rectangular Liquid Optical Glass Panel Backdrop */}
      <div className="glass-panel-backdrop">
        {/* Subtle Internal Luminance Refraction Sheen */}
        <div
          className="glass-internal-sheen"
          style={{
            transform: `translate(${reflectionOffset.x}px, ${reflectionOffset.y}px)`,
          }}
        />
        <div className="glass-specular-rim" />
      </div>

      {/* Engineered 8-Row Navigation Grid System */}
      <div className="nav-grid-container">
        {/* Continuous Vertical Guide Line (Passes through exact center of dot column) */}
        <div className="continuous-guide-line" />

        {/* Single Shared Active Row Background Highlight */}
        <div
          className="active-row-highlight"
          style={{
            transform: `translateY(${safeActiveIndex * ROW_HEIGHT}px)`,
          }}
        />

        {/* 8 Shared Fixed Rows */}
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className={`nav-row-item ${isActive ? 'active' : ''}`}
              aria-label={`Scroll to ${sec.label}`}
            >
              {/* Column 1: Fixed Width Dot Column */}
              <div className="dot-col">
                <span className="step-indicator-dot" />
              </div>

              {/* Column 2: Text Column (Identical Left Alignment for Every Row) */}
              <div className="text-col">
                <span className="step-label-text">{sec.label}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
