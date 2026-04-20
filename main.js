import { Actor } from 'apify';
import axios from 'axios';

await Actor.init();

const input = await Actor.getInput();
const {
  csvFile,
  emails,
  maxConcurrency = 5,
  timeout = 60,
  defaultTone = 'warm and honest'
} = input;

const SETI_PROXY_SECRET = process.env.SETI_PROXY_SECRET;
if (!SETI_PROXY_SECRET) {
  throw new Error('SETI_PROXY_SECRET environment variable is missing');
}

const API_URL = 'https://stech-api.sheradogilang.workers.dev/seti';

let emailList = [];

function parseCSV(content) {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const values = [];
    let inQuote = false;
    let current = '';
    for (let ch of line) {
      if (ch === '"') {
        inQuote = !inQuote;
      } else if (ch === ',' && !inQuote) {
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += ch;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || '';
    });
    if (obj.originalEmail) result.push(obj);
  }
  return result;
}

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
  if (fileContent) {
    emailList = parseCSV(fileContent);
  }
} else if (Array.isArray(emails) && emails.length > 0) {
  emailList = emails;
} else {
  throw new Error('No input provided. Please upload a CSV file or provide an array of emails.');
}

async function processEmail(item, index) {
  const originalEmail = item.originalEmail;
  if (!originalEmail) {
    return {
      index,
      originalEmail: null,
      improvedEmail: null,
      status: 'error',
      error: 'Missing originalEmail field',
      timestamp: new Date().toISOString()
    };
  }
  const targetTone = item.targetTone || defaultTone;
  const additional = item.additionalInstructions || '';
  let prompt = `Rewrite the following email to be ${targetTone}. Keep the original meaning. Output only the rewritten email.`;
  if (additional) prompt += ` Additional instructions: ${additional}`;
  prompt += `\n\nOriginal email:\n${originalEmail}`;

  try {
    const response = await axios.post(API_URL, { message: prompt }, {
      headers: { 'X-Stech-Actor-Secret': SETI_PROXY_SECRET },
      timeout: timeout * 1000
    });
    const improvedEmail = response.data.response?.trim() || '';
    return {
      index,
      originalEmail,
      improvedEmail,
      toneUsed: targetTone,
      status: 'success',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    return {
      index,
      originalEmail,
      improvedEmail: null,
      status: 'error',
      error: err.message,
      timestamp: new Date().toISOString()
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
