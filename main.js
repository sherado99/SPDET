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
  
  // Instruksi pemisahan yang lebih andal
  prompt += `\n\nReturn your response in two parts, separated by the word "---BODY---". The first part is the rewritten subject line (leave empty if no subject was provided). The second part is the rewritten email body. Do not include any extra text or explanations.`;
  
  prompt += `\n\nOriginal email:\n${originalEmail}`;

  let improvedSubject = '';
  let improvedEmail = '';

  try {
    const response = await axios.post(API_URL, { message: prompt }, {
      headers: { 'X-Stech-Actor-Secret': SETI_PROXY_SECRET },
      timeout: timeout * 1000,
    });
    const rawOutput = response.data.response?.trim() || '';
    
    // Pisahkan subject dan body menggunakan delimiter "---BODY---"
    if (originalSubject && rawOutput.includes('---BODY---')) {
      const parts = rawOutput.split('---BODY---');
      improvedSubject = parts[0].trim();
      improvedEmail = parts.slice(1).join('---BODY---').trim(); // jika ada delimiter di body
    } else {
      // Tidak ada subject, seluruh output adalah body
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
