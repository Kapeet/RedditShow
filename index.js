const fetchFromReddit = require("./fetchfromreddit");
const urls2imgs = require("./urls2imgs");
const slideshow = require("./slideshow");
(async function main() {
  var limit = 100;
  var nsfw = true;
  //step 1, fetch images from reddit
  var URLs = await fetchFromReddit.fetchImagesFrom("MapleStory", limit, nsfw);

  //step 2, turn the urls into image files
  console.log("Finished fetching! URLs:");
  console.log(URLs);
  var images =  urls2imgs.makeImagesFrom(URLs, URLs.length)

  console.log("images:::::::::");
  console.log(images);
  // slideshow.create(images);
    
    //step 3, compile them into a slideshow
  //console.log("Finished creating images! url[0]: "+URLs[0].url);
  
    
})();
