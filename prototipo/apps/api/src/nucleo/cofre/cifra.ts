/**
 * Cifra simétrica AES-256-GCM para o Cofre Pessoal.
 *
 * Cada pessoa tem uma chave derivada do seu identificador e de um segredo mestre.
 * O conteúdo nunca é guardado em claro nem emitido em eventos de auditoria.
 */
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'node:crypto';

const SEGREDO_MESTRE = process.env.COFRE_SEGREDO_MESTRE ?? 'segredo-mestre-cofre-guimaraes-2035';

export interface ConteudoCifrado {
  iv: string; // hex
  tag: string; // hex
  dados: string; // hex
}

/**
 * Deriva uma chave de 256 bits para uma pessoa específica.
 */
export function derivarChavePessoa(pessoa: string): Buffer {
  return scryptSync(SEGREDO_MESTRE, `pessoa:${pessoa}`, 32);
}

/**
 * Cifra um objeto ou texto com AES-256-GCM.
 */
export function cifrarDados(dado: unknown, chave: Buffer): ConteudoCifrado {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', chave, iv);
  const texto = typeof dado === 'string' ? dado : JSON.stringify(dado);
  const enc = Buffer.concat([cipher.update(texto, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    dados: enc.toString('hex'),
  };
}

/**
 * Decifra dados com a chave fornecida e valida a autenticidade (tag GCM).
 */
export function decifrarDados<T = unknown>(cifrado: ConteudoCifrado, chave: Buffer): T {
  const iv = Buffer.from(cifrado.iv, 'hex');
  const tag = Buffer.from(cifrado.tag, 'hex');
  const dados = Buffer.from(cifrado.dados, 'hex');

  const decipher = createDecipheriv('aes-256-gcm', chave, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(dados), decipher.final()]);
  const texto = dec.toString('utf8');

  try {
    return JSON.parse(texto) as T;
  } catch {
    return texto as unknown as T;
  }
}
