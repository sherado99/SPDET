<div align="center"><img width="250" height="250" alt="584325247-47a61f20-0f15-4904-8961-f24321100ac5" src="https://github.com/user-attachments/assets/a2564306-ad9b-464d-9a8f-01864b36d22e" /></div>


## Stech Presence Driven Email Transformer (SPDET)

Transform cold, robotic, or overly formal emails into warm, honest, and professional messages — each one refined individually through genuine, ethical connection. Capable of processing many emails while maintaining impact and integrity.

SPDET is a single‑purpose AI (SPAI) Actor on the Apify Store that focuses on one task: making your emails warmer, more honest, and more effective. It processes batches of 1 to 1,000+ emails per run, accepts CSV or JSON input, lets you pick a different tone for each email, and exports polished results immediately. No data is stored; no fake empathy; just professional, reliable output.

> **Market context:** The AI‑powered email assistant market is projected to grow from $2.11 billion in 2025 to $2.56 billion in 2026 at a CAGR of 21.2%, while the broader AI writing assistant market is expected to reach $8.3 billion by 2030. The demand for ethical, non‑manipulative AI communication tools is a significant and underserved segment within this market.

---

## 🎯 Who SPDET Is For

SPDET helps anyone who wants to send better, more human emails without spending hours rewriting them.

- **HR & Recruitment** – send rejection emails that are empathetic and respectful, not cold. Ideal for high‑volume ATS workflows.
- **Customer Support** – turn robotic, template‑based replies into caring, helpful responses that build customer loyalty.
- **Sales & Marketing** – personalize follow‑ups and cold outreach without sounding like a spam bot.
- **Anyone** who values professional, warm, and honest communication.

**No coding skills are required.** If you can use a spreadsheet, you can use SPDET.

---

## 📣 From Cold to Compassionate: Who Really Uses SPDET?

In many HR departments, the pressure to process hundreds of applications quickly turns rejection emails into cold, robotic templates. This leaves candidates feeling disrespected and damages the company's reputation. SPDET fixes this by being the bridge between efficient HR workflows and genuine human courtesy.

**Here is how rejection flows without SPDET:**
1. An HR manager exports a list of rejected candidates from their ATS (Applicant Tracking System).
2. They are forced to send out a generic, cold template: *"Dear applicant, your application has been rejected."*
3. Candidates feel like just another number in a database.
4. **Result:** The company's reputation as a caring employer is quietly eroded, and candidates are less likely to reapply or recommend the company.

**Here is how rejection flows with SPDET (the ideal workflow):**
1. An HR manager exports their candidate list to a CSV file, including names and the job title they applied for.
2. They upload the CSV to SPDET and select the `empathetic` tone.
3. SPDET transforms a cold *"Dear applicant, your application has been rejected."* into a warm, personalized message that thanks the candidate for their time and encourages them to apply for future roles.
4. **Result:** Even in rejection, the candidate feels respected and valued. The company's reputation for being human-centric is strengthened, and a positive relationship is maintained for future opportunities.

---

**Why this matters:**
- **For HR Managers:** You can process hundreds of rejections in seconds without sacrificing empathy for efficiency.
- **For Candidates:** You receive a response that acknowledges your effort, not a soul-crushing template.
- **For the Company:** Every single email becomes an opportunity to show that you put people over paperwork.

---

## ⚙️ Two Ways to Use SPDET

SPDET is a published Apify Actor, which means it can work either as a simple tool or as part of a larger automated workflow.

| **As a SPAI (Tool)** | **As a Component of an AI Agent** |
| :--- | :--- |
| **How it works:** You provide the emails (CSV/JSON/Apify Input) and SPDET rewrites them. It's a straightforward, one‑click batch process. | **How it works:** An AI Agent (built with n8n, Make, Zapier, LangChain, or CrewAI) detects that a cold email needs a warmer reply and calls SPDET as one of its tools. |
| **Best for:** Quick, manual batch processing. No setup needed—upload a file and get results in seconds. | **Best for:** Fully automated workflows. For example, an AI Agent that monitors your inbox, decides which emails need a warm reply, and rewrites them with SPDET. |
| **Goal:** Maximum simplicity for non‑technical users. | **Goal:** Maximum flexibility for developers and advanced users. |
| **How to get started:** Upload a CSV or JSON on the Apify Actor page. | **How to get started:** Connect SPDET to **n8n, Make, or Zapier**, link your Gmail account, and build your automated workflow in minutes. |

---

## 🔗 How to Turn SPDET into an AI Agent (for non‑technical users)

You can turn SPDET into a **fully autonomous AI Agent** that monitors your inbox, rewrites incoming emails, and sends warm replies—all without manual work.

**What you need:**
- An Apify account (free tier available)
- A Gmail account (or any email provider supported by your integration platform)
- An n8n, Make, or Zapier account (free trials available for all)

**How it works:**
1. **Connect your Gmail** – grant access to the platform (n8n, Make, or Zapier) so it can read incoming emails and send replies on your behalf.
2. **Add SPDET as the rewriting step** – the platform sends the raw email text to SPDET, and SPDET returns the warmer, more professional version.
3. **Activate the workflow** – once turned on, every incoming email that matches your criteria will be automatically rewritten and replied to.

**No coding required.** Just a few clicks to connect your email and SPDET. The platform handles the rest. A complete n8n workflow example is available in the Apify integration guide.

---

## 🚀 Key Features

- **Batch processing** – rewrite 1 to 100+ emails in a single run
- **Flexible input** – upload a CSV file or paste a JSON array
- **Per‑email tone** – choose from `warm and honest`, `friendly`, `empathetic`, `encouraging`, `professional‑warm` for each email
- **Personalization** – optionally include `recipientName`, `senderName`, and `recipientEmail` for personalized emails
- **High concurrency** – process up to 20 emails simultaneously to save time
- **Error tolerance** – if one email fails, the rest continue uninterrupted; all errors are logged
- **Structured output** – get JSON or CSV with all fields for every entry
- **Stateless & private** – no email content is ever stored on any server; your data passes through and is immediately discarded

---

## 📥 Input Methods

### 1. CSV Upload (easiest for batch workloads)

Create a CSV file with at least an `originalEmail` column.

| Column | Required | Description |
|--------|:--------:|-------------|
| `originalEmail` | ✅ | The email text to rewrite. |
| `targetTone` | ❌ | Tone for this email (`warm and honest`, `friendly`, `empathetic`, `encouraging`, `professional‑warm`). Default = `warm and honest`. |
| `additionalInstructions` | ❌ | Extra guidance (e.g. "make it shorter", "add an apology"). |
| `originalSubject` | ❌ | Email subject line. **Never changed by SPDET.** Included for reference and ATS compatibility. |
| `recipientName` | ❌ | Recipient's name. If provided, SPDET will use it in the greeting. |
| `senderName` | ❌ | Sender's name. If provided, SPDET will use it to sign the email. |
| `recipientEmail` | ❌ | Recipient's email address. Carried through to output for ATS compatibility. |

> 💡 **Just use your existing file.** If your company's CSV already has columns like `name`, `email`, or `subject`, you can either rename them or keep them. SPDET automatically recognizes common column names (`email`, `recipient_email`, `name`, `recipient`, `sender`, etc.) and maps them correctly.

**Example CSV content**
```csv
originalEmail,targetTone,additionalInstructions,originalSubject,recipientName,senderName,recipientEmail
"Dear Sir, your application has been rejected.",empathetic,"Keep it under 30 words",Application Status,John,HR Team,john@example.com
"Your order #12345 is delayed.",warm,"Apologize and offer a discount",Order Delay,Sarah,Customer Support,sarah@example.com
"We have decided not to proceed with your proposal.",friendly,"Thank them for their time",Proposal Update,Alex,Sales Team,alex@example.com
Upload this file using the CSV File field in the Actor input form.
```

## 2. JSON Array (for API & advanced users)
```json
[
  {
    "originalEmail": "Dear Sir, your application has been rejected.",
    "targetTone": "empathetic",
    "additionalInstructions": "Keep it under 30 words",
    "originalSubject": "Application Status",
    "recipientName": "John",
    "senderName": "HR Team",
    "recipientEmail": "john@example.com"
  },
  {
    "originalEmail": "Your order #12345 is delayed.",
    "targetTone": "warm",
    "recipientName": "Sarah",
    "senderName": "Customer Support"
  }
]
```

## 📤 Output
After the run, you get a structured dataset (JSON/CSV). Each row contains:
- Field	Description
- originalEmail	The email you provided.
- improvedEmail	The rewritten, warmer version (null on error). Personalized if names were provided.
- toneUsed	The tone that was applied.
- status	success or error.
- error	Error message (if any).
- timestamp	Processing timestamp (ISO 8601).
- originalSubject	The subject line you provided (if any). Carried through unchanged.
- recipientName	The recipient name you provided (if any).
- senderName	The sender name you provided (if any).
- recipientEmail	The recipient email you provided (if any).

## Example output (JSON):
```json
[
  {
    "originalEmail": "Dear Sir, your application has been rejected.",
    "improvedEmail": "Dear John,\n\nThank you for taking the time to apply. We received many applications and unfortunately, we won't be moving forward this time. We wish you the best in your search.\n\nBest regards,\nHR Team",
    "toneUsed": "empathetic",
    "status": "success",
    "timestamp": "2026-04-21T10:30:00.000Z",
    "originalSubject": "Application Status",
    "recipientName": "John",
    "senderName": "HR Team",
    "recipientEmail": "john@example.com"
  }
]
```
You can download the dataset as CSV directly from the Apify Console, or access it programmatically via the Apify API.

## ⚙️ Advanced Settings
- Parameter	Description	Default
- Default Tone	Fallback tone when not specified per email.	warm and honest
- Max Concurrency	Number of emails processed in parallel (1‑20).	5
- Timeout (seconds)	Maximum wait time per email request.	60

## 🔌 Integrations (Built‑in by Apify)
Because SPDET is a published Apify Actor, it automatically appears in the integration catalogs of:

- n8n – connect SPDET to hundreds of apps without code.
- Make – drag‑and‑drop SPDET into automated workflows.
- Zapier – trigger SPDET from thousands of events.
- Gmail and Google Drive – send results as email attachments or save directly to your drive.
- Slack – get notified when a run finishes.
- GitHub – create issues automatically when a run fails.
- LangChain and LlamaIndex – use SPDET as a tool inside your custom AI agents.
- No extra setup is required from the developer. The integrations are ready to use directly from the Apify Actor page. Users simply authenticate with their own accounts and select SPDET from the list of available Actors.
- Example no‑code workflow (Zapier + Gmail):
- New email arrives in Gmail.
- Zapier sends the email text to SPDET.
- SPDET rewrites the email with warmth and professionalism.
- Zapier sends the rewarmed reply back via Gmail.
- Just a few clicks — you never touch a single line of code.

## 🧪 Sample Workflow (HR Manager)
- Export candidate list from your ATS (Applicant Tracking System) to a CSV file.
- Keep the column with the rejection email (or create one).
- Add extra columns: targetTone (set to empathetic), recipientName, recipientEmail, and additionalInstructions (optional).
- Save the file.
- Visit the SPDET Actor page on Apify Store, upload the CSV, click Run.
- Wait a few seconds, then download the output CSV.
- Copy the improvedEmail column into your email client and send.
- Time saved: hours → minutes. Brand impression: transformed.

## ❌ Not a Bulk Processor

SPDET is not a mass-mailing tool. It does not take a single template and spray it to thousands of recipients. Each email is individually refined through the Stech Core API, ensuring ethical, honest, and personalized output. We deliver the value of genuine human connection, not just the quantity of messages processed.


## ❗ Notes & Risks
- Always review the rewritten email before sending. AI can make mistakes, and the final responsibility for the message rests with the sender.
- No legal, medical, or financial advice – Stech is not a professional advisor; the output is for language improvement only.
- No data storage – emails are processed in memory and never persisted; once a run is complete, the data is available only in your dataset until you delete it.
- Rate limits – the public endpoint may throttle heavy usage; for production batch workloads, use the internal endpoint (already configured in this Actor).
- Failed rows are flagged with status: error in the output; you can retry them after addressing the cause (e.g., network timeout, malformed input).
- Apify charges – as a Pay Per Event Actor, each processed result incurs a small fee, which is displayed transparently to the user before the run starts. The first 5 seconds of each run are free.

## 🔗 Links
- SPDET on Apify Store – run SPDET directly in your browser
- Stech API on RapidAPI – for production API access with higher rate limits
- Interactive API Documentation (Postman) – explore and test the API endpoints directly
- GitHub Repository – core values, license, and legal information

## 📄 License & Disclaimer
- This Actor is provided for informational and communication improvement purposes only.
- Stech does not give financial, legal, or medical advice. Always review the output before sending.
- By using this Actor, you agree that the creator is not liable for any consequences arising from its use.

All rights are reserved under the Stech Commercial License (SCL) v2.1.

---

Stech – honest, warm, and never pretends to be human. 😊🌿
