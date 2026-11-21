(() => {
    const root = document.getElementById("smoke-cloud");
    const canvas = document.getElementById("smoke-canvas");
    const ctx = canvas.getContext("2d");
    const words = [
        {t:"Classical Music", x:0,    y:-57, s:33, r:0},
        {t:"Swimming",      x:-70,  y:-8,  s:30, r:-0.1},
        {t:"Piano",         x:107,  y:-11, s:21, r:0.13},
        {t:"DOGS!",         x:-13,  y:45,  s:28, r:-0.05},
        {t:"French",        x:-154, y:37,  s:18, r:-Math.PI/2},
        {t:"E-sports",      x:100,  y:47,  s:18, r:-0.12}
    ];
    let W = 500;
    let H = 220;
    let particles = [];
    let lastHover = 0;
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    function themeColor(variable, fallback) {
        const value = getComputedStyle(
            document.documentElement
        ).getPropertyValue(variable).trim();
        return value || fallback;
    }
    function inkColor() {
        return themeColor("--ink", "#e6edf3");
    }
    function mutedColor() {
        return themeColor("--muted", "#94a3b8");
    }
    function scale() {
        return Math.min(1, (W - 20) / 385);
    }
    function position(word) {
        const f = scale();
        return {
            x: W / 2 + word.x * f,
            y: H / 2 + word.y * f
        };
    }
    function resize() {
        const rect = root.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = rect.width;
        H = rect.height;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw(performance.now());
    }
    new ResizeObserver(resize).observe(root);
    function drawWord(word, alpha, time) {
        const p = position(word);
        const floatY = reducedMotion
            ? 0
            : Math.sin(time * 0.001 + word.x) * 2;
        ctx.save();
        ctx.translate(p.x, p.y + floatY);
        ctx.rotate(word.r);
        ctx.font = `${word.s * scale()}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = alpha;
        ctx.fillStyle = inkColor();
        ctx.fillText(word.t, 0, 0);
        ctx.restore();
    }
    function burst(word) {
        const f = scale();
        const offscreen = document.createElement("canvas");
        offscreen.width = 340;
        offscreen.height = 75;
        const c = offscreen.getContext("2d");
        c.font = `${word.s * f}px system-ui`;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillStyle = "white";
        c.fillText(word.t, 170, 37);
        const pixels = c.getImageData(
            0, 0, 340, 75
        ).data;
        const points = [];
        for (let y = 0; y < 75; y += 3) {
            for (let x = 0; x < 340; x += 3) {
                const alpha = pixels[(y * 340 + x) * 4 + 3];
                if (alpha > 100) {
                    points.push([x - 170, y - 37]);
                }
            }
        }
        const center = position(word);
        for (let i = 0; i < Math.min(points.length, 280); i++) {
            const q = points[
                Math.floor(Math.random() * points.length)
            ];
            const xx =
                q[0] * Math.cos(word.r) -
                q[1] * Math.sin(word.r);
            const yy =
                q[0] * Math.sin(word.r) +
                q[1] * Math.cos(word.r);
            particles.push({
                x: center.x + xx,
                y: center.y + yy,
                vx: (Math.random() - 0.5) * 1.3,
                vy: -0.4 - Math.random(),
                life: 1,
                radius: 0.5 + Math.random() * 1.5,
                phase: Math.random() * 6
            });
        }
        word.until = performance.now() + 1700;
    }
    function hit(x, y) {
        for (const word of words) {
            if (
                word.until &&
                performance.now() < word.until + 500
            ) {
                continue;
            }
            const p = position(word);
            const dx = x - p.x;
            const dy = y - p.y;
            const a =
                dx * Math.cos(word.r) +
                dy * Math.sin(word.r);
            const b =
                -dx * Math.sin(word.r) +
                dy * Math.cos(word.r);
            ctx.font = `${word.s * scale()}px system-ui`;
            const width = ctx.measureText(word.t).width;
            if (
                Math.abs(a) < width / 2 + 4 &&
                Math.abs(b) < word.s * scale() * 0.7
            ) {
                burst(word);
                break;
            }
        }
    }
    function draw(time) {
        ctx.clearRect(0, 0, W, H);
        for (const word of words) {
            const alpha = word.until
                ? Math.max(
                    0,
                    Math.min(1, (time - word.until) / 500)
                  )
                : 1;
            drawWord(word, alpha, time);
        }
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx + Math.sin(
                time * 0.003 + p.phase
            ) * 0.3;
            p.y += p.vy;
            p.life -= 0.012;
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            ctx.beginPath();
            ctx.globalAlpha = p.life * 0.7;
            ctx.fillStyle = mutedColor();
            ctx.arc(
                p.x,
                p.y,
                p.radius,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    function animate(time) {
        draw(time);
        requestAnimationFrame(animate);
    }
root.addEventListener("pointermove", (event) => {
      if (reducedMotion) return;
      if (performance.now() - lastHover < 180) return;
      const rect = canvas.getBoundingClientRect();
      hit(
          event.clientX - rect.left,
          event.clientY - rect.top
      );
      lastHover = performance.now();
  });
  root.addEventListener("click", (event) => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      hit(
          event.clientX - rect.left,
          event.clientY - rect.top
      );
  });
  resize();
  if (!reducedMotion) {
      requestAnimationFrame(animate);
  }
})();
