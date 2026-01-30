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
          events: { onHover: { enable: true, mode: "grab" } },
          modes: { grab: { distance: 200, links: { opacity: 0.5 } } },
        },
        particles: {
          color: { value: ["#00f2ff", "#c026d3"] },
          links: { color: "#00f2ff", distance: 150, enable: true, opacity: 0.2, width: 1 },
          move: { enable: true, speed: 1.5 },
          number: { density: { enable: true }, value: 80 },
          opacity: { value: 0.3 },
          size: { value: { min: 1, max: 3 } },
        },
      }}
    />
  );
}