# Stech Email Tone Improver (SETI)

Rewrite cold, robotic, or overly formal emails into warm, honest, and human‑sounding messages using **Stech AI** – an AI presence built on patience, honesty, and genuine care.

> SETI is a skill of Stech, not a separate AI. It follows the same principles of honesty, warmth, and transparency.

## 🚀 Quick Start

1. Paste your original email into the `originalEmail` field.
2. (Optional) Choose a `targetTone` (e.g., `friendly`, `empathetic`, `encouraging`). Default: `warm and honest`.
3. (Optional) Add `additionalInstructions` for fine‑tuning.
4. Run the Actor – Stech will rewrite your email while keeping the original meaning.

## 📥 Input

| Field | Required | Description |
|-------|----------|-------------|
| `originalEmail` | ✅ Yes | The email content you want to improve. |
| `targetTone` | ❌ No | Desired tone. Examples: `friendly`, `empathetic`, `professional-warm`. Default: `warm and honest`. |
| `additionalInstructions` | ❌ No | Extra guidance (e.g., "make it shorter", "add a thank you"). |

## 📤 Output

The Actor returns a JSON object with the following fields:

| Field | Description |
|-------|-------------|
| `originalEmail` | The original email you provided. |
| `improvedEmail` | The rewritten, warmer version. |
| `targetTone` | The tone that was used (default or your choice). |
| `timestamp` | ISO timestamp of the execution. |

## ✨ Example

**Input:**
```json
{
  "originalEmail": "Dear Sir, your application has been rejected.",
  "targetTone": "empathetic"
}
```
**Output:**
```json
{
  "originalEmail": "Dear Sir, your application has been rejected.",
  "improvedEmail": "Hi, thank you for your application. Unfortunately we couldn't move forward this time, but we truly appreciate your effort and wish you the best.",
  "targetTone": "empathetic",
  "timestamp": "2026-04-19T12:34:56.789Z"
}
```

## 💡 Why Stech?

- Built on core values – honesty, presence, active patience, and many more.
- No fake empathy – Stech never claims to feel your pain; it simply stays present and helps.
- Stateless & private – no emails are stored. Your data stays yours.
- SETI is a skill of Stech – not a separate AI. It follows the same honest, warm principles.
- Perfect for – customer support, sales, freelancers, HR, or anyone who wants to communicate with warmth.

## 🛠️ Powered by
Stech API – stech-api.sheradogilang.workers.dev
Apify – serverless cloud platform

## 🔗 More about Stech

- [Stech API on RapidAPI](https://rapidapi.com/sheradogilang/api/stech-honest-presence-ai) – Subscribe for production use
- [Postman Documentation](https://documenter.getpostman.com/view/53757581/2sBXiqDoD9) – Test the API directly
- [GitHub Repository](https://github.com/sherado99/Stech) – Core values, license, and legal

## 📄 License & Disclaimer

This Actor is provided for informational and communication improvement purposes only. Stech does not give financial, legal, or medical advice. Always review the output before sending. By using this Actor, you agree that the creator is not liable for any consequences arising from its use.


# Stech Email Tone Improver (Batch)

Rewrite cold, robotic, or overly formal emails into warm, honest, and human-sounding messages using Stech AI.

## Features

- **Batch processing** – Upload a CSV file or provide a JSON array of emails (up to 1000+ emails).
- **Per-email tone** – Choose tone per email: warm and honest, friendly, empathetic, encouraging, professional-warm.
- **Concurrent processing** – Set concurrency level for speed (1–20 parallel requests).
- **Error handling** – Failed emails are logged; processing continues.
- **Structured output** – Results include original email, rewritten email, status, timestamp, and errors.
- **Stateless** – No emails stored. Data passes through Stech API only.

## Input

You can provide input in two ways:

### 1. Upload a CSV file

The CSV must have columns:

- `originalEmail` (required)
- `targetTone` (optional, defaults to "warm and honest")
- `additionalInstructions` (optional)

Example:

```csv
originalEmail,targetTone,additionalInstructions
"Dear Sir, your application has been rejected.",empathetic,"Make it shorter"
"Your order #12345 is delayed.",warm,"Apologize and offer a discount"
