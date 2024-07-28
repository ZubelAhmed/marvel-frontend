import React, { useState, useEffect } from 'react';
import './Favoris.css';

const Favoris = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleRemoveFavorite = (itemId) => {
    let updatedFavorites = favorites.filter((item) => item._id !== itemId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  return (
    <div className="favoris">
      <h2>My Favorites</h2>
      <div className="favorites-list">
        {favorites.length > 0 ? (
          favorites.map((item) => (
            <div key={item._id} className="favorite-card">
              <button
                onClick={() => handleRemoveFavorite(item._id)}
                className="remove-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="remove-icon"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
              <img
                src={`${item.thumbnail.path}.${item.thumbnail.extension}`}
                alt={item.name}
              />
              <h3>{item.name}</h3>
              <p>{item.description || 'No description available.'}</p>
            </div>
          ))
        ) : (
          <div>No favorites added.</div>
        )}
      </div>
    </div>
  );
};

export default Favoris;
