from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from util import PredictScoreByDescrption,PredictScoreByTitle,FindMoviesByTitle,ConvertMovieDataFrameToTitleList
from models import MovieRequest,Title

app = FastAPI()

origins = [
    "https://carlos56g.github.io",        # GitHub Pages
    "http://localhost:5173",              # Dev Env
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/movies/recommendations/title")
async def GetMoviesRecomendationsByTitle(userRequest: MovieRequest):
    try:
        if userRequest.Title and len(userRequest.Title) > 0:
            moviesRecomendations = PredictScoreByTitle(userRequest.Title, userRequest.DebugMode)
        else:
            raise HTTPException(status_code=400, detail="A Movie Title is Required")
    
        return moviesRecomendations
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/movies/recommendations/description")
async def GetMoviesRecomendationsByDescription(userRequest: MovieRequest):
    try:
        if userRequest.Description and len(userRequest.Description) > 0:
            moviesRecomendations = PredictScoreByDescrption(userRequest.Description, userRequest.DebugMode)
        else:
            raise HTTPException(status_code=400, detail="A Movie Description is Required")
    
        return moviesRecomendations
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/api/movies/search/title", response_model=list[Title])
def SearchMovies(q: str = Query(..., min_length=1)):
    try:
        result = FindMoviesByTitle(q)
        titleList =  ConvertMovieDataFrameToTitleList(result)
        return titleList
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

    
