'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function FadeIn({ children, className = "", delay = 0, ...props }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all duration-300 hover:scale-110 active:scale-95 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}

function Typewriter({ text, speed = 50, className, onComplete }) {
  const [displayText, setDisplayText] = useState('');
  const index = useRef(0);
  const completed = useRef(false);

  useEffect(() => {
    if (completed.current) return;

    const timer = setInterval(() => {
      if (index.current < text.length) {
        setDisplayText((prev) => prev + text.charAt(index.current));
        index.current++;
      } else {
        clearInterval(timer);
        completed.current = true;
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return <span className={className}>{displayText}</span>;
}

function ProjectCard({ project }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { width, height } = rect;
    const rotateX = (y / height - 0.5) * -20; // max rotation
    const rotateY = (x / width - 0.5) * 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
  };

  return (
    <a
      ref={cardRef}
      href={project.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:bg-slate-900 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-slate-800/50 rounded-xl group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors text-slate-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
        </div>
        <span className="text-xs font-mono text-slate-600 group-hover:text-slate-500 transition-colors">{new Date(project.created_at).getFullYear()}</span>
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-indigo-400 transition-colors">{project.name}</h3>
      <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-grow">{project.description || "No description available."}</p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50 group-hover:border-slate-800 transition-colors">
        <span className="text-xs font-medium text-slate-500 bg-slate-800/50 px-2 py-1 rounded">{project.language || 'Code'}</span>
        <span className="text-sm font-medium text-slate-500 group-hover:text-indigo-400 transition-colors flex items-center gap-1">View <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span>
      </div>
    </a>
  );
}

function AnimatedSquares() {
  const [squares, setSquares] = useState([]);

  useEffect(() => {
    const generateSquares = () => {
      const gridSize = 24; // Matches the bg-[size:24px_24px] of the grid
      const cols = Math.ceil(window.innerWidth / gridSize);
      const rows = Math.ceil(window.innerHeight / gridSize);
      const numSquares = 8; // Number of squares to animate

      return Array.from({ length: numSquares }).map((_, i) => ({
        id: i,
        x: Math.floor(Math.random() * cols) * gridSize,
        y: Math.floor(Math.random() * rows) * gridSize,
        duration: Math.random() * 2 + 2, // Random duration between 2-4s
        delay: Math.random() * 4, // Random delay
        moveX: (Math.random() - 0.5) * 40,
        moveY: (Math.random() - 0.5) * 40,
      }));
    };

    setSquares(generateSquares());

    const handleResize = () => setSquares(generateSquares());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes square-move-fade {
          0% { opacity: 0; transform: translate(0, 0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--move-x), var(--move-y)); }
        }
      `}</style>
      {squares.map((sq) => (
        <div
          key={sq.id}
          className="absolute bg-indigo-500/20 border border-indigo-500/30"
          style={{
            width: '24px',
            height: '24px',
            left: `${sq.x}px`,
            top: `${sq.y}px`,
            opacity: 0,
            '--move-x': `${sq.moveX}px`,
            '--move-y': `${sq.moveY}px`,
            animation: `square-move-fade ${sq.duration}s ease-in-out infinite ${sq.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function Background() {
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const blob3Ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (blob1Ref.current) {
        blob1Ref.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.transform = `translateY(${scrollY * -0.15}px)`;
      }
      if (blob3Ref.current) {
        // Maintain horizontal centering (-50%) while adding vertical parallax
        blob3Ref.current.style.transform = `translate(-50%, ${scrollY * 0.1}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-950">
      <div ref={blob1Ref} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
      <div ref={blob2Ref} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px] animate-pulse" style={{animationDelay: '2s'}} />
      <div ref={blob3Ref} className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] rounded-full bg-cyan-600/5 blur-[100px]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Animated Squares */}
      <AnimatedSquares />
    </div>
  );
}

function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight) {
        setScrollProgress((currentScroll / scrollHeight) * 100);
      }
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60]">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

function TimelineItem({ year, title, subtitle, description }) {
  return (
    <div className="relative pl-8 sm:pl-32 py-6 group">
      <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-800 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-900 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
        <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-indigo-400 bg-indigo-900/30 rounded-full">{year}</time>
        <div className="text-xl font-bold text-slate-200">{title}</div>
      </div>
      <div className="text-slate-400 font-medium">{subtitle}</div>
      <p className="mt-2 text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

function SkillBadge({ name }) {
  const getIcon = (skillName) => {
    const className = "w-5 h-5 shrink-0";
    switch (skillName) {
      case 'JavaScript':
        return <svg className={className} viewBox="0 0 24 24" fill="#F7DF1E"><rect width="24" height="24" rx="4"/><path d="M6 16v-5h2v4h2v-4h2v5a1 1 0 01-1 1H7a1 1 0 01-1-1zm9 0v-2a2 2 0 012-2h2v2h-2v1h2v2h-3a1 1 0 01-1-1z" fill="#000" opacity="0.8"/></svg>;
      case 'TypeScript':
        return <svg className={className} viewBox="0 0 24 24" fill="#3178C6"><rect width="24" height="24" rx="4"/><path d="M6 8h6v2H9v8H7v-8H4V8zm9 0h4v2h-3v2h2v2h-2v4h-2v-4h-1v-2h1v-2z" fill="#FFF"/></svg>;
      case 'React':
        return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="2"><circle cx="12" cy="12" r="2" fill="#61DAFB"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>;
      case 'Next.js':
        return <svg className={className} viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.6 15.6l-6.4-8.4V15H9V8h1.2l6.4 8.4V9H18v8h-1.4z"/></svg>;
      case 'Node.js':
        return <svg className={className} viewBox="0 0 24 24" fill="#339933"><path d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2L5 8v8l7 4 7-4V8l-7-4z"/></svg>;
      case 'Express':
        return <svg className={className} viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>;
      case 'Tailwind CSS':
        return <svg className={className} viewBox="0 0 24 24" fill="#38B2AC"><path d="M12.5 6.5c-1.5 0-3 .5-4 1.5-1.5 1.5-1.5 3.5 0 5 1 1 2.5 1.5 4 1.5 1.5 0 3-.5 4-1.5 1.5-1.5 1.5-3.5 0-5-1-1-2.5-1.5-4-1.5zM6.5 12.5c-1.5 0-3 .5-4 1.5-1.5 1.5-1.5 3.5 0 5 1 1 2.5 1.5 4 1.5 1.5 0 3-.5 4-1.5 1.5-1.5 1.5-3.5 0-5-1-1-2.5-1.5-4-1.5z"/></svg>;
      case 'Python':
        return <svg className={className} viewBox="0 0 24 24" fill="#3776AB"><path d="M12 2c-2 0-4 1-4 3v2h5v2H5v7h2v-5h10v5h2V9c0-2-2-3-4-3V4c0-1-1-2-3-2zm-2 1c.5 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1zm4 18c2 0 4-1 4-3v-2h-5v-2h8v-7h-2v5H9v-5H7v7c0 2 2 3 4 3v2c0 1 1 2 3 2zm2-1c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1z"/></svg>;
      case 'Git & GitHub':
        return <svg className={className} viewBox="0 0 24 24" fill="#F05032"><path d="M12 2L2 12l10 10 10-10L12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-7c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"/></svg>;
      case 'MongoDB':
        return <svg className={className} viewBox="0 0 24 24" fill="#47A248"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v10h-2z"/></svg>;
      case 'PostgreSQL':
        return <svg className={className} viewBox="0 0 24 24" fill="#336791"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5h4v2h-4zm0-4h4v2h-4zm0-4h4v2h-4z"/></svg>;
      case 'Docker':
        return <svg className={className} viewBox="0 0 24 24" fill="#2496ED"><path d="M4 10h2v2H4zm3 0h2v2H7zm3 0h2v2h-2zm3 0h2v2h-2zm-9 3h2v2H4zm3 0h2v2H7zm3 0h2v2h-2zm3 0h2v2h-2zM2 15h1v-1H2v1zm19-2h-1v-1h1v1zm-1 2h1v1h-1v-1z"/></svg>;
      case 'Figma':
        return <svg className={className} viewBox="0 0 24 24" fill="#F24E1E"><path d="M12 2a4 4 0 00-4 4 4 4 0 004 4 4 4 0 004-4 4 4 0 00-4-4zm0 8a4 4 0 00-4 4 4 4 0 004 4v-8zm-4 0a4 4 0 000 8 4 4 0 000-8zm0 8a4 4 0 000 8 4 4 0 004-4v-4H8z"/></svg>;
      case 'Cyber Security':
        return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
      case 'Network Security':
        return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
      default:
        return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
    }
  };

  return (
    <span className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-slate-800 transition-all cursor-default shadow-sm hover:shadow-indigo-500/10 whitespace-nowrap">
      {getIcon(name)}
      {name}
    </span>
  );
}

function CarRoadAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gray-900 rounded-xl flex items-center pointer-events-none">
      <style>{`
        @keyframes moveRoad {
          from { transform: translateX(0); }
          to { transform: translateX(-40px); }
        }
        @keyframes driveCar {
          0% { left: -100px; }
          100% { left: 120%; }
        }
      `}</style>
      
      {/* Road Markings */}
      <div className="absolute top-1/2 left-0 w-[200%] h-0.5 flex items-center" style={{ animation: 'moveRoad 0.3s linear infinite' }}>
         {Array.from({ length: 20 }).map((_, i) => (
             <div key={i} className="w-8 h-0.5 bg-white/40 mr-8 shrink-0" />
         ))}
      </div>

      {/* Car Container */}
      <div className="absolute top-1/2 -mt-[15px]" style={{ animation: 'driveCar 2s ease-in-out forwards' }}>
        
        {/* Headlight Beams */}
        <div className="absolute left-[50px] top-1/2 -translate-y-1/2 w-32 h-40 pointer-events-none opacity-80">
             <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-20 bg-gradient-to-r from-yellow-300/40 to-transparent" style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)' }}></div>
        </div>

        {/* Car SVG (Top View) */}
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            {/* Wheels */}
            <rect x="8" y="0" width="12" height="4" rx="1" fill="#1e293b"/>
            <rect x="40" y="0" width="12" height="4" rx="1" fill="#1e293b"/>
            <rect x="8" y="26" width="12" height="4" rx="1" fill="#1e293b"/>
            <rect x="40" y="26" width="12" height="4" rx="1" fill="#1e293b"/>
            
            {/* Body */}
            <path d="M4 4H56C57.1046 4 58 4.89543 58 6V24C58 25.1046 57.1046 26 56 26H4C2.89543 26 2 25.1046 2 24V6C2 4.89543 2.89543 4 4 4Z" fill="#FACC15"/>
            
            {/* Windshields */}
            <path d="M42 6L46 6L46 24L42 24L40 24L40 6Z" fill="#0f172a"/>
            <path d="M14 6L18 6L18 24L14 24L16 24L16 6Z" fill="#0f172a"/>
            
            {/* Roof */}
            <rect x="18" y="5" width="22" height="20" fill="#FDE047"/>
            
            {/* Headlights */}
            <rect x="56" y="5" width="2" height="6" fill="#FEF08A"/>
            <rect x="56" y="19" width="2" height="6" fill="#FEF08A"/>
            
            {/* Taillights */}
            <rect x="2" y="5" width="2" height="6" fill="#EF4444"/>
            <rect x="2" y="19" width="2" height="6" fill="#EF4444"/>
        </svg>
      </div>
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroStep, setHeroStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('hasRefreshed');
    if (!hasRefreshed) {
      setTimeout(() => {
        sessionStorage.setItem('hasRefreshed', 'true');
        window.location.reload();
      }, 1000);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      // Send data to API and wait for at least 2 seconds for animation
      const [response] = await Promise.all([
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);

      if (response.ok) {
        setIsSending(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error(error);
      setIsSending(false);
      alert('Failed to send message. Please try again.');
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://api.github.com/users/dbaidya811-beep/repos?sort=updated&per_page=6');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 relative">
      <ScrollProgress />
      {/* Dynamic Background */}
      <Background />

      {/* Floating Navbar */}
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[90%] max-w-3xl">
        <div className="backdrop-blur-xl bg-slate-900/70 border border-slate-800/50 rounded-full px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between shadow-xl shadow-black/20">
            <span className="font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">DB.</span>
            
            {/* Desktop Menu */}
            <div className="hidden sm:flex gap-6 text-sm font-medium text-slate-400">
                <a href="#about" className="hover:text-white transition-colors">About</a>
                <a href="#education" className="hover:text-white transition-colors">Education</a>
                <a href="#skills" className="hover:text-white transition-colors">Skills</a>
                <a href="#projects" className="hover:text-white transition-colors">Projects</a>
                <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>

            {/* Mobile Menu Button */}
            <button 
                className="sm:hidden p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-[100] sm:hidden ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Drawer Panel */}
        <div className={`absolute top-0 right-0 h-full w-64 bg-slate-900/95 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out backdrop-blur-xl ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full p-6">
                <div className="flex justify-end mb-8">
                    <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full transition-colors"
                        aria-label="Close menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col gap-6 text-lg font-medium text-slate-400">
                    <a href="#about" className="hover:text-indigo-400 transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
                    <a href="#education" className="hover:text-indigo-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Education</a>
                    <a href="#skills" className="hover:text-indigo-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Skills</a>
                    <a href="#projects" className="hover:text-indigo-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Projects</a>
                    <a href="#contact" className="hover:text-indigo-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
                </div>
            </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 pt-32 md:pt-40 pb-24 space-y-32">
        {/* Hero Section */}
        <FadeIn className="text-center min-h-[60vh] flex flex-col justify-center items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-slate-900/50 border border-slate-800 text-xs font-medium text-indigo-400 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Available for work
            </div>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
              <Typewriter 
                text="W eb Developer" 
                speed={70}
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                onComplete={() => setHeroStep(2)}
              />
              {heroStep >= 2 && (
                <Typewriter 
                  text="&" 
                  speed={70}
                  className="text-slate-400"
                  onComplete={() => setHeroStep(3)}
                />
              )}
              {heroStep >= 3 && (
                <Typewriter 
                  text="C yber Security." 
                  speed={70}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500"
                  onComplete={() => setHeroStep(4)}
                />
              )}
              <span className="animate-pulse text-indigo-400 ml-1">|</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              I'm <span className="text-slate-100 font-semibold">Deep Baidya</span>. A Web Developer & Cybersecurity Enthusiast crafting secure, beautiful, and performant websites.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/resume.pdf" download className="px-8 py-4 bg-white text-slate-950 font-bold rounded-full hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20">
                Download Resume
              </a>
              <a href="#contact" className="px-8 py-4 bg-slate-900/50 text-white border border-slate-700 font-bold rounded-full hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm">
                Contact Me
              </a>
            </div>
        </FadeIn>

        {/* About Section */}
        <FadeIn id="about" className="scroll-mt-32 max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-100 flex items-center gap-4">
                <span className="w-12 h-1 bg-indigo-500 rounded-full"></span>
                About Me
            </h2>
            <div className="grid md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-5 relative w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl group">
                    <div className="absolute inset-0 bg-indigo-600/20 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0"></div>
                    <Image 
                        src="https://github.com/dbaidya811-beep.png" 
                        alt="Deep Baidya" 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                        unoptimized
                    />
                </div>
                <div className="md:col-span-7 bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
                    <p className="text-lg text-slate-400 leading-relaxed mb-6">
                        Hello! I'm <span className="text-indigo-400 font-semibold">Deep Baidya</span>. I am currently pursuing a Bachelor of Computer Applications (BCA) from Greater Kolkata College of Engineering and Management (2024-2028).
                    </p>
                    <p className="text-lg text-slate-400 leading-relaxed mb-6">
                        As a fresher, my journey into tech is driven by a fascination for how things work and a desire to create secure, user-friendly web experiences. I thrive on solving complex problems and am eager to apply my knowledge to real-world projects. I am constantly learning new technologies to stay up-to-date with the ever-evolving tech landscape.
                    </p>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Beyond coding, I am deeply interested in cybersecurity and ethical hacking. I enjoy exploring vulnerabilities and understanding how to secure systems against potential threats. In my free time, I love contributing to open-source projects, reading tech blogs, and experimenting with new frameworks to broaden my skill set.
                    </p>
                </div>
            </div>
        </FadeIn>

        {/* Education Section */}
        <FadeIn id="education" className="scroll-mt-32">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-100 flex items-center gap-4">
                <span className="w-12 h-1 bg-cyan-500 rounded-full"></span>
                Education
            </h2>
            <div className="max-w-3xl mx-auto">
                <TimelineItem 
                    year="2024 - 2028"
                    title="Bachelor of Computer Applications (BCA)"
                    subtitle="Greater Kolkata College of Engineering and Management"
                    description="Pursuing undergraduate degree with a focus on computer science fundamentals, programming languages, and web technologies."
                />
            </div>
        </FadeIn>

        {/* Skills Section */}
        <FadeIn id="skills" className="scroll-mt-32">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-100 flex items-center gap-4">
                <span className="w-12 h-1 bg-fuchsia-500 rounded-full"></span>
                Technical Skills
            </h2>
            
            <style>{`
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scroll-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
            `}</style>

            <div className="flex flex-col gap-8 overflow-hidden py-4">
                {/* Row 1: Left to Right (Content moves right) */}
                <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
                    <div className="flex gap-4 w-max hover:[animation-play-state:paused]" style={{ animation: 'scroll-right 40s linear infinite' }}>
                        {[...['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'Python'], ...['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'Python']].map((skill, i) => (
                            <SkillBadge key={`row1-${i}`} name={skill} />
                        ))}
                    </div>
                </div>

                {/* Row 2: Right to Left (Content moves left) */}
                <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
                    <div className="flex gap-4 w-max hover:[animation-play-state:paused]" style={{ animation: 'scroll-left 40s linear infinite' }}>
                        {[...['Git & GitHub', 'MongoDB', 'PostgreSQL', 'Docker', 'Figma', 'Cyber Security', 'Network Security'], ...['Git & GitHub', 'MongoDB', 'PostgreSQL', 'Docker', 'Figma', 'Cyber Security', 'Network Security']].map((skill, i) => (
                            <SkillBadge key={`row2-${i}`} name={skill} />
                        ))}
                    </div>
                </div>
            </div>
        </FadeIn>

        {/* Projects Section */}
        <section className="scroll-mt-32" id="projects">
            <FadeIn delay={300}>
                <div className="flex items-end justify-between mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-100 flex items-center gap-4">
                        <span className="w-12 h-1 bg-green-500 rounded-full"></span>
                        Selected Projects
                    </h2>
                    <a href="https://github.com/dbaidya811-beep" target="_blank" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium hidden sm:flex items-center gap-1 transition-colors">
                        View GitHub 
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                </div>
            </FadeIn>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                    <FadeIn key={project.id} delay={index * 200} className="h-full">
                        <ProjectCard project={project} />
                    </FadeIn>
                ))}
            </div>
        </section>

        {/* Contact Section */}
        <FadeIn delay={400} id="contact" className="scroll-mt-32 mb-20">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900/50 border border-slate-800 p-6 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-fuchsia-600/20 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6">Let's work together</h2>
                        <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, fill out the form or send me an email directly!
                        </p>
                        
                        <div className="flex flex-col gap-4 text-slate-400 mb-8">
                            <a href="mailto:dbaidya811@gmail.com" className="flex items-center gap-3 hover:text-indigo-400 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                dbaidya811@gmail.com
                            </a>
                            <div className="flex gap-6 mt-2">
                                <a href="https://github.com/dbaidya811-beep" target="_blank" className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform">
                                    <span className="sr-only">GitHub</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                </a>
                                <a href="https://www.linkedin.com/in/dbaidya811" target="_blank" className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform">
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                </a>
                                <a href="https://x.com/dbaidya811" target="_blank" className="text-slate-400 hover:text-white transition-colors hover:scale-110 transform">
                                    <span className="sr-only">X (Twitter)</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                            <textarea 
                                id="message" 
                                name="message" 
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
                                placeholder="How can I help you?"
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitted || isSending}
                            className={`w-full px-8 py-4 font-bold rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 overflow-hidden relative ${
                                isSubmitted 
                                ? 'bg-green-500 text-white scale-100 cursor-default shadow-green-500/20' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] shadow-indigo-500/20'
                            }`}
                        >
                            {isSending ? (
                                <CarRoadAnimation />
                            ) : isSubmitted ? (
                                <div className="flex items-center gap-2 w-full justify-center" style={{ animation: 'slideIn 0.5s ease-out forwards' }}>
                                    <style>{`
                                        @keyframes slideIn {
                                            from { transform: translateX(-100%); opacity: 0; }
                                            to { transform: translateX(0); opacity: 1; }
                                        }
                                    `}</style>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Sent Successfully!
                                </div>
                            ) : (
                                "Send Message"
                            )}
                        </button>
                        {isSubmitted && (
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-medium flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Message sent! I'll get back to you soon.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </FadeIn>

      </main>

      <footer className="py-12 text-center text-slate-600 text-sm border-t border-slate-900 bg-slate-950 relative z-10">
        <div className="flex justify-center gap-8 mb-8">
            <a href="https://github.com/dbaidya811-beep" target="_blank" className="text-slate-500 hover:text-white transition-colors hover:scale-110 transform">
                <span className="sr-only">GitHub</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            </a>
            <a href="https://www.linkedin.com/in/dbaidya811" target="_blank" className="text-slate-500 hover:text-white transition-colors hover:scale-110 transform">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://x.com/dbaidya811" target="_blank" className="text-slate-500 hover:text-white transition-colors hover:scale-110 transform">
                <span className="sr-only">X (Twitter)</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Deep Baidya. All rights reserved.</p>
      </footer>
      <BackToTop />
    </div>
  );
}
