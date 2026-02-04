"use client"
import { useState, useEffect } from "react"
import { X, ArchiveX, Calendar, MapPin, Users, Trophy, Sparkles, MonitorSmartphone, Clock, TrendingUp, UserCheck, Heart, BarChart3, Activity, Link, GitGraph } from "lucide-react"
import { differenceInSeconds, differenceInDays, differenceInHours, differenceInMinutes, format, startOfWeek, endOfWeek, eachWeekOfInterval, isSameWeek } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import StatusViewer from "@/components/spy"
import { format as timeago } from 'timeago.js';

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
        <div className="text-xl font-subheading">The Campfire is Lit! 🔥</div>
    )

    return (
        <div className="flex gap-4 text-center justify-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                    <span className="text-4xl font-subheading tabular-nums">
                        {String(value).padStart(2, '0')}
                    </span>
                    <span className="text-xs uppercase opacity-60 font-medium tracking-wider mt-1">{unit}</span>
                </div>
            ))}
        </div>
    )
}

function InfoCard({ icon: Icon, title, value, color = "bg-white/5", link, subtitle }) {
    return (
        <div className={`bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 hover:backdrop-blur-none backdrop-blur-sm transition-all duration-300 cursor-default group`}>
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                    <Icon size={24} strokeWidth={1.5} />
                </div>
                {link && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link size={16} className="text-white/40" />
                    </div>
                )}
            </div>

            <div>
                <p className="text-sm uppercase tracking-wider opacity-60 font-medium mb-1">
                    {title}
                </p>
                {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-xl font-subheading hover:underline decoration-1 underline-offset-4 block">{value}</a>
                ) : <p className="text-2xl font-subheading">{value}</p>}
                {subtitle && <p className="text-sm mt-1 opacity-50">{subtitle}</p>}
            </div>
        </div>
    )
}

function SignupGraph({ signupTimes = [] }) {
    const [hover, setHover] = useState(null)
    if (!signupTimes.length) return null

    const W = 1000, H = 300, PX = 0, PY = 40

    const dates = signupTimes.map(t => new Date(t)).sort((a, b) => a - b)
    const start = new Date(dates[0]); start.setHours(0, 0, 0, 0)
    const end = new Date(); end.setHours(23, 59, 59, 999)

    const data = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 2)) {
        const n = new Date(d); n.setDate(n.getDate() + 2)
        data.push({
            label: format(d, 'MMM d'),
            count: dates.filter(t => t >= d && t < n).length
        })
    }

    const max = Math.max(...data.map(d => d.count), 1)
    const points = data.map((d, i) => ({
        x: (i / Math.max(data.length - 1, 1)) * W,
        y: PY + (1 - d.count / max) * (H - PY * 2),
        ...d
    }))

    const pathD = points.reduce(
        (d, p, i) =>
            !i ? `M ${p.x} ${p.y}` :
                d + ` C ${(points[i - 1].x + p.x) / 2} ${points[i - 1].y},
               ${(points[i - 1].x + p.x) / 2} ${p.y},
               ${p.x} ${p.y}`,
        ""
    )

    const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`

    return (
        <div className="w-full bg-white/5 p-0 rounded-2xl border border-white/10 hover:bg-white/10 hover:backdrop-blur-none backdrop-blur-sm transition-all duration-300 cursor-default group overflow-hidden group/graph flex flex-col justify-between">
            <div className="p-8 pb-0 flex justify-between items-start relative z-10">
                <div>
                    <h4 className="text-lg sm:text-xl font-subheading flex items-center gap-2 text-white/90">
                        <Activity size={20} className="text-green-400" />
                        Signup Rate
                    </h4>
                    <p className="text-xs sm:text-sm opacity-50 mt-1">
                        {data[0]?.label} — {data[data.length - 1]?.label}
                    </p>
                </div>
            </div>

            <div className="relative w-full mt-auto" style={{ aspectRatio: '3/1' }}>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    <motion.path
                        d={areaD}
                        fill="url(#liquidGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />

                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.8 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {points.map((p, i) => (
                        <g key={i}>
                            <rect
                                x={p.x - (W / data.length / 2)}
                                y={0}
                                width={W / data.length}
                                height={H}
                                fill="transparent"
                                onMouseEnter={() => setHover(i)}
                                onMouseLeave={() => setHover(null)}
                            />
                            {hover === i && (
                                <>
                                    <g transform={`translate(${p.x}, ${p.y - 20})`}>
                                        <text textAnchor="middle" className="fill-white text-4xl font-subheading tabular-nums drop-shadow-md translate-x-4 select-none -z-2">
                                            {p.count}
                                        </text>
                                    </g>
                                </>
                            )}
                        </g>
                    ))}
                </svg>

                <div className="absolute bottom-4 left-0 w-full pointer-events-none px-8">
                    <AnimatePresence>
                        {hover !== null && (
                            <motion.div
                                initial={{ opacity: 0, x: points[hover].x / W * 100, y: 0 }}
                                animate={{ opacity: 1, x: points[hover].x / W * 100, y: 0 }}
                                exit={{ opacity: 0, y: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="absolute bottom-0"
                                style={{
                                    left: `${(points[hover].x / W) * 85 - 3}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold whitespace-nowrap bg-[#001122]/80 backdrop-blur-sm px-2 py-1 rounded border border-emerald-500/20">
                                    {data[hover].label}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

function AgeDistribution({ ages, eventData }) {
    const [hoveredAge, setHoveredAge] = useState(null)

    const getAgeData = () => {
        if (!ages || Object.keys(ages).length === 0) return []
        return Object.entries(ages)
            .filter(([_, count]) => count > 0)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
    }

    const ageData = getAgeData()

    if (ageData.length === 0) {
        return (
            <div className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 hover:backdrop-blur-none backdrop-blur-sm transition-all duration-300 cursor-default group flex flex-col items-center justify-center min-h-[300px]">
                <Users size={32} className="text-white/20 mb-4" />
                <h4 className="text-xl font-subheading uppercase tracking-wider text-white/40">
                    Age Distribution
                </h4>
                <p className="text-sm opacity-30 mt-2">No age data available yet</p>
            </div>
        )
    }

    const max = Math.max(...ageData.map(([_, count]) => count))
    const total = ageData.reduce((sum, [_, count]) => sum + count, 0)

    return (
        <div className="w-full bg-white/5 p-6 sm:p-8 rounded-3xl border border-white/10 hover:bg-white/10 hover:backdrop-blur-none backdrop-blur-sm transition-all duration-300 cursor-default group flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-lg sm:text-xl font-subheading flex items-center gap-2 text-white/90">
                        <Users size={20} className="text-purple-400" />
                        Age Distribution
                    </h4>
                    <p className="text-xs sm:text-sm opacity-50 mt-1">{ageData.length} age groups • {total} selected</p>
                </div>
                <div className="grid grid-cols-4 gap-x-3 gap-y-0 text-right">
                    {[
                        ["he/him", eventData.participants?.boys],
                        ["she/her", eventData.participants?.gals],
                        ["other", eventData.participants?.other],
                        ["orgs", eventData.participants?.volunteer],
                    ].map(([l, c], i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-sm sm:text-md uppercase opacity-30 font-medium tracking-wider">{l}</span>
                            <span className="text-md sm:text-lg font-subheading text-white/80 tabular-nums">{c || 0}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex items-end justify-between gap-1 sm:gap-2 w-full" style={{ minHeight: '240px', height: '240px' }}>
                    {ageData.map(([age, count], index) => {
                        const percentage = Math.max(5, (count / max) * 100)
                        return (
                            <div
                                key={age}
                                className="group/bar relative flex-1 flex flex-col items-center gap-1.5 h-full justify-end min-w-0"
                                onMouseEnter={() => setHoveredAge(age)}
                                onMouseLeave={() => setHoveredAge(null)}
                            >
                                <div className="relative w-full bg-white/5 rounded-t-md overflow-hidden flex items-end justify-center transition-all duration-300 group-hover/bar:bg-white/10 h-full">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${percentage}%` }}
                                        transition={{ duration: 0.8, delay: index * 0.04, ease: [0.4, 0, 0.2, 1] }}
                                        className="w-full absolute bottom-0 bg-purple-400 transition-all duration-300 rounded-t-sm"
                                    >
                                        {percentage > 25 && (
                                            <div className="absolute inset-x-0 top-2 flex justify-center">
                                                <span className="text-md sm:text-lg font-bold text-white tabular-nums">
                                                    {count}
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                                <span className="text-sm sm:text-md font-medium opacity-40 group-hover/bar:opacity-100 group-hover/bar:text-purple-300 transition-all tabular-nums truncate w-full text-center">
                                    {age}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default function DashboardClient({ user, data }) {
    const [isDismissed, setIsDismissed] = useState(false)
    const [isForeverDismissed, setIsForeverDismissed] = useState(false)
    const [spyMode, setSpyMode] = useState(false)
    const [eventData, setEventData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const res = await fetch('/api/event/info')
                const data = await res.json()
                setEventData(data)
            } catch (err) {
                console.error("Failed to fetch event data:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchEventData()
    }, [])

    const STORAGE_KEY = "dismissed_notes"

    useEffect(() => {
        if (data.note) {
            try {
                const dismissed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
                if (dismissed.includes(data.note)) {
                    setIsForeverDismissed(true)
                }
            } catch (e) {
                console.error("Failed to read local storage", e)
            }
        }
    }, [data])

    const handleDismiss = () => {
        setIsDismissed(true)
    }

    const handleDismissForever = () => {
        setIsDismissed(true)
        setIsForeverDismissed(true)
        try {
            const dismissed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
            if (!dismissed.includes(data.note)) {
                dismissed.push(data.note)
                localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed))
            }
        } catch (e) {
            console.error("Failed to save to local storage", e)
        }
    }

    if (!user) return null

    if (loading) {
        return (
            <div className="min-h-screen bg-[#001122] flex items-center justify-center">
                <div className="animate-bounce">
                    <Sparkles className="text-hc-star w-12 h-12" />
                </div>
            </div>
        )
    }

    const showNote = data.note && !isDismissed && !isForeverDismissed

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#001122] via-[#001a33] to-[#002244] p-4 sm:p-8 font-primary text-white flex flex-col items-center relative overflow-hidden">
            <img
                src="/sky-shine.webp"
                className="absolute w-full top-0 left-0 opacity-30 pointer-events-none mask:linear-gradient(to_bottom,black_60%,transparent)"
                alt=""
            />
            <img
                src="/sky-shine.webp"
                className="absolute w-full bottom-0 left-0 opacity-30 pointer-events-none mask:linear-gradient(to_top,black_60%,transparent) -scale-y-100 -scale-x-100"
                alt=""
            />

            <div className="relative z-10 w-full flex flex-col items-center">
                <h1 className="text-5xl sm:text-7xl solid-shadow mb-2 text-center uppercase">
                    {eventData?.name || "CAMPFIRE LAHORE"}
                </h1>
                <p className="text-lg sm:text-xl font-subheading text-white/70 mb-8">
                    Feb 28 - Mar 1, 2026 • {eventData?.city || "Lahore"}, {eventData?.country || "Pakistan"}
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
                                            {data.note}
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
                                            <p className="font-primary text-xl text-hc-brown font-bold">{data.role || "Hacker"}</p>
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
                                            <p className="font-primary text-lg text-hc-brown">{data["signed-up"] ? "Registered" : "Not Registered"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div onClick={() => setSpyMode(true)} className="mt-4 group cursor-pointer relative overflow-hidden rounded-xl border-4 border-red-500 bg-yellow-300 p-3 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-none transition-all">

                                    <div className="relative flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-red-600 text-white text-sm font-black px-2 py-1 rounded rotate-3 animate-pulse">NEW</span>
                                            <p className="font-primary text-red-900 text-xl font-black italic tracking-wide group-hover:underline decoration-wavy decoration-red-600">
                                                SPY ON YOUR PoC, {eventData.poc.name} NOW!
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
                                title="Format"
                                value={eventData?.format}
                                color="bg-hc-star"
                                subtitle={eventData?.created ? `Announced ${format(new Date(eventData.created), 'EEEE, MMM d, yyyy')}` : ""}
                            />
                            <InfoCard
                                icon={MapPin}
                                title="Venue"
                                value={eventData?.venue?.venueName || "None"}
                                color="bg-hc-emerald"
                                link={eventData?.venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.venue.venueName + ' ' + eventData.venue.addressLine1 + ' ' + eventData.venue.addressCity)}` : "heheh"}
                                subtitle={eventData?.venue?.addressCity}
                            />
                            <InfoCard
                                icon={Users}
                                title="Signups"
                                value={eventData?.participants?.total ? `${eventData.signups}` : "500+ Hackers"}
                                color="bg-hc-tortoise"
                                subtitle={eventData?.goal ? `${Math.round((eventData.signups / eventData.goal) * 100)}% of goal (${eventData.goal})` : ""}
                            />
                            <InfoCard
                                icon={TrendingUp}
                                title="Last signup"
                                value={eventData?.participants?.mostRecent ? timeago(eventData.participants.mostRecent) : "Active"}
                                color="bg-secondary"
                                subtitle="Most recent :>"
                            />
                        </div>
                        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <SignupGraph signupTimes={eventData?.participants?.signupTimes} eventData={eventData} />
                            <AgeDistribution ages={eventData?.participants?.ages} eventData={eventData} />
                        </div>

                        <div className="w-full max-w-6xl bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 hover:backdrop-blur-none backdrop-blur-sm transition-all duration-300 cursor-default group">
                            <h3 className="text-3xl font-primary mb-6 solid-shadow">Quick Links</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <a
                                    href={eventData?.formLink || ("https://forms.hackclub.com/campfire-signup?event=" + process.env.NEXT_PUBLIC_EVENT_ID)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border-2 border-white/20"
                                >
                                    {eventData?.signups > 0 ? `Join ${eventData.signups} others!` : "Did u signup?"}
                                </a>
                                <a
                                    href="/dash/timetable"
                                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border-2 border-white/20"
                                >
                                    Run-of-show?
                                </a>
                                <a
                                    href="https://instagram.com/campfire.lahore"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border-2 border-white/20"
                                >
                                    Instagram
                                </a>
                                <a
                                    href="https://cockpit.hackclub.com/signups"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border-2 border-white/20"
                                >
                                    View THE MAP!
                                </a>
                                <a
                                    href="https://training.campfire.hackclub.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border-2 border-white/20"
                                >
                                    Take the TRAINING
                                </a>
                                <a
                                    href="https://docs.google.com/document/d/1o0q0kp_mEZaAyuyjri4ch_tk83BQNBboIAO9Ntuto54/edit"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border-2 border-white/20"
                                >
                                    The MEGA PLAN
                                </a>
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-12 text-center opacity-60">
                    <p className="font-subheading text-md">
                        Made by Mister Ali :P Also Ammar P:
                    </p>
                </div>
            </div>
        </div>
    )
}
