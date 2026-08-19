import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'

const CALCULATORS = [
  {
    path: '/calculator',
    icon: '/feed_icon2.webp',
    iconSize: 34,
    title: 'מחשבון האכלה',
    desc: 'כמה להאכיל את הכלב שלכם ביום, לפי משקל, שלב חיים, פעילות ומצב גוף.',
    accent: 'bg-forest/[0.08]',
  },
  {
    path: '/aafco-balance-check',
    icon: '/scales_icon5.png',
    iconSize: 34,
    title: 'בדיקת מלא ומאוזן',
    desc: 'הזינו מתכון וקבלו השוואה מלאה לתקני AAFCO, כולל מינימום ומקסימום לכל רכיב.',
    accent: 'bg-olive/[0.1]',
  },
  {
    path: '/natural-calorie-calculator',
    icon: '/calorie_icon.png',
    iconSize: 28,
    title: 'מחשבון קלוריות',
    desc: 'בנו מתכון מהמרכיבים שלכם וראו בדיוק כמה קלוריות הכלב מקבל בכל ארוחה.',
    accent: 'bg-sage/[0.12]',
  },
  {
    path: '/chocolate-calculator',
    icon: '/choco_icon2.png',
    iconSize: 30,
    title: 'מחשבון רעילות שוקולד',
    desc: 'הכלב אכל שוקולד? הערכת רמת הסיכון לפי משקל הכלב, סוג השוקולד והכמות.',
    accent: 'bg-clay/[0.1]',
  },
]

export default function Calculators() {
  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <div className="bg-parchment border-b border-stone overflow-hidden">
        <div className="container-gaia pt-14 md:pt-20 pb-6 md:pb-8 text-center relative">
          <img
            src="/calculator_gaia.png"
            alt=""
            aria-hidden="true"
            className="hidden lg:block absolute bottom-0 -left-24 w-[30rem] h-auto object-contain pointer-events-none select-none"
          />
          <Badge variant="green" className="mb-4 mx-auto">
            <img src="/gaia-paw.png" alt="" className="w-3 h-3 opacity-80" />
            כלים חינמיים
          </Badge>
          <h1 className="text-display-lg font-serif text-earth mb-3">המחשבונים שלנו</h1>
          <p className="text-mist text-base leading-relaxed max-w-xl mx-auto">
            ארבעה כלים פשוטים שיעזרו לכם לקבל החלטות תזונתיות מבוססות - בלי ניחושים.
          </p>
          <img src="/gaia-paw.png" alt="" aria-hidden="true" className="w-9 h-9 mx-auto mt-5 opacity-60" />
        </div>
      </div>

      {/* Grid */}
      <div className="container-gaia py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
          {CALCULATORS.map(calc => (
            <Link key={calc.path} to={calc.path} className="block group">
              <Card hover padding={false} className="cursor-pointer h-full">
                <div className="p-8 md:p-10 flex flex-col items-center text-center h-full">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${calc.accent} group-hover:[animation:floatY_2s_ease-in-out_infinite]`}>
                    <img src={calc.icon} alt="" className="object-contain" style={{ width: calc.iconSize, height: calc.iconSize }} />
                  </div>
                  <h2 className="text-xl font-semibold text-earth mb-2.5">{calc.title}</h2>
                  <p className="text-sm text-mist leading-relaxed mb-6">{calc.desc}</p>
                  <span className="mt-auto text-sm font-semibold text-forest group-hover:text-olive-dark flex items-center gap-1.5 transition-colors">
                    לכלי
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
