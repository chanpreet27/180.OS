import React from 'react';
import { motion } from 'motion/react';
import Highlight from './Highlight';

const easeCurve = [0.16, 1, 0.3, 1];

export default function PhilosophySection() {
  return (
    <section id="philosophy" className="philosophy-section">
      <div className="philosophy-inner">
        {/* Minimal 180° Motion Symbol */}
        <motion.div
          className="philosophy-symbol"
          initial={{ opacity: 0, rotate: -45 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: easeCurve }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" stroke="#333333" strokeWidth="2" strokeDasharray="4 4" />
            <path
              d="M 32 2 A 30 30 0 0 1 32 62"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="32" cy="32" r="6" fill="#FFFFFF" />
          </svg>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="philosophy-headline"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: easeCurve }}
        >
          Sometimes,<br />the future starts<br />with turning <Highlight>180°.</Highlight>
        </motion.h2>

        {/* Supporting Copy */}
        <motion.p
          className="philosophy-lead"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.4, ease: easeCurve }}
        >
          180.OS is an experiment in what computing could become when we rethink the <Highlight>assumptions</Highlight> we’ve stopped questioning.
        </motion.p>
      </div>
    </section>
  );
}
