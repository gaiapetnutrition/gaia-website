---
name: article
description: Add a new article to the GAiA website (src/pages/Articles.jsx). Use whenever the user says they're adding/pasting a new article, article copy, or a thumbnail for the articles section.
---

# Adding an article

This skill captures how articles get added to `src/pages/Articles.jsx` on this
site — both the copywriting/UX judgment calls and the mechanical steps.

## Golden rule: never touch the user's words

The user is the copywriter. Do not reword, trim, "improve," merge, or reorder
their sentences — not even lightly. Your only editorial job is **structural**:
deciding which block type each chunk of text becomes. If you're ever unsure
whether an edit counts as wording vs. structure, treat it as wording and leave
it alone.

The one exception: if the user pastes only a title + short subtitle and says
something like "just add this to the thumbnail," add it as a card with no
`body` yet — don't invent body copy to fill it in.

## Step 1 — the thumbnail (always)

Add an entry to the `ARTICLES` array in `src/pages/Articles.jsx`:

```js
{
  id:       <next unused integer>,
  title:    '<exact title as sent>',
  excerpt:  '<exact excerpt/subtitle as sent>',
  category: '<pick from existing categories when it fits, e.g. \'יסודות\'>',
  read:     '<estimate reading time from word count, e.g. \'6 דקות\'>',
  date:     '<next month after the latest existing article, e.g. \'פברואר 2026\'>',
}
```

Only `read` and `date` are ever inferred/estimated — everything else is
supplied by the user or copied verbatim.

## Step 2 — the body (when full article copy is provided)

Convert the plain-text article into a `body: [...]` array of typed blocks on
that same object. Read the whole piece first, then classify each
paragraph/line — don't reformat prose, just tag it:

| Block type | When to use it | Shape |
|---|---|---|
| `p` | Regular paragraph — the default | `{ type: 'p', text }` |
| `h2` | A line that functions as a section header (often phrased as a question, e.g. `קודם כל - מה זה בכלל...`) | `{ type: 'h2', text }` |
| `quote` | A short rhetorical objection/question the author poses and then answers — usually wrapped in quotes in the source text (e.g. `"אבל בטבע אף אחד לא חישב..."`). Strip the literal `"..."` from `text` — the block already renders a quote icon + italic styling, so keeping literal quotation marks too is a redundant double-signal. | `{ type: 'quote', text }` (no surrounding quote marks) |
| `compare` | Exactly two (rarely more) short parallel statements the author is explicitly contrasting (e.g. "X שואל: ... / Y שואל: ...") | `{ type: 'compare', items: [{ label, text }, ...] }` |
| `note` | An aside that's practically important but tonally distinct — disclaimers, "consult a professional" notes, safety caveats | `{ type: 'note', text }` |

Guidelines for classifying:
- Default to `p`. Only pull a paragraph into `quote`/`compare`/`note` when it
  clearly serves that rhetorical role in the text itself — don't manufacture
  structure that isn't there.
- Keep each `p` block to what was one paragraph in the source (paragraph
  breaks in the pasted text = block boundaries). Don't merge or split them.
- A `note` is for things like vet/professional consultation caveats, safety
  warnings, or "before you do X" asides — not just any short paragraph.
- `compare` expects short, punchy `label` + `text` pairs pulled directly from
  the source sentences (e.g. split "A שואל: ...ques..." into
  `label: "A שואל:"`, `text: "...ques..."`).

## Step 2b — brand marks (already wired up, always present)

Two GAiA-paw touches are already built into `ArticleDetail`/`ArticleBody` and
apply automatically to every article — don't skip or re-derive them, just
know they're there so you don't accidentally remove them while editing:

- **Headline paw** — a small `/gaia-paw.png` sits inline right after the
  article `<h1>` title text (`w-[0.9em] h-[0.9em]`, `opacity-80`, `ms-2` so it
  sits on the correct RTL side).
- **Body borders** — one faint `/gaia-paw.png` (`w-7 h-7`, `opacity-25`,
  `mx-auto`) centered above the body content and another centered below it,
  marking the start/end of the article like bookends.

These live in the shared `ArticleDetail` markup, not per-article data — so a
new article gets them for free. Only touch this section if the user
explicitly asks to change the paw styling/position globally.

## Step 3 — rendering

The body renders via the existing `ArticleBody` component and its block
switch in `Articles.jsx` — this is already built. Don't rebuild it per
article; just feed it the classified block array. If a genuinely new block
shape is needed (e.g. an image block, a numbered list), extend the same
switch statement rather than inventing a one-off pattern.

## Design/UX principles already encoded in the renderer

- **Site fonts/colors only** — no new font families or ad-hoc colors. Use the
  existing Tailwind tokens (`text-earth`, `text-bark`, `text-forest`,
  `text-olive`, `bg-parchment`, `border-stone`, etc.) and the `text-display-*`
  scale for headings.
- **RTL-correct logical properties** — use `ps-*`/`pe-*`, `border-s-*`/`border-e-*`,
  never `pl-*`/`pr-*`/`border-l-*`/`border-r-*`, so spacing/borders land on
  the correct visual side under `dir="rtl"`. For an opening accent (like the
  pull-quote's vertical bar), that's the **start** side (`border-s-4`,
  `ps-5`) — the near side in reading order.
- **Restraint over decoration** — quotes, compares, and notes exist to break
  up long-form text and highlight rhetorical structure, not to decorate.
  Most of an article should still be plain `p` blocks.
- **Consistent rhythm** — `h2` gets generous top margin (`mt-12`) so sections
  breathe; body paragraphs use `leading-relaxed` and a comfortable
  `text-base md:text-lg` size for long-form reading.

## Step 4 — verify

After editing, load `/articles/<id>` in the preview browser and scroll the
full length of the piece. Check specifically:
- Every block type present in this article renders as expected.
- Quote/compare/note blocks visually break up the text without overwhelming it.
- Nothing reads oddly in RTL (borders/icons on the correct side).
- The thumbnail card on `/articles` still looks right (title/excerpt fit,
  category badge, date).
