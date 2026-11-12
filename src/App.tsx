import { useRef, useState } from "react";
import {
  Activity, AlertTriangle, ArrowUpRight, Camera, CheckCircle2,
  ChevronRight, Compass, Crosshair, Eye, Footprints, Globe2,
  Layers, MapPin, Menu, Navigation, Plus, Scan, ShieldCheck,
  Upload, X
} from "lucide-react";

const initialReports = [
  { id: 1, title: "Blocked pedestrian pathway", location: "Electronic City, Bengaluru", type: "Blocked path", status: "Under review", color: "orange" },
  { id: 2, title: "Missing wheelchair ramp", location: "Hosur Road, Bengaluru", type: "Missing ramp", status: "Verified", color: "green" },
  { id: 3, title: "Damaged footpath surface", location: "Phase 1, Bengaluru", type: "Damaged path", status: "Reported", color: "blue" }
];

const categories = ["Blocked path", "Missing ramp", "Damaged path", "Unsafe crossing", "Other"];

export default function App() {
  const [active, setActive] = useState("Overview");
  const [cameraOn, setCameraOn] = useState(false);
  const [issue, setIssue] = useState("Blocked path");
  const [reports, setReports] = useState(initialReports);
  const [notice, setNotice] = useState("");
  const [photo, setPhoto] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
      setNotice("");
    } catch {
      setNotice("Camera access was unavailable. Check your browser permissions or upload a photo instead.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL("image/jpeg"));
    stopCamera();
    setNotice("Photo captured. You can now submit your report.");
  }

  function uploadPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setNotice("Photo added. You can now submit your report.");
    }
  }

  function submitReport() {
    if (!photo) {
      setNotice("Capture or upload a photo before submitting.");
      return;
    }
    setReports(prev => [{
      id: Date.now(),
      title: issue,
      location: "Location not added",
      type: issue,
      status: "Reported",
      color: "blue"
    }, ...prev]);
    setPhoto("");
    setNotice("Your report has been added to the community feed.");
    setActive("Reports");
  }

  const navItems = [
    { name: "Overview", icon: Layers },
    { name: "Explore map", icon: Globe2 },
    { name: "Camera studio", icon: Camera },
    { name: "Reports", icon: AlertTriangle }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Crosshair size={23} /></div>
          <div><strong>WAYFINDER</strong><span>CITIES WITHOUT BARRIERS</span></div>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {navItems.map(item => (
            <button key={item.name}
              className={`nav-link ${active === item.name ? "selected" : ""}`}
              onClick={() => setActive(item.name)}>
              <item.icon size={18} /> {item.name}
              {active === item.name && <ChevronRight size={15} className="nav-arrow" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="impact-card">
            <div className="impact-icon"><Footprints size={18} /></div>
            <strong>Every path matters.</strong>
            <p>Small reports can make a big difference to someone's journey.</p>
          </div>
          <div className="profile"><div className="avatar">W</div><div><strong>Community explorer</strong><span>Contributor account</span></div></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> {active}</div>
          <div className="top-actions"><span className="live-dot"></span> COMMUNITY NETWORK <div className="top-avatar">W</div></div>
        </header>

        <div className="page">
          <div className="welcome-row">
            <div>
              <div className="eyebrow"><span className="live-dot"></span> ACCESSIBILITY INTELLIGENCE PLATFORM</div>
              <h1>{active === "Overview" ? <>Make every journey<br /><em>count.</em></> : active}</h1>
              <p className="subtitle">Document barriers. Share evidence. Help build cities that work for everyone.</p>
            </div>
            <button className="primary-button" onClick={() => setActive("Camera studio")}><Plus size={17} /> New report</button>
          </div>

          {active === "Overview" && <>
            <section className="stats-grid">
              <div className="stat-card"><div className="stat-top"><span>COMMUNITY REPORTS</span><Activity size={17} /></div><strong>{reports.length.toString().padStart(2, "0")}</strong><small>Documented barriers</small></div>
              <div className="stat-card"><div className="stat-top"><span>VERIFIED ISSUES</span><ShieldCheck size={17} /></div><strong>{reports.filter(r => r.status === "Verified").length.toString().padStart(2, "0")}</strong><small>Community confirmed</small></div>
              <div className="stat-card"><div className="stat-top"><span>ISSUE CATEGORIES</span><Scan size={17} /></div><strong>05</strong><small>Types of barriers tracked</small></div>
              <div className="stat-card"><div className="stat-top"><span>MISSION</span><Globe2 size={17} /></div><strong>01</strong><small>More inclusive cities</small></div>
            </section>

            <div className="section-heading"><div><span className="section-kicker">YOUR FIELD TOOLS</span><h2>Explore the platform</h2></div><span className="muted-label">01 — 03</span></div>
            <section className="feature-grid">
              <button className="feature-card camera-feature" onClick={() => setActive("Camera studio")}>
                <div className="feature-icon"><Camera size={21} /></div><span className="feature-number">01 / DOCUMENT</span>
                <h3>Camera studio</h3><p>Capture public-space barriers and turn real-world observations into useful evidence.</p><span className="feature-link">Open camera studio <ArrowUpRight size={16} /></span>
              </button>
              <button className="feature-card map-feature" onClick={() => setActive("Explore map")}>
                <div className="feature-icon"><Compass size={21} /></div><span className="feature-number">02 / DISCOVER</span>
                <h3>Explore barriers</h3><p>Discover reported accessibility issues and understand where improvements are needed.</p><span className="feature-link">Explore reports <ArrowUpRight size={16} /></span>
              </button>
              <button className="feature-card report-feature" onClick={() => setActive("Reports")}>
                <div className="feature-icon"><Eye size={21} /></div><span className="feature-number">03 / VERIFY</span>
                <h3>Community reports</h3><p>Review documented barriers and follow their community verification status.</p><span className="feature-link">View reports <ArrowUpRight size={16} /></span>
              </button>
            </section>

            <div className="section-heading report-heading"><div><span className="section-kicker">LIVE COMMUNITY FEED</span><h2>Recent observations</h2></div><button className="text-button" onClick={() => setActive("Reports")}>View all <ArrowUpRight size={15} /></button></div>
            <ReportList reports={reports.slice(0, 3)} />
          </>}

          {active === "Camera studio" && <section className="studio-layout">
            <div className="studio-main">
              <div className="section-heading"><div><span className="section-kicker">FIELD DOCUMENTATION</span><h2>Capture an observation</h2></div><span className="status-tag">CAMERA WORKSPACE</span></div>
              <div className="camera-frame">
                {cameraOn ? <video ref={videoRef} autoPlay playsInline /> : photo ? <img src={photo} alt="Captured accessibility evidence" /> : <div className="camera-placeholder"><div className="camera-symbol"><Camera size={32} /></div><strong>Your camera workspace</strong><span>Capture a public-space accessibility barrier.</span></div>}
                <div className="frame-corner tl"></div><div className="frame-corner tr"></div><div className="frame-corner bl"></div><div className="frame-corner br"></div>
                {cameraOn && <button className="close-camera" onClick={stopCamera}><X size={18} /></button>}
              </div>
              <div className="camera-controls">
                {!cameraOn ? <button className="primary-button" onClick={startCamera}><Camera size={17} /> Open camera</button> : <button className="primary-button" onClick={capturePhoto}><Crosshair size={17} /> Capture photo</button>}
                <button className="secondary-button" onClick={() => fileRef.current?.click()}><Upload size={16} /> Upload image</button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={uploadPhoto} />
              </div>
              <p className="privacy-note"><ShieldCheck size={15} /> Camera access is requested only when you choose to open it.</p>
            </div>
            <div className="report-form">
              <span className="section-kicker">REPORT DETAILS</span><h2>Describe the barrier</h2>
              <label>ISSUE CATEGORY</label>
              <select value={issue} onChange={e => setIssue(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select>
              <label>PHOTO EVIDENCE</label>
              <div className="evidence-box">{photo ? <><CheckCircle2 size={18} /> Image attached</> : <><Upload size={18} /> No image attached</>}</div>
              <label>LOCATION</label><div className="location-box"><MapPin size={16} /> Add location in a future update</div>
              <button className="primary-button submit-button" onClick={submitReport}>Submit observation <ArrowUpRight size={16} /></button>
              {notice && <p className="notice">{notice}</p>}
              <p className="form-disclaimer">Please avoid photographing identifiable people. Reports are community-submitted and require verification.</p>
            </div>
          </section>}

          {active === "Reports" && <><div className="section-heading"><div><span className="section-kicker">COMMUNITY CONTRIBUTIONS</span><h2>Reported barriers</h2></div><span className="status-tag">{reports.length} REPORTS</span></div><ReportList reports={reports} /></>}

          {active === "Explore map" && <div className="map-panel"><div className="map-art"><div className="map-grid"></div><div className="map-pin pin-one"><MapPin size={24} /></div><div className="map-pin pin-two"><MapPin size={24} /></div><div className="map-pin pin-three"><MapPin size={24} /></div><div className="map-center"><Navigation size={19} /></div><div className="map-label">COMMUNITY ACCESSIBILITY MAP</div></div><div className="map-caption"><div><h2>See barriers. Understand journeys.</h2><p>Community observations will appear here as reports are added. Live maps and verified location data are the next integration.</p></div><span className="status-tag">MAP PREVIEW</span></div></div>}

          <footer><span>WAYFINDER © 2026</span><span>BUILT FOR MORE ACCESSIBLE CITIES <Footprints size={14} /></span></footer>
        </div>
      </main>
    </div>
  );
}

function ReportList({ reports }: { reports: typeof initialReports }) {
  return <div className="report-list">{reports.map(report => <div className="report-row" key={report.id}><div className={`report-type-icon ${report.color}`}><AlertTriangle size={18} /></div><div className="report-info"><strong>{report.title}</strong><span><MapPin size={13} /> {report.location}</span></div><span className={`report-status ${report.color}`}>{report.status}</span><ChevronRight size={17} className="row-chevron" /></div>)}</div>;
}
