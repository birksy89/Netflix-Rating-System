const axios = require("axios");
const _ = require("lodash");
const path = require("path");

module.exports = {
  download: function() {
    return new Promise((resolve, reject) => {
      let rawData = require("fs").readFileSync( __dirname + "/../data/netflixList.json");
      parsedData = JSON.parse(rawData);

      //Axios arrays
      let promises = [];
      let dataArr = [];

      //The system is limited to 40 API calls a second... Temp Fix/
      //TODO: Split arrays, wait 1000ms, process next array
      console.log(`Incoming array size= ${parsedData.length}`);
      if (parsedData.length > 40) {
        while (parsedData.length > 40) {
          parsedData.pop();
        }
        //Reduced to 40
        //console.log(parsedData.length);
      }

      parsedData.forEach(title => {
        promises.push(
          axios
            .get(
              `https://api.themoviedb.org/3/search/multi?api_key=35ba9fa081c2115ca3fb49ce685aa314&language=en-US&query=${title}&page=1&include_adult=false`
            )
            .catch(function(error) {
              console.log(`Failed to get data for ${title} `);
              return {
                status: 404,
                statusText: `Failed to get data for ${title}  - ${error}`
              };
            })
        );
      });

      axios
        .all(promises)
        .then(function(results) {
          results.forEach(function(res) {
            if (res.status == 200 && res.data.results[0]) {
              let item = res.data.results[0];
              let itemName = item.name || item.title;
              dataArr.push(item);
              console.log(itemName);
            } else {
              console.error(res.config.url);
              //reject(`Failed: ${res.statusText}`);
            }
          });

          //Order the array - By highest rated- descending
          dataArr = _.orderBy(dataArr, "vote_average", "desc");

          module.exports.save(dataArr);
          resolve(dataArr);
        })
        .catch(function(error) {
          reject();
          console.log("Another error", error);
        });
    });
  },
  save: function(data) {
    require("fs").writeFile(
      __dirname + "/../data/ratings.json",

      JSON.stringify(data),

      function(err) {
        if (err) {
          console.error("Error writing file", err);
        }
      }
    );
  },
  load: function(data) {
    let rawData = require("fs").readFileSync(
      __dirname + "/../data/ratings.json"
    );
    parsedData = JSON.parse(rawData);

    return parsedData;
  }
};
