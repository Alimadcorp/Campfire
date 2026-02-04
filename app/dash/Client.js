"use client"
import { useState, useEffect } from "react"
import { X, ArchiveX, Calendar, MapPin, Users, Trophy, Sparkles, MonitorSmartphone, Clock } from "lucide-react"
import { differenceInSeconds, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns"
import StatusViewer from "@/components/spy"

function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState(null)

    const targetDate = new Date("2026-02-28T08:00:00+05:00")

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            if (now >= targetDate) {
                setTimeLeft(null)
                return
            }
            setTimeLeft({
                days: differenceInDays(targetDate, now),
                hours: differenceInHours(targetDate, now) % 24,
                minutes: differenceInMinutes(targetDate, now) % 60,
                seconds: differenceInSeconds(targetDate, now) % 60
            })
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)
        return () => clearInterval(timer)
    }, [])

    if (!timeLeft) return (
        <div className="text-xl font-bold">The Campfire is Lit! 🔥</div>
    )

    return (
        <div className="flex gap-4 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col">
                    <span className="text-4xl font-bold solid-shadow font-primary tabular-nums">
                        {String(value).padStart(2, '0')}
                    </span>
                    <span className="text-xs uppercase opacity-80 font-bold tracking-wider">{unit}</span>
                </div>
            ))}
        </div>
    )
}

function InfoCard({ icon: Icon, title, value, color = "bg-hc-emerald", link }) {
    return (
        <div className={`${color} p-6 rounded-2xl border-4 border-black/10 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] text-white relative overflow-hidden group hover:scale-105 transition-transform`}>
            <div className="absolute top-2 right-2 opacity-20">
                <Icon size={48} strokeWidth={1.5} />
            </div>
            <div className="relative z-10">
                <p className="text-sm uppercase tracking-wider opacity-80 font-bold mb-1">{title}</p>
                {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-2xl font-primary font-bold">{value}</a>
                ) : <p className="text-2xl font-primary font-bold">{value}</p>}
            </div>
        </div>
    )
}

export default function DashboardClient({ user, note, role }) {
    const [isDismissed, setIsDismissed] = useState(false)
    const [isForeverDismissed, setIsForeverDismissed] = useState(false)
    const [spyMode, setSpyMode] = useState(false)

    const STORAGE_KEY = "dismissed_notes"

    useEffect(() => {
        if (note) {
            try {
                const dismissed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
                if (dismissed.includes(note)) {
                    setIsForeverDismissed(true)
                }
            } catch (e) {
                console.error("Failed to read local storage", e)
            }
        }
    }, [note])

    const handleDismiss = () => {
        setIsDismissed(true)
    }

    const handleDismissForever = () => {
        setIsDismissed(true)
        setIsForeverDismissed(true)
        try {
            const dismissed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
            if (!dismissed.includes(note)) {
                dismissed.push(note)
                localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed))
            }
        } catch (e) {
            console.error("Failed to save to local storage", e)
        }
    }

    if (!user) return null

    const showNote = note && !isDismissed && !isForeverDismissed

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#001122] via-[#001a33] to-[#002244] p-4 sm:p-8 font-primary text-white flex flex-col items-center relative overflow-hidden">
            <img
                src="/sky-shine.webp"
                className="absolute w-full top-0 left-0 opacity-30 pointer-events-none mask:linear-gradient(to_bottom,black_60%,transparent)"
                alt=""
            />

            <div className="relative z-10 w-full flex flex-col items-center">
                <h1 className="text-5xl sm:text-7xl solid-shadow mb-2 text-center">
                    CAMPFIRE LAHORE
                </h1>
                <p className="text-lg sm:text-xl font-subheading text-white/70 mb-8">
                    Feb 28 - Mar 1, 2026 • Lahore, Pakistan
                </p>

                {spyMode ? (
                    <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <StatusViewer onClose={() => setSpyMode(false)} />
                    </div>
                ) : (
                    <>
                        {showNote && (
                            <div className="w-full max-w-4xl animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
                                <div className="bg-hc-paper border-4 border-hc-border text-hc-brown p-8 rounded-2xl relative shadow-[8px_8px_0px_rgba(0,0,0,0.2)] transform -rotate-1 transition-transform hover:rotate-0">
                                    <div className="absolute top-4 right-4 flex gap-3">
                                        <button
                                            onClick={handleDismiss}
                                            className="p-2 hover:bg-black/10 rounded-full transition-colors text-hc-brown/70 hover:text-hc-brown"
                                            title="Dismiss for now"
                                        >
                                            <X size={24} />
                                        </button>
                                        <button
                                            onClick={handleDismissForever}
                                            className="p-2 hover:bg-black/10 rounded-full transition-colors text-hc-brown/70 hover:text-red-600"
                                            title="Don't show this again"
                                        >
                                            <ArchiveX size={24} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <h2 className="text-3xl font-bold font-subheading flex items-center gap-2">
                                            <Sparkles size={28} className="text-hc-star" />
                                            From the Organizers
                                        </h2>
                                        <div className="text-xl font-serif leading-relaxed opacity-90">
                                            {note}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                            <div className="lg:col-span-2 bg-secondary p-8 rounded-3xl border-4 border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                                    <div className="relative shrink-0">
                                        {user.image && <img
                                            src={user.image}
                                            className="w-32 h-32 rounded-full border-4 border-white image-solid-shadow"
                                            alt={user.name}
                                        />}
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                        <h2 className="text-4xl mb-1 text-hc-brown solid-shadow text-white truncate max-w-full">{user.name}</h2>
                                        <p className="font-subheading text-xl text-hc-brown opacity-80 truncate">{user.email}</p>
                                        <div className="mt-3 inline-block bg-white/30 px-4 py-2 rounded-full">
                                            <p className="font-primary text-xl text-hc-brown font-bold">{role || "Hacker"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border-2 border-white/30">
                                        <p className="font-primary text-sm text-hc-brown/80 mb-1 uppercase tracking-widest text-xs font-bold">Slack ID</p>
                                        <p className="font-primary text-lg text-hc-brown break-all">{user.slackId}</p>
                                    </div>
                                    <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border-2 border-white/30 flex items-center justify-between">
                                        <div>
                                            <p className="font-primary text-sm text-hc-brown/80 mb-1 uppercase tracking-widest text-xs font-bold">Status</p>
                                            <p className="font-primary text-lg text-hc-brown">✓ Registered</p>
                                        </div>
                                    </div>
                                </div>

                                <div onClick={() => setSpyMode(true)} className="mt-4 group cursor-pointer relative overflow-hidden rounded-xl border-4 border-red-500 bg-yellow-300 p-3 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-none transition-all">
                                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20"></div>
                                    <div className="relative flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-red-600 text-white text-sm font-black px-2 py-1 rounded rotate-3 animate-pulse">NEW</span>
                                            <p className="font-primary text-red-900 text-xl font-black italic tracking-wide group-hover:underline decoration-wavy decoration-red-600">
                                                SPY ON YOUR POC NOW!
                                            </p>
                                            <span className="bg-red-600 text-white text-sm font-black px-2 py-1 rounded -rotate-3 animate-pulse">HOT!</span>
                                        </div>
                                        <MonitorSmartphone className="text-red-900 w-8 h-8 rotate-12 group-hover:rotate-0 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#384fbc] p-8 rounded-3xl border-4 border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10 bg-[url('/noise.jpg')]"></div>

                                <h3 className="text-xl font-subheading mb-6 tracking-wide uppercase opacity-80 relative z-10">Time Until Jam</h3>

                                <div className="relative z-10">
                                    <CountdownTimer />
                                </div>

                                <div className="mt-6 relative z-10 max-w-xs">
                                    <p className="font-serif italic opacity-70 text-sm">
                                        uuuhh- uhmmmm...
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <InfoCard
                                icon={Calendar}
                                title="Duration"
                                value="12-12 Hour"
                                color="bg-hc-star"
                            />
                            <InfoCard
                                icon={MapPin}
                                title="Location"
                                value="Takhleeq Business Incubator, UCP"
                                color="bg-hc-emerald"
                                link="https://maps.app.goo.gl/E8r421h2eRCDsJmNA"
                            />
                            <InfoCard
                                icon={Users}
                                title="Expected"
                                value="500+ Hackers"
                                color="bg-hc-tortoise"
                            />
                            <InfoCard
                                icon={Trophy}
                                title="Prizes"
                                value="TBA"
                                color="bg-secondary"
                            />
                        </div>

                        <div className="w-full max-w-6xl bg-white/5 backdrop-blur-sm border-2 border-white/10 p-8 rounded-3xl">
                            <h3 className="text-3xl font-primary mb-6 solid-shadow">Quick Links</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <a
                                    href="https://forms.hackclub.com/campfire-signup?event=rec5bXfCOC93cGPBe"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hc-button rounded-xl font-subheading text-[#8d3f34] px-6 py-4 text-xl text-center block"
                                >
                                    Did u signup?
                                </a>
                                <a
                                    href="/dash/timetable"
                                    className="bg-hc-star hover:bg-hc-star/80 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border-2 border-white/20 flex items-center justify-center gap-2"
                                >
                                    <Clock size={20} />
                                    Timetable
                                </a>
                                <a
                                    href="https://instagram.com/campfire.lahore"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border-2 border-white/20"
                                >
                                    Instagram
                                </a>
                                <a
                                    href="https://cockpit.hackclub.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border-2 border-white/20"
                                >
                                    The Cockpit
                                </a>
                                <a
                                    href="https://docs.google.com/document/d/1o0q0kp_mEZaAyuyjri4ch_tk83BQNBboIAO9Ntuto54/edit"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border-2 border-white/20"
                                >
                                    The MEGA PLAN
                                </a>
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-12 text-center opacity-60">
                    <p className="font-subheading text-md">
                        Made by Mister Ali :P
                    </p>
                </div>
            </div>
        </div>
    )
}
