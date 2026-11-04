// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { initRoster } from '@/scripts/roster';

/** Minimal copy of the markup FamilySection renders. */
function renderRoster({ soldiers = 12 } = {}) {
  const card = (name: string, role: string, extra = false) =>
    `<li data-member data-name="${name.toLowerCase()} ${role.toLowerCase()}"${extra ? ' data-extra' : ''}>${name}</li>`;
  const ranks = Array.from({ length: soldiers }, (_, i) => card(`Soldier${i}`, 'Soldier', i >= 8)).join('');
  document.body.innerHTML = `
    <div data-roster>
      <div data-roster-tools hidden>
        <input data-roster-search />
        <button data-roster-filter="all" aria-pressed="true">All</button>
        <button data-roster-filter="leadership" aria-pressed="false">Leadership</button>
        <button data-roster-filter="ranks" aria-pressed="false">Members</button>
        <p data-roster-count></p>
      </div>
      <div data-group="leadership" data-default-open="true">
        <button data-group-toggle aria-expanded="true" disabled>Leadership</button>
        <div class="collapsible" data-open="true"><div class="collapsible-inner"><ul>
          ${card('Saetsuna', 'Boss')}${card('Zedvais', 'Underboss')}
        </ul></div></div>
      </div>
      <div data-group="ranks" data-default-open="true">
        <button data-group-toggle aria-expanded="true" disabled>Members</button>
        <div class="collapsible" data-open="true"><div class="collapsible-inner"><ul>
          ${ranks}
          ${soldiers > 8 ? `<li data-more-row><button data-group-more aria-expanded="false" data-hidden-count="${soldiers - 8}"><span data-more-label></span></button></li>` : ''}
        </ul></div></div>
      </div>
      <p data-roster-empty hidden>No members match that search.</p>
    </div>`;
  initRoster();
  const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
  const visible = (group: string) =>
    [...document.querySelectorAll<HTMLElement>(`[data-group="${group}"] [data-member]`)].filter((el) => !el.hidden).length;
  const search = (q: string) => {
    const input = $<HTMLInputElement>('[data-roster-search]');
    input.value = q;
    input.dispatchEvent(new Event('input'));
  };
  return { $, visible, search };
}

describe('initRoster', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('reveals the toolbar and enables the group toggles', () => {
    const { $ } = renderRoster();
    expect($('[data-roster-tools]').hidden).toBe(false);
    expect($<HTMLButtonElement>('[data-group-toggle]').disabled).toBe(false);
    expect($('[data-roster-count]').textContent).toBe('14 members listed');
  });

  it('shows 8 cards in a long group, expands from the "+N more" card, and collapses again', () => {
    const { $, visible } = renderRoster();
    const more = $<HTMLButtonElement>('[data-group-more]');
    expect(visible('ranks')).toBe(8);
    expect(more.textContent).toBe('+4 more members');

    more.click();
    expect(visible('ranks')).toBe(12);
    expect(more.getAttribute('aria-expanded')).toBe('true');
    expect(more.textContent).toBe('Show less');

    more.click();
    expect(visible('ranks')).toBe(8);
  });

  it('collapses a group and makes its contents inert', () => {
    const { $ } = renderRoster();
    const toggle = $<HTMLButtonElement>('[data-group="leadership"] [data-group-toggle]');
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect($('[data-group="leadership"] .collapsible').dataset.open).toBe('false');
    expect($('[data-group="leadership"] .collapsible-inner').inert).toBe(true);
  });

  it('searches by name or rank across groups, including hidden extras', () => {
    const { $, visible, search } = renderRoster();
    search('soldier11'); // the 12th soldier is normally behind "+4 more"
    expect(visible('ranks')).toBe(1);
    expect($('[data-group="leadership"]').hidden).toBe(true);
    expect($('[data-more-row]').hidden).toBe(true);
    expect($('[data-roster-count]').textContent).toBe('1 of 14 members');

    search('underboss');
    expect(visible('leadership')).toBe(1);
    expect($('[data-group="ranks"]').hidden).toBe(true);
  });

  it('opens collapsed groups while searching', () => {
    const { $, search } = renderRoster();
    $<HTMLButtonElement>('[data-group="leadership"] [data-group-toggle]').click();
    search('saetsuna');
    expect($('[data-group="leadership"] .collapsible').dataset.open).toBe('true');
  });

  it('shows the empty message when nothing matches', () => {
    const { $, search } = renderRoster();
    search('nobody-by-this-name');
    expect($('[data-roster-empty]').hidden).toBe(false);
    search('');
    expect($('[data-roster-empty]').hidden).toBe(true);
  });

  it('filters by rank group', () => {
    const { $ } = renderRoster();
    $<HTMLButtonElement>('[data-roster-filter="leadership"]').click();
    expect($('[data-group="ranks"]').hidden).toBe(true);
    expect($('[data-group="leadership"]').hidden).toBe(false);
    expect($('[data-roster-filter="leadership"]').getAttribute('aria-pressed')).toBe('true');
    expect($('[data-roster-filter="all"]').getAttribute('aria-pressed')).toBe('false');
  });

  it('does nothing when the page has no roster', () => {
    document.body.innerHTML = '<main></main>';
    expect(() => initRoster()).not.toThrow();
  });
});
