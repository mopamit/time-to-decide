import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import benGurionImg from "@/assets/ben-gurion.jpg";
import councilImg from "@/assets/council-meeting.jpg";

export const Route = createFileRoute("/")({
  component: Room4,
});

type Side = "pro" | "con" | "pool";

interface Argument {
  id: string;
  text: string;
  correct: "pro" | "con";
}

const ARGUMENTS: Argument[] = [
  { id: "a1", text: 'האו״ם הכיר במדינה יהודית — צריך לממש את ההחלטה לפני שהיא תתבטל', correct: "pro" },
  { id: "a2", text: 'הצבאות הערביים מתכוננים למלחמה — נכנס למלחמה בלי הכנה', correct: "con" },
  { id: "a3", text: 'ארה״ב מזהירה שנכנס למלחמה שנפסיד', correct: "con" },
  { id: "a4", text: 'היישוב מוכן — רוב האזרחים תומכים', correct: "pro" },
  { id: "a5", text: 'אם נמתין — נפסיד את הלגיטימציה הבינלאומית', correct: "pro" },
  { id: "a6", text: 'עדיף להמתין, לנסות משא ומתן עם השכנים הערבים', correct: "con" },
  { id: "a7", text: 'העם היהודי עבר שואה — אין זמן לחכות עוד, צריך מקלט עכשיו', correct: "pro" },
  { id: "a8", text: 'חסר לנו נשק, שריון, מטוסים — איך נלחם?', correct: "con" },
];

const TILTS = ["note-tilt-1", "note-tilt-2", "note-tilt-3", "note-tilt-4"];

type Stage = "sort" | "decide" | "reveal";

function Room4() {
  const [placement, setPlacement] = useState<Record<string, Side>>(
    () => Object.fromEntries(ARGUMENTS.map((a) => [a.id, "pool"])) as Record<string, Side>,
  );
  const [stage, setStage] = useState<Stage>("sort");
  const [choice, setChoice] = useState<"declare" | "wait" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shakeBox, setShakeBox] = useState<Side | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());

  const inSide = (side: Side) => ARGUMENTS.filter((a) => placement[a.id] === side);
  const allSorted = inSide("pool").length === 0;
  const allCorrect =
    allSorted && ARGUMENTS.every((a) => placement[a.id] === a.correct);

  const handleBoxClick = (side: "pro" | "con") => {
    if (!selectedId) return;
    setPlacement((p) => ({ ...p, [selectedId]: side }));
    setSelectedId(null);
    setFeedback(null);
    // Clear wrong marker for this item if previously checked
    if (wrongIds.has(selectedId)) {
      setWrongIds((s) => {
        const n = new Set(s);
        n.delete(selectedId);
        return n;
      });
    }
  };

  const handleCheck = () => {
    if (!allSorted) {
      setFeedback("יש למיין את כל הפתקיות לפני הבדיקה");
      return;
    }
    const wrong = new Set(
      ARGUMENTS.filter((a) => placement[a.id] !== a.correct).map((a) => a.id),
    );
    setWrongIds(wrong);
    setChecked(true);
    if (wrong.size === 0) {
      setFeedback("כל הפתקיות מוינו נכון! ✓");
    } else {
      setFeedback(`יש ${wrong.size} פתקיות במקום הלא נכון — החזר אותן ומיין מחדש`);
      // Return wrong items to the pool for re-sorting
      setPlacement((p) => {
        const next = { ...p };
        wrong.forEach((id) => (next[id] = "pool"));
        return next;
      });
      setShakeBox("pro");
      setTimeout(() => setShakeBox(null), 450);
    }
  };

  const reset = () => {
    setPlacement(Object.fromEntries(ARGUMENTS.map((a) => [a.id, "pool"])) as Record<string, Side>);
    setSelectedId(null);
    setFeedback(null);
    setChecked(false);
    setWrongIds(new Set());
  };

  if (stage === "reveal")
    return (
      <Reveal
        choice={choice!}
        onRestart={() => { setStage("sort"); setChoice(null); reset(); }}
        onBackToDecide={() => { setChoice(null); setStage("decide"); }}
      />
    );
  if (stage === "decide") return <Decide onChoose={(c) => { setChoice(c); setStage("reveal"); }} />;

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <Header />

        <section className="mb-8 paper-texture rounded-2xl p-6 md:p-8 shadow-[var(--shadow-deep)] animate-float-in">
          <div className="flex items-start gap-4">
            <div className="hidden md:flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--gradient-gold)] text-ink font-display font-black text-2xl shadow-[var(--shadow-glow)]">א</div>
            <div className="text-ink">
              <h2 className="font-display text-2xl md:text-3xl font-black mb-2">שלב א׳: מיין את הפתקיות</h2>
              <p className="text-base md:text-lg leading-relaxed opacity-85">
                <strong>איך משחקים:</strong> הקלק על פתקית כדי לבחור אותה, ואז הקלק על הקופסה המתאימה — בעד או נגד.
                רק כאשר <strong>כל הפתקיות ימוינו נכון</strong> תוכל להמשיך לשלב ההחלטה.
              </p>
            </div>
          </div>
        </section>

        {/* Two wooden boxes */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-10">
          <WoodBox
            title="בעד הכרזה מיידית"
            subtitle="מחר, 14 במאי 1948"
            variant="pro"
            items={inSide("pro")}
            shake={shakeBox === "pro"}
            armed={!!selectedId}
            onClick={() => handleBoxClick("pro")}
          />
          <WoodBox
            title="נגד הכרזה"
            subtitle="להמתין, לדחות"
            variant="con"
            items={inSide("con")}
            shake={shakeBox === "con"}
            armed={!!selectedId}
            onClick={() => handleBoxClick("con")}
          />
        </div>

        {/* Sticky notes pool */}
        <section className="paper-texture rounded-2xl p-5 md:p-7 mb-8 shadow-[var(--shadow-deep)]">
          <h3 className="font-display text-xl font-bold text-ink mb-5 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-gold pulse-gold" />
            פתקיות הטיעונים ({inSide("pool").length})
          </h3>
          {inSide("pool").length === 0 ? (
            <p className="text-ink/60 text-center py-6 font-display text-lg">כל הפתקיות מוינו ✓</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 py-3">
              {inSide("pool").map((a, i) => (
                <StickyNote
                  key={a.id}
                  arg={a}
                  tilt={TILTS[i % TILTS.length]}
                  selected={selectedId === a.id}
                  onSelect={() => {
                    setSelectedId(selectedId === a.id ? null : a.id);
                    setFeedback(null);
                  }}
                />
              ))}
            </div>
          )}
          {feedback && (
            <p className="mt-4 text-center text-[color:var(--con)] font-display font-bold animate-float-in">
              {feedback}
            </p>
          )}
        </section>

        <div className="flex flex-col items-center gap-3">
          {!allSorted && (
            <p className="text-muted-foreground text-sm">
              מיין את כל הפתקיות לקופסאות (גם אם אינך בטוח), ואז לחץ על "בדיקה"
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              disabled={!allSorted}
              onClick={handleCheck}
              className="px-6 py-3 rounded-xl font-display font-bold text-lg bg-card text-card-foreground border-2 border-gold/50 hover:border-gold transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ✓ בדיקה
            </button>
            <button
              disabled={!allCorrect}
              onClick={() => setStage("decide")}
              className="px-8 py-4 rounded-xl font-display font-black text-xl text-ink shadow-[var(--shadow-glow)] transition-all disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:scale-105"
              style={{ background: "var(--gradient-gold)" }}
            >
              המשך לשלב ב׳ — ההחלטה ←
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="text-center mb-8 md:mb-12 animate-float-in">
      <h1 className="font-display text-4xl md:text-6xl font-black text-shadow-deep mb-3">
        ההכרעה ההיסטורית
      </h1>
      <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
        מאי 1948 · מועצת העם · האם להכריז על הקמת המדינה?
      </p>
      <div className="mt-6 h-px max-w-md mx-auto bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
    </header>
  );
}

function WoodBox(props: {
  title: string;
  subtitle: string;
  variant: "pro" | "con";
  items: Argument[];
  shake: boolean;
  armed: boolean;
  onClick: () => void;
}) {
  const isPro = props.variant === "pro";
  const accent = isPro ? "var(--pro)" : "var(--con)";
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`wood-box ${props.armed ? "is-target" : ""} ${props.shake ? "animate-shake" : ""} rounded-2xl p-5 md:p-6 min-h-[300px] text-right transition`}
      style={{ cursor: props.armed ? "pointer" : "default" }}
    >
      <div className="flex flex-col items-center text-center mb-4 text-parchment">
        <div
          className="inline-block px-3 py-1 rounded font-display font-black text-sm tracking-widest mb-2"
          style={{ background: accent, color: "var(--parchment)" }}
        >
          {isPro ? "בעד" : "נגד"}
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-black leading-tight text-center">{props.title}</h3>
        <p className="text-sm opacity-75 font-body text-center">{props.subtitle}</p>
      </div>

      <div className="space-y-2">
        {props.items.length === 0 ? (
          <div className="border-2 border-dashed border-parchment/25 rounded-xl p-8 text-center text-parchment/60 text-sm">
            {props.armed ? "הקלק כאן כדי למקם" : "המתן לבחירת פתקית"}
          </div>
        ) : (
          props.items.map((a) => (
            <div
              key={a.id}
              className="bg-parchment text-ink rounded-md p-3 text-sm md:text-base leading-snug shadow-md border-r-4"
              style={{ borderRightColor: accent }}
            >
              <div className="flex items-start gap-2">
                <span className="flex-1">{a.text}</span>
                <span className="text-lg shrink-0 text-[color:var(--pro)]">✓</span>
              </div>
            </div>
          ))
        )}
      </div>
    </button>
  );
}

function StickyNote({ arg, tilt, selected, onSelect }: {
  arg: Argument;
  tilt: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`sticky-note relative ${tilt} rounded-sm p-4 pt-5 text-ink text-sm md:text-[15px] leading-snug min-h-[140px] text-right hover:-translate-y-1 hover:rotate-0 transition-all duration-200 ${
        selected ? "ring-4 ring-gold scale-105 -translate-y-1 z-10" : ""
      }`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      <span className="block">{arg.text}</span>
    </button>
  );
}

function Decide({ onChoose }: { onChoose: (c: "declare" | "wait") => void }) {
  return (
    <main className="min-h-screen px-4 py-12 flex items-center justify-center">
      <div className="max-w-4xl w-full animate-float-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 text-gold text-sm font-bold tracking-widest mb-4">
            שלב ב׳ · ההחלטה
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black text-shadow-deep mb-4">
            מה אתה ממליץ למועצת העם?
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            לאחר הניתוח — הגיעה שעת ההכרעה. ההיסטוריה ממתינה לתשובתך.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <button
            onClick={() => onChoose("declare")}
            className="group relative rounded-2xl p-8 text-right text-pro-foreground shadow-[var(--shadow-deep)] hover:scale-[1.02] transition-all overflow-hidden"
            style={{ background: "var(--gradient-pro)" }}
          >
            <div className="text-7xl font-display font-black opacity-20 absolute top-2 left-4">1</div>
            <div className="relative">
              <div className="text-sm opacity-80 mb-2 tracking-widest">אופציה ראשונה</div>
              <h2 className="font-display text-2xl md:text-3xl font-black mb-3 leading-tight">
                להכריז על הקמת המדינה
              </h2>
              <p className="text-base opacity-90 leading-relaxed">
                מחר, 14 במאי 1948 — לממש את ההזדמנות ההיסטורית
              </p>
            </div>
          </button>

          <button
            onClick={() => onChoose("wait")}
            className="group relative rounded-2xl p-8 text-right text-con-foreground shadow-[var(--shadow-deep)] hover:scale-[1.02] transition-all overflow-hidden"
            style={{ background: "var(--gradient-con)" }}
          >
            <div className="text-7xl font-display font-black opacity-20 absolute top-2 left-4">2</div>
            <div className="relative">
              <div className="text-sm opacity-80 mb-2 tracking-widest">אופציה שנייה</div>
              <h2 className="font-display text-2xl md:text-3xl font-black mb-3 leading-tight">
                להמתין — לדחות את ההכרזה
              </h2>
              <p className="text-base opacity-90 leading-relaxed">
                לנסות משא ומתן עם השכנים הערבים, להתחזק
              </p>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}

function Reveal({ choice, onRestart, onBackToDecide }: { choice: "declare" | "wait"; onRestart: () => void; onBackToDecide: () => void }) {
  const declared = choice === "declare";
  return (
    <main className="min-h-screen px-4 py-10 md:py-16">
      <div className="max-w-4xl mx-auto animate-float-in">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-5xl font-black text-shadow-deep mb-3">
            {declared ? "בחרת כמו רוב חברי מועצת העם" : "הבנת את הסכנות — אך המציאות הייתה שונה"}
          </h1>
        </div>

        <article className="paper-texture rounded-2xl shadow-[var(--shadow-deep)] overflow-hidden text-ink">
          <div className="relative">
            <img
              src={councilImg}
              alt="ישיבת מועצת העם, 12 במאי 1948"
              width={1536}
              height={1024}
              loading="lazy"
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 right-4 text-parchment">
              <div className="font-display text-2xl md:text-3xl font-black text-shadow-deep">
                {declared ? "מועצת העם" : "דוד בן-גוריון"}
              </div>
              <div className="text-sm opacity-90">ישיבת מועצת העם · 12 במאי 1948</div>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-5 text-base md:text-lg leading-relaxed">
            {declared ? (
              <>
                <p>בישיבה ההיסטורית של מועצת העם ב-12 במאי 1948 התקיים <strong>ויכוח סוער</strong>.</p>
                <blockquote className="border-r-4 border-gold pr-5 my-6 italic font-display text-lg md:text-xl text-ink/90 bg-gold/5 py-4 rounded">
                  „יודע אני את הסכנות. אך גם יודע אני: זו השעה. אם נחמיץ את הרגע — לא יחזור.
                  ההכרה הבינלאומית, הלגיטימציה, הקונצנזוס העולמי אחרי השואה — הכל כאן עכשיו.
                  מי יודע מה יקרה בעוד שנה או שנתיים? אמנם תהיה מלחמה קשה — אך אם נאחד כוחות, נחיה."
                  <footer className="mt-3 text-sm not-italic font-body font-bold opacity-70">— דוד בן-גוריון</footer>
                </blockquote>
              </>
            ) : (
              <>
                <p>במועצת העם היו גם כאלה שחשבו כמוך.</p>
                <blockquote className="border-r-4 border-[color:var(--con)] pr-5 my-6 italic font-display text-lg md:text-xl text-ink/90 bg-[color:var(--con)]/5 py-4 rounded">
                  „האם נכון להכניס את העם למלחמה קיומית כשאיננו מוכנים?
                  אולי עדיף להמתין, לחזק את כוחותינו, לנסות הידברות."
                  <footer className="mt-3 text-sm not-italic font-body font-bold opacity-70">— מאיר יערי</footer>
                </blockquote>
                <p>אך דוד בן-גוריון השיב:</p>
                <blockquote className="border-r-4 border-gold pr-5 my-6 italic font-display text-lg md:text-xl text-ink/90 bg-gold/5 py-4 rounded">
                  „להמתין — זה להחמיץ את ההזדמנות ההיסטורית. ההכרה הבינלאומית, הלגיטימציה
                  שקיבלנו מהאו״ם — אולי לא תחזור. אם נסגור עכשיו — מתי נפתח שוב?"
                  <footer className="mt-3 text-sm not-italic font-body font-bold opacity-70">— דוד בן-גוריון</footer>
                </blockquote>
              </>
            )}

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-ink/30 to-transparent" />

            <div className="bg-ink text-parchment rounded-xl p-6 md:p-8 text-center">
              <div className="text-gold text-sm font-bold tracking-widest mb-2">הוחלט</div>
              <p className="font-display text-xl md:text-2xl font-bold leading-relaxed mb-3">
                להכריז על הקמת המדינה ב-14 במאי 1948
              </p>
              <p className="text-sm md:text-base opacity-80 leading-relaxed">
                למחרת, בשעה 16:00, הוקראה הכרזת העצמאות במוזיאון תל אביב.
                <br />
                ובלילה — החלה <strong className="text-gold">מלחמת העצמאות</strong>.
              </p>
            </div>
          </div>
        </article>

        <div className="text-center mt-8 flex flex-wrap justify-center gap-3">
          {!declared && (
            <button
              onClick={onBackToDecide}
              className="px-6 py-3 rounded-xl font-display font-black text-ink shadow-[var(--shadow-glow)] hover:scale-105 transition"
              style={{ background: "var(--gradient-gold)" }}
            >
              ← חזור לבחירה
            </button>
          )}
          <button
            onClick={onRestart}
            className="px-6 py-3 rounded-xl bg-card text-card-foreground font-display font-bold border-2 border-gold/40 hover:border-gold transition"
          >
            ↻ התחל מחדש
          </button>
        </div>
      </div>
    </main>
  );
}
