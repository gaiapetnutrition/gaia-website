import { useState } from 'react'
import { CheckCircle2, Clock, MessageCircle, FileText, Heart, ArrowLeft, Star, Phone, Mail } from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'

/* ─── Consultation tiers ─────────────────────────────────── */
const PLANS = [
  {
    id:       'intro',
    name:     'ייעוץ ראשוני',
    price:    '₪290',
    duration: '45 דקות',
    badge:    null,
    desc:     'פגישה ראשונה להיכרות ולהבנת צרכי הכלב שלכם.',
    features: [
      'שיחת וידאו / טלפון 45 דקות',
      'הערכת התזונה הנוכחית',
      'המלצות ראשוניות',
      'סיכום בכתב',
    ],
    cta:     'קביעת פגישה',
    variant: 'outline',
  },
  {
    id:       'full',
    name:     'תוכנית תזונה מלאה',
    price:    '₪590',
    duration: '60 דקות + תוכנית',
    badge:    'הכי פופולרי',
    desc:     'ייעוץ מעמיק + תוכנית מזון מפורטת ומותאמת אישית לחודש.',
    features: [
      'שיחת וידאו 60 דקות',
      'ניתוח תזונתי מלא',
      'תוכנית אכילה שבועית',
      'רשימת מרכיבים + כמויות',
      'המלצות תוספים',
      'מעקב בוואטסאפ שבועיים',
    ],
    cta:     'להתחיל עכשיו',
    variant: 'primary',
  },
  {
    id:       'ongoing',
    name:     'ליווי שוטף',
    price:    '₪390',
    duration: 'לחודש',
    badge:    null,
    desc:     'ליווי חודשי לבעלי כלבים שרוצים מעקב ותמיכה מתמשכת.',
    features: [
      'פגישה חודשית 30 דקות',
      'זמינות בוואטסאפ',
      'עדכוני תוכנית לפי הצורך',
      'מענה לשאלות שוטפות',
    ],
    cta:     'לפרטים',
    variant: 'outline',
  },
]

/* ─── Booking form ───────────────────────────────────────── */
function BookingForm({ plan, onBack }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', dogName: '', dogAge: '', dogBreed: '', message: ''
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  function handleSubmit(e) {
    e.preventDefault()
    // In production: send to backend / Calendly / etc.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-forest" />
        </div>
        <h3 className="text-2xl font-semibold text-earth mb-2">הבקשה התקבלה!</h3>
        <p className="text-mist mb-6 max-w-sm mx-auto">
          תודה, {form.name || 'חבר'}! ניצור איתכם קשר תוך 24 שעות לתיאום המועד המתאים.
        </p>
        <button onClick={onBack} className="text-sm text-forest font-semibold hover:underline">
          חזרה לבחירת תוכנית
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-mist hover:text-forest mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" />
        חזרה לתוכניות
      </button>

      <div className="mb-6 p-4 bg-forest/[5%] border border-forest/[20%] rounded-2xl">
        <p className="text-sm font-semibold text-forest">{plan.name} — {plan.price}</p>
        <p className="text-xs text-mist mt-0.5">{plan.duration}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-bark block mb-1.5">שם מלא *</label>
            <input required className="input-base" value={form.name} onChange={e => set('name', e.target.value)} placeholder="ישראל ישראלי" />
          </div>
          <div>
            <label className="text-sm font-medium text-bark block mb-1.5">טלפון *</label>
            <input required type="tel" className="input-base" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="050-0000000" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-bark block mb-1.5">אימייל *</label>
          <input required type="email" className="input-base" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-bark block mb-1.5">שם הכלב</label>
            <input className="input-base" value={form.dogName} onChange={e => set('dogName', e.target.value)} placeholder="מקס" />
          </div>
          <div>
            <label className="text-sm font-medium text-bark block mb-1.5">גיל הכלב</label>
            <input className="input-base" value={form.dogAge} onChange={e => set('dogAge', e.target.value)} placeholder="3 שנים" />
          </div>
          <div>
            <label className="text-sm font-medium text-bark block mb-1.5">גזע</label>
            <input className="input-base" value={form.dogBreed} onChange={e => set('dogBreed', e.target.value)} placeholder="לברדור" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-bark block mb-1.5">מה חשוב לכם לדון? (אופציונלי)</label>
          <textarea
            rows={3}
            className="input-base resize-none"
            value={form.message}
            onChange={e => set('message', e.target.value)}
            placeholder="ספרו לנו על הכלב שלכם, על בעיות תזונתיות קיימות, או על שאלות שרוצים לברר..."
          />
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
          שליחת בקשה לתיאום
        </Button>
        <p className="text-xs text-center text-mist">ניצור קשר תוך 24 שעות לתיאום המועד</p>
      </form>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
export default function Consultations() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-parchment border-b border-stone">
        <div className="container-gaia py-14 md:py-20">
          <Badge variant="green" dot className="mb-4">ייעוץ אישי</Badge>
          <h1 className="text-display-lg font-serif text-earth mb-3">
            ייעוץ תזונתי מקצועי
          </h1>
          <p className="text-mist max-w-xl text-base leading-relaxed">
            כל כלב שונה. הייעוץ שלנו מותאם באופן אישי — על בסיס נתוני הכלב שלכם,
            מצבו הבריאותי ואורח חייו.
          </p>
        </div>
      </div>

      <div className="container-gaia py-12 md:py-16">

        {selected ? (
          <div className="max-w-lg mx-auto bg-white rounded-4xl border border-stone shadow-card p-8 md:p-10">
            <BookingForm plan={selected} onBack={() => setSelected(null)} />
          </div>
        ) : (
          <>
            {/* What you get */}
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2 className="text-display-sm font-serif text-earth mb-4">מה כוללת ההתייעצות?</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { icon: <FileText className="w-5 h-5" />, label: 'ניתוח תזונתי מלא' },
                  { icon: <Heart className="w-5 h-5" />,    label: 'התאמה לצרכים בריאותיים' },
                  { icon: <MessageCircle className="w-5 h-5" />, label: 'מענה לכל השאלות' },
                  { icon: <Clock className="w-5 h-5" />,    label: 'מעקב לאחר הייעוץ' },
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-stone">
                    <span className="text-forest">{item.icon}</span>
                    <span className="text-xs text-center font-medium text-bark">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
              {PLANS.map(plan => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-3xl border-2 p-6 flex flex-col transition-all duration-200
                    ${plan.badge ? 'border-forest shadow-cta' : 'border-stone hover:border-sage'}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 right-6">
                      <Badge variant="green">{plan.badge}</Badge>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-earth mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-3xl font-bold text-forest">{plan.price}</span>
                      <span className="text-xs text-mist">{plan.duration !== plan.price && `/ ${plan.duration}`}</span>
                    </div>
                    <p className="text-sm text-mist leading-relaxed mb-5">{plan.desc}</p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm text-bark">
                          <CheckCircle2 className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    variant={plan.variant}
                    size="md"
                    className="w-full"
                    onClick={() => setSelected(plan)}
                  >
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>

            {/* Testimonial strip */}
            <div className="max-w-3xl mx-auto bg-parchment rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex gap-0.5 flex-shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-olive text-olive" />
                ))}
              </div>
              <div>
                <p className="text-bark text-sm leading-relaxed mb-2">
                  "הייעוץ שינה לגמרי את הגישה שלי לאכילה של ברונו. קיבלתי תשובות מדויקות לשאלות שרופאי הוטרינר לא תמיד יש להם זמן לענות עליהן."
                </p>
                <p className="text-xs text-mist">שירה מ. — בעלת בוקסר</p>
              </div>
            </div>

            {/* Contact alternative */}
            <div className="text-center mt-10">
              <p className="text-sm text-mist mb-3">מעדיפים לדבר קודם?</p>
              <div className="flex justify-center gap-4">
                <a href="tel:+972-50-0000000" className="flex items-center gap-1.5 text-sm font-medium text-forest hover:text-olive-dark transition-colors">
                  <Phone className="w-4 h-4" />
                  התקשרו אלינו
                </a>
                <a href="mailto:hello@gaia-nutrition.com" className="flex items-center gap-1.5 text-sm font-medium text-forest hover:text-olive-dark transition-colors">
                  <Mail className="w-4 h-4" />
                  שלחו אימייל
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
