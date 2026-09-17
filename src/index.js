export default {
  async fetch(request, env, ctx) {
    const url =
      "https://shop.funbox.com.tw/products/bbpr08914";

    try {
      const response = await fetch(url, {
        redirect: "manual",
        headers: {
          "Accept": "text/html,application/xhtml+xml"
        }
      });

      const body = await response.text();

      return new Response(
        JSON.stringify(
          {
            status: response.status,
            ok: response.ok,
            statusText: response.statusText,

            location: response.headers.get("location"),
            retryAfter: response.headers.get("retry-after"),
            server: response.headers.get("server"),
            cfRay: response.headers.get("cf-ray"),
            contentType: response.headers.get("content-type"),

            bodyLength: body.length,
            bodyPreview: body
              .slice(0, 1200)
              .replace(/\s+/g, " ")
          },
          null,
          2
        ),
        {
          headers: {
            "content-type":
              "application/json; charset=UTF-8"
          }
        }
      );

    } catch (error) {
      return Response.json({
        ok: false,
        error: String(error)
      });
    }
  },

  async scheduled(event, env, ctx) {
    console.log("Funbox redirect diagnostic triggered");
  }
};
