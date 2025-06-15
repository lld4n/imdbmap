export interface Episode {
  img?: string;
  title?: string;
  rating?: string;
  votes?: string;
  topRated: boolean;
}

export interface EpisodeInfo {
  id?: string;
  title?: string;
  rating?: string;
  poster?: string;
  votes?: string;
}

export interface EpisodeCache {
  id: string;
  created?: number;
  info: EpisodeInfo;
  episodes: Episode[][];
}

export interface ImdbSearch {
  d: {
    i: {
      imageUrl: string;
    };
    id: string;
    l: string;
    qid?: string;
  }[];
}
