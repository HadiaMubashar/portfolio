const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();

const emailA = document.getElementById("emailText");
const lnkEmail = document.getElementById("lnk-email");
const lnkGitHub = document.getElementById("lnk-github");
const lnkLinkedIn = document.getElementById("lnk-linkedin");

emailA.href = `mailto:${window.SITE.email}`;
emailA.textContent = window.SITE.email;
lnkEmail.href = `mailto:${window.SITE.email}`;
lnkGitHub.href = `https://github.com/${window.SITE.githubUsername}`;
lnkLinkedIn.href = window.SITE.linkedinUrl;

const repoList = document.getElementById("repoList");
const repoStatus = document.getElementById("repoStatus");
const search = document.getElementById("projectSearch");

let reposCache = [];

function renderRepos(repos){
  repoList.innerHTML = "";
  repos.forEach(r => {
    const div = document.createElement("div");
    div.className = "repo";
    div.innerHTML = `
      <div>
        <h4><a href="${r.html_url}" target="_blank" rel="noreferrer">${r.name}</a></h4>
        <p>${r.description ? escapeHtml(r.description) : "No description provided."}</p>
      </div>
      <div class="meta">
        ★ ${r.stargazers_count}<br/>
        ⑂ ${r.forks_count}
      </div>
    `;
    repoList.appendChild(div);
  });
}

function escapeHtml(str){
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

async function loadRepos(){
  try{
    repoStatus.textContent = "Loading repositories...";
    const url = `https://api.github.com/users/${window.SITE.githubUsername}/repos?per_page=100&sort=updated`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();

    // Filter out forks (optional) + sort by stars then recent update
    reposCache = data
      .filter(r => !r.fork)
      .sort((a,b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.updated_at)-new Date(a.updated_at)));

    repoStatus.textContent = `Showing ${reposCache.length} repositories from @${window.SITE.githubUsername}`;
    renderRepos(reposCache);
  }catch(e){
    repoStatus.textContent = `Could not load repos. Set your username in assets/config.js. (${e.message})`;
  }
}

search.addEventListener("input", () => {
  const q = search.value.trim().toLowerCase();
  if(!q) return renderRepos(reposCache);
  renderRepos(reposCache.filter(r =>
    r.name.toLowerCase().includes(q) || (r.description || "").toLowerCase().includes(q)
  ));
});

loadRepos();
