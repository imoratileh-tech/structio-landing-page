const DESTINATION = 'info@structio.com';
const MAX_LENGTHS = {
  agency_name: 160,
  contact_name: 120,
  contact_email: 254,
  contact_phone: 48,
  team_size: 40,
  notes: 2000,
};
const TEAM_SIZES = new Set([
  '5-10 agents',
  '11-20 agents',
  '20+ agents',
  'Under 5 agents',
]);

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= MAX_LENGTHS.contact_email;
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const origin = request.headers.origin;
  const host = request.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return response.status(403).json({ error: 'Request origin not allowed.' });
      }
    } catch {
      return response.status(403).json({ error: 'Request origin not allowed.' });
    }
  }

  const body = request.body && typeof request.body === 'object' ? request.body : {};
  if (typeof body.bot_field === 'string' && body.bot_field.trim()) {
    return response.status(200).json({ ok: true });
  }

  const fields = {};
  for (const [name, maxLength] of Object.entries(MAX_LENGTHS)) {
    if (typeof body[name] !== 'string') {
      return response.status(400).json({ error: 'Please complete all required fields.' });
    }
    fields[name] = body[name].trim();
    if (fields[name].length > maxLength) {
      return response.status(400).json({ error: 'One or more fields are too long.' });
    }
  }

  if (!fields.agency_name || !fields.contact_name || !fields.contact_phone || !isValidEmail(fields.contact_email)) {
    return response.status(400).json({ error: 'Please check the required fields and email address.' });
  }

  if (!TEAM_SIZES.has(fields.team_size)) {
    return response.status(400).json({ error: 'Please select a valid team size.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return response.status(503).json({ error: 'The enquiry service is not configured yet. Please email info@structio.com.' });
  }

  const text = [
    'New Structio consultation request',
    '',
    `Agency / team: ${fields.agency_name}`,
    `Name: ${fields.contact_name}`,
    `Email: ${fields.contact_email}`,
    `Phone: ${fields.contact_phone}`,
    `Team size: ${fields.team_size}`,
    `Preferred time and context: ${fields.notes || 'Not provided'}`,
  ].join('\n');

  const html = [
    '<h2>New Structio consultation request</h2>',
    ...[
      ['Agency / team', fields.agency_name],
      ['Name', fields.contact_name],
      ['Email', fields.contact_email],
      ['Phone', fields.contact_phone],
      ['Team size', fields.team_size],
      ['Preferred time and context', fields.notes || 'Not provided'],
    ].map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value).replace(/\n/g, '<br>')}</p>`),
  ].join('');

  try {
    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [DESTINATION],
        reply_to: fields.contact_email,
        subject: `Consultation request: ${fields.agency_name}`,
        text,
        html,
      }),
    });

    if (!delivery.ok) {
      return response.status(502).json({ error: 'We could not deliver your request. Please try again or email info@structio.com.' });
    }
  } catch {
    return response.status(502).json({ error: 'We could not deliver your request. Please try again or email info@structio.com.' });
  }

  return response.status(200).json({ ok: true });
};