# OPC 主页优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 调整 OPC 主页 section 顺序、优化文案、修复移动端换行问题，突出项目制介绍和合作对接入口。

**架构：** 保持原有 CSS 组件和视觉风格不变，仅通过调整 HTML 结构顺序和硬编码文案实现。合作对接复用现有 `partner-grid`/`partner-tile` 样式。

**Tech Stack：** HTML5, CSS3, 原生 JavaScript (ES Module)

---

## 文件改动清单

| 文件 | 改动类型 | 说明 |
|------|----------|------|
| `assets/styles.css` | 编辑 | 修复 `home-hero h1` 移动端换行 |
| `index.html` | 编辑 | 调整 section 顺序、更新文案、改造合作对接区域、更新导航链接 |

---

### Task 1: 修复 CSS 移动端换行

**Files:**
- Modify: `assets/styles.css:247`

- [ ] **Step 1: 修改 `home-hero h1` 的 `text-wrap`**

  将 `text-wrap: nowrap` 改为 `text-wrap: balance`，避免手机端标题溢出。

  ```css
  .home-hero h1 {
    /* ... 其他样式不变 ... */
    text-wrap: balance;  /* 原来是 nowrap */
  }
  ```

- [ ] **Step 2: 验证修改**

  确认仅修改了 `text-wrap` 一行，不影响其他样式。

- [ ] **Step 3: Commit**

  ```bash
  git add assets/styles.css
  git commit -m "fix: allow home-hero h1 to wrap on mobile"
  ```

---

### Task 2: 调整 index.html 整体结构

**Files:**
- Modify: `index.html`

**目标顺序：**
1. `home-hero` (首页横幅)
2. `home-info-bar` (信息栏)
3. `#teaching` (项目制上课模式)
4. `#mentors` (导师团队) ← 提前
5. `#model` (训练营机制)
6. `#contact` (合作对接) ← 提前并改造
7. `#projects` (过往项目) ← 移后
8. `#demo-day` (Demo Day) ← 移后
9. `#camp-stats` (报名画像) ← 移后

- [ ] **Step 1: 备份原始文件**

  ```bash
  cp index.html index.html.bak
  ```

- [ ] **Step 2: 更新导航链接**

  修改 `<nav class="nav">` 中的链接顺序，匹配新 section 顺序：

  ```html
  <div class="nav-links" id="nav-links">
    <a href="index.html">首页</a>
    <a href="#teaching">项目制模式</a>
    <a href="#mentors">导师</a>
    <a href="#model">训练营</a>
    <a href="#contact">合作对接</a>
    <a href="fde.html">第三期</a>
    <a href="projects.html">项目库</a>
    <a class="nav-cta" href="#contact">发起合作</a>
  </div>
  ```

  注意：移除了 `#projects` 和 `#demo-day` 的导航锚点（它们移到了最后）。

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat: update nav links for new section order"
  ```

---

### Task 3: 增强 Hero 文案

**Files:**
- Modify: `index.html:29-36` (home-hero section)

- [ ] **Step 1: 替换 Hero 段落文案**

  将现有的 `<p>` 内容替换为 PPT 中的定位描述：

  ```html
  <p><strong>以项目制训练营为入口，连接 AI 原生人才与真实项目。</strong>我们帮助学生、行业人士和创业者掌握 Agent 驱动的工作方式，组建小团队，在真实业务场景中完成从想法到 MVP、从能力到商业化的闭环。不是普通培训，也不是等项目成熟后的孵化器——我们从第 0 天就开始。</p>
  ```

  （实际文案已和现有文案基本一致，确认保留现有内容即可，或微调增强。）

  如需微调，在现有文案基础上增加强调：

  ```html
  <p><strong>以项目制训练营为入口，建立 AI 原生人才与早期项目的生成、筛选和孵化平台。</strong>我们帮助学生、行业人士和创业者掌握 Agent 驱动的工作方式，组建小团队，在真实业务场景中完成从想法到 MVP、从能力到商业化的闭环。不是普通培训，也不是等项目成熟后的孵化器——我们从第 0 天就开始。</p>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add index.html
  git commit -m "feat: enhance hero copy with project positioning"
  ```

---

### Task 4: 增强项目制上课模式文案

**Files:**
- Modify: `index.html:57-82` (#teaching section)

- [ ] **Step 1: 增强 section-lead**

  ```html
  <p class="section-lead">训练营以真实业务场景为起点，围绕一个可交付的项目目标组建小队。项目需求方提出真实命题，跨专业学生组队，在主讲老师 + 行业导师 + 助教的辅导体系下，用 Agent 工作流完成需求访谈、方案设计、MVP 开发和 Demo 演示。</p>
  ```

  确认现有文案已经足够详细，无需大幅修改。如需微调，可增加"可交付"和"双轨辅导"关键词。

- [ ] **Step 2: 微调 4 张卡片文案**

  第 3 张卡片（主讲老师 & 行业导师）增强：

  ```html
  <article class="teaching-card lift-on-hover">
    <span aria-hidden="true">03</span>
    <h3>主讲老师 & 行业导师</h3>
    <p>高校导师负责课程框架与方法论，行业一线工程师、创业者和投资人担任实战导师，双轨辅导让学生在真实商业场景中获得反馈。</p>
  </article>
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat: enhance teaching section copy"
  ```

---

### Task 5: 移动导师团队到第 4 位并增强文案

**Files:**
- Modify: `index.html` (#mentors section)

- [ ] **Step 1: 将 `#mentors` section 移动到 `#teaching` 之后**

  在 HTML 中，将 `<section class="section container" id="mentors">...</section>` 整体剪切，粘贴到 `<section class="section container" id="teaching">...</section>` 之后。

- [ ] **Step 2: 增强 section-lead 文案**

  替换为：

  ```html
  <p class="section-lead">OPC 导师体系由高校导师与行业导师共同组成。深圳大学 PLAN Lab 导师团队负责课程框架与方法论；同时我们会邀请行业第一线的工程师、创业者和投资人担任实战导师，让学生在真实商业场景中获得反馈。覆盖 LLM Agent、区块链、无线通信、社交网络数据挖掘与物联网等多个研究方向。</p>
  ```

  （确认现有文案已经包含此内容，如需增强可在"深圳大学 PLAN Lab"后增加"同时我们会邀请行业第一线的工程师、创业者和投资人担任实战导师"。）

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat: move mentors section up and enhance copy"
  ```

---

### Task 6: 改造合作对接区域

**Files:**
- Modify: `index.html` (#contact section)

**目标：** 废弃原有的 `cta-band` 单按钮设计，改用 `partner-grid` + `partner-tile` 三列卡片。

- [ ] **Step 1: 替换 #contact section 内容**

  将现有的：

  ```html
  <section class="section container" id="contact">
    <div class="cta-band">
      <div>
        <h2>把你的高校、企业命题或投资资源接入 OPC</h2>
        <p>我们可以共同设计训练营、发布企业命题、筛选项目团队、组织 Demo Day，并对接后续试点、孵化和投资资源。</p>
      </div>
      <a class="button secondary" href="projects.html">先看项目</a>
    </div>
  </section>
  ```

  替换为：

  ```html
  <section class="section container" id="contact">
    <h2>合作对接</h2>
    <p class="section-lead">无论你是企业、高校还是投资人，都可以通过以下入口与 OPC 建立合作。</p>
    <div class="partner-grid">
      <article class="partner-tile lift-on-hover">
        <h3>项目需求方</h3>
        <p>有业务场景想用 Agent 验证？发布企业命题，与学生团队低成本共创 PoC。</p>
        <ul>
          <li>企业命题征集</li>
          <li>低成本 PoC 共创</li>
          <li>人才观察与实习对接</li>
        </ul>
        <p style="margin-top: 22px; opacity: 1;"><strong>联系：</strong><a href="mailto:zsl@szu.edu.cn" style="color: inherit; text-decoration: underline;">zsl@szu.edu.cn</a></p>
      </article>
      <article class="partner-tile lift-on-hover">
        <h3>培训 / 课程合作</h3>
        <p>高校或机构想共建项目制课程？我们提供课程体系、导师辅导和运营 SOP。</p>
        <ul>
          <li>项目制课程共建</li>
          <li>跨学院组队与导师辅导</li>
          <li>Demo Day 与成果展示</li>
        </ul>
        <p style="margin-top: 22px; opacity: 1;"><strong>联系：</strong><a href="mailto:ttwang@szu.edu.cn" style="color: inherit; text-decoration: underline;">ttwang@szu.edu.cn</a></p>
      </article>
      <article class="partner-tile lift-on-hover">
        <h3>投资 / 孵化对接</h3>
        <p>寻找早期 AI 原生项目和可验证团队？接入 Demo Day 和项目库筛选。</p>
        <ul>
          <li>项目库筛选</li>
          <li>路演与跟踪数据</li>
          <li>孵化资源和融资连接</li>
        </ul>
        <p style="margin-top: 22px; opacity: 1;"><strong>联系：</strong><a href="mailto:xxwu.eesissi@szu.edu.cn" style="color: inherit; text-decoration: underline;">xxwu.eesissi@szu.edu.cn</a></p>
      </article>
    </div>
  </section>
  ```

  注意：`partner-tile:first-child` 有特殊渐变背景，这里我们把三张卡片都用默认样式（白色背景），保持视觉统一。如需第一张保持渐变，可将"项目需求方"放在第一列（已经这样做了）。

- [ ] **Step 2: Commit**

  ```bash
  git add index.html
  git commit -m "feat: redesign contact section with three partner tiles and emails"
  ```

---

### Task 7: 移动过往项目和 Demo Day 到最后

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 将 `#projects` section 移到最后区域**

  将 `<section class="section container" id="projects">...</section>` 整体剪切，粘贴到 `#contact` 之后。

- [ ] **Step 2: 将 `#demo-day` section 移到最后区域**

  将 `<section class="section container" id="demo-day">...</section>` 整体剪切，粘贴到 `#projects` 之后。

- [ ] **Step 3: 将 `#camp-stats` section 移到最后**

  将 `<section class="section container" id="camp-stats">...</section>` 整体剪切，粘贴到 `#demo-day` 之后（成为最后一个 section）。

  最终顺序确认：
  1. home-hero
  2. home-info-bar
  3. #teaching
  4. #mentors
  5. #model
  6. #contact
  7. #projects
  8. #demo-day
  9. #camp-stats

- [ ] **Step 4: Commit**

  ```bash
  git add index.html
  git commit -m "feat: move projects, demo-day and camp-stats to end"
  ```

---

### Task 8: 整体验证

- [ ] **Step 1: 在浏览器中打开 `index.html`**

  确认：
  - 页面加载无报错
  - Section 顺序正确
  - 导航链接点击能正确跳转
  - 合作对接三列卡片显示正常
  - 手机端（浏览器 DevTools 模拟）标题换行正常

- [ ] **Step 2: 清理备份文件**

  ```bash
  rm index.html.bak
  ```

- [ ] **Step 3: 最终 Commit**

  ```bash
  git add index.html assets/styles.css
  git commit -m "feat: redesign homepage - mobile-friendly, highlight project model, partner contact tiles"
  ```

---

## Self-Review Checklist

- [x] **Spec coverage：** 所有 5 项需求（手机友好、项目介绍、合作表格、过往项目放最后、教师团队前置）均有对应任务
- [x] **Placeholder scan：** 无 TBD/TODO/"实现 later"
- [x] **Type consistency：** 不涉及类型定义，CSS 类名与现有 HTML 一致
- [x] **Scope：** 仅改动 `index.html` 和 `assets/styles.css`，不触及 `data.js`/`main.js`/其他页面
