Maaf atas kekacauan sebelumnya, Edo. Saya paham merepotkan sekali harus berurusan dengan format yang berantakan di HP.

Sekarang semuanya sudah saya rapikan dalam format teks biasa yang paling aman untuk disalin di perangkat apa pun. Silakan dicoba.

---

Stech Email Tone Improver (SETI) – Batch Email Rewriter

Turn cold, robotic, or overly formal emails into warm, professional messages in batch.
SETI is a single‑purpose AI tool.

Features

· Batch processing (1–1,000+ emails per run)
· Flexible input (CSV or JSON)
· Per‑email tone selection
· Concurrent processing (up to 20 emails)
· Error tolerance (failed emails are logged)
· Structured output (JSON/CSV)
· Stateless & private (no data stored)

Input: CSV (recommended)

Your CSV needs an "originalEmail" column. Optional: "targetTone", "additionalInstructions".

Example CSV content:

```
originalEmail,targetTone,additionalInstructions
"Dear Sir, your application has been rejected.",empathetic,"Keep it under 30 words"
"Your order #12345 is delayed.",warm,"Apologize and offer a discount"
"We have decided not to proceed with your proposal.",friendly,"Thank them for their time"
```

Input: JSON (for API)

Example JSON:

```
[
  {
    "originalEmail": "Dear Sir, your application has been rejected.",
    "targetTone": "empathetic",
    "additionalInstructions": "Keep it under 30 words"
  },
  {
    "originalEmail": "Your order #12345 is delayed.",
    "targetTone": "warm"
  }
]
```

Output

Each processed email returns:

· originalEmail, improvedEmail, toneUsed, status (success/error), error (if any), timestamp

Example output (JSON):

```
[
  {
    "originalEmail": "Dear Sir, your application has been rejected.",
    "improvedEmail": "Hi, thank you for applying. Unfortunately we couldn't move forward this time, but we appreciate your effort and wish you the best.",
    "toneUsed": "empathetic",
    "status": "success",
    "timestamp": "2026-04-21T10:30:00.000Z"
  }
]
```

Advanced Settings

· Default Tone: warm and honest (fallback)
· Max Concurrency: 5 (1–20)
· Timeout (seconds): 60

Sample Workflow (HR Manager)

1. Export candidate list from ATS to CSV.
2. Keep the rejection email column (or create one).
3. Add columns: targetTone (set to empathetic), additionalInstructions (optional).
4. Save the file.
5. Upload CSV on SETI Actor page, click Run.
6. Wait a few seconds, download the output CSV.
7. Copy the improvedEmail column into your email client and send.

Notes & Risks

· Always review the rewritten email before sending.
· No legal, medical, or financial advice.
· No email content is stored.
· Use internal endpoint for production batches.
· Failed rows are flagged with status: error; you can retry them.

Links

· Stech API on RapidAPI
· Interactive API docs (Postman)
· GitHub repository – core values, license, legal

License & Disclaimer

This tool is provided for informational and communication improvement purposes only. The creator is not liable for any consequences arising from its use. Always review the output before sending.

