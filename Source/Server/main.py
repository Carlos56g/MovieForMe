from fastapi import FastAPI, HTTPException
import util
from models import MovieRequest,MoviesRecommendationTableset

app = FastAPI()

@app.post("/getMoviesRecomendations")
async def getMoviesRecomendations(userRequest: MovieRequest):
    try:
        if userRequest.Title and len(userRequest.Title) > 0 and not userRequest.Description:
            moviesRecomendations = util.PredictScoreByName(userRequest.Title, userRequest.DebugMode)

        elif not userRequest.Title and userRequest.Description and len(userRequest.Description) > 0 :
            moviesRecomendations = util.PredictScoreByDescrption(userRequest.Description, userRequest.DebugMode)
        
        elif userRequest.Title and len(userRequest.Title) > 0 and userRequest.Description and len(userRequest.Description) > 0:
            moviesRecomendations = util.PredictScoreByNameAndDescription(userRequest.Title, userRequest.Description, userRequest.DebugMode)
        
        else:
            raise HTTPException(status_code=400, detail="A Movie Title or Description is Required")
    
        return moviesRecomendations
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
