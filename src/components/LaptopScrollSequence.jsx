import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Highlight from './Highlight';

const TOTAL_FRAMES = 240;
const easeCurve = [0.16, 1, 0.3, 1];

const getFrameUrl = (index) => {
  const frameNum = String(index + 1).padStart(3, '0');
  return `/laptop-frames/ezgif-frame-${frameNum}.jpg`;
};

export default function LaptopScrollSequence() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const renderedFrameRef = useRef(-1);
  const animationFrameIdRef = useRef(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const isIntersectingRef = useRef(false);

  const [imagesLoadedCount, setImagesLoadedCount] = useState(0);
  const [isInitialReady, setIsInitialReady] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Preload sequence
  useEffect(() => {
    let isMounted = true;
    const images = new Array(TOTAL_FRAMES);
    let loadedCounter = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        if (!isMounted) return;
        loadedCounter++;
        setImagesLoadedCount(loadedCounter);

        if (img.decode) {
          img.decode().catch(() => {});
        }

        if (loadedCounter >= 20 && !isInitialReady) {
          setIsInitialReady(true);
        }
      };
      images[i] = img;
    }

    imagesRef.current = images;

    return () => {
      isMounted = false;
    };
  }, []);

  // Canvas Draw Routine
  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    if (canvas.width !== 1920) canvas.width = 1920;
    if (canvas.height !== 1080) canvas.height = 1080;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, 1920, 1080);
  };

  // IntersectionObserver to pause loop when section is off-screen
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersectingRef.current = entry.isIntersecting;
      },
      { rootMargin: '400px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Continuous interpolation & smooth requestAnimationFrame loop
  useEffect(() => {
    let active = true;

    const updateLoop = () => {
      if (!active) return;

      // Only perform drawing & interpolation when section is visible/nearby
      if (isIntersectingRef.current) {
        const diff = targetProgressRef.current - currentProgressRef.current;
        if (Math.abs(diff) > 0.0001) {
          currentProgressRef.current += diff * 0.15;
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
          setDisplayProgress(normProgress);
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(updateLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(updateLoop);

    return () => {
      active = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // Scroll Event Handler updating target progress
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !isIntersectingRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight - window.innerHeight;

      if (sectionHeight <= 0) return;

      const rawProgress = Math.max(0, Math.min(1, -rect.top / sectionHeight));
      targetProgressRef.current = rawProgress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isInitialReady]);

  // Initial draw when ready
  useEffect(() => {
    if (isInitialReady && renderedFrameRef.current === -1) {
      drawFrame(0);
      renderedFrameRef.current = 0;
    }
  }, [isInitialReady]);

  // Phase Typography with Selective Emphasis
  let phaseSubtitle = 'Computing should adapt to the moment.';
  let phaseTitleNode = (
    <>
      A computer<br />that opens with <Highlight>you.</Highlight>
    </>
  );

  if (displayProgress > 0.35 && displayProgress <= 0.75) {
    phaseSubtitle = 'Contextual spatial workspace.';
    phaseTitleNode = (
      <>
        Everything you need,<br />right where you need <Highlight>it.</Highlight>
      </>
    );
  } else if (displayProgress > 0.75) {
    phaseSubtitle = '180.OS Architecture Active.';
    phaseTitleNode = (
      <>
        Welcome to your<br /><Highlight>new desktop.</Highlight>
      </>
    );
  }

  const currentFrameNumber = Math.min(TOTAL_FRAMES, (renderedFrameRef.current < 0 ? 0 : renderedFrameRef.current) + 1);
  const progressPercent = Math.round(displayProgress * 100);

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
            key={progressPercent > 75 ? 'p3' : progressPercent > 35 ? 'p2' : 'p1'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeCurve }}
          >
            <span className="sequence-eyebrow">02 / EXPERIENCE</span>
            <h2 className="sequence-headline">{phaseTitleNode}</h2>
            <p className="sequence-lead">{phaseSubtitle}</p>
          </motion.div>
        </div>

        {/* Center Canvas */}
        <div className="laptop-canvas-wrapper">
          <canvas ref={canvasRef} className="laptop-frame-canvas" />
        </div>

        {/* Right Lower Technical Counter */}
        <div className="sequence-right-overlay desktop-only">
          <div className="sequence-tech-annotation">
            <span className="annotation-hinge">HINGE {progressPercent}%</span>
            <span className="annotation-frame">
              {String(currentFrameNumber).padStart(3, '0')} / {TOTAL_FRAMES}
            </span>
          </div>
        </div>

        {/* Mobile Plain Text Caption */}
        <div className="mobile-caption-plain mobile-only">
          <span className="sequence-eyebrow">02 / EXPERIENCE</span>
          <h2 className="sequence-headline-mobile">A computer that opens with <Highlight>you.</Highlight></h2>
          <span className="mobile-frame-tag">{String(currentFrameNumber).padStart(3, '0')} / {TOTAL_FRAMES}</span>
        </div>
      </div>
    </section>
  );
}
