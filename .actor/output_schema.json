import { Actor } from 'apify';
import axios from 'axios';
import crypto from 'crypto';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import PDFDocument from 'pdfkit';

await Actor.init();

// ========== HELPERS ==========

/**
 * Hitung SHA-256 hash dari data
 */
function calculateHash(originalEmail, improvedEmail, timestamp) {
  const data = `${originalEmail}|${improvedEmail}|${timestamp}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generator file DOCX dari teks hasil olahan
 * @returns {Promise<Buffer>}
 */
async function generateDOCX(recipientName, improvedEmail, auditHash) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: `Untuk: ${recipientName || 'Penerima'}`,
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
              text: `Kode Verifikasi: ${auditHash}`,
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

/**
 * Generator file PDF dari teks hasil olahan
 * @returns {Promise<Buffer>}
 */
async function generatePDF(recipientName, improvedEmail, auditHash) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(14).text(`SPDET – Email yang Dihangatkan`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Ditujukan untuk: ${recipientName || 'Penerima'}`);
    doc.fontSize(11).text(`Tanggal: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`);
    doc.moveDown(0.5);
    doc.fontSize(11).text(improvedEmail, { align: 'justify', lineGap: 4 });
    doc.moveDown(1);
    doc.fontSize(7).text(`Kode Verifikasi: ${auditHash}`, { align: 'center' });
    doc.end();
  });
}

/**
 * Simpan file ke Apify Key-Value Store, kembalikan URL publik
 */
async function saveFileToKVS(filename, buffer, contentType) {
  const store = await Actor.openKeyValueStore();
  await store.setValue(filename, buffer, { contentType });
  // Apify KVS URL publik biasanya dapat dibentuk dari ID run & nama file
  // Untuk aktor ini, kita akan menggunakan URL yang dihasilkan oleh Apify secara manual
  // Lewat Actor.getFile() atau langsung hardcode base URL.
  // Di sini kita asumsikan environment variable APIFY_RUN_ID tersedia.
  const runId = process.env.APIFY_RUN_ID || 'default';
  const baseUrl = `https://api.apify.com/v2/key-value-stores/${store.id}/records/${filename}?disableRedirect=true`;
  return baseUrl;
}

// ========== KONFIGURASI INPUT ==========

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

// ========== CSV PARSER (sama seperti sebelumnya) ==========

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

// ========== BANGUN DAFTAR EMAIL ==========

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
      additionalInstructions: row.additionalInstructions || '',
      originalSubject: row.originalSubject || row.subject || '',
      recipientName: row.recipientName || row.recipient_name || row.recipient || row.name || '',
      senderName: row.senderName || row.sender_name || row.sender || '',
      recipientEmail: row.recipientEmail || row.recipient_email || row.email || '',
    })).filter(item => item.originalEmail);
  } else {
    emailList = rows.filter(row => row.originalEmail).map(row => ({
      originalEmail: row.originalEmail,
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

// ========== PROSES SETIAP EMAIL ==========

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

  let prompt = `Please process the following email.${personalization}`;
  if (additional) prompt += ` ${additional}`;
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

    // Pagar Micro Honesty
    const offerPatterns = [
      'discount', 'diskon', '% off', 'coupon', 'voucher', 'promo code',
      'free of charge', 'no cost', 'on the house',
      'we are here to help', 'let us know if you need', 'feel free to reach out',
      'we can assist', 'don\'t hesitate to contact', 'we\'re happy to help',
      'as a gesture of goodwill', 'as a token of apology'
    ];
    const lowerImproved = improvedEmail.toLowerCase();
    const lowerOriginal = originalEmail.toLowerCase();
    const foundOffer = offerPatterns.find(p => lowerImproved.includes(p));
    const offerInOriginal = foundOffer ? lowerOriginal.includes(foundOffer) : false;
    if (foundOffer && !offerInOriginal) {
      return {
        originalEmail,
        improvedEmail: "",
        status: 'error',
        error: `Output blocked by Micro Honesty filter: it contained "${foundOffer}" which was not present in the original email.`,
        timestamp: new Date().toISOString(),
        auditHash: '',
        ...(originalSubject && { originalSubject }),
        ...(recipientName && { recipientName }),
        ...(senderName && { senderName }),
        ...(recipientEmail && { recipientEmail }),
      };
    }

    const timestamp = new Date().toISOString();
    const auditHash = calculateHash(originalEmail, improvedEmail, timestamp);

    // ---- GENERASI FILE MULTI-FORMAT ----
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

// ========== EKSEKUSI PARALEL ==========

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