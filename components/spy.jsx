"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import DeviceMonitor from "@/components/pc";
import StatusDot from "@/components/statusdot"
import { Monitor, X } from "lucide-react"

const titleCase = (str) => str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : "";

function Emojix({ text, emoji }) {
    if (!text && !emoji) return null

    const renderEmojiJSX = (text) => {
        if (!text) return null
        const parts = text.split(/(:[a-zA-Z0-9_+-]+:)/g)
        return parts.map((part, i) => {
            const match = part.match(/^:([a-zA-Z0-9_+-]+):$/)
            if (match) {
                return (
                    <img
                        key={i}
                        src={`https://e.alimad.co/${match[1]}`}
                        className="w-5 h-5 inline-block object-contain align-middle"
                        alt={match[1]}
                    />
                )
            }
            return part
        })
    }

    return (
        <div className="flex items-center gap-2 p-3 mt-3 rounded-xl bg-black/5 border border-black/5">
            {emoji && <span className="leading-none flex items-center justify-center scale-125">{renderEmojiJSX(emoji)}</span>}
            {text && <span className="text-sm font-serif italic text-hc-brown/80">{text}</span>}
        </div>
    )
}

export default function StatusViewer({ onClose }) {
    const [data, setData] = useState(null)
    const [deviceData, setDeviceData] = useState(null)
    const [disconnected, setDisconnected] = useState(false)
    const [deviceOffline, setDeviceOffline] = useState(true)
    const [screenshot, setScreenshot] = useState(null);
    const [scrMax, setScrMax] = useState(false);
    const [already, setAlready] = useState(false);
    const [spec, setSpec] = useState(0);
    const [openApps, setOpenApps] = useState({
        "slack": false,
        "discord": false,
        "whatsapp.root": false,
        "code": false,
        "chrome": false,
        "windowsterminal": false
    })
    const [appIcon, setAppIcon] = useState("");
    const wsRef = useRef(null)
    const timeoutRef = useRef(null)
    const [log, setLog] = useState("");
    const bufferRef = useRef(new Uint8Array(1024));
    const bufferLenRef = useRef(0);
    const indexRef = useRef(0);
    const maxChar = 300;

    const addLog = (data) => {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(data);
        if (bufferLenRef.current + bytes.length > bufferRef.current.length) {
            const newBuffer = new Uint8Array((bufferLenRef.current + bytes.length) * 2);
            newBuffer.set(bufferRef.current.slice(0, bufferLenRef.current));
            bufferRef.current = newBuffer;
        }
        bufferRef.current.set(bytes, bufferLenRef.current);
        bufferLenRef.current += bytes.length;
    };
    useEffect(() => {
        const decoder = new TextDecoder();
        const interval = setInterval(() => {
            if (indexRef.current < bufferLenRef.current) {
                const nextChar = decoder.decode(bufferRef.current.slice(indexRef.current, indexRef.current + 1));
                indexRef.current++;
                setLog((prev) => {
                    let newLog = prev + nextChar;
                    if (newLog.length > maxChar) newLog = newLog.slice(-maxChar);
                    return newLog;
                });
            } else {
                bufferLenRef.current = 0;
                indexRef.current = 0;
            }
        }, 30);
        return () => clearInterval(interval);
    }, []);

    const requestScrenshot = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "request", device: "ALIMAD-PC" }));
            setAlready(true);
        }
    }
    const connectWS = () => {
        if (wsRef.current) wsRef.current.close()
        const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "wss://ws.alimad.co/socket")
        wsRef.current = ws

        ws.onopen = () => setDisconnected(false)
        ws.onmessage = (msg) => {
            try {
                const data = JSON.parse(msg.data)
                if (data.type == "init") {
                    let lastActivity = data.data["ALIMAD-PC"];
                    setDeviceData(lastActivity);
                    setOpenApps(lastActivity.meta);
                    if (data.devices.includes("ALIMAD-PC")) setDeviceOffline(false);
                    if (lastActivity.icon && lastActivity.icon.trim() && lastActivity.icon !== "none") {
                        setAppIcon(lastActivity.icon)
                    } else {
                        setAppIcon(null)
                    }
                }
                if (data.type === "sample" || data.type === "aggregate" || data.type == "offline") {
                    if (data.type == "offline" && data.device == "ALIMAD-PC") { setDeviceOffline(true); setDeviceData(data.data["ALIMAD-PC"]); }
                    data.data.ip = data.data.ip.replaceAll("\"", "").trim();
                    setDeviceOffline(false);
                    addLog(data.data.keys);
                    setOpenApps(data.data.meta);
                    setDeviceData(data.data);
                    if (data.data.icon && data.data.icon.trim() && data.data.icon !== "none") {
                        setAppIcon(data.data.icon)
                    } else {
                        setAppIcon(null)
                    }
                }
                if (data.type === "screenshot") {
                    setAlready(true); setScrMax(true);
                    setTimeout(() => { setAlready(false) }, 10000);
                    setScreenshot({ time: data.time, data: data.data });
                }
                if (data.type === "new") {
                    setSpec(data.clients);
                }
            } catch (err) { console.error(err) }
        }

        const handleDisconnect = () => {
            setDisconnected(true)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            setDeviceData(null)
        }

        ws.onclose = handleDisconnect
        ws.onerror = handleDisconnect
    }

    useEffect(() => {
        connectWS()
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            wsRef.current?.close()
        }
    }, [])

    const fetchData = async (uh) => {
        const res = await fetch("https://corsproxy.io/?url=https://alimad.co/api/status" + (uh ? "&meta=true" : ""))
        const json = await res.json()
        setData(prev => ({ ...prev, ...json }))
    }

    useEffect(() => {
        fetchData(true)
        const t = setInterval(() => fetchData(false), 60000)
        return () => clearInterval(t)
    }, [])

    if (!data) return (
        <div className="flex flex-col items-center justify-center p-12 text-white">
            <div className="w-8 h-8 rounded-full border-4 border-hc-star border-t-transparent animate-spin mb-4"></div>
            <p className="font-primary text-xl">Connecting to satellite...</p>
        </div>
    )

    let { discord, slack, meta } = { discord: "Offline", slack: "Offline", meta: { discord: { name: "Unknown", tag: "Unknown", platform: "Unknown" }, slack: { name: "Unknown", tag: "Unknown", platform: "Unknown" } } }
    if (data) {
        discord = data.discord
        slack = data.slack
    }

    return (
        <div className="w-full relative">
            <div className="flex items-center justify-between mb-8 pl-2">
                <h2 className="text-4xl font-primary text-white solid-shadow">PoC Surveillance</h2>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                        <X size={32} />
                    </button>
                )}
            </div>

            <div className="w-full grid md:grid-cols-2 gap-6">
                {screenshot && scrMax && (
                    <div className="fixed inset-0 flex items-center justify-center z-100 backdrop-blur-md bg-black/80 p-8">
                        <div className="absolute inset-0" onClick={() => setScrMax(false)}></div>
                        <div className="relative pointer-events-auto max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden border-4 border-hc-border shadow-2xl">
                            <img
                                src={screenshot.data}
                                className="w-full h-full object-contain block"
                                alt="Spy Screenshot"
                            />
                            <button
                                onClick={() => setScrMax(false)}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors border-2 border-white/20"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="md:col-span-2">
                    <DeviceMonitor deviceData={deviceData} disconnected={disconnected} appIcon={appIcon} connectWS={connectWS} log={log.replace(/ +/g, " ")} openApps={openApps} offline={deviceOffline} scr={requestScrenshot} already={already} spec={spec} />
                </div>
            </div>
        </div>
    )
}

function Badge({ children }) {
    return (
        <span className="inline-flex px-2 py-0.5 rounded-md bg-hc-brown/10 border border-hc-brown/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-hc-brown/80">
            {children}
        </span>
    )
}

function Card({ title, status, children, open, active, typing }) {
    let stat = status;
    if (open) {
        stat = "background";
        if (active) stat = "online";
    }
    if (typing && active) stat = "typing";
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-6 rounded-2xl border-4 border-hc-border bg-hc-paper shadow-[6px_6px_0px_rgba(0,0,0,0.2)] text-hc-brown"
        >
            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-hc-brown/10">
                <StatusDot status={stat} size={16} />
                <div className="font-primary text-2xl tracking-wide">{title}</div>
            </div>
            {children}
        </motion.div>
    )
}

function UserRow({ user, avatar, tag, platform, url }) {
    return (
        <div className="flex items-center gap-4">
            {avatar && <img src={avatar} className="w-14 h-14 rounded-xl border-2 border-hc-brown/20 shadow-sm" alt={user} />}
            <div className="text-left flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-2 underline-offset-2">
                        <div className="font-primary text-xl font-bold truncate">{user}</div>
                    </a>
                    {tag && <Badge>{tag}</Badge>}
                </div>
                {platform && <div className="opacity-60 text-sm font-subheading font-medium">{titleCase(platform)}</div>}
            </div>
        </div>
    )
}

function Activity({ a }) {
    const large = a.assets?.large_image
    const showImage = large && /\.[a-zA-Z0-9]+$/.test(large)
    const img = showImage
        ? large.startsWith("mp:") ? `https://media.discordapp.net/${large.replace("mp:", "")}` : a.application_id ? `https://cdn.discordapp.com/app-assets/${a.application_id}/${large}` : null
        : null

    return (
        <div className="flex gap-3 items-center p-3 rounded-xl bg-hc-brown/5 border border-hc-brown/10 mt-2">
            {a.emoji && <span className="text-2xl">{a.emoji}</span>}
            {img && <img src={img} className="w-12 h-12 rounded-lg shadow-sm" alt="" />}
            <div className="min-w-0">
                <div className="font-bold text-sm font-subheading">{a.name || a.state}</div>
                {a.details && <div className="opacity-70 text-xs truncate">{a.details}</div>}
                {a.state && a.name && <div className="opacity-50 text-xs truncate">{a.state}</div>}
            </div>
        </div>
    )
}
