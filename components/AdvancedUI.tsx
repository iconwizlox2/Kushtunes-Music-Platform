"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// Particle System Component
export function ParticleSystem({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
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

    // Create particles
    const createParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    createParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
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

// Glassmorphism Card Component
export function GlassCard({ 
  children, 
  className, 
  intensity = "medium" 
}: { 
  children: React.ReactNode; 
  className?: string;
  intensity?: "low" | "medium" | "high";
}) {
  const intensityClasses = {
    low: "bg-white/10 backdrop-blur-sm border-white/20",
    medium: "bg-white/20 backdrop-blur-md border-white/30",
    high: "bg-white/30 backdrop-blur-lg border-white/40",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border shadow-xl",
        intensityClasses[intensity],
        className
      )}
    >
      {children}
    </div>
  );
}

// Animated Gradient Background
export function AnimatedGradient({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -inset-10 opacity-50">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}

// Interactive Button with Ripple Effect
export function RippleButton({ 
  children, 
  className, 
  onClick,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any;
}) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);

    onClick?.(e);
  };

  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none rounded-full bg-white/30 animate-ripple"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
    </button>
  );
}

// Floating Action Button
export function FloatingActionButton({ 
  children, 
  className, 
  onClick 
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center",
        className
      )}
    >
      {children}
    </button>
  );
}

// Progress Ring Component
export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  className 
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-500 transition-all duration-300 ease-in-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

// Morphing Shape Component
export function MorphingShape({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
      <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-pulse animation-delay-1000"></div>
      <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse animation-delay-2000"></div>
    </div>
  );
}

// Interactive Card with Hover Effects
export function InteractiveCard({ 
  children, 
  className,
  onClick 
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 cursor-pointer transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:shadow-2xl",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Animated Text Component
export function AnimatedText({ 
  text, 
  className,
  delay = 0 
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, delay + currentIndex * 50);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay]);

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

