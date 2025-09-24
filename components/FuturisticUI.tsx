"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// Futuristic Card Component
export function FuturisticCard({ 
  children, 
  className,
  glowColor = "blue",
  interactive = true 
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "green" | "pink" | "orange";
  interactive?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const glowColors = {
    blue: "shadow-blue-500/20",
    purple: "shadow-purple-500/20",
    green: "shadow-green-500/20",
    pink: "shadow-pink-500/20",
    orange: "shadow-orange-500/20",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50",
        interactive && "cursor-pointer transition-all duration-500 hover:scale-105 hover:rotate-1",
        isHovered && `shadow-2xl ${glowColors[glowColor]}`,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-500 blur-sm" 
           style={{ opacity: isHovered ? 1 : 0 }} />
      
      <div className="relative z-10 p-8">
        {children}
      </div>
    </div>
  );
}

// Holographic Button Component
export function HolographicButton({ 
  children, 
  className,
  onClick,
  variant = "primary"
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent";
}) {
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    primary: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
    secondary: "bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800",
    accent: "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500",
  };

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={cn(
        "relative overflow-hidden rounded-2xl font-bold text-white transition-all duration-300 transform",
        variants[variant],
        isPressed ? "scale-95" : "hover:scale-105",
        "hover:shadow-2xl hover:shadow-blue-500/25",
        className
      )}
    >
      {/* Holographic shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}

// Neural Network Background
export function NeuralNetwork({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Neural network nodes
    const nodes: Array<{ x: number; y: number; vx: number; vy: number; connections: number[] }> = [];
    const nodeCount = 50;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: []
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const distance = Math.sqrt((node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2);
            if (distance < 150) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 - distance / 500})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });

        // Draw nodes
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ zIndex: 1 }}
    />
  );
}

// Floating Elements Component
export function FloatingElements({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-blue-500 rounded-full animate-float opacity-60" />
      <div className="absolute top-40 right-32 w-6 h-6 bg-purple-500 rotate-45 animate-float animation-delay-1000 opacity-60" />
      <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-pink-500 rounded-full animate-float animation-delay-2000 opacity-60" />
      <div className="absolute bottom-20 right-20 w-5 h-5 bg-green-500 rotate-12 animate-float animation-delay-3000 opacity-60" />
      <div className="absolute top-1/2 left-10 w-4 h-4 bg-orange-500 rounded-full animate-float animation-delay-4000 opacity-60" />
      
      {/* Floating lines */}
      <div className="absolute top-1/3 left-1/3 w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse opacity-40" />
      <div className="absolute bottom-1/3 right-1/3 w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse animation-delay-1000 opacity-40" />
    </div>
  );
}

// Cyber Grid Background
export function CyberGrid({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 opacity-20", className)}>
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />
    </div>
  );
}

// Glitch Text Component
export function GlitchText({ 
  children, 
  className 
}: {
  children: string;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState(children);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setIsGlitching(true);
        setTimeout(() => {
          setDisplayText(children);
          setIsGlitching(false);
        }, 200);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [children]);

  const glitchText = () => {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    return children.split('').map(char => 
      char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  };

  return (
    <span className={cn("font-mono", className)}>
      {isGlitching ? glitchText() : displayText}
    </span>
  );
}

// Data Stream Component
export function DataStream({ className }: { className?: string }) {
  const [streams, setStreams] = useState<Array<{ id: number; text: string; speed: number }>>([]);

  useEffect(() => {
    const generateStream = () => {
      const chars = '01';
      const text = Array.from({ length: 20 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
      
      return {
        id: Date.now(),
        text,
        speed: Math.random() * 2 + 1
      };
    };

    const interval = setInterval(() => {
      setStreams(prev => {
        const newStreams = [...prev, generateStream()];
        return newStreams.slice(-5); // Keep only last 5 streams
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {streams.map((stream, index) => (
        <div
          key={stream.id}
          className="absolute text-green-400 font-mono text-xs opacity-60"
          style={{
            left: `${20 + index * 15}%`,
            top: `${20 + index * 10}%`,
            animation: `data-flow ${stream.speed}s linear infinite`
          }}
        >
          {stream.text}
        </div>
      ))}
    </div>
  );
}

// Holographic Progress Bar
export function HolographicProgress({ 
  progress, 
  className 
}: {
  progress: number;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full h-2 bg-slate-800 rounded-full overflow-hidden", className)}>
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

// Quantum Loading Spinner
export function QuantumSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animation-delay-1000" />
      <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-b-pink-500 rounded-full animate-spin animation-delay-2000" />
    </div>
  );
}

