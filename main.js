const fetchFromReddit = require("./fetchfromreddit");
const urls2imgs = require("./urls2imgs");
const slideshow = require("./slideshow");
(async function main() {
  var limit = 100;
  var nsfw = true;
  //step 1, fetch images from reddit
  await fetchFromReddit
    .fetchImagesFrom("MapleStory", limit, nsfw)

    //step 2, turn the urls into image files
    .then((URLs) => urls2imgs.makeImagesFrom(URLs))

    //step 3, compile them into a slideshow
    .then((URLs) => slideshow.create(URLs, limit));
  // urls2imgs.makeImagesFrom(URLs);
  // slideshow.create(URLs, limit);
})();
