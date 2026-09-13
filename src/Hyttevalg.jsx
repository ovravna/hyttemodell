import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { ChevronDown, ChevronUp, RotateCcw, Check, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Fem fritidseiendommer, vurdert mot hverandre.                     */
/*  Alle tall og sitater er hentet fra salgsoppgavene.                */
/* ------------------------------------------------------------------ */

const BASE = import.meta.env.BASE_URL;

/* The five photos live in public/ rather than inline: 207 KB of base64 in
   the bundle is 207 KB the page waits for before it can draw anything. */
const IMG = {
  k19: BASE + "img/hv-k19.webp",
  k40: BASE + "img/hv-k40.webp",
  bros: BASE + "img/hv-bros.webp",
  vael: BASE + "img/hv-vael.webp",
  svan: BASE + "img/hv-svan.webp",
};

const METRICS = [
  ["vei", "Bilvei helt frem"],
  ["strom", "Strøm"],
  ["vann", "Vann"],
  ["avlop", "Mulighet for avløp"],
  ["tilstand", "Bygningstilstand"],
  ["papirer", "Papirer og lovlighet"],
  ["tomt", "Tomt"],
  ["drift", "Lave løpende kostnader"],
  ["vinter", "Vinterbruk"],
  ["innflytting", "Kan brukes nå"],
  ["oslo", "Nærhet til Oslo"],
];

const CABINS = [
  {
    id: "k19",
    name: "Kausebøl 19",
    place: "Spydeberg · 45 min fra Oslo",
    price: 513850,
    priceNote: "totalpris",
    built: 1969,
    area: "40 m²",
    land: "110 m² festet",
    m: { vei: 10, strom: 9, vann: 6, avlop: 5, tilstand: 3, papirer: 2, tomt: 3, drift: 8, vinter: 5, innflytting: 6, oslo: 9 },
    asap: "Tak og takkonstruksjon med påvist råte, gitt strakstiltak. Deretter drenering.",
    plus: [
      "Den eneste med kjørevei helt frem og parkering ved hytta",
      "Innlagt vann og strøm, terrasse på 38 m²",
    ],
    minus: [
      "Fem byggetiltak uten godkjenning, ingen ferdigattest",
      "Råte i bærende takkonstruksjon, anslag 130 til 350 000",
    ],
  },
  {
    id: "k40",
    name: "Kausebøl 40",
    place: "Spydeberg · 45 min fra Oslo",
    price: 708900,
    priceNote: "anslått totalpris",
    built: 1977,
    area: "45 m²",
    land: "110 m² festet",
    m: { vei: 2, strom: 9, vann: 3, avlop: 2, tilstand: 4, papirer: 6, tomt: 3, drift: 6, vinter: 2, innflytting: 7, oslo: 9 },
    asap: "Beslag og tetting rundt pipa. Fuktskadene i bjelkelag og krypkjeller må undersøkes nærmere.",
    plus: [
      "Åtte år nyere, og kommunen sier manglende ferdigattest er uten praktisk betydning",
      "Terrasse vendt mot syd, arealene er 3D-skannet",
    ],
    minus: [
      "Ingen bilvei. Skogssti siste stykket, og vann bæres 50 meter om vinteren",
      "Terreng av fjell som takstmannen sier ikke er økonomisk rasjonelt å drenere",
    ],
  },
  {
    id: "bros",
    name: "Brøsholveien 229",
    place: "Båstad, Trøgstad · 55 min fra Oslo",
    price: 718850,
    priceNote: "totalpris",
    built: 1960,
    area: "37 m² + 51 m² bod",
    land: "682 m² eiet",
    m: { vei: 4, strom: 8, vann: 4, avlop: 3, tilstand: 4, papirer: 6, tomt: 9, drift: 8, vinter: 3, innflytting: 6, oslo: 8 },
    asap: "Skorsteinen er deformert og ustabil med fare for sammenbrudd. Ikke fyr før den er utbedret.",
    plus: [
      "682 m² selveiertomt. Ingen festeavgift, ingen grunneier",
      "Utsikt over Øyeren, full kjeller og veranda på 31 m²",
    ],
    minus: [
      "Sommervann fra kran i hytteveggen, snurredass i anneks",
      "Takkonstruksjon med nedbøyning og råte i vinduer",
    ],
  },
  {
    id: "vael",
    name: "Vælsveien 58",
    place: "Hensmoen, Ringerike · 1 t 15 fra Oslo",
    price: 411090,
    priceNote: "totalpris",
    built: 1965,
    area: "44 m²",
    land: "Festet",
    m: { vei: 2, strom: 1, vann: 1, avlop: 2, tilstand: 4, papirer: 4, tomt: 2, drift: 2, vinter: 1, innflytting: 4, oslo: 4 },
    asap: "Pipe og ildsted, elektrisk anlegg og branntekniske forhold har alle fått TG3.",
    plus: [
      "Lavest pris av de fem",
      "Bygningen fremstår vedlikeholdt tross alderen",
    ],
    minus: [
      "Ingen strøm. Festeavgiften er 9 520 i året, fire ganger de andre",
      "Parkering og brønnrett hviler på en muntlig avtale som ikke er tinglyst",
    ],
  },
  {
    id: "svan",
    name: "Svanfossvegen 311",
    place: "Nes · 50 min fra Oslo",
    price: 475000,
    priceNote: "finn i dag, prospektet sa 334 125",
    built: 1946,
    area: "Rives",
    land: "646 m² eiet",
    m: { vei: 0, strom: 8, vann: 0, avlop: 1, tilstand: 0, papirer: 3, tomt: 9, drift: 9, vinter: 0, innflytting: 0, oslo: 8 },
    rebuild: true,
    asap: "Riving. Bygningen er vurdert som teknisk og helsemessig uegnet for videre bruk.",
    plus: [
      "646 m² selveiertomt ned mot Vorma, uten festeavgift",
      "Strøm er allerede fremført til eiendommen",
    ],
    minus: [
      "100 prosent fuktinnhold i treverket og 28 cm setning over seks meter",
      "Tvangssalg, så avhendingsloven gjelder ikke og du har nesten ingen rettigheter",
    ],
  },
];

/* Each question raises the weight of the metrics it touches. */
const QUESTIONS = [
  { id: "q1", text: "Må du kunne kjøre helt frem til døra?", hits: { vei: 3 } },
  { id: "q2", text: "Skal hytta brukes om vinteren?", hits: { vinter: 3, strom: 1 } },
  { id: "q3", text: "Vil du eie tomta selv?", hits: { tomt: 3, drift: 1 } },
  { id: "q4", text: "Er du åpen for å rive og bygge nytt?", gate: "svan", hits: {} },
  { id: "q5", text: "Må du ha vannklosett på sikt?", hits: { avlop: 3, vann: 1 } },
  { id: "q6", text: "Vil du kunne bruke hytta med en gang?", hits: { innflytting: 2, tilstand: 2 } },
  { id: "q7", text: "Gjør dere mye av arbeidet selv?", damp: true, hits: {} },
  { id: "q8", text: "Er lave løpende kostnader viktig?", hits: { drift: 3 } },
];

const fmt = (n) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");

/* a score that counts up or down instead of jumping */
function Num({ v }) {
  const [d, setD] = useState(v);
  const raf = useRef(0);
  const from = useRef(v);
  useEffect(() => {
    const a = from.current;
    const b = v;
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / 420);
      const e = 1 - Math.pow(1 - k, 3);
      setD(a + (b - a) * e);
      if (k < 1) raf.current = requestAnimationFrame(tick);
      else from.current = b;
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [v]);
  return <>{d.toFixed(1)}</>;
}

export default function Hyttevalg() {
  const [ans, setAns] = useState({});
  const [step, setStep] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [budget, setBudget] = useState(800);
  const [open, setOpen] = useState(null);
  const [picked, setPicked] = useState(null);
  const pickTimer = useRef(0);
  useEffect(() => () => clearTimeout(pickTimer.current), []);

  const weights = useMemo(() => {
    const w = {};
    METRICS.forEach(([k]) => (w[k] = 1));
    for (const q of QUESTIONS) {
      if (ans[q.id] !== "ja") continue;
      for (const [k, v] of Object.entries(q.hits)) w[k] += v;
    }
    /* doing the work yourself makes poor condition less disqualifying */
    if (ans.q7 === "ja") w.tilstand = Math.max(0.4, w.tilstand * 0.4);
    return w;
  }, [ans]);

  const wSum = Object.values(weights).reduce((a, b) => a + b, 0);

  const ranked = useMemo(() => {
    return CABINS.map((c) => {
      const raw = METRICS.reduce((s, [k]) => s + weights[k] * c.m[k], 0) / wSum;
      const overBudget = c.price > budget * 1000;
      const gated = c.rebuild && ans.q4 === "nei";
      return {
        ...c,
        score: raw,
        out: overBudget || gated,
        why: overBudget
          ? "Over budsjettet ditt"
          : gated
          ? "Krever at du river og bygger nytt"
          : null,
      };
    }).sort((a, b) => {
      if (a.out !== b.out) return a.out ? 1 : -1;
      return b.score - a.score;
    });
  }, [weights, wSum, budget, ans]);

  const winner = ranked.find((c) => !c.out);
  const runnerUp = ranked.filter((c) => !c.out)[1];
  const answered = QUESTIONS.filter((q) => ans[q.id]).length;
  const BUDGET_STEP = QUESTIONS.length;
  const DONE = QUESTIONS.length + 1;
  const done = step >= DONE;
  const revealed = done || showAll;

  /* the three weighted strengths that carried the winner */
  const drivers = useMemo(() => {
    if (!winner) return [];
    return METRICS.map(([k, label]) => ({ k, label, v: winner.m[k] * weights[k] }))
      .filter((x) => winner.m[x.k] >= 6 && weights[x.k] > 1)
      .sort((a, b) => b.v - a.v)
      .slice(0, 3);
  }, [winner, weights]);

  /* rows glide to their new place instead of snapping */
  const listRef = useRef(null);
  const posRef = useRef({});
  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el || typeof el.querySelectorAll !== "function") return;
    const reduce =
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.querySelectorAll("[data-id]").forEach((r) => {
      const id = r.getAttribute("data-id");
      const top = r.getBoundingClientRect().top;
      const prev = posRef.current[id];
      if (!reduce && prev !== undefined && Math.abs(prev - top) > 1 && r.animate) {
        r.animate(
          [{ transform: `translateY(${prev - top}px)` }, { transform: "none" }],
          { duration: 440, easing: "cubic-bezier(.22,1,.36,1)" }
        );
      }
      posRef.current[id] = top;
    });
  });

  const answer = (q, v) => {
    if (picked) return;
    setAns({ ...ans, [q.id]: v });
    if (showAll) return;
    /* let the choice register on screen before the next question */
    setPicked(v);
    pickTimer.current = setTimeout(() => {
      setStep((st) => st + 1);
      setPicked(null);
    }, 340);
  };

  const css = `
  .hv *{box-sizing:border-box}
  .hv{--ink:#16221B;--ink2:#43524A;--ink3:#7E8C83;--paper:#EDEFE8;--card:#F7F8F4;
    --line:#C9D0C3;--skog:#7FA55E;--skog-l:#D7E4C8;--red:#B34A44;--red-l:#F1D8D6;
    --gold:#B08A2E;
    background:var(--paper);color:var(--ink);font-family:Archivo,'Helvetica Neue',Arial,sans-serif;
    font-size:15px;line-height:1.5;padding:0 0 56px;-webkit-text-size-adjust:100%}
  .hv h1,.hv h2,.hv h3{margin:0;font-weight:600;letter-spacing:-0.018em}
  .wrap{max-width:900px;margin:0 auto;padding:0 18px}

  .top{border-bottom:2px solid var(--ink);padding:34px 0 22px}
  .hv h1{font-size:clamp(27px,5.4vw,42px);line-height:1.02}
  .backlink{margin:14px 0 0;font-family:'Archivo Narrow',sans-serif;font-size:13px}
  .backlink a{color:var(--ink);text-decoration:none;
    border-bottom:1.5px solid var(--skog);padding-bottom:1px}
  .lede{font-family:'Archivo Narrow',sans-serif;color:var(--ink2);font-size:14.5px;
    margin-top:9px;max-width:62ch}

  .sec{padding:34px 0 0}
  .sec>h2{font-size:18px;margin-bottom:4px}
  .hint{font-family:'Archivo Narrow',sans-serif;font-size:12.5px;color:var(--ink3);
    margin:0 0 14px}

  /* quiz */
  .quiz{background:var(--card);border:1px solid var(--line);padding:20px 20px 18px;
    margin-top:6px}
  .prog{display:flex;gap:4px;margin-bottom:16px}
  .prog i{flex:1;height:4px;background:var(--line);transition:background .3s}
  .prog i.on{background:var(--skog)}
  .prog i.cur{background:var(--ink)}
  .qnum{font-family:'Archivo Narrow',sans-serif;font-size:11.5px;color:var(--ink3);
    letter-spacing:.05em;text-transform:uppercase}
  .qbig{font-size:clamp(19px,3.4vw,25px);font-weight:600;letter-spacing:-0.02em;
    margin:5px 0 18px;line-height:1.2}
  .yn{display:flex;gap:10px}
  .yn button{font:inherit;font-size:15px;font-weight:500;flex:1;padding:13px 10px;
    background:var(--paper);border:1px solid var(--ink);cursor:pointer;color:var(--ink);
    display:inline-flex;align-items:center;justify-content:center;gap:7px;
    transition:background .15s,color .15s}
  .yn button:focus-visible{outline:2px solid var(--skog);outline-offset:2px}
  .yn.locked{pointer-events:none}
  .yn.locked button{opacity:.38}
  .yn button.picked{background:var(--ink);color:var(--paper);border-color:var(--ink);
    opacity:1;transform:translateY(-1px)}
  .qbig{transition:opacity .18s}
  .yn.locked ~ .qnav{opacity:.5}
  @media (hover:hover) and (pointer:fine){
    .yn button:hover{background:var(--skog-l)}
  }
  .qnav{display:flex;justify-content:space-between;align-items:center;margin-top:14px}
  .lnk{font:inherit;font-family:'Archivo Narrow',sans-serif;font-size:12.5px;
    display:inline-flex;align-items:center;gap:5px;background:none;border:0;padding:0;
    color:var(--ink3);cursor:pointer}
  .lnk:hover{color:var(--ink)}
  .qdone{font-size:15px}
  .qdone b{display:block;font-size:19px;margin-bottom:4px}

  /* compact question list */
  .qs{border-top:1px solid var(--line);margin-top:6px}
  .q{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;
    border-bottom:1px solid var(--line);padding:10px 0}
  .qt{font-size:14px}
  .opts{display:flex;flex-shrink:0;border:1px solid var(--line)}
  .opts button{font:inherit;font-family:'Archivo Narrow',sans-serif;font-size:12.5px;
    padding:5px 13px;background:none;border:0;border-right:1px solid var(--line);
    cursor:pointer;color:var(--ink3)}
  .opts button:last-child{border-right:0}
  .opts button[aria-pressed=true]{background:var(--ink);color:var(--paper)}

  .dial{display:block;margin:20px 0 0}
  .dhead{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
  .dhead b{font-size:13.5px;font-weight:500}
  .dhead span{font-family:'Archivo Narrow',sans-serif;font-size:13px;color:var(--ink2)}
  .hv input[type=range]{width:100%;margin:6px 0 0;accent-color:var(--skog);height:24px}

  /* winner */
  .win{margin-top:14px;background:var(--ink);color:var(--paper);position:relative}
  .win-grid{display:grid;grid-template-columns:260px 1fr}
  .win img{width:100%;height:100%;object-fit:cover;display:block;min-height:190px}
  .win-body{padding:18px 20px 20px}
  .win-tag{font-family:'Archivo Narrow',sans-serif;font-size:11px;color:var(--skog);
    letter-spacing:.06em;text-transform:uppercase;font-weight:600}
  .win h3{font-size:24px;margin:4px 0 2px}
  .win-place{font-family:'Archivo Narrow',sans-serif;font-size:12.5px;color:#A9B8AC}
  .win-price{font-size:19px;font-weight:600;margin:10px 0 0;font-variant-numeric:tabular-nums}
  .win-price em{font-style:normal;font-size:11.5px;color:#93A697;margin-left:6px;
    font-family:'Archivo Narrow',sans-serif}
  .chips{display:flex;flex-wrap:wrap;gap:6px;margin:13px 0 0}
  .chip{font-family:'Archivo Narrow',sans-serif;font-size:11.5px;padding:3px 9px;
    border:1px solid rgba(255,255,255,.28);color:#C6D6CA}
  .win-asap{font-family:'Archivo Narrow',sans-serif;font-size:12.5px;line-height:1.45;
    color:#C6D6CA;margin:13px 0 0;padding-top:11px;border-top:1px solid rgba(255,255,255,.15)}
  .win-asap b{color:#EFA9A3;font-weight:600;display:block;font-size:11px;
    letter-spacing:.05em;text-transform:uppercase;margin-bottom:3px}
  .gap{font-family:'Archivo Narrow',sans-serif;font-size:12px;color:var(--ink3);
    margin:9px 0 0}

  /* ranking */
  .row{border-bottom:1px solid var(--line);background:var(--paper)}
  .rhead{display:grid;grid-template-columns:26px minmax(0,1fr) 132px 52px 22px;
    gap:11px;align-items:center;padding:11px 0;cursor:pointer}
  .badge{width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;
    font-family:'Archivo Narrow',sans-serif;font-size:12px;border:1px solid var(--line);
    color:var(--ink3);font-variant-numeric:tabular-nums}
  .badge.b1{background:var(--ink);border-color:var(--ink);color:var(--paper);font-weight:600}
  .badge.b2{border-color:var(--ink2);color:var(--ink2)}
  .rname{font-size:14.5px;font-weight:500}
  .rname small{display:block;font-weight:400;font-size:11.5px;color:var(--ink3);
    font-family:'Archivo Narrow',sans-serif}
  .bar{height:10px;background:var(--card);border:1px solid var(--line);position:relative}
  .bar i{position:absolute;left:0;top:0;bottom:0;background:var(--skog-l);
    transition:width .44s cubic-bezier(.22,1,.36,1)}
  .bar i.lead{background:var(--skog)}
  .sc{font-family:'Archivo Narrow',sans-serif;font-size:14px;text-align:right;
    font-variant-numeric:tabular-nums;font-weight:600}
  .chev{color:var(--ink3);display:flex;align-items:center;justify-content:center}
  .row.out{opacity:.4}
  .out-why{color:var(--red)}

  .rbody{padding:2px 0 18px 37px;display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .pm{margin:0;padding:0;list-style:none}
  .pm li{font-size:13.5px;line-height:1.45;padding:4px 0 4px 15px;position:relative;
    color:var(--ink2)}
  .pm li:before{content:"";position:absolute;left:0;top:10px;width:6px;height:6px}
  .pm.plus li:before{background:var(--skog)}
  .pm.minus li:before{background:var(--red)}
  .pmh{font-family:'Archivo Narrow',sans-serif;font-size:11px;color:var(--ink3);
    letter-spacing:.05em;text-transform:uppercase;margin-bottom:2px}
  .facts{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:14px;
    font-family:'Archivo Narrow',sans-serif;font-size:12px;color:var(--ink3);
    border-top:1px solid var(--line);padding-top:10px}

  /* matrix */
  .mx{width:100%;border-collapse:collapse;font-size:13px}
  .mx th{font-family:'Archivo Narrow',sans-serif;font-size:11.5px;font-weight:400;
    color:var(--ink3);text-align:center;padding:0 4px 7px;vertical-align:bottom}
  .mx th:first-child{text-align:left}
  .mx th.lead{color:var(--ink);font-weight:600}
  .mx td{border-top:1px solid var(--line);padding:6px 4px;text-align:center;
    font-variant-numeric:tabular-nums}
  .mx td:first-child{text-align:left;font-family:'Archivo Narrow',sans-serif;
    font-size:12.5px;color:var(--ink2);white-space:nowrap}
  .cell{display:inline-block;width:26px;padding:2px 0;font-size:12.5px}
  .w{font-family:'Archivo Narrow',sans-serif;font-size:11px;color:var(--skog);
    margin-left:4px;font-weight:600}

  .foot{margin-top:36px;border-top:1px solid var(--line);padding-top:13px;
    font-family:'Archivo Narrow',sans-serif;font-size:12px;color:var(--ink3);max-width:76ch}
  .foot p{margin:0 0 6px}

  @media (max-width:720px){
    .win-grid{grid-template-columns:1fr}
    .win img{min-height:150px;max-height:190px}
    .rhead{grid-template-columns:24px minmax(0,1fr) 50px 20px;gap:9px;row-gap:8px}
    .bar{grid-column:2/4;grid-row:2}
    .rbody{grid-template-columns:1fr;padding-left:22px}
    .q{grid-template-columns:1fr;gap:7px}
    .opts{align-self:flex-start}
    .quiz{padding:16px 15px 15px}
    .mx{font-size:12px}
    .mx td:first-child{font-size:11.5px}
    .cell{width:22px}
  }
  @media (prefers-reduced-motion:reduce){.hv *{transition:none!important}}
  `;

  const q = QUESTIONS[step];

  return (
    <div className="hv">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Archivo+Narrow:wght@400;600&display=swap');`}</style>
      <style>{css}</style>

      <header className="top">
        <div className="wrap">
          <h1>Hvilken hytte?</h1>
          <p className="lede">
            Fem fritidseiendommer, vurdert på elleve punkter hentet fra
            salgsoppgavene. Svar på spørsmålene, så vektes punktene etter hva du
            faktisk bryr deg om, og rangeringen flytter seg.
          </p>
          <p className="backlink">
            <a href={BASE}>Tilbake til regnestykket for Kausebøl 19</a>
          </p>
        </div>
      </header>

      <div className="wrap">
        <section className="sec">
          <h2>Hva er viktig for deg?</h2>
          <p className="hint">
            {answered} av {QUESTIONS.length} besvart. Ubesvarte teller nøytralt.
          </p>

          {showAll ? (
            <>
              <div className="qs">
                {QUESTIONS.map((qq) => (
                  <div className="q" key={qq.id}>
                    <span className="qt">{qq.text}</span>
                    <span className="opts">
                      {["ja", "nei"].map((v) => (
                        <button
                          key={v}
                          aria-pressed={ans[qq.id] === v}
                          onClick={() =>
                            setAns({
                              ...ans,
                              [qq.id]: ans[qq.id] === v ? undefined : v,
                            })
                          }
                        >
                          {v === "ja" ? "Ja" : "Nei"}
                        </button>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
              <label className="dial">
                <span className="dhead">
                  <b>Maks totalpris</b>
                  <span>{fmt(budget * 1000)} kr</span>
                </span>
                <input
                  type="range"
                  min={300}
                  max={900}
                  step={10}
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                />
              </label>
              <div className="qnav">
                <button className="lnk" onClick={() => { setShowAll(false); setStep(DONE); }}>
                  Tilbake til spørsmålene
                </button>
                <button
                  className="lnk"
                  onClick={() => {
                    setAns({});
                    setStep(0);
                  }}
                >
                  <RotateCcw size={13} />
                  Nullstill
                </button>
              </div>
            </>
          ) : (
            <div className="quiz">
              <div className="prog">
                {QUESTIONS.map((qq, i) => (
                  <i
                    key={qq.id}
                    className={
                      i === step && !done ? "cur" : ans[qq.id] ? "on" : ""
                    }
                  />
                ))}
              </div>

              {step < QUESTIONS.length ? (
                <>
                  <div className="qnum">
                    Spørsmål {step + 1} av {QUESTIONS.length}
                  </div>
                  <div className="qbig">{q.text}</div>
                  <div className={"yn" + (picked ? " locked" : "")}>
                    <button
                      className={picked === "ja" ? "picked" : ""}
                      onClick={(e) => { e.currentTarget.blur(); answer(q, "ja"); }}
                    >
                      <Check size={17} />
                      Ja
                    </button>
                    <button
                      className={picked === "nei" ? "picked" : ""}
                      onClick={(e) => { e.currentTarget.blur(); answer(q, "nei"); }}
                    >
                      <X size={17} />
                      Nei
                    </button>
                  </div>
                </>
              ) : step === BUDGET_STEP ? (
                <>
                  <div className="qnum">Til slutt</div>
                  <div className="qbig">Hva er budsjettet?</div>
                  <label className="dial" style={{ margin: 0 }}>
                    <span className="dhead">
                      <b>Maks totalpris</b>
                      <span>{fmt(budget * 1000)} kr</span>
                    </span>
                    <input
                      type="range"
                      min={300}
                      max={900}
                      step={10}
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                    />
                  </label>
                  <div className="yn" style={{ marginTop: 16 }}>
                    <button onClick={(e) => { e.currentTarget.blur(); setStep(DONE); }}>
                      Vis resultatet
                    </button>
                  </div>
                </>
              ) : (
                <div className="qdone">
                  <b>Ferdig.</b>
                  Rangeringen under er vektet etter svarene dine. Gå gjerne
                  tilbake og endre et svar, eller juster budsjettet.
                </div>
              )}

              <div className="qnav">
                <button
                  className="lnk"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  style={{ visibility: step === 0 ? "hidden" : "visible" }}
                >
                  Forrige
                </button>
                <button className="lnk" onClick={() => setShowAll(true)}>
                  Vis alle svarene
                </button>
              </div>
            </div>
          )}

        </section>

        {revealed && winner ? (
          <section className="sec">
            <h2>Da peker det hit</h2>
            <p className="hint">
              Basert på svarene dine, ikke på hva jeg mener om hyttene.
            </p>
            <div className="win">
              <div className="win-grid">
                <img src={IMG[winner.id]} alt={winner.name} />
                <div className="win-body">
                  <div className="win-tag">Best treff</div>
                  <h3>{winner.name}</h3>
                  <div className="win-place">{winner.place}</div>
                  <div className="win-price">
                    {fmt(winner.price)} kr <em>{winner.priceNote}</em>
                  </div>
                  {drivers.length ? (
                    <div className="chips">
                      {drivers.map((d) => (
                        <span className="chip" key={d.k}>
                          {d.label}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className="win-asap">
                    <b>Må fikses først</b>
                    {winner.asap}
                  </p>
                </div>
              </div>
            </div>
            {runnerUp ? (
              <p className="gap">
                {(winner.score - runnerUp.score).toFixed(1)} poeng foran{" "}
                {runnerUp.name}.
              </p>
            ) : null}
          </section>
        ) : null}

        {revealed ? (
        <section className="sec">
          <h2>Rangering</h2>
          <p className="hint">Trykk på en rad for styrker og svakheter.</p>
          <div ref={listRef} style={{ borderTop: "2px solid var(--ink)" }}>
            {ranked.map((c, i) => {
              const isOpen = open === c.id;
              return (
                <div
                  className={"row" + (c.out ? " out" : "")}
                  key={c.id}
                  data-id={c.id}
                >
                  <div
                    className="rhead"
                    role="button"
                    tabIndex={0}
                    onClick={() => setOpen(isOpen ? null : c.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpen(isOpen ? null : c.id);
                      }
                    }}
                  >
                    <span
                      className={
                        "badge" + (c.out ? "" : i === 0 ? " b1" : i === 1 ? " b2" : "")
                      }
                    >
                      {c.out ? "–" : i + 1}
                    </span>
                    <span className="rname">
                      {c.name}
                      <small>
                        {c.out ? (
                          <i className="out-why">{c.why}</i>
                        ) : (
                          c.place + " · " + fmt(c.price) + " kr"
                        )}
                      </small>
                    </span>
                    <span className="bar">
                      <i
                        className={i === 0 && !c.out ? "lead" : ""}
                        style={{ width: (c.score / 10) * 100 + "%" }}
                      />
                    </span>
                    <span className="sc">
                      <Num v={c.score} />
                    </span>
                    <span className="chev">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </div>
                  {isOpen ? (
                    <div className="rbody">
                      <div>
                        <div className="pmh">Styrker</div>
                        <ul className="pm plus">
                          {c.plus.map((t, j) => (
                            <li key={j}>{t}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="pmh">Svakheter</div>
                        <ul className="pm minus">
                          {c.minus.map((t, j) => (
                            <li key={j}>{t}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="facts">
                        <span>Byggeår {c.built}</span>
                        <span>{c.area}</span>
                        <span>{c.land}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
        ) : null}

        {revealed ? (
        <section className="sec">
          <h2>Alle tall</h2>
          <p className="hint">
            Skala 0 til 10. Grønt tall bak punktet er vekten svarene dine ga det.
          </p>
          <table className="mx">
            <thead>
              <tr>
                <th />
                {CABINS.map((c) => (
                  <th key={c.id} className={winner && winner.id === c.id ? "lead" : ""}>
                    {c.name.split(" ")[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map(([k, label]) => (
                <tr key={k}>
                  <td>
                    {label}
                    {weights[k] > 1 ? <i className="w">×{weights[k].toFixed(1)}</i> : null}
                  </td>
                  {CABINS.map((c) => {
                    const v = c.m[k];
                    const bg =
                      v >= 7 ? "var(--skog-l)" : v <= 3 ? "var(--red-l)" : "transparent";
                    return (
                      <td key={c.id}>
                        <span className="cell" style={{ background: bg }}>
                          {v}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        ) : null}

        <div className="foot">
          <p>
            Poengene er mine vurderinger av opplysningene i salgsoppgavene, ikke
            objektive mål. Tilstandstallene bygger på tilstandsrapportenes
            tilstandsgrader, avløpstallene på hva kommunen og terrenget tillater.
          </p>
          <p>
            Svanfossvegen 311 er et tvangssalg. Avhendingsloven gjelder ikke, og
            prisen på finn er høyere enn i prospektet fra 3. august.
          </p>
          <p>
            Kausebøl 40 mangler oppgitte omkostninger i prospektet, så totalprisen
            er anslått. Jeg er ikke takstmann.
          </p>
        </div>
      </div>
    </div>
  );
}
