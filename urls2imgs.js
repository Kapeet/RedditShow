// var urlToImage = require('url-to-image');
const { url } = require("@ffmpeg-installer/ffmpeg");
var http = require('http');
var https = require("https"),
  Stream = require("stream").Transform,
  fs = require("fs");


module.exports = {
  makeImagesFrom(URLs) {
    console.log("Turning URLs into image files...");
    var streamReader;
    URLs.forEach((post, index) => {
      console.log(post.url);
      try
      {
        https.request(post.url, function (response) {
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
      }
      catch
      {

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
      }
    });
    return URLs;
  },
};
