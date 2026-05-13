'use client';
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function SpiderBg() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={{
        fpsLimit: 120,
        interactivity: {
          events: { 
            onHover: { enable: true, mode: "grab" },
            onClick: { enable: true, mode: "repulse" } 
          },
          modes: { 
            grab: { distance: 250, links: { opacity: 0.6, color: "#38BDF8" } },
            repulse: { distance: 250, duration: 0.4 }
          },
        },
        particles: {
          color: { value: ["#0EA5E9", "#38BDF8", "#7DD3FC"] }, 
          links: { 
            color: "#0EA5E9", 
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