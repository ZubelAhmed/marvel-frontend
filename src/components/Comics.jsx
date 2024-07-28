import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Comics.css';

const Comics = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [comics, setComics] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComics, setTotalComics] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10; // Number of comics per page

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const skip = (currentPage - 1) * limit;
        const response = await axios.get(`${serverUrl}/comics`, {
          params: {
            limit,
            skip,
            title: searchQuery,
          },
        });

        if (response.data.error) {
          setMessage(response.data.error);
          setComics([]);
        } else if (response.data.results && response.data.results.length > 0) {
          setComics(response.data.results);
          setTotalComics(response.data.count);
          setMessage('');
        } else {
          setMessage('No comics found.');
          setComics([]);
        }
      } catch (err) {
        setError('An error occurred while fetching comics.');
      }
    };

    fetchComics();
  }, [currentPage, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleFavoriteToggle = (comic) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex((fav) => fav._id === comic._id);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(comic);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const isFavorite = (comicId) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some((fav) => fav._id === comicId);
  };

  const totalPages = Math.ceil(totalComics / limit);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (message) {
    return <div className="no-comics-message">{message}</div>;
  }

  if (comics.length === 0) {
    return <div className="no-comics-message">No comics available. 🤷‍♂️</div>;
  }

  return (
    <div>
      <h2>Marvel Comics</h2>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search comics..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      <div className="comics-list">
        {comics.map((comic) => (
          <div key={comic._id} className="comic-card">
            <img
              src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
              alt={comic.title}
              className="comic-thumbnail"
            />
            <div className="comic-info">
              <h3>{comic.title}</h3>
              <p>{comic.description || 'No description available.'}</p>
            </div>
            <button
              onClick={() => handleFavoriteToggle(comic)}
              className={`favorite-button ${
                isFavorite(comic._id) ? 'favorited' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="favorite-icon"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Comics;
