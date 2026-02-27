"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Gamepad2 } from "lucide-react";
import { ALLOWED_PII_VIEWERS, getDay, nt, parseMeta, isMetaNote, visibleNotes, matchSearch } from "./utils";

// Components
import ParticipantModal from "./components/ParticipantModal";
import TransitModal from "./components/TransitModal";
import LeftPanel from "./components/LeftPanel";
import ScanEngine from "./components/ScanEngine";
import TimestampTicker from "./components/TimestampTicker";

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function ScanPage() {
    // ── Scan Engine State ────────────────────────────────────────────────────
    const [authed, setAuthed] = useState(false);
    const [channel, setChannel] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [connecting, setConnecting] = useState(false);
    const [status, setStatus] = useState("OFF");
    const [listenerCount, setListenerCount] = useState(0);
    const [scans, setScans] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [devices, setDevices] = useState([]);
    const [deviceMeta, setDeviceMeta] = useState({});
    const [expanded, setExpanded] = useState({});
    const [participants, setParticipants] = useState({});

    // ── Shared State ─────────────────────────────────────────────────────────
    const [notes, setNotes] = useState({});
    const [noteInputs, setNoteInputs] = useState({});
    const [teamInputs, setTeamInputs] = useState({});
    const [gameInputs, setGameInputs] = useState({});
    const [transitModal, setTransitModal] = useState(null); // { id, name, type: 'in' | 'out' }
    const [transitNote, setTransitNote] = useState("");

    // ── Left Panel State ─────────────────────────────────────────────────────
    const [allParts, setAllParts] = useState([]);
    const [tableLoading, setTableLoading] = useState(true);
    const [tableError, setTableError] = useState("");
    const [leftMode, setLeftMode] = useState("participants");
    const [leftSearch, setLeftSearch] = useState("");
    const [filters, setFilters] = useState({ vol: null, org: null, dis: false, cin: null, fil: null, sin: null });
    const [showTimestamps, setShowTimestamps] = useState(false);
    const [modalId, setModalId] = useState(null);
    const [customFilters, setCustomFilters] = useState([]);
    const [scanHistory, setScanHistory] = useState([]);
    const [timelineLoading, setTimelineLoading] = useState(false);
    const [sortBy, setSortBy] = useState("name");
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 30;
    const [rightPanelOpen, setRightPanelOpen] = useState(true);
    const [canViewPII, setCanViewPII] = useState(false);
    const [listenerUsers, setListenerUsers] = useState([]);
    const [tagFilters, setTagFilters] = useState([]);
    const [flashNotes, setFlashNotes] = useState([]);
    const [tagInputs, setTagInputs] = useState({});
    const [nowMs, setNowMs] = useState(Date.now());

    const wsRef = useRef(null);
    const credsRef = useRef({ channel: "", password: "" });
    const processedScans = useRef(new Set());
    const scanCache = useRef({});
    const sessionRef = useRef({ name: "Unknown", avatar: "" });

    // ── Init ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        setChannel(localStorage.getItem("cf_channel") || "");
        setPassword(localStorage.getItem("cf_password") || "");
        try {
            scanCache.current = JSON.parse(localStorage.getItem("cf_scan_cache") || "{}");
        } catch (e) { scanCache.current = {}; }

        fetch("/api/auth/session").then(r => r.ok ? r.json() : {}).then(s => {
            if (s?.user) {
                sessionRef.current = { name: s.user.name || "Unknown", avatar: s.user.image || "", slackId: s.user.slackId || "" };
                setCanViewPII(ALLOWED_PII_VIEWERS.includes(s.user.slackId));
            }
        }).catch(() => { });
    }, []);

    // ── Timestamp ticker ──────────────────────────────────────────────────────
    useEffect(() => {
        const id = setInterval(() => setNowMs(Date.now()), 50);
        return () => clearInterval(id);
    }, []);

    // ── Fetch all participants from /api/event/table ──────────────────────────
    useEffect(() => {
        fetch("/api/event/table")
            .then(r => r.ok ? r.json() : Promise.reject(r.status))
            .then(data => {
                const merged = (data.participants || []).map(p => {
                    const f = data.fillout?.find(x => String(x.id) === String(p.id)) || data.fillout?.find(x => x.emailC === p.email);
                    return { ...p, hasFillout: !!f, cnic: f?.cnic || "", engine: f?.engine || "", exp: f?.exp ?? "", team: f?.team || "", discord: f?.discord || "", emailC: f?.emailC || "" };
                });
                setAllParts(merged);
            })
            .catch(e => setTableError(e === 401 ? "Login required" : e === 403 ? "No access" : "Failed to load"))
            .finally(() => setTableLoading(false));
    }, []);

    // ── WebSocket connection ──────────────────────────────────────────────────
    const connect = useCallback(() => {
        const { channel: ch, password: pw } = credsRef.current;
        const host = typeof window !== "undefined" && location.host.endsWith(":5500")
            ? "ws://localhost:8080" : "wss://ws.campfire.alimad.co";
        const ws = new WebSocket(host);
        wsRef.current = ws;

        ws.onopen = () => {
            setStatus("AUTH...");
            ws.send(JSON.stringify({ type: "auth", channel: ch, password: pw, role: "listener", user: sessionRef.current }));
        };
        ws.onmessage = (msg) => {
            try {
                const d = JSON.parse(msg.data);
                if (d.type === "auth") {
                    if (d.status === "success") {
                        localStorage.setItem("cf_channel", ch);
                        localStorage.setItem("cf_password", pw);
                        setAuthed(true); setStatus("LIVE"); setConnecting(false);
                    } else { setError(d.error || "Auth failed"); setConnecting(false); ws.close(); }
                    return;
                }
                if (d.type === "scan") setScans(prev => [{ ...d, _isNew: true, _status: "idle" }, ...prev].slice(0, 200));
                if (d.type === "history") {
                    const newScans = (d.scans || []).map(s => ({ ...s, _isNew: false, _status: "idle" }));
                    setScans(prev => {
                        const existingKeys = new Set(prev.map(x => `${x.time}|${x.data}`));
                        const filteredNew = newScans.filter(s => s.data && !existingKeys.has(`${s.time}|${s.data}`));
                        return [...prev, ...filteredNew];
                    });
                }
                if (d.type === "notes") {
                    setNotes(d.notes || {});
                    if (d.newNote && d.participantId) {
                        const note = d.newNote;
                        const pid = d.participantId;
                        const p = participants[pid] || allParts.find(x => x.id === pid);
                        const participantName = p?.displayName || pid;
                        const key = `${pid}-${note.timestamp || Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                        const text = nt(note);
                        setFlashNotes(prev => [...prev, {
                            key,
                            participantId: pid,
                            participantName,
                            text,
                            author: note.author || "Unknown",
                            avatar: note.avatar || ""
                        }]);
                        setTimeout(() => {
                            setFlashNotes(prev => prev.filter(n => n.key !== key));
                        }, 1500);
                    }
                }
                if (d.type === "scan_history") { setScanHistory(d.scans || []); setTimelineLoading(false); }
                if (d.type === "online_devices") { setDevices(d.devices || []); setDeviceMeta(d.metadataMap || {}); }
                if (d.type === "listener_count") {
                    setListenerCount(d.count);
                    setListenerUsers(d.users || []);
                }
            } catch { }
        };
        ws.onclose = () => { setStatus("OFFLINE"); setTimeout(connect, 3000); };
    }, [allParts, participants]);

    // ── Auto-process scans ────────────────────────────────────────────────────
    useEffect(() => {
        const pending = scans.filter(s => s._status === "idle" && s.data && !processedScans.current.has(`${s.time}|${s.data}`));
        if (!pending.length) return;

        // Process in batches or one by one
        pending.forEach(scan => {
            const key = `${scan.time}|${scan.data}`;
            processedScans.current.add(key);

            // Check cache first
            const cached = scanCache.current[scan.data];
            if (cached) {
                const ns = (cached.status === "already_scanned" || cached.status === "checkin_completed") ? "already" : "valid";
                if (cached.status === "not_found") {
                    setScans(prev => prev.map(s => (s.time === scan.time && s.data === scan.data) ? { ...s, _status: "invalid", _scanResult: cached } : s));
                } else {
                    setScans(prev => prev.map(s => (s.time === scan.time && s.data === scan.data) ? { ...s, _status: ns, _scanResult: cached, _participantId: cached.participant?.id } : s));
                    if (cached.participant?.id) fetchParticipant(cached.participant.id);
                }
                return;
            }

            setScans(prev => prev.map(s => (s.time === scan.time && s.data === scan.data) ? { ...s, _status: "checking" } : s));
            fetch(`/api/event/scan?day=${getDay()}&id=${encodeURIComponent(scan.data)}`)
                .then(r => r.ok ? r.json() : Promise.reject())
                .then(res => {
                    scanCache.current[scan.data] = res;
                    localStorage.setItem("cf_scan_cache", JSON.stringify(scanCache.current));

                    if (res.status === "not_found") {
                        setScans(prev => prev.map(s => (s.time === scan.time && s.data === scan.data) ? { ...s, _status: "invalid", _scanResult: res } : s));
                    } else {
                        const ns = (res.status === "already_scanned" || res.status === "checkin_completed") ? "already" : "valid";
                        setScans(prev => prev.map(s => (s.time === scan.time && s.data === scan.data) ? { ...s, _status: ns, _scanResult: res, _participantId: res.participant?.id } : s));
                        if (res.participant?.id) fetchParticipant(res.participant.id);
                    }
                })
                .catch(() => {
                    processedScans.current.delete(key);
                    setScans(prev => prev.map(s => (s.time === scan.time && s.data === scan.data) ? { ...s, _status: "error" } : s));
                });
        });
    }, [scans]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    async function fetchParticipant(id) {
        const existing = allParts.find(p => p.id === id);
        if (existing) { setParticipants(prev => ({ ...prev, [id]: existing })); setExpanded(prev => ({ ...prev, [id]: true })); return; }
        try { const r = await fetch(`/api/event/participant?id=${id}`); if (r.ok) { const p = await r.json(); setParticipants(prev => ({ ...prev, [id]: p })); setExpanded(prev => ({ ...prev, [id]: true })); } } catch { }
    }

    function addNote(id, text) {
        if (!text?.trim()) return;
        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "note_add", id, text: text.trim(), author: sessionRef.current.name, avatar: sessionRef.current.avatar }));
            setNoteInputs(prev => ({ ...prev, [id]: "" }));
        }
    }

    function setRating(id, v) { addNote(id, `⭐ RATING: ${v}`); }
    function setColorTag(id, c) { addNote(id, `🎨 TAG: ${c}`); }
    function setGameEntry(id, g) { if (!g?.trim()) return; addNote(id, `🎮 GAME: ${g.trim()}`); setGameInputs(prev => ({ ...prev, [id]: "" })); }
    function assignTeam(id, t) { if (!t?.trim()) return; addNote(id, `🏷️ TEAM ASSIGNED: ${t.trim()}`); setTeamInputs(prev => ({ ...prev, [id]: "" })); }
    function addCustomTag(id, tag) {
        if (!tag?.trim()) return;
        addNote(id, `🔖 TAG: ${tag.trim()}`);
        setTagInputs(prev => ({ ...prev, [id]: "" }));
    }
    function logLeave(id, name, reason) {
        addNote(id, `🚪 LEFT VENUE at ${new Date().toLocaleTimeString()}${reason ? ` — Reason: ${reason}` : ""}`);
        setTransitModal(null); setTransitNote("");
    }
    function logArrival(id, name, reason) {
        addNote(id, `🚪 ARRIVED BACK at ${new Date().toLocaleTimeString()}${reason ? ` — Note: ${reason}` : ""}`);
        setTransitModal(null); setTransitNote("");
    }

    function doConnect() {
        if (!channel.trim() || !password.trim()) return setError("Channel and password required");
        setError(""); setConnecting(true);
        credsRef.current = { channel: channel.trim(), password: password.trim() };
        connect();
    }

    function retryCheck(scan) {
        processedScans.current.delete(`${scan.time}|${scan.data}`);
        setScans(prev => prev.map(s => s.time === scan.time && s.data === scan.data ? { ...s, _status: "idle" } : s));
    }

    function rescanAll() {
        processedScans.current.clear();
        setScans(prev => prev.map(s => ({ ...s, _status: "idle" })));
    }

    function openParticipant(id) {
        setModalId(id);
        if (!participants[id]) {
            const ap = allParts.find(p => p.id === id);
            if (ap) setParticipants(prev => ({ ...prev, [id]: ap }));
            else fetchParticipant(id);
        }
    }

    // ── Computed ──────────────────────────────────────────────────────────────
    const recentScans = useMemo(() => scans.filter(s => s._isNew), [scans]);
    const historyScans = useMemo(() => {
        const combined = [...scanHistory, ...scans];
        combined.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
        const seen = new Set();
        const result = [];
        combined.forEach(s => {
            const key = `${s.time || ""}|${s.data || ""}`;
            if (seen.has(key)) return;
            seen.add(key);
            result.push(s);
        });
        return result;
    }, [scanHistory, scans]);

    const filteredScans = showHistory ? historyScans : recentScans;
    const st = {
        checking: { color: "text-blue-400", label: "CHECKING..." },
        valid: { color: "text-emerald-400", label: "✓ CHECKED IN" },
        already: { color: "text-amber-400", label: "⟳ ALREADY SCANNED" },
        invalid: { color: "text-rose-400", label: "✗ NOT FOUND" },
        error: { color: "text-rose-400", label: "FAILED" },
    };

    const allTags = useMemo(() => {
        const set = new Set();
        Object.values(notes || {}).forEach(pNotes => {
            const meta = parseMeta(pNotes || []);
            (meta.customTags || []).forEach(t => { if (t) set.add(t); });
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [notes]);

    const scannedIds = useMemo(() => {
        const ids = new Set();
        // Check current session scans
        scans.forEach(s => {
            if (s._participantId) ids.add(String(s._participantId));
            if (s._scanResult?.participant?.id) ids.add(String(s._scanResult.participant.id));
        });
        // Check historical scans from WS
        scanHistory.forEach(s => {
            if (s._participantId) ids.add(String(s._participantId));
            if (s.data) {
                ids.add(String(s.data));
                // Try cache for historical items too
                const cached = scanCache.current[s.data];
                if (cached?.participant?.id) ids.add(String(cached.participant.id));
            }
        });
        return ids;
    }, [scans, scanHistory, scanCache.current]);

    const leftFiltered = useMemo(() => allParts.map(p => {
        const pNotes = notes[p.id] || [];
        const notesStr = pNotes.map(n => typeof n === "string" ? n : n.text).join(" ");
        const meta = parseMeta(pNotes);
        const vis = visibleNotes(pNotes);
        const last = vis.length ? vis[vis.length - 1] : null;
        const lastTime = last?.timestamp || last?.time || 0;
        const scanned = scannedIds.has(String(p.id));
        return { ...p, notesStr, scanned, _meta: meta, _lastNoteTime: lastTime };
    }).filter(p => matchSearch(p, leftSearch)).filter(p => {
        if (filters.vol === true && !p.isVolunteer) return false;
        if (filters.vol === false && p.isVolunteer) return false;
        if (filters.org === true && !ALLOWED_PII_VIEWERS.includes(String(p.id))) return false; // Reusing PII as org proxy for simple check or import list
        if (filters.org === false && ALLOWED_PII_VIEWERS.includes(String(p.id))) return false;
        if (filters.dis === true && !p.disabled) return false;
        if (filters.dis === false && p.disabled) return false;
        if (filters.cin === true && !p.checkinCompleted) return false;
        if (filters.cin === false && p.checkinCompleted) return false;
        if (filters.fil === true && !p.hasFillout) return false;
        if (filters.fil === false && p.hasFillout) return false;
        if (filters.sin === true && !p.scanned) return false;
        if (filters.sin === false && p.scanned) return false;
        return true;
    }).filter(p => {
        return customFilters.every(f => {
            const val = String(p[f.field] || "").toLowerCase();
            const target = f.value.toLowerCase();
            let match = false;
            if (f.operator === "CONTAINS") match = val.includes(target);
            else if (f.operator === "END") match = val.endsWith(target);
            else if (f.operator === "EQUAL") match = val === target;
            else if (f.operator === "START AT") match = val.startsWith(target);
            return f.type === "SELECT" ? match : !match;
        });
    }).filter(p => {
        if (!tagFilters.length) return true;
        const tags = p._meta?.customTags || [];
        return tagFilters.some(t => tags.includes(t));
    }), [allParts, notes, leftSearch, filters, customFilters, tagFilters, scannedIds]);

    const sortedFiltered = useMemo(() => [...leftFiltered].sort((a, b) => {
        if (sortBy === "name") return (a.displayName || "").localeCompare(b.displayName || "");
        if (sortBy === "nameZ") return (b.displayName || "").localeCompare(a.displayName || "");
        if (sortBy === "age") return (Number(a.age) || 0) - (Number(b.age) || 0);
        if (sortBy === "ageD") return (Number(b.age) || 0) - (Number(a.age) || 0);
        if (sortBy === "signup") return new Date(a.createdTime || 0) - new Date(b.createdTime || 0);
        if (sortBy === "signupD") return new Date(b.createdTime || 0) - new Date(a.createdTime || 0);
        if (sortBy === "cin") return (b.checkinCompleted ? 1 : 0) - (a.checkinCompleted ? 1 : 0);
        if (sortBy === "exp") return (Number(b.exp) || 0) - (Number(a.exp) || 0);
        if (sortBy === "rating") return (b._meta?.rating || 0) - (a._meta?.rating || 0);
        if (sortBy === "lastNote") return (b._lastNoteTime || 0) - (a._lastNoteTime || 0);
        return 0;
    }), [leftFiltered, sortBy]);

    const venueList = useMemo(() => sortedFiltered.filter(p => p.scanned || p.checkinCompleted), [sortedFiltered]);

    useEffect(() => { setPage(0); }, [leftSearch, filters, customFilters, sortBy, leftMode]);

    function cycleFilter(key) {
        setFilters(prev => ({ ...prev, [key]: prev[key] === null ? true : prev[key] === true ? false : null }));
    }

    const timelineEntries = useMemo(() => {
        const events = [];
        const uuidFirstScan = new Map();
        const allScanEvents = [...scanHistory, ...scans];
        allScanEvents.forEach(s => {
            if (!s.data) return;
            const existing = uuidFirstScan.get(s.data);
            if (!existing || new Date(s.time) < new Date(existing.time)) uuidFirstScan.set(s.data, { ...s });
        });
        uuidFirstScan.forEach(s => events.push({ ...s, _type: 'checkin' }));
        Object.entries(notes).forEach(([pid, pNotes]) => {
            (pNotes || []).forEach(n => {
                const text = nt(n);
                if (isMetaNote(text)) return;
                const ts = n.timestamp || n.time;
                if (!ts) return;
                let type = 'note';
                if (text.startsWith('🚪')) type = text.includes('ARRIVED') ? 'arrival' : 'departure';
                else if (text.startsWith('🏷️')) type = 'team';
                else if (text.startsWith('🎮')) type = 'game';
                events.push({ time: typeof ts === 'number' ? new Date(ts).toISOString() : ts, _type: type, _participantId: pid, _noteText: text, _noteAuthor: n.author, _noteAvatar: n.avatar });
            });
        });
        return events.sort((a, b) => new Date(b.time) - new Date(a.time));
    }, [scanHistory, scans, notes]);

    const { teamGroups, sortedTeams } = useMemo(() => {
        const groups = {};
        leftFiltered.forEach(p => {
            const pn = notes[p.id] || [];
            const meta = parseMeta(pn);
            const t = meta.team || "Unassigned";
            if (!groups[t]) groups[t] = [];
            groups[t].push(p);
        });
        const sorted = Object.keys(groups).sort((a, b) => a === "Unassigned" ? 1 : b === "Unassigned" ? -1 : a.localeCompare(b));
        return { teamGroups: groups, sortedTeams: sorted };
    }, [leftFiltered, notes]);

    const { modalP, modalNotes, modalMeta, modalVisible } = useMemo(() => {
        const p = modalId ? (participants[modalId] || allParts.find(x => x.id === modalId)) : null;
        const mn = modalId ? (notes[modalId] || []) : [];
        return { modalP: p, modalNotes: mn, modalMeta: parseMeta(mn), modalVisible: visibleNotes(mn) };
    }, [modalId, participants, allParts, notes]);

    const listData = useMemo(() => leftMode === "venue" ? venueList : sortedFiltered, [leftMode, venueList, sortedFiltered]);
    const totalPages = Math.max(1, Math.ceil(listData.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages - 1);
    const pageData = useMemo(() => listData.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE), [listData, safePage]);

    useEffect(() => {
        const handler = (e) => {
            if (!e.shiftKey) return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); setPage(p => Math.max(0, p - 1)); }
            if (e.key === 'ArrowRight') { e.preventDefault(); setPage(p => Math.min(p + 1, totalPages - 1)); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [totalPages]);

    if (!authed) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center font-mono">
                <div className="w-80 bg-[#080808] border border-[#141416] rounded-lg p-8 flex flex-col gap-5 text-left">
                    <p className="text-[0.8rem] font-black tracking-[0.2em] text-white text-center">CAMPFIRE // ENGINE</p>
                    <div className="flex flex-col gap-1">
                        <label className="text-[0.6rem] font-extrabold tracking-[0.15em] uppercase text-[#444]">Channel</label>
                        <input value={channel} onChange={e => setChannel(e.target.value)} onKeyDown={e => e.key === "Enter" && doConnect()}
                            className="bg-[#0c0c0e] border border-[#141416] rounded px-3 py-2 text-sm text-white outline-none focus:border-blue-500 font-mono" placeholder="channel-name" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[0.6rem] font-extrabold tracking-[0.15em] uppercase text-[#444]">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && doConnect()}
                            className="bg-[#0c0c0e] border border-[#141416] rounded px-3 py-2 text-sm text-white outline-none focus:border-blue-500 font-mono" placeholder="••••••••" />
                    </div>
                    {error && <p className="text-rose-400 text-xs font-bold text-center">{error}</p>}
                    <button onClick={doConnect} disabled={connecting}
                        className="border border-blue-500 bg-blue-500/10 text-blue-400 text-xs font-black tracking-wider py-2.5 rounded hover:bg-blue-500/20 disabled:opacity-40 transition-colors">
                        {connecting ? "CONNECTING..." : "CONNECT"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-black flex font-mono text-white overflow-hidden">
            {/* Note Toast */}
            {flashNotes.length > 0 && (
                <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2">
                    {flashNotes.map(n => (
                        <div key={n.key} className="flex items-center gap-2 bg-[#020617]/95 border border-[#1f2937] rounded-full px-3 py-1 shadow-lg">
                            {n.avatar && <img src={n.avatar} alt={n.author} className="w-6 h-6 rounded-full object-cover border border-[#020617]" />}
                            <div className="flex flex-col text-left">
                                <span className="text-[0.6rem] text-[#9ca3af] font-bold">{n.author} → {n.participantName}</span>
                                <span className="text-[0.6rem] text-[#e5e7eb] truncate max-w-[220px]">{n.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ParticipantModal
                modalId={modalId} modalP={modalP} modalNotes={modalNotes} modalMeta={modalMeta} modalVisible={modalVisible}
                setModalId={setModalId} canViewPII={canViewPII} setRating={setRating} setColorTag={setColorTag}
                gameInputs={gameInputs} setGameInputs={setGameInputs} setGameEntry={setGameEntry}
                teamInputs={teamInputs} setTeamInputs={setTeamInputs} assignTeam={assignTeam}
                tagInputs={tagInputs} setTagInputs={setTagInputs} addCustomTag={addCustomTag}
                noteInputs={noteInputs} setNoteInputs={setNoteInputs} addNote={addNote} setTransitModal={setTransitModal}
            />

            <TransitModal
                transitModal={transitModal} transitNote={transitNote} setTransitNote={setTransitNote}
                setTransitModal={setTransitModal} logArrival={logArrival} logLeave={logLeave}
            />

            <LeftPanel
                leftMode={leftMode} setLeftMode={setLeftMode} rightPanelOpen={rightPanelOpen} setRightPanelOpen={setRightPanelOpen}
                leftSearch={leftSearch} setLeftSearch={setLeftSearch} filters={filters} cycleFilter={cycleFilter}
                sortBy={sortBy} setSortBy={setSortBy} tagFilters={tagFilters} setTagFilters={setTagFilters}
                allTags={allTags} customFilters={customFilters} setCustomFilters={setCustomFilters}
                tableLoading={tableLoading} tableError={tableError} pageData={pageData} notes={notes}
                openParticipant={openParticipant} noteInputs={noteInputs} setNoteInputs={setNoteInputs}
                addNote={addNote} canViewPII={canViewPII} totalPages={totalPages} safePage={safePage}
                setPage={setPage} sortedTeams={sortedTeams} teamGroups={teamGroups}
                showTimestamps={showTimestamps} setShowTimestamps={setShowTimestamps}
                timelineEntries={timelineEntries} timelineLoading={timelineLoading}
                participants={participants} allParts={allParts}
            />

            {rightPanelOpen && (
                <ScanEngine
                    credsRef={credsRef} status={status} listenerCount={listenerCount} listenerUsers={listenerUsers}
                    showHistory={showHistory} setShowHistory={setShowHistory} filtered={filteredScans} st={st}
                    participants={participants} expanded={expanded} setExpanded={setExpanded} notes={notes}
                    openParticipant={openParticipant} canViewPII={canViewPII} retryCheck={retryCheck}
                    rescanAll={rescanAll}
                    teamInputs={teamInputs} setTeamInputs={setTeamInputs} assignTeam={assignTeam}
                    setTransitModal={setTransitModal} noteInputs={noteInputs} setNoteInputs={setNoteInputs}
                    addNote={addNote} devices={devices} deviceMeta={deviceMeta}
                />
            )}

            {/* Global UI Overlays */}
            <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 transition-all duration-500 z-[999] ${rightPanelOpen ? "-translate-x-[240px]" : ""}`}>
                <TimestampTicker nowMs={nowMs} />
            </div>
        </div>
    );
}
