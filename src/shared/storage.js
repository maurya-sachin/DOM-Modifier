(() => {
  const STORAGE_KEY = "domModifierSettings";
  const DEFAULT_SETTINGS = { extensionEnabled: true, rules: [] };
  const AREA =
    chrome.storage && chrome.storage.session ? "session" : "sync";
  const store = chrome.storage[AREA];

  async function getSettings() {
    const result = await store.get(STORAGE_KEY);
    const stored = result[STORAGE_KEY];
    if (!stored || typeof stored !== "object") return DEFAULT_SETTINGS;

    return {
      ...DEFAULT_SETTINGS,
      ...stored,
      rules: Array.isArray(stored.rules) ? stored.rules : []
    };
  }

  async function saveSettings(settings) {
    await store.set({ [STORAGE_KEY]: settings });
  }

  async function patchSettings(patch) {
    const current = await getSettings();
    const next = { ...current, ...patch };
    await saveSettings(next);
    return next;
  }

  window.DOMModifierStorage = {
    STORAGE_KEY,
    AREA,
    getSettings,
    saveSettings,
    patchSettings
  };
})();
