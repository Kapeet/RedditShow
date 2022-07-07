const downloadImagesFromURLs = require("./funcs/fsPostWriter");
const fetchImagesFrom  = require("./funcs/redditFetch");


async function main(){

	const URLs = await fetchImagesFrom('Berserk',10);
	console.log({URLs})
	await downloadImagesFromURLs(URLs);
}
main();