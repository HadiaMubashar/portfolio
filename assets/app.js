const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const emailText = document.getElementById("emailText");
const lnkEmail = document.getElementById("lnk-email");
const lnkGitHub = document.getElementById("lnk-github");
const lnkLinkedIn = document.getElementById("lnk-linkedin");

if (emailText) {
  emailText.href = `mailto:${window.SITE.email}`;
  emailText.textContent = window.SITE.email;
}
if (lnkEmail) lnkEmail.href = `mailto:${window.SITE.email}`;
if (lnkGitHub) lnkGitHub.href = `https://github.com/${window.SITE.githubUsername}`;
if (lnkLinkedIn) lnkLinkedIn.href = window.SITE.linkedinUrl;

// --- Blog posts (edit anytime) ---
const POSTS = [
  {
    title: "How I build AI automations that don’t break in production",
    date: "2026-03-01",
    summary: "My checklist: logging, retries, approvals, guardrails, and evals for real-world workflows.",
    link: "#"
  },
  {
    title: "RAG that actually works: chunking, embeddings, reranking, evals",
    date: "2026-02-20",
    summary: "The practical improvements that make retrieval-based assistants feel dramatically smarter.",
    link: "#"
  },
  {
    title: "From LLM to agent: connecting tools with safe actions",
    date: "2026-02-10",
    summary: "How I design tool-using agents that can take actions across apps without surprises.",
    link: "#"
  }
];

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[m]));
}

function renderPosts(targetId, limit=null){
  const el = document.getElementById(targetId);
  if (!el) return;

  const items = [...POSTS].sort((a,b)=> new Date(b.date)-new Date(a.date));
  const list = limit ? items.slice(0, limit) : items;

  el.innerHTML = list.map(p => `
    <a class="post" href="${p.link}">
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.summary)}</p>
      <span class="meta">${escapeHtml(p.date)}</span>
    </a>
  `).join("");
}

renderPosts("latestPosts", 3);
renderPosts("allPosts", null);

// --- GitHub repos ---
const repoList = document.getElementById("repoList");
const repoStatus = document.getElementById("repoStatus");

async function loadRepos(){
  if (!repoList || !repoStatus) return;

  try{
    repoStatus.textContent = "Loading repositories...";
    const url = `https://api.github.com/users/${window.SITE.githubUsername}/repos?per_page=100&sort=updated`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();

    const repos = data
      .filter(r => !r.fork)
      .sort((a,b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.updated_at)-new Date(a.updated_at)));

    repoStatus.textContent = `Showing ${repos.length} repositories from @${window.SITE.githubUsername}`;

    repoList.innerHTML = repos.map(r => `
      <div class="repo">
        <div>
          <h4><a href="${r.html_url}" target="_blank" rel="noreferrer">${escapeHtml(r.name)}</a></h4>
          <p>${r.description ? escapeHtml(r.description) : "No description provided."}</p>
        </div>
        <div class="meta">
          ★ ${r.stargazers_count}<br/>
          ⑂ ${r.forks_count}
        </div>
      </div>
    `).join("");

  }catch(e){
    repoStatus.textContent = `Could not load repos. Check assets/config.js (${e.message})`;
  }
}
loadRepos();
