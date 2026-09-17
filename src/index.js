export default {
  async fetch(request, env, ctx) {
    const url =
      "https://shop.funbox.com.tw/products/bbpr08914";

    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          "Accept": "text/html,application/xhtml+xml"
        }
      });

      const html = await response.text();

      function snippets(keyword, before = 1200, after = 2600, max = 8) {
        const results = [];
        let position = 0;

        while (results.length < max) {
          const index = html.indexOf(keyword, position);

          if (index === -1) break;

          results.push(
            html
              .slice(
                Math.max(0, index - before),
                Math.min(html.length, index + after)
              )
              .replace(/\s+/g, " ")
          );

          position = index + keyword.length;
        }

        return results;
      }

      function count(keyword) {
        return (html.match(new RegExp(keyword, "gi")) || []).length;
      }

      return new Response(
        JSON.stringify(
          {
            ok: response.ok,
            status: response.status,
            finalUrl: response.url,
            htmlLength: html.length,

            counts: {
              productId69274378: count("69274378"),
              variantId84404918: count("84404918"),
              inventory_quantity_status: count("inventory_quantity_status"),
              available: count("available"),
              isAvailable: count("isAvailable"),
              inventory_quantity: count("inventory_quantity"),
              soldOut: count("sold.?out"),
              售完: count("售完")
            },

            snippets: {
              variant84404918: snippets("84404918"),
              product69274378: snippets("69274378"),
              inventory_quantity_status:
                snippets("inventory_quantity_status"),
              isAvailable: snippets("isAvailable"),
              available: snippets("available"),
              inventory_quantity: snippets("inventory_quantity")
            }
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
    console.log("Funbox variant diagnostic triggered");
  }
};
