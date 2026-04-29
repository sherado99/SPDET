async function processEmail(item, index) {
  const originalEmail = item.originalEmail;
  if (!originalEmail) {
    return {
      index,
      originalEmail: null,
      improvedEmail: null,
      status: 'error',
      error: 'Missing originalEmail field',
      timestamp: new Date().toISOString(),
    };
  }

  const targetTone = item.targetTone || defaultTone;
  const additional = item.additionalInstructions || '';
  const originalSubject = item.originalSubject || '';
  const recipientName = item.recipientName || '';
  const senderName = item.senderName || '';

  // Bangun satu prompt gabungan
  let personalization = '';
  if (recipientName) {
    personalization += ` Address the recipient as ${recipientName}.`;
  }
  if (senderName) {
    personalization += ` Sign the email as ${senderName}.`;
  }

  let prompt = `Rewrite the following email to be ${targetTone}. Keep the original meaning.${personalization}`;
  if (additional) prompt += ` Additional instructions: ${additional}`;
  
  // Tambahkan instruksi untuk subject jika ada
  if (originalSubject) {
    prompt += `\nAlso rewrite this email subject line to be ${targetTone}: "${originalSubject}".`;
  }
  
  prompt += `\n\nOutput ONLY a valid JSON object with two fields: "subject" (the rewritten subject line, or empty string if no subject was provided) and "body" (the rewritten email body). Do not include any other text.`;
  prompt += `\n\nOriginal email:\n${originalEmail}`;

  try {
    const response = await axios.post(API_URL, { message: prompt }, {
      headers: { 'X-Stech-Actor-Secret': SETI_PROXY_SECRET },
      timeout: timeout * 1000,
    });
    const rawOutput = response.data.response?.trim() || '';
    
    let improvedSubject = '';
    let improvedEmail = '';

    try {
      // Coba parse JSON dari output
      const parsed = JSON.parse(rawOutput);
      improvedSubject = parsed.subject || '';
      improvedEmail = parsed.body || rawOutput;
    } catch (parseErr) {
      // Jika gagal parse JSON, gunakan raw output sebagai body, subject kosong
      improvedEmail = rawOutput;
    }

    return {
      index,
      originalEmail,
      improvedEmail,
      toneUsed: targetTone,
      status: 'success',
      timestamp: new Date().toISOString(),
      ...(originalSubject && { originalSubject, improvedSubject }),
      ...(recipientName && { recipientName }),
      ...(senderName && { senderName }),
    };
  } catch (err) {
    return {
      index,
      originalEmail,
      improvedEmail: null,
      status: 'error',
      error: err.message,
      timestamp: new Date().toISOString(),
      ...(originalSubject && { originalSubject, improvedSubject: '' }),
      ...(recipientName && { recipientName }),
      ...(senderName && { senderName }),
    };
  }
}
