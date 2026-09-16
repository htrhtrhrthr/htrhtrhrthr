export default {
  async fetch(request, env, ctx) {
    return new Response("Funbox Beyblade Radar is running!");
  },

  async scheduled(event, env, ctx) {
    console.log("Funbox Beyblade Radar scheduled check triggered");
  }
};
// Git deploy test
