import { createRoot } from "react-dom/client";
import { useState, useEffect, useCallback } from "react";
import HarveFullDemo from "./harve-demo.jsx";

function DemoGate() {
  const [play, setPlay] = useState(false);

  const onIntersect = useCallback((entries) => {
    const e = entries[0];
    if (!e) return;
    const section = document.querySelector(".mac-demo-section");
    const active = e.isIntersecting && e.intersectionRatio >= 0.18;
    if (active) {
      setPlay(true);
      section?.classList.add("mac-demo-section--visible");
    } else {
      setPlay(false);
      section?.classList.remove("mac-demo-section--visible");
    }
  }, []);

  useEffect(() => {
    const section = document.querySelector(".mac-demo-section");
    if (!section) return;
    const io = new IntersectionObserver(onIntersect, {
      root: null,
      threshold: [0, 0.08, 0.15, 0.22, 0.35, 0.5],
      rootMargin: "0px 0px -12% 0px",
    });
    io.observe(section);
    return () => io.disconnect();
  }, [onIntersect]);

  return <HarveFullDemo play={play} />;
}

const el = document.getElementById("harve-demo-root");
if (el) {
  createRoot(el).render(<DemoGate />);
}
