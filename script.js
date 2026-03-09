const loginPage = document.getElementById("loginPage");
const mainPage = document.getElementById("mainPage");

const username = document.getElementById("username");
const password = document.getElementById("password");

const issuesContainer = document.getElementById("issuesContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const issueCount = document.getElementById("issueCount");

const modal = document.getElementById("issueModal");

const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalDescription = document.getElementById("modalDescription");
const modalPriority = document.getElementById("modalPriority");
const modalLabel = document.getElementById("modalLabel");

let allIssues = [];

function login() {
  if (username.value === "admin" && password.value === "admin123") {
    loginPage.classList.add("hidden");
    mainPage.classList.remove("hidden");

    loadIssues();
  } else {
    alert("Invalid Credentials");
  }
}

function showLoading() {
  loadingSpinner.classList.remove("hidden");
  issuesContainer.innerHTML = "";
}

function hideLoading() {
  loadingSpinner.classList.add("hidden");
}

async function loadIssues() {
  showLoading();

  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues"
  );

  const data = await res.json();

  allIssues = data.data;

  displayIssues(allIssues);

  hideLoading();
}

function getPriorityClass(priority) {
  if (priority === "HIGH") return "priority-high";
  if (priority === "MEDIUM") return "priority-medium";

  return "priority-low";
}

function getLabelClass(label) {
  if (label === "BUG") return "label-bug";
  if (label === "HELP WANTED") return "label-help";

  return "label-enhancement";
}

function displayIssues(issues) {
  issuesContainer.innerHTML = "";

  issueCount.innerText = issues.length;

  issues.forEach((issue) => {
    const card = document.createElement("div");

    card.className = `issue-card ${
      issue.status === "open" ? "open-border" : "closed-border"
    }`;

    card.innerHTML = `
      <div onclick="openIssue(${issue.id})">

        <div class="flex justify-between items-center mb-2">
          <div class="w-6 h-6 bg-green-100 rounded-full"></div>

          <span class="${getPriorityClass(issue.priority)}">
            ${issue.priority}
          </span>
        </div>

        <h3 class="font-semibold text-gray-800 mb-2">
          ${issue.title}
        </h3>

        <p class="text-sm text-gray-500 mb-3 line-clamp-2">
          ${issue.description}
        </p>

        <div class="flex gap-2 mb-3">
          <span class="${getLabelClass(issue.label)}">
            ${issue.label}
          </span>
        </div>

        <hr class="mb-2">

        <p class="text-xs text-gray-500">
          #${issue.id} by ${issue.author}
        </p>

        <p class="text-xs text-gray-400">
          ${issue.createdAt}
        </p>

      </div>
    `;

    issuesContainer.appendChild(card);
  });
}

function filterIssues(status) {
  const filtered = allIssues.filter((issue) => issue.status === status);

  displayIssues(filtered);
}

async function searchIssues() {
  const text = document.getElementById("searchInput").value;

  if (text === "") return;

  showLoading();

  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
  );

  const data = await res.json();

  displayIssues(data.data);

  hideLoading();
}

async function openIssue(id) {
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
  );

  const data = await res.json();

  const issue = data.data;

  modalTitle.innerText = issue.title;
  modalAuthor.innerText = issue.author;
  modalDescription.innerText = issue.description;
  modalPriority.innerText = issue.priority;
  modalLabel.innerText = issue.label;

  modal.showModal();
}