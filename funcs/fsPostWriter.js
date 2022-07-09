const fs = require('fs');
const client = require('https');

async function downloadImagesFromURLs(URLs = [], FILE_PATH) {
	if (!URLs.length) throw new Error('No URLs provided to write')
	
	removePreviousImagesFromFolder(FILE_PATH);

	URLs.forEach((url, index) => {
		const imageFileExtension = url.split('.')[url.split('.').length - 1];
		const imageDownloadPath = `${FILE_PATH}/${index}.${imageFileExtension}`
		downloadImage(url, imageDownloadPath);
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


function downloadImage(url, filepath) {
    client.get(url, (res) => {
        res.pipe(fs.createWriteStream(filepath));
    });
}

module.exports = downloadImagesFromURLs