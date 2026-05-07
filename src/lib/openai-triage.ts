import OpenAI from "openai";
import type { AiTriageResult } from "@/types/incident";

function getOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const TRIAGE_SCHEMA = {
  type: "object" as const,
  properties: {
    client_tier: {
      type: "string" as const,
      description:
        "Normalized client tier (e.g. First Class, Business, Platinum, Gold, Silver)",
    },
    issue_type: {
      type: "string" as const,
      description:
        "Categorized issue type (e.g. Medical, Security, Service Failure, Luggage, Delay, Complaint)",
    },
    urgency: {
      type: "string" as const,
      enum: ["Low", "Medium", "Critical"],
      description: "Urgency level assessed from the incident details",
    },
    suggested_action: {
      type: "string" as const,
      description:
        "Concrete next-step action for the Duty Manager to consider",
    },
    reasoning: {
      type: "string" as const,
      description:
        "Transparent chain-of-thought explaining why this urgency and action were chosen",
    },
    confidence_score: {
      type: "number" as const,
      description:
        "Model's self-assessed confidence in this triage (0.0 to 1.0)",
    },
  },
  required: [
    "client_tier",
    "issue_type",
    "urgency",
    "suggested_action",
    "reasoning",
    "confidence_score",
  ],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `You are an expert VIP incident triage agent for a luxury hospitality and aviation company called OmniLink.

Your job is to analyze a raw incident report from ground staff and produce a structured triage assessment.

Guidelines:
- Normalize the client tier to one of: First Class, Business, Platinum, Gold, Silver, General.
- Categorize the issue into one of: Medical, Security, Service Failure, Luggage, Delay, Complaint, VIP Request, Other.
- Assess urgency as Critical only if there is immediate risk to safety, health, reputation with a top-tier client, or severe service breakdown. Most issues are Medium. Only truly minor informational items are Low.
- Your suggested_action must be specific and actionable — not generic platitudes.
- Your reasoning must explain the key factors that drove your urgency and action decisions so a Duty Manager can quickly validate.
- Be conservative with confidence_score. Use values above 0.8 only when the report is clear and unambiguous.`;

export async function triageIncident(
  rawText: string,
  staffReportedTier: string
): Promise<AiTriageResult> {
  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Staff-reported client tier: ${staffReportedTier}\n\nIncident report:\n${rawText}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "incident_triage",
        strict: true,
        schema: TRIAGE_SCHEMA,
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }

  return JSON.parse(content) as AiTriageResult;
}
