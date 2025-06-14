export interface Episode {
  img?: string;
  title?: string;
  rating?: string;
  votes?: string;
  topRated: boolean;
}

export interface EpisodeInfo {
  title?: string;
  rating?: string;
  poster?: string;
  votes?: string;
}

export interface EpisodeResponse {
  id: string;
  info: EpisodeInfo;
  episodes: Episode[][];
}
