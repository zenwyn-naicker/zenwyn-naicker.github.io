(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Navigation background once the page scrolls
     ------------------------------------------------------------------ */
  const nav = document.getElementById('nav');
  const onScrollNav = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------ */
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal], .tl').forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     Copy email address
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    let timer;
    btn.addEventListener('click', async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        ok = true;
      } catch {
        // Older browsers: copy through a temporary text field.
        const field = document.createElement('textarea');
        field.value = btn.dataset.copy;
        field.setAttribute('readonly', '');
        field.style.cssText = 'position:fixed;opacity:0';
        document.body.append(field);
        field.select();
        ok = document.execCommand('copy');
        field.remove();
      }
      btn.textContent = ok ? 'Copied' : 'Copy failed';
      btn.classList.toggle('is-done', ok);
      clearTimeout(timer);
      timer = setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('is-done'); }, 1800);
    });
  });

  /* ------------------------------------------------------------------
     Banner: drifting code from my projects, with a spotlight
     ------------------------------------------------------------------ */
  const SNIPPETS = [
    'public async Task<IActionResult> Submit(ClaimViewModel model)',
    'var route = MeshRouting.FindRoute(tree, deviceId);',
    'builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme);',
    'if (!ModelState.IsValid) return View(model);',
    'await _context.SaveChangesAsync(cancellationToken);',
    'services.AddScoped<IContractService, ContractService>();',
    'public sealed record TelemetryReading(string SensorId, double Value);',
    'var tree = new MeshMinimumSpanningTree(graph).Build(gateway);',
    'return Ok(await _quotes.EstimateAsync(request));',
    '[Authorize(Roles = "Staff")]',
    'foreach (var reading in history.Range(from, to)) yield return reading;',
    'var token = _jwt.CreateToken(user, TimeSpan.FromHours(1));',
    'public interface ICurrencyConversionStrategy { decimal Convert(decimal usd); }',
    'modelBuilder.Entity<Contract>().HasMany(c => c.ServiceRequests);',
    'throw new InvalidOperationException("Contract is not active.");',
    'app.MapGet("/api/health", () => Results.Ok("Healthy"));',
  ];
  const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const banner = document.getElementById('banner');
  const codeDim = document.getElementById('code-dim');
  const codeLit = document.getElementById('code-lit');

  if (banner && codeDim && codeLit) {
    const rows = 14;
    const frag = document.createDocumentFragment();
    for (let r = 0; r < rows; r++) {
      // Rotate the snippet list so each row starts somewhere different.
      const offset = (r * 5) % SNIPPETS.length;
      const ordered = SNIPPETS.slice(offset).concat(SNIPPETS.slice(0, offset));
      const line = ordered.map(escapeHtml).join('<span class="g"></span>');
      const row = document.createElement('div');
      row.innerHTML = `<div class="code-track" style="--dur:${70 + ((r * 17) % 50)}s;--dir:${r % 2 ? 'reverse' : 'normal'}"><span>${line}</span><span>${line}</span></div>`;
      frag.append(row);
    }
    codeDim.append(frag.cloneNode(true));
    codeLit.append(frag);

    // Spotlight follows the pointer; drifts on its own when idle.
    let tx = 72, ty = 38, x = tx, y = ty, lastMove = -Infinity, bannerVisible = true;
    banner.addEventListener('pointermove', (e) => {
      const rect = banner.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width) * 100;
      ty = ((e.clientY - rect.top) / rect.height) * 100;
      lastMove = performance.now();
    });
    new IntersectionObserver(([e]) => { bannerVisible = e.isIntersecting; if (bannerVisible) requestAnimationFrame(loop); }).observe(banner);

    const loop = (now) => {
      if (!bannerVisible) return;
      if (now - lastMove > 2500 && !reduceMotion) {
        tx = 50 + 34 * Math.sin(now / 5200);
        ty = 46 + 24 * Math.sin(now / 3700);
      }
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      banner.style.setProperty('--mx', x.toFixed(2) + '%');
      banner.style.setProperty('--my', y.toFixed(2) + '%');
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ------------------------------------------------------------------
     Phone status bars
     ------------------------------------------------------------------ */
  const STATUS_ICONS =
    '<svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>' +
    '<svg viewBox="0 0 16 12"><path d="M8 2.2c2.4 0 4.6.9 6.3 2.5l1.3-1.4A10.9 10.9 0 0 0 8 .3 10.9 10.9 0 0 0 .4 3.3l1.3 1.4A9 9 0 0 1 8 2.2Zm0 3.8c1.4 0 2.6.5 3.6 1.4l1.3-1.4A7.2 7.2 0 0 0 8 4.1c-1.9 0-3.6.7-4.9 1.9l1.3 1.4C5.4 6.5 6.6 6 8 6Zm0 3.7L9.9 7.9a2.8 2.8 0 0 0-3.8 0L8 9.7Z" transform="translate(0 1.4)"/></svg>' +
    '<svg viewBox="0 0 26 12"><rect x="0.6" y="0.6" width="21.8" height="10.8" rx="3" fill="none" stroke="#15161a" stroke-width="1.2" opacity=".45"/><rect x="2.4" y="2.4" width="15.5" height="7.2" rx="1.6"/><rect x="23.6" y="3.8" width="1.8" height="4.4" rx=".9" opacity=".45"/></svg>';
  document.querySelectorAll('.statusbar').forEach((bar) => {
    bar.innerHTML = `<span>9:41</span><span class="statusbar__icons">${STATUS_ICONS}</span>`;
  });

  /* ------------------------------------------------------------------
     Device demos
     Each step shows one real screenshot. Optional actions:
       tap:    [x, y] as fractions of the image, clicked near the end
       scroll: 0..1 of the image's overflow, animated during the step
       enter:  'slide' (default) or 'fade'
       same:   reuse the previous screenshot without a transition
     ------------------------------------------------------------------ */
  const ASSET = 'assets/projects/';
  // Clips play faster than real time so they read as a quick showcase, not a walkthrough.
  const CLIP_SPEED = 2;
  const DEMOS = {
    'dc-mobile': {
      ar: 390 / 844, kind: 'touch', delay: 600,
      steps: [
        { src: 'dc/m-home.jpg', w: 390, h: 844, tap: [0.48, 0.629], d: 1800 },
        { src: 'dc/m-quote.jpg', w: 390, h: 844, tap: [0.5, 0.955], d: 1800 },
      ],
    },
    'hh-mobile': {
      ar: 375 / 812, kind: 'touch', delay: 800,
      steps: [
        { src: 'hh/mobile.jpg', w: 375, h: 1154, tap: [0.224, 0.466], tapAt: 600, scroll: 1, scrollAt: 900, scrollDur: 1300, d: 2600 },
        { same: true, scroll: 0, scrollAt: 100, scrollDur: 900, d: 1300 },
      ],
    },
  };

  const CURSOR_SVG = '<svg viewBox="0 0 20 24" aria-hidden="true"><path d="M2.5 1.8v17.4l4.6-4.4 3 6.8 3-1.3-3-6.7h6.4z"/></svg>';

  class Demo {
    constructor(vp, cfg) {
      this.vp = vp;
      this.cfg = cfg;
      this.steps = cfg.steps;
      this.ar = cfg.ar;
      this.i = 0;
      this.cur = null;
      this.pos = 0;
      this.token = 0;
      this.playing = false;
      this.started = false;
      vp.style.setProperty('--ar', cfg.ar);

      // Map each step to a layer; "same" steps reuse the previous one.
      this.layers = [];
      this.layerOf = [];
      this.steps.forEach((s, idx) => {
        if (s.same) {
          this.layerOf[idx] = this.layerOf[idx - 1];
          Object.assign(s, { src: this.steps[idx - 1].src, w: this.steps[idx - 1].w, h: this.steps[idx - 1].h });
          return;
        }
        const layer = document.createElement('div');
        layer.className = 'layer';
        const img = document.createElement('img');
        img.alt = '';
        img.decoding = 'async';
        img.draggable = false;
        img.width = s.w;
        img.height = s.h;
        img.dataset.src = ASSET + s.src;
        layer.append(img);
        vp.append(layer);
        this.layerOf[idx] = this.layers.length;
        this.layers.push({ layer, img });
      });

      this.pointer = document.createElement('div');
      if (cfg.kind === 'pointer') {
        this.pointer.className = 'cursor';
        this.pointer.innerHTML = CURSOR_SVG;
      } else {
        this.pointer.className = 'touch';
      }
      vp.append(this.pointer);
      this.show(0, 'instant');
    }

    load() {
      if (this.loaded) return;
      this.loaded = true;
      for (const { img } of this.layers) img.src = img.dataset.src;
    }

    // Image height relative to the viewport height, and how far it can scroll.
    geom(idx) {
      const s = this.steps[idx];
      const imgRel = (s.h / s.w) * this.ar;
      return { imgRel, maxRel: Math.max(0, imgRel - 1) };
    }

    setScroll(idx, pos, dur) {
      const { imgRel, maxRel } = this.geom(idx);
      const img = this.layers[this.layerOf[idx]].img;
      img.style.transitionDuration = `${dur}ms`;
      img.style.transform = `translate3d(0, ${(-(pos * maxRel) / imgRel) * 100}%, 0)`;
      this.pos = pos;
    }

    pointAt(idx, fx, fy, pos) {
      const { imgRel, maxRel } = this.geom(idx);
      return [fx * 100, (fy * imgRel - pos * maxRel) * 100];
    }

    show(idx, mode) {
      const li = this.layerOf[idx];
      const prevI = this.cur;
      if (prevI === li) return;
      const next = this.layers[li].layer;
      const prev = prevI == null ? null : this.layers[prevI].layer;
      clearTimeout(this.leaveTimer);
      this.layers.forEach((L, k) => { if (k !== li && k !== prevI) L.layer.className = 'layer'; });
      if (mode === 'instant' || !prev) {
        next.className = 'layer is-active is-instant';
        if (prev) prev.className = 'layer';
      } else {
        next.className = `layer from-${mode}`;
        void next.offsetWidth;
        next.className = 'layer is-active';
        prev.className = `layer to-${mode}`;
        this.leaveTimer = setTimeout(() => { if (this.cur !== prevI) prev.className = 'layer'; }, 900);
      }
      this.cur = li;
    }

    ripple(x, y) {
      const r = document.createElement('span');
      r.className = 'ripple';
      r.style.left = `${x}%`;
      r.style.top = `${y}%`;
      this.vp.append(r);
      r.addEventListener('animationend', () => r.remove());
    }

    moveCursor(x, y) {
      this.pointer.style.left = `${x}%`;
      this.pointer.style.top = `${y}%`;
    }

    click(x, y) {
      this.pointer.classList.remove('is-press');
      void this.pointer.offsetWidth;
      this.pointer.classList.add('is-press');
      this.ripple(x, y);
    }

    touch(x, y) {
      this.pointer.style.left = `${x}%`;
      this.pointer.style.top = `${y}%`;
      this.pointer.classList.remove('is-tap');
      void this.pointer.offsetWidth;
      this.pointer.classList.add('is-tap');
      setTimeout(() => this.ripple(x, y), 140);
    }

    sleep(ms, tok) {
      return new Promise((resolve) => setTimeout(resolve, ms)).then(() => tok === this.token);
    }

    play() {
      if (this.playing) return;
      this.playing = true;
      this.run('resume');
    }

    pause() {
      if (!this.playing) return;
      this.playing = false;
      this.token++;
    }

    async run(firstMode) {
      const tok = ++this.token;
      let mode = firstMode;
      while (tok === this.token) {
        await this.step(this.i, tok, mode);
        if (tok !== this.token) return;
        mode = null;
        this.i = (this.i + 1) % this.steps.length;
      }
    }

    async step(idx, tok, mode) {
      const s = this.steps[idx];
      const d = s.d || 3000;

      if (!s.same || mode) {
        const base = s.same ? idx - 1 : idx;
        this.setScroll(base, mode && s.same ? this.pos : 0, 0);
        this.show(idx, mode ? 'instant' : (s.enter || 'slide'));
      }

      const events = [];
      const scrollAt = s.scrollAt ?? 650;
      const scrollDur = s.scrollDur ?? 1500;
      if (s.scroll != null) events.push([scrollAt, () => this.setScroll(idx, s.scroll, scrollDur)]);
      if (s.tap) {
        const tapAt = s.tapAt ?? d - 300;
        const posAtTap = s.scroll != null && tapAt >= scrollAt + scrollDur ? s.scroll : (s.same ? this.pos : 0);
        const [x, y] = this.pointAt(idx, s.tap[0], s.tap[1], posAtTap);
        if (this.cfg.kind === 'pointer') {
          events.push([Math.max(0, tapAt - 900), () => this.moveCursor(x, y)]);
          events.push([tapAt, () => this.click(x, y)]);
        } else {
          events.push([Math.max(0, tapAt - 150), () => this.touch(x, y)]);
        }
      }
      events.sort((a, b) => a[0] - b[0]);

      let t = 0;
      for (const [at, fn] of events) {
        if (at > t) {
          if (!(await this.sleep(at - t, tok))) return;
          t = at;
        }
        fn();
      }
      await this.sleep(Math.max(0, d - t), tok);
    }
  }

  const stages = [];
  document.querySelectorAll('.project__stage').forEach((stageEl) => {
    const demos = [...stageEl.querySelectorAll('[data-demo]')].map((vp) => new Demo(vp, DEMOS[vp.dataset.demo]));
    const clips = [...stageEl.querySelectorAll('video.clip')];
    stages.push({ el: stageEl, demos, clips, visible: false });
  });

  const playStage = (stage) => {
    if (reduceMotion || document.hidden) return;
    for (const clip of stage.clips) {
      // An optional start offset keeps paired clips from changing scene at the same moment.
      if (clip.dataset.start && !clip.dataset.offsetDone) {
        clip.dataset.offsetDone = '1';
        const seek = () => { clip.currentTime = Number(clip.dataset.start); };
        if (clip.readyState >= 1) seek(); else clip.addEventListener('loadedmetadata', seek, { once: true });
      }
      clip.defaultPlaybackRate = CLIP_SPEED;
      clip.playbackRate = CLIP_SPEED;
      clip.play().catch(() => {});
    }
    for (const demo of stage.demos) {
      if (!demo.started && demo.cfg.delay) {
        demo.started = true;
        demo.delayTimer = setTimeout(() => { if (stage.visible && !document.hidden) demo.play(); }, demo.cfg.delay);
      } else {
        demo.started = true;
        demo.play();
      }
    }
  };
  const pauseStage = (stage) => {
    for (const clip of stage.clips) clip.pause();
    for (const demo of stage.demos) {
      clearTimeout(demo.delayTimer);
      demo.pause();
    }
  };

  // Load screenshots a little before a stage scrolls into view.
  const preloadObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const stage = stages.find((s) => s.el === entry.target);
      stage.demos.forEach((d) => d.load());
      stage.clips.forEach((clip) => { clip.src = clip.dataset.src; clip.load(); });
      preloadObserver.unobserve(entry.target);
    }
  }, { rootMargin: '700px 0px' });

  const playObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const stage = stages.find((s) => s.el === entry.target);
      const visible = entry.intersectionRatio >= 0.3;
      if (visible === stage.visible) continue;
      stage.visible = visible;
      if (visible) playStage(stage);
      else pauseStage(stage);
    }
  }, { threshold: [0, 0.3, 0.6] });

  for (const stage of stages) {
    preloadObserver.observe(stage.el);
    playObserver.observe(stage.el);
  }

  document.addEventListener('visibilitychange', () => {
    for (const stage of stages) {
      if (document.hidden) pauseStage(stage);
      else if (stage.visible) playStage(stage);
    }
  });

  /* ------------------------------------------------------------------
     Timeline: the rail fills as you scroll and lights each milestone
     ------------------------------------------------------------------ */
  const timeline = document.getElementById('timeline');
  if (timeline) {
    const items = [...timeline.querySelectorAll('.tl')];
    const dots = items.map((li) => li.querySelector('.tl__dot'));
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const line = vh * 0.62;
      const rect = timeline.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (line - rect.top) / rect.height));
      timeline.style.setProperty('--p', p.toFixed(4));
      items.forEach((li, k) => {
        const r = dots[k].getBoundingClientRect();
        li.classList.toggle('is-lit', r.top + r.height / 2 < line);
      });
    };
    const request = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
  }
})();
