/**
 * Interactive family roster: collapsible rank groups, "Show all" for long
 * groups, live search and rank filter. Without JS the full roster renders.
 */
export function initRoster() {
  const root = document.querySelector<HTMLElement>('[data-roster]');
  if (!root) return;

  const tools = root.querySelector<HTMLElement>('[data-roster-tools]');
  const search = root.querySelector<HTMLInputElement>('[data-roster-search]');
  const count = root.querySelector<HTMLElement>('[data-roster-count]');
  const empty = root.querySelector<HTMLElement>('[data-roster-empty]');
  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-roster-filter]'));

  const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-group]')).map((el) => ({
    el,
    tier: el.dataset.group!,
    toggle: el.querySelector<HTMLButtonElement>('[data-group-toggle]')!,
    panel: el.querySelector<HTMLElement>('.collapsible')!,
    inner: el.querySelector<HTMLElement>('.collapsible-inner')!,
    members: Array.from(el.querySelectorAll<HTMLElement>('[data-member]')),
    placeholder: el.querySelector<HTMLElement>('[data-placeholder-card]'),
    more: el.querySelector<HTMLButtonElement>('[data-group-more]'),
    open: el.dataset.defaultOpen !== 'false',
    showAll: false,
  }));
  const total = groups.reduce((n, g) => n + g.members.length, 0);

  let query = '';
  let filter = 'all';

  const render = () => {
    let matches = 0;
    let shownGroups = 0;
    for (const g of groups) {
      const tierMatch = filter === 'all' || filter === g.tier;
      const hits = g.members.filter((m) => !query || (m.dataset.name ?? '').includes(query));
      matches += tierMatch ? hits.length : 0;
      const visible = tierMatch && (!query || hits.length > 0);
      g.el.hidden = !visible;
      if (!visible) continue;
      shownGroups++;

      const open = query ? true : g.open;
      g.toggle.setAttribute('aria-expanded', String(open));
      g.panel.dataset.open = String(open);
      g.inner.inert = !open;

      g.members.forEach((m) => {
        const hit = hits.includes(m);
        m.hidden = !hit || (!query && !g.showAll && m.hasAttribute('data-extra'));
      });
      if (g.placeholder) g.placeholder.hidden = Boolean(query);
      if (g.more) {
        const row = g.more.closest<HTMLElement>('[data-more-row]') ?? g.more;
        row.hidden = Boolean(query);
        g.more.setAttribute('aria-expanded', String(g.showAll));
        const label = g.more.querySelector('[data-more-label]');
        if (label) label.textContent = g.showAll ? 'Show less' : `+${g.more.dataset.hiddenCount} more members`;
      }
    }
    if (empty) empty.hidden = shownGroups > 0;
    if (count) count.textContent = query ? `${matches} of ${total} members` : `${total} members listed`;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.rosterFilter === filter)));
  };

  groups.forEach((g) => {
    g.toggle.disabled = false;
    g.toggle.addEventListener('click', () => {
      g.open = !g.open;
      render();
    });
    g.more?.addEventListener('click', () => {
      g.showAll = !g.showAll;
      render();
      if (!g.showAll) g.el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  });

  search?.addEventListener('input', () => {
    query = search.value.trim().toLowerCase();
    render();
  });
  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      filter = chip.dataset.rosterFilter ?? 'all';
      render();
    }),
  );

  // Press "/" to jump to the member search
  document.addEventListener('keydown', (e) => {
    const target = e.target as HTMLElement;
    if (e.key !== '/' || target.closest('input, textarea, [contenteditable]')) return;
    if (!search || !root.getBoundingClientRect().height) return;
    e.preventDefault();
    search.focus();
  });

  if (tools) tools.hidden = false;
  render();
}
