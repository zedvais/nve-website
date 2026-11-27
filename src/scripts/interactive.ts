/**
 * Interactive vector art. Progressive enhancement only: without JS, or when the
 * visitor prefers reduced motion, every piece is simply drawn and still.
 *
 * - [data-seal]: the playable seal in the "United as one" interlude. The arch and
 *   monogram tilt towards the pointer, and a tap or click on [data-seal-button]
 *   sends out a gold ripple and redraws the seal.
 * - [data-replay-hover]: a [data-scene] whose line art redraws on hover, focus or tap.
 * - [data-pointer-light]: sets --mx / --my (px) so a light can follow the pointer.
 */

/** Restarts the draw-in animations of a [data-scene] element. */
export function replay(scene: HTMLElement): void {
  scene.classList.remove('has-played');
  void scene.getBoundingClientRect(); // flush styles so the animations restart
  scene.classList.add('has-played');
}

const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Calls fn at most once per animation frame with the latest arguments. */
function perFrame<A extends unknown[]>(fn: (...args: A) => void): (...args: A) => void {
  let queued: A | null = null;
  return (...args: A) => {
    const first = queued === null;
    queued = args;
    if (first) {
      requestAnimationFrame(() => {
        const a = queued!;
        queued = null;
        fn(...a);
      });
    }
  };
}

export function initSeal(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-seal]').forEach((seal) => {
    const area = seal.closest<HTMLElement>('section') ?? seal;
    const button = seal.querySelector<HTMLButtonElement>('[data-seal-button]');
    const ripples = seal.querySelector<HTMLElement>('[data-seal-ripples]') ?? seal;

    const setTilt = perFrame((x: number, y: number) => {
      seal.style.setProperty('--px', x.toFixed(3));
      seal.style.setProperty('--py', y.toFixed(3));
    });
    area.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = seal.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2 || 1)));
      const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2 || 1)));
      setTilt(x, y);
    });
    area.addEventListener('pointerleave', () => setTilt(0, 0));

    button?.addEventListener('click', (e) => {
      const r = seal.getBoundingClientRect();
      // keyboard clicks have no position: ripple from the centre of the seal
      const fromPointer = e.detail > 0 && (e.clientX || e.clientY);
      const x = fromPointer ? e.clientX - r.left : r.width / 2;
      const y = fromPointer ? e.clientY - r.top : r.height * 0.58;
      const ring = document.createElement('span');
      ring.className = 'seal-ripple';
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      ring.addEventListener('animationend', () => ring.remove());
      ripples.append(ring);
      // safety net when animations are off
      setTimeout(() => ring.remove(), 2000);

      seal.classList.add('is-replay');
      replay(seal);
      seal.dataset.plays = String(Number(seal.dataset.plays ?? 0) + 1);
    });
  });
}

export function initHoverReplay(root: ParentNode = document, cooldown = 1400): void {
  root.querySelectorAll<HTMLElement>('[data-replay-hover]').forEach((el) => {
    let last = 0;
    const go = () => {
      const now = Date.now();
      if (now - last < cooldown || !el.classList.contains('has-played')) return;
      last = now;
      replay(el);
    };
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'touch') go();
    });
    el.addEventListener('focusin', go);
    el.addEventListener('click', go);
  });
}

export function initPointerLight(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-pointer-light]').forEach((el) => {
    const set = perFrame((x: number, y: number) => {
      el.style.setProperty('--mx', `${Math.round(x)}px`);
      el.style.setProperty('--my', `${Math.round(y)}px`);
      el.dataset.lit = 'true';
    });
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      set(e.clientX - r.left, e.clientY - r.top);
    });
    el.addEventListener('pointerleave', () => {
      delete el.dataset.lit;
    });
  });
}

export function initInteractive(root: ParentNode = document): void {
  if (reducedMotion()) return;
  initSeal(root);
  initHoverReplay(root);
  initPointerLight(root);
}
