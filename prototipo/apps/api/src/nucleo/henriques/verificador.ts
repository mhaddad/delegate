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

/** Expressão regular para detetar valores numéricos associados a grandezas regulamentares. */
const REGEX_NUMEROS = /\b\d+(?:[.,]\d+)?\s*(?:€|euros?|m2|m²|metros?|dias?|semanas?|meses|anos?|fogos|pisos)\b/gi;

export class VerificadorRegra {
  /**
   * Valida se todos os valores numéricos com grandeza presentes no texto
   * constam literalmente nas fontes fornecidas.
   */
  static verificar(textoResposta: string, textosFontes: string[]): ResultadoVerificacao {
    const correspondencias = textoResposta.match(REGEX_NUMEROS) ?? [];
    const numerosDetetados = Array.from(new Set(correspondencias));
    const fontesUnificadas = textosFontes.join(' ').toLowerCase();

    const numerosSemFonte: string[] = [];

    for (const item of numerosDetetados) {
      const normalizado = item.toLowerCase().replace(/\s+/g, ' ').trim();
      const virgulaParaPonto = normalizado.replace(',', '.');
      const pontoParaVirgula = normalizado.replace('.', ',');
      const compacto = normalizado.replace(/\s+/, '');

      const encontrado =
        fontesUnificadas.includes(normalizado) ||
        fontesUnificadas.includes(virgulaParaPonto) ||
        fontesUnificadas.includes(pontoParaVirgula) ||
        fontesUnificadas.includes(compacto);

      if (!encontrado) {
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
