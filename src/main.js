import "./style.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initBackground } from "./three-bg.js";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ============ Three.js background ============
initBackground();

// ============ Typewriter ============
const roles = [
  "DevOps Engineer",
  "Linux Administrator",
  "Cloud Infrastructure (AWS · GCP · Azure)",
  "CI/CD Pipeline Builder",
  "Terraform & IaC Practitioner",
];
const tw = document.getElementById("typewriter");
let roleIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const word = roles[roleIdx];
  if (!deleting) {
    charIdx++;
    if (charIdx === word.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      tw.textContent = word.slice(0, charIdx);
      return;
    }
  } else {
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  tw.textContent = word.slice(0, charIdx);
  setTimeout(typeLoop, deleting ? 35 : 75);
}
if (prefersReducedMotion) {
  tw.textContent = roles[0];
} else {
  setTimeout(typeLoop, 900);
}

// ============ Animations (skipped under reduced motion; CSS shows content) ============
if (!prefersReducedMotion) {

  // --- Hero entrance ---
  gsap.to(".reveal-hero", {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.14,
    ease: "power3.out",
    delay: 0.2,
    startAt: { y: 40 },
  });

  // --- Scroll progress bar ---
  gsap.to(".scroll-progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });

  // --- Generic reveals ---
  document.querySelectorAll(".reveal").forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      }
    );
  });

  // --- Section titles: slide in from left ---
  document.querySelectorAll(".section-title").forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: -60 },
      {
        opacity: 1, x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      }
    );
  });

  // --- Timeline line draws as you scroll ---
  gsap.to(".timeline-line-fill", {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".timeline",
      start: "top 75%",
      end: "bottom 60%",
      scrub: 0.5,
    },
  });

  // --- Timeline dots pop ---
  document.querySelectorAll(".timeline-dot").forEach((dot) => {
    gsap.fromTo(dot,
      { scale: 0 },
      {
        scale: 1,
        duration: 0.5,
        ease: "back.out(3)",
        scrollTrigger: { trigger: dot, start: "top 82%" },
      }
    );
  });

  // --- Skill pills stagger in ---
  document.querySelectorAll(".skill-card").forEach((card) => {
    gsap.fromTo(card.querySelectorAll(".pill"),
      { opacity: 0, scale: 0.6, y: 14 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 0.4,
        stagger: 0.03,
        ease: "back.out(2)",
        scrollTrigger: { trigger: card, start: "top 82%" },
      }
    );
  });

  // --- Hero parallax out on scroll ---
  gsap.to(".hero-inner", {
    y: -120,
    opacity: 0.15,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.4,
    },
  });

  // --- 3D tilt on cards ---
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, {
        rotateY: px * 6,
        rotateX: -py * 6,
        transformPerspective: 900,
        duration: 0.4,
        ease: "power2.out",
      });
    });
    card.addEventListener("pointerleave", () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    });
  });

  // --- Cursor glow follows pointer ---
  const glow = document.querySelector(".cursor-glow");
  addEventListener("pointermove", (e) => {
    gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });
  });

  // --- Magnetic button ---
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width / 2) * 0.3,
        y: (e.clientY - r.top - r.height / 2) * 0.3,
        duration: 0.3,
      });
    });
    btn.addEventListener("pointerleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });
  });
}

// Recalculate trigger positions once everything (fonts, images) has loaded,
// so reveal points aren't off after layout shifts.
window.addEventListener("load", () => ScrollTrigger.refresh());

// ============ Project card spotlight (CSS var driven) ============
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// ============ Nav: scrolled state + active link ============
const nav = document.getElementById("nav");
addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link")];
addEventListener("scroll", () => {
  const pos = window.scrollY + innerHeight * 0.35;
  let current = sections[0];
  for (const s of sections) if (s.offsetTop <= pos) current = s;
  navLinks.forEach((l) =>
    l.classList.toggle("active", l.getAttribute("href") === `#${current.id}`)
  );
}, { passive: true });

// ============ Mobile menu ============
const burger = document.getElementById("nav-burger");
const mobileMenu = document.getElementById("mobile-menu");
burger.addEventListener("click", () => mobileMenu.classList.toggle("open"));
mobileMenu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => mobileMenu.classList.remove("open"))
);
