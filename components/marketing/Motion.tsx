"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Capa de movimiento de la página pública: scroll con inercia (Lenis) y
 * efectos ligados al scroll (GSAP ScrollTrigger). Se apaga por completo
 * con prefers-reduced-motion y en el resto de la app no se monta.
 *
 * data-parallax="-0.12"  → el elemento se desplaza a otra velocidad que la página
 * data-scrub-clip        → el bloque se "revela" de arriba abajo al entrar
 */
export default function Motion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ autoRaf: true, lerp: 0.12 });
    lenis.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "-0.1");
        gsap.to(el, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-scrub-clip]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)", y: 24 },
          { clipPath: "inset(0 0 0% 0)", y: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 88%", end: "top 45%", scrub: true } }
        );
      });
    });

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);
  return null;
}
