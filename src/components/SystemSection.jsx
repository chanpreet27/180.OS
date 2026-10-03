import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Layers, Sparkles, Layout, ShieldCheck, ArrowRight } from 'lucide-react';
import Highlight from './Highlight';

const easeCurve = [0.16, 1, 0.3, 1];

const systemLayers = [
  {
    num: '01',
    title: 'Spatial Interface',
    desc: 'Fluid, distraction-free spatial windowing that reorganizes automatically based on active task context.',
    icon: Layout,
    metaLayer: 'LAYER 01 / 05',
    metaTech: 'SPATIAL COMPOSITOR',
    iconType: 'spatial',
  },
  {
    num: '02',
    title: 'Modular Applications',
    desc: 'Decoupled application components that execute seamlessly across local silicon and cloud nodes.',
    icon: Layers,
    metaLayer: 'MODULE ARCH',
    metaTech: 'DECOUPLED NODES',
    iconType: 'modular',
  },
  {
    num: '03',
    title: 'Contextual Intelligence',
    desc: 'On-device neural core that understands document semantics, workflow intent, and project state.',
    icon: Sparkles,
    metaLayer: 'CONTEXT CORE',
    metaTech: 'ON-DEVICE TENSOR',
    iconType: 'intelligence',
  },
  {
    num: '04',
    title: 'Adaptive Microkernel',
    desc: 'Sub-millisecond process scheduling with zero legacy overhead and strict memory isolation.',
    icon: Cpu,
    metaLayer: 'MICROKERNEL',
    metaTech: '0.4MS SCHEDULER',
    iconType: 'kernel',
  },
  {
    num: '05',
    title: 'Hardware Fabric',
    desc: 'Direct neural & tactile device bridges for instant input response and encrypted local storage.',
    icon: ShieldCheck,
    metaLayer: 'HARDWARE FABRIC',
    metaTech: 'ENCRYPTED BRIDGES',
    iconType: 'hardware',
  },
];

function SystemCard({ layer, idx }) {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const IconComponent = layer.icon;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -4, y: x * 4 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className="layer-glass-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: idx * 0.08, ease: easeCurve }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        y: isHovered ? -4 : 0,
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {/* Top Bar: Card Number & Purposeful Animated Icon */}
      <div className="card-top">
        <span className={`card-num ${isHovered ? 'hovered' : ''}`}>{layer.num}</span>
        <div className={`card-icon-wrapper ${isHovered ? 'hovered' : ''}`}>
          <motion.div
            animate={
              isHovered
                ? layer.iconType === 'spatial'
                  ? { scale: 1.12, x: 1 }
                  : layer.iconType === 'modular'
                  ? { y: -2 }
                  : layer.iconType === 'intelligence'
                  ? { rotate: 25, scale: 1.1 }
                  : layer.iconType === 'kernel'
                  ? { y: -2, scale: 1.08 }
                  : { y: -2 }
                : { scale: 1, x: 0, y: 0, rotate: 0 }
            }
            transition={{ duration: 0.35, ease: easeCurve }}
          >
            <IconComponent size={18} strokeWidth={1.8} />
          </motion.div>
        </div>
      </div>

      {/* Internal Grid Content */}
      <div className="card-mid">
        <span className="card-meta-tag">{layer.metaLayer}</span>
        <h3 className="card-title">{layer.title}</h3>
        <p className="card-desc">{layer.desc}</p>
      </div>

      {/* Bottom Technical Status & Hover Reveal */}
      <div className="card-status-line">
        <div className="status-left">
          <span className="status-dot-active" />
          <span className="status-tech-label">{layer.metaTech}</span>
        </div>
        
        <div className={`status-hover-reveal ${isHovered ? 'visible' : ''}`}>
          <span>EXPLORE</span>
          <ArrowRight size={11} className="reveal-arrow" />
        </div>
      </div>
    </motion.div>
  );
}

export default function SystemSection() {
  return (
    <section id="system" className="section-container">
      <div className="section-inner">
        {/* Header Block with Technical Status Metadata */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: easeCurve }}
        >
          <div className="section-eyebrow-row">
            <span className="section-eyebrow">01 — THE SYSTEM</span>
            <div className="tech-metadata-badge">
              <span className="meta-pulse-dot" />
              <span>SYSTEM / CORE — BUILD 01.2026</span>
            </div>
          </div>

          <h2 className="section-title">
            An operating system<br />
            built around <Highlight>you.</Highlight>
          </h2>

          <p className="section-lead">
            180.OS rethinks the relationship between people, applications, information, and the <Highlight>machine itself.</Highlight>
          </p>
        </motion.div>

        {/* Editorial 1px Horizontal Divider Line */}
        <motion.div
          className="system-divider-line"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2, ease: easeCurve }}
        />

        {/* Floating System Layers Cards Grid */}
        <div className="system-layers-grid">
          {systemLayers.map((layer, idx) => (
            <SystemCard key={layer.num} layer={layer} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
