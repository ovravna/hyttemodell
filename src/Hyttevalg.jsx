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

const METRIC_KEYS = [
  "vei", "strom", "vann", "avlop", "tilstand", "papirer",
  "tomt", "drift", "vinter", "innflytting", "oslo",
];

/* Only what does not change with language. The words live in T. */
const CABINS = [
  { id: "k19", name: "Kausebøl 19", price: 513850, built: 1969,
    m: { vei: 10, strom: 9, vann: 6, avlop: 5, tilstand: 3, papirer: 2, tomt: 3, drift: 8, vinter: 5, innflytting: 6, oslo: 9 } },
  { id: "k40", name: "Kausebøl 40", price: 708900, built: 1977,
    m: { vei: 2, strom: 9, vann: 3, avlop: 2, tilstand: 4, papirer: 6, tomt: 3, drift: 6, vinter: 2, innflytting: 7, oslo: 9 } },
  { id: "bros", name: "Brøsholveien 229", price: 718850, built: 1960,
    m: { vei: 4, strom: 8, vann: 4, avlop: 3, tilstand: 4, papirer: 6, tomt: 9, drift: 8, vinter: 3, innflytting: 6, oslo: 8 } },
  { id: "vael", name: "Vælsveien 58", price: 411090, built: 1965,
    m: { vei: 2, strom: 1, vann: 1, avlop: 2, tilstand: 4, papirer: 4, tomt: 2, drift: 2, vinter: 1, innflytting: 4, oslo: 4 } },
  { id: "svan", name: "Svanfossvegen 311", price: 475000, built: 1946, rebuild: true,
    m: { vei: 0, strom: 8, vann: 0, avlop: 1, tilstand: 0, papirer: 3, tomt: 9, drift: 9, vinter: 0, innflytting: 0, oslo: 8 } },
];

/* Each question raises the weight of the metrics it touches. */
const QUESTIONS = [
  { id: "q1", hits: { vei: 3 } },
  { id: "q2", hits: { vinter: 3, strom: 1 } },
  { id: "q3", hits: { tomt: 3, drift: 1 } },
  { id: "q4", gate: "svan", hits: {} },
  { id: "q5", hits: { avlop: 3, vann: 1 } },
  { id: "q6", hits: { innflytting: 2, tilstand: 2 } },
  { id: "q7", damp: true, hits: {} },
  { id: "q8", hits: { drift: 3 } },
];

/* ---------------------------- copy -------------------------------- */

const T = {
  no: {
    lang: "Norsk",
    title: "Hvilken hytte?",
    lede: "Fem fritidseiendommer, vurdert på elleve punkter hentet fra salgsoppgavene. Svar på spørsmålene, så vektes punktene etter hva du bryr deg om.",
    back: "Tilbake til regnestykket for Kausebøl 19",
    qHead: "Hva er viktig for deg?",
    answeredNote: (a, n) => `${a} av ${n} besvart. Ubesvarte teller nøytralt.`,
    qNum: (i, n) => `Spørsmål ${i} av ${n}`,
    yes: "Ja",
    no: "Nei",
    budgetQ: "Hva er budsjettet?",
    budgetHead: "Maks totalpris",
    showResult: "Vis resultatet",
    doneNote:
      "Rangeringen under er vektet etter svarene dine. Gå gjerne tilbake og endre et svar, eller juster budsjettet.",
    prev: "Forrige",
    showAll: "Vis alle svarene",
    backToQ: "Tilbake til spørsmålene",
    reset: "Nullstill",
    pickHead: "Da peker det hit",
    pickNote: "Basert på svarene dine, ikke på hva jeg mener om hyttene.",
    bestMatch: "Best treff",
    fixFirst: "Må fikses først",
    aheadOf: (n, name) => `${n} poeng foran ${name}.`,
    rankHead: "Rangering",
    rankNote: "Trykk på en rad for styrker og svakheter.",
    strengths: "Styrker",
    weaknesses: "Svakheter",
    builtYear: "Byggeår",
    allNumbers: "Alle tall",
    scaleNote:
      "Skala 0 til 10. Grønt tall bak punktet er vekten svarene dine ga det.",
    overBudget: "Over budsjettet ditt",
    needsRebuild: "Krever at du river og bygger nytt",
    currency: "kr",
    metrics: {
      vei: "Bilvei helt frem", strom: "Strøm", vann: "Vann",
      avlop: "Mulighet for avløp", tilstand: "Bygningstilstand",
      papirer: "Papirer og lovlighet", tomt: "Tomt",
      drift: "Lave løpende kostnader", vinter: "Vinterbruk",
      innflytting: "Kan brukes nå", oslo: "Nærhet til Oslo",
    },
    questions: {
      q1: "Må du kunne kjøre helt frem til døra?",
      q2: "Skal hytta brukes om vinteren?",
      q3: "Vil du eie tomta selv?",
      q4: "Er du åpen for å rive og bygge nytt?",
      q5: "Må du ha vannklosett på sikt?",
      q6: "Vil du kunne bruke hytta med en gang?",
      q7: "Gjør dere mye av arbeidet selv?",
      q8: "Er lave løpende kostnader viktig?",
    },
    cabins: {
      k19: {
        place: "Spydeberg · 45 min fra Oslo", priceNote: "totalpris",
        area: "40 m²", land: "110 m² festet",
        asap: "Tak og takkonstruksjon med påvist råte, gitt strakstiltak. Deretter drenering.",
        plus: ["Den eneste med kjørevei helt frem og parkering ved hytta",
               "Innlagt vann og strøm, terrasse på 38 m²"],
        minus: ["Fem byggetiltak uten godkjenning, ingen ferdigattest",
                "Råte i bærende takkonstruksjon, anslag 130 til 350 000"],
      },
      k40: {
        place: "Spydeberg · 45 min fra Oslo", priceNote: "anslått totalpris",
        area: "45 m²", land: "110 m² festet",
        asap: "Beslag og tetting rundt pipa. Fuktskadene i bjelkelag og krypkjeller må undersøkes nærmere.",
        plus: ["Åtte år nyere, og kommunen sier manglende ferdigattest er uten praktisk betydning",
               "Terrasse vendt mot syd, arealene er 3D-skannet"],
        minus: ["Ingen bilvei. Skogssti siste stykket, og vann bæres 50 meter om vinteren",
                "Terreng av fjell som takstmannen sier ikke er økonomisk rasjonelt å drenere"],
      },
      bros: {
        place: "Båstad, Trøgstad · 55 min fra Oslo", priceNote: "totalpris",
        area: "37 m² + 51 m² bod", land: "682 m² eiet",
        asap: "Skorsteinen er deformert og ustabil med fare for sammenbrudd. Ikke fyr før den er utbedret.",
        plus: ["682 m² selveiertomt. Ingen festeavgift, ingen grunneier",
               "Utsikt over Øyeren, full kjeller og veranda på 31 m²"],
        minus: ["Sommervann fra kran i hytteveggen, snurredass i anneks",
                "Takkonstruksjon med nedbøyning og råte i vinduer"],
      },
      vael: {
        place: "Hensmoen, Ringerike · 1 t 15 fra Oslo", priceNote: "totalpris",
        area: "44 m²", land: "Festet",
        asap: "Pipe og ildsted, elektrisk anlegg og branntekniske forhold har alle fått TG3.",
        plus: ["Lavest pris av de fem",
               "Bygningen fremstår vedlikeholdt tross alderen"],
        minus: ["Ingen strøm. Festeavgiften er 9 520 i året, fire ganger de andre",
                "Parkering og brønnrett hviler på en muntlig avtale som ikke er tinglyst"],
      },
      svan: {
        place: "Nes · 50 min fra Oslo", priceNote: "finn i dag, prospektet sa 334 125",
        area: "Rives", land: "646 m² eiet",
        asap: "Riving. Bygningen er vurdert som teknisk og helsemessig uegnet for videre bruk.",
        plus: ["646 m² selveiertomt ned mot Vorma, uten festeavgift",
               "Strøm er allerede fremført til eiendommen"],
        minus: ["100 prosent fuktinnhold i treverket og 28 cm setning over seks meter",
                "Tvangssalg, så avhendingsloven gjelder ikke og du har nesten ingen rettigheter"],
      },
    },
    notes: [
      "Poengene er mine vurderinger av opplysningene i salgsoppgavene, ikke objektive mål. Tilstandstallene bygger på tilstandsrapportenes tilstandsgrader, avløpstallene på hva kommunen og terrenget tillater.",
      "Svanfossvegen 311 er et tvangssalg. Avhendingsloven gjelder ikke, og prisen på finn er høyere enn i prospektet fra 3. august.",
      "Kausebøl 40 mangler oppgitte omkostninger i prospektet, så totalprisen er anslått. Jeg er ikke takstmann.",
    ],
  },
  en: {
    lang: "English",
    title: "Which cabin?",
    lede: "Five holiday properties, judged on eleven points taken from the sales prospectuses. Answer the questions and the points are weighted by what you care about.",
    back: "Back to the figures for Kausebøl 19",
    qHead: "What matters to you?",
    answeredNote: (a, n) => `${a} of ${n} answered. Unanswered count as neutral.`,
    qNum: (i, n) => `Question ${i} of ${n}`,
    yes: "Yes",
    no: "No",
    budgetQ: "What is the budget?",
    budgetHead: "Maximum total price",
    showResult: "Show the result",
    doneNote:
      "The ranking below is weighted by your answers. Go back and change one, or move the budget.",
    prev: "Back",
    showAll: "Show every answer",
    backToQ: "Back to the questions",
    reset: "Reset",
    pickHead: "Then it points here",
    pickNote: "Based on your answers, not on what I think of the cabins.",
    bestMatch: "Best match",
    fixFirst: "Fix this first",
    aheadOf: (n, name) => `${n} points ahead of ${name}.`,
    rankHead: "Ranking",
    rankNote: "Tap a row for strengths and weaknesses.",
    strengths: "Strengths",
    weaknesses: "Weaknesses",
    builtYear: "Built",
    allNumbers: "Every number",
    scaleNote:
      "Scale 0 to 10. The green figure after a point is the weight your answers gave it.",
    overBudget: "Over your budget",
    needsRebuild: "Requires demolishing and building new",
    currency: "NOK",
    metrics: {
      vei: "Road to the door", strom: "Electricity", vann: "Water",
      avlop: "Wastewater possible", tilstand: "Building condition",
      papirer: "Paperwork and legality", tomt: "The plot",
      drift: "Low running costs", vinter: "Winter use",
      innflytting: "Usable now", oslo: "Closeness to Oslo",
    },
    questions: {
      q1: "Must you be able to drive right to the door?",
      q2: "Will the cabin be used in winter?",
      q3: "Do you want to own the plot yourself?",
      q4: "Are you open to demolishing and building new?",
      q5: "Do you need a flushing toilet eventually?",
      q6: "Do you want to use the cabin straight away?",
      q7: "Will you do much of the work yourselves?",
      q8: "Are low running costs important?",
    },
    cabins: {
      k19: {
        place: "Spydeberg · 45 min from Oslo", priceNote: "total price",
        area: "40 m²", land: "110 m² leasehold",
        asap: "Roof and roof structure with confirmed rot, flagged for immediate work. Drainage after that.",
        plus: ["The only one with a road to the door and parking at the cabin",
               "Plumbed water and electricity, a 38 m² deck"],
        minus: ["Five building works without approval, no completion certificate",
                "Rot in the load-bearing roof structure, estimated 130,000 to 350,000"],
      },
      k40: {
        place: "Spydeberg · 45 min from Oslo", priceNote: "estimated total price",
        area: "45 m²", land: "110 m² leasehold",
        asap: "Flashing and sealing around the chimney. The damp in the joists and crawl space needs a closer look.",
        plus: ["Eight years newer, and the municipality says the missing completion certificate has no practical effect",
               "South-facing deck, and the areas have been 3D scanned"],
        minus: ["No road. A forest path for the last stretch, and water carried 50 metres in winter",
                "Rock terrain that the surveyor says is not economically sensible to drain"],
      },
      bros: {
        place: "Båstad, Trøgstad · 55 min from Oslo", priceNote: "total price",
        area: "37 m² + 51 m² shed", land: "682 m² freehold",
        asap: "The chimney is deformed and unstable with a risk of collapse. Do not light it before it is repaired.",
        plus: ["682 m² freehold plot. No ground rent, no freeholder",
               "A view over Øyeren, a full cellar and a 31 m² veranda"],
        minus: ["Summer water from a tap in the cabin wall, a composting toilet in the annex",
                "A sagging roof structure and rot in the windows"],
      },
      vael: {
        place: "Hensmoen, Ringerike · 1 h 15 from Oslo", priceNote: "total price",
        area: "44 m²", land: "Leasehold",
        asap: "Chimney and fireplace, the electrical system and the fire safety measures have all been given TG3.",
        plus: ["The lowest price of the five",
               "The building looks maintained despite its age"],
        minus: ["No electricity. Ground rent is 9,520 a year, four times the others",
                "Parking and well rights rest on a verbal agreement that is not registered"],
      },
      svan: {
        place: "Nes · 50 min from Oslo", priceNote: "on finn today, the prospectus said 334,125",
        area: "To be demolished", land: "646 m² freehold",
        asap: "Demolition. The building has been judged technically and medically unfit for further use.",
        plus: ["646 m² freehold plot running down to the Vorma, with no ground rent",
               "Electricity has already been brought to the property"],
        minus: ["100 per cent moisture in the timber and 28 cm of settlement over six metres",
                "A forced sale, so the Alienation Act does not apply and you have almost no rights"],
      },
    },
    notes: [
      "The scores are my reading of what the sales prospectuses say, not objective measures. The condition figures follow the condition grades in the surveys, the wastewater figures follow what the municipality and the terrain allow.",
      "Svanfossvegen 311 is a forced sale. The Alienation Act does not apply, and the price on finn is higher than in the prospectus of 3 August.",
      "Kausebøl 40 gives no purchase costs in its prospectus, so the total price is an estimate. I am not a surveyor.",
    ],
  },
  it: {
    lang: "Italiano",
    title: "Quale baita?",
    lede: "Cinque immobili per vacanze, valutati su undici punti presi dai fascicoli di vendita. Rispondi alle domande e i punti vengono pesati secondo ciò che ti interessa.",
    back: "Torna ai conti per Kausebøl 19",
    qHead: "Cosa conta per te?",
    answeredNote: (a, n) => `${a} di ${n} risposte. Le domande senza risposta contano come neutre.`,
    qNum: (i, n) => `Domanda ${i} di ${n}`,
    yes: "Sì",
    no: "No",
    budgetQ: "Qual è il budget?",
    budgetHead: "Prezzo totale massimo",
    showResult: "Mostra il risultato",
    doneNote:
      "La classifica qui sotto è pesata secondo le tue risposte. Torna indietro e cambiane una, o sposta il budget.",
    prev: "Indietro",
    showAll: "Mostra tutte le risposte",
    backToQ: "Torna alle domande",
    reset: "Azzera",
    pickHead: "Allora punta qui",
    pickNote: "In base alle tue risposte, non a cosa penso io delle baite.",
    bestMatch: "Miglior corrispondenza",
    fixFirst: "Da sistemare per primo",
    aheadOf: (n, name) => `${n} punti davanti a ${name}.`,
    rankHead: "Classifica",
    rankNote: "Tocca una riga per punti di forza e debolezze.",
    strengths: "Punti di forza",
    weaknesses: "Debolezze",
    builtYear: "Anno",
    allNumbers: "Tutti i numeri",
    scaleNote:
      "Scala da 0 a 10. Il numero verde dopo un punto è il peso che le tue risposte gli hanno dato.",
    overBudget: "Oltre il tuo budget",
    needsRebuild: "Richiede di demolire e ricostruire",
    currency: "NOK",
    metrics: {
      vei: "Strada fino alla porta", strom: "Elettricità", vann: "Acqua",
      avlop: "Scarico possibile", tilstand: "Stato dell’edificio",
      papirer: "Documenti e conformità", tomt: "Il terreno",
      drift: "Costi correnti bassi", vinter: "Uso invernale",
      innflytting: "Utilizzabile subito", oslo: "Vicinanza a Oslo",
    },
    questions: {
      q1: "Devi poter arrivare in auto fino alla porta?",
      q2: "La baita sarà usata d’inverno?",
      q3: "Vuoi possedere il terreno?",
      q4: "Sei disposto a demolire e ricostruire?",
      q5: "Ti serve un WC con scarico in prospettiva?",
      q6: "Vuoi poter usare la baita subito?",
      q7: "Farete molto lavoro da soli?",
      q8: "Sono importanti costi correnti bassi?",
    },
    cabins: {
      k19: {
        place: "Spydeberg · 45 min da Oslo", priceNote: "prezzo totale",
        area: "40 m²", land: "110 m² in concessione",
        asap: "Tetto e struttura del tetto con marciume accertato, con intervento immediato. Poi il drenaggio.",
        plus: ["L’unica con strada fino alla porta e parcheggio alla baita",
               "Acqua e corrente allacciate, terrazza di 38 m²"],
        minus: ["Cinque interventi edilizi senza autorizzazione, nessun certificato di agibilità",
                "Marciume nella struttura portante del tetto, stima da 130.000 a 350.000"],
      },
      k40: {
        place: "Spydeberg · 45 min da Oslo", priceNote: "prezzo totale stimato",
        area: "45 m²", land: "110 m² in concessione",
        asap: "Scossaline e sigillatura attorno alla canna fumaria. I danni da umidità nei travetti e nel vespaio vanno approfonditi.",
        plus: ["Otto anni più recente, e il comune dice che il certificato mancante non ha effetti pratici",
               "Terrazza esposta a sud, superfici scansionate in 3D"],
        minus: ["Nessuna strada. Sentiero nel bosco nell’ultimo tratto, e d’inverno l’acqua si porta per 50 metri",
                "Terreno roccioso che il perito dice non sia economicamente sensato drenare"],
      },
      bros: {
        place: "Båstad, Trøgstad · 55 min da Oslo", priceNote: "prezzo totale",
        area: "37 m² + 51 m² ripostiglio", land: "682 m² di proprietà",
        asap: "La canna fumaria è deformata e instabile, con rischio di crollo. Non accendere prima della riparazione.",
        plus: ["Terreno di proprietà di 682 m². Nessun canone, nessun concedente",
               "Vista sull’Øyeren, cantina completa e veranda di 31 m²"],
        minus: ["Acqua estiva da un rubinetto nel muro, WC a secco nell’annesso",
                "Struttura del tetto inflessa e marciume nelle finestre"],
      },
      vael: {
        place: "Hensmoen, Ringerike · 1 h 15 da Oslo", priceNote: "prezzo totale",
        area: "44 m²", land: "In concessione",
        asap: "Canna fumaria e focolare, impianto elettrico e sicurezza antincendio hanno tutti ricevuto TG3.",
        plus: ["Il prezzo più basso dei cinque",
               "L’edificio appare curato nonostante l’età"],
        minus: ["Niente elettricità. Il canone è di 9.520 all’anno, quattro volte gli altri",
                "Parcheggio e diritto al pozzo poggiano su un accordo verbale non trascritto"],
      },
      svan: {
        place: "Nes · 50 min da Oslo", priceNote: "su finn oggi, il fascicolo diceva 334.125",
        area: "Da demolire", land: "646 m² di proprietà",
        asap: "Demolizione. L’edificio è giudicato inadatto all’uso sul piano tecnico e sanitario.",
        plus: ["Terreno di proprietà di 646 m² fino alla Vorma, senza canone",
               "La corrente è già portata fino alla proprietà"],
        minus: ["100 per cento di umidità nel legno e 28 cm di cedimento su sei metri",
                "Vendita forzata: la legge sulle compravendite non si applica e non hai quasi diritti"],
      },
    },
    notes: [
      "I punteggi sono la mia lettura di quanto dicono i fascicoli di vendita, non misure oggettive. I valori sullo stato seguono i gradi delle perizie, quelli sullo scarico ciò che il comune e il terreno consentono.",
      "Svanfossvegen 311 è una vendita forzata. La legge sulle compravendite non si applica, e il prezzo su finn è più alto di quello del fascicolo del 3 agosto.",
      "Kausebøl 40 non indica gli oneri nel fascicolo, quindi il prezzo totale è una stima. Non sono un perito.",
    ],
  },
};

const DEFAULT_LANG = "no";

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
  const [lang, setLang] = useState(DEFAULT_LANG);
  const t = T[lang];
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
    METRIC_KEYS.forEach((k) => (w[k] = 1));
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
      const raw = METRIC_KEYS.reduce((s, k) => s + weights[k] * c.m[k], 0) / wSum;
      const overBudget = c.price > budget * 1000;
      /* Boolean, not undefined: cabins without a rebuild flag used to get
         undefined here, and the sort below compares out with !==, so every
         pair looked different and the comparator always answered "a first". */
      const gated = c.rebuild === true && ans.q4 === "nei";
      return {
        ...c,
        score: raw,
        out: overBudget || gated,
        why: overBudget ? t.overBudget : gated ? t.needsRebuild : null,
      };
    }).sort((a, b) => {
      if (a.out !== b.out) return a.out ? 1 : -1;
      return b.score - a.score;
    });
  }, [weights, wSum, budget, ans, t]);

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
    return METRIC_KEYS.map((k) => ({ k, label: t.metrics[k], v: winner.m[k] * weights[k] }))
      .filter((x) => winner.m[x.k] >= 6 && weights[x.k] > 1)
      .sort((a, b) => b.v - a.v)
      .slice(0, 3);
  }, [winner, weights, t]);

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
  .tophead{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
  .langsel{display:inline-flex;align-items:center;gap:1px;flex-shrink:0;
    border:1px solid var(--line);background:var(--card);padding:5px 8px 5px 10px}
  .langsel select{appearance:none;-webkit-appearance:none;background:none;border:0;
    font:inherit;font-family:'Archivo Narrow',sans-serif;font-size:12.5px;
    color:var(--ink);cursor:pointer;padding:0 2px 0 0}
  .langsel option{color:#16221B;background:#fff}
  .langsel svg{pointer-events:none;flex-shrink:0;opacity:.55}
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
  /* Eleven rows by five cabins does not fit a phone. Scroll the matrix
     inside its own box: letting it size the page means the whole layout
     scrolls sideways into empty margin. */
  .mxwrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
  .mx{width:100%;min-width:500px;border-collapse:collapse;font-size:13px}
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
          <div className="tophead">
            <h1>{t.title}</h1>
            <div className="langsel">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Language"
              >
                {["no", "en", "it"].map((l) => (
                  <option key={l} value={l}>
                    {T[l].lang}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} />
            </div>
          </div>
          <p className="lede">{t.lede}</p>
          <p className="backlink">
            <a href={BASE}>{t.back}</a>
          </p>
        </div>
      </header>

      <div className="wrap">
        <section className="sec">
          <h2>{t.qHead}</h2>
          <p className="hint">{t.answeredNote(answered, QUESTIONS.length)}</p>

          {showAll ? (
            <>
              <div className="qs">
                {QUESTIONS.map((qq) => (
                  <div className="q" key={qq.id}>
                    <span className="qt">{t.questions[qq.id]}</span>
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
                  <b>{t.budgetHead}</b>
                  <span>{fmt(budget * 1000)} {t.currency}</span>
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
                  {t.backToQ}
                </button>
                <button
                  className="lnk"
                  onClick={() => {
                    setAns({});
                    setStep(0);
                  }}
                >
                  <RotateCcw size={13} />
                  {t.reset}
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
                  <div className="qnum">{t.qNum(step + 1, QUESTIONS.length)}</div>
                  <div className="qbig">{t.questions[q.id]}</div>
                  <div className={"yn" + (picked ? " locked" : "")}>
                    <button
                      className={picked === "ja" ? "picked" : ""}
                      onClick={(e) => { e.currentTarget.blur(); answer(q, "ja"); }}
                    >
                      <Check size={17} />
                      {t.yes}
                    </button>
                    <button
                      className={picked === "nei" ? "picked" : ""}
                      onClick={(e) => { e.currentTarget.blur(); answer(q, "nei"); }}
                    >
                      <X size={17} />
                      {t.no}
                    </button>
                  </div>
                </>
              ) : step === BUDGET_STEP ? (
                <>
                  <div className="qbig">{t.budgetQ}</div>
                  <label className="dial" style={{ margin: 0 }}>
                    <span className="dhead">
                      <b>{t.budgetHead}</b>
                      <span>{fmt(budget * 1000)} {t.currency}</span>
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
                      {t.showResult}
                    </button>
                  </div>
                </>
              ) : (
                <div className="qdone">{t.doneNote}</div>
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
                  {t.showAll}
                </button>
              </div>
            </div>
          )}

        </section>

        {revealed && winner ? (
          <section className="sec">
            <h2>{t.pickHead}</h2>
            <p className="hint">{t.pickNote}</p>
            <div className="win">
              <div className="win-grid">
                <img src={IMG[winner.id]} alt={winner.name} />
                <div className="win-body">
                  <div className="win-tag">{t.bestMatch}</div>
                  <h3>{winner.name}</h3>
                  <div className="win-place">{t.cabins[winner.id].place}</div>
                  <div className="win-price">
                    {fmt(winner.price)} {t.currency}{" "}
                    <em>{t.cabins[winner.id].priceNote}</em>
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
                    <b>{t.fixFirst}</b>
                    {t.cabins[winner.id].asap}
                  </p>
                </div>
              </div>
            </div>
            {runnerUp ? (
              <p className="gap">
                {t.aheadOf(
                  (winner.score - runnerUp.score).toFixed(1),
                  runnerUp.name
                )}
              </p>
            ) : null}
          </section>
        ) : null}

        {revealed ? (
        <section className="sec">
          <h2>{t.rankHead}</h2>
          <p className="hint">{t.rankNote}</p>
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
                          t.cabins[c.id].place +
                          " · " +
                          fmt(c.price) +
                          " " +
                          t.currency
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
                        <div className="pmh">{t.strengths}</div>
                        <ul className="pm plus">
                          {t.cabins[c.id].plus.map((x, j) => (
                            <li key={j}>{x}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="pmh">{t.weaknesses}</div>
                        <ul className="pm minus">
                          {t.cabins[c.id].minus.map((x, j) => (
                            <li key={j}>{x}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="facts">
                        <span>
                          {t.builtYear} {c.built}
                        </span>
                        <span>{t.cabins[c.id].area}</span>
                        <span>{t.cabins[c.id].land}</span>
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
          <h2>{t.allNumbers}</h2>
          <p className="hint">{t.scaleNote}</p>
          <div className="mxwrap">
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
              {METRIC_KEYS.map((k) => (
                <tr key={k}>
                  <td>
                    {t.metrics[k]}
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
          </div>
        </section>
        ) : null}

        <div className="foot">
          {t.notes.map((n, i) => (
            <p key={i}>{n}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
