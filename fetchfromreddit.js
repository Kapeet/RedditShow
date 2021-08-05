// var a = "test";
const fetch = require("node-fetch");
module.exports = {
    async fetchImagesFrom(subredditname,limit) {
        let url = `https://www.reddit.com/r/${subredditname}/top.json?sort=top&t=day&limit=${limit}`
        return fetch(url)
            .then(response => response.json())
            .then(response => {
                var posts = response.data.children
                var URLs = [];
                posts.map(post => {
                    var url = post.data.url;
                    var object = Postify(url)
                    if (object)
                    {
                        console.log("type "+object.type)
                        URLs.push(object)
                    }
                })
                return URLs;
            })
            .catch(function(error) {
                console.log(error);
            });  
    },
}

function Postify(url){
    if (url.endsWith('.png'))
    {
        return {url: url, type: "png"}
    }
    if (url.endsWith('.jpg'))
    {
        return {url: url, type: "jpg"}
    }
    if (url.endsWith('.jpeg'))
    {
        return {url: url, type: "jpeg"}
    }
    return null;
}