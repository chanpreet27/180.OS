import React from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import Highlight from './Highlight';

const easeCurve = [0.16, 1, 0.3, 1];

const statusRows = [
  { module: 'Architecture', state: 'Active', badge: 'v2.4.0', statusClass: 'status-green' },
  { module: 'Interface', state: 'Evolving', badge: '120Hz Spatial', statusClass: 'status-green' },
  { module: 'Intelligence', state: 'Integrated', badge: 'On-Device Tensor', statusClass: 'status-green' },
  { module: 'Microkernel', state: '0.4ms Latency', badge: 'Zero Overhead', statusClass: 'status-green' },
  { module: 'Security Isolation', state: 'Verified', badge: 'Local Encryption', statusClass: 'status-green' },
  { module: 'Development', state: 'Ongoing', badge: 'Public Alpha 2026', statusClass: 'status-dim' },
];

export default function StatusSection() {
  return (
    <section id="status" className="section-container">
      <div className="section-inner">
        {/* Header Block */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: easeCurve }}
        >
          <span className="section-eyebrow">SYSTEM STATUS</span>
          <h2 className="section-title">Operational <Highlight>Telemetry</Highlight></h2>
          <p className="section-lead">
            Real-time status metrics across 180.OS <Highlight>core modules</Highlight> and architectural subsystems.
          </p>
        </motion.div>

        {/* Status Console Box */}
        <motion.div
          className="status-console-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: easeCurve }}
        >
          <div className="console-header">
            <div className="console-title-group">
              <Activity size={16} />
              <span>180.OS TELEMETRY CONSOLE</span>
            </div>
            <div className="console-live-tag">
              <span className="live-dot" />
              <span>ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>

          <div className="console-table">
            {statusRows.map((row) => (
              <div key={row.module} className="console-row">
                <div className="row-module">
                  <span className="row-module-name">{row.module}</span>
                </div>
                <div className="row-badge">
                  <span className="badge-pill">{row.badge}</span>
                </div>
                <div className="row-state">
                  <span className={`state-indicator ${row.statusClass}`} />
                  <span className="state-text">{row.state}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="console-footer-info">
            <span>Kernel Digest: sha256:180os-2026-b94a</span>
            <span>Target Platform: ARM64 / RISC-V / x86_64</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
