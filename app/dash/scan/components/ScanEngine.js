import { Users, ChevronUp, ChevronDown, ExternalLink, LogOut, Send, Smartphone, Activity, Clock, ShieldCheck, Gamepad } from "lucide-react";
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
    deviceMeta,
    setDevicesModalOpen
}) {
    return (
        <div className="w-[450px] shrink-0 bg-[#060608] border-l border-white/5 shadow-[-20px_0_80px_rgba(0,0,0,0.8)] z-20 h-screen grid grid-rows-[auto,1fr,auto]">    {/* Header / Command Center */}
            <div className="p-6 border-b border-white/5 bg-[#08080a]/80 backdrop-blur-xl shrink-0">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <h2 className="text-2xl font-primary text-white flex items-center gap-1">
                            CAMPFIRE LAHORE
                            <span className="flex h-2 w-2 relative">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status === "LIVE" ? "bg-emerald-400" : "bg-rose-400"} opacity-75`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${status === "LIVE" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                            </span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-1">
                        <button onClick={() => setDevicesModalOpen(true)} className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all">
                            <Smartphone size={18} className="text-white/40 group-hover:text-blue-400 transition-colors" />
                            {devices.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-[0.6rem] font-black text-white rounded-full flex items-center justify-center border-2 border-[#08080a]">
                                    {devices.length}
                                </span>
                            )}
                        </button>
                        <Tooltip label="Rescan All">
                            <button onClick={rescanAll} className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all">
                                <Activity size={18} className="text-white/40 hover:text-rose-400 transition-colors" />
                            </button>
                        </Tooltip>
                    </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                    <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-2xl p-3 flex flex-col gap-1">
                        <span className="text-[0.5rem] font-black text-white/20 uppercase ">Connection</span>
                        <span className="text-[0.7rem] font-bold text-white/70">{credsRef.current.channel || "Not Connected"}</span>
                    </div>
                    <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-2xl p-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[0.5rem] font-black text-white/20 uppercase ">Active Admins</span>
                            <Users size={10} className="text-white/20" />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[0.7rem] font-bold text-white/70">{listenerCount}</span>
                            <div className="flex -space-x-1.5 ml-1">
                                {listenerUsers.slice(0, 3).map((u, idx) => (
                                    <img key={idx} src={u.avatar || u.image || ""} className="w-4 h-4 rounded-full border border-black ring-1 ring-white/10" alt="" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manual Entry */}
                <div className="mb-3 relative group">
                    <Activity size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        placeholder="MANUAL ENTRY / QR DATA..."
                        onKeyDown={e => {
                            if (e.key === "Enter" && e.target.value.trim()) {
                                if (window.onManualScan) window.onManualScan(e.target.value.trim());
                                e.target.value = "";
                            }
                        }}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-[0.7rem] font-black text-white outline-none focus:border-blue-500/50 transition-all placeholder-white/10 shadow-inner"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.5rem] font-black text-white/10 tracking-widest">ENTER ↵</div>
                </div>

                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                    <button onClick={() => setShowHistory(false)}
                        className={`flex-1 text-[0.65rem] font-black py-2.5 rounded-xl transition-all uppercase  ${!showHistory ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}>
                        Real-time
                    </button>
                    <button onClick={() => setShowHistory(true)}
                        className={`flex-1 text-[0.65rem] font-black py-2.5 rounded-xl transition-all uppercase  ${showHistory ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}>
                        History
                    </button>
                </div>
            </div>

            {/* Stream */}
            <div className="overflow-y-auto p-4 space-y-4">
                {filtered.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-10 py-2">
                        <Activity size={64} className="mb-1" />
                        <span className="text-[0.7rem] font-black uppercase">Waiting...</span>
                    </div>
                )}

                {filtered.map((s, i) => {
                    const info = st[s._status] || { color: "text-white/20", label: s._status?.toUpperCase() || "IDLE" };
                    const pid = s._participantId;
                    const p = pid ? participants[pid] : null;
                    const isOpen = pid && expanded[pid];
                    const isHistoryItem = !s._isNew;

                    return (
                        <div key={s.time + i}
                            className={`group bg-[#0c0c0e] border rounded-md overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-blue-500/50' : ''} ${s._status === "valid" ? "border-emerald-500/20" : s._status === "already" ? "border-amber-500/20" : s._status === "invalid" ? "border-rose-500/20" : "border-white/5"} ${isHistoryItem ? 'opacity-60 grayscale-[0.3]' : 'animate-in slide-in-from-right-8 duration-500'}`}>

                            {/* Card Content */}
                            <div className="p-1">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-1">
                                        <div className={`w-2 h-2 rounded-full ${s._status === 'valid' ? 'bg-emerald-500' : s._status === 'already' ? 'bg-amber-500' : 'bg-white/10'}`} />
                                        <span className="text-[0.6rem] font-black text-white/30 uppercase ">{s.scannerId || "Client Node"}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[0.6rem] font-bold text-white/20">
                                        <Clock size={10} />
                                        {s.time ? timeago(s.time) : "Just now"}
                                    </div>
                                </div>

                                <div className="font-mono text-xs font-black text-white/90 break-all mb-1 bg-black/60 px-4 py-3 rounded-sm border border-white/5 leading-relaxed  group-hover:border-blue-500/30 transition-all">
                                    {s.data}
                                </div>

                                <div className="flex items-center justify-between gap-1">
                                    <div className={`px-3 py-1.5 rounded-full border text-[0.6rem] font-black uppercase  flex items-center gap-1 ${s._status === 'valid' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : s._status === 'already' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-white/30'}`}>
                                        {s._status === 'valid' && <ShieldCheck size={12} />}
                                        {info.label}
                                    </div>

                                    <div className="flex gap-1">
                                        {s._status === "error" && (
                                            <button onClick={() => retryCheck(s)} className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                                                <Activity size={16} />
                                            </button>
                                        )}
                                        {pid && p ? (
                                            <div className="flex gap-1.5">
                                                <button onClick={() => openParticipant(pid)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                                                    <ExternalLink size={16} />
                                                </button>
                                                <button onClick={() => setExpanded(prev => ({ ...prev, [pid]: !prev[pid] }))} className={`p-2.5 rounded-xl border transition-all ${isOpen ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/40' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}>
                                                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Participant Summary */}
                                {s._scanResult?.participant && !isOpen && (
                                    <div onClick={() => pid && openParticipant(pid)} className="mt-1 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-blue-500/30 transition-all cursor-pointer flex items-center justify-between group/sub">
                                        <div className="flex items-center gap-1 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                                                <span className="text-blue-400 font-black text-sm">{s._scanResult.participant.displayName?.[0]}</span>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-black text-white truncate">{s._scanResult.participant.displayName}</span>
                                                <span className="text-[0.6rem] font-bold text-white/20 truncate">{canViewPII ? s._scanResult.participant.email : "PROTECTED"}</span>
                                            </div>
                                        </div>
                                        <ExternalLink size={14} className="text-white/10 group-hover/sub:text-blue-400 transition-all" />
                                    </div>
                                )}
                            </div>

                            {/* Expanded Participant Control */}
                            {isOpen && p && (
                                <div className="bg-black/80 border-t border-white/5 p-6 animate-in slide-in-from-top-4 duration-300">
                                    <div className="flex items-center gap-1 mb-1">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500 border border-blue-400 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/30">
                                            {p.displayName?.[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-black text-white leading-none mb-1 truncate">{p.displayName}</h3>
                                            <div className="flex gap-1">
                                                {p.checkinCompleted && <span className="text-[0.5rem] font-black bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">VEHICLE IN</span>}
                                                {p.isVolunteer && <span className="text-[0.5rem] font-black bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full border border-orange-500/30">STAFF</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-1 mb-1 text-[0.65rem] font-bold">
                                        {[
                                            ["Email", canViewPII ? p.email : "REDACTED"],
                                            ["Phone", canViewPII ? p.phone : "REDACTED"],
                                            ["Age", p.age],
                                            ["Team", p.team || "None"]
                                        ].map(([label, val]) => (
                                            <div key={label} className="bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                                                <div className="text-[0.5rem] font-black text-white/20 uppercase mb-1.5">{label}</div>
                                                <div className="text-white/80 truncate">{val || "—"}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <div className="relative">
                                            <input value={teamInputs[pid] || ""} onChange={e => setTeamInputs(prev => ({ ...prev, [pid]: e.target.value }))}
                                                onKeyDown={e => e.key === "Enter" && assignTeam(pid, teamInputs[pid])}
                                                placeholder="Team Assignment..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-[0.7rem] font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder-white/10" />
                                            <button onClick={() => assignTeam(pid, teamInputs[pid])}
                                                className="absolute right-2 top-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[0.6rem] font-black uppercase rounded-lg border border-blue-500/20 transition-all">Set</button>
                                        </div>
                                        <div className="flex gap-1">
                                            <input value={noteInputs[pid] || ""} onChange={e => setNoteInputs(prev => ({ ...prev, [pid]: e.target.value }))}
                                                onKeyDown={e => e.key === "Enter" && addNote(pid, noteInputs[pid])}
                                                placeholder="Activity Note..." className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-[0.7rem] font-bold text-white outline-none focus:border-blue-500/50 transition-all placeholder-white/10" />
                                            <button onClick={() => addNote(pid, noteInputs[pid])} className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/40 shrink-0">
                                                <Send size={18} />
                                            </button>
                                            <button onClick={() => setTransitModal({ id: pid, name: p.displayName, type: 'out' })} className="w-12 h-12 flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500/20 transition-all shrink-0">
                                                <LogOut size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Bottom Footer Info */}
            <div className="px-6 py-4 bg-black border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[0.6rem] font-black text-white/20 uppercase ">
                    <ShieldCheck size={12} className="text-emerald-500/50" />
                    v2.0
                </div>
                <div className="flex items-center gap-1.5 text-[0.6rem] font-black text-white/20 uppercase ">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                    {status}
                </div>
            </div>
        </div>
    );
}

function Tooltip({ children, label }) {
    return (
        <div className="relative group">
            {children}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-1 bg-black border border-white/10 rounded text-[0.6rem] font-black text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] ">
                {label}
            </div>
        </div>
    );
}
