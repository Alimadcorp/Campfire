import { X } from "lucide-react";

export default function TransitModal({ transitModal, transitNote, setTransitNote, setTransitModal, logArrival, logLeave }) {
    if (!transitModal) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setTransitModal(null)}>
            <div className="bg-[#0c0c0e] border border-[#222] rounded-xl p-6 w-full max-w-xs flex flex-col gap-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <span className={`text-[0.65rem] font-black tracking-[0.15em] uppercase ${transitModal.type === 'in' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {transitModal.type === 'in' ? 'Log Arrival Back' : 'Log Departure'}
                    </span>
                    <button onClick={() => setTransitModal(null)} className="text-[#444] hover:text-white transition-colors"><X size={14} /></button>
                </div>
                <div>
                    <p className="text-xs text-white font-bold mb-1">{transitModal.name}</p>
                    <p className="text-[0.6rem] text-white/40">{transitModal.type === 'in' ? 'Returning to the venue' : 'Leaving the venue'}</p>
                </div>
                <input value={transitNote} onChange={e => setTransitNote(e.target.value)}
                    placeholder={transitModal.type === 'in' ? "Note (optional)..." : "Reason (optional)..."}
                    onKeyDown={e => e.key === "Enter" && (transitModal.type === 'in' ? logArrival(transitModal.id, transitModal.name, transitNote) : logLeave(transitModal.id, transitModal.name, transitNote))}
                    className={`bg-black border border-[#222] rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-${transitModal.type === 'in' ? 'emerald' : 'rose'}-500 transition-all placeholder-[#333]`} />
                <button onClick={() => transitModal.type === 'in' ? logArrival(transitModal.id, transitModal.name, transitNote) : logLeave(transitModal.id, transitModal.name, transitNote)}
                    className={`border ${transitModal.type === 'in' ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white' : 'border-rose-500 bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] text-white'} text-[0.6rem] font-black py-3 rounded-lg transition-all uppercase tracking-[0.2em]`}>
                    CONFIRM {transitModal.type === 'in' ? 'ARRIVAL' : 'DEPARTURE'}
                </button>
            </div>
        </div>
    );
}
