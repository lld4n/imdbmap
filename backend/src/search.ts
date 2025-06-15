import type { EpisodeInfo, ImdbSearch } from "./models.ts";

export async function mainSearch(
  req: Bun.BunRequest<"/api/search">,
): Promise<Response> {
  const url = new URL(req.url);
  const params = url.searchParams;

  const q = params.get("q");

  if (!q) {
    return new Response("NOT FOUND QUERY PARAMS", { status: 404 });
  }

  const data = await Bun.fetch(
    `https://v3.sg.media-imdb.com/suggestion/x/${q}.json?includeVideos=1`,
  );
  const json: ImdbSearch = await data.json();

  const info: EpisodeInfo[] = [];

  for (const item of json.d) {
    if (item.qid === "tvSeries") {
      info.push({
        poster: item.i.imageUrl,
        title: item.l,
        id: item.id,
      });
    }
  }

  return new Response(JSON.stringify(info), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
