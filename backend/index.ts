import { mainEpisodes } from "./src/episodes.ts";
import { mainCache } from "./src/cache.ts";
import { mainSearch } from "./src/search.ts";

// make TypeScript happy
declare global {
  var count: number;
}

globalThis.count ??= 0;
console.log(`Reloaded ${globalThis.count} times`);
globalThis.count++;

// prevent `bun run` from exiting
setInterval(function () {}, 1000000);

const server = Bun.serve({
  idleTimeout: 255,
  routes: {
    "/api/episodes": (req) => mainEpisodes(req),
    "/api/cache": () => mainCache(),
    "/api/search": (req) => mainSearch(req),
  },
});

console.log(`START SERVER ${server.hostname}:${server.port}`);
