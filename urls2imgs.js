// var urlToImage = require('url-to-image');
var http = require("https"),
  Stream = require("stream").Transform,
  fs = require("fs");

module.exports = {
  makeImagesFrom(URLs) {
    console.log("Turning URLs into image files...");
    var streamReader;
    URLs.forEach((post, index) => {
      console.log(post.url);
      http.request(post.url, function (response) {
          var data = new Stream();

          response.on("data", function (chunk) {
            data.push(chunk);
          });

          response.on("end", function () {
            streamReader = data.read();
            if (streamReader) {
              fs.writeFileSync("./images/" + index + "URL." + post.type,streamReader);
            }
          });
        }).end();
    });
    return URLs;
  },
};
