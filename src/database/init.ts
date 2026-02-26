import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', '..', 'database', 'data.db');
let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initTables();
    seedData();
  }
  return db;
}

function initTables(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS plataformas (
      id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL,
      url_afiliado TEXT NOT NULL, logo_url TEXT DEFAULT '', ativo INTEGER DEFAULT 1,
      criado_em TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS jogos (
      id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL,
      imagem_url TEXT NOT NULL, provedor TEXT DEFAULT 'Desconhecido',
      plataforma_id INTEGER, ativo INTEGER DEFAULT 1,
      criado_em TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (plataforma_id) REFERENCES plataformas(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS sinais_ativos (
      id INTEGER PRIMARY KEY AUTOINCREMENT, jogo_id INTEGER NOT NULL,
      win_rate REAL DEFAULT 0, nivel_bet TEXT DEFAULT 'media', valor_bet REAL DEFAULT 0,
      data_hora_inicio TEXT DEFAULT (datetime('now')), data_hora_fim TEXT NOT NULL,
      FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS logs_scraping (
      id INTEGER PRIMARY KEY AUTOINCREMENT, tipo TEXT NOT NULL,
      alvo TEXT DEFAULT '', status TEXT NOT NULL, mensagem TEXT DEFAULT '',
      criado_em TEXT DEFAULT (datetime('now'))
    );
  `);
  try { db.exec("ALTER TABLE sinais_ativos ADD COLUMN nivel_bet TEXT DEFAULT 'media'"); } catch { }
  try { db.exec("ALTER TABLE sinais_ativos ADD COLUMN valor_bet REAL DEFAULT 0"); } catch { }
}

// ===================== PLATAFORMAS =====================
const PLATAFORMAS = [
  { nome: '11TT4', url: 'https://11tt4.com/?pid=3708690480', logo: '' },
  { nome: '51FF6', url: 'https://51ff6.com/?pid=2663324366', logo: '' },
  { nome: '5FFFJ', url: 'https://5fffj.com/?pid=3767619193', logo: '' },
  { nome: '66GG12', url: 'https://66gg12.xyz/?pid=1774770279', logo: '' },
  { nome: '68G15', url: 'https://68g15.com/?pid=4008516663', logo: '' },
  { nome: '72E99', url: 'https://72e99.com/?pid=4506722204', logo: '' },
  { nome: '85K885', url: 'https://85k885.com/?pid=2443300909', logo: '' },
  { nome: '8857Q11', url: 'https://8857q11.com/?pid=2116778803', logo: '' },
  { nome: '98A3', url: 'https://98a3.xyz/?pid=1587968288', logo: '' },
  { nome: 'NNZZ4', url: 'https://nnzz4.com/?pid=1287479414', logo: '' },
  { nome: 'Q8Q33', url: 'https://q8q33.vip/?pid=3689210583', logo: '' },
];

// ===================== CATÁLOGO COMPLETO DE JOGOS =====================
type G = { n: string; i: string };

// PG Soft thumbnails — pattern from their CDN
const PG = 'https://www.pgsoft.com/games-icon/900/';
const PP = 'https://img.b112j.com/bj/h5/assets/images/game-id/vs-pragmaticplay';

const PG_SOFT: G[] = [
  { n: "Fortune Horse", i: "https://www.pgsoft.com/uploads/Games/Images/c94741fa-7df8-46d3-8841-8b3e6fa8baa3.jpg" },
  { n: "Forbidden Alchemy", i: "https://www.pgsoft.com/uploads/Games/Images/40574712-13fb-45de-8b4c-61956b7ffdfa.jpg" },
  { n: "Mythical Guardians", i: "https://www.pgsoft.com/uploads/Games/Images/868e2fed-b794-4e62-8bec-cca17ce66f3e.jpg" },
  { n: "Poker Kingdom Win", i: "https://www.pgsoft.com/uploads/Games/Images/45a72f52-b2ab-4a64-a13c-f2633c6fe708.webp" },
  { n: "Alibaba's Cave of Fortune", i: "https://www.pgsoft.com/uploads/Games/Images/ce79987a-6228-4e3f-95f9-19c2a5d344ee.jpg" },
  { n: "Skylight Wonders", i: "https://www.pgsoft.com/uploads/Games/Images/edee4972-7863-4f54-8c87-1337c246908e.jpg" },
  { n: "Pharaoh Royals", i: "https://www.pgsoft.com/uploads/Games/Images/a91a74c1-f908-43cb-9c82-7409a37cdcd0.jpg" },
  { n: "Kraken Gold Rush", i: "https://www.pgsoft.com/uploads/Games/Images/de440243-d423-495a-affc-036b8a43c788.jpg" },
  { n: "Majestic Empire", i: "https://www.pgsoft.com/uploads/Games/Images/804eb27d-8aed-47d4-9fce-806a82d01771.jpg" },
  { n: "Grimms' Bounty: Hansel & Gretel", i: "https://www.pgsoft.com/uploads/Games/Images/dc00e693-18db-4ea0-9656-6aac105bebeb.jpg" },
  { n: "Galaxy Miner", i: "https://www.pgsoft.com/uploads/Games/Images/ae03cb9b-5087-467b-9407-3fb24627a7d3.jpg" },
  { n: "Dragon's Treasure Quest", i: "https://www.pgsoft.com/uploads/Games/Images/60295f12-eeae-4d1f-a6d5-70e2574c7b34.jpg" },
  { n: "Diner Frenzy Spins", i: "https://www.pgsoft.com/uploads/Games/Images/08c45f5e-9462-46c5-9b32-49e1e8f98a75.webp" },
  { n: "Jack the Giant Hunter", i: "https://www.pgsoft.com/uploads/Games/Images/45fb4019-4095-43f1-a1e5-2eed2e697dc5.jpg" },
  { n: "Dead Man's Riches", i: "https://www.pgsoft.com/uploads/Games/Images/654961f8-840a-4c36-a093-17e4a7c1b25d.webp" },
  { n: "Knockout Riches", i: "https://www.pgsoft.com/uploads/Games/Images/5e2fe7a0-e09f-483a-9f9d-a599a53c12b3.webp" },
  { n: "Doomsday Rampage", i: "https://www.pgsoft.com/uploads/Games/Images/b122216a-7949-4fbe-a3e7-16469d50f492.webp" },
  { n: "Graffiti Rush", i: "https://www.pgsoft.com/uploads/Games/Images/e8aac80c-9be2-4df8-8d4d-227dd8abf4ce.webp" },
  { n: "Mr. Treasure's Fortune", i: "https://www.pgsoft.com/uploads/Games/Images/771afd0b-be40-4a4f-9bf1-9bd0ffe95036.webp" },
  { n: "Fortune Snake", i: "https://www.pgsoft.com/uploads/Games/Images/8e6eb645-c23e-4408-956e-9882f754d8cd.webp" },
  { n: "Incan Wonders", i: "https://www.pgsoft.com/uploads/Games/Images/19b9fb5b-a62a-497c-8da4-ffb9d3ef70d4.webp" },
  { n: "Geisha’s Revenge", i: "https://www.pgsoft.com/uploads/Games/Images/bf53fd9a-93d3-4da8-bacd-1e641cf57bb5.webp" },
  { n: "Chocolate Deluxe", i: "https://www.pgsoft.com/uploads/Games/Images/0cfd842e-53a3-4a8d-bfbf-4575599ca042.webp" },
  { n: "Rio Fantasia", i: "https://www.pgsoft.com/uploads/Games/Images/400aca97-ccdf-4b18-8785-76ec1412d826.webp" },
  { n: "Museum Wonders", i: "https://www.pgsoft.com/uploads/Games/Images/6b0878d1-7b45-4e74-8863-ecc563b27352.webp" },
  { n: "Oishi Delights", i: "https://www.pgsoft.com/uploads/Games/Images/4aceecaa-b0a4-4a88-b625-b855c471eb77.webp" },
  { n: "Three Crazy Piggies", i: "https://www.pgsoft.com/uploads/Games/Images/3ac19c5a-5dba-4499-84d8-1dc77e283070.webp" },
  { n: "Wings of Iguazu", i: "https://www.pgsoft.com/uploads/Games/Images/6bc0d627-e447-4e6c-ae30-04b39aef7724.webp" },
  { n: "Yakuza Honor", i: "https://www.pgsoft.com/uploads/Games/Images/0a2c0782-b020-421b-8b66-f630cda026e1.webp" },
  { n: "Shark Bounty", i: "https://www.pgsoft.com/uploads/Games/Images/fefc4b12-d1c2-4f1b-8af1-77f9608f6f19.webp" },
  { n: "Futebol Fever", i: "https://www.pgsoft.com/uploads/Games/Images/80fc4a91-c18c-436e-8eb0-8414e0b79f0e.webp" },
  { n: "Chicky Run", i: "https://www.pgsoft.com/uploads/Games/Images/77ed874b-fd73-473c-8e45-2a1e8a9b973c.png" },
  { n: "Zombie Outbreak", i: "https://www.pgsoft.com/uploads/Games/Images/07dcc6fb-88bd-42ba-90fd-ea90608802f2.jpg" },
  { n: "Anubis Wrath", i: "https://www.pgsoft.com/uploads/Games/Images/d1e51410-a69d-4676-aee5-e09bcb9b52c5.jpg" },
  { n: "Mystic Potion", i: "https://www.pgsoft.com/uploads/Games/Images/e721c708-e9c8-48d7-9351-92665022b069.webp" },
  { n: "Pinata Wins", i: "https://www.pgsoft.com/uploads/Games/Images/815a44d0-361f-4399-a4ce-c72145cdeac4.png" },
  { n: "Wild Ape #3258", i: "https://www.pgsoft.com/uploads/Games/Images/29904434-8ffd-4174-9a81-c919a5a19237.jpg" },
  { n: "Cash Mania", i: "https://www.pgsoft.com/uploads/Games/Images/66981ee2-24e9-467d-a6a1-7f67a7ad2edc.jpg" },
  { n: "Gemstones Gold", i: "https://www.pgsoft.com/uploads/Games/Images/23201e1c-7939-4c48-afe9-d769175cbea7.jpg" },
  { n: "Fortune Dragon", i: "https://www.pgsoft.com/uploads/Games/Images/72f8d537-77e5-4506-803a-63e7f58d4fec.png" },
  { n: "Dragon Hatch 2", i: "https://www.pgsoft.com/uploads/Games/Images/d6db46aa-ed58-4289-ac03-8dad89d8ce9e.jpg" },
  { n: "Werewolf's Hunt", i: "https://www.pgsoft.com/uploads/Games/Images/48bdb88d-7bb6-4cd9-9339-927ec90d12b3.png" },
  { n: "Tsar Treasures", i: "https://www.pgsoft.com/uploads/Games/Images/46b75320-9308-411e-82aa-210e92112499.png" },
  { n: "Mafia Mayhem", i: "https://www.pgsoft.com/uploads/Games/Images/50d868a3-87a9-43b9-983d-810f92e63c76.png" },
  { n: "Forge of Wealth", i: "https://www.pgsoft.com/uploads/Games/Images/1395658d-9795-4474-8850-5166d52fef68.png" },
  { n: "Wild Heist Cashout", i: "https://www.pgsoft.com/uploads/Games/Images/0993cc3e-579b-4be4-922e-e430db48fe85.jpg" },
  { n: "Ninja Raccoon Frenzy", i: "https://www.pgsoft.com/uploads/Games/Images/b7c9b442-05cb-44e6-8899-89c2a74ba432.jpg" },
  { n: "Gladiator's Glory", i: "https://www.pgsoft.com/uploads/Games/Images/ce400a46-91f6-4077-957f-0e23c8c64082.jpg" },
  { n: "Safari Wilds", i: "https://www.pgsoft.com/uploads/Games/Images/b64a8373-1a78-412c-b0be-d092ebabfd74.jpg" },
  { n: "Cruise Royale", i: "https://www.pgsoft.com/uploads/Games/Images/d9f56ec0-940f-47ab-970c-527778bc2319.png" },
  { n: "Fruity Candy", i: "https://www.pgsoft.com/uploads/Games/Images/c1bd5f08-4f2b-4be1-be13-073a4ceef7e2.jpg" },
  { n: "Lucky Clover Riches", i: "https://www.pgsoft.com/uploads/Games/Images/efa31bad-3e79-4835-90b2-4dee6b0a9551.jpg" },
  { n: "Super Golf Drive", i: "https://www.pgsoft.com/uploads/Games/Images/f5a3fee2-e9c1-4c94-8c34-bfb7522049b0.jpg" },
  { n: "Mystical Spirits", i: "https://www.pgsoft.com/uploads/Games/Images/3c2d82f8-39b7-445f-80e0-da571a55feee.jpg" },
  { n: "Songkran Splash", i: "https://www.pgsoft.com/uploads/Games/Images/9135a412-d5cc-4bc3-98a8-b49628f9c28d.jpg" },
  { n: "Hawaiian Tiki", i: "https://www.pgsoft.com/uploads/Games/Images/8d714c9f-459e-4691-8bba-21f031c0da92.jpg" },
  { n: "Rave Party Fever", i: "https://www.pgsoft.com/uploads/Games/Images/c2ae7e25-6c31-4b54-b2ad-61e98ee88eda.jpg" },
  { n: "Fortune Rabbit", i: "https://www.pgsoft.com/uploads/Games/Images/779f47d5-d1ea-47a0-a68f-50cffb587564.jpg" },
  { n: "Midas Fortune", i: "https://www.pgsoft.com/uploads/Games/Images/07eb87ae-b5e1-4a45-bcce-24e84a9b89e3.jpg" },
  { n: "Diner Delights", i: "https://www.pgsoft.com/uploads/Games/Images/80d7dd60-46f3-45a1-b6b6-884a58703a6a.jpg" },
  { n: "Alchemy Gold", i: "https://www.pgsoft.com/uploads/Games/Images/4e4aa02e-55bb-458a-94bd-e4b8bb627543.jpg" },
  { n: "Totem Wonders", i: "https://www.pgsoft.com/uploads/Games/Images/7eab4d8c-c935-4aeb-b996-10205e081ff3.jpg" },
  { n: "Prosperity Fortune Tree", i: "https://www.pgsoft.com/uploads/Games/Images/5b93c5b9-208d-41a3-88e3-c1e9f6357059.jpg" },
  { n: "Wild Bounty Showdown", i: "https://www.pgsoft.com/uploads/Games/Images/a34e6418-65e3-4431-be3d-4daa8552d5f0.webp" },
  { n: "Wild Coaster", i: "https://www.pgsoft.com/uploads/Games/Images/c162d25c-c3a5-4668-ba6a-0992b66818ad.jpg" },
  { n: "Legend of Perseus", i: "https://www.pgsoft.com/uploads/Games/Images/b3052890-5530-41f6-b166-dee298be3802.jpg" },
  { n: "Speed Winner", i: "https://www.pgsoft.com/uploads/Games/Images/e1ef913d-3c4c-4434-9422-76ddbc9358c4.jpg" },
  { n: "Lucky Piggy", i: "https://www.pgsoft.com/uploads/Games/Images/7202cd99-cb6c-4166-ad82-7fbffed1b876.jpg" },
  { n: "Win Win Fish Prawn Crab", i: "https://www.pgsoft.com/uploads/Games/Images/d29110d1-f56b-4d0b-ac0e-2c8b0e275e7b.jpg" },
  { n: "Battleground Royale", i: "https://www.pgsoft.com/uploads/Games/Images/218ce1b9-422c-4f4c-b171-351554528be4.jpg" },
  { n: "Rooster Rumble", i: "https://www.pgsoft.com/uploads/Games/Images/3ba11aaf-0af3-4af8-95eb-5e554e0543c2.jpg" },
  { n: "Butterfly Blossom", i: "https://www.pgsoft.com/uploads/Games/Images/e4a3a930-894d-4132-b6bd-5801c8478083.jpg" },
  { n: "Destiny of Sun & Moon", i: "https://www.pgsoft.com/uploads/Games/Images/b857989f-cb2e-4b21-b0b1-a10621724c1e.png" },
  { n: "Garuda Gems", i: "https://www.pgsoft.com/uploads/Games/Images/30625379-e7ca-433d-8b6d-241b8c63c0c0.jpg" },
  { n: "Fortune Tiger", i: "https://www.pgsoft.com/uploads/Games/Images/70aab544-e9aa-4451-9d5c-e2d6dcc85a1c.jpg" },
  { n: "Mask Carnival", i: "https://www.pgsoft.com/uploads/Games/Images/d03f47b4-9266-494a-8994-bd8ad7037af8.jpg" },
  { n: "Emoji Riches", i: "https://www.pgsoft.com/uploads/Games/Images/524779d2-9d30-45de-9390-b17566b3cbae.jpg" },
  { n: "Legendary Monkey King", i: "https://www.pgsoft.com/uploads/Games/Images/cd27ddd7-bce4-4322-9386-6d2935045857.png" },
  { n: "Spirited Wonders", i: "https://www.pgsoft.com/uploads/Games/Images/2576a3ec-e213-4ccf-bcaf-c01b4778857f.jpg" },
  { n: "Buffalo Win", i: "https://www.pgsoft.com/uploads/Games/Images/b1c06f7b-2c08-4641-908e-e307224d2709.png" },
  { n: "Raider Jane's Crypt of Fortune", i: "https://www.pgsoft.com/uploads/Games/Images/61d69182-30f5-4f0d-b83c-9385daf62457.jpg" },
  { n: "Supermarket Spree", i: "https://www.pgsoft.com/uploads/Games/Images/23b853aa-d8ef-41f8-9f5b-4f0682b43dbb.png" },
  { n: "Mermaid Riches", i: "https://www.pgsoft.com/uploads/Games/Images/519a69c1-32ec-4568-b13f-4db5d54515b8.jpg" },
  { n: "Heist Stakes", i: "https://www.pgsoft.com/uploads/Games/Images/83581e29-7db2-45f8-b5d8-56e4c721d2d0.jpg" },
  { n: "Wild Bandito", i: "https://www.pgsoft.com/uploads/Games/Images/5bd01b2d-0cc0-4027-89ea-5b639f14a343.png" },
  { n: "Candy Superwin", i: "https://www.pgsoft.com/uploads/Games/Images/f62541ae-087a-4b4d-886a-ac91ef761f82.jpg" },
  { n: "Majestic Treasures", i: "https://www.pgsoft.com/uploads/Games/Images/aa006fb7-5f66-4121-8995-a940cd892607.jpg" },
  { n: "Bali Vacation", i: "https://www.pgsoft.com/uploads/Games/Images/c2478c76-9855-440a-a857-f42b74aa6188.jpg" },
  { n: "Fortune Ox", i: "https://www.pgsoft.com/uploads/Games/Images/2fad9820-8301-4f6c-8f81-e3163cd1022e.jpg" },
  { n: "Guardians of Ice & Fire", i: "https://www.pgsoft.com/uploads/Games/Images/25f58706-cd28-4d79-804c-3f5cab19c0ee.jpg" },
  { n: "Galactic Gems", i: "https://www.pgsoft.com/uploads/Games/Images/2cad4789-47e1-4dd0-a062-8eb7e590e725.png" },
  { n: "Jack Frost's Winter", i: "https://www.pgsoft.com/uploads/Games/Images/3d1df46f-8b45-4622-9110-6e7b23b819f0.jpg" },
  { n: "Jewels of Prosperity", i: "https://www.pgsoft.com/uploads/Games/Images/aa3b1f4f-9376-4ad3-8f60-d337d849b4a6.jpg" },
  { n: "Queen of Bounty", i: "https://www.pgsoft.com/uploads/Games/Images/162b4a4c-02f4-42a1-927f-c07b364d3626.png" },
  { n: "Secrets of Cleopatra", i: "https://www.pgsoft.com/uploads/Games/Images/d34735b4-a239-468c-8c83-0533fcd83a3c.jpg" },
  { n: "Vampire's Charm", i: "https://www.pgsoft.com/uploads/Games/Images/110005ef-7894-43bc-ac82-fa3e4b5ea91b.jpg" },
  { n: "Circus Delight", i: "https://www.pgsoft.com/uploads/Games/Images/2fe31126-e0d9-438d-966a-f883166e449e.jpg" },
  { n: "Genie's 3 Wishes", i: "https://www.pgsoft.com/uploads/Games/Images/2302dc35-e161-4b2c-a940-445791cbffe6.jpg" },
  { n: "Wild Fireworks", i: "https://www.pgsoft.com/uploads/Games/Images/d794e5e7-bf6b-47fb-989f-cfe1c9b7107a.jpg" },
  { n: "Phoenix Rises", i: "https://www.pgsoft.com/uploads/Games/Images/94ea34c5-2eb5-4c75-9cf5-ab6bc63beb2d.jpg" },
  { n: "Mahjong Ways 2", i: "https://www.pgsoft.com/uploads/Games/Images/5f5eb999-bdb9-49a7-82d6-0829797bc6f7.jpg" },
  { n: "Bikini Paradise", i: "https://www.pgsoft.com/uploads/Games/Images/32232163-cb2e-42bc-9e6e-b7320b118044.jpg" },
  { n: "Candy Burst", i: "https://www.pgsoft.com/uploads/Games/Images/579fc3b7-e4bd-49f7-8c09-be89b0123b13.jpg" },
  { n: "Shaolin Soccer", i: "https://www.pgsoft.com/uploads/Games/Images/0e33bbb2-d74a-4221-9f9d-c6b4fdba7e18.jpg" },
  { n: "Reel Love", i: "https://www.pgsoft.com/uploads/Games/Images/6d6eaa3c-9f28-470e-8fc8-a9c6bdd1aad2.png" },
  { n: "Fortune Mouse", i: "https://www.pgsoft.com/uploads/Games/Images/174b2cc1-97dd-4d99-bc82-8f0ce3de3279.jpg" },
  { n: "Dragon Hatch", i: "https://www.pgsoft.com/uploads/Games/Images/1de714c6-45c6-4ec1-af48-41f16e915914.jpg" },
  { n: "Mahjong Ways", i: "https://www.pgsoft.com/uploads/Games/Images/0664c7e3-d8d8-47f1-9150-bfd2e5cb6546.png" },
  { n: "Dragon Tiger Luck", i: "https://www.pgsoft.com/uploads/Games/Images/65152f6d-f74b-44a9-b0f4-da11fd23fdd0.png" },
  { n: "Muay Thai Champion", i: "https://www.pgsoft.com/uploads/Games/Images/786eba8c-64ff-4a74-80dc-307b9e6fee6a.jpg" },
  { n: "Ninja vs Samurai", i: "https://www.pgsoft.com/uploads/Games/Images/e2133b02-1d3c-49bd-b7c7-b880beecc0b3.jpg" },
  { n: "Flirting Scholar", i: "https://www.pgsoft.com/uploads/Games/Images/d078f748-944f-46c1-89aa-d39e73fe1b7e.jpg" },
  { n: "Leprechaun Riches", i: "https://www.pgsoft.com/uploads/Games/Images/57d40efb-9c97-4c1b-977c-921a5f6173b8.jpg" },
  { n: "Captain’s Bounty", i: "https://www.pgsoft.com/uploads/Games/Images/aec579d2-2064-4ea5-b1de-95528adf23f2.jpg" },
  { n: "Journey To The Wealth", i: "https://www.pgsoft.com/uploads/Games/Images/aefebbdb-a2d5-4a84-91b8-43015512099b.jpg" },
  { n: "The Great Icescape", i: "https://www.pgsoft.com/uploads/Games/Images/4c925a6c-09f0-4c69-9325-58f844b18f61.jpg" },
  { n: "Double Fortune", i: "https://www.pgsoft.com/uploads/Games/Images/9de90239-5ff4-4c80-9402-fe0dd5f1a6d4.jpg" },
  { n: "Emperor's Favour", i: "https://www.pgsoft.com/uploads/Games/Images/cb283d3c-c94d-481d-8063-93afaff4d740.jpg" },
  { n: "Jungle Delight", i: "https://www.pgsoft.com/uploads/Games/Images/1a70493d-0733-45d4-84c1-206ddec5bb2d.jpg" },
  { n: "Ganesha Gold", i: "https://www.pgsoft.com/uploads/Games/Images/5f8c672d-cd46-480e-90cf-c0e61ec5769e.jpg" },
  { n: "Symbols of Egypt", i: "https://www.pgsoft.com/uploads/Games/Images/fb6d7d05-8783-41a1-bebc-ec4cd92c883b.jpg" },
  { n: "Piggy Gold", i: "https://www.pgsoft.com/uploads/Games/Images/b92cbcd4-bdde-4729-86b8-775b386a707c.jpg" },
  { n: "Gem Saviour Sword", i: "https://www.pgsoft.com/uploads/Games/Images/ba4f14ab-47f6-4a51-905f-d105b2d6def1.jpg" },
  { n: "Baccarat Deluxe", i: "https://www.pgsoft.com/uploads/Games/Images/ac9b287d-ab0d-4b38-8e99-957b4f538ad6.png" },
  { n: "Santa’s Gift Rush", i: "https://www.pgsoft.com/uploads/Games/Images/3d720aaa-61d9-4ee0-a305-ef8f2bab10ff.jpg" },
  { n: "Hip Hop Panda", i: "https://www.pgsoft.com/uploads/Games/Images/dd810b67-48b0-44c0-b303-bb67664ff9c4.png" },
  { n: "Prosperity Lion", i: "https://www.pgsoft.com/uploads/Games/Images/84a7a24c-6240-4fc2-85fe-015534622461.jpg" },
  { n: "Legend of Hou Yi", i: "https://www.pgsoft.com/uploads/Games/Images/846a6178-ffa6-4abb-b92f-0f8267deb224.jpg" },
  { n: "Mr. Hallow-Jackpot!", i: "https://www.pgsoft.com/uploads/Games/Images/dd69d9ee-c6ff-4617-a142-14e9686f9f6f.png" },
  { n: "Hotpot", i: "https://www.pgsoft.com/uploads/Games/Images/41b0fe80-1b3e-4351-8785-b1dbc4e365fe.png" },
  { n: "Dragon Legend", i: "https://www.pgsoft.com/uploads/Games/Images/fbc99b9e-580b-49bd-9fdc-97741fe983de.png" },
  { n: "Hood vs Wolf", i: "https://www.pgsoft.com/uploads/Games/Images/ac17fa08-db73-4f1b-b757-d62752a76bca.jpg" },
  { n: "Gem Saviour", i: "https://www.pgsoft.com/uploads/Games/Images/20ef5b3a-880b-4fab-9861-23e47b9edc01.png" },
  { n: "Plushie Frenzy", i: "https://www.pgsoft.com/uploads/Games/Images/d4d03483-360c-46bb-aa1d-13f0c0cdbe6c.jpg" },
  { n: "Medusa", i: "https://www.pgsoft.com/uploads/Games/Images/a906152a-1bb1-459f-a537-eee04fd6ab67.png" },
  { n: "Win Win Won", i: "https://www.pgsoft.com/uploads/Games/Images/0b386742-2b40-460a-8748-e63d6c2dbc3e.png" },
  { n: "Medusa II", i: "https://www.pgsoft.com/uploads/Games/Images/b62ecd1c-830c-4cd1-9af5-3d9ef88cf62e.png" },
  { n: "Tree Of Fortune", i: "https://www.pgsoft.com/uploads/Games/Images/361b51a2-dc61-4834-a2e2-bb9c9ac60499.png" },
  { n: "Fortune Gods", i: "https://www.pgsoft.com/uploads/Games/Images/cd510c21-008d-4227-a8d3-419728cfd2bb.png" },
  { n: "Honey Trap of Diao Chan", i: "https://www.pgsoft.com/uploads/Games/Images/db663c57-3dc5-4a58-ac49-caff328023bb.png" },
];

const PRAGMATIC_PLAY: G[] = [
  { n: 'Gates of Olympus', i: `${PP}/1695351.png` },
  { n: 'Gates of Olympus 1000', i: `${PP}/1740715.png` },
  { n: 'Sweet Bonanza', i: `${PP}/1338252.png` },
  { n: 'Sweet Bonanza 1000', i: `${PP}/1740718.png` },
  { n: 'Sweet Bonanza Xmas', i: `${PP}/1695363.png` },
  { n: 'Sugar Rush', i: `${PP}/1543481.png` },
  { n: 'Sugar Rush 1000', i: `${PP}/1740719.png` },
  { n: 'Starlight Princess', i: `${PP}/1695360.png` },
  { n: 'Starlight Princess 1000', i: `${PP}/1740717.png` },
  { n: 'Big Bass Bonanza', i: `${PP}/1695355.png` },
  { n: 'Big Bass Splash', i: `${PP}/1695356.png` },
  { n: 'Big Bass Amazon Xtreme', i: `${PP}/1740714.png` },
  { n: 'Dog House Megaways', i: `${PP}/1695352.png` },
  { n: 'Dog House Multihold', i: `${PP}/1740713.png` },
  { n: 'Fruit Party', i: `${PP}/1695353.png` },
  { n: 'Fruit Party 2', i: `${PP}/1702566.png` },
  { n: 'Floating Dragon', i: `${PP}/1695357.png` },
  { n: 'Wild West Gold', i: `${PP}/1695362.png` },
  { n: 'Wild West Gold Megaways', i: `${PP}/1740712.png` },
  { n: 'Buffalo King Megaways', i: `${PP}/1695354.png` },
  { n: 'Cash Bonanza', i: `${PP}/1695358.png` },
  { n: 'Zeus vs Hades', i: `${PP}/1740716.png` },
  { n: 'Madame Destiny Megaways', i: `${PP}/1695359.png` },
  { n: 'Book of Fallen', i: `${PP}/1695361.png` },
  { n: 'Power of Thor Megaways', i: `${PP}/1702569.png` },
  { n: 'Gems Bonanza', i: `${PP}/1338248.png` },
  { n: 'Joker King', i: `${PP}/1338249.png` },
  { n: 'Great Rhino Megaways', i: `${PP}/1338250.png` },
  { n: 'John Hunter Tomb', i: `${PP}/1338251.png` },
  { n: 'Release the Kraken', i: `${PP}/1338253.png` },
  { n: 'Curse of the Werewolf', i: `${PP}/1338254.png` },
  { n: 'Aztec Gems', i: `${PP}/1338255.png` },
  { n: 'Pirate Gold', i: `${PP}/1338256.png` },
  { n: 'Fire Strike', i: `${PP}/1338257.png` },
  { n: 'Cleocatra', i: `${PP}/1702564.png` },
  { n: 'Barn Festival', i: `${PP}/1702563.png` },
  { n: 'Twilight Princess', i: `${PP}/1702562.png` },
  { n: 'Wisdom of Athena', i: `${PP}/1702561.png` },
  { n: 'Gorilla Mayhem', i: `${PP}/1702560.png` },
  { n: 'Might of Ra', i: `${PP}/1702559.png` },
];

const HACKSAW: G[] = [
  { n: 'Wanted Dead or a Wild', i: 'https://cdn.softswiss.net/i/s2/hacksaw/WantedDeadoraWild.png' },
  { n: 'Chaos Crew', i: 'https://cdn.softswiss.net/i/s2/hacksaw/ChaosCrew.png' },
  { n: 'Chaos Crew 2', i: 'https://cdn.softswiss.net/i/s2/hacksaw/ChaosCrew2.png' },
  { n: 'Stick Em', i: 'https://cdn.softswiss.net/i/s2/hacksaw/StickEm.png' },
  { n: 'RIP City', i: 'https://cdn.softswiss.net/i/s2/hacksaw/RIPCity.png' },
  { n: 'Dork Unit', i: 'https://cdn.softswiss.net/i/s2/hacksaw/DorkUnit.png' },
  { n: 'Xpander', i: 'https://cdn.softswiss.net/i/s2/hacksaw/Xpander.png' },
  { n: 'Hand of Anubis', i: 'https://cdn.softswiss.net/i/s2/hacksaw/HandofAnubis.png' },
  { n: 'Rex the Hunt', i: 'https://cdn.softswiss.net/i/s2/hacksaw/RextheHunt.png' },
  { n: 'Gladiator Legends', i: 'https://cdn.softswiss.net/i/s2/hacksaw/GladiatorLegends.png' },
  { n: 'Miami Multiplier', i: 'https://cdn.softswiss.net/i/s2/hacksaw/MiamiMultiplier.png' },
  { n: 'Om Nom', i: 'https://cdn.softswiss.net/i/s2/hacksaw/OmNom.png' },
  { n: 'Frutz', i: 'https://cdn.softswiss.net/i/s2/hacksaw/Frutz.png' },
  { n: 'Stack Em', i: 'https://cdn.softswiss.net/i/s2/hacksaw/StackEm.png' },
  { n: 'Le Bandit', i: 'https://cdn.softswiss.net/i/s2/hacksaw/LeBandit.png' },
];

const PLAYNGO: G[] = [
  { n: 'Book of Dead', i: 'https://cdn.softswiss.net/i/s2/playngo/BookofDead.png' },
  { n: 'Reactoonz', i: 'https://cdn.softswiss.net/i/s2/playngo/Reactoonz.png' },
  { n: 'Reactoonz 2', i: 'https://cdn.softswiss.net/i/s2/playngo/Reactoonz2.png' },
  { n: 'Fire Joker', i: 'https://cdn.softswiss.net/i/s2/playngo/FireJoker.png' },
  { n: 'Rise of Olympus', i: 'https://cdn.softswiss.net/i/s2/playngo/RiseofOlympus.png' },
  { n: 'Rise of Olympus 100', i: 'https://cdn.softswiss.net/i/s2/playngo/RiseofOlympus100.png' },
  { n: 'Moon Princess', i: 'https://cdn.softswiss.net/i/s2/playngo/MoonPrincess.png' },
  { n: 'Moon Princess 100', i: 'https://cdn.softswiss.net/i/s2/playngo/MoonPrincess100.png' },
  { n: 'Rich Wilde', i: 'https://cdn.softswiss.net/i/s2/playngo/RichWilde.png' },
  { n: 'Legacy of Dead', i: 'https://cdn.softswiss.net/i/s2/playngo/LegacyofDead.png' },
  { n: 'Honey Rush', i: 'https://cdn.softswiss.net/i/s2/playngo/HoneyRush.png' },
  { n: 'Wild Frames', i: 'https://cdn.softswiss.net/i/s2/playngo/WildFrames.png' },
  { n: 'Hugo Goal', i: 'https://cdn.softswiss.net/i/s2/playngo/HugoGoal.png' },
  { n: 'Golden Ticket 2', i: 'https://cdn.softswiss.net/i/s2/playngo/GoldenTicket2.png' },
  { n: 'Aztec Idols', i: 'https://cdn.softswiss.net/i/s2/playngo/AztecIdols.png' },
];

const SPRIBE: G[] = [
  { n: 'Aviator', i: 'https://cdn.softswiss.net/i/s2/spribe/aviator.png' },
  { n: 'Mines', i: 'https://cdn.softswiss.net/i/s2/spribe/mines.png' },
  { n: 'Plinko', i: 'https://cdn.softswiss.net/i/s2/spribe/plinko.png' },
  { n: 'Goal', i: 'https://cdn.softswiss.net/i/s2/spribe/goal.png' },
  { n: 'Dice', i: 'https://cdn.softswiss.net/i/s2/spribe/dice.png' },
  { n: 'Hilo', i: 'https://cdn.softswiss.net/i/s2/spribe/hilo.png' },
  { n: 'Keno', i: 'https://cdn.softswiss.net/i/s2/spribe/keno.png' },
  { n: 'Mini Roulette', i: 'https://cdn.softswiss.net/i/s2/spribe/miniroulette.png' },
  { n: 'Hotline', i: 'https://cdn.softswiss.net/i/s2/spribe/hotline.png' },
  { n: 'Balloon', i: 'https://cdn.softswiss.net/i/s2/spribe/balloon.png' },
];

const NOLIMIT: G[] = [
  { n: 'Mental', i: 'https://cdn.softswiss.net/i/s2/nolimit/Mental.png' },
  { n: 'San Quentin xWays', i: 'https://cdn.softswiss.net/i/s2/nolimit/SanQuentinxWays.png' },
  { n: 'Tombstone RIP', i: 'https://cdn.softswiss.net/i/s2/nolimit/TombstoneRIP.png' },
  { n: 'Fire in the Hole', i: 'https://cdn.softswiss.net/i/s2/nolimit/FireintheHole.png' },
  { n: 'Fire in the Hole 2', i: 'https://cdn.softswiss.net/i/s2/nolimit/FireintheHole2.png' },
  { n: 'Punk Rocker', i: 'https://cdn.softswiss.net/i/s2/nolimit/PunkRocker.png' },
  { n: 'Deadwood', i: 'https://cdn.softswiss.net/i/s2/nolimit/Deadwood.png' },
  { n: 'El Paso Gunfight', i: 'https://cdn.softswiss.net/i/s2/nolimit/ElPasoGunfight.png' },
  { n: 'Karen Maneater', i: 'https://cdn.softswiss.net/i/s2/nolimit/KarenManeater.png' },
  { n: 'Misery Mining', i: 'https://cdn.softswiss.net/i/s2/nolimit/MiseryMining.png' },
  { n: 'xWays Hoarder', i: 'https://cdn.softswiss.net/i/s2/nolimit/xWaysHoarder.png' },
  { n: 'Road Rage', i: 'https://cdn.softswiss.net/i/s2/nolimit/RoadRage.png' },
  { n: 'Walk of Shame', i: 'https://cdn.softswiss.net/i/s2/nolimit/WalkofShame.png' },
  { n: 'Gluttony', i: 'https://cdn.softswiss.net/i/s2/nolimit/Gluttony.png' },
  { n: 'Remember Gulag', i: 'https://cdn.softswiss.net/i/s2/nolimit/RememberGulag.png' },
];

const PUSH_GAMING: G[] = [
  { n: 'Jammin Jars', i: 'https://cdn.softswiss.net/i/s2/pushgaming/JamminJars.png' },
  { n: 'Jammin Jars 2', i: 'https://cdn.softswiss.net/i/s2/pushgaming/JamminJars2.png' },
  { n: 'Razor Shark', i: 'https://cdn.softswiss.net/i/s2/pushgaming/RazorShark.png' },
  { n: 'Fat Rabbit', i: 'https://cdn.softswiss.net/i/s2/pushgaming/FatRabbit.png' },
  { n: 'Fire Hopper', i: 'https://cdn.softswiss.net/i/s2/pushgaming/FireHopper.png' },
  { n: 'Bison Battle', i: 'https://cdn.softswiss.net/i/s2/pushgaming/BisonBattle.png' },
  { n: 'Booming Bananas', i: 'https://cdn.softswiss.net/i/s2/pushgaming/BoomingBananas.png' },
  { n: 'Space Stacks', i: 'https://cdn.softswiss.net/i/s2/pushgaming/SpaceStacks.png' },
  { n: 'Dinopolis', i: 'https://cdn.softswiss.net/i/s2/pushgaming/Dinopolis.png' },
  { n: 'Retro Tapes', i: 'https://cdn.softswiss.net/i/s2/pushgaming/RetroTapes.png' },
];

const RELAX: G[] = [
  { n: 'Money Train 4', i: 'https://cdn.softswiss.net/i/s2/relax/MoneyTrain4.png' },
  { n: 'Temple Tumble', i: 'https://cdn.softswiss.net/i/s2/relax/TempleTumble.png' },
  { n: 'Iron Bank', i: 'https://cdn.softswiss.net/i/s2/relax/IronBank.png' },
  { n: 'Hellcatraz', i: 'https://cdn.softswiss.net/i/s2/relax/Hellcatraz.png' },
  { n: 'Beast Mode', i: 'https://cdn.softswiss.net/i/s2/relax/BeastMode.png' },
  { n: 'Snake Arena', i: 'https://cdn.softswiss.net/i/s2/relax/SnakeArena.png' },
  { n: 'Banana Town', i: 'https://cdn.softswiss.net/i/s2/relax/BananaTown.png' },
  { n: 'Book of 99', i: 'https://cdn.softswiss.net/i/s2/relax/Bookof99.png' },
  { n: 'Cluster Tumble', i: 'https://cdn.softswiss.net/i/s2/relax/ClusterTumble.png' },
  { n: 'TNT Tumble', i: 'https://cdn.softswiss.net/i/s2/relax/TNTTumble.png' },
];

const BTG: G[] = [
  { n: 'Bonanza Megaways', i: 'https://cdn.softswiss.net/i/s2/btg/BonanzaMegaways.png' },
  { n: 'Extra Chilli', i: 'https://cdn.softswiss.net/i/s2/btg/ExtraChilli.png' },
  { n: 'White Rabbit', i: 'https://cdn.softswiss.net/i/s2/btg/WhiteRabbit.png' },
  { n: 'Danger High Voltage', i: 'https://cdn.softswiss.net/i/s2/btg/DangerHighVoltage.png' },
  { n: 'Lil Devil', i: 'https://cdn.softswiss.net/i/s2/btg/LilDevil.png' },
  { n: 'Opal Fruits', i: 'https://cdn.softswiss.net/i/s2/btg/OpalFruits.png' },
  { n: 'Kingmaker', i: 'https://cdn.softswiss.net/i/s2/btg/Kingmaker.png' },
  { n: 'Royal Mint', i: 'https://cdn.softswiss.net/i/s2/btg/RoyalMint.png' },
  { n: 'Star Clusters', i: 'https://cdn.softswiss.net/i/s2/btg/StarClusters.png' },
  { n: 'Who Wants to Be a Millionaire', i: 'https://cdn.softswiss.net/i/s2/btg/Millionaire.png' },
];

const ELK: G[] = [
  { n: 'Cygnus 2', i: 'https://cdn.softswiss.net/i/s2/elk/Cygnus2.png' },
  { n: 'Kaiju', i: 'https://cdn.softswiss.net/i/s2/elk/Kaiju.png' },
  { n: 'Katmandu X', i: 'https://cdn.softswiss.net/i/s2/elk/KatmanduX.png' },
  { n: 'Wild Toro', i: 'https://cdn.softswiss.net/i/s2/elk/WildToro.png' },
  { n: 'Wild Toro II', i: 'https://cdn.softswiss.net/i/s2/elk/WildToroII.png' },
  { n: 'Poltava', i: 'https://cdn.softswiss.net/i/s2/elk/Poltava.png' },
  { n: 'Ecuador Gold', i: 'https://cdn.softswiss.net/i/s2/elk/EcuadorGold.png' },
  { n: 'Valhall Gold', i: 'https://cdn.softswiss.net/i/s2/elk/ValhallGold.png' },
  { n: 'Miss Wildfire', i: 'https://cdn.softswiss.net/i/s2/elk/MissWildfire.png' },
  { n: 'Taco Brothers', i: 'https://cdn.softswiss.net/i/s2/elk/TacoBrothers.png' },
];

const THUNDERKICK: G[] = [
  { n: 'Beat the Beast', i: 'https://cdn.softswiss.net/i/s2/thunderkick/BeattheBeast.png' },
  { n: 'Crystal Quest', i: 'https://cdn.softswiss.net/i/s2/thunderkick/CrystalQuest.png' },
  { n: 'Sword of Khans', i: 'https://cdn.softswiss.net/i/s2/thunderkick/SwordofKhans.png' },
  { n: 'Pink Elephants', i: 'https://cdn.softswiss.net/i/s2/thunderkick/PinkElephants.png' },
  { n: 'Pink Elephants 2', i: 'https://cdn.softswiss.net/i/s2/thunderkick/PinkElephants2.png' },
  { n: 'Falcon Huntress', i: 'https://cdn.softswiss.net/i/s2/thunderkick/FalconHuntress.png' },
  { n: 'Rocket Fellas', i: 'https://cdn.softswiss.net/i/s2/thunderkick/RocketFellas.png' },
  { n: 'Not Enough Kittens', i: 'https://cdn.softswiss.net/i/s2/thunderkick/NotEnoughKittens.png' },
  { n: 'Arcader', i: 'https://cdn.softswiss.net/i/s2/thunderkick/Arcader.png' },
  { n: 'Luchadora', i: 'https://cdn.softswiss.net/i/s2/thunderkick/Luchadora.png' },
];

const CATALOG = [
  { p: 'PG Soft', g: PG_SOFT },
  { p: 'Pragmatic Play', g: PRAGMATIC_PLAY },
  { p: 'Hacksaw Gaming', g: HACKSAW },
  { p: "Play'n GO", g: PLAYNGO },
  { p: 'Spribe', g: SPRIBE },
  { p: 'Nolimit City', g: NOLIMIT },
  { p: 'Push Gaming', g: PUSH_GAMING },
  { p: 'Relax Gaming', g: RELAX },
  { p: 'Big Time Gaming', g: BTG },
  { p: 'ELK Studios', g: ELK },
  { p: 'Thunderkick', g: THUNDERKICK },
];

function seedData(): void {
  const count = db.prepare('SELECT COUNT(*) as c FROM plataformas').get() as { c: number };
  if (count.c > 0) return;

  const insP = db.prepare('INSERT INTO plataformas (nome, url_afiliado, logo_url) VALUES (?, ?, ?)');
  const insJ = db.prepare('INSERT INTO jogos (nome, imagem_url, provedor, plataforma_id) VALUES (?, ?, ?, ?)');
  const nPlat = PLATAFORMAS.length;

  const transaction = db.transaction(() => {
    for (const p of PLATAFORMAS) insP.run(p.nome, p.url, p.logo);

    let idx = 0;
    for (const cat of CATALOG) {
      for (const j of cat.g) {
        // Distribui os jogos de forma uniforme entre as plataformas cadastradas
        const platId = (idx % nPlat) + 1;
        insJ.run(j.n, j.i, cat.p, platId);
        idx++;
      }
    }
  });

  transaction();
  const total = CATALOG.reduce((a, c) => a + c.g.length, 0);
  console.log(`📦 Seed: ${PLATAFORMAS.length} plataformas, ${total} jogos cadastrados`);
}
