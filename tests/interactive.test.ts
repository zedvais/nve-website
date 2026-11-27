// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initHoverReplay, initPointerLight, initSeal, replay } from '@/scripts/interactive';

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
});

describe('replay', () => {
  it('restarts a scene that has played', () => {
    document.body.innerHTML = '<div data-scene class="has-played is-playing"></div>';
    const scene = document.querySelector<HTMLElement>('[data-scene]')!;
    const removed: string[] = [];
    const original = scene.classList.remove.bind(scene.classList);
    scene.classList.remove = (...t: string[]) => {
      removed.push(...t);
      original(...t);
    };
    replay(scene);
    expect(removed).toContain('has-played');
    expect(scene.classList.contains('has-played')).toBe(true);
    expect(scene.classList.contains('is-playing')).toBe(true);
  });
});

describe('initSeal', () => {
  const setup = () => {
    document.body.innerHTML = `
      <section>
        <div data-seal data-scene class="has-played">
          <button type="button" data-seal-button>Replay</button>
          <span data-seal-ripples></span>
        </div>
      </section>`;
    initSeal();
    return {
      seal: document.querySelector<HTMLElement>('[data-seal]')!,
      button: document.querySelector<HTMLButtonElement>('[data-seal-button]')!,
      section: document.querySelector<HTMLElement>('section')!,
    };
  };

  it('sends a ripple and redraws the seal when tapped', () => {
    const { seal, button } = setup();
    button.click();
    expect(document.querySelectorAll('[data-seal-ripples] .seal-ripple')).toHaveLength(1);
    expect(seal.classList.contains('is-replay')).toBe(true);
    expect(seal.classList.contains('has-played')).toBe(true);
    expect(seal.dataset.plays).toBe('1');
    button.click();
    expect(seal.dataset.plays).toBe('2');
  });

  it('removes a ripple once it has finished', () => {
    const { button } = setup();
    button.click();
    const ring = document.querySelector('.seal-ripple')!;
    ring.dispatchEvent(new Event('animationend'));
    expect(document.querySelector('.seal-ripple')).toBeNull();
  });

  it('tilts towards the pointer and settles when it leaves', () => {
    const { seal, section } = setup();
    seal.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200, x: 0, y: 0, toJSON: () => ({}) });
    section.dispatchEvent(new PointerEvent('pointermove', { clientX: 200, clientY: 100, pointerType: 'mouse' }));
    expect(seal.style.getPropertyValue('--px')).toBe('1.000');
    expect(seal.style.getPropertyValue('--py')).toBe('0.000');
    section.dispatchEvent(new PointerEvent('pointermove', { clientX: 900, clientY: -500, pointerType: 'mouse' }));
    expect(seal.style.getPropertyValue('--px')).toBe('1.000');
    expect(seal.style.getPropertyValue('--py')).toBe('-1.000');
    section.dispatchEvent(new PointerEvent('pointerleave'));
    expect(seal.style.getPropertyValue('--px')).toBe('0.000');
  });

  it('ignores touch drags, so scrolling past does not tilt it', () => {
    const { seal, section } = setup();
    section.dispatchEvent(new PointerEvent('pointermove', { clientX: 200, clientY: 100, pointerType: 'touch' }));
    expect(seal.style.getPropertyValue('--px')).toBe('');
  });
});

describe('initHoverReplay', () => {
  it('redraws on hover, but not again within the cooldown', () => {
    document.body.innerHTML = '<li data-scene data-replay-hover class="has-played"></li>';
    const el = document.querySelector<HTMLElement>('li')!;
    const spy = vi.spyOn(el, 'getBoundingClientRect');
    initHoverReplay(document, 10_000);
    el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('waits until the scene has drawn in the first time', () => {
    document.body.innerHTML = '<li data-scene data-replay-hover></li>';
    const el = document.querySelector<HTMLElement>('li')!;
    initHoverReplay(document, 0);
    el.dispatchEvent(new Event('focusin'));
    expect(el.classList.contains('has-played')).toBe(false);
  });
});

describe('initPointerLight', () => {
  it('follows the pointer and switches off when it leaves', () => {
    document.body.innerHTML = '<section data-pointer-light></section>';
    const el = document.querySelector<HTMLElement>('section')!;
    el.getBoundingClientRect = () => ({ left: 10, top: 20, width: 500, height: 300, right: 510, bottom: 320, x: 10, y: 20, toJSON: () => ({}) });
    initPointerLight();
    el.dispatchEvent(new PointerEvent('pointermove', { clientX: 110, clientY: 70, pointerType: 'mouse' }));
    expect(el.style.getPropertyValue('--mx')).toBe('100px');
    expect(el.style.getPropertyValue('--my')).toBe('50px');
    expect(el.dataset.lit).toBe('true');
    el.dispatchEvent(new PointerEvent('pointerleave'));
    expect(el.dataset.lit).toBeUndefined();
  });
});
