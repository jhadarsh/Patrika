/**
 * FIXED Landing.jsx - No footer overlap, clean structure
 */

import { useState, useEffect } from 'react';

export default function Landing({ onLaunch }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const fullText = 'Automating RFPs with Intelligent Agents…';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mouse movement tracking
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  // Typewriter effect
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(fullText);
      setIsTypingComplete(true);
      return;
    }

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
        setTimeout(() => setShowCursor(false), 3000);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, [prefersReducedMotion]);

  // Cursor blinking
  useEffect(() => {
    if (isTypingComplete) return;

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [isTypingComplete]);


  const handleLaunch = () => {
    if (onLaunch) onLaunch();
    else window.location.href = "/dashboard";
  };


  return (
    <>
      {/* PAGE WRAPPER — FIXED STRUCTURE */}
      <div className="relative bg-white text-black min-h-screen flex flex-col font-roboto antialiased overflow-hidden">

        {/* BACKGROUND LAYERS */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          
          {/* Mouse-follow gradient */}
          <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
            }}
          />

          {/* Second gradient */}
          <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.1), transparent 50%)`
            }}
          />

          {/* Floating Orbs */}
          <div className="absolute top-0 -right-40 w-96 h-96 bg-gradient-to-br from-blue-100/40 via-purple-50/30 to-transparent rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-100/40 via-blue-50/30 to-transparent rounded-full blur-3xl animate-float-slower" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-slate-50/20 via-gray-100/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />

          {/* Subtle Grid */}
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(to right, black 1px, transparent 1px),
                                linear-gradient(to bottom, black 1px, transparent 1px)`,
              backgroundSize: "60px 60px"
            }}
          />
        </div>


        {/* HERO SECTION */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10 text-center">
          
          {/* Small Accent Tag */}
          <div className="relative inline-block mb-4">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-full blur-xl animate-pulse-slow" />
            <div className="relative px-5 py-2 bg-white/80 backdrop-blur-sm border border-black/5 rounded-full text-sm font-medium text-black/60 shadow-sm">
              ✨ Intelligent Automation
            </div>
          </div>

          {/* Typewriter Title */}
          <h1
            className="font-satoshi text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mx-auto max-w-4xl"
            aria-live="polite"
          >
            {displayText}
            <span 
              className={`inline-block w-1 h-12 bg-black ml-1 align-middle ${
                showCursor ? "opacity-100" : "opacity-0"
              }`}
            />
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-black/70 max-w-2xl mx-auto font-medium">
            Autonomous pipeline: <strong>Fetch → Match → Price</strong>
          </p>

          {/* CTA BUTTON */}
          <button
            onClick={handleLaunch}
            className="mt-10 px-10 py-4 bg-black text-white rounded-full font-satoshi text-lg shadow-xl hover:scale-105 transition-all"
          >
            Launch the System
          </button>

        </main>
      </div>


      {/* FIXED ANIMATIONS & STYLES */}
      <style jsx>{`
        @keyframes float-slow { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }
        @keyframes float-slower { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,20px)} }
        @keyframes pulse-slow { 0%,100%{opacity:.3} 50%{opacity:.6} }
        .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 20s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
      `}</style>
    </>
  );
}
