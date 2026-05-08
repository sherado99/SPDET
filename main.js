import { Actor } from 'apify';
import axios from 'axios';
import crypto from 'crypto';

await Actor.init();

// Fungsi untuk menghitung auditHash
function calculateHash(originalEmail, improvedEmail, timestamp) {
  const data = `${originalEmail}|${improvedEmail}|${timestamp}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

const input = await Actor.getInput();
const {
  csvFile,
  emails,
  columnMapping,
  rejectionTemplate,
  defaultTone = 'warm and honest',
  maxConcurrency = 5,
  timeout = 60,
} = input;

const SPDET_PROXY_SECRET = process.env.SPDET_PROXY_SECRET || process.env.SPDET_PROXY_SECRET;
if (!SPDET_PROXY_SECRET) {
  throw new Error('SPDET_PROXY_SECRET environment variable is missing');
}

const API_URL = 'https://stech-api.sheradogilang.workers.dev/spdet';

function parseCSV(content) {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length === 0) return [];
  const headers = [];
  let inQuote = false;
  let current = '';
  const firstLine = lines[0];
  for (let ch of firstLine) {
    if (ch === '"') inQuote = !inQuote;
    else if (ch === ',' && !inQuote) {
      headers.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += ch;
    }
  }
  headers.push(current.trim().replace(/^"|"$/g, ''));
  
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const values = [];
    inQuote = false;
    current = '';
    for (let ch of line) {
      if (ch === '"') inQuote = !inQuote;
      else if (ch === ',' && !inQuote) {
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += ch;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    result.push(row);
  }
  return result;
}

function removeSubjectFromBody(body, subject) {
  if (!subject || !body) return body;
  const escapedSubject = subject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const subjectPattern = new RegExp(`^(Subject\\s*:\\s*)?\\s*${escapedSubject}\\s*\\n*`, 'i');
  return body.replace(subjectPattern, '').trim();
}

function applyMappingAndTemplate(row, mapping, template) {
  if (!template || !mapping) return null;
  let filled = template;
  for (const [placeholder, columnName] of Object.entries(mapping)) {
    const value = row[columnName] || '';
    filled = filled.replace(new RegExp(`{${placeholder}}`, 'g'), value);
  }
  return filled;
}

let emailList = [];

if (csvFile && typeof csvFile === 'string') {
  let fileContent = null;
  if (csvFile.startsWith('FILE-UPLOAD:')) {
    const fileKey = csvFile.replace('FILE-UPLOAD:', '');
    const fileBuffer = await Actor.getFile(fileKey);
    fileContent = fileBuffer.toString();
  } else if (csvFile.startsWith('http://') || csvFile.startsWith('https://')) {
    const response = await axios.get(csvFile, { responseType: 'text' });
    fileContent = response.data;
  } else {
    throw new Error('Invalid csvFile format. Must be a FILE-UPLOAD: key or a public URL.');
  }
  const rows = parseCSV(fileContent);
  if (rows.length === 0) {
    throw new Error('CSV file is empty or could not be parsed.');
  }
  
  if (columnMapping && rejectionTemplate && Object.keys(columnMapping).length > 0) {
    emailList = rows.map(row => ({
      originalEmail: applyMappingAndTemplate(row, columnMapping, rejectionTemplate),
      targetTone: row.targetTone || defaultTone,
      additionalInstructions: row.additionalInstructions || '',
      originalSubject: row.originalSubject || row.subject || '',
      recipientName: row.recipientName || row.recipient_name || row.recipient || row.name || '',
      senderName: row.senderName || row.sender_name || row.sender || '',
      recipientEmail: row.recipientEmail || row.recipient_email || row.email || '',
    })).filter(item => item.originalEmail);
  } else {
    emailList = rows.filter(row => row.originalEmail).map(row => ({
      originalEmail: row.originalEmail,
      targetTone: row.targetTone || defaultTone,
      additionalInstructions: row.additionalInstructions || '',
      originalSubject: row.originalSubject || row.subject || '',
      recipientName: row.recipientName || row.recipient_name || row.recipient || row.name || '',
      senderName: row.senderName || row.sender_name || row.sender || '',
      recipientEmail: row.recipientEmail || row.recipient_email || row.email || '',
    }));
  }
} else if (Array.isArray(emails) && emails.length > 0) {
  emailList = emails;
} else {
  throw new Error('No input provided. Please either upload a CSV file or provide an array of emails.');
}

if (emailList.length === 0) {
  throw new Error('No valid email entries found. Check your input data.');
}

async function processEmail(item, index) {
  const originalEmail = item.originalEmail;
  if (!originalEmail) {
    return {
      originalEmail: null,
      improvedEmail: "",
      status: 'error',
      error: 'Missing originalEmail field',
      timestamp: new Date().toISOString(),
      auditHash: '',
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
      headers: { 'X-Stech-Actor-Secret': SPDET_PROXY_SECRET },
      timeout: timeout * 1000,
    });
    let improvedEmail = response.data.response?.trim() || '';
    if (originalSubject) {
      improvedEmail = removeSubjectFromBody(improvedEmail, originalSubject);
    }
    const timestamp = new Date().toISOString();
    const auditHash = calculateHash(originalEmail, improvedEmail, timestamp);
    return {
      originalEmail,
      improvedEmail,
      toneUsed: targetTone,
      status: 'success',
      timestamp,
      auditHash,
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
      auditHash: '',
      ...(originalSubject && { originalSubject }),
      ...(recipientName && { recipientName }),
      ...(senderName && { senderName }),
      ...(recipientEmail && { recipientEmail }),
    };
  }
}

const results = [];
const running = new Set();
const queue = [...emailList];
let nextIndex = 0;

while (queue.length > 0 || running.size > 0) {
  while (running.size < maxConcurrency && queue.length > 0) {
    const item = queue.shift();
    const index = nextIndex++;
    const promise = processEmail(item, index).then(res => {
      running.delete(promise);
      results.push(res);
    });
    running.add(promise);
  }
  if (running.size > 0) {
    await Promise.race(running);
  }
}

results.sort((a, b) => a.index - b.index);
const finalOutput = results.map(({ index, ...rest }) => rest);

await Actor.pushData(finalOutput);
console.log(`Processed ${finalOutput.length} emails. Success: ${finalOutput.filter(r => r.status === 'success').length}, Errors: ${finalOutput.filter(r => r.status === 'error').length}`);

await Actor.exit();
