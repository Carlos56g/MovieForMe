from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import util
from models import MovieRequest

app = FastAPI()

origins = [
    "http://localhost:5173",  #React Port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["POST"],
)


@app.post("/getMoviesRecomendationsByTitle")
async def getMoviesRecomendationsByTitle(userRequest: MovieRequest):
    try:
        if userRequest.Title and len(userRequest.Title) > 0:
            moviesRecomendations = util.PredictScoreByTitle(userRequest.Title, userRequest.DebugMode)
        else:
            raise HTTPException(status_code=400, detail="A Movie Title is Required")
    
        return moviesRecomendations
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/getMoviesRecomendationsByDescription")
async def getMoviesRecomendationsByDescription(userRequest: MovieRequest):
    try:
        if userRequest.Description and len(userRequest.Description) > 0:
            moviesRecomendations = util.PredictScoreByDescrption(userRequest.Description, userRequest.DebugMode)
        else:
            raise HTTPException(status_code=400, detail="A Movie Description is Required")
    
        return moviesRecomendations
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
