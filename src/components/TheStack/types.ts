// MBRAS Academy - The Stack
// Type Definitions

export type LayerId = "signal" | "structure" | "control" | "scale";

export type StackState = "idle" | "hover" | "focus" | "transitioning";

export interface LayerData {
  id: LayerId;
  index: number;
  title: string;
  subtitle: string;
  description: string;
  topics: string[];
  module: string;
}

export interface LayerVisualProps {
  isActive: boolean;
  intensity: number;
}

export interface StackConfig {
  layerWidth: number;
  layerHeight: number;
  layerDepth: number;
  gapDefault: number;
  gapExpanded: number;
  rotationSpeed: number;
}

export interface LayerMaterialConfig {
  color: string;
  metalness: number;
  roughness: number;
  transmission: number;
  thickness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  emissive: string;
  emissiveIntensityIdle: number;
  emissiveIntensityHover: number;
}

export const LAYERS: LayerData[] = [
  {
    id: "signal",
    index: 0,
    title: "Fundamentos de IA",
    subtitle: "O que a IA pode (e não pode) fazer pelo seu negócio",
    description:
      "Base tecnológica para profissionais de vendas de alto padrão.",
    module: "Módulo 1",
    topics: [
      "Ferramentas de IA generativa para comunicação",
      "Criação de conteúdo personalizado em escala",
      "Análise de perfil de cliente com auxílio de IA",
      "Stack recomendado: Claude, ChatGPT, HubSpot",
    ],
  },
  {
    id: "structure",
    index: 1,
    title: "Qualificação de Leads",
    subtitle: "Sistemas de scoring e priorização inteligente",
    description:
      "Identificação de sinais de intenção e priorização de carteira.",
    module: "Módulo 2",
    topics: [
      "Scoring automatizado de leads",
      "Sinais de intenção de compra",
      "Priorização baseada em dados",
      "Integração CRM + ferramentas de IA",
    ],
  },
  {
    id: "control",
    index: 2,
    title: "Automação",
    subtitle: "Escalar atendimento premium sem perder personalização",
    description: "Fluxos automatizados e produtividade potencializada por IA.",
    module: "Módulo 5",
    topics: [
      "Workflows automatizados (Make, n8n)",
      "Follow-up inteligente e cadências",
      "Gestão de tempo e priorização",
      "Governança de CRM e dados",
    ],
  },
  {
    id: "scale",
    index: 3,
    title: "Valuation & Mercado",
    subtitle: "Argumentação comercial baseada em evidências",
    description: "Análise de dados em larga escala e posicionamento de preço.",
    module: "Módulo 6",
    topics: [
      "Fundamentos de valuation imobiliário",
      "300M+ registros processados (IBVI)",
      "Comparáveis, tendências, liquidez",
      "Credibilidade técnica como diferencial",
    ],
  },
];

export const STACK_CONFIG: StackConfig = {
  layerWidth: 2,
  layerHeight: 0.8,
  layerDepth: 1.5,
  gapDefault: 1.1,
  gapExpanded: 1.4,
  rotationSpeed: 0.001,
};

export const MATERIAL_CONFIG: LayerMaterialConfig = {
  color: "#0F111A",
  metalness: 0.1,
  roughness: 0.8,
  transmission: 0.3,
  thickness: 0.5,
  clearcoat: 0.1,
  clearcoatRoughness: 0.4,
  emissive: "#00F2FF",
  emissiveIntensityIdle: 0.02,
  emissiveIntensityHover: 0.08,
};

export const COLORS = {
  // MBRAS Brand Colors
  absoluteBlack: "#000000",
  onyx: "#0a0a0f",
  richBlack: "#050508",

  // Primary - Navy Blue
  navyBlue: "#1a3a5c",
  navyLight: "#2a4a6c",
  navyDark: "#0f2a4c",

  // Accent - Gold
  gold: "#d4af37",
  goldLight: "#e8c547",
  goldDark: "#b89830",

  // Text
  titaniumWhite: "#f4f4f4",
  platinum: "#e8e8e8",
  silver: "#a8a8a8",

  // Legacy (for compatibility)
  signalCyan: "#d4af37", // Now gold
  deepAmber: "#1a3a5c", // Now navy
} as const;
