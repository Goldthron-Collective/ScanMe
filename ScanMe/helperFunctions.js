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
            type: 'TEXT_DETECTION', //we willl use this API for text detection purposes.
            maxResults: 1,
          },
        ],
      },
    ],
  };
  return body;
}
function parseDate(data) 
{

}
function parseCurrency(data) 
{

}
function parseData(data) 
{
  //find date
  //find total and remove everthing after that in array
  //find currency
  //find money in total using currency 
  //find each item and hashmap key/value pair for item/price


  //console.log(data);
  //const date = //regex of all date formats
  //const items = //regex of money 
  const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  const dateReg = /^(?:(?:(?:0[1-9]|1\d|2[0-8])(?:0[1-9]|1[0-2])|(?:29|30)(?:0[13-9]|1[0-2])|31(?:0[13578]|1[02]))[1-9]\d{1}|2902(?:(?:0[48]|[2468][048]|[13579][26])|00))$/;
  
  const currencyRegex = /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/;
  const total = ["balance", "total", "due","sub-total","sale"];

  var totalMatch = [];
  var date = [];
  var currency = null;

  for(let i = 0; i < data.length; i++)
  {
    date = data[i].match(dateReg);
    if(date != null)
    {
      break;
    }
  }
  for(let i = 0; i < data.length; i++)
  {
    currency = data[i].match(currencyRegex);
    if(currency != null)
    {
      break;
    }
  }

  console.log(date);
  console.log(currency);
  
 
 

  

  for (let i = 0; i < total.length; i++) 
  {
    if(totalMatch != 0)
    {
      break;
    }
    totalMatch = data.filter(data => data.includes(total[i]));
  }

  totalMatch = String(totalMatch);
  console.log(totalMatch);
  
 

 
  var doublenumber = Number(totalMatch .replace(/[^0-9\.]+/g,""));
  alert(doublenumber); 
 
  
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