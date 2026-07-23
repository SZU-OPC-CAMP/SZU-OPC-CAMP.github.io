import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";


async function text(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}


function assertTaClawNavigation(html, projectLabel) {
  const projectIndex = html.indexOf(`>${projectLabel}</a>`);
  const taClawIndex = html.indexOf(">TA-Claw</a>");
  const collaborationIndex = html.indexOf('class="nav-cta"');

  assert.ok(projectIndex >= 0, `${projectLabel} navigation item should exist`);
  assert.ok(taClawIndex > projectIndex, "TA-Claw should follow the project-library link");
  assert.ok(collaborationIndex > taClawIndex, "TA-Claw should precede the collaboration CTA");
  assert.match(
    html,
    /<a href="https:\/\/[a-z0-9.-]+\.ts\.net\/" target="_blank" rel="noopener noreferrer">TA-Claw<\/a>/,
    "TA-Claw should use a private Tailscale HTTPS URL and safe new-tab attributes",
  );
}


const projects = await text("projects.html");
assertTaClawNavigation(projects, "项目库");

const projectsEn = await text("projects-en.html");
assertTaClawNavigation(projectsEn, "Projects");

console.log("TA-Claw navigation tests passed");
