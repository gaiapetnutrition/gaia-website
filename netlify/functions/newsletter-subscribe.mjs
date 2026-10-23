const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_LENGTH = 254

const json = (statusCode, body) => Response.json(body, { status: statusCode })

export default async (req) => {
  if (req.method !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }

  let parsed
  try {
    parsed = await req.json()
  } catch {
    return json(400, { error: 'Invalid request body' })
  }
  if (!parsed || typeof parsed !== 'object') {
    return json(400, { error: 'Invalid request body' })
  }

  // Honeypot: the "website" field is hidden from people, so anything in it is a bot.
  // Answer as if it worked so bots don't learn to skip the field.
  if (parsed.website != null && parsed.website !== '') {
    console.info('newsletter-subscribe: honeypot triggered')
    return json(200, { ok: true })
  }

  const email = typeof parsed.email === 'string' ? parsed.email.trim() : ''
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
    return json(400, { error: 'Invalid email' })
  }

  const apiKey = process.env.BREVO_API_KEY
  const listId = Number(process.env.BREVO_LIST_ID || 3)

  if (!apiKey) {
    console.error('newsletter-subscribe: BREVO_API_KEY is not set')
    return json(500, { error: 'Server not configured' })
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    })

    if (!res.ok) {
      // Read the body once as text: Brevo errors are usually JSON, but proxies/outages may return HTML or nothing
      const details = (await res.text().catch(() => '')).slice(0, 500)
      console.error(`newsletter-subscribe: Brevo API error ${res.status}: ${details}`)
      return json(502, { error: 'Subscription failed' })
    }

    return json(200, { ok: true })
  } catch (err) {
    console.error('newsletter-subscribe: unexpected error', err)
    return json(500, { error: 'Subscription failed' })
  }
}

export const config = {
  path: '/api/newsletter-subscribe',
  // Per visitor IP: 5 attempts per minute, then Netlify answers 429 without running the function
  rateLimit: {
    windowLimit: 5,
    windowSize: 60,
    aggregateBy: ['ip', 'domain'],
  },
}
