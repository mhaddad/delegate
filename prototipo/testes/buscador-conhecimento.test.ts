import { describe, it, expect, vi } from 'vitest';
import { BuscadorConhecimento } from '../apps/api/src/nucleo/conhecimento/buscador.ts';
import { Afonso } from '../apps/api/src/nucleo/afonso/afonso.ts';

describe('Base de Conhecimento Municipal (RAG D0 via Cloudflare /markdown)', () => {
  it('carrega o índice consolidado e os ficheiros Markdown extraídos', () => {
    const buscador = new BuscadorConhecimento();
    expect(buscador.totalDocumentos).toBeGreaterThanOrEqual(5);
  });

  it('recupera o excerto e a fonte para perguntas sobre isenção de licença de utilização', () => {
    const buscador = new BuscadorConhecimento();
    const resultado = buscador.buscar('Como peço isenção de licença de utilização de um prédio antigo?');

    expect(resultado).not.toBeNull();
    expect(resultado?.titulo).toMatch(/Isenção de Licença de Utilização|Diretório de Serviços/i);
    expect(resultado?.url).toContain('isencao-de-licenca-de-utilizacao');
    expect(resultado?.excerto).toMatch(/isento de licença de utilização|isenção de licença de utilização|RGEU/i);
    expect(resultado?.hashSha256).toBeDefined();
    expect(resultado?.consultadoEm).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('recupera informações de bolsas de estudo da ação social', () => {
    const buscador = new BuscadorConhecimento();
    const resultado = buscador.buscar('como concorrer a bolsas de estudo do municipio');

    expect(resultado).not.toBeNull();
    expect(resultado?.url).toContain('bolsas-de-estudo');
  });

  it('formata a resposta com evidência oficial e citação explícita de proveniência', () => {
    const buscador = new BuscadorConhecimento();
    const resultado = buscador.buscar('isenção de licença de utilização');
    expect(resultado).not.toBeNull();

    const formatado = buscador.formatarResposta(resultado!);
    expect(formatado.texto).toContain('Evidência Oficial da Câmara Municipal de Guimarães');
    expect(formatado.texto).toContain(resultado!.url);
    expect(formatado.texto).toContain(resultado!.consultadoEm);
    expect(formatado.botoes.length).toBeGreaterThanOrEqual(2);
    expect(formatado.botoes[0][0].ligacao).toBe(resultado!.url);
  });

  it('integração Afonso: responde a dúvidas informativas D0 fora dos 16 serviços canónicos com RAG verificado', async () => {
    const registoMock = {
      registar: vi.fn().mockResolvedValue({ id: 'EV-1' }),
      listar: vi.fn().mockResolvedValue([]),
    } as any;

    const afonso = new Afonso(registoMock, undefined, 'sessao-teste');
    const resposta = await afonso.responder(
      'cidadao_guimaraes',
      'Quais são os documentos para pedir isenção de licença de utilização?',
    );

    expect(resposta.comportamento).toBe('responder');
    expect(resposta.categoria).toBe('conhecimento_d0');
    expect(resposta.texto).toContain('Evidência Oficial da Câmara Municipal de Guimarães');
    expect(resposta.texto).toContain('isencao-de-licenca-de-utilizacao');

    // Verificar se emitiu o evento de resposta verificada com RAG
    expect(registoMock.registar).toHaveBeenCalledWith(
      expect.objectContaining({
        tipo: 'afonso.resposta.verificada',
        ator: expect.stringMatching(/^agente:(conhecimento-rag|jev-rerank)$/),
      }),
    );
  });
});
