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

  // Deklarasi di luar try-catch agar bisa diakses keduanya
  let improvedSubject = '';
  let improvedEmail = '';

  // Gabung instruksi personalisasi
  let personalization = '';
  if (recipientName) {
    personalization += ` Address the recipient as ${recipientName}.`;
  }
  if (senderName) {
    personalization += ` Sign the email as ${senderName}.`;
  }

  let prompt = `Rewrite the following email to be ${targetTone}. Keep the original meaning.${personalization}`;
  if (additional) prompt += ` Additional instructions: ${additional}`;
  
  if (originalSubject) {
    prompt += `\nAlso rewrite this email subject line to be ${targetTone}: "${originalSubject}".`;
  }
  
  prompt += `\n\nOutput your response exactly in the format below. Do not include any other text.`;
  prompt += `\n\`\`\`subject\n(rewritten subject here, or leave empty)\n\`\`\``;
  prompt += `\n\`\`\`body\n(rewritten email body here)\n\`\`\``;
  prompt += `\n\nOriginal email:\n${originalEmail}`;

  try {
    const response = await axios.post(API_URL, { message: prompt }, {
      headers: { 'X-Stech-Actor-Secret': SETI_PROXY_SECRET },
      timeout: timeout * 1000,
    });
    const rawOutput = response.data.response?.trim() || '';
    
    improvedEmail = rawOutput; // fallback

    // Ekstrak subject dari fence markdown
    const subjectMatch = rawOutput.match(/```subject\s*([\s\S]*?)```/i);
    if (subjectMatch) {
      improvedSubject = subjectMatch[1].trim();
    }

    // Ekstrak body dari fence markdown
    const bodyMatch = rawOutput.match(/```body\s*([\s\S]*?)```/i);
    if (bodyMatch) {
      improvedEmail = bodyMatch[1].trim();
    }
  } catch (err) {
    // Variabel tetap terisi kosong sebagai fallback
  }

  return {
    index,
    originalEmail,
    improvedEmail,
    toneUsed: targetTone,
    status: improvedEmail ? 'success' : 'error',
    timestamp: new Date().toISOString(),
    ...(originalSubject && { originalSubject, improvedSubject }),
    ...(recipientName && { recipientName }),
    ...(senderName && { senderName }),
  };
}
