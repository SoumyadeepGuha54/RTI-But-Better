import { Link, Navigate } from "react-router-dom";
import { useStore } from "../store/DemoStore";
import { StatusBadge } from "../components/StatusBadge";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

export function Dashboard() {
  const { signedIn, applications, appeals } = useStore();
  const [query, setQuery] = useState("");

  if (!signedIn) return <Navigate to="/signin" />;

  const filteredApps = applications.filter(
    (app) =>
      app.registration.toLowerCase().includes(query.toLowerCase()) ||
      app.authority.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="dashboard">
      <div className="dashboard-head">
        <div>
          <h1>Dashboard</h1>
          <p>Manage and track your RTI applications and appeals.</p>
        </div>
        <Link className="button" to="/file-rti">
          <Plus size={17} /> New Application
        </Link>
      </div>

      <div className="stats">
        <div className="stat">
          <strong>{applications.length}</strong>
          <span>Total Applications</span>
        </div>
        <div className="stat">
          <strong>{applications.filter(a => a.status === 'Draft').length}</strong>
          <span>Drafts</span>
        </div>
        <div className="stat">
          <strong>{applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length}</strong>
          <span>In Progress</span>
        </div>
        <div className="stat">
          <strong>{applications.filter(a => a.status === 'Response Available' || a.status === 'Closed').length}</strong>
          <span>Resolved</span>
        </div>
        <div className="stat">
          <strong>{appeals.length}</strong>
          <span>Appeals Filed</span>
        </div>
      </div>

      <div className="applications-panel">
        <div className="panel-heading">
          <div>
            <h2>Your Applications</h2>
            <p>Recent activity across all authorities</p>
          </div>
          <label className="search-input compact">
            <Search size={16} />
            <input
              placeholder="Search by ID or Authority"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        {filteredApps.length === 0 ? (
          <div className="empty">
            <h3>No applications found</h3>
            <p>You haven't submitted any RTI applications matching your search.</p>
          </div>
        ) : (
          <div className="app-table">
            <div className="app-table-head">
              <span>Registration ID</span>
              <span>Authority</span>
              <span>Submitted On</span>
              <span>Status</span>
              <span>Last Update</span>
              <span />
            </div>
            {filteredApps.map((app) => (
              <Link
                key={app.registration}
                to={`/applications/${encodeURIComponent(app.registration)}`}
                className="app-row"
              >
                <span>
                  <b>{app.registration}</b>
                  <small>{app.subject}</small>
                </span>
                <span>
                  <b>{app.authority}</b>
                </span>
                <span>
                  <b>{app.date}</b>
                </span>
                <span>
                  <StatusBadge status={app.status} />
                </span>
                <span>
                  <b>{app.updated}</b>
                </span>
                <span>→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
