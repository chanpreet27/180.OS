import React from 'react';
import { motion } from 'motion/react';
import { Shield, Layers, Cpu, Server, HardDrive } from 'lucide-react';
import Highlight from './Highlight';

const easeCurve = [0.16, 1, 0.3, 1];

const archLayers = [
  {
    layer: 'Layer 5',
    name: 'Adaptive Interface Engine',
    desc: 'React-based spatial window compositor operating at native 120Hz display refresh rates.',
    icon: Layers,
  },
  {
    layer: 'Layer 4',
    name: 'Neural Intelligence Layer',
    desc: 'On-device tensor execution engine with local vector memory and zero cloud telemetry dependencies.',
    icon: Shield,
  },
  {
    layer: 'Layer 3',
    name: 'Distributed File Fabric',
    desc: 'End-to-end encrypted storage engine with instant snapshotting and zero fragment degradation.',
    icon: HardDrive,
  },
  {
    layer: 'Layer 2',
    name: 'Zero-Latency Microkernel',
    desc: 'Sub-millisecond process scheduler with strict memory boundaries and real-time execution bounds.',
    icon: Cpu,
  },
  {
    layer: 'Layer 1',
    name: 'Unified Hardware Layer',
    desc: 'Direct hardware abstraction layer optimized for Apple Silicon, ARM64, x86-64, and RISC-V.',
    icon: Server,
  },
];

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="section-container">
      <div className="section-inner">
        {/* Header Block */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: easeCurve }}
        >
          <span className="section-eyebrow">05 — ARCHITECTURE</span>
          <h2 className="section-title">Designed from<br /><Highlight>the system up.</Highlight></h2>
          <p className="section-lead">
            A modular microkernel architecture engineered for <Highlight>maximum performance</Highlight>, security, and long-term hardware adaptability.
          </p>
        </motion.div>

        {/* Stacked Architecture Layers */}
        <div className="arch-stack-container">
          {archLayers.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.layer}
                className="arch-layer-card"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: easeCurve }}
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(244, 244, 246, 0.9)' }}
              >
                <div className="arch-left">
                  <span className="arch-layer-badge">{item.layer}</span>
                  <div className="arch-icon-box">
                    <IconComponent size={20} />
                  </div>
                </div>
                <div className="arch-center">
                  <h3 className="arch-name">{item.name}</h3>
                  <p className="arch-desc">{item.desc}</p>
                </div>
                <div className="arch-right">
                  <span className="arch-status">VERIFIED</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
