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

  // 1. Proses subject (jika ada)
  let improvedSubject = '';
  if (originalSubject) {
    let subjectPrompt = `Rewrite this email subject line to be ${targetTone}. Keep it concise (under 10 words). Output only the rewritten subject line, nothing else.`;
    if (additional) subjectPrompt += ` Additional instructions: ${additional}`;
    subjectPrompt += `\n\nOriginal subject:\n${originalSubject}`;

    try {
      const subjectResponse = await axios.post(API_URL, { message: subjectPrompt }, {
        headers: { 'X-Stech-Actor-Secret': SETI_PROXY_SECRET },
        timeout: timeout * 1000,
      });
      improvedSubject = subjectResponse.data.response?.trim() || '';
    } catch (err) {
      // Jika gagal, biarkan improvedSubject kosong, tapi lanjutkan
    }
  }

  // 2. Proses body email
  let personalization = '';
  if (recipientName) {
    personalization += ` Address the recipient as ${recipientName}.`;
  }
  if (senderName) {
    personalization += ` Sign the email as ${senderName}.`;
  }

  let bodyPrompt = `Rewrite the following email to be ${targetTone}. Keep the original meaning. Output only the rewritten email.${personalization}`;
  if (additional) bodyPrompt += ` Additional instructions: ${additional}`;
  bodyPrompt += `\n\nOriginal email:\n${originalEmail}`;

  try {
    const bodyResponse = await axios.post(API_URL, { message: bodyPrompt }, {
      headers: { 'X-Stech-Actor-Secret': SETI_PROXY_SECRET },
      timeout: timeout * 1000,
    });
    const improvedEmail = bodyResponse.data.response?.trim() || '';

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
      ...(originalSubject && { originalSubject, improvedSubject }),
      ...(recipientName && { recipientName }),
      ...(senderName && { senderName }),
    };
  }
}
