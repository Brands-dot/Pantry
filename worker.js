export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/test") {
      if (!env.GEMINI_API_KEY) {
        return new Response("GEMINI_API_KEY is NOT available", {
          status: 500
        });
      }

      return new Response("GEMINI_API_KEY is available");
    }

    return env.ASSETS.fetch(request);
  }
};
