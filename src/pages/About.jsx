import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <div className="flex justify-center items-center py-12 md:py-16 border-b border-earth/8">
        <img src="/gaia-logo.png" alt="GAiA" className="h-24 md:h-32 w-auto" />
      </div>

      {/* Content */}
      <section className="section-padding">
        <div className="container-gaia max-w-2xl">

          <h1 className="text-display-md font-serif text-earth mb-10 leading-snug">
            אודות גאיה
          </h1>

          <div className="space-y-6 text-bark leading-[1.9] text-base">
            <p>
              גאיה נולדה מתוך שילוב של יזמות, אהבה לכלבים ותשוקה אמיתית לתזונה טבעית. מאחורי גאיה עומדים יזם ותזונאי כלבים מוסמך, עם מטרה פשוטה: להפוך תזונה טבעית והוליסטית לכלבים לנגישה, פרקטית ומבוססת מדע.
            </p>
            <p>
              לאחר שנים של מחקר, למידה והאכלה טבעית של הכלבים שלנו, הבנו שבישראל התחום עדיין נמצא בתחילת דרכו. יש הרבה מידע ברשת, אבל לא תמיד קל לדעת מה מבוסס מחקר, מה באמת עובד בפועל, ואיך ליישם את זה בצורה בטוחה ומאוזנת.
            </p>
            <p>
              לכן הקמנו את גאיה – מקום שבו בעלי כלבים יכולים ללמוד, לחשב, לחקור ולקבל כלים מעשיים לקבלת החלטות טובות יותר עבור הכלב שלהם. כאן תמצאו מחשבונים חינמיים, מדריכים, מאמרים ומידע עדכני המבוסס על מחקר, ניסיון מעשי וחשיבה ביקורתית.
            </p>

            <div className="my-8 border-r-2 border-forest/30 pr-5 text-mist text-sm leading-[1.85] italic">
              זו רק ההתחלה. בעתיד אנחנו מתכננים להרחיב את גאיה עם כלים נוספים, אפליקציות, תוספים ומוצרים מומלצים שיסייעו להפוך תזונה טבעית לברורה ופשוטה יותר. אז הישארו לעקוב!
            </div>

            <p className="text-earth/80">
              אם גם אתם מאמינים שכלבים ראויים לתזונה טובה יותר, אנחנו שמחים שאתם כאן. 🐾
            </p>

            <p className="font-semibold text-earth text-lg">
              ברוכים הבאים לקהילת גאיה.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-earth/10">
            <p className="text-earth font-semibold text-base mb-3">
              רוצה לדעת איפה התפריט של הכלב שלך עומד?
            </p>
            <Link
              to="/aafco-balance-check"
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-dark transition-colors duration-200 group"
            >
              התחל עם הבדיקה החינמית
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
