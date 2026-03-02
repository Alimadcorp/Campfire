import { X, Phone, Mail, Gamepad2, UserPlus, Send, LogOut, CheckCircle } from "lucide-react";
import { format as timeago } from "timeago.js";
import { ORGANIZERS, TAG_COLORS, nt } from "../utils";
import { Stars, Row } from "./BaseUI";

export default function ParticipantModal({
    modalId,
    modalP,
    modalNotes,
    modalMeta,
    modalVisible,
    setModalId,
    canViewPII,
    setRating,
    setColorTag,
    gameInputs,
    setGameInputs,
    setGameEntry,
    teamInputs,
    setTeamInputs,
    assignTeam,
    tagInputs,
    setTagInputs,
    addCustomTag,
    noteInputs,
    setNoteInputs,
    addNote,
    setTransitModal
}) {
    if (!modalId || !modalP) return null;

    return (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4" onClick={() => setModalId(null)}>
            <div className="bg-[#0a0a0c] border border-[#1a1a1c] rounded-lg w-full max-w-xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Modal header */}
                <div className="sticky top-0 bg-[#0a0a0c] border-b border-[#1a1a1c] p-4 z-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="font-black text-base text-white">{modalP.displayName}</h2>
                            <p className="text-[0.65rem] text-white/40">{modalP.legalFirstName} {modalP.legalLastName} · {modalP.email}</p>
                        </div>
                        <button onClick={() => setModalId(null)} className="text-[#444] hover:text-white p-1"><X size={16} /></button>
                    </div>
                    {/* Badges */}
                    <div className="flex gap-1 mt-2 flex-wrap">
                        {modalP.isVolunteer && <span className="text-[0.5rem] font-black bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">VOLUNTEER</span>}
                        {ORGANIZERS.includes(modalP.id) && <span className="text-[0.5rem] font-black bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">ORGANIZER</span>}
                        {modalP.checkinCompleted && <span className="text-[0.5rem] font-black bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">CHECKED IN</span>}
                        {modalP.disabled && <span className="text-[0.5rem] font-black bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded">DISABLED</span>}
                        {modalP.pendingDisable && <span className="text-[0.5rem] font-black bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">PENDING DISABLE</span>}
                        {modalP.pendingVolunteer && <span className="text-[0.5rem] font-black bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded">PENDING VOL</span>}
                    </div>
                    {/* Rating + Color */}
                    <div className="flex items-center gap-4 mt-3">
                        <Stars value={modalMeta.rating} onChange={v => setRating(modalId, v)} size={20} hideOnSet />
                        <div className="flex gap-1.5">
                            {TAG_COLORS.map(c => (
                                <button key={c.name} onClick={() => setColorTag(modalId, c.name === modalMeta.color ? "" : c.name)}
                                    className={`w-4 h-4 rounded-full ${c.bg} transition-all ${modalMeta.color === c.name ? "ring-2 ring-offset-1 ring-offset-black " + c.ring + " scale-125" : "opacity-40 hover:opacity-80"}`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal body */}
                <div className="p-4 flex flex-col gap-4">
                    {/* Personal Info */}
                    <section>
                        <h3 className="text-[0.55rem] font-black text-[#444] mb-1">PERSONAL INFORMATION</h3>
                        <div className="grid grid-cols-2 gap-x-6">
                            <Row label="ID" value={modalP.id} mono />
                            <Row label="Display Name" value={modalP.displayName} />
                            <Row label="Legal First" value={modalP.legalFirstName} redact={!canViewPII} />
                            <Row label="Legal Last" value={modalP.legalLastName} redact={!canViewPII} />
                            <Row label="Email" value={modalP.email} mono redact={!canViewPII} />
                            <Row label="Email (Fillout)" value={modalP.emailC} mono redact={!canViewPII} />
                            <Row label="Phone" value={modalP.phone} mono redact={!canViewPII} />
                            <Row label="Age" value={modalP.age} />
                            <Row label="Pronouns" value={modalP.pronouns} />
                            <Row label="CNIC" value={modalP.cnic} mono redact={!canViewPII} />
                        </div>
                        <div className="flex gap-2 mt-2">
                            {modalP.phone && canViewPII && (
                                <a href={`https://wa.me/${(modalP.phone || "").replace(/[^0-9+]/g, "")}?text=AOA`} target="_blank" rel="noopener noreferrer"
                                    className="text-[0.55rem] font-bold text-emerald-400 border border-emerald-500/30 rounded px-2 py-1 hover:bg-emerald-500/10 flex items-center gap-1 no-underline">
                                    <Phone size={9} /> WhatsApp
                                </a>
                            )}
                            {modalP.email && canViewPII && (
                                <a href={`mailto:${modalP.email}`} className="text-[0.55rem] font-bold text-blue-400 border border-blue-500/30 rounded px-2 py-1 hover:bg-blue-500/10 flex items-center gap-1 no-underline">
                                    <Mail size={9} /> Email
                                </a>
                            )}
                        </div>
                    </section>

                    {/* Event Info */}
                    <section>
                        <h3 className="text-[0.55rem] font-black text-[#444] mb-1">EVENT DETAILS</h3>
                        <div className="grid grid-cols-2 gap-x-6">
                            <Row label="Shirt Size" value={modalP.shirtSize} />
                            <Row label="Dietary" value={modalP.dietaryRestrictions} redact={!canViewPII} />
                            <Row label="Accommodations" value={modalP.additionalAccommodations} redact={!canViewPII} />
                            <Row label="Engine" value={modalP.engine} />
                            <Row label="Experience" value={modalP.exp != null && modalP.exp !== "" ? `${modalP.exp}/10` : null} />
                            <Row label="Team" value={modalMeta.team || modalP.team} />
                            <Row label="Signed Up" value={modalP.createdTime ? timeago(modalP.createdTime) : null} />
                            <Row label="Volunteer" value={modalP.isVolunteer ? "Yes" : "No"} />
                            <Row label="Checked In" value={modalP.checkinCompleted ? "Yes" : "No"} />
                            <Row label="Disabled" value={modalP.disabled ? "Yes" : "No"} />
                            <Row label="Checked in D1" value={modalP.scanned ? "Yes" : "No"} />
                            <Row label="Checked in D2" value={modalP.scannedDay2 ? "Yes" : "No"} />
                        </div>
                    </section>

                    {/* Emergency Contacts */}
                    {canViewPII && (
                        <section>
                            <h3 className="text-[0.55rem] font-black text-[#444] mb-1">EMERGENCY CONTACTS</h3>
                            {modalP.emergencyContact1Name ? (
                                <div className="text-[0.65rem] text-white/60 bg-[#060608] rounded p-2 border border-[#141416]">
                                    <span className="text-white/80 font-bold">{modalP.emergencyContact1Name}</span> — {modalP.emergencyContact1Phone} ({modalP.emergencyContact1Relationship})
                                </div>
                            ) : <p className="text-[0.6rem] text-[#333]">No primary contact</p>}
                            {modalP.emergencyContact2Name && (
                                <div className="text-[0.65rem] text-white/60 bg-[#060608] rounded p-2 border border-[#141416] mt-1">
                                    <span className="text-white/80 font-bold">{modalP.emergencyContact2Name}</span> — {modalP.emergencyContact2Phone} ({modalP.emergencyContact2Relationship})
                                </div>
                            )}
                        </section>
                    )}

                    {/* Referral */}
                    {modalP.referralContext && (
                        <section>
                            <h3 className="text-[0.55rem] font-black text-[#444] mb-1">REFERRAL CONTEXT</h3>
                            <p className="text-[0.65rem] text-white/50 leading-relaxed bg-[#060608] rounded p-2 border border-[#141416] italic">"{modalP.referralContext}"</p>
                        </section>
                    )}

                    {/* Game Entry */}
                    <section>
                        <h3 className="text-[0.55rem] font-black text-[#444] mb-1">GAME SUBMISSION</h3>
                        {modalMeta.game && <p className="text-[0.65rem] text-emerald-400 mb-1">Current: <span className="text-white font-bold">{modalMeta.game}</span></p>}
                        <div className="flex gap-1">
                            <div className="flex items-center gap-1 flex-1 bg-black border border-[#222] rounded px-2">
                                <Gamepad2 size={10} className="text-purple-400 shrink-0" />
                                <input value={gameInputs[modalId] || ""} onChange={e => setGameInputs(prev => ({ ...prev, [modalId]: e.target.value }))}
                                    onKeyDown={e => e.key === "Enter" && setGameEntry(modalId, gameInputs[modalId])}
                                    placeholder="Enter game name..." className="bg-transparent text-[0.65rem] text-white outline-none py-1.5 flex-1 placeholder-[#333]" />
                            </div>
                            <button onClick={() => setGameEntry(modalId, gameInputs[modalId])}
                                className="text-[0.55rem] font-black text-purple-400 border border-purple-500/30 rounded px-3 hover:bg-purple-500/10 transition-colors">SET</button>
                        </div>
                    </section>

                    {/* Team Assignment */}
                    <section>
                        <h3 className="text-[0.55rem] font-black text-[#444] mb-1">TEAM ASSIGNMENT</h3>
                        {(modalMeta.team || modalP.team) && <p className="text-[0.65rem] text-blue-400 mb-1">Current: <span className="text-white font-bold">{modalMeta.team || modalP.team}</span></p>}
                        <div className="flex gap-1">
                            <div className="flex items-center gap-1 flex-1 bg-black border border-[#222] rounded px-2">
                                <UserPlus size={10} className="text-blue-400 shrink-0" />
                                <input value={teamInputs[modalId] || ""} onChange={e => setTeamInputs(prev => ({ ...prev, [modalId]: e.target.value }))}
                                    onKeyDown={e => e.key === "Enter" && assignTeam(modalId, teamInputs[modalId])}
                                    placeholder="Assign team..." className="bg-transparent text-[0.65rem] text-white outline-none py-1.5 flex-1 placeholder-[#333]" />
                            </div>
                            <button onClick={() => assignTeam(modalId, teamInputs[modalId])}
                                className="text-[0.55rem] font-black text-blue-400 border border-blue-500/30 rounded px-3 hover:bg-blue-500/10 transition-colors">SET</button>
                        </div>
                    </section>

                    {/* Tags */}
                    <section>
                        <h3 className="text-[0.55rem] font-black text-[#444] mb-1">TAGS</h3>
                        {modalMeta.customTags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-1">
                                {modalMeta.customTags.map((t, idx) => (
                                    <span
                                        key={idx}
                                        className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full bg-[#111827] text-[#e5e7eb] border border-[#1f2937]"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-1">
                            <input
                                value={tagInputs[modalId] || ""}
                                onChange={e => setTagInputs(prev => ({ ...prev, [modalId]: e.target.value }))}
                                onKeyDown={e => e.key === "Enter" && addCustomTag(modalId, tagInputs[modalId])}
                                placeholder="Add tag..."
                                className="flex-1 bg-black border border-[#222] rounded px-2 py-1.5 text-[0.65rem] text-white outline-none focus:border-[#444] placeholder-[#333]"
                            />
                            <button
                                onClick={() => addCustomTag(modalId, tagInputs[modalId])}
                                className="text-[0.55rem] font-black text-blue-400 border border-blue-500/30 rounded px-3 hover:bg-blue-500/10 transition-colors"
                            >
                                ADD
                            </button>
                        </div>
                    </section>

                    {/* Notes & Comments */}
                    <section>
                        <h3 className="text-[0.55rem] font-black text-[#444] mb-1">NOTES & ACTIVITY ({modalVisible.length})</h3>
                        <div className="flex gap-1 mb-2">
                            <input value={noteInputs[modalId] || ""} onChange={e => setNoteInputs(prev => ({ ...prev, [modalId]: e.target.value }))}
                                onKeyDown={e => e.key === "Enter" && addNote(modalId, noteInputs[modalId])}
                                placeholder="Add a note..." className="flex-1 bg-black border border-[#222] rounded px-2 py-1.5 text-[0.65rem] text-white outline-none focus:border-[#444] placeholder-[#333]" />
                            <button onClick={() => addNote(modalId, noteInputs[modalId])} className="text-blue-400 hover:text-blue-300 p-1"><Send size={13} /></button>
                        </div>
                        {modalVisible.length > 0 && (
                            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                                {modalVisible.map((n, ni) => {
                                    const text = nt(n);
                                    const isEvent = text.startsWith("🏷️") || text.startsWith("🚪") || text.startsWith("🎮");
                                    return (
                                        <div key={ni} className={`flex items-start gap-2 text-[0.6rem] rounded p-2 border ${isEvent ? "bg-[#0a0a10] border-blue-500/10" : "bg-[#060608] border-[#141416]"}`}>
                                            {n.avatar && <img src={n.avatar} className="w-4 h-4 rounded-full mt-0.5 shrink-0" alt="" />}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-white/60">{n.author || "?"}</span>
                                                    <span className="text-[#333]">{n.timestamp ? timeago(n.timestamp) : ""}</span>
                                                </div>
                                                <p className="text-white/50 break-words leading-relaxed">{text}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-[#1a1a1c]">
                        <button onClick={() => { setTransitModal({ id: modalId, name: modalP.displayName, type: 'out' }); setModalId(null); }}
                            className="text-[0.6rem] font-black text-rose-400 border border-rose-500/30 rounded px-3 py-1.5 hover:bg-rose-500/10 transition-colors flex items-center gap-1 uppercase">
                            <LogOut size={10} /> DEPARTURE
                        </button>
                        <button onClick={() => { setTransitModal({ id: modalId, name: modalP.displayName, type: 'in' }); setModalId(null); }}
                            className="text-[0.6rem] font-black text-emerald-400 border border-emerald-500/30 rounded px-3 py-1.5 hover:bg-emerald-500/10 transition-colors flex items-center gap-1 uppercase">
                            <CheckCircle size={10} /> ARRIVAL BACK
                        </button>
                        <button onClick={() => setModalId(null)}
                            className="text-[0.6rem] font-black text-[#444] border border-[#222] rounded px-3 py-1.5 hover:text-white transition-colors ml-auto uppercase">
                            CLOSE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
