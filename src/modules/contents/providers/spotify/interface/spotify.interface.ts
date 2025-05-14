export interface SpotifyTrack {
  id: string;
  name: string;
  artists: {
    id: string;
    name: string;
  }[];
  album: {
    id: string;
    name: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
  };
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
  popularity: number;
  duration_ms: number;
  explicit: boolean;
}

export interface SpotifyPodcast {
  id: string;
  name: string;
  publisher: string;
  description: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  external_urls: {
    spotify: string;
  };
  total_episodes: number;
  media_type: string;
}

export interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifySearchResponse {
  tracks?: {
    items: SpotifyTrack[];
  };
  shows?: {
    items: SpotifyPodcast[];
  };
}

export interface SpotifyRecommendationsResponse {
  tracks: SpotifyTrack[];
  seeds: {
    id: string;
    type: string;
    href: string;
  }[];
}
