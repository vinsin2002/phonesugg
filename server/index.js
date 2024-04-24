import puppeteer from 'puppeteer';
import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'vinsin@_132linux',
  database: 'smartphones'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    defaultViewport: false,
    userDataDir: './tmp',
  });
  const page = await browser.newPage();

  let items = [];
  let pageCount = 0;

  async function scrapeCurrentPage() {
    await page.waitForSelector('._1AtVbE.col-12-12', { timeout: 10000 });
    const productHandles = await page.$$('._1AtVbE.col-12-12');

    for (const productHandle of productHandles) {
      let pname = null;
      let price = null;
      let image = null;
      let RAM = null;
      let ROM = null;
      let DisplayType = null;
      let DisplaySize = null;
      let Battery = null;
      let ProcessorName = null;
      let RearCamera = null;
      let FrontCamera = null;
      let numberOfRatings = null;
      let nscore = null;
      try {
        pname = await productHandle.$eval('._4rR01T', el => {
            // Get the text content of pname element
            let text = el.textContent.trim();
            // Remove brackets and trim the remaining string
            text = text.replace(/\([^)]*\)/g, '').trim();
            return text;
        });
      } catch (error) {
      }

      try {
        let priceText = await productHandle.$eval('._30jeq3._1_WHN1', el => el.textContent);
        price = parseFloat(priceText.replace(/[^\d.]/g, ''));
      } catch (error) {
      }

      try {
        image = await productHandle.$eval('._396cs4', el => el.getAttribute("src"));
      } catch (error) {
      }
      try {
        const userRatingElement = await productHandle.$('._3LWZlK');
        const userRating = await userRatingElement.evaluate(el => el.textContent.trim());// Log the user rating
        function calculateScore(avgRating, numRatings, C) {
          const weight = numRatings / (numRatings + C);
          const weightedAvg = avgRating * weight;
          const scoreOutOf10 = (weightedAvg / 5) * 10;
          return scoreOutOf10;
      }      
        const ratingsElement = await productHandle.$('.gUuXy- ._2_R_DZ span:nth-child(1)');
        const ratingsText = await ratingsElement.evaluate(el => el.textContent.trim());
        numberOfRatings = parseInt(ratingsText.replace(/,/g, ''), 10);
        nscore = calculateScore(userRating,numberOfRatings,5000); // Log the number of ratings
    } catch (error) {
        console.error("Error getting user rating or number of ratings:", error);
    }
    
    
      try {
        const detailsElements = await productHandle.$$('._1xgFaf li');
        for (const detailElement of detailsElements) {
          const detailText = await detailElement.evaluate(node => node.textContent.trim());
            if (detailText.includes("RAM")) {
                const parts = detailText.split("|");
                const ramPart = parts[0].trim();
                const romPart = parts[1].trim(); 
                const ramValue = ramPart.split(" ")[0];
                const romValue = romPart.split(" ")[0]; 
                RAM = parseInt(ramValue);
                ROM = parseInt(romValue);
            }
            if(detailText.includes("Display"))
            {
                const inchMatch = detailText.match(/\(([\d.]+) inch\)/);
                const inch = inchMatch ? inchMatch[1] : null;
                const displayTypeMatch = detailText.match(/\) (.+?) Display/);
                const displayType = displayTypeMatch ? displayTypeMatch[1] : null;
                DisplaySize = parseInt(inch);
                DisplayType = displayType;
            }
            if(detailText.includes("Battery"))
            {
                const mAhMatch = detailText.match(/(\d+) mAh/);
                const mAh = mAhMatch ? mAhMatch[1] : null;
                Battery = parseInt(mAh);
            }
            if(detailText.includes("Processor"))
            {
              let processorIndex = detailText.indexOf("Processor");
              if (processorIndex > 0) {
              let result = detailText.substring(0, processorIndex).trim();
                ProcessorName = result;
              }
            }
            if(detailText.includes("Camera")){
              const regex = /(\d+)MP\s*\|\s*(\d+)MP\s*Front\s*Camera/;
              const match = detailText.match(regex);
              let mpValues = detailText.match(/\d+MP/g);
    mpValues = mpValues.map(mp => parseInt(mp));
    let maxMP = Math.max(...mpValues);
              FrontCamera = parseInt(match[2]);
              RearCamera = maxMP;
          }
        }
      } catch (error) {
      }

      if (pname !== "NULL") {
        items.push({ pname, price, image, RAM, ROM, DisplaySize, DisplayType, Battery, ProcessorName, FrontCamera, RearCamera, nscore, numberOfRatings });
      }
    }
  }

  async function clickNextButton() {
    try {
      await page.waitForSelector('._1LKTO3');
      const nextButtons = await page.$$('._1LKTO3');
      if (nextButtons.length > 1) {
        const nextButton = await nextButtons[1].asElement();
        await nextButton.click();
        return true;
      } else if (nextButtons.length === 1) {
        const nextButton = await nextButtons[0].asElement(); 
        await nextButton.click();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error clicking next button:", error);
      return false;
    }
  }

  await page.goto('https://www.flipkart.com/search?sid=tyy%2C4io&p%5B%5D=facets.network_type%255B%255D%3D5G&ctx=eyJjYXJkQ29udGV4dCI6eyJhdHRyaWJ1dGVzIjp7InRpdGxlIjp7Im11bHRpVmFsdWVkQXR0cmlidXRlIjp7ImtleSI6InRpdGxlIiwiaW5mZXJlbmNlVHlwZSI6IlRJVExFIiwidmFsdWVzIjpbIlNob3AgTm93Il0sInZhbHVlVHlwZSI6Ik1VTFRJX1ZBTFVFRCJ9fX19fQ%3D%3D&otracker=clp_metro_expandable_1_5.metroExpandable.METRO_EXPANDABLE_Shop%2BNow_mobile-phones-store_92P8Y0U07S00_wp4&fm=neo%2Fmerchandising&iid=M_e7ba0063-e82c-43ac-b47b-eea4a19864c3_5.92P8Y0U07S00&ppt=hp&ppn=homepage&ssid=6yiks006uo0000001685101006655');

  let hasNextPage = true;
  while (hasNextPage && pageCount < 10) {
    await scrapeCurrentPage();
    hasNextPage = await clickNextButton();
    pageCount++;
    if (!hasNextPage) {
    }
  }
  await browser.close();
// Insert data into MySQL database
const searchProcessorName = async (phoneName) => {
    const brow = await puppeteer.launch(
        {
          headless: "new"
          }
    );
    const pag = await brow.newPage();
    try {
        await pag.goto(`https://www.google.com/search?q=${encodeURIComponent(phoneName)}+processor+name`);
        const processorName = await pag.evaluate(() => {
          const processorElement = document.querySelector('span.hgKElc b');
          return processorElement ? processorElement.textContent : null;
        });
        
        if (!processorName) {
          await brow.close();
        }
    
        return processorName;
      } catch (error) {
        console.error('Error searching Google:', error);
        await brow.close();
        return null;
      }
  };
const searchProcessorSid = async (processorName) => {
  return new Promise((resolve, reject) => {
    if (!processorName) {
      resolve(null); 
      return;
    }
    let modifiedProcessorName = processorName.toLowerCase();
const wordsToRemove = ["mediatek", "qualcomm", "5g", "mobile", "processor", "platform", "superfast", "2.6ghz", "first", "india's"];
wordsToRemove.forEach(word => {
  modifiedProcessorName = modifiedProcessorName.replace(new RegExp('\\b' + word + '\\b', 'gi'), '');
});
modifiedProcessorName = modifiedProcessorName.trim();
modifiedProcessorName = modifiedProcessorName.replace(/\b\w*\(.*?\)\w*\b|\b\w*nm\w*\b|\b\w*ghz\w*\b/g, '');
modifiedProcessorName = modifiedProcessorName.replace(/(\d+)\+/g, '$1 plus');
modifiedProcessorName = modifiedProcessorName.replace(/[\(\)]|\+/g, '');

modifiedProcessorName = modifiedProcessorName.trim();
    // Query the database based on modifiedProcessorName
    connection.query('SELECT sid, ProcessorName FROM soc WHERE ProcessorName LIKE ?', [`%${modifiedProcessorName}%`], (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (results.length > 0) {
        resolve(results[0].sid); // Return the first sid if match found
        return;
      }

      // If no results found with modifiedProcessorName, try with extractedValue
      const regex = /\b\d+\b/;
      const match = processorName.match(regex);
      const extractedValue = match ? match[0] : null;

      if (extractedValue) {
        connection.query('SELECT sid, ProcessorName FROM soc WHERE ProcessorName LIKE ?', [`%${extractedValue}%`], (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          if (results.length > 0) {
            resolve(results[0].sid); // Return the first sid if match found
            return;
          }
          resolve(null); // Return null if no match found
        });
      } else {
        resolve(null); // Return null if no extracted value
      }
    });
  });
};


const insertValues = async () => {
    try {
      for (const item of items) {
        if (item.pname !== null) {
          const existingEntry = await checkExistingEntry(item.pname,item.RAM,item.ROM);
          if (!existingEntry) {
            if(!item.ProcessorName){const processorName = await searchProcessorName(item.pname);
                item.ProcessorName = processorName;   
            }
            const sid = await searchProcessorSid(item.ProcessorName);
            if (sid !== null) {
                // If sid found, update ProcessorName with sid
                item.ProcessorName = sid;
            } else {
                // If no sid found, set ProcessorName to null
                item.ProcessorName = null;
            }
            const value = [
              item.pname,
              item.price,
              item.image,
              item.RAM || null,
              item.ROM || null,
              item.DisplaySize || null,
              item.DisplayType || null,
              item.Battery || null,
              item.ProcessorName || null,
              item.FrontCamera || null,
              item.RearCamera || null,
              item.nscore || null,
              item.numberOfRatings || null
            ];
            // console.log(value);
            await insertValue(value);
          } else {
            // console.log(`Skipping duplicate entry for ${item.pname}`);
          }
        }
      }
      console.log('Data inserted into MySQL.');
      console.log(`Number of phones scrapped: ${items.length}`);
    } catch (error) {
      console.error('Error inserting data into MySQL:', error);
    } finally {
      connection.end(); // Close the MySQL connection
    }
  };
  
  const checkExistingEntry = (pname,ram,rom) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT COUNT(*) AS count FROM phonedetails WHERE RAM  = ? and ROM = ? ', [pname,ram,rom], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0].count > 0);
        }
      });
    });
  };
  
  const insertValue = (value) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO phonedetails (pname, price, image, RAM, ROM, DisplaySize, DisplayType, Battery, pid, FrontCamera, RearCamera, userscore, nusers) VALUES (?)', [value], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
  
  // Usage
  insertValues();
  
})();
