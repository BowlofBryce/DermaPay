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
    // Create client with user's token for authentication
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: userError } = await authClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create service role client for database operations (bypasses RLS)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get merchant for this user
    const { data: merchant, error: merchantError } = await supabase
      .from("merchants")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (merchantError || !merchant) {
      return new Response(
        JSON.stringify({ error: "Merchant not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { mode, amount, note, feePayer } = await req.json();

    if (!mode || !amount || !feePayer) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Calculate customer charged amount
    let customerChargedAmount = amount;
    if (feePayer === "customer") {
      customerChargedAmount = Math.round(amount * 1.03);
    }

    // Generate secure payment ID and short link
    const paymentId = crypto.randomUUID();
    const shortId = paymentId.substring(0, 8);
    const checkoutUrl = `https://pay.dermapay.com/${shortId}`;

    // Create payment in database
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        id: paymentId,
        merchant_id: merchant.id,
        amount,
        fee_payer: feePayer,
        customer_charged_amount: customerChargedAmount,
        mode,
        status: "pending",
        note: note || null,
        checkout_url: checkoutUrl,
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Payment creation error:", paymentError);
      return new Response(
        JSON.stringify({ error: "Failed to create payment" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        id: payment.id,
        checkoutUrl,
        amount,
        customerChargedAmount,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});