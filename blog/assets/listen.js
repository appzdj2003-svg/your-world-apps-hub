/* Listen: read the article aloud with the browser's Web Speech API. No external services. */
(function () {
  var bar = document.getElementById('listen'), art = document.querySelector('.article-body');
  if (!bar || !art) return;
  var ss = window.speechSynthesis;
  if (!ss || typeof SpeechSynthesisUtterance === 'undefined') { bar.hidden = true; return; }
  bar.hidden = false;
  var play = bar.querySelector('.l-play'), stop = bar.querySelector('.l-stop'), rate = bar.querySelector('.l-rate'),
      status = bar.querySelector('.l-status'), prog = bar.querySelector('.l-progress span');
  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var title = document.querySelector('.article-head h1');
  var nodes = [title].concat([].slice.call(art.querySelectorAll('h2,h3,p,li'))).filter(function (n) {
    if (!n || !n.textContent.trim()) return false;
    if (n.closest('.cta, pre, code, nav, .no-listen')) return false;
    var d = n.closest('.disclaimer, .note'); if (d && d.getAttribute('data-read') !== 'true') return false;
    if (n.tagName === 'P' && n.parentNode.tagName === 'LI') return false;
    return true;
  });
  var disc = nodes.filter(function (n) { return n.closest('.disclaimer'); });
  nodes = nodes.filter(function (n) { return !n.closest('.disclaimer'); }).concat(disc); /* disclaimer read last */
  var i = 0, state = 'idle', voice = null, cur = null;
  function pickVoice() {
    var v = ss.getVoices().filter(function (x) { return /^en(-|_|$)/i.test(x.lang); });
    var pref = v.filter(function (x) { return /natural|neural|online|google|samantha|daniel|aria|jenny/i.test(x.name); });
    voice = pref[0] || v.filter(function (x) { return x.default; })[0] || v[0] || null;
  }
  pickVoice(); if (ss.addEventListener) ss.addEventListener('voiceschanged', pickVoice);
  function say(s) { status.textContent = s; }
  function mark(n) {
    if (cur) cur.classList.remove('speaking');
    cur = n; if (!n) return;
    n.classList.add('speaking');
    var r = n.getBoundingClientRect();
    if (r.top < 80 || r.bottom > innerHeight - 40) n.scrollIntoView({ behavior: rm ? 'auto' : 'smooth', block: 'center' });
  }
  function setBtn() {
    var on = state === 'playing';
    play.setAttribute('aria-pressed', on ? 'true' : 'false');
    play.querySelector('span').textContent = on ? 'Pause' : (state === 'paused' ? 'Resume' : 'Listen');
    play.querySelector('i').textContent = on ? '❚❚' : '▶';
    stop.disabled = state === 'idle';
  }
  function speakFrom(k) {
    if (k >= nodes.length) { end(); say('Finished.'); return; }
    i = k; mark(nodes[k]);
    prog.style.width = Math.round(k / nodes.length * 100) + '%';
    var u = new SpeechSynthesisUtterance(nodes[k].textContent.replace(/\s+/g, ' ').trim());
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-US';
    u.rate = parseFloat(rate.value) || 1;
    u.onend = function () { if (state === 'playing' && u === cur_u) speakFrom(i + 1); };
    u.onerror = function (e) { if (e.error !== 'interrupted' && e.error !== 'canceled') { end(); say('Playback stopped.'); } };
    cur_u = u; ss.speak(u);
  }
  var cur_u = null;
  function end() { state = 'idle'; cur_u = null; ss.cancel(); mark(null); prog.style.width = '0%'; i = 0; setBtn(); }
  play.addEventListener('click', function () {
    if (state === 'playing') { state = 'paused'; ss.pause(); say('Paused.'); }
    else if (state === 'paused') { state = 'playing'; ss.resume(); if (!ss.speaking) speakFrom(i); say('Playing.'); }
    else { state = 'playing'; ss.cancel(); speakFrom(0); say('Playing article.'); }
    setBtn();
  });
  stop.addEventListener('click', function () { end(); say('Stopped.'); });
  rate.addEventListener('change', function () { /* restart current paragraph at new speed */
    if (state === 'playing') { cur_u = null; ss.cancel(); speakFrom(i); }
    say('Speed ' + rate.value + 'x.');
  });
  function hide() { if (state !== 'idle') end(); }
  addEventListener('pagehide', hide);
  document.addEventListener('visibilitychange', function () { if (document.hidden) hide(); });
  setBtn();
})();
