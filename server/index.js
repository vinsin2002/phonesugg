import puppeteer from 'puppeteer';
import fs from 'fs';
import Sentiment from 'sentiment';
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

      try {
        pname = await productHandle.$eval('._4rR01T', el => el.textContent);
      } catch (error) {
      }

      try {
        price = await productHandle.$eval('._30jeq3._1_WHN1', el => el.textContent);
      } catch (error) {
      }

      try {
        image = await productHandle.$eval('._396cs4', el => el.getAttribute("src"));
      } catch (error) {
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
                ProcessorName = result;}
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
        items.push({ pname, price, image, RAM, ROM, DisplaySize, DisplayType, Battery, ProcessorName, FrontCamera, RearCamera });
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
        console.log("No button found.");
        return false;
      }
    } catch (error) {
      console.error("Error clicking next button:", error);
      return false;
    }
  }

  await page.goto('https://www.flipkart.com/search?sid=tyy%2C4io&p%5B%5D=facets.network_type%255B%255D%3D5G&ctx=eyJjYXJkQ29udGV4dCI6eyJhdHRyaWJ1dGVzIjp7InRpdGxlIjp7Im11bHRpVmFsdWVkQXR0cmlidXRlIjp7ImtleSI6InRpdGxlIiwiaW5mZXJlbmNlVHlwZSI6IlRJVExFIiwidmFsdWVzIjpbIlNob3AgTm93Il0sInZhbHVlVHlwZSI6Ik1VTFRJX1ZBTFVFRCJ9fX19fQ%3D%3D&otracker=clp_metro_expandable_1_5.metroExpandable.METRO_EXPANDABLE_Shop%2BNow_mobile-phones-store_92P8Y0U07S00_wp4&fm=neo%2Fmerchandising&iid=M_e7ba0063-e82c-43ac-b47b-eea4a19864c3_5.92P8Y0U07S00&ppt=hp&ppn=homepage&ssid=6yiks006uo0000001685101006655');

  let hasNextPage = true;
  while (hasNextPage && pageCount < 100) {
    await scrapeCurrentPage();
    hasNextPage = await clickNextButton();
    pageCount++;
    if (!hasNextPage) {
      console.log("No more pages to scrape.");
    }
  }

  const jsonOutput = JSON.stringify(items, null, 2);
  fs.writeFileSync('scraped_data.json', jsonOutput);

  // Insert data into MySQL database
  const insertQuery = 'INSERT INTO phoneDetails (pname, price, image, RAM, ROM, DisplaySize, DisplayType, Battery, ProcessorName, FrontCamera, RearCamera) VALUES ?';
 // Adjust the values array before inserting into MySQL
 const values = items
 .filter(item => item.pname !== null) // Filter out items with pname as 'NULL'
 .map(item => {
   return [
     item.pname,
     item.price,
     item.image,
     item.RAM || null, // If RAM is null in the JavaScript object, insert null into the database
     item.ROM || null, // If ROM is null in the JavaScript object, insert null into the database
     item.DisplaySize || null, // If DisplaySize is null in the JavaScript object, insert null into the database
     item.DisplayType || null, // If DisplayType is null in the JavaScript object, insert null into the database
     item.Battery || null, // If Battery is null in the JavaScript object, insert null into the database
     item.ProcessorName || null, // If ProcessorName is null in the JavaScript object, insert null into the database
     item.FrontCamera || null, // If FrontCamera is null in the JavaScript object, insert null into the database
     item.RearCamera || null // If RearCamera is null in the JavaScript object, insert null into the database
   ];
 });


  connection.query(insertQuery, [values], (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      return;
    }
    console.log('Data inserted into MySQL.');
    console.log(`Number of phones scrapped : ${items.length}`);

    connection.end(); // Close the MySQL connection
  });
  console.log("Scraping completed. Data saved to 'scraped_data.json'.");
  console.log(`Number of phones scrapped : ${items.length}`);
  await browser.close();
})();
