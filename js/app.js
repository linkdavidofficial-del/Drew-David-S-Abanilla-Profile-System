import { SITE } from "./data.js";

/* Asset base: the same code runs at the site root on Vercel (/js/app.js) and
   under Perchance preview (…/src/js/app.js), where page-relative assets live
   in src/. Derive the prefix from this module's own URL so both just work. */
const ASSET_PREFIX = new URL(".", import.meta.url).pathname.includes("/src/js/") ? "src/" : "";
const ASSET_KEYS = new Set(["img", "backdrop", "file", "pageDir", "pdf", "bookCover"]);
(function prefixAssets(node){
  if (Array.isArray(node)){ node.forEach(prefixAssets); return; }
  if (node && typeof node === "object"){
    for (const k of Object.keys(node)){
      const v = node[k];
      if (ASSET_KEYS.has(k) && typeof v === "string" && v && !/^(?:[a-z]+:|\/|#)/i.test(v)) node[k] = ASSET_PREFIX + v;
      else prefixAssets(v);
    }
  }
})(SITE);

function illusArt(a, i){
  if (a && a.img) return `<img src="${a.img}" alt="${esc(a.title)}" loading="lazy">`;
  return artSVG(a.colors, i + 2);
}
/* ---------- generative cover art (fallback only) ---------- */
function designArt(d, i){
  if (d && d.img) return `<img src="${d.img}" alt="${esc(d.title)}" loading="lazy">`;
  return artSVG(d.colors, i == null ? 5 : i + 5);
}
function artSVG(colors, seed){
  seed = seed == null ? 1 : seed;
  let t = (seed * 9301 + 49297) % 233280;
  const rnd = () => (t = (t * 9301 + 49297) % 233280) / 233280;
  const c0 = colors[0] || "#2456c4", c1 = colors[1] || "#e9effb", c2 = colors[2] || "#f2b705";
  const gid = "g" + seed + "_" + Math.floor(rnd()*9999);
  const style = seed % 3;
  const r1 = Math.floor(rnd()*40), r2 = Math.floor(rnd()*40);
  let inner = "";
  if (style === 0) {
    // landscape: sky, sun, clouds, layered hills
    inner = `<ellipse cx="${70+r1}" cy="${52+r2*0.4}" rx="30" ry="16" fill="#fff" opacity=".92"/>`
      + `<ellipse cx="${98+r1*0.5}" cy="${44}" rx="22" ry="17" fill="#fff" opacity=".95"/>`
      + `<circle cx="${290-r1}" cy="${70+r2*0.3}" r="34" fill="${c2}"/>`
      + `<circle cx="${290-r1}" cy="${70+r2*0.3}" r="46" fill="${c2}" opacity=".25"/>`
      + `<path d="M0 168 Q90 128 190 162 T400 150 V300 H0 Z" fill="${c1}" opacity=".92"/>`
      + `<path d="M0 208 Q110 176 220 206 T400 196 V300 H0 Z" fill="#0e2052" opacity=".92"/>`
      + `<circle cx="${60+r2}" cy="${236}" r="5" fill="${c2}" opacity=".9"/>`.repeat(1);
  } else if (style === 1) {
    // bauhaus: arcs, circles, bars
    inner = `<circle cx="${120+r1}" cy="${110}" r="78" fill="${c1}" opacity=".95"/>`
      + `<path d="M200 300 A110 110 0 0 1 400 190 V300 Z" fill="${c2}" opacity=".95"/>`
      + `<rect x="30" y="${200+r2*0.5}" width="150" height="18" rx="9" fill="${c2}"/>`
      + `<rect x="30" y="${226+r2*0.5}" width="100" height="12" rx="6" fill="#fff" opacity=".85"/>`
      + `<circle cx="${320-r1*0.5}" cy="${70}" r="22" fill="#fff" opacity=".9"/>`
      + `<circle cx="52" cy="62" r="10" fill="${c2}"/>`;
  } else {
    // diagonal poster
    inner = `<path d="M-40 300 L170 -20 H290 L80 300 Z" fill="${c1}" opacity=".9"/>`
      + `<path d="M120 300 L330 -20 H400 V60 L210 300 Z" fill="${c2}" opacity=".92"/>`
      + `<circle cx="${90+r1}" cy="${80}" r="34" fill="none" stroke="#fff" stroke-width="10" opacity=".8"/>`
      + `<rect x="40" y="220" width="170" height="22" rx="4" fill="#fff" opacity=".9"/>`
      + `<rect x="40" y="248" width="110" height="12" rx="3" fill="#fff" opacity=".55"/>`;
  }
  // subtle dot texture
  let dots = "";
  for (let i=0;i<24;i++){ const dx=Math.floor(rnd()*400), dy=Math.floor(rnd()*300); dots += `<circle cx="${dx}" cy="${dy}" r="1.6" fill="#fff" opacity=".28"/>`; }
  return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">`
    + `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/>`
    + (style===0 ? `<stop offset="1" stop-color="${c0}"/>` : ``) + `</linearGradient></defs>`
    + `<rect width="400" height="300" fill="url(#${gid})"/>` + inner + dots + `</svg>`;
}
function hillSVG(){
  return `<svg viewBox="0 0 250 220" xmlns="http://www.w3.org/2000/svg">`
  + `<rect width="250" height="220" fill="#dce9fb"/>`
  + `<ellipse cx="70" cy="48" rx="26" ry="16" fill="#fff"/><ellipse cx="92" cy="42" rx="22" ry="18" fill="#fff"/><ellipse cx="52" cy="42" rx="14" ry="12" fill="#fff"/>`
  + `<path d="M0 130 Q60 105 120 128 T250 122 V220 H0 Z" fill="#9dbcf3"/>`
  + `<path d="M0 148 Q70 128 140 148 T250 140 V220 H0 Z" fill="#16337e"/>`
  + `</svg>`;
}

/* ---------- render ---------- */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");

function render(){
  document.title = SITE.name + " — " + SITE.portfolioLabel;
  $("brandNameEl").textContent = SITE.portfolioLabel;
  $("footNameEl").textContent = SITE.name;
  $("footTagEl").textContent = SITE.portfolioLabel;
  $("portfolioLabelEl").textContent = SITE.portfolioLabel;
  $("heroNameEl").textContent = SITE.name;
  $("heroLine1El").innerHTML = "<span class='hello'>Hello, I'm</span><span class='hl'>" + esc(SITE.name) + "</span>";
  const _icons = ["✏️", "📖", "🎨"];
  const _roles = String(SITE.tagline).split("•").map(s => s.trim()).filter(Boolean);
  $("heroLine2El").innerHTML = _roles.map((r, i) => `<span class="rolePill"><i>${_icons[i % _icons.length]}</i>${esc(r)}</span>`).join("");
  $("heroIntroEl").textContent = SITE.intro;
 $("heroMetaEl").innerHTML =
      `<div class="metaCard"><span class="ic">📍</span><span><small>Based in</small><strong>${esc(SITE.location)}</strong></span></div>`
    + `<div class="metaCard"><span class="ic">🎓</span><span><small>School</small><strong>${esc(SITE.school)}</strong></span></div>`
    + `<div class="metaCard"><span class="ic">@</span><span><small>Email</small><strong>${esc(SITE.email)}</strong></span></div>`;
  const _st = $("heroStatsEl");
  if (_st && SITE.stats) _st.innerHTML = SITE.stats.map(s => `<div class="stat"><b>${esc(s.n)}</b><span>${esc(s.t)}</span></div>`).join("");
  $("heroPhotoEl").innerHTML = `<img src="${ASSET_PREFIX}profile.png" alt="Profile photo of ${esc(SITE.name)}">`;
  $("aboutPhotoEl").innerHTML = `<img src="${ASSET_PREFIX}profile.png" alt="Photo of ${esc(SITE.name)}">`;
  $("heroSocialEl").innerHTML = SITE.socials.map(s =>
    `<a href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("");
  $("logoEl").textContent = SITE.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  // premium header — util bar + CTA stay in sync with SITE
  try {
    const _ul = $("utilLeftEl");
    if (_ul) _ul.textContent = "Open for collabs • " + SITE.location + " • " + SITE.school;
    const _ur = $("utilRightEl");
    if (_ur) _ur.innerHTML = `<a href="mailto:${esc(SITE.email)}">✉ ${esc(SITE.email)}</a>`
      + SITE.socials.slice(0, 2).map(s => `<a href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("");
    const _cta = $("headCtaEl");
    if (_cta) _cta.href = "mailto:" + SITE.email;
    if (!$("drawerFootEl")) {
      const _df = document.createElement("div");
      _df.className = "drawerFoot"; _df.id = "drawerFootEl";
      _df.innerHTML = `<a class="headCta" href="mailto:${esc(SITE.email)}">✉ Contact — ${esc(SITE.email)}</a><small>${esc(SITE.location)} • ${esc(SITE.school)}</small>`;
      $("navLinksEl").appendChild(_df);
    } else {
      $("drawerFootEl").querySelector(".headCta").href = "mailto:" + SITE.email;
    }
    if (typeof moveNavInk === "function") requestAnimationFrame(() => moveNavInk(false));
  } catch(_e) {}

  // illustrations — premium filterable gallery
  initIllusGallery();
  $("animMiniEl").innerHTML = SITE.animations.map((a, i) =>
    `<button class="mini${i === 0 ? " on" : ""}" data-i="${i}" type="button"><span class="miniArt"><img src="${a.img}" alt="${esc(a.title)}" loading="lazy"></span><span class="miniInfo"><b>${esc(a.title)}</b><small>${a.tags.map(esc).join(" • ")}</small></span></button>`).join("");
  setFeatAnim(0);

  // stories
  const genres = ["All", ...new Set(SITE.stories.map(s => s.genre))];
  $("storyFilterEl").innerHTML = genres.map((g, i) =>
    `<button class="chip${i === 0 ? " on" : ""}" data-g="${esc(g)}" type="button">${esc(g)}</button>`).join("");
  drawStories("All");
  drawSelPills();

  // design mosaic
  const cats = ["All", ...new Set(SITE.designs.map(d => d.cat))];
  $("designFilterEl").innerHTML = cats.map((c, i) =>
    `<button class="chip${i === 0 ? " on" : ""}" data-c="${esc(c)}" type="button">${esc(c)}</button>`).join("");
  drawDesigns("All");

  // design side minis
  const _d5 = SITE.designs.slice(0, 6), _d5b = SITE.designs.slice(6, 12);
  $("designMiniEl").innerHTML = _d5.map((d, i) =>
    `<button class="mini${i === 0 ? " on" : ""}" data-i="${i}" type="button"><span class="miniArt">${designArt(d, i)}</span><span class="miniInfo"><b>${esc(d.title)}</b><small>${esc(d.cat)}</small></span></button>`).join("");
  $("designMini2El").innerHTML = _d5b.map((d, k) =>
    `<button class="mini" data-i="${k + 6}" type="button"><span class="miniArt">${designArt(d, k + 6)}</span><span class="miniInfo"><b>${esc(d.title)}</b><small>${esc(d.cat)}</small></span></button>`).join("");
  setFeatDesign(0);

  // about
  $("aboutTitleEl").textContent = "Hi! I'm " + SITE.name;
  $("aboutBioEl").innerHTML = SITE.bio.map(p => `<p>${esc(p)}</p>`).join("");
  $("aboutFactsEl").innerHTML = SITE.facts.map(f => `<div><b>${esc(f[0])}:</b> ${esc(f[1])}</div>`).join("");
  $("skillEl").innerHTML = SITE.skills.map(s =>
    `<div class="skillRow"><label><span>${esc(s.n)}</span><span>${s.v}%</span></label>`
    + `<div class="skillBar"><i style="width:${s.v}%"></i></div></div>`).join("");
  $("emailBtnEl").href = "mailto:" + SITE.email;

  // achievements
  $("achStatsEl").innerHTML = SITE.stats.map(s =>
    `<div class="stat"><b>${esc(s.n)}</b><span>${esc(s.t)}</span></div>`).join("");
  $("achPillsEl").innerHTML = SITE.achievements.map((a, i) =>
    `<button class="pill${i === 0 ? " on" : ""}" data-i="${i}" type="button">${esc(a.title)} — ${esc(a.org)}</button>`).join("");
  setFeatAch(0);

  bindCards();
  observeReveals();
}

/* ---------- Illustrations premium gallery ---------- */
const illusGallery = { filter: "All", query: "", sort: "feat", feat: 0, list: [] };
function illusPrimaryTag(a){ return (a.tags && a.tags[0]) || "misc"; }
function illusFilteredIndices(){
  const q = illusGallery.query.trim().toLowerCase();
  let idx = SITE.illustrations.map((a, i) => i).filter(i => {
    const a = SITE.illustrations[i];
    if (illusGallery.filter !== "All" && illusPrimaryTag(a).toLowerCase() !== illusGallery.filter.toLowerCase()) return false;
    if (q){
      const hay = (a.title + " " + (a.desc||"") + " " + (a.body||"") + " " + (a.tags||[]).join(" ")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  if (illusGallery.sort === "az") idx = idx.slice().sort((x, y) => String(SITE.illustrations[x].title).localeCompare(String(SITE.illustrations[y].title)));
  else if (illusGallery.sort === "cat") idx = idx.slice().sort((x, y) =>
    String(illusPrimaryTag(SITE.illustrations[x])).localeCompare(String(illusPrimaryTag(SITE.illustrations[y])))
    || String(SITE.illustrations[x].title).localeCompare(String(SITE.illustrations[y].title)));
  return idx;
}
function initIllusGallery(){
  illusGallery.list = illusFilteredIndices();
  renderIllusFilters();
  renderIllusMinis();
  if (!SITE.illustrations[illusGallery.feat]) illusGallery.feat = 0;
  setFeatIllus(illusGallery.feat, { keepList: true });
  bindIllusToolbarOnce();
  bindIllusViewerOnce();
}
function renderIllusFilters(){
  const box = $("illusFilterEl"); if (!box) return;
  const counts = {};
  SITE.illustrations.forEach(a => { const k = illusPrimaryTag(a); counts[k] = (counts[k]||0)+1; });
  const cats = Object.keys(counts).sort((x,y)=>x.localeCompare(y));
  const total = SITE.illustrations.length;
  box.innerHTML = [`<button class="chip${illusGallery.filter==="All"?" on":""}" data-f="All" type="button" role="tab" aria-selected="${illusGallery.filter==="All"}">All <span class="n">${total}</span></button>`]
    .concat(cats.map(c => `<button class="chip${illusGallery.filter===c?" on":""}" data-f="${esc(c)}" type="button" role="tab" aria-selected="${illusGallery.filter===c}">${esc(c)} <span class="n">${counts[c]}</span></button>`)).join("");
  box.querySelectorAll(".chip").forEach(b => {
    b.onclick = () => {
      illusGallery.filter = b.dataset.f;
      renderIllusFilters();
      renderIllusMinis();
    };
  });
}
function renderIllusMinis(){
  const grid = $("illusMiniEl"); if (!grid) return;
  illusGallery.list = illusFilteredIndices();
  const list = illusGallery.list;
  grid.innerHTML = list.map(i => {
    const a = SITE.illustrations[i];
    return `<div class="mini${i === illusGallery.feat ? " on" : ""}" data-i="${i}" role="button" tabindex="0" aria-label="${esc(a.title)} — click to feature" aria-current="${i === illusGallery.feat ? "true" : "false"}">`
      + `<span class="miniArt">${illusArt(a, i)}<span class="miniFeatBadge">★ Featured</span>`
      + `<span class="miniOverlay"><button class="ovFeat" type="button" data-act="feat">Feature →</button><button class="ovZoom" type="button" data-act="zoom" aria-label="Enlarge ${esc(a.title)}">⤢</button></span></span>`
      + `<span class="miniInfo"><b>${esc(a.title)}</b><small>${a.tags.map(esc).join(" • ")}</small></span></div>`;
  }).join("");
  grid.querySelectorAll("img").forEach(im => {
    im.setAttribute("loading", "lazy");
    if (im.complete) im.removeAttribute("loading");
    else im.addEventListener("load", () => im.removeAttribute("loading"), { once: true });
  });
  grid.querySelectorAll(".mini").forEach(card => {
    const idx = +card.dataset.i;
    const goFeat = (e) => {
      if (e && e.target && e.target.closest && e.target.closest('[data-act="zoom"]')) return;
      setFeatIllus(idx);
      if (window.matchMedia && matchMedia("(max-width:900px)").matches){
        try { $("illusFeatArtEl").scrollIntoView({ behavior: "smooth", block: "center" }); } catch(_e) {}
      }
    };
    card.addEventListener("click", goFeat);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFeatIllus(idx); }
    });
  });
  grid.querySelectorAll('[data-act="zoom"]').forEach(z => {
    z.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = z.closest(".mini");
      openIllusLightbox(+card.dataset.i);
    });
  });
  const empty = $("illusEmptyEl");
  if (empty) empty.hidden = list.length > 0;
  const res = $("illusResultEl");
  if (res){
    if (!list.length) res.innerHTML = `No matches — <b>0</b> of <b>${SITE.illustrations.length}</b>`;
    else if (illusGallery.filter === "All" && !illusGallery.query) res.innerHTML = `Showing <b>${list.length}</b> pieces`;
    else res.innerHTML = `Showing <b>${list.length}</b> of <b>${SITE.illustrations.length}</b>`;
  }
  const side = $("illusSideCount");
  if (side) side.textContent = list.length + (list.length === 1 ? " piece" : " pieces");
}
function bindIllusToolbarOnce(){
  const si = $("illusSearchEl");
  if (si && !si.dataset.bound){
    si.dataset.bound = "1";
    si.addEventListener("input", () => {
      illusGallery.query = si.value || "";
      $("illusSearchWrapEl").classList.toggle("hasText", !!(si.value || "").length);
      renderIllusMinis();
    });
    si.addEventListener("keydown", (e) => { if (e.key === "Escape"){ si.value = ""; illusGallery.query = ""; $("illusSearchWrapEl").classList.remove("hasText"); renderIllusMinis(); } });
  }
  const cb = $("illusClearBtn");
  if (cb && !cb.dataset.bound){
    cb.dataset.bound = "1";
    cb.onclick = () => {
      $("illusSearchEl").value = ""; illusGallery.query = "";
      $("illusSearchWrapEl").classList.remove("hasText");
      renderIllusMinis();
      $("illusSearchEl").focus();
    };
  }
  const so = $("illusSortEl");
  if (so && !so.dataset.bound){
    so.dataset.bound = "1";
    so.onchange = () => { illusGallery.sort = so.value; renderIllusMinis(); };
  }
  const rb = $("illusResetBtn");
  if (rb && !rb.dataset.bound){
    rb.dataset.bound = "1";
    rb.onclick = () => {
      illusGallery.filter = "All"; illusGallery.query = ""; illusGallery.sort = "feat";
      if ($("illusSearchEl")) $("illusSearchEl").value = "";
      if ($("illusSortEl")) $("illusSortEl").value = "feat";
      if ($("illusSearchWrapEl")) $("illusSearchWrapEl").classList.remove("hasText");
      renderIllusFilters(); renderIllusMinis();
    };
  }
}
function bindIllusViewerOnce(){
  const once = (id, fn) => { const el = $(id); if (el && !el.dataset.bound){ el.dataset.bound = "1"; fn(el); } };
  once("illusPrevBtn", el => el.onclick = () => stepIllus(-1));
  once("illusNextBtn", el => el.onclick = () => stepIllus(1));
  once("illusPrevBtn2", el => el.onclick = () => stepIllus(-1));
  once("illusNextBtn2", el => el.onclick = () => stepIllus(1));
  once("illusExpandBtn", el => el.onclick = () => openIllusLightbox(illusGallery.feat));
  once("illusOpenBtn", el => el.onclick = () => openIllusLightbox(illusGallery.feat));
  const stage = $("illusFeatArtEl");
  if (stage && !stage.dataset.bound){
    stage.dataset.bound = "1";
    stage.addEventListener("click", () => openIllusLightbox(illusGallery.feat));
    stage.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " "){ e.preventDefault(); openIllusLightbox(illusGallery.feat); }
      if (e.key === "ArrowLeft"){ e.preventDefault(); stepIllus(-1); }
      if (e.key === "ArrowRight"){ e.preventDefault(); stepIllus(1); }
    });
  }
  if (!document.body.dataset.illusKeys){
    document.body.dataset.illusKeys = "1";
    document.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if ($("viewDialog") && $("viewDialog").open) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
      const sec = document.getElementById("illustrations");
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      e.preventDefault();
      stepIllus(e.key === "ArrowLeft" ? -1 : 1);
    });
    // swipe on the stage (mobile)
    const st = () => $("illusFeatArtEl");
    let sx = null;
    document.addEventListener("pointerdown", (e) => {
      const s = st(); if (s && s.contains(e.target)) sx = e.clientX;
    }, { passive: true });
    document.addEventListener("pointerup", (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 48) stepIllus(dx < 0 ? 1 : -1);
    }, { passive: true });
  }
}
function stepIllus(dir){
  const list = illusGallery.list && illusGallery.list.length ? illusGallery.list : SITE.illustrations.map((_, i) => i);
  if (!list.length) return;
  let pos = list.indexOf(illusGallery.feat);
  if (pos === -1) pos = dir > 0 ? -1 : 0;
  const next = list[(pos + dir + list.length) % list.length];
  setFeatIllus(next);
}
function openIllusLightbox(i){
  const a = SITE.illustrations[i]; if (!a) return;
  illusGallery.feat = i;
  openView(a.title, `<div style="border-radius:12px;overflow:hidden;border:1px solid #e1e7f8;background:#0a1030">${illusArt(a, i)}</div>`
    + `<p style="margin:14px 0 4px"><span style="display:inline-flex;gap:6px;flex-wrap:wrap">${a.tags.map(t => `<span style="display:inline-block;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;background:var(--navy);color:var(--gold);padding:5px 11px;border-radius:100px">${esc(t)}</span>`).join("")}</span></p>`
    + `<p style="margin:8px 0 0;font-weight:700">${esc(a.desc||"")}</p>`
    + (a.body ? `<p style="margin:6px 0 0;color:var(--muted)">${esc(a.body)}</p>` : ``));
}
function setFeatIllus(i, opts){
  const a = SITE.illustrations[i]; if (!a) return;
  illusGallery.feat = i;
  document.querySelectorAll("#illusMiniEl .mini").forEach(b => {
    const on = +b.dataset.i === i;
    b.classList.toggle("on", on);
    b.setAttribute("aria-current", on ? "true" : "false");
  });
  const stage = $("illusFeatArtEl");
  if (stage){
    stage.style.opacity = "0";
    requestAnimationFrame(() => {
      stage.innerHTML = illusArt(a, i);
      stage.style.transition = "opacity .22s ease";
      requestAnimationFrame(() => { stage.style.opacity = "1"; });
    });
  } else {
    $("illusFeatArtEl").innerHTML = illusArt(a, i);
  }
  const total = SITE.illustrations.length;
  const _fm = $("illusFeatMetaEl"); if (_fm) _fm.textContent = "Illustration " + String(i+1).padStart(2,"0") + " / " + String(total).padStart(2,"0") + " • " + (a.tags[0]||"featured");
  $("illusFeatTitleEl").textContent = a.title;
  $("illusFeatDescEl").textContent = a.desc;
  $("illusFeatBodyEl").textContent = a.body || "";
  $("illusFeatTagsEl").innerHTML = a.tags.map(t => `<i>${esc(t)}</i>`).join("");
  const cc = $("illusCountEl"); if (cc) cc.textContent = String(i+1).padStart(2,"0") + " / " + String(total).padStart(2,"0");
  const pr = $("illusProgEl"); if (pr) pr.style.width = ((i+1)/Math.max(1,total)*100) + "%";
  if (!opts || !opts.silent) {
    try {
      const card = document.querySelector(`#illusMiniEl .mini[data-i="${i}"]`);
      if (card && illusGallery.filter !== "All") { /* keep scroll position when filtered */ }
    } catch(_e) {}
  }
}

function setFeatAnim(i){
  const a = SITE.animations[i]; if (!a) return;
  document.querySelectorAll("#animMiniEl .mini").forEach(b =>
    b.classList.toggle("on", +b.dataset.i === i));
  $("animFeatArtEl").innerHTML = `<img src="${a.img}" alt="${esc(a.title)}" title="Click to replay">`;
  $("animFeatArtEl").onclick = () => { const im = $("animFeatArtEl").querySelector("img"); const s = im.src; im.src = ""; im.src = s; };
  const _fm = $("animFeatMetaEl"); if (_fm) _fm.textContent = "Animation " + String(i+1).padStart(2,"0") + " • " + (a.tags[0]||"featured");
  $("animFeatTitleEl").textContent = a.title;
  $("animFeatDescEl").textContent = a.desc;
  $("animFeatBodyEl").textContent = a.body || "";
  $("animFeatTagsEl").innerHTML = a.tags.map(t => `<i>${esc(t)}</i>`).join("");
}

let selStoryIdx = 0;
let selChapIdx = 0;
const chapCache = {};
const portfolioTitle = document.title;
function storySlug(story){
  return story.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function storyUrl(i, reading, itemIndex){
  const story = SITE.stories[i];
  const path = "/books/" + storySlug(story) + (reading ? "/read" : "");
  const url = new URL(path, location.origin);
  if (reading){
    const key = story.pageDir && story.pageCount ? "page" : "chapter";
    url.searchParams.set(key, String((itemIndex || 0) + 1));
  }
  return url.pathname + url.search;
}
function setStoryRoute(i, reading, itemIndex, mode){
  const story = SITE.stories[i];
  const slug = storySlug(story);
  const url = storyUrl(i, reading, itemIndex);
  const previous = history.state;
  const state = reading
    ? { portfolioRoute: "reader", bookSlug: slug, fromBook: mode === "push"
        ? (previous?.portfolioRoute === "book" && previous.bookSlug === slug)
          || location.pathname === "/books/" + slug
          || location.pathname === "/books/" + slug + "/"
        : !!previous?.fromBook }
    : { portfolioRoute: "book", bookSlug: slug, fromPortfolio: mode === "push"
        ? true
        : !!previous?.fromPortfolio };
  if (mode === "push") history.pushState(state, "", url);
  else if (mode === "replace") history.replaceState(state, "", url);
  document.title = reading ? (story.title + " — Read") : (story.title + " — Book");
}
async function loadChapter(s, i){
  const box = $("selBodyEl"); if (!box) return;
  try {
    let txt = chapCache[s.file];
    if (!txt){ const r = await fetch(s.file); if (!r.ok) throw new Error("Chapter request failed: " + r.status); txt = await r.text(); chapCache[s.file] = txt; }
    if (selChapIdx !== i) return;
    const parts = txt.split(/\n\n+/).filter(Boolean);
    const head = parts.length && /^Chapter \d+:/i.test(parts[0]) ? parts.shift() : null;
    box.querySelector(".chapLoad")?.remove();
    const h = document.createElement("h4"); h.className = "chapHead"; h.textContent = head || s.title; box.appendChild(h);
    for (const p of parts){ const el = document.createElement("p"); el.textContent = p; box.appendChild(el); }
  } catch(e){ const l = box.querySelector(".chapLoad"); if (l) l.textContent = "Could not load chapter text."; }
}
function showBook(i){
  if (!SITE.stories[i]) return;
  $("readerViewEl").hidden = true;
  renderBook(i == null ? selStoryIdx : i);
  $("bookViewEl").hidden = false;
  syncBodyLock();
  $("bookViewEl").querySelector(".bookPageBody").scrollTop = 0;
}
function openBook(i){
  if (!SITE.stories[i]) return;
  showBook(i);
  setStoryRoute(i, false, 0, "push");
}
function closeBook(){
  const route = history.state;
  if (route?.portfolioRoute === "book" && route.fromPortfolio){
    history.back();
    return;
  }
  history.replaceState(null, "", "/#stories");
  document.title = portfolioTitle;
  $("bookViewEl").hidden = true;
  $("readerViewEl").hidden = true;
  syncBodyLock();
  requestAnimationFrame(() => $("stories").scrollIntoView({ block: "start" }));
}
function renderBook(i){
  const s = SITE.stories[i]; if (!s) return;
  if (selStoryIdx !== i) selChapIdx = 0; // fresh book => start from chapter 1, not wherever the last book left off
  selStoryIdx = i;
  $("bookPageTitleEl").textContent = s.title;
  $("bookPageSubEl").textContent = s.tagline || "";
  $("bookBackdropImg").src = s.backdrop || s.img || "";
  document.querySelectorAll("#storyGridEl .storyRow").forEach(b =>
    b.classList.toggle("on", +b.dataset.i === i));
  const chs = s.chapters || [];
  const _coverArt = s.img ? `<div class="coverArt" id="bookCoverArtEl" title="Click to enlarge cover" role="button" tabindex="0"><img src="${s.img}" alt="${esc(s.title)} — full book cover" loading="eager"></div>` : "";
  $("selCoverEl").innerHTML = `<div class="big">${i + 1}</div>${_coverArt}<span class="coverKicker">${esc(s.coverKicker || s.tagline || s.genre)}</span><h3>${esc(s.title)}</h3>`
    + `<p><b style="color:#fff">${esc(s.tagline || s.genre)} • ${esc(s.time)} • ${esc(s.year)}</b></p><p><i>${esc(s.excerpt)}</i></p>`
    + `<span class="year">${esc(s.genre)} • ${esc(s.year)} • Featured</span>`;
  const _bca = $("bookCoverArtEl");
  if (_bca) {
    const _zoom = () => openView(s.title, `<div style="border-radius:12px;overflow:hidden;border:1px solid #e1e7f8;background:#0a1030"><img src="${s.img}" alt="${esc(s.title)} — full book cover" style="width:100%;height:auto;max-height:70vh;object-fit:contain;display:block;background:#0a1030"></div><p style="margin:12px 0 0"><b>${esc(s.tagline || s.genre)}</b> • ${esc(s.time)} • ${esc(s.year)}</p><p style="margin:6px 0 0;color:var(--muted)">${esc(s.excerpt)}</p>`);
    _bca.onclick = _zoom;
    _bca.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); _zoom(); } };
  }
  $("bookInfoEl").innerHTML = `<h3>${esc(s.title)}</h3>`
    + `<div class="bookMeta"><span>${esc(s.genre)}</span><span>${s.pdf ? "Picture book" : chs.length + " chapters"}</span><span>${esc(s.time)}</span><span>${esc(s.year)}</span></div>`
    + (s.fullDesc ? s.fullDesc.split(/\n\n+/).map(p => `<p><i>${esc(p.trim())}</i></p>`).join("") : `<p><i>${esc(s.excerpt)}</i></p>`)
    + (s.pdf
      ? `<p>Read it page by page — full illustrations, just like the printed edition.</p>`
        + `<div class="readRow"><button class="readBtn" id="startReadBtn" type="button">Read the book →</button></div>`
      : `<p>${chs.length} chapters — open one below to read it on its own page.</p>`
        + `<div class="readRow"><button class="readBtn" id="startReadBtn" type="button">${selChapIdx > 0 ? "Continue — Chapter " + chs[selChapIdx].n : "Start reading →"}</button></div>`);
  const _sb = $("startReadBtn");
  if (_sb && !s.pdf) _sb.textContent = selChapIdx > 0 && selChapIdx < chs.length ? "Continue — Chapter " + chs[selChapIdx].n : "Start reading →";
  if (_sb) _sb.onclick = () => openReader(selChapIdx);
  const _selList = $("bookPillsEl").closest(".selList");
  if (_selList) _selList.hidden = !!s.pdf;
  const _cast0 = s.cast || (i === 0 ? SITE.cast : []) || [];
  const _cw = $("bookCastWrapEl");
  if (_cw) _cw.hidden = !_cast0.length;
  drawSelPills();
}
let readerToken = 0;
async function openReader(ci, historyMode, picturePage){
  historyMode = historyMode || "push";
  const st0 = SITE.stories[selStoryIdx] || {};
  if (st0.pageDir && st0.pageCount){
    readerToken++;
    const total = st0.pageCount;
    let pg = Math.max(0, Math.min(total - 1, picturePage == null ? (ci || 0) : picturePage));
    selChapIdx = 0;
    if (historyMode !== "none") setStoryRoute(selStoryIdx, true, pg, historyMode);
    const pad = n => String(n).padStart(2, "0");
    const showPage = () => {
      const last = Math.min(pg + 1, total - 1);
      $("readerBookEl").textContent = st0.title;
      $("readerChapEl").textContent = (st0.tagline || "Picture book") + (pg === last
        ? " — Page " + (pg + 1) + " of " + total
        : " — Pages " + (pg + 1) + "–" + (last + 1) + " of " + total);
      $("readerPrevBtn").disabled = pg <= 0;
      $("readerNextBtn").disabled = pg + 2 >= total;
      const imgTag = p => `<img src="${st0.pageDir}/p${pad(p + 1)}.jpg" alt="Page ${p + 1} of ${esc(st0.title)}" style="width:100%;height:auto;display:block;border-radius:10px;box-shadow:0 10px 28px rgba(12,27,77,.25)" loading="eager">`;
      $("readerBodyEl").innerHTML = `<div class="readerPaper" style="max-width:1020px;padding:16px;text-align:center">`
        + (pg === last ? imgTag(pg) : `<div class="spreadGrid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${imgTag(pg)}${imgTag(last)}</div>`)
        + `<div class="chapNav"><button class="btn ghost" type="button" id="picPrevBtn"${pg<=0?" disabled":""}>← Prev pages</button>`
        + `<span style="align-self:center;font-weight:800">${pg === last ? "Page " + (pg + 1) : "Pages " + (pg + 1) + "–" + (last + 1)} / ${total}</span>`
        + `<button class="btn ghost" type="button" id="picNextBtn"${pg+2>=total?" disabled":""}>Next pages →</button></div></div>`;
      $("readerBodyEl").scrollTop = 0;
      const _pp = $("picPrevBtn"), _pn = $("picNextBtn");
      if (_pp && pg > 0) _pp.onclick = () => { pg = Math.max(0, pg - 2); setStoryRoute(selStoryIdx, true, pg, "replace"); showPage(); };
      if (_pn && pg + 2 < total) _pn.onclick = () => { pg = pg + 2; setStoryRoute(selStoryIdx, true, pg, "replace"); showPage(); };
    };
    $("readerPrevBtn").onclick = () => { if (pg > 0){ pg = Math.max(0, pg - 2); setStoryRoute(selStoryIdx, true, pg, "replace"); showPage(); } };
    $("readerNextBtn").onclick = () => { if (pg + 2 < total){ pg = pg + 2; setStoryRoute(selStoryIdx, true, pg, "replace"); showPage(); } };
    showPage();
    $("bookViewEl").hidden = true;
    $("readerViewEl").hidden = false;
    syncBodyLock();
    return;
  }
  if (st0.pdf){
    selChapIdx = 0;
    readerToken++;
    if (historyMode !== "none") setStoryRoute(selStoryIdx, true, 0, historyMode);
    $("readerBookEl").textContent = st0.title;
    $("readerChapEl").textContent = st0.tagline || "Picture book — flip through the pages";
    $("readerPrevBtn").disabled = true;
    $("readerNextBtn").disabled = true;
    $("readerBodyEl").innerHTML = `<div class="readerPaper" style="max-width:780px;padding:16px">`
      + `<embed src="${st0.pdf}" type="application/pdf" style="width:100%;height:72vh;border:0;border-radius:8px;display:block">`
      + `<div class="readerEnd">— THE END —</div></div>`;
    $("readerBodyEl").scrollTop = 0;
    $("bookViewEl").hidden = true;
    $("readerViewEl").hidden = false;
    syncBodyLock();
    return;
  }
  const chs = (SITE.stories[selStoryIdx]||{}).chapters || []; if (!chs.length) return;
  $("readerPrevBtn").onclick = () => openReader(selChapIdx - 1, "replace");
  $("readerNextBtn").onclick = () => openReader(selChapIdx + 1, "replace");
  selChapIdx = Math.max(0, Math.min(chs.length - 1, ci));
  if (historyMode !== "none") setStoryRoute(selStoryIdx, true, selChapIdx, historyMode);
  const c = chs[selChapIdx];
  const t = ++readerToken;
  document.querySelectorAll("#bookPillsEl .pill").forEach(b =>
    b.classList.toggle("on", +b.dataset.i === selChapIdx));
  const s = SITE.stories[selStoryIdx];
  $("readerBookEl").textContent = s ? s.title : "";
  $("readerChapEl").textContent = "Chapter " + c.n + " — " + c.title;
  $("readerPrevBtn").disabled = selChapIdx <= 0;
  $("readerNextBtn").disabled = selChapIdx >= chs.length - 1;
  $("readerBodyEl").innerHTML = `<div class="readerPaper"><h2>Chapter ${c.n}: ${esc(c.title)}</h2><div class="rMeta">${esc(c.time)}</div><div class="chapLoad"><span class="spin"></span> Loading chapter…</div></div>`;
  $("readerBodyEl").scrollTop = 0;
  $("bookViewEl").hidden = true;
  $("readerViewEl").hidden = false;
  syncBodyLock();
  try {
    let txt = chapCache[c.file];
    if (!txt){ const r = await fetch(c.file); if (!r.ok) throw new Error("Chapter request failed: " + r.status); txt = await r.text(); chapCache[c.file] = txt; }
    if (t !== readerToken) return;
    const parts = txt.split(/\n\n+/).filter(Boolean);
    if (parts.length && /^Chapter \d+:/i.test(parts[0])) parts.shift();
    let h = `<h2>Chapter ${c.n}: ${esc(c.title)}</h2><div class="rMeta">${esc(c.time)}</div>`;
    h += parts.map(p => `<p>${esc(p)}</p>`).join("");
    h += `<div class="readerEnd">— END OF CHAPTER ${c.n} —</div>`
      + `<div class="readerFootNav"><button class="btn ghost" type="button" ${selChapIdx<=0?"disabled":""} id="rPrevB">← Prev chapter</button><button class="btn ghost" type="button" ${selChapIdx>=chs.length-1?"disabled":""} id="rNextB">Next chapter →</button></div>`;
    $("readerBodyEl").innerHTML = '<div class="readerPaper">' + h + '</div>';
    const _pb = $("rPrevB"), _nb = $("rNextB");
    if (_pb && selChapIdx > 0) _pb.onclick = () => openReader(selChapIdx - 1, "replace");
    if (_nb && selChapIdx < chs.length - 1) _nb.onclick = () => openReader(selChapIdx + 1, "replace");
    $("readerBodyEl").scrollTop = 0;
  } catch(e){
    if (t !== readerToken) return;
    $("readerBodyEl").innerHTML = '<div class="readerPaper"><h2>Chapter ' + c.n + '</h2><p>Could not load chapter text.</p></div>';
  }
}
function closeReader(){
  const route = history.state;
  if (route?.portfolioRoute === "reader" && route.fromBook){
    history.back();
    return;
  }
  readerToken++;
  $("readerViewEl").hidden = true;
  if (SITE.stories[selStoryIdx]){
    history.replaceState(null, "", storyUrl(selStoryIdx, false, 0));
    document.title = SITE.stories[selStoryIdx].title + " — Book";
  }
  $("bookViewEl").hidden = false;
  syncBodyLock();
}
function syncStoryRoute(){
  const match = location.pathname.match(/^\/books\/([^/]+)(\/read)?\/?$/);
  if (!match){
    readerToken++;
    $("readerViewEl").hidden = true;
    $("bookViewEl").hidden = true;
    document.title = portfolioTitle;
    syncBodyLock();
    return;
  }
  const slug = match[1];
  const storyIndex = SITE.stories.findIndex(story => storySlug(story) === slug);
  if (storyIndex < 0){
    history.replaceState(null, "", "/#stories");
    document.title = portfolioTitle;
    $("readerViewEl").hidden = true;
    $("bookViewEl").hidden = true;
    syncBodyLock();
    requestAnimationFrame(() => $("stories").scrollIntoView({ block: "start" }));
    return;
  }
  selStoryIdx = storyIndex;
  document.title = SITE.stories[storyIndex].title + (match[2] ? " — Read" : " — Book");
  showBook(storyIndex);
  if (!match[2]) return;

  const story = SITE.stories[storyIndex];
  const key = story.pageDir && story.pageCount ? "page" : "chapter";
  const requestedIndex = Math.max(0, (Number(new URLSearchParams(location.search).get(key)) || 1) - 1);
  openReader(requestedIndex, "none", key === "page" ? requestedIndex : undefined);
}
window.addEventListener("popstate", syncStoryRoute);
function drawSelPills(){
  $("bookPillsEl").innerHTML = ((SITE.stories[selStoryIdx]||{}).chapters||[]).map((c, i) =>
    `<button class="pill${i === selChapIdx ? " on" : ""}" data-i="${i}" type="button">Ch ${c.n} — ${esc(c.title)}</button>`).join("");
  drawCast();
  if (typeof bindCards === "function") bindCards();
}

function drawStories(filter){
  const list = SITE.stories.map((s, i) => ({...s, i})).filter(s => filter === "All" || s.genre === filter);
  $("storyGridEl").innerHTML = list.map(s =>
    `<button class="storyRow reveal in${s.i === selStoryIdx ? " on" : ""}" data-kind="story" data-i="${s.i}">`
    + `<span class="storyThumb">${s.img ? `<img src="${s.img}" alt="${esc(s.title)} cover" loading="lazy">` : `<span class="tLetter">${esc(s.title[0])}</span>`}<span class="tGenre">${esc(s.genre)}</span></span>`
    + `<span class="storyBody"><span class="storyTitle">${esc(s.title)}</span>`
    + `<span class="storyEx">${esc(s.excerpt)}</span>`
    + `<span class="storyMeta">${esc(s.genre)}<span class="dot"></span>${esc(s.time)}<span class="dot"></span>${esc(s.year)}<span class="dot"></span>Read ↓</span></span>`
    + `</button>`).join("") || `<p style="color:var(--muted)">No books in this filter yet.</p>`;
  if (!list.some(s => s.i === selStoryIdx) && list.length) renderBook(list[0].i);
  else renderBook(selStoryIdx);
  bindCards();
}

function drawDesigns(filter){
  const list = SITE.designs.map((d, i) => ({...d, i})).filter(d => filter === "All" || d.cat === filter);
  $("mosaicEl").innerHTML = list.map((d, k) =>
    `<button class="tile${k % 5 === 0 ? " wide" : ""}${k % 7 === 3 ? " tall" : ""}" data-kind="design" data-i="${d.i}" aria-label="${esc(d.title)}">`
    + `<span class="tileArt">${designArt(d, d.i)}<span class="tileBadge">${esc(d.cat)}</span><span class="tileZoom"><span>⤢ Preview</span></span></span>`
    + `<span class="tileCap"><span>${esc(d.title)}</span><span>${esc(d.cat)}</span></span>`
    + `</button>`).join("") || `<p style="color:#fff">No works in this category yet.</p>`;
  bindCards();
}

function setFeatDesign(i){
  const d = SITE.designs[i]; if (!d) return;
  document.querySelectorAll("#designMiniEl .mini, #designMini2El .mini").forEach(b =>
    b.classList.toggle("on", +b.dataset.i === i));
  $("designFeatArtEl").innerHTML = designArt(d, i);
  const _dm = $("designFeatMetaEl"); if (_dm) _dm.textContent = d.cat + " • Piece " + String(i+1).padStart(2,"0");
  $("designFeatTitleEl").textContent = d.title + " — " + d.cat;
  $("designFeatDescEl").textContent = d.desc;
}

function setFeatAch(i){
  const a = SITE.achievements[i]; if (!a) return;
  document.querySelectorAll("#achPillsEl .pill").forEach(b =>
    b.classList.toggle("on", +b.dataset.i === i));
  const imgHtml = a.img
    ? `<button class="achImgBtn" data-zoom="${a.img}" type="button" aria-label="Enlarge certificate — ${esc(a.title)}"><img src="${a.img}" alt="Certificate — ${esc(a.title)}" loading="lazy"></button><span class="achZoomHint">Click certificate to enlarge ⤢</span>`
    : `<div class="big">${a.icon || "🏆"}</div>`;
  $("achFeatEl").innerHTML = `${imgHtml}<h3>${esc(a.title)}</h3>`
    + `<p><b>${esc(a.org)}</b></p><p>${esc(a.text)}</p><span class="year">Verified • ${esc(a.org)}</span>`;
  const zb = $("achFeatEl").querySelector("[data-zoom]");
  if (zb) zb.onclick = () => openView(a.title, `<div style="border-radius:12px;overflow:hidden;border:1px solid #e1e7f8"><img src="${a.img}" alt="${esc(a.title)}" style="width:100%;display:block"></div><p style="margin:12px 0 0"><b>${esc(a.org)}</b></p><p>${esc(a.text)}</p>`);
}

function drawCast(){
  const _cast = (SITE.stories[selStoryIdx]||{}).cast || (selStoryIdx === 0 ? SITE.cast : []) || [];
  ["bookCastGridEl"].forEach(gid => {
    const g = $(gid); if (!g) return;
    g.innerHTML = _cast.map((c, i) =>
      `<button class="castCard" data-i="${i}" type="button"><img src="${c.img}" alt="${esc(c.name)}" loading="lazy"><b>${esc(c.name)}</b><small>${esc(c.role)}</small></button>`).join("");
    g.querySelectorAll(".castCard").forEach(b => {
      b.onclick = () => {
        const c = _cast[+b.dataset.i];
        openView(c.name, `<div style="border-radius:12px;overflow:hidden;border:1px solid #e1e7f8"><img src="${c.img}" alt="${esc(c.name)}" style="width:100%;display:block"></div><p style="margin:12px 0 0"><b>${esc(c.role)}</b></p>`);
      };
    });
  });
}

/* ---------- modal ---------- */
function openView(title, html){
  $("viewTitleEl").textContent = title;
  $("viewBodyEl").innerHTML = html;
  $("viewDialog").showModal();
  enableModalZoom();
}
/* Zoomable image in modal: click / wheel to zoom, drag to pan, buttons */
function enableModalZoom(){
  const body = $("viewBodyEl");
  if (!body) return;
  const img = body.querySelector("img");
  if (!img) return;
  img.draggable = false;
  let wrap = img.closest(".zoomWrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "zoomWrap";
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
  }
  let bar = body.querySelector(".zoomBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.className = "zoomBar";
    bar.innerHTML = `<button type="button" data-z="in">＋ Zoom in</button><button type="button" data-z="out">− Zoom out</button><button type="button" data-z="reset">Reset</button><span>Tip: click or scroll to zoom, drag to pan</span>`;
    wrap.after(bar);
  }
  let scale = 1, tx = 0, ty = 0;
  const MIN = 1, MAX = 4;
  const apply = () => {
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    wrap.classList.toggle("zoomed", scale > 1);
  };
  const setScale = (ns, cx, cy) => {
    ns = Math.max(MIN, Math.min(MAX, ns));
    if (cx != null && !(cx === 0 && cy === 0) && wrap.getBoundingClientRect) {
      const r = wrap.getBoundingClientRect();
      const ox = cx - r.left - r.width / 2, oy = cy - r.top - r.height / 2;
      const k = ns / scale;
      tx = tx * k + ox * (1 - k);
      ty = ty * k + oy * (1 - k);
    }
    if (ns === 1) { tx = 0; ty = 0; }
    scale = ns;
    apply();
  };
  bar.querySelectorAll("button").forEach(b => {
    b.onclick = (e) => {
      e.stopPropagation();
      const m = b.dataset.z;
      if (m === "in") setScale(scale * 1.4);
      else if (m === "out") setScale(scale / 1.4);
      else setScale(1);
    };
  });
  let downX = 0, downY = 0, startTx = 0, startTy = 0, dragging = false, moved = 0;
  img.onclick = (e) => {
    if (moved > 6) { moved = 0; return; }
    moved = 0;
    if (scale === 1) setScale(2, e.clientX, e.clientY);
    else setScale(1);
  };
  img.onwheel = (e) => {
    e.preventDefault();
    const dir = e.deltaY < 0 ? 1 : -1;
    setScale(scale * (dir > 0 ? 1.2 : 1 / 1.2), e.clientX, e.clientY);
  };
  wrap.onpointerdown = (e) => {
    if (scale <= 1) return;
    dragging = true; moved = 0;
    downX = e.clientX; downY = e.clientY; startTx = tx; startTy = ty;
    wrap.classList.add("panning");
    try { wrap.setPointerCapture(e.pointerId); } catch(_e) {}
  };
  wrap.onpointermove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - downX, dy = e.clientY - downY;
    moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
    tx = startTx + dx; ty = startTy + dy;
    apply();
  };
  const endDrag = () => { dragging = false; wrap.classList.remove("panning"); };
  wrap.onpointerup = endDrag;
  wrap.onpointercancel = endDrag;
  apply();
}
function bindCards(){
  document.querySelectorAll('[data-kind]').forEach(el => {
    el.onclick = () => {
      const i = +el.dataset.i, k = el.dataset.kind;
      if (k === "story"){
        openBook(i);
      }
      if (k === "design"){
        const d = SITE.designs[i];
        openView(d.title, `<div style="border-radius:12px;overflow:hidden;border:1px solid #e1e7f8">${designArt(d, i)}</div>`
          + `<p style="margin:14px 0 4px"><span style="display:inline-block;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;background:var(--navy);color:var(--gold);padding:5px 11px;border-radius:100px">${esc(d.cat)}</span></p><p style="margin:6px 0 0">${esc(d.desc)}</p>`);
      }
    };
  });
  // illustrations gallery owns its own click/zoom handlers (renderIllusMinis) — skip here to avoid clobbering them.
  document.querySelectorAll("#animMiniEl .mini").forEach(b => {
    b.onclick = () => setFeatAnim(+b.dataset.i);
  });
  document.querySelectorAll("#bookPillsEl .pill").forEach(b => {
    b.onclick = () => openReader(+b.dataset.i);
  });
  $("readerBackBtn").onclick = closeReader;
  $("readerPrevBtn").onclick = () => openReader(selChapIdx - 1);
  $("readerNextBtn").onclick = () => openReader(selChapIdx + 1);
  $("bookBackBtn").onclick = closeBook;
  $("bookReadBtn").onclick = () => openReader(selChapIdx);
  document.querySelectorAll("#designMiniEl .mini, #designMini2El .mini").forEach(b => {
    b.onclick = () => setFeatDesign(+b.dataset.i);
  });
  document.querySelectorAll("#achPillsEl .pill").forEach(b => {
    b.onclick = () => setFeatAch(+b.dataset.i);
  });
}

/* ---- home upgrade: explore cards, count-up, tilt ---- */
function renderHomeUpgrade(){
  try {
    var tools = [];
    (SITE.facts || []).forEach(function(f){ if (/tool/i.test(f[0])) tools = String(f[1]).split(/,/).map(function(s){return s.trim()}).filter(Boolean); });
    if (!tools.length) tools = ["Adobe Photoshop", "Adobe InDesign", "Python"];
    var ht = document.getElementById("heroToolsEl");
    if (ht) ht.innerHTML = "<span>Made with</span>" + tools.slice(0,4).map(function(t){ return "<i>" + esc(t) + "</i>"; }).join("");
    var pr = document.getElementById("profileRoleEl");
    if (pr) pr.textContent = SITE.tagline || "";
    var av = document.getElementById("availEl");
    if (av) av.textContent = "Open for collabs • " + (SITE.location || "Philippines");
    var pf = document.getElementById("profileFactsEl");
    if (pf) pf.innerHTML =
      "<div><small>Based in</small><strong>" + esc(SITE.location || "") + "</strong></div>"
      + "<div><small>School</small><strong>" + esc(SITE.school || "") + "</strong></div>";
    var fw = document.getElementById("fbWorksEl");
    if (fw) fw.textContent = (SITE.illustrations ? SITE.illustrations.length : 0) + "+";
    var fb = document.getElementById("fbBooksEl");
    if (fb) fb.textContent = (SITE.stories ? SITE.stories.length : 0);
    var illus0 = (SITE.illustrations && SITE.illustrations[0]) || {};
    var des0 = (SITE.designs && SITE.designs[0]) || {};
    var anim0 = (SITE.animations && SITE.animations[0]) || {};
    var story0 = (SITE.stories && SITE.stories[0]) || {};
    var cards = [
      { href:"#illustrations", kick:"01 — Illustrations", title:"Illustrations", sub:(SITE.illustrations||[]).length + " pieces — covers, fanart & studies", img: illus0.img || "", count:(SITE.illustrations||[]).length + " works" },
      { href:"#stories", kick:"02 — Stories", title:"Stories & novels", sub:(SITE.stories||[]).length + " books — open one to read chapters", img: story0.img || "", count:(SITE.stories||[]).length + " books" },
      { href:"#design", kick:"03 — Graphic design", title:"Graphic design", sub:(SITE.designs||[]).length + " posters & layouts — click to preview", img: des0.img || "", count:(SITE.designs||[]).length + " pieces" },
      { href:"#animation", kick:"04 — Animation", title:"Animation", sub:(SITE.animations||[]).length + " loop" + ((SITE.animations||[]).length===1?"":"s") + " — click the feature to replay", img: anim0.img || "", count:(SITE.animations||[]).length + " clips" }
    ];
    var pg = document.getElementById("pickGridEl");
    if (pg) pg.innerHTML = cards.map(function(c){
      return '<a class="pickCard reveal in" href="' + c.href + '">'
        + '<span class="pickArt">' + (c.img ? '<img src="' + c.img + '" alt="" loading="lazy">' : "") + "</span>"
        + '<span class="pickCount">' + esc(c.count) + "</span>"
        + '<span class="pickArrow">↗</span>'
        + '<span class="pickLabel"><small>' + esc(c.kick) + "</small><b>" + esc(c.title) + "</b><span>" + esc(c.sub) + "</span></span>"
        + "</a>";
    }).join("");
  } catch(_e) {}
  // count-up hero stats
  try {
    var stats = document.querySelectorAll("#heroStatsEl .stat b");
    stats.forEach(function(b){
      var raw = b.textContent.trim();
      var m = raw.match(/(\d+)/);
      if (!m) return;
      var target = parseInt(m[1], 10);
      var suffix = raw.slice(m.index + m[1].length);
      if (b.dataset.counted) return;
      b.dataset.counted = "1";
      var t0 = null, dur = 900;
      function step(t){
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        b.textContent = Math.round(target * e) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { b.textContent = target + suffix; return; }
      var io2 = new IntersectionObserver(function(es){
        es.forEach(function(en){ if (en.isIntersecting){ requestAnimationFrame(step); io2.disconnect(); } });
      }, { threshold:.4 });
      io2.observe(b);
    });
  } catch(_e2) {}
  // subtle tilt on profile card (desktop, fine pointers only)
  try {
    var card = document.getElementById("profileCardEl");
    if (card && window.matchMedia && matchMedia("(pointer: fine)").matches
        && !(window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      var raf = null;
      card.addEventListener("mousemove", function(e){
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5;
        var y = (e.clientY - r.top) / r.height - .5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function(){
          card.style.transform = "perspective(900px) rotateY(" + (x*7).toFixed(2) + "deg) rotateX(" + (-y*7).toFixed(2) + "deg)";
        });
      });
      card.addEventListener("mouseleave", function(){
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
      });
    }
  } catch(_e3) {}
}

/* In-page anchor guard: cancel any stuck/in-flight smooth scroll BEFORE the new
   navigation starts. Overlapping smooth scrolls (fast double-clicks, retargets
   mid-flight) can wedge Chrome's smooth-scroll animator — after that every
   smooth navigation silently goes nowhere until reload. An instant same-position
   scroll always executes and clears the animator, so the native smooth
   fragment scroll that follows starts clean. Capturing phase so it runs before
   the engine's own anchor handling. */
document.addEventListener("click", e => {
  const a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
  if (!a) return;
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const href = a.getAttribute("href") || "";
  if (href.length < 2) return;
  const t = document.getElementById(href.slice(1));
  if (!t) return;
  // Already-there? Swallow the click as a true no-op. Without this, clicking
  // the current section's link triggers a pointless ~44px scroll-margin nudge
  // plus header expand/collapse churn right where you're already looking
  // (worst on Home: y=0 -> snap y=44 toggles .scrolled mid-"flight" = jitter).
  try {
    const m = parseFloat(getComputedStyle(t).scrollMarginTop) || 0;
    const snap = t.getBoundingClientRect().top + window.scrollY - m;
    if (Math.abs(snap - window.scrollY) <= m + 12) {
      if (typeof closeNav === "function") closeNav();
      if (location.hash !== href) history.replaceState(null, "", href);
      if (typeof setActive === "function") setActive(href.slice(1), true);
      e.preventDefault(); e.stopPropagation();
      return;
    }
  } catch(_e) {}
  // Lock the spy to the destination + jump the pill there instantly: every
  // intermediate section crossed mid-flight would otherwise flip .active and
  // send the pill zipping across the bar (header jitter on long trips).
  // Released on arrival (see onPageScroll), manual takeover, or timeout.
  try {
    navTarget = href.slice(1);
    if (typeof setActive === "function") setActive(navTarget, true);
    clearTimeout(window.__navLockT);
    window.__navLockT = setTimeout(() => { navTarget = null; }, 6000);
  } catch(_eL) {}
  try { window.scrollTo({top: window.scrollY, left: window.scrollX, behavior: "instant"}); }
  catch(_e) { try { window.scrollTo(window.scrollX, window.scrollY); } catch(_e2) {} }
  // Tier 2 (fallback): if the smooth navigation never starts (wedged animator —
  // no scroll at all within ~900ms while the target is far), jump instantly so
  // the link ALWAYS arrives. Cancelled/replaced by the next anchor click.
  try {
    clearTimeout(window.__anchorFallbackT);
    const y0 = window.scrollY;
    window.__anchorFallbackT = setTimeout(() => {
      try {
        const r = t.getBoundingClientRect();
        if (Math.abs(window.scrollY - y0) < 4 && Math.abs(r.top) > 120) {
          t.scrollIntoView({behavior: "instant", block: "start"});
        }
      } catch(_e3) {}
    }, 900);
  } catch(_e4) {}
}, true);
/* ---------- filters / nav / misc ---------- */
$("storyFilterEl").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  document.querySelectorAll("#storyFilterEl .chip").forEach(c => c.classList.remove("on"));
  b.classList.add("on"); drawStories(b.dataset.g);
});
$("designFilterEl").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  document.querySelectorAll("#designFilterEl .chip").forEach(c => c.classList.remove("on"));
  b.classList.add("on"); drawDesigns(b.dataset.c);
});
$("viewCloseBtn").onclick = () => $("viewDialog").close();
$("viewDialog").addEventListener("click", e => {
  if (e.target === $("viewDialog")) $("viewDialog").close();
});
$("menuBtn").onclick = () => toggleNav();
document.querySelectorAll("#navLinksEl a").forEach(a =>
  a.addEventListener("click", () => closeNav()));
/* ---------- premium header controller ---------- */
function isMobileNav(){ return matchMedia("(max-width:900px)").matches; }
/* Single source of truth for background scroll-lock: locked while the mobile
   drawer, the book view, or the reader is open. Fixes stuck/over-unlocked states. */
function syncBodyLock(){
  const lock = ($("navLinksEl").classList.contains("open") && isMobileNav())
    || !$("bookViewEl").hidden || !$("readerViewEl").hidden;
  document.body.style.overflow = lock ? "hidden" : "";
}
function toggleNav(force){
  const nav = $("navLinksEl"), btn = $("menuBtn"), bd = $("navBackdropEl");
  const open = force !== undefined ? force : !nav.classList.contains("open");
  nav.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", open ? "true" : "false");
  btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (bd){
    if (open){ bd.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add("show"))); }
    else { bd.classList.remove("show"); setTimeout(() => { if (!$("navLinksEl").classList.contains("open")) bd.hidden = true; }, 260); }
  }
  syncBodyLock();
  if (open && isMobileNav()) $("topNavEl").classList.remove("navHidden");
}
function closeNav(){ const nav = $("navLinksEl"); if (nav && nav.classList.contains("open")) toggleNav(false); }
if ($("navBackdropEl")) $("navBackdropEl").onclick = () => closeNav();
document.addEventListener("keydown", e => { if (e.key === "Escape"){ closeNav(); if ($("viewDialog").open) $("viewDialog").close(); } });
window.addEventListener("resize", () => { if (!isMobileNav()) closeNav(); moveNavInk(false); });
window.addEventListener("load", () => setTimeout(() => moveNavInk(false), 60));
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveNavInk(false)).catch(() => {});
function moveNavInk(instant){
  const ink = $("navInkEl"), nav = $("navLinksEl");
  if (!ink || !nav || isMobileNav()){ if (ink) ink.style.opacity = "0"; return; }
  const a = nav.querySelector("a[data-sec].active") || nav.querySelector("a[data-sec]");
  if (!a){ ink.style.opacity = "0"; return; }
  const nr = nav.getBoundingClientRect(), r = a.getBoundingClientRect();
  ink.style.opacity = "1";
  if (instant){ ink.style.transition = "none"; }
  ink.style.left = (r.left - nr.left + nav.scrollLeft) + "px";
  ink.style.width = r.width + "px";
  try {
    const visL = nr.left, visR = nr.left + nav.clientWidth;
    if (r.left < visL + 4 || r.right > visR - 4){
      const target = nav.scrollLeft + (r.left - nr.left) - (nav.clientWidth - r.width) / 2;
      // Direct assignment (no smooth animation): a smooth scrollTo() on the
      // strip races Chrome against the page's own smooth scroll and the page
      // flight gets aborted. The strip is small — instant is fine.
      nav.scrollLeft = Math.max(0, target);
    }
  } catch(_e) {}
  // NOTE: never scrollIntoView() here — that hijacks the page's own smooth
  // scroll and cancels anchor navigation (nav links would stop working).
  if (instant){ requestAnimationFrame(() => { ink.style.transition = ""; }); }
}
// keep the sliding pill glued to the active link even when fonts/layout shift
setInterval(() => { if (!isMobileNav() && !$("navLinksEl").classList.contains("open")) moveNavInk(true); }, 1200);
$("printBtnEl").onclick = () => window.print();
$("copyEmailBtnEl").onclick = async () => {
  try { await navigator.clipboard.writeText(SITE.email); $("copyEmailBtnEl").textContent = "Copied ✓"; }
  catch { $("copyEmailBtnEl").textContent = SITE.email; }
  setTimeout(() => $("copyEmailBtnEl").textContent = "Copy email", 1600);
};
$("contactFormEl").addEventListener("submit", e => {
  e.preventDefault();
  const n = $("contactNameInput").value.trim(), m = $("contactEmailInput").value.trim(), t = $("contactMsgInput").value.trim();
  location.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent("Portfolio message from " + n)
    + "&body=" + encodeURIComponent(t + "\n\n— " + n + " (" + m + ")");
});

/* scroll spy + reveal + to-top */
const secs = ["home", "illustrations", "stories", "design", "animation", "about", "achievements"];
const links = [...document.querySelectorAll("#navLinksEl a[data-sec]")];
// During anchor navigation the spy is locked to the destination: without this,
// every intermediate section crossed mid-flight flips .active and sends the
// sliding pill zipping across the bar = header jitter on long trips.
let navTarget = null;
function setActive(sec, instant){
  links.forEach(l => l.classList.toggle("active", l.dataset.sec === sec));
  moveNavInk(!!instant);
}
const io = new IntersectionObserver(es => {
  if (navTarget) return; // locked while an anchor flight is in progress
  es.forEach(en => {
    if (en.isIntersecting){
      setActive(en.target.id, false);
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
secs.forEach(id => { const _s = document.getElementById(id); if (_s) io.observe(_s); });
// Manual takeover (wheel/touch) cancels a locked flight so the spy goes live.
["wheel", "touchstart"].forEach(ev =>
  window.addEventListener(ev, () => { navTarget = null; }, { passive: true }));

let revIo;
function observeReveals(){
  revIo = revIo || new IntersectionObserver(es =>
    es.forEach(en => en.isIntersecting && en.target.classList.add("in")), { threshold: .12 });
  document.querySelectorAll(".reveal:not(.in)").forEach(el => revIo.observe(el));
  // safety net: never leave content invisible (e.g. if observer never fires)
  setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach(el => el.classList.add("in")), 1500);
}
let _lastY = 0;
function onPageScroll(){
  const y = window.scrollY || 0;
  $("toTopBtn").classList.toggle("show", y > 700);
  const h = document.documentElement.scrollHeight - innerHeight;
  $("scrollProgEl").style.width = (h > 0 ? (y / h * 100) : 0) + "%";
  const nav = $("topNavEl");
  nav.classList.toggle("scrolled", y > 24);
  const drawerOpen = $("navLinksEl").classList.contains("open");
  if (!drawerOpen && !isMobileNav()){
    if (y > 420 && y > _lastY + 4) nav.classList.add("navHidden");
    else if (y < _lastY - 4 || y < 420) nav.classList.remove("navHidden");
  } else {
    nav.classList.remove("navHidden");
  }
  _lastY = y;
  // Release a locked anchor flight once we've arrived (spy goes live again).
  if (navTarget) {
    try {
      const t = document.getElementById(navTarget);
      if (!t) { navTarget = null; }
      else {
        const m = parseFloat(getComputedStyle(t).scrollMarginTop) || 0;
        const snap = t.getBoundingClientRect().top + y - m;
        if (Math.abs(snap - y) < 160) { navTarget = null; clearTimeout(window.__navLockT); }
      }
    } catch(_e) { navTarget = null; }
  }
}
window.addEventListener("scroll", onPageScroll, { passive: true });
document.addEventListener("scroll", onPageScroll, { passive: true });
setInterval(onPageScroll, 200); onPageScroll();
$("toTopBtn").onclick = () => scrollTo({ top: 0, behavior: "smooth" });

render();
renderHomeUpgrade();
syncStoryRoute();
/* Tell the loader overlay (index.html) that first render is done. */
try { window.dispatchEvent(new Event("portfolio:ready")); } catch(_e) {}
