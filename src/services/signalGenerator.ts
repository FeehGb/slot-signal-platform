import { getDatabase } from '../database/init';

const BETS_30 = [0.30, 0.60, 0.90, 1.00, 1.20, 1.50, 1.80, 2.00, 2.10, 2.40, 2.70, 3.00, 4.00, 5.00, 6.00, 7.00, 8.00, 9.00, 10.00, 15.00, 18.00, 24.00, 30.00, 45.00, 90.00];

const BETS_40 = [0.40, 0.80, 1.20, 1.60, 2.00, 2.40, 2.80, 3.20, 3.60, 4.00, 8.00, 12.00, 15.00, 16.00, 20.00, 24.00, 28.00, 30.00, 32.00, 36.00, 40.00, 45.00, 50.00, 75.00, 100.00, 120.00, 150.00, 250.00, 500.00];

const BETS_50 = [0.50, 1.00, 1.50, 2.00, 2.50, 3.00, 3.50, 4.00, 4.50, 5.00, 10.00, 15.00, 20.00, 24.00, 30.00, 35.00, 40.00, 45.00, 50.00, 80.00, 120.00, 200.00, 320.00, 400.00];

function getValidBets(gameName: string): number[] {
  const name = gameName.toLowerCase();

  // Grupo Base 0.30
  if (
    name.includes('snake') ||
    name.includes('double fortune') ||
    name.includes('hiphop panda') || name.includes('hip hop panda') ||
    name.includes('medusa')
  ) {
    return BETS_30;
  }

  // Grupo Base 0.50
  if (
    name.includes('rabbit') ||
    name.includes('ox') ||
    name.includes('mr treasure') || name.includes('mister treasure') ||
    name.includes('fortune mouse') || name.includes('mouse') ||
    name.includes('crash mania') ||
    name.includes('horse') ||
    name.includes('iguazu') ||
    name.includes('icescape') ||
    name.includes('gem savior')
  ) {
    return BETS_50;
  }

  // Padrão Restante: Base 0.40
  return BETS_40;
}

function getRandomBet(nivel: 'baixa' | 'media' | 'alta', gameName: string): number {
  const list = getValidBets(gameName);

  let validOptions: number[] = [];

  if (nivel === 'baixa') {
    // Bet Baixa: Até 2.40 reais
    validOptions = list.filter(v => v <= 2.40);
  } else if (nivel === 'media') {
    // Bet Media: Acima de 2.40 reais até 10 reais
    validOptions = list.filter(v => v > 2.40 && v <= 10.00);
  } else {
    // Bet Alta: Acima de 10 reais
    validOptions = list.filter(v => v > 10.00);
  }

  // Fallback de segurança se nenhuma bet for aprovada no filtro
  if (validOptions.length === 0) validOptions = list;

  // Usa potência apenas leve para tender aos valores mais baixos dentro de seu próprio grupo
  const randIndex = Math.pow(Math.random(), 1.5);
  const selectedIndex = Math.floor(randIndex * validOptions.length);

  return validOptions[selectedIndex];
}

export function gerarSinais(): void {
  try {
    const db = getDatabase();

    // Limpa absolutamente todos os sinais ativos antigos para forçar renovação total
    db.prepare("DELETE FROM sinais_ativos").run();

    // Busca TODOS os jogos ativos para gerar novos sinais 100% atualizados
    const jogosSemSinal = db.prepare(`
      SELECT j.id, j.nome FROM jogos j
      WHERE j.ativo = 1
    `).all() as { id: number; nome: string }[];

    if (jogosSemSinal.length === 0) return;

    const insertSinal = db.prepare(`
      INSERT INTO sinais_ativos (jogo_id, win_rate, nivel_bet, valor_bet, data_hora_inicio, data_hora_fim)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now', '+' || ? || ' minutes'))
    `);

    const transaction = db.transaction(() => {
      for (const jogo of jogosSemSinal) {
        const winRate = Math.floor(Math.random() * 27) + 72;
        const duracao = 10; // Exatamente 10 minutos (padrão global)

        // Esmagadora probabilidade para bet 'baixa' (~85%), 'media' (~12%), 'alta' (~3%)
        const rand = Math.random();
        let nivel: 'baixa' | 'media' | 'alta' = 'baixa';
        if (rand > 0.97) nivel = 'alta';
        else if (rand > 0.85) nivel = 'media';

        const valorBet = getRandomBet(nivel, jogo.nome);

        insertSinal.run(jogo.id, winRate, nivel, valorBet, duracao);
      }
    });

    transaction();
    console.log(`[Sinais] Gerados sinais para ${jogosSemSinal.length} jogos`);
  } catch (error) {
    console.error('[Sinais] Erro ao gerar sinais:', error);
  }
}
