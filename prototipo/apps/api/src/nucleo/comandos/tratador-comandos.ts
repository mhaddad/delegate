/**
 * Tratador de Comandos de Barra (/) do Bot do Afonso no Telegram.
 *
 * Módulo com responsabilidade única de responder a comandos estruturados:
 * - /start: Apresentação da demonstração e comandos disponíveis
 * - /carta: Carta de Lealdade do Afonso e compromissos do AI Act
 * - /cofre: Consulta e gestão de itens cifrados no Cofre Digital Pessoal
 * - /mandatos: Consulta de mandatos de representação ativos (D0 a D3)
 * - /missoes: Estado do orquestrador de missões e checklist de passos
 * - /dados: Auditoria de acessos e tratamento de dados pessoais
 * - /pessoa: Encaminhamento para atendimento humano presencial/telefónico
 */
import { escapar, type Canal, type MensagemRecebida } from '../canal.ts';
import type { CofreDigital } from '../cofre/cofre.ts';
import type { GestorMandatos } from '../mandatos/mandatos.ts';
import type { OrquestradorMissoes } from '../orquestrador/missao.ts';
import type { Registo } from '../eventos/registo.ts';

export interface DependenciasComandos {
  canal: Canal;
  cofre: CofreDigital;
  mandatos: GestorMandatos;
  orquestrador: OrquestradorMissoes;
  registo: Registo;
  sessao: string;
}

export class TratadorComandos {
  readonly #canal: Canal;
  readonly #cofre: CofreDigital;
  readonly #mandatos: GestorMandatos;
  readonly #orquestrador: OrquestradorMissoes;
  readonly #registo: Registo;
  readonly #sessao: string;

  constructor(deps: DependenciasComandos) {
    this.#canal = deps.canal;
    this.#cofre = deps.cofre;
    this.#mandatos = deps.mandatos;
    this.#orquestrador = deps.orquestrador;
    this.#registo = deps.registo;
    this.#sessao = deps.sessao;
  }

  async tratar(m: MensagemRecebida): Promise<boolean> {
    if (m.tipo !== 'comando' || !m.texto) {
      return false;
    }

    const textoLimpo = m.texto.trim();

    if (textoLimpo.startsWith('/start')) {
      const persona = textoLimpo.replace('/start', '').trim() || 'ines-demo';
      await this.#canal.enviar(
        m.conversa,
        [
          'Olá, sou o <b>Afonso</b>, o seu representante digital que trabalha para si.',
          '',
          'Esta é uma <b>demonstração</b> com dados fictícios do desafio 3.4 (Hack4Guimarães 2035).',
          `Persona: <code>${escapar(persona)}</code>`,
          '',
          '<b>Comandos úteis:</b>',
          '• /carta — Carta de Lealdade do Afonso',
          '• /cofre — Itens guardados no seu Cofre Digital',
          '• /mandatos — Mandatos de representação ativos',
          '• /missoes — Estado das suas missões em curso',
          '• /dados — Quem consultou os meus dados',
          '• /pessoa — Pedir atendimento humano na Câmara',
          '',
          'Pode falar com uma pessoa a qualquer momento.',
        ].join('\n'),
        [
          [
            { texto: '📜 Carta de Lealdade', dados: 'cmd_carta' },
            { texto: '👤 Falar com uma pessoa', dados: 'pessoa' },
          ],
        ],
      );
      await this.#registar(m, { comando: '/start' });
      return true;
    }

    if (textoLimpo === '/carta') {
      await this.#canal.enviar(
        m.conversa,
        [
          '📜 <b>Carta de Lealdade do Afonso</b>',
          '',
          '1. <b>Trabalho para si.</b> Não trabalho para a Câmara, para um banco nem para quem me financia.',
          '2. <b>Digo-lhe sempre os seus direitos</b>, incluindo o de reclamar, ser ouvido e recorrer de uma decisão.',
          '3. <b>Só uso os dados que autorizou</b>, para a missão que me deu, pelo tempo que definiu.',
          '4. <b>Mostro-lhe a fonte do que afirmo</b> e digo-lhe quando não sei.',
          '5. <b>Nunca recomendo um profissional</b>, produto ou serviço por ter sido pago para isso.',
          '6. <b>Pode falar com uma pessoa a qualquer momento.</b>',
          '',
          '<i>Identifico-me sempre como assistente de IA nos termos do art. 50.º do AI Act europeu.</i>',
        ].join('\n'),
        [[{ texto: '👤 Falar com uma pessoa', dados: 'pessoa' }]],
      );
      await this.#registar(m, { comando: '/carta' });
      return true;
    }

    if (textoLimpo === '/cofre') {
      const itens = this.#cofre.listarMetadados(m.pessoa);
      if (itens.length === 0) {
        await this.#canal.enviar(
          m.conversa,
          [
            '🗄️ <b>O seu Cofre Digital Pessoal está vazio.</b>',
            '',
            'O Cofre guarda dados em 3 camadas (<i>identidade</i>, <i>provas</i>, <i>intenções</i>), sempre com cifra AES-256-GCM.',
            'Nenhum dado é guardado sem o seu consentimento explícito.',
          ].join('\n'),
        );
      } else {
        const linhas = itens.map(
          (it, idx) =>
            `${idx + 1}. <b>${escapar(it.titulo)}</b>\n   • Camada: <code>${it.camada}</code> | Finalidade: ${escapar(it.finalidade)}\n   • Criado: ${it.criadoEm.split('T')[0]}`,
        );
        const botoesApagar = itens.slice(0, 3).map((it) => [
          { texto: `🗑️ Apagar «${it.titulo.slice(0, 20)}»`, dados: `apagar_item_${it.id}` },
        ]);
        await this.#canal.enviar(
          m.conversa,
          [
            '🗄️ <b>Itens no seu Cofre Digital Pessoal (Cifrado):</b>',
            '',
            ...linhas,
            '',
            '<i>Os dados estão cifrados com a sua chave. O operador municipal não os lê.</i>',
          ].join('\n'),
          botoesApagar,
        );
      }
      await this.#registar(m, { comando: '/cofre' });
      return true;
    }

    if (textoLimpo === '/mandatos') {
      const lista = this.#mandatos.listar(m.pessoa);
      if (lista.length === 0) {
        await this.#canal.enviar(
          m.conversa,
          [
            '🤝 <b>Não tem nenhum mandato ativo.</b>',
            '',
            'Os mandatos definem o que o Afonso pode fazer por si:',
            '• D0: Informar · D1: Vigiar · D2: Preparar · D3: Agir com a sua confirmação.',
          ].join('\n'),
        );
      } else {
        const linhas = lista.map(
          (man, idx) =>
            `${idx + 1}. <b>${man.id}</b> — Nível <b>${man.nivel}</b>\n   • Âmbito: <code>${man.ambito}</code> (${escapar(man.objeto)})\n   • Validade: até ${man.validoAte} | Estado: <b>${man.estado}</b>`,
        );
        const botoesRevogar = lista
          .filter((man) => man.estado === 'ativo')
          .slice(0, 3)
          .map((man) => [{ texto: `🚫 Revogar ${man.id}`, dados: `revogar_mandato_${man.id}` }]);
        await this.#canal.enviar(
          m.conversa,
          [
            '🤝 <b>Mandatos de Representação Digital:</b>',
            '',
            ...linhas,
            '',
            '<i>Pode revogar qualquer mandato a qualquer instante com efeito imediato.</i>',
          ].join('\n'),
          botoesRevogar,
        );
      }
      await this.#registar(m, { comando: '/mandatos' });
      return true;
    }

    if (textoLimpo === '/missoes') {
      const lista = this.#orquestrador.listarPorPessoa(m.pessoa);
      if (lista.length === 0) {
        await this.#canal.enviar(
          m.conversa,
          '📋 <b>Não tem missões ativas no momento.</b>\n\nDiga-me o que precisa da Câmara e eu abro a respetiva missão.',
        );
      } else {
        const blocos = lista.map((mis) => {
          const feitos = mis.checklist.filter((c) => c.feito).length;
          const total = mis.checklist.length;
          return [
            `• <b>${mis.id}: ${escapar(mis.servicoTitulo)}</b>`,
            `  Estado: <code>${mis.estado}</code>`,
            `  Objetivo: ${escapar(mis.objetivo)}`,
            `  Checklist: ${feitos}/${total} passos concluídos`,
          ].join('\n');
        });
        await this.#canal.enviar(m.conversa, ['📋 <b>As suas Missões:</b>', '', ...blocos].join('\n\n'));
      }
      await this.#registar(m, { comando: '/missoes' });
      return true;
    }

    if (textoLimpo === '/dados') {
      const eventosAudit = await this.#registo.listar({ sessao: this.#sessao, limite: 50 });
      const relevantes = eventosAudit.filter(
        (e) =>
          e.pessoa === m.pessoa ||
          e.tipo.startsWith('cofre.') ||
          e.tipo.startsWith('mandato.') ||
          e.tipo.startsWith('su.'),
      );

      const linhas = relevantes.slice(0, 8).map((ev) => {
        const hora = new Date(ev.ts).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
        return `• [${hora}] <b>${ev.ator}</b>: <code>${ev.tipo}</code>`;
      });

      await this.#canal.enviar(
        m.conversa,
        [
          '🔍 <b>Quem consultou ou processou os meus dados:</b>',
          '',
          ...(linhas.length > 0 ? linhas : ['Nenhum registo recente de acesso aos seus dados.']),
          '',
          '<i>Cada acesso é auditado com registo de hash SHA-256 na plataforma Delegate.</i>',
        ].join('\n'),
      );
      await this.#registar(m, { comando: '/dados' });
      return true;
    }

    if (textoLimpo === '/pessoa') {
      await this.#registo.registar({
        tipo: 'consola.caso.criado',
        origem: 'consola',
        sessao: this.#sessao,
        pessoa: m.pessoa,
        missao: null,
        ator: 'pessoa',
        simulacao: true,
        dados: { motivo: 'pedido_atendimento_humano_via_comando' },
      });
      await this.#canal.enviar(
        m.conversa,
        'Encaminhei o seu pedido para atendimento humano no Balcão Único da Câmara Municipal. Um técnico irá contactá-lo.',
      );
      await this.#registar(m, { comando: '/pessoa' });
      return true;
    }

    return false;
  }

  async #registar(m: MensagemRecebida, dados: Record<string, unknown>): Promise<void> {
    await this.#registo.registar({
      tipo: 'canal.mensagem.enviada',
      origem: 'canal',
      sessao: this.#sessao,
      pessoa: m.pessoa,
      missao: null,
      ator: 'pessoa',
      simulacao: false,
      dados,
    });
  }
}
