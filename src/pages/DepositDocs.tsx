import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react';

export function DeposytDocs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050608] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          size="small"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-gray-900 p-8 rounded-xl prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-[#f9fafb] mb-8">Deposyt Integration Documentation</h1>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#f4c064] mb-4">Overview</h2>
            <p className="text-gray-300 leading-relaxed text-lg mb-4">
              DermaPay uses Deposyt as its payments engine for ACH and optionally card processing.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              The front-end never talks directly to Deposyt. All secret API keys live on the server (edge functions).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#f4c064] mb-4">Environment Variables</h2>
            <p className="text-gray-300 leading-relaxed text-lg mb-4">
              The following environment variables must be configured in your edge functions:
            </p>
            <div className="bg-gray-800 p-6 rounded-lg mb-4">
              <code className="text-[#f9fafb] block space-y-2">
                <div><span className="text-[#f4c064]">DEPOSYT_API_BASE_URL</span> - Base URL for Deposyt's API</div>
                <div><span className="text-[#f4c064]">DEPOSYT_API_KEY</span> - Secret API key</div>
                <div><span className="text-[#f4c064]">DEPOSYT_WEBHOOK_SECRET</span> - Used to verify webhooks</div>
              </code>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded-lg">
              <p className="text-yellow-200 font-medium mb-2">Important Security Note:</p>
              <p className="text-yellow-100">
                Never expose these in client-side code. Only use them in edge functions under /api/*.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#f4c064] mb-4">Basic Payment Flow</h2>
            <div className="space-y-4 text-gray-300 text-lg">
              <div className="flex items-start">
                <span className="text-[#f4c064] font-bold mr-3">1.</span>
                <p>User in dashboard clicks "Take a Payment"</p>
              </div>
              <div className="flex items-start">
                <span className="text-[#f4c064] font-bold mr-3">2.</span>
                <p>Front-end calls POST /api/create-payment</p>
              </div>
              <div className="flex items-start">
                <span className="text-[#f4c064] font-bold mr-3">3.</span>
                <div>
                  <p className="mb-2">The edge function:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Validates the request</li>
                    <li>Calls Deposyt's API using DEPOSYT_API_KEY</li>
                    <li>Stores the result in the database (payment ID, status, URL)</li>
                    <li>Returns a simple JSON payload</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-[#f4c064] font-bold mr-3">4.</span>
                <p>Front-end shows QR code and link</p>
              </div>
              <div className="flex items-start">
                <span className="text-[#f4c064] font-bold mr-3">5.</span>
                <p>Customer completes payment on Deposyt-hosted page</p>
              </div>
              <div className="flex items-start">
                <span className="text-[#f4c064] font-bold mr-3">6.</span>
                <p>Deposyt sends a webhook to our endpoint</p>
              </div>
              <div className="flex items-start">
                <span className="text-[#f4c064] font-bold mr-3">7.</span>
                <p>Our webhook handler updates the payment status in DB</p>
              </div>
              <div className="flex items-start">
                <span className="text-[#f4c064] font-bold mr-3">8.</span>
                <p>Dashboard auto-refreshes or shows updated status</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#f4c064] mb-4">API Endpoints</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-[#f9fafb] mb-3">POST /functions/v1/create-payment</h3>
                <p className="text-gray-300 mb-3 text-lg">Creates a new payment via Deposyt</p>
                <div className="bg-gray-800 p-4 rounded-lg mb-3">
                  <p className="text-gray-400 text-sm mb-2">Request Body:</p>
                  <pre className="text-[#f9fafb] text-sm overflow-x-auto">
{`{
  "mode": "in_person" | "link",
  "amount": 10000,           // in cents
  "note": "Optional note",
  "feePayer": "merchant" | "customer"
}`}
                  </pre>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg mb-3">
                  <p className="text-gray-400 text-sm mb-2">Response:</p>
                  <pre className="text-[#f9fafb] text-sm overflow-x-auto">
{`{
  "id": "payment-id",
  "checkoutUrl": "https://pay.dermapay.com/abc123"
}`}
                  </pre>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Behavior:</p>
                  <ul className="text-gray-300 list-disc pl-6 space-y-2">
                    <li>Computes amount to charge based on feePayer (adds 3% markup if customer pays)</li>
                    <li>Calls Deposyt API: <code>POST /v1/payments</code> (placeholder endpoint)</li>
                    <li>Stores payment record in database</li>
                    <li>Returns payment ID and checkout URL</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#f9fafb] mb-3">POST /functions/v1/deposyt-webhook</h3>
                <p className="text-gray-300 mb-3 text-lg">Receives async updates from Deposyt</p>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Behavior:</p>
                  <ul className="text-gray-300 list-disc pl-6 space-y-2">
                    <li>Reads raw body and headers</li>
                    <li>Verifies signature using DEPOSYT_WEBHOOK_SECRET</li>
                    <li>Parses event type (payment.succeeded, payment.failed, etc.)</li>
                    <li>Updates internal payment record status</li>
                    <li>Returns 200 OK to Deposyt</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#f9fafb] mb-3">Example Deposyt API Call</h3>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <pre className="text-[#f9fafb] text-sm overflow-x-auto">
{`const response = await fetch(\`\${DEPOSYT_API_BASE_URL}/v1/payments\`, {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${DEPOSYT_API_KEY}\`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    amount: amountToChargeCustomer,
    currency: "USD",
    mode: mode,         // in_person or link
    metadata: { note, feePayer }
  })
});

// Deposyt returns: { id, checkoutUrl, status }`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#f4c064] mb-4">Security Notes</h2>
            <div className="bg-red-900/30 border border-red-700 p-6 rounded-lg space-y-3">
              <p className="text-red-100 text-lg">
                <strong>Critical:</strong> Deposyt API key must never be used in the browser
              </p>
              <p className="text-red-100 text-lg">
                All calls to Deposyt must go through serverless functions under /functions/v1/*
              </p>
              <p className="text-red-100 text-lg">
                Webhook must verify signatures before trusting the event
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#f4c064] mb-4">Placeholders & TODO</h2>
            <div className="bg-blue-900/30 border border-blue-700 p-6 rounded-lg">
              <p className="text-blue-100 text-lg mb-4">
                <strong>Important:</strong> The following are placeholders and must be updated with real Deposyt API documentation:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-2 text-lg">
                <li>Endpoint paths (currently <code>/v1/payments</code>)</li>
                <li>Event names (currently <code>payment.succeeded</code>, <code>payment.failed</code>)</li>
                <li>Response schemas from Deposyt API</li>
                <li>Webhook signature verification method</li>
                <li>Fee calculation methodology (currently hardcoded 3%)</li>
              </ul>
              <p className="text-blue-100 mt-4 text-lg">
                Replace these with actual values once Deposyt API documentation is available.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
