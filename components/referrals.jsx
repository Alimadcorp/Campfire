import { Link2 } from "lucide-react";

export default function Referrals({ data }) {
    let wdata = {};
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        wdata[item] = (wdata[item] || 0) + 1;
    }
    delete wdata[54000];
    wdata = Object.fromEntries(
        Object.entries(wdata).sort((a, b) => b[1] - a[1])
    );
    return (
        <div className="w-full bg-white/5 p-4 lg:col-span-2 rounded-3xl border border-white/10 hover:bg-white/10 hover:backdrop-blur-none backdrop-blur-sm transition-all duration-300 cursor-default group flex flex-col">
            <div>
                <h4 className="text-lg sm:text-xl font-subheading flex items-center gap-2 text-white/90">
                    <Link2 size={20} className="text-blue-400" />
                    Referrals
                </h4>
                <p className="text-xs sm:text-sm opacity-50 mt-1">
                </p>
            </div>
            <div className="">
                <div>
                    {wdata && Object.keys(wdata).length > 0 ? (
                        Object.entries(wdata).map(([referrer, count]) => (
                            <span key={referrer} className="px-2 py-0 mx-0.5 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-subheading">
                                <span className="text-sm text-white/80 translate-y-0.5">{referrer}</span>
                                <span className="text-sm text-white/50 translate-y-0.5">{count}</span>
                            </span>
                        ))
                    ) : (
                        <div className="text-sm text-white/50">No referrals found</div>
                    )}
                </div>
            </div>
        </div>
    );
}