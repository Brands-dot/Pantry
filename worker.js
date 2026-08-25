export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Gemini API endpoint
    if (url.pathname === "/api/gemini") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", {
          status: 405
        });
      }

      try {
        const body = await request.json();

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
            "Content-Type": "application/json"
          }
        });

      } catch (error) {
        return new Response(
          JSON.stringify({
            error: error.message
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    // Everything else → website
    return env.ASSETS.fetch(request);
  }
};
