import { config } from './config.js'

const appHelper = require('./polyGroup');
const API_KEY = config.API_KEY; 
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
function parseData(data) 
{
  console.log(data);

  const total = ["balance", "total", "due","sub-total","sale"];

  var totalMatch = null;

  for (let i = 0; i < total.length; i++) 
  {
    if(totalMatch != null)
    {
      break;
    }
    totalMatch = data.filter(data => data.includes(total[i]));

  }

  const regexCurrency = /^[+-]?[0-9]{1,3}(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)$/;

  console.log(regexCurrency.test(totalMatch));
  console.log(String(totalMatch).match(regexCurrency));
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

    const lower = mergedArray.map(mergedArray => mergedArray.toLowerCase());

    parseData(lower);

    return lower
      ? lower
      : { text: "This image doesn't contain any text!" };
  }

  export default callGoogleVisionAsync;