const { default: axios } = require('axios');
var Scraper = require('images-scraper');

const FETCH_URL = `https://www.reddit.com/r/{subredditname}/top.json?sort=top&t=all&limit={limit}&q=cat&nsfw=1&include_over_18=on`;

async function fetchImagesFrom(query, limit) {

  const google = new Scraper({
    puppeteer: {
      headless: true,
    },
  });
  
  const results = await google.scrape(query, limit);
  //   const url = FETCH_URL.replace('{subredditname}', subredditname).replace('{limit}',limit);
	// const posts =  response.data.data.children;
	const images = results.map(res => {
    const {url, title} = res;
		if (!url || !title || !isUrlValid(url)) return;

		return {url, title};
		
	});
	//return the array with all the URLs
	return images.filter(Boolean);
    
  }
  
const isUrlValid = url => url && url.includes('https') && !url.includes('/comments/') && !url.includes('v.redd.it') && 
                (
                  url.endsWith('.png') ||
                  url.endsWith('.jpg') ||
                  url.endsWith('.jpeg') ||
                  url.endsWith('.bmp')
                )

module.exports = fetchImagesFrom;