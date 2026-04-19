import { Actor } from 'apify';
import axios from 'axios';

await Actor.init();

const input = await Actor.getInput();
const { originalEmail, targetTone, additionalInstructions } = input || {};

if (!originalEmail) {
    throw new Error('Parameter "originalEmail" is required.');
}

// Ambil secret dari environment variable (sudah Anda set di Apify)
const SETI_ACTOR_SECRET_KEY = process.env.SETI_ACTOR_SECRET_KEY;
if (!SETI_ACTOR_SECRET_KEY) {
    throw new Error('Environment variable SETI_ACTOR_SECRET_KEY is missing. Please set it in Actor environment variables.');
}

const finalTone = targetTone || 'warm and honest';
const extra = additionalInstructions ? `\nAdditional instructions: ${additionalInstructions}` : '';

const prompt = `...`; // (prompt tetap sama seperti sebelumnya)

const apiUrl = 'https://stech-api.sheradogilang.workers.dev/seti';
let improvedEmail = '';

try {
    const response = await axios.post(apiUrl, { message: prompt }, {
        headers: {
            'X-Stech-Actor-Secret': SETI_ACTOR_SECRET_KEY
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
