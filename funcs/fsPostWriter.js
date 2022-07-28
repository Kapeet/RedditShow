const fs = require('fs');
const client = require('https');
const sharp = require('sharp');

async function downloadImagesFromURLs(Images = [], FILE_PATH) {
	if (!Images.length) throw new Error('No URLs provided to write')
	
	await removePreviousImagesFromFolder(FILE_PATH);

	Images.forEach(async (image, index) => {
		const {url} = image;
		const title = `image_${index}`;
		const imageFileExtension = url.split('.')[url.split('.').length - 1];
		
		if (!imageFileExtension || !title || !url) return;
		
		const outputFile = `${FILE_PATH}/${title}Resized.${imageFileExtension}`

		await downloadAndResizeImage(image.url, outputFile);
	})

}

async function removePreviousImagesFromFolder(dirname){
	console.log('removing existing images')
	fs.readdirSync(dirname, (err, files) => {
		if (!files?.length) return;

		if (err) console.log(err);

		files.forEach(file => {
			const fileUrl = `${dirname}/${file}`
			fs.unlink(fileUrl, err => {
				if (err) console.log(err);
			});
		})
	});
}


async function downloadAndResizeImage(url, resizedImagePath) {

    client.get(url, (res) => {
		const data = []

		res.on('data', function(chunk) {
			data.push(chunk);
		}).on('end', function() {
			const buffer = Buffer.concat(data);
			sharp(buffer)
			.resize({ height: 1080, width: 1920, fit: 'contain'})
			.toFile(resizedImagePath)
			.catch(err => console.log('sharp error: ',err));
		});
    }).on('error', err => generateGetError(err, url));


	
}

function generateGetError(err, url) {
	if (err.code) {
		console.log({
			error: err.code,
			url,
		})
	}
}

module.exports = downloadImagesFromURLs