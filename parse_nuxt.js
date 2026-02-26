const fs = require('fs');
const https = require('https');

https.get("https://www.pgsoft.com/en/games/all/", (res) => {
  let body = "";
  res.on("data", chunk => body += chunk);
  res.on("end", () => {
    let match = body.match(/window\.__NUXT__=(.*?);<\/script>/);
    if(match) {
        fs.writeFileSync('/tmp/nuxt.txt', match[1]);
        console.log("Wrote nuxt extraction. Checking length: ", match[1].length);
    }
  });
});
