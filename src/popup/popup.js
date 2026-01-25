(() => {
  const toggle = document.getElementById("extensionEnabled");
  const stats = document.getElementById("stats");

  async function render() {
    const { extensionEnabled, rules } = await window.DOMModifierStorage.getSettings();
    toggle.checked = extensionEnabled;
    const enabled = rules.filter((r) => r?.enabled).length;
    stats.textContent = `${enabled} of ${rules.length} rule(s) enabled`;
  }

  toggle.addEventListener("change", async () => {
    await window.DOMModifierStorage.patchSettings({ extensionEnabled: toggle.checked });
    await render();
  });

  document.getElementById("openSettings").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });

  render();
})();
