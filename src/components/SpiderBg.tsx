'use client';
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function SpiderBg() {
  const [init, setInit] = useState(false);
  const [hue, setHue] = useState<number>(199);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));

    const updateHue = () => {
      const savedHue = localStorage.getItem('accentHue');
      if (savedHue) {
        setHue(Number(savedHue));
      } else {
        setHue(199); // default sky blue
      }
    };

    updateHue(); // Run on mount
    window.addEventListener('theme-change', updateHue); // Listen for live global updates
    
    return () => window.removeEventListener('theme-change', updateHue);
  }, []);

  if (!init) return null;

  const colorAccent = `hsl(${hue}, 89%, 48%)`;
  const colorAccentLight = `hsl(${hue}, 89%, 60%)`;
  const colorAccentDark = `hsl(${hue}, 89%, 30%)`;

  return (
    <Particles
      id="tsparticles"
      options={{
        fpsLimit: 120,
        interactivity: {
          detectsOn: "window", // Enables hover effects globally through pointer-event blocks
          events: { 
            onHover: { enable: true, mode: "grab" },
            onClick: { enable: true, mode: "repulse" } 
          },
          modes: { 
            grab: { distance: 250, links: { opacity: 0.6, color: colorAccentLight } },
            repulse: { distance: 250, duration: 0.4 }
          },
        },
        particles: {
          color: { value: [colorAccent, colorAccentLight, colorAccentDark] }, 
          links: { 
            color: colorAccent, 
            distance: 150, 
            enable: true, 
            opacity: 0.25, 
            width: 1 
          },
          move: { enable: true, speed: 1.2, outModes: { default: "bounce" } },
          number: { density: { enable: true }, value: 90 },
          opacity: { 
            value: { min: 0.1, max: 0.5 },
            animation: { enable: true, speed: 1, sync: false }
          },
          size: { 
            value: { min: 1, max: 3 },
            animation: { enable: true, speed: 2, sync: false }
          },
        },
      }}
    />
  );
}