export interface Movie {
  Title: string;
  Genres: string[];
  Rating: number;
}

export interface MovieResponse {
  MovieRecommendations: Movie[];
  SourceMovie: Movie;
}