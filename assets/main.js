import { cohort3Projects, demoDayProjects, mentors, metrics, partners, projects, resourceMap, trainingStats } from "./data.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function projectCard(project) {
  return `
    <article class="project-card lift-on-hover" data-category="${project.category}" data-cohort="${project.cohort}">
      <a class="project-card__media" href="project.html?id=${project.id}" aria-label="查看 ${project.title}">
        <img src="${project.image}" alt="${project.title}">
        <span>${project.stage}</span>
      </a>
      <div class="project-card__body">
        <div class="meta-row">
          <span>${project.cohort}</span>
          <span>${project.category}</span>
          <span>${project.owner}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <a class="text-link" href="project.html?id=${project.id}">查看项目详情</a>
      </div>
    </article>
  `;
}

function renderMetrics() {
  const node = $("#metrics");
  if (!node) return;
  node.innerHTML = metrics.map((item) => `
    <div class="metric lift-on-hover">
      <strong>${item.value}</strong>
      <span>${item.label}</span>
    </div>
  `).join("");
}

function renderPartners() {
  const node = $("#partner-grid");
  if (!node) return;
  node.innerHTML = partners.map((partner) => `
    <article class="partner-tile lift-on-hover">
      <h3>${partner.title}</h3>
      <p>${partner.subtitle}</p>
      <ul>${partner.points.map((point) => `<li>${point}</li>`).join("")}</ul>
    </article>
  `).join("");
}

function statBar(item, total) {
  const percent = Math.round((item.value / total) * 100);
  return `
    <li class="stat-bar lift-on-hover">
      <div class="stat-bar__label">
        <span>${item.label}</span>
        <strong>${item.value} 人</strong>
      </div>
      <div class="stat-bar__track" aria-hidden="true">
        <span style="width: ${percent}%"></span>
      </div>
    </li>
  `;
}

function renderTrainingStats() {
  const section = $("#camp-stats");
  if (!section) return;

  const highlights = $("#camp-stats-highlights");
  const grade = $("#camp-stats-grade");
  const college = $("#camp-stats-college");
  const background = $("#camp-stats-background");
  const source = $("#camp-stats-source");

  if (highlights) {
    highlights.innerHTML = trainingStats.highlights.map((item) => `
      <div class="stat-kpi lift-on-hover">
        <strong>${item.value}</strong>
        <span>${item.label}</span>
      </div>
    `).join("");
  }

  if (grade) {
    grade.innerHTML = trainingStats.grade.map((item) => statBar(item, trainingStats.total)).join("");
  }

  if (college) {
    college.innerHTML = trainingStats.college.map((item) => statBar(item, trainingStats.total)).join("");
  }

  if (background) {
    background.innerHTML = trainingStats.background.map((item) => `
      <li class="background-chip lift-on-hover">
        <span>${item.label}</span>
        <strong>${item.value} 人</strong>
      </li>
    `).join("");
  }

  if (source) {
    source.textContent = `数据来源：${trainingStats.source}，仅展示聚合统计。`;
  }
}

function renderFeaturedProjects() {
  const node = $("#featured-projects");
  if (!node) return;
  const tabs = $("#project-cohort-tabs");
  const prev = $('[data-project-nav="prev"]');
  const next = $('[data-project-nav="next"]');
  const cohorts = [...new Set(projects.map((project) => project.cohort))];
  let activeCohort = cohorts[0];
  let offset = 0;
  const pageSize = 3;

  const renderTabs = () => {
    if (!tabs) return;
    tabs.innerHTML = cohorts.map((cohort) => `
      <button class="cohort-tab ${cohort === activeCohort ? "is-active" : ""}" type="button" data-cohort-tab="${cohort}">${cohort}</button>
    `).join("");
  };

  const renderCards = () => {
    const cohortProjects = projects.filter((project) => project.cohort === activeCohort);
    const visible = cohortProjects.slice(offset, offset + pageSize);
    node.innerHTML = visible.map(projectCard).join("");
    const canMove = cohortProjects.length > pageSize;
    if (prev) prev.disabled = !canMove;
    if (next) next.disabled = !canMove;
  };

  tabs?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cohort-tab]");
    if (!button) return;
    activeCohort = button.dataset.cohortTab;
    offset = 0;
    renderTabs();
    renderCards();
  });

  prev?.addEventListener("click", () => {
    const cohortProjects = projects.filter((project) => project.cohort === activeCohort);
    offset = offset <= 0 ? Math.max(cohortProjects.length - pageSize, 0) : Math.max(offset - pageSize, 0);
    renderCards();
  });

  next?.addEventListener("click", () => {
    const cohortProjects = projects.filter((project) => project.cohort === activeCohort);
    offset = offset + pageSize >= cohortProjects.length ? 0 : offset + pageSize;
    renderCards();
  });

  renderTabs();
  renderCards();
}

function renderResources() {
  const node = $("#resource-map");
  if (!node) return;
  node.innerHTML = resourceMap.map((item, index) => `
    <li class="lift-on-hover">
      <span>${String(index + 1).padStart(2, "0")}</span>
      ${item}
    </li>
  `).join("");
}

function renderProjectLibrary() {
  const grid = $("#project-grid");
  if (!grid) return;

  const categories = ["全部", ...new Set(projects.map((project) => project.category))];
  const filters = $("#project-filters");
  filters.innerHTML = categories.map((category, index) => `
    <button class="filter-button ${index === 0 ? "is-active" : ""}" data-filter="${category}" type="button">${category}</button>
  `).join("");

  const paint = (category = "全部") => {
    const visible = category === "全部" ? projects : projects.filter((project) => project.category === category);
    grid.innerHTML = visible.map(projectCard).join("");
    $("#project-count").textContent = `${visible.length} 个项目`;
  };

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    $$(".filter-button", filters).forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    paint(button.dataset.filter);
  });

  paint();
}

function renderProjectDetail() {
  const node = $("#project-detail");
  if (!node) return;

  const id = new URLSearchParams(window.location.search).get("id") || projects[0].id;
  const project = projects.find((item) => item.id === id) || projects[0];
  document.title = `${project.title} | OPC 项目库`;

  node.innerHTML = `
    <section class="detail-hero">
      <div>
        <a class="back-link" href="projects.html">返回项目库</a>
        <div class="meta-row detail-meta">
          <span>${project.category}</span>
          <span>${project.stage}</span>
        </div>
        <h1>${project.title}</h1>
        <p>${project.summary}</p>
      </div>
      <figure>
        <img src="${project.image}" alt="${project.title}">
      </figure>
    </section>

    <section class="detail-grid">
      <article class="lift-on-hover">
        <h2>解决的问题</h2>
        <p>${project.problem}</p>
      </article>
      <article class="lift-on-hover">
        <h2>项目方案</h2>
        <p>${project.solution}</p>
      </article>
      <aside class="contact-panel lift-on-hover">
        <h2>负责人</h2>
        <dl>
          <dt>项目负责人</dt>
          <dd>${project.owner}</dd>
          <dt>联系方式</dt>
          <dd>${project.contact}</dd>
          <dt>团队成员</dt>
          <dd>${project.team.join(" / ")}</dd>
        </dl>
      </aside>
      <article class="wide-card lift-on-hover">
        <h2>正在寻找的资源</h2>
        <div class="tag-list">${project.resources.map((item) => `<span>${item}</span>`).join("")}</div>
      </article>
    </section>
  `;
}

function mentorCard(mentor) {
  return `
    <article class="mentor-card lift-on-hover">
      <div class="mentor-card__head">
        <div class="mentor-avatar" aria-hidden="true">${mentor.name.charAt(0)}</div>
        <div class="mentor-card__meta">
          <h3>${mentor.name}</h3>
          <span class="mentor-title">${mentor.title}</span>
        </div>
      </div>
      <p class="mentor-lab">${mentor.lab}</p>
      <p class="mentor-research">${mentor.research}</p>
      <a class="mentor-email" href="mailto:${mentor.email}">${mentor.email}</a>
    </article>
  `;
}

function renderMentors() {
  const node = $("#mentor-grid");
  if (!node) return;
  node.innerHTML = mentors.map(mentorCard).join("");
}

function demoDayCard(project) {
  const links = [];
  if (project.github) {
    links.push(`<a class="demo-day-link" href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
  }
  if (project.poster) {
    links.push(`<a class="demo-day-link" href="${project.poster}" target="_blank">宣传海报</a>`);
  }
  if (project.video) {
    links.push(`<span class="demo-day-badge">含展示视频</span>`);
  }
  return `
    <article class="demo-day-card lift-on-hover">
      <a class="demo-day-card__media" href="project.html?id=${project.id}" aria-label="查看 ${project.title}">
        <img src="${project.image}" alt="${project.title}">
      </a>
      <div class="demo-day-card__body">
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <div class="demo-day-links">${links.join("")}</div>
        <div class="demo-day-team">团队：${project.team.join(" / ")}</div>
      </div>
    </article>
  `;
}

function renderDemoDay() {
  const node = $("#demo-day-grid");
  if (!node) return;
  node.innerHTML = demoDayProjects.map(demoDayCard).join("");
}

function cohort3Item(project) {
  const team = project.team.length > 0 ? project.team.join(" / ") : "待定";
  return `
    <li class="cohort3-item lift-on-hover">
      <div class="cohort3-item__main">
        <h3>${project.title}</h3>
        ${project.summary ? `<p>${project.summary}</p>` : ""}
      </div>
      <div class="cohort3-item__team">${team}</div>
    </li>
  `;
}

function renderCohort3() {
  const node = $("#cohort3-list");
  if (!node) return;
  node.innerHTML = `
    <ul class="cohort3-ul">
      ${cohort3Projects.map(cohort3Item).join("")}
    </ul>
  `;
}

function initNav() {
  const toggle = $("#nav-toggle");
  const links = $("#nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

renderMetrics();
renderPartners();
renderTrainingStats();
renderMentors();
renderFeaturedProjects();
renderDemoDay();
renderResources();
renderCohort3();
renderProjectLibrary();
renderProjectDetail();
initNav();
