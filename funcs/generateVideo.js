
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
	const images = (fs.readdirSync(FILE_PATH, (e, files) => files)).map(image => `${FILE_PATH}\\${image}`).filter(img => img.includes('Resized'))
	//wait a bit so videoShow doesn't freak out if a file is missing.
	setTimeout(() =>{
		videoShow(images, VIDEO_OPTIONS)
		.save('video.mp4')
		.on('start', command => {
			console.log('ffmpeg process started:', command)
		})
		.on('progress', progress => console.log(`progress: ${Math.floor(progress.percent)}%`,))
		.on('error',  (err, stdout, stderr) => {
			console.error(err)
			console.error('ffmpeg stdout:', stdout)
			console.error('ffmpeg stderr:', stderr)
		})
		.on('end', function (output) {
			console.log('Video created in:', output)
		});
	} ,2500)
}


module.exports = generateVideo;