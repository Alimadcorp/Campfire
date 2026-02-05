import { Link } from "lucide-react";

export default function InfoCard({
  icon: Icon,
  title,
  value,
  color = "bg-white/5",
  link,
  subtitle,
}) {
  return (
    <div
      className={`bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 hover:backdrop-blur-none backdrop-blur-sm transition-all duration-300 cursor-default group`}
    >
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
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-subheading hover:underline decoration-1 underline-offset-4 block"
          >
            {value}
          </a>
        ) : (
          <p className="text-2xl font-subheading">{value}</p>
        )}
        {subtitle && <p className="text-sm mt-1 opacity-50">{subtitle}</p>}
      </div>
    </div>
  );
}