<img width="128" height="128" alt="vvut2mvjCvi7ILJmZ-actor-HXcDgLz5J7sPUwbVb-rcgMKeHSxo-422865a9-b97d-4ecb-a4c9-facb73ef7ab5" src="https://github.com/user-attachments/assets/b62f163c-d253-41e7-be91-92928740d761"


# Stech Email Tone Improver (SETI) – Bulk Email Rewriter

**Turn cold, robotic, or overly formal emails into warm, professional messages in bulk.**

SETI is a single‑purpose AI tool for batch email rewriting. Upload CSV or JSON, choose a tone per email, and get a clean CSV/JSON export in seconds. No data is stored. No fake empathy. Just efficient, professional results.

---

## 🚀 Key features

- **Batch processing** – rewrite 1 to 1,000+ emails in one run
- **Flexible input** – upload a CSV file or paste a JSON array
- **Per‑email tone** – pick a tone for each email (warm, empathetic, friendly, encouraging, professional‑warm)
- **High concurrency** – process up to 20 emails at once
- **Error tolerance** – failed emails are logged; the rest continue
- **Structured output** – get JSON or CSV with status, timestamp and error info
- **Stateless & private** – no email content is ever stored

---

## 📥 Input methods

### 1. CSV upload (easiest for batch workloads)

Your CSV needs at least an `originalEmail` column. Optional columns:

| Column | Required | Description |
|--------|:--------:|-------------|
| `originalEmail` | ✅ | The email text to rewrite. |
| `targetTone` | ❌ | Tone for this email (`warm and honest`, `friendly`, `empathetic`, `encouraging`, `professional‑warm`). Default = `warm and honest`. |
| `additionalInstructions` | ❌ | Extra guidance (e.g. "make it shorter", "add an apology"). |

**Example CSV content**

```csv
originalEmail,targetTone,additionalInstructions
"Dear Sir, your application has been rejected.",empathetic,"Keep it under 30 words"
"Your order #12345 is delayed.",warm,"Apologize and offer a discount"
"We have decided not to proceed with your proposal.",friendly,"Thank them for their time"
Drop the file into the CSV File field of the Actor input form.
```
### 2. JSON array (for API & advanced users)
Use the Emails Array field with this shape:

```json
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
---
## 📤 Output
After the run, you get a structured dataset (JSON/CSV). Each row contains:

- Field	Description
- originalEmail	The email you provided.
- improvedEmail	The rewritten, warmer version (null on error).
- toneUsed	The tone that was applied.
- status	success or error.
- error	Error message (if any).
- timestamp	Processing timestamp (ISO 8601).
- Example output (JSON)

```json
[
  {
    "originalEmail": "Dear Sir, your application has been rejected.",
    "improvedEmail": "Hi, thank you for applying. We couldn't move forward this time, but we appreciate your effort and wish you the best.",
    "toneUsed": "empathetic",
    "status": "success",
    "timestamp": "2026-04-21T10:30:00.000Z"
  }
]
```
You can download the dataset as CSV directly from the Apify console.

---
## ⚙️ Advanced settings
- Parameter	Description	Default
- Default Tone	Fallback tone when not specified per email.	warm and honest
- Max Concurrency	Number of emails processed in parallel (1‑20).	5
- Timeout (seconds)	Maximum wait time per email request.	60

## 🧪 Sample workflow (HR manager)
- Export candidate list from your ATS to a CSV file.
- Keep the column with the rejection email (or create one).
- Add two extra columns: targetTone (set to empathetic) and additionalInstructions (optional).
- Save the file.
- Visit the SETI Actor page, upload the CSV, click Run.
- Wait a few seconds, then download the output CSV.
- Copy the improvedEmail column into your email client and send.

## ❗ Notes & risks
- Always review the rewritten email before sending. AI can make mistakes.
- No legal, medical, or financial advice – Stech is not a professional advisor.
- No data storage – emails are processed in memory and never persisted.
- Rate limits – the public endpoint may throttle heavy usage. Use the internal endpoint for production batches.
- Failed rows are flagged with status: error; you can retry them later.

## 🔗 Links
- Stech API on RapidAPI (https://rapidapi.com/sheradogilang/api/stech-honest-presence-ai)
- Interactive API docs (Postman) (https://www.postman.com/solar-station-884701)
- GitHub repository – core values, license, legal (https://github.com/sherado99/Stech)

## 📄 License & Disclaimer
This tool is provided for informational and communication improvement purposes only.
The creator is not liable for any consequences arising from its use.
Always review the output before sending.
