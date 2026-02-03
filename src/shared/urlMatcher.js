(() => {
  const escapeRegex = (s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");

  function wildcardToRegExp(pattern) {
    const p = pattern.trim();
    if (!p || p === "*") return /^.*$/i;

    const hasWildcard = p.includes("*");
    if (hasWildcard) {
      return new RegExp(`^${escapeRegex(p).replace(/\\\*/g, ".*")}$`, "i");
    }

    return new RegExp(`^${escapeRegex(p)}`, "i");
  }

  function doesUrlMatch(url, pattern) {
    try {
      return wildcardToRegExp(pattern).test(url);
    } catch {
      return false;
    }
  }

  window.DOMModifierUrlMatcher = { wildcardToRegExp, doesUrlMatch };
})();
