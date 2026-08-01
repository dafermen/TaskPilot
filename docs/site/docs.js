const menuButton = document.querySelector('.menu-button');
const sidebar = document.querySelector('.docs-sidebar');
const backdrop = document.querySelector('.sidebar-backdrop');
const themeButton = document.querySelector('#theme-toggle');
const searchShell = document.querySelector('.search-shell');
const searchInput = document.querySelector('#docs-search');
const searchResults = document.querySelector('#search-results');

function setMenu(open) {
  document.body.classList.toggle('docs-menu-open', open);
  menuButton?.setAttribute('aria-expanded', String(open));
  if (!open) menuButton?.focus({ preventScroll: true });
}

menuButton?.addEventListener('click', () => {
  setMenu(!document.body.classList.contains('docs-menu-open'));
});

backdrop?.addEventListener('click', () => setMenu(false));
sidebar?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

function isDarkTheme() {
  return document.documentElement.dataset.theme === 'dark';
}

function renderThemeLabel() {
  if (!themeButton) return;
  themeButton.textContent = isDarkTheme() ? 'Light mode' : 'Dark mode';
  themeButton.setAttribute('aria-label', `Switch to ${isDarkTheme() ? 'light' : 'dark'} mode`);
}

themeButton?.addEventListener('click', () => {
  const dark = !isDarkTheme();
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  try {
    localStorage.setItem('taskpilot-theme', String(dark));
  } catch {
    // Theme still works for this page when storage is unavailable.
  }
  renderThemeLabel();
});

renderThemeLabel();

let searchIndex = [];

fetch('/docs/assets/search-index.json')
  .then((response) => {
    if (!response.ok) throw new Error('Search index unavailable.');
    return response.json();
  })
  .then((items) => {
    searchIndex = items;
  })
  .catch(() => {
    searchIndex = [];
  });

function clearSearchResults() {
  if (!searchResults) return;
  searchResults.replaceChildren();
  searchResults.hidden = true;
  searchInput?.setAttribute('aria-expanded', 'false');
}

function scoreResult(item, terms) {
  const title = `${item.title} ${item.label}`.toLowerCase();
  const section = item.section.toLowerCase();
  const text = item.text.toLowerCase();
  return terms.reduce((score, term) => {
    if (title.includes(term)) return score + 8;
    if (section.includes(term)) return score + 4;
    if (text.includes(term)) return score + 1;
    return score - 20;
  }, 0);
}

function renderSearchResults(query) {
  if (!searchResults) return;
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) {
    clearSearchResults();
    return;
  }

  const matches = searchIndex
    .map((item) => ({ item, score: scoreResult(item, terms) }))
    .filter(({ score }) => score >= terms.length)
    .sort((left, right) => right.score - left.score)
    .slice(0, 8);

  searchResults.replaceChildren();
  if (!matches.length) {
    const empty = document.createElement('p');
    empty.className = 'search-empty';
    empty.textContent = 'No documentation matches your search.';
    searchResults.append(empty);
  } else {
    matches.forEach(({ item }) => {
      const link = document.createElement('a');
      const title = document.createElement('strong');
      const section = document.createElement('span');
      link.href = item.url;
      title.textContent = item.label;
      section.textContent = item.section;
      link.append(title, section);
      searchResults.append(link);
    });
  }

  searchResults.hidden = false;
  searchInput?.setAttribute('aria-expanded', 'true');
}

searchInput?.setAttribute('aria-controls', 'search-results');
searchInput?.setAttribute('aria-expanded', 'false');
searchInput?.addEventListener('input', (event) => renderSearchResults(event.target.value));
searchInput?.addEventListener('focus', () => {
  if (searchInput.value.trim()) renderSearchResults(searchInput.value);
});

document.addEventListener('click', (event) => {
  if (!searchShell?.contains(event.target)) clearSearchResults();
});

document.addEventListener('keydown', (event) => {
  const target = event.target;
  const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;

  if (event.key === '/' && !typing) {
    event.preventDefault();
    searchInput?.focus();
  }

  if (event.key === 'Escape') {
    clearSearchResults();
    if (document.body.classList.contains('docs-menu-open')) setMenu(false);
  }
});

const tocLinks = new Map(
  [...document.querySelectorAll('.page-toc a')].map((link) => [link.hash.slice(1), link]),
);

if (tocLinks.size && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];
    if (!visible) return;
    tocLinks.forEach((link, id) => link.classList.toggle('active', id === visible.target.id));
  }, { rootMargin: '-20% 0px -70% 0px' });

  tocLinks.forEach((link, id) => {
    const heading = document.getElementById(id);
    if (heading) observer.observe(heading);
  });
}
