const downloadImagesFromURLs = require("./funcs/fsPostWriter");
const fetchImagesFrom  = require("./funcs/redditFetch");
const FILE_PATH = './images'

const fs = require('fs');
const sharp = require('sharp')
const videoShow = require('videoShow')

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath)


async function main(){

	const URLs = await fetchImagesFrom('Berserk',10);
	console.log({URLs})
	await downloadImagesFromURLs(URLs, FILE_PATH);
	
	
	const images = []
	fs.readdir(FILE_PATH, (err, files) => {
		if (err) throw err;
		files.forEach(async file => {
			if (!file) return;
			
			const inputFile = `C:/Users/Amogus/Desktop/RedditShow/images/${file}`;
			const outputFile = `C:/Users/Amogus/Desktop/RedditShow/images/Resized${file}`;
			console.log({file, outputFile})
			try {
				const input = await sharp(inputFile).resize({ height: 1080, width: 1920 }).toFile(outputFile);
				console.log(input)
				images.push(outputFile)
			}
			catch (err) {
				console.log('sharp error',{err, file});
				
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
main();