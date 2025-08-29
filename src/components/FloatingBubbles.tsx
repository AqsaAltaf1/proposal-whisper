import { useEffect, useState, useCallback } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

interface InteractiveBubble {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
}

const FloatingBubbles = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [interactiveBubbles, setInteractiveBubbles] = useState<InteractiveBubble[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle mouse movement for interactive bubbles
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ 
      x: (e.clientX / window.innerWidth) * 100, 
      y: (e.clientY / window.innerHeight) * 100 
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Update interactive bubbles based on mouse position
  useEffect(() => {
    setInteractiveBubbles(prev => 
      prev.map(bubble => ({
        ...bubble,
        targetX: mousePosition.x + (Math.random() - 0.5) * 20,
        targetY: mousePosition.y + (Math.random() - 0.5) * 20,
      }))
    );
  }, [mousePosition]);

  useEffect(() => {
    const colors = [
      'rgba(59, 130, 246, 0.1)',   // Blue
      'rgba(147, 51, 234, 0.08)',  // Purple
      'rgba(16, 185, 129, 0.06)',  // Green
      'rgba(245, 101, 101, 0.05)', // Red
      'rgba(251, 191, 36, 0.07)',  // Yellow
      'rgba(139, 92, 246, 0.06)',  // Violet
      'rgba(59, 130, 246, 0.04)',  // Light Blue
      'rgba(236, 72, 153, 0.05)',  // Pink
    ];

    const generateBubbles = () => {
      const newBubbles: Bubble[] = [];
      const bubbleCount = 12; // Number of bubbles

      for (let i = 0; i < bubbleCount; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 100, // Random x position (0-100%)
          y: Math.random() * 100, // Random y position (0-100%)
          size: Math.random() * 120 + 40, // Random size (40-160px)
          duration: Math.random() * 20 + 15, // Random duration (15-35s)
          delay: Math.random() * 10, // Random delay (0-10s)
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.6 + 0.2, // Random opacity (0.2-0.8)
        });
      }

      setBubbles(newBubbles);
    };

    generateBubbles();

    // Generate interactive bubbles
    const generateInteractiveBubbles = () => {
      const newInteractiveBubbles: InteractiveBubble[] = [];
      for (let i = 0; i < 6; i++) {
        newInteractiveBubbles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          targetX: Math.random() * 100,
          targetY: Math.random() * 100,
          size: Math.random() * 60 + 20,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setInteractiveBubbles(newInteractiveBubbles);
    };

    generateInteractiveBubbles();

    // Regenerate bubbles periodically for variety
    const interval = setInterval(generateBubbles, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: `radial-gradient(circle at 30% 30%, ${bubble.color.replace('0.', '0.15')}, ${bubble.color})`,
            backdropFilter: 'blur(1px)',
            border: `1px solid ${bubble.color.replace(/[\d.]+\)/, '0.2)')}`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
            transform: 'translate(-50%, -50%)',
            opacity: bubble.opacity,
          }}
        />
      ))}
      
      {/* Interactive bubbles that follow mouse */}
      {interactiveBubbles.map((bubble) => (
        <div
          key={`interactive-${bubble.id}`}
          className="absolute rounded-full transition-all duration-1000 ease-out"
          style={{
            left: `${bubble.targetX}%`,
            top: `${bubble.targetY}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: `radial-gradient(circle at 20% 20%, ${bubble.color.replace(/[\d.]+\)/, '0.25)')}, ${bubble.color})`,
            backdropFilter: 'blur(3px)',
            border: `1px solid ${bubble.color.replace(/[\d.]+\)/, '0.3)')}`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.6,
            boxShadow: `0 0 20px ${bubble.color.replace(/[\d.]+\)/, '0.15)')}`,
          }}
        />
      ))}
      
      {/* Additional smaller bubbles for more depth */}
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={`small-${index}`}
          className="absolute rounded-full animate-float-slow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 30 + 10}px`,
            height: `${Math.random() * 30 + 10}px`,
            background: `radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05))`,
            backdropFilter: 'blur(2px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animationDuration: `${Math.random() * 25 + 20}s`,
            animationDelay: `${Math.random() * 15}s`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};

export default FloatingBubbles;
