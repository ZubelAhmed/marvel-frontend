import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CharacterComics.css';

const CharacterComics = () => {
  const { characterId } = useParams();
  const [comics, setComics] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await axios.get(`${serverUrl}/comic/${characterId}`);

        if (response.data.message) {
          setMessage(response.data.message);
          setComics([]);
        } else if (response.data.comics && response.data.comics.length > 0) {
          setComics(response.data.comics);
          setMessage('');
        } else {
          setMessage('Unexpected response structure.');
          setComics([]);
        }
      } catch (err) {
        setError('An error occurred while fetching comics.');
      }
    };

    if (characterId) {
      fetchComics();
    }
  }, [characterId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (message) {
    return <div>{message}</div>;
  }

  if (comics.length === 0) {
    return <div>No comics available for this character. 🤷‍♂️</div>;
  }

  return (
    <div className="characters">
      <h2>Comics featuring this character</h2>
      <div className="comics-list">
        {comics.map((comic) => (
          <div key={comic._id} className="comic-card">
            <img
              src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
              alt={comic.title}
              className="comic-thumbnail"
            />
            <h3>{comic.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: comic.description }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterComics;
