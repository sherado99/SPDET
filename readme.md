<div align="center"><img width="300" height="300" alt="584325247-47a61f20-0f15-4904-8961-f24321100ac5" src="https://github.com/user-attachments/assets/a2564306-ad9b-464d-9a8f-01864b36d22e" /></div>

# Stech Presence-Driven Email Transformer (SPDET)
## Transform Difficult Emails into Warm, Honest, and Professional Messages — at Scale

SPDET is a Single-Purpose AI (SPAI) Actor on the Apify Store that transforms cold, robotic, or overly formal emails into messages that remain truthful while sounding warm, respectful, and professional.

It is especially useful for sensitive communications such as:

- Job rejection emails
- Customer apologies
- Proposal declines
- Delay notifications
- Formal follow-ups

SPDET can process one email or hundreds in a single run. Each email is refined individually and returned as structured JSON, with optional downloadable DOCX and PDF files.

> **SPDET helps organizations communicate difficult messages with dignity.**

> **Unlike generic writing assistants, SPDET returns structured outputs and ready-to-download documents for immediate operational use.**

---


## 🎯 Who SPDET Is For
SPDET is designed for professionals and organizations that need to send large volumes of emails without sacrificing human warmth.
### HR & Recruitment
Send rejection emails that acknowledge the candidate's effort and help preserve employer brand.
### Customer Support
Turn template-based replies into responses that feel more considerate and professional.
### Operations Teams
Standardize outbound communications across departments.
### Sales & Consulting
Decline proposals and follow up with tact and clarity.
### Developers & Automation Builders
Use SPDET as a component in workflows built with n8n, Make, Zapier, or custom applications.


---

## 📣 Why SPDET Matters

Many organizations automate email communication to save time. However, speed often comes at the cost of human connection.
A message such as:
> "Dear applicant, we regret to inform you that your application has been rejected."
may be accurate, but it can feel cold and impersonal.


SPDET transforms the same message into something more respectful:
> "Thank you for considering our opportunity. Although we will not be moving forward at this time, we appreciate your interest and wish you the best in your future endeavors."
The decision remains unchanged.
The tone becomes more human.

---

## ⚙️ Two Ways to Use SPDET

| As a Standalone Tool | As a Workflow Component |
|----------------------|-------------------------|
| Upload CSV or JSON and process emails in batches. | Integrate SPDET into automated workflows and AI agents. |
| Best for HR teams and non-technical users. | Best for developers and operations teams. |
| No coding required. | Works with APIs and automation platforms. |

---

## 🚀 Key Features

- Warm and honest transformation — preserves the original meaning while improving tone.
- Batch processing — process 1 to 100+ emails in a single run.
- Flexible input — CSV upload or JSON array.
- Structured JSON output — ideal for automation and database storage.
- DOCX and PDF generation — ready-to-send documents for each email.
- Audit hash — each output includes a SHA-256 fingerprint to support traceability.
- Personalization — use recipient and sender names automatically.
- Error tolerance — failed rows do not stop the batch.
- Stateless processing — email content is processed and not retained by SPDET.
- Automation-ready — works seamlessly with Apify integrations.

---

## 📄 Output Formats

SPDET generates multiple output formats in a single run.

| Format | Purpose |
|--------|---------|
| JSON | API integrations and automated workflows |
| CSV | Spreadsheet review and batch export |
| DOCX | Editable documents |
| PDF | Finalized and archival copies |

> **JSON is the primary output for automation. CSV, DOCX, and PDF are supporting formats for operational use.**

---

## 📥 Input Fields

| Field | Required | Description |
|-------|:--------:|-------------|
| `originalEmail` | Yes | The email text to improve |
| `additionalInstructions` | No | Extra guidance for tone or content |
| `originalSubject` | No | Subject line retained unchanged |
| `recipientName` | No | Used in the greeting |
| `senderName` | No | Used in the signature |
| `recipientEmail` | No | Passed through for integration purposes |

---

## 📤 Example Output

```json
[
  {
    "originalEmail": "Dear applicant, we regret to inform you that your application has been rejected.",
    "improvedEmail": "Dear John,\n\nThank you for considering our opportunity. Although we appreciate your interest, we regret to inform you that your application has been rejected at this time. We encourage you to keep pursuing your goals and wish you the best in your future endeavors.\n\nBest regards,\nHR Team",
    "status": "success",
    "timestamp": "2026-05-13T16:17:17.637Z",
    "auditHash": "25849c7bcb00a34d9a72a038373000eae124a468f470ae427e52275c237114ff",
    "download_docx": "https://api.apify.com/...",
    "download_pdf": "https://api.apify.com/...",
    "originalSubject": "Application Status",
    "recipientName": "John",
    "senderName": "HR Team",
    "recipientEmail": "john@example.com"
  }
]
````

---

## 🧪 Example Workflow (HR Team)

1. Export rejected candidates from your ATS.
2. Upload the CSV to SPDET.
3. Run the Actor.
4. Download the results.
5. Send the improved emails.

What once took hours of rewriting can be completed in minutes.

---

## 🔌 Integrations

As a published Apify Actor, SPDET can be used with:

* n8n
* Make
* Zapier
* Gmail
* Google Drive
* Slack
* Custom applications via the Apify API

Users connect their own accounts and control their own workflows.

---

## ❗ Important Notes

* Always review the generated email before sending.
* SPDET improves language and tone; it does not provide legal, financial, or medical advice.
* `auditHash` supports traceability and internal audit workflows but is not a certification of regulatory compliance.
* Files remain available in your Apify run outputs until you delete them.

---

## 💼 Business Value

Organizations use SPDET to:

* Preserve employer brand
* Improve candidate and customer experience
* Standardize communication quality
* Reduce manual rewriting
* Automate sensitive messaging

---

## 📄 License

All rights reserved under the Stech Commercial License (SCL) v2.1.

---
Stech helps organizations deliver difficult messages with warmth, honesty, and professionalism.
> **Professional communication should be efficient, but it should never feel empty.**
---

Stech – honest, warm, and never pretends to be human. 😊🌿
