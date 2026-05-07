import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { triageIncident } from "@/lib/openai-triage";
import {
  shouldEscalate,
  sendEscalationEmail,
} from "@/lib/resend-escalation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { staff_name, client_tier, raw_incident_text } = body;

    if (!staff_name || !client_tier || !raw_incident_text) {
      return NextResponse.json(
        { error: "staff_name, client_tier, and raw_incident_text are required" },
        { status: 400 }
      );
    }

    const triage = await triageIncident(raw_incident_text, client_tier);

    const supabase = createSupabaseServerClient();
    const { data: incident, error: dbError } = await supabase
      .from("vip_incidents")
      .insert({
        staff_name,
        client_tier: triage.client_tier,
        raw_incident_text,
        ai_issue_type: triage.issue_type,
        ai_urgency: triage.urgency,
        ai_suggested_action: triage.suggested_action,
        ai_reasoning: triage.reasoning,
        ai_confidence: triage.confidence_score,
        status: "Open",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save incident", details: dbError.message },
        { status: 500 }
      );
    }

    if (shouldEscalate(triage)) {
      sendEscalationEmail({
        incidentId: incident.id,
        staffName: staff_name,
        rawText: raw_incident_text,
        triage,
      }).catch((err) =>
        console.error("Escalation email failed (non-blocking):", err)
      );
    }

    return NextResponse.json({ incident }, { status: 201 });
  } catch (err) {
    console.error("POST /api/incidents error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("vip_incidents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch incidents", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ incidents: data });
  } catch (err) {
    console.error("GET /api/incidents error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
