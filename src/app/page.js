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

export default function Home() {
  const [projects, setProjects] = useState([]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-teal-100 dark:selection:bg-teal-900">
      {/* Background Gradient Wash */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 blur-[100px]" />
      </div>

      <main className="max-w-4xl mx-auto py-24 px-6 sm:px-12">
        {/* Header Section */}
        <FadeIn className="mb-24">
          <header>
            <div className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-teal-600 uppercase bg-teal-100 rounded-full dark:text-teal-300 dark:bg-teal-900/30">
              Available for work
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-zinc-100 dark:via-zinc-400 dark:to-zinc-600 bg-clip-text text-transparent">
              Deep Baidya
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              I'm a <span className="font-semibold text-zinc-900 dark:text-zinc-100">Web Developer</span> & <span className="font-semibold text-zinc-900 dark:text-zinc-100">Cybersecurity Enthusiast</span>. As a fresher, I'm passionate about building secure and engaging digital experiences.
            </p>
            <div className="mt-10 flex">
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-teal-500 rounded-full shadow-lg hover:bg-teal-600 transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Resume
              </a>
            </div>
          </header>
        </FadeIn>

        {/* About Me Section */}
        <FadeIn delay={100} className="mb-24">
          <section>
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
              <span className="w-8 h-1 bg-purple-500 rounded-full inline-block"></span>
              About Me
            </h2>
            <div className="space-y-6 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                Hello! I'm Deep Baidya, a passionate Web Developer and Cybersecurity Enthusiast. I am currently pursuing a Bachelor of Computer Applications (BCA) from Greater Kolkata College of Engineering and Management (affiliated with JIS Group and MAKAUT University), from 2024 to 2028.
              </p>
              <p>
                As a fresher, my journey into tech is driven by a fascination for how things work and a desire to create secure, user-friendly web experiences. I am actively learning and building my skills in modern web technologies and cybersecurity principles. I thrive on solving complex problems and am eager to apply my knowledge to real-world projects.
              </p>
            </div>
          </section>
        </FadeIn>

        {/* Skills Section */}
        <FadeIn delay={200} className="mb-24">
          <section>
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
              <span className="w-8 h-1 bg-yellow-500 rounded-full inline-block"></span>
              Skills
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS/Sass'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-full dark:bg-zinc-800 dark:text-zinc-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Frameworks & Libraries</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'Framer Motion'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-full dark:bg-zinc-800 dark:text-zinc-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Tools & Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {['Git & GitHub', 'Docker', 'Vercel', 'Figma', 'PostgreSQL', 'MongoDB'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-full dark:bg-zinc-800 dark:text-zinc-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Projects Section */}
        <FadeIn delay={300} className="mb-24">
          <section>
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
              <span className="w-8 h-1 bg-teal-500 rounded-full inline-block"></span>
              Selected Projects
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {projects.map((project) => (
                <div key={project.id} className="group relative bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-xl hover:border-teal-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <svg className="w-6 h-6 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                      </div>
                      <span className="text-xs font-mono text-zinc-400">{new Date(project.created_at).getFullYear()}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
                      {project.description || "No description available."}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.language && (
                        <span className="px-2 py-1 text-xs font-medium text-zinc-600 bg-zinc-100 rounded-md dark:bg-zinc-800 dark:text-zinc-300">
                          {project.language}
                        </span>
                      )}
                    </div>

                    <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                      View Project 
                      <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Connect Section */}
        <FadeIn delay={400}>
          <section>
            <div className="bg-zinc-900 dark:bg-zinc-100 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white dark:text-zinc-900 mb-4">Let's work together</h2>
                <p className="text-zinc-400 dark:text-zinc-600 mb-8 max-w-lg mx-auto">
                  I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="mailto:dbaidya811@gmail.com" className="px-6 py-3 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold rounded-full hover:scale-105 transition-transform">
                    Say Hello
                  </a>
                  <div className="flex gap-2">
                    <a href="https://x.com/dbaidya811" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors" aria-label="Twitter">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                    </a>
                    <a href="https://github.com/dbaidya811-beep" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors" aria-label="GitHub">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                    </a>
                    <a href="https://www.linkedin.com/in/dbaidya811" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors" aria-label="LinkedIn">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      </main>
    </div>
  );
}
