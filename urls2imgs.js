// var urlToImage = require('url-to-image');
var http = require('https'),                                                
    Stream = require('stream').Transform,                                  
    fs = require('fs');                                                    

module.exports = {
    makeImagesFrom(URLs) {
        var streamReader;
        var format;
        URLs.forEach((post, index) => {
            http.request(post.url, function(response) {                                        
                var data = new Stream();                                                    
    
                response.on('data', function(chunk) {                                       
                    data.push(chunk);                                                         
                });                                                                         
    
                response.on('end', function() {
                    streamReader = data.read();
                    if (streamReader)
                    {
                        fs.writeFileSync('./images/'+index+'URL.'+post.type, streamReader);
                    }
                });             
            }).end();
        })
        return URLs;
    },
}