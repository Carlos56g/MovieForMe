import pandas as pd
import numpy as np
from scipy import spatial
import operator
import joblib
from models import MovieRecommendationRow,MoviesRecommendationTableset,Title
from sentence_transformers import SentenceTransformer

# Global Variables Used by the Aplication
moviesDataset = pd.read_pickle("data/FinalMoviesFiltered_V3.pk1")
descriptionModel = SentenceTransformer('modelsML/sentence_transformer_model')
knnModel = joblib.load('modelsML/knn_model.joblib')
X = joblib.load('modelsML/movie_embeddings.joblib')

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


def PredictScoreByTitle(name, debugMode):

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
        Rating=new_movie["vote_average"].values[0],
        HomePageURL=new_movie["homepage"].values[0]
        )
    
    recomendedMovies = MoviesRecommendationTableset(SourceMovie=sourceMovie,MovieRecommendations=[])
    
    if(debugMode):
        print("\nRecommended moviesDataset: \n")

    for neighbor in neighbors:
        movie = MovieRecommendationRow(
        Title=moviesDataset.iloc[neighbor[0]].iloc[0],
        Genres=moviesDataset.iloc[neighbor[0]].iloc[1],
        Rating=moviesDataset.iloc[neighbor[0]].iloc[2],
        HomePageURL=moviesDataset.iloc[neighbor[0]].iloc[-1] #Since was the last Column Added on the file
        )
        recomendedMovies.MovieRecommendations.append(movie)

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

    return recomendedMovies


def PredictScoreByDescrption(description, debugMode):
    filteredDescription = filterString(description)

    if(not filteredDescription or len(filteredDescription)==0):
        raise RuntimeError(f"The Description is not Valid")
    
    
    query_vec = descriptionModel.encode([filteredDescription])
    knnModel.fit(X)
    _, indices = knnModel.kneighbors(query_vec)

    recomendedMoviesDataset = moviesDataset.iloc[indices[0]]

    sourceMovie = MovieRecommendationRow(
        Title=description,
        Genres=[],
        Rating=0
        )
    recomendedMovies = MoviesRecommendationTableset(SourceMovie=sourceMovie,MovieRecommendations=[])
    
    for _ ,movie in recomendedMoviesDataset.iterrows():
        movie = MovieRecommendationRow(
        Title=movie["original_title"],
        Genres=movie["genres"],
        Rating=movie["vote_average"]
        )
        recomendedMovies.MovieRecommendations.append(movie)
        
    return recomendedMovies

def PredictScoreByNameAndDescription(title,description,debugMode):
    return

#On the future a better search method can be useful
def FindMovieByTitle(title):
    filteredTitle = filterString(title)

    result = moviesDataset[
    moviesDataset["filtered_title"].str.contains(rf'\b{filteredTitle}\b', case=False, regex=True)
    ]

    if(result.empty):
        return result
    
    result = result.sort_values(
        by="filtered_title",
        key=lambda col: col.str.len(),
        ascending=True
    )

    return result.iloc[0].to_frame().T

#Delete Special Caracters, upperCase, Duplicate Spaces
def filterString(string):
    filteredString = ""
    spaceCount = 0
    for c in string:
        if(c.isalpha() or c.isdigit()):
            filteredString+=c.upper()
            spaceCount = 0 
        if(c==" " and spaceCount == 0 and len(filteredString)>0):
            filteredString+=c
            spaceCount = 1
    
    if(filteredString.endswith(" ")):
        filteredString = filteredString[:-1]

    return filteredString

#Return the 5 movies that start with the title provided as a DataFrame
def FindMoviesByTitle(title, numResults = 5):
    filteredTitle = filterString(title)
    results = moviesDataset[
        moviesDataset["filtered_title"].str.contains(filteredTitle, na=False)
    ]

    if results.empty:
        return results

    results = results.sort_values(
        by="filtered_title",
        key=lambda col: col.str.len(),
        ascending=True
    )
    return results.head(numResults)

    
def ConvertMovieDataFrameToTitleList(movieDataFrame):
    if(movieDataFrame is None):
       return None
    
    titleList = []
    for _,row in movieDataFrame.iterrows():
        title = Title(
            ID=int(row["new_id"]),
            Title=row["original_title"]
        )
        titleList.append(title)

    return titleList