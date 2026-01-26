"use client"
import { useState, useEffect } from "react"
import { X, ArchiveX } from "lucide-react"
import { differenceInSeconds, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns"

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

export default function DashboardClient({ user, note, role }) {
    const [isDismissed, setIsDismissed] = useState(false)
    const [isForeverDismissed, setIsForeverDismissed] = useState(false)
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
        <div className="min-h-screen bg-primary p-4 sm:p-8 font-primary text-white flex flex-col items-center">
            <h1 className="text-5xl sm:text-7xl solid-shadow mb-8 text-center tracking-wider">
                CAMPFIRE DASHBOARD
            </h1>

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
                                From the Organizers
                            </h2>
                            <div className="text-xl font-serif leading-relaxed opacity-90">
                                {note}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-secondary p-8 rounded-3xl border-4 border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] text-center md:text-left flex flex-col justify-between">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative shrink-0">
                            {user.image && <img
                                src={user.image}
                                className="w-32 h-32 rounded-full border-4 border-white image-solid-shadow"
                                alt={user.name}
                            />}
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-4xl mb-1 text-hc-brown solid-shadow text-white truncate max-w-full">{user.name}</h2>
                            <p className="font-subheading text-xl text-hc-brown opacity-80 truncate">{user.email}</p>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border-2 border-white/30">
                            <p className="font-mono text-sm text-hc-brown/80 mb-1 uppercase tracking-widest text-xs font-bold">Slack ID</p>
                            <p className="font-mono text-lg text-hc-brown break-all">{user.slackId}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border-2 border-white/30">
                            <p className="font-mono text-sm text-hc-brown/80 mb-1 uppercase tracking-widest text-xs font-bold">Role</p>
                            <p className="font-primary text-2xl text-hc-brown">{role || "Scout"}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#384fbc] p-8 rounded-3xl border-4 border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')]"></div>

                    <h3 className="text-2xl font-subheading mb-6 tracking-wide uppercase opacity-80 relative z-10">Countdown to Campfire</h3>

                    <div className="relative z-10">
                        <CountdownTimer />
                    </div>

                    <div className="mt-8 relative z-10 max-w-xs">
                        <p className="font-serif italic opacity-70">
                            "Get ready to build something incredible."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
