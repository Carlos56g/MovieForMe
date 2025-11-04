import { useState } from 'react'
import './MovieForMeHome.css'
import axios, { AxiosError } from "axios";
import type { Movie, MovieResponse, APIError } from './Types';
import { movieForMeApiURL, omdbAPIURL } from './APIs/config';
import RecomendationSection from "./Components/RecommendationSection";
import ErrorCard from "./Components/ErrorCard";
import LoadingDots from "./Components/LoadingDots";
import SearchSection from './Components/SearchSection';

function MovieForMeHome() {

  //Global Variables
  const [title, setTitle] = useState(""); //Title User Input
  const [description, setDescription] = useState(""); //Description User Input
  const [movieForMeResponse, setMovieForMeResponse] = useState<MovieResponse | null>(null); //Response by the API (Success)
  const [error, setError] = useState<AxiosError<APIError> | null>(null); //Response by the API (Error)

  //Aux Variables
  const [searchByDescription, setSearchByDescription] = useState(false); //Boolean if is search by description
  const [showError, setShowError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [inputsDisabled, setInputsDisabled] = useState(false);

  //Methods
  const toggleSearchByDescription = () => {
    setSearchByDescription(prev => {
      const newValue = !prev;
      return newValue;
    });
  };

  const handleError = (err: AxiosError<APIError> | null) => {
    if (!err) return;

    setError(err);
    setShowError(false);

    setTimeout(() => setShowError(true), 10);

    setTimeout(() => {
      setShowError(false);
      setTimeout(() => setError(null), 500);
      setTimeout(() => setInputsDisabled(false), 500);
    }, 2500);

  };

  const handleSearchMovies = async () => {
    setShowLoading(true);
    setInputsDisabled(true);
    var movieForMeAPIRoute = movieForMeApiURL + "recommendations/";
    try {
      movieForMeAPIRoute += searchByDescription ? "description" : "title";

      const res = await axios.post(movieForMeAPIRoute, {
        Title: title,
        Description: description
      });

      handleError(null);
      const updatedResponse = await getPostersURL(res.data);
      setMovieForMeResponse(updatedResponse);
      setInputsDisabled(false);
    } catch (err) {
      handleError(err as AxiosError<APIError>);
    }
    finally{
      setShowLoading(false);
    }
  };

  const getPostersURL = async (responseData: MovieResponse) => {

    const updatedResponse = { ...responseData };

    if (!searchByDescription && updatedResponse != null) {
      updatedResponse.SourceMovie.PosterURL = await getPoster(updatedResponse.SourceMovie.Title);
    }

    if (updatedResponse?.MovieRecommendations) {
      updatedResponse.MovieRecommendations = await Promise.all(
        updatedResponse.MovieRecommendations.map(async (movie: Movie) => ({
          ...movie, PosterURL: await getPoster(movie.Title),
        }))
      );
    }
    return updatedResponse;
  }

  const getPoster = async (title: string) => {
    try {
      const res = await axios.get(`${omdbAPIURL}t=${title}`);
      return res.data.Poster || "/defaultPoster.svg";
    }
    catch {
      return "/defaultPoster.svg";
    }
  }

  return (
    <>
      <SearchSection
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        searchByDescription={searchByDescription}
        toggleSearchByDescription={toggleSearchByDescription}
        handleSearchMovies={handleSearchMovies}
        inputsDisabled={inputsDisabled}
      />

      <LoadingDots show={showLoading} />

      <RecomendationSection
        movieForMeResponse={movieForMeResponse}
        clearResults={() => setMovieForMeResponse(null)}
      />

      <ErrorCard error={error} show={showError} />

    </>
  )
}

export default MovieForMeHome
