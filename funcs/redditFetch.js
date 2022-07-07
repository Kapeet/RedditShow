const { default: axios } = require('axios');

const FETCH_URL = `https://www.reddit.com/r/{subredditname}/top.json?sort=top&t=all&limit={limit}&q=cat&nsfw=1&include_over_18=on`;

async function fetchImagesFrom(subredditname, limit) {
    const url = FETCH_URL.replace('{subredditname}', subredditname).replace('{limit}',limit);

	const response = await axios.get(url)
	const posts =  response.data.data.children;
	const URLs = posts.map((post,index) => {
		const url = post.data.url;
		if (!url) return;
		
		if (url.includes("/gallery/")) {//check if url is a gallery link - figure out what the direct url is
			return resolveGalleryImage(url);
		}
		if (!url) return
		//Validate that the URL we recieved is a direct link to an image file.
		if (!isUrlValid(url)) return;
		console.log(`url #${index}: `,url)
		return url;
		
	});
	//return the array with all the URLs
	return URLs.filter(Boolean);
    
  };


function getImageFormat(url) {
  if (url.endsWith(".png")) {
    return "png";
  }
  else if (url.endsWith(".jpg")) {
    return "jpg";
  }
  else if (url.endsWith(".jpeg")) {
    return "jpeg";
  }
  return null;
}


const isUrlValid = url => url && url.includes('https') && !url.includes('/comments/') && !url.includes('v.redd.it') && 
                (
                  url.endsWith('.png') ||
                  url.endsWith('.jpg') ||
                  url.endsWith('.jpeg') ||
                  url.endsWith('.bmp')
                )

/**
 * This function takes in a reddit gallery URL and finds the actual URL of the image
 * The reason i use this function is because reddit gallery links are a bit problematic
 * and you need to do some weird stuff to find the link of a raw image file from a gallery link.
 * @param {string} url 
 */
async function resolveGalleryImage(url) {
  const rawImageId = (url.split('/'))[4]
  if (!rawImageId) return;
 
  const res = await axios.get(`https://www.reddit.com/comments/${rawImageId}.json`)
  
  const json = res.data;
  if (!json) return;
        const fetchedImageId = json.data.children[0].data.gallery_data.items[0].media_id;
      
        //use the id to figure out the image format
        const imageMIMEType = (response.data.children[0].data.media_metadata[fetchedImageId]).m;
        const imageFormat = getImageFormat(imageMIMEType);
        
        return `https://i.redd.it/${fetchedImageId}.${imageFormat}`;
      
}


module.exports = fetchImagesFrom;