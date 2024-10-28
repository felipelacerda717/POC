// src/services/messageAnalyzer.ts

export interface AnalysisResult {
    categories: {
        [key: string]: number;
    };
    dominantCategory: string;
    suggestedTemplates: string[];
    confidence: number;
}

interface KeywordCategory {
    category: string;
    keywords: string[];
    weight: number;
}

const keywordCategories: KeywordCategory[] = [
    {
        category: 'preço',
        keywords: [
            'valor', 'preço', 'custo', 'caro', 'barato', 
            'desconto', 'promoção', 'pagamento', 'parcelas',
            'orçamento', 'investimento'
        ],
        weight: 1
    },
    {
        category: 'urgência',
        keywords: [
            'urgente', 'emergência', 'dor', 'agora', 
            'imediato', 'hoje', 'rápido', 'socorro',
            'grave', 'urgência'
        ],
        weight: 2
    },
    {
        category: 'informação',
        keywords: [
            'dúvida', 'como', 'informação', 'funciona', 
            'explicar', 'saber', 'conhecer', 'procedimento',
            'tratamento', 'consulta'
        ],
        weight: 1
    }
];

const defaultTemplates: { [key: string]: string[] } = {
    'preço': [
        "Entendo sua preocupação com os valores. Nossa clínica oferece diversas opções de pagamento e parcelamento. Podemos agendar uma avaliação gratuita para discutir o melhor plano para você?",
        "Trabalhamos com preços competitivos e várias formas de pagamento. Que tal agendarmos uma avaliação sem compromisso para discutirmos as melhores opções para seu caso?"
    ],
    'urgência': [
        "Compreendo a urgência da sua situação. Temos horários disponíveis para emergências. Poderia me dizer mais sobre o que está sentindo?",
        "Nossa clínica está preparada para atendimentos de urgência. Vou priorizar seu caso. Pode me dar mais detalhes sobre o que está acontecendo?"
    ],
    'informação': [
        "Claro! Ficarei feliz em esclarecer suas dúvidas sobre nossos tratamentos. Qual procedimento específico você gostaria de conhecer melhor?",
        "Posso te explicar detalhadamente sobre nossos procedimentos. Qual aspecto específico você gostaria de entender melhor?"
    ]
};

export class MessageAnalyzer {
    private normalizeText(text: string): string {
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^\w\s]/g, ' '); // Remove caracteres especiais
    }

    private calculateCategoryScore(text: string, category: KeywordCategory): number {
        let score = 0;
        const normalizedText = this.normalizeText(text);
        
        category.keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            const matches = normalizedText.match(regex);
            if (matches) {
                score += matches.length * category.weight;
            }
        });

        return score;
    }

    public analyzeMessage(message: string): AnalysisResult {
        const categories: { [key: string]: number } = {};
        let totalScore = 0;

        // Calcular pontuação para cada categoria
        keywordCategories.forEach(category => {
            const score = this.calculateCategoryScore(message, category);
            categories[category.category] = score;
            totalScore += score;
        });

        // Encontrar categoria dominante
        let dominantCategory = Object.entries(categories)
            .reduce((a, b) => a[1] > b[1] ? a : b)[0];

        // Se não houver categoria dominante clara, usar 'informação' como padrão
        if (totalScore === 0) {
            dominantCategory = 'informação';
        }

        // Calcular confiança (normalizada entre 0 e 1)
        const confidence = totalScore > 0 ? 
            categories[dominantCategory] / totalScore : 0.5;

        return {
            categories,
            dominantCategory,
            suggestedTemplates: defaultTemplates[dominantCategory] || defaultTemplates['informação'],
            confidence
        };
    }
}