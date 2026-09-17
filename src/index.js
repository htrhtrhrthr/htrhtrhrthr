export default {
  async fetch(request, env, ctx) {
    const url =
      "https://shop.funbox.com.tw/collections/all";

    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          "Accept": "text/html,application/xhtml+xml"
        }
      });

      const html = await response.text();

      function count(keyword) {
        return (html.match(new RegExp(keyword, "gi")) || []).length;
      }

      function snippets(keyword, before = 700, after = 1600, max = 5) {
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

      return new Response(
        JSON.stringify(
          {
            ok: response.ok,
            status: response.status,
            finalUrl: response.url,
            htmlLength: html.length,

            keywordCounts: {
              所有商品: count("所有商品"),
              加入購物車: count("加入購物車"),
              售完: count("售完"),
              product: count("product"),
              NT: count("NT\\$")
            },

            snippets: {
              所有商品: snippets("所有商品"),
              加入購物車: snippets("加入購物車"),
              售完: snippets("售完"),
              product: snippets("product")
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
    console.log("Funbox collections-all diagnostic triggered");
  }
};
