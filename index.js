const downloadImagesFromURLs = require("./funcs/fsPostWriter");
const fetchImagesFrom  = require("./funcs/redditFetch");
const FILE_PATH = './images'


const generateVideo = require("./funcs/generateVideo");

async function main(){

	const URLs = await fetchImagesFrom('food',1);
	console.log({URLs})
	await downloadImagesFromURLs(URLs, FILE_PATH);
	
	generateVideo();
}
main();