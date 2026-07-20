(() => {
  const BPM = 128;
  const BEAT_MS = 60000 / BPM;

  // ── Canvas rain + sparks ─────────────────────────────────
  const canvas = document.getElementById("fx-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let drops = [];
    let sparks = [];
    let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.floor((w * h) / 18000);
      drops = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        len: 8 + Math.random() * 16,
        speed: 4 + Math.random() * 7,
        alpha: 0.15 + Math.random() * 0.35,
      }));
    };

    const spawnSpark = () => {
      sparks.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.7,
        life: 1,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -0.4 - Math.random() * 1.2,
        color: Math.random() > 0.5 ? "#27f0ff" : "#ff2ecb",
      });
    };

    const frame = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      if (!reduced) {
        ctx.strokeStyle = "rgba(168, 200, 255, 0.35)";
        ctx.lineWidth = 1;
        for (const d of drops) {
          ctx.globalAlpha = d.alpha;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 1.2, d.y + d.len);
          ctx.stroke();
          d.y += d.speed;
          d.x -= 0.4;
          if (d.y > h) {
            d.y = -d.len;
            d.x = Math.random() * w;
          }
        }
        ctx.globalAlpha = 1;

        if (Math.random() < 0.08) spawnSpark();
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          ctx.fillStyle = s.color;
          ctx.globalAlpha = s.life;
          ctx.fillRect(s.x, s.y, 2, 2);
          s.x += s.vx;
          s.y += s.vy;
          s.life -= 0.02;
          if (s.life <= 0) sparks.splice(i, 1);
        }
        ctx.globalAlpha = 1;
      }

      requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(frame);
  }

  // ── Scroll reveal ────────────────────────────────────────
  const revealTargets = document.querySelectorAll(
    ".section-head, .feature, .conductor, .showtime__inner > *, .roster__card, .wish__inner > *"
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
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  revealTargets.forEach((el) => io.observe(el));

  // ── Hero sprite cycle on the beat ────────────────────────
  const slayer = document.querySelector(".hero__fighter--slayer");
  const scav = document.querySelector(".hero__fighter--scav");
  const slayerFrames = [
    "assets/art/slayer_kick_12.png",
    "assets/art/slayer_punch_10.png",
    "assets/art/slayer_kick_06.png",
    "assets/art/slayer_punch_04.png",
  ];
  const scavFrames = [
    "assets/art/scavenger_dance_05.png",
    "assets/art/scavenger_dance_02.png",
    "assets/art/scavenger_dance_08.png",
    "assets/art/scavenger_idle_00.png",
  ];

  // Preload
  [...slayerFrames, ...scavFrames].forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  let beat = 0;
  if (slayer && scav && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(() => {
      beat += 1;
      if (beat % 2 === 0) {
        slayer.src = slayerFrames[(beat / 2) % slayerFrames.length];
      }
      if (beat % 4 === 0) {
        scav.src = scavFrames[(beat / 4) % scavFrames.length];
      }
    }, BEAT_MS);
  }

  // ── Wishlist form (local only) ───────────────────────────
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
        /* ignore storage failures */
      }
      form.hidden = true;
      note.hidden = false;
    });
  }

  // Soft parallax on hero fighters
  const stage = document.querySelector(".hero__stage");
  if (stage && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "pointermove",
      (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 16;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        stage.style.transform = `translate(${x}px, ${y}px)`;
      },
      { passive: true }
    );
  }
})();
