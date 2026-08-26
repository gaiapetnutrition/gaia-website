const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  let email
  try {
    const parsed = JSON.parse(event.body || '{}')
    email = typeof parsed.email === 'string' ? parsed.email.trim() : ''
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) }
  }

  if (!email || !EMAIL_RE.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email' }) }
  }

  const apiKey = process.env.BREVO_API_KEY
  const listId = Number(process.env.BREVO_LIST_ID || 3)

  if (!apiKey) {
    console.error('newsletter-subscribe: BREVO_API_KEY is not set')
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) }
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
      let details = ''
      try {
        details = JSON.stringify(await res.json())
      } catch {
        details = await res.text()
      }
      console.error(`newsletter-subscribe: Brevo API error ${res.status}: ${details}`)
      return { statusCode: 502, body: JSON.stringify({ error: 'Subscription failed' }) }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    console.error('newsletter-subscribe: unexpected error', err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Subscription failed' }) }
  }
}
