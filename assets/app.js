const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Email links
const emailText = document.getElementById("emailText");
const lnkEmail = document.getElementById("lnk-email");
if (emailText) {
  emailText.textContent = window.SITE.email;
  emailText.href = `mailto:${window.SITE.email}`;
}
if (lnkEmail) {
  lnkEmail.textContent = window.SITE.email;
  lnkEmail.href = `mailto:${window.SITE.email}`;
}

// GitHub + LinkedIn
const gh1 = document.getElementById("lnk-github");
const gh2 = document.getElementById("lnk-github2");
const li1 = document.getElementById("lnk-linkedin");
const li2 = document.getElementById("lnk-linkedin2");

const ghUrl = `https://github.com/${window.SITE.githubUsername}`;
if (gh1) gh1.href = ghUrl;
if (gh2) gh2.href = ghUrl;

if (li1) li1.href = window.SITE.linkedinUrl;
if (li2) li2.href = window.SITE.linkedinUrl;
