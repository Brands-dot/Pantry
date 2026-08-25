export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =========================
    // CORS headers
    // =========================
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // =========================
    // Gemini API endpoint
    // =========================
    if (url.pathname === "/api/gemini") {

      // Handle CORS preflight
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders
        });
      }

      // Only allow POST
      if (request.method !== "POST") {
        return new Response(
          JSON.stringify({
            error: "Method not allowed"
          }),
          {
            status: 405,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          }
        );
      }

      try {
        const body = await request.json();

        // Send request to Gemini
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": env.GEMINI_API_KEY
            },

            body: JSON.stringify(body)
          }
        );

        const data = await response.text();

        return new Response(data, {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });

      } catch (error) {

        return new Response(
          JSON.stringify({
            error: error.message || "Worker error"
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          }
        );
      }
    }

    // =========================
    // Serve Pantry website
    // =========================
    return env.ASSETS.fetch(request);
  }
};
