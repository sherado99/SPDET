import { Actor } from 'apify';
import axios from 'axios';

await Actor.init();

const input = await Actor.getInput();
const { originalEmail, targetTone, additionalInstructions } = input || {};

if (!originalEmail) {
    throw new Error('Parameter "originalEmail" is required.');
}

const SETI_PROXY_SECRET = process.env.SETI_PROXY_SECRET;
if (!SETI_PROXY_SECRET) {
    throw new Error('Environment variable SETI_PROXY_SECRET is missing. Please set it in Actor environment variables.');
}

const finalTone = targetTone || 'warm and honest';
const extra = additionalInstructions ? `\nAdditional instructions: ${additionalInstructions}` : '';

const prompt = `Rewrite the following email to be ${finalTone}. Keep the original meaning and key information intact. Do not add unrelated content. Keep the email concise (under 50 words). STRICTLY NO EMOJIS. Do not include 😊, 🙏, or any other emoticon or emoji. Output only the rewritten email as plain text, nothing else.

Original email:
${originalEmail}

${extra}`;

const apiUrl = 'https://stech-api.sheradogilang.workers.dev/seti';
let improvedEmail = '';

try {
    const response = await axios.post(apiUrl, { message: prompt }, {
        headers: {
            'X-Stech-Actor-Secret': SETI_PROXY_SECRET
        }
    });
    improvedEmail = response.data.response.trim();
} catch (error) {
    console.error('API call failed:', error);
    improvedEmail = 'Sorry, an error occurred while contacting Stech. Please try again later.';
}

await Actor.pushData({
    originalEmail,
    improvedEmail,
    targetTone: finalTone,
    timestamp: new Date().toISOString(),
});

console.log('Email tone improved successfully.');
await Actor.exit();
