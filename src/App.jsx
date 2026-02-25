import { useState, useEffect, createContext, useContext } from "react";
import "./App.css";
import NetflixIntro from "./NetflixIntro";
import { getAllUsers, createUserCredential, verifyUserCredential, updateUserCredentialPassword } from "./modules/credentialsStore";


const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const RESOURCES = [
  { id: 1, title: "National DV Helpline", category: "emergency", description: "24/7 confidential support. Call or text anytime.", contact: "1800-123-4567", icon: "📞" },
  { id: 2, title: "Legal Aid Society", category: "legal", description: "Free legal assistance for survivors of domestic violence.", contact: "1800-987-6543", icon: "⚖️" },
  { id: 3, title: "Shelter Network", category: "shelter", description: "Safe emergency housing across all districts.", contact: "1800-543-2109", icon: "🏠" },
  { id: 4, title: "Mental Health Support", category: "health", description: "Trauma-informed counselling and therapy services.", contact: "1800-111-2222", icon: "🧠" },
  { id: 5, title: "Women's Crisis Centre", category: "emergency", description: "Immediate crisis intervention and safety planning.", contact: "1800-333-4444", icon: "🛡️" },
  { id: 6, title: "Child Protection Unit", category: "children", description: "Specialized support for children affected by DV.", contact: "1800-555-6666", icon: "👶" },
];

const LEGAL_RIGHTS = [
  { title: "Protection Orders", desc: "You have the right to file for a restraining order or protection order against your abuser.", icon: "🔒" },
  { title: "Right to Safety", desc: "Law enforcement must respond to DV calls. You can request immediate police assistance.", icon: "🚔" },
  { title: "Housing Rights", desc: "You cannot be evicted solely due to DV incidents. Emergency housing assistance is available.", icon: "🏛️" },
  { title: "Child Custody", desc: "Courts consider DV history in custody decisions. Your children's safety is prioritized.", icon: "👨‍👩‍👧" },
  { title: "Financial Support", desc: "You may be entitled to alimony, child support, and access to shared financial assets.", icon: "💰" },
  { title: "Employment Protection", desc: "Employers cannot terminate you for absences related to DV situations.", icon: "💼" },
];

const COUNSELLOR_SESSIONS = [
  { id: 1, survivor: "Sarah M.", date: "2026-02-24", time: "10:00 AM", status: "scheduled", notes: "" },
  { id: 2, survivor: "Anita K.", date: "2026-02-23", time: "2:00 PM", status: "completed", notes: "Progress noted in safety planning." },
  { id: 3, survivor: "Preethi R.", date: "2026-02-25", time: "11:30 AM", status: "scheduled", notes: "" },
];

const SESSIONS_STORAGE_KEY = "safehaven.counsellorSessions.v1";

const getStoredSessions = () => {
  const raw = window.localStorage.getItem(SESSIONS_STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(COUNSELLOR_SESSIONS));
    return COUNSELLOR_SESSIONS;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : COUNSELLOR_SESSIONS;
  } catch {
    window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(COUNSELLOR_SESSIONS));
    return COUNSELLOR_SESSIONS;
  }
};

const saveStoredSessions = (sessions) => {
  window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
};

const CASES_STORAGE_KEY = "safehaven.filedCases.v1";
const SEEDED_CASES = [
  {
    id: "case-2041",
    survivorName: "Anonymous A.",
    reportedBy: "survivor_a",
    type: "Protection Order",
    title: "Immediate safety concern at home",
    description: "Repeated threats at residence and fear of escalation.",
    priority: "urgent",
    status: "open",
    createdAt: "2026-02-24T08:20:00.000Z",
  },
  {
    id: "case-2033",
    survivorName: "Anonymous C.",
    reportedBy: "survivor_c",
    type: "Child Custody",
    title: "Need legal support for child custody",
    description: "Requesting guidance before custody hearing this week.",
    priority: "normal",
    status: "open",
    createdAt: "2026-02-23T14:10:00.000Z",
  },
  {
    id: "case-1987",
    survivorName: "Anonymous B.",
    reportedBy: "survivor_b",
    type: "Divorce Proceedings",
    title: "Assistance needed for legal separation",
    description: "Seeking legal documentation support for filing.",
    priority: "normal",
    status: "in-review",
    createdAt: "2026-02-22T11:35:00.000Z",
  },
];

const getStoredCases = () => {
  const raw = window.localStorage.getItem(CASES_STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(SEEDED_CASES));
    return SEEDED_CASES;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEEDED_CASES;
  } catch {
    window.localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(SEEDED_CASES));
    return SEEDED_CASES;
  }
};

const saveStoredCases = (cases) => {
  window.localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
};

const createCaseRecord = ({ user, type, title, description, priority }) => {
  const cases = getStoredCases();
  const newCase = {
    id: `case-${Date.now()}`,
    survivorName: user?.name || "Anonymous",
    reportedBy: user?.username || "anonymous",
    type,
    title,
    description,
    priority,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  const updatedCases = [newCase, ...cases];
  saveStoredCases(updatedCases);
  return newCase;
};



const ROLE_CONFIG = {
  admin: { label: "Admin", icon: "🔧", color: "#8a6000", nav: ["dashboard","users","resources","reports","settings"] },
  survivor: { label: "Survivor", icon: "🌸", color: "#7a3d35", nav: ["dashboard","resources","legal","chat","safety"] },
  counsellor: { label: "Counsellor", icon: "💙", color: "#1a5f7a", nav: ["dashboard","sessions","clients","resources","notes"] },
  legal: { label: "Legal Advisor", icon: "⚖️", color: "#5a2d7a", nav: ["dashboard","cases","rights","resources","docs"] },
};

const NAV_LABELS = {
  dashboard: { label: "Dashboard", icon: "⊞" },
  users: { label: "User Management", icon: "👥" },
  resources: { label: "Resources", icon: "📚" },
  reports: { label: "Reports", icon: "📊" },
  settings: { label: "Settings", icon: "⚙️" },
  legal: { label: "Legal Rights", icon: "⚖️" },
  chat: { label: "Support Chat", icon: "💬" },
  safety: { label: "Safety Plan", icon: "🛡️" },
  sessions: { label: "Sessions", icon: "📅" },
  clients: { label: "Clients", icon: "👤" },
  notes: { label: "Case Notes", icon: "📝" },
  cases: { label: "Active Cases", icon: "📁" },
  rights: { label: "Legal Resources", icon: "📜" },
  docs: { label: "Documents", icon: "📄" },
};

const handlePlaceholderAction = (action) => {
  window.alert(`${action} is available in the full backend deployment.`);
};

const getGenericModuleRecords = (page, users, cases) => {
  if (page === "users") {
    return users.map((entry) => ({
      id: String(entry.id),
      title: entry.name,
      type: ROLE_CONFIG[entry.role]?.label || entry.role,
      status: "active",
      owner: entry.username,
      updatedAt: entry.createdAt || new Date().toISOString(),
      details: `User account for ${entry.name}`,
    }));
  }

  if (["cases", "notes", "docs"].includes(page)) {
    return cases.map((entry) => ({
      id: String(entry.id),
      title: entry.title,
      type: entry.type,
      status: entry.status,
      owner: entry.survivorName,
      updatedAt: entry.createdAt,
      details: entry.description,
    }));
  }

  return [
    {
      id: "metric-users",
      title: "Registered Users",
      type: "System",
      status: "active",
      owner: "Admin",
      updatedAt: new Date().toISOString(),
      details: `Total users currently registered: ${users.length}`,
    },
    {
      id: "metric-cases",
      title: "Filed Cases",
      type: "System",
      status: "active",
      owner: "Admin",
      updatedAt: new Date().toISOString(),
      details: `Total filed cases in module: ${cases.length}`,
    },
    {
      id: "metric-urgent",
      title: "Urgent Alerts",
      type: "System",
      status: "active",
      owner: "Admin",
      updatedAt: new Date().toISOString(),
      details: `Urgent open alerts: ${cases.filter((item) => item.priority === "urgent" && item.status !== "closed").length}`,
    },
  ];
};

const downloadFile = (content, fileName, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const fileUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = fileUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(fileUrl);
};


function Login({ onLogin, onUsersChanged }) {
  const [authMode, setAuthMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const roles = [
    { id: "survivor", label: "Survivor", icon: "🌸" },
    { id: "counsellor", label: "Counsellor", icon: "💙" },
    { id: "legal", label: "Legal Advisor", icon: "⚖️" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const users = getAllUsers();
    if (users.length === 0) {
      setError("No account found. Please sign up first.");
      return;
    }

    const user = await verifyUserCredential({ username, password });
    if (!user) {
      setError("Invalid username or password.");
      return;
    }
    onLogin(user);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!selectedRole) {
      setError("Please choose a role.");
      return;
    }

    try {
      await createUserCredential({
        username,
        password,
        name: fullName,
        role: selectedRole,
      });
      onUsersChanged();
      setSuccess("Signup successful. Please login with your new credentials.");
      setAuthMode("login");
      setPassword("");
      setConfirmPassword("");
    } catch (signupError) {
      setError(signupError.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-logo">🕊️ SafeHaven</div>
        <p className="login-tagline">A confidential support platform for survivors of domestic violence — providing resources, legal guidance, and compassionate care.</p>
        <ul className="login-features">
          <li>🔒 Completely confidential & secure</li>
          <li>📞 24/7 emergency support access</li>
          <li>⚖️ Legal rights information & advice</li>
          <li>💬 Connect with trained counsellors</li>
          <li>🏠 Find shelter and safe housing</li>
          <li>🛡️ Create a personal safety plan</li>
        </ul>
      </div>
      <div className="login-right">
        <div style={{maxWidth: 380, width: "100%", margin: "0 auto"}}>
          <h1 className="login-form-title">{authMode === "login" ? "Welcome back" : "Create account"}</h1>
          <p className="login-form-sub">{authMode === "login" ? "Sign in to access your secure dashboard" : "Sign up first, then use login to access your dashboard"}</p>

          <div style={{display:"flex",gap:10,marginBottom:18}}>
            <button
              type="button"
              className="btn-secondary"
              style={{flex:1,background:authMode === "login" ? "var(--sage-pale)" : "transparent"}}
              onClick={() => { setAuthMode("login"); setError(""); setSuccess(""); }}
            >
              Login
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{flex:1,background:authMode === "signup" ? "var(--sage-pale)" : "transparent"}}
              onClick={() => { setAuthMode("signup"); setError(""); setSuccess(""); }}
            >
              Signup
            </button>
          </div>

          {authMode === "signup" && (
            <>
              <p style={{fontSize:12,fontWeight:700,color:"var(--mid-gray)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>Choose Role</p>
              <div className="role-selector">
                {roles.map(r => (
                  <div key={r.id} className={`role-card ${selectedRole === r.id ? "active" : ""}`} onClick={() => setSelectedRole(r.id)}>
                    <div className="role-icon">{r.icon}</div>
                    <div className="role-name">{r.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {error && <div className="error-msg">⚠️ {error}</div>}
          {success && <div className="notice success" style={{marginBottom: 16}}><span>✅</span><div>{success}</div></div>}

          <form onSubmit={authMode === "login" ? handleLogin : handleSignup}>
            {authMode === "signup" && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" required />
              </div>
            )}
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {authMode === "signup" && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
              </div>
            )}
            <button type="submit" className="btn-primary">{authMode === "login" ? "Sign In Securely →" : "Create Secure Account →"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ user, activePage, setActivePage, onLogout }) {
  const config = ROLE_CONFIG[user.role];
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">🕊️ SafeHaven</div>
        <div className="sidebar-sub">Support Platform</div>
      </div>
      <div className="sidebar-user">
        <div className="sidebar-user-name">{user.name}</div>
        <span className={`role-badge ${user.role}`}>{config.label}</span>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Navigation</div>
          {config.nav.map(key => (
            <button key={key} className={`nav-item ${activePage === key ? "active" : ""}`} onClick={() => setActivePage(key)}>
              <span className="nav-icon">{NAV_LABELS[key].icon}</span>
              {NAV_LABELS[key].label}
            </button>
          ))}
        </div>
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-item" onClick={onLogout} style={{color:"var(--blush)"}}>
          <span className="nav-icon">→</span> Sign Out
        </button>
      </div>
    </div>
  );
}


function PageHeader({ title, subtitle, onLogout }) {
  return (
    <div className="page-header-with-logout">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      <button className="btn-logout" onClick={onLogout}>
        → Logout
      </button>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button className="btn-back" onClick={onClick}>
      ← Back to Dashboard
    </button>
  );
}

function AdminDashboard({ onLogout }) {
  const { registeredUsers, caseRecords, refreshUsers } = useAuth();
  const [selectedStat, setSelectedStat] = useState("totalUsers");
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editedPassword, setEditedPassword] = useState("");
  const [confirmEditedPassword, setConfirmEditedPassword] = useState("");
  const [editError, setEditError] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const users = registeredUsers;
  const sessions = getStoredSessions();
  const survivorUsers = users.filter((u) => u.role === "survivor");
  const survivorsCount = users.filter((u) => u.role === "survivor").length;
  const today = new Date().toISOString().slice(0, 10);
  const todaySessions = sessions.filter((session) => session.date === today);
  const sessionsToday = todaySessions.length;
  const crisisCaseAlerts = caseRecords.filter((item) => item.priority === "urgent" && item.status !== "closed");
  const crisisAlerts = crisisCaseAlerts.length;
  const allClientsData = survivorUsers.map((client) => {
    const clientCases = caseRecords.filter((record) => record.reportedBy === client.username);
    const lastCase = [...clientCases].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))[0];
    return {
      ...client,
      casesFiled: clientCases.length,
      lastCaseDate: lastCase?.createdAt || null,
    };
  });
  const recentCases = [...caseRecords]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 5);

  const openEditUser = (user) => {
    setEditingUser(user);
    setEditedPassword(user.passwordPreview || "");
    setConfirmEditedPassword(user.passwordPreview || "");
    setShowPasswordFields(false);
    setEditError("");
    setShowEditUserModal(true);
  };

  const closeEditUser = () => {
    setShowEditUserModal(false);
    setEditingUser(null);
    setEditedPassword("");
    setConfirmEditedPassword("");
    setShowPasswordFields(false);
    setEditError("");
  };

  const saveUserPassword = async (event) => {
    event.preventDefault();
    if (!editingUser) return;

    if (!editedPassword.trim()) {
      setEditError("Please enter a password.");
      return;
    }
    if (editedPassword.trim().length < 6) {
      setEditError("Password must be at least 6 characters.");
      return;
    }
    if (editedPassword !== confirmEditedPassword) {
      setEditError("Passwords do not match.");
      return;
    }

    try {
      await updateUserCredentialPassword({ username: editingUser.username, newPassword: editedPassword.trim() });
      refreshUsers();
      closeEditUser();
    } catch (passwordError) {
      setEditError(passwordError.message || "Unable to update password.");
    }
  };
  return (
    <div className="admin-dashboard">
      <PageHeader title="Admin Dashboard" subtitle="System overview and management" onLogout={onLogout} />
      <div className="grid-4 section-gap">
        {[
          { key:"totalUsers", icon:"👥", label:"Total Users", value:users.length, cls:"green" },
          { key:"activeSurvivors", icon:"🌸", label:"Active Survivors", value:survivorsCount, cls:"blush" },
          { key:"sessionsToday", icon:"📅", label:"Sessions Today", value:sessionsToday, cls:"blue" },
          { key:"crisisAlerts", icon:"🆘", label:"Crisis Alerts", value:crisisAlerts, cls:"purple" },
        ].map(s => (
          <button
            type="button"
            key={s.label}
            className={`stat-card stat-card-btn ${selectedStat === s.key ? "active" : ""}`}
            onClick={() => setSelectedStat(s.key)}
          >
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="card section-gap">
        <div className="card-title">Exact Content</div>
        <div className="card-sub">Click a top card to view complete records for that metric</div>

        {selectedStat === "totalUsers" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Username</th><th>Role</th><th>Created</th></tr>
              </thead>
              <tbody>
                {users.length > 0 ? users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.username}</td>
                    <td><span className={`role-badge ${u.role}`}>{ROLE_CONFIG[u.role].label}</span></td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "var(--mid-gray)" }}>
                      No users available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedStat === "activeSurvivors" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Username</th><th>Status</th><th>Created</th></tr>
              </thead>
              <tbody>
                {survivorUsers.length > 0 ? survivorUsers.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.username}</td>
                    <td><span className="status-badge status-active">Active</span></td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "var(--mid-gray)" }}>
                      No survivor records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedStat === "sessionsToday" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Survivor</th><th>Date</th><th>Time</th><th>Status</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {todaySessions.length > 0 ? todaySessions.map((session) => (
                  <tr key={session.id}>
                    <td><strong>{session.survivor}</strong></td>
                    <td>{session.date}</td>
                    <td>{session.time}</td>
                    <td><span className={`status-badge status-${session.status}`}>{session.status}</span></td>
                    <td>{session.notes || "—"}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", color: "var(--mid-gray)" }}>
                      No sessions scheduled for today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedStat === "crisisAlerts" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Case ID</th><th>Survivor</th><th>Type</th><th>Title</th><th>Status</th><th>Reported</th></tr>
              </thead>
              <tbody>
                {crisisCaseAlerts.length > 0 ? crisisCaseAlerts.map((record) => (
                  <tr key={record.id}>
                    <td><strong>{record.id}</strong></td>
                    <td>{record.survivorName}</td>
                    <td>{record.type}</td>
                    <td>{record.title}</td>
                    <td><span className="status-badge status-pending">{record.status}</span></td>
                    <td>{new Date(record.createdAt).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", color: "var(--mid-gray)" }}>
                      No urgent crisis alerts.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-title">Recent Filed Cases</div>
          <div className="card-sub">Latest user-facing incidents reported on the platform</div>
          {recentCases.length > 0 ? recentCases.map((filedCase) => (
            <div key={filedCase.id} className="alert-item">
              <div className={`alert-dot ${filedCase.priority === "urgent" ? "urgent" : "normal"}`}/>
              <div className="alert-text">
                <strong>{filedCase.survivorName}</strong> — {filedCase.title}
                <div style={{fontSize:11,color:"var(--mid-gray)"}}>{filedCase.id} • {filedCase.type}</div>
              </div>
              <div className="alert-time">{new Date(filedCase.createdAt).toLocaleDateString()}</div>
            </div>
          )) : (
            <div className="notice info" style={{marginBottom:0}}>
              <span>ℹ️</span>
              <div>No filed cases yet.</div>
            </div>
          )}
        </div>
        <div className="card">
          <div className="card-title">User Roles Overview</div>
          <div className="card-sub">Distribution across platform</div>
          {[
            { role:"Survivors/Victims", count:142, pct:57 },
            { role:"Counsellors", count:38, pct:15 },
            { role:"Legal Advisors", count:22, pct:9 },
            { role:"Admins", count:8, pct:3 },
            { role:"Support Staff", count:38, pct:16 },
          ].map(r => (
            <div key={r.role} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                <span style={{fontWeight:500}}>{r.role}</span>
                <span style={{color:"var(--mid-gray)"}}>{r.count}</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${r.pct}%`}}/></div>
            </div>
          ))}
        </div>
      </div>
      <div className="card section-gap">
        <div className="card-title">User Management</div>
        <div className="card-sub">All registered platform users</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.username}</td>
                    <td><span className={`role-badge ${u.role}`}>{ROLE_CONFIG[u.role].label}</span></td>
                    <td><span className="status-badge status-active">Active</span></td>
                    <td>
                      <button className="btn-secondary" style={{padding:"5px 12px",fontSize:12}} onClick={() => openEditUser(u)}>Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "var(--mid-gray)" }}>
                    No registered users yet. Create accounts from Signup.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card section-gap">
        <div className="card-title">All Clients Data</div>
        <div className="card-sub">Complete survivor/client records for admin review</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Username</th><th>Role</th><th>Cases Filed</th><th>Last Case</th><th>Created</th></tr>
            </thead>
            <tbody>
              {allClientsData.length > 0 ? (
                allClientsData.map((client) => (
                  <tr key={client.id}>
                    <td><strong>{client.name}</strong></td>
                    <td>{client.username}</td>
                    <td><span className="role-badge survivor">Survivor</span></td>
                    <td>{client.casesFiled}</td>
                    <td>{client.lastCaseDate ? new Date(client.lastCaseDate).toLocaleString() : "—"}</td>
                    <td>{client.createdAt ? new Date(client.createdAt).toLocaleString() : "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "var(--mid-gray)" }}>
                    No client data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEditUserModal && editingUser && (
        <div className="modal-overlay">
          <div className="modal case-form">
            <div className="modal-title">Edit User Access</div>
            <div className="modal-sub">View username and password, then update password if needed.</div>

            {editError && <div className="error-msg">{editError}</div>}

            <form onSubmit={saveUserPassword}>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={editingUser.username} readOnly />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type={showPasswordFields ? "text" : "password"}
                  value={editedPassword}
                  onChange={(event) => setEditedPassword(event.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type={showPasswordFields ? "text" : "password"}
                  value={confirmEditedPassword}
                  onChange={(event) => setConfirmEditedPassword(event.target.value)}
                  placeholder="Re-enter password"
                />
              </div>

              <button
                type="button"
                className="btn-secondary"
                style={{ width: "100%", marginBottom: 12 }}
                onClick={() => setShowPasswordFields((previous) => !previous)}
              >
                {showPasswordFields ? "Hide Password" : "Show Password"}
              </button>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeEditUser}>Close</button>
                <button type="submit" className="btn-primary" style={{ width: "auto" }}>Save Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SurvivorDashboard({ onLogout }) {
  const { fileCase, caseRecords } = useAuth();
  const [caseType, setCaseType] = useState("Protection Order");
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [casePriority, setCasePriority] = useState("normal");
  const [caseMessage, setCaseMessage] = useState("");
  const { user } = useAuth();
  const myCases = caseRecords.filter((record) => record.reportedBy === user.username);

  const handleFileCase = (event) => {
    event.preventDefault();
    if (!caseTitle.trim() || !caseDescription.trim()) {
      setCaseMessage("Please add both case title and details.");
      return;
    }
    fileCase({
      user,
      type: caseType,
      title: caseTitle.trim(),
      description: caseDescription.trim(),
      priority: casePriority,
    });
    setCaseMessage("Case filed successfully. Admin and legal team can now view this record.");
    setCaseTitle("");
    setCaseDescription("");
    setCasePriority("normal");
  };

  return (
    <div>
      <PageHeader title="Your Safe Space" subtitle="Access support, resources, and guidance" onLogout={onLogout} />
      <div className="notice success">
        <span>💚</span>
        <div><strong>You are safe here.</strong> Everything you do on SafeHaven is confidential. If you need to leave quickly, press the red "Quick Exit" button.</div>
      </div>
      <div className="grid-3 section-gap">
        {[
          { icon:"📞", label:"Emergency Help", desc:"Call a helpline now", color:"blush" },
          { icon:"💬", label:"Talk to Counsellor", desc:"Chat in confidence", color:"blue" },
          { icon:"⚖️", label:"Know Your Rights", desc:"Legal information", color:"purple" },
        ].map(a => (
          <div key={a.label} className="resource-card" style={{textAlign:"center",cursor:"pointer"}}>
            <div style={{fontSize:40,marginBottom:12}}>{a.icon}</div>
            <div style={{fontWeight:700,fontSize:15,marginBottom:4,color:"var(--charcoal)"}}>{a.label}</div>
            <div style={{fontSize:13,color:"var(--mid-gray)"}}>{a.desc}</div>
          </div>
        ))}
      </div>
      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-title">Your Upcoming Support</div>
          <div className="card-sub">Scheduled sessions & check-ins</div>
          <div className="alert-item">
            <div className="alert-dot normal"/>
            <div className="alert-text"><strong>Session with Dr. Priya</strong><br/><span style={{color:"var(--mid-gray)",fontSize:12}}>Feb 24, 2026 — 10:00 AM</span></div>
            <span className="status-badge status-scheduled">Upcoming</span>
          </div>
          <div className="alert-item">
            <div className="alert-dot normal"/>
            <div className="alert-text"><strong>Legal Consultation</strong><br/><span style={{color:"var(--mid-gray)",fontSize:12}}>Feb 26, 2026 — 2:00 PM</span></div>
            <span className="status-badge status-scheduled">Upcoming</span>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Your Safety Score</div>
          <div className="card-sub">Safety plan completion</div>
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:52,fontFamily:"var(--font-display)",fontWeight:700,color:"var(--sage)"}}>68%</div>
            <div style={{fontSize:13,color:"var(--mid-gray)",marginBottom:16}}>Safety Plan Completed</div>
            <div className="progress-bar" style={{height:12}}><div className="progress-fill" style={{width:"68%"}}/></div>
            <div style={{fontSize:12,color:"var(--mid-gray)",marginTop:10}}>Complete 3 more steps to reach your safety goal</div>
          </div>
        </div>
      </div>
      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-title">File a New Case</div>
          <div className="card-sub">Submit what you are facing so admin can track every record</div>
          {caseMessage && (
            <div className="notice info" style={{marginBottom:16}}>
              <span>ℹ️</span>
              <div>{caseMessage}</div>
            </div>
          )}
          <form className="case-form" onSubmit={handleFileCase}>
            <div className="form-group">
              <label>Case Type</label>
              <select value={caseType} onChange={(event) => setCaseType(event.target.value)}>
                <option>Protection Order</option>
                <option>Physical Abuse</option>
                <option>Verbal/Emotional Abuse</option>
                <option>Child Custody</option>
                <option>Financial Abuse</option>
                <option>Divorce Proceedings</option>
              </select>
            </div>
            <div className="form-group">
              <label>Case Title</label>
              <input
                type="text"
                value={caseTitle}
                onChange={(event) => setCaseTitle(event.target.value)}
                placeholder="Short summary of the issue"
              />
            </div>
            <div className="form-group">
              <label>Details</label>
              <textarea
                rows="4"
                value={caseDescription}
                onChange={(event) => setCaseDescription(event.target.value)}
                placeholder="Describe what happened and what support you need"
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={casePriority} onChange={(event) => setCasePriority(event.target.value)}>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Submit Case</button>
          </form>
        </div>

        <div className="card">
          <div className="card-title">Your Filed Cases</div>
          <div className="card-sub">All cases submitted by you</div>
          {myCases.length > 0 ? myCases.map((record) => (
            <div key={record.id} className="alert-item">
              <div className={`alert-dot ${record.priority === "urgent" ? "urgent" : "normal"}`}/>
              <div className="alert-text">
                <strong>{record.title}</strong>
                <div style={{fontSize:12,color:"var(--mid-gray)"}}>{record.type} • {new Date(record.createdAt).toLocaleDateString()}</div>
              </div>
              <span className={`status-badge ${record.status === "open" ? "status-pending" : "status-completed"}`}>{record.status}</span>
            </div>
          )) : (
            <div className="notice info" style={{marginBottom:0}}>
              <span>ℹ️</span>
              <div>You have not filed any cases yet.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CounsellorDashboard({ onLogout, onNavigate }) {
  const [selectedStat, setSelectedStat] = useState("activeClients");
  const sessions = getStoredSessions();
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const activeClientsList = Array.from(new Set(sessions.map((entry) => entry.survivor))).map((survivor) => {
    const totalSessions = sessions.filter((entry) => entry.survivor === survivor).length;
    return { survivor, totalSessions };
  });
  const todaySessions = sessions.filter((entry) => entry.date === today);
  const completedThisWeek = sessions.filter((entry) => {
    if (entry.status !== "completed") return false;
    const sessionDate = new Date(entry.date);
    return sessionDate >= sevenDaysAgo;
  });
  const needsAttentionSessions = sessions.filter((entry) => entry.status === "pending" || (entry.status === "scheduled" && entry.date < today));

  const handleQuickAction = (action) => {
    if (action === "schedule") {
      onNavigate("sessions");
      return;
    }
    if (action === "note") {
      onNavigate("notes");
      return;
    }
    if (action === "resource") {
      onNavigate("resources");
      return;
    }
    if (action === "emergency") {
      window.location.href = "tel:18001234567";
    }
  };

  return (
    <div>
      <PageHeader title="Counsellor Dashboard" subtitle="Manage sessions and support survivors" onLogout={onLogout} />
      <div className="grid-4 section-gap">
        {[
          { key:"activeClients", icon:"👤", label:"Active Clients", value:activeClientsList.length, cls:"green" },
          { key:"todaySessions", icon:"📅", label:"Today's Sessions", value:todaySessions.length, cls:"blue" },
          { key:"completedWeek", icon:"✅", label:"Completed This Week", value:completedThisWeek.length, cls:"blush" },
          { key:"needsAttention", icon:"⚠️", label:"Needs Attention", value:needsAttentionSessions.length, cls:"purple" },
        ].map(s => (
          <button
            type="button"
            key={s.label}
            className={`stat-card stat-card-btn ${selectedStat === s.key ? "active" : ""}`}
            onClick={() => setSelectedStat(s.key)}
          >
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </button>
        ))}
      </div>

      <div className="card section-gap">
        <div className="card-title">Exact Content</div>
        <div className="card-sub">Click a top card to view complete records for that metric</div>

        {selectedStat === "activeClients" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Client</th><th>Total Sessions</th></tr>
              </thead>
              <tbody>
                {activeClientsList.length > 0 ? activeClientsList.map((item) => (
                  <tr key={item.survivor}>
                    <td><strong>{item.survivor}</strong></td>
                    <td>{item.totalSessions}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center", color: "var(--mid-gray)" }}>
                      No active clients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedStat === "todaySessions" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Survivor</th><th>Date</th><th>Time</th><th>Status</th></tr>
              </thead>
              <tbody>
                {todaySessions.length > 0 ? todaySessions.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.survivor}</strong></td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td><span className={`status-badge status-${item.status}`}>{item.status}</span></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "var(--mid-gray)" }}>
                      No sessions for today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedStat === "completedWeek" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Survivor</th><th>Date</th><th>Time</th><th>Status</th></tr>
              </thead>
              <tbody>
                {completedThisWeek.length > 0 ? completedThisWeek.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.survivor}</strong></td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td><span className="status-badge status-completed">completed</span></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "var(--mid-gray)" }}>
                      No completed sessions this week.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedStat === "needsAttention" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Survivor</th><th>Date</th><th>Time</th><th>Reason</th></tr>
              </thead>
              <tbody>
                {needsAttentionSessions.length > 0 ? needsAttentionSessions.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.survivor}</strong></td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td>{item.status === "pending" ? "Pending confirmation" : "Scheduled date passed"}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "var(--mid-gray)" }}>
                      No sessions require attention.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card section-gap">
        <div className="card-title">Upcoming Sessions</div>
        <div className="card-sub">Your scheduled appointments</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Survivor</th><th>Date</th><th>Time</th><th>Status</th><th>Notes</th></tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.survivor}</strong></td>
                  <td>{s.date}</td>
                  <td>{s.time}</td>
                  <td><span className={`status-badge status-${s.status}`}>{s.status}</span></td>
                  <td style={{fontSize:12,color:"var(--mid-gray)"}}>{s.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Client Progress Tracker</div>
          <div className="card-sub">Current safety plan adherence</div>
          {[
            { name:"Sarah M.", pct:68 },
            { name:"Anita K.", pct:85 },
            { name:"Preethi R.", pct:40 },
          ].map(c => (
            <div key={c.name} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                <strong>{c.name}</strong><span style={{color:"var(--sage)",fontWeight:600}}>{c.pct}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${c.pct}%`}}/></div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Quick Actions</div>
          <div className="card-sub">Common counsellor tasks</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button className="btn-secondary" style={{textAlign:"left",justifyContent:"flex-start"}} onClick={() => handleQuickAction("schedule")}>Schedule New Session</button>
            <button className="btn-secondary" style={{textAlign:"left",justifyContent:"flex-start"}} onClick={() => handleQuickAction("note")}>Add Case Note</button>
            <button className="btn-secondary" style={{textAlign:"left",justifyContent:"flex-start"}} onClick={() => handleQuickAction("resource")}>Send Resource to Client</button>
            <button className="btn-secondary" style={{textAlign:"left",justifyContent:"flex-start"}} onClick={() => handleQuickAction("emergency")}>Flag for Emergency Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegalDashboard({ onLogout, onNavigate }) {
  const { caseRecords } = useAuth();
  const allCases = [...caseRecords].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  const activeCases = allCases.filter((entry) => entry.status !== "closed");
  const pendingCases = allCases.filter((entry) => entry.status === "in-review");
  const closedCases = allCases.filter((entry) => entry.status === "closed");
  const protectionOrderCases = allCases.filter((entry) => entry.type === "Protection Order");

  const handleLegalQuickAction = (action) => {
    if (!onNavigate) {
      handlePlaceholderAction(action);
      return;
    }

    if (action === "Update Legal Resources") {
      onNavigate("resources");
      return;
    }

    if (action === "Review Pending Documents") {
      onNavigate("docs");
      return;
    }

    onNavigate("cases");
  };

  const handleLegalStatAction = (targetPage, fallbackLabel) => {
    if (!onNavigate) {
      handlePlaceholderAction(fallbackLabel);
      return;
    }
    onNavigate(targetPage);
  };

  return (
    <div>
      <PageHeader title="Legal Advisor Dashboard" subtitle="Manage cases and provide legal guidance" onLogout={onLogout} />
      <div className="grid-4 section-gap">
        {[
          { icon:"📁", label:"Active Cases", value:activeCases.length, cls:"green", page:"cases" },
          { icon:"⏳", label:"Pending Review", value:pendingCases.length, cls:"blue", page:"docs" },
          { icon:"✅", label:"Cases Closed", value:closedCases.length, cls:"blush", page:"docs" },
          { icon:"📋", label:"Protection Orders", value:protectionOrderCases.length, cls:"purple", page:"rights" },
        ].map(s => (
          <div
            key={s.label}
            className="stat-card"
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
            onClick={() => handleLegalStatAction(s.page, s.label)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleLegalStatAction(s.page, s.label);
              }
            }}
          >
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>
      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-title">All Cases</div>
          <div className="card-sub">Live records from filed cases</div>
          {allCases.length > 0 ? allCases.map(c => (
            <div key={c.id} className="alert-item">
              <div className={`alert-dot ${c.priority === "urgent" ? "urgent" : "normal"}`}/>
              <div className="alert-text">
                <strong>{c.survivorName}</strong> — {c.type}
                <div style={{fontSize:12,marginTop:2,fontWeight:600}}>{c.title}</div>
                <div style={{fontSize:12,marginTop:2}}>{c.description}</div>
                <div style={{fontSize:11,color:"var(--mid-gray)",marginTop:4}}>
                  {c.id} · Priority: {c.priority} · Status: {c.status} · {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
              <button className="btn-secondary" style={{padding:"5px 10px",fontSize:11}} onClick={() => onNavigate?.("cases")}>View</button>
            </div>
          )) : (
            <div className="notice info" style={{marginTop:10}}>
              <span>ℹ️</span>
              <div>No cases available yet.</div>
            </div>
          )}
        </div>
        <div className="card">
          <div className="card-title">Quick Legal Actions</div>
          <div className="card-sub">Common legal tasks</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {["Draft Protection Order","File for Emergency Custody","Update Legal Resources","Schedule Legal Consultation","Review Pending Documents"].map(a => (
              <button key={a} className="btn-secondary" style={{textAlign:"left"}} onClick={() => handleLegalQuickAction(a)}>{a}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourcesPage({ onBack, onLogout }) {
  const [filter, setFilter] = useState("all");
  const categories = ["all","emergency","legal","shelter","health","children"];
  const filtered = filter === "all" ? RESOURCES : RESOURCES.filter(r => r.category === filter);
  const catClass = { emergency:"cat-emergency", legal:"cat-legal", shelter:"cat-shelter", health:"cat-health", children:"cat-children" };

  const handleGetHelp = (resource) => {
    const phoneNumber = String(resource.contact || "").replace(/[^\d+]/g, "");
    if (!phoneNumber) {
      window.alert("Contact number unavailable for this resource.");
      return;
    }
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div>
      <BackButton onClick={onBack} />
      <PageHeader title="Support Resources" subtitle="Find help, shelters, and support services near you" onLogout={onLogout} />
      <div className="notice info">
        <span>ℹ️</span>
        <div>All resources are verified and updated regularly. Call the helplines directly for immediate assistance. Your call is confidential.</div>
      </div>
      <div className="filter-bar">
        {categories.map(c => (
          <button key={c} className={`filter-btn ${filter===c?"active":""}`} onClick={() => setFilter(c)}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid-3">
        {filtered.map(r => (
          <div key={r.id} className="resource-card">
            <div className="resource-icon">{r.icon}</div>
            <span className={`category-badge cat-${r.category}`}>{r.category}</span>
            <div className="resource-title">{r.title}</div>
            <div className="resource-desc">{r.description}</div>
            <div className="resource-contact">📞 {r.contact}</div>
            <button className="btn-primary" style={{marginTop:14,fontSize:12,padding:"8px 14px"}} onClick={() => handleGetHelp(r)}>Get Help Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegalRightsPage({ onBack, onLogout }) {
  return (
    <div>
      <BackButton onClick={onBack} />
      <PageHeader title="Your Legal Rights" subtitle="Know your rights and how the law protects you" onLogout={onLogout} />
      <div className="notice">
        <span>⚠️</span>
        <div>This information is general legal guidance. For advice specific to your situation, please consult with a legal advisor through this platform.</div>
      </div>
      <div className="grid-2 section-gap">
        {LEGAL_RIGHTS.map(r => (
          <div key={r.title} className="rights-card">
            <div className="rights-icon-box">{r.icon}</div>
            <div>
              <div className="rights-title">{r.title}</div>
              <div className="rights-desc">{r.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">How to File a Complaint</div>
        <div className="card-sub">Step-by-step process to take legal action</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:20,marginTop:8}}>
          {[
            { step:1, title:"Document the Abuse", desc:"Keep records of incidents: dates, injuries, witnesses." },
            { step:2, title:"Contact the Police", desc:"File an FIR (First Information Report) at your local station." },
            { step:3, title:"Seek a Protection Order", desc:"Apply at the magistrate's court for immediate protection." },
            { step:4, title:"Get Legal Aid", desc:"Access free legal assistance through our platform advisors." },
            { step:5, title:"Follow Up", desc:"Track your case status with your assigned legal advisor." },
          ].map(s => (
            <div key={s.step} style={{background:"var(--sage-pale)",borderRadius:"var(--radius-sm)",padding:"16px",position:"relative"}}>
              <div style={{width:28,height:28,background:"var(--sage)",color:"white",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,marginBottom:10}}>{s.step}</div>
              <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{s.title}</div>
              <div style={{fontSize:12,color:"var(--mid-gray)",lineHeight:1.5}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatPage({ onBack, onLogout }) {
  const [messages, setMessages] = useState([
    { id:1, text:"Hello, I'm here to support you. This conversation is completely confidential. How are you feeling today?", sent:false, time:"10:02 AM" },
    { id:2, text:"Hi, I'm a bit nervous but I needed to talk to someone.", sent:true, time:"10:03 AM" },
    { id:3, text:"That's completely okay. You're safe here. Take your time. I'm listening whenever you're ready.", sent:false, time:"10:03 AM" },
  ]);
  const [input, setInput] = useState("");
  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { id:Date.now(), text:input, sent:true, time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) }]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, { id:Date.now()+1, text:"I hear you. You're being very brave reaching out. Can you tell me more about what's been happening?", sent:false, time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) }]);
    }, 1200);
  };
  return (
    <div>
      <BackButton onClick={onBack} />
      <PageHeader title="Support Chat" subtitle="Confidential, real-time support from trained counsellors" onLogout={onLogout} />
      <div className="notice success">
        <span>🔒</span>
        <div>This chat is end-to-end encrypted. Your counsellor is a trained professional. You can end the chat at any time.</div>
      </div>
      <div className="grid-2">
        <div className="chat-box" style={{gridColumn:"1 / span 2"}}>
          <div className="chat-header">
            <div className="online-dot"/>
            Dr. Priya Sharma — Trauma-Informed Counsellor
            <span style={{marginLeft:"auto",fontSize:12,opacity:0.8}}>🔒 Encrypted</span>
          </div>
          <div className="chat-messages">
            {messages.map(m => (
              <div key={m.id} className={`msg ${m.sent?"sent":"recv"}`}>
                <div className="msg-bubble">{m.text}</div>
                <div className="msg-time">{m.time}</div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()} placeholder="Type your message…" />
            <button className="chat-send" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SafetyPlanPage({ onBack, onLogout }) {
  const [steps, setSteps] = useState([
    { id:1, text:"Identify 3 trusted people I can call", done:true },
    { id:2, text:"Keep important documents in a safe place", done:true },
    { id:3, text:"Know emergency exit routes from my home", done:false },
    { id:4, text:"Have a go-bag with essentials packed", done:false },
    { id:5, text:"Memorize 2 emergency phone numbers", done:true },
    { id:6, text:"Know the nearest shelter location", done:false },
    { id:7, text:"Have emergency money set aside", done:false },
  ]);
  const completed = steps.filter(s => s.done).length;
  const toggle = (id) => setSteps(s => s.map(x => x.id===id ? {...x, done:!x.done} : x));
  return (
    <div>
      <BackButton onClick={onBack} />
      <PageHeader title="Your Safety Plan" subtitle="Build and track your personal safety strategy" onLogout={onLogout} />
      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-title">Safety Checklist</div>
          <div className="card-sub">{completed} of {steps.length} steps completed</div>
          <div className="progress-bar" style={{height:10,marginBottom:20}}><div className="progress-fill" style={{width:`${(completed/steps.length)*100}%`}}/></div>
          {steps.map(s => (
            <div key={s.id} onClick={() => toggle(s.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid var(--light-gray)",cursor:"pointer"}}>
              <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${s.done?"var(--sage)":"var(--border)"}`,background:s.done?"var(--sage)":"white",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:14,flexShrink:0}}>
                {s.done && "✓"}
              </div>
              <span style={{fontSize:13,color:s.done?"var(--mid-gray)":"var(--charcoal)",textDecoration:s.done?"line-through":"none"}}>{s.text}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="card section-gap">
            <div className="card-title">Emergency Contacts</div>
            <div className="card-sub">People you trust in a crisis</div>
            {["National Helpline: 1800-123-4567","Police: 100","Trusted Person 1: (add name)","Trusted Person 2: (add name)"].map((c,i) => (
              <div key={i} style={{padding:"10px 0",borderBottom:"1px solid var(--light-gray)",fontSize:13,display:"flex",alignItems:"center",gap:10}}>
                <span>📞</span>{c}
              </div>
            ))}
            <button className="btn-secondary" style={{marginTop:14,width:"100%"}} onClick={() => handlePlaceholderAction("Add emergency contact")}>+ Add Contact</button>
          </div>
          <div className="card">
            <div className="card-title">Your Safe Locations</div>
            <div className="card-sub">Places you can go in an emergency</div>
            {["Nearest Police Station","Local Women's Shelter","Friend / Family Home","Hospital Emergency"].map((l,i) => (
              <div key={i} style={{padding:"10px 0",borderBottom:"1px solid var(--light-gray)",fontSize:13,display:"flex",alignItems:"center",gap:10}}>
                <span>📍</span>{l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionsPage({ onBack, onLogout }) {
  const [sessions, setSessions] = useState(() => getStoredSessions());
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    survivor: "",
    date: "",
    time: "",
    status: "scheduled",
  });

  const resetForm = () => {
    setFormData({ survivor: "", date: "", time: "", status: "scheduled" });
    setFormError("");
    setEditingSessionId(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowSessionForm(true);
  };

  const openEditForm = (session) => {
    setFormData({
      survivor: session.survivor,
      date: session.date,
      time: session.time,
      status: session.status,
    });
    setEditingSessionId(session.id);
    setFormError("");
    setShowSessionForm(true);
  };

  const closeForm = () => {
    setShowSessionForm(false);
    resetForm();
  };

  const onChangeField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const persistSessions = (nextSessions) => {
    setSessions(nextSessions);
    saveStoredSessions(nextSessions);
  };

  const handleSaveSession = (event) => {
    event.preventDefault();
    const trimmedSurvivor = formData.survivor.trim();
    const trimmedTime = formData.time.trim();

    if (!trimmedSurvivor) {
      setFormError("Please enter survivor name.");
      return;
    }
    if (!formData.date) {
      setFormError("Please choose a date.");
      return;
    }
    if (!trimmedTime) {
      setFormError("Please enter time.");
      return;
    }

    if (editingSessionId) {
      const updated = sessions.map((session) =>
        session.id === editingSessionId
          ? {
              ...session,
              survivor: trimmedSurvivor,
              date: formData.date,
              time: trimmedTime,
              status: formData.status,
            }
          : session
      );
      persistSessions(updated);
    } else {
      const newSession = {
        id: `session-${Date.now()}`,
        survivor: trimmedSurvivor,
        date: formData.date,
        time: trimmedTime,
        status: formData.status,
        notes: "",
      };
      persistSessions([newSession, ...sessions]);
    }

    closeForm();
  };

  const handleCancelSession = (sessionId, survivorName) => {
    const shouldCancel = window.confirm(`Cancel session for ${survivorName}?`);
    if (!shouldCancel) return;
    const filtered = sessions.filter((session) => session.id !== sessionId);
    persistSessions(filtered);
  };

  return (
    <div>
      <BackButton onClick={onBack} />
      <PageHeader title="Sessions" subtitle="All scheduled and past counselling sessions" onLogout={onLogout} />
      <div className="card section-gap">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <div className="card-title">Session Calendar</div>
            <div className="card-sub">Manage all appointments</div>
          </div>
          <button className="btn-primary" style={{width:"auto"}} onClick={openCreateForm}>+ New Session</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Survivor</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.survivor}</strong></td>
                  <td>{s.date}</td>
                  <td>{s.time}</td>
                  <td><span className={`status-badge status-${s.status}`}>{s.status}</span></td>
                  <td style={{display:"flex",gap:8}}>
                    <button className="btn-secondary" style={{padding:"4px 10px",fontSize:12}} onClick={() => openEditForm(s)}>Edit</button>
                    <button className="btn-danger" style={{padding:"4px 10px",fontSize:12}} onClick={() => handleCancelSession(s.id, s.survivor)}>Cancel</button>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "var(--mid-gray)" }}>
                    No sessions yet. Click + New Session to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showSessionForm && (
        <div className="modal-overlay">
          <div className="modal case-form">
            <div className="modal-title">{editingSessionId ? "Edit Session" : "New Session"}</div>
            <div className="modal-sub">Add or update counselling appointment details.</div>

            {formError && <div className="error-msg">{formError}</div>}

            <form onSubmit={handleSaveSession}>
              <div className="form-group">
                <label>Survivor Name</label>
                <input
                  type="text"
                  value={formData.survivor}
                  onChange={(event) => onChangeField("survivor", event.target.value)}
                  placeholder="Enter survivor name"
                />
              </div>
              <div className="input-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(event) => onChangeField("date", event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(event) => onChangeField("time", event.target.value)}
                    placeholder="e.g. 10:30 AM"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(event) => onChangeField("status", event.target.value)}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeForm}>Close</button>
                <button type="submit" className="btn-primary" style={{ width: "auto" }}>
                  {editingSessionId ? "Save Changes" : "Add Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminReportsPage({ onBack, onLogout }) {
  const { caseRecords } = useAuth();
  const sortedCases = [...caseRecords].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

  return (
    <div>
      <BackButton onClick={onBack} />
      <PageHeader title="Filed Cases Records" subtitle="Complete records of all user-facing cases" onLogout={onLogout} />
      <div className="card">
        <div className="card-title">All Filed Cases</div>
        <div className="card-sub">Admin module view of every submitted case record</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Survivor</th>
                <th>Type</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedCases.length > 0 ? sortedCases.map((record) => (
                <tr key={record.id}>
                  <td><strong>{record.id}</strong></td>
                  <td>{record.survivorName}</td>
                  <td>{record.type}</td>
                  <td>{record.title}</td>
                  <td>
                    <span className={`status-badge ${record.priority === "urgent" ? "status-pending" : "status-scheduled"}`}>
                      {record.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${record.status === "open" ? "status-pending" : "status-completed"}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{new Date(record.createdAt).toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "var(--mid-gray)" }}>
                    No case records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GenericPage({ page, onBack, onLogout }) {
  const { registeredUsers, caseRecords } = useAuth();
  const [moduleRecords, setModuleRecords] = useState(() => getGenericModuleRecords(page, registeredUsers, caseRecords));
  const [showAddForm, setShowAddForm] = useState(false);
  const [recordTitle, setRecordTitle] = useState("");
  const [recordType, setRecordType] = useState("General");
  const [recordOwner, setRecordOwner] = useState("");
  const [recordDetails, setRecordDetails] = useState("");
  const [reportText, setReportText] = useState("");

  useEffect(() => {
    setModuleRecords(getGenericModuleRecords(page, registeredUsers, caseRecords));
    setShowAddForm(false);
    setReportText("");
  }, [page, registeredUsers, caseRecords]);

  const viewRecords = () => {
    setReportText("");
  };

  const addNewToggle = () => {
    setShowAddForm((previous) => !previous);
    setReportText("");
  };

  const saveNewRecord = (event) => {
    event.preventDefault();
    if (!recordTitle.trim() || !recordDetails.trim()) {
      window.alert("Please enter both title and details.");
      return;
    }

    const newRecord = {
      id: `manual-${Date.now()}`,
      title: recordTitle.trim(),
      type: recordType,
      status: "active",
      owner: recordOwner.trim() || "Admin",
      updatedAt: new Date().toISOString(),
      details: recordDetails.trim(),
    };

    setModuleRecords((previous) => [newRecord, ...previous]);
    setRecordTitle("");
    setRecordType("General");
    setRecordOwner("");
    setRecordDetails("");
    setShowAddForm(false);
  };

  const exportData = () => {
    const payload = JSON.stringify(moduleRecords, null, 2);
    downloadFile(payload, `${page}-records.json`, "application/json");
  };

  const generateReport = () => {
    const totalRecords = moduleRecords.length;
    const activeRecords = moduleRecords.filter((record) => record.status === "active" || record.status === "open").length;
    const typeBreakdown = moduleRecords.reduce((accumulator, record) => {
      const key = record.type || "General";
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    const breakdownText = Object.entries(typeBreakdown)
      .map(([type, count]) => `- ${type}: ${count}`)
      .join("\n");

    const report = [
      `Module: ${NAV_LABELS[page]?.label || page}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Total Records: ${totalRecords}`,
      `Active/Open Records: ${activeRecords}`,
      "Type Breakdown:",
      breakdownText || "- No records",
    ].join("\n");

    setReportText(report);
    downloadFile(report, `${page}-report.txt`, "text/plain");
  };

  return (
    <div>
      <BackButton onClick={onBack} />
      <PageHeader title={NAV_LABELS[page]?.label || page} subtitle={`Manage and view ${NAV_LABELS[page]?.label?.toLowerCase()}`} onLogout={onLogout} />
      <div className="card">
        <div className="notice info">
          <span>✅</span>
          <div>Module tools are active. Use the actions below to view records, add items, export data, and generate reports.</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginTop:16}}>
          <button className="btn-secondary" style={{padding:"16px",textAlign:"center",display:"block"}} onClick={viewRecords}>View Records</button>
          <button className="btn-secondary" style={{padding:"16px",textAlign:"center",display:"block"}} onClick={addNewToggle}>{showAddForm ? "Close Add" : "Add New"}</button>
          <button className="btn-secondary" style={{padding:"16px",textAlign:"center",display:"block"}} onClick={exportData}>Export Data</button>
          <button className="btn-secondary" style={{padding:"16px",textAlign:"center",display:"block"}} onClick={generateReport}>Generate Report</button>
        </div>

        {showAddForm && (
          <form className="case-form" onSubmit={saveNewRecord} style={{marginTop:20}}>
            <div className="input-row">
              <div className="form-group">
                <label>Title</label>
                <input value={recordTitle} onChange={(event) => setRecordTitle(event.target.value)} placeholder="Record title" />
              </div>
              <div className="form-group">
                <label>Type</label>
                <input value={recordType} onChange={(event) => setRecordType(event.target.value)} placeholder="Type" />
              </div>
            </div>
            <div className="input-row">
              <div className="form-group">
                <label>Owner</label>
                <input value={recordOwner} onChange={(event) => setRecordOwner(event.target.value)} placeholder="Owner name" />
              </div>
              <div className="form-group">
                <label>Details</label>
                <input value={recordDetails} onChange={(event) => setRecordDetails(event.target.value)} placeholder="Record details" />
              </div>
            </div>
            <button type="submit" className="btn-primary">Save Record</button>
          </form>
        )}

        {reportText && (
          <div className="notice success" style={{marginTop:20,whiteSpace:"pre-line"}}>
            <span>📄</span>
            <div>{reportText}</div>
          </div>
        )}

        <div className="table-wrap" style={{marginTop:20}}>
          <table>
            <thead>
              <tr><th>ID</th><th>Title</th><th>Type</th><th>Status</th><th>Owner</th><th>Updated</th><th>Details</th></tr>
            </thead>
            <tbody>
              {moduleRecords.length > 0 ? moduleRecords.map((record) => (
                <tr key={record.id}>
                  <td><strong>{record.id}</strong></td>
                  <td>{record.title}</td>
                  <td>{record.type}</td>
                  <td><span className="status-badge status-active">{record.status}</span></td>
                  <td>{record.owner}</td>
                  <td>{new Date(record.updatedAt).toLocaleString()}</td>
                  <td>{record.details}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "var(--mid-gray)" }}>
                    No records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ROUTER ──────────────────────────────────────────────────────────────
function PageRouter({ page, user, onBack, onLogout, onNavigate }) {
  if (page === "dashboard") {
    if (user.role === "admin") return <AdminDashboard onLogout={onLogout} />;
    if (user.role === "survivor") return <SurvivorDashboard onLogout={onLogout} />;
    if (user.role === "counsellor") return <CounsellorDashboard onLogout={onLogout} onNavigate={onNavigate} />;
    if (user.role === "legal") return <LegalDashboard onLogout={onLogout} onNavigate={onNavigate} />;
  }
  if (page === "reports" && user.role === "admin") return <AdminReportsPage onBack={onBack} onLogout={onLogout} />;
  if (page === "resources") return <ResourcesPage onBack={onBack} onLogout={onLogout} />;
  if (page === "legal" || page === "rights") return <LegalRightsPage onBack={onBack} onLogout={onLogout} />;
  if (page === "chat") return <ChatPage onBack={onBack} onLogout={onLogout} />;
  if (page === "safety") return <SafetyPlanPage onBack={onBack} onLogout={onLogout} />;
  if (page === "sessions") return <SessionsPage onBack={onBack} onLogout={onLogout} />;
  return <GenericPage page={page} onBack={onBack} onLogout={onLogout} />;
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [showIntro, setShowIntro] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState(() => getAllUsers());
  const [caseRecords, setCaseRecords] = useState(() => getStoredCases());

  useEffect(() => {
    const syncStorage = () => {
      setRegisteredUsers(getAllUsers());
      setCaseRecords(getStoredCases());
    };
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  const handleLogin = (u) => { setUser(u); setActivePage("dashboard"); };
  const handleLogout = () => { setUser(null); setActivePage("dashboard"); };
  const refreshUsers = () => setRegisteredUsers(getAllUsers());
  const fileCase = ({ user: reportUser, type, title, description, priority }) => {
    const createdCase = createCaseRecord({ user: reportUser, type, title, description, priority });
    setCaseRecords(getStoredCases());
    return createdCase;
  };

  return (
    <AuthContext.Provider value={{ registeredUsers, caseRecords, fileCase, user, refreshUsers }}>
      {showIntro && <NetflixIntro onComplete={() => setShowIntro(false)} />}
      {!user ? (
        <Login onLogin={handleLogin} onUsersChanged={refreshUsers} />
      ) : (
        <>
          <div className="emergency-banner">
            🆘 If you are in immediate danger, call <a href="tel:100">Police: 100</a> or National DV Helpline: <a href="tel:18001234567">1800-123-4567</a> — Available 24/7
          </div>
          <div className="app-layout">
            <Sidebar user={user} activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
            <main className="main-content">
              <PageRouter page={activePage} user={user} onBack={() => setActivePage("dashboard")} onLogout={handleLogout} onNavigate={setActivePage} />
            </main>
          </div>
        </>
      )}
    </AuthContext.Provider>
  );
}