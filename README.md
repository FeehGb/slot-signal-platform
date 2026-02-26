# 🎰 Slot Signal Platform

Plataforma completa para gerenciamento e exibição de sinais de jogos de slot.

## 🚀 Tecnologias

- **Backend:** Node.js, Express, TypeScript, SQLite (`better-sqlite3`)
- **Frontend:** React, TypeScript, Vite
- **Scraping:** Cheerio, Axios
- **Auth:** JWT (`jsonwebtoken`, `bcryptjs`)
- **Agendamento:** `node-cron`

## 📋 Pré-requisitos

- Node.js >= 18
- npm >= 9

## ⚙️ Configuração

### 1. Clone e instale as dependências

```bash
cd slot-signal-platform

# Backend
npm install

# Frontend
cd client && npm install && cd ..
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` conforme necessário:

| Variável | Descrição | Padrão |
|------|-----------|--------|
| `PORT` | Porta do servidor backend | `3001` |
| `JWT_SECRET` | Chave secreta para tokens JWT | `dev-secret-key...` |
| `ADMIN_USER` | Usuário do admin | `admin` |
| `ADMIN_PASS` | Senha do admin | `admin123` |
| `SCRAPING_URL_SINAIS` | URL do site de sinais | `https://reidoslotsinais.com` |
| `SCRAPING_URL_CASSINO` | URL do cassino para scraping | — |

## 🏃 Executando

### Desenvolvimento

```bash
# Terminal 1 - Backend (porta 3001)
npm run dev

# Terminal 2 - Frontend (porta 5173)
cd client && npm run dev
```

Acesse:
- **Site público:** http://localhost:5173
- **Admin:** http://localhost:5173/admin
- **API:** http://localhost:3001/api/jogos

### Produção

```bash
# Build backend
npm run build

# Build frontend
cd client && npm run build

# Iniciar
npm start
```

## 🔐 Painel Administrativo

Acesse `/admin` com as credenciais configuradas no `.env`:

- **Usuário:** `admin`
- **Senha:** `admin123`

### Funcionalidades:
- CRUD de jogos e plataformas
- Disparo manual de scraping
- Visualização de logs
- Estatísticas em tempo real

## 🤖 Sistema de Sinais

Os sinais são gerados automaticamente a cada **5 minutos** pelo backend:
- Seleciona jogos aleatórios
- Atribui um **win rate** simulado (75-98%)
- Define uma **duração** de 5-15 minutos
- O frontend atualiza automaticamente a cada 30 segundos

> ⚠️ **Os sinais são simulados e não refletem o comportamento real dos jogos.**

## 📡 API Endpoints

### Públicos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/jogos` | Lista jogos ativos (filtros: `?plataforma=ID&provedor=NOME`) |
| GET | `/api/plataformas` | Lista plataformas ativas |
| GET | `/api/sinais-ativos` | Jogos com sinal ativo |
| GET | `/api/provedores` | Lista provedores |
| GET | `/api/stats` | Estatísticas |

### Admin (requer `Authorization: Bearer TOKEN`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST/PUT/DELETE | `/admin/api/jogos` | CRUD de jogos |
| GET/POST/PUT/DELETE | `/admin/api/plataformas` | CRUD de plataformas |
| POST | `/admin/api/scraping/plataformas` | Scrape plataformas |
| POST | `/admin/api/scraping/jogos` | Scrape jogos |
| GET | `/admin/api/logs` | Logs de scraping |

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/login` | Login (retorna JWT) |

## ⚠️ Limitações Legais e Éticas

> **IMPORTANTE:** Este projeto é exclusivamente para fins educacionais.

- Os sinais exibidos são **simulados** e **não devem ser usados como base para apostas**
- A criação automática de contas **viola os Termos de Serviço** da maioria dos sites
- Sites implementam medidas anti-bot (CAPTCHAs, Cloudflare) que podem bloquear scraping
- Se o site alvo mudar seu layout, os scripts de scraping precisarão atualização manual
- Jogos de azar são restritos ou proibidos em muitas jurisdições
- **Jogue com responsabilidade. +18.**

## 📁 Estrutura do Projeto

```
slot-signal-platform/
├── src/                  # Backend TypeScript
│   ├── server.ts         # Entry point
│   ├── database/init.ts  # SQLite + migrações
│   ├── routes/           # API, Admin, Auth
│   ├── middleware/        # JWT auth
│   └── services/         # Scraping, Sinais, Cadastro
├── client/               # React frontend (Vite)
│   └── src/
│       ├── components/   # GameCard, Navbar, FilterBar
│       ├── pages/        # Home, Termos, Admin
│       ├── hooks/        # useSignals
│       └── services/     # API client
├── database/             # SQLite data (auto-generated)
└── .env                  # Configuração
```
