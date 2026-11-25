// Génère presentation/talk-ia-development.pptx à partir de talk-content.js.
// Usage : node build-deck.js   (depuis presentation/source/)
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const talk = require("./talk-content.js");

let applyTheme = null;
try {
  applyTheme = require("/mnt/skills/public/pptx/scripts/apply_theme.js").applyTheme;
} catch {
  /* hors de l'environnement de génération : thème par défaut */
}

const OUT = path.join(__dirname, "..", "talk-ia-development.pptx");
const QR = path.join(__dirname, "..", "assets", "qr-github-repo.png");
const APP_SHOT = path.join(__dirname, "..", "assets", "salonflow-mobile.jpg");
const REPO_URL = "github.com/fatoutambedou-ctl/ai-coding-talk";

const HEX = { black: "000000", white: "F5F5F5", card: "1C1C1C", bar: "2A2A2A", border: "3A3A3A", muted: "A3A3A3",
  green: "5CF08A", blue: "4EA8F0", red: "FF6B6B" };
const THEME = {
  name: "AI Coding Talk — Neon Terminal",
  headFontFace: "Arial",
  bodyFontFace: "Arial",
  colors: { dk1: HEX.black, lt1: HEX.white, dk2: HEX.card, lt2: HEX.muted,
    accent1: HEX.green, accent2: HEX.blue, accent3: HEX.red, accent4: HEX.bar, accent5: HEX.border, accent6: "FFFFFF",
    hlink: HEX.blue, folHlink: HEX.green },
};
const MONO = "Courier New";

/** Remplace la palette du thème PowerPoint (theme1.xml) par celle de THEME. */
async function applyPalette(buffer, theme) {
  const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
  const zip = await JSZip.loadAsync(buffer);
  const file = "ppt/theme/theme1.xml";
  const keys = ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"];
  const scheme = `<a:clrScheme name="${theme.name}">${keys.map((k) => `<a:${k}><a:srgbClr val="${theme.colors[k]}"/></a:${k}>`).join("")}</a:clrScheme>`;
  const xml = (await zip.file(file).async("string"))
    .replace(/<a:clrScheme[\s\S]*?<\/a:clrScheme>/, scheme)
    .replace(/(<a:theme\b[^>]*\bname=")[^"]*"/, `$1${theme.name}"`)
    .replace(/<a:fontScheme name="[^"]*"/, `<a:fontScheme name="${theme.name}"`);
  zip.file(file, xml);
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}
const TOTAL = talk.length;

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in
pres.author = "Fatou Tambedou";
pres.title = "De l'idée à l'application — Coder avec l'IA";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const COL = { white: C.background1, muted: C.background2, card: C.text2, green: C.accent1, blue: C.accent2, red: C.accent3, bar: C.accent4, border: C.accent5 };

const glow = (size = 12, opacity = 0.35) => ({ size, opacity, color: HEX.green });

// ---------- Mises en page (layouts) ----------
pres.defineSlideMaster({
  title: "COVER",
  background: { color: HEX.black },
  objects: [
    { text: { text: "AI_CODING_TALK / 2026", options: { x: 0.55, y: 0.35, w: 4, h: 0.3, fontFace: MONO, fontSize: 11, bold: true, color: COL.blue, margin: 0 } } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: HEX.black },
  objects: [
    { text: { text: "AI_CODING_TALK / 2026", options: { x: 0.55, y: 0.35, w: 4, h: 0.3, fontFace: MONO, fontSize: 11, bold: true, color: COL.blue, margin: 0 } } },
    { placeholder: { options: { name: "kicker", type: "body", x: 0.55, y: 0.72, w: 8.9, h: 0.3, fontFace: MONO, fontSize: 12, color: COL.green, margin: 0, valign: "middle" }, text: "// section" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.55, y: 1.0, w: 8.9, h: 0.62, fontSize: 28, bold: true, color: COL.white, margin: 0, valign: "middle", align: "left" }, text: "Titre" } },
  ],
});

// ---------- Aides ----------
async function icon(Comp, hex) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + hex, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
function pageNum(slide, n) {
  slide.addText(`${String(n).padStart(2, "0")} / ${TOTAL}`, { x: 7.45, y: 0.35, w: 2, h: 0.3, fontFace: MONO, fontSize: 11, color: COL.muted, align: "right", margin: 0, isTextBox: true });
}
function card(slide, x, y, w, h, variant = "neutral", name = "card") {
  const v = {
    neutral: { fill: { color: COL.card }, line: { color: COL.border, width: 1 } },
    green: { fill: { color: COL.green, transparency: 86 }, line: { color: COL.green, width: 1 } },
    blue: { fill: { color: COL.blue, transparency: 86 }, line: { color: COL.blue, width: 1 } },
    red: { fill: { color: COL.red, transparency: 88 }, line: { color: COL.red, width: 1 } },
  }[variant];
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, ...v, objectName: name });
}
function terminal(slide, x, y, w, h, label) {
  card(slide, x, y, w, h, "neutral", "terminal");
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.42, rectRadius: 0.08, fill: { color: COL.bar }, line: { color: COL.border, width: 1 }, objectName: "terminal-bar" });
  slide.addShape(pres.shapes.RECTANGLE, { x: x + 0.01, y: y + 0.3, w: w - 0.02, h: 0.12, fill: { color: COL.bar }, line: { color: COL.bar, width: 0 }, objectName: "terminal-bar-fill" });
  ["FF5F57", "FEBC2E", "28C840"].forEach((c, i) =>
    slide.addShape(pres.shapes.OVAL, { x: x + 0.2 + i * 0.2, y: y + 0.14, w: 0.13, h: 0.13, fill: { color: c }, line: { color: c, width: 0 }, objectName: "terminal-dot" }));
  slide.addText(label, { x: x + 0.85, y: y + 0.06, w: w - 1, h: 0.3, fontFace: MONO, fontSize: 11, color: COL.muted, margin: 0, isTextBox: true });
}
// lignes de terminal : [[texte, couleur], ...] ou [[ [run, couleur], [run, couleur] ], ...]
function termLines(slide, x, y, w, h, lines, size = 13) {
  const runs = [];
  lines.forEach((line, i) => {
    const parts = Array.isArray(line[0]) ? line : [line];
    parts.forEach(([t, c], j) => runs.push({ text: t, options: { color: c, breakLine: j === parts.length - 1 && i < lines.length - 1 } }));
  });
  slide.addText(runs, { x, y, w, h, fontFace: MONO, fontSize: size, valign: "top", margin: 0, paraSpaceAfter: 3, isTextBox: true });
}
function header(slide, n, kicker, title) {
  pageNum(slide, n);
  slide.addText(kicker, { placeholder: "kicker" });
  slide.addText(title, { placeholder: "title", align: "left", glow: glow(10, 0.3) });
}
const notesOf = (t) => `[${Math.floor(t.duration / 60)}:${String(t.duration % 60).padStart(2, "0")}] ${t.title}\n\n${t.speech}\n\nMESSAGE ESSENTIEL : ${t.key}\nTRANSITION : ${t.transition}`;

(async () => {
  const I = {
    terminal: await icon(fa.FaTerminal, HEX.green), softr: await icon(fa.FaThLarge, HEX.blue), expo: await icon(fa.FaMobileAlt, HEX.green),
    next: await icon(fa.FaGlobeAfrica, HEX.blue), supa: await icon(fa.FaDatabase, HEX.green), github: await icon(fa.FaGithub, HEX.blue),
    rocket: await icon(fa.FaRocket, HEX.green), grad: await icon(fa.FaGraduationCap, HEX.blue), store: await icon(fa.FaStore, HEX.green), code: await icon(fa.FaCode, HEX.blue),
    warn: await icon(fa.FaExclamation, HEX.red),
  };
  const sections = {};
  const add = (t, master) => {
    if (!sections[t.section]) { pres.addSection({ title: t.section }); sections[t.section] = true; }
    const s = pres.addSlide({ masterName: master, sectionTitle: t.section });
    s.addNotes(notesOf(t));
    return s;
  };

  // 1 — Couverture
  {
    const s = add(talk[0], "COVER");
    pageNum(s, 1);
    s.addText("$ ./from-idea --to-app", { x: 0.55, y: 1.55, w: 6, h: 0.35, fontFace: MONO, fontSize: 14, bold: true, color: COL.green, margin: 0, isTextBox: true });
    s.addText([
      { text: "<idée/>", options: { color: COL.green } },
      { text: " → une application", options: { color: COL.white, breakLine: true } },
      { text: "qui fonctionne.", options: { color: COL.white } },
    ], { x: 0.55, y: 1.95, w: 8.9, h: 1.65, fontSize: 46, bold: true, margin: 0, valign: "top", glow: glow(14, 0.4), isTextBox: true, objectName: "cover-title" });
    s.addText("Coder avec l'IA, sans être expert en code.", { x: 0.55, y: 3.65, w: 8.9, h: 0.4, fontFace: MONO, fontSize: 16, bold: true, color: COL.muted, margin: 0, isTextBox: true });
    s.addText([
      { text: "// Fatou Tambedou — BI & AI Engineer", options: { breakLine: true } },
      { text: "// Club IA · ESP Dakar" },
    ], { x: 0.55, y: 4.65, w: 5, h: 0.55, fontFace: MONO, fontSize: 12, color: COL.muted, margin: 0, isTextBox: true });
    s.addText([
      { text: "connected  [ ", options: { color: COL.muted } }, { text: "●", options: { color: COL.green } }, { text: " ]", options: { color: COL.muted, breakLine: true } },
      { text: "online  [ ", options: { color: COL.muted } }, { text: "●", options: { color: COL.blue } }, { text: " ]", options: { color: COL.muted } },
    ], { x: 6.45, y: 4.65, w: 3, h: 0.55, fontFace: MONO, fontSize: 12, align: "right", margin: 0, isTextBox: true });
  }

  // 2 — Question
  {
    const t = talk[1]; const s = add(t, "CONTENT");
    header(s, 2, "// question.open", t.title);
    terminal(s, 0.55, 1.95, 4.75, 3.2, "~ / idees");
    termLines(s, 0.8, 2.55, 4.3, 2.5, [
      ["$ ideas --list", HEX.white],
      ["▸ réservation, salon du quartier", HEX.green], ["  status: jamais lancée", HEX.red],
      ["▸ cotisations de la tontine", HEX.green], ["  status: jamais lancée", HEX.red],
      ["▸ catalogue boutique WhatsApp", HEX.green], ["  status: jamais lancée", HEX.red],
    ], 13);
    card(s, 5.6, 1.95, 3.85, 3.2, "neutral");
    s.addText("// constat", { x: 5.9, y: 2.2, w: 3.3, h: 0.3, fontFace: MONO, fontSize: 12, color: COL.blue, margin: 0, isTextBox: true });
    s.addText("Le problème n'a jamais été l'idée.", { x: 5.9, y: 2.6, w: 3.3, h: 1.2, fontSize: 24, bold: true, color: COL.white, margin: 0, valign: "top", isTextBox: true });
    s.addText("C'était le passage de l'idée au code.", { x: 5.9, y: 3.85, w: 3.3, h: 0.7, fontSize: 15, color: COL.muted, margin: 0, valign: "top", isTextBox: true });
    s.addText("✋  Qui a déjà eu une idée d'app ?", { x: 5.9, y: 4.6, w: 3.3, h: 0.35, fontFace: MONO, fontSize: 11, color: COL.green, margin: 0, isTextBox: true });
  }

  // 3 — Révolution (frise)
  {
    const t = talk[2]; const s = add(t, "CONTENT");
    header(s, 3, "// timeline.evolution", t.title);
    s.addShape(pres.shapes.LINE, { x: 0.85, y: 2.05, w: 8.3, h: 0, line: { color: COL.border, width: 1.5, dashType: "dash" }, objectName: "timeline" });
    const waves = [
      { when: "2021 / autocomplete", head: "L'IA complète la ligne", body: "Copilot propose la suite. Il faut déjà savoir coder.", v: "neutral", c: COL.muted },
      { when: "fin 2022 / chat", head: "L'IA répond, vous copiez", body: "ChatGPT, Claude. Vous restez le facteur entre l'IA et la machine.", v: "blue", c: COL.blue },
      { when: "2025 / agents", head: "L'IA agit dans le projet", body: "Claude Code lit, écrit, exécute, vérifie et corrige.", v: "green", c: COL.green },
    ];
    waves.forEach((w, i) => {
      const x = 0.55 + i * 3.05;
      s.addShape(pres.shapes.OVAL, { x: x + 0.22, y: 1.95, w: 0.2, h: 0.2, fill: { color: w.c }, line: { color: w.c, width: 0 }, objectName: "timeline-dot" });
      card(s, x, 2.35, 2.85, 2.25, w.v);
      s.addText(w.when, { x: x + 0.25, y: 2.55, w: 2.4, h: 0.3, fontFace: MONO, fontSize: 12, bold: true, color: w.c, margin: 0, isTextBox: true });
      s.addText(w.head, { x: x + 0.25, y: 2.95, w: 2.4, h: 0.65, fontSize: 18, bold: true, color: COL.white, margin: 0, valign: "top", isTextBox: true });
      s.addText(w.body, { x: x + 0.25, y: 3.65, w: 2.4, h: 0.85, fontSize: 14, color: COL.muted, margin: 0, valign: "top", isTextBox: true });
    });
    s.addText("// « vibe coding » — Andrej Karpathy, février 2025", { x: 0.55, y: 4.85, w: 8.9, h: 0.35, fontFace: MONO, fontSize: 12, color: COL.muted, margin: 0, isTextBox: true });
  }

  // 4 — Outils
  {
    const t = talk[3]; const s = add(t, "CONTENT");
    header(s, 4, "// stack.tools", t.title);
    const tools = [
      ["Claude Code", "Agent de code : terminal, VS Code, app", I.terminal, "green"],
      ["Softr", "Apps no-code sur vos données", I.softr, "blue"],
      ["Expo", "Apps mobiles Android et iOS", I.expo, "green"],
      ["Next.js", "Sites et apps web, front + API", I.next, "blue"],
      ["Supabase", "Base de données et connexion", I.supa, "green"],
      ["GitHub", "Historique, partage, collaboration", I.github, "blue"],
    ];
    tools.forEach(([name, desc, img, v], i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = 0.55 + col * 3.0, y = 1.95 + row * 1.6;
      card(s, x, y, 2.85, 1.42, "neutral");
      card(s, x + 0.22, y + 0.3, 0.72, 0.72, v, "icon-box");
      s.addImage({ data: img, x: x + 0.38, y: y + 0.46, w: 0.4, h: 0.4, altText: name });
      s.addText(`tool.0${i + 1}`, { x: x + 1.12, y: y + 0.22, w: 1.6, h: 0.25, fontFace: MONO, fontSize: 10, color: v === "green" ? COL.green : COL.blue, margin: 0, isTextBox: true });
      s.addText(name, { x: x + 1.12, y: y + 0.47, w: 1.65, h: 0.32, fontSize: 16, bold: true, color: COL.white, margin: 0, isTextBox: true });
      s.addText(desc, { x: x + 1.12, y: y + 0.8, w: 1.65, h: 0.5, fontSize: 11, color: COL.muted, margin: 0, valign: "top", isTextBox: true });
    });
  }

  // 5 — Boucle Claude Code
  {
    const t = talk[4]; const s = add(t, "CONTENT");
    header(s, 5, "// claude_code.loop()", t.title);
    terminal(s, 0.55, 1.95, 4.2, 3.2, "~ / salonflow — claude");
    termLines(s, 0.8, 2.55, 3.8, 2.5, [
      ["> Ajoute la page de réservation", HEX.white],
      [["● Lecture   ", HEX.green], ["app/page.tsx", HEX.muted]],
      [["● Plan      ", HEX.green], ["3 étapes", HEX.muted]],
      [["● Écriture  ", HEX.green], ["components/…", HEX.muted]],
      [["● Commande  ", HEX.green], ["npx tsc --noEmit", HEX.muted]],
      ["  ✓ aucune erreur", HEX.green],
      ["// illustration simplifiée", HEX.muted],
    ], 12);
    const cx = 7.1, cy = 3.55, r = 1.25;
    s.addShape(pres.shapes.OVAL, { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { color: HEX.black, transparency: 100 }, line: { color: COL.border, width: 1.5, dashType: "dash" }, objectName: "loop-ring" });
    const steps = ["Comprendre", "Planifier", "Écrire", "Exécuter", "Vérifier"];
    steps.forEach((st, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
      s.addShape(pres.shapes.OVAL, { x: x - 0.2, y: y - 0.2, w: 0.4, h: 0.4, fill: { color: HEX.black }, line: { color: COL.green, width: 1.5 }, objectName: "loop-step" });
      s.addText(String(i + 1), { x: x - 0.2, y: y - 0.2, w: 0.4, h: 0.4, fontFace: MONO, fontSize: 13, bold: true, color: COL.green, align: "center", valign: "middle", margin: 0, isTextBox: true });
      const right = Math.cos(a) > 0.2, left = Math.cos(a) < -0.2;
      const lw = 1.3;
      const lx = right ? x + 0.26 : left ? x - 0.26 - lw : x - lw / 2;
      const ly = Math.sin(a) < -0.9 ? y - 0.55 : Math.sin(a) > 0.5 ? y + 0.22 : y - 0.15;
      s.addText(st, { x: lx, y: ly, w: lw, h: 0.3, fontSize: 14, bold: true, color: COL.white, align: right ? "left" : left ? "right" : "center", margin: 0, isTextBox: true });
    });
    s.addText([
      { text: "VOUS", options: { fontSize: 18, bold: true, color: COL.green, breakLine: true } },
      { text: "intention", options: { fontSize: 11, color: COL.muted, breakLine: true } },
      { text: "+ validation", options: { fontSize: 11, color: COL.muted } },
    ], { x: cx - 0.8, y: cy - 0.42, w: 1.6, h: 0.84, align: "center", valign: "middle", fontFace: MONO, margin: 0, isTextBox: true });
  }

  // 6 — Workflow
  {
    const t = talk[5]; const s = add(t, "CONTENT");
    header(s, 6, "// workflow.pipeline", t.title);
    const steps = [
      ["01", "Idée", "Le problème en une phrase"],
      ["02", "Spécifier", "Écran par écran"],
      ["03", "Générer", "Le prompt → le code"],
      ["04", "Tester", "Vrai téléphone, vraies personnes"],
      ["05", "Publier", "GitHub, puis en ligne"],
    ];
    const w = 1.6, gap = 0.225;
    steps.forEach(([num, name, desc], i) => {
      const x = 0.55 + i * (w + gap), y = 2.05;
      const ai = i === 2;
      card(s, x, y, w, 2.0, ai ? "green" : "neutral");
      s.addText(num, { x: x + 0.18, y: y + 0.2, w: 1, h: 0.3, fontFace: MONO, fontSize: 13, bold: true, color: ai ? COL.green : COL.blue, margin: 0, isTextBox: true });
      if (ai) s.addText("IA", { x: x + w - 0.6, y: y + 0.2, w: 0.42, h: 0.28, fontFace: MONO, fontSize: 10, bold: true, color: HEX.black, fill: { color: COL.green }, align: "center", valign: "middle", margin: 0, isTextBox: true });
      s.addText(name, { x: x + 0.18, y: y + 0.65, w: w - 0.3, h: 0.4, fontSize: 18, bold: true, color: COL.white, margin: 0, isTextBox: true });
      s.addText(desc, { x: x + 0.18, y: y + 1.1, w: w - 0.3, h: 0.8, fontSize: 12, color: COL.muted, margin: 0, valign: "top", isTextBox: true });
      if (i < steps.length - 1) s.addText("›", { x: x + w, y: y + 0.75, w: gap, h: 0.5, fontSize: 20, bold: true, color: COL.border, align: "center", valign: "middle", margin: 0, isTextBox: true });
    });
    s.addText([
      { text: "1 étape sur 5 ", options: { color: COL.green, bold: true } },
      { text: "est faite par l'IA. Les 4 autres demandent votre jugement.", options: { color: COL.white } },
    ], { x: 0.55, y: 4.45, w: 8.9, h: 0.5, fontSize: 16, margin: 0, isTextBox: true });
  }

  // 7 — SalonFlow AI
  {
    const t = talk[6]; const s = add(t, "CONTENT");
    header(s, 7, "// project.salonflow", t.title);
    // maquette de téléphone
    const px = 0.9, py = 1.8, pw = 1.95, ph = 3.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: py, w: pw, h: ph, rectRadius: 0.22, fill: { color: COL.card }, line: { color: COL.green, width: 1.5 }, shadow: { type: "outer", color: HEX.green, opacity: 0.35, blur: 14, offset: 0, angle: 90 }, objectName: "phone" });
    // écran : capture réelle de l'application en vue mobile (assets/salonflow-mobile.jpg, même format que l'écran)
    const sx = px + 0.12, sy = py + 0.28, sw = pw - 0.24, sh = ph - 0.5;
    s.addImage({ path: APP_SHOT, x: sx, y: sy, w: sw, h: sh, altText: "Capture de SalonFlow AI sur téléphone : accueil du Salon Aminata" });
    // fonctionnalités
    card(s, 3.4, 1.8, 6.05, 2.35, "neutral");
    s.addText("// features", { x: 3.65, y: 1.98, w: 3, h: 0.3, fontFace: MONO, fontSize: 12, color: COL.muted, margin: 0, isTextBox: true });
    const feats = [["Catalogue & prix", "green"], ["Date & créneau", "blue"], ["Réservation", "green"], ["Mes RDV & annulation", "blue"], ["Espace pro & agenda", "green"]];
    const chipPos = [[3.65, 2.4, 1.8], [5.6, 2.4, 1.65], [7.4, 2.4, 1.6], [3.65, 3.05, 2.35], [6.15, 3.05, 2.35]];
    feats.forEach(([f, v], i) => {
      const [x, y, w] = chipPos[i];
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.48, rectRadius: 0.06, fill: { color: v === "green" ? COL.green : COL.blue, transparency: 86 }, line: { color: v === "green" ? COL.green : COL.blue, width: 1 }, objectName: "chip" });
      s.addText(f, { x, y, w, h: 0.48, fontFace: MONO, fontSize: 11, bold: true, color: v === "green" ? COL.green : COL.blue, align: "center", valign: "middle", margin: 0, isTextBox: true });
    });
    card(s, 3.4, 4.35, 6.05, 1.0, "neutral");
    s.addText("// stack", { x: 3.65, y: 4.5, w: 2, h: 0.28, fontFace: MONO, fontSize: 12, color: COL.muted, margin: 0, isTextBox: true });
    s.addText("next.js · express · typescript · tailwind · json", { x: 3.65, y: 4.8, w: 5.7, h: 0.35, fontFace: MONO, fontSize: 13, bold: true, color: COL.white, margin: 0, isTextBox: true });
  }

  // 8 — Démo live
  {
    const t = talk[7]; const s = add(t, "CONTENT");
    header(s, 8, "// live.demo — 5 min", t.title);
    terminal(s, 0.55, 1.95, 5.6, 3.2, "~ / salon-demo — claude");
    termLines(s, 0.8, 2.55, 5.2, 2.5, [
      ["$ claude", HEX.white],
      ["> Crée la page du Salon Aminata :", HEX.green],
      ["  catalogue, prix en FCFA, réservation", HEX.green],
      ["  par date et créneau…", HEX.green],
      ["", HEX.muted],
      ["● génération en cours", HEX.muted],
      ["█", HEX.green],
    ], 14);
    const ms = [["0:00", "Prompt de création", "green"], ["2:30", "Amélioration : la couleur choisie par le public", "blue"], ["4:00", "Version complète : agenda pro", "green"]];
    ms.forEach(([tm, label, v], i) => {
      const y = 1.95 + i * 0.85;
      card(s, 6.4, y, 3.05, 0.72, v);
      s.addText(tm, { x: 6.6, y, w: 0.7, h: 0.72, fontFace: MONO, fontSize: 14, bold: true, color: v === "green" ? COL.green : COL.blue, valign: "middle", margin: 0, isTextBox: true });
      s.addText(label, { x: 7.3, y, w: 2.05, h: 0.72, fontSize: 12, color: COL.white, valign: "middle", margin: 0, isTextBox: true });
    });
    s.addText([
      { text: "plan B → ", options: { color: COL.red, bold: true } },
      { text: "git checkout demo-backup · vidéo", options: { color: COL.muted } },
    ], { x: 6.4, y: 4.6, w: 3.05, h: 0.5, fontFace: MONO, fontSize: 11, valign: "middle", margin: 0, isTextBox: true });
  }

  // 9 — Derrière l'écran
  {
    const t = talk[8]; const s = add(t, "CONTENT");
    header(s, 9, "// under_the_hood", t.title);
    card(s, 0.55, 1.95, 4.3, 3.25, "neutral");
    termLines(s, 0.8, 2.15, 3.9, 2.95, [
      ["project-salonflow-ai/", HEX.white],
      [["├─ application/   ", HEX.blue], ["frontend Next.js", HEX.green]],
      [["│  ├─ app/        ", HEX.muted], ["4 pages", HEX.green]],
      [["│  ├─ components/", HEX.muted]],
      [["│  └─ lib/api.ts  ", HEX.muted], ["appels à l'API", HEX.green]],
      [["└─ backend/       ", HEX.blue], ["API Express", HEX.green]],
      [["   ├─ src/routes/ ", HEX.muted], ["routes /api", HEX.green]],
      [["   ├─ src/lib/    ", HEX.muted], ["créneaux, stockage", HEX.green]],
      [["   └─ data/bookings.json", HEX.blue]],
    ], 11);
    const flow = [["Navigateur", "la cliente choisit"], ["Frontend Next.js", "pages, port 3000"], ["API Express", "revérifie le créneau"], ["data/bookings.json", "enregistre"]];
    flow.forEach(([a, b], i) => {
      const y = 1.95 + i * 0.83;
      card(s, 5.15, y, 2.75, 0.62, i === 2 ? "green" : "neutral");
      s.addText(a, { x: 5.3, y, w: 2.5, h: 0.36, fontFace: MONO, fontSize: 11, bold: true, color: i === 2 ? COL.green : COL.white, valign: "bottom", margin: 0, isTextBox: true });
      s.addText(b, { x: 5.3, y: y + 0.34, w: 2.5, h: 0.24, fontSize: 10, color: COL.muted, valign: "top", margin: 0, isTextBox: true });
      if (i < flow.length - 1) s.addText("↓", { x: 6.3, y: y + 0.6, w: 0.45, h: 0.23, fontSize: 12, color: COL.border, align: "center", valign: "middle", margin: 0, isTextBox: true });
    });
    card(s, 8.1, 1.95, 1.35, 3.25, "neutral");
    s.addText("14/14", { x: 8.1, y: 2.4, w: 1.35, h: 0.6, fontFace: MONO, fontSize: 24, bold: true, color: COL.green, align: "center", margin: 0, glow: glow(8, 0.35), isTextBox: true });
    s.addText("tests de bout en bout réussis", { x: 8.2, y: 3.05, w: 1.15, h: 1.1, fontSize: 11, color: COL.muted, align: "center", valign: "top", margin: 0, isTextBox: true });
  }

  // 10 — Limites
  {
    const t = talk[9]; const s = add(t, "CONTENT");
    header(s, 10, "// problem.limits", t.title);
    card(s, 0.55, 1.95, 8.9, 2.45, "neutral");
    card(s, 0.85, 2.25, 0.75, 0.75, "red", "warn-box");
    s.addImage({ data: I.warn, x: 1.04, y: 2.44, w: 0.37, h: 0.37, altText: "Attention" });
    s.addText("WARNING — L'IA PEUT SE TROMPER", { x: 1.9, y: 2.2, w: 7.3, h: 0.3, fontFace: MONO, fontSize: 12, bold: true, color: COL.red, margin: 0, isTextBox: true });
    s.addText("Le code généré a toujours l'air propre. Ça ne veut pas dire qu'il est sûr, juste ou maintenable.", { x: 1.9, y: 2.55, w: 7.3, h: 0.6, fontSize: 15, color: COL.white, margin: 0, valign: "top", isTextBox: true });
    [["sécurité", "un PIN n'est pas une auth"], ["bugs", "plausibles, donc invisibles"], ["dette", "du code que personne ne lit"]].forEach(([a, b], i) => {
      const x = 1.9 + i * 2.45;
      s.addText(a, { x, y: 3.3, w: 2.3, h: 0.5, fontFace: MONO, fontSize: 24, bold: true, color: COL.red, margin: 0, isTextBox: true });
      s.addText(b, { x, y: 3.8, w: 2.3, h: 0.3, fontFace: MONO, fontSize: 10, color: COL.muted, margin: 0, isTextBox: true });
    });
    s.addText([
      { text: "$ règle : ", options: { color: COL.green, fontFace: MONO } },
      { text: "ne publiez jamais un code que vous ne pouvez pas expliquer.", options: { color: COL.white, bold: true } },
    ], { x: 0.55, y: 4.6, w: 8.9, h: 0.5, fontSize: 16, margin: 0, isTextBox: true });
  }

  // 11 — Opportunités
  {
    const t = talk[10]; const s = add(t, "CONTENT");
    header(s, 11, "// opportunities.list", t.title);
    const ops = [
      ["for.01", "Entrepreneurs", "Tester une idée en jours, pas en mois.", I.rocket, "green"],
      ["for.02", "Étudiants", "Un portfolio de vrais projets.", I.grad, "blue"],
      ["for.03", "Commerces locaux", "Salons, boutiques, tontines : des outils en FCFA, faits pour eux.", I.store, "green"],
      ["for.04", "Développeurs", "Moins de code répétitif, plus d'architecture.", I.code, "blue"],
    ];
    ops.forEach(([k, h, d, img, v], i) => {
      const x = 0.55 + (i % 2) * 4.55, y = 1.95 + Math.floor(i / 2) * 1.65;
      card(s, x, y, 4.35, 1.48, "neutral");
      card(s, x + 0.3, y + 0.36, 0.76, 0.76, v, "icon-box");
      s.addImage({ data: img, x: x + 0.48, y: y + 0.54, w: 0.4, h: 0.4, altText: h });
      s.addText(k, { x: x + 1.3, y: y + 0.22, w: 2.8, h: 0.25, fontFace: MONO, fontSize: 11, bold: true, color: v === "green" ? COL.green : COL.blue, margin: 0, isTextBox: true });
      s.addText(h, { x: x + 1.3, y: y + 0.48, w: 2.85, h: 0.35, fontSize: 18, bold: true, color: COL.white, margin: 0, isTextBox: true });
      s.addText(d, { x: x + 1.3, y: y + 0.85, w: 2.85, h: 0.55, fontSize: 12, color: COL.muted, margin: 0, valign: "top", isTextBox: true });
    });
  }

  // 12 — Conclusion
  {
    const s = add(talk[11], "COVER");
    pageNum(s, 12);
    s.addText("$ exit 0", { x: 0.55, y: 1.35, w: 4, h: 0.35, fontFace: MONO, fontSize: 14, bold: true, color: COL.green, margin: 0, isTextBox: true });
    s.addText([
      { text: "Le code n'est plus", options: { color: COL.white, breakLine: true } },
      { text: "la barrière.", options: { color: COL.white } },
    ], { x: 0.55, y: 1.8, w: 6.2, h: 1.5, fontSize: 40, bold: true, margin: 0, valign: "top", glow: glow(14, 0.4), isTextBox: true });
    s.addText("La barrière, c'est de commencer.", { x: 0.55, y: 3.35, w: 6.2, h: 0.55, fontSize: 24, bold: true, color: COL.green, margin: 0, isTextBox: true });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.2, y: 1.45, w: 2.25, h: 2.25, rectRadius: 0.1, fill: { color: "FFFFFF" }, line: { color: COL.green, width: 1.5 }, objectName: "qr-frame" });
    s.addImage({ path: QR, x: 7.3, y: 1.55, w: 2.05, h: 2.05, altText: "QR code du dépôt GitHub du talk" });
    s.addText(REPO_URL, { x: 5.75, y: 3.82, w: 3.7, h: 0.3, fontFace: MONO, fontSize: 9, color: COL.muted, align: "right", valign: "top", margin: 0, isTextBox: true });
    s.addText("// merci — slides, discours, prompts et code en accès libre", { x: 0.55, y: 4.85, w: 8.9, h: 0.35, fontFace: MONO, fontSize: 12, color: COL.muted, margin: 0, isTextBox: true });
  }

  // stream() plutôt que writeFile() : pptxgenjs 4 ignore l'option compression dans writeFile sous Node.
  let pptx = await pres.stream({ compression: true });
  // Sans le module apply_theme, on applique ici la palette du talk : les slides utilisent les couleurs du thème.
  if (!applyTheme) pptx = await applyPalette(pptx, THEME);
  require("fs").writeFileSync(OUT, pptx);
  if (applyTheme) await applyTheme(OUT, THEME);
  console.log("Écrit :", OUT);
})();
