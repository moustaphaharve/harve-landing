import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  WALL_IN: 700, MENU_IN: 350, DOCK_IN: 400, APP_DELAY: 500, APP_IN: 400,
  PILL_DELAY: 600, IDLE: 1800, ZOOM: 1000, GREET_HOLD: 1700, GREET_OUT: 400,
  POST_GREET: 400, EXPAND: 480, EXPANDED: 2000, SUBMIT: 180, PRAISE_IN: 80,
  PRAISE_HOLD: 1400, PRAISE_OUT: 450, HARD_CUT: 250,
};

const HarveWaveMark = ({ size = 22, circleColor = "#E4E4E8", waveColor = "#111114", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <circle cx="50" cy="50" r="46" fill={circleColor} />
    <path d="M22 35 Q36 28, 50 35 Q64 42, 78 35" stroke={waveColor} strokeWidth="7" fill="none" strokeLinecap="round" />
    <path d="M22 50 Q36 43, 50 50 Q64 57, 78 50" stroke={waveColor} strokeWidth="7" fill="none" strokeLinecap="round" />
    <path d="M22 65 Q36 58, 50 65 Q64 72, 78 65" stroke={waveColor} strokeWidth="7" fill="none" strokeLinecap="round" />
  </svg>
);

const PillLogo = ({ size = 24 }) => (
  <HarveWaveMark size={size} circleColor="rgba(200,220,240,0.9)" waveColor="rgba(30,50,80,0.85)" />
);

const WifiIcon = ({ color = "rgba(255,255,255,0.85)" }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" fill={color} stroke="none" />
  </svg>
);

const PulseDot = () => (
  <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 6px rgba(52,211,153,0.6)", animation: "pulseDot 2s ease-in-out infinite" }} />
);

const TimerDisplay = ({ seconds }) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return (
    <span style={{ fontFamily: "'SF Mono', Menlo, Consolas, monospace", fontSize: 12, fontWeight: 500, color: "rgba(80,110,150,0.9)", fontVariantNumeric: "tabular-nums", letterSpacing: 0.5, lineHeight: 1.2 }}>
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
    position: "absolute", top: 0, left: 0, right: 0, height: 24, zIndex: 10,
    background: "rgba(255,255,255,0.22)", backdropFilter: "blur(40px) saturate(200%)", WebkitBackdropFilter: "blur(40px) saturate(200%)",
    display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px",
    opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(-24px)",
    transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
  }}>
    <HarveWaveMark size={16} circleColor="rgba(255,255,255,0.9)" waveColor="rgba(0,0,0,0.7)" />
    <WifiIcon color="rgba(255,255,255,0.85)" />
  </div>
);

const Dock = ({ show }) => (
  <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", zIndex: 10, opacity: show ? 1 : 0, transition: "opacity 0.4s ease" }}>
    <div style={{
      width: 50, height: 59, borderRadius: 12, background: "rgba(255,255,255,0.22)",
      backdropFilter: "blur(40px) saturate(200%)", WebkitBackdropFilter: "blur(40px) saturate(200%)",
      border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center",
      transform: show ? "translateY(0)" : "translateY(30px)", transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.15s",
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 9, background: "#111114", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <HarveWaveMark size={24} />
      </div>
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
      position: "absolute", top: 36, left: "50%", transform: show ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0.9)",
      width: "calc(100% - 32px)", maxWidth: 640, height: "calc(100% - 88px)",
      background: "#111114", borderRadius: 10, overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 6px 20px rgba(0,0,0,0.2)",
      opacity: show ? 1 : 0,
      filter: blur > 0 ? `blur(${blur}px)` : "none",
      transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1), filter 0.8s ease",
      fontFamily: "'Inter', -apple-system, sans-serif", color: "#E4E4E8",
      display: "flex", flexDirection: "column", zIndex: 20,
      minHeight: 0,
    }}>
      <div style={{ paddingTop: 4, background: "#111114", flexShrink: 0 }}>
        <div style={{ padding: "5px 12px 6px 12px", display: "flex", alignItems: "center", gap: 8, minHeight: 34 }}>
          <div style={{ display: "flex", gap: 6, marginRight: 4, alignItems: "center", flexShrink: 0 }}>
            {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
          </div>
          <HarveWaveMark size={22} />
          <div style={{ flex: 1, minWidth: 8 }} />
          <Avatar letter="A" />
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 12%, rgba(255,255,255,0.07) 88%, transparent 100%)" }} />
        <div style={{ height: 6 }} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", minHeight: 0, WebkitOverflowScrolling: "touch" }}>
        <div style={{ padding: "0 28px 20px", background: "#111114" }}>
          <div style={{ padding: "16px 0 14px", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.25, color: "#E4E4E8" }}>Hey, Alex</div>
            <div style={{ fontSize: 13, color: "#5E5E6A", lineHeight: 1.4 }}>Available: $20.00 · Next payout Monday</div>
          </div>
          <div style={{ marginBottom: 14, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.11)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.45, color: "rgba(255,255,255,0.96)" }}>Your recent sessions are scoring as high-value professional work. That means higher payouts. Keep it up.</div>
            <div style={{ fontSize: 12, fontWeight: 500, marginTop: 8, color: "rgba(255,255,255,0.58)", lineHeight: 1.35 }}>Average quality score: 88/100.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: 20, borderRadius: 14, background: "linear-gradient(135deg, #0F1B3D 0%, #1A2F6B 40%, #2845A0 100%)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "100%", background: "linear-gradient(135deg, transparent, rgba(59,130,246,0.15))" }} />
              <div style={{ fontSize: 16, fontWeight: 600, color: "white", position: "relative", lineHeight: 1.3, marginBottom: 8 }}>Start earning now</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 14, lineHeight: 1.45, position: "relative" }}>Longer sessions pay more. Start recording and forget.</div>
              <div style={{ display: "inline-flex", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "white", background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.12)", position: "relative" }}>● Start Recording</div>
            </div>
            <div style={{ padding: "18px 20px", borderRadius: 14, background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 6, color: "#5E5E6A", lineHeight: 1.2 }}>Earned today</div>
              <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.15 }}>$20.00</div>
              <div style={{ fontSize: 12, color: "#5E5E6A", marginTop: 8, lineHeight: 1.35 }}>Next payout: Monday</div>
            </div>
          </div>
        </div>
        <div style={{ background: "#0C0C0F", borderRadius: "14px 14px 0 0", minHeight: 120 }}>
          <div style={{ padding: "16px 28px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>Recordings</div>
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
                  <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, minWidth: 52, textAlign: "right" }}>{r.amt}</span>
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
  const pad = expanded && !showPraise ? "0 18px 14px" : "0 18px";
  return (
    <div style={{
      width: 280, margin: "0 auto", overflow: "hidden",
      background: "linear-gradient(145deg, rgba(225,240,255,0.28) 0%, rgba(180,215,255,0.16) 100%)",
      backdropFilter: "blur(32px) saturate(180%) brightness(1.04)",
      WebkitBackdropFilter: "blur(32px) saturate(180%) brightness(1.04)",
      borderRadius: br, padding: pad,
      border: "1px solid rgba(255,255,255,0.35)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)",
      opacity: pillOp,
      transition: "border-radius 0.48s cubic-bezier(0.4,0,0.2,1), padding 0.48s cubic-bezier(0.4,0,0.2,1), opacity 0.34s ease-out",
      position: "relative",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, #E8F0FF 0%, #D4E4FA 100%)", borderRadius: "inherit", opacity: solidOp, transition: "opacity 0.4s ease-out", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ height: 48, display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 2 }}>
        <PillLogo size={24} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
          {showGreeting && <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(30,50,80,0.85)", opacity: greetingOp, transition: "opacity 0.4s ease-out", whiteSpace: "nowrap" }}>Hey, Alex.</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}><PulseDot /><TimerDisplay seconds={timerSec} /></div>
      </div>
      {expanded && (
        <div style={{ maxHeight: showPanel ? 230 : 0, opacity: showPanel ? 1 : 0, overflow: "hidden", transition: "max-height 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease-out" }}>
          <div style={{ background: "rgba(242,250,255,0.42)", border: "1px solid rgba(255,255,255,0.7)", borderRadius: 13, padding: "11px 14px", marginBottom: 10, backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(60,80,110,0.6)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>THIS SESSION</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "rgba(20,40,70,0.9)", fontVariantNumeric: "tabular-nums", lineHeight: 1.1, fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>$397.45</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(60,80,110,0.55)", marginTop: 3 }}>Quality score <span style={{ color: "rgba(52,150,100,0.8)" }}>82</span>/100 · High Value</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button type="button" style={{ flex: 1, height: 34, borderRadius: 10, border: "1px solid rgba(180,200,225,0.4)", background: "rgba(240,248,255,0.5)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "rgba(40,60,90,0.75)", cursor: "default", fontFamily: "-apple-system, sans-serif" }}>
              <span style={{ fontSize: 10 }}>❚❚</span> Pause
            </button>
            <button type="button" style={{ width: 38, height: 34, borderRadius: 10, border: "1px solid rgba(180,200,225,0.4)", background: "rgba(240,248,255,0.5)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "default", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(40,60,90,0.7)" strokeWidth="2" strokeLinecap="round"><rect x="9" y="1" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0014 0" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            </button>
            <button type="button" style={{ width: 38, height: 34, borderRadius: 10, border: "1px solid rgba(100,140,200,0.4)", background: "linear-gradient(135deg, rgba(80,130,220,0.6), rgba(60,110,200,0.7))", display: "flex", alignItems: "center", justifyContent: "center", cursor: "default", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
          </div>
        </div>
      )}
      {showPraise && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, opacity: praiseOp, transition: "opacity 0.52s ease-out" }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "rgba(30,60,100,0.85)" }}>Nice work!</span>
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
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const resetPill = useCallback(() => {
    setPillVisible(false); setExpanded(false); setShowPanel(false); setShowGreeting(false);
    setGreetingOp(0); setSolidOp(0); setShowPraise(false); setPraiseOp(0); setPillOp(1);
    setTimerSec(322); setZoom(1); setBgBlur(0); setPillPhase("hidden");
  }, []);

  const runPillCycle = useCallback(async () => {
    const myRun = runIdRef.current;
    if (!mountedRef.current) return;
    resetPill();
    await sleep(150);
    if (myRun !== runIdRef.current || !mountedRef.current) return;
    setPillVisible(true); setPillPhase("idle");
    await sleep(T.IDLE);
    if (myRun !== runIdRef.current || !mountedRef.current) return;
    setPillPhase("zooming"); setZoom(2.6); setBgBlur(6);
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
  }, [resetPill]);

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
    <div style={{
      width: "100%", maxWidth: 880, aspectRatio: "16 / 10", maxHeight: "min(56vh, 520px)",
      margin: "0 auto", position: "relative", overflow: "hidden", background: "#FFF",
      fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', 'Inter', sans-serif",
      borderRadius: 18, lineHeight: "normal",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes pulseDot{0%,100%{opacity:1;box-shadow:0 0 6px rgba(52,211,153,0.6)}50%{opacity:0.6;box-shadow:0 0 2px rgba(52,211,153,0.3)}}
        @keyframes avatarShine{0%,70%,100%{left:-100%}85%{left:100%}}
        .harve-demo-root-inner *{box-sizing:border-box}
        .harve-demo-root-inner button{font:inherit}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.14)}
      `}</style>
      <div className="harve-demo-root-inner" style={{ position: "absolute", inset: 0, lineHeight: "normal" }}>
        <Wallpaper show={wallIn} />
        <TopBar show={menuIn} />
        <HarveWindow show={windowIn} blur={bgBlur} />
        <div style={{
          position: "absolute", top: 30, left: "50%",
          transform: `translateX(-50%) scale(${zoom})`, transformOrigin: "top center",
          transition: "transform 1s cubic-bezier(0.4,0,0.2,1)",
          width: 280, height: 280, zIndex: 200, pointerEvents: "none",
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
