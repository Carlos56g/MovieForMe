import pandas as pd
import numpy as np
from scipy import spatial
import operator
import ast
from models import MovieRecommendationRow,MoviesRecommendationTableset

# Global Variables Used by the Aplication
moviesDataset = pd.read_csv("data/FinalMovies.csv")

# Converts the text columns to real list
columns_to_convert = ["genres_bin", "cast_bin", "director_bin", "words_bin"]
for col in columns_to_convert:
    moviesDataset[col] = moviesDataset[col].apply(lambda x: np.array(ast.literal_eval(x), dtype=bool)) # type: ignore

# Convert the genres column to a list
moviesDataset["genres"] = moviesDataset["genres"].apply(ast.literal_eval)

def Similarity(movieId1, movieId2):
    a = moviesDataset.iloc[movieId1]
    b = moviesDataset.iloc[movieId2]

    genresA =a["genres_bin"]
    genresB = b["genres_bin"]
    genreDistance = spatial.distance.cosine(genresA, genresB)

    scoreA = a["cast_bin"]
    scoreB = b["cast_bin"]
    scoreDistance = 0.0 if np.all(scoreA == 0) or np.all(scoreB == 0) else spatial.distance.cosine(scoreA, scoreB)

    directA = a["director_bin"]
    directB = b["director_bin"]
    directDistance = 0.0 if np.all(directA == 0) or np.all(directB == 0) else spatial.distance.cosine(directA, directB)

    wordsA = a["words_bin"]
    wordsB = b["words_bin"]
    wordsDistance = 0.0 if np.all(wordsA == 0) or np.all(wordsB == 0) else spatial.distance.cosine(wordsA, wordsB)

    return genreDistance + directDistance + scoreDistance + wordsDistance


def GetNeighbors(baseMovie, K):
    distances = []

    for index, movie in moviesDataset.iterrows():
        if movie["new_id"] != baseMovie["new_id"].values[0]:
            dist = Similarity(baseMovie["new_id"].values[0], movie["new_id"])
            distances.append((movie["new_id"], dist))

    distances.sort(key=operator.itemgetter(1))
    neighbors = []

    for x in range(K):
        neighbors.append(distances[x])
    return neighbors


def PredictScoreByName(name, debugMode):

    #Search the Target Movie 
    new_movie = FindMovieByTitle(name)

    if new_movie.empty:
        raise RuntimeError(f"No Target Movie with the name: '{name}' was found")
    
    if(debugMode):
        print("Selected Movie: ", new_movie.original_title.values[0])

    K = 10
    avgRating = 0
    neighbors = GetNeighbors(new_movie, K)
    
    sourceMovie = MovieRecommendationRow(
        Title=new_movie["original_title"].values[0],
        Genres=new_movie["genres"].values[0],
        Rating=new_movie["vote_average"].values[0]
        )
    movies = MoviesRecommendationTableset(SourceMovie=sourceMovie,MovieRecommendations=[])
    
    if(debugMode):
        print("\nRecommended moviesDataset: \n")

    for neighbor in neighbors:
        movie = MovieRecommendationRow(
        Title=moviesDataset.iloc[neighbor[0]].iloc[0],
        Genres=moviesDataset.iloc[neighbor[0]].iloc[1],
        Rating=moviesDataset.iloc[neighbor[0]].iloc[2]
        )
        movies.MovieRecommendations.append(movie)

        if(debugMode):
            print(
                moviesDataset.iloc[neighbor[0]].iloc[0]
                + " | Genres: "
                + str(moviesDataset.iloc[neighbor[0]].iloc[1]).strip("[]").replace(" ", "")
                + " | Rating: "
                + str(moviesDataset.iloc[neighbor[0]].iloc[2])
            )
            avgRating = avgRating + moviesDataset.iloc[neighbor[0]].iloc[2]
            print("\n")

    if(debugMode):        
        avgRating = avgRating / K
        print(
            "The predicted rating for %s is: %f"
            % (new_movie["original_title"].values[0], avgRating)
        )
        print(
            "The actual rating for %s is %f"
            % (new_movie["original_title"].values[0], new_movie["vote_average"].values[0])
        )

    return movies


def PredictScoreByDescrption(description, debugMode):
    return

def PredictScoreByNameAndDescription(title,description,debugMode):
    return

# On the future a better search method can be useful
def FindMovieByTitle(name):
    result = moviesDataset[moviesDataset["original_title"].str.contains(name)]
    if(result.empty):
        return result
    
    #Maybe a seccond search can be useful if we have multiple matches
    return result.iloc[0].to_frame().T
    
