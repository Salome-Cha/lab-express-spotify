// Here is my version. Still need to be compared with Miguel's one for final validation.


require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


    // Our routes go here:

app.get('/', (req, res) => {
      res.render('index');
  });


app.get('/artist-search', (req, res) => {
    console.log("I'm searching for an artist");
   
    console.log(req.query.artist); 
    
    spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      let artistResults = data.body.artists.items;
      console.log('The received data from the API: ', artistResults);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      console.log(artistResults[0].images);
      res.render('artist-search-results', {artistResults} );
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
}) 


app.get('/albums/:artistId', (req, res, next) => {
  
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then((data) => {
      console.log('Artist albums', data.body);
      let albumsList = data.body
    res.render('albums', {albumsList} );
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})



// This last part is bugged. Check tomorrow when node starts working again.
app.get('/viewtracks/:albumId', (req, res, next) => {

  spotifyApi.getAlbumTracks(req.params.albumId)
  .then((data) => {
    console.log("Album's tracks:", data);
    let albumTracksList = data.body.items;
  res.render('viewtracks', {albumTracksList} );
})
.catch(err => console.log('The error while searching artists occurred: ', err));
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
