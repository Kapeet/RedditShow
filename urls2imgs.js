// var urlToImage = require('url-to-image');
var http = require('http');
var https = require("https"),
  Stream = require("stream").Transform,
  fs = require("fs");

  const sharp = require("sharp");

module.exports = {
  
   makeImagesFrom(URLs, limit) {
    console.log("Turning URLs into image files...");
     var streamReader;
    var images = [];
    
     URLs.forEach((post, index) => {
      try
      {
        https.request(post, function (response) {
          var data = new Stream();
          response.on("data", function (chunk) {
            data.push(chunk);
          });
          response.on("end", function () {
            streamReader = data.read();
            if (streamReader) {
              fs.writeFile("./images/" + index+".jpg",streamReader, (err) => {
                let inputFile = `./images/`+index+".jpg";
                let outputFile = `./images/${index}ResizedURL.jpg`;

                sharp(inputFile)
                    .jpeg({
                      quality: 100,
                      chromaSubsampling: '4:4:4'
                    })
                  .resize({ height: 1080, width: 1920, fit: 'contain'})
                  .toFile(outputFile)
                  .then(function (newFileInfo) {
                    //TODO: images get pushed URLs of files that have yet to be created, so the slideshow function crashes
                    //fix this somehow
                    console.log(newFileInfo)
                    console.log("file #"+images.length+" of #"+limit);
                  })
                  .catch(function (err) {
                    console.log(err);
                    console.log("input file:");
                    console.log(inputFile);
                  });
                images.push(outputFile);
               
              });
              // console.log("successfully turned "+post.url+" to image!");
            }
          });
        }).end();
      }
      catch (e)
      {
        console.log(e);
      
      }
      if (images.length >= limit)
      {
        return images;
      }
    })
  },
};
