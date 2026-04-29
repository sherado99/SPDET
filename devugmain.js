import { Actor } from 'apify';

await Actor.init();

console.log('DEBUG: Actor started.');
const input = await Actor.getInput();
console.log('DEBUG: Input received:', JSON.stringify(input).substring(0, 500));

await Actor.pushData([
    {
        status: 'success',
        message: 'Actor live! Input preview:',
        inputPreview: JSON.stringify(input).substring(0, 200),
        timestamp: new Date().toISOString(),
    },
]);

console.log('DEBUG: Data pushed. Exiting.');
await Actor.exit();
