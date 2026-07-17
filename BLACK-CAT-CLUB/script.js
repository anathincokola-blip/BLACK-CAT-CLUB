const STORAGE_KEY = "blackCatClubMembers";
const SESSION_KEY = "blackCatClubLoggedInMember";
const MONEY_KEY = "blackCatClubMoneyRecords";

const starterMembers = [
  {
    name: "Athi Ncokola",
    age: "Admin",
    phone: "0630365628",
    category: "Technician",
    position: "Club Technician / Admin",
    role: "Technician",
    adminAccess: true,
    email: "athi ncokola",
    password: "0630365628",
    availability: "Available",
    contractType: "Technical Contract",
    signingStatus: "Signed",
    signedBy: "Club Admin",
    contractStart: "2026-01-01",
    contractEnd: "2026-12-31",
    guardianName: "Not required",
    guardianContact: "Not required",
    joined: "01 Jan 2026"
  },
  {
    name: "Club Manager",
    age: "Manager",
    phone: "070 000 0000",
    category: "Staff",
    position: "Manager",
    role: "Manager",
    adminAccess: false,
    email: "manager",
    password: "Manager123",
    availability: "Available",
    contractType: "Staff Contract",
    signingStatus: "Signed",
    signedBy: "Athi Ncokola",
    contractStart: "2026-01-01",
    contractEnd: "2026-12-31",
    guardianName: "Not required",
    guardianContact: "Not required",
    joined: "01 Jan 2026"
  },
  {
    name: "Sifiso Z.",
    age: "17",
    phone: "075 000 0000",
    category: "Development Player",
    position: "Striker",
    role: "Development Player",
    adminAccess: false,
    email: "sifiso",
    password: "Player123",
    availability: "Injured",
    contractType: "Development Contract",
    signingStatus: "Pending",
    signedBy: "Athi Ncokola",
    contractStart: "2026-02-20",
    contractEnd: "2028-02-19",
    guardianName: "Parent Name",
    guardianContact: "075 000 0000",
    joined: "28 Feb 2026"
  },
  {
    name: "Luyanda M.",
    age: "16",
    phone: "072 000 0000",
    category: "Player",
    position: "Goalkeeper",
    role: "Player",
    adminAccess: false,
    email: "luyanda",
    password: "Player123",
    availability: "Available",
    contractType: "1 Year",
    signingStatus: "Signed",
    signedBy: "Athi Ncokola",
    contractStart: "2026-01-01",
    contractEnd: "2026-12-31",
    guardianName: "Parent Name",
    guardianContact: "072 000 0000",
    joined: "18 Feb 2026"
  }
];

function normal(value) {
  return String(value || "").trim().toLowerCase();
}

function todayDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function moneyFormat(amount) {
  return "R" + Number(amount).toFixed(2);
}

function getMembers() {
  let members = [];

  try {
    members = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    members = [];
  }

  starterMembers.forEach(defaultMember => {
    const exists = members.some(member => normal(member.email) === normal(defaultMember.email));

    if (!exists) {
      members.push(defaultMember);
    }
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  return members;
}

function saveMembers(members) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

function getMoneyRecords() {
  try {
    return JSON.parse(localStorage.getItem(MONEY_KEY)) || [];
  } catch {
    return [];
  }
}

function saveMoneyRecords(records) {
  localStorage.setItem(MONEY_KEY, JSON.stringify(records));
}

function getLoggedInMember() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function saveLoggedInMember(member) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(member));
}

function isAthi(member) {
  if (!member) return false;

  return normal(member.name) === "athi ncokola" || normal(member.email) === "athi ncokola";
}

function isAdmin() {
  return isAthi(getLoggedInMember());
}

function canManageMoney() {
  const member = getLoggedInMember();
  return member && member.role === "Manager";
}

function showMessage(id, message, type) {
  const element = document.getElementById(id);

  if (!element) return;

  element.innerHTML = message;
  element.className = `message ${type}`;
}

function statusClass(status) {
  if (status === "Signed") return "status-good";
  if (status === "Pending") return "status-warn";
  return "status-bad";
}

function updateAccess() {
  const member = getLoggedInMember();

  document.body.classList.remove("logged-in", "admin", "manager");

  if (!member) return;

  document.body.classList.add("logged-in");

  if (isAthi(member)) {
    document.body.classList.add("admin");
  }

  if (member.role === "Manager") {
    document.body.classList.add("manager");
  }
}

function showPage(pageId) {
  const member = getLoggedInMember();
  const publicPages = ["home", "login"];

  if (!member && !publicPages.includes(pageId)) {
    pageId = "login";
    showMessage("loginMessage", "Please login first.", "error");
  }

  if (member && pageId === "signup" && !isAdmin()) {
    pageId = "dashboardPage";
    alert("Only Athi Ncokola can register people.");
  }

  document.querySelectorAll(".hero, .page-section").forEach(page => {
    page.classList.remove("active-page");
  });

  const selectedPage = document.getElementById(pageId);

  if (selectedPage) {
    selectedPage.classList.add("active-page");
  }

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.classList.remove("active");
  });

  const activeLink = document.querySelector(`a[href="#${pageId}"]`);

  if (activeLink) {
    activeLink.classList.add("active");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateDashboard() {
  updateAccess();

  const dashboard = document.getElementById("dashboard");
  const member = getLoggedInMember();

  if (!dashboard) return;

  if (!member) {
    dashboard.innerHTML = `
      <h3>No one logged in</h3>
      <p>Please login first.</p>
    `;
    return;
  }

  dashboard.innerHTML = `
    ${isAthi(member) ? `<span class="admin-badge">ADMIN ACCESS</span>` : ""}

    <h3>Welcome, ${member.name}</h3>
    <p><strong>Category:</strong> ${member.category}</p>
    <p><strong>Role:</strong> ${member.role}</p>
    <p><strong>Position:</strong> ${member.position}</p>
    <p><strong>Signing:</strong> ${member.signingStatus}</p>
    <p><strong>Next Match:</strong> ${member.availability}</p>

    ${
      isAthi(member)
        ? `<p><strong>Power:</strong> You can register players, staff, coaches, technicians and development players.</p>`
        : canManageMoney()
          ? `<p><strong>Power:</strong> You can manage the money page.</p>`
          : `<p><strong>Access:</strong> You can view the system. Only Athi can register people.</p>`
    }

    <button class="action-btn" onclick="logoutMember()">Logout</button>
  `;
}

function renderPlayers() {
  const table = document.getElementById("playersTable");
  if (!table) return;

  const players = getMembers().filter(member => member.category === "Player");

  table.innerHTML = players.length
    ? players.map((member, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${member.name}</td>
        <td>${member.position}</td>
        <td class="${member.availability === "Available" ? "status-good" : "status-bad"}">${member.availability}</td>
        <td class="${statusClass(member.signingStatus)}">${member.signingStatus}</td>
        <td>${member.joined}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="6">No players yet.</td></tr>`;
}

function renderDevelopment() {
  const table = document.getElementById("developmentTable");
  if (!table) return;

  const players = getMembers().filter(member => member.category === "Development Player");

  table.innerHTML = players.length
    ? players.map((member, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${member.name}</td>
        <td>${member.position}</td>
        <td class="${member.availability === "Available" ? "status-good" : "status-bad"}">${member.availability}</td>
        <td>${member.contractType}</td>
        <td class="${statusClass(member.signingStatus)}">${member.signingStatus}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="6">No development players yet.</td></tr>`;
}

function renderStaff() {
  const table = document.getElementById("staffTable");
  if (!table) return;

  const staff = getMembers().filter(member =>
    ["Coach", "Staff", "Technician"].includes(member.category)
  );

  table.innerHTML = staff.length
    ? staff.map((member, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${member.name}</td>
        <td>${member.position}</td>
        <td>${member.category}</td>
        <td>${member.phone}</td>
        <td class="${statusClass(member.signingStatus)}">${member.signingStatus}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="6">No staff yet.</td></tr>`;
}

function renderSignings() {
  const members = getMembers();

  const signedCount = document.getElementById("signedCount");
  const pendingCount = document.getElementById("pendingCount");
  const playerCount = document.getElementById("playerCount");
  const staffCount = document.getElementById("staffCount");
  const table = document.getElementById("signingsTable");

  if (signedCount) {
    signedCount.textContent = members.filter(member => member.signingStatus === "Signed").length;
  }

  if (pendingCount) {
    pendingCount.textContent = members.filter(member => member.signingStatus === "Pending").length;
  }

  if (playerCount) {
    playerCount.textContent = members.filter(member =>
      ["Player", "Development Player"].includes(member.category)
    ).length;
  }

  if (staffCount) {
    staffCount.textContent = members.filter(member =>
      ["Coach", "Staff", "Technician"].includes(member.category)
    ).length;
  }

  if (!table) return;

  table.innerHTML = members.map((member, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${member.name}</td>
      <td>${member.category}</td>
      <td>${member.position}</td>
      <td class="${statusClass(member.signingStatus)}">${member.signingStatus}</td>
      <td>${member.signedBy}</td>
    </tr>
  `).join("");
}

function renderContracts() {
  const table = document.getElementById("contractsTable");
  if (!table) return;

  const members = getMembers();

  table.innerHTML = members.map((member, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${member.name}</td>
      <td>${member.category}</td>
      <td>${member.contractType}</td>
      <td>${member.contractStart}</td>
      <td>${member.contractEnd}</td>
      <td class="${statusClass(member.signingStatus)}">${member.signingStatus}</td>
    </tr>
  `).join("");
}

function renderMoneyPage() {
  const financeLocked = document.getElementById("financeLocked");
  const financeContent = document.getElementById("financeContent");
  const moneyTable = document.getElementById("moneyTable");

  if (!financeLocked || !financeContent || !moneyTable) return;

  if (!canManageMoney()) {
    financeLocked.style.display = "block";
    financeContent.style.display = "none";
    return;
  }

  financeLocked.style.display = "none";
  financeContent.style.display = "block";

  const records = getMoneyRecords();

  const income = records
    .filter(record => record.type === "Income")
    .reduce((total, record) => total + Number(record.amount), 0);

  const expenses = records
    .filter(record => record.type === "Expense")
    .reduce((total, record) => total + Number(record.amount), 0);

  const balance = income - expenses;

  document.getElementById("moneyBalance").textContent = moneyFormat(balance);
  document.getElementById("moneyIncome").textContent = moneyFormat(income);
  document.getElementById("moneyExpenses").textContent = moneyFormat(expenses);
  document.getElementById("moneyTransactionsCount").textContent = records.length;

  if (records.length === 0) {
    moneyTable.innerHTML = `<tr><td colspan="8">No money records added yet.</td></tr>`;
    return;
  }

  moneyTable.innerHTML = records.map((record, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${record.date}</td>
      <td class="${record.type === "Income" ? "money-income" : "money-expense"}">${record.type}</td>
      <td>${moneyFormat(record.amount)}</td>
      <td>${record.source}</td>
      <td>${record.category}</td>
      <td>${record.note}</td>
      <td>${record.addedBy}</td>
    </tr>
  `).join("");
}

function renderAll() {
  updateAccess();
  updateDashboard();
  renderPlayers();
  renderDevelopment();
  renderStaff();
  renderSignings();
  renderContracts();
  renderMoneyPage();
}

function logoutMember() {
  localStorage.removeItem(SESSION_KEY);
  renderAll();
  showPage("home");
}

function setupNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function(event) {
      event.preventDefault();

      const pageId = this.getAttribute("href").replace("#", "");
      showPage(pageId);
    });
  });
}

function setupLogin() {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = normal(document.getElementById("loginEmail").value);
    const password = String(document.getElementById("loginPassword").value).trim();

    const member = getMembers().find(item =>
      normal(item.email) === username &&
      String(item.password).trim() === password
    );

    if (!member) {
      showMessage("loginMessage", "Wrong login details. Try again.", "error");
      return;
    }

    saveLoggedInMember(member);

    showMessage("loginMessage", `Login successful. Welcome <strong>${member.name}</strong>.`, "success");

    loginForm.reset();

    renderAll();
    showPage("dashboardPage");
  });
}

function setupRegister() {
  const signupForm = document.getElementById("signupForm");

  if (!signupForm) return;

  signupForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!isAdmin()) {
      showMessage("signupMessage", "Only Athi Ncokola can register people.", "error");
      return;
    }

    const name = document.getElementById("signupName").value.trim();
    const age = document.getElementById("signupAge").value.trim();
    const email = normal(document.getElementById("signupEmail").value);
    const phone = document.getElementById("signupPhone").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    const category = document.getElementById("signupCategory").value;
    const position = document.getElementById("signupPosition").value;
    const availability = document.getElementById("signupAvailability").value;
    const contractType = document.getElementById("signupContractType").value;
    const signingStatus = document.getElementById("signupSigningStatus").value;
    const contractStart = document.getElementById("signupContractStart").value;
    const contractEnd = document.getElementById("signupContractEnd").value;
    const guardianName = document.getElementById("signupGuardianName").value.trim();
    const guardianContact = document.getElementById("signupGuardianContact").value.trim();

    if (!name || !age || !email || !phone || !password || !category || !position || !availability || !contractType || !signingStatus || !contractStart || !contractEnd || !guardianName || !guardianContact) {
      showMessage("signupMessage", "Please fill in all fields.", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("signupMessage", "Password must be at least 6 characters.", "error");
      return;
    }

    if (contractEnd < contractStart) {
      showMessage("signupMessage", "Contract end date cannot be before start date.", "error");
      return;
    }

    const members = getMembers();

    const exists = members.some(member => normal(member.email) === email);

    if (exists) {
      showMessage("signupMessage", "This username/email already exists.", "error");
      return;
    }

    let role = category;

    if (position === "Manager") {
      role = "Manager";
    }

    const newMember = {
      name,
      age,
      phone,
      category,
      position,
      role,
      adminAccess: false,
      email,
      password,
      availability,
      contractType,
      signingStatus,
      signedBy: "Athi Ncokola",
      contractStart,
      contractEnd,
      guardianName,
      guardianContact,
      joined: todayDate()
    };

    members.push(newMember);
    saveMembers(members);

    signupForm.reset();

    showMessage(
      "signupMessage",
      `
        ✅ Successfully registered.<br>
        Name: <strong>${name}</strong><br>
        Category: <strong>${category}</strong><br>
        Position / Role: <strong>${position}</strong><br>
        This person can now login using:<br>
        Username: <strong>${email}</strong><br>
        Password: <strong>${password}</strong>
      `,
      "success"
    );

    renderAll();
  });
}

function setupMoneyForm() {
  const moneyForm = document.getElementById("moneyForm");

  if (!moneyForm) return;

  moneyForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!canManageMoney()) {
      showMessage("moneyMessage", "Only manager can add money records.", "error");
      return;
    }

    const type = document.getElementById("moneyType").value;
    const amount = Number(document.getElementById("moneyAmount").value);
    const source = document.getElementById("moneySource").value.trim();
    const category = document.getElementById("moneyCategory").value;
    const note = document.getElementById("moneyNote").value.trim();

    if (!type || !amount || !source || !category || !note) {
      showMessage("moneyMessage", "Please fill in all money fields.", "error");
      return;
    }

    if (amount <= 0) {
      showMessage("moneyMessage", "Amount must be more than R0.", "error");
      return;
    }

    const member = getLoggedInMember();

    const newRecord = {
      type,
      amount,
      source,
      category,
      note,
      addedBy: member ? member.name : "Unknown",
      date: todayDate()
    };

    const records = getMoneyRecords();
    records.unshift(newRecord);
    saveMoneyRecords(records);

    moneyForm.reset();

    showMessage(
      "moneyMessage",
      `
        ✅ Money record saved successfully.<br>
        Type: <strong>${type}</strong><br>
        Amount: <strong>${moneyFormat(amount)}</strong><br>
        ${type === "Income" ? "Money came from" : "Money went to"}:
        <strong>${source}</strong>
      `,
      "success"
    );

    renderMoneyPage();
  });
}

function startApp() {
  getMembers();
  updateAccess();
  setupNavigation();
  setupLogin();
  setupRegister();
  setupMoneyForm();
  renderAll();
  showPage("home");
}

document.addEventListener("DOMContentLoaded", startApp);