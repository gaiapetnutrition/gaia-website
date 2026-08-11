import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ArrowLeft, Search, Tag } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'

const CATEGORIES = ['הכל', 'יסודות', 'מזון נא', 'תזונה מיוחדת', 'גורים', 'מבוגרים']

const ARTICLES = [
  {
    id: 1,
    title:    'עקרונות יסוד בתזונה טבעית לכלבים',
    excerpt:  'מבוא לגישה התזונתית שמשלבת מדע עם מזון מלא וטבעי. מה חשוב לדעת לפני שמתחילים.',
    category: 'יסודות',
    read:     '5 דקות',
    date:     'ינואר 2026',
    featured: true,
  },
  {
    id: 2,
    title:    'איזון תזונתי: מה באמת חשוב?',
    excerpt:  'הבנת הצרכים התזונתיים הבסיסיים של הכלב - חלבון, שומן, פחמימות, ויטמינים ומינרלים.',
    category: 'יסודות',
    read:     '7 דקות',
    date:     'פברואר 2026',
    featured: true,
  },
  {
    id: 3,
    title:    'מעבר להאכלה ביתית - מדריך מעשי',
    excerpt:  'צעדים ראשונים למעבר בטוח ומחושב מקיבל מסחרי לתזונה ביתית, בלי טעויות נפוצות.',
    category: 'יסודות',
    read:     '10 דקות',
    date:     'פברואר 2026',
    featured: false,
  },
  {
    id: 4,
    title:    'BARF: מה זה, למה ואיך',
    excerpt:  'כל מה שצריך לדעת על האכלה בשר נא ועצמות - יתרונות, סיכונים ואיך לעשות את זה נכון.',
    category: 'מזון נא',
    read:     '8 דקות',
    date:     'מרץ 2026',
    featured: false,
  },
  {
    id: 5,
    title:    'תזונה לגורים: שלב הגדילה',
    excerpt:  'גורים צריכים יותר מבוגרים. הבינו מה שונה בצרכים התזונתיים של כלבים צעירים.',
    category: 'גורים',
    read:     '6 דקות',
    date:     'מרץ 2026',
    featured: false,
  },
  {
    id: 6,
    title:    'כלבים מבוגרים: איך משנים את התפריט?',
    excerpt:  'מגיל 7 ומעלה, צרכי הכלב משתנים. מה להוסיף, מה להפחית, ועל מה לשים דגש.',
    category: 'מבוגרים',
    read:     '7 דקות',
    date:     'אפריל 2026',
    featured: false,
  },
]

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState('הכל')
  const [query, setQuery] = useState('')

  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === 'הכל' || a.category === activeCategory
    const matchQ   = !query || a.title.includes(query) || a.excerpt.includes(query)
    return matchCat && matchQ
  })

  const featured  = filtered.filter(a => a.featured)
  const rest      = filtered.filter(a => !a.featured)

  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <div className="bg-parchment border-b border-stone">
        <div className="container-gaia py-14 md:py-20 flex items-center justify-between gap-8">
          <div className="max-w-lg">
            <Badge variant="green" className="mb-4">
              <img src="/gaia-paw.png" alt="" className="w-3 h-3 opacity-80" />
              מרכז הידע
            </Badge>
            <h1 className="text-display-lg font-serif text-earth mb-3">מאמרים ומדריכים</h1>
            <p className="text-mist text-base leading-relaxed">
              תוכן מקצועי, מבוסס מחקר, ומעשי - כי להבין את התזונה של הכלב שלכם
              זה הצעד הראשון לשיפורה.
            </p>

            {/* Search */}
            <div className="relative max-w-sm mt-8">
              <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="חיפוש מאמרים..."
                className="input-base pe-10"
              />
            </div>
          </div>

          <img
            src="/scholar_dog.png"
            alt=""
            aria-hidden="true"
            className="hidden md:block w-56 lg:w-72 h-auto object-contain flex-shrink-0 select-none"
          />
        </div>
      </div>

      <div className="container-gaia py-10 md:py-14">

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pill text-sm transition-all duration-150 ${
                activeCategory === cat
                  ? 'bg-forest text-white border-transparent'
                  : 'bg-white text-bark border border-stone hover:border-sage'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured articles */}
        {featured.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-mist uppercase tracking-wider mb-4">קריאה מומלצת</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featured.map(article => (
                <ArticleCard key={article.id} article={article} large />
              ))}
            </div>
          </div>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-mist uppercase tracking-wider mb-4">כל המאמרים</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {rest.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-mist">
            <p className="text-lg mb-2">לא נמצאו מאמרים</p>
            <button onClick={() => { setQuery(''); setActiveCategory('הכל') }} className="text-sm text-forest hover:underline">
              הצג הכל
            </button>
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-16 bg-green-gradient rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-xl font-serif text-white mb-2">רוצים לקבל מאמרים חדשים?</h2>
          <p className="text-white/60 text-sm mb-6">הצטרפו לרשימת הדיוור ותקבלו ידע תזונתי ישירות למייל.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="input-base flex-1 text-right"
              dir="ltr"
            />
            <button className="px-6 py-3 bg-white text-forest font-semibold text-sm rounded-xl hover:bg-cream transition-colors flex-shrink-0">
              הרשמה
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArticleCard({ article, large = false }) {
  return (
    <Card hover className={large ? 'flex flex-col' : ''} padding={false}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="cream" className="text-xs">
            <Tag className="w-2.5 h-2.5" />
            {article.category}
          </Badge>
          <span className="text-xs text-mist flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.read}
          </span>
        </div>
        <h3 className={`font-semibold text-earth mb-2 leading-snug ${large ? 'text-lg' : 'text-base'}`}>
          {article.title}
        </h3>
        <p className="text-sm text-mist leading-relaxed mb-4">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-mist/60">{article.date}</span>
          <Link
            to={`/articles/${article.id}`}
            className="text-sm font-semibold text-forest hover:text-olive-dark flex items-center gap-1 transition-colors"
          >
            קראו עוד
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  )
}
