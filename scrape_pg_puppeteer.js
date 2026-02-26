const puppeteer = require('puppeteer');

(async () => {
    const games = [];

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Intercept responses to catch any JSON that might contain the game list
    page.on('response', async (res) => {
        const url = res.url();
        if (url.includes('api') && url.includes('game')) {
            try {
                const text = await res.text();
                const json = JSON.parse(text);
                if (json && json.data && json.data.games) {
                    console.log("Found API response with games:", json.data.games.length);
                    json.data.games.forEach(g => {
                        games.push({
                            title: g.title || g.gameName || g.name,
                            image: g.image || g.thumbnail || g.img
                        });
                    });
                }
            } catch (e) {
                // Ignore
            }
        }
    });

    await page.goto('https://www.pgsoft.com/en/games/all/', { waitUntil: 'networkidle2' });

    // Wait to see if we got JSON API games
    if (games.length === 0) {
        // Fallback: scrape DOM elements
        const domGames = await page.evaluate(() => {
            const items = document.querySelectorAll('li, div.game-item, a.game-item');
            const result = [];
            items.forEach(el => {
                const img = el.querySelector('img');
                const titleEl = el.querySelector('.title, h3, h4, .name');
                if (img && img.src && img.src.includes('uploads/Games')) {
                    result.push({
                        title: titleEl ? titleEl.innerText : img.alt,
                        image: img.src
                    });
                }
            });
            return result;
        });
        games.push(...domGames);
    }

    // Cleanup duplicates
    const uniqueGames = [];
    const seen = new Set();
    for (const g of games) {
        if (g && g.title && g.image && !seen.has(g.title)) {
            seen.add(g.title);
            // Correct img src if needed (remove query params)
            const img = g.image.split('?')[0];
            uniqueGames.push({ n: g.title, i: img });
        }
    }

    console.log(JSON.stringify(uniqueGames, null, 2));

    await browser.close();
})();
