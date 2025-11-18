import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const payload = await req.json();
    
    const webhookSecret = Deno.env.get("DEPOSYT_WEBHOOK_SECRET");
    const signature = req.headers.get("x-deposyt-signature");
    
    console.log("Webhook received:", {
      eventType: payload.event_type,
      paymentId: payload.payment_id,
    });

    const { event_type, payment_id, status } = payload;

    if (!payment_id) {
      return new Response(
        JSON.stringify({ error: "Missing payment_id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let newStatus = "pending";
    if (event_type === "payment.succeeded") {
      newStatus = "paid";
    } else if (event_type === "payment.failed") {
      newStatus = "failed";
    } else if (event_type === "payment.refunded") {
      newStatus = "refunded";
    }

    const { error: updateError } = await supabaseClient
      .from("payments")
      .update({
        status: newStatus,
        deposyt_payment_id: payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq("deposyt_payment_id", payment_id);

    if (updateError) {
      console.error("Failed to update payment:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update payment" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});