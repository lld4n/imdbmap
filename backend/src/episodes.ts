import { JSDOM } from "jsdom";
import type { Episode, EpisodeCache } from "./models.ts";
import { getInfo } from "./info.ts";

export async function mainEpisodes(req: Bun.BunRequest<"/api/episodes">) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const id = params.get("id");

  if (!id) {
    return new Response("NOT FOUND ID", { status: 404 });
  }

  const data = await getAllEpisodes(id);

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function getAllEpisodes(id: string): Promise<EpisodeCache> {
  const cachePath = `${__dirname}/../cache/${id}.json`;
  const episodes: Episode[][] = [];
  let season = 1;
  let isCorrect = true;

  const isCached = await Bun.file(cachePath).exists();

  if (isCached) {
    const data: EpisodeCache = await Bun.file(cachePath).json();
    const now = new Date().getTime();

    if (!data.created) {
      console.log(`USE PERMANENT CACHED ID ${id}`);
      return data;
    }

    if (now - data.created < 30 * 24 * 60 * 60 * 1000) {
      console.log(`USE CACHED ID ${id}`);
      return data;
    }
  }

  while (isCorrect) {
    const seasonEpisodes = await getSeasonEpisodes(id, season);

    if (seasonEpisodes.length > 0) {
      season++;
      episodes.push(seasonEpisodes);
    } else {
      isCorrect = false;
    }
  }

  const info = await getInfo(id);

  if (episodes.length > 0) {
    console.log(`SAVED CACHE ID ${id}`);
    const cache: EpisodeCache = {
      id,
      created: new Date().getTime(),
      info,
      episodes: episodes,
    };
    await Bun.write(cachePath, JSON.stringify(cache));
  }

  return { episodes, info, id };
}

async function getSeasonEpisodes(
  id: string,
  season: number,
): Promise<Episode[]> {
  const data = await Bun.fetch(
    `https://www.imdb.com/title/${id}/episodes/?season=${season}`,
  );
  const html = await data.text();
  console.log(`FETCH SEASON ${season} ID ${id}`);
  const dom = new JSDOM(html);
  const result: Episode[] = [];

  const listElement = dom.window.document.querySelectorAll(
    ".episode-item-wrapper",
  );

  for (const episodeElement of listElement) {
    const topRated = episodeElement.textContent?.includes("Top-rated") ?? false;

    const imageElement = episodeElement.querySelector(
      ".ipc-image",
    ) as HTMLImageElement | null;

    const img = imageElement?.src ?? undefined;

    const title =
      episodeElement.querySelector(".ipc-title__text")?.textContent ??
      undefined;

    const rating =
      episodeElement.querySelector(".ipc-rating-star--rating")?.textContent ??
      undefined;

    const votes =
      episodeElement.querySelector(".ipc-rating-star--voteCount")
        ?.textContent ?? undefined;

    result.push({
      img,
      title: title ? title.split(" ∙ ")[1] : undefined,
      rating,
      votes: votes
        ? votes.trim().replaceAll("(", "").replaceAll(")", "")
        : undefined,
      topRated,
    });
  }

  return result;
}
