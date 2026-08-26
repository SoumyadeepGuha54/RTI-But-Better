/** Page chrome: the demo banner, header, main region and footer. */

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Info, X } from "lucide-react";
import { Header } from "./Header";
import { DEMO_EMAIL, DEMO_PASSWORD } from "../store/DemoStore";

/**
 * A slim banner so a first-time visitor (a hackathon judge) can see the demo
 * credentials without hunting for them. Dismissible, and remembered.
 */
function DemoBanner() {
  const [hidden, setHidden] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem("rti-demo-banner") === "off",
  );
  if (hidden) return null;
  return (
    <div className="demo-banner">
      <Info size={15} aria-hidden />
      <p>
        Prototype with mock data — nothing here is an official record. Sign in
        with <b>{DEMO_EMAIL}</b> / <b>{DEMO_PASSWORD}</b>.
      </p>
      <button
        type="button"
        onClick={() => {
          window.localStorage.setItem("rti-demo-banner", "off");
          setHidden(true);
        }}
        aria-label="Dismiss demo notice"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <div className="brand footer-brand">
          <span className="brand-mark">RTI</span>
          <span>
            Online <i>Demo</i>
          </span>
        </div>
        <p>
          A demonstration application built with mock data for a hackathon. It
          is not connected to the Government of India, the Central Information
          Commission, or any official RTI system.
        </p>
      </div>
      <div className="footer-links">
        <Link to="/file-rti">File an RTI</Link>
        <Link to="/track">Track application</Link>
        <Link to="/appeal">First appeal</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/help">Help centre</Link>
        <Link to="/profile">Your profile</Link>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  // Every route change should start at the top of the new page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <DemoBanner />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
