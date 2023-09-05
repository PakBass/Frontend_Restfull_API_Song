import React, { useEffect, useState } from "react";

const App = () => {
  const accessToken = "837a51568a9e4e878e3ae6a9f51bd857";
  const [songData, setSongData] = useState(null);

  useEffect(() => {
    fetch(
      "https://api.spotify.com/v1/search?q=sweet%20child%20o%20mine%20artist:guns%20n%20roses&type=track&limit=1",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => console.log(data.tracks.items[0]));
  }, []);

  return (
    <div>
      {songData ? (
        <div>
          <h1>{songData.name}</h1>
          <p>{songData.artists[0].name}</p>
          <img src={songData.album.images[0].url} alt="Album Cover" />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;