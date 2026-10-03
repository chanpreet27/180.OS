import React from 'react';

const marqueeItems = [
  'ADAPTIVE SYSTEMS',
  'CONTEXTUAL COMPUTING',
  'SPATIAL INTERFACE',
  'LOCAL INTELLIGENCE',
  'ZERO-LATENCY MICROKERNEL',
  'DISTRIBUTED FILE FABRIC',
  '180.OS',
];

export default function MarqueeStrip() {
  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
          <span key={index} className="marquee-item">
            <span>{item}</span>
            <span className="marquee-separator">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
