import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Kausebøl 19, 1821 Spydeberg. Gnr. 418, bnr. 5, fnr. 10.          */
/*  Interactive purchase model. Trilingual: no / en / it.             */
/* ------------------------------------------------------------------ */

const SHOTS = ["sun", "anneks", "living", "deck", "bath"];

const BASE = import.meta.env.BASE_URL;

const IMG = {
  sun: BASE + "img/sun.webp",
  anneks: BASE + "img/anneks.webp",
  living: BASE + "img/living.webp",
  deck: BASE + "img/deck.webp",
  bath: BASE + "img/bath.webp",
  plan: BASE + "img/plan.webp",
};

/* Salgsoppgaven ligger i public/, så den serves fra Pages-siden selv. */
const PROSPECT = BASE + "salgsoppgave-kausebol-19.pdf";

const FINN_URL = "https://www.finn.no/476029048";

/* ---------------------------- copy -------------------------------- */

const T = {
  no: {
    lang: "Norsk",
    navOverview: "1 Kjøpet",
    navWorks: "2 Utbedringer",
    navRun: "3 Løpende",
    navVerdict: "4 Verdt det?",
    navPlan: "Plantegning",
    navBlockers: "Hindringer",
    navConcepts: "Begreper",
    planTitle: "Plantegning",
    planBody: [
      "Annekset ligger som en egen bygning nordøst, forbundet med hytta ved badveggen. Arealoppstillingen nevner det ikke: den oppgir 40 kvm internt bruksareal, 7 kvm prefabrikert bod og 2 kvm redskapsbod. Et soverom uten byggetillatelse er tyngre å lovliggjøre enn et skur, siden rom for varig opphold må tilfredsstille dagens krav til takhøyde, lysflate, ventilasjon og rømningsvei.",
      "Terrassen svinger rundt hele sørsiden og er oppgitt til 38 kvm. Verandaen er tegnet som eget rom mellom entré og terrasse.",
      "Badet ligger inn mot annekset. Dusjkabinett, servant og forbrenningstoalett på under fire kvadratmeter.",
      "Mål annekset på visningen. Badsturegnestykket i denne modellen hviler på et areal ingen har oppgitt.",
    ],
    fold: "Vis mindre",
    unfold: "Vis mer",
    story: {
      ch1kicker: "Kapittel 1",
      ch1title: "Vi kan kjøpe en hytte fra 1969",
      ch1body: [
        "Prisantydningen er 500 000 kroner. Med tinglysing og gebyrer er vi oppe i 513 850, før vi har gjort noe med hytta.",
        "Kjøpesummen er den delen vi vet. Resten av siden handler om det som kommer etterpå.",
      ],
      ch1more: "Hvorfor prisen er så lav",
      ch1egg: "nice",
      ch2kicker: "Kapittel 2",
      ch2title: "Noe må gjøres med taket",
      ch2body: [
        "Fire avvik har tilstandsgrad 3, som er den verste karakteren. Taket lekker allerede. Resten kan vente, men det venter ikke gratis.",
        "Hak av et tiltak og følg med på tallene øverst. Noen tiltak henter inn mer enn de koster. Andre gjør ikke det, og vi gjør dem uansett fordi vi vil ha det finere.",
      ],
      ch3kicker: "Kapittel 3",
      ch3title: "Og så tikker det penger ut hvert år",
      ch3body: [
        "Festeavgift, forsikring, ved, poser til forbrenningstoalettet. Hytta har energikarakter G, altså den dårligste som finnes, så det meste går til å varme opp skogen rundt.",
        "Dette er den posten folk glemmer når de regner på hytte.",
      ],
      ch3more: "Forutsetningene bak tallene",
      ch3ask: "Skal vi regne med det hytta koster å ha?",
      ch3askYes: "Ja, ta med løpende kostnader",
      pnTitle: "Hva koster ett døgn på hytta?",
      pnLead: (n, y) =>
        n + " døgn i året i " + y + " år, altså " + (n * y) + " døgn til sammen.",
      pnOneOff: "Kjøpet: omkostninger, og verdien opp eller ned",
      pnWorks: "Oppussing vi ikke får igjen i verdi",
      pnRecurring: "Drift og vedlikehold i eiertiden",
      pnSunk: "Sum, det hytta har kostet oss",
      pnPer: "per døgn",
      heatCut: (p) => "−" + p + " % etter tiltak",
      pnNote:
        "Kjøpesummen står i hytta og er fortsatt vår, så den er ikke med her.",
      pnProfit: "Her går vi i pluss, så døgnprisen er negativ. Det skjer sjelden.",
      ch4kicker: "Kapittel 4",
      ch4title: "Men så er det det andre regnestykket",
      ch4body: [
        "Bålpanne på verandaen en lørdag i september. Badstu, hvis vi bygger den, og det bør vi. Førti minutter fra Oslo og to kilometer til vannet. Dette er hele poenget.",
        "Regnestykket over går sjelden opp, for det finnes et tak for hva folk betaler her uansett hvor fint vi pusser opp. Men ingen kjøper hytte for avkastningen. Tallene sier hva moroa koster. Om den er verdt pengene, må vi bli enige om selv.",
      ],
      ch4more: "Hvordan verdianslagene er satt",
    },
    pageTitle: "Skal vi kjøpe hytte?",
    addr: "Kausebøl 19, 1821 Spydeberg",
    sub: "gnr. 418 · bnr. 5 · fnr. 10 · Indre Østfold (3118)",
    facts: [
      ["Byggeår", "1969"],
      ["Bruksareal", "40 m² BRA-i + 9 m² bod"],
      ["Tomt", "Festet, punktfeste, 110 m² registrert"],
      ["Festeavgift", "2 135 kr/år, neste regulering 2030"],
      ["Festetid", "19.03.1981 til 31.12.2061 (80 år)"],
      ["Grunneiendom", "208,1 dekar, 180 dekar produktiv skog"],
      ["Toalett", "Forbrenningstoalett, ingen godkjent avløp"],
      ["Prisantydning", "500 000 kr"],
      ["Omkostninger", "13 850 kr, tinglysing og gebyrer"],
    ],
    pitchTitle: "Hva dette faktisk er",
    pitch: [
      "Hytta er 40 kvadratmeter, bygget i 1969, og ligger innerst i en stikkvei i Kausebøl hyttefelt. Det er to kilometer til badeplassen ved Lyseren og førti minutter til Oslo. Kjørevei helt frem, parkering på nedsiden. Innvendig finner du dusj, varmtvannsbereder, vedovn og to soverom, med utgang til en veranda på 32 kvadratmeter.",
      "Prisantydningen på 500 000 kroner gjenspeiler tilstanden ganske presist. Fire avvik har fått tilstandsgrad 3. Fem byggetiltak er utført uten byggemelding. Vannanlegget er ulovlig fordi eiendommen mangler godkjent avløp. Alt dette står i salgsoppgaven, og det du har fått opplyst kan du ikke reklamere på i ettertid.",
      "Selve hytta er derfor sjelden det som avgjør. To kommunale vedtak styrer økonomien, og ingen av dem er dine: om eiendommen får koble seg på trykkavløpet ved Lyseren, og om byggetiltakene kan lovliggjøres. Avløpssvaret er verdt rundt en halv million i markedsverdi. Lovlighetssvaret avgjør om annekset kan bli stående.",
      "Tomta blir du sannsynligvis aldri eier av. Grunneiendommen er et skogsbruk på 208 dekar, og landbruksunntaket i tomtefesteloven lar grunneier avslå innløsning så lenge festeinntektene utgjør minst fem prosent av driftsresultatet. Med 180 dekar skog og et titalls hytter i feltet er vilkåret etter alt å dømme oppfylt.",
    ],
    verdictIn: "Dette betaler du",
    verdictInSub: "kjøp + tiltak + løpende kostnader",
    verdictOut: "Dette er den verdt",
    verdictOutSub: "markedsverdi etter tiltakene",
    verdictDelta: "Tapt eller tjent",
    verdictDeltaSub: "verdien minus det du betalte",
    ceiling: "Taket i dette området",
    ceilingSub: "ingen betaler mer enn dette her",
    cabins: "Hytter som blir med",
    cabinsNote: "Feltet har anslagsvis 12 til 18 hytter. Gravingen til hovedledningen deles på alle som kobler seg på. Gebyrene og pumpestasjonen per eiendom deles ikke.",
    cabinsAlone: "Du gjør det alene",
    splitFixed: "Fast del per eiendom",
    splitTrench: "Din andel av grøfta",
    splitPer: "Per hytte",
    splitNote: "Tallene her er før egeninnsats. Raden i tiltakslisten er den som gjelder.",
    usage: "Hvor mye bruker du hytta",
    usageNote: "Styrer strøm, ved, poser og filter til forbrenningstoalettet. Hytta har energikarakter G, så oppvarming er den store posten. Holder du den frostfri hele vinteren, havner du i øvre ende. Tak, vinduer og kledning trekker strøm- og vedforbruket ned.",
    usageBuckets: ["Noen helger", "Sommerhelger", "Jevnlig", "Mye", "Nesten hele året"],
    nightsUnit: "døgn i året",
    grpFixed: "Faste kostnader",
    grpUse: "Brukskostnader",
    grpMaint: "Vedlikehold",
    itPower: "Strøm",
    itToilet: "Forbrenningstoalett",
    itWood: "Ved",
    itPump: "Strøm til fellespumpa",
    itTravel: "Kjøring fra Oslo",
    travelOn: "Ta med kjøring",
    travelNote: "110 km tur og retur, 3 kr per km, snitt 2,5 døgn per tur. Av som standard, siden det er forbruk som ikke påvirker hva hytta er verdt.",
    runFoot: "Strøm er regnet med 1,50 kr per kWh inkludert nettleie og avgifter. Vedovnen kan ikke fyres med ved fra eiendommen: festekontraktens § 8 gir festeren ingen rett til ved på grunneiers mark. Fellespumpa er tatt med fordi trykktanken for ni hytter står under denne hytta, og pumpa får strøm herfra. Får du ikke det oppgjort med de åtte andre, betaler du den alene.",
    maint: "Løpende vedlikehold",
    maintNote: "Anslaget følger tiltakene du velger. Utbedrer du tak, kledning, vinduer, veranda og drenering, faller vedlikeholdet mot 8 000 i året. Lar du det stå, betaler du i stedet for lapping år etter år.",
    maintAuto: "følger tiltakene",
    maintReset: "Følg tiltakene igjen",
    maintBuckets: ["Ingen", "Lite", "Middels", "Mye", "Store"],
    growth: "Realvekst i hyttepriser",
    growthNote: "Prisvekst utover inflasjon, per år. Null er standard, fordi realvekst i praksis motvirker realrenten: stiger hyttepriser omtrent like fort som din alternativavkastning, kansellerer de to hverandre. Taket vokser også, siden det er satt av lokalmarkedet.",
    balCostShort: "Betaler",
    balValueShort: "Verdt",
    lgBuy: "Kjøp",
    lgWork: "Tiltak",
    lgRun: "Løpende",
    lgVal: "Verdi",
    lgLoss: "Tap",
    lgGain: "Gevinst",
    lgGap: "Differanse",
    runInclude: "Ta med løpende kostnader i totalen",
    runIncludeNote: "Av: «Dette betaler du» viser bare kjøp og tiltak, altså kapitalen du legger inn. På: drift og vedlikehold i eiertiden regnes med.",
    verdictInSubNoRun: "kjøp + tiltak, uten løpende kostnader",
    runExcluded: "holdes utenfor totalen",
    lgCeil: "Taket",
    bxHint: "Øverste stolpe er alt du betaler, delt i kjøp, tiltak og løpende kostnader. Nederste er hva hytta er verdt. Samme skala, så den lengste stolpen vinner. Den stripete enden viser tapet.",
    balTitle: "Hva du betaler, mot hva den er verdt",
    balCost: "Dette betaler du",
    balValue: "Dette er den verdt",
    balBuy: "Kjøp og omkostninger",
    balWork: "Tiltak",
    balRun: "Løpende kostnader",
    balLoss: "Tapt",
    balGain: "Tjent",
    balCeilShort: "Taket",
    balAsIsShort: "Som den står",
    gaugeTitle: "Hvor nær markedstaket er du?",
    gaugeAsIs: "Hytta som den står",
    gaugeHead: (n) => `Det er ${n} kr igjen opp til taket.`,
    gaugeFull:
      "Taket er nådd. Tiltak utover dette gir deg glede, men ingen verdiøkning.",
    ceilWhy: {
      none: "Taket ligger på 850 000 så lenge eiendommen mangler godkjent avløp.",
      grey: "Taket ligger på 1 000 000 med gråvannsanlegg. Kjøpere i dette segmentet vil ha vannklosett, og betaler mindre uten.",
      full: "Taket ligger på 1 550 000 med tilknytning til trykkavløpet.",
    },
    ceilWhyRedeem: " Eid tomt løfter taket ytterligere 200 000.",
    ceilingNote:
      "Taket finnes fordi kjøpere betaler for beliggenhet, tomtestørrelse og avløp, ikke for hvor mye du har brukt.",
    dials: "Forutsetninger",
    price: "Kjøpesum",
    fees: "Omkostninger",
    level: "Kostnadsnivå",
    levelLo: "Lavt anslag",
    levelMid: "Midt i spennet",
    levelHi: "Høyt anslag",
    levelNote:
      "Tilstandsrapporten oppgir hver post som et spenn, for eksempel 130 000 til 350 000 på taket. Denne skruen bestemmer hvor i spennet du regner. Helt til venstre bruker alle nedre anslag, helt til høyre alle øvre. Den flytter både kostnad og verdi.",
    priceNote: "Prisantydningen er 500 000. Skyv oppover for å teste et budscenario.",
    yearsNote:
      "Punktet fram i tid vi sammenlikner verdien med. Ikke et salgstidspunkt — det bestemmer bare hvor mange år løpende kostnader som regnes inn.",
    prev: "Forrige bilde",
    next: "Neste bilde",
    diy: "Egeninnsats",
    diyNote: "Andel av arbeidskostnaden du gjør selv. Materialer og gebyrer påvirkes ikke.",
    years: "Tidshorisont",
    yearsUnit: "år",
    rate: "Realrente",
    rateNote: "Brukt til å neddiskontere løpende kostnader",
    measures: "Tiltak",
    mCost: "Kostnad",
    mValue: "Verdiøkning",
    mNet: "Netto",
    mNetNote: "Netto er forskjellen. Grønn stolpe lengre enn rød betyr at tiltaket betaler seg.",
    blockers: "hindringer",
    blockersTitle: "Hindringer og oppgaver",
    glossTitle: "Begreper du må kjenne",
    mapLink: "Se stedet i kart",
    finnLink: "Annonsen på FINN",
    finnMeta: "Prisantydning 500 000 kr",
    farmLink: "Gårdskart for grunneiendommen",
    farmMeta: "208,1 dekar · 180 dekar skog · 0 dekar jordbruk",
    prospectLink: "Last ned salgsoppgaven",
    prospectMeta: "PDF · 9,5 MB",
    running: "Løpende kostnader",
    runningItems: [
      ["Festeavgift", 2135],
      ["Kommunale avgifter", 4037],
      ["Velavgift", 2800],
      ["Andel felles vann", 1000],
    ],
    runningTotal: "Sum per år",
    perYearUnit: "kroner per år",
    perYearShort: "kr/år",
    runningPv: "Nåverdi over eiertiden",
    tgLabel: { tg3: "TG3", tg2: "TG2", legal: "Ulovlig", opt: "Valgfritt" },
    open: "Åpne spørsmål",
    todo: "Må gjøres",
    dep: "Avhenger av",
    exclusive: "Velg én",
    none: "Ingen",
    notes: "Merknader",
    notesBody: [
      "Tallene er overslag hentet fra salgsoppgaven, tilstandsrapporten av 01.09.2026, festekontrakten av 19.03.1981 og gårdskart for gnr. 418 bnr. 5. Dette er ingen verdivurdering.",
      "Verdianslagene er kalibrert mot aktive annonser i Spydeberg og ved Lyseren. Det betyr prisantydninger, ikke oppnådde priser.",
      "Innløsning av tomta er modellert som mulig. Den er sannsynligvis sperret av landbruksunntaket i tomtefesteloven § 34 tredje ledd.",
    ],
    photoCaps: [
      "Hytta fra sørvest. Til høyre annekset med torvtak, merket 10, og bak det bodene.",
      "Annekset har franske dører og køyeseng. Det står ikke i arealoppstillingen, og er oppført uten byggemelding.",
      "Stue og kjøkken. Vedovnen er hovedvarmekilden, og lysbåndet øverst slipper dagslys inn under mønet.",
      "Terrassen er oppgitt til 38 kvm. Bordene er værbitt, og takstmannen har satt TG3 for fukt, råte og nedbøyning.",
      "Toalettrommet. Bak servanten står en pumpe, på veggen et vannfilter. Ingen kjent membran eller sluk.",
    ],
  },
  en: {
    lang: "English",
    navOverview: "1 The purchase",
    navWorks: "2 Repairs",
    navRun: "3 Running costs",
    navVerdict: "4 Worth it?",
    navPlan: "Floor plan",
    navBlockers: "Blockers",
    navConcepts: "Concepts",
    planTitle: "Floor plan",
    planBody: [
      "The annex sits as a separate building to the north-east, joined to the cabin at the bathroom wall. The area schedule leaves it out: it lists 40 m² of internal floor area, a 7 m² prefabricated shed and a 2 m² tool shed. A bedroom without a building permit is harder to legalise than a shed, since rooms for lasting occupancy must meet today's requirements for ceiling height, glazing, ventilation and escape route.",
      "The deck wraps the whole south side and is stated at 38 m². The veranda is drawn as its own room between the entrance hall and the deck.",
      "The bathroom sits against the annex. Shower cubicle, basin and incinerating toilet in under four square metres.",
      "Measure the annex at the viewing. The sauna calculation in this model rests on an area nobody has stated.",
    ],
    fold: "Show less",
    unfold: "Show more",
    story: {
      ch1kicker: "Chapter 1",
      ch1title: "We could buy a cabin from 1969",
      ch1body: [
        "The asking price is NOK 500,000. With registration and fees we are at 513,850, before doing anything to the cabin.",
        "The purchase is the part we know. The rest of this page is about what comes after.",
      ],
      ch1more: "Why the price is this low",
      ch1egg: "nice",
      ch2kicker: "Chapter 2",
      ch2title: "Something has to be done about the roof",
      ch2body: [
        "Four defects are graded condition 3, which is the worst grade there is. The roof already leaks. The rest can wait, but waiting is not free.",
        "Tick a work item and watch the figures at the top. Some earn back more than they cost. Others do not, and we do them anyway because we want the place to be nicer.",
      ],
      ch3kicker: "Chapter 3",
      ch3title: "And money leaks out every year",
      ch3body: [
        "Ground rent, insurance, firewood, bags for the incinerating toilet. The cabin is energy rated G, the worst there is, so most of it goes into heating the forest around it.",
        "This is the line people forget when they do the maths on a cabin.",
      ],
      ch3more: "The assumptions behind the figures",
      ch3ask: "Shall we count what the cabin costs to keep?",
      ch3askYes: "Yes, include running costs",
      pnTitle: "What does one night at the cabin cost?",
      pnLead: (n, y) =>
        n + " nights a year for " + y + " years, so " + (n * y) + " nights in all.",
      pnOneOff: "The purchase: fees, and the value up or down",
      pnWorks: "Works we do not get back in value",
      pnRecurring: "Running and upkeep over the period",
      pnSunk: "Total, what the cabin has cost us",
      pnPer: "per night",
      heatCut: (p) => "−" + p + " % after works",
      pnNote:
        "The purchase money sits in the cabin and is still ours, so it is not counted here.",
      pnProfit: "We come out ahead here, so the nightly cost is negative. That is rare.",
      ch4kicker: "Chapter 4",
      ch4title: "But then there is the other sum",
      ch4body: [
        "A fire pit on the deck on a Saturday in September. A sauna, if we build one, and we should. Forty minutes from Oslo and two kilometres to the water. This is the whole point.",
        "The sum above rarely works out, because there is a ceiling on what people pay here however nicely we do it up. But nobody buys a cabin for the return. The figures say what the fun costs. Whether it is worth the money is ours to settle.",
      ],
      ch4more: "How the value estimates are set",
    },
    pageTitle: "Should we buy the cabin?",
    addr: "Kausebøl 19, 1821 Spydeberg, Norway",
    sub: "Cadastral 418/5/10 · Indre Østfold municipality (3118)",
    facts: [
      ["Built", "1969"],
      ["Floor area", "40 m² internal + 9 m² shed"],
      ["Land", "Leasehold, point-lease, 110 m² registered"],
      ["Ground rent", "NOK 2,135/yr, next revision 2030"],
      ["Lease term", "19 Mar 1981 to 31 Dec 2061 (80 years)"],
      ["Freeholder's estate", "208.1 ha-units, 180 productive forest"],
      ["Toilet", "Incinerating, no approved wastewater system"],
      ["Asking price", "NOK 500,000"],
      ["Transaction costs", "NOK 13,850, registration and fees"],
    ],
    pitchTitle: "What this actually is",
    pitch: [
      "The cabin is 40 square metres, built in 1969, at the end of a spur road in the Kausebøl cabin field. It is two kilometres to the swimming spot at lake Lyseren and forty minutes to Oslo. Road access to the door, parking just below. Inside there is a shower, a hot water tank, a wood stove and two bedrooms, with a door onto a 32 square metre deck.",
      "The asking price of NOK 500,000 reflects the condition fairly closely. Four defects carry the top severity grade. Five building works were carried out without permission. The water installation is illegal because the property has no approved wastewater system. All of it is disclosed in the sales prospectus, and you cannot claim later for what you were told.",
      "The cabin itself is rarely what settles this. Two municipal rulings govern the economics, and neither is yours to make: whether the property may connect to the pressurised sewer at Lyseren, and whether the unpermitted works can be legalised. The wastewater answer is worth roughly half a million in market value. The legality answer decides whether the annex can stay.",
      "You will most likely never own the land. The freeholder's holding is 208 hectares of forestry, and the agricultural exemption in the Ground Lease Act lets an owner refuse redemption while lease income makes up at least five per cent of operating profit. With 180 hectares of forest and a dozen or so cabins in the field, that condition looks met.",
    ],
    verdictIn: "What you pay",
    verdictInSub: "purchase + works + recurring costs",
    verdictOut: "What it is worth",
    verdictOutSub: "market value once the works are done",
    verdictDelta: "Lost or gained",
    verdictDeltaSub: "the value minus what you paid",
    ceiling: "The ceiling around here",
    ceilingSub: "nobody pays more than this locally",
    cabins: "Cabins joining in",
    cabinsNote: "The field has an estimated 12 to 18 cabins. The trench to the main is shared by everyone who connects. The per-property fees and pumping station are not.",
    cabinsAlone: "You do it alone",
    splitFixed: "Fixed part per property",
    splitTrench: "Your share of the trench",
    splitPer: "Per cabin",
    splitNote: "These figures are before own labour. The row in the works list is the one that counts.",
    usage: "How much you use it",
    usageNote: "Drives electricity, firewood, and bags and filters for the incinerating toilet. The cabin is energy rated G, so heating is the big item. Keep it above freezing all winter and you land at the top of the range. Roof, windows and cladding bring the power and firewood down.",
    usageBuckets: ["A few weekends", "Summer weekends", "Regularly", "A lot", "Almost year-round"],
    nightsUnit: "nights a year",
    grpFixed: "Fixed costs",
    grpUse: "Usage costs",
    grpMaint: "Maintenance",
    itPower: "Electricity",
    itToilet: "Incinerating toilet",
    itWood: "Firewood",
    itPump: "Power for the shared pump",
    itTravel: "Driving from Oslo",
    travelOn: "Include driving",
    travelNote: "110 km round trip, NOK 3 per km, averaging 2.5 nights per trip. Off by default, since it is consumption that does not affect what the cabin is worth.",
    runFoot: "Electricity is costed at NOK 1.50 per kWh including grid charges and levies. The wood stove cannot be fed from the estate: clause 8 of the lease grants the leaseholder no right to firewood on the owner's land. The shared pump is included because the pressure tank for nine cabins sits under this cabin and the pump draws power from here. Fail to settle that with the other eight and you pay it alone.",
    maint: "Ongoing maintenance",
    maintNote: "The estimate follows the works you select. Fix the roof, cladding, windows, deck and drainage and maintenance falls towards 8,000 a year. Leave them and you pay for patching instead, year after year.",
    maintAuto: "follows the works",
    maintReset: "Follow the works again",
    maintBuckets: ["None", "Light", "Moderate", "Heavy", "Severe"],
    growth: "Real growth in cabin prices",
    growthNote: "Price growth above inflation, per year. Zero is the default, because real growth in practice offsets the real discount rate: if cabin prices rise about as fast as your alternative return, the two cancel out. The ceiling grows too, since it is set by the local market.",
    balCostShort: "Pay",
    balValueShort: "Worth",
    lgBuy: "Purchase",
    lgWork: "Works",
    lgRun: "Running",
    lgVal: "Value",
    lgLoss: "Loss",
    lgGain: "Gain",
    lgGap: "Difference",
    runInclude: "Include running costs in the total",
    runIncludeNote: "Off: \u201cWhat you pay\u201d shows only purchase and works, the capital you put in. On: operation and maintenance over the holding period are counted.",
    verdictInSubNoRun: "purchase + works, running costs excluded",
    runExcluded: "kept out of the total",
    lgCeil: "Ceiling",
    bxHint: "The top bar is everything you pay, split into purchase, works and running costs. The bottom bar is what the cabin is worth. Same scale, so the longer bar wins. The striped tail is the loss.",
    balTitle: "What you pay, against what it is worth",
    balCost: "What you pay",
    balValue: "What it is worth",
    balBuy: "Purchase and fees",
    balWork: "Works",
    balRun: "Recurring costs",
    balLoss: "Lost",
    balGain: "Gained",
    balCeilShort: "Ceiling",
    balAsIsShort: "As it stands",
    gaugeTitle: "How close to the market ceiling are you?",
    gaugeAsIs: "The cabin as it stands",
    gaugeHead: (n) => `There is ${n} kr of headroom left.`,
    gaugeFull:
      "The ceiling is reached. Work beyond this buys you enjoyment, but no added value.",
    ceilWhy: {
      none: "The ceiling sits at 850,000 while the property has no approved wastewater system.",
      grey: "The ceiling sits at 1,000,000 with a greywater system. Buyers in this segment want a flushing toilet, and pay less without one.",
      full: "The ceiling sits at 1,550,000 with a connection to the pressurised sewer.",
    },
    ceilWhyRedeem: " Owning the land lifts the ceiling a further 200,000.",
    ceilingNote:
      "The ceiling exists because buyers pay for location, plot size and wastewater, not for how much you spent.",
    dials: "Assumptions",
    price: "Purchase price",
    fees: "Transaction costs",
    level: "Cost level",
    levelLo: "Low estimate",
    levelMid: "Mid range",
    levelHi: "High estimate",
    levelNote:
      "The condition report gives every item as a range, for example 130,000 to 350,000 for the roof. This dial sets where in the range you budget. Far left uses every low estimate, far right every high one. It moves both cost and value.",
    priceNote: "The asking price is 500,000. Slide up to test a bidding scenario.",
    yearsNote:
      "The point in time we compare the value at. Not a date to sell — it only sets how many years of recurring costs are counted in.",
    prev: "Previous photo",
    next: "Next photo",
    diy: "Own labour",
    diyNote: "Share of the labour cost you do yourself. Materials and fees are unaffected.",
    years: "Time horizon",
    yearsUnit: "years",
    rate: "Real discount rate",
    rateNote: "Used to discount recurring costs",
    measures: "Works",
    mCost: "Cost",
    mValue: "Value added",
    mNet: "Net",
    mNetNote: "Net is the difference. A green bar longer than the red one means the work pays for itself.",
    blockers: "blockers",
    blockersTitle: "Blockers and open tasks",
    glossTitle: "Concepts you need to know",
    mapLink: "See the location on a map",
    finnLink: "The listing on FINN",
    finnMeta: "Asking price NOK 500,000",
    farmLink: "Cadastral farm map of the freeholder\u2019s estate",
    farmMeta: "208.1 units · 180 forest · 0 agricultural",
    prospectLink: "Download the sales prospectus",
    prospectMeta: "PDF · 9.5 MB",
    running: "Recurring costs",
    runningItems: [
      ["Ground rent", 2135],
      ["Municipal charges", 4037],
      ["Cabin field association", 2800],
      ["Share of shared water", 1000],
    ],
    runningTotal: "Total per year",
    perYearUnit: "NOK per year",
    perYearShort: "kr/yr",
    runningPv: "Present value over holding period",
    tgLabel: {
      tg3: "Severe (TG3)",
      tg2: "Moderate (TG2)",
      legal: "Unpermitted",
      opt: "Optional",
    },
    open: "Open questions",
    todo: "Required steps",
    dep: "Depends on",
    exclusive: "Pick one",
    none: "None",
    notes: "Notes",
    notesBody: [
      "The figures are estimates drawn from the sales prospectus, the condition report of 1 Sep 2026, the ground lease of 19 Mar 1981 and the cadastral farm map for 418/5. This is not a valuation.",
      "Value estimates are calibrated against active listings in Spydeberg and around Lyseren. That means asking prices, not achieved prices.",
      "Land redemption is modelled as available. It is probably barred by the agricultural exemption in section 34(3) of the Ground Lease Act.",
    ],
    photoCaps: [
      "The cabin from the south-west. On the right the turf-roofed annex marked 10, with the sheds behind it.",
      "The annex has french doors and a bunk bed. It is absent from the area schedule, and was built without permission.",
      "Living room and kitchen. The wood stove is the main heat source, and the clerestory band lets daylight in under the ridge.",
      "The deck is stated at 38 m². The boards are weathered, and the surveyor graded it severe for damp, rot and sagging.",
      "The toilet room. A pump sits behind the basin and a water filter on the wall. No known membrane or floor drain.",
    ],
  },
  it: {
    lang: "Italiano",
    navOverview: "1 L'acquisto",
    navWorks: "2 Interventi",
    navRun: "3 Costi ricorrenti",
    navVerdict: "4 Ne vale la pena?",
    navPlan: "Planimetria",
    navBlockers: "Ostacoli",
    navConcepts: "Concetti",
    planTitle: "Planimetria",
    planBody: [
      "L'annesso è un edificio separato a nord-est, collegato alla baita sulla parete del bagno. Il prospetto delle superfici lo omette: indica 40 m² interni, un deposito prefabbricato di 7 m² e un ripostiglio di 2 m². Una camera senza permesso di costruire è più difficile da sanare di un deposito, perché i locali per permanenza continuativa devono rispettare i requisiti attuali di altezza, superficie vetrata, ventilazione e via di fuga.",
      "La terrazza avvolge tutto il lato sud e è indicata a 38 m². La veranda è disegnata come locale a sé tra ingresso e terrazza.",
      "Il bagno si appoggia all'annesso. Box doccia, lavabo e WC a incenerimento in meno di quattro metri quadrati.",
      "Misura l'annesso alla visita. Il calcolo della sauna in questo modello poggia su una superficie che nessuno ha dichiarato.",
    ],
    fold: "Mostra meno",
    unfold: "Mostra più",
    story: {
      ch1kicker: "Capitolo 1",
      ch1title: "Potremmo comprare una baita del 1969",
      ch1body: [
        "Il prezzo richiesto è 500.000 NOK. Con registrazione e diritti siamo a 513.850, prima di aver fatto qualsiasi cosa alla baita.",
        "L'acquisto è la parte che conosciamo. Il resto della pagina riguarda ciò che viene dopo.",
      ],
      ch1more: "Perché il prezzo è così basso",
      ch1egg: "nice",
      ch2kicker: "Capitolo 2",
      ch2title: "Il tetto va rifatto",
      ch2body: [
        "Quattro difetti hanno grado 3, il voto peggiore che esista. Il tetto perde già adesso. Il resto può aspettare, ma aspettare non è gratis.",
        "Seleziona un intervento e guarda i numeri in alto. Alcuni recuperano più di quanto costino. Altri no, e li facciamo lo stesso perché vogliamo stare meglio.",
      ],
      ch3kicker: "Capitolo 3",
      ch3title: "E ogni anno escono soldi",
      ch3body: [
        "Canone, assicurazione, legna, sacchetti per il WC a incenerimento. La baita ha classe energetica G, la peggiore che c'è, quindi gran parte se ne va a scaldare il bosco intorno.",
        "È la voce che tutti dimenticano quando fanno i conti su una baita.",
      ],
      ch3more: "Le ipotesi dietro i numeri",
      ch3ask: "Contiamo quanto costa tenerla?",
      ch3askYes: "Sì, includi i costi ricorrenti",
      pnTitle: "Quanto costa una notte in baita?",
      pnLead: (n, y) =>
        n + " notti all'anno per " + y + " anni, quindi " + (n * y) + " notti in tutto.",
      pnOneOff: "L'acquisto: spese, e il valore su o giù",
      pnWorks: "Lavori che non tornano in valore",
      pnRecurring: "Gestione e manutenzione nel periodo",
      pnSunk: "Totale, quanto ci è costata la baita",
      pnPer: "a notte",
      heatCut: (p) => "−" + p + " % dopo i lavori",
      pnNote:
        "I soldi dell'acquisto stanno nella baita e restano nostri, quindi non sono conteggiati qui.",
      pnProfit: "Qui siamo in attivo, quindi il costo a notte è negativo. Succede di rado.",
      ch4kicker: "Capitolo 4",
      ch4title: "Ma poi c'è l'altro conto",
      ch4body: [
        "Un braciere sulla veranda un sabato di settembre. Una sauna, se la costruiamo, e dovremmo. Quaranta minuti da Oslo e due chilometri dall'acqua. Il punto è tutto qui.",
        "Il conto qui sopra raramente torna, perché c'è un limite a quanto la gente paga da queste parti per quanto bene la sistemiamo. Ma nessuno compra una baita per il rendimento. I numeri dicono quanto costa il divertimento. Se valga i soldi, dobbiamo deciderlo noi.",
      ],
      ch4more: "Come sono stati fissati i valori",
    },
    pageTitle: "Compriamo la baita?",
    addr: "Kausebøl 19, 1821 Spydeberg, Norvegia",
    sub: "Catasto 418/5/10 · Comune di Indre Østfold (3118)",
    facts: [
      ["Anno di costruzione", "1969"],
      ["Superficie", "40 m² interni + 9 m² deposito"],
      ["Terreno", "In concessione, punto-concessione, 110 m²"],
      ["Canone", "2.135 NOK/anno, prossima revisione 2030"],
      ["Durata", "dal 19.03.1981 al 31.12.2061 (80 anni)"],
      ["Fondo del concedente", "208,1 ettari, 180 di bosco produttivo"],
      ["Servizi igienici", "WC a incenerimento, nessuno scarico autorizzato"],
      ["Prezzo richiesto", "500.000 NOK"],
      ["Spese accessorie", "13.850 NOK, registrazione e diritti"],
    ],
    pitchTitle: "Di cosa si tratta davvero",
    pitch: [
      "La baita è di 40 metri quadrati, costruita nel 1969, in fondo a una strada privata nel comprensorio di Kausebøl. Sono due chilometri dalla spiaggia del lago Lyseren e quaranta minuti da Oslo. Strada fino alla porta, parcheggio appena sotto. Dentro ci sono doccia, boiler, stufa a legna e due camere, con uscita su una terrazza di 32 metri quadrati.",
      "Il prezzo richiesto di 500.000 corone rispecchia lo stato con buona precisione. Quattro difetti hanno il grado di condizione più grave. Cinque interventi edilizi sono stati eseguiti senza permesso. L'impianto idrico è illegale perché l'immobile non ha uno scarico autorizzato. Tutto è dichiarato nel fascicolo di vendita, e su ciò che ti è stato comunicato non potrai contestare nulla.",
      "La baita in sé raramente è ciò che decide. Contano due provvedimenti comunali, e nessuno dei due dipende da te: se l'immobile potrà allacciarsi alla fognatura in pressione del Lyseren, e se gli interventi abusivi potranno essere sanati. La risposta sugli scarichi vale circa mezzo milione di valore di mercato. Quella sulla sanatoria decide se l'annesso può restare.",
      "Il terreno molto probabilmente non sarà mai tuo. Il fondo del concedente è un'azienda forestale di 208 ettari, e l'eccezione agricola della legge sulle concessioni permette al proprietario di rifiutare il riscatto finché i canoni costituiscono almeno il cinque per cento del risultato operativo. Con 180 ettari di bosco e una dozzina di baite, la condizione sembra soddisfatta.",
    ],
    verdictIn: "Quanto paghi",
    verdictInSub: "acquisto + interventi + costi ricorrenti",
    verdictOut: "Quanto vale",
    verdictOutSub: "valore di mercato dopo gli interventi",
    verdictDelta: "Perso o guadagnato",
    verdictDeltaSub: "il valore meno quanto hai pagato",
    ceiling: "Il tetto in questa zona",
    ceilingSub: "qui nessuno paga più di così",
    cabins: "Baite che partecipano",
    cabinsNote: "Il comprensorio ha da 12 a 18 baite stimate. Lo scavo fino alla condotta è diviso tra tutti quelli che si allacciano. Gli oneri per immobile e la pompa no.",
    cabinsAlone: "Lo fai da solo",
    splitFixed: "Parte fissa per immobile",
    splitTrench: "La tua quota di scavo",
    splitPer: "Per baita",
    splitNote: "Cifre al lordo del lavoro proprio. Fa fede la riga nell'elenco interventi.",
    usage: "Quanto la usi",
    usageNote: "Determina elettricità, legna, sacchi e filtri del WC a incenerimento. La baita è in classe G, quindi il riscaldamento è la voce principale. Tenerla sopra zero tutto l\u2019inverno ti porta al massimo. Tetto, finestre e rivestimento abbassano elettricità e legna.",
    usageBuckets: ["Qualche weekend", "Weekend estivi", "Regolarmente", "Molto", "Quasi tutto l\u2019anno"],
    nightsUnit: "notti all\u2019anno",
    grpFixed: "Costi fissi",
    grpUse: "Costi d\u2019uso",
    grpMaint: "Manutenzione",
    itPower: "Elettricità",
    itToilet: "WC a incenerimento",
    itWood: "Legna",
    itPump: "Corrente per la pompa comune",
    itTravel: "Viaggio da Oslo",
    travelOn: "Includi il viaggio",
    travelNote: "110 km andata e ritorno, 3 NOK/km, in media 2,5 notti per viaggio. Disattivato di default, perché è consumo che non incide sul valore.",
    runFoot: "L\u2019elettricità è calcolata a 1,50 NOK per kWh inclusi oneri di rete e imposte. La stufa non può essere alimentata con legna del fondo: l\u2019art. 8 del contratto non dà al concessionario alcun diritto alla legna. La pompa comune è inclusa perché il serbatoio in pressione per nove baite si trova sotto questa baita e la pompa prende corrente da qui. Se non ti accordi con gli altri otto, la paghi da solo.",
    maint: "Manutenzione ricorrente",
    maintNote: "La stima segue gli interventi che selezioni. Sistema tetto, rivestimento, finestre, terrazza e drenaggio e la manutenzione scende verso 8.000 l\u2019anno. Se li lasci, paghi rattoppi anno dopo anno.",
    maintAuto: "segue gli interventi",
    maintReset: "Torna a seguire gli interventi",
    maintBuckets: ["Nessuna", "Leggera", "Media", "Alta", "Elevata"],
    growth: "Crescita reale dei prezzi",
    growthNote: "Crescita dei prezzi oltre l\u2019inflazione, all\u2019anno. Zero è il valore di default, perché la crescita reale compensa il tasso reale: se i prezzi delle baite salgono come il tuo rendimento alternativo, i due si annullano. Anche il tetto cresce, perché lo fissa il mercato locale.",
    balCostShort: "Paghi",
    balValueShort: "Vale",
    lgBuy: "Acquisto",
    lgWork: "Interventi",
    lgRun: "Ricorrenti",
    lgVal: "Valore",
    lgLoss: "Perdita",
    lgGain: "Guadagno",
    lgGap: "Differenza",
    runInclude: "Includi i costi ricorrenti nel totale",
    runIncludeNote: "Off: \u00abQuanto paghi\u00bb mostra solo acquisto e interventi, il capitale che immetti. On: gestione e manutenzione del periodo sono conteggiate.",
    verdictInSubNoRun: "acquisto + interventi, esclusi i ricorrenti",
    runExcluded: "esclusi dal totale",
    lgCeil: "Tetto",
    bxHint: "La barra superiore è tutto ciò che paghi, divisa in acquisto, interventi e costi ricorrenti. Quella inferiore è quanto vale la baita. Stessa scala: vince la barra più lunga. La coda a righe è la perdita.",
    balTitle: "Quanto paghi, rispetto a quanto vale",
    balCost: "Quanto paghi",
    balValue: "Quanto vale",
    balBuy: "Acquisto e spese",
    balWork: "Interventi",
    balRun: "Costi ricorrenti",
    balLoss: "Perso",
    balGain: "Guadagnato",
    balCeilShort: "Tetto",
    balAsIsShort: "Com\u2019è",
    gaugeTitle: "Quanto sei vicino al tetto di mercato?",
    gaugeAsIs: "La baita così com\u2019è",
    gaugeHead: (n) => `Restano ${n} kr fino al tetto.`,
    gaugeFull:
      "Il tetto è raggiunto. Gli interventi oltre questo punto danno piacere, non valore.",
    ceilWhy: {
      none: "Il tetto è a 850.000 finché l\u2019immobile non ha uno scarico autorizzato.",
      grey: "Il tetto è a 1.000.000 con un impianto per acque grigie. Gli acquirenti di questo segmento vogliono il WC, e senza pagano meno.",
      full: "Il tetto è a 1.550.000 con l\u2019allaccio alla fognatura in pressione.",
    },
    ceilWhyRedeem: " Possedere il terreno alza il tetto di altri 200.000.",
    ceilingNote:
      "Il tetto esiste perché gli acquirenti pagano posizione, dimensione del lotto e scarichi, non quanto hai speso.",
    dials: "Ipotesi",
    price: "Prezzo d'acquisto",
    fees: "Spese accessorie",
    level: "Livello di costo",
    levelLo: "Stima bassa",
    levelMid: "Valore medio",
    levelHi: "Stima alta",
    levelNote:
      "La relazione tecnica indica ogni voce come intervallo, ad esempio da 130.000 a 350.000 per il tetto. Questa manopola stabilisce dove collocarsi nell’intervallo. Tutto a sinistra usa le stime basse, tutto a destra quelle alte. Sposta sia il costo sia il valore.",
    priceNote: "Il prezzo richiesto è 500.000. Sposta in alto per simulare un’offerta.",
    yearsNote:
      "Il punto nel tempo in cui confrontiamo il valore. Non è una data di vendita: stabilisce solo quanti anni di costi ricorrenti vengono conteggiati.",
    prev: "Foto precedente",
    next: "Foto successiva",
    diy: "Lavoro proprio",
    diyNote: "Quota di manodopera che svolgi da solo. Materiali e oneri non cambiano.",
    years: "Orizzonte temporale",
    yearsUnit: "anni",
    rate: "Tasso reale",
    rateNote: "Usato per scontare i costi ricorrenti",
    measures: "Interventi",
    mCost: "Costo",
    mValue: "Valore aggiunto",
    mNet: "Netto",
    mNetNote: "Il netto è la differenza. Barra verde più lunga della rossa significa che l\u2019intervento si ripaga.",
    blockers: "ostacoli",
    blockersTitle: "Ostacoli e attività aperte",
    glossTitle: "Concetti da conoscere",
    mapLink: "Vedi la posizione sulla mappa",
    finnLink: "L’annuncio su FINN",
    finnMeta: "Prezzo richiesto 500 000 NOK",
    farmLink: "Mappa catastale del fondo del concedente",
    farmMeta: "208,1 unità · 180 di bosco · 0 agricolo",
    prospectLink: "Scarica il fascicolo di vendita",
    prospectMeta: "PDF · 9,5 MB",
    running: "Costi ricorrenti",
    runningItems: [
      ["Canone di concessione", 2135],
      ["Tributi comunali", 4037],
      ["Consorzio del comprensorio", 2800],
      ["Quota acqua comune", 1000],
    ],
    runningTotal: "Totale all'anno",
    perYearUnit: "NOK all'anno",
    perYearShort: "NOK/anno",
    runningPv: "Valore attuale nel periodo",
    tgLabel: {
      tg3: "Grave (TG3)",
      tg2: "Medio (TG2)",
      legal: "Abusivo",
      opt: "Opzionale",
    },
    open: "Domande aperte",
    todo: "Passaggi necessari",
    dep: "Dipende da",
    exclusive: "Scegli uno",
    none: "Nessuno",
    notes: "Note",
    notesBody: [
      "Le cifre sono stime tratte dal fascicolo di vendita, dalla relazione tecnica del 01.09.2026, dal contratto di concessione del 19.03.1981 e dalla mappa catastale del fondo 418/5. Non è una valutazione.",
      "Le stime di valore sono calibrate su annunci attivi a Spydeberg e intorno al Lyseren. Si tratta di prezzi richiesti, non realizzati.",
      "Il riscatto del terreno è modellato come possibile. È probabilmente escluso dall'eccezione agricola dell'art. 34, terzo comma.",
    ],
    photoCaps: [
      "La baita da sud-ovest. A destra l’annesso con tetto erboso, numero 10, e dietro i depositi.",
      "L’annesso ha porte finestre e un letto a castello. Non compare nel prospetto delle superfici, ed è stato costruito senza permesso.",
      "Soggiorno e cucina. La stufa a legna è la fonte principale, e la fascia di finestre alte porta luce sotto il colmo.",
      "La terrazza è indicata a 38 m². Le tavole sono logorate, e il perito l’ha classificata grave per umidità, marciume e cedimenti.",
      "Il bagno. Dietro il lavabo una pompa, a muro un filtro per l’acqua. Nessuna membrana né scarico a pavimento noti.",
    ],
  },
};

/* -------------------------- the model ----------------------------- */
/* cost in thousands NOK; labour = share of cost that is labour       */

const MEASURES = [
  {
    id: "roof",
    tag: "tg3",
    cost: [130, 350],
    val: [90, 150],
    labour: 0.45,
    name: {
      no: "Tak og takkonstruksjon",
      en: "Roof and roof structure",
      it: "Tetto e struttura",
    },
    desc: {
      no: "Pappshingel over 18 år, påvist fukt og råte i konstruksjonen, nedbøyning. Takstmannen har satt strakstiltak.",
      en: "Bitumen shingle over 18 years old, confirmed damp and rot in the structure, sagging. The surveyor flagged immediate action.",
      it: "Scandole bituminose oltre 18 anni, umidità e marciume accertati, cedimenti. Il perito ha richiesto intervento immediato.",
    },
    blockers: {
      no: ["Bæreevnen er ikke vurdert innenfra. Ring takstmann Kjeserud (913 54 951) før du byr.", "Utsettelse er ikke gratis: taket lekker nå, og kostnaden vokser mot øvre anslag."],
      en: ["Load-bearing capacity was not assessed from inside. Call surveyor Kjeserud (+47 913 54 951) before bidding.", "Delay is not free: the roof leaks now, and the cost drifts to the upper estimate."],
      it: ["La capacità portante non è stata verificata dall'interno. Chiama il perito Kjeserud (+47 913 54 951) prima di offrire.", "Rinviare non è gratis: il tetto perde ora e il costo tende alla stima alta."],
    },
  },
  {
    id: "deck",
    tag: "tg3",
    cost: [40, 130],
    val: [30, 50],
    labour: 0.55,
    name: { no: "Veranda, 32 m²", en: "Deck, 32 m²", it: "Terrazza, 32 m²" },
    desc: {
      no: "Fukt og råte, nedbøyning. Rekkverket tilfredsstiller ikke dagens krav.",
      en: "Damp and rot, sagging. The railing does not meet current requirements.",
      it: "Umidità e marciume, cedimenti. Il parapetto non è a norma.",
    },
    blockers: {
      no: ["Fallrisiko i mellomtiden. Steng av eller forsterk før bruk."],
      en: ["Fall risk in the meantime. Close it off or brace it before use."],
      it: ["Rischio di caduta nel frattempo. Chiudila o rinforzala prima dell'uso."],
    },
  },
  {
    id: "drain",
    tag: "tg3",
    cost: [40, 80],
    val: [25, 40],
    labour: 0.5,
    name: {
      no: "Terreng og drenering",
      en: "Ground levels and drainage",
      it: "Terreno e drenaggio",
    },
    desc: {
      no: "Terrenget faller inn mot bygget. Dette er årsaken til den forhøyede fukten i krypkjelleren, som selger bekrefter er uutbedret.",
      en: "Ground falls towards the building. This is the source of the raised damp in the crawl space, which the seller confirms is unremedied.",
      it: "Il terreno pende verso l'edificio. È la causa dell'umidità nel vespaio, che il venditore conferma non risanata.",
    },
    blockers: {
      no: ["Fjell i grunnen. Graving kan bli dyrere enn anslaget.", "Gjør dette før eller samtidig med taket, ellers utbedrer du symptomet og ikke årsaken."],
      en: ["Bedrock at shallow depth. Excavation may exceed the estimate.", "Do this before or with the roof, or you fix the symptom and not the cause."],
      it: ["Roccia in superficie. Lo scavo può superare la stima.", "Fallo prima o insieme al tetto, altrimenti curi il sintomo e non la causa."],
    },
  },
  {
    id: "windows",
    tag: "tg2",
    cost: [60, 120],
    val: [35, 55],
    labour: 0.4,
    name: { no: "Vinduer", en: "Windows", it: "Finestre" },
    desc: {
      no: "Over 35 år gamle, punkterte glass. Energikarakter G.",
      en: "Over 35 years old, failed sealed units. Energy rating G.",
      it: "Oltre 35 anni, vetri con guarnizioni compromesse. Classe energetica G.",
    },
    blockers: { no: [], en: [], it: [] },
  },
  {
    id: "cladding",
    tag: "tg2",
    cost: [50, 130],
    val: [30, 45],
    labour: 0.55,
    name: {
      no: "Kledning, lufting, trapp",
      en: "Cladding, ventilation, stair",
      it: "Rivestimento, ventilazione, scala",
    },
    desc: {
      no: "Råte i kledningen, manglende musetetting, skjev utetrapp med ulovlig rekkverk.",
      en: "Rot in the cladding, no rodent barrier, uneven external stair with non-compliant railing.",
      it: "Marciume nel rivestimento, nessuna barriera antitopo, scala esterna irregolare e parapetto non a norma.",
    },
    blockers: { no: [], en: [], it: [] },
  },
  {
    id: "interior",
    tag: "opt",
    cost: [100, 250],
    val: [80, 130],
    labour: 0.45,
    name: {
      no: "Innvendig oppgradering",
      en: "Interior upgrade",
      it: "Ristrutturazione interna",
    },
    desc: {
      no: "Kjøkken fra byggeåret, fuktskader i gulv, vegger og himling, innvendige dører. Våtrommet har ufaglært arbeid fra 2000 uten kjent membran.",
      en: "Original 1969 kitchen, damp damage to floor, walls and ceiling, internal doors. The wet room has unqualified work from 2000 with no known membrane.",
      it: "Cucina originale del 1969, danni da umidità a pavimento, pareti e soffitto, porte interne. Il bagno ha lavori non professionali del 2000 senza membrana nota.",
    },
    blockers: {
      no: ["Gjør dette sist. Utvendig tetting først, ellers ødelegges det nye av samme fukt."],
      en: ["Do this last. Seal the exterior first, or the same damp ruins the new work."],
      it: ["Fallo per ultimo. Prima l'involucro, altrimenti la stessa umidità rovina il nuovo."],
    },
  },
  {
    id: "legal",
    tag: "legal",
    cost: [60, 200],
    val: [40, 70],
    labour: 0.05,
    name: {
      no: "Lovliggjøring av byggetiltak",
      en: "Legalising the unpermitted works",
      it: "Sanatoria degli interventi abusivi",
    },
    desc: {
      no: "Endret romløsning, flyttet toalettrom, ombygd inngangsparti, påbygd terrasse, oppført bod og innlagt vann. Alt uten byggemelding. Verken ferdigattest eller brukstillatelse foreligger.",
      en: "Altered layout, relocated toilet room, rebuilt entrance, extended deck, erected shed and plumbed-in water. All without permission. Neither completion certificate nor occupancy permit exists.",
      it: "Distribuzione modificata, bagno spostato, ingresso ricostruito, terrazza ampliata, deposito eretto e acqua allacciata. Tutto senza permesso. Nessun certificato di fine lavori né agibilità.",
    },
    blockers: {
      no: [
        "Krever ansvarlig søker. Du kan ikke søke selv.",
        "Omsøkes etter dagens regelverk: takhøyde, lysflate, ventilasjon, rømningsvei, brannsikring.",
        "Utnyttelsesgraden i kommuneplanen kan kreve dispensasjon på en tomt på 110 m².",
        "Haleriskoen er at boden må rives.",
        "Ring byggesak i Indre Østfold, 69 68 10 00, telefontid mandag til torsdag 10 til 14.",
      ],
      en: [
        "Requires a registered applicant firm. You cannot apply yourself.",
        "Assessed against today's code: ceiling height, glazing, ventilation, escape route, fire safety.",
        "Plot ratio in the municipal plan may require a dispensation on a 110 m² plot.",
        "Tail risk is that the shed must be demolished.",
        "Call Indre Østfold building control, +47 69 68 10 00, phone hours Monday to Thursday, 10 to 14.",
      ],
      it: [
        "Richiede un professionista abilitato. Non puoi presentare la domanda da solo.",
        "Valutato secondo la normativa attuale: altezza, superficie vetrata, ventilazione, via di fuga, sicurezza antincendio.",
        "L'indice di utilizzazione del piano comunale può richiedere una deroga su 110 m².",
        "Rischio estremo: il deposito va demolito.",
        "Chiama l'ufficio edilizia di Indre Østfold, +47 69 68 10 00, da lunedì a giovedì, 10 alle 14.",
      ],
    },
  },
];

/* Full connection splits into a per-property part that never shares
   (connection fee, own pumping station, service line, processing) and
   the trench to the nearest main, which costs roughly the same whether
   one cabin connects or fifteen. Thousands of NOK. */
const FULL_FIXED = [170, 280];
const FULL_TRENCH = [130, 420];

const SEWER = {
  none: {
    cost: [0, 0],
    val: [0, 0],
    labour: 0,
    name: { no: "Ingen endring", en: "No change", it: "Nessuna modifica" },
    desc: {
      no: "Dusjvannet går sannsynligvis i en synkekum eller rett i terrenget. Det er et utslipp uten tillatelse, altså ulovlig i dag.",
      en: "Shower water most likely goes to a soakaway or straight onto the ground. That is a discharge without permission, and illegal today.",
      it: "L'acqua della doccia va probabilmente in un pozzo perdente o direttamente a terra. È uno scarico non autorizzato, quindi illegale.",
    },
    blockers: {
      no: ["Kommunen kan gi pålegg. Festekontraktens § 6 utløser da delt kostnad mellom festerne."],
      en: ["The municipality may issue an order. Clause 6 of the lease then triggers cost sharing between leaseholders."],
      it: ["Il comune può emettere un'ordinanza. L'art. 6 del contratto attiva la ripartizione tra concessionari."],
    },
  },
  grey: {
    cost: [80, 150],
    val: [100, 150],
    labour: 0.25,
    name: {
      no: "Gråvannsanlegg",
      en: "Greywater system",
      it: "Impianto acque grigie",
    },
    desc: {
      no: "Slamavskiller eller fettskille, biofilter eller filterpose, deretter infiltrasjon. Forbrenningstoalettet gjør at du ikke har svartvann, og det er svartvann som utløser de strenge kravene.",
      en: "Grease or sludge separator, biofilter or filter bag, then infiltration. The incinerating toilet means there is no blackwater, and blackwater is what triggers the strict requirements.",
      it: "Separatore di grassi o fanghi, biofiltro o sacco filtrante, poi infiltrazione. Il WC a incenerimento evita le acque nere, che sono quelle che attivano i requisiti severi.",
    },
    blockers: {
      no: [
        "Den felles borebrønnen forsyner ni husstander. Infiltrasjon nær en drikkevannskilde er den tyngste innvendingen kommunen har.",
        "Festekontraktens § 6 nr. 3 forbyr å forurense noen drikkevannskilde.",
        "Fjell i grunnen. Uten løsmasser må du bygge opp sandfilter, som krever plass du ikke har.",
        "Anlegget står i grunneiers skog. § 10 fratar deg vetorett mot anlegg, men gir deg ingen rett til å anlegge.",
        "Krever fortsatt utslippstillatelse, søkt av ansvarlig foretak.",
        "Velg filterpose du bytter selv, så slipper du kravet om godkjent helårsvei for slamtømming.",
      ],
      en: [
        "The shared borehole serves nine households. Infiltration near a drinking water source is the municipality's strongest objection.",
        "Clause 6(3) of the lease forbids polluting any drinking water source.",
        "Bedrock at shallow depth. Without loose soil you must build up a sand filter, which needs space you do not have.",
        "The system sits in the freeholder's forest. Clause 10 removes your veto over installations but grants no right to install.",
        "Still requires a discharge permit, applied for by a registered firm.",
        "Choose a self-changed filter bag and you avoid the all-year road requirement for sludge emptying.",
      ],
      it: [
        "Il pozzo comune serve nove nuclei. L'infiltrazione vicino a una fonte di acqua potabile è l'obiezione più forte del comune.",
        "L'art. 6, punto 3 del contratto vieta di inquinare qualsiasi fonte di acqua potabile.",
        "Roccia in superficie. Senza terreno sciolto serve un filtro a sabbia rialzato, che richiede spazio che non hai.",
        "L'impianto sta nel bosco del concedente. L'art. 10 ti toglie il veto ma non ti dà il diritto di costruire.",
        "Serve comunque l'autorizzazione allo scarico, presentata da un'impresa abilitata.",
        "Scegli un sacco filtrante sostituibile da te ed eviti l'obbligo di strada invernale per lo spurgo.",
      ],
    },
  },
  full: {
    cost: [300, 700],
    val: [450, 600],
    labour: 0.15,
    name: {
      no: "Tilknytning til trykkavløp",
      en: "Connection to the pressurised sewer",
      it: "Allaccio alla fognatura in pressione",
    },
    desc: {
      no: "Tilknytning til det kommunale trykkavløpet ved Lyseren. Tilknytningsgebyret for avløp er 157 550 kroner i 2026 for eiendommer som ikke var med i det opprinnelige spleiselaget. Deretter vanngebyr, pumpestasjon, graving og saksbehandling.",
      en: "Connection to the municipal pressurised sewer at Lyseren. The 2026 connection fee is NOK 157,550 for properties not in the original cost-sharing group. Then water fee, pumping station, excavation and processing.",
      it: "Allaccio alla fognatura comunale in pressione del Lyseren. Il contributo 2026 è di 157.550 NOK per gli immobili non inclusi nel consorzio originario. Poi tariffa acqua, stazione di pompaggio, scavo e istruttoria.",
    },
    descFelles: {
      no: "Samme tilknytning, men som spleiselag med resten av hyttefeltet. Gravingen til nærmeste hovedledning koster omtrent det samme uansett om én hytte kobler seg på eller femten, så den posten faller kraftig per hytte. Tilknytningsgebyret på 157 550, din egen pumpestasjon og stikkledningen din betaler du alene uansett.",
      en: "The same connection, but as a cost-sharing scheme with the rest of the cabin field. The trench to the nearest main costs roughly the same whether one cabin connects or fifteen, so that item falls sharply per cabin. The NOK 157,550 connection fee, your own pumping station and your service line you pay alone regardless.",
      it: "Lo stesso allaccio, ma come consorzio con il resto del comprensorio. Lo scavo fino alla condotta principale costa più o meno lo stesso sia per una baita che per quindici, quindi quella voce cala molto per unità. Il contributo di 157.550, la tua stazione di pompaggio e il tuo allacciamento li paghi da solo comunque.",
    },
    blockersFelles: {
      no: [
        "Du må faktisk få naboene med. Ta det opp med Amundrud og Kausebøl hyttevel på visningen, før du byr.",
        "Festekontraktens § 10 gjør at ingen fester kan blokkere et felles anlegg for vann og avløp. Det er den bestemmelsen som gjør spleiselaget mulig.",
        "Kommer det kommunalt pålegg, utløser § 6 en plikt for alle festerne til å dekke sin forholdsmessige andel. Da bygges anlegget uansett.",
        "Ledningsrett over grunneiers skog trengs fortsatt. Men et samlet krav fra hele feltet er noe helt annet å møte enn ett brev fra deg alene.",
        "Kommunen vil heller fjerne utslipp nær en brønn som forsyner ni husstander enn tillate flere. Det gjør fellesløsningen lettere å få godkjent enn ditt eget anlegg.",
        "Fremdriften er ikke din. Et spleiselag beveger seg i takt med den tregeste deltakeren, og det kan bli år.",
        "Få fordelingsnøkkelen skriftlig før noen graver. Uenighet om andeler i etterkant er den klassiske konflikten i slike prosjekter.",
      ],
      en: [
        "You actually have to bring the neighbours along. Raise it with the cabin field association at the viewing, before you bid.",
        "Clause 10 of the lease means no leaseholder can block a shared water and wastewater installation. That clause is what makes the scheme possible.",
        "If the municipality issues an order, clause 6 obliges every leaseholder to cover their proportionate share. Then it gets built regardless.",
        "You still need an easement across the freeholder's forest. But a joint claim from the whole field is a very different thing to face than one letter from you.",
        "The municipality would rather remove discharges near a borehole serving nine households than permit more. That makes the shared solution easier to approve than your own system.",
        "The pace is not yours. A cost-sharing scheme moves at the speed of its slowest member, and that can mean years.",
        "Get the cost-allocation key in writing before anyone digs. Arguing about shares afterwards is the classic conflict in these projects.",
      ],
      it: [
        "Devi davvero coinvolgere i vicini. Parlane con il consorzio del comprensorio alla visita, prima di fare un'offerta.",
        "L'art. 10 del contratto impedisce a qualsiasi concessionario di bloccare un impianto comune di acqua e scarichi. È quella clausola a rendere possibile il consorzio.",
        "Se il comune emette un'ordinanza, l'art. 6 obbliga ogni concessionario a coprire la propria quota. Allora si costruisce comunque.",
        "Serve ancora una servitù sul bosco del concedente. Ma una richiesta collettiva di tutto il comprensorio è cosa molto diversa da una tua lettera.",
        "Il comune preferisce eliminare scarichi vicino a un pozzo che serve nove nuclei piuttosto che autorizzarne altri. Questo rende il consorzio più facile da approvare del tuo impianto.",
        "I tempi non sono tuoi. Un consorzio va alla velocità del membro più lento, e possono volerci anni.",
        "Metti per iscritto il criterio di ripartizione prima che si scavi. Litigare sulle quote dopo è il conflitto classico di questi progetti.",
      ],
    },
    blockers: {
      no: [
        "Ledningen må krysse grunneiers skog. Du trenger tinglyst ledningsrett. Uten den avvises søknaden for manglende privatrettslig adkomst.",
        "Grunneier har avvist innløsning av tomtene. Regn ikke med velvilje.",
        "Utveien er ekspropriasjon etter oreigningslova. Dyrt og tar år.",
        "Gravestrekket til nærmeste hovedledning er ukjent. Fjell i grunnen ganger opp kostnaden.",
        "Krever ansvarlig foretak og tillatelse til tiltak, men ikke utslippstillatelse.",
        "Vanninstallasjonen må lovliggjøres i samme runde.",
      ],
      en: [
        "The pipe must cross the freeholder's forest. You need a registered easement. Without it the application fails for lack of private-law access.",
        "The freeholder has refused to sell plots. Do not count on goodwill.",
        "The fallback is expropriation under the Expropriation Act. Expensive and slow.",
        "Distance to the nearest main is unknown. Bedrock multiplies the cost.",
        "Requires a registered firm and a building permit, but no discharge permit.",
        "The water installation must be legalised in the same round.",
      ],
      it: [
        "La condotta deve attraversare il bosco del concedente. Serve una servitù trascritta. Senza, la domanda è respinta per mancanza di titolo.",
        "Il concedente ha rifiutato di vendere i lotti. Non contare sulla buona volontà.",
        "L'alternativa è l'espropriazione. Costosa e lenta.",
        "La distanza dalla condotta principale è ignota. La roccia moltiplica il costo.",
        "Serve un'impresa abilitata e il permesso di costruire, non l'autorizzazione allo scarico.",
        "L'impianto idrico va sanato nella stessa pratica.",
      ],
    },
  },
};

const SAUNA = {
  none: {
    cost: [0, 0],
    val: [0, 0],
    labour: 0,
    name: { no: "Ingen", en: "None", it: "Nessuna" },
    desc: { no: "", en: "", it: "" },
    blockers: { no: [], en: [], it: [] },
  },
  el: {
    cost: [55, 110],
    val: [40, 70],
    labour: 0.5,
    name: {
      no: "Elektrisk badstu i boden",
      en: "Electric sauna in the shed",
      it: "Sauna elettrica nel deposito",
    },
    desc: {
      no: "Kandidaten er annekset, ikke boden på 7 m². Arealet er ikke oppgitt noe sted, så tallene under er for et lite badsturom. Spydeberg elektro la strøm til annekset i 2024, faglært. Uten skorstein forsvinner skorsteinssøknaden, feiingen og det meste av brannskillet.",
      en: "The candidate is the annex, not the 7 m² shed. Its area is stated nowhere, so the figures below are for a small sauna room. A certified electrician ran power to the annex in 2024. With no chimney you drop the chimney application, the sweeping regime and most of the fire separation.",
      it: "Il candidato è l’annesso, non il deposito di 7 m². La superficie non è dichiarata da nessuna parte, quindi le cifre sotto valgono per un piccolo locale sauna. Un elettricista abilitato ha portato corrente all’annesso nel 2024. Senza camino spariscono la pratica per la canna fumaria, lo spazzacamino e gran parte della compartimentazione.",
    },
    blockers: {
      no: [
        "Bruksendring etter pbl § 20-1 bokstav d krever søknad med ansvarlig foretak.",
        "Annekset har ingen byggetillatelse. Bruksendring på et bygg kommunen ikke anerkjenner går ikke.",
        "Bunt søknaden med lovliggjøringen. To separate søknader er dobbelt gebyr og dobbelt ventetid.",
        "Mål annekset og den innvendige takhøyden, og sjekk om reisverket bærer ovn og benker.",
      ],
      en: [
        "Change of use under the Planning Act s.20-1(d) requires an application by a registered firm.",
        "The annex has no building permit. You cannot change the use of a building the municipality does not recognise.",
        "Bundle it with the legalisation. Two separate applications mean double fees and double waiting.",
        "Measure the annex and its internal ceiling height, and check the frame carries a stove and benches.",
      ],
      it: [
        "Il cambio di destinazione richiede una domanda presentata da un'impresa abilitata.",
        "L’annesso non ha permesso di costruire. Non si cambia destinazione a un edificio non riconosciuto.",
        "Unisci la pratica alla sanatoria. Due domande separate significano doppi oneri e doppia attesa.",
        "Misura l’annesso e l’altezza interna, e verifica che la struttura regga stufa e panche.",
      ],
    },
  },
  ved: {
    cost: [104, 228],
    val: [50, 90],
    labour: 0.5,
    name: {
      no: "Vedfyrt badstu i boden",
      en: "Wood-fired sauna in the shed",
      it: "Sauna a legna nel deposito",
    },
    desc: {
      no: "Samme anneks, men med vedovn. Det dobler papirarbeidet og legger til brannskille mot hytta. Én ting kontrakten nekter deg: § 8 gir festeren ingen rett til ved på eierens eiendom.",
      en: "The same annex, but wood-fired. That doubles the paperwork and adds fire separation towards the cabin. One thing the lease denies you: clause 8 grants no right to firewood from the owner's land.",
      it: "Lo stesso annesso, ma a legna. Raddoppia le pratiche e aggiunge la compartimentazione verso la baita. Una cosa il contratto la nega: l'art. 8 non dà diritto alla legna del fondo.",
    },
    blockers: {
      no: [
        "Søknadspliktig to ganger: bruksendring etter § 20-1 d og ny skorstein etter § 20-1 f. Begge krever ansvarlig foretak.",
        "Annekset har ingen byggetillatelse. Lovliggjøringen må komme først eller i samme søknad.",
        "Brannkravet er 8 meter mellom bygninger. På 110 m² står annekset nærmere, så veggen mot hytta må brannsikres.",
        "Skorsteinen må være isolert og typegodkjent, minst 0,8 m over takflaten, og meldes til feievesenet for årlig tilsyn.",
        "Grunneiers samtykke. Du bygger om på hennes grunn.",
      ],
      en: [
        "Two permits needed: change of use under s.20-1(d) and a new chimney under s.20-1(f). Both require a registered firm.",
        "The annex has no building permit. Legalisation must come first or in the same application.",
        "Fire rules require 8 m between buildings. On 110 m² the annex is closer, so the wall facing the cabin must be fire rated.",
        "The chimney must be insulated and type approved, at least 0.8 m above the roof, and registered with the sweep for annual inspection.",
        "The freeholder's consent. You are rebuilding on her land.",
      ],
      it: [
        "Servono due permessi: cambio d'uso e nuova canna fumaria. Entrambi tramite impresa abilitata.",
        "L’annesso non ha permesso di costruire. La sanatoria viene prima o nella stessa pratica.",
        "Le norme antincendio chiedono 8 m tra edifici. Su 110 m² l’annesso è più vicino, quindi la parete verso la baita va compartimentata.",
        "La canna fumaria deve essere isolata e omologata, almeno 0,8 m sopra la falda, e registrata per il controllo annuale.",
        "Il consenso del concedente. Stai ricostruendo sul suo terreno.",
      ],
    },
  },
};

const REDEEM = {
  cost: [160, 250],
  val: [150, 200],
  labour: 0,
  name: {
    no: "Innløsning av tomta, 2031",
    en: "Redeeming the land, 2031",
    it: "Riscatto del terreno, 2031",
  },
  desc: {
    no: "Kontrakten er tidsbestemt, så grunneier velger det høyeste av 25 ganger oppregulert festeavgift, altså rundt 68 000, eller 40 prosent av tomteverdien. Kontrakten oppgir ingen tomtestørrelse, bare punkt nr. 10, så det er et punktfeste og tomta regnes som ett dekar. Da blir 40-prosentalternativet det dyre.",
    en: "The lease is fixed-term, so the freeholder picks the higher of 25 times the revised ground rent, about NOK 68,000, or 40 per cent of land value. The lease states no plot size, only point no. 10, so it is a point-lease and the plot counts as one hectare-unit. That makes the 40 per cent option the expensive one.",
    it: "Il contratto è a termine, quindi il concedente scegli il maggiore tra 25 volte il canone rivalutato, circa 68.000, o il 40 per cento del valore del terreno. Il contratto non indica la superficie, solo il punto n. 10: è una punto-concessione e il lotto conta come un ettaro. Il 40 per cento diventa l'opzione costosa.",
  },
  blockers: {
    no: [
      "Sannsynligvis sperret. Landbruksunntaket i tomtefesteloven § 34 tredje ledd lar grunneier tilby forlengelse i stedet for salg.",
      "Gårdskart bekrefter 208,1 dekar, hvorav 180 produktiv skog og null jordbruksareal. 100-dekarsvilkåret er oppfylt.",
      "Med et titalls hytter i feltet passerer festeinntektene minstebeløpet, og et lite skogsbruk har lavt driftsresultat, så 5-prosentvilkåret er nesten sikkert oppfylt.",
      "Grunneier har ENK, ikke AS, så driftsresultatet er ikke offentlig. Du kan ikke etterprøve tallene.",
      "Det gjenstående stridsspørsmålet er om det drives aktiv og rasjonell næringsdrift på 180 dekar ren skog. Søket viste Grunneiendom, ikke Landbrukseiendom, altså ikke funnet i Landbruksregisteret.",
      "Bevisbyrden er hennes. Dokumenterer hun ikke vilkårene, kan festeren gå rettens vei.",
      "Frist: krav må fremsettes skriftlig innen utgangen av 2030. Bommer du, må du vente til 2041.",
    ],
    en: [
      "Probably barred. The agricultural exemption in s.34(3) lets the freeholder offer an extension instead of a sale.",
      "The cadastral farm map confirms 208.1 units, of which 180 productive forest and no agricultural land. The 100-unit test is met.",
      "With a dozen cabins in the field the lease income clears the minimum, and a small forestry holding has a low operating profit, so the 5 per cent test is almost certainly met.",
      "The freeholder trades as a sole proprietorship, not a company, so the accounts are not public. You cannot verify the figures.",
      "The remaining dispute is whether 180 units of pure forest constitutes active and rational commercial operation. The map returned Ground property, not Agricultural property, so it is not in the farm register.",
      "The burden of proof is hers. If she does not document the conditions, the leaseholder can go to court.",
      "Deadline: a written claim must be filed by the end of 2030. Miss it and you wait until 2041.",
    ],
    it: [
      "Probabilmente escluso. L'eccezione agricola consente al concedente di offrire una proroga invece della vendita.",
      "La mappa catastale conferma 208,1 unità, di cui 180 di bosco produttivo e nessun terreno agricolo. Il requisito delle 100 unità è soddisfatto.",
      "Con una dozzina di baite i canoni superano il minimo, e una piccola azienda forestale ha un risultato operativo basso: il requisito del 5 per cento è quasi certamente soddisfatto.",
      "Il concedente opera come ditta individuale, non società, quindi i bilanci non sono pubblici. Non puoi verificare le cifre.",
      "Resta contestabile se 180 unità di solo bosco costituiscano attività d'impresa attiva e razionale. La ricerca ha restituito Proprietà fondiaria, non Azienda agricola.",
      "L'onere della prova è suo. Se non documenta le condizioni, il concessionario può rivolgersi al giudice.",
      "Scadenza: la domanda scritta va presentata entro fine 2030. Se la manchi, si attende il 2041.",
    ],
  },
};


/* --------------------------- concepts ----------------------------- */

const GLOSSARY = [
  {
    id: "sumin",
    term: {
      no: "«Dette betaler du»: hva som er regnet med",
      en: "\u201cWhat you pay\u201d: what is included",
      it: "\u00abQuanto paghi\u00bb: cosa comprende",
    },
    body: {
      no: [
        "Tallet dekker alt hytta koster deg. Det legger sammen kjøpesummen, omkostningene på 13 850, hvert tiltak du har haket av til det kostnadsnivået du har valgt, minus det du sparer på egeninnsats, og nåverdien av de løpende kostnadene i eiertiden.",
        "Renter på lån, din egen tid regnet i penger, og møbler og innbo står utenfor.",
        "Prisantydningen på 500 000 er den minste av utgiftene dine. Skru på tak, lovliggjøring og avløp, og du ser hvorfor.",
      ],
      en: [
        "The figure covers everything the cabin costs you. It sums the purchase price, the NOK 13,850 of transaction costs, every work item you have ticked at your chosen cost level, less what you save by doing labour yourself, and the present value of the recurring costs over your holding period.",
        "Loan interest, your own time valued in money, and furniture all stay outside it.",
        "The NOK 500,000 asking price is the smallest of your outlays. Switch on the roof, the legalisation and the wastewater, and you see why.",
      ],
      it: [
        "La cifra copre tutto ciò che la baita ti costa. Somma il prezzo d'acquisto, le spese accessorie di 13.850, ogni intervento selezionato al livello di costo scelto, meno quanto risparmi col lavoro proprio, e il valore attuale dei costi ricorrenti nel periodo di possesso.",
        "Restano fuori gli interessi sul mutuo, il tuo tempo valutato in denaro e gli arredi.",
        "I 500.000 richiesti sono la minore delle tue uscite. Attiva tetto, sanatoria e scarichi e capisci perché.",
      ],
    },
  },
  {
    id: "value",
    term: {
      no: "«Dette er den verdt» og taket i området",
      en: "\u201cWhat it is worth\u201d and the local ceiling",
      it: "\u00abQuanto vale\u00bb e il tetto locale",
    },
    body: {
      no: [
        "Antatt verdi starter på 500 000, altså hytta slik den står, og legger til et verdiløft for hvert tiltak. Summen kappes deretter av et markedstak.",
        "Taket finnes fordi kjøpere her betaler for beliggenhet, tomtestørrelse og avløp. Tomta er 110 kvadratmeter uten strandlinje. Sammenlignbare hytter ved Lyseren med godkjent vann og avløp ligger rundt 1 690 000 som selveiere, og under det som festetomt.",
        "Derfor er taket 850 000 uten avløp, 1 000 000 med gråvann og 1 550 000 med tilknytning. Måleren under forutsetningene viser hvor nær du er. Treffer du taket, er neste krone du bruker tapt.",
      ],
      en: [
        "Estimated value starts at 500,000, the cabin as it stands, and adds an uplift for each work item. The sum is then capped by a market ceiling.",
        "The ceiling exists because buyers here pay for location, plot size and wastewater. The plot is 110 square metres with no shore frontage. Comparable cabins at Lyseren with approved water and wastewater sit around 1,690,000 as freeholds, and below that as leaseholds.",
        "So the ceiling is 850,000 with no wastewater, 1,000,000 with greywater and 1,550,000 with a sewer connection. The meter under the assumptions shows how close you are. Once you hit it, the next krone you spend is lost.",
      ],
      it: [
        "Il valore stimato parte da 500.000, la baita così com'è, e aggiunge un incremento per ogni intervento. La somma è poi limitata da un tetto di mercato.",
        "Il tetto esiste perché qui gli acquirenti pagano posizione, dimensione del lotto e scarichi. Il lotto è di 110 metri quadrati senza fronte lago. Baite comparabili al Lyseren con acqua e scarichi autorizzati stanno intorno a 1.690.000 in piena proprietà, e meno in concessione.",
        "Il tetto è quindi 850.000 senza scarichi, 1.000.000 con acque grigie e 1.550.000 con allaccio. L'indicatore sotto le ipotesi mostra quanto sei vicino. Raggiunto quello, ogni corona in più è persa.",
      ],
    },
  },
  {
    id: "feste",
    term: {
      no: "Festetomt og festetid",
      en: "Leasehold land and lease term",
      it: "Terreno in concessione e durata",
    },
    body: {
      no: [
        "Du eier hytta. Grunnen leier du. Det kalles tomtefeste og er svært vanlig for norske hytter.",
        "Festetiden her er 80 år, fra 19. mars 1981 til 31. desember 2061. Festeavgiften er 2 135 kroner i året og indeksreguleres hvert tiende år. Neste regulering kommer i 2030.",
        "Du mister ikke hytta når festetiden går ut. Tomtefesteloven gir festeren ubetinget rett til forlengelse, og grunneier har ingen oppsigelsesrett. Et forlenget festeforhold er i praksis evigvarende. Ved forlengelse kan festeavgiften derimot revideres opp til dagens prisnivå, og der ligger den reelle risikoen: en løpende kostnad du ikke styrer.",
        "Innløsningsrett betyr rett til å kjøpe tomta. Den oppstår etter 30 år av festetiden og deretter hvert tiende år, og kravet må sendes skriftlig minst ett år før. Prisen er 25 ganger oppregulert festeavgift, men for tidsbestemte avtaler kan grunneier i stedet kreve 40 prosent av tomteverdien. Hun velger det høyeste.",
        "Kontrakten fra 1981 oppgir ingen tomtestørrelse, bare punkt nr. 10. Det er et punktfeste, og loven regner da tomta som ett dekar i stedet for de 110 kvadratmeterne i matrikkelen. Det gjør 40-prosentalternativet dyrere.",
        "Hører tomta til en landbrukseiendom som oppfyller tre vilkår, kan grunneier avslå innløsning og tilby forlengelse i stedet. Grunneiendommen her er 208 dekar med 180 dekar skog, og grunneier har sagt at hun ikke vil selge ut tomtene. Regn med at du aldri får eie grunnen.",
        "Tre praktiske begrensninger i denne kontrakten. Salg krever grunneiers samtykke, som ikke kan nektes uten saklig grunn. Framleie er forbudt. Utleie er begrenset til fire uker i året. I tillegg forbyr en tinglyst erklæring fra 1977 bruk som helårsbolig.",
      ],
      en: [
        "You own the cabin. You rent the ground. This is Norwegian ground lease, and it is very common for cabins.",
        "The term here is 80 years, from 19 March 1981 to 31 December 2061. Ground rent is NOK 2,135 a year and is index-revised every ten years. The next revision falls in 2030.",
        "You do not lose the cabin when the term ends. The Ground Lease Act gives the leaseholder an unconditional right to extension, and the freeholder has no right to terminate. An extended lease is effectively perpetual. On extension the rent can be revised up to current market level, though, and that is where the real risk sits: a recurring cost you do not control.",
        "Redemption is the right to buy the plot. It arises after 30 years of the term and then every ten years, and the claim must be filed in writing at least one year ahead. The price is 25 times the revised rent, but for fixed-term leases the freeholder may instead demand 40 per cent of land value. She picks the higher.",
        "The 1981 contract states no plot size, only point no. 10. That makes it a point-lease, and the law then counts the plot as one hectare-unit instead of the 110 square metres in the cadastre. It makes the 40 per cent option dearer.",
        "If the plot belongs to a farm meeting three conditions, the freeholder may refuse redemption and offer an extension instead. The holding here is 208 units with 180 of forest, and the freeholder has said she will not sell plots. Assume you will never own the ground.",
        "Three practical limits in this lease. Selling requires the freeholder's consent, which cannot be refused without good cause. Subletting is prohibited. Letting is capped at four weeks a year. A registered covenant from 1977 also forbids year-round residential use.",
      ],
      it: [
        "La baita è tua. Il terreno lo affitti. Si chiama tomtefeste ed è molto comune per le baite norvegesi.",
        "La durata qui è di 80 anni, dal 19 marzo 1981 al 31 dicembre 2061. Il canone è di 2.135 corone l'anno e viene rivalutato ogni dieci anni. La prossima revisione cade nel 2030.",
        "Non perdi la baita alla scadenza. La legge dà al concessionario un diritto incondizionato alla proroga, e il concedente non può recedere. Una concessione prorogata è di fatto perpetua. Alla proroga, però, il canone può essere adeguato ai valori attuali, ed è lì che sta il rischio reale: un costo ricorrente che non controlli.",
        "Il riscatto è il diritto di acquistare il lotto. Nasce dopo 30 anni e poi ogni dieci, e la domanda va presentata per iscritto almeno un anno prima. Il prezzo è 25 volte il canone rivalutato, ma per i contratti a termine il concedente può pretendere il 40 per cento del valore del terreno. Sceglie il maggiore.",
        "Il contratto del 1981 non indica la superficie, solo il punto n. 10. È una punto-concessione, e la legge conta allora un ettaro invece dei 110 metri quadrati catastali. Questo rende il 40 per cento più caro.",
        "Se il lotto appartiene a un'azienda agricola che soddisfa tre requisiti, il concedente può rifiutare il riscatto e offrire una proroga. Il fondo qui è di 208 unità con 180 di bosco, e la proprietaria ha detto che non vende i lotti. Dai per scontato che non possiederai mai il terreno.",
        "Tre limiti pratici in questo contratto. La vendita richiede il consenso del concedente, che non può negarlo senza giusta causa. La sublocazione è vietata. L'affitto è limitato a quattro settimane l'anno. Un vincolo trascritto del 1977 vieta inoltre l'uso come residenza permanente.",
      ],
    },
  },
  {
    id: "water",
    term: {
      no: "Gråvann og svartvann",
      en: "Greywater and blackwater",
      it: "Acque grigie e acque nere",
    },
    body: {
      no: [
        "Gråvann er avløp som ikke kommer fra toalettet: dusj, servant, oppvask. Svartvann er toalettavløpet.",
        "Hytta har forbrenningstoalett, som brenner avfallet til aske og bruker ikke vann. Her finnes altså ingen svartvann. Det er en reell fordel, siden svartvann utløser de strenge kravene.",
        "Dusjvannet må likevel et sted. Eiendommen har ingen registrert avløpsløsning, så gråvannet går sannsynligvis i en synkekum eller rett i terrenget. Det er et utslipp uten tillatelse, altså ulovlig i dag.",
        "Konsekvenskjeden forklarer mesteparten av rotet. Uten godkjent avløp er innlagt vann ikke tillatt. Vannet i hytta er derfor ulovlig. Og du kan ikke lovliggjøre vannet uten først å løse avløpet.",
        "Vil du ha vannklosett, trenger du utslippstillatelse for svartvann. Her er det vanskelig: fjell i grunnen, en felles borebrønn for ni husstander, og nærhet til badeplassen ved Lyseren. Alternativet er tilknytning til det kommunale trykkavløpet.",
        "Gråvannsanlegg er langt lettere å få godkjent. Det gir deg ingen vannklosett, og kjøpere betaler mye mindre for det.",
        "Verdimessig er dette den viktigste enkeltfaktoren i hele kjøpet. Godkjent avløp er verdt mer enn hyttas samlede tilstand.",
      ],
      en: [
        "Greywater is wastewater that does not come from the toilet: shower, basin, dishes. Blackwater is toilet waste.",
        "The cabin has an incinerating toilet, which burns waste to ash and uses no water. So there is no blackwater here. That is a real advantage, since blackwater triggers the strict requirements.",
        "The shower water still has to go somewhere. The property has no registered wastewater system, so the greywater most likely runs to a soakaway or straight onto the ground. That is a discharge without permission, and illegal today.",
        "The chain of consequences explains most of the mess. Without approved wastewater, plumbed-in water is not permitted. The water in the cabin is therefore illegal. And you cannot legalise the water without first solving the wastewater.",
        "If you want a flushing toilet you need a blackwater discharge permit. That is hard here: bedrock at shallow depth, a shared borehole serving nine households, and proximity to the swimming spot at Lyseren. The alternative is connecting to the municipal pressurised sewer.",
        "A greywater system is far easier to get approved. It gives you no flushing toilet, and buyers pay much less for it.",
        "In value terms this is the single most important factor in the whole purchase. Approved wastewater is worth more than the cabin's condition as a whole.",
      ],
      it: [
        "Le acque grigie sono gli scarichi che non provengono dal WC: doccia, lavabo, lavaggio piatti. Le acque nere sono lo scarico del WC.",
        "La baita ha un WC a incenerimento, che riduce i rifiuti in cenere e non usa acqua. Qui non ci sono quindi acque nere. È un vantaggio reale, perché sono le acque nere ad attivare i requisiti severi.",
        "L'acqua della doccia deve comunque andare da qualche parte. L'immobile non ha uno scarico registrato, quindi le acque grigie finiscono probabilmente in un pozzo perdente o direttamente a terra. È uno scarico non autorizzato, quindi illegale.",
        "La catena delle conseguenze spiega la maggior parte dei problemi. Senza scarico autorizzato non è consentito avere l'acqua allacciata. L'acqua nella baita è quindi illegale. E non puoi sanare l'acqua senza prima risolvere lo scarico.",
        "Se vuoi un WC con sciacquone serve l'autorizzazione allo scarico di acque nere. Qui è difficile: roccia in superficie, un pozzo comune che serve nove nuclei e la vicinanza alla spiaggia del Lyseren. L'alternativa è l'allaccio alla fognatura comunale in pressione.",
        "Un impianto per acque grigie è molto più facile da autorizzare. Non ti dà il WC, e gli acquirenti pagano molto meno.",
        "In termini di valore questo è il fattore più importante di tutto l'acquisto. Uno scarico autorizzato vale più dell'intero stato della baita.",
      ],
    },
  },
  {
    id: "tg",
    term: {
      no: "Tilstandsgrad, TG",
      en: "Condition grade, TG",
      it: "Grado di condizione, TG",
    },
    body: {
      no: [
        "Bygningssakkyndig gir hver bygningsdel en tilstandsgrad. TG0 og TG1 er greit. TG2 er et avvik som krever oppmerksomhet. TG3 er et stort eller alvorlig avvik og skal følges av et kostnadsanslag.",
        "Strakstiltak betyr at det haster. Taket her har TG3 med strakstiltak, som i praksis vil si at skaden utvikler seg mens du venter.",
        "Én ting misforstås ofte: anslaget dekker å rette avviket til hyttas eksisterende standard. Oppgradering til dagens standard koster mer. Og et anslag er ingen pris.",
        "Denne hytta har fire TG3 og åtte TG2 på 40 kvadratmeter.",
      ],
      en: [
        "The surveyor gives each building element a condition grade. TG0 and TG1 are fine. TG2 is a deviation needing attention. TG3 is a major or severe deviation and must come with a cost estimate.",
        "Immediate action means it is urgent. The roof here is TG3 with immediate action, which in practice means the damage is progressing while you wait.",
        "One thing gets misread often: the estimate covers correcting the defect to the cabin's existing standard. Upgrading to modern standard costs more. And an estimate is no price.",
        "This cabin has four TG3 and eight TG2 items across 40 square metres.",
      ],
      it: [
        "Il perito assegna a ogni elemento un grado di condizione. TG0 e TG1 vanno bene. TG2 è una difformità che richiede attenzione. TG3 è una difformità grave e deve essere accompagnata da una stima di costo.",
        "Intervento immediato significa che è urgente. Il tetto qui è TG3 con intervento immediato, cioè il danno peggiora mentre aspetti.",
        "Una cosa viene fraintesa spesso: la stima copre il ripristino allo standard esistente della baita. Portarla agli standard attuali costa di più. E una stima non è un prezzo.",
        "Questa baita ha quattro TG3 e otto TG2 su 40 metri quadrati.",
      ],
    },
  },
  {
    id: "disclosed",
    term: {
      no: "Du kan ikke klage på det du har fått opplyst",
      en: "You cannot claim for what you were told",
      it: "Non puoi contestare ciò che ti è stato comunicato",
    },
    body: {
      no: [
        "Dette er det viktigste juridiske punktet i hele kjøpet, og salgsoppgaven sier det med rene ord.",
        "Alt som er opplyst i tilstandsrapporten, salgsoppgaven eller selgers egenerklæring er kjent for deg. Etter avhendingslova kan du ikke reklamere på kjente forhold. Selger har lagt kortene på bordet, og derfor er prisantydningen 500 000.",
        "Les det som en prising av risiko flyttet fra selger til kjøper. Du kjøper en hytte med kjente feil, til en pris som gjenspeiler dem. Leser du ikke rapporten, betaler du for den likevel.",
        "Boligkjøperforsikring hjelper lite her. Den dekker skjulte mangler, og det er få igjen når alt er opplyst.",
      ],
      en: [
        "This is the most important legal point in the whole purchase, and the prospectus says it plainly.",
        "Everything disclosed in the condition report, the prospectus or the seller's declaration is known to you. Under the Alienation Act you cannot claim for known defects. The seller has put the cards on the table, and that is why the asking price is 500,000.",
        "Read it as a price on risk moved from seller to buyer. You are buying a cabin with known defects, at a price that reflects them. If you do not read the report, you pay for it anyway.",
        "Buyer's insurance helps little here. It covers hidden defects, and few remain once everything is disclosed.",
      ],
      it: [
        "È il punto giuridico più importante dell'intero acquisto, e il fascicolo lo dice chiaramente.",
        "Tutto ciò che è dichiarato nella relazione tecnica, nel fascicolo di vendita o nella dichiarazione del venditore è noto a te. Per la legge norvegese non puoi contestare vizi noti. Il venditore ha messo le carte in tavola, ed è per questo che il prezzo richiesto è 500.000.",
        "Leggilo come il prezzo di un rischio spostato dal venditore all'acquirente. Compri una baita con vizi noti, a un prezzo che li riflette. Se non leggi la relazione, la paghi comunque.",
        "L'assicurazione dell'acquirente serve a poco qui. Copre i vizi occulti, e ne restano pochi quando tutto è dichiarato.",
      ],
    },
  },
  {
    id: "permits",
    term: {
      no: "Ferdigattest og ulovlige tiltak",
      en: "Completion certificate and unpermitted works",
      it: "Certificato di fine lavori e opere abusive",
    },
    body: {
      no: [
        "Ferdigattest er kommunens bekreftelse på at et byggearbeid er lovlig fullført. Her finnes verken ferdigattest eller midlertidig brukstillatelse.",
        "Fem tiltak er utført uten byggemelding: endret romløsning med flyttet toalettrom, ombygd inngangsparti, påbygd terrasse, oppført anneks og innlagt vann. Selger påtar seg ikke ansvar for å søke i ettertid.",
        "Kommunen kan kreve omsøking etter dagens regelverk, kreve tilbakeføring, eller ilegge overtredelsesgebyr. Ansvaret følger eiendommen, ikke selgeren. Overtar du, overtar du problemet.",
        "Du kan ikke søke selv. Slike saker krever ansvarlig søker, altså et godkjent foretak, og det koster.",
      ],
      en: [
        "A completion certificate is the municipality's confirmation that building work was lawfully finished. Here there is neither a completion certificate nor a temporary occupancy permit.",
        "Five works were carried out without permission: altered layout with a relocated toilet room, rebuilt entrance, extended deck, an erected annex and plumbed-in water. The seller accepts no responsibility for applying after the fact.",
        "The municipality can require a retroactive application under today's code, order restoration, or impose a penalty. Liability follows the property, not the seller. Take it over and you take over the problem.",
        "You cannot apply yourself. Such cases require a registered applicant firm, and that costs money.",
      ],
      it: [
        "Il certificato di fine lavori è la conferma comunale che un'opera è stata completata legalmente. Qui non esiste né quello né un'agibilità provvisoria.",
        "Cinque interventi sono stati eseguiti senza permesso: distribuzione modificata con bagno spostato, ingresso ricostruito, terrazza ampliata, un annesso eretto e acqua allacciata. Il venditore non si assume la responsabilità di sanarli.",
        "Il comune può richiedere una domanda in sanatoria secondo la normativa attuale, ordinare il ripristino o irrogare una sanzione. La responsabilità segue l'immobile, non il venditore. Se lo rilevi, rilevi il problema.",
        "Non puoi presentare la domanda da solo. Servono imprese abilitate, e hanno un costo.",
      ],
    },
  },
  {
    id: "takst",
    term: {
      no: "Verditakst og prisantydning",
      en: "Appraised value and asking price",
      it: "Valore di stima e prezzo richiesto",
    },
    body: {
      no: [
        "Verditakst er bygningssakkyndiges anslag på markedsverdi. Prisantydning er hva selger og megler ber om. Her er begge 500 000, uten luft mellom dem.",
        "Det betyr ikke at hytta går for 500 000. Hytter med lav prisantydning og mange interessenter havner ofte i budkrig, og oppnådd pris kan ligge godt over.",
        "Skru på kjøpesum-skruen for å se hva et høyere bud gjør med differansen. Det er den ene variabelen du styrer selv.",
      ],
      en: [
        "The appraised value is the surveyor's estimate of market value. The asking price is what the seller and agent request. Here both are 500,000, with no gap between them.",
        "That does not mean the cabin sells for 500,000. Cabins with a low asking price and many interested parties often end in a bidding war, and the achieved price can land well above.",
        "Move the purchase price dial to see what a higher bid does to the difference. It is the one variable you control yourself.",
      ],
      it: [
        "Il valore di stima è la valutazione del perito. Il prezzo richiesto è quanto chiedono venditore e agente. Qui sono entrambi 500.000, senza margine tra i due.",
        "Non significa che la baita si venda a 500.000. Con un prezzo richiesto basso e molti interessati si finisce spesso in un rilancio, e il prezzo realizzato può salire molto.",
        "Muovi la manopola del prezzo per vedere l'effetto di un'offerta più alta sulla differenza. È l'unica variabile che controlli tu.",
      ],
    },
  },
];

/* market ceiling in thousands, by sewer state */
const CEIL = { none: 850, grey: 1000, full: 1550 };

/* --------------------------- helpers ------------------------------ */

const lerp = (a, b, t) => a + (b - a) * t;

const fmt = (n) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");

function Money({ v, cls, sign }) {
  const n = Math.round(v);
  const s = Math.abs(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");
  return (
    <span className={cls}>
      {n < 0 ? "\u2212" : sign && n > 0 ? "+" : ""}
      {s}
    </span>
  );
}

function Slider({ label, note, value, min, max, step, onChange, display, auto }) {
  return (
    <label className={"dial" + (auto ? " auto" : "")}>
      <span className="dial-head">
        <span className="dial-label">{label}</span>
        <span className="dial-val">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          "--fill":
            ((value - min) / (max - min || 1)) * 100 + "%",
        }}
      />
      {note ? <span className="dial-note">{note}</span> : null}
    </label>
  );
}

/* Norwegian by default. The property, the documents and the law are all
   Norwegian, so that is the version to land on; the picker handles the rest. */
const DEFAULT_LANG = "no";

/* ------------------------------ app ------------------------------- */

export default function KausebolModel() {
  const [lang, setLang] = useState(DEFAULT_LANG);
  const [level, setLevel] = useState(0.5);
  const [diy, setDiy] = useState(0);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(3);
  const [price, setPrice] = useState(500);
  const [sel, setSel] = useState({
    roof: false,
    deck: false,
    drain: false,
    windows: false,
    cladding: false,
    interior: false,
    legal: false,
  });
  const [sewer, setSewer] = useState("none");
  const [sauna, setSauna] = useState("none");
  const [cabins, setCabins] = useState(1);
  const [maintManual, setMaintManual] = useState(null);
  const [growth, setGrowth] = useState(0);
  const [usage, setUsage] = useState(0.3);
  const [travel, setTravel] = useState(false);
  const [inclRun, setInclRun] = useState(false);

  /* The headline figures and the graph each live in the page first.
     Each joins the pinned bar once you have scrolled past it. */
  const navRowRef = useRef(null);
  const [navH, setNavH] = useState(38);
  const numsRef = useRef(null);
  const graphRef = useRef(null);
  /* The graph joins the pinned bar as soon as the bars themselves slide
     under the nav, not when the whole band with its legend and footnote has
     gone by. Handing over at that moment means the reader always has one
     copy of the graph on screen and never two. */
  const graphBarsRef = useRef(null);
  const [showNums, setShowNums] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [cur, setCur] = useState("ov");

  /* Switching language re-flows every paragraph above the viewport, which
     would otherwise shift the page under the reader. Measure a landmark
     before the switch and put it back where it was afterwards. */
  const anchorRef = useRef(null);

  const switchLang = (next) => {
    const marks = ["sec-ov", "sec-works", "sec-run", "sec-verdict", "sec-plan", "sec-blockers", "sec-concepts"]
      .map((id) => (typeof document !== "undefined" ? document.getElementById(id) : null))
      .filter(Boolean);
    const above = marks.filter((el) => el.getBoundingClientRect().top <= 140);
    const el = above.length ? above[above.length - 1] : marks[0];
    anchorRef.current = el ? { el, top: el.getBoundingClientRect().top } : null;
    setLang(next);
  };

  /* On a phone the section nav scrolls sideways, so pull the active tab
     into view instead of leaving it off the edge. */
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.querySelector('.nav2 button[aria-current="true"]');
    const box = el && el.parentElement;
    if (!el || !box || box.scrollWidth <= box.clientWidth) return;
    const left = el.offsetLeft - 12;
    const right = el.offsetLeft + el.offsetWidth + 12;
    if (left < box.scrollLeft) box.scrollTo({ left, behavior: "smooth" });
    else if (right > box.scrollLeft + box.clientWidth)
      box.scrollTo({ left: right - box.clientWidth, behavior: "smooth" });
  }, [cur]);

  useLayoutEffect(() => {
    const a = anchorRef.current;
    anchorRef.current = null;
    if (!a) return;
    const delta = a.el.getBoundingClientRect().top - a.top;
    if (Math.abs(delta) < 1) return;
    const se =
      (typeof document !== "undefined" &&
        (document.scrollingElement || document.documentElement)) ||
      null;
    if (se) {
      const before = se.scrollTop;
      se.scrollTop = before + delta;
      if (se.scrollTop === before) window.scrollBy(0, delta);
    } else {
      window.scrollBy(0, delta);
    }
  }, [lang]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = T[lang].pageTitle + ", " + T[lang].addr;
    }
  }, [lang]);

  useEffect(() => {
    let raf = 0;
    /* An element has been passed only when its whole box is above the
       viewport. Guarding on height keeps a not-yet-laid-out frame from
       reporting everything as passed. */
    /* 24px of hysteresis: it takes a little more scrolling to reveal
       than to hide, so resting right on the boundary cannot flicker. */
    const past = (el, wasOn) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      if (r.height <= 0) return wasOn;
      return wasOn ? r.bottom < 12 : r.bottom < -12;
    };
    const measure = () => {
      raf = 0;
      if (navRowRef.current) {
        const h = navRowRef.current.getBoundingClientRect().height;
        if (h > 0) setNavH((prev) => (Math.abs(prev - h) > 0.5 ? h : prev));
      }
      setShowNums((wasOn) => past(numsRef.current, wasOn));
      setShowGraph((wasOn) => {
        const el = graphBarsRef.current;
        if (!el) return past(graphRef.current, wasOn);
        const r = el.getBoundingClientRect();
        if (r.height <= 0) return wasOn;
        /* Measure the pinned bar now rather than closing over navH, which
           this effect never re-reads. The pinned graph comes in as soon as
           the bars START going under the bar, so the reader keeps a copy in
           view the whole way down. Same 12px hysteresis as past(). */
        const bar = navRowRef.current
          ? navRowRef.current.getBoundingClientRect().height
          : 38;
        return wasOn ? r.top < bar + 12 : r.top < bar - 12;
      });

      /* current section = the last one whose top has passed the bar */
      const ids = ["ov", "works", "run", "verdict", "plan", "blockers", "concepts"];
      let active = ids[0];
      for (const id of ids) {
        const el = document.getElementById("sec-" + id);
        if (el && el.getBoundingClientRect().top <= 150) active = id;
      }
      setCur(active);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    /* capture: true so scrolling in any ancestor container reaches us */
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    const tick = setInterval(measure, 400);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      clearInterval(tick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const [redeem, setRedeem] = useState(false);
  const [openRow, setOpenRow] = useState("legal");
  const [slide, setSlide] = useState(0);
  const swipe = useRef(null);
  const barSwipe = useRef(null);
  const step = (dir) =>
    setSlide((i) => (i + (dir > 0 ? 1 : SHOTS.length - 1)) % SHOTS.length);
  const [openGloss, setOpenGloss] = useState("sumin");

  const t = T[lang];

  const cost = (m) => {
    const base = lerp(m.cost[0], m.cost[1], level);
    return base * (1 - m.labour * diy);
  };
  const val = (m) => lerp(m.val[0], m.val[1], level);

  const sewerObj = useMemo(() => {
    const base = SEWER[sewer];
    if (sewer !== "full") return base;
    return {
      ...base,
      cost: [
        FULL_FIXED[0] + FULL_TRENCH[0] / cabins,
        FULL_FIXED[1] + FULL_TRENCH[1] / cabins,
      ],
      desc: cabins > 1 ? base.descFelles : base.desc,
      blockers: cabins > 1 ? base.blockersFelles : base.blockers,
    };
  }, [sewer, cabins]);

  const active = useMemo(() => {
    const rows = MEASURES.filter((m) => sel[m.id]).map((m) => ({
      ...m,
      key: m.id,
    }));
    if (sewer !== "none") rows.push({ ...sewerObj, key: "sewer", tag: "legal" });
    if (sauna !== "none") rows.push({ ...SAUNA[sauna], key: "sauna", tag: "opt" });
    if (redeem) rows.push({ ...REDEEM, key: "redeem", tag: "opt" });
    return rows;
  }, [sel, sewer, sauna, redeem, level, diy, sewerObj]);

  const fees = 13.85;
  const worksCost = active.reduce((s, m) => s + cost(m), 0);

  /* Envelope repairs lower future upkeep. Nothing done: 15k a year of
     patching. All five done: 8k a year of normal upkeep. */
  const ENVELOPE = ["roof", "deck", "drain", "windows", "cladding"];
  const envDone = ENVELOPE.filter((k) => sel[k]).length / ENVELOPE.length;
  const maintSuggest = 15 - 7 * envDone;
  const maint = maintManual === null ? maintSuggest : maintManual;
  const maintBucket =
    t.maintBuckets[Math.min(4, Math.floor(maint / 5.5))];

  const fixedRun = t.runningItems.reduce((s, r) => s + r[1], 0) / 1000;

  /* usage-driven costs, thousands of NOK per year */
  const EL_PRICE = 1.5;
  const nights = Math.round(lerp(8, 120, usage));

  /* Heating follows the envelope, not just how much the cabin is used. The
     cabin is rated G, so what leaks out is the biggest line, and sealing it
     is the one thing that changes that. Only the parts that actually hold
     heat count, weighted by how much each is worth: draught-proof windows do
     more than cladding, and cladding more than the roof, which is mostly
     about keeping water out. Drainage and the deck do nothing for heat, so
     they are absent here even though they count towards upkeep above.
     All three done is a 30% cut, which is the modest end of what a 1969
     cabin gains: it stays a poorly insulated timber box either way. */
  const HEAT = { windows: 0.14, cladding: 0.1, roof: 0.06 };
  const heatSaved = Object.entries(HEAT).reduce(
    (sum, [k, w]) => sum + (sel[k] ? w : 0),
    0
  );
  const heatFactor = 1 - heatSaved;
  const kwh = lerp(1000, 9000, Math.pow(usage, 1.2)) * heatFactor;
  const cPower = (kwh * EL_PRICE) / 1000;
  const cToilet = lerp(0.5, 3, usage);
  const cWood = lerp(0.8, 5, usage) * heatFactor;
  const cPump = lerp(0.6, 1.4, usage);
  const cTravel = travel ? ((nights / 2.5) * 330) / 1000 : 0;
  const useCost = cPower + cToilet + cWood + cPump + cTravel;

  const perYear = fixedRun + useCost + maint;
  const pvFactor =
    rate === 0
      ? years
      : (1 - Math.pow(1 + rate / 100, -years)) / (rate / 100);
  const runPv = perYear * pvFactor;
  const runIn = inclRun ? runPv : 0;
  const totalIn = price + fees + worksCost + runIn;

  const growF = Math.pow(1 + growth / 100, years);
  const rawValue = (500 + active.reduce((s, m) => s + val(m), 0)) * growF;
  const ceiling = (CEIL[sewer] + (redeem ? 200 : 0)) * growF;
  const value = Math.min(rawValue, ceiling);
  const capped = rawValue > ceiling;
  const delta = value - totalIn;

  /* What a night actually costs. Total spend over the period divided by
     nights would be wrong: most of the purchase price comes back when the
     cabin is sold, and charging the reader for capital they recover would
     roughly triple the figure. The real cost of the stay is what is gone at
     the end, which is exactly -delta, whether it went on interest, repairs
     or firewood. Running costs are only part of that, so the split below
     shows the two halves separately. */
  const totalNights = nights * years;
  /* Split the one-off part in two, because the interesting half is the
     renovation loss: what the works cost minus what they put back into the
     value. Each side is netted against the value it created, so the base
     value answers for the purchase and the added value for the works.
     Both are scaled by the same factor the ceiling cap applied to the whole,
     so a capped value shrinks the two lines in proportion and they still
     sum to the capital we do not get back. */
  const valBase = 500 * growF;
  const valWorks = active.reduce((sum, m) => sum + val(m), 0) * growF;
  const capFactor = rawValue > 0 ? value / rawValue : 1; /* 1 unless capped */
  const capitalGap = price + fees - valBase * capFactor;
  const worksLoss = worksCost - valWorks * capFactor;
  const oneOff = capitalGap + worksLoss; /* === price+fees+worksCost-value */
  const recurring = runIn;
  const sunk = oneOff + recurring; /* === -delta */
  const perNight = totalNights > 0 ? (sunk * 1000) / totalNights : 0;

  const figs = [
    [
      t.verdictIn,
      totalIn,
      inclRun ? t.verdictInSub : t.verdictInSubNoRun,
      "",
      false,
    ],
    [t.verdictOut, value, t.verdictOutSub, "", false],
    [t.verdictDelta, delta, t.verdictDeltaSub, delta >= 0 ? "pos" : "neg", true],
    [t.ceiling, ceiling, t.ceilingSub, "dim", false],
  ];

  const axisMax = Math.max(totalIn, ceiling, value) * 1.02;
  const pc = (v) => Math.max(0, Math.min(100, (v / axisMax) * 100));

  /* A small thing to find. The dot carries the same dotted underline the
     glossary terms use, so it reads as "there is something here" without
     saying what; clicking says it. Once found it stays found. */
  const Egg = ({ text }) => {
    const [open, setOpen] = useState(false);
    return (
      <button
        className={"egg" + (open ? " on" : "")}
        onClick={() => setOpen(!open)}
        aria-label={open ? text : "\u2026"}
      >
        {open ? text : "\u00b7\u00b7\u00b7"}
      </button>
    );
  };

  /* Chapter heading: kicker + title, opens each step of the story. */
  const Chapter = ({ kicker, title, body, egg }) => (
    <div className="chap">
      <div className="chap-kicker">{kicker}</div>
      <h2 className="chap-title">
        {title}
        {egg ? <Egg text={egg} /> : null}
      </h2>
      {body.map((p, i) => (
        <p className="chap-lede" key={i}>
          {p}
        </p>
      ))}
    </div>
  );

  /* Detail kept on the page but out of the way: the long-form text that
     used to sit in the flow now lives behind one of these. */
  const Fold = ({ label, children }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className={"fold" + (open ? " on" : "")}>
        <button
          className="fold-head"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <span>{label}</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {open ? <div className="fold-body">{children}</div> : null}
      </div>
    );
  };

  const SecNav = () => (
    <nav className="nav2">
      {[
        ["ov", t.navOverview],
        ["works", t.navWorks],
        ["run", t.navRun],
        ["verdict", t.navVerdict],
        ["plan", t.navPlan],
        ["blockers", t.navBlockers],
        ["concepts", t.navConcepts],
      ].map(([id, lab]) => (
        <button
          key={id}
          className={cur === id ? "cur" : ""}
          aria-current={cur === id}
          onClick={() => {
            const el = document.getElementById("sec-" + id);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          {lab}
        </button>
      ))}
    </nav>
  );

  const Bars = ({ dark }) => (
    <div className={"bx" + (dark ? " dark" : "")} ref={dark ? undefined : graphBarsRef}>
      <div className="bx-row">
        <span className="bx-lab">{dark ? t.balCostShort : t.balCost}</span>
        <span className="bx-track">
          <i className="bx-seg buy" style={{ left: 0, width: pc(price + fees) + "%" }} />
          <i
            className="bx-seg work"
            style={{ left: pc(price + fees) + "%", width: pc(worksCost) + "%" }}
          />
          <i
            className="bx-seg run"
            style={{ left: pc(price + fees + worksCost) + "%", width: pc(runIn) + "%" }}
          />
        </span>
        {!dark ? (
          <span className="bx-num">
            <Money v={totalIn * 1000} />
          </span>
        ) : null}
      </div>

      <div className="bx-row">
        <span className="bx-lab">{dark ? t.balValueShort : t.balValue}</span>
        <span className="bx-track">
          <i className="bx-seg val" style={{ left: 0, width: pc(value) + "%" }} />
          <i
            className={"bx-gap " + (delta >= 0 ? "gain" : "loss")}
            style={{
              left: pc(Math.min(value, totalIn)) + "%",
              width: pc(Math.abs(delta)) + "%",
            }}
          />
          <i className="bx-ceil" style={{ left: pc(ceiling) + "%" }} />
          {!dark ? (
            <i className="bx-tick" style={{ left: pc(500 * growF) + "%" }} />
          ) : null}
        </span>
        {!dark ? (
          <span className="bx-num">
            <Money v={value * 1000} />
          </span>
        ) : null}
      </div>

      {dark ? (
        <>
          <div className="bx-key">
            <span>
              <i className="sw buy" />
              {t.lgBuy}
            </span>
            <span>
              <i className="sw work" />
              {t.lgWork}
            </span>
            <span>
              <i className="sw run" />
              {t.lgRun}
            </span>
            <span>
              <i className="sw val" />
              {t.lgVal}
            </span>
            <span>
              <i className={"sw gap " + (delta >= 0 ? "gain" : "loss")} />
              {t.lgGap}
            </span>
            <span>
              <i className="sw ceil" />
              {t.lgCeil}
            </span>
          </div>
          <em className="bx-hint">{t.bxHint}</em>
        </>
      ) : null}

      {!dark ? (
        <>
          <div className="bx-row">
            <span className="bx-lab">{delta >= 0 ? t.balGain : t.balLoss}</span>
            <span className="bx-axis">
              <span style={{ left: pc(500 * growF) + "%" }}>
                {t.balAsIsShort}
              </span>
              <span style={{ left: pc(ceiling) + "%" }}>{t.balCeilShort}</span>
            </span>
            <span className={"bx-num " + (delta >= 0 ? "good" : "bad")}>
              <Money v={delta * 1000} sign />
            </span>
          </div>
          <div className="legend">
            <span className="lgkey">
              <i className="sw buy" />
              {t.balBuy}
            </span>
            <span className="lgkey">
              <i className="sw work" />
              {t.balWork}
            </span>
            <span className="lgkey">
              <i className="sw run" />
              {t.balRun}
            </span>
            <span className="lgkey">
              <i className="sw val" />
              {t.balValue}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );

  const scale = useMemo(() => {
    const pool = [
      ...MEASURES,
      ...Object.values(SEWER),
      sewerObj,
      ...Object.values(SAUNA),
      REDEEM,
    ];
    return Math.max(
      ...pool.map((m) => Math.max(cost(m), val(m))),
      1
    );
  }, [level, diy, sewerObj]);

  const allBlockers = active.flatMap((m) =>
    (m.blockers[lang] || []).map((b) => ({ b, from: m.name[lang] }))
  );

  const css = `
  .kw *{box-sizing:border-box}
  .kw{
    --ink:#16221B; --ink2:#43524A; --ink3:#7E8C83;
    --paper:#EDEFE8; --card:#F7F8F4; --line:#C9D0C3;
    --skog:#7FA55E; --skog-l:#D7E4C8;
    --red:#B34A44; --red-l:#F1D8D6;
    --ochre:#A8792F; --ochre-l:#F0E3CB;
    background:var(--paper); color:var(--ink);
    -webkit-text-size-adjust:100%; overflow-x:clip;
    font-family:Archivo,'Helvetica Neue',Arial,sans-serif;
    font-size:15px; line-height:1.5; padding:0 0 64px;
  }
  .kw h1,.kw h2,.kw h3{margin:0;font-weight:600;letter-spacing:-0.015em}
  .wrap{max-width:1080px;margin:0 auto;padding:0 20px}
  .prose{font-family:Newsreader,Georgia,serif;font-size:17.5px;line-height:1.62;max-width:66ch}
  .prose p{margin:0 0 0.95em}

  /* hero */
  .hero{border-bottom:2px solid var(--ink)}
  .hero .wrap{position:relative}
  .idline{max-width:74%}
  .kw h1{font-size:clamp(30px,5.6vw,50px);line-height:1.0;letter-spacing:-0.028em}
  .kw .addr{font-size:clamp(15px,1.9vw,18px);font-weight:500;margin-top:11px;
    letter-spacing:-0.01em}
  .kw .sub{font-family:'Archivo Narrow',Archivo,sans-serif;color:var(--ink2);font-size:14px;margin-top:3px}
  /* one floating pill, translucent so it sits over both the light page
     and the dark band without changing weight */
  .langsel{display:inline-flex;align-items:center;gap:1px;border:0;background:none;
    color:#93A697;padding:0 12px 0 13px;border-left:1px solid rgba(255,255,255,.10);
    transition:color .15s,background .15s}
  .langsel select{appearance:none;-webkit-appearance:none;background:none;border:0;
    font:inherit;font-family:'Archivo Narrow',sans-serif;font-size:11.5px;
    letter-spacing:.01em;color:inherit;padding:2px 0;margin:0;cursor:pointer;outline:none}
  .langsel option{color:#16221B;background:#fff}
  .langsel svg{pointer-events:none;flex-shrink:0;opacity:.55}

  .gal{margin:26px 0 0}
  .frame{position:relative;background:var(--ink);overflow:hidden;touch-action:pan-y}
  .frame:focus-visible{outline:2px solid var(--skog);outline-offset:2px}
  .frame{aspect-ratio:1600/1067}
  .frame img{width:100%;height:100%;display:block;object-fit:contain}
  .nav{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:48px;border:0;
    background:rgba(22,34,27,.68);color:#EDEFE8;font:inherit;font-size:17px;cursor:pointer;
    display:flex;align-items:center;justify-content:center}
  .nav.l{left:0} .nav.r{right:0}
  .galfoot{display:flex;gap:18px;align-items:flex-start;justify-content:space-between;padding:9px 2px 0}
  .galcap{font-family:'Archivo Narrow',sans-serif;font-size:12.5px;line-height:1.45;
    color:var(--ink2);max-width:68ch}
  .bars{display:flex;gap:3px;flex-shrink:0;align-items:center;padding-top:4px}
  .bars button{width:22px;height:5px;border:0;padding:0;background:var(--line);cursor:pointer}
  .bars button[aria-current=true]{background:var(--skog)}
  .galcount{font-family:'Archivo Narrow',sans-serif;font-size:12px;color:var(--ink3);
    margin-left:9px;font-variant-numeric:tabular-nums}

  .facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(196px,1fr));
    gap:0;margin:26px 0 0;border-top:1px solid var(--line)}
  .fact{border-bottom:1px solid var(--line);padding:9px 0;display:flex;justify-content:space-between;
    gap:12px;font-family:'Archivo Narrow',sans-serif;font-size:13.5px;padding-right:22px}
  .fact b{font-weight:600}
  .fact span{color:var(--ink2);text-align:right}

  /* verdict */
  .verdict{position:sticky;top:0;height:0;z-index:40}
  /* one clean slide, no cross-fade: the band should read as the same
     element being lifted up by the scroll, not a new one appearing */
  .vinner{position:absolute;top:0;left:0;right:0;background:var(--ink);color:var(--paper)}

  .vbody{overflow:hidden;max-height:0;
    transition:max-height .36s cubic-bezier(.16,1,.3,1)}
  .vbody.on{max-height:340px}
  .vtoggle{font:inherit;font-family:'Archivo Narrow',sans-serif;font-size:11.5px;
    display:inline-flex;align-items:center;gap:4px;background:none;border:0;
    padding:0 13px;border-left:1px solid rgba(255,255,255,.10);
    color:#93A697;cursor:pointer;transition:color .15s,background .15s;white-space:nowrap}
  .vtoggle svg{opacity:.75}

  .vgraph{overflow:hidden;max-height:0;opacity:0;
    transition:max-height .4s cubic-bezier(.16,1,.3,1),opacity .26s ease-out}
  .vgraph.on{max-height:150px;opacity:1;transition:max-height .4s cubic-bezier(.16,1,.3,1),
    opacity .26s ease-out .1s}

  /* full-bleed dark bands: the readout in the flow of the page, styled
     like the pinned bar so scrolling looks like it lifts them up */
  .band{background:var(--ink);color:var(--paper)}
  .figband{padding:20px 0 22px}

  .figures{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
  .fig small{display:block;font-family:'Archivo Narrow',sans-serif;font-size:12px;
    color:#A9B8AC}
  .fnum{font-size:clamp(20px,3.2vw,29px);font-weight:600;letter-spacing:-0.022em;
    font-variant-numeric:tabular-nums;line-height:1.1;margin:2px 0 4px}
  .fnum.pos{color:#B7DC96} .fnum.neg{color:#EFA9A3} .fnum.dim{color:#93A697}
  .funit{font-size:12px;color:#8FA294;margin-left:4px;font-weight:400}
  .fig p{margin:0;font-family:'Archivo Narrow',sans-serif;font-size:11.5px;
    line-height:1.35;color:#8FA294}

  /* full-size bars on the dark band */
  .band .gauge{margin:0;border-top:0;padding-top:0}
  .onink .gauge-title{color:var(--paper);margin-bottom:18px}
  .onink .bx-lab{color:#A9B8AC}
  .onink .bx-track{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.17)}
  .onink .bx-seg.buy{background:#5D7266}
  .onink .bx-seg.work{background:repeating-linear-gradient(45deg,#CE6F68 0 4px,#7A4B47 4px 8px)}
  .onink .bx-seg.run{background:repeating-linear-gradient(45deg,#C2954B 0 3px,#6C5931 3px 6px)}
  .onink .bx-seg.val{background:#8FBF66}
  .onink .bx-gap.loss{color:#EFA9A3;background:rgba(239,169,163,.13)}
  .onink .bx-gap.gain{color:#B7DC96;background:rgba(183,220,150,.13)}
  .onink .bx-ceil{background:#EFEDE4}
  .onink .bx-tick{background:#EFEDE4;opacity:.4}
  .onink .bx-num{color:var(--paper)}
  .onink .bx-num.good{color:#B7DC96} .onink .bx-num.bad{color:#EFA9A3}
  .onink .bx-axis span{color:#8FA294}
  .onink .legend{color:#A9B8AC}
  .onink .lgnote{color:#8FA294}
  .onink .sw.buy{background:#5D7266}
  .onink .sw.work{background:repeating-linear-gradient(45deg,#CE6F68 0 3px,#7A4B47 3px 6px)}
  .onink .sw.run{background:repeating-linear-gradient(45deg,#C2954B 0 3px,#6C5931 3px 6px)}
  .onink .sw.val{background:#8FBF66}
  .onink .gauge-why{color:#C6D6CA}
  .onink .gauge-why b{color:#fff}
  .onink .gauge-foot{color:#8FA294}
  .vrow{display:grid;grid-template-columns:repeat(4,1fr);align-items:start;gap:16px;
    padding:9px 0 7px}
  .vcell{position:relative;outline:none}
  .vcell small{display:block;font-family:'Archivo Narrow',sans-serif;font-size:11px;
    color:#A9B8AC;margin-bottom:0;border-bottom:1px dotted #4A5D51;
    display:inline-block;padding-bottom:1px;cursor:help}
  .vcell em{position:absolute;left:0;top:100%;z-index:30;width:196px;
    background:#0C130F;border:1px solid #33463A;color:#C6D6CA;padding:6px 9px;
    font-family:'Archivo Narrow',sans-serif;font-style:normal;font-size:11.5px;
    line-height:1.35;opacity:0;pointer-events:none;transition:opacity .12s}
  .vnum{font-size:clamp(16px,2.7vw,23px);font-weight:600;letter-spacing:-0.02em;
    font-variant-numeric:tabular-nums;line-height:1.15;margin-top:2px}
  .vunit{font-size:11px;color:#A9B8AC;margin-left:3px;font-weight:400}
  .pos{color:#B7DC96} .neg{color:#EFA9A3} .vnum.dim{color:#93A697}

  /* cost / value bars */
  .bx-row{display:grid;grid-template-columns:150px minmax(0,1fr) 92px;gap:11px;
    align-items:center;margin-bottom:8px}
  .bx-lab{font-family:'Archivo Narrow',sans-serif;font-size:12.5px;color:var(--ink2)}
  .bx-track{position:relative;display:block;height:15px;background:var(--card);
    border:1px solid var(--line)}
  .bx-seg{position:absolute;top:0;bottom:0;display:block;
    transition:left .28s cubic-bezier(.33,1,.68,1),width .28s cubic-bezier(.33,1,.68,1)}
  .bx-seg.buy{background:var(--ink2)}
  .bx-seg.work{background:repeating-linear-gradient(45deg,var(--red) 0 4px,var(--red-l) 4px 8px)}
  .bx-seg.run{background:repeating-linear-gradient(45deg,var(--ochre) 0 3px,var(--ochre-l) 3px 6px)}
  .bx-seg.val{background:var(--skog)}
  .bx-gap{position:absolute;top:0;bottom:0;display:block;
    border-left:1px solid currentColor;border-right:1px solid currentColor;
    transition:left .28s cubic-bezier(.33,1,.68,1),width .28s cubic-bezier(.33,1,.68,1)}
  .bx-gap:before{content:"";position:absolute;top:50%;left:0;right:0;height:1px;
    background:currentColor}
  .bx-gap.loss{color:var(--red);background:rgba(179,74,68,.12)}
  .bx-gap.gain{color:#3F6B27;background:rgba(63,107,39,.12)}
  .bx-ceil{position:absolute;top:-4px;bottom:-4px;width:2px;background:var(--ink);display:block}
  .bx-tick{position:absolute;top:0;bottom:0;width:1px;background:var(--ink);opacity:.5;display:block}
  .bx-num{font-family:'Archivo Narrow',sans-serif;font-size:13.5px;text-align:right;
    font-variant-numeric:tabular-nums;color:var(--ink)}
  .bx-num.good{color:#4E7A33;font-weight:600} .bx-num.bad{color:var(--red);font-weight:600}
  .bx-axis{position:relative;height:14px;display:block}
  .bx-axis span{position:absolute;transform:translateX(-50%);white-space:nowrap;
    font-family:'Archivo Narrow',sans-serif;font-size:10.5px;color:var(--ink3)}
  .sw.buy{background:var(--ink2)}
  .sw.work{background:repeating-linear-gradient(45deg,var(--red) 0 3px,var(--red-l) 3px 6px)}
  .sw.run{background:repeating-linear-gradient(45deg,var(--ochre) 0 3px,var(--ochre-l) 3px 6px)}
  .sw.val{background:var(--skog)}

  .bx.dark{padding:0 0 8px;position:relative}
  .bx.dark .bx-row{grid-template-columns:58px minmax(0,1fr);margin-bottom:4px}
  .bx.dark .bx-lab{font-size:11px;color:#93A697}
  .bx-key{display:flex;flex-wrap:wrap;gap:4px 13px;margin-top:6px}
  .bx-key span{display:inline-flex;align-items:center;gap:5px;
    font-family:'Archivo Narrow',sans-serif;font-size:10.5px;color:#93A697}
  .bx-key .sw{width:13px;height:7px}
  .sw.gap{background:none;border-left:1px solid currentColor;border-right:1px solid currentColor;
    position:relative}
  .sw.gap:before{content:"";position:absolute;top:50%;left:0;right:0;height:1px;
    background:currentColor}
  .sw.gap.loss{color:#EFA9A3} .sw.gap.gain{color:#B7DC96}
  .sw.ceil{background:#EFEDE4;width:3px;height:11px}
  .bx-hint{position:absolute;left:0;bottom:calc(100% + 4px);z-index:30;width:330px;max-width:80vw;
    background:#0C130F;border:1px solid #33463A;color:#C6D6CA;padding:7px 9px;
    font-family:'Archivo Narrow',sans-serif;font-style:normal;font-size:11.5px;
    line-height:1.4;opacity:0;pointer-events:none;transition:opacity .12s}
  .bx.dark .bx-track{height:7px;background:rgba(255,255,255,.13);border:0}
  .bx.dark .bx-seg.buy{background:#5D7266}
  .bx.dark .bx-seg.work{background:repeating-linear-gradient(45deg,#CE6F68 0 4px,#7A4B47 4px 8px)}
  .bx.dark .bx-seg.run{background:repeating-linear-gradient(45deg,#C2954B 0 3px,#6C5931 3px 6px)}
  .bx.dark .bx-seg.val{background:#8FBF66}
  .bx.dark .bx-gap.gain{color:#B7DC96;background:rgba(183,220,150,.14)}
  .bx.dark .bx-gap.loss{color:#EFA9A3;background:rgba(239,169,163,.14)}
  .bx.dark .bx-ceil{background:#EFEDE4;top:-3px;bottom:-3px}

  .resetlink{font:inherit;font-family:'Archivo Narrow',sans-serif;font-size:12px;
    background:none;border:0;border-bottom:1px solid var(--skog);color:var(--ink2);
    padding:0 0 1px;cursor:pointer;margin:-9px 0 15px}

  /* sections */
  /* ---- story chapters ---- */
  .chap{max-width:66ch;margin:0 0 26px}
  .chap-kicker{font-family:'Archivo Narrow',sans-serif;font-size:11.5px;letter-spacing:.14em;
    text-transform:uppercase;color:var(--skog);font-weight:600;margin:0 0 6px}
  /* .kw prefix: without it the .kw h2 margin reset wins on specificity */
  .kw .chap-title{font-size:clamp(22px,3.6vw,30px);line-height:1.15;margin:0 0 14px;
    letter-spacing:-.01em}
  /* Three dots after the year, in the palette's lightest ink so they sit
     just above the paper, resting on the title's baseline like a real
     ellipsis. A button does not baseline-align with surrounding text the way
     a span does, and plain vertical-align:baseline still left them 4px low,
     so the offset is measured: .41em of the dots' own size puts them exactly
     on the line. */
  .egg{font:inherit;font-size:.34em;font-weight:700;vertical-align:.41em;
    margin-left:.5em;padding:0;background:none;border:0;cursor:pointer;
    color:var(--line);line-height:1;letter-spacing:.12em;
    transition:color .15s ease}
  .egg:hover{color:var(--ink3)}
  .egg.on{color:var(--skog);cursor:default;font-size:.4em;
    vertical-align:.7em;letter-spacing:.01em;
    font-family:'Archivo Narrow',sans-serif}
  .egg:focus-visible{outline:2px solid var(--skog);outline-offset:2px;
    border-radius:2px}
  .chap-lede{font-family:Newsreader,Georgia,serif;font-size:18.5px;line-height:1.55;
    margin:0 0 0.7em;color:var(--ink2)}
  .chap-lede:first-of-type{color:var(--ink)}
  /* ---- the question that gates the running-cost box ---- */
  /* The question and the cost box are one panel, not two stacked cards:
     the ask is its header, and the figures continue below the same border. */
  .askwrap{margin:24px 0 0;border:1px solid var(--line);background:var(--card)}
  .ask{display:block;padding:17px 18px;cursor:pointer;transition:background .12s ease}
  .askwrap:not(.on) .ask:hover{background:var(--paper)}
  .ask:has(input:focus-visible){outline:2px solid var(--skog);outline-offset:-2px}
  .askwrap.on .ask{border-bottom:1px solid var(--line)}
  .ask-q{margin:0 0 11px;font-family:Newsreader,Georgia,serif;font-size:18.5px;
    line-height:1.35;color:var(--ink)}
  .ask-opt{display:inline-flex;align-items:center;gap:9px;cursor:pointer;
    font-family:'Archivo Narrow',sans-serif;font-size:14.5px;font-weight:600;color:var(--ink)}
  .ask-opt input{width:17px;height:17px;accent-color:var(--skog);cursor:pointer;flex-shrink:0}
  .ask-note{margin:9px 0 0;font-family:'Archivo Narrow',sans-serif;font-size:12px;
    line-height:1.5;color:var(--ink3);max-width:62ch}
  /* ---- folded detail ---- */
  .fold{border-top:1px solid var(--line);margin:18px 0 0;max-width:66ch}
  .fold-head{display:flex;align-items:center;justify-content:space-between;gap:12px;
    width:100%;background:none;border:0;padding:12px 0;cursor:pointer;color:var(--ink2);
    font:inherit;font-family:'Archivo Narrow',sans-serif;font-size:13.5px;font-weight:600;
    letter-spacing:.01em;text-align:left}
  .fold-head:hover{color:var(--ink)}
  .fold-head svg{flex-shrink:0;opacity:.6}
  .fold.on .fold-head{color:var(--ink)}
  .fold-body{padding:0 0 16px}
  .fold-body .prose{font-size:16.5px}
  .fold-body .prose p:last-child{margin-bottom:0}
  .sec{padding:44px 0 0;scroll-margin-top:96px}
  .band{scroll-margin-top:96px;padding:30px 0 32px;margin:44px 0 0}
  .hero .band{margin:0}
  /* the section nav lives on the dark band, in the page and pinned */
  .nav2{display:flex;flex-wrap:nowrap;margin:0;min-width:0;flex:1 1 auto;overflow-x:auto;
    scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch}
  .nav2::-webkit-scrollbar{display:none}
  .nav2 button{flex-shrink:0;font:inherit;font-family:'Archivo Narrow',sans-serif;font-size:12.5px;
    background:none;border:0;border-right:1px solid rgba(255,255,255,.10);
    padding:9px 14px;cursor:pointer;color:#93A697;
    transition:color .15s,background .15s,box-shadow .15s}
  .nav2 button:last-child{border-right:0}
  .nav2 button.cur{color:#fff;box-shadow:inset 0 -2px 0 var(--skog)}

  .vnums{overflow:hidden;max-height:0;opacity:0;
    transition:max-height .4s cubic-bezier(.16,1,.3,1),opacity .24s ease-out}
  .vnums.on{max-height:130px;opacity:1}
  .vnav{display:flex;align-items:stretch;justify-content:space-between;gap:10px;
    border-top:1px solid rgba(255,255,255,.13);flex-wrap:nowrap;min-width:0;
    touch-action:pan-x}
  .vnav:first-child{border-top:0}
  .vnavright{display:flex;align-items:stretch;flex-shrink:0}

  .plancols{display:grid;grid-template-columns:1.25fr 1fr;gap:34px;align-items:start}
  .planfig{margin:0;background:#fff;border:1px solid var(--line);padding:10px}
  .planfig img{width:100%;display:block}
  .planprose{font-size:16.5px}
  .sec > h2{font-size:20px;margin-bottom:18px}
  .cols{display:grid;grid-template-columns:1.55fr 1fr;gap:38px;align-items:start}

  /* dials */
  .dials{background:var(--card);border:1px solid var(--line);padding:16px 17px}
  .dial{display:block;margin-bottom:17px}
  .dial:last-child{margin-bottom:0}
  .dial-head{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
  .dial-label{font-size:13.5px;font-weight:500}
  .dial-val{font-family:'Archivo Narrow',sans-serif;font-size:13px;color:var(--ink2);
    font-variant-numeric:tabular-nums}
  .dial-note{display:block;font-family:'Archivo Narrow',sans-serif;font-size:11.5px;color:var(--ink3);margin-top:2px}
  /* Sliders are drawn by hand rather than left to accent-color: the native
     control is far heavier than the rest of the page. A hairline track, a
     filled portion in skog, and a small ringed thumb. The filled part is a
     gradient sized from --fill, which Slider sets per dial. */
  .kw input[type=range]{-webkit-appearance:none;appearance:none;
    width:100%;margin:9px 0 0;height:14px;background:none;cursor:pointer;
    touch-action:pan-y;display:block}
  .kw input[type=range]:focus{outline:none}

  /* --- track --- */
  .kw input[type=range]::-webkit-slider-runnable-track{height:3px;border-radius:2px;
    background:linear-gradient(to right,var(--skog) 0 var(--fill,50%),var(--line) var(--fill,50%) 100%)}
  .kw input[type=range]::-moz-range-track{height:3px;border-radius:2px;background:var(--line)}
  .kw input[type=range]::-moz-range-progress{height:3px;border-radius:2px;background:var(--skog)}

  /* --- thumb --- */
  .kw input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:13px;height:13px;margin-top:-5px;border-radius:50%;
    background:var(--paper);border:2px solid var(--skog);
    transition:transform .12s ease,border-color .12s ease}
  .kw input[type=range]::-moz-range-thumb{width:13px;height:13px;border-radius:50%;
    background:var(--paper);border:2px solid var(--skog);
    transition:transform .12s ease,border-color .12s ease}
  .kw input[type=range]:hover::-webkit-slider-thumb{transform:scale(1.18)}
  .kw input[type=range]:hover::-moz-range-thumb{transform:scale(1.18)}
  .kw input[type=range]:active::-webkit-slider-thumb{transform:scale(1.18);background:var(--skog)}
  .kw input[type=range]:active::-moz-range-thumb{transform:scale(1.18);background:var(--skog)}
  .kw input[type=range]:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 3px var(--skog-l)}
  .kw input[type=range]:focus-visible::-moz-range-thumb{box-shadow:0 0 0 3px var(--skog-l)}

  /* a dial still following the works reads grey: it is a derived value,
     not something you have set yourself */
  .dial.auto input[type=range]::-webkit-slider-runnable-track{
    background:linear-gradient(to right,var(--ink3) 0 var(--fill,50%),var(--line) var(--fill,50%) 100%)}
  .dial.auto input[type=range]::-moz-range-progress{background:var(--ink3)}
  .dial.auto input[type=range]::-webkit-slider-thumb{border-color:var(--ink3)}
  .dial.auto input[type=range]::-moz-range-thumb{border-color:var(--ink3)}
  .dial.auto input[type=range]:active::-webkit-slider-thumb{background:var(--ink3)}
  .dial.auto input[type=range]:active::-moz-range-thumb{background:var(--ink3)}
  .dial.auto .dial-val{color:var(--ink3)}

  /* ledger */
  .ledger{border-top:2px solid var(--ink)}
  .lrow{border-bottom:1px solid var(--line)}
  .lhead{display:grid;grid-template-columns:26px minmax(0,1fr) 300px 24px;gap:12px;
    align-items:center;padding:12px 0;cursor:pointer}
  .kw input[type=checkbox]{width:15px;height:15px;accent-color:var(--skog);cursor:pointer}
  /* inline like the span it replaces, so nothing shifts for a mouse */
  .lcheck{cursor:pointer}
  .lname{font-size:14.5px;font-weight:500;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .tag{font-family:'Archivo Narrow',sans-serif;font-size:11px;padding:1px 6px;border:1px solid}
  .tag.tg3{color:var(--red);border-color:var(--red);background:var(--red-l)}
  .tag.tg2{color:var(--ochre);border-color:var(--ochre);background:var(--ochre-l)}
  .tag.legal{color:#3B5B7A;border-color:#3B5B7A;background:#DCE6EF}
  .tag.opt{color:var(--ink2);border-color:var(--line);background:transparent}
  .bcount{font-family:'Archivo Narrow',sans-serif;font-size:11px;color:var(--red)}
  .num{font-family:'Archivo Narrow',sans-serif;font-size:13.5px;
    font-variant-numeric:tabular-nums;color:var(--ink3)}

  .metrics{display:grid;grid-template-columns:58px 1fr 58px 62px;gap:7px;align-items:center;
    opacity:.5}
  .metrics.on{opacity:1}
  .metrics .num.c{text-align:right;color:var(--red)}
  .metrics .num.v{text-align:left;color:#5F8A42}
  .metrics.on .num.c{color:var(--red)}
  .metrics .num.n{text-align:right;font-family:Archivo,sans-serif;font-size:13.5px;
    font-weight:600;letter-spacing:-0.01em}
  .metrics .num.n.good{color:#4E7A33}
  .metrics .num.n.bad{color:var(--red)}

  .bal{display:grid;grid-template-columns:1fr 1px 1fr;align-items:center;height:15px}
  .bal-side{height:9px;display:flex;overflow:hidden}
  .bal-side.l{justify-content:flex-end;background:linear-gradient(var(--red-l),var(--red-l))}
  .bal-side.r{justify-content:flex-start;background:var(--skog-l)}
  .bal-side i{display:block;height:100%;transition:width .18s ease-out}
  .bal-side.l i{background:var(--red)}
  .bal-side.r i{background:var(--skog)}
  .bal-axis{height:15px;background:var(--ink)}

  .legend{display:flex;flex-wrap:wrap;align-items:baseline;gap:16px;margin:0 0 9px;
    font-family:'Archivo Narrow',sans-serif;font-size:12px;color:var(--ink2)}
  .lgkey{display:inline-flex;align-items:center;gap:6px}
  .sw{width:16px;height:8px;display:inline-block}
  .sw.c{background:var(--red)} .sw.v{background:var(--skog)}
  .lgnote{color:var(--ink3);flex:1;min-width:200px}

  .chev{color:var(--ink3);display:flex;align-items:center;justify-content:center;user-select:none}
  .lbody{padding:0 0 16px 36px;max-width:74ch}
  .lbody p{margin:0 0 10px;font-size:14px;color:var(--ink2);line-height:1.55}
  .blist{margin:0;padding:0;list-style:none}
  .blist li{font-size:13.5px;line-height:1.5;padding:5px 0 5px 15px;position:relative;color:var(--ink)}
  .blist li:before{content:"";position:absolute;left:0;top:11px;width:6px;height:6px;background:var(--red)}
  .bhead{font-family:'Archivo Narrow',sans-serif;font-size:11.5px;color:var(--red);
    margin:2px 0 2px;font-weight:600}

  /* A choose-one list rather than a segmented bar. The old version put the
     options in a wrapping flex row, which broke as soon as a label was long
     or the language changed: the row split 2+1, the cells came out uneven,
     and the button ending the first row kept a dangling divider. Rows stack
     instead, so any label length works at any width in any language. */
  .seg{display:flex;flex-direction:column;border:1px solid var(--line);
    border-radius:3px;overflow:hidden;margin:0 0 4px;background:var(--card)}
  .seg button{font:inherit;font-size:13.5px;text-align:left;padding:10px 13px;
    background:none;border:0;border-top:1px solid var(--line);cursor:pointer;
    color:var(--ink2);display:flex;align-items:center;gap:10px;width:100%;
    transition:background .12s ease,color .12s ease}
  .seg button:first-child{border-top:0}
  .seg button:hover{background:var(--paper);color:var(--ink)}
  /* the mark is drawn with a pseudo-element so the label never shifts */
  .seg button::before{content:"";flex-shrink:0;width:13px;height:13px;
    border-radius:50%;border:1.5px solid var(--line);background:var(--paper);
    transition:border-color .12s ease,box-shadow .12s ease}
  .seg button[aria-pressed=true]{background:var(--skog-l);color:var(--ink);font-weight:600}
  .seg button[aria-pressed=true]::before{border-color:var(--skog);
    box-shadow:inset 0 0 0 3px var(--skog)}
  .seg button:focus-visible{outline:2px solid var(--skog);outline-offset:-2px}
  .seglabel{font-family:'Archivo Narrow',sans-serif;font-size:11.5px;color:var(--ink3);margin:14px 0 5px}
  /* The per-night figure. Deliberately not on the dark ground: in this page
     dark means the pinned bar, and a second dark block in the flow would read
     as something that had come loose from it. A green edge instead. */
  .pernight{margin:22px 0 0;background:var(--card);border:1px solid var(--line);
    border-left:3px solid var(--skog);border-radius:3px;padding:18px 20px 17px}
  .pn-head h3{margin:0 0 4px;font-size:17px;letter-spacing:-.005em;color:var(--ink)}
  .pn-lead{margin:0 0 14px;font-family:'Archivo Narrow',sans-serif;font-size:13px;
    color:var(--ink3)}
  /* the dial sits above the rows; .pn-rows draws the rule between them, so
     this one has none of its own or the two stack into a double line */
  .pn-dial{margin:0 0 13px}
  .pn-dial .dial{margin-bottom:0}
  .pn-rows{border-top:1px solid var(--line)}
  .pn-row{display:flex;justify-content:space-between;gap:14px;padding:7px 0;
    border-bottom:1px solid var(--line);
    font-family:'Archivo Narrow',sans-serif;font-size:13.5px;
    font-variant-numeric:tabular-nums;color:var(--ink2)}
  /* marks a running cost the envelope work brought down */
  .runrow em.cut{color:var(--skog);font-weight:600}
  .pn-row.nil{color:var(--ink3)}
  /* a line can come out negative when the cabin gains value: that is a gain,
     not a mistake, so it reads green rather than looking like a broken sum */
  .pn-row.gain > span:last-child{color:var(--skog)}
  /* the label may wrap, the amount never: a broken figure is unreadable */
  .pn-row > span:last-child{white-space:nowrap;flex-shrink:0}
  .pn-row.tot{border-bottom:0;border-top:1.5px solid var(--ink);
    margin-top:4px;padding-top:9px;font-weight:600;font-family:Archivo,sans-serif;
    color:var(--ink)}
  .pn-big{display:flex;align-items:baseline;gap:9px;margin:15px 0 0}
  .pn-big strong{font-size:clamp(30px,6vw,42px);line-height:1;font-weight:700;
    letter-spacing:-.02em;font-variant-numeric:tabular-nums;color:var(--ink)}
  .pn-unit{font-size:.45em;font-weight:500;margin-left:3px;color:var(--ink3)}
  .pn-big em{font-style:normal;font-family:'Archivo Narrow',sans-serif;
    font-size:14px;color:var(--ink2)}
  .pn-note{margin:12px 0 0;font-family:'Archivo Narrow',sans-serif;font-size:12.5px;
    line-height:1.55;color:var(--ink3);max-width:62ch}

  /* handed over to the pinned bar: invisible and inert, box preserved */
  .handover{transition:opacity .22s ease-out}
  .handover.gone{opacity:0;pointer-events:none}


  .runbox{background:none;border:0;padding:16px 18px 15px}
  .runrow{display:flex;justify-content:space-between;font-family:'Archivo Narrow',sans-serif;
    font-size:13.5px;padding:5px 0;border-bottom:1px solid var(--line);font-variant-numeric:tabular-nums}
  .runrow.tot{border-bottom:0;border-top:1.5px solid var(--ink);font-weight:600;
    font-family:Archivo,sans-serif;margin-top:5px;padding-top:8px}
  .runrow em{font-style:normal;color:var(--ink3);font-size:11.5px;margin-left:6px}
  .runrow.off{color:var(--ink3)}
  .runrow.off span{text-decoration:line-through;text-decoration-color:var(--ink3)}
  .runrow.off em{text-decoration:none;display:inline-block}
  .rungrp{display:flex;justify-content:space-between;gap:12px;
    font-family:'Archivo Narrow',sans-serif;font-size:11px;color:var(--ink3);
    margin:12px 0 3px;padding-bottom:2px}
  .rundials{margin-top:0}
  .rundials .dial:last-of-type{margin-bottom:2px}
  .rungrp:first-child{margin-top:0}
  .runtoggle{display:flex;gap:8px;align-items:flex-start;margin:9px 0 2px;cursor:pointer}
  .runtoggle input{margin-top:2px;flex-shrink:0}
  .runtoggle span{font-family:'Archivo Narrow',sans-serif;font-size:12.5px;color:var(--ink2)}
  .runtoggle em{display:block;font-style:normal;font-size:11px;line-height:1.35;
    color:var(--ink3);margin:2px 0 0}

  .gauge{margin-top:20px;border-top:1px solid var(--line);padding-top:14px}
  .gauge-title{font-size:13.5px;font-weight:500;margin-bottom:22px}
  .gauge-track{position:relative}
  .gauge-rail{display:block;position:relative;height:12px;background:var(--card);
    border:1px solid var(--line);overflow:hidden}
  .gauge-fill{position:absolute;left:0;top:0;bottom:0;background:var(--skog);
    transition:width .2s ease-out}
  .gauge-tick{position:absolute;top:0;bottom:0;width:1px;background:var(--ink);opacity:.55}
  .gauge-flag{position:absolute;bottom:16px;transform:translateX(-50%);white-space:nowrap;
    font-family:Archivo,sans-serif;font-size:13px;font-weight:600;color:var(--ink);
    font-variant-numeric:tabular-nums;transition:left .2s ease-out}
  .gauge-flag:after{content:"";position:absolute;left:50%;bottom:-7px;width:1px;height:6px;
    background:var(--ink)}
  .gauge-scale{position:relative;height:15px;margin-top:4px}
  .gauge-scale span{position:absolute;transform:translateX(-50%);white-space:nowrap;
    font-family:'Archivo Narrow',sans-serif;font-size:11px;color:var(--ink3)}
  .gauge-ends{display:flex;justify-content:space-between;
    font-family:'Archivo Narrow',sans-serif;font-size:11.5px;color:var(--ink2);margin-top:-1px}
  .gauge-why{margin:11px 0 0;font-family:'Archivo Narrow',sans-serif;font-size:12.5px;
    line-height:1.45;color:var(--ink2)}
  .gauge-why b{font-weight:600;color:var(--ink)}
  .gauge-foot{margin:7px 0 0;font-family:'Archivo Narrow',sans-serif;font-size:11.5px;
    line-height:1.4;color:var(--ink3)}

  .todos{columns:2;column-gap:34px}
  .todos li{break-inside:avoid;margin-bottom:9px}
  .todos .src{font-family:'Archivo Narrow',sans-serif;font-size:11px;color:var(--ink3);display:block}

  .ghead{display:grid;grid-template-columns:minmax(0,1fr) 24px;gap:12px;align-items:center;
    padding:13px 0;cursor:pointer}
  .gterm{font-size:15.5px;font-weight:500}
  .gbody{padding:0 26px 18px 0}
  .gbody p{margin:0 0 0.85em;font-family:Newsreader,Georgia,serif;font-size:16.5px;
    line-height:1.6;color:var(--ink);max-width:70ch}
  .gbody p:last-child{margin-bottom:0}
  .maprow{margin:12px 0 0;font-family:'Archivo Narrow',sans-serif;font-size:13px}
  .maprow + .maprow{margin-top:7px}
  .maprow a{color:var(--ink);text-decoration:none;border-bottom:1.5px solid var(--skog);
    padding-bottom:1px}
  .maprow span{color:var(--ink3);margin-left:10px;font-variant-numeric:tabular-nums}

  .notes{margin-top:44px;border-top:1px solid var(--line);padding-top:14px;
    font-family:'Archivo Narrow',sans-serif;font-size:12.5px;color:var(--ink3);max-width:80ch}
  .notes p{margin:0 0 7px}

  .vcell:focus em,.vcell:focus-within em{opacity:1}

  /* A tap leaves :hover stuck on touch screens, so keep every hover
     style behind a real pointer. */
  @media (hover:hover) and (pointer:fine){
    .langsel:hover{background:rgba(255,255,255,.07);color:var(--paper)}
    .langsel:hover svg{opacity:.85}
    .nav:hover{background:var(--ink)}
    .vtoggle:hover{color:var(--paper);background:rgba(255,255,255,.07)}
    .bx.dark:hover .bx-hint{opacity:1}
    .resetlink:hover{color:var(--ink)}
    .nav2 button:hover{color:var(--paper);background:rgba(255,255,255,.07)}
    .lhead:hover{background:rgba(127,165,94,.09)}
    .ghead:hover{background:rgba(127,165,94,.09)}
    .maprow a:hover{background:var(--skog-l)}
    .vcell:hover em{opacity:1}
  }

  @media (max-width:820px){
    .wrap{padding:0 16px}
    .nav2{mask-image:linear-gradient(to right,#000 calc(100% - 20px),transparent);
      -webkit-mask-image:linear-gradient(to right,#000 calc(100% - 20px),transparent)}
    .nav2 button{padding:11px 11px}
    .langsel{padding:0 10px 0 11px}
    .vtoggle{padding:0 11px}
    .vtoggle span,.vtoggle{white-space:nowrap}
    .vnums.on{max-height:190px}
    .vgraph.on{max-height:210px}
    .vbody.on{max-height:470px}
    .vnum{font-size:19px}
    .vcell small{font-size:10.5px}
    .prose{font-size:16.5px}
    .kw h1{font-size:clamp(26px,8vw,34px)}
    /* bigger touch target; the thumb keeps its size and stays centred */
    .kw input[type=range]{height:26px}
    .kw input[type=range]::-webkit-slider-thumb{width:15px;height:15px;margin-top:-6px}
    .kw input[type=range]::-moz-range-thumb{width:15px;height:15px}
    .dial{margin-bottom:20px}
    .fnum{font-size:23px}
    .planfig{padding:6px}
    .runrow{font-size:13px}
    .bx-num{font-size:13px}
    .cols{grid-template-columns:1fr;gap:26px}
    .pernight{padding:17px 16px 15px}
    .pn-row{font-size:12.5px}
    .chap-lede{font-size:17px}
    .chap{margin-bottom:22px}
    .plancols{grid-template-columns:1fr;gap:22px}


    .idline{max-width:100%;padding-right:104px}
    .vrow{padding-right:96px}



    .galfoot{flex-direction:column;gap:8px}
    .figures{grid-template-columns:1fr 1fr;gap:16px}
    .band{padding:22px 0 24px;margin-top:30px}
    .vrow{grid-template-columns:1fr 1fr;gap:9px 12px}
    .vcell em{width:150px}
    .bx-row{grid-template-columns:1fr;gap:4px;margin-bottom:11px}
    .bx.dark .bx-row{grid-template-columns:46px minmax(0,1fr);gap:8px;margin-bottom:4px}
    .bx-key{gap:3px 10px}
    .bx-lab{font-size:11.5px}
    .bx-num{text-align:left}
    .lhead{grid-template-columns:22px minmax(0,1fr) 22px;gap:9px;row-gap:8px}
    .metrics{grid-column:2 / 3;grid-row:2;grid-template-columns:54px 1fr 54px 58px;gap:6px}
    .legend{font-size:11.5px;gap:12px}
    .lgnote{min-width:100%}
    .todos{columns:1}
    .lbody{padding-left:22px}
  }
  @media (max-width:430px){
    .figures{grid-template-columns:1fr 1fr;gap:12px}
    .vrow{gap:7px 10px}
    .fig p{font-size:11px}
    .nav2 button{padding:11px 9px;font-size:11.5px}
    .langsel select{font-size:11px}
    .vtoggle{font-size:11px}
    .bars button{width:16px}
    .nav svg{width:18px;height:18px}
    .metrics{grid-template-columns:50px 1fr 50px 54px;gap:5px}
    .num{font-size:12.5px}
  }

  /* On a touch screen the hit area decides whether a dial is usable at all.
     The band was 26px — narrower than a fingertip — and a miss lands on the
     label, where a drag scrolls the page instead of moving the value. Give
     the input a 44px band that reaches down over the note, with a z-index so
     it wins the hit test there, and pull the bottom margin back in by the
     same amount: the track stays where it was drawn and the dial keeps its
     height. touch-action:none stops the browser claiming a slightly wobbly
     drag as a scroll; the head and note rows are still there to scroll from. */
  @media (pointer:coarse){
    .kw input[type=range]{height:44px;margin:0 0 -9px;
      position:relative;z-index:1;touch-action:none}

    /* The ledger checkbox has no text of its own to hit: the name beside it
       opens the row instead, so the 15px box was the entire tap target. The
       label around it stretches over the row's vertical padding and into the
       gutter, which costs no layout, and carries a 44px floor. */
    .lcheck{display:flex;align-items:center;justify-content:center;
      align-self:stretch;min-height:44px;
      margin:-12px -9px -12px 0;padding-right:9px}

    /* Wide but thin; give it a fingertip's worth of height either side. */
    .ask-opt{padding:9px 0;margin:-9px 0}
  }

  @media (prefers-reduced-motion:reduce){
    .kw *{transition:none!important;animation:none!important}
    .vinner{transform:none;top:0}
    .vinner:not(.on){display:none}
    .vgraph{max-height:none}
    .vgraph:not(.on){display:none}
  }
  `;

  const Row = ({ m, keyId, checked, onToggle, showCheck }) => {
    const isOpen = openRow === keyId;
    const bl = m.blockers?.[lang] || [];
    return (
      <div className="lrow">
        <div
          className="lhead"
          onClick={() => setOpenRow(isOpen ? null : keyId)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpenRow(isOpen ? null : keyId);
            }
          }}
        >
          <label className="lcheck" onClick={(e) => e.stopPropagation()}>
            {showCheck ? (
              <input type="checkbox" checked={checked} onChange={onToggle} />
            ) : null}
          </label>
          <span className="lname">
            {m.name[lang]}
            {m.tag ? <i className={"tag " + m.tag}>{t.tgLabel[m.tag]}</i> : null}
            {bl.length ? <i className="bcount">{bl.length} {t.blockers}</i> : null}
          </span>
          <span className={"metrics" + (checked ? " on" : "")}>
            <span className="num c">
              <Money v={cost(m) * 1000} />
            </span>
            <span className="bal">
              <span className="bal-side l">
                <i style={{ width: (cost(m) / scale) * 100 + "%" }} />
              </span>
              <span className="bal-axis" />
              <span className="bal-side r">
                <i style={{ width: (val(m) / scale) * 100 + "%" }} />
              </span>
            </span>
            <span className="num v">
              <Money v={val(m) * 1000} />
            </span>
            <span
              className={
                "num n " + (val(m) - cost(m) >= 0 ? "good" : "bad")
              }
            >
              <Money v={(val(m) - cost(m)) * 1000} sign />
            </span>
          </span>
          <span className="chev">
            {isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </span>
        </div>
        {isOpen ? (
          <div className="lbody">
            {m.desc[lang] ? <p>{m.desc[lang]}</p> : null}
            {bl.length ? (
              <>
                <div className="bhead">{t.blockersTitle}</div>
                <ul className="blist">
                  {bl.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="kw">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Archivo+Narrow:wght@400;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap');`}</style>
      <style>{css}</style>

      <div className="verdict">
        <div className="vinner">
          <div className="wrap">
            <div className={"vbody" + (collapsed ? "" : " on")}>
            <div className={"vnums" + (showNums ? " on" : "")}>
            <div className="vrow">
              {figs.map(([lab, num, tip, cls, sign]) => (
                <div className="vcell" key={lab} tabIndex={showNums && !collapsed ? 0 : -1}>
                  <small>{lab}</small>
                  <div className={"vnum " + cls}>
                    <Money v={num * 1000} sign={sign} />
                    <span className="vunit">kr</span>
                  </div>
                  <em>{tip}</em>
                </div>
              ))}
            </div>
            </div>
            <div className={"vgraph" + (showGraph ? " on" : "")}>
              <Bars dark />
            </div>
            </div>

            <div
              className="vnav"
              ref={navRowRef}
              onTouchStart={(e) => {
                const t = e.touches[0];
                barSwipe.current = { x: t.clientX, y: t.clientY, at: Date.now() };
              }}
              onTouchEnd={(e) => {
                const a = barSwipe.current;
                barSwipe.current = null;
                if (!a || (!showNums && !showGraph)) return;
                const t = e.changedTouches[0];
                const dy = t.clientY - a.y;
                const dx = t.clientX - a.x;
                if (
                  Math.abs(dy) > 28 &&
                  Math.abs(dy) > Math.abs(dx) * 1.3 &&
                  Date.now() - a.at < 900
                ) {
                  setCollapsed(dy < 0);
                }
              }}
            >
              <SecNav />
              <div className="vnavright">
                <div className="langsel">
                  <select
                    value={lang}
                    onChange={(e) => switchLang(e.target.value)}
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
                {showNums || showGraph ? (
                  <button
                    className="vtoggle"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-expanded={!collapsed}
                  >
                    {collapsed ? t.unfold : t.fold}
                    {collapsed ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronUp size={14} />
                    )}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="hero" style={{ paddingTop: navH + 30 }}>
        <div className="wrap">
          <div className="idline">
            <div>
              <h1>{t.pageTitle}</h1>
              <div className="addr">{t.addr}</div>
              <div className="sub">{t.sub}</div>
            </div>
          </div>

          <div className="gal">
            <div
              className="frame"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") step(-1);
                if (e.key === "ArrowRight") step(1);
              }}
              onTouchStart={(e) => {
                const t = e.touches[0];
                swipe.current = { x: t.clientX, y: t.clientY, at: Date.now() };
              }}
              onTouchEnd={(e) => {
                const a = swipe.current;
                swipe.current = null;
                if (!a) return;
                const t = e.changedTouches[0];
                const dx = t.clientX - a.x;
                const dy = t.clientY - a.y;
                /* horizontal, decisive, and not a slow drag while scrolling */
                if (
                  Math.abs(dx) > 40 &&
                  Math.abs(dx) > Math.abs(dy) * 1.4 &&
                  Date.now() - a.at < 900
                ) {
                  step(dx < 0 ? 1 : -1);
                }
              }}
            >
              <img src={IMG[SHOTS[slide]]} alt={t.photoCaps[slide]} />
              <button
                className="nav l"
                aria-label={t.prev}
                onClick={() => step(-1)}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="nav r"
                aria-label={t.next}
                onClick={() => step(1)}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="galfoot">
              <p className="galcap">{t.photoCaps[slide]}</p>
              <div className="bars">
                {SHOTS.map((k, i) => (
                  <button
                    key={k}
                    aria-current={i === slide}
                    aria-label={String(i + 1)}
                    onClick={() => setSlide(i)}
                  />
                ))}
                <span className="galcount">
                  {slide + 1} / {SHOTS.length}
                </span>
              </div>
            </div>
          </div>

          <div className="facts">
            {t.facts.map(([k, v]) => (
              <div className="fact" key={k}>
                <b>{k}</b>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <div className="maprow">
            <a
              href="https://www.google.com/maps/search/?api=1&query=59.661221,11.068637"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.mapLink}
            </a>
            <span>59.6612° N, 11.0686° E</span>
          </div>
          <div className="maprow">
            <a
              href={FINN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.finnLink}
            </a>
            <span>{t.finnMeta}</span>
          </div>
          <div className="maprow">
            <a
              href="https://gardskart.nibio.no/landbrukseiendom/3118/418/5/0"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.farmLink}
            </a>
            <span>{t.farmMeta}</span>
          </div>
          <div className="maprow">
            <a href={PROSPECT} download>
              {t.prospectLink}
            </a>
            <span>{t.prospectMeta}</span>
          </div>
          <div style={{ height: 24 }} />
        </div>

        <div className="band figband">
          <div className="wrap">
            <div className="figures" ref={numsRef}>
              {figs.map(([lab, num, sub, cls, sign]) => (
                <div className="fig" key={lab}>
                  <small>{lab}</small>
                  <div className={"fnum " + cls}>
                    <Money v={num * 1000} sign={sign} />
                    <span className="funit">kr</span>
                  </div>
                  <p>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="wrap">
        <section className="sec" id="sec-ov">
          <Chapter
            kicker={t.story.ch1kicker}
            title={t.story.ch1title}
            body={t.story.ch1body}
            egg={t.story.ch1egg}
          />
          <Fold label={t.story.ch1more}>
            <div className="prose">
              {t.pitch.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Fold>
          <div className="cols" style={{ marginTop: 30 }}>
            <div>
              <div className="dials">
                <Slider
                  label={t.price}
                  note={t.priceNote}
                  value={price}
                  min={400}
                  max={900}
                  step={10}
                  onChange={setPrice}
                  display={<><Money v={price * 1000} /> kr</>}
                />
                <Slider
                  label={t.level}
                  note={t.levelNote}
                  value={level}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={setLevel}
                  display={
                    level < 0.25 ? t.levelLo : level > 0.75 ? t.levelHi : t.levelMid
                  }
                />
                <Slider
                  label={t.diy}
                  note={t.diyNote}
                  value={diy}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={setDiy}
                  display={Math.round(diy * 100) + "%"}
                />
                <Slider
                  label={t.years}
                  note={t.yearsNote}
                  value={years}
                  min={1}
                  max={50}
                  step={1}
                  onChange={setYears}
                  display={years + " " + t.yearsUnit}
                />
                <Slider
                  label={t.rate}
                  note={t.rateNote}
                  value={rate}
                  min={0}
                  max={6}
                  step={0.5}
                  onChange={setRate}
                  display={rate.toFixed(1) + " %"}
                />
                <Slider
                  label={t.growth}
                  note={t.growthNote}
                  value={growth}
                  min={-1}
                  max={3}
                  step={0.25}
                  onChange={setGrowth}
                  display={(growth > 0 ? "+" : "") + growth.toFixed(2) + " %"}
                />
              </div>
            </div>
          </div>

        </section>
      </div>

      {/* Once the pinned bar has taken the graph over, the copy in the page
          would sit right under it showing the same thing. Fade it out but
          keep its box: the element is the scroll anchor the trigger measures,
          so collapsing it would move the page under the reader. */}
      <div className="band" ref={graphRef}>
        <div
          className={"wrap handover" + (showGraph ? " gone" : "")}
          aria-hidden={showGraph}
        >
          <div className="gauge onink">
            <div className="gauge-title">{t.balTitle}</div>
            <Bars />
            <p className="gauge-why">
              {t.ceilWhy[sewer]}
              {redeem ? t.ceilWhyRedeem : ""}{" "}
              <b>
                {value >= ceiling
                  ? t.gaugeFull
                  : t.gaugeHead(fmt((ceiling - value) * 1000))}
              </b>
            </p>
            <p className="gauge-foot">{t.ceilingNote}</p>
          </div>
        </div>
      </div>

      <div className="wrap">
        <section className="sec" id="sec-works">
          <Chapter
            kicker={t.story.ch2kicker}
            title={t.story.ch2title}
            body={t.story.ch2body}
          />
          <div className="legend">
            <span className="lgkey">
              <i className="sw c" />
              {t.mCost}
            </span>
            <span className="lgkey">
              <i className="sw v" />
              {t.mValue}
            </span>
            <span className="lgnote">{t.mNetNote}</span>
          </div>
          <div className="ledger">
            {MEASURES.map((m) => (
              <Row
                key={m.id}
                m={m}
                keyId={m.id}
                showCheck
                checked={!!sel[m.id]}
                onToggle={() => setSel({ ...sel, [m.id]: !sel[m.id] })}
              />
            ))}
          </div>

          <div className="seglabel">
            {lang === "no" ? "Avløp" : lang === "en" ? "Wastewater" : "Scarichi"}{" ("}
            {t.exclusive.toLowerCase()}
            {")"}
          </div>
          <div className="seg" role="radiogroup">
            {["none", "grey", "full"].map((k) => (
              <button
                key={k}
                role="radio"
                aria-checked={sewer === k}
                aria-pressed={sewer === k}
                onClick={() => setSewer(k)}
              >
                {SEWER[k].name[lang]}
              </button>
            ))}
          </div>
          {sewer === "full" ? (
            <div className="runbox" style={{ margin: "12px 0 4px" }}>
              <Slider
                label={t.cabins}
                note={t.cabinsNote}
                value={cabins}
                min={1}
                max={18}
                step={1}
                onChange={setCabins}
                display={cabins === 1 ? t.cabinsAlone : cabins}
              />
              <div style={{ marginTop: 13 }}>
                <div className="runrow">
                  <span>{t.splitFixed}</span>
                  <span>{fmt(lerp(FULL_FIXED[0], FULL_FIXED[1], level) * 1000)}</span>
                </div>
                <div className="runrow">
                  <span>{t.splitTrench}</span>
                  <span>
                    {fmt(
                      (lerp(FULL_TRENCH[0], FULL_TRENCH[1], level) / cabins) * 1000
                    )}
                  </span>
                </div>
                <div className="runrow tot">
                  <span>{t.splitPer}</span>
                  <span>
                    {fmt(
                      (lerp(FULL_FIXED[0], FULL_FIXED[1], level) +
                        lerp(FULL_TRENCH[0], FULL_TRENCH[1], level) / cabins) *
                        1000
                    )}
                  </span>
                </div>
              </div>
              <p className="gauge-foot">{t.splitNote}</p>
            </div>
          ) : null}
          <div className="ledger" style={{ borderTop: "1px solid var(--line)" }}>
            <Row m={{ ...sewerObj, tag: "legal" }} keyId="sewer" checked={sewer !== "none"} showCheck={false} />
          </div>

          <div className="seglabel">
            {lang === "no" ? "Badstu i annekset" : lang === "en" ? "Sauna in the annex" : "Sauna nell’annesso"}{" ("}
            {t.exclusive.toLowerCase()}
            {")"}
          </div>
          <div className="seg" role="radiogroup">
            {["none", "el", "ved"].map((k) => (
              <button
                key={k}
                role="radio"
                aria-checked={sauna === k}
                aria-pressed={sauna === k}
                onClick={() => setSauna(k)}
              >
                {SAUNA[k].name[lang]}
              </button>
            ))}
          </div>
          {sauna !== "none" ? (
            <div className="ledger" style={{ borderTop: "1px solid var(--line)" }}>
              <Row
                m={{ ...SAUNA[sauna], tag: "opt" }}
                keyId="sauna"
                checked
                showCheck={false}
              />
            </div>
          ) : null}

          <div className="seglabel">
            {lang === "no" ? "Tomta" : lang === "en" ? "The land" : "Il terreno"}
          </div>
          <div className="ledger" style={{ borderTop: "1px solid var(--line)" }}>
            <Row
              m={{ ...REDEEM, tag: "opt" }}
              keyId="redeem"
              showCheck
              checked={redeem}
              onToggle={() => setRedeem(!redeem)}
            />
          </div>
        </section>

        <section className="sec" id="sec-run">
          <Chapter
            kicker={t.story.ch3kicker}
            title={t.story.ch3title}
            body={t.story.ch3body}
          />
          <div className={"askwrap" + (inclRun ? " on" : "")}>
            {/* the whole card is the control, so the question itself is the
                hit area rather than just the box next to the answer */}
            <label className="ask">
              <p className="ask-q">{t.story.ch3ask}</p>
              <span className="ask-opt">
                <input
                  type="checkbox"
                  checked={inclRun}
                  onChange={() => setInclRun(!inclRun)}
                />
                <span>{t.story.ch3askYes}</span>
              </span>
              <p className="ask-note">{t.runIncludeNote}</p>
            </label>

            {inclRun ? (
              <div className="runbox">
                <div className="rundials">
                <Slider
                  label={t.usage}
                  note={t.usageNote}
                  value={usage}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={setUsage}
                  display={
                    t.usageBuckets[Math.min(4, Math.floor(usage * 4.999))] +
                    " · " +
                    nights +
                    " " +
                    t.nightsUnit
                  }
                />
                <Slider
                  label={t.maint}
                  note={t.maintNote}
                  value={maint}
                  min={0}
                  max={22}
                  step={0.5}
                  onChange={setMaintManual}
                  auto={maintManual === null}
                  display={
                    maintBucket +
                    " · " +
                    fmt(maint * 1000) +
                    " " +
                    t.perYearShort +
                    (maintManual === null ? " · " + t.maintAuto : "")
                  }
                />
                {maintManual !== null ? (
                  <button className="resetlink" onClick={() => setMaintManual(null)}>
                    {t.maintReset}
                  </button>
                ) : null}
                </div>

                <div className="rungrp">
                  <span>{t.grpFixed}</span>
                  <span>{t.perYearUnit}</span>
                </div>
                {t.runningItems.map(([k, v]) => (
                  <div className="runrow" key={k}>
                    <span>{k}</span>
                    <span>
                      <Money v={v} />
                    </span>
                  </div>
                ))}

                <div className="rungrp">{t.grpUse}</div>
                <div className="runrow">
                  <span>
                    {t.itPower} <em>{fmt(kwh)} kWh</em>
                    {heatSaved > 0 ? (
                      <em className="cut">
                        {t.story.heatCut(Math.round(heatSaved * 100))}
                      </em>
                    ) : null}
                  </span>
                  <span>
                    <Money v={cPower * 1000} />
                  </span>
                </div>
                <div className="runrow">
                  <span>{t.itToilet}</span>
                  <span>
                    <Money v={cToilet * 1000} />
                  </span>
                </div>
                <div className="runrow">
                  <span>
                    {t.itWood}
                    {heatSaved > 0 ? (
                      <em className="cut">
                        {t.story.heatCut(Math.round(heatSaved * 100))}
                      </em>
                    ) : null}
                  </span>
                  <span>
                    <Money v={cWood * 1000} />
                  </span>
                </div>
                <div className="runrow">
                  <span>{t.itPump}</span>
                  <span>
                    <Money v={cPump * 1000} />
                  </span>
                </div>
                {travel ? (
                  <div className="runrow">
                    <span>
                      {t.itTravel} <em>{Math.round(nights / 2.5)} turer</em>
                    </span>
                    <span>
                      <Money v={cTravel * 1000} />
                    </span>
                  </div>
                ) : null}
                <label className="runtoggle">
                  <input
                    type="checkbox"
                    checked={travel}
                    onChange={() => setTravel(!travel)}
                  />
                  <span>
                    {t.travelOn}
                    <em>{t.travelNote}</em>
                  </span>
                </label>

                <div className="rungrp">{t.grpMaint}</div>
                <div className="runrow">
                  <span>{t.maint}</span>
                  <span>
                    <Money v={maint * 1000} />
                  </span>
                </div>

                <div className="runrow tot">
                  <span>{t.runningTotal}</span>
                  <span>
                    <Money v={perYear * 1000} />
                  </span>
                </div>
                <div
                  className={"runrow tot" + (inclRun ? "" : " off")}
                  style={{ borderTop: 0, paddingTop: 2 }}
                >
                  <span style={{ fontWeight: 400, fontSize: 13 }}>
                    {t.runningPv}
                    {inclRun ? null : <em>{t.runExcluded}</em>}
                  </span>
                  <span>
                    <Money v={runPv * 1000} />
                  </span>
                </div>
              </div>
            ) : null}
          </div>
          {inclRun ? (
            <>
              <div className="pernight">
                <div className="pn-head">
                  <h3>{t.story.pnTitle}</h3>
                  <p className="pn-lead">{t.story.pnLead(nights, years)}</p>
                </div>
                {/* the horizon again, here: it is the dial that moves this
                    figure most, and it lives too far up the page to reach */}
                <div className="pn-dial">
                  <Slider
                    label={t.years}
                    value={years}
                    min={1}
                    max={50}
                    step={1}
                    onChange={setYears}
                    display={years + " " + t.yearsUnit}
                  />
                </div>
                <div className="pn-rows">
                  <div className={"pn-row" + (capitalGap < 0 ? " gain" : "")}>
                    <span>{t.story.pnOneOff}</span>
                    <span>
                      <Money v={capitalGap * 1000} />
                    </span>
                  </div>
                  {/* always shown, including at zero: the row answers a
                      question the reader is asking, and 0 is an answer */}
                  <div className={"pn-row" + (worksLoss === 0 ? " nil" : "")}>
                    <span>{t.story.pnWorks}</span>
                    <span>
                      <Money v={worksLoss * 1000} />
                    </span>
                  </div>
                  <div className="pn-row">
                    <span>{t.story.pnRecurring}</span>
                    <span>
                      <Money v={recurring * 1000} />
                    </span>
                  </div>
                  <div className="pn-row tot">
                    <span>{t.story.pnSunk}</span>
                    <span>
                      <Money v={sunk * 1000} />
                    </span>
                  </div>
                </div>
                <div className="pn-big">
                  <strong>
                    <Money v={Math.round(perNight)} />
                    <span className="pn-unit">kr</span>
                  </strong>
                  <em>{t.story.pnPer}</em>
                </div>
                <p className="pn-note">
                  {perNight < 0 ? t.story.pnProfit : t.story.pnNote}
                </p>
              </div>
              <Fold label={t.story.ch3more}>
                <div className="prose">
                  <p>{t.runFoot}</p>
                </div>
              </Fold>
            </>
          ) : null}
        </section>

        <section className="sec" id="sec-verdict">
          <Chapter
            kicker={t.story.ch4kicker}
            title={t.story.ch4title}
            body={t.story.ch4body}
          />
          <Fold label={t.story.ch4more}>
            <div className="prose">
              <p>{t.ceilingNote}</p>
              {t.notesBody.map((n, i) => (
                <p key={i}>{n}</p>
              ))}
            </div>
          </Fold>
        </section>

        <section className="sec" id="sec-plan">
          <h2>{t.planTitle}</h2>
          <div className="plancols">
            <figure className="planfig">
              <img src={IMG.plan} alt={t.planTitle} />
            </figure>
            <div className="prose planprose">
              {t.planBody.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {allBlockers.length ? (
          <section className="sec" id="sec-blockers">
            <h2>
              {t.blockersTitle} ({allBlockers.length})
            </h2>
            <ul className="blist todos">
              {allBlockers.map((x, i) => (
                <li key={i}>
                  {x.b}
                  <span className="src">{x.from}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="sec" id="sec-concepts">
          <h2>{t.glossTitle}</h2>
          <div className="ledger">
            {GLOSSARY.map((g) => {
              const isOpen = openGloss === g.id;
              return (
                <div className="lrow" key={g.id}>
                  <div
                    className="ghead"
                    role="button"
                    tabIndex={0}
                    onClick={() => setOpenGloss(isOpen ? null : g.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpenGloss(isOpen ? null : g.id);
                      }
                    }}
                  >
                    <span className="gterm">{g.term[lang]}</span>
                    <span className="chev">
                      {isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                    </span>
                  </div>
                  {isOpen ? (
                    <div className="gbody">
                      {g.body[lang].map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
