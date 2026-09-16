export default {
  async fetch(request, env, ctx) {
    const url =
      "https://shop.funbox.com.tw/category_products/takaratomy/beyblade.json?limit=18&page=1&sort_by=sell_from-desc";

    try {
      const response = await fetch(url, {
        headers: {
          "Accept": "application/json"
        }
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        return Response.json({
          ok: false,
          status: response.status,
          error: "Funbox 回傳的不是 JSON",
          preview: text.slice(0, 1000)
        });
      }

      const result = {
        ok: response.ok,
        status: response.status,
        topLevelType: Array.isArray(data) ? "array" : typeof data,
        topLevelKeys:
          data && typeof data === "object"
            ? Object.keys(data)
            : [],
        preview: data
      };

      return new Response(JSON.stringify(result, null, 2), {
        headers: {
          "content-type": "application/json; charset=UTF-8"
        }
      });

    } catch (error) {
      return Response.json({
        ok: false,
        error: String(error)
      });
    }
  },

  async scheduled(event, env, ctx) {
    console.log("Funbox diagnostic cron triggered");
  }
};
