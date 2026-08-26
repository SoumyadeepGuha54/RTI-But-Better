import { useState } from "react";
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Download,
  FileText,
  LockKeyhole,
  Search,
  Upload,
  X,
} from "lucide-react";
import { authorities } from "./data";
import type { Application, Applicant } from "./lib/types";
import { allStates } from "./data/states";
import { useStore } from "./store/DemoStore";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { StatusBadge } from "./components/StatusBadge";
import { Stepper } from "./components/Stepper";
import { Button, Notice } from "./components/ui";
import { Dashboard as DashboardPage } from "./pages/Dashboard";
import { Track as TrackPage } from "./pages/Track";
import { Profile as ProfilePage } from "./pages/Profile";
import { SignIn as SignInPage } from "./pages/SignIn";
import { applicationStages, appealGrounds, canAppeal, reachedStageIndex } from "./lib/lifecycle";
import { Timeline } from "./components/Timeline";

const defaultApplicant: Applicant = { name: "", email: "", phone: "", address1: "", address2: "", city: "", state: "", pin: "" };
const filingSteps = ["Applicant details", "Public authority", "Your request", "Documents", "Review", "Payment"];

// Cleaned up unused components
function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <i>Required</i>}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
      />
      {error && <small className="input-error">{error}</small>}
    </label>
  );
}

function FileRTI({ onAdd, applicantStart }: { onAdd: (app: Application) => void; applicantStart: Applicant }) {
  const nav = useNavigate();
  const [eligible, setEligible] = useState<"central" | "other" | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [step, setStep] = useState(0);
  const [applicant, setApplicant] = useState<Applicant>(applicantStart);
  const [chosenAuthority, setChosenAuthority] = useState<
    (typeof authorities)[number] | null
  >(null);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [request, setRequest] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [payment, setPayment] = useState("UPI");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState<Application | null>(null);
  const updateApplicant = (key: keyof Applicant, value: string) =>
    setApplicant((current) => ({ ...current, [key]: value }));
  const validate = () => {
    const nextErrs: Record<string, string> = {};
    if (step === 0) {
      if (!applicant.name.trim()) nextErrs.name = "Enter your full name.";
      if (!/^\S+@\S+\.\S+$/.test(applicant.email))
        nextErrs.email = "Enter a valid email address.";
      if (!/^\d{10}$/.test(applicant.phone.replace(/\s/g, "")))
        nextErrs.phone = "Enter a valid 10-digit mobile number.";
      if (!applicant.address1.trim()) nextErrs.address1 = "Enter your address.";
      if (!applicant.city.trim()) nextErrs.city = "Enter your city.";
      if (!applicant.state) nextErrs.state = "Select your state.";
      if (!/^\d{6}$/.test(applicant.pin))
        nextErrs.pin = "Enter a valid 6-digit PIN code.";
    }
    if (step === 1 && !chosenAuthority)
      nextErrs.authority = "Select a public authority before continuing.";
    if (step === 2) {
      if (!subject.trim())
        nextErrs.subject = "Please enter a subject for your request.";
      if (!request.trim())
        nextErrs.request =
          "Describe the information you are requesting before continuing.";
    }
    if (step === 4 && !confirmed)
      nextErrs.confirmed =
        "Confirm that your information is accurate before continuing.";
    setErrors(nextErrs);
    return Object.keys(nextErrs).length === 0;
  };
  const next = () => {
    if (validate()) {
      if (step < 5) setStep(step + 1);
    }
  };
  const create = (isDraft: boolean) => {
    const code =
      chosenAuthority?.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 4)
        .toUpperCase() ?? "RTI";
    const registration = `${isDraft ? "DRAFT" : "RTI"}/2026/${code}/${Math.floor(100000 + Math.random() * 899999)}`;
    const app: Application = {
      registration,
      authority: chosenAuthority?.name ?? "Public authority",
      date: "26 Aug 2026",
      status: isDraft ? "Draft" : "Submitted",
      updated: "Just now",
      subject: subject || "Untitled draft",
      request: request || "Draft request",
      applicant,
      fee: isDraft ? 0 : payment === "Fee Exempt" ? 0 : 10,
      feePaid: !isDraft,
      paymentMethod: isDraft ? undefined : payment,
      attachment: file ? { name: file.name, size: file.size } : undefined,
      timeline: [
        {
          stage: "created",
          detail: "Your application was saved.",
          time: "Just now",
        },
        ...(isDraft
          ? []
          : [
              {
                stage: "submitted",
                detail: "Your RTI application was received.",
                time: "Just now",
              },
            ]),
      ],
    };
    onAdd(app);
    if (isDraft) {
      setSaved(true);
      return;
    }
    setSubmitted(app);
  };
  if (submitted)
    return (
      <SubmissionSuccess
        app={submitted}
        onDashboard={() => nav("/dashboard")}
      />
    );
  if (!eligible)
    return (
      <section className="narrow-page">
        <div className="eyebrow">
          <span /> Before you file
        </div>
        <h1>Let’s make sure you’re in the right place.</h1>
        <p className="lede">
          This demo supports participating Central Government public
          authorities.
        </p>
        <div className="choice-stack">
          {[
            [
              "central",
              "Central Government Ministry or Department",
              "For example, Ministry of Education or Ministry of Railways.",
            ],
            [
              "central",
              "Central Government Organisation",
              "For example, National Informatics Centre or CPWD.",
            ],
            [
              "other",
              "Union Territory Administration",
              "We’ll help you understand whether this demo supports it.",
            ],
            [
              "other",
              "Other / Not sure",
              "Check the scope of this portal before continuing.",
            ],
          ].map(([value, title, text]) => (
            <button
              key={title}
              onClick={() => setEligible(value as "central" | "other")}
            >
              <b>{title}</b>
              <span>{text}</span>
              <ChevronRight />
            </button>
          ))}
        </div>
      </section>
    );
  if (eligible === "other" && !acknowledged)
    return (
      <section className="narrow-page">
        <div className="eyebrow">
          <span>Portal eligibility</span>
        </div>
        <h1>Check the authority before continuing.</h1>
        <Notice type="warning">
          <strong>
            This portal may not be the correct place for your application.
          </strong>
          <p>
            State authorities and many local bodies use a different RTI portal.
          </p>
        </Notice>
        <div className="button-row">
          <Button onClick={() => setAcknowledged(true)}>
            I understand, continue
          </Button>
          <Link className="button outline" to="/help">
            Learn more
          </Link>
        </div>
      </section>
    );
  return (
    <section className="wizard-page">
      <div className="wizard-header">
        <div>
          <span className="eyebrow">
            <span /> File an RTI
          </span>
          <h1>New application</h1>
          <p>Save your progress anytime. Required fields are marked clearly.</p>
        </div>
        <button className="save-draft" onClick={() => create(true)}>
          <FileText size={17} />
          Save draft
        </button>
        {saved && (
          <span className="saved-note">
            <Check size={15} />
            Draft saved to dashboard
          </span>
        )}
      </div>
      <Stepper steps={filingSteps} current={step} />
      <div className="wizard-layout">
        <section className="form-card">
          {step === 0 && (
            <ApplicantStep
              value={applicant}
              update={updateApplicant}
              errors={errors}
            />
          )}{" "}
          {step === 1 && (
            <AuthorityStep
              query={query}
              setQuery={setQuery}
              selected={chosenAuthority}
              setSelected={setChosenAuthority}
              error={errors.authority}
            />
          )}{" "}
          {step === 2 && (
            <RequestStep
              subject={subject}
              setSubject={setSubject}
              request={request}
              setRequest={setRequest}
              errors={errors}
            />
          )}{" "}
          {step === 3 && <DocumentStep file={file} setFile={setFile} />}{" "}
          {step === 4 && (
            <ReviewStep
              applicant={applicant}
              authority={chosenAuthority}
              subject={subject}
              request={request}
              file={file}
              confirmed={confirmed}
              setConfirmed={setConfirmed}
              error={errors.confirmed}
              onEdit={setStep}
            />
          )}{" "}
          {step === 5 && (
            <PaymentStep
              payment={payment}
              setPayment={setPayment}
              onSuccess={() => create(false)}
            />
          )}
          <div className="form-nav">
            {step > 0 ? (
              <Button className="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <Link className="button outline" to="/">
                Cancel
              </Link>
            )}
            {step < 5 && (
              <Button onClick={next}>
                {step === 4 ? "Continue to payment" : "Continue"}
                <ArrowRight size={17} />
              </Button>
            )}
          </div>
        </section>
        <aside className="wizard-aside">
          <span className="aside-label">YOUR PROGRESS</span>
          <p>
            {step < 2
              ? "We only ask for details needed to process your request."
              : "A clear, focused request helps the authority respond."}
          </p>
          <div className="privacy-mini">
            <LockKeyhole size={17} />
            <span>
              All application data is mock data stored in this browser.
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
function ApplicantStep({
  value,
  update,
  errors,
}: {
  value: Applicant;
  update: (key: keyof Applicant, value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <>
      <div className="form-title">
        <h2>About you</h2>
        <p>
          Use the contact details where you can receive updates about this
          application.
        </p>
      </div>
      <div className="field-grid">
        <Field
          label="Full name"
          required
          value={value.name}
          onChange={(v) => update("name", v)}
          error={errors.name}
          placeholder="As on your identification document"
        />
        <Field
          label="Email address"
          required
          type="email"
          value={value.email}
          onChange={(v) => update("email", v)}
          error={errors.email}
          placeholder="name@example.com"
        />
        <Field
          label="Mobile number"
          required
          value={value.phone}
          onChange={(v) => update("phone", v.replace(/\D/g, "").slice(0, 10))}
          error={errors.phone}
          placeholder="10-digit mobile number"
        />
        <Field
          label="PIN code"
          required
          value={value.pin}
          onChange={(v) => update("pin", v.replace(/\D/g, "").slice(0, 6))}
          error={errors.pin}
          placeholder="6 digits"
        />
        <Field
          label="Address line 1"
          required
          value={value.address1}
          onChange={(v) => update("address1", v)}
          error={errors.address1}
          placeholder="House number, street, locality"
        />
        <Field
          label="Address line 2"
          value={value.address2}
          onChange={(v) => update("address2", v)}
          placeholder="Optional"
        />
        <Field
          label="City"
          required
          value={value.city}
          onChange={(v) => update("city", v)}
          error={errors.city}
          placeholder="Your city"
        />
        <label className="field">
          <span>
            State<i>Required</i>
          </span>
          <select
            value={value.state}
            onChange={(e) => update("state", e.target.value)}
          >
            <option value="">Select your state or union territory</option>
            {allStates.map((state) => (
              <option key={state}>{state}</option>
            ))}
          </select>
          {errors.state && (
            <small className="input-error">{errors.state}</small>
          )}
        </label>
      </div>
    </>
  );
}
function AuthorityStep({ query, setQuery, selected, setSelected, error }: any) {
  const items = authorities.filter((item) =>
    `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="form-title">
        <h2>Choose a public authority</h2>
        <p>Select the authority most likely to hold the records you need.</p>
      </div>
      <label className="search-input">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by authority or department"
        />
      </label>
      {error && <p className="field-error">{error}</p>}
      <div className="authority-list">
        {items.map((item) => (
          <button
            type="button"
            className={selected?.id === item.id ? "selected" : ""}
            onClick={() => setSelected(item)}
            key={item.name}
          >
            <span>
              <b>{item.name}</b>
              <small>
                {item.category} · {item.description}
              </small>
            </span>
            {selected?.id === item.id && <CheckCircle2 size={20} />}
          </button>
        ))}
      </div>
      {selected && (
        <div className="selection-panel">
          <span>YOU ARE FILING THIS RTI WITH</span>
          <strong>{selected.name}</strong>
        </div>
      )}
    </>
  );
}
function RequestStep({
  subject,
  setSubject,
  request,
  setRequest,
  errors,
}: any) {
  return (
    <>
      <div className="form-title">
        <h2>Describe the information you need</h2>
        <p>
          Ask for specific records or information. Avoid unnecessary personal
          information.
        </p>
      </div>
      <label className="field">
        <span>
          Subject<i>Required</i>
        </span>
        <input
          maxLength={150}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="For example: Records of accessibility work at..."
        />
        <small className={errors.subject ? "input-error" : ""}>
          {errors.subject || `${subject.length}/150 characters`}
        </small>
      </label>
      <label className="field">
        <span>
          Request for information<i>Required</i>
        </span>
        <textarea
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="Please provide certified copies of..."
        />
        <small className={errors.request ? "input-error" : ""}>
          {errors.request || `${request.length} characters`}
        </small>
      </label>
      <div className="writing-help">
        <CircleHelp size={19} />
        <div>
          <strong>Writing a clear request</strong>
          <p>
            Be specific. Include relevant dates or reference numbers. Ask for
            identifiable records rather than an explanation.
          </p>
        </div>
      </div>
    </>
  );
}
function DocumentStep({
  file,
  setFile,
}: {
  file: File | null;
  setFile: (file: File | null) => void;
}) {
  return (
    <>
      <div className="form-title">
        <h2>Supporting documents</h2>
        <p>
          Documents are optional unless the authority needs one to process your
          request.
        </p>
      </div>
      <label className="upload-zone">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <Upload size={25} />
        <strong>{file ? file.name : "Choose a file or drag it here"}</strong>
        <span>
          {file
            ? `${(file.size / 1024).toFixed(1)} KB · ready to attach`
            : "PDF, JPG, JPEG or PNG · Maximum 10 MB"}
        </span>
      </label>
      {file && (
        <div className="uploaded-file">
          <FileText size={19} />
          <span>
            <b>{file.name}</b>
            <small>Ready to attach</small>
          </span>
          <button onClick={() => setFile(null)} aria-label="Remove file">
            <X size={17} />
          </button>
        </div>
      )}
      <Notice>
        <strong>Upload only what is relevant.</strong>
        <p>Do not include identity documents or unrelated personal details.</p>
      </Notice>
    </>
  );
}
function ReviewStep({
  applicant,
  authority,
  subject,
  request,
  file,
  confirmed,
  setConfirmed,
  error,
  onEdit,
}: {
  applicant: Applicant;
  authority: any;
  subject: string;
  request: string;
  file: File | null;
  confirmed: boolean;
  setConfirmed: (value: boolean) => void;
  error?: string;
  onEdit: (step: number) => void;
}) {
  return (
    <>
      <div className="form-title">
        <h2>Review your application</h2>
        <p>Check each section before you continue to the demo payment.</p>
      </div>
      <ReviewRow
        title="Applicant details"
        value={
          applicant.name
            ? `${applicant.name} · ${applicant.email} · ${applicant.phone}`
            : "Not provided"
        }
        onEdit={() => onEdit(0)}
      />
      <ReviewRow
        title="Public authority"
        value={authority?.name ?? "Not selected"}
        onEdit={() => onEdit(1)}
      />
      <ReviewRow
        title="RTI request"
        value={subject || "Not provided"}
        detail={request || undefined}
        onEdit={() => onEdit(2)}
      />
      <ReviewRow
        title="Supporting documents"
        value={file?.name ?? "No documents attached"}
        onEdit={() => onEdit(3)}
      />
      <label className="confirm">
        <input
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          type="checkbox"
          required
        />
        <span>I confirm that the information provided is accurate.</span>
      </label>
      {error && <p className="field-error">{error}</p>}
    </>
  );
}
function ReviewRow({
  title,
  value,
  detail,
  onEdit,
}: {
  title: string;
  value: React.ReactNode;
  detail?: string;
  onEdit?: () => void;
}) {
  return (
    <article className="review-row">
      <div>
        <span>{title}</span>
        <b>{value}</b>
        {detail && <p>{detail}</p>}
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }}
        >
          Edit
        </button>
      )}
    </article>
  );
}
function PaymentStep({
  payment,
  setPayment,
  onSuccess,
}: {
  payment: string;
  setPayment: (value: string) => void;
  onSuccess: () => void;
}) {
  const [showQr, setShowQr] = useState(false);
  const methods = ["UPI", "Debit / Credit Card", "Net Banking", "Fee Exempt"];
  if (showQr)
    return (
      <div className="payment-qr">
        <div className="qr-grid" aria-label="Demo payment QR code">
          {Array.from({ length: 121 }, (_, i) => (
            <i key={i} className={(i * 13 + (i % 7)) % 5 === 0 ? "on" : ""} />
          ))}
        </div>
        <span className="aside-label">DEMO PAYMENT</span>
        <h3>Scan to simulate payment</h3>
        <p>
          No payment is processed. Confirm below to complete this demo
          transaction.
        </p>
        <Button onClick={onSuccess}>
          <CheckCircle2 size={17} />
          Payment successful
        </Button>
        <button className="resend" onClick={() => setShowQr(false)}>
          Choose another method
        </button>
      </div>
    );
  return (
    <>
      <div className="form-title">
        <h2>Application fee</h2>
        <p>Choose how you’d like to make a demo payment.</p>
      </div>
      <Notice>
        <strong>
          Demo payment environment — no real money will be charged.
        </strong>
        <p>This simulation does not connect to any payment provider.</p>
      </Notice>
      <div className="payment-methods">
        {methods.map((method) => (
          <label key={method} className={payment === method ? "selected" : ""}>
            <input
              type="radio"
              checked={payment === method}
              onChange={() => setPayment(method)}
            />
            <span>
              {method === "UPI" ? "◉" : method === "Fee Exempt" ? "◇" : "▣"}
            </span>
            {method}
            <Check size={17} />
          </label>
        ))}
      </div>
      <div className="payment-summary">
        <span>Application fee</span>
        <strong>{payment === "Fee Exempt" ? "₹0" : "₹10"}</strong>
      </div>
      <Button onClick={() => setShowQr(true)}>
        Pay & submit <ArrowRight size={17} />
      </Button>
    </>
  );
}
function SubmissionSuccess({
  app,
  onDashboard,
}: {
  app: Application;
  onDashboard: () => void;
}) {
  return (
    <section className="success-page">
      <div className="success-stamp">
        <Check size={37} />
      </div>
      <span className="eyebrow">
        <span /> Submission complete
      </span>
      <h1>Application submitted successfully.</h1>
      <p>
        Your application has been added to your dashboard and a notification has
        been generated.
      </p>
      <div className="registration-card">
        <span>REGISTRATION NUMBER</span>
        <strong>{app.registration}</strong>
        <div>
          <span>Submitted</span>
          <b>{app.date}</b>
          <span>Public authority</span>
          <b>{app.authority}</b>
          <span>Current status</span>
          <StatusBadge status="Submitted" />
        </div>
      </div>
      <div className="button-row">
        <button className="button" onClick={() => window.print()}>
          <Download size={17} />
          Download acknowledgement
        </button>
        <Button className="outline" onClick={onDashboard}>
          Return to dashboard
        </Button>
      </div>
      <p className="demo-document">
        Demo / Mock RTI Portal — Not an official government document
      </p>
    </section>
  );
}

function ApplicationDetails() {
  const { registration = "" } = useParams();
  const { findApplication } = useStore();
  const app = findApplication(registration);
  if (!app) return <section className="narrow-page"><h1>Application not found</h1><p>Check the registration number in your dashboard.</p><Link className="button" to="/dashboard">Go to dashboard</Link></section>;
  return <section className="detail-page"><Link to="/dashboard" className="back-link">← Back to dashboard</Link><div className="detail-head"><div><span className="eyebrow"><span/> Application overview</span><h1>{app.registration}</h1><p>{app.authority}</p></div><StatusBadge status={app.status} size="large"/></div><div className="detail-meta"><span>Submitted <b>{app.date}</b></span><span>Last updated <b>{app.updated}</b></span><span>Payment <b>{app.feePaid ? "Paid" : "Pending"}</b></span></div><div className="detail-grid"><section><article className="detail-card"><h2>Status timeline</h2><Timeline stages={applicationStages} entries={app.timeline} reached={reachedStageIndex(app)}/></article><article className="detail-card"><h2>Application information</h2><ReviewRow title="Applicant" value={app.applicant.name}/><ReviewRow title="Contact" value={`${app.applicant.email} · +91 ••••••${app.applicant.phone.slice(-4)}`}/><ReviewRow title="Subject" value={app.subject} detail={app.request}/></article></section><aside className="detail-actions"><span className="aside-label">AVAILABLE ACTIONS</span><button onClick={()=>window.print()}><Download size={18}/>Download acknowledgement</button>{app.response&&<button><Download size={18}/>Download response</button>}{canAppeal(app)&&<Link to="/appeal"><FileText size={18}/>File First Appeal</Link>}<Link to="/track"><Search size={14} aria-hidden />Track application</Link><p>All records shown are locally stored mock data.</p></aside></div></section>;
}

function AppealPage() {
  const { applications, addAppeal, notify } = useStore();
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [ground, setGround] = useState(appealGrounds[0]);
  const [explanation, setExplanation] = useState("");
  const [relief, setRelief] = useState("");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  const candidates = applications.filter((app) =>
    canAppeal(app) &&
    `${app.registration} ${app.authority} ${app.subject}`.toLowerCase().includes(query.toLowerCase()),
  );

  const next = () => {
    if (step === 0 && !selected) {
      setError("Select an application before continuing.");
      return;
    }
    if (step === 2 && (!explanation.trim() || !relief.trim())) {
      setError("Complete the required appeal details before continuing.");
      return;
    }
    setError("");
    if (step === 3) {
      const ref = `APL/2026/${selected!.authority.split(" ").map((word) => word[0]).join("").slice(0, 4).toUpperCase()}/${Math.floor(1000 + Math.random() * 8999)}`;
      addAppeal({
        reference: ref,
        applicationRegistration: selected!.registration,
        authority: selected!.authority,
        subject: selected!.subject,
        date: "26 Aug 2026",
        status: "Appeal Submitted",
        updated: "Just now",
        ground,
        explanation,
        relief,
        timeline: [{ stage: "appeal-filed", detail: "Your First Appeal was submitted.", time: "Just now" }],
      });
      notify({
        title: "First Appeal submitted",
        message: `${ref} was filed against ${selected!.registration}.`,
        kind: "appeal",
        href: "/dashboard",
      });
      setReference(ref);
    } else {
      setStep(step + 1);
    }
  };

  if (reference)
    return (
      <section className="success-page appeal-success">
        <div className="success-stamp">
          <Check size={31} />
        </div>
        <span className="eyebrow">
          <span /> Appeal submitted
        </span>
        <h1>Your First Appeal has been filed.</h1>
        <p>Your appeal has been linked to the original application and saved on the dashboard.</p>
        <div className="registration-card">
          <span>APPEAL NUMBER</span>
          <strong>{reference}</strong>
          <div>
            <span>Against RTI</span>
            <b>{selected?.registration}</b>
            <span>Status</span>
            <b>Appeal Submitted</b>
          </div>
        </div>
        <Link className="button" to="/dashboard">
          Return to dashboard
        </Link>
      </section>
    );

  return (
    <section className="wizard-page">
      <div className="wizard-header">
        <div>
          <span className="eyebrow">
            <span /> First appeal
          </span>
          <h1>Appeal a decision or delay</h1>
          <p>Select an existing application, explain what happened, then submit.</p>
        </div>
      </div>
      <Stepper steps={["Choose application", "Reason for appeal", "Appeal details", "Review & submit"]} current={step} />
      <section className="form-card appeal-card">
        {step === 0 && (
          <>
            <div className="form-title">
              <h2>Choose an application</h2>
              <p>Only applications eligible for an appeal appear below.</p>
            </div>
            <label className="search-input">
              <Search size={17} aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search registration, authority or subject"
              />
            </label>
            <div className="authority-list appeal-list">
              {candidates.length === 0 ? (
                <p style={{ padding: "20px", color: "var(--muted)", textAlign: "center" }}>
                  No applications eligible for appeal. Eligible statuses: Submitted, Under Review, Response Available.
                </p>
              ) : (
                candidates.map((app) => (
                  <button
                    type="button"
                    className={selected?.registration === app.registration ? "selected" : ""}
                    onClick={() => setSelected(app)}
                    key={app.registration}
                  >
                    <span>
                      <b>{app.registration}</b>
                      <small>{app.authority} · {app.subject}</small>
                    </span>
                    {selected?.registration === app.registration && <CheckCircle2 size={19} />}
                  </button>
                ))
              )}
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div className="form-title">
              <h2>Reason for appeal</h2>
              <p>Choose the reason that best describes your situation.</p>
            </div>
            <div className="reason-list">
              {appealGrounds.map((item) => (
                <label key={item} className={ground === item ? "selected" : ""}>
                  <input type="radio" checked={ground === item} onChange={() => setGround(item)} />
                  {item}
                  <Check size={16} />
                </label>
              ))}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="form-title">
              <h2>Explain your appeal</h2>
              <p>Both details are required. Use plain language.</p>
            </div>
            <label className="field">
              <span>
                Grounds for appeal <i>Required</i>
              </span>
              <textarea
                value={explanation}
                onChange={(event) => setExplanation(event.target.value)}
                placeholder="Describe what happened..."
              />
              {error && step === 2 && <small className="input-error">This field is required.</small>}
            </label>
            <label className="field">
              <span>
                Requested resolution <i>Required</i>
              </span>
              <textarea
                value={relief}
                onChange={(event) => setRelief(event.target.value)}
                placeholder="What would resolve this appeal?"
              />
              {error && step === 2 && <small className="input-error">This field is required.</small>}
            </label>
          </>
        )}
        {step === 3 && (
          <>
            <div className="form-title">
              <h2>Review your First Appeal</h2>
              <p>Check the details before you submit.</p>
            </div>
            <ReviewRow title="Application" value={selected?.registration ?? ""} />
            <ReviewRow title="Reason" value={ground} />
            <ReviewRow title="Appeal details" value={explanation} detail={relief} />
          </>
        )}
        {error && <p className="field-error">{error}</p>}
        <div className="form-nav">
          {step > 0 && (
            <Button className="outline" onClick={() => {
              setError("");
              setStep(step - 1);
            }}>
              Back
            </Button>
          )}
          <Button onClick={next}>
            {step === 3 ? "Submit First Appeal" : "Continue"}
            <ArrowRight size={17} />
          </Button>
        </div>
      </section>
    </section>
  );
}

function HelpPage(){return <section className="help-page"><div className="help-hero"><span className="eyebrow"><span/> Help centre</span><h1>Answers that get you moving.</h1><p>Guidance for filing, tracking, payments and appeals in this mock portal.</p></div><div className="faq-list">{[["Getting started","What is this portal?","It is a hackathon prototype using mock data only."],["Filing an application","How do I choose an authority?","Search participating authorities, then select the one likely to hold the record."],["Payments","Will I be charged?","No. The payment screen is a visual simulation only."],["Tracking","How do I track a request?","Use its registration number and the demo verification code 123456."],["Appeals","When can I file an appeal?","Choose an eligible application in the appeal flow."]].map(([category,question,answer])=><article key={question}><button><span><small>{category}</small><b>{question}</b></span><ChevronRight size={17}/></button><p>{answer}</p></article>)}</div></section>}

export default function App() {
  const { addApplication, notify, profile, signedIn } = useStore();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/file-rti" element={signedIn ? <FileRTI applicantStart={profile} onAdd={(app) => {
                addApplication(app);
                notify({
                  title: app.status === "Draft" ? "Draft saved" : "Application submitted",
                  message: `${app.registration} ${app.status === "Draft" ? "was saved as a draft." : "has been submitted successfully."}`,
                  kind: app.status === 'Draft' ? 'draft' : 'submitted',
                  href: `/applications/${encodeURIComponent(app.registration)}`
                });
              }}/>:<SignInPage/>}/>
        <Route path="/track" element={<TrackPage />} />
        <Route path="/appeal" element={<AppealPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/applications/:registration" element={<ApplicationDetails />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </Layout>
  );
}
