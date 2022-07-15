const downloadImagesFromURLs = require("./funcs/fsPostWriter");
const fetchImagesFrom  = require("./funcs/redditFetch");
const FILE_PATH = './images'


const generateVideo = require("./funcs/generateVideo");

async function main(){

	const URLs = await fetchImagesFrom('Berserk',20);
	console.log({URLs})
	await downloadImagesFromURLs(URLs, FILE_PATH);
	
	generateVideo();
}
main();