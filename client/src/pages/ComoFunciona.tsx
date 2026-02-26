import './ComoFunciona.css';

export default function ComoFunciona() {
    return (
        <div className="como-funciona">
            <div className="como-funciona__container">
                <header className="como-funciona__header">
                    <h1 className="como-funciona__title">
                        Como o <span className="como-funciona__title-accent">Robô</span> Funciona?
                    </h1>
                    <p className="como-funciona__subtitle">
                        Transparência total sobre a nossa inteligência artificial e algoritmo de probabilidade.
                    </p>
                </header>

                <main className="como-funciona__content">
                    <section className="como-funciona__step">
                        <div className="como-funciona__icon-wrapper">
                            <span className="como-funciona__icon">1</span>
                        </div>
                        <div className="como-funciona__text">
                            <h2>Varredura Constante e Apostas Base</h2>
                            <p>
                                Nosso robô fica conectado 24 horas por dia realizando centenas de apostas consecutivas de valores bem baixos (simulação) em diversos jogos simultaneamente. Essa fase inicial serve apenas para monitorar o comportamento do algoritmo (RTP) das casas de apostas em tempo real.
                            </p>
                            <p style={{ marginTop: '10px' }}>
                                <strong>💡 Detalhe Importante:</strong> Toda essa varredura em massa é financiada <strong>exclusivamente por saldos de bônus</strong> que a nossa inteligência foi acumulando de forma estratégica nas próprias plataformas parceiras. Assim, mapemos o ritmo real dos jogos sem gastar capital próprio em fase de testes.
                            </p>
                        </div>
                    </section>

                    <section className="como-funciona__step">
                        <div className="como-funciona__icon-wrapper">
                            <span className="como-funciona__icon">2</span>
                        </div>
                        <div className="como-funciona__text">
                            <h2>Filtro de Retenção (Lista de Espera)</h2>
                            <p>
                                Se um jogo não realiza pagamentos num ciclo de 10 rodadas seguidas durante a varredura, o nosso sistema o sinaliza imediatamente como "Frio" ou "Ruim" para aquele momento. Ele entra em uma tranca/backlist de verificação, e o robô só voltará a testar o RTP dele no próximo grande ciclo marcado pelo cronômetro global da plataforma.
                            </p>
                        </div>
                    </section>

                    <section className="como-funciona__step">
                        <div className="como-funciona__icon-wrapper">
                            <span className="como-funciona__icon">3</span>
                        </div>
                        <div className="como-funciona__text">
                            <h2>Escalada de Bet e Confirmação</h2>
                            <p>
                                Assim que um dos jogos "abre a torneira" de prêmios e sinaliza para o robô que está pagando acima da média imposta, o bot entra na segunda engrenagem: Ele aumenta de forma progressiva o valor da aposta (Baixa, Média, Alta) e testa novamente. O robô muda os valores em frações de segundos para atestar se a plataforma está entregando os multiplicadores ou era só uma isca.
                            </p>
                        </div>
                    </section>

                    <section className="como-funciona__step">
                        <div className="como-funciona__icon-wrapper">
                            <span className="como-funciona__icon">4</span>
                        </div>
                        <div className="como-funciona__text">
                            <h2>Cálculo de Win Rate Estratégico</h2>
                            <p>
                                De posse de toda essa travessia matemática, a Inteligência Artificial calcula a métrica exata da "Taxa de Acerto" (Win Rate) que o robô levou para extrair a vitória. É esse número final e poderoso que é jogado nas cartas da tela inicial, junto da melhor faixa de aposta (Bet) encontrada que gerou os ganhos da demonstração.
                            </p>
                        </div>
                    </section>

                    <section className="como-funciona__step">
                        <div className="como-funciona__icon-wrapper">
                            <span className="como-funciona__icon">5</span>
                        </div>
                        <div className="como-funciona__text">
                            <h2>Atualização em Tempo Real (A Cada 10 Minutos)</h2>
                            <p>
                                Para garantir a eficácia do processamento, a sincronização global de IA acontece sempre na "Casa dos Dez". A cada 10 minutos (Ex: 12h00, 12h10, 12h20...), todas as métricas são atualizadas no seu painel para garantir que você aproveite sempre a janela de pagamento corrente antes da casa esfriar!
                            </p>
                        </div>
                    </section>
                    <section className="como-funciona__step disclaimer-step">
                        <div className="como-funciona__icon-wrapper disclaimer-icon">
                            <span className="como-funciona__icon">⚠️</span>
                        </div>
                        <div className="como-funciona__text">
                            <h2>Aviso Importante sobre Sorte e Resultados</h2>
                            <p>
                                <strong>Nenhuma plataforma garante ganhos.</strong> É fundamental deixar claro que o robô apenas verifica se a plataforma está pagando a outros jogadores <em>naquele momento exato</em>. Isso <strong>não significa</strong> que a máquina vai pagar para você com certeza. Jogos de slot são 100% baseados em sorte (RNG - Gerador de Números Aleatórios) e não há nada que influencie a sorte a seu favor. Use a ferramenta apenas como um guia das janelas de pagamento!
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
