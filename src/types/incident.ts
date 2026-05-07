export type Urgency = "Low" | "Medium" | "Critical";

export type IncidentStatus =
  | "Open"
  | "AI_Approved"
  | "Human_Overridden"
  | "Resolved";

export interface VipIncident {
  id: string;
  created_at: string;
  staff_name: string;
  client_tier: string;
  raw_incident_text: string;
  ai_issue_type: string | null;
  ai_urgency: Urgency | null;
  ai_suggested_action: string | null;
  ai_reasoning: string | null;
  ai_confidence: number | null;
  status: IncidentStatus;
  final_action_taken: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
}

export interface AiTriageResult {
  client_tier: string;
  issue_type: string;
  urgency: Urgency;
  suggested_action: string;
  reasoning: string;
  confidence_score: number;
}
