export const ORGANIZERS = ["U08LQFRBL6S"];
export const ALLOWED_PII_VIEWERS = ["U08LQFRBL6S"]; // Added allowed slack IDs
export const TAG_COLORS = [
    { name: "red", bg: "bg-red-500", ring: "ring-red-500" },
    { name: "orange", bg: "bg-orange-500", ring: "ring-orange-500" },
    { name: "yellow", bg: "bg-yellow-400", ring: "ring-yellow-400" },
    { name: "green", bg: "bg-emerald-500", ring: "ring-emerald-500" },
    { name: "blue", bg: "bg-blue-500", ring: "ring-blue-500" },
    { name: "purple", bg: "bg-purple-500", ring: "ring-purple-500" },
];

export function getDay() {
    const d = new Date();
    return (d.getMonth() === 2 && d.getDate() === 1) ? 2 : 1;
}

export function nt(n) { return typeof n === "string" ? n : n?.text || ""; }

export function parseMeta(pNotes) {
    let rating = 0, color = "", game = "", team = "";
    const customTags = [];
    (pNotes || []).forEach(n => {
        const t = nt(n);
        if (t.startsWith("⭐ RATING: ")) rating = parseInt(t.slice(11)) || 0;
        else if (t.startsWith("🎨 TAG: ")) color = t.slice(8).trim();
        else if (t.startsWith("🎮 GAME: ")) game = t.slice(9).trim();
        else if (t.startsWith("🏷️ TEAM ASSIGNED: ")) team = t.slice(19).trim();
        else if (t.startsWith("🔖 TAG: ")) customTags.push(t.slice(8).trim());
    });
    return { rating, color, game, team, customTags };
}

export function isMetaNote(text) {
    return text.startsWith("⭐ RATING: ") || text.startsWith("🎨 TAG: ") || text.startsWith("🔖 TAG: ");
}

export function visibleNotes(pNotes) {
    return (pNotes || []).filter(n => !isMetaNote(nt(n)));
}

export function matchSearch(p, q) {
    if (!q) return true;
    const lower = q.toLowerCase();
    const full = `${p.legalFirstName || ""} ${p.legalLastName || ""}`.trim().toLowerCase();
    const display = (p.displayName || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const phone = (p.phone || "").replace(/\s/g, "").toLowerCase();
    const id = (p.id || "").toLowerCase();
    return full.includes(lower) || display.includes(lower) || email.includes(lower) || phone.includes(lower) || id.includes(lower);
}
