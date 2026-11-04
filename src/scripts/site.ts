/**
 * The only client-side JavaScript on the site (~1 KB):
 * header state, active-section indicator, mobile menu and scroll reveals.
 */

const header = document.querySelector<HTMLElement>('[data-header]');

/* Header: transparent at the top, solid after scrolling */
const updateHeader = () => {
  header?.setAttribute('data-scrolled', String(window.scrollY > 24));
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

/* Active section indicator */
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
const sectionIds = [...new Set(navLinks.map((l) => l.dataset.section).filter(Boolean))] as string[];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter((el): el is HTMLElement => el !== null);

const setActive = (id: string) => {
  navLinks.forEach((link) => {
    if (link.dataset.section === id) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
};

if (sections.length) {
  const visible = new Map<string, number>();
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
      // Pick the section that occupies the band in the upper-middle of the viewport.
      const current = sectionIds.find((id) => (visible.get(id) ?? 0) > 0);
      if (current) setActive(current);
    },
    { rootMargin: '-35% 0px -60% 0px', threshold: [0, 0.01] },
  );
  sections.forEach((s) => sectionObserver.observe(s));
}

/* Mobile navigation */
const menu = document.querySelector<HTMLElement>('[data-mobile-nav]');
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeBtn = menu?.querySelector<HTMLButtonElement>('[data-menu-close]');

const setMenu = (open: boolean) => {
  if (!menu || !openBtn) return;
  menu.hidden = !open;
  openBtn.setAttribute('aria-expanded', String(open));
  document.documentElement.style.overflow = open ? 'hidden' : '';
  if (open) closeBtn?.focus();
  else openBtn.focus({ preventScroll: true });
};

openBtn?.addEventListener('click', () => setMenu(true));
closeBtn?.addEventListener('click', () => setMenu(false));
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (!menu || menu.hidden) return;
  if (e.key === 'Escape') setMenu(false);
  if (e.key === 'Tab') {
    // Keep focus inside the open menu
    const focusables = Array.from(menu.querySelectorAll<HTMLElement>('a[href], button'));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }
});
window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setMenu(false));

/* Scroll-triggered reveals */
const revealables = document.querySelectorAll<HTMLElement>('[data-reveal]');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  revealables.forEach((el) => revealObserver.observe(el));
} else {
  revealables.forEach((el) => el.classList.add('is-visible'));
}

/* Animated scenes only play while on screen */
const scenes = document.querySelectorAll<HTMLElement>('[data-scene]');
if ('IntersectionObserver' in window) {
  const sceneObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        e.target.classList.toggle('is-playing', e.isIntersecting);
        if (e.isIntersecting) e.target.classList.add('has-played');
      }),
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
  );
  scenes.forEach((el) => sceneObserver.observe(el));
} else {
  scenes.forEach((el) => el.classList.add('is-playing', 'has-played'));
}
