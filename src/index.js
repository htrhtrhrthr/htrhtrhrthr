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

      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

      const count = (word) => {
        return (html.match(new RegExp(word, "gi")) || []).length;
      };

      return new Response(
        JSON.stringify(
          {
            ok: response.ok,
            status: response.status,
            finalUrl: response.url,
            contentType: response.headers.get("content-type"),
            htmlLength: html.length,

            title: titleMatch
              ? titleMatch[1].replace(/\s+/g, " ").trim()
              : null,

            keywordCounts: {
              beyblade: count("beyblade"),
              戰鬥陀螺: count("戰鬥陀螺"),
              加入購物車: count("加入購物車"),
              售完: count("售完"),
              soldOut: count("sold.?out"),
              product: count("product")
            },

            preview: html
              .slice(0, 4000)
              .replace(/\s+/g, " ")
          },
          null,
          2
        ),
        {
          headers: {
            "content-type": "application/json; charset=UTF-8"
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
    console.log("Funbox HTML diagnostic cron triggered");
  }
};
