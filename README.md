```markdown
# Stech Email Tone Improver (SETI) – Bulk Email Rewriter

Turn cold, robotic, or overly formal emails into warm, professional messages in bulk.  
SETI is a single‑purpose AI tool for batch email rewriting.

- Upload CSV or JSON  
- Choose a tone per email  
- Get a clean CSV/JSON export in seconds  
- No data is stored – just efficient, professional results

---

## Key features

- Batch processing – rewrite 1 to 1,000+ emails in one run  
- Flexible input – upload a CSV file or paste a JSON array  
- Per‑email tone – warm, empathetic, friendly, encouraging, professional‑warm  
- High concurrency – process up to 20 emails at once  
- Error tolerance – failed emails are logged, the rest continue  
- Structured output – JSON or CSV with status, timestamp and error info  
- Stateless & private – no email content is ever stored

---

## Input methods

### 1. CSV upload (easiest for batch workloads)

Your CSV needs an `originalEmail` column.  
Optional columns: `targetTone` and `additionalInstructions`.

Example CSV content:
```

originalEmail,targetTone,additionalInstructions
"Dear Sir, your application has been rejected.",empathetic,"Keep it under 30 words"
"Your order #12345 is delayed.",warm,"Apologize and offer a discount"
"We have decided not to proceed with your proposal.",friendly,"Thank them for their time"

```

### 2. JSON array (for API and advanced users)

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

---

## Output

After the run you get a structured dataset (JSON/CSV).  
Each row contains:

- originalEmail – the email you provided  
- improvedEmail – the rewritten, warmer version (null on error)  
- toneUsed – the tone that was applied  
- status – success or error  
- error – error message (if any)  
- timestamp – processing timestamp (ISO 8601)

Example output (JSON):
```

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

## Advanced settings

- Default Tone – fallback tone when not specified per email (default: warm and honest)  
- Max Concurrency – number of emails processed in parallel 1‑20 (default: 5)  
- Timeout (seconds) – maximum wait time per email request (default: 60)

---

## Sample workflow (HR manager)

1. Export candidate list from your ATS to a CSV file  
2. Keep the column with the rejection email (or create one)  
3. Add extra columns `targetTone` (set to empathetic) and `additionalInstructions` (optional)  
4. Save the file  
5. Visit the SETI Actor page, upload the CSV, click Run  
6. Wait a few seconds, download the output CSV  
7. Copy the `improvedEmail` column into your email client and send

---

## Notes & risks

- Always review the rewritten email before sending – AI can make mistakes  
- Stech does not give legal, medical or financial advice  
- No email content is stored – emails are processed in memory and never persisted  
- The public endpoint may throttle heavy usage – use the internal endpoint for production batches  
- Failed rows are flagged with `status: error`; you can retry them later

---

## Links

- Stech API on RapidAPI  
- Interactive API docs (Postman)  
- GitHub repository – core values, license, legal

---

## License & Disclaimer

This tool is provided for informational and communication improvement purposes only.  
The creator is not liable for any consequences arising from its use.  
Always review the output before sending.

Stech – professional, efficient, and never pretends to be human.
```