import React from 'react';

export default function Highlight({ children, className = '' }) {
  return <span className={`txt-highlight ${className}`}>{children}</span>;
}
