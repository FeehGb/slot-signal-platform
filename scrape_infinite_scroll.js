const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    let allGames = [];

    // Intercept API responses
    page.on('response', async (res) => {
        const url = res.url();
        if (url.includes('api') && res.request().resourceType() === 'xhr') {
            try {
                const text = await res.text();
                // Just log the URL and first 100 chars to see what APIs are called
                console.log(`API called: ${url}`);
                const json = JSON.parse(text);

                // Let's recursively search for anything resembling a game
                function findGames(obj) {
                    if (!obj || typeof obj !== 'object') return;
                    if (obj.title && obj.url && obj.url.includes('jpg')) {
                        allGames.push({ title: obj.title, image: obj.url });
                    } else if (obj.title && obj.image) {
                        allGames.push({ title: obj.title, image: obj.image });
                    } else {
                        for (const key in obj) findGames(obj[key]);
                    }
                }
                findGames(json);
            } catch (e) { }
        }
    });

    await page.goto('https://www.pgsoft.com/en/games/all/', { waitUntil: 'networkidle2' });

    // Scroll to bottom multiple times to trigger lazy loading
    for (let i = 0; i < 15; i++) {
        await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
        await new Promise(r => setTimeout(r, 800)); // wait for network
    }

    // Try finding images in the DOM as a fallback
    const domGames = await page.evaluate(() => {
        const result = [];
        document.querySelectorAll('img').forEach(img => {
            let src = img.src || img.dataset.src;
            if (src && src.includes('uploads/Games')) {
                // Try parent text as title
                let title = img.alt || img.title;
                if (!title) {
                    const parentText = img.closest('.game-item, li, a');
                    if (parentText) title = parentText.innerText.split('\n')[0].trim();
                }
                result.push({ title: title, image: src });
            }
        });
        return result;
    });

    // Merge
    let combined = [...allGames, ...domGames];

    // Deduplicate
    const unique = [];
    const seen = new Set();
    for (const g of combined) {
        if (!g.title || g.title.length < 2) continue;
        if (!seen.has(g.title)) {
            seen.add(g.title);
            unique.push(g);
        }
    }

    console.log(`Found ${unique.length} games. Sample:`, unique.slice(0, 5));
    require('fs').writeFileSync('pgsoft_scraped.json', JSON.stringify(unique, null, 2));

    await browser.close();
})();
