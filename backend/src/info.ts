import { JSDOM } from "jsdom";
import type { EpisodeInfo } from "./models.ts";

export async function getInfo(id: string): Promise<EpisodeInfo> {
  const data = await Bun.fetch(`https://www.imdb.com/title/${id}`);
  const html = await data.text();
  console.log(`FETCH INFO ID ${id}`);
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const title =
    doc.querySelector(".hero__primary-text")?.textContent ?? undefined;

  const posterElement = doc.querySelector(
    ".ipc-image",
  ) as HTMLImageElement | null;

  const poster = posterElement?.src ?? undefined;

  const info =
    doc.querySelector("[aria-label='View User Ratings']")?.textContent ??
    undefined;

  return {
    title,
    rating: info ? info.split("/10")[0] : undefined,
    votes:  info ? info.split("/10")[1] : undefined,
    poster,
  };
}
