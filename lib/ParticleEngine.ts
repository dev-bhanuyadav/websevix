export interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  life: number;
  decay: number;
  size: number;
  color: string;
  type: "streak" | "orb" | "spark" | "mega";
  trail: { x: number; y: number }[];
  blur: number;
  rotation: number;
  rotationSpeed: number;
}

interface RingData {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  color: string;
  speed: number;
  lineWidth: number;
}

export class ParticleEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: ParticleData[] = [];
  rings: RingData[] = [];
  private _animId = 0;
  private _running = false;
  private _lastTime = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2d context");
    this.ctx = ctx;
    this.resize();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.parentElement?.getBoundingClientRect()
      ?? this.canvas.getBoundingClientRect();
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  get width() { return this.canvas.width / (window.devicePixelRatio || 1); }
  get height() { return this.canvas.height / (window.devicePixelRatio || 1); }

  explode(x: number, y: number, opts?: { mult?: number }) {
    const m = opts?.mult ?? 1;

    // TYPE A — Fast streaks (indigo/violet)
    for (let i = 0; i < Math.round(30 * m); i++) {
      const angle = (Math.PI * 2 * i) / 30 + (Math.random() - 0.5) * 0.5;
      const speed = 300 + Math.random() * 500;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ax: -Math.cos(angle) * 600,
        ay: -Math.sin(angle) * 600,
        life: 1, decay: 0.02 + Math.random() * 0.01,
        size: 7 + Math.random() * 5,
        color: Math.random() > 0.5 ? "#6366F1" : "#8B5CF6",
        type: "streak", trail: [], blur: 0,
        rotation: angle, rotationSpeed: 0,
      });
    }

    // TYPE B — Glowing orbs (cyan/violet)
    for (let i = 0; i < Math.round(20 * m); i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 220;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ax: 0, ay: 50,
        life: 1, decay: 0.014 + Math.random() * 0.008,
        size: 2.5 + Math.random() * 3.5,
        color: Math.random() > 0.5 ? "#06B6D4" : "#A78BFA",
        type: "orb", trail: [], blur: 4,
        rotation: 0, rotationSpeed: 0,
      });
    }

    // TYPE C — Sparks (white streaks with trails)
    for (let i = 0; i < Math.round(20 * m); i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 200 + Math.random() * 700;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ax: 0, ay: 80,
        life: 1, decay: 0.01 + Math.random() * 0.005,
        size: 1.5, color: "#ffffff",
        type: "spark", trail: [], blur: 0,
        rotation: 0, rotationSpeed: 0,
      });
    }

    // TYPE D — Large slow mega orbs
    for (let i = 0; i < Math.round(10 * m); i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 90;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ax: 0, ay: 0,
        life: 1, decay: 0.012,
        size: 8 + Math.random() * 7,
        color: Math.random() > 0.5 ? "#8B5CF6" : "#6366F1",
        type: "mega", trail: [], blur: 12,
        rotation: 0, rotationSpeed: 0,
      });
    }

    this._ensureRunning();
  }

  addRing(x: number, y: number, opts?: { color?: string; speed?: number; maxRadius?: number }) {
    this.rings.push({
      x, y,
      radius: 1,
      maxRadius: opts?.maxRadius ?? 1400,
      life: 1,
      color: opts?.color ?? "rgba(99,102,241,0.9)",
      speed: opts?.speed ?? 900,
      lineWidth: 2.5,
    });
    this._ensureRunning();
  }

  addImplosion(x: number, y: number) {
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 240;
      const sx = x + Math.cos(angle) * dist;
      const sy = y + Math.sin(angle) * dist;
      const toAngle = Math.atan2(y - sy, x - sx);
      const speed = 180 + Math.random() * 180;
      this.particles.push({
        x: sx, y: sy,
        vx: Math.cos(toAngle) * speed,
        vy: Math.sin(toAngle) * speed,
        ax: 0, ay: 0,
        life: 1, decay: 0.02,
        size: 1.5 + Math.random() * 2.5,
        color: Math.random() > 0.5 ? "#6366F1" : "#06B6D4",
        type: "orb", trail: [], blur: 3,
        rotation: 0, rotationSpeed: 0,
      });
    }
    this._ensureRunning();
  }

  confetti(x: number, y: number) {
    const colors = ["#F59E0B", "#10B981", "#6366F1", "#EC4899", "#F97316", "#06B6D4", "#A78BFA"];
    for (let i = 0; i < 50; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
      const speed = 150 + Math.random() * 380;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 80,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ax: (Math.random() - 0.5) * 80,
        ay: 450,
        life: 1, decay: 0.006,
        size: 4 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: "orb", trail: [], blur: 0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 8,
      });
    }
    this._ensureRunning();
  }

  microParticle(x: number, y: number) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 30,
      y,
      vx: (Math.random() - 0.5) * 18,
      vy: -(35 + Math.random() * 55),
      ax: 0, ay: 5,
      life: 1, decay: 0.011,
      size: 1, color: "#818CF8",
      type: "orb", trail: [], blur: 2,
      rotation: 0, rotationSpeed: 0,
    });
    this._ensureRunning();
  }

  errorBurst(x: number, y: number) {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 140;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ax: 0, ay: 100,
        life: 1, decay: 0.03,
        size: 2 + Math.random() * 2,
        color: "#EF4444",
        type: "orb", trail: [], blur: 4,
        rotation: 0, rotationSpeed: 0,
      });
    }
    this._ensureRunning();
  }

  private _ensureRunning() {
    if (this._running) return;
    this._running = true;
    this._lastTime = performance.now();
    const loop = (now: number) => {
      if (!this._running) return;
      const dt = Math.min((now - this._lastTime) / 1000, 0.05);
      this._lastTime = now;
      this._tick(dt);
      this._animId = requestAnimationFrame(loop);
    };
    this._animId = requestAnimationFrame(loop);
  }

  private _tick(dt: number) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    ctx.clearRect(0, 0, w, h);

    // Draw rings
    this.rings = this.rings.filter((r) => r.life > 0);
    for (const r of this.rings) {
      r.radius += r.speed * dt;
      r.life = Math.max(0, 1 - r.radius / r.maxRadius);
      const lw = Math.max(0.3, r.lineWidth * (1 - (r.radius / r.maxRadius) * 0.85));
      ctx.save();
      ctx.globalAlpha = r.life * 0.9;
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = r.color;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Draw particles
    this.particles = this.particles.filter((p) => p.life > 0);
    for (const p of this.particles) {
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 6) p.trail.shift();
      p.vx += p.ax * dt;
      p.vy += p.ay * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= p.decay;
      p.rotation += p.rotationSpeed * dt;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.globalCompositeOperation = "lighter";
      switch (p.type) {
        case "streak": this.drawStreak(p); break;
        case "orb":    this.drawOrb(p);    break;
        case "spark":  this.drawSpark(p);  break;
        case "mega":   this.drawMega(p);   break;
      }
      ctx.restore();
    }

    if (this.particles.length === 0 && this.rings.length === 0) {
      this._running = false;
      ctx.clearRect(0, 0, w, h);
    }
  }

  drawStreak(p: ParticleData) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    const len = p.size * (0.5 + p.life * 0.5);
    const grad = ctx.createLinearGradient(-len / 2, 0, len / 2, 0);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.4, p.color + "cc");
    grad.addColorStop(0.6, p.color);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(-len / 2, -1, len, 2);
    ctx.restore();
  }

  drawOrb(p: ParticleData) {
    const ctx = this.ctx;
    const r = p.size;
    if (p.blur > 0) ctx.filter = `blur(${p.blur * p.life}px)`;
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.3, p.color);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    if (p.blur > 0) ctx.filter = "none";
  }

  drawSpark(p: ParticleData) {
    const ctx = this.ctx;
    if (p.trail.length > 1) {
      for (let i = 1; i < p.trail.length; i++) {
        const t = i / p.trail.length;
        ctx.save();
        ctx.globalAlpha = p.life * t * 0.7;
        ctx.strokeStyle = `rgba(255,255,255,${t})`;
        ctx.lineWidth = p.size * t;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
        ctx.lineTo(p.trail[i].x, p.trail[i].y);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  drawMega(p: ParticleData) {
    const ctx = this.ctx;
    const pulse = 1 + Math.sin(p.life * Math.PI * 5) * 0.18;
    const r = p.size * pulse;
    ctx.filter = `blur(${p.blur * p.life * 0.8}px)`;
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.25, p.color);
    grad.addColorStop(0.65, p.color + "80");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.filter = "none";
  }

  clear() {
    this.particles = [];
    this.rings = [];
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  destroy() {
    this._running = false;
    cancelAnimationFrame(this._animId);
    this.clear();
  }
}
