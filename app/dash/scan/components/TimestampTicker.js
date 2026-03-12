export default function TimestampTicker({ nowMs }) {
    return (
        <div className="pointer-events-none select-none flex flex-col items-end gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-3 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-full pl-4 pr-5 py-2 shadow-[0_10px_50px_rgba(0,0,0,1)] ring-1 ring-white/5">
                <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
                </div>
                <span className="text-md font-mono text-white/90 font-mono tabular-nums">
                    {nowMs}
                </span>
            </div>
        </div>
    );
}
