import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Personnages from './components/Personnages';
import Comics from './components/Comics';
import Favoris from './components/Favoris';
import './App.css';
import MarvelLogo from './assets/Marvel_Logo.svg.png';
import CharacterComics from './components/CharacterComics';

const App = () => {
  return (
    <div>
      <header>
        <div className="container">
          <img src={MarvelLogo} alt="Marvel Logo" className="logo" />
          <nav>
            <ul>
              <li>
                <Link to="/characters">Personnages</Link>
              </li>
              <li>
                <Link to="/comics">Comics</Link>
              </li>
              <li>
                <Link to="/favorites">Favoris</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Personnages />} />
          <Route path="/characters" element={<Personnages />} />
          <Route path="/comic/:characterId" element={<CharacterComics />} />
          <Route path="/comics" element={<Comics />} />
          <Route path="/favorites" element={<Favoris />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
