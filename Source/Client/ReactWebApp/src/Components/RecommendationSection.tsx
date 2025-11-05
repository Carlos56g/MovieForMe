import type { MovieResponse } from '../Types';
import MovieCard from './MovieCard';
import "./RecommendationSection.css";

interface RecommendationSectionProps {
  movieForMeResponse: MovieResponse | null;
  clearResults: () => void;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  movieForMeResponse,
  clearResults,
}) => {

  if (movieForMeResponse == null)
    return null;

  const { SourceMovie, MovieRecommendations } = movieForMeResponse;
  return (
    <section>
      {SourceMovie.Rating !== 0 ? (
        <div>
          <div className='verticalMovieTitle'>
            <p>{SourceMovie.Title}</p>
          </div>
          <div className='sourceMovieCard'>
            <h2>Your Movie</h2>
            <div className='sourceMovie'>
              <MovieCard movie={SourceMovie} />
            </div>
          </div>
        </div>

      ) : (
        <div className='sourceDescriptionCard'>
          <h2>Your Description</h2>
          <div className='sourceMovie'>
            <div className='movieDescription'>
              <h2>{SourceMovie.Title}</h2>
            </div>
          </div>
        </div>
      )}

      <h2>Our Recommendations</h2>
      <div className='moviesRecommendations'>
        {MovieRecommendations.map((movie, index) => (
          <div key={index}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      <button onClick={clearResults}>Clear Results</button>
    </section>
  );
};

export default RecommendationSection;