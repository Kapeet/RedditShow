const downloadImagesFromURLs = require("./funcs/fsPostWriter");
const fetchImagesFrom  = require("./funcs/redditFetch");
const FILE_PATH = './images'


const generateVideo = require("./funcs/generateVideo");

async function main(limit = 5){

	const URLs = await fetchImagesFrom('food',limit);
	await downloadImagesFromURLs(URLs, FILE_PATH);
	console.log('images successfully downloaded')
	
	generateVideo();
	console.log('done')
}
main();