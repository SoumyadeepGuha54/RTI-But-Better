import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStore, DEMO_EMAIL, DEMO_PASSWORD } from "../store/DemoStore";
import { ShieldCheck, Info } from "lucide-react";

export function SignIn() {
  const { signedIn, signIn } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");

  if (signedIn) return <Navigate to="/dashboard" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signIn(email, password);
    if (result.ok) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-aside">
        <div>
          <span className="brand-mark">RTI</span>
          <h1>
            Access your <em>applications and appeals</em> in one place.
          </h1>
          <p>
            This demo uses a single set of mock credentials to simulate the citizen portal experience.
          </p>
        </div>
        <div className="auth-note">
          <ShieldCheck size={20} />
          <span>
            Mock authentication — no real personal data is transmitted or stored.
          </span>
        </div>
      </div>
      <div className="auth-card">
        <form onSubmit={handleSubmit}>
          <div className="form-title">
            <h2>Sign in to Demo</h2>
            <p>Use the provided mock credentials.</p>
          </div>
          
          <div className="demo-login">
            <Info size={14} style={{ float: 'left', marginRight: '6px' }} />
            <span>Demo credentials</span>
            <b>{DEMO_EMAIL} / {DEMO_PASSWORD}</b>
          </div>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          
          {error && <p className="field-error">{error}</p>}
          
          <button type="submit" className="button">
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}
