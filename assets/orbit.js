/* Orbit hero: particle globe + one orbit per app. Pauses offscreen; still frame for reduced motion. */
(function () {
  var c = document.getElementById('orbit'); if (!c || !c.getContext) return;
  var x = c.getContext('2d'), mq = matchMedia('(prefers-reduced-motion: reduce)'), rm = mq.matches;
  var W, H, D = Math.min(window.devicePixelRatio || 1, 2), running = false, visible = true, raf = 0;
  function rs() { W = c.width = c.offsetWidth * D; H = c.height = c.offsetHeight * D; if (!running) draw(0); }
  var pts = [], n = innerWidth < 640 ? 420 : 700;
  for (var i = 0; i < n; i++) { var u = Math.random() * 2 - 1, t = Math.random() * 6.283, k = Math.sqrt(1 - u * u); pts.push([k * Math.cos(t), u, k * Math.sin(t)]); }
  var orb = [['#38BDF8', 1.45, 0.35, 0.9], ['#C8893A', 1.75, -0.25, 0.6], ['#2DD4BF', 2.05, 0.15, 0.45]];
  function draw(ts) {
    var t = ts / 1000, mob = W < 700 * D, R = Math.min(W, H) * (mob ? 0.3 : 0.26), cx = W / 2, cy = H * (mob ? 0.8 : 0.6), a = rm ? 0.6 : t * 0.12;
    x.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) { var p = pts[i], X = p[0] * Math.cos(a) - p[2] * Math.sin(a), Z = p[0] * Math.sin(a) + p[2] * Math.cos(a);
      x.fillStyle = 'rgba(201,193,255,' + (0.12 + 0.5 * (Z + 1) / 2) + ')'; x.fillRect(cx + X * R, cy + p[1] * R, 1.6 * D, 1.6 * D); }
    for (var j = 0; j < orb.length; j++) { var o = orb[j], col = o[0], k = o[1], tl = o[2];
      x.strokeStyle = col + '55'; x.lineWidth = D; x.beginPath(); x.ellipse(cx, cy, R * k, R * k * 0.28, tl, 0, 6.283); x.stroke();
      var q = (rm ? 1 : t * o[3]) + k, px = Math.cos(q) * R * k, py = Math.sin(q) * R * k * 0.28;
      x.fillStyle = col; x.shadowColor = col; x.shadowBlur = 18 * D; x.beginPath();
      x.arc(cx + px * Math.cos(tl) - py * Math.sin(tl), cy + px * Math.sin(tl) + py * Math.cos(tl), 5 * D, 0, 6.283); x.fill(); x.shadowBlur = 0; }
  }
  function loop(ts) { draw(ts); raf = requestAnimationFrame(loop); }
  function sync() { var go = !rm && visible && !document.hidden; if (go && !running) { running = true; raf = requestAnimationFrame(loop); } else if (!go && running) { running = false; cancelAnimationFrame(raf); } }
  addEventListener('resize', rs); rs();
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; sync(); }).observe(c);
  document.addEventListener('visibilitychange', sync);
  if (mq.addEventListener) mq.addEventListener('change', function () { rm = mq.matches; sync(); if (rm) draw(0); });
  sync();
  /* chapter reveal */
  var els = document.querySelectorAll('.js-reveal');
  if (rm || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
  els.forEach(function (e) { io.observe(e); });
})();
