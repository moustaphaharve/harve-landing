import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  WALL_IN: 700, MENU_IN: 350, DOCK_IN: 400, APP_DELAY: 500, APP_IN: 400,
  PILL_DELAY: 600, IDLE: 1800, ZOOM: 1000, GREET_HOLD: 1700, GREET_OUT: 400,
  POST_GREET: 400, EXPAND: 480, EXPANDED: 2000, SUBMIT: 180, PRAISE_IN: 80,
  PRAISE_HOLD: 1400, PRAISE_OUT: 450, HARD_CUT: 250,
};

const HARVE_LOGO_SRC = "/harve-logo-white.png";

/** Demo balance shown in app window + expanded pill */
const DEMO_BALANCE = "$537.22";

const font = {
  ui: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  round: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
};

const HarveLogoImg = ({ size = 22, style = {} }) => (
  <img
    src={HARVE_LOGO_SRC}
    alt=""
    draggable={false}
    width={size}
    height={size}
    style={{ width: size, height: size, objectFit: "contain", display: "block", ...style }}
  />
);

/** Translucent white mark (menu bar, window chrome, pill) — not the solid blue dock tile. */
const HarveLogoGhost = ({ size = 18 }) => (
  <HarveLogoImg
    size={size}
    style={{ opacity: 0.78, filter: "drop-shadow(0 0 10px rgba(255,255,255,0.12))" }}
  />
);

/** White Harve mark on blue tile — dock only. */
const HarveLogoBlueBadge = ({ outer = 36, logo = 22 }) => (
  <div
    style={{
      width: outer,
      height: outer,
      borderRadius: outer * 0.26,
      background: "linear-gradient(180deg, #1d4ed8 0%, #2563eb 52%, #1e3a8a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 10px rgba(0,0,0,0.28)",
    }}
  >
    <HarveLogoImg size={logo} />
  </div>
);

const WifiIcon = ({ color = "rgba(255,255,255,0.85)" }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" fill={color} stroke="none" />
  </svg>
);

const BatteryIcon = ({ color = "rgba(255,255,255,0.82)" }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="16" height="10" rx="2" />
    <path d="M21 10.5v3" strokeLinecap="round" />
    <rect x="5" y="9" width="10" height="6" rx="0.5" fill={color} fillOpacity="0.35" stroke="none" />
  </svg>
);

const PulseDot = () => (
  <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 6px rgba(52,211,153,0.6)", animation: "pulseDot 2s ease-in-out infinite" }} />
);

const TimerDisplay = ({ seconds }) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return (
    <span style={{
      fontFamily: font.round,
      fontSize: 13,
      fontWeight: 500,
      fontVariantNumeric: "tabular-nums",
      fontFeatureSettings: '"tnum" 1',
      letterSpacing: "0.04em",
      color: "rgba(52, 62, 78, 0.88)",
      lineHeight: 1.15,
    }}>
      {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}
    </span>
  );
};

const Avatar = ({ letter = "A", size = 26 }) => (
  <div style={{ width: size, height: size, borderRadius: 7, background: "linear-gradient(135deg, #4A90D9, #6BB8E8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", position: "relative", overflow: "hidden", flexShrink: 0 }}>
    {letter}
    <div style={{ position: "absolute", top: 0, left: "-100%", width: "100%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)", animation: "avatarShine 3s ease-in-out infinite" }} />
  </div>
);

const TopBar = ({ show }) => (
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0, height: 26, zIndex: 10,
    background: "rgba(0,0,0,0.28)", backdropFilter: "blur(36px) saturate(150%)", WebkitBackdropFilter: "blur(36px) saturate(150%)",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px",
    opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(-26px)",
    transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
  }}>
    <HarveLogoGhost size={17} />
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <WifiIcon color="rgba(255,255,255,0.88)" />
      <BatteryIcon color="rgba(255,255,255,0.88)" />
    </div>
  </div>
);

const Dock = ({ show }) => (
  <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", zIndex: 10, opacity: show ? 1 : 0, transition: "opacity 0.4s ease" }}>
    <div style={{
      width: 54, height: 62, borderRadius: 13, background: "rgba(0,0,0,0.22)",
      backdropFilter: "blur(32px) saturate(150%)", WebkitBackdropFilter: "blur(32px) saturate(150%)",
      border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center",
      transform: show ? "translateY(0)" : "translateY(30px)", transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.15s",
    }}>
      <HarveLogoBlueBadge outer={42} logo={26} />
    </div>
  </div>
);

const Wallpaper = ({ show }) => (
  <div style={{
    position: "absolute", inset: 0, opacity: show ? 1 : 0,
    transform: show ? "scale(1)" : "scale(1.05)",
    transition: "opacity 0.7s ease, transform 1.2s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #d94070 0%, #e8334a 20%, #f03060 40%, #d32860 60%, #c02868 80%, #9a3080 100%)" }} />
    <div style={{ position: "absolute", top: "-25%", right: "-10%", width: "75%", height: "65%", background: "radial-gradient(ellipse at 60% 15%, #2e8bcf 0%, #3a9ae0 20%, rgba(60,150,220,0.5) 45%, transparent 75%)", filter: "blur(8px)" }} />
    <div style={{ position: "absolute", top: "5%", right: "-5%", width: "70%", height: "35%", background: "radial-gradient(ellipse at 55% 30%, rgba(200,225,245,0.5) 0%, rgba(180,215,240,0.35) 30%, transparent 65%)", filter: "blur(12px)" }} />
    <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "60%", height: "50%", background: "radial-gradient(ellipse at 75% 75%, #f5a623 0%, rgba(240,136,42,0.6) 30%, transparent 65%)", filter: "blur(10px)" }} />
    <div style={{ position: "absolute", top: "12%", right: "12%", width: "40%", height: "35%", background: "radial-gradient(ellipse at center, rgba(255,240,230,0.5) 0%, rgba(255,220,200,0.25) 40%, transparent 70%)", filter: "blur(6px)" }} />
    <div style={{ position: "absolute", bottom: "0%", left: "0%", width: "55%", height: "55%", background: "radial-gradient(ellipse at 20% 85%, rgba(130,60,160,0.45) 0%, rgba(100,40,130,0.25) 40%, transparent 70%)", filter: "blur(10px)" }} />
    <div style={{ position: "absolute", top: "25%", left: "-5%", width: "75%", height: "55%", background: "radial-gradient(ellipse at 30% 50%, rgba(220,50,80,0.35) 0%, rgba(230,40,90,0.25) 35%, transparent 70%)", filter: "blur(8px)" }} />
  </div>
);

const HarveWindow = ({ show, blur = 0 }) => {
  const recs = [
    { date: "Mar 26 · 4:45 AM", meta: "0.0h active · Quality 55/100 · Professional", amt: "$0.12" },
    { date: "Mar 26 · 4:37 AM", meta: "0.1h active · Quality 78/100 · High Value", amt: "$2.68" },
    { date: "Mar 26 · 4:25 AM", meta: "0.0h active · Quality 41/100 · Professional", amt: "$0.06" },
    { date: "Mar 26 · 4:22 AM", meta: "0.0h active · Quality 68/100 · Professional", amt: "$0.26" },
    { date: "Mar 26 · 4:10 AM", meta: "0.2h active · Quality 91/100 · High Value", amt: "$5.43" },
  ];
  return (
    <div style={{
      position: "absolute", top: 32, left: "50%", transform: show ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0.9)",
      width: "calc(100% - 20px)", maxWidth: 748, height: "calc(100% - 84px)",
      background: "#111114", borderRadius: 12, overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 6px 20px rgba(0,0,0,0.2)",
      opacity: show ? 1 : 0,
      filter: blur > 0 ? `blur(${blur}px)` : "none",
      transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1), filter 0.8s ease",
      fontFamily: font.ui, color: "#E4E4E8",
      display: "flex", flexDirection: "column", zIndex: 20,
      minHeight: 0,
    }}>
      <div style={{ paddingTop: 6, background: "#111114", flexShrink: 0 }}>
        <div style={{ padding: "8px 14px 8px 14px", display: "flex", alignItems: "center", gap: 10, minHeight: 38 }}>
          <div style={{ display: "flex", gap: 6, marginRight: 4, alignItems: "center", flexShrink: 0 }}>
            {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
          </div>
          <HarveLogoGhost size={20} />
          <div style={{ flex: 1, minWidth: 8 }} />
          <Avatar letter="A" />
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 12%, rgba(255,255,255,0.07) 88%, transparent 100%)" }} />
        <div style={{ height: 4 }} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", minHeight: 0, WebkitOverflowScrolling: "touch" }}>
        <div style={{ padding: "0 22px 12px", background: "#111114" }}>
          <div style={{ padding: "14px 0 10px", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.28, color: "#E4E4E8" }}>Hey, Alex</div>
            <div style={{ fontSize: 13, fontWeight: 400, color: "#5E5E6A", lineHeight: 1.45 }}>
              Available:{" "}
              <span className="harve-demo-dollar" style={{ color: "#A8A8B2" }}>{DEMO_BALANCE}</span>
              {" "}· Next payout Monday
            </div>
          </div>
          <div style={{ marginBottom: 12, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.11)" }}>
            <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5, color: "rgba(255,255,255,0.96)" }}>Your recent sessions are scoring as high-value professional work. That means higher payouts. Keep it up.</div>
            <div style={{ fontSize: 12, fontWeight: 400, marginTop: 8, color: "rgba(255,255,255,0.58)", lineHeight: 1.4 }}>Average quality score: 88/100.</div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(100px, 26%)",
              gap: 10,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                minWidth: 0,
                padding: "12px 14px 10px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #0F1B3D 0%, #1A2F6B 40%, #2845A0 100%)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "100%", background: "linear-gradient(135deg, transparent, rgba(59,130,246,0.15))" }} />
              <div style={{ fontSize: 16, fontWeight: 600, color: "white", position: "relative", lineHeight: 1.3, marginBottom: 6 }}>Start earning now</div>
              <div style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.56)", marginBottom: 10, lineHeight: 1.42, position: "relative" }}>Longer sessions pay more. Start recording and forget.</div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto", position: "relative" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: font.round,
                    color: "rgba(255,255,255,0.95)",
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  <span style={{ opacity: 0.95, fontSize: 9 }}>●</span> Start Recording
                </div>
              </div>
            </div>
            <div
              style={{
                minWidth: 0,
                padding: "10px 12px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 500, marginBottom: 4, color: "#5E5E6A", lineHeight: 1.2, letterSpacing: "0.02em" }}>Earned today</div>
              <div
                className="harve-demo-dollar"
                style={{
                  fontSize: 22,
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1.1,
                  color: "#E4E4E8",
                }}
              >
                {DEMO_BALANCE}
              </div>
              <div style={{ fontSize: 11, fontWeight: 400, color: "#5E5E6A", marginTop: 6, lineHeight: 1.35 }}>Next payout: Monday</div>
            </div>
          </div>
        </div>
        <div style={{ background: "#0C0C0F", borderRadius: "14px 14px 0 0", minHeight: 108 }}>
          <div style={{ padding: "14px 18px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>Recordings</div>
              <div style={{ fontSize: 12, color: "#5E5E6A" }}>19 total</div>
            </div>
            {recs.map((r, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "8px 12px" }}>
                <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35 }}>{r.date}</div>
                  <div style={{ fontSize: 11, color: "#5E5E6A", marginTop: 4, lineHeight: 1.4 }}>{r.meta}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0, marginLeft: "auto" }}>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: "#5E5E6A", lineHeight: 1.2, paddingTop: 2 }}>SUBMITTED</span>
                  <span className="harve-demo-dollar" style={{ fontSize: 13, fontVariantNumeric: "tabular-nums", lineHeight: 1.2, minWidth: 52, textAlign: "right" }}>{r.amt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Pill = ({ expanded, showGreeting, greetingOp, showPanel, showPraise, praiseOp, timerSec, pillOp, solidOp }) => {
  const br = expanded && !showPraise ? 18 : 100;
  const pad = expanded && !showPraise ? "0 16px 12px" : "0 18px";
  return (
    <div style={{
      width: 288, margin: "0 auto", overflow: "hidden",
      background: "linear-gradient(145deg, rgba(225,240,255,0.28) 0%, rgba(180,215,255,0.16) 100%)",
      backdropFilter: "blur(32px) saturate(180%) brightness(1.04)",
      WebkitBackdropFilter: "blur(32px) saturate(180%) brightness(1.04)",
      borderRadius: br, padding: pad,
      border: "1px solid rgba(255,255,255,0.28)",
      boxShadow: "0 8px 28px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)",
      opacity: pillOp,
      transition: "border-radius 0.48s cubic-bezier(0.4,0,0.2,1), padding 0.48s cubic-bezier(0.4,0,0.2,1), opacity 0.34s ease-out",
      position: "relative",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, #E8F0FF 0%, #D4E4FA 100%)", borderRadius: "inherit", opacity: solidOp, transition: "opacity 0.4s ease-out", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ height: 46, display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 2 }}>
        <HarveLogoGhost size={22} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
          {showGreeting && (
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                fontFamily: font.ui,
                color: "rgba(30,50,80,0.88)",
                opacity: greetingOp,
                transition: "opacity 0.4s ease-out",
                whiteSpace: "nowrap",
              }}
            >
              Hey, Alex.
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}><PulseDot /><TimerDisplay seconds={timerSec} /></div>
      </div>
      {expanded && (
        <div style={{ maxHeight: showPanel ? 232 : 0, opacity: showPanel ? 1 : 0, overflow: "hidden", transition: "max-height 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease-out" }}>
          <div style={{ background: "rgba(242,250,255,0.42)", border: "1px solid rgba(255,255,255,0.65)", borderRadius: 12, padding: "10px 14px 8px", marginBottom: 8, backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 9, fontWeight: 500, fontFamily: font.ui, color: "rgba(60,80,110,0.55)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>THIS SESSION</div>
            <div
              className="harve-demo-dollar"
              style={{
                fontSize: 30,
                color: "rgba(22,42,72,0.94)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              {DEMO_BALANCE}
            </div>
            <div style={{ fontSize: 11, fontWeight: 400, fontFamily: font.ui, color: "rgba(60,80,110,0.58)", marginTop: 4, lineHeight: 1.35 }}>
              Quality score <span style={{ fontWeight: 500, color: "rgba(52,150,100,0.85)" }}>82</span>/100 · High Value
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", gap: 6, alignItems: "stretch", paddingBottom: 0 }}>
            <button
              type="button"
              style={{
                flex: "1 1 58%",
                minHeight: 32,
                borderRadius: 9,
                border: "1px solid rgba(180,200,225,0.42)",
                background: "rgba(240,248,255,0.52)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 400,
                fontFamily: font.ui,
                color: "rgba(45,65,95,0.82)",
                cursor: "default",
                padding: "0 8px",
              }}
            >
              <span style={{ fontSize: 10, opacity: 0.85, letterSpacing: "-0.05em" }}>❚❚</span> Pause
            </button>
            <button type="button" style={{ width: 34, minHeight: 32, borderRadius: 9, border: "1px solid rgba(180,200,225,0.4)", background: "rgba(240,248,255,0.5)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "default", flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(40,60,90,0.68)" strokeWidth="1.85" strokeLinecap="round"><rect x="9" y="1" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0014 0" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            </button>
            <button type="button" style={{ width: 34, minHeight: 32, borderRadius: 9, border: "1px solid rgba(100,140,200,0.38)", background: "linear-gradient(135deg, rgba(80,130,220,0.58), rgba(60,110,200,0.72))", display: "flex", alignItems: "center", justifyContent: "center", cursor: "default", flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
          </div>
        </div>
      )}
      {showPraise && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, opacity: praiseOp, transition: "opacity 0.52s ease-out" }}>
          <span style={{ fontSize: 15, fontWeight: 500, fontFamily: font.ui, color: "rgba(30,60,100,0.88)" }}>Nice work!</span>
        </div>
      )}
    </div>
  );
};

function resetAll(setters) {
  const s = setters;
  s.setWallIn(false); s.setMenuIn(false); s.setDockIn(false); s.setWindowIn(false);
  s.setPillVisible(false); s.setExpanded(false); s.setShowPanel(false); s.setShowGreeting(false);
  s.setGreetingOp(0); s.setSolidOp(0); s.setShowPraise(false); s.setPraiseOp(0); s.setPillOp(1);
  s.setTimerSec(322); s.setZoom(1); s.setBgBlur(0); s.setPillPhase("hidden");
}

export default function HarveFullDemo({ play = false }) {
  const [wallIn, setWallIn] = useState(false);
  const [menuIn, setMenuIn] = useState(false);
  const [dockIn, setDockIn] = useState(false);
  const [windowIn, setWindowIn] = useState(false);
  const [pillVisible, setPillVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingOp, setGreetingOp] = useState(0);
  const [solidOp, setSolidOp] = useState(0);
  const [showPraise, setShowPraise] = useState(false);
  const [praiseOp, setPraiseOp] = useState(0);
  const [pillOp, setPillOp] = useState(1);
  const [timerSec, setTimerSec] = useState(322);
  const [zoom, setZoom] = useState(1);
  const [bgBlur, setBgBlur] = useState(0);
  const [pillPhase, setPillPhase] = useState("hidden");
  const mountedRef = useRef(true);
  const runIdRef = useRef(0);
  const demoContainerRef = useRef(null);
  /** Max pill scale so the zoom animation never wider than the demo frame (fixes mobile “severe zoom”). */
  const pillZoomCapRef = useRef(2.08);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const updatePillZoomCap = useCallback(() => {
    const el = demoContainerRef.current;
    if (!el) return;
    const w = el.getBoundingClientRect().width;
    const margin = 20;
    const pillBase = 288;
    const cap = Math.min(2.08, Math.max(1, (w - margin) / pillBase));
    pillZoomCapRef.current = cap;
  }, []);

  const resetPill = useCallback(() => {
    setPillVisible(false); setExpanded(false); setShowPanel(false); setShowGreeting(false);
    setGreetingOp(0); setSolidOp(0); setShowPraise(false); setPraiseOp(0); setPillOp(1);
    setTimerSec(322); setZoom(1); setBgBlur(0); setPillPhase("hidden");
  }, []);

  useEffect(() => {
    updatePillZoomCap();
    const el = demoContainerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => updatePillZoomCap());
    ro.observe(el);
    return () => ro.disconnect();
  }, [updatePillZoomCap]);

  const runPillCycle = useCallback(async () => {
    const myRun = runIdRef.current;
    if (!mountedRef.current) return;
    resetPill();
    await sleep(150);
    if (myRun !== runIdRef.current || !mountedRef.current) return;
    setPillVisible(true); setPillPhase("idle");
    await sleep(T.IDLE);
    if (myRun !== runIdRef.current || !mountedRef.current) return;
    updatePillZoomCap();
    setPillPhase("zooming"); setZoom(pillZoomCapRef.current); setBgBlur(6);
    await sleep(T.ZOOM);
    if (myRun !== runIdRef.current || !mountedRef.current) return;
    setPillPhase("greeting"); setShowGreeting(true); setSolidOp(1);
    await sleep(150); setGreetingOp(1);
    await sleep(T.GREET_HOLD);
    if (myRun !== runIdRef.current || !mountedRef.current) return;
    setGreetingOp(0); await sleep(T.GREET_OUT);
    setShowGreeting(false); setSolidOp(0);
    await sleep(T.POST_GREET);
    if (myRun !== runIdRef.current || !mountedRef.current) return;
    setPillPhase("expanding"); setExpanded(true);
    await sleep(50); setShowPanel(true);
    await sleep(T.EXPAND + 150);
    if (myRun !== runIdRef.current || !mountedRef.current) return;
    setPillPhase("expanded"); await sleep(T.EXPANDED);
    if (myRun !== runIdRef.current || !mountedRef.current) return;
    setPillPhase("submitting"); await sleep(T.SUBMIT);
    setShowPanel(false); setExpanded(false); setShowPraise(true); setSolidOp(1);
    setPillPhase("praise");
    await sleep(T.PRAISE_IN); setPraiseOp(1);
    await sleep(T.PRAISE_HOLD);
    if (myRun !== runIdRef.current || !mountedRef.current) return;
    setPraiseOp(0); setPillOp(0);
    await sleep(T.PRAISE_OUT);
    if (myRun !== runIdRef.current || !mountedRef.current) return;
    await sleep(T.HARD_CUT);
    if (myRun !== runIdRef.current || !mountedRef.current) return;
    runPillCycle();
  }, [resetPill, updatePillZoomCap]);

  useEffect(() => {
    mountedRef.current = true;
    if (!play) {
      runIdRef.current += 1;
      resetAll({
        setWallIn, setMenuIn, setDockIn, setWindowIn,
        setPillVisible, setExpanded, setShowPanel, setShowGreeting,
        setGreetingOp, setSolidOp, setShowPraise, setPraiseOp, setPillOp,
        setTimerSec, setZoom, setBgBlur, setPillPhase,
      });
      return () => { mountedRef.current = false; };
    }

    const myRun = ++runIdRef.current;
    (async () => {
      await sleep(200);
      if (myRun !== runIdRef.current || !mountedRef.current) return;
      setWallIn(true);
      await sleep(T.WALL_IN); if (myRun !== runIdRef.current || !mountedRef.current) return;
      setMenuIn(true);
      await sleep(T.MENU_IN); if (myRun !== runIdRef.current || !mountedRef.current) return;
      setDockIn(true);
      await sleep(T.DOCK_IN);
      await sleep(T.APP_DELAY); if (myRun !== runIdRef.current || !mountedRef.current) return;
      setWindowIn(true);
      await sleep(T.APP_IN);
      await sleep(T.PILL_DELAY); if (myRun !== runIdRef.current || !mountedRef.current) return;
      await runPillCycle();
    })();

    return () => {
      mountedRef.current = false;
      runIdRef.current += 1;
    };
  }, [play, runPillCycle]);

  useEffect(() => {
    if (pillPhase === "expanded" || pillPhase === "expanding") {
      const iv = setInterval(() => setTimerSec(s => s + 1), 1000);
      return () => clearInterval(iv);
    }
  }, [pillPhase]);

  return (
    <div
      ref={demoContainerRef}
      className="harve-demo-stage"
      style={{
        width: "100%", maxWidth: 980, aspectRatio: "16 / 10", maxHeight: "var(--harve-demo-max-h, min(62vh, 620px))",
        margin: "0 auto", position: "relative", overflow: "hidden", background: "#FFF",
        fontFamily: font.ui,
        borderRadius: 18, lineHeight: "normal",
      }}
    >
      <style>{`
        @keyframes pulseDot{0%,100%{opacity:1;box-shadow:0 0 6px rgba(52,211,153,0.6)}50%{opacity:0.6;box-shadow:0 0 2px rgba(52,211,153,0.3)}}
        @keyframes avatarShine{0%,70%,100%{left:-100%}85%{left:100%}}
        .harve-demo-root-inner *{box-sizing:border-box}
        .harve-demo-root-inner button{font:inherit}
        .harve-demo-root-inner .harve-demo-dollar{font-family:'Nunito','Inter',system-ui,sans-serif!important;font-weight:700!important;font-style:normal!important}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.14)}
      `}</style>
      <div className="harve-demo-root-inner" style={{
        position: "absolute", inset: 0, lineHeight: "normal",
        overflow: "hidden", borderRadius: 18, isolation: "isolate",
      }}>
        <Wallpaper show={wallIn} />
        <TopBar show={menuIn} />
        <HarveWindow show={windowIn} blur={bgBlur} />
        <div style={{
          position: "absolute", top: 28, left: "50%",
          transform: `translateX(-50%) scale(${zoom})`, transformOrigin: "top center",
          transition: "transform 1s cubic-bezier(0.4,0,0.2,1)",
          width: 288, minHeight: 52, zIndex: 200, pointerEvents: "none",
          maxWidth: "calc(100% - 16px)",
        }}>
          <div style={{ transform: pillVisible ? "translateY(0)" : "translateY(-20px)", opacity: pillVisible ? 1 : 0, transition: "transform 0.3s ease-out, opacity 0.3s ease-out" }}>
            <Pill expanded={expanded} showGreeting={showGreeting} greetingOp={greetingOp}
              showPanel={showPanel} showPraise={showPraise} praiseOp={praiseOp}
              timerSec={timerSec} pillOp={pillOp} solidOp={solidOp} />
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.45) 100%)", zIndex: 199, opacity: bgBlur > 0 ? 0.65 : 0, transition: "opacity 0.8s ease" }} />
        <Dock show={dockIn} />
      </div>
    </div>
  );
}
