"use client";
import { useEffect, useState } from "react";
import { Clipboard, Check } from "lucide-react";
import { format as timeago } from "timeago.js";

function Tooltip({ text, children }) {
  return (
    <span className="relative group cursor-pointer">
      {children}
      <span className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 rounded bg-black/90 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
        {text}
      </span>
    </span>
  );
}

export default function TablePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cron, setCron] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdTime");
  const [sortDir, setSortDir] = useState("desc");
  const [filters, setFilters] = useState({
    volunteer: null,
    disabled: null,
    pending: null,
  });
  const [visibleCols, setVisibleCols] = useState({
    name: true,
    email: true,
    phone: true,
    pronouns: true,
    age: true,
    joined: true,
    status: true,
    ref: false,
    mark: false,
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(100);
  const [marks, setMarks] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("participantMarks") || "{}");
      } catch {
        return {};
      }
    }
    return {};
  });
  const [markFilter, setMarkFilter] = useState(null);

  function stripCountryCode(val) {
    if (!val) return val;
    return val.replace(/^\+92/, "").replace(/^\+10/, "").replace(/^\+1/, "");
  }

  async function refreshh() {
    setCron(true);
    await fetch("/cron?pwd="+process.env.NEXT_PUBLIC_CRON_SECRET);
    fetch("/api/event/table")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(setData)
      .catch(() => setError("Could not load data"))
      .finally(() => setCron(false));
  }

  useEffect(() => {
    fetch("/api/event/table")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(setData)
      .catch(() => setError("Could not load data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("participantMarks", JSON.stringify(marks));
    }
  }, [marks]);

  useEffect(() => {
    async function fetchMarksFromRedis() {
      try {
        const res = await fetch("/api/event/ids");
        if (res.ok) {
          const remoteMarks = await res.json();
          if (remoteMarks && typeof remoteMarks === "object") {
            setMarks(remoteMarks);
            if (typeof window !== "undefined") {
              localStorage.setItem("participantMarks", JSON.stringify(remoteMarks));
            }
          }
        }
      } catch (e) {
      }
    }
    fetchMarksFromRedis();
  }, []);

  const toggleMark = (id) => {
    setMarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center w-screen h-screen text-center text-2xl text-white/60 font-primary">
        {cron ? "Cronning..." : "Loading..."}
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center w-screen h-screen text-center text-xl text-red-400 font-primary">
        {error}
      </div>
    );
  if (!data) return null;

  const ages = data.participants.map((p) => p.age).filter((a) => a);
  const avgAge = ages.length
    ? (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1)
    : "-";
  const pronounCounts = data.participants.reduce((acc, p) => {
    acc[p.pronouns] = (acc[p.pronouns] || 0) + 1;
    return acc;
  }, {});
  const mostCommonPronoun =
    Object.entries(pronounCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const getStatusColor = (p) => {
    if (p.disabled) return "bg-red-500/15 border-l-4 border-red-500";
    if (p.isVolunteer) return "bg-green-500/15 border-l-4 border-green-500";
    if (p.pendingVolunteer)
      return "bg-yellow-500/15 border-l-4 border-yellow-500";
    if (p.pendingDisable)
      return "bg-orange-500/15 border-l-4 border-orange-500";
    return "bg-blue-500/15 border-l-4 border-blue-500";
  };

  let filtered = data.participants.filter((p) => {
    const matchesSearch =
      p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.legalFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.legalLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchQuery.toLowerCase().replaceAll(" ", "")) ||
      p.pronouns.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.referralContext.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (filters.volunteer === null || p.isVolunteer === filters.volunteer) &&
      (filters.disabled === null || p.disabled === filters.disabled) &&
      (filters.pending === null ||
        (filters.pending === true &&
          (p.pendingVolunteer || p.pendingDisable)) ||
        (filters.pending === false &&
          !p.pendingVolunteer &&
          !p.pendingDisable));
    const matchesMark =
      markFilter === null ||
      (marks[p.id] === true && markFilter === true) ||
      (marks[p.id] !== true && markFilter === false);
    return matchesSearch && matchesFilters && matchesMark;
  });

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(
        sortDir === "asc" ? "desc" : sortDir === "desc" ? "asc" : "asc",
      );
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  let sortedFiltered = [...filtered];
  if (sortDir && sortBy) {
    sortedFiltered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === "createdTime") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(sortedFiltered.length / rowsPerPage);
  const pagedFiltered = sortedFiltered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  function exportCSV() {
    // Always include all columns, not just visible ones
    const cols = [
      "id",
      "displayName",
      "email",
      "phone",
      "pronouns",
      "age",
      "createdTime",
      "isVolunteer",
      "disabled",
      "pendingVolunteer",
      "pendingDisable",
      "referralContext",
      "mark"
    ];
    const rows = data.participants.map((p) => [
      p.id,
      p.displayName,
      p.email,
      p.phone,
      p.pronouns,
      p.age,
      new Date(p.createdTime).toLocaleString(),
      p.isVolunteer ? "1" : "0",
      p.disabled ? "1" : "0",
      p.pendingVolunteer ? "1" : "0",
      p.pendingDisable ? "1" : "0",
      p.referralContext,
      marks[p.id] ? "1" : "0"
    ]);
    const csv = [cols.join(","), ...rows.map((r) => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "participants.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function syncMarksToRedis() {
    await fetch("/api/event/ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(marks),
    });
  }

  function CopyCell({ value, children, strip }) {
    const [copied, setCopied] = useState(false);
    return (
      <td
        className="px-4 py-3 cursor-pointer hover:text-cyan-300 transition-colors font-mono"
        onClick={() => {
          navigator.clipboard.writeText(
            strip ? stripCountryCode(value) : String(value || ""),
          );
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        title="Click to copy"
      >
        <span className="flex items-center gap-1">
          {children}
          {copied && <Check size={14} className="text-green-400" />}
        </span>
      </td>
    );
  }

  return (
    <div className="w-screen h-screen overflow-x-hidden bg-black flex flex-col items-center justify-start p-2 sm:p-4 font-mono text-white">
      <div className="w-full h-full">
        <div className="mb-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
              SIGNUPS
            </h1>
            <p className="text-white/60 text-xs mb-2 tracking-wide">
              {filtered.length} results • last updated:{" "}
              {new Date(data.lastUpdated).toLocaleString()} (
              {timeago(data.lastUpdated)})
              <button
                className={
                  "text-cyan-400 ml-2 font-bold hover:text-cyan-300 transition-colors" +
                  (cron ? " opacity-50 cursor-not-allowed" : "")
                }
                onClick={refreshh}
                disabled={cron}
              >
                {cron ? "[REFRESHING...]" : "[REFRESH]"}
              </button>
            </p>
            <input
              type="text"
              placeholder=">>> search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mb-2 px-3 py-2 bg-black border border-cyan-700/40 rounded text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-600 text-sm font-mono"
            />
            <div className="flex gap-1 flex-wrap mb-2">
              {{
                volunteer: "VOL",
                disabled: "DIS",
                pending: "PND",
              } &&
                Object.entries({
                  volunteer: "VOL",
                  disabled: "DIS",
                  pending: "PND",
                }).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        [key]:
                          filters[key] === true
                            ? false
                            : filters[key] === false
                              ? null
                              : true,
                      })
                    }
                    className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                      filters[key] === true
                        ? "bg-green-700 text-green-200 border border-green-700"
                        : filters[key] === false
                          ? "bg-red-900 text-red-400 border border-red-700"
                          : "bg-black border border-green-700 text-green-400 hover:bg-green-900"
                    }`}
                  >
                    {filters[key] === true
                      ? "✓ "
                      : filters[key] === false
                        ? "✗ "
                        : ""}
                    {label}
                  </button>
                ))}
              <button
                onClick={() =>
                  setMarkFilter(
                    markFilter === true
                      ? false
                      : markFilter === false
                        ? null
                        : true,
                  )
                }
                className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                  markFilter === true
                    ? "bg-blue-700 text-blue-200 border border-blue-700"
                    : markFilter === false
                      ? "bg-blue-900 text-blue-400 border border-blue-700"
                      : "bg-black border border-blue-700 text-blue-400 hover:bg-blue-900"
                }`}
              >
                {markFilter === true ? "✓ " : markFilter === false ? "✗ " : ""}
                MARK
              </button>
              <button
                onClick={() =>
                  setFilters({ volunteer: null, disabled: null, pending: null })
                }
                className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-black border border-white/10 text-white/40 hover:text-white/70 transition-all"
              >
                CLR
              </button>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button
              className="px-2 py-1 rounded bg-cyan-700 text-white text-xs font-bold hover:bg-cyan-800"
              onClick={exportCSV}
            >
              Export CSV
            </button>
            <button
              className="px-2 py-1 rounded bg-blue-700 text-white text-xs font-bold hover:bg-blue-800"
              onClick={syncMarksToRedis}
            >
              Sync Marks
            </button>
            <div className="flex gap-1">
              {Object.keys(visibleCols).map((col) => (
                <button
                  key={col}
                  className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                    visibleCols[col]
                      ? "bg-cyan-700 text-white"
                      : "bg-black border border-cyan-700 text-cyan-400"
                  }`}
                  onClick={() =>
                    setVisibleCols({ ...visibleCols, [col]: !visibleCols[col] })
                  }
                >
                  {col}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-2 flex gap-4 text-xs text-white/70">
          <span>
            Average Age:{" "}
            <span className="text-blue-400 font-bold">{avgAge}</span>
          </span>
          <span>
            Most Common Pronoun:{" "}
            <span className="text-green-400 font-bold">
              {mostCommonPronoun}
            </span>
          </span>
        </div>
        <div className="bg-black rounded border border-white/10 overflow-hidden w-full h-[90vh]">
          <div className="overflow-y-auto overflow-hidden h-full">
            <table className="w-full h-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-black border-b border-white/10">
                  <th
                    className={`px-2 py-2 font-bold uppercase tracking-wider text-cyan-400 cursor-pointer ${
                      sortBy === "displayName" ? "bg-cyan-900" : ""
                    }`}
                    onClick={() => handleSort("displayName")}
                  >
                    #
                  </th>
                  {visibleCols.name && (
                    <th
                      className={`px-2 py-2 font-bold uppercase tracking-wider text-cyan-400 cursor-pointer ${
                        sortBy === "displayName" ? "bg-cyan-900" : ""
                      }`}
                      onClick={() => handleSort("displayName")}
                    >
                      Name
                    </th>
                  )}
                  {visibleCols.email && (
                    <th
                      className={`px-2 py-2 font-bold uppercase tracking-wider text-purple-400 cursor-pointer ${
                        sortBy === "email" ? "bg-purple-900" : ""
                      }`}
                      onClick={() => handleSort("email")}
                    >
                      Email
                    </th>
                  )}
                  {visibleCols.phone && (
                    <th
                      className={`px-2 py-2 font-bold uppercase tracking-wider text-pink-400 cursor-pointer ${
                        sortBy === "phone" ? "bg-pink-900" : ""
                      }`}
                      onClick={() => handleSort("phone")}
                    >
                      Phone
                    </th>
                  )}
                  {visibleCols.pronouns && (
                    <th
                      className={`px-2 py-2 font-bold uppercase tracking-wider text-green-400 cursor-pointer ${
                        sortBy === "pronouns" ? "bg-green-900" : ""
                      }`}
                      onClick={() => handleSort("pronouns")}
                    >
                      Prons
                    </th>
                  )}
                  {visibleCols.age && (
                    <th
                      className={`px-2 py-2 font-bold uppercase tracking-wider text-blue-400 cursor-pointer ${
                        sortBy === "age" ? "bg-blue-900" : ""
                      }`}
                      onClick={() => handleSort("age")}
                    >
                      Age
                    </th>
                  )}
                  {visibleCols.joined && (
                    <th
                      className={`px-2 py-2 font-bold uppercase tracking-wider text-yellow-400 cursor-pointer ${
                        sortBy === "createdTime" ? "bg-yellow-900" : ""
                      }`}
                      onClick={() => handleSort("createdTime")}
                    >
                      Joined
                    </th>
                  )}
                  {visibleCols.status && (
                    <th className="px-2 py-2 font-bold uppercase tracking-wider text-orange-400">
                      Status
                    </th>
                  )}
                  {visibleCols.ref && (
                    <th className="px-2 py-2 font-bold uppercase tracking-wider text-red-400">
                      Ref
                    </th>
                  )}
                  {visibleCols.mark && (
                    <th className="px-2 py-2 font-bold uppercase tracking-wider text-blue-400">
                      Mark
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {pagedFiltered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`bg-black border-b border-white/5 transition-all duration-150 hover:bg-white/10 cursor-text`}
                  >
                    <td className="px-2 py-2 text-xs font-bold text-white/50">
                      {String(i + 1 + (page - 1) * rowsPerPage).padStart(
                        3,
                        "0",
                      )}
                    </td>
                    {visibleCols.name && (
                      <CopyCell value={p.displayName} strip={false}>
                        <Tooltip
                          text={p.legalFirstName + " " + p.legalLastName}
                        >
                          <span
                            className={
                              "font-bold text-xs" +
                              (p.disabled ? " text-red-400" : " text-white")
                            }
                          >
                            {p.displayName}
                          </span>
                        </Tooltip>
                      </CopyCell>
                    )}
                    {visibleCols.email && (
                      <CopyCell value={p.email} strip={true}>
                        <Tooltip text={p.email}>
                          <span className="text-white/70 text-xs">
                            {p.email.length > 28
                              ? p.email.substring(0, 25) + "..."
                              : p.email}
                          </span>
                        </Tooltip>
                      </CopyCell>
                    )}
                    {visibleCols.phone && (
                      <CopyCell value={p.phone} strip={true}>
                        <Tooltip text={p.phone}>
                          <span className="text-white/70 font-mono text-xs">
                            {p.phone || "—"}
                          </span>
                        </Tooltip>
                      </CopyCell>
                    )}
                    {visibleCols.pronouns && (
                      <CopyCell value={p.pronouns} strip={false}>
                        <span className="text-white/70 text-xs">
                          {p.pronouns}
                        </span>
                      </CopyCell>
                    )}
                    {visibleCols.age && (
                      <CopyCell value={p.age} strip={false}>
                        <span className="text-white/70 text-xs font-bold">
                          {p.age}
                        </span>
                      </CopyCell>
                    )}
                    {visibleCols.joined && (
                      <CopyCell
                        value={new Date(p.createdTime).toLocaleString()}
                        strip={false}
                      >
                        <Tooltip
                          text={new Date(p.createdTime).toLocaleString()}
                        >
                          <span className="text-white/60 text-xs">
                            {timeago(p.createdTime)}
                          </span>
                        </Tooltip>
                      </CopyCell>
                    )}
                    {visibleCols.status && (
                      <CopyCell
                        value={
                          [
                            p.isVolunteer ? "Volunteer" : "",
                            p.disabled ? "Disabled" : "",
                            p.pendingVolunteer ? "Pending Volunteer" : "",
                            p.pendingDisable ? "Pending Disable" : "",
                          ]
                            .filter(Boolean)
                            .join(", ") || "Hacker"
                        }
                        strip={false}
                      >
                        <span className="text-white/80 text-xs flex flex-wrap gap-1">
                          {p.disabled && (
                            <span className="bg-red-700 px-2 py-0.5 rounded text-red-100 font-bold text-xs">
                              DIS
                            </span>
                          )}
                          {p.isVolunteer && (
                            <span className="bg-green-700 px-2 py-0.5 rounded text-green-100 font-bold text-xs">
                              VOL
                            </span>
                          )}
                          {p.pendingVolunteer && (
                            <span className="bg-yellow-700 px-2 py-0.5 rounded text-yellow-100 font-bold text-xs">
                              PVOL
                            </span>
                          )}
                          {p.pendingDisable && (
                            <span className="bg-orange-700 px-2 py-0.5 rounded text-orange-100 font-bold text-xs">
                              PDIS
                            </span>
                          )}
                          {!p.disabled &&
                            !p.isVolunteer &&
                            !p.pendingVolunteer &&
                            !p.pendingDisable && (
                              <span className="text-blue-400 font-bold text-xs">
                                OK
                              </span>
                            )}
                        </span>
                      </CopyCell>
                    )}
                    {visibleCols.ref && (
                      <CopyCell value={p.referralContext} strip={false}>
                        <Tooltip text={p.referralContext}>
                          <span className="text-white/60 text-xs max-w-xs truncate">
                            {p.referralContext ? p.referralContext : "—"}
                          </span>
                        </Tooltip>
                      </CopyCell>
                    )}
                    {visibleCols.mark && (
                      <td className="px-2 py-2 text-center">
                        <button
                          className={`px-2 py-1 rounded font-bold text-xs transition-all ${marks[p.id] ? "bg-blue-600 text-white" : "bg-black border border-blue-700 text-blue-400"}`}
                          onClick={() => toggleMark(p.id)}
                        >
                          {marks[p.id] ? "ON" : "OFF"}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center items-center gap-2 mt-2">
          <button
            className="px-2 py-1 rounded bg-cyan-700 text-white text-xs font-bold hover:bg-cyan-800"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-white/70 text-xs">
            Page {page} / {totalPages}
          </span>
          <button
            className="px-2 py-1 rounded bg-cyan-700 text-white text-xs font-bold hover:bg-cyan-800"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
          <div className="bg-black border border-blue-700 rounded p-3">
            <p className="text-blue-400 font-bold text-xl">
              {
                data.participants.filter((p) => !p.disabled && !p.isVolunteer)
                  .length
              }
            </p>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-1 font-bold">
              Hackers
            </p>
          </div>
          <div className="bg-black border border-green-700 rounded p-3">
            <p className="text-green-400 font-bold text-xl">
              {data.participants.filter((p) => p.isVolunteer).length}
            </p>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-1 font-bold">
              Volunteers
            </p>
          </div>
          <div className="bg-black border border-red-700 rounded p-3">
            <p className="text-red-400 font-bold text-xl">
              {data.participants.filter((p) => p.disabled).length}
            </p>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-1 font-bold">
              Disabled
            </p>
          </div>
          <div className="bg-black border border-purple-700 rounded p-3">
            <p className="text-purple-400 font-bold text-xl">
              {data.participants.length}
            </p>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-1 font-bold">
              Total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
