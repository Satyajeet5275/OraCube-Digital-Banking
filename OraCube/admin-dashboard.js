let accountRequests = [];

let customers = []; // Will be populated from backend

let transactions=[];

// const transactions = [
//   {
//     id: 501,
//     customer: "Alice Cooper",
//     type: "deposit",
//     amount: 2000,
//     date: "2024-07-30",
//     time: "09:15",
//     status: "completed",
//     reference: "DEP001",
//   },
//   {
//     id: 502,
//     customer: "Bob Wilson",
//     type: "withdrawal",
//     amount: 500,
//     date: "2024-07-30",
//     time: "10:22",
//     status: "completed",
//     reference: "WTH002",
//   },
//   {
//     id: 503,
//     customer: "Diana Evans",
//     type: "transfer",
//     amount: 10000,
//     date: "2024-07-29",
//     time: "14:05",
//     status: "pending",
//     reference: "TRF003",
//   },
//   {
//     id: 504,
//     customer: "Frank Miller",
//     type: "deposit",
//     amount: 3500,
//     date: "2024-07-29",
//     time: "16:30",
//     status: "completed",
//     reference: "DEP004",
//   },
//   {
//     id: 505,
//     customer: "Charlie Davis",
//     type: "withdrawal",
//     amount: 200,
//     date: "2024-07-28",
//     time: "11:45",
//     status: "completed",
//     reference: "WTH005",
//   },
// ];

// Particle system for animated background
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 15 + "s";
    particle.style.animationDuration = Math.random() * 10 + 10 + "s";
    particlesContainer.appendChild(particle);
  }
}

// Loading screen management
function hideLoader() {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("hidden");

      // Make sure admin container is visible
      const adminContainer = document.querySelector(".admin-container");
      if (adminContainer) {
        adminContainer.style.opacity = "1";
        adminContainer.style.animation = "fadeInUp 1s ease-out forwards";
      }
    }
  }, 1500);
}

// Enhanced section switching with animations
function showSection(sectionId) {
  // Hide all sections first
  document.querySelectorAll(".content-section").forEach((sec) => {
    sec.classList.remove("active");
  });

  // Update nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Show selected section with animation
  setTimeout(() => {
    document.getElementById(sectionId).classList.add("active");
  }, 100);

  // Activate corresponding nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (
      link.getAttribute("onclick") &&
      link.getAttribute("onclick").includes(sectionId)
    ) {
      link.classList.add("active");
    }
  });

  // Add smooth scrolling to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Enhanced mobile sidebar toggle
function toggleMobileMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("mobile-open");

  // Add overlay for mobile
  if (sidebar.classList.contains("mobile-open")) {
    const overlay = document.createElement("div");
    overlay.className = "mobile-overlay";
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            backdrop-filter: blur(4px);
        `;
    overlay.onclick = () => {
      sidebar.classList.remove("mobile-open");
      overlay.remove();
    };
    document.body.appendChild(overlay);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Fetch total customers
  fetch("http://localhost:8080/admin/view/customers")
    .then((response) => response.json())
    .then((data) => {
      const totalCustomers = data.length;
      const customerCard = document.querySelectorAll(
        ".stat-card .stat-value"
      )[0];
      customerCard.textContent = totalCustomers.toLocaleString();
    })
    .catch((error) => console.error("Error fetching customers:", error));

  // Fetch pending account requests
  fetch("http://localhost:8080/admin/account-requests")
    .then((response) => response.json())
    .then((data) => {
      const pendingRequests = data.length;
      const requestCard = document.querySelectorAll(
        ".stat-card .stat-value"
      )[1];
      requestCard.textContent = pendingRequests.toLocaleString();
    })
    .catch((error) => console.error("Error fetching account requests:", error));
});

// Fetch account requests from backend and then render table
function fetchAndRenderAccountRequests() {
  fetch("http://localhost:8080/admin/account-requests")
    .then((res) => res.json())
    .then((data) => {
      // Normalize backend data to expected frontend format
      accountRequests = (data || []).map((req) => ({
        id: req.accountRequestID,
        name: [req.firstName, req.middleName, req.lastName]
          .filter(Boolean)
          .join(" "),
        email: req.email,
        accountType: req.accountType,
        submitted: req.applicationDate,
        initialDeposit: req.initialDeposit || 0,
        status: req.status || "pending", // Default to pending if not present
        documents: [], // You can map documents if available in backend
        riskLevel: req.riskLevel || "",
        // If you have riskLevel in backend
        // Keep all backend fields for modal/details
        ...req,
      }));
      renderRequestsTable();
      // Update pending badge if present
      const pendingCount = accountRequests.length;
      const badge = document.getElementById("pendingCountBadge");
      if (badge) badge.textContent = pendingCount;
      const pendingCountStat = document.getElementById("pendingCount");
      if (pendingCountStat) pendingCountStat.textContent = pendingCount;
    })
    .catch(() => {
      accountRequests = [];
      renderRequestsTable();
    });
}

// Enhanced render functions with animations
function renderRequestsTable() {
  const search = document.getElementById("requestSearch").value.toLowerCase();
  const status = document.getElementById("statusFilter").value;
  const type = document.getElementById("typeFilter").value;
  const tbody = document.getElementById("requestsTableBody");

  // Add loading animation
  tbody.innerHTML =
    '<tr><td colspan="6" style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--accent-primary);"></i><br><br>Loading requests...</td></tr>';

  setTimeout(() => {
    tbody.innerHTML = "";
    accountRequests
      .filter(
        (req) =>
          (req.name.toLowerCase().includes(search) ||
            req.email.toLowerCase().includes(search) ||
            (req.id && req.id.toString().includes(search))) &&
          (status === "" || (req.status && req.status === status)) &&
          (type === "" ||
            (req.accountType && req.accountType.toLowerCase().includes(type)))
      )
      .forEach((req, index) => {
        const statusClass =
          req.status === "pending"
            ? "status-pending"
            : req.status === "approved"
            ? "status-approved"
            : "status-rejected";

        const riskBadge =
          req.riskLevel === "high"
            ? '<span style="background: var(--error); color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; margin-left: 8px;">HIGH RISK</span>'
            : req.riskLevel === "medium"
            ? '<span style="background: var(--warning); color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; margin-left: 8px;">MEDIUM</span>'
            : "";

        // Determine action buttons based on status
        let actionButtons = "";
        if (req.status === "pending") {
          actionButtons = `
            <button class="action-btn" style="padding: 8px 12px; font-size: 12px;" onclick="viewRequestDetails(${req.id})">
                <i class="fas fa-eye"></i> View
            </button>
        `;
        }
        // No buttons for approved or rejected

        tbody.innerHTML += `
        <tr class="request-row" style="animation: slideInRow 0.5s ease-out ${
          index * 0.1
        }s both;">
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                        ${req.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                    </div>
                    <div>
                        <strong>${req.name}</strong>${riskBadge}<br>
                        <span style="color: var(--text-secondary); font-size: 12px;"><i class="fas fa-envelope" style="margin-right: 4px;"></i>${
                          req.email
                        }</span>
                    </div>
                </div>
            </td>
            <td>
                <span style="background: rgba(99, 102, 241, 0.1); color: var(--accent-primary); padding: 4px 8px; border-radius: 8px; font-size: 12px; font-weight: 600;">
                    ${req.accountType}
                </span>
            </td>
            <td>
                <i class="fas fa-calendar" style="margin-right: 6px; color: var(--text-muted);"></i>
                ${req.submitted}
            </td>
            <td><span class="status-badge ${statusClass}">${
          req.status
            ? req.status.charAt(0).toUpperCase() + req.status.slice(1)
            : "Pending"
        }</span></td>
            <td>
                <div class="action-buttons">
                    ${actionButtons}
                </div>
            </td>
        </tr>
    `;
      });

    if (tbody.innerHTML === "") {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-search" style="font-size: 24px; margin-bottom: 12px;"></i><br>No requests found matching your criteria.</td></tr>';
    }
  }, 300);
}

function updateRequestStatus(id, newStatus) {
  const req = accountRequests.find((r) => r.id === id);
  if (req) {
    // Add visual feedback
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.disabled = true;

    setTimeout(() => {
      req.status = newStatus;
      renderRequestsTable();

      // Show success notification
      showNotification(`Request ${newStatus} successfully!`, "success");
    }, 1000);
  }
}

// Fetch customers from backend and then render list
function fetchAndRenderCustomers() {
  fetch("http://localhost:8080/admin/view/customers")
    .then((res) => res.json())
    .then((data) => {
      customers = (data || []).map((cust) => ({
        id: cust.customerId,
        title: cust.title || "",
        firstName: cust.firstName || "",
        middleName: cust.middleName || "",
        lastName: cust.lastName || "",
        mobileNo: cust.mobileNo || "",
        email: cust.email || "",
        aadharNo: cust.aadharNo || "",
        panNo: cust.panNo || "",
        dob: cust.dob || "",
        residentialAddr: cust.residentialAddress || "",
        permAddr: cust.permanentAddress || "",
        occupation: cust.occupation || "",
        annualIncome: cust.annualIncome || 0,
        accountNumber: cust.accountNumber || "", // If available
        balance: cust.balance || 0, // If available
        status: cust.status || "active", // If available, else default
        lastActivity: cust.lastActivity || "", // If available
        // Keep all backend fields for modal/details
        ...cust,
      }));
      renderCustomersList();
    })
    .catch(() => {
      customers = [];
      renderCustomersList();
    });
}

// Enhanced render functions for customers (card/list style)
function renderCustomersList() {
  const search = document.getElementById("customerSearch").value.toLowerCase();
  const filter = document.getElementById("customerFilter").value;
  const list = document.getElementById("customersList");

  list.innerHTML =
    '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--accent-primary);"></i></div>';

  setTimeout(() => {
    list.innerHTML = "";
    customers
      .filter(
        (cust) =>
          (`${cust.firstName} ${cust.lastName}`
            .toLowerCase()
            .includes(search) ||
            cust.email.toLowerCase().includes(search) ||
            (cust.accountNumber && cust.accountNumber.includes(search))) &&
          (filter === "" || (cust.status && cust.status === filter))
      )
      .forEach((cust, index) => {
        const statusIcon =
          cust.status === "vip" ? "👑" : cust.status === "active" ? "🟢" : "🔴";
        list.innerHTML += `
                    <div class="transaction-item" style="animation: slideInRow 0.4s ease-out ${
                      index * 0.1
                    }s both;">
                        <div class="transaction-info">
                            <div class="transaction-avatar">${
                              cust.firstName[0] || ""
                            }${cust.lastName[0] || ""}</div>
                            <div class="transaction-details">
                                <h4>${cust.firstName} ${cust.lastName} ${
          cust.status === "vip"
            ? '<i class="fas fa-crown" style="color: #fbbf24; margin-left: 8px;"></i>'
            : ""
        }</h4>
                                <p>
                                    <i class="fas fa-envelope" style="margin-right: 4px;"></i>${
                                      cust.email
                                    }<br>
                                    <i class="fas fa-credit-card" style="margin-right: 4px;"></i>Account: ${
                                      cust.accountNumber || cust.customerId
                                    }
                                </p>
                            </div>
                        </div>
                        <div class="transaction-amount">
                            <div class="amount">₹${(
                              cust.balance || 0
                            ).toLocaleString()}</div>
                            <div class="transaction-time">
                                ${statusIcon} ${
          cust.status
            ? cust.status.charAt(0).toUpperCase() + cust.status.slice(1)
            : "Active"
        }<br>
                                <i class="fas fa-clock" style="margin-right: 4px;"></i>Last: ${
                                  cust.lastActivity || "-"
                                }
                            </div>
                        </div>
                    </div>
                `;
      });

    if (list.innerHTML === "") {
      list.innerHTML =
        '<div style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-users" style="font-size: 24px; margin-bottom: 12px;"></i><br>No customers found.</div>';
    }
  }, 300);
}

async function fetchTransactions() {
  try {
    const response = await fetch("http://localhost:8080/api/transactions/all");
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const data = await response.json();

    // Transform data for frontend rendering
    transactions = data.map((txn) => {
      return {
        id: txn.transactionId,
        reference: txn.remarks || "N/A",
        type:
          txn.transactionType === "CREDIT"
            ? "deposit"
            : txn.transactionType === "DEBIT"
            ? "withdrawal"
            : "transfer",
        amount: txn.amount,
        date: txn.transactionDate.split("T")[0],
        time: txn.transactionDate.split("T")[1].substring(0, 5),
        status: txn.status.toLowerCase(), // e.g. 'completed', 'pending'
      };
    });

    console.log("")

    // Trigger your UI renderers
    renderTransactionsList();
    renderRecentActivity();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    // alert("Unable to load transactions.");
  }
}

// Enhanced render functions for transactions (card/list style)
function renderTransactionsList() {
  const search = document
    .getElementById("transactionSearch")
    .value.toLowerCase();
  const type = document.getElementById("transactionTypeFilter").value;
  const date = document.getElementById("transactionDate").value;
  const list = document.getElementById("transactionsList");

  list.innerHTML =
    '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--accent-primary);"></i></div>';

  setTimeout(() => {
    list.innerHTML = "";
    transactions
      .filter(
        (tx) =>
          (tx.id.toString().includes(search) ||
            tx.reference.toLowerCase().includes(search)) &&
          (type === "" || tx.type === type) &&
          (date === "" || tx.date === date)
      )
      .forEach((tx, index) => {
        const typeIcon =
          tx.type === "deposit"
            ? "fas fa-arrow-down"
            : tx.type === "withdrawal"
            ? "fas fa-arrow-up"
            : "fas fa-exchange-alt";
        const typeColor =
          tx.type === "deposit"
            ? "var(--success)"
            : tx.type === "withdrawal"
            ? "var(--error)"
            : "var(--accent-primary)";

        list.innerHTML += `
                    <div class="transaction-item" style="animation: slideInRow 0.4s ease-out ${
                      index * 0.1
                    }s both;">
                        <div class="transaction-info">
                            <div class="transaction-details">
                                <h4>Transaction ID : ${tx.id}</h4>
                                <p>
                                    <i class="${typeIcon}" style="color: ${typeColor}; margin-right: 6px;"></i>
                                    ${
                                      tx.type.charAt(0).toUpperCase() +
                                      tx.type.slice(1)
                                    } • ${tx.reference}
                                </p>
                            </div>
                        </div>
                        <div class="transaction-amount">
                            <div class="amount" style="color: ${typeColor};">
                                ${
                                  tx.type === "withdrawal" ? "-" : "+"
                                }₹${tx.amount.toLocaleString()}
                            </div>
                            <div class="transaction-time">
                                <i class="fas fa-calendar" style="margin-right: 4px;"></i>${
                                  tx.date
                                } ${tx.time}<br>
                                <span style="color: ${
                                  tx.status === "completed"
                                    ? "var(--success)"
                                    : "var(--warning)"
                                };">
                                    <i class="fas fa-${
                                      tx.status === "completed"
                                        ? "check-circle"
                                        : "clock"
                                    }"></i> ${tx.status}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
      });

    if (list.innerHTML === "") {
      list.innerHTML =
        '<div style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-receipt" style="font-size: 24px; margin-bottom: 12px;"></i><br>No transactions found.</div>';
    }
  }, 300);
}

// Enhanced render recent activity with animations (card/list style)
function renderRecentActivity() {
  const container = document.getElementById("recentActivity");
  container.innerHTML =
    '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin" style="font-size: 20px; color: var(--accent-primary);"></i></div>';

  setTimeout(() => {
    container.innerHTML = transactions
      .slice(0, 5)
      .map((tx, index) => {
        const typeIcon =
          tx.type === "deposit"
            ? "fas fa-arrow-down"
            : tx.type === "withdrawal"
            ? "fas fa-arrow-up"
            : "fas fa-exchange-alt";
        const typeColor =
          tx.type === "deposit"
            ? "var(--success)"
            : tx.type === "withdrawal"
            ? "var(--error)"
            : "var(--accent-primary)";

        return `
                <div class="transaction-item" style="animation: slideInRow 0.4s ease-out ${
                  index * 0.15
                }s both;">
                    <div class="transaction-info">
                        <div class="transaction-details">
                            <h4>Transaction ID : ${tx.id}</h4>
                            <p>
                                <i class="${typeIcon}" style="color: ${typeColor}; margin-right: 6px;"></i>
                                ${
                                  tx.type.charAt(0).toUpperCase() +
                                  tx.type.slice(1)
                                } • ₹${tx.amount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div class="transaction-amount">
                        <div class="transaction-time">
                            <i class="fas fa-clock" style="margin-right: 4px;"></i>${
                              tx.date
                            } ${tx.time}
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  }, 400);
}

// Aadhaar validation (Verhoeff algorithm)
function validateAadhaar(aadhaarNumber) {
  // Check if input is 12 digits
  if (!/^\d{12}$/.test(aadhaarNumber)) {
    return false;
  }
  // Verhoeff algorithm tables
  const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];
  const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];
  const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];
  let c = 0;
  const reversed = aadhaarNumber.split("").reverse().map(Number);
  for (let i = 0; i < reversed.length; i++) {
    c = d[c][p[i % 8][reversed[i]]];
  }
  return c === 0;
}

// PAN validation
function validatePAN(panNumber) {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  return panRegex.test(panNumber);
}

// Utility: Validate email
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Utility: Validate mobile
function validateMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile);
}

// Utility: Validate date
function validateDate(date) {
  return !isNaN(Date.parse(date));
}

// Utility: Validate non-empty string
function validateNonEmpty(str) {
  return typeof str === "string" && str.trim().length > 0;
}

function validateInteger(value) {
  return Number.isInteger(value);
}

// Utility: Validate annual income
function validateIncome(val) {
  return typeof val === "number" && val > 0;
}

// Utility: Generate random password
function generateTempPassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$";
  let pwd = "";
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

// Show email modal (simulated email sending)
function showEmailModal(to, subject, body, from = "noreply@oracubebank.com") {
  let modal = document.getElementById("emailModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "emailModal";
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
        <div class="glass-modal-overlay"></div>
        <div class="glass-modal" style="max-width: 600px;">
            <div class="glass-modal-header">
                <h2><i class="fas fa-envelope"></i> Email Sent</h2>
                <button class="glass-modal-close" id="emailModalCloseBtn"><i class="fas fa-times"></i></button>
            </div>
            <div class="glass-modal-body" style="white-space:pre-line;">
                <div style="margin-bottom:16px;">
                    <strong>From:</strong> ${from}<br>
                    <strong>To:</strong> ${to}<br>
                    <strong>Subject:</strong> ${subject}
                </div>
                <div style="background:rgba(255,255,255,0.05);padding:18px 16px;border-radius:10px;">
                    ${body}
                </div>
            </div>
        </div>
    `;
  modal.style.display = "flex";
  modal.querySelector(".glass-modal-overlay").onclick = closeEmailModal;
  modal.querySelector("#emailModalCloseBtn").onclick = closeEmailModal;
  document.body.style.overflow = "hidden";
}
function closeEmailModal() {
  const modal = document.getElementById("emailModal");
  if (modal) modal.style.display = "none";
  document.body.style.overflow = "";
}

// Show request details modal
function viewRequestDetails(id) {
  const req = accountRequests.find((r) => r.id === id);
  if (!req) return;

  // Use live values from backend for modal details
  const details = {
    requestId: req.accountRequestID || req.requestId || "REQ" + id,
    title: req.title || "",
    firstName: req.firstName || "",
    middleName: req.middleName || "",
    lastName: req.lastName || "",
    mobileNo: req.mobileNo || "",
    email: req.email || "",
    aadharNo: req.aadharNo || "",
    panNo: req.panNo || "",
    dob: req.dob || "",
    residentialAddr: req.residentialAddress || req.residentialAddr || "",
    permAddr: req.permanentAddress || req.permAddr || "",
    occupation: req.occupation || "",
    annualIncome: req.annualIncome || 0,
    accType: req.accountType || req.accType || "",
    applnDate: req.applicationDate || req.applnDate || req.submitted || "",
  };

  // Validation status for each field (except Aadhaar/PAN, which are only shown after verify)
  const validations = {
    requestId: validateInteger(details.requestId),
    title: validateNonEmpty(details.title),
    firstName: validateNonEmpty(details.firstName),
    middleName: details.middleName
      ? validateNonEmpty(details.middleName)
      : null,
    lastName: validateNonEmpty(details.lastName),
    mobileNo: validateMobile(details.mobileNo),
    email: validateEmail(details.email),
    aadharNo: null, // Only show after verify
    panNo: null, // Only show after verify
    dob: validateDate(details.dob),
    residentialAddr: validateNonEmpty(details.residentialAddr),
    permAddr: validateNonEmpty(details.permAddr),
    occupation: validateNonEmpty(details.occupation),
    annualIncome: validateIncome(details.annualIncome),
    accType: validateNonEmpty(details.accType),
    applnDate: validateDate(details.applnDate),
  };

  let modal = document.getElementById("requestDetailsModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "requestDetailsModal";
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
        <div class="glass-modal-overlay"></div>
        <div class="glass-modal">
            <div class="glass-modal-header">
                <h2><i class="fas fa-user-circle"></i> Application Details</h2>
                <button class="glass-modal-close" id="modalCloseBtn"><i class="fas fa-times"></i></button>
            </div>
            <div class="glass-modal-body">
                <div class="glass-modal-fields">
                    <div class="modal-field"><span>Request ID:</span> ${
                      details.requestId
                    } ${
    validations.requestId === true
      ? '<i class="fas fa-check-circle valid"></i>'
      : '<i class="fas fa-times-circle invalid"></i>'
  }</div>
                    <div class="modal-field"><span>Title:</span> ${
                      details.title
                    } ${
    validations.title === true
      ? '<i class="fas fa-check-circle valid"></i>'
      : '<i class="fas fa-times-circle invalid"></i>'
  }</div>
                    <div class="modal-field"><span>First Name:</span> ${
                      details.firstName
                    } ${
    validations.firstName === true
      ? '<i class="fas fa-check-circle valid"></i>'
      : '<i class="fas fa-times-circle invalid"></i>'
  }</div>
                    <div class="modal-field"><span>Middle Name:</span> ${
                      details.middleName
                        ? validations.middleName === true
                          ? '<i class="fas fa-check-circle valid"></i>'
                          : '<i class="fas fa-times-circle invalid"></i>'
                        : ""
                    }</div>
                    <div class="modal-field"><span>Last Name:</span> ${
                      details.lastName
                    } ${
    validations.lastName === true
      ? '<i class="fas fa-check-circle valid"></i>'
      : '<i class="fas fa-times-circle invalid"></i>'
  }</div>
                    <div class="modal-field"><span>Mobile No:</span> ${
                      details.mobileNo
                    } ${
    validations.mobileNo === true
      ? '<i class="fas fa-check-circle valid"></i>'
      : '<i class="fas fa-times-circle invalid"></i>'
  }</div>
                    <div class="modal-field"><span>Email:</span> ${
                      details.email
                    } ${
    validations.email === true
      ? '<i class="fas fa-check-circle valid"></i>'
      : '<i class="fas fa-times-circle invalid"></i>'
  }</div>
                    <div class="modal-field">
                        <span>Aadhaar No:</span> 
                        <span id="aadhaarValue">${details.aadharNo}</span>
                        <button class="verify-btn" onclick="verifyAadhaar('${
                          details.aadharNo
                        }')">Verify</button>
                        <span id="aadhaarStatus"></span>
                    </div>
                    <div class="modal-field">
                        <span>PAN No:</span> 
                        <span id="panValue">${details.panNo}</span>
                        <button class="verify-btn" onclick="verifyPAN('${
                          details.panNo
                        }')">Verify</button>
                        <span id="panStatus"></span>
                    </div>
                    <div class="modal-field"><span>Date of Birth:</span> ${
                      details.dob
                    } ${
    validations.dob === true
      ? '<i class="fas fa-check-circle valid"></i>'
      : '<i class="fas fa-times-circle invalid"></i>'
  }</div>
                    <div class="modal-field"><span>Residential Address:</span> ${
                      details.residentialAddr
                    } ${
    validations.residentialAddr === true
      ? '<i class="fas fa-check-circle valid"></i>'
      : '<i class="fas fa-times-circle invalid"></i>'
  }</div>
                    <div class="modal-field"><span>Permanent Address:</span> ${
                      details.permAddr
                    } ${
    validations.permAddr === true
      ? '<i class="fas fa-check-circle valid"></i>'
      : '<i class="fas fa-times-circle invalid"></i>'
  }</div>
                    <div class="modal-field"><span>Occupation:</span> ${
                      details.occupation
                    } ${
    validations.occupation === true
      ? '<i class="fas fa-check-circle valid"></i>'
      : '<i class="fas fa-times-circle invalid"></i>'
  }</div>
                    <div class="modal-field"><span>Annual Income:</span> ₹${Number(
                      details.annualIncome
                    ).toLocaleString()} ${
    validations.annualIncome === true
      ? '<i class="fas fa-check-circle valid"></i>'
      : '<i class="fas fa-times-circle invalid"></i>'
  }</div>
                    <div class="modal-field"><span>Account Type:</span> ${
                      details.accType
                    } ${
    validations.accType === true
      ? '<i class="fas fa-check-circle valid"></i>'
      : '<i class="fas fa-times-circle invalid"></i>'
  }</div>
                    <div class="modal-field"><span>Application Date:</span> ${
                      details.applnDate
                    } ${
    validations.applnDate === true
      ? '<i class="fas fa-check-circle valid"></i>'
      : '<i class="fas fa-times-circle invalid"></i>'
  }</div>
                </div>
                <div class="glass-modal-actions">
                    <button class="approve-btn" id="approveBtn"><i class="fas fa-check"></i> Approve Request</button>
                    <button class="reject-btn" id="rejectBtn"><i class="fas fa-times"></i> Reject Request</button>
                    <button class="print-btn" id="printBtn"><i class="fas fa-print"></i> Print PDF</button>
                </div>
                <div class="glass-modal-remark">
                    <label for="remarkInput"><i class="fas fa-comment-dots"></i> Add Remark: <span style="color:var(--error);">*</span></label>
                    <textarea id="remarkInput" placeholder="Add your remark here..." rows="2" required></textarea>
                    <div id="remarkError" style="color:var(--error);font-size:13px;display:none;">Remark is required.</div>
                </div>
            </div>
        </div>
    `;
  modal.style.display = "flex";

  // Add glassy modal styles if not already present
  if (!document.getElementById("glassModalStyles")) {
    const style = document.createElement("style");
    style.id = "glassModalStyles";
    style.textContent = `
            .glass-modal-overlay {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(10,14,26,0.7);
                backdrop-filter: blur(8px);
                z-index: 10001;
            }
            .glass-modal {
                position: fixed;
                top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255,255,255,0.08);
                border-radius: 24px;
                box-shadow: 0 16px 64px rgba(0,0,0,0.5);
                border: 1.5px solid rgba(255,255,255,0.12);
                min-width: 420px;
                max-width: 96vw;
                width: 540px;
                z-index: 10002;
                padding: 0;
                animation: fadeIn 0.4s cubic-bezier(0.4,0,0.2,1);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .glass-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 28px 32px 16px 32px;
                background: rgba(255,255,255,0.04);
                border-bottom: 1px solid rgba(255,255,255,0.08);
            }
            .glass-modal-header h2 {
                font-size: 22px;
                font-weight: 800;
                color: var(--text-primary);
                background: linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .glass-modal-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 22px;
                cursor: pointer;
                transition: color 0.2s;
            }
            .glass-modal-close:hover { color: var(--accent-primary); }
            .glass-modal-body {
                padding: 24px 32px 32px 32px;
                background: transparent;
                overflow-y: auto;
                max-height: 70vh;
            }
            .glass-modal-fields {
                display: flex;
                flex-direction: column;
                gap: 14px;
                margin-bottom: 24px;
            }
            .modal-field {
                font-size: 15px;
                color: var(--text-primary);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .modal-field span:first-child {
                min-width: 160px;
                color: var(--text-secondary);
                font-weight: 600;
            }
            .valid {
                color: var(--success);
                margin-left: 4px;
            }
            .invalid {
                color: var(--error);
                margin-left: 4px;
            }
            .verify-btn {
                margin-left: 8px;
                padding: 4px 12px;
                border-radius: 8px;
                border: none;
                background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                color: #fff;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
            }
            .verify-btn:hover {
                background: linear-gradient(135deg, var(--success), #34d399);
            }
            .glass-modal-actions {
                display: flex;
                gap: 16px;
                margin-bottom: 18px;
            }
            .print-btn {
                background: linear-gradient(135deg, #6366f1, #a21caf);
                color: #fff;
                border: none;
                border-radius: 10px;
                padding: 10px 18px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
            }
            .print-btn:hover {
                background: linear-gradient(135deg, #a21caf, #6366f1);
            }
            .glass-modal-remark {
                margin-top: 10px;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .glass-modal-remark label {
                color: var(--text-secondary);
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 2px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            #remarkInput {
                width: 100%;
                border-radius: 10px;
                border: 1px solid var(--border);
                background: rgba(255,255,255,0.04);
                color: var(--text-primary);
                font-size: 14px;
                padding: 10px 14px;
                resize: vertical;
                min-height: 36px;
                max-height: 100px;
                outline: none;
                transition: border 0.2s;
            }
            #remarkInput:focus {
                border: 1.5px solid var(--accent-primary);
            }
            @media (max-width: 600px) {
                .glass-modal { min-width: 90vw; width: 98vw; padding: 0; }
                .glass-modal-header, .glass-modal-body { padding: 18px 10px; }
                .modal-field span:first-child { min-width: 90px; }
            }
        `;
    document.head.appendChild(style);
  }

  // Modal close on overlay click and X button
  modal.querySelector(".glass-modal-overlay").onclick =
    closeRequestDetailsModal;
  modal.querySelector("#modalCloseBtn").onclick = closeRequestDetailsModal;

  // Prevent background scroll
  document.body.style.overflow = "hidden";

  // Approve/Reject/Print button logic
  modal.querySelector("#approveBtn").onclick = function () {
    handleRequestAction(id, "approved");
  };
  modal.querySelector("#rejectBtn").onclick = function () {
    handleRequestAction(id, "rejected");
  };
  modal.querySelector("#printBtn").onclick = function () {
    printRequestDetails();
  };
}

// Modal close function
function closeRequestDetailsModal() {
  const modal = document.getElementById("requestDetailsModal");
  if (modal) modal.style.display = "none";
  document.body.style.overflow = "";
}

// Aadhaar verify button logic
window.verifyAadhaar = function (aadhaarNo) {
  const status = document.getElementById("aadhaarStatus");
  if (!status) return;
  if (validateAadhaar(aadhaarNo)) {
    status.innerHTML = '<i class="fas fa-check-circle valid"></i>';
    showNotification("Aadhaar verified successfully!", "success");
  } else {
    status.innerHTML = '<i class="fas fa-times-circle invalid"></i>';
    showNotification("Invalid Aadhaar number.", "error");
  }
};

// PAN verify button logic
window.verifyPAN = function (panNo) {
  const status = document.getElementById("panStatus");
  if (!status) return;
  if (validatePAN(panNo)) {
    status.innerHTML = '<i class="fas fa-check-circle valid"></i>';
    showNotification("PAN verified successfully!", "success");
  } else {
    status.innerHTML = '<i class="fas fa-times-circle invalid"></i>';
    showNotification("Invalid PAN number.", "error");
  }
};

// Print PDF logic (simple print for now)
window.printRequestDetails = function () {
  const modal = document.getElementById("requestDetailsModal");
  if (!modal) return;
  const printContents = modal.querySelector(".glass-modal-body").innerHTML;
  const win = window.open("", "", "width=800,height=600");
  win.document.write(`
        <html>
        <head>
            <title>Application PDF</title>
            <style>
                body { font-family: 'Inter', sans-serif; color: #222; padding: 24px; }
                .modal-field { margin-bottom: 10px; font-size: 15px; }
                .modal-field span:first-child { font-weight: bold; min-width: 120px; display: inline-block; }
            </style>
        </head>
        <body>
            <h2>Account Opening Application</h2>
            ${printContents}
        </body>
        </html>
    `);
  win.document.close();
  win.print();
  setTimeout(() => win.close(), 1000);
};

async function handleRequestAction(id, newStatus) {
  const remarkInput = document.getElementById("remarkInput");
  const remarkError = document.getElementById("remarkError");

  if (!remarkInput.value.trim()) {
    remarkError.style.display = "block";
    remarkInput.focus();
    return;
  }
  remarkError.style.display = "none";

  const approveBtn = document.getElementById("approveBtn");
  const rejectBtn = document.getElementById("rejectBtn");
  if (approveBtn) approveBtn.disabled = true;
  if (rejectBtn) rejectBtn.disabled = true;

  try {
    const response = await fetch(
      `http://localhost:8080/admin/account-requests/process/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          remark: remarkInput.value.trim(),
        }),
      }
    );

    if (!response.ok) {
      const errorMsg = await response.text();
      showNotification(errorMsg || "Failed to process request.", "error");
      return;
    }

    // Update local UI status
    const req = accountRequests.find((r) => r.id === id);
    if (req) req.status = newStatus;

    renderRequestsTable();
    closeRequestDetailsModal();
    showNotification(
      `Request ${
        newStatus === "approved" ? "approved" : "rejected"
      } successfully!`,
      newStatus === "approved" ? "success" : "error"
    );
    const dbService = new DatabaseService1();

    if (newStatus === "approved") {
      // ✅ Fetch all customers and accounts
      const [customersRes, accountsRes] = await Promise.all([
        fetch("http://localhost:8080/admin/view/customers"),
        fetch("http://localhost:8080/admin/view/accounts"),
      ]);

      const customers = await customersRes.json();
      const accounts = await accountsRes.json();

      // 🔍 Match customer based on aadharNo
      const matchedCustomer = customers.find(
        (c) => c.aadharNo === req.aadharNo
      );

      if (!matchedCustomer) {
        showNotification("Customer not found for email sending.", "error");
        return;
      }

      // 🔍 Match account based on customer ID
      const matchedAccount = accounts.find(
        (acc) => acc.customerId === matchedCustomer.customerId
      );

      if (!matchedAccount) {
        showNotification("Account not found for email sending.", "error");
        return;
      }

      // 📧 Send approval email with login and transaction password
      await dbService.sendMail(
        matchedCustomer.email,
        matchedCustomer.customerId,
        matchedCustomer.loginPassword,
        true, // approved
        "", // no rejection remark
        matchedAccount.transactionPassword // include txn password
      );
    } else if (newStatus === "rejected") {
      // 📧 Send rejection email
      await dbService.sendMail(
        req.email,
        "", // No ID
        "", // No login password
        false, // rejected
        remarkInput.value.trim(), // rejection reason
        "" // No txn password
      );
    }
  } catch (err) {
    console.error(err);
    showNotification("Unable to connect to server. Please try again.", "error");
  } finally {
    if (approveBtn) approveBtn.disabled = false;
    if (rejectBtn) rejectBtn.disabled = false;
  }
}

// Show notification
function showNotification(message, type = "info") {
  // Remove existing notifications
  document.querySelectorAll(".notification").forEach((n) => n.remove());

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  const icon =
    type === "success"
      ? "check-circle"
      : type === "error"
      ? "exclamation-circle"
      : "info-circle";

  notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${
          type === "success"
            ? "var(--success)"
            : type === "error"
            ? "var(--error)"
            : "var(--accent-primary)"
        };
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10002;
        transform: translateX(100%);
        animation: slideInRight 0.3s ease-out forwards;
    `;

  document.body.appendChild(notification);

  // Auto remove
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-out forwards";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);

  // Add notification animations
  if (!document.querySelector("#notification-style")) {
    const style = document.createElement("style");
    style.id = "notification-style";
    style.innerHTML = `
            @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); }
                to { transform: translateX(100%); }
            }
        `;
    document.head.appendChild(style);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:8080/admin/view/accounts")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data)) return;

      const accountTypeCounts = { SAVINGS: 0, CURRENT: 0 };
      const dateCounts = {};

      data.forEach((acc) => {
        // Count by account type
        if (acc.accountType in accountTypeCounts) {
          accountTypeCounts[acc.accountType]++;
        }

        // Count by date
        const date = acc.applicationDate;
        if (!dateCounts[date]) {
          dateCounts[date] = 1;
        } else {
          dateCounts[date]++;
        }
      });

      // PIE CHART - Account Types
      const ctx1 = document.getElementById("accountTypeChart").getContext("2d");
      new Chart(ctx1, {
        type: "pie",
        data: {
          labels: Object.keys(accountTypeCounts),
          datasets: [
            {
              data: Object.values(accountTypeCounts),
              backgroundColor: ["#4e73df", "#1cc88a"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Current vs Savings Accounts",
              color: "#ffffff",
              font: {
                family:
                  "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                size: 18,
              },
            },
            legend: {
              labels: {
                color: "#ffffff",
                font: {
                  family:
                    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                },
              },
            },
          },
        },
      });

      // BAR CHART - Daily Openings
      const sortedDates = Object.keys(dateCounts).sort(); // Ascending by date
      const ctx2 = document
        .getElementById("dailyOpeningsChart")
        .getContext("2d");
      new Chart(ctx2, {
        type: "bar",
        data: {
          labels: sortedDates,
          datasets: [
            {
              label: "Accounts Opened",
              data: sortedDates.map((d) => dateCounts[d]),
              backgroundColor: "#36b9cc",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Daily Account Openings",
              color: "#ffffff",
              font: {
                family:
                  "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                size: 18,
              },
            },
            legend: {
              labels: {
                color: "#ffffff",
                font: {
                  family:
                    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: "#ffffff",
                font: {
                  family:
                    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                },
              },
              title: {
                display: true,
                text: "Date",
                color: "#ffffff",
                font: {
                  family:
                    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                },
              },
            },
            y: {
              ticks: {
                color: "#ffffff",
                font: {
                  family:
                    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                },
              },
              title: {
                display: true,
                text: "Number of Accounts",
                color: "#ffffff",
                font: {
                  family:
                    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                },
              },
            },
          },
        },
      });
    })
    .catch((err) => {
      console.error("Failed to load account data:", err);
    });
});

// Logout functionality
function handleAdminLogout() {
  // Optionally clear any stored tokens or session data here
  // localStorage.removeItem('admin_jwt');
  // Redirect to login page
    sessionStorage.removeItem("isAdminLoggedIn");
    console.log("Login Status (after logout):", sessionStorage.getItem("isAdminLoggedIn"));
    window.location.href = "admin-login.html";
}

// Initial render and event listeners
window.addEventListener("DOMContentLoaded", () => {
  createParticles();
  hideLoader();
  fetchAndRenderAccountRequests();

  // Requests table filters
  document
    .getElementById("requestSearch")
    .addEventListener("input", renderRequestsTable);
  document
    .getElementById("statusFilter")
    .addEventListener("change", renderRequestsTable);
  document
    .getElementById("typeFilter")
    .addEventListener("change", renderRequestsTable);

  // Enhanced animated list/card rendering for dashboard, customers, and transactions
  if (document.getElementById("recentActivity")) renderRecentActivity();
  if (document.getElementById("customersList")) {
    fetchAndRenderCustomers();
    document
      .getElementById("customerSearch")
      .addEventListener("input", renderCustomersList);
    document
      .getElementById("customerFilter")
      .addEventListener("change", renderCustomersList);
  }
  if (document.getElementById("transactionsList")) {
    fetchTransactions();
    document
      .getElementById("transactionSearch")
      .addEventListener("input", renderTransactionsList);
    document
      .getElementById("transactionTypeFilter")
      .addEventListener("change", renderTransactionsList);
    document
      .getElementById("transactionDate")
      .addEventListener("change", renderTransactionsList);
  }

  // Add logout button event listener
  const logoutBtn = document.querySelector(
    ".admin-actions .action-btn i.fa-sign-out-alt"
  )?.parentElement;
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleAdminLogout);
  }
});



// Expose functions for HTML onclick
window.showSection = showSection;
window.toggleMobileMenu = toggleMobileMenu;
window.viewRequestDetails = viewRequestDetails;
window.updateRequestStatus = updateRequestStatus;
