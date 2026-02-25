"use client";
import { useState, useEffect } from "react";
import {
  X,
  ArchiveX,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  MonitorSmartphone,
  TrendingUp,
  RefreshCw,
  LucideLoader2,
  CheckCircle,
  Utensils,
  Shirt,
  Bed,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import StatusViewer from "@/components/spy";
import { format as timeago } from "timeago.js";

import InfoCard from "@/components/card";
import AgeDistribution from "@/components/distribution";
import SignupGraph from "@/components/graph";
import CountdownTimer from "@/components/countdown";
import Lookup from "@/components/lookup";
import Chat from "@/components/chat";
import Referrals from "@/components/referrals";
import ListStats from "@/components/list-stats";

export default function DashboardClient({ user, data }) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isForeverDismissed, setIsForeverDismissed] = useState(false);
  const [spyMode, setSpyMode] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ml, setMl] = useState(true);
  const [status, setStatus] = useState({ signedUp: false, loading: true });

  async function fetchEventData() {
    try {
      setMl(true);
      const res = await fetch("/api/event/info");
      const edata = await res.json();
      setEventData(edata);
    } catch (err) {
      console.error("Failed to fetch event data:", err);
    } finally {
      setLoading(false);
      setMl(false);
    }
  }

  useEffect(() => {
    fetchEventData();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      fetchEventData();
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(
          "/api/event/lookup?q=" + encodeURIComponent(data.name),
        );
        const edata = await res.json();
        setStatus(edata.result);
      } catch (err) {
        console.error("Failed to fetch signup status:", err);
      } finally {
        setStatus((prevStatus) => ({ ...prevStatus, loading: false }));
      }
    };
    fetchStatus();
  }, []);

  const STORAGE_KEY = "dismissed_notes";

  useEffect(() => {
    if (data.note) {
      try {
        const dismissed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        if (dismissed.includes(data.note)) {
          setIsForeverDismissed(true);
        }
      } catch (e) {
        console.error("Failed to read local storage", e);
      }
    }
  }, [data]);

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const handleDismissForever = () => {
    setIsDismissed(true);
    setIsForeverDismissed(true);
    try {
      const dismissed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!dismissed.includes(data.note)) {
        dismissed.push(data.note);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed));
      }
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001122] flex items-center justify-center">
        <div className="animate-spin">
          <LucideLoader2 className="text-hc-star w-12 h-12" />
        </div>
      </div>
    );
  }

  const showNote = data.note && !isDismissed && !isForeverDismissed;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#001122] via-[#001a33] to-[#002244] p-4 sm:p-8 font-primary text-white flex flex-col items-center relative overflow-hidden">
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
      <div className="sticky top-0 z-30 w-full flex justify-end pointer-events-none">
        <button
          onClick={fetchEventData}
          disabled={ml}
          aria-label="Refresh event data"
          title="Refresh event data"
          className="m-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center pointer-events-auto"
          style={{ position: "sticky", top: 0, right: 0 }}
        >
          <RefreshCw
            size={18}
            className={"text-white/90 " + (ml ? "animate-spin" : "")}
          />
        </button>
      </div>
      <div className="relative z-10 w-full flex flex-col items-center">
        <h1 className="text-5xl sm:text-7xl solid-shadow mb-2 text-center uppercase">
          {eventData?.name || "CAMPFIRE LAHORE"}
        </h1>
        <p className="text-lg sm:text-xl font-subheading text-white/70 mb-8">
          Feb 28 - Mar 1, 2026 • {eventData?.city || "Lahore"},{" "}
          {eventData?.country || "Pakistan"}
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
                    <h2 className="text-3xl font-subheading flex items-center gap-2">
                      <Sparkles size={28} className="text-hc-star" />
                      From the PoC
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
                    {user.image && (
                      <img
                        src={user.image}
                        className="w-32 h-32 rounded-full border-4 border-white image-solid-shadow"
                        alt={user.name}
                      />
                    )}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h2 className="text-4xl mb-1 solid-shadow text-white truncate max-w-full">
                      {user.name}
                    </h2>
                    <p className="font-subheading text-xl text-hc-brown opacity-80 truncate">
                      {user.email}
                    </p>
                    <div className="mt-3 inline-block bg-white/30 px-4 py-2 rounded-full">
                      <p className="font-primary text-xl text-hc-brown">
                        {data.role || "Hacker"}
                      </p>
                    </div>
                    <div className="mt-3 inline-block bg-white/30 px-4 py-2 ml-2 rounded-full">
                      <a
                        className="font-primary text-xl text-hc-brown hover:underline"
                        href="/dash/timetable"
                      >
                        Timetable
                      </a>
                    </div>
                    {data.role == "PoC" && (
                      <div className="mt-3 inline-block bg-white/30 px-4 py-2 rounded-full ml-2">
                        <a
                          className="font-primary text-xl text-hc-brown hover:underline"
                          href="/dash/table"
                        >
                          Signups
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border-2 border-white/30">
                    <p className="font-primary text-sm text-hc-brown/80 mb-1 uppercase tracking-widest">
                      Slack ID
                    </p>
                    <p className="font-primary text-lg text-hc-brown break-all">
                      {user.slackId}
                    </p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border-2 border-white/30 flex items-center justify-between">
                    <div>
                      <p className="font-primary text-sm text-hc-brown/80 mb-1 uppercase tracking-widest">
                        Status
                      </p>
                      <p className="font-primary text-lg text-hc-brown">
                        {status.loading
                          ? "Checking..."
                          : status.signedUp
                            ? status.disabled
                              ? "Rejected" + ` ${timeago(status.time)}`
                              : status.volunteer
                                ? "Signed Up as Organizer" +
                                ` ${timeago(status.time)}`
                                : "Signed Up" + ` ${timeago(status.time)}`
                            : "Not Signed Up!"}

                        {!status.signedUp || status.disabled && (
                          <a
                            href="https://forms.hackclub.com/campfire-signup?event=rec5bXfCOC93cGPBe?r=47"
                            className="ml-2 text-2xl text-red hover:underline"
                          >
                            SIGNUP, NOWW!
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setSpyMode(true)}
                  className="mt-4 group cursor-pointer relative overflow-hidden rounded-xl border-4 border-red-500 bg-yellow-300 p-3 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-red-600 text-white text-sm font-black px-2 py-1 rounded rotate-3 animate-pulse">
                        NEW
                      </span>
                      <p className="font-primary text-red-900 text-xl font-black italic tracking-wide group-hover:underline decoration-wavy decoration-red-600">
                        SPY ON YOUR PoC, {eventData.poc.name} NOW!
                      </p>
                      <span className="bg-red-600 text-white text-sm font-black px-2 py-1 rounded -rotate-3 animate-pulse">
                        HOT!
                      </span>
                    </div>
                    <MonitorSmartphone className="text-red-900 w-8 h-8 rotate-12 group-hover:rotate-0 transition-transform" />
                  </div>
                </div>
              </div>

              <div className="bg-[#384fbc] p-8 rounded-3xl border-4 border-black/10 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/noise.jpg')]"></div>

                <h3 className="text-xl font-subheading mb-6 tracking-wide uppercase opacity-80 relative z-10">
                  Time Until Jam
                </h3>

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

            <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <InfoCard
                icon={Calendar}
                title="Format"
                value={eventData?.format}
                color="bg-hc-star"
                subtitle={
                  eventData?.created
                    ? `Announced ${format(new Date(eventData.created), "EEEE, MMM d, yyyy")}`
                    : ""
                }
              />
              <InfoCard
                icon={MapPin}
                title="Venue"
                value={eventData?.venue?.venueName || "None"}
                color="bg-hc-emerald"
                link={
                  eventData?.venue
                    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.venue.venueName + " " + eventData.venue.addressLine1 + " " + eventData.venue.addressCity)}`
                    : "heheh"
                }
                subtitle={eventData?.venue?.addressCity}
              />
              <InfoCard
                icon={TrendingUp}
                title="Last signup"
                value={
                  eventData?.participants?.mostRecent
                    ? timeago(eventData.participants.mostRecent)
                    : "Active"
                }
                color="bg-secondary"
                subtitle={"by " + eventData?.participants?.mostRecentName}
              />
              <InfoCard
                icon={Users}
                title="Signups"
                value={
                  eventData?.signups ? `${eventData.signups}` : "500+ Hackers"
                }
                color="bg-hc-tortoise"
                subtitle={
                  eventData?.goal
                    ? `${Math.round((eventData.signups / eventData.goal) * 100)}% of goal (${eventData.goal})`
                    : ""
                }
              />
              <InfoCard
                icon={CheckCircle}
                title="Checked In"
                value={
                  eventData?.participants?.checkins !== undefined ? `${eventData.participants.checkins}` : "0"
                }
                color="bg-green-600"
                subtitle="Hehe"
              />
              <InfoCard
                icon={CheckCircle2}
                title="Final Checkins"
                value={
                  eventData?.participants?.finalCheckins !== undefined ? `${eventData.participants.finalCheckins}` : "0"
                }
                color="bg-blue-600"
                subtitle="With CNICs"
              />
            </div>
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Chat user={data} />
              <Lookup
                ages={eventData?.participants?.ages}
                eventData={eventData}
              />
              <SignupGraph
                signupTimes={eventData?.participants?.signupTimes}
                eventData={eventData}
              />
              <AgeDistribution
                ages={eventData?.participants?.ages}
                eventData={eventData}
              />
              <Referrals data={eventData?.participants?.referrals} />
              <ListStats title="Dietary Restrictions" icon={Utensils} data={eventData?.participants?.dietaryRestrictions} />
              <ListStats title="Shirt Sizes" icon={Shirt} data={eventData?.participants?.shirtSizes} />
              <ListStats title="Additional Accommodations" icon={Bed} data={eventData?.participants?.accommodations} />
            </div>

            <div className="w-full max-w-6xl bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 hover:backdrop-blur-none backdrop-blur-sm transition-all duration-300 cursor-default group">
              <h3 className="text-3xl font-primary mb-6 solid-shadow">
                Quick Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <a
                  href={
                    eventData?.formLink ||
                    "https://forms.hackclub.com/campfire-signup?event=" +
                    process.env.NEXT_PUBLIC_EVENT_ID
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border border-white/5"
                >
                  {eventData?.signups > 0
                    ? `Join ${eventData.signups} others!`
                    : "Did u signup?"}
                </a>
                <a
                  href="/dash/timetable"
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border border-white/5"
                >
                  Run-of-show?
                </a>
                <a
                  href="https://instagram.com/campfire.lahore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border border-white/5"
                >
                  Instagram
                </a>
                <a
                  href="https://cockpit.hackclub.com/signups"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border border-white/5"
                >
                  View THE MAP!
                </a>
                <a
                  href="https://training.campfire.hackclub.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border border-white/5"
                >
                  Take the TRAINING
                </a>
                <a
                  href="https://docs.google.com/document/d/1o0q0kp_mEZaAyuyjri4ch_tk83BQNBboIAO9Ntuto54/edit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-subheading text-white px-6 py-4 text-xl text-center block border border-white/5"
                >
                  The MEGA PLAN
                </a>
              </div>
            </div>
          </>
        )}

        <div className="mt-12 text-center opacity-60">
          <p className="font-subheading text-md">
            Made by Mister Ali :P Also Ammar P: | Data updated{" "}
            {timeago(new Date(eventData?.lastUpdated))}
          </p>
        </div>
      </div>
    </div>
  );
}
