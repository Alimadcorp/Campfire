import { Star, Edit3 } from "lucide-react";

export function Stars({ value = 0, onChange, size = 18, hideOnSet = false }) {
    if (hideOnSet && value > 0) {
        return (
            <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                <div className="flex gap-1">
                    {Array.from({ length: value }).map((_, i) => (
                        <Star key={i} size={size - 4} className="fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                    ))}
                </div>
                <button onClick={() => onChange?.(0)} className="text-[0.6rem] font-black text-amber-400/40 hover:text-amber-400 transition-colors ml-1 uppercase tracking-tighter flex items-center gap-1">
                    <Edit3 size={10} /> Change
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 shadow-inner">
            {[1, 2, 3, 4, 5].map(i => (
                <button key={i} onClick={() => onChange?.(i === value ? 0 : i)} className="p-0.5 border-none bg-transparent cursor-pointer group transition-transform active:scale-90">
                    <Star size={size} className={i <= value ? "fill-amber-400 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]" : "text-white/10 hover:text-white/30 transition-all"} />
                </button>
            ))}
        </div>
    );
}

export function Row({ label, value, mono, redact }) {
    return (
        <div className="flex justify-between py-2 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors px-1.5">
            <span className="text-white/40 font-black uppercase tracking-[0.15em] text-[0.6rem] shrink-0">{label}</span>
            <span className={`text-white text-[0.75rem] font-bold text-right truncate max-w-[70%] ${mono ? "font-mono tracking-wider" : ""}`}>
                {redact ? "███████████" : (value || "—")}
            </span>
        </div>
    );
}
