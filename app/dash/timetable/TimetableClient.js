"use client"
import { useState, useEffect } from "react"
import { Plus, Trash2, Clock, User, X, LayoutGrid } from "lucide-react"
import Link from "next/link"

export default function TimetableClient({ user, availableUsers }) {
    const [activeDate, setActiveDate] = useState(new Date().toISOString().split('T')[0])
    const [tasks, setTasks] = useState([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [newTask, setNewTask] = useState({
        title: "",
        startTime: "09:00",
        endTime: "10:00",
        assignedTo: "",
        color: "bg-hc-star",
        date: new Date().toISOString().split('T')[0]
    })

    const STORAGE_KEY = "campfire_timetable_tasks"

    useEffect(() => {
        const savedTasks = localStorage.getItem(STORAGE_KEY)
        if (savedTasks) {
            try {
                setTasks(JSON.parse(savedTasks))
            } catch (e) {
                console.error("Failed to parse tasks", e)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }, [tasks])

    const handleAddTask = (e) => {
        e.preventDefault()
        if (!newTask.title || !newTask.startTime || !newTask.endTime) return

        const taskToAdd = {
            ...newTask,
            id: Date.now().toString(),
        }

        setTasks([...tasks, taskToAdd].sort((a, b) => a.startTime.localeCompare(b.startTime)))
        setNewTask({
            title: "",
            startTime: "09:00",
            endTime: "10:00",
            assignedTo: "",
            color: "bg-hc-star",
            date: activeDate
        })
        setIsAddModalOpen(false)
    }

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    const colors = [
        { name: "Star Blue", value: "bg-hc-star" },
        { name: "Emerald", value: "bg-hc-emerald" },
        { name: "Secondary", value: "bg-secondary" },
        { name: "Tortoise", value: "bg-hc-tortoise" },
        { name: "Ice Blue", value: "bg-hc-ice" },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#001122] via-[#001a33] to-[#002244] p-4 sm:p-8 font-primary text-white flex flex-col items-center relative overflow-hidden">
            <img
                src="/sky-shine.webp"
                className="absolute w-full top-0 left-0 opacity-30 pointer-events-none"
                alt=""
            />

            <div className="relative z-10 w-full max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                    <div className="text-center md:text-left">
                        <Link href="/dash" className="text-white/60 hover:text-white transition-colors mb-2 block">← Back to Dashboard</Link>
                        <h1 className="text-5xl sm:text-6xl solid-shadow">TIMETABLE</h1>
                        <p className="text-xl font-subheading text-white/70">Assign work and manage the jam schedule</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="hc-button rounded-2xl px-8 py-4 text-2xl flex items-center gap-3 text-hc-brown"
                    >
                        <Plus size={28} />
                        ADD TASK
                    </button>
                </div>

                {/* Date Selector Tabs */}
                <div className="flex gap-4 mb-12 justify-center md:justify-start overflow-x-auto pb-2 scrollbar-hide">
                    {Array.from(new Set([...tasks.map(t => t.date || (t.day === "2" ? "2026-02-02" : "2026-02-01")), activeDate])).sort().map((date) => (
                        <button
                            key={date}
                            onClick={() => setActiveDate(date)}
                            className={`px-6 py-3 rounded-xl text-lg font-primary transition-all whitespace-nowrap ${activeDate === date
                                ? "bg-secondary text-white shadow-[4px_4px_0px_rgba(0,0,0,0.3)] scale-105"
                                : "bg-white/10 text-white/60 hover:bg-white/20"
                                }`}
                        >
                            {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </button>
                    ))}
                </div>

                {tasks.filter(t => (t.date || (t.day === "2" ? "2026-02-02" : "2026-02-01")) === activeDate).length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl border-4 border-dashed border-white/20 p-20 text-center">
                        <Clock size={64} className="mx-auto mb-6 opacity-30" />
                        <h3 className="text-3xl font-primary mb-2">No tasks for {new Date(activeDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</h3>
                        <p className="text-xl text-white/50 mb-8">Start by adding your first mission for this day!</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="text-secondary hover:underline text-xl font-bold"
                        >
                            Create a Task →
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {tasks
                            .filter(t => (t.date || (t.day === "2" ? "2026-02-02" : "2026-02-01")) === activeDate)
                            .map((task) => (
                                <div
                                    key={task.id}
                                    className={`${task.color} p-6 rounded-2xl border-4 border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.2)] text-white relative overflow-hidden group hover:scale-[1.01] transition-all`}
                                >
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="p-2 hover:bg-black/20 rounded-full transition-colors"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-black/20 px-3 py-1 rounded-full font-bold tabular-nums flex items-center gap-2">
                                                    <Clock size={16} />
                                                    {task.startTime} - {task.endTime}
                                                </span>
                                                {task.assignedTo && (
                                                    <span className="bg-white/20 px-3 py-1 rounded-full font-bold flex items-center gap-2">
                                                        <User size={16} />
                                                        {task.assignedTo}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-3xl font-primary solid-shadow">{task.title}</h3>
                                        </div>
                                        <div className="hidden md:block opacity-20">
                                            <LayoutGrid size={48} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="relative bg-hc-paper border-8 border-hc-border rounded-3xl p-8 w-full max-w-xl text-hc-brown shadow-[12px_12px_0px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full text-hc-brown/70 transition-colors"
                        >
                            <X size={32} />
                        </button>

                        <h2 className="text-4xl font-primary mb-8 solid-shadow text-white">New Jam Task</h2>

                        <form onSubmit={handleAddTask} className="flex flex-col gap-6">
                            <div>
                                <label className="block text-sm uppercase font-bold tracking-widest mb-2 opacity-70">Task Title</label>
                                <input
                                    autoFocus
                                    type="text"
                                    required
                                    placeholder="e.g. Workshop Setup"
                                    className="w-full bg-white/50 border-4 border-hc-border rounded-xl p-4 text-2xl font-primary focus:outline-none focus:bg-white transition-colors"
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm uppercase font-bold tracking-widest mb-2 opacity-70">Start Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full bg-white/50 border-4 border-hc-border rounded-xl p-4 text-2xl font-primary focus:outline-none focus:bg-white transition-colors"
                                        value={newTask.startTime}
                                        onChange={e => setNewTask({ ...newTask, startTime: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm uppercase font-bold tracking-widest mb-2 opacity-70">End Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full bg-white/50 border-4 border-hc-border rounded-xl p-4 text-2xl font-primary focus:outline-none focus:bg-white transition-colors"
                                        value={newTask.endTime}
                                        onChange={e => setNewTask({ ...newTask, endTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm uppercase font-bold tracking-widest mb-2 opacity-70">Assign To</label>
                                    <select
                                        className="w-full bg-white/50 border-4 border-hc-border rounded-xl p-4 text-xl font-primary focus:outline-none focus:bg-white appearance-none"
                                        value={newTask.assignedTo}
                                        onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                    >
                                        <option value="">Unassigned</option>
                                        {availableUsers.map(u => (
                                            <option key={u.name} value={u.name}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm uppercase font-bold tracking-widest mb-2 opacity-70">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-white/50 border-4 border-hc-border rounded-xl p-4 text-xl font-primary focus:outline-none focus:bg-white transition-colors"
                                        value={newTask.date}
                                        onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm uppercase font-bold tracking-widest mb-2 opacity-70">Color Label</label>
                                <div className="flex gap-4">
                                    {colors.map(color => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setNewTask({ ...newTask, color: color.value })}
                                            className={`${color.value} w-10 h-10 rounded-full border-4 ${newTask.color === color.value ? 'border-hc-brown' : 'border-transparent'} transition-all hover:scale-110`}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="hc-button mt-4 rounded-xl py-4 text-2xl font-black text-white"
                            >
                                ADD TO TIMETABLE
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="mt-12 text-center opacity-60">
                <p className="font-subheading text-md">
                    Campfire Lahore Timetable Manager
                </p>
            </div>
        </div>
    )
}
