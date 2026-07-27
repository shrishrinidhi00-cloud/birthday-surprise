import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { birthdayConfig } from "@/lib/birthday-config";

type Stage = "opening" | "cards" | "countdown" | "hero" | "timeline" | "gift" | "letter" | "ending";

const STAGES: Stage[] = ["opening", "cards", "countdown", "hero", "timeline", "gift", "letter", "ending"];

// ---------- Floating decorations ----------
const DECO_EMOJIS = ["🎀", "💗", "✨", "⭐", "🌸", "🩷", "💫"];
function Decor({ count = 32 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        e: DECO_EMOJIS[i % DECO_EMOJIS.length],
        left: Math.random() * 95,
        size: 16 + Math.random() * 20,
        rot: (Math.random() - 0.5) * 360,
        dur: 4.5 + Math.random() * 3.5, // medium speed (4.5s - 8s)
        delay: -(Math.random() * 8), // staggered negative delays for non-uniform queueing
        opacity: 0.6 + Math.random() * 0.35,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {items.map((it, i) => (
        <span
          key={i}
          className="deco-fall"
          style={
            {
              left: `${it.left}%`,
              fontSize: `${it.size}px`,
              ["--r" as string]: `${it.rot}deg`,
              ["--d" as string]: `${it.dur}s`,
              ["--delay" as string]: `${it.delay}s`,
              ["--op" as string]: it.opacity,
            } as React.CSSProperties
          }
        >
          {it.e}
        </span>
      ))}
    </div>
  );
}

// ---------- Safe image (hides on error) ----------
function SafeImg({
  src,
  alt,
  className,
  fallback,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) return <>{fallback ?? null}</>;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ objectFit: "contain", ...style }}
      onError={() => setOk(false)}
      loading="eager"
    />
  );
}

// ---------- Readonly text ----------
function Editable({
  value,
  className,
  multiline,
}: {
  value: string;
  onChange?: (v: string) => void;
  className?: string;
  multiline?: boolean;
}) {
  return (
    <div
      className={className}
      style={multiline ? { whiteSpace: "pre-wrap" } : undefined}
    >
      {value}
    </div>
  );
}

// ---------- Confetti helpers ----------
const pinkColors = ["#F4A7B9", "#FFD6E0", "#FFE8EE", "#FFE6A7", "#D9899A"];
function burstConfetti() {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: pinkColors });
  setTimeout(
    () => confetti({ particleCount: 80, spread: 100, origin: { y: 0.4 }, colors: pinkColors }),
    250,
  );
}

// ---------- Music ----------
function MusicToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={playing ? "Pause music" : "Play music"}
      title={playing ? "Pause background music" : "Play background music"}
      className="fixed top-4 right-4 z-50 h-11 w-11 rounded-full soft-card grid place-items-center transition-transform hover:scale-105 active:scale-95 shadow-md border border-pink-200/50"
      style={{ background: "#FFFDFD" }}
    >
      <span className="text-lg">{playing ? "🎵" : "🔇"}</span>
    </button>
  );
}

// ============ OPENING ============
function Opening({ onStart }: { onStart: () => void }) {
  const c = birthdayConfig.opening;
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 py-10 pink-gradient-soft">
      <Decor count={18} />
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full soft-in">
        <SafeImg
          src="/images/opening-character.gif"
          alt="Animated cute character"
          className="w-44 sm:w-56 h-auto max-h-[260px] object-contain drop-shadow-md"
          fallback={<div className="text-7xl">🐱</div>}
        />

        <h1
          className="font-cute text-4xl sm:text-5xl font-bold mt-6 text-rose-dark tracking-wide"
          style={{ textShadow: "0 2px 10px rgba(244, 167, 185, 0.45)" }}
        >
          {c.greeting}
        </h1>

        <p className="font-hand text-2xl sm:text-3xl mt-3 text-rose-dusty">{c.line1}</p>
        <p className="font-hand text-2xl sm:text-3xl mt-1 text-rose-dusty">{c.line2}</p>

        <SafeImg
          src="/images/opening-character2.gif"
          alt="Cute character decoration"
          className="w-28 h-28 sm:w-36 sm:h-36 mt-3 mb-2 object-contain pointer-events-none drop-shadow-sm"
          fallback={<div className="text-3xl sm:text-4xl mt-4 mb-1">🐾</div>}
        />

        <button className="btn-pink mt-4 text-lg sm:text-xl shadow-lg" onClick={onStart}>
          {c.button}
        </button>
      </div>
    </section>
  );
}

// ============ CARDS ============
function Cards({ onNext }: { onNext: () => void }) {
  const [messages, setMessages] = useState(birthdayConfig.cards.items.map((c) => c.message));
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);
  const [everOpened, setEverOpened] = useState<boolean[]>([false, false, false]);
  const allOpened = everOpened.every(Boolean);

  const toggleFlip = (i: number) => {
    setFlipped((f) => f.map((val, idx) => (idx === i ? !val : val)));
    setEverOpened((e) => e.map((val, idx) => (idx === i ? true : val)));
  };

  return (
    <section className="relative min-h-[100dvh] px-5 py-14 pink-gradient-soft">
      <Decor count={14} />
      <div className="relative z-10 max-w-md mx-auto">
        <h2 className="font-cute text-2xl sm:text-3xl text-center text-rose-dark">
          {birthdayConfig.cards.title}
        </h2>

        <div className="mt-8 grid gap-6">
          {birthdayConfig.cards.items.map((card, i) => (
            <div
              key={card.id}
              className="flip-card w-full cursor-pointer select-none"
              style={{ height: 220 }}
              onClick={() => toggleFlip(i)}
            >
              <div className={`flip-inner ${flipped[i] ? "flipped" : ""}`}>
                <div className="flip-face soft-card relative flex items-center justify-center pink-gradient">
                  <SafeImg
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full"
                    fallback={<div className="text-6xl">🎀</div>}
                  />
                  {!flipped[i] && (
                    <div className="relative z-10 text-center pointer-events-none">
                      {card.title && card.title.trim().length > 0 && (
                        <div
                          className="inline-block px-4 py-2 rounded-full font-cute text-rose-dark shadow-sm"
                          style={{ background: "rgba(255,253,253,0.85)" }}
                        >
                          {card.title}
                        </div>
                      )}
                      <div className="mt-2 text-xs font-hand text-rose-dark opacity-85 bg-white/75 px-3 py-1 rounded-full inline-block shadow-sm">
                        tap to open ♡
                      </div>
                    </div>
                  )}
                </div>
                <div className="flip-face flip-back soft-card p-5 flex flex-col items-center justify-center relative">
                  <Editable
                    value={messages[i]}
                    onChange={(v) => setMessages((m) => m.map((x, j) => (j === i ? v : x)))}
                    className="font-hand text-xl text-rose-dark text-center"
                    multiline
                  />
                  <div className="absolute bottom-2 text-[10px] font-hand text-rose-dark opacity-60 pointer-events-none">
                    tap to flip back ♡
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          {allOpened && (
            <div className="soft-in">
              <p className="font-cute text-lg text-rose-dusty">
                {birthdayConfig.cards.unlockText}
              </p>
              <button className="btn-pink mt-4 text-lg shadow-lg" onClick={onNext}>
                Continue ✨
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============ COUNTDOWN ============
function Countdown({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    const seq = [3, 2, 1];
    let i = 0;
    const start = setTimeout(function tick() {
      setN(seq[i]);
      i++;
      if (i < seq.length) {
        setTimeout(tick, 1000);
      } else {
        setTimeout(() => {
          setN(null);
          burstConfetti();
          setTimeout(onDone, 900);
        }, 1000);
      }
    }, 1200);
    return () => clearTimeout(start);
  }, [onDone]);

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 pink-gradient-soft">
      <Decor count={10} />
      <div className="relative z-10 text-center max-w-md w-full">
        <p
          className="text-3xl sm:text-4xl font-bold text-rose-dark tracking-wide"
          style={{
            fontFamily: "'Lucida Handwriting', 'Lucida Calligraphy', 'Apple Chancery', cursive, sans-serif",
            textShadow: "0 2px 10px rgba(244, 167, 185, 0.4)",
          }}
        >
          {birthdayConfig.countdown.intro}
        </p>
        <p
          className="font-cute text-3xl sm:text-4xl font-semibold text-rose-dusty mt-4 tracking-wide"
          style={{
            fontFamily: "'Fredoka', 'Baloo 2', sans-serif",
            textShadow: "0 2px 8px rgba(244, 167, 185, 0.3)",
          }}
        >
          {birthdayConfig.countdown.ready}
        </p>
        <div className="mt-10 h-40 flex items-center justify-center">
          {n !== null && (
            <span
              key={n}
              className="pop-num font-cute text-[8rem] leading-none"
              style={{ color: "#D9899A" }}
            >
              {n}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

// ============ HERO ============
function Hero({ onNext }: { onNext: () => void }) {
  const [funny] = useState(birthdayConfig.hero.funnyLine);
  const [wish] = useState(birthdayConfig.hero.wish);
  useEffect(() => {
    burstConfetti();
  }, []);
  return (
    <section className="relative min-h-[100dvh] px-5 py-14 pink-gradient-soft">
      <Decor count={16} />
      <div className="relative z-10 max-w-md mx-auto text-center soft-in">
        <h1
          className="font-cute text-4xl sm:text-6xl font-extrabold leading-tight tracking-wide"
          style={{
            fontFamily: "'Fredoka', 'Baloo 2', sans-serif",
            color: "#c96b82",
            textShadow: "0 4px 15px rgba(244, 167, 185, 0.5)",
          }}
        >
          {birthdayConfig.hero.title}
        </h1>
        <SafeImg
          src="/gifs/cat-celebrate.gif"
          alt=""
          className="w-28 h-28 mx-auto mt-4"
          fallback={<div className="text-6xl mt-4">🎉</div>}
        />
        <Editable
          value={funny}
          className="font-hand text-2xl text-rose-dusty mt-4"
          multiline
        />
        <div className="soft-card p-5 mt-6 text-left">
          <Editable
            value={wish}
            className="font-hand text-xl text-rose-dark"
            multiline
          />
        </div>
        <button className="btn-pink mt-8 text-lg shadow-lg" onClick={onNext}>
          Look at You! 📸
        </button>
      </div>
    </section>
  );
}

// ============ TIMELINE ============
function Timeline({ onNext }: { onNext: () => void }) {
  const [items, setItems] = useState(birthdayConfig.timeline.items);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const nodes = rootRef.current?.querySelectorAll(".reveal") ?? [];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.15 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return (
    <section className="relative min-h-[100dvh] px-5 py-14 pink-gradient-soft" ref={rootRef}>
      <Decor count={10} />
      <div className="relative z-10 max-w-md mx-auto">
        <h2 className="font-cute text-2xl sm:text-3xl text-center text-rose-dark">
          {birthdayConfig.timeline.title} 🎀
        </h2>
        <div className="mt-10 flex flex-col gap-10">
          {items.map((it, i) => (
            <div
              key={i}
              className={`reveal polaroid relative mx-auto w-full max-w-[280px] ${i % 2 ? "-rotate-2" : "rotate-2"
                }`}
            >
              <span className="tape left-1/2 -translate-x-1/2" />
              <div
                className="w-full overflow-hidden rounded-sm bg-pink-100"
                style={{ aspectRatio: "1 / 1" }}
              >
                <SafeImg
                  src={it.img}
                  alt={it.caption}
                  className="w-full h-full"
                  fallback={
                    <div className="w-full h-full grid place-items-center text-5xl pink-gradient">
                      💗
                    </div>
                  }
                />
              </div>
              <Editable
                value={it.caption}
                onChange={(v) =>
                  setItems((arr) => arr.map((x, j) => (j === i ? { ...x, caption: v } : x)))
                }
                className="font-hand text-xl text-rose-dark text-center mt-3"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button className="btn-pink text-lg shadow-lg" onClick={onNext}>
            A little gift 🎁
          </button>
        </div>
      </div>
    </section>
  );
}

// ============ GIFT ============
function Gift({ onNext }: { onNext: () => void }) {
  const [state, setState] = useState<"idle" | "shaking" | "open">("idle");
  const [content] = useState(birthdayConfig.gift.content);
  const handleTap = () => {
    if (state !== "idle") return;
    setState("shaking");
    setTimeout(() => {
      setState("open");
      burstConfetti();
    }, 1800);
  };
  return (
    <section className="relative min-h-[100dvh] px-5 py-14 pink-gradient-soft flex flex-col items-center justify-center">
      <Decor count={12} />
      <div className="relative z-10 text-center max-w-md w-full">
        {state !== "open" ? (
          <>
            <button
              onClick={handleTap}
              className={`gift-box mx-auto ${state === "shaking" ? "shake" : ""}`}
              aria-label="Open gift"
            >
              <span className="gift-bow">🎀</span>
              <span className="gift-ribbon-v" />
              <span className="gift-ribbon-h" />
              <span className="gift-body" />
              <span className="gift-lid" />
            </button>
            <p className="font-cute text-xl text-rose-dark mt-6">{birthdayConfig.gift.prompt}</p>
          </>
        ) : (
          <div className="soft-in">
            <div className="text-5xl">✨🎁✨</div>
            <div className="soft-card p-6 mt-6">
              <Editable
                value={content}
                className="font-hand text-xl text-rose-dark"
                multiline
              />
            </div>
            <button className="btn-pink mt-8 text-lg shadow-lg" onClick={onNext}>
              A letter for you ♡
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ============ LETTER ============
function Letter({ onNext }: { onNext: () => void }) {
  const [open, setOpen] = useState(false);
  const body = birthdayConfig.letter.body;
  return (
    <section className="relative min-h-[100dvh] px-5 py-14 pink-gradient-soft flex flex-col items-center justify-center">
      <Decor count={10} />
      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Envelope — only clickable before opening */}
        <div
          className={`envelope ${open ? "open" : ""}`}
          onClick={() => !open && setOpen(true)}
          role="button"
          style={{ cursor: open ? "default" : "pointer" }}
        >
          <div className="envelope-flap" />
          {!open && (
            <div className="absolute inset-0 grid place-items-center z-[5] pointer-events-none">
              <span className="font-cute text-xl text-white drop-shadow font-bold">
                {birthdayConfig.letter.prompt}
              </span>
            </div>
          )}
        </div>

        {/* Letter sheet rendered OUTSIDE the envelope so it doesn't get clipped */}
        {open && (
          <div className="soft-in w-full mt-4">
            <div className="soft-card p-5 w-full shadow-xl">
              <div className="font-hand text-xl sm:text-2xl text-rose-dark leading-relaxed whitespace-pre-wrap">
                {body}
              </div>
            </div>
            <div className="mt-8 text-center">
              <button className="btn-pink text-lg shadow-lg" onClick={onNext}>
                There is still more ♡
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============ ENDING ============
function Ending({ onReplay }: { onReplay: () => void }) {
  const [msg] = useState(birthdayConfig.ending.message);
  return (
    <section className="relative min-h-[100dvh] px-5 py-14 pink-gradient-soft flex flex-col items-center justify-center">
      <Decor count={18} />
      <div className="relative z-10 text-center max-w-md soft-in">
        <h2
          className="font-cute text-3xl sm:text-5xl font-bold leading-snug tracking-wide text-center"
          style={{
            fontFamily: "'Fredoka', 'Baloo 2', sans-serif",
            color: "#704a52",
            textShadow: "0 2px 12px rgba(244, 167, 185, 0.45)",
          }}
        >
          {birthdayConfig.ending.title}
        </h2>
        <SafeImg
          src="/gifs/cat-heart.gif"
          alt=""
          className="w-28 h-28 mx-auto mt-6"
          fallback={<div className="text-6xl mt-6">🐱💗</div>}
        />
        <div className="soft-card p-5 mt-6">
          <Editable
            value={msg}
            className="font-hand text-xl text-rose-dark"
            multiline
          />
        </div>
        <button className="btn-pink mt-8 text-lg shadow-lg" onClick={onReplay}>
          {birthdayConfig.ending.replay} ↻
        </button>
      </div>
    </section>
  );
}

// ============ MAIN ============
export default function BirthdayApp() {
  const [stage, setStage] = useState<Stage>("opening");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const goto = (s: Stage) => {
    setStage(s);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const next = () => {
    const i = STAGES.indexOf(stage);
    if (i < STAGES.length - 1) goto(STAGES[i + 1]);
  };

  const startExperience = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.6;
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => setMusicPlaying(false));
    }
    next();
  };

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play()
        .then(() => setMusicPlaying(true))
        .catch(() => { });
    } else {
      a.pause();
      setMusicPlaying(false);
    }
  };

  const replay = () => {
    goto("opening");
  };

  return (
    <div className="bg-cream min-h-[100dvh] w-full overflow-x-hidden">
      <audio ref={audioRef} src="/music/bg-music.mp3" loop preload="auto" />
      <MusicToggle playing={musicPlaying} onToggle={toggleMusic} />

      {stage === "opening" && <Opening onStart={startExperience} />}
      {stage === "cards" && <Cards onNext={next} />}
      {stage === "countdown" && <Countdown onDone={next} />}
      {stage === "hero" && <Hero onNext={next} />}
      {stage === "timeline" && <Timeline onNext={next} />}
      {stage === "gift" && <Gift onNext={next} />}
      {stage === "letter" && <Letter onNext={next} />}
      {stage === "ending" && <Ending onReplay={replay} />}
    </div>
  );
}
