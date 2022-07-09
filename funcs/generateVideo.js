
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
  const FILE_PATH = './images'
  
async function generateVideo(){
	const images = []
	fs.readdir(FILE_PATH, (err, files) => {
		if (err) throw err;
		files.forEach(async file => {
			if (!file) return;
			
			const inputFile = `${FILE_PATH}/${file}`;
			const outputFile = `${FILE_PATH}/Resized${file}`;
			console.log({file, outputFile})
			try {
				await sharp(inputFile).resize({ height: 1080, width: 1920 }).toFile(outputFile);
				images.push(outputFile)
			}
			catch (err) {
				console.log(err);
				
			}
		})	
	});
	console.log({images})
	fs.readdir(FILE_PATH, (e, f) => console.log(f))
	// videoShow(images, VIDEO_OPTIONS)
	// .save('video.mp4')
	// .on('start', function (command) {
	// 	console.log('ffmpeg process started:', command)
	// })
	// .on('error', function (err, stdout, stderr) {
	// 	console.error('Error:', err)
	// 	console.error('ffmpeg stdout:', stdout)
	// 	console.error('ffmpeg stderr:', stderr)
	// })
	// .on('end', function (output) {
	// 	console.log('Video created in:', output)
	// })
}


module.exports = generateVideo;