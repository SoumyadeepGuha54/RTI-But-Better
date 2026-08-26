import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileCheck2,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "../store/DemoStore";

function ActionCard({
  number,
  title,
  text,
  action,
  to,
  icon,
}: {
  number: string;
  title: string;
  text: string;
  action: string;
  to: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="action-card">
      <div className="card-top">
        <span className="card-number">{number}</span>
        <span className="card-icon">{icon}</span>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <Link to={to} className="card-link">
        {action}
        <ArrowRight size={16} aria-hidden />
      </Link>
    </article>
  );
}

export function Home() {
  const { signedIn, applications } = useStore();

  return (
    <>
      <section className="home-hero">
        <div className="eyebrow">
          <span />A clear route to information
        </div>
        <h1>
          File and manage your <em>RTI applications</em> online.
        </h1>
        <p>
          Submit a Right to Information request to a participating Central
          Government public authority, follow it through every stage, and file a
          First Appeal when the reply falls short.
        </p>
        <div className="hero-actions">
          <Link to="/file-rti" className="button">
            Start an application
            <ArrowRight size={17} aria-hidden />
          </Link>
          <Link to="/track" className="text-link">
            Already have a registration number? Track it
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
        <div className="hero-ledger">
          <span>
            <b>01</b> Choose your authority
          </span>
          <span>
            <b>02</b> Submit your request
          </span>
          <span>
            <b>03</b> Follow its progress
          </span>
        </div>
      </section>

      <section className="action-section">
        <div className="section-heading">
          <span className="eyebrow">
            <span />
            Start here
          </span>
          <h2>What do you need to do?</h2>
          <p>
            Three paths through the Act. Each one keeps you informed at every
            stage.
          </p>
        </div>
        <div className="action-grid">
          <ActionCard
            number="01"
            title="File an RTI application"
            text="Submit a new request for records held by a public authority."
            action="Start application"
            to="/file-rti"
            icon={<FileText size={18} aria-hidden />}
          />
          <ActionCard
            number="02"
            title="Track an application"
            text="Check the current stage of an application with its registration number."
            action="Track application"
            to="/track"
            icon={<Search size={18} aria-hidden />}
          />
          <ActionCard
            number="03"
            title="File a First Appeal"
            text="Appeal to the First Appellate Authority against a refusal or silence."
            action="Start First Appeal"
            to="/appeal"
            icon={<FileCheck2 size={18} aria-hidden />}
          />
        </div>
      </section>

      <section className="trust-strip">
        <ShieldCheck aria-hidden />
        <div>
          <strong>Your information stays in your browser.</strong>
          <span>
            This prototype has no server. Every application, payment and reply
            is mock data held in local storage.
          </span>
        </div>
        <Link to="/help">
          How the demo works
          <ArrowRight size={15} aria-hidden />
        </Link>
      </section>

      <section className="help-prompt">
        <div>
          <span className="eyebrow">
            <span />
            {signedIn ? "Your account" : "Not sure where to start?"}
          </span>
          <h2>
            {signedIn
              ? `You have ${applications.length} application${applications.length === 1 ? "" : "s"} on record.`
              : "The Help centre answers the common questions."}
          </h2>
          <p>
            {signedIn
              ? "Open your dashboard to see every status, response and appeal in one place."
              : "What can be requested, what a first appeal is for, and what the ₹10 fee covers."}
          </p>
        </div>
        <Link className="button outline" to={signedIn ? "/dashboard" : "/help"}>
          {signedIn ? "Open dashboard" : "Visit Help centre"}
          <ArrowRight size={16} aria-hidden />
        </Link>
      </section>
    </>
  );
}
