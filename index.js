const fetchFromReddit = require("./fetchfromreddit");
const urls2imgs = require("./urls2imgs");
const slideshow = require("./slideshow");
(async function main() {
  var limit = 100;
  //step 1, fetch images from reddit
  var URLs = await fetchFromReddit.fetchImagesFrom("Berserk", limit);

  //step 2, turn the urls into image files
  console.log("Finished fetching! URLs:");
  console.log(URLs);
  var images = await urls2imgs.makeImagesFrom(URLs);
  
  console.log("images:::::::::");
  console.log(images);
  
  //step 3, compile them into a slideshow
  slideshow.create(images);
  
  //log a message to console when everything is finished.
  console.log("Finished creating images!");
})();
