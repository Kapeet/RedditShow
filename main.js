const fetchFromReddit = require("./fetchfromreddit");
const urls2imgs = require("./urls2imgs");
const slideshow = require("./slideshow");
(async function main() {
  var limit = 100;
  var nsfw = true;
  //step 1, fetch images from reddit
  await fetchFromReddit
    .fetchImagesFrom("Maplestory", limit, nsfw)

    //step 2, turn the urls into image files
    .then((URLs) => 
    {
      console.log("Finished fetching! URLs: "+URLs);
      return urls2imgs.makeImagesFrom(URLs);
    })
    
    //step 3, compile them into a slideshow
    .then((URLs) => {
      console.log("Finished creating images! urls: "+URLs[0].url);
      slideshow.create(URLs, limit)
    })
    .catch(err => console.log("ERROR!!! "+err))
    
  // urls2imgs.makeImagesFrom(URLs);
  // slideshow.create(URLs, limit);
})();
