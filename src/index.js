export default {
  async fetch(request, env, ctx) {
    const url =
      "https://shop.funbox.com.tw/categories/takaratomy/beyblade";

    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          "Accept": "text/html,application/xhtml+xml"
        }
      });

      const html = await response.text();

      function getSnippets(keyword, max = 8) {
        const results = [];
        let start = 0;

        while (results.length < max) {
          const index = html.indexOf(keyword, start);

          if (index === -1) break;

          const from = Math.max(0, index - 700);
          const to = Math.min(html.length, index + 1200);

          results.push(
            html
              .slice(from, to)
              .replace(/\s+/g, " ")
          );

          start = index + keyword.length;
        }

        return results;
      }

      const productLinks = [];
      const linkRegex =
        /href=["']([^"']*\/products\/[^"'?#]+)["']/gi;

      let match;

      while (
        (match = linkRegex.exec(html)) !== null &&
        productLinks.length < 30
      ) {
        let link = match[1];

        if (link.startsWith("/")) {
          link = "https://shop.funbox.com.tw" + link;
        }

        if (!productLinks.includes(link)) {
          productLinks.push(link);
        }
      }

      const productIds = [];
      const idRegex =
        /(?:product[_-]?id|data-product-id)["'=:\s]+(\d{5,})/gi;

      while (
        (match = idRegex.exec(html)) !== null &&
        productIds.length < 30
      ) {
        if (!productIds.includes(match[1])) {
          productIds.push(match[1]);
        }
      }

      return new Response(
        JSON.stringify(
          {
            ok: response.ok,
            status: response.status,
            htmlLength: html.length,

            productLinksFound: productLinks.length,
            productLinks,

            productIdsFound: productIds.length,
            productIds,

            snippets: {
              addToCart: getSnippets("加入購物車"),
              soldOutChinese: getSnippets("售完"),
              productId: getSnippets("product_id"),
              productsPath: getSnippets("/products/")
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
    console.log(
      "Funbox product structure diagnostic triggered"
    );
  }
};
