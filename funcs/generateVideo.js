
const fs = require('fs');
const sharp = require('sharp')
const videoShow = require('videoShow')

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath)


const VIDEO_OPTIONS = {
	fps: 25,
	loop: 5, // seconds
	transition: true,
	transitionDuration: 1, // seconds
	videoBitrate: 1024,
	videoCodec: 'libx264',
	size: '640x?',
	audioBitrate: '128k',
	audioChannels: 2,
	format: 'mp4',
	pixelFormat: 'yuv420p'
  };
  const FILE_PATH = `${process.cwd()}\\images`
  
function generateVideo(){
	const images = (fs.readdirSync(FILE_PATH, (e, files) => files)).map(image => `${FILE_PATH}\\${image}`)

	videoShow(images, VIDEO_OPTIONS)
	.save('video.mp4')
	.on('start', function (command) {
		console.log('ffmpeg process started:', command)
	})
	.on('progress', progress => console.log("progress: ",progress))
	.on('error', function (err, stdout, stderr) {
		console.error('Error:', err)
		console.error('ffmpeg stdout:', stdout)
		console.error('ffmpeg stderr:', stderr)
	})
	.on('end', function (output) {
		console.log('Video created in:', output)
	});
}


module.exports = generateVideo;