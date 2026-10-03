import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorState, setCursorState] = useState('default'); // 'default', 'button', 'card', 'laptop', 'quiet'
  const [pillText, setPillText] = useState('');
  const [pillOffset, setPillOffset] = useState({ x: 28, y: -12 });
  
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pillRef = useRef(null);
  
  const posRef = useRef({ x: -100, y: -100 });
  const targetPosRef = useRef({ x: -100, y: -100 });
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // Disable custom cursor on coarse touch screens or reduced-motion preference
    const isCoarse = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isCoarse || isReduced) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const handleScroll = () => {
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    const handleMouseMove = (e) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };

      // Position central dot with zero delay
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Smart viewport boundary calculation for floating pill
      const flexX = e.clientX > window.innerWidth - 140 ? -110 : 28;
      const flexY = e.clientY > window.innerHeight - 60 ? -32 : -12;
      setPillOffset({ x: flexX, y: flexY });

      if (pillRef.current) {
        pillRef.current.style.transform = `translate3d(${e.clientX + flexX}px, ${e.clientY + flexY}px, 0)`;
      }

      const target = e.target;
      if (!target) return;

      // Laptop Scroll Section
      const laptopElem = target.closest('.laptop-sequence-section, .laptop-sticky-viewport, .laptop-canvas-wrapper');
      if (laptopElem && !isScrollingRef.current) {
        setCursorState('laptop');
        setPillText('OPEN →');
        return;
      }

      // System / Intelligence Cards
      const cardElem = target.closest('.layer-glass-card, .intelligence-card');
      if (cardElem) {
        setCursorState('card');
        setPillText('EXPLORE →');
        return;
      }

      // Interactive Buttons & Pills
      const buttonElem = target.closest('.btn-primary, .btn-secondary, .menu-btn, .adaptive-pill, .dock-item, .mode-tab-btn, .tag-chip, .sidebar-btn, .action-item-row');
      if (buttonElem) {
        setCursorState('button');
        setPillText('');
        return;
      }

      // Navigation Links
      const navElem = target.closest('.progress-step-item, .nav-left, .nav-right, .menu-item-link');
      if (navElem) {
        setCursorState('quiet');
        setPillText('');
        return;
      }

      setCursorState('default');
      setPillText('');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Inertia physics loop for trailing ring
    const render = () => {
      posRef.current.x += (targetPosRef.current.x - posRef.current.x) * 0.22;
      posRef.current.y += (targetPosRef.current.y - posRef.current.y) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="custom-cursor-container">
      {/* Precision Central Dot (5-7px) */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${cursorState}`}
      />

      {/* Soft Secondary Trailing Ring (18-26px) */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${cursorState}`}
      />

      {/* Floating Interaction Pill Beside Cursor (NOT centered, NO giant disk) */}
      <div
        ref={pillRef}
        className={`cursor-floating-pill ${pillText && !isScrollingRef.current ? 'visible' : ''}`}
      >
        <span>{pillText}</span>
      </div>
    </div>
  );
}
