const videoShow = require("videoshow");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const sharp = require("sharp");
module.exports = {
  create(URLs, limit) {
    console.log("creating video file...");
    var images = [];
    var videoOptions = {
      fps: 25,
      loop: 5, // seconds
      transition: true,
      transitionDuration: 1, // seconds
      videoBitrate: 1024,
      videoCodec: "libx264",
      size: "640x?",
      audioBitrate: "128k",
      audioChannels: 2,
      format: "mp4",
      pixelFormat: "yuv420p",
    };
    for (var i = 0; i < limit; i++) {
      if (URLs[i]) {
        let inputFile = `./images/${i}URL.${URLs[i].type}`;
        let outputFile = `./images/${i}ResizedURL.${URLs[i].type}`;

        sharp(inputFile)
          .resize({ height: 1080, width: 1920 })
          .toFile(outputFile)
          .then(function (newFileInfo) {
            // newFileInfo holds the output file properties
            console.log("File #"+i+"Succeded out of #"+URLs.length);
          })
          .catch(function (err) {
            console.log(err);
            console.log(inputFile);
          });
        images.push(outputFile);
      }
    }
    videoShow(images, videoOptions)
      .audio("song.mp3")
      .save("video.mp4")
      .on("start", function (command) {
        console.log("ffmpeg process started:", command);
      })
      .on("error", function (err, stdout, stderr) {
        console.error("Error:", err);
        console.error("ffmpeg stdout:", stdout);
        console.error("ffmpeg stderr:", stderr);
      })
      .on("end", function (output) {
        console.error("Video created in:", output);
      });
  },
};
