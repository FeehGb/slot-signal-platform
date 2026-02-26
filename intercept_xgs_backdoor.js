const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    let apisCalled = [];

    page.on('response', async (res) => {
        const url = res.url();
        if (["xhr", "fetch"].includes(res.request().resourceType()) && !url.includes("google") && !url.includes("facebook") && !url.includes("cloudflare")) {
            console.log("Found API:", url);
            try {
                const text = await res.text();
                // Check if it's JSON and has some interesting keys
                if (text.startsWith('{') || text.startsWith('[')) {
                    const obj = JSON.parse(text);
                    // Very naive heuristic to find game lists
                    if (JSON.stringify(obj).toLowerCase().includes("game")) {
                        console.log("Interesting payload on:", url);
                        apisCalled.push({ url, body: text.slice(0, 500) });
                    }
                }
            } catch (e) { }
        }
    });

    try {
        console.log("Opening page with the developer backdoor...");
        await page.goto('https://xgs0t7.com/game/category/ELECTRONIC/23?pid=3708690480&_ts===gMyUCMxMTO0kzNzEjM3cTMyITJ&check=0', { waitUntil: 'networkidle2' });
        console.log("Done waiting.");
    } catch (e) {
        console.log("Error loading page:", e);
    }

    fs.writeFileSync('/tmp/xgs_apis_backdoor.json', JSON.stringify(apisCalled, null, 2));
    await browser.close();
})();
