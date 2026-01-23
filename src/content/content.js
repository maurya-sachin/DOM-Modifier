(() => {
  const STYLE_PREFIX = "dom-modifier-";
  let activeRuleIds = [];

  const toStyleId = (ruleId) =>
    `${STYLE_PREFIX}${String(ruleId).toLowerCase().replace(/[^a-z0-9_-]/g, "-")}`;

  function removeStaleStyles(nextIds) {
    const keep = new Set(nextIds);
    for (const id of activeRuleIds) {
      if (!keep.has(id)) document.getElementById(toStyleId(id))?.remove();
    }
    activeRuleIds = nextIds;
  }

  function upsertStyle(rule) {
    const id = toStyleId(rule.id);
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = `${rule.selector} { ${rule.cssText} }`;
  }

  async function applyRules() {
    const settings = await window.DOMModifierStorage.getSettings();
    if (!settings.extensionEnabled) {
      removeStaleStyles([]);
      return;
    }

    const nextIds = [];
    for (const rule of settings.rules) {
      if (!rule?.enabled || !rule.selector || !rule.cssText) continue;

      const matched = window.DOMModifierUrlMatcher.doesUrlMatch(
        location.href,
        rule.urlPattern || "*"
      );
      if (!matched) continue;

      upsertStyle(rule);
      nextIds.push(rule.id);
    }
    removeStaleStyles(nextIds);
  }

  function patchHistory(method) {
    const original = history[method];
    history[method] = function (...args) {
      const result = original.apply(this, args);
      applyRules();
      return result;
    };
  }

  window.addEventListener("popstate", applyRules);
  window.addEventListener("hashchange", applyRules);
  patchHistory("pushState");
  patchHistory("replaceState");

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === window.DOMModifierStorage.AREA && changes[window.DOMModifierStorage.STORAGE_KEY]) {
      applyRules();
    }
  });

  if (document.head) applyRules();
  else document.addEventListener("DOMContentLoaded", applyRules, { once: true });
})();
