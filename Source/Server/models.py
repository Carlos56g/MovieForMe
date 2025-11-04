from pydantic import BaseModel

# Request Body
class MovieRequest(BaseModel):
    Title: str | None = None
    Description: str | None = None
    DebugMode: bool = False

class MovieRecommendationRow(BaseModel):
    Title: str
    Genres: list[str]
    Rating: float
    HomePageURL: str | None = None
    PosterURL: str | None = None

class MoviesRecommendationTableset(BaseModel):
    MovieRecommendations: list[MovieRecommendationRow]
    SourceMovie: MovieRecommendationRow

# Titles Response for AutoComplete
class Title(BaseModel):
    ID: int
    Title: str
