import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

async function text(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

const requiredFiles = [
  "index.html",
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
assert.match(index, /221/);
assert.match(index, /高校合作/);
assert.match(index, /企业共创/);
assert.match(index, /投资对接/);

const projects = await text("projects.html");
assert.match(projects, /id="project-grid"/);
assert.match(projects, /data-filter/);

const detail = await text("project.html");
assert.match(detail, /id="project-detail"/);
assert.match(detail, /assets\/main\.js/);

const dataSource = await text("assets/data.js");
const encoded = encodeURIComponent(dataSource);
const { demoDayProjects, projects: projectData, metrics } = await import(
  `data:text/javascript;charset=utf-8,${encoded}`
);

assert.equal(metrics[0].value, "221");
assert.ok(projectData.length >= 6, "project library should expose at least six projects");
assert.ok(projectData.every((project) => project.id && project.title && project.owner));
assert.ok(projectData.every((project) => project.cohort), "each project should declare a cohort");
assert.ok(new Set(projectData.map((project) => project.cohort)).size >= 2, "project library should include multiple cohorts");
const firstFirstPhaseIndex = projectData.findIndex((project) => project.cohort === "第一期项目");
const lastSecondPhaseIndex = projectData.map((project) => project.cohort).lastIndexOf("第二期项目");
assert.ok(lastSecondPhaseIndex < firstFirstPhaseIndex, "project library should list second cohort before first cohort");
assert.ok(projectData.some((project) => project.title.includes("BeamMind")));
assert.ok(projectData.some((project) => project.contact.includes("OPC")));
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

const videoProjects = demoDayProjects.filter((project) => project.video);
assert.ok(videoProjects.length > 0, "Demo Day should include projects with videos");
for (const demoProject of videoProjects) {
  const project = projectData.find((item) => item.id === demoProject.id);
  assert.ok(project?.video, `${demoProject.id} should expose a playable video on its project detail`);
  await access(new URL(`../${project.video}`, import.meta.url));
}

const mainSource = await text("assets/main.js");
assert.match(mainSource, /<video[\s\S]*controls/, "project detail should render a playable video element");

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

const { trainingStats } = await import(
  `data:text/javascript;charset=utf-8,${encoded}`
);
assert.equal(trainingStats.total, 118);
assert.equal(trainingStats.grade.reduce((sum, item) => sum + item.value, 0), 118);
assert.ok(trainingStats.college.length >= 6);
assert.ok(trainingStats.background.length >= 5);
assert.ok(trainingStats.source.includes("第一期118名学生信息"));

console.log("site structure tests passed");
