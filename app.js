"use strict";

const data = window.LUCIA_DATA;
const page = document.body.dataset.page;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function externalLink(url, label) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    return `<a href="${escapeHtml(parsed.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a>`;
  } catch {
    return "";
  }
}

function renderShell() {
  const links = [
    ["home", "index.html", "首页"],
    ["guide", "guide.html", "玩法手册"],
    ["updates", "updates.html", "更新与反馈"]
  ];
  document.querySelector("#site-header").innerHTML = `
    <div class="header-inner wrap">
      <a class="brand" href="index.html" aria-label="饥荒人物Mod：露西亚 首页">
        <span class="brand-symbol" aria-hidden="true">✣</span>
        <span><small>饥荒人物 MOD</small><strong>露西亚</strong></span>
      </a>
      <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="main-nav">菜单</button>
      <nav class="main-nav" id="main-nav" aria-label="主导航">
        ${links.map(([key, href, label]) => `<a href="${href}" ${page === key ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
      </nav>
      <span class="header-author">芒杰 · 角色创作</span>
    </div>`;
  document.querySelector("#site-footer").innerHTML = `
    <div class="footer-inner wrap">
      <div><strong>${escapeHtml(data.site.title)}</strong><br>创作 / ${escapeHtml(data.site.author)}　·　贴图由 AI 绘制</div>
      <div>《饥荒联机版》×《战双帕弥什》玩家角色 Mod</div>
      <a href="#main">回到顶部 ↑</a>
    </div>`;
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#main-nav");
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("open", open);
  });
  document.querySelectorAll("#feedback-links").forEach(container => {
    const links = externalLink(data.site.workshopUrl, "前往工坊讨论区") + externalLink(data.site.videoUrl, "前往视频评论区");
    container.innerHTML = links || "<p>工坊与视频入口将在首次发布时补充。</p>";
  });
}

const englishNames = {
  redlotus: "Lotus", dawn: "Dawn", plume: "Plume", oathflame: "Pyroath",
  abyss: "Crimson Abyss", shadow: "Crimson Weave", crimsonweave: "Inverse Crown"
};

function formPortrait(key) {
  return `assets/form-${key}.webp${key === "plume" ? "?illustration" : ""}`;
}

const formAbilities = {
  redlotus: ["从红莲出发", "惯用太刀，在探索中收集改造材料。红莲是两条路线共同的起点。"],
  dawn: ["落雷追加", "有效太刀普攻有 50% 概率追加 20 点基础普通伤害，以落雷动画表现。追加伤害受感染系数影响。"],
  plume: ["锁定式范围旋风", "有效太刀普攻有 50% 概率召唤旋风。旋风跟随目标，每跳伤害目标及其周围半格地皮内的可攻击单位。每个目标每跳 7 点基础普通伤害，最多 6 跳，锁定目标死亡时消散。"],
  oathflame: ["辉光刻印 · 飞天斩", "每 10 次有效普攻获得一枚辉光刻印。飞天斩造成 525 点基础普通范围伤害，消耗满额刻印时追加 525 点基础位面伤害。机体免受火焰伤害。"],
  abyss: ["快速挥刀", "使用太刀时，攻击命中时点、动作与恢复时间加速至 1.2 倍。选择合适的出手时机，连续压制目标。"],
  shadow: ["带电攻击", "太刀普攻的普通伤害部分按原版带电判定，倍率为 1.5。潮湿额外倍率为 0，电免疫遵循原版规则。"],
  crimsonweave: ["冰魄 · 居合斩", "普通攻击积累至多 20 层冰魄，每层增加 1% 伤害。居合斩消耗冰魄，满层基础总伤害 1050，普通与位面各半。命中后施加寒冷，冻结效果遵循目标免疫规则。" ]
};

const itemDescriptions = {
  lucia_katana: "出生自带。普通攻击消耗耐久，归零后保留物品，用齿轮修复。誓焰与逆冕装备后可使用主动技能。",
  lucia_anchor: "背包右键使用，一次清除 25 点感染。",
  lucia_anchor_advanced: "背包右键使用，一次清除 75 点感染。",
  lucia_uninstaller: "每次沿当前路线退回一级机体，消耗一个，不返还改造材料。红莲状态无法使用。",
  lucia_projection_item: "放置后，10 格地皮内每秒净化 0.5 点感染。可回收，每名露西亚只能制作一次。",
  lucia_core_dawn: "红莲升级为黎明。背包右键开始机体改造。",
  lucia_core_plume: "黎明升级为鸦羽。背包右键开始机体改造。",
  lucia_core_oathflame: "鸦羽升级为誓焰。背包右键开始机体改造。",
  lucia_core_abyss: "红莲升级为深渊。背包右键开始机体改造。",
  lucia_core_shadow: "深渊升级为囚影。背包右键开始机体改造。",
  lucia_core_crimsonweave: "囚影升级为逆冕。背包右键开始机体改造。",
  lucia_hibernation_pod: "建筑拥有 15 次休眠耐久。休眠不消耗饥饿，每秒回血 0.5、净化感染 0.5，每次醒来扣除一次耐久。",
  lucia_liv_item: "放置后，10 格地皮内的露西亚每秒回血 0.5。同类效果不叠加，可回收。",
  lucia_lee_item: "放置后，每 2 秒攻击 6 格地皮内最近的敌对目标，造成 50 点基础普通伤害。同类装置不重复结算，可回收。",
  lucia_luna_item: "放置后，10 格地皮内露西亚的护甲防御度增加 5 个百分点，增益最高推至 95%。同类效果不叠加，可回收。",
  lucia_lamia_item: "放置后，10 格地皮内露西亚移动速度提高 10%。同类效果不叠加，可回收。",
  lucia_support: "背包右键，在角色当前位置呼叫轨道支援。首段 250 位面伤害，后续 5 次各 200，共 1250。每次照射为范围内露西亚恢复 40 生命，一次性消耗。",
  lucia_drone: "拥有 6 格储物空间，跟随并自动拾取附近 4 格地皮内的制作材料。地面左键收纳、右键打开容器，每名露西亚最多一台。"
};

function categoryFor(item) {
  if (item.key.startsWith("lucia_core_") || item.key === "lucia_uninstaller") return "core";
  if (item.key === "lucia_projection_item" || ["lucia_liv_item", "lucia_lee_item", "lucia_luna_item", "lucia_lamia_item"].includes(item.key)) return "projection";
  return "survival";
}

function renderHome() {
  document.querySelector("#home-forms").innerHTML = data.forms.map(form => `
    <a class="home-form" href="guide.html?form=${form.key}#frames">
      <img src="${formPortrait(form.key)}" alt="${escapeHtml(form.name)}机体" loading="lazy">
      <span>${escapeHtml(form.name)}</span><small>${englishNames[form.key]}</small>
    </a>`).join("");
}

function renderForms() {
  const tabs = document.querySelector("#form-tabs");
  tabs.innerHTML = data.forms.map(form => `
    <button id="form-tab-${form.key}" role="tab" type="button" data-form="${form.key}" aria-controls="form-detail" aria-selected="false">${escapeHtml(form.name)}</button>`).join("");
  const coreFor = {
    dawn: "lucia_core_dawn", plume: "lucia_core_plume", oathflame: "lucia_core_oathflame",
    abyss: "lucia_core_abyss", shadow: "lucia_core_shadow", crimsonweave: "lucia_core_crimsonweave"
  };

  function selectForm(key) {
    const form = data.forms.find(value => value.key === key) || data.forms[0];
    tabs.querySelectorAll("button").forEach(button => {
      const selected = button.dataset.form === form.key;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    const [ability, description] = formAbilities[form.key];
    const panel = document.querySelector("#form-detail");
    panel.setAttribute("aria-labelledby", `form-tab-${form.key}`);
    panel.innerHTML = `
      <img class="form-portrait" src="${formPortrait(form.key)}" alt="${escapeHtml(form.name)}机体立绘">
      <div><h3>${escapeHtml(form.name)}</h3><p class="english-name">${englishNames[form.key]}</p>
      <div class="form-stats"><div><span>太刀基础普通伤害</span><strong>${form.damage}</strong></div><div><span>基础位面伤害</span><strong>${form.planar}</strong></div></div>
      <p class="ability-name">${ability}</p><p>${description}</p>
      <p class="fine-print">实际伤害受感染、目标防御及对应机制影响。机体能力各自独立。</p>
      ${coreFor[form.key] ? `<button type="button" data-find-item="${coreFor[form.key]}">查找升级核心与配方 →</button>` : "<p>以红莲为起点，选择灰鸦或升格改造路线。</p>"}</div>`;
    panel.querySelector("[data-find-item]")?.addEventListener("click", event => findItem(event.currentTarget.dataset.findItem));
  }

  tabs.addEventListener("click", event => {
    const button = event.target.closest("[data-form]");
    if (button) selectForm(button.dataset.form);
  });
  tabs.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const buttons = [...tabs.querySelectorAll("button")];
    let index = buttons.indexOf(document.activeElement);
    if (event.key === "Home") index = 0;
    else if (event.key === "End") index = buttons.length - 1;
    else index = (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    event.preventDefault();
    selectForm(buttons[index].dataset.form);
    buttons[index].focus();
  });
  selectForm(new URLSearchParams(location.search).get("form"));
}

function renderSkills() {
  const groups = [["mechanics", "高级机械"], ["cooking", "生活质量"], ["resonance", "共鸣辅助"], ["lunar", "月亮亲和"], ["shadow", "暗影亲和"]];
  const tree = document.querySelector("#skill-tree");
  tree.innerHTML = groups.map(([group, label]) => {
    const nodes = data.skills.filter(node => node.group === group);
    return `<div class="skill-branch"><h3 class="branch-label">${label}</h3><div class="branch-nodes ${group}">
      ${nodes.map((node, index) => {
        let position = "";
        if (group === "cooking") position = node.key === "hibernation" ? "grid-column:2;grid-row:1" : `grid-column:1;grid-row:${index + 1}`;
        return `<button type="button" class="skill-node ${node.next ? "has-next" : ""}" data-skill="${node.key}" aria-pressed="false" style="${position}"><span class="node-icon"><img src="assets/skill-${node.key}.webp" alt="" loading="lazy"></span><span>${escapeHtml(node.name)}</span></button>`;
      }).join("")}</div></div>`;
  }).join("");

  function selectSkill(key) {
    const node = data.skills.find(value => value.key === key);
    tree.querySelectorAll("[data-skill]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.skill === key)));
    const previous = data.skills.find(value => value.next === key);
    const note = previous ? `前置技能　${previous.name}` : "独立起点";
    document.querySelector("#skill-detail").innerHTML = `
      <img src="assets/skill-${node.key}.webp" alt="">
      <div><h3>${escapeHtml(node.name)}</h3><p>${escapeHtml(node.desc)}</p><p class="prerequisite">${escapeHtml(note)}</p></div>`;
  }
  tree.addEventListener("click", event => {
    const button = event.target.closest("[data-skill]");
    if (button) selectSkill(button.dataset.skill);
  });
  selectSkill("matrix");
}

let itemFilter = "all";
function renderItems() {
  const query = document.querySelector("#item-search").value.trim().toLowerCase();
  const filtered = data.items.filter(item => {
    const haystack = `${item.name} ${item.key} ${item.ingredients.map(value => value.name).join(" ")} ${itemDescriptions[item.key]}`.toLowerCase();
    return (itemFilter === "all" || categoryFor(item) === itemFilter) && haystack.includes(query);
  });
  const categoryNames = { core: "机体改造", projection: "投影装置", survival: "生存与支援" };
  const ownerNames = { lucia_form_1: "红莲", lucia_form_2: "黎明", lucia_form_3: "鸦羽", lucia_form_5: "深渊", lucia_form_6: "囚影" };
  document.querySelector("#item-grid").innerHTML = filtered.map(item => {
    const skill = data.skills.find(node => `lucia_${node.key}` === item.skill);
    const requirement = skill ? `学习“${skill.name}”后解锁` : ownerNames[item.owner] ? `当前机体为${ownerNames[item.owner]}` : item.key === "lucia_projection_item" ? "每名露西亚限制作一次" : "露西亚专属";
    return `<article class="item-card" id="item-${item.key}">
      <div class="item-card-header"><img src="assets/item-${item.key}.webp" alt="" loading="lazy"><div><h3>${escapeHtml(item.name)}</h3><span class="item-category">${categoryNames[categoryFor(item)]}</span></div></div>
      <p>${escapeHtml(itemDescriptions[item.key])}</p>
      <div class="ingredients">${item.ingredients.length ? item.ingredients.map(value => `<span>${escapeHtml(value.name)} ×${value.amount}</span>`).join("") : "<span>出生自带</span>"}</div>
      <div class="item-unlock">${escapeHtml(item.tech)}<br>${escapeHtml(requirement)}</div></article>`;
  }).join("");
  document.querySelector("#item-count").textContent = `共 ${filtered.length} 件物品`;
  document.querySelector("#empty-search").hidden = filtered.length > 0;
}

function findItem(key) {
  itemFilter = "all";
  document.querySelectorAll("[data-filter]").forEach(button => {
    const active = button.dataset.filter === "all";
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const item = data.items.find(value => value.key === key);
  document.querySelector("#item-search").value = item?.name || "";
  renderItems();
  document.querySelector("#items").scrollIntoView({ behavior: "smooth" });
}

function setupGuide() {
  renderForms();
  renderSkills();
  renderItems();
  document.querySelector("#item-search").addEventListener("input", renderItems);
  document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
    itemFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(value => {
      const active = value === button;
      value.classList.toggle("active", active);
      value.setAttribute("aria-pressed", String(active));
    });
    renderItems();
  }));
  document.addEventListener("keydown", event => {
    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      document.querySelector("#item-search").focus();
    }
  });
  const range = document.querySelector("#infection-range");
  function updateInfection() {
    const value = Number(range.value);
    const multiplier = data.infectionCurve[value];
    document.querySelector("#infection-value").textContent = value;
    document.querySelector("#infection-multiplier").textContent = `${Number((multiplier * 100).toFixed(1))}%`;
  }
  range.addEventListener("input", updateInfection);
  updateInfection();
  document.querySelector("#health-stat").textContent = data.constants.HEALTH;
  document.querySelector("#hunger-stat").textContent = data.constants.HUNGER;
  const observer = new IntersectionObserver(entries => {
    const visible = entries.find(entry => entry.isIntersecting);
    if (!visible) return;
    document.querySelectorAll(".guide-sidebar a").forEach(link => link.classList.toggle("current", link.hash === `#${visible.target.id}`));
  }, { rootMargin: "-110px 0px -65% 0px", threshold: 0 });
  document.querySelectorAll(".guide-section").forEach(section => observer.observe(section));
}

function renderUpdates() {
  const records = [...data.site.updates];
  if (data.site.releaseDate) records.push({ date: data.site.releaseDate, title: "首次发布", changes: ["露西亚来到永恒领域。机体改造、技能树与专属物品一同开放。"] });
  records.sort((a, b) => b.date.localeCompare(a.date));
  const container = document.querySelector("#update-list");
  container.innerHTML = records.length ? records.map(record => `
    <article class="timeline-entry"><time datetime="${escapeHtml(record.date)}">${escapeHtml(record.date)}</time><h3>${escapeHtml(record.title)}</h3><ul>${record.changes.map(change => `<li>${escapeHtml(change)}</li>`).join("")}</ul></article>`).join("") : `
    <article class="timeline-entry"><span class="timeline-label">从首发起记</span><h3>从第一次见面开始</h3><p>首次发布的日期会成为这份记录的起点。此后的内容新增、玩法调整与问题修复，都将在这里按时间留下记录。</p></article>`;
  const template = "【露西亚 Mod 体验反馈】\n发生日期\n当前机体\n相关技能\n问题表现\n操作步骤\n使用的其他模组\n截图或报错信息\n";
  document.querySelector("#copy-feedback").addEventListener("click", async () => {
    const status = document.querySelector("#copy-status");
    try {
      await navigator.clipboard.writeText(template);
      status.textContent = "已复制，可以粘贴到工坊讨论区或视频评论区。";
    } catch {
      const text = document.querySelector("#feedback-template");
      text.hidden = false;
      text.textContent = template;
      status.textContent = "请选中下方文字复制。";
    }
  });
}

renderShell();
if (page === "home") renderHome();
if (page === "guide") setupGuide();
if (page === "updates") renderUpdates();
