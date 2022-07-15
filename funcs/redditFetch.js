const { default: axios } = require('axios');
var Scraper = require('images-scraper');

const FETCH_URL = `https://www.reddit.com/r/{subredditname}/top.json?sort=top&t=all&limit={limit}&q=cat&nsfw=1&include_over_18=on`;

async function fetchImagesFrom(query, limit) {

  const google = new Scraper({
    puppeteer: {
      headless: false,
    },
  });
  
  const results = await google.scrape(query, limit);
  console.log('results', results);
  //   const url = FETCH_URL.replace('{subredditname}', subredditname).replace('{limit}',limit);
	// const posts =  response.data.data.children;
	const URLs = results.map(res => {
    const url = res.url
		if (!url || !isUrlValid(url)) return;

		return url;
		
	});
	//return the array with all the URLs
	return URLs.filter(Boolean);
    
  }


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

module.exports = fetchImagesFrom;