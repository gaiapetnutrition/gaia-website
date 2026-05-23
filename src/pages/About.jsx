import { Link } from 'react-router-dom'
import { FlaskConical, Leaf, Shield, BookOpen, ArrowLeft, Award, Microscope } from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'

const VALUES = [
  {
    icon: <Microscope className="w-6 h-6" />,
    title: 'מדע ראשית',
    desc:  'כל המלצה שלנו נסמכת על מחקר עדכני, תקני AAFCO ו-NRC, ועל הבנה עמוקה של פיזיולוגיית הכלב. אנחנו לא עוקבים אחרי טרנדים — אנחנו עוקבים אחרי הנתונים.',
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: 'טבעי ומלא',
    desc:  'האמונה שלנו: ככל שהמזון שלם יותר, כך הגוף מצליח לנצל אותו טוב יותר. אנחנו מחפשים את הפשטות הנכונה — לא "natural" כמותג, אלא טבעי כפילוסופיה.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'שקיפות מלאה',
    desc:  'אנחנו מסבירים כל המלצה, חולקים מקורות, ומכבדים את זכותכם להבין את ההחלטות. ייעוץ טוב מחנך — לא יוצר תלות.',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'למידה מתמשכת',
    desc:  'עולם התזונה הוטרינרית מתפתח. אנחנו מתעדכנים כל הזמן עם המחקר החדש ביותר כדי לתת לכם את הידע הטוב ביותר.',
  },
]

const SCIENCE = [
  {
    abbr: 'AAFCO',
    name: 'Association of American Feed Control Officials',
    desc: 'הגוף המגדיר את תקני הרכב המזון לחיות המחמד. אנחנו עובדים לפי הגדרות ה-Nutrient Profiles שלהם.',
  },
  {
    abbr: 'NRC',
    name: 'National Research Council',
    desc: 'מדריך "Nutrient Requirements of Dogs and Cats" (2006) — הכתיבה המדעית המקיפה ביותר על צרכי הכלב.',
  },
  {
    abbr: 'RER / MER',
    name: 'נוסחאות אנרגיה וטרינריות',
    desc: 'שימוש ב-Resting & Maintenance Energy Requirement לחישוב מדויק של הצרכים הקלוריים היומיים.',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <div className="bg-green-gradient text-white">
        <div className="container-gaia py-16 md:py-24">
          <Badge variant="olive" dot className="mb-4">הסיפור שלנו</Badge>
          <h1 className="text-display-lg font-serif text-white mb-4 max-w-xl">
            כשמדע פוגש טבע —
            <span className="text-olive-light italic"> זה GAiA</span>
          </h1>
          <p className="text-white/60 max-w-lg text-base leading-relaxed">
            נולדנו מהאמונה שהפער בין "תזונה טבעית" לבין "תזונה מדעית"
            הוא בדיה. הטבע והמדע מדברים אותה שפה — אנחנו רק מתרגמים.
          </p>
        </div>
      </div>

      {/* Origin story */}
      <section className="section-padding">
        <div className="container-gaia">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Text */}
            <div>
              <span className="eyebrow">למה GAiA קיימת</span>
              <h2 className="text-display-sm font-serif text-earth mb-5">
                בעלי כלבים מבולבלים. <br />
                <span className="gradient-text">זה הבעיה שלנו לפתור.</span>
              </h2>
              <div className="space-y-4 text-mist leading-relaxed text-sm">
                <p>
                  בעלי כלבים רבים מוצאים את עצמם מוצפים במידע סותר: פאלאו לכלבים,
                  וגאן לכלבים, BARF לעומת קיבל, "ביתי טוב מהכל" — ובצד השני,
                  ספקות לגבי כל מה שמגיע מהתעשייה.
                </p>
                <p>
                  GAiA נבנתה כדי להיות הקול הרגוע, הרציונלי — שמסביר מה המדע
                  באמת אומר, עוזר לבנות תוכנית שמתאימה לכלב הספציפי שלכם,
                  ולא מוכר לכם פחד.
                </p>
                <p>
                  אנחנו מאמינים שמזון מלא, בלתי מעובד ומגוון הוא הבסיס הנכון —
                  אבל שהאיזון חשוב לא פחות, ושהמדע הוא כלי עבודה,
                  לא פולחן.
                </p>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-radial from-olive/15 to-transparent rounded-3xl" />
              <div className="relative bg-parchment rounded-3xl p-8 space-y-5">
                {[
                  { label: 'הגישה שלנו', value: 'מדע + טבע' },
                  { label: 'תקנים',      value: 'AAFCO, NRC 2006' },
                  { label: 'כלבים שעזרנו', value: '+200' },
                  { label: 'שנות ניסיון', value: '7+' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-3 border-b border-stone last:border-0">
                    <span className="text-sm text-mist">{item.label}</span>
                    <span className="text-base font-bold text-earth">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-parchment">
        <div className="container-gaia">
          <div className="text-center mb-12">
            <span className="eyebrow">הערכים שמנחים אותנו</span>
            <h2 className="text-display-sm font-serif text-earth">הפילוסופיה של GAiA</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {VALUES.map(v => (
              <Card key={v.title} className="flex gap-5" padding={false}>
                <div className="p-6 md:p-8 flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-forest/[8%] text-forest flex items-center justify-center flex-shrink-0">
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-earth mb-2">{v.title}</h3>
                    <p className="text-sm text-mist leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Science sources */}
      <section className="section-padding">
        <div className="container-gaia max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow">הבסיס המדעי</span>
            <h2 className="text-display-sm font-serif text-earth">עובדים לפי התקנים הגבוהים ביותר</h2>
          </div>
          <div className="space-y-4">
            {SCIENCE.map(s => (
              <div key={s.abbr} className="flex gap-5 p-6 bg-white rounded-2xl border border-stone">
                <div className="w-16 h-16 rounded-xl bg-forest text-white flex items-center justify-center font-bold text-xs text-center leading-tight flex-shrink-0 p-2">
                  {s.abbr}
                </div>
                <div>
                  <h4 className="font-semibold text-earth text-sm mb-1">{s.name}</h4>
                  <p className="text-xs text-mist leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-parchment">
        <div className="container-gaia text-center">
          <h2 className="text-display-sm font-serif text-earth mb-4">מוכנים להתחיל?</h2>
          <p className="text-mist mb-8 max-w-sm mx-auto">נשמח להכיר את הכלב שלכם ולבנות יחד תוכנית תזונה שתשנה את חייו.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button as={Link} to="/consultations" variant="primary" size="lg" onClick={() => {}}>
              קביעת ייעוץ
            </Button>
            <Button as={Link} to="/calculator" variant="outline" size="lg" onClick={() => {}}>
              מחשבון חינמי
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
