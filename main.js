import { Actor } from 'apify';

await Actor.init();
console.log('Stech Actor is running!');
await Actor.pushData({ message: 'Hello from Stech' });
await Actor.exit();
