const fs = require('fs');
const cheerio = require('cheerio'); // Let's install cheerio to parse it easily

const html = fs.readFileSync('pg_rendered.html', 'utf-8');
const $ = cheerio.load(html);

const games = [];

// They usually have game cards, let's just find ALL images that match
// And also try to find the text node nearby.
// Looking at common pgsoft layout, games are often in standard blocks
$('li.game-item, div.game-item-wrap, a.game-item').each((i, el) => {
    const title = $(el).find('h3, h4, .title, .name').text().trim();
    const img = $(el).find('img').attr('src');

    if (img && title && img.includes('uploads/Games')) {
        games.push({ title, img });
    }
});

if (games.length === 0) {
    // Strategy 2: just find any image inside uploads/Games
    $('img').each((i, el) => {
        let src = $(el).attr('src') || $(el).attr('data-src');
        let title = $(el).attr('alt') || $(el).attr('title');

        if (src && src.includes('uploads/Games')) {
            if (src.startsWith('/')) src = "https://www.pgsoft.com" + src;
            if (!title) {
                // Try getting parent text
                title = $(el).parent().text().trim() || $(el).parent().parent().text().trim();
            }
            if (title) {
                games.push({ title, img: src });
            }
        }
    });
}

// deduplicate
const unique = [];
const seen = new Set();
games.forEach(g => {
    if (!seen.has(g.title)) {
        seen.add(g.title);
        unique.push({ n: g.title, i: g.img });
    }
});

fs.writeFileSync('pg_extracted_games.json', JSON.stringify(unique, null, 2));
console.log(`Extracted ${unique.length} games`);
