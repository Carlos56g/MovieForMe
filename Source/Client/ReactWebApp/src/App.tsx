import { useState } from 'react'
import './App.css'
import axios from "axios";
import type { MovieResponse } from './Types';
import { movieForMeApiURL } from './movieForMeAPI/config';

function App() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchByDescription, setSearchByDescription] = useState(false);
  const handleToggleSearchByDescription = () => setSearchByDescription(!searchByDescription);
  const [response, setResponse] = useState<MovieResponse | null>(null);

  const handleSearchMovies = async () => {
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
      console.log("Respuesta:", res.data);
    } catch (error) {
      console.error("Error al enviar POST:", error);
    }
  };

  return (
    <>
      <section>
        <h1>Ready to find your next movie?</h1>
      </section>

      <section>
        <h2>Search similar movies by title:</h2>
        <input type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </section>

      <section>
        <h2>Search similar movies by description:</h2>
        <input type='text'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </section>

      <div className="card">
        <button onClick={handleSearchMovies}>
          Search
        </button>
      </div>

      <div>
        <label>Search by Description</label>
        <input id='searchByDescription' type="checkbox" checked={searchByDescription} onChange={handleToggleSearchByDescription} />
      </div>

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

          <div className="card">
            <button onClick={() => setResponse(null)}>
              Clear Results
            </button>
          </div>
          
        </div>
      )}

    </>
  )
}

export default App
