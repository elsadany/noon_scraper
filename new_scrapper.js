const puppeteer = require('puppeteer');

async function scrapeNoon(url) {

    const browser = await puppeteer.launch({ 
        headless: true,
        executablePath: '/home/s/.cache/puppeteer/chrome/linux-139.0.7258.66/chrome-linux64/chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Spoof a common browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        const data = await page.evaluate(() => {
        const getText = (selector) => document.querySelector(selector)?.innerText?.trim() || null;
        const getSrc = (selector) => document.querySelector(selector)?.src || null;

        return {
            title: getText('.ProductTitle_title__vjUBn'),
            price: getText('.PriceOfferV2_priceNowText__fk5kK'),
            image: getSrc('.MediaPreloader_mediaContainer__R7rMe div img'),
            description: getText('.OverviewDescription_overviewDesc__S6sdv'),
        }; 
        });

        console.log(JSON.stringify(data, null, 2));
        return data;
    } catch (err) {
        console.error("❌ Scraping failed:", err.message);
        return {success:false,error:err.message};
    } finally {
        await browser.close(); 
    }
}

module.exports = scrapeNoon;