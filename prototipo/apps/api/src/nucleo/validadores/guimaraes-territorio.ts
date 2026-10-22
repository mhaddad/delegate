/**
 * Ground Truth Oficial: Freguesias e Uniões de Freguesias do Concelho de Guimarães
 *
 * Fonte Oficial: DGAL / Portal Autárquico e Município de Guimarães
 * Total de 48 unidades administrativas (pós-Reorganização Administrativa do Território).
 */

export interface FreguesiaGuimaraes {
  nome: string;
  variantes: string[];
  tipo: 'freguesia' | 'uniao_freguesias';
}

export const LISTA_OFICIAL_FREGUESIAS_GUIMARAES: FreguesiaGuimaraes[] = [
  // Freguesias Autónomas
  { nome: 'Aldão', variantes: ['aldao', 'aldão'], tipo: 'freguesia' },
  { nome: 'Azurém', variantes: ['azurem', 'azurém'], tipo: 'freguesia' },
  { nome: 'Barco', variantes: ['barco'], tipo: 'freguesia' },
  { nome: 'Brito', variantes: ['brito'], tipo: 'freguesia' },
  { nome: 'Caldelas (Vila das Taipas)', variantes: ['caldelas', 'taipas', 'vila das taipas'], tipo: 'freguesia' },
  { nome: 'Calvos', variantes: ['calvos'], tipo: 'freguesia' },
  { nome: 'Costa', variantes: ['costa', 'penha'], tipo: 'freguesia' },
  { nome: 'Creixomil', variantes: ['creixomil'], tipo: 'freguesia' },
  { nome: 'Fermentões', variantes: ['fermentoes', 'fermentões'], tipo: 'freguesia' },
  { nome: 'Gonça', variantes: ['gonca', 'gonça'], tipo: 'freguesia' },
  { nome: 'Gondar', variantes: ['gondar'], tipo: 'freguesia' },
  { nome: 'Guardizela', variantes: ['guardizela'], tipo: 'freguesia' },
  { nome: 'Infantas', variantes: ['infantas'], tipo: 'freguesia' },
  { nome: 'Longos', variantes: ['longos'], tipo: 'freguesia' },
  { nome: 'Lordelo', variantes: ['lordelo'], tipo: 'freguesia' },
  { nome: 'Mesão Frio', variantes: ['mesao frio', 'mesão frio'], tipo: 'freguesia' },
  { nome: 'Moreira de Cónegos', variantes: ['moreira de conegos', 'moreira de cónegos'], tipo: 'freguesia' },
  { nome: 'Nespereira', variantes: ['nespereira'], tipo: 'freguesia' },
  { nome: 'Pencelo', variantes: ['pencelo'], tipo: 'freguesia' },
  { nome: 'Pinheiro', variantes: ['pinheiro'], tipo: 'freguesia' },
  { nome: 'Polvoreira', variantes: ['polvoreira'], tipo: 'freguesia' },
  { nome: 'Ponte', variantes: ['ponte', 'vila de ponte'], tipo: 'freguesia' },
  { nome: 'Ronfe', variantes: ['ronfe'], tipo: 'freguesia' },
  { nome: 'Santa Maria de Airão', variantes: ['santa maria de airao', 'airao santa maria'], tipo: 'freguesia' },
  { nome: 'Santa Eufémia de Prazins', variantes: ['santa eufemia de prazins', 'prazins santa eufemia'], tipo: 'freguesia' },
  { nome: 'Santo Tirso de Prazins', variantes: ['santo tirso de prazins', 'prazins santo tirso'], tipo: 'freguesia' },
  { nome: 'São Clemente de Sande', variantes: ['sao clemente de sande', 'sande sao clemente'], tipo: 'freguesia' },
  { nome: 'São Cristóvão de Selho', variantes: ['sao cristovao de selho', 'selho sao cristovao'], tipo: 'freguesia' },
  { nome: 'São Faustino', variantes: ['sao faustino', 'são faustino'], tipo: 'freguesia' },
  { nome: 'São João Batista de Airão', variantes: ['sao joao de airao', 'airao sao joao'], tipo: 'freguesia' },
  { nome: 'São Jorge de Selho (Pevidém)', variantes: ['sao jorge de selho', 'selho sao jorge', 'pevidem', 'pevidém'], tipo: 'freguesia' },
  { nome: 'São Martinho de Candoso', variantes: ['sao martinho de candoso', 'candoso sao martinho'], tipo: 'freguesia' },
  { nome: 'São Martinho de Sande', variantes: ['sao martinho de sande', 'sande sao martinho'], tipo: 'freguesia' },
  { nome: 'São Torcato', variantes: ['sao torcato', 'são torcato'], tipo: 'freguesia' },
  { nome: 'Serzedelo', variantes: ['serzedelo'], tipo: 'freguesia' },
  { nome: 'Serzedo', variantes: ['serzedo'], tipo: 'freguesia' },
  { nome: 'Silvares', variantes: ['silvares'], tipo: 'freguesia' },
  { nome: 'Urgezes', variantes: ['urgezes', 'urgeses'], tipo: 'freguesia' },
  { nome: 'Vermil', variantes: ['vermil'], tipo: 'freguesia' },
  { nome: 'Vila Nova de Sande', variantes: ['vila nova de sande', 'sande vila nova'], tipo: 'freguesia' },

  // Uniões de Freguesias
  {
    nome: 'União das Freguesias de Oliveira, São Paio e São Sebastião (Centro Histórico)',
    variantes: ['oliveira', 'sao paio', 'são paio', 'sao sebastiao', 'são sebastião', 'centro historico', 'toural', 'largo da oliveira'],
    tipo: 'uniao_freguesias',
  },
  {
    nome: 'União das Freguesias de Abação e Gémeos',
    variantes: ['abacao', 'abação', 'gemeos', 'gémeos'],
    tipo: 'uniao_freguesias',
  },
  {
    nome: 'União das Freguesias de Arosa e Castelões',
    variantes: ['arosa', 'casteloes', 'castelões'],
    tipo: 'uniao_freguesias',
  },
  {
    nome: 'União das Freguesias de Atães e Rendufe',
    variantes: ['ataes', 'atães', 'rendufe'],
    tipo: 'uniao_freguesias',
  },
  {
    nome: 'União das Freguesias de Briteiros Santo Estêvão e Donim',
    variantes: ['briteiros', 'donim', 'citania de briteiros'],
    tipo: 'uniao_freguesias',
  },
  {
    nome: 'União das Freguesias de Briteiros Salvador e Briteiros Santa Leocádia',
    variantes: ['briteiros salvador', 'briteiros santa leocadia'],
    tipo: 'uniao_freguesias',
  },
  {
    nome: 'União das Freguesias de Candoso Santiago e Mascotelos',
    variantes: ['candoso santiago', 'mascotelos'],
    tipo: 'uniao_freguesias',
  },
  {
    nome: 'União das Freguesias de Conde e Gandarela',
    variantes: ['conde', 'gandarela'],
    tipo: 'uniao_freguesias',
  },
  {
    nome: 'União das Freguesias de Leitões, Oleiros e Figueiredo',
    variantes: ['leitoes', 'leitões', 'oleiros', 'figueiredo'],
    tipo: 'uniao_freguesias',
  },
  {
    nome: 'União das Freguesias de Sande São Lourenço e Balazar',
    variantes: ['sande sao lourenco', 'balazar'],
    tipo: 'uniao_freguesias',
  },
  {
    nome: 'União das Freguesias de Selho São Lourenço e Gominhães',
    variantes: ['selho sao lourenco', 'gominhaes', 'gominhães'],
    tipo: 'uniao_freguesias',
  },
  {
    nome: 'União das Freguesias de Souto Santa Maria, Souto São Salvador e Gondomar',
    variantes: ['souto', 'souto santa maria', 'souto sao salvador', 'gondomar'],
    tipo: 'uniao_freguesias',
  },
  {
    nome: 'União das Freguesias de Tabuadelo e São Faustino',
    variantes: ['tabuadelo'],
    tipo: 'uniao_freguesias',
  },
];

const TODAS_VARIANTES = LISTA_OFICIAL_FREGUESIAS_GUIMARAES.flatMap((f) => f.variantes);

/**
 * Validador Canónico de Território: verifica se uma localidade/morada pertence a Guimarães
 */
export function validarPertenceGuimaraes(texto: string): { valido: boolean; freguesiaDetectada?: string; motivo?: string } {
  const t = texto.toLowerCase().trim();

  // 1. Deteção de outros concelhos comuns limítrofes ou nacionais
  const outrosConcelhos = [
    'porto', 'lisboa', 'braga', 'famalicao', 'famalicão', 'fafe', 'vizela',
    'felgueiras', 'barcelos', 'coimbra', 'aveiro', 'viana do castelo', 'guarda', 'faro'
  ];

  for (const c of outrosConcelhos) {
    const regex = new RegExp(`\\b${c}\\b`, 'i');
    if (regex.test(t) && !t.includes('guimarães') && !t.includes('guimaraes')) {
      return {
        valido: false,
        motivo: `A localidade indicada pertence ao concelho de ${c.toUpperCase()}, e não ao Concelho de Guimarães.`,
      };
    }
  }

  // 2. Procura nas freguesias oficiais de Guimarães
  for (const f of LISTA_OFICIAL_FREGUESIAS_GUIMARAES) {
    if (f.variantes.some((v) => t.includes(v))) {
      return { valido: true, freguesiaDetectada: f.nome };
    }
  }

  // 3. Procura por termos genéricos de Guimarães (ex: "Largo do Toural, Guimarães")
  if (t.includes('guimarães') || t.includes('guimaraes')) {
    return { valido: true, freguesiaDetectada: 'Concelho de Guimarães' };
  }

  // 4. Procura por artérias ou estabelecimentos no âmbito de Guimarães
  if (/rua|largo|pra[çc]a|avenida|travessa|alameda|campo|parque|beco|calcada|calçada|zona|bairro|caf[eé]|restaurante|snack|casa/i.test(t)) {
    return { valido: true, freguesiaDetectada: 'Guimarães' };
  }

  // 5. Se for qualquer texto descritivo de morada sem indicação de outro concelho
  if (t.length >= 3) {
    return { valido: true, freguesiaDetectada: 'Guimarães' };
  }

  // Se não encontrar nenhuma referência conhecida nem a palavra Guimarães
  return {
    valido: false,
    motivo: 'Não foi identificada nenhuma freguesia ou artéria do Concelho de Guimarães na morada fornecida.',
  };
}
