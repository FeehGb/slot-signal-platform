const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto('https://www.pgsoft.com/en/games/all/', { waitUntil: 'networkidle2' });

    const html = await page.content();
    fs.writeFileSync('pg_rendered.html', html);
    await browser.close();
})();
