const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuButton?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

/* ================= HUD CURSOR ================= */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

if (!reduceMotion && !isTouch) {
  const cursorDot = document.createElement("div");
  cursorDot.className = "hud-cursor-dot";
  const cursorRing = document.createElement("div");
  cursorRing.className = "hud-cursor-ring";
  document.body.append(cursorDot, cursorRing);

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll("a, button, .hud-frame, .mod-card, .project-card").forEach(el => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("is-active"));
    el.addEventListener("mouseleave", () => cursorRing.classList.remove("is-active"));
  });

  document.body.classList.add("hud-cursor-enabled");

  /* ================= TELEMETRY HUD OVERLAY ================= */
  const telemetry = document.createElement("div");
  telemetry.className = "telemetry-hud";
  telemetry.innerHTML = `
    <div class="telemetry-row"><span>TIME</span><strong data-tm="clock">00:00:00</strong></div>
    <div class="telemetry-row"><span>CURSOR</span><strong data-tm="coords">X 0000 · Y 0000</strong></div>
    <div class="telemetry-row"><span>SCROLL</span><strong data-tm="scroll">000%</strong></div>
  `;
  document.body.appendChild(telemetry);

  const clockEl = telemetry.querySelector('[data-tm="clock"]');
  const coordsEl = telemetry.querySelector('[data-tm="coords"]');
  const scrollEl = telemetry.querySelector('[data-tm="scroll"]');

  function tickClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString("en-GB", { hour12: false });
  }
  tickClock();
  setInterval(tickClock, 1000);

  window.addEventListener("mousemove", e => {
    coordsEl.textContent = `X ${String(e.clientX).padStart(4, "0")} · Y ${String(e.clientY).padStart(4, "0")}`;
  });

  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
    scrollEl.textContent = `${String(pct).padStart(3, "0")}%`;
  }, { passive: true });

  /* ================= ARC REACTOR PARALLAX ================= */
  const heroScene = document.querySelector(".hero-scene");
  const heroSection = document.querySelector(".hero");
  if (heroScene && heroSection) {
    heroSection.addEventListener("mousemove", e => {
      const rect = heroSection.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      heroScene.style.transform =
        `translateY(-50%) translate(${px * -26}px, ${py * -18}px) rotate(${px * 2}deg)`;
    });
    heroSection.addEventListener("mouseleave", () => {
      heroScene.style.transform = "translateY(-50%)";
    });
  }

  /* ================= HUD CARD TILT ================= */
  document.querySelectorAll(".hud-frame").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${py * -5}deg) rotateY(${px * 6}deg) translateZ(0)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}
