// var a = "test";
const fetch = require("node-fetch");
module.exports = {
  async fetchImagesFrom(subredditname, limit, nsfw) {
    var allowNSFW = (nsfw ? '&q=cat&nsfw=1&include_over_18=on' : '');
    let url = `https://www.reddit.com/r/${subredditname}/new.json?sort=top&t=day&limit=${limit}${allowNSFW}`;
    console.log("fetching images from reddit.. \n fetch url: \n" + url);
    return fetch(url)
      .then((response) => response.json())
      .then((response) => {
        var posts = response.data.children;
        var URLs = [];
        posts.map((post, index) => {
          var url = post.data.url;
          var object = Postify(url);
          if (object) {
            console.log("added post #" +index+" out of "+posts.length);
            URLs.push(object);
          }
        });
        return URLs;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};

function Postify(url) {
  if (url.includes("/gallery/")) {
    //get gallery
  }
  if (url.endsWith(".png")) {
    return { url: url, type: "png" };
  }
  if (url.endsWith(".jpg")) {
    return { url: url, type: "jpg" };
  }
  if (url.endsWith(".jpeg")) {
    return { url: url, type: "jpeg" };
  }
  return null;
}
