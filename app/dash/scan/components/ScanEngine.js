import { Users, ChevronUp, ChevronDown, ExternalLink, LogOut, UserPlus, Send } from "lucide-react";
import { format as timeago } from "timeago.js";

export default function ScanEngine({
    credsRef,
    status,
    listenerCount,
    listenerUsers,
    showHistory,
    setShowHistory,
    filtered,
    st,
    participants,
    expanded,
    setExpanded,
    notes,
    openParticipant,
    canViewPII,
    retryCheck,
    rescanAll,
    teamInputs,
    setTeamInputs,
    assignTeam,
    setTransitModal,
    noteInputs,
    setNoteInputs,
    addNote,
    devices,
    deviceMeta
}) {
    return (
        <div className="w-[480px] shrink-0 bg-[#080808] border-l border-[#141416] flex flex-col shadow-[-10px_0_50px_rgba(0,0,0,0.9)]">
            {/* Header */}
            <div className="p-4 border-b border-[#141416] shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[0.85rem] font-black tracking-[0.2em] text-white">ENGINE</span>
                        <span className="text-blue-400 opacity-80 text-[0.7rem] bg-blue-500/10 px-1.5 py-0.5 rounded">{credsRef.current.channel}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={rescanAll} className="text-[0.6rem] font-black text-rose-400/60 hover:text-rose-400 border border-rose-500/20 hover:border-rose-500/50 px-2 py-1 rounded transition-all uppercase tracking-widest">Rescan All</button>
                        <div className="flex items-center gap-2.5 text-[0.75rem] font-black text-white/40">
                            <span className={`w-2 h-2 rounded-full ${status === "LIVE" ? "bg-emerald-400 shadow-[0_0_10px_#10b981]" : "bg-rose-400 shadow-[0_0_10px_#f43f5e]"}`} />
                            <span className={status === "LIVE" ? "text-emerald-400" : "text-rose-400"}>{status}</span>
                            <span className="opacity-10">|</span>
                            <Users size={14} className="text-white/20" /> <span className="text-white/80">{listenerCount}</span>
                        </div>
                        {listenerUsers.length > 0 && (
                            <div className="flex -space-x-1.5">
                                {listenerUsers.slice(0, 5).map((u, idx) => (
                                    <img
                                        key={`${u.slackId || u.email || idx}`}
                                        src={u.avatar || u.image || ""}
                                        alt=""
                                        className="w-5 h-5 rounded-full border border-[#080808] object-cover ring-1 ring-white/10"
                                    />
                                ))}
                                {listenerUsers.length > 5 && (
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#080808] bg-white/5 text-[0.5rem] font-black text-white/40 ring-1 ring-white/10">
                                        +{listenerUsers.length - 5}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={() => setShowHistory(false)}
                        className={`text-[0.75rem] font-black py-2.5 rounded-xl border transition-all ${!showHistory ? "text-blue-400 border-blue-500/50 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "text-white/20 border-white/5 hover:text-white/60 hover:bg-white/5"}`}>
                        REALTIME
                    </button>
                    <button onClick={() => setShowHistory(true)}
                        className={`text-[0.75rem] font-black py-2.5 rounded-xl border transition-all ${showHistory ? "text-blue-400 border-blue-500/50 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "text-white/20 border-white/5 hover:text-white/60 hover:bg-white/5"}`}>
                        HISTORY
                    </button>
                </div>
            </div>

            {/* Stream */}
            <div className="overflow-y-auto p-2 grid grid-cols-1 gap-32">
                {filtered.length === 0 && <div className="text-center text-white/20 text-xs font-black mt-12 tracking-[0.2em]">WAITING FOR SCANS...</div>}
                {filtered.map((s, i) => {
                    const info = st[s._status] || { color: "text-[#444]", label: s._status?.toUpperCase() || "IDLE" };
                    const pid = s._participantId;
                    const p = pid ? participants[pid] : null;
                    const isOpen = pid && expanded[pid];
                    const isHistoryItem = !s._isNew;

                    return (
                        <div key={s.time + i} className={`bg-[#0c0c0e] border h-fit rounded-lg overflow-x-hidden transition-all ${s._status === "valid" ? "border-emerald-500/30 bg-emerald-500/[0.02]" : s._status === "already" ? "border-amber-500/30 bg-amber-500/[0.02]" : s._status === "invalid" ? "border-rose-500/30 bg-rose-500/[0.02]" : "border-white/5"} ${isHistoryItem ? 'opacity-60 saturate-50 shadow-inner' : 'shadow-lg shadow-black/50'}`}>
                            <div className="p-3">
                                <div className="flex justify-between text-[0.7rem] font-black mb-2">
                                    <span className="text-blue-400/80 uppercase tracking-widest">{s.scannerId || s.userId || "Client"}</span>
                                    <span className="text-white/40">{s.time ? timeago(s.time) : "?"}</span>
                                </div>
                                <div className="font-mono text-[0.75rem] text-white/90 font-bold break-all leading-relaxed mb-3 bg-black/60 px-2 py-1.5 rounded-lg border border-white/5 shadow-inner">{s.data}</div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-[0.75rem] font-black uppercase tracking-[0.15em] ${info.color} px-2.5 py-1 rounded-lg bg-black/80 border border-white/10 shadow-lg`}>{info.label}</span>
                                    <div className="flex gap-2">
                                        {s._status === "error" && <button onClick={() => retryCheck(s)} className="text-[0.7rem] font-black text-blue-400 hover:bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-500/30 transition-all">RETRY</button>}
                                        {pid && p && (
                                            <>
                                                <button onClick={() => openParticipant(pid)} className="text-[0.7rem] font-black text-purple-400 hover:bg-purple-500/20 px-3 py-1 rounded-lg border border-purple-500/30 transition-all">FULL</button>
                                                <button onClick={() => setExpanded(prev => ({ ...prev, [pid]: !prev[pid] }))}
                                                    className="text-[0.7rem] font-black text-blue-400 hover:bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-500/30 transition-all flex items-center gap-1">
                                                    {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />} {isOpen ? 'CLOSE' : 'QUICK'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {s._scanResult?.participant && !isOpen && (
                                    <div className="mt-2 text-[0.75rem] bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between group/row cursor-pointer hover:bg-white/10 transition-all" onClick={() => pid && openParticipant(pid)}>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-white font-black truncate tracking-tight">{s._scanResult.participant.displayName}</span>
                                            <span className="text-white/40 text-[0.65rem] truncate font-bold">{canViewPII ? s._scanResult.participant.email : "████████@███.███"}</span>
                                        </div>
                                        <ExternalLink size={14} className="text-white/20 group-hover/row:text-white/60 transition-colors" />
                                    </div>
                                )}
                            </div>

                            {isOpen && p && (
                                <div className="border-t border-white/5 bg-[#050505] p-3">
                                    <div className="flex items-center justify-between mb-3 px-1">
                                        <span className="font-black text-base text-white cursor-pointer hover:text-blue-400 transition-colors" onClick={() => openParticipant(pid)}>{p.displayName}</span>
                                        <div className="flex gap-1.5">
                                            {p.scanned && <span className="text-[0.65rem] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-lg border border-blue-500/20">SCANNED</span>}
                                            {p.checkinCompleted && <span className="text-[0.65rem] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/20">IN</span>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[0.7rem] bg-black/40 p-3 rounded-xl border border-white/5 mb-3">
                                        {[["Name", canViewPII ? `${p.legalFirstName || ""} ${p.legalLastName || ""}`.trim() : "██████████"], ["Email", canViewPII ? p.email : "████████"], ["Phone", canViewPII ? p.phone : "████████"], ["Age", p.age]].map(([l, v]) => (
                                            <div key={l} className="flex justify-between py-1 border-b border-white/[0.03] transition-colors">
                                                <span className="text-white/20 font-black uppercase tracking-widest text-[0.6rem]">{l}</span>
                                                <span className="text-white font-bold text-right truncate max-w-[65%]">{v || "—"}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-1.5">
                                            <input value={teamInputs[pid] || ""} onChange={e => setTeamInputs(prev => ({ ...prev, [pid]: e.target.value }))}
                                                onKeyDown={e => e.key === "Enter" && assignTeam(pid, teamInputs[pid])}
                                                placeholder="Assign team..." className="bg-black/80 border border-white/10 rounded-lg px-3 py-2 text-[0.75rem] font-bold text-white outline-none focus:border-blue-500 transition-all flex-1 placeholder-white/10" />
                                            <button onClick={() => assignTeam(pid, teamInputs[pid])}
                                                className="text-[0.65rem] font-black text-blue-400 border border-blue-500/30 rounded-lg px-4 hover:bg-blue-500/10 transition-all shrink-0">SET</button>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <input value={noteInputs[pid] || ""} onChange={e => setNoteInputs(prev => ({ ...prev, [pid]: e.target.value }))}
                                                onKeyDown={e => e.key === "Enter" && addNote(pid, noteInputs[pid])}
                                                placeholder="Quick note..." className="flex-1 bg-black/80 border border-white/10 rounded-lg px-3 py-2 text-[0.75rem] font-bold text-white outline-none focus:border-blue-500 transition-all placeholder-white/10" />
                                            <button onClick={() => addNote(pid, noteInputs[pid])} className="bg-blue-600 text-white rounded-lg px-3 hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"><Send size={14} /></button>
                                            <button onClick={() => setTransitModal({ id: pid, name: p.displayName, type: 'out' })}
                                                className="bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-lg px-3 hover:bg-rose-500/20 transition-all flex items-center gap-1.5 font-black text-[0.65rem]">
                                                <LogOut size={12} /> LEAVE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Online scanners */}
            <div className="p-4 border-t border-white/5 bg-[#050505] shrink-0 flex flex-col gap-2 pb-24 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                <span className="text-[0.65rem] font-black text-white/10 mb-0.5 tracking-[0.2em] uppercase">Online Scanner Nodes</span>
                {devices.length === 0 && <span className="text-[0.7rem] font-black text-white/5 py-4 text-center border border-dashed border-white/5 rounded-xl">NO ACTIVE NODES</span>}
                {devices.map(ip => {
                    const m = deviceMeta[ip] || {};
                    return (
                        <div key={ip} className="group relative flex justify-between items-center py-2 px-3 rounded-xl hover:bg-white/5 cursor-default transition-all border border-transparent hover:border-white/10">
                            <span className="text-[0.8rem] font-black text-white/80">{m.scanner_user_id || "Terminal"}</span>
                            <span className="text-[0.7rem] font-bold text-white/20 font-mono tracking-tighter">{ip}</span>
                            <div className="absolute right-full mr-4 bottom-2 w-64 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] shadow-[0_25px_80px_rgba(0,0,0,1)] ring-1 ring-white/5">
                                <p className="text-[0.65rem] font-black text-blue-400 mb-3 tracking-[0.2em] uppercase border-b border-white/5 pb-2">Node Environment</p>
                                <div className="grid gap-2 text-[0.75rem]">
                                    {[["Brand", m.brand], ["Model", m.model], ["SDK", m.sdkInt],
                                    ["Connected", m.last_connected ? timeago(m.last_connected) : "?"]
                                    ].map(([l, v]) => (
                                        <div key={l} className="flex justify-between items-center bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                            <span className="text-white/20 font-black text-[0.6rem] uppercase">{l}</span>
                                            <span className="text-white font-bold">{v || "?"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
