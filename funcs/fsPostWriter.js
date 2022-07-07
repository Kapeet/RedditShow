const fs = require('fs');
const client = require('https');

const FILE_PATH = './images'
async function downloadImagesFromURLs(URLs = [  'https://i.redd.it/xcapm5mbvg071.png']) {
	if (!URLs.length) throw new Error('No URLs provided to write')
	
	URLs.forEach(url => {
		const imageFileExtension = url.split('.')[url.split('.').length - 1];
		console.log(imageFileExtension)
		const imageDownloadPath = `${FILE_PATH}/${index}.${imageFileExtension}`
		downloadImage(url, imageDownloadPath);
	})

}


function downloadImage(url, filepath) {
    client.get(url, (res) => {
        res.pipe(fs.createWriteStream(filepath));
    });
}

module.exports = downloadImagesFromURLs