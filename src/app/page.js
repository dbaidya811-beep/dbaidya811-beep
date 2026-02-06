'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function FadeIn({ children, className = "", delay = 0 }) {
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
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div ref={blob1Ref} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
      <div ref={blob2Ref} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px] animate-pulse" style={{animationDelay: '2s'}} />
      <div ref={blob3Ref} className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] rounded-full bg-cyan-600/5 blur-[100px]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Koro background animation */}
      <div className="koro-container">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
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

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroStep, setHeroStep] = useState(1);

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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
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
                    <a href="#skills" className="hover:text-indigo-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Skills</a>
                    <a href="#projects" className="hover:text-indigo-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Projects</a>
                    <a href="#contact" className="hover:text-indigo-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
                </div>
            </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 pt-32 md:pt-40 pb-24">
        {/* Hero Section */}
        <FadeIn className="text-center mb-24 md:mb-40">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-slate-900/50 border border-slate-800 text-xs font-medium text-indigo-400 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Available for work
            </div>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
              <Typewriter text="Building " speed={70} onComplete={() => setHeroStep(2)} />
              {heroStep >= 2 && (
                <Typewriter 
                  text="Digital" 
                  speed={70}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                  onComplete={() => setHeroStep(3)}
                />
              )}
              {heroStep >= 3 && <br />}
              {heroStep >= 3 && (
                <Typewriter 
                  text="Experiences." 
                  speed={70}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
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

        {/* About & Skills Grid */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 mb-24 md:mb-40 scroll-mt-32" id="about">
            <FadeIn delay={100}>
                <h2 className="text-3xl font-bold mb-8 text-slate-100 flex items-center gap-3">
                    <span className="w-10 h-1 bg-indigo-500 rounded-full"></span>
                    About Me
                </h2>
                <div className="prose prose-invert prose-lg text-slate-400 leading-relaxed">
                    <p className="mb-6">
                        Hello! I'm Deep Baidya. I am currently pursuing a Bachelor of Computer Applications (BCA) from Greater Kolkata College of Engineering and Management (2024-2028).
                    </p>
                    <p>
                        As a fresher, my journey into tech is driven by a fascination for how things work and a desire to create secure, user-friendly web experiences. I thrive on solving complex problems and am eager to apply my knowledge to real-world projects.
                    </p>
                </div>
            </FadeIn>
            <FadeIn delay={200} id="skills">
                <h2 className="text-3xl font-bold mb-8 text-slate-100 flex items-center gap-3">
                    <span className="w-10 h-1 bg-fuchsia-500 rounded-full"></span>
                    Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                    {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'Python', 'Git & GitHub', 'MongoDB', 'PostgreSQL', 'Docker', 'Figma'].map((skill) => (
                        <span key={skill} className="px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-lg text-sm font-medium text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-default">
                            {skill}
                        </span>
                    ))}
                </div>
            </FadeIn>
        </div>

        {/* Projects Section */}
        <FadeIn delay={300} className="mb-24 md:mb-40 scroll-mt-32" id="projects">
            <div className="flex items-end justify-between mb-12">
                <h2 className="text-4xl font-bold text-slate-100">Selected Projects</h2>
                <a href="https://github.com/dbaidya811-beep" target="_blank" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium hidden sm:flex items-center gap-1 transition-colors">
                    View GitHub 
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </FadeIn>

        {/* Contact Section */}
        <FadeIn delay={400} id="contact" className="scroll-mt-32">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 p-6 md:p-12 text-center shadow-2xl shadow-indigo-900/50">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Let's work together</h2>
                    <p className="text-indigo-100 mb-10 max-w-xl mx-auto text-lg">
                        I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>
                    <a href="mailto:dbaidya811@gmail.com" className="inline-block px-10 py-4 bg-white text-indigo-900 font-bold rounded-full hover:bg-indigo-50 transition-all hover:scale-105 shadow-xl">
                        Say Hello
                    </a>
                    
                    <div className="mt-12 flex justify-center gap-8">
                        <a href="https://github.com/dbaidya811-beep" target="_blank" className="text-white/70 hover:text-white transition-colors hover:scale-110 transform">
                            <span className="sr-only">GitHub</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/dbaidya811" target="_blank" className="text-white/70 hover:text-white transition-colors hover:scale-110 transform">
                            <span className="sr-only">LinkedIn</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                        <a href="https://x.com/dbaidya811" target="_blank" className="text-white/70 hover:text-white transition-colors hover:scale-110 transform">
                            <span className="sr-only">X (Twitter)</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </FadeIn>

      </main>

      <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-900">
        <p>&copy; {new Date().getFullYear()} Deep Baidya. All rights reserved.</p>
      </footer>
      <BackToTop />
    </div>
  );
}
