/*
 * edit-links.js: the "edit on GitHub" and "feedback" links of every page,
 * built in the browser from one recipe. GENERATED from
 * cat-harness/src/core/edit-links.ts (EDIT_LINKS_RUNTIME); do not edit here.
 * cat-harness/src/core/tests/edit-links.test.ts fails if the two differ.
 */
(() => {
  if (window.faEditLinks) return;
  function faBlockUrls(c, b) {
  var enc = encodeURIComponent;
  var path = b.source.split("/").map(enc).join("/");
  var branch = c.branch || "main";
  var repo = b.repo || c.repo;
  var src = "https://github.com/" + repo + "/blob/" + branch + "/" + path + (b.line ? "#L" + b.line : "");
  var url = c.siteUrl && b.page ? c.siteUrl.replace(/\/$/, "") + "/" + b.page + "#" + enc(b.label) : (b.pageUrl || "");
  var values = { block: b.label, section: b.section || "", source: b.source, page: b.page || "", url: url, content: c.content || "" };
  var q = new URLSearchParams();
  q.set("title", "Feedback" + (c.content ? " [" + c.content + "]" : "") + ": " + (b.section ? b.section + " — " : "") + b.label);
  if (c.labels && c.labels.length) q.set("labels", c.labels.join(","));
  if (c.template) {
    q.set("template", c.template);
    (c.templateFields || []).forEach(function (f) { if (values[f]) q.set(f, values[f]); });
  } else {
    var facts = c.content ? ["**Content:** \u0060" + c.content + "\u0060"] : [];
    facts.push("**Block:** \u0060" + b.label + "\u0060");
    if (b.section) facts.push("**Section:** " + b.section);
    facts.push("**Source:** " + src);
    if (url) facts.push("**On the site:** " + url);
    q.set("body", facts.concat(["", "**Type:** general | technical | editorial", "", "**Comment:**", "", "", "**Proposed change:**", ""]).join("\n"));
  }
  return { edit: "https://github.com/" + repo + "/edit/" + branch + "/" + path, suggest: "https://github.com/" + repo + "/edit/" + branch + "/" + path, source: src, feedback: "https://github.com/" + c.repo + "/issues/new?" + q };
}
  let cfg = null;
  const config = () => {
    if (cfg) return cfg;
    const el = document.getElementById("fa-edit-cfg");
    if (el) cfg = JSON.parse(el.textContent);
    else {
      const meta = (n) => { const m = document.querySelector('meta[name="' + n + '"]'); return m ? m.content : undefined; };
      cfg = { repo: meta("fa-repo"), branch: meta("fa-branch") || "main" };
    }
    return cfg;
  };
  // A link that names a GitHub file but carries no facts (a generator wrote
  // its href from data, e.g. sourceLinks) gives them up from its own URL.
  const GH = /^https:\/\/github\.com\/([^/]+\/[^/]+)\/(?:blob|edit)\/([^/]+)\/([^#?]+)(?:#L(\d+))?$/;
  const adopt = (a) => {
    const m = GH.exec(a.getAttribute("href") || "");
    if (!m) return false;
    a.dataset.repo = m[1]; a.dataset.branch = m[2];
    a.dataset.src = m[3].split("/").map(decodeURIComponent).join("/");
    if (m[4]) a.dataset.line = m[4];
    return true;
  };
  const ready = (host) => {
    if (host.dataset.ready) return;
    if (!host.dataset.src && !(host.matches("a[data-fa-link]") && adopt(host))) return;
    const c0 = config();
    const c = host.dataset.branch ? Object.assign({}, c0, { branch: host.dataset.branch }) : c0;
    if (!c.repo && !host.dataset.repo) return;
    host.dataset.ready = "1";
    const label = host.dataset.block || host.dataset.src;
    const u = faBlockUrls(c, { label: label, source: host.dataset.src, section: host.dataset.sec,
      line: host.dataset.line ? Number(host.dataset.line) : undefined, repo: host.dataset.repo, page: host.dataset.page || c.page,
      pageUrl: location.href.split("#")[0] + "#" + encodeURIComponent(label) });
    const links = host.matches("a[data-fa-link]") ? [host] : host.querySelectorAll("a[data-fa-link]");
    // Only this host's own links: a nested host (a Lean link inside a block's row) fills itself.
    for (const a of links) if ((a === host || a.closest("[data-src]") === host) && u[a.dataset.faLink]) a.href = u[a.dataset.faLink];
  };
  const fill = (root) => { addSuggest(root); for (const h of (root || document).querySelectorAll("[data-src], a[data-fa-link]")) ready(h); };
  // A page that learns its repository later (the folio site reads it from its outline) says so here.
  const configure = (c) => { cfg = c; };
  // ── ✍ suggest: a block's Markdown in a WYSIWYG editor, the change as a prefilled issue ──
  //
  // Beside every ✎ edit link whose source is Markdown, on any page of any
  // harness. The editor (Milkdown Crepe, MIT) is imported only on first use.
  // The text is read through the block's KG node (<block>.jsonld, its text)
  // from the repository itself, and the change leaves as a GitHub issue the
  // reader submits: no OAuth, no token, no server. Variables, directives and
  // LaTeX references are the reader's to change, add or delete; what is
  // checked is that each is well-formed, and the panel under the editor shows
  // each variable's current value from the site's values.jsonld. Nothing read
  // is written as HTML.
  const SUGGEST_LIB = "https://cdn.jsdelivr.net/npm/@milkdown/crepe@7.22.2";
  const SUGGEST_KATEX_CSS = "https://cdn.jsdelivr.net/npm/katex@0.18.10/dist/katex.min.css";
  const SUGGEST_KATEX = "https://cdn.jsdelivr.net/npm/katex@0.18.10/+esm";
  const TOKENISH = /\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|:{1,2}[A-Za-z][\w-]*\[[^\]\n]*\](?:\{[^}\n]*\})?|\\[A-Za-z]+\{[^}\n]*\}/g;
  // Variables, directives and LaTeX references stay the reader's to change,
  // add or delete. They are wrapped in \u27e6 \u27e7 only so the editor's
  // Markdown escaping cannot corrupt them, and unwrapped on submit; what is
  // checked is that each one is still well-formed, nothing more (owner,
  // 2026-10-14: "I only want that the syntax is valid").
  const wrap = (md) => md.replace(TOKENISH, (m) => "\u27e6" + m + "\u27e7");
  // The same, less the LaTeX references: for a profile that keeps LaTeX verbatim itself.
  const TOKENS_NO_LATEX = /\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|:{1,2}[A-Za-z][\w-]*\[[^\]\n]*\](?:\{[^}\n]*\})?/g;
  const unwrap = (md) => md.replace(/\u27e6([^\u27e6\u27e7]*)\u27e7/g, (m, inner) => inner.replace(/\\([!-\/:-@\[-\u0060{-~])/g, "$1"));
  const LIQUID = /^\{\{\s*[A-Za-z_][\w-]*(?:\.[\w-]+|\[\d+\])*\s*(?:\|\s*[A-Za-z_]\w*(?:\s*:\s*[^|{}]+?)?\s*)*\}\}$/;
  const TAG = /^\{%\s*[A-Za-z_]\w*[^%]*%\}$/;
  const DIRECTIVE = /^:{1,2}[A-Za-z][\w-]*\[[^\]\n]*\](?:\{[^{}\n]*\})?$/;
  const LATEXREF = /^\\[A-Za-z]+\{[^{}\n]+\}$/;
  // latex === false: a profile's own checker reads the LaTeX, so this coarse check does not.
  const syntaxErrors = (md, latex) => {
    const bad = [];
    for (const m of md.matchAll(/\{\{[\s\S]*?(?:\}\}|$)|\{%[\s\S]*?(?:%\}|$)/g)) if (!LIQUID.test(m[0]) && !TAG.test(m[0])) bad.push(m[0]);
    for (const m of md.matchAll(/:{1,2}[A-Za-z][\w-]*\[[^\n]*?(?:\](?:\{[^\n]*?\})?|$)/gm)) if (!DIRECTIVE.test(m[0])) bad.push(m[0]);
    if (latex !== false) for (const m of md.matchAll(/\\(?:cite|ref|eqref|autoref|cref)\b[^\s]*/g)) if (!LATEXREF.test(m[0].replace(/[.,;:)]+$/, ""))) bad.push(m[0]);
    return bad;
  };
  // Variable names and, when the site published them, their current values.
  const variablesIn = (md) => Array.from(md.matchAll(/\{\{\s*([A-Za-z_][\w.\-\[\]]*)/g), (m) => m[1]);
  const lineDiff = (a, b) => {
    const x = a.split("\n"), y = b.split("\n"), n = x.length, m = y.length;
    const L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = x[i] === y[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    const out = [];
    let i = 0, j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && x[i] === y[j]) { out.push(" " + x[i]); i++; j++; }
      else if (j < m && (i === n || L[i][j + 1] > L[i + 1][j])) out.push("+" + y[j++]);
      else out.push("-" + x[i++]);
    }
    // Two lines of context around each change.
    const keep = out.map((l, k) => out.slice(Math.max(0, k - 2), k + 3).some((c) => c[0] !== " "));
    const hunks = [];
    out.forEach((l, k) => { if (keep[k]) hunks.push(l); else if (hunks.length && hunks[hunks.length - 1] !== "@@") hunks.push("@@"); });
    if (hunks[hunks.length - 1] === "@@") hunks.pop();
    return hunks.join("\n");
  };
  const raw = (repo, branch, path) => "https://raw.githubusercontent.com/" + repo + "/" + branch + "/" + path.split("/").map(encodeURIComponent).join("/");
  const sourceOf = (a) => {
    const h = a.closest("[data-src]");
    if (h && h.dataset.src) return { src: h.dataset.src, label: h.dataset.block || h.dataset.src, repo: h.dataset.repo, branch: h.dataset.branch };
    if (a.dataset.src || adopt(a)) return { src: a.dataset.src, label: a.dataset.block || a.dataset.src, repo: a.dataset.repo, branch: a.dataset.branch };
    return null;
  };
  const el = (tag, props, kids) => { const e = Object.assign(document.createElement(tag), props || {}); for (const k of kids || []) e.append(k); return e; };
  // A block's YAML front matter is not the reader's to edit: Crepe would turn
  // it into a thematic break and a setext heading. It is kept aside, unchanged.
  const FRONT_MATTER = /^---\n[\s\S]*?\n---\n/;
  // The KG labels and bibliography keys a profile's checker warns against, read once from the page's graph.
  let kgRefs;
  const kgReferences = async (c) => {
    if (kgRefs !== undefined) return kgRefs;
    kgRefs = null;
    const g = c.graph ? await fetch(c.graph).then((r) => (r.ok ? r.json() : null)).catch(() => null) : null;
    const nodes = g && (g["@graph"] || g);
    if (!Array.isArray(nodes)) return kgRefs;
    const labels = [], keys = [];
    for (const n of nodes) {
      if (n && typeof n.label === "string" && n.label) labels.push(n.label);
      const m = n && typeof n["@id"] === "string" ? /(?:^|\/)references\/([^/#?]+)$/.exec(n["@id"]) : null;
      if (m) keys.push(decodeURIComponent(m[1]));
    }
    // A graph with no reference nodes says nothing about citations: that check is skipped, not failed.
    kgRefs = keys.length ? { labels: labels, citeKeys: keys } : { labels: labels };
    return kgRefs;
  };
  // A profile (an editor-checker node the site bundled, e.g. folio-assistant-sci's
  // paper-latex) for the block's kind: its checker, and its Crepe settings.
  const profileFor = (c, kind) => ((c.suggest && c.suggest.profiles) || []).find((p) => p && p.module && (!p.kinds || p.kinds.indexOf(kind) >= 0));
  const suggest = async (a) => {
    const s = sourceOf(a), c = config();
    if (!s || !/\.md$/.test(s.src)) return;
    const repo = s.repo || c.repo, branch = s.branch || c.branch || "main";
    const status = el("p", { className: "fa-suggest-status", textContent: "Loading " + s.src + " …" });
    const host = el("div", { className: "fa-suggest-editor" });
    const send = el("button", { type: "button", textContent: "Submit as an issue", disabled: true });
    const close = el("button", { type: "button", textContent: "Cancel" });
    const toggle = el("button", { type: "button", hidden: true });
    const vars = el("ul", { className: "fa-suggest-vars" });
    const dlg = el("dialog", { className: "fa-suggest" }, [el("h2", { textContent: "Suggest a change: " + s.label }), status, host, vars, el("p", {}, [send, " ", toggle, " ", close])]);
    let surface = null;
    close.onclick = () => { if (surface) surface.destroy(); dlg.close(); dlg.remove(); };
    if (!document.getElementById("fa-suggest-css"))
      document.head.append(el("style", { id: "fa-suggest-css", textContent: "dialog.fa-suggest{width:min(60rem,95vw);max-height:90vh;overflow:auto;padding:1rem 1.25rem}dialog.fa-suggest h2{font-size:1.1rem;margin:0 0 .5rem}.fa-suggest-status{color:#5b6770;font-size:.9rem}.fa-suggest-editor{border:1px solid #d6dde2;min-height:12rem;margin:.5rem 0}.fa-suggest-editor textarea{width:100%;box-sizing:border-box;font-family:ui-monospace,monospace;font-size:.9rem;border:0;padding:.5rem}.fa-suggest-vars{font-size:.85rem;color:#5b6770;margin:.25rem 0;padding-left:1.2rem}.fa-suggest-vars .bad{color:#b3261e}.fa-suggest-vars .warn{color:#8a5a00}" }));
    document.body.append(dlg);
    dlg.showModal();
    let path = s.src, original, kind = String(s.label).split(":")[0];
    try {
      // The KG node names the block's text and its kind; a page without one falls back to the source.
      const node = await fetch(raw(repo, branch, s.src.replace(/\.md$/, ".jsonld"))).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      if (node && typeof node.text === "string") path = s.src.replace(/[^/]*$/, "") + node.text;
      if (node && typeof node.kind === "string") kind = node.kind;
      const r = await fetch(raw(repo, branch, path));
      if (!r.ok) throw new Error(r.status + " reading " + path);
      original = await r.text();
    } catch (e) { status.textContent = "Could not load the block: " + e.message; return; }
    const fm = FRONT_MATTER.exec(original);
    const head = fm ? fm[0] : "", body = original.slice(head.length);
    // The site's variable values, as KG nodes (values.jsonld), when it publishes them.
    const values = c.values ? await fetch(c.values).then((r) => (r.ok ? r.json() : null)).catch(() => null) : null;
    const valueOf = (key) => {
      const nodes = values && (values["@graph"] || values);
      const n = Array.isArray(nodes) ? nodes.find((x) => x.key === key) : null;
      return n ? String(n.formatted !== undefined ? n.formatted : n.value) : undefined;
    };
    // The block's profile, when the site declares one for its kind. A profile
    // that fails to load leaves the generic editor and its generic checks.
    const prof = profileFor(c, kind);
    let mod = null, notes = [];
    if (prof) {
      try { mod = await import(new URL(prof.module, location.href).href); }
      catch (e) { notes.push("The " + (prof.id || "profile") + " checks did not load (" + e.message + ")."); }
    }
    const km = (c.suggest && c.suggest.katexMacros) || {};
    const macros = mod && typeof mod.macros === "function" ? mod.macros(km) : undefined;
    const kg = mod && typeof mod.check === "function" ? await kgReferences(c) : null;
    // A profile that keeps LaTeX verbatim itself (remarkFirst) must not have it wrapped in \u27e6 \u27e7 as well.
    const latexOwned = !!(mod && mod.remarkFirst);
    const wrapped = latexOwned ? body.replace(TOKENS_NO_LATEX, (m) => "\u27e6" + m + "\u27e7") : wrap(body);
    let katex = null;
    // The visual surface: Crepe, with the profile's latex settings, node views
    // and first remark transformer. Its base is Crepe's round-trip of the
    // source, so escapes Crepe adds are not counted as the reader's change.
    const visual = async (text) => {
      const lib = (c.suggest && c.suggest.lib) || SUGGEST_LIB;
      // The theme's own @import of KaTeX names a package, which a CDN cannot resolve: named here.
      for (const href of [lib + "/lib/theme/common/style.css", lib + "/lib/theme/frame/style.css", SUGGEST_KATEX_CSS])
        if (!document.querySelector('link[href="' + href + '"]')) document.head.append(el("link", { rel: "stylesheet", href: href }));
      const { Crepe } = await import((c.suggest && c.suggest.module) || lib + "/+esm");
      if (mod && mod.nodeViews && !katex) katex = (await import((c.suggest && c.suggest.katex) || SUGGEST_KATEX)).default;
      const box = el("div");
      host.replaceChildren(box);
      const opts = { root: box, defaultValue: text };
      if (mod && typeof mod.latexConfig === "function") opts.featureConfigs = { [Crepe.Feature.Latex]: mod.latexConfig(km) };
      const crepe = new Crepe(opts);
      if (mod && (mod.remarkFirst || mod.nodeViews))
        // Milkdown's own InitReady timer, found in the schema's wait list so no
        // second copy of @milkdown/core is imported: after it, before the schema
        // builds the parser, is when a remark plugin can still go first.
        crepe.editor.use((ctx) => {
          const init = (ctx.get("schemaTimer") || []).find((t) => t && t.name === "InitReady");
          return async () => {
            if (init) await ctx.wait(init);
            if (typeof mod.remarkFirst === "function") ctx.update("remarkPlugins", mod.remarkFirst(macros));
            if (mod.nodeViews && katex) ctx.update("nodeView", (v) => v.concat(Object.keys(mod.nodeViews).map((n) => [n, mod.nodeViews[n](katex, km)])));
          };
        });
      await crepe.create();
      const get = () => unwrap(crepe.getMarkdown());
      return { name: "visual", get: get, base: get(), destroy: () => { try { crepe.destroy(); } catch (e) {} } };
    };
    // The raw surface: the block's Markdown as it is, LaTeX and all.
    const rawSurface = (text) => {
      const ta = el("textarea", { value: text, rows: 18 });
      host.replaceChildren(ta);
      return { name: "raw", get: () => ta.value, base: body, destroy: () => {} };
    };
    const rawFirst = !!(prof && prof.rawLatexFirstFor && prof.rawLatexFirstFor.indexOf(kind) >= 0);
    try {
      surface = rawFirst ? rawSurface(body) : await visual(wrapped);
    } catch (e) {
      // No editor (offline, blocked CDN): the same flow over plain Markdown.
      surface = rawSurface(body);
      notes.push("The visual editor did not load (" + e.message + "); editing the Markdown directly.");
    }
    const describe = () => {
      if (surface.name === "raw") return "Editing the raw Markdown" + (mod ? " and LaTeX" : "") + ".";
      return wrapped === body ? "" : "Variables, glossary terms and references are shown in \u27e6 \u27e7: change, add or delete them freely; their syntax is checked when you submit.";
    };
    status.textContent = notes.concat([describe()]).filter(Boolean).join(" ");
    // Both surfaces when a profile serves the block (owner, 2026-10-14: "both").
    if (prof && mod) {
      toggle.hidden = false;
      const label = () => { toggle.textContent = surface.name === "raw" ? "Edit visually" : "Edit as raw text"; };
      label();
      toggle.onclick = async () => {
        const text = surface.get();
        const next = surface.name === "raw" ? "visual" : "raw";
        surface.destroy();
        try { surface = next === "raw" ? rawSurface(text) : await visual(latexOwned ? text.replace(TOKENS_NO_LATEX, (m) => "\u27e6" + m + "\u27e7") : wrap(text)); }
        catch (e) { surface = rawSurface(text); notes.push("The visual editor did not load (" + e.message + ")."); }
        label();
        status.textContent = notes.concat([describe()]).filter(Boolean).join(" ");
      };
    }
    // What the profile's checker says the edit introduces: errors block, warnings do not.
    const findings = (text) => {
      if (!mod || typeof mod.check !== "function" || text === surface.base) return [];
      try { return mod.check(surface.base, text, { macros: macros, kg: kg || undefined }) || []; }
      catch (e) { return [{ severity: "warning", message: "the checker failed: " + e.message, line: 0 }]; }
    };
    // Live: each variable and its current value, any item whose syntax is broken, and the profile's findings.
    const refresh = () => {
      if (!dlg.isConnected) return clearInterval(timer);
      const text = surface.get();
      const items = variablesIn(text).map((k) => { const v = valueOf(k); return el("li", { textContent: k + (v === undefined ? (values ? " \u2014 not a published variable" : " \u2014 value not published") : " = " + v) }); });
      for (const b of syntaxErrors(text, !mod)) items.push(el("li", { className: "bad", textContent: "Not well-formed: " + b.slice(0, 80) }));
      for (const f of findings(text)) items.push(el("li", { className: f.severity === "error" ? "bad" : "warn", textContent: (f.severity === "error" ? "Error" : "Warning") + (f.line ? " (line " + f.line + ")" : "") + ": " + f.message }));
      vars.replaceChildren(...items);
    };
    const timer = setInterval(refresh, 800);
    refresh();
    send.disabled = false;
    send.onclick = async () => {
      const now = surface.get();
      if (now === surface.base) { status.textContent = "Nothing has changed yet."; return; }
      const errs = syntaxErrors(now, !mod).concat(findings(now).filter((f) => f.severity === "error").map((f) => f.message));
      if (errs.length) { status.textContent = "Fix the syntax first: " + errs.map((e) => e.slice(0, 60)).join(" \u00b7 "); return; }
      const facts = ["**Block:** \u0060" + s.label + "\u0060", "**Source:** https://github.com/" + repo + "/blob/" + branch + "/" + path, "**On the site:** " + location.href.split("#")[0] + "#" + encodeURIComponent(s.label)];
      const how = surface.name === "raw" ? "in the raw editor" : "in the visual editor (the diff is against the editor's rendering of the source)";
      const issue = facts.concat(["", "**Suggested change**, made " + how + ":", "", "\u0060\u0060\u0060diff", lineDiff(surface.base, now), "\u0060\u0060\u0060", "", "**Why:**", ""]).join("\n");
      const q = new URLSearchParams({ title: "Suggested edit: " + s.label, body: issue });
      let url = "https://github.com/" + (c.repo || repo) + "/issues/new?" + q;
      // GitHub refuses very long URLs: carry the body on the clipboard instead.
      if (url.length > 7000) {
        try { await navigator.clipboard.writeText(issue); } catch (e) { status.textContent = "Too long for a link, and the clipboard is blocked."; return; }
        url = "https://github.com/" + (c.repo || repo) + "/issues/new?" + new URLSearchParams({ title: "Suggested edit: " + s.label, body: "The suggested change is on the clipboard: paste it here." });
      }
      window.open(url, "_blank", "noopener");
      close.onclick();
    };
  };
  const SUGGEST_TITLE = "Suggest a change in a visual editor (opens a GitHub issue)";
  const addSuggest = (root) => {
    // Only over a real DOM: the runtime is also evaluated against stubs (a
    // viewer's own tests), where there is nothing to add a link to.
    const r = root || document;
    if (!r || typeof r.querySelectorAll !== "function") return;
    for (const a of r.querySelectorAll('a[data-fa-link="edit"], a.ba-edit')) {
      if (a.nextElementSibling && a.nextElementSibling.dataset.faLink === "suggest") continue;
      const s = sourceOf(a);
      if (!s || !/\.md$/.test(s.src)) continue;
      const b = el("a", { className: "ba-suggest", href: a.getAttribute("href") || "#", title: SUGGEST_TITLE, textContent: "✍ suggest", tabIndex: 0 });
      b.dataset.faLink = "suggest";
      a.after(b);
    }
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[data-fa-link="suggest"]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    suggest(a);
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => addSuggest());
  else addSuggest();
  window.faEditLinks = { urls: faBlockUrls, fill: fill, configure: configure };
  // Both the link reached and the host it sits in: a pointer that lands
  // straight on a compact host's link (no gap crossed) or keyboard focus on it
  // matches the bare link first, which carries no facts of its own.
  for (const ev of ["pointerover", "focusin", "touchstart"])
    document.addEventListener(ev, (e) => {
      if (!e.target.closest) return;
      const a = e.target.closest("a[data-fa-link]"), h = e.target.closest("[data-src]");
      if (a) ready(a);
      if (h && h !== a) ready(h);
    }, { passive: true });
})();
