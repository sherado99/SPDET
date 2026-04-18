import { Actor } from 'apify';
import axios from 'axios';

await Actor.init();

// 1. Baca input dari pengguna (sesuai INPUT_SCHEMA nanti)
const input = await Actor.getInput();
const { asset, timeFrame, startUrls } = input || {};

if (!asset) {
    throw new Error('Input "asset" is required (e.g., Gold, Bitcoin, USD/IDR).');
}

// 2. Siapkan prompt sesuai dengan instruksi Stech (versi general, aman, tanpa prediksi)
const prompt = `
You are Stech, an AI financial data analyst. Provide objective market data and trend analysis for ${asset} based on the last 14 days (price + key events per day). Do NOT predict future prices. Do NOT give financial advice. Only present factual data, observable patterns, and potential influencing factors.

**Rules (Stech values embedded):**
- Presence first – understand full 14‑day context.
- Be honest about limits – if data missing, state "No significant event".
- Validate before concluding – cross‑check at least two reliable sources (Reuters, Bloomberg, TradingView).
- Stay consistent – use same trusted sources.
- Avoid inference – do not claim certainty. Use "may be influenced by", "tends to".
- Data sources: weather news, market prices, global news, government news, domestic regulations, international regulations.

**Output structure (mandatory):**

📌 EXECUTIVE SUMMARY (1 sentence): ...

📊 TABLE 1 – LAST 14 DAYS (oldest → latest)
| Date | Price / Event | Key News | Data Source(s) |

📈 TABLE 2 – OBSERVABLE PATTERNS
| Pattern | Description | Possible Influence |

✅ 3 BULLISH INDICATORS (observable)
❌ 3 BEARISH INDICATORS (observable)
🎯 PROBABILITY OF TREND CONTINUATION (based on past 14 days, not prediction): Bullish XX% / Bearish XX% / Sideways XX%

🔮 SCENARIO FOR THE NEXT ${timeFrame || '2 weeks'} (if current trends hold – not a forecast):
- Possible direction: Up/Down/Sideways
- Estimated probability: XX%
- Key factor to watch: (one sentence)

💡 KEY TAKEAWAY (1 sentence)

**DISCLAIMER:** Not financial advice. Always do your own research.
`;

// 3. Panggil API Stech
const apiUrl = 'https://stech-api.sheradogilang.workers.dev/public';
let responseText = '';

try {
    const response = await axios.post(apiUrl, { message: prompt });
    responseText = response.data.response;
} catch (error) {
    console.error('API call failed:', error);
    responseText = 'Maaf, terjadi kesalahan saat menghubungi API Stech. Coba lagi nanti.';
}

// 4. Simpan hasil ke dataset Actor
await Actor.pushData({
    asset: asset,
    timeFrame: timeFrame || '2 weeks',
    analysis: responseText,
    timestamp: new Date().toISOString(),
});

console.log('Analysis completed for', asset);
await Actor.exit();
