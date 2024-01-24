import React, { useState } from 'react';
import './App.css';

function isValidSpotifyPlaylistLink(link) {
  const spotifyRegex = /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+(\?|$)/;
  return spotifyRegex.test(link);
}

function App() {
  const [playlistLink, setPlaylistLink] = useState('');
  const [lyrics, setLyrics] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSong, setExpandedSong] = useState(null);

  const handleGetLyrics = async () => {
    try {
      if (!isValidSpotifyPlaylistLink(playlistLink)) {
        setError('Link inválido. Certifique-se de que é um link de playlist do Spotify.')
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/get_lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlist_link: playlistLink }),
      });

      const data = await response.json();
      setLyrics(data.lyrics);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      setError('Erro ao obter as letras. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpandSong = (index) => {
    setExpandedSong(index === expandedSong ? null : index)
  }

  return (
    <div className="App">
      <h1>Canta Saporra Direito MORTÂO!!!</h1>
      <input className='inp'
        type="text"
        placeholder="Enter Spotify Playlist Link"
        value={playlistLink}
        onChange={(e) => setPlaylistLink(e.target.value)}
      />
      <button className='btn' onClick={handleGetLyrics}>Get Lyrics</button>

      {isLoading ? (
        <p style={{color:'#e75d00'}}>Calma ae microfone! Estou pegando as letras</p>
      ) : (
        <div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {lyrics.map((song, index) => (
            <div className='songname' key={index}>
              <h3 onClick={() => handleExpandSong(index)} style={{ cursor: 'pointer' }}>
                {song.name}
              </h3>
              {expandedSong === index && (
                <div>
                  <p>{song.artists}</p>
                  <pre>{song.lyrics}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
