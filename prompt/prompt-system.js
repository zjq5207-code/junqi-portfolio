(() => {
  const shell = document.querySelector('.router-shell');
  if (!shell) return;

  const tabs = [...shell.querySelectorAll('[data-route]')];
  const panels = [...shell.querySelectorAll('[data-panel]')];

  const activate = (route) => {
    shell.dataset.router = route;
    tabs.forEach((tab) => {
      const active = tab.dataset.route === route;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      const active = panel.dataset.panel === route;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.route));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
      activate(tabs[next].dataset.route);
      tabs[next].focus();
    });
  });
})();
