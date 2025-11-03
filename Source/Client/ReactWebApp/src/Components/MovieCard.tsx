import type { Movie } from '../Types';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const content = (
      <div className='movieCard'>
        <img src={movie.PosterURL} alt={movie.Title} />
        <h2>{movie.Title}</h2>
        <p className='rating'>{movie.Rating}</p>
        <p className='genres'>{movie.Genres.join(", ")}</p>
      </div>
    );
  
    return movie.HomePageURL ? (
      <a href={movie.HomePageURL} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    ) : (
      <div>{content}</div>
    );
  };

  export default MovieCard;