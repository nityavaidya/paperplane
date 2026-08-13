import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import heroImg from "./paperplane-assets/hero.png";
import ctaImg from "./paperplane-assets/cta.png";
import textureBlue from "./paperplane-assets/texture-blue.png";
import faviconIco from "./paperplane-assets/favicon.ico";
import faviconSvg from "./paperplane-assets/favicon.svg";
import appleTouchIcon from "./paperplane-assets/apple-touch-icon.png";

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
  oat: "#D8C9A4",
};

const R = 16;
const shadow = `0 1px 3px ${C.ink}0A, 0 12px 40px -16px ${C.ink}1A`;
const WIDE = 1020;
const NARROW = 760;
const IMG_W = 1100;
const wrap = (w = WIDE) => ({ maxWidth: w, margin: "0 auto", position: "relative", zIndex: 1 });
const pad = "clamp(60px,8.5vw,100px) clamp(24px,6vw,56px)";
const stitchBg = { background: C.page, backgroundImage: `repeating-linear-gradient(180deg,rgba(20,26,23,.022) 0px,rgba(20,26,23,.022) 1px,transparent 1px,transparent 4px)` };
const tag = (c, bg, ln) => ({ fontFamily: MONO, fontSize: 10, letterSpacing: ".05em", padding: "3px 8px", color: c, background: bg, border: `1px solid ${ln}`, whiteSpace: "nowrap", borderRadius: 4 });
const eyebrow = { fontFamily: MONO, fontSize: 11, letterSpacing: ".09em", textTransform: "uppercase", color: C.faint, marginBottom: 18 };
const h2s = { fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 600, lineHeight: 1.16, letterSpacing: "-.028em", color: C.ink, marginBottom: 16 };
const ps = { fontSize: "clamp(15px,1.7vw,16.5px)", lineHeight: 1.74, color: C.body };
const btnLaunch = { background: `url(${I.blue}) center/cover`, backgroundColor: C.denimDeep, color: "#fff", border: "none", borderRadius: 6, padding: "11px 28px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: INTER, backgroundBlendMode: "overlay", boxShadow: `inset 0 0 0 100px ${C.denimDeep}B8` };
const btnText = { background: "none", border: "none", color: C.body, fontSize: 14, fontWeight: 400, cursor: "pointer", fontFamily: INTER, textDecoration: "underline", textUnderlineOffset: 3 };

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
  return (<div style={{ padding: "0 clamp(24px,6vw,56px)" }}><div style={{ maxWidth: WIDE, margin: "0 auto" }}><svg viewBox="0 0 1260 6" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 6 }}>{d}</svg></div></div>);
}

function SectionLine() { return <div style={{ borderTop: `1px solid ${C.border}` }} />; }

const NAV_ITEMS = [
  { label: "Products", sections: [[null, ["paperplane Web", "paperplane Slack", "paperplane MCP", "paperplane CLI", "Context Warehouse"]]] },
  { label: "Docs", sections: [["Dev", ["SDK", "Documentation", "Integrations", "Changelog"]], ["Resources", ["Guides", "Case Studies", "Research", "Blog"]]] },
  { label: "Enterprise", sections: [["Security", ["SOC 2", "Data Handling", "SSO / SAML"]], ["Support", ["Dedicated Slack", "SLAs", "Onboarding"]]] },
  { label: "Pricing", link: true },
  { label: "Company", sections: [[null, ["About", "Careers", "Contact"]]] },
];

function Header({ onNavigate }) {
  const [open, setOpen] = useState(null);
  const [mob, setMob] = useState(false);
  const close = useCallback(() => setOpen(null), []);
  useEffect(() => { const h = () => close(); window.addEventListener("click", h); return () => window.removeEventListener("click", h); }, [close]);
  const NL = ({ mobile }) => (<div style={mobile ? { display: "flex", flexDirection: "column", gap: 2 } : { display: "flex", alignItems: "center" }}>
    {NAV_ITEMS.map((item, idx) => (<div key={idx} style={{ position: "relative" }} {...(!mobile ? { onMouseEnter: () => !item.link && setOpen(idx), onMouseLeave: () => setOpen(null) } : {})}>
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

/* ── interactive surface, height driven by the assign tab (not hard-locked) ── */
function Surface() {
  const [tab, setTab] = useState("ask");
  const [paused, setPaused] = useState(false);
  const [paneH, setPaneH] = useState(null);
  const tabs = ["ask", "assign", "deploy"];
  const resumeRef = useRef(null);
  const measureRef = useRef(null);
  useEffect(() => { if (paused) return; const id = setInterval(() => { setTab(prev => tabs[(tabs.indexOf(prev) + 1) % tabs.length]); }, 7000); return () => clearInterval(id); }, [paused]);
  const click = (t) => { setTab(t); setPaused(true); if (resumeRef.current) clearTimeout(resumeRef.current); resumeRef.current = setTimeout(() => setPaused(false), 15000); };
  // pane height always tracks the assign tab's natural content height (tallest pane), re-measured on any resize/reflow
  useLayoutEffect(() => {
    if (!measureRef.current) return;
    const el = measureRef.current;
    const update = () => setPaneH(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const Av = ({ letter = "A", agent }) => (<div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, background: agent ? C.denimSoft : C.soft, border: `1px solid ${agent ? C.denimLine : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 10, fontWeight: 600, color: agent ? C.denim : C.faint }}>{agent ? <Logo size={12} color={C.denim} /> : letter}</div>);

  const panes = {
    ask: (<div style={{ padding: 22, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 10 }}><Av /><div style={{ fontSize: 14, color: C.ink, lineHeight: 1.6, paddingTop: 2 }}>Why did signups drop 12% last week?</div></div>
        <div style={{ display: "flex", gap: 10 }}><Av agent /><div style={{ fontSize: 14, color: C.body, lineHeight: 1.7, paddingTop: 2 }}>
          <span style={{ color: C.ink, fontWeight: 500 }}>Safari users can't finish step 3.</span>
          <div className="ask-trace">
            <div className="ask-trace-item" style={{ fontSize: 13.5, lineHeight: 1.55, color: C.body }}>A validation change shipped Tuesday broke autofill on the email field.</div>
            <div className="ask-trace-item" style={{ fontSize: 13.5, lineHeight: 1.55, color: C.body }}>847 sessions hit it, 61% abandoned.</div>
            <div className="ask-trace-item ask-trace-last" style={{ fontSize: 13.5, lineHeight: 1.55, color: C.body }}>The funnel shows the drop starts at the email input specifically.</div>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 7, flexWrap: "wrap" }}>{["847 sessions", "Safari 17.x", "43% funnel drop", "since Oct 14"].map(t => (<span key={t} style={tag(C.body, C.soft, C.border)}>{t}</span>))}</div>
        </div></div>
      </div>
      <div style={{ marginTop: "auto", paddingTop: 16 }}>
        <div style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.soft, fontSize: 13.5, color: C.faint }}>Ask about your product...</div>
      </div>
    </div>),
    assign: (<div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10 }}><Av /><div style={{ fontSize: 14, color: C.ink, lineHeight: 1.6, paddingTop: 2 }}><span style={{ color: C.denim, fontWeight: 500 }}>@paperplane</span> a customer says CSV export does nothing. Can you look into it?</div></div>
      <div style={{ display: "flex", gap: 10 }}><Av agent /><div style={{ fontSize: 14, color: C.body, lineHeight: 1.7, paddingTop: 2, width: "100%" }}>
        Found it. Export fails silently when a filter returns over 10k rows. Reproduced across 47 sessions. Error logs confirm a timeout on the unbatched query.
        <div style={{ marginTop: 10, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
          {[["Root cause", "Timeout on unbatched query"], ["Sessions", "47 in 7 days"], ["Error rate", "100% above 10k rows"], ["Fix", "Chunk into 5k batches"]].map(([k, v], i) => (
            <div key={k} style={{ display: "flex", padding: "8px 12px", fontFamily: MONO, fontSize: 11.5, borderBottom: i < 3 ? `1px solid ${C.soft}` : "none" }}>
              <span style={{ color: C.faint, width: 90, flexShrink: 0 }}>{k}</span><span style={{ color: C.ink }}>{v}</span>
            </div>))}
        </div>
        <div style={{ marginTop: 10, fontSize: 13.5, color: C.denim, fontWeight: 500 }}>Pull request ready for review</div>
      </div></div>
    </div>),
    deploy: (<div style={{ padding: 16, display: "flex", flexDirection: "column" }}>
      {[
        { t: "Batch CSV exports over 10k rows", m: "47 users · fixes silent failure", s: "REVIEW PR" },
        { t: "Restore Safari autofill on step 3", m: "847 sessions · +9% completion", s: "REVIEW PR" },
        { t: "Preload pricing table on plan switch", m: "1.2k sessions · 1.4s faster", s: "REVIEW PR" },
        { t: "Add retry logic to webhook delivery", m: "23 accounts · 3 error spikes", s: "DEPLOYED" },
      ].map((r, i) => (
        <div key={i} style={{ padding: "13px 12px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", borderBottom: i < 3 ? `1px solid ${C.soft}` : "none" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: C.ink, marginBottom: 4 }}>{r.t}</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.faint }}>{r.m}</div>
          </div>
          <span style={r.s === "DEPLOYED" ? tag(C.faint, C.paper, C.border) : tag(C.denim, C.denimSoft, C.denimLine)}>{r.s}</span>
        </div>
      ))}
    </div>),
  };

  return (<div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: R, overflow: "hidden", boxShadow: shadow }}>
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "9px 16px", borderBottom: `1px solid ${C.soft}`, background: C.page }}>
      {tabs.map(t => (<button key={t} onClick={() => click(t)} style={{ fontFamily: INTER, fontSize: 13, fontWeight: 500, cursor: "pointer", padding: "6px 13px", borderRadius: 8, textTransform: "capitalize", border: `1px solid ${tab === t ? C.border : "transparent"}`, background: tab === t ? C.paper : "transparent", color: tab === t ? C.ink : C.faint, transition: "all .18s" }}>{t}</button>))}
      <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 10.5, color: C.faint, paddingRight: 6 }}>paperplane</span>
    </div>
    <div style={{ position: "relative" }}>
      <div style={{ height: paneH ?? "auto", overflow: "hidden" }}>{panes[tab]}</div>
      <div ref={measureRef} style={{ position: "absolute", top: 0, left: 0, right: 0, visibility: "hidden", pointerEvents: "none" }} aria-hidden="true">{panes.assign}</div>
    </div>
  </div>);
}

/* ── problem stack (original design) ── */
function ProblemStack() {
  const items = [
    { t: "Onboarding drop at step 3", src: "312 users · sessions + funnel", color: C.terra },
    { t: "Rage clicks on disabled invite", src: "34 accounts · sessions", color: C.terra },
    { t: "CSV export fails over 10k rows", src: "47 users · errors + sessions", color: C.gold },
  ];
  return (<div style={{ position: "relative", maxWidth: 600, margin: "0 auto", paddingBottom: 24 }}>
    <div style={{ position: "absolute", top: 5, left: 5, right: 5, bottom: 18, background: C.soft, border: `1px solid ${C.border}`, borderRadius: R - 2, zIndex: 0 }} />
    <div style={{ position: "absolute", top: 10, left: 10, right: 10, bottom: 12, background: `${C.page}DD`, border: `1px solid ${C.border}`, borderRadius: R - 4, zIndex: 0 }} />
    <div style={{ position: "absolute", top: 15, left: 15, right: 15, bottom: 6, background: C.soft, border: `1px solid ${C.border}`, borderRadius: R - 6, zIndex: 0, opacity: .4 }} />
    <div style={{ position: "relative", zIndex: 1, background: C.paper, border: `1px solid ${C.border}`, borderRadius: R, overflow: "hidden", boxShadow: shadow }}>
      {items.map((r, i) => (
        <div key={i} style={{ padding: "13px 16px", borderBottom: i < items.length - 1 ? `1px solid ${C.soft}` : "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 5, height: 5, background: r.color, borderRadius: 999, flexShrink: 0 }} />
          <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, color: C.ink, marginBottom: 2 }}>{r.t}</div><div style={{ fontFamily: MONO, fontSize: 10, color: C.faint }}>{r.src}</div></div>
          <span style={tag(r.color, r.color === C.terra ? C.terraSoft : C.goldSoft, r.color === C.terra ? C.terraLine : C.goldLine)}>{r.color === C.terra ? "HIGH" : "MED"}</span>
        </div>
      ))}
    </div>
    <div style={{ textAlign: "center", marginTop: 10, fontFamily: MONO, fontSize: 10, color: C.faint, opacity: .5 }}>+ 11 more</div>
  </div>);
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

const PILLARS = [
  { k: "Ask", d: "\"Where are enterprise users getting stuck?\" Query your data in plain English. It maps patterns in the context layer to give you clear answers grounded in real user behavior.", t: "talk to your product data" },
  { k: "Assign", d: "Drop in a support thread or tag @paperplane in Slack. It finds the matching user session, reproduces the bug, and drafts a PR with evidence attached.", t: "bug report to pull request" },
  { k: "Deploy", d: "paperplane runs on autopilot 24/7. It catches broken funnels, writes the code fix, and adds ready-to-merge PRs to your team queue before revenue leaks.", t: "self-improving product loop" },
];
const COMPARE = [
  ["Noticing", "Someone scrubs replays when they have time", "Every session, funnel, and error log watched automatically"],
  ["Diagnosing", "Guess from a metric drop, ask engineering to dig", "Root cause traced across sessions, errors, and code changes"],
  ["Fixing", "Ticket filed, sits behind roadmap work", "PR opened with the change written and evidence attached"],
  ["Verifying", "Nobody checks whether it helped", "Impact measured after deploy, reopened if it didn't work"],
];
const TRACE = [
  ["session #4412", "user pastes email, the field clears"],
  ["47 more sessions", "same clear event, all Safari 17.x"],
  ["error log", "validation throws on autofill input"],
  ["commit a19f3c", "autocomplete attribute removed Tuesday"],
  ["fix", "restore the attribute, add a regression test"],
];

function Home({ onNavigate }) {
  return (<div style={{ background: C.page, color: C.ink, fontFamily: INTER }}>

    {/* ═══ HERO + IMAGE + INTERACTIVE (one continuous stitched section) ═══ */}
    <section style={stitchBg}>
      {/* hero text */}
      <div style={{ padding: "clamp(32px,5vw,56px) clamp(24px,6vw,56px) clamp(16px,2vw,24px)" }}>
        <div style={wrap(WIDE)}>
          <F>
            <h1 style={{ fontSize: "clamp(28px,4.2vw,44px)", fontWeight: 600, lineHeight: 1.08, letterSpacing: "-.04em", marginBottom: 8 }}>Make your product self-improving</h1>
            <p style={{ ...ps, fontSize: "clamp(14.5px,1.7vw,16px)", maxWidth: 520, marginBottom: 10 }}>
              Paperplane monitors your product, catches where users get stuck, and writes the pull request to fix it.
            </p>
            <span style={{ fontFamily: MONO, fontSize: 12, color: "#7A817B", letterSpacing: ".04em" }}>web · slack · terminal</span>
          </F>
        </div>
      </div>

      {/* image with interactive floating inside — image height follows the surface's own (assign-tab-driven) height plus variable padding, not a fixed px value */}
      <div style={{ padding: "0 clamp(24px,6vw,56px)" }}>
        <div style={{ maxWidth: IMG_W, margin: "0 auto" }}>
          <div style={{ position: "relative", overflow: "hidden", border: `1px solid ${C.border}`, background: C.page }}>
            <img src={I.hero} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 42%", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: C.page, opacity: .74 }} />
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "center", padding: "26px clamp(16px,4vw,60px)" }}>
              <div style={{ width: "100%", maxWidth: 840 }}>
                <F><Surface /></F>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* click through + bottom padding, matched to the other sections' rhythm */}
      <div style={{ padding: "18px clamp(24px,6vw,56px) clamp(15px,8.5vw,75px)" }}>
        <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.faint, textAlign: "center" }}>click through the tabs</div>
      </div>
    </section>

    <SectionLine />

    {/* ═══ THREE PROPS ═══ */}
    <section style={{ padding: pad, background: C.paper }}>
      <div style={wrap(WIDE)}>
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 30 }}>
          {[
            ["01", "Context Layer", "Connects user sessions, funnels, and error logs 24/7 into a full context layer of your product.", C.denim],
            ["02", "Automated PRs", "Traces broken user flows down to the code and drafts the fix for you.", C.gold],
            ["03", "Product Memory", "Learns from merged PRs and post-fix metrics to improve diagnosis accuracy and ship cleaner fixes.", C.terra],
          ].map(([n, t, d, col], i) => (
            <F key={i} delay={i * .07}><div style={{ borderTop: `2px solid ${col}`, paddingTop: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: col, marginBottom: 12 }}>{n}</div>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-.02em", marginBottom: 8 }}>{t}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.66, color: C.body }}>{d}</div>
            </div></F>
          ))}
        </div>
      </div>
    </section>

    <DottedRule />

    {/* ═══ PROBLEM ═══ */}
    <section style={{ padding: pad, ...stitchBg }}>
      <div style={wrap(NARROW)}>
        <F>
          <div style={eyebrow}>[ 01 ] The problem</div>
          <h2 style={h2s}>You have the data. Nobody has the hours.</h2>
          <p style={{ ...ps, maxWidth: 600, marginBottom: 36 }}>
            Your stack already logs every broken funnel and API error. But tracing a drop-off down to the exact lines of code takes hours of manual digging. So bugs pile up, friction stays, and users quietly leave.
          </p>
        </F>
        <F delay={.08}><ProblemStack /></F>
      </div>
    </section>

    <SectionLine />

    {/* ═══ HOW IT WORKS ═══ */}
    <section style={{ padding: pad, background: C.paper }}>
      <div style={wrap(WIDE)}>
        <F>
          <div style={eyebrow}>[ 02 ] How it works</div>
          <h2 style={h2s}>One agent across your whole stack.</h2>
          <p style={{ ...ps, maxWidth: 560, marginBottom: 38 }}>
            Paperplane connects your product analytics, error logs, Slack threads, and codebase into a single context layer. Ask it questions, hand it bugs, or let it run on autopilot. It investigates the issue and writes the code fix in a ready-to-merge pull request.
          </p>
        </F>
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {PILLARS.map((c, i) => {
            const cols = [[C.denim, C.denimSoft, C.denimLine], [C.gold, C.goldSoft, C.goldLine], [C.terra, C.terraSoft, C.terraLine]][i];
            return (<F key={i} delay={i * .07}><div style={{ background: C.page, border: `1px solid ${C.border}`, padding: "24px 21px", height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ width: 26, height: 3, background: cols[0], marginBottom: 16 }} />
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 9, color: C.ink }}>{c.k}</div>
              <div style={{ fontSize: 14, lineHeight: 1.66, color: C.body, flex: 1 }}>{c.d}</div>
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 10, color: C.faint }}>{c.t}</div>
            </div></F>);
          })}
        </div>
      </div>
    </section>

    <DottedRule />

    {/* ═══ EVIDENCE ═══ */}
    <section style={{ padding: pad, ...stitchBg }}>
      <div style={wrap(NARROW)}>
        <F>
          <div style={eyebrow}>[ 03 ] Evidence</div>
          <h2 style={h2s}>You can see the work.</h2>
          <p style={{ ...ps, maxWidth: 500, marginBottom: 28 }}>
            Every fix includes the exact evidence chain. You can inspect the user sessions, the error logs, and the git diff before approving any changes.
          </p>
        </F>
        <F delay={.06}>
          <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: R, padding: "4px 0", boxShadow: shadow }}>
            {TRACE.map(([k, v], i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "13px 18px", borderBottom: i < TRACE.length - 1 ? `1px solid ${C.soft}` : "none" }}>
                <span style={{ fontFamily: MONO, fontSize: 10, width: 110, flexShrink: 0, color: i === TRACE.length - 1 ? C.terra : C.faint }}>{k}</span>
                <span style={{ fontSize: 13.5, lineHeight: 1.5 }}>{v}</span>
              </div>
            ))}
          </div>
        </F>
      </div>
    </section>

    <SectionLine />

    {/* ═══ COMPARE ═══ */}
    <section style={{ padding: pad, background: C.paper }}>
      <div style={wrap(WIDE)}>
        <F>
          <div style={eyebrow}>[ 04 ] What changes</div>
          <h2 style={{ ...h2s, marginBottom: 30 }}>The same week, two ways.</h2>
        </F>
        <F delay={.06}>
          <div style={{ border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div className="cmp" style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", background: C.page, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ padding: "11px 16px" }} />
              <div style={{ padding: "11px 16px", fontFamily: MONO, fontSize: 10.5, color: C.faint, letterSpacing: ".07em" }}>TODAY</div>
              <div style={{ padding: "11px 16px", fontFamily: MONO, fontSize: 10.5, color: "#fff", letterSpacing: ".07em", background: C.denimDeep, backgroundImage: `url(${I.blue})`, backgroundSize: "cover", backgroundBlendMode: "overlay", boxShadow: `inset 0 0 0 200px ${C.denimDeep}C0` }}>WITH PAPERPLANE</div>
            </div>
            {COMPARE.map(([k, a, b], i) => (
              <div key={i} className="cmp" style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", borderBottom: i < 3 ? `1px solid ${C.soft}` : "none" }}>
                <div style={{ padding: "12px 16px", fontFamily: MONO, fontSize: 10.5, color: C.faint, letterSpacing: ".05em", textTransform: "uppercase" }}>{k}</div>
                <div style={{ padding: "12px 16px", fontSize: 13.5, lineHeight: 1.6, color: C.faint }}>{a}</div>
                <div style={{ padding: "12px 16px", fontSize: 13.5, lineHeight: 1.6, color: C.ink, background: C.denimSoft }}>{b}</div>
              </div>
            ))}
          </div>
        </F>
      </div>
    </section>

    <DottedRule />

    {/* ═══ WHERE IT LIVES ═══ */}
    <section style={{ padding: pad, ...stitchBg }}>
      <div style={wrap(WIDE)}>
        <F>
          <div style={eyebrow}>[ 05 ] Where it lives</div>
          <h2 style={h2s}>It lives where you work.</h2>
          <p style={{ ...ps, maxWidth: 520, marginBottom: 34 }}>One context layer across your entire stack. No context-switching, no fragmented tools.</p>
        </F>
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {[["Web", "Your central hub for high-level overview, metric trends, and pending team approvals.", C.denim],
            ["Slack", "Triage bugs, run quick queries, and grant approvals without leaving your team chats.", C.gold],
            ["Terminal", "Native CLI and MCP access directly from your terminal.", C.terra]
          ].map(([t, d, col], i) => (
            <F key={i} delay={i * .07}><div style={{ background: C.paper, border: `1px solid ${C.border}`, padding: "24px 21px", height: "100%" }}>
              <div style={{ width: 26, height: 3, background: col, marginBottom: 16 }} />
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 9 }}>{t}</div>
              <div style={{ fontSize: 14, lineHeight: 1.65, color: C.body }}>{d}</div>
            </div></F>
          ))}
        </div>
      </div>
    </section>

    <SectionLine />

    {/* ═══ CTA ═══ */}
    <section style={{ padding: "clamp(48px,7vw,80px) clamp(24px,6vw,56px)", background: C.paper }}>
      <div style={{ maxWidth: IMG_W, margin: "0 auto" }}>
        <F>
          <div style={{ position: "relative", overflow: "hidden", border: `1px solid ${C.border}`, background: C.page }}>
            <img src={I.cta} alt="" style={{ width: "100%", height: 320, objectFit: "cover", objectPosition: "center 45%", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: C.page, opacity: .74 }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, padding: 24 }}>
              <div style={{ background: `${C.page}F5`, backdropFilter: "blur(4px)", border: `1px solid ${C.border}`, borderRadius: R, padding: "clamp(24px,3vw,30px) clamp(32px,5vw,56px)", textAlign: "center", maxWidth: 580, boxShadow: shadow }}>
                <h2 style={{ ...h2s, marginBottom: 10 }}>Put your product on autopilot</h2>
                <p style={{ ...ps, fontSize: 15, marginBottom: 20 }}>See what paperplane finds in your first week.</p>
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

/* ── favicon injection: sets the tab icon links on mount since this file has no index.html to edit directly ── */
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
      .ask-trace{position:relative;margin-top:10px;margin-left:2px;padding-left:16px;display:flex;flex-direction:column}
      .ask-trace-item{position:relative;margin-bottom:8px}
      .ask-trace-item:last-child{margin-bottom:0}
      .ask-trace-item::before{content:"";position:absolute;left:-16px;top:0;bottom:-8px;width:2px;background:${C.border}}
      .ask-trace-item::after{content:"";position:absolute;left:-16px;top:.65em;width:9px;height:2px;background:${C.border}}
      .ask-trace-last::before{bottom:auto;height:.65em}
      @media(prefers-reduced-motion:reduce){*{transition:none!important}}
      @media(max-width:760px){
        .g3{grid-template-columns:1fr!important}
        .cmp{grid-template-columns:1fr!important}
        .cmp>div:first-child{display:none}
        .desktop-nav{display:none!important}
        .desktop-btn{display:none!important}
        .mobile-menu-btn{display:flex!important}
      }
    `}</style>
    <Header onNavigate={navigate} />
    {page === "home" ? <Home onNavigate={navigate} /> : <NotFound onNavigate={navigate} />}
    <Footer onNavigate={navigate} />
  </div>);
}
