// Three.js animated background: particle starfield + floating wireframe torus
import * as THREE from "three";

export function initBackground() {
  const canvas = document.getElementById("bg-canvas");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060f, 0.0012);

  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 2000);
  camera.position.z = 400;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  // --- Particle field ---
  const COUNT = 1800;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const palette = [new THREE.Color(0x00e5ff), new THREE.Color(0x7c4dff), new THREE.Color(0x00ffa3), new THREE.Color(0xffffff)];
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1600;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1200;
    const c = palette[Math.random() < 0.75 ? 3 : Math.floor(Math.random() * 3)];
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const stars = new THREE.Points(geo, mat);
  scene.add(stars);

  // --- Wireframe torus knot (the "3D thing") ---
  const knotGeo = new THREE.TorusKnotGeometry(90, 22, 140, 18);
  const knotMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.07,
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  knot.position.set(240, 60, -150);
  scene.add(knot);

  // Second smaller shape, purple
  const icoGeo = new THREE.IcosahedronGeometry(60, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0x7c4dff,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(-280, -120, -200);
  scene.add(ico);

  // --- Mouse parallax ---
  let mouseX = 0, mouseY = 0;
  addEventListener("pointermove", (e) => {
    mouseX = (e.clientX / innerWidth - 0.5) * 2;
    mouseY = (e.clientY / innerHeight - 0.5) * 2;
  });

  // --- Scroll influence ---
  let scrollY = 0;
  addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      stars.rotation.y = t * 0.015;
      stars.rotation.x = Math.sin(t * 0.05) * 0.02;
      knot.rotation.x = t * 0.12;
      knot.rotation.y = t * 0.08;
      ico.rotation.x = -t * 0.1;
      ico.rotation.z = t * 0.07;

      // camera drifts with mouse + scroll
      camera.position.x += (mouseX * 30 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 30 - scrollY * 0.06 - camera.position.y) * 0.03;
      camera.lookAt(0, -scrollY * 0.06, 0);
    }
    renderer.render(scene, camera);
  }
  animate();
}
