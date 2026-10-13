import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import Highlight from './Highlight';

const TOTAL_FRAMES = 240;
const easeCurve = [0.16, 1, 0.3, 1];

// Generate 25 strategic anchor frames spanning the full 0% to 100% opening angle
const ANCHOR_INDICES = [];
for (let i = 0; i < TOTAL_FRAMES; i += 10) {
  ANCHOR_INDICES.push(i);
}
if (!ANCHOR_INDICES.includes(TOTAL_FRAMES - 1)) {
  ANCHOR_INDICES.push(TOTAL_FRAMES - 1);
}

const getFrameUrl = (index) => {
  const frameNum = String(index + 1).padStart(3, '0');
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}laptop-frames/ezgif-frame-${frameNum}.jpg`;
};

export default function LaptopScrollSequence() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  // High performance frame buffers
  const bitmapsRef = useRef(new Array(TOTAL_FRAMES).fill(null));
  const imagesRef = useRef(new Array(TOTAL_FRAMES).fill(null));
  const renderedFrameRef = useRef(-1);
  const animationFrameIdRef = useRef(null);

  // Scroll & physics tracking
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const isIntersectingRef = useRef(true); // Default true so initial measurements and rendering never get blocked

  // Direct DOM references for 120 FPS telemetry (ZERO React re-renders)
  const hingeSpanRef = useRef(null);
  const frameSpanRef = useRef(null);
  const mobileFrameSpanRef = useRef(null);

  // Discrete phase state & loading status
  const [isInitialReady, setIsInitialReady] = useState(false);
  const [imagesLoadedCount, setImagesLoadedCount] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const activePhaseRef = useRef(0);

  // Find nearest loaded frame across the entire sequence so animation NEVER freezes
  const findNearestLoadedFrame = useCallback((target) => {
    // 1. Direct hit
    if (bitmapsRef.current[target] || (imagesRef.current[target]?.complete && imagesRef.current[target].naturalWidth > 0)) {
      return target;
    }

    // 2. Search outward symmetrically across all 240 frames
    let bestIdx = -1;
    let minDistance = Infinity;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const hasFrame = bitmapsRef.current[i] || (imagesRef.current[i]?.complete && imagesRef.current[i].naturalWidth > 0);
      if (hasFrame) {
        const dist = Math.abs(i - target);
        if (dist < minDistance) {
          minDistance = dist;
          bestIdx = i;
          if (dist <= 1) break; // Close enough to break early
        }
      }
    }

    return bestIdx;
  }, []);

  // Fast canvas drawing routine
  const drawFrame = useCallback((frameIndex) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const chosenIdx = findNearestLoadedFrame(frameIndex);
    if (chosenIdx === -1) return;

    const source = bitmapsRef.current[chosenIdx] || imagesRef.current[chosenIdx];
    if (source) {
      ctx.drawImage(source, 0, 0, 1920, 1080);
    }
  }, [findNearestLoadedFrame]);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });

    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      ctxRef.current = ctx;
    }
  }, []);

  // Adaptive Priority Image Loader
  useEffect(() => {
    let isCancelled = false;
    let totalLoaded = 0;
    const loadingSet = new Set();

    const loadSingleFrame = async (idx) => {
      if (isCancelled || idx < 0 || idx >= TOTAL_FRAMES) return;
      if (bitmapsRef.current[idx] || (imagesRef.current[idx] && imagesRef.current[idx].complete)) return;
      if (loadingSet.has(idx)) return;

      loadingSet.add(idx);
      const url = getFrameUrl(idx);

      // Off-thread ImageBitmap decode
      if (typeof window.createImageBitmap === 'function') {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          if (isCancelled) return;
          const bmp = await window.createImageBitmap(blob);
          if (isCancelled) return;

          bitmapsRef.current[idx] = bmp;
          totalLoaded++;

          if (idx === 0 && renderedFrameRef.current === -1) {
            drawFrame(0);
            renderedFrameRef.current = 0;
          }

          if (!isInitialReady && (totalLoaded >= 15 || idx === ANCHOR_INDICES[ANCHOR_INDICES.length - 1])) {
            setIsInitialReady(true);
          }

          if (totalLoaded % 12 === 0 || totalLoaded === TOTAL_FRAMES) {
            setImagesLoadedCount(totalLoaded);
          }
          return;
        } catch {
          // Fall back to Image() below
        }
      }

      // Fallback HTMLImageElement
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (isCancelled) return;
        imagesRef.current[idx] = img;
        totalLoaded++;

        if (idx === 0 && renderedFrameRef.current === -1) {
          drawFrame(0);
          renderedFrameRef.current = 0;
        }

        if (!isInitialReady && (totalLoaded >= 15 || idx === ANCHOR_INDICES[ANCHOR_INDICES.length - 1])) {
          setIsInitialReady(true);
        }

        if (totalLoaded % 12 === 0 || totalLoaded === TOTAL_FRAMES) {
          setImagesLoadedCount(totalLoaded);
        }
      };
    };

    // 1. Immediately load frame 0 (poster frame: closed laptop)
    loadSingleFrame(0);

    // 2. Schedule anchor frames after 150ms to keep initial page mount & hero video completely lag-free
    const timer = setTimeout(async () => {
      if (isCancelled) return;

      // Load all 25 Anchor frames first (covers 0% through 100% of the entire animation!)
      for (let i = 0; i < ANCHOR_INDICES.length; i += 4) {
        if (isCancelled) break;
        const chunk = ANCHOR_INDICES.slice(i, i + 4);
        await Promise.all(chunk.map((idx) => loadSingleFrame(idx)));
      }

      setIsInitialReady(true);

      // 3. Progressive background fill of all intermediate frames
      const fillRemaining = async () => {
        const remaining = [];
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          if (!ANCHOR_INDICES.includes(i)) remaining.push(i);
        }

        // Fill in chunks of 4 concurrent requests to preserve network fluidness
        for (let i = 0; i < remaining.length; i += 4) {
          if (isCancelled) break;

          // Dynamically prioritize frames around user's current scroll target
          const currentTargetFrame = Math.round(targetProgressRef.current * (TOTAL_FRAMES - 1));
          for (let p = Math.max(0, currentTargetFrame - 4); p <= Math.min(TOTAL_FRAMES - 1, currentTargetFrame + 8); p++) {
            if (!bitmapsRef.current[p] && !imagesRef.current[p]) {
              loadSingleFrame(p);
            }
          }

          const chunk = remaining.slice(i, i + 4);
          await Promise.all(chunk.map((idx) => loadSingleFrame(idx)));
        }
      };

      fillRemaining();
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [drawFrame, isInitialReady]);

  // Robust live scroll calculation directly from section bounding rect
  const updateScrollProgress = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const totalScroll = section.offsetHeight - window.innerHeight;
    if (totalScroll <= 0) return;

    // Direct physical position:
    // When section top reaches viewport top (rect.top <= 0), animation begins
    // When section has scrolled through its sticky height (rect.top <= -totalScroll), animation is complete
    let p = 0;
    if (rect.top >= 0) {
      p = 0;
    } else if (rect.top <= -totalScroll) {
      p = 1;
    } else {
      p = -rect.top / totalScroll;
    }

    targetProgressRef.current = Math.max(0, Math.min(1, p));
  }, []);

  // IntersectionObserver to sleep RAF loop when far away
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          updateScrollProgress();
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [updateScrollProgress]);

  // Scroll and Resize listeners
  useEffect(() => {
    const handleScroll = () => {
      updateScrollProgress();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateScrollProgress]);

  // Delta-time normalized 120 FPS animation & interpolation loop
  useEffect(() => {
    let active = true;
    let lastTime = performance.now();

    const updateLoop = (now) => {
      if (!active) return;
      animationFrameIdRef.current = requestAnimationFrame(updateLoop);

      if (!isIntersectingRef.current) {
        lastTime = now;
        return;
      }

      // Check live scroll progress in sync with animation frame
      updateScrollProgress();

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Snappy physics: smooth exponential decay dampening
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.00005) {
        const decay = 24; // Ultra-crisp response, zero rubber-band delay
        const factor = 1 - Math.exp(-decay * dt);
        currentProgressRef.current += diff * factor;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const normProgress = Math.max(0, Math.min(1, currentProgressRef.current));
      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(normProgress * (TOTAL_FRAMES - 1)))
      );

      if (targetFrame !== renderedFrameRef.current) {
        renderedFrameRef.current = targetFrame;
        drawFrame(targetFrame);

        // Update technical text overlays directly via DOM textNodes (0ms overhead, no React re-render)
        const progressPct = Math.round(normProgress * 100);
        const frameNumStr = String(targetFrame + 1).padStart(3, '0');

        if (hingeSpanRef.current) {
          hingeSpanRef.current.textContent = `HINGE ${progressPct}%`;
        }
        if (frameSpanRef.current) {
          frameSpanRef.current.textContent = `${frameNumStr} / ${TOTAL_FRAMES}`;
        }
        if (mobileFrameSpanRef.current) {
          mobileFrameSpanRef.current.textContent = `${frameNumStr} / ${TOTAL_FRAMES}`;
        }

        // Discrete phase check: only trigger React re-render when crossing boundaries
        let nextPhase = 0;
        if (normProgress > 0.75) nextPhase = 2;
        else if (normProgress > 0.35) nextPhase = 1;

        if (nextPhase !== activePhaseRef.current) {
          activePhaseRef.current = nextPhase;
          setPhaseIndex(nextPhase);
        }
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(updateLoop);

    return () => {
      active = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [drawFrame, updateScrollProgress]);

  // Phase Typography Data
  const phaseContent = [
    {
      subtitle: 'Computing should adapt to the moment.',
      title: (
        <>
          A computer<br />that opens with <Highlight>you.</Highlight>
        </>
      ),
    },
    {
      subtitle: 'Contextual spatial workspace.',
      title: (
        <>
          Everything you need,<br />right where you need <Highlight>it.</Highlight>
        </>
      ),
    },
    {
      subtitle: '180.OS Architecture Active.',
      title: (
        <>
          Welcome to your<br /><Highlight>new desktop.</Highlight>
        </>
      ),
    },
  ];

  const currentPhase = phaseContent[phaseIndex] || phaseContent[0];

  return (
    <section ref={sectionRef} id="experience" className="laptop-sequence-section">
      <div className="laptop-sticky-viewport">
        {/* Loading Overlay */}
        {!isInitialReady && (
          <div className="laptop-loading-box">
            <span className="loading-tag">180.OS HARDWARE SEQUENCE</span>
            <div className="loading-progress-bar">
              <div
                className="loading-bar-fill"
                style={{ width: `${Math.round((imagesLoadedCount / TOTAL_FRAMES) * 100)}%` }}
              />
            </div>
            <span className="loading-count">
              PRELOADING {String(imagesLoadedCount).padStart(3, '0')} / {TOTAL_FRAMES}
            </span>
          </div>
        )}

        {/* Left Side Editorial Content */}
        <div className="sequence-left-overlay desktop-only">
          <motion.div
            key={`phase-${phaseIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeCurve }}
          >
            <span className="sequence-eyebrow">02 / EXPERIENCE</span>
            <h2 className="sequence-headline">{currentPhase.title}</h2>
            <p className="sequence-lead">{currentPhase.subtitle}</p>
          </motion.div>
        </div>

        {/* Center Canvas */}
        <div className="laptop-canvas-wrapper">
          <canvas ref={canvasRef} className="laptop-frame-canvas" />
        </div>

        {/* Right Lower Technical Counter */}
        <div className="sequence-right-overlay desktop-only">
          <div className="sequence-tech-annotation">
            <span ref={hingeSpanRef} className="annotation-hinge">HINGE 0%</span>
            <span ref={frameSpanRef} className="annotation-frame">
              001 / {TOTAL_FRAMES}
            </span>
          </div>
        </div>

        {/* Mobile Plain Text Caption */}
        <div className="mobile-caption-plain mobile-only">
          <span className="sequence-eyebrow">02 / EXPERIENCE</span>
          <h2 className="sequence-headline-mobile">A computer that opens with <Highlight>you.</Highlight></h2>
          <span ref={mobileFrameSpanRef} className="mobile-frame-tag">001 / {TOTAL_FRAMES}</span>
        </div>
      </div>
    </section>
  );
}
