const https = require('https');

https.get('https://www.pgsoft.com/en/games/all/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    // Busca regex de links JS e JSON da pagina.
    const gameMatch = data.match(/window\.__NUXT__=(.*?);<\/script>/);
    if(gameMatch) {
       console.log("Found NUXT data!");
       // This is a naive extraction. Parsing the entire NUXT object could be complicated.
    }
    
    // Let's try to extract <img alt="Game Name" src="... uploads/Games/Images/ ...">
    const imgRegex = /<img[^>]+src="([^"]*\/uploads\/Games\/Images\/[^"]*\.jpg)"[^>]+alt="([^"]+)"/g;
    let match;
    const games = [];
    while ((match = imgRegex.exec(data)) !== null) {
      games.push({ title: match[2], image: match[1] });
    }
    console.log("Img Regx extraction:", games.slice(0, 5));
    
    // Also try checking for data-src
     const dataImgRegex = /<img[^>]+data-src="([^"]*\/uploads\/Games\/Images\/[^"]*\.jpg)"[^>]+alt="([^"]+)"/g;
     let dataMatch;
     const dataGames = [];
     while ((dataMatch = dataImgRegex.exec(data)) !== null) {
       dataGames.push({ title: dataMatch[2], image: dataMatch[1] });
     }
     console.log("Data Img Regx extraction:", dataGames.slice(0, 5));
  });
});
