// タウンビュー全面の季節の演出（2D キャンバス、画面に固定）: 春 = 桜の花びら、秋 = 紅葉、冬 = 雪。夏は何も降らせない。
// 大木の周りの 3D の粒子（diorama.js）とは別に、画面全体にゆっくり降らせて季節感を出す。
export const WEATHER = {
  spring: { kind: 'petal', colors: ['#f7b6d2', '#f49ac1', '#fde2ec', '#f28cb8'], n: 90,  fall: [40, 85],  size: [5, 9],  drift: 45, spin: 1.6 },
  summer: null,
  autumn: { kind: 'leaf',  colors: ['#e0522f', '#f08a24', '#f2b53a', '#c7391f', '#e8742a'], n: 70, fall: [50, 100], size: [6, 11], drift: 55, spin: 2.2 },
  winter: { kind: 'snow',  colors: ['#ffffff', '#f2f6fb', '#e6edf5'], n: 150, fall: [25, 60], size: [2, 5], drift: 22, spin: 0 },
};
const rnd = (a, b) => a + Math.random() * (b - a);

export function createWeatherFx(canvas, seasonName = 'autumn') {
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, dpr = 1, cfg = null, parts = [], alive = true, raf = 0, last = performance.now();
  function resize() {
    w = canvas.clientWidth || innerWidth; h = canvas.clientHeight || innerHeight; dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (cfg) populate();
  }
  function spawn(p, fromTop) {
    p.x = rnd(-20, w + 20); p.y = fromTop ? rnd(-h * 0.2, -10) : rnd(-10, h);
    p.vy = rnd(cfg.fall[0], cfg.fall[1]); p.s = rnd(cfg.size[0], cfg.size[1]); p.c = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
    p.ph = rnd(0, 6.28); p.fq = rnd(0.5, 1.2); p.rot = rnd(0, 6.28); p.spin = rnd(-1, 1) * cfg.spin; p.a = rnd(0.65, 0.95);
  }
  function populate() {
    const n = Math.round(cfg.n * Math.min(2, (w * h) / (1440 * 900)));   // 画面の広さに応じて数を変える
    parts = Array.from({ length: n }, () => { const p = {}; spawn(p, false); return p; });
  }
  function draw(p) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
    if (cfg.kind === 'snow') { ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 6.28); ctx.fill(); }
    else {
      ctx.rotate(p.rot); ctx.beginPath();
      if (cfg.kind === 'petal') ctx.ellipse(0, 0, p.s, p.s * 0.62, 0, 0, 6.28);     // 花びら: 楕円
      else { ctx.moveTo(-p.s, 0); ctx.quadraticCurveTo(0, -p.s * 0.9, p.s, 0); ctx.quadraticCurveTo(0, p.s * 0.9, -p.s, 0); }   // 葉: 両端のとがった形
      ctx.fill();
    }
    ctx.restore();
  }
  function frame(now) {
    if (!alive) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    ctx.clearRect(0, 0, w, h);
    if (cfg) {
      const t = now / 1000;
      for (const p of parts) {
        p.y += p.vy * dt; p.x += (Math.sin(t * p.fq + p.ph) * cfg.drift + 12) * dt; p.rot += p.spin * dt;
        if (p.y > h + 20 || p.x > w + 40) spawn(p, true);
        draw(p);
      }
    }
    raf = requestAnimationFrame(frame);
  }
  function setSeason(name) {
    cfg = reduced ? null : WEATHER[name] || null;
    if (cfg) populate(); else { parts = []; ctx.clearRect(0, 0, w, h); }
  }
  addEventListener('resize', resize); resize(); setSeason(seasonName);
  raf = requestAnimationFrame(frame);
  return { setSeason, dispose() { alive = false; cancelAnimationFrame(raf); removeEventListener('resize', resize); } };
}
