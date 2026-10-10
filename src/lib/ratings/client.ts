/**
 * Customer rating UI (browser). Loaded on demand — when the browser is idle — by
 * src/components/RatingsClient.astro, so it never delays the first paint. Shows nothing unless
 * /api/ratings reports { enabled: true }.
 */
import { FAVOURITE_MIN_RATINGS, MIN_RATINGS_TOP } from './ranking';
import { readChoices, setChoice } from '../consent';

interface DishSummary {
  n: number;
  avg: number | null;
  score: number | null;
  n30: number;
  last: string | null;
}
interface Summary {
  enabled: boolean;
  dishes?: Record<string, DishSummary>;
}
type Strings = Record<string, string>;

let slots: HTMLElement[] = [];
let discover: HTMLElement | null = null;

/** Entry point, loaded on demand by src/components/RatingsClient.astro. */
export function start() {
  const i18nEl = document.querySelector('[data-rating-i18n]');
  slots = [...document.querySelectorAll<HTMLElement>('[data-rating-slot]')];
  discover = document.querySelector<HTMLElement>('[data-ratings-discover]');
  if (i18nEl && (slots.length || discover)) void init(JSON.parse(i18nEl.textContent ?? '{}') as Strings);
}

function fmt(s: string, vars: Record<string, string | number>) {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

async function init(t: Strings) {
  let data: Summary | null = null;
  try {
    const res = await fetch('/api/ratings', { headers: { accept: 'application/json' } });
    if (res.ok) data = (await res.json()) as Summary;
  } catch {
    /* offline or no API — ratings simply stay hidden */
  }
  if (!data?.enabled || !data.dishes) return;
  const dishes = data.dishes;
  const num = new Intl.NumberFormat(t.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const openedAt = performance.now();

  const summaryText = (s: DishSummary | undefined) => {
    if (!s || !s.n || s.avg == null) return { visible: t.none, sr: `${t.label}: ${t.none}` };
    const count = s.n === 1 ? t.countOne : fmt(t.count, { n: s.n });
    return { visible: `${num.format(s.avg)} · ${count}`, sr: `${t.label}: ${fmt(t.avg, { avg: num.format(s.avg) })}, ${count}` };
  };

  const paint = (slot: HTMLElement, s: DishSummary | undefined) => {
    const stars = slot.querySelector<HTMLElement>('.rt__stars')!;
    const text = slot.querySelector<HTMLElement>('.rt__text')!;
    const sr = slot.querySelector<HTMLElement>('.rt__sr')!;
    const st = summaryText(s);
    stars.style.setProperty('--v', `${s?.avg ? (s.avg / 5) * 100 : 0}%`);
    stars.hidden = !s?.n;
    text.textContent = st.visible;
    sr.textContent = st.sr;
  };

  let uid = 0;
  for (const slot of slots) {
    const id = slot.dataset.dish!;
    const name = slot.dataset.name ?? id;
    const formId = `rt-form-${id}-${uid++}`;
    slot.innerHTML = `
      <div class="rt">
        <span class="rt__stars" aria-hidden="true"></span>
        <span class="rt__text" aria-hidden="true"></span>
        <span class="rt__sr visually-hidden"></span>
        <button type="button" class="rt__btn" aria-expanded="false" aria-controls="${formId}"></button>
      </div>
      <form class="rt__form" id="${formId}" hidden novalidate>
        <fieldset>
          <legend class="rt__legend"></legend>
          <div class="rt__pick"></div>
        </fieldset>
        <label class="rt__remember"><input type="checkbox" name="remember" /> <span class="rt__remember-text"></span></label>
        <div class="rt__hp"><label>Website <input name="website" tabindex="-1" autocomplete="off" /></label></div>
        <button type="submit" class="rt__submit"></button>
        <p class="rt__msg" role="status" aria-live="polite"></p>
        <p class="rt__note"></p>
      </form>`;
    const btn = slot.querySelector<HTMLButtonElement>('.rt__btn')!;
    const form = slot.querySelector<HTMLFormElement>('.rt__form')!;
    btn.textContent = t.rate;
    slot.querySelector('.rt__legend')!.textContent = `${t.yourRating}: ${name}`;
    slot.querySelector('.rt__submit')!.textContent = t.submit;
    slot.querySelector('.rt__note')!.textContent = t.note;
    slot.querySelector('.rt__remember-text')!.textContent = t.remember;
    // Optional consent: unticked unless the visitor allowed "remember ratings" before.
    const rememberBox = form.querySelector<HTMLInputElement>('input[name="remember"]')!;
    rememberBox.checked = readChoices().ratings;
    const pick = slot.querySelector<HTMLElement>('.rt__pick')!;
    let saved: string | null = null;
    if (readChoices().ratings) {
      try {
        saved = localStorage.getItem(`afl-rated:${id}`);
      } catch {
        /* storage unavailable */
      }
    }
    for (let n = 1; n <= 5; n++) {
      const label = document.createElement('label');
      label.className = 'rt__star';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'stars';
      input.value = String(n);
      input.className = 'visually-hidden';
      if (saved === String(n)) input.checked = true;
      const glyph = document.createElement('span');
      glyph.setAttribute('aria-hidden', 'true');
      glyph.textContent = '★';
      const text = document.createElement('span');
      text.className = 'visually-hidden';
      text.textContent = fmt(n === 1 ? t.star : t.stars, { n });
      label.append(input, glyph, text);
      pick.append(label);
    }
    const highlight = (v: number) =>
      pick.querySelectorAll('.rt__star').forEach((l, i) => l.classList.toggle('is-on', i < v));
    const current = () => Number((form.querySelector('input[name="stars"]:checked') as HTMLInputElement | null)?.value ?? 0);
    highlight(current());
    pick.addEventListener('change', () => highlight(current()));
    pick.addEventListener('mouseover', (e) => {
      const l = (e.target as Element).closest('.rt__star');
      if (l) highlight([...pick.children].indexOf(l) + 1);
    });
    pick.addEventListener('mouseleave', () => highlight(current()));

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      form.hidden = !open;
      if (open) (form.querySelector<HTMLInputElement>('input[name="stars"]:checked') ?? form.querySelector<HTMLInputElement>('input[name="stars"]'))?.focus();
    });

    const msg = slot.querySelector<HTMLElement>('.rt__msg')!;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const stars = current();
      if (!stars) {
        msg.textContent = t.choose;
        return;
      }
      const submit = form.querySelector<HTMLButtonElement>('.rt__submit')!;
      submit.disabled = true;
      msg.textContent = '';
      try {
        const res = await fetch('/api/ratings', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            dish: id,
            stars,
            website: (form.elements.namedItem('website') as HTMLInputElement).value,
            elapsed: Math.round(performance.now() - openedAt),
            remember: rememberBox.checked,
          }),
        });
        const body = (await res.json().catch(() => ({}))) as { ok?: boolean; action?: string; n?: number; avg?: number | null; error?: string };
        if (res.ok && body.ok) {
          msg.textContent = body.action === 'revised' ? t.updated : t.thanks;
          // The tick box is the consent decision for this category (and its withdrawal).
          if (rememberBox.checked !== readChoices().ratings) setChoice('ratings', rememberBox.checked);
          if (rememberBox.checked) {
            try {
              localStorage.setItem(`afl-rated:${id}`, String(stars));
            } catch {
              /* storage unavailable */
            }
          }
          if (typeof body.n === 'number') {
            dishes[id] = { ...(dishes[id] ?? { score: null, n30: 0, last: null }), n: body.n, avg: body.avg ?? null };
            document.querySelectorAll<HTMLElement>(`[data-rating-slot][data-dish="${id}"]`).forEach((s) => paint(s, dishes[id]));
          }
        } else {
          msg.textContent = res.status === 429 ? t.tooMany : t.error;
        }
      } catch {
        msg.textContent = t.error;
      } finally {
        submit.disabled = false;
      }
    });

    paint(slot, dishes[id]);
    slot.hidden = false;
  }

  if (discover) renderDiscover(discover, dishes, t, num);
}

function renderDiscover(root: HTMLElement, dishes: Record<string, DishSummary>, t: Strings, num: Intl.NumberFormat) {
  const names = new Map<string, string>();
  document.querySelectorAll<HTMLElement>('[data-rating-slot]').forEach((s) => names.set(s.dataset.dish!, s.dataset.name ?? s.dataset.dish!));
  const rows = Object.entries(dishes)
    .filter(([id]) => names.has(id))
    .map(([id, d]) => ({ id, ...d }));
  const lists: Record<string, typeof rows> = {
    top: rows.filter((r) => r.n >= MIN_RATINGS_TOP).sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || b.n - a.n),
    most: rows.filter((r) => r.n > 0).sort((a, b) => b.n - a.n || (b.score ?? 0) - (a.score ?? 0)),
    trending: rows.filter((r) => r.n30 > 0).sort((a, b) => b.n30 - a.n30 || (b.score ?? 0) - (a.score ?? 0)),
    recent: rows.filter((r) => r.last).sort((a, b) => (b.last! > a.last! ? 1 : b.last! < a.last! ? -1 : 0)),
  };
  const list = root.querySelector<HTMLOListElement>('[data-discover-list]')!;
  const help = root.querySelector<HTMLElement>('[data-discover-help]')!;
  const empty = root.querySelector<HTMLElement>('[data-discover-empty]')!;
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-sort]')];
  const show = (key: string) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sort === key)));
    list.innerHTML = '';
    help.textContent = key === 'top' ? t.sortTopHelp : key === 'trending' ? t.sortTrendingHelp : '';
    if (key === 'all') {
      list.hidden = true;
      empty.hidden = true;
      return;
    }
    const items = (lists[key] ?? []).slice(0, 10);
    list.hidden = items.length === 0;
    empty.hidden = items.length > 0;
    for (const r of items) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#dish-${r.id}`;
      a.textContent = names.get(r.id) ?? r.id;
      const meta = document.createElement('span');
      meta.className = 'discover__meta';
      const count = r.n === 1 ? t.countOne : t.count.replace('{n}', String(r.n));
      meta.textContent = key === 'trending' ? `${r.n30} · 30d` : `${r.avg != null ? num.format(r.avg) + ' ★ · ' : ''}${count}`;
      li.append(a, meta);
      list.append(li);
    }
  };
  buttons.forEach((b) => b.addEventListener('click', () => show(b.dataset.sort!)));
  show('all');

  const favs = rows
    .filter((r) => r.n >= FAVOURITE_MIN_RATINGS && (r.score ?? 0) >= 4)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 3);
  const favBox = root.querySelector<HTMLElement>('[data-favourites]')!;
  if (favs.length) {
    const ul = favBox.querySelector('ul')!;
    for (const f of favs) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#dish-${f.id}`;
      a.textContent = names.get(f.id) ?? f.id;
      const meta = document.createElement('span');
      meta.className = 'discover__meta';
      meta.textContent = `${num.format(f.avg ?? 0)} ★ · ${t.count.replace('{n}', String(f.n))}`;
      li.append(a, meta);
      ul.append(li);
    }
    favBox.hidden = false;
  }
  root.hidden = false;
}
