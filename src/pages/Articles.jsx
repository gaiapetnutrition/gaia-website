import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Clock, ArrowLeft, Search, Tag, Quote } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'

const ARTICLES = [
  {
    id: 2,
    title:    'מלא ומאוזן - למה זה הכרחי, ולמה זה לא מספיק?',
    excerpt:  'מה באמת עומד מאחורי ההגדרה "מזון מלא ומאוזן"? למה גם בתזונה טבעית היא כל כך חשובה - ולמה מבחינתנו היא רק נקודת ההתחלה.',
    category: 'יסודות',
    read:     '6 דקות',
    date:     'פברואר 2026',
    body: [
      { type: 'p', text: 'אם אתם מאכילים את הכלב שלכם בתזונה טבעית, כנראה שנתקלתם בשלב מסוים במושג "מזון מלא ומאוזן".' },
      { type: 'p', text: 'ואולי גם בשאלות כמו: איך אני יודע אם חסר משהו בתזונה של הכלב שלי? האם באמת צריך לחשב כל כך הרבה דברים? הרי כלבים אכלו במשך אלפי שנים בלי שמישהו בדק להם כמה אבץ, יוד או ויטמין D יש בקערה… אבל בכל זאת, איך יודעים שהם מקבלים הכל?' },
      { type: 'p', text: 'אז בואו נעשה קצת סדר.' },

      { type: 'h2', text: 'קודם כל - מה זה בכלל "מלא ומאוזן"?' },
      { type: 'p', text: 'בפשטות, מזון מלא ומאוזן הוא מזון שמספק את כלל הנוטריינטים החיוניים שהכלב צריך, בכמויות וביחסים המתאימים לשלב החיים שלו.' },
      { type: 'p', text: 'הגוף המרכזי שטבע את המונח הוא AAFCO בארה״ב. באירופה קיים גוף מקביל בשם FEDIAF, וההמלצות שלהם מבוססות על גוף ידע מדעי רחב, ובין היתר על עבודתו של ה-NRC - המועצה למחקר בתחום הדרישות התזונתיות של כלבים וחתולים.' },
      { type: 'p', text: 'אבל חשוב להבין מה התקנים האלה אומרים - ומה הם לא אומרים.' },
      { type: 'p', text: 'בהגדרה - הם נועדו קודם כל לוודא שהתזונה מספקת רמות מספקות של נוטריינטים חיוניים (שהכלבים חייבים לקבל מהמזון ולא יכולים לייצר בעצם) באופן שמונע תסמינים של מחלה, ובחלק מהנוטריינטים גם מגדירים גבולות עליונים כדי למנוע צריכת יתר שעלולה להזיק.' },
      { type: 'p', text: 'כלומר, קל להתבלבל ולחשוב שמלא ומאוזן הוא מזון אידיאלי או מושלם, אבל לא - "מלא ומאוזן" הוא רק נקודת ההתחלה - לא נקודת הסיום ולא מטרה אידיאלית.' },

      { type: 'quote', text: 'אבל בטבע אף אחד לא חישב לכלב כמות סידן...' },
      { type: 'p', text: 'נכון. אבל הכלב שחי איתנו היום גם לא אוכל טרף שלם שהוא צד בעצמו, ולמעשה, לא צד בכלל ותלוי במה שמקבל.' },
      { type: 'p', text: 'במהלך הביות כלבים עברו שינויים גנטיים ופיזיולוגיים, בין היתר כאלה שהשפיעו על יכולתם לעכל מזונות עמילניים. ובמקביל, גם צורת ההזנה השתנתה לחלוטין.' },
      { type: 'p', text: 'כשאנחנו מאכילים תזונה טבעית בבית, אנחנו בוחרים את המרכיבים, והם לרוב כאלה שנוחים לנו: קצת בשר שריר, קצת איברים, אולי לפעמים קצת עצמות או מקור סידן, ירקות, דגים, ביצים וכן הלאה.' },
      { type: 'p', text: 'וזה בדיוק העניין: ברגע שאנחנו בונים את ה"טרף" בעצמנו, האחריות לוודא שלא שכחנו חלקים חשובים עוברת אלינו.' },
      { type: 'p', text: 'קערה יכולה להיראות מדהים - בשר איכותי, ירקות צבעוניים, ביצה ודג - ועדיין להיות חסרה במגוון נוטריאנטים כמו יוד, אבץ, נחושת, ויטמין D, ויטמין E או אחרים.' },

      { type: 'quote', text: 'אבל התקן של AAFCO זה בכלל תקן למזון יבש...' },
      { type: 'p', text: 'זו טעות נפוצה.' },
      { type: 'p', text: 'העיקרון של מזון מלא ומאוזן אינו אומר "מזון יבש". הדרישות התזונתיות מתייחסות לנוטריינטים שהכלב מקבל, ולא לשאלה אם הם הגיעו מכופתית, שימורים או מזון טרי.' },
      { type: 'p', text: 'גם באירופה, הנחיות FEDIAF מתייחסות למזונות מלאים בצורות שונות, כולל מזונות יבשים, רטובים ו-Raw.' },
      { type: 'p', text: 'כלומר, גם במזון טבעי אפשר לבחור חומרי גלם טריים ואיכותיים - ובמקביל לוודא שהם מספקים את הצרכים התזונתיים של הכלב. זאת למעשה הפרקטיקה שמיושמת בארה״ב ואירופה.' },

      { type: 'h2', text: 'ומה לגבי נוטריינטים סינתטיים?' },
      { type: 'p', text: 'טענה נוספת שעולה לפעמים היא שחלק מהמחקרים שעליהם מבוסס הידע התזונתי השתמשו בצורות מבודדות או סינתטיות של ויטמינים ומינרלים, ולכן אי אפשר להשליך מהם ישירות על מזון טבעי.' },
      { type: 'p', text: 'כן, יש בטענה הזו נקודה חשובה: מקור הנוטריינט, הזמינות הביולוגית שלו והאינטראקציות שלו עם שאר המזון בהחלט משפיעים על הספיגה.' },
      { type: 'p', text: 'אבל מכאן לא נובע שאפשר להתעלם מהתוצאות שנצפו - שמתחת לרף מסוים נצפו תסמיני מחלה אצל הכלבים.' },
      { type: 'p', text: 'למעשה, נוטריאנט טהור ומבודד יכול לעיתים להיות זמין מאוד לספיגה, בעוד שדווקא בתוך מזון שלם יכולים להיות רכיבים שמגבירים או דווקא מפחיתים את זמינותו.' },
      { type: 'p', text: 'לכן, אם אנחנו מאמינים שתזונה טבעית מספקת נוטריינטים בצורה זמינה ואיכותית, אין סיבה שהיא לא תוכל לעמוד לפחות ברמות התזונתיות המקובלות כרשת ביטחון. ועד שלא יהיה לנו מחקר ברור של רמות נוטריאנטים מינימליות ומקסימליות, אין מניעה שנקבע לעצמנו מטרה לעמוד בתנאים שהתווה גוף המחקר היחיד שקיים היום, במיוחד אם זה אומר לא לנחש או ללכת לפי אינטואיציה.' },

      { type: 'h2', text: '"חוסר האונים" של הכלבים שלנו' },
      { type: 'p', text: 'הכלבים שלנו לא בוחרים מה לאכול. הם לא יכולים לפתוח את המקרר, להרגיש שחסר להם משהו ולבחור היום מזון אחר. הם אוכלים את מה שאנחנו שמים להם בקערה, יום אחרי יום, במשך שנים - ובהרבה בתים מדובר בתפריט שחוזר על עצמו כמעט ללא שינוי.' },
      { type: 'p', text: 'זה מטיל עלינו אחריות גדולה.' },
      { type: 'p', text: 'נכון שתיאורטית, תזונה לא חייבת לספק כל נוטריאנט בדיוק בכל ארוחה, כל עוד לאורך זמן התפריט כולו מאוזן. אבל בפועל, לרוב בעלי הכלבים אין את הידע, הניסיון או הכלים לנהל איזון כזה לאורך ימים ושבועות: לדעת שהיום היה פחות מנוטריינט מסוים, שבעוד שלושה ימים צריך להשלים אותו, מאיזה מזון, באיזו כמות, ואיך השינוי הזה משפיע על שאר התפריט.' },
      { type: 'p', text: 'בסוף צריך להכיר גם בצד הפרקטי של החיים שלנו. אנחנו רוצים להשקיע בכלבים שלנו, לתת להם חומרי גלם טובים, גיוון ותזונה איכותית - אבל זה ריאלי לומר שאנחנו גם זקוקים לשיטה שאפשר להתמיד בה. בסוף כבעלים, אנחנו מחפשים גם נוחות.' },
      { type: 'p', text: 'ופה נמצא אחד היתרונות הגדולים של תפריט מלא ומאוזן: הוא מוריד את הצורך "לסגור חשבונות תזונתיים" בראש לאורך השבוע או החודש. אנחנו יודעים שפעם או פעמיים ביום אנחנו מניחים בקערה ארוחה שנבנתה מראש כדי לספק את הצרכים התזונתיים של הכלב.' },
      { type: 'p', text: 'זה לא אומר שכל ארוחה חייבת להיות זהה - להפך, אפשר ורצוי לייצר גיוון בתוך מסגרת נכונה. אבל הבסיס נשאר יציב: אנחנו לא משאירים את האיזון התזונתי ליד המקרה, טרנדים או אינטואיציה, במיוחד כשמי שאוכל את מה שבחרנו תלוי בנו לחלוטין.' },

      { type: 'h2', text: 'וזה עדיין לא כל הסיפור' },
      { type: 'p', text: 'תזונה טובה היא הרבה יותר מרשימת מינימום של ויטמינים ומינרלים.' },
      { type: 'p', text: 'אנחנו רוצים להסתכל גם על היחסים בין נוטריינטים: היחס בין סידן לזרחן, האיזון בין חומצות השומן אומגה 6 ואומגה 3, והאינטראקציות בין מינרלים כמו אבץ ונחושת.' },
      { type: 'p', text: 'אנחנו רוצים להסתכל גם על הכלב עצמו: גיל, משקל, רמת פעילות, מצב גופני, רגישויות, מצב רפואי והמטרות שלנו עבורו.' },
      { type: 'p', text: 'וזו בדיוק ההבחנה שאנחנו אוהבים לעשות:' },
      {
        type: 'compare',
        items: [
          { label: 'מלא ומאוזן שואל:', text: 'האם סיפקנו את הבסיס התזונתי?' },
          { label: 'תזונה אופטימלית שואלת:', text: 'איך אפשר לבנות על הבסיס הזה תזונה שמתאימה לכלב הספציפי שנמצא מולנו?' },
        ],
      },
      { type: 'p', text: 'לכן אנחנו לא רואים בתקני AAFCO או FEDIAF אויב של התזונה הטבעית - להפך.' },
      { type: 'p', text: 'הם נותנים לנו רשת ביטחון מדעית ומבוססת מחקר.' },
      { type: 'p', text: 'ומשם אפשר להתחיל לעבוד עם חומרי גלם איכותיים, גיוון, התאמה אישית וחשיבה הוליסטית כדי לבנות תפריט שלא רק "עומד בתקן", אלא באמת מתאים לכלב שלנו.' },

      { type: 'note', text: 'כשבונים תזונה ביתית לאורך זמן, במיוחד לגורים, לכלבות בהריון או לכלבים עם מצבים רפואיים, כדאי שהתפריט ינוסח או לפחות ייבדק על ידי וטרינר/ית או איש/אשת מקצוע בעלי הכשרה מתאימה בתזונת כלבים.' },

      { type: 'p', text: 'כי טבעי ומדעי לא צריכים להיות שני צדדים מנוגדים.' },
      { type: 'p', text: 'מבחינתנו, התזונה הטובה ביותר מתחילה בדיוק בחיבור ביניהם.' },
    ],
  },
]

export default function Articles() {
  const { id } = useParams()

  if (id) {
    return <ArticleDetail article={ARTICLES.find(a => String(a.id) === id)} />
  }

  return <ArticlesList />
}

function ArticlesList() {
  const [query, setQuery] = useState('')

  const filtered = ARTICLES.filter(a => (
    !query || a.title.includes(query) || a.excerpt.includes(query)
  ))

  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <div className="bg-parchment border-b border-stone">
        <div className="container-gaia py-14 md:py-20 flex items-center justify-start gap-2">
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
            className="hidden md:block w-[26rem] lg:w-[40rem] h-auto object-contain flex-shrink-0 select-none mt-8 -mr-10"
          />
        </div>
      </div>

      <div className="container-gaia py-10 md:py-14">

        {/* Articles */}
        {filtered.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-mist uppercase tracking-wider mb-4">כל המאמרים</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filtered.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-mist">
            <p className="text-lg mb-2">לא נמצאו מאמרים</p>
            <button onClick={() => setQuery('')} className="text-sm text-forest hover:underline">
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

function ArticleCard({ article }) {
  return (
    <Card hover padding={false}>
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
        <h3 className="font-semibold text-earth mb-2 leading-snug text-base">
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

/* ─── Article body renderer ──────────────────────────────────────────────── */
function ArticleBody({ blocks = [] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={i}
                className="text-display-sm font-serif text-earth mt-12 mb-4 first:mt-0"
              >
                {block.text}
              </h2>
            )

          case 'quote':
            return (
              <div key={i} className="my-8 flex items-start gap-3 border-s-4 border-olive ps-5 py-1">
                <Quote className="w-6 h-6 text-olive shrink-0 mt-1 scale-x-[-1]" />
                <p className="text-lg md:text-xl font-serif font-bold italic text-bark leading-snug">
                  {block.text}
                </p>
              </div>
            )

          case 'compare':
            return (
              <div key={i} className="my-8 grid sm:grid-cols-2 gap-4">
                {block.items.map((item, j) => (
                  <div key={j} className="bg-parchment border border-stone rounded-2xl p-5">
                    <p className="text-sm font-semibold text-forest mb-1.5">{item.label}</p>
                    <p className="text-sm text-earth leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            )

          case 'note':
            return (
              <div key={i} className="my-8 flex items-start gap-3 bg-parchment border border-stone rounded-2xl p-5">
                <img src="/gaia-paw.png" alt="" className="w-5 h-5 opacity-80 shrink-0 mt-0.5" />
                <p className="text-sm text-bark leading-relaxed">{block.text}</p>
              </div>
            )

          case 'p':
          default:
            return (
              <p key={i} className="text-base md:text-lg text-earth/90 leading-relaxed mb-5">
                {block.text}
              </p>
            )
        }
      })}
    </div>
  )
}

/* ─── Single article page — content to be filled in later ───────────────────── */
function ArticleDetail({ article }) {
  if (!article) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center py-20 text-mist">
          <p className="text-lg mb-2">המאמר לא נמצא</p>
          <Link to="/articles" className="text-sm text-forest hover:underline">חזרה למאמרים</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-parchment border-b border-stone">
        <div className="container-gaia py-14 md:py-20 max-w-3xl">
          <Link
            to="/articles"
            className="inline-flex items-center gap-1 text-sm font-semibold text-forest hover:text-olive-dark transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            חזרה למאמרים
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="cream" className="text-xs">
              <Tag className="w-2.5 h-2.5" />
              {article.category}
            </Badge>
            <span className="text-xs text-mist flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.read}
            </span>
            <span className="text-xs text-mist/60">{article.date}</span>
          </div>
          <h1 className="text-display-lg font-serif text-earth">
            {article.title}
            <img src="/gaia-paw.png" alt="" className="inline-block w-[0.9em] h-[0.9em] align-middle opacity-80 ms-2" />
          </h1>
        </div>
      </div>

      <div className="container-gaia py-10 md:py-14 max-w-3xl">
        <img src="/gaia-paw.png" alt="" aria-hidden="true" className="w-7 h-7 mx-auto mb-8 opacity-25" />

        <ArticleBody blocks={article.body} />

        <img src="/gaia-paw.png" alt="" aria-hidden="true" className="w-7 h-7 mx-auto mt-10 opacity-25" />

        <div className="mt-8 pt-8 border-t border-stone flex items-center justify-between">
          <Link
            to="/articles"
            className="inline-flex items-center gap-1 text-sm font-semibold text-forest hover:text-olive-dark transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            חזרה למאמרים
          </Link>
        </div>
      </div>
    </div>
  )
}
