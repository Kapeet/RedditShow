const fs = require('fs');
const client = require('https');
const sharp = require('sharp');

async function downloadImagesFromURLs(Images = [], FILE_PATH) {
	if (!Images.length) throw new Error('No URLs provided to write')
	
	removePreviousImagesFromFolder(FILE_PATH);

	Images.forEach(image => {
		const {url} = image;
		const title =  encodeURIComponent(image.title);
		const imageFileExtension = url.split('.')[url.split('.').length - 1];
		const imageDownloadPath = `${FILE_PATH}/${title}.${imageFileExtension}`
		const outputFile = `${FILE_PATH}/${title}Resized.${imageFileExtension}`
		downloadAndResizeImage(image.url, imageDownloadPath, outputFile);
	})

}

function removePreviousImagesFromFolder(dirname){
	fs.readdir(dirname, (err, files) => {
		if (err) throw err;
		files.forEach(file => {
			const fileUrl = `${dirname}/${file}`
			fs.unlink(fileUrl, err => {
				if (err) throw err;
			});
		})
	});
}


function downloadAndResizeImage(url, InputFile, resizedImagePath) {
	console.log({url, InputFile, resizedImagePath});
    client.get(url, (res) => {
        res.pipe(fs.createWriteStream(InputFile))
		.on('error', err => {
			if (err) throw err;
		})
		.once('close', () => {
			sharp(InputFile)
			.resize({ height: 1080, width: 1920, fit: 'contain'})
			.toFile(resizedImagePath)
			.then(() => {
		
			//Remove original unresized file
			fs.unlinkSync(InputFile, (err) => {
				if (err) throw err;
				});
		
			})
			.catch(function (err) {
			console.log(err);
			console.log("input file: "+InputFile);
			});
		});
    });
}

module.exports = downloadImagesFromURLs