import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Personnages.css';

const Personnages = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10; // Number of characters per page
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * limit;
        const response = await axios.get(serverUrl + '/characters', {
          params: {
            limit,
            skip,
            name: searchQuery,
          },
        });

        if (response.data.error) {
          setError(response.data.error);
          setCharacters([]);
        } else {
          setCharacters(response.data.results);
          setTotalCharacters(response.data.count);
          setError(null);
        }
      } catch (err) {
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [currentPage, searchQuery]);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleFavoriteToggle = (character) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex((fav) => fav._id === character._id);

    if (index > -1) {
      // Remove from favorites
      favorites.splice(index, 1);
    } else {
      // Add to favorites
      favorites.push(character);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const isFavorite = (characterId) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some((fav) => fav._id === characterId);
  };

  const totalPages = Math.ceil(totalCharacters / limit);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleCardClick = (characterId) => {
    navigate(`/comic/${characterId}`);
  };

  return (
    <div className="personnages">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search characters..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      <div className="characters-list">
        {characters.map((character) => (
          <div
            key={character._id}
            className="character-card"
            onClick={() => handleCardClick(character._id)}
          >
            <img
              src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
              alt={character.name}
            />
            <h2>{character.name}</h2>
            <p>{character.description || 'No description available'}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFavoriteToggle(character);
              }}
              className={`favorite-button ${
                isFavorite(character._id) ? 'favorited' : ''
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

export default Personnages;
