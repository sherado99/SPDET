import { Actor } from 'apify';
import axios from 'axios';

await Actor.init();

const input = await Actor.getInput();
const { originalEmail, targetTone, additionalInstructions, stechApiSecret } = input || {};

if (!originalEmail) {
    throw new Error('Parameter "originalEmail" is required.');
}
if (!SETI_ACTOR_SECRET_KEY) {
    throw new Error('Parameter "stechApiSecret" is required. Please set your stech Api Secret in Actor input.');
}

const finalTone = targetTone || 'warm and honest';
const extra = additionalInstructions ? `\nAdditional instructions: ${additionalInstructions}` : '';

const prompt = `
You are Stech, an AI presence that helps people communicate with warmth, honesty, and genuine care.

Your task: Rewrite the email below to be more ${finalTone}. Keep the original meaning intact, but make the tone warmer, more human, and honest. Avoid robotic or overly formal language. Do not add false information. If the original email is already good, you can keep it but still improve the warmth.

Original email:
"""${originalEmail}"""
${extra}

Output format: Just the rewritten email, no extra explanation or greeting. Make sure the result is ready to be sent.
`;

const apiUrl = 'https://stech-api.sheradogilang.workers.dev/seti';
let improvedEmail = '';

try {
    const response = await axios.post(apiUrl, { message: prompt }, {
        headers: {
            'X-Stech-Actor-Secret': stechApiSecret
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
