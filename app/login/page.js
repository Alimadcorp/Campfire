"use client"
import { signIn } from "next-auth/react"

export default function Login() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-primary flex items-center justify-center">
      <img
        src="/sky-shine.webp"
        className="absolute w-full top-0 mask:linear-gradient(to_bottom,black_60%,transparent)"
        alt=""
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">
        <div className="flex flex-row items-center gap-2 mb-4">
          <a
            href="https://hackclub.com"
            className="relative w-28 h-10 hover:scale-105 transition-transform"
          >
            <img
              src="/hc-flag.png"
              className="w-full h-full transition-transform duration-300 hover:opacity-20 image-solid-shadow"
              alt="Hack Club"
            />
            <img
              src="/hc-flag-red.png"
              className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300 hover:opacity-80 image-solid-shadow"
              alt="Hack Club"
            />
          </a>
          <div className="h-7 bg-white w-px"></div>
          <a
            href="https://opensauce.com"
            className="relative w-11 h-14 hover:scale-105 transition-transform"
          >
            <img
              src="/opensauce.webp"
              className="w-full h-full transition-transform duration-300 -translate-y-2 hover:opacity-0 image-solid-shadow"
              alt="Open Sauce"
            />
            <img
              src="/opensauce-yellow.webp"
              className="absolute inset-0 w-full h-full opacity-0 transition-opacity -translate-y-2 duration-300 hover:opacity-100 image-solid-shadow"
              alt="Open Sauce"
            />
          </a>
        </div>

        <h1 className="sm:text-8xl text-5xl font-primary text-white solid-shadow text-shadow-[#0005]">
          CAMPFIRE LAHORE
        </h1>

        <p className="max-w-xl sm:text-2xl text-lg text-white/90 tracking-wide font-subheading text-shadow-2xs">
          Game jam for High schoolers
          <br />
          Feb 28 - Mar 1
          <br />
          Organized by Teenagers in Lahore
        </p>

        <button
          onClick={() => signIn("slack")}
          className="hc-button rounded-2xl font-primary text-[#8d3f34] px-8 py-4 text-3xl mt-4 cursor-pointer"
        >
          Login with Slack
        </button>



        <p className="text-lg font-subheading text-white/70 mt-4">
          Sign in to access your dashboard
        </p>
      </div>

      <img
        src="/sky-shine.webp"
        className="sm:block absolute hidden bottom-0 left-0"
        alt=""
      />
    </div>
  )
}
