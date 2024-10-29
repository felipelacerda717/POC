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
            'valor', 'preco', 'preço', 'custo', 'caro', 'barato', 
            'desconto', 'promocao', 'promoção', 'pagamento', 'parcelas',
            'orcamento', 'orçamento', 'investimento', 'financeiro',
            'quanto', 'custa', 'cobram', 'cobra'
        ],
        weight: 2  // Aumentando o peso para garantir prioridade
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
        const normalized = text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^\w\s]/g, ' '); // Remove caracteres especiais
        console.log('Texto normalizado:', normalized);
        return normalized;
    }

    private calculateCategoryScore(text: string, category: KeywordCategory): number {
        let score = 0;
        const normalizedText = this.normalizeText(text);
        
        category.keywords.forEach(keyword => {
            // Usar includes em vez de regex para maior flexibilidade
            if (normalizedText.includes(keyword)) {
                score += category.weight;
                console.log(`Palavra-chave encontrada: ${keyword} na categoria ${category.category}`);
            }
        });
    
        return score;
    }

    public analyzeMessage(message: string): AnalysisResult {
        // Inicializar objeto de categorias e pontuação total
        const categories: { [key: string]: number } = {};
        let totalScore = 0;
    
        // Calcular pontuação para cada categoria
        keywordCategories.forEach(category => {
            const score = this.calculateCategoryScore(message, category);
            categories[category.category] = score;
            totalScore += score;
        });

        console.log('Pontuações por categoria:', categories);

        // Filtrar e ordenar categorias ativas (com pontuação > 0)
        const activeCategories = Object.entries(categories)
    .filter(entry => entry[1] > 0)
    .sort((a, b) => b[1] - a[1]);

        // Determinar categoria dominante
        let dominantCategory = 'informação'; // Valor padrão

        if (activeCategories.length > 0) {
            dominantCategory = activeCategories[0][0];
        }

        // Calcular nível de confiança
        const confidence = totalScore > 0 ? 
            categories[dominantCategory] / totalScore : 0.5;

        // Retornar resultado da análise
        return {
            categories,
            dominantCategory,
            suggestedTemplates: defaultTemplates[dominantCategory] || defaultTemplates['informação'],
            confidence
        };
    }
}