import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface EnquiryPayload {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceRequired: string;
  estimatedBudget?: string;
  projectDescription: string;
  privacyConsent: boolean;
  honeypot?: string; // Bot trap
  idempotencyKey: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: EnquiryPayload = await req.json();

    // 1. Bot prevention via honeypot
    if (body.honeypot && body.honeypot.trim().length > 0) {
      return new Response(JSON.stringify({ error: "Invalid submission detected." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Strict Input Validation
    if (!body.fullName || body.fullName.trim().length < 2 || body.fullName.length > 100) {
      return new Response(JSON.stringify({ error: "Please provide a valid full name (2-100 characters)." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!body.email || !emailRegex.test(body.email)) {
      return new Response(JSON.stringify({ error: "Please enter a valid email address." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validServices = ["Digital Marketing", "SEO", "Mobile App Development", "Software Development"];
    if (!body.serviceRequired || !validServices.includes(body.serviceRequired)) {
      return new Response(JSON.stringify({ error: "Please select a valid service." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!body.projectDescription || body.projectDescription.trim().length < 20 || body.projectDescription.length > 3000) {
      return new Response(JSON.stringify({ error: "Project description must be between 20 and 3,000 characters." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!body.privacyConsent) {
      return new Response(JSON.stringify({ error: "You must acknowledge the privacy notice to proceed." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Idempotency Check (Prevent duplicate clicks)
    if (body.idempotencyKey) {
      const { data: existing } = await supabase
        .from("enquiries")
        .select("reference_no, created_at")
        .eq("idempotency_key", body.idempotencyKey)
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({
            success: true,
            referenceNo: existing.reference_no,
            message: "Enquiry already recorded.",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 4. Rate-Limiting Check (Max 5 submissions per 10 minutes per IP/Email)
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    const ipEncoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", ipEncoder.encode(clientIp));
    const ipHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("enquiries")
      .select("id", { count: "exact", head: true })
      .or(`ip_address_hash.eq.${ipHash},email.eq.${body.email}`)
      .gte("created_at", tenMinutesAgo);

    if (count && count >= 5) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a few moments before trying again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Insert Record
    const { data: inserted, error: insertError } = await supabase
      .from("enquiries")
      .insert({
        idempotency_key: body.idempotencyKey || null,
        full_name: body.fullName.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone?.trim() || null,
        company: body.company?.trim() || null,
        service_required: body.serviceRequired,
        estimated_budget: body.estimatedBudget || null,
        project_description: body.projectDescription.trim(),
        privacy_consent: body.privacyConsent,
        ip_address_hash: ipHash,
      })
      .select("reference_no")
      .single();

    if (insertError) {
      console.error("Database error saving enquiry:", insertError);
      return new Response(JSON.stringify({ error: "Failed to record enquiry. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 6. Optional Email Notification (Fails safely if SMTP / Resend isn't configured)
    const emailApiKey = Deno.env.get("RESEND_API_KEY");
    const adminNotifyEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL");

    if (emailApiKey && adminNotifyEmail) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${emailApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Solutions Way Portal <notifications@solutionsway.co.uk>",
            to: [adminNotifyEmail],
            subject: `New Enquiry [${inserted.reference_no}]: ${body.serviceRequired}`,
            html: `
              <h2>New Business Enquiry Received</h2>
              <p><strong>Reference:</strong> ${inserted.reference_no}</p>
              <p><strong>Name:</strong> ${body.fullName}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              <p><strong>Phone:</strong> ${body.phone || "Not provided"}</p>
              <p><strong>Company:</strong> ${body.company || "Not provided"}</p>
              <p><strong>Service:</strong> ${body.serviceRequired}</p>
              <p><strong>Budget:</strong> ${body.estimatedBudget || "Not specified"}</p>
              <hr/>
              <p><strong>Description:</strong></p>
              <p>${body.projectDescription.replace(/\\n/g, "<br/>")}</p>
            `,
          }),
        });
      } catch (mailErr) {
        console.warn("Email alert could not be delivered:", mailErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        referenceNo: inserted.reference_no,
        message: "Enquiry submitted successfully.",
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
