import { useState } from 'react'
import './App.css'
import axios, { AxiosError } from "axios";
import type { MovieResponse } from './Types';
import { movieForMeApiURL } from './movieForMeAPI/config';

function App() {

  //Global Variables
  const [title, setTitle] = useState(""); //Title User Input
  const [description, setDescription] = useState(""); //Description User Input
  const [response, setResponse] = useState<MovieResponse | null>(null); //Response by the API (Success)
  const [error, setError] = useState<AxiosError | null>(null); //Response by the API (Error)

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

  const handleError = (err: AxiosError | null) => {
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

  //Search Movies
  const handleSearchMovies = async () => {
    setShowLoading(true);
    setInputsDisabled(true);
    var apiRoute = movieForMeApiURL;
    try {
      if (searchByDescription) {
        apiRoute += "/getMoviesRecomendationsByDescription"
      }
      else {
        apiRoute += "/getMoviesRecomendationsByTitle"
      }
      const res = await axios.post(apiRoute, {
        Title: title,
        Description: description
      });
      setResponse(res.data);
      handleError(null);
      setInputsDisabled(false);
    } catch (err) {
      handleError(err);
      setResponse(null);
    }
    setShowLoading(false);
  };


  return (
    <>
      <section className='searchSection'>
        <h1>Ready to find your next movie?</h1>

        <div className={`checkBoxDescription ${inputsDisabled ? "disableInput" : "enabledInput"}`}>
          <label className='switch'> Search by Description
            <input type="checkbox"
              checked={searchByDescription}
              onChange={toggleSearchByDescription}
              disabled={inputsDisabled}/>
            <span className='slider'></span>
          </label>
        </div>

        <div className={`searchSection ${searchByDescription ? "hideSection" : "showSection"}`}>
          <h2>Search similar movies by Title:</h2>
          <input type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={inputsDisabled}/>
        </div>

        <div className={`searchSection ${searchByDescription ? "showSection" : "hideSection"}`}>
          <h2>Search similar movies by Description:</h2>

          <textarea value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={inputsDisabled}/>
        </div>

        <button onClick={handleSearchMovies}
         disabled={inputsDisabled}>
          Search
        </button>

      </section>

      {showLoading && (
        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      {/* Movies Responses */}
      <section className='recommendationSection'>
        {response && (
          <div>
            <h2>Source Movie</h2>
            <p><strong>{response.SourceMovie.Title}</strong></p>
            <p>Genres: {response.SourceMovie.Genres.join(", ") || "None"}</p>
            <p>Rating: {response.SourceMovie.Rating}</p>

            <h2>Recommendations</h2>
            <ul>
              {response.MovieRecommendations.map((movie, index) => (
                <li key={index}>
                  <strong>{movie.Title}</strong> - Rating: {movie.Rating} <br />
                  Genres: {movie.Genres.join(", ")}
                </li>
              ))}
            </ul>

            <button onClick={() => setResponse(null)}>
              Clear Results
            </button>

          </div>
        )}
        {error && (
          <div>
            <div className={`errorCard ${showError ? "show" : ""}`}>
              <p>{error.code}</p>
              <p>{error.response?.data.detail}</p>
            </div>

          </div>
        )}
      </section>
    </>
  )
}

export default App
