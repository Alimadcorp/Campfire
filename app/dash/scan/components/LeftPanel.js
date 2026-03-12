import { Users, CheckCircle, UsersRound, Clock, Gamepad2, Search, ChevronLeft, ChevronRight, Filter, ArrowUpDown } from "lucide-react";
import ParticipantCard from "./ParticipantCard";
import { TAG_COLORS, parseMeta, visibleNotes } from "../utils";

export default function LeftPanel({
    leftMode,
    setLeftMode,
    rightPanelOpen,
    setRightPanelOpen,
    leftSearch,
    setLeftSearch,
    filters,
    cycleFilter,
    sortBy,
    setSortBy,
    tagFilters,
    setTagFilters,
    allTags,
    customFilters,
    setCustomFilters,
    tableLoading,
    tableError,
    pageData,
    notes,
    openParticipant,
    noteInputs,
    setNoteInputs,
    addNote,
    canViewPII,
    totalPages,
    safePage,
    setPage,
    sortedTeams,
    teamGroups,
    showTimestamps,
    setShowTimestamps,
    timelineEntries,
    timelineLoading,
    participants,
    allParts,
    stats
}) {
    return (
        <div className="flex-1 flex flex-col min-w-0 border-r border-[#141416]">
            {/* Left header */}
            <div className="p-4 border-b border-white/5 bg-[#080808]/50 backdrop-blur-md shrink-0">
                {/* Stats Summary */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                        { label: "REGISTERED", val: stats.total, color: "text-white/40", bg: "bg-white/5" },
                        { label: "CHECK-INS", val: stats.scanned, color: "text-blue-400", bg: "bg-blue-500/10" },
                        { label: "IN VENUE", val: stats.inVenue, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { label: "ON BREAK", val: stats.out, color: "text-amber-400", bg: "bg-amber-500/10" }
                    ].map(s => (
                        <div key={s.label} className={`${s.bg} border border-white/10 rounded-xl p-2.5 flex flex-col items-center justify-center gap-0.5 transition-all hover:scale-[1.02] shadow-sm relative group`}>
                            <span className={`text-[0.5rem] font-black tracking-[0.2em] uppercase ${s.color}`}>{s.label}</span>
                            <span className="text-[1.2rem] font-mono font-black tabular-nums text-white leading-none">{s.val}</span>
                            {s.label === "IN VENUE" && (
                                <span className="absolute -bottom-1 text-[0.4rem] font-bold text-white/20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                    {stats.vStaff} STAFF | {stats.vParts} GUESTS
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-1.5 mb-4 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button onClick={() => setLeftMode("participants")}
                        className={`flex-1 text-[0.7rem] font-black py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${leftMode === "participants" ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "text-white/40 hover:text-white/80 hover:bg-white/5"}`}>
                        <Users size={14} /> <span className="tracking-widest capitalize">DATABASE</span>
                    </button>
                    <button onClick={() => setLeftMode("venue")}
                        className={`flex-1 text-[0.7rem] font-black py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${leftMode === "venue" ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "text-white/40 hover:text-white/80 hover:bg-white/5"}`}>
                        <CheckCircle size={14} /> <span className="tracking-widest uppercase">VENUE</span>
                    </button>
                    <button onClick={() => setLeftMode("teams")}
                        className={`flex-1 text-[0.7rem] font-black py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${leftMode === "teams" ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]" : "text-white/40 hover:text-white/80 hover:bg-white/5"}`}>
                        <UsersRound size={14} /> <span className="tracking-widest">TEAMS</span>
                    </button>
                    <button onClick={() => setLeftMode("timeline")}
                        className={`flex-1 text-[0.7rem] font-black py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${leftMode === "timeline" ? "bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]" : "text-white/40 hover:text-white/80 hover:bg-white/5"}`}>
                        <Clock size={14} /> <span className="tracking-widest">LOG</span>
                    </button>
                    <button onClick={() => setRightPanelOpen(p => !p)}
                        className={`px-3 text-[0.7rem] font-black py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${rightPanelOpen ? "bg-white/10 text-white/80" : "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"}`}>
                        <Gamepad2 size={14} />
                    </button>
                </div>
                <div className="relative mb-2">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                    <input value={leftSearch} onChange={e => setLeftSearch(e.target.value)}
                        placeholder="Search name, email, phone, id..."
                        className="w-full bg-[#0c0c0e] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-[0.8rem] font-bold text-white outline-none focus:border-blue-500 transition-all placeholder-white/10" />
                </div>
                <div className="flex gap-1 flex-wrap">
                    {/* Tri-state Filter Pills */}
                    {[["vol", "VOL"], ["org", "ORG"], ["dis", "DIS"], ["cin", "CIN"], ["fil", "FIL"], ["sin", "SIN"]].map(([k, l]) => (
                        <button key={k} onClick={() => cycleFilter(k)}
                            className={`text-[0.45rem] font-black px-1.5 py-1 rounded border transition-all ${filters[k] === true ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                                : filters[k] === false ? "bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                                    : "bg-white/5 text-white/30 border-white/5 hover:text-white/60 hover:bg-white/10"
                                }`}>
                            {filters[k] === true ? "✓ " : filters[k] === false ? "✗ " : ""}{l}
                        </button>
                    ))}
                    <div className="w-px h-4 bg-white/5 mx-1" />
                    {/* Sort Dropdown */}
                    <div className="relative group">
                        <button className="text-[0.65rem] font-black px-2.5 py-1.5 rounded border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20 flex items-center gap-1.5 transition-all">
                            <ArrowUpDown size={10} /> SORT: {sortBy.toUpperCase()}
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-40 bg-[#0c0c0e] border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                            {[["name", "$ A-Z"], ["nameZ", "$ Z-A"], ["age", "Age ↑"], ["ageD", "Age ↓"], ["signup", "Date ↑"], ["signupD", "Date ↓"], ["cin", "Checkin"], ["exp", "Experience"], ["rating", "Rating"], ["lastNote", "Last Activity"]].map(([v, l]) => (
                                <button key={v} onClick={() => setSortBy(v)} className={`w-full text-left px-3 py-2 text-[0.7rem] font-bold hover:bg-white/5 transition-colors ${sortBy === v ? "text-blue-400 bg-blue-500/5" : "text-white/40"}`}>{l}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tag Filters */}
                <div className="flex gap-1.5 flex-wrap mt-2.5 overflow-x-auto pb-1 no-scrollbar">
                    {allTags.map(t => (
                        <button key={t} onClick={() => setTagFilters(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                            className={`text-[0.65rem] font-black px-2.5 py-1 rounded-full border transition-all whitespace-nowrap ${tagFilters.includes(t) ? "bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : "bg-white/5 text-white/40 border-white/5 hover:text-white/60 hover:bg-white/10"}`}>
                            #{t.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Advanced Filters Toggle */}
                <div className="mt-3 flex items-center justify-between">
                    <button onClick={() => setCustomFilters(prev => prev.length ? [] : [{ field: "displayName", operator: "CONTAINS", value: "", type: "SELECT" }])}
                        className={`text-[0.65rem] font-black px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 ${customFilters.length ? "bg-purple-500/20 text-purple-400 border-purple-500/50" : "text-white/20 border-white/5 hover:text-white/50"}`}>
                        <Filter size={10} /> {customFilters.length ? `FILTERS (${customFilters.length})` : "ADVANCED FILTERS"}
                    </button>
                    <div className="flex gap-3">
                        {filters.vol !== null || filters.org !== null || filters.dis || filters.cin !== null || filters.fil !== null || filters.sin !== null || tagFilters.length > 0 || customFilters.length > 0 ? (
                            <button onClick={() => { setFilters({ vol: null, org: null, dis: false, cin: null, fil: null, sin: null }); setTagFilters([]); setCustomFilters([]); }}
                                className="text-[0.65rem] font-black text-rose-400 hover:text-rose-300 underline underline-offset-4 uppercase tracking-widest transition-colors">
                                Clear All
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* Custom Filters Builder */}
                {customFilters.length > 0 && (
                    <div className="mt-3 p-3 bg-black/40 border border-[#1a1a1c] rounded-lg flex flex-col gap-2 shadow-inner">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[0.55rem] font-black text-purple-400/60 tracking-widest uppercase">Filter Logic</span>
                            <button onClick={() => setCustomFilters([...customFilters, { field: "displayName", operator: "CONTAINS", value: "", type: "SELECT" }])}
                                className="text-[0.5rem] font-black bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 hover:bg-purple-500/20 transition-all">+ ADD RULE</button>
                        </div>
                        {customFilters.map((f, idx) => (
                            <div key={idx} className="flex gap-1 bg-[#060608] p-1.5 rounded-lg border border-[#141416]">
                                <select value={f.type} onChange={e => { const n = [...customFilters]; n[idx].type = e.target.value; setCustomFilters(n); }}
                                    className={`bg-black text-[0.5rem] font-black border border-[#222] rounded px-1 outline-none ${f.type === "SELECT" ? "text-emerald-400" : "text-rose-400"}`}>
                                    <option value="SELECT">SELECT</option><option value="EXCLUDE">EXCLUDE</option>
                                </select>
                                <select value={f.field} onChange={e => { const n = [...customFilters]; n[idx].field = e.target.value; setCustomFilters(n); }}
                                    className="bg-black text-[0.5rem] border border-[#222] rounded px-1 text-white/70 outline-none flex-1">
                                    <option value="displayName">Name</option><option value="legalFirstName">Leg. First</option>
                                    <option value="legalLastName">Leg. Last</option><option value="email">Email</option>
                                    <option value="phone">Phone</option><option value="age">Age</option>
                                    <option value="referralContext">Referral</option><option value="shirtSize">Shirt</option>
                                    <option value="dietaryRestrictions">Diet</option><option value="additionalAccommodations">Accom</option>
                                    <option value="cnic">CNIC</option><option value="discord">Discord</option>
                                    <option value="engine">Engine</option><option value="exp">Exp</option>
                                    <option value="team">Team</option><option value="notesStr">Notes</option>
                                </select>
                                <select value={f.operator} onChange={e => { const n = [...customFilters]; n[idx].operator = e.target.value; setCustomFilters(n); }}
                                    className="bg-black text-[0.5rem] border border-[#222] rounded px-1 text-white outline-none">
                                    <option value="CONTAINS">CONTAINS</option><option value="END">ENDS WITH</option>
                                    <option value="EQUAL">EQUALS</option><option value="START AT">STARTS WITH</option>
                                </select>
                                <input type="text" value={f.value} onChange={e => { const n = [...customFilters]; n[idx].value = e.target.value; setCustomFilters(n); }}
                                    placeholder="val..." className="bg-black text-[0.5rem] border border-[#222] rounded px-1 text-white outline-none flex-1 min-w-[40px]" />
                                <button onClick={() => setCustomFilters(customFilters.filter((_, i) => i !== idx))}
                                    className="text-rose-500 hover:text-rose-400 text-[0.5rem] font-bold px-0.5">[X]</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Left content */}
            <div className="flex-1 overflow-y-auto p-2">
                {tableLoading && <p className="text-center text-[0.65rem] text-[#333] mt-8">Loading participants...</p>}
                {tableError && <p className="text-center text-[0.65rem] text-rose-400/60 mt-8">{tableError}</p>}

                {(leftMode === "participants" || leftMode === "venue") && !tableLoading && !tableError && (
                    <>
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-1.5">
                            {pageData.map(p => {
                                const pn = notes[p.id] || [];
                                const meta = parseMeta(pn);
                                const tagColor = TAG_COLORS.find(c => c.name === meta.color);
                                const recentNotes = visibleNotes(pn).slice(-2);
                                return (
                                    <ParticipantCard
                                        key={p.id}
                                        p={p}
                                        notes={notes}
                                        openParticipant={openParticipant}
                                        meta={meta}
                                        tagColor={tagColor}
                                        recentNotes={recentNotes}
                                        noteInputs={noteInputs}
                                        setNoteInputs={setNoteInputs}
                                        addNote={addNote}
                                        canViewPII={canViewPII}
                                    />
                                );
                            })}
                        </div>
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 py-4 mt-3">
                                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0}
                                    className={`flex items-center gap-1.5 text-[0.7rem] font-black px-3 py-1.5 rounded-lg border transition-all ${safePage === 0 ? 'text-white/10 border-white/5 cursor-default' : 'text-white/60 border-white/10 hover:text-white hover:border-white/30 hover:bg-white/5 shadow-sm'}`}>
                                    <ChevronLeft size={14} /> PREV
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button key={i} onClick={() => setPage(i)}
                                            className={`w-8 h-8 rounded-lg text-[0.7rem] font-black transition-all ${i === safePage ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-white/20 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))} disabled={safePage >= totalPages - 1}
                                    className={`flex items-center gap-1.5 text-[0.7rem] font-black px-3 py-1.5 rounded-lg border transition-all ${safePage >= totalPages - 1 ? 'text-white/10 border-white/5 cursor-default' : 'text-white/60 border-white/10 hover:text-white hover:border-white/30 hover:bg-white/5 shadow-sm'}`}>
                                    NEXT <ChevronRight size={14} />
                                </button>
                                <span className="text-[0.65rem] font-black text-white/10 ml-2 tracking-widest">SHIFT+←→</span>
                            </div>
                        )}
                    </>
                )}

                {leftMode === "teams" && !tableLoading && !tableError && (
                    <div className="flex flex-col gap-2">
                        {sortedTeams.map(teamName => (
                            <div key={teamName} className="bg-[#0c0c0e] border border-[#141416] rounded overflow-hidden">
                                <div className="px-3 py-2 border-b border-[#111] flex items-center justify-between">
                                    <span className={`text-[0.65rem] font-black ${teamName === "Unassigned" ? "text-[#444]" : "text-white"}`}>{teamName}</span>
                                    <span className="text-[0.5rem] text-[#444]">{teamGroups[teamName].length}</span>
                                </div>
                                <div className="flex flex-col">
                                    {teamGroups[teamName].map(p => {
                                        const meta = parseMeta(notes[p.id] || []);
                                        const tagColor = TAG_COLORS.find(c => c.name === meta.color);
                                        return (
                                            <button key={p.id} onClick={() => openParticipant(p.id)}
                                                className="w-full text-left px-3 py-1.5 hover:bg-[#141416] transition-colors flex items-center gap-2 border-b border-[#0e0e10] last:border-0">
                                                {tagColor && <span className={`w-1.5 h-1.5 rounded-full ${tagColor.bg} shrink-0`} />}
                                                <span className="text-[0.6rem] text-white/80 truncate">{p.displayName}</span>
                                                {meta.rating > 0 && <span className="text-[0.45rem] text-amber-400 shrink-0">{"★".repeat(meta.rating)}</span>}
                                                {meta.game && <span className="text-[0.45rem] text-purple-400/50 shrink-0 ml-auto truncate max-w-24">🎮 {meta.game}</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {leftMode === "timeline" && (
                    <Timeline
                        showTimestamps={showTimestamps}
                        setShowTimestamps={setShowTimestamps}
                        timelineEntries={timelineEntries}
                        timelineLoading={timelineLoading}
                        participants={participants}
                        allParts={allParts}
                        openParticipant={openParticipant}
                    />
                )}
            </div>
        </div>
    );
}

function Timeline({ showTimestamps, setShowTimestamps, timelineEntries, timelineLoading, participants, allParts, openParticipant }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-2 px-2">
                <button onClick={() => setShowTimestamps(!showTimestamps)}
                    className={`text-[0.65rem] font-black px-2.5 py-1 rounded-lg border transition-all ${showTimestamps ? "text-blue-400 border-blue-500 bg-blue-500/10 shadow-inner" : "text-white/20 border-white/5 hover:text-white/60 hover:bg-white/5"}`}>
                    {showTimestamps ? "✓ " : ""}SHOW NOTES
                </button>
                <span className="text-[0.65rem] font-black text-white/10 ml-auto tracking-widest">{timelineEntries.length} EVENTS</span>
            </div>
            {timelineLoading && <p className="text-center text-[0.65rem] text-[#333] mt-8">Loading timeline...</p>}
            {!timelineLoading && timelineEntries.length === 0 && <p className="text-center text-[0.65rem] text-[#333] mt-8">No activity yet</p>}
            {!timelineLoading && (() => {
                const display = showTimestamps ? timelineEntries : timelineEntries.filter(e => e._type !== 'note');
                return display.map((ev, i) => {
                    const t = new Date(ev.time);
                    const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    const dateStr = t.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    const pid = ev._participantId;
                    const p = pid ? (participants[pid] || allParts.find(x => x.id === pid)) : null;
                    const prevEv = display[i - 1];
                    const prevDate = prevEv ? new Date(prevEv.time).toLocaleDateString() : null;
                    const showDateHeader = t.toLocaleDateString() !== prevDate;
                    const typeIcon = { checkin: '→', departure: '🚪', team: '🏷️', game: '🎮', note: '💬' }[ev._type] || '•';
                    const typeColor = { checkin: 'text-emerald-400', departure: 'text-rose-400', team: 'text-blue-400', game: 'text-purple-400', note: 'text-white/40' }[ev._type] || 'text-[#444]';
                    return (
                        <div key={(ev._scanId || '') + ev.time + i}>
                            {showDateHeader && (
                                <div className="flex items-center gap-3 py-3 mt-2">
                                    <div className="flex-1 h-px bg-white/5" />
                                    <span className="text-[0.65rem] font-black text-white/20 tracking-[0.2em]">{dateStr.toUpperCase()}</span>
                                    <div className="flex-1 h-px bg-white/5" />
                                </div>
                            )}
                            <div className="flex items-start gap-2 bg-[#0c0c0e] border border-[#141416] rounded p-2 hover:border-[#222] transition-colors">
                                <div className="flex flex-col items-center shrink-0 w-16 px-1">
                                    <span className="text-[0.6rem] font-black text-blue-400/60 tabular-nums">{timeStr}</span>
                                    <span className={`text-[1rem] ${typeColor} font-black mt-0.5`}>{typeIcon}</span>
                                </div>
                                <div className="w-px self-stretch bg-white/5 shrink-0" />
                                <div className="flex-1 min-w-0 pr-2">
                                    {ev._type === 'checkin' && (
                                        <>
                                            <div className="text-[0.6rem] font-black text-white/20 tracking-wider mb-0.5">{(ev.scannerId || ev.userId || 'Scanner').toUpperCase()}{ev.num != null ? ` #${ev.num}` : ''}</div>
                                            {p ? (
                                                <button onClick={() => openParticipant(pid)} className="text-[0.75rem] font-black text-emerald-400 hover:text-emerald-300 hover:underline underline-offset-4 truncate block text-left transition-colors">
                                                    {p.displayName}
                                                </button>
                                            ) : (
                                                <p className="text-[0.65rem] text-white/40 font-mono truncate">{ev.data}</p>
                                            )}
                                        </>
                                    )}
                                    {ev._type !== 'checkin' && (
                                        <>
                                            {p && <button onClick={() => openParticipant(pid)} className="text-[0.7rem] font-black text-white/60 hover:text-white hover:underline underline-offset-4 truncate block text-left transition-colors">{p.displayName}</button>}
                                            <p className={`text-[0.75rem] font-bold ${typeColor} truncate mt-0.5 leading-tight`}>{ev._noteText}</p>
                                            {ev._noteAuthor && <span className="text-[0.6rem] font-black text-white/20 tracking-widest mt-1 block uppercase">— {ev._noteAuthor}</span>}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                });
            })()}
        </div>
    );
}
