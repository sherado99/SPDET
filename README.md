```markdown
# Stech Email Tone Improver (SETI) – Batch Edition

Rewrite cold, robotic, or overly formal emails into **warm, professional, and human‑sounding** messages using Stech AI.

> SETI is a high‑throughput tool (Single Purpose AI) that focuses on one task: making your emails warmer. It processes batches of 1–1,000+ emails in a single run. No data is stored. No fake empathy. Just results.

---

## 🎯 Who is this for?

- **HR teams** – send rejection emails that are respectful and efficient, not cold.
- **Customer support** – turn robotic replies into professional responses.
- **Sales** – personalize follow‑ups without sounding like a spam bot.
- **Anyone** who wants to communicate with warmth and professionalism.

---

## ✨ What can SETI do?

| Feature | Description |
|---------|-------------|
| **Batch processing** | Rewrite **1 to 1,000+ emails** in one run. |
| **Flexible input** | Upload a CSV file **or** paste a JSON array. |
| **Per‑email tone** | Choose tone per email (warm, empathetic, friendly, etc.). |
| **Concurrent processing** | Process up to 20 emails at once to save time. |
| **Error tolerance** | If one email fails, the rest continue. Errors are logged. |
| **Structured output** | Results are returned as JSON or CSV with status, timestamp, and error info. |
| **Stateless & private** | No email content is stored. Your data only passes through. |

---

## 📥 How to provide input

You can give SETI a list of emails in **two ways**:

### 1. Upload a CSV file (recommended for many emails)

Create a `.csv` file with the following columns:

| Column | Required | Description |
|--------|----------|-------------|
| `originalEmail` | ✅ Yes | The exact email text you want to rewrite. |
| `targetTone` | ❌ No | Tone for this email. Options: `warm and honest`, `friendly`, `empathetic`, `encouraging`, `professional-warm`. Default = `warm and honest`. |
| `additionalInstructions` | ❌ No | Extra guidance, e.g., "make it shorter", "add an apology". |

**Example CSV content:**
```csv
originalEmail,targetTone,additionalInstructions
"Dear Sir, your application has been rejected.",empathetic,"Keep it under 30 words"
"Your order #12345 is delayed.",warm,"Apologize and offer a discount"
"We have decided not to proceed with your proposal.",friendly,"Thank them for their time"
```

Then upload this file using the CSV File field in the Actor input form.

2. Provide a JSON array (for API or advanced users)

If you prefer JSON, use the Emails Array field with this structure:

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

📤 What you get as output

After running, SETI produces a structured list (JSON) that you can download as CSV. Each item contains:

Field Description
originalEmail The email you sent.
improvedEmail The rewritten, warmer version (or null if error).
toneUsed The tone that was applied.
status success or error.
error Error message (if any).
timestamp When the rewrite was done.

Example output (JSON):

```json
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

You can export this output as CSV from the Apify dataset.

---

⚙️ Advanced settings (optional)

Parameter Description Default
Default Tone Fallback tone if not specified per email. warm and honest
Max Concurrency How many emails to process at once (1–20). Higher is faster but may hit rate limits. 5
Timeout (seconds) Max wait per email request. 60

---

🧪 Example workflow for an HR manager

You have 50 rejection emails to send. You don't want to copy‑paste each one.

1. Export your candidate list from your ATS (Applicant Tracking System) to a CSV file.
2. Open the CSV, keep the column with the rejection email text (or create one).
3. Add two extra columns: targetTone (set to empathetic) and additionalInstructions (optional).
4. Save the file.
5. Go to the SETI Actor page, upload the CSV, click Run.
6. Wait a few seconds. Download the output CSV.
7. Copy the improvedEmail column into your email client and send.

Time saved: hours → minutes.

---

❗ Important notes & risks

· Output must be reviewed – Always read the rewritten email before sending. AI can make mistakes.
· No legal/medical/financial advice – Stech is not a professional advisor.
· Stateless – No email content is stored. The output stays in your Apify dataset until you delete it.
· Rate limits – The public endpoint without a secret may hit usage limits. For batch processing, use the internal endpoint (already configured in this Actor).
· Errors – Some emails may fail (e.g., network issues, malformed input). Those will be marked with status: error. Retry them later.

---

🔗 Links

· Stech API on RapidAPI – for production API access
· Postman Documentation – test the API directly
· GitHub Repository – core values, license, legal

---

📄 License & Disclaimer

This Actor is provided for informational and communication improvement purposes only.
Stech does not give financial, legal, or medical advice. Always review the output before sending.
By using this Actor, you agree that the creator is not liable for any consequences arising from its use.

---

Stech – professional, efficient, and never pretends to be human. 😊🌿

```