import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";
import Login from "./Login";

const STATUSES = [
  "Waiting",
  "Called",
  "In Consultation",
  "Completed",
];

const PRIORITY = {
  Emergency: 0,
  Urgent: 1,
  Routine: 2,
};

const EMPTY_FORM = {
  name: "",
  age: "",
  phone: "",
  symptoms: "",
  duration: "Today",
  department: "General Medicine",
  urgency: "Routine",
  notes: "",
};

function createToken() {
  return `SC${Date.now().toString().slice(-7)}${Math.floor(
    Math.random() * 10
  )}`;
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/*function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) throw loginError;
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand-icon">✚</div>
        <h1>SmartCare</h1>
        <p className="login-subtitle">
          Smart Patient Queue &amp; Emergency Triage
        </p>

        <form className="patient-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Staff Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter staff email"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="login-note">
          Sign in using your Supabase staff account.
        </p>
      </section>
    </main>
  );
}*/

function StatCard({ title, value, icon, color }) {
  return (
    <article className={`stat-card ${color}`}>
      <div>
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
      <span className="stat-icon">{icon}</span>
    </article>
  );
}

function PatientForm({ onRegister, saving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const age = Number(form.age);

    if (!Number.isInteger(age) || age < 0 || age > 120) {
      setError("Enter a valid age between 0 and 120.");
      return;
    }

    try {
      await onRegister({
        ...form,
        age,
        token: createToken(),
        status: "Waiting",
      });

      setForm({ ...EMPTY_FORM });
    } catch (err) {
      setError(err.message || "Patient registration failed.");
    }
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Register Patient</h2>
          <p>Enter patient details and reported symptoms.</p>
        </div>
      </div>

      <form className="patient-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label htmlFor="patient-name">Patient Name *</label>
            <input
              id="patient-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label htmlFor="patient-age">Age *</label>
            <input
              id="patient-age"
              name="age"
              type="number"
              min="0"
              max="120"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter age"
              required
            />
          </div>

          <div>
            <label htmlFor="patient-phone">Phone Number *</label>
            <input
              id="patient-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label htmlFor="patient-department">Department</label>
            <select
              id="patient-department"
              name="department"
              value={form.department}
              onChange={handleChange}
            >
              <option>General Medicine</option>
              <option>Emergency</option>
              <option>Cardiology</option>
              <option>Orthopedics</option>
              <option>Pediatrics</option>
              <option>Neurology</option>
              <option>Dermatology</option>
              <option>Other</option>
            </select>
          </div>

          <div className="full-width">
            <label htmlFor="patient-symptoms">
              Symptoms / Condition *
            </label>
            <textarea
              id="patient-symptoms"
              name="symptoms"
              value={form.symptoms}
              onChange={handleChange}
              placeholder="Describe the reported symptoms"
              rows="3"
              required
            />
          </div>

          <div>
            <label htmlFor="patient-duration">Symptom Duration</label>
            <select
              id="patient-duration"
              name="duration"
              value={form.duration}
              onChange={handleChange}
            >
              <option>Today</option>
              <option>1–2 days</option>
              <option>3–7 days</option>
              <option>More than a week</option>
            </select>
          </div>

          <div>
            <label htmlFor="patient-urgency">Urgency *</label>
            <select
              id="patient-urgency"
              name="urgency"
              value={form.urgency}
              onChange={handleChange}
              required
            >
              <option value="Emergency">Emergency</option>
              <option value="Urgent">Urgent</option>
              <option value="Routine">Routine</option>
            </select>
          </div>

          <div className="full-width">
            <label htmlFor="patient-notes">Additional Notes</label>
            <textarea
              id="patient-notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional notes"
              rows="2"
            />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="primary-button" disabled={saving}>
          {saving ? "Registering..." : "Register Patient"}
        </button>
      </form>
    </section>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`status-badge status-${status
        .toLowerCase()
        .replaceAll(" ", "-")}`}
    >
      {status}
    </span>
  );
}

function PatientTable({ patients, onStatusChange, updatingId }) {
  if (patients.length === 0) {
    return (
      <div className="empty-state">
        <h3>No patients found</h3>
        <p>Register a patient or change the search filters.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="patient-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Patient</th>
            <th>Symptoms</th>
            <th>Department</th>
            <th>Urgency</th>
            <th>Status</th>
            <th>Registered</th>
            <th>Update Status</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>
                <strong>{patient.token}</strong>
              </td>

              <td>
                <strong>{patient.name}</strong>
                <small>
                  Age: {patient.age} · {patient.phone}
                </small>
              </td>

              <td className="symptoms-cell">
                {patient.symptoms}
                {patient.notes && <small>Notes: {patient.notes}</small>}
              </td>

              <td>{patient.department}</td>

              <td>
                <span
                  className={`urgency-badge urgency-${(
                    patient.urgency || "routine"
                  ).toLowerCase()}`}
                >
                  {patient.urgency}
                </span>
              </td>

              <td>
                <StatusBadge status={patient.status} />
              </td>

              <td>{formatDate(patient.created_at)}</td>

              <td>
                <select
                  aria-label={`Update status for ${patient.name}`}
                  value={patient.status}
                  disabled={updatingId === patient.id}
                  onChange={(event) =>
                    onStatusChange(patient.id, event.target.value)
                  }
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (!active) return;

        if (sessionError) setError(sessionError.message);
        setSession(data?.session ?? null);
      } catch (err) {
        if (active) setError(err.message || "Unable to check login.");
      } finally {
        if (active) setAuthLoading(false);
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (active) {
        setSession(newSession);
        setAuthLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadPatients = useCallback(async () => {
    if (!session) return;

    setLoadingPatients(true);

    try {
      const { data, error: fetchError } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setPatients(data ?? []);
      setError("");
    } catch (err) {
      setError(
        `${err.message || "Could not load patients."} Check your Supabase table and permissions.`
      );
    } finally {
      setLoadingPatients(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session) {
      setPatients([]);
      return;
    }

    loadPatients();
  }, [session, loadPatients]);

  const orderedPatients = useMemo(() => {
    return [...patients].sort((a, b) => {
      if (a.status === "Completed" && b.status !== "Completed") return 1;
      if (a.status !== "Completed" && b.status === "Completed") return -1;

      const difference =
        (PRIORITY[a.urgency] ?? 3) - (PRIORITY[b.urgency] ?? 3);

      if (difference !== 0) return difference;

      return new Date(a.created_at) - new Date(b.created_at);
    });
  }, [patients]);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orderedPatients.filter((patient) => {
      const matchesSearch =
        !query ||
        [
          patient.name,
          patient.token,
          patient.phone,
          patient.symptoms,
          patient.department,
        ].some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" || patient.status === statusFilter;

      const matchesUrgency =
        urgencyFilter === "All" || patient.urgency === urgencyFilter;

      return matchesSearch && matchesStatus && matchesUrgency;
    });
  }, [orderedPatients, search, statusFilter, urgencyFilter]);

  const stats = useMemo(
    () => ({
      total: patients.length,
      emergency: patients.filter(
        (p) => p.urgency === "Emergency" && p.status !== "Completed"
      ).length,
      waiting: patients.filter((p) => p.status === "Waiting").length,
      consultation: patients.filter(
        (p) => p.status === "In Consultation"
      ).length,
      completed: patients.filter((p) => p.status === "Completed").length,
    }),
    [patients]
  );

  async function registerPatient(patient) {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const { data, error: insertError } = await supabase
        .from("patients")
        .insert([patient])
        .select()
        .single();

      if (insertError) throw insertError;

      setPatients((previous) => [...previous, data]);
      setMessage(`Patient registered successfully. Token: ${data.token}`);
      setPage("Patient Queue");
    } catch (err) {
      setError(err.message || "Patient registration failed.");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function updatePatientStatus(id, newStatus) {
    setUpdatingId(id);
    setError("");
    setMessage("");

    try {
      const { data, error: updateError } = await supabase
        .from("patients")
        .update({ status: newStatus })
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      setPatients((previous) =>
        previous.map((patient) => (patient.id === id ? data : patient))
      );

      setMessage(`Patient status updated to "${newStatus}".`);
    } catch (err) {
      setError(err.message || "Unable to update patient status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function callNextPatient() {
    const nextPatient = orderedPatients.find(
      (patient) => patient.status === "Waiting"
    );

    if (!nextPatient) {
      setMessage("There are no waiting patients.");
      return;
    }

    await updatePatientStatus(nextPatient.id, "Called");
  }

  async function logout() {
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setError(logoutError.message);
    } else {
      setPage("Dashboard");
      setMessage("");
      setError("");
    }
  }

  if (authLoading) {
    return (
      <main className="loading-screen">
        <p>Loading SmartCare...</p>
      </main>
    );
  }

  if (!session) return <Login />;

  const navItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Register Patient", icon: "＋" },
    { name: "Patient Queue", icon: "☷" },
    { name: "Staff Panel", icon: "♙" },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">✚</span>
          <div>
            <h2>SmartCare</h2>
            <small>Patient Management</small>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.name}
              className={`nav-button ${page === item.name ? "active" : ""}`}
              onClick={() => {
                setPage(item.name);
                setMessage("");
                setError("");
              }}
            >
              <span>{item.icon}</span>
              {item.name}
              {item.name === "Patient Queue" && stats.waiting > 0 && (
                <span className="nav-count">{stats.waiting}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="staff-profile">
            <div className="profile-avatar">S</div>
            <div className="profile-info">
              <strong>Healthcare Staff</strong>
              <small>{session.user?.email}</small>
            </div>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={logout}
          >
            ↪ Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="topbar-eyebrow">HEALTHCARE MANAGEMENT</p>
            <h1>{page}</h1>
          </div>

          <div className="topbar-right">
            <span className="live-indicator">
              <span /> Connected
            </span>
            <div className="topbar-date">
              {new Date().toLocaleDateString("en-IN", {
                dateStyle: "medium",
              })}
            </div>
          </div>
        </header>

        {message && (
          <div className="success-message" role="status">
            <span>{message}</span>
            <button type="button" onClick={() => setMessage("")}>
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {page === "Dashboard" && (
          <>
            <section className="welcome-banner">
              <div>
                <span className="welcome-tag">SMARTCARE OVERVIEW</span>
                <h2>Welcome to SmartCare</h2>
                <p>
                  Manage patient flow and help staff prioritize care.
                </p>
                <button
                  type="button"
                  className="welcome-button"
                  onClick={() => setPage("Register Patient")}
                >
                  + Register New Patient
                </button>
              </div>
              <div className="welcome-symbol">✚</div>
            </section>

            <section className="stats-grid">
              <StatCard
                title="Total Patients"
                value={stats.total}
                icon="♙"
                color="stat-blue"
              />
              <StatCard
                title="Emergency"
                value={stats.emergency}
                icon="!"
                color="stat-red"
              />
              <StatCard
                title="Waiting"
                value={stats.waiting}
                icon="◷"
                color="stat-orange"
              />
              <StatCard
                title="In Consultation"
                value={stats.consultation}
                icon="✚"
                color="stat-purple"
              />
              <StatCard
                title="Completed"
                value={stats.completed}
                icon="✓"
                color="stat-green"
              />
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Priority Patient Queue</h2>
                  <p>
                    Priority is a queue aid. Qualified healthcare staff
                    must determine clinical urgency.
                  </p>
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setPage("Patient Queue")}
                >
                  View All Patients →
                </button>
              </div>

              {loadingPatients ? (
                <p className="loading-text">Loading patients...</p>
              ) : (
                <PatientTable
                  patients={orderedPatients.slice(0, 5)}
                  onStatusChange={updatePatientStatus}
                  updatingId={updatingId}
                />
              )}
            </section>
          </>
        )}

        {page === "Register Patient" && (
          <PatientForm onRegister={registerPatient} saving={saving} />
        )}

        {page === "Patient Queue" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Patient Queue</h2>
                <p>Search records and update patient status.</p>
              </div>
              <button
                type="button"
                className="primary-button compact-button"
                onClick={callNextPatient}
              >
                Call Next Patient
              </button>
            </div>

            <div className="filters-row">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, token, phone, symptoms..."
                aria-label="Search patients"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="All">All Statuses</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                aria-label="Filter by urgency"
              >
                <option value="All">All Urgencies</option>
                <option value="Emergency">Emergency</option>
                <option value="Urgent">Urgent</option>
                <option value="Routine">Routine</option>
              </select>
            </div>

            <div className="queue-summary">
              Showing {filteredPatients.length} of {patients.length} patients
            </div>

            {loadingPatients ? (
              <p className="loading-text">Loading patients...</p>
            ) : (
              <PatientTable
                patients={filteredPatients}
                onStatusChange={updatePatientStatus}
                updatingId={updatingId}
              />
            )}
          </section>
        )}

        {page === "Staff Panel" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Staff Panel</h2>
                <p>Manage patient flow from registration to completion.</p>
              </div>
            </div>

            <div className="staff-summary-grid">
              <article className="staff-summary-card">
                <span>Waiting</span>
                <h3>{stats.waiting}</h3>
                <p>Patients awaiting a call</p>
              </article>

              <article className="staff-summary-card">
                <span>In Consultation</span>
                <h3>{stats.consultation}</h3>
                <p>Patients currently being seen</p>
              </article>

              <article className="staff-summary-card">
                <span>Completed</span>
                <h3>{stats.completed}</h3>
                <p>Consultations marked complete</p>
              </article>
            </div>

            <div className="staff-action">
              <div>
                <h3>Call the Next Patient</h3>
                <p>
                  Calls the highest-priority waiting patient in the queue.
                </p>
              </div>
              <button
                type="button"
                className="primary-button"
                onClick={callNextPatient}
              >
                Call Next Patient
              </button>
            </div>

            <div className="staff-action">
              <div>
                <h3>Refresh Patient Data</h3>
                <p>Fetch the latest records from Supabase.</p>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={loadPatients}
              >
                ↻ Refresh
              </button>
            </div>
          </section>
        )}

        <footer className="app-footer">
          <span>SmartCare Patient Queue System</span>
          <span>
            Clinical triage decisions must be made by qualified staff.
          </span>
        </footer>
      </main>
    </div>
  );
}