"use client"

import { Eye, Monitor, Wifi, WifiOff, Camera, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function DeviceMonitor({ deviceData, disconnected, appIcon, connectWS, log, openApps, offline, scr, already, spec }) {
    return (
        <div className="md:col-span-2 w-full p-6 rounded-2xl border-4 border-blue-900/50 bg-[#1a2333]/70 backdrop-blur-md shadow-[6px_6px_0px_rgba(0,0,0,0.2)] text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[url('/noise.png')] pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-hc-star/20 rounded-lg">
                        <Monitor className="w-6 h-6 text-hc-ice" />
                    </div>
                    <h3 className="font-primary text-3xl solid-shadow tracking-wide">ALIMAD_PC</h3>
                </div>
                <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/10">
                    {offline ? (
                        <WifiOff className="w-4 h-4 text-red-400" />
                    ) : (
                        <Wifi className="w-4 h-4 text-hc-emerald" />
                    )}
                    <span className="text-sm font-subheading font-bold uppercase tracking-wider opacity-80">
                        {offline ? "Offline" : "Online"}
                    </span>
                </div>
            </div>

            {disconnected && (
                <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 mb-6 relative z-10">
                    <p className="text-red-400 font-subheading flex items-center gap-2">
                        <WifiOff size={16} />
                        WebSocket disconnected.{" "}
                        <button onClick={connectWS} className="underline hover:text-red-300 font-bold ml-1">
                            Reconnect
                        </button>
                    </p>
                </div>
            )}

            {deviceData && !offline && (
                <div className="space-y-4 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-xl border-2 border-white/10">
                            <p className="text-xs uppercase tracking-widest opacity-60 mb-2 font-bold font-primary">Active App</p>
                            <div className="flex items-center gap-3">
                                {appIcon && (
                                    <img src={"data:image/png;base64," + appIcon} className="w-8 h-8 rounded-lg shadow-sm" alt="app icon :P" key={deviceData.app + deviceData.timestamp} />
                                )}
                                <p className="font-subheading text-xl font-bold truncate">{deviceData.app || "Unknown"}</p>
                            </div>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border-2 border-white/10">
                            <p className="text-xs uppercase tracking-widest opacity-60 mb-2 font-bold font-primary">Window title</p>
                            <p className="font-subheading text-xl font-bold truncate">{deviceData.title || "Unknown"}</p>
                        </div>
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl border-2 border-white/10">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs uppercase tracking-widest opacity-60 font-bold font-primary">Recent Keystrokes</p>
                            <span className="text-xs font-primary bg-hc-star/20 px-2 py-0.5 rounded text-hc-ice">{deviceData.keysPressed || 0} keys/s</span>
                        </div>
                        <div className="font-subheading text-sm bg-black/40 p-3 rounded-lg border border-white/5 overflow-x-auto max-h-24 overflow-y-auto whitespace-pre-wrap text-hc-emerald/90 shadow-inner">
                            {log || <span className="opacity-30 italic">No activity...</span>}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={scr}
                            disabled={already}
                            className="flex-1 hc-button rounded-xl font-primary text-[#8d3f34] px-4 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:transform hover:-translate-y-1 transition-transform"
                        >
                            <Camera size={20} />
                            {already ? "Requesting..." : "Spy on screen"}
                        </button>
                        {spec > 0 && (
                            <div className="bg-hc-emerald/20 border-2 border-hc-emerald/30 px-4 py-3 rounded-xl flex items-center gap-2 text-hc-emerald">
                                <Users size={20} />
                                <span className="font-subheading font-bold">{spec} Watching</span>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-xl border-2 border-white/10">
                            <p className="text-xs uppercase tracking-widest opacity-60 mb-3 font-bold font-primary">Running Processes</p>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(openApps).map(([app, isOpen]) => (
                                    isOpen && (
                                        <span
                                            key={app}
                                            className="px-3 py-1 rounded-lg bg-hc-ice/10 border border-hc-ice/30 text-hc-ice text-xs font-subheading font-bold flex items-center gap-1.5"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-hc-ice animate-pulse" />
                                            {app}
                                        </span>
                                    )
                                ))}
                            </div>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border-2 border-white/10">
                            <p className="text-xs uppercase tracking-widest opacity-60 mb-2 font-bold font-primary">IP Address</p>
                            <p className="font-subheading text-lg opacity-80">{deviceData.ip || "N/A"}</p>
                        </div>
                    </div>
                </div>
            )}

            {offline && (
                <div className="text-center py-16 opacity-50 relative z-10">
                    <Monitor className="w-20 h-20 mx-auto mb-4 opacity-30" />
                    <p className="font-primary text-2xl">Target Offline</p>
                    <p className="font-subheading opacity-70">
                        {deviceData?.timestamp
                            ? `Last seen ${formatDistanceToNow(new Date(deviceData.timestamp), { addSuffix: true })} on ${deviceData.title}`
                            : "Waiting for signal..."}
                    </p>
                </div>
            )}
        </div>
    )
}
