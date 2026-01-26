import {
    Moon,
    CircleMinus,
    Circle,
    Globe,
    Code,
    CircleEllipsis,
    Wallpaper,
    LucideFullscreen,
    LucidePanelLeft,
    LucidePanelRight,
    LucideMinusSquare,
    MessageCircleMoreIcon
} from "lucide-react"
import { motion } from "framer-motion"

const modes = {
    online: { icon: Circle, color: "bg-green-500 text-transparent rounded-full" },
    idle: { icon: Moon, color: "text-yellow-500" },
    dnd: { icon: CircleMinus, color: "text-red-500" },
    nodisplay: { icon: LucideMinusSquare, color: "text-gray-500" },
    fullscreen: { icon: LucideFullscreen, color: "text-white" },
    left: { icon: LucidePanelLeft, color: "text-cyan-100" },
    right: { icon: LucidePanelRight, color: "text-purple-100" },
    offline: { icon: Circle, color: "text-zinc-500" },
    browsing: { icon: Globe, color: "text-blue-500" },
    chatting: { icon: MessageCircleMoreIcon, color: "text-green-500" },
    coding: { icon: Code, color: "text-indigo-500" },
    typing: { icon: CircleEllipsis, color: "text-emerald-500" },
    background: { icon: Wallpaper, color: "text-slate-500" }
}

export default function StatusDot({ status, size = 12 }) {
    const mode = modes[status] || modes.offline
    const Icon = mode.icon

    return (
        <motion.span
            key={status}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="inline-flex items-center justify-center"
            style={{
                width: size,
                height: size,
                background: Icon ? "transparent" : mode.color.replace("text", "rgb").replace("-", "(") + ")"
            }}
        >
            {Icon && (
                <Icon
                    className={`${mode.color}`}
                    style={{ width: size, height: size }}
                    absoluteStrokeWidth={true}
                    size={Icon == Circle ? 12 : 18}
                />
            )}
        </motion.span>
    )
}
