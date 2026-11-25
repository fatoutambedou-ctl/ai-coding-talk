// Génère speaker-notes/discours-complet.md et speaker-notes/timing.md depuis talk-content.js.
// Usage : node build-docs.js   (depuis presentation/source/)
const fs = require("fs");
const path = require("path");
const talk = require("./talk-content.js");

const OUT = path.join(__dirname, "..", "..", "speaker-notes");
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const words = (t) => t.replace(/\[.*?\]/g, "").split(/\s+/).filter(Boolean).length;

let md = `# Discours complet — « De l'idée à l'application »

Talk de 20 minutes, 12 slides. Oratrice : Fatou Tambedou.
Les indications entre crochets sont des didascalies (à ne pas lire). Aminata est un personnage fictif qui sert de fil rouge.

> Ce fichier est généré depuis \`presentation/source/talk-content.js\`. Pour modifier le discours, éditez ce fichier source, puis relancez \`node build-docs.js\` et \`node build-deck.js\` : les notes du PowerPoint resteront identiques au texte ci-dessous.

`;
let t = 0;
for (const s of talk) {
  md += `---\n\n## Slide ${s.n} — ${s.title}\n\n`;
  md += `**Temps prévu :** ${mmss(s.duration)} (de ${mmss(t)} à ${mmss(t + s.duration)})\n\n`;
  md += `**Contenu affiché :** ${s.shown}\n\n**Visuel :** ${s.visual}\n\n`;
  if (s.interaction) md += `**Interaction avec le public :** ${s.interaction}\n\n`;
  md += `### Discours\n\n${s.speech}\n\n`;
  md += `**Message essentiel :** ${s.key}\n\n**Transition :** ${s.transition}\n\n`;
  t += s.duration;
}
fs.writeFileSync(path.join(OUT, "discours-complet.md"), md);

let tm = `# Planning chronométré

Durée totale : **${mmss(t)}** pour ${talk.length} slides. Débit cible : 100 à 125 mots par minute, pauses comprises.

| Slide | Sujet | Durée | Début | Fin | Mots | Repère |
|---:|---|---:|---:|---:|---:|---|
`;
t = 0;
for (const s of talk) {
  tm += `| ${s.n} | ${s.title} | ${mmss(s.duration)} | ${mmss(t)} | ${mmss(t + s.duration)} | ${words(s.speech)} | ${s.interaction ? "Interaction" : ""} |\n`;
  t += s.duration;
}
tm += `
## Points de contrôle pendant le talk

Gardez un chronomètre visible (mode présentateur de PowerPoint ou téléphone posé sur le pupitre).

| Au chrono | Vous devriez être… | Si vous êtes en retard |
|---:|---|---|
| 4:00 | à la fin de la slide 3 | raccourcissez la slide 4 : citez seulement Claude Code, Expo et GitHub |
| 9:00 | au début de la slide 7 | passez la slide 7 en 30 s |
| 10:00 | au lancement de la démo | — |
| 12:45 | la page générée doit être affichée | sinon, plan B immédiat (\`git checkout demo-backup\`) |
| 15:00 | à la fin de la démo | sautez l'amélioration visuelle et montrez directement la version complète |
| 18:00 | au début de la slide 11 | réduisez la slide 11 à deux cartes |

## Détail de la démo (slide 8, 5:00)

| Chrono démo | Action |
|---:|---|
| 0:00 – 0:20 | Présenter le projet vide, lancer \`claude\` |
| 0:20 – 0:40 | Coller le prompt de création |
| 0:40 – 2:15 | Commenter la génération, accepter les permissions |
| 2:15 – 2:30 | Recharger, faire une réservation |
| 2:30 – 2:45 | Le public choisit la couleur |
| 2:45 – 4:00 | Prompt d'amélioration, recharger |
| 4:00 – 5:00 | Version complète : réservation, mes RDV, espace pro |

Voir \`workshop/demonstration-guide.md\` pour les commandes exactes.
`;
fs.writeFileSync(path.join(OUT, "timing.md"), tm);
console.log("Écrit : discours-complet.md, timing.md");
