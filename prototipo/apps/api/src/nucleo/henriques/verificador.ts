/**
 * Verificador por Regra do Henriques.
 *
 * Garante que zero valores inventados chegam à pessoa:
 *  - Qualquer número (euros, metros, m², dias, prazos) presente no texto da resposta
 *    tem de constar literalmente num excerto de fonte oficial validada.
 *  - Se algum número não tiver correspondência literal na fonte, a resposta é rejeitada
 *    e substituída por uma abstenção formal fundamentada.
 */

export interface ResultadoVerificacao {
  valido: boolean;
  numerosDetetados: string[];
  numerosSemFonte: string[];
  motivo?: string;
}

/** Expressão regular para detetar valores numéricos associados a grandezas regulamentares.
 * Nota: € é um símbolo não alfanumérico, pelo que não pode ter \b a fechar. */
const REGEX_NUMEROS = /\b\d+(?:[.,]\d+)?\s*(?:€|euros?|m2|m²|metros?|dias?|semanas?|meses|anos?|fogos|pisos)(?!\w)/gi;

export class VerificadorRegra {
  /**
   * Valida se todos os valores numéricos com grandeza presentes no texto
   * constam rigorosamente nas fontes oficiais fornecidas.
   */
  static verificar(textoResposta: string, textosFontes: string[]): ResultadoVerificacao {
    const correspondencias = textoResposta.match(REGEX_NUMEROS) ?? [];
    const numerosDetetados = Array.from(new Set(correspondencias));
    const fontesUnificadas = textosFontes.join(' ').toLowerCase();

    const numerosSemFonte: string[] = [];

    for (const item of numerosDetetados) {
      // Extrair o número e a grandeza separadamente
      const matchParte = item.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
      if (!matchParte) continue;

      const valorNum = matchParte[1].replace(',', '.');
      const grandeza = matchParte[2].toLowerCase().replace('€', 'euro').replace(/s$/, '');

      // Procurar nas fontes se existe o número com fronteira de palavra / número completo
      // Para evitar que "3" ou "3,00" seja considerado presente dentro de "73" ou "73,00"
      const numComVirgula = matchParte[1].replace('.', ',');
      const numComPonto = matchParte[1].replace(',', '.');

      const padraoExato = new RegExp(`(?<!\\d)(${numComPonto.replace('.', '\\.')}|${numComVirgula.replace(',', ',')})(?!\\d)`, 'i');
      const numeroExiste = padraoExato.test(fontesUnificadas);

      if (!numeroExiste) {
        numerosSemFonte.push(item);
      }
    }

    if (numerosSemFonte.length > 0) {
      return {
        valido: false,
        numerosDetetados,
        numerosSemFonte,
        motivo: `Valores numéricos sem fonte comprovada no registo: ${numerosSemFonte.join(', ')}`,
      };
    }

    return {
      valido: true,
      numerosDetetados,
      numerosSemFonte: [],
    };
  }
}
