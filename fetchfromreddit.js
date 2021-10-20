// var a = "test";
const fetch = require("node-fetch");
module.exports = {
  fetchImagesFrom(subredditname, limit, nsfw) {
    var allowNSFW = (nsfw ? '&q=cat&nsfw=1&include_over_18=on' : '');
    let url = `https://www.reddit.com/r/${subredditname}/top.json?sort=top&t=all&limit=${limit}${allowNSFW}`;
    console.log("fetching images from reddit.. \n fetch url: \n" + url);
    return fetch(url)
      .then((response) => response.json())
      .then((response) => {
        //get response data
        var posts = response.data.children;
        //prepare a URL array
        var URLs = [];
        //push response data to URL array
        posts.forEach(post => {
          var url = post.data.url;
          if (url != undefined)
          {
            console.log(url)
            if (url.includes("/gallery/")) {//check if url is a gallery link - figure out what the direct url is
              //get gallery
              url = resolveGalleryImage(url);
              console.log("after resolving gallery: "+url);
            }
            if (url == null)
            {
              return;
            }
            //create a new object with 2 properties, 1) URL - url. 2) type - image format (png/jpg/jpeg)
            console.log("b4 format url: "+url);
            // var imageFormat = getImageFormat(url);
            // var object = {
            //   url: url,
            //   type: imageFormat
            // }
            if (url.includes('https') && !url.includes('/comments/') && url != null && !url.includes('v.redd.it') && 
                (
                  url.endsWith('.png') ||
                  url.endsWith('.jpg') ||
                  url.endsWith('.jpeg') ||
                  url.endsWith('.bmp')
                )
              ){
              URLs.push(url);
            }
          }
        });
        return URLs;
      })
      .catch(function (error) {
        console.log(error);
        return null;
      });
  },
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

function resolveGalleryImage(url)
{
  var id = (url.split('/'))[4]
  fetch(`https://www.reddit.com/comments/${id}.json`)
  .then((response) => response.json())
  .then((response) => {
    //Note to reddit: FUCK YOUR API
      //get image id from response data
      try {
        var imageID = response.data.children[0].data.gallery_data.items[0].media_id;
      
        //use the id to figure out the image format
        var imageMIMEType = ((response.data.children[0].data.media_metadata)[imageID]).m;
        var imageFormat = getImageFormat(imageMIMEType);
        //return the final gallery url
        var finalURL = ("https://i.redd.it/"+imageID+"."+imageFormat);
        console.log("final gallery URL:"+finalURL)
        
        return finalURL;
      }
      catch 
      {
        return null;
      }
  })
  .catch(function (error) {
    console.log(error);
    return null;
  });
}
