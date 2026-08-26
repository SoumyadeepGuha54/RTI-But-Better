import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, FileText, Search, ShieldAlert } from "lucide-react";
import { useStore } from "../store/DemoStore";
import { Timeline } from "../components/Timeline";
import { applicationStages, reachedStageIndex } from "../lib/lifecycle";

export function Track() {
  const [params, setParams] = useSearchParams();
  const reference = params.get("id") ?? "";
  const [input, setInput] = useState(reference);
  const { applications, signedIn } = useStore();
  const application = applications.find((item) => item.registration.toLowerCase() === reference.toLowerCase());
  const submit = (event: React.FormEvent) => { event.preventDefault(); setParams(input.trim() ? { id: input.trim().toUpperCase() } : {}); };
  return <section className="track-page"><div className="track-copy"><span className="eyebrow"><span/> Application tracking</span><h1>Track your application.</h1><p>Enter a registration number to view its mock status and timeline.</p><form onSubmit={submit}><label className="search-input big"><Search size={18}/><input value={input} onChange={event=>setInput(event.target.value)} placeholder="RTI/2026/RAIL/482917" required/></label><button className="button" type="submit">Check status</button></form><div className="tracking-privacy"><ShieldAlert size={16}/><p>Your tracking details are private. This mock flow assumes the demo account is signed in.</p></div></div><section className="track-card">{!reference?<div className="empty"><FileText size={30}/><h3>Enter a registration number</h3><p>The status and timeline will appear here.</p></div>:!application?<div className="empty"><h3>Application not found</h3><p>Check the registration number and try again.</p></div>:<div className="public-result"><div className="verified-heading"><CheckCircle2 size={14}/><span className="aside-label">VERIFIED APPLICATION</span></div><h2>{application.registration}</h2><p>{application.authority}</p><div className="result-line"><span>Current status</span><b>{application.status}</b></div><Timeline stages={applicationStages} entries={application.timeline} reached={reachedStageIndex(application)}/><Link className="button outline detail-button" to={`/applications/${encodeURIComponent(application.registration)}`}>Show full application details</Link></div>}</section></section>;
}
