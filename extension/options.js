browser.storage.sync.get().then((settings) => {
  const list = document.getElementById('list');
  let site = '';

  for (const rule of RULES) {
    if (rule.site !== site) {
      site = rule.site;
      list.append(Object.assign(document.createElement('h2'), { textContent: site }));
    }

    const box = Object.assign(document.createElement('input'), { type: 'checkbox', checked: settings[rule.id] !== false });
    box.addEventListener('change', () => browser.storage.sync.set({ [rule.id]: box.checked }));

    const label = document.createElement('label');
    label.append(box, ' ' + rule.label);
    list.append(label);
  }
});
