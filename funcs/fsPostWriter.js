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

		const imageDownloadPath = `${FILE_PATH}/${title}.${imageFileExtension}`
		const outputFile = `${FILE_PATH}/${title}Resized.${imageFileExtension}`
		await downloadAndResizeImage(image.url, imageDownloadPath, outputFile);
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


async function downloadAndResizeImage(url, InputFile, resizedImagePath) {

    client.get(url, (res) => {
        res.pipe(fs.createWriteStream(InputFile))
		.on('error', err => {
			if (err) console.log('fs writestream error: ',err);
			return;
		})
		.once('close', () => {
			sharp(InputFile)
			.resize({ height: 1080, width: 1920, fit: 'contain'})
			.toFile(resizedImagePath)
			.then(() => {
		
			//Remove original unresized file
			fs.unlinkSync(InputFile, (err) => {
				if (err) console.warn('unlink error: ',err)
				return;
				});
		
			})
			.catch(err => console.log('sharp error: ',err));
		});
    }).on('error', err => generateGetError(err, InputFile));


	
}

function generateGetError(err, InputFile) {
	if (err.code) {
		console.log({
			error: err.code,
			file: InputFile
		})
	}
}

module.exports = downloadImagesFromURLs