import { Actor } from 'apify';
import axios from 'axios';
import crypto from 'crypto';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import PDFDocument from 'pdfkit';

await Actor.init();

// ========== HELPERS ==========

function calculateHash(originalEmail, improvedEmail, timestamp) {
  const data = `${originalEmail}|${improvedEmail}|${timestamp}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function generateDOCX(recipientName, improvedEmail, auditHash) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: `For: ${recipientName || 'Recipient'}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 120 },
        }),
        new Paragraph({
          text: improvedEmail,
          spacing: { after: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Verification Code: ${auditHash}`,
              italics: true,
              size: 18,
              color: '888888',
            }),
          ],
        }),
      ],
    }],
  });
  return await Packer.toBuffer(doc);
}

async function generatePDF(recipientName, improvedEmail, auditHash) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(14).text(`SPDET – Stech Presence Driven Email Transformer`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Addressed to: ${recipientName || 'Recipient'}`);
    doc.fontSize(11).text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
    doc.moveDown(0.5);
    doc.fontSize(11).text(improvedEmail, { align: 'justify', lineGap: 4 });
    doc.moveDown(1);
    doc.fontSize(7).text(`Verification Code: ${auditHash}`, { align: 'center' });
    doc.end();
  });
}

async function saveFileToKVS(filename, buffer, contentType) {
  const store = await Actor.openKeyValueStore();
  await store.setValue(filename, buffer, { contentType });
  const baseUrl = `https://api.apify.com/v2/key-value-stores/${store.id}/records/${filename}?disableRedirect=true`;
  return baseUrl;
}

// ========== INPUT ==========

const input = await Actor.getInput();
const {
  csvFile,
  emails,
  columnMapping,
  rejectionTemplate,
  maxConcurrency = 5,
  timeout = 60,
} = input;

const SPDET_PROXY_SECRET = process.env.SPDET_PROXY_SECRET;
if (!SPDET_PROXY_SECRET) {
  throw new Error('SPDET_PROXY_SECRET environment variable is missing');
}

const API_URL = 'https://stech-api.sheradogilang.workers.dev/spdet';

// ========== CSV PARSER ==========
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

// ========== BUILD EMAIL LIST ==========
let emailList = [];

if (csvFile && typeof csvFile === 'string') {
  let fileContent = null;
  if (csvFile.startsWith('FILE-UPLOAD:')) {
    const fileKey = csvFile.replace('FILE-UPLOAD:', '');
    // Catatan: Actor.getFile mungkin tidak tersedia di Apify SDK v3. Jika error, ganti dengan Actor.getValue.
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
      originalSubject: row.originalSubject || row.subject || '',
      recipientName: row.recipientName || row.recipient_name || row.recipient || row.name || '',
      senderName: row.senderName || row.sender_name || row.sender || '',
      recipientEmail: row.recipientEmail || row.recipient_email || row.email || '',
    })).filter(item => item.originalEmail);
  } else {
    emailList = rows.filter(row => row.originalEmail).map(row => ({
      originalEmail: row.originalEmail,
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

// ========== PROCESS EACH EMAIL ==========
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

  const originalSubject = item.originalSubject || '';
  const recipientName = item.recipientName || '';
  const senderName = item.senderName || '';
  const recipientEmail = item.recipientEmail || '';

  
  let prompt = `Rewrite the following message with warm, honest and profesional.keep it concise.`;
  if (recipientName) prompt += ` Use the recipient's name "${recipientName}" in the greeting.`;
  if (senderName) prompt += ` Sign the message as "${senderName}".`;
  prompt += `\n\nOriginal message:\n${originalEmail}`;

  try {
    const response = await axios.post(API_URL, { message: prompt }, {
      headers: { 'X-Stech-Actor-Secret': SPDET_PROXY_SECRET },
      timeout: timeout * 1000,
    });
    let improvedEmail = response.data.response?.trim() || '';
    

    const timestamp = new Date().toISOString();
    const auditHash = calculateHash(originalEmail, improvedEmail, timestamp);

    // Generate DOCX dan PDF
    const docxBuffer = await generateDOCX(recipientName, improvedEmail, auditHash);
    const pdfBuffer = await generatePDF(recipientName, improvedEmail, auditHash);

    const docxFilename = `email_${index + 1}_${auditHash.substring(0, 8)}.docx`;
    const pdfFilename = `email_${index + 1}_${auditHash.substring(0, 8)}.pdf`;

    const docxUrl = await saveFileToKVS(docxFilename, docxBuffer, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    const pdfUrl = await saveFileToKVS(pdfFilename, pdfBuffer, 'application/pdf');

    return {
      originalEmail,
      improvedEmail,
      status: 'success',
      timestamp,
      auditHash,
      download_docx: docxUrl,
      download_pdf: pdfUrl,
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

// ========== PARALLEL EXECUTION ==========
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