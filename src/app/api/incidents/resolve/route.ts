import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { incident_id, action, resolved_by, final_action_taken } = body;

    if (!incident_id || !action || !resolved_by) {
      return NextResponse.json(
        { error: "incident_id, action, and resolved_by are required" },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "override") {
      return NextResponse.json(
        { error: 'action must be "approve" or "override"' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    const status = action === "approve" ? "AI_Approved" : "Human_Overridden";

    let finalAction = final_action_taken;
    if (action === "approve" && !finalAction) {
      const { data: existing } = await supabase
        .from("vip_incidents")
        .select("ai_suggested_action")
        .eq("id", incident_id)
        .single();
      finalAction = existing?.ai_suggested_action ?? "Approved AI action";
    }

    const { data, error } = await supabase
      .from("vip_incidents")
      .update({
        status,
        final_action_taken: finalAction,
        resolved_by,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", incident_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update incident", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ incident: data });
  } catch (err) {
    console.error("PATCH /api/incidents/resolve error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
