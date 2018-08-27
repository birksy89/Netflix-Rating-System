const express = require('express');
const os = require('os');
let ratings = require("./api/ratings");
let netflix = require("./api/netflix");

const app = express();

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send(os.userInfo()));

app.get("/api/getNetflix", function(req, res) {
   netflix.getMyList().then(
     function(){
      res.send("Downloaded / Updated My Netflix List");
     }
    
   )

   
  
});

app.get("/api/downloadRatings", function(req, res) {
    ratings.download()
    .then(function(data) {
      res.send(data);
    })
    .catch(function(er) {
      res.send(er);
    })
  });

app.get("/api/getRatings", function(req, res) {
    res.send(ratings.load());
});
app.listen(8080, () => console.log('Listening on port 8080!'));
