//file name: helperFunctions.js


const path = require('path')
require('dotenv').config({ path: path.resolve('.env') })


const appHelper = require('./polyGroup');

<<<<<<< HEAD
<<<<<<< HEAD
const API_KEY = process.env.API_KEY; //put your key here.
=======

const API_KEY = 'AIzaSyAngrsVnz24GwDhPQYzt7iBWMwOBxJpjJ0'; //put your key here.
>>>>>>> parent of e242a12 (added API Key Protection)
=======

const API_KEY = 'AIzaSyAngrsVnz24GwDhPQYzt7iBWMwOBxJpjJ0'; //put your key here.
>>>>>>> parent of e242a12 (added API Key Protection)
//this endpoint will tell Google to use the Vision API. We are passing in our key as well.
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
function generateBody(image) {
  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            type: 'TEXT_DETECTION', //we will use this API for text detection purposes.
            maxResults: 1,
          },
        ],
      },
    ],
  };
  return body;
}

async function callGoogleVisionAsync(image) {
    const body = generateBody(image); //pass in our image for the payload
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();

    const mergedArray = appHelper.initLineSegmentation(result.responses[0]);
  
    console.log(mergedArray);
  
    return mergedArray
      ? mergedArray
      : { text: "This image doesn't contain any text!" };
  }

  export default callGoogleVisionAsync;