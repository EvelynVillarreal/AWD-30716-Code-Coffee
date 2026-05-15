class AppConfig {
  constructor() {
    this.apiBase = "https://american-latin-class-backend-production.up.railway.app";
    this.sessionKey = "alc-session";

    this.roleLabels = {
      teacher: "Teacher",
      student: "Student",
      director: "Director"
    };

    this.modulesByRole = {
      teacher: [
        { id: "moduleOverview", label: "Overview" },
        { id: "moduleClassPlan", label: "Planning" },
        { id: "moduleAttendance", label: "Manual attendance" }
      ],
      student: [
        { id: "moduleStudentProfile", label: "My profile" },
        { id: "moduleStudentAttendance", label: "My attendance" }
      ],
      director: [
        { id: "moduleOverview", label: "Overview" },
        { id: "moduleStudents", label: "Students" },
        { id: "moduleAttendance", label: "Manual attendance" },
        { id: "moduleFinance", label: "Finance" },
        { id: "moduleAgency", label: "Professional B2" }
      ]
    };
  }
}

class Dom {
  static setValue(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.value = value;
    }
  }

  static setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  }

  static showMessage(id, text) {
    const message = document.getElementById(id);

    if (!message) {
      return;
    }

    message.textContent = text;
    window.setTimeout(() => {
      message.textContent = "";
    }, 7000);
  }

  static escape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

class Formatters {
  static currency(value) {
    return `$${Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }

  static dateTime(value) {
    return new Date(value).toLocaleString("es-EC", {
      dateStyle: "short",
      timeStyle: "short"
    });
  }

  static digitsOnly(value) {
    return value.replace(/\D+/g, "");
  }
}

class SessionStore {
  constructor(storage, key) {
    this.storage = storage;
    this.key = key;
  }

  get() {
    const saved = this.storage.getItem(this.key);

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      return null;
    }
  }

  set(session) {
    this.storage.setItem(this.key, JSON.stringify(session));
  }

  clear() {
    this.storage.removeItem(this.key);
  }
}

class ApiClient {
  constructor(config, sessionStore) {
    this.config = config;
    this.sessionStore = sessionStore;
  }

  async request(path, options = {}) {
    const headers = {
      "Content-Type": "application/json"
    };

    if (options.auth !== false) {
      const session = this.sessionStore.get();

      if (session?.token) {
        headers.Authorization = `Bearer ${session.token}`;
      }
    }

    const response = await fetch(`${this.config.apiBase}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const payload = await this.parseJson(response);

    if (!response.ok) {
      if (response.status === 401) {
        this.sessionStore.clear();
      }

      throw new Error(payload.message || this.firstError(payload.errors) || "The request could not be completed.");
    }

    return payload;
  }

  async parseJson(response) {
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  firstError(errors) {
    if (!errors) {
      return "";
    }

    return Object.values(errors)[0] || "";
  }
}

class BranchStore {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.branches = [];
  }

  async load() {
    try {
      const payload = await this.apiClient.request("/api/branches", { auth: false });
      this.branches = payload.data || [];
    } catch (error) {
      this.branches = [
        { id: 1, name: "Matrix" },
        { id: 2, name: "North" },
        { id: 3, name: "Quitumbe" },
        { id: 4, name: "Conocoto" },
        { id: 5, name: "Tumbaco" }
      ];
    }
  }

  fillSelects() {
    document.querySelectorAll("#enrollBranch, #financeBranch").forEach((select) => {
      select.innerHTML = this.branches.map((branch) => (
        `<option value="${branch.id}">${Dom.escape(branch.name)}</option>`
      )).join("");
    });
  }

  name(branchId) {
    const branch = this.branches.find((item) => Number(item.id) === Number(branchId));
    return branch ? branch.name : "Pending";
  }
}

class DateDefaults {
  static apply() {
    const today = new Date().toISOString().slice(0, 10);
    const month = today.slice(0, 7);

    Dom.setValue("attendanceDate", today);
    Dom.setValue("eventDate", today);
    Dom.setValue("planMonth", month);
    Dom.setValue("studentAttendanceMonth", month);
  }
}

class PublicPagesController {
  constructor(apiClient, sessionStore, branchStore) {
    this.apiClient = apiClient;
    this.sessionStore = sessionStore;
    this.branchStore = branchStore;
  }

  init() {
    this.initEnrollmentPage();
    this.initLoginPage();
    this.initKioskPage();
  }

  initEnrollmentPage() {
    const form = document.getElementById("enrollmentForm");

    if (!form) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const payload = {
        branch_id: Number(document.getElementById("enrollBranch").value),
        national_id: Formatters.digitsOnly(document.getElementById("enrollNationalId").value),
        full_name: document.getElementById("enrollName").value.trim(),
        email: document.getElementById("enrollEmail").value.trim().toLowerCase(),
        phone: document.getElementById("enrollPhone").value.trim(),
        level: document.getElementById("enrollLevel").value,
        scholarship_percent: Number(document.getElementById("enrollScholarship").value),
        guardian_name: document.getElementById("enrollGuardian").value.trim(),
        guardian_phone: document.getElementById("enrollGuardianPhone").value.trim(),
        comments: document.getElementById("enrollNotes").value.trim()
      };

      try {
        await this.apiClient.request("/api/enrollments", {
          method: "POST",
          auth: false,
          body: payload
        });

        form.reset();
        this.branchStore.fillSelects();
        Dom.showMessage("enrollmentMessage", "Request submitted. The academy will review your information before activating the enrollment.");
      } catch (error) {
        Dom.showMessage("enrollmentMessage", error.message);
      }
    });
  }

  initLoginPage() {
    const form = document.getElementById("loginForm");

    if (!form) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        const payload = await this.apiClient.request("/api/auth/login", {
          method: "POST",
          auth: false,
          body: {
            email: document.getElementById("loginEmail").value.trim().toLowerCase(),
            password: document.getElementById("loginPassword").value
          }
        });

        this.sessionStore.set(payload);
        window.location.href = "dashboard.html";
      } catch (error) {
        Dom.showMessage("loginMessage", error.message);
      }
    });
  }

  initKioskPage() {
    const form = document.getElementById("kioskForm");

    if (!form) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        const payload = await this.apiClient.request("/api/kiosk/attendance", {
          method: "POST",
          auth: false,
          body: {
            national_id: Formatters.digitsOnly(document.getElementById("kioskNationalId").value)
          }
        });
        const name = payload.student?.name ? ` para ${payload.student.name}` : "";
        const hour = payload.data?.check_in_at ? ` Hora: ${Formatters.dateTime(payload.data.check_in_at)}.` : "";

        Dom.showMessage("kioskMessage", `${payload.message}${name}.${hour}`);
        form.reset();
      } catch (error) {
        Dom.showMessage("kioskMessage", error.message);
      }
    });
  }
}

class DashboardController {
  constructor(config, apiClient, sessionStore, branchStore) {
    this.config = config;
    this.apiClient = apiClient;
    this.sessionStore = sessionStore;
    this.branchStore = branchStore;
    this.currentUser = null;
    this.data = {
      students: [],
      financeReports: [],
      events: [],
      me: null,
      studentAttendance: [],
      studentAttendanceSummary: {}
    };
  }

  async init() {
    const shell = document.querySelector(".dashboard-shell");

    if (!shell) {
      return;
    }

    const session = this.sessionStore.get();

    if (!session?.token || !session?.user) {
      window.location.href = "login.html";
      return;
    }

    this.currentUser = session.user;
    this.renderSessionHeader();
    this.bindLogout();
    DateDefaults.apply();
    this.buildModuleNavigation();
    this.bindDashboardForms();

    try {
      await this.loadData();
      this.render();
    } catch (error) {
      this.showError(error.message);
    }
  }

  renderSessionHeader() {
    const label = this.config.roleLabels[this.currentUser.role] || "Internal portal";

    Dom.setText("sessionRole", label);
    Dom.setText("dashboardTitle", label);
    Dom.setText("sessionName", this.currentUser.name);
  }

  bindLogout() {
    document.getElementById("logoutButton").addEventListener("click", () => {
      this.sessionStore.clear();
      window.location.href = "login.html";
    });
  }

  async loadData() {
    this.data.me = await this.apiClient.request("/api/me");

    if (this.currentUser.role === "director") {
      const [studentsPayload, financePayload, eventsPayload] = await Promise.all([
        this.apiClient.request("/api/students"),
        this.apiClient.request("/api/branch-finance-reports"),
        this.apiClient.request("/api/professional-events")
      ]);
      this.data.students = studentsPayload.data || [];
      this.data.financeReports = financePayload.data || [];
      this.data.events = eventsPayload.data || [];
    }

    if (this.currentUser.role === "student") {
      const month = document.getElementById("studentAttendanceMonth").value;
      const attendancePayload = await this.apiClient.request(`/api/me/attendance?month=${encodeURIComponent(month)}`);
      this.data.studentAttendance = attendancePayload.data || [];
      this.data.studentAttendanceSummary = attendancePayload.summary || {};
    }
  }

  buildModuleNavigation() {
    const nav = document.getElementById("moduleNav");
    const modules = this.config.modulesByRole[this.currentUser.role] || [];

    nav.innerHTML = modules.map((module, index) => (
      `<button type="button" class="${index === 0 ? "active" : ""}" data-module-target="${module.id}">${Dom.escape(module.label)}</button>`
    )).join("");

    nav.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => this.activateModule(button.dataset.moduleTarget));
    });

    if (modules[0]) {
      this.activateModule(modules[0].id);
    }
  }

  activateModule(moduleId) {
    document.querySelectorAll(".module-view").forEach((view) => {
      view.hidden = view.id !== moduleId;
    });

    document.querySelectorAll("[data-module-target]").forEach((button) => {
      button.classList.toggle("active", button.dataset.moduleTarget === moduleId);
    });
  }

  render() {
    this.renderSnapshot();
    this.renderStudents();
    this.renderStudentProfile();
    this.renderStudentAttendance();
    this.renderFinance();
    this.renderSettlements();
  }

  renderSnapshot() {
    const students = this.data.students;
    const b2Count = students.filter((student) => student.level === "B2").length;
    const scholarshipCount = students.filter((student) => Number(student.scholarship_percent) > 0).length;
    const reserve = this.data.financeReports.reduce((total, report) => total + Number(report.matrix_share_amount || 0), 0);

    Dom.setText("totalStudents", students.length || (this.currentUser.role === "student" ? 1 : 0));
    Dom.setText("b2Students", b2Count);
    Dom.setText("scholarshipStudents", scholarshipCount);
    Dom.setText("reserveAmount", Formatters.currency(reserve));
  }

  renderStudents() {
    const table = document.getElementById("studentsTable");

    if (!table) {
      return;
    }

    table.innerHTML = this.data.students.map((student) => `
      <tr>
        <td>${Dom.escape(student.full_name)}</td>
        <td>${Dom.escape(student.branch?.name || this.branchStore.name(student.branch_id))}</td>
        <td><span class="badge level">${Dom.escape(student.level)}</span></td>
        <td>${Number(student.scholarship_percent || 0)}%</td>
        <td><span class="badge status">${Dom.escape(student.status)}</span></td>
      </tr>
    `).join("");
  }

  renderStudentProfile() {
    const container = document.getElementById("studentProfile");

    if (!container) {
      return;
    }

    const student = this.data.me?.student;
    const summary = this.data.me?.attendance_summary || {};

    if (!student) {
      container.innerHTML = `<article class="panel"><p>No student profile is linked to this account.</p></article>`;
      return;
    }

    container.innerHTML = `
      <article class="panel">
        <p class="eyebrow">Student</p>
        <h3>${Dom.escape(student.full_name)}</h3>
        <p>${Dom.escape(student.branch?.name || this.branchStore.name(student.branch_id))} | ${Dom.escape(student.level)} | Scholarship ${Number(student.scholarship_percent || 0)}%</p>
      </article>
      <article class="panel">
        <p class="eyebrow">Monthly attendance</p>
        <h3>${Number(summary.present || 0)} present</h3>
        <p>${Number(summary.total || 0)} records found</p>
      </article>
      <article class="panel">
        <p class="eyebrow">Status</p>
        <h3>${Dom.escape(student.status)}</h3>
        <p>Account linked to academic control</p>
      </article>
    `;
  }

  renderStudentAttendance() {
    const table = document.getElementById("studentAttendanceTable");

    if (!table) {
      return;
    }

    const summary = this.data.studentAttendanceSummary || {};
    Dom.setText("studentAttendanceTotal", Number(summary.total || 0));
    Dom.setText("studentAttendancePresent", Number(summary.present || 0));
    Dom.setText("studentAttendanceLate", Number(summary.late || 0));
    Dom.setText("studentAttendanceAbsent", Number(summary.absent || 0));

    if (this.data.studentAttendance.length === 0) {
      table.innerHTML = `<tr><td colspan="4">No records exist for this month.</td></tr>`;
      return;
    }

    table.innerHTML = this.data.studentAttendance.map((record) => `
      <tr>
        <td>${Dom.escape(record.attendance_date)}</td>
        <td>${Dom.escape(record.check_in_at ? Formatters.dateTime(record.check_in_at) : "Manual")}</td>
        <td><span class="badge status">${Dom.escape(record.status)}</span></td>
        <td>${Dom.escape(record.evidence_code)}</td>
      </tr>
    `).join("");
  }

  renderFinance() {
    const table = document.getElementById("financeTable");

    if (!table) {
      return;
    }

    table.innerHTML = this.data.financeReports.map((report) => `
      <tr>
        <td>${Dom.escape(this.branchStore.name(report.branch_id))}</td>
        <td>${Formatters.currency(report.income)}</td>
        <td>${Formatters.currency(report.expenses)}</td>
        <td>${Formatters.currency(report.matrix_share_amount)}</td>
        <td>${Formatters.currency(report.net_result)}</td>
      </tr>
    `).join("");
  }

  renderSettlements() {
    const list = document.getElementById("settlementList");

    if (!list) {
      return;
    }

    if (this.data.events.length === 0) {
      list.innerHTML = `<article class="summary-item"><span>No registered events.</span></article>`;
      return;
    }

    list.innerHTML = this.data.events.map((event) => `
      <article class="summary-item">
        <strong>${Dom.escape(event.client_name)}</strong>
        <span>${Dom.escape(event.event_type)} | ${Dom.escape(event.event_date)}</span>
        <span>Total: ${Formatters.currency(event.total_amount)}</span>
        <span>Status: ${Dom.escape(event.status)}</span>
      </article>
    `).join("");
  }

  bindDashboardForms() {
    this.bindClassPlanForm();
    this.bindAttendanceForm();
    this.bindFinanceForm();
    this.bindEventForm();
    this.bindStudentAttendanceMonth();
  }

  bindClassPlanForm() {
    const form = document.getElementById("classPlanForm");

    if (!form) {
      return;
    }

    Dom.setValue("planTeacher", this.currentUser.name);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        await this.apiClient.request("/api/class-plans", {
          method: "POST",
          body: {
            branch_id: this.currentUser.branch_id || 1,
            teacher_name: document.getElementById("planTeacher").value.trim(),
            month: document.getElementById("planMonth").value,
            level: document.getElementById("planLevel").value,
            objective: document.getElementById("planObjective").value.trim(),
            activities: document.getElementById("planActivities").value.trim()
          }
        });

        form.reset();
        DateDefaults.apply();
        Dom.setValue("planTeacher", this.currentUser.name);
        Dom.showMessage("planMessage", "Monthly plan submitted for review.");
      } catch (error) {
        Dom.showMessage("planMessage", error.message);
      }
    });
  }

  bindAttendanceForm() {
    const form = document.getElementById("attendanceForm");

    if (!form) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        const payload = await this.apiClient.request("/api/attendance-records", {
          method: "POST",
          body: {
            branch_id: this.currentUser.branch_id || 1,
            person_type: document.getElementById("attendanceType").value,
            person_name: document.getElementById("attendanceName").value.trim(),
            attendance_date: document.getElementById("attendanceDate").value,
            status: document.getElementById("attendanceStatus").value
          }
        });

        form.reset();
        DateDefaults.apply();
        Dom.showMessage("attendanceMessage", `Attendance saved: ${payload.data.evidence_code}.`);
      } catch (error) {
        Dom.showMessage("attendanceMessage", error.message);
      }
    });
  }

  bindFinanceForm() {
    const form = document.getElementById("financeForm");

    if (!form) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        await this.apiClient.request("/api/branch-finance-reports", {
          method: "POST",
          body: {
            branch_id: Number(document.getElementById("financeBranch").value),
            month: new Date().toISOString().slice(0, 7),
            income: Number(document.getElementById("financeIncome").value),
            expenses: Number(document.getElementById("financeExpenses").value),
            matrix_share_percent: Number(document.getElementById("financeShare").value)
          }
        });

        const financePayload = await this.apiClient.request("/api/branch-finance-reports");
        this.data.financeReports = financePayload.data || [];
        this.render();
      } catch (error) {
        window.alert(error.message);
      }
    });
  }

  bindEventForm() {
    const form = document.getElementById("eventForm");

    if (!form) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        const eventPayload = await this.apiClient.request("/api/professional-events", {
          method: "POST",
          body: {
            branch_id: this.currentUser.branch_id || 1,
            client_name: document.getElementById("eventClient").value.trim(),
            event_type: document.getElementById("eventType").value.trim(),
            event_date: document.getElementById("eventDate").value,
            total_amount: Number(document.getElementById("eventAmount").value),
            status: "paid"
          }
        });

        const dancer = this.findSelectedDancer();

        if (dancer) {
          await this.apiClient.request(`/api/professional-events/${eventPayload.data.id}/assignments`, {
            method: "POST",
            body: {
              student_id: dancer.id,
              gross_amount: Number(document.getElementById("eventAmount").value),
              deduction_amount: Number(document.getElementById("eventDeduction").value),
              payment_status: "paid"
            }
          });
        }

        form.reset();
        DateDefaults.apply();
        const eventsPayload = await this.apiClient.request("/api/professional-events");
        this.data.events = eventsPayload.data || [];
        this.render();
        Dom.showMessage("eventMessage", dancer ? "B2 event registered and assigned." : "Event registered. The dancer was not assigned because no active B2 match was found.");
      } catch (error) {
        Dom.showMessage("eventMessage", error.message);
      }
    });
  }

  findSelectedDancer() {
    const dancerName = document.getElementById("eventDancer").value.trim().toLowerCase();

    return this.data.students.find((student) => (
      student.level === "B2" && student.full_name.toLowerCase() === dancerName
    ));
  }

  bindStudentAttendanceMonth() {
    const input = document.getElementById("studentAttendanceMonth");

    if (!input) {
      return;
    }

    input.addEventListener("change", async () => {
      try {
        const payload = await this.apiClient.request(`/api/me/attendance?month=${encodeURIComponent(input.value)}`);
        this.data.studentAttendance = payload.data || [];
        this.data.studentAttendanceSummary = payload.summary || {};
        this.renderStudentAttendance();
      } catch (error) {
        this.showError(error.message);
      }
    });
  }

  showError(text) {
    const content = document.querySelector(".dashboard-content");

    if (content) {
      content.insertAdjacentHTML("afterbegin", `<p class="notice panel">${Dom.escape(text)}</p>`);
    }
  }
}

class AmericanLatinApp {
  constructor() {
    this.config = new AppConfig();
    this.sessionStore = new SessionStore(window.sessionStorage, this.config.sessionKey);
    this.apiClient = new ApiClient(this.config, this.sessionStore);
    this.branchStore = new BranchStore(this.apiClient);
    this.publicPages = new PublicPagesController(this.apiClient, this.sessionStore, this.branchStore);
    this.dashboard = new DashboardController(this.config, this.apiClient, this.sessionStore, this.branchStore);
  }

  async start() {
    await this.branchStore.load();
    this.branchStore.fillSelects();
    this.publicPages.init();
    await this.dashboard.init();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new AmericanLatinApp().start();
});
