import { Star, Send } from "lucide-react";
import { ORGANIZERS, TAG_COLORS, nt } from "../utils";

export default function ParticipantCard({
    p,
    notes,
    openParticipant,
    meta,
    tagColor,
    recentNotes,
    noteInputs,
    setNoteInputs,
    addNote,
    canViewPII
}) {
    return (
        <div key={p.id} className="bg-[#0c0c0e] border border-[#1a1a1c] rounded-lg overflow-hidden hover:border-[#333] transition-colors flex flex-col">
            <div className="p-2.5 cursor-pointer flex-1" onClick={() => openParticipant(p.id)}>
                <div className="flex items-center gap-1.5 mb-1.5">
                    {tagColor && <span className={`w-3 h-3 rounded-full ${tagColor.bg} shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.1)]`} />}
                    <span className="text-sm font-black text-white truncate tracking-tight">{p.displayName}</span>
                    {meta.rating > 0 && (
                        <div className="flex items-center gap-0.5 shrink-0 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                            {Array.from({ length: Math.min(5, meta.rating) }).map((_, ri) => (
                                <Star key={ri} size={11} className="fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex gap-1 flex-wrap mb-2">
                    {p.scanned && <span className="text-[0.65rem] font-black bg-blue-400/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-400/30">SCANNED</span>}
                    {p.isVolunteer && <span className="text-[0.65rem] font-black bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">VOL</span>}
                    {ORGANIZERS.includes(p.id) && <span className="text-[0.65rem] font-black bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30">ORG</span>}
                    {p.checkinCompleted && !p.scanned && <span className="text-[0.65rem] font-black bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">CHECKED</span>}
                    {p._inVenue ? (
                        <span className="text-[0.65rem] font-black bg-emerald-500 text-black px-1.5 py-0.5 rounded shadow-[0_0_15px_rgba(16,185,129,0.3)]">IN VENUE</span>
                    ) : (p.scanned || p.checkinCompleted) ? (
                        <span className="text-[0.65rem] font-black bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/40">ON BREAK</span>
                    ) : null}
                    {p.disabled && <span className="text-[0.65rem] font-black bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/30">DIS</span>}
                    {p.hasFillout && <span className="text-[0.65rem] font-black bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/30">FIL</span>}
                </div>
                <div className="text-[0.75rem] text-white/70 font-bold truncate mb-0.5">
                    {canViewPII ? `${p.legalFirstName || ""} ${p.legalLastName || ""}`.trim() : "██████████"}
                </div>
                <div className="text-[0.7rem] text-white/50 font-medium truncate">{canViewPII ? p.email : "████████"}</div>
                {meta.game && <div className="text-[0.7rem] text-purple-400 font-black mt-2 truncate bg-purple-400/5 px-1.5 py-0.5 rounded border border-purple-500/10">🎮 {meta.game}</div>}
                {(meta.team || p.team) && <div className="text-[0.75rem] font-black text-blue-400/80 truncate mt-1">🏷️ {meta.team || p.team}</div>}
                {recentNotes.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1 border-t border-white/5 pt-2">
                        {recentNotes.map((n, i) => (
                            <div key={i} className="text-[0.65rem] text-white/60 truncate flex items-center gap-1.5 bg-white/5 px-1.5 py-0.5 rounded">
                                {n.avatar && <img src={n.avatar} className="w-4 h-4 rounded-full shrink-0" alt="" />}
                                <span className="truncate font-medium">{nt(n)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Inline quick note */}
            <div className="border-t border-white/5 flex mt-auto bg-black/20">
                <input value={noteInputs[p.id] || ""}
                    onChange={e => setNoteInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === "Enter") { e.stopPropagation(); addNote(p.id, noteInputs[p.id]); } }}
                    onClick={e => e.stopPropagation()}
                    placeholder="Quick note..."
                    className="flex-1 bg-transparent px-3 py-2 text-[0.75rem] font-bold text-white placeholder-white/20 outline-none" />
                <button onClick={e => { e.stopPropagation(); addNote(p.id, noteInputs[p.id]); }}
                    className="text-blue-500 hover:text-blue-400 px-3 shrink-0 transition-colors"><Send size={14} /></button>
            </div>
        </div>
    );
}
