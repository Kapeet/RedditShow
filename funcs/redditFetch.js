const { default: axios } = require('axios');
var Scraper = require('images-scraper');

async function fetchImagesFrom(query, limit) {

  const google = new Scraper({
    puppeteer: {
      headless: true,
    },
  });
  
  const results = []
  try {
    results.push(...await google.scrape(query, limit));
  }
  catch (err) {
    console.log('results error', err)
  }
  if (!results.length) return;
  
  console.log({length: results.length})
  //   const url = FETCH_URasL.replace('{subredditname}', subredditname).replace('{limit}',limit);
	// const posts =  response.data.data.children;
	const images = results.map(res => {
    const {url, title} = res;
		if (!url || !title || !isUrlValid(url)) return;

		return {url, title};
		
	});
	//return the array with all the URLs
	return images.filter(Boolean);
    
  }
  
const isUrlValid = url => url && url.includes('https') && 
                (
                  url.endsWith('.png') ||
                  url.endsWith('.jpg') ||
                  url.endsWith('.jpeg') ||
                  url.endsWith('.bmp')
                )

module.exports = fetchImagesFrom;