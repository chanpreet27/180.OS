import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MarqueeStrip from './components/MarqueeStrip';
import SystemSection from './components/SystemSection';
import LaptopScrollSequence from './components/LaptopScrollSequence';
import InterfaceSection from './components/InterfaceSection';
import IntelligenceSection from './components/IntelligenceSection';
import AdaptiveSection from './components/AdaptiveSection';
import ArchitectureSection from './components/ArchitectureSection';
import PhilosophySection from './components/PhilosophySection';
import StatusSection from './components/StatusSection';
import FinalCTASection from './components/FinalCTASection';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';

export default function App() {
  return (
    <div className="app-container">
      <CustomCursor />
      <Navbar />
      <ScrollProgress />
      <HeroSection />
      <MarqueeStrip />
      <SystemSection />
      <LaptopScrollSequence />
      <InterfaceSection />
      <IntelligenceSection />
      <AdaptiveSection />
      <ArchitectureSection />
      <PhilosophySection />
      <StatusSection />
      <FinalCTASection />
    </div>
  );
}
