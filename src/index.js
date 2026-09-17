export default {
  async fetch(request, env, ctx) {
    const url =
      "https://shop.funbox.com.tw/products/bbpr08914";

    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "manual",
        headers: {
          "User-Agent":
            "FunboxStockMonitor/1.0 (private personal stock check)",
          "Accept":
            "text/html,text/plain;q=0.9"
        },
        signal: AbortSignal.timeout(20000)
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
            contentType: response.headers.get("content-type"),
            bodyLength: body.length,
            containsProductId: body.includes("69274378"),
            containsVariantId: body.includes("84404918"),
            containsInventoryStatus:
              body.includes("inventory_quantity_status"),
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
    console.log(
      "Funbox User-Agent diagnostic triggered"
    );
  }
};
