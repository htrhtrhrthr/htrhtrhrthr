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

      function snippets(keyword, before = 1000, after = 1800, max = 5) {
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

      const jsonUrls = [];

      const urlRegex =
        /https?:\/\/[^"'\\\s<>]+\.json[^"'\\\s<>]*/gi;

      let match;

      while (
        (match = urlRegex.exec(html)) !== null &&
        jsonUrls.length < 30
      ) {
        if (!jsonUrls.includes(match[0])) {
          jsonUrls.push(match[0]);
        }
      }

      return new Response(
        JSON.stringify(
          {
            ok: response.ok,
            status: response.status,
            htmlLength: html.length,

            knownProductId: {
              id: "69274378",
              found: html.includes("69274378"),
              snippets: snippets("69274378", 1500, 2500, 3)
            },

            dataLoadingClues: {
              isAvailable: snippets("isAvailable"),
              axios: snippets("axios"),
              fetch: snippets("fetch("),
              ajax: snippets("ajax"),
              dotJson: snippets(".json")
            },

            jsonUrlsFound: jsonUrls.length,
            jsonUrls
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
      "Funbox data-source diagnostic cron triggered"
    );
  }
};
