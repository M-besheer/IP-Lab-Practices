import React, { useState } from "react";
import "./App.css"; // Importing our new stylesheet

function MovieItem({ movie, onRemove }) {
  const stars = "⭐".repeat(movie.rating);

  return (
    <div className="movie-item">
      <div className="movie-content">
        <h2>{movie.title}</h2>
        <p><strong>Review:</strong> {movie.review}</p>
        <p><strong>Rating:</strong> <span className="stars">{stars}</span></p>
      </div>
      
      <button className="remove-btn" onClick={() => onRemove(movie.id)}>
        Remove
      </button>
    </div>
  );
}

function AddMovieForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);

  function handleSubmit(e) {
    e.preventDefault(); // Prevents the page from refreshing when submitting
    if (title.trim() !== "") {
      onAdd(title, review, rating);
      // Reset form
      setTitle("");
      setReview("");
      setRating(1);
    }
  }

  return (
    <form className="add-movie-form" onSubmit={handleSubmit}>
      <h3>Add a New Movie</h3>
      
      <div className="form-group">
        <input 
          type="text" 
          placeholder="Movie Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <textarea 
          placeholder="Write your review here..." 
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows="3"
        />
      </div>
      
      <div className="form-group rating-group">
        <label htmlFor="rating">Rating (1-5): </label>
        <input 
          id="rating"
          type="number" 
          min="1" max="5" 
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </div>
      
      <button type="submit" className="add-btn">
        Add to Watchlist
      </button>
    </form>
  );
}

export default function App() {
  const [movies, setMovies] = useState([]);

  function handleAddMovie(title, review, rating) {
    const newMovie = {
      id: Date.now(),
      title: title,
      review: review,
      rating: Number(rating)
    };
    setMovies([...movies, newMovie]);
  }

  function handleRemoveMovie(movieId) {
    const updatedMovies = movies.filter(movie => movie.id !== movieId);
    setMovies(updatedMovies);
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎬 My Movie Watchlist</h1>
      </header>
      
      <main>
        <AddMovieForm onAdd={handleAddMovie} />

        <section className="movies-section">
          <h2>My Movies</h2>
          {movies.length === 0 ? (
            <div className="empty-state">
              <p>Your watchlist is empty. Add some movies above!</p>
            </div>
          ) : (
            <div className="movies-list">
              {movies.map((movie) => (
                <MovieItem 
                  key={movie.id} 
                  movie={movie} 
                  onRemove={handleRemoveMovie} 
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}