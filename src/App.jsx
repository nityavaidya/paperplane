import { useState, useEffect, useRef, useCallback } from "react";
import { preload } from "react-dom";
import heroImg from "./paperplane-assets/hero.jpg";
import ctaImg from "./paperplane-assets/cta.jpg";
import textureBlue from "./paperplane-assets/texture-blue.png";
import faviconIco from "./paperplane-assets/favicon.ico";
import faviconSvg from "./paperplane-assets/favicon.svg";
import appleTouchIcon from "./paperplane-assets/apple-touch-icon.png";

preload(heroImg, { as: "image", fetchPriority: "high" });

const I = { hero: heroImg, blue: textureBlue, cta: ctaImg };
const INTER = "'Inter',system-ui,sans-serif";
const MONO = "'JetBrains Mono',ui-monospace,monospace";

const C = {
  page: "#F9F8F5", paper: "#FFFFFF",
  ink: "#141A17", body: "#4E5A52", faint: "#919891",
  border: "#DDE1DA", soft: "#EEEFEB",
  denim: "#3D6A8E", denimDeep: "#2A5070", denimSoft: "#E8EFF5", denimLine: "#B8CEDC",
  gold: "#C59530", goldSoft: "#FBF3E2", goldLine: "#EDD9A8",
  terra: "#B95738", terraSoft: "#FBF0EA", terraLine: "#E8C5B4",
  oat: "#D8C9A4", green: "#587560",
};

const R = 16;
const shadow = `0 1px 3px ${C.ink}0A, 0 12px 40px -16px ${C.ink}1A`;
const WIDE = 1020;
const IMG_W = 1100;
const wrap = (w = WIDE) => ({ width: `min(${w}px, calc(100% - 48px))`, margin: "0 auto", position: "relative", zIndex: 1 });
const pad = "clamp(60px,8.5vw,100px) 0";
const stitchBg = { background: C.page, backgroundImage: `repeating-linear-gradient(180deg,rgba(20,26,23,.022) 0px,rgba(20,26,23,.022) 1px,transparent 1px,transparent 4px)` };
const tag = (c, bg, ln) => ({ fontFamily: MONO, fontSize: 10, letterSpacing: ".05em", padding: "3px 8px", color: c, background: bg, border: `1px solid ${ln}`, whiteSpace: "nowrap", borderRadius: 4 });
const eyebrow = { fontFamily: MONO, fontSize: 11, letterSpacing: ".09em", textTransform: "uppercase", color: C.faint, marginBottom: 18 };
const h2s = { fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 600, lineHeight: 1.16, letterSpacing: "-.028em", color: C.ink, marginBottom: 16 };
const ps = { fontSize: "clamp(15px,1.7vw,16.5px)", lineHeight: 1.74, color: C.body };
const btnLaunch = { background: `url(${I.blue}) center/cover`, backgroundColor: C.denimDeep, color: "#fff", border: "none", borderRadius: 6, padding: "11px 28px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: INTER, backgroundBlendMode: "overlay", boxShadow: `inset 0 0 0 100px ${C.denimDeep}B8` };
const btnText = { background: "none", border: "none", color: C.body, fontSize: 14, fontWeight: 400, cursor: "pointer", fontFamily: INTER, textDecoration: "underline", textUnderlineOffset: 3 };
const pill = (c, bg) => ({ fontFamily: MONO, fontSize: 8, fontWeight: 600, letterSpacing: ".03em", padding: "3px 7px", borderRadius: 999, color: c, background: bg, display: "inline-flex", width: "max-content" });

function Logo({ size = 22, color = "#111" }) {
  return (<svg width={size} height={size} viewBox="0 0 32 28" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3L5 19L10 23L16 20.5L22 23L27 19Z" /><path d="M16 3L16 20.5" /></svg>);
}

function F({ children, delay = 0, style = {} }) {
  const ref = useRef(null); const [v, setV] = useState(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => e.isIntersecting && setV(true), { threshold: .08 }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, []);
  return (<div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(14px)", transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`, ...style }}>{children}</div>);
}

function DottedRule() {
  const d = []; for (let i = 0; i < 90; i++) d.push(<rect key={i} x={i * 14} y="2" width="8" height="2" rx="1" fill={C.oat} />);
  return (<div style={wrap(WIDE)}><svg viewBox="0 0 1260 6" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 6 }}>{d}</svg></div>);
}

function SectionLine() { return <div style={{ borderTop: `1px solid ${C.border}` }} />; }

const NAV_ITEMS = [
  { label: "Products", sections: [[null, ["paperplane Web", "paperplane Slack", "paperplane CLI", "paperplane MCP"]]] },
  { label: "Docs", sections: [["Dev", ["SDK", "MCP", "Documentation", "Integrations"]], ["Resources", ["Guides", "Case Studies", "Blog"]]] },
  { label: "Enterprise", sections: [["Security", ["SOC 2", "Data Handling", "SSO / SAML"]], ["Support", ["Dedicated Slack", "SLAs", "Onboarding"]]] },
  { label: "Pricing", link: true },
  { label: "Company", sections: [[null, ["About", "Careers", "Contact"]]] },
];

function Header({ onNavigate }) {
  const [open, setOpen] = useState(null);
  const [mob, setMob] = useState(false);
  const closeTimer = useRef(null);
  const close = useCallback(() => setOpen(null), []);
  useEffect(() => { const h = () => close(); window.addEventListener("click", h); return () => window.removeEventListener("click", h); }, [close]);
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  const enterIdx = (item, idx) => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; } setOpen(item.link ? null : idx); };
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setOpen(null), 150); };
  const NL = ({ mobile }) => (<div style={mobile ? { display: "flex", flexDirection: "column", gap: 2 } : { display: "flex", alignItems: "center" }}>
    {NAV_ITEMS.map((item, idx) => (<div key={idx} style={{ position: "relative" }} {...(!mobile ? { onMouseEnter: () => enterIdx(item, idx), onMouseLeave: scheduleClose } : {})}>
      <button onClick={e => { e.stopPropagation(); if (item.link) { onNavigate("404"); setMob(false); } else setOpen(open === idx ? null : idx); }} style={{ background: "none", border: "none", padding: mobile ? "10px 0" : "6px 12px", fontSize: 14, fontWeight: 500, cursor: "pointer", color: open === idx ? C.ink : C.body, fontFamily: INTER, display: "flex", alignItems: "center", gap: 4, width: mobile ? "100%" : "auto", ...(open === idx && !mobile ? { background: C.soft } : {}) }}>
        {item.label}{!item.link && <svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ transform: open === idx ? "rotate(180deg)" : "none", transition: "transform .2s" }}><path d="M2.5 4L5 6.5L7.5 4" /></svg>}
      </button>
      {open === idx && !item.link && (<div onClick={e => e.stopPropagation()} style={mobile ? { padding: "4px 0 8px 16px" } : { position: "absolute", top: "100%", left: 0, marginTop: 4, background: C.paper, border: `1px solid ${C.border}`, padding: 8, minWidth: 200, boxShadow: `0 8px 32px -8px ${C.ink}22`, zIndex: 60, display: "flex", gap: 4 }}>
        {item.sections.map(([title, links], si) => (<div key={si} style={{ flex: 1, minWidth: mobile ? 0 : 140 }}>
          {title && <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: C.faint, padding: mobile ? "4px 0" : "6px 10px 4px" }}>{title}</div>}
          {links.map((l, li) => (<button key={li} onClick={() => { onNavigate("404"); close(); setMob(false); }} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: mobile ? "8px 0" : "7px 10px", fontSize: 13, color: C.body, cursor: "pointer", fontFamily: INTER }} onMouseEnter={e => { if (!mobile) e.target.style.background = C.soft }} onMouseLeave={e => { if (!mobile) e.target.style.background = "none" }}>{l}</button>))}
        </div>))}
      </div>)}
    </div>))}
  </div>);
  return (<>
    <nav style={{ padding: "0 clamp(24px,6vw,56px)", display: "flex", alignItems: "center", borderBottom: `1px solid ${C.border}`, background: C.page, position: "sticky", top: 0, zIndex: 50, height: 60 }}>
      <button onClick={() => onNavigate("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0, marginRight: 28, flexShrink: 0 }}><Logo size={24} color={C.ink} /><span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-.02em", color: C.ink, fontFamily: INTER }}>paperplane</span></button>
      <div className="desktop-nav" style={{ display: "flex", alignItems: "center" }}><NL mobile={false} /></div>
      <div style={{ display: "flex", gap: 18, marginLeft: "auto", flexShrink: 0, alignItems: "center" }}>
        <button onClick={() => onNavigate("404")} className="desktop-btn" style={btnText}>Get a demo</button>
        <button onClick={() => onNavigate("404")} style={btnLaunch}>Launch</button>
        <button className="mobile-menu-btn" onClick={e => { e.stopPropagation(); setMob(v => !v); }} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke={C.ink} strokeWidth="1.6" strokeLinecap="round">{mob ? <><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></> : <><line x1="3" y1="6" x2="17" y2="6" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="14" x2="17" y2="14" /></>}</svg>
        </button>
      </div>
    </nav>
    {mob && <div style={{ position: "fixed", top: 60, left: 0, right: 0, bottom: 0, zIndex: 49, background: C.page, borderTop: `1px solid ${C.border}`, overflowY: "auto", padding: "16px clamp(24px,6vw,56px) 32px" }} onClick={e => e.stopPropagation()}><NL mobile={true} /></div>}
  </>);
}

function Footer({ onNavigate }) {
  const links = ["Product", "Documentation", "Enterprise", "Pricing", "Company", "Terms", "Privacy Policy"];
  return (<footer style={{ padding: "16px clamp(24px,6vw,56px)", borderTop: `1px solid ${C.border}`, background: C.page, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Logo size={14} color={C.faint} /><span style={{ fontSize: 12.5, color: C.faint, fontWeight: 500, fontFamily: INTER }}>paperplane</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>{links.map((l, i) => (<button key={i} onClick={() => onNavigate("404")} style={{ background: "none", border: "none", fontSize: 11.5, color: C.faint, cursor: "pointer", padding: "4px 8px", fontFamily: INTER }}>{l}</button>))}<span style={{ fontSize: 11, color: C.faint, paddingLeft: 8 }}>© 2026 paperplane</span></div>
  </footer>);
}

/* ── hero dashboard mockup ── */
function HeroDashboard() {
  const sideItems = ["Overview", "Signals", "Journeys", "Users", "Reports"];
  return (
    <div className="hero-dashboard" style={{ width: "100%", maxWidth: 920, background: C.paper, border: `1px solid ${C.border}`, borderRadius: R, overflow: "hidden", boxShadow: `0 16px 48px -22px ${C.ink}1A` }}>
      <div style={{ height: 49, display: "flex", alignItems: "center", padding: "0 17px", borderBottom: `1px solid ${C.soft}`, background: "#fafaf7" }}>
        <div style={{ display: "flex", gap: 6, width: 90 }}>
          {[C.terra, "#d5d5ce", "#d5d5ce"].map((bg, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: bg }} />)}
        </div>
        <div style={{ margin: "0 auto", width: 260, height: 24, padding: "5px 14px", border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 10, color: "#777", background: "#fff", fontFamily: MONO, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 7 }}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ opacity: .5, flexShrink: 0 }}><circle cx="7" cy="7" r="5.5" stroke="#777" strokeWidth="1.4" /><line x1="11.2" y1="11.2" x2="15" y2="15" stroke="#777" strokeWidth="1.4" strokeLinecap="round" /></svg>
          <span style={{ opacity: .6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Ask anything about your product...</span>
        </div>
        <div style={{ width: 90, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, fontSize: 10, color: C.green, fontFamily: MONO }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />Live
        </div>
      </div>
      <div className="product-body" style={{ minHeight: 520, display: "grid", gridTemplateColumns: "130px 1fr" }}>
        <aside className="sidebar" style={{ borderRight: `1px solid ${C.border}`, background: "#f8f8f5", padding: "17px 11px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ width: 27, height: 27, margin: "0 8px 15px", display: "grid", placeItems: "center", background: C.denim, color: "white", borderRadius: 7, fontSize: 11, fontWeight: 700, fontFamily: MONO }}>P</div>
          {sideItems.map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 9, height: 32, padding: "0 9px", borderRadius: 7, color: item === "Overview" ? C.ink : "#777", fontSize: 11, ...(item === "Overview" ? { background: "#fff", boxShadow: `0 2px 8px ${C.ink}0D` } : {}) }}>
              <span style={{ width: 10, height: 10, border: `1.5px solid ${item === "Overview" ? C.denim : "#a9aaa4"}`, borderRadius: 3, ...(item === "Overview" ? { background: C.denimSoft } : {}) }} />
              <span>{item}</span>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 9, height: 32, padding: "0 9px", borderRadius: 7, color: "#777", fontSize: 11 }}>
            <span style={{ width: 10, height: 10, border: "1.5px solid #a9aaa4", borderRadius: 3 }} /><span>Settings</span>
          </div>
        </aside>
        <div className="dashboard-main" style={{ padding: "24px 28px", background: "#fdfdfb" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <span style={{ display: "block", marginBottom: 5, color: C.faint, letterSpacing: ".12em", fontSize: 9, fontWeight: 600, fontFamily: MONO }}>THIS WEEK</span>
              <h3 style={{ fontSize: 18, letterSpacing: "-.03em", fontWeight: 600 }}>Your product is getting better</h3>
            </div>
            <div style={{ display: "flex" }}>
              {["A", "N", "+3"].map((a, i) => (
                <span key={i} style={{ width: 24, height: 24, marginLeft: i ? -5 : 0, display: "grid", placeItems: "center", border: "2px solid white", borderRadius: "50%", background: i === 0 ? "#ffd0c2" : i === 1 ? C.denimSoft : "#deded7", fontSize: 8, fontWeight: 700, fontFamily: MONO }}>{a}</span>
              ))}
            </div>
          </div>
          <div className="summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
            {[{ l: "Signals found", v: "24", s: "6 with PRs ready" }, { l: "Fixes shipped", v: "5", s: "All verified post-deploy" }, { l: "Impact", v: "+11%", s: "Activation this month", a: true }].map((m, i) => (
              <div key={i} style={{ padding: "14px 15px", border: `1px solid ${m.a ? C.terraLine : C.border}`, borderRadius: 10, background: m.a ? C.terraSoft : "white" }}>
                <span style={{ display: "block", color: C.faint, fontSize: 9, fontFamily: MONO }}>{m.l}</span>
                <strong style={{ display: "block", margin: "6px 0 3px", fontSize: 20, letterSpacing: "-.03em", ...(m.a ? { color: C.terra } : {}) }}>{m.v}</strong>
                <small style={{ display: "block", color: "#aaa", fontSize: 9 }}>{m.s}</small>
              </div>
            ))}
          </div>
          <div style={{ border: `1px solid ${C.border}`, background: "#fff", borderRadius: 12, overflow: "hidden" }}>
            <div className="featured-insight" style={{ display: "grid", gridTemplateColumns: "32px 1fr 190px", gap: 14, padding: 18 }}>
              <div style={{ width: 28, height: 28, display: "grid", placeItems: "center", background: C.ink, color: "#fff", borderRadius: 7, fontSize: 10, fontFamily: MONO }}>01</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.faint, fontSize: 9 }}>
                  <span style={pill("#2d5e3f", "#e8f2ec")}>Shipped · Verified</span>
                  <span>Onboarding · 312 users affected</span>
                </div>
                <h4 style={{ margin: "8px 0 6px", fontSize: 14, lineHeight: 1.35, letterSpacing: "-.02em", fontWeight: 600 }}>Users were leaving when asked to configure their first data source.</h4>
                <p style={{ margin: 0, color: C.body, fontSize: 10, lineHeight: 1.5 }}>Paperplane traced the drop-off to a documentation handoff. It wrote an in-product walkthrough, opened a PR, and setup completion is already recovering.</p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.soft}` }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 28 }}>
                    {[42, 38, 24, 52, 71].map((h, i) => <span key={i} style={{ width: 14, height: `${h}%`, background: i === 2 ? C.terra : "#cfd3ce", borderRadius: "2px 2px 0 0" }} />)}
                  </div>
                  <div><strong style={{ display: "block", fontSize: 12 }}>+15%</strong><small style={{ display: "block", marginTop: 1, color: "#aaa", fontSize: 8 }}>setup completion</small></div>
                  <div><strong style={{ display: "block", fontSize: 12 }}>2 days</strong><small style={{ display: "block", marginTop: 1, color: "#aaa", fontSize: 8 }}>signal to merged PR</small></div>
                </div>
              </div>
              <div className="recommendation" style={{ padding: 13, alignSelf: "stretch", background: C.page, borderRadius: 8 }}>
                <span style={{ display: "block", marginBottom: 5, color: C.faint, letterSpacing: ".12em", fontSize: 9, fontWeight: 600, fontFamily: MONO }}>NEXT UP</span>
                <p style={{ margin: "10px 0 12px", fontSize: 11, lineHeight: 1.45, fontWeight: 600, letterSpacing: "-.01em" }}>Teams that invite a second user in week one retain 2.1× better. PR ready to nudge the invite flow.</p>
                <div style={{ width: "100%", height: 28, display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${C.border}`, background: "white", borderRadius: 6, padding: "0 9px", color: C.body, fontSize: 9, cursor: "pointer" }}><span>View PR draft</span><span>→</span></div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${C.soft}` }}>
              {[{ idx: "02", tl: "PR ready", tc: "#8d4a3d", tb: C.terraSoft, text: "Mobile users repeatedly miss the export action. layout fix drafted." },
                { idx: "03", tl: "Monitoring", tc: C.denim, tb: C.denimSoft, text: "Safari autofill fix from last week holding. signup +4.1%." }
              ].map((row, i) => (
                <div key={i} className="insight-list-row" style={{ display: "grid", gridTemplateColumns: "28px 78px 1fr 18px", alignItems: "center", gap: 8, minHeight: 42, padding: "0 18px", borderBottom: i === 0 ? `1px solid ${C.soft}` : "none", fontSize: 10 }}>
                  <span style={{ color: "#aaa", fontFamily: MONO, fontSize: 9 }}>{row.idx}</span>
                  <span style={pill(row.tc, row.tb)}>{row.tl}</span>
                  <strong style={{ fontSize: 11, fontWeight: 500 }}>{row.text}</strong>
                  <span style={{ color: "#999", fontSize: 10 }}>↗</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── where it lives: tabbed surface demos ── */
function SurfaceTabs() {
  const [active, setActive] = useState(0);
  const labels = ["Web", "Slack", "Terminal"];
  const tabOrder = [1, 0, 2];
  const click = (i) => setActive(i);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setActive(0);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const webPanel = (
    <div className="surface-web" style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.paper, boxShadow: `0 16px 48px -22px ${C.ink}1A`, width: 640, height: 460, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.soft}`, background: "#FDFDFB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.faint }}>paperplane</span>
        <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.faint }}>/ Launchpad</span>
      </div>
      <div style={{ padding: "6px 0", flex: 1, overflow: "hidden" }}>
        {[
          { time: "Today, 10:44 AM", dot: C.green, label: "Verified", lc: "#2d5e3f", lb: "#e8f2ec", bold: "Verified:", rest: " checkout timeout fix confirmed. Payment completion +8.3%, holding across all segments.", meta: "PR #267" },
          { time: "Yesterday, 3:12 PM", dot: C.denim, label: "Monitoring", lc: C.denim, lb: C.denimSoft, bold: "Deployed.", rest: " Monitoring started for checkout completion metric.", meta: "PR #267" },
          { time: "Yesterday, 11:20 AM", dot: C.green, label: "Merged", lc: "#2d5e3f", lb: "#e8f2ec", bold: "PR #267 merged", rest: " by @sarah. Timeout increased to 8s, retry logic added.", meta: "reviewed in 22 min" },
          { time: "Monday, 9:48 AM", dot: C.gold, label: "PR ready", lc: "#8a6a1f", lb: C.goldSoft, bold: "PR #267 opened.", rest: " Fix for 3s API timeout on slow connections. 312 affected sessions attached.", meta: "est. impact: +6-9%" },
          { time: "Monday, 9:31 AM", dot: C.terra, label: "High impact", lc: "#8d4a3d", lb: C.terraSoft, bold: "Signal detected:", rest: " checkout completion dropped 8%. Root cause traced to API timeout on mobile.", meta: "312 users" },
        ].map((item, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "128px 10px 1fr", gap: 12, alignItems: "start", padding: "14px 20px", borderBottom: i < 4 ? `1px solid ${C.soft}` : "none" }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.faint, paddingTop: 3, textAlign: "right", whiteSpace: "nowrap" }}>{item.time}</div>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: item.dot, marginTop: 6 }} />
            <div style={{ fontSize: 12.5, lineHeight: 1.5, color: C.body }}>
              <strong style={{ color: C.ink }}>{item.bold}</strong>{item.rest}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, fontSize: 10, color: C.faint }}>
                <span style={pill(item.lc, item.lb)}>{item.label}</span>{item.meta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const slackPanel = (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.paper, boxShadow: `0 16px 48px -22px ${C.ink}1A`, maxWidth: 640 }}>
      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.soft}`, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}># product-signals <span style={{ color: C.faint, fontWeight: 400, fontSize: 11 }}>3 new messages</span></div>
      <div style={{ padding: "16px 20px" }}>
        {[
          { msg: <><strong>Fix update:</strong> Safari autofill fix (PR #238) deployed 3 days ago. Signup completion is up 4.1%. Holding steady across all segments.</>,
            embed: <><strong>Monitoring report</strong><br />Metric: signup completion 87.2% → 91.3%<br />Affected sessions: 847 → 0<br />Confidence: causal (controlled rollout)<br />Status: stable</>,
            reactions: ["🎉 4", "👀 2"], time: "10:42 AM" },
          { msg: <><strong>New signal:</strong> Teams that invite a second user in week one retain 2.1× better. This pattern is strong across all customer segments. I've drafted a PR to surface the invite prompt earlier. want me to open it?</>,
            reactions: ["👍 3"], time: "10:43 AM" },
        ].map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 10, marginBottom: i === 0 ? 16 : 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 7, display: "grid", placeItems: "center", background: C.denimSoft }}><Logo size={16} color={C.denim} /></div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Paperplane <small style={{ fontWeight: 400, color: C.faint, fontSize: 10, marginLeft: 6 }}>{row.time}</small></div>
              <div style={{ fontSize: 13, lineHeight: 1.55, color: C.body }}>{row.msg}</div>
              {row.embed && <div style={{ marginTop: 8, padding: "10px 14px", borderLeft: `3px solid ${C.denim}`, background: "#FDFDFB", borderRadius: "0 6px 6px 0", fontSize: 11.5, lineHeight: 1.5, color: C.body }}>{row.embed}</div>}
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>{row.reactions.map((r, ri) => <span key={ri} style={{ padding: "3px 8px", background: C.page, border: `1px solid ${C.border}`, borderRadius: 999, fontSize: 11 }}>{r}</span>)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const termPanel = (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: "#1a1d1c", boxShadow: `0 16px 48px -22px ${C.ink}1A`, maxWidth: 700 }}>
      <div style={{ height: 38, display: "flex", alignItems: "center", padding: "0 14px", gap: 6, background: "#222524" }}>
        {[C.terra, "#3a3d3b", "#3a3d3b"].map((bg, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: bg }} />)}
      </div>
      <div style={{ padding: "16px 18px", fontFamily: MONO, fontSize: 11.5, lineHeight: 1.7, color: "#a8aba6" }}>
        <div><span style={{ color: C.denim }}>~</span> <span style={{ color: "#e0e2dd" }}>paperplane ask "what changed in onboarding this quarter?"</span></div>
        <div>&nbsp;</div>
        <div><span style={{ color: "#7dba8f" }}>Two fixes shipped, both verified.</span></div>
        <div>&nbsp;</div>
        <div><span style={{ color: "#d4a94b" }}>PR #241</span> <span style={{ color: "#555" }}>·</span> replaced doc handoff with in-product walkthrough</div>
        <div>{"  "}Setup completion: <span style={{ color: "#7dba8f" }}>58% → 73%</span></div>
        <div>{"  "}Time to first value: <span style={{ color: "#7dba8f" }}>-4.2 min</span></div>
        <div>{"  "}Status: <span style={{ color: "#7dba8f" }}>verified</span> <span style={{ color: "#555" }}>· effect holding at 60 days</span></div>
        <div>&nbsp;</div>
        <div><span style={{ color: "#d4a94b" }}>PR #256</span> <span style={{ color: "#555" }}>·</span> moved invite prompt to end of first session</div>
        <div>{"  "}Week-1 invite rate: <span style={{ color: "#7dba8f" }}>12% → 34%</span></div>
        <div>{"  "}Status: <span style={{ color: "#d4a94b" }}>monitoring</span> <span style={{ color: "#555" }}>· 18 days post-deploy</span></div>
        <div>&nbsp;</div>
        <div><span style={{ color: "#555" }}>sources: 1,842 sessions · experiment 14 · releases 2.1, 2.3</span></div>
        <div>&nbsp;</div>
        <div><span style={{ color: C.denim }}>~</span> <span style={{ color: "#e0e2dd" }}>paperplane watch PR#256 --owner @sarah</span></div>
        <div><span style={{ color: "#7dba8f" }}>✓</span> @sarah will be notified if the metric regresses</div>
      </div>
    </div>
  );

  const panels = [webPanel, slackPanel, termPanel];
  const basePos = [
    { left: "50%", right: "auto", transform: "translate(-50%,-50%)", origin: "center" },
    { left: "0", right: "auto", transform: "translateY(-50%)", origin: "left center" },
    { left: "auto", right: "0", transform: "translateY(-50%)", origin: "right center" },
  ];
  const zFor = (i) => {
    if (i === active) return 3;
    if (active === 0) return 1;
    return i === 0 ? 2 : 1;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <div style={eyebrow}>In your workflow</div>
      <h2 style={h2s}>It meets you where you work.</h2>
      <p style={{ ...ps, maxWidth: 820, marginBottom: 32 }}>Use Paperplane wherever your team already works. Tag it in Slack, pull it up in your terminal, or open the web app when you want the full picture. Whichever you choose, you can ask questions, hand it bugs, review fixes, or just let it run on autopilot.</p>
      <div ref={wrapRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", background: C.page, border: `1px solid ${C.border}`, borderRadius: 999, padding: 4, width: "max-content", marginBottom: 16, overflow: "hidden" }} className="surface-tabs">
          <div style={{ position: "relative", display: "flex" }}>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${100 / tabOrder.length}%`, borderRadius: 999, background: C.paper, transform: `translateX(${tabOrder.indexOf(active) * 100}%)`, transition: "transform .4s cubic-bezier(.22,1,.36,1)" }} />
            {tabOrder.map(i => (
              <button key={labels[i]} onClick={() => click(i)} className="surface-tab" style={{ position: "relative", zIndex: 1, width: 92, padding: "8px 0", borderRadius: 999, border: "none", background: "none", color: active === i ? C.ink : C.faint, fontSize: 13, fontWeight: 500, fontFamily: INTER, textAlign: "center", cursor: "pointer", transition: "color .2s" }}>{labels[i]}</button>
            ))}
          </div>
        </div>
        <div className="surface-inner" style={{ position: "relative", width: "100%", height: 480, textAlign: "left" }}>
          {panels.map((p, i) => {
            const pos = basePos[i];
            const isActive = i === active;
            return (
              <div
                key={i}
                className={isActive ? "surface-center" : "surface-peek"}
                onClick={() => click(i)}
                style={{ position: "absolute", top: "50%", left: pos.left, right: pos.right, transform: `${pos.transform} scale(${isActive ? 1 : .965})`, transformOrigin: pos.origin, zIndex: zFor(i), cursor: isActive ? "default" : "pointer", transition: "transform .5s cubic-bezier(.22,1,.36,1)" }}
              >
                {p}
              </div>
            );
          })}
        </div>
      </div>
      <span style={{ marginTop: 20, fontFamily: MONO, fontSize: 10.5, color: C.faint, opacity: .6, letterSpacing: ".02em" }}>clickthrough the tabs to explore</span>
    </div>
  );
}

function NotFound({ onNavigate }) {
  return (<div style={{ ...stitchBg, minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER }}>
    <div style={{ textAlign: "center", maxWidth: 440 }}>
      <div style={{ fontSize: 80, fontWeight: 600, letterSpacing: "-.06em", color: C.border, lineHeight: 1 }}>404</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: C.ink, marginTop: 12, marginBottom: 8 }}>Uh oh!</div>
      <p style={{ fontSize: 15, color: C.body, lineHeight: 1.65, marginBottom: 28 }}>We can't find what you're looking for, but let's get you back on track.</p>
      <button onClick={() => onNavigate("home")} style={btnLaunch}>Back to homepage</button>
    </div>
  </div>);
}

const HOW_STEPS = [
  { title: "Watch", desc: "Monitors sessions, errors, and funnels 24/7 to catch friction in real time.", color: C.denim },
  { title: "Fix", desc: "Traces root causes to code and opens a pull request with session evidence.", color: C.gold },
  { title: "Learn", desc: "Tracks post-deploy impact and updates product memory to improve future fixes.", color: C.terra },
];

function Home({ onNavigate }) {
  return (<div style={{ background: C.page, color: C.ink, fontFamily: INTER }}>

    {/* ═══ HERO ═══ */}
    <section style={stitchBg}>
      <div style={{ padding: "clamp(32px,5vw,56px) 0 0" }}>
        <div style={wrap(IMG_W)}>
          <F>
            <h1 style={{ fontSize: "clamp(28px,4.2vw,44px)", fontWeight: 600, lineHeight: 1.08, letterSpacing: "-.04em", marginBottom: 8 }}>Make your product self-improving</h1>
            <p style={{ ...ps, fontSize: "clamp(14.5px,1.7vw,16px)", maxWidth: 520, marginBottom: 10 }}>
              Paperplane monitors your product, catches where users get stuck, and writes the pull request to fix it.
            </p>
            <span style={{ fontFamily: MONO, fontSize: 12, color: "#7A817B", letterSpacing: ".04em" }}>web · slack · terminal</span>
          </F>
        </div>
      </div>
      <div style={{ padding: "clamp(20px,3vw,26px) 0 clamp(60px,8.5vw,100px)" }}>
        <div style={wrap(IMG_W)}>
          <div style={{ position: "relative", overflow: "hidden", border: `1px solid ${C.border}`, background: C.page }}>
            <img src={I.hero} alt="" fetchPriority="high" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 42%", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: C.page, opacity: .74 }} />
            <div className="dashboard-scroll" style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "center", padding: "clamp(16px,3vw,30px) clamp(16px,4vw,50px)" }}>
              <F><HeroDashboard /></F>
            </div>
          </div>
        </div>
      </div>
    </section>

    <SectionLine />

    {/* ═══ HOW IT WORKS ═══ */}
    <section style={{ padding: pad, background: C.paper }}>
      <div style={wrap(IMG_W)}>
        <div className="problem-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <F>
              <div style={eyebrow}>How it works</div>
              <h2 style={h2s}>A loop, not a tool.</h2>
              <p style={{ ...ps, maxWidth: 600, textWrap: "balance" }}>Your stack captures every drop-off and error, but turning that data into fixes takes hours of manual digging through logs and code. Paperplane automates the entire loop: it spots the issues, writes the fix, opens a PR, and learns from the results to get better over time.</p>
            </F>
          </div>
          <F delay={.08}>
            <div style={{ display: "flex", flexDirection: "column", gap: 28, marginTop: 14 }}>
              {HOW_STEPS.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 14 }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".04em", color: step.color, lineHeight: 1, position: "relative", top: 3 }}>0{i + 1}</span>
                  <div>
                    <h4 style={{ fontSize: 16, lineHeight: 1, marginBottom: 10, letterSpacing: "-.01em", fontWeight: 600 }}>{step.title}</h4>
                    <div style={{ width: 56, height: 3, background: step.color, marginBottom: 14 }} />
                    <p style={{ fontSize: 13.5, lineHeight: 1.6, color: C.body }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </F>
        </div>
      </div>
    </section>

    <DottedRule />

    {/* ═══ WHAT'S INCLUDED ═══ */}
    <section style={{ padding: pad, ...stitchBg }}>
      <div style={wrap(IMG_W)}>
        <F>
          <div style={{ maxWidth: 900, margin: "0 auto 48px", textAlign: "center" }}>
            <div style={eyebrow}>What it does</div>
            <h2 style={h2s}>Everything from the signal to the shipped fix.</h2>
          </div>
        </F>

        <div className="feature-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Wide: Continuous discovery */}
          <F style={{ gridColumn: "1 / -1" }}><article className="feature-wide" style={{ background: "white", border: `1px solid ${C.border}`, minHeight: 400, display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: 50, alignItems: "center", padding: 34, overflow: "hidden" }}>
            <div>
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: C.denim }}>Continuous discovery</span>
              <h3 style={{ fontSize: "clamp(22px,2.8vw,28px)", lineHeight: 1.12, letterSpacing: "-.035em", margin: "12px 0 14px", fontWeight: 600 }}>It watches your product so you don't have to.</h3>
              <p style={{ fontSize: 15, lineHeight: 1.68, color: C.body }}>Paperplane monitors sessions, funnels, errors, and releases continuously. When something changes (a drop-off spikes, a flow breaks after a deploy, a segment starts behaving differently), it surfaces the signal with context attached.</p>
              {["Groups related signals instead of flooding you with alerts", "Separates real friction from one-off noise", "Ranks by combining user impact with volume"].map((t, i) => (
                <div key={i} style={{ fontSize: 13.5, color: C.body, margin: "10px 0", display: "flex", gap: 6 }}><span style={{ color: C.denim, flexShrink: 0 }}>↳</span>{t}</div>
              ))}
            </div>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: `0 16px 48px -22px ${C.ink}1A` }}>
              <div style={{ height: 46, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", background: "#FDFDFB", borderBottom: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600 }}>
                <span>Emerging signals</span><small style={{ color: C.faint, fontWeight: 400, fontSize: 10 }}>Updated 4 min ago</small>
              </div>
              {[
                { icon: "↘", text: "Activation dropped after release 2.4", sub: "Root cause: workspace setup flow changed", pri: "High", active: true, iconColor: C.terra },
                { icon: "↗", text: "Teams with 2+ users in week one retain 2.1× better", sub: "Pattern holds across all segments", pri: "New", iconColor: C.denim },
                { icon: "!", text: "Safari autofill silently breaking email field", sub: "41 sessions · 18 accounts · PR drafted", pri: "Fix ready", iconColor: C.terra },
              ].map((s, i) => (
                <div key={i} style={{ minHeight: 68, display: "grid", gridTemplateColumns: "30px 1fr 34px", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: i < 2 ? `1px solid ${C.soft}` : "none", ...(s.active ? { background: C.terraSoft } : {}) }}>
                  <div style={{ width: 28, height: 28, display: "grid", placeItems: "center", color: s.iconColor, fontSize: 12, fontWeight: 600 }}>{s.icon}</div>
                  <div><strong style={{ display: "block", fontSize: 11 }}>{s.text}</strong><small style={{ display: "block", marginTop: 4, color: C.faint, fontSize: 9 }}>{s.sub}</small></div>
                  <span style={{ fontSize: 9, fontFamily: MONO, color: C.faint }}>{s.pri}</span>
                </div>
              ))}
            </div>
          </article></F>

          {/* Half: Automated PRs */}
          <F delay={.06} style={{ height: "100%" }}><article style={{ height: "100%", background: "white", border: `1px solid ${C.border}`, minHeight: 440, padding: 34, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div>
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: C.gold }}>Automated pull requests</span>
              <h3 style={{ fontSize: "clamp(22px,2.8vw,28px)", lineHeight: 1.12, letterSpacing: "-.035em", margin: "12px 0 14px", fontWeight: 600 }}>The output is code.</h3>
              <p style={{ fontSize: 15, lineHeight: 1.68, color: C.body }}>When Paperplane finds something worth fixing, it traces the problem down to the lines of code, writes the change, and opens a PR with the full evidence chain attached. Your team reviews it like any other pull request.</p>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", marginTop: 28 }}>
              <div style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: "#FDFDFB", boxShadow: `0 16px 48px -22px ${C.ink}1A` }}>
                <div style={{ padding: "11px 14px", borderBottom: `1px solid ${C.soft}`, display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: MONO }}>
                  <span>paperplane/fix-safari-autofill</span><span style={{ color: C.green, fontWeight: 600 }}>● ready</span>
                </div>
                <div style={{ padding: "8px 0", fontFamily: MONO, fontSize: 10.5, lineHeight: 1.7 }}>
                  <div style={{ padding: "2px 14px", background: "#fff0ef", color: "#8d4a3d" }}>- autoComplete="off"</div>
                  <div style={{ padding: "2px 14px", background: "#eef6f0", color: "#3e6b4d" }}>+ autoComplete="email"</div>
                  <div style={{ padding: "2px 14px", background: "#eef6f0", color: "#3e6b4d" }}>+ test('preserves Safari autofill')</div>
                </div>
                <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.soft}`, display: "flex", gap: 8 }}>
                  <button style={{ border: `1px solid ${C.border}`, background: "white", borderRadius: 6, padding: "6px 10px", fontSize: 10, cursor: "pointer", fontFamily: INTER }}>View 847 sessions</button>
                  <button style={{ border: "1px solid #b8cdbd", background: "#eef6f0", borderRadius: 6, padding: "6px 10px", fontSize: 10, color: "#416b4d", cursor: "pointer", fontFamily: INTER }}>Approve PR</button>
                </div>
              </div>
            </div>
          </article></F>

          {/* Half: Verification */}
          <F delay={.08} style={{ height: "100%" }}><article style={{ height: "100%", background: "white", border: `1px solid ${C.border}`, minHeight: 440, padding: 34, display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
            <div>
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: C.green }}>Verification</span>
              <h3 style={{ fontSize: "clamp(22px,2.8vw,28px)", lineHeight: 1.12, letterSpacing: "-.035em", margin: "12px 0 14px", fontWeight: 600 }}>It checks its own work.</h3>
              <p style={{ fontSize: 15, lineHeight: 1.68, color: C.body }}>After a fix is deployed, Paperplane tracks the metric to verify the result. Verified fixes get logged to memory, while unresolved issues reopen the ticket.</p>
            </div>
            <div style={{ marginTop: 28, padding: 20, border: `1px solid ${C.border}`, borderRadius: 12, background: "#FDFDFB", boxShadow: `0 16px 48px -22px ${C.ink}1A` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={pill("#2d5e3f", "#e8f2ec")}>Verified</span>
                <span style={{ color: C.faint, fontSize: 9, fontFamily: MONO }}>60 days post-deploy</span>
              </div>
              <h4 style={{ margin: "16px 0 20px", fontSize: 16, lineHeight: 1.4, letterSpacing: "-.02em", fontWeight: 600 }}>Safari autofill fix / email field</h4>
              {[["Signup completion", "+4.1% · holding", C.green], ["Affected sessions", "847 → 0", null], ["Status", "Logged to memory", C.green]].map(([k, v, color], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderTop: `1px solid #e5e8e1`, ...(i === 2 ? { borderBottom: "none" } : { borderBottom: i === 1 ? `1px solid #e5e8e1` : "none" }), fontSize: 11 }}>
                  <span>{k}</span><strong style={color ? { color } : {}}>{v}</strong>
                </div>
              ))}
            </div>
          </article></F>

          {/* Wide: Product memory */}
          <F style={{ gridColumn: "1 / -1" }}><article className="feature-wide" style={{ background: "white", border: `1px solid ${C.border}`, minHeight: 400, display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: 50, alignItems: "center", padding: 34, overflow: "hidden" }}>
            <div>
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: C.denim }}>Product memory</span>
              <h3 style={{ fontSize: "clamp(22px,2.8vw,28px)", lineHeight: 1.12, letterSpacing: "-.035em", margin: "12px 0 14px", fontWeight: 600 }}>It gets better the longer you use it.</h3>
              <p style={{ fontSize: 15, lineHeight: 1.68, color: C.body }}>Every fix, every experiment, every outcome gets logged. Over time, Paperplane builds a running understanding of your product. What's been tried, what works, what your users respond to. So every new fix builds on past experience.</p>
              {["Past outcomes inform new fixes", "Ask it anything about your product's history", "Fix accuracy and speed improve over time"].map((t, i) => (
                <div key={i} style={{ fontSize: 13.5, color: C.body, margin: "10px 0", display: "flex", gap: 6 }}><span style={{ color: C.denim, flexShrink: 0 }}>↳</span>{t}</div>
              ))}
            </div>
            <div style={{ border: `1px solid ${C.border}`, background: "#FDFDFB", borderRadius: 12, padding: 20, boxShadow: `0 16px 48px -22px ${C.ink}1A` }}>
              <span style={{ display: "block", marginBottom: 5, color: C.faint, letterSpacing: ".12em", fontSize: 9, fontWeight: 600, fontFamily: MONO }}>ASK PAPERPLANE</span>
              <div style={{ border: `1px solid ${C.border}`, background: "white", borderRadius: 8, padding: "11px 13px", fontSize: 12.5 }}>What changed in onboarding this quarter?</div>
              <div style={{ marginTop: 14, fontSize: 13, lineHeight: 1.55, color: C.body }}><strong style={{ color: C.ink }}>Two fixes shipped, both verified.</strong> The documentation handoff was replaced with an in-product walkthrough (PR #241, March 14). Setup completion went from 58% to 73%. The invite nudge (PR #256, April 2) hasn't been verified yet. still monitoring.</div>
              <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
                {[["58% → 73%", "Setup completion"], ["4.2 minutes", "Time to first value dropped by"], ["60 days", "Effect still holding after"]].map(([bold, text], i) => (
                  <div key={i} style={{ display: "flex", gap: 9, fontSize: 11.5, color: C.body }}>
                    <span style={{ width: 6, height: 6, background: C.terra, borderRadius: "50%", marginTop: 5, flex: "0 0 auto" }} />
                    <span>{text}: <strong style={{ color: C.ink }}>{bold}</strong></span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
                {["PR #241", "PR #256", "1,842 sessions", "experiment 14"].map(s => <span key={s} style={{ fontFamily: MONO, fontSize: 9.5, background: C.page, border: `1px solid ${C.border}`, padding: "4px 7px", borderRadius: 4, color: C.faint }}>{s}</span>)}
              </div>
            </div>
          </article></F>
        </div>
      </div>
    </section>

    <SectionLine />

    {/* ═══ SAME BUG, TWO TIMELINES ═══ */}
    <section style={{ padding: pad, background: C.paper }}>
      <div style={wrap(IMG_W)}>
        <F>
          <div style={{ maxWidth: 660 }}>
            <div style={eyebrow}>The difference</div>
            <h2 style={h2s}>The same bug, two ways.</h2>
          </div>
        </F>
        <F delay={.06}>
          <div className="bug-columns" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <div>
              <h4 style={{ fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: ".06em", color: C.faint, marginBottom: 20, paddingBottom: 12, borderBottom: `1.5px solid ${C.border}` }}>Without Paperplane</h4>
              {[
                "Day 1. Support tickets trickle in. Customer support team flags it.",
                "Day 3. PM finds a drop in checkout completion. Can't pinpoint the cause. Loops in engineering to investigate.",
                "Day 5. Engineer digs through replays and error logs. Narrows it to mobile. Suspects a timeout.",
                "Day 8. Root cause confirmed. Engineer writes the fix, opens a PR.",
                "Day 10. PR reviewed and merged. Ships in next release cycle.",
                "Day 14+. Deployed. Maybe someone checks the metric. Maybe not.",
              ].map((t, i) => <p key={i} style={{ fontSize: 14.5, lineHeight: 1.6, color: C.body, marginBottom: 10 }}>{t}</p>)}
              <p style={{ fontFamily: MONO, fontSize: 12, fontWeight: 500, lineHeight: 1.5, color: C.faint, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>~2 weeks. 3 teams involved. No verification.</p>
            </div>
            <div>
              <h4 style={{ fontFamily: MONO, fontSize: 12, fontWeight: 500, letterSpacing: ".06em", color: C.denim, marginBottom: 20, paddingBottom: 12, borderBottom: `1.5px solid ${C.denim}` }}>With Paperplane</h4>
              {[
                "Day 1, 9:31 AM. Signal detected. Checkout completion dropped 8%. Traced to a 3s API timeout on slow connections.",
                "Day 1, 9:48 AM. PR opened. Fix, evidence, and 312 affected sessions attached. Slack notification sent.",
                "Day 2. Engineer reviews the diff and evidence. Merged in 20 minutes.",
                "Day 5. Verified. Checkout completion up 8.3%. Outcome logged to memory and next PRs are ready.",
              ].map((t, i) => <p key={i} style={{ fontSize: 14.5, lineHeight: 1.6, color: C.body, marginBottom: 10 }}>{t}</p>)}
              <p style={{ fontFamily: MONO, fontSize: 12, fontWeight: 500, lineHeight: 1.5, color: C.faint, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>~2 days. 1 person reviewed. Verified and logged.</p>
            </div>
          </div>
        </F>
      </div>
    </section>

    <DottedRule />

    {/* ═══ WHERE IT LIVES ═══ */}
    <section style={{ padding: pad, ...stitchBg }}>
      <div style={wrap(IMG_W)}>
        <SurfaceTabs />
      </div>
    </section>

    <SectionLine />

    {/* ═══ THE CYCLE ═══ */}
    <section style={{ padding: pad, background: C.paper }}>
      <div style={wrap(IMG_W)}>
        <F>
          <div className="problem-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "center", overflow: "visible" }}>
            <div>
              <div style={eyebrow}>Always on</div>
              <h2 style={h2s}>Paperplane keeps running.<br />So does your product.</h2>
              <p style={{ ...ps, maxWidth: 540, margin: "20px 0 0" }}>While your team sleeps, Paperplane keeps your product moving, catching problems, working through them, and getting fixes ready for review.</p>
            </div>
            <F delay={.08} style={{ display: "flex", justifyContent: "flex-end" }}>
              <div className="cycle-card" style={{ width: 360, maxWidth: "none", flexShrink: 0, background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: `0 16px 48px -22px ${C.ink}1A` }}>
                <div style={{ padding: "10px 18px", background: "#FDFDFB", borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 11, color: C.faint }}>/ paperplane</div>
                <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "watching", color: C.denim },
                    { label: "working", color: C.gold },
                    { label: "fix ready", color: C.terra },
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14, color: C.ink }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0 }} />{s.label}
                    </div>
                  ))}
                </div>
                <div style={{ padding: "10px 18px", background: C.paper, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 7, fontFamily: MONO, fontSize: 12, fontWeight: 600, color: C.green }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />running 24/7
                </div>
              </div>
            </F>
          </div>
        </F>
      </div>
    </section>

    <DottedRule />

    {/* ═══ CTA ═══ */}
    <section style={{ padding: pad, ...stitchBg }}>
      <div style={wrap(IMG_W)}>
        <F>
          <div style={{ position: "relative", overflow: "hidden", border: `1px solid ${C.border}`, background: C.page }}>
            <img src={I.cta} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: 320, objectFit: "cover", objectPosition: "center 45%", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: C.page, opacity: .74 }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, padding: 24 }}>
              <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: R, padding: "clamp(24px,3vw,30px) clamp(32px,5vw,56px)", textAlign: "center", maxWidth: 580, boxShadow: shadow }}>
                <h2 style={{ ...h2s, marginBottom: 10 }}>Put your product on autopilot.</h2>
                <p style={{ ...ps, fontSize: 15, marginBottom: 20 }}>See what Paperplane finds in its first week.</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => onNavigate("404")} style={btnLaunch}>Launch</button>
                  <button onClick={() => onNavigate("404")} style={btnText}>Get a demo →</button>
                </div>
              </div>
            </div>
          </div>
        </F>
      </div>
    </section>

  </div>);
}

function useFavicon() {
  useEffect(() => {
    const setLink = (rel, href, extra = {}) => {
      let link = document.querySelector(`link[rel="${rel}"]${extra.type ? `[type="${extra.type}"]` : ""}`);
      if (!link) { link = document.createElement("link"); link.rel = rel; document.head.appendChild(link); }
      Object.entries(extra).forEach(([k, v]) => { link[k] = v; });
      link.href = href;
    };
    setLink("icon", faviconIco, { sizes: "any" });
    setLink("icon", faviconSvg, { type: "image/svg+xml" });
    setLink("apple-touch-icon", appleTouchIcon);
  }, []);
}

export default function App() {
  useFavicon();
  const [page, setPage] = useState("home");
  const navigate = useCallback((p) => { setPage(p); window.scrollTo(0, 0); }, []);
  return (<div style={{ background: C.page, minHeight: "100vh" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}img{max-width:100%}button{font-family:inherit}
      ::selection{background:${C.goldSoft};color:${C.ink}}
      @media(prefers-reduced-motion:reduce){*{transition:none!important}}
      @media(max-width:960px){
        .problem-grid{grid-template-columns:1fr!important}
        .cycle-card{width:100%!important;max-width:420px!important}
        .feature-grid{grid-template-columns:1fr!important}
        .feature-grid>div{grid-column:auto!important}
        .feature-wide{grid-template-columns:1fr!important;display:flex!important;flex-direction:column!important;min-height:auto!important;gap:30px!important}
        .bug-columns{grid-template-columns:1fr!important;gap:40px!important}
        .product-body{grid-template-columns:96px 1fr!important}
        .sidebar{padding:12px 7px!important}
        .featured-insight{grid-template-columns:28px 1fr!important}
        .recommendation{grid-column:2}
      }
      @media(max-width:760px){
        .desktop-nav{display:none!important}
        .desktop-btn{display:none!important}
        .mobile-menu-btn{display:flex!important}
        .dashboard-scroll{overflow-x:auto!important;justify-content:flex-start!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x!important}
        .hero-dashboard{width:920px!important;max-width:none!important;flex-shrink:0!important}
        .feature-grid article{min-height:auto!important;padding:24px!important}
        .surface-tab{width:78px!important;padding:8px 0!important;font-size:12px!important}
        .surface-inner{height:auto!important}
        .surface-peek{display:none!important}
        .surface-center{position:static!important;transform:none!important;margin:0 auto!important}
        .surface-web{width:100%!important;height:auto!important}
      }
    `}</style>
    <Header onNavigate={navigate} />
    {page === "home" ? <Home onNavigate={navigate} /> : <NotFound onNavigate={navigate} />}
    <Footer onNavigate={navigate} />
  </div>);
}
