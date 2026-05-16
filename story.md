How I Built an Anti-Hallucination Email Transformer Using an Apify Actor

From a Single Prompt to Guaranteed Data Integrity, All Running on Stateless Infrastructure

---

Checkpoint: Human to human.

Before diving into architecture and code, I need to say this: SPDET was born from a simple belief. That every communication—even a rejection—deserves to be delivered with respect. AI should not fabricate to please. It should be present, honest, and know when to stay silent. Because behind every email, there is a human reading. This foundation cannot be sacrificed for the sake of efficiency.

---

The Problem: Cold Emails, Hallucinating AI

Every day, HR teams, customer support, and sales professionals send dozens of sensitive emails: job rejections, apologies, project delays. Generic templates feel cold and damage relationships. AI can help, but AI also hallucinates—adding false promises, imaginary discounts, or unsolicited "we're here to help" lines.

What if we could have an AI tool that:

· Transforms stiff emails into professional and human-sounding messages.
· Never adds fabricated information.
· Processes emails in bulk.
· Produces ready-to-use outputs (JSON, DOCX, PDF).
· Is completely stateless—data is processed and immediately deleted.

That's why SPDET (Stech Presence-Driven Email Transformer) was born.

Architecture: Why I Separated the "Brain" and the "Hands"

Instead of building a monolith, I split the system into two entities:

· SAPI (Stech API) — a stateless REST API handling text transformation. It holds the ethical foundation (BS, R, BSR) ensuring every output is free from fabrication.
· SPDET (Apify Actor) — the technical hands that read input, call SAPI, generate DOCX/PDF, and deliver structured output.

This separation is more than architecture. It's the first guardrail against overclaiming: by separating "the thinker" from "the executor", no single component can deviate without detection.

The Most Critical Technical Decisions

1. A Deliberately Simple Prompt

The prompt in SPDET was intentionally minimal:

```
Rewrite the original message in a formal tone. Keep it concise.
```

Why not more detailed? Because the "warm and honest" character is already embedded in SAPI through its value foundation. The prompt only needs to trigger the formal mode. Without lengthy "tone" instructions, prompt contamination risk drops dramatically.

2. Cryptographic Verification for Every Output

Every email produced by SPDET comes with an auditHash — a SHA-256 hash of originalEmail + improvedEmail + timestamp. This allows anyone to verify that the email content was not altered after processing. This feature does not exist in any generic AI tool.

3. Stateless from Birth

SPDET stores no customer data. Once processed, the email is immediately wiped from memory. Outputs (DOCX, PDF) are uploaded to the Apify Key-Value Store with temporary URLs. Nothing lingers.

Who Is This For? Beyond HR

Although the initial use case was HR rejection emails, SPDET has proven equally useful for:

· Customer Support: Transforming template replies into considerate, professional responses.
· Sales: Turning cold outreach into warm, honest communication without inventing false promises.
· Operations Teams: Standardizing outbound communications across departments.
· Developers & Automation Builders: Using SPDET as a component in n8n, Make, or Zapier workflows.

One of the most illuminating moments came when I was testing the initial prompt. I wrote "rewrite this with a warm, honest, and professional tone", only to realize that telling an AI to "be honest" in a prompt is a paradox—if the system is already honest, it doesn't need to be told. This triggered the decision to move the entire ethical foundation out of the prompt and into SAPI's architecture. It was no longer an instruction. It became the system's breathing.

What I Learned

Building SPDET taught me that "warm, honest, and professional" is not a tone you can instruct in a prompt. It is a character that must be embedded into the system's foundation. Every guideline—"don't invent offers", "don't ask about feelings", "acknowledge the situation first"—is not a prompt engineering trick, but a value that lives in the architecture itself.

The result is an AI that doesn't just sound human. It acts responsibly.
