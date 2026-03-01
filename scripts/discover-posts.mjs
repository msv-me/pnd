// Discovers new Instagram posts from @prepsnotdead and downloads their images.
// Run: node scripts/discover-posts.mjs
// Then commit the new images and updated src/lib/instagram.ts

import { execSync } from "child_process";
import { existsSync } from "fs";

const HEADERS = {
  "User-Agent":
    "Instagram 275.0.0.27.98 Android (33/13; 420dpi; 1080x2400; samsung; SM-G991B; o1s; exynos2100)",
  "X-IG-App-ID": "936619743392459",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Dest": "empty",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const existing = new Set([
  "DPejCmykSGL","DPUB7R5Edyw","C3lZyXRyNQs","C3O_B2wOpZd","C3Lh520PgEN",
  "C2Io8soy6F2","CzrTRjXr_pQ","Cq4Y6OtshmL","Cq1z9jFMHf-","CjYI1W5rlzZ",
  "CiMSIbVjFqQ","Cg4q-p2rFom","CgzwwfFvyVC","CfneNGcrEBx","CfcX5Nuv_Xj",
  "CeMqikxrnsv","Cdg4LimrhbC","CcwEuA2r-BX","CcmFC0Wrj4T","CcgdioHLafR",
  "CccNOf0MNFW","CcZgMRzMwOp","CcWsCYDsA-G","CcRnODUsAIV","CbLHdAyrY3m",
  "CbECShsLYj5","CYZY0rYrlNn",
]);

console.log(`Already have ${existing.size} posts. Discovering more...\n`);

const newPosts = [];
let maxId = null;

for (let page = 1; page <= 15; page++) {
  let url = "https://i.instagram.com/api/v1/feed/user/8613306952/?count=12";
  if (maxId) url += "&max_id=" + maxId;

  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    console.log(`\nPage ${page} returned ${res.status} — rate limited. Try again later.`);
    break;
  }

  const d = await res.json();
  for (const item of d.items || []) {
    const code = item.code;
    const isVideo = item.media_type === 2;
    if (!existing.has(code)) {
      newPosts.push({ shortcode: code, isVideo });
      existing.add(code);
    }
  }
  console.log(`Page ${page}: ${(d.items || []).length} items (${newPosts.length} new total)`);

  if (!d.more_available) { console.log("Reached end of feed."); break; }
  maxId = d.next_max_id;
  await sleep(3000);
}

if (newPosts.length === 0) {
  console.log("\nNo new posts found.");
  process.exit(0);
}

console.log(`\nFound ${newPosts.length} new posts. Downloading images...\n`);

const imgDir = new URL("../public/images/instagram/", import.meta.url).pathname;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";
let downloaded = 0;

for (const post of newPosts) {
  const dest = `${imgDir}${post.shortcode}.jpg`;
  if (existsSync(dest)) { continue; }

  try {
    const html = await (await fetch(
      `https://www.instagram.com/p/${post.shortcode}/embed/`,
      { headers: { "User-Agent": UA } }
    )).text();

    let imgUrl = html.match(/src="(https:\/\/scontent[^"]*p1080x1080[^"]*)"/)?.[1];
    if (!imgUrl) {
      imgUrl = html.match(/src="(https:\/\/scontent(?:(?!s150x150)[^"])*?)"/)?.[1];
    }
    if (imgUrl) {
      imgUrl = imgUrl.replace(/&amp;/g, "&");
      execSync(`curl -s -o "${dest}" "${imgUrl}"`);
      downloaded++;
      console.log(`  ${post.shortcode} ${post.isVideo ? "(video)" : "(image)"} — downloaded`);
    } else {
      console.log(`  ${post.shortcode} — no image in embed page`);
    }
  } catch (e) {
    console.log(`  ${post.shortcode} — error: ${e.message}`);
  }
  await sleep(1000);
}

console.log(`\nDownloaded ${downloaded} images.`);
console.log("\nAdd these to src/lib/instagram.ts POSTS array:");
for (const p of newPosts) {
  console.log(`  { shortcode: "${p.shortcode}", isVideo: ${p.isVideo} },`);
}
