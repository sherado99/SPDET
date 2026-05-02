async function processEmail(item, index) {
  const originalEmail = item.originalEmail;
  if (!originalEmail) {
    return {
      originalEmail: null,
      improvedEmail: "",
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
  const recipientEmail = item.recipientEmail || '';

  let personalization = '';
  if (recipientName) {
    personalization += ` Use the recipient's name "${recipientName}" in the greeting.`;
  }
  if (senderName) {
    personalization += ` Sign the email as "${senderName}".`;
  }

  let prompt = `Rewrite the following email to be ${targetTone}. Keep the original meaning.${personalization}`;
  if (additional) prompt += ` Additional instructions: ${additional}`;
  if (originalSubject) {
    prompt += `\nThe email subject is "${originalSubject}". Keep the subject unchanged.`;
  }
  prompt += `\n\nOriginal email:\n${originalEmail}`;

  try {
    const response = await axios.post(API_URL, { message: prompt }, {
      headers: { 'X-Stech-Actor-Secret': SETI_PROXY_SECRET },
      timeout: timeout * 1000,
    });
    // Ambil respons mentah, lalu bersihkan jika perlu
    let improvedEmail = response.data.response?.trim() || '';
    if (originalSubject) {
      improvedEmail = removeSubjectFromBody(improvedEmail, originalSubject);
    }
    return {
      originalEmail,
      improvedEmail,
      toneUsed: targetTone,
      status: 'success',
      timestamp: new Date().toISOString(),
      ...(originalSubject && { originalSubject }),
      ...(recipientName && { recipientName }),
      ...(senderName && { senderName }),
      ...(recipientEmail && { recipientEmail }),
    };
  } catch (err) {
    return {
      originalEmail: originalEmail || "",
      improvedEmail: "",
      status: 'error',
      error: err.message,
      timestamp: new Date().toISOString(),
      ...(originalSubject && { originalSubject }),
      ...(recipientName && { recipientName }),
      ...(senderName && { senderName }),
      ...(recipientEmail && { recipientEmail }),
    };
  }
}
