import './Termos.css';

export default function Termos() {
    return (
        <div className="termos">
            <div className="termos__container">
                <h1 className="termos__title">Termos de Uso e Aviso Legal</h1>
                <p className="termos__updated">Última atualização: Fevereiro de 2024</p>

                <section className="termos__section">
                    <h2>1. Sobre a Plataforma</h2>
                    <p>
                        O Fortune Wise é uma plataforma independente dedicada a fornecer informações e sinais
                        simulados sobre jogos de slot de cassinos online. Nosso conteúdo é <strong>puramente
                            informativo e de entretenimento</strong>, não devendo ser interpretado como aconselhamento
                        financeiro, garantia de lucro ou incentivo ao jogo.
                    </p>
                </section>

                <section className="termos__section">
                    <h2>2. Sinais Simulados</h2>
                    <p>
                        Os "sinais" exibidos em nossa plataforma (como "Pagando Agora", "Win Rate", etc.) são
                        <strong> gerados automaticamente de forma aleatória</strong> e não refletem o comportamento
                        real dos jogos de cassino. Eles são criados para fins de entretenimento e simulação,
                        e <strong>não devem ser utilizados como base para decisões financeiras</strong>.
                    </p>
                    <div className="termos__alert">
                        ⚠️ <strong>Importante:</strong> Os resultados dos jogos de cassino são determinados por
                        geradores de números aleatórios (RNG) certificados. Nenhum site, aplicativo ou sinal
                        pode prever ou influenciar os resultados.
                    </div>
                </section>

                <section className="termos__section">
                    <h2>3. Jogo Responsável</h2>
                    <p>
                        Priorizamos o jogo responsável e ético. Recomendações importantes:
                    </p>
                    <ul>
                        <li>Jogue apenas por diversão, nunca como fonte de renda</li>
                        <li>Defina limites de tempo e dinheiro antes de jogar</li>
                        <li>Nunca aposte dinheiro que não pode perder</li>
                        <li>Se sentir que o jogo está afetando negativamente sua vida, procure ajuda</li>
                        <li>Jogos de azar são proibidos para menores de 18 anos</li>
                    </ul>
                </section>

                <section className="termos__section">
                    <h2>4. Links para Terceiros</h2>
                    <p>
                        Nossa plataforma pode conter links para sites de cassinos e plataformas de jogos online.
                        Estes são links de afiliados e não temos controle sobre o conteúdo desses sites.
                        A utilização de qualquer plataforma de terceiros é de responsabilidade exclusiva do
                        usuário.
                    </p>
                </section>

                <section className="termos__section">
                    <h2>5. Isenção de Responsabilidade</h2>
                    <p>
                        O Fortune Wise <strong>não garante lucros nem resultados positivos</strong> em qualquer
                        plataforma de jogos. Não nos responsabilizamos por perdas financeiras decorrentes
                        do uso das informações exibidas em nossa plataforma.
                    </p>
                </section>

                <section className="termos__section">
                    <h2>6. Conformidade Legal</h2>
                    <p>
                        Verifique as leis e regulamentações locais antes de participar em qualquer atividade
                        relacionada a jogos de azar. Em muitas jurisdições, jogos de azar online podem ser
                        restritos ou proibidos. É responsabilidade do usuário garantir que está em conformidade
                        com as leis de sua região.
                    </p>
                </section>

                <section className="termos__section">
                    <h2>7. Cadastro Automático</h2>
                    <p>
                        O módulo de cadastro automático presente nesta plataforma é <strong>exclusivamente
                            para fins educacionais e de demonstração</strong>. A criação automática de contas pode
                        violar os Termos de Serviço de terceiros. Não nos responsabilizamos pelo uso indevido
                        desta funcionalidade.
                    </p>
                </section>

                <div className="termos__footer">
                    <p>© {new Date().getFullYear()} Fortune Wise. Todos os direitos reservados.</p>
                    <p>Jogue com responsabilidade. +18</p>
                </div>
            </div>
        </div>
    );
}
