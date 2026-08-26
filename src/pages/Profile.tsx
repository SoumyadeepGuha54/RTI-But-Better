import { useState } from "react";
import { useStore } from "../store/DemoStore";
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui";

export function Profile() {
  const { signedIn, profile, updateProfile, resetDemo } = useStore();
  const [formData, setFormData] = useState(profile);

  if (!signedIn) return <Navigate to="/signin" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    alert("Profile updated in demo store.");
  };

  return (
    <section className="narrow-page">
      <div className="form-title">
        <h1>Your Profile</h1>
        <p>Update your applicant details. This will be auto-filled in new applications.</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="field-grid">
          <label className="field">
            <span>Name</span>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Phone</span>
            <input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Address Line 1</span>
            <input
              value={formData.address1}
              onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Address Line 2</span>
            <input
              value={formData.address2}
              onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
            />
          </label>
          <label className="field">
            <span>City</span>
            <input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </label>
          <label className="field">
            <span>State</span>
            <input
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </label>
          <label className="field">
            <span>PIN Code</span>
            <input
              value={formData.pin}
              onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
            />
          </label>
        </div>
        <div className="form-nav">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>

      <div className="form-card" style={{ marginTop: 40, border: '1px solid #e7c392', background: '#fff7e9' }}>
        <h2 style={{ fontSize: 18, margin: '0 0 10px', color: '#744300' }}>Reset Demo</h2>
        <p style={{ fontSize: 13, margin: '0 0 20px', color: '#744300' }}>
          This will wipe all your applications, appeals, and notifications, restoring the default seeded mock data.
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset demo data?")) resetDemo();
          }}
          className="button"
          style={{ background: '#744300', color: 'white' }}
        >
          Reset Demo Data
        </button>
      </div>
    </section>
  );
}
