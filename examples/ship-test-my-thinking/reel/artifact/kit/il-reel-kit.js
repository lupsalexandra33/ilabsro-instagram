/* Innovation Labs Reel Kit — deterministic timeline + IL motion components.
 *
 * Every frame is a pure function of time: seek(t) recomputes every animated property from the
 * registered tracks. That is what lets render.mjs capture frame N identically on every run, and
 * lets the same file play live in a browser for human review.
 *
 * This is a toolkit, not a template. It gives you motion primitives (appear, write, draw, marks,
 * chat, camera, outro); the Reel's concept, layout and copy are written fresh for every brief.
 */
(function () {
  'use strict';
  const W = 1080, H = 1920;
  const params = new URLSearchParams(location.search);
  const RENDER = params.has('render');
  const script = document.currentScript;
  const KIT_URL = script ? new URL('.', script.src).href : new URL('./kit/', location.href).href;
  const ASSETS_URL = new URL('../assets/', KIT_URL).href;

  // ---------- easing ----------
  const EASE = {
    linear: (t) => t,
    in: (t) => t * t * t,
    out: (t) => 1 - Math.pow(1 - t, 3),
    outQuart: (t) => 1 - Math.pow(1 - t, 4),
    inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    // soft settle: a hint of overshoot, never a bounce
    settle: (t) => { const c1 = 0.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    // pen: quick start, careful finish — reads as a hand drawing
    pen: (t) => (t < 0.15 ? (t / 0.15) * 0.22 : 0.22 + 0.78 * (1 - Math.pow(1 - (t - 0.15) / 0.85, 2.2))),
  };
  const ease = (e) => (typeof e === 'function' ? e : EASE[e] || EASE.out);

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const DEFAULTS = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, blur: 0, reveal: 1, draw: 1, revealY: 1 };
  const $ = (sel, root) => (typeof sel === 'string' ? (root || document).querySelector(sel) : sel);
  const lerp = (a, b, p) => a + (b - a) * p;
  const geomLen = new WeakMap();

  function geometryOf(el) {
    if (el instanceof SVGGeometryElement) return [el];
    return Array.from(el.querySelectorAll('path, line, polyline, polygon, circle, ellipse, rect'));
  }
  function lengthOf(g) {
    if (!geomLen.has(g)) { try { geomLen.set(g, g.getTotalLength()); } catch (e) { geomLen.set(g, 0); } }
    return geomLen.get(g);
  }

  class Reel {
    constructor(opts, stage) {
      this.duration = opts.duration;
      this.fps = opts.fps || 30;
      this.stage = stage;
      this.tracks = new Map();   // el -> { prop -> [track] }
      this.fns = [];             // custom per-frame callbacks
      this.reads = [];           // reading-time lint registry
      this.rand = mulberry32(opts.seed || 2027);
      this.k = 1;                // preview scale factor (1 when rendering)
      this.meta = { title: opts.title || document.title, family: opts.family || '', ending: opts.ending || '' };
    }

    // ---- core ----
    tween(target, { t, dur = 0.5, from = {}, to = {}, ease: e = 'out' }) {
      const el = $(target);
      if (!el) throw new Error('tween target not found: ' + target);
      if (!this.tracks.has(el)) this.tracks.set(el, {});
      const props = this.tracks.get(el);
      const keys = new Set([...Object.keys(from), ...Object.keys(to)]);
      for (const k of keys) {
        if (!(k in DEFAULTS)) throw new Error('unknown prop ' + k);
        (props[k] = props[k] || []).push({ t, dur: Math.max(dur, 1e-4), from: from[k], to: to[k] ?? from[k], ease: ease(e) });
        props[k].sort((a, b) => a.t - b.t);
      }
      return this;
    }
    set(target, t, to) { return this.tween(target, { t, dur: 1e-4, to, ease: 'linear' }); }
    fn(t0, t1, cb) { this.fns.push({ t0, t1, cb }); return this; }

    valueAt(list, k, T) {
      let v = DEFAULTS[k];
      for (let i = 0; i < list.length; i++) {
        const tr = list[i];
        const f = tr.from ?? v;
        if (T < tr.t) { if (i === 0 && tr.from !== undefined) v = tr.from; break; }
        if (T < tr.t + tr.dur) { v = lerp(f, tr.to, tr.ease((T - tr.t) / tr.dur)); return v; }
        v = tr.to;
      }
      return v;
    }

    seek(T) {
      for (const [el, props] of this.tracks) {
        const v = {};
        for (const k in props) v[k] = this.valueAt(props[k], k, T);
        const s = el.style;
        if ('opacity' in v) { s.opacity = v.opacity.toFixed(4); s.visibility = v.opacity <= 0.001 ? 'hidden' : 'visible'; }
        if ('x' in v || 'y' in v || 'scale' in v || 'rotate' in v) {
          s.transform = `translate(${(v.x ?? 0).toFixed(2)}px, ${(v.y ?? 0).toFixed(2)}px) rotate(${(v.rotate ?? 0).toFixed(3)}deg) scale(${(v.scale ?? 1).toFixed(4)})`;
        }
        if ('blur' in v) s.filter = v.blur > 0.01 ? `blur(${v.blur.toFixed(2)}px)` : 'none';
        if ('reveal' in v) applyReveal(el, v.reveal, 'x');
        if ('revealY' in v) applyReveal(el, v.revealY, 'y');
        if ('draw' in v) applyDraw(el, v.draw);
      }
      for (const f of this.fns) f.cb(Math.min(Math.max(T, f.t0), f.t1) - f.t0, T);
      this.now = T;
    }

    // ---- convenience motion ----
    appear(target, t, { dur = 0.5, y = 26, x = 0, scale = 1, ease: e = 'out' } = {}) {
      return this.tween(target, { t, dur, from: { opacity: 0, y, x, scale }, to: { opacity: 1, y: 0, x: 0, scale: 1 }, ease: e });
    }
    vanish(target, t, { dur = 0.35, y = -18, ease: e = 'in' } = {}) {
      return this.tween(target, { t, dur, to: { opacity: 0, y }, ease: e });
    }
    /** handwriting-style left-to-right ink reveal for text (use .il-hand) */
    write(target, t, dur = 0.8, e = 'pen') {
      this.set(target, 0, { opacity: 0 });
      this.set(target, t, { opacity: 1 });
      return this.tween(target, { t, dur, from: { reveal: 0 }, to: { reveal: 1 }, ease: e });
    }
    /** stroke-draw an SVG element/group; groups draw their strokes in sequence */
    draw(target, t, dur = 0.6, e = 'pen') {
      this.set(target, 0, { opacity: 0 });
      this.set(target, t, { opacity: 1 });
      return this.tween(target, { t, dur, from: { draw: 0 }, to: { draw: 1 }, ease: e });
    }
    scene(target, from, to, { enter = 'fade', exit = 'fade', inDur = 0.4, outDur = 0.35 } = {}) {
      const el = $(target);
      const enterFrom = { opacity: 0 }, exitTo = { opacity: 0 };
      if (enter === 'up') enterFrom.y = 60;
      if (enter === 'zoom') enterFrom.scale = 0.96;
      if (exit === 'up') exitTo.y = -60;
      if (exit === 'zoom') exitTo.scale = 1.04;
      const zero = { opacity: 1 }; if ('y' in enterFrom || 'y' in exitTo) zero.y = 0; if ('scale' in enterFrom || 'scale' in exitTo) zero.scale = 1;
      if (enter === 'cut' || from <= 0) this.tween(el, { t: from, dur: 1e-4, from: { ...zero, opacity: from <= 0 ? 1 : 0 }, to: zero });
      else this.tween(el, { t: from, dur: inDur, from: { ...zero, ...enterFrom }, to: zero, ease: 'out' });
      if (to < this.duration) {
        if (exit === 'cut') this.set(el, to, { opacity: 0 });
        else this.tween(el, { t: to - outDur, dur: outDur, to: exitTo, ease: 'in' });
      }
      return this;
    }
    camera(target, t, dur, to, e = 'inOut') { return this.tween(target, { t, dur, to, ease: e }); }

    /** register text for the reading-time + safe-zone + size lint */
    read(target, from, to, label) { this.reads.push({ el: $(target), from, to, label: label || '' }); return this; }

    // ---- measuring ----
    rel(el, layer) {
      const r = $(el).getBoundingClientRect(), l = $(layer).getBoundingClientRect();
      return { x: (r.left - l.left) / this.k, y: (r.top - l.top) / this.k, w: r.width / this.k, h: r.height / this.k };
    }
    layerFor(el) { return $(el).closest('.il-scene') || this.stage; }

    // ---- hand-drawn marks ----
    marksLayer(layer, behind) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'il-marks' + (behind ? ' behind' : ''));
      svg.setAttribute('width', W); svg.setAttribute('height', H);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      if (behind) layer.insertBefore(svg, layer.firstChild); else layer.appendChild(svg);
      return svg;
    }
    /**
     * mark(kind, target, opts) — kinds: underline | circle | strike | highlight | box | check | arrow
     * opts: { t, dur, color, width, pad, layer, to (arrow end element or {x,y}), bend, seed }
     * Returns the <g> so you can vanish it later.
     */
    mark(kind, target, o = {}) {
      const layer = o.layer ? $(o.layer) : this.layerFor(target);
      const behind = kind === 'highlight';
      const svg = this.marksLayer(layer, behind);
      const b = this.rel(target, layer);
      const r = o.seed !== undefined ? mulberry32(o.seed) : this.rand;
      const j = (n) => (r() - 0.5) * 2 * n;
      const pad = o.pad ?? 18;
      let d = [];
      if (kind === 'underline') {
        const y = b.y + b.h + (o.offset ?? 6);
        const x0 = b.x - pad * 0.5, x1 = b.x + b.w + pad * 0.5;
        d.push(`M${x0},${y + j(3)} C${lerp(x0, x1, .3)},${y + j(7)} ${lerp(x0, x1, .66)},${y + j(7)} ${x1},${y - 6 + j(3)}`);
      } else if (kind === 'highlight') {
        const y = b.y + b.h * 0.66;
        const x0 = b.x - pad * 0.3, x1 = b.x + b.w + pad * 0.3;
        d.push(`M${x0},${y + j(2)} C${lerp(x0, x1, .35)},${y + j(4)} ${lerp(x0, x1, .7)},${y + j(4)} ${x1},${y + j(2)}`);
      } else if (kind === 'strike') {
        const y = b.y + b.h * 0.54;
        d.push(`M${b.x - pad * .4},${y + 6 + j(3)} C${b.x + b.w * .35},${y + j(5)} ${b.x + b.w * .65},${y + j(5)} ${b.x + b.w + pad * .4},${y - 8 + j(3)}`);
      } else if (kind === 'circle') {
        const cx = b.x + b.w / 2, cy = b.y + b.h / 2, rx = b.w / 2 + pad * 1.6, ry = b.h / 2 + pad * 1.1;
        const a0 = -2.6 + j(0.2), sweep = Math.PI * 2 * 1.08; const n = 28; const pts = [];
        for (let i = 0; i <= n; i++) {
          const a = a0 + (sweep * i) / n; const wob = 1 + j(0.035) + (i / n) * 0.05;
          pts.push([cx + Math.cos(a) * rx * wob, cy + Math.sin(a) * ry * wob]);
        }
        d.push(catmull(pts));
      } else if (kind === 'box') {
        const x0 = b.x - pad, y0 = b.y - pad, x1 = b.x + b.w + pad, y1 = b.y + b.h + pad;
        d.push(`M${x0 + j(4)},${y0 + j(4)} L${x1 + j(4)},${y0 + j(4)} L${x1 + j(4)},${y1 + j(4)} L${x0 + j(4)},${y1 + j(4)} Z`);
      } else if (kind === 'check') {
        const s = Math.min(b.w, b.h); const x = b.x + (o.dx ?? 0), y = b.y + (o.dy ?? 0);
        d.push(`M${x},${y + s * .55} L${x + s * .36},${y + s * .9} L${x + s},${y + s * .05}`);
      } else if (kind === 'arrow') {
        const end = o.to && o.to.nodeType ? this.rel(o.to, layer) : o.to;
        const from = o.fromPoint || { x: b.x + b.w / 2, y: b.y + b.h + 20 };
        const to = end.w !== undefined ? (o.toPoint ? o.toPoint(end) : { x: end.x + end.w / 2, y: end.y - 24 }) : end;
        const bend = o.bend ?? 0.25;
        const mx = (from.x + to.x) / 2 - (to.y - from.y) * bend, my = (from.y + to.y) / 2 + (to.x - from.x) * bend;
        d.push(`M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`);
        const ang = Math.atan2(to.y - my, to.x - mx), hl = o.head ?? 34;
        d.push(`M${to.x - Math.cos(ang - 0.5) * hl},${to.y - Math.sin(ang - 0.5) * hl} L${to.x},${to.y} L${to.x - Math.cos(ang + 0.5) * hl},${to.y - Math.sin(ang + 0.5) * hl}`);
      }
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const color = o.color || (behind ? 'rgba(114, 236, 231, .55)' : 'var(--teal)');
      const width = o.width || (behind ? b.h * 0.5 : kind === 'strike' ? 10 : 9);
      for (const s of d) {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', s); p.setAttribute('stroke', color); p.setAttribute('stroke-width', width);
        g.appendChild(p);
      }
      svg.appendChild(g);
      const dur = o.dur ?? ({ underline: .45, highlight: .5, strike: .4, circle: .7, box: .8, check: .35, arrow: .6 }[kind]);
      if (o.t !== undefined) this.draw(g, o.t, dur);
      return g;
    }

    // ---- chat ----
    /**
     * chat(container, { head:{name, sub, avatar|initial}, messages:[{from:'them'|'me', text, at, typing, react, receipt}], bottomPad })
     * Builds bubbles in normal flow, then scrolls the track so the newest message sits at the bottom.
     */
    chat(container, cfg) {
      const box = $(container); box.classList.add('il-chat');
      const track = document.createElement('div'); track.className = 'il-chat-track'; box.appendChild(track);
      if (cfg.head) {
        const h = document.createElement('div'); h.className = 'il-chat-head';
        const av = document.createElement('div'); av.className = 'il-chat-avatar';
        if (cfg.head.avatar) { const im = document.createElement('img'); im.src = cfg.head.avatar; av.appendChild(im); } else av.textContent = cfg.head.initial || '';
        const t = document.createElement('div'); t.innerHTML = `<div class="il-chat-name"></div><div class="il-chat-sub"></div>`;
        t.children[0].textContent = cfg.head.name || ''; t.children[1].textContent = cfg.head.sub || '';
        h.append(av, t); track.appendChild(h);
      }
      const items = cfg.messages.map((m) => {
        const b = document.createElement('div'); b.className = `il-bubble ${m.from}` + (m.cls ? ' ' + m.cls : '');
        b.textContent = m.text; track.appendChild(b);
        let rc = null;
        if (m.react) {
          // drawn IL reaction (never an emoji): kind 'heart' | 'check'
          rc = document.createElement('span'); rc.className = 'il-react';
          const kind = m.react.kind || 'heart';
          rc.innerHTML = kind === 'check'
            ? '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="#0095AC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            : '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M12 20.5s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.8c0 5.5-7.5 10.1-7.5 10.1z" fill="#0095AC"/></svg>';
          b.appendChild(rc);
        }
        let rec = null;
        if (m.receipt) { rec = document.createElement('div'); rec.className = 'il-receipt'; rec.textContent = m.receipt.text; track.appendChild(rec); }
        return { m, b, rc, rec };
      });
      const viewH = box.clientHeight, pad = cfg.bottomPad ?? 40;
      const scrollTo = (bottom) => Math.min(0, viewH - pad - bottom);
      let lastY = 0;
      const scrollTrack = (t, y) => {
        if (Math.abs(y - lastY) < 0.5) return;
        this.tween(track, { t, dur: 0.45, from: { y: lastY }, to: { y }, ease: 'inOut' }); lastY = y;
      };
      for (const it of items) {
        const { m, b } = it;
        const top = b.offsetTop, bottom = top + b.offsetHeight;
        if (m.from === 'them' && (m.typing ?? 0.9) > 0) {
          const ty = document.createElement('div'); ty.className = 'il-typing'; ty.style.top = top + 'px';
          ty.innerHTML = '<i></i><i></i><i></i>'; track.appendChild(ty);
          const t0 = m.at - (m.typing ?? 0.9);
          scrollTrack(t0, scrollTo(top + 112));
          this.tween(ty, { t: t0, dur: 0.25, from: { opacity: 0, scale: 0.85 }, to: { opacity: 1, scale: 1 } });
          this.tween(ty, { t: m.at - 0.05, dur: 0.12, to: { opacity: 0 }, ease: 'linear' });
          const dots = ty.querySelectorAll('i');
          this.fn(t0, m.at, (lt) => dots.forEach((d, i) => {
            const ph = (lt * 2.6 - i * 0.18) % 1; const up = ph < 0.4 ? Math.sin((ph / 0.4) * Math.PI) : 0;
            d.style.transform = `translateY(${(-up * 12).toFixed(2)}px)`; d.style.opacity = (0.55 + up * 0.45).toFixed(3);
          }));
        }
        scrollTrack(m.at, scrollTo(bottom + (it.rec ? 40 : 0)));
        this.tween(b, { t: m.at, dur: 0.42, from: { opacity: 0, scale: 0.9, y: 18 }, to: { opacity: 1, scale: 1, y: 0 }, ease: 'settle' });
        this.read(b, m.at, m.readUntil ?? this.duration, 'chat');
        if (it.rc) this.tween(it.rc, { t: m.react.at, dur: 0.35, from: { opacity: 0, scale: 0.4 }, to: { opacity: 1, scale: 1 }, ease: 'settle' });
        if (it.rec) this.tween(it.rec, { t: m.receipt.at ?? m.at + 0.6, dur: 0.3, from: { opacity: 0 }, to: { opacity: 1 } });
      }
      // once the thread scrolls, fade its top edge so cut-off bubbles never show a hard line
      const fadeMax = cfg.topFade ?? 110;
      this.fn(0, this.duration, (lt, T) => {
        const yl = this.tracks.get(track)?.y; const y = yl ? this.valueAt(yl, 'y', T) : 0;
        const f = Math.min(1, Math.max(0, -y / 60)) * fadeMax;
        box.style.webkitMaskImage = box.style.maskImage = f > 0.5 ? `linear-gradient(to bottom, transparent 0, #000 ${f.toFixed(1)}px)` : 'none';
      });
      return { track, items };
    }

    // ---- outro signature ----
    /**
     * outro(scene, { t, variant: 'pig' | 'bulb' | 'logo', ground: 'light' | 'teal', cta })
     * The scene element should be an empty .il-scene; the kit fills it. Uses official assets only.
     */
    outro(target, o) {
      const sc = $(target); sc.classList.add('il-outro');
      const ground = o.ground || 'light';
      sc.classList.add(ground === 'teal' ? 'il-ground-teal' : 'il-ground-white');
      const logo = document.createElement('img'); logo.className = 'il-outro-logo';
      logo.src = ASSETS_URL + (ground === 'teal' ? 'logo_white_2027.svg' : 'logo_primary_2027.svg'); logo.alt = 'Innovation Labs';
      const t = o.t;
      let mascot = null, wrap = null;
      if (o.variant === 'pig' || o.variant === 'bulb') {
        wrap = document.createElement('div'); wrap.style.position = 'relative';
        mascot = document.createElement('img'); mascot.className = 'il-outro-mascot';
        if (o.variant === 'pig') mascot.src = ASSETS_URL + 'mascots/flying-pig.png';
        else { mascot.src = ASSETS_URL + 'brand-elements/bulb-glass.svg'; mascot.style.width = '300px'; }
        wrap.appendChild(mascot); sc.appendChild(wrap);
      }
      sc.appendChild(logo);
      let cta = null;
      if (o.cta) { cta = document.createElement('div'); cta.className = 'il-outro-cta'; cta.textContent = o.cta; sc.appendChild(cta); }
      this.scene(sc, t, this.duration + 1, { enter: 'fade', inDur: 0.3 });
      if (o.variant === 'pig') {
        // glide in on a shallow arc, settle, then a slow float
        this.tween(wrap, { t, dur: 0.95, from: { x: -760, y: 120, rotate: -9, opacity: 1 }, to: { x: 0, y: 0, rotate: 0, opacity: 1 }, ease: 'outQuart' });
        this.fn(t + 0.95, this.duration, (lt) => { mascot.style.transform = `translateY(${(Math.sin(lt * 2.4) * 10).toFixed(2)}px) rotate(${(Math.sin(lt * 2.4 + 0.6) * 1.2).toFixed(2)}deg)`; });
        this.tween(logo, { t: t + 0.55, dur: 0.7, from: { reveal: 0, opacity: 1 }, to: { reveal: 1, opacity: 1 }, ease: 'inOut' });
      } else if (o.variant === 'bulb') {
        this.tween(wrap, { t, dur: 0.6, from: { scale: 0.7, opacity: 0, rotate: -6 }, to: { scale: 1, opacity: 1, rotate: 0 }, ease: 'settle' });
        this.tween(logo, { t: t + 0.4, dur: 0.6, from: { reveal: 0, opacity: 1 }, to: { reveal: 1, opacity: 1 }, ease: 'inOut' });
      } else {
        this.tween(logo, { t: t + 0.1, dur: 0.75, from: { reveal: 0, opacity: 1, y: 10 }, to: { reveal: 1, opacity: 1, y: 0 }, ease: 'inOut' });
      }
      if (cta) this.appear(cta, t + 0.9, { y: 14 });
      return { scene: sc, logo, mascot, cta };
    }

    // ---- lint ----
    lint() {
      const out = [];
      const stageR = this.stage.getBoundingClientRect();
      for (const r of this.reads) {
        const text = textOf(r.el);
        const words = textOf(r.el, true).split(' ').filter(Boolean).length; // quiet labels don't count as reading load
        const need = 0.6 + words / 3.2; // heuristic: ~190 wpm for short on-screen bursts, plus an orientation beat
        const have = r.to - r.from;
        const label = (r.label ? r.label + ': ' : '') + (text.length > 52 ? text.slice(0, 50) + '…' : text);
        if (have + 1e-3 < need) out.push({ level: 'warn', kind: 'reading-time', text: label, detail: `${words} words visible ${have.toFixed(2)}s, needs ~${need.toFixed(1)}s` });
        this.seek(Math.min((r.from + r.to) / 2, this.duration - 0.01));
        const b = r.el.getBoundingClientRect();
        const x0 = (b.left - stageR.left) / this.k, y0 = (b.top - stageR.top) / this.k, x1 = x0 + b.width / this.k, y1 = y0 + b.height / this.k;
        // the profile grid shows a centred 4:5 crop (y 285–1635): the hook must read inside it
        if (r.label === 'hook' && b.width > 0 && (y0 < 305 || y1 > 1615)) out.push({ level: 'warn', kind: 'cover-crop', text: label, detail: `hook spans y ${y0 | 0}–${y1 | 0}; the 4:5 grid crop is y 285–1635 (keep ~20px clear)` });
        if (b.width > 0 && (x0 < 88 || x1 > 992 || y0 < 248 || y1 > 1552)) out.push({ level: 'warn', kind: 'safe-zone', text: label, detail: `box ${x0 | 0},${y0 | 0} → ${x1 | 0},${y1 | 0} leaves 90–990 × 250–1550` });
        // smallest font actually carrying text inside the element (labels opt out with data-quiet)
        let fs = Infinity;
        const walker = document.createTreeWalker(r.el, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.textContent.trim() || n.parentElement.closest('[data-quiet]')) continue;
          fs = Math.min(fs, parseFloat(getComputedStyle(n.parentElement).fontSize));
        }
        if (fs < 34) out.push({ level: 'warn', kind: 'type-size', text: label, detail: `${fs}px is small on a phone; 34px+ for anything the viewer must read (mark quiet labels with data-quiet)` });
      }
      const first = this.reads.filter((r) => r.from <= 0.05);
      if (!first.length) out.push({ level: 'warn', kind: 'hook', text: 'no registered text visible at t=0', detail: 'the opening frame must carry a readable hook' });
      this.seek(0);
      return out;
    }
  }

  function textOf(el, skipQuiet) {
    const parts = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (skipQuiet && n.parentElement.closest('[data-quiet]') && n.parentElement.closest('[data-quiet]') !== el) continue;
      parts.push(n.textContent);
    }
    return parts.join(' ').replace(/\s+/g, ' ').replace(/\s+([.,?!:;])/g, '$1').trim();
  }
  function applyReveal(el, p, axis) {
    const s = el.style;
    if (p >= 0.999) { s.webkitMaskImage = s.maskImage = 'none'; return; }
    const soft = 7, a = p * (100 + soft) - soft, b = p * (100 + soft);
    const g = `linear-gradient(${axis === 'x' ? '90deg' : '180deg'}, #000 0%, #000 ${a.toFixed(2)}%, transparent ${b.toFixed(2)}%)`;
    s.webkitMaskImage = s.maskImage = g;
  }
  function applyDraw(el, p) {
    const gs = geometryOf(el);
    const lens = gs.map(lengthOf); const total = lens.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    gs.forEach((g, i) => {
      const L = lens[i]; const start = acc / total, end = (acc + L) / total; acc += L;
      const local = p <= start ? 0 : p >= end ? 1 : (p - start) / (end - start);
      g.style.strokeDasharray = `${L} ${L}`; g.style.strokeDashoffset = (L * (1 - local)).toFixed(2);
      g.style.opacity = local <= 0 ? 0 : 1;
    });
  }
  function catmull(pts) {
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }

  // ---------- boot ----------
  async function loadFonts() {
    if (window.__IL_FONT_CSS) {
      const st = document.createElement('style'); st.textContent = window.__IL_FONT_CSS; document.head.appendChild(st);
    }
    const probes = ['400 40px Poppins', '500 40px Poppins', '600 40px Poppins', '700 40px Poppins', '800 40px Poppins',
      '400 40px "IBM Plex Mono"', '500 40px "IBM Plex Mono"', '400 40px Caveat', '600 40px Caveat', '700 40px Caveat'];
    await Promise.all(probes.map((p) => document.fonts.load(p).catch(() => null)));
    await document.fonts.ready;
  }
  async function imagesReady(root) {
    const imgs = Array.from(root.querySelectorAll('img'));
    await Promise.all(imgs.map((im) => (im.complete && im.naturalWidth ? Promise.resolve() : new Promise((res) => { im.onload = im.onerror = res; }))));
    await Promise.all(imgs.map((im) => (im.decode ? im.decode().catch(() => null) : null)));
  }

  function preview(reel, viewport) {
    const fit = () => {
      const k = Math.min((innerWidth - 24) / W, (innerHeight - 70) / H);
      reel.k = k;
      viewport.style.transform = `scale(${k})`; viewport.style.width = W + 'px';
      document.body.style.height = '100%';
      viewport.parentElement.style.width = W * k + 'px'; viewport.parentElement.style.height = H * k + 'px';
    };
    const holder = document.createElement('div'); viewport.parentElement.insertBefore(holder, viewport); holder.appendChild(viewport);
    fit(); addEventListener('resize', fit);
    const guides = document.createElement('div'); guides.className = 'il-guides';
    guides.innerHTML = '<div style="left:90px;top:250px;width:900px;height:1300px"></div>';
    reel.stage.appendChild(guides);
    const ui = document.createElement('div'); ui.className = 'il-ui';
    ui.innerHTML = '<button data-a="play" id="il-play">pause</button><input type="range" id="il-scrub" aria-label="Scrub timeline" min="0" step="0.001"><span class="tc">0.00</span><button data-a="guides" id="il-guides">safe zone</button>';
    document.body.appendChild(ui);
    const range = ui.querySelector('input'); range.max = reel.duration; const tc = ui.querySelector('.tc');
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let playing = !params.has('paused') && !reduce, t = reduce ? Math.min(1.5, reel.duration) : 0, last = performance.now();
    const btn = ui.querySelector('[data-a=play]');
    const sync = () => { range.value = t; tc.textContent = t.toFixed(2) + ' / ' + reel.duration.toFixed(2); btn.textContent = playing ? 'pause' : 'play'; };
    ui.addEventListener('click', (e) => {
      const a = e.target.dataset.a;
      if (a === 'play') { playing = !playing; last = performance.now(); sync(); }
      if (a === 'guides') guides.classList.toggle('on');
    });
    range.addEventListener('input', () => { playing = false; t = +range.value; reel.seek(t); sync(); });
    addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); playing = !playing; last = performance.now(); sync(); } });
    if (params.has('t')) { t = +params.get('t'); playing = false; }
    const loop = (now) => {
      if (playing) { t += (now - last) / 1000; if (t > reel.duration) t = 0; reel.seek(t); sync(); }
      last = now; requestAnimationFrame(loop);
    };
    reel.seek(t); sync(); requestAnimationFrame(loop);
  }

  async function run(opts, build) {
    if (RENDER) document.body.classList.add('il-render');
    const stage = document.querySelector('.il-stage');
    let viewport = stage.parentElement.classList.contains('il-viewport') ? stage.parentElement : null;
    if (!viewport) { viewport = document.createElement('div'); viewport.className = 'il-viewport'; stage.parentElement.insertBefore(viewport, stage); viewport.appendChild(stage); }
    await loadFonts();
    await imagesReady(stage);
    const reel = new Reel(opts, stage);
    await build(reel);
    await imagesReady(stage);
    reel.seek(0);
    window.__IL = {
      duration: reel.duration, fps: reel.fps, meta: reel.meta,
      seek: (t) => reel.seek(t), lint: () => reel.lint(), reel,
      // on-screen text in order of appearance, for human-pass and for the caption writer
      script: () => reel.reads.slice().sort((x, y) => x.from - y.from)
        .map((r) => ({ at: +r.from.toFixed(2), until: +r.to.toFixed(2), label: r.label, text: textOf(r.el) })),
    };
    if (!RENDER) preview(reel, viewport);
    window.__IL_READY = true;
    return reel;
  }

  window.ILReel = { run, EASE, ASSETS_URL, KIT_URL, W, H, RENDER };
})();
