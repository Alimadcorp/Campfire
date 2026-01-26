import { NextResponse } from 'next/server';

// this page has been cooked.
// DO NOT TOUCH THIS PAGE.

export async function GET() {
  return NextResponse.redirect('https://campfire.hackclub.com/lahore', 307);
}

/*function Letter() {
  return (
    <div className="grid grid-cols-1 gap-3">
      <p className="font-bold text-3xl">Dear Hackers, Students, and Artists,</p>
      <p>
        Welcome to Hack Club's newest adventure. This winter we invite you to
        join us for Campfire, the world's biggest Game Jam happening
        simultaneously in 200 cities.
      </p>

      <strong>Hack Club wants you to make a game this February.</strong>

      <p>
        Don't consider yourself a game dev? No problem - we have tons of online
        and in-person workshops for you to make your first game!
      </p>

      <p>
        To kick off 2026, we're so excited to invite you to learn something new,
        make something you're really proud of, meet new friends, and go on an
        incredible adventure together.
      </p>

      <p>With love,</p>

      <strong>The Campfire Team</strong>
    </div>
  );
}

const faqs = [
  {
    question: "What is a game jam?",
    answer:
      "A game jam is an event where you build a game from scratch in a short time period! It's all about creativity, teamwork, and having fun while learning new skills.",
  },
  {
    question: "Am I eligible?",
    answer:
      "If you're a high schooler (or younger), you're eligible! No prior experience required — just bring your enthusiasm and willingness to learn.",
  },
  {
    question: "But I've never hacked before!",
    answer:
      "Perfect! Game jams are designed for beginners. You'll have workshops, mentors, and teammates to help you every step of the way.",
  },
  {
    question: "All this, for free?",
    answer:
      "Yes! Everything is completely free — venue, food, swag, workshops, and prizes. Hack Club covers all costs so you can focus on creating.",
  },
  {
    question: "What do I need to bring?",
    answer:
      "Just bring yourself, a laptop, charger, and any personal items you need. We'll provide food, drinks, and everything else!",
  },
];

function FAQ() {
  return (
    <section className="w-full px-0 py-24 flex flex-col items-center">
      <h2 className="mb-12 text-center text-5xl font-primary solid-shadow">
        FAQ
      </h2>
      <div className="flex flex-col items-center space-y-4 w-full">
        {faqs.map(({ question, answer }, idx) => (
          <details
            key={idx}
            className="w-[80vw] md:w-[60vw] group rounded-2xl border-4 border-black/30 bg-secondary p-6"
          >
            <summary className="cursor-pointer text-hc-brown list-none text-2xl font-subheading font-bold select-none">
              {question}
            </summary>
            <p className="mt-4 text-black/70 leading-relaxed text-xl font-subheading">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="flex min-h-screen items-center justify-center bg-primary"
        suppressHydrationWarning
      >
        <img
          src="/sky-shine.webp"
          className="absolute w-full top-0 mask:linear-gradient(to_bottom,black_60%,transparent)"
        />
        <main className="flex w-full max-w-5xl flex-col items-center gap-5 px-8 pt-32 pb-8 text-center z-1">
          <div className="flex flex-row items-center gap-2">
            <a
              href="https://hackclub.com"
              className="relative w-28 h-10 hover:scale-105 transition-transform"
            >
              <img
                src="/hc-flag.png"
                className="w-full h-full transition-transform duration-300 hover:opacity-20 image-solid-shadow"
              />
              <img
                src="/hc-flag-red.png"
                className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300 hover:opacity-80 image-solid-shadow"
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
              />
              <img
                src="/opensauce-yellow.webp"
                className="absolute inset-0 w-full h-full opacity-0 transition-opacity -translate-y-2 duration-300 hover:opacity-100 image-solid-shadow"
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
          <a
            href="https://forms.hackclub.com/campfire-signup?event=rec5bXfCOC93cGPBe"
            className="hc-button rounded-2xl font-primary text-[#8d3f34] px-6 py-3 text-3xl"
          >
            RSVP Now
          </a>
          <p className="text-lg font-subheading text-white/80">
            Follow{" "}
            <a
              href="https://instagram.com/campfire.lahore"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block tracking-wide"
            >
              @campfire.lahore
            </a>{" "}
            on Instagram for updates
          </p>

          <div className="relative w-full max-w-4xl mx-auto">
            <div className="relative hidden lg:block aspect-4/3">
              <img
                src="/map.png"
                className="absolute inset-0 h-full w-full rounded-2xl object-contain"
              />
              <div
                className="absolute text-md text-left leading-relaxed text-black font-serif"
                style={{
                  top: "26%",
                  left: "18%",
                  right: "12%",
                  bottom: "10%",
                }}
              >
                <Letter />
              </div>
            </div>
            <div className="block lg:hidden rounded-2xl border-2 border-hc-border bg-hc-paper p-6">
              <div className="text-lg max-w-3xl text-left leading-relaxed text-black font-serif">
                <Letter />
              </div>
            </div>
          </div>
          <FAQ />
          <footer className="w-full px-0 py-0 text-white">
            <div className="mx-auto grid gap-12 sm:grid-cols-3 font-subheading">
              <div className="flex flex-col gap-4 sm:text-right">
                <p className="text-xl text-transparent font-subheading mb-0">
                  -
                </p>
                <nav className="hidden flex-col gap-2 text-2xl sm:flex">
                  <a href="https://hackclub.com" className="hover:underline">
                    Hack Club
                  </a>
                  <a
                    href="https://hackclub.com/slack"
                    className="hover:underline"
                  >
                    Slack
                  </a>
                  <a
                    href="https://hackclub.com/clubs"
                    className="hover:underline"
                  >
                    Clubs
                  </a>
                  <a
                    href="https://hackclub.com/conduct"
                    className="hover:underline"
                  >
                    Code of Conduct
                  </a>
                </nav>

                <p className="text-xs opacity-60 font-bold hidden sm:inline">
                  © 2026 Hack Club. 501(c)(3) nonprofit (EIN: 81-2908499)
                </p>
              </div>
              <div className="text-left text-base leading-relaxed sm:col-span-2 sm:text-white text-black">
                <p className="text-xl font-subheading mb-4 opacity-80">
                  made with love by Hack Club & Open Sauce
                </p>
                <p className="opacity-80">
                  Hack Club is a 501(c)(3) nonprofit and network of 60k+
                  technical high schoolers. We believe you learn best by
                  building, so we're creating community and providing grants so
                  you can make awesome projects.
                </p>

                <p className="mt-4 sm:text-white/80 text-black/80">
                  In the past few years, we've partnered with GitHub to run{" "}
                  <a href="https://summer.hackclub.com">Summer of Making</a>,
                  hosted the{" "}
                  <a href="https://github.com/hackclub/the-hacker-zephyr">
                    world's longest hackathon on land
                  </a>
                  , and ran{" "}
                  <a href="https://www.youtube.com/watch?v=QvCoISXfcE8">
                    Canada's largest high school hackathon
                  </a>
                  .
                </p>

                <p className="mt-4 font-medium opacity-80">
                  At Hack Club, students aren't just learning — they're
                  shipping.
                </p>
              </div>
              <nav className="flex flex-col gap-2 text-lg sm:hidden">
                <a href="https://hackclub.com" className="hover:underline">
                  Hack Club
                </a>
                <a
                  href="https://hackclub.com/slack"
                  className="hover:underline"
                >
                  Slack
                </a>
                <a
                  href="https://hackclub.com/clubs"
                  className="hover:underline"
                >
                  Clubs
                </a>
                <a
                  href="https://hackclub.com/conduct"
                  className="hover:underline"
                >
                  Code of Conduct
                </a>

                <p className="text-sm opacity-60 font-bold sm:hidden">
                  © 2026 Hack Club. 501(c)(3) nonprofit (EIN: 81-2908499)
                </p>
              </nav>
            </div>
          </footer>
        </main>
        <img
          src="/woods.png"
          className="sm:block absolute hidden bottom-0 left-0 w-[110vw]
               mask-image:linear-gradient(to_top,black_40%,transparent_80%)
               [-webkit-mask-image:linear-gradient(to_top,black_40%,transparent_80%)]"
        />
        <img
          src="/woodsSm.png"
          className="sm:hidden absolute bottom-0 left-0 w-[110vw]
               mask-image:linear-gradient(to_top,black_40%,transparent_80%)
               [-webkit-mask-image:linear-gradient(to_top,black_40%,transparent_80%)]"
        />
      </div>
    </div>
  );
}*/
