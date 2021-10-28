// var a = "test";
const fetch = require("node-fetch");
module.exports = {
  fetchImagesFrom(subredditname, limit) {
    let url = `https://www.reddit.com/r/${subredditname}/top.json?sort=top&t=all&limit=${limit}&q=cat&nsfw=1&include_over_18=on`;
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
            // console.log(url)
            if (url.includes("/gallery/")) {//check if url is a gallery link - figure out what the direct url is
              //get gallery
              url = resolveGalleryImage(url);
              // console.log("after resolving gallery: "+url);
            }
            //break if url is nothing
            if (url == null)
            {
              return;
            }
            // console.log("b4 format url: "+url);
            //Validate that the URL we recieved is a direct link to an image file.
            if (url.includes('https') && !url.includes('/comments/') && url != null && !url.includes('v.redd.it') && 
                (
                  url.endsWith('.png') ||
                  url.endsWith('.jpg') ||
                  url.endsWith('.jpeg') ||
                  url.endsWith('.bmp')
                )
              )
            {
                URLs.push(url); //if the URL is valid, push it into the array of URLs.
            }
          }
        });
        //return the array with all the URLs
        return URLs;
      })
      .catch(function (error) {
        console.log(error);
        return null;
      });
  },
};
/**
 * This function checks what the image format is. 
 * Ex: For a URL that ends with ".jpg", the function will return the string ".jpg"
 * I use this function to figure out reddit gallery links, since getting the image file from these links
 * is a bit finnicky.
 * @param {string} url 
 * @returns a string that says the format of the URL image
 */
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
/**
 * This function takes in a reddit gallery URL and finds the actual URL of the image
 * The reason i use this function is because reddit gallery links are a bit problematic
 * and you need to do some weird stuff to find the link of a raw image file from a gallery link.
 * @param {string} url 
 */
function resolveGalleryImage(url)
{
  //The url contains an id for the raw image file itself, we're gonna take that id 
  // and make another api request for that specific image file
  var id = (url.split('/'))[4]
  fetch(`https://www.reddit.com/comments/${id}.json`)
  .then((response) => response.json())
  .then((response) => {
      //get image id from response data
      try 
      {
        var imageID = response.data.children[0].data.gallery_data.items[0].media_id;
      
        //use the id to figure out the image format
        var imageMIMEType = ((response.data.children[0].data.media_metadata)[imageID]).m;
        var imageFormat = getImageFormat(imageMIMEType);
        
        //return the final gallery url
        var finalURL = ("https://i.redd.it/"+imageID+"."+imageFormat);
        // console.log("final gallery URL:"+finalURL)
        
        return finalURL;
      }
      catch 
      {
        return null;
      }
  })
  .catch(function (error) { //catch any errors that might happen and log them to console
    console.log(error);
    return null;
  });
}
