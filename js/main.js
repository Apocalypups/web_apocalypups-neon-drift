(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Soft stage haze
  const canvas = document.getElementById("fx-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let motes = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.floor((w * h) / 48000);
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.6,
        speed: 0.12 + Math.random() * 0.35,
        alpha: 0.1 + Math.random() * 0.22,
        color: Math.random() > 0.55 ? "#f0c14b" : "#ff2ecb",
      }));
    };

    const frame = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (!reduced) {
        for (const m of motes) {
          ctx.beginPath();
          ctx.fillStyle = m.color;
          ctx.globalAlpha = m.alpha;
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          ctx.fill();
          m.y -= m.speed;
          m.x += Math.sin(m.y * 0.01) * 0.12;
          if (m.y < -4) {
            m.y = h + 4;
            m.x = Math.random() * w;
          }
        }
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(frame);
  }

  // Hero slideshow + dots
  const slides = Array.from(document.querySelectorAll(".hero__slide"));
  const dotsRoot = document.querySelector(".hero__dots");
  let index = 0;
  let timer = null;

  const goTo = (next) => {
    if (!slides.length) return;
    slides[index]?.classList.remove("is-active");
    dotsRoot?.querySelectorAll(".hero__dot")[index]?.classList.remove("is-active");
    index = (next + slides.length) % slides.length;
    slides[index].classList.add("is-active");
    dotsRoot?.querySelectorAll(".hero__dot")[index]?.classList.add("is-active");
  };

  if (dotsRoot && slides.length) {
    slides.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hero__dot" + (i === 0 ? " is-active" : "");
      btn.setAttribute("aria-label", `Screenshot ${i + 1}`);
      btn.addEventListener("click", () => {
        goTo(i);
        if (timer) {
          clearInterval(timer);
          timer = setInterval(() => goTo(index + 1), 5200);
        }
      });
      dotsRoot.appendChild(btn);
    });
  }

  if (slides.length > 1 && !reduced) {
    timer = setInterval(() => goTo(index + 1), 5200);
  }

  // Letter blackout / power-cut glitches on mega title
  const letters = Array.from(document.querySelectorAll(".mega-letter"));
  if (letters.length && !reduced) {
    const blackout = () => {
      const roll = Math.random();
      const count = roll > 0.88 ? 3 : roll > 0.55 ? 2 : 1;
      const picks = [...letters].sort(() => Math.random() - 0.5).slice(0, count);
      picks.forEach((el) => {
        window.setTimeout(() => {
          el.classList.remove("is-glitching");
          void el.offsetWidth;
          el.classList.add("is-glitching");
          window.setTimeout(() => el.classList.remove("is-glitching"), 320);
        }, Math.random() * 220);
      });
      // mostly frequent, occasional longer pause
      const gap = Math.random() > 0.82
        ? 1600 + Math.random() * 1400
        : 450 + Math.random() * 900;
      window.setTimeout(blackout, gap);
    };
    window.setTimeout(blackout, 400 + Math.random() * 600);
  }

  // Gameplay screenshot carousel
  const gp = document.querySelector("[data-gp-carousel]");
  if (gp) {
    const gpSlides = Array.from(gp.querySelectorAll(".gp-carousel__slide"));
    const gpDotsRoot = gp.querySelector("[data-gp-dots]");
    const prevBtn = gp.querySelector("[data-gp-prev]");
    const nextBtn = gp.querySelector("[data-gp-next]");
    let gpIndex = 0;
    let gpTimer = null;

    const gpGo = (next) => {
      if (!gpSlides.length) return;
      gpSlides[gpIndex]?.classList.remove("is-active");
      gpDotsRoot?.querySelectorAll(".gp-carousel__dot")[gpIndex]?.classList.remove("is-active");
      gpIndex = (next + gpSlides.length) % gpSlides.length;
      gpSlides[gpIndex].classList.add("is-active");
      gpDotsRoot?.querySelectorAll(".gp-carousel__dot")[gpIndex]?.classList.add("is-active");
    };

    const restart = () => {
      if (reduced) return;
      if (gpTimer) clearInterval(gpTimer);
      gpTimer = setInterval(() => gpGo(gpIndex + 1), 4500);
    };

    if (gpDotsRoot) {
      gpSlides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "gp-carousel__dot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", `Screenshot ${i + 1}`);
        dot.addEventListener("click", () => {
          gpGo(i);
          restart();
        });
        gpDotsRoot.appendChild(dot);
      });
    }

    prevBtn?.addEventListener("click", () => {
      gpGo(gpIndex - 1);
      restart();
    });
    nextBtn?.addEventListener("click", () => {
      gpGo(gpIndex + 1);
      restart();
    });

    gp.addEventListener("pointerenter", () => {
      if (gpTimer) clearInterval(gpTimer);
    });
    gp.addEventListener("pointerleave", () => restart());

    restart();
  }

  // Pause marquee when reduced motion
  if (reduced) {
    document.querySelectorAll(".marquee__track").forEach((el) => {
      el.style.animation = "none";
    });
    document.documentElement.style.setProperty("--beat", "0.01s");
  }

  // Scroll reveal
  const revealTargets = document.querySelectorAll(
    ".section-head, .member, .gp-carousel, .pillar, .box__shot, .wish__inner > *, .boss, .finale__copy, .finale__art, .level, .trailer__frame"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );
  revealTargets.forEach((el) => io.observe(el));

  // Wishlist (localStorage only)
  const form = document.getElementById("wish-form");
  const note = document.getElementById("wish-note");
  if (form && note) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = new FormData(form).get("email");
      try {
        const list = JSON.parse(localStorage.getItem("nd_wish") || "[]");
        if (email && !list.includes(email)) {
          list.push(String(email));
          localStorage.setItem("nd_wish", JSON.stringify(list));
        }
      } catch (_) {
        /* ignore */
      }
      form.hidden = true;
      note.hidden = false;
    });
  }
})();
