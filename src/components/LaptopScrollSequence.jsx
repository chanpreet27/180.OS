import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import Highlight from './Highlight';

const TOTAL_FRAMES = 240;
const easeCurve = [0.16, 1, 0.3, 1];

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

  // Physics & scroll tracking
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const isIntersectingRef = useRef(false);
  const sectionTopRef = useRef(0);
  const sectionHeightRef = useRef(1);

  // Direct DOM references for 120 FPS telemetry (ZERO React re-renders)
  const hingeSpanRef = useRef(null);
  const frameSpanRef = useRef(null);
  const mobileFrameSpanRef = useRef(null);

  // State only for discrete phase changes & initial load overlay
  const [isInitialReady, setIsInitialReady] = useState(false);
  const [imagesLoadedCount, setImagesLoadedCount] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const activePhaseRef = useRef(0);

  // Fast canvas drawing routine with nearest-loaded-frame fallback
  const drawFrame = useCallback((frameIndex) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    // 1. Try exact ImageBitmap (fastest zero-copy GPU blit)
    let source = bitmapsRef.current[frameIndex];

    // 2. Try exact HTMLImageElement
    if (!source) {
      const img = imagesRef.current[frameIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        source = img;
      }
    }

    // 3. Fallback to nearest loaded frame to eliminate any stutter/blank flash
    if (!source) {
      for (let offset = 1; offset < 25; offset++) {
        const prevIdx = frameIndex - offset;
        if (prevIdx >= 0) {
          if (bitmapsRef.current[prevIdx]) {
            source = bitmapsRef.current[prevIdx];
            break;
          }
          const pImg = imagesRef.current[prevIdx];
          if (pImg && pImg.complete && pImg.naturalWidth > 0) {
            source = pImg;
            break;
          }
        }
        const nextIdx = frameIndex + offset;
        if (nextIdx < TOTAL_FRAMES) {
          if (bitmapsRef.current[nextIdx]) {
            source = bitmapsRef.current[nextIdx];
            break;
          }
          const nImg = imagesRef.current[nextIdx];
          if (nImg && nImg.complete && nImg.naturalWidth > 0) {
            source = nImg;
            break;
          }
        }
      }
    }

    if (source) {
      ctx.drawImage(source, 0, 0, 1920, 1080);
    }
  }, []);

  // Initialize Canvas with performance-optimized attributes
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

  // High-throughput staged image loader with off-thread createImageBitmap
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;

    const loadSingleFrame = async (idx) => {
      if (isCancelled || bitmapsRef.current[idx]) return;
      const url = getFrameUrl(idx);

      // Attempt off-thread ImageBitmap decoding
      if (typeof window.createImageBitmap === 'function') {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          if (isCancelled) return;
          const bitmap = await window.createImageBitmap(blob);
          if (isCancelled) return;
          bitmapsRef.current[idx] = bitmap;
          loadedCount++;

          if (idx === 0 && renderedFrameRef.current === -1) {
            drawFrame(0);
            renderedFrameRef.current = 0;
          }
          if (loadedCount >= 15 && !isInitialReady) {
            setIsInitialReady(true);
          }
          if (loadedCount % 10 === 0 || loadedCount === TOTAL_FRAMES) {
            setImagesLoadedCount(loadedCount);
          }
          return;
        } catch {
          // fallback to HTMLImageElement
        }
      }

      // Fallback loader
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (isCancelled) return;
        imagesRef.current[idx] = img;
        loadedCount++;

        if (idx === 0 && renderedFrameRef.current === -1) {
          drawFrame(0);
          renderedFrameRef.current = 0;
        }
        if (loadedCount >= 15 && !isInitialReady) {
          setIsInitialReady(true);
        }
        if (loadedCount % 10 === 0 || loadedCount === TOTAL_FRAMES) {
          setImagesLoadedCount(loadedCount);
        }
      };
    };

    // Staged Priority Loading:
    // 1. Frame 0 immediately
    loadSingleFrame(0);

    // 2. Next 30 opening frames immediately
    const loadBatch = async (indices) => {
      const concurrency = 6;
      for (let i = 0; i < indices.length; i += concurrency) {
        if (isCancelled) break;
        const chunk = indices.slice(i, i + concurrency);
        await Promise.all(chunk.map((idx) => loadSingleFrame(idx)));
      }
    };

    const runStagedPipeline = async () => {
      // Stage 1: Opening frames 1..30
      const initialIndices = [];
      for (let i = 1; i <= 30; i++) initialIndices.push(i);
      await loadBatch(initialIndices);

      // Stage 2: Strategic keyframes across entire sequence (every 6th frame)
      const keyframeIndices = [];
      for (let i = 36; i < TOTAL_FRAMES; i += 6) keyframeIndices.push(i);
      await loadBatch(keyframeIndices);

      // Stage 3: All remaining intermediate frames
      const remainingIndices = [];
      for (let i = 31; i < TOTAL_FRAMES; i++) {
        if (i % 6 !== 0) remainingIndices.push(i);
      }
      await loadBatch(remainingIndices);
    };

    runStagedPipeline();

    return () => {
      isCancelled = true;
    };
  }, [drawFrame, isInitialReady]);

  // Measure section geometry for zero-reflow scroll tracking
  const measureSection = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    sectionTopRef.current = rect.top + scrollY;
    sectionHeightRef.current = Math.max(1, section.offsetHeight - window.innerHeight);
  }, []);

  // IntersectionObserver to pause loop and trigger measurements
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          measureSection();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(section);
    window.addEventListener('resize', measureSection, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measureSection);
    };
  }, [measureSection]);

  // Zero-reflow Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      if (!isIntersectingRef.current) return;
      const scrollY = window.scrollY || window.pageYOffset;
      const progress = Math.max(0, Math.min(1, (scrollY - sectionTopRef.current) / sectionHeightRef.current));
      targetProgressRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    measureSection();
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [measureSection]);

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

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Exponential decay smoothing: crisp, responsive, mathematically consistent at 60Hz and 120Hz
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.00005) {
        const decay = 22; // Snappy responsiveness with buttery fluid glide
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
  }, [drawFrame]);

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
