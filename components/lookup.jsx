"use client";
import { LucideUserCog2, Search, Trash, User, User2, UserRoundX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { format } from "timeago.js";

export default function Lookup() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  async function handleSearch() {
    if (!query || query.trim().length < 3) {
      setError("Please enter at least 3 characters to search.");
      setResults([]);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/event/lookup?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`Lookup failed: ${res.status}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error(err);
      setResults([]);
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setError(null);
    if (!query || query.trim().length < 3) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch();
      debounceRef.current = null;
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="w-full mx-auto bg-white/5 p-4 rounded-3xl border border-white/10 hover:bg-white/10 hover:backdrop-blur-none backdrop-blur-sm transition-all duration-300 cursor-default group flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-lg sm:text-xl font-subheading flex items-center gap-2 text-white/90">
            <Search size={20} className="text-cyan-400" />
            Lookup
          </h4>
          <p className="text-sm sm:text-sm opacity-50 mt-1">
            Search if a specific signup exists
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            placeholder="Search by name or email..."
            aria-label="Lookup query"
            className="flex-1 font-subheading px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 text-md text-white/90"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-3 py-2 rounded-lg bg-cyan-500/90 hover:bg-cyan-500 text-white text-md flex items-center gap-2"
            aria-label="Run lookup"
          >
            <Search size={16} />
            Search
          </button>
        </div>
        {error ? (
          <p className="text-sm text-red-400 mb-2">{error}</p>
        ) : null}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full overflow-y-auto max-h-60"
        >
          {loading ? (
            <p className="text-sm text-white/70">Searching...</p>
          ) : (results && results.length > 0) ? results.map((result) => (
            <div key={result.id} className="bg-white/5 p-2 rounded-lg border border-white/20">
              <div className="flex items-center gap-1 mb-0">
                {result.disabled ? (
                  <UserRoundX size={20} className="text-red-400" />
                ) : result.volunteer ? (
                  <LucideUserCog2 size={20} className="text-indigo-400" />
                ) : (
                  <User2 size={20} className="text-cyan-400" />
                )}
                <h5 className="text-md">{result.name}</h5>
              </div>
              <p className="text-sm text-white/70">{format(result.time)}</p>
            </div>
          )) : (query ? (
            <p className="text-sm text-white/70">No results found</p>
          ) : <p className="text-sm text-white/70">Search for smth...</p>)}
        </div>
      </div>
    </div>
  );
}