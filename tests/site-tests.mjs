import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

async function text(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

const requiredFiles = [
  "index.html",
  "fde.html",
  "projects.html",
  "project.html",
  "assets/styles.css",
  "assets/data.js",
  "assets/main.js",
];

for (const file of requiredFiles) {
  const content = await text(file);
  assert.ok(content.length > 200, `${file} should contain real content`);
}

const index = await text("index.html");
assert.match(index, /OPC \+ Agent AI 原生创业工场/);
assert.match(index, /href="projects\.html"/);
assert.doesNotMatch(index, /id="cohort3"/, "third cohort preview should live on the FDE recruitment page, not the home page");

const fde = await text("fde.html");
assert.match(fde, /第三期 FDE 招募/);
assert.match(fde, /第三期项目命题/);
assert.match(fde, /id="cohort3-list"/);
assert.match(fde, /cohort3Projects/);
assert.match(fde, /cohort3SignupUrl/);
assert.match(fde, /<a class="cohort3-item lift-on-hover"/);
assert.match(fde, /AI 落地型工程师/);
assert.match(fde, /校企合作真实命题/);
assert.match(fde, /48 小时 AI 落地挑战/);

const projects = await text("projects.html");
assert.match(projects, /id="project-grid"/);
assert.match(projects, /data-filter/);

const detail = await text("project.html");
assert.match(detail, /id="project-detail"/);
assert.match(detail, /assets\/main\.js/);

const dataSource = await text("assets/data.js");
const encoded = encodeURIComponent(dataSource);
const { cohort3Projects, demoDayProjects, partners, projects: projectData, metrics } = await import(
  `data:text/javascript;charset=utf-8,${encoded}`
);

assert.equal(metrics[0].value, "221");
assert.ok(partners.some((partner) => partner.title === "高校合作"));
assert.ok(partners.some((partner) => partner.title === "企业共创"));
assert.ok(partners.some((partner) => partner.title === "投资对接"));
assert.ok(cohort3Projects.some((project) => project.title === "跨境电商 LLM 应用案例与系统方案"));
assert.ok(cohort3Projects.some((project) => project.title === "基于大模型的企业员工智能办公平台"));
assert.ok(cohort3Projects.some((project) => project.summary.includes("ROI") || project.summary.includes("转化率")));
assert.ok(projectData.length >= 6, "project library should expose at least six projects");
assert.ok(projectData.every((project) => project.id && project.title && project.owner));
assert.ok(projectData.every((project) => project.cohort), "each project should declare a cohort");
assert.ok(new Set(projectData.map((project) => project.cohort)).size >= 2, "project library should include multiple cohorts");
const firstFirstPhaseIndex = projectData.findIndex((project) => project.cohort === "第一期项目");
const lastSecondPhaseIndex = projectData.map((project) => project.cohort).lastIndexOf("第二期项目");
assert.ok(lastSecondPhaseIndex < firstFirstPhaseIndex, "project library should list second cohort before first cohort");
assert.ok(projectData.some((project) => project.title.includes("BeamMind")));
assert.ok(projectData.some((project) => project.contact.includes("OPC")));
assert.equal(
  projectData.find((project) => project.id === "spanish-claw")?.github,
  "https://github.com/void-walker-zen-script/Spanish-claw",
  "Spanish-claw should expose the provided GitHub link",
);
assert.equal(projectData.find((project) => project.id === "outfit-companion")?.owner, "张韵祺");
assert.equal(projectData.find((project) => project.id === "outfit-companion")?.github, null);
for (const project of projectData) {
  await access(new URL(`../${project.image}`, import.meta.url));
}

const secondPhaseOwners = new Map([
  ["investor-match", "张胜利"],
  ["research-copilot", "王滔滔"],
  ["mental-journal", "王滔滔"],
  ["beammind", "刘芳"],
  ["wireless-agent", "童景文"],
  ["gu-you", "吴晓晓"],
]);

for (const [id, owner] of secondPhaseOwners) {
  assert.equal(projectData.find((project) => project.id === id)?.owner, owner, `${id} should use updated project owner`);
  assert.equal(demoDayProjects.find((project) => project.id === id)?.owner, owner, `${id} Demo Day card should use updated project owner`);
}

const beammindGithub = "https://github.com/xy1p3ng/perler-beans-sketch-generator-editor";
assert.equal(projectData.find((project) => project.id === "beammind")?.github, beammindGithub);
assert.equal(demoDayProjects.find((project) => project.id === "beammind")?.github, beammindGithub);

const wirelessTeam = ["宋熠杰", "薛泽扬", "陈泓帆", "肖婧羽"];
assert.deepEqual(projectData.find((project) => project.id === "wireless-agent")?.team, wirelessTeam);
assert.deepEqual(demoDayProjects.find((project) => project.id === "wireless-agent")?.team, wirelessTeam);

const videoProjects = demoDayProjects.filter((project) => project.video);
assert.ok(videoProjects.length > 0, "Demo Day should include projects with videos");
for (const demoProject of videoProjects) {
  const project = projectData.find((item) => item.id === demoProject.id);
  assert.ok(project?.video, `${demoProject.id} should expose a playable video on its project detail`);
  await access(new URL(`../${project.video}`, import.meta.url));
}

const mainSource = await text("assets/main.js");
assert.match(mainSource, /<video[\s\S]*controls/, "project detail should render a playable video element");
assert.match(mainSource, /mentor-avatar-frame/, "mentor cards should render a fixed avatar frame");

assert.match(index, /id="project-cohort-tabs"/);
assert.match(index, /data-project-nav="prev"/);
assert.match(index, /data-project-nav="next"/);
assert.match(index, /id="camp-stats"/);
assert.match(index, /id="camp-stats-grade"/);
assert.match(index, /id="camp-stats-college"/);
assert.match(index, /id="camp-stats-background"/);

const styles = await text("assets/styles.css");
assert.match(styles, /\.lift-on-hover:hover/);
assert.match(styles, /translateY\(-/);
assert.match(styles, /#mentors::after/);
assert.match(styles, /\.mentor-avatar-frame/);

const { trainingStats } = await import(
  `data:text/javascript;charset=utf-8,${encoded}`
);
assert.equal(trainingStats.total, 118);
assert.equal(trainingStats.grade.reduce((sum, item) => sum + item.value, 0), 118);
assert.ok(trainingStats.college.length >= 6);
assert.ok(trainingStats.background.length >= 5);
assert.ok(trainingStats.source.includes("第一期118名学生信息"));

console.log("site structure tests passed");
