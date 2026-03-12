import { X, Wifi, Monitor, Cpu, Clock, Activity } from "lucide-react";
import { format as timeago } from "timeago.js";

export default function DevicesModal({ isOpen, onClose, devices, deviceMeta }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(59,130,246,0.15)] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <Wifi className="text-blue-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight leading-none mb-1">Active Scanner Nodes</h2>
                            <p className="text-[0.7rem] font-bold text-white/30 uppercase tracking-[0.2em]">Deployment Environment Status</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {devices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                            <Activity size={48} className="mb-4" />
                            <p className="text-sm font-black tracking-widest uppercase">Waiting for Active Nodes...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {devices.map(ip => {
                                const m = deviceMeta[ip] || {};
                                return (
                                    <div key={ip} className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all group overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -z-10 group-hover:bg-blue-500/10 transition-all" />

                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                                                    <Monitor className="text-white/60" size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-white leading-none mb-1">{m.scanner_user_id || "Terminal Node"}</h3>
                                                    <p className="text-[0.7rem] font-mono font-bold text-blue-400 opacity-60">{ip}</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                <span className="text-[0.6rem] font-black text-emerald-400 uppercase tracking-widest">Live</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { label: "Hardware", val: `${m.brand || "?"} ${m.model || "?"}`, icon: Cpu },
                                                { label: "Android SDK", val: m.sdkInt || "Unknown", icon: Activity },
                                                { label: "Last Heartbeat", val: m.last_connected ? timeago(m.last_connected) : "?", icon: Clock },
                                            ].map(item => (
                                                <div key={item.label} className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-[0.55rem] font-black text-white/20 uppercase tracking-[0.15em]">
                                                        <item.icon size={10} /> {item.label}
                                                    </div>
                                                    <div className="text-[0.8rem] font-bold text-white/80 truncate">
                                                        {item.val}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-black/40 flex justify-between items-center">
                    <div className="text-[0.65rem] font-bold text-white/20 uppercase tracking-widest flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-blue-400"><Activity size={12} /> System OK</span>
                        <span>Total nodes: {devices.length}</span>
                    </div>
                    <button onClick={onClose} className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white/80 font-black text-[0.7rem] uppercase tracking-widest rounded-xl transition-all border border-white/10">
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
