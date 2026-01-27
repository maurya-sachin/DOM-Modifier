(() => {
  const form = document.getElementById("ruleForm");
  const list = document.getElementById("rulesList");
  const emptyState = document.getElementById("emptyState");
  const extensionToggle = document.getElementById("extensionEnabled");
  const editIdInput = document.getElementById("editId");
  const submitBtn = document.getElementById("submitButton");
  const cancelBtn = document.getElementById("cancelEditButton");

  const uid = () =>
    `rule-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const esc = (str) => {
    const el = document.createElement("span");
    el.textContent = str;
    return el.innerHTML;
  };

  function formToRule() {
    const d = new FormData(form);
    return {
      id: uid(),
      name: String(d.get("name") || "").trim(),
      urlPattern: String(d.get("urlPattern") || "*").trim(),
      selector: String(d.get("selector") || "").trim(),
      cssText: String(d.get("cssText") || "").trim(),
      enabled: Boolean(d.get("enabled"))
    };
  }

  function resetForm() {
    editIdInput.value = "";
    form.reset();
    document.getElementById("enabled").checked = true;
    submitBtn.textContent = "Save Rule";
    cancelBtn.classList.add("hidden");
  }

  function fillForm(rule) {
    editIdInput.value = rule.id;
    form.elements.name.value = rule.name;
    form.elements.urlPattern.value = rule.urlPattern;
    form.elements.selector.value = rule.selector;
    form.elements.cssText.value = rule.cssText;
    form.elements.enabled.checked = Boolean(rule.enabled);
    submitBtn.textContent = "Update Rule";
    cancelBtn.classList.remove("hidden");
  }

  function createRuleCard(rule, settings) {
    const li = document.createElement("li");
    li.className = "rule";
    li.innerHTML = `
      <div class="rule-head">
        <strong>${esc(rule.name)}</strong>
        <div class="rule-actions">
          <button class="secondary" data-action="toggle">
            ${rule.enabled ? "Disable" : "Enable"}
          </button>
          <button class="secondary" data-action="edit">Edit</button>
          <button class="danger" data-action="delete">Delete</button>
        </div>
      </div>
      <div class="rule-meta">
        URL: <code>${esc(rule.urlPattern)}</code> · Selector: <code>${esc(rule.selector)}</code>
      </div>
      <div class="rule-meta">CSS: <code>${esc(rule.cssText)}</code></div>
    `;

    li.querySelector('[data-action="toggle"]').addEventListener("click", async () => {
      const next = settings.rules.map((r) =>
        r.id === rule.id ? { ...r, enabled: !r.enabled } : r
      );
      await window.DOMModifierStorage.patchSettings({ rules: next });
      await render();
    });

    li.querySelector('[data-action="delete"]').addEventListener("click", async () => {
      const next = settings.rules.filter((r) => r.id !== rule.id);
      await window.DOMModifierStorage.patchSettings({ rules: next });
      await render();
    });

    li.querySelector('[data-action="edit"]').addEventListener("click", () => {
      fillForm(rule);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    return li;
  }

  async function render() {
    const settings = await window.DOMModifierStorage.getSettings();
    extensionToggle.checked = settings.extensionEnabled;

    list.innerHTML = "";
    for (const rule of settings.rules) {
      list.appendChild(createRuleCard(rule, settings));
    }
    emptyState.style.display = settings.rules.length ? "none" : "block";
  }

  extensionToggle.addEventListener("change", async () => {
    await window.DOMModifierStorage.patchSettings({
      extensionEnabled: extensionToggle.checked
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const rule = formToRule();
    if (!rule.name || !rule.urlPattern || !rule.selector || !rule.cssText) return;

    const settings = await window.DOMModifierStorage.getSettings();
    const editId = editIdInput.value.trim();

    const nextRules = editId
      ? settings.rules.map((r) => (r.id === editId ? { ...rule, id: editId } : r))
      : [...settings.rules, rule];

    await window.DOMModifierStorage.patchSettings({ rules: nextRules });
    resetForm();
    await render();
  });

  cancelBtn.addEventListener("click", resetForm);

  resetForm();
  render();
})();
