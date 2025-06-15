import { readdir } from "node:fs/promises";
import type { EpisodeCache, EpisodeInfo } from "./models.ts";
import { isValidCache } from "./is-valid-cache.ts";

export async function mainCache(): Promise<Response> {
  const files = await readdir(`${__dirname}/../cache`);
  const result: EpisodeCache[] = [];

  for (const file of files) {
    const data: EpisodeCache = await Bun.file(
      `${__dirname}/../cache/${file}`,
    ).json();

    if (isValidCache(data.created)) {
      result.push(data);
    }
  }

  return new Response(JSON.stringify(result));
}
