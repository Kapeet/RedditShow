// var urlToImage = require('url-to-image');
var https = require("https"),
    fs = require("fs"),
    path = require("path");
  const sharp = require("sharp");

module.exports = {
  /**
   * Download an image from a url to the 'images' directory
   * @param {string} url - url to download the image from
   * @param {string} directory - \images directory
   * @param {number} index - foreach loop index
   */
  downloadImage(url, directory, index, images) {
    let filepath = directory+'\\'+index+'.jpg';
    let finalFilePath = directory+'\\'+index+'Resized.jpg';
    return new Promise((resolve, reject) => {
      //http get request for the image
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => {
                      //once the image has been successfully downloaded, resize the image.
                      module.exports.resizeImage(filepath, directory, index);
                      resolve(finalFilePath);
                    });
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
            
        });
    });
  },

  /**
   * Resize an image to 1920x1080, we do this because later on when making the slideshow, 
   * the module just straight up breaks if you feed it 2 pictures with different resolutions. 
   * By resizing all the images to the same resolution we avoid this issue.
   * @param {string} inputFile 
   */
  resizeImage(inputFile, directory, index)
  {
    let outputFile = directory+'\\'+index+'Resized.jpg';
    sharp(inputFile)
      .jpeg({
        quality: 100,
        chromaSubsampling: '4:4:4'
      })
    .resize({ height: 1080, width: 1920, fit: 'contain'})
    .toFile(outputFile)
    .then(function (newFileInfo) {

      //Remove original unresized file
      fs.unlinkSync(inputFile, (err) => {
        if (err) throw err;
        console.log('file '+index+' was deleted');
        });

    })
    .catch(function (err) {
      console.log(err);
      console.log("input file: "+inputFile);
    });
  },
  /**
   * Delete all files in \images
   * TODO: this isn't working for some reason
   * @param {string} directory 
   */
  emptyFolder(directory)
  {
    //get a list of all the files in the images directory
    let files = fs.readdirSync(directory);
    if (files.length > 0)
    {
      try //i put a try-catch since this fs.unlinksync may throw an error despite working as intended
      {
        //go over each file and delete them from the folder.
        files.forEach(file => {
          fs.unlinkSync(directory+"\\"+file);
        });
      }
      catch (e)
      {
        console.error("Error while emptying folder: \n\n"+e);
      }
    }
    else {
      console.log("images folder is already empty!");
    }
  },
  /**
   * main function for turning links into images inside \images
   * @param {string array} URLs - an array of string links for raw image files
   */
  makeImagesFrom(URLs) {
    return new Promise ((resolve,reject) => {

      let limit = URLs.length;
      let images = [];
      //check that the folder is empty, if not, delete all images.
      console.log('deleting existing files...');
      let directory = __dirname+'\\images';
      module.exports.emptyFolder(directory);
      
      URLs.forEach(async (url, index) => {
        try 
        {
            //push file path into the images array      
            images.push(await module.exports.downloadImage(url, directory, index));
            //when all images are in the array, return the array.
            if (images.length == limit)
            {
              resolve(images);
            }
            console.log(images.length+"/"+limit);
            console.log(`==============`);
        }
          catch (err){console.error(err);reject();}
        });
        
    }).catch(e => console.error(e));
       
  },
};
