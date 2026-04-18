# Stech Email Tone Improver

Rewrite cold, robotic, or overly formal emails into warm, honest, and human‑sounding messages using **Stech AI** – an AI presence built on patience, honesty, and genuine care.

## 🚀 Quick Start

1. **Paste your original email** into the `originalEmail` field.
2. **(Optional)** Choose a `targetTone` (e.g., `friendly`, `empathetic`, `encouraging`). Default: `warm and honest`.
3. **(Optional)** Add `additionalInstructions` for fine‑tuning.
4. **Run the Actor** – Stech will rewrite your email while keeping the original meaning.

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
Output:

```
json
{
  "originalEmail": "Dear Sir, your application has been rejected.",
  "improvedEmail": "Hi, thank you for your application. Unfortunately we couldn't move forward this time, but we truly appreciate your effort and wish you the best.",
  "targetTone": "empathetic",
  "timestamp": "2026-04-19T12:34:56.789Z"
}
```

## 💡 Why Stech?
Not just a language model – Stech is built on 62 core values (honesty, presence, active patience).

No fake empathy – Stech never claims to feel your pain; it simply stays present and helps.

Perfect for customer support, sales, freelancers, or anyone who wants to communicate with warmth.

## 🛠️ Powered by
Stech API – stech-api.sheradogilang.workers.dev

Apify – serverless cloud platform

## 📄 License & Disclaimer
This Actor is provided for informational and communication improvement purposes only. Stech does not give financial, legal, or medical advice. Always review the output before sending.
